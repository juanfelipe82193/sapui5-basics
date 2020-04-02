// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/MessagePopover",
    "sap/m/MessageItem",
    "./BaseController",
    "./Page",
    "./TileSelector",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/library",
    "sap/m/MessageToast",
    "sap/base/Log",
    "./ConfirmChangesDialog.controller"
], function (
    MessagePopover,
    MessageItem,
    BaseController,
    Page,
    TileSelector,
    Fragment,
    JSONModel,
    MessageBox,
    coreLibrary,
    MessageToast,
    Log,
    ConfirmChangesDialog
) {
    "use strict";

    /**
     * Convenience method to reset the page model
     *
     * @param {object} model Page model to be initialized
     * @property {object} model.page Page of the model
     * @property {boolean} model.edit Wheter the page is in edit mode
     * @property {array} model.errors The errors on the page
     * @property {array} model.warnings The warnings on the page
     * @property {array} model.messages The combined errors and warnings on the page
     * @property {boolean} model.headerExpanded Wheter the page header is expanded
     *
     * @private
     */
    function _resetModelData (model) {
        model.setData({
            page: {},
            edit: false,
            dirtyPage: false,
            errors: [],
            warnings: [],
            messages: [],
            headerExpanded: true,
            catalogsExpanded: true
        });
    }

    var oModel = new JSONModel();

    var Controller = BaseController.extend("sap.ushell.applications.PageComposer.controller.PageDetailEdit", {
        _setDirtyFlag: function (bValue) {
            sap.ushell.Container.setDirtyFlag(bValue);
            oModel.setProperty("/dirtyPage", bValue);
        },

        /**
         * Called when controller is initialized.
         *
         * @private
         */
        onInit: function () {
            var oLayoutContent = this.getView().byId("layoutContent"),
                oToggleCatalogsButton = this.getView().byId("toggleCatalogsButton"),
                oRouter = this.getRouter();
            oRouter.getRoute("edit").attachPatternMatched(this._onPageMatched, this);
            this.initModel();

            this.Page.init(this);
            this.TileSelector.init(this);
            this.TileSelector.setAddTileHandler(this.addVisualisationToSection.bind(this));

            this.getView().addEventDelegate({
                onBeforeHide: this.onRouteLeave.bind(this)
            });

            oLayoutContent.attachBreakpointChanged(function (oEvent) {
                // hides the "toggleCatalogsButton" when the TileSelector has not enough space to be rendered
                oToggleCatalogsButton.setVisible(oEvent.getParameters().currentBreakpoint !== "S");
            });
        },

        /**
         * Initializes the JSONModel
         *
         * @private
         */
        initModel: function () {
            oModel.setProperty = this.setModelProperty.bind(this);
            this.setModel(oModel);
        },

        /**
         * JSONModel change event does not work properly
         * @param {string} sPath The path of the property
         * @param {any} value The value to set it to
         * @param {object} context The context of the property
         *
         * @private
         */
        setModelProperty: function (sPath, value, context) {
            var sRootPath = context ? context.getPath() : sPath;
            if (sRootPath.indexOf("/page") === 0 && !jQuery.isEmptyObject(oModel.getProperty("/page"))) {
                this._setDirtyFlag(true);
            }
            JSONModel.prototype.setProperty.apply(oModel, arguments);
        },

        /**
         * Called when exiting the page detail view.
         *
         * @private
         */
        onExit: function () {
            this.Page.exit();
        },

        Page: Page,
        TileSelector: new TileSelector(),
        oTileInfoPopover: undefined,
        oMessagePopover: new MessagePopover("layoutMessagePopover", {
            items: {
                path: "/messages",
                template: new MessageItem({
                    type: "{type}",
                    title: "{title}",
                    activeTitle: "{active}",
                    description: "{description}",
                    subtitle: "{subTitle}",
                    counter: "{counter}"
                })
            },
            beforeOpen: function () { this.addStyleClass("sapUshellMessagePopoverNoResize"); }
        }).setModel(oModel),

        /**
         * Handles the message popover press in the footer bar.
         *
         * @param {sap.ui.base.Event} oEvent The press event.
         *
         * @private
         */
        handleMessagePopoverPress: function (oEvent) {
            this.oMessagePopover.toggle(oEvent.getSource());
        },

        /**
         * Called if the show/hide catalogs button is called.
         * Used to show or hide the side content.
         *
         * @private
         */
        onUpdateSideContentVisibility: function () {
            oModel.setProperty("/catalogsExpanded", !oModel.getProperty("/catalogsExpanded"));
        },

        /**
         * Called if the title is changed
         * If the title is empty, the valueState changes to ERROR
         *
         * @param {sap.ui.base.Event} oEvent The change event
         *
         * @private
         */
        onTitleChange: function (oEvent) {
            var oInput = oEvent.getSource();
            oInput.setValueStateText(this.getResourceBundle().getText("Message.EmptyTitle"));

            if (!oInput.getValue()) {
                oInput.setValueState(coreLibrary.ValueState.Error);
            } else {
                oInput.setValueState(coreLibrary.ValueState.None);
            }
        },

        /**
         * Called if the save button is pressed.
         * MessageToast will confirm that the changes have been successfully saved
         *
         * @private
         */
        onSave: function () {
            var oResourceBundle = this.getResourceBundle();
            var fnSave = function (sClickedAction) {
                if (sClickedAction === MessageBox.Action.OK) {
                    this._setDirtyFlag(false); // Disable the Save button immediately to prohibit users pressing it twice
                    this.getView().setBusy(true);
                    this._savePage(oModel.getProperty("/page")).then(function () {

                        MessageToast.show(oResourceBundle.getText("Message.SavedChanges"), {
                            closeOnBrowserNavigation: false
                        });
                    }).catch(function (oSimpleError) {
                        if (oSimpleError.statusCode === "412" || oSimpleError.statusCode === "400") {
                            this._showConfirmChangesDialog(oSimpleError);
                        } else {
                            this.showMessageBoxError(oSimpleError.message, false);
                        }
                        this._setDirtyFlag(true); // Restore the dirty flag in case of errors
                    }.bind(this)).finally(function () {
                        this.getView().setBusy(false);
                    }.bind(this));
                }
            }.bind(this);

            if (!oModel.getProperty("/page/content/title")) {
                this.showMessageBoxError(oResourceBundle.getText("Message.EmptyTitle"));
                oModel.setProperty("/headerExpanded", true);

                return;
            }

            if (!window.navigator.onLine) {
                this.showMessageBoxError(oResourceBundle.getText("Message.NoInternetConnection"));

                return;
            }

            if (oModel.getProperty("/errors").length > 0) {
                var sTitle = oResourceBundle.getText("Title.TilesHaveErrors"),
                    sMessage = oResourceBundle.getText("Message.TilesHaveErrors");
                sap.ushell.Container.getService("Message").confirm(sMessage, fnSave, sTitle);

                return;
            }

            fnSave(MessageBox.Action.OK);
        },

        _showConfirmChangesDialog: function (oSimpleError) {
            if (!this.byId("confirmChangesDialog")) {
                Fragment.load({
                    name: "sap.ushell.applications.PageComposer.view.ConfirmChangesDialog",
                    controller: new ConfirmChangesDialog(this.getView(), this.getResourceBundle())
                }).then(function (oDialog) {
                    if (oSimpleError.statusCode === "412") {
                        var oConfirmChangesModifiedByText = sap.ui.getCore().byId("confirmChangesModifiedByText");
                        oConfirmChangesModifiedByText.setVisible(true);
                    }

                    this.getModel().setProperty("/simpleError", {
                        message: oSimpleError.message,
                        statusCode: oSimpleError.statusCode,
                        modifiedBy: this.getModel().getProperty("/page").content.modifiedByFullname
                    });
                    this.getView().addDependent(oDialog);
                    oDialog.open();
                }.bind(this));
            } else {
                this.byId("confirmChangesDialog").open();
            }
        },


        /**
         * Called if the cancel button is pressed.
         * Navigates to the page overview without saving changes.
         *
         * @private
         */
        onCancel: function () {
            this.navigateToPageOverview();
        },

        /**
         * Intended to be called by the view for handling "open tile info" events.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         */
        onOpenTileInfo: function (oEvent) {
            var oEventSource = oEvent.getSource(),
                oBindingContext = oEventSource.getBindingContext();
            this._openTileInfo(oEventSource, oBindingContext);
        },

        /**
         * Shows the ContextSelector dialog.
         *
         * @param {function} onConfirm The function executed wehen confirming the selection.
         * @return {Promise<void>} A promise resolving when the dialog is shown
         * @protected
         */
        showContextSelector: function (onConfirm) {
            return new Promise(function (resolve, reject) {
                sap.ui.require([
                    "sap/ushell/applications/PageComposer/controller/ContextSelector.controller"
                ], function (ContextSelector) {
                    var sPageId = this.getModel().getProperty("/page/content/id");
                    this.fetchRoles(sPageId)
                        .then(function (roles) {
                            if (!this.oContextSelectorController) {
                                this.oContextSelectorController = new ContextSelector(
                                    this.getRootView(),
                                    this.getResourceBundle()
                                );
                            }
                            this.oContextSelectorController.initRoles(roles, this.getModel("roles").getData().activeRoleContext);
                            this.oContextSelectorController.attachConfirm(onConfirm);
                            return this.oContextSelectorController.load()
                                .then(function () {
                                    return this.oContextSelectorController;
                                }.bind(this))
                                .then(function (dialog) {
                                    if (dialog) {
                                        dialog.open();
                                    }
                                    resolve();
                                }).catch(function (error) {
                                    this.oContextSelectorController.destroy();
                                    this.handleBackendError(error);
                                    reject(error);
                                }.bind(this));
                        }.bind(this))
                        .catch(function (sErrorMsg) {
                            this.showMessageBoxError(sErrorMsg, false);
                        }.bind(this));
                }.bind(this));
            }.bind(this));
        },

        /**
         * Opens a dialog to select the role context for the page/space.
         *
         * @private
         */
        onOpenContextSelector: function () {
            this.showContextSelector(function (oSelectedRolesInfo) {
                this._resetRolesModel(oSelectedRolesInfo);
                this.TileSelector.setRoleContext(oSelectedRolesInfo.selected, oSelectedRolesInfo.allSelected);
                var sPageId = this.getModel().getProperty("/page/content/id");
                this.fetchCatalogInfo(sPageId, oSelectedRolesInfo.selected)
                    .then(this.TileSelector.initTiles)
                    .catch(function (sErrorMsg) {
                        this.showMessageBoxError(sErrorMsg, true);
                    });
                this.getModel("roles").setProperty("availableVisualizations", oSelectedRolesInfo.availableVisualizations);
                this.collectPageMessages();
            }.bind(this));
        },
        /**
         * @typedef {object} SelectedRoles Object with information about roles selected in the ContextSelector.
         * @property {string[]} selected An array of the IDs of the roles that are currently selected for the context.
         * @property {boolean} allSelected Whether all of the available roles are selected.
         */
        /**
         * (Re-)Sets the model used to persist the selection of the role context.
         * @param {SelectedRoles} [oSelectedRoles=undefined] Object with information about roles selected in the ContextSelector.
         * If undefined, an empty model will be set. This will happen e.g. when the edit view of a page is entered.
         * @private
         */
        _resetRolesModel: function (oSelectedRoles) {
            if (oSelectedRoles) {
                this.setModel(new JSONModel(oSelectedRoles), "roles");
            } else {
                this.setModel(new JSONModel({}), "roles");
            }
            this.getModel("roles").setProperty("/activeRoleContextInfo",
                "(" + this.getResourceBundle().getText("Message.AllRolesSelected") + ")");
        },

        /**
         * Opens the TileInfoPopover by the oOpenByControl argument using the oNewBindingContext argument as the new binding context.
         *
         * @param {sap.ui.core.Control} oOpenByControl The control to anchor the popover to.
         * @param {sap.ui.model.Context} oBindingContext The new binding context to be used for displaying the popover bound content.
         * @param {string} [sModelName] The model name to be used with the new binding context. If omitted, the default model is used.
         */
        _openTileInfo: function (oOpenByControl, oBindingContext, sModelName) {
            if (!this.oTileInfoPopover) {
                Fragment.load({
                    name: "sap.ushell.applications.PageComposer.view.TileInfoPopover",
                    controller: this
                }).then(function (oTileInfoPopover) {
                    this.oTileInfoPopover = oTileInfoPopover;
                    this.getView().addDependent(this.oTileInfoPopover);
                    this._openTileInfo(oOpenByControl, oBindingContext, sModelName);
                }.bind(this));
            } else {
                this.oTileInfoPopover.setModel(oBindingContext.getModel(sModelName));
                this.oTileInfoPopover.setBindingContext(oBindingContext);
                this.oTileInfoPopover.openBy(oOpenByControl);
            }
        },

        /**
         * Format the type of a visualization for displaying.
         *
         * @param {string} vizType The type of a visualization.
         * @returns {string} The translated type/category of a visualization.
         * @private
         */
        _formatTileType: function (vizType) {
            var i18n = this.getResourceBundle();
            switch (vizType) {
                case "STATIC": return i18n.getText("Title.StaticTile");
                case "DYNAMIC": return i18n.getText("Title.DynamicTile");
                case "CUSTOM":
                default: return i18n.getText("Title.CustomTile");
            }
        },

        /**
         * Formatter used for extracting the "length" property of an object.
         *
         * @param {object} object The object to have its "length" property retrieved from.
         * @returns {*} The "length" property of the object parameter or "undefined" if the object is falsy.
         * @private
         */
        _formatLength: function (object) {
            return (object ? object.length : undefined);
        },

        /**
         * Set the new transportId to the page object
         *
         * @param {sap.ui.base.Event} event The object containing the metadata
         *
         * @private
         */
        _updatePageWithMetadata: function (event) {
            if (event && event.metadata && event.metadata.transportId) {
                oModel.setProperty("/page/metadata/transportId", event.metadata.transportId);
            }
        },

        /**
         * Called if the route matched the pattern for the editing of a page.
         * Loads the page with the id given in the URL parameter.
         *
         * @param {sap.ui.base.Event} event The routing event
         *
         * @private
         */
        _onPageMatched: function (event) {
            var oArguments = event.getParameter("arguments");
            var sPageId = decodeURIComponent(oArguments.pageId);
            var sRole = this.getOwnerComponent().getRole();
            this.getView().setBusy(true);
            Log.info("The page with id " + sPageId + " was opened in edit mode in the context of the following role", sRole);

            _resetModelData(oModel);
            this._resetRolesModel();
            this._loadPage(sPageId).then(function (oPage) {
                this._pageEditAllowed(oPage).then(function (editAllowed) {
                    if (!editAllowed) {
                        return;
                    }

                    oModel.setProperty("/page", oPage);
                    oModel.setProperty("/edit", true);

                    this.checkShowEditDialog(
                        oPage,
                        this._updatePageWithMetadata.bind(this),
                        this.navigateToPageOverview.bind(this)
                    );

                    this.Page.init(this);

                    if (!oModel.getProperty("/page/content/sections").length) {
                        this.Page.addSection();
                    } else {
                        this.collectPageMessages();
                        this._setDirtyFlag(false);
                    }
                }.bind(this));
            }.bind(this)).catch(function () {
                this.navigateToErrorPage(sPageId);
            }.bind(this)).finally(function () {
                this.getView().setBusy(false);
            }.bind(this));
            this.fetchCatalogInfo(sPageId, [sRole])
                .then(this.TileSelector.initTiles)
                .catch(function (sErrorMsg) {
                    this.showMessageBoxError(sErrorMsg, true);
                }.bind(this));
        },

        /**
         * Checks if the user is allowed to edit the page.
         *
         * @param {object} page The page to edit.
         * @returns {Promise<boolean>} A promise which resolves to true/false depending on if editing is allowed for the user.
         * @private
         */
        _pageEditAllowed: function (page) {
            var bEditAllowed = !this.checkMasterLanguageMismatch(page) && !this._checkPageHasErrors(page);
            return Promise.resolve(bEditAllowed);
        },

        /**
         * Loads the page with the given pageId from the PagePersistence.
         *
         * @param {string} pageId The pageId to load
         * @returns {Promise<object>} A promise resolving to the page
         *
         * @private
         */
        _loadPage: function (pageId) {
            return Promise.all([
                sap.ushell.Container.getServiceAsync("VisualizationLoading"),
                this.getPageRepository().getPage(pageId)
            ]).then(function (promiseResults) {
                this.oVisualizationLoadingService = promiseResults[0];
                this.oVisualizationLoadingService.loadVisualizationData().then(function () {
                    oModel.updateBindings(true);
                    this.collectPageMessages();
                }.bind(this));
                return promiseResults[1];
            }.bind(this));
        },

        /**
         * Saves the page model using the PagePersistence service
         *
         * @param {object} page The page model to save
         * @returns {Promise<void>} A promise
         *
         * @private
         */
        _savePage: function (page) {
            return this.getPageRepository().updatePage(page);
        },

        /**
         * Collects errors and warnings that occured on the page.
         *
         * @private
         */
        collectPageMessages: function () {
            var oMessages = this.Page.collectMessages(),
                aErrors = oMessages.errors,
                aWarnings = oMessages.warnings,
                aMessages = aErrors.concat(aWarnings);

            oModel.setProperty("/errors", aErrors);
            oModel.setProperty("/warnings", aWarnings);
            oModel.setProperty("/messages", aMessages);
        },

        /* Section - Model API */

        /**
         * Adds a section to the model at the given index.
         *
         * @param {integer} sectionIndex The index of where to add the section in the array
         *
         * @protected
         */
        addSectionAt: function (sectionIndex) {
            var aSections = this.getModel().getProperty("/page/content/sections");

            if (!aSections) {
                Log.warning("The Model is not ready yet.");
                return;
            }

            if (!sectionIndex && sectionIndex !== 0) {
                sectionIndex = aSections.length;
            }
            aSections.splice(sectionIndex, 0, {
                title: "",
                visualizations: []
            });

            this.getModel().setProperty("/page/content/sections", aSections);
        },

        /**
         * Handles the deletion of a section using and updating the model
         *
         * @param {integer} sectionIndex The index of the section, that should be deleted
         *
         * @protected
         */
        deleteSection: function (sectionIndex) {
            if (!sectionIndex && sectionIndex !== 0) {
                return;
            }

            var aSections = oModel.getProperty("/page/content/sections");
            aSections.splice(sectionIndex, 1);
            oModel.setProperty("/page/content/sections", aSections);
            this.collectPageMessages();
        },

        /**
         * Handles the moving of a section using and updating the model
         *
         * @param {integer} originalSectionIndex The old index of the section, that should be moved
         * @param {integer} newSectionIndex The new index of the section, that should be moved
         *
         * @protected
         */
        moveSection: function (originalSectionIndex, newSectionIndex) {
            if (!originalSectionIndex && originalSectionIndex !== 0
                || !newSectionIndex && newSectionIndex !== 0) {
                return;
            }

            var aSections = oModel.getProperty("/page/content/sections"),
                oSectionToBeMoved = aSections.splice(originalSectionIndex, 1)[0];

            aSections.splice(newSectionIndex, 0, oSectionToBeMoved);
            oModel.setProperty("/page/content/sections", aSections);
            this.collectPageMessages();
        },

        /* Visualisation - Model API */

        /**
         * Handles the addition of a visualization to a section using and updating the model
         *
         * @param {string} visualizationData The visualization data of the visualization that should be added
         * @param {number[]} sectionIndices The indices of sections, the content should be added to
         * @param {integer} visualizationIndex The index, the visualization should be added at
         *
         * @protected
         */
        addVisualisationToSection: function (visualizationData, sectionIndices, visualizationIndex) {
            if (!visualizationData || !sectionIndices.length) {
                return;
            }

            sectionIndices.forEach(function (iSectionIndex) {
                var aVisualizations = oModel.getProperty("/page/content/sections/" + iSectionIndex + "/visualizations");

                if (!aVisualizations) {
                    Log.warning("The Model is not ready yet.");
                    return;
                }

                if (!visualizationIndex && visualizationIndex !== 0) {
                    visualizationIndex = aVisualizations.length;
                }

                aVisualizations.splice(visualizationIndex, 0, visualizationData);

                oModel.setProperty("/page/content/sections/" + iSectionIndex + "/visualizations", aVisualizations);

                this.collectPageMessages();
            }.bind(this));
        },

        /**
         * Handles the deletion of a visualization inside a section using and updating the model
         *
         * @param {integer} visualizationIndex The index of the visualization, that should be deleted
         * @param {integer} sectionIndex The index of the section, the visualization is in
         *
         * @protected
         */
        deleteVisualizationInSection: function (visualizationIndex, sectionIndex) {
            var sPath = "/page/content/sections/" + sectionIndex + "/visualizations",
                aVisualizations = oModel.getProperty(sPath);
            aVisualizations.splice(visualizationIndex, 1);
            oModel.setProperty(sPath, aVisualizations);
            this.collectPageMessages();
        },

        /**
         * Handles the movement of a visualization inside a section and between different sections,
         * using and updating the model
         *
         * @param {integer} originalVisualizationIndex The old index, where the visualization was from
         * @param {integer} newVisualizationIndex The new index, where the visualization should go
         * @param {integer} originalSectionIndex The index of the section, the visualization was in
         * @param {integer} newSectionIndex The index of the section, where the visualization should be added
         *
         * @protected
         */
        moveVisualizationInSection: function (originalVisualizationIndex, newVisualizationIndex, originalSectionIndex, newSectionIndex) {
            if (!originalVisualizationIndex && originalVisualizationIndex !== 0
                || !newVisualizationIndex && newVisualizationIndex !== 0
                || !originalSectionIndex && originalSectionIndex !== 0
                || !newSectionIndex && newSectionIndex !== 0) {
                return;
            }

            var sOriginalVisualizationPath = "/page/content/sections/" + originalSectionIndex + "/visualizations",
                sNewVisualizationPath = "/page/content/sections/" + newSectionIndex + "/visualizations",
                aOriginalVisualizations = oModel.getProperty(sOriginalVisualizationPath),
                aNewVisualizations = oModel.getProperty(sNewVisualizationPath),
                oContent = aOriginalVisualizations.splice(originalVisualizationIndex, 1);

            aNewVisualizations.splice(newVisualizationIndex, 0, oContent[0]);

            oModel.setProperty(sOriginalVisualizationPath, aOriginalVisualizations);
            oModel.setProperty(sNewVisualizationPath, aNewVisualizations);
            this.collectPageMessages();
        },

        /**
         * Instantiates and opens the dialog for editing the header
         */
        openEditPageHeaderDialog: function () {
            sap.ui.require([
                "sap/ushell/applications/PageComposer/controller/EditPageHeaderDialog.controller"
            ], function (EditPageHeaderDialogController) {
                if (!this.oEditPageHeaderDialogController) {
                    this.oEditPageHeaderDialogController = new EditPageHeaderDialogController(this.getRootView());
                }
                this.oEditPageHeaderDialogController.attachConfirm(this.editPageHeaderConfirm.bind(this));
                this.oEditPageHeaderDialogController.load().then(function () {
                    this.oEditPageHeaderDialogController.open();
                    this.oEditPageHeaderDialogController.getModel().setProperty("/id", oModel.getProperty("/page/content/id"));
                    this.oEditPageHeaderDialogController.getModel().setProperty("/title", oModel.getProperty("/page/content/title"));
                    this.oEditPageHeaderDialogController.getModel().setProperty(
                        "/description",
                        oModel.getProperty("/page/content/description")
                    );
                    this.oEditPageHeaderDialogController.initialTitleValidation();
                }.bind(this));
            }.bind(this));
        },

        /**
         * Persists the values from the Edit Page Header Dialog box
         * @param {object} oResults gets the changed values from the Edit Page header dialog
         */
        editPageHeaderConfirm: function (oResults) {
            if (oModel.getProperty("/page/content/title") !== oResults.title) {
                oModel.setProperty("/page/content/title", oResults.title);
            }
            if (oModel.getProperty("/page/content/description") !== oResults.description) {
                oModel.setProperty("/page/content/description", oResults.description || "");
            }
        },

        /**
         * Checks if the page has error messages.
         * Shows error message box when the page has errors and navigates to page overview.
         *
         * @param {object} oPage The page to check
         * @return {boolean} The result - true if there are errors, false if there is none
         * @private
         */
        _checkPageHasErrors: function (oPage) {
            var oFilteredErrorMsgByPageId = this.onfilterErrorMessages(oPage.content.id);
            if (oFilteredErrorMsgByPageId.length) {
                this.showMessageBoxWarning(oFilteredErrorMsgByPageId[0].message, true);
                return true;
            }
            return false;
        }

    });

    return Controller;
});
