//@ui5-bundle Component-preload.js
sap.ui.require.preload({
	"sap/ushell/applications/PageComposer/Component.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/UIComponent",
    "./controller/ErrorDialog",
    "sap/ui/model/json/JSONModel",
    "./util/PagePersistence"
], function (UIComponent, ErrorDialog, JSONModel, PagePersistence) {
    "use strict";

    return UIComponent.extend("sap.ushell.applications.PageComposer.Component", {
        metadata: { "manifest": "json" },
        _role: null,
        _oTransportPromise: null,

        /**
         * Initializes the component
         *
         * @protected
         */
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().initialize();

            var oComponentData = this.getComponentData();
            var oStartupParams = oComponentData && oComponentData.startupParameters;

            this._handleStartupParams(oStartupParams || {});

            this.getModel("PageRepository").setHeaders({
                "sap-language": sap.ushell.Container.getUser().getLanguage(),
                "sap-client": sap.ushell.Container.getLogonSystem().getClient()
            });

            this.setMetaModelData();

            // set message model
            this.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");

        },

        /**
         * Instantiates the page persistence utility and returns the created instance.
         *
         * @returns {sap.ushell.applications.PageComposer.util.PagePersistence} An instance of the page persistence utility.
         * @protected
         */
        getPageRepository: function () {
            if (!this.oPagePersistenceInstance) {
                this.oPagePersistenceInstance = new PagePersistence(
                    this.getModel("PageRepository"),
                    this.getModel("i18n").getResourceBundle(),
                    this.getModel("message")
                );
            }
            return this.oPagePersistenceInstance;
        },

        /**
         * Returns whether there is an entry for transport in the manifest entry sap.ui5/componentUsages
         * @returns {boolean} True if transport is supported / false if not
         */
        isTransportSupported: function () {
            var oManifestEntry = this.getManifestEntry("sap.ui5");
            return !!oManifestEntry.componentUsages &&
                !!oManifestEntry.componentUsages.transportInformation &&
                !!oManifestEntry.componentUsages.transportInformation.componentData &&
                oManifestEntry.componentUsages.transportInformation.componentData.supported;
        },

        /**
         * Saves the role in memory
         *
         * @param {string} role The role to save
         * @private
         */
        _saveRole: function (role) {
            this._sRole = role;
        },

        /**
         * Returns the saved role
         *
         * @returns {string} The role
         */
        getRole: function () {
            return this._sRole;
        },

        /**
         * Handles startup parameters for pageId, roleIds and mode
         * If there is a pageId set, navigate to that pageId in edit|view mode and append the roleIds as query param
         *
         * @param {object} startupParameters The parameters passed as startup params to the application via URL
         *
         * @private
         */
        _handleStartupParams: function (startupParameters) {
            var sPageId = startupParameters.pageId && startupParameters.pageId[0];
            var sRoleId = startupParameters.roleId && startupParameters.roleId[0];
            var sMode = startupParameters.mode && startupParameters.mode[0];

            this._saveRole(sRoleId);

            if (sPageId) {
                sMode = ["edit", "view"].indexOf(sMode) > -1 ? sMode : "view";
                this.getRouter().navTo(sMode, { pageId: encodeURIComponent(sPageId) }, true);
            }
        },

        /**
         * Shows an error dialog
         *
         * @param {object} oError The error object
         * @protected
         */
        showErrorDialog: function (oError) {
            ErrorDialog.open(oError, this.getModel("i18n"));
        },

        /**
         * Get the component defined in the metadata "componentUsages" property
         *
         * @param {string} [pagePackage] The page package name
         * @returns {Promise<sap.ui.core.Component>} Promise resolving to the component instance or void if
         * no component is declared
         * Rejected if transport is not supported
         * @protected
         */
        createTransportComponent: function (pagePackage) {
            if (this.isTransportSupported()) {
                if (!this._oTransportPromise) {
                    this._oTransportPromise = this.createComponent({
                        async: true,
                        usage: "transportInformation"
                    });
                }

                return this._oTransportPromise.then(function (transportComponent) {
                    transportComponent.reset({
                        "package": pagePackage
                    });
                    return transportComponent;
                });
            }

            return Promise.reject();
        },

        /**
         * set the function import information from metadata to a global model
         *
         * @protected
         */
        setMetaModelData: function () {
            this.getModel("PageRepository").getMetaModel().loaded().then(function () {
                var oMetaModel = this.getModel("PageRepository").getMetaModel();
                var oMetaModelData = {
                    copySupported: !!oMetaModel.getODataFunctionImport("copyPage"),
                    deleteSupported: !!oMetaModel.getODataFunctionImport("deletePage"),
                    createSupported: this.getMetadata().getConfig().enableCreate,
                    previewSupported: this.getMetadata().getConfig().enablePreview
                };
                this.setModel(new JSONModel(oMetaModelData), "SupportedOperationModel");
            }.bind(this));
        }
    });
});
},
	"sap/ushell/applications/PageComposer/controller/App.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("sap.ushell.applications.PageComposer.controller.App", {});
});
},
	"sap/ushell/applications/PageComposer/controller/BaseController.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "../util/Transport",
    "sap/m/MessageBox",
    "sap/base/Log"
], function (
    Controller,
    UIComponent,
    TransportHelper,
    MessageBox,
    Log
) {
    "use strict";

    return Controller.extend("sap.ushell.applications.PageComposer.controller.BaseController", {
        /**
         * Instantiates the page persistence utility and returns the created instance.
         *
         * @returns {sap.ushell.applications.PageComposer.util.PagePersistence} An instance of the page persistence utility.
         * @protected
         */
        getPageRepository: function () {
            return this.getOwnerComponent().getPageRepository();
        },

        /**
         * Convenience method for accessing the router.
         *
         * @returns {sap.ui.core.routing.Router} The router for this component.
         * @protected
         */
        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        /**
         * Convenience method for getting the view model by name.
         *
         * @param {string} [sName] The model name.
         * @returns {sap.ui.model.Model} The model instance.
         * @protected
         */
        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

        /**
         * Convenience method for setting the view model.
         *
         * @param {sap.ui.model.Model} oModel The model instance.
         * @param {string} [sName] The model name.
         * @returns {sap.ui.mvc.View} The view instance.
         * @protected
         */
        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        /**
         * Convenience method for getting the root view. Useful, for example, for dialogs.
         *
         * @returns {sap.ui.core.Control|sap.ui.core.mvc.View} The view control.
         * @protected
         */
        getRootView: function () {
            return this.getOwnerComponent().getRootControl();
        },

        /**
         * Getter for the resource bundle.
         *
         * @returns {sap.ui.model.resource.ResourceModel} The resource model of the component.
         * @protected
         */
        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        /**
         * Returns the transportHelper utility class
         *
         * @returns {object} The transportHelper instance
         */
        getTransportHelper: function () {
            if (!this.oTransportHelper) {
                this.oTransportHelper = new TransportHelper();
            }

            return this.oTransportHelper;
        },

        /**
         * Creates an edit dialog.
         *
         * @param {function} onConfirm The confirm function.
         * @param {function} onCancel Function to call when delete is cancelled.
         * @returns {Promise<object>} A promise resolving to the EditPage dialog controller.
         * @private
         */
        _createEditDialog: function (onConfirm, onCancel) {
            return new Promise(function (resolve) {
                sap.ui.require([
                    "sap/ushell/applications/PageComposer/controller/EditDialog.controller"
                ], function (EditPageDialogController) {
                    if (!this.oEditPageDialogController) {
                        this.oEditPageDialogController = new EditPageDialogController(
                            this.getRootView(),
                            this.getResourceBundle()
                        );
                    }
                    this.oEditPageDialogController.attachCancel(onCancel);
                    this.oEditPageDialogController.attachConfirm(onConfirm);
                    this.oEditPageDialogController.load().then(function () {
                        resolve(this.oEditPageDialogController);
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        },

        /**
         * Shows the create page dialog and enhances it with transport fields if required.
         *
         * @param {function} onConfirm Function to call when create is confirmed.
         * @param {function} onCancel Function to call when create is cancelled.
         * @protected
         */
        showCreateDialog: function (onConfirm, onCancel) {
            return new Promise(function (resolve, reject) {
                sap.ui.require([
                    "sap/ushell/applications/PageComposer/controller/CreatePageDialog.controller"
                ], function (CreatePageDialogController) {
                    if (!this.oCreatePageDialogController) {
                        this.oCreatePageDialogController = new CreatePageDialogController(
                            this.getRootView(),
                            this.getResourceBundle()
                        );
                    }
                    this.oCreatePageDialogController.attachConfirm(onConfirm);
                    this.oCreatePageDialogController.attachCancel(onCancel);
                    this.oCreatePageDialogController.load().then(function () {
                        if (this.getOwnerComponent().isTransportSupported()) {
                            return this.getOwnerComponent().createTransportComponent().then(function (oTransportComponent) {
                                return this.getTransportHelper().enhanceDialogWithTransport(
                                    this.oCreatePageDialogController,
                                    oTransportComponent,
                                    onConfirm
                                );
                            }.bind(this));
                        }
                        return this.oCreatePageDialogController;
                    }.bind(this)).then(function (oEnhancedDialog) {
                        if (oEnhancedDialog) {
                            oEnhancedDialog.open();
                        }
                        resolve();
                    }).catch(function (oError) {
                        this.oCreatePageDialogController.destroy();
                        this.handleBackendError(oError);
                        reject();
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        },

        /**
         * Shows the delete page dialog.
         *
         * @param {function} onConfirm Function to call when delete is confirmed.
         * @param {function} onCancel Function to call when delete is cancelled.
         * @returns {Promise<object>} A promise resolving to the delete dialog controller.
         * @private
         */
        _createDeleteDialog: function (onConfirm, onCancel) {
            return new Promise(function (resolve) {
                sap.ui.require([
                    "sap/ushell/applications/PageComposer/controller/DeleteDialog.controller"
                ], function (DeleteDialogController) {
                    if (!this.oDeletePageDialogController) {
                        this.oDeletePageDialogController = new DeleteDialogController(
                            this.getRootView(),
                            this.getResourceBundle()
                        );
                    }
                    this.oDeletePageDialogController.attachCancel(onCancel);
                    this.oDeletePageDialogController.attachConfirm(onConfirm);
                    this.oDeletePageDialogController.load().then(function () {
                        resolve(this.oDeletePageDialogController);
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        },

        /**
         * Checks if the edit dialog should be shown and creates the dialog if required.
         *
         * @param {object} page The page to edit.
         * @param {function} onConfirm The confirm function.
         * @param {function} onCancel Function to call when delete is cancelled.
         * @return {Promise<void>} A promise resolving when the dialog is shown
         * @protected
         */
        checkShowEditDialog: function (page, onConfirm, onCancel) {
            var fnError = this.handleBackendError.bind(this);

            if (!this.getOwnerComponent().isTransportSupported()) {
                return Promise.resolve();
            }
            return this.getOwnerComponent().createTransportComponent(page.metadata.devclass)
                .then(function (oTransportComponent) {
                    return Promise.all([
                        oTransportComponent.showTransport(page),
                        oTransportComponent.showLockedMessage(page)
                    ]).then(function (aResults) {
                        var bShowTransport = aResults[0];
                        var oLockedInformation = aResults[1];

                        if (oLockedInformation) {
                            this.showMessageBoxError(this.getResourceBundle().getText(
                                "EditDialog.LockedText",
                                [oLockedInformation.foreignOwner]
                            ), true);
                        } else if (bShowTransport) {
                            this._createEditDialog(onConfirm, onCancel).then(function (oDialog) {
                                oDialog.getModel().setProperty(
                                    "/message",
                                    this.getResourceBundle().getText("EditDialog.TransportRequired")
                                );
                                var oEnhancedDialog = this.getTransportHelper().enhanceDialogWithTransport(
                                    oDialog,
                                    oTransportComponent,
                                    onConfirm
                                );
                                oEnhancedDialog.open();
                            }.bind(this)).catch(fnError);
                        }
                    }.bind(this)).catch(fnError);
                }.bind(this)).catch(fnError);
        },

        /**
         * Shows the delete dialog and enhances the dialog with transport fields if required
         *
         * @param {object} page The page object.
         * @param {function} [onConfirm] The confirm function handler.
         * @param {function} [onCancel] The cancel function handler.
         * @return {Promise<void>} A promise resolving when the dialog is shown
         * @protected
         */
        checkShowDeleteDialog: function (page, onConfirm, onCancel) {
            var oResourceBundle = this.getResourceBundle();
            var fnError = this.handleBackendError.bind(this);

            if (!this.getOwnerComponent().isTransportSupported()) {
                return this._createDeleteDialog(onConfirm, onCancel).then(function (oDialog) {
                    oDialog.getModel().setProperty("/message", oResourceBundle.getText("DeleteDialog.Text"));
                    oDialog.open();
                });
            }
            return this.getOwnerComponent().createTransportComponent(page.metadata.devclass)
                .then(function (oTransportComponent) {
                    return Promise.all([
                        oTransportComponent.showTransport(page),
                        oTransportComponent.showLockedMessage(page)
                    ]).then(function (aResults) {
                        var bShowTransport = aResults[0];
                        var oLockedInformation = aResults[1];

                        if (oLockedInformation) {
                            this.showMessageBoxError(oResourceBundle.getText(
                                "DeleteDialog.LockedText",
                                [oLockedInformation.foreignOwner]
                            ), true);
                        } else {
                            this._createDeleteDialog(onConfirm, onCancel)
                                .then(function (oDialog) {
                                    oDialog.getModel().setProperty(
                                        "/message",
                                        oResourceBundle.getText("DeleteDialog.Text")
                                    );

                                    if (bShowTransport) {
                                        oDialog.getModel().setProperty(
                                            "/message",
                                            oResourceBundle.getText("DeleteDialog.TransportRequired")
                                        );
                                        oDialog = this.getTransportHelper().enhanceDialogWithTransport(
                                            oDialog,
                                            oTransportComponent,
                                            onConfirm
                                        );
                                    }
                                    oDialog.open();
                                }.bind(this)).catch(fnError);
                        }
                    }.bind(this)).catch(fnError);
                }.bind(this)).catch(fnError);
        },

        /**
         * Shows the copy page dialog and enhances it with transport fields if required.
         *
         * @param {function} oPage Page to copy.
         * @param {function} onConfirm Function to call when copy is confirmed.
         * @param {function} onCancel Function to call when copy is cancelled.
         * @return {Promise<void>} A promise resolving when the dialog is shown
         * @protected
         */
        showCopyDialog: function (oPage, onConfirm, onCancel) {
            return new Promise(function (resolve, reject) {
                sap.ui.require([
                    "sap/ushell/applications/PageComposer/controller/CopyPageDialog.controller"
                ], function (CopyPageDialogController) {
                    if (!this.oCopyPageDialogController) {
                        this.oCopyPageDialogController = new CopyPageDialogController(
                            this.getRootView(),
                            this.getResourceBundle()
                        );
                    }
                    this.oCopyPageDialogController.attachConfirm(onConfirm);
                    this.oCopyPageDialogController.attachCancel(onCancel);
                    return this.oCopyPageDialogController.load().then(function () {
                        if (this.getOwnerComponent().isTransportSupported()) {
                            return this.getOwnerComponent().createTransportComponent().then(function (transportComponent) {
                                return this.getTransportHelper().enhanceDialogWithTransport(
                                    this.oCopyPageDialogController,
                                    transportComponent,
                                    onConfirm
                                );
                            }.bind(this));
                        }
                        return this.oCopyPageDialogController;
                    }.bind(this)).then(function (enhancedDialog) {
                        if (enhancedDialog) {
                            enhancedDialog.open();
                            enhancedDialog.getModel().setProperty("/sourceId", oPage.content.id);
                            enhancedDialog.getModel().setProperty("/sourceTitle", oPage.content.title);
                        }
                        resolve();
                    }).catch(function (error) {
                        this.oCopyPageDialogController.destroy();
                        this.handleBackendError(error);
                        reject(error);
                    }.bind(this));
                }.bind(this));
            }.bind(this));

        },

        /**
         * Displays a MessageBox with an error message.
         *
         * @param {string} sErrorMsg The error message.
         * @param {boolean} [bNavToPageOverview] Indicates whether to navigate to the page overview after close.
         * @protected
         */
        showMessageBoxError: function (sErrorMsg, bNavToPageOverview) {
            if (bNavToPageOverview) {
                MessageBox.error(sErrorMsg, {
                    onClose: function () {
                        this.navigateToPageOverview();
                    }.bind(this)
                });
            } else {
                MessageBox.error(sErrorMsg);
            }
        },

        /**
         * Displays a MessageBox with an Warning message.
         *
         * @param {string} sWarningMsg The warning message.
         * @param {boolean} [bNavToPageOverview] Indicates whether to navigate to the page overview after close.
         * @protected
         */
        showMessageBoxWarning: function (sWarningMsg, bNavToPageOverview) {
            if (bNavToPageOverview) {
                MessageBox.warning(sWarningMsg, {
                    onClose: function () {
                        this.navigateToPageOverview();
                    }.bind(this)
                });
            } else {
                MessageBox.warning(sWarningMsg);
            }
        },

        /**
         * Navigates to the pageOverview page.
         *
         * @protected
         */
        navigateToPageOverview: function () {
            this.getRouter().navTo("overview");
        },

        /**
         * Navigates to the error page.
         *
         * @param {string} sPageId The error message.
         * @protected
         */
        navigateToErrorPage: function (sPageId) {
            this.getRouter().navTo("error", {
                pageId: encodeURIComponent(sPageId)
            }, null, true);
        },

        /**
         * Shows the preview of the page. It is a design-time preview without live data.
         *
         * @param {Object} oEvent The event containing the source button that opens the dialog.
         * @protected
         */
        preview: function (oEvent) {
            var oSource = oEvent.getSource();
            var sParentId = this.getRootView().getId();
            sap.ui.require([
                "sap/ushell/applications/PageComposer/controller/PagePreviewDialog.controller"
            ], function (PagePreviewDialogController) {
                PagePreviewDialogController.open(oSource, sParentId);
            });
        },

        /**
         * Checks if the page masterLanguage is the same as the logon language.
         * Shows error message box if false
         *
         * @param {object} page The page to check
         * @return {boolean} The result - true if there is a mismatch, false if there is none
         */
        checkMasterLanguageMismatch: function (page) {
            var bCheckLanguageMismatch = this.getOwnerComponent().getMetadata().getConfig().checkLanguageMismatch;
            var sUserLanguage = sap.ui.getCore().getConfiguration().getSAPLogonLanguage().toUpperCase();
            var sPageMasterLanguage = page.content.masterLanguage.toUpperCase();

            if (bCheckLanguageMismatch && sUserLanguage !== sPageMasterLanguage) {
                this.showMessageBoxError(this.getResourceBundle().getText(
                    "EditDialog.LanguageMismatch",
                    [
                        sPageMasterLanguage,
                        sUserLanguage
                    ]
                ), true);
                return true;
            }

            return false;
        },

        /**
         * Called if a backend error needs to be handled.
         *
         * @param {object} oError The error object.
         * @protected
         */
        handleBackendError: function (oError) {
            if (oError.responseText) {
                this.getOwnerComponent().showErrorDialog(oError);
            } else {
                Log.error(oError);
            }
        },

        /**
         * Cleanup when the route is left
         */
        onRouteLeave: function () {
            this.getPageRepository().abortPendingBackendRequests();
        },

        /**
         * @typedef {object} ContentCatalogs Contains the titles of each catalog,
         *      the tiles of each catalog and a map of vizIds to catalog tiles
         * @property {string} catalogTiles The catalog tiles in a catalog
         * @property {string} catalogTitles The catalog titles
         * @property {string} catalogTilesData A map from vizId to tile data
         */

        /**
         * Fetches the catalog information.
         * @param {string} pageId The page ID to scope the catalogs by.
         * @param {string[]} [aRoleIds] Ids of the roles by which to scope the catalogs, will override the scoping by page ID.
         * @returns {Promise<ContentCatalogs>} Contains the titles of each catalog,
         *          the tiles of each catalog and a map of vizIds to catalogtileData.
         * @private
         */
        fetchCatalogInfo: function (pageId, aRoleIds) {
            return Promise.all(this.getPageRepository().getCatalogs(pageId, aRoleIds))
                .then(function (aCatalogCollectionByRoles) {
                var aCatalogs = [],
                    aVisualizations = [],
                    mVisualizations = {},
                    aCatalogTitles = [],
                    aCatalogTiles = [],
                    oCatalog = {},
                    oVisualization = {};

                // for each role, there is an array of catalogs, concatenate all of these into one array
                aCatalogCollectionByRoles.forEach(function (catalogs) {
                    aCatalogs.push.apply(aCatalogs, catalogs);
                });

                for (var j = 0; j < aCatalogs.length; j++) {
                    oCatalog = aCatalogs[j];
                    aVisualizations = oCatalog.visualizations.results || [];

                    aCatalogTiles.push(aVisualizations);
                    aCatalogTitles.push(oCatalog.title);

                    for (var i = 0; i < aVisualizations.length; i++) {
                        oVisualization = aVisualizations[i];
                        // Remove __metadata to prevent tileSelector tree from rendering tile children
                        delete oVisualization.__metadata;
                        mVisualizations[aVisualizations[i].vizId] = aVisualizations[i];
                    }
                }

                return {
                    catalogTiles: aCatalogTiles,
                    catalogTitles: aCatalogTitles,
                    catalogTilesData: mVisualizations
                };
            }).catch(function (error) {
                this.handleBackendError(error);
                return {
                    catalogTiles: [],
                    catalogTitles: [],
                    catalogTilesData: {}
                };
            }.bind(this));
        },

        /**
         * @typedef {object} RoleObject Object expanded from the oData model containing role information.
         * @property {string} title Title of the role.
         * @property {string} name Name, i.e. the ID of the role.
         * @property {object} catalogs A deferred object to the page catalogs.
         * @property {object} __metadata The metadata for this role object.
         */
        /**
         * Fetches the roles of a page to set the context for e.g. the page preview
         * @param {string} pageId The ID of the desired page.
         * @returns {Promise<RoleObject[]>} Promise that will resolve to an array of role objects
         * @private
         */
        fetchRoles: function (pageId) {
            return this.getPageRepository().getRoles(pageId).then(function (roles) {
                return roles || [];
            }).catch(function (error) {
                this.handleBackendError(error);
                return [];
            }.bind(this));
        },

        /**
         * Returns filtered error messages.
         *
         * @param {string} sPageId The page Id to be filtered.
         * @returns {boolean} The result boolean.
         * @private
         */
        onfilterErrorMessages: function (sPageId) {
            function filterItems (arr, query) {
                return arr.filter(function (obj) {
                    return obj.target.toLowerCase().indexOf(query.toLowerCase()) !== -1;
                });
            }
            var oMessageModelData = this.getModel("message").getData();
            var errormessage = filterItems(oMessageModelData, "/pageSet('"+sPageId+"')");
            return errormessage;
        }
    });
});
},
	"sap/ushell/applications/PageComposer/controller/BaseDialog.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/library",
    "sap/base/util/merge",
    "./BaseController",
    "sap/ui/core/Fragment"
], function (
    coreLibrary,
    merge,
    BaseController,
    Fragment
) {
    "use strict";

    // shortcut for sap.ui.core.ValueState
    var ValueState = coreLibrary.ValueState;

    return BaseController.extend("sap.ushell.applications.PageComposer.controller.BaseDialog.controller", {
        /**
         * Destroys the control.
         *
         * @protected
         */
        destroy: function () {
            if (this._oView.byId(this.sViewId)) {
                this._oView.byId(this.sViewId).destroy();
            }
        },

        /**
         * Closes the dialog.
         *
         * @protected
         */
        onCancel: function () {
            this._oView.byId(this.sViewId).close();

            if (this._fnCancel) {
                this._fnCancel();
            }
        },

        /**
         * Attaches a confirm function which is called when dialog confirm button is pressed.
         *
         * @param {function} confirm The confirm function.
         * @protected
         */
        attachConfirm: function (confirm) {
            this._fnConfirm = confirm;
        },

        /**
         * Called when the user presses the confirm button.
         * Calls the attached confirm function if there is one.
         *
         * @param {sap.ui.base.Event} event The press event.
         * @protected
         */
        onConfirm: function (event) {
            if (this._fnConfirm) {
                this._fnConfirm(event);
            }
        },

        /**
         * Returns the model of this dialog instance.
         *
         * @returns {sap.ui.model.json.JSONModel} The JSONModel.
         * @protected
         */
        getModel: function () {
            return this._oModel;
        },

        /**
         * Returns "true" if all values of the given object are truthy.
         *
         * @param {object} validation The object whose properties values are booleans.
         * @returns {boolean} The validation result.
         * @private
         */
        validate: function (validation) {
            for (var i in validation) {
                if (!validation[i]) {
                    return false;
                }
            }
            return true;
        },

        /**
         * Attaches a cancel function which is called when dialog cancel button is pressed.
         *
         * @param {function} cancel The cancel function.
         * @protected
         */
        attachCancel: function (cancel) {
            this._fnCancel = cancel;
        },

        /**
         * Inserts the given component into the ComponentContainer control with id "transportContainer".
         *
         * @param {object} component The component to insert.
         * @protected
         */
        transportExtensionPoint: function (component) {
            this._oView.byId("transportContainer").setComponent(component);
        },

        /**
         * Loads the dialog fragment without displaying it.
         *
         * @returns {Promise<void>} Promise resolving when the fragment is loaded.
         * @protected
         */
        load: function () {
            var oFragmentLoadOptions = {
                id: this._oView.getId(),
                name: this.sId,
                controller: this
            };

            return Fragment.load(oFragmentLoadOptions).then(function (fragment) {
                fragment.setModel(this._oModel);
            }.bind(this));
        },

        /**
         * Shows the dialog.
         *
         * @protected
         */
        open: function () {
            var oDialog = this._oView.byId(this.sViewId);
            this._oView.addDependent(oDialog);

            oDialog.open();
        },

        /**
         * Pre-filters available packages by the page ID namespace.
         * If a namespace is detected in the page ID, it is then copied to the package input field if it is empty.
         * Does nothing if the package input field is not empty or if the dialog is not enhanced with transport information.
         *
         * @param {string} sPageID The page ID to check if it contains a namespace and extract it.
         * @param {boolean} [bFetchSuggestionOnly] If "true", will only fetch package suggestions;
         *   otherwise, will set the detected namespace into the package input field and trigger validations.
         */
        handlePackageNamespaceChange: function (sPageID, bFetchSuggestionOnly) {
            var oTransportComponent = this._oView.byId("transportContainer").getComponentInstance(),
                oPackageInput = oTransportComponent && oTransportComponent.getRootControl().byId("packageInput");
            if (oPackageInput && !oPackageInput.getValue().length) {
                var sPackageNamespace = sPageID.split("/"); sPackageNamespace.pop(); sPackageNamespace = sPackageNamespace.join("/");
                if (sPackageNamespace) {
                    if (bFetchSuggestionOnly) {
                        oPackageInput.fireLiveChange({ value: sPackageNamespace });
                    } else {
                        oPackageInput.setValue(sPackageNamespace);
                        oPackageInput.fireChange({ value: sPackageNamespace });
                    }
                }
            }
        },

        /**
         * Called on the live change event of the description field
         *
         * @param {sap.ui.base.Event} oEvent The livechange event
         */
        onDescriptionLiveChange: function (oEvent) {
            var oInput = oEvent.getSource(),
                oModel = this.getModel(),
                sInputValue = oInput.getValue(),
                bIsValid = !!sInputValue,
                oValidation = merge({}, oModel.getProperty("/validation"), { description: bIsValid }),
                sValueState = bIsValid ? ValueState.None : ValueState.Error;
            oModel.setProperty("/validation", oValidation);
            oInput.setValueState(sValueState);
        },

        /**
         * Called on the live change event of the title field
         *
         * @param {sap.ui.base.Event} oEvent The livechange event
         */
        onTitleLiveChange: function (oEvent) {
            var oInput = oEvent.getSource(),
                oModel = this.getModel(),
                sInputValue = oInput.getValue(),
                bIsValid = this.isValidTitle(sInputValue),
                oValidation = merge({}, oModel.getProperty("/validation"), { title: bIsValid }),
                sValueState = bIsValid ? ValueState.None : ValueState.Error;
            oModel.setProperty("/validation", oValidation);
            oInput.setValueState(sValueState);
        },

        /**
         * Called on the live change of the page ID.
         *
         * @param {sap.ui.base.Event} oEvent The change event.
         * @private
         */
        onPageIDLiveChange: function (oEvent) {
            var oInput = oEvent.getSource(),
                oModel = this.getModel(),
                sInputValue = oInput.getValue(),
                bIsValid = this.isValidID(sInputValue),
                oValidation = merge({}, oModel.getProperty("/validation"), { id: bIsValid }),
                sValueState = bIsValid ? ValueState.None : ValueState.Error;
            oModel.setProperty("/validation", oValidation);
            oInput.setValueState(sValueState);
            if (sInputValue.length > 0) {
                oInput.setValueStateText(this._oResourceBundle.getText("Message.InvalidPageID"));
            } else {
                oInput.setValueStateText(this._oResourceBundle.getText("Message.EmptyPageID"));
            }
            this.handlePackageNamespaceChange(sInputValue, true);
        },

        /**
         * Called on the change of the page ID.
         *
         * @param {sap.ui.base.Event} oEvent The change event.
         * @private
         */
        onPageIDChange: function (oEvent) {
            var sNewId = oEvent.getParameters().value;
            this.handlePackageNamespaceChange(sNewId, false);
        },

        /**
         * Returns "true" if the entered ID is valid, "false" otherwise.
         *
         * @param {string} id The ID to check its validity.
         * @returns {boolean} The result boolean.
         * @private
         */
        isValidID: function (id) {
            return /^[A-Z_/]{1}[A-Z0-9_/]{0,34}$/g.test(id);
        },

        /**
         * Returns "true" if the entered title is valid, "false" otherwise.
         *
         * @param {string} title The title to check its validity.
         * @returns {boolean} The result boolean.
         * @private
         */
        isValidTitle: function (title) {
            return /^.{1,100}$/g.test(title);
        }
    });
});
},
	"sap/ushell/applications/PageComposer/controller/ConfirmChangesDialog.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "./BaseDialog.controller"
], function (
    Fragment,
    JSONModel,
    MessageToast,
    BaseDialogController
) {
    "use strict";

    /**
     * @typedef {object} BackendError An error object sent from backend
     * @property {string} message The error message
     * @property {string} statusCode The HTML status code
     * @property {string} statusText The status text
     */
    return BaseDialogController.extend("sap.ushell.applications.PageComposer.controller.ConfirmChangesDialog.controller", {
        constructor: function (oView, oResourceBundle) {
            this._oView = oView;
            this._oResourceBundle = oResourceBundle;
            this.sViewId = "confirmChangesDialog";
            this.sId = "sap.ushell.applications.PageComposer.view.ConfirmChangesDialog";
        },

        /**
         * Destroy the dialog after each use.
         *
         * @param {sap.ui.base.Event} oEvent The closing event
         *
         * @private
         */
        onAfterClose: function (oEvent) {
            oEvent.getSource().destroy();
        },

        /**
         * Closes the dialog.
         *
         * @param {sap.ui.base.Event} oEvent The press event
         *
         * @private
         */
        onCancel: function (oEvent) {
            oEvent.getSource().getParent().close();
        },

        /**
         * Dismisses the changes
         *
         * @param {sap.ui.base.Event} oEvent The press event
         *
         * @private
         */
        onDismissChanges: function (oEvent) {
            var oController = this._oView.getController();
            oEvent.getSource().getParent().close();
            oController._setDirtyFlag(false);
            oController.getRouter().navTo("overview", null, null, true);
        },

        /**
         * Overwrites the changes on the DB
         * Deals with 2 cases
         *
         * 1. Pages exists but it is newer on DB, so a status code 412 is received.
         *    The new timestamp is fetched from DB and the pages is saved.
         * 2. Page has been deleted in the meanwhile status code 400 and the system recreates it.
         *
         * @param {sap.ui.base.Event} oEvent The press event
         * @return {Promise} The promise of the function
         *
         * @private
         */
        onOverwriteChanges: function (oEvent) {
            return new Promise(function (resolve, reject) {
                var oController = this._oView.getController();
                var oRepo = oController.getPageRepository();
                var oPage = this._oView.getModel().getProperty("/page");
                var oSimpleError = this._oView.getModel().getProperty("/simpleError");
                var sStatusCode = oSimpleError.statusCode;
                var that = this;

                oEvent.getSource().getParent().close();

                if (sStatusCode === "412") {
                    oRepo.getPage(oPage.content.id).then(function (oNewPage) {
                        oPage.content.modifiedOn = oNewPage.content.modifiedOn;
                        oRepo.updatePage(oPage).then(function () {
                            that._successfulSave(that._oResourceBundle);
                            resolve();
                        }).catch(function () {
                            oController.showMessageBoxError(that._oResourceBundle.getText("Message.UpdatePageError"), false);
                            resolve();
                        });
                    }).catch(function () {
                        oController.showMessageBoxError(that._oResourceBundle.getText("Message.LoadPageError"), false);
                        resolve();
                    });
                } else if (sStatusCode === "400") {
                    oRepo.createPage(oPage).then(function () {
                        that._successfulSave(that._oResourceBundle);
                        resolve();
                    }).catch(function () {
                        oController.showMessageBoxError(that._oResourceBundle.getText("Message.CreatePageError"), false);
                        resolve();
                    });
                } else {
                    reject();
                }
            }.bind(this));
        },

        /**
         * Shows a message toast and sets the dirty flag of the controller to false on a successful save
         *
         * @param {sap.base.i18n.ResourceBundle} oResourceBundle The translation bundle
         *
         * @private
         */
        _successfulSave: function (oResourceBundle) {
            var oController = this._oView.getController();
            MessageToast.show(oResourceBundle.getText("Message.SavedChanges"), {
                closeOnBrowserNavigation: false
            });
            oController._setDirtyFlag(false);
        }
    });
});
},
	"sap/ushell/applications/PageComposer/controller/ContextSelector.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "./BaseDialog.controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (
    JSONModel,
    BaseDialogController,
    Filter,
    FilterOperator
) {
    "use strict";

    var oList,
        oResourceBundle;

    return BaseDialogController.extend("sap.ushell.applications.PageComposer.controller.ContextSelector", {
        constructor: function (oView, oResources) {
            this._oView = oView;
            this.sViewId = "contextSelector";
            this.sId = "sap.ushell.applications.PageComposer.view.ContextSelector";
            oResourceBundle = oResources;
        },

        /**
         * Called when search for roles is executed.
         *
         * @param {sap.ui.base.Event} event The search event.
         */
        onSearch: function (event) {
            var oBinding = oList.getBinding("items");
            var sSearchValue = event.getSource().getValue() || "";

            oBinding.filter([
                new Filter([
                    new Filter("name", FilterOperator.Contains, sSearchValue),
                    new Filter("title", FilterOperator.Contains, sSearchValue)
                ], false)
            ]);

            if (oBinding.getLength() === 0) {
                if (sSearchValue) {
                    oList.setNoDataText(oResourceBundle.getText("Message.NoRolesFound"));
                } else {
                    oList.setNoDataText(oResourceBundle.getText("Message.NoRoles"));
                }
            }
        },

        /**
         * Called when the selection in the ContextSelector is changed.
         * It takes care of the validation of the ContextSelector and opens an error message if required.
         *
         * @private
         */
        onSelectionChange: function () {
            var aSelectedItems = oList.getSelectedContexts(true);
            this._oModel.setProperty("/validRoleSelection", aSelectedItems && !!aSelectedItems.length);
        },

        /**
         * Called when the "Select" button is clicked. Closes the dialog and writes the selection to a model.
         *
         * @private
         */
        onConfirm: function () {
            this._writeSelectionToModel();
            this._oView.byId(this.sViewId).close();
            var aSelectedRoles = this._oModel.getProperty("/selectedRoles");
            var aAvailableRoles = this._oModel.getProperty("/availableRoles");
            var aAvailableVisualizations = this._oModel.getProperty("/availableVisualizations");
            var oRoles = {
                selected: aSelectedRoles,
                allSelected: aSelectedRoles.length === aAvailableRoles.length,
                availableVisualizations: aAvailableVisualizations
            };
            if (this._fnConfirm) {
                this._fnConfirm(oRoles);
            }
        },

        /**
         * Called before the contextSelector opens.
         * Creates the validation model, defines variables for the list and registers fragment to message manager.
         *
         * @private
         */
        onBeforeOpen: function () {
            oList = this._oView.byId("contextSelectorList");
            this._setPreSelection();
            var oFragment = this._oView.byId("contextSelector");
            sap.ui.getCore().getMessageManager().registerObject(oFragment, true);
        },


        /**
         * Reads the selected roles from the list, writes the corresponding role IDs to a model,
         * stores an array of all available visualisations for the selected role context.
         *
         * @private
         */
        _writeSelectionToModel: function () {
            var aSelectedRoleIds = [];
            var aAvailableVisualisations = [];
            var aSelectedContexts = oList.getSelectedContexts(true);
            aSelectedContexts.forEach(function (context) {
                aSelectedRoleIds.push(context.getObject().name);
                context.getObject().catalogs.results.forEach(function (catalog) {
                    catalog.visualizations.results.forEach(function (visualization) {
                        aAvailableVisualisations.push(visualization.vizId);
                    });
                });
            });
            this._oModel.setProperty("/selectedRoles", aSelectedRoleIds);
            this._oModel.setProperty("/availableVisualizations", aAvailableVisualisations);
        },

        /**
         * Called before opening the dialog to pre-select roles.
         * If the RoleSelector was opened the first time, all roles should be selected. Otherwise the previous selection
         * should persist and be displayed accordingly.
         *
         * @private
         */
        _setPreSelection: function () {
            var aSelectedRoles = this._oModel.getProperty("/selectedRoles");
            if (!aSelectedRoles.length) {
                oList.selectAll();
            } else {
                oList.getItems().forEach(function (item) {
                   aSelectedRoles.forEach(function (selectedRole) {
                       if (item.getTitle() === selectedRole) {
                           item.setSelected(true);
                       }
                   });
                });
            }
            this._oModel.setProperty("/validRoleSelection", !!oList.getSelectedItems().length);
        },
        /**
         * @typedef {object} RoleObject Object expanded from the oData model containing role information.
         * @property {string} title Title of the role.
         * @property {string} name Name, i.e. the ID of the role.
         * @property {object} catalogs A deferred object to the page catalogs.
         * @property {object} __metadata The metadata for this role object.
         */
        /**
         * Loads the model containing the role context and validation.
         *
         * @param {RoleObject[]} aRoles An array of role objects
         * @param {string[]} [aSelectedRoles] An array IDs of selected roles
         *
         * @private
         */
        initRoles: function (aRoles, aSelectedRoles) {
            this._oModel = new JSONModel({
                availableRoles: aRoles,
                selectedRoles: aSelectedRoles || [],
                availableVisualizations: [],
                validRoleSelection: true,
                rolesAvailable: !!aRoles.length
            });
        }
    });
});
},
	"sap/ushell/applications/PageComposer/controller/CopyPageDialog.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "./BaseDialog.controller",
    "sap/base/util/merge"
], function (
    JSONModel,
    BaseDialogController,
    merge
) {
    "use strict";

    return BaseDialogController.extend("sap.ushell.applications.PageComposer.controller.CopyPageDialog", {
        constructor: function (oView, oResourceBundle) {
            this._oView = oView;
            this._oModel = new JSONModel({ validation: { id: false } });
            this.sViewId = "copyPageDialog";
            this.sId = "sap.ushell.applications.PageComposer.view.CopyPageDialog";
            this._oResourceBundle = oResourceBundle;
        },

        /**
         * Called if the save button is clicked.
         * Retrieves all values and calls the confirm handler if set.
         *
         * @private
         */
        onConfirm: function () {
            var oModel = this.getModel(),
                oResolvedResult = {
                    content: {
                        targetId: oModel.getProperty("/targetId"),
                        sourceId: oModel.getProperty("/sourceId"),
                        title: oModel.getProperty("/title"),
                        description: oModel.getProperty("/description")
                    },
                    metadata: {}
                };
            if (this._fnConfirm) {
                this._fnConfirm(oResolvedResult);
            }
        },

        /**
         * Resets all fields to their initial values. If there are other values in the validation path, keep them.
         *
         * @param {sap.ui.model.json.JSONModel} oModel The JSONModel instance to reset.
         * @private
         */
        _resetModel: function (oModel) {
            oModel.setProperty("/targetId", "");
            oModel.setProperty("/sourceId", "");
            oModel.setProperty("/title", "");
            oModel.setProperty("/description", "");
            var oValidation = merge({}, oModel.getProperty("/validation"), {
                id: false
            });
            oModel.setProperty("/validation", oValidation);
        },

        /**
         * Called before the CreatePageDialog opens.
         * Creates the validation model.
         *
         * @private
         */
        onBeforeOpen: function () {
            var oFragment = this._oView.byId("copyPageDialog");
            sap.ui.getCore().getMessageManager().registerObject(oFragment, true);
            this._resetModel(oFragment.getModel());
        }
    });
});
},
	"sap/ushell/applications/PageComposer/controller/CreatePageDialog.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "./BaseDialog.controller",
    "sap/base/util/merge"
], function (
    JSONModel,
    BaseDialogController,
    merge
) {
    "use strict";

    return BaseDialogController.extend("sap.ushell.applications.PageComposer.controller.CreatePageDialog", {
        constructor: function (oView, oResourceBundle) {
            this._oView = oView;
            this._oModel = new JSONModel({
                validation: {
                    id: false,
                    title: false,
                    description: false
                }
            });
            this._oResourceBundle = oResourceBundle;
            this.sViewId = "createPageDialog";
            this.sId = "sap.ushell.applications.PageComposer.view.CreatePageDialog";
        },

        /**
         * Called if the save button is clicked.
         * Retrieves all values and calls the confirm handler if set.
         *
         * @private
         */
        onConfirm: function () {
            var oModel = this.getModel(),
                oResolvedResult = {
                    content: {
                        id: oModel.getProperty("/id"),
                        title: oModel.getProperty("/title"),
                        description: oModel.getProperty("/description")
                    },
                    metadata: {}
                };
            if (this._fnConfirm) {
                this._fnConfirm(oResolvedResult);
            }
        },

        /**
         * Resets all fields to their initial values. If there are other values in the validation path, keep them.
         *
         * @param {sap.ui.model.json.JSONModel} oModel The JSONModel instance to reset.
         * @private
         */
        _resetModel: function (oModel) {
            oModel.setProperty("/id", "");
            oModel.setProperty("/title", "");
            oModel.setProperty("/description", "");
            var oValidation = merge({}, oModel.getProperty("/validation"), {
                id: false,
                title: false
            });
            oModel.setProperty("/validation", oValidation);
        },

        /**
         * Called before the CreatePageDialog opens.
         * Creates the validation model.
         *
         * @private
         */
        onBeforeOpen: function () {
            var oFragment = this._oView.byId("createPageDialog");
            sap.ui.getCore().getMessageManager().registerObject(oFragment, true);
            this._resetModel(oFragment.getModel());
        }
    });
});
},
	"sap/ushell/applications/PageComposer/controller/CustomString.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/model/SimpleType"
], function (SimpleType) {
    "use strict";

    return SimpleType.extend("sap.ushell.applications.PageComposer.controller.CustomString", {
        // called first, with the user's input
        parseValue: function (sValue) {
            return sValue.toUpperCase();
        },

        // called with "parseValue()" return value
        validateValue: function (sValue) {
            return undefined;
        },

        // called with "parseValue()" return value, returns what should be displayed
        formatValue: function (sValue) {
            return sValue;
        }
    });
});
},
	"sap/ushell/applications/PageComposer/controller/DeleteDialog.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/strings/formatMessage",
    "./BaseDialog.controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (
    formatMessage,
    BaseDialogController,
    Fragment,
    JSONModel
) {
    "use strict";

    return BaseDialogController.extend("sap.ushell.applications.PageComposer.controller.DeleteDialog.controller", {
        constructor: function (oView) {
            this._oView = oView;
            this._createOrResetModel();

            this.sViewId = "deletePageDialog";
            this.sId = "sap.ushell.applications.PageComposer.view.DeleteDialog";
        },
        /**
         * Create model or reset if it doesn't exist.
         *
         * @private
         */
        _createOrResetModel: function () {
            if (!this._oModel) {
                this._oModel = new JSONModel();
            }
            this._oModel.setData({
                title: "",
                message: "",
                validation: {}
            });
        },
        /**
         * Destroys the control
         *
         * @private
         */
        destroy: function () {
            this._createOrResetModel();
            BaseDialogController.prototype.destroy.apply(this, arguments);
        }
    });
});
},
	"sap/ushell/applications/PageComposer/controller/EditDialog.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/strings/formatMessage",
    "./BaseDialog.controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (
    formatMessage,
    BaseDialogController,
    Fragment,
    JSONModel
) {
    "use strict";

    return BaseDialogController.extend("sap.ushell.applications.PageComposer.controller.EditDialog.controller", {
        constructor: function (oView) {
            this._oView = oView;
            this._oModel = new JSONModel({
                title: "",
                message: "",
                validation: {}
            });

            this.sViewId = "editDialog";
            this.sId = "sap.ushell.applications.PageComposer.view.EditDialog";
        },

        /**
         * Called if the delete dialog is confirmed
         * Close the dialog
         * @protected
         */
        onConfirm: function () {
            this._oView.byId("editDialog").close();
            BaseDialogController.prototype.onConfirm.apply(this, arguments);
        }
    });
});
},
	"sap/ushell/applications/PageComposer/controller/EditPageHeaderDialog.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "./BaseDialog.controller",
    "sap/base/util/merge"
], function (
    JSONModel,
    BaseDialogController,
    merge
) {
    "use strict";

    return BaseDialogController.extend("sap.ushell.applications.PageComposer.controller.EditPageHeaderDialog", {
        constructor: function (oView) {
            this._oView = oView;
            this._oModel = new JSONModel({
                id: "",
                title: "",
                description: "",
                validation: {
                    title: false
                }
            });
            this.sViewId = "editPageHeaderDialog";
            this.sId = "sap.ushell.applications.PageComposer.view.EditPageHeaderDialog";
        },

        /**
         * Called if the save button is clicked.
         * Retrieves all values and calls the confirm handler if set.
         *
         * @private
         */
        onConfirm: function () {
            var oModel = this.getModel(),
                oResolvedResult = {
                        id: oModel.getProperty("/id"),
                        title: oModel.getProperty("/title"),
                        description: oModel.getProperty("/description")
                };
            if (this._fnConfirm) {
                this._fnConfirm(oResolvedResult);
                this._oView.byId("editPageHeaderDialog").close();
            }
        },

        /**
         * Resets all fields to their initial values. If there are other values in the validation path, keep them.
         *
         * @param {sap.ui.model.json.JSONModel} oModel The JSONModel instance to reset.
         * @private
         */
        _resetModel: function (oModel) {
            oModel.setProperty("/id", "");
            oModel.setProperty("/title", "");
            oModel.setProperty("/description", "");
            var oValidation = merge({}, oModel.getProperty("/validation"), {
                title: false
            });
            oModel.setProperty("/validation", oValidation);
        },

        /**
         * Validates if the title is valid when the dialog is loaded
         *
         * @private
         */
        initialTitleValidation: function () {
            var bIsValid = this.isValidTitle(this._oModel.getProperty("/title")),
             oValidation = merge({}, this._oModel.getProperty("/validation"), { title: bIsValid });
            this._oModel.setProperty("/validation", oValidation);
        },

        /**
         * Called before the EditPageHeaderDialog opens.
         * Creates the validation model and resource model.
         *
         * @private
         */
        onBeforeOpen: function () {
            var oFragment = this._oView.byId("editPageHeaderDialog");
            sap.ui.getCore().getMessageManager().registerObject(oFragment, true);
            this._resetModel(oFragment.getModel());
        }
    });
});
},
	"sap/ushell/applications/PageComposer/controller/ErrorDialog.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (
    Fragment,
    JSONModel,
    MessageToast
) {
    "use strict";

    /**
     * @typedef {object} BackendError An error object sent from backend
     * @property {string} message The error message
     * @property {string} statusCode The HTML status code
     * @property {string} statusText The status text
     */

    var oController = {

        /**
         * Destroy the dialog after each use.
         *
         * @param {sap.ui.base.Event} oEvent The closing event
         *
         * @private
        */
        onAfterClose: function (oEvent) {
            oEvent.getSource().destroy();
        },


        /**
         * Show error details.
         *
         * @param {sap.ui.base.Event} oEvent The press event
         *
         * @private
        */
        onShowDetails: function (oEvent) {
            oEvent.getSource().getModel().setProperty("/showDetails", true);
        },

        /**
         * Closes the dialog.
         *
         * @param {sap.ui.base.Event} oEvent The press event
         *
         * @private
        */
        onConfirm: function (oEvent) {
            oEvent.getSource().getParent().close(); // The parent of the button id the dialog
        },

        /**
         * Copies the error message to the clipboard.
         *
         * @param {sap.ui.base.Event} oEvent The press event
         *
         * @private
         */
        onCopy: function (oEvent) {
            var oTemporaryDomElement = document.createElement("textarea");
            try {
                oTemporaryDomElement.contentEditable = true;
                oTemporaryDomElement.readonly = false;
                oTemporaryDomElement.textContent = oEvent.getSource().getModel().getProperty("/description");
                document.documentElement.appendChild(oTemporaryDomElement);

                if (navigator.userAgent.match(/ipad|iphone/i)) {
                    var oRange = document.createRange();
                    oRange.selectNodeContents(oTemporaryDomElement);
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(oRange);
                    oTemporaryDomElement.setSelectionRange(0, 999999);
                } else {
                    jQuery(oTemporaryDomElement).select();
                }

                document.execCommand("copy");
                MessageToast.show(oEvent.getSource().getModel("i18n").getResourceBundle().getText("Message.ClipboardCopySuccess"), {
                    closeOnBrowserNavigation: false
                });
            } catch (oException) {
                MessageToast.show(oEvent.getSource().getModel("i18n").getResourceBundle().getText("Message.ClipboardCopyFail"), {
                    closeOnBrowserNavigation: false
                });
            } finally {
                jQuery(oTemporaryDomElement).remove();
            }
        }
    };

    /**
     * Load the fragment and open the dialog
     *
     * @param {BackendError} error The error object
     * @param {sap.ui.model.resource.ResourceModel} oI18nModel The translation model
     *
     * @protected
     */
    function open (error, oI18nModel) {
        var oResponse = JSON.parse(error.responseText);

        var oModel = new JSONModel({
            message: oResponse.error.message.value,
            description: JSON.stringify(oResponse, null, 3).replace(/\{|\}/g, ""),
            statusCode: error.statusCode,
            statusText: error.statusText,
            showDetails: false
        });
        Fragment.load({
            name: "sap.ushell.applications.PageComposer.view.ErrorDialog",
            controller: oController
        }).then(function (oDialog) {
            oDialog.setModel(oModel);
            oDialog.setModel(oI18nModel, "i18n");
            oDialog.open();
        });
    }

    return {open: open};
});
},
	"sap/ushell/applications/PageComposer/controller/ErrorPage.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "./BaseController"
], function (
    BaseController
) {
    "use strict";

    return BaseController.extend("sap.ushell.applications.PageComposer.controller.ErrorPage", {
        /**
         * Called when the user has pressed the Maintain Pages link.
         *
         * @private
         */
        onLinkPress: function () {
            this.getRouter().navTo("overview", null, null, true);
        }
    });
});
},
	"sap/ushell/applications/PageComposer/controller/Page.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/library",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Config",
    "sap/ushell/utils/clone"
], function (mobileLibrary, JSONModel, Config, fnClone) {
    "use strict";

    // shortcut for sap.m.LoadState
    var LoadState = mobileLibrary.LoadState;

    /**
     * @typedef {object} PageMessage An error or warning that occured on a page
     * @property {string} type The type of the message (i.e. error or warning)
     * @property {string} title The title of the message
     * @property {string} subtitle The subtitle of the message
     * @property {string} description The description of the message

    /**
     * @typedef {object} PageMessageCollection A collection of errors or warnings that occured on a page
     * @property {PageMessage[]} errors  Only the errors that occured on a page
     * @property {PageMessage[]} warnings Only the warnings that occured on a page
     */

    var oMainController,
        oPage,
        resources = {};

    var oViewSettingsModel = new JSONModel({
        sizeBehavior: Config.last("/core/home/sizeBehavior")
    });

    var _aDoableObject = Config.on("/core/home/sizeBehavior").do(function (sSizeBehavior) {
        oViewSettingsModel.setProperty("/sizeBehavior", sSizeBehavior);
    });

    /**
     * Returns the model relevant indices from the given visualization
     *
     * @param {sap.ushell.ui.launchpad.VizInstance} oVisualization The visualization that is inside of a model.
     * @return {object} The relevant indices of the model
     * @private
     */
    function _getModelDataFromVisualization (oVisualization) {
        var aPath = oVisualization.getBindingContext().getPath().split("/"),
            iVisualizationIndex = aPath.pop();

        aPath.pop();
        return {
            visualizationIndex: iVisualizationIndex,
            sectionIndex: aPath.pop()
        };
    }

    function _hasValidTarget (oVisualization) {
        var oContextInfo = oVisualization.getBindingContext(),
            sInboundPermanentKey = oContextInfo.getProperty(oContextInfo.getPath()).inboundPermanentKey,
            sTarget = oVisualization.getTarget();

        return sInboundPermanentKey || !sTarget || sTarget[0] !== "#";
    }

    /**
     * Returns the tile properties used for displaying the tile.
     * Should be used when instantiating a visualization using "localLoad" mode.
     * @see sap.ushell.services.VisualizationLoading#instantiateVisualization
     *
     * @param {object} tileData The tile properties.
     * @returns {object} The tile properties for usage in "VizInstance" "localLoad" mode.
     * @private
     */
    function _getTileProperties (tileData) {
        var oTileProperties = fnClone(tileData);

        // adjust service property name: "subTitle" -> "subtitle"
        if (oTileProperties.subTitle) {
            oTileProperties.subtitle = oTileProperties.subTitle;
            delete oTileProperties.subTitle;
        }
        // adjust service property name: "iconUrl" -> "icon"
        if (oTileProperties.iconUrl) {
            oTileProperties.icon = oTileProperties.iconUrl;
            delete oTileProperties.iconUrl;
        }

        // custom tile "info" placeholder (or any other type of tile)
        if (oTileProperties.tileType !== "STATIC" && oTileProperties.tileType !== "DYNAMIC" && !oTileProperties.info) {
            oTileProperties.info = "[" + resources.i18n.getText("Title.CustomTile") + "]";
        }

        return oTileProperties;
    }

    /**
     * Checks if a visualization is available in the set role context.
     *
     * @param {sap.ushell.ui.launchpad.VizInstance} visualization The Visualization to be checked against the visualizations in the context.
     * @return {boolean} Whether the given visualization is available in the context.
     * @private
     */
    function _availableInContext (visualization) {
        var oRolesModel = oMainController.getModel("roles");
        var aAvailableVisualizations = oRolesModel && oRolesModel.getData().availableVisualizations;

        return !aAvailableVisualizations || aAvailableVisualizations.indexOf(visualization.getVisualizationId()) > -1;
    }

    return {
        /**
         * Initializes the Page fragment logic
         *
         * @param {sap.ui.core.mvc.Controller} oController The controller that uses the Page fragment
         *
         * @protected
         */
        init: function (oController) {
            oMainController = oController;

            oPage = oController.getView().byId("page");
            oPage.setModel(oController.getModel());
            oPage.setModel(oViewSettingsModel, "viewSettings");

            resources.i18n = oController.getResourceBundle();

            var bEdit = oController.getModel().getProperty("/edit");
            oPage.toggleStyleClass("sapUshellPageComposing", !!bEdit);
        },

        exit: function () {
            _aDoableObject.off();
        },

        /**
         * Creates the visualizations inside of the sections.
         *
         * @param {string} sId The ID of the visualization.
         * @param {sap.ui.model.Context} oBindingContext The visualization binding context.
         * @returns {sap.ushell.ui.launchpad.VizInstance} A visualization inside of a section.
         *
         * @private
         */
        visualizationFactory: function (sId, oBindingContext) {
            if (!oMainController.oVisualizationLoadingService) {
                throw new Error("Visualization Service was not loaded yet!");
            }

            var oTileData = oBindingContext.getProperty(),
                oVisualization = oMainController.oVisualizationLoadingService.instantiateVisualization({
                    vizId: oTileData.vizId,
                    previewMode: true,
                    localLoad: true,
                    tileType: (oTileData.tileType === "DYNAMIC" ? "sap.ushell.ui.tile.DynamicTile" : "sap.ushell.ui.tile.StaticTile"),
                    properties: _getTileProperties(oTileData)
                }),
                GenericTileAction = {
                    Press: "Press",
                    Remove: "Remove"
                };

            oVisualization._getInnerControlPromise().then(function () {
                var oInnerControl = oVisualization.getInnerControl().getContent
                    ? oVisualization.getInnerControl().getContent()[0]
                    : oVisualization.getInnerControl();

                oInnerControl.attachPress(function (oEvent) {
                    switch (oEvent.getParameter("action")) {
                        case GenericTileAction.Remove:
                            var oModelData = _getModelDataFromVisualization(oVisualization);
                            oMainController.deleteVisualizationInSection(oModelData.visualizationIndex, oModelData.sectionIndex);
                            break;
                        case GenericTileAction.Press:
                        default:
                            oVisualization.fireEvent("press");
                            break;
                    }
                });

                // sizeBehavior for tiles: Small/Responsive
                oInnerControl.bindProperty("sizeBehavior", "viewSettings>/sizeBehavior");
                oInnerControl.setScope(oMainController.getModel().getProperty("/edit") ? "Actions" : "Display");

                if (oVisualization.getState() !== LoadState.Loading
                    && !_hasValidTarget(oVisualization)
                    && oInnerControl.setState) {
                    oInnerControl.setState(LoadState.Failed);
                }
            });

            oVisualization.attachPress(function (oEvent) {
                var oEventSource = oEvent.getSource(),
                    oBindingContext = oEventSource.getBindingContext();
                if (oPage.getProperty("edit")) {
                    oMainController._openTileInfo(oEventSource, oBindingContext);
                }
            });

            return oVisualization;
        },

        /**
         * Collects all errors and warnings that occured on the page.
         *
         * @returns {PageMessageCollection} A collection of errors or warnings that occured on the page.
         *
         * @protected
         */
        collectMessages: function () {
            var aErrors = [],
                aWarnings = [];

            oPage.getSections().forEach(function (oSection, iSectionIndex) {
                var oSectionTitle = oSection.byId("title-edit");
                if (oSection.getTitle() === "") {
                    oSectionTitle.setValueState("Warning");
                    oSectionTitle.setValueStateText(resources.i18n.getText("Message.InvalidSectionTitle"));
                    aWarnings.push({
                        type: "Warning",
                        title: resources.i18n.getText("Title.NoSectionTitle", iSectionIndex + 1),
                        description: resources.i18n.getText("Message.NoSectionTitle", iSectionIndex + 1)
                    });
                } else {
                    oSectionTitle.setValueState("None");
                }

                oSection.getVisualizations().forEach(function (oVisualization, iVisualizationIndex) {
                    if (oVisualization.getState() === LoadState.Failed) {
                        aErrors.push({
                            type: "Error",
                            title: resources.i18n.getText("Title.UnsufficientRoles"),
                            subtitle: resources.i18n.getText("Title.VisualizationIsNotVisible"),
                            description: resources.i18n.getText("Message.LoadTileError", [(iVisualizationIndex + 1) + ".", oSection.getTitle()])
                        });
                    } else if (oVisualization.getState() !== LoadState.Loading && !_hasValidTarget(oVisualization)) {
                        aWarnings.push({
                            type: "Warning",
                            title: resources.i18n.getText("Message.NavigationTargetError"),
                            subtitle: resources.i18n.getText("Title.VisualizationNotNavigateable"),
                            description: resources.i18n.getText("Message.NavTargetResolutionError",
                                oVisualization.getTitle() || oVisualization.getCatalogTile().getTitle())
                        });
                    } else if (!_availableInContext(oVisualization)) {
                        aWarnings.push({
                            type: "Warning",
                            title: resources.i18n.getText("Message.VisualizationNotAvailableInContext"),
                            subtitle: resources.i18n.getText("Message.VisualizationNotAvailableInContext"),
                            description: resources.i18n.getText("Message.VisualizationOutOfContextError",
                                oVisualization.getTitle() || oVisualization.getCatalogTile().getTitle())
                        });
                    }
                });
            });

            return {
                errors: aErrors,
                warnings: aWarnings
            };
        },

        /**
         * Adds a new Section to the Page.
         *
         * @param {sap.ui.base.Event} [oEvent] The event data. If not given, section is added at the first position.
         *
         * @protected
         */
        addSection: function (oEvent) {
            var iSectionIndex = oEvent ? oEvent.getParameter("index") : 0;

            oMainController.addSectionAt(iSectionIndex);
        },

        /**
         * Deletes a Section from the Page
         *
         * @param {sap.ui.base.Event} oEvent contains event data
         *
         * @private
         */
        deleteSection: function (oEvent) {
            var oSection = oEvent.getSource(),
                sTitle = oSection.getTitle(),
                sMsg = sTitle ? resources.i18n.getText("Message.Section.Delete", sTitle)
                    : resources.i18n.getText("Message.Section.DeleteNoTitle");

            sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
                function deleteSection (oAction) {
                    if (oAction === MessageBox.Action.DELETE) {
                        oMainController.deleteSection(oPage.indexOfSection(oSection));
                    }
                }

                sap.ushell.Container.getService("Message").confirm(
                    sMsg,
                    deleteSection,
                    resources.i18n.getText("Button.Delete"),
                    [
                        MessageBox.Action.DELETE,
                        MessageBox.Action.CANCEL
                    ]
                );
            });
        },

        /**
         * Moves a section inside of the Page
         *
         * @param {object} oInfo Drag and drop event data
         * @private
         */
        moveSection: function (oInfo) {
            var oDragged = oInfo.getParameter("draggedControl"),
                oDropped = oInfo.getParameter("droppedControl"),
                sInsertPosition = oInfo.getParameter("dropPosition"),
                iDragPosition = oPage.indexOfSection(oDragged),
                iDropPosition = oPage.indexOfSection(oDropped);

            if (sInsertPosition === "After") {
                if (iDropPosition < iDragPosition) {
                    iDropPosition++;
                }
            } else if (iDropPosition > iDragPosition) {
                iDropPosition--;
            }

            oMainController.moveSection(iDragPosition, iDropPosition);
        },

        /**
         * Moves a visualization inside a section or between different sections.
         *
         * @param {object} oDropInfo Drag and drop event data
         *
         * @private
         */
        moveVisualization: function (oDropInfo) {
            var oDragged = oDropInfo.getParameter("draggedControl"),
                oDropped = oDropInfo.getParameter("droppedControl"),
                sInsertPosition = oDropInfo.getParameter("dropPosition");

            if (oDropped.isA("sap.ushell.ui.launchpad.Section")) {
                var oModelData = _getModelDataFromVisualization(oDragged),
                    iSectionPosition = oPage.indexOfSection(oDropped),
                    oBindingContext = oDragged.getBindingContext();

                oMainController.addVisualisationToSection(oBindingContext.getModel().getProperty(oBindingContext.getPath()), [iSectionPosition], 0);
                oMainController.deleteVisualizationInSection(oModelData.visualizationIndex, oModelData.sectionIndex);
                return;
            }

            var oDroppedModelData = _getModelDataFromVisualization(oDropped),
                iDropVizPosition = oDroppedModelData.visualizationIndex,
                iDropSectionPosition = oDroppedModelData.sectionIndex;

            if (oDragged.isA("sap.m.CustomTreeItem")) {
                var fnDragSessionCallback = oDropInfo.getParameter("dragSession").getComplexData("callback");
                if (sInsertPosition === "After") {
                    iDropVizPosition++;
                }
                fnDragSessionCallback(iDropVizPosition, iDropSectionPosition);
                return;
            }
            var oDraggedModelData = _getModelDataFromVisualization(oDragged),
                iDragVizPosition = oDraggedModelData.visualizationIndex,
                iDragSectionPosition = oDraggedModelData.sectionIndex;

            if (iDragSectionPosition === iDropSectionPosition) {
                if (sInsertPosition === "After") {
                    if (iDropVizPosition < iDragVizPosition) {
                        iDropVizPosition++;
                    }
                } else if (iDropVizPosition > iDragVizPosition) {
                    iDropVizPosition--;
                }
            } else if (sInsertPosition === "After") {
                iDropVizPosition++;
            }

            oMainController.moveVisualizationInSection(iDragVizPosition, iDropVizPosition, iDragSectionPosition, iDropSectionPosition);
        },

        /**
         * Adds a visualization to a section in the Page.
         *
         * @param {object} oDropInfo Drag and drop event data
         *
         * @private
         */
        addVisualization: function (oDropInfo) {
            var oDragged = oDropInfo.getParameter("draggedControl"),
                oDropped = oDropInfo.getParameter("droppedControl"),
                iDropVizPosition = oDropped.getVisualizations().length,
                iDropSectionPosition = oPage.indexOfSection(oDropped);

            if (oDragged.isA("sap.m.CustomTreeItem")) {
                oDropInfo.getParameter("dragSession").getComplexData("callback")(iDropVizPosition, iDropSectionPosition);
                return;
            }

            var oDraggedModelData = _getModelDataFromVisualization(oDragged),
                iDragVizPosition = oDraggedModelData.visualizationIndex,
                iDragSectionPosition = oDraggedModelData.sectionIndex;

            oMainController.moveVisualizationInSection(iDragVizPosition, iDropVizPosition, iDragSectionPosition, iDropSectionPosition);
        }
    };
});
},
	"sap/ushell/applications/PageComposer/controller/PageDetail.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "./BaseController",
    "./Page",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/base/Log",
    "sap/base/strings/formatMessage"
], function (
    BaseController,
    Page,
    JSONModel,
    MessageToast,
    Log,
    formatMessage
) {
    "use strict";

    /**
     * @typedef {object} ContentCatalogs Contains the titles of each catalog, the tiles of each catalog and a map of vizIds to catalog tiles
     * @property {string} catalogTitles The catalog titles
     * @property {string} catalogTiles The catalog tiles in a catalog
     * @property {string} mCatalogTiles A map from vizId to tile
     */

    return BaseController.extend("sap.ushell.applications.PageComposer.controller.PageDetail", {
        /**
         * Called when controller is initialized.
         *
         * @private
         */
        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("view").attachPatternMatched(this._onPageMatched, this);
            this.setModel(new JSONModel({
                page: {},
                editMode: false,
                transportSupported: this.getOwnerComponent().isTransportSupported()
            }));

            this.getView().addEventDelegate({
                onBeforeHide: this.onRouteLeave.bind(this)
            });

            this.Page.init(this);
        },

        /**
         * Called when page detail view is exited.
         *
         * @private
         */
        onExit: function () {
            this.Page.exit();
        },

        Page: Page,
        formatMessage: formatMessage,

        /**
         * Called if the route matched the pattern for viewing a page.
         * Loads the page with the id given in the URL parameter
         *
         * @param {sap.ui.base.Event} event The routing event
         *
         * @private
         */
        _onPageMatched: function (event) {
            var oArguments = event.getParameter("arguments");
            var sPageId = oArguments.pageId;
            var sRole = this.getOwnerComponent().getRole();
            this.getModel().setProperty("/page", {});
            this.getView().setBusy(true);

            Log.info("The page with id " + sPageId + " was opened in view mode scoped by the following role", sRole);

            this._loadPage(decodeURIComponent(sPageId)).then(function (oPage) {
                this.getModel().setProperty("/page", oPage);
                this.Page.init(this);
            }.bind(this)).catch(function () {
                this.navigateToErrorPage(sPageId);
            }.bind(this)).finally(function () {
                this.getView().setBusy(false);
            }.bind(this));
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
                    this.getModel().updateBindings(true);
                }.bind(this));
                return promiseResults[1];
            }.bind(this));
        },

        /**
         * Navigates to the page detail page
         *
         * @param {string} pageId The pageId to navigate to
         *
         * @private
         */
        _navigateToEdit: function (pageId) {
            this.getRouter().navTo("edit", {
                pageId: encodeURIComponent(pageId)
            });
        },

        /**
         * Called if the delete action has been confirmed
         *
         * @param {sap.ui.base.Event} oEvent The deletePage event
         * @returns {Promise<void>} A promise resolving when the page has been deleted
         *
         * @private
         */
        _deletePage: function (oEvent) {
            var oDialog = oEvent.getSource().getParent();
            var sTransportId = oEvent.metadata && oEvent.metadata.transportId || "";
            var sPageToDeleteId = this.getModel().getProperty("/page/content/id");
            var sSuccessMsg = this.getResourceBundle().getText("Message.SuccessDeletePage");

            return this.getPageRepository().deletePage(sPageToDeleteId, sTransportId)
                .then(function () {
                    this.navigateToPageOverview();
                    MessageToast.show(sSuccessMsg, {
                        closeOnBrowserNavigation: false
                    });
                    oDialog.close();
                }.bind(this))
                .catch(this.handleBackendError.bind(this));
        },

        /**
         * Called if the Edit button is clicked.
         * Loads the edit route
         *
         * @private
         */
        onEdit: function () {
            this._navigateToEdit(this.getModel().getProperty("/page/content/id"));
        },

        /**
         * Called if the delete button is clicked
         * Shows the Delete Dialog
         *
         * @private
         */
        onDelete: function () {
            var oPage = this.getModel().getProperty("/page");
            this.checkShowDeleteDialog(oPage, this._deletePage.bind(this));
        },

        /**
         * Called if the copy button is clicked
         * Copies the page and redirects to the new copy
         *
         * @private
         */
        onCopy: function () {
            var oPage = this.getModel().getProperty("/page");
            this.showCopyDialog(oPage, function (pageInfo) {
                sap.ushell.Container.getServiceAsync("PageReferencing")
                    .then(function (PageReferencing) {
                        return PageReferencing.createReferencePage(pageInfo, []);
                    })
                    .then(function (oReferencePage) {
                        return this.getPageRepository().copyPage(oReferencePage);
                    }.bind(this))
                    .then(function () {
                        this._navigateToEdit(pageInfo.content.targetId);
                        MessageToast.show(this.getResourceBundle().getText("Message.PageCreated"), {
                            closeOnBrowserNavigation: false
                        });
                    }.bind(this))
                    .catch(this.handleBackendError.bind(this));
            }.bind(this));
        },

        /**
         * Called when the error message icon is clicked to display more detailed error message.
         *
         * @private
         */
        onErrorMessageClicked: function () {
            var oPage = this.getModel().getProperty("/page");
            var oFilteredErrorMsgByPageId = this.onfilterErrorMessages(oPage.content.id);
            this.showMessageBoxWarning(oFilteredErrorMsgByPageId[0].message, false);
        }
    });
});
},
	"sap/ushell/applications/PageComposer/controller/PageDetailEdit.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

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
},
	"sap/ushell/applications/PageComposer/controller/PageOverview.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview Controller of the PageOverview fragment.
 */
sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (
    BaseController,
    MessageToast,
    JSONModel,
    Filter,
    FilterOperator
) {
    "use strict";

    /**
     * @typedef {object} ButtonStateModel The model for the button states (e.g. delete button)
     * @property {boolean} isDeleteAndCopyEnabled Whether the delete and copy buttons are enabled
     */

    return BaseController.extend("sap.ushell.applications.PageComposer.controller.Main", {
        aPropertiesToFilter: [ // used for the SearchField in the headerToolbar
            "id",
            "title",
            "description",
            "createdByFullname",
            "modifiedByFullname",
            "BusinessRoleId",
            "BusinessRole"
        ],
        oDialogFactory: null,

        /**
         * Called when controller is initialized.
         *
         * @private
         */
        onInit: function () {
            this.setModel(new JSONModel({
                busy: false,
                pages: [],
                transportSupported: this.getOwnerComponent().isTransportSupported()
            }));
            this.getRouter().getRoute("overview").attachPatternMatched(this._onPageOverviewMatched, this);
            this.setModel(this._createInitialButtonStateModel(), "buttonStates");
        },

        /**
         * Called if a list item in the pageOverview table is pressed.
         *
         * @param {sap.ui.base.Event} oEvent The press event
         *
         * @private
         */
        onItemPress: function (oEvent) {
            var oPage = oEvent.getParameter("listItem").getBindingContext().getObject();
            this._navigateToDetail(oPage.content.id);
        },

        /**
         * Called if the route is entered. Refreshes the model.
         *
         * @private
         */
        _onPageOverviewMatched: function () {
            this._refreshModel();
        },

        /**
         * Navigates to the page edit page.
         *
         * @param {string} pageId The pageId to navigate to
         *
         * @private
         */
        _navigateToEdit: function (pageId) {
            this.getRouter().navTo("edit", {
                pageId: encodeURIComponent(pageId)
            });
        },

        /**
         * Navigates to the page detail page
         *
         * @param {string} pageId The page ID to navigate to
         *
         * @private
         */
        _navigateToDetail: function (pageId) {
            this.getRouter().navTo("view", {
                pageId: encodeURIComponent(pageId)
            });
        },

        /**
         * Called if a list item in the pageOverview table is selected
         * Sets the state of the Delete button and Copy button to enabled.
         *
         * @param {sap.ui.base.Event} oEvent The select event
         *
         * @private
         */
        onSelectionChange: function (oEvent) {
            this._setDeleteAndCopyButtonEnabled(true);
        },

        /**
         * Called if the edit button in the pageOverview table is pressed
         * Sets the config values and navigates to the dashboard
         *
         * @param {sap.ui.base.Event} oEvent The press event
         *
         * @private
         */
        onEdit: function (oEvent) {
            var oPage = oEvent.getSource().getBindingContext().getObject();
            this._navigateToEdit(oPage.content.id);
        },

        /**
         * Called if the add button is clicked
         * Creates and saves (!) a new page, then sets the config values and navigates to the dashboard
         *
         * @private
         */
        onAdd: function () {
            var oResourceBundle = this.getResourceBundle();
            this.showCreateDialog(function (pageInfo) {
                sap.ushell.Container.getServiceAsync("PageReferencing")
                    .then(function (PageReferencing) {
                        return PageReferencing.createReferencePage(pageInfo, []);
                    })
                    .then(function (oReferencePage) {
                        return this.getPageRepository().createPage(oReferencePage);
                    }.bind(this))
                    .then(function () {
                        this._navigateToDetail(pageInfo.content.id);
                        MessageToast.show(oResourceBundle.getText("Message.PageCreated"), {
                            closeOnBrowserNavigation: false
                        });
                    }.bind(this))
                    .catch(this.handleBackendError.bind(this));
            }.bind(this));
        },

        /**
         * Called if the delete dialog is confirmed
         * Deletes the selected page and refreshes the model to display the change in the pageOverview table
         *
         * @param {sap.ui.base.Event} oEvent The press event
         * @returns {Promise<void>} The delete promise
         *
         * @private
         */
        _deletePage: function (oEvent) {
            var oResourceBundle = this.getResourceBundle();
            var oDialog = oEvent.getSource().getParent();
            var sTransportId = oEvent.metadata && oEvent.metadata.transportId || "";
            var oTable = this.byId("table");
            var aItemsToDelete = oTable.getSelectedItems().map(function (item) {
                return item.getBindingContext().getObject();
            });
            var sSuccessMsg = oResourceBundle.getText("Message.SuccessDeletePage");

            var aDeletePromises = aItemsToDelete.map(function (oItemToDelete) {
                return this.getPageRepository().deletePage(oItemToDelete.content.id, sTransportId);
            }.bind(this));

            return Promise.all(aDeletePromises)
                .then(function () {
                    return this._refreshModel();
                }.bind(this))
                .then(function () {
                    oTable.removeSelections();
                    this._setDeleteAndCopyButtonEnabled(false);
                    oTable.fireSelectionChange();
                    MessageToast.show(sSuccessMsg, {
                        closeOnBrowserNavigation: false
                    });
                    oDialog.close();
                }.bind(this))
                .catch(this.handleBackendError.bind(this));
        },

        /**
         * Called if the delete button is clicked
         * Displays the delete dialog with the pages to delete
         * on confirmation deletes the pages
         * on cancel closes the dialog
         *
         * @private
         */
        onDelete: function () {
            var oTable = this.byId("table");
            var oSelectedItem = oTable.getSelectedItem();

            if (!oSelectedItem) {
                return;
            }

            this.checkShowDeleteDialog(
                oSelectedItem.getBindingContext().getObject(),
                this._deletePage.bind(this)
            );
        },

        /**
         * Called if the copy button is clicked.
         * Calls the copy dialog with the page to copy and navigates to the dashboard.
         *
         * @private
         */
        onCopy: function () {
            var oTable = this.byId("table");
            var oSelectedItem = oTable.getSelectedItem();
            var oResourceBundle = this.getResourceBundle();

            if (!oSelectedItem) {
                return;
            }

            var oPage = oSelectedItem.getBindingContext().getObject();
            this.showCopyDialog(oPage, function (pageInfo) {
                this.pageInfo = pageInfo;

                sap.ushell.Container.getServiceAsync("PageReferencing")
                    .then(function (PageReferencing) {
                        return PageReferencing.createReferencePage(pageInfo, []);
                    })
                    .then(function (oReferencePage) {
                        return this.getPageRepository().copyPage(oReferencePage);
                    }.bind(this))
                    .then(function () {
                        return this._refreshModel();
                    }.bind(this))
                    .then(function (/*oResolvedResult*/) {
                        this._navigateToDetail(this.pageInfo.content.targetId);
                        MessageToast.show(oResourceBundle.getText("Message.PageCreated"), {
                            closeOnBrowserNavigation: false
                        });
                    }.bind(this))
                    .catch(this.handleBackendError.bind(this));
            }.bind(this));
        },

        /**
         * Filters the Table
         *
         * @param {sap.ui.base.Event} oEvent The press event
         *
         * @private
         */
        onSearch: function (oEvent) {
            var oTable = this.byId("table");
            var oBinding = oTable.getBinding("items");
            var oResourceBundle = this.getResourceBundle();
            var sSearchValue = oEvent.getSource().getValue();
            var aFilters = this.aPropertiesToFilter.map(
                function (sPropertyToFilter) {
                    return new Filter({
                        path: "content/" + sPropertyToFilter,
                        operator: FilterOperator.Contains,
                        value1: sSearchValue
                    });
                }
            );
            this.oSearchFilter = new Filter({
                filters: aFilters,
                and: false
            });

            this._applyCombinedFilters();

            if (oBinding.getLength() === 0) { // Adjust empty table message in case all pages are filtered out.
                if (sSearchValue) {
                    oTable.setNoDataText(oResourceBundle.getText("Message.NoPagesFound"));
                } else {
                    oTable.setNoDataText(oResourceBundle.getText("Message.NoPages"));
                }
            }
        },

        /**
         * Loads available pages and sets the model
         *
         * @returns {Promise<void>} Promise that resolves when the pages have been loaded
         *
         * @private
         */
        _refreshModel: function () {
            this.getModel().setProperty("/busy", true);
            return this._loadAvailablePages().then(function (pages) {
                this.getModel().setSizeLimit(pages.pages.length);
                this.getModel().setProperty("/pages", pages.pages);
                this.getModel().setProperty("/busy", false);
            }.bind(this), function (sErrorMsg) {
                this.getModel().setProperty("/busy", false);
                this.showMessageBoxError(sErrorMsg);
            }.bind(this));
        },

        /**
         * Called when table was updated, for example, filter items via search
         *
         * @private
         */
        onTableUpdate: function () {
            var oTable = this.byId("table");
            // if filter hides selected item,
            // we need to reset copy button and delete button and selected item
            if (oTable.getSelectedItems().length === 0) {
                // true -> remove all selections (also hidden by filter)
                oTable.removeSelections(true);
                this._setDeleteAndCopyButtonEnabled(false);
            }
        },

        /**
         * Load available pages from the page persistence
         *
         * @returns {Promise<{pages: array}>} A promise which contains an object with the pages
         *
         * @private
         */
        _loadAvailablePages: function () {
            return this.getPageRepository().getPages().then(function (aPages) {
                return { pages: aPages };
            });
        },

        /**
         * Creates the model for the state of the delete button
         *
         * @returns {ButtonStateModel} The Model for storing the button
         *
         * @private
         */
        _createInitialButtonStateModel: function () {
            return new JSONModel({
                isDeleteAndCopyEnabled: false
            });
        },

        /**
         * Changes the state model of the delete and copy button.
         *
         * @param {boolean} bEnabled Whether the delete and copy buttons should be enabled.
         *
         * @private
         */
        _setDeleteAndCopyButtonEnabled: function (bEnabled) {
            this.getView().getModel("buttonStates").setProperty("/isDeleteAndCopyEnabled", bEnabled);
        },

        /**
         * Called when the error message is clicked to display more detailed error message.
         * @param {sap.ui.base.Event} oEvent The press event
         * @private
         */
        onErrorMessageClicked: function (oEvent) {
            var oSelectedObject = oEvent.getSource().getBindingContext().getObject();
            var oFilteredErrorMsgByPageId = this.onfilterErrorMessages(oSelectedObject.content.id);
            if (oFilteredErrorMsgByPageId.length) {
                this.showMessageBoxWarning("Page "+ oSelectedObject.content.id +" : " + oFilteredErrorMsgByPageId[0].message, false);
            }
        },

        /**
         * Returns an array of all different values of a given property name from a given array of pages.
         *
         * @param {object[]} aPages Array of pages.
         * @param {string} sPropertyName Name of the property.
         * @param {boolean} bMetadata If the property is in the metadata instead of the content.
         * @returns {string[]} an array of all different values
         *
         * @private
         */
        _removeDuplicates: function (aPages, sPropertyName, bMetadata) {
            var mKeys = {},
                aKeys = [];

            aPages.forEach(function (oPage) {
                var oObject = bMetadata ? oPage.metadata : oPage.content,
                    sName = oObject[sPropertyName];

                if (!mKeys[sName]) {
                    mKeys[sName] = true;
                    aKeys.push({ key: sName });
                }
            });

            return aKeys;
        },

        /**
         * Opens and creates the ViewSettingsDialog
         *
         * @param {string} sName The name of the tab to be displayed.
         *
         * @private
         */
        showViewSettingsDialog: function (sName) {
            if (this._oViewSettingsDialog) {
                this._oViewSettingsDialog.open(sName);
                return;
            }

            sap.ui.require([
                "sap/ui/core/Fragment",
                "sap/ui/Device",
                "sap/ushell/applications/PageComposer/controller/ViewSettingsDialog.controller"
            ], function (Fragment, Device, ViewSettingsDialogController) {
                Fragment.load({
                    name: "sap.ushell.applications.PageComposer.view.ViewSettingsDialog",
                    type: "XML",
                    controller: new ViewSettingsDialogController(this)
                }).then(function (oFragment) {
                    this._oViewSettingsDialog = oFragment;

                    if (Device.system.desktop) {
                        oFragment.addStyleClass("sapUiSizeCompact");
                    }

                    var aPages = this.getModel().getProperty("/pages");
                    oFragment.setModel(new JSONModel({
                        editAllowed: this._removeDuplicates(aPages, "editAllowed"),
                        devclass: this._removeDuplicates(aPages, "devclass", true),
                        transportId: this._removeDuplicates(aPages, "transportId", true),
                        createdByFullname: this._removeDuplicates(aPages, "createdByFullname"),
                        modifiedByFullname: this._removeDuplicates(aPages, "modifiedByFullname")
                    }), "uniqueValues");

                    this.getView().addDependent(oFragment);
                    oFragment.open(sName);
                }.bind(this));
            }.bind(this));
        },

        /**
         * Combines the filters from the viewSettingsDialog and the filters from the search
         * and applies them together.
         *
         * @private
         */
        _applyCombinedFilters: function () {
            var aFilters = this.aViewSettingsFilters || [],
                oTable = this.byId("table"),
                oBinding = oTable.getBinding("items");

            if (this.oSearchFilter) {
                aFilters = aFilters.concat(this.oSearchFilter);
            }

            // apply filter settings
            oBinding.filter(new Filter({
                filters: aFilters,
                and: true
            }));
        }
    });
});
},
	"sap/ushell/applications/PageComposer/controller/PagePreviewDialog.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ushell/Config"
], function (
    Controller,
    Fragment,
    JSONModel,
    Filter,
    Config
) {
    "use strict";

    var resources = {};
    var _oDialog;

    /**
     * Returns the tile properties used for displaying the tile.
     * Should be used when instantiating a visualization using "localLoad" mode.
     * @see sap.ushell.services.VisualizationLoading#instantiateVisualization
     *
     * @param {object} tileData The tile properties.
     * @returns {object} The tile properties for usage in "VizInstance" "localLoad" mode.
     * @private
     */
    function _getTileProperties (tileData) {
        var oTileProperties = Object.assign(Object.create(null), tileData);

        // adjust service property name: "subTitle" -> "subtitle"
        if (oTileProperties.subTitle) {
            oTileProperties.subtitle = oTileProperties.subTitle;
            delete oTileProperties.subTitle;
        }
        // adjust service property name: "iconUrl" -> "icon"
        if (oTileProperties.iconUrl) {
            oTileProperties.icon = oTileProperties.iconUrl;
            delete oTileProperties.iconUrl;
        }

        // custom tile "info" placeholder (or any other type of tile)
        if (oTileProperties.tileType !== "STATIC" && oTileProperties.tileType !== "DYNAMIC" && !oTileProperties.info) {
            oTileProperties.info = "[" + resources.i18n.getText("Title.CustomTile") + "]";
        }

        return oTileProperties;
    }

    function _hasValidTarget (oVisualization) {
        var oContextInfo = oVisualization.getBindingContext(),
            sInboundPermanentKey = oContextInfo.getProperty(oContextInfo.getPath()).inboundPermanentKey,
            sTarget = oVisualization.getTarget();

        return sInboundPermanentKey || !sTarget || sTarget[0] !== "#";
    }

    /**
     * Show only visualizations that are selected in the current role scope.
     * If the scope is not set, all visualizations are shown.
     * Array of available visualization IDs is provided by the scope selector in the "roles" model.
     *
     * @private
     */
    function _filterRoles () {
        var aAvailableIds;
        var oRolesModel;
        var oFilter = new Filter({
            path: "vizId",
            caseSensitive: true,
            test: function (vizId) {
                return !aAvailableIds || aAvailableIds.indexOf(vizId) >= 0;
            }
        });
        var oPage = _oDialog && _oDialog.getContent()[0];
        if (oPage) {
            oRolesModel = oPage.getModel("roles");
            if (oRolesModel) {
                aAvailableIds = oRolesModel.getProperty("/availableVisualizations");
            }
            oPage.getSections().forEach(function (oSection) {
                oSection.getBinding("visualizations").filter(oFilter);
            });
        }
    }

    var PagePreviewDialogController = Controller.extend("sap.ushell.applications.PageComposer.controller.PagePreviewDialog.controller", {
        load: function (sParentId) {
            return _oDialog ? Promise.resolve(_oDialog) : Fragment.load({
                    id: sParentId,
                    name: "sap.ushell.applications.PageComposer.view.PagePreviewDialog",
                    controller: this
                });
        },

        open: function (oSourceControl, sParentId) {
            this.load(sParentId).then(function (oDialog) {
                _oDialog = oDialog;
                resources.i18n = oSourceControl.getModel("i18n").getResourceBundle();
                oSourceControl.addDependent(oDialog);

                oDialog.setModel(new JSONModel({
                    sizeBehavior: Config.last("/core/home/sizeBehavior")
                }), "viewSettings");
                _filterRoles(); // filter visualizations according to the currently selected scope
                oDialog.open();
            });
        },

        close: function () {
            if (_oDialog) {
                _oDialog.close();
            }
        },

        /**
         * Creates the visualizations inside of the sections.
         *
         * @param {string} sId The ID of the visualization.
         * @param {sap.ui.model.Context} oBindingContext The visualization binding context.
         * @returns {sap.ushell.ui.launchpad.VizInstance} A visualization inside of a section.
         *
         * @private
         */
        visualizationFactory: function (sId, oBindingContext) {
            if (!this.oVisualizationLoadingService) {
                // The service is already loaded, no need for an async call
                this.oVisualizationLoadingService = sap.ushell.Container.getService("VisualizationLoading");
            }

            var oTileData = oBindingContext.getProperty(),
                oVisualization = this.oVisualizationLoadingService.instantiateVisualization({
                    vizId: oTileData.vizId,
                    previewMode: true,
                    localLoad: true,
                    tileType: (oTileData.tileType === "DYNAMIC" ? "sap.ushell.ui.tile.DynamicTile" : "sap.ushell.ui.tile.StaticTile"),
                    properties: _getTileProperties(oTileData)
                });

            oVisualization._getInnerControlPromise().then(function () {
                var oInnerControl = oVisualization.getInnerControl().getContent
                    ? oVisualization.getInnerControl().getContent()[0]
                    : oVisualization.getInnerControl();

                oInnerControl.attachPress(function (oEvent) {
                    oVisualization.fireEvent("press");
                });

                // sizeBehavior for tiles: Small/Responsive
                oInnerControl.bindProperty("sizeBehavior", "viewSettings>/sizeBehavior");
                oInnerControl.setScope("Display");

                if (oVisualization.getState() !== "Loading"
                    && !_hasValidTarget(oVisualization)
                    && oInnerControl.setState) {
                    oInnerControl.setState("Failed");
                }
            });

            return oVisualization;
        }

    });

    return new PagePreviewDialogController();
});
},
	"sap/ushell/applications/PageComposer/controller/TileSelector.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileoverview Provides functionality for "sap/ushell/applications/PageComposer/view/TileSelector.fragment.xml"
 */
sap.ui.define([
    "sap/m/library",
    "sap/m/Button",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/ResponsivePopover",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ushell/services/Container" // required for "sap.ushell.Container.getServiceAsync()"
], function (
    mobileLibrary,
    Button,
    List,
    StandardListItem,
    ResponsivePopover,
    JSONModel,
    Filter,
    FilterOperator,
    Sorter
    // Container
) {
    "use strict";

    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    // shortcut for sap.m.PlacementType
    var PlacementType = mobileLibrary.PlacementType;

    // shortcut for sap.m.ListMode
    var ListMode = mobileLibrary.ListMode;

    // shortcut for sap.m.ListSeparators
    var ListSeparators = mobileLibrary.ListSeparators;

    /**
     * TileSelector constructor
     *
     * @constructor
     *
     * @protected
     */
    return function () {
        var oParentView,
            oTree,
            oToolbar,
            oAddSelectedTilesButton,
            oAddSingleTileItem,
            oSectionList,
            oSectionSelectionPopover,
            fnAddTileHandler,
            bSortAscending,
            resources = {};

        /**
         * Initializes the TileSelector, must be called before usage.
         *
         * @param {sap.ui.core.mvc.Controller} oController A reference to the controller it is going to be used on.
         *
         * @private
         */
        this.init = function (oController) {
            oParentView = oController.getView();
            oTree = oParentView.byId("tileSelectorList");
            oToolbar = oParentView.byId("tileSelectorToolbar");
            oAddSelectedTilesButton = oParentView.byId("tileSelectorAddButton");

            resources.i18n = oController.getResourceBundle();

            oTree.setBusy(true);

            oSectionList = new List({
                mode: ListMode.MultiSelect,
                showSeparators: ListSeparators.None,
                includeItemInSelection: true,
                selectionChange: function () { oSectionSelectionPopover.getBeginButton().setEnabled(!!oSectionList.getSelectedItem()); },
                items: {
                    path: "/page/content/sections",
                    template: new StandardListItem({ title: "{title}" })
                },
                noDataText: resources.i18n.getText("Message.NoSections")
            }).setModel(oParentView.getModel());

            oAddSelectedTilesButton.setEnabled(false);
            oTree.attachSelectionChange(this._onSelectionChange);
        };


        /**
         * @typedef {object} oCatalogData The catalog object
         * @property {array} [aTreeOverride] If present, other properties should be ignored and this property should be
         * used as the catalog tree instead of building one using the other properties.
         * @property {array} catalogTitles An array of catalog titles
         * @property {array} catalogTiles An array of arrays of tiles (one array of tiles for each catalog)
         * @property {object} catalogTilesData A map from vizId to tile data
         */

        /**
         * Consumes catalog data and builds the catalog tree, replacing the model with it.
         *
         * @param {oCatalogData} oCatalogData The catalog object
         *
         * @private
         */
        this.initTiles = function (oCatalogData) {
            if (oCatalogData.aTreeOverride) {
                _setCatalogTree(oCatalogData.aTreeOverride);
                return;
            }

            var aCatalogTree = oCatalogData.catalogTiles.reduce(function (tree, tiles, i) {
                if (tiles.length) {
                    tree.push({
                        catalogTitle: oCatalogData.catalogTitles[i],
                        tiles: tiles.map(function (tile) {
                            return oCatalogData.catalogTilesData[tile.vizId];
                        }).sort(function (a, b) { // sorts tiles by title in ascending lexicographical order
                            if (a.title > b.title) { return 1; }
                            if (a.title < b.title) { return -1; }
                            return 0;
                        })
                    });
                }
                return tree;
            }, []);
            _setCatalogTree(aCatalogTree);
        };

        /**
         * Sets the role context in the roles model to provide information for the InfoToolbar
         *
         * @param {string[]} aSelectedRoles The IDs of the roles that were selected by the ContextSelector
         * @param {boolean} bAllSelected Whether all available roles are selected
         */
        this.setRoleContext = function (aSelectedRoles, bAllSelected) {
            var oModel = oParentView.getModel("roles");
            var sActiveRoleContextInfo = bAllSelected
                ? "(" + resources.i18n.getText("Message.AllRolesSelected") + ")"
                : "(" + aSelectedRoles.length.toString() + ")";

            oModel.setProperty("/activeRoleContext", aSelectedRoles);
            oModel.setProperty("/activeRoleContextInfo", sActiveRoleContextInfo); // to be displayed in an InfoToolbar
            oModel.setProperty("/showRoleContextInfo", !bAllSelected);
        };

        /**
         * Intended to be called by the view (e.g. a SearchField) for handling tile search events.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @private
         */
        this.onSearchTiles = function (/*oEvent*/) {
            searchForTiles();
        };

        /**
         * Intended to be called by the view (e.g. a Button) for handling add tile events.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @private
         */
        this.onAddTiles = function (oEvent) {
            var aSectionListItems = oSectionList.getItems(),
                oBindingContext = oEvent.getSource().getBindingContext();
            if (oBindingContext) {
                var sBindingContextPath = oBindingContext.getPath();
                oAddSingleTileItem = oTree.getItems().filter(function (item) {
                    return (item.getBindingContextPath() === sBindingContextPath);
                })[0];
            } else {
                oAddSingleTileItem = undefined;
            }
            if (aSectionListItems.length === 1) { // skip asking to which section(s) if there is only one section
                aSectionListItems[0].setSelected(true);
                _addTiles();
            } else {
                _openSectionSelectionPopover(oEvent);
            }
        };

        /**
         * Intended to be called by the view (e.g. a Button) for handling sort catalogs toggle events.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @private
         */
        this.onSortCatalogsToggle = function (/*oEvent*/) {
            sortCatalogsToggle();
        };

        /**
         * Intended to be called by the view (e.g. a Button) for handling collapse all catalogs events.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @private
         */
        this.onCollapseAllCatalogs = function (/*oEvent*/) {
            collapseAllCatalogs(true);
        };

        /**
         * Intended to be called by the view (e.g. a Button) for handling expand all catalogs events.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @private
         */
        this.onExpandAllCatalogs = function (/*oEvent*/) {
            collapseAllCatalogs(false);
        };

        /**
         * Intended to be called by the view (e.g. a Tree) for handling catalog item press events.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @private
         */
        this.onCatalogItemPress = function (oEvent) {
            _toggleCollapseTreeItem(oEvent.getParameters().listItem);
        };

        /**
         * Intended to be called by the view (e.g. a Tree) for handling selection change events.
         *
         * @param {sap.ui.base.Event} [oEvent] The event object.
         *
         * @private
         */
        this._onSelectionChange = function (oEvent) {
            if (oSectionSelectionPopover && oSectionSelectionPopover.isOpen()) {
                oSectionSelectionPopover.getBeginButton().setEnabled(false);
                oSectionSelectionPopover.close();
            }
            if (oEvent) {
                oEvent.getParameters().listItems.forEach(function (item) {
                    if (item.getBindingContext().getProperty().tiles) { // catalog (root item)
                        item.setSelected(false); // currently, catalogs should not be selectable
                        _toggleCollapseTreeItem(item); // instead, allow toggling collapse with space bar
                    }
                });
            }
            oAddSelectedTilesButton.setEnabled(!!_getSelectedTreeItemsData().length);
        };

        /**
         * Sets a callback function for the add tiles event.
         *
         * @param {function} newAddTileHandler The callback function to be called when adding tiles.
         *   This function receives two arguments in the following order:
         *     1. A tile object.
         *     2. An array of section indices.
         *
         * @private
         */
        this.setAddTileHandler = function (newAddTileHandler) {
            fnAddTileHandler = newAddTileHandler;
        };

        /**
         * Called when starting to drag a tile.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @private
         */
        this.onDragStart = function (oEvent) {
            var oItemData = oEvent.getParameter("target").getBindingContext().getProperty();
            if (!oItemData.vizId) { // prevent dragging of items without vizId
                oEvent.preventDefault();
                return;
            }
            oEvent.getParameter("dragSession").setComplexData("callback", function callback (tileIndex, sectionIndex) {
                fnAddTileHandler(oItemData, [sectionIndex], tileIndex);
            });
        };

        /**
         * Sets the Tree model with the provided catalog tree.
         *
         * @param {object[]} aCatalogTree The catalog tree to be set on the Tree model.
         *
         * @private
         */
        function _setCatalogTree (aCatalogTree) {
            oAddSelectedTilesButton.setEnabled(false);
            var oModel = new JSONModel({ catalogs: aCatalogTree });
            oModel.setSizeLimit(Infinity); // allow more list bindings than the model default limit of 100 entries
            oTree.setModel(oModel);
            bSortAscending = true;
            sortCatalogsToggle();
            oTree.expandToLevel(1);
            oTree.setBusy(false);
        }

        /**
         * Handler for searching tiles using the SearchField input.
         *
         * @private
         */
        function searchForTiles () {
            var sSearchText = oParentView.getModel().getProperty("/searchText") || "";
            oTree.getBinding("items").filter([
                new Filter([
                    new Filter("title", FilterOperator.Contains, sSearchText),
                    new Filter("subTitle", FilterOperator.Contains, sSearchText)
                ], false)
            ]);
        }

        /**
         * Toggles the sort order (ascending/descending) of the catalog tree, restricted to the first tree level (i.e. the catalog level).
         *
         * @private
         */
        function sortCatalogsToggle () {
            bSortAscending = !bSortAscending;
            var oItems = oTree.getBinding("items"),
                oSorterCatalog = new Sorter("catalogTitle", bSortAscending);
            oItems.sort(oSorterCatalog);
        }

        /**
         * Controls collapsing and expanding all catalogs.
         *
         * @param {boolean} bCollapse Whether it should collapse all catalogs instead of expanding all catalogs.
         *
         * @private
         */
        function collapseAllCatalogs (bCollapse) {
            if (bCollapse) {
                oTree.collapseAll();
            } else {
                oTree.expandToLevel(1);
            }
        }

        /**
         * Toggles the collapse state of a tree item between collapsed and expanded.
         *
         * @param {sap.m.TreeItemBase} oTreeItem The tree item to have its collapse state toggled.
         *
         * @private
         */
        function _toggleCollapseTreeItem (oTreeItem) {
            var iTreeItemIndex = oTree.indexOfItem(oTreeItem);
            if (oTreeItem.getExpanded()) {
                oTree.collapse(iTreeItemIndex);
            } else {
                oTree.expand(iTreeItemIndex);
            }
        }

        /**
         * Get the item data of every selected tree item.
         * This is needed because "getSelectedItems()" do not return selected items within collapsed parents.
         *
         * @returns {object[]} An array of selected tree item data.
         *
         * @private
         */
        function _getSelectedTreeItemsData () {
            return oTree.getSelectedContextPaths().map(function (sSelectedItemContextPath) {
                return oTree.getModel().getContext(sSelectedItemContextPath).getProperty();
            });
        }

        /**
         * Opens the add tiles popover, containing the section list for selection of the tiles target sections.
         *
         * @param {sap.ui.base.Event} oEvent The event that raised the operation (e.g. a click on the "Add" button).
         *
         * @private
         */
        function _openSectionSelectionPopover (oEvent) {
            if (!oSectionSelectionPopover || oSectionSelectionPopover.bIsDestroyed) {
                _createSectionSelectionPopover();
            }
            oSectionList.removeSelections(true);
            oSectionSelectionPopover.getBeginButton().setEnabled(false);
            oSectionSelectionPopover.getEndButton().setEnabled(true);
            if (!oAddSingleTileItem && _isOverflownInOverflowToolbar(oAddSelectedTilesButton)) {
                oSectionSelectionPopover.openBy(oToolbar.getAggregation("_overflowButton"));
            } else {
                oSectionSelectionPopover.openBy(oEvent.getSource());
            }
        }

        /**
         * Checks if a control is currently overflown inside of an OverflowToolbar.
         *
         * @param {sap.ui.core.Control} oControl The control to check.
         * @returns {boolean} Whether the control is or is not overflown inside of an OverflowToolbar.
         *
         * @private
         */
        function _isOverflownInOverflowToolbar (oControl) {
            return (oControl.hasStyleClass("sapMOTAPButtonNoIcon") || oControl.hasStyleClass("sapMOTAPButtonWithIcon"));
        }

        /**
         * Creates the section selection popover, used to select to which section(s) the tile(s) should go to.
         *
         * @private
         */
        function _createSectionSelectionPopover () {
            oSectionSelectionPopover = new ResponsivePopover({
                placement: PlacementType.Auto,
                title: resources.i18n.getText("Tooltip.AddToSections"),
                beginButton: new Button({
                    type: ButtonType.Emphasized,
                    text: resources.i18n.getText("Button.Add"),
                    press: function () { this.setEnabled(false); oSectionSelectionPopover.close(); _addTiles(); }
                }),
                endButton: new Button({
                    text: resources.i18n.getText("Button.Cancel"),
                    press: function () { this.setEnabled(false); oSectionSelectionPopover.close(); }
                }),
                content: oSectionList,
                initialFocus: oSectionList
            });
            oParentView.addDependent(oSectionSelectionPopover);
        }

        /**
         * Calls the handler for adding tiles. Does nothing if no function is set for the add tiles handler.
         *
         * @see setAddTileHandler
         *
         * @private
         */
        var _addTiles = function () {
            if (typeof fnAddTileHandler !== "function") {
                return;
            }
            var aSelectedSectionsIndexes = oSectionList.getSelectedItems().map(function (oSelectedSection) {
                return oSectionList.indexOfItem(oSelectedSection);
            });
            var aTileData;
            if (oAddSingleTileItem) {
                aTileData = [oAddSingleTileItem.getBindingContext().getProperty()]; // adds a single tile (from its own "Add" button)
            } else {
                aTileData = _getSelectedTreeItemsData(); // adds all selected tiles (from header "Add" button)
            }

            aTileData.forEach(function (oTileData) {
                fnAddTileHandler(oTileData, aSelectedSectionsIndexes);
            });

            if (!oAddSingleTileItem) { // unselect all tiles when adding through the header "Add" button
                oTree.removeSelections(true);
                this._onSelectionChange();
            } else if (oAddSingleTileItem.getSelected()) {
                oAddSingleTileItem.setSelected(false);
                this._onSelectionChange();
            }
        }.bind(this);
    };
});
},
	"sap/ushell/applications/PageComposer/controller/ViewSettingsDialog.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
], function (
    DateFormat,
    Controller,
    Filter,
    FilterOperator,
    Sorter
) {
    "use strict";

    return Controller.extend("sap.ushell.applications.PageComposer.controller.ViewSettingsDialog", {
        constructor: function (PageOverviewController) {
            this.PageOverviewController = PageOverviewController;
        },

        /**
         * Applies the applicable sorters and filters for the given viewSettingsDialog confirm event.
         *
         * @param {sap.ui.base.Event} oEvent The confirm event of the viewSettingsDialog.
         *
         * @private
         */
        handleDialogConfirm: function (oEvent) {
            var mParams = oEvent.getParameters(),
                oTable = this.PageOverviewController.byId("table"),
                oBinding = oTable.getBinding("items"),
                aSorters = this.getSorters(mParams),
                aFilters = this.getFilters(mParams);

            // apply sorters
            oBinding.sort(aSorters);

            // apply filters
            this.PageOverviewController.aViewSettingsFilters = aFilters;
            this.PageOverviewController._applyCombinedFilters();

            // update filter bar
            this.PageOverviewController.byId("infoFilterBar").setVisible(aFilters.length > 0);
            this.PageOverviewController.byId("infoFilterLabel").setText(mParams.filterString);
        },

        /**
         * Derives the applicable sorters for the given event parameters.
         *
         * @param {object} mParams An object containing the event parameters of the viewSettingsDialog confirm event.
         * @returns {sap.ui.model.Sorter[]} An array of sorters, that represent the currently selected sorting and grouping.
         *
         * @private
         */
        getSorters: function (mParams) {
            var aSorters = [],
                oGoupItem = mParams.groupItem,
                oResourceBundle = this.PageOverviewController.getResourceBundle();

            if (oGoupItem) {
                var sGroupPath = oGoupItem.getKey(),
                    fnSorter;

                switch (sGroupPath) {
                    case "content/editAllowed":
                        fnSorter = function (oContext) {
                            var bName = oContext.getProperty(sGroupPath);
                            return {
                                key: bName,
                                text: bName
                                    ? oResourceBundle.getText("Message.StatusAssigned")
                                    : oResourceBundle.getText("Message.NotAssigned")
                            };
                        };
                        break;
                    case "content/createdOn":
                    case "content/modifiedOn":
                        fnSorter = function (oContext) {
                            var oFormat = DateFormat.getInstance({
                                style: "medium"
                            });

                            var oDate = oContext.getProperty(sGroupPath),
                                sFormatedDate = oFormat.format(oDate);

                            return {
                                key: sFormatedDate,
                                text: sFormatedDate
                            };
                        };
                        break;
                    default:
                        fnSorter = function (oContext) {
                            var sName = oContext.getProperty(sGroupPath);
                            return {
                                key: sName,
                                text: sName
                            };
                        };
                }

                aSorters.push(new Sorter(sGroupPath, mParams.groupDescending, fnSorter));
            }

            if (mParams.sortItem) {
                aSorters.push(new Sorter(mParams.sortItem.getKey(), mParams.sortDescending));
            } else {
                aSorters.push(new Sorter("content/modifiedOn", true));
            }

            return aSorters;
        },

        /**
         * Derives the applicable filters for the given event parameters.
         *
         * @param {object} mParams An object containing the event parameters of the viewSettingsDialog confirm event.
         * @returns {sap.ui.model.Sorter[]} An array of filters, that represent the currently selected filtering.
         *
         * @private
         */
        getFilters: function (mParams) {
            var aFilters = [];

            mParams.filterItems.forEach(function (oItem) {
                var sPath,
                    sOperator,
                    sValue1,
                    sValue2;

                if (oItem.getKey() === "content/createdOn" || oItem.getKey() === "content/modifiedOn") {
                    var oDateRangeSeletion = oItem.getCustomControl();

                    sPath = oItem.getKey();
                    sOperator = FilterOperator.BT;
                    sValue1 = oDateRangeSeletion.getDateValue();
                    sValue2 = oDateRangeSeletion.getSecondDateValue();

                    if (sPath === "content/createdOn") {
                        this._createdOnFromFilter = sValue1;
                        this._createdOnToFilter = sValue2;
                    } else {
                        this._changedOnFromFilter = sValue1;
                        this._changedOnToFilter = sValue2;
                    }
                } else {
                    var aSplit = oItem.getKey().split("___");
                    sPath = aSplit[0];
                    sOperator = aSplit[1];
                    sValue1 = aSplit[2];
                    sValue2 = aSplit[3];

                    if (sPath === "content/editAllowed") {
                        if (sValue1 === "true") {
                            sValue1 = true;
                        } else {
                            sValue1 = false;
                        }
                    }
                }

                aFilters.push(new Filter(sPath, sOperator, sValue1, sValue2));
            }.bind(this));

            return aFilters;
        },

        /**
         * Updates the filter count for a custom viewSetting filter.
         *
         * @param {sap.ui.base.Event} oEvent The change event from the group dateRangeSelections.
         *
         * @private
         */
        handleDateRangeSelectionChanged: function (oEvent) {
            var oParameters = oEvent.getParameters(),
                oViewSetting = oParameters.id === "CreatedOnDateRangeSelection"
                    ? sap.ui.getCore().byId("CreatedOnFilter")
                    : sap.ui.getCore().byId("ChangedOnFilter");

            if (oParameters.from) {
                oViewSetting.setFilterCount(1);
                oViewSetting.setSelected(true);
            } else {
                oViewSetting.setFilterCount(0);
                oViewSetting.setSelected(false);
            }
        },

        /**
         * Handles the cancel press event and resets the changes to the values of the custom viewSettings filters.
         *
         * @private
         */
        handleCancel: function () {
            var oCreatedOnFilter = sap.ui.getCore().byId("CreatedOnFilter"),
                oCreatedOnDateRangeSelection = sap.ui.getCore().byId("CreatedOnDateRangeSelection"),
                oChangedOnFilter = sap.ui.getCore().byId("ChangedOnFilter"),
                oChangedOnDateRangeSelection = sap.ui.getCore().byId("ChangedOnDateRangeSelection");

            if (this._createdOnFromFilter) {
                oCreatedOnFilter.setFilterCount(1);
                oCreatedOnFilter.setSelected(true);
            } else {
                oCreatedOnFilter.setFilterCount(0);
                oCreatedOnFilter.setSelected(false);
            }

            if (this._changedOnFromFilter) {
                oChangedOnFilter.setFilterCount(1);
                oChangedOnFilter.setSelected(true);
            } else {
                oChangedOnFilter.setFilterCount(0);
                oChangedOnFilter.setSelected(false);
            }

            oCreatedOnDateRangeSelection.setDateValue(this._createdOnFromFilter);
            oCreatedOnDateRangeSelection.setSecondDateValue(this._createdOnToFilter);
            oChangedOnDateRangeSelection.setDateValue(this._changedOnFromFilter);
            oChangedOnDateRangeSelection.setSecondDateValue(this._changedOnToFilter);
        },

        /**
         * Resets the custom viewSettings filter to the inital value.
         *
         * @private
         */
        handleResetFilters: function () {
            var oCreatedOnDateRangeSelection = sap.ui.getCore().byId("CreatedOnDateRangeSelection"),
                oChangedOnDateRangeSelection = sap.ui.getCore().byId("ChangedOnDateRangeSelection"),
                oCreatedOnFilter = sap.ui.getCore().byId("CreatedOnFilter"),
                oChangedOnFilter = sap.ui.getCore().byId("ChangedOnFilter");

            oCreatedOnDateRangeSelection.setDateValue();
            oCreatedOnDateRangeSelection.setSecondDateValue();
            oChangedOnDateRangeSelection.setDateValue();
            oChangedOnDateRangeSelection.setSecondDateValue();
            oCreatedOnFilter.setFilterCount(0);
            oCreatedOnFilter.setSelected(false);
            oChangedOnFilter.setFilterCount(0);
            oChangedOnFilter.setSelected(false);
        }
    });
});
},
	"sap/ushell/applications/PageComposer/i18n/i18n.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# __ldi.translation.uuid=ba56f460-d533-11e9-aaef-0800200c9a66\n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=Maintain Page Templates Cross Client\n\n#XBUT\nButton.Add=Add\n#XBUT\nButton.Cancel=Cancel\n#XBUT\nButton.ClosePreview=Close Preview\n#XBUT\nButton.Copy=Copy\n#XBUT\nButton.Create=Create\n#XBUT\nButton.Delete=Delete\n#XBUT\nButton.Edit=Edit\n#XBUT\nButton.Save=Save\n#XBUT\nButton.Select=Select\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=Show Catalogs\n#XBUT\nButton.HideCatalogs=Hide Catalogs\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Issues: {0}\n#XBUT\nButton.SortCatalogs=Toggle Catalog Sort Order\n#XBUT\nButton.CollapseCatalogs=Collapse All Catalogs\n#XBUT\nButton.ExpandCatalogs=Expand All Catalogs\n#XBUT\nButton.ShowDetails=Show Details\n#XBUT\nButton.PagePreview=Page Template Preview\n#XBUT\nButton.ErrorMsg=Error Messages\n#XBUT\nButton.EditHeader=Edit Header\n#XBUT\nButton.ContextSelector=Select Role Context {0}\n#XBUT\nButton.OverwriteChanges=Overwrite\n#XBUT\nButton.DismissChanges=Dismiss Changes\n\n#XTOL\nTooltip.AddToSections=Add to Sections\n#XTOL: Tooltip for the search button\nTooltip.Search=Search\n#XTOL\nTooltip.SearchForTiles=Search for Tiles\n#XTOL\nTooltip.SearchForRoles=Search for Roles\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Desktop\n#XTOL: Opens the sort settings dialog\nTooltip.SortSettingsButton=View Sort Settings\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=View Filter Settings\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=View Group Settings\n\n#XFLD\nLabel.PageID=Page Template ID\n#XFLD\nLabel.Title=Title\n#XFLD\nLabel.WorkbenchRequest=Workbench Request\n#XFLD\nLabel.Package=Package\n#XFLD\nLabel.TransportInformation=Transport Information\n#XFLD\nLabel.Details=Details:\n#XFLD\nLabel.ResponseCode=Response Code:\n#XFLD\nLabel.ModifiedBy=Modified by:\n#XFLD\nLabel.Description=Description\n#XFLD\nLabel.CreatedByFullname=Created By\n#XFLD\nLabel.CreatedOn=Created On\n#XFLD\nLabel.ChangedByFullname=Changed By\n#XFLD\nLabel.ChangedOn=Changed On\n#XFLD\nLabel.PageTitle=Page Template Title\n#XFLD\nLabel.AssignedRole=Assigned Role\n\n#XCOL\nColumn.PageID=Page Template ID\n#XCOL\nColumn.PageTitle=Title\n#XCOL\nColumn.PageDescription=Description\n#XCOL\nColumn.PageAssignmentStatus=Assigned to Space/Role\n#XCOL\nColumn.PagePackage=Package\n#XCOL\nColumn.PageWorkbenchRequest=Workbench Request\n#XCOL\nColumn.PageCreatedBy=Created By\n#XCOL\nColumn.PageCreatedOn=Created On\n#XCOL\nColumn.PageChangedBy=Changed By\n#XCOL\nColumn.PageChangedOn=Changed On\n\n#XTOL\nPlaceholder.SectionName=Enter section name\n#XTOL\nPlaceholder.SearchForTiles=Search for tiles\n#XTOL\nPlaceholder.SearchForRoles=Search for roles\n#XTOL\nPlaceholder.CopyPageTitle=Copy of "{0}"\n#XTOL\nPlaceholder.CopyPageID=Copy of "{0}"\n#XTOL\nPlaceholder.Description=Short description for the administrator\n#XTOL\nPlaceholder.PageTitle=Menu text for the user\n\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=all\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=Section {0} has no title. For a consistent user experience, we recommend you enter a name for each section.\n#XMSG\nMessage.InvalidSectionTitle=Ideally, you should enter a section name.\n#XMSG\nMessage.NoInternetConnection=Please check your internet connection.\n#XMSG\nMessage.SavedChanges=Your changes have been saved.\n#XMSG\nMessage.InvalidPageID=Please only use the following characters: A-Z, 0-9, _ and /. The Page Template ID should not start with a number.\n#XMSG\nMessage.EmptyPageID=Please provide a valid Page Template ID.\n#XMSG\nMessage.EmptyTitle=Please provide a valid title.\n#XMSG\nMessage.EmptyDescription=Please provide a description.\n#XMSG\nMessage.NoRoleSelected=Please select at least one role.\n#XMSG\nMessage.SuccessDeletePage=The selected page template has been deleted.\n#XMSG\nMessage.ClipboardCopySuccess=Details were copied successfully.\n#YMSE\nMessage.ClipboardCopyFail=An error occurred while copying details.\n#XMSG\nMessage.PageCreated=The page template has been created.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=No Tiles\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=No roles available.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=No roles found. Try adjusting your search.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=No Sections\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=Failed to load the {0} tile in the "{1}" section.\\n\\n This is most likely caused by incorrect configuration of SAP Fiori launchpad content. The visualization will not be displayed for the user.\n#XMSG\nMessage.NavigationTargetError=Navigation target could not be resolved.\n#XMSG\nMessage.LoadPageError=Could not load the page template.\n#XMSG\nMessage.UpdatePageError=Could not update the page template.\n#XMSG\nMessage.CreatePageError=Could not create the page template.\n#XMSG\nMessage.TilesHaveErrors=Some of the tiles or sections have errors. Are you sure you want to continue saving?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=Failed to resolve the navigation target of tile: "{0}".\\n\\n This is most likely caused by invalid configuration of SAP Fiori launchpad content. The visualization cannot open an application.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=Are you sure you want to delete the section "{0}"?\n#XMSG\nMessage.Section.DeleteNoTitle=Are you sure you want to delete this section?\n#XMSG\nMessage.OverwriteChanges=There have been changes while you were editing the page template. Do you want to overwrite them?\n#XMSG\nMessage.OverwriteRemovedPage=The page template you are working on has been deleted by a different user. Do you want to overwrite this change?\n#XMSG\nMessage.SaveChanges=Please save your changes.\n#XMSG\nMessage.NoPages=No page templates available.\n#XMSG\nMessage.NoPagesFound=No page template found. Try adjusting your search.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Content restricted to role context.\n#XMSG\nMessage.NotAssigned=Not Assigned\n#XMSG\nMessage.StatusAssigned=Assigned\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=New Page Template\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=Select Role Context\n#XTIT\nTitle.TilesHaveErrors=Tiles Have Errors\n#XTIT\nDeleteDialog.Title=Delete\n#XMSG\nDeleteDialog.Text=Are you sure you want to delete the selected page template?\n#XBUT\nDeleteDialog.ConfirmButton=Delete\n#XTIT\nDeleteDialog.LockedTitle=Page Template Locked\n#XMSG\nDeleteDialog.LockedText=The selected page template is locked by user "{0}".\n#XMSG\nDeleteDialog.TransportRequired=Please select a transport package to delete the selected page template.\n\n#XMSG\nEditDialog.LockedText=The selected page template is locked by user "{0}".\n#XMSG\nEditDialog.TransportRequired=Please select a transport package to edit the selected page template.\n#XTIT\nEditDialog.Title=Edit Page Template\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=This page template has been created in language "{0}" but your logon language is set to "{1}". Please change your logon language to "{0}" to proceed.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Subtitle\n#XFLD\nTileInfoPopover.Label.Icon=Icon\n#XFLD\nTileInfoPopover.Label.SemanticObject=Semantic Object\n#XFLD\nTileInfoPopover.Label.SemanticAction=Semantic Action\n#XFLD\nTileInfoPopover.Label.FioriID=SAP Fiori ID\n#XFLD\nTileInfoPopover.Label.AppDetail=App Detail\n#XFLD\nTileInfoPopover.Label.AppType=App Type\n#XFLD\nTileInfoPopover.Label.TileType=Tile Type\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Available Devices\n\n#XTIT\nErrorDialog.Title=Error\n\n#XTIT\nConfirmChangesDialog.Title=Warning\n\n#XTIT\nPageOverview.Title=Maintain Page Templates\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=Layout\n\n#XTIT\nCopyDialog.Title=Copy Page Template\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=Do you want to copy "{0}"?\n#XFLD\nCopyDialog.NewID=Copy of "{0}"\n\n#XMSG\nTitle.NoSectionTitle=Section title of section {0} is empty.\n#XMSG\nTitle.UnsufficientRoles=Insufficient role assignment to show visualization.\n#XMSG\nTitle.VisualizationIsNotVisible=Visualization will not be displayed.\n#XMSG\nTitle.VisualizationNotNavigateable=Visualization cannot open an app.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Static Tile\n#XTIT\nTitle.DynamicTile=Dynamic Tile\n#XTIT\nTitle.CustomTile=Custom Tile\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=Page Template Preview: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=Sorry, we could not find this page template.\n#XLNK\nErrorPage.Link=Maintain Page Templates\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_ar.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=\\u0635\\u064A\\u0627\\u0646\\u0629 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0627\\u062A \\u0639\\u0628\\u0631 \\u0627\\u0644\\u0639\\u0645\\u064A\\u0644\n\n#XBUT\nButton.Add=\\u0625\\u0636\\u0627\\u0641\\u0629\n#XBUT\nButton.Cancel=\\u0625\\u0644\\u063A\\u0627\\u0621\n#XBUT\nButton.ClosePreview=\\u0625\\u063A\\u0644\\u0627\\u0642 \\u0627\\u0644\\u0645\\u0639\\u0627\\u064A\\u0646\\u0629\n#XBUT\nButton.Copy=\\u0646\\u0633\\u062E\n#XBUT\nButton.Create=\\u0625\\u0646\\u0634\\u0627\\u0621\n#XBUT\nButton.Delete=\\u062D\\u0630\\u0641\n#XBUT\nButton.Edit=\\u062A\\u062D\\u0631\\u064A\\u0631\n#XBUT\nButton.Save=\\u062D\\u0641\\u0638\n#XBUT\nButton.Select=\\u062A\\u062D\\u062F\\u064A\\u062F\n#XBUT\nButton.Ok=\\u0645\\u0648\\u0627\\u0641\\u0642\n#XBUT\nButton.ShowCatalogs=\\u0625\\u0638\\u0647\\u0627\\u0631 \\u0627\\u0644\\u062F\\u0644\\u0627\\u0626\\u0644\n#XBUT\nButton.HideCatalogs=\\u0625\\u062E\\u0641\\u0627\\u0621 \\u0627\\u0644\\u062F\\u0644\\u0627\\u0626\\u0644\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=\\u0627\\u0644\\u0645\\u0634\\u0643\\u0644\\u0627\\u062A\\: {0}\n#XBUT\nButton.SortCatalogs=\\u062A\\u0628\\u062F\\u064A\\u0644 \\u062A\\u0633\\u0644\\u0633\\u0644 \\u062A\\u0631\\u062A\\u064A\\u0628 \\u0627\\u0644\\u062F\\u0644\\u064A\\u0644\n#XBUT\nButton.CollapseCatalogs=\\u0637\\u064A \\u062C\\u0645\\u064A\\u0639 \\u0627\\u0644\\u062F\\u0644\\u0627\\u0626\\u0644\n#XBUT\nButton.ExpandCatalogs=\\u062A\\u0648\\u0633\\u064A\\u0639 \\u062C\\u0645\\u064A\\u0639 \\u0627\\u0644\\u062F\\u0644\\u0627\\u0626\\u0644\n#XBUT\nButton.ShowDetails=\\u0625\\u0638\\u0647\\u0627\\u0631 \\u0627\\u0644\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644\n#XBUT\nButton.PagePreview=\\u0645\\u0639\\u0627\\u064A\\u0646\\u0629 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629\n#XBUT\nButton.ErrorMsg=\\u0631\\u0633\\u0627\\u0626\\u0644 \\u0627\\u0644\\u062E\\u0637\\u0623\n#XBUT\nButton.EditHeader=\\u062A\\u062D\\u0631\\u064A\\u0631 \\u0627\\u0644\\u0645\\u0642\\u062F\\u0645\\u0629\n#XBUT\nButton.ContextSelector=\\u062A\\u062D\\u062F\\u064A\\u062F \\u0633\\u064A\\u0627\\u0642 \\u0627\\u0644\\u062F\\u0648\\u0631 {0}\n#XBUT\nButton.OverwriteChanges=\\u0627\\u0633\\u062A\\u0628\\u062F\\u0627\\u0644\n#XBUT\nButton.DismissChanges=\\u0631\\u0641\\u0636 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A\n\n#XTOL\nTooltip.AddToSections=\\u0625\\u0636\\u0627\\u0641\\u0629 \\u0625\\u0644\\u0649 \\u0627\\u0644\\u0623\\u0642\\u0633\\u0627\\u0645\n#XTOL: Tooltip for the search button\nTooltip.Search=\\u0628\\u062D\\u062B\n#XTOL\nTooltip.SearchForTiles=\\u0627\\u0644\\u0628\\u062D\\u062B \\u0639\\u0646 \\u0625\\u0637\\u0627\\u0631\\u0627\\u062A\n#XTOL\nTooltip.SearchForRoles=\\u0627\\u0644\\u0628\\u062D\\u062B \\u0639\\u0646 \\u0627\\u0644\\u0623\\u062F\\u0648\\u0627\\u0631\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=\\u0633\\u0637\\u062D \\u0627\\u0644\\u0645\\u0643\\u062A\\u0628\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=\\u0639\\u0631\\u0636 \\u0625\\u0639\\u062F\\u0627\\u062F\\u0627\\u062A \\u0627\\u0644\\u062A\\u0631\\u062A\\u064A\\u0628\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=\\u0639\\u0631\\u0636 \\u0625\\u0639\\u062F\\u0627\\u062F\\u0627\\u062A \\u0627\\u0644\\u062A\\u0635\\u0641\\u064A\\u0629\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=\\u0639\\u0631\\u0636 \\u0625\\u0639\\u062F\\u0627\\u062F\\u0627\\u062A \\u0627\\u0644\\u0645\\u062C\\u0645\\u0648\\u0639\\u0629\n\n#XFLD\nLabel.PageID=\\u0645\\u0639\\u0631\\u0641 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629\n#XFLD\nLabel.Title=\\u0627\\u0644\\u0639\\u0646\\u0648\\u0627\\u0646\n#XFLD\nLabel.WorkbenchRequest=\\u0637\\u0644\\u0628 \\u0645\\u0646\\u0636\\u062F\\u0629 \\u0627\\u0644\\u0639\\u0645\\u0644\n#XFLD\nLabel.Package=\\u0627\\u0644\\u062D\\u0632\\u0645\\u0629\n#XFLD\nLabel.TransportInformation=\\u0645\\u0639\\u0644\\u0648\\u0645\\u0627\\u062A \\u0627\\u0644\\u0646\\u0642\\u0644\n#XFLD\nLabel.Details=\\u0627\\u0644\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644\\:\n#XFLD\nLabel.ResponseCode=\\u0631\\u0645\\u0632 \\u0627\\u0644\\u0627\\u0633\\u062A\\u062C\\u0627\\u0628\\u0629\\:\n#XFLD\nLabel.ModifiedBy=\\u0645\\u0639\\u062F\\u0644 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629\\:\n#XFLD\nLabel.Description=\\u0627\\u0644\\u0648\\u0635\\u0641\n#XFLD\nLabel.CreatedByFullname=\\u062A\\u0645 \\u0627\\u0644\\u0625\\u0646\\u0634\\u0627\\u0621 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629\n#XFLD\nLabel.CreatedOn=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0625\\u0646\\u0634\\u0627\\u0621\n#XFLD\nLabel.ChangedByFullname=\\u062A\\u0645 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629\n#XFLD\nLabel.ChangedOn=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\n#XFLD\nLabel.PageTitle=\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629\n#XFLD\nLabel.AssignedRole=\\u0627\\u0644\\u062F\\u0648\\u0631 \\u0627\\u0644\\u0645\\u0639\\u064A\\u0651\\u064E\\u0646\n\n#XCOL\nColumn.PageID=\\u0627\\u0644\\u0645\\u0639\\u0631\\u0641\n#XCOL\nColumn.PageTitle=\\u0627\\u0644\\u0639\\u0646\\u0648\\u0627\\u0646\n#XCOL\nColumn.PageDescription=\\u0627\\u0644\\u0648\\u0635\\u0641\n#XCOL\nColumn.PageAssignmentStatus=\\u0645\\u0639\\u064A\\u0651\\u064E\\u0646 \\u0625\\u0644\\u0649 \\u0645\\u0633\\u0627\\u062D\\u0629/\\u062F\\u0648\\u0631\n#XCOL\nColumn.PagePackage=\\u0627\\u0644\\u062D\\u0632\\u0645\\u0629\n#XCOL\nColumn.PageWorkbenchRequest=\\u0637\\u0644\\u0628 \\u0645\\u0646\\u0636\\u062F\\u0629 \\u0627\\u0644\\u0639\\u0645\\u0644\n#XCOL\nColumn.PageCreatedBy=\\u062A\\u0645 \\u0627\\u0644\\u0625\\u0646\\u0634\\u0627\\u0621 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629\n#XCOL\nColumn.PageCreatedOn=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0625\\u0646\\u0634\\u0627\\u0621\n#XCOL\nColumn.PageChangedBy=\\u062A\\u0645 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629\n#XCOL\nColumn.PageChangedOn=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\n\n#XTOL\nPlaceholder.SectionName=\\u0623\\u062F\\u062E\\u0644 \\u0627\\u0633\\u0645 \\u0627\\u0644\\u0642\\u0633\\u0645\n#XTOL\nPlaceholder.SearchForTiles=\\u0628\\u062D\\u062B \\u0639\\u0646 \\u0627\\u0644\\u0644\\u0648\\u062D\\u0627\\u062A\n#XTOL\nPlaceholder.SearchForRoles=\\u0627\\u0644\\u0628\\u062D\\u062B \\u0639\\u0646 \\u0627\\u0644\\u0623\\u062F\\u0648\\u0627\\u0631\n#XTOL\nPlaceholder.CopyPageTitle=\\u0646\\u0633\\u062E\\u0629 \\u0645\\u0646 "{0}"\n#XTOL\nPlaceholder.CopyPageID=\\u0646\\u0633\\u062E\\u0629 \\u0645\\u0646 "{0}"\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=\\u0627\\u0644\\u0643\\u0644\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=\\u0627\\u0644\\u0642\\u0633\\u0645 {0} \\u0644\\u064A\\u0633 \\u0644\\u0647 \\u0639\\u0646\\u0648\\u0627\\u0646. \\u0644\\u0644\\u062D\\u0635\\u0648\\u0644 \\u0639\\u0644\\u0649 \\u062A\\u062C\\u0631\\u0628\\u0629 \\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0645\\u062A\\u0633\\u0642\\u0629\\u060C \\u0646\\u0648\\u0635\\u064A\\u0643 \\u0628\\u0625\\u062F\\u062E\\u0627\\u0644 \\u0627\\u0633\\u0645 \\u0644\\u0643\\u0644 \\u0642\\u0633\\u0645.\n#XMSG\nMessage.InvalidSectionTitle=\\u064A\\u062C\\u0628 \\u0639\\u0644\\u064A\\u0643 \\u0625\\u062F\\u062E\\u0627\\u0644 \\u0627\\u0633\\u0645 \\u0627\\u0644\\u0642\\u0633\\u0645 \\u0628\\u0634\\u0643\\u0644 \\u0645\\u062B\\u0627\\u0644\\u064A.\n#XMSG\nMessage.NoInternetConnection=\\u0627\\u0644\\u0631\\u062C\\u0627\\u0621 \\u0641\\u062D\\u0635 \\u0627\\u062A\\u0635\\u0627\\u0644 \\u0627\\u0644\\u0625\\u0646\\u062A\\u0631\\u0646\\u062A.\n#XMSG\nMessage.SavedChanges=\\u062A\\u0645 \\u062D\\u0641\\u0638 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A \\u0627\\u0644\\u062E\\u0627\\u0635\\u0629 \\u0628\\u0643.\n#XMSG\nMessage.InvalidPageID=\\u064A\\u0631\\u062C\\u0649 \\u0641\\u0642\\u0637 \\u0627\\u0633\\u062A\\u062E\\u062F\\u0627\\u0645 \\u0627\\u0644\\u0623\\u062D\\u0631\\u0641 \\u0627\\u0644\\u062A\\u0627\\u0644\\u064A\\u0629\\: A-Z  0-9\\u060C _ \\u0648 /. \\u064A\\u062C\\u0628 \\u0623\\u0644\\u0627 \\u064A\\u0628\\u062F\\u0623 \\u0645\\u0639\\u0631\\u0641 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629 \\u0628\\u0631\\u0642\\u0645.\n#XMSG\nMessage.EmptyPageID=\\u064A\\u0631\\u062C\\u0649 \\u062A\\u0642\\u062F\\u064A\\u0645 \\u0645\\u0639\\u0631\\u0641 \\u0635\\u0641\\u062D\\u0629 \\u0635\\u0627\\u0644\\u062D.\n#XMSG\nMessage.EmptyTitle=\\u064A\\u0631\\u062C\\u0649 \\u062A\\u0642\\u062F\\u064A\\u0645 \\u0639\\u0646\\u0648\\u0627\\u0646 \\u0635\\u0627\\u0644\\u062D.\n#XMSG\nMessage.NoRoleSelected=\\u064A\\u0631\\u062C\\u0649 \\u062A\\u062D\\u062F\\u064A\\u062F \\u062F\\u0648\\u0631 \\u0648\\u0627\\u062D\\u062F \\u0639\\u0644\\u0649 \\u0627\\u0644\\u0623\\u0642\\u0644.\n#XMSG\nMessage.SuccessDeletePage=\\u062A\\u0645 \\u062D\\u0630\\u0641 \\u0627\\u0644\\u0643\\u0627\\u0626\\u0646 \\u0627\\u0644\\u0645\\u062D\\u062F\\u062F.\n#XMSG\nMessage.ClipboardCopySuccess=\\u062A\\u0645 \\u0646\\u0633\\u062E \\u0627\\u0644\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0628\\u0646\\u062C\\u0627\\u062D.\n#YMSE\nMessage.ClipboardCopyFail=\\u062D\\u062F\\u062B \\u062E\\u0637\\u0623 \\u0623\\u062B\\u0646\\u0627\\u0621 \\u0646\\u0633\\u062E \\u0627\\u0644\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644.\n#XMSG\nMessage.PageCreated=\\u062A\\u0645 \\u0625\\u0646\\u0634\\u0627\\u0621 \\u0635\\u0641\\u062D\\u0629.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=\\u0644\\u0627 \\u062A\\u0648\\u062C\\u062F \\u0644\\u0648\\u062D\\u0627\\u062A\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=\\u0644\\u0627 \\u062A\\u062A\\u0648\\u0641\\u0631 \\u0623\\u062F\\u0648\\u0627\\u0631.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=\\u0644\\u0645 \\u064A\\u062A\\u0645 \\u0627\\u0644\\u0639\\u062B\\u0648\\u0631 \\u0639\\u0644\\u0649 \\u0623\\u062F\\u0648\\u0627\\u0631. \\u062D\\u0627\\u0648\\u0644 \\u062A\\u0639\\u062F\\u064A\\u0644 \\u0628\\u062D\\u062B\\u0643.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=\\u0644\\u0627 \\u062A\\u0648\\u062C\\u062F \\u0623\\u0642\\u0633\\u0627\\u0645\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=\\u0641\\u0634\\u0644 \\u062A\\u062D\\u0645\\u064A\\u0644 \\u0625\\u0637\\u0627\\u0631 {0} \\u0641\\u064A \\u0627\\u0644\\u0642\\u0633\\u0645"{1}".\\n\\n\\u0647\\u0630\\u0627 \\u0639\\u0644\\u0649 \\u0627\\u0644\\u0623\\u0631\\u062C\\u062D \\u0628\\u0633\\u0628\\u0628 \\u062A\\u0643\\u0648\\u064A\\u0646 \\u0627\\u0644\\u063A\\u064A\\u0631 \\u0627\\u0644\\u0635\\u062D\\u064A\\u062D \\u0644\\u0645\\u062D\\u062A\\u0648\\u0649 \\u0644\\u0648\\u062D\\u0629 \\u062A\\u0634\\u063A\\u064A\\u0644 SAP Fiori. \\u064A\\u062A\\u0639\\u0630\\u0631 \\u0639\\u0644\\u0649 \\u0627\\u0644\\u0639\\u0631\\u0636 \\u0639\\u0631\\u0636 \\u0627\\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645.\n#XMSG\nMessage.NavigationTargetError=\\u0644\\u0627 \\u064A\\u0645\\u0643\\u0646 \\u062D\\u0644 \\u0645\\u0633\\u062A\\u0647\\u062F\\u0641 \\u0627\\u0644\\u062A\\u0646\\u0642\\u0644.\n#XMSG\nMessage.LoadPageError=\\u062A\\u0639\\u0630\\u0631 \\u062A\\u062D\\u0645\\u064A\\u0644 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629.\n#XMSG\nMessage.UpdatePageError=\\u062A\\u0639\\u0630\\u0631 \\u062A\\u062D\\u062F\\u064A\\u062B \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629.\n#XMSG\nMessage.CreatePageError=\\u062A\\u0639\\u0630\\u0631 \\u0625\\u0646\\u0634\\u0627\\u0621 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629.\n#XMSG\nMessage.TilesHaveErrors=\\u062A\\u062D\\u062A\\u0648\\u064A \\u0628\\u0639\\u0636 \\u0627\\u0644\\u0625\\u0637\\u0627\\u0631\\u0627\\u062A \\u0623\\u0648 \\u0627\\u0644\\u0623\\u0642\\u0633\\u0627\\u0645 \\u0639\\u0644\\u0649 \\u0623\\u062E\\u0637\\u0627\\u0621. \\u0647\\u0644 \\u0623\\u0646\\u062A \\u0645\\u062A\\u0623\\u0643\\u062F \\u0645\\u0646 \\u0623\\u0646\\u0643 \\u062A\\u0631\\u064A\\u062F \\u0645\\u062A\\u0627\\u0628\\u0639\\u0629 \\u0627\\u0644\\u062D\\u0641\\u0638\\u061F\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=\\u0641\\u0634\\u0644 \\u062D\\u0644 \\u0645\\u0633\\u062A\\u0647\\u062F\\u0641 \\u0627\\u0644\\u062A\\u0646\\u0642\\u0644 \\u0644\\u0644\\u0625\\u0637\\u0627\\u0631\\: "{0}".\\n\\n\\u0647\\u0630\\u0627 \\u0639\\u0644\\u0649 \\u0627\\u0644\\u0623\\u0631\\u062C\\u062D \\u0628\\u0633\\u0628\\u0628 \\u0627\\u0644\\u062A\\u0643\\u0648\\u064A\\u0646 \\u063A\\u064A\\u0631 \\u0627\\u0644\\u0635\\u0627\\u0644\\u062D \\u0644\\u0645\\u062D\\u062A\\u0648\\u0649 \\u0644\\u0648\\u062D\\u0629 \\u062A\\u0634\\u063A\\u064A\\u0644 SAP Fiori. \\u064A\\u062A\\u0639\\u0630\\u0631 \\u0639\\u0644\\u0649 \\u0627\\u0644\\u0639\\u0631\\u0636 \\u0641\\u062A\\u062D \\u0627\\u0644\\u062A\\u0637\\u0628\\u064A\\u0642.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0628\\u0627\\u0644\\u062A\\u0623\\u0643\\u064A\\u062F \\u062D\\u0630\\u0641 \\u0627\\u0644\\u0642\\u0633\\u0645 "{0}"\\u061F\n#XMSG\nMessage.Section.DeleteNoTitle=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0628\\u0627\\u0644\\u062A\\u0623\\u0643\\u064A\\u062F \\u062D\\u0630\\u0641 \\u0647\\u0630\\u0627 \\u0627\\u0644\\u0642\\u0633\\u0645\\u061F\n#XMSG\nMessage.OverwriteChanges=\\u0643\\u0627\\u0646\\u062A \\u0647\\u0646\\u0627\\u0643 \\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A \\u0623\\u062B\\u0646\\u0627\\u0621 \\u062A\\u062D\\u0631\\u064A\\u0631 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629. \\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0627\\u0633\\u062A\\u0628\\u062F\\u0627\\u0644\\u0647\\u0627\\u061F\n#XMSG\nMessage.OverwriteRemovedPage=\\u062A\\u0645 \\u062D\\u0630\\u0641 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629 \\u0627\\u0644\\u062A\\u064A \\u062A\\u0639\\u0645\\u0644 \\u0639\\u0644\\u064A\\u0647\\u0627 \\u0645\\u0646 \\u0642\\u0628\\u0644 \\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 \\u0622\\u062E\\u0631. \\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0627\\u0633\\u062A\\u0628\\u062F\\u0627\\u0644 \\u0647\\u0630\\u0627 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\\u061F\n#XMSG\nMessage.SaveChanges=\\u064A\\u0631\\u062C\\u0649 \\u062D\\u0641\\u0638 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A \\u0627\\u0644\\u062E\\u0627\\u0635\\u0629 \\u0628\\u0643.\n#XMSG\nMessage.NoPages=\\u0644\\u0627 \\u062A\\u0648\\u062C\\u062F \\u0635\\u0641\\u062D\\u0627\\u062A \\u0645\\u062A\\u0627\\u062D\\u0629.\n#XMSG\nMessage.NoPagesFound=\\u0644\\u0627 \\u062A\\u0648\\u062C\\u062F \\u0635\\u0641\\u062D\\u0627\\u062A. \\u062D\\u0627\\u0648\\u0644 \\u062A\\u0639\\u062F\\u064A\\u0644 \\u0628\\u062D\\u062B\\u0643.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=\\u0627\\u0644\\u0645\\u062D\\u062A\\u0648\\u0649 \\u0645\\u0642\\u064A\\u0651\\u064E\\u062F \\u0628\\u0633\\u064A\\u0627\\u0642 \\u0627\\u0644\\u062F\\u0648\\u0631.\n#XMSG\nMessage.NotAssigned=\\u0644\\u0645 \\u064A\\u062A\\u0645 \\u062A\\u0639\\u064A\\u064A\\u0646\\u0647.\n#XMSG\nMessage.StatusAssigned=\\u0645\\u0639\\u064A\\u0651\\u064E\\u0646\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=\\u0635\\u0641\\u062D\\u0629 \\u062C\\u062F\\u064A\\u062F\\u0629\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=\\u062A\\u062D\\u062F\\u064A\\u062F \\u0633\\u064A\\u0627\\u0642 \\u0627\\u0644\\u062F\\u0648\\u0631\n#XTIT\nTitle.TilesHaveErrors=\\u062A\\u062D\\u062A\\u0648\\u0649 \\u0627\\u0644\\u0625\\u0637\\u0627\\u0631\\u0627\\u062A \\u0639\\u0644\\u0649 \\u0623\\u062E\\u0637\\u0627\\u0621\n#XTIT\nDeleteDialog.Title=\\u062D\\u0630\\u0641\n#XMSG\nDeleteDialog.Text=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0628\\u0627\\u0644\\u062A\\u0623\\u0643\\u064A\\u062F \\u062D\\u0630\\u0641 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0627\\u062A \\u0627\\u0644\\u0645\\u062D\\u062F\\u062F\\u0629\\u061F\n#XBUT\nDeleteDialog.ConfirmButton=\\u062D\\u0630\\u0641\n#XTIT\nDeleteDialog.LockedTitle=\\u062A\\u0645 \\u062A\\u0623\\u0645\\u064A\\u0646 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629\n#XMSG\nDeleteDialog.LockedText=\\u0627\\u0644\\u0635\\u0641\\u062D\\u0629 \\u0627\\u0644\\u0645\\u062D\\u062F\\u062F\\u0629 \\u0645\\u0624\\u0645\\u0646\\u0629 \\u0645\\u0646 \\u0642\\u0628\\u0644 \\u0627\\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 "{0}".\n#XMSG\nDeleteDialog.TransportRequired=\\u064A\\u0631\\u062C\\u0649 \\u062A\\u062D\\u062F\\u064A\\u062F \\u062D\\u0632\\u0645\\u0629 \\u0627\\u0644\\u0646\\u0642\\u0644 \\u0644\\u062D\\u0630\\u0641 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629 \\u0627\\u0644\\u0645\\u062D\\u062F\\u062F\\u0629.\n\n#XMSG\nEditDialog.LockedText=\\u0627\\u0644\\u0635\\u0641\\u062D\\u0629 \\u0627\\u0644\\u0645\\u062D\\u062F\\u062F\\u0629 \\u0645\\u0624\\u0645\\u0646\\u0629 \\u0645\\u0646 \\u0642\\u0628\\u0644 \\u0627\\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 "{0}".\n#XMSG\nEditDialog.TransportRequired=\\u064A\\u0631\\u062C\\u0649 \\u062A\\u062D\\u062F\\u064A\\u062F \\u062D\\u0632\\u0645\\u0629 \\u0627\\u0644\\u0646\\u0642\\u0644 \\u0644\\u062A\\u062D\\u0631\\u064A\\u0631 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629 \\u0627\\u0644\\u0645\\u062D\\u062F\\u062F\\u0629.\n#XTIT\nEditDialog.Title=\\u062A\\u062D\\u0631\\u064A\\u0631 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=\\u062A\\u0645 \\u0625\\u0646\\u0634\\u0627\\u0621 \\u0647\\u0630\\u0647 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629 \\u0628\\u0627\\u0644\\u0644\\u063A\\u0629 "{0}" \\u0648\\u0644\\u0643\\u0646 \\u062A\\u0645 \\u062A\\u0639\\u064A\\u064A\\u0646 \\u0644\\u063A\\u0629 \\u062A\\u0633\\u062C\\u064A\\u0644 \\u0627\\u0644\\u062F\\u062E\\u0648\\u0644 \\u0627\\u0644\\u062E\\u0627\\u0635\\u0629 \\u0628\\u0643 \\u0625\\u0644\\u0649 "{1}".\\u064A\\u0631\\u062C\\u064A \\u062A\\u063A\\u064A\\u064A\\u0631 \\u0644\\u063A\\u0629 \\u062A\\u0633\\u062C\\u064A\\u0644 \\u0627\\u0644\\u062F\\u062E\\u0648\\u0644 \\u0627\\u0644\\u062E\\u0627\\u0635\\u0629 \\u0628\\u0643 \\u0625\\u0644\\u0649 "{0}" \\u0644\\u0644\\u0645\\u062A\\u0627\\u0628\\u0639\\u0629.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=\\u0627\\u0644\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0627\\u0644\\u0641\\u0631\\u0639\\u064A\n#XFLD\nTileInfoPopover.Label.Icon=\\u0627\\u0644\\u0623\\u064A\\u0642\\u0648\\u0646\\u0629\n#XFLD\nTileInfoPopover.Label.SemanticObject=\\u0627\\u0644\\u0643\\u0627\\u0626\\u0646 \\u0627\\u0644\\u062F\\u0644\\u0627\\u0644\\u064A\n#XFLD\nTileInfoPopover.Label.SemanticAction=\\u0627\\u0644\\u0625\\u062C\\u0631\\u0627\\u0621 \\u0627\\u0644\\u062F\\u0644\\u0627\\u0644\\u064A\n#XFLD\nTileInfoPopover.Label.FioriID=\\u0645\\u0639\\u0631\\u0641 Fiori\n#XFLD\nTileInfoPopover.Label.AppDetail=\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0627\\u0644\\u062A\\u0637\\u0628\\u064A\\u0642\n#XFLD\nTileInfoPopover.Label.AppType=\\u0646\\u0648\\u0639 \\u0627\\u0644\\u062A\\u0637\\u0628\\u064A\\u0642\n#XFLD\nTileInfoPopover.Label.TileType=\\u0646\\u0648\\u0639 \\u0627\\u0644\\u0625\\u0637\\u0627\\u0631\n#XFLD\nTileInfoPopover.Label.AvailableDevices=\\u0627\\u0644\\u0623\\u062C\\u0647\\u0632\\u0629 \\u0627\\u0644\\u0645\\u062A\\u0648\\u0641\\u0631\\u0629\n\n#XTIT\nErrorDialog.Title=\\u062E\\u0637\\u0623\n\n#XTIT\nConfirmChangesDialog.Title=\\u062A\\u062D\\u0630\\u064A\\u0631\n\n#XTIT\nPageOverview.Title=\\u0635\\u064A\\u0627\\u0646\\u0629 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0627\\u062A\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=\\u0627\\u0644\\u0645\\u062E\\u0637\\u0637\n\n#XTIT\nCopyDialog.Title=\\u0646\\u0633\\u062E \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0646\\u0633\\u062E "{0}"\\u061F\n#XFLD\nCopyDialog.NewID=\\u0646\\u0633\\u062E\\u0629 \\u0645\\u0646 "{0}"\n\n#XMSG\nTitle.NoSectionTitle=\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0627\\u0644\\u0642\\u0633\\u0645 \\u0644\\u0644\\u0642\\u0633\\u0645 {0} \\u0641\\u0627\\u0631\\u063A.\n#XMSG\nTitle.UnsufficientRoles=\\u062A\\u0639\\u064A\\u064A\\u0646 \\u062F\\u0648\\u0631 \\u063A\\u064A\\u0631 \\u0643\\u0627\\u0641\\u0650 \\u0644\\u0625\\u0638\\u0647\\u0627\\u0631 \\u0627\\u0644\\u0639\\u0631\\u0636.\n#XMSG\nTitle.VisualizationIsNotVisible=\\u0644\\u0646 \\u064A\\u0643\\u0648\\u0646 \\u0627\\u0644\\u0639\\u0631\\u0636 \\u0642\\u0627\\u0628\\u0644 \\u0644\\u0644\\u0639\\u0631\\u0636.\n#XMSG\nTitle.VisualizationNotNavigateable=\\u062A\\u0639\\u0630\\u0631 \\u0639\\u0644\\u0649 \\u0627\\u0644\\u0639\\u0631\\u0636 \\u0641\\u062A\\u062D \\u0627\\u0644\\u062A\\u0637\\u0628\\u064A\\u0642.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=\\u0625\\u0637\\u0627\\u0631 \\u062B\\u0627\\u0628\\u062A\n#XTIT\nTitle.DynamicTile=\\u0625\\u0637\\u0627\\u0631 \\u062F\\u064A\\u0646\\u0627\\u0645\\u064A\\u0643\\u064A\n#XTIT\nTitle.CustomTile=\\u0625\\u0637\\u0627\\u0631 \\u0645\\u062E\\u0635\\u0635\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=\\u0645\\u0639\\u0627\\u064A\\u0646\\u0629 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=\\u0639\\u0630\\u0631\\u064B\\u0627\\u060C \\u0644\\u0627 \\u064A\\u0645\\u0643\\u0646\\u0646\\u0627 \\u0627\\u0644\\u0639\\u062B\\u0648\\u0631 \\u0639\\u0644\\u0649 \\u0647\\u0630\\u0647 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629.\n#XLNK\nErrorPage.Link=\\u0635\\u064A\\u0627\\u0646\\u0629 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0627\\u062A\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_bg.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=\\u041F\\u043E\\u0434\\u0434\\u0440\\u044A\\u0436\\u043A\\u0430 \\u043D\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0438, \\u043E\\u0431\\u0449\\u0438 \\u0437\\u0430 \\u0432\\u0441\\u0438\\u0447\\u043A\\u0438 \\u043A\\u043B\\u0438\\u0435\\u043D\\u0442\\u0438\n\n#XBUT\nButton.Add=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435\n#XBUT\nButton.Cancel=\\u041E\\u0442\\u043A\\u0430\\u0437\n#XBUT\nButton.ClosePreview=\\u0417\\u0430\\u0442\\u0432\\u0430\\u0440\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u0440\\u0435\\u0434\\u0432\\u0430\\u0440\\u0438\\u0442\\u0435\\u043B\\u043D\\u0438\\u044F \\u043F\\u0440\\u0435\\u0433\\u043B\\u0435\\u0434\n#XBUT\nButton.Copy=\\u041A\\u043E\\u043F\\u0438\\u0440\\u0430\\u043D\\u0435\n#XBUT\nButton.Create=\\u0421\\u044A\\u0437\\u0434\\u0430\\u0432\\u0430\\u043D\\u0435\n#XBUT\nButton.Delete=\\u0418\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435\n#XBUT\nButton.Edit=\\u0420\\u0435\\u0434\\u0430\\u043A\\u0442\\u0438\\u0440\\u0430\\u043D\\u0435\n#XBUT\nButton.Save=\\u0417\\u0430\\u043F\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435\n#XBUT\nButton.Select=\\u0418\\u0437\\u0431\\u043E\\u0440\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=\\u041F\\u043E\\u043A\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043A\\u0430\\u0442\\u0430\\u043B\\u043E\\u0437\\u0438\n#XBUT\nButton.HideCatalogs=\\u0421\\u043A\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043A\\u0430\\u0442\\u0430\\u043B\\u043E\\u0437\\u0438\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=\\u041F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\u0438\\: {0}\n#XBUT\nButton.SortCatalogs=\\u041F\\u0440\\u0435\\u0432\\u043A\\u043B\\u044E\\u0447\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0440\\u0435\\u0434\\u0430 \\u043D\\u0430 \\u0441\\u043E\\u0440\\u0442\\u0438\\u0440\\u0430\\u043D\\u0435 \\u0437\\u0430 \\u043A\\u0430\\u0442\\u0430\\u043B\\u043E\\u0437\\u0438\n#XBUT\nButton.CollapseCatalogs=\\u0421\\u0432\\u0438\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0432\\u0441\\u0438\\u0447\\u043A\\u0438 \\u043A\\u0430\\u0442\\u0430\\u043B\\u043E\\u0437\\u0438\n#XBUT\nButton.ExpandCatalogs=\\u0420\\u0430\\u0437\\u0433\\u0440\\u044A\\u0449\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0432\\u0441\\u0438\\u0447\\u043A\\u0438 \\u043A\\u0430\\u0442\\u0430\\u043B\\u043E\\u0437\\u0438\n#XBUT\nButton.ShowDetails=\\u041F\\u043E\\u043A\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438\n#XBUT\nButton.PagePreview=\\u041F\\u0440\\u0435\\u0434\\u0432\\u0430\\u0440\\u0438\\u0442\\u0435\\u043B\\u0435\\u043D \\u043F\\u0440\\u0435\\u0433\\u043B\\u0435\\u0434 \\u043D\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\\u0442\\u0430\n#XBUT\nButton.ErrorMsg=\\u0421\\u044A\\u043E\\u0431\\u0449\\u0435\\u043D\\u0438\\u044F \\u0437\\u0430 \\u0433\\u0440\\u0435\\u0448\\u043A\\u0438\n#XBUT\nButton.EditHeader=\\u0420\\u0435\\u0434\\u0430\\u043A\\u0442\\u0438\\u0440\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0437\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435\n#XBUT\nButton.ContextSelector=\\u0418\\u0437\\u0431\\u043E\\u0440 \\u043D\\u0430 \\u043A\\u043E\\u043D\\u0442\\u0435\\u043A\\u0441\\u0442 \\u043D\\u0430 \\u0440\\u043E\\u043B\\u044F {0}\n#XBUT\nButton.OverwriteChanges=\\u041F\\u0440\\u0435\\u0437\\u0430\\u043F\\u0438\\u0441\\u0432\\u0430\\u043D\\u0435\n#XBUT\nButton.DismissChanges=\\u041E\\u0442\\u0445\\u0432\\u044A\\u0440\\u043B\\u044F\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438\n\n#XTOL\nTooltip.AddToSections=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435 \\u043A\\u044A\\u043C \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\\u0438\n#XTOL: Tooltip for the search button\nTooltip.Search=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435\n#XTOL\nTooltip.SearchForTiles=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435 \\u0437\\u0430 \\u043F\\u043B\\u043E\\u0447\\u043A\\u0438\n#XTOL\nTooltip.SearchForRoles=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435 \\u043D\\u0430 \\u0440\\u043E\\u043B\\u0438\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=\\u0414\\u0435\\u0441\\u043A\\u0442\\u043E\\u043F\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=\\u041F\\u0440\\u0435\\u0433\\u043B\\u0435\\u0434 \\u043D\\u0430 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438 \\u0437\\u0430 \\u0441\\u043E\\u0440\\u0442\\u0438\\u0440\\u0430\\u043D\\u0435\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=\\u041F\\u0440\\u0435\\u0433\\u043B\\u0435\\u0434 \\u043D\\u0430 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438 \\u0437\\u0430 \\u0444\\u0438\\u043B\\u0442\\u0440\\u0438\\u0440\\u0430\\u043D\\u0435\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=\\u041F\\u0440\\u0435\\u0433\\u043B\\u0435\\u0434 \\u043D\\u0430 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438 \\u0437\\u0430 \\u0433\\u0440\\u0443\\u043F\\u0438\\u0440\\u0430\\u043D\\u0435\n\n#XFLD\nLabel.PageID=\\u0418\\u0414 \\u043D\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\n#XFLD\nLabel.Title=\\u0417\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435\n#XFLD\nLabel.WorkbenchRequest=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u0438\\u043D\\u0441\\u0442\\u0440\\u0443\\u043C\\u0435\\u043D\\u0442\\u0430\\u043B\\u043D\\u0438 \\u0441\\u0440\\u0435\\u0434\\u0441\\u0442\\u0432\\u0430\n#XFLD\nLabel.Package=\\u041F\\u0430\\u043A\\u0435\\u0442\n#XFLD\nLabel.TransportInformation=\\u0418\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0438\\u044F \\u0437\\u0430 \\u0442\\u0440\\u0430\\u043D\\u0441\\u043F\\u043E\\u0440\\u0442\n#XFLD\nLabel.Details=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438\\:\n#XFLD\nLabel.ResponseCode=\\u041A\\u043E\\u0434 \\u043D\\u0430 \\u043E\\u0442\\u0433\\u043E\\u0432\\u043E\\u0440\\:\n#XFLD\nLabel.ModifiedBy=\\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438\\u043B\\:\n#XFLD\nLabel.Description=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\n#XFLD\nLabel.CreatedByFullname=\\u0421\\u044A\\u0437\\u0434\\u0430\\u043B\n#XFLD\nLabel.CreatedOn=\\u0421\\u044A\\u0437\\u0434\\u0430\\u0434\\u0435\\u043D \\u043D\\u0430\n#XFLD\nLabel.ChangedByFullname=\\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438\\u043B\n#XFLD\nLabel.ChangedOn=\\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0435\\u043D \\u043D\\u0430\n#XFLD\nLabel.PageTitle=\\u0417\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435 \\u043D\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\n#XFLD\nLabel.AssignedRole=\\u041F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u0435\\u043D\\u0430 \\u0440\\u043E\\u043B\\u044F\n\n#XCOL\nColumn.PageID=\\u0418\\u0414\n#XCOL\nColumn.PageTitle=\\u0417\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435\n#XCOL\nColumn.PageDescription=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\n#XCOL\nColumn.PageAssignmentStatus=\\u041F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u0435\\u043D\\u043E \\u043A\\u044A\\u043C \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E/\\u0440\\u043E\\u043B\\u044F\n#XCOL\nColumn.PagePackage=\\u041F\\u0430\\u043A\\u0435\\u0442\n#XCOL\nColumn.PageWorkbenchRequest=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u0438\\u043D\\u0441\\u0442\\u0440\\u0443\\u043C\\u0435\\u043D\\u0442\\u0430\\u043B\\u043D\\u0438 \\u0441\\u0440\\u0435\\u0434\\u0441\\u0442\\u0432\\u0430\n#XCOL\nColumn.PageCreatedBy=\\u0421\\u044A\\u0437\\u0434\\u0430\\u043B\n#XCOL\nColumn.PageCreatedOn=\\u0421\\u044A\\u0437\\u0434\\u0430\\u0434\\u0435\\u043D \\u043D\\u0430\n#XCOL\nColumn.PageChangedBy=\\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0435\\u043D \\u043E\\u0442\n#XCOL\nColumn.PageChangedOn=\\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0435\\u043D \\u043D\\u0430\n\n#XTOL\nPlaceholder.SectionName=\\u0412\\u044A\\u0432\\u0435\\u0434\\u0435\\u0442\\u0435 \\u0438\\u043C\\u0435 \\u043D\\u0430 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\n#XTOL\nPlaceholder.SearchForTiles=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435 \\u043D\\u0430 \\u0447\\u0430\\u0441\\u0442\\u0438 \\u043E\\u0442 \\u0435\\u043A\\u0440\\u0430\\u043D\n#XTOL\nPlaceholder.SearchForRoles=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435 \\u043D\\u0430 \\u0440\\u043E\\u043B\\u0438\n#XTOL\nPlaceholder.CopyPageTitle=\\u041A\\u043E\\u043F\\u0438\\u0435 \\u043D\\u0430 \\u201C{0}\\u201D\n#XTOL\nPlaceholder.CopyPageID=\\u041A\\u043E\\u043F\\u0438\\u0435 \\u043D\\u0430 \\u201C{0}\\u201D\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=\\u0432\\u0441\\u0438\\u0447\\u043A\\u0438\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=\\u0420\\u0430\\u0437\\u0434\\u0435\\u043B {0} \\u043D\\u044F\\u043C\\u0430 \\u0437\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435. \\u0421 \\u0446\\u0435\\u043B \\u043F\\u043E\\u0441\\u043B\\u0435\\u0434\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u043D\\u043E \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B\\u0441\\u043A\\u043E \\u043F\\u0440\\u0435\\u0436\\u0438\\u0432\\u044F\\u0432\\u0430\\u043D\\u0435, \\u043F\\u0440\\u0435\\u043F\\u043E\\u0440\\u044A\\u0447\\u0432\\u0430\\u043C\\u0435 \\u0432\\u0438 \\u0434\\u0430 \\u0432\\u044A\\u0432\\u0435\\u0436\\u0434\\u0430\\u0442\\u0435 \\u0438\\u043C\\u0435 \\u043D\\u0430 \\u0432\\u0441\\u0435\\u043A\\u0438 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B.\n#XMSG\nMessage.InvalidSectionTitle=\\u0412 \\u0438\\u0434\\u0435\\u044F\\u043B\\u043D\\u0438\\u044F \\u0441\\u043B\\u0443\\u0447\\u0430\\u0439 \\u0442\\u0440\\u044F\\u0431\\u0432\\u0430 \\u0434\\u0430 \\u0432\\u044A\\u0432\\u0435\\u0434\\u0435\\u0442\\u0435 \\u0438\\u043C\\u0435 \\u043D\\u0430 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B.\n#XMSG\nMessage.NoInternetConnection=\\u041C\\u043E\\u043B\\u044F, \\u043F\\u0440\\u043E\\u0432\\u0435\\u0440\\u0435\\u0442\\u0435 \\u0438\\u043D\\u0442\\u0435\\u0440\\u043D\\u0435\\u0442 \\u0432\\u0440\\u044A\\u0437\\u043A\\u0430\\u0442\\u0430 \\u0441\\u0438.\n#XMSG\nMessage.SavedChanges=\\u0412\\u0430\\u0448\\u0438\\u0442\\u0435 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438 \\u0441\\u0430 \\u0437\\u0430\\u043F\\u0430\\u0437\\u0435\\u043D\\u0438.\n#XMSG\nMessage.InvalidPageID=\\u041C\\u043E\\u043B\\u044F, \\u0438\\u0437\\u043F\\u043E\\u043B\\u0437\\u0432\\u0430\\u0439\\u0442\\u0435 \\u0441\\u0430\\u043C\\u043E \\u0441\\u043B\\u0435\\u0434\\u043D\\u0438\\u0442\\u0435 \\u0441\\u0438\\u043C\\u0432\\u043E\\u043B\\u0438\\: A-Z, 0-9, _ \\u0438 /. \\u0418\\u0414 \\u043D\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\\u0442\\u0430 \\u043D\\u0435 \\u043C\\u043E\\u0436\\u0435 \\u0434\\u0430 \\u0437\\u0430\\u043F\\u043E\\u0447\\u0432\\u0430 \\u0441 \\u0446\\u0438\\u0444\\u0440\\u0430.\n#XMSG\nMessage.EmptyPageID=\\u041C\\u043E\\u043B\\u044F, \\u0434\\u0430\\u0439\\u0442\\u0435 \\u0432\\u0430\\u043B\\u0438\\u0434\\u0435\\u043D \\u0418\\u0414 \\u043D\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430.\n#XMSG\nMessage.EmptyTitle=\\u041C\\u043E\\u043B\\u044F, \\u0434\\u0430\\u0439\\u0442\\u0435 \\u0432\\u0430\\u043B\\u0438\\u0434\\u043D\\u043E \\u0437\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435.\n#XMSG\nMessage.NoRoleSelected=\\u041C\\u043E\\u043B\\u044F, \\u0438\\u0437\\u0431\\u0435\\u0440\\u0435\\u0442\\u0435 \\u043D\\u0430\\u0439-\\u043C\\u0430\\u043B\\u043A\\u043E \\u0435\\u0434\\u043D\\u0430 \\u0440\\u043E\\u043B\\u044F.\n#XMSG\nMessage.SuccessDeletePage=\\u0418\\u0437\\u0431\\u0440\\u0430\\u043D\\u0438\\u044F\\u0442 \\u043E\\u0431\\u0435\\u043A\\u0442 \\u0435 \\u0438\\u0437\\u0442\\u0440\\u0438\\u0442.\n#XMSG\nMessage.ClipboardCopySuccess=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438\\u0442\\u0435 \\u0434\\u0430\\u043D\\u043D\\u0438 \\u0441\\u0430 \\u043A\\u043E\\u043F\\u0438\\u0440\\u0430\\u043D\\u0438 \\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u043E.\n#YMSE\nMessage.ClipboardCopyFail=\\u0412\\u044A\\u0437\\u043D\\u0438\\u043A\\u043D\\u0430 \\u0433\\u0440\\u0435\\u0448\\u043A\\u0430 \\u043F\\u043E \\u0432\\u0440\\u0435\\u043C\\u0435 \\u043D\\u0430 \\u043A\\u043E\\u043F\\u0438\\u0440\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438.\n#XMSG\nMessage.PageCreated=\\u0421\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\\u0442\\u0430 \\u0435 \\u0441\\u044A\\u0437\\u0434\\u0430\\u0434\\u0435\\u043D\\u0430.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=\\u0411\\u0435\\u0437 \\u0447\\u0430\\u0441\\u0442\\u0438 \\u043E\\u0442 \\u0435\\u043A\\u0440\\u0430\\u043D\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=\\u041D\\u044F\\u043C\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u0440\\u043E\\u043B\\u0438.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=\\u041D\\u0435 \\u0441\\u0430 \\u043D\\u0430\\u043C\\u0435\\u0440\\u0435\\u043D\\u0438 \\u0440\\u043E\\u043B\\u0438. \\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0435\\u0442\\u0435 \\u043A\\u0440\\u0438\\u0442\\u0435\\u0440\\u0438\\u0438\\u0442\\u0435 \\u0437\\u0430 \\u0442\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=\\u0411\\u0435\\u0437 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\\u0438\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=\\u041D\\u0435\\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u043E \\u0437\\u0430\\u0440\\u0435\\u0436\\u0434\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u043B\\u043E\\u0447\\u043A\\u0430\\u0442\\u0430 {0} \\u0432 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B "{1}".\\n\\n\\u041F\\u0440\\u0438\\u0447\\u0438\\u043D\\u0430\\u0442\\u0430 \\u0437\\u0430 \\u0442\\u043E\\u0432\\u0430 \\u043D\\u0430\\u0439-\\u0432\\u0435\\u0440\\u043E\\u044F\\u0442\\u043D\\u043E \\u0435 \\u0433\\u0440\\u0435\\u0448\\u043D\\u0430 \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F \\u043D\\u0430 \\u0441\\u044A\\u0434\\u044A\\u0440\\u0436\\u0430\\u043D\\u0438\\u0435\\u0442\\u043E \\u043D\\u0430 \\u043A\\u043E\\u043D\\u0442\\u0440\\u043E\\u043B\\u043D\\u0438\\u044F \\u043F\\u0430\\u043D\\u0435\\u043B \\u043D\\u0430 SAP Fiori. \\u0412\\u0438\\u0437\\u0443\\u0430\\u043B\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F\\u0442\\u0430 \\u043D\\u044F\\u043C\\u0430 \\u0434\\u0430 \\u0431\\u044A\\u0434\\u0435 \\u043F\\u043E\\u043A\\u0430\\u0437\\u0430\\u043D\\u0430 \\u0437\\u0430 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B\\u044F.\n#XMSG\nMessage.NavigationTargetError=\\u041D\\u0430\\u0432\\u0438\\u0433\\u0430\\u0446\\u0438\\u043E\\u043D\\u043D\\u0430\\u0442\\u0430 \\u0446\\u0435\\u043B \\u043D\\u0435 \\u043C\\u043E\\u0436\\u0435 \\u0434\\u0430 \\u0431\\u044A\\u0434\\u0435 \\u0440\\u0435\\u0448\\u0435\\u043D\\u0430.\n#XMSG\nMessage.LoadPageError=\\u0421\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\\u0442\\u0430 \\u043D\\u0435 \\u0431\\u0435\\u0448\\u0435 \\u0437\\u0430\\u0440\\u0435\\u0434\\u0435\\u043D\\u0430.\n#XMSG\nMessage.UpdatePageError=\\u0421\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\\u0442\\u0430 \\u043D\\u0435 \\u0431\\u0435\\u0448\\u0435 \\u0430\\u043A\\u0442\\u0443\\u0430\\u043B\\u0438\\u0437\\u0438\\u0440\\u0430\\u043D\\u0430.\n#XMSG\nMessage.CreatePageError=\\u0421\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\\u0442\\u0430 \\u043D\\u0435 \\u0431\\u0435\\u0448\\u0435 \\u0441\\u044A\\u0437\\u0434\\u0430\\u0434\\u0435\\u043D\\u0430.\n#XMSG\nMessage.TilesHaveErrors=\\u041D\\u044F\\u043A\\u043E\\u0438 \\u043E\\u0442 \\u043F\\u043B\\u043E\\u0447\\u043A\\u0438\\u0442\\u0435 \\u0438\\u043B\\u0438 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\\u0438\\u0442\\u0435 \\u0438\\u043C\\u0430\\u0442 \\u0433\\u0440\\u0435\\u0448\\u043A\\u0438. \\u041D\\u0430\\u0438\\u0441\\u0442\\u0438\\u043D\\u0430 \\u043B\\u0438 \\u0438\\u0441\\u043A\\u0430\\u0442\\u0435 \\u0434\\u0430 \\u043F\\u0440\\u043E\\u0434\\u044A\\u043B\\u0436\\u0438\\u0442\\u0435 \\u0441\\u044A\\u0441 \\u0437\\u0430\\u043F\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435\\u0442\\u043E?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=\\u041D\\u0435\\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u043E \\u0440\\u0435\\u0448\\u0430\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043D\\u0430\\u0432\\u0438\\u0433\\u0430\\u0446\\u0438\\u043E\\u043D\\u043D\\u0430\\u0442\\u0430 \\u0446\\u0435\\u043B \\u043D\\u0430 \\u043F\\u043B\\u043E\\u0447\\u043A\\u0430\\u0442\\u0430 "{0}".\\n\\n\\u041F\\u0440\\u0438\\u0447\\u0438\\u043D\\u0430\\u0442\\u0430 \\u043D\\u0430\\u0439-\\u0432\\u0435\\u0440\\u043E\\u044F\\u0442\\u043D\\u043E \\u0435 \\u0433\\u0440\\u0435\\u0448\\u043D\\u0430 \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F \\u043D\\u0430 \\u0441\\u044A\\u0434\\u044A\\u0440\\u0436\\u0430\\u043D\\u0438\\u0435\\u0442\\u043E \\u043D\\u0430 \\u043A\\u043E\\u043D\\u0442\\u0440\\u043E\\u043B\\u043D\\u0438\\u044F \\u043F\\u0430\\u043D\\u0435\\u043B \\u043D\\u0430 SAP Fiori. \\u0412\\u0438\\u0437\\u0443\\u0430\\u043B\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F\\u0442\\u0430 \\u043D\\u0435 \\u043C\\u043E\\u0436\\u0435 \\u0434\\u0430 \\u043E\\u0442\\u0432\\u043E\\u0440\\u0438 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0435.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=\\u0421\\u0438\\u0433\\u0443\\u0440\\u043D\\u0438 \\u043B\\u0438 \\u0441\\u0442\\u0435, \\u0447\\u0435 \\u0436\\u0435\\u043B\\u0430\\u0435\\u0442\\u0435 \\u0434\\u0430 \\u0438\\u0437\\u0442\\u0440\\u0438\\u0435\\u0442\\u0435 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B "{0}"?\n#XMSG\nMessage.Section.DeleteNoTitle=\\u0421\\u0438\\u0433\\u0443\\u0440\\u0435\\u043D \\u043B\\u0438 \\u0441\\u0442\\u0435, \\u0447\\u0435 \\u0436\\u0435\\u043B\\u0430\\u0435\\u0442\\u0435 \\u0434\\u0430 \\u0438\\u0437\\u0442\\u0440\\u0438\\u0435\\u0442\\u0435 \\u0442\\u043E\\u0437\\u0438 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B?\n#XMSG\nMessage.OverwriteChanges=\\u041D\\u0430\\u0441\\u0442\\u044A\\u043F\\u0438\\u043B\\u0438 \\u0441\\u0430 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438 \\u043F\\u043E \\u0432\\u0440\\u0435\\u043C\\u0435 \\u043D\\u0430 \\u0440\\u0435\\u0434\\u0430\\u043A\\u0442\\u0438\\u0440\\u0430\\u043D\\u0435\\u0442\\u043E \\u043D\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\\u0442\\u0430. \\u0416\\u0435\\u043B\\u0430\\u0435\\u0442\\u0435 \\u043B\\u0438 \\u0434\\u0430 \\u0433\\u0438 \\u0438\\u0433\\u043D\\u043E\\u0440\\u0438\\u0440\\u0430\\u0442\\u0435?\n#XMSG\nMessage.OverwriteRemovedPage=\\u0421\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\\u0442\\u0430, \\u043F\\u043E \\u043A\\u043E\\u044F\\u0442\\u043E \\u0440\\u0430\\u0431\\u043E\\u0442\\u0438\\u0442\\u0435, \\u0435 \\u0431\\u0438\\u043B\\u0430 \\u0438\\u0437\\u0442\\u0440\\u0438\\u0442\\u0430 \\u043E\\u0442 \\u0434\\u0440\\u0443\\u0433 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B. \\u0416\\u0435\\u043B\\u0430\\u0435\\u0442\\u0435 \\u043B\\u0438 \\u0434\\u0430 \\u0438\\u0433\\u043D\\u043E\\u0440\\u0438\\u0440\\u0430\\u0442\\u0435 \\u0442\\u0430\\u0437\\u0438 \\u043F\\u0440\\u043E\\u043C\\u044F\\u043D\\u0430?\n#XMSG\nMessage.SaveChanges=\\u041C\\u043E\\u043B\\u044F, \\u0437\\u0430\\u043F\\u0430\\u0437\\u0435\\u0442\\u0435 \\u043D\\u0430\\u043F\\u0440\\u0430\\u0432\\u0435\\u043D\\u0438\\u0442\\u0435 \\u043E\\u0442 \\u0432\\u0430\\u0441 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438.\n#XMSG\nMessage.NoPages=\\u041D\\u044F\\u043C\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0438.\n#XMSG\nMessage.NoPagesFound=\\u041D\\u0435 \\u0441\\u0430 \\u043D\\u0430\\u043C\\u0435\\u0440\\u0435\\u043D\\u0438 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0438. \\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0435\\u0442\\u0435 \\u043A\\u0440\\u0438\\u0442\\u0435\\u0440\\u0438\\u0438\\u0442\\u0435 \\u0437\\u0430 \\u0442\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=\\u0421\\u044A\\u0434\\u044A\\u0440\\u0436\\u0430\\u043D\\u0438\\u0435\\u0442\\u043E \\u0435 \\u043E\\u0433\\u0440\\u0430\\u043D\\u0438\\u0447\\u0435\\u043D\\u043E \\u0434\\u043E \\u043A\\u043E\\u043D\\u0442\\u0435\\u043A\\u0441\\u0442\\u0430 \\u043D\\u0430 \\u0440\\u043E\\u043B\\u044F\\u0442\\u0430.\n#XMSG\nMessage.NotAssigned=\\u041D\\u0435 \\u0435 \\u043F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u0435\\u043D\\u043E.\n#XMSG\nMessage.StatusAssigned=\\u041F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u0435\\u043D\\u043E\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=\\u041D\\u043E\\u0432\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=\\u0418\\u0437\\u0431\\u043E\\u0440 \\u043D\\u0430 \\u043A\\u043E\\u043D\\u0442\\u0435\\u043A\\u0441\\u0442 \\u043D\\u0430 \\u0440\\u043E\\u043B\\u044F\n#XTIT\nTitle.TilesHaveErrors=\\u0412 \\u043F\\u043B\\u043E\\u0447\\u043A\\u0438\\u0442\\u0435 \\u0438\\u043C\\u0430 \\u0433\\u0440\\u0435\\u0448\\u043A\\u0438\n#XTIT\nDeleteDialog.Title=\\u0418\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435\n#XMSG\nDeleteDialog.Text=\\u041D\\u0430\\u0438\\u0441\\u0442\\u0438\\u043D\\u0430 \\u043B\\u0438 \\u0436\\u0435\\u043B\\u0430\\u0435\\u0442\\u0435 \\u0434\\u0430 \\u0438\\u0437\\u0442\\u0440\\u0438\\u0435\\u0442\\u0435 \\u0438\\u0437\\u0431\\u0440\\u0430\\u043D\\u0430\\u0442\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430?\n#XBUT\nDeleteDialog.ConfirmButton=\\u0418\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435\n#XTIT\nDeleteDialog.LockedTitle=\\u0421\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\\u0442\\u0430 \\u0435 \\u0437\\u0430\\u043A\\u043B\\u044E\\u0447\\u0435\\u043D\\u0430\n#XMSG\nDeleteDialog.LockedText=\\u0418\\u0437\\u0431\\u0440\\u0430\\u043D\\u0430\\u0442\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430 \\u0435 \\u0437\\u0430\\u043A\\u043B\\u044E\\u0447\\u0435\\u043D\\u0430 \\u043E\\u0442 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B \\u201C{0}\\u201D.\n#XMSG\nDeleteDialog.TransportRequired=\\u041C\\u043E\\u043B\\u044F, \\u0438\\u0437\\u0431\\u0435\\u0440\\u0435\\u0442\\u0435 \\u043F\\u0430\\u043A\\u0435\\u0442 \\u0437\\u0430 \\u043F\\u0440\\u0435\\u043D\\u043E\\u0441, \\u0437\\u0430 \\u0434\\u0430 \\u0438\\u0437\\u0442\\u0440\\u0438\\u0435\\u0442\\u0435 \\u0438\\u0437\\u0431\\u0440\\u0430\\u043D\\u0430\\u0442\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430.\n\n#XMSG\nEditDialog.LockedText=\\u0418\\u0437\\u0431\\u0440\\u0430\\u043D\\u0430\\u0442\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430 \\u0435 \\u0437\\u0430\\u043A\\u043B\\u044E\\u0447\\u0435\\u043D\\u0430 \\u043E\\u0442 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B \\u201C{0}\\u201D.\n#XMSG\nEditDialog.TransportRequired=\\u041C\\u043E\\u043B\\u044F, \\u0438\\u0437\\u0431\\u0435\\u0440\\u0435\\u0442\\u0435 \\u043F\\u0430\\u043A\\u0435\\u0442 \\u0437\\u0430 \\u043F\\u0440\\u0435\\u043D\\u043E\\u0441, \\u0437\\u0430 \\u0434\\u0430 \\u0440\\u0435\\u0434\\u0430\\u043A\\u0442\\u0438\\u0440\\u0430\\u0442\\u0435 \\u0438\\u0437\\u0431\\u0440\\u0430\\u043D\\u0430\\u0442\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430.\n#XTIT\nEditDialog.Title=\\u0420\\u0435\\u0434\\u0430\\u043A\\u0442\\u0438\\u0440\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=\\u0422\\u0430\\u0437\\u0438 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430 \\u0435 \\u0441\\u044A\\u0437\\u0434\\u0430\\u0434\\u0435\\u043D\\u0430 \\u043D\\u0430 "{0}", \\u0430 \\u0435\\u0437\\u0438\\u043A\\u044A\\u0442, \\u0441 \\u043A\\u043E\\u0439\\u0442\\u043E \\u0441\\u0442\\u0435 \\u0432\\u043B\\u0435\\u0437\\u043B\\u0438 \\u0432 \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0430\\u0442\\u0430 \\u0435 "{1}". \\u0417\\u0430 \\u0434\\u0430 \\u043F\\u0440\\u043E\\u0434\\u044A\\u043B\\u0436\\u0438\\u0442\\u0435, \\u043C\\u043E\\u043B\\u044F \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0435\\u0442\\u0435 \\u0435\\u0437\\u0438\\u043A\\u0430, \\u0441 \\u043A\\u043E\\u0439\\u0442\\u043E \\u0432\\u043B\\u0438\\u0437\\u0430\\u0442\\u0435 \\u0432 \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0430\\u0442\\u0430 \\u043D\\u0430 "{0}" .\n\n#XFLD\nTileInfoPopover.Label.Subtitle=\\u041F\\u043E\\u0434\\u0437\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435\n#XFLD\nTileInfoPopover.Label.Icon=\\u0418\\u043A\\u043E\\u043D\\u0430\n#XFLD\nTileInfoPopover.Label.SemanticObject=\\u0421\\u0435\\u043C\\u0430\\u043D\\u0442\\u0438\\u0447\\u0435\\u043D \\u043E\\u0431\\u0435\\u043A\\u0442\n#XFLD\nTileInfoPopover.Label.SemanticAction=\\u0421\\u0435\\u043C\\u0430\\u043D\\u0442\\u0438\\u0447\\u043D\\u043E \\u0434\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0435\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori \\u0418\\u0414\n#XFLD\nTileInfoPopover.Label.AppDetail=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438 \\u0437\\u0430 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0435\n#XFLD\nTileInfoPopover.Label.AppType=\\u0412\\u0438\\u0434 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0435\n#XFLD\nTileInfoPopover.Label.TileType=\\u0412\\u0438\\u0434 \\u043F\\u043B\\u043E\\u0447\\u043A\\u0430\n#XFLD\nTileInfoPopover.Label.AvailableDevices=\\u041D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u0443\\u0441\\u0442\\u0440\\u043E\\u0439\\u0441\\u0442\\u0432\\u0430\n\n#XTIT\nErrorDialog.Title=\\u0413\\u0440\\u0435\\u0448\\u043A\\u0430\n\n#XTIT\nConfirmChangesDialog.Title=\\u041F\\u0440\\u0435\\u0434\\u0443\\u043F\\u0440\\u0435\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435\n\n#XTIT\nPageOverview.Title=\\u041F\\u043E\\u0434\\u0434\\u0440\\u044A\\u0436\\u043A\\u0430 \\u043D\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0438\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=\\u0424\\u043E\\u0440\\u043C\\u0430\\u0442\n\n#XTIT\nCopyDialog.Title=\\u041A\\u043E\\u043F\\u0438\\u0440\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=\\u0416\\u0435\\u043B\\u0430\\u0435\\u0442\\u0435 \\u043B\\u0438 \\u0434\\u0430 \\u043A\\u043E\\u043F\\u0438\\u0440\\u0430\\u0442\\u0435 {0}?\n#XFLD\nCopyDialog.NewID=\\u041A\\u043E\\u043F\\u0438\\u0435 \\u043D\\u0430 \\u201C{0}\\u201D\n\n#XMSG\nTitle.NoSectionTitle=\\u0417\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435\\u0442\\u043E \\u043D\\u0430 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B {0} \\u0435 \\u043F\\u0440\\u0430\\u0437\\u043D\\u043E.\n#XMSG\nTitle.UnsufficientRoles=\\u041D\\u0435\\u0434\\u043E\\u0441\\u0442\\u0430\\u0442\\u044A\\u0447\\u043D\\u043E \\u043F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u044F\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0440\\u043E\\u043B\\u0438 \\u0437\\u0430 \\u043F\\u043E\\u043A\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0432\\u0438\\u0437\\u0443\\u0430\\u043B\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F.\n#XMSG\nTitle.VisualizationIsNotVisible=\\u0412\\u0438\\u0437\\u0443\\u0430\\u043B\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F\\u0442\\u0430 \\u043D\\u044F\\u043C\\u0430 \\u0434\\u0430 \\u0431\\u044A\\u0434\\u0435 \\u043F\\u043E\\u043A\\u0430\\u0437\\u0430\\u043D\\u0430.\n#XMSG\nTitle.VisualizationNotNavigateable=\\u0412\\u0438\\u0437\\u0443\\u0430\\u043B\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F\\u0442\\u0430 \\u043D\\u0435 \\u043C\\u043E\\u0436\\u0435 \\u0434\\u0430 \\u043E\\u0442\\u0432\\u043E\\u0440\\u0438 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0435.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=\\u0421\\u0442\\u0430\\u0442\\u0438\\u0447\\u043D\\u0430 \\u043F\\u043B\\u043E\\u0447\\u043A\\u0430\n#XTIT\nTitle.DynamicTile=\\u0414\\u0438\\u043D\\u0430\\u043C\\u0438\\u0447\\u043D\\u0430 \\u043F\\u043B\\u043E\\u0447\\u043A\\u0430\n#XTIT\nTitle.CustomTile=\\u041F\\u0435\\u0440\\u0441\\u043E\\u043D\\u0430\\u043B\\u0438\\u0437\\u0438\\u0440\\u0430\\u043D\\u0430 \\u043F\\u043B\\u043E\\u0447\\u043A\\u0430\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=\\u041F\\u0440\\u0435\\u0434\\u0432\\u0430\\u0440\\u0438\\u0442\\u0435\\u043B\\u0435\\u043D \\u043F\\u0440\\u0435\\u0433\\u043B\\u0435\\u0434 \\u043D\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\\u0442\\u0430 {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=\\u0421\\u044A\\u0436\\u0430\\u043B\\u044F\\u0432\\u0430\\u043C\\u0435, \\u043D\\u0435 \\u043C\\u043E\\u0436\\u0435\\u043C \\u0434\\u0430 \\u043E\\u0442\\u043A\\u0440\\u0438\\u0435\\u043C \\u0442\\u0430\\u0437\\u0438 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430.\n#XLNK\nErrorPage.Link=\\u041F\\u043E\\u0434\\u0434\\u0440\\u044A\\u0436\\u043A\\u0430 \\u043D\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0438\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_ca.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=Actualitzar p\\u00E0gines de tots els clients\n\n#XBUT\nButton.Add=Afegir\n#XBUT\nButton.Cancel=Cancel\\u00B7lar\n#XBUT\nButton.ClosePreview=Tancar vista pr\\u00E8via\n#XBUT\nButton.Copy=Copiar\n#XBUT\nButton.Create=Crear\n#XBUT\nButton.Delete=Suprimir\n#XBUT\nButton.Edit=Tractar\n#XBUT\nButton.Save=Desar\n#XBUT\nButton.Select=Seleccionar\n#XBUT\nButton.Ok=D\'acord\n#XBUT\nButton.ShowCatalogs=Mostrar cat\\u00E0legs\n#XBUT\nButton.HideCatalogs=Ocultar cat\\u00E0legs\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Problemes\\: {0}\n#XBUT\nButton.SortCatalogs=Alternar ordre de classificaci\\u00F3 del cat\\u00E0leg\n#XBUT\nButton.CollapseCatalogs=Comprimir tots els cat\\u00E0legs\n#XBUT\nButton.ExpandCatalogs=Desplegar tots els cat\\u00E0legs\n#XBUT\nButton.ShowDetails=Mostrar detalls\n#XBUT\nButton.PagePreview=Previsualitzaci\\u00F3 de p\\u00E0gina\n#XBUT\nButton.ErrorMsg=Missatges d\'error\n#XBUT\nButton.EditHeader=Editar cap\\u00E7alera\n#XBUT\nButton.ContextSelector=Seleccionar el context de rol {0}\n#XBUT\nButton.OverwriteChanges=Sobreescriure\n#XBUT\nButton.DismissChanges=Descartar les modificacions\n\n#XTOL\nTooltip.AddToSections=Afegir a les seccions\n#XTOL: Tooltip for the search button\nTooltip.Search=Cercar\n#XTOL\nTooltip.SearchForTiles=Cercar mosaics\n#XTOL\nTooltip.SearchForRoles=Cercar rols\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Escriptori\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=Visualitzar les opcions de classificaci\\u00F3\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=Visualitzar les opcions de filtre\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=Visualitzar les opcions de gruc\n\n#XFLD\nLabel.PageID=ID de p\\u00E0gina\n#XFLD\nLabel.Title=T\\u00EDtol\n#XFLD\nLabel.WorkbenchRequest=Ordre de workenbch\n#XFLD\nLabel.Package=Paquet\n#XFLD\nLabel.TransportInformation=Informaci\\u00F3 de transport\n#XFLD\nLabel.Details=Detalls\\:\n#XFLD\nLabel.ResponseCode=Codi de resposta\\:\n#XFLD\nLabel.ModifiedBy=Modificat per\\:\n#XFLD\nLabel.Description=Descripci\\u00F3\n#XFLD\nLabel.CreatedByFullname=Creat per\n#XFLD\nLabel.CreatedOn=Creat el\n#XFLD\nLabel.ChangedByFullname=Modificat per\n#XFLD\nLabel.ChangedOn=Modificat el\n#XFLD\nLabel.PageTitle=T\\u00EDtol de p\\u00E0gina\n#XFLD\nLabel.AssignedRole=Rol assignat\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=T\\u00EDtol\n#XCOL\nColumn.PageDescription=Descripci\\u00F3\n#XCOL\nColumn.PageAssignmentStatus=Assignat a espai/rol\n#XCOL\nColumn.PagePackage=Paquet\n#XCOL\nColumn.PageWorkbenchRequest=Ordre de workenbch\n#XCOL\nColumn.PageCreatedBy=Creat per\n#XCOL\nColumn.PageCreatedOn=Creat el\n#XCOL\nColumn.PageChangedBy=Modificat per\n#XCOL\nColumn.PageChangedOn=Modificat el\n\n#XTOL\nPlaceholder.SectionName=Introdu\\u00EFu un nom de secci\\u00F3\n#XTOL\nPlaceholder.SearchForTiles=Cercar mosaics\n#XTOL\nPlaceholder.SearchForRoles=Cercar rols\n#XTOL\nPlaceholder.CopyPageTitle=C\\u00F2pia de "{0}"\n#XTOL\nPlaceholder.CopyPageID=C\\u00F2pia de "{0}"\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=tot\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=La secci\\u00F3 {0} no t\\u00E9 t\\u00EDtol. Per gaudir d\\u2019una experi\\u00E8ncia d\\u2019usuari consistent, us recomanem que escriviu un nom per a cada secci\\u00F3.\n#XMSG\nMessage.InvalidSectionTitle=Haur\\u00EDeu d\\u2019escriure un nom de secci\\u00F3.\n#XMSG\nMessage.NoInternetConnection=Verifiqueu la connexi\\u00F3 a Internet.\n#XMSG\nMessage.SavedChanges=S\'han desat les modificacions.\n#XMSG\nMessage.InvalidPageID=Feu servir nom\\u00E9s els seg\\u00FCents car\\u00E0cters\\: A-Z a-z 0-9 _ i /. L\'ID de p\\u00E0gina no pot comen\\u00E7ar amb un n\\u00FAmero.\n#XMSG\nMessage.EmptyPageID=Indiqueu un ID de p\\u00E0gina v\\u00E0lid.\n#XMSG\nMessage.EmptyTitle=Indiqueu un t\\u00EDtol v\\u00E0lid.\n#XMSG\nMessage.NoRoleSelected=Seleccioneu com a m\\u00EDnim un rol.\n#XMSG\nMessage.SuccessDeletePage=S\\u2019ha suprimit l\'objecte seleccionat.\n#XMSG\nMessage.ClipboardCopySuccess=Els detalls s\'han copiat correctament.\n#YMSE\nMessage.ClipboardCopyFail=S\'ha produ\\u00EFt un error en copiar els detalls.\n#XMSG\nMessage.PageCreated=S\\u2019ha creat la p\\u00E0gina.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=Cap mosaic\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=No hi ha rols disponibles.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=No s\'ha trobat cap rol. Intenteu ajustar la cerca.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=Cap secci\\u00F3\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=No s\'\'ha pogut carregar el mosaic {0} a la secci\\u00F3 "{1}".\\n\\nSegurament a causa d\'\'una configuraci\\u00F3 de contingut de la plataforma de llan\\u00E7ament de SAP Fiori incorrecta. La visualitzaci\\u00F3 no ser\\u00E0 visible per l\'\'usuari.\n#XMSG\nMessage.NavigationTargetError=No s\'ha pogut solucionar la destinaci\\u00F3 de navegaci\\u00F3.\n#XMSG\nMessage.LoadPageError=No s\'ha pogut carregar la p\\u00E0gina.\n#XMSG\nMessage.UpdatePageError=No s\'ha pogut actualitzar la p\\u00E0gina.\n#XMSG\nMessage.CreatePageError=No s\'ha pogut crear la p\\u00E0gina.\n#XMSG\nMessage.TilesHaveErrors=Alguns dels mosaics o seccions tenen errors. Segur que voleu continuar desant?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=No s\'\'ha pogut solucionar la destinaci\\u00F3 de navegaci\\u00F3 del mosaic\\: "{0}".\\n\\nSegurament a causa d\'\'una configuraci\\u00F3 de contingut de la plataforma de llan\\u00E7ament de SAP Fiori incorrecta. La visualitzaci\\u00F3n no pot obrir una aplicaci\\u00F3.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=Segur que voleu suprimir la secci\\u00F3 "{0}"?\n#XMSG\nMessage.Section.DeleteNoTitle=Segur que voleu suprimir aquesta secci\\u00F3?\n#XMSG\nMessage.OverwriteChanges=S\'han realitzat modificacions mentre est\\u00E0veu editant la p\\u00E0gina. Voleu sobreescriure-les?\n#XMSG\nMessage.OverwriteRemovedPage=Un altre usuari ha suprimit la p\\u00E0gina en la que esteu treballant. Voleu sobreescriure aquesta modificaci\\u00F3?\n#XMSG\nMessage.SaveChanges=Deseu les modificacions.\n#XMSG\nMessage.NoPages=No hi ha p\\u00E0gines disponibles.\n#XMSG\nMessage.NoPagesFound=No s\'ha trobat cap p\\u00E0gina. Intenteu ajustar la cerca.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Contingut restringit a context de rol.\n#XMSG\nMessage.NotAssigned=Sense assignar.\n#XMSG\nMessage.StatusAssigned=Assignat\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=P\\u00E0gina nova\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=Seleccionar el context de rol\n#XTIT\nTitle.TilesHaveErrors=Els mosaics tenen errors\n#XTIT\nDeleteDialog.Title=Suprimir\n#XMSG\nDeleteDialog.Text=Segur que voleu suprimir la p\\u00E0gina seleccionada?\n#XBUT\nDeleteDialog.ConfirmButton=Suprimir\n#XTIT\nDeleteDialog.LockedTitle=P\\u00E0gina bloquejada\n#XMSG\nDeleteDialog.LockedText=L\\u2019usuari "{0}" ha bloquejat la p\\u00E0gina seleccionada.\n#XMSG\nDeleteDialog.TransportRequired=Seleccioneu un paquet de transport per suprimir la p\\u00E0gina seleccionada.\n\n#XMSG\nEditDialog.LockedText=L\\u2019usuari "{0}" ha bloquejat la p\\u00E0gina seleccionada.\n#XMSG\nEditDialog.TransportRequired=Seleccioneu un paquet de transport per editar la p\\u00E0gina seleccionada.\n#XTIT\nEditDialog.Title=Editar p\\u00E0gina\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=Aquesta p\\u00E0gina s\'\'ha creat en l\'\'idioma "{0}", per\\u00F2 el vostre idioma de registre \\u00E9s "{1}". Modifiqueu el vostre idioma de registre a "{0}" per a continuar.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Subt\\u00EDtol\n#XFLD\nTileInfoPopover.Label.Icon=S\\u00EDmbol\n#XFLD\nTileInfoPopover.Label.SemanticObject=Objecte sem\\u00E0ntic\n#XFLD\nTileInfoPopover.Label.SemanticAction=Acci\\u00F3 sem\\u00E0ntica\n#XFLD\nTileInfoPopover.Label.FioriID=ID de Fiori\n#XFLD\nTileInfoPopover.Label.AppDetail=Detall de l\'aplicaci\\u00F3\n#XFLD\nTileInfoPopover.Label.AppType=Tipus d\'aplicaci\\u00F3\n#XFLD\nTileInfoPopover.Label.TileType=Tipus de mosaic\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Dispositius disponibles\n\n#XTIT\nErrorDialog.Title=Error\n\n#XTIT\nConfirmChangesDialog.Title=Advert\\u00E8ncia\n\n#XTIT\nPageOverview.Title=Actualitzar p\\u00E0gines\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=Disposici\\u00F3\n\n#XTIT\nCopyDialog.Title=Copiar p\\u00E0gina\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=Voleu copiar "{0}"?\n#XFLD\nCopyDialog.NewID=C\\u00F2pia de "{0}"\n\n#XMSG\nTitle.NoSectionTitle=El t\\u00EDtol de la secci\\u00F3 {0} \\u00E9s buit.\n#XMSG\nTitle.UnsufficientRoles=Assignaci\\u00F3 de rol insuficient per mostrar la visualitzaci\\u00F3.\n#XMSG\nTitle.VisualizationIsNotVisible=No es mostrar\\u00E0 la visualitzaci\\u00F3.\n#XMSG\nTitle.VisualizationNotNavigateable=La visualitzaci\\u00F3 no pot obrir una aplicaci\\u00F3.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Mosaic est\\u00E0tic\n#XTIT\nTitle.DynamicTile=Mosaic din\\u00E0mic\n#XTIT\nTitle.CustomTile=Mosaic personalitzat\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=Previsualitzaci\\u00F3 de p\\u00E0gina\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=No s\'ha trobat aquesta p\\u00E0gina.\n#XLNK\nErrorPage.Link=Actualitzar p\\u00E0gines\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_cs.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=Prov\\u00E9st \\u00FAdr\\u017Ebu str\\u00E1nek nez\\u00E1visle na klientu\n\n#XBUT\nButton.Add=P\\u0159idat\n#XBUT\nButton.Cancel=Zru\\u0161it\n#XBUT\nButton.ClosePreview=Zav\\u0159\\u00EDt n\\u00E1hled\n#XBUT\nButton.Copy=Kop\\u00EDrovat\n#XBUT\nButton.Create=Vytvo\\u0159it\n#XBUT\nButton.Delete=Odstranit\n#XBUT\nButton.Edit=Upravit\n#XBUT\nButton.Save=Ulo\\u017Eit\n#XBUT\nButton.Select=Vybrat\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=Zobrazit katalogy\n#XBUT\nButton.HideCatalogs=Skr\\u00FDt katalogy\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Probl\\u00E9my\\: {0}\n#XBUT\nButton.SortCatalogs=P\\u0159epnout po\\u0159ad\\u00ED t\\u0159\\u00EDd\\u011Bn\\u00ED katalogu\n#XBUT\nButton.CollapseCatalogs=Sbalit v\\u0161echny katalogy\n#XBUT\nButton.ExpandCatalogs=Rozbalit v\\u0161echny katalogy\n#XBUT\nButton.ShowDetails=Zobrazit detaily\n#XBUT\nButton.PagePreview=N\\u00E1hled str\\u00E1nky\n#XBUT\nButton.ErrorMsg=Chybov\\u00E9 zpr\\u00E1vy\n#XBUT\nButton.EditHeader=Upravit hlavi\\u010Dku\n#XBUT\nButton.ContextSelector=Vybrat kontext role {0}\n#XBUT\nButton.OverwriteChanges=P\\u0159epsat\n#XBUT\nButton.DismissChanges=Odm\\u00EDtnout zm\\u011Bny\n\n#XTOL\nTooltip.AddToSections=P\\u0159idat k sekc\\u00EDm\n#XTOL: Tooltip for the search button\nTooltip.Search=Hledat\n#XTOL\nTooltip.SearchForTiles=Hledat dla\\u017Edice\n#XTOL\nTooltip.SearchForRoles=Hledat role\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Desktop\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=Zobrazit nastaven\\u00ED t\\u0159\\u00EDd\\u011Bn\\u00ED\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=Zobrazit nastaven\\u00ED filtru\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=Zobrazit nastaven\\u00ED skupiny\n\n#XFLD\nLabel.PageID=ID str\\u00E1nky\n#XFLD\nLabel.Title=Titulek\n#XFLD\nLabel.WorkbenchRequest=Po\\u017Eadavek na workbench\n#XFLD\nLabel.Package=Paket\n#XFLD\nLabel.TransportInformation=Informace o transportu\n#XFLD\nLabel.Details=Detaily\\:\n#XFLD\nLabel.ResponseCode=K\\u00F3d odpov\\u011Bdi\\:\n#XFLD\nLabel.ModifiedBy=Modifikoval\\:\n#XFLD\nLabel.Description=Popis\n#XFLD\nLabel.CreatedByFullname=Vytvo\\u0159il(a)\n#XFLD\nLabel.CreatedOn=Vytvo\\u0159eno dne\n#XFLD\nLabel.ChangedByFullname=Autor zm\\u011Bny\n#XFLD\nLabel.ChangedOn=Zm\\u011Bn\\u011Bno dne\n#XFLD\nLabel.PageTitle=Titulek str\\u00E1nky\n#XFLD\nLabel.AssignedRole=P\\u0159i\\u0159azen\\u00E1 role\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Titulek\n#XCOL\nColumn.PageDescription=Popis\n#XCOL\nColumn.PageAssignmentStatus=P\\u0159i\\u0159azeno k prostoru/roli\n#XCOL\nColumn.PagePackage=Paket\n#XCOL\nColumn.PageWorkbenchRequest=Po\\u017Eadavek na workbench\n#XCOL\nColumn.PageCreatedBy=Vytvo\\u0159il(a)\n#XCOL\nColumn.PageCreatedOn=Vytvo\\u0159eno dne\n#XCOL\nColumn.PageChangedBy=Autor zm\\u011Bny\n#XCOL\nColumn.PageChangedOn=Zm\\u011Bn\\u011Bno dne\n\n#XTOL\nPlaceholder.SectionName=Zadejte n\\u00E1zev sekce\n#XTOL\nPlaceholder.SearchForTiles=Hledat dla\\u017Edice\n#XTOL\nPlaceholder.SearchForRoles=Hledat role\n#XTOL\nPlaceholder.CopyPageTitle=Kopie \\u201E{0}\\u201C\n#XTOL\nPlaceholder.CopyPageID=Kopie \\u201E{0}\\u201C\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=v\\u0161e\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=Sekce {0} nem\\u00E1 titulek. Pro zaji\\u0161t\\u011Bn\\u00ED konzistentn\\u00ED u\\u017Eivatelsk\\u00E9 zku\\u0161enosti v\\u00E1m doporu\\u010Dujeme zadat n\\u00E1zev pro ka\\u017Edou sekci.\n#XMSG\nMessage.InvalidSectionTitle=V ide\\u00E1ln\\u00EDm p\\u0159\\u00EDpad\\u011B byste m\\u011Bli zadat n\\u00E1zev sekce.\n#XMSG\nMessage.NoInternetConnection=Zkontrolujte va\\u0161e p\\u0159ipojen\\u00ED k internetu.\n#XMSG\nMessage.SavedChanges=Va\\u0161e zm\\u011Bny byly ulo\\u017Eeny.\n#XMSG\nMessage.InvalidPageID=Pou\\u017E\\u00EDvejte jen n\\u00E1sleduj\\u00EDc\\u00ED znaky\\: A-Z 0-9 _ a /. ID str\\u00E1nky by nem\\u011Blo za\\u010D\\u00EDnat \\u010D\\u00EDslem.\n#XMSG\nMessage.EmptyPageID=Zadejte platn\\u00E9 ID str\\u00E1nky.\n#XMSG\nMessage.EmptyTitle=Zadejte platn\\u00FD titulek.\n#XMSG\nMessage.NoRoleSelected=Vyberte alespo\\u0148 jednu roli.\n#XMSG\nMessage.SuccessDeletePage=Vybran\\u00FD objekt byl odstran\\u011Bn.\n#XMSG\nMessage.ClipboardCopySuccess=Detaily byly \\u00FAsp\\u011B\\u0161n\\u011B zkop\\u00EDrov\\u00E1ny.\n#YMSE\nMessage.ClipboardCopyFail=P\\u0159i kop\\u00EDrov\\u00E1n\\u00ED detail\\u016F do\\u0161lo k chyb\\u011B.\n#XMSG\nMessage.PageCreated=Str\\u00E1nka byla vytvo\\u0159ena.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=\\u017D\\u00E1dn\\u00E9 dla\\u017Edice\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=\\u017D\\u00E1dn\\u00E9 role neexistuj\\u00ED.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=\\u017D\\u00E1dn\\u00E9 role nenalezeny. Zkuste upravit va\\u0161e hled\\u00E1n\\u00ED.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=\\u017D\\u00E1dn\\u00E9 sekce\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=Nezda\\u0159ilo se zav\\u00E9st dla\\u017Edici {0} do sekce "{1}".\\n\\nTo je zp\\u016Fsobeno pravd\\u011Bpodobn\\u011B nespr\\u00E1vnou konfigurac\\u00ED obsahu launchpadu SAP Fiori. Vizualizace nebude pro u\\u017Eivatele zobrazena.\n#XMSG\nMessage.NavigationTargetError=C\\u00EDl navigace nebylo mo\\u017En\\u00E9 rozli\\u0161it.\n#XMSG\nMessage.LoadPageError=Nebylo mo\\u017En\\u00E9 zav\\u00E9st tuto str\\u00E1nku.\n#XMSG\nMessage.UpdatePageError=Nebylo mo\\u017En\\u00E9 aktualizovat tuto str\\u00E1nku.\n#XMSG\nMessage.CreatePageError=Nebylo mo\\u017En\\u00E9 vytvo\\u0159it tuto str\\u00E1nku.\n#XMSG\nMessage.TilesHaveErrors=N\\u011Bkter\\u00E9 z dla\\u017Edic nebo sekc\\u00ED maj\\u00ED chyby. Opravdu chcete pokra\\u010Dovat v ukl\\u00E1d\\u00E1n\\u00ED?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=Nezda\\u0159ilo se rozli\\u0161it c\\u00EDl navigace dla\\u017Edice\\: "{0}".\\n\\nTo je zp\\u016Fsobeno pravd\\u011Bpodobn\\u011B nespr\\u00E1vnou konfigurac\\u00ED obsahu launchpadu SAP Fiori . Vizualizace nem\\u016F\\u017Ee otev\\u0159\\u00EDt aplikaci.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=Opravdu chcete sekci "{0}" vymazat?\n#XMSG\nMessage.Section.DeleteNoTitle=Opravdu chcete vymazat tuto sekci?\n#XMSG\nMessage.OverwriteChanges=P\\u0159i \\u00FAprav\\u011B t\\u00E9to str\\u00E1nky byly provedeny zm\\u011Bny. Chcete je p\\u0159epsat?\n#XMSG\nMessage.OverwriteRemovedPage=Str\\u00E1nka, na n\\u00ED\\u017E pracujete, byla odstran\\u011Bna jin\\u00FDm u\\u017Eivatelem. Chcete p\\u0159epsat tuto zm\\u011Bnu?\n#XMSG\nMessage.SaveChanges=Ulo\\u017Ete va\\u0161e zm\\u011Bny.\n#XMSG\nMessage.NoPages=Nejsou dostupn\\u00E9 \\u017E\\u00E1dn\\u00E9 str\\u00E1nky.\n#XMSG\nMessage.NoPagesFound=\\u017D\\u00E1dn\\u00E9 str\\u00E1nky nenalezeny. Zkuste upravit va\\u0161e hled\\u00E1n\\u00ED.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Obsah omezen na kontext role.\n#XMSG\nMessage.NotAssigned=Nep\\u0159i\\u0159azeno.\n#XMSG\nMessage.StatusAssigned=P\\u0159i\\u0159azeno\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=Nov\\u00E1 str\\u00E1nka\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=Vybrat kontext role\n#XTIT\nTitle.TilesHaveErrors=Dla\\u017Edice maj\\u00ED chyby\n#XTIT\nDeleteDialog.Title=Odstranit\n#XMSG\nDeleteDialog.Text=Chcete opravdu odstranit vybranou str\\u00E1nku?\n#XBUT\nDeleteDialog.ConfirmButton=Odstranit\n#XTIT\nDeleteDialog.LockedTitle=Str\\u00E1nka blokov\\u00E1na\n#XMSG\nDeleteDialog.LockedText=Vybran\\u00E1 str\\u00E1nka je blokov\\u00E1na u\\u017Eivatelem \\u201E{0}\\u201C.\n#XMSG\nDeleteDialog.TransportRequired=Vyberte transportn\\u00ED paket pro odstran\\u011Bn\\u00ED vybran\\u00E9 str\\u00E1nky.\n\n#XMSG\nEditDialog.LockedText=Vybran\\u00E1 str\\u00E1nka je blokov\\u00E1na u\\u017Eivatelem \\u201E{0}\\u201C.\n#XMSG\nEditDialog.TransportRequired=Vyberte transportn\\u00ED paket pro \\u00FApravu vybran\\u00E9 str\\u00E1nky.\n#XTIT\nEditDialog.Title=Upravit str\\u00E1nku\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=Tato str\\u00E1nka byla vytvo\\u0159ena v jazyce "{0}", ale v\\u00E1\\u0161 p\\u0159ihla\\u0161ovac\\u00ED jazyk je nastaven na "{1}". Pro pokra\\u010Dov\\u00E1n\\u00ED zm\\u011B\\u0148te v\\u00E1\\u0161 p\\u0159ihla\\u0161ovac\\u00ED jazyk na "{0}".\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Podtitulek\n#XFLD\nTileInfoPopover.Label.Icon=Ikona\n#XFLD\nTileInfoPopover.Label.SemanticObject=S\\u00E9mantick\\u00FD objekt\n#XFLD\nTileInfoPopover.Label.SemanticAction=S\\u00E9mantick\\u00E1 akce\n#XFLD\nTileInfoPopover.Label.FioriID=ID Fiori\n#XFLD\nTileInfoPopover.Label.AppDetail=Detail aplikace\n#XFLD\nTileInfoPopover.Label.AppType=Typ aplikace\n#XFLD\nTileInfoPopover.Label.TileType=Typ dla\\u017Edice\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Dostupn\\u00E1 za\\u0159\\u00EDzen\\u00ED\n\n#XTIT\nErrorDialog.Title=Chyba\n\n#XTIT\nConfirmChangesDialog.Title=Upozorn\\u011Bn\\u00ED\n\n#XTIT\nPageOverview.Title=Prov\\u00E9st \\u00FAdr\\u017Ebu str\\u00E1nek\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=Layout\n\n#XTIT\nCopyDialog.Title=Kop\\u00EDrovat str\\u00E1nku\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=Chcete kop\\u00EDrovat \\u201E{0}\\u201C?\n#XFLD\nCopyDialog.NewID=Kopie \\u201E{0}\\u201C\n\n#XMSG\nTitle.NoSectionTitle=Titulek sekce {0} je pr\\u00E1zdn\\u00FD.\n#XMSG\nTitle.UnsufficientRoles=Nedostate\\u010Dn\\u00E9 p\\u0159i\\u0159azen\\u00ED role pro vizualizaci obsahu.\n#XMSG\nTitle.VisualizationIsNotVisible=Vizualizace nebude zobrazena.\n#XMSG\nTitle.VisualizationNotNavigateable=Vizualizace nem\\u016F\\u017Ee otev\\u0159\\u00EDt aplikaci.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Statick\\u00E1 dla\\u017Edice\n#XTIT\nTitle.DynamicTile=Dynamick\\u00E1 dla\\u017Edice\n#XTIT\nTitle.CustomTile=Z\\u00E1kaznick\\u00E1 dla\\u017Edice\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=N\\u00E1hled str\\u00E1nky\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=Omlouv\\u00E1me se, tuto str\\u00E1nku se n\\u00E1m nepoda\\u0159ilo naj\\u00EDt.\n#XLNK\nErrorPage.Link=Prov\\u00E9st \\u00FAdr\\u017Ebu str\\u00E1nek\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_da.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=Vedligehold sider klientuafh\\u00E6ngigt\n\n#XBUT\nButton.Add=Tilf\\u00F8j\n#XBUT\nButton.Cancel=Afbryd\n#XBUT\nButton.ClosePreview=Luk eksempel\n#XBUT\nButton.Copy=Kopi\\u00E9r\n#XBUT\nButton.Create=Opret\n#XBUT\nButton.Delete=Slet\n#XBUT\nButton.Edit=Rediger\n#XBUT\nButton.Save=Gem\n#XBUT\nButton.Select=V\\u00E6lg\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=Vis kataloger\n#XBUT\nButton.HideCatalogs=Skjul kataloger\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Problemer\\: {0}\n#XBUT\nButton.SortCatalogs=Skift sorteringsr\\u00E6kkef\\u00F8lge for katalog\n#XBUT\nButton.CollapseCatalogs=Komprimer alle kataloger\n#XBUT\nButton.ExpandCatalogs=Ekspander alle kataloger\n#XBUT\nButton.ShowDetails=Vis detaljer\n#XBUT\nButton.PagePreview=Sideeksempel\n#XBUT\nButton.ErrorMsg=Fejlmeddelelser\n#XBUT\nButton.EditHeader=Rediger topdata\n#XBUT\nButton.ContextSelector=V\\u00E6lg rollekontekst {0}\n#XBUT\nButton.OverwriteChanges=Overskriv\n#XBUT\nButton.DismissChanges=Afvis \\u00E6ndringer\n\n#XTOL\nTooltip.AddToSections=F\\u00F8j til afsnit\n#XTOL: Tooltip for the search button\nTooltip.Search=S\\u00F8g\n#XTOL\nTooltip.SearchForTiles=S\\u00F8g efter fliser\n#XTOL\nTooltip.SearchForRoles=S\\u00F8g efter roller\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Desktop\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=Vis sorteringsindstillinger\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=Vis filterindstillinger\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=Vis gruppeindstillinger\n\n#XFLD\nLabel.PageID=Side-ID\n#XFLD\nLabel.Title=Titel\n#XFLD\nLabel.WorkbenchRequest=Workbench-ordre\n#XFLD\nLabel.Package=Pakke\n#XFLD\nLabel.TransportInformation=Transportinformationer\n#XFLD\nLabel.Details=Detaljer\\:\n#XFLD\nLabel.ResponseCode=Svarkode\\:\n#XFLD\nLabel.ModifiedBy=\\u00C6ndret af\\:\n#XFLD\nLabel.Description=Beskrivelse\n#XFLD\nLabel.CreatedByFullname=Oprettet af\n#XFLD\nLabel.CreatedOn=Oprettet den\n#XFLD\nLabel.ChangedByFullname=\\u00C6ndret af\n#XFLD\nLabel.ChangedOn=\\u00C6ndret den\n#XFLD\nLabel.PageTitle=Sidetitel\n#XFLD\nLabel.AssignedRole=Allokeret rolle\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Titel\n#XCOL\nColumn.PageDescription=Beskrivelse\n#XCOL\nColumn.PageAssignmentStatus=Allokeret til plads/rolle\n#XCOL\nColumn.PagePackage=Pakke\n#XCOL\nColumn.PageWorkbenchRequest=Workbench-ordre\n#XCOL\nColumn.PageCreatedBy=Oprettet af\n#XCOL\nColumn.PageCreatedOn=Oprettet den\n#XCOL\nColumn.PageChangedBy=\\u00C6ndret af\n#XCOL\nColumn.PageChangedOn=\\u00C6ndret den\n\n#XTOL\nPlaceholder.SectionName=Indtast et afsnitsnavn\n#XTOL\nPlaceholder.SearchForTiles=S\\u00F8g efter fliser\n#XTOL\nPlaceholder.SearchForRoles=S\\u00F8g efter roller\n#XTOL\nPlaceholder.CopyPageTitle=Kopi af "{0}"\n#XTOL\nPlaceholder.CopyPageID=Kopi af "{0}"\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=Alle\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=Afsnit {0} har ingen titel. For at f\\u00E5 en konsistent brugeroplevelse anbefaler vi, at du indtaster et navn p\\u00E5 hvert afsnit.\n#XMSG\nMessage.InvalidSectionTitle=Ideelt set b\\u00F8r du indtaste et afsnitsnavn.\n#XMSG\nMessage.NoInternetConnection=Kontroller din internetforbindelse.\n#XMSG\nMessage.SavedChanges=Dine \\u00E6ndringer er gemt.\n#XMSG\nMessage.InvalidPageID=Anvend kun f\\u00F8lgende tegn\\: A-Z, 0-9, _ og /. Side-ID\'en b\\u00F8r ikke starte med et tal.\n#XMSG\nMessage.EmptyPageID=Angiv en gyldig side-ID.\n#XMSG\nMessage.EmptyTitle=Angiv en gyldig titel.\n#XMSG\nMessage.NoRoleSelected=V\\u00E6lg mindst en rolle.\n#XMSG\nMessage.SuccessDeletePage=Det valgte objekt er slettet.\n#XMSG\nMessage.ClipboardCopySuccess=Detaljer blev kopieret uden fejl.\n#YMSE\nMessage.ClipboardCopyFail=Der opstod en fejl ved kopiering af detaljer.\n#XMSG\nMessage.PageCreated=Siden er oprettet.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=Ingen fliser\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=Ingen roller tilg\\u00E6ngelige.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=Ingen roller fundet. Pr\\u00F8v at tilpasse din s\\u00F8gning.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=Ingen afsnit\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=Kunne ikke indl\\u00E6se flisen {0} i afsnittet "{1}".\\n\\nDette skyldes h\\u00F8jst sandsynligt en forkert SAP Fiori-launchpad-indholdskonfiguration. Visualiseringen vises ikke for brugeren.\n#XMSG\nMessage.NavigationTargetError=Navigationsm\\u00E5let kunne ikke opl\\u00F8ses.\n#XMSG\nMessage.LoadPageError=Kunne ikke indl\\u00E6se siden.\n#XMSG\nMessage.UpdatePageError=Kunne ikke opdatere siden.\n#XMSG\nMessage.CreatePageError=Kunne ikke oprette siden.\n#XMSG\nMessage.TilesHaveErrors=Nogle af fliserne eller afsnittene har fejl. Er du sikker p\\u00E5, at du vil forts\\u00E6tte med at gemme?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=Kunne ikke opl\\u00F8se navigationsm\\u00E5let for flise\\: "{0}".\\n\\nDette skyldes h\\u00F8jst sandsynligt en forkert SAP Fiori-launchpad-indholdskonfiguration. Visualiseringen kan ikke \\u00E5bne en applikation.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=Er du sikker p\\u00E5, du vil slette afsnittet "{0}"?\n#XMSG\nMessage.Section.DeleteNoTitle=Er du sikker p\\u00E5, at du vil slette dette afsnit?\n#XMSG\nMessage.OverwriteChanges=Der er sket \\u00E6ndringer, mens du redigerede siden. Vil du overskrive dem?\n#XMSG\nMessage.OverwriteRemovedPage=Den side, du arbejder p\\u00E5, er blevet slettet af en anden bruger. Vil du overskrive denne \\u00E6ndring?\n#XMSG\nMessage.SaveChanges=Gem dine \\u00E6ndringer.\n#XMSG\nMessage.NoPages=Ingen sider er tilg\\u00E6ngelige.\n#XMSG\nMessage.NoPagesFound=Ingen sider blev fundet. Pr\\u00F8v at tilpasse din s\\u00F8gning.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Indhold begr\\u00E6nset til rollekontekst.\n#XMSG\nMessage.NotAssigned=Ikke allokeret.\n#XMSG\nMessage.StatusAssigned=Allokeret\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=Ny side\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=V\\u00E6lg rollekontekst\n#XTIT\nTitle.TilesHaveErrors=Fliserne har fejl\n#XTIT\nDeleteDialog.Title=Slet\n#XMSG\nDeleteDialog.Text=Er du sikker p\\u00E5, du vil slette den valgte side?\n#XBUT\nDeleteDialog.ConfirmButton=Slet\n#XTIT\nDeleteDialog.LockedTitle=Side sp\\u00E6rret\n#XMSG\nDeleteDialog.LockedText=Den valgte side er sp\\u00E6rret af bruger "{0}".\n#XMSG\nDeleteDialog.TransportRequired=V\\u00E6lg en transportpakke for at slette den valgte side.\n\n#XMSG\nEditDialog.LockedText=Den valgte side er sp\\u00E6rret af bruger "{0}".\n#XMSG\nEditDialog.TransportRequired=V\\u00E6lg en transportpakke for at redigere den valgte side.\n#XTIT\nEditDialog.Title=Rediger side\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=Denne side er oprettet p\\u00E5 sprog "{0}", men dit logonsprog er indstillet til "{1}". \\u00C6ndr dit logonsprog til "{0}" for at forts\\u00E6tte.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Undertitel\n#XFLD\nTileInfoPopover.Label.Icon=Ikon\n#XFLD\nTileInfoPopover.Label.SemanticObject=Semantisk objekt\n#XFLD\nTileInfoPopover.Label.SemanticAction=Semantisk aktion\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori-ID\n#XFLD\nTileInfoPopover.Label.AppDetail=App-detalje\n#XFLD\nTileInfoPopover.Label.AppType=App-type\n#XFLD\nTileInfoPopover.Label.TileType=Flisetype\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Tilg\\u00E6ngelige enheder\n\n#XTIT\nErrorDialog.Title=Fejl\n\n#XTIT\nConfirmChangesDialog.Title=Advarsel\n\n#XTIT\nPageOverview.Title=Vedligehold sider\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=Layout\n\n#XTIT\nCopyDialog.Title=Kopier side\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=Vil du kopiere "{0}"?\n#XFLD\nCopyDialog.NewID=Kopi af "{0}"\n\n#XMSG\nTitle.NoSectionTitle=Afsnitstitel p\\u00E5 afsnit {0} er tom.\n#XMSG\nTitle.UnsufficientRoles=Utilstr\\u00E6kkelig rolleallokering til at vise visualisering.\n#XMSG\nTitle.VisualizationIsNotVisible=Visualiseringen vises ikke.\n#XMSG\nTitle.VisualizationNotNavigateable=Visualiseringen kan ikke \\u00E5bne en app.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Statisk flise\n#XTIT\nTitle.DynamicTile=Dynamisk flise\n#XTIT\nTitle.CustomTile=Kundespecifik flise\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=Sideeksempel\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=Beklager, vi kunne ikke finde denne side.\n#XLNK\nErrorPage.Link=Vedligehold sider\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_de.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=Seiten mandanten\\u00FCbergreifend pflegen\n\n#XBUT\nButton.Add=Hinzuf\\u00FCgen\n#XBUT\nButton.Cancel=Abbrechen\n#XBUT\nButton.ClosePreview=Vorschau schlie\\u00DFen\n#XBUT\nButton.Copy=Kopieren\n#XBUT\nButton.Create=Anlegen\n#XBUT\nButton.Delete=L\\u00F6schen\n#XBUT\nButton.Edit=Bearbeiten\n#XBUT\nButton.Save=Sichern\n#XBUT\nButton.Select=Ausw\\u00E4hlen\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=Kataloge anzeigen\n#XBUT\nButton.HideCatalogs=Kataloge ausblenden\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Probleme\\: {0}\n#XBUT\nButton.SortCatalogs=Katalogsortierreihenfolge wechseln\n#XBUT\nButton.CollapseCatalogs=Alle Kataloge komprimieren\n#XBUT\nButton.ExpandCatalogs=Alle Kataloge expandieren\n#XBUT\nButton.ShowDetails=Details anzeigen\n#XBUT\nButton.PagePreview=Seitenvorschau\n#XBUT\nButton.ErrorMsg=Fehlermeldungen\n#XBUT\nButton.EditHeader=Kopfdaten bearbeiten\n#XBUT\nButton.ContextSelector=Rollenkontext {0} ausw\\u00E4hlen\n#XBUT\nButton.OverwriteChanges=\\u00DCberschreiben\n#XBUT\nButton.DismissChanges=\\u00C4nderungen verwerfen\n\n#XTOL\nTooltip.AddToSections=Zu Abschnitten hinzuf\\u00FCgen\n#XTOL: Tooltip for the search button\nTooltip.Search=Suchen\n#XTOL\nTooltip.SearchForTiles=Kacheln suchen\n#XTOL\nTooltip.SearchForRoles=Rollen suchen\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Desktop\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=Sortiereinstellungen anzeigen\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=Filtereinstellungen anzeigen\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=Gruppeneinstellungen anzeigen\n\n#XFLD\nLabel.PageID=Seiten-ID\n#XFLD\nLabel.Title=Titel\n#XFLD\nLabel.WorkbenchRequest=Workbench-Auftrag\n#XFLD\nLabel.Package=Paket\n#XFLD\nLabel.TransportInformation=Transportinformationen\n#XFLD\nLabel.Details=Details\\:\n#XFLD\nLabel.ResponseCode=Antwortcode\\:\n#XFLD\nLabel.ModifiedBy=Ge\\u00E4ndert von\\:\n#XFLD\nLabel.Description=Beschreibung\n#XFLD\nLabel.CreatedByFullname=Angelegt von\n#XFLD\nLabel.CreatedOn=Angelegt am\n#XFLD\nLabel.ChangedByFullname=Ge\\u00E4ndert von\n#XFLD\nLabel.ChangedOn=Ge\\u00E4ndert am\n#XFLD\nLabel.PageTitle=Seitentitel\n#XFLD\nLabel.AssignedRole=Zugewiesene Rolle\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Titel\n#XCOL\nColumn.PageDescription=Beschreibung\n#XCOL\nColumn.PageAssignmentStatus=Bereich/Rolle zugeordnet\n#XCOL\nColumn.PagePackage=Paket\n#XCOL\nColumn.PageWorkbenchRequest=Workbench-Auftrag\n#XCOL\nColumn.PageCreatedBy=Angelegt von\n#XCOL\nColumn.PageCreatedOn=Angelegt am\n#XCOL\nColumn.PageChangedBy=Ge\\u00E4ndert von\n#XCOL\nColumn.PageChangedOn=Ge\\u00E4ndert am\n\n#XTOL\nPlaceholder.SectionName=Abschnittsnamen eingeben\n#XTOL\nPlaceholder.SearchForTiles=Kacheln suchen\n#XTOL\nPlaceholder.SearchForRoles=Rollen suchen\n#XTOL\nPlaceholder.CopyPageTitle=Kopie von "{0}"\n#XTOL\nPlaceholder.CopyPageID=Kopie von "{0}"\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=Alle\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=Abschnitt {0} hat keinen Titel. F\\u00FCr eine konsistente Benutzerfreundlichkeit empfehlen wir f\\u00FCr jeden Abschnitt einen Namen einzugeben.\n#XMSG\nMessage.InvalidSectionTitle=Im Idealfall sollten Sie einen Abschnittsnamen eingeben.\n#XMSG\nMessage.NoInternetConnection=Bitte pr\\u00FCfen Sie Ihre Internetverbindung.\n#XMSG\nMessage.SavedChanges=Ihre \\u00C4nderungen wurden gesichert.\n#XMSG\nMessage.InvalidPageID=Bitte verwenden Sie nur die folgenden Zeichen\\: A-Z, 0-9, _ und /. Die Seiten-ID sollte nicht mit einer Nummer beginnen.\n#XMSG\nMessage.EmptyPageID=Bitte geben Sie eine g\\u00FCltige Seiten-ID an.\n#XMSG\nMessage.EmptyTitle=Bitte geben Sie einen g\\u00FCltigen Titel an.\n#XMSG\nMessage.NoRoleSelected=Bitte w\\u00E4hlen Sie mindestens eine Rolle aus.\n#XMSG\nMessage.SuccessDeletePage=Das ausgew\\u00E4hlte Objekt wurde gel\\u00F6scht.\n#XMSG\nMessage.ClipboardCopySuccess=Details wurden erfolgreich kopiert.\n#YMSE\nMessage.ClipboardCopyFail=Fehler beim Kopieren der Details.\n#XMSG\nMessage.PageCreated=Die Seite wurde angelegt.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=Keine Kacheln\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=Keine Rollen verf\\u00FCgbar.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=Keine Rollen gefunden. Versuchen Sie, Ihre Suche anzupassen.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=Keine Abschnitte\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=Kachel {0} im Abschnitt "{1}" konnte nicht geladen werden.\\n\\nM\\u00F6gliche Ursache\\: Der Inhalt des SAP Fiori Launchpad ist inkorrekt konfiguriert worden. Die Visualisierung ist f\\u00FCr den Benutzer nicht sichtbar.\n#XMSG\nMessage.NavigationTargetError=Das Navigationsziel konnte nicht aufgel\\u00F6st werden.\n#XMSG\nMessage.LoadPageError=Die Seite konnte nicht geladen werden.\n#XMSG\nMessage.UpdatePageError=Die Seite konnte nicht aktualisiert werden.\n#XMSG\nMessage.CreatePageError=Die Seite konnte nicht angelegt werden.\n#XMSG\nMessage.TilesHaveErrors=Einige Kacheln oder Abschnitte haben Fehler. Wollen Sie wirklich mit dem Sichern fortfahren?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=Das Navigationsziel der Kachel "{0}" kann nicht aufgel\\u00F6st werden. \\n\\nM\\u00F6gliche Ursache\\: Der Inhalt des SAP Fiori Launchpad ist inkorrekt konfiguriert worden. Die Visualisierung kann keine Anwendung \\u00F6ffnen.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=Wollen Sie den Abschnitt "{0}" wirklich l\\u00F6schen?\n#XMSG\nMessage.Section.DeleteNoTitle=Wollen Sie diesen Abschnitt wirklich l\\u00F6schen?\n#XMSG\nMessage.OverwriteChanges=W\\u00E4hrend Sie die Seite bearbeitet haben, wurden \\u00C4nderungen gemacht. Wollen Sie diese \\u00FCberschreiben?\n#XMSG\nMessage.OverwriteRemovedPage=Die Seite, an der Sie arbeiten, wurde von einem anderen Benutzer gel\\u00F6scht. Wollen Sie diese \\u00C4nderung \\u00FCberschreiben?\n#XMSG\nMessage.SaveChanges=Bitte sichern Sie Ihre \\u00C4nderungen.\n#XMSG\nMessage.NoPages=Keine Seiten verf\\u00FCgbar.\n#XMSG\nMessage.NoPagesFound=Keine Seiten gefunden. Versuchen Sie, Ihre Suche anzupassen.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Inhalt auf Rollenkontext beschr\\u00E4nkt.\n#XMSG\nMessage.NotAssigned=Nicht zugeordnet.\n#XMSG\nMessage.StatusAssigned=Zugeordnet\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=Neue Seite\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=Rollenkontext ausw\\u00E4hlen\n#XTIT\nTitle.TilesHaveErrors=Kacheln haben Fehler\n#XTIT\nDeleteDialog.Title=L\\u00F6schen\n#XMSG\nDeleteDialog.Text=Wollen Sie die ausgew\\u00E4hlte Seite wirklich l\\u00F6schen?\n#XBUT\nDeleteDialog.ConfirmButton=L\\u00F6schen\n#XTIT\nDeleteDialog.LockedTitle=Seite gesperrt\n#XMSG\nDeleteDialog.LockedText=Die ausgew\\u00E4hlte Seite wird von Benutzer "{0}" gesperrt.\n#XMSG\nDeleteDialog.TransportRequired=Bitte w\\u00E4hlen Sie ein Transportpaket aus, um die ausgew\\u00E4hlte Seite zu l\\u00F6schen.\n\n#XMSG\nEditDialog.LockedText=Die ausgew\\u00E4hlte Seite wird von Benutzer "{0}" gesperrt.\n#XMSG\nEditDialog.TransportRequired=Bitte w\\u00E4hlen Sie ein Transportpaket aus, um die ausgew\\u00E4hlte Seite zu bearbeiten.\n#XTIT\nEditDialog.Title=Seite bearbeiten\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=Diese Seite wurde in der Sprache "{0}" angelegt, aber Ihre Anmeldesprache ist auf "{1}" gesetzt. Bitte \\u00E4ndern Sie Ihre Anmeldesprache zu "{0}", um fortzufahren.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Untertitel\n#XFLD\nTileInfoPopover.Label.Icon=Symbol\n#XFLD\nTileInfoPopover.Label.SemanticObject=Semantisches Objekt\n#XFLD\nTileInfoPopover.Label.SemanticAction=Semantische Aktion\n#XFLD\nTileInfoPopover.Label.FioriID=SAP-Fiori-ID\n#XFLD\nTileInfoPopover.Label.AppDetail=App-Detail\n#XFLD\nTileInfoPopover.Label.AppType=App-Typ\n#XFLD\nTileInfoPopover.Label.TileType=Kacheltyp\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Verf\\u00FCgbare Ger\\u00E4te\n\n#XTIT\nErrorDialog.Title=Fehler\n\n#XTIT\nConfirmChangesDialog.Title=Warnung\n\n#XTIT\nPageOverview.Title=Seiten pflegen\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=Layout\n\n#XTIT\nCopyDialog.Title=Seite kopieren\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=Wollen Sie "{0}" kopieren?\n#XFLD\nCopyDialog.NewID=Kopie von "{0}"\n\n#XMSG\nTitle.NoSectionTitle=Abschnittstitel von Abschnitt {0} ist leer.\n#XMSG\nTitle.UnsufficientRoles=Rollenzuordnung ist unzureichend f\\u00FCr die Anzeige der Visualisierung.\n#XMSG\nTitle.VisualizationIsNotVisible=Die Visualisierung wird nicht angezeigt.\n#XMSG\nTitle.VisualizationNotNavigateable=Die Visualisierung kann keine App \\u00F6ffnen.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Statische Kachel\n#XTIT\nTitle.DynamicTile=Dynamische Kachel\n#XTIT\nTitle.CustomTile=Benutzerdefinierte Kachel\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=Seitenvorschau\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=Diese Seite wurde leider nicht gefunden.\n#XLNK\nErrorPage.Link=Seiten pflegen\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_el.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=\\u03A3\\u03C5\\u03BD\\u03C4\\u03AE\\u03C1\\u03B7\\u03C3\\u03B7 \\u03A0\\u03BF\\u03BB\\u03BB\\u03B1\\u03C0\\u03BB\\u03CE\\u03BD \\u0395\\u03BD\\u03C4\\u03BF\\u03BB\\u03AD\\u03C9\\u03BD \\u03A3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1\\u03C2\n\n#XBUT\nButton.Add=\\u03A0\\u03C1\\u03BF\\u03C3\\u03B8\\u03AE\\u03BA\\u03B7\n#XBUT\nButton.Cancel=\\u0391\\u03BA\\u03CD\\u03C1\\u03C9\\u03C3\\u03B7\n#XBUT\nButton.ClosePreview=\\u039A\\u03BB\\u03B5\\u03AF\\u03C3\\u03B9\\u03BC\\u03BF \\u03A0\\u03C1\\u03BF\\u03B5\\u03C0\\u03B9\\u03C3\\u03BA\\u03CC\\u03C0\\u03B7\\u03C3\\u03B7\\u03C2\n#XBUT\nButton.Copy=\\u0391\\u03BD\\u03C4\\u03B9\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE\n#XBUT\nButton.Create=\\u0394\\u03B7\\u03BC\\u03B9\\u03BF\\u03C5\\u03C1\\u03B3\\u03AF\\u03B1\n#XBUT\nButton.Delete=\\u0394\\u03B9\\u03B1\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE\n#XBUT\nButton.Edit=E\\u03C0\\u03B5\\u03BE\\u03B5\\u03C1\\u03B3\\u03B1\\u03C3\\u03AF\\u03B1\n#XBUT\nButton.Save=\\u0391\\u03C0\\u03BF\\u03B8\\u03AE\\u03BA\\u03B5\\u03C5\\u03C3\\u03B7\n#XBUT\nButton.Select=\\u0395\\u03C0\\u03B9\\u03BB\\u03BF\\u03B3\\u03AE\n#XBUT\nButton.Ok=\\u039F\\u039A\n#XBUT\nButton.ShowCatalogs=\\u0395\\u03BC\\u03C6\\u03AC\\u03BD\\u03B9\\u03C3\\u03B7 \\u039A\\u03B1\\u03C4\\u03B1\\u03BB\\u03CC\\u03B3\\u03C9\\u03BD\n#XBUT\nButton.HideCatalogs=\\u0391\\u03C0\\u03CC\\u03BA\\u03C1\\u03C5\\u03C8\\u03B7 \\u039A\\u03B1\\u03C4\\u03B1\\u03BB\\u03CC\\u03B3\\u03C9\\u03BD\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=\\u03A0\\u03C1\\u03BF\\u03B2\\u03BB\\u03AE\\u03BC\\u03B1\\u03C4\\u03B1\\: {0}\n#XBUT\nButton.SortCatalogs=\\u0395\\u03BD\\u03B1\\u03BB\\u03BB\\u03B1\\u03B3\\u03AE \\u03A3\\u03B5\\u03B9\\u03C1\\u03AC\\u03C2 \\u03A4\\u03B1\\u03BE\\u03B9\\u03BD\\u03CC\\u03BC\\u03B7\\u03C3\\u03B7\\u03C2 \\u039A\\u03B1\\u03C4\\u03B1\\u03BB\\u03CC\\u03B3\\u03BF\\u03C5\n#XBUT\nButton.CollapseCatalogs=\\u03A3\\u03CD\\u03BC\\u03C0\\u03C4\\u03C5\\u03BE\\u03B7 \\u039F\\u03BB\\u03C9\\u03BD \\u03C4\\u03C9\\u03BD \\u039A\\u03B1\\u03C4\\u03B1\\u03BB\\u03CC\\u03B3\\u03C9\\u03BD\n#XBUT\nButton.ExpandCatalogs=\\u0395\\u03C0\\u03AD\\u03BA\\u03C4\\u03B1\\u03C3\\u03B7 \\u039F\\u03BB\\u03C9\\u03BD \\u03C4\\u03C9\\u03BD \\u039A\\u03B1\\u03C4\\u03B1\\u03BB\\u03CC\\u03B3\\u03C9\\u03BD\n#XBUT\nButton.ShowDetails=\\u0395\\u03BC\\u03C6\\u03AC\\u03BD\\u03B9\\u03C3\\u03B7 \\u039B\\u03B5\\u03C0\\u03C4\\u03BF\\u03BC\\u03B5\\u03C1\\u03B5\\u03B9\\u03CE\\u03BD\n#XBUT\nButton.PagePreview=\\u03A0\\u03C1\\u03BF\\u03B5\\u03C0\\u03B9\\u03C3\\u03BA\\u03CC\\u03C0\\u03B7\\u03C3\\u03B7 \\u03A3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1\\u03C2\n#XBUT\nButton.ErrorMsg=\\u039C\\u03B7\\u03BD\\u03CD\\u03BC\\u03B1\\u03C4\\u03B1 \\u039B\\u03AC\\u03B8\\u03BF\\u03C5\\u03C2\n#XBUT\nButton.EditHeader=\\u0395\\u03C0\\u03B5\\u03BE\\u03B5\\u03C1\\u03B3\\u03B1\\u03C3\\u03AF\\u03B1 \\u039A\\u03B5\\u03C6\\u03B1\\u03BB\\u03AF\\u03B4\\u03B1\\u03C2\n#XBUT\nButton.ContextSelector=\\u0395\\u03C0\\u03B9\\u03BB\\u03BF\\u03B3\\u03AE \\u03A0\\u03BB\\u03B1\\u03B9\\u03C3\\u03AF\\u03BF\\u03C5 \\u03A1\\u03CC\\u03BB\\u03BF\\u03C5 {0}\n#XBUT\nButton.OverwriteChanges=\\u0395\\u03C0\\u03B1\\u03BD\\u03B5\\u03B3\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE\n#XBUT\nButton.DismissChanges=\\u0391\\u03C0\\u03CC\\u03C1\\u03C1\\u03B9\\u03C8\\u03B7 \\u0391\\u03BB\\u03BB\\u03B1\\u03B3\\u03CE\\u03BD\n\n#XTOL\nTooltip.AddToSections=\\u03A0\\u03C1\\u03BF\\u03C3\\u03B8\\u03AE\\u03BA\\u03B7 \\u03C3\\u03B5 \\u0395\\u03BD\\u03CC\\u03C4\\u03B7\\u03C4\\u03B5\\u03C2\n#XTOL: Tooltip for the search button\nTooltip.Search=\\u0391\\u03BD\\u03B1\\u03B6\\u03AE\\u03C4\\u03B7\\u03C3\\u03B7\n#XTOL\nTooltip.SearchForTiles=\\u0391\\u03BD\\u03B1\\u03B6\\u03AE\\u03C4\\u03B7\\u03C3\\u03B7 \\u03A0\\u03BB\\u03B1\\u03BA\\u03B9\\u03B4\\u03AF\\u03C9\\u03BD\n#XTOL\nTooltip.SearchForRoles=\\u0391\\u03BD\\u03B1\\u03B6\\u03AE\\u03C4\\u03B7\\u03C3\\u03B7 \\u03A1\\u03CC\\u03BB\\u03C9\\u03BD\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=\\u0395\\u03C0\\u03B9\\u03C6\\u03AC\\u03BD\\u03B5\\u03B9\\u03B1 \\u0395\\u03C1\\u03B3\\u03B1\\u03C3\\u03AF\\u03B1\\u03C2\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=\\u03A0\\u03C1\\u03BF\\u03B2\\u03BF\\u03BB\\u03AE \\u03A1\\u03C5\\u03B8\\u03BC\\u03AF\\u03C3\\u03B5\\u03C9\\u03BD \\u03A4\\u03B1\\u03BE\\u03B9\\u03BD\\u03CC\\u03BC\\u03B7\\u03C3\\u03B7\\u03C2\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=\\u03A0\\u03C1\\u03BF\\u03B2\\u03BF\\u03BB\\u03AE \\u03A1\\u03C5\\u03B8\\u03BC\\u03AF\\u03C3\\u03B5\\u03C9\\u03BD \\u03A6\\u03AF\\u03BB\\u03C4\\u03C1\\u03BF\\u03C5\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=\\u03A0\\u03C1\\u03BF\\u03B2\\u03BF\\u03BB\\u03AE \\u03A1\\u03C5\\u03B8\\u03BC\\u03AF\\u03C3\\u03B5\\u03C9\\u03BD \\u039F\\u03BC\\u03AC\\u03B4\\u03B1\\u03C2\n\n#XFLD\nLabel.PageID=ID \\u03A3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1\\u03C2\n#XFLD\nLabel.Title=\\u03A4\\u03AF\\u03C4\\u03BB\\u03BF\\u03C2\n#XFLD\nLabel.WorkbenchRequest=\\u0391\\u03AF\\u03C4\\u03B7\\u03C3\\u03B7 \\u03A0\\u03B5\\u03B4\\u03AF\\u03BF\\u03C5 \\u0395\\u03C1\\u03B3\\u03B1\\u03C3\\u03B9\\u03CE\\u03BD\n#XFLD\nLabel.Package=\\u03A0\\u03B1\\u03BA\\u03AD\\u03C4\\u03BF\n#XFLD\nLabel.TransportInformation=\\u03A0\\u03BB\\u03B7\\u03C1\\u03BF\\u03C6\\u03BF\\u03C1\\u03AF\\u03B5\\u03C2 \\u039C\\u03B5\\u03C4\\u03B1\\u03C6\\u03BF\\u03C1\\u03AC\\u03C2\n#XFLD\nLabel.Details=\\u039B\\u03B5\\u03C0\\u03C4\\u03BF\\u03BC\\u03AD\\u03C1\\u03B5\\u03B9\\u03B5\\u03C2\\:\n#XFLD\nLabel.ResponseCode=\\u039A\\u03C9\\u03B4\\u03B9\\u03BA\\u03CC\\u03C2 \\u0391\\u03C0\\u03AC\\u03BD\\u03C4\\u03B7\\u03C3\\u03B7\\u03C2\\:\n#XFLD\nLabel.ModifiedBy=\\u03A4\\u03C1\\u03BF\\u03C0\\u03BF\\u03C0\\u03BF\\u03B9\\u03AE\\u03B8\\u03B7\\u03BA\\u03B5 \\u03B1\\u03C0\\u03CC\\:\n#XFLD\nLabel.Description=\\u03A0\\u03B5\\u03C1\\u03B9\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE\n#XFLD\nLabel.CreatedByFullname=\\u0394\\u03B7\\u03BC\\u03B9\\u03BF\\u03C5\\u03C1\\u03B3\\u03AE\\u03B8\\u03B7\\u03BA\\u03B5 \\u0391\\u03C0\\u03CC\n#XFLD\nLabel.CreatedOn=\\u0394\\u03B7\\u03BC\\u03B9\\u03BF\\u03C5\\u03C1\\u03B3\\u03AE\\u03B8\\u03B7\\u03BA\\u03B5 \\u03A3\\u03C4\\u03B9\\u03C2\n#XFLD\nLabel.ChangedByFullname=\\u0391\\u03BB\\u03BB\\u03B1\\u03B3\\u03BC\\u03AD\\u03BD\\u03BF \\u0391\\u03C0\\u03CC\n#XFLD\nLabel.ChangedOn=\\u0391\\u03BB\\u03BB\\u03B1\\u03BE\\u03B5 \\u03A3\\u03C4\\u03B9\\u03C2\n#XFLD\nLabel.PageTitle=\\u03A4\\u03AF\\u03C4\\u03BB\\u03BF\\u03C2 \\u03A3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1\\u03C2\n#XFLD\nLabel.AssignedRole=\\u0391\\u03BD\\u03C4\\u03B9\\u03C3\\u03C4\\u03BF\\u03B9\\u03C7\\u03B9\\u03C3\\u03BC\\u03AD\\u03BD\\u03BF\\u03C2 \\u03A1\\u03CC\\u03BB\\u03BF\\u03C2\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=\\u03A4\\u03AF\\u03C4\\u03BB\\u03BF\\u03C2\n#XCOL\nColumn.PageDescription=\\u03A0\\u03B5\\u03C1\\u03B9\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE\n#XCOL\nColumn.PageAssignmentStatus=\\u0391\\u03BD\\u03C4\\u03B9\\u03C3\\u03C4\\u03BF\\u03B9\\u03C7\\u03AF\\u03C3\\u03C4\\u03B7\\u03BA\\u03B5 \\u03BC\\u03B5 \\u039A\\u03B5\\u03BD\\u03CC/\\u03A1\\u03CC\\u03BB\\u03BF\n#XCOL\nColumn.PagePackage=\\u03A0\\u03B1\\u03BA\\u03AD\\u03C4\\u03BF\n#XCOL\nColumn.PageWorkbenchRequest=\\u0391\\u03AF\\u03C4\\u03B7\\u03C3\\u03B7 \\u03A0\\u03B5\\u03B4\\u03AF\\u03BF\\u03C5 \\u0395\\u03C1\\u03B3\\u03B1\\u03C3\\u03B9\\u03CE\\u03BD\n#XCOL\nColumn.PageCreatedBy=\\u0394\\u03B7\\u03BC\\u03B9\\u03BF\\u03C5\\u03C1\\u03B3\\u03AE\\u03B8\\u03B7\\u03BA\\u03B5 \\u0391\\u03C0\\u03CC\n#XCOL\nColumn.PageCreatedOn=\\u0394\\u03B7\\u03BC\\u03B9\\u03BF\\u03C5\\u03C1\\u03B3\\u03AE\\u03B8\\u03B7\\u03BA\\u03B5 \\u03A3\\u03C4\\u03B9\\u03C2\n#XCOL\nColumn.PageChangedBy=\\u0391\\u03BB\\u03BB\\u03B1\\u03B3\\u03BC\\u03AD\\u03BD\\u03BF \\u0391\\u03C0\\u03CC\n#XCOL\nColumn.PageChangedOn=\\u0391\\u03BB\\u03BB\\u03B1\\u03BE\\u03B5 \\u03A3\\u03C4\\u03B9\\u03C2\n\n#XTOL\nPlaceholder.SectionName=\\u0395\\u03B9\\u03C3\\u03B1\\u03B3\\u03C9\\u03B3\\u03AE \\u03BF\\u03BD\\u03CC\\u03BC\\u03B1\\u03C4\\u03BF\\u03C2 \\u03B5\\u03BD\\u03CC\\u03C4\\u03B7\\u03C4\\u03B1\\u03C2\n#XTOL\nPlaceholder.SearchForTiles=\\u0391\\u03BD\\u03B1\\u03B6\\u03AE\\u03C4\\u03B7\\u03C3\\u03B7 \\u03C0\\u03BB\\u03B1\\u03BA\\u03B9\\u03B4\\u03AF\\u03C9\\u03BD\n#XTOL\nPlaceholder.SearchForRoles=\\u0391\\u03BD\\u03B1\\u03B6\\u03AE\\u03C4\\u03B7\\u03C3\\u03B7 \\u03C1\\u03CC\\u03BB\\u03C9\\u03BD\n#XTOL\nPlaceholder.CopyPageTitle=\\u0391\\u03BD\\u03C4\\u03AF\\u03B3\\u03C1\\u03B1\\u03C6\\u03BF \\u03C4\\u03BF\\u03C5 \\u00AB{0}\\u00BB\n#XTOL\nPlaceholder.CopyPageID=\\u0391\\u03BD\\u03C4\\u03AF\\u03B3\\u03C1\\u03B1\\u03C6\\u03BF \\u03C4\\u03BF\\u03C5 \\u00AB{0}\\u00BB\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=\\u03CC\\u03BB\\u03B1\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=\\u0395\\u03BD\\u03CC\\u03C4\\u03B7\\u03C4\\u03B1 {0} \\u03B4\\u03B5\\u03BD \\u03AD\\u03C7\\u03B5\\u03B9 \\u03C4\\u03AF\\u03C4\\u03BB\\u03BF. \\u0393\\u03B9\\u03B1 \\u03BC\\u03B9\\u03B1 \\u03C3\\u03C5\\u03BD\\u03B5\\u03C0\\u03AE \\u03B5\\u03BC\\u03C0\\u03B5\\u03B9\\u03C1\\u03AF\\u03B1 \\u03C7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7 \\u03C3\\u03B1\\u03C2 \\u03C0\\u03C1\\u03BF\\u03C4\\u03B5\\u03AF\\u03BD\\u03BF\\u03C5\\u03BC\\u03B5 \\u03BD\\u03B1 \\u03B5\\u03B9\\u03C3\\u03AC\\u03B3\\u03B5\\u03C4\\u03B5 \\u03CC\\u03BD\\u03BF\\u03BC\\u03B1 \\u03B3\\u03B9\\u03B1 \\u03BA\\u03AC\\u03B8\\u03B5 \\u03B5\\u03BD\\u03CC\\u03C4\\u03B7\\u03C4\\u03B1.\n#XMSG\nMessage.InvalidSectionTitle=\\u0399\\u03B4\\u03B1\\u03BD\\u03B9\\u03BA\\u03AC, \\u03C0\\u03C1\\u03AD\\u03C0\\u03B5\\u03B9 \\u03BD\\u03B1 \\u03B5\\u03B9\\u03C3\\u03AC\\u03B3\\u03B5\\u03C4\\u03B5 \\u03CC\\u03BD\\u03BF\\u03BC\\u03B1 \\u03B5\\u03BD\\u03CC\\u03C4\\u03B7\\u03C4\\u03B1\\u03C2.\n#XMSG\nMessage.NoInternetConnection=\\u0395\\u03BB\\u03AD\\u03B3\\u03BE\\u03C4\\u03B5 \\u03C4\\u03B7 \\u03C3\\u03CD\\u03BD\\u03B4\\u03B5\\u03C3\\u03AE \\u03C3\\u03B1\\u03C2 \\u03C3\\u03C4\\u03BF \\u03B4\\u03B9\\u03B1\\u03B4\\u03AF\\u03BA\\u03C4\\u03C5\\u03BF.\n#XMSG\nMessage.SavedChanges=\\u039F\\u03B9 \\u03B1\\u03BB\\u03BB\\u03B1\\u03B3\\u03AD\\u03C2 \\u03C3\\u03B1\\u03C2 \\u03B1\\u03C0\\u03BF\\u03B8\\u03B7\\u03BA\\u03B5\\u03CD\\u03C4\\u03B7\\u03BA\\u03B1\\u03BD.\n#XMSG\nMessage.InvalidPageID=\\u03A7\\u03C1\\u03B7\\u03C3\\u03B9\\u03BC\\u03BF\\u03C0\\u03BF\\u03B9\\u03AE\\u03C3\\u03C4\\u03B5 \\u03BC\\u03CC\\u03BD\\u03BF \\u03C4\\u03BF\\u03C5\\u03C2 \\u03B5\\u03BE\\u03AE\\u03C2 \\u03C7\\u03B1\\u03C1\\u03B1\\u03BA\\u03C4\\u03AE\\u03C1\\u03B5\\u03C2\\: \\u0391-\\u0396, 0-9, _ and /. \\u03A4\\u03BF ID \\u03C3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1\\u03C2 \\u03B4\\u03B5\\u03BD \\u03C0\\u03C1\\u03AD\\u03C0\\u03B5\\u03B9 \\u03BD\\u03B1 \\u03BE\\u03B5\\u03BA\\u03B9\\u03BD\\u03AC\\u03B5\\u03B9 \\u03BC\\u03B5 \\u03B1\\u03C1\\u03B9\\u03B8\\u03BC\\u03CC.\n#XMSG\nMessage.EmptyPageID=\\u0395\\u03B9\\u03C3\\u03AC\\u03B3\\u03B5\\u03C4\\u03B5 \\u03AD\\u03B3\\u03BA\\u03C5\\u03C1\\u03BF ID \\u03C3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1\\u03C2.\n#XMSG\nMessage.EmptyTitle=\\u0395\\u03B9\\u03C3\\u03AC\\u03B3\\u03B5\\u03C4\\u03B5 \\u03AD\\u03B3\\u03BA\\u03C5\\u03C1\\u03BF \\u03C4\\u03AF\\u03C4\\u03BB\\u03BF.\n#XMSG\nMessage.NoRoleSelected=\\u0395\\u03C0\\u03B9\\u03BB\\u03AD\\u03BE\\u03C4\\u03B5 \\u03C4\\u03BF\\u03C5\\u03BB\\u03AC\\u03C7\\u03B9\\u03C3\\u03C4\\u03BF\\u03BD \\u03AD\\u03BD\\u03B1\\u03BD \\u03C1\\u03CC\\u03BB\\u03BF.\n#XMSG\nMessage.SuccessDeletePage=\\u03A4\\u03BF \\u03B5\\u03C0\\u03B9\\u03BB\\u03B5\\u03B3\\u03BC\\u03AD\\u03BD\\u03BF \\u03B1\\u03BD\\u03C4\\u03B9\\u03BA\\u03B5\\u03AF\\u03BC\\u03B5\\u03BD\\u03BF \\u03B4\\u03B9\\u03B1\\u03B3\\u03C1\\u03AC\\u03C6\\u03B7\\u03BA\\u03B5.\n#XMSG\nMessage.ClipboardCopySuccess=\\u039B\\u03B5\\u03C0\\u03C4\\u03BF\\u03BC\\u03AD\\u03C1\\u03B5\\u03B9\\u03B5\\u03C2 \\u03B1\\u03BD\\u03C4\\u03B9\\u03B3\\u03C1\\u03AC\\u03C6\\u03B7\\u03BA\\u03B1\\u03BD \\u03B5\\u03C0\\u03B9\\u03C4\\u03C5\\u03C7\\u03CE\\u03C2.\n#YMSE\nMessage.ClipboardCopyFail=\\u03A3\\u03C6\\u03AC\\u03BB\\u03BC\\u03B1 \\u03B5\\u03BC\\u03C6\\u03B1\\u03BD\\u03AF\\u03C3\\u03C4\\u03B7\\u03BA\\u03B5 \\u03B1\\u03BA\\u03C4\\u03AC \\u03C4\\u03B7\\u03BD \\u03B1\\u03BD\\u03C4\\u03B9\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE \\u03BB\\u03B5\\u03C0\\u03C4\\u03BF\\u03BC\\u03B5\\u03C1\\u03B5\\u03B9\\u03CE\\u03BD.\n#XMSG\nMessage.PageCreated=\\u0397 \\u03C3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1 \\u03B4\\u03B7\\u03BC\\u03B9\\u03BF\\u03C5\\u03C1\\u03B3\\u03AE\\u03B8\\u03B7\\u03BA\\u03B5.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=\\u03A7\\u03C9\\u03C1\\u03AF\\u03C2 \\u03C0\\u03BB\\u03B1\\u03BA\\u03AF\\u03B4\\u03B9\\u03B1\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=\\u039C\\u03B7 \\u03B4\\u03B9\\u03B1\\u03B8\\u03AD\\u03C3\\u03B9\\u03BC\\u03BF\\u03B9 \\u03C1\\u03CC\\u03BB\\u03BF\\u03B9.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=\\u03A1\\u03CC\\u03BB\\u03BF\\u03B9 \\u03B4\\u03B5\\u03BD \\u03B2\\u03C1\\u03AD\\u03B8\\u03B7\\u03BA\\u03B1\\u03BD. \\u03A0\\u03C1\\u03BF\\u03C3\\u03C0\\u03B1\\u03B8\\u03AE\\u03C3\\u03C4\\u03B5 \\u03BD\\u03B1 \\u03C0\\u03C1\\u03BF\\u03C3\\u03B1\\u03C1\\u03BC\\u03CC\\u03C3\\u03B5\\u03C4\\u03B5 \\u03C4\\u03B7\\u03BD \\u03B1\\u03BD\\u03B1\\u03B6\\u03AE\\u03C4\\u03B7\\u03C3\\u03AE \\u03C3\\u03B1\\u03C2.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=\\u03A7\\u03C9\\u03C1\\u03AF\\u03C2 \\u03B5\\u03BD\\u03CC\\u03C4\\u03B7\\u03C4\\u03B5\\u03C2\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=\\u0391\\u03C0\\u03BF\\u03C4\\u03C5\\u03C7\\u03AF\\u03B1 \\u03C6\\u03CC\\u03C1\\u03C4\\u03C9\\u03C3\\u03B7\\u03C2 \\u03C4\\u03BF\\u03C5 \\u03C0\\u03BB\\u03B1\\u03BA\\u03B9\\u03B4\\u03AF\\u03BF\\u03C5 {0} \\u03C3\\u03C4\\u03B7\\u03BD \\u03B5\\u03BD\\u03CC\\u03C4\\u03B7\\u03C4\\u03B1 \\u00AB{1}\\u00BB.\\n\\n\\u0391\\u03C5\\u03C4\\u03CC \\u03C0\\u03B9\\u03B8\\u03B1\\u03BD\\u03CE\\u03C2 \\u03C0\\u03C1\\u03BF\\u03BA\\u03BB\\u03AE\\u03B8\\u03B7\\u03BA\\u03B5 \\u03B1\\u03C0\\u03CC \\u03BB\\u03B1\\u03BD\\u03B8\\u03B1\\u03C3\\u03BC\\u03AD\\u03BD\\u03B7 \\u03B4\\u03B9\\u03B1\\u03BC\\u03CC\\u03C1\\u03C6\\u03C9\\u03C3\\u03B7 \\u03C0\\u03B5\\u03C1\\u03B9\\u03B5\\u03C7\\u03BF\\u03BC\\u03AD\\u03BD\\u03BF\\u03C5 SAP Fiori launchpad \\u03AE \\u03B1\\u03C0\\u03CC \\u03B1\\u03BD\\u03C4\\u03B9\\u03C3\\u03C4\\u03BF\\u03AF\\u03C7\\u03B9\\u03C3\\u03B7 \\u03C1\\u03CC\\u03BB\\u03BF\\u03C5 \\u03C0\\u03BF\\u03C5 \\u03BB\\u03B5\\u03AF\\u03C0\\u03B5\\u03B9.\\n\\n\\u0397 \\u03BF\\u03C0\\u03C4\\u03B9\\u03BA\\u03BF\\u03C0\\u03BF\\u03AF\\u03B7\\u03C3\\u03B7 \\u03B4\\u03B5\\u03BD \\u03B8\\u03B1 \\u03B5\\u03AF\\u03BD\\u03B1\\u03B9 \\u03BF\\u03C1\\u03B1\\u03C4\\u03AE \\u03C3\\u03C4\\u03BF\\u03BD \\u03C7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7.\\n\\n\\u0393\\u03B9\\u03B1 \\u03BD\\u03B1 \\u03B5\\u03C0\\u03B9\\u03BB\\u03CD\\u03C3\\u03B5\\u03C4\\u03B5 \\u03B1\\u03C5\\u03C4\\u03CC \\u03C4\\u03BF \\u03C0\\u03C1\\u03CC\\u03B2\\u03BB\\u03B7\\u03BC\\u03B1, \\u03B5\\u03BB\\u03AD\\u03B3\\u03BE\\u03C4\\u03B5 \\u03C4\\u03BF\\u03C5\\u03C2 \\u03BA\\u03B1\\u03C4\\u03B1\\u03BB\\u03CC\\u03B3\\u03BF\\u03C5\\u03C2 \\u03BA\\u03B1\\u03B9 \\u03C4\\u03B9\\u03C2 \\u03B1\\u03C0\\u03B5\\u03B9\\u03BA\\u03BF\\u03BD\\u03AF\\u03C3\\u03B5\\u03B9\\u03C2 \\u03C3\\u03C4\\u03CC\\u03C7\\u03BF\\u03C5 \\u03C0\\u03BF\\u03C5 \\u03B1\\u03BD\\u03C4\\u03B9\\u03C3\\u03C4\\u03BF\\u03B9\\u03C7\\u03AF\\u03B6\\u03BF\\u03BD\\u03C4\\u03B1\\u03B9 \\u03BC\\u03B5 \\u03B1\\u03C5\\u03C4\\u03CC\\u03BD \\u03C4\\u03BF\\u03BD \\u03C1\\u03CC\\u03BB\\u03BF.\n#XMSG\nMessage.NavigationTargetError=\\u03A3\\u03C4\\u03CC\\u03C7\\u03BF\\u03C2 \\u03C0\\u03BB\\u03BF\\u03AE\\u03B3\\u03B7\\u03C3\\u03B7\\u03C2 \\u03B4\\u03B5\\u03BD \\u03B5\\u03C0\\u03B9\\u03BB\\u03CD\\u03B8\\u03B7\\u03BA\\u03B5.\n#XMSG\nMessage.LoadPageError=\\u0391\\u03B4\\u03CD\\u03BD\\u03B1\\u03C4\\u03B7 \\u03C6\\u03CC\\u03C1\\u03C4\\u03C9\\u03C3\\u03B7 \\u03C4\\u03B7\\u03C2 \\u03C3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1\\u03C2.\n#XMSG\nMessage.UpdatePageError=\\u0391\\u03B4\\u03CD\\u03BD\\u03B1\\u03C4\\u03B7 \\u03B5\\u03BD\\u03B7\\u03BC\\u03AD\\u03C1\\u03C9\\u03C3\\u03B7 \\u03C4\\u03B7\\u03C2 \\u03C3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1\\u03C2.\n#XMSG\nMessage.CreatePageError=\\u0391\\u03B4\\u03CD\\u03BD\\u03B1\\u03C4\\u03B7 \\u03B4\\u03B7\\u03BC\\u03B9\\u03BF\\u03C5\\u03C1\\u03B3\\u03AF\\u03B1 \\u03C4\\u03B7\\u03C2 \\u03C3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1\\u03C2.\n#XMSG\nMessage.TilesHaveErrors=\\u039C\\u03B5\\u03C1\\u03B9\\u03BA\\u03AC \\u03C0\\u03BB\\u03B1\\u03BA\\u03AF\\u03B4\\u03B9\\u03B1 \\u03AE \\u03BC\\u03B5\\u03C1\\u03B9\\u03BA\\u03AD\\u03C2 \\u03B5\\u03BD\\u03CC\\u03C4\\u03B7\\u03C4\\u03B5\\u03C2 \\u03AD\\u03C7\\u03BF\\u03C5\\u03BD \\u03C3\\u03C6\\u03AC\\u03BB\\u03BC\\u03B1\\u03C4\\u03B1. \\u0398\\u03AD\\u03BB\\u03B5\\u03C4\\u03B5 \\u03BD\\u03B1 \\u03C3\\u03C5\\u03BD\\u03B5\\u03C7\\u03AF\\u03C3\\u03B5\\u03C4\\u03B5 \\u03BC\\u03B5 \\u03C4\\u03B7\\u03BD \\u03B1\\u03C0\\u03BF\\u03B8\\u03AE\\u03BA\\u03B5\\u03C5\\u03C3\\u03B7;\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=\\u0391\\u03C0\\u03BF\\u03C4\\u03C5\\u03C7\\u03AF\\u03B1 \\u03B1\\u03BD\\u03AC\\u03BB\\u03C5\\u03C3\\u03B7\\u03C2 \\u03C3\\u03C4\\u03CC\\u03C7\\u03BF\\u03C5 \\u03C0\\u03BB\\u03BF\\u03AE\\u03B3\\u03B7\\u03C3\\u03B7\\u03C2 \\u03C4\\u03BF\\u03C5 \\u03C0\\u03BB\\u03B1\\u03BA\\u03B9\\u03B4\\u03AF\\u03BF\\u03C5 \\u00AB{0}\\u00BB.\\n\\n\\u0391\\u03C5\\u03C4\\u03CC \\u03C0\\u03B9\\u03B8\\u03B1\\u03BD\\u03CE\\u03C2 \\u03BD\\u03B1 \\u03C0\\u03C1\\u03BF\\u03BA\\u03B1\\u03BB\\u03B5\\u03AF\\u03C4\\u03B1\\u03B9 \\u03B1\\u03C0\\u03CC \\u03BB\\u03B1\\u03BD\\u03B8\\u03B1\\u03C3\\u03BC\\u03AD\\u03BD\\u03B7 \\u03B4\\u03B9\\u03B1\\u03BC\\u03CC\\u03C1\\u03C6\\u03C9\\u03C3\\u03B7 \\u03C0\\u03B5\\u03C1\\u03B9\\u03B5\\u03C7\\u03BF\\u03BC\\u03AD\\u03BD\\u03BF\\u03C5 SAP Fiori launchpad \\u03AE \\u03B1\\u03C0\\u03CC \\u03B1\\u03BD\\u03C4\\u03B9\\u03C3\\u03C4\\u03BF\\u03AF\\u03C7\\u03B9\\u03C3\\u03B7 \\u03C1\\u03CC\\u03BB\\u03BF\\u03C5 \\u03C0\\u03BF\\u03C5 \\u03BB\\u03B5\\u03AF\\u03C0\\u03B5\\u03B9.\\n\\n\\u03A4\\u03BF \\u03C0\\u03BB\\u03B1\\u03BA\\u03AF\\u03B4\\u03B9\\u03BF \\u00AB{0}\\u00BB \\u03B8\\u03B1 \\u03B5\\u03BC\\u03C6\\u03B1\\u03BD\\u03AF\\u03B6\\u03B5\\u03C4\\u03B1\\u03B9 \\u03C3\\u03C4\\u03BF\\u03BD \\u03C7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7, \\u03B1\\u03BB\\u03BB\\u03AC \\u03BF \\u03C7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7\\u03C2 \\u03B4\\u03B5\\u03BD \\u03B8\\u03B1 \\u03BC\\u03C0\\u03C1\\u03BF\\u03B5\\u03AF \\u03BD\\u03B1 \\u03C0\\u03BB\\u03BF\\u03B7\\u03B3\\u03B7\\u03B8\\u03B5\\u03AF \\u03C7\\u03C1\\u03B7\\u03C3\\u03B9\\u03BC\\u03BF\\u03C0\\u03BF\\u03B9\\u03CE\\u03BD\\u03C4\\u03B1\\u03C2 \\u03B1\\u03C5\\u03C4\\u03CC \\u03C4\\u03BF \\u03C0\\u03BB\\u03B1\\u03BA\\u03AF\\u03B4\\u03B9\\u03BF.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=\\u0398\\u03AD\\u03BB\\u03B5\\u03C4\\u03B5 \\u03BD\\u03B1 \\u03B4\\u03B9\\u03B1\\u03B3\\u03C1\\u03AC\\u03C8\\u03B5\\u03C4\\u03B5 \\u03C4\\u03B7\\u03BD \\u03B5\\u03BD\\u03CC\\u03C4\\u03B7\\u03C4\\u03B1 {0}";\n#XMSG\nMessage.Section.DeleteNoTitle=\\u0398\\u03AD\\u03BB\\u03B5\\u03C4\\u03B5 \\u03BD\\u03B1 \\u03B4\\u03B9\\u03B1\\u03B3\\u03C1\\u03AC\\u03C8\\u03B5\\u03C4\\u03B5 \\u03B1\\u03C5\\u03C4\\u03AE\\u03BD \\u03C4\\u03B7\\u03BD \\u03B5\\u03BD\\u03CC\\u03C4\\u03B7\\u03C4\\u03B1;\n#XMSG\nMessage.OverwriteChanges=\\u03A5\\u03C0\\u03AE\\u03C1\\u03BE\\u03B1\\u03BD \\u03B1\\u03BB\\u03BB\\u03B1\\u03B3\\u03AD\\u03C2 \\u03BA\\u03B1\\u03C4\\u03AC \\u03C4\\u03B7\\u03BD \\u03B5\\u03C0\\u03B5\\u03BE\\u03B5\\u03C1\\u03B3\\u03B1\\u03C3\\u03AF\\u03B1 \\u03C4\\u03B7\\u03C2 \\u03C3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1\\u03C2. \\u0398\\u03AD\\u03BB\\u03B5\\u03C4\\u03B5 \\u03BD\\u03B1 \\u03C4\\u03B9\\u03C2 \\u03B5\\u03C0\\u03B1\\u03BD\\u03B5\\u03B3\\u03B3\\u03C1\\u03AC\\u03C8\\u03B5\\u03C4\\u03B5;\n#XMSG\nMessage.OverwriteRemovedPage=\\u0397 \\u03C3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1 \\u03C3\\u03C4\\u03B7\\u03BD \\u03BF\\u03C0\\u03BF\\u03AF\\u03B1 \\u03B5\\u03C1\\u03B3\\u03AC\\u03B6\\u03B5\\u03C3\\u03C4\\u03B5 \\u03B4\\u03B9\\u03B1\\u03B3\\u03C1\\u03AC\\u03C6\\u03B7\\u03BA\\u03B5 \\u03B1\\u03C0\\u03CC \\u03B4\\u03B9\\u03B1\\u03C6\\u03BF\\u03C1\\u03B5\\u03C4\\u03B9\\u03BA\\u03CC \\u03C7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7. \\u0398\\u03AD\\u03BB\\u03B5\\u03C4\\u03B5 \\u03BD\\u03B1 \\u03B5\\u03C0\\u03B1\\u03BD\\u03B5\\u03B3\\u03B3\\u03C1\\u03AC\\u03C8\\u03B5\\u03C4\\u03B5 \\u03C4\\u03B7\\u03BD \\u03B1\\u03BB\\u03BB\\u03B1\\u03B3\\u03AE;\n#XMSG\nMessage.SaveChanges=\\u0391\\u03C0\\u03BF\\u03B8\\u03B7\\u03BA\\u03B5\\u03CD\\u03C3\\u03C4\\u03B5 \\u03C4\\u03B9\\u03C2 \\u03B1\\u03BB\\u03BB\\u03B1\\u03B3\\u03AD\\u03C2.\n#XMSG\nMessage.NoPages=\\u03A3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B5\\u03C2 \\u03BC\\u03B7 \\u03B4\\u03B9\\u03B1\\u03B8\\u03AD\\u03C3\\u03B9\\u03BC\\u03B5\\u03C2.\n#XMSG\nMessage.NoPagesFound=\\u03A3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B5\\u03C2 \\u03B4\\u03B5\\u03BD \\u03B2\\u03C1\\u03AD\\u03B8\\u03B7\\u03BA\\u03B1\\u03BD. \\u03A0\\u03C1\\u03BF\\u03C3\\u03C0\\u03B1\\u03B8\\u03AE\\u03C3\\u03C4\\u03B5 \\u03BD\\u03B1 \\u03C0\\u03C1\\u03BF\\u03C3\\u03B1\\u03C1\\u03BC\\u03CC\\u03C3\\u03B5\\u03C4\\u03B5 \\u03C4\\u03B7\\u03BD \\u03B1\\u03BD\\u03B1\\u03B6\\u03AE\\u03C4\\u03B7\\u03C3\\u03AE \\u03C3\\u03B1\\u03C2.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=\\u03A0\\u03B5\\u03C1\\u03B9\\u03B5\\u03C7\\u03CC\\u03BC\\u03B5\\u03BD\\u03BF \\u03C0\\u03B5\\u03C1\\u03B9\\u03BF\\u03C1\\u03AF\\u03C3\\u03C4\\u03B7\\u03BA\\u03B5 \\u03C3\\u03B5 \\u03B3\\u03B5\\u03BD\\u03B9\\u03BA\\u03CC \\u03C0\\u03BB\\u03B1\\u03AF\\u03C3\\u03B9\\u03BF \\u03C1\\u03CC\\u03BB\\u03BF\\u03C5.\n#XMSG\nMessage.NotAssigned=\\u0394\\u03B5\\u03BD \\u03B1\\u03BD\\u03C4\\u03B9\\u03C3\\u03C4\\u03BF\\u03B9\\u03C7\\u03AF\\u03C3\\u03C4\\u03B7\\u03BA\\u03B5.\n#XMSG\nMessage.StatusAssigned=\\u0391\\u03BD\\u03C4\\u03B9\\u03C3\\u03C4\\u03BF\\u03B9\\u03C7\\u03B9\\u03C3\\u03BC\\u03AD\\u03BD\\u03BF\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=\\u039D\\u03AD\\u03B1 \\u03A3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=\\u0395\\u03C0\\u03B9\\u03BB\\u03BF\\u03B3\\u03AE \\u03A0\\u03BB\\u03B1\\u03B9\\u03C3\\u03AF\\u03BF\\u03C5 \\u03A1\\u03CC\\u03BB\\u03BF\\u03C5\n#XTIT\nTitle.TilesHaveErrors=\\u03A0\\u03BB\\u03B1\\u03BA\\u03AF\\u03B4\\u03B9\\u03B1 \\u0395\\u03C7\\u03BF\\u03C5\\u03BD \\u03A3\\u03C6\\u03AC\\u03BB\\u03BC\\u03B1\\u03C4\\u03B1\n#XTIT\nDeleteDialog.Title=\\u0394\\u03B9\\u03B1\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE\n#XMSG\nDeleteDialog.Text=\\u0398\\u03AD\\u03BB\\u03B5\\u03C4\\u03B5 \\u03BD\\u03B1 \\u03B4\\u03B9\\u03B1\\u03B3\\u03C1\\u03AC\\u03C8\\u03B5\\u03C4\\u03B5 \\u03C4\\u03B7\\u03BD \\u03B5\\u03C0\\u03B9\\u03BB\\u03B5\\u03B3\\u03BC\\u03AD\\u03BD\\u03B7 \\u03C3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1;\n#XBUT\nDeleteDialog.ConfirmButton=\\u0394\\u03B9\\u03B1\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE\n#XTIT\nDeleteDialog.LockedTitle=\\u03A3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1 \\u03BA\\u03BB\\u03B5\\u03B9\\u03B4\\u03CE\\u03B8\\u03B7\\u03BA\\u03B5\n#XMSG\nDeleteDialog.LockedText=\\u0397 \\u03B5\\u03C0\\u03B9\\u03BB\\u03B5\\u03B3\\u03BC\\u03AD\\u03BD\\u03B7 \\u03C3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1 \\u03B5\\u03AF\\u03BD\\u03B1\\u03B9 \\u03BA\\u03BB\\u03B5\\u03B9\\u03B4\\u03C9\\u03BC\\u03AD\\u03BD\\u03B7 \\u03B1\\u03C0\\u03CC \\u03C7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7 \\u00AB{0}\\u00BB.\n#XMSG\nDeleteDialog.TransportRequired=\\u0395\\u03C0\\u03B9\\u03BB\\u03AD\\u03BE\\u03C4\\u03B5 \\u03AD\\u03BD\\u03B1 \\u03C0\\u03B1\\u03BA\\u03AD\\u03C4\\u03BF \\u03BC\\u03B5\\u03C4\\u03B1\\u03C6\\u03BF\\u03C1\\u03AC\\u03C2 \\u03B3\\u03B9\\u03B1 \\u03B4\\u03B9\\u03B1\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE \\u03C4\\u03B7\\u03C2 \\u03B5\\u03C0\\u03B9\\u03BB\\u03B5\\u03B3\\u03BC\\u03AD\\u03BD\\u03B7\\u03C2 \\u03C3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1\\u03C2.\n\n#XMSG\nEditDialog.LockedText=\\u0397 \\u03B5\\u03C0\\u03B9\\u03BB\\u03B5\\u03B3\\u03BC\\u03AD\\u03BD\\u03B7 \\u03C3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1 \\u03B5\\u03AF\\u03BD\\u03B1\\u03B9 \\u03BA\\u03BB\\u03B5\\u03B9\\u03B4\\u03C9\\u03BC\\u03AD\\u03BD\\u03B7 \\u03B1\\u03C0\\u03CC \\u03C7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7 \\u00AB{0}\\u00BB.\n#XMSG\nEditDialog.TransportRequired=\\u0395\\u03C0\\u03B9\\u03BB\\u03AD\\u03BE\\u03C4\\u03B5 \\u03AD\\u03BD\\u03B1 \\u03C0\\u03B1\\u03BA\\u03AD\\u03C4\\u03BF \\u03BC\\u03B5\\u03C4\\u03B1\\u03C6\\u03BF\\u03C1\\u03AC\\u03C2 \\u03B3\\u03B9\\u03B1 \\u03B5\\u03C0\\u03B5\\u03BE\\u03B5\\u03C1\\u03B3\\u03B1\\u03C3\\u03AF\\u03B1 \\u03C4\\u03B7\\u03C2 \\u03B5\\u03C0\\u03B9\\u03BB\\u03B5\\u03B3\\u03BC\\u03AD\\u03BD\\u03B7\\u03C2 \\u03C3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1\\u03C2.\n#XTIT\nEditDialog.Title=\\u0395\\u03C0\\u03B5\\u03BE\\u03B5\\u03C1\\u03B3\\u03B1\\u03C3\\u03AF\\u03B1 \\u03A3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1\\u03C2\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=\\u0391\\u03C5\\u03C4\\u03AE \\u03B7 \\u03C3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1 \\u03B4\\u03B7\\u03BC\\u03B9\\u03BF\\u03C5\\u03C1\\u03B3\\u03AE\\u03B8\\u03B7\\u03BA\\u03B5 \\u03C3\\u03C4\\u03B7 \\u03B3\\u03BB\\u03CE\\u03C3\\u03C3\\u03B1 \\u00AB{0}\\u00BB \\u03B1\\u03BB\\u03BB\\u03AC \\u03B7 \\u03B3\\u03BB\\u03CE\\u03C3\\u03C3\\u03B1 \\u03C3\\u03CD\\u03BD\\u03B4\\u03B5\\u03C3\\u03B7\\u03C2 \\u03BF\\u03C1\\u03AF\\u03B6\\u03B5\\u03C4\\u03B1\\u03B9 \\u03C3\\u03B5 \\u00AB{1}\\u00BB. \\u0391\\u03BB\\u03BB\\u03AC\\u03BE\\u03C4\\u03B5 \\u03C4\\u03B7 \\u03B3\\u03BB\\u03CE\\u03C3\\u03C3\\u03B1 \\u03C3\\u03CD\\u03BD\\u03B4\\u03B5\\u03C3\\u03B7\\u03C2 \\u03C3\\u03B5 \\u00AB{0}\\u00BB \\u03B3\\u03B9\\u03B1 \\u03BD\\u03B1 \\u03C3\\u03C5\\u03BD\\u03B5\\u03C7\\u03AF\\u03C3\\u03B5\\u03C4\\u03B5.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=\\u03A5\\u03C0\\u03CC\\u03C4\\u03B9\\u03C4\\u03BB\\u03BF\\u03C2\n#XFLD\nTileInfoPopover.Label.Icon=\\u0395\\u03B9\\u03BA\\u03BF\\u03BD\\u03AF\\u03B4\\u03B9\\u03BF\n#XFLD\nTileInfoPopover.Label.SemanticObject=\\u0391\\u03BD\\u03C4\\u03B9\\u03BA\\u03B5\\u03AF\\u03BC\\u03B5\\u03BD\\u03BF \\u03A3\\u03B7\\u03BC\\u03B1\\u03C3\\u03B9\\u03BF\\u03BB\\u03BF\\u03B3\\u03AF\\u03B1\\u03C2\n#XFLD\nTileInfoPopover.Label.SemanticAction=\\u0395\\u03BD\\u03AD\\u03C1\\u03B3\\u03B5\\u03B9\\u03B1 \\u03A3\\u03B7\\u03BC\\u03B1\\u03C3\\u03B9\\u03BF\\u03BB\\u03BF\\u03B3\\u03AF\\u03B1\\u03C2\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori ID\n#XFLD\nTileInfoPopover.Label.AppDetail=\\u039B\\u03B5\\u03C0\\u03C4\\u03BF\\u03BC\\u03AD\\u03C1\\u03B5\\u03B9\\u03B5\\u03C2 \\u0395\\u03C6\\u03B1\\u03C1\\u03BC\\u03BF\\u03B3\\u03AE\\u03C2\n#XFLD\nTileInfoPopover.Label.AppType=\\u03A4\\u03CD\\u03C0\\u03BF\\u03C2 \\u0395\\u03C6\\u03B1\\u03C1\\u03BC\\u03BF\\u03B3\\u03AE\\u03C2\n#XFLD\nTileInfoPopover.Label.TileType=\\u03A4\\u03CD\\u03C0\\u03BF\\u03C2 \\u03A0\\u03BB\\u03B1\\u03BA\\u03B9\\u03B4\\u03AF\\u03BF\\u03C5\n#XFLD\nTileInfoPopover.Label.AvailableDevices=\\u0394\\u03B9\\u03B1\\u03B8\\u03AD\\u03C3\\u03B9\\u03BC\\u03B5\\u03C2 \\u03A3\\u03C5\\u03C3\\u03BA\\u03B5\\u03C5\\u03AD\\u03C2\n\n#XTIT\nErrorDialog.Title=\\u03A3\\u03C6\\u03AC\\u03BB\\u03BC\\u03B1\n\n#XTIT\nConfirmChangesDialog.Title=\\u03A0\\u03C1\\u03BF\\u03B5\\u03B9\\u03B4\\u03BF\\u03C0\\u03BF\\u03AF\\u03B7\\u03C3\\u03B7\n\n#XTIT\nPageOverview.Title=\\u03A3\\u03C5\\u03BD\\u03C4\\u03AE\\u03C1\\u03B7\\u03C3\\u03B7 \\u03A3\\u03B5\\u03BB\\u03AF\\u03B4\\u03C9\\u03BD\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=\\u0394\\u03B9\\u03AC\\u03C4\\u03B1\\u03BE\\u03B7\n\n#XTIT\nCopyDialog.Title=\\u0391\\u03BD\\u03C4\\u03B9\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE \\u03A3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1\\u03C2\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=\\u0398\\u03AD\\u03BB\\u03B5\\u03C4\\u03B5 \\u03BD\\u03B1 \\u03B1\\u03BD\\u03C4\\u03B9\\u03B3\\u03C1\\u03AC\\u03C8\\u03B5\\u03C4\\u03B5 \\u00AB{0}\\u00BB;\n#XFLD\nCopyDialog.NewID=\\u0391\\u03BD\\u03C4\\u03AF\\u03B3\\u03C1\\u03B1\\u03C6\\u03BF \\u03C4\\u03BF\\u03C5 \\u00AB{0}\\u00BB\n\n#XMSG\nTitle.NoSectionTitle=\\u03A4\\u03AF\\u03C4\\u03BB\\u03BF\\u03C2 \\u03B5\\u03BD\\u03CC\\u03C4\\u03B7\\u03C4\\u03B1\\u03C2 \\u03C4\\u03B7\\u03C2 \\u03B5\\u03BD\\u03CC\\u03C4\\u03B7\\u03C4\\u03B1\\u03C2 {0} \\u03B5\\u03AF\\u03BD\\u03B1\\u03B9 \\u03BA\\u03B5\\u03BD\\u03CC\\u03C2.\n#XMSG\nTitle.UnsufficientRoles=\\u0391\\u03BD\\u03B5\\u03C0\\u03B1\\u03C1\\u03BA\\u03AE\\u03C2 \\u03B1\\u03BD\\u03C4\\u03B9\\u03C3\\u03C4\\u03BF\\u03AF\\u03C7\\u03B9\\u03C3\\u03B7 \\u03C1\\u03CC\\u03BB\\u03BF\\u03C5 \\u03B3\\u03B9\\u03B1 \\u03B5\\u03BC\\u03C6\\u03AC\\u03BD\\u03B9\\u03C3\\u03B7 \\u03BF\\u03C0\\u03C4\\u03B9\\u03BA\\u03BF\\u03C0\\u03BF\\u03AF\\u03B7\\u03C3\\u03B7\\u03C2.\n#XMSG\nTitle.VisualizationIsNotVisible=\\u0397 \\u03BF\\u03C0\\u03C4\\u03B9\\u03BA\\u03BF\\u03C0\\u03BF\\u03AF\\u03B7\\u03C3\\u03B7 \\u03B4\\u03B5\\u03BD \\u03B8\\u03B1 \\u03B5\\u03BC\\u03C6\\u03B1\\u03BD\\u03AF\\u03B6\\u03B5\\u03C4\\u03B1\\u03B9.\n#XMSG\nTitle.VisualizationNotNavigateable=\\u0397 \\u03BF\\u03C0\\u03C4\\u03B9\\u03BA\\u03BF\\u03C0\\u03BF\\u03AF\\u03B7\\u03C3\\u03B7 \\u03B4\\u03B5\\u03BD \\u03BC\\u03C0\\u03BF\\u03C1\\u03B5\\u03AF \\u03BD\\u03B1 \\u03B1\\u03BD\\u03BF\\u03AF\\u03BE\\u03B5\\u03B9 \\u03BC\\u03AF\\u03B1 \\u03B5\\u03C6\\u03B1\\u03C1\\u03BC\\u03BF\\u03B3\\u03AE.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=\\u03A3\\u03C4\\u03B1\\u03C4\\u03B9\\u03BA\\u03CC \\u03A0\\u03BB\\u03B1\\u03BA\\u03AF\\u03B4\\u03B9\\u03BF\n#XTIT\nTitle.DynamicTile=\\u0394\\u03C5\\u03BD\\u03B1\\u03BC\\u03B9\\u03BA\\u03CC \\u03A0\\u03BB\\u03B1\\u03BA\\u03AF\\u03B4\\u03B9\\u03BF\n#XTIT\nTitle.CustomTile=\\u03A0\\u03B1\\u03C1\\u03B1\\u03BC\\u03B5\\u03C4\\u03C1\\u03BF\\u03C0\\u03BF\\u03B9\\u03B7\\u03BC\\u03AD\\u03BD\\u03BF \\u03A0\\u03BB\\u03B1\\u03BA\\u03AF\\u03B4\\u03B9\\u03BF\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=\\u03A0\\u03C1\\u03BF\\u03B5\\u03C0\\u03B9\\u03C3\\u03BA\\u03CC\\u03C0\\u03B7\\u03C3\\u03B7 \\u03A3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1\\u03C2\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=\\u039B\\u03C5\\u03C0\\u03BF\\u03CD\\u03BC\\u03B1\\u03C3\\u03C4\\u03B5, \\u03B7 \\u03C3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1 \\u03B4\\u03B5\\u03BD \\u03B2\\u03C1\\u03AD\\u03B8\\u03B7\\u03BA\\u03B5\n#XLNK\nErrorPage.Link=\\u03A3\\u03C5\\u03BD\\u03C4\\u03AE\\u03C1\\u03B7\\u03C3\\u03B7 \\u03A3\\u03B5\\u03BB\\u03AF\\u03B4\\u03C9\\u03BD\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_en.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=Maintain Pages Cross Client\n\n#XBUT\nButton.Add=Add\n#XBUT\nButton.Cancel=Cancel\n#XBUT\nButton.ClosePreview=Close Preview\n#XBUT\nButton.Copy=Copy\n#XBUT\nButton.Create=Create\n#XBUT\nButton.Delete=Delete\n#XBUT\nButton.Edit=Edit\n#XBUT\nButton.Save=Save\n#XBUT\nButton.Select=Select\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=Show Catalogs\n#XBUT\nButton.HideCatalogs=Hide Catalogs\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Issues\\: {0}\n#XBUT\nButton.SortCatalogs=Toggle Catalog Sort Order\n#XBUT\nButton.CollapseCatalogs=Collapse All Catalogs\n#XBUT\nButton.ExpandCatalogs=Expand All Catalogs\n#XBUT\nButton.ShowDetails=Show Details\n#XBUT\nButton.PagePreview=Page Preview\n#XBUT\nButton.ErrorMsg=Error Messages\n#XBUT\nButton.EditHeader=Edit Header\n#XBUT\nButton.ContextSelector=Select Role Context {0}\n#XBUT\nButton.OverwriteChanges=Overwrite\n#XBUT\nButton.DismissChanges=Dismiss Changes\n\n#XTOL\nTooltip.AddToSections=Add to Sections\n#XTOL: Tooltip for the search button\nTooltip.Search=Search\n#XTOL\nTooltip.SearchForTiles=Search for Tiles\n#XTOL\nTooltip.SearchForRoles=Search for Roles\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Desktop\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=View Sort Settings\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=View Filter Settings\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=View Group Settings\n\n#XFLD\nLabel.PageID=Page ID\n#XFLD\nLabel.Title=Title\n#XFLD\nLabel.WorkbenchRequest=Workbench Request\n#XFLD\nLabel.Package=Package\n#XFLD\nLabel.TransportInformation=Transport Information\n#XFLD\nLabel.Details=Details\\:\n#XFLD\nLabel.ResponseCode=Response Code\\:\n#XFLD\nLabel.ModifiedBy=Modified by\\:\n#XFLD\nLabel.Description=Description\n#XFLD\nLabel.CreatedByFullname=Created By\n#XFLD\nLabel.CreatedOn=Created On\n#XFLD\nLabel.ChangedByFullname=Changed By\n#XFLD\nLabel.ChangedOn=Changed On\n#XFLD\nLabel.PageTitle=Page Title\n#XFLD\nLabel.AssignedRole=Assigned Role\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Title\n#XCOL\nColumn.PageDescription=Description\n#XCOL\nColumn.PageAssignmentStatus=Assigned to Space/Role\n#XCOL\nColumn.PagePackage=Package\n#XCOL\nColumn.PageWorkbenchRequest=Workbench Request\n#XCOL\nColumn.PageCreatedBy=Created By\n#XCOL\nColumn.PageCreatedOn=Created On\n#XCOL\nColumn.PageChangedBy=Changed By\n#XCOL\nColumn.PageChangedOn=Changed On\n\n#XTOL\nPlaceholder.SectionName=Enter a section name\n#XTOL\nPlaceholder.SearchForTiles=Search for tiles\n#XTOL\nPlaceholder.SearchForRoles=Search for roles\n#XTOL\nPlaceholder.CopyPageTitle=Copy of "{0}"\n#XTOL\nPlaceholder.CopyPageID=Copy of "{0}"\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=all\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=Section {0} has no title. For a consistent user experience, we recommend you enter a name for each section.\n#XMSG\nMessage.InvalidSectionTitle=Ideally, you should enter a section name.\n#XMSG\nMessage.NoInternetConnection=Please check your internet connection.\n#XMSG\nMessage.SavedChanges=Your changes have been saved.\n#XMSG\nMessage.InvalidPageID=Please only use the following characters\\: A-Z, 0-9, _ and /. The page ID should not start with a number.\n#XMSG\nMessage.EmptyPageID=Please provide a valid page ID.\n#XMSG\nMessage.EmptyTitle=Please provide a valid title.\n#XMSG\nMessage.NoRoleSelected=Please select at least one role.\n#XMSG\nMessage.SuccessDeletePage=The selected object has been deleted.\n#XMSG\nMessage.ClipboardCopySuccess=Details were copied successfully.\n#YMSE\nMessage.ClipboardCopyFail=An error occurred while copying details.\n#XMSG\nMessage.PageCreated=The page has been created.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=No tiles\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=No roles available.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=No roles found. Try adjusting your search.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=No sections\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=Failed to load the {0} tile in the "{1}" section.\\n\\nThis is most likely caused by incorrect configuration of SAP Fiori launchpad content. The visualization will not be displayed for the user.\n#XMSG\nMessage.NavigationTargetError=Navigation target could not be resolved.\n#XMSG\nMessage.LoadPageError=Could not load the page.\n#XMSG\nMessage.UpdatePageError=Could not update the page.\n#XMSG\nMessage.CreatePageError=Could not create the page.\n#XMSG\nMessage.TilesHaveErrors=Some of the tiles or sections have errors. Are you sure you want to continue saving?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=Failed to resolve the navigation target of tile\\: "{0}".\\n\\nThis is most likely caused by invalid configuration of SAP Fiori launchpad content. The visualization cannot open an application.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=Are you sure you want to delete the section "{0}"?\n#XMSG\nMessage.Section.DeleteNoTitle=Are you sure you want to delete this section?\n#XMSG\nMessage.OverwriteChanges=There have been changes while you were editing the page. Do you want to overwrite them?\n#XMSG\nMessage.OverwriteRemovedPage=The page you are working on has been deleted by a different user. Do you want to overwrite this change?\n#XMSG\nMessage.SaveChanges=Please save your changes.\n#XMSG\nMessage.NoPages=No pages available.\n#XMSG\nMessage.NoPagesFound=No pages found. Try adjusting your search.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Content restricted to role context.\n#XMSG\nMessage.NotAssigned=Not assigned.\n#XMSG\nMessage.StatusAssigned=Assigned\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=New Page\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=Select Role Context\n#XTIT\nTitle.TilesHaveErrors=Tiles Have Errors\n#XTIT\nDeleteDialog.Title=Delete\n#XMSG\nDeleteDialog.Text=Are you sure you want to delete the selected page?\n#XBUT\nDeleteDialog.ConfirmButton=Delete\n#XTIT\nDeleteDialog.LockedTitle=Page locked\n#XMSG\nDeleteDialog.LockedText=The selected page is locked by user "{0}".\n#XMSG\nDeleteDialog.TransportRequired=Please select a transport package to delete the selected page.\n\n#XMSG\nEditDialog.LockedText=The selected page is locked by user "{0}".\n#XMSG\nEditDialog.TransportRequired=Please select a transport package to edit the selected page.\n#XTIT\nEditDialog.Title=Edit Page\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=This page has been created in language "{0}" but your logon language is set to "{1}". Please change your logon language to "{0}" to proceed.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Subtitle\n#XFLD\nTileInfoPopover.Label.Icon=Icon\n#XFLD\nTileInfoPopover.Label.SemanticObject=Semantic Object\n#XFLD\nTileInfoPopover.Label.SemanticAction=Semantic Action\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori ID\n#XFLD\nTileInfoPopover.Label.AppDetail=App Detail\n#XFLD\nTileInfoPopover.Label.AppType=App Type\n#XFLD\nTileInfoPopover.Label.TileType=Tile Type\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Available Devices\n\n#XTIT\nErrorDialog.Title=Error\n\n#XTIT\nConfirmChangesDialog.Title=Warning\n\n#XTIT\nPageOverview.Title=Maintain Pages\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=Layout\n\n#XTIT\nCopyDialog.Title=Copy Page\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=Do you want to copy "{0}"?\n#XFLD\nCopyDialog.NewID=Copy of "{0}"\n\n#XMSG\nTitle.NoSectionTitle=Section title of section {0} is empty.\n#XMSG\nTitle.UnsufficientRoles=Insufficient role assignment to show visualization.\n#XMSG\nTitle.VisualizationIsNotVisible=Visualization will not be displayed.\n#XMSG\nTitle.VisualizationNotNavigateable=Visualization cannot open an app.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Static Tile\n#XTIT\nTitle.DynamicTile=Dynamic Tile\n#XTIT\nTitle.CustomTile=Custom Tile\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=Page Preview\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=Sorry, we could not find this page.\n#XLNK\nErrorPage.Link=Maintain Pages\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_en_US_sappsd.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Pages Application\nPageComposer.AppTitle=[[[\\u039C\\u0105\\u012F\\u014B\\u0163\\u0105\\u012F\\u014B \\u01A4\\u0105\\u011F\\u0113\\u015F \\u0108\\u0157\\u014F\\u015F\\u015F \\u0108\\u013A\\u012F\\u0113\\u014B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XBUT\nButton.Add=[[[\\u0100\\u018C\\u018C\\u2219]]]\n#XBUT\nButton.Cancel=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XBUT\nButton.ClosePreview=[[[\\u0108\\u013A\\u014F\\u015F\\u0113 \\u01A4\\u0157\\u0113\\u028B\\u012F\\u0113\\u0175\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XBUT\nButton.Copy=[[[\\u0108\\u014F\\u03C1\\u0177]]]\n#XBUT\nButton.Create=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XBUT\nButton.Delete=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XBUT\nButton.Edit=[[[\\u0114\\u018C\\u012F\\u0163]]]\n#XBUT\nButton.Save=[[[\\u015C\\u0105\\u028B\\u0113]]]\n#XBUT\nButton.Select=[[[\\u015C\\u0113\\u013A\\u0113\\u010B\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XBUT\nButton.Ok=[[[\\u014E\\u0136\\u2219\\u2219]]]\n#XBUT\nButton.ShowCatalogs=[[[\\u015C\\u0125\\u014F\\u0175 \\u0108\\u0105\\u0163\\u0105\\u013A\\u014F\\u011F\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XBUT\nButton.HideCatalogs=[[[\\u0124\\u012F\\u018C\\u0113 \\u0108\\u0105\\u0163\\u0105\\u013A\\u014F\\u011F\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XBUT: Number of issue (on the page being edited)\nButton.Issues=[[[\\u012C\\u015F\\u015F\\u0171\\u0113\\u015F\\: {0}]]]\n#XBUT\nButton.SortCatalogs=[[[\\u0162\\u014F\\u011F\\u011F\\u013A\\u0113 \\u0108\\u0105\\u0163\\u0105\\u013A\\u014F\\u011F \\u015C\\u014F\\u0157\\u0163 \\u014E\\u0157\\u018C\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XBUT\nButton.CollapseCatalogs=[[[\\u0108\\u014F\\u013A\\u013A\\u0105\\u03C1\\u015F\\u0113 \\u0100\\u013A\\u013A \\u0108\\u0105\\u0163\\u0105\\u013A\\u014F\\u011F\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XBUT\nButton.ExpandCatalogs=[[[\\u0114\\u03C7\\u03C1\\u0105\\u014B\\u018C \\u0100\\u013A\\u013A \\u0108\\u0105\\u0163\\u0105\\u013A\\u014F\\u011F\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XBUT\nButton.ShowDetails=[[[\\u015C\\u0125\\u014F\\u0175 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XBUT\nButton.PagePreview=[[[\\u01A4\\u0105\\u011F\\u0113 \\u01A4\\u0157\\u0113\\u028B\\u012F\\u0113\\u0175\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XBUT\nButton.ErrorMsg=[[[\\u0114\\u0157\\u0157\\u014F\\u0157 \\u039C\\u0113\\u015F\\u015F\\u0105\\u011F\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XBUT\nButton.EditHeader=[[[\\u0114\\u018C\\u012F\\u0163 \\u0124\\u0113\\u0105\\u018C\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XBUT\nButton.ContextSelector=[[[\\u015C\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0158\\u014F\\u013A\\u0113 \\u0108\\u014F\\u014B\\u0163\\u0113\\u03C7\\u0163 {0}]]]\n#XBUT\nButton.OverwriteChanges=[[[\\u014E\\u028B\\u0113\\u0157\\u0175\\u0157\\u012F\\u0163\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XBUT\nButton.DismissChanges=[[[\\u010E\\u012F\\u015F\\u0271\\u012F\\u015F\\u015F \\u0108\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTOL\nTooltip.AddToSections=[[[\\u0100\\u018C\\u018C \\u0163\\u014F \\u015C\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B\\u015F\\u2219\\u2219\\u2219\\u2219]]]\n#XTOL: Tooltip for the search button\nTooltip.Search=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XTOL\nTooltip.SearchForTiles=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125 \\u0192\\u014F\\u0157 \\u0162\\u012F\\u013A\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XTOL\nTooltip.SearchForRoles=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125 \\u0192\\u014F\\u0157 \\u0158\\u014F\\u013A\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=[[[\\u010E\\u0113\\u015F\\u0137\\u0163\\u014F\\u03C1\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=[[[\\u01B2\\u012F\\u0113\\u0175 \\u015C\\u014F\\u0157\\u0163 \\u015C\\u0113\\u0163\\u0163\\u012F\\u014B\\u011F\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=[[[\\u01B2\\u012F\\u0113\\u0175 \\u0191\\u012F\\u013A\\u0163\\u0113\\u0157 \\u015C\\u0113\\u0163\\u0163\\u012F\\u014B\\u011F\\u015F\\u2219\\u2219\\u2219\\u2219]]]\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=[[[\\u01B2\\u012F\\u0113\\u0175 \\u0122\\u0157\\u014F\\u0171\\u03C1 \\u015C\\u0113\\u0163\\u0163\\u012F\\u014B\\u011F\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD\nLabel.PageID=[[[\\u01A4\\u0105\\u011F\\u0113 \\u012C\\u010E\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.Title=[[[\\u0162\\u012F\\u0163\\u013A\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.WorkbenchRequest=[[[\\u0174\\u014F\\u0157\\u0137\\u0183\\u0113\\u014B\\u010B\\u0125 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.Package=[[[\\u01A4\\u0105\\u010B\\u0137\\u0105\\u011F\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.TransportInformation=[[[\\u0162\\u0157\\u0105\\u014B\\u015F\\u03C1\\u014F\\u0157\\u0163 \\u012C\\u014B\\u0192\\u014F\\u0157\\u0271\\u0105\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.Details=[[[\\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F\\:\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.ResponseCode=[[[\\u0158\\u0113\\u015F\\u03C1\\u014F\\u014B\\u015F\\u0113 \\u0108\\u014F\\u018C\\u0113\\:\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.ModifiedBy=[[[\\u039C\\u014F\\u018C\\u012F\\u0192\\u012F\\u0113\\u018C \\u0183\\u0177\\:\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.Description=[[[\\u010E\\u0113\\u015F\\u010B\\u0157\\u012F\\u03C1\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.CreatedByFullname=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113\\u018C \\u0181\\u0177\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.CreatedOn=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113\\u018C \\u014E\\u014B\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.ChangedByFullname=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113\\u018C \\u0181\\u0177\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.ChangedOn=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113\\u018C \\u014E\\u014B\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.PageTitle=[[[\\u01A4\\u0105\\u011F\\u0113 \\u0162\\u012F\\u0163\\u013A\\u0113\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.AssignedRole=[[[\\u0100\\u015F\\u015F\\u012F\\u011F\\u014B\\u0113\\u018C \\u0158\\u014F\\u013A\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XCOL\nColumn.PageID=[[[\\u012C\\u010E\\u2219\\u2219]]]\n#XCOL\nColumn.PageTitle=[[[\\u0162\\u012F\\u0163\\u013A\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XCOL\nColumn.PageDescription=[[[\\u010E\\u0113\\u015F\\u010B\\u0157\\u012F\\u03C1\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XCOL\nColumn.PageAssignmentStatus=[[[\\u0100\\u015F\\u015F\\u012F\\u011F\\u014B\\u0113\\u018C \\u0163\\u014F \\u015C\\u03C1\\u0105\\u010B\\u0113/\\u0158\\u014F\\u013A\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XCOL\nColumn.PagePackage=[[[\\u01A4\\u0105\\u010B\\u0137\\u0105\\u011F\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XCOL\nColumn.PageWorkbenchRequest=[[[\\u0174\\u014F\\u0157\\u0137\\u0183\\u0113\\u014B\\u010B\\u0125 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XCOL\nColumn.PageCreatedBy=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113\\u018C \\u0181\\u0177\\u2219\\u2219\\u2219\\u2219]]]\n#XCOL\nColumn.PageCreatedOn=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113\\u018C \\u014E\\u014B\\u2219\\u2219\\u2219\\u2219]]]\n#XCOL\nColumn.PageChangedBy=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113\\u018C \\u0181\\u0177\\u2219\\u2219\\u2219\\u2219]]]\n#XCOL\nColumn.PageChangedOn=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113\\u018C \\u014E\\u014B\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTOL\nPlaceholder.SectionName=[[[\\u0114\\u014B\\u0163\\u0113\\u0157 \\u015F\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B \\u014B\\u0105\\u0271\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XTOL\nPlaceholder.SearchForTiles=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125 \\u0192\\u014F\\u0157 \\u0163\\u012F\\u013A\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XTOL\nPlaceholder.SearchForRoles=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125 \\u0192\\u014F\\u0157 \\u0157\\u014F\\u013A\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XTOL\nPlaceholder.CopyPageTitle=[[[\\u0108\\u014F\\u03C1\\u0177 \\u014F\\u0192 "{0}"]]]\n#XTOL\nPlaceholder.CopyPageID=[[[\\u0108\\u014F\\u03C1\\u0177 \\u014F\\u0192 "{0}"]]]\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=[[[\\u0105\\u013A\\u013A\\u2219]]]\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=[[[\\u015C\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B {0} \\u0125\\u0105\\u015F \\u014B\\u014F \\u0163\\u012F\\u0163\\u013A\\u0113. \\u0191\\u014F\\u0157 \\u0105 \\u010B\\u014F\\u014B\\u015F\\u012F\\u015F\\u0163\\u0113\\u014B\\u0163 \\u0171\\u015F\\u0113\\u0157 \\u0113\\u03C7\\u03C1\\u0113\\u0157\\u012F\\u0113\\u014B\\u010B\\u0113, \\u0175\\u0113 \\u0157\\u0113\\u010B\\u014F\\u0271\\u0271\\u0113\\u014B\\u018C \\u0177\\u014F\\u0171 \\u0113\\u014B\\u0163\\u0113\\u0157 \\u0105 \\u014B\\u0105\\u0271\\u0113 \\u0192\\u014F\\u0157 \\u0113\\u0105\\u010B\\u0125 \\u015F\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B.]]]\n#XMSG\nMessage.InvalidSectionTitle=[[[\\u012C\\u018C\\u0113\\u0105\\u013A\\u013A\\u0177, \\u0177\\u014F\\u0171 \\u015F\\u0125\\u014F\\u0171\\u013A\\u018C \\u0113\\u014B\\u0163\\u0113\\u0157 \\u0105 \\u015F\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B \\u014B\\u0105\\u0271\\u0113.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.NoInternetConnection=[[[\\u01A4\\u013A\\u0113\\u0105\\u015F\\u0113 \\u010B\\u0125\\u0113\\u010B\\u0137 \\u0177\\u014F\\u0171\\u0157 \\u012F\\u014B\\u0163\\u0113\\u0157\\u014B\\u0113\\u0163 \\u010B\\u014F\\u014B\\u014B\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.SavedChanges=[[[\\u0176\\u014F\\u0171\\u0157 \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F \\u0125\\u0105\\u028B\\u0113 \\u0183\\u0113\\u0113\\u014B \\u015F\\u0105\\u028B\\u0113\\u018C.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.InvalidPageID=[[[\\u01A4\\u013A\\u0113\\u0105\\u015F\\u0113 \\u014F\\u014B\\u013A\\u0177 \\u0171\\u015F\\u0113 \\u0163\\u0125\\u0113 \\u0192\\u014F\\u013A\\u013A\\u014F\\u0175\\u012F\\u014B\\u011F \\u010B\\u0125\\u0105\\u0157\\u0105\\u010B\\u0163\\u0113\\u0157\\u015F\\: \\u0100-\\u017B, 0-9, _ \\u0105\\u014B\\u018C /. \\u0162\\u0125\\u0113 \\u03C1\\u0105\\u011F\\u0113 \\u012C\\u010E \\u015F\\u0125\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u015F\\u0163\\u0105\\u0157\\u0163 \\u0175\\u012F\\u0163\\u0125 \\u0105 \\u014B\\u0171\\u0271\\u0183\\u0113\\u0157.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.EmptyPageID=[[[\\u01A4\\u013A\\u0113\\u0105\\u015F\\u0113 \\u03C1\\u0157\\u014F\\u028B\\u012F\\u018C\\u0113 \\u0105 \\u028B\\u0105\\u013A\\u012F\\u018C \\u01A4\\u0105\\u011F\\u0113 \\u012C\\u010E.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.EmptyTitle=[[[\\u01A4\\u013A\\u0113\\u0105\\u015F\\u0113 \\u03C1\\u0157\\u014F\\u028B\\u012F\\u018C\\u0113 \\u0105 \\u028B\\u0105\\u013A\\u012F\\u018C \\u0163\\u012F\\u0163\\u013A\\u0113.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.NoRoleSelected=[[[\\u01A4\\u013A\\u0113\\u0105\\u015F\\u0113 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0105\\u0163 \\u013A\\u0113\\u0105\\u015F\\u0163 \\u014F\\u014B\\u0113 \\u0157\\u014F\\u013A\\u0113.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.SuccessDeletePage=[[[\\u0162\\u0125\\u0113 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C \\u03C1\\u0105\\u011F\\u0113 \\u0125\\u0105\\u015F \\u0183\\u0113\\u0113\\u014B \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113\\u018C.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.ClipboardCopySuccess=[[[\\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F \\u0175\\u0113\\u0157\\u0113 \\u010B\\u014F\\u03C1\\u012F\\u0113\\u018C \\u015F\\u0171\\u010B\\u010B\\u0113\\u015F\\u015F\\u0192\\u0171\\u013A\\u013A\\u0177.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#YMSE\nMessage.ClipboardCopyFail=[[[\\u0100\\u014B \\u0113\\u0157\\u0157\\u014F\\u0157 \\u014F\\u010B\\u010B\\u0171\\u0157\\u0157\\u0113\\u018C \\u0175\\u0125\\u012F\\u013A\\u0113 \\u010B\\u014F\\u03C1\\u0177\\u012F\\u014B\\u011F \\u018C\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.PageCreated=[[[\\u0162\\u0125\\u0113 \\u03C1\\u0105\\u011F\\u0113 \\u0125\\u0105\\u015F \\u0183\\u0113\\u0113\\u014B \\u010B\\u0157\\u0113\\u0105\\u0163\\u0113\\u018C.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=[[[\\u0143\\u014F \\u0162\\u012F\\u013A\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=[[[\\u0143\\u014F \\u0157\\u014F\\u013A\\u0113\\u015F \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113.\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=[[[\\u0143\\u014F \\u0157\\u014F\\u013A\\u0113\\u015F \\u0192\\u014F\\u0171\\u014B\\u018C. \\u0162\\u0157\\u0177 \\u0105\\u018C\\u0135\\u0171\\u015F\\u0163\\u012F\\u014B\\u011F \\u0177\\u014F\\u0171\\u0157 \\u015F\\u0113\\u0105\\u0157\\u010B\\u0125.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=[[[\\u0143\\u014F \\u015C\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=[[[\\u0191\\u0105\\u012F\\u013A\\u0113\\u018C \\u0163\\u014F \\u013A\\u014F\\u0105\\u018C \\u0163\\u0125\\u0113 {0} \\u0163\\u012F\\u013A\\u0113 \\u012F\\u014B \\u0163\\u0125\\u0113 "{1}" \\u015F\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B.\\n\\n \\u0162\\u0125\\u012F\\u015F \\u012F\\u015F \\u0271\\u014F\\u015F\\u0163 \\u013A\\u012F\\u0137\\u0113\\u013A\\u0177 \\u010B\\u0105\\u0171\\u015F\\u0113\\u018C \\u0183\\u0177 \\u012F\\u014B\\u010B\\u014F\\u0157\\u0157\\u0113\\u010B\\u0163 \\u010B\\u014F\\u014B\\u0192\\u012F\\u011F\\u0171\\u0157\\u0105\\u0163\\u012F\\u014F\\u014B \\u014F\\u0192 \\u015C\\u0100\\u01A4 \\u0191\\u012F\\u014F\\u0157\\u012F \\u013A\\u0105\\u0171\\u014B\\u010B\\u0125\\u03C1\\u0105\\u018C \\u010B\\u014F\\u014B\\u0163\\u0113\\u014B\\u0163. \\u0162\\u0125\\u0113 \\u028B\\u012F\\u015F\\u0171\\u0105\\u013A\\u012F\\u017E\\u0105\\u0163\\u012F\\u014F\\u014B \\u0175\\u012F\\u013A\\u013A \\u014B\\u014F\\u0163 \\u0183\\u0113 \\u018C\\u012F\\u015F\\u03C1\\u013A\\u0105\\u0177\\u0113\\u018C \\u0192\\u014F\\u0157 \\u0163\\u0125\\u0113 \\u0171\\u015F\\u0113\\u0157.]]]\n#XMSG\nMessage.NavigationTargetError=[[[\\u0143\\u0105\\u028B\\u012F\\u011F\\u0105\\u0163\\u012F\\u014F\\u014B \\u0163\\u0105\\u0157\\u011F\\u0113\\u0163 \\u010B\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u0183\\u0113 \\u0157\\u0113\\u015F\\u014F\\u013A\\u028B\\u0113\\u018C.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.LoadPageError=[[[\\u0108\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u013A\\u014F\\u0105\\u018C \\u0163\\u0125\\u0113 \\u03C1\\u0105\\u011F\\u0113.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.UpdatePageError=[[[\\u0108\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u0171\\u03C1\\u018C\\u0105\\u0163\\u0113 \\u0163\\u0125\\u0113 \\u03C1\\u0105\\u011F\\u0113.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.CreatePageError=[[[\\u0108\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u010B\\u0157\\u0113\\u0105\\u0163\\u0113 \\u0163\\u0125\\u0113 \\u03C1\\u0105\\u011F\\u0113.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.TilesHaveErrors=[[[\\u015C\\u014F\\u0271\\u0113 \\u014F\\u0192 \\u0163\\u0125\\u0113 \\u0163\\u012F\\u013A\\u0113\\u015F \\u014F\\u0157 \\u015F\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B\\u015F \\u0125\\u0105\\u028B\\u0113 \\u0113\\u0157\\u0157\\u014F\\u0157\\u015F. \\u0100\\u0157\\u0113 \\u0177\\u014F\\u0171 \\u015F\\u0171\\u0157\\u0113 \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u010B\\u014F\\u014B\\u0163\\u012F\\u014B\\u0171\\u0113 \\u015F\\u0105\\u028B\\u012F\\u014B\\u011F?\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=[[[\\u0191\\u0105\\u012F\\u013A\\u0113\\u018C \\u0163\\u014F \\u0157\\u0113\\u015F\\u014F\\u013A\\u028B\\u0113 \\u0163\\u0125\\u0113 \\u014B\\u0105\\u028B\\u012F\\u011F\\u0105\\u0163\\u012F\\u014F\\u014B \\u0163\\u0105\\u0157\\u011F\\u0113\\u0163 \\u014F\\u0192 \\u0163\\u012F\\u013A\\u0113\\: "{0}".\\n\\n \\u0162\\u0125\\u012F\\u015F \\u012F\\u015F \\u0271\\u014F\\u015F\\u0163 \\u013A\\u012F\\u0137\\u0113\\u013A\\u0177 \\u010B\\u0105\\u0171\\u015F\\u0113\\u018C \\u0183\\u0177 \\u012F\\u014B\\u028B\\u0105\\u013A\\u012F\\u018C \\u010B\\u014F\\u014B\\u0192\\u012F\\u011F\\u0171\\u0157\\u0105\\u0163\\u012F\\u014F\\u014B \\u014F\\u0192 \\u015C\\u0100\\u01A4 \\u0191\\u012F\\u014F\\u0157\\u012F \\u013A\\u0105\\u0171\\u014B\\u010B\\u0125\\u03C1\\u0105\\u018C \\u010B\\u014F\\u014B\\u0163\\u0113\\u014B\\u0163. \\u0162\\u0125\\u0113 \\u028B\\u012F\\u015F\\u0171\\u0105\\u013A\\u012F\\u017E\\u0105\\u0163\\u012F\\u014F\\u014B \\u010B\\u0105\\u014B\\u014B\\u014F\\u0163 \\u014F\\u03C1\\u0113\\u014B \\u0105\\u014B \\u0105\\u03C1\\u03C1\\u013A\\u012F\\u010B\\u0105\\u0163\\u012F\\u014F\\u014B.]]]\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=[[[\\u0100\\u0157\\u0113 \\u0177\\u014F\\u0171 \\u015F\\u0171\\u0157\\u0113 \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113 \\u0163\\u0125\\u0113 \\u015F\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B "{0}"?]]]\n#XMSG\nMessage.Section.DeleteNoTitle=[[[\\u0100\\u0157\\u0113 \\u0177\\u014F\\u0171 \\u015F\\u0171\\u0157\\u0113 \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113 \\u0163\\u0125\\u012F\\u015F \\u015F\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B?\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.OverwriteChanges=[[[\\u0162\\u0125\\u0113\\u0157\\u0113 \\u0125\\u0105\\u028B\\u0113 \\u0183\\u0113\\u0113\\u014B \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F \\u0175\\u0125\\u012F\\u013A\\u0113 \\u0177\\u014F\\u0171 \\u0175\\u0113\\u0157\\u0113 \\u0113\\u018C\\u012F\\u0163\\u012F\\u014B\\u011F \\u0163\\u0125\\u0113 \\u03C1\\u0105\\u011F\\u0113. \\u010E\\u014F \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u014F\\u028B\\u0113\\u0157\\u0175\\u0157\\u012F\\u0163\\u0113 \\u0163\\u0125\\u0113\\u0271?\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.OverwriteRemovedPage=[[[\\u0162\\u0125\\u0113 \\u03C1\\u0105\\u011F\\u0113 \\u0177\\u014F\\u0171 \\u0105\\u0157\\u0113 \\u0175\\u014F\\u0157\\u0137\\u012F\\u014B\\u011F \\u014F\\u014B \\u0125\\u0105\\u015F \\u0183\\u0113\\u0113\\u014B \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113\\u018C \\u0183\\u0177 \\u0105 \\u018C\\u012F\\u0192\\u0192\\u0113\\u0157\\u0113\\u014B\\u0163 \\u0171\\u015F\\u0113\\u0157. \\u010E\\u014F \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u014F\\u028B\\u0113\\u0157\\u0175\\u0157\\u012F\\u0163\\u0113 \\u0163\\u0125\\u012F\\u015F \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113?\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.SaveChanges=[[[\\u01A4\\u013A\\u0113\\u0105\\u015F\\u0113 \\u015F\\u0105\\u028B\\u0113 \\u0177\\u014F\\u0171\\u0157 \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.NoPages=[[[\\u0143\\u014F \\u03C1\\u0105\\u011F\\u0113\\u015F \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113.\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.NoPagesFound=[[[\\u0143\\u014F \\u03C1\\u0105\\u011F\\u0113\\u015F \\u0192\\u014F\\u0171\\u014B\\u018C. \\u0162\\u0157\\u0177 \\u0105\\u018C\\u0135\\u0171\\u015F\\u0163\\u012F\\u014B\\u011F \\u0177\\u014F\\u0171\\u0157 \\u015F\\u0113\\u0105\\u0157\\u010B\\u0125.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG Info message about the changed role context for a page or a space\nMessage.RoleContext=[[[\\u0108\\u014F\\u014B\\u0163\\u0113\\u014B\\u0163 \\u0157\\u0113\\u015F\\u0163\\u0157\\u012F\\u010B\\u0163\\u0113\\u018C \\u0163\\u014F \\u0157\\u014F\\u013A\\u0113 \\u010B\\u014F\\u014B\\u0163\\u0113\\u03C7\\u0163.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.NotAssigned=[[[\\u0143\\u014F\\u0163 \\u0100\\u015F\\u015F\\u012F\\u011F\\u014B\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.StatusAssigned=[[[\\u0100\\u015F\\u015F\\u012F\\u011F\\u014B\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=[[[\\u0143\\u0113\\u0175 \\u01A4\\u0105\\u011F\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=[[[\\u015C\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0158\\u014F\\u013A\\u0113 \\u0108\\u014F\\u014B\\u0163\\u0113\\u03C7\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XTIT\nTitle.TilesHaveErrors=[[[\\u0162\\u012F\\u013A\\u0113\\u015F \\u0124\\u0105\\u028B\\u0113 \\u0114\\u0157\\u0157\\u014F\\u0157\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XTIT\nDeleteDialog.Title=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nDeleteDialog.Text=[[[\\u0100\\u0157\\u0113 \\u0177\\u014F\\u0171 \\u015F\\u0171\\u0157\\u0113 \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113 \\u0163\\u0125\\u0113 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C \\u03C1\\u0105\\u011F\\u0113?\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XBUT\nDeleteDialog.ConfirmButton=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XTIT\nDeleteDialog.LockedTitle=[[[\\u01A4\\u0105\\u011F\\u0113 \\u013B\\u014F\\u010B\\u0137\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nDeleteDialog.LockedText=[[[\\u0162\\u0125\\u0113 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C \\u03C1\\u0105\\u011F\\u0113 \\u012F\\u015F \\u013A\\u014F\\u010B\\u0137\\u0113\\u018C \\u0183\\u0177 \\u0171\\u015F\\u0113\\u0157 "{0}".]]]\n#XMSG\nDeleteDialog.TransportRequired=[[[\\u01A4\\u013A\\u0113\\u0105\\u015F\\u0113 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0105 \\u0163\\u0157\\u0105\\u014B\\u015F\\u03C1\\u014F\\u0157\\u0163 \\u03C1\\u0105\\u010B\\u0137\\u0105\\u011F\\u0113 \\u0163\\u014F \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113 \\u0163\\u0125\\u0113 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C \\u03C1\\u0105\\u011F\\u0113.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XMSG\nEditDialog.LockedText=[[[\\u0162\\u0125\\u0113 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C \\u03C1\\u0105\\u011F\\u0113 \\u012F\\u015F \\u013A\\u014F\\u010B\\u0137\\u0113\\u018C \\u0183\\u0177 \\u0171\\u015F\\u0113\\u0157 "{0}".]]]\n#XMSG\nEditDialog.TransportRequired=[[[\\u01A4\\u013A\\u0113\\u0105\\u015F\\u0113 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0105 \\u0163\\u0157\\u0105\\u014B\\u015F\\u03C1\\u014F\\u0157\\u0163 \\u03C1\\u0105\\u010B\\u0137\\u0105\\u011F\\u0113 \\u0163\\u014F \\u0113\\u018C\\u012F\\u0163 \\u0163\\u0125\\u0113 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C \\u03C1\\u0105\\u011F\\u0113.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XTIT\nEditDialog.Title=[[[\\u0114\\u018C\\u012F\\u0163 \\u01A4\\u0105\\u011F\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=[[[\\u0162\\u0125\\u012F\\u015F \\u03C1\\u0105\\u011F\\u0113 \\u0125\\u0105\\u015F \\u0183\\u0113\\u0113\\u014B \\u010B\\u0157\\u0113\\u0105\\u0163\\u0113\\u018C \\u012F\\u014B \\u013A\\u0105\\u014B\\u011F\\u0171\\u0105\\u011F\\u0113 "{0}" \\u0183\\u0171\\u0163 \\u0177\\u014F\\u0171\\u0157 \\u013A\\u014F\\u011F\\u014F\\u014B \\u013A\\u0105\\u014B\\u011F\\u0171\\u0105\\u011F\\u0113 \\u012F\\u015F \\u015F\\u0113\\u0163 \\u0163\\u014F "{1}". \\u01A4\\u013A\\u0113\\u0105\\u015F\\u0113 \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113 \\u0177\\u014F\\u0171\\u0157 \\u013A\\u014F\\u011F\\u014F\\u014B \\u013A\\u0105\\u014B\\u011F\\u0171\\u0105\\u011F\\u0113 \\u0163\\u014F "{0}" \\u0163\\u014F \\u03C1\\u0157\\u014F\\u010B\\u0113\\u0113\\u018C.]]]\n\n#XFLD\nTileInfoPopover.Label.Subtitle=[[[\\u015C\\u0171\\u0183\\u0163\\u012F\\u0163\\u013A\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nTileInfoPopover.Label.Icon=[[[\\u012C\\u010B\\u014F\\u014B]]]\n#XFLD\nTileInfoPopover.Label.SemanticObject=[[[\\u015C\\u0113\\u0271\\u0105\\u014B\\u0163\\u012F\\u010B \\u014E\\u0183\\u0135\\u0113\\u010B\\u0163\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nTileInfoPopover.Label.SemanticAction=[[[\\u015C\\u0113\\u0271\\u0105\\u014B\\u0163\\u012F\\u010B \\u0100\\u010B\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nTileInfoPopover.Label.FioriID=[[[\\u0191\\u012F\\u014F\\u0157\\u012F \\u012C\\u010E\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nTileInfoPopover.Label.AppDetail=[[[\\u0100\\u03C1\\u03C1 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nTileInfoPopover.Label.AppType=[[[\\u0100\\u03C1\\u03C1 \\u0162\\u0177\\u03C1\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nTileInfoPopover.Label.TileType=[[[\\u0162\\u012F\\u013A\\u0113 \\u0162\\u0177\\u03C1\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nTileInfoPopover.Label.AvailableDevices=[[[\\u0100\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113 \\u010E\\u0113\\u028B\\u012F\\u010B\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT\nErrorDialog.Title=[[[\\u0114\\u0157\\u0157\\u014F\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT\nConfirmChangesDialog.Title=[[[\\u0174\\u0105\\u0157\\u014B\\u012F\\u014B\\u011F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT\nPageOverview.Title=[[[\\u039C\\u0105\\u012F\\u014B\\u0163\\u0105\\u012F\\u014B \\u01A4\\u0105\\u011F\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: "Layout" title of a page composer section\nTitle.Layout=[[[\\u013B\\u0105\\u0177\\u014F\\u0171\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT\nCopyDialog.Title=[[[\\u0108\\u014F\\u03C1\\u0177 \\u01A4\\u0105\\u011F\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG: Paremeter "{0}" is the title of the page being copied\nCopyDialog.Message=[[[\\u010E\\u014F \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u010B\\u014F\\u03C1\\u0177 "{0}"?]]]\n#XFLD\nCopyDialog.NewID=[[[\\u0108\\u014F\\u03C1\\u0177 \\u014F\\u0192 "{0}"]]]\n\n#XMSG\nTitle.NoSectionTitle=[[[\\u015C\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B \\u0163\\u012F\\u0163\\u013A\\u0113 \\u014F\\u0192 \\u015F\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B {0} \\u012F\\u015F \\u0113\\u0271\\u03C1\\u0163\\u0177.]]]\n#XMSG\nTitle.UnsufficientRoles=[[[\\u012C\\u014B\\u015F\\u0171\\u0192\\u0192\\u012F\\u010B\\u012F\\u0113\\u014B\\u0163 \\u0157\\u014F\\u013A\\u0113 \\u0105\\u015F\\u015F\\u012F\\u011F\\u014B\\u0271\\u0113\\u014B\\u0163 \\u0163\\u014F \\u015F\\u0125\\u014F\\u0175 \\u028B\\u012F\\u015F\\u0171\\u0105\\u013A\\u012F\\u017E\\u0105\\u0163\\u012F\\u014F\\u014B.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nTitle.VisualizationIsNotVisible=[[[\\u01B2\\u012F\\u015F\\u0171\\u0105\\u013A\\u012F\\u017E\\u0105\\u0163\\u012F\\u014F\\u014B \\u0175\\u012F\\u013A\\u013A \\u014B\\u014F\\u0163 \\u0183\\u0113 \\u018C\\u012F\\u015F\\u03C1\\u013A\\u0105\\u0177\\u0113\\u018C.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nTitle.VisualizationNotNavigateable=[[[\\u01B2\\u012F\\u015F\\u0171\\u0105\\u013A\\u012F\\u017E\\u0105\\u0163\\u012F\\u014F\\u014B \\u010B\\u0105\\u014B\\u014B\\u014F\\u0163 \\u014F\\u03C1\\u0113\\u014B \\u0105\\u014B \\u0105\\u03C1\\u03C1.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT\nTitle.StaticTile=[[[\\u015C\\u0163\\u0105\\u0163\\u012F\\u010B \\u0162\\u012F\\u013A\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XTIT\nTitle.DynamicTile=[[[\\u010E\\u0177\\u014B\\u0105\\u0271\\u012F\\u010B \\u0162\\u012F\\u013A\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XTIT\nTitle.CustomTile=[[[\\u0108\\u0171\\u015F\\u0163\\u014F\\u0271 \\u0162\\u012F\\u013A\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=[[[\\u01A4\\u0105\\u011F\\u0113 \\u01A4\\u0157\\u0113\\u028B\\u012F\\u0113\\u0175\\: {0}]]]\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=[[[\\u015C\\u014F\\u0157\\u0157\\u0177, \\u0175\\u0113 \\u010B\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u0192\\u012F\\u014B\\u018C \\u0163\\u0125\\u012F\\u015F \\u03C1\\u0105\\u011F\\u0113.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XLNK\nErrorPage.Link=[[[\\u039C\\u0105\\u012F\\u014B\\u0163\\u0105\\u012F\\u014B \\u01A4\\u0105\\u011F\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_en_US_saptrc.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Pages Application\nPageComposer.AppTitle=Dh5EhAPyldutezdlRY+fuA_Maintain Pages Cross Client\n\n#XBUT\nButton.Add=27PktXFK5O6AgsB0eeo+6A_Add\n#XBUT\nButton.Cancel=p8iHIGkiGDAj0yCJGbvb8g_Cancel\n#XBUT\nButton.ClosePreview=Z017tUl57Mm16JYtOWALFg_Close Preview\n#XBUT\nButton.Copy=VqDodlUjRH6eu3yuHtpm4Q_Copy\n#XBUT\nButton.Create=ZMVRPn+blJHFJXToMCFXsg_Create\n#XBUT\nButton.Delete=jgzRkeIy+chOE9TfwP4jrQ_Delete\n#XBUT\nButton.Edit=blh/RfaP6u47dhIKXrovKw_Edit\n#XBUT\nButton.Save=p9DPC0pDrjXqFo6cZCl64A_Save\n#XBUT\nButton.Select=YVvUw+1iKoDY2wqnqwiAUw_Select\n#XBUT\nButton.Ok=wSp15g+3XJ3EuLW+v1jlww_OK\n#XBUT\nButton.ShowCatalogs=vVtNwvTyO8+QQKs4hhbTMg_Show Catalogs\n#XBUT\nButton.HideCatalogs=J5SeCfubA7Wn1d2Qqx1p1w_Hide Catalogs\n#XBUT: Number of issue (on the page being edited)\nButton.Issues=DqpEYh+3kX/Y8bLNeBpsPA_Issues\\: {0}\n#XBUT\nButton.SortCatalogs=nGu5y9oLhVyLbf/tlmsGIA_Toggle Catalog Sort Order\n#XBUT\nButton.CollapseCatalogs=xuf9ppM0jxFEQRF1/3K89w_Collapse All Catalogs\n#XBUT\nButton.ExpandCatalogs=GvV5+lvxkPDUOuFf09AMcA_Expand All Catalogs\n#XBUT\nButton.ShowDetails=tEteFS66u61t34vbo1STwg_Show Details\n#XBUT\nButton.PagePreview=i7I+c6Xvy/PGB9drGVzsgg_Page Preview\n#XBUT\nButton.ErrorMsg=qP+SX2wBHuxqlngSzPc5pg_Error Messages\n#XBUT\nButton.EditHeader=Bk8ApyKiNvQWZOVCEFcYGA_Edit Header\n#XBUT\nButton.ContextSelector=Zs4fEdsJHl0v1rW0uSDPtA_Select Role Context {0}\n#XBUT\nButton.OverwriteChanges=A23a+8n+Y67O3D8Kf3trYg_Overwrite\n#XBUT\nButton.DismissChanges=cdQgLEm1PdCBNb3v5yGgNA_Dismiss Changes\n\n#XTOL\nTooltip.AddToSections=VNBeUti6aCRRje90rTg+zQ_Add to Sections\n#XTOL: Tooltip for the search button\nTooltip.Search=u8gEv4gH+5wIDNxWYrSf/A_Search\n#XTOL\nTooltip.SearchForTiles=mEhtVVPO4kGECvD3VEekLw_Search for Tiles\n#XTOL\nTooltip.SearchForRoles=TmP9wJLqWJnl5R0I9amM7w_Search for Roles\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=/fq38s8abaoWtAgWv4e3Ug_Desktop\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=uNc7uEdPfkZwO5vcEBwWag_View Sort Settings\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=f85FGga70Ok7fcHFBzydhQ_View Filter Settings\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=Z4Zduu/hGHbfoqbw+GztGQ_View Group Settings\n\n#XFLD\nLabel.PageID=7R9daeoK6/7QDweZxlJK/g_Page ID\n#XFLD\nLabel.Title=Rlco89duxgK6oejd8WOmZA_Title\n#XFLD\nLabel.WorkbenchRequest=aSjLWOR1HpwoODs79KDT+Q_Workbench Request\n#XFLD\nLabel.Package=x1Bjr1AtAYCqUYQRot2v4A_Package\n#XFLD\nLabel.TransportInformation=fY//tRqKx9mP+rUGj1mjag_Transport Information\n#XFLD\nLabel.Details=DzZ5QbqBbU59EF+p1tqKQA_Details\\:\n#XFLD\nLabel.ResponseCode=QC3lRLAuVQXFNDGa2JdqBQ_Response Code\\:\n#XFLD\nLabel.ModifiedBy=jwTtBC+59vaq01NOaCdvfg_Modified by\\:\n#XFLD\nLabel.Description=1rx0D11/Zy9HlSNIjRDJuQ_Description\n#XFLD\nLabel.CreatedByFullname=wSeJ6QorA6K49dZXGhNFbA_Created By\n#XFLD\nLabel.CreatedOn=MsUQEfmbS9LvQTONa0BoxQ_Created On\n#XFLD\nLabel.ChangedByFullname=VS16EcCDgha8YbuTkH7dKw_Changed By\n#XFLD\nLabel.ChangedOn=CN3G7hEDE9PgPj2pmTD6QQ_Changed On\n#XFLD\nLabel.PageTitle=ck6MakwKkt/o0JdUwRk44g_Page Title\n#XFLD\nLabel.AssignedRole=FDABmKkra+2EjGiaoaupBA_Assigned Role\n\n#XCOL\nColumn.PageID=VQXVGaGihdzGTXPPpPlUEw_ID\n#XCOL\nColumn.PageTitle=XaIRUVFxP4J6oDWx8L86sw_Title\n#XCOL\nColumn.PageDescription=A5KLcjo2YRgsH4NwcGKDPw_Description\n#XCOL\nColumn.PageAssignmentStatus=GCWrt/XpmM+lprN80EkLbg_Assigned to Space/Role\n#XCOL\nColumn.PagePackage=Eo2n/c5g8n6W8NqSdSteYQ_Package\n#XCOL\nColumn.PageWorkbenchRequest=oftrw3jdWb4ZLCYcrJi7eQ_Workbench Request\n#XCOL\nColumn.PageCreatedBy=OUtN2wBIIK33z2JLsAB+5Q_Created By\n#XCOL\nColumn.PageCreatedOn=/6RRPT+9wXeaaqfrhIQfQA_Created On\n#XCOL\nColumn.PageChangedBy=zt021XJCGW3yd0204prXVQ_Changed By\n#XCOL\nColumn.PageChangedOn=v+dFuwuG3ssce0NjSKAwtA_Changed On\n\n#XTOL\nPlaceholder.SectionName=Wu+hVP2IqbTTCDfGKyJBDw_Enter section name\n#XTOL\nPlaceholder.SearchForTiles=/DTrv6QkyMDlNQ6uhOGq1A_Search for tiles\n#XTOL\nPlaceholder.SearchForRoles=at/L4Q3hdD4Nsw8h7H5FSw_Search for roles\n#XTOL\nPlaceholder.CopyPageTitle=oaFHkrwZaRGsGBVASCwfzQ_Copy of "{0}"\n#XTOL\nPlaceholder.CopyPageID=pg1+4u6I67n4uHvkpSqcPQ_Copy of "{0}"\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=3BZJbcHwJr6RtncLFOU/yQ_all\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=WO3HsHNghRKaov+1Hv6g6Q_Section {0} has no title. For a consistent user experience, we recommend you enter a name for each section.\n#XMSG\nMessage.InvalidSectionTitle=uu2o4JR3Hy7kKYk7t6XVYA_Ideally, you should enter a section name.\n#XMSG\nMessage.NoInternetConnection=5fardAwZa78e2+MOJMgvjQ_Please check your internet connection.\n#XMSG\nMessage.SavedChanges=/9pevwY0pIMIBE+rookzog_Your changes have been saved.\n#XMSG\nMessage.InvalidPageID=xLoDy3EAipvv62EfxzD8PQ_Please only use the following characters\\: A-Z, 0-9, _ and /. The page ID should not start with a number.\n#XMSG\nMessage.EmptyPageID=izh4wngQdlb6mM7IUPkrJA_Please provide a valid Page ID.\n#XMSG\nMessage.EmptyTitle=YcnamaLkVJ56c3s46AJzBw_Please provide a valid title.\n#XMSG\nMessage.NoRoleSelected=fNtSc4KtMnzISRzA4NX2NQ_Please select at least one role.\n#XMSG\nMessage.SuccessDeletePage=XkkHkm6bWh98cCPxSSq7GQ_The selected page has been deleted.\n#XMSG\nMessage.ClipboardCopySuccess=a8q4Fu4mW91Lb4hUZdRmRA_Details were copied successfully.\n#YMSE\nMessage.ClipboardCopyFail=Rntp1fYwMNNq/ZupqtpWlQ_An error occurred while copying details.\n#XMSG\nMessage.PageCreated=06/xmVhgEek0HJ018sZuCw_The page has been created.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=8/wuZhTfTy+9OJ1LrWpbag_No Tiles\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=Y4il/X1eorsDnAF8J21LAA_No roles available.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=RjGy+3QVTh4R/Dx6IBH7nA_No roles found. Try adjusting your search.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=8KgQrcA8zJ3ddPbS1/z1Cg_No Sections\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=Z+0IV6yHYL8Ap79q8S5qxg_Failed to load the {0} tile in the "{1}" section.\\n\\n This is most likely caused by incorrect configuration of SAP Fiori launchpad content. The visualization will not be displayed for the user.\n#XMSG\nMessage.NavigationTargetError=M8Zi3nhdz/xF/b65LXc7kA_Navigation target could not be resolved.\n#XMSG\nMessage.LoadPageError=1U80OY61xq3g4IA4M3eWwA_Could not load the page.\n#XMSG\nMessage.UpdatePageError=0A/l3iFOGY/S91PiKX11sg_Could not update the page.\n#XMSG\nMessage.CreatePageError=S1bBXfnoN4Q9FkiC7dQy4A_Could not create the page.\n#XMSG\nMessage.TilesHaveErrors=aQHIu8uIvOOBcLCBVEQdgw_Some of the tiles or sections have errors. Are you sure you want to continue saving?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=0HyMkMk927T+0W5rl7H5rw_Failed to resolve the navigation target of tile\\: "{0}".\\n\\n This is most likely caused by invalid configuration of SAP Fiori launchpad content. The visualization cannot open an application.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=NdMNI5XKTQNfk9Ufsz3Ohw_Are you sure you want to delete the section "{0}"?\n#XMSG\nMessage.Section.DeleteNoTitle=06lY695UCO9rC+tQjObPvQ_Are you sure you want to delete this section?\n#XMSG\nMessage.OverwriteChanges=67L8DK3pZZhyhw99SLW+mQ_There have been changes while you were editing the page. Do you want to overwrite them?\n#XMSG\nMessage.OverwriteRemovedPage=Zf168nFAwfUJO4oCwEEGzA_The page you are working on has been deleted by a different user. Do you want to overwrite this change?\n#XMSG\nMessage.SaveChanges=1lp0hh4RWecdE/YJYW8a+A_Please save your changes.\n#XMSG\nMessage.NoPages=/4FnKt9UffZbzgg5q5DmhQ_No pages available.\n#XMSG\nMessage.NoPagesFound=snjJz6kut6yjsJe26SjweQ_No pages found. Try adjusting your search.\n#XMSG Info message about the changed role context for a page or a space\nMessage.RoleContext=LbMkzadLhj7JdCnAR+5xQw_Content restricted to role context.\n#XMSG\nMessage.NotAssigned=EymHkPvnRVrrcOg2iMo8Vg_Not Assigned\n#XMSG\nMessage.StatusAssigned=Md62do+kqItA4cs6E6fmHQ_Assigned\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=j3pkP8Dtmi2oDP3XOvs1TQ_New Page\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=PCJ1+G5onHJi+Vm7hjRMVQ_Select Role Context\n#XTIT\nTitle.TilesHaveErrors=K1h6U8/C0ZdpYJG3iBOsxQ_Tiles Have Errors\n#XTIT\nDeleteDialog.Title=/AMxJPoPXksHEjVtrLwpkQ_Delete\n#XMSG\nDeleteDialog.Text=XK6T8qAps+aPdUPIoe8+mA_Are you sure you want to delete the selected page?\n#XBUT\nDeleteDialog.ConfirmButton=wIc6QhbqM4aphCs53R7BCw_Delete\n#XTIT\nDeleteDialog.LockedTitle=zEpak8l4k1SPgr9hlTtufQ_Page Locked\n#XMSG\nDeleteDialog.LockedText=ZAWDL0XtTdwnbzFrx6MaFw_The selected page is locked by user "{0}".\n#XMSG\nDeleteDialog.TransportRequired=f+BiFK2/2m+CHXSvjva6zw_Please select a transport package to delete the selected page.\n\n#XMSG\nEditDialog.LockedText=CfGDTxjXghEc3NRWQYm0fQ_The selected page is locked by user "{0}".\n#XMSG\nEditDialog.TransportRequired=vIk1jmtFU4xyf0hYfTeBZQ_Please select a transport package to edit the selected page.\n#XTIT\nEditDialog.Title=ue0XrDrX3befEzLVTYJ9Tw_Edit Page\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=flE3UpCAcHS65BnoIHX7tg_This page has been created in language "{0}" but your logon language is set to "{1}". Please change your logon language to "{0}" to proceed.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=gnzF7TCPTPl2opnXaqOfRQ_Subtitle\n#XFLD\nTileInfoPopover.Label.Icon=UfAXlpRSTbnuZHtc2HHmlQ_Icon\n#XFLD\nTileInfoPopover.Label.SemanticObject=hIRm8r1agwsvWV1I8Q0jvg_Semantic Object\n#XFLD\nTileInfoPopover.Label.SemanticAction=n/5uFPsetzpGzCJ7oNjhSQ_Semantic Action\n#XFLD\nTileInfoPopover.Label.FioriID=rxtxyk4joKudeWG4Qppjlg_Fiori ID\n#XFLD\nTileInfoPopover.Label.AppDetail=e99Wnp9XiFS3rosoEDOLyQ_App Detail\n#XFLD\nTileInfoPopover.Label.AppType=kAIVPVGeDH2N1qfNdjrOCg_App Type\n#XFLD\nTileInfoPopover.Label.TileType=ztkqL5m/A7nf+IZ2oclpiQ_Tile Type\n#XFLD\nTileInfoPopover.Label.AvailableDevices=t6MKqTo7raujmQ5PqmSJuQ_Available Devices\n\n#XTIT\nErrorDialog.Title=8IX4weQSEqwDegglSsL+zA_Error\n\n#XTIT\nConfirmChangesDialog.Title=7Liuh4WkpAFUpwKB1XD9/A_Warning\n\n#XTIT\nPageOverview.Title=TsoRYLhJ43TgbTFjFOYcUQ_Maintain Pages\n\n#XTIT: "Layout" title of a page composer section\nTitle.Layout=GmaVVwvZ1SWS0do0fNjAbw_Layout\n\n#XTIT\nCopyDialog.Title=ggyrEH6jlpvaIbcthrlCzw_Copy Page\n#XMSG: Paremeter "{0}" is the title of the page being copied\nCopyDialog.Message=xDE44LAyuDp7gongy5IAXw_Do you want to copy "{0}"?\n#XFLD\nCopyDialog.NewID=H5f11h2JyHI24XD5P4rMSw_Copy of "{0}"\n\n#XMSG\nTitle.NoSectionTitle=k0jCHR9oX/O+4cjPiuiGdw_Section title of section {0} is empty.\n#XMSG\nTitle.UnsufficientRoles=kFO+1sBLpNFXOxyN6qJHKA_Insufficient role assignment to show visualization.\n#XMSG\nTitle.VisualizationIsNotVisible=MyAPAzwADBtj9YKV1lfkxA_Visualization will not be displayed.\n#XMSG\nTitle.VisualizationNotNavigateable=CQynzJ8BhVMfX/JkzmeZZg_Visualization cannot open an app.\n\n#XTIT\nTitle.StaticTile=ICRZVxsznWqDjDHZhHNL0Q_Static Tile\n#XTIT\nTitle.DynamicTile=k8UjI353CjO7w9FGR1Em5Q_Dynamic Tile\n#XTIT\nTitle.CustomTile=GJ9XICAsjbslpndYC4mYAA_Custom Tile\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=jDIwTTWSuXcDV2EWtbendg_Page Preview\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=XeeghX9fd6haSSptvuQ+Nw_Sorry, we could not find this page.\n#XLNK\nErrorPage.Link=PgAIxuhHaaXRBnp3uq4n+A_Maintain Pages\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_es.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=Actualizar p\\u00E1ginas en todos los clientes\n\n#XBUT\nButton.Add=A\\u00F1adir\n#XBUT\nButton.Cancel=Cancelar\n#XBUT\nButton.ClosePreview=Cerrar presentaci\\u00F3n preliminar\n#XBUT\nButton.Copy=Copiar\n#XBUT\nButton.Create=Crear\n#XBUT\nButton.Delete=Borrar\n#XBUT\nButton.Edit=Tratar\n#XBUT\nButton.Save=Grabar\n#XBUT\nButton.Select=Seleccionar\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=Mostrar cat\\u00E1logos\n#XBUT\nButton.HideCatalogs=Ocultar cat\\u00E1logos\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Problemas\\: {0}\n#XBUT\nButton.SortCatalogs=Conmutar el orden de clasificaci\\u00F3n del cat\\u00E1logo\n#XBUT\nButton.CollapseCatalogs=Contraer todos los cat\\u00E1logos\n#XBUT\nButton.ExpandCatalogs=Desplegar todos los cat\\u00E1logos\n#XBUT\nButton.ShowDetails=Mostrar detalles\n#XBUT\nButton.PagePreview=Vista previa de la p\\u00E1gina\n#XBUT\nButton.ErrorMsg=Mensajes de error\n#XBUT\nButton.EditHeader=Editar cabecera\n#XBUT\nButton.ContextSelector=Seleccionar contexto de rol {0}\n#XBUT\nButton.OverwriteChanges=Sobrescribir\n#XBUT\nButton.DismissChanges=Descartar modificaciones\n\n#XTOL\nTooltip.AddToSections=A\\u00F1adir a las secciones\n#XTOL: Tooltip for the search button\nTooltip.Search=Buscar\n#XTOL\nTooltip.SearchForTiles=Buscar mosaicos\n#XTOL\nTooltip.SearchForRoles=Buscar roles\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Escritorio\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=Ver opciones de clasificaci\\u00F3n\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=Ver opciones de filtro\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=Ver opciones de grupo\n\n#XFLD\nLabel.PageID=ID de p\\u00E1gina\n#XFLD\nLabel.Title=T\\u00EDtulo\n#XFLD\nLabel.WorkbenchRequest=Orden de Workbench\n#XFLD\nLabel.Package=Paquete\n#XFLD\nLabel.TransportInformation=Informaci\\u00F3n de transporte\n#XFLD\nLabel.Details=Detalles\\:\n#XFLD\nLabel.ResponseCode=C\\u00F3digo de respuesta\\:\n#XFLD\nLabel.ModifiedBy=Modificado por\\:\n#XFLD\nLabel.Description=Descripci\\u00F3n\n#XFLD\nLabel.CreatedByFullname=Creado por\n#XFLD\nLabel.CreatedOn=Creado el\n#XFLD\nLabel.ChangedByFullname=Modificado por\n#XFLD\nLabel.ChangedOn=Modificado el\n#XFLD\nLabel.PageTitle=T\\u00EDtulo de p\\u00E1gina\n#XFLD\nLabel.AssignedRole=Rol asignado\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=T\\u00EDtulo\n#XCOL\nColumn.PageDescription=Descripci\\u00F3n\n#XCOL\nColumn.PageAssignmentStatus=Asignado a espacio/rol\n#XCOL\nColumn.PagePackage=Paquete\n#XCOL\nColumn.PageWorkbenchRequest=Orden de Workbench\n#XCOL\nColumn.PageCreatedBy=Creado por\n#XCOL\nColumn.PageCreatedOn=Creado el\n#XCOL\nColumn.PageChangedBy=Modificado por\n#XCOL\nColumn.PageChangedOn=Modificado el\n\n#XTOL\nPlaceholder.SectionName=Introduzca un nombre de secci\\u00F3n\n#XTOL\nPlaceholder.SearchForTiles=Buscar mosaicos\n#XTOL\nPlaceholder.SearchForRoles=Buscar roles\n#XTOL\nPlaceholder.CopyPageTitle=Copia de "{0}"\n#XTOL\nPlaceholder.CopyPageID=Copia de "{0}"\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=todo\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=La secci\\u00F3n {0} no tiene t\\u00EDtulo. Para disfrutar de una experiencia de usuario consistente, le recomendamos que escriba un nombre para cada secci\\u00F3n.\n#XMSG\nMessage.InvalidSectionTitle=Deber\\u00EDa escribir un nombre de secci\\u00F3n.\n#XMSG\nMessage.NoInternetConnection=Compruebe la conexi\\u00F3n a Internet.\n#XMSG\nMessage.SavedChanges=Los cambios se han grabado.\n#XMSG\nMessage.InvalidPageID=Utilice solo los siguientes caracteres\\: A-Z a-z 0-9 _ y /. El ID de p\\u00E1gina no debe empezar con un n\\u00FAmero.\n#XMSG\nMessage.EmptyPageID=Indique un ID de p\\u00E1gina v\\u00E1lido.\n#XMSG\nMessage.EmptyTitle=Indique un t\\u00EDtulo v\\u00E1lido.\n#XMSG\nMessage.NoRoleSelected=Seleccione como m\\u00EDnimo un rol.\n#XMSG\nMessage.SuccessDeletePage=Se ha borrado el objeto seleccionado.\n#XMSG\nMessage.ClipboardCopySuccess=Los detalles se han copiado correctamente.\n#YMSE\nMessage.ClipboardCopyFail=Se ha producido un error al copiar detalles.\n#XMSG\nMessage.PageCreated=Se ha creado la p\\u00E1gina.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=Ning\\u00FAn mosaico\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=No hay roles disponibles.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=No se han encontrado roles. Intente ajustar la b\\u00FAsqueda.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=Ninguna secci\\u00F3n\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=Se ha producido un error al cargar el mosaico {0} en la secci\\u00F3n "{1}".\\n\\nEsto se debe probablemente a una configuraci\\u00F3n de contenido de la rampa de lanzamiento de SAP Fiori incorrecta. La visualizaci\\u00F3n no ser\\u00E1 visible para el usuario.\n#XMSG\nMessage.NavigationTargetError=No se ha podido solucionar el destino de navegaci\\u00F3n.\n#XMSG\nMessage.LoadPageError=No se ha podido cargar la p\\u00E1gina.\n#XMSG\nMessage.UpdatePageError=No se ha podido actualizar la p\\u00E1gina.\n#XMSG\nMessage.CreatePageError=No se ha podido crear la p\\u00E1gina.\n#XMSG\nMessage.TilesHaveErrors=Algunos de los mosaicos o secciones tienen errores. \\u00BFSeguro que desea continuar guardando?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=Se ha producido un error al solucionar el destino de navegaci\\u00F3n del mosaico\\: "{0}".\\n\\nEsto se debe probablemente a una configuraci\\u00F3n de contenido de la rampa de lanzamiento de SAP Fiori no v\\u00E1lida. La visualizaci\\u00F3n no puede abrir una aplicaci\\u00F3n.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=\\u00BFDesea borrar la secci\\u00F3n "{0}"?\n#XMSG\nMessage.Section.DeleteNoTitle=\\u00BFSeguro que desea borrar esta secci\\u00F3n?\n#XMSG\nMessage.OverwriteChanges=Se han producido modificaciones mientras editaba la p\\u00E1gina. \\u00BFDesea sobrescribirlas?\n#XMSG\nMessage.OverwriteRemovedPage=Otro usuario ha borrado la p\\u00E1gina en la que est\\u00E1 trabajando. \\u00BFDesea sobrescribir est\\u00E1 modificaci\\u00F3n?\n#XMSG\nMessage.SaveChanges=Grabe los cambios.\n#XMSG\nMessage.NoPages=No hay p\\u00E1ginas disponibles.\n#XMSG\nMessage.NoPagesFound=No se ha encontrado ninguna p\\u00E1gina. Intente ajustar la b\\u00FAsqueda.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Contenido restringido a contexto de rol.\n#XMSG\nMessage.NotAssigned=Sin asignar.\n#XMSG\nMessage.StatusAssigned=Asignado\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=P\\u00E1gina nueva\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=Seleccione el contexto de rol\n#XTIT\nTitle.TilesHaveErrors=Los mosaicos tienen errores\n#XTIT\nDeleteDialog.Title=Borrar\n#XMSG\nDeleteDialog.Text=\\u00BFSeguro que desea borrar la p\\u00E1gina seleccionada?\n#XBUT\nDeleteDialog.ConfirmButton=Borrar\n#XTIT\nDeleteDialog.LockedTitle=P\\u00E1gina bloqueada\n#XMSG\nDeleteDialog.LockedText=El usuario "{0}" ha bloqueado la p\\u00E1gina seleccionada.\n#XMSG\nDeleteDialog.TransportRequired=Seleccione un paquete de transporte para borrar la p\\u00E1gina seleccionada.\n\n#XMSG\nEditDialog.LockedText=El usuario "{0}" ha bloqueado la p\\u00E1gina seleccionada.\n#XMSG\nEditDialog.TransportRequired=Seleccione un paquete de transporte para editar la p\\u00E1gina seleccionada.\n#XTIT\nEditDialog.Title=Editar p\\u00E1gina\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=Esta p\\u00E1gina se ha creado en el idioma "{0}", pero su idioma de registro est\\u00E1 establecido como "{1}". Modifique su idioma de registro a "{0}" para continuar.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Subt\\u00EDtulo\n#XFLD\nTileInfoPopover.Label.Icon=S\\u00EDmbolo\n#XFLD\nTileInfoPopover.Label.SemanticObject=Objeto sem\\u00E1ntico\n#XFLD\nTileInfoPopover.Label.SemanticAction=Acci\\u00F3n sem\\u00E1ntica\n#XFLD\nTileInfoPopover.Label.FioriID=ID de Fiori\n#XFLD\nTileInfoPopover.Label.AppDetail=Detalle de aplicaci\\u00F3n\n#XFLD\nTileInfoPopover.Label.AppType=Tipo de aplicaci\\u00F3n\n#XFLD\nTileInfoPopover.Label.TileType=Tipo de mosaico\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Dispositivos disponibles\n\n#XTIT\nErrorDialog.Title=Error\n\n#XTIT\nConfirmChangesDialog.Title=Advertencia\n\n#XTIT\nPageOverview.Title=Actualizar p\\u00E1ginas\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=Layout\n\n#XTIT\nCopyDialog.Title=Copiar p\\u00E1gina\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=\\u00BFDesea copiar "{0}"?\n#XFLD\nCopyDialog.NewID=Copia de "{0}"\n\n#XMSG\nTitle.NoSectionTitle=El t\\u00EDtulo de la secci\\u00F3n {0} est\\u00E1 vac\\u00EDo.\n#XMSG\nTitle.UnsufficientRoles=Asignaci\\u00F3n de rol insuficiente para mostrar visualizaci\\u00F3n.\n#XMSG\nTitle.VisualizationIsNotVisible=La visualizaci\\u00F3n no se mostrar\\u00E1.\n#XMSG\nTitle.VisualizationNotNavigateable=La visualizaci\\u00F3n no puede abrir una aplicaci\\u00F3n.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Mosaico est\\u00E1tico\n#XTIT\nTitle.DynamicTile=Mosaico din\\u00E1mico\n#XTIT\nTitle.CustomTile=Mosaico personalizado\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=Vista previa de la p\\u00E1gina\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=Esta p\\u00E1gina no existe.\n#XLNK\nErrorPage.Link=Actualizar p\\u00E1ginas\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_et.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=Halda lehti klientide\\u00FCleselt\n\n#XBUT\nButton.Add=Lisa\n#XBUT\nButton.Cancel=T\\u00FChista\n#XBUT\nButton.ClosePreview=Sule eelvaade\n#XBUT\nButton.Copy=Kopeeri\n#XBUT\nButton.Create=Loo\n#XBUT\nButton.Delete=Kustuta\n#XBUT\nButton.Edit=Redigeeri\n#XBUT\nButton.Save=Salvesta\n#XBUT\nButton.Select=Vali\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=Kuva kataloogid\n#XBUT\nButton.HideCatalogs=Peida kataloogid\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Probleemid\\: {0}\n#XBUT\nButton.SortCatalogs=Vaheta kataloogi sortimisj\\u00E4rjestust\n#XBUT\nButton.CollapseCatalogs=Ahenda k\\u00F5ik kataloogid\n#XBUT\nButton.ExpandCatalogs=Laienda k\\u00F5ik kataloogid\n#XBUT\nButton.ShowDetails=Kuva \\u00FCksikasjad\n#XBUT\nButton.PagePreview=Lehe eelvaade\n#XBUT\nButton.ErrorMsg=T\\u00F5rketeated\n#XBUT\nButton.EditHeader=Redigeeri p\\u00E4ist\n#XBUT\nButton.ContextSelector=Vali rolli kontekst {0}\n#XBUT\nButton.OverwriteChanges=Kirjuta \\u00FCle\n#XBUT\nButton.DismissChanges=H\\u00FClga muudatused\n\n#XTOL\nTooltip.AddToSections=Lisa jaotistesse\n#XTOL: Tooltip for the search button\nTooltip.Search=Otsi\n#XTOL\nTooltip.SearchForTiles=Otsi paane\n#XTOL\nTooltip.SearchForRoles=Otsi rolle\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=T\\u00F6\\u00F6laud\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=Kuva sortimiss\\u00E4tted\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=Kuva filtris\\u00E4tted\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=Kuva grupis\\u00E4tted\n\n#XFLD\nLabel.PageID=Lehe ID\n#XFLD\nLabel.Title=Pealkiri\n#XFLD\nLabel.WorkbenchRequest=T\\u00F6\\u00F6lauataotlus\n#XFLD\nLabel.Package=Pakett\n#XFLD\nLabel.TransportInformation=Transporditeave\n#XFLD\nLabel.Details=\\u00DCksikasjad\\:\n#XFLD\nLabel.ResponseCode=Vastuse kood\\:\n#XFLD\nLabel.ModifiedBy=Muutja\\:\n#XFLD\nLabel.Description=Kirjeldus\n#XFLD\nLabel.CreatedByFullname=Autor\n#XFLD\nLabel.CreatedOn=Loomiskuup\\u00E4ev\n#XFLD\nLabel.ChangedByFullname=Muutja\n#XFLD\nLabel.ChangedOn=Muutmiskuup\\u00E4ev\n#XFLD\nLabel.PageTitle=Lehe tiitel\n#XFLD\nLabel.AssignedRole=M\\u00E4\\u00E4ratud roll\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Tiitel\n#XCOL\nColumn.PageDescription=Kirjeldus\n#XCOL\nColumn.PageAssignmentStatus=M\\u00E4\\u00E4ratud ruumile/rollile\n#XCOL\nColumn.PagePackage=Pakett\n#XCOL\nColumn.PageWorkbenchRequest=T\\u00F6\\u00F6lauataotlus\n#XCOL\nColumn.PageCreatedBy=Autor\n#XCOL\nColumn.PageCreatedOn=Loomiskuup\\u00E4ev\n#XCOL\nColumn.PageChangedBy=Muutja\n#XCOL\nColumn.PageChangedOn=Muutmiskuup\\u00E4ev\n\n#XTOL\nPlaceholder.SectionName=Sisestage jaotise nimi\n#XTOL\nPlaceholder.SearchForTiles=Otsi paane\n#XTOL\nPlaceholder.SearchForRoles=Otsi rolle\n#XTOL\nPlaceholder.CopyPageTitle=Koopia\\: {0}\n#XTOL\nPlaceholder.CopyPageID=Koopia\\: {0}\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=k\\u00F5ik\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=Jaotisel {0} pole tiitlit. S\\u00FCsteemse kasutuskogemuse saamiseks soovitame sisestada iga jaotise jaoks nime.\n#XMSG\nMessage.InvalidSectionTitle=Soovitatav on sisestada jaotise nimi.\n#XMSG\nMessage.NoInternetConnection=Kontrollige oma Interneti-\\u00FChendust.\n#XMSG\nMessage.SavedChanges=Teie muudatused on salvestatud.\n#XMSG\nMessage.InvalidPageID=Kasutage ainult j\\u00E4rgmisi m\\u00E4rke\\: A\\u2013Z, 0\\u20139, _ ja /. Lehe ID ei tohi alata numbriga.\n#XMSG\nMessage.EmptyPageID=Sisestage sobiv lehe ID.\n#XMSG\nMessage.EmptyTitle=Sisestage sobiv tiitel.\n#XMSG\nMessage.NoRoleSelected=Valige v\\u00E4hemalt \\u00FCks roll.\n#XMSG\nMessage.SuccessDeletePage=Valitud objekt on kustutatud.\n#XMSG\nMessage.ClipboardCopySuccess=\\u00DCksikasjad on kopeeritud.\n#YMSE\nMessage.ClipboardCopyFail=\\u00DCksikasjade kopeerimisel ilmnes t\\u00F5rge.\n#XMSG\nMessage.PageCreated=Leht on loodud.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=Paane pole\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=Rollid pole saadaval.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=\\u00DChtegi rolli ei leitud. Proovige oma otsingut korrigeerida.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=Jaotisi pole\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=Paani {0} laadimine jaotises \\u201E{1}\\u201C nurjus.\\n\\nSelle p\\u00F5hjuseks on t\\u00F5en\\u00E4oliselt SAP Fiori k\\u00E4ivituspaani sisu vale konfiguratsioon. Visualiseering pole kasutajale n\\u00E4htav.\n#XMSG\nMessage.NavigationTargetError=Navigeerimise sihti ei saanud lahendada.\n#XMSG\nMessage.LoadPageError=Lehte ei saanud laadida.\n#XMSG\nMessage.UpdatePageError=Lehte ei saanud uuendada.\n#XMSG\nMessage.CreatePageError=Lehte ei saanud luua.\n#XMSG\nMessage.TilesHaveErrors=M\\u00F5nel paanil v\\u00F5i jaotises on t\\u00F5rkeid. Kas soovite kindlasti salvestamist j\\u00E4tkata?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=Paani navigeerimise sihi lahendamine nurjus\\: \\u201E{0}\\u201C.\\n\\nSelle p\\u00F5hjus on t\\u00F5en\\u00E4oliselt SAP Fiori k\\u00E4ivituspaani sisu vale konfiguratsioon. Visualiseering ei saa rakendust avada.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=Kas soovite kindlasti jaotise "{0}" kustutada?\n#XMSG\nMessage.Section.DeleteNoTitle=Kas soovite kindlasti selle jaotise kustutada?\n#XMSG\nMessage.OverwriteChanges=Teie lehe redigeerimise ajal on tehtud muudatusi. Kas soovite need \\u00FCle kirjutada?\n#XMSG\nMessage.OverwriteRemovedPage=Teine kasutaja on lehe, millega t\\u00F6\\u00F6tate, kustutanud. Kas soovite selle muudatuse \\u00FCle kirjutada?\n#XMSG\nMessage.SaveChanges=Salvestage oma muudatused.\n#XMSG\nMessage.NoPages=Lehed pole saadaval.\n#XMSG\nMessage.NoPagesFound=\\u00DChtegi lehte ei leitud. Proovige oma otsingut korrigeerida.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Sisu on piiratud rolli kontekstiga.\n#XMSG\nMessage.NotAssigned=Pole m\\u00E4\\u00E4ratud.\n#XMSG\nMessage.StatusAssigned=M\\u00E4\\u00E4ratud\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=Uus leht\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=Vali rolli kontekst\n#XTIT\nTitle.TilesHaveErrors=Paanidel on t\\u00F5rkeid\n#XTIT\nDeleteDialog.Title=Kustuta\n#XMSG\nDeleteDialog.Text=Kas soovite valitud lehe kustutada?\n#XBUT\nDeleteDialog.ConfirmButton=Kustuta\n#XTIT\nDeleteDialog.LockedTitle=Leht on lukus\n#XMSG\nDeleteDialog.LockedText=Kasutaja {0} on valitud lehe lukustanud.\n#XMSG\nDeleteDialog.TransportRequired=Valitud lehe kustutamiseks valige transpordipakett.\n\n#XMSG\nEditDialog.LockedText=Kasutaja {0} on valitud lehe lukustanud.\n#XMSG\nEditDialog.TransportRequired=Valitud lehe redigeerimiseks valige transpordipakett.\n#XTIT\nEditDialog.Title=Redigeeri lehte\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=See leht on loodud keeles "{0}", kuid teie sisselogimiskeeleks on m\\u00E4\\u00E4ratud "{1}". J\\u00E4tkamiseks muutke oma sisselogimiskeeleks "{0}".\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Alamtiitel\n#XFLD\nTileInfoPopover.Label.Icon=Ikoon\n#XFLD\nTileInfoPopover.Label.SemanticObject=Semantiline objekt\n#XFLD\nTileInfoPopover.Label.SemanticAction=Semantiline toiming\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori ID\n#XFLD\nTileInfoPopover.Label.AppDetail=Rakenduse \\u00FCksikasjad\n#XFLD\nTileInfoPopover.Label.AppType=Rakenduse t\\u00FC\\u00FCp\n#XFLD\nTileInfoPopover.Label.TileType=Paani t\\u00FC\\u00FCp\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Saadaolevad seadmed\n\n#XTIT\nErrorDialog.Title=T\\u00F5rge\n\n#XTIT\nConfirmChangesDialog.Title=Hoiatus\n\n#XTIT\nPageOverview.Title=Halda lehti\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=Paigutus\n\n#XTIT\nCopyDialog.Title=Kopeeri leht\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=Kas soovite \\u00FCksuse {0} kopeerida?\n#XFLD\nCopyDialog.NewID=Koopia\\: {0}\n\n#XMSG\nTitle.NoSectionTitle=Jaotise {0} tiitel on t\\u00FChi.\n#XMSG\nTitle.UnsufficientRoles=Rollim\\u00E4\\u00E4rang pole visualiseeringu kuvamiseks piisav.\n#XMSG\nTitle.VisualizationIsNotVisible=Visualiseeringut ei kuvata.\n#XMSG\nTitle.VisualizationNotNavigateable=Visualiseering ei saa rakendust avada.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Staatiline paan\n#XTIT\nTitle.DynamicTile=D\\u00FCnaamiline paan\n#XTIT\nTitle.CustomTile=Kohandatud paan\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=Lehe eelvaade\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=Me ei leidnud kahjuks seda lehte.\n#XLNK\nErrorPage.Link=Halda lehti\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_fi.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=Yll\\u00E4pid\\u00E4 kirjausj\\u00E4rjestelmille yhteisi\\u00E4 sivuja\n\n#XBUT\nButton.Add=Lis\\u00E4\\u00E4\n#XBUT\nButton.Cancel=Peruuta\n#XBUT\nButton.ClosePreview=Sulje esikatselu\n#XBUT\nButton.Copy=Kopioi\n#XBUT\nButton.Create=Luo\n#XBUT\nButton.Delete=Poista\n#XBUT\nButton.Edit=Muokkaa\n#XBUT\nButton.Save=Tallenna\n#XBUT\nButton.Select=Valitse\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=N\\u00E4yt\\u00E4 luettelot\n#XBUT\nButton.HideCatalogs=Piilota luettelot\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Ongelmat\\: {0}\n#XBUT\nButton.SortCatalogs=Vaihda luettelon lajitteluj\\u00E4rjestys\n#XBUT\nButton.CollapseCatalogs=Tiivist\\u00E4 kaikki luettelot\n#XBUT\nButton.ExpandCatalogs=Laajenna kaikki luettelot\n#XBUT\nButton.ShowDetails=N\\u00E4yt\\u00E4 lis\\u00E4tiedot\n#XBUT\nButton.PagePreview=Sivun esikatselu\n#XBUT\nButton.ErrorMsg=Virheilmoitukset\n#XBUT\nButton.EditHeader=Muokkaa otsikkoa\n#XBUT\nButton.ContextSelector=Valitse roolin konteksti {0}\n#XBUT\nButton.OverwriteChanges=Korvaa\n#XBUT\nButton.DismissChanges=Hylk\\u00E4\\u00E4 muutokset\n\n#XTOL\nTooltip.AddToSections=Lis\\u00E4\\u00E4 osioihin\n#XTOL: Tooltip for the search button\nTooltip.Search=Hae\n#XTOL\nTooltip.SearchForTiles=Hae ruutuja\n#XTOL\nTooltip.SearchForRoles=Hae rooleja\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Ty\\u00F6p\\u00F6yt\\u00E4\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=N\\u00E4yt\\u00E4 lajitteluasetukset\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=N\\u00E4yt\\u00E4 suodatinasetukset\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=N\\u00E4yt\\u00E4 ryhm\\u00E4asetukset\n\n#XFLD\nLabel.PageID=Sivun tunnus\n#XFLD\nLabel.Title=Otsikko\n#XFLD\nLabel.WorkbenchRequest=Ty\\u00F6p\\u00F6yt\\u00E4tilaus\n#XFLD\nLabel.Package=Paketti\n#XFLD\nLabel.TransportInformation=Siirron tiedot\n#XFLD\nLabel.Details=Lis\\u00E4tiedot\\:\n#XFLD\nLabel.ResponseCode=Vastauskoodi\\:\n#XFLD\nLabel.ModifiedBy=Muuttaja\\:\n#XFLD\nLabel.Description=Kuvaus\n#XFLD\nLabel.CreatedByFullname=Tekij\\u00E4\n#XFLD\nLabel.CreatedOn=Luontip\\u00E4iv\\u00E4m\\u00E4\\u00E4r\\u00E4\n#XFLD\nLabel.ChangedByFullname=Muuttaja\n#XFLD\nLabel.ChangedOn=Muutosp\\u00E4iv\\u00E4m\\u00E4\\u00E4r\\u00E4\n#XFLD\nLabel.PageTitle=Sivun otsikko\n#XFLD\nLabel.AssignedRole=Kohdistettu rooli\n\n#XCOL\nColumn.PageID=Tunnus\n#XCOL\nColumn.PageTitle=Otsikko\n#XCOL\nColumn.PageDescription=Kuvaus\n#XCOL\nColumn.PageAssignmentStatus=Kohdistettu tilaan/rooliin\n#XCOL\nColumn.PagePackage=Paketti\n#XCOL\nColumn.PageWorkbenchRequest=Ty\\u00F6p\\u00F6yt\\u00E4tilaus\n#XCOL\nColumn.PageCreatedBy=Tekij\\u00E4\n#XCOL\nColumn.PageCreatedOn=Luontip\\u00E4iv\\u00E4m\\u00E4\\u00E4r\\u00E4\n#XCOL\nColumn.PageChangedBy=Muuttaja\n#XCOL\nColumn.PageChangedOn=Muutosp\\u00E4iv\\u00E4m\\u00E4\\u00E4r\\u00E4\n\n#XTOL\nPlaceholder.SectionName=Sy\\u00F6t\\u00E4 osion nimi\n#XTOL\nPlaceholder.SearchForTiles=Hae ruutuja\n#XTOL\nPlaceholder.SearchForRoles=Hae rooleja\n#XTOL\nPlaceholder.CopyPageTitle=Kohteen \\u201D{0}\\u201D kopio\n#XTOL\nPlaceholder.CopyPageID=Kohteen \\u201D{0}\\u201D kopio\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=kaikki\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=Osiolla {0} ei ole otsikkoa. Yhdenmukaisen k\\u00E4ytt\\u00E4j\\u00E4kokemuksen vuoksi suosittelemme, ett\\u00E4 sy\\u00F6t\\u00E4t nimen jokaiselle osiolle.\n#XMSG\nMessage.InvalidSectionTitle=Suositeltavinta on sy\\u00F6tt\\u00E4\\u00E4 osion nimi.\n#XMSG\nMessage.NoInternetConnection=Tarkista internet-yhteytesi.\n#XMSG\nMessage.SavedChanges=Muutoksesi on tallennettu.\n#XMSG\nMessage.InvalidPageID=K\\u00E4yt\\u00E4 vain seuraavia merkkej\\u00E4\\: A-Z, 0-9, _ ja /. Sivun tunnuksen ei pit\\u00E4isi alkaa numerolla.\n#XMSG\nMessage.EmptyPageID=Anna kelpaava sivun tunnus.\n#XMSG\nMessage.EmptyTitle=Anna kelpaava otsikko.\n#XMSG\nMessage.NoRoleSelected=Valitse v\\u00E4hint\\u00E4\\u00E4n yksi rooli.\n#XMSG\nMessage.SuccessDeletePage=Valittu objekti on poistettu.\n#XMSG\nMessage.ClipboardCopySuccess=Lis\\u00E4tietojen kopiointi onnistui.\n#YMSE\nMessage.ClipboardCopyFail=Lis\\u00E4tietojen kopioinnissa tapahtui virhe.\n#XMSG\nMessage.PageCreated=Sivu on luotu.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=Ei ruutuja\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=Rooleja ei ole k\\u00E4ytett\\u00E4viss\\u00E4.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=Rooleja ei l\\u00F6ydetty. Yrit\\u00E4 mukauttaa hakuasi.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=Ei osioita\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=Ruudun {0} lataaminen ep\\u00E4onnistui osiossa "{1}".\\n\\nT\\u00E4m\\u00E4 johtuu todenn\\u00E4k\\u00F6isesti virheellisest\\u00E4 SAP Fiori -aloituspaneelin sis\\u00E4ll\\u00F6n konfiguraatiosta. Visualisointia ei n\\u00E4ytet\\u00E4 k\\u00E4ytt\\u00E4j\\u00E4lle.\\n\n#XMSG\nMessage.NavigationTargetError=Navigointikohdetta ei voitu ratkaista.\n#XMSG\nMessage.LoadPageError=Sivua ei voitu ladata.\n#XMSG\nMessage.UpdatePageError=Sivua ei voitu p\\u00E4ivitt\\u00E4\\u00E4.\n#XMSG\nMessage.CreatePageError=Sivua ei voitu luoda.\n#XMSG\nMessage.TilesHaveErrors=Joissakin ruuduissa tai osioissa on virheit\\u00E4. Haluatko varmasti jatkaa tallentamista?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=Ruudun "{0}\\u201D navigointikohteen ratkaiseminen ep\\u00E4onnistui.\\n\\nT\\u00E4m\\u00E4 johtuu todenn\\u00E4k\\u00F6isesti virheellisest\\u00E4 SAP Fiori -aloituspaneelin sis\\u00E4ll\\u00F6n konfiguraatiosta. Visualisointi ei voi avata sovellusta.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=Haluatko varmasti poistaa osion "{0}"?\n#XMSG\nMessage.Section.DeleteNoTitle=Haluatko varmasti poistaa t\\u00E4m\\u00E4n osion?\n#XMSG\nMessage.OverwriteChanges=On tapahtunut muutoksia, kun muokkasit sivua. Haluatko korvata ne?\n#XMSG\nMessage.OverwriteRemovedPage=Toinen k\\u00E4ytt\\u00E4j\\u00E4 on poistanut sivun, jota k\\u00E4sittelet. Haluatko korvata t\\u00E4m\\u00E4n muutoksen?\n#XMSG\nMessage.SaveChanges=Tallenna muutoksesi.\n#XMSG\nMessage.NoPages=Sivuja ei ole k\\u00E4ytett\\u00E4viss\\u00E4.\n#XMSG\nMessage.NoPagesFound=Sivuja ei l\\u00F6ydetty. Yrit\\u00E4 mukauttaa hakuasi.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Sis\\u00E4lt\\u00F6 rajoitettu roolin kontekstiin.\n#XMSG\nMessage.NotAssigned=Ei kohdistettu.\n#XMSG\nMessage.StatusAssigned=Kohdistettu\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=Uusi sivu\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=Valitse roolin konteksti\n#XTIT\nTitle.TilesHaveErrors=Ruuduissa on virheit\\u00E4.\n#XTIT\nDeleteDialog.Title=Poista\n#XMSG\nDeleteDialog.Text=Haluatko varmasti poistaa valitun sivun?\n#XBUT\nDeleteDialog.ConfirmButton=Poista\n#XTIT\nDeleteDialog.LockedTitle=Sivu lukittu\n#XMSG\nDeleteDialog.LockedText=K\\u00E4ytt\\u00E4j\\u00E4 \\u201D{0}\\u201D on lukinnut valitun sivun.\n#XMSG\nDeleteDialog.TransportRequired=Valitse siirtopaketti valitun sivun poistamiseksi.\n\n#XMSG\nEditDialog.LockedText=K\\u00E4ytt\\u00E4j\\u00E4 \\u201D{0}\\u201D on lukinnut valitun sivun.\n#XMSG\nEditDialog.TransportRequired=Valitse siirtopaketti valitun sivun muokkaamista varten.\n#XTIT\nEditDialog.Title=Muokkaa sivua\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=T\\u00E4m\\u00E4 sivu on luotu kielell\\u00E4 "{0}\\u201D mutta kirjautumiskieleksesi on asetettu "{1}". Muuta kirjautumiskieleksi "{0}" jatkamista varten.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Alaotsikko\n#XFLD\nTileInfoPopover.Label.Icon=Kuvake\n#XFLD\nTileInfoPopover.Label.SemanticObject=Semanttinen objekti\n#XFLD\nTileInfoPopover.Label.SemanticAction=Semanttinen toimi\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori-tunnus\n#XFLD\nTileInfoPopover.Label.AppDetail=Sovelluksen lis\\u00E4tiedot\n#XFLD\nTileInfoPopover.Label.AppType=Sovellustyyppi\n#XFLD\nTileInfoPopover.Label.TileType=Ruututyyppi\n#XFLD\nTileInfoPopover.Label.AvailableDevices=K\\u00E4ytett\\u00E4viss\\u00E4 olevat laitteet\n\n#XTIT\nErrorDialog.Title=Virhe\n\n#XTIT\nConfirmChangesDialog.Title=Varoitus\n\n#XTIT\nPageOverview.Title=Yll\\u00E4pid\\u00E4 sivuja\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=Asettelu\n\n#XTIT\nCopyDialog.Title=Kopioi sivu\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=Haluatko kopioida kohteen \\u201D{0}\\u201D?\n#XFLD\nCopyDialog.NewID=Kohteen \\u201D{0}\\u201D kopio\n\n#XMSG\nTitle.NoSectionTitle=Osion {0} otsikko on tyhj\\u00E4.\n#XMSG\nTitle.UnsufficientRoles=Riitt\\u00E4m\\u00E4t\\u00F6n roolikohdistus visualisoinnin n\\u00E4ytt\\u00E4mist\\u00E4 varten.\n#XMSG\nTitle.VisualizationIsNotVisible=Visualisointia ei n\\u00E4ytet\\u00E4.\n#XMSG\nTitle.VisualizationNotNavigateable=Visualisointi ei voi avata sovellusta.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Staattinen ruutu\n#XTIT\nTitle.DynamicTile=Dynaaminen ruutu\n#XTIT\nTitle.CustomTile=Asiakaskohtainen ruutu\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=Sivun esikatselu\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=T\\u00E4t\\u00E4 sivua ei valitettavasti l\\u00F6ytynyt.\n#XLNK\nErrorPage.Link=Yll\\u00E4pid\\u00E4 sivuja\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_fr.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=G\\u00E9rer pages inter-mandants\n\n#XBUT\nButton.Add=Ajouter\n#XBUT\nButton.Cancel=Interrompre\n#XBUT\nButton.ClosePreview=Fermer aper\\u00E7u\n#XBUT\nButton.Copy=Copier\n#XBUT\nButton.Create=Cr\\u00E9er\n#XBUT\nButton.Delete=Supprimer\n#XBUT\nButton.Edit=Traiter\n#XBUT\nButton.Save=Sauvegarder\n#XBUT\nButton.Select=S\\u00E9lectionner\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=Afficher catalogues\n#XBUT\nButton.HideCatalogs=Masquer catalogues\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Probl\\u00E8mes \\: {0}\n#XBUT\nButton.SortCatalogs=Changer l\'ordre de tri du catalogue\n#XBUT\nButton.CollapseCatalogs=R\\u00E9duire tous les catalogues\n#XBUT\nButton.ExpandCatalogs=D\\u00E9velopper tous les catalogues\n#XBUT\nButton.ShowDetails=Afficher d\\u00E9tails\n#XBUT\nButton.PagePreview=Aper\\u00E7u de la page\n#XBUT\nButton.ErrorMsg=Messages d\'erreur\n#XBUT\nButton.EditHeader=Traiter en-t\\u00EAte\n#XBUT\nButton.ContextSelector=S\\u00E9lectionner contexte de r\\u00F4le {0}\n#XBUT\nButton.OverwriteChanges=\\u00C9craser\n#XBUT\nButton.DismissChanges=Rejeter modifications\n\n#XTOL\nTooltip.AddToSections=Ajouter aux sections\n#XTOL: Tooltip for the search button\nTooltip.Search=Rechercher\n#XTOL\nTooltip.SearchForTiles=Rechercher des vignettes\n#XTOL\nTooltip.SearchForRoles=Rechercher r\\u00F4les\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Bureau\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=Afficher options de tri\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=Afficher option de filtre\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=Afficher options de groupe\n\n#XFLD\nLabel.PageID=ID de page\n#XFLD\nLabel.Title=Titre\n#XFLD\nLabel.WorkbenchRequest=Ordre du Workbench\n#XFLD\nLabel.Package=Package\n#XFLD\nLabel.TransportInformation=Informations de transport\n#XFLD\nLabel.Details=D\\u00E9tails\n#XFLD\nLabel.ResponseCode=Code de r\\u00E9ponse\n#XFLD\nLabel.ModifiedBy=Modifi\\u00E9 par \\:\n#XFLD\nLabel.Description=Description\n#XFLD\nLabel.CreatedByFullname=Cr\\u00E9\\u00E9 par\n#XFLD\nLabel.CreatedOn=Cr\\u00E9\\u00E9 le\n#XFLD\nLabel.ChangedByFullname=Modifi\\u00E9 par\n#XFLD\nLabel.ChangedOn=Modifi\\u00E9 le\n#XFLD\nLabel.PageTitle=Titre de page\n#XFLD\nLabel.AssignedRole=R\\u00F4le affect\\u00E9\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Titre\n#XCOL\nColumn.PageDescription=D\\u00E9signation\n#XCOL\nColumn.PageAssignmentStatus=Affect\\u00E9 \\u00E0 espace/r\\u00F4le\n#XCOL\nColumn.PagePackage=Paquet\n#XCOL\nColumn.PageWorkbenchRequest=Ordre du Workbench\n#XCOL\nColumn.PageCreatedBy=Cr\\u00E9\\u00E9 par\n#XCOL\nColumn.PageCreatedOn=Cr\\u00E9\\u00E9 le\n#XCOL\nColumn.PageChangedBy=Modifi\\u00E9 par\n#XCOL\nColumn.PageChangedOn=Modifi\\u00E9 le\n\n#XTOL\nPlaceholder.SectionName=Entrer un nom de section\n#XTOL\nPlaceholder.SearchForTiles=Rechercher vignettes\n#XTOL\nPlaceholder.SearchForRoles=Rechercher r\\u00F4les\n#XTOL\nPlaceholder.CopyPageTitle=Copie de "{0}"\n#XTOL\nPlaceholder.CopyPageID=Copie de "{0}"\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=Tout\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=Section {0} sans titre. Pour une exp\\u00E9rience utilisateur coh\\u00E9rente, SAP vous recommande d\'\'entrer un nom pour chaque section.\n#XMSG\nMessage.InvalidSectionTitle=Id\\u00E9alement, vous devez entrer un nom de section.\n#XMSG\nMessage.NoInternetConnection=V\\u00E9rifiez votre connexion Internet.\n#XMSG\nMessage.SavedChanges=Vos modifications ont \\u00E9t\\u00E9 sauvegard\\u00E9es.\n#XMSG\nMessage.InvalidPageID=Utilisez uniquement les caract\\u00E8res suivants \\: A-Z, 0-9, _ et /. L\'ID de page ne doit pas commencer par un nombre.\n#XMSG\nMessage.EmptyPageID=Indiquez un ID de page valide.\n#XMSG\nMessage.EmptyTitle=Indiquez un titre valide.\n#XMSG\nMessage.NoRoleSelected=S\\u00E9lectionnez au moins un r\\u00F4le.\n#XMSG\nMessage.SuccessDeletePage=Objet s\\u00E9lectionn\\u00E9 supprim\\u00E9\n#XMSG\nMessage.ClipboardCopySuccess=D\\u00E9tails copi\\u00E9s correctement.\n#YMSE\nMessage.ClipboardCopyFail=Une erreur est survenue lors de la copie des d\\u00E9tails.\n#XMSG\nMessage.PageCreated=La page a \\u00E9t\\u00E9 cr\\u00E9\\u00E9e.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=Aucune vignette\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=Aucun r\\u00F4le disponible\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=Aucun r\\u00F4le trouv\\u00E9. Adaptez votre recherche.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=Aucune section\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=Le chargement de la vignette {0} dans la section "{1}" a \\u00E9chou\\u00E9.\\n\\nCela est tr\\u00E8s probablement d\\u00FB \\u00E0 une configuration incorrecte du contenu de la barre de lancement SAP Fiori. Le contenu sera invisible \\u00E0 l\'\'utilisateur.\n#XMSG\nMessage.NavigationTargetError=Impossible de r\\u00E9soudre la cible de navigation\n#XMSG\nMessage.LoadPageError=Impossible de charger la page\n#XMSG\nMessage.UpdatePageError=Impossible de mettre \\u00E0 jour la page\n#XMSG\nMessage.CreatePageError=Impossible de cr\\u00E9er la page\n#XMSG\nMessage.TilesHaveErrors=Certaines vignettes ou sections comportent des erreurs. Voulez-vous vraiment sauvegarder ?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=La r\\u00E9solution de la cible de navigation de la vignette a \\u00E9chou\\u00E9 \\: "{0}".\\n\\nCela est tr\\u00E8s probablement d\\u00FB \\u00E0 une configuration non valide du contenu de la barre de lancement SAP Fiori. La visualisation ne peut pas ouvrir une application.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=Voulez-vous vraiment supprimer la section "{0}" ?\n#XMSG\nMessage.Section.DeleteNoTitle=Voulez-vous vraiment supprimer cette section\\u00A0?\n#XMSG\nMessage.OverwriteChanges=Des modifications ont \\u00E9t\\u00E9 effectu\\u00E9es alors que vous traitiez la page. Voulez-vous les \\u00E9craser ?\n#XMSG\nMessage.OverwriteRemovedPage=La page que vous utilisez a \\u00E9t\\u00E9 supprim\\u00E9e par un autre utilisateur. Voulez-vous \\u00E9craser cette modification ?\n#XMSG\nMessage.SaveChanges=Sauvegardez vos modifications.\n#XMSG\nMessage.NoPages=Aucune page disponible\n#XMSG\nMessage.NoPagesFound=Aucune page trouv\\u00E9e. Adaptez votre recherche.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Contenu limit\\u00E9 au contexte de r\\u00F4le\n#XMSG\nMessage.NotAssigned=Non affect\\u00E9\n#XMSG\nMessage.StatusAssigned=Affect\\u00E9\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=Nouvelle page\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=S\\u00E9lectionner contexte de r\\u00F4le\n#XTIT\nTitle.TilesHaveErrors=Vignettes avec erreurs\n#XTIT\nDeleteDialog.Title=Supprimer\n#XMSG\nDeleteDialog.Text=Voulez-vous vraiment supprimer la page s\\u00E9lectionn\\u00E9e\\u00A0?\n#XBUT\nDeleteDialog.ConfirmButton=Supprimer\n#XTIT\nDeleteDialog.LockedTitle=Page bloqu\\u00E9e\n#XMSG\nDeleteDialog.LockedText=La page s\\u00E9lectionn\\u00E9e est bloqu\\u00E9e par l\'\'utilisateur "{0}".\n#XMSG\nDeleteDialog.TransportRequired=S\\u00E9lectionnez un paquet de transport pour supprimer la page s\\u00E9lectionn\\u00E9e.\n\n#XMSG\nEditDialog.LockedText=La page s\\u00E9lectionn\\u00E9e est bloqu\\u00E9e par l\'\'utilisateur "{0}".\n#XMSG\nEditDialog.TransportRequired=S\\u00E9lectionnez un paquet de transport pour traiter la page s\\u00E9lectionn\\u00E9e.\n#XTIT\nEditDialog.Title=Traiter page\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=Cette page a \\u00E9t\\u00E9 cr\\u00E9\\u00E9e en "{0}" mais votre langue de connexion param\\u00E9tr\\u00E9e est "{1}". Modifiez votre langue de connexion en "{0}" pour continuer.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Sous-titre\n#XFLD\nTileInfoPopover.Label.Icon=Ic\\u00F4ne\n#XFLD\nTileInfoPopover.Label.SemanticObject=Objet s\\u00E9mantique\n#XFLD\nTileInfoPopover.Label.SemanticAction=Action s\\u00E9mantique\n#XFLD\nTileInfoPopover.Label.FioriID=ID SAP Fiori\n#XFLD\nTileInfoPopover.Label.AppDetail=D\\u00E9tails appl.\n#XFLD\nTileInfoPopover.Label.AppType=Type d\'appl.\n#XFLD\nTileInfoPopover.Label.TileType=Type de vignette\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Appareils disponibles\n\n#XTIT\nErrorDialog.Title=Erreur\n\n#XTIT\nConfirmChangesDialog.Title=Avertissement\n\n#XTIT\nPageOverview.Title=G\\u00E9rer pages\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=Mise en forme\n\n#XTIT\nCopyDialog.Title=Copier la page\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=Voulez-vous copier "{0}" ?\n#XFLD\nCopyDialog.NewID=Copie de "{0}"\n\n#XMSG\nTitle.NoSectionTitle=Titre de la section {0} vide\n#XMSG\nTitle.UnsufficientRoles=Affectation de r\\u00F4le insuffisante pour afficher contenu\n#XMSG\nTitle.VisualizationIsNotVisible=La visualisation ne sera pas affich\\u00E9e.\n#XMSG\nTitle.VisualizationNotNavigateable=La visualisation ne peut pas ouvrir une application.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Vignette statique\n#XTIT\nTitle.DynamicTile=Vignette dynamique\n#XTIT\nTitle.CustomTile=Vignette personnalis\\u00E9e\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=Aper\\u00E7u de la page \\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=D\\u00E9sol\\u00E9, cette page est introuvable.\n#XLNK\nErrorPage.Link=G\\u00E9rer pages\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_hi.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=\\u092A\\u0943\\u0937\\u094D\\u0920 \\u0915\\u094D\\u0930\\u0949\\u0938 \\u0915\\u094D\\u0932\\u093E\\u0907\\u0902\\u091F \\u092C\\u0928\\u093E\\u090F \\u0930\\u0916\\u0947\\u0902\n\n#XBUT\nButton.Add=\\u091C\\u094B\\u0921\\u093C\\u0947\n#XBUT\nButton.Cancel=\\u0930\\u0926\\u094D\\u0926 \\u0915\\u0930\\u0947\\u0902\n#XBUT\nButton.ClosePreview=\\u092A\\u0942\\u0930\\u094D\\u0935\\u093E\\u0935\\u0932\\u094B\\u0915\\u0928 \\u092C\\u0902\\u0926 \\u0915\\u0930\\u0947\\u0902\n#XBUT\nButton.Copy=\\u092A\\u094D\\u0930\\u0924\\u093F \\u092C\\u0928\\u093E\\u090F\\u0902\n#XBUT\nButton.Create=\\u092C\\u0928\\u093E\\u090F\\u0902\n#XBUT\nButton.Delete=\\u0939\\u091F\\u093E\\u090F\\u0902\n#XBUT\nButton.Edit=\\u0938\\u0902\\u092A\\u093E\\u0926\\u093F\\u0924 \\u0915\\u0930\\u0947\\u0902\n#XBUT\nButton.Save=\\u0938\\u0939\\u0947\\u091C\\u0947\\u0902\n#XBUT\nButton.Select=\\u091A\\u092F\\u0928\n#XBUT\nButton.Ok=\\u0920\\u0940\\u0915\n#XBUT\nButton.ShowCatalogs=\\u0915\\u0948\\u091F\\u0932\\u0949\\u0917 \\u0926\\u093F\\u0916\\u093E\\u090F\\u0902\n#XBUT\nButton.HideCatalogs=\\u0915\\u0948\\u091F\\u0932\\u0949\\u0917 \\u091B\\u093F\\u092A\\u093E\\u090F\\u0902\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=\\u0938\\u092E\\u0938\\u094D\\u092F\\u093E\\u090F\\u0902\\: {0}\n#XBUT\nButton.SortCatalogs=\\u0915\\u0948\\u091F\\u0932\\u0949\\u0917 \\u0938\\u0949\\u0930\\u094D\\u091F \\u0911\\u0930\\u094D\\u0921\\u0930 \\u0915\\u094B \\u091F\\u0949\\u0917\\u0932 \\u0915\\u0930\\u0947\\u0902\n#XBUT\nButton.CollapseCatalogs=\\u0938\\u092D\\u0940 \\u0915\\u0948\\u091F\\u0932\\u0949\\u0917 \\u0915\\u094B \\u0938\\u0902\\u0915\\u0941\\u091A\\u093F\\u0924 \\u0915\\u0930\\u0947\\u0902\n#XBUT\nButton.ExpandCatalogs=\\u0938\\u092D\\u0940 \\u0915\\u0948\\u091F\\u0932\\u0949\\u0917 \\u0915\\u094B \\u0935\\u093F\\u0938\\u094D\\u0924\\u0943\\u0924 \\u0915\\u0930\\u0947\\u0902\n#XBUT\nButton.ShowDetails=\\u0935\\u093F\\u0935\\u0930\\u0923\\u094B\\u0902 \\u0915\\u094B \\u0926\\u093F\\u0916\\u093E\\u090F\\u0902\n#XBUT\nButton.PagePreview=\\u092A\\u0943\\u0937\\u094D\\u0920 \\u092A\\u0942\\u0930\\u094D\\u0935\\u093E\\u0935\\u0932\\u094B\\u0915\\u0928\n#XBUT\nButton.ErrorMsg=\\u0924\\u094D\\u0930\\u0941\\u091F\\u093F \\u0938\\u0902\\u0926\\u0947\\u0936\n#XBUT\nButton.EditHeader=\\u0936\\u0940\\u0930\\u094D\\u0937\\u0932\\u0947\\u0916 \\u0938\\u0902\\u092A\\u093E\\u0926\\u093F\\u0924 \\u0915\\u0930\\u0947\\u0902\n#XBUT\nButton.ContextSelector={0} \\u092D\\u0942\\u092E\\u093F\\u0915\\u093E \\u0915\\u093E \\u0938\\u0902\\u0926\\u0930\\u094D\\u092D \\u091A\\u0941\\u0928\\u0947\\u0902\n#XBUT\nButton.OverwriteChanges=\\u0905\\u0927\\u093F\\u0932\\u0947\\u0916\\u093F\\u0924 \\u0915\\u0930\\u0947\\u0902\n#XBUT\nButton.DismissChanges=\\u092A\\u0930\\u093F\\u0935\\u0930\\u094D\\u0924\\u0928 \\u0930\\u0926\\u094D\\u0926 \\u0915\\u0930\\u0947\\u0902\n\n#XTOL\nTooltip.AddToSections=\\u0905\\u0928\\u0941\\u092D\\u093E\\u0917\\u094B\\u0902 \\u092E\\u0947\\u0902 \\u091C\\u094B\\u0921\\u093C\\u0947\\u0902\n#XTOL: Tooltip for the search button\nTooltip.Search=\\u0916\\u094B\\u091C\\u0947\\u0902\n#XTOL\nTooltip.SearchForTiles=\\u091F\\u093E\\u0907\\u0932 \\u0915\\u0947 \\u0932\\u093F\\u090F \\u0916\\u094B\\u091C\\u0947\\u0902\n#XTOL\nTooltip.SearchForRoles=\\u092D\\u0942\\u092E\\u093F\\u0915\\u093E \\u0916\\u094B\\u091C\\u0947\\u0902\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=\\u0921\\u0947\\u0938\\u094D\\u0915\\u091F\\u0949\\u092A\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=\\u0915\\u094D\\u0930\\u092E\\u093F\\u0924 \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0940 \\u0938\\u0947\\u091F\\u093F\\u0902\\u0917 \\u0926\\u0947\\u0916\\u0947\\u0902\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=\\u092B\\u093C\\u093F\\u0932\\u094D\\u091F\\u0930 \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0940 \\u0938\\u0947\\u091F\\u093F\\u0902\\u0917 \\u0926\\u0947\\u0916\\u0947\\u0902\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=\\u0938\\u092E\\u0942\\u0939 \\u0938\\u0947\\u091F\\u093F\\u0902\\u0917 \\u0926\\u0947\\u0916\\u0947\\u0902\n\n#XFLD\nLabel.PageID=\\u092A\\u0943\\u0937\\u094D\\u0920 ID\n#XFLD\nLabel.Title=\\u0936\\u0940\\u0930\\u094D\\u0937\\u0915\n#XFLD\nLabel.WorkbenchRequest=\\u0935\\u0930\\u094D\\u0915\\u092C\\u0947\\u0902\\u091A \\u0905\\u0928\\u0941\\u0930\\u094B\\u0927\n#XFLD\nLabel.Package=\\u092A\\u0948\\u0915\\u0947\\u091C\n#XFLD\nLabel.TransportInformation=\\u092A\\u0930\\u093F\\u0935\\u0939\\u0928 \\u091C\\u093E\\u0928\\u0915\\u093E\\u0930\\u0940\n#XFLD\nLabel.Details=\\u0935\\u093F\\u0935\\u0930\\u0923\\u0903\n#XFLD\nLabel.ResponseCode=\\u092A\\u094D\\u0930\\u0924\\u093F\\u0915\\u094D\\u0930\\u093F\\u092F\\u093E \\u0915\\u094B\\u0921\\:\n#XFLD\nLabel.ModifiedBy=\\u0938\\u0902\\u0936\\u094B\\u0927\\u0928\\u0915\\u0930\\u094D\\u0924\\u093E\\:\n#XFLD\nLabel.Description=\\u0935\\u0930\\u094D\\u0923\\u0928\n#XFLD\nLabel.CreatedByFullname=\\u0928\\u093F\\u0930\\u094D\\u092E\\u093E\\u0924\\u093E\n#XFLD\nLabel.CreatedOn=\\u0928\\u093F\\u0930\\u094D\\u092E\\u093E\\u0923 \\u0926\\u093F\\u0928\\u093E\\u0902\\u0915\n#XFLD\nLabel.ChangedByFullname=\\u092A\\u0930\\u093F\\u0935\\u0930\\u094D\\u0924\\u0928\\u0915\\u0930\\u094D\\u0924\\u093E\n#XFLD\nLabel.ChangedOn=\\u0907\\u0938 \\u0926\\u093F\\u0928\\u093E\\u0902\\u0915 \\u0915\\u094B \\u092A\\u0930\\u093F.\n#XFLD\nLabel.PageTitle=\\u092A\\u0943\\u0937\\u094D\\u0920 \\u0936\\u0940\\u0930\\u094D\\u0937\\u0915\n#XFLD\nLabel.AssignedRole=\\u0905\\u0938\\u093E\\u0907\\u0928 \\u0915\\u0940 \\u0917\\u0908 \\u092D\\u0942\\u092E\\u093F\\u0915\\u093E\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=\\u0936\\u0940\\u0930\\u094D\\u0937\\u0915\n#XCOL\nColumn.PageDescription=\\u0935\\u0930\\u094D\\u0923\\u0928\n#XCOL\nColumn.PageAssignmentStatus=\\u0938\\u094D\\u092A\\u0947\\u0938/\\u092D\\u0942\\u092E\\u093F\\u0915\\u093E \\u0905\\u0938\\u093E\\u0907\\u0928 \\u0915\\u093F\\u092F\\u093E \\u0917\\u092F\\u093E\n#XCOL\nColumn.PagePackage=\\u092A\\u0948\\u0915\\u0947\\u091C\n#XCOL\nColumn.PageWorkbenchRequest=\\u0935\\u0930\\u094D\\u0915\\u092C\\u0947\\u0902\\u091A \\u0905\\u0928\\u0941\\u0930\\u094B\\u0927\n#XCOL\nColumn.PageCreatedBy=\\u0928\\u093F\\u0930\\u094D\\u092E\\u093E\\u0924\\u093E\n#XCOL\nColumn.PageCreatedOn=\\u0928\\u093F\\u0930\\u094D\\u092E\\u093E\\u0923 \\u0926\\u093F\\u0928\\u093E\\u0902\\u0915\n#XCOL\nColumn.PageChangedBy=\\u092A\\u0930\\u093F\\u0935\\u0930\\u094D\\u0924\\u0928\\u0915\\u0930\\u094D\\u0924\\u093E\n#XCOL\nColumn.PageChangedOn=\\u0907\\u0938 \\u0926\\u093F\\u0928\\u093E\\u0902\\u0915 \\u0915\\u094B \\u092A\\u0930\\u093F.\n\n#XTOL\nPlaceholder.SectionName=\\u0905\\u0928\\u0941\\u092D\\u093E\\u0917 \\u0928\\u093E\\u092E \\u0926\\u0930\\u094D\\u091C \\u0915\\u0930\\u0947\\u0902\n#XTOL\nPlaceholder.SearchForTiles=\\u091F\\u093E\\u0907\\u0932 \\u0915\\u0947 \\u0932\\u093F\\u090F \\u0916\\u094B\\u091C\n#XTOL\nPlaceholder.SearchForRoles=\\u092D\\u0942\\u092E\\u093F\\u0915\\u093E \\u0916\\u094B\\u091C\\u0947\\u0902\n#XTOL\nPlaceholder.CopyPageTitle="{0}" \\u0915\\u0940 \\u092A\\u094D\\u0930\\u0924\\u093F \\u092C\\u0928\\u093E\\u090F\\u0902\n#XTOL\nPlaceholder.CopyPageID="{0}" \\u0915\\u0940 \\u092A\\u094D\\u0930\\u0924\\u093F \\u092C\\u0928\\u093E\\u090F\\u0902\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=\\u0938\\u092D\\u0940\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=\\u0905\\u0928\\u0941\\u092D\\u093E\\u0917 {0} \\u0915\\u093E \\u0915\\u094B\\u0908 \\u0936\\u0940\\u0930\\u094D\\u0937\\u0915 \\u0928\\u0939\\u0940\\u0902 \\u0939\\u0948. \\u0905\\u0928\\u0941\\u0915\\u0942\\u0932 \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0905\\u0928\\u0941\\u092D\\u0935 \\u0915\\u0947 \\u0932\\u093F\\u090F \\u0939\\u092E \\u0906\\u092A\\u0915\\u094B \\u0938\\u0941\\u091D\\u093E\\u0935 \\u0926\\u0947\\u0924\\u0947 \\u0939\\u0948\\u0902 \\u0915\\u093F \\u092A\\u094D\\u0930\\u0924\\u094D\\u092F\\u0947\\u0915 \\u0905\\u0928\\u0941\\u092D\\u093E\\u0917 \\u0915\\u0947 \\u0932\\u093F\\u090F \\u0915\\u094B\\u0908 \\u0928\\u093E\\u092E \\u0926\\u0930\\u094D\\u091C \\u0915\\u0930\\u0947\\u0902.\n#XMSG\nMessage.InvalidSectionTitle=\\u0906\\u092E\\u0924\\u094C\\u0930 \\u092A\\u0930, \\u0906\\u092A\\u0915\\u094B \\u0915\\u094B\\u0908 \\u0905\\u0928\\u0941\\u092D\\u093E\\u0917 \\u0928\\u093E\\u092E \\u0926\\u0930\\u094D\\u091C \\u0915\\u0930\\u0928\\u093E \\u091A\\u093E\\u0939\\u093F\\u090F.\n#XMSG\nMessage.NoInternetConnection=\\u0915\\u0943\\u092A\\u092F\\u093E \\u0905\\u092A\\u0928\\u0947 \\u0907\\u0902\\u091F\\u0930\\u0928\\u0947\\u091F \\u0915\\u0928\\u0947\\u0915\\u094D\\u0936\\u0928 \\u0915\\u0940 \\u091C\\u093E\\u0902\\u091A \\u0915\\u0930\\u0947\\u0902.\n#XMSG\nMessage.SavedChanges=\\u0906\\u092A\\u0915\\u0947 \\u092A\\u0930\\u093F\\u0935\\u0930\\u094D\\u0924\\u0928\\u094B\\u0902 \\u0915\\u094B \\u0938\\u0939\\u0947\\u091C\\u093E \\u0917\\u092F\\u093E \\u0939\\u0948.\n#XMSG\nMessage.InvalidPageID=\\u0915\\u0943\\u092A\\u092F\\u093E \\u0915\\u0947\\u0935\\u0932 \\u0928\\u093F\\u092E\\u094D\\u0928\\u0932\\u093F\\u0916\\u093F\\u0924 \\u0935\\u0930\\u094D\\u0923\\u094B\\u0902 \\u0915\\u093E \\u0909\\u092A\\u092F\\u094B\\u0917 \\u0915\\u0930\\u0947\\u0902\\: A-Z a-z 0-9 _ /. \\u092A\\u0943\\u0937\\u094D\\u0920 \\u0906\\u0908\\u0921\\u0940 \\u0915\\u093F\\u0938\\u0940 \\u0928\\u0902\\u092C\\u0930 \\u0938\\u0947 \\u0936\\u0941\\u0930\\u0942 \\u0928\\u0939\\u0940\\u0902 \\u0939\\u094B\\u0928\\u0940 \\u091A\\u093E\\u0939\\u093F\\u090F.\n#XMSG\nMessage.EmptyPageID=\\u0915\\u0943\\u092A\\u092F\\u093E \\u0915\\u094B\\u0908 \\u092E\\u093E\\u0928 \\u092A\\u0943\\u0937\\u094D\\u0920 ID \\u092A\\u094D\\u0930\\u0926\\u093E\\u0928 \\u0915\\u0930\\u0947\\u0902.\n#XMSG\nMessage.EmptyTitle=\\u0915\\u0943\\u092A\\u092F\\u093E \\u0915\\u094B\\u0908 \\u092E\\u093E\\u0928 \\u0936\\u0940\\u0930\\u094D\\u0937\\u0915 \\u092A\\u094D\\u0930\\u0926\\u093E\\u0928 \\u0915\\u0930\\u0947\\u0902.\n#XMSG\nMessage.NoRoleSelected=\\u0915\\u0943\\u092A\\u092F\\u093E \\u0915\\u092E \\u0938\\u0947 \\u0915\\u092E \\u090F\\u0915 \\u092D\\u0942\\u092E\\u093F\\u0915\\u093E \\u091A\\u0941\\u0928\\u0947\\u0902.\n#XMSG\nMessage.SuccessDeletePage=\\u091A\\u092F\\u0928\\u093F\\u0924 \\u0911\\u092C\\u094D\\u091C\\u0947\\u0915\\u094D\\u091F \\u0939\\u091F\\u093E \\u0926\\u093F\\u092F\\u093E \\u0917\\u092F\\u093E \\u0939\\u0948.\n#XMSG\nMessage.ClipboardCopySuccess=\\u0935\\u093F\\u0935\\u0930\\u0923 \\u0938\\u092B\\u0932\\u0924\\u093E\\u092A\\u0942\\u0930\\u094D\\u0935\\u0915 \\u092A\\u094D\\u0930\\u0924\\u093F \\u092C\\u0928\\u093E\\u092F\\u093E \\u0917\\u092F\\u093E.\n#YMSE\nMessage.ClipboardCopyFail=\\u0935\\u093F\\u0935\\u0930\\u0923 \\u092A\\u094D\\u0930\\u0924\\u093F \\u092C\\u0928\\u093E\\u0924\\u0947 \\u0938\\u092E\\u092F \\u0924\\u094D\\u0930\\u0941\\u091F\\u093F \\u0909\\u0924\\u094D\\u092A\\u0928\\u094D\\u0928 \\u0939\\u0941\\u0908.\n#XMSG\nMessage.PageCreated=\\u092A\\u0943\\u0937\\u094D\\u0920 \\u092C\\u0928\\u093E\\u0908 \\u091C\\u093E \\u091A\\u0941\\u0915\\u0940 \\u0939\\u0948.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=\\u0915\\u094B\\u0908 \\u091F\\u093E\\u0907\\u0932 \\u0928\\u0939\\u0940\\u0902\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=\\u0915\\u094B\\u0908 \\u092D\\u0942\\u092E\\u093F\\u0915\\u093E \\u0909\\u092A\\u0932\\u092C\\u094D\\u0927 \\u0928\\u0939\\u0940\\u0902 \\u0939\\u0948.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=\\u0915\\u094B\\u0908 \\u092D\\u0942\\u092E\\u093F\\u0915\\u093E \\u0928\\u0939\\u0940\\u0902 \\u092E\\u093F\\u0932\\u093E. \\u0905\\u092A\\u0928\\u0940 \\u0916\\u094B\\u091C \\u0915\\u093E \\u0938\\u092E\\u093E\\u092F\\u094B\\u091C\\u0928 \\u0915\\u0930\\u0928\\u0947 \\u0915\\u093E \\u092A\\u094D\\u0930\\u092F\\u093E\\u0938 \\u0915\\u0930\\u0947\\u0902.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=\\u0915\\u094B\\u0908 \\u0905\\u0928\\u0941\\u092D\\u093E\\u0917 \\u0928\\u0939\\u0940\\u0902\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError="{1}" \\u0905\\u0928\\u0941\\u092D\\u093E\\u0917 \\u092E\\u0947\\u0902 {0} \\u091F\\u093E\\u0907\\u0932 \\u0932\\u094B\\u0921 \\u0915\\u0930\\u0928\\u0947 \\u092E\\u0947\\u0902 \\u0935\\u093F\\u092B\\u0932.\\n\\n\\u092F\\u0939 SAP Fiori \\u0932\\u0949\\u0928\\u094D\\u091A\\u092A\\u0948\\u0921 \\u0938\\u093E\\u092E\\u0917\\u094D\\u0930\\u0940 \\u0915\\u0947 \\u0917\\u0932\\u0924 \\u0915\\u0949\\u0928\\u094D\\u092B\\u093C\\u093F\\u0917\\u0930\\u0947\\u0936\\u0928 \\u0915\\u0947 \\u0915\\u093E\\u0930\\u0923 \\u0938\\u092C\\u0938\\u0947 \\u0905\\u0927\\u093F\\u0915 \\u0938\\u0902\\u092D\\u093E\\u0935\\u0928\\u093E \\u0939\\u0948. \\u0926\\u0943\\u0936\\u094D\\u092F \\u0915\\u094B \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0915\\u0947 \\u0932\\u093F\\u090F \\u092A\\u094D\\u0930\\u0926\\u0930\\u094D\\u0936\\u093F\\u0924 \\u0928\\u0939\\u0940\\u0902 \\u0915\\u093F\\u092F\\u093E \\u091C\\u093E\\u090F\\u0917\\u093E.\n#XMSG\nMessage.NavigationTargetError=\\u0928\\u0947\\u0935\\u093F\\u0917\\u0947\\u0936\\u0928 \\u0932\\u0915\\u094D\\u0937\\u094D\\u092F \\u0915\\u094B \\u0939\\u0932 \\u0928\\u0939\\u0940\\u0902 \\u0915\\u093F\\u092F\\u093E \\u091C\\u093E \\u0938\\u0915\\u093E.\n#XMSG\nMessage.LoadPageError=\\u092A\\u0943\\u0937\\u094D\\u0920 \\u0932\\u094B\\u0921 \\u0928\\u0939\\u0940\\u0902 \\u0939\\u094B \\u0938\\u0915\\u093E.\n#XMSG\nMessage.UpdatePageError=\\u092A\\u0943\\u0937\\u094D\\u0920 \\u0905\\u092A\\u0921\\u0947\\u091F \\u0928\\u0939\\u0940\\u0902 \\u0939\\u094B \\u0938\\u0915\\u093E.\n#XMSG\nMessage.CreatePageError=\\u092A\\u0943\\u0937\\u094D\\u0920 \\u092C\\u0928\\u093E\\u092F\\u093E \\u0928\\u0939\\u0940\\u0902 \\u091C\\u093E \\u0938\\u0915\\u093E.\n#XMSG\nMessage.TilesHaveErrors=\\u0915\\u0941\\u091B \\u091F\\u093E\\u0907\\u0932\\u094B\\u0902 \\u092F\\u093E \\u0905\\u0928\\u0941\\u092D\\u093E\\u0917\\u094B\\u0902 \\u092E\\u0947\\u0902 \\u0924\\u094D\\u0930\\u0941\\u091F\\u093F\\u092F\\u093E\\u0902 \\u0939\\u0948\\u0902. \\u0915\\u094D\\u092F\\u093E \\u0906\\u092A \\u0935\\u093E\\u0915\\u0908 \\u0938\\u0939\\u0947\\u091C\\u0928\\u093E \\u091C\\u093E\\u0930\\u0940 \\u0930\\u0916\\u0928\\u093E \\u091A\\u093E\\u0939\\u0924\\u0947 \\u0939\\u0948\\u0902?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=\\u091F\\u093E\\u0907\\u0932 \\u0915\\u0947 \\u0928\\u0947\\u0935\\u093F\\u0917\\u0947\\u0936\\u0928 \\u0932\\u0915\\u094D\\u0937\\u094D\\u092F \\u0915\\u094B \\u0939\\u0932 \\u0915\\u0930\\u0928\\u0947 \\u092E\\u0947\\u0902 \\u0935\\u093F\\u092B\\u0932\\: "{0}".\\n\\n\\u092F\\u0939 SAP Fiori \\u0932\\u0949\\u0928\\u094D\\u091A\\u092A\\u0948\\u0921 \\u0938\\u093E\\u092E\\u0917\\u094D\\u0930\\u0940 \\u0915\\u0947 \\u0905\\u092E\\u093E\\u0928\\u094D\\u092F \\u0915\\u0949\\u0928\\u094D\\u092B\\u093C\\u093F\\u0917\\u0930\\u0947\\u0936\\u0928 \\u0915\\u0947 \\u0915\\u093E\\u0930\\u0923 \\u0938\\u092C\\u0938\\u0947 \\u0905\\u0927\\u093F\\u0915 \\u0938\\u0902\\u092D\\u093E\\u0935\\u0928\\u093E \\u0939\\u0948. \\u0935\\u093F\\u091C\\u093C\\u0941\\u0905\\u0932\\u093E\\u0907\\u091C\\u093C\\u0947\\u0936\\u0928 \\u0915\\u094B\\u0908 \\u090F\\u092A\\u094D\\u0932\\u093F\\u0915\\u0947\\u0936\\u0928 \\u0928\\u0939\\u0940\\u0902 \\u0916\\u094B\\u0932 \\u0938\\u0915\\u0924\\u093E.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=\\u0915\\u094D\\u092F\\u093E \\u0906\\u092A \\u0928\\u093F\\u0936\\u094D\\u091A\\u093F\\u0924 \\u0930\\u0942\\u092A \\u0938\\u0947 "{0}\\u201D \\u0905\\u0928\\u0941\\u092D\\u093E\\u0917 \\u0915\\u094B \\u0939\\u091F\\u093E\\u0928\\u093E \\u091A\\u093E\\u0939\\u0924\\u0947 \\u0939\\u0948\\u0902?\n#XMSG\nMessage.Section.DeleteNoTitle=\\u0915\\u094D\\u092F\\u093E \\u0906\\u092A \\u0928\\u093F\\u0936\\u094D\\u091A\\u093F\\u0924 \\u0930\\u0942\\u092A \\u0938\\u0947 \\u0907\\u0938 \\u0905\\u0928\\u0941\\u092D\\u093E\\u0917 \\u0915\\u094B \\u0939\\u091F\\u093E\\u0928\\u093E \\u091A\\u093E\\u0939\\u0924\\u0947 \\u0939\\u0948\\u0902?\n#XMSG\nMessage.OverwriteChanges=\\u0906\\u092A\\u0915\\u0947 \\u0926\\u094D\\u0935\\u093E\\u0930\\u093E \\u092A\\u0943\\u0937\\u094D\\u0920 \\u0915\\u094B \\u0938\\u0902\\u092A\\u093E\\u0926\\u093F\\u0924 \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0947 \\u0926\\u094C\\u0930\\u093E\\u0928 \\u092C\\u0926\\u0932\\u093E\\u0935 \\u0915\\u093F\\u090F \\u0917\\u090F \\u0939\\u0948\\u0902. \\u0915\\u094D\\u092F\\u093E \\u0906\\u092A \\u0907\\u0928\\u094D\\u0939\\u0947\\u0902 \\u0913\\u0935\\u0930\\u0930\\u093E\\u0907\\u091F \\u0915\\u0930\\u0928\\u093E \\u091A\\u093E\\u0939\\u0924\\u0947 \\u0939\\u0948\\u0902?\n#XMSG\nMessage.OverwriteRemovedPage=\\u091C\\u093F\\u0938 \\u092A\\u0943\\u0937\\u094D\\u0920 \\u092A\\u0930 \\u0906\\u092A \\u0915\\u093E\\u092E \\u0915\\u0930 \\u0930\\u0939\\u0947 \\u0925\\u0947, \\u0935\\u0939 \\u0926\\u0942\\u0938\\u0930\\u0947 \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0926\\u094D\\u0935\\u093E\\u0930\\u093E \\u0939\\u091F\\u093E\\u092F\\u093E \\u091C\\u093E \\u091A\\u0941\\u0915\\u093E \\u0939\\u0948. \\u0915\\u094D\\u092F\\u093E \\u0906\\u092A \\u0907\\u0928 \\u092C\\u0926\\u0932\\u093E\\u0935\\u094B\\u0902 \\u0915\\u094B \\u0913\\u0935\\u0930\\u0930\\u093E\\u0907\\u091F \\u0915\\u0930\\u0928\\u093E \\u091A\\u093E\\u0939\\u0924\\u0947 \\u0939\\u0948\\u0902?\n#XMSG\nMessage.SaveChanges=\\u0915\\u0943\\u092A\\u092F\\u093E \\u0905\\u092A\\u0928\\u0947 \\u092C\\u0926\\u0932\\u093E\\u0935\\u094B\\u0902 \\u0915\\u094B \\u0938\\u0939\\u0947\\u091C\\u0947\\u0902.\n#XMSG\nMessage.NoPages=\\u0915\\u094B\\u0908 \\u092A\\u0943\\u0937\\u094D\\u0920 \\u0909\\u092A\\u0932\\u092C\\u094D\\u0927 \\u0928\\u0939\\u0940\\u0902 \\u0939\\u0948.\n#XMSG\nMessage.NoPagesFound=\\u0915\\u094B\\u0908 \\u092A\\u093C\\u0943\\u0937\\u094D\\u0920 \\u0928\\u0939\\u0940\\u0902 \\u092E\\u093F\\u0932\\u093E. \\u0905\\u092A\\u0928\\u0940 \\u0916\\u094B\\u091C \\u0915\\u093E \\u0938\\u092E\\u093E\\u092F\\u094B\\u091C\\u0928 \\u0915\\u0930\\u0928\\u0947 \\u0915\\u093E \\u092A\\u094D\\u0930\\u092F\\u093E\\u0938 \\u0915\\u0930\\u0947\\u0902.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=\\u092D\\u0942\\u092E\\u093F\\u0915\\u093E \\u0938\\u0902\\u0926\\u0930\\u094D\\u092D \\u0915\\u0947 \\u0932\\u093F\\u090F \\u0938\\u093E\\u092E\\u0917\\u094D\\u0930\\u0940 \\u092A\\u094D\\u0930\\u0924\\u093F\\u092C\\u0902\\u0927\\u093F\\u0924 \\u0939\\u0948.\n#XMSG\nMessage.NotAssigned=\\u0905\\u0938\\u093E\\u0907\\u0928 \\u0928\\u0939\\u0940\\u0902 \\u0915\\u093F\\u092F\\u093E \\u0917\\u092F\\u093E \\u0939\\u0948.\n#XMSG\nMessage.StatusAssigned=\\u0905\\u0938\\u093E\\u0907\\u0928 \\u0915\\u093F\\u092F\\u093E \\u0917\\u092F\\u093E\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=\\u0928\\u092F\\u093E \\u092A\\u0943\\u0937\\u094D\\u0920\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=\\u092D\\u0942\\u092E\\u093F\\u0915\\u093E \\u0915\\u093E \\u0938\\u0902\\u0926\\u0930\\u094D\\u092D \\u091A\\u0941\\u0928\\u0947\\u0902\n#XTIT\nTitle.TilesHaveErrors=\\u091F\\u093E\\u0907\\u0932 \\u092E\\u0947\\u0902 \\u0924\\u094D\\u0930\\u0941\\u091F\\u093F\\u092F\\u093E\\u0902 \\u0939\\u0948\\u0902\n#XTIT\nDeleteDialog.Title=\\u0939\\u091F\\u093E\\u090F\\u0902\n#XMSG\nDeleteDialog.Text=\\u0915\\u094D\\u092F\\u093E \\u0906\\u092A \\u0935\\u093E\\u0915\\u0908 \\u091A\\u092F\\u0928\\u093F\\u0924 \\u092A\\u0943\\u0937\\u094D\\u0920 \\u0939\\u091F\\u093E\\u0928\\u093E \\u091A\\u093E\\u0939\\u0924\\u0947 \\u0939\\u0948?\n#XBUT\nDeleteDialog.ConfirmButton=\\u0939\\u091F\\u093E\\u090F\\u0902\n#XTIT\nDeleteDialog.LockedTitle=\\u092A\\u0943\\u0937\\u094D\\u0920 \\u0932\\u0949\\u0915 \\u0939\\u0948\n#XMSG\nDeleteDialog.LockedText=\\u091A\\u092F\\u0928\\u093F\\u0924 \\u092A\\u0943\\u0937\\u094D\\u0920 "{0}" \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0915\\u0947 \\u0926\\u094D\\u0935\\u093E\\u0930\\u093E \\u0932\\u0949\\u0915 \\u0915\\u0930 \\u0926\\u093F\\u092F\\u093E \\u0917\\u092F\\u093E \\u0939\\u0948.\n#XMSG\nDeleteDialog.TransportRequired=\\u091A\\u092F\\u0928\\u093F\\u0924 \\u092A\\u0943\\u0937\\u094D\\u0920 \\u0915\\u094B \\u0939\\u091F\\u093E\\u0928\\u0947 \\u0915\\u0947 \\u0932\\u093F\\u090F \\u0915\\u0943\\u092A\\u092F\\u093E \\u0915\\u094B\\u0908 \\u091F\\u094D\\u0930\\u093E\\u0902\\u0938\\u092A\\u094B\\u0930\\u094D\\u091F \\u092A\\u0948\\u0915\\u0947\\u091C \\u091A\\u0941\\u0928\\u0947\\u0902.\n\n#XMSG\nEditDialog.LockedText=\\u091A\\u092F\\u0928\\u093F\\u0924 \\u092A\\u0943\\u0937\\u094D\\u0920 "{0}" \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0915\\u0947 \\u0926\\u094D\\u0935\\u093E\\u0930\\u093E \\u0932\\u0949\\u0915 \\u0915\\u0930 \\u0926\\u093F\\u092F\\u093E \\u0917\\u092F\\u093E \\u0939\\u0948.\n#XMSG\nEditDialog.TransportRequired=\\u091A\\u092F\\u0928\\u093F\\u0924 \\u092A\\u0943\\u0937\\u094D\\u0920 \\u0915\\u094B \\u0938\\u0902\\u092A\\u093E\\u0926\\u093F\\u0924 \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0947 \\u0932\\u093F\\u090F \\u0915\\u0943\\u092A\\u092F\\u093E \\u0915\\u094B\\u0908 \\u091F\\u094D\\u0930\\u093E\\u0902\\u0938\\u092A\\u094B\\u0930\\u094D\\u091F \\u092A\\u0948\\u0915\\u0947\\u091C \\u091A\\u0941\\u0928\\u0947\\u0902.\n#XTIT\nEditDialog.Title=\\u0938\\u0902\\u092A\\u093E\\u0926\\u0928 \\u092A\\u0943\\u0937\\u094D\\u0920\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=\\u0907\\u0938 \\u092A\\u0947\\u091C \\u0915\\u094B "{0}" \\u092D\\u093E\\u0937\\u093E \\u092E\\u0947\\u0902 \\u092C\\u0928\\u093E\\u092F\\u093E \\u0917\\u092F\\u093E \\u0939\\u0948, \\u0932\\u0947\\u0915\\u093F\\u0928 \\u0906\\u092A\\u0915\\u0940 \\u0932\\u0949\\u0917 \\u0911\\u0928 \\u092D\\u093E\\u0937\\u093E "{1}\\u201D \\u0938\\u0947\\u091F \\u0939\\u0948. \\u0915\\u0943\\u092A\\u092F\\u093E \\u0906\\u0917\\u0947 \\u092C\\u0922\\u093C\\u0928\\u0947 \\u0915\\u0947 \\u0932\\u093F\\u090F \\u0905\\u092A\\u0928\\u0940 \\u0932\\u0949\\u0917 \\u0911\\u0928 \\u092D\\u093E\\u0937\\u093E \\u0915\\u094B "{0}\\u201D \\u092E\\u0947\\u0902 \\u092C\\u0926\\u0932\\u0947\\u0902.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=\\u0909\\u092A-\\u0936\\u0940\\u0930\\u094D\\u0937\\u0915\n#XFLD\nTileInfoPopover.Label.Icon=\\u0906\\u0907\\u0915\\u0928\n#XFLD\nTileInfoPopover.Label.SemanticObject=\\u0938\\u093F\\u092E\\u0947\\u0902\\u091F\\u093F\\u0915 \\u0911\\u092C\\u094D\\u091C\\u0947\\u0915\\u094D\\u091F\n#XFLD\nTileInfoPopover.Label.SemanticAction=\\u0938\\u093F\\u092E\\u0948\\u0902\\u091F\\u093F\\u0915 \\u0915\\u093E\\u0930\\u094D\\u0930\\u0935\\u093E\\u0908\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori ID\n#XFLD\nTileInfoPopover.Label.AppDetail=\\u090F\\u092A\\u094D\\u0932\\u093F\\u0915\\u0947\\u0936\\u0928 \\u0915\\u0940 \\u091C\\u093E\\u0928\\u0915\\u093E\\u0930\\u0940\n#XFLD\nTileInfoPopover.Label.AppType=\\u090F\\u092A\\u094D\\u0932\\u093F\\u0915\\u0947\\u0936\\u0928 \\u092A\\u094D\\u0930\\u0915\\u093E\\u0930\n#XFLD\nTileInfoPopover.Label.TileType=\\u091F\\u093E\\u0907\\u0932 \\u092A\\u094D\\u0930\\u0915\\u093E\\u0930\n#XFLD\nTileInfoPopover.Label.AvailableDevices=\\u0909\\u092A\\u0932\\u092C\\u094D\\u0927 \\u0921\\u093F\\u0935\\u093E\\u0907\\u0938\n\n#XTIT\nErrorDialog.Title=\\u0924\\u094D\\u0930\\u0941\\u091F\\u093F\n\n#XTIT\nConfirmChangesDialog.Title=\\u091A\\u0947\\u0924\\u093E\\u0935\\u0928\\u0940\n\n#XTIT\nPageOverview.Title=\\u092A\\u0943\\u0937\\u094D\\u0920 \\u092C\\u0928\\u093E\\u090F \\u0930\\u0916\\u0947\\u0902\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=\\u0932\\u0947\\u0906\\u0909\\u091F\n\n#XTIT\nCopyDialog.Title=\\u092A\\u0943\\u0937\\u094D\\u0920 \\u0915\\u0940 \\u092A\\u094D\\u0930\\u0924\\u093F \\u092C\\u0928\\u093E\\u090F\\u0902\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=\\u0915\\u094D\\u092F\\u093E \\u0906\\u092A "{0}" \\u092A\\u094D\\u0930\\u0924\\u093F \\u092C\\u0928\\u093E\\u0928\\u093E \\u091A\\u093E\\u0939\\u0924\\u0947 \\u0939\\u0948\\u0902?\n#XFLD\nCopyDialog.NewID="{0}" \\u0915\\u0940 \\u092A\\u094D\\u0930\\u0924\\u093F \\u092C\\u0928\\u093E\\u090F\\u0902\n\n#XMSG\nTitle.NoSectionTitle=\\u0905\\u0928\\u0941\\u092D\\u093E\\u0917 {0} \\u0915\\u093E \\u0905\\u0928\\u0941\\u092D\\u093E\\u0917 \\u091F\\u093E\\u0907\\u0932 \\u0916\\u093E\\u0932\\u0940 \\u0939\\u0948.\n#XMSG\nTitle.UnsufficientRoles=\\u0935\\u093F\\u091C\\u093C\\u0941\\u0905\\u0932\\u093E\\u0907\\u091C\\u093C\\u0947\\u0936\\u0928 \\u0926\\u093F\\u0916\\u093E\\u0928\\u0947 \\u0915\\u0947 \\u0932\\u093F\\u090F \\u0905\\u092A\\u0930\\u094D\\u092F\\u093E\\u092A\\u094D\\u0924 \\u092D\\u0942\\u092E\\u093F\\u0915\\u093E \\u0905\\u0938\\u093E\\u0907\\u0928\\u092E\\u0947\\u0902\\u091F.\n#XMSG\nTitle.VisualizationIsNotVisible=\\u0935\\u093F\\u091C\\u093C\\u0941\\u0905\\u0932\\u093E\\u0907\\u091C\\u093C\\u0947\\u0936\\u0928 \\u092A\\u094D\\u0930\\u0926\\u0930\\u094D\\u0936\\u093F\\u0924 \\u0915\\u0930\\u0928\\u0947 \\u092F\\u094B\\u0917\\u094D\\u092F \\u0928\\u0939\\u0940\\u0902 \\u0939\\u094B\\u0902\\u0917\\u0947.\n#XMSG\nTitle.VisualizationNotNavigateable=\\u0935\\u093F\\u091C\\u093C\\u0941\\u0905\\u0932\\u093E\\u0907\\u091C\\u093C\\u0947\\u0936\\u0928 \\u0910\\u092A \\u0928\\u0939\\u0940\\u0902 \\u0916\\u094B\\u0932 \\u0938\\u0915\\u0924\\u0947.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=\\u0938\\u094D\\u0925\\u093F\\u0930 \\u091F\\u093E\\u0907\\u0932\n#XTIT\nTitle.DynamicTile=\\u0921\\u093E\\u092F\\u0928\\u0947\\u092E\\u093F\\u0915 \\u091F\\u093E\\u0907\\u0932\n#XTIT\nTitle.CustomTile=\\u0915\\u0938\\u094D\\u091F\\u092E \\u091F\\u093E\\u0907\\u0932\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=\\u092A\\u0943\\u0937\\u094D\\u0920 \\u092A\\u0942\\u0930\\u094D\\u0935\\u093E\\u0935\\u0932\\u094B\\u0915\\u0928\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=\\u0915\\u094D\\u0937\\u092E\\u093E \\u0915\\u0930\\u0947\\u0902, \\u0939\\u092E \\u0907\\u0938 \\u092A\\u0947\\u091C \\u0915\\u094B \\u0928\\u0939\\u0940\\u0902 \\u0922\\u0942\\u0902\\u0922 \\u0938\\u0915\\u0947.\n#XLNK\nErrorPage.Link=\\u092A\\u0943\\u0937\\u094D\\u0920 \\u092C\\u0928\\u093E\\u090F \\u0930\\u0916\\u0947\\u0902\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_hr.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=Odr\\u017Eavaj stranice za sve klijente\n\n#XBUT\nButton.Add=Dodaj\n#XBUT\nButton.Cancel=Otka\\u017Ei\n#XBUT\nButton.ClosePreview=Close Preview\n#XBUT\nButton.Copy=Kopiraj\n#XBUT\nButton.Create=Kreiraj\n#XBUT\nButton.Delete=Izbri\\u0161i\n#XBUT\nButton.Edit=Uredi\n#XBUT\nButton.Save=Snimi\n#XBUT\nButton.Select=Odaberi\n#XBUT\nButton.Ok=U redu\n#XBUT\nButton.ShowCatalogs=Poka\\u017Ei kataloge\n#XBUT\nButton.HideCatalogs=Sakrij kataloge\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Problemi\\: {0}\n#XBUT\nButton.SortCatalogs=Zamijeni redoslijed sortiranja kataloga\n#XBUT\nButton.CollapseCatalogs=Sa\\u017Emi sve kataloge\n#XBUT\nButton.ExpandCatalogs=Pro\\u0161iri sve kataloge\n#XBUT\nButton.ShowDetails=Poka\\u017Ei detalje\n#XBUT\nButton.PagePreview=Pregled stranice\n#XBUT\nButton.ErrorMsg=Poruke o gre\\u0161kama\n#XBUT\nButton.EditHeader=Uredi zaglavlje\n#XBUT\nButton.ContextSelector=Select Role Context {0}\n#XBUT\nButton.OverwriteChanges=Overwrite\n#XBUT\nButton.DismissChanges=Dismiss Changes\n\n#XTOL\nTooltip.AddToSections=Dodaj odjeljcima\n#XTOL: Tooltip for the search button\nTooltip.Search=Tra\\u017Ei\n#XTOL\nTooltip.SearchForTiles=Tra\\u017Ei podekrane\n#XTOL\nTooltip.SearchForRoles=Search for Roles\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Desktop\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=View Sort Settings\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=View Filter Settings\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=View Group Settings\n\n#XFLD\nLabel.PageID=ID stranice\n#XFLD\nLabel.Title=Naslov\n#XFLD\nLabel.WorkbenchRequest=Workbench zahtjev\n#XFLD\nLabel.Package=Paket\n#XFLD\nLabel.TransportInformation=Informacije o transportu\n#XFLD\nLabel.Details=Detalji\\:\n#XFLD\nLabel.ResponseCode=\\u0160ifra odgovora\\:\n#XFLD\nLabel.ModifiedBy=Modified by\\:\n#XFLD\nLabel.Description=Opis\n#XFLD\nLabel.CreatedByFullname=Kreirao\n#XFLD\nLabel.CreatedOn=Datum kreiranja\n#XFLD\nLabel.ChangedByFullname=Promijenio\n#XFLD\nLabel.ChangedOn=Datum promjene\n#XFLD\nLabel.PageTitle=Naslov stranice\n#XFLD\nLabel.AssignedRole=Dodijeljena uloga\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Naslov\n#XCOL\nColumn.PageDescription=Opis\n#XCOL\nColumn.PageAssignmentStatus=Assigned to Space/Role\n#XCOL\nColumn.PagePackage=Paket\n#XCOL\nColumn.PageWorkbenchRequest=Workbench zahtjev\n#XCOL\nColumn.PageCreatedBy=Kreirao\n#XCOL\nColumn.PageCreatedOn=Datum kreiranja\n#XCOL\nColumn.PageChangedBy=Promijenio\n#XCOL\nColumn.PageChangedOn=Datum promjene\n\n#XTOL\nPlaceholder.SectionName=Unesi naziv odjeljka\n#XTOL\nPlaceholder.SearchForTiles=Tra\\u017Ei podekrane\n#XTOL\nPlaceholder.SearchForRoles=Search for roles\n#XTOL\nPlaceholder.CopyPageTitle=Kopija "{0}"\n#XTOL\nPlaceholder.CopyPageID=Kopija "{0}"\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=all\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=Odjeljak {0} nema naslov. Radi dosljednog korisni\\u010Dkog do\\u017Eivljaja, preporu\\u010Dujemo unos naziva za svaki odjeljak.\n#XMSG\nMessage.InvalidSectionTitle=U idealnom slu\\u010Daju trebali biste unijeti naziv odjeljka.\n#XMSG\nMessage.NoInternetConnection=Provjerite svoju internetsku vezu.\n#XMSG\nMessage.SavedChanges=Va\\u0161e su promjene snimljene.\n#XMSG\nMessage.InvalidPageID=Upotrebljavajte samo sljede\\u0107e znakove\\: A-Z a-z 0-9 _ /. ID stranice ne smije po\\u010Deti brojem.\n#XMSG\nMessage.EmptyPageID=Navedite va\\u017Ee\\u0107i ID stranice.\n#XMSG\nMessage.EmptyTitle=Navedite va\\u017Ee\\u0107i naslov.\n#XMSG\nMessage.NoRoleSelected=Odaberite najmanje jednu ulogu.\n#XMSG\nMessage.SuccessDeletePage=Odabrani objekt izbrisan je.\n#XMSG\nMessage.ClipboardCopySuccess=Detalji uspje\\u0161no kopirani.\n#YMSE\nMessage.ClipboardCopyFail=Pojavila se gre\\u0161ka pri kopiranju detalja.\n#XMSG\nMessage.PageCreated=Stranica je kreirana.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=Nema podekrana\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=No roles available.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=No roles found. Try adjusting your search.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=Nema odjeljaka\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=U\\u010Ditavanje podekrana {0} u odjeljak "{1}" nije uspjelo.\\n\\nUzrok tome najverojatnije je neto\\u010Dna konfiguracija sadr\\u017Eaja SAP Fiori launchpada. Vizualizacija ne\\u0107e biti prikazana za korisnika.\n#XMSG\nMessage.NavigationTargetError=Cilj usmjeravanja nije mogu\\u0107e razrije\\u0161iti.\n#XMSG\nMessage.LoadPageError=Could not load the page template.\n#XMSG\nMessage.UpdatePageError=Could not update the page template.\n#XMSG\nMessage.CreatePageError=Could not create the page template.\n#XMSG\nMessage.TilesHaveErrors=Neki podekrani li odjeljci imaju gre\\u0161ke. \\u017Delite li zaista nastaviti sa snimanjem?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=Nije uspjelo razrje\\u0161avanje cilja usmjeravanja podekrana\\: "{0}".\\n\\n Uzrok tome najverojatnije je neto\\u010Dna konfiguracija sadr\\u017Eaja SAP Fiori launchpada. Vizualizacije ne mo\\u017Ee otvoriti aplikaciju.\\n\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=\\u017Delite li zaista izbrisati odjeljak "{0}"?\n#XMSG\nMessage.Section.DeleteNoTitle=\\u017Delite li zaista izbrisati ovaj odjeljak?\n#XMSG\nMessage.OverwriteChanges=There have been changes while you were editing the page template. Do you want to overwrite them?\n#XMSG\nMessage.OverwriteRemovedPage=The page template you are working on has been deleted by a different user. Do you want to overwrite this change?\n#XMSG\nMessage.SaveChanges=Snimite svoje promjene.\n#XMSG\nMessage.NoPages=Nema raspolo\\u017Eivih stranica.\n#XMSG\nMessage.NoPagesFound=Nisu na\\u0111ene stranice. Poku\\u0161ajte prilagoditi tra\\u017Eenje.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Content restricted to role context.\n#XMSG\nMessage.NotAssigned=Not Assigned\n#XMSG\nMessage.StatusAssigned=Assigned\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=Nova stranica\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=Select Role Context\n#XTIT\nTitle.TilesHaveErrors=Podekrani imaju gre\\u0161ke\n#XTIT\nDeleteDialog.Title=Izbri\\u0161i\n#XMSG\nDeleteDialog.Text=\\u017Delite li zaista izbrisati odabran stranicu?\n#XBUT\nDeleteDialog.ConfirmButton=Izbri\\u0161i\n#XTIT\nDeleteDialog.LockedTitle=Stranica zaklju\\u010Dana\n#XMSG\nDeleteDialog.LockedText=Odabranu stranicu zaklju\\u010Dao je korisnik "{0}".\n#XMSG\nDeleteDialog.TransportRequired=Odaberite paket transporta za brisanje odabrane stranice.\n\n#XMSG\nEditDialog.LockedText=Odabranu stranicu zaklju\\u010Dao je korisnik "{0}".\n#XMSG\nEditDialog.TransportRequired=Odaberite paket transporta za ure\\u0111ivanje odabrane stranice.\n#XTIT\nEditDialog.Title=Uredi stranicu\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=Ova stranica kreirana je na jeziku "{0}" ali je va\\u0161 jezik prijave postavljen na "{1}". Promijenite svoj jezik prijave na "{0}" kako biste nastavili.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Subtitle\n#XFLD\nTileInfoPopover.Label.Icon=Icon\n#XFLD\nTileInfoPopover.Label.SemanticObject=Semantic Object\n#XFLD\nTileInfoPopover.Label.SemanticAction=Semantic Action\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori ID\n#XFLD\nTileInfoPopover.Label.AppDetail=App Detail\n#XFLD\nTileInfoPopover.Label.AppType=App Type\n#XFLD\nTileInfoPopover.Label.TileType=Tile Type\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Available Devices\n\n#XTIT\nErrorDialog.Title=Gre\\u0161ka\n\n#XTIT\nConfirmChangesDialog.Title=Warning\n\n#XTIT\nPageOverview.Title=Odr\\u017Eavaj stranice\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=Layout\n\n#XTIT\nCopyDialog.Title=Kopiraj stranicu\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=\\u017Delite li kopirati "{0}"?\n#XFLD\nCopyDialog.NewID=Kopija "{0}"\n\n#XMSG\nTitle.NoSectionTitle=Naslov odjaljka {0} prazan je.\n#XMSG\nTitle.UnsufficientRoles=Nedovoljna dodjela uloge za prikaz vizualizacije.\n#XMSG\nTitle.VisualizationIsNotVisible=Vizualizacija ne\\u0107e biti prikazana.\n#XMSG\nTitle.VisualizationNotNavigateable=Vizualizacija ne mo\\u017Ee otvoriti aplikaciju.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Stati\\u010Dni podekran\n#XTIT\nTitle.DynamicTile=Dinami\\u010Dni podekran\n#XTIT\nTitle.CustomTile=Korisni\\u010Dki definiran podekran\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=Page Template Preview\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=Na\\u017Ealost, ne mo\\u017Eemo na\\u0107i ovu stranicu.\n#XLNK\nErrorPage.Link=Odr\\u017Eavaj stranice\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_hu.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=Oldalak mandantf\\u00FCggetlen karbantart\\u00E1sa\n\n#XBUT\nButton.Add=Hozz\\u00E1ad\\u00E1s\n#XBUT\nButton.Cancel=M\\u00E9gse\n#XBUT\nButton.ClosePreview=El\\u0151n\\u00E9zet bez\\u00E1r\\u00E1sa\n#XBUT\nButton.Copy=M\\u00E1sol\\u00E1s\n#XBUT\nButton.Create=L\\u00E9trehoz\\u00E1s\n#XBUT\nButton.Delete=T\\u00F6rl\\u00E9s\n#XBUT\nButton.Edit=Feldolgoz\\u00E1s\n#XBUT\nButton.Save=Ment\\u00E9s\n#XBUT\nButton.Select=Kiv\\u00E1laszt\\u00E1s\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=Katal\\u00F3gusok megjelent\\u00E9se\n#XBUT\nButton.HideCatalogs=Katal\\u00F3gusok elrejt\\u00E9se\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Probl\\u00E9m\\u00E1k\\: {0}\n#XBUT\nButton.SortCatalogs=Katal\\u00F3gus rendez\\u00E9si sorrendj\\u00E9nek v\\u00E1lt\\u00E1sa\n#XBUT\nButton.CollapseCatalogs=\\u00D6sszes katal\\u00F3gus visszaz\\u00E1r\\u00E1sa\n#XBUT\nButton.ExpandCatalogs=\\u00D6sszes katal\\u00F3gus kibont\\u00E1sa\n#XBUT\nButton.ShowDetails=R\\u00E9szletek megjelen\\u00EDt\\u00E9se\n#XBUT\nButton.PagePreview=Oldal el\\u0151n\\u00E9zete\n#XBUT\nButton.ErrorMsg=Hiba\\u00FCzenetek\n#XBUT\nButton.EditHeader=Fejl\\u00E9c szerkeszt\\u00E9se\n#XBUT\nButton.ContextSelector={0} Szerepkontextus kiv\\u00E1laszt\\u00E1sa\n#XBUT\nButton.OverwriteChanges=Fel\\u00FCl\\u00EDr\\u00E1s\n#XBUT\nButton.DismissChanges=M\\u00F3dos\\u00EDt\\u00E1sok elvet\\u00E9se\n\n#XTOL\nTooltip.AddToSections=Hozz\\u00E1ad\\u00E1s szakaszokhoz\n#XTOL: Tooltip for the search button\nTooltip.Search=Keres\\u00E9s\n#XTOL\nTooltip.SearchForTiles=Csemp\\u00E9k keres\\u00E9se\n#XTOL\nTooltip.SearchForRoles=Szerepek keres\\u00E9se\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Desktop\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=Rendez\\u00E9si be\\u00E1ll\\u00EDt\\u00E1sok megtekint\\u00E9se\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=Sz\\u0171r\\u00E9si be\\u00E1ll\\u00EDt\\u00E1sok megtekint\\u00E9se\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=Csoportbe\\u00E1ll\\u00EDt\\u00E1sok megtekint\\u00E9se\n\n#XFLD\nLabel.PageID=Oldal azonos\\u00EDt\\u00F3ja\n#XFLD\nLabel.Title=C\\u00EDm\n#XFLD\nLabel.WorkbenchRequest=Workbench-k\\u00E9relem\n#XFLD\nLabel.Package=Csomag\n#XFLD\nLabel.TransportInformation=Transzportinform\\u00E1ci\\u00F3\n#XFLD\nLabel.Details=R\\u00E9szletek\\:\n#XFLD\nLabel.ResponseCode=V\\u00E1laszk\\u00F3d\\:\n#XFLD\nLabel.ModifiedBy=M\\u00F3dos\\u00EDtotta\\:\n#XFLD\nLabel.Description=Le\\u00EDr\\u00E1s\n#XFLD\nLabel.CreatedByFullname=L\\u00E9trehozta\n#XFLD\nLabel.CreatedOn=L\\u00E9trehoz\\u00E1s d\\u00E1tuma\n#XFLD\nLabel.ChangedByFullname=M\\u00F3dos\\u00EDt\\u00F3\n#XFLD\nLabel.ChangedOn=M\\u00F3dos\\u00EDt\\u00E1s d\\u00E1tuma\n#XFLD\nLabel.PageTitle=Oldal c\\u00EDme\n#XFLD\nLabel.AssignedRole=Hozz\\u00E1rendelt szerep\n\n#XCOL\nColumn.PageID=Azonos\\u00EDt\\u00F3\n#XCOL\nColumn.PageTitle=C\\u00EDm\n#XCOL\nColumn.PageDescription=Megnevez\\u00E9s\n#XCOL\nColumn.PageAssignmentStatus=T\\u00E9rhez/szerephez rendelve\n#XCOL\nColumn.PagePackage=Csomag\n#XCOL\nColumn.PageWorkbenchRequest=Workbench-k\\u00E9relem\n#XCOL\nColumn.PageCreatedBy=L\\u00E9trehozta\n#XCOL\nColumn.PageCreatedOn=L\\u00E9trehoz\\u00E1s d\\u00E1tuma\n#XCOL\nColumn.PageChangedBy=M\\u00F3dos\\u00EDt\\u00F3\n#XCOL\nColumn.PageChangedOn=M\\u00F3dos\\u00EDt\\u00E1s d\\u00E1tuma\n\n#XTOL\nPlaceholder.SectionName=Adjon meg szakasznevet\n#XTOL\nPlaceholder.SearchForTiles=Csemp\\u00E9k keres\\u00E9se\n#XTOL\nPlaceholder.SearchForRoles=Szerepek keres\\u00E9se\n#XTOL\nPlaceholder.CopyPageTitle={0} m\\u00E1solata\n#XTOL\nPlaceholder.CopyPageID={0} m\\u00E1solata\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=\\u00F6sszes\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=A(z) {0} szakasznak nincs c\\u00EDme. A fel\\u00FClet egys\\u00E9gess\\u00E9ge \\u00E9rdek\\u00E9ben javasoljuk, hogy minden szakasznak adjon c\\u00EDmet.\n#XMSG\nMessage.InvalidSectionTitle=C\\u00E9lszer\\u0171 megadni a szakasz nev\\u00E9t.\n#XMSG\nMessage.NoInternetConnection=Ellen\\u0151rizze az internetkapcsolat\\u00E1t.\n#XMSG\nMessage.SavedChanges=A m\\u00F3dos\\u00EDt\\u00E1sok mentve.\n#XMSG\nMessage.InvalidPageID=Csak a k\\u00F6vetkez\\u0151 karaktereket haszn\\u00E1lja\\: A-Z a-z 0-9 _ \\u00E9s /. Az oldalazonos\\u00EDt\\u00F3 nem kezd\\u0151dhet sz\\u00E1mmal.\n#XMSG\nMessage.EmptyPageID=Adjon meg \\u00E9rv\\u00E9nyes oldalazonos\\u00EDt\\u00F3t.\n#XMSG\nMessage.EmptyTitle=Adjon meg \\u00E9rv\\u00E9nyes c\\u00EDmet.\n#XMSG\nMessage.NoRoleSelected=V\\u00E1lasszon legal\\u00E1bb egy szerepet.\n#XMSG\nMessage.SuccessDeletePage=A kiv\\u00E1lasztott objektum t\\u00F6rl\\u0151d\\u00F6tt.\n#XMSG\nMessage.ClipboardCopySuccess=A r\\u00E9szletek sikeresen m\\u00E1solva.\n#YMSE\nMessage.ClipboardCopyFail=Hiba l\\u00E9pett fel a r\\u00E9szletek m\\u00E1sol\\u00E1sakor.\n#XMSG\nMessage.PageCreated=Az oldal l\\u00E9trej\\u00F6tt.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=Nincs csempe\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=Nincs el\\u00E9rhet\\u0151 szerep.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=Nem tal\\u00E1lhat\\u00F3 szerep. M\\u00F3dos\\u00EDtsa a keres\\u00E9st.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=Nincs szakasz\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=Nem siker\\u00FClt bet\\u00F6lteni a(z) \\u201E{1}\\u201D csoportban tal\\u00E1lhat\\u00F3 {0} csemp\\u00E9t.\\n\\nEnnek oka val\\u00F3sz\\u00EDn\\u0171leg egy helytelen SAP Fiori-ind\\u00EDt\\u00F3pulti tartalomkonfigur\\u00E1ci\\u00F3. A felhaszn\\u00E1l\\u00F3 nem fogja l\\u00E1tni a megjelen\\u00EDt\\u00E9st.\n#XMSG\nMessage.NavigationTargetError=A navig\\u00E1ci\\u00F3s c\\u00E9l nem tal\\u00E1lhat\\u00F3.\n#XMSG\nMessage.LoadPageError=Az oldal bet\\u00F6lt\\u00E9se sikertelen.\n#XMSG\nMessage.UpdatePageError=Az oldal friss\\u00EDt\\u00E9se sikertelen.\n#XMSG\nMessage.CreatePageError=Az oldal l\\u00E9trehoz\\u00E1sa sikertelen.\n#XMSG\nMessage.TilesHaveErrors=Egyes csemp\\u00E9kn\\u00E9l vagy szakaszokn\\u00E1l hib\\u00E1k tal\\u00E1lhat\\u00F3k. Biztosan folytatja a ment\\u00E9st?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=A(z) {0} csempe navig\\u00E1ci\\u00F3s c\\u00E9lja nem tal\\u00E1lhat\\u00F3.\\n\\nEnnek oka val\\u00F3sz\\u00EDn\\u0171leg egy helytelen SAP Fiori-ind\\u00EDt\\u00F3pulti tartalomkonfigur\\u00E1ci\\u00F3. A megjelen\\u00EDt\\u00E9s nem tudja az alkalmaz\\u00E1st megnyitni.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=T\\u00F6rli a(z) "{0}" szakaszt?\n#XMSG\nMessage.Section.DeleteNoTitle=Biztosan t\\u00F6rli ezt a szakaszt?\n#XMSG\nMessage.OverwriteChanges=M\\u00F3dos\\u00EDt\\u00E1sok t\\u00F6rt\\u00E9ntek, am\\u00EDg az oldalt szerkesztette. Fel\\u00FCl\\u00EDrja \\u0151ket?\n#XMSG\nMessage.OverwriteRemovedPage=Az \\u00D6n \\u00E1ltal haszn\\u00E1lt oldalt egy m\\u00E1sik felhaszn\\u00E1l\\u00F3 t\\u00F6r\\u00F6lte. Fel\\u00FCl\\u00EDrja ezt a m\\u00F3dos\\u00EDt\\u00E1st?\n#XMSG\nMessage.SaveChanges=Mentse a m\\u00F3dos\\u00EDt\\u00E1sait.\n#XMSG\nMessage.NoPages=Nem \\u00E9rhet\\u0151 el oldal.\n#XMSG\nMessage.NoPagesFound=Nem tal\\u00E1lhat\\u00F3 oldal. M\\u00F3dos\\u00EDtsa a keres\\u00E9st.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Tartalom a szerepkontextusra korl\\u00E1tozva.\n#XMSG\nMessage.NotAssigned=Nincs hozz\\u00E1rendelve.\n#XMSG\nMessage.StatusAssigned=Hozz\\u00E1rendelve\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=\\u00DAj oldal\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=Szerepkontextus kiv\\u00E1laszt\\u00E1sa\n#XTIT\nTitle.TilesHaveErrors=Hib\\u00E1s csemp\\u00E9k\n#XTIT\nDeleteDialog.Title=T\\u00F6rl\\u00E9s\n#XMSG\nDeleteDialog.Text=Biztosan t\\u00F6rli a kijel\\u00F6lt oldalt?\n#XBUT\nDeleteDialog.ConfirmButton=T\\u00F6rl\\u00E9s\n#XTIT\nDeleteDialog.LockedTitle=Az oldal z\\u00E1rolva\n#XMSG\nDeleteDialog.LockedText=A kiv\\u00E1lasztott oldalt "{0}" felhaszn\\u00E1l\\u00F3 z\\u00E1rolja.\n#XMSG\nDeleteDialog.TransportRequired=V\\u00E1lasszon egy transzportcsomagot a kiv\\u00E1lasztott oldal t\\u00F6rl\\u00E9s\\u00E9hez.\n\n#XMSG\nEditDialog.LockedText=A kiv\\u00E1lasztott oldalt "{0}" felhaszn\\u00E1l\\u00F3 z\\u00E1rolja.\n#XMSG\nEditDialog.TransportRequired=V\\u00E1lasszon egy transzportcsomagot a kiv\\u00E1lasztott oldal szerkeszt\\u00E9s\\u00E9hez.\n#XTIT\nEditDialog.Title=Oldal szerkeszt\\u00E9se\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=Ez az oldal "{0}" nyelven k\\u00E9sz\\u00FClt, de a bejelentkez\\u00E9si nyelve "{1}". A folytat\\u00E1shoz m\\u00F3dos\\u00EDtsa a bejelentkez\\u00E9si nyelvet erre\\:"{0}".\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Alc\\u00EDm\n#XFLD\nTileInfoPopover.Label.Icon=Ikon\n#XFLD\nTileInfoPopover.Label.SemanticObject=Szemantikai objektum\n#XFLD\nTileInfoPopover.Label.SemanticAction=Szemantikai m\\u0171velet\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori ID\n#XFLD\nTileInfoPopover.Label.AppDetail=Alklmaz\\u00E1s-r\\u00E9szletez\\u00E9s\n#XFLD\nTileInfoPopover.Label.AppType=Alkalmaz\\u00E1st\\u00EDpus\n#XFLD\nTileInfoPopover.Label.TileType=Csempet\\u00EDpus\n#XFLD\nTileInfoPopover.Label.AvailableDevices=El\\u00E9rhet\\u0151 eszk\\u00F6z\\u00F6k\n\n#XTIT\nErrorDialog.Title=Hiba\n\n#XTIT\nConfirmChangesDialog.Title=Figyelmeztet\\u00E9s\n\n#XTIT\nPageOverview.Title=Oldalak karbantart\\u00E1sa\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=Layout\n\n#XTIT\nCopyDialog.Title=Oldal m\\u00E1sol\\u00E1sa\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=M\\u00E1solja a k\\u00F6vetkez\\u0151t\\: "{0}"?\n#XFLD\nCopyDialog.NewID={0} m\\u00E1solata\n\n#XMSG\nTitle.NoSectionTitle=A(z) {0} szakasz c\\u00EDme \\u00FCres.\n#XMSG\nTitle.UnsufficientRoles=Nem rendelkezik a kell\\u0151 szereppel a megjelen\\u00EDt\\u00E9shez.\n#XMSG\nTitle.VisualizationIsNotVisible=A megjelen\\u00EDt\\u00E9s nem lesz megtekinthet\\u0151.\n#XMSG\nTitle.VisualizationNotNavigateable=A megjelen\\u00EDt\\u00E9s nem tudja az alkalmaz\\u00E1st megnyitni.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Statikus csempe\n#XTIT\nTitle.DynamicTile=Dinamikus csempe\n#XTIT\nTitle.CustomTile=Egy\\u00E9ni csempe\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=Oldal el\\u0151n\\u00E9zete\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=Sajnos az oldal nem tal\\u00E1lhat\\u00F3.\n#XLNK\nErrorPage.Link=Oldalak karbantart\\u00E1sa\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_it.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=Aggiorna pagine valide in tutti i mandanti\n\n#XBUT\nButton.Add=Aggiungi\n#XBUT\nButton.Cancel=Annulla\n#XBUT\nButton.ClosePreview=Chiudi anteprima\n#XBUT\nButton.Copy=Copia\n#XBUT\nButton.Create=Crea\n#XBUT\nButton.Delete=Elimina\n#XBUT\nButton.Edit=Elabora\n#XBUT\nButton.Save=Salva\n#XBUT\nButton.Select=Seleziona\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=Visualizza cataloghi\n#XBUT\nButton.HideCatalogs=Nascondi cataloghi\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Problemi\\: {0}\n#XBUT\nButton.SortCatalogs=Attiva/disattiva ordine di classificazione catalogo\n#XBUT\nButton.CollapseCatalogs=Comprimi tutti i cataloghi\n#XBUT\nButton.ExpandCatalogs=Esplodi tutti i cataloghi\n#XBUT\nButton.ShowDetails=Visualizza dettagli\n#XBUT\nButton.PagePreview=Anteprima pagina\n#XBUT\nButton.ErrorMsg=Messaggi di errore\n#XBUT\nButton.EditHeader=Elabora testata\n#XBUT\nButton.ContextSelector=Seleziona contesto ruolo {0}\n#XBUT\nButton.OverwriteChanges=Sovrascrivi\n#XBUT\nButton.DismissChanges=Chiudi modifiche\n\n#XTOL\nTooltip.AddToSections=Aggiungi a sezioni\n#XTOL: Tooltip for the search button\nTooltip.Search=Ricerca\n#XTOL\nTooltip.SearchForTiles=Cerca tiles\n#XTOL\nTooltip.SearchForRoles=Ricerca ruoli\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Desktop\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=Visualizza impostazioni di classificazione\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=Visualizza impostazioni filtro\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=Visualizza impostazioni gruppo\n\n#XFLD\nLabel.PageID=ID pagina\n#XFLD\nLabel.Title=Titolo\n#XFLD\nLabel.WorkbenchRequest=Richiesta workbench\n#XFLD\nLabel.Package=Pacchetto\n#XFLD\nLabel.TransportInformation=Informazioni trasporto\n#XFLD\nLabel.Details=Dettagli\\:\n#XFLD\nLabel.ResponseCode=Codice risposta\\:\n#XFLD\nLabel.ModifiedBy=Autore modifica\\:\n#XFLD\nLabel.Description=Descrizione\n#XFLD\nLabel.CreatedByFullname=Autore creazione\n#XFLD\nLabel.CreatedOn=Data di creazione\n#XFLD\nLabel.ChangedByFullname=Autore modifica\n#XFLD\nLabel.ChangedOn=Data di modifica\n#XFLD\nLabel.PageTitle=Titolo pagina\n#XFLD\nLabel.AssignedRole=Ruolo attribuito\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Titolo\n#XCOL\nColumn.PageDescription=Descrizione\n#XCOL\nColumn.PageAssignmentStatus=Attribuito a spazio/ruolo\n#XCOL\nColumn.PagePackage=Pacchetto\n#XCOL\nColumn.PageWorkbenchRequest=Richiesta workbench\n#XCOL\nColumn.PageCreatedBy=Autore creazione\n#XCOL\nColumn.PageCreatedOn=Data di creazione\n#XCOL\nColumn.PageChangedBy=Autore modifica\n#XCOL\nColumn.PageChangedOn=Data di modifica\n\n#XTOL\nPlaceholder.SectionName=Inserisci un nome sezione\n#XTOL\nPlaceholder.SearchForTiles=Cerca tiles\n#XTOL\nPlaceholder.SearchForRoles=Ricerca ruoli\n#XTOL\nPlaceholder.CopyPageTitle=Copia di "{0}"\n#XTOL\nPlaceholder.CopyPageID=Copia di "{0}"\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=tutto\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=La sezione {0} non ha tile. Per un\'\'esperienza utente consistente, si consiglia di inserire un nome per ogni sezione.\n#XMSG\nMessage.InvalidSectionTitle=Preferibilmente dovresti inserire un nome sezione.\n#XMSG\nMessage.NoInternetConnection=Controlla la connessione Internet.\n#XMSG\nMessage.SavedChanges=Le modifiche sono state salvate.\n#XMSG\nMessage.InvalidPageID=Utilizza solo i seguenti caratteri\\: A-Z, 0-9, _ e /. L\'ID pagina non dovrebbe iniziare con un numero.\n#XMSG\nMessage.EmptyPageID=Fornisci un ID pagina valido.\n#XMSG\nMessage.EmptyTitle=Fornisci un titolo valido.\n#XMSG\nMessage.NoRoleSelected=Seleziona almeno un ruolo.\n#XMSG\nMessage.SuccessDeletePage=L\'oggetto selezionato \\u00E8 stato eliminato.\n#XMSG\nMessage.ClipboardCopySuccess=I dettagli sono stati copiati correttamente.\n#YMSE\nMessage.ClipboardCopyFail=Errore durante la copia dei dettagli.\n#XMSG\nMessage.PageCreated=La pagina \\u00E8 stata creata.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=Nessun tile\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=Nessun ruolo disponibile.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=Nessun ruolo trovato. Prova a correggere la ricerca.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=Nessuna sezione\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=Il tile {0} non \\u00E8 stato caricato nella sezione "{1}\\u201D.\\n\\n Ci\\u00F2 dipende molto probabilmente da una configurazione errata del contenuto del launchpad di SAP Fiori. La visualizzazione non sar\\u00E0 visibile all\\u2019utente.\n#XMSG\nMessage.NavigationTargetError=La destinazione di navigazione non \\u00E8 stata risolta.\n#XMSG\nMessage.LoadPageError=Impossibile caricare la pagina.\n#XMSG\nMessage.UpdatePageError=Impossibile aggiornare la pagina.\n#XMSG\nMessage.CreatePageError=Impossibile creare la pagina.\n#XMSG\nMessage.TilesHaveErrors=Alcuni dei tile o sezioni hanno degli errori. Continuare ugualmente con il salvataggio?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=Risoluzione fallita della destinazione di navigazione del tile\\: "{0}\\u201D.\\n\\n Ci\\u00F2 dipende molto probabilmente da una configurazione errata del contenuto del launchpad di SAP Fiori. La visualizzazione non pu\\u00F2 aprire un\'\'applicazione.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=Confermare l\'\'eliminazione della sezione "{0}"?\n#XMSG\nMessage.Section.DeleteNoTitle=Confermare l\'eliminazione di questa sezione?\n#XMSG\nMessage.OverwriteChanges=Ci sono state modifiche mentre stavi elaborando la pagina. Sovrascriverle?\n#XMSG\nMessage.OverwriteRemovedPage=La pagina in cui stavi lavorando \\u00E8 stata eliminata da un altro utente. Sovrascrivere tale modifica?\n#XMSG\nMessage.SaveChanges=Salva le modifiche.\n#XMSG\nMessage.NoPages=Nessuna pagina disponibile.\n#XMSG\nMessage.NoPagesFound=Nessuna pagina trovata. Prova a correggere la ricerca.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Contenuto delimitato al contesto ruolo.\n#XMSG\nMessage.NotAssigned=Non attribuito.\n#XMSG\nMessage.StatusAssigned=Attribuito\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=Nuova pagina\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=Seleziona contesto ruolo\n#XTIT\nTitle.TilesHaveErrors=I tile hanno errori\n#XTIT\nDeleteDialog.Title=Elimina\n#XMSG\nDeleteDialog.Text=Confermare l\'eliminazione della pagina selezionata?\n#XBUT\nDeleteDialog.ConfirmButton=Elimina\n#XTIT\nDeleteDialog.LockedTitle=Pagina bloccata\n#XMSG\nDeleteDialog.LockedText=La pagina selezionata \\u00E8 bloccata dall\'\'utente "{0}".\n#XMSG\nDeleteDialog.TransportRequired=Seleziona un pacchetto di trasporto per eliminare la pagina selezionata.\n\n#XMSG\nEditDialog.LockedText=La pagina selezionata \\u00E8 bloccata dall\'\'utente "{0}".\n#XMSG\nEditDialog.TransportRequired=Seleziona un pacchetto di trasporto per elaborare la pagina selezionata.\n#XTIT\nEditDialog.Title=Elabora pagina\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=Questa pagina \\u00E8 stata creata nella lingua "{0}" ma la tua lingua di logon \\u00E8 impostata su "{1}". Modifica la tua lingua di logon su "{0}" per continuare.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Sottotitolo\n#XFLD\nTileInfoPopover.Label.Icon=Icona\n#XFLD\nTileInfoPopover.Label.SemanticObject=Oggetto semantico\n#XFLD\nTileInfoPopover.Label.SemanticAction=Azione semantica\n#XFLD\nTileInfoPopover.Label.FioriID=ID Fiori\n#XFLD\nTileInfoPopover.Label.AppDetail=Dettagli app\n#XFLD\nTileInfoPopover.Label.AppType=Tipo di app\n#XFLD\nTileInfoPopover.Label.TileType=Tipo di tile\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Dispositivi disponibili\n\n#XTIT\nErrorDialog.Title=Errore/i\n\n#XTIT\nConfirmChangesDialog.Title=Mess. avvertimento\n\n#XTIT\nPageOverview.Title=Elabora pagine\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=Layout\n\n#XTIT\nCopyDialog.Title=Copia pagina\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=Copiare "{0}"?\n#XFLD\nCopyDialog.NewID=Copia di "{0}"\n\n#XMSG\nTitle.NoSectionTitle=Il titolo sezione della sezione {0} \\u00E8 vuoto.\n#XMSG\nTitle.UnsufficientRoles=Attribuzione ruoli insufficiente per mostrare la visualizzazione.\n#XMSG\nTitle.VisualizationIsNotVisible=La visualizzazione non sar\\u00E0 visibile.\n#XMSG\nTitle.VisualizationNotNavigateable=La visualizzazione non pu\\u00F2 aprire un\'applicazione.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Tile statico\n#XTIT\nTitle.DynamicTile=Tile dinamico\n#XTIT\nTitle.CustomTile=Tile personalizzato\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=Anteprima pagina\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=Purtroppo la pagina non \\u00E8 stata trovata.\n#XLNK\nErrorPage.Link=Elabora pagine\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_iw.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=\\u05EA\\u05D7\\u05D6\\u05E7 \\u05D3\\u05E4\\u05D9\\u05DD \\u05D1\\u05D9\\u05DF \\u05E1\\u05D1\\u05D9\\u05D1\\u05D5\\u05EA\n\n#XBUT\nButton.Add=\\u05D4\\u05D5\\u05E1\\u05E3\n#XBUT\nButton.Cancel=\\u05D1\\u05D8\\u05DC\n#XBUT\nButton.ClosePreview=\\u05E1\\u05D2\\u05D5\\u05E8 \\u05EA\\u05E6\\u05D5\\u05D2\\u05D4 \\u05DE\\u05E7\\u05D3\\u05D9\\u05DE\\u05D4\n#XBUT\nButton.Copy=\\u05D4\\u05E2\\u05EA\\u05E7\n#XBUT\nButton.Create=\\u05E6\\u05D5\\u05E8\n#XBUT\nButton.Delete=\\u05DE\\u05D7\\u05E7\n#XBUT\nButton.Edit=\\u05E2\\u05E8\\u05D5\\u05DA\n#XBUT\nButton.Save=\\u05E9\\u05DE\\u05D5\\u05E8\n#XBUT\nButton.Select=\\u05D1\\u05D7\\u05E8\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=\\u05D4\\u05E6\\u05D2 \\u05E7\\u05D8\\u05DC\\u05D5\\u05D2\\u05D9\\u05DD\n#XBUT\nButton.HideCatalogs=\\u05D4\\u05E1\\u05EA\\u05E8 \\u05E7\\u05D8\\u05DC\\u05D5\\u05D2\\u05D9\\u05DD\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=\\u05D1\\u05E2\\u05D9\\u05D5\\u05EA\\: {0}\n#XBUT\nButton.SortCatalogs=\\u05D4\\u05D7\\u05DC\\u05E3 \\u05D0\\u05EA \\u05E1\\u05D3\\u05E8 \\u05DE\\u05D9\\u05D5\\u05DF \\u05D4\\u05E7\\u05D8\\u05DC\\u05D5\\u05D2\n#XBUT\nButton.CollapseCatalogs=\\u05E6\\u05DE\\u05E6\\u05DD \\u05D0\\u05EA \\u05DB\\u05DC \\u05D4\\u05E7\\u05D8\\u05DC\\u05D5\\u05D2\\u05D9\\u05DD\n#XBUT\nButton.ExpandCatalogs=\\u05D4\\u05E8\\u05D7\\u05D1 \\u05D0\\u05EA \\u05DB\\u05DC \\u05D4\\u05E7\\u05D8\\u05DC\\u05D5\\u05D2\\u05D9\\u05DD\n#XBUT\nButton.ShowDetails=\\u05D4\\u05E6\\u05D2 \\u05E4\\u05E8\\u05D8\\u05D9\\u05DD\n#XBUT\nButton.PagePreview=\\u05EA\\u05E6\\u05D5\\u05D2\\u05D4 \\u05DE\\u05E7\\u05D3\\u05D9\\u05DE\\u05D4 \\u05E9\\u05DC \\u05D3\\u05E3\n#XBUT\nButton.ErrorMsg=\\u05D4\\u05D5\\u05D3\\u05E2\\u05D5\\u05EA \\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\n#XBUT\nButton.EditHeader=\\u05E2\\u05E8\\u05D5\\u05DA \\u05DB\\u05D5\\u05EA\\u05E8\\u05EA\n#XBUT\nButton.ContextSelector=\\u05D1\\u05D7\\u05E8 \\u05D0\\u05EA \\u05D4\\u05E7\\u05E9\\u05E8 \\u05EA\\u05E4\\u05E7\\u05D9\\u05D3 {0}\n#XBUT\nButton.OverwriteChanges=\\u05E9\\u05DB\\u05EA\\u05D1\n#XBUT\nButton.DismissChanges=\\u05D1\\u05D8\\u05DC \\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD\n\n#XTOL\nTooltip.AddToSections=\\u05D4\\u05D5\\u05E1\\u05E3 \\u05DC\\u05DE\\u05E7\\u05D8\\u05E2\\u05D9\\u05DD\n#XTOL: Tooltip for the search button\nTooltip.Search=\\u05D7\\u05D9\\u05E4\\u05D5\\u05E9\n#XTOL\nTooltip.SearchForTiles=\\u05D7\\u05E4\\u05E9 \\u05D0\\u05E8\\u05D9\\u05D7\\u05D9\\u05DD\n#XTOL\nTooltip.SearchForRoles=\\u05D7\\u05E4\\u05E9 \\u05EA\\u05E4\\u05E7\\u05D9\\u05D3\\u05D9\\u05DD\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=\\u05E9\\u05D5\\u05DC\\u05D7\\u05DF \\u05E2\\u05D1\\u05D5\\u05D3\\u05D4\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=\\u05D4\\u05E6\\u05D2 \\u05D4\\u05D2\\u05D3\\u05E8\\u05D5\\u05EA \\u05DE\\u05D9\\u05D5\\u05DF\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=\\u05D4\\u05E6\\u05D2 \\u05D4\\u05D2\\u05D3\\u05E8\\u05D5\\u05EA \\u05DE\\u05E1\\u05E0\\u05DF\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=\\u05D4\\u05E6\\u05D2 \\u05D4\\u05D2\\u05D3\\u05E8\\u05D5\\u05EA \\u05E7\\u05D1\\u05D5\\u05E6\\u05D4\n\n#XFLD\nLabel.PageID=\\u05D6\\u05D9\\u05D4\\u05D5\\u05D9 \\u05D3\\u05E3\n#XFLD\nLabel.Title=\\u05DB\\u05D5\\u05EA\\u05E8\\u05EA\n#XFLD\nLabel.WorkbenchRequest=\\u05D1\\u05E7\\u05E9\\u05EA Workbench\n#XFLD\nLabel.Package=\\u05D7\\u05D1\\u05D9\\u05DC\\u05D4\n#XFLD\nLabel.TransportInformation=\\u05DE\\u05D9\\u05D3\\u05E2 \\u05E2\\u05DC \\u05D8\\u05E8\\u05E0\\u05E1\\u05E4\\u05D5\\u05E8\\u05D8\n#XFLD\nLabel.Details=\\u05E4\\u05E8\\u05D8\\u05D9\\u05DD\\:\n#XFLD\nLabel.ResponseCode=\\u05E7\\u05D5\\u05D3 \\u05EA\\u05D2\\u05D5\\u05D1\\u05D4\\:\n#XFLD\nLabel.ModifiedBy=\\u05E9\\u05D5\\u05E0\\u05D4 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9\\:\n#XFLD\nLabel.Description=\\u05EA\\u05D9\\u05D0\\u05D5\\u05E8\n#XFLD\nLabel.CreatedByFullname=\\u05E0\\u05D5\\u05E6\\u05E8 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9\n#XFLD\nLabel.CreatedOn=\\u05E0\\u05D5\\u05E6\\u05E8 \\u05D1\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA\n#XFLD\nLabel.ChangedByFullname=\\u05E9\\u05D5\\u05E0\\u05D4 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9\n#XFLD\nLabel.ChangedOn=\\u05E9\\u05D5\\u05E0\\u05D4 \\u05D1\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA\n#XFLD\nLabel.PageTitle=\\u05DB\\u05D5\\u05EA\\u05E8\\u05EA \\u05D3\\u05E3\n#XFLD\nLabel.AssignedRole=\\u05EA\\u05E4\\u05E7\\u05D9\\u05D3 \\u05DE\\u05D5\\u05E7\\u05E6\\u05D4\n\n#XCOL\nColumn.PageID=\\u05D6\\u05D9\\u05D4\\u05D5\\u05D9\n#XCOL\nColumn.PageTitle=\\u05DB\\u05D5\\u05EA\\u05E8\\u05EA\n#XCOL\nColumn.PageDescription=\\u05EA\\u05D9\\u05D0\\u05D5\\u05E8\n#XCOL\nColumn.PageAssignmentStatus=\\u05DE\\u05D5\\u05E7\\u05E6\\u05D4 \\u05DC\\u05DE\\u05E8\\u05D5\\u05D5\\u05D7/\\u05EA\\u05E4\\u05E7\\u05D9\\u05D3\n#XCOL\nColumn.PagePackage=\\u05D7\\u05D1\\u05D9\\u05DC\\u05D4\n#XCOL\nColumn.PageWorkbenchRequest=\\u05D1\\u05E7\\u05E9\\u05EA Workbench\n#XCOL\nColumn.PageCreatedBy=\\u05E0\\u05D5\\u05E6\\u05E8 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9\n#XCOL\nColumn.PageCreatedOn=\\u05E0\\u05D5\\u05E6\\u05E8 \\u05D1\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA\n#XCOL\nColumn.PageChangedBy=\\u05E9\\u05D5\\u05E0\\u05D4 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9\n#XCOL\nColumn.PageChangedOn=\\u05E9\\u05D5\\u05E0\\u05D4 \\u05D1\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA\n\n#XTOL\nPlaceholder.SectionName=\\u05D4\\u05D6\\u05DF \\u05E9\\u05DD \\u05DE\\u05E7\\u05D8\\u05E2\n#XTOL\nPlaceholder.SearchForTiles=\\u05D7\\u05E4\\u05E9 \\u05D0\\u05D7\\u05E8 \\u05D0\\u05E8\\u05D9\\u05D7\\u05D9\\u05DD\n#XTOL\nPlaceholder.SearchForRoles=\\u05D7\\u05E4\\u05E9 \\u05EA\\u05E4\\u05E7\\u05D9\\u05D3\\u05D9\\u05DD\n#XTOL\nPlaceholder.CopyPageTitle=\\u05E2\\u05D5\\u05EA\\u05E7 \\u05E9\\u05DC "{0}"\n#XTOL\nPlaceholder.CopyPageID=\\u05E2\\u05D5\\u05EA\\u05E7 \\u05E9\\u05DC "{0}"\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=\\u05D4\\u05DB\\u05D5\\u05DC\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=\\u05D0\\u05D9\\u05DF \\u05DC\\u05DE\\u05E7\\u05D8\\u05E2 {0} \\u05DB\\u05D5\\u05EA\\u05E8\\u05EA. \\u05DC\\u05D7\\u05D5\\u05D5\\u05D9\\u05D9\\u05EA \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05E2\\u05E7\\u05D1\\u05D9\\u05EA \\u05D0\\u05E0\\u05D5 \\u05DE\\u05DE\\u05DC\\u05D9\\u05E6\\u05D9\\u05DD \\u05DC\\u05D4\\u05D6\\u05D9\\u05DF \\u05E9\\u05DD \\u05DC\\u05DB\\u05DC \\u05DE\\u05E7\\u05D8\\u05E2.\n#XMSG\nMessage.InvalidSectionTitle=\\u05D1\\u05D0\\u05D5\\u05E4\\u05DF \\u05D0\\u05D9\\u05D3\\u05D9\\u05D0\\u05DC\\u05D9 \\u05E2\\u05DC\\u05D9\\u05DA \\u05DC\\u05D4\\u05D6\\u05D9\\u05DF \\u05E9\\u05DD \\u05DE\\u05E7\\u05D8\\u05E2.\n#XMSG\nMessage.NoInternetConnection=\\u05D1\\u05D3\\u05D5\\u05E7 \\u05D0\\u05EA \\u05D7\\u05D9\\u05D1\\u05D5\\u05E8 \\u05D4\\u05D0\\u05D9\\u05E0\\u05D8\\u05E8\\u05E0\\u05D8 \\u05E9\\u05DC\\u05DA.\n#XMSG\nMessage.SavedChanges=\\u05D4\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD \\u05E9\\u05D1\\u05D9\\u05E6\\u05E2\\u05EA \\u05E0\\u05E9\\u05DE\\u05E8\\u05D5.\n#XMSG\nMessage.InvalidPageID=\\u05D4\\u05E9\\u05EA\\u05DE\\u05E9 \\u05E8\\u05E7 \\u05D1\\u05EA\\u05D5\\u05D5\\u05D9\\u05DD \\u05D4\\u05D1\\u05D0\\u05D9\\u05DD\\: A-Z,\\u200F 0-9, _ \\u05D5- /. \\u05D6\\u05D9\\u05D4\\u05D5\\u05D9 \\u05D4\\u05D3\\u05E3 \\u05DC\\u05D0 \\u05D9\\u05DB\\u05D5\\u05DC \\u05DC\\u05D4\\u05EA\\u05D7\\u05D9\\u05DC \\u05E2\\u05DD \\u05DE\\u05E1\\u05E4\\u05E8.\n#XMSG\nMessage.EmptyPageID=\\u05E1\\u05E4\\u05E7 \\u05D6\\u05D9\\u05D4\\u05D5\\u05D9 \\u05D7\\u05D5\\u05E7\\u05D9 \\u05E9\\u05DC \\u05D3\\u05E3.\n#XMSG\nMessage.EmptyTitle=\\u05E1\\u05E4\\u05E7 \\u05DB\\u05D5\\u05EA\\u05E8\\u05EA \\u05D7\\u05D5\\u05E7\\u05D9\\u05EA.\n#XMSG\nMessage.NoRoleSelected=\\u05D1\\u05D7\\u05E8 \\u05EA\\u05E4\\u05E7\\u05D9\\u05D3 \\u05D0\\u05D7\\u05D3 \\u05DC\\u05E4\\u05D7\\u05D5\\u05EA.\n#XMSG\nMessage.SuccessDeletePage=\\u05D4\\u05D0\\u05D5\\u05D1\\u05D9\\u05D9\\u05E7\\u05D8 \\u05E9\\u05E0\\u05D1\\u05D7\\u05E8 \\u05E0\\u05DE\\u05D7\\u05E7.\n#XMSG\nMessage.ClipboardCopySuccess=\\u05E4\\u05E8\\u05D8\\u05D9\\u05DD \\u05D4\\u05D5\\u05E2\\u05EA\\u05E7\\u05D5 \\u05D1\\u05D4\\u05E6\\u05DC\\u05D7\\u05D4.\n#YMSE\nMessage.ClipboardCopyFail=\\u05D0\\u05D9\\u05E8\\u05E2\\u05D4 \\u05E9\\u05D2\\u05D9\\u05D0\\u05D4 \\u05D1\\u05DE\\u05D4\\u05DC\\u05DA \\u05D4\\u05E2\\u05EA\\u05E7\\u05EA \\u05E4\\u05E8\\u05D8\\u05D9\\u05DD.\n#XMSG\nMessage.PageCreated=\\u05D4\\u05D3\\u05E3 \\u05E0\\u05D5\\u05E6\\u05E8.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=\\u05D0\\u05D9\\u05DF \\u05D0\\u05E8\\u05D9\\u05D7\\u05D9\\u05DD\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=\\u05D0\\u05D9\\u05DF \\u05EA\\u05E4\\u05E7\\u05D9\\u05D3\\u05D9\\u05DD \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=\\u05DC\\u05D0 \\u05E0\\u05DE\\u05E6\\u05D0\\u05D5 \\u05EA\\u05E4\\u05E7\\u05D9\\u05D3\\u05D9\\u05DD. \\u05E0\\u05E1\\u05D4 \\u05DC\\u05D4\\u05EA\\u05D0\\u05D9\\u05DD \\u05D0\\u05EA \\u05D4\\u05D7\\u05D9\\u05E4\\u05D5\\u05E9 \\u05E9\\u05DC\\u05DA.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=\\u05D0\\u05D9\\u05DF \\u05DE\\u05E7\\u05D8\\u05E2\\u05D9\\u05DD\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=\\u05D8\\u05E2\\u05D9\\u05E0\\u05EA \\u05D4\\u05D0\\u05E8\\u05D9\\u05D7 {0} \\u05D1\\u05DE\\u05E7\\u05D8\\u05E2 "{1}" \\u05E0\\u05DB\\u05E9\\u05DC\\u05D4.\\n\\n\\u05E1\\u05D1\\u05D9\\u05E8 \\u05DC\\u05D4\\u05E0\\u05D9\\u05D7 \\u05E9\\u05D4\\u05D3\\u05D1\\u05E8 \\u05E0\\u05D2\\u05E8\\u05DD \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 \\u05EA\\u05E6\\u05D5\\u05E8\\u05D4 \\u05E9\\u05D2\\u05D5\\u05D9\\u05D4 \\u05E9\\u05DC \\u05EA\\u05D5\\u05DB\\u05DF \\u05DC\\u05D5\\u05D7 \\u05D4\\u05D4\\u05E4\\u05E2\\u05DC\\u05D4 \\u05E9\\u05DC SAP Fiori. \\u05D4\\u05D4\\u05DE\\u05D7\\u05E9\\u05D4 \\u05D4\\u05D5\\u05D5\\u05D9\\u05D6\\u05D5\\u05D0\\u05DC\\u05D9\\u05EA \\u05EA\\u05D5\\u05E1\\u05EA\\u05E8 \\u05DE\\u05D4\\u05DE\\u05E9\\u05EA\\u05DE\\u05E9.\n#XMSG\nMessage.NavigationTargetError=\\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05E7\\u05D1\\u05D5\\u05E2 \\u05D9\\u05E2\\u05D3 \\u05E0\\u05D9\\u05D5\\u05D5\\u05D8.\n#XMSG\nMessage.LoadPageError=\\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05D8\\u05E2\\u05D5\\u05DF \\u05D0\\u05EA \\u05D4\\u05D3\\u05E3.\n#XMSG\nMessage.UpdatePageError=\\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05E2\\u05D3\\u05DB\\u05DF \\u05D0\\u05EA \\u05D4\\u05D3\\u05E3.\n#XMSG\nMessage.CreatePageError=\\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05D9\\u05E6\\u05D5\\u05E8 \\u05D0\\u05EA \\u05D4\\u05D3\\u05E3.\n#XMSG\nMessage.TilesHaveErrors=\\u05D7\\u05DC\\u05E7 \\u05DE\\u05D4\\u05D0\\u05E8\\u05D9\\u05D7\\u05D9\\u05DD \\u05D0\\u05D5 \\u05DE\\u05D4\\u05DE\\u05E7\\u05D8\\u05E2\\u05D9\\u05DD \\u05DE\\u05DB\\u05D9\\u05DC\\u05D9\\u05DD \\u05E9\\u05D2\\u05D9\\u05D0\\u05D5\\u05EA. \\u05D4\\u05D0\\u05DD \\u05D0\\u05EA\\u05D4 \\u05D1\\u05D8\\u05D5\\u05D7 \\u05E9\\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05D4\\u05DE\\u05E9\\u05D9\\u05DA \\u05D1\\u05EA\\u05D4\\u05DC\\u05D9\\u05DA \\u05D4\\u05E9\\u05DE\\u05D9\\u05E8\\u05D4?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=\\u05E7\\u05D1\\u05D9\\u05E2\\u05EA \\u05D9\\u05E2\\u05D3 \\u05D4\\u05E0\\u05D9\\u05D5\\u05D5\\u05D8 \\u05E9\\u05DC \\u05D4\\u05D0\\u05E8\\u05D9\\u05D7 \\u05E0\\u05DB\\u05E9\\u05DC\\u05D4\\: "{0}".\\n\\n\\u05E1\\u05D1\\u05D9\\u05E8 \\u05DC\\u05D4\\u05E0\\u05D9\\u05D7 \\u05E9\\u05D4\\u05D3\\u05D1\\u05E8 \\u05E0\\u05D2\\u05E8\\u05DD \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 \\u05EA\\u05E6\\u05D5\\u05E8\\u05D4 \\u05E9\\u05D2\\u05D5\\u05D9\\u05D4 \\u05E9\\u05DC \\u05EA\\u05D5\\u05DB\\u05DF \\u05DC\\u05D5\\u05D7 \\u05D4\\u05E4\\u05E2\\u05DC\\u05D4 \\u05E9\\u05DC SAP Fiori. \\u05D4\\u05D4\\u05DE\\u05D7\\u05E9\\u05D4 \\u05D4\\u05D5\\u05D5\\u05D9\\u05D6\\u05D5\\u05D0\\u05DC\\u05D9\\u05EA \\u05DC\\u05D0 \\u05D9\\u05DB\\u05D5\\u05DC\\u05D4 \\u05DC\\u05E4\\u05EA\\u05D5\\u05D7 \\u05D9\\u05D9\\u05E9\\u05D5\\u05DD.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=\\u05D4\\u05D0\\u05DD \\u05D0\\u05EA\\u05D4 \\u05D1\\u05D8\\u05D5\\u05D7 \\u05E9\\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05DE\\u05D7\\u05D5\\u05E7 \\u05D0\\u05EA \\u05D4\\u05DE\\u05E7\\u05D8\\u05E2 "{0}"?\n#XMSG\nMessage.Section.DeleteNoTitle=\\u05D4\\u05D0\\u05DD \\u05D0\\u05EA\\u05D4 \\u05D1\\u05D8\\u05D5\\u05D7 \\u05E9\\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05DE\\u05D7\\u05D5\\u05E7 \\u05D0\\u05EA \\u05D4\\u05DE\\u05E7\\u05D8\\u05E2 \\u05D6\\u05D4?\n#XMSG\nMessage.OverwriteChanges=\\u05D1\\u05D5\\u05E6\\u05E2\\u05D5 \\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD \\u05D1\\u05D6\\u05DE\\u05DF \\u05E9\\u05E2\\u05E8\\u05DB\\u05EA \\u05D0\\u05EA \\u05D4\\u05D3\\u05E3. \\u05D4\\u05D0\\u05DD \\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05E9\\u05DB\\u05EA\\u05D1 \\u05D0\\u05D5\\u05EA\\u05DD?\n#XMSG\nMessage.OverwriteRemovedPage=\\u05D4\\u05D3\\u05E3 \\u05E9\\u05D0\\u05EA\\u05D4 \\u05E2\\u05D5\\u05D1\\u05D3 \\u05E2\\u05DC\\u05D9\\u05D5 \\u05E0\\u05DE\\u05D7\\u05E7 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 \\u05D0\\u05D7\\u05E8. \\u05D4\\u05D0\\u05DD \\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05E9\\u05DB\\u05EA\\u05D1 \\u05D0\\u05EA \\u05D4\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9 \\u05D4\\u05D6\\u05D4?\n#XMSG\nMessage.SaveChanges=\\u05E9\\u05DE\\u05D5\\u05E8 \\u05D0\\u05EA \\u05D4\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD.\n#XMSG\nMessage.NoPages=\\u05D0\\u05D9\\u05DF \\u05D3\\u05E4\\u05D9\\u05DD \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD.\n#XMSG\nMessage.NoPagesFound=\\u05DC\\u05D0 \\u05E0\\u05DE\\u05E6\\u05D0\\u05D5 \\u05D3\\u05E4\\u05D9\\u05DD. \\u05E0\\u05E1\\u05D4 \\u05DC\\u05D4\\u05EA\\u05D0\\u05D9\\u05DD \\u05D0\\u05EA \\u05D4\\u05D7\\u05D9\\u05E4\\u05D5\\u05E9 \\u05E9\\u05DC\\u05DA.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=\\u05D4\\u05D4\\u05E7\\u05E9\\u05E8 \\u05DE\\u05D5\\u05D2\\u05D1\\u05DC \\u05DC\\u05D4\\u05E7\\u05E9\\u05E8 \\u05D4\\u05EA\\u05E4\\u05E7\\u05D9\\u05D3.\n#XMSG\nMessage.NotAssigned=\\u05DC\\u05D0 \\u05D4\\u05D5\\u05E7\\u05E6\\u05D4.\n#XMSG\nMessage.StatusAssigned=\\u05D4\\u05D5\\u05E7\\u05E6\\u05D4\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=\\u05D3\\u05E3 \\u05D7\\u05D3\\u05E9\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=\\u05D1\\u05D7\\u05E8 \\u05D4\\u05E7\\u05E9\\u05E8 \\u05EA\\u05E4\\u05E7\\u05D9\\u05D3\n#XTIT\nTitle.TilesHaveErrors=\\u05D9\\u05E9 \\u05D1\\u05D0\\u05E8\\u05D9\\u05D7\\u05D9\\u05DD \\u05E9\\u05D2\\u05D9\\u05D0\\u05D5\\u05EA\n#XTIT\nDeleteDialog.Title=\\u05DE\\u05D7\\u05E7\n#XMSG\nDeleteDialog.Text=\\u05D4\\u05D0\\u05DD \\u05D0\\u05EA\\u05D4 \\u05D1\\u05D8\\u05D5\\u05D7 \\u05E9\\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05DE\\u05D7\\u05D5\\u05E7 \\u05D0\\u05EA \\u05D4\\u05D3\\u05E3 \\u05E9\\u05E0\\u05D1\\u05D7\\u05E8?\n#XBUT\nDeleteDialog.ConfirmButton=\\u05DE\\u05D7\\u05E7\n#XTIT\nDeleteDialog.LockedTitle=\\u05D4\\u05D3\\u05E3 \\u05E0\\u05E2\\u05D5\\u05DC\n#XMSG\nDeleteDialog.LockedText=\\u05D4\\u05D3\\u05E3 \\u05E9\\u05E0\\u05D1\\u05D7\\u05E8 \\u05E0\\u05E0\\u05E2\\u05DC \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 "{0}".\n#XMSG\nDeleteDialog.TransportRequired=\\u05D1\\u05D7\\u05E8 \\u05D7\\u05D1\\u05D9\\u05DC\\u05EA \\u05D8\\u05E8\\u05E0\\u05E1\\u05E4\\u05D5\\u05E8\\u05D8 \\u05DC\\u05DE\\u05D7\\u05D9\\u05E7\\u05EA \\u05D4\\u05D3\\u05E3 \\u05D4\\u05E0\\u05D1\\u05D7\\u05E8.\n\n#XMSG\nEditDialog.LockedText=\\u05D4\\u05D3\\u05E3 \\u05E9\\u05E0\\u05D1\\u05D7\\u05E8 \\u05E0\\u05E0\\u05E2\\u05DC \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 "{0}".\n#XMSG\nEditDialog.TransportRequired=\\u05D1\\u05D7\\u05E8 \\u05D7\\u05D1\\u05D9\\u05DC\\u05EA \\u05D8\\u05E8\\u05E0\\u05E1\\u05E4\\u05D5\\u05E8\\u05D8 \\u05DC\\u05E2\\u05E8\\u05D9\\u05DB\\u05EA \\u05D4\\u05D3\\u05E3 \\u05D4\\u05E0\\u05D1\\u05D7\\u05E8.\n#XTIT\nEditDialog.Title=\\u05E2\\u05E8\\u05D5\\u05DA \\u05D3\\u05E3\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=\\u05D3\\u05E3 \\u05D6\\u05D4 \\u05E0\\u05D5\\u05E6\\u05E8 \\u05D1\\u05E9\\u05E4\\u05D4 \'\'{0}\'\', \\u05D0\\u05E3 \\u05E9\\u05E4\\u05EA \\u05D4\\u05DB\\u05E0\\u05D9\\u05E1\\u05D4 \\u05DC\\u05DE\\u05E2\\u05E8\\u05DB\\u05EA \\u05DE\\u05D5\\u05D2\\u05D3\\u05E8\\u05EA \\u05DB-\'\'{1}\'\'. \\u05E9\\u05E0\\u05D4 \\u05D0\\u05EA \\u05E9\\u05E4\\u05EA \\u05D4\\u05DB\\u05E0\\u05D9\\u05E1\\u05D4 \\u05DC\\u05DE\\u05E2\\u05E8\\u05DB\\u05EA \\u05DC-\'\'{0}\'\' \\u05DB\\u05D3\\u05D9 \\u05DC\\u05D4\\u05DE\\u05E9\\u05D9\\u05DA.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=\\u05DB\\u05D5\\u05EA\\u05E8\\u05EA \\u05DE\\u05E9\\u05E0\\u05D4\n#XFLD\nTileInfoPopover.Label.Icon=\\u05E1\\u05DE\\u05DC\n#XFLD\nTileInfoPopover.Label.SemanticObject=\\u05D0\\u05D5\\u05D1\\u05D9\\u05D9\\u05E7\\u05D8 \\u05E1\\u05DE\\u05E0\\u05D8\\u05D9\n#XFLD\nTileInfoPopover.Label.SemanticAction=\\u05E4\\u05E2\\u05D5\\u05DC\\u05D4 \\u05E1\\u05DE\\u05E0\\u05D8\\u05D9\\u05EA\n#XFLD\nTileInfoPopover.Label.FioriID=\\u05D6\\u05D9\\u05D4\\u05D5\\u05D9 Fiori\n#XFLD\nTileInfoPopover.Label.AppDetail=\\u05E4\\u05E8\\u05D8 \\u05E9\\u05DC \\u05D9\\u05D9\\u05E9\\u05D5\\u05DD\n#XFLD\nTileInfoPopover.Label.AppType=\\u05E1\\u05D5\\u05D2 \\u05D9\\u05D9\\u05E9\\u05D5\\u05DD\n#XFLD\nTileInfoPopover.Label.TileType=\\u05E1\\u05D5\\u05D2 \\u05D0\\u05E8\\u05D9\\u05D7\n#XFLD\nTileInfoPopover.Label.AvailableDevices=\\u05D4\\u05EA\\u05E7\\u05E0\\u05D9\\u05DD \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD\n\n#XTIT\nErrorDialog.Title=\\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\n\n#XTIT\nConfirmChangesDialog.Title=\\u05D0\\u05D6\\u05D4\\u05E8\\u05D4\n\n#XTIT\nPageOverview.Title=\\u05EA\\u05D7\\u05D6\\u05E7 \\u05D3\\u05E4\\u05D9\\u05DD\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=\\u05E4\\u05E8\\u05D9\\u05E1\\u05D4\n\n#XTIT\nCopyDialog.Title=\\u05D4\\u05E2\\u05EA\\u05E7 \\u05D3\\u05E3\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=\\u05D4\\u05D0\\u05DD \\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05D4\\u05E2\\u05EA\\u05D9\\u05E7 \\u05D0\\u05EA "{0}"?\n#XFLD\nCopyDialog.NewID=\\u05E2\\u05D5\\u05EA\\u05E7 \\u05E9\\u05DC "{0}"\n\n#XMSG\nTitle.NoSectionTitle=\\u05DB\\u05D5\\u05EA\\u05E8\\u05EA \\u05DE\\u05E7\\u05D8\\u05E2 \\u05E9\\u05DC \\u05DE\\u05E7\\u05D8\\u05E2 {0} \\u05E8\\u05D9\\u05E7\\u05D4.\n#XMSG\nTitle.UnsufficientRoles=\\u05D4\\u05E7\\u05E6\\u05D0\\u05EA \\u05EA\\u05E4\\u05E7\\u05D9\\u05D3 \\u05DC\\u05D0 \\u05DE\\u05E1\\u05E4\\u05D9\\u05E7\\u05D4 \\u05DC\\u05D4\\u05E6\\u05D2\\u05EA \\u05D4\\u05D4\\u05DE\\u05D7\\u05E9\\u05D4 \\u05D4\\u05D5\\u05D5\\u05D9\\u05D6\\u05D5\\u05D0\\u05DC\\u05D9\\u05EA.\n#XMSG\nTitle.VisualizationIsNotVisible=\\u05D4\\u05D4\\u05DE\\u05D7\\u05E9\\u05D4 \\u05D4\\u05D5\\u05D5\\u05D9\\u05D6\\u05D5\\u05D0\\u05DC\\u05D9\\u05EA \\u05DC\\u05D0 \\u05EA\\u05D5\\u05E4\\u05D9\\u05E2.\n#XMSG\nTitle.VisualizationNotNavigateable=\\u05D4\\u05D4\\u05DE\\u05D7\\u05E9\\u05D4 \\u05D4\\u05D5\\u05D5\\u05D9\\u05D6\\u05D5\\u05D0\\u05DC\\u05D9\\u05EA \\u05DC\\u05D0 \\u05D9\\u05DB\\u05D5\\u05DC\\u05D4 \\u05DC\\u05E4\\u05EA\\u05D5\\u05D7 \\u05D9\\u05D9\\u05E9\\u05D5\\u05DD.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=\\u05D0\\u05E8\\u05D9\\u05D7 \\u05E1\\u05D8\\u05D8\\u05D9\n#XTIT\nTitle.DynamicTile=\\u05D0\\u05E8\\u05D9\\u05D7 \\u05D3\\u05D9\\u05E0\\u05DE\\u05D9\n#XTIT\nTitle.CustomTile=\\u05D0\\u05E8\\u05D9\\u05D7 \\u05DE\\u05D5\\u05EA\\u05D0\\u05DD \\u05D0\\u05D9\\u05E9\\u05D9\\u05EA\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=\\u05EA\\u05E6\\u05D5\\u05D2\\u05D4 \\u05DE\\u05E7\\u05D3\\u05D9\\u05DE\\u05D4 \\u05E9\\u05DC \\u05D3\\u05E3\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=\\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05DE\\u05E6\\u05D5\\u05D0 \\u05D3\\u05E3 \\u05D6\\u05D4.\n#XLNK\nErrorPage.Link=\\u05EA\\u05D7\\u05D6\\u05E7 \\u05D3\\u05E4\\u05D9\\u05DD\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_ja.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=\\u30AF\\u30E9\\u30A4\\u30A2\\u30F3\\u30C8\\u9593\\u306E\\u30DA\\u30FC\\u30B8\\u66F4\\u65B0\n\n#XBUT\nButton.Add=\\u8FFD\\u52A0\n#XBUT\nButton.Cancel=\\u4E2D\\u6B62\n#XBUT\nButton.ClosePreview=\\u30D7\\u30EC\\u30D3\\u30E5\\u30FC\\u7D42\\u4E86\n#XBUT\nButton.Copy=\\u30B3\\u30D4\\u30FC\n#XBUT\nButton.Create=\\u4F5C\\u6210\n#XBUT\nButton.Delete=\\u524A\\u9664\n#XBUT\nButton.Edit=\\u7DE8\\u96C6\n#XBUT\nButton.Save=\\u4FDD\\u5B58\n#XBUT\nButton.Select=\\u9078\\u629E\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=\\u30AB\\u30BF\\u30ED\\u30B0\\u8868\\u793A\n#XBUT\nButton.HideCatalogs=\\u30AB\\u30BF\\u30ED\\u30B0\\u975E\\u8868\\u793A\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=\\u554F\\u984C\\: {0}\n#XBUT\nButton.SortCatalogs=\\u30AB\\u30BF\\u30ED\\u30B0\\u30BD\\u30FC\\u30C8\\u9806\\u5E8F\\u306E\\u5207\\u66FF\n#XBUT\nButton.CollapseCatalogs=\\u3059\\u3079\\u3066\\u306E\\u30AB\\u30BF\\u30ED\\u30B0\\u3092\\u6298\\u308A\\u305F\\u305F\\u307F\n#XBUT\nButton.ExpandCatalogs=\\u3059\\u3079\\u3066\\u306E\\u30AB\\u30BF\\u30ED\\u30B0\\u3092\\u5C55\\u958B\n#XBUT\nButton.ShowDetails=\\u8A73\\u7D30\\u8868\\u793A\n#XBUT\nButton.PagePreview=\\u30DA\\u30FC\\u30B8\\u30D7\\u30EC\\u30D3\\u30E5\\u30FC\n#XBUT\nButton.ErrorMsg=\\u30A8\\u30E9\\u30FC\\u30E1\\u30C3\\u30BB\\u30FC\\u30B8\n#XBUT\nButton.EditHeader=\\u30D8\\u30C3\\u30C0\\u7DE8\\u96C6\n#XBUT\nButton.ContextSelector=\\u30ED\\u30FC\\u30EB\\u30B3\\u30F3\\u30C6\\u30AD\\u30B9\\u30C8 {0} \\u3092\\u9078\\u629E\n#XBUT\nButton.OverwriteChanges=\\u4E0A\\u66F8\\u304D\n#XBUT\nButton.DismissChanges=\\u5909\\u66F4\\u3092\\u7834\\u68C4\n\n#XTOL\nTooltip.AddToSections=\\u30BB\\u30AF\\u30B7\\u30E7\\u30F3\\u306B\\u8FFD\\u52A0\n#XTOL: Tooltip for the search button\nTooltip.Search=\\u691C\\u7D22\n#XTOL\nTooltip.SearchForTiles=\\u30BF\\u30A4\\u30EB\\u691C\\u7D22\n#XTOL\nTooltip.SearchForRoles=\\u30ED\\u30FC\\u30EB\\u691C\\u7D22\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=\\u30C7\\u30B9\\u30AF\\u30C8\\u30C3\\u30D7\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=\\u30BD\\u30FC\\u30C8\\u8A2D\\u5B9A\\u306E\\u8868\\u793A\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=\\u30D5\\u30A3\\u30EB\\u30BF\\u8A2D\\u5B9A\\u306E\\u8868\\u793A\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=\\u30B0\\u30EB\\u30FC\\u30D7\\u8A2D\\u5B9A\\u306E\\u8868\\u793A\n\n#XFLD\nLabel.PageID=\\u30DA\\u30FC\\u30B8 ID\n#XFLD\nLabel.Title=\\u30BF\\u30A4\\u30C8\\u30EB\n#XFLD\nLabel.WorkbenchRequest=\\u30EF\\u30FC\\u30AF\\u30D9\\u30F3\\u30C1\\u4F9D\\u983C\n#XFLD\nLabel.Package=\\u30D1\\u30C3\\u30B1\\u30FC\\u30B8\n#XFLD\nLabel.TransportInformation=\\u79FB\\u9001\\u60C5\\u5831\n#XFLD\nLabel.Details=\\u8A73\\u7D30\\:\n#XFLD\nLabel.ResponseCode=\\u5FDC\\u7B54\\u30B3\\u30FC\\u30C9\\:\n#XFLD\nLabel.ModifiedBy=\\u5909\\u66F4\\u8005\\:\n#XFLD\nLabel.Description=\\u8AAC\\u660E\n#XFLD\nLabel.CreatedByFullname=\\u4F5C\\u6210\\u8005\n#XFLD\nLabel.CreatedOn=\\u4F5C\\u6210\\u6642\\u9593\n#XFLD\nLabel.ChangedByFullname=\\u5909\\u66F4\\u8005\n#XFLD\nLabel.ChangedOn=\\u5909\\u66F4\\u65E5\\u4ED8\n#XFLD\nLabel.PageTitle=\\u30DA\\u30FC\\u30B8\\u30BF\\u30A4\\u30C8\\u30EB\n#XFLD\nLabel.AssignedRole=\\u5272\\u308A\\u5F53\\u3066\\u3089\\u308C\\u305F\\u30ED\\u30FC\\u30EB\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=\\u30BF\\u30A4\\u30C8\\u30EB\n#XCOL\nColumn.PageDescription=\\u8AAC\\u660E\n#XCOL\nColumn.PageAssignmentStatus=\\u9818\\u57DF/\\u30ED\\u30FC\\u30EB\\u306B\\u5272\\u5F53\\u6E08\n#XCOL\nColumn.PagePackage=\\u30D1\\u30C3\\u30B1\\u30FC\\u30B8\n#XCOL\nColumn.PageWorkbenchRequest=\\u30EF\\u30FC\\u30AF\\u30D9\\u30F3\\u30C1\\u4F9D\\u983C\n#XCOL\nColumn.PageCreatedBy=\\u4F5C\\u6210\\u8005\n#XCOL\nColumn.PageCreatedOn=\\u4F5C\\u6210\\u6642\\u9593\n#XCOL\nColumn.PageChangedBy=\\u5909\\u66F4\\u8005\n#XCOL\nColumn.PageChangedOn=\\u5909\\u66F4\\u65E5\\u4ED8\n\n#XTOL\nPlaceholder.SectionName=\\u30BB\\u30AF\\u30B7\\u30E7\\u30F3\\u540D\\u3092\\u5165\\u529B\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\n#XTOL\nPlaceholder.SearchForTiles=\\u30BF\\u30A4\\u30EB\\u691C\\u7D22\n#XTOL\nPlaceholder.SearchForRoles=\\u30ED\\u30FC\\u30EB\\u691C\\u7D22\n#XTOL\nPlaceholder.CopyPageTitle="{0}" \\u306E\\u30B3\\u30D4\\u30FC\n#XTOL\nPlaceholder.CopyPageID="{0}" \\u306E\\u30B3\\u30D4\\u30FC\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=\\u3059\\u3079\\u3066\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=\\u30BB\\u30AF\\u30B7\\u30E7\\u30F3 {0} \\u306B\\u306F\\u30BF\\u30A4\\u30C8\\u30EB\\u306F\\u3042\\u308A\\u307E\\u305B\\u3093\\u3002\\u30E6\\u30FC\\u30B6\\u30A8\\u30AF\\u30B9\\u30DA\\u30EA\\u30A8\\u30F3\\u30B9\\u306E\\u4E00\\u8CAB\\u6027\\u3092\\u4FDD\\u3064\\u305F\\u3081\\u306B\\u3001\\u5404\\u30BB\\u30AF\\u30B7\\u30E7\\u30F3\\u306E\\u540D\\u524D\\u3092\\u5165\\u529B\\u3059\\u308B\\u3053\\u3068\\u3092\\u304A\\u5968\\u3081\\u3057\\u307E\\u3059\\u3002\n#XMSG\nMessage.InvalidSectionTitle=\\u53EF\\u80FD\\u3067\\u3042\\u308C\\u3070\\u3001\\u30BB\\u30AF\\u30B7\\u30E7\\u30F3\\u540D\\u3092\\u5165\\u529B\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\n#XMSG\nMessage.NoInternetConnection=\\u30A4\\u30F3\\u30BF\\u30FC\\u30CD\\u30C3\\u30C8\\u63A5\\u7D9A\\u3092\\u30C1\\u30A7\\u30C3\\u30AF\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\n#XMSG\nMessage.SavedChanges=\\u5909\\u66F4\\u304C\\u4FDD\\u5B58\\u3055\\u308C\\u307E\\u3057\\u305F\\u3002\n#XMSG\nMessage.InvalidPageID=A-Z\\u30010-9\\u3001_ \\u304A\\u3088\\u3073 / \\u306E\\u6587\\u5B57\\u306E\\u307F\\u4F7F\\u7528\\u3057\\u3066\\u304F\\u3060\\u3002\\u30DA\\u30FC\\u30B8 ID \\u306E\\u5148\\u982D\\u306B\\u306F\\u6570\\u5B57\\u3092\\u4F7F\\u7528\\u3057\\u306A\\u3044\\u3067\\u304F\\u3060\\u3055\\u3044\\u3002\n#XMSG\nMessage.EmptyPageID=\\u6709\\u52B9\\u306A\\u30DA\\u30FC\\u30B8 ID \\u3092\\u6307\\u5B9A\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\n#XMSG\nMessage.EmptyTitle=\\u6709\\u52B9\\u306A\\u30BF\\u30A4\\u30C8\\u30EB\\u3092\\u6307\\u5B9A\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\n#XMSG\nMessage.NoRoleSelected=\\u5C11\\u306A\\u304F\\u3068\\u3082 1 \\u3064\\u306E\\u30ED\\u30FC\\u30EB\\u3092\\u9078\\u629E\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\n#XMSG\nMessage.SuccessDeletePage=\\u9078\\u629E\\u3057\\u305F\\u30AA\\u30D6\\u30B8\\u30A7\\u30AF\\u30C8\\u304C\\u524A\\u9664\\u3055\\u308C\\u307E\\u3057\\u305F\n#XMSG\nMessage.ClipboardCopySuccess=\\u8A73\\u7D30\\u304C\\u6B63\\u5E38\\u306B\\u30B3\\u30D4\\u30FC\\u3055\\u308C\\u307E\\u3057\\u305F\\u3002\n#YMSE\nMessage.ClipboardCopyFail=\\u8A73\\u7D30\\u306E\\u30B3\\u30D4\\u30FC\\u4E2D\\u306B\\u30A8\\u30E9\\u30FC\\u304C\\u767A\\u751F\\u3057\\u307E\\u3057\\u305F\\u3002\n#XMSG\nMessage.PageCreated=\\u30DA\\u30FC\\u30B8\\u304C\\u4F5C\\u6210\\u3055\\u308C\\u307E\\u3057\\u305F\\u3002\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=\\u30BF\\u30A4\\u30EB\\u304C\\u3042\\u308A\\u307E\\u305B\\u3093\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=\\u30ED\\u30FC\\u30EB\\u304C\\u3042\\u308A\\u307E\\u305B\\u3093\\u3002\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=\\u30ED\\u30FC\\u30EB\\u304C\\u898B\\u3064\\u304B\\u308A\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\\u3002\\u691C\\u7D22\\u3092\\u8ABF\\u6574\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=\\u30BB\\u30AF\\u30B7\\u30E7\\u30F3\\u304C\\u3042\\u308A\\u307E\\u305B\\u3093\\u3002\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError={0} \\u30BF\\u30A4\\u30EB\\u3092 "{1}" \\u30BB\\u30AF\\u30B7\\u30E7\\u30F3\\u306B\\u30ED\\u30FC\\u30C9\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\\u3002\\n\\n\\u3053\\u308C\\u306F\\u3001SAP Fiori \\u30E9\\u30A6\\u30F3\\u30C1\\u30D1\\u30C3\\u30C9\\u30B3\\u30F3\\u30C6\\u30F3\\u30C4\\u306E\\u8A2D\\u5B9A\\u304C\\u4E0D\\u9069\\u5207\\u306A\\u5834\\u5408\\u306B\\u6700\\u3082\\u767A\\u751F\\u3057\\u307E\\u3059\\u3002\\u30E6\\u30FC\\u30B6\\u306B\\u30D3\\u30B8\\u30E5\\u30A2\\u30EB\\u5316\\u306E\\u7D50\\u679C\\u306F\\u8868\\u793A\\u3055\\u308C\\u307E\\u305B\\u3093\\u3002\n#XMSG\nMessage.NavigationTargetError=\\u30CA\\u30D3\\u30B2\\u30FC\\u30B7\\u30E7\\u30F3\\u30BF\\u30FC\\u30B2\\u30C3\\u30C8\\u3092\\u89E3\\u6790\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\\u3002\n#XMSG\nMessage.LoadPageError=\\u30DA\\u30FC\\u30B8\\u3092\\u30ED\\u30FC\\u30C9\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\\u3002\n#XMSG\nMessage.UpdatePageError=\\u30DA\\u30FC\\u30B8\\u3092\\u66F4\\u65B0\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\\u3002\n#XMSG\nMessage.CreatePageError=\\u30DA\\u30FC\\u30B8\\u3092\\u767B\\u9332\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\\u3002\n#XMSG\nMessage.TilesHaveErrors=\\u4E00\\u90E8\\u306E\\u30BF\\u30A4\\u30EB\\u307E\\u305F\\u306F\\u30BB\\u30AF\\u30B7\\u30E7\\u30F3\\u306B\\u30A8\\u30E9\\u30FC\\u304C\\u3042\\u308A\\u307E\\u3059\\u3002\\u4FDD\\u5B58\\u3092\\u7D9A\\u884C\\u3057\\u307E\\u3059\\u304B?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=\\u30BF\\u30A4\\u30EB "{0}" \\u306E\\u30CA\\u30D3\\u30B2\\u30FC\\u30B7\\u30E7\\u30F3\\u30BF\\u30FC\\u30B2\\u30C3\\u30C8\\u3092\\u89E3\\u6790\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\\u3002\\n\\n\\u3053\\u308C\\u306F\\u3001SAP Fiori \\u30E9\\u30A6\\u30F3\\u30C1\\u30D1\\u30C3\\u30C9\\u30B3\\u30F3\\u30C6\\u30F3\\u30C4\\u306E\\u8A2D\\u5B9A\\u304C\\u7121\\u52B9\\u306A\\u5834\\u5408\\u306B\\u6700\\u3082\\u767A\\u751F\\u3057\\u307E\\u3059\\u3002\\u30D3\\u30B8\\u30E5\\u30A2\\u30EB\\u5316\\u3067\\u30A2\\u30D7\\u30EA\\u30B1\\u30FC\\u30B7\\u30E7\\u30F3\\u3092\\u958B\\u3051\\u307E\\u305B\\u3093\\u3002\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=\\u30BB\\u30AF\\u30B7\\u30E7\\u30F3 "{0}" \\u3092\\u524A\\u9664\\u3057\\u3066\\u3082\\u3088\\u308D\\u3057\\u3044\\u3067\\u3059\\u304B\\u3002\n#XMSG\nMessage.Section.DeleteNoTitle=\\u3053\\u306E\\u30BB\\u30AF\\u30B7\\u30E7\\u30F3\\u3092\\u524A\\u9664\\u3057\\u3066\\u3082\\u3088\\u308D\\u3057\\u3044\\u3067\\u3059\\u304B\\u3002\n#XMSG\nMessage.OverwriteChanges=\\u30DA\\u30FC\\u30B8\\u306E\\u7DE8\\u96C6\\u4E2D\\u306B\\u5909\\u66F4\\u304C\\u884C\\u308F\\u308C\\u3066\\u3044\\u307E\\u3059\\u3002\\u3053\\u308C\\u3089\\u306E\\u5909\\u66F4\\u3092\\u4E0A\\u66F8\\u304D\\u3057\\u307E\\u3059\\u304B\\u3002\n#XMSG\nMessage.OverwriteRemovedPage=\\u4F5C\\u696D\\u4E2D\\u306E\\u30DA\\u30FC\\u30B8\\u306F\\u5225\\u306E\\u30E6\\u30FC\\u30B6\\u306B\\u3088\\u3063\\u3066\\u524A\\u9664\\u3055\\u308C\\u3066\\u3044\\u307E\\u3059\\u3002\\u3053\\u306E\\u5909\\u66F4\\u3092\\u4E0A\\u66F8\\u304D\\u3057\\u307E\\u3059\\u304B\\u3002\n#XMSG\nMessage.SaveChanges=\\u5909\\u66F4\\u3092\\u4FDD\\u5B58\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\n#XMSG\nMessage.NoPages=\\u5229\\u7528\\u3067\\u304D\\u308B\\u30DA\\u30FC\\u30B8\\u304C\\u3042\\u308A\\u307E\\u305B\\u3093\\u3002\n#XMSG\nMessage.NoPagesFound=\\u30DA\\u30FC\\u30B8\\u304C\\u898B\\u3064\\u304B\\u308A\\u307E\\u305B\\u3093\\u3002\\u691C\\u7D22\\u306E\\u8ABF\\u6574\\u3092\\u8A66\\u884C\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=\\u30B3\\u30F3\\u30C6\\u30F3\\u30C4\\u306F\\u30ED\\u30FC\\u30EB\\u30B3\\u30F3\\u30C6\\u30AD\\u30B9\\u30C8\\u306B\\u5236\\u9650\\u3055\\u308C\\u3066\\u3044\\u307E\\u3059\\u3002\n#XMSG\nMessage.NotAssigned=\\u5272\\u308A\\u5F53\\u3066\\u3089\\u308C\\u3066\\u3044\\u307E\\u305B\\u3093\\u3002\n#XMSG\nMessage.StatusAssigned=\\u5272\\u5F53\\u6E08\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=\\u65B0\\u898F\\u30DA\\u30FC\\u30B8\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=\\u30ED\\u30FC\\u30EB\\u30B3\\u30F3\\u30C6\\u30AD\\u30B9\\u30C8\\u3092\\u9078\\u629E\n#XTIT\nTitle.TilesHaveErrors=\\u30BF\\u30A4\\u30EB\\u306B\\u30A8\\u30E9\\u30FC\\u304C\\u3042\\u308A\\u307E\\u3059\n#XTIT\nDeleteDialog.Title=\\u524A\\u9664\n#XMSG\nDeleteDialog.Text=\\u9078\\u629E\\u3057\\u305F\\u30DA\\u30FC\\u30B8\\u3092\\u524A\\u9664\\u3057\\u307E\\u3059\\u304B?\n#XBUT\nDeleteDialog.ConfirmButton=\\u524A\\u9664\n#XTIT\nDeleteDialog.LockedTitle=\\u30D1\\u30C3\\u30B1\\u30FC\\u30B8\\u304C\\u30ED\\u30C3\\u30AF\\u3055\\u308C\\u3066\\u3044\\u307E\\u3059\n#XMSG\nDeleteDialog.LockedText=\\u9078\\u629E\\u3057\\u305F\\u30DA\\u30FC\\u30B8\\u306F\\u3001\\u30E6\\u30FC\\u30B6 "{0}" \\u306B\\u3088\\u3063\\u3066\\u30ED\\u30C3\\u30AF\\u3055\\u308C\\u3066\\u3044\\u307E\\u3059\\u3002\n#XMSG\nDeleteDialog.TransportRequired=\\u9078\\u629E\\u3057\\u305F\\u30DA\\u30FC\\u30B8\\u3092\\u524A\\u9664\\u3059\\u308B\\u305F\\u3081\\u3001\\u79FB\\u9001\\u30D1\\u30C3\\u30B1\\u30FC\\u30B8\\u3092\\u9078\\u629E\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\n\n#XMSG\nEditDialog.LockedText=\\u9078\\u629E\\u3057\\u305F\\u30DA\\u30FC\\u30B8\\u306F\\u3001\\u30E6\\u30FC\\u30B6 "{0}" \\u306B\\u3088\\u3063\\u3066\\u30ED\\u30C3\\u30AF\\u3055\\u308C\\u3066\\u3044\\u307E\\u3059\\u3002\n#XMSG\nEditDialog.TransportRequired=\\u9078\\u629E\\u3057\\u305F\\u30DA\\u30FC\\u30B8\\u3092\\u7DE8\\u96C6\\u3059\\u308B\\u305F\\u3081\\u3001\\u79FB\\u9001\\u30D1\\u30C3\\u30B1\\u30FC\\u30B8\\u3092\\u9078\\u629E\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\n#XTIT\nEditDialog.Title=\\u30DA\\u30FC\\u30B8\\u7DE8\\u96C6\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=\\u3053\\u306E\\u30DA\\u30FC\\u30B8\\u306F\\u8A00\\u8A9E "{0}" \\u3067\\u4F5C\\u6210\\u3055\\u308C\\u307E\\u3057\\u305F\\u304C\\u3001\\u30ED\\u30B0\\u30AA\\u30F3\\u8A00\\u8A9E\\u306F "{1}".\\u306B\\u8A2D\\u5B9A\\u3055\\u308C\\u3066\\u3044\\u307E\\u3059\\u3002\\u7D9A\\u884C\\u3059\\u308B\\u306B\\u306F\\u3001\\u30ED\\u30B0\\u30AA\\u30F3\\u8A00\\u8A9E\\u3092 "{0}" \\u306B\\u8A2D\\u5B9A\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\n\n#XFLD\nTileInfoPopover.Label.Subtitle=\\u30B5\\u30D6\\u30BF\\u30A4\\u30C8\\u30EB\n#XFLD\nTileInfoPopover.Label.Icon=\\u30A2\\u30A4\\u30B3\\u30F3\n#XFLD\nTileInfoPopover.Label.SemanticObject=\\u30BB\\u30DE\\u30F3\\u30C6\\u30A3\\u30C3\\u30AF\\u30AA\\u30D6\\u30B8\\u30A7\\u30AF\\u30C8\n#XFLD\nTileInfoPopover.Label.SemanticAction=\\u30BB\\u30DE\\u30F3\\u30C6\\u30A3\\u30C3\\u30AF\\u30A2\\u30AF\\u30B7\\u30E7\\u30F3\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori ID\n#XFLD\nTileInfoPopover.Label.AppDetail=\\u30A2\\u30D7\\u30EA\\u8A73\\u7D30\n#XFLD\nTileInfoPopover.Label.AppType=\\u30A2\\u30D7\\u30EA\\u30BF\\u30A4\\u30D7\n#XFLD\nTileInfoPopover.Label.TileType=\\u30BF\\u30A4\\u30EB\\u30BF\\u30A4\\u30D7\n#XFLD\nTileInfoPopover.Label.AvailableDevices=\\u5229\\u7528\\u53EF\\u80FD\\u306A\\u30C7\\u30D0\\u30A4\\u30B9\n\n#XTIT\nErrorDialog.Title=\\u30A8\\u30E9\\u30FC\n\n#XTIT\nConfirmChangesDialog.Title=\\u8B66\\u544A\n\n#XTIT\nPageOverview.Title=\\u30DA\\u30FC\\u30B8\\u66F4\\u65B0\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=\\u30EC\\u30A4\\u30A2\\u30A6\\u30C8\n\n#XTIT\nCopyDialog.Title=\\u30DA\\u30FC\\u30B8\\u306E\\u30B3\\u30D4\\u30FC\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message="{0}" \\u3092\\u30B3\\u30D4\\u30FC\\u3057\\u307E\\u3059\\u304B\\u3002\n#XFLD\nCopyDialog.NewID="{0}" \\u306E\\u30B3\\u30D4\\u30FC\n\n#XMSG\nTitle.NoSectionTitle=\\u30BB\\u30AF\\u30B7\\u30E7\\u30F3 {0} \\u306E\\u30BB\\u30AF\\u30B7\\u30E7\\u30F3\\u30BF\\u30A4\\u30C8\\u30EB\\u304C\\u7A7A\\u3067\\u3059\\u3002\n#XMSG\nTitle.UnsufficientRoles=\\u8868\\u793A\\u3059\\u308B\\u306B\\u306F\\u3001\\u30ED\\u30FC\\u30EB\\u5272\\u5F53\\u304C\\u4E0D\\u5341\\u5206\\u3067\\u3059\\u3002\n#XMSG\nTitle.VisualizationIsNotVisible=\\u30D3\\u30B8\\u30E5\\u30A2\\u30EB\\u5316\\u306E\\u7D50\\u679C\\u306F\\u8868\\u793A\\u3055\\u308C\\u307E\\u305B\\u3093\\u3002\n#XMSG\nTitle.VisualizationNotNavigateable=\\u30D3\\u30B8\\u30E5\\u30A2\\u30EB\\u5316\\u3067\\u30A2\\u30D7\\u30EA\\u3092\\u958B\\u3051\\u307E\\u305B\\u3093\\u3002\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=\\u9759\\u7684\\u30BF\\u30A4\\u30EB\n#XTIT\nTitle.DynamicTile=\\u52D5\\u7684\\u30BF\\u30A4\\u30EB\n#XTIT\nTitle.CustomTile=\\u30AB\\u30B9\\u30BF\\u30E0\\u30BF\\u30A4\\u30EB\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=\\u30DA\\u30FC\\u30B8\\u30D7\\u30EC\\u30D3\\u30E5\\u30FC\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=\\u3053\\u306E\\u30DA\\u30FC\\u30B8\\u304C\\u898B\\u3064\\u304B\\u308A\\u307E\\u305B\\u3093\\u3002\n#XLNK\nErrorPage.Link=\\u30DA\\u30FC\\u30B8\\u66F4\\u65B0\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_kk.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=\\u041A\\u043B\\u0438\\u0435\\u043D\\u0442 \\u0430\\u0440\\u0430\\u0441\\u044B\\u043D\\u0434\\u0430\\u0493\\u044B \\u0431\\u0435\\u0442\\u0442\\u0435\\u0440\\u0434\\u0456 \\u0436\\u04AF\\u0440\\u0433\\u0456\\u0437\\u0443\n\n#XBUT\nButton.Add=\\u049A\\u043E\\u0441\\u0443\n#XBUT\nButton.Cancel=\\u0411\\u043E\\u043B\\u0434\\u044B\\u0440\\u043C\\u0430\\u0443\n#XBUT\nButton.ClosePreview=\\u0410\\u043B\\u0434\\u044B\\u043D \\u0430\\u043B\\u0430 \\u043A\\u04E9\\u0440\\u0456\\u043D\\u0456\\u0441\\u0442\\u0456 \\u0436\\u0430\\u0431\\u0443\n#XBUT\nButton.Copy=\\u041A\\u04E9\\u0448\\u0456\\u0440\\u0443\n#XBUT\nButton.Create=\\u0416\\u0430\\u0441\\u0430\\u0443\n#XBUT\nButton.Delete=\\u0416\\u043E\\u044E\n#XBUT\nButton.Edit=\\u04E8\\u04A3\\u0434\\u0435\\u0443\n#XBUT\nButton.Save=\\u0421\\u0430\\u049B\\u0442\\u0430\\u0443\n#XBUT\nButton.Select=\\u0422\\u0430\\u04A3\\u0434\\u0430\\u0443\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=\\u041A\\u0430\\u0442\\u0430\\u043B\\u043E\\u0433\\u0442\\u0435\\u0440\\u0434\\u0456 \\u043A\\u04E9\\u0440\\u0441\\u0435\\u0442\\u0443\n#XBUT\nButton.HideCatalogs=\\u041A\\u0430\\u0442\\u0430\\u043B\\u043E\\u0433\\u0442\\u0435\\u0440\\u0434\\u0456 \\u0436\\u0430\\u0441\\u044B\\u0440\\u0443\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=\\u041C\\u04D9\\u0441\\u0435\\u043B\\u0435\\u043B\\u0435\\u0440\\: {0}\n#XBUT\nButton.SortCatalogs=\\u041A\\u0430\\u0442\\u0430\\u043B\\u043E\\u0433\\u0442\\u0456 \\u0441\\u04B1\\u0440\\u044B\\u043F\\u0442\\u0430\\u0443 \\u0440\\u0435\\u0442\\u0456\\u043D \\u0430\\u0443\\u044B\\u0441\\u0442\\u044B\\u0440\\u0443\n#XBUT\nButton.CollapseCatalogs=\\u0411\\u0430\\u0440\\u043B\\u044B\\u049B \\u043A\\u0430\\u0442\\u0430\\u043B\\u043E\\u0433\\u0442\\u0435\\u0440\\u0434\\u0456 \\u0436\\u0438\\u044E\n#XBUT\nButton.ExpandCatalogs=\\u0411\\u0430\\u0440\\u043B\\u044B\\u049B \\u043A\\u0430\\u0442\\u0430\\u043B\\u043E\\u0433\\u0442\\u0435\\u0440\\u0434\\u0456 \\u0436\\u0430\\u044E\n#XBUT\nButton.ShowDetails=\\u0422\\u043E\\u043B\\u044B\\u049B \\u043C\\u04D9\\u043B\\u0456\\u043C\\u0435\\u0442\\u0442\\u0456 \\u043A\\u04E9\\u0440\\u0441\\u0435\\u0442\\u0443\n#XBUT\nButton.PagePreview=\\u0411\\u0435\\u0442\\u0442\\u0456 \\u0430\\u043B\\u0434\\u044B\\u043D \\u0430\\u043B\\u0430 \\u043A\\u04E9\\u0440\\u0443\n#XBUT\nButton.ErrorMsg=\\u049A\\u0430\\u0442\\u0435 \\u0442\\u0443\\u0440\\u0430\\u043B\\u044B \\u0445\\u0430\\u0431\\u0430\\u0440\\u043B\\u0430\\u0440\n#XBUT\nButton.EditHeader=\\u0416\\u043E\\u0493\\u0430\\u0440\\u0493\\u044B \\u043A\\u043E\\u043B\\u043E\\u043D\\u0442\\u0438\\u0442\\u0443\\u043B\\u0434\\u044B \\u04E9\\u04A3\\u0434\\u0435\\u0443\n#XBUT\nButton.ContextSelector={0} \\u0440\\u04E9\\u043B \\u043C\\u04D9\\u043D\\u043C\\u04D9\\u0442\\u0456\\u043D\\u0456\\u043D \\u0442\\u0430\\u04A3\\u0434\\u0430\\u0443\n#XBUT\nButton.OverwriteChanges=\\u049A\\u0430\\u0439\\u0442\\u0430 \\u0436\\u0430\\u0437\\u0443\n#XBUT\nButton.DismissChanges=\\u04E8\\u0437\\u0433\\u0435\\u0440\\u0456\\u0441\\u0442\\u0435\\u0440\\u0434\\u0456 \\u0436\\u0430\\u0431\\u0443\n\n#XTOL\nTooltip.AddToSections=\\u0411\\u04E9\\u043B\\u0456\\u043C\\u0434\\u0435\\u0440\\u0433\\u0435 \\u049B\\u043E\\u0441\\u0443\n#XTOL: Tooltip for the search button\nTooltip.Search=\\u0406\\u0437\\u0434\\u0435\\u0443\n#XTOL\nTooltip.SearchForTiles=\\u041F\\u043B\\u0438\\u0442\\u043A\\u0430\\u043B\\u0430\\u0440\\u0434\\u044B \\u0456\\u0437\\u0434\\u0435\\u0443\n#XTOL\nTooltip.SearchForRoles=\\u0420\\u04E9\\u043B\\u0434\\u0435\\u0440\\u0434\\u0456 \\u0456\\u0437\\u0434\\u0435\\u0443\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=\\u0416\\u04B1\\u043C\\u044B\\u0441 \\u04AF\\u0441\\u0442\\u0435\\u043B\\u0456\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=\\u0421\\u04B1\\u0440\\u044B\\u043F\\u0442\\u0430\\u0443 \\u043F\\u0430\\u0440\\u0430\\u043C\\u0435\\u0442\\u0440\\u043B\\u0435\\u0440\\u0456\\u043D \\u043A\\u04E9\\u0440\\u0443\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=\\u0421\\u04AF\\u0437\\u0433\\u0456 \\u043F\\u0430\\u0440\\u0430\\u043C\\u0435\\u0442\\u0440\\u043B\\u0435\\u0440\\u0456\\u043D \\u043A\\u04E9\\u0440\\u0443\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=\\u0422\\u043E\\u043F \\u043F\\u0430\\u0440\\u0430\\u043C\\u0435\\u0442\\u0440\\u043B\\u0435\\u0440\\u0456\\u043D \\u043A\\u04E9\\u0440\\u0443\n\n#XFLD\nLabel.PageID=\\u0411\\u0435\\u0442 \\u0438\\u0434.\n#XFLD\nLabel.Title=\\u0422\\u0430\\u049B\\u044B\\u0440\\u044B\\u043F\n#XFLD\nLabel.WorkbenchRequest=\\u0410\\u0441\\u043F\\u0430\\u043F\\u0442\\u044B\\u049B \\u049B\\u04B1\\u0440\\u0430\\u043B\\u0434\\u0430\\u0440 \\u0441\\u04B1\\u0440\\u0430\\u0443\\u044B\n#XFLD\nLabel.Package=\\u0411\\u0443\\u043C\\u0430\n#XFLD\nLabel.TransportInformation=\\u0422\\u0430\\u0441\\u044B\\u043C\\u0430\\u043B\\u0434\\u0430\\u0443 \\u0442\\u0443\\u0440\\u0430\\u043B\\u044B \\u0430\\u049B\\u043F\\u0430\\u0440\\u0430\\u0442\n#XFLD\nLabel.Details=\\u0422\\u043E\\u043B\\u044B\\u049B \\u043C\\u04D9\\u043B\\u0456\\u043C\\u0435\\u0442\\:\n#XFLD\nLabel.ResponseCode=\\u0416\\u0430\\u0443\\u0430\\u043F \\u043A\\u043E\\u0434\\u044B\\:\n#XFLD\nLabel.ModifiedBy=\\u04E8\\u0437\\u0433\\u0435\\u0440\\u0442\\u043A\\u0435\\u043D\\:\n#XFLD\nLabel.Description=\\u0421\\u0438\\u043F\\u0430\\u0442\\u0442\\u0430\\u043C\\u0430\n#XFLD\nLabel.CreatedByFullname=\\u0416\\u0430\\u0441\\u0430\\u0493\\u0430\\u043D\n#XFLD\nLabel.CreatedOn=\\u0416\\u0430\\u0441\\u0430\\u043B\\u0493\\u0430\\u043D \\u043A\\u04AF\\u043D\\u0456\n#XFLD\nLabel.ChangedByFullname=\\u04E8\\u0437\\u0433\\u0435\\u0440\\u0442\\u043A\\u0435\\u043D\n#XFLD\nLabel.ChangedOn=\\u04E8\\u0437\\u0433\\u0435\\u0440\\u0442\\u0456\\u043B\\u0433\\u0435\\u043D \\u043A\\u04AF\\u043D\\u0456\n#XFLD\nLabel.PageTitle=\\u0411\\u0435\\u0442 \\u0442\\u0430\\u049B\\u044B\\u0440\\u044B\\u0431\\u044B\n#XFLD\nLabel.AssignedRole=\\u0422\\u0430\\u0493\\u0430\\u0439\\u044B\\u043D\\u0434\\u0430\\u043B\\u0493\\u0430\\u043D \\u0440\\u04E9\\u043B\n\n#XCOL\nColumn.PageID=\\u0418\\u0434.\n#XCOL\nColumn.PageTitle=\\u0410\\u0442\\u0430\\u0443\n#XCOL\nColumn.PageDescription=\\u0421\\u0438\\u043F\\u0430\\u0442\\u0442\\u0430\\u043C\\u0430\n#XCOL\nColumn.PageAssignmentStatus=\\u0411\\u043E\\u0441 \\u043E\\u0440\\u044B\\u043D\\u0493\\u0430/\\u0440\\u04E9\\u043B\\u0433\\u0435 \\u0442\\u0430\\u0493\\u0430\\u0439\\u044B\\u043D\\u0434\\u0430\\u043B\\u0493\\u0430\\u043D\n#XCOL\nColumn.PagePackage=\\u0411\\u0443\\u043C\\u0430\n#XCOL\nColumn.PageWorkbenchRequest=\\u0410\\u0441\\u043F\\u0430\\u043F\\u0442\\u044B\\u049B \\u049B\\u04B1\\u0440\\u0430\\u043B\\u0434\\u0430\\u0440 \\u0441\\u04B1\\u0440\\u0430\\u0443\\u044B\n#XCOL\nColumn.PageCreatedBy=\\u0416\\u0430\\u0441\\u0430\\u0493\\u0430\\u043D\n#XCOL\nColumn.PageCreatedOn=\\u0416\\u0430\\u0441\\u0430\\u043B\\u0493\\u0430\\u043D \\u043A\\u04AF\\u043D\\u0456\n#XCOL\nColumn.PageChangedBy=\\u04E8\\u0437\\u0433\\u0435\\u0440\\u0442\\u043A\\u0435\\u043D\n#XCOL\nColumn.PageChangedOn=\\u04E8\\u0437\\u0433\\u0435\\u0440\\u0442\\u0456\\u043B\\u0433\\u0435\\u043D \\u043A\\u04AF\\u043D\\u0456\n\n#XTOL\nPlaceholder.SectionName=\\u0411\\u04E9\\u043B\\u0456\\u043C \\u0430\\u0442\\u044B\\u043D \\u0435\\u043D\\u0433\\u0456\\u0437\\u0443\n#XTOL\nPlaceholder.SearchForTiles=\\u041F\\u043B\\u0438\\u0442\\u043A\\u0430\\u043B\\u0430\\u0440\\u0434\\u044B \\u0456\\u0437\\u0434\\u0435\\u0443\n#XTOL\nPlaceholder.SearchForRoles=\\u0420\\u04E9\\u043B\\u0434\\u0435\\u0440\\u0434\\u0456 \\u0456\\u0437\\u0434\\u0435\\u0443\n#XTOL\nPlaceholder.CopyPageTitle="{0}" \\u043A\\u04E9\\u0448\\u0456\\u0440\\u043C\\u0435\\u0441\\u0456\n#XTOL\nPlaceholder.CopyPageID="{0}" \\u043A\\u04E9\\u0448\\u0456\\u0440\\u043C\\u0435\\u0441\\u0456\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=\\u0431\\u0430\\u0440\\u043B\\u044B\\u0493\\u044B\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle={0} \\u0431\\u04E9\\u043B\\u0456\\u043C\\u0456\\u043D\\u0434\\u0435 \\u043F\\u043B\\u0438\\u0442\\u043A\\u0430 \\u0436\\u043E\\u049B. \\u041F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B \\u0442\\u04D9\\u0436\\u0456\\u0440\\u0438\\u0431\\u0435\\u0441\\u0456 \\u0441\\u04D9\\u0439\\u043A\\u0435\\u0441 \\u0431\\u043E\\u043B\\u0443\\u044B \\u04AF\\u0448\\u0456\\u043D, \\u04D9\\u0440 \\u0431\\u04E9\\u043B\\u0456\\u043C \\u04AF\\u0448\\u0456\\u043D \\u0430\\u0442\\u0430\\u0443 \\u0435\\u043D\\u0433\\u0456\\u0437\\u0443\\u0433\\u0435 \\u043A\\u0435\\u04A3\\u0435\\u0441 \\u0431\\u0435\\u0440\\u0456\\u043B\\u0435\\u0434\\u0456.\n#XMSG\nMessage.InvalidSectionTitle=\\u0411\\u04E9\\u043B\\u0456\\u043C \\u0430\\u0442\\u044B\\u043D \\u0435\\u043D\\u0433\\u0456\\u0437\\u0433\\u0435\\u043D \\u0436\\u04E9\\u043D.\n#XMSG\nMessage.NoInternetConnection=\\u0418\\u043D\\u0442\\u0435\\u0440\\u043D\\u0435\\u0442 \\u0431\\u0430\\u0439\\u043B\\u0430\\u043D\\u044B\\u0441\\u044B\\u043D \\u0442\\u0435\\u043A\\u0441\\u0435\\u0440\\u0456\\u04A3\\u0456\\u0437.\n#XMSG\nMessage.SavedChanges=\\u04E8\\u0437\\u0433\\u0435\\u0440\\u0456\\u0441\\u0442\\u0435\\u0440 \\u0441\\u0430\\u049B\\u0442\\u0430\\u043B\\u0434\\u044B.\n#XMSG\nMessage.InvalidPageID=\\u0422\\u0435\\u043A \\u043A\\u0435\\u043B\\u0435\\u0441\\u0456 \\u0442\\u0430\\u04A3\\u0431\\u0430\\u043B\\u0430\\u0440\\u0434\\u044B \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u044B\\u04A3\\u044B\\u0437\\: A-Z, 0-9, _ \\u0436\\u04D9\\u043D\\u0435 /. \\u0411\\u0435\\u0442 \\u0438\\u0434. \\u0441\\u0430\\u043D\\u043D\\u0430\\u043D \\u0431\\u0430\\u0441\\u0442\\u0430\\u043B\\u043C\\u0430\\u0443\\u044B \\u0442\\u0438\\u0456\\u0441.\n#XMSG\nMessage.EmptyPageID=\\u0416\\u0430\\u0440\\u0430\\u043C\\u0434\\u044B \\u0431\\u0435\\u0442 \\u0438\\u0434. \\u043A\\u04E9\\u0440\\u0441\\u0435\\u0442\\u0456\\u04A3\\u0456\\u0437.\n#XMSG\nMessage.EmptyTitle=\\u0416\\u0430\\u0440\\u0430\\u043C\\u0434\\u044B \\u0442\\u0430\\u049B\\u044B\\u0440\\u044B\\u043F\\u0442\\u044B \\u043A\\u04E9\\u0440\\u0441\\u0435\\u0442\\u0456\\u04A3\\u0456\\u0437.\n#XMSG\nMessage.NoRoleSelected=\\u041A\\u0435\\u043C\\u0456\\u043D\\u0434\\u0435 \\u0431\\u0456\\u0440 \\u0440\\u04E9\\u043B\\u0434\\u0456 \\u0442\\u0430\\u04A3\\u0434\\u0430\\u04A3\\u044B\\u0437.\n#XMSG\nMessage.SuccessDeletePage=\\u0422\\u0430\\u04A3\\u0434\\u0430\\u043B\\u0493\\u0430\\u043D \\u043D\\u044B\\u0441\\u0430\\u043D \\u0436\\u043E\\u0439\\u044B\\u043B\\u0434\\u044B.\n#XMSG\nMessage.ClipboardCopySuccess=\\u0422\\u043E\\u043B\\u044B\\u049B \\u043C\\u04D9\\u043B\\u0456\\u043C\\u0435\\u0442 \\u0441\\u04D9\\u0442\\u0442\\u0456 \\u043A\\u04E9\\u0448\\u0456\\u0440\\u0456\\u043B\\u0434\\u0456.\n#YMSE\nMessage.ClipboardCopyFail=\\u041C\\u04D9\\u043B\\u0456\\u043C\\u0435\\u0442\\u0442\\u0435\\u0440\\u0434\\u0456 \\u043A\\u04E9\\u0448\\u0456\\u0440\\u0443 \\u043A\\u0435\\u0437\\u0456\\u043D\\u0434\\u0435 \\u049B\\u0430\\u0442\\u0435 \\u043E\\u0440\\u044B\\u043D \\u0430\\u043B\\u0434\\u044B.\n#XMSG\nMessage.PageCreated=\\u0411\\u0435\\u0442 \\u0436\\u0430\\u0441\\u0430\\u043B\\u0434\\u044B.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=\\u041F\\u043B\\u0438\\u0442\\u043A\\u0430\\u043B\\u0430\\u0440 \\u0436\\u043E\\u049B\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=\\u0420\\u04E9\\u043B\\u0434\\u0435\\u0440 \\u049B\\u043E\\u043B\\u0436\\u0435\\u0442\\u0456\\u043C\\u0434\\u0456 \\u0435\\u043C\\u0435\\u0441.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=\\u0420\\u04E9\\u043B\\u0434\\u0435\\u0440 \\u0442\\u0430\\u0431\\u044B\\u043B\\u043C\\u0430\\u0434\\u044B. \\u0406\\u0437\\u0434\\u0435\\u0443 \\u0448\\u0430\\u0440\\u0442\\u044B\\u043D \\u0440\\u0435\\u0442\\u0442\\u0435\\u043F \\u043A\\u04E9\\u0440\\u0456\\u04A3\\u0456\\u0437.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=\\u0411\\u04E9\\u043B\\u0456\\u043C\\u0434\\u0435\\u0440 \\u0436\\u043E\\u049B\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError={0} \\u043F\\u043B\\u0438\\u0442\\u043A\\u0430\\u0441\\u044B\\u043D "{1}" \\u0431\\u04E9\\u043B\\u0456\\u043C\\u0456\\u043D\\u0435 \\u0436\\u04AF\\u043A\\u0442\\u0435\\u0443 \\u0441\\u04D9\\u0442\\u0441\\u0456\\u0437 \\u0430\\u044F\\u049B\\u0442\\u0430\\u043B\\u0434\\u044B.\\n\\n\\u0411\\u04B1\\u0493\\u0430\\u043D SAP Fiori \\u0456\\u0441\\u043A\\u0435 \\u049B\\u043E\\u0441\\u0443 \\u043F\\u0430\\u043D\\u0435\\u043B\\u0456 \\u043C\\u0430\\u0437\\u043C\\u04B1\\u043D\\u044B\\u043D\\u044B\\u04A3 \\u0434\\u04B1\\u0440\\u044B\\u0441 \\u0435\\u043C\\u0435\\u0441 \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F\\u0441\\u044B \\u0441\\u0435\\u0431\\u0435\\u043F\\u0448\\u0456 \\u0431\\u043E\\u043B\\u0443\\u044B \\u043C\\u04AF\\u043C\\u043A\\u0456\\u043D. \\u0412\\u0438\\u0437\\u0443\\u0430\\u043B\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B\\u0493\\u0430 \\u043A\\u04E9\\u0440\\u0456\\u043D\\u0431\\u0435\\u0439\\u0434\\u0456.\n#XMSG\nMessage.NavigationTargetError=\\u041D\\u0430\\u0432\\u0438\\u0433\\u0430\\u0446\\u0438\\u044F \\u043C\\u0430\\u049B\\u0441\\u0430\\u0442\\u044B\\u043D \\u0448\\u0435\\u0448\\u0443 \\u043C\\u04AF\\u043C\\u043A\\u0456\\u043D \\u0431\\u043E\\u043B\\u043C\\u0430\\u0434\\u044B.\n#XMSG\nMessage.LoadPageError=\\u0411\\u0435\\u0442 \\u0436\\u04AF\\u043A\\u0442\\u0435\\u043B\\u043C\\u0435\\u0434\\u0456.\n#XMSG\nMessage.UpdatePageError=\\u0411\\u0435\\u0442 \\u0436\\u0430\\u04A3\\u0430\\u0440\\u0442\\u044B\\u043B\\u043C\\u0430\\u0434\\u044B.\n#XMSG\nMessage.CreatePageError=\\u0411\\u0435\\u0442 \\u0436\\u0430\\u0441\\u0430\\u043B\\u043C\\u0430\\u0434\\u044B.\n#XMSG\nMessage.TilesHaveErrors=\\u041A\\u0435\\u0439\\u0431\\u0456\\u0440 \\u043F\\u043B\\u0438\\u0442\\u043A\\u0430\\u043B\\u0430\\u0440\\u0434\\u0430 \\u043D\\u0435\\u043C\\u0435\\u0441\\u0435 \\u0431\\u04E9\\u043B\\u0456\\u043C\\u0434\\u0435\\u0440\\u0434\\u0435 \\u049B\\u0430\\u0442\\u0435\\u043B\\u0435\\u0440 \\u0431\\u0430\\u0440. \\u0421\\u0430\\u049B\\u0442\\u0430\\u0443\\u0434\\u044B \\u0448\\u044B\\u043D\\u044B\\u043C\\u0435\\u043D \\u0436\\u0430\\u043B\\u0493\\u0430\\u0441\\u0442\\u044B\\u0440\\u0443 \\u043A\\u0435\\u0440\\u0435\\u043A \\u043F\\u0435?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=\\u041F\\u043B\\u0438\\u0442\\u043A\\u0430\\u043D\\u044B\\u04A3 \\u043D\\u0430\\u0432\\u0438\\u0433\\u0430\\u0446\\u0438\\u044F \\u043C\\u0430\\u049B\\u0441\\u0430\\u0442\\u044B\\u043D \\u0448\\u0435\\u0448\\u0443 \\u043C\\u04AF\\u043C\\u043A\\u0456\\u043D \\u0431\\u043E\\u043B\\u043C\\u0430\\u0434\\u044B\\: "{0}".\\n\\n\\u0411\\u04B1\\u0493\\u0430\\u043D SAP Fiori \\u0456\\u0441\\u043A\\u0435 \\u049B\\u043E\\u0441\\u0443 \\u043F\\u0430\\u043D\\u0435\\u043B\\u0456 \\u043C\\u0430\\u0437\\u043C\\u04B1\\u043D\\u044B\\u043D\\u044B\\u04A3 \\u0436\\u0430\\u0440\\u0430\\u043C\\u0441\\u044B\\u0437 \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F\\u0441\\u044B \\u0441\\u0435\\u0431\\u0435\\u043F\\u0448\\u0456 \\u0431\\u043E\\u043B\\u0443\\u044B \\u043C\\u04AF\\u043C\\u043A\\u0456\\u043D. \\u0412\\u0438\\u0437\\u0443\\u0430\\u043B\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F \\u049B\\u043E\\u043B\\u0434\\u0430\\u043D\\u0431\\u0430\\u043D\\u044B \\u0430\\u0448\\u0430 \\u0430\\u043B\\u043C\\u0430\\u0439\\u0434\\u044B.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete="{0}" \\u0431\\u04E9\\u043B\\u0456\\u043C\\u0456\\u043D \\u0448\\u044B\\u043D\\u044B\\u043C\\u0435\\u043D \\u0436\\u043E\\u044E \\u043A\\u0435\\u0440\\u0435\\u043A \\u043F\\u0435?\n#XMSG\nMessage.Section.DeleteNoTitle=\\u041E\\u0441\\u044B \\u0431\\u04E9\\u043B\\u0456\\u043C\\u0434\\u0456 \\u0436\\u043E\\u044E \\u049B\\u0430\\u0436\\u0435\\u0442\\u0442\\u0456\\u0433\\u0456\\u043D \\u0440\\u0430\\u0441\\u0442\\u0430\\u0439\\u0441\\u044B\\u0437 \\u0431\\u0430?\n#XMSG\nMessage.OverwriteChanges=\\u0411\\u0435\\u0442\\u0442\\u0456 \\u04E9\\u04A3\\u0434\\u0435\\u043F \\u0436\\u0430\\u0442\\u049B\\u0430\\u043D \\u043A\\u0435\\u0437\\u0434\\u0435, \\u04E9\\u0437\\u0433\\u0435\\u0440\\u0456\\u0441\\u0442\\u0435\\u0440 \\u043E\\u0440\\u044B\\u043D \\u0430\\u043B\\u0434\\u044B. \\u041E\\u043B\\u0430\\u0440\\u0434\\u044B \\u049B\\u0430\\u0439\\u0442\\u0430 \\u0436\\u0430\\u0437\\u0443 \\u043A\\u0435\\u0440\\u0435\\u043A \\u043F\\u0435?\n#XMSG\nMessage.OverwriteRemovedPage=\\u0421\\u0456\\u0437 \\u0436\\u04B1\\u043C\\u044B\\u0441 \\u0456\\u0441\\u0442\\u0435\\u043F \\u0436\\u0430\\u0442\\u049B\\u0430\\u043D \\u0431\\u0435\\u0442\\u0442\\u0456 \\u0431\\u0430\\u0441\\u049B\\u0430 \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B \\u0436\\u043E\\u0439\\u0434\\u044B. \\u0411\\u04B1\\u043B \\u04E9\\u0437\\u0433\\u0435\\u0440\\u0456\\u0441\\u0442\\u0456 \\u049B\\u0430\\u0439\\u0442\\u0430 \\u0436\\u0430\\u0437\\u0443 \\u043A\\u0435\\u0440\\u0435\\u043A \\u043F\\u0435?\n#XMSG\nMessage.SaveChanges=\\u04E8\\u0437\\u0433\\u0435\\u0440\\u0456\\u0441\\u0442\\u0435\\u0440\\u0434\\u0456 \\u0441\\u0430\\u049B\\u0442\\u0430\\u04A3\\u044B\\u0437.\n#XMSG\nMessage.NoPages=\\u0411\\u0435\\u0442\\u0442\\u0435\\u0440 \\u049B\\u043E\\u043B\\u0436\\u0435\\u0442\\u0456\\u043C\\u0441\\u0456\\u0437.\n#XMSG\nMessage.NoPagesFound=\\u0411\\u0435\\u0442\\u0442\\u0435\\u0440 \\u0442\\u0430\\u0431\\u044B\\u043B\\u043C\\u0430\\u0434\\u044B. \\u0406\\u0437\\u0434\\u0435\\u0443 \\u0448\\u0430\\u0440\\u0442\\u0442\\u0430\\u0440\\u044B\\u043D \\u0440\\u0435\\u0442\\u0442\\u0435\\u043F \\u043A\\u04E9\\u0440\\u0456\\u04A3\\u0456\\u0437.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=\\u041C\\u0430\\u0437\\u043C\\u04B1\\u043D \\u0440\\u04E9\\u043B \\u043C\\u0430\\u0437\\u043C\\u04B1\\u043D\\u044B\\u043C\\u0435\\u043D \\u0448\\u0435\\u043A\\u0442\\u0435\\u043B\\u0434\\u0456.\n#XMSG\nMessage.NotAssigned=\\u0422\\u0430\\u0493\\u0430\\u0439\\u044B\\u043D\\u0434\\u0430\\u043B\\u043C\\u0430\\u0434\\u044B.\n#XMSG\nMessage.StatusAssigned=\\u0422\\u0430\\u0493\\u0430\\u0439\\u044B\\u043D\\u0434\\u0430\\u043B\\u0493\\u0430\\u043D\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=\\u0416\\u0430\\u04A3\\u0430 \\u0431\\u0435\\u0442\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=\\u0420\\u04E9\\u043B \\u043C\\u04D9\\u043D\\u043C\\u04D9\\u0442\\u0456\\u043D\\u0456\\u043D \\u0442\\u0430\\u04A3\\u0434\\u0430\\u0443\n#XTIT\nTitle.TilesHaveErrors=\\u041F\\u043B\\u0438\\u0442\\u043A\\u0430\\u043B\\u0430\\u0440\\u0434\\u0430 \\u049B\\u0430\\u0442\\u0435\\u043B\\u0435\\u0440 \\u0431\\u0430\\u0440\n#XTIT\nDeleteDialog.Title=\\u0416\\u043E\\u044E\n#XMSG\nDeleteDialog.Text=\\u0422\\u0430\\u04A3\\u0434\\u0430\\u043B\\u0493\\u0430\\u043D \\u0431\\u0435\\u0442\\u0442\\u0456 \\u0448\\u044B\\u043D\\u044B\\u043C\\u0435\\u043D \\u0436\\u043E\\u044E \\u043A\\u0435\\u0440\\u0435\\u043A \\u043F\\u0435?\n#XBUT\nDeleteDialog.ConfirmButton=\\u0416\\u043E\\u044E\n#XTIT\nDeleteDialog.LockedTitle=\\u0411\\u0435\\u0442 \\u049B\\u04B1\\u043B\\u044B\\u043F\\u0442\\u0430\\u043D\\u0493\\u0430\\u043D\n#XMSG\nDeleteDialog.LockedText=\\u0422\\u0430\\u04A3\\u0434\\u0430\\u043B\\u0493\\u0430\\u043D \\u0431\\u0435\\u0442 "{0}" \\u0430\\u0442\\u0442\\u044B \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B\\u043D\\u044B\\u04A3 \\u0442\\u0430\\u0440\\u0430\\u043F\\u044B\\u043D\\u0430\\u043D \\u049B\\u04B1\\u043B\\u044B\\u043F\\u0442\\u0430\\u043D\\u0493\\u0430\\u043D.\n#XMSG\nDeleteDialog.TransportRequired=\\u0422\\u0430\\u04A3\\u0434\\u0430\\u043B\\u0493\\u0430\\u043D \\u0431\\u0435\\u0442\\u0442\\u0456 \\u0436\\u043E\\u044E \\u04AF\\u0448\\u0456\\u043D \\u0442\\u0430\\u0441\\u044B\\u043C\\u0430\\u043B\\u0434\\u0430\\u0443 \\u0431\\u0443\\u043C\\u0430\\u0441\\u044B\\u043D \\u0442\\u0430\\u04A3\\u0434\\u0430\\u04A3\\u044B\\u0437.\n\n#XMSG\nEditDialog.LockedText=\\u0422\\u0430\\u04A3\\u0434\\u0430\\u043B\\u0493\\u0430\\u043D \\u0431\\u0435\\u0442 "{0}" \\u0430\\u0442\\u0442\\u044B \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B\\u043D\\u044B\\u04A3 \\u0442\\u0430\\u0440\\u0430\\u043F\\u044B\\u043D\\u0430\\u043D \\u049B\\u04B1\\u043B\\u044B\\u043F\\u0442\\u0430\\u043D\\u0493\\u0430\\u043D.\n#XMSG\nEditDialog.TransportRequired=\\u0422\\u0430\\u04A3\\u0434\\u0430\\u043B\\u0493\\u0430\\u043D \\u0431\\u0435\\u0442\\u0442\\u0456 \\u04E9\\u04A3\\u0434\\u0435\\u0443 \\u04AF\\u0448\\u0456\\u043D \\u0442\\u0430\\u0441\\u044B\\u043C\\u0430\\u043B\\u0434\\u0430\\u0443 \\u0431\\u0443\\u043C\\u0430\\u0441\\u044B\\u043D \\u0442\\u0430\\u04A3\\u0434\\u0430\\u04A3\\u044B\\u0437.\n#XTIT\nEditDialog.Title=\\u0411\\u0435\\u0442\\u0442\\u0456 \\u04E9\\u04A3\\u0434\\u0435\\u0443\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=\\u0411\\u04B1\\u043B \\u0431\\u0435\\u0442 "{0}" \\u0442\\u0456\\u043B\\u0456\\u043D\\u0434\\u0435 \\u0436\\u0430\\u0441\\u0430\\u043B\\u0434\\u044B, \\u0430\\u043B\\u0430\\u0439\\u0434\\u0430 \\u0436\\u04AF\\u0439\\u0435\\u0433\\u0435 \\u043A\\u0456\\u0440\\u0443 \\u0442\\u0456\\u043B\\u0456 "{1}" \\u0434\\u0435\\u043F \\u043E\\u0440\\u043D\\u0430\\u0442\\u044B\\u043B\\u0493\\u0430\\u043D. \\u0416\\u0430\\u043B\\u0493\\u0430\\u0441\\u0442\\u044B\\u0440\\u0443 \\u04AF\\u0448\\u0456\\u043D \\u0436\\u04AF\\u0439\\u0435\\u0433\\u0435 \\u043A\\u0456\\u0440\\u0443 \\u0442\\u0456\\u043B\\u0456\\u043D "{0}" \\u0434\\u0435\\u043F \\u04E9\\u0437\\u0433\\u0435\\u0440\\u0442\\u0456\\u04A3\\u0456\\u0437.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=\\u0422\\u0430\\u049B\\u044B\\u0440\\u044B\\u043F\\u0448\\u0430\n#XFLD\nTileInfoPopover.Label.Icon=\\u0411\\u0435\\u043B\\u0433\\u0456\\u0448\\u0435\n#XFLD\nTileInfoPopover.Label.SemanticObject=\\u0421\\u0435\\u043C\\u0430\\u043D\\u0442\\u0438\\u043A\\u0430\\u043B\\u044B\\u049B \\u043D\\u044B\\u0441\\u0430\\u043D\n#XFLD\nTileInfoPopover.Label.SemanticAction=\\u0421\\u0435\\u043C\\u0430\\u043D\\u0442\\u0438\\u043A\\u0430\\u043B\\u044B\\u049B \\u04D9\\u0440\\u0435\\u043A\\u0435\\u0442\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori \\u0438\\u0434.\n#XFLD\nTileInfoPopover.Label.AppDetail=\\u049A\\u043E\\u043B\\u0434\\u0430\\u043D\\u0431\\u0430 \\u043C\\u04D9\\u043B\\u0456\\u043C\\u0435\\u0442\\u0442\\u0435\\u0440\\u0456\n#XFLD\nTileInfoPopover.Label.AppType=\\u049A\\u043E\\u043B\\u0434\\u0430\\u043D\\u0431\\u0430 \\u0442\\u04AF\\u0440\\u0456\n#XFLD\nTileInfoPopover.Label.TileType=\\u041F\\u043B\\u0438\\u0442\\u043A\\u0430 \\u0442\\u04AF\\u0440\\u0456\n#XFLD\nTileInfoPopover.Label.AvailableDevices=\\u049A\\u043E\\u043B\\u0436\\u0435\\u0442\\u0456\\u043C\\u0434\\u0456 \\u049B\\u04B1\\u0440\\u044B\\u043B\\u0493\\u044B\\u043B\\u0430\\u0440\n\n#XTIT\nErrorDialog.Title=\\u049A\\u0430\\u0442\\u0435\n\n#XTIT\nConfirmChangesDialog.Title=\\u0415\\u0441\\u043A\\u0435\\u0440\\u0442\\u0443\n\n#XTIT\nPageOverview.Title=\\u0411\\u0435\\u0442\\u0442\\u0435\\u0440\\u0434\\u0456 \\u0436\\u04AF\\u0440\\u0433\\u0456\\u0437\\u0443\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=\\u041F\\u0456\\u0448\\u0456\\u043C\n\n#XTIT\nCopyDialog.Title=\\u0411\\u0435\\u0442\\u0442\\u0456 \\u043A\\u04E9\\u0448\\u0456\\u0440\\u0443\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message="{0}" \\u043A\\u04E9\\u0448\\u0456\\u0440\\u0443 \\u049B\\u0430\\u0436\\u0435\\u0442 \\u043F\\u0435?\n#XFLD\nCopyDialog.NewID="{0}" \\u043A\\u04E9\\u0448\\u0456\\u0440\\u043C\\u0435\\u0441\\u0456\n\n#XMSG\nTitle.NoSectionTitle={0} \\u0431\\u04E9\\u043B\\u0456\\u043C\\u0456\\u043D\\u0456\\u04A3 \\u0442\\u0430\\u049B\\u044B\\u0440\\u044B\\u0431\\u044B \\u0431\\u043E\\u0441.\n#XMSG\nTitle.UnsufficientRoles=\\u0412\\u0438\\u0437\\u0443\\u0430\\u043B\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F\\u043D\\u044B \\u043A\\u04E9\\u0440\\u0441\\u0435\\u0442\\u0443 \\u04AF\\u0448\\u0456\\u043D \\u0440\\u04E9\\u043B \\u0442\\u0430\\u0493\\u0430\\u0439\\u044B\\u043D\\u0434\\u0430\\u0443\\u044B \\u0436\\u0435\\u0442\\u043A\\u0456\\u043B\\u0456\\u043A\\u0441\\u0456\\u0437.\n#XMSG\nTitle.VisualizationIsNotVisible=\\u0412\\u0438\\u0437\\u0443\\u0430\\u043B\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F \\u043A\\u04E9\\u0440\\u0441\\u0435\\u0442\\u0456\\u043B\\u043C\\u0435\\u0439\\u0434\\u0456.\n#XMSG\nTitle.VisualizationNotNavigateable=\\u0412\\u0438\\u0437\\u0443\\u0430\\u043B\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F \\u049B\\u043E\\u043B\\u0434\\u0430\\u043D\\u0431\\u0430\\u043D\\u044B \\u0430\\u0448\\u0430 \\u0430\\u043B\\u043C\\u0430\\u0439\\u0434\\u044B.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=\\u0421\\u0442\\u0430\\u0442\\u0438\\u043A\\u0430\\u043B\\u044B\\u049B \\u043F\\u043B\\u0438\\u0442\\u043A\\u0430\n#XTIT\nTitle.DynamicTile=\\u0414\\u0438\\u043D\\u0430\\u043C\\u0438\\u043A\\u0430\\u043B\\u044B\\u049B \\u043F\\u043B\\u0438\\u0442\\u043A\\u0430\n#XTIT\nTitle.CustomTile=\\u0422\\u0435\\u04A3\\u0448\\u0435\\u043B\\u043C\\u0435\\u043B\\u0456 \\u043F\\u043B\\u0438\\u0442\\u043A\\u0430\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=\\u0411\\u0435\\u0442\\u0442\\u0456 \\u0430\\u043B\\u0434\\u044B\\u043D \\u0430\\u043B\\u0430 \\u043A\\u04E9\\u0440\\u0443\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=\\u041A\\u0435\\u0448\\u0456\\u0440\\u0456\\u04A3\\u0456\\u0437, \\u0431\\u04B1\\u043B \\u0431\\u0435\\u0442\\u0442\\u0456 \\u0442\\u0430\\u0431\\u0430 \\u0430\\u043B\\u043C\\u0430\\u0434\\u044B\\u049B.\n#XLNK\nErrorPage.Link=\\u0411\\u0435\\u0442\\u0442\\u0435\\u0440\\u0434\\u0456 \\u0436\\u04AF\\u0440\\u0433\\u0456\\u0437\\u0443\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_ko.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=\\uD074\\uB77C\\uC774\\uC5B8\\uD2B8 \\uC804\\uCCB4 \\uD398\\uC774\\uC9C0 \\uC720\\uC9C0\\uBCF4\\uC218\n\n#XBUT\nButton.Add=\\uCD94\\uAC00\n#XBUT\nButton.Cancel=\\uCDE8\\uC18C\n#XBUT\nButton.ClosePreview=\\uBBF8\\uB9AC\\uBCF4\\uAE30 \\uB2EB\\uAE30\n#XBUT\nButton.Copy=\\uBCF5\\uC0AC\n#XBUT\nButton.Create=\\uC0DD\\uC131\n#XBUT\nButton.Delete=\\uC0AD\\uC81C\n#XBUT\nButton.Edit=\\uD3B8\\uC9D1\n#XBUT\nButton.Save=\\uC800\\uC7A5\n#XBUT\nButton.Select=\\uC120\\uD0DD\n#XBUT\nButton.Ok=\\uD655\\uC778\n#XBUT\nButton.ShowCatalogs=\\uCE74\\uD0C8\\uB85C\\uADF8 \\uD45C\\uC2DC\n#XBUT\nButton.HideCatalogs=\\uCE74\\uD0C8\\uB85C\\uADF8 \\uC228\\uAE30\\uAE30\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=\\uC774\\uC288\\: {0}\n#XBUT\nButton.SortCatalogs=\\uCE74\\uD0C8\\uB85C\\uADF8 \\uC815\\uB82C \\uC21C\\uC11C \\uC804\\uD658\n#XBUT\nButton.CollapseCatalogs=\\uBAA8\\uB4E0 \\uCE74\\uD0C8\\uB85C\\uADF8 \\uC811\\uAE30\n#XBUT\nButton.ExpandCatalogs=\\uBAA8\\uB4E0 \\uCE74\\uD0C8\\uB85C\\uADF8 \\uD3BC\\uCE58\\uAE30\n#XBUT\nButton.ShowDetails=\\uC138\\uBD80\\uC0AC\\uD56D \\uD45C\\uC2DC\n#XBUT\nButton.PagePreview=\\uD398\\uC774\\uC9C0 \\uBBF8\\uB9AC\\uBCF4\\uAE30\n#XBUT\nButton.ErrorMsg=\\uC624\\uB958 \\uBA54\\uC2DC\\uC9C0\n#XBUT\nButton.EditHeader=\\uD5E4\\uB354 \\uD3B8\\uC9D1\n#XBUT\nButton.ContextSelector=\\uC5ED\\uD560 \\uCEE8\\uD14D\\uC2A4\\uD2B8 {0} \\uC120\\uD0DD\n#XBUT\nButton.OverwriteChanges=\\uB36E\\uC5B4\\uC4F0\\uAE30\n#XBUT\nButton.DismissChanges=\\uBCC0\\uACBD \\uC0AD\\uC81C\n\n#XTOL\nTooltip.AddToSections=\\uC120\\uD0DD\\uC5D0 \\uCD94\\uAC00\n#XTOL: Tooltip for the search button\nTooltip.Search=\\uAC80\\uC0C9\n#XTOL\nTooltip.SearchForTiles=\\uD0C0\\uC77C \\uAC80\\uC0C9\n#XTOL\nTooltip.SearchForRoles=\\uC5ED\\uD560 \\uAC80\\uC0C9\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=\\uB370\\uC2A4\\uD06C\\uD1B1\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=\\uC815\\uB82C \\uC124\\uC815 \\uBCF4\\uAE30\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=\\uD544\\uD130 \\uC124\\uC815 \\uBCF4\\uAE30\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=\\uADF8\\uB8F9 \\uC124\\uC815 \\uBCF4\\uAE30\n\n#XFLD\nLabel.PageID=\\uD398\\uC774\\uC9C0 ID\n#XFLD\nLabel.Title=\\uC81C\\uBAA9\n#XFLD\nLabel.WorkbenchRequest=\\uC6CC\\uD06C\\uBCA4\\uCE58 \\uC694\\uCCAD\n#XFLD\nLabel.Package=\\uD328\\uD0A4\\uC9C0\n#XFLD\nLabel.TransportInformation=\\uC804\\uC1A1 \\uC815\\uBCF4\n#XFLD\nLabel.Details=\\uC138\\uBD80\\uC0AC\\uD56D\\:\n#XFLD\nLabel.ResponseCode=\\uC751\\uB2F5 \\uCF54\\uB4DC\\:\n#XFLD\nLabel.ModifiedBy=\\uC218\\uC815\\uC790\\:\n#XFLD\nLabel.Description=\\uB0B4\\uC5ED\n#XFLD\nLabel.CreatedByFullname=\\uC0DD\\uC131\\uC790\n#XFLD\nLabel.CreatedOn=\\uC0DD\\uC131\\uC77C\n#XFLD\nLabel.ChangedByFullname=\\uBCC0\\uACBD\\uC790\n#XFLD\nLabel.ChangedOn=\\uBCC0\\uACBD\\uC77C\n#XFLD\nLabel.PageTitle=\\uD398\\uC774\\uC9C0 \\uC81C\\uBAA9\n#XFLD\nLabel.AssignedRole=\\uC9C0\\uC815\\uB41C \\uC5ED\\uD560\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=\\uC81C\\uBAA9\n#XCOL\nColumn.PageDescription=\\uB0B4\\uC5ED\n#XCOL\nColumn.PageAssignmentStatus=\\uACF5\\uAC04/\\uC5ED\\uD560\\uC5D0 \\uC9C0\\uC815\\uB428\n#XCOL\nColumn.PagePackage=\\uD328\\uD0A4\\uC9C0\n#XCOL\nColumn.PageWorkbenchRequest=\\uC6CC\\uD06C\\uBCA4\\uCE58 \\uC694\\uCCAD\n#XCOL\nColumn.PageCreatedBy=\\uC0DD\\uC131\\uC790\n#XCOL\nColumn.PageCreatedOn=\\uC0DD\\uC131\\uC77C\n#XCOL\nColumn.PageChangedBy=\\uBCC0\\uACBD\\uC790\n#XCOL\nColumn.PageChangedOn=\\uBCC0\\uACBD\\uC77C\n\n#XTOL\nPlaceholder.SectionName=\\uC139\\uC158 \\uC774\\uB984\\uC744 \\uC785\\uB825\\uD558\\uC2ED\\uC2DC\\uC624.\n#XTOL\nPlaceholder.SearchForTiles=\\uD0C0\\uC77C \\uAC80\\uC0C9\n#XTOL\nPlaceholder.SearchForRoles=\\uC5ED\\uD560 \\uAC80\\uC0C9\n#XTOL\nPlaceholder.CopyPageTitle="{0}" \\uBCF5\\uC0AC\n#XTOL\nPlaceholder.CopyPageID="{0}" \\uBCF5\\uC0AC\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=\\uBAA8\\uB450\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=\\uC139\\uC158 {0}\\uC5D0 \\uC81C\\uBAA9\\uC774 \\uC5C6\\uC2B5\\uB2C8\\uB2E4. \\uC77C\\uAD00\\uC801 \\uC0AC\\uC6A9\\uC790 \\uACBD\\uD5D8\\uC744 \\uC704\\uD574\\uC11C \\uAC01 \\uC139\\uC158\\uC758 \\uC774\\uB984\\uC744 \\uC785\\uB825\\uD558\\uB294 \\uAC83\\uC774 \\uC88B\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nMessage.InvalidSectionTitle=\\uC139\\uC158 \\uC774\\uB984\\uC744 \\uC785\\uB825\\uD558\\uB294 \\uAC83\\uC774 \\uBC14\\uB78C\\uC9C1\\uD569\\uB2C8\\uB2E4.\n#XMSG\nMessage.NoInternetConnection=\\uC778\\uD130\\uB137 \\uC5F0\\uACB0\\uC744 \\uC810\\uAC80\\uD558\\uC2ED\\uC2DC\\uC624.\n#XMSG\nMessage.SavedChanges=\\uBCC0\\uACBD \\uB0B4\\uC6A9\\uC774 \\uC800\\uC7A5\\uB418\\uC5C8\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nMessage.InvalidPageID=A-Z, 0-9, _, / \\uBB38\\uC790\\uB9CC \\uC0AC\\uC6A9\\uD558\\uC2ED\\uC2DC\\uC624. \\uD398\\uC774\\uC9C0 ID\\uB294 \\uC22B\\uC790\\uB85C \\uC2DC\\uC791\\uD560 \\uC218 \\uC5C6\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nMessage.EmptyPageID=\\uC720\\uD6A8\\uD55C \\uD398\\uC774\\uC9C0 ID\\uB97C \\uC785\\uB825\\uD558\\uC2ED\\uC2DC\\uC624.\n#XMSG\nMessage.EmptyTitle=\\uC720\\uD6A8\\uD55C \\uC81C\\uBAA9\\uC744 \\uC785\\uB825\\uD558\\uC2ED\\uC2DC\\uC624.\n#XMSG\nMessage.NoRoleSelected=\\uC5ED\\uD560\\uC744 \\uD558\\uB098 \\uC774\\uC0C1 \\uC120\\uD0DD\\uD558\\uC2ED\\uC2DC\\uC624.\n#XMSG\nMessage.SuccessDeletePage=\\uC120\\uD0DD\\uD55C \\uC624\\uBE0C\\uC81D\\uD2B8\\uAC00 \\uC0AD\\uC81C\\uB418\\uC5C8\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nMessage.ClipboardCopySuccess=\\uC138\\uBD80\\uC0AC\\uD56D\\uC774 \\uBCF5\\uC0AC\\uB418\\uC5C8\\uC2B5\\uB2C8\\uB2E4.\n#YMSE\nMessage.ClipboardCopyFail=\\uC138\\uBD80\\uC0AC\\uD56D \\uBCF5\\uC0AC \\uC911 \\uC624\\uB958\\uAC00 \\uBC1C\\uC0DD\\uD588\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nMessage.PageCreated=\\uD398\\uC774\\uC9C0\\uAC00 \\uC0DD\\uC131\\uB418\\uC5C8\\uC2B5\\uB2C8\\uB2E4.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=\\uD0C0\\uC77C\\uC774 \\uC5C6\\uC2B5\\uB2C8\\uB2E4.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=\\uC0AC\\uC6A9 \\uAC00\\uB2A5\\uD55C \\uC5ED\\uD560\\uC774 \\uC5C6\\uC2B5\\uB2C8\\uB2E4.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=\\uC5ED\\uD560\\uC774 \\uC5C6\\uC2B5\\uB2C8\\uB2E4. \\uAC80\\uC0C9\\uC744 \\uC870\\uC815\\uD558\\uC2ED\\uC2DC\\uC624.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=\\uC139\\uC158\\uC774 \\uC5C6\\uC2B5\\uB2C8\\uB2E4.\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError="{1}" \\uC139\\uC158\\uC5D0\\uC11C {0} \\uD0C0\\uC77C\\uC744 \\uB85C\\uB4DC\\uD558\\uC9C0 \\uBABB\\uD588\\uC2B5\\uB2C8\\uB2E4.\\n\\n\\uC774\\uB294 SAP Fiori LaunchPad \\uCEE8\\uD150\\uD2B8\\uC758 \\uC798\\uBABB\\uB41C \\uAD6C\\uC131\\uC774 \\uC6D0\\uC778\\uC77C \\uC218 \\uC788\\uC2B5\\uB2C8\\uB2E4. \\uC2DC\\uAC01\\uD654\\uAC00 \\uC0AC\\uC6A9\\uC790\\uC5D0\\uAC8C \\uD45C\\uC2DC\\uB418\\uC9C0 \\uC54A\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nMessage.NavigationTargetError=\\uD0D0\\uC0C9 \\uB300\\uC0C1\\uC744 \\uACB0\\uC815\\uD560 \\uC218 \\uC5C6\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nMessage.LoadPageError=\\uD398\\uC774\\uC9C0\\uB97C \\uB85C\\uB4DC\\uD560 \\uC218 \\uC5C6\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nMessage.UpdatePageError=\\uD398\\uC774\\uC9C0\\uB97C \\uC5C5\\uB370\\uC774\\uD2B8\\uD560 \\uC218 \\uC5C6\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nMessage.CreatePageError=\\uD398\\uC774\\uC9C0\\uB97C \\uC0DD\\uC131\\uD560 \\uC218 \\uC5C6\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nMessage.TilesHaveErrors=\\uC77C\\uBD80 \\uD0C0\\uC77C \\uB610\\uB294 \\uC139\\uC158\\uC5D0 \\uC624\\uB958\\uAC00 \\uC788\\uC2B5\\uB2C8\\uB2E4. \\uACC4\\uC18D \\uC800\\uC7A5\\uD558\\uC2DC\\uACA0\\uC2B5\\uB2C8\\uAE4C?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=\\uD0C0\\uC77C "{0}"\\uC758 \\uD0D0\\uC0C9 \\uB300\\uC0C1\\uC744 \\uACB0\\uC815\\uD558\\uC9C0 \\uBABB\\uD588\\uC2B5\\uB2C8\\uB2E4.\\n\\n\\uC774\\uB294 SAP Fiori LaunchPad \\uCEE8\\uD150\\uD2B8\\uC758 \\uC798\\uBABB\\uB41C \\uAD6C\\uC131\\uC774 \\uC6D0\\uC778\\uC77C \\uC218 \\uC788\\uC2B5\\uB2C8\\uB2E4. \\uC2DC\\uAC01\\uD654\\uC5D0\\uC11C \\uC5B4\\uD50C\\uB9AC\\uCF00\\uC774\\uC158\\uC744 \\uC5F4 \\uC218 \\uC5C6\\uC2B5\\uB2C8\\uB2E4.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=\\uC139\\uC158 "{0}"\\uC744(\\uB97C) \\uC0AD\\uC81C\\uD558\\uC2DC\\uACA0\\uC2B5\\uB2C8\\uAE4C?\n#XMSG\nMessage.Section.DeleteNoTitle=\\uC774 \\uC139\\uC158\\uC744 \\uC0AD\\uC81C\\uD558\\uC2DC\\uACA0\\uC2B5\\uB2C8\\uAE4C?\n#XMSG\nMessage.OverwriteChanges=\\uD398\\uC774\\uC9C0\\uB97C \\uD3B8\\uC9D1\\uD558\\uB294 \\uB3D9\\uC548 \\uBCC0\\uACBD\\uB418\\uC5C8\\uC2B5\\uB2C8\\uB2E4. \\uB36E\\uC5B4\\uC4F0\\uC2DC\\uACA0\\uC2B5\\uB2C8\\uAE4C?\n#XMSG\nMessage.OverwriteRemovedPage=\\uC791\\uC5C5 \\uC911\\uC778 \\uD398\\uC774\\uC9C0\\uAC00 \\uB2E4\\uB978 \\uC0AC\\uC6A9\\uC790\\uC5D0 \\uC758\\uD574 \\uC0AD\\uC81C\\uB418\\uC5C8\\uC2B5\\uB2C8\\uB2E4. \\uC774 \\uBCC0\\uACBD\\uC0AC\\uD56D\\uC744 \\uB36E\\uC5B4\\uC4F0\\uC2DC\\uACA0\\uC2B5\\uB2C8\\uAE4C?\n#XMSG\nMessage.SaveChanges=\\uBCC0\\uACBD\\uC0AC\\uD56D\\uC744 \\uC800\\uC7A5\\uD558\\uC2ED\\uC2DC\\uC624.\n#XMSG\nMessage.NoPages=\\uC0AC\\uC6A9 \\uAC00\\uB2A5\\uD55C \\uD398\\uC774\\uC9C0\\uAC00 \\uC5C6\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nMessage.NoPagesFound=\\uD398\\uC774\\uC9C0\\uAC00 \\uC5C6\\uC2B5\\uB2C8\\uB2E4. \\uAC80\\uC0C9\\uC744 \\uC870\\uC815\\uD558\\uC2ED\\uC2DC\\uC624.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=\\uCEE8\\uD150\\uD2B8\\uAC00 \\uC5ED\\uD560 \\uCEE8\\uD14D\\uC2A4\\uD2B8\\uB85C \\uC81C\\uD55C\\uB418\\uC5C8\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nMessage.NotAssigned=\\uC9C0\\uC815\\uB418\\uC9C0 \\uC54A\\uC74C\n#XMSG\nMessage.StatusAssigned=\\uC9C0\\uC815\\uB428\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=\\uC2E0\\uADDC \\uD398\\uC774\\uC9C0\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=\\uC5ED\\uD560 \\uCEE8\\uD14D\\uC2A4\\uD2B8 \\uC120\\uD0DD\n#XTIT\nTitle.TilesHaveErrors=\\uD0C0\\uC77C\\uC5D0 \\uC624\\uB958 \\uC788\\uC74C\n#XTIT\nDeleteDialog.Title=\\uC0AD\\uC81C\n#XMSG\nDeleteDialog.Text=\\uC120\\uD0DD\\uD55C \\uD398\\uC774\\uC9C0\\uB97C \\uC0AD\\uC81C\\uD558\\uC2DC\\uACA0\\uC2B5\\uB2C8\\uAE4C?\n#XBUT\nDeleteDialog.ConfirmButton=\\uC0AD\\uC81C\n#XTIT\nDeleteDialog.LockedTitle=\\uD398\\uC774\\uC9C0 \\uC7A0\\uAE40\n#XMSG\nDeleteDialog.LockedText=\\uC120\\uD0DD\\uD55C \\uD398\\uC774\\uC9C0\\uB97C "{0}" \\uC0AC\\uC6A9\\uC790\\uAC00 \\uC7A0\\uAC14\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nDeleteDialog.TransportRequired=\\uC120\\uD0DD\\uD55C \\uD398\\uC774\\uC9C0\\uB97C \\uC0AD\\uC81C\\uD558\\uB824\\uBA74 \\uC804\\uC1A1 \\uD328\\uD0A4\\uC9C0\\uB97C \\uC120\\uD0DD\\uD558\\uC2ED\\uC2DC\\uC624.\n\n#XMSG\nEditDialog.LockedText=\\uC120\\uD0DD\\uD55C \\uD398\\uC774\\uC9C0\\uB97C "{0}" \\uC0AC\\uC6A9\\uC790\\uAC00 \\uC7A0\\uAC14\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nEditDialog.TransportRequired=\\uC120\\uD0DD\\uD55C \\uD398\\uC774\\uC9C0\\uB97C \\uD3B8\\uC9D1\\uD558\\uB824\\uBA74 \\uC804\\uC1A1 \\uD328\\uD0A4\\uC9C0\\uB97C \\uC120\\uD0DD\\uD558\\uC2ED\\uC2DC\\uC624.\n#XTIT\nEditDialog.Title=\\uD398\\uC774\\uC9C0 \\uD3B8\\uC9D1\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=\\uC774 \\uD398\\uC774\\uC9C0\\uB294 "{0}" \\uC5B8\\uC5B4\\uB85C \\uC0DD\\uC131\\uB418\\uC5C8\\uC9C0\\uB9CC \\uB85C\\uADF8\\uC628 \\uC5B8\\uC5B4\\uAC00 "{1}"(\\uC73C)\\uB85C \\uC124\\uC815\\uB418\\uC5B4 \\uC788\\uC2B5\\uB2C8\\uB2E4. \\uACC4\\uC18D\\uD558\\uB824\\uBA74 \\uB85C\\uADF8\\uC628 \\uC5B8\\uC5B4\\uB97C "{0}"(\\uC73C)\\uB85C \\uBCC0\\uACBD\\uD558\\uC2ED\\uC2DC\\uC624.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=\\uBD80\\uC81C\\uBAA9\n#XFLD\nTileInfoPopover.Label.Icon=\\uC544\\uC774\\uCF58\n#XFLD\nTileInfoPopover.Label.SemanticObject=\\uC2DC\\uB9E8\\uD2F1 \\uC624\\uBE0C\\uC81D\\uD2B8\n#XFLD\nTileInfoPopover.Label.SemanticAction=\\uC2DC\\uB9E8\\uD2F1 \\uC561\\uC158\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori ID\n#XFLD\nTileInfoPopover.Label.AppDetail=\\uC571 \\uC138\\uBD80\\uC0AC\\uD56D\n#XFLD\nTileInfoPopover.Label.AppType=\\uC571 \\uC720\\uD615\n#XFLD\nTileInfoPopover.Label.TileType=\\uD0C0\\uC77C \\uC720\\uD615\n#XFLD\nTileInfoPopover.Label.AvailableDevices=\\uC0AC\\uC6A9 \\uAC00\\uB2A5\\uD55C \\uC7A5\\uCE58\n\n#XTIT\nErrorDialog.Title=\\uC624\\uB958\n\n#XTIT\nConfirmChangesDialog.Title=\\uACBD\\uACE0\n\n#XTIT\nPageOverview.Title=\\uD398\\uC774\\uC9C0 \\uC720\\uC9C0\\uBCF4\\uC218\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=\\uB808\\uC774\\uC544\\uC6C3\n\n#XTIT\nCopyDialog.Title=\\uD398\\uC774\\uC9C0 \\uBCF5\\uC0AC\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message="{0}"\\uC744(\\uB97C) \\uBCF5\\uC0AC\\uD558\\uC2DC\\uACA0\\uC2B5\\uB2C8\\uAE4C?\n#XFLD\nCopyDialog.NewID="{0}" \\uBCF5\\uC0AC\n\n#XMSG\nTitle.NoSectionTitle=\\uC139\\uC158 {0}\\uC758 \\uC139\\uC158 \\uD0C0\\uC77C\\uC774 \\uBE44\\uC5B4 \\uC788\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nTitle.UnsufficientRoles=\\uC2DC\\uAC01\\uD654\\uB97C \\uD45C\\uC2DC\\uD560 \\uC5ED\\uD560 \\uC9C0\\uC815\\uC774 \\uBD80\\uC871\\uD569\\uB2C8\\uB2E4.\n#XMSG\nTitle.VisualizationIsNotVisible=\\uC2DC\\uAC01\\uD654\\uAC00 \\uD45C\\uC2DC\\uB418\\uC9C0 \\uC54A\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nTitle.VisualizationNotNavigateable=\\uC2DC\\uAC01\\uD654\\uC5D0\\uC11C \\uC571\\uC744 \\uC5F4 \\uC218 \\uC5C6\\uC2B5\\uB2C8\\uB2E4.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=\\uC815\\uC801 \\uD0C0\\uC77C\n#XTIT\nTitle.DynamicTile=\\uB3D9\\uC801 \\uD0C0\\uC77C\n#XTIT\nTitle.CustomTile=\\uC0AC\\uC6A9\\uC790 \\uC815\\uC758 \\uD0C0\\uC77C\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=\\uD398\\uC774\\uC9C0 \\uBBF8\\uB9AC\\uBCF4\\uAE30\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=\\uC8C4\\uC1A1\\uD569\\uB2C8\\uB2E4. \\uC774 \\uD398\\uC774\\uC9C0\\uB97C \\uCC3E\\uC744 \\uC218 \\uC5C6\\uC2B5\\uB2C8\\uB2E4.\n#XLNK\nErrorPage.Link=\\uD398\\uC774\\uC9C0 \\uC720\\uC9C0\\uBCF4\\uC218\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_lt.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=Tvarkyti keli\\u0173 klient\\u0173 puslapius\n\n#XBUT\nButton.Add=Prid\\u0117ti\n#XBUT\nButton.Cancel=At\\u0161aukti\n#XBUT\nButton.ClosePreview=U\\u017Edaryti per\\u017Ei\\u016Br\\u0105\n#XBUT\nButton.Copy=Kopijuoti\n#XBUT\nButton.Create=Kurti\n#XBUT\nButton.Delete=Naikinti\n#XBUT\nButton.Edit=Redaguoti\n#XBUT\nButton.Save=\\u012Era\\u0161yti\n#XBUT\nButton.Select=Pasirinkti\n#XBUT\nButton.Ok=Gerai\n#XBUT\nButton.ShowCatalogs=Rodyti katalogus\n#XBUT\nButton.HideCatalogs=Sl\\u0117pti katalogus\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Problemos\\: {0}\n#XBUT\nButton.SortCatalogs=Perjungti katalogo r\\u016B\\u0161iavimo tvark\\u0105\n#XBUT\nButton.CollapseCatalogs=Sutraukti visus katalogus\n#XBUT\nButton.ExpandCatalogs=I\\u0161pl\\u0117sti visus katalogus\n#XBUT\nButton.ShowDetails=Rodyti i\\u0161sami\\u0105 informacij\\u0105\n#XBUT\nButton.PagePreview=Puslapio per\\u017Ei\\u016Bra\n#XBUT\nButton.ErrorMsg=Klaid\\u0173 prane\\u0161imai\n#XBUT\nButton.EditHeader=Redaguoti antra\\u0161t\\u0119\n#XBUT\nButton.ContextSelector=Pasirinkti vaidmens kontekst\\u0105 {0}\n#XBUT\nButton.OverwriteChanges=Perra\\u0161yti\n#XBUT\nButton.DismissChanges=Atmesti keitimus\n\n#XTOL\nTooltip.AddToSections=\\u012Etraukti \\u012F skyrius\n#XTOL: Tooltip for the search button\nTooltip.Search=Ie\\u0161koti\n#XTOL\nTooltip.SearchForTiles=Ie\\u0161koti poekrani\\u0173\n#XTOL\nTooltip.SearchForRoles=Ie\\u0161koti vaidmen\\u0173\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Darbalaukis\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=\\u017Di\\u016Br\\u0117ti r\\u016B\\u0161iavimo parametrus\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=\\u017Di\\u016Br\\u0117ti filtro parametrus\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=\\u017Di\\u016Br\\u0117ti grup\\u0117s parametrus\n\n#XFLD\nLabel.PageID=Puslapio ID\n#XFLD\nLabel.Title=Antra\\u0161t\\u0117\n#XFLD\nLabel.WorkbenchRequest=Instrumentini\\u0173 priemoni\\u0173 u\\u017Eklausa\n#XFLD\nLabel.Package=Paketas\n#XFLD\nLabel.TransportInformation=Transporto informacija\n#XFLD\nLabel.Details=I\\u0161sami informacija\\:\n#XFLD\nLabel.ResponseCode=Atsakymo kodas\\:\n#XFLD\nLabel.ModifiedBy=Modifikavo\\:\n#XFLD\nLabel.Description=Apra\\u0161as\n#XFLD\nLabel.CreatedByFullname=Autorius\n#XFLD\nLabel.CreatedOn=Suk\\u016Brimo data\n#XFLD\nLabel.ChangedByFullname=Keitimo autorius\n#XFLD\nLabel.ChangedOn=Keitimo data\n#XFLD\nLabel.PageTitle=Puslapio pavadinimas\n#XFLD\nLabel.AssignedRole=Priskirtas vaidmuo\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Antra\\u0161t\\u0117\n#XCOL\nColumn.PageDescription=Apra\\u0161as\n#XCOL\nColumn.PageAssignmentStatus=Priskirta plotui / vaidmeniui\n#XCOL\nColumn.PagePackage=Paketas\n#XCOL\nColumn.PageWorkbenchRequest=Instrumentini\\u0173 priemoni\\u0173 u\\u017Eklausa\n#XCOL\nColumn.PageCreatedBy=Autorius\n#XCOL\nColumn.PageCreatedOn=Suk\\u016Brimo data\n#XCOL\nColumn.PageChangedBy=Keitimo autorius\n#XCOL\nColumn.PageChangedOn=Keitimo data\n\n#XTOL\nPlaceholder.SectionName=\\u012Evesti skyriaus pavadinim\\u0105\n#XTOL\nPlaceholder.SearchForTiles=Ie\\u0161koti poekrani\\u0173\n#XTOL\nPlaceholder.SearchForRoles=Ie\\u0161koti vaidmen\\u0173\n#XTOL\nPlaceholder.CopyPageTitle={0} kopija\n#XTOL\nPlaceholder.CopyPageID={0} kopija\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=Visi\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=Skyrius {0} neturi pavadinimo. Siekiant u\\u017Etikrinti pastov\\u0105 vartotoj\\u0173 patirt\\u012F, rekomenduojame \\u012Fvesti kiekvieno skyriaus pavadinim\\u0105.\n#XMSG\nMessage.InvalidSectionTitle=Idealiu atveju, tur\\u0117tum\\u0117te \\u012Fvesti skyriaus pavadinim\\u0105.\n#XMSG\nMessage.NoInternetConnection=Patikrinkite interneto ry\\u0161\\u012F.\n#XMSG\nMessage.SavedChanges=J\\u016Bs\\u0173 pakeitimai \\u012Fra\\u0161yti.\n#XMSG\nMessage.InvalidPageID=Naudokite tik \\u0161iuos simbolius\\: A\\u2013Z, 0\\u20139, _ ir /. Puslapio ID negali prasid\\u0117ti skaitmeniu.\n#XMSG\nMessage.EmptyPageID=Pateikite galiojant\\u012F puslapio ID.\n#XMSG\nMessage.EmptyTitle=Pateikite galiojant\\u012F pavadinim\\u0105.\n#XMSG\nMessage.NoRoleSelected=Pasirinkite bent vien\\u0105 vaidmen\\u012F.\n#XMSG\nMessage.SuccessDeletePage=Pasirinktas objektas buvo panaikintas.\n#XMSG\nMessage.ClipboardCopySuccess=Informacija nukopijuota s\\u0117kmingai.\n#YMSE\nMessage.ClipboardCopyFail=Kopijuojant informacij\\u0105 \\u012Fvyko klaida.\n#XMSG\nMessage.PageCreated=Puslapis sukurtas.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=N\\u0117ra poekrani\\u0173\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=N\\u0117ra prieinam\\u0173 vaidmen\\u0173.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=Nerasta vaidmen\\u0173. Pabandykite pakoreguoti ie\\u0161kos kriterijus.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=N\\u0117ra skyri\\u0173.\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=Poekranio {0} nepavyko \\u012Fkelti \\u012F skyri\\u0173 \\u201E{1}\\u201C.\\n\\nTai grei\\u010Diausiai \\u012Fvyko d\\u0117l netinkamos \\u201ESAP Fiori\\u201C paleidimo skydelio turinio konfig\\u016Bracijos. Vartotojas nematys vizualizacijos.\n#XMSG\nMessage.NavigationTargetError=Nar\\u0161ymo tikslo nepavyko i\\u0161spr\\u0119sti.\n#XMSG\nMessage.LoadPageError=Nepavyko \\u012Fkelti puslapio\n#XMSG\nMessage.UpdatePageError=Nepavyko atnaujinti puslapio\n#XMSG\nMessage.CreatePageError=Nepavyko sukurti puslapio\n#XMSG\nMessage.TilesHaveErrors=Kai kuriuose poekranuose arba skyriuose yra klaid\\u0173. Ar tikrai norite t\\u0119sti?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=Nepavyko i\\u0161spr\\u0119sti poekranio \\u201E{0}\\u201C nar\\u0161ymo tikslo klaidos.\\n\\nTai grei\\u010Diausiai \\u012Fvyko d\\u0117l netinkamos \\u201ESAP Fiori\\u201C paleidimo skydelio turinio konfig\\u016Bracijos. Vartotojas nematys vizualizacijos.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=Ar tikrai norite panaikinti skyri\\u0173 \\u201E{0}\\u201C?\n#XMSG\nMessage.Section.DeleteNoTitle=Ar tikrai norite naikinti \\u0161\\u012F skyri\\u0173?\n#XMSG\nMessage.OverwriteChanges=Jums redaguojant puslap\\u012F, \\u012Fvyko keitimai. Ar norite juos perra\\u0161yti?\n#XMSG\nMessage.OverwriteRemovedPage=J\\u016Bs\\u0173 tvarkom\\u0105 puslap\\u012F i\\u0161tryn\\u0117 kitas vartotojas. Ar norite perra\\u0161yti \\u0161\\u012F keitim\\u0105?\n#XMSG\nMessage.SaveChanges=\\u012Era\\u0161ykite savo keitimus.\n#XMSG\nMessage.NoPages=Puslapi\\u0173 n\\u0117ra.\n#XMSG\nMessage.NoPagesFound=Puslapi\\u0173 nerasta. Pabandykite pakoreguoti ie\\u0161kos kriterijus.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Turinys apribotas vaidmen\\u0173 kontekste.\n#XMSG\nMessage.NotAssigned=Nepriskirta.\n#XMSG\nMessage.StatusAssigned=Priskirta.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=Naujas puslapis\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=Pasirinkite vaidmens kontekst\\u0105\n#XTIT\nTitle.TilesHaveErrors=Poekraniuose yra klaid\\u0173.\n#XTIT\nDeleteDialog.Title=Naikinti\n#XMSG\nDeleteDialog.Text=Ar tikrai norite naikinti pasirinkt\\u0105 puslap\\u012F?\n#XBUT\nDeleteDialog.ConfirmButton=Naikinti\n#XTIT\nDeleteDialog.LockedTitle=Puslapis u\\u017Erakintas.\n#XMSG\nDeleteDialog.LockedText=Pasirinkt\\u0105 puslap\\u012F u\\u017Erakino vartotojas {0}.\n#XMSG\nDeleteDialog.TransportRequired=Kad panaikintum\\u0117te pasirinkt\\u0105 puslap\\u012F, pasirinkite transportavimo paket\\u0105.\n\n#XMSG\nEditDialog.LockedText=Pasirinkt\\u0105 puslap\\u012F u\\u017Erakino vartotojas {0}.\n#XMSG\nEditDialog.TransportRequired=Kad gal\\u0117tum\\u0117te redaguoti pasirinkt\\u0105 puslap\\u012F, pasirinkite transportavimo paket\\u0105.\n#XTIT\nEditDialog.Title=Redaguoti puslap\\u012F\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=\\u0160is puslapis sukurtas \\u201E{0}\\u201C kalba, ta\\u010Diau j\\u016Bs\\u0173 \\u012F\\u0117jimo kalba nustatyta kaip \\u201E{1}\\u201C. Pakeiskite savo \\u012F\\u0117jimo kalb\\u0105 \\u012F \\u201E{0}\\u201C, kad gal\\u0117tum\\u0117te t\\u0119sti.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Paantra\\u0161t\\u0117\n#XFLD\nTileInfoPopover.Label.Icon=Piktograma\n#XFLD\nTileInfoPopover.Label.SemanticObject=Semantinis objektas\n#XFLD\nTileInfoPopover.Label.SemanticAction=Semantinis veiksmas\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori ID\n#XFLD\nTileInfoPopover.Label.AppDetail=I\\u0161sami taikomosios programos informacija\n#XFLD\nTileInfoPopover.Label.AppType=Taikomosios programos tipas\n#XFLD\nTileInfoPopover.Label.TileType=Poekranio tipas\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Prieinami \\u012Frenginiai\n\n#XTIT\nErrorDialog.Title=Klaida\n\n#XTIT\nConfirmChangesDialog.Title=\\u012Esp\\u0117jimas\n\n#XTIT\nPageOverview.Title=Tvarkyti puslapius\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=I\\u0161d\\u0117stymas\n\n#XTIT\nCopyDialog.Title=Kopijuoti puslap\\u012F\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=Ar norite nukopijuoti {0}?\n#XFLD\nCopyDialog.NewID={0} kopija\n\n#XMSG\nTitle.NoSectionTitle=Skyriaus {0} skyriaus pavadinimo vieta yra tu\\u0161\\u010Dia.\n#XMSG\nTitle.UnsufficientRoles=Nepakankamas vaidmens priskyrimas, kad b\\u016Bt\\u0173 rodoma vizualizacija.\n#XMSG\nTitle.VisualizationIsNotVisible=Vartotojas nematys vizualizacijos.\n#XMSG\nTitle.VisualizationNotNavigateable=Vizualizacija negali atidaryti programos,\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Statinis poekranis\n#XTIT\nTitle.DynamicTile=Dinaminis porekranis\n#XTIT\nTitle.CustomTile=Pasirinktinis poekranis\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=Puslapio per\\u017Ei\\u016Bra\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=Apgailestaujame, \\u0161io puslapio rasti nepavyko.\n#XLNK\nErrorPage.Link=Tvarkyti puslapius\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_lv.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=Uztur\\u0113t lapas klient\\u0101\n\n#XBUT\nButton.Add=Pievienot\n#XBUT\nButton.Cancel=Atcelt\n#XBUT\nButton.ClosePreview=Close Preview\n#XBUT\nButton.Copy=Kop\\u0113t\n#XBUT\nButton.Create=Izveidot\n#XBUT\nButton.Delete=Dz\\u0113st\n#XBUT\nButton.Edit=Redi\\u0123\\u0113t\n#XBUT\nButton.Save=Saglab\\u0101t\n#XBUT\nButton.Select=Atlas\\u012Bt\n#XBUT\nButton.Ok=Labi\n#XBUT\nButton.ShowCatalogs=R\\u0101d\\u012Bt katalogus\n#XBUT\nButton.HideCatalogs=Pasl\\u0113pt katalogus\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Probl\\u0113mas\\: {0}\n#XBUT\nButton.SortCatalogs=P\\u0101rsl\\u0113gt kataloga k\\u0101rto\\u0161anas sec\\u012Bbu\n#XBUT\nButton.CollapseCatalogs=Sak\\u013Caut visus katalogus\n#XBUT\nButton.ExpandCatalogs=Izv\\u0113rst visus katalogus\n#XBUT\nButton.ShowDetails=R\\u0101d\\u012Bt detaliz\\u0113tu inform\\u0101ciju\n#XBUT\nButton.PagePreview=Lapas priek\\u0161skat\\u012Bjums\n#XBUT\nButton.ErrorMsg=K\\u013C\\u016Bdu zi\\u0146ojumi\n#XBUT\nButton.EditHeader=Redi\\u0123\\u0113t galveni\n#XBUT\nButton.ContextSelector=Select Role Context {0}\n#XBUT\nButton.OverwriteChanges=Overwrite\n#XBUT\nButton.DismissChanges=Dismiss Changes\n\n#XTOL\nTooltip.AddToSections=Pievienot sada\\u013C\\u0101m\n#XTOL: Tooltip for the search button\nTooltip.Search=Mekl\\u0113t\n#XTOL\nTooltip.SearchForTiles=Mekl\\u0113t moza\\u012Bkas\n#XTOL\nTooltip.SearchForRoles=Search for Roles\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Darbvirsma\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=View Sort Settings\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=View Filter Settings\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=View Group Settings\n\n#XFLD\nLabel.PageID=Lapas ID\n#XFLD\nLabel.Title=Virsraksts\n#XFLD\nLabel.WorkbenchRequest=Darbtelpas piepras\\u012Bjums\n#XFLD\nLabel.Package=Pakotne\n#XFLD\nLabel.TransportInformation=Transporta inform\\u0101cija\n#XFLD\nLabel.Details=Detaliz\\u0113ta inform\\u0101cija\\:\n#XFLD\nLabel.ResponseCode=Atbildes kods\\:\n#XFLD\nLabel.ModifiedBy=Modified by\\:\n#XFLD\nLabel.Description=Apraksts\n#XFLD\nLabel.CreatedByFullname=Izveidoja\n#XFLD\nLabel.CreatedOn=Izveides datums\n#XFLD\nLabel.ChangedByFullname=Main\\u012Bja\n#XFLD\nLabel.ChangedOn=Main\\u012B\\u0161anas datums\n#XFLD\nLabel.PageTitle=Lapas virsraksts\n#XFLD\nLabel.AssignedRole=Pie\\u0161\\u0137irt\\u0101 loma\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Virsraksts\n#XCOL\nColumn.PageDescription=Apraksts\n#XCOL\nColumn.PageAssignmentStatus=Assigned to Space/Role\n#XCOL\nColumn.PagePackage=Pakotne\n#XCOL\nColumn.PageWorkbenchRequest=Darbtelpas piepras\\u012Bjums\n#XCOL\nColumn.PageCreatedBy=Izveidoja\n#XCOL\nColumn.PageCreatedOn=Izveides datums\n#XCOL\nColumn.PageChangedBy=Main\\u012Bja\n#XCOL\nColumn.PageChangedOn=Main\\u012B\\u0161anas datums\n\n#XTOL\nPlaceholder.SectionName=Ievad\\u012Bt sada\\u013Cas nosaukumu\n#XTOL\nPlaceholder.SearchForTiles=Mekl\\u0113t moza\\u012Bkas\n#XTOL\nPlaceholder.SearchForRoles=Search for roles\n#XTOL\nPlaceholder.CopyPageTitle=Kopija no "{0}"\n#XTOL\nPlaceholder.CopyPageID=Kopija no "{0}"\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=all\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=Sada\\u013Cai {0} nav virsraksta. Lai lietot\\u0101ja pieredze b\\u016Btu nepretrun\\u012Bga, m\\u0113s iesak\\u0101m ievad\\u012Bt katras sada\\u013Cas nosaukumu.\n#XMSG\nMessage.InvalidSectionTitle=Ide\\u0101l\\u0101 variant\\u0101 jums j\\u0101ievada sada\\u013Cas nosaukums.\n#XMSG\nMessage.NoInternetConnection=L\\u016Bdzu, p\\u0101rbaudiet interneta savienojumu.\n#XMSG\nMessage.SavedChanges=J\\u016Bsu veikt\\u0101s izmai\\u0146as ir saglab\\u0101tas.\n#XMSG\nMessage.InvalidPageID=L\\u016Bdzu, izmantojiet \\u0161\\u012Bs rakstz\\u012Bmes\\: A-Z, 0-9 un _ /. Lapa nedr\\u012Bkst s\\u0101kties ar skaitli.\n#XMSG\nMessage.EmptyPageID=L\\u016Bdzu, nodro\\u0161iniet der\\u012Bgu lapas ID.\n#XMSG\nMessage.EmptyTitle=L\\u016Bdzu, nodro\\u0161iniet der\\u012Bgu virsrakstu.\n#XMSG\nMessage.NoRoleSelected=L\\u016Bdzu, atlasiet vismaz vienu lomu.\n#XMSG\nMessage.SuccessDeletePage=Atlas\\u012Btais objekts tika izdz\\u0113sts.\n#XMSG\nMessage.ClipboardCopySuccess=Detaliz\\u0113t\\u0101 inform\\u0101cija ir sekm\\u012Bgi nokop\\u0113ta.\n#YMSE\nMessage.ClipboardCopyFail=Kop\\u0113jot detaliz\\u0113to inform\\u0101ciju, rad\\u0101s k\\u013C\\u016Bda.\n#XMSG\nMessage.PageCreated=Lapa ir izveidota.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=Bez moza\\u012Bk\\u0101m\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=No roles available.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=No roles found. Try adjusting your search.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=Bez sada\\u013C\\u0101m\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=Neizdev\\u0101s iel\\u0101d\\u0113t {0} fl\\u012Bz\\u012Bti sada\\u013C\\u0101 \\u201C{1}\\u201D.\\n\\nParasti to izraisa nepareiza SAP Fiori palai\\u0161anas pane\\u013Ca satura konfigur\\u0101cija. \\u0160\\u012B vizualiz\\u0101cija lietot\\u0101jam netiks par\\u0101d\\u012Bta.\n#XMSG\nMessage.NavigationTargetError=Navig\\u0101cijas m\\u0113r\\u0137i nevar\\u0113ja atrisin\\u0101t.\n#XMSG\nMessage.LoadPageError=Could not load the page template.\n#XMSG\nMessage.UpdatePageError=Could not update the page template.\n#XMSG\nMessage.CreatePageError=Could not create the page template.\n#XMSG\nMessage.TilesHaveErrors=Da\\u017E\\u0101s fl\\u012Bz\\u012Bt\\u0113s vai sada\\u013C\\u0101s ir k\\u013C\\u016Bdas. Vai tie\\u0161\\u0101m v\\u0113laties turpin\\u0101t saglab\\u0101\\u0161anu?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=Neizdev\\u0101s atrisin\\u0101t fl\\u012Bz\\u012Btes navig\\u0101cijas m\\u0113r\\u0137i\\: "{0}".\\n\\nParasti to izraisa nepareiza SAP Fiori palai\\u0161anas pane\\u013Ca satura konfigur\\u0101cija. \\u0160\\u012B vizualiz\\u0101cija nevar atv\\u0113rt lietojumprogrammu.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=Vai tie\\u0161\\u0101m v\\u0113laties izdz\\u0113st sada\\u013Cu \\u201C{0}\\u201D?\n#XMSG\nMessage.Section.DeleteNoTitle=Vai tie\\u0161\\u0101m v\\u0113laties izdz\\u0113st \\u0161o sada\\u013Cu?\n#XMSG\nMessage.OverwriteChanges=There have been changes while you were editing the page template. Do you want to overwrite them?\n#XMSG\nMessage.OverwriteRemovedPage=The page template you are working on has been deleted by a different user. Do you want to overwrite this change?\n#XMSG\nMessage.SaveChanges=L\\u016Bdzu, saglab\\u0101jiet izmai\\u0146as.\n#XMSG\nMessage.NoPages=Neviena lapa nav pieejama.\n#XMSG\nMessage.NoPagesFound=Neviena lapa nav atrasta. M\\u0113\\u0123iniet kori\\u0123\\u0113t mekl\\u0113\\u0161anu.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Content restricted to role context.\n#XMSG\nMessage.NotAssigned=Not Assigned\n#XMSG\nMessage.StatusAssigned=Assigned\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=Jauna lapa\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=Select Role Context\n#XTIT\nTitle.TilesHaveErrors=Fl\\u012Bz\\u012Bt\\u0113s ir k\\u013C\\u016Bdas\n#XTIT\nDeleteDialog.Title=Dz\\u0113st\n#XMSG\nDeleteDialog.Text=Vai tie\\u0161\\u0101m v\\u0113laties dz\\u0113st atlas\\u012Bto lapu?\n#XBUT\nDeleteDialog.ConfirmButton=Dz\\u0113st\n#XTIT\nDeleteDialog.LockedTitle=Lapa blo\\u0137\\u0113ta\n#XMSG\nDeleteDialog.LockedText=Atlas\\u012Bto lapu blo\\u0137\\u0113ja lietot\\u0101js \\u201C{0}\\u201D.\n#XMSG\nDeleteDialog.TransportRequired=Lai dz\\u0113stu atlas\\u012Bto lapu, l\\u016Bdzu, atlasiet transport\\u0113\\u0161anas pakotni.\n\n#XMSG\nEditDialog.LockedText=Atlas\\u012Bto lapu blo\\u0137\\u0113ja lietot\\u0101js \\u201C{0}\\u201D.\n#XMSG\nEditDialog.TransportRequired=Lai redi\\u0123\\u0113tu atlas\\u012Bto lapu, l\\u016Bdzu, atlasiet transport\\u0113\\u0161anas pakotni.\n#XTIT\nEditDialog.Title=Lapas redi\\u0123\\u0113\\u0161ana\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=\\u0160\\u012B lapa tika izveidota valod\\u0101 "{0}", bet J\\u016Bsu pieteik\\u0161an\\u0101s valoda iestat\\u012Bta uz "{1}". Lai turpin\\u0101tu, l\\u016Bdzu, mainiet pieteik\\u0161an\\u0101s valodu uz "{0}".\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Subtitle\n#XFLD\nTileInfoPopover.Label.Icon=Icon\n#XFLD\nTileInfoPopover.Label.SemanticObject=Semantic Object\n#XFLD\nTileInfoPopover.Label.SemanticAction=Semantic Action\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori ID\n#XFLD\nTileInfoPopover.Label.AppDetail=App Detail\n#XFLD\nTileInfoPopover.Label.AppType=App Type\n#XFLD\nTileInfoPopover.Label.TileType=Tile Type\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Available Devices\n\n#XTIT\nErrorDialog.Title=K\\u013C\\u016Bda\n\n#XTIT\nConfirmChangesDialog.Title=Warning\n\n#XTIT\nPageOverview.Title=Uztur\\u0113t lapas\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=Izk\\u0101rtojums\n\n#XTIT\nCopyDialog.Title=Kop\\u0113t lapu\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=Vai v\\u0113laties kop\\u0113t \\u201C{0}\\u201D?\n#XFLD\nCopyDialog.NewID=Kopija no "{0}"\n\n#XMSG\nTitle.NoSectionTitle=Sada\\u013Cas {0} sada\\u013Cas virsraksts ir tuk\\u0161s.\n#XMSG\nTitle.UnsufficientRoles=Nepietiekama lomas pie\\u0161\\u0137ire, lai par\\u0101d\\u012Btu vizualiz\\u0101ciju.\n#XMSG\nTitle.VisualizationIsNotVisible=Vizualiz\\u0101cija netiks par\\u0101d\\u012Bta.\n#XMSG\nTitle.VisualizationNotNavigateable=Vizualiz\\u0101cija nevar atv\\u0113rt lietojumprogrammu.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Statistisk\\u0101 fl\\u012Bz\\u012Bte\n#XTIT\nTitle.DynamicTile=Dinamisk\\u0101 fl\\u012Bz\\u012Bte\n#XTIT\nTitle.CustomTile=Piel\\u0101gota fl\\u012Bz\\u012Bte\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=Page Template Preview\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=Diem\\u017E\\u0113l \\u0161o lapu nevar\\u0113ja atrast.\n#XLNK\nErrorPage.Link=Uztur\\u0113t lapas\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_ms.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=Selenggarakan Halaman Silang Pelanggan\n\n#XBUT\nButton.Add=Tambah\n#XBUT\nButton.Cancel=Batal\n#XBUT\nButton.ClosePreview=Tutup Pratonton\n#XBUT\nButton.Copy=Salin\n#XBUT\nButton.Create=Cipta\n#XBUT\nButton.Delete=Padam\n#XBUT\nButton.Edit=Edit\n#XBUT\nButton.Save=Simpan\n#XBUT\nButton.Select=Pilih\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=Tunjukkan Katalog\n#XBUT\nButton.HideCatalogs=Sembunyikan Katalog\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Keluaran\\: {0}\n#XBUT\nButton.SortCatalogs=Aturan Isih Katalog Togol\n#XBUT\nButton.CollapseCatalogs=Runtuhkan Semua Katalog\n#XBUT\nButton.ExpandCatalogs=Kembangkan Semua Katalog\n#XBUT\nButton.ShowDetails=Tunjukkan Butiran\n#XBUT\nButton.PagePreview=Pratonton Halaman\n#XBUT\nButton.ErrorMsg=Mesej Ralat\n#XBUT\nButton.EditHeader=Edit Pengepala\n#XBUT\nButton.ContextSelector=Pilih Konteks Fungsi {0}\n#XBUT\nButton.OverwriteChanges=Tulis ganti\n#XBUT\nButton.DismissChanges=Buang Perubahan\n\n#XTOL\nTooltip.AddToSections=Tambah ke Bahagian\n#XTOL: Tooltip for the search button\nTooltip.Search=Cari\n#XTOL\nTooltip.SearchForTiles=Mencari Jubin\n#XTOL\nTooltip.SearchForRoles=Mencari Fungsi\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Desktop\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=Papar Tetapan Isihan\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=Papar Tetapan Penapis\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=Papar Tetapan Kumpulan\n\n#XFLD\nLabel.PageID=ID Halaman\n#XFLD\nLabel.Title=Tajuk\n#XFLD\nLabel.WorkbenchRequest=Permintaan Workbench\n#XFLD\nLabel.Package=Pakej\n#XFLD\nLabel.TransportInformation=Maklumat Pengangkutan\n#XFLD\nLabel.Details=Butiran\\:\n#XFLD\nLabel.ResponseCode=Kod Maklum Balas\\:\n#XFLD\nLabel.ModifiedBy=Diubah suai oleh\\:\n#XFLD\nLabel.Description=Perihalan\n#XFLD\nLabel.CreatedByFullname=Dicipta oleh\n#XFLD\nLabel.CreatedOn=Dicipta pada\n#XFLD\nLabel.ChangedByFullname=Diubah oleh\n#XFLD\nLabel.ChangedOn=Diubah pada\n#XFLD\nLabel.PageTitle=Tajuk Halaman\n#XFLD\nLabel.AssignedRole=Fungsi Diumpukkan\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Tajuk\n#XCOL\nColumn.PageDescription=Perihalan\n#XCOL\nColumn.PageAssignmentStatus=Diumpukkan ke Ruang/Fungsi\n#XCOL\nColumn.PagePackage=Pakej\n#XCOL\nColumn.PageWorkbenchRequest=Permintaan Workbench\n#XCOL\nColumn.PageCreatedBy=Dicipta oleh\n#XCOL\nColumn.PageCreatedOn=Dicipta pada\n#XCOL\nColumn.PageChangedBy=Diubah oleh\n#XCOL\nColumn.PageChangedOn=Diubah pada\n\n#XTOL\nPlaceholder.SectionName=Masukkan nama bahagian\n#XTOL\nPlaceholder.SearchForTiles=Mencari jubin\n#XTOL\nPlaceholder.SearchForRoles=Mencari fungsi\n#XTOL\nPlaceholder.CopyPageTitle=Salinan bagi "{0}"\n#XTOL\nPlaceholder.CopyPageID=Salinan bagi "{0}"\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=semua\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=Bahagian {0} tiada tajuk. Untuk pengalaman pengguna yang konsisten, kami cadangkan anda memasukkan nama untuk setiap bahagian.\n#XMSG\nMessage.InvalidSectionTitle=Anda sepatutnya memasukkan nama bahagian.\n#XMSG\nMessage.NoInternetConnection=Sila semak sambungan internet anda.\n#XMSG\nMessage.SavedChanges=Perubahan anda telah disimpan.\n#XMSG\nMessage.InvalidPageID=Sila gunakan hanya aksara berikut\\: A-Z, 0-9, _ dan /. ID halaman tidak harus bermula dengan nombor.\n#XMSG\nMessage.EmptyPageID=Sila sediakan ID halaman yang sah.\n#XMSG\nMessage.EmptyTitle=Sila sediakan tajuk yang sah.\n#XMSG\nMessage.NoRoleSelected=Sila pilih sekurang-kurangnya satu fungsi.\n#XMSG\nMessage.SuccessDeletePage=Objek terpilih telah dipadam.\n#XMSG\nMessage.ClipboardCopySuccess=Butiran berjaya disalin.\n#YMSE\nMessage.ClipboardCopyFail=Ralat berlaku ketika menyalin butiran.\n#XMSG\nMessage.PageCreated=Halaman telah dicipta.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=Tiada jubin\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=Tiada fungsi tersedia.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=Tiada fungsi ditemui. Cuba laraskan carian anda.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=Tiada bahagian\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=Gagal untuk muat {0} jubin dalam bahagian "{1}".\\n\\nPerkara ini berkemungkinan besar disebabkan oleh konfigurasi kandungan SAP Fiori Launchpad yang salah. Penggambaran tidak akan dipaparkan untuk pengguna.\n#XMSG\nMessage.NavigationTargetError=Sasaran navigasi tidak boleh diselesaikan.\n#XMSG\nMessage.LoadPageError=Tidak dapat memuat halaman.\n#XMSG\nMessage.UpdatePageError=Tidak dapat mengemas kini halaman.\n#XMSG\nMessage.CreatePageError=Tidak dapat mencipta halaman.\n#XMSG\nMessage.TilesHaveErrors=Beberapa jubin atau bahagian mempunyai ralat. Adakah anda pasti ingin terus menyimpan?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=Gagal untuk selesaikan sasaran navigasi bagi jubin\\: "{0}".\\n\\nPerkara ini berkemungkinan besar disebabkan oleh konfigurasi kandungan SAP Fiori launchpad yang tidak sah. Penggambaran tidak boleh membuka aplikasi.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=Adakah anda pasti ingin padam bahagian "{0}"?\n#XMSG\nMessage.Section.DeleteNoTitle=Adakah anda pasti anda ingin padam bahagian ini?\n#XMSG\nMessage.OverwriteChanges=Terdapat perubahan ketika anda mengedit halaman. Adakah anda ingin menulis gantinya?\n#XMSG\nMessage.OverwriteRemovedPage=Halaman yang anda sedang edit telah dipadam oleh pengguna lain. Adakah anda ingin menulis ganti perubahan ini?\n#XMSG\nMessage.SaveChanges=Sila simpan perubahan anda.\n#XMSG\nMessage.NoPages=Tiada halaman tersedia.\n#XMSG\nMessage.NoPagesFound=Tiada halaman ditemui. Sila laraskan carian anda.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Kandungan disekat untuk konteks fungsi.\n#XMSG\nMessage.NotAssigned=Tidak diumpukkan.\n#XMSG\nMessage.StatusAssigned=Diumpukkan\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=Halaman Baharu\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=Pilih Konteks Fungsi\n#XTIT\nTitle.TilesHaveErrors=Jubin Mempunyai Ralat\n#XTIT\nDeleteDialog.Title=Padam\n#XMSG\nDeleteDialog.Text=Adakah anda pasti anda ingin memadam halaman dipilih?\n#XBUT\nDeleteDialog.ConfirmButton=Padam\n#XTIT\nDeleteDialog.LockedTitle=Halaman dikunci\n#XMSG\nDeleteDialog.LockedText=Halaman dipilih dikunci oleh pengguna "{0}".\n#XMSG\nDeleteDialog.TransportRequired=Sila pilih pakej pemindahan untuk memadam halaman dipilih.\n\n#XMSG\nEditDialog.LockedText=Halaman dipilih dikunci oleh pengguna "{0}".\n#XMSG\nEditDialog.TransportRequired=Sila pilih pakej pemindahan untuk mengedit halaman dipilih.\n#XTIT\nEditDialog.Title=Edit Halaman\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=Halaman ini telah dicipta dalam bahasa "{0}" tetapi bahasa log masuk anda ditetapkan kepada "{1}". Sila ubah bahasa log masuk anda kepada "{0}" untuk teruskan.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Subtajuk\n#XFLD\nTileInfoPopover.Label.Icon=Ikon\n#XFLD\nTileInfoPopover.Label.SemanticObject=Objek Semantik\n#XFLD\nTileInfoPopover.Label.SemanticAction=Tindakan Semantik\n#XFLD\nTileInfoPopover.Label.FioriID=ID Fiori\n#XFLD\nTileInfoPopover.Label.AppDetail=Butiran Aplikasi\n#XFLD\nTileInfoPopover.Label.AppType=Jenis Aplikasi\n#XFLD\nTileInfoPopover.Label.TileType=Jenis Jubin\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Peranti Tersedia\n\n#XTIT\nErrorDialog.Title=Ralat\n\n#XTIT\nConfirmChangesDialog.Title=Amaran\n\n#XTIT\nPageOverview.Title=Selenggarakan Halaman\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=Tataletak\n\n#XTIT\nCopyDialog.Title=Salin Halaman\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=Adakah anda ingin salin "{0}"?\n#XFLD\nCopyDialog.NewID=Salinan bagi "{0}"\n\n#XMSG\nTitle.NoSectionTitle=Bahagian tajuk bagi bahagian {0} kosong.\n#XMSG\nTitle.UnsufficientRoles=Kekurangan umpukan fungsi untuk menunjukkan penggambaran.\n#XMSG\nTitle.VisualizationIsNotVisible=Penggambaran tidak akan dipaparkan.\n#XMSG\nTitle.VisualizationNotNavigateable=Penggambaran tidak boleh membuka aplikasi.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Jubin Statik\n#XTIT\nTitle.DynamicTile=Jubin Dinamik\n#XTIT\nTitle.CustomTile=Jubin Tersuai\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=Pratonton Halaman\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=Maaf, kami tidak dapat menemui halaman ini.\n#XLNK\nErrorPage.Link=Selenggarakan Halaman\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_nl.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=Pagina\'s mandantonafhankelijk verzorgen\n\n#XBUT\nButton.Add=Toevoegen\n#XBUT\nButton.Cancel=Afbreken\n#XBUT\nButton.ClosePreview=Preview sluiten\n#XBUT\nButton.Copy=Kopi\\u00EBren\n#XBUT\nButton.Create=Cre\\u00EBren\n#XBUT\nButton.Delete=Verwijderen\n#XBUT\nButton.Edit=Bewerken\n#XBUT\nButton.Save=Opslaan\n#XBUT\nButton.Select=Selecteren\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=Catalogi weergeven\n#XBUT\nButton.HideCatalogs=Catalogi verbergen\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Problemen\\: {0}\n#XBUT\nButton.SortCatalogs=Sorteervolgorde catalogus omschakelen\n#XBUT\nButton.CollapseCatalogs=Alle catalogi verbergen\n#XBUT\nButton.ExpandCatalogs=Alle catalogi weergeven\n#XBUT\nButton.ShowDetails=Details weergeven\n#XBUT\nButton.PagePreview=Paginavoorbeeld\n#XBUT\nButton.ErrorMsg=Foutmeldingen\n#XBUT\nButton.EditHeader=Kop bewerken\n#XBUT\nButton.ContextSelector=Rolcontext {0} selecteren\n#XBUT\nButton.OverwriteChanges=Overschrijven\n#XBUT\nButton.DismissChanges=Wijzigingen afkeuren\n\n#XTOL\nTooltip.AddToSections=Toevoegen aan secties\n#XTOL: Tooltip for the search button\nTooltip.Search=Zoeken\n#XTOL\nTooltip.SearchForTiles=Zoeken naar tegels\n#XTOL\nTooltip.SearchForRoles=Zoeken naar rollen\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Desktop\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=Sorteerinstellingen weergeven\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=Filterinstellingen weergeven\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=Groepsinstellingen weergeven\n\n#XFLD\nLabel.PageID=Pagina-ID\n#XFLD\nLabel.Title=Titel\n#XFLD\nLabel.WorkbenchRequest=Workbenchopdracht\n#XFLD\nLabel.Package=Pakket\n#XFLD\nLabel.TransportInformation=Transportinformatie\n#XFLD\nLabel.Details=Details\\:\n#XFLD\nLabel.ResponseCode=Responscode\\:\n#XFLD\nLabel.ModifiedBy=Gewijzigd door\\:\n#XFLD\nLabel.Description=Omschrijving\n#XFLD\nLabel.CreatedByFullname=Gecre\\u00EBerd door\n#XFLD\nLabel.CreatedOn=Gecre\\u00EBerd op\n#XFLD\nLabel.ChangedByFullname=Gewijzigd door\n#XFLD\nLabel.ChangedOn=Gewijzigd op\n#XFLD\nLabel.PageTitle=Paginatitel\n#XFLD\nLabel.AssignedRole=Toegewezen rol\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Titel\n#XCOL\nColumn.PageDescription=Omschrijving\n#XCOL\nColumn.PageAssignmentStatus=Toegewezen aan ruimte/rol\n#XCOL\nColumn.PagePackage=Pakket\n#XCOL\nColumn.PageWorkbenchRequest=Workbenchopdracht\n#XCOL\nColumn.PageCreatedBy=Gecre\\u00EBerd door\n#XCOL\nColumn.PageCreatedOn=Gecre\\u00EBerd op\n#XCOL\nColumn.PageChangedBy=Gewijzigd door\n#XCOL\nColumn.PageChangedOn=Gewijzigd op\n\n#XTOL\nPlaceholder.SectionName=Voer sectienaam in\n#XTOL\nPlaceholder.SearchForTiles=Zoeken naar tegels\n#XTOL\nPlaceholder.SearchForRoles=Zoeken naar rollen\n#XTOL\nPlaceholder.CopyPageTitle=Kopie van "{0}"\n#XTOL\nPlaceholder.CopyPageID=Kopie van "{0}"\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=Alles\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=Sectie {0} heeft geen titel. Voor een consistente gebruikerservaring raden wij aan een naam voor elke sectie in te voeren.\n#XMSG\nMessage.InvalidSectionTitle=Het is raadzaam dat u een sectienaam invoert.\n#XMSG\nMessage.NoInternetConnection=Controleer uw internetverbinding.\n#XMSG\nMessage.SavedChanges=Uw wijzigingen zijn opgeslagen.\n#XMSG\nMessage.InvalidPageID=Gebruik alleen de volgende tekens\\: A-Z, 0-9, _ en /. De pagina-ID mag niet beginnen met een cijfer.\n#XMSG\nMessage.EmptyPageID=Geef een geldige pagina-ID op.\n#XMSG\nMessage.EmptyTitle=Geef een geldige titel op.\n#XMSG\nMessage.NoRoleSelected=Selecteer ten minste \\u00E9\\u00E9n rol.\n#XMSG\nMessage.SuccessDeletePage=Het geselecteerde object is verwijderd.\n#XMSG\nMessage.ClipboardCopySuccess=Details zijn gekopieerd.\n#YMSE\nMessage.ClipboardCopyFail=Fout opgetreden tijdens kopi\\u00EBren van details.\n#XMSG\nMessage.PageCreated=De pagina is gecre\\u00EBerd.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=Geen tegels\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=Geen rollen beschikbaar.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=Geen rollen gevonden. Pas uw zoekopdracht aan.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=Geen secties\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=Laden van tegel {0} in sectie "{1}" is mislukt.\\n\\nDit komt vermoedelijk door onjuist geconfigureerde SAP Fiori-launchpadcontent. De visualisatie zal niet zichtbaar zijn voor de gebruiker.\n#XMSG\nMessage.NavigationTargetError=Navigatiedoel kan niet worden opgelost.\n#XMSG\nMessage.LoadPageError=Pagina kan niet worden geladen.\n#XMSG\nMessage.UpdatePageError=Pagina kan niet worden geactualiseerd.\n#XMSG\nMessage.CreatePageError=Pagina kan niet worden gecre\\u00EBerd.\n#XMSG\nMessage.TilesHaveErrors=Sommige tegels of secties bevatten fouten. Weet u zeker dat u uw gegevens wilt opslaan?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=Navigatiedoel van tegel\\: "{0}" kan niet worden opgelost.\\n\\nDit komt vermoedelijk door onjuist geconfigureerde SAP Fiori-launchpadcontent. De visualisatie kan geen applicatie openen.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=Weet u zeker dat u sectie "{0}" wilt verwijderen?\n#XMSG\nMessage.Section.DeleteNoTitle=Weet u zeker dat u deze sectie wilt verwijderen?\n#XMSG\nMessage.OverwriteChanges=Er zijn wijzigingen aangebracht terwijl u de pagina aan het bewerken was. Wilt u deze overschrijven?\n#XMSG\nMessage.OverwriteRemovedPage=De pagina waaraan u werkt is verwijderd door een andere gebruiker. Wilt u deze wijziging overschrijven?\n#XMSG\nMessage.SaveChanges=Sla uw wijzigingen op.\n#XMSG\nMessage.NoPages=Geen pagina\'s beschikbaar.\n#XMSG\nMessage.NoPagesFound=Geen pagina\'s gevonden. Pas uw zoekopdracht aan.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Content beperkt tot rolcontext.\n#XMSG\nMessage.NotAssigned=Niet toegewezen.\n#XMSG\nMessage.StatusAssigned=Toegewezen\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=Nieuwe pagina\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=Rolcontext selecteren\n#XTIT\nTitle.TilesHaveErrors=Tegels bevatten fouten\n#XTIT\nDeleteDialog.Title=Verwijderen\n#XMSG\nDeleteDialog.Text=Weet u zeker dat u de geselecteerde pagina wilt verwijderen?\n#XBUT\nDeleteDialog.ConfirmButton=Verwijderen\n#XTIT\nDeleteDialog.LockedTitle=Pagina geblokkeerd\n#XMSG\nDeleteDialog.LockedText=De geselecteerde pagina is geblokkeerd door gebruiker "{0}".\n#XMSG\nDeleteDialog.TransportRequired=Selecteer een transportpakket om de geselecteerde pagina te verwijderen.\n\n#XMSG\nEditDialog.LockedText=De geselecteerde pagina is geblokkeerd door gebruiker "{0}".\n#XMSG\nEditDialog.TransportRequired=Selecteer een transportpakket om de geselecteerde pagina te bewerken.\n#XTIT\nEditDialog.Title=Pagina bewerken\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=Deze pagina is gecre\\u00EBerd in taal "{0}", maar uw aanmeldtaal is ingesteld op "{1}". Wijzig uw aanmeldtaal in "{0}" om verder te gaan.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Subtitel\n#XFLD\nTileInfoPopover.Label.Icon=Pictogram\n#XFLD\nTileInfoPopover.Label.SemanticObject=Semantisch object\n#XFLD\nTileInfoPopover.Label.SemanticAction=Semantische actie\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori-ID\n#XFLD\nTileInfoPopover.Label.AppDetail=Appdetails\n#XFLD\nTileInfoPopover.Label.AppType=Apptype\n#XFLD\nTileInfoPopover.Label.TileType=Tegeltype\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Beschikbare apparaten\n\n#XTIT\nErrorDialog.Title=Fout\n\n#XTIT\nConfirmChangesDialog.Title=Waarschuwing\n\n#XTIT\nPageOverview.Title=Pagina\'s verzorgen\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=Lay-out\n\n#XTIT\nCopyDialog.Title=Pagina kopi\\u00EBren\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=Wilt u "{0}" kopi\\u00EBren?\n#XFLD\nCopyDialog.NewID=Kopie van "{0}"\n\n#XMSG\nTitle.NoSectionTitle=Sectietitel van sectie {0} is leeg.\n#XMSG\nTitle.UnsufficientRoles=Ontoereikende roltoewijzing om visualisatie weer te geven.\n#XMSG\nTitle.VisualizationIsNotVisible=Visualisatie zal niet worden weergegeven.\n#XMSG\nTitle.VisualizationNotNavigateable=Visualisatie kan geen app openen.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Statische tegel\n#XTIT\nTitle.DynamicTile=Dynamische tegel\n#XTIT\nTitle.CustomTile=Gepersonaliseerde tegel\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=Paginavoorbeeld\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=Pagina kan niet worden gevonden.\n#XLNK\nErrorPage.Link=Pagina\'s verzorgen\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_no.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=Vedlikehold sider klientuavhengig\n\n#XBUT\nButton.Add=Legg til\n#XBUT\nButton.Cancel=Avbryt\n#XBUT\nButton.ClosePreview=Lukk forh\\u00E5ndsvisning\n#XBUT\nButton.Copy=Kopier\n#XBUT\nButton.Create=Opprett\n#XBUT\nButton.Delete=Slett\n#XBUT\nButton.Edit=Rediger\n#XBUT\nButton.Save=Lagre\n#XBUT\nButton.Select=Velg\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=Vis kataloger\n#XBUT\nButton.HideCatalogs=Skjul kataloger\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Problemer\\: {0}\n#XBUT\nButton.SortCatalogs=Veksle katalogsortering\n#XBUT\nButton.CollapseCatalogs=Komprimer alle kataloger\n#XBUT\nButton.ExpandCatalogs=Utvid alle kataloger\n#XBUT\nButton.ShowDetails=Vis detaljer\n#XBUT\nButton.PagePreview=Forh\\u00E5ndsvisning av side\n#XBUT\nButton.ErrorMsg=Feilmeldinger\n#XBUT\nButton.EditHeader=Rediger topp\n#XBUT\nButton.ContextSelector=Velg rollekontekst {0}\n#XBUT\nButton.OverwriteChanges=Overskriv\n#XBUT\nButton.DismissChanges=Forkast endringer\n\n#XTOL\nTooltip.AddToSections=Legg til i avsnitt\n#XTOL: Tooltip for the search button\nTooltip.Search=S\\u00F8k\n#XTOL\nTooltip.SearchForTiles=S\\u00F8k etter ruter\n#XTOL\nTooltip.SearchForRoles=S\\u00F8k etter roller\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Skrivebord\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=Vis sorteringsinnstillinger\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=Vis filterinnstillinger\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=Vis gruppeinnstillinger\n\n#XFLD\nLabel.PageID=Side-ID\n#XFLD\nLabel.Title=Tittel\n#XFLD\nLabel.WorkbenchRequest=Workbenchordre\n#XFLD\nLabel.Package=Pakke\n#XFLD\nLabel.TransportInformation=Transportinformasjon\n#XFLD\nLabel.Details=Detaljer\\:\n#XFLD\nLabel.ResponseCode=Svarkode\\:\n#XFLD\nLabel.ModifiedBy=Endret av\\:\n#XFLD\nLabel.Description=Beskrivelse\n#XFLD\nLabel.CreatedByFullname=Opprettet av\n#XFLD\nLabel.CreatedOn=Opprettet den\n#XFLD\nLabel.ChangedByFullname=Endret av\n#XFLD\nLabel.ChangedOn=Endret den\n#XFLD\nLabel.PageTitle=Sidetittel\n#XFLD\nLabel.AssignedRole=Tilordnet rolle\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Tittel\n#XCOL\nColumn.PageDescription=Beskrivelse\n#XCOL\nColumn.PageAssignmentStatus=Tilordnet til omr\\u00E5de/rolle\n#XCOL\nColumn.PagePackage=Pakke\n#XCOL\nColumn.PageWorkbenchRequest=Workbenchordre\n#XCOL\nColumn.PageCreatedBy=Opprettet av\n#XCOL\nColumn.PageCreatedOn=Opprettet den\n#XCOL\nColumn.PageChangedBy=Endret av\n#XCOL\nColumn.PageChangedOn=Endret den\n\n#XTOL\nPlaceholder.SectionName=Oppgi et avsnittnavn\n#XTOL\nPlaceholder.SearchForTiles=S\\u00F8k etter ruter\n#XTOL\nPlaceholder.SearchForRoles=S\\u00F8k etter roller\n#XTOL\nPlaceholder.CopyPageTitle=Kopi av "{0}"\n#XTOL\nPlaceholder.CopyPageID=Kopi av "{0}"\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=Alle\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=Avsnitt {0} har ikke tittel. For \\u00E5 f\\u00E5 en gjennomf\\u00F8rt brukeropplevelse anbefaler vi at du oppgir et navn for hvert avsnitt.\n#XMSG\nMessage.InvalidSectionTitle=Ideelt sett b\\u00F8r du oppgi et navn p\\u00E5 avsnittet.\n#XMSG\nMessage.NoInternetConnection=Kontroller Internett-forbindelsen.\n#XMSG\nMessage.SavedChanges=Endringene er lagret.\n#XMSG\nMessage.InvalidPageID=Bruk bare f\\u00F8lgende tegn\\: A-Z, 0-9, _ og /. Side-ID-en kan ikke starte med et tall.\n#XMSG\nMessage.EmptyPageID=Oppgi en gyldig side-ID.\n#XMSG\nMessage.EmptyTitle=Oppgi en gyldig tittel.\n#XMSG\nMessage.NoRoleSelected=Velg minst en rolle.\n#XMSG\nMessage.SuccessDeletePage=Valgt objekt er slettet.\n#XMSG\nMessage.ClipboardCopySuccess=Detaljene er kopiert.\n#YMSE\nMessage.ClipboardCopyFail=Det oppstod en feil under kopiering av detaljer.\n#XMSG\nMessage.PageCreated=Siden er opprettet.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=Ingen ruter\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=Ingen roller tilgjengelig.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=Finner ingen roller. Pr\\u00F8v \\u00E5 justere s\\u00F8ket.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=Ingen avsnitt\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=Mislykket lasting av den {0} ruten i avsnittet "{1}".\\n\\nDette skyldes mest sannsynlig feil konfigurasjon av SAP Fiori-startfeltinnhold. Visualiseringen vil ikke v\\u00E6re synlig for brukeren.\n#XMSG\nMessage.NavigationTargetError=Kan ikke bryte ned navigeringsm\\u00E5let.\n#XMSG\nMessage.LoadPageError=Kan ikke laste siden.\n#XMSG\nMessage.UpdatePageError=Kan ikke oppdatere siden.\n#XMSG\nMessage.CreatePageError=Kan ikke opprette siden.\n#XMSG\nMessage.TilesHaveErrors=Noen av rutene eller avsnittene inneholder feil. Er du sikker p\\u00E5 at du vil fortsette lagringen?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=Kan ikke bryte ned navigeringsm\\u00E5l for ruten\\: "{0}".\\n\\nDette skyldes mest sannsynlig feil konfigurasjon av SAP Fiori-startfeltinnhold. Visualiseringen kan ikke \\u00E5pne en applikasjon.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=Er du sikker p\\u00E5 at du vil slette avsnittet "{0}"?\n#XMSG\nMessage.Section.DeleteNoTitle=Er du sikker p\\u00E5 at du vil slette dette avsnittet?\n#XMSG\nMessage.OverwriteChanges=Det har kommet endringer mens du redigerte siden. Vil du overskrive dem?\n#XMSG\nMessage.OverwriteRemovedPage=Siden du jobber med, er slettet av en annen bruker. Vil du overskrive denne endringen?\n#XMSG\nMessage.SaveChanges=Lagre endringene.\n#XMSG\nMessage.NoPages=Ingen sider tilgjengelig.\n#XMSG\nMessage.NoPagesFound=Finner ingen sider. Pr\\u00F8v \\u00E5 justere s\\u00F8ket.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Innhold begrenset til rollekontekst.\n#XMSG\nMessage.NotAssigned=Ikke tilordnet.\n#XMSG\nMessage.StatusAssigned=Tilordnet\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=Ny side\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=Velg rollekontekst\n#XTIT\nTitle.TilesHaveErrors=Ruter har feil\n#XTIT\nDeleteDialog.Title=Slett\n#XMSG\nDeleteDialog.Text=Er du sikker p\\u00E5 at du vil slette valgt side?\n#XBUT\nDeleteDialog.ConfirmButton=Slett\n#XTIT\nDeleteDialog.LockedTitle=Side sperret\n#XMSG\nDeleteDialog.LockedText=Valgt side er sperret av brukeren "{0}".\n#XMSG\nDeleteDialog.TransportRequired=Velg en transportpakke for \\u00E5 slette valgt side.\n\n#XMSG\nEditDialog.LockedText=Valgt side er sperret av brukeren "{0}".\n#XMSG\nEditDialog.TransportRequired=Velg en transportpakke for \\u00E5 redigere valgt side.\n#XTIT\nEditDialog.Title=Rediger side\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=Denne siden er opprettet med spr\\u00E5ket "{0}", men p\\u00E5loggingsspr\\u00E5ket er satt til {1}. Endre p\\u00E5loggingsspr\\u00E5ket til "{0}" for \\u00E5 fortsette.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Undertittel\n#XFLD\nTileInfoPopover.Label.Icon=Ikon\n#XFLD\nTileInfoPopover.Label.SemanticObject=Semantisk objekt\n#XFLD\nTileInfoPopover.Label.SemanticAction=Semantisk aktivitet\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori-ID\n#XFLD\nTileInfoPopover.Label.AppDetail=Appdetaljer\n#XFLD\nTileInfoPopover.Label.AppType=Apptype\n#XFLD\nTileInfoPopover.Label.TileType=Rutetype\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Tilgjengelige enheter\n\n#XTIT\nErrorDialog.Title=Feil\n\n#XTIT\nConfirmChangesDialog.Title=Advarsel\n\n#XTIT\nPageOverview.Title=Vedlikehold sider\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=Oppsett\n\n#XTIT\nCopyDialog.Title=Kopier side\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=Vil du kopiere "{0}"?\n#XFLD\nCopyDialog.NewID=Kopi av "{0}"\n\n#XMSG\nTitle.NoSectionTitle=Tittelen p\\u00E5 avsnitt {0} er tom.\n#XMSG\nTitle.UnsufficientRoles=Utilstrekkelig rolletilordning for visualisering.\n#XMSG\nTitle.VisualizationIsNotVisible=Visualisering vil ikke v\\u00E6re synlig.\n#XMSG\nTitle.VisualizationNotNavigateable=Visualisering kan ikke \\u00E5pne en app.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Statisk rute\n#XTIT\nTitle.DynamicTile=Dynamisk rute\n#XTIT\nTitle.CustomTile=Egendefinert rute\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=Forh\\u00E5ndsvisning av side\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=Beklager, vi finner ikke denne siden.\n#XLNK\nErrorPage.Link=Vedlikehold sider\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_pl.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=Opracowanie stron w mandantach\n\n#XBUT\nButton.Add=Dodaj\n#XBUT\nButton.Cancel=Anuluj\n#XBUT\nButton.ClosePreview=Zamknij podgl\\u0105d\n#XBUT\nButton.Copy=Kopiuj\n#XBUT\nButton.Create=Utw\\u00F3rz\n#XBUT\nButton.Delete=Usu\\u0144\n#XBUT\nButton.Edit=Edytuj\n#XBUT\nButton.Save=Zapisz\n#XBUT\nButton.Select=Wybierz\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=Poka\\u017C katalogi\n#XBUT\nButton.HideCatalogs=Ukryj katalogi\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Problemy\\: {0}\n#XBUT\nButton.SortCatalogs=Zmie\\u0144 kolejno\\u015B\\u0107 sortowania katalog\\u00F3w\n#XBUT\nButton.CollapseCatalogs=Zwi\\u0144 wszystkie katalogi\n#XBUT\nButton.ExpandCatalogs=Rozwi\\u0144 wszystkie katalogi\n#XBUT\nButton.ShowDetails=Poka\\u017C szczeg\\u00F3\\u0142y\n#XBUT\nButton.PagePreview=Podgl\\u0105d strony\n#XBUT\nButton.ErrorMsg=Komunikaty o b\\u0142\\u0119dzie\n#XBUT\nButton.EditHeader=Edytuj nag\\u0142\\u00F3wek\n#XBUT\nButton.ContextSelector=Wybierz kontekst roli {0}\n#XBUT\nButton.OverwriteChanges=Nadpisz\n#XBUT\nButton.DismissChanges=Odrzu\\u0107 zmiany\n\n#XTOL\nTooltip.AddToSections=Dodaj do sekcji\n#XTOL: Tooltip for the search button\nTooltip.Search=Szukaj\n#XTOL\nTooltip.SearchForTiles=Szukaj kafelk\\u00F3w\n#XTOL\nTooltip.SearchForRoles=Szukaj r\\u00F3l\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Komputer stacjonarny\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=Wy\\u015Bwietl ustawienia sortowania\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=Wy\\u015Bwietl ustawienia filtrowania\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=Wy\\u015Bwietl ustawienia grupowania\n\n#XFLD\nLabel.PageID=ID strony\n#XFLD\nLabel.Title=Tytu\\u0142\n#XFLD\nLabel.WorkbenchRequest=Zlecenie Workbench\n#XFLD\nLabel.Package=Pakiet\n#XFLD\nLabel.TransportInformation=Informacje o transporcie\n#XFLD\nLabel.Details=Szczeg\\u00F3\\u0142y\\:\n#XFLD\nLabel.ResponseCode=Kod odpowiedzi\\:\n#XFLD\nLabel.ModifiedBy=Zmodyfikowane przez\\:\n#XFLD\nLabel.Description=Opis\n#XFLD\nLabel.CreatedByFullname=Utworzone przez\n#XFLD\nLabel.CreatedOn=Utworzono dnia\n#XFLD\nLabel.ChangedByFullname=Zmienione przez\n#XFLD\nLabel.ChangedOn=Zmieniono dnia\n#XFLD\nLabel.PageTitle=Tytu\\u0142 strony\n#XFLD\nLabel.AssignedRole=Przypisana rola\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Tytu\\u0142\n#XCOL\nColumn.PageDescription=Opis\n#XCOL\nColumn.PageAssignmentStatus=Przypisane do przestrzeni/roli\n#XCOL\nColumn.PagePackage=Pakiet\n#XCOL\nColumn.PageWorkbenchRequest=Zlecenie Workbench\n#XCOL\nColumn.PageCreatedBy=Utworzone przez\n#XCOL\nColumn.PageCreatedOn=Utworzono dnia\n#XCOL\nColumn.PageChangedBy=Zmienione przez\n#XCOL\nColumn.PageChangedOn=Zmieniono dnia\n\n#XTOL\nPlaceholder.SectionName=Wprowad\\u017A nazw\\u0119 sekcji\n#XTOL\nPlaceholder.SearchForTiles=Szukaj kafelk\\u00F3w\n#XTOL\nPlaceholder.SearchForRoles=Szukaj r\\u00F3l\n#XTOL\nPlaceholder.CopyPageTitle=Kopia "{0}"\n#XTOL\nPlaceholder.CopyPageID=Kopia "{0}"\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=wszystkie\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=Sekcja {0} nie ma tytu\\u0142u. Aby zapewni\\u0107 niezmienny poziom wygody korzystania, zalecamy wprowadzi\\u0107 nazw\\u0119 dla ka\\u017Cdej sekcji.\n#XMSG\nMessage.InvalidSectionTitle=Najlepiej wprowadzi\\u0107 nazw\\u0119 sekcji.\n#XMSG\nMessage.NoInternetConnection=Sprawd\\u017A po\\u0142\\u0105czenie z Internetem.\n#XMSG\nMessage.SavedChanges=Twoje zmiany zosta\\u0142y zapisane.\n#XMSG\nMessage.InvalidPageID=U\\u017Cyj tylko nast\\u0119puj\\u0105cych znak\\u00F3w\\: A-Z, 0-9, _ oraz /. ID strony nie powinien rozpoczyna\\u0107 si\\u0119 liczb\\u0105.\n#XMSG\nMessage.EmptyPageID=Podaj prawid\\u0142owy ID strony.\n#XMSG\nMessage.EmptyTitle=Podaj prawid\\u0142owy tytu\\u0142.\n#XMSG\nMessage.NoRoleSelected=Wybierz co najmniej jedn\\u0105 rol\\u0119.\n#XMSG\nMessage.SuccessDeletePage=Wybrany obiekt zosta\\u0142 usuni\\u0119ty.\n#XMSG\nMessage.ClipboardCopySuccess=Pomy\\u015Blnie skopiowano szczeg\\u00F3\\u0142y.\n#YMSE\nMessage.ClipboardCopyFail=Wyst\\u0105pi\\u0142 b\\u0142\\u0105d podczas kopiowania szczeg\\u00F3\\u0142\\u00F3w.\n#XMSG\nMessage.PageCreated=Utworzono stron\\u0119.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=Brak kafelk\\u00F3w\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=Brak r\\u00F3l.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=Nie znaleziono r\\u00F3l. Spr\\u00F3buj dostosowa\\u0107 wyszukiwanie.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=Brak sekcji\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=B\\u0142\\u0105d wczytywania kafelka {0} w sekcji "{1}".\\n\\nNajprawdopodobniej jest to spowodowane nieprawid\\u0142ow\\u0105 konfiguracj\\u0105 zawarto\\u015Bci okna wywo\\u0142a\\u0144 SAP Fiori. Wizualizacja nie zostanie wy\\u015Bwietlona dla u\\u017Cytkownika.\n#XMSG\nMessage.NavigationTargetError=Nie mo\\u017Cna by\\u0142o rozwin\\u0105\\u0107 celu nawigacji.\n#XMSG\nMessage.LoadPageError=Nie mo\\u017Cna by\\u0142o wczyta\\u0107 strony.\n#XMSG\nMessage.UpdatePageError=Nie mo\\u017Cna by\\u0142o zaktualizowa\\u0107 strony.\n#XMSG\nMessage.CreatePageError=Nie mo\\u017Cna by\\u0142o utworzy\\u0107 strony.\n#XMSG\nMessage.TilesHaveErrors=Niekt\\u00F3re kafelki lub sekcje zawieraj\\u0105 b\\u0142\\u0119dy. Czy na pewno chcesz kontynuowa\\u0107 zapis?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=B\\u0142\\u0105d rozwijania celu nawigacji kafelka\\: "{0}".\\n\\nNajprawdopodobniej jest to spowodowane nieprawid\\u0142ow\\u0105 konfiguracj\\u0105 zawarto\\u015Bci okna wywo\\u0142a\\u0144 SAP Fiori. Wizualizacja nie mo\\u017Ce otworzy\\u0107 aplikacji.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=Czy na pewno chcesz usun\\u0105\\u0107 sekcj\\u0119 "{0}"?\n#XMSG\nMessage.Section.DeleteNoTitle=Czy na pewno chcesz usun\\u0105\\u0107 t\\u0119 sekcj\\u0119?\n#XMSG\nMessage.OverwriteChanges=Podczas edytowania strony wyst\\u0105pi\\u0142y zmiany. Czy chcesz je nadpisa\\u0107?\n#XMSG\nMessage.OverwriteRemovedPage=Strona, na kt\\u00F3rej pracujesz, zosta\\u0142a usuni\\u0119ta przez innego u\\u017Cytkownika. Czy chcesz nadpisa\\u0107 t\\u0119 zmian\\u0119?\n#XMSG\nMessage.SaveChanges=Zapisz zmiany.\n#XMSG\nMessage.NoPages=Brak dost\\u0119pnych stron.\n#XMSG\nMessage.NoPagesFound=Nie znaleziono stron. Spr\\u00F3buj dostosowa\\u0107 wyszukiwanie.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Zawarto\\u015B\\u0107 ograniczona do kontekstu roli.\n#XMSG\nMessage.NotAssigned=Nieprzypisane.\n#XMSG\nMessage.StatusAssigned=Przypisane\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=Nowa strona\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=Wybierz kontekst roli\n#XTIT\nTitle.TilesHaveErrors=Kafelki zawieraj\\u0105 b\\u0142\\u0119dy\n#XTIT\nDeleteDialog.Title=Usuwanie\n#XMSG\nDeleteDialog.Text=Czy na pewno chcesz usun\\u0105\\u0107 wybran\\u0105 stron\\u0119?\n#XBUT\nDeleteDialog.ConfirmButton=Usu\\u0144\n#XTIT\nDeleteDialog.LockedTitle=Strona zablokowana\n#XMSG\nDeleteDialog.LockedText=Wybrana strona jest zablokowana przez u\\u017Cytkownika "{0}".\n#XMSG\nDeleteDialog.TransportRequired=Wybierz pakiet transportowy, aby usun\\u0105\\u0107 wybran\\u0105 stron\\u0119.\n\n#XMSG\nEditDialog.LockedText=Wybrana strona jest zablokowana przez u\\u017Cytkownika "{0}".\n#XMSG\nEditDialog.TransportRequired=Wybierz pakiet transportowy, aby edytowa\\u0107 wybran\\u0105 stron\\u0119.\n#XTIT\nEditDialog.Title=Edycja strony\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=Ta strona zosta\\u0142a utworzona w j\\u0119zyku "{0}", a Tw\\u00F3j j\\u0119zyk logowania jest ustawiony na "{1}". Aby kontynuowa\\u0107, zmie\\u0144 j\\u0119zyk logowania na "{0}".\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Podtytu\\u0142\n#XFLD\nTileInfoPopover.Label.Icon=Ikona\n#XFLD\nTileInfoPopover.Label.SemanticObject=Obiekt semantyczny\n#XFLD\nTileInfoPopover.Label.SemanticAction=Czynno\\u015B\\u0107 semantyczna\n#XFLD\nTileInfoPopover.Label.FioriID=ID Fiori\n#XFLD\nTileInfoPopover.Label.AppDetail=Szczeg\\u00F3\\u0142y aplikacji\n#XFLD\nTileInfoPopover.Label.AppType=Rodzaj aplikacji\n#XFLD\nTileInfoPopover.Label.TileType=Typ kafelka\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Dost\\u0119pne urz\\u0105dzenia\n\n#XTIT\nErrorDialog.Title=B\\u0142\\u0105d\n\n#XTIT\nConfirmChangesDialog.Title=Ostrze\\u017Cenie\n\n#XTIT\nPageOverview.Title=Opracowanie stron\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=Uk\\u0142ad\n\n#XTIT\nCopyDialog.Title=Kopiowanie strony\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=Czy chcesz skopiowa\\u0107 "{0}"?\n#XFLD\nCopyDialog.NewID=Kopia "{0}"\n\n#XMSG\nTitle.NoSectionTitle=Tytu\\u0142 sekcji {0} jest pusty.\n#XMSG\nTitle.UnsufficientRoles=Przypisanie roli nie jest wystarczaj\\u0105ce do wy\\u015Bwietlenia wizualizacji.\n#XMSG\nTitle.VisualizationIsNotVisible=Wizualizacja nie zostanie wy\\u015Bwietlona.\n#XMSG\nTitle.VisualizationNotNavigateable=Wizualizacja nie mo\\u017Ce otworzy\\u0107 aplikacji.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Kafelek statyczny\n#XTIT\nTitle.DynamicTile=Kafelek dynamiczny\n#XTIT\nTitle.CustomTile=Kafelek niestandardowy\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=Podgl\\u0105d strony\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=Niestety, nie mo\\u017Cemy znale\\u017A\\u0107 tej strony.\n#XLNK\nErrorPage.Link=Opracuj strony\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_pt.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=Atualizar p\\u00E1ginas v\\u00E1lidas para v\\u00E1rios mandantes\n\n#XBUT\nButton.Add=Adicionar\n#XBUT\nButton.Cancel=Cancelar\n#XBUT\nButton.ClosePreview=Encerrar visualiza\\u00E7\\u00E3o\n#XBUT\nButton.Copy=Copiar\n#XBUT\nButton.Create=Criar\n#XBUT\nButton.Delete=Eliminar\n#XBUT\nButton.Edit=Processar\n#XBUT\nButton.Save=Gravar\n#XBUT\nButton.Select=Selecionar\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=Visualizar cat\\u00E1logos\n#XBUT\nButton.HideCatalogs=Ocultar cat\\u00E1logos\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Problemas\\: {0}\n#XBUT\nButton.SortCatalogs=Comutar sequ\\u00EAncia de ordena\\u00E7\\u00E3o de cat\\u00E1logo\n#XBUT\nButton.CollapseCatalogs=Comprimir todos os cat\\u00E1logos\n#XBUT\nButton.ExpandCatalogs=Expandir todos os cat\\u00E1logos\n#XBUT\nButton.ShowDetails=Visualizar detalhes\n#XBUT\nButton.PagePreview=Visualiza\\u00E7\\u00E3o da p\\u00E1gina\n#XBUT\nButton.ErrorMsg=Mensagens de erro\n#XBUT\nButton.EditHeader=Processar cabe\\u00E7alho\n#XBUT\nButton.ContextSelector=Selecionar contexto de fun\\u00E7\\u00E3o {0}\n#XBUT\nButton.OverwriteChanges=Sobregravar\n#XBUT\nButton.DismissChanges=Rejeitar modifica\\u00E7\\u00F5es\n\n#XTOL\nTooltip.AddToSections=Adicionar a se\\u00E7\\u00F5es\n#XTOL: Tooltip for the search button\nTooltip.Search=Procurar\n#XTOL\nTooltip.SearchForTiles=Procurar blocos\n#XTOL\nTooltip.SearchForRoles=Procurar fun\\u00E7\\u00F5es\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Desktop\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=Visualizar configura\\u00E7\\u00F5es de ordena\\u00E7\\u00E3o\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=Visualizar configura\\u00E7\\u00F5es de filtro\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=Visualizar configura\\u00E7\\u00F5es de grupo\n\n#XFLD\nLabel.PageID=ID da p\\u00E1gina\n#XFLD\nLabel.Title=T\\u00EDtulo\n#XFLD\nLabel.WorkbenchRequest=Ordem de workbench\n#XFLD\nLabel.Package=Pacote\n#XFLD\nLabel.TransportInformation=Informa\\u00E7\\u00E3o de transporte\n#XFLD\nLabel.Details=Detalhes\\:\n#XFLD\nLabel.ResponseCode=C\\u00F3digo de resposta\\:\n#XFLD\nLabel.ModifiedBy=Modificado por\\:\n#XFLD\nLabel.Description=Descri\\u00E7\\u00E3o\n#XFLD\nLabel.CreatedByFullname=Criado por\n#XFLD\nLabel.CreatedOn=Criada em\n#XFLD\nLabel.ChangedByFullname=Modificado por\n#XFLD\nLabel.ChangedOn=Modificado em\n#XFLD\nLabel.PageTitle=T\\u00EDtulo da p\\u00E1gina\n#XFLD\nLabel.AssignedRole=Fun\\u00E7\\u00E3o atribu\\u00EDda\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=T\\u00EDtulo\n#XCOL\nColumn.PageDescription=Descri\\u00E7\\u00E3o\n#XCOL\nColumn.PageAssignmentStatus=Atribu\\u00EDdo a espa\\u00E7o/fun\\u00E7\\u00E3o\n#XCOL\nColumn.PagePackage=Pacote\n#XCOL\nColumn.PageWorkbenchRequest=Ordem de workbench\n#XCOL\nColumn.PageCreatedBy=Criado por\n#XCOL\nColumn.PageCreatedOn=Criada em\n#XCOL\nColumn.PageChangedBy=Modificado por\n#XCOL\nColumn.PageChangedOn=Modificado em\n\n#XTOL\nPlaceholder.SectionName=Inserir um nome de se\\u00E7\\u00E3o\n#XTOL\nPlaceholder.SearchForTiles=Procurar blocos\n#XTOL\nPlaceholder.SearchForRoles=Procurar fun\\u00E7\\u00F5es\n#XTOL\nPlaceholder.CopyPageTitle=C\\u00F3pia de \\u201C{0}\\u201D\n#XTOL\nPlaceholder.CopyPageID=C\\u00F3pia de \\u201C{0}\\u201D\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=tudo\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=A se\\u00E7\\u00E3o {0} n\\u00E3o tem t\\u00EDtulo. Para uma experi\\u00EAncia do usu\\u00E1rio consistente, recomendamos que voc\\u00EA insira um nome para cada se\\u00E7\\u00E3o.\n#XMSG\nMessage.InvalidSectionTitle=Idealmente, voc\\u00EA deve inserir um nome de se\\u00E7\\u00E3o.\n#XMSG\nMessage.NoInternetConnection=Verifique a sua conex\\u00E3o de Internet.\n#XMSG\nMessage.SavedChanges=As suas modifica\\u00E7\\u00F5es foram gravadas.\n#XMSG\nMessage.InvalidPageID=Utilize somente os seguintes caracteres\\: A-Z, 0-9, _ e /. O ID da p\\u00E1gina n\\u00E3o deve come\\u00E7ar com um n\\u00FAmero.\n#XMSG\nMessage.EmptyPageID=Forne\\u00E7a um ID de p\\u00E1gina v\\u00E1lido.\n#XMSG\nMessage.EmptyTitle=Forne\\u00E7a um t\\u00EDtulo v\\u00E1lido.\n#XMSG\nMessage.NoRoleSelected=Selecionar pelo menos uma fun\\u00E7\\u00E3o.\n#XMSG\nMessage.SuccessDeletePage=O objeto selecionado foi eliminado.\n#XMSG\nMessage.ClipboardCopySuccess=Os detalhes foram copiados com \\u00EAxito.\n#YMSE\nMessage.ClipboardCopyFail=Ocorreu um erro ao copiar os detalhes.\n#XMSG\nMessage.PageCreated=A p\\u00E1gina foi criada.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=Nenhum bloco\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=Nenhuma fun\\u00E7\\u00E3o dispon\\u00EDvel.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=Nenhuma fun\\u00E7\\u00E3o encontrada. Tente ajustar sua pesquisa.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=Nenhuma se\\u00E7\\u00E3o\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=Falha ao carregar o bloco {0} na se\\u00E7\\u00E3o "{1}".\\n\\nIsto foi muito provavelmente causado por uma configura\\u00E7\\u00E3o de conte\\u00FAdo do launchpad do SAP Fiori incorreta. A visualiza\\u00E7\\u00E3o n\\u00E3o ser\\u00E1 exibida para o usu\\u00E1rio.\n#XMSG\nMessage.NavigationTargetError=N\\u00E3o foi poss\\u00EDvel resolver o destino de navega\\u00E7\\u00E3o.\n#XMSG\nMessage.LoadPageError=N\\u00E3o foi poss\\u00EDvel carregar a p\\u00E1gina.\n#XMSG\nMessage.UpdatePageError=N\\u00E3o foi poss\\u00EDvel atualizar a p\\u00E1gina.\n#XMSG\nMessage.CreatePageError=N\\u00E3o foi poss\\u00EDvel criar a p\\u00E1gina.\n#XMSG\nMessage.TilesHaveErrors=Alguns dos blocos ou se\\u00E7\\u00F5es t\\u00EAm erros. Voc\\u00EA quer mesmo continuar a grava\\u00E7\\u00E3o?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=Falha ao resolver o destino de navega\\u00E7\\u00E3o do bloco\\: "{0}".\\n\\nIsto foi muito provavelmente causado por uma configura\\u00E7\\u00E3o de conte\\u00FAdo do launchpad do SAP Fiori inv\\u00E1lida. A visualiza\\u00E7\\u00E3o n\\u00E3o pode abrir um aplicativo.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=Voc\\u00EA quer mesmo eliminar a se\\u00E7\\u00E3o "{0}"?\n#XMSG\nMessage.Section.DeleteNoTitle=Voc\\u00EA quer mesmo eliminar esta se\\u00E7\\u00E3o?\n#XMSG\nMessage.OverwriteChanges=Ocorreram modifica\\u00E7\\u00F5es enquanto voc\\u00EA estava editando a p\\u00E1gina. Quer sobregravar essas modifica\\u00E7\\u00F5es?\n#XMSG\nMessage.OverwriteRemovedPage=A p\\u00E1gina em que voc\\u00EA est\\u00E1 trabalhando foi eliminada por um usu\\u00E1rio diferente? Quer sobregravar essa modifica\\u00E7\\u00E3o?\n#XMSG\nMessage.SaveChanges=Grave suas modifica\\u00E7\\u00F5es.\n#XMSG\nMessage.NoPages=Nenhuma p\\u00E1gina dispon\\u00EDvel.\n#XMSG\nMessage.NoPagesFound=Nenhuma p\\u00E1gina encontrada. Tente ajustar sua pesquisa.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Conte\\u00FAdo restrito ao contexto da fun\\u00E7\\u00E3o.\n#XMSG\nMessage.NotAssigned=N\\u00E3o atribu\\u00EDdo.\n#XMSG\nMessage.StatusAssigned=Atribu\\u00EDdo\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=Nova p\\u00E1gina\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=Selecionar contexto de fun\\u00E7\\u00E3o\n#XTIT\nTitle.TilesHaveErrors=Os blocos t\\u00EAm erros\n#XTIT\nDeleteDialog.Title=Eliminar\n#XMSG\nDeleteDialog.Text=Voc\\u00EA quer mesmo eliminar a p\\u00E1gina selecionada?\n#XBUT\nDeleteDialog.ConfirmButton=Eliminar\n#XTIT\nDeleteDialog.LockedTitle=P\\u00E1gina bloqueada\n#XMSG\nDeleteDialog.LockedText=A p\\u00E1gina selecionada est\\u00E1 bloqueada pelo usu\\u00E1rio \\u201C{0}\\u201D.\n#XMSG\nDeleteDialog.TransportRequired=Selecione um pacote de transporte para eliminar a p\\u00E1gina selecionada.\n\n#XMSG\nEditDialog.LockedText=A p\\u00E1gina selecionada est\\u00E1 bloqueada pelo usu\\u00E1rio \\u201C{0}\\u201D.\n#XMSG\nEditDialog.TransportRequired=Selecione um pacote de transporte para processar a p\\u00E1gina selecionada.\n#XTIT\nEditDialog.Title=Processar p\\u00E1gina\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=Esta p\\u00E1gina foi criada no idioma "{0}", mas o seu idioma de logon est\\u00E1 definido como "{1}". Modifique o seu idioma de logon para "{0}" para continuar.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Subt\\u00EDtulo\n#XFLD\nTileInfoPopover.Label.Icon=\\u00CDcone\n#XFLD\nTileInfoPopover.Label.SemanticObject=Objeto sem\\u00E2ntico\n#XFLD\nTileInfoPopover.Label.SemanticAction=A\\u00E7\\u00E3o sem\\u00E2ntica\n#XFLD\nTileInfoPopover.Label.FioriID=ID Fiori\n#XFLD\nTileInfoPopover.Label.AppDetail=Detalhe do app\n#XFLD\nTileInfoPopover.Label.AppType=Tipo de app\n#XFLD\nTileInfoPopover.Label.TileType=Tipo de bloco\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Dispositivos dispon\\u00EDveis\n\n#XTIT\nErrorDialog.Title=Erro\n\n#XTIT\nConfirmChangesDialog.Title=Advert\\u00EAncia\n\n#XTIT\nPageOverview.Title=Atualizar p\\u00E1ginas\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=Layout\n\n#XTIT\nCopyDialog.Title=Copiar p\\u00E1gina\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=Copiar \\u201C{0}\\u201D?\n#XFLD\nCopyDialog.NewID=C\\u00F3pia de \\u201C{0}\\u201D\n\n#XMSG\nTitle.NoSectionTitle=T\\u00EDtulo de se\\u00E7\\u00E3o {0} est\\u00E1 vazio.\n#XMSG\nTitle.UnsufficientRoles=Atribui\\u00E7\\u00E3o de fun\\u00E7\\u00F5es insuficiente para exibir visualiza\\u00E7\\u00E3o.\n#XMSG\nTitle.VisualizationIsNotVisible=A visualiza\\u00E7\\u00E3o n\\u00E3o ser\\u00E1 exibida.\n#XMSG\nTitle.VisualizationNotNavigateable=A visualiza\\u00E7\\u00E3o n\\u00E3o pode abrir um app.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Bloco est\\u00E1tico\n#XTIT\nTitle.DynamicTile=Bloco din\\u00E2mico\n#XTIT\nTitle.CustomTile=Bloco personalizado\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=Visualiza\\u00E7\\u00E3o da p\\u00E1gina\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=N\\u00E3o \\u00E9 poss\\u00EDvel encontrar esta p\\u00E1gina.\n#XLNK\nErrorPage.Link=Atualizar p\\u00E1ginas\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_ro.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=\\u00CEntre\\u021Binere pagini independent de client\n\n#XBUT\nButton.Add=Ad\\u0103ugare\n#XBUT\nButton.Cancel=Anulare\n#XBUT\nButton.ClosePreview=Close Preview\n#XBUT\nButton.Copy=Copiere\n#XBUT\nButton.Create=Creare\n#XBUT\nButton.Delete=\\u0218tergere\n#XBUT\nButton.Edit=Editare\n#XBUT\nButton.Save=Salvare\n#XBUT\nButton.Select=Selectare\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=Afi\\u0219are cataloage\n#XBUT\nButton.HideCatalogs=Mascare cataloage\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Probleme\\: {0}\n#XBUT\nButton.SortCatalogs=Comutare secven\\u021B\\u0103 de sortare catalog\n#XBUT\nButton.CollapseCatalogs=Comprimare toate cataloagele\n#XBUT\nButton.ExpandCatalogs=Expandare toate cataloagele\n#XBUT\nButton.ShowDetails=Afi\\u0219are detalii\n#XBUT\nButton.PagePreview=Previzualizare pagin\\u0103\n#XBUT\nButton.ErrorMsg=Mesaje de eroare\n#XBUT\nButton.EditHeader=Editare antet\n#XBUT\nButton.ContextSelector=Select Role Context {0}\n#XBUT\nButton.OverwriteChanges=Overwrite\n#XBUT\nButton.DismissChanges=Dismiss Changes\n\n#XTOL\nTooltip.AddToSections=Ad\\u0103ugare la sec\\u021Biuni\n#XTOL: Tooltip for the search button\nTooltip.Search=C\\u0103utare\n#XTOL\nTooltip.SearchForTiles=C\\u0103utare mozaicuri\n#XTOL\nTooltip.SearchForRoles=Search for Roles\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Desktop\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=View Sort Settings\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=View Filter Settings\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=View Group Settings\n\n#XFLD\nLabel.PageID=ID pagin\\u0103\n#XFLD\nLabel.Title=Titlu\n#XFLD\nLabel.WorkbenchRequest=Cerere de workbench\n#XFLD\nLabel.Package=Pachet\n#XFLD\nLabel.TransportInformation=Informa\\u021Bii transport\n#XFLD\nLabel.Details=Detalii\\:\n#XFLD\nLabel.ResponseCode=Cod r\\u0103spuns\\:\n#XFLD\nLabel.ModifiedBy=Modified by\\:\n#XFLD\nLabel.Description=Descriere\n#XFLD\nLabel.CreatedByFullname=Creat de\n#XFLD\nLabel.CreatedOn=Creat pe\n#XFLD\nLabel.ChangedByFullname=Modificat de\n#XFLD\nLabel.ChangedOn=Modificat pe\n#XFLD\nLabel.PageTitle=Titlu pagin\\u0103\n#XFLD\nLabel.AssignedRole=Rol alocat\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Titlu\n#XCOL\nColumn.PageDescription=Descriere\n#XCOL\nColumn.PageAssignmentStatus=Assigned to Space/Role\n#XCOL\nColumn.PagePackage=Pachet\n#XCOL\nColumn.PageWorkbenchRequest=Cerere de workbench\n#XCOL\nColumn.PageCreatedBy=Creat de\n#XCOL\nColumn.PageCreatedOn=Creat pe\n#XCOL\nColumn.PageChangedBy=Modificat de\n#XCOL\nColumn.PageChangedOn=Modificat pe\n\n#XTOL\nPlaceholder.SectionName=Introduce\\u021Bi un nume de sec\\u021Biune\n#XTOL\nPlaceholder.SearchForTiles=C\\u0103utare mozaicuri\n#XTOL\nPlaceholder.SearchForRoles=Search for roles\n#XTOL\nPlaceholder.CopyPageTitle=Copie pentru "{0}"\n#XTOL\nPlaceholder.CopyPageID=Copie pentru "{0}"\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=all\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=Sec\\u021Biunea {0} nu are titlu. Pentru o experien\\u021B\\u0103 de utilizator consistent\\u0103, v\\u0103 recomand\\u0103m s\\u0103 introduce\\u021Bi un nume pentru fiecare sec\\u021Biune.\n#XMSG\nMessage.InvalidSectionTitle=Ideal, trebuie s\\u0103 introduce\\u021Bi un nume de sec\\u021Biune.\n#XMSG\nMessage.NoInternetConnection=Verifica\\u021Bi conexiunea dvs. la internet.\n#XMSG\nMessage.SavedChanges=Modific\\u0103rile dvs. au fost salvate.\n#XMSG\nMessage.InvalidPageID=Folosi\\u021Bi doar urm\\u0103toarele caractere\\: A-Z, 0-9, _ \\u0219i /. ID pagin\\u0103 nu trebuie s\\u0103 \\u00EEnceap\\u0103 cu un num\\u0103r.\n#XMSG\nMessage.EmptyPageID=Furniza\\u021Bi un ID de pagin\\u0103 valabil.\n#XMSG\nMessage.EmptyTitle=Furniza\\u021Bi un titlu valabil.\n#XMSG\nMessage.NoRoleSelected=Selecta\\u021Bi cel pu\\u021Bin un rol.\n#XMSG\nMessage.SuccessDeletePage=Obiectul selectat a fost \\u0219ters.\n#XMSG\nMessage.ClipboardCopySuccess=Detaliile au fost copiate cu succes.\n#YMSE\nMessage.ClipboardCopyFail=A ap\\u0103rut o eroare la copiere detalii.\n#XMSG\nMessage.PageCreated=Pagina a fost creat\\u0103.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=F\\u0103r\\u0103 mozaicuri\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=No roles available.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=No roles found. Try adjusting your search.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=F\\u0103r\\u0103 sec\\u021Biuni\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=Eroare la \\u00EEnc\\u0103rcare mozaic {0} \\u00EEn sec\\u021Biunea "{1}".\\n\\nCel mai probabil, acest lucru a fost cauzat de o configurare incorect\\u0103 a con\\u021Binutului de launchpad SAP Fiori. Vizualizarea nu va fi afi\\u0219at\\u0103 pentru utilizator.\n#XMSG\nMessage.NavigationTargetError=\\u021Ainta de navigare nu a putut fi rezolvat\\u0103.\n#XMSG\nMessage.LoadPageError=Could not load the page template.\n#XMSG\nMessage.UpdatePageError=Could not update the page template.\n#XMSG\nMessage.CreatePageError=Could not create the page template.\n#XMSG\nMessage.TilesHaveErrors=C\\u00E2teva dintre mozaicuri sau sec\\u021Biuni au erori. Sigur dori\\u021Bi s\\u0103 continua\\u021Bi salvarea?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=Eroare la rezolvare \\u021Bint\\u0103 de navigare pentru mozaic\\: "{0}".\\n\\nCel mai probabil este cauzat\\u0103 de configurarea nevalabil\\u0103 a con\\u021Binutului de launchpad SAP Fiori. Vizualizarea nu poate deschide o aplica\\u021Bie.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=Sigur dori\\u021Bi s\\u0103 \\u0219terge\\u021Bi sec\\u021Biunea "{0}"?\n#XMSG\nMessage.Section.DeleteNoTitle=Sigur dori\\u021Bi s\\u0103 \\u0219terge\\u021Bi aceast\\u0103 sec\\u021Biune?\n#XMSG\nMessage.OverwriteChanges=There have been changes while you were editing the page template. Do you want to overwrite them?\n#XMSG\nMessage.OverwriteRemovedPage=The page template you are working on has been deleted by a different user. Do you want to overwrite this change?\n#XMSG\nMessage.SaveChanges=Salva\\u021Bi modific\\u0103rile dvs.\n#XMSG\nMessage.NoPages=Nicio pagin\\u0103 disponibil\\u0103.\n#XMSG\nMessage.NoPagesFound=Nicio pagin\\u0103 g\\u0103sit\\u0103. \\u00CEncerca\\u021Bi s\\u0103 ajusta\\u021Bi c\\u0103utarea dvs.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Content restricted to role context.\n#XMSG\nMessage.NotAssigned=Not Assigned\n#XMSG\nMessage.StatusAssigned=Assigned\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=Pagin\\u0103 nou\\u0103\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=Select Role Context\n#XTIT\nTitle.TilesHaveErrors=Mozaicurile au erori\n#XTIT\nDeleteDialog.Title=\\u0218tergere\n#XMSG\nDeleteDialog.Text=Sigur dori\\u021Bi s\\u0103 \\u0219terge\\u021Bi pagina selectat\\u0103?\n#XBUT\nDeleteDialog.ConfirmButton=\\u015Etergere\n#XTIT\nDeleteDialog.LockedTitle=Pagin\\u0103 blocat\\u0103\n#XMSG\nDeleteDialog.LockedText=Pagina selectat\\u0103 este blocat\\u0103 de utilizatorul "{0}".\n#XMSG\nDeleteDialog.TransportRequired=Selecta\\u021Bi un pachet de transport pentru a \\u0219terge pagina selectat\\u0103.\n\n#XMSG\nEditDialog.LockedText=Pagina selectat\\u0103 este blocat\\u0103 de utilizatorul "{0}".\n#XMSG\nEditDialog.TransportRequired=Selecta\\u021Bi un pachet de transport pentru a edita pagina selectat\\u0103.\n#XTIT\nEditDialog.Title=Editare pagin\\u0103\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=Aceast\\u0103 pagin\\u0103 a fost creat\\u0103 \\u00EEn limba "{0}" dar limba dvs. de conectare este setat\\u0103 la "{1}". Schimba\\u021Bi limba dvs. de conectare la "{0}" pentru a continua.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Subtitle\n#XFLD\nTileInfoPopover.Label.Icon=Icon\n#XFLD\nTileInfoPopover.Label.SemanticObject=Semantic Object\n#XFLD\nTileInfoPopover.Label.SemanticAction=Semantic Action\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori ID\n#XFLD\nTileInfoPopover.Label.AppDetail=App Detail\n#XFLD\nTileInfoPopover.Label.AppType=App Type\n#XFLD\nTileInfoPopover.Label.TileType=Tile Type\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Available Devices\n\n#XTIT\nErrorDialog.Title=Eroare\n\n#XTIT\nConfirmChangesDialog.Title=Warning\n\n#XTIT\nPageOverview.Title=\\u00CEntre\\u021Binere pagini\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=Layout\n\n#XTIT\nCopyDialog.Title=Copiere pagin\\u0103\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=Dori\\u021Bi s\\u0103 copia\\u021Bi "{0}"?\n#XFLD\nCopyDialog.NewID=Copie pentru "{0}"\n\n#XMSG\nTitle.NoSectionTitle=Titlul de sec\\u021Biune pentru sec\\u021Biunea {0} este gol.\n#XMSG\nTitle.UnsufficientRoles=Alocare de rol insuficient\\u0103 pentru afi\\u0219are vizualizare.\n#XMSG\nTitle.VisualizationIsNotVisible=Vizualizarea nu va fi afi\\u0219at\\u0103.\n#XMSG\nTitle.VisualizationNotNavigateable=Vizualizarea nu poate deschide o aplica\\u021Bie.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Mozaic static\n#XTIT\nTitle.DynamicTile=Mozaic dinamic\n#XTIT\nTitle.CustomTile=Mozaic definit de utilizator\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=Page Template Preview\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=Nu am putut g\\u0103si aceast\\u0103 pagin\\u0103.\n#XLNK\nErrorPage.Link=\\u00CEntre\\u021Binere pagini\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_ru.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=\\u0412\\u0435\\u0434\\u0435\\u043D\\u0438\\u0435 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446 \\u0434\\u043B\\u044F \\u0432\\u0441\\u0435\\u0445 \\u043C\\u0430\\u043D\\u0434\\u0430\\u043D\\u0442\\u043E\\u0432\n\n#XBUT\nButton.Add=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C\n#XBUT\nButton.Cancel=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\n#XBUT\nButton.ClosePreview=\\u0417\\u0430\\u043A\\u0440\\u044B\\u0442\\u044C \\u043F\\u0440\\u0435\\u0434\\u0432\\u0430\\u0440\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u044B\\u0439 \\u043F\\u0440\\u043E\\u0441\\u043C\\u043E\\u0442\\u0440\n#XBUT\nButton.Copy=\\u0421\\u043A\\u043E\\u043F\\u0438\\u0440\\u043E\\u0432\\u0430\\u0442\\u044C\n#XBUT\nButton.Create=\\u0421\\u043E\\u0437\\u0434\\u0430\\u0442\\u044C\n#XBUT\nButton.Delete=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C\n#XBUT\nButton.Edit=\\u041E\\u0431\\u0440\\u0430\\u0431\\u043E\\u0442\\u0430\\u0442\\u044C\n#XBUT\nButton.Save=\\u0421\\u043E\\u0445\\u0440\\u0430\\u043D\\u0438\\u0442\\u044C\n#XBUT\nButton.Select=\\u0412\\u044B\\u0431\\u0440\\u0430\\u0442\\u044C\n#XBUT\nButton.Ok=\\u041E\\u041A\n#XBUT\nButton.ShowCatalogs=\\u041F\\u043E\\u043A\\u0430\\u0437\\u0430\\u0442\\u044C \\u043A\\u0430\\u0442\\u0430\\u043B\\u043E\\u0433\\u0438\n#XBUT\nButton.HideCatalogs=\\u0421\\u043A\\u0440\\u044B\\u0442\\u044C \\u043A\\u0430\\u0442\\u0430\\u043B\\u043E\\u0433\\u0438\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=\\u041F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\u044B\\: {0}\n#XBUT\nButton.SortCatalogs=\\u041F\\u0435\\u0440\\u0435\\u043A\\u043B\\u044E\\u0447\\u0438\\u0442\\u044C \\u0441\\u043E\\u0440\\u0442\\u0438\\u0440\\u043E\\u0432\\u043A\\u0443 \\u043A\\u0430\\u0442\\u0430\\u043B\\u043E\\u0433\\u043E\\u0432\n#XBUT\nButton.CollapseCatalogs=\\u0421\\u0432\\u0435\\u0440\\u043D\\u0443\\u0442\\u044C \\u0432\\u0441\\u0435 \\u043A\\u0430\\u0442\\u0430\\u043B\\u043E\\u0433\\u0438\n#XBUT\nButton.ExpandCatalogs=\\u0420\\u0430\\u0437\\u0432\\u0435\\u0440\\u043D\\u0443\\u0442\\u044C \\u0432\\u0441\\u0435 \\u043A\\u0430\\u0442\\u0430\\u043B\\u043E\\u0433\\u0438\n#XBUT\nButton.ShowDetails=\\u041F\\u043E\\u043A\\u0430\\u0437\\u0430\\u0442\\u044C \\u0441\\u0432\\u0435\\u0434\\u0435\\u043D\\u0438\\u044F\n#XBUT\nButton.PagePreview=\\u041F\\u0440\\u0435\\u0434\\u043F\\u0440\\u043E\\u0441\\u043C\\u043E\\u0442\\u0440 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u044B\n#XBUT\nButton.ErrorMsg=\\u0421\\u043E\\u043E\\u0431\\u0449\\u0435\\u043D\\u0438\\u044F \\u043E\\u0431 \\u043E\\u0448\\u0438\\u0431\\u043A\\u0430\\u0445\n#XBUT\nButton.EditHeader=\\u0420\\u0435\\u0434\\u0430\\u043A\\u0442\\u0438\\u0440\\u043E\\u0432\\u0430\\u0442\\u044C \\u0437\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A\n#XBUT\nButton.ContextSelector=\\u0412\\u044B\\u0431\\u0440\\u0430\\u0442\\u044C \\u043A\\u043E\\u043D\\u0442\\u0435\\u043A\\u0441\\u0442 \\u0440\\u043E\\u043B\\u0438 {0}\n#XBUT\nButton.OverwriteChanges=\\u041F\\u0435\\u0440\\u0435\\u0437\\u0430\\u043F\\u0438\\u0441\\u0430\\u0442\\u044C\n#XBUT\nButton.DismissChanges=\\u041E\\u0442\\u043A\\u043B\\u043E\\u043D\\u0438\\u0442\\u044C \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F\n\n#XTOL\nTooltip.AddToSections=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u0432 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\\u044B\n#XTOL: Tooltip for the search button\nTooltip.Search=\\u041F\\u043E\\u0438\\u0441\\u043A\n#XTOL\nTooltip.SearchForTiles=\\u041F\\u043E\\u0438\\u0441\\u043A \\u043F\\u043B\\u0438\\u0442\\u043E\\u043A\n#XTOL\nTooltip.SearchForRoles=\\u041F\\u043E\\u0438\\u0441\\u043A \\u0440\\u043E\\u043B\\u0435\\u0439\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=\\u041D\\u0430\\u0441\\u0442\\u043E\\u043B\\u044C\\u043D\\u044B\\u0439 \\u043A\\u043E\\u043C\\u043F\\u044C\\u044E\\u0442\\u0435\\u0440\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=\\u041F\\u0440\\u043E\\u0441\\u043C\\u043E\\u0442\\u0440\\u0435\\u0442\\u044C \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438 \\u0441\\u043E\\u0440\\u0442\\u0438\\u0440\\u043E\\u0432\\u043A\\u0438\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=\\u041F\\u0440\\u043E\\u0441\\u043C\\u043E\\u0442\\u0440\\u0435\\u0442\\u044C \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438 \\u0444\\u0438\\u043B\\u044C\\u0442\\u0440\\u0430\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=\\u041F\\u0440\\u043E\\u0441\\u043C\\u043E\\u0442\\u0440\\u0435\\u0442\\u044C \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438 \\u0433\\u0440\\u0443\\u043F\\u043F\\u0438\\u0440\\u043E\\u0432\\u043A\\u0438\n\n#XFLD\nLabel.PageID=\\u0418\\u0434. \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u044B\n#XFLD\nLabel.Title=\\u0417\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A\n#XFLD\nLabel.WorkbenchRequest=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0441 \\u043A \\u0438\\u043D\\u0441\\u0442\\u0440\\u0443\\u043C\\u0435\\u043D\\u0442\\u0430\\u043B\\u044C\\u043D\\u044B\\u043C \\u0441\\u0440\\u0435\\u0434\\u0441\\u0442\\u0432\\u0430\\u043C\n#XFLD\nLabel.Package=\\u041F\\u0430\\u043A\\u0435\\u0442\n#XFLD\nLabel.TransportInformation=\\u0418\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0438\\u044F \\u043E \\u043F\\u0435\\u0440\\u0435\\u043D\\u043E\\u0441\\u0435\n#XFLD\nLabel.Details=\\u0421\\u0432\\u0435\\u0434\\u0435\\u043D\\u0438\\u044F\\:\n#XFLD\nLabel.ResponseCode=\\u041A\\u043E\\u0434 \\u043E\\u0442\\u0432\\u0435\\u0442\\u0430\\:\n#XFLD\nLabel.ModifiedBy=\\u0418\\u0437\\u043C\\u0435\\u043D\\u0438\\u043B\\:\n#XFLD\nLabel.Description=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\n#XFLD\nLabel.CreatedByFullname=\\u0421\\u043E\\u0437\\u0434\\u0430\\u043B\n#XFLD\nLabel.CreatedOn=\\u0414\\u0430\\u0442\\u0430 \\u0441\\u043E\\u0437\\u0434\\u0430\\u043D\\u0438\\u044F\n#XFLD\nLabel.ChangedByFullname=\\u0410\\u0432\\u0442\\u043E\\u0440 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F\n#XFLD\nLabel.ChangedOn=\\u0414\\u0430\\u0442\\u0430 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F\n#XFLD\nLabel.PageTitle=\\u0417\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u044B\n#XFLD\nLabel.AssignedRole=\\u041F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0435\\u043D\\u043D\\u0430\\u044F \\u0440\\u043E\\u043B\\u044C\n\n#XCOL\nColumn.PageID=\\u0418\\u0434\\u0435\\u043D\\u0442\\u0438\\u0444\\u0438\\u043A\\u0430\\u0442\\u043E\\u0440\n#XCOL\nColumn.PageTitle=\\u0417\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A\n#XCOL\nColumn.PageDescription=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\n#XCOL\nColumn.PageAssignmentStatus=\\u041F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0435\\u043D\\u043E \\u043F\\u043E \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u0443/\\u0440\\u043E\\u043B\\u0438\n#XCOL\nColumn.PagePackage=\\u041F\\u0430\\u043A\\u0435\\u0442\n#XCOL\nColumn.PageWorkbenchRequest=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0441 \\u043A \\u0438\\u043D\\u0441\\u0442\\u0440\\u0443\\u043C\\u0435\\u043D\\u0442\\u0430\\u043B\\u044C\\u043D\\u044B\\u043C \\u0441\\u0440\\u0435\\u0434\\u0441\\u0442\\u0432\\u0430\\u043C\n#XCOL\nColumn.PageCreatedBy=\\u0421\\u043E\\u0437\\u0434\\u0430\\u043B\n#XCOL\nColumn.PageCreatedOn=\\u0414\\u0430\\u0442\\u0430 \\u0441\\u043E\\u0437\\u0434\\u0430\\u043D\\u0438\\u044F\n#XCOL\nColumn.PageChangedBy=\\u0410\\u0432\\u0442\\u043E\\u0440 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F\n#XCOL\nColumn.PageChangedOn=\\u0414\\u0430\\u0442\\u0430 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F\n\n#XTOL\nPlaceholder.SectionName=\\u0412\\u0432\\u0435\\u0434\\u0438\\u0442\\u0435 \\u0438\\u043C\\u044F \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\\u0430\n#XTOL\nPlaceholder.SearchForTiles=\\u041F\\u043E\\u0438\\u0441\\u043A \\u043F\\u043B\\u0438\\u0442\\u043E\\u043A\n#XTOL\nPlaceholder.SearchForRoles=\\u041F\\u043E\\u0438\\u0441\\u043A \\u0440\\u043E\\u043B\\u0435\\u0439\n#XTOL\nPlaceholder.CopyPageTitle=\\u041A\\u043E\\u043F\\u0438\\u044F "{0}"\n#XTOL\nPlaceholder.CopyPageID=\\u041A\\u043E\\u043F\\u0438\\u044F "{0}"\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=\\u0432\\u0441\\u0435\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=\\u0420\\u0430\\u0437\\u0434\\u0435\\u043B {0} \\u043D\\u0435 \\u0438\\u043C\\u0435\\u0435\\u0442 \\u0437\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043A\\u0430. \\u0414\\u043B\\u044F \\u0443\\u0434\\u043E\\u0431\\u0441\\u0442\\u0432\\u0430 \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u0435\\u0439 \\u0440\\u0435\\u043A\\u043E\\u043C\\u0435\\u043D\\u0434\\u0443\\u0435\\u0442\\u0441\\u044F \\u0443\\u043A\\u0430\\u0437\\u0430\\u0442\\u044C \\u0438\\u043C\\u044F \\u0434\\u043B\\u044F \\u043A\\u0430\\u0436\\u0434\\u043E\\u0433\\u043E \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\\u0430.\n#XMSG\nMessage.InvalidSectionTitle=\\u041D\\u0435\\u043E\\u0431\\u0445\\u043E\\u0434\\u0438\\u043C\\u043E \\u0432\\u0432\\u0435\\u0441\\u0442\\u0438 \\u0438\\u043C\\u044F \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\\u0430.\n#XMSG\nMessage.NoInternetConnection=\\u041F\\u0440\\u043E\\u0432\\u0435\\u0440\\u044C\\u0442\\u0435 \\u0438\\u043D\\u0442\\u0435\\u0440\\u043D\\u0435\\u0442-\\u0441\\u043E\\u0435\\u0434\\u0438\\u043D\\u0435\\u043D\\u0438\\u0435.\n#XMSG\nMessage.SavedChanges=\\u0412\\u0430\\u0448\\u0438 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F \\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u0435\\u043D\\u044B.\n#XMSG\nMessage.InvalidPageID=\\u0418\\u0441\\u043F\\u043E\\u043B\\u044C\\u0437\\u0443\\u0439\\u0442\\u0435 \\u0442\\u043E\\u043B\\u044C\\u043A\\u043E \\u0441\\u043B\\u0435\\u0434\\u0443\\u044E\\u0449\\u0438\\u0435 \\u0441\\u0438\\u043C\\u0432\\u043E\\u043B\\u044B\\: A-Z, 0-9, _ \\u0438 /. \\u0418\\u0434. \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u044B \\u043D\\u0435 \\u0434\\u043E\\u043B\\u0436\\u0435\\u043D \\u043D\\u0430\\u0447\\u0438\\u043D\\u0430\\u0442\\u044C\\u0441\\u044F \\u0441 \\u0446\\u0438\\u0444\\u0440\\u044B.\n#XMSG\nMessage.EmptyPageID=\\u0423\\u043A\\u0430\\u0436\\u0438\\u0442\\u0435 \\u0434\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0438\\u0434. \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u044B.\n#XMSG\nMessage.EmptyTitle=\\u0423\\u043A\\u0430\\u0436\\u0438\\u0442\\u0435 \\u0434\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0437\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A.\n#XMSG\nMessage.NoRoleSelected=\\u0412\\u044B\\u0431\\u0435\\u0440\\u0438\\u0442\\u0435 \\u043C\\u0438\\u043D\\u0438\\u043C\\u0443\\u043C \\u043E\\u0434\\u043D\\u0443 \\u0440\\u043E\\u043B\\u044C.\n#XMSG\nMessage.SuccessDeletePage=\\u0412\\u044B\\u0431\\u0440\\u0430\\u043D\\u043D\\u044B\\u0439 \\u043E\\u0431\\u044A\\u0435\\u043A\\u0442 \\u0443\\u0434\\u0430\\u043B\\u0435\\u043D.\n#XMSG\nMessage.ClipboardCopySuccess=\\u0421\\u0432\\u0435\\u0434\\u0435\\u043D\\u0438\\u044F \\u0441\\u043A\\u043E\\u043F\\u0438\\u0440\\u043E\\u0432\\u0430\\u043D\\u044B.\n#YMSE\nMessage.ClipboardCopyFail=\\u041F\\u0440\\u0438 \\u043A\\u043E\\u043F\\u0438\\u0440\\u043E\\u0432\\u0430\\u043D\\u0438\\u0438 \\u0441\\u0432\\u0435\\u0434\\u0435\\u043D\\u0438\\u0439 \\u043F\\u0440\\u043E\\u0438\\u0437\\u043E\\u0448\\u043B\\u0430 \\u043E\\u0448\\u0438\\u0431\\u043A\\u0430.\n#XMSG\nMessage.PageCreated=\\u0421\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430 \\u0441\\u043E\\u0437\\u0434\\u0430\\u043D\\u0430.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=\\u041D\\u0435\\u0442 \\u043F\\u043B\\u0438\\u0442\\u043E\\u043A\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=\\u0420\\u043E\\u043B\\u0438 \\u043D\\u0435\\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=\\u0420\\u043E\\u043B\\u0438 \\u043D\\u0435 \\u043D\\u0430\\u0439\\u0434\\u0435\\u043D\\u044B. \\u0418\\u0437\\u043C\\u0435\\u043D\\u0438\\u0442\\u0435 \\u043A\\u0440\\u0438\\u0442\\u0435\\u0440\\u0438\\u0438 \\u043F\\u043E\\u0438\\u0441\\u043A\\u0430.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=\\u041D\\u0435\\u0442 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\\u043E\\u0432\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u0437\\u0430\\u0433\\u0440\\u0443\\u0437\\u0438\\u0442\\u044C \\u043F\\u043B\\u0438\\u0442\\u043A\\u0443 {0} \\u0432 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B "{1}".\\n\\n\\u0421\\u043A\\u043E\\u0440\\u0435\\u0435 \\u0432\\u0441\\u0435\\u0433\\u043E \\u044D\\u0442\\u043E\\u0433\\u043E \\u0432\\u044B\\u0437\\u0432\\u0430\\u043D\\u043E \\u043D\\u0435\\u043F\\u0440\\u0430\\u0432\\u0438\\u043B\\u044C\\u043D\\u043E\\u0439 \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u0435\\u0439 \\u043A\\u043E\\u043D\\u0442\\u0435\\u043D\\u0442\\u0430 \\u043F\\u0430\\u043D\\u0435\\u043B\\u0438 \\u0437\\u0430\\u043F\\u0443\\u0441\\u043A\\u0430 SAP Fiori. \\u0412\\u0438\\u0437\\u0443\\u0430\\u043B\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F \\u0431\\u0443\\u0434\\u0435\\u0442 \\u043D\\u0435\\u0432\\u0438\\u0434\\u0438\\u043C\\u043E\\u0439 \\u0434\\u043B\\u044F \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044F.\n#XMSG\nMessage.NavigationTargetError=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u0440\\u0430\\u0437\\u0432\\u0435\\u0440\\u043D\\u0443\\u0442\\u044C \\u0446\\u0435\\u043B\\u044C \\u043D\\u0430\\u0432\\u0438\\u0433\\u0430\\u0446\\u0438\\u0438.\n#XMSG\nMessage.LoadPageError=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u0437\\u0430\\u0433\\u0440\\u0443\\u0437\\u0438\\u0442\\u044C \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0443.\n#XMSG\nMessage.UpdatePageError=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u043E\\u0431\\u043D\\u043E\\u0432\\u0438\\u0442\\u044C \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0443.\n#XMSG\nMessage.CreatePageError=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u0441\\u043E\\u0437\\u0434\\u0430\\u0442\\u044C \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0443.\n#XMSG\nMessage.TilesHaveErrors=\\u041D\\u0435\\u043A\\u043E\\u0442\\u043E\\u0440\\u044B\\u0435 \\u043F\\u043B\\u0438\\u0442\\u043A\\u0438 \\u0438\\u043B\\u0438 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\\u044B \\u0441\\u043E\\u0434\\u0435\\u0440\\u0436\\u0430\\u0442 \\u043E\\u0448\\u0438\\u0431\\u043A\\u0438. \\u0414\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u043E \\u043F\\u0440\\u043E\\u0434\\u043E\\u043B\\u0436\\u0438\\u0442\\u044C \\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u0435\\u043D\\u0438\\u0435?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u0440\\u0430\\u0437\\u0432\\u0435\\u0440\\u043D\\u0443\\u0442\\u044C \\u0446\\u0435\\u043B\\u044C \\u043D\\u0430\\u0432\\u0438\\u0433\\u0430\\u0446\\u0438\\u0438 \\u0434\\u043B\\u044F \\u043F\\u043B\\u0438\\u0442\\u043A\\u0438\\: "{0}".\\n\\n\\u0421\\u043A\\u043E\\u0440\\u0435\\u0435 \\u0432\\u0441\\u0435\\u0433\\u043E \\u044D\\u0442\\u043E \\u0432\\u044B\\u0437\\u0432\\u0430\\u043D\\u043E \\u043D\\u0435\\u043F\\u0440\\u0430\\u0432\\u0438\\u043B\\u044C\\u043D\\u043E\\u0439 \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u0435\\u0439 \\u043A\\u043E\\u043D\\u0442\\u0435\\u043D\\u0442\\u0430 \\u043F\\u0430\\u043D\\u0435\\u043B\\u0438 \\u0437\\u0430\\u043F\\u0443\\u0441\\u043A\\u0430 SAP Fiori. \\u0412\\u0438\\u0437\\u0443\\u0430\\u043B\\u0438\\u0437\\u0430\\u0446\\u0438\\u044E \\u043D\\u0435\\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E \\u043E\\u0442\\u043A\\u0440\\u044B\\u0442\\u044C \\u0432 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0438.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=\\u0414\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u043E \\u0443\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B "{0}"?\n#XMSG\nMessage.Section.DeleteNoTitle=\\u0414\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u043E \\u0443\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C \\u044D\\u0442\\u043E\\u0442 \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B?\n#XMSG\nMessage.OverwriteChanges=\\u041F\\u043E\\u043A\\u0430 \\u0432\\u044B \\u0440\\u0435\\u0434\\u0430\\u043A\\u0442\\u0438\\u0440\\u043E\\u0432\\u0430\\u043B\\u0438 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0443, \\u043D\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0435 \\u0431\\u044B\\u043B\\u0438 \\u0441\\u0434\\u0435\\u043B\\u0430\\u043D\\u044B \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F. \\u041F\\u0435\\u0440\\u0435\\u0437\\u0430\\u043F\\u0438\\u0441\\u0430\\u0442\\u044C \\u0438\\u0445?\n#XMSG\nMessage.OverwriteRemovedPage=\\u0421\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430, \\u043D\\u0430 \\u043A\\u043E\\u0442\\u043E\\u0440\\u043E\\u0439 \\u0432\\u044B \\u0440\\u0430\\u0431\\u043E\\u0442\\u0430\\u0435\\u0442\\u0435, \\u0431\\u044B\\u043B\\u0430 \\u0443\\u0434\\u0430\\u043B\\u0435\\u043D\\u0430 \\u0434\\u0440\\u0443\\u0433\\u0438\\u043C \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u0435\\u043C. \\u041F\\u0435\\u0440\\u0435\\u0437\\u0430\\u043F\\u0438\\u0441\\u0430\\u0442\\u044C \\u044D\\u0442\\u043E \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u0435?\n#XMSG\nMessage.SaveChanges=\\u0421\\u043E\\u0445\\u0440\\u0430\\u043D\\u0438\\u0442\\u0435 \\u0441\\u0432\\u043E\\u0438 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F.\n#XMSG\nMessage.NoPages=\\u0421\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u044B \\u043D\\u0435\\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B.\n#XMSG\nMessage.NoPagesFound=\\u0421\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u044B \\u043D\\u0435 \\u043D\\u0430\\u0439\\u0434\\u0435\\u043D\\u044B. \\u0418\\u0437\\u043C\\u0435\\u043D\\u0438\\u0442\\u0435 \\u043A\\u0440\\u0438\\u0442\\u0435\\u0440\\u0438\\u0438 \\u043F\\u043E\\u0438\\u0441\\u043A\\u0430.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=\\u041A\\u043E\\u043D\\u0442\\u0435\\u043D\\u0442 \\u043E\\u0433\\u0440\\u0430\\u043D\\u0438\\u0447\\u0435\\u043D \\u043A\\u043E\\u043D\\u0442\\u0435\\u043A\\u0441\\u0442\\u043E\\u043C \\u0440\\u043E\\u043B\\u0438.\n#XMSG\nMessage.NotAssigned=\\u041D\\u0435 \\u043F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0435\\u043D\\u043E.\n#XMSG\nMessage.StatusAssigned=\\u041F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0435\\u043D\\u043E\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=\\u041D\\u043E\\u0432\\u0430\\u044F \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=\\u0412\\u044B\\u0431\\u0440\\u0430\\u0442\\u044C \\u043A\\u043E\\u043D\\u0442\\u0435\\u043A\\u0441\\u0442 \\u0440\\u043E\\u043B\\u0438\n#XTIT\nTitle.TilesHaveErrors=\\u041F\\u043B\\u0438\\u0442\\u043A\\u0438 \\u0441\\u043E\\u0434\\u0435\\u0440\\u0436\\u0430\\u0442 \\u043E\\u0448\\u0438\\u0431\\u043A\\u0438\n#XTIT\nDeleteDialog.Title=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C\n#XMSG\nDeleteDialog.Text=\\u0414\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u043E \\u0443\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C \\u0432\\u044B\\u0431\\u0440\\u0430\\u043D\\u043D\\u0443\\u044E \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0443?\n#XBUT\nDeleteDialog.ConfirmButton=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C\n#XTIT\nDeleteDialog.LockedTitle=\\u0421\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430 \\u0437\\u0430\\u0431\\u043B\\u043E\\u043A\\u0438\\u0440\\u043E\\u0432\\u0430\\u043D\\u0430\n#XMSG\nDeleteDialog.LockedText=\\u0412\\u044B\\u0431\\u0440\\u0430\\u043D\\u043D\\u0430\\u044F \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430 \\u0437\\u0430\\u0431\\u043B\\u043E\\u043A\\u0438\\u0440\\u043E\\u0432\\u0430\\u043D\\u0430 \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u0435\\u043C "{0}".\n#XMSG\nDeleteDialog.TransportRequired=\\u0412\\u044B\\u0431\\u0435\\u0440\\u0438\\u0442\\u0435 \\u043F\\u0430\\u043A\\u0435\\u0442 \\u043F\\u0435\\u0440\\u0435\\u043D\\u043E\\u0441\\u0430 \\u0434\\u043B\\u044F \\u0443\\u0434\\u0430\\u043B\\u0435\\u043D\\u0438\\u044F \\u0432\\u044B\\u0431\\u0440\\u0430\\u043D\\u043D\\u043E\\u0439 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u044B.\n\n#XMSG\nEditDialog.LockedText=\\u0412\\u044B\\u0431\\u0440\\u0430\\u043D\\u043D\\u0430\\u044F \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430 \\u0437\\u0430\\u0431\\u043B\\u043E\\u043A\\u0438\\u0440\\u043E\\u0432\\u0430\\u043D\\u0430 \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u0435\\u043C "{0}".\n#XMSG\nEditDialog.TransportRequired=\\u0412\\u044B\\u0431\\u0435\\u0440\\u0438\\u0442\\u0435 \\u043F\\u0430\\u043A\\u0435\\u0442 \\u043F\\u0435\\u0440\\u0435\\u043D\\u043E\\u0441\\u0430 \\u0434\\u043B\\u044F \\u0440\\u0435\\u0434\\u0430\\u043A\\u0442\\u0438\\u0440\\u043E\\u0432\\u0430\\u043D\\u0438\\u044F \\u0432\\u044B\\u0431\\u0440\\u0430\\u043D\\u043D\\u043E\\u0439 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u044B.\n#XTIT\nEditDialog.Title=\\u0420\\u0435\\u0434\\u0430\\u043A\\u0442\\u0438\\u0440\\u043E\\u0432\\u0430\\u0442\\u044C \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0443\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=\\u042D\\u0442\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430 \\u0441\\u043E\\u0437\\u0434\\u0430\\u043D\\u0430 \\u043D\\u0430 \\u044F\\u0437\\u044B\\u043A\\u0435 "{0}", \\u043D\\u043E \\u0432\\u044B \\u0432\\u044B\\u043F\\u043E\\u043B\\u043D\\u0438\\u043B\\u0438 \\u0432\\u0445\\u043E\\u0434 \\u043D\\u0430 \\u044F\\u0437\\u044B\\u043A\\u0435 "{1}". \\u0414\\u043B\\u044F \\u043F\\u0440\\u043E\\u0434\\u043E\\u043B\\u0436\\u0435\\u043D\\u0438\\u044F \\u0440\\u0430\\u0431\\u043E\\u0442\\u044B \\u0438\\u0437\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C \\u044F\\u0437\\u044B\\u043A \\u0432\\u0445\\u043E\\u0434\\u0430 \\u043D\\u0430 "{0}".\n\n#XFLD\nTileInfoPopover.Label.Subtitle=\\u041F\\u043E\\u0434\\u0437\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A\n#XFLD\nTileInfoPopover.Label.Icon=\\u0417\\u043D\\u0430\\u0447\\u043E\\u043A\n#XFLD\nTileInfoPopover.Label.SemanticObject=\\u0421\\u0435\\u043C\\u0430\\u043D\\u0442\\u0438\\u0447\\u0435\\u0441\\u043A\\u0438\\u0439 \\u043E\\u0431\\u044A\\u0435\\u043A\\u0442\n#XFLD\nTileInfoPopover.Label.SemanticAction=\\u0421\\u0435\\u043C\\u0430\\u043D\\u0442\\u0438\\u0447\\u0435\\u0441\\u043A\\u0430\\u044F \\u043E\\u043F\\u0435\\u0440\\u0430\\u0446\\u0438\\u044F\n#XFLD\nTileInfoPopover.Label.FioriID=\\u0418\\u0434. \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F Fiori\n#XFLD\nTileInfoPopover.Label.AppDetail=\\u0421\\u0432\\u0435\\u0434\\u0435\\u043D\\u0438\\u044F \\u043E \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0438\n#XFLD\nTileInfoPopover.Label.AppType=\\u0422\\u0438\\u043F \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u044F\n#XFLD\nTileInfoPopover.Label.TileType=\\u0422\\u0438\\u043F \\u043F\\u043B\\u0438\\u0442\\u043A\\u0438\n#XFLD\nTileInfoPopover.Label.AvailableDevices=\\u0414\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B\\u0435 \\u0443\\u0441\\u0442\\u0440\\u043E\\u0439\\u0441\\u0442\\u0432\\u0430\n\n#XTIT\nErrorDialog.Title=\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430\n\n#XTIT\nConfirmChangesDialog.Title=\\u041F\\u0440\\u0435\\u0434\\u0443\\u043F\\u0440\\u0435\\u0436\\u0434\\u0435\\u043D\\u0438\\u0435\n\n#XTIT\nPageOverview.Title=\\u0412\\u0435\\u0434\\u0435\\u043D\\u0438\\u0435 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=\\u0424\\u043E\\u0440\\u043C\\u0430\\u0442\n\n#XTIT\nCopyDialog.Title=\\u0421\\u043A\\u043E\\u043F\\u0438\\u0440\\u043E\\u0432\\u0430\\u0442\\u044C \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0443\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=\\u0421\\u043A\\u043E\\u043F\\u0438\\u0440\\u043E\\u0432\\u0430\\u0442\\u044C "{0}"?\n#XFLD\nCopyDialog.NewID=\\u041A\\u043E\\u043F\\u0438\\u044F "{0}"\n\n#XMSG\nTitle.NoSectionTitle=\\u0417\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A \\u0440\\u0430\\u0437\\u0434\\u0435\\u043B\\u0430 {0} \\u043F\\u0443\\u0441\\u0442.\n#XMSG\nTitle.UnsufficientRoles=\\u041F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0435\\u043D\\u0430 \\u043D\\u0435\\u0434\\u043E\\u0441\\u0442\\u0430\\u0442\\u043E\\u0447\\u043D\\u0430\\u044F \\u0440\\u043E\\u043B\\u044C \\u0434\\u043B\\u044F \\u043F\\u0440\\u043E\\u0441\\u043C\\u043E\\u0442\\u0440\\u0430 \\u0432\\u0438\\u0437\\u0443\\u0430\\u043B\\u0438\\u0437\\u0430\\u0446\\u0438\\u0438.\n#XMSG\nTitle.VisualizationIsNotVisible=\\u0412\\u0438\\u0437\\u0443\\u0430\\u043B\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F \\u043D\\u0435 \\u0431\\u0443\\u0434\\u0435\\u0442 \\u0432\\u0438\\u0434\\u0438\\u043C\\u043E\\u0439.\n#XMSG\nTitle.VisualizationNotNavigateable=\\u0412\\u0438\\u0437\\u0443\\u0430\\u043B\\u0438\\u0437\\u0430\\u0446\\u0438\\u044E \\u043D\\u0435\\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E \\u043E\\u0442\\u043A\\u0440\\u044B\\u0442\\u044C \\u0432 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0438.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=\\u0421\\u0442\\u0430\\u0442\\u0438\\u0447\\u0435\\u0441\\u043A\\u0430\\u044F \\u043F\\u043B\\u0438\\u0442\\u043A\\u0430\n#XTIT\nTitle.DynamicTile=\\u0414\\u0438\\u043D\\u0430\\u043C\\u0438\\u0447\\u0435\\u0441\\u043A\\u0430\\u044F \\u043F\\u043B\\u0438\\u0442\\u043A\\u0430\n#XTIT\nTitle.CustomTile=\\u041F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u044C\\u0441\\u043A\\u0430\\u044F \\u043F\\u043B\\u0438\\u0442\\u043A\\u0430\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=\\u041F\\u0440\\u0435\\u0434\\u043F\\u0440\\u043E\\u0441\\u043C\\u043E\\u0442\\u0440 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u044B\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=\\u0421\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430 \\u043D\\u0435 \\u043D\\u0430\\u0439\\u0434\\u0435\\u043D\\u0430.\n#XLNK\nErrorPage.Link=\\u0412\\u0435\\u0434\\u0435\\u043D\\u0438\\u0435 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_sh.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=Odr\\u017Eavaj unakrsnog klijenta stranica\n\n#XBUT\nButton.Add=Dodaj\n#XBUT\nButton.Cancel=Odustani\n#XBUT\nButton.ClosePreview=Zatvori prethodni prikaz\n#XBUT\nButton.Copy=Kopiraj\n#XBUT\nButton.Create=Kreiraj\n#XBUT\nButton.Delete=Izbri\\u0161i\n#XBUT\nButton.Edit=Uredi\n#XBUT\nButton.Save=Sa\\u010Duvaj\n#XBUT\nButton.Select=Odaberi\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=Poka\\u017Ei kataloge\n#XBUT\nButton.HideCatalogs=Sakrij kataloge\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Izdanja\\: {0}\n#XBUT\nButton.SortCatalogs=Prebaci na redosled re\\u0111anja kataloga\n#XBUT\nButton.CollapseCatalogs=Sa\\u017Emi sve kataloge\n#XBUT\nButton.ExpandCatalogs=Pro\\u0161iri sve kataloge\n#XBUT\nButton.ShowDetails=Poka\\u017Ei detalje\n#XBUT\nButton.PagePreview=Prethodni prikaz stranice\n#XBUT\nButton.ErrorMsg=Poruke o gre\\u0161kama\n#XBUT\nButton.EditHeader=Uredi zaglavlje\n#XBUT\nButton.ContextSelector=Odaberi kontekst uloge {0}\n#XBUT\nButton.OverwriteChanges=Pi\\u0161i preko\n#XBUT\nButton.DismissChanges=Odbaci promene\n\n#XTOL\nTooltip.AddToSections=Dodaj odeljcima\n#XTOL: Tooltip for the search button\nTooltip.Search=Tra\\u017Ei\n#XTOL\nTooltip.SearchForTiles=Tra\\u017Ei podekrane\n#XTOL\nTooltip.SearchForRoles=Tra\\u017Ei uloge\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Radna povr\\u0161ina\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=Poka\\u017Ei pode\\u0161avanja re\\u0111anja\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=Poka\\u017Ei pode\\u0161avanja filtera\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=Poka\\u017Ei pode\\u0161avanja grupe\n\n#XFLD\nLabel.PageID=ID stranice\n#XFLD\nLabel.Title=Naslov\n#XFLD\nLabel.WorkbenchRequest=Zahtev za radno okru\\u017Eenje\n#XFLD\nLabel.Package=Paket\n#XFLD\nLabel.TransportInformation=Informacije o prenosu\n#XFLD\nLabel.Details=Detalji\\:\n#XFLD\nLabel.ResponseCode=\\u0160ifra odgovora\\:\n#XFLD\nLabel.ModifiedBy=Izmenio\\:\n#XFLD\nLabel.Description=Opis\n#XFLD\nLabel.CreatedByFullname=Kreirao\n#XFLD\nLabel.CreatedOn=Kreirano\n#XFLD\nLabel.ChangedByFullname=Promenio\n#XFLD\nLabel.ChangedOn=Promenjeno\n#XFLD\nLabel.PageTitle=Naslov stranice\n#XFLD\nLabel.AssignedRole=Dodeljena uloga\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Naslov\n#XCOL\nColumn.PageDescription=Opis\n#XCOL\nColumn.PageAssignmentStatus=Dodeljeno mestu/ulozi\n#XCOL\nColumn.PagePackage=Paket\n#XCOL\nColumn.PageWorkbenchRequest=Zahtev za radno okru\\u017Eenje\n#XCOL\nColumn.PageCreatedBy=Kreirao\n#XCOL\nColumn.PageCreatedOn=Kreirano\n#XCOL\nColumn.PageChangedBy=Promenio\n#XCOL\nColumn.PageChangedOn=Promenjeno\n\n#XTOL\nPlaceholder.SectionName=Unesite naziv odeljka\n#XTOL\nPlaceholder.SearchForTiles=Tra\\u017Ei podekrane\n#XTOL\nPlaceholder.SearchForRoles=Tra\\u017Ei uloge\n#XTOL\nPlaceholder.CopyPageTitle=Kopija "{0}"\n#XTOL\nPlaceholder.CopyPageID=Kopija "{0}"\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=sve\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=Odeljak {0} nema podekran. U cilju postizanja doslednosti, preporu\\u010Dujemo vam da unesete naziv za svaki odeljak.\n#XMSG\nMessage.InvalidSectionTitle=Idealno bi bilo da unesete naziv odeljka.\n#XMSG\nMessage.NoInternetConnection=Proverite internet vezu.\n#XMSG\nMessage.SavedChanges=Va\\u0161e promene su sa\\u010Duvane.\n#XMSG\nMessage.InvalidPageID=Koristite samo slede\\u0107e znakove\\: A-Z, 0-9, _ i /. ID stranice ne sme po\\u010Dinjati brojem.\n#XMSG\nMessage.EmptyPageID=Navedite va\\u017Ee\\u0107i ID stranice.\n#XMSG\nMessage.EmptyTitle=Navedite va\\u017Ee\\u0107i naslov.\n#XMSG\nMessage.NoRoleSelected=Odaberite najmanje jednu ulogu.\n#XMSG\nMessage.SuccessDeletePage=Odabrani objekat je izbrisan.\n#XMSG\nMessage.ClipboardCopySuccess=Detalji su uspe\\u0161no kopirani.\n#YMSE\nMessage.ClipboardCopyFail=Gre\\u0161ka pri kopiranju detalja.\n#XMSG\nMessage.PageCreated=Stranica je kreirana.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=Nema podekrana\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=Uloge nisu dostupne.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=Uloge nisu na\\u0111ene. Poku\\u0161ajte da prilagodite tra\\u017Eenje.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=Nema odeljaka\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=Nije uspelo u\\u010Ditavanje podekrana {0} u odeljku "{1}".\\n\\n Najverovatniji uzrok je neta\\u010Dna konfiguracija sadr\\u017Eaja SAP Fiori launchpad. Vizualizacija ne\\u0107e biti prikazana korisniku.\n#XMSG\nMessage.NavigationTargetError=Cilj usmeravanja se ne mo\\u017Ee razre\\u0161iti.\n#XMSG\nMessage.LoadPageError=Nije mogu\\u0107e u\\u010Ditati stranicu.\n#XMSG\nMessage.UpdatePageError=Nije mogu\\u0107e a\\u017Eurirati stranicu.\n#XMSG\nMessage.CreatePageError=Nije mogu\\u0107e kreirati stranicu.\n#XMSG\nMessage.TilesHaveErrors=Neki podekrani ili odeljci imaju gre\\u0161ke. Da li sigurno \\u017Eelite da nastavite sa snimanjem?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=Nije bilo mogu\\u0107e razre\\u0161iti cilj usmeravanja podekrana\\: "{0}".\\n\\n Najverovatniji uzrok je neta\\u010Dna konfiguracija sadr\\u017Eaja SAP Fiori launchpad- Vizualizacija ne mo\\u017Ee da otvori aplikaciju.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=Da li sigurno \\u017Eelite da izbri\\u0161ete odeljak "{0}"?\n#XMSG\nMessage.Section.DeleteNoTitle=Da li sigurno \\u017Eelite da izbri\\u0161ete ovaj odeljak?\n#XMSG\nMessage.OverwriteChanges=Izvr\\u0161ene su promene dok ste ure\\u0111ivali stranicu. Da li \\u017Eelite da pi\\u0161ete preko njih?\n#XMSG\nMessage.OverwriteRemovedPage=Stranicu na kojoj radite je izbrisao drugi korisnik. Da li \\u017Eelite da pi\\u0161ete preko ove promene?\n#XMSG\nMessage.SaveChanges=Sa\\u010Duvajte svoje promene.\n#XMSG\nMessage.NoPages=Stranice nisu dostupne.\n#XMSG\nMessage.NoPagesFound=Stranice nisu na\\u0111ene. Poku\\u0161ajte da prilagodite tra\\u017Eenje.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Kontekst ograni\\u010Den na kontekst uloge.\n#XMSG\nMessage.NotAssigned=Nije dodeljeno.\n#XMSG\nMessage.StatusAssigned=Dodeljeno\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=Nova stranica\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=Odaberi kontekst uloge\n#XTIT\nTitle.TilesHaveErrors=Podekrani imaju gre\\u0161ke\n#XTIT\nDeleteDialog.Title=Izbri\\u0161i\n#XMSG\nDeleteDialog.Text=Da li sigurno \\u017Eelite da izbri\\u0161ete odabranu stranicu?\n#XBUT\nDeleteDialog.ConfirmButton=Izbri\\u0161i\n#XTIT\nDeleteDialog.LockedTitle=Stranica zaklju\\u010Dana\n#XMSG\nDeleteDialog.LockedText=Odabranu stranicu je zaklju\\u010Dao korisnik "{0}".\n#XMSG\nDeleteDialog.TransportRequired=Odaberite paket za transport za brisanje odabrane stranice.\n\n#XMSG\nEditDialog.LockedText=Odabranu stranicu je zaklju\\u010Dao korisnik "{0}".\n#XMSG\nEditDialog.TransportRequired=Odaberite paket za transport za ure\\u0111ivanje odabrane stranice.\n#XTIT\nEditDialog.Title=Uredi stranicu\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=Ova stranica je kreirana na jeziku "{0}" a va\\u0161 jezik prijave je postavljen na "{1}". Za nastavak promenite va\\u0161 jezik prijave na "{0}".\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Podnaslov\n#XFLD\nTileInfoPopover.Label.Icon=Ikona\n#XFLD\nTileInfoPopover.Label.SemanticObject=Semanti\\u010Dki objekat\n#XFLD\nTileInfoPopover.Label.SemanticAction=Semanti\\u010Dka radnja\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori ID\n#XFLD\nTileInfoPopover.Label.AppDetail=Detalj aplikacije\n#XFLD\nTileInfoPopover.Label.AppType=Tip aplikacije\n#XFLD\nTileInfoPopover.Label.TileType=Tip podekrana\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Dostupni ure\\u0111aji\n\n#XTIT\nErrorDialog.Title=Gre\\u0161ka\n\n#XTIT\nConfirmChangesDialog.Title=Upozorenje\n\n#XTIT\nPageOverview.Title=Odr\\u017Eavaj stranice\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=Izgled\n\n#XTIT\nCopyDialog.Title=Kopiraj stranicu\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=Da li \\u017Eelite da kopirate "{0}"?\n#XFLD\nCopyDialog.NewID=Kopija "{0}"\n\n#XMSG\nTitle.NoSectionTitle=Naslov odeljka za odeljak {0} je prazan.\n#XMSG\nTitle.UnsufficientRoles=Nedovoljna dodela uloge za prikaz vizualizacije.\n#XMSG\nTitle.VisualizationIsNotVisible=Vizualizacija ne\\u0107e biti prikazana.\n#XMSG\nTitle.VisualizationNotNavigateable=Vizualizacija ne mo\\u017Ee da otvori aplikaciju.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Stati\\u010Dki podekran\n#XTIT\nTitle.DynamicTile=Dinami\\u010Dki podekran\n#XTIT\nTitle.CustomTile=Prilago\\u0111eni podekran\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=Prethodni prikaz stranice\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=Na\\u017Ealost, ne mo\\u017Eemo da na\\u0111emo ovu stranicu.\n#XLNK\nErrorPage.Link=Odr\\u017Eavaj stranice\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_sk.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=\\u00DAdr\\u017Eba str\\u00E1nok nad r\\u00E1mec klienta\n\n#XBUT\nButton.Add=Prida\\u0165\n#XBUT\nButton.Cancel=Zru\\u0161i\\u0165\n#XBUT\nButton.ClosePreview=Zavrie\\u0165 n\\u00E1h\\u013Ead\n#XBUT\nButton.Copy=Kop\\u00EDrova\\u0165\n#XBUT\nButton.Create=Vytvori\\u0165\n#XBUT\nButton.Delete=Vymaza\\u0165\n#XBUT\nButton.Edit=Upravi\\u0165\n#XBUT\nButton.Save=Ulo\\u017Ei\\u0165\n#XBUT\nButton.Select=Vybra\\u0165\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=Zobrazi\\u0165 katal\\u00F3gy\n#XBUT\nButton.HideCatalogs=Skry\\u0165 katal\\u00F3gy\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Probl\\u00E9my\\: {0}\n#XBUT\nButton.SortCatalogs=Prepn\\u00FA\\u0165 poradie triedenia katal\\u00F3gu\n#XBUT\nButton.CollapseCatalogs=Zbali\\u0165 v\\u0161etky katal\\u00F3gy\n#XBUT\nButton.ExpandCatalogs=Rozbali\\u0165 v\\u0161etky katal\\u00F3gy\n#XBUT\nButton.ShowDetails=Zobrazi\\u0165 detaily\n#XBUT\nButton.PagePreview=N\\u00E1h\\u013Ead str\\u00E1nky\n#XBUT\nButton.ErrorMsg=Chybov\\u00E9 hl\\u00E1senia\n#XBUT\nButton.EditHeader=Spracova\\u0165 d\\u00E1ta hlavi\\u010Dky\n#XBUT\nButton.ContextSelector=Vybra\\u0165 kontext roly {0}\n#XBUT\nButton.OverwriteChanges=Prep\\u00EDsa\\u0165\n#XBUT\nButton.DismissChanges=Odmietnu\\u0165 zmeny\n\n#XTOL\nTooltip.AddToSections=Prida\\u0165 do sekci\\u00ED\n#XTOL: Tooltip for the search button\nTooltip.Search=H\\u013Eada\\u0165\n#XTOL\nTooltip.SearchForTiles=H\\u013Eada\\u0165 dla\\u017Edice\n#XTOL\nTooltip.SearchForRoles=H\\u013Eada\\u0165 roly\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Desktop\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=Zobrazi\\u0165 nastavenia triedenia\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=Zobrazi\\u0165 nastavenia filtra\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=Zobrazi\\u0165 nastavenia skupiny\n\n#XFLD\nLabel.PageID=ID str\\u00E1nky\n#XFLD\nLabel.Title=Nadpis\n#XFLD\nLabel.WorkbenchRequest=Po\\u017Eiadavka na workbench\n#XFLD\nLabel.Package=Paket\n#XFLD\nLabel.TransportInformation=Inform\\u00E1cie o transporte\n#XFLD\nLabel.Details=Detaily\\:\n#XFLD\nLabel.ResponseCode=K\\u00F3d odpovede\\:\n#XFLD\nLabel.ModifiedBy=Zmenil\\:\n#XFLD\nLabel.Description=Popis\n#XFLD\nLabel.CreatedByFullname=Vytvoril\n#XFLD\nLabel.CreatedOn=Vytvoren\\u00E9 d\\u0148a\n#XFLD\nLabel.ChangedByFullname=Zmenil\n#XFLD\nLabel.ChangedOn=Zmenen\\u00E9 d\\u0148a\n#XFLD\nLabel.PageTitle=Nadpis str\\u00E1nky\n#XFLD\nLabel.AssignedRole=Priraden\\u00E1 rola\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Nadpis\n#XCOL\nColumn.PageDescription=Popis\n#XCOL\nColumn.PageAssignmentStatus=Priraden\\u00E9 priestoru/role\n#XCOL\nColumn.PagePackage=Paket\n#XCOL\nColumn.PageWorkbenchRequest=Po\\u017Eiadavka na workbench\n#XCOL\nColumn.PageCreatedBy=Vytvoril\n#XCOL\nColumn.PageCreatedOn=Vytvoren\\u00E9 d\\u0148a\n#XCOL\nColumn.PageChangedBy=Zmenil\n#XCOL\nColumn.PageChangedOn=Zmenen\\u00E9 d\\u0148a\n\n#XTOL\nPlaceholder.SectionName=Zadajte n\\u00E1zov sekcie\n#XTOL\nPlaceholder.SearchForTiles=H\\u013Eada\\u0165 dla\\u017Edice\n#XTOL\nPlaceholder.SearchForRoles=H\\u013Eada\\u0165 roly\n#XTOL\nPlaceholder.CopyPageTitle=K\\u00F3pia "{0}"\n#XTOL\nPlaceholder.CopyPageID=K\\u00F3pia "{0}"\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=v\\u0161etky\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=Sekcia {0} nem\\u00E1 nadpis. Z d\\u00F4vodu konzistentn\\u00E9ho pou\\u017E\\u00EDvate\\u013Esk\\u00E9ho prostredia odpor\\u00FA\\u010Dame, aby ste zadali n\\u00E1zov pre ka\\u017Ed\\u00FA sekciu.\n#XMSG\nMessage.InvalidSectionTitle=Ide\\u00E1lne je zada\\u0165 n\\u00E1zov sekcie.\n#XMSG\nMessage.NoInternetConnection=Skontrolujte internetov\\u00E9 pripojenie.\n#XMSG\nMessage.SavedChanges=Va\\u0161e zmeny boli ulo\\u017Een\\u00E9.\n#XMSG\nMessage.InvalidPageID=Pou\\u017Eite len nasledovn\\u00E9 znaky\\: A-Z, 0-9, _ a /. ID str\\u00E1nky nem\\u00E1 za\\u010D\\u00EDna\\u0165 \\u010D\\u00EDslom.\n#XMSG\nMessage.EmptyPageID=Zadajte platn\\u00E9 ID str\\u00E1nky.\n#XMSG\nMessage.EmptyTitle=Zadajte platn\\u00FD nadpis.\n#XMSG\nMessage.NoRoleSelected=Vyberte aspo\\u0148 jednu rolu.\n#XMSG\nMessage.SuccessDeletePage=Zvolen\\u00FD objekt bol vymazan\\u00FD.\n#XMSG\nMessage.ClipboardCopySuccess=Detaily boli \\u00FAspe\\u0161ne skop\\u00EDrovan\\u00E9.\n#YMSE\nMessage.ClipboardCopyFail=Pri kop\\u00EDrovan\\u00ED detailov sa vyskytla chyba.\n#XMSG\nMessage.PageCreated=Str\\u00E1nka bola vytvoren\\u00E1.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=\\u017Diadne dla\\u017Edice\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=Nie s\\u00FA k dispoz\\u00EDcii \\u017Eiadne roly.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=Nena\\u0161li sa \\u017Eiadne roly. Sk\\u00FAste upravi\\u0165 svoje h\\u013Eadanie.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=\\u017Diadne sekcie\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=Nepodarilo sa na\\u010D\\u00EDta\\u0165 dla\\u017Edicu {0} v sekcii "{1}".\\n\\nJe to pravdepodobne sp\\u00F4soben\\u00E9 nespr\\u00E1vnou konfigur\\u00E1ciou obsahu launchpadu SAP Fiori. Vizualiz\\u00E1cia sa pou\\u017E\\u00EDvate\\u013Eovi nezobraz\\u00ED.\n#XMSG\nMessage.NavigationTargetError=Cie\\u013E navig\\u00E1cie sa nepodarilo rozpozna\\u0165.\n#XMSG\nMessage.LoadPageError=Str\\u00E1nku sa nepodarilo na\\u010D\\u00EDta\\u0165.\n#XMSG\nMessage.UpdatePageError=Str\\u00E1nku sa nepodarilo aktualizova\\u0165.\n#XMSG\nMessage.CreatePageError=Str\\u00E1nku sa nepodarilo vytvori\\u0165.\n#XMSG\nMessage.TilesHaveErrors=Niektor\\u00E9 dla\\u017Edice alebo sekcie obsahuj\\u00FA chyby. Naozaj chcete pokra\\u010Dova\\u0165 v ukladan\\u00ED?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=Nepodarilo sa rozpozna\\u0165 cie\\u013E navig\\u00E1cie pre dla\\u017Edicu\\: "{0}".\\n\\nJe to pravdepodobne sp\\u00F4soben\\u00E9 nespr\\u00E1vnou konfigur\\u00E1ciou obsahu launchpadu SAP Fiori. Vizualiz\\u00E1cia nem\\u00F4\\u017Ee otvori\\u0165 aplik\\u00E1ciu.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=Naozaj chcete sekciu  "{0}" vymaza\\u0165?\n#XMSG\nMessage.Section.DeleteNoTitle=Naozaj chcete t\\u00FAto sekciu vymaza\\u0165?\n#XMSG\nMessage.OverwriteChanges=Po\\u010Das \\u00FApravy str\\u00E1nky sa vykonali zmeny. Chcete ich prep\\u00EDsa\\u0165?\n#XMSG\nMessage.OverwriteRemovedPage=Str\\u00E1nka, na ktorej pracujete, bola vymazan\\u00E1 in\\u00FDm pou\\u017E\\u00EDvate\\u013Eom. Chcete t\\u00FAto zmenu prep\\u00EDsa\\u0165?\n#XMSG\nMessage.SaveChanges=Ulo\\u017Ete svoje zmeny.\n#XMSG\nMessage.NoPages=\\u017Diadne str\\u00E1nky nie s\\u00FA k dispoz\\u00EDcii.\n#XMSG\nMessage.NoPagesFound=Nena\\u0161li sa \\u017Eiadne str\\u00E1nky. Sk\\u00FAste upravi\\u0165 svoje h\\u013Eadanie.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Obsah obmedzen\\u00FD na kontext roly.\n#XMSG\nMessage.NotAssigned=Nepriraden\\u00E9.\n#XMSG\nMessage.StatusAssigned=Priraden\\u00E9\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=Nov\\u00E1 str\\u00E1nka\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=V\\u00FDber kontextu roly\n#XTIT\nTitle.TilesHaveErrors=Dla\\u017Edice obsahuj\\u00FA chyby\n#XTIT\nDeleteDialog.Title=Vymaza\\u0165\n#XMSG\nDeleteDialog.Text=Chcete vybrat\\u00FA str\\u00E1nku naozaj vymaza\\u0165?\n#XBUT\nDeleteDialog.ConfirmButton=Vymaza\\u0165\n#XTIT\nDeleteDialog.LockedTitle=Str\\u00E1nka je zablokovan\\u00E1\n#XMSG\nDeleteDialog.LockedText=Zvolen\\u00FA str\\u00E1nku blokuje pou\\u017E\\u00EDvate\\u013E "{0}".\n#XMSG\nDeleteDialog.TransportRequired=Ak chcete zvolen\\u00FA str\\u00E1nku vymaza\\u0165, vyberte transportn\\u00FD paket.\n\n#XMSG\nEditDialog.LockedText=Zvolen\\u00FA str\\u00E1nku blokuje pou\\u017E\\u00EDvate\\u013E "{0}".\n#XMSG\nEditDialog.TransportRequired=Ak chcete zvolen\\u00FA str\\u00E1nku upravi\\u0165, vyberte transportn\\u00FD paket.\n#XTIT\nEditDialog.Title=Upravi\\u0165 str\\u00E1nku\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=T\\u00E1to str\\u00E1nka bola vytvoren\\u00E1 v jazyku "{0}", ale v\\u00E1\\u0161 prihlasovac\\u00ED jazyk je nastaven\\u00FD na "{1}". Ak chcete pokra\\u010Dova\\u0165, zme\\u0148te svoj prihlasovac\\u00ED jazyk na "{0}".\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Podnadpis\n#XFLD\nTileInfoPopover.Label.Icon=Ikona\n#XFLD\nTileInfoPopover.Label.SemanticObject=S\\u00E9mantick\\u00FD objekt\n#XFLD\nTileInfoPopover.Label.SemanticAction=S\\u00E9mantick\\u00E1 akcia\n#XFLD\nTileInfoPopover.Label.FioriID=ID Fiori\n#XFLD\nTileInfoPopover.Label.AppDetail=Detail aplik\\u00E1cie\n#XFLD\nTileInfoPopover.Label.AppType=Typ aplik\\u00E1cie\n#XFLD\nTileInfoPopover.Label.TileType=Typ dla\\u017Edice\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Dostupn\\u00E9 zariadenia\n\n#XTIT\nErrorDialog.Title=Chyba\n\n#XTIT\nConfirmChangesDialog.Title=Upozornenie\n\n#XTIT\nPageOverview.Title=\\u00DAdr\\u017Eba str\\u00E1nok\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=Rozlo\\u017Eenie\n\n#XTIT\nCopyDialog.Title=Kop\\u00EDrova\\u0165 str\\u00E1nku\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=Chcete kop\\u00EDrova\\u0165 "{0}"?\n#XFLD\nCopyDialog.NewID=K\\u00F3pia "{0}"\n\n#XMSG\nTitle.NoSectionTitle=Nadpis sekcie {0} je pr\\u00E1zdny.\n#XMSG\nTitle.UnsufficientRoles=Nedostato\\u010Dn\\u00E9 priradenie roly na zobrazenie vizualiz\\u00E1cie.\n#XMSG\nTitle.VisualizationIsNotVisible=Vizualiz\\u00E1cia sa nezobraz\\u00ED.\n#XMSG\nTitle.VisualizationNotNavigateable=Vizualiz\\u00E1cia nem\\u00F4\\u017Ee otvori\\u0165 aplik\\u00E1ciu.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Statick\\u00E1 dla\\u017Edica\n#XTIT\nTitle.DynamicTile=Dynamick\\u00E1 dla\\u017Edica\n#XTIT\nTitle.CustomTile=Vlastn\\u00E1 dla\\u017Edica\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=N\\u00E1h\\u013Ead str\\u00E1nky\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=\\u013Dutujeme, t\\u00FAto str\\u00E1nku sa n\\u00E1m nepodarilo n\\u00E1js\\u0165.\n#XLNK\nErrorPage.Link=\\u00DAdr\\u017Eba str\\u00E1nok\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_sl.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=Vzdr\\u017Eevanje strani za vse kliente\n\n#XBUT\nButton.Add=Dodajanje\n#XBUT\nButton.Cancel=Preklic\n#XBUT\nButton.ClosePreview=Zapri predogled\n#XBUT\nButton.Copy=Kopiranje\n#XBUT\nButton.Create=Kreiranje\n#XBUT\nButton.Delete=Brisanje\n#XBUT\nButton.Edit=Urejanje\n#XBUT\nButton.Save=Shranjevanje\n#XBUT\nButton.Select=Izbira\n#XBUT\nButton.Ok=V redu\n#XBUT\nButton.ShowCatalogs=Prika\\u017Ei kataloge\n#XBUT\nButton.HideCatalogs=Skrij kataloge\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Te\\u017Eave\\: {0}\n#XBUT\nButton.SortCatalogs=Preklop zaporedja razvr\\u0161\\u010Danja kataloga\n#XBUT\nButton.CollapseCatalogs=Skr\\u010Di vse kataloge\n#XBUT\nButton.ExpandCatalogs=Raz\\u0161iri vse kataloge\n#XBUT\nButton.ShowDetails=Prika\\u017Ei detajle\n#XBUT\nButton.PagePreview=Predogled strani\n#XBUT\nButton.ErrorMsg=Sporo\\u010Dila o napakah\n#XBUT\nButton.EditHeader=Obdelava glave\n#XBUT\nButton.ContextSelector=Izberite kontekst vloge {0}\n#XBUT\nButton.OverwriteChanges=Prepi\\u0161i\n#XBUT\nButton.DismissChanges=Opusti spremembe\n\n#XTOL\nTooltip.AddToSections=Dodaj segmentom\n#XTOL: Tooltip for the search button\nTooltip.Search=Iskanje\n#XTOL\nTooltip.SearchForTiles=Iskanje plo\\u0161\\u010Dic\n#XTOL\nTooltip.SearchForRoles=I\\u0161\\u010Di vloge\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Namizni ra\\u010Dunalnik\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=Prika\\u017Ei nastavitve razvr\\u0161\\u010Danja\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=Prika\\u017Ei nastavitve filtra\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=Prika\\u017Ei nastavitve skupine\n\n#XFLD\nLabel.PageID=ID strani\n#XFLD\nLabel.Title=Naslov\n#XFLD\nLabel.WorkbenchRequest=Zahteva za Workbench\n#XFLD\nLabel.Package=Paket\n#XFLD\nLabel.TransportInformation=Informacije o transportu\n#XFLD\nLabel.Details=Detajli\\:\n#XFLD\nLabel.ResponseCode=Koda odgovora\\:\n#XFLD\nLabel.ModifiedBy=Spremenil\\:\n#XFLD\nLabel.Description=Opis\n#XFLD\nLabel.CreatedByFullname=Kreiral\n#XFLD\nLabel.CreatedOn=Kreirano dne\n#XFLD\nLabel.ChangedByFullname=Spremenil\n#XFLD\nLabel.ChangedOn=Spremenjeno dne\n#XFLD\nLabel.PageTitle=Naslov strani\n#XFLD\nLabel.AssignedRole=Dodeljena vloga\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Naslov\n#XCOL\nColumn.PageDescription=Opis\n#XCOL\nColumn.PageAssignmentStatus=Dodeljeno prostoru/vlogi\n#XCOL\nColumn.PagePackage=Paket\n#XCOL\nColumn.PageWorkbenchRequest=Zahteva za Workbench\n#XCOL\nColumn.PageCreatedBy=Kreiral\n#XCOL\nColumn.PageCreatedOn=Kreirano dne\n#XCOL\nColumn.PageChangedBy=Spremenil\n#XCOL\nColumn.PageChangedOn=Spremenjeno dne\n\n#XTOL\nPlaceholder.SectionName=Vnesite ime iskanja\n#XTOL\nPlaceholder.SearchForTiles=Iskanje plo\\u0161\\u010Dic\n#XTOL\nPlaceholder.SearchForRoles=I\\u0161\\u010Di vloge\n#XTOL\nPlaceholder.CopyPageTitle=Kopija "{0}"\n#XTOL\nPlaceholder.CopyPageID=Kopija "{0}"\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=vse\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=Segment {0} nima naslova. Da zagotovite konsistentno uporabni\\u0161ko izku\\u0161njo, predlagamo, da vnesete ime za vsak segment.\n#XMSG\nMessage.InvalidSectionTitle=\\u010Ce je mogo\\u010De, vnesite ime segmenta.\n#XMSG\nMessage.NoInternetConnection=Prosim, preverite svojo internetno povezavo.\n#XMSG\nMessage.SavedChanges=Va\\u0161e spremembe so bile shranjene.\n#XMSG\nMessage.InvalidPageID=Prosim, uporabite le naslednje znake\\: A-Z a-z 0-9 _ in /. ID strani se ne sme za\\u010Deti s \\u0161tevilko.\n#XMSG\nMessage.EmptyPageID=Prosim, navedite veljaven ID strani.\n#XMSG\nMessage.EmptyTitle=Prosim, navedite veljaven naslov.\n#XMSG\nMessage.NoRoleSelected=Prosim, izberite vsaj eno vlogo.\n#XMSG\nMessage.SuccessDeletePage=Izbrani objekt je bil izbrisan.\n#XMSG\nMessage.ClipboardCopySuccess=Detajli so bili uspe\\u0161no kopirani.\n#YMSE\nMessage.ClipboardCopyFail=Pri kopiranju detajlov je pri\\u0161lo do napake.\n#XMSG\nMessage.PageCreated=Stran je bila kreirana.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=Brez plo\\u0161\\u010Dic\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=Vloge niso na voljo.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=Vloge niso najdene. Poskusite prilagoditi svoje iskanje.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=Ni segmentov\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=Plo\\u0161\\u010Dice {0} v segmentu "{1}" ni bilo mogo\\u010De nalo\\u017Eiti.\\n\\nRazlog je verjetno nepravilna konfiguracija vsebine SAP Fiori Launchpada. Vizualizacija ne bo vidna uporabniku.\n#XMSG\nMessage.NavigationTargetError=Cilja navigacije ni bilo mogo\\u010De razre\\u0161iti.\n#XMSG\nMessage.LoadPageError=Strani ni bilo mogo\\u010De nalo\\u017Eiti.\n#XMSG\nMessage.UpdatePageError=Strani ni bilo mogo\\u010De posodobiti.\n#XMSG\nMessage.CreatePageError=Strani ni bilo mogo\\u010De kreirati.\n#XMSG\nMessage.TilesHaveErrors=Nekatere plo\\u0161\\u010Dice ali segmenti imajo napake. Res \\u017Eelite nadaljevati s shranjevanjem?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=Navigacije do cilja plo\\u0161\\u010Dice ni bilo mogo\\u010De razre\\u0161iti\\: "{0}".\\n\\nRazlog je verjetno nepravilna konfiguracija vsebine SAP Fiori Launchpada. Vizualizacija ne bo vidna uporabniku.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=Res \\u017Eelite izbrisati segment "{0}"?\n#XMSG\nMessage.Section.DeleteNoTitle=Res \\u017Eelite izbrisati ta segment?\n#XMSG\nMessage.OverwriteChanges=Medtem ko ste urejali stran je pri\\u0161lo do sprememb. Jih \\u017Eelite prepisati?\n#XMSG\nMessage.OverwriteRemovedPage=Stran, ki jo obdelujete, je izbrisal drug uporabnik. \\u017Delite prepisati to spremembo?\n#XMSG\nMessage.SaveChanges=Prosim, shranite svoje spremembe.\n#XMSG\nMessage.NoPages=Strani niso na voljo.\n#XMSG\nMessage.NoPagesFound=Strani niso najdene. Poskusite prilagoditi svoje iskanje.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Vsebina omejena na kontekst vloge.\n#XMSG\nMessage.NotAssigned=Ni dodeljeno.\n#XMSG\nMessage.StatusAssigned=Dodeljeno\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=Nova stran\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=Izberite kontekst vloge\n#XTIT\nTitle.TilesHaveErrors=Plo\\u0161\\u010Dice imajo napake\n#XTIT\nDeleteDialog.Title=Brisanje\n#XMSG\nDeleteDialog.Text=Res \\u017Eelite izbrisati izbrano stran?\n#XBUT\nDeleteDialog.ConfirmButton=Brisanje\n#XTIT\nDeleteDialog.LockedTitle=Stran blokirana\n#XMSG\nDeleteDialog.LockedText=Izbrano stran je blokiral uporabnik "{0}".\n#XMSG\nDeleteDialog.TransportRequired=Prosim, izberite transportni paket za brisanje izbrane strani.\n\n#XMSG\nEditDialog.LockedText=Izbrano stran je blokiral uporabnik "{0}".\n#XMSG\nEditDialog.TransportRequired=Prosim, izberite transportni paket za obdelavo izbrane strani.\n#XTIT\nEditDialog.Title=Obdelava strani\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=Ta stran je bila ustvarjena v jeziku "{0}", jezik prijave pa je nastavljen na "{1}". Za nadaljevanje spremenite jezik prijave na "{0}".\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Podnaslov\n#XFLD\nTileInfoPopover.Label.Icon=Ikona\n#XFLD\nTileInfoPopover.Label.SemanticObject=Semanti\\u010Dni objekt\n#XFLD\nTileInfoPopover.Label.SemanticAction=Semanti\\u010Dna akcija\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori ID\n#XFLD\nTileInfoPopover.Label.AppDetail=Detajl aplikacije\n#XFLD\nTileInfoPopover.Label.AppType=Tip aplikacije\n#XFLD\nTileInfoPopover.Label.TileType=Tip plo\\u0161\\u010Dice\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Razpolo\\u017Eljive naprave\n\n#XTIT\nErrorDialog.Title=Napaka\n\n#XTIT\nConfirmChangesDialog.Title=Opozorilo\n\n#XTIT\nPageOverview.Title=Vzdr\\u017Eevanje strani\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=Izgled\n\n#XTIT\nCopyDialog.Title=Kopiranje strani\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=\\u017Delite kopirati "{0}"?\n#XFLD\nCopyDialog.NewID=Kopija "{0}"\n\n#XMSG\nTitle.NoSectionTitle=Naslov segmenta {0} je prazen.\n#XMSG\nTitle.UnsufficientRoles=Nezadostna dodelitev vloge za prikaz vizualizacije.\n#XMSG\nTitle.VisualizationIsNotVisible=Vizualizaciji ne bo prikazana.\n#XMSG\nTitle.VisualizationNotNavigateable=Vizualizacija ne more odpreti aplikacije.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Stati\\u010Dna plo\\u0161\\u010Dica\n#XTIT\nTitle.DynamicTile=Dinami\\u010Dna plo\\u0161\\u010Dica\n#XTIT\nTitle.CustomTile=Plo\\u0161\\u010Dica po meri\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=Predogled strani\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=Te strani ni mogo\\u010De najti.\n#XLNK\nErrorPage.Link=Vzdr\\u017Eevanje strani\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_sv.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=Klient\\u00F6vergripande underh\\u00E5ll av sidor\n\n#XBUT\nButton.Add=L\\u00E4gg till\n#XBUT\nButton.Cancel=Avbryt\n#XBUT\nButton.ClosePreview=St\\u00E4ng f\\u00F6rhandsgranskning\n#XBUT\nButton.Copy=Kopiera\n#XBUT\nButton.Create=Skapa\n#XBUT\nButton.Delete=Radera\n#XBUT\nButton.Edit=Bearbeta\n#XBUT\nButton.Save=Spara\n#XBUT\nButton.Select=V\\u00E4lj\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=Visa kataloger\n#XBUT\nButton.HideCatalogs=D\\u00F6lj kataloger\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Problem\\: {0}\n#XBUT\nButton.SortCatalogs=V\\u00E4xla sorteringsf\\u00F6ljd i katalog\n#XBUT\nButton.CollapseCatalogs=Komprimera alla kataloger\n#XBUT\nButton.ExpandCatalogs=Expandera alla kataloger\n#XBUT\nButton.ShowDetails=Visa detaljer\n#XBUT\nButton.PagePreview=F\\u00F6rhandsgranskning av sida\n#XBUT\nButton.ErrorMsg=Felmeddelanden\n#XBUT\nButton.EditHeader=Bearbeta huvud\n#XBUT\nButton.ContextSelector=V\\u00E4lj rollkontext {0}\n#XBUT\nButton.OverwriteChanges=Skriv \\u00F6ver\n#XBUT\nButton.DismissChanges=F\\u00F6rkasta \\u00E4ndringar\n\n#XTOL\nTooltip.AddToSections=L\\u00E4gg till i avsnitt\n#XTOL: Tooltip for the search button\nTooltip.Search=S\\u00F6k\n#XTOL\nTooltip.SearchForTiles=S\\u00F6k paneler\n#XTOL\nTooltip.SearchForRoles=S\\u00F6k roller\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Skrivbord\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=Visa sorteringsinst\\u00E4llningar\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=Visa filterinst\\u00E4llningar\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=Visa gruppinst\\u00E4llningar\n\n#XFLD\nLabel.PageID=Sid-ID\n#XFLD\nLabel.Title=Rubrik\n#XFLD\nLabel.WorkbenchRequest=Workbenchorder\n#XFLD\nLabel.Package=Paket\n#XFLD\nLabel.TransportInformation=Transportinformation\n#XFLD\nLabel.Details=Detaljer\\:\n#XFLD\nLabel.ResponseCode=Svarskod\\:\n#XFLD\nLabel.ModifiedBy=\\u00C4ndring av\\:\n#XFLD\nLabel.Description=Beskrivning\n#XFLD\nLabel.CreatedByFullname=Uppl\\u00E4ggning av\n#XFLD\nLabel.CreatedOn=Uppl\\u00E4ggning den\n#XFLD\nLabel.ChangedByFullname=\\u00C4ndring av\n#XFLD\nLabel.ChangedOn=\\u00C4ndring den\n#XFLD\nLabel.PageTitle=Sidrubrik\n#XFLD\nLabel.AssignedRole=Allokerad roll\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Rubrik\n#XCOL\nColumn.PageDescription=Beskrivning\n#XCOL\nColumn.PageAssignmentStatus=Allokerad till omr\\u00E5de/roll\n#XCOL\nColumn.PagePackage=Paket\n#XCOL\nColumn.PageWorkbenchRequest=Workbenchorder\n#XCOL\nColumn.PageCreatedBy=Uppl\\u00E4ggning av\n#XCOL\nColumn.PageCreatedOn=Uppl\\u00E4ggning den\n#XCOL\nColumn.PageChangedBy=\\u00C4ndring av\n#XCOL\nColumn.PageChangedOn=\\u00C4ndring den\n\n#XTOL\nPlaceholder.SectionName=Ange ett avsnittsnamn\n#XTOL\nPlaceholder.SearchForTiles=S\\u00F6k paneler\n#XTOL\nPlaceholder.SearchForRoles=S\\u00F6k roller\n#XTOL\nPlaceholder.CopyPageTitle=Kopia av "{0}"\n#XTOL\nPlaceholder.CopyPageID=Kopia av "{0}"\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=alla\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=Avsnitt {0} saknar rubrik. F\\u00F6r att anv\\u00E4ndarupplevelsen ska vara konsekvent rekommenderar vi att du namnger varje avsnitt.\n#XMSG\nMessage.InvalidSectionTitle=Du b\\u00F6r ange ett avsnittsnamn.\n#XMSG\nMessage.NoInternetConnection=Kontrollera internetuppkopplingen.\n#XMSG\nMessage.SavedChanges=\\u00C4ndringar har sparats.\n#XMSG\nMessage.InvalidPageID=Anv\\u00E4nd endast f\\u00F6ljande tecken\\: A-Z, 0-9, _ och /. Sid-ID f\\u00E5r inte b\\u00F6rja med en siffra.\n#XMSG\nMessage.EmptyPageID=Ange en giltig sid-ID.\n#XMSG\nMessage.EmptyTitle=Ange en giltig rubrik.\n#XMSG\nMessage.NoRoleSelected=V\\u00E4lj minst en roll.\n#XMSG\nMessage.SuccessDeletePage=Valt objekt har raderats.\n#XMSG\nMessage.ClipboardCopySuccess=Detaljer har kopierats.\n#YMSE\nMessage.ClipboardCopyFail=Ett fel intr\\u00E4ffade vid kopiering av detaljer.\n#XMSG\nMessage.PageCreated=Sidan har skapats.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=Inga paneler\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=Inga tillg\\u00E4ngliga roller.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=Inga roller hittades. Pr\\u00F6va att anpassa s\\u00F6kningen.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=Inga avsnitt\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=Panel {0} kunde inte l\\u00E4sas in i avsnittet "{1}".\\n\\nDetta beror troligen p\\u00E5 en felaktig inneh\\u00E5llskonfiguration f\\u00F6r SAP Fiori-launchpad. Visualiseringen visas inte f\\u00F6r anv\\u00E4ndaren.\n#XMSG\nMessage.NavigationTargetError=Navigeringsm\\u00E5l kunde inte \\u00E5tg\\u00E4rdas.\n#XMSG\nMessage.LoadPageError=Sidan kunde inte l\\u00E4sas in.\n#XMSG\nMessage.UpdatePageError=Sidan kunde inte uppdateras.\n#XMSG\nMessage.CreatePageError=Sidan kunde inte skapas.\n#XMSG\nMessage.TilesHaveErrors=N\\u00E5gra av panelerna eller avsnitten inneh\\u00E5ller fel. Vill du forts\\u00E4tta spara?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=Navigeringsm\\u00E5l f\\u00F6r panel "{0}" kunde inte \\u00E5tg\\u00E4rdas.\\n\\nDetta beror troligen p\\u00E5 en felaktig inneh\\u00E5llskonfiguration f\\u00F6r SAP Fiori-launchpad. Visualiseringen kan inte \\u00F6ppna en applikation.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=Ska avsnitt "{0}" raderas?\n#XMSG\nMessage.Section.DeleteNoTitle=Ska avsnittet raderas?\n#XMSG\nMessage.OverwriteChanges=\\u00C4ndringar har gjorts medan du redigerade sidan. Vill du skriva \\u00F6ver dem?\n#XMSG\nMessage.OverwriteRemovedPage=Sidan du arbetar med har raderats av en annan anv\\u00E4ndare. Vill du skriva \\u00F6ver den \\u00E4ndringen?\n#XMSG\nMessage.SaveChanges=Spara dina \\u00E4ndringar.\n#XMSG\nMessage.NoPages=Inga sidor \\u00E4r tillg\\u00E4ngliga.\n#XMSG\nMessage.NoPagesFound=Inga sidor hittades. Pr\\u00F6va att anpassa s\\u00F6kningen.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Inneh\\u00E5ll begr\\u00E4nsat till rollkontext.\n#XMSG\nMessage.NotAssigned=Inte allokerad.\n#XMSG\nMessage.StatusAssigned=Allokerad\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=Ny sida\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=V\\u00E4lj rollkontext\n#XTIT\nTitle.TilesHaveErrors=Paneler inneh\\u00E5ller fel\n#XTIT\nDeleteDialog.Title=Radera\n#XMSG\nDeleteDialog.Text=Ska vald sida raderas?\n#XBUT\nDeleteDialog.ConfirmButton=Radera\n#XTIT\nDeleteDialog.LockedTitle=Sida sp\\u00E4rras\n#XMSG\nDeleteDialog.LockedText=Vald sida sp\\u00E4rras av anv\\u00E4ndare "{0}".\n#XMSG\nDeleteDialog.TransportRequired=V\\u00E4lj ett transportpaket f\\u00F6r att radera vald sida.\n\n#XMSG\nEditDialog.LockedText=Vald sida sp\\u00E4rras av anv\\u00E4ndare "{0}".\n#XMSG\nEditDialog.TransportRequired=V\\u00E4lj ett transportpaket f\\u00F6r att bearbeta vald sida.\n#XTIT\nEditDialog.Title=Bearbeta sida\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=Sidan har skapats p\\u00E5 "{0}" men ditt inloggningsspr\\u00E5k \\u00E4r "{1}". \\u00C4ndra ditt inloggningsspr\\u00E5k till "{0}" f\\u00F6r att forts\\u00E4tta.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Underrubrik\n#XFLD\nTileInfoPopover.Label.Icon=Ikon\n#XFLD\nTileInfoPopover.Label.SemanticObject=Semantiskt objekt\n#XFLD\nTileInfoPopover.Label.SemanticAction=Semantisk \\u00E5tg\\u00E4rd\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori-ID\n#XFLD\nTileInfoPopover.Label.AppDetail=Appdetalj\n#XFLD\nTileInfoPopover.Label.AppType=Apptyp\n#XFLD\nTileInfoPopover.Label.TileType=Paneltyp\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Tillg\\u00E4ngliga enheter\n\n#XTIT\nErrorDialog.Title=Fel\n\n#XTIT\nConfirmChangesDialog.Title=Varning\n\n#XTIT\nPageOverview.Title=Underh\\u00E5ll sidor\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=Layout\n\n#XTIT\nCopyDialog.Title=Kopiera sida\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=Ska "{0}" kopieras?\n#XFLD\nCopyDialog.NewID=Kopia av "{0}"\n\n#XMSG\nTitle.NoSectionTitle=Avsnittsrubrik f\\u00F6r avsnitt {0} \\u00E4r tom.\n#XMSG\nTitle.UnsufficientRoles=Otillr\\u00E4cklig rollallokering f\\u00F6r visning av visualisering.\n#XMSG\nTitle.VisualizationIsNotVisible=Visualisering visas inte.\n#XMSG\nTitle.VisualizationNotNavigateable=Visualisering kan inte \\u00F6ppna en app.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Statisk panel\n#XTIT\nTitle.DynamicTile=Dynamisk panel\n#XTIT\nTitle.CustomTile=Kundspecifik panel\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=F\\u00F6rhandsgranskning av sida\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=Sidan kunde inte hittas.\n#XLNK\nErrorPage.Link=Underh\\u00E5ll sidor\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_th.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=\\u0E1B\\u0E23\\u0E31\\u0E1A\\u0E1B\\u0E23\\u0E38\\u0E07\\u0E2B\\u0E19\\u0E49\\u0E32\\u0E23\\u0E30\\u0E2B\\u0E27\\u0E48\\u0E32\\u0E07\\u0E44\\u0E04\\u0E25\\u0E40\\u0E2D\\u0E19\\u0E17\\u0E4C\n\n#XBUT\nButton.Add=\\u0E40\\u0E1E\\u0E34\\u0E48\\u0E21\n#XBUT\nButton.Cancel=\\u0E22\\u0E01\\u0E40\\u0E25\\u0E34\\u0E01\n#XBUT\nButton.ClosePreview=\\u0E1B\\u0E34\\u0E14\\u0E01\\u0E32\\u0E23\\u0E41\\u0E2A\\u0E14\\u0E07\\u0E15\\u0E31\\u0E27\\u0E2D\\u0E22\\u0E48\\u0E32\\u0E07\n#XBUT\nButton.Copy=\\u0E04\\u0E31\\u0E14\\u0E25\\u0E2D\\u0E01\n#XBUT\nButton.Create=\\u0E2A\\u0E23\\u0E49\\u0E32\\u0E07\n#XBUT\nButton.Delete=\\u0E25\\u0E1A\n#XBUT\nButton.Edit=\\u0E41\\u0E01\\u0E49\\u0E44\\u0E02\n#XBUT\nButton.Save=\\u0E40\\u0E01\\u0E47\\u0E1A\\u0E1A\\u0E31\\u0E19\\u0E17\\u0E36\\u0E01\n#XBUT\nButton.Select=\\u0E40\\u0E25\\u0E37\\u0E2D\\u0E01\n#XBUT\nButton.Ok=\\u0E15\\u0E01\\u0E25\\u0E07\n#XBUT\nButton.ShowCatalogs=\\u0E41\\u0E2A\\u0E14\\u0E07\\u0E41\\u0E04\\u0E15\\u0E15\\u0E32\\u0E25\\u0E47\\u0E2D\\u0E01\n#XBUT\nButton.HideCatalogs=\\u0E0B\\u0E48\\u0E2D\\u0E19\\u0E41\\u0E04\\u0E15\\u0E15\\u0E32\\u0E25\\u0E47\\u0E2D\\u0E01\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=\\u0E1B\\u0E31\\u0E0D\\u0E2B\\u0E32\\: {0}\n#XBUT\nButton.SortCatalogs=\\u0E2A\\u0E25\\u0E31\\u0E1A\\u0E25\\u0E33\\u0E14\\u0E31\\u0E1A\\u0E01\\u0E32\\u0E23\\u0E08\\u0E31\\u0E14\\u0E40\\u0E23\\u0E35\\u0E22\\u0E07\\u0E41\\u0E04\\u0E15\\u0E15\\u0E32\\u0E25\\u0E47\\u0E2D\\u0E01\n#XBUT\nButton.CollapseCatalogs=\\u0E22\\u0E48\\u0E2D\\u0E23\\u0E27\\u0E21\\u0E41\\u0E04\\u0E15\\u0E15\\u0E32\\u0E25\\u0E47\\u0E2D\\u0E01\\u0E17\\u0E31\\u0E49\\u0E07\\u0E2B\\u0E21\\u0E14\n#XBUT\nButton.ExpandCatalogs=\\u0E02\\u0E22\\u0E32\\u0E22\\u0E41\\u0E04\\u0E15\\u0E15\\u0E32\\u0E25\\u0E47\\u0E2D\\u0E01\\u0E17\\u0E31\\u0E49\\u0E07\\u0E2B\\u0E21\\u0E14\n#XBUT\nButton.ShowDetails=\\u0E41\\u0E2A\\u0E14\\u0E07\\u0E23\\u0E32\\u0E22\\u0E25\\u0E30\\u0E40\\u0E2D\\u0E35\\u0E22\\u0E14\n#XBUT\nButton.PagePreview=\\u0E01\\u0E32\\u0E23\\u0E41\\u0E2A\\u0E14\\u0E07\\u0E15\\u0E31\\u0E27\\u0E2D\\u0E22\\u0E48\\u0E32\\u0E07\\u0E2B\\u0E19\\u0E49\\u0E32\n#XBUT\nButton.ErrorMsg=\\u0E02\\u0E49\\u0E2D\\u0E04\\u0E27\\u0E32\\u0E21\\u0E41\\u0E2A\\u0E14\\u0E07\\u0E02\\u0E49\\u0E2D\\u0E1C\\u0E34\\u0E14\\u0E1E\\u0E25\\u0E32\\u0E14\n#XBUT\nButton.EditHeader=\\u0E41\\u0E01\\u0E49\\u0E44\\u0E02\\u0E2A\\u0E48\\u0E27\\u0E19\\u0E2B\\u0E31\\u0E27\n#XBUT\nButton.ContextSelector=\\u0E40\\u0E25\\u0E37\\u0E2D\\u0E01\\u0E40\\u0E19\\u0E37\\u0E49\\u0E2D\\u0E2B\\u0E32\\u0E1A\\u0E17\\u0E1A\\u0E32\\u0E17 {0}\n#XBUT\nButton.OverwriteChanges=\\u0E40\\u0E02\\u0E35\\u0E22\\u0E19\\u0E17\\u0E31\\u0E1A\n#XBUT\nButton.DismissChanges=\\u0E22\\u0E01\\u0E40\\u0E25\\u0E34\\u0E01\\u0E01\\u0E32\\u0E23\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E41\\u0E1B\\u0E25\\u0E07\n\n#XTOL\nTooltip.AddToSections=\\u0E40\\u0E1E\\u0E34\\u0E48\\u0E21\\u0E43\\u0E19\\u0E40\\u0E0B\\u0E01\\u0E0A\\u0E31\\u0E19\n#XTOL: Tooltip for the search button\nTooltip.Search=\\u0E04\\u0E49\\u0E19\\u0E2B\\u0E32\n#XTOL\nTooltip.SearchForTiles=\\u0E04\\u0E49\\u0E19\\u0E2B\\u0E32 Tile\n#XTOL\nTooltip.SearchForRoles=\\u0E04\\u0E49\\u0E19\\u0E2B\\u0E32\\u0E1A\\u0E17\\u0E1A\\u0E32\\u0E17\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=\\u0E40\\u0E14\\u0E2A\\u0E01\\u0E4C\\u0E17\\u0E2D\\u0E1B\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=\\u0E14\\u0E39\\u0E01\\u0E32\\u0E23\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E04\\u0E48\\u0E32\\u0E01\\u0E32\\u0E23\\u0E08\\u0E31\\u0E14\\u0E40\\u0E23\\u0E35\\u0E22\\u0E07\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=\\u0E14\\u0E39\\u0E01\\u0E32\\u0E23\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E04\\u0E48\\u0E32\\u0E1F\\u0E34\\u0E25\\u0E40\\u0E15\\u0E2D\\u0E23\\u0E4C\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=\\u0E14\\u0E39\\u0E01\\u0E32\\u0E23\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E04\\u0E48\\u0E32\\u0E01\\u0E25\\u0E38\\u0E48\\u0E21\n\n#XFLD\nLabel.PageID=ID \\u0E2B\\u0E19\\u0E49\\u0E32\n#XFLD\nLabel.Title=\\u0E0A\\u0E37\\u0E48\\u0E2D\n#XFLD\nLabel.WorkbenchRequest=\\u0E04\\u0E33\\u0E02\\u0E2D Workbench\n#XFLD\nLabel.Package=\\u0E41\\u0E1E\\u0E04\\u0E40\\u0E01\\u0E08\n#XFLD\nLabel.TransportInformation=\\u0E02\\u0E49\\u0E2D\\u0E21\\u0E39\\u0E25\\u0E01\\u0E32\\u0E23\\u0E17\\u0E23\\u0E32\\u0E19\\u0E2A\\u0E1B\\u0E2D\\u0E23\\u0E4C\\u0E15\n#XFLD\nLabel.Details=\\u0E23\\u0E32\\u0E22\\u0E25\\u0E30\\u0E40\\u0E2D\\u0E35\\u0E22\\u0E14\\:\n#XFLD\nLabel.ResponseCode=\\u0E23\\u0E2B\\u0E31\\u0E2A\\u0E01\\u0E32\\u0E23\\u0E15\\u0E2D\\u0E1A\\u0E2A\\u0E19\\u0E2D\\u0E07\\:\n#XFLD\nLabel.ModifiedBy=\\u0E1B\\u0E23\\u0E31\\u0E1A\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E42\\u0E14\\u0E22\\:\n#XFLD\nLabel.Description=\\u0E04\\u0E33\\u0E2D\\u0E18\\u0E34\\u0E1A\\u0E32\\u0E22\n#XFLD\nLabel.CreatedByFullname=\\u0E2A\\u0E23\\u0E49\\u0E32\\u0E07\\u0E42\\u0E14\\u0E22\n#XFLD\nLabel.CreatedOn=\\u0E2A\\u0E23\\u0E49\\u0E32\\u0E07\\u0E40\\u0E21\\u0E37\\u0E48\\u0E2D\n#XFLD\nLabel.ChangedByFullname=\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E41\\u0E1B\\u0E25\\u0E07\\u0E42\\u0E14\\u0E22\n#XFLD\nLabel.ChangedOn=\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E41\\u0E1B\\u0E25\\u0E07\\u0E40\\u0E21\\u0E37\\u0E48\\u0E2D\n#XFLD\nLabel.PageTitle=\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E2B\\u0E19\\u0E49\\u0E32\n#XFLD\nLabel.AssignedRole=\\u0E1A\\u0E17\\u0E1A\\u0E32\\u0E17\\u0E17\\u0E35\\u0E48\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E40\\u0E23\\u0E37\\u0E48\\u0E2D\\u0E07\n#XCOL\nColumn.PageDescription=\\u0E04\\u0E33\\u0E2D\\u0E18\\u0E34\\u0E1A\\u0E32\\u0E22\n#XCOL\nColumn.PageAssignmentStatus=\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E43\\u0E2B\\u0E49\\u0E01\\u0E31\\u0E1A\\u0E1E\\u0E37\\u0E49\\u0E19\\u0E17\\u0E35\\u0E48/\\u0E1A\\u0E17\\u0E1A\\u0E32\\u0E17\n#XCOL\nColumn.PagePackage=\\u0E41\\u0E1E\\u0E04\\u0E40\\u0E01\\u0E08\n#XCOL\nColumn.PageWorkbenchRequest=\\u0E04\\u0E33\\u0E02\\u0E2D Workbench\n#XCOL\nColumn.PageCreatedBy=\\u0E2A\\u0E23\\u0E49\\u0E32\\u0E07\\u0E42\\u0E14\\u0E22\n#XCOL\nColumn.PageCreatedOn=\\u0E2A\\u0E23\\u0E49\\u0E32\\u0E07\\u0E40\\u0E21\\u0E37\\u0E48\\u0E2D\n#XCOL\nColumn.PageChangedBy=\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E41\\u0E1B\\u0E25\\u0E07\\u0E42\\u0E14\\u0E22\n#XCOL\nColumn.PageChangedOn=\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E41\\u0E1B\\u0E25\\u0E07\\u0E40\\u0E21\\u0E37\\u0E48\\u0E2D\n\n#XTOL\nPlaceholder.SectionName=\\u0E1B\\u0E49\\u0E2D\\u0E19\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E40\\u0E0B\\u0E01\\u0E0A\\u0E31\\u0E19\n#XTOL\nPlaceholder.SearchForTiles=\\u0E04\\u0E49\\u0E19\\u0E2B\\u0E32 Tile\n#XTOL\nPlaceholder.SearchForRoles=\\u0E04\\u0E49\\u0E19\\u0E2B\\u0E32\\u0E1A\\u0E17\\u0E1A\\u0E32\\u0E17\n#XTOL\nPlaceholder.CopyPageTitle=\\u0E2A\\u0E33\\u0E40\\u0E19\\u0E32\\u0E02\\u0E2D\\u0E07 "{0}"\n#XTOL\nPlaceholder.CopyPageID=\\u0E2A\\u0E33\\u0E40\\u0E19\\u0E32\\u0E02\\u0E2D\\u0E07 "{0}"\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=\\u0E17\\u0E31\\u0E49\\u0E07\\u0E2B\\u0E21\\u0E14\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=\\u0E40\\u0E0B\\u0E01\\u0E0A\\u0E31\\u0E19 {0} \\u0E44\\u0E21\\u0E48\\u0E21\\u0E35\\u0E0A\\u0E37\\u0E48\\u0E2D \\u0E40\\u0E1E\\u0E37\\u0E48\\u0E2D\\u0E1B\\u0E23\\u0E30\\u0E2A\\u0E1A\\u0E01\\u0E32\\u0E23\\u0E13\\u0E4C\\u0E01\\u0E32\\u0E23\\u0E43\\u0E0A\\u0E49\\u0E07\\u0E32\\u0E19\\u0E02\\u0E2D\\u0E07\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49\\u0E17\\u0E35\\u0E48\\u0E2A\\u0E2D\\u0E14\\u0E04\\u0E25\\u0E49\\u0E2D\\u0E07\\u0E01\\u0E31\\u0E19 \\u0E40\\u0E23\\u0E32\\u0E02\\u0E2D\\u0E41\\u0E19\\u0E30\\u0E19\\u0E33\\u0E43\\u0E2B\\u0E49\\u0E04\\u0E38\\u0E13\\u0E1B\\u0E49\\u0E2D\\u0E19\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E2A\\u0E33\\u0E2B\\u0E23\\u0E31\\u0E1A\\u0E41\\u0E15\\u0E48\\u0E25\\u0E30\\u0E40\\u0E0B\\u0E01\\u0E0A\\u0E31\\u0E19\n#XMSG\nMessage.InvalidSectionTitle=\\u0E16\\u0E49\\u0E32\\u0E40\\u0E1B\\u0E47\\u0E19\\u0E44\\u0E1B\\u0E44\\u0E14\\u0E49 \\u0E04\\u0E38\\u0E13\\u0E04\\u0E27\\u0E23\\u0E1B\\u0E49\\u0E2D\\u0E19\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E40\\u0E0B\\u0E01\\u0E0A\\u0E31\\u0E19\n#XMSG\nMessage.NoInternetConnection=\\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E15\\u0E23\\u0E27\\u0E08\\u0E2A\\u0E2D\\u0E1A\\u0E01\\u0E32\\u0E23\\u0E40\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E21\\u0E15\\u0E48\\u0E2D\\u0E2D\\u0E34\\u0E19\\u0E40\\u0E15\\u0E2D\\u0E23\\u0E4C\\u0E40\\u0E19\\u0E47\\u0E15\\u0E02\\u0E2D\\u0E07\\u0E04\\u0E38\\u0E13\n#XMSG\nMessage.SavedChanges=\\u0E01\\u0E32\\u0E23\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E41\\u0E1B\\u0E25\\u0E07\\u0E02\\u0E2D\\u0E07\\u0E04\\u0E38\\u0E13\\u0E16\\u0E39\\u0E01\\u0E40\\u0E01\\u0E47\\u0E1A\\u0E1A\\u0E31\\u0E19\\u0E17\\u0E36\\u0E01\\u0E41\\u0E25\\u0E49\\u0E27\n#XMSG\nMessage.InvalidPageID=\\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E43\\u0E0A\\u0E49\\u0E2D\\u0E31\\u0E01\\u0E02\\u0E23\\u0E30\\u0E15\\u0E48\\u0E2D\\u0E44\\u0E1B\\u0E19\\u0E35\\u0E49\\u0E40\\u0E17\\u0E48\\u0E32\\u0E19\\u0E31\\u0E49\\u0E19\\: A-Z a-z 0-9 _ / \\u0E41\\u0E25\\u0E30 ID \\u0E2B\\u0E19\\u0E49\\u0E32\\u0E15\\u0E49\\u0E2D\\u0E07\\u0E44\\u0E21\\u0E48\\u0E02\\u0E36\\u0E49\\u0E19\\u0E15\\u0E49\\u0E19\\u0E14\\u0E49\\u0E27\\u0E22\\u0E15\\u0E31\\u0E27\\u0E40\\u0E25\\u0E02\n#XMSG\nMessage.EmptyPageID=\\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E23\\u0E30\\u0E1A\\u0E38 ID \\u0E2B\\u0E19\\u0E49\\u0E32\\u0E17\\u0E35\\u0E48\\u0E16\\u0E39\\u0E01\\u0E15\\u0E49\\u0E2D\\u0E07\n#XMSG\nMessage.EmptyTitle=\\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E23\\u0E30\\u0E1A\\u0E38\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E40\\u0E23\\u0E37\\u0E48\\u0E2D\\u0E07\\u0E17\\u0E35\\u0E48\\u0E16\\u0E39\\u0E01\\u0E15\\u0E49\\u0E2D\\u0E07\n#XMSG\nMessage.NoRoleSelected=\\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E40\\u0E25\\u0E37\\u0E2D\\u0E01\\u0E2D\\u0E22\\u0E48\\u0E32\\u0E07\\u0E19\\u0E49\\u0E2D\\u0E22\\u0E2B\\u0E19\\u0E36\\u0E48\\u0E07\\u0E1A\\u0E17\\u0E1A\\u0E32\\u0E17\n#XMSG\nMessage.SuccessDeletePage=\\u0E2D\\u0E2D\\u0E1A\\u0E40\\u0E08\\u0E04\\u0E17\\u0E35\\u0E48\\u0E40\\u0E25\\u0E37\\u0E2D\\u0E01\\u0E16\\u0E39\\u0E01\\u0E25\\u0E1A\\u0E41\\u0E25\\u0E49\\u0E27\n#XMSG\nMessage.ClipboardCopySuccess=\\u0E04\\u0E31\\u0E14\\u0E25\\u0E2D\\u0E01\\u0E23\\u0E32\\u0E22\\u0E25\\u0E30\\u0E40\\u0E2D\\u0E35\\u0E22\\u0E14\\u0E44\\u0E14\\u0E49\\u0E2A\\u0E33\\u0E40\\u0E23\\u0E47\\u0E08\n#YMSE\nMessage.ClipboardCopyFail=\\u0E21\\u0E35\\u0E02\\u0E49\\u0E2D\\u0E1C\\u0E34\\u0E14\\u0E1E\\u0E25\\u0E32\\u0E14\\u0E40\\u0E01\\u0E34\\u0E14\\u0E02\\u0E36\\u0E49\\u0E19\\u0E02\\u0E13\\u0E30\\u0E04\\u0E31\\u0E14\\u0E25\\u0E2D\\u0E01\\u0E23\\u0E32\\u0E22\\u0E25\\u0E30\\u0E40\\u0E2D\\u0E35\\u0E22\\u0E14\n#XMSG\nMessage.PageCreated=\\u0E2A\\u0E23\\u0E49\\u0E32\\u0E07\\u0E2B\\u0E19\\u0E49\\u0E32\\u0E41\\u0E25\\u0E49\\u0E27\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=\\u0E44\\u0E21\\u0E48\\u0E21\\u0E35\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E40\\u0E23\\u0E37\\u0E48\\u0E2D\\u0E07\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=\\u0E44\\u0E21\\u0E48\\u0E21\\u0E35\\u0E1A\\u0E17\\u0E1A\\u0E32\\u0E17\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=\\u0E44\\u0E21\\u0E48\\u0E1E\\u0E1A\\u0E1A\\u0E17\\u0E1A\\u0E32\\u0E17 \\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E25\\u0E2D\\u0E07\\u0E1B\\u0E23\\u0E31\\u0E1A\\u0E01\\u0E32\\u0E23\\u0E04\\u0E49\\u0E19\\u0E2B\\u0E32\\u0E02\\u0E2D\\u0E07\\u0E04\\u0E38\\u0E13\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=\\u0E44\\u0E21\\u0E48\\u0E21\\u0E35\\u0E40\\u0E0B\\u0E01\\u0E0A\\u0E31\\u0E19\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=\\u0E44\\u0E21\\u0E48\\u0E2A\\u0E32\\u0E21\\u0E32\\u0E23\\u0E16\\u0E42\\u0E2B\\u0E25\\u0E14 Tile {0} \\u0E43\\u0E19\\u0E40\\u0E0B\\u0E01\\u0E0A\\u0E31\\u0E19 "{1}" \\n                                                                                                                                       \\u0E0B\\u0E36\\u0E48\\u0E07\\u0E40\\u0E1B\\u0E47\\u0E19\\u0E44\\u0E1B\\u0E44\\u0E14\\u0E49\\u0E27\\u0E48\\u0E32\\u0E08\\u0E30\\u0E40\\u0E01\\u0E34\\u0E14\\u0E08\\u0E32\\u0E01\\u0E01\\u0E32\\u0E23\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E23\\u0E39\\u0E1B\\u0E41\\u0E1A\\u0E1A\\u0E40\\u0E19\\u0E37\\u0E49\\u0E2D\\u0E2B\\u0E32 SAP Fiori Launchpad \\u0E44\\u0E21\\u0E48\\u0E16\\u0E39\\u0E01\\u0E15\\u0E49\\u0E2D\\u0E07 \\u0E01\\u0E32\\u0E23\\u0E41\\u0E2A\\u0E14\\u0E07\\u0E20\\u0E32\\u0E1E\\u0E08\\u0E30\\u0E44\\u0E21\\u0E48\\u0E1B\\u0E23\\u0E32\\u0E01\\u0E0F\\u0E2A\\u0E33\\u0E2B\\u0E23\\u0E31\\u0E1A\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49\n#XMSG\nMessage.NavigationTargetError=\\u0E44\\u0E21\\u0E48\\u0E2A\\u0E32\\u0E21\\u0E32\\u0E23\\u0E16\\u0E41\\u0E01\\u0E49\\u0E44\\u0E02\\u0E40\\u0E1B\\u0E49\\u0E32\\u0E2B\\u0E21\\u0E32\\u0E22\\u0E01\\u0E32\\u0E23\\u0E40\\u0E19\\u0E27\\u0E34\\u0E40\\u0E01\\u0E15\n#XMSG\nMessage.LoadPageError=\\u0E44\\u0E21\\u0E48\\u0E2A\\u0E32\\u0E21\\u0E32\\u0E23\\u0E16\\u0E42\\u0E2B\\u0E25\\u0E14\\u0E2B\\u0E19\\u0E49\\u0E32\n#XMSG\nMessage.UpdatePageError=\\u0E44\\u0E21\\u0E48\\u0E2A\\u0E32\\u0E21\\u0E32\\u0E23\\u0E16\\u0E2D\\u0E31\\u0E1E\\u0E40\\u0E14\\u0E17\\u0E2B\\u0E19\\u0E49\\u0E32\n#XMSG\nMessage.CreatePageError=\\u0E44\\u0E21\\u0E48\\u0E2A\\u0E32\\u0E21\\u0E32\\u0E23\\u0E16\\u0E2A\\u0E23\\u0E49\\u0E32\\u0E07\\u0E2B\\u0E19\\u0E49\\u0E32\n#XMSG\nMessage.TilesHaveErrors=\\u0E1A\\u0E32\\u0E07 Tile \\u0E2B\\u0E23\\u0E37\\u0E2D\\u0E40\\u0E0B\\u0E01\\u0E0A\\u0E31\\u0E19\\u0E21\\u0E35\\u0E02\\u0E49\\u0E2D\\u0E1C\\u0E34\\u0E14\\u0E1E\\u0E25\\u0E32\\u0E14 \\u0E04\\u0E38\\u0E13\\u0E41\\u0E19\\u0E48\\u0E43\\u0E08\\u0E2B\\u0E23\\u0E37\\u0E2D\\u0E44\\u0E21\\u0E48\\u0E27\\u0E48\\u0E32\\u0E15\\u0E49\\u0E2D\\u0E07\\u0E01\\u0E32\\u0E23\\u0E14\\u0E33\\u0E40\\u0E19\\u0E34\\u0E19\\u0E01\\u0E32\\u0E23\\u0E40\\u0E01\\u0E47\\u0E1A\\u0E1A\\u0E31\\u0E19\\u0E17\\u0E36\\u0E01\\u0E15\\u0E48\\u0E2D?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=\\u0E44\\u0E21\\u0E48\\u0E2A\\u0E32\\u0E21\\u0E32\\u0E23\\u0E16\\u0E41\\u0E01\\u0E49\\u0E44\\u0E02\\u0E40\\u0E1B\\u0E49\\u0E32\\u0E2B\\u0E21\\u0E32\\u0E22\\u0E01\\u0E32\\u0E23\\u0E40\\u0E19\\u0E27\\u0E34\\u0E40\\u0E01\\u0E15\\u0E02\\u0E2D\\u0E07 Tile\\: "{0}"\\n\\n\\u0E0B\\u0E36\\u0E48\\u0E07\\u0E40\\u0E1B\\u0E47\\u0E19\\u0E44\\u0E1B\\u0E44\\u0E14\\u0E49\\u0E27\\u0E48\\u0E32\\u0E08\\u0E30\\u0E40\\u0E01\\u0E34\\u0E14\\u0E08\\u0E32\\u0E01\\u0E01\\u0E32\\u0E23\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E23\\u0E39\\u0E1B\\u0E41\\u0E1A\\u0E1A\\u0E40\\u0E19\\u0E37\\u0E49\\u0E2D\\u0E2B\\u0E32 SAP Fiori Launchpad \\u0E44\\u0E21\\u0E48\\u0E16\\u0E39\\u0E01\\u0E15\\u0E49\\u0E2D\\u0E07 \\u0E01\\u0E32\\u0E23\\u0E41\\u0E2A\\u0E14\\u0E07\\u0E20\\u0E32\\u0E1E\\u0E44\\u0E21\\u0E48\\u0E2A\\u0E32\\u0E21\\u0E32\\u0E23\\u0E16\\u0E40\\u0E1B\\u0E34\\u0E14\\u0E41\\u0E2D\\u0E1E\\u0E1E\\u0E25\\u0E34\\u0E40\\u0E04\\u0E0A\\u0E31\\u0E19\\u0E44\\u0E14\\u0E49\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=\\u0E04\\u0E38\\u0E13\\u0E41\\u0E19\\u0E48\\u0E43\\u0E08\\u0E2B\\u0E23\\u0E37\\u0E2D\\u0E44\\u0E21\\u0E48\\u0E27\\u0E48\\u0E32\\u0E15\\u0E49\\u0E2D\\u0E07\\u0E01\\u0E32\\u0E23\\u0E25\\u0E1A\\u0E40\\u0E0B\\u0E01\\u0E0A\\u0E31\\u0E19 "{0}"?\n#XMSG\nMessage.Section.DeleteNoTitle=\\u0E04\\u0E38\\u0E13\\u0E41\\u0E19\\u0E48\\u0E43\\u0E08\\u0E2B\\u0E23\\u0E37\\u0E2D\\u0E44\\u0E21\\u0E48\\u0E27\\u0E48\\u0E32\\u0E15\\u0E49\\u0E2D\\u0E07\\u0E01\\u0E32\\u0E23\\u0E25\\u0E1A\\u0E40\\u0E0B\\u0E01\\u0E0A\\u0E31\\u0E19\\u0E19\\u0E35\\u0E49?\n#XMSG\nMessage.OverwriteChanges=\\u0E21\\u0E35\\u0E01\\u0E32\\u0E23\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E41\\u0E1B\\u0E25\\u0E07\\u0E43\\u0E19\\u0E02\\u0E13\\u0E30\\u0E17\\u0E35\\u0E48\\u0E04\\u0E38\\u0E13\\u0E41\\u0E01\\u0E49\\u0E44\\u0E02\\u0E2B\\u0E19\\u0E49\\u0E32 \\u0E04\\u0E38\\u0E13\\u0E15\\u0E49\\u0E2D\\u0E07\\u0E01\\u0E32\\u0E23\\u0E17\\u0E35\\u0E48\\u0E08\\u0E30\\u0E40\\u0E02\\u0E35\\u0E22\\u0E19\\u0E17\\u0E31\\u0E1A\\u0E2B\\u0E23\\u0E37\\u0E2D\\u0E44\\u0E21\\u0E48?\n#XMSG\nMessage.OverwriteRemovedPage=\\u0E2B\\u0E19\\u0E49\\u0E32\\u0E17\\u0E35\\u0E48\\u0E04\\u0E38\\u0E13\\u0E43\\u0E0A\\u0E49\\u0E07\\u0E32\\u0E19\\u0E2D\\u0E22\\u0E39\\u0E48\\u0E16\\u0E39\\u0E01\\u0E25\\u0E1A\\u0E42\\u0E14\\u0E22\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49\\u0E23\\u0E32\\u0E22\\u0E2D\\u0E37\\u0E48\\u0E19 \\u0E04\\u0E38\\u0E13\\u0E15\\u0E49\\u0E2D\\u0E07\\u0E01\\u0E32\\u0E23\\u0E40\\u0E02\\u0E35\\u0E22\\u0E19\\u0E17\\u0E31\\u0E1A\\u0E01\\u0E32\\u0E23\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E41\\u0E1B\\u0E25\\u0E07\\u0E19\\u0E35\\u0E49\\u0E2B\\u0E23\\u0E37\\u0E2D\\u0E44\\u0E21\\u0E48?\n#XMSG\nMessage.SaveChanges=\\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E40\\u0E01\\u0E47\\u0E1A\\u0E1A\\u0E31\\u0E19\\u0E17\\u0E36\\u0E01\\u0E01\\u0E32\\u0E23\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E41\\u0E1B\\u0E25\\u0E07\\u0E02\\u0E2D\\u0E07\\u0E04\\u0E38\\u0E13\n#XMSG\nMessage.NoPages=\\u0E44\\u0E21\\u0E48\\u0E21\\u0E35\\u0E2B\\u0E19\\u0E49\\u0E32\\u0E17\\u0E35\\u0E48\\u0E1E\\u0E23\\u0E49\\u0E2D\\u0E21\\u0E43\\u0E0A\\u0E49\\u0E07\\u0E32\\u0E19\n#XMSG\nMessage.NoPagesFound=\\u0E44\\u0E21\\u0E48\\u0E1E\\u0E1A\\u0E2B\\u0E19\\u0E49\\u0E32\\u0E43\\u0E14\\u0E46 \\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E25\\u0E2D\\u0E07\\u0E1B\\u0E23\\u0E31\\u0E1A\\u0E01\\u0E32\\u0E23\\u0E04\\u0E49\\u0E19\\u0E2B\\u0E32\\u0E02\\u0E2D\\u0E07\\u0E04\\u0E38\\u0E13\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=\\u0E40\\u0E19\\u0E37\\u0E49\\u0E2D\\u0E2B\\u0E32\\u0E16\\u0E39\\u0E01\\u0E08\\u0E33\\u0E01\\u0E31\\u0E14\\u0E40\\u0E09\\u0E1E\\u0E32\\u0E30\\u0E40\\u0E19\\u0E37\\u0E49\\u0E2D\\u0E2B\\u0E32\\u0E1A\\u0E17\\u0E1A\\u0E32\\u0E17\n#XMSG\nMessage.NotAssigned=\\u0E44\\u0E21\\u0E48\\u0E44\\u0E14\\u0E49\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\n#XMSG\nMessage.StatusAssigned=\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E41\\u0E25\\u0E49\\u0E27\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=\\u0E2B\\u0E19\\u0E49\\u0E32\\u0E43\\u0E2B\\u0E21\\u0E48\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=\\u0E40\\u0E25\\u0E37\\u0E2D\\u0E01\\u0E40\\u0E19\\u0E37\\u0E49\\u0E2D\\u0E2B\\u0E32\\u0E1A\\u0E17\\u0E1A\\u0E32\\u0E17\n#XTIT\nTitle.TilesHaveErrors=Tile \\u0E21\\u0E35\\u0E02\\u0E49\\u0E2D\\u0E1C\\u0E34\\u0E14\\u0E1E\\u0E25\\u0E32\\u0E14\n#XTIT\nDeleteDialog.Title=\\u0E25\\u0E1A\n#XMSG\nDeleteDialog.Text=\\u0E04\\u0E38\\u0E13\\u0E41\\u0E19\\u0E48\\u0E43\\u0E08\\u0E2B\\u0E23\\u0E37\\u0E2D\\u0E44\\u0E21\\u0E48\\u0E27\\u0E48\\u0E32\\u0E15\\u0E49\\u0E2D\\u0E07\\u0E01\\u0E32\\u0E23\\u0E25\\u0E1A\\u0E2B\\u0E19\\u0E49\\u0E32\\u0E17\\u0E35\\u0E48\\u0E40\\u0E25\\u0E37\\u0E2D\\u0E01?\n#XBUT\nDeleteDialog.ConfirmButton=\\u0E25\\u0E1A\n#XTIT\nDeleteDialog.LockedTitle=\\u0E2B\\u0E19\\u0E49\\u0E32\\u0E16\\u0E39\\u0E01\\u0E25\\u0E47\\u0E2D\\u0E04\n#XMSG\nDeleteDialog.LockedText=\\u0E2B\\u0E19\\u0E49\\u0E32\\u0E17\\u0E35\\u0E48\\u0E40\\u0E25\\u0E37\\u0E2D\\u0E01\\u0E16\\u0E39\\u0E01\\u0E25\\u0E47\\u0E2D\\u0E04\\u0E42\\u0E14\\u0E22\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49 "{0}"\n#XMSG\nDeleteDialog.TransportRequired=\\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E40\\u0E25\\u0E37\\u0E2D\\u0E01\\u0E41\\u0E1E\\u0E04\\u0E40\\u0E01\\u0E08\\u0E01\\u0E32\\u0E23\\u0E17\\u0E23\\u0E32\\u0E19\\u0E2A\\u0E1B\\u0E2D\\u0E23\\u0E4C\\u0E15\\u0E40\\u0E1E\\u0E37\\u0E48\\u0E2D\\u0E25\\u0E1A\\u0E2B\\u0E19\\u0E49\\u0E32\\u0E17\\u0E35\\u0E48\\u0E40\\u0E25\\u0E37\\u0E2D\\u0E01\n\n#XMSG\nEditDialog.LockedText=\\u0E2B\\u0E19\\u0E49\\u0E32\\u0E17\\u0E35\\u0E48\\u0E40\\u0E25\\u0E37\\u0E2D\\u0E01\\u0E16\\u0E39\\u0E01\\u0E25\\u0E47\\u0E2D\\u0E04\\u0E42\\u0E14\\u0E22\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49 "{0}"\n#XMSG\nEditDialog.TransportRequired=\\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E40\\u0E25\\u0E37\\u0E2D\\u0E01\\u0E41\\u0E1E\\u0E04\\u0E40\\u0E01\\u0E08\\u0E01\\u0E32\\u0E23\\u0E17\\u0E23\\u0E32\\u0E19\\u0E2A\\u0E1B\\u0E2D\\u0E23\\u0E4C\\u0E15\\u0E40\\u0E1E\\u0E37\\u0E48\\u0E2D\\u0E41\\u0E01\\u0E49\\u0E44\\u0E02\\u0E2B\\u0E19\\u0E49\\u0E32\\u0E17\\u0E35\\u0E48\\u0E40\\u0E25\\u0E37\\u0E2D\\u0E01\n#XTIT\nEditDialog.Title=\\u0E41\\u0E01\\u0E49\\u0E44\\u0E02\\u0E2B\\u0E19\\u0E49\\u0E32\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=\\u0E2B\\u0E19\\u0E49\\u0E32\\u0E19\\u0E35\\u0E49\\u0E16\\u0E39\\u0E01\\u0E2A\\u0E23\\u0E49\\u0E32\\u0E07\\u0E40\\u0E1B\\u0E47\\u0E19\\u0E20\\u0E32\\u0E29\\u0E32 "{0}" \\u0E41\\u0E15\\u0E48\\u0E20\\u0E32\\u0E29\\u0E32\\u0E17\\u0E35\\u0E48\\u0E43\\u0E0A\\u0E49\\u0E40\\u0E02\\u0E49\\u0E32\\u0E2A\\u0E39\\u0E48\\u0E23\\u0E30\\u0E1A\\u0E1A\\u0E02\\u0E2D\\u0E07\\u0E04\\u0E38\\u0E13\\u0E16\\u0E39\\u0E01\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E40\\u0E1B\\u0E47\\u0E19 "{1}" \\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E20\\u0E32\\u0E29\\u0E32\\u0E17\\u0E35\\u0E48\\u0E43\\u0E0A\\u0E49\\u0E40\\u0E02\\u0E49\\u0E32\\u0E2A\\u0E39\\u0E48\\u0E23\\u0E30\\u0E1A\\u0E1A "{0}" \\u0E40\\u0E1E\\u0E37\\u0E48\\u0E2D\\u0E14\\u0E33\\u0E40\\u0E19\\u0E34\\u0E19\\u0E01\\u0E32\\u0E23\\u0E15\\u0E48\\u0E2D\n\n#XFLD\nTileInfoPopover.Label.Subtitle=\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E40\\u0E23\\u0E37\\u0E48\\u0E2D\\u0E07\\u0E23\\u0E2D\\u0E07\n#XFLD\nTileInfoPopover.Label.Icon=\\u0E44\\u0E2D\\u0E04\\u0E2D\\u0E19\n#XFLD\nTileInfoPopover.Label.SemanticObject=\\u0E2D\\u0E2D\\u0E1A\\u0E40\\u0E08\\u0E04\\u0E04\\u0E27\\u0E32\\u0E21\\u0E2B\\u0E21\\u0E32\\u0E22\n#XFLD\nTileInfoPopover.Label.SemanticAction=\\u0E01\\u0E32\\u0E23\\u0E14\\u0E33\\u0E40\\u0E19\\u0E34\\u0E19\\u0E01\\u0E32\\u0E23\\u0E40\\u0E01\\u0E35\\u0E48\\u0E22\\u0E27\\u0E01\\u0E31\\u0E1A\\u0E04\\u0E27\\u0E32\\u0E21\\u0E2B\\u0E21\\u0E32\\u0E22\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori ID\n#XFLD\nTileInfoPopover.Label.AppDetail=\\u0E23\\u0E32\\u0E22\\u0E25\\u0E30\\u0E40\\u0E2D\\u0E35\\u0E22\\u0E14\\u0E41\\u0E2D\\u0E1E\n#XFLD\nTileInfoPopover.Label.AppType=\\u0E1B\\u0E23\\u0E30\\u0E40\\u0E20\\u0E17\\u0E41\\u0E2D\\u0E1E\n#XFLD\nTileInfoPopover.Label.TileType=\\u0E1B\\u0E23\\u0E30\\u0E40\\u0E20\\u0E17 Tile\n#XFLD\nTileInfoPopover.Label.AvailableDevices=\\u0E2D\\u0E38\\u0E1B\\u0E01\\u0E23\\u0E13\\u0E4C\\u0E17\\u0E35\\u0E48\\u0E1E\\u0E23\\u0E49\\u0E2D\\u0E21\\u0E43\\u0E0A\\u0E49\\u0E07\\u0E32\\u0E19\n\n#XTIT\nErrorDialog.Title=\\u0E02\\u0E49\\u0E2D\\u0E1C\\u0E34\\u0E14\\u0E1E\\u0E25\\u0E32\\u0E14\n\n#XTIT\nConfirmChangesDialog.Title=\\u0E04\\u0E33\\u0E40\\u0E15\\u0E37\\u0E2D\\u0E19\n\n#XTIT\nPageOverview.Title=\\u0E1B\\u0E23\\u0E31\\u0E1A\\u0E1B\\u0E23\\u0E38\\u0E07\\u0E2B\\u0E19\\u0E49\\u0E32\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=\\u0E42\\u0E04\\u0E23\\u0E07\\u0E23\\u0E48\\u0E32\\u0E07\n\n#XTIT\nCopyDialog.Title=\\u0E04\\u0E31\\u0E14\\u0E25\\u0E2D\\u0E01\\u0E2B\\u0E19\\u0E49\\u0E32\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=\\u0E04\\u0E38\\u0E13\\u0E41\\u0E19\\u0E48\\u0E43\\u0E08\\u0E2B\\u0E23\\u0E37\\u0E2D\\u0E44\\u0E21\\u0E48\\u0E27\\u0E48\\u0E32\\u0E15\\u0E49\\u0E2D\\u0E07\\u0E01\\u0E32\\u0E23\\u0E04\\u0E31\\u0E14\\u0E25\\u0E2D\\u0E01 "{0}"?\n#XFLD\nCopyDialog.NewID=\\u0E2A\\u0E33\\u0E40\\u0E19\\u0E32\\u0E02\\u0E2D\\u0E07 "{0}"\n\n#XMSG\nTitle.NoSectionTitle=\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E40\\u0E0B\\u0E01\\u0E0A\\u0E31\\u0E19 {0} \\u0E27\\u0E48\\u0E32\\u0E07\\u0E40\\u0E1B\\u0E25\\u0E48\\u0E32\n#XMSG\nTitle.UnsufficientRoles=\\u0E01\\u0E32\\u0E23\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E1A\\u0E17\\u0E1A\\u0E32\\u0E17\\u0E44\\u0E21\\u0E48\\u0E40\\u0E1E\\u0E35\\u0E22\\u0E07\\u0E1E\\u0E2D\\u0E17\\u0E35\\u0E48\\u0E08\\u0E30\\u0E41\\u0E2A\\u0E14\\u0E07\\u0E20\\u0E32\\u0E1E\n#XMSG\nTitle.VisualizationIsNotVisible=\\u0E01\\u0E32\\u0E23\\u0E41\\u0E2A\\u0E14\\u0E07\\u0E20\\u0E32\\u0E1E\\u0E08\\u0E30\\u0E44\\u0E21\\u0E48\\u0E2A\\u0E32\\u0E21\\u0E32\\u0E23\\u0E16\\u0E17\\u0E33\\u0E44\\u0E14\\u0E49\n#XMSG\nTitle.VisualizationNotNavigateable=\\u0E01\\u0E32\\u0E23\\u0E41\\u0E2A\\u0E14\\u0E07\\u0E20\\u0E32\\u0E1E\\u0E44\\u0E21\\u0E48\\u0E2A\\u0E32\\u0E21\\u0E32\\u0E23\\u0E16\\u0E40\\u0E1B\\u0E34\\u0E14\\u0E41\\u0E2D\\u0E1E\\u0E44\\u0E14\\u0E49\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Tile \\u0E41\\u0E1A\\u0E1A\\u0E04\\u0E07\\u0E17\\u0E35\\u0E48\n#XTIT\nTitle.DynamicTile=Tile \\u0E41\\u0E1A\\u0E1A\\u0E44\\u0E14\\u0E19\\u0E32\\u0E21\\u0E34\\u0E01\n#XTIT\nTitle.CustomTile=Tile \\u0E17\\u0E35\\u0E48\\u0E1B\\u0E23\\u0E31\\u0E1A\\u0E41\\u0E15\\u0E48\\u0E07\\u0E44\\u0E14\\u0E49\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=\\u0E01\\u0E32\\u0E23\\u0E41\\u0E2A\\u0E14\\u0E07\\u0E15\\u0E31\\u0E27\\u0E2D\\u0E22\\u0E48\\u0E32\\u0E07\\u0E2B\\u0E19\\u0E49\\u0E32\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=\\u0E02\\u0E2D\\u0E2D\\u0E20\\u0E31\\u0E22 \\u0E40\\u0E23\\u0E32\\u0E44\\u0E21\\u0E48\\u0E1E\\u0E1A\\u0E2B\\u0E19\\u0E49\\u0E32\\u0E19\\u0E35\\u0E49\n#XLNK\nErrorPage.Link=\\u0E1B\\u0E23\\u0E31\\u0E1A\\u0E1B\\u0E23\\u0E38\\u0E07\\u0E2B\\u0E19\\u0E49\\u0E32\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_tr.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=\\u00DCst birimden ba\\u011F\\u0131ms\\u0131z sayfalar\\u0131n bak\\u0131m\\u0131n\\u0131 yap\n\n#XBUT\nButton.Add=Ekle\n#XBUT\nButton.Cancel=\\u0130ptal et\n#XBUT\nButton.ClosePreview=\\u00D6nizlemeyi kapat\n#XBUT\nButton.Copy=Kopyala\n#XBUT\nButton.Create=Olu\\u015Ftur\n#XBUT\nButton.Delete=Sil\n#XBUT\nButton.Edit=D\\u00FCzenle\n#XBUT\nButton.Save=Kaydet\n#XBUT\nButton.Select=Se\\u00E7\n#XBUT\nButton.Ok=Tamam\n#XBUT\nButton.ShowCatalogs=Kataloglar\\u0131 g\\u00F6ster\n#XBUT\nButton.HideCatalogs=Kataloglar\\u0131 gizle\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=Sorunlar\\: {0}\n#XBUT\nButton.SortCatalogs=Katalog s\\u0131ralamas\\u0131n\\u0131 de\\u011Fi\\u015Ftir\n#XBUT\nButton.CollapseCatalogs=T\\u00FCm kataloglar\\u0131 daralt\n#XBUT\nButton.ExpandCatalogs=T\\u00FCm kataloglar\\u0131 geni\\u015Flet\n#XBUT\nButton.ShowDetails=Ayr\\u0131nt\\u0131lar\\u0131 g\\u00F6ster\n#XBUT\nButton.PagePreview=Sayfa \\u00F6ng\\u00F6r\\u00FCn\\u00FCm\\u00FC\n#XBUT\nButton.ErrorMsg=Hata iletileri\n#XBUT\nButton.EditHeader=Ba\\u015Fl\\u0131\\u011F\\u0131 d\\u00FCzenle\n#XBUT\nButton.ContextSelector={0} rol ba\\u011Flam\\u0131 se\\u00E7\n#XBUT\nButton.OverwriteChanges=\\u00DCzerine yaz\n#XBUT\nButton.DismissChanges=De\\u011Fi\\u015Fiklikleri kapat\n\n#XTOL\nTooltip.AddToSections=B\\u00F6l\\u00FCmlere ekle\n#XTOL: Tooltip for the search button\nTooltip.Search=Ara\n#XTOL\nTooltip.SearchForTiles=Kutucuklar\\u0131 ara\n#XTOL\nTooltip.SearchForRoles=Rolleri ara\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Masa\\u00FCst\\u00FC\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=S\\u0131ralama ayarlar\\u0131n\\u0131 g\\u00F6r\\u00FCnt\\u00FCle\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=Filtre ayarlar\\u0131n\\u0131 g\\u00F6r\\u00FCnt\\u00FCle\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=Grup ayarlar\\u0131n\\u0131 g\\u00F6r\\u00FCnt\\u00FCle\n\n#XFLD\nLabel.PageID=Sayfa tan\\u0131t\\u0131c\\u0131s\\u0131\n#XFLD\nLabel.Title=Ba\\u015Fl\\u0131k\n#XFLD\nLabel.WorkbenchRequest=\\u00C7al\\u0131\\u015Fma ekran\\u0131 talebi\n#XFLD\nLabel.Package=Paket\n#XFLD\nLabel.TransportInformation=Ta\\u015F\\u0131ma bilgileri\n#XFLD\nLabel.Details=Ayr\\u0131nt\\u0131lar\\:\n#XFLD\nLabel.ResponseCode=Yan\\u0131t kodu\\:\n#XFLD\nLabel.ModifiedBy=De\\u011Fi\\u015Ftiren\\:\n#XFLD\nLabel.Description=Tan\\u0131m\n#XFLD\nLabel.CreatedByFullname=Olu\\u015Fturan\n#XFLD\nLabel.CreatedOn=Olu\\u015Fturma tarihi\n#XFLD\nLabel.ChangedByFullname=De\\u011Fi\\u015Ftiren\n#XFLD\nLabel.ChangedOn=De\\u011Fi\\u015Fiklik tarihi\n#XFLD\nLabel.PageTitle=Sayfa ba\\u015Fl\\u0131\\u011F\\u0131\n#XFLD\nLabel.AssignedRole=Tayin edilen rol\n\n#XCOL\nColumn.PageID=Tan\\u0131t\\u0131c\\u0131\n#XCOL\nColumn.PageTitle=Ba\\u015Fl\\u0131k\n#XCOL\nColumn.PageDescription=Tan\\u0131m\n#XCOL\nColumn.PageAssignmentStatus=Alana/role tayin edildi\n#XCOL\nColumn.PagePackage=Paket\n#XCOL\nColumn.PageWorkbenchRequest=\\u00C7al\\u0131\\u015Fma ekran\\u0131 talebi\n#XCOL\nColumn.PageCreatedBy=Olu\\u015Fturan\n#XCOL\nColumn.PageCreatedOn=Olu\\u015Fturma tarihi\n#XCOL\nColumn.PageChangedBy=De\\u011Fi\\u015Ftiren\n#XCOL\nColumn.PageChangedOn=De\\u011Fi\\u015Fiklik tarihi\n\n#XTOL\nPlaceholder.SectionName=B\\u00F6l\\u00FCm ad\\u0131 girin\n#XTOL\nPlaceholder.SearchForTiles=Kutucuklar\\u0131 ara\n#XTOL\nPlaceholder.SearchForRoles=Rolleri ara\n#XTOL\nPlaceholder.CopyPageTitle="{0}" kopyas\\u0131\n#XTOL\nPlaceholder.CopyPageID="{0}" kopyas\\u0131\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=T\\u00FCm\\u00FC\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle={0} b\\u00F6l\\u00FCm\\u00FCn\\u00FCn ba\\u015Fl\\u0131\\u011F\\u0131 yok. Tutarl\\u0131 bir kullan\\u0131c\\u0131 deneyimi i\\u00E7in, her b\\u00F6l\\u00FCme bir ad girmenizi \\u00F6neririz.\n#XMSG\nMessage.InvalidSectionTitle=Tercihen b\\u00F6l\\u00FCm ad\\u0131 girmelisiniz.\n#XMSG\nMessage.NoInternetConnection=\\u0130nternet ba\\u011Flant\\u0131n\\u0131z\\u0131 kontrol edin.\n#XMSG\nMessage.SavedChanges=De\\u011Fi\\u015Fiklikleriniz kaydedildi.\n#XMSG\nMessage.InvalidPageID=Yaln\\u0131zca \\u015Fu karakterleri kullan\\u0131n\\: A-Z, 0-9, _ ve /. Sayfa tan\\u0131t\\u0131c\\u0131s\\u0131 say\\u0131 ile ba\\u015Flamamal\\u0131.\n#XMSG\nMessage.EmptyPageID=Ge\\u00E7erli sayfa tan\\u0131t\\u0131c\\u0131s\\u0131 sa\\u011Flay\\u0131n.\n#XMSG\nMessage.EmptyTitle=Ge\\u00E7erli ba\\u015Fl\\u0131k sa\\u011Flay\\u0131n.\n#XMSG\nMessage.NoRoleSelected=En az bir rol se\\u00E7in.\n#XMSG\nMessage.SuccessDeletePage=Se\\u00E7ilen nesne silindi.\n#XMSG\nMessage.ClipboardCopySuccess=Ayr\\u0131nt\\u0131lar ba\\u015Far\\u0131yla kopyaland\\u0131.\n#YMSE\nMessage.ClipboardCopyFail=Ayr\\u0131nt\\u0131lar kopyalan\\u0131rken hata olu\\u015Ftu.\n#XMSG\nMessage.PageCreated=Sayfa olu\\u015Fturuldu.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=Kutucuk yok\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=Kullan\\u0131labilir rol yok.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=Rol bulunamad\\u0131. Araman\\u0131z\\u0131 ayarlamay\\u0131 deneyin.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=B\\u00F6l\\u00FCm yok\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError="{1}" b\\u00F6l\\u00FCm\\u00FCndeki {0} kutucu\\u011Funu y\\u00FCkleme ba\\u015Far\\u0131s\\u0131z oldu.\\n\\nBunun nedeni b\\u00FCy\\u00FCk olas\\u0131l\\u0131kla yanl\\u0131\\u015F SAP Fiori ba\\u015Flatma \\u00E7ubu\\u011Fu i\\u00E7erik konfig\\u00FCrasyonudur. Kullan\\u0131c\\u0131 i\\u00E7in g\\u00F6rselle\\u015Ftirme g\\u00F6r\\u00FCnt\\u00FClenmeyecek.\n#XMSG\nMessage.NavigationTargetError=Dola\\u015Fma hedefi \\u00E7\\u00F6z\\u00FClemedi.\n#XMSG\nMessage.LoadPageError=Sayfa y\\u00FCklenemedi.\n#XMSG\nMessage.UpdatePageError=Sayfa g\\u00FCncellenemedi.\n#XMSG\nMessage.CreatePageError=Sayfa olu\\u015Fturulamad\\u0131.\n#XMSG\nMessage.TilesHaveErrors=Baz\\u0131 kutucuklar veya b\\u00F6l\\u00FCmler hatalar i\\u00E7eriyor. Kaydetmeye devam etmek istedi\\u011Finizden emin misiniz?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=Kutucu\\u011Fun dola\\u015Fma hedefini \\u00E7\\u00F6zme ba\\u015Far\\u0131s\\u0131z oldu\\: "{0}".\\n\\nBunun nedeni b\\u00FCy\\u00FCk olas\\u0131l\\u0131kla ge\\u00E7ersiz SAP Fiori ba\\u015Flatma \\u00E7ubu\\u011Fu i\\u00E7erik konfig\\u00FCrasyonudur. G\\u00F6rselle\\u015Ftirme, uygulama a\\u00E7am\\u0131yor.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete="{0}" b\\u00F6l\\u00FCm\\u00FCn\\u00FC silmek istiyor musunuz?\n#XMSG\nMessage.Section.DeleteNoTitle=Bu b\\u00F6l\\u00FCm\\u00FC silmek istedi\\u011Finizden emin misiniz?\n#XMSG\nMessage.OverwriteChanges=Siz sayfay\\u0131 d\\u00FCzenlerken de\\u011Fi\\u015Fiklikler oldu. De\\u011Fi\\u015Fikliklerin \\u00FCzerine yazmak ister misiniz?\n#XMSG\nMessage.OverwriteRemovedPage=\\u00DCzerinde \\u00E7al\\u0131\\u015Ft\\u0131\\u011F\\u0131n\\u0131z sayfa farkl\\u0131 bir kullan\\u0131c\\u0131 taraf\\u0131ndan silindi. Bu de\\u011Fi\\u015Fikli\\u011Fin \\u00FCzerine yazmak istiyor musunuz?\n#XMSG\nMessage.SaveChanges=De\\u011Fi\\u015Fikliklerinizi kaydedin.\n#XMSG\nMessage.NoPages=Kullan\\u0131labilir sayfa yok.\n#XMSG\nMessage.NoPagesFound=Sayfa bulunamad\\u0131. Araman\\u0131z\\u0131 ayarlamay\\u0131 deneyin.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=\\u0130\\u00E7erik rol ba\\u011Flam\\u0131yla s\\u0131n\\u0131rland\\u0131r\\u0131ld\\u0131.\n#XMSG\nMessage.NotAssigned=Tayin edilmedi.\n#XMSG\nMessage.StatusAssigned=Tayin edildi\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=Yeni sayfa\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=Rol ba\\u011Flam\\u0131 se\\u00E7in\n#XTIT\nTitle.TilesHaveErrors=Kutucuklar hatalar i\\u00E7eriyor\n#XTIT\nDeleteDialog.Title=Sil\n#XMSG\nDeleteDialog.Text=Se\\u00E7ilen sayfay\\u0131 silmek istedi\\u011Finizden emin misiniz?\n#XBUT\nDeleteDialog.ConfirmButton=Sil\n#XTIT\nDeleteDialog.LockedTitle=Sayfa kilitlendi\n#XMSG\nDeleteDialog.LockedText=Se\\u00E7ilen sayfa "{0}" kullan\\u0131c\\u0131s\\u0131 taraf\\u0131ndan bloke edildi.\n#XMSG\nDeleteDialog.TransportRequired=Se\\u00E7ilen sayfay\\u0131 silmek i\\u00E7in aktar\\u0131m paketi se\\u00E7in.\n\n#XMSG\nEditDialog.LockedText=Se\\u00E7ilen sayfa "{0}" kullan\\u0131c\\u0131s\\u0131 taraf\\u0131ndan bloke edildi.\n#XMSG\nEditDialog.TransportRequired=Se\\u00E7ilen sayfay\\u0131 d\\u00FCzenlemek i\\u00E7in aktar\\u0131m paketi se\\u00E7in.\n#XTIT\nEditDialog.Title=Sayfay\\u0131 d\\u00FCzenle\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=Bu sayfa "{0}" dilinde olu\\u015Fturuldu ancak sizin oturum a\\u00E7ma diliniz "{1}" olarak ayarlanm\\u0131\\u015F. Devam etmek i\\u00E7in oturum a\\u00E7ma dilinizi "{0}" olarak de\\u011Fi\\u015Ftirin.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Alt ba\\u015Fl\\u0131k\n#XFLD\nTileInfoPopover.Label.Icon=\\u0130kon\n#XFLD\nTileInfoPopover.Label.SemanticObject=Semantik nesne\n#XFLD\nTileInfoPopover.Label.SemanticAction=Semantik i\\u015Flem\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori tan\\u0131t\\u0131c\\u0131s\\u0131\n#XFLD\nTileInfoPopover.Label.AppDetail=Uygulama ayr\\u0131nt\\u0131s\\u0131\n#XFLD\nTileInfoPopover.Label.AppType=Uygulama t\\u00FCr\\u00FC\n#XFLD\nTileInfoPopover.Label.TileType=Kutucuk t\\u00FCr\\u00FC\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Kullan\\u0131labilir cihazlar\n\n#XTIT\nErrorDialog.Title=Hata\n\n#XTIT\nConfirmChangesDialog.Title=Uyar\\u0131\n\n#XTIT\nPageOverview.Title=Sayfalar\\u0131n bak\\u0131m\\u0131n\\u0131 yap\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=D\\u00FCzen\n\n#XTIT\nCopyDialog.Title=Sayfay\\u0131 kopyala\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message="{0}" \\u00F6\\u011Fesini kopyalamak istiyor musunuz?\n#XFLD\nCopyDialog.NewID="{0}" kopyas\\u0131\n\n#XMSG\nTitle.NoSectionTitle={0} b\\u00F6l\\u00FCm\\u00FCn\\u00FCn b\\u00F6l\\u00FCm ba\\u015Fl\\u0131\\u011F\\u0131 bo\\u015F.\n#XMSG\nTitle.UnsufficientRoles=G\\u00F6rselle\\u015Ftirmeyi g\\u00F6stermek i\\u00E7in yetersiz rol tayini.\n#XMSG\nTitle.VisualizationIsNotVisible=G\\u00F6rselle\\u015Ftirme g\\u00F6r\\u00FCnt\\u00FClenmeyecek.\n#XMSG\nTitle.VisualizationNotNavigateable=G\\u00F6rselle\\u015Ftirme, uygulama a\\u00E7am\\u0131yor.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Statik kutucuk\n#XTIT\nTitle.DynamicTile=Dinamik kutucuk\n#XTIT\nTitle.CustomTile=\\u00D6zel kutucuk\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=Sayfa \\u00F6ng\\u00F6r\\u00FCn\\u00FCm\\u00FC\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=\\u00DCzg\\u00FCn\\u00FCz, bu sayfay\\u0131 bulamad\\u0131k.\n#XLNK\nErrorPage.Link=Sayfalar\\u0131n bak\\u0131m\\u0131n\\u0131 yap\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_uk.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=\\u0412\\u0435\\u0441\\u0442\\u0438 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0438 \\u0434\\u043B\\u044F \\u0432\\u0441\\u0456\\u0445 \\u043C\\u0430\\u043D\\u0434\\u0430\\u043D\\u0442\\u0456\\u0432\n\n#XBUT\nButton.Add=\\u0414\\u043E\\u0434\\u0430\\u0442\\u0438\n#XBUT\nButton.Cancel=\\u0421\\u043A\\u0430\\u0441\\u0443\\u0432\\u0430\\u0442\\u0438\n#XBUT\nButton.ClosePreview=\\u0417\\u0430\\u043A\\u0440\\u0438\\u0442\\u0438 \\u043F\\u043E\\u043F\\u0435\\u0440\\u0435\\u0434\\u043D\\u0456\\u0439 \\u043F\\u0435\\u0440\\u0435\\u0433\\u043B\\u044F\\u0434\n#XBUT\nButton.Copy=\\u041A\\u043E\\u043F\\u0456\\u044E\\u0432\\u0430\\u0442\\u0438\n#XBUT\nButton.Create=\\u0421\\u0442\\u0432\\u043E\\u0440\\u0438\\u0442\\u0438\n#XBUT\nButton.Delete=\\u0412\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438\n#XBUT\nButton.Edit=\\u0420\\u0435\\u0434\\u0430\\u0433\\u0443\\u0432\\u0430\\u0442\\u0438\n#XBUT\nButton.Save=\\u0417\\u0431\\u0435\\u0440\\u0435\\u0433\\u0442\\u0438\n#XBUT\nButton.Select=\\u0412\\u0438\\u0431\\u0440\\u0430\\u0442\\u0438\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=\\u041F\\u043E\\u043A\\u0430\\u0437\\u0430\\u0442\\u0438 \\u043A\\u0430\\u0442\\u0430\\u043B\\u043E\\u0433\\u0438\n#XBUT\nButton.HideCatalogs=\\u041F\\u0440\\u0438\\u0445\\u043E\\u0432\\u0430\\u0442\\u0438 \\u043A\\u0430\\u0442\\u0430\\u043B\\u043E\\u0433\\u0438\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=\\u041F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\u0438\\: {0}\n#XBUT\nButton.SortCatalogs=\\u041F\\u0435\\u0440\\u0435\\u043C\\u043A\\u043D\\u0443\\u0442\\u0438 \\u043F\\u043E\\u0440\\u044F\\u0434\\u043E\\u043A \\u0441\\u043E\\u0440\\u0442\\u0443\\u0432\\u0430\\u043D\\u043D\\u044F \\u043A\\u0430\\u0442\\u0430\\u043B\\u043E\\u0433\\u0456\\u0432\n#XBUT\nButton.CollapseCatalogs=\\u0417\\u0433\\u043E\\u0440\\u043D\\u0443\\u0442\\u0438 \\u0432\\u0441\\u0456 \\u043A\\u0430\\u0442\\u0430\\u043B\\u043E\\u0433\\u0438\n#XBUT\nButton.ExpandCatalogs=\\u0420\\u043E\\u0437\\u0433\\u043E\\u0440\\u043D\\u0443\\u0442\\u0438 \\u0432\\u0441\\u0456 \\u043A\\u0430\\u0442\\u0430\\u043B\\u043E\\u0433\\u0438\n#XBUT\nButton.ShowDetails=\\u041F\\u043E\\u043A\\u0430\\u0437\\u0430\\u0442\\u0438 \\u043F\\u043E\\u0434\\u0440\\u043E\\u0431\\u0438\\u0446\\u0456\n#XBUT\nButton.PagePreview=\\u041F\\u043E\\u043F\\u0435\\u0440\\u0435\\u0434\\u043D\\u0456\\u0439 \\u043F\\u0435\\u0440\\u0435\\u0433\\u043B\\u044F\\u0434 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0438\n#XBUT\nButton.ErrorMsg=\\u041F\\u043E\\u0432\\u0456\\u0434\\u043E\\u043C\\u043B\\u0435\\u043D\\u043D\\u044F \\u043F\\u0440\\u043E \\u043F\\u043E\\u043C\\u0438\\u043B\\u043A\\u0443\n#XBUT\nButton.EditHeader=\\u0420\\u0435\\u0434\\u0430\\u0433\\u0443\\u0432\\u0430\\u0442\\u0438 \\u0437\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A\n#XBUT\nButton.ContextSelector=\\u0412\\u0438\\u0431\\u0440\\u0430\\u0442\\u0438 \\u043A\\u043E\\u043D\\u0442\\u0435\\u043A\\u0441\\u0442 \\u0440\\u043E\\u043B\\u0456 {0}\n#XBUT\nButton.OverwriteChanges=\\u041F\\u0435\\u0440\\u0435\\u0437\\u0430\\u043F\\u0438\\u0441\\u0430\\u0442\\u0438\n#XBUT\nButton.DismissChanges=\\u0412\\u0456\\u0434\\u0445\\u0438\\u043B\\u0438\\u0442\\u0438 \\u0437\\u043C\\u0456\\u043D\\u0438\n\n#XTOL\nTooltip.AddToSections=\\u0414\\u043E\\u0434\\u0430\\u0442\\u0438 \\u0434\\u043E \\u0440\\u043E\\u0437\\u0434\\u0456\\u043B\\u0456\\u0432\n#XTOL: Tooltip for the search button\nTooltip.Search=\\u041F\\u043E\\u0448\\u0443\\u043A\n#XTOL\nTooltip.SearchForTiles=\\u041F\\u043E\\u0448\\u0443\\u043A \\u043F\\u043B\\u0438\\u0442\\u043E\\u043A\n#XTOL\nTooltip.SearchForRoles=\\u041F\\u043E\\u0448\\u0443\\u043A \\u0440\\u043E\\u043B\\u0435\\u0439\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=\\u0420\\u043E\\u0431\\u043E\\u0447\\u0456\\u0439 \\u0441\\u0442\\u0456\\u043B\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=\\u041F\\u0435\\u0440\\u0435\\u0433\\u043B\\u044F\\u043D\\u0443\\u0442\\u0438 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438 \\u0441\\u043E\\u0440\\u0442\\u0443\\u0432\\u0430\\u043D\\u043D\\u044F\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=\\u041F\\u0435\\u0440\\u0435\\u0433\\u043B\\u044F\\u043D\\u0443\\u0442\\u0438 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0430 \\u0444\\u0456\\u043B\\u044C\\u0442\\u0440\\u0430\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=\\u041F\\u0435\\u0440\\u0435\\u0433\\u043B\\u044F\\u043D\\u0443\\u0442\\u0438 \\u043D\\u0430\\u0441\\u0442\\u0440\\u043E\\u0439\\u043A\\u0438 \\u0433\\u0440\\u0443\\u043F\\u0443\\u0432\\u0430\\u043D\\u043D\\u044F\n\n#XFLD\nLabel.PageID=\\u0406\\u0414 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0438\n#XFLD\nLabel.Title=\\u0417\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A\n#XFLD\nLabel.WorkbenchRequest=\\u0417\\u0430\\u043F\\u0438\\u0442 \\u0456\\u043D\\u0441\\u0442\\u0440\\u0443\\u043C\\u0435\\u043D\\u0442\\u0430\\u043B\\u044C\\u043D\\u0438\\u0445 \\u0437\\u0430\\u0441\\u043E\\u0431\\u0456\\u0432\n#XFLD\nLabel.Package=\\u041F\\u0430\\u043A\\u0435\\u0442\n#XFLD\nLabel.TransportInformation=\\u0406\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0456\\u044F \\u043F\\u0440\\u043E \\u0442\\u0440\\u0430\\u043D\\u0441\\u043F\\u043E\\u0440\\u0442\n#XFLD\nLabel.Details=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u0438\\u0446\\u0456\\:\n#XFLD\nLabel.ResponseCode=\\u041A\\u043E\\u0434 \\u0432\\u0456\\u0434\\u043F\\u043E\\u0432\\u0456\\u0434\\u0456\\:\n#XFLD\nLabel.ModifiedBy=\\u0410\\u0432\\u0442\\u043E\\u0440 \\u0437\\u043C\\u0456\\u043D\\u0438\\:\n#XFLD\nLabel.Description=\\u041E\\u043F\\u0438\\u0441\n#XFLD\nLabel.CreatedByFullname=\\u0410\\u0432\\u0442\\u043E\\u0440 \\u0441\\u0442\\u0432\\u043E\\u0440\\u0435\\u043D\\u043D\\u044F\n#XFLD\nLabel.CreatedOn=\\u0414\\u0430\\u0442\\u0430 \\u0441\\u0442\\u0432\\u043E\\u0440\\u0435\\u043D\\u043D\\u044F\n#XFLD\nLabel.ChangedByFullname=\\u0410\\u0432\\u0442\\u043E\\u0440 \\u0437\\u043C\\u0456\\u043D\\u0438\n#XFLD\nLabel.ChangedOn=\\u0414\\u0430\\u0442\\u0430 \\u0437\\u043C\\u0456\\u043D\\u0438\n#XFLD\nLabel.PageTitle=\\u0417\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0438\n#XFLD\nLabel.AssignedRole=\\u041F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0454\\u043D\\u0430 \\u0440\\u043E\\u043B\\u044C\n\n#XCOL\nColumn.PageID=\\u0406\\u0414\n#XCOL\nColumn.PageTitle=\\u0417\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A\n#XCOL\nColumn.PageDescription=\\u041E\\u043F\\u0438\\u0441\n#XCOL\nColumn.PageAssignmentStatus=\\u041F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0454\\u043D\\u043E \\u043F\\u043B\\u043E\\u0449\\u0456/\\u0440\\u043E\\u043B\\u0456\n#XCOL\nColumn.PagePackage=\\u041F\\u0430\\u043A\\u0435\\u0442\n#XCOL\nColumn.PageWorkbenchRequest=\\u0417\\u0430\\u043F\\u0438\\u0442 \\u0456\\u043D\\u0441\\u0442\\u0440\\u0443\\u043C\\u0435\\u043D\\u0442\\u0430\\u043B\\u044C\\u043D\\u0438\\u0445 \\u0437\\u0430\\u0441\\u043E\\u0431\\u0456\\u0432\n#XCOL\nColumn.PageCreatedBy=\\u0410\\u0432\\u0442\\u043E\\u0440 \\u0441\\u0442\\u0432\\u043E\\u0440\\u0435\\u043D\\u043D\\u044F\n#XCOL\nColumn.PageCreatedOn=\\u0414\\u0430\\u0442\\u0430 \\u0441\\u0442\\u0432\\u043E\\u0440\\u0435\\u043D\\u043D\\u044F\n#XCOL\nColumn.PageChangedBy=\\u0410\\u0432\\u0442\\u043E\\u0440 \\u0437\\u043C\\u0456\\u043D\\u0438\n#XCOL\nColumn.PageChangedOn=\\u0414\\u0430\\u0442\\u0430 \\u0437\\u043C\\u0456\\u043D\\u0438\n\n#XTOL\nPlaceholder.SectionName=\\u0412\\u0432\\u0435\\u0434\\u0456\\u0442\\u044C \\u0456\\u043C\'\\u044F \\u0440\\u043E\\u0437\\u0434\\u0456\\u043B\\u0443\n#XTOL\nPlaceholder.SearchForTiles=\\u041F\\u043E\\u0448\\u0443\\u043A \\u043F\\u043B\\u0438\\u0442\\u043E\\u043A\n#XTOL\nPlaceholder.SearchForRoles=\\u041F\\u043E\\u0448\\u0443\\u043A \\u0440\\u043E\\u043B\\u0435\\u0439\n#XTOL\nPlaceholder.CopyPageTitle=\\u041A\\u043E\\u043F\\u0456\\u044F \\u00AB{0}\\u00BB\n#XTOL\nPlaceholder.CopyPageID=\\u041A\\u043E\\u043F\\u0456\\u044F \\u00AB{0}\\u00BB\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=\\u0432\\u0441\\u0435\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=\\u0420\\u043E\\u0437\\u0434\\u0456\\u043B {0} \\u043D\\u0435 \\u043C\\u0430\\u0454 \\u0437\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043A\\u0430. \\u0414\\u043B\\u044F \\u0443\\u0437\\u0433\\u043E\\u0434\\u0436\\u0435\\u043D\\u043E\\u0433\\u043E \\u0434\\u043E\\u0441\\u0432\\u0456\\u0434\\u0443 \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430 \\u043C\\u0438 \\u0440\\u0435\\u043A\\u043E\\u043C\\u0435\\u043D\\u0434\\u0443\\u0454\\u043C\\u043E \\u0432\\u0432\\u0435\\u0441\\u0442\\u0438 \\u0456\\u043C\'\'\\u044F \\u0434\\u043B\\u044F \\u043A\\u043E\\u0436\\u043D\\u043E\\u0433\\u043E \\u0440\\u043E\\u0437\\u0434\\u0456\\u043B\\u0443.\n#XMSG\nMessage.InvalidSectionTitle=\\u0412 \\u0456\\u0434\\u0435\\u0430\\u043B\\u0456 \\u043D\\u0435\\u043E\\u0431\\u0445\\u0456\\u0434\\u043D\\u043E \\u0432\\u0432\\u0435\\u0441\\u0442\\u0438 \\u0456\\u043C\'\\u044F \\u0440\\u043E\\u0437\\u0434\\u0456\\u043B\\u0443.\n#XMSG\nMessage.NoInternetConnection=\\u041F\\u0435\\u0440\\u0435\\u0432\\u0456\\u0440\\u0442\\u0435 \\u0432\\u0430\\u0448\\u0435 \\u0406\\u043D\\u0442\\u0435\\u0440\\u043D\\u0435\\u0442-\\u043F\\u0456\\u0434\\u043A\\u043B\\u044E\\u0447\\u0435\\u043D\\u043D\\u044F.\n#XMSG\nMessage.SavedChanges=\\u0412\\u0430\\u0448\\u0456 \\u0437\\u043C\\u0456\\u043D\\u0438 \\u0437\\u0431\\u0435\\u0440\\u0435\\u0436\\u0435\\u043D\\u043E.\n#XMSG\nMessage.InvalidPageID=\\u0412\\u0438\\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u043E\\u0432\\u0443\\u0439\\u0442\\u0435 \\u043B\\u0438\\u0448\\u0435 \\u043D\\u0430\\u0441\\u0442\\u0443\\u043F\\u043D\\u0456 \\u0441\\u0438\\u043C\\u0432\\u043E\\u043B\\u0438\\: A-Z, 0-9, _ \\u0456 /. \\u0406\\u0414 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0438 \\u043D\\u0435 \\u043F\\u043E\\u0432\\u0438\\u043D\\u0435\\u043D \\u043F\\u043E\\u0447\\u0438\\u043D\\u0430\\u0442\\u0438\\u0441\\u044F \\u0437 \\u0447\\u0438\\u0441\\u043B\\u0430.\n#XMSG\nMessage.EmptyPageID=\\u0412\\u043A\\u0430\\u0436\\u0456\\u0442\\u044C \\u0434\\u0456\\u0439\\u0441\\u043D\\u0438\\u0439 \\u0406\\u0414 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0438.\n#XMSG\nMessage.EmptyTitle=\\u0412\\u043A\\u0430\\u0436\\u0456\\u0442\\u044C \\u0434\\u0456\\u0439\\u0441\\u043D\\u0438\\u0439 \\u0437\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A.\n#XMSG\nMessage.NoRoleSelected=\\u0412\\u0438\\u0431\\u0435\\u0440\\u0456\\u0442\\u044C \\u043D\\u0435 \\u043C\\u0435\\u043D\\u0448\\u0435 \\u043E\\u0434\\u043D\\u0456\\u0454\\u0457 \\u0440\\u043E\\u043B\\u0456.\n#XMSG\nMessage.SuccessDeletePage=\\u0412\\u0438\\u0431\\u0440\\u0430\\u043D\\u0438\\u0439 \\u043E\\u0431\'\\u0454\\u043A\\u0442 \\u0432\\u0438\\u0434\\u0430\\u043B\\u0435\\u043D\\u043E.\n#XMSG\nMessage.ClipboardCopySuccess=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u0438\\u0446\\u0456 \\u0443\\u0441\\u043F\\u0456\\u0448\\u043D\\u043E \\u0441\\u043A\\u043E\\u043F\\u0456\\u0439\\u043E\\u0432\\u0430\\u043D\\u043E\n#YMSE\nMessage.ClipboardCopyFail=\\u041F\\u0440\\u0438 \\u043A\\u043E\\u043F\\u0456\\u044E\\u0432\\u0430\\u043D\\u043D\\u0456 \\u043F\\u043E\\u0434\\u0440\\u043E\\u0431\\u0438\\u0446\\u044C \\u0441\\u0442\\u0430\\u043B\\u0430\\u0441\\u044F \\u043F\\u043E\\u043C\\u0438\\u043B\\u043A\\u0430.\n#XMSG\nMessage.PageCreated=\\u0421\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0430 \\u0441\\u0442\\u0432\\u043E\\u0440\\u0435\\u043D\\u0430.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=\\u0411\\u0435\\u0437 \\u043F\\u043B\\u0438\\u0442\\u043E\\u043A\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=\\u0420\\u043E\\u043B\\u0456 \\u043D\\u0435\\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u0456.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=\\u0420\\u043E\\u043B\\u0456 \\u043D\\u0435 \\u0437\\u043D\\u0430\\u0439\\u0434\\u0435\\u043D\\u0456. \\u0421\\u043F\\u0440\\u043E\\u0431\\u0443\\u0439\\u0442\\u0435 \\u0432\\u0456\\u0434\\u043A\\u043E\\u0440\\u0438\\u0433\\u0443\\u0432\\u0430\\u0442\\u0438 \\u0432\\u0430\\u0448 \\u043F\\u043E\\u0448\\u0443\\u043A.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=\\u0411\\u0435\\u0437 \\u0440\\u043E\\u0437\\u0434\\u0456\\u043B\\u0456\\u0432\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=\\u041D\\u0435 \\u0432\\u0434\\u0430\\u043B\\u043E\\u0441\\u044F \\u0437\\u0430\\u0432\\u0430\\u043D\\u0442\\u0430\\u0436\\u0438\\u0442\\u0438 \\u043F\\u0456\\u0434\\u0435\\u043A\\u0440\\u0430\\u043D {0} \\u0443 \\u0440\\u043E\\u0437\\u0434\\u0456\\u043B\\u0456 "{1}".\\n\\n\\u0419\\u043C\\u043E\\u0432\\u0456\\u0440\\u043D\\u0456\\u0448\\u0435 \\u0437\\u0430 \\u0432\\u0441\\u0435 \\u043F\\u0440\\u0438\\u0447\\u0438\\u043D\\u043E\\u044E \\u0446\\u044C\\u043E\\u0433\\u043E \\u0454 \\u043D\\u0435\\u043F\\u0440\\u0430\\u0432\\u0438\\u043B\\u044C\\u043D\\u0430 \\u043A\\u043E\\u043D\\u0444\\u0456\\u0433\\u0443\\u0440\\u0430\\u0446\\u0456\\u044F \\u0432\\u043C\\u0456\\u0441\\u0442\\u0443 \\u043F\\u0430\\u043D\\u0435\\u043B\\u0456 \\u0437\\u0430\\u043F\\u0443\\u0441\\u043A\\u0443 SAP Fiori. \\u0412\\u0456\\u0437\\u0443\\u0430\\u043B\\u0456\\u0437\\u0430\\u0446\\u0456\\u044F \\u043D\\u0435 \\u0431\\u0443\\u0434\\u0435 \\u0432\\u0456\\u0434\\u043E\\u0431\\u0440\\u0430\\u0436\\u0435\\u043D\\u0430 \\u0434\\u043B\\u044F \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430.\n#XMSG\nMessage.NavigationTargetError=\\u041D\\u0435 \\u0432\\u0434\\u0430\\u043B\\u043E\\u0441\\u044F \\u0440\\u043E\\u0437\\u0432\'\\u044F\\u0437\\u0430\\u0442\\u0438 \\u0446\\u0456\\u043B\\u044C \\u043D\\u0430\\u0432\\u0456\\u0433\\u0430\\u0446\\u0456\\u0457.\n#XMSG\nMessage.LoadPageError=\\u041D\\u0435 \\u0432\\u0434\\u0430\\u043B\\u043E\\u0441\\u044F \\u0437\\u0430\\u0432\\u0430\\u043D\\u0442\\u0430\\u0436\\u0438\\u0442\\u0438 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0443.\n#XMSG\nMessage.UpdatePageError=\\u041D\\u0435 \\u0432\\u0434\\u0430\\u043B\\u043E\\u0441\\u044F \\u043E\\u043D\\u043E\\u0432\\u0438\\u0442\\u0438 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0443.\n#XMSG\nMessage.CreatePageError=\\u041D\\u0435 \\u0432\\u0434\\u0430\\u043B\\u043E\\u0441\\u044F \\u0441\\u0442\\u0432\\u043E\\u0440\\u0438\\u0442\\u0438 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0443.\n#XMSG\nMessage.TilesHaveErrors=\\u0414\\u0435\\u044F\\u043A\\u0456 \\u043F\\u043B\\u0438\\u0442\\u043A\\u0438 \\u0430\\u0431\\u043E \\u0440\\u043E\\u0437\\u0434\\u0456\\u043B\\u0438 \\u043C\\u0456\\u0441\\u0442\\u044F\\u0442\\u044C \\u043F\\u043E\\u043C\\u0438\\u043B\\u043A\\u0438. \\u0412\\u0438 \\u0434\\u0456\\u0439\\u0441\\u043D\\u043E \\u0431\\u0430\\u0436\\u0430\\u0454\\u0442\\u0435 \\u043F\\u0440\\u043E\\u0434\\u043E\\u0432\\u0436\\u0438\\u0442\\u0438 \\u0437\\u0431\\u0435\\u0440\\u0435\\u0436\\u0435\\u043D\\u043D\\u044F?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=\\u041D\\u0435 \\u0432\\u0434\\u0430\\u043B\\u043E\\u0441\\u044F \\u0440\\u043E\\u0437\\u0432\'\'\\u044F\\u0437\\u0430\\u0442\\u0438 \\u0446\\u0456\\u043B\\u044C \\u043D\\u0430\\u0432\\u0456\\u0433\\u0430\\u0446\\u0456\\u0457 \\u043F\\u043B\\u0438\\u0442\\u043A\\u0438\\: "{0}".\\n\\n\\u0419\\u043C\\u043E\\u0432\\u0456\\u0440\\u043D\\u0456\\u0448\\u0435 \\u0437\\u0430 \\u0432\\u0441\\u0435 \\u043F\\u0440\\u0438\\u0447\\u0438\\u043D\\u043E\\u044E \\u0446\\u044C\\u043E\\u0433\\u043E \\u0454 \\u043D\\u0435\\u043F\\u0440\\u0430\\u0432\\u0438\\u043B\\u044C\\u043D\\u0430 \\u043A\\u043E\\u043D\\u0444\\u0456\\u0433\\u0443\\u0440\\u0430\\u0446\\u0456\\u044F \\u0432\\u043C\\u0456\\u0441\\u0442\\u0443 \\u043F\\u0430\\u043D\\u0435\\u043B\\u0456 \\u0437\\u0430\\u043F\\u0443\\u0441\\u043A\\u0443 SAP Fiori. \\u0412\\u0456\\u0437\\u0443\\u0430\\u043B\\u0456\\u0437\\u0430\\u0446\\u0456\\u044F \\u043D\\u0435 \\u043C\\u043E\\u0436\\u0435 \\u0432\\u0456\\u0434\\u043A\\u0440\\u0438\\u0442\\u0438 \\u0437\\u0430\\u0441\\u0442\\u043E\\u0441\\u0443\\u043D\\u043E\\u043A.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=\\u0412\\u0438 \\u0434\\u0456\\u0439\\u0441\\u043D\\u043E \\u0431\\u0430\\u0436\\u0430\\u0454\\u0442\\u0435 \\u0432\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438 \\u0440\\u043E\\u0437\\u0434\\u0456\\u043B "{0}"?\n#XMSG\nMessage.Section.DeleteNoTitle=\\u0412\\u0438 \\u0434\\u0456\\u0439\\u0441\\u043D\\u043E \\u0431\\u0430\\u0436\\u0430\\u0454\\u0442\\u0435 \\u0432\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438 \\u0446\\u0435\\u0439 \\u0440\\u043E\\u0437\\u0434\\u0456\\u043B?\n#XMSG\nMessage.OverwriteChanges=\\u041F\\u043E\\u043A\\u0438 \\u0432\\u0438 \\u0440\\u0435\\u0434\\u0430\\u0433\\u0443\\u0432\\u0430\\u043B\\u0438 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0443, \\u0431\\u0443\\u043B\\u0438 \\u0432\\u043D\\u0435\\u0441\\u0435\\u043D\\u0456 \\u0437\\u043C\\u0456\\u043D\\u0438. \\u041F\\u0435\\u0440\\u0435\\u0437\\u0430\\u043F\\u0438\\u0441\\u0430\\u0442\\u0438 \\u0457\\u0445?\n#XMSG\nMessage.OverwriteRemovedPage=\\u0421\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0443, \\u043D\\u0430 \\u044F\\u043A\\u0456\\u0439 \\u0432\\u0438 \\u043F\\u0440\\u0430\\u0446\\u044E\\u0454\\u0442\\u0435, \\u0431\\u0443\\u043B\\u0430 \\u0432\\u0438\\u0434\\u0430\\u043B\\u0435\\u043D\\u0430 \\u0456\\u043D\\u0448\\u0438\\u043C \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0435\\u043C. \\u041F\\u0435\\u0440\\u0435\\u0437\\u0430\\u043F\\u0438\\u0441\\u0430\\u0442\\u0438 \\u0446\\u044E \\u0437\\u043C\\u0456\\u043D\\u0443?\n#XMSG\nMessage.SaveChanges=\\u0417\\u0431\\u0435\\u0440\\u0435\\u0436\\u0456\\u0442\\u044C \\u0432\\u0430\\u0448\\u0456 \\u0437\\u043C\\u0456\\u043D\\u0438\n#XMSG\nMessage.NoPages=\\u0421\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0438 \\u043D\\u0435\\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u0456.\n#XMSG\nMessage.NoPagesFound=\\u0421\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0438 \\u043D\\u0435 \\u0437\\u043D\\u0430\\u0439\\u0434\\u0435\\u043D\\u0456.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=\\u0412\\u043C\\u0456\\u0441\\u0442 \\u043E\\u0431\\u043C\\u0435\\u0436\\u0435\\u043D\\u043E \\u0434\\u043E \\u043A\\u043E\\u043D\\u0442\\u0435\\u043A\\u0441\\u0442\\u0443 \\u0440\\u043E\\u043B\\u0456.\n#XMSG\nMessage.NotAssigned=\\u041D\\u0435 \\u043F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0454\\u043D\\u043E.\n#XMSG\nMessage.StatusAssigned=\\u041F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0454\\u043D\\u043E\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=\\u041D\\u043E\\u0432\\u0430 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0430\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=\\u0412\\u0438\\u0431\\u0440\\u0430\\u0442\\u0438 \\u043A\\u043E\\u043D\\u0442\\u0435\\u043A\\u0441\\u0442 \\u0440\\u043E\\u043B\\u0456\n#XTIT\nTitle.TilesHaveErrors=\\u041F\\u043B\\u0438\\u0442\\u043A\\u0430 \\u043C\\u0430\\u0454 \\u043F\\u043E\\u043C\\u0438\\u043B\\u043A\\u0438\n#XTIT\nDeleteDialog.Title=\\u0412\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438\n#XMSG\nDeleteDialog.Text=\\u0412\\u0438 \\u0434\\u0456\\u0439\\u0441\\u043D\\u043E \\u0431\\u0430\\u0436\\u0430\\u0454\\u0442\\u0435 \\u0432\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438 \\u0432\\u0438\\u0431\\u0440\\u0430\\u043D\\u0443 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0443?\n#XBUT\nDeleteDialog.ConfirmButton=\\u0412\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438\n#XTIT\nDeleteDialog.LockedTitle=\\u0421\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0430 \\u0437\\u0430\\u0431\\u043B\\u043E\\u043A\\u043E\\u0432\\u0430\\u043D\\u0430\n#XMSG\nDeleteDialog.LockedText=\\u0412\\u0438\\u0431\\u0440\\u0430\\u043D\\u0430 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0430 \\u0437\\u0430\\u0431\\u043B\\u043E\\u043A\\u043E\\u0432\\u0430\\u043D\\u0430 \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0435\\u043C \\u00AB{0}\\u00BB.\n#XMSG\nDeleteDialog.TransportRequired=\\u0412\\u0438\\u0431\\u0435\\u0440\\u0456\\u0442\\u044C \\u043F\\u0430\\u043A\\u0435\\u0442 \\u043F\\u0435\\u0440\\u0435\\u043D\\u0435\\u0441\\u0435\\u043D\\u043D\\u044F \\u0434\\u043B\\u044F \\u0432\\u0438\\u0434\\u0430\\u043B\\u0435\\u043D\\u043D\\u044F \\u0432\\u0438\\u0431\\u0440\\u0430\\u043D\\u043E\\u0457 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0438.\n\n#XMSG\nEditDialog.LockedText=\\u0412\\u0438\\u0431\\u0440\\u0430\\u043D\\u0430 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0430 \\u0437\\u0430\\u0431\\u043B\\u043E\\u043A\\u043E\\u0432\\u0430\\u043D\\u0430 \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0435\\u043C \\u00AB{0}\\u00BB.\n#XMSG\nEditDialog.TransportRequired=\\u0412\\u0438\\u0431\\u0435\\u0440\\u0456\\u0442\\u044C \\u043F\\u0430\\u043A\\u0435\\u0442 \\u043F\\u0435\\u0440\\u0435\\u043D\\u0435\\u0441\\u0435\\u043D\\u043D\\u044F \\u0434\\u043B\\u044F \\u0440\\u0435\\u0434\\u0430\\u0433\\u0443\\u0432\\u0430\\u043D\\u043D\\u044F \\u0432\\u0438\\u0431\\u0440\\u0430\\u043D\\u043E\\u0457 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0438.\n#XTIT\nEditDialog.Title=\\u0420\\u0435\\u0434\\u0430\\u0433\\u0443\\u0432\\u0430\\u0442\\u0438 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0443\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=\\u0426\\u044E \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0443 \\u0431\\u0443\\u043B\\u043E \\u0441\\u0442\\u0432\\u043E\\u0440\\u0435\\u043D\\u043E \\u043C\\u043E\\u0432\\u043E\\u044E "{0}", \\u0430\\u043B\\u0435 \\u0432\\u0430\\u0448\\u0430 \\u043C\\u043E\\u0432\\u0430 \\u0432\\u0445\\u043E\\u0434\\u0443 \\u0434\\u043E \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0438 \\u0431\\u0443\\u043B\\u0430 \\u0432\\u0441\\u0442\\u0430\\u043D\\u043E\\u0432\\u043B\\u0435\\u043D\\u0430 \\u043D\\u0430 "{1}". \\u0429\\u043E\\u0431 \\u043F\\u0440\\u043E\\u0434\\u043E\\u0432\\u0436\\u0438\\u0442\\u0438, \\u0437\\u043C\\u0456\\u043D\\u0456\\u0442\\u044C \\u0432\\u0430\\u0448\\u0443 \\u043C\\u043E\\u0432\\u0443 \\u0432\\u0445\\u043E\\u0434\\u0443 \\u0434\\u043E \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0438 \\u043D\\u0430 "{0}\\u00BB.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=\\u041F\\u0456\\u0434\\u0437\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A\n#XFLD\nTileInfoPopover.Label.Icon=\\u041F\\u0456\\u043A\\u0442\\u043E\\u0433\\u0440\\u0430\\u043C\\u0430\n#XFLD\nTileInfoPopover.Label.SemanticObject=\\u0421\\u0435\\u043C\\u0430\\u043D\\u0442\\u0438\\u0447\\u043D\\u0438\\u0439 \\u043E\\u0431\'\\u0454\\u043A\\u0442\n#XFLD\nTileInfoPopover.Label.SemanticAction=\\u0421\\u0435\\u043C\\u0430\\u043D\\u0442\\u0438\\u0447\\u043D\\u0430 \\u043E\\u043F\\u0435\\u0440\\u0430\\u0446\\u0456\\u044F\n#XFLD\nTileInfoPopover.Label.FioriID=\\u0406\\u0414 Fiori\n#XFLD\nTileInfoPopover.Label.AppDetail=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u0438\\u0446\\u0456 \\u0437\\u0430\\u0441\\u0442\\u043E\\u0441\\u0443\\u043D\\u043A\\u0443\n#XFLD\nTileInfoPopover.Label.AppType=\\u0422\\u0438\\u043F \\u0437\\u0430\\u0441\\u0442\\u043E\\u0441\\u0443\\u043D\\u043A\\u0443\n#XFLD\nTileInfoPopover.Label.TileType=\\u0422\\u0438\\u043F \\u043F\\u043B\\u0438\\u0442\\u043A\\u0438\n#XFLD\nTileInfoPopover.Label.AvailableDevices=\\u0414\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u0456 \\u043F\\u0440\\u0438\\u0441\\u0442\\u0440\\u043E\\u0457\n\n#XTIT\nErrorDialog.Title=\\u041F\\u043E\\u043C\\u0438\\u043B\\u043A\\u0430\n\n#XTIT\nConfirmChangesDialog.Title=\\u0417\\u0430\\u0441\\u0442\\u0435\\u0440\\u0435\\u0436\\u0435\\u043D\\u043D\\u044F\n\n#XTIT\nPageOverview.Title=\\u0412\\u0435\\u0441\\u0442\\u0438 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0438\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=\\u0424\\u043E\\u0440\\u043C\\u0430\\u0442\n\n#XTIT\nCopyDialog.Title=\\u041A\\u043E\\u043F\\u0456\\u044E\\u0432\\u0430\\u0442\\u0438 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0443\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=\\u041A\\u043E\\u043F\\u0456\\u044E\\u0432\\u0430\\u0442\\u0438 {0}?\n#XFLD\nCopyDialog.NewID=\\u041A\\u043E\\u043F\\u0456\\u044F \\u00AB{0}\\u00BB\n\n#XMSG\nTitle.NoSectionTitle=\\u0417\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A \\u0440\\u043E\\u0437\\u0434\\u0456\\u043B\\u0443 {0} \\u043F\\u043E\\u0440\\u043E\\u0436\\u043D\\u0456\\u0439.\n#XMSG\nTitle.UnsufficientRoles=\\u041D\\u0435\\u0434\\u043E\\u0441\\u0442\\u0430\\u0442\\u043D\\u0454 \\u043F\\u0440\\u0438\\u0441\\u0432\\u043E\\u044E\\u0432\\u0430\\u043D\\u043D\\u044F \\u0440\\u043E\\u043B\\u0456 \\u0434\\u043B\\u044F \\u043F\\u043E\\u043A\\u0430\\u0437\\u0443 \\u0432\\u0456\\u0437\\u0443\\u0430\\u043B\\u0456\\u0437\\u0430\\u0446\\u0456\\u0457.\n#XMSG\nTitle.VisualizationIsNotVisible=\\u0412\\u0456\\u0437\\u0443\\u0430\\u043B\\u0456\\u0437\\u0430\\u0446\\u0456\\u044F \\u043D\\u0435 \\u0431\\u0443\\u0434\\u0435 \\u0432\\u0456\\u0434\\u043E\\u0431\\u0440\\u0430\\u0436\\u0435\\u043D\\u0430 \\u0434\\u043B\\u044F \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0430.\n#XMSG\nTitle.VisualizationNotNavigateable=\\u0412\\u0456\\u0437\\u0443\\u0430\\u043B\\u0456\\u0437\\u0430\\u0446\\u0456\\u044F \\u043D\\u0435 \\u043C\\u043E\\u0436\\u0435 \\u0432\\u0456\\u0434\\u043A\\u0440\\u0438\\u0442\\u0438 \\u0437\\u0430\\u0441\\u0442\\u043E\\u0441\\u0443\\u043D\\u043E\\u043A.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=\\u0421\\u0442\\u0430\\u0442\\u0438\\u0447\\u043D\\u0438\\u0439 \\u043F\\u0456\\u0434\\u0435\\u043A\\u0440\\u0430\\u043D\n#XTIT\nTitle.DynamicTile=\\u0414\\u0438\\u043D\\u0430\\u043C\\u0456\\u0447\\u043D\\u0438\\u0439 \\u043F\\u0456\\u0434\\u0435\\u043A\\u0440\\u0430\\u043D\n#XTIT\nTitle.CustomTile=\\u041A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0446\\u044C\\u043A\\u0438\\u0439 \\u043F\\u0456\\u0434\\u0435\\u043A\\u0440\\u0430\\u043D\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=\\u041F\\u043E\\u043F\\u0435\\u0440\\u0435\\u0434\\u043D\\u0456\\u0439 \\u043F\\u0435\\u0440\\u0435\\u0433\\u043B\\u044F\\u0434 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0438\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=\\u0412\\u0438\\u0431\\u0430\\u0447\\u0442\\u0435, \\u043D\\u0435\\u043C\\u043E\\u0436\\u043B\\u0438\\u0432\\u043E \\u0437\\u043D\\u0430\\u0439\\u0442\\u0438 \\u0446\\u044E \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0443.\n#XLNK\nErrorPage.Link=\\u0412\\u0435\\u0441\\u0442\\u0438 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0438\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_vi.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=Duy tri\\u0300 trang qua ma\\u0301y kha\\u0301ch\n\n#XBUT\nButton.Add=Th\\u00EAm\n#XBUT\nButton.Cancel=Hu\\u0309y\n#XBUT\nButton.ClosePreview=Close Preview\n#XBUT\nButton.Copy=Sao che\\u0301p\n#XBUT\nButton.Create=Ta\\u0323o\n#XBUT\nButton.Delete=Xo\\u0301a\n#XBUT\nButton.Edit=Hi\\u1EC7u ch\\u1EC9nh\n#XBUT\nButton.Save=L\\u01B0u\n#XBUT\nButton.Select=Cho\\u0323n\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=Hi\\u00EA\\u0323n danh mu\\u0323c\n#XBUT\nButton.HideCatalogs=\\u00C2\\u0309n danh mu\\u0323c\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=S\\u01B0\\u0323 c\\u00F4\\u0301\\: {0}\n#XBUT\nButton.SortCatalogs=\\u0110a\\u0309o tra\\u0323ng tha\\u0301i th\\u01B0\\u0301 t\\u01B0\\u0323 s\\u0103\\u0301p x\\u00EA\\u0301p danh mu\\u0323c\n#XBUT\nButton.CollapseCatalogs=Thu go\\u0323n t\\u00E2\\u0301t ca\\u0309 danh mu\\u0323c\n#XBUT\nButton.ExpandCatalogs=M\\u01A1\\u0309 r\\u00F4\\u0323ng t\\u00E2\\u0301t ca\\u0309 danh mu\\u0323c\n#XBUT\nButton.ShowDetails=Hi\\u00EA\\u0323n chi ti\\u00EA\\u0301t\n#XBUT\nButton.PagePreview=Xem tr\\u01B0\\u01A1\\u0301c trang\n#XBUT\nButton.ErrorMsg=Th\\u00F4ng ba\\u0301o l\\u00F4\\u0303i\n#XBUT\nButton.EditHeader=Hi\\u00EA\\u0323u chi\\u0309nh ti\\u00EAu \\u0111\\u00EA\\u0300\n#XBUT\nButton.ContextSelector=Select Role Context {0}\n#XBUT\nButton.OverwriteChanges=Overwrite\n#XBUT\nButton.DismissChanges=Dismiss Changes\n\n#XTOL\nTooltip.AddToSections=Th\\u00EAm va\\u0300o ph\\u00E2\\u0300n\n#XTOL: Tooltip for the search button\nTooltip.Search=Ti\\u0300m ki\\u00EA\\u0301m\n#XTOL\nTooltip.SearchForTiles=Ti\\u0300m ki\\u00EA\\u0301m hi\\u0300nh x\\u00EA\\u0301p\n#XTOL\nTooltip.SearchForRoles=Search for Roles\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=Ma\\u0301y ti\\u0301nh \\u0111\\u00EA\\u0309 ba\\u0300n\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=View Sort Settings\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=View Filter Settings\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=View Group Settings\n\n#XFLD\nLabel.PageID=ID trang\n#XFLD\nLabel.Title=Ti\\u00EAu \\u0111\\u00EA\\u0300\n#XFLD\nLabel.WorkbenchRequest=Y\\u00EAu c\\u00E2\\u0300u workbench\n#XFLD\nLabel.Package=G\\u00F3i\n#XFLD\nLabel.TransportInformation=Chuy\\u00EA\\u0309n th\\u00F4ng tin\n#XFLD\nLabel.Details=Chi ti\\u00EA\\u0301t\\:\n#XFLD\nLabel.ResponseCode=Ma\\u0303 pha\\u0309n h\\u00F4\\u0300i\\:\n#XFLD\nLabel.ModifiedBy=Modified by\\:\n#XFLD\nLabel.Description=M\\u00F4 ta\\u0309\n#XFLD\nLabel.CreatedByFullname=\\u0110\\u01B0\\u01A1\\u0323c ta\\u0323o b\\u01A1\\u0309i\n#XFLD\nLabel.CreatedOn=\\u0110\\u01B0\\u01A1\\u0323c ta\\u0323o va\\u0300o nga\\u0300y\n#XFLD\nLabel.ChangedByFullname=Thay \\u0111\\u00F4\\u0309i b\\u01A1\\u0309i\n#XFLD\nLabel.ChangedOn=Thay \\u0111\\u1ED5i v\\u00E0o\n#XFLD\nLabel.PageTitle=Ti\\u00EAu \\u0111\\u00EA\\u0300 trang\n#XFLD\nLabel.AssignedRole=Vai tro\\u0300 \\u0111a\\u0303 ga\\u0301n\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Ti\\u00EAu \\u0111\\u00EA\\u0300\n#XCOL\nColumn.PageDescription=M\\u00F4 ta\\u0309\n#XCOL\nColumn.PageAssignmentStatus=Assigned to Space/Role\n#XCOL\nColumn.PagePackage=G\\u00F3i\n#XCOL\nColumn.PageWorkbenchRequest=Y\\u00EAu c\\u00E2\\u0300u workbench\n#XCOL\nColumn.PageCreatedBy=\\u0110\\u01B0\\u01A1\\u0323c ta\\u0323o b\\u01A1\\u0309i\n#XCOL\nColumn.PageCreatedOn=\\u0110\\u01B0\\u01A1\\u0323c ta\\u0323o va\\u0300o nga\\u0300y\n#XCOL\nColumn.PageChangedBy=Thay \\u0111\\u00F4\\u0309i b\\u01A1\\u0309i\n#XCOL\nColumn.PageChangedOn=Thay \\u0111\\u1ED5i v\\u00E0o\n\n#XTOL\nPlaceholder.SectionName=Nh\\u1EADp t\\u00EAn ph\\u1EA7n\n#XTOL\nPlaceholder.SearchForTiles=T\\u00ECm ki\\u1EBFm h\\u00ECnh x\\u1EBFp\n#XTOL\nPlaceholder.SearchForRoles=Search for roles\n#XTOL\nPlaceholder.CopyPageTitle=Ba\\u0309n sao cu\\u0309a \\u201C{0}\\u201D\n#XTOL\nPlaceholder.CopyPageID=Ba\\u0309n sao cu\\u0309a \\u201C{0}\\u201D\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=all\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=Ph\\u00E2\\u0300n {0} kh\\u00F4ng co\\u0301 ti\\u00EAu \\u0111\\u00EA\\u0300. \\u0110\\u00EA\\u0309 tra\\u0309i nghi\\u00EA\\u0323m cu\\u0309a ng\\u01B0\\u01A1\\u0300i du\\u0300ng nh\\u00E2\\u0301t qua\\u0301n, chu\\u0301ng t\\u00F4i \\u0111\\u00EA\\u0300 nghi\\u0323 ba\\u0323n nh\\u00E2\\u0323p t\\u00EAn cho m\\u00F4\\u0303i ph\\u00E2\\u0300n.\n#XMSG\nMessage.InvalidSectionTitle=Ly\\u0301 t\\u01B0\\u01A1\\u0309ng la\\u0300 ba\\u0323n n\\u00EAn nh\\u00E2\\u0323p t\\u00EAn ph\\u00E2\\u0300n.\n#XMSG\nMessage.NoInternetConnection=Vui lo\\u0300ng ki\\u00EA\\u0309m tra k\\u00EA\\u0301t n\\u00F4\\u0301i internet cu\\u0309a ba\\u0323n.\n#XMSG\nMessage.SavedChanges=Thay \\u0111\\u00F4\\u0309i cu\\u0309a ba\\u0323n \\u0111a\\u0303 \\u0111\\u01B0\\u01A1\\u0323c l\\u01B0u.\n#XMSG\nMessage.InvalidPageID=Vui lo\\u0300ng chi\\u0309 s\\u01B0\\u0309 du\\u0323ng ca\\u0301c ky\\u0301 t\\u01B0\\u0323 sau \\u0111\\u00E2y\\: A-Z, 0-9, _ va\\u0300 /. ID trang kh\\u00F4ng n\\u00EAn b\\u0103\\u0301t \\u0111\\u00E2\\u0300u b\\u0103\\u0300ng s\\u00F4\\u0301.\n#XMSG\nMessage.EmptyPageID=Vui lo\\u0300ng cung c\\u00E2\\u0301p ID go\\u0301i h\\u01A1\\u0323p l\\u00EA\\u0323.\n#XMSG\nMessage.EmptyTitle=Vui lo\\u0300ng cung c\\u1EA5p ti\\u00EAu \\u0111\\u00EA\\u0300 h\\u1EE3p l\\u1EC7.\n#XMSG\nMessage.NoRoleSelected=Vui l\\u00F2ng ch\\u1ECDn \\u00EDt nh\\u1EA5t m\\u1ED9t vai tr\\u00F2.\n#XMSG\nMessage.SuccessDeletePage=\\u0110\\u00F4\\u0301i t\\u01B0\\u01A1\\u0323ng \\u0111\\u01B0\\u01A1\\u0323c cho\\u0323n \\u0111a\\u0303 bi\\u0323 xo\\u0301a.\n#XMSG\nMessage.ClipboardCopySuccess=Sao che\\u0301p chi ti\\u00EA\\u0301t tha\\u0300nh c\\u00F4ng.\n#YMSE\nMessage.ClipboardCopyFail=\\u0110a\\u0303 xa\\u0309y ra l\\u00F4\\u0303i trong khi sao che\\u0301p chi ti\\u00EA\\u0301t.\n#XMSG\nMessage.PageCreated=Trang \\u0111a\\u0303 \\u0111\\u01B0\\u01A1\\u0323c ta\\u0323o.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=Kh\\u00F4ng co\\u0301 hi\\u0300nh x\\u00EA\\u0301p\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=No roles available.\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=No roles found. Try adjusting your search.\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=Kh\\u00F4ng c\\u00F3 ph\\u1EA7n n\\u00E0o\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=Kh\\u00F4ng th\\u00EA\\u0309 ta\\u0309i hi\\u0300nh x\\u00EA\\u0301p {0} trong ph\\u00E2\\u0300n "{1}".\\n\\n\\u0110i\\u00EA\\u0300u na\\u0300y h\\u00E2\\u0300u nh\\u01B0 \\u0111\\u01B0\\u01A1\\u0323c g\\u00E2y ra b\\u01A1\\u0309i c\\u00E2\\u0301u hi\\u0300nh kh\\u00F4ng \\u0111u\\u0301ng cu\\u0309a n\\u00F4\\u0323i dung h\\u00F4\\u0323p kh\\u01A1\\u0309i \\u0111\\u00F4\\u0323ng SAP Fiori. Tr\\u01B0\\u0323c quan ho\\u0301a se\\u0303 kh\\u00F4ng \\u0111\\u01B0\\u01A1\\u0323c hi\\u00EA\\u0309n thi\\u0323 cho ng\\u01B0\\u01A1\\u0300i du\\u0300ng.\n#XMSG\nMessage.NavigationTargetError=Kh\\u00F4ng th\\u00EA\\u0309 gia\\u0309i quy\\u00EA\\u0301t \\u0111i\\u0301ch \\u0111i\\u00EA\\u0300u h\\u01B0\\u01A1\\u0301ng.\n#XMSG\nMessage.LoadPageError=Could not load the page template.\n#XMSG\nMessage.UpdatePageError=Could not update the page template.\n#XMSG\nMessage.CreatePageError=Could not create the page template.\n#XMSG\nMessage.TilesHaveErrors=M\\u00F4\\u0323t s\\u00F4\\u0301 hi\\u0300nh x\\u00EA\\u0301p ho\\u0103\\u0323c ph\\u00E2\\u0300n co\\u0301 l\\u00F4\\u0303i. Ba\\u0323n co\\u0301 ch\\u0103\\u0301c la\\u0300 ba\\u0323n mu\\u00F4\\u0301n ti\\u00EA\\u0301p tu\\u0323c l\\u01B0u kh\\u00F4ng?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=Kh\\u00F4ng th\\u00EA\\u0309 gia\\u0309i quy\\u00EA\\u0301t \\u0111i\\u0301ch \\u0111i\\u00EA\\u0300u h\\u01B0\\u01A1\\u0301ng cu\\u0309a hi\\u0300nh x\\u00EA\\u0301p\\: "{0}".\\n\\n\\u0110i\\u00EA\\u0300u na\\u0300y h\\u00E2\\u0300u nh\\u01B0 \\u0111\\u01B0\\u01A1\\u0323c g\\u00E2y ra b\\u01A1\\u0309i c\\u00E2\\u0301u hi\\u0300nh kh\\u00F4ng h\\u01A1\\u0323p l\\u00EA\\u0323 cu\\u0309a n\\u00F4\\u0323i dung h\\u00F4\\u0323p kh\\u01A1\\u0309i \\u0111\\u00F4\\u0323ng SAP Fiori. Tr\\u01B0\\u0323c quan ho\\u0301a kh\\u00F4ng th\\u00EA\\u0309 m\\u01A1\\u0309 \\u01B0\\u0301ng du\\u0323ng.\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=Ba\\u0323n co\\u0301 ch\\u0103\\u0301c la\\u0300 ba\\u0323n mu\\u00F4\\u0301n xo\\u0301a ph\\u00E2\\u0300n "{0}"?\n#XMSG\nMessage.Section.DeleteNoTitle=B\\u1EA1n c\\u00F3 ch\\u0103\\u0301c la\\u0300 ba\\u0323n mu\\u1ED1n x\\u00F3a ph\\u00E2\\u0300n n\\u00E0y kh\\u00F4ng?\n#XMSG\nMessage.OverwriteChanges=There have been changes while you were editing the page template. Do you want to overwrite them?\n#XMSG\nMessage.OverwriteRemovedPage=The page template you are working on has been deleted by a different user. Do you want to overwrite this change?\n#XMSG\nMessage.SaveChanges=Vui lo\\u0300ng l\\u01B0u ca\\u0301c thay \\u0111\\u00F4\\u0309i cu\\u0309a ba\\u0323n.\n#XMSG\nMessage.NoPages=Kh\\u00F4ng co\\u0301 s\\u0103\\u0303n trang.\n#XMSG\nMessage.NoPagesFound=Kh\\u00F4ng ti\\u0300m th\\u00E2\\u0301y trang. Th\\u01B0\\u0309 \\u0111i\\u00EA\\u0300u chi\\u0309nh ti\\u0300m ki\\u00EA\\u0301m cu\\u0309a ba\\u0323n.\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=Content restricted to role context.\n#XMSG\nMessage.NotAssigned=Not Assigned\n#XMSG\nMessage.StatusAssigned=Assigned\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=Trang m\\u01A1\\u0301i\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=Select Role Context\n#XTIT\nTitle.TilesHaveErrors=Hi\\u0300nh x\\u00EA\\u0301p co\\u0301 l\\u00F4\\u0303i\n#XTIT\nDeleteDialog.Title=Xo\\u0301a\n#XMSG\nDeleteDialog.Text=Ba\\u0323n co\\u0301 ch\\u0103\\u0301c la\\u0300 ba\\u0323n mu\\u00F4\\u0301n xo\\u0301a ca\\u0301c trang \\u0111a\\u0303 cho\\u0323n kh\\u00F4ng?\n#XBUT\nDeleteDialog.ConfirmButton=Xo\\u0301a\n#XTIT\nDeleteDialog.LockedTitle=Trang bi\\u0323 kho\\u0301a\n#XMSG\nDeleteDialog.LockedText=Trang \\u0111a\\u0303 cho\\u0323n bi\\u0323 kho\\u0301a b\\u01A1\\u0309i ng\\u01B0\\u01A1\\u0300i du\\u0300ng "{0}\\u201D.\n#XMSG\nDeleteDialog.TransportRequired=Vui lo\\u0300ng cho\\u0323n go\\u0301i chuy\\u00EA\\u0309n ta\\u0309i \\u0111\\u00EA\\u0309 xo\\u0301a trang \\u0111a\\u0303 cho\\u0323n.\n\n#XMSG\nEditDialog.LockedText=Trang \\u0111a\\u0303 cho\\u0323n bi\\u0323 kho\\u0301a b\\u01A1\\u0309i ng\\u01B0\\u01A1\\u0300i du\\u0300ng "{0}\\u201D.\n#XMSG\nEditDialog.TransportRequired=Vui lo\\u0300ng cho\\u0323n go\\u0301i chuy\\u00EA\\u0309n ta\\u0309i \\u0111\\u00EA\\u0309 hi\\u00EA\\u0323u chi\\u0309nh trang \\u0111a\\u0303 cho\\u0323n.\n#XTIT\nEditDialog.Title=Hi\\u00EA\\u0323u chi\\u0309nh trang\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=Trang na\\u0300y \\u0111a\\u0303 \\u0111\\u01B0\\u01A1\\u0323c ta\\u0323o theo ng\\u00F4n ng\\u01B0\\u0303 "{0}" nh\\u01B0ng ng\\u00F4n ng\\u01B0\\u0303 \\u0111\\u0103ng nh\\u00E2\\u0323p cu\\u0309a ba\\u0323n \\u0111\\u01B0\\u01A1\\u0323c thi\\u00EA\\u0301t l\\u00E2\\u0323p tha\\u0300nh "{1}". Vui lo\\u0300ng thay \\u0111\\u00F4\\u0309i ng\\u00F4n ng\\u01B0\\u0303 \\u0111\\u0103ng nh\\u00E2\\u0323p cu\\u0309a ba\\u0323n tha\\u0300nh "{0}" \\u0111\\u00EA\\u0309 ti\\u00EA\\u0301p tu\\u0323c.\n\n#XFLD\nTileInfoPopover.Label.Subtitle=Subtitle\n#XFLD\nTileInfoPopover.Label.Icon=Icon\n#XFLD\nTileInfoPopover.Label.SemanticObject=Semantic Object\n#XFLD\nTileInfoPopover.Label.SemanticAction=Semantic Action\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori ID\n#XFLD\nTileInfoPopover.Label.AppDetail=App Detail\n#XFLD\nTileInfoPopover.Label.AppType=App Type\n#XFLD\nTileInfoPopover.Label.TileType=Tile Type\n#XFLD\nTileInfoPopover.Label.AvailableDevices=Available Devices\n\n#XTIT\nErrorDialog.Title=L\\u00F4\\u0303i\n\n#XTIT\nConfirmChangesDialog.Title=Warning\n\n#XTIT\nPageOverview.Title=Duy tri\\u0300 trang\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=B\\u00F4\\u0301 cu\\u0323c\n\n#XTIT\nCopyDialog.Title=Sao che\\u0301p trang\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=Ba\\u0323n co\\u0301 mu\\u00F4\\u0301n sao che\\u0301p \\u201C{0}\\u201D?\n#XFLD\nCopyDialog.NewID=Ba\\u0309n sao cu\\u0309a \\u201C{0}\\u201D\n\n#XMSG\nTitle.NoSectionTitle=Ti\\u00EAu \\u0111\\u00EA\\u0300 ph\\u00E2\\u0300n cu\\u0309a ph\\u00E2\\u0300n {0} tr\\u00F4\\u0301ng.\n#XMSG\nTitle.UnsufficientRoles=Ga\\u0301n vai tro\\u0300 kh\\u00F4ng \\u0111u\\u0309 \\u0111\\u00EA\\u0309 hi\\u00EA\\u0309n thi\\u0323 tr\\u01B0\\u0323c quan ho\\u0301a.\n#XMSG\nTitle.VisualizationIsNotVisible=Se\\u0303 kh\\u00F4ng th\\u00EA\\u0309 hi\\u00EA\\u0309n thi\\u0323 tr\\u01B0\\u0323c quan ho\\u0301a.\n#XMSG\nTitle.VisualizationNotNavigateable=Tr\\u01B0\\u0323c quan ho\\u0301a kh\\u00F4ng th\\u00EA\\u0309 m\\u01A1\\u0309 \\u01B0\\u0301ng du\\u0323ng.\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=Hi\\u0300nh x\\u00EA\\u0301p ti\\u0303nh\n#XTIT\nTitle.DynamicTile=Hi\\u0300nh x\\u00EA\\u0301p \\u0111\\u00F4\\u0323ng\n#XTIT\nTitle.CustomTile=Hi\\u0300nh x\\u00EA\\u0301p t\\u00F9y ch\\u1EC9nh\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=Page Template Preview\\: {0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=R\\u00E2\\u0301t ti\\u00EA\\u0301c, chu\\u0301ng t\\u00F4i kh\\u00F4ng th\\u00EA\\u0309 ti\\u0300m th\\u00E2\\u0301y trang na\\u0300y.\n#XLNK\nErrorPage.Link=Duy tri\\u0300 trang\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_zh_CN.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=\\u7EF4\\u62A4\\u8DE8\\u5BA2\\u6237\\u7AEF\\u7684\\u9875\\u9762\n\n#XBUT\nButton.Add=\\u6DFB\\u52A0\n#XBUT\nButton.Cancel=\\u53D6\\u6D88\n#XBUT\nButton.ClosePreview=\\u5173\\u95ED\\u9884\\u89C8\n#XBUT\nButton.Copy=\\u590D\\u5236\n#XBUT\nButton.Create=\\u521B\\u5EFA\n#XBUT\nButton.Delete=\\u5220\\u9664\n#XBUT\nButton.Edit=\\u7F16\\u8F91\n#XBUT\nButton.Save=\\u4FDD\\u5B58\n#XBUT\nButton.Select=\\u9009\\u62E9\n#XBUT\nButton.Ok=\\u786E\\u5B9A\n#XBUT\nButton.ShowCatalogs=\\u663E\\u793A\\u76EE\\u5F55\n#XBUT\nButton.HideCatalogs=\\u9690\\u85CF\\u76EE\\u5F55\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=\\u95EE\\u9898\\uFF1A{0}\n#XBUT\nButton.SortCatalogs=\\u5207\\u6362\\u76EE\\u5F55\\u6392\\u5E8F\\u987A\\u5E8F\n#XBUT\nButton.CollapseCatalogs=\\u6298\\u53E0\\u6240\\u6709\\u76EE\\u5F55\n#XBUT\nButton.ExpandCatalogs=\\u5C55\\u5F00\\u6240\\u6709\\u76EE\\u5F55\n#XBUT\nButton.ShowDetails=\\u663E\\u793A\\u8BE6\\u7EC6\\u4FE1\\u606F\n#XBUT\nButton.PagePreview=\\u9875\\u9762\\u9884\\u89C8\n#XBUT\nButton.ErrorMsg=\\u9519\\u8BEF\\u6D88\\u606F\n#XBUT\nButton.EditHeader=\\u7F16\\u8F91\\u62AC\\u5934\n#XBUT\nButton.ContextSelector=\\u9009\\u62E9\\u89D2\\u8272\\u4E0A\\u4E0B\\u6587 {0}\n#XBUT\nButton.OverwriteChanges=\\u8986\\u76D6\n#XBUT\nButton.DismissChanges=\\u653E\\u5F03\\u66F4\\u6539\n\n#XTOL\nTooltip.AddToSections=\\u6DFB\\u52A0\\u5230\\u90E8\\u5206\n#XTOL: Tooltip for the search button\nTooltip.Search=\\u641C\\u7D22\n#XTOL\nTooltip.SearchForTiles=\\u641C\\u7D22\\u78C1\\u8D34\n#XTOL\nTooltip.SearchForRoles=\\u641C\\u7D22\\u89D2\\u8272\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=\\u53F0\\u5F0F\\u7535\\u8111\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=\\u89C6\\u56FE\\u6392\\u5E8F\\u8BBE\\u7F6E\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=\\u89C6\\u56FE\\u8FC7\\u6EE4\\u8BBE\\u7F6E\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=\\u89C6\\u56FE\\u5206\\u7EC4\\u8BBE\\u7F6E\n\n#XFLD\nLabel.PageID=\\u9875\\u9762\\u6807\\u8BC6\n#XFLD\nLabel.Title=\\u6807\\u9898\n#XFLD\nLabel.WorkbenchRequest=\\u5DE5\\u4F5C\\u53F0\\u8BF7\\u6C42\n#XFLD\nLabel.Package=\\u5305\n#XFLD\nLabel.TransportInformation=\\u4F20\\u8F93\\u4FE1\\u606F\n#XFLD\nLabel.Details=\\u8BE6\\u7EC6\\u4FE1\\u606F\\uFF1A\n#XFLD\nLabel.ResponseCode=\\u54CD\\u5E94\\u4EE3\\u7801\\uFF1A\n#XFLD\nLabel.ModifiedBy=\\u4FEE\\u6539\\u8005\\uFF1A\n#XFLD\nLabel.Description=\\u63CF\\u8FF0\n#XFLD\nLabel.CreatedByFullname=\\u521B\\u5EFA\\u8005\n#XFLD\nLabel.CreatedOn=\\u521B\\u5EFA\\u65E5\\u671F\n#XFLD\nLabel.ChangedByFullname=\\u66F4\\u6539\\u8005\n#XFLD\nLabel.ChangedOn=\\u66F4\\u6539\\u65E5\\u671F\n#XFLD\nLabel.PageTitle=\\u9875\\u9762\\u6807\\u9898\n#XFLD\nLabel.AssignedRole=\\u5DF2\\u5206\\u914D\\u89D2\\u8272\n\n#XCOL\nColumn.PageID=\\u6807\\u8BC6\n#XCOL\nColumn.PageTitle=\\u6807\\u9898\n#XCOL\nColumn.PageDescription=\\u63CF\\u8FF0\n#XCOL\nColumn.PageAssignmentStatus=\\u5DF2\\u5206\\u914D\\u5230\\u7A7A\\u95F4/\\u89D2\\u8272\n#XCOL\nColumn.PagePackage=\\u5305\n#XCOL\nColumn.PageWorkbenchRequest=\\u5DE5\\u4F5C\\u53F0\\u8BF7\\u6C42\n#XCOL\nColumn.PageCreatedBy=\\u521B\\u5EFA\\u8005\n#XCOL\nColumn.PageCreatedOn=\\u521B\\u5EFA\\u65E5\\u671F\n#XCOL\nColumn.PageChangedBy=\\u66F4\\u6539\\u8005\n#XCOL\nColumn.PageChangedOn=\\u66F4\\u6539\\u65E5\\u671F\n\n#XTOL\nPlaceholder.SectionName=\\u8F93\\u5165\\u90E8\\u5206\\u540D\\u79F0\n#XTOL\nPlaceholder.SearchForTiles=\\u641C\\u7D22\\u78C1\\u8D34\n#XTOL\nPlaceholder.SearchForRoles=\\u641C\\u7D22\\u89D2\\u8272\n#XTOL\nPlaceholder.CopyPageTitle="{0}" \\u7684\\u526F\\u672C\n#XTOL\nPlaceholder.CopyPageID="{0}" \\u7684\\u526F\\u672C\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=\\u5168\\u90E8\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=\\u90E8\\u5206 {0} \\u6CA1\\u6709\\u6807\\u9898\\u3002\\u4E3A\\u83B7\\u5F97\\u4E00\\u81F4\\u7684\\u7528\\u6237\\u4F53\\u9A8C\\uFF0C\\u5EFA\\u8BAE\\u4E3A\\u6BCF\\u4E2A\\u90E8\\u5206\\u8F93\\u5165\\u540D\\u79F0\\u3002\n#XMSG\nMessage.InvalidSectionTitle=\\u6700\\u597D\\u662F\\u8F93\\u5165\\u90E8\\u5206\\u540D\\u79F0\\u3002\n#XMSG\nMessage.NoInternetConnection=\\u8BF7\\u68C0\\u67E5 internet \\u8FDE\\u63A5\\u3002\n#XMSG\nMessage.SavedChanges=\\u6240\\u505A\\u66F4\\u6539\\u5DF2\\u4FDD\\u5B58\\u3002\n#XMSG\nMessage.InvalidPageID=\\u8BF7\\u4EC5\\u4F7F\\u7528\\u4EE5\\u4E0B\\u5B57\\u7B26\\uFF1AA-Z\\u30010-9\\u3001_ \\u548C /\\u3002\\u9875\\u9762\\u6807\\u8BC6\\u4E0D\\u5E94\\u4EE5\\u6570\\u5B57\\u5F00\\u5934\\u3002\n#XMSG\nMessage.EmptyPageID=\\u8BF7\\u63D0\\u4F9B\\u6709\\u6548\\u7684\\u9875\\u9762\\u6807\\u8BC6\\u3002\n#XMSG\nMessage.EmptyTitle=\\u8BF7\\u63D0\\u4F9B\\u6709\\u6548\\u7684\\u6807\\u9898\\u3002\n#XMSG\nMessage.NoRoleSelected=\\u8BF7\\u81F3\\u5C11\\u9009\\u62E9\\u4E00\\u4E2A\\u89D2\\u8272\\u3002\n#XMSG\nMessage.SuccessDeletePage=\\u6240\\u9009\\u5BF9\\u8C61\\u5DF2\\u5220\\u9664\\u3002\n#XMSG\nMessage.ClipboardCopySuccess=\\u8BE6\\u7EC6\\u4FE1\\u606F\\u5DF2\\u6210\\u529F\\u590D\\u5236\\u3002\n#YMSE\nMessage.ClipboardCopyFail=\\u590D\\u5236\\u8BE6\\u7EC6\\u4FE1\\u606F\\u65F6\\u51FA\\u9519\\u3002\n#XMSG\nMessage.PageCreated=\\u9875\\u9762\\u5DF2\\u521B\\u5EFA\\u3002\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=\\u65E0\\u78C1\\u8D34\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=\\u65E0\\u53EF\\u7528\\u89D2\\u8272\\u3002\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=\\u672A\\u627E\\u5230\\u89D2\\u8272\\u3002\\u5C1D\\u8BD5\\u5BF9\\u641C\\u7D22\\u8FDB\\u884C\\u8C03\\u6574\\u3002\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=\\u65E0\\u90E8\\u5206\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=\\u52A0\\u8F7D "{1}" \\u90E8\\u5206\\u4E2D\\u7684 {0} \\u78C1\\u8D34\\u5931\\u8D25\\u3002\\n\\n\\u8FD9\\u6781\\u6709\\u53EF\\u80FD\\u662F\\u7531\\u4E8E SAP Fiori \\u5FEB\\u901F\\u542F\\u52A8\\u677F\\u5185\\u5BB9\\u914D\\u7F6E\\u4E0D\\u5F53\\u6240\\u9020\\u6210\\u7684\\u3002\\u5C06\\u4E0D\\u4F1A\\u4E3A\\u7528\\u6237\\u663E\\u793A\\u53EF\\u89C6\\u5316\\u5185\\u5BB9\\u3002\n#XMSG\nMessage.NavigationTargetError=\\u65E0\\u6CD5\\u89E3\\u6790\\u5BFC\\u822A\\u76EE\\u6807\\u3002\n#XMSG\nMessage.LoadPageError=\\u65E0\\u6CD5\\u52A0\\u8F7D\\u9875\\u9762\\u3002\n#XMSG\nMessage.UpdatePageError=\\u65E0\\u6CD5\\u66F4\\u65B0\\u9875\\u9762\\u3002\n#XMSG\nMessage.CreatePageError=\\u65E0\\u6CD5\\u521B\\u5EFA\\u9875\\u9762\\u3002\n#XMSG\nMessage.TilesHaveErrors=\\u67D0\\u4E9B\\u78C1\\u8D34\\u6216\\u90E8\\u5206\\u6709\\u9519\\u8BEF\\u3002\\u662F\\u5426\\u786E\\u5B9A\\u8981\\u7EE7\\u7EED\\u4FDD\\u5B58\\uFF1F\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=\\u89E3\\u6790\\u78C1\\u8D34\\u7684\\u5BFC\\u822A\\u76EE\\u6807\\u5931\\u8D25\\uFF1A"{0}"\\u3002\\n\\n\\u8FD9\\u6781\\u6709\\u53EF\\u80FD\\u662F\\u7531\\u4E8E SAP Fiori \\u5FEB\\u901F\\u542F\\u52A8\\u677F\\u5185\\u5BB9\\u914D\\u7F6E\\u65E0\\u6548\\u6240\\u9020\\u6210\\u7684\\u3002\\u53EF\\u89C6\\u5316\\u65E0\\u6CD5\\u6253\\u5F00\\u5E94\\u7528\\u7A0B\\u5E8F\\u3002\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=\\u662F\\u5426\\u786E\\u5B9A\\u8981\\u5220\\u9664\\u90E8\\u5206 "{0}"\\uFF1F\n#XMSG\nMessage.Section.DeleteNoTitle=\\u662F\\u5426\\u786E\\u5B9A\\u8981\\u5220\\u9664\\u6B64\\u90E8\\u5206\\uFF1F\n#XMSG\nMessage.OverwriteChanges=\\u5728\\u60A8\\u7F16\\u8F91\\u9875\\u9762\\u671F\\u95F4\\u5DF2\\u6709\\u66F4\\u6539\\u3002\\u662F\\u5426\\u8981\\u5C06\\u5176\\u8986\\u76D6\\uFF1F\n#XMSG\nMessage.OverwriteRemovedPage=\\u6B63\\u5728\\u5904\\u7406\\u7684\\u9875\\u9762\\u5DF2\\u7531\\u53E6\\u4E00\\u4E0D\\u540C\\u7528\\u6237\\u5220\\u9664\\u3002\\u662F\\u5426\\u8981\\u8986\\u76D6\\u6B64\\u66F4\\u6539\\uFF1F\n#XMSG\nMessage.SaveChanges=\\u8BF7\\u4FDD\\u5B58\\u6240\\u505A\\u66F4\\u6539\\u3002\n#XMSG\nMessage.NoPages=\\u65E0\\u53EF\\u7528\\u9875\\u9762\\u3002\n#XMSG\nMessage.NoPagesFound=\\u672A\\u627E\\u5230\\u9875\\u9762\\u3002\\u5C1D\\u8BD5\\u5BF9\\u641C\\u7D22\\u8FDB\\u884C\\u8C03\\u6574\\u3002\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=\\u5185\\u5BB9\\u9650\\u5236\\u4E3A\\u89D2\\u8272\\u4E0A\\u4E0B\\u6587\\u3002\n#XMSG\nMessage.NotAssigned=\\u672A\\u5206\\u914D\\u3002\n#XMSG\nMessage.StatusAssigned=\\u5DF2\\u5206\\u914D\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=\\u65B0\\u9875\\u9762\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=\\u9009\\u62E9\\u89D2\\u8272\\u4E0A\\u4E0B\\u6587\n#XTIT\nTitle.TilesHaveErrors=\\u78C1\\u8D34\\u6709\\u9519\\u8BEF\n#XTIT\nDeleteDialog.Title=\\u5220\\u9664\n#XMSG\nDeleteDialog.Text=\\u662F\\u5426\\u786E\\u5B9A\\u8981\\u5220\\u9664\\u6240\\u9009\\u9875\\u9762\\uFF1F\n#XBUT\nDeleteDialog.ConfirmButton=\\u5220\\u9664\n#XTIT\nDeleteDialog.LockedTitle=\\u9875\\u9762\\u5DF2\\u9501\\u5B9A\n#XMSG\nDeleteDialog.LockedText=\\u6240\\u9009\\u9875\\u9762\\u5DF2\\u7531\\u7528\\u6237 "{0}" \\u9501\\u5B9A\\u3002\n#XMSG\nDeleteDialog.TransportRequired=\\u8BF7\\u9009\\u62E9\\u4F20\\u8F93\\u5305\\u4EE5\\u5220\\u9664\\u6240\\u9009\\u9875\\u9762\\u3002\n\n#XMSG\nEditDialog.LockedText=\\u6240\\u9009\\u9875\\u9762\\u5DF2\\u7531\\u7528\\u6237 "{0}" \\u9501\\u5B9A\\u3002\n#XMSG\nEditDialog.TransportRequired=\\u8BF7\\u9009\\u62E9\\u4F20\\u8F93\\u5305\\u4EE5\\u7F16\\u8F91\\u6240\\u9009\\u9875\\u9762\\u3002\n#XTIT\nEditDialog.Title=\\u7F16\\u8F91\\u9875\\u9762\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=\\u6B64\\u9875\\u9762\\u4EE5 "{0}" \\u8BED\\u8A00\\u521B\\u5EFA\\uFF0C\\u4F46\\u767B\\u5F55\\u8BED\\u8A00\\u5374\\u8BBE\\u7F6E\\u4E3A "{1}"\\u3002\\u8BF7\\u5C06\\u767B\\u5F55\\u8BED\\u8A00\\u66F4\\u6539\\u4E3A "{0}" \\u4EE5\\u7EE7\\u7EED\\u3002\n\n#XFLD\nTileInfoPopover.Label.Subtitle=\\u526F\\u6807\\u9898\n#XFLD\nTileInfoPopover.Label.Icon=\\u56FE\\u6807\n#XFLD\nTileInfoPopover.Label.SemanticObject=\\u8BED\\u4E49\\u5BF9\\u8C61\n#XFLD\nTileInfoPopover.Label.SemanticAction=\\u8BED\\u4E49\\u64CD\\u4F5C\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori \\u6807\\u8BC6\n#XFLD\nTileInfoPopover.Label.AppDetail=\\u5E94\\u7528\\u7A0B\\u5E8F\\u8BE6\\u7EC6\\u4FE1\\u606F\n#XFLD\nTileInfoPopover.Label.AppType=\\u5E94\\u7528\\u7A0B\\u5E8F\\u7C7B\\u578B\n#XFLD\nTileInfoPopover.Label.TileType=\\u78C1\\u8D34\\u7C7B\\u578B\n#XFLD\nTileInfoPopover.Label.AvailableDevices=\\u53EF\\u7528\\u8BBE\\u5907\n\n#XTIT\nErrorDialog.Title=\\u9519\\u8BEF\n\n#XTIT\nConfirmChangesDialog.Title=\\u8B66\\u544A\n\n#XTIT\nPageOverview.Title=\\u7EF4\\u62A4\\u9875\\u9762\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=\\u5E03\\u5C40\n\n#XTIT\nCopyDialog.Title=\\u590D\\u5236\\u9875\\u9762\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=\\u662F\\u5426\\u8981\\u590D\\u5236 "{0}"\\uFF1F\n#XFLD\nCopyDialog.NewID="{0}" \\u7684\\u526F\\u672C\n\n#XMSG\nTitle.NoSectionTitle=\\u90E8\\u5206 {0} \\u7684\\u90E8\\u5206\\u6807\\u9898\\u4E3A\\u7A7A\\u3002\n#XMSG\nTitle.UnsufficientRoles=\\u89D2\\u8272\\u5206\\u914D\\u4E0D\\u8DB3\\u4EE5\\u663E\\u793A\\u53EF\\u89C6\\u5316\\u5185\\u5BB9\\u3002\n#XMSG\nTitle.VisualizationIsNotVisible=\\u5C06\\u4E0D\\u4F1A\\u663E\\u793A\\u53EF\\u89C6\\u5316\\u5185\\u5BB9\\u3002\n#XMSG\nTitle.VisualizationNotNavigateable=\\u53EF\\u89C6\\u5316\\u65E0\\u6CD5\\u6253\\u5F00\\u5E94\\u7528\\u7A0B\\u5E8F\\u3002\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=\\u9759\\u6001\\u78C1\\u8D34\n#XTIT\nTitle.DynamicTile=\\u52A8\\u6001\\u78C1\\u8D34\n#XTIT\nTitle.CustomTile=\\u81EA\\u5B9A\\u4E49\\u78C1\\u8D34\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=\\u9875\\u9762\\u9884\\u89C8\\uFF1A{0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=\\u62B1\\u6B49\\uFF0C\\u65E0\\u6CD5\\u627E\\u5230\\u6B64\\u9875\\u9762\\u3002\n#XLNK\nErrorPage.Link=\\u7EF4\\u62A4\\u9875\\u9762\n',
	"sap/ushell/applications/PageComposer/i18n/i18n_zh_TW.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# \n\n# XTIT: Title for the Maintain Page Templates Application\nPageComposer.AppTitle=\\u7DAD\\u8B77\\u9801\\u9762\\u8DE8\\u7528\\u6236\\u7AEF\n\n#XBUT\nButton.Add=\\u65B0\\u589E\n#XBUT\nButton.Cancel=\\u53D6\\u6D88\n#XBUT\nButton.ClosePreview=\\u95DC\\u9589\\u9810\\u89BD\n#XBUT\nButton.Copy=\\u8907\\u88FD\n#XBUT\nButton.Create=\\u5EFA\\u7ACB\n#XBUT\nButton.Delete=\\u522A\\u9664\n#XBUT\nButton.Edit=\\u7DE8\\u8F2F\n#XBUT\nButton.Save=\\u5132\\u5B58\n#XBUT\nButton.Select=\\u9078\\u64C7\n#XBUT\nButton.Ok=\\u78BA\\u5B9A\n#XBUT\nButton.ShowCatalogs=\\u986F\\u793A\\u76EE\\u9304\n#XBUT\nButton.HideCatalogs=\\u96B1\\u85CF\\u76EE\\u9304\n#XBUT: Number of issue (on the page template being edited)\nButton.Issues=\\u6838\\u767C\\uFF1A{0}\n#XBUT\nButton.SortCatalogs=\\u5207\\u63DB\\u76EE\\u9304\\u6392\\u5E8F\\u9806\\u5E8F\n#XBUT\nButton.CollapseCatalogs=\\u6536\\u5408\\u6240\\u6709\\u76EE\\u9304\n#XBUT\nButton.ExpandCatalogs=\\u5C55\\u958B\\u6240\\u6709\\u76EE\\u9304\n#XBUT\nButton.ShowDetails=\\u986F\\u793A\\u660E\\u7D30\n#XBUT\nButton.PagePreview=\\u9801\\u9762\\u9810\\u89BD\n#XBUT\nButton.ErrorMsg=\\u932F\\u8AA4\\u8A0A\\u606F\n#XBUT\nButton.EditHeader=\\u7DE8\\u8F2F\\u8868\\u982D\n#XBUT\nButton.ContextSelector=\\u9078\\u64C7\\u89D2\\u8272\\u5167\\u5BB9 {0}\n#XBUT\nButton.OverwriteChanges=\\u8986\\u5BEB\n#XBUT\nButton.DismissChanges=\\u95DC\\u9589\\u66F4\\u6539\n\n#XTOL\nTooltip.AddToSections=\\u65B0\\u589E\\u81F3\\u5340\\u6BB5\n#XTOL: Tooltip for the search button\nTooltip.Search=\\u641C\\u5C0B\n#XTOL\nTooltip.SearchForTiles=\\u641C\\u5C0B\\u529F\\u80FD\\u78DA\n#XTOL\nTooltip.SearchForRoles=\\u641C\\u5C0B\\u89D2\\u8272\n#XTOL: Tooltip for the desktop computer icon\nTooltip.Desktop=\\u684C\\u9762\n#XTOL: Opens the sort settings dialog\nTooltip.FortSettingsButton=\\u6AA2\\u8996\\u6392\\u5E8F\\u8A2D\\u5B9A\n#XTOL: Opens the filter settings dialog\nTooltip.FilterSettingsButton=\\u6AA2\\u8996\\u7BE9\\u9078\\u8A2D\\u5B9A\n#XTOL: Opens the group settings dialog\nTooltip.GroupSettingsButton=\\u6AA2\\u8996\\u7FA4\\u7D44\\u8A2D\\u5B9A\n\n#XFLD\nLabel.PageID=\\u9801\\u9762 ID\n#XFLD\nLabel.Title=\\u6A19\\u984C\n#XFLD\nLabel.WorkbenchRequest=\\u5DE5\\u4F5C\\u53F0\\u8ACB\\u6C42\n#XFLD\nLabel.Package=\\u5957\\u4EF6\n#XFLD\nLabel.TransportInformation=\\u50B3\\u8F38\\u8CC7\\u8A0A\n#XFLD\nLabel.Details=\\u660E\\u7D30\\uFF1A\n#XFLD\nLabel.ResponseCode=\\u56DE\\u61C9\\u4EE3\\u78BC\\uFF1A\n#XFLD\nLabel.ModifiedBy=\\u4FEE\\u6539\\u8005\\uFF1A\n#XFLD\nLabel.Description=\\u8AAA\\u660E\n#XFLD\nLabel.CreatedByFullname=\\u5EFA\\u7ACB\\u8005\n#XFLD\nLabel.CreatedOn=\\u5EFA\\u7ACB\\u65E5\\u671F\n#XFLD\nLabel.ChangedByFullname=\\u66F4\\u6539\\u8005\n#XFLD\nLabel.ChangedOn=\\u66F4\\u6539\\u65E5\\u671F\n#XFLD\nLabel.PageTitle=\\u9801\\u9762\\u6A19\\u984C\n#XFLD\nLabel.AssignedRole=\\u6307\\u6D3E\\u89D2\\u8272\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=\\u6A19\\u984C\n#XCOL\nColumn.PageDescription=\\u8AAA\\u660E\n#XCOL\nColumn.PageAssignmentStatus=\\u5DF2\\u6307\\u6D3E\\u7D66\\u7A7A\\u9593/\\u89D2\\u8272\n#XCOL\nColumn.PagePackage=\\u5957\\u4EF6\n#XCOL\nColumn.PageWorkbenchRequest=\\u5DE5\\u4F5C\\u53F0\\u8ACB\\u6C42\n#XCOL\nColumn.PageCreatedBy=\\u5EFA\\u7ACB\\u8005\n#XCOL\nColumn.PageCreatedOn=\\u5EFA\\u7ACB\\u65E5\\u671F\n#XCOL\nColumn.PageChangedBy=\\u66F4\\u6539\\u8005\n#XCOL\nColumn.PageChangedOn=\\u66F4\\u6539\\u65E5\\u671F\n\n#XTOL\nPlaceholder.SectionName=\\u8F38\\u5165\\u5340\\u6BB5\\u540D\\u7A31\n#XTOL\nPlaceholder.SearchForTiles=\\u641C\\u5C0B\\u529F\\u80FD\\u78DA\n#XTOL\nPlaceholder.SearchForRoles=\\u641C\\u5C0B\\u89D2\\u8272\n#XTOL\nPlaceholder.CopyPageTitle="{0}" \\u7684\\u526F\\u672C\n#XTOL\nPlaceholder.CopyPageID="{0}" \\u7684\\u526F\\u672C\n#XMSG: In the ContextSelector, when all roles are selected, this text is displayed on the button instead of the number of selected roles\nMessage.AllRolesSelected=\\u6240\\u6709\n#XMSG: "{0}" is a number, representing the index of the section\nMessage.NoSectionTitle=\\u5340\\u6BB5 {0} \\u6C92\\u6709\\u6A19\\u984C\\u3002\\u95DC\\u65BC\\u4E00\\u81F4\\u7684\\u4F7F\\u7528\\u8005\\u9AD4\\u9A57\\uFF0C\\u5EFA\\u8B70\\u60A8\\u8F38\\u5165\\u6BCF\\u500B\\u5340\\u6BB5\\u7684\\u540D\\u7A31\\u3002\n#XMSG\nMessage.InvalidSectionTitle=\\u539F\\u5247\\u4E0A\\uFF0C\\u60A8\\u61C9\\u8F38\\u5165\\u5340\\u6BB5\\u540D\\u7A31\\u3002\n#XMSG\nMessage.NoInternetConnection=\\u8ACB\\u6AA2\\u67E5\\u60A8\\u7684\\u7DB2\\u8DEF\\u9023\\u7DDA\\u3002\n#XMSG\nMessage.SavedChanges=\\u5DF2\\u5132\\u5B58\\u60A8\\u7684\\u66F4\\u6539\\u3002\n#XMSG\nMessage.InvalidPageID=\\u8ACB\\u50C5\\u4F7F\\u7528\\u4EE5\\u4E0B\\u5B57\\u5143\\uFF1AA-Z\\u30010-9\\u3001_ \\u548C /\\uFF0C\\u9801\\u9762 ID \\u4E0D\\u6703\\u4F7F\\u7528\\u6578\\u5B57\\u4F5C\\u70BA\\u958B\\u982D\\u3002\n#XMSG\nMessage.EmptyPageID=\\u8ACB\\u63D0\\u4F9B\\u6709\\u6548\\u9801\\u9762 ID\\u3002\n#XMSG\nMessage.EmptyTitle=\\u8ACB\\u63D0\\u4F9B\\u6709\\u6548\\u6A19\\u984C\\u3002\n#XMSG\nMessage.NoRoleSelected=\\u8ACB\\u81F3\\u5C11\\u9078\\u64C7\\u4E00\\u500B\\u89D2\\u8272\\u3002\n#XMSG\nMessage.SuccessDeletePage=\\u5DF2\\u522A\\u9664\\u6240\\u9078\\u7269\\u4EF6\\u3002\n#XMSG\nMessage.ClipboardCopySuccess=\\u5DF2\\u6210\\u529F\\u8907\\u88FD\\u660E\\u7D30\\u3002\n#YMSE\nMessage.ClipboardCopyFail=\\u8907\\u88FD\\u660E\\u7D30\\u6642\\u767C\\u751F\\u932F\\u8AA4\\u3002\n#XMSG\nMessage.PageCreated=\\u5DF2\\u5EFA\\u7ACB\\u9801\\u9762\\u3002\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=\\u6C92\\u6709\\u529F\\u80FD\\u78DA\n#XMSG: Message displayed inside of the ContextSelector when there are no roles available\nMessage.NoRoles=\\u6C92\\u6709\\u89D2\\u8272\\u3002\n#XMSG: Message displayed inside of the ContextSelector when there are no roles found\nMessage.NoRolesFound=\\u627E\\u4E0D\\u5230\\u89D2\\u8272\\uFF0C\\u8ACB\\u5617\\u8A66\\u8ABF\\u6574\\u60A8\\u7684\\u641C\\u5C0B\\u3002\n#XMSG: Message displayed inside of the TileSelector SectionSelectionPopover when there are no sections\nMessage.NoSections=\\u6C92\\u6709\\u5340\\u6BB5\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the section name\nMessage.LoadTileError=\\u7121\\u6CD5\\u5728 "{1}" \\u5340\\u6BB5\\u4E2D\\u8F09\\u5165 {0} \\u529F\\u80FD\\u78DA\\u3002\\n\\n\\u6700\\u53EF\\u80FD\\u7684\\u539F\\u56E0\\u662F\\u4F7F\\u7528\\u4E0D\\u6B63\\u78BA\\u7684 SAP Fiori \\u555F\\u52D5\\u53F0\\u5167\\u5BB9\\u7D44\\u614B\\uFF0C\\u4F7F\\u7528\\u8005\\u7121\\u6CD5\\u770B\\u5230\\u8996\\u89BA\\u6548\\u679C\\u3002\n#XMSG\nMessage.NavigationTargetError=\\u7121\\u6CD5\\u89E3\\u6C7A\\u700F\\u89BD\\u76EE\\u6A19\\u3002\n#XMSG\nMessage.LoadPageError=\\u7121\\u6CD5\\u8F09\\u5165\\u9801\\u9762\\u3002\n#XMSG\nMessage.UpdatePageError=\\u7121\\u6CD5\\u66F4\\u65B0\\u9801\\u9762\\u3002\n#XMSG\nMessage.CreatePageError=\\u7121\\u6CD5\\u5EFA\\u7ACB\\u9801\\u9762\\u3002\n#XMSG\nMessage.TilesHaveErrors=\\u90E8\\u4EFD\\u529F\\u80FD\\u78DA\\u6216\\u5340\\u6BB5\\u767C\\u751F\\u932F\\u8AA4\\uFF1B\\u60A8\\u78BA\\u5B9A\\u8981\\u7E7C\\u7E8C\\u5132\\u5B58\\u55CE\\uFF1F\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=\\u7121\\u6CD5\\u89E3\\u6C7A\\u529F\\u80FD\\u78DA "{0}" \\u7684\\u700F\\u89BD\\u76EE\\u6A19\\u3002\\n\\n\\u6700\\u53EF\\u80FD\\u7684\\u539F\\u56E0\\u662F\\u4F7F\\u7528\\u7121\\u6548\\u7684 SAP Fiori \\u555F\\u52D5\\u53F0\\u5167\\u5BB9\\u7D44\\u614B\\uFF0C\\u8996\\u89BA\\u6548\\u679C\\u7121\\u6CD5\\u958B\\u555F\\u61C9\\u7528\\u7A0B\\u5F0F\\u3002\n#YMSG: First parameter {0} is the the title of the visualization\nMessage.VisualizationOutOfContextError=The tile\\: "{0}" is not available in the selected context. This is due to restrictions applied by selecting a role context.\n#XMSG: "{0}" is the section title.\nMessage.Section.Delete=\\u60A8\\u78BA\\u5B9A\\u8981\\u522A\\u9664\\u5340\\u6BB5 "{0}" \\u55CE\\uFF1F\n#XMSG\nMessage.Section.DeleteNoTitle=\\u60A8\\u78BA\\u5B9A\\u8981\\u522A\\u9664\\u6B64\\u5340\\u6BB5\\u55CE\\uFF1F\n#XMSG\nMessage.OverwriteChanges=\\u7DE8\\u8F2F\\u9801\\u9762\\u6642\\u51FA\\u73FE\\u66F4\\u6539\\u5167\\u5BB9\\uFF0C\\u60A8\\u8981\\u8986\\u5BEB\\u55CE\\uFF1F\n#XMSG\nMessage.OverwriteRemovedPage=\\u60A8\\u6B63\\u5728\\u4F7F\\u7528\\u7684\\u9801\\u9762\\u5DF2\\u7531\\u5176\\u4ED6\\u4F7F\\u7528\\u8005\\u522A\\u9664\\uFF0C\\u60A8\\u8981\\u8986\\u5BEB\\u6B64\\u66F4\\u6539\\u55CE\\uFF1F\n#XMSG\nMessage.SaveChanges=\\u8ACB\\u5132\\u5B58\\u60A8\\u7684\\u66F4\\u6539\\u3002\n#XMSG\nMessage.NoPages=\\u6C92\\u6709\\u9801\\u9762\\u3002\n#XMSG\nMessage.NoPagesFound=\\u627E\\u4E0D\\u5230\\u9801\\u9762\\uFF0C\\u8ACB\\u5617\\u8A66\\u8ABF\\u6574\\u60A8\\u7684\\u641C\\u5C0B\\u3002\n#XMSG Info message about the changed role context for a page template or a space template\nMessage.RoleContext=\\u5167\\u5BB9\\u9650\\u5236\\u70BA\\u89D2\\u8272\\u5167\\u5BB9\\u3002\n#XMSG\nMessage.NotAssigned=\\u672A\\u6307\\u6D3E\\u3002\n#XMSG\nMessage.StatusAssigned=\\u5DF2\\u6307\\u6D3E\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=\\u65B0\\u9801\\u9762\n#XTIT: Title for the ContextSelector dialog\nContextSelector.Title=\\u9078\\u64C7\\u89D2\\u8272\\u5167\\u5BB9\n#XTIT\nTitle.TilesHaveErrors=\\u529F\\u80FD\\u78DA\\u767C\\u751F\\u932F\\u8AA4\n#XTIT\nDeleteDialog.Title=\\u522A\\u9664\n#XMSG\nDeleteDialog.Text=\\u60A8\\u78BA\\u5B9A\\u8981\\u522A\\u9664\\u6240\\u9078\\u9801\\u9762\\u55CE\\uFF1F\n#XBUT\nDeleteDialog.ConfirmButton=\\u522A\\u9664\n#XTIT\nDeleteDialog.LockedTitle=\\u5DF2\\u9396\\u4F4F\\u9801\\u9762\n#XMSG\nDeleteDialog.LockedText=\\u4F7F\\u7528\\u8005 "{0}" \\u9396\\u4F4F\\u6240\\u9078\\u9801\\u9762\\u3002\n#XMSG\nDeleteDialog.TransportRequired=\\u8ACB\\u9078\\u64C7\\u50B3\\u8F38\\u5957\\u4EF6\\u4EE5\\u522A\\u9664\\u6240\\u9078\\u9801\\u9762\\u3002\n\n#XMSG\nEditDialog.LockedText=\\u4F7F\\u7528\\u8005 "{0}" \\u9396\\u4F4F\\u6240\\u9078\\u9801\\u9762\\u3002\n#XMSG\nEditDialog.TransportRequired=\\u8ACB\\u9078\\u64C7\\u50B3\\u8F38\\u5957\\u4EF6\\u4EE5\\u7DE8\\u8F2F\\u6240\\u9078\\u9801\\u9762\\u3002\n#XTIT\nEditDialog.Title=\\u7DE8\\u8F2F\\u9801\\u9762\n#XMSG: Parameter "{0}" is the masterLanguage of the page template. Parameter "{1}" is the language of the user\nEditDialog.LanguageMismatch=\\u6B64\\u9801\\u9762\\u5DF2\\u4F7F\\u7528\\u8A9E\\u8A00 "{0}" \\u5EFA\\u7ACB\\uFF0C\\u4F46\\u60A8\\u7684\\u767B\\u5165\\u8A9E\\u8A00\\u8A2D\\u70BA "{1}"\\u3002\\u8ACB\\u5C07\\u767B\\u5165\\u8A9E\\u8A00\\u66F4\\u6539\\u70BA "{0}" \\u4EE5\\u7E7C\\u7E8C\\u9032\\u884C\\u3002\n\n#XFLD\nTileInfoPopover.Label.Subtitle=\\u5B50\\u6A19\\u984C\n#XFLD\nTileInfoPopover.Label.Icon=\\u5716\\u793A\n#XFLD\nTileInfoPopover.Label.SemanticObject=\\u8A9E\\u610F\\u7269\\u4EF6\n#XFLD\nTileInfoPopover.Label.SemanticAction=\\u8A9E\\u610F\\u52D5\\u4F5C\n#XFLD\nTileInfoPopover.Label.FioriID=Fiori ID\n#XFLD\nTileInfoPopover.Label.AppDetail=\\u61C9\\u7528\\u7A0B\\u5F0F\\u660E\\u7D30\n#XFLD\nTileInfoPopover.Label.AppType=\\u61C9\\u7528\\u7A0B\\u5F0F\\u985E\\u578B\n#XFLD\nTileInfoPopover.Label.TileType=\\u529F\\u80FD\\u78DA\\u985E\\u578B\n#XFLD\nTileInfoPopover.Label.AvailableDevices=\\u53EF\\u7528\\u88DD\\u7F6E\n\n#XTIT\nErrorDialog.Title=\\u932F\\u8AA4\n\n#XTIT\nConfirmChangesDialog.Title=\\u8B66\\u544A\n\n#XTIT\nPageOverview.Title=\\u7DAD\\u8B77\\u9801\\u9762\n\n#XTIT: "Layout" title of a page template composer section\nTitle.Layout=\\u914D\\u7F6E\n\n#XTIT\nCopyDialog.Title=\\u8907\\u88FD\\u9801\\u9762\n#XMSG: Paremeter "{0}" is the title of the page template being copied\nCopyDialog.Message=\\u60A8\\u8981\\u8907\\u88FD "{0}" \\u55CE\\uFF1F\n#XFLD\nCopyDialog.NewID={0} \\u7684\\u526F\\u672C\n\n#XMSG\nTitle.NoSectionTitle=\\u5340\\u6BB5 {0} \\u7684\\u5340\\u6BB5\\u6A19\\u984C\\u7A7A\\u767D\\u3002\n#XMSG\nTitle.UnsufficientRoles=\\u89D2\\u8272\\u6307\\u6D3E\\u4E0D\\u8DB3\\uFF0C\\u7121\\u6CD5\\u986F\\u793A\\u8996\\u89BA\\u6548\\u679C\\u3002\n#XMSG\nTitle.VisualizationIsNotVisible=\\u4E0D\\u6703\\u986F\\u793A\\u8996\\u89BA\\u6548\\u679C\\u3002\n#XMSG\nTitle.VisualizationNotNavigateable=\\u8996\\u89BA\\u6548\\u679C\\u7121\\u6CD5\\u958B\\u555F\\u61C9\\u7528\\u7A0B\\u5F0F\\u3002\n#XMSG: Warning message shown when a visualization is out of scope for the selected context.\nMessage.VisualizationNotAvailableInContext=Visualization not available in the selected context.\n\n#XTIT\nTitle.StaticTile=\\u975C\\u614B\\u529F\\u80FD\\u78DA\n#XTIT\nTitle.DynamicTile=\\u52D5\\u614B\\u529F\\u80FD\\u78DA\n#XTIT\nTitle.CustomTile=\\u81EA\\u8A02\\u529F\\u80FD\\u78DA\n\n#XTIT: Title of a dialog that shows a preview of a page\nPagePreviewDialog.title=\\u9801\\u9762\\u9810\\u89BD\\uFF1A{0}\n\n##############\n# Error Page\n##############\n\n#XMSG\nErrorPage.Message=\\u5F88\\u62B1\\u6B49\\uFF0C\\u6211\\u5011\\u627E\\u4E0D\\u5230\\u6B64\\u9801\\u9762\\u3002\n#XLNK\nErrorPage.Link=\\u7DAD\\u8B77\\u9801\\u9762\n',
	"sap/ushell/applications/PageComposer/localService/mockserver.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define(["sap/ui/core/util/MockServer"], function (MockServer) {
    "use strict";

    return {
        init: function (sRootUri, sMetadataUrl, config) {
            sRootUri = sRootUri || "/";

            var oMockServer = new MockServer({
                rootUri: sRootUri
            });

            MockServer.config({
                autoRespond: true,
                autoRespondAfter: 0
            });

            oMockServer.simulate(sMetadataUrl, config);

            oMockServer.start();
        }
    };
});
},
	"sap/ushell/applications/PageComposer/manifest.json":'{\n    "_version": "1.17.0",\n    "sap.app": {\n        "i18n": "i18n/i18n.properties",\n        "id": "sap.ushell.applications.PageComposer",\n        "type": "component",\n        "embeddedBy": "",\n        "title": "{{PageComposer.AppTitle}}",\n        "ach": "CA-FLP-FE-COR",\n        "dataSources": {\n            "PageRepositoryService": {\n                "uri": "/sap/opu/odata/UI2/FDM_PAGE_REPOSITORY_SRV/",\n                "type": "OData",\n                "settings": {\n                    "odataVersion": "2.0",\n                    "localUri": "localService/pages/metadata.xml"\n                }\n            }\n        },\n        "cdsViews": [],\n        "offline": false\n    },\n    "sap.ui": {\n        "technology": "UI5",\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": false,\n            "phone": false\n        },\n        "fullWidth": true\n    },\n    "sap.ui5": {\n        "autoPrefixId": true,\n        "componentUsages": {\n            "transportInformation": {\n                "name": "sap.ushell_abap.transport",\n                "lazy": true,\n                "componentData": {\n                    "supported": true\n                }\n            }\n        },\n        "dependencies": {\n            "minUI5Version": "1.72.0",\n            "libs": {\n                "sap.ui.core": {\n                    "lazy": false\n                },\n                "sap.f": {\n                    "lazy": false\n                },\n                "sap.m": {\n                    "lazy": false\n                },\n                "sap.ui.layout": {\n                    "lazy": false\n                },\n                "sap.ushell": {\n                    "lazy": false\n                }\n            },\n            "components": {\n                "sap.ushell_abap.transport": {\n                    "lazy": true,\n                    "manifest" : true\n                }\n            }\n        },\n        "models": {\n            "PageRepository": {\n                "dataSource": "PageRepositoryService",\n                "preload": true,\n                "settings": {\n                    "defaultCountMode": "None",\n                    "skipMetadataAnnotationParsing": true,\n                    "useBatch": true\n                }\n            },\n            "i18n": {\n                "type": "sap.ui.model.resource.ResourceModel",\n                "uri": "i18n/i18n.properties"\n            }\n        },\n        "rootView": {\n            "viewName": "sap.ushell.applications.PageComposer.view.App",\n            "type": "XML",\n            "async": true,\n            "id": "pageComposer"\n        },\n        "handleValidation": false,\n        "config": {\n            "fullWidth": true,\n            "sapFiori2Adaptation": true,\n            "enableCreate": true,\n            "enablePreview": true,\n            "checkLanguageMismatch": true\n        },\n        "routing": {\n            "config": {\n                "routerClass": "sap.m.routing.Router",\n                "viewType": "XML",\n                "viewPath": "sap.ushell.applications.PageComposer.view",\n                "controlId": "pageComposer",\n                "controlAggregation": "pages",\n                "async": true,\n                "fullWidth" : true\n            },\n            "routes": [\n                {\n                    "pattern": "",\n                    "name": "overview",\n                    "target": "overview"\n                },\n                {\n                    "pattern": "view/{pageId}:?query:",\n                    "name": "view",\n                    "target": "view"\n                },\n                {\n                    "pattern": "edit/{pageId}:?query:",\n                    "name": "edit",\n                    "target": "edit"\n                },\n                {\n                    "pattern": "error/{pageId}",\n                    "name": "error",\n                    "target": "error"\n                }\n            ],\n            "targets": {\n                "overview": {\n                    "viewId": "pageOverview",\n                    "viewName": "PageOverview"\n                },\n                "view": {\n                    "viewId": "view",\n                    "viewName": "PageDetail"\n                },\n                "edit": {\n                    "viewId": "edit",\n                    "viewName": "PageDetailEdit"\n                },\n                "error": {\n                    "viewId": "error",\n                    "viewName": "ErrorPage"\n                }\n            }\n        },\n        "contentDensities": { "compact": true, "cozy": true }\n    }\n}\n',
	"sap/ushell/applications/PageComposer/test/initMockServer.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "../localService/mockserver",
    "sap/m/Shell",
    "sap/ushell/bootstrap/common/common.boot.task",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/bootstrap/common/common.create.configcontract.core",
    "sap/ushell/Config"
], function (mockserver, Shell, fnBootTask, JSONModel, CommonCreateConfigcontract, Config) {
    "use strict";

    // initialize the mock server for pages
    mockserver.init(
        "/sap/opu/odata/UI2/FDM_PAGE_REPOSITORY_SRV/",
        "../localService/pages/metadata.xml",
        {
            sMockdataBaseUrl: "../localService/pages/mockData"
        }
    );

    // initialize the mock server for transport
    mockserver.init(
        "/sap/opu/odata/UI2/FDM_VALUE_HELP_SRV/",
        "../localService/transport/metadata.xml",
        {
            sMockdataBaseUrl: "../localService/transport/mockData"
        }
    );

    function _applyConfiguration () {
        Config._reset();
        Config.registerConfiguration(null, CommonCreateConfigcontract.createConfigContract());
    }

    function _loadConfiguration (sPath) {
        return new Promise(function (fnResolve) {
            var oModel = new JSONModel(sPath);
            oModel.attachRequestCompleted(function () {
                fnResolve(oModel.getData());
            });
        });
    }

    // merge cdm bootstrap config with sandbox defaults, further overrides can be done via the init method.
    function _getConfiguration () {
        return _loadConfiguration("cdm/configuration.json");
    }

    _getConfiguration().then(function (oConfiguration) {
        // the configuration must be set to the window object, otherwise, the CDM data is not loaded.
        window["sap-ushell-config"] = oConfiguration;

        fnBootTask("cdm", function () {
            _applyConfiguration();
            // initialize the embedded component on the HTML page
            var oComponentContainer = new sap.ui.core.ComponentContainer({
                async: true,
                height: "100%",
                name: "sap.ushell.applications.PageComposer",
                manifest: "../manifest.json"
            });

            var oShell = new Shell({
                app: oComponentContainer,
                appWidthLimited: false
            });

            oShell.placeAt("content");
        });
    });


});
},
	"sap/ushell/applications/PageComposer/util/PagePersistence.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview PagePersistence utility to interact with the /UI2/FDM_PAGE_REPOSITORY_SRV service on ABAP
 * @version 1.74.0
 */
sap.ui.define([], function () {
    "use strict";

    /**
     * Constructs a new instance of the PagePersistence utility.
     *
     * @param {sap.ui.model.odata.v2.ODataModel} oDataModel The ODataModel for the PageRepositoryService
     * @param {sap.base.i18n.ResourceBundle} oResourceBundle The translation bundle
     * @param {sap.ui.model.message.MessageModel} oMessagemodel The sap-message model
     * @constructor
     *
     * @since 1.70.0
     *
     * @private
     */
    var PagePersistence = function (oDataModel, oResourceBundle, oMessagemodel) {
        this._oODataModel = oDataModel;
        this._oResourceBundle = oResourceBundle;
        this._oEtags = {};
        this._oMessageModel= oMessagemodel;
    };

    /**
     * Returns a promise which resolves to an array of page headers of all available pages.
     *
     * @returns {Promise<object[]>} Resolves to an array of page headers.
     *
     * @since 1.70.0
     *
     * @protected
     */
    PagePersistence.prototype.getPages = function () {
        return this._readPages()
            .then(function (pages) {
                for (var i = 0; i < pages.results.length; i++) {
                    this._storeETag(pages.results[i]);
                }
                return pages;
            }.bind(this))
            .then(this._convertODataToPageList.bind(this))
            .catch(this._rejectWithErrorMessage.bind(this));
    };

    /**
     * Returns a page
     *
     * @param {string} sPageId The page ID
     * @returns {Promise<object>} Resolves to a page
     *
     * @since 1.70.0
     *
     * @protected
     */
    PagePersistence.prototype.getPage = function (sPageId) {
        return this._readPage(sPageId)
            .then(function (page) {
                this._storeETag(page);
                return page;
            }.bind(this))
            .then(this._convertODataToReferencePage.bind(this))
            .catch(this._rejectWithErrorMessage.bind(this));
    };

    /**
     * Creates a new page
     *
     * @param {object} oPageToCreate The new page
     * @returns {Promise} Resolves when the page has been created successfully
     *
     * @since 1.70.0
     *
     * @protected
     */
    PagePersistence.prototype.createPage = function (oPageToCreate) {
        var pageToCreate = this._convertReferencePageToOData(oPageToCreate);

        return this._createPage(pageToCreate).then(this._storeETag.bind(this));
    };

    /**
     * Updates a page. This method expects to get the complete page. Sections and tiles
     * that are left out will be deleted.
     *
     * @param {object} oUpdatedPage The updated page data
     * @returns {Promise} Resolves when the page has been updated successfully
     *
     * @since 1.70.0
     *
     * @protected
     */
    PagePersistence.prototype.updatePage = function (oUpdatedPage) {
        var oUpdatedODataPage = this._convertReferencePageToOData(oUpdatedPage);

        oUpdatedODataPage.modifiedOn = this._oEtags[oUpdatedPage.content.id].modifiedOn;

        return this._createPage(oUpdatedODataPage)
            .then(this._storeETag.bind(this))
            .catch(this._rejectWithErrorMessage.bind(this));
    };

    /**
     * Deletes a  page
     *
     * @param {string} sPageId The ID of the page to be deleted
     * @param {string} sTransportId The transport workbench
     * @returns {Promise} Resolves when the page has been deleted successfully
     *
     * @since 1.70.0
     *
     * @protected
     */
    PagePersistence.prototype.deletePage = function (sPageId, sTransportId) {
        return new Promise(function (resolve, reject) {
            this._oODataModel.callFunction("/deletePage", {
                method: "POST",
                urlParameters: {
                    pageId: sPageId,
                    transportId: sTransportId,
                    modifiedOn: this._oEtags[sPageId].modifiedOn
                },
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Copy a  page
     *
     * @param  {object} oPageToCreate The page data to copy
     * @returns {Promise} Resolves when the page has been deleted successfully
     *
     * @since 1.70.0
     *
     * @protected
     */
    PagePersistence.prototype.copyPage = function (oPageToCreate) {
        return new Promise(function (resolve, reject) {
            this._oODataModel.callFunction("/copyPage", {
                method: "POST",
                urlParameters: {
                    targetId: oPageToCreate.content.targetId.toUpperCase(),
                    sourceId: oPageToCreate.content.sourceId,
                    title: oPageToCreate.content.title,
                    description: oPageToCreate.content.description,
                    devclass: oPageToCreate.metadata.devclass,
                    transportId: oPageToCreate.metadata.transportId
                },
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Fetches the catalog information.
     * @param {string} pageId The page ID by which to scope the catalogs.
     * @param {string[]} [aRoles=undefined] The roles by which to scope the catalogs, will override the scoping by page ID if passed.
     * @returns {Promise<object[]>[]} An array of promises resolving to an array of objects containing the visualization catalogs
     *
     * @private
     */
    PagePersistence.prototype.getCatalogs = function (pageId, aRoles) {
        return !aRoles || aRoles.length === 1 && !aRoles[0]
            ? [this._getCatalogsByPage(pageId)]
            : this._getCatalogsByRole(aRoles);
    };

    /**
     * Reads the headers of the available pages from the server
     *
     * @returns {Promise<object>} Resolves to the page headers in the OData format
     *
     * @since 1.70.0
     *
     * @private
     */
    PagePersistence.prototype._readPages = function () {
        return new Promise(function (resolve, reject) {
            this._oODataModel.read("/pageSet", {
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Reads a page from the server
     *
     * @param {string} sPageId The page ID
     * @returns {Promise<object>} Resolves to a page in the OData format
     *
     * @since 1.70.0
     *
     * @private
     */
    PagePersistence.prototype._readPage = function (sPageId) {
        return new Promise(function (resolve, reject) {
            this._oODataModel.read("/pageSet('" + encodeURIComponent(sPageId) + "')", {
                urlParameters: {
                    "$expand": "sections/tiles"
                },
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Creates a page on the server
     *
     * @param {object} oNewPage The page data
     * @returns {Promise} Page the OData format
     *
     * @since 1.70.0
     *
     * @private
     */
    PagePersistence.prototype._createPage = function (oNewPage) {
        return new Promise(function (resolve, reject) {
            this._oODataModel.create("/pageSet", oNewPage, {
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Converts a list of page headers from the OData format into the FLP internal format
     *
     * @param {object[]} aPages The page headers in the OData format
     * @returns {object[]} The page headers in the FLP-internal format
     *
     * @since 1.70.0
     *
     * @private
     */
    PagePersistence.prototype._convertODataToPageList = function (aPages) {
        return aPages.results.map(function (oPage) {
            return {
                content: {
                    id: oPage.id,
                    title: oPage.title,
                    description: oPage.description,
                    createdBy: oPage.createdBy,
                    createdByFullname: oPage.createdByFullname,
                    createdOn: oPage.createdOn,
                    modifiedBy: oPage.modifiedBy,
                    modifiedByFullname: oPage.modifiedByFullname,
                    modifiedOn: oPage.modifiedOn,
                    masterLanguage: oPage.masterLanguage,
                    editAllowed: this.checkErrorMessage(oPage.id)
                },
                metadata: {
                    devclass: oPage.devclass,
                    transportId: oPage.transportId
                }
            };
        }.bind(this));
    };

    /**
     * Converts a reference page from the OData format to the FLP internal format
     *
     * @param {object} oPage The page in the OData format
     * @returns {object} The page in the FLP format
     *
     * @since 1.70.0
     *
     * @private
     */
    PagePersistence.prototype._convertODataToReferencePage = function (oPage) {
        return {
            content: {
                id: oPage.id,
                title: oPage.title,
                description: oPage.description,
                createdBy: oPage.createdBy,
                createdByFullname: oPage.createdByFullname,
                createdOn: oPage.createdOn,
                modifiedBy: oPage.modifiedBy,
                modifiedByFullname: oPage.modifiedByFullname,
                modifiedOn: oPage.modifiedOn,
                masterLanguage: oPage.masterLanguage,
                editAllowed: this.checkErrorMessage(oPage.id),
                sections: oPage.sections.results.map(function (section) {
                    return {
                        id: section.id,
                        title: section.title,
                        visualizations: section.tiles.results.map(function (tile) {
                            return {
                                id: tile.id,
                                vizId: tile.catalogTile,
                                inboundPermanentKey: tile.targetMapping,
                                title: tile.title,
                                subTitle: tile.subTitle,
                                iconUrl: tile.iconUrl,
                                tileType: tile.tileType
                            };
                        })
                    };
                })
            },
            metadata: {
                transportId: oPage.transportId,
                devclass: oPage.devclass
            }
        };
    };

    /**
     * Converts the reference page from the FLP internal format to the OData format
     *
     * @param {object} oPage The page in the FLP format
     * @returns {object} The page in the OData format
     *
     * @since 1.70.0
     *
     * @private
     */
    PagePersistence.prototype._convertReferencePageToOData = function (oPage) {
        var oReferencePage = oPage.content,
            oMetadata = oPage.metadata;

        var oODataPage = {
            id: oReferencePage.id,
            title: oReferencePage.title,
            description: oReferencePage.description,
            devclass: oMetadata.devclass,
            transportId: oMetadata.transportId,
            sections: (oReferencePage.sections || []).map(function (section) {
                return {
                    id: section.id,
                    title: section.title,
                    tiles: (section.visualizations || []).map(function (tile) {
                        return {
                            id: tile.id,
                            catalogTile: tile.vizId,
                            targetMapping: tile.inboundPermanentKey
                        };
                    })
                };
            })
        };

        return oODataPage;
    };

    /**
     * Stores the etag for a newly retrieved
     *
     * @param {object} oPage The newly retrieved
     *
     * @since 1.70.0
     *
     * @private
     */
    PagePersistence.prototype._storeETag = function (oPage) {
        this._oEtags[oPage.id] = {
            // this is used as an etag for the deep update
            modifiedOn: oPage.modifiedOn,
            // this etag is used for deletion
            etag: oPage.__metadata.etag
        };
    };

    /**
     * Aborts all the pending requests
     * @since 1.72.0
     */
    PagePersistence.prototype.abortPendingBackendRequests = function () {
        if (this._oODataModel.hasPendingRequests()) {
            for (var i = 0; i < this._oODataModel.aPendingRequestHandles.length; i++) {
                this._oODataModel.aPendingRequestHandles[i].abort();
            }
        }
    };

    /**
     * Extracts the error message from an error object
     *
     * @param {object} oError The error object
     * @returns {Promise} A rejected promise containing the error message
     *
     * @since 1.70.0
     *
     * @private
     */
    PagePersistence.prototype._rejectWithErrorMessage = function (oError) {
        var sErrorMessage,
            oSimpleError = {};

        if (oError.statusCode === "412") {
            sErrorMessage = this._oResourceBundle.getText("Message.OverwriteChanges");
        } else if (oError.statusCode === "400") {
            sErrorMessage = this._oResourceBundle.getText("Message.OverwriteRemovedPage");
        } else {
            try {
                sErrorMessage = JSON.parse(oError.responseText).error.message.value || oError.message;
            } catch (error) {
                sErrorMessage = oError.message;
            }
        }
        oSimpleError.message = sErrorMessage;
        oSimpleError.statusCode = oError.statusCode;
        oSimpleError.statusText = oError.statusText;
        return Promise.reject(oSimpleError);
    };

    /**
     * Extracts the error message from an message model.
     *
     * @param {string} sPageId The Page ID.
     * @returns {boolean} returns true when page has Errors.
     *
     * @since 1.74.0
     *
     * @private
     */
    PagePersistence.prototype.checkErrorMessage = function (sPageId) {
        function filterItems (arr, query) {
            return arr.filter(function (obj) {
                return obj.target.toLowerCase().indexOf(query.toLowerCase()) !== -1;
            });
        }
        var oMessageModelData = this._oMessageModel.getData();
        return !(filterItems(oMessageModelData, "/pageSet('"+sPageId+"')").length>0);

    };


    /**
     * Get the catalogs with expanded visualizations scoped by the roleId
     *
     * @param {string[]} aRoleIds Array of IDs of the role to scope by
     * @returns {Promise<object[]>[]} An array of promises resolving to an array of objects containing the visualization catalogs
     * @private
     */
    PagePersistence.prototype._getCatalogsByRole = function (aRoleIds) {
        var promises = [];
        aRoleIds.forEach(function (sRoleId) {
            promises.push(new Promise(function (resolve, reject) {
                this._oODataModel.read("/roleSet('" + encodeURIComponent(sRoleId) + "')", {
                    urlParameters: {
                        "$expand": "catalogs/visualizations"
                    },
                    success: function (oRole) {
                        resolve(oRole.catalogs.results);
                    },
                    error: reject
                });
            }.bind(this)));
        }.bind(this));
        return promises;
    };

    /**
     * Get the catalogs  with expanded visualizations scoped by the roleIds attached to the given pageId
     *
     * @param {string} pageId The pageId to scope by
     * @returns {Promise<{object}[]>} A promise resolving to an array of objects containing the visualization catalogs
     * @private
     */
    PagePersistence.prototype._getCatalogsByPage = function (pageId) {
        return new Promise(function (resolve, reject) {
            this._oODataModel.read("/pageSet('" + encodeURIComponent(pageId) + "')", {
                urlParameters: {
                    "$expand": "roles/catalogs/visualizations"
                },
                success: function (oPage) {
                    var aRoles = oPage.roles.results;
                    var aCatalogs = aRoles.reduce(function (catalogs, role) {
                        return catalogs.concat(role.catalogs.results);
                    }, []);
                    resolve(aCatalogs);
                },
                error: reject
            });
        }.bind(this));
    };

    /**
     * @typedef {object} RoleObject Object expanded from the oData model containing role information.
     * @property {string} title Title of the role.
     * @property {string} name Name, i.e. the ID of the role.
     * @property {object} catalogs A deferred object to the page catalogs.
     * @property {object} __metadata The metadata for this role object.
     */
    /**
     * Expand the oData model to get the available roles.
     *
     * @param {String} pageId The ID of the page the roles need to be read from.
     * @returns {Promise<RoleObject[]>} An array of roles available for the given page.
     *
     * @private
     */
    PagePersistence.prototype.getRoles = function (pageId) {
        return new Promise(function (resolve, reject) {
            this._oODataModel.read("/pageSet('" + encodeURIComponent(pageId) + "')", {
                urlParameters: {
                    "$expand": "roles/catalogs/visualizations"
                },
                success: function (oPage) {
                    var aRoles = oPage.roles.results;
                    resolve(aRoles);
                },
                error: reject
            });
        }.bind(this));
    };

    return PagePersistence;
}, true /* bExport */);
},
	"sap/ushell/applications/PageComposer/util/Transport.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([], function () {
    "use strict";

    /**
     * @constructor
     */
    var TransportHelper = function () {};

    /**
     * Returns a function to call when the transport information is changed
     * The returned function adds the transport validation to the given dialog's model
     *
     * @param {sap.ushell.applications.PageComposer.controller.CreatePageDialog} oDialog The dialog controller
     * @returns {function} The change handler function
     *
     * @private
     */
    TransportHelper.prototype._changeHandler = function (oDialog) {
        return function (value) {
            var oModel = oDialog.getModel();
            var oValidation = jQuery.extend({}, oModel.getProperty("/validation"), {
                transport: value
            });
            oModel.setProperty("/validation", oValidation);
        };
    };

    /**
     * Adds the transportComponent to the extension point and adds the relevant handlers.
     *
     * @param {sap.ushell.applications.PageComposer.controller.CreatePageDialog} dialog The dialog controller
     * @param {object} transportComponent The component with the transport fields
     * @param {function} onConfirm The confirm function
     * @returns {sap.ushell.applications.PageComposer.controller.CreatePageDialog} The enhanced dialog
     *
     * @protected
     */
    TransportHelper.prototype.enhanceDialogWithTransport = function (dialog, transportComponent, onConfirm) {
        var fnChangeHandler = this._changeHandler(dialog);
        fnChangeHandler(false);
        var fnConfirmHandler = function (pageInfo) {
            var oPageInfo = transportComponent.decorateResultWithTransportInformation(pageInfo);
            onConfirm(oPageInfo);
        };
        transportComponent.attachChangeEventHandler(fnChangeHandler);
        dialog.attachConfirm(fnConfirmHandler);
        dialog.transportExtensionPoint(transportComponent);

        return dialog;
    };

    return TransportHelper;
});
},
	"sap/ushell/applications/PageComposer/view/App.view.xml":'<mvc:View\n        controllerName="sap.ushell.applications.PageComposer.controller.App"\n        xmlns="sap.m"\n        xmlns:mvc="sap.ui.core.mvc"\n        height="100%"\n        class="sapUiGlobalBackgroundColor"\n        displayBlock="true">\n    <NavContainer id="pageComposer" />\n</mvc:View>',
	"sap/ushell/applications/PageComposer/view/ConfirmChangesDialog.fragment.xml":'<core:FragmentDefinition\n        xmlns="sap.m"\n        xmlns:core="sap.ui.core" >\n    <Dialog\n        id="confirmChangesDialog"\n        title="{i18n>ConfirmChangesDialog.Title}"\n        type="Message"\n        afterClose=".onAfterClose"\n        contentWidth="30rem"\n        state="Warning">\n        <content>\n            <VBox>\n                <Text\n                    id="confirmChangesDialogMessageText"\n                    text="{/simpleError/message}"\n                    class="sapUiSmallMarginBottom" />\n                <Text\n                    id="confirmChangesModifiedByText"\n                    visible="false"\n                    text="{i18n>Label.ModifiedBy} {/simpleError/modifiedBy}"\n                    class="sapUISmallMarginBottom" />\n            </VBox>\n        </content>\n        <buttons>\n            <Button\n                id="confirmChangesDialogDismissButton"\n                text="{i18n>Button.DismissChanges}"\n                type="Emphasized"\n                press=".onDismissChanges" />\n            <Button\n                id="confirmChangesDialogOverwriteButton"\n                text="{i18n>Button.OverwriteChanges}"\n                press=".onOverwriteChanges" />\n            <Button\n                id="confirmChangesDialogCancelButton"\n                text="{i18n>Button.Cancel}"\n                press=".onCancel" />\n        </buttons>\n    </Dialog>\n</core:FragmentDefinition>',
	"sap/ushell/applications/PageComposer/view/ContextSelector.fragment.xml":'<Dialog\n        xmlns="sap.m"\n        id="contextSelector"\n        title="{i18n>ContextSelector.Title}"\n        beforeOpen=".onBeforeOpen"\n        afterClose=".destroy"\n        contentWidth="30rem">\n    <content>\n        <Toolbar\n                id="contextSelectorToolbar"\n                visible="{/rolesAvailable}">\n            <SearchField\n                    id="contextSelectorSearchField"\n                    liveChange=".onSearch"\n                    search=".onSearch"\n                    tooltip="{i18n>Tooltip.SearchForRoles}"\n                    placeholder="{i18n>Placeholder.SearchForRoles}"\n                    width="100%"/>\n        </Toolbar>\n        <List\n                id="contextSelectorList"\n                mode="MultiSelect"\n                includeItemInSelection="true"\n                selectionChange=".onSelectionChange"\n                items="{/availableRoles}"\n                noDataText="{i18n>Message.NoRoles}">\n            <infoToolbar>\n                <OverflowToolbar\n                        visible="{= !${/validRoleSelection} &amp;&amp; ${/rolesAvailable}}"\n                        id="contextSelectorInfoToolbar">\n                    <Label id="contextSelectorInfoToolbarLabel" text="{i18n>Message.NoRoleSelected}"/>\n                </OverflowToolbar>\n            </infoToolbar>\n            <items>\n                <StandardListItem title="{name}" description="{title}"/>\n            </items>\n        </List>\n    </content>\n    <beginButton>\n        <Button\n                id="contextSelectorSelectButton"\n                type="Emphasized"\n                text="{i18n>Button.Select}"\n                press=".onConfirm"\n                enabled="{= ${/validRoleSelection}}"/>\n    </beginButton>\n    <endButton>\n        <Button id="contextSelectorCancelButton" text="{i18n>Button.Cancel}" press=".onCancel"/>\n    </endButton>\n</Dialog>',
	"sap/ushell/applications/PageComposer/view/CopyPageDialog.fragment.xml":'<Dialog\n    xmlns="sap.m"\n    id="copyPageDialog"\n    title="{i18n>CopyDialog.Title}"\n    beforeOpen=".onBeforeOpen"\n    afterClose=".destroy"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:core="sap.ui.core"\n    core:require="{\n        formatMessage: \'sap/base/strings/formatMessage\',\n        String: \'sap/ui/model/type/String\',\n        CustomString: \'sap/ushell/applications/PageComposer/controller/CustomString\'\n    }">\n    <content>\n        <f:SimpleForm id="copyForm" editable="true">\n            <Text id="copyMessage" text="{\n                parts: [\'i18n>CopyDialog.Message\', \'/sourceId\'],\n                formatter: \'formatMessage\'\n            }" />\n            <Label id="copyPageIdLabel" text="{i18n>Label.PageID}" labelFor="copyId" />\n            <Input\n                maxLength="35"\n                required="true"\n                id="copyPageIdInput"\n                placeholder="{\n                    parts: [\'i18n>Placeholder.CopyPageTitle\', \'/sourceId\'],\n                    formatter: \'formatMessage\'\n                }"\n                change=".onPageIDChange"\n                liveChange=".onPageIDLiveChange"\n                valueLiveUpdate="true"\n                value="{ path: \'/targetId\',\n                         type: \'CustomString\'\n                       }" />\n            <Label id="copyPageDescriptionLabel" text="{i18n>Label.Description}" labelFor="copyDescriptionInput" />\n            <Input\n                maxLength="100"\n                required="true"\n                id="copyDescriptionInput"\n                placeholder="{i18n>Placeholder.Description}"\n                liveChange=".onDescriptionLiveChange"\n                valueLiveUpdate="true"\n                value="{ path: \'/description\', type: \'String\' }" />\n            <Label id="copyTitleLabel" text="{i18n>Label.PageTitle}" labelFor="copyTitle" />\n            <Input\n                id="copyTitle"\n                required="true"\n                maxLength="100"\n                value="{ path: \'/title\', type: \'String\' }"\n                liveChange=".onTitleLiveChange"\n                valueLiveUpdate="true"\n                valueStateText="{i18n>Message.EmptyTitle}"\n                placeholder="{i18n>Placeholder.PageTitle}"\n            />\n        </f:SimpleForm>\n        <core:ComponentContainer id="transportContainer" lifecycle="Application"/>\n    </content>\n    <beginButton>\n        <Button\n            id="copyPageSaveButton"\n            type="Emphasized"\n            text="{i18n>Button.Copy}"\n            press=".onConfirm"\n            enabled="{ path: \'/validation\', formatter: \'.validate\' }" />\n    </beginButton>\n    <endButton>\n        <Button id="copyPageCancelButton" text="{i18n>Button.Cancel}" press=".onCancel" />\n    </endButton>\n</Dialog>\n',
	"sap/ushell/applications/PageComposer/view/CreatePageDialog.fragment.xml":'<Dialog\n    xmlns="sap.m"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:core="sap.ui.core"\n    id="createPageDialog"\n    title="{i18n>CreatePageDialog.Title}"\n    beforeOpen=".onBeforeOpen"\n    afterClose=".destroy"\n    core:require="{\n        String: \'sap/ui/model/type/String\',\n        CustomString: \'sap/ushell/applications/PageComposer/controller/CustomString\'\n    }">\n    <content>\n        <f:SimpleForm id="createPageDialogForm" editable="true">\n            <Label id="createPageIdLabel" text="{i18n>Label.PageID}" />\n            <Input\n                maxLength="35"\n                required="true"\n                id="createPageIdInput"\n                change=".onPageIDChange"\n                liveChange=".onPageIDLiveChange"\n                valueLiveUpdate="true"\n                value="{ path: \'/id\', type: \'CustomString\' }" />\n            <Label id="createPageDescriptionLabel" text="{i18n>Label.Description}" />\n            <Input\n                maxLength="100"\n                required="true"\n                id="createPageDescriptionInput"\n                placeholder="{i18n>Placeholder.Description}"\n                liveChange=".onDescriptionLiveChange"\n                valueLiveUpdate="true"\n                valueStateText="{i18n>Message.EmptyDescription}"\n                value="{ path: \'/description\', type: \'String\' }" />\n            <Label id="createPageTitleLabel" text="{i18n>Label.PageTitle}" />\n            <Input\n                maxLength="100"\n                required="true"\n                id="createPageTitleInput"\n                placeholder="{i18n>Placeholder.PageTitle}"\n                liveChange=".onTitleLiveChange"\n                valueLiveUpdate="true"\n                valueStateText="{i18n>Message.EmptyTitle}"\n                value="{ path: \'/title\', type: \'String\' }" />\n        </f:SimpleForm>\n        <core:ComponentContainer id="transportContainer" lifecycle="Application"/>\n    </content>\n    <beginButton>\n        <Button\n            id="createPageSaveButton"\n            type="Emphasized"\n            text="{i18n>Button.Create}"\n            press=".onConfirm"\n            enabled="{ path: \'/validation\', formatter: \'.validate\' }" />\n    </beginButton>\n    <endButton>\n        <Button id="createPageCancelButton" text="{i18n>Button.Cancel}" press=".onCancel" />\n    </endButton>\n</Dialog>\n',
	"sap/ushell/applications/PageComposer/view/DeleteDialog.fragment.xml":'<core:FragmentDefinition\n        xmlns="sap.m"\n        xmlns:core="sap.ui.core"\n        id="deleteDialogFragment">\n    <Dialog\n        id="deletePageDialog"\n        title="{i18n>DeleteDialog.Title}"\n        type="Message"\n        afterClose=".destroy"\n        state="Warning">\n        <content>\n            <Text id="deleteMessage" text="{/message}" />\n            <core:ComponentContainer id="transportContainer" lifecycle="Application"/>\n        </content>\n        <beginButton>\n            <Button\n                id="deleteButton"\n                text="{i18n>DeleteDialog.ConfirmButton}"\n                press=".onConfirm"\n                type="Emphasized"\n                enabled="{ path: \'/validation\', formatter: \'.validate\' }" />\n        </beginButton>\n        <endButton>\n            <Button\n                id="cancelButton"\n                text="{i18n>Button.Cancel}"\n                press="onCancel" />\n        </endButton>\n    </Dialog>\n</core:FragmentDefinition>',
	"sap/ushell/applications/PageComposer/view/EditDialog.fragment.xml":'<core:FragmentDefinition\n        xmlns="sap.m"\n        xmlns:core="sap.ui.core"\n        id="editDialogFragment">\n    <Dialog\n            id="editDialog"\n            title="{i18n>EditDialog.Title}"\n            type="Message"\n            afterClose=".destroy"\n            state="Warning">\n        <content>\n            <Text id="editMessage" text="{/message}" />\n\n            <core:ComponentContainer id="transportContainer" lifecycle="Application"/>\n        </content>\n\n        <beginButton>\n            <Button id="editSaveButton"\n                    text="{i18n>Button.Save}"\n                    press=".onConfirm"\n                    type="Emphasized"\n                    enabled="{ path: \'/validation\', formatter: \'.validate\' }" />\n        </beginButton>\n\n        <endButton>\n            <Button id="editCancelButton"\n                    text="{i18n>Button.Cancel}"\n                    press="onCancel" />\n        </endButton>\n    </Dialog>\n</core:FragmentDefinition>',
	"sap/ushell/applications/PageComposer/view/EditPageHeaderDialog.fragment.xml":'<core:FragmentDefinition\n    xmlns="sap.m"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:core="sap.ui.core"\n    core:require="{String: \'sap/ui/model/type/String\'}">\n    <Dialog  id="editPageHeaderDialog" title="{i18n>Button.EditHeader}"\n        beforeOpen=".onBeforeOpen" afterClose=".destroy">\n        <content>\n            <f:SimpleForm editable="true" id="editPageHeaderDialogForm">\n                <Label id="editPageHeaderDialogPageIdLabel" text="{i18n>Label.PageID}" required="true" />\n                <Input id="editPageHeaderDialogPageIdInput" editable="false" value="{/id}"/>\n                <Label id="editPageHeaderDialogPageDescriptionLabel" text="{i18n>Label.Description}" required="true" />\n                <Input id="editPageHeaderDialogPageDescriptionInput" maxLength="100"\n                   value="{ path: \'/description\', type: \'String\' }"\n                   liveChange=".onDescriptionLiveChange"\n                   valueLiveUpdate="true"\n                   valueStateText="{i18n>Message.EmptyDescription}"\n                   placeholder="{i18n>Placeholder.Description}" />\n                <Label id="editPageHeaderDialogPageTitleLabel" text="{i18n>Label.PageTitle}" required="true" />\n                <Input id="editPageHeaderDialogPageTitleInput" maxLength="100"\n                    value="{ path: \'/title\', type: \'String\' }"\n                    liveChange=".onTitleLiveChange"\n                    valueLiveUpdate="true"\n                    valueStateText="{i18n>Message.EmptyTitle}"\n                    placeholder="{i18n>Placeholder.PageTitle}" />\n            </f:SimpleForm>\n        </content>\n        <beginButton>\n            <Button id="editPageHeaderDialogConfirmButton"\n                    text="{i18n>Button.Ok}"\n                    press=".onConfirm"\n                    enabled="{ path: \'/validation\', formatter: \'.validate\' }"\n                    type="Emphasized" />\n        </beginButton>\n        <endButton>\n            <Button id="editPageHeaderDialogCancelButton" text="{i18n>Button.Cancel}" press=".onCancel" />\n        </endButton>\n    </Dialog>\n</core:FragmentDefinition>\n',
	"sap/ushell/applications/PageComposer/view/ErrorDialog.fragment.xml":'<core:FragmentDefinition\n        xmlns="sap.m"\n        xmlns:core="sap.ui.core"\n        id="errorDialogFragment">\n    <Dialog\n        id="errorDialog"\n        title="{i18n>ErrorDialog.Title}"\n        type="Message"\n        afterClose=".onAfterClose"\n        contentWidth="30rem"\n        state="Error">\n        <content>\n            <VBox id="errorDialogMessageWrapper">\n                <Text\n                    id="errorDialogMessageText"\n                    text="{/message}"\n                    class="sapUiSmallMarginBottom" />\n                <Link\n                    id="errorDialogMessageLink"\n                    text="{i18n>Button.ShowDetails}"\n                    visible="{=!${/showDetails}}"\n                    press=".onShowDetails" />\n            </VBox>\n            <VBox  id="errorDialogDetailsWrapper" visible="{/showDetails}">\n                <Text id="errorDialogResponseCodeText" text="{i18n>Label.ResponseCode} {/statusCode} - {/statusText}" class="sapUiSmallMarginBottom" />\n                <Text id="errorDialogDetailsText" text="{i18n>Label.Details}" />\n                <Text id="errorDialogDescriptionText" text="{/description}" renderWhitespace="true" />\n            </VBox>\n        </content>\n\n        <buttons>\n            <Button id="errorDialogButtonConfirm" text="{i18n>Button.Ok}" press=".onConfirm" />\n            <Button id="errorDialogButtonCopy" text="{i18n>Button.Copy}" press=".onCopy" />\n        </buttons>\n    </Dialog>\n</core:FragmentDefinition>',
	"sap/ushell/applications/PageComposer/view/ErrorPage.view.xml":'<mvc:View\n    controllerName="sap.ushell.applications.PageComposer.controller.ErrorPage"\n    height="100%"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m">\n    <MessagePage\n            id="messagePageError"\n            showHeader="false"\n            text="{i18n>ErrorPage.Message}"\n            icon="sap-icon://document">\n        <customDescription>\n            <Link text="{i18n>ErrorPage.Link}" press=".onLinkPress"/>\n        </customDescription>\n    </MessagePage>\n</mvc:View>\n',
	"sap/ushell/applications/PageComposer/view/Page.fragment.xml":'<core:FragmentDefinition\n    xmlns="sap.ushell.ui.launchpad"\n    xmlns:core="sap.ui.core"\n    xmlns:dnd="sap.ui.core.dnd"\n    id="pageFragment">\n    <Page\n        id="page"\n        edit="{/edit}"\n        enableSectionReordering="{/edit}"\n        sections="{/page/content/sections}"\n        sectionDrop=".Page.moveSection"\n        addSectionButtonPressed=".Page.addSection">\n        <sections>\n            <Section\n                id="pageSection"\n                class="sapContrastPlus"\n                editable="{/edit}"\n                enableAddButton="false"\n                enableGridBreakpoints="{= !${/edit}}"\n                enableResetButton="false"\n                enableShowHideButton="false"\n                enableVisualizationReordering="{/edit}"\n                title="{title}"\n                showNoVisualizationsText="true"\n                sizeBehavior="{viewSettings>/sizeBehavior}"\n                visualizations="{\n                    path: \'visualizations\',\n                    factory: \'.Page.visualizationFactory\',\n                    key: \'vizId\'\n                }"\n                delete=".Page.deleteSection"\n                titleChange=".collectPageMessages"\n                visualizationDrop=".Page.moveVisualization" />\n        </sections>\n        <dragDropConfig>\n            <dnd:DropInfo\n                groupName="Section"\n                targetAggregation="sections"\n                drop=".Page.addVisualization" />\n        </dragDropConfig>\n    </Page>\n</core:FragmentDefinition>\n',
	"sap/ushell/applications/PageComposer/view/PageDetail.view.xml":'<mvc:View\n    controllerName="sap.ushell.applications.PageComposer.controller.PageDetail"\n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:f="sap.f"\n    xmlns:mvc="sap.ui.core.mvc">\n    <f:DynamicPage\n        id="pageDetail"\n        fitContent="true"\n        class="sapUshellPageLayout sapUiNoContentPadding"\n        backgroundDesign="Transparent">\n        <f:title>\n            <f:DynamicPageTitle id="dynamicPageTitle">\n                <f:heading>\n                <HBox>\n                    <Title id="pageId" text="{/page/content/id}" />\n                     <ObjectStatus active="true" press=".onErrorMessageClicked"  visible="{= !${/page/content/editAllowed}}" class="sapUiSmallMarginBottom sapUiSmallMarginBegin" text="{i18n>Message.NotAssigned}" state="Warning" />\n                </HBox>\n                </f:heading>\n                <f:expandedContent>\n                    <HBox displayInline="true" id="hboxExpanded">\n                        <ObjectAttribute id="objectAttributeDescriptionExpanded" text="{/page/content/description}">\n                            <customData>\n                                <core:CustomData key="help-id" value="FLPPage-manage-PageDetail-Header" writeToDom="true" />\n                            </customData>\n                        </ObjectAttribute>\n                        <!-- TBD: make visible when the role ID is available -->\n                        <ObjectAttribute\n                            id="objectAttributeRoleExpanded"\n                            visible="false"\n                            title="{i18n>Label.AssignedRole}"\n                            text=""\n                            class="sapUiLargeMarginBegin" />\n                    </HBox>\n                </f:expandedContent>\n                <f:snappedContent>\n                    <HBox displayInline="true" id="hboxSnapped">\n                        <ObjectAttribute id="objectAttributePageIdSnapped" title="{i18n>Label.PageID}" text="{/page/content/id}" />\n                        <!-- TBD: make visible when the role ID is available -->\n                        <ObjectAttribute\n                            id="objectAttributeRoleSnapped"\n                            visible="false"\n                            title="{i18n>Label.AssignedRole}"\n                            text="assigned role"\n                            class="sapUiLargeMarginBegin" />\n                    </HBox>\n                </f:snappedContent>\n                <f:actions>\n                    <Button\n                        id="buttonCopy"\n                        text="{i18n>Button.Copy}"\n                        type="Transparent"\n                        press=".onCopy"\n                        visible="{SupportedOperationModel>/copySupported}">\n                        <customData>\n                            <core:CustomData key="help-id" value="FLPPage-manage-PageDetail-Button-CopyPage" writeToDom="true" />\n                        </customData>\n                    </Button>\n                    <Button\n                        id="buttonDelete"\n                        text="{i18n>Button.Delete}"\n                        type="Transparent"\n                        press=".onDelete"\n                        visible="{SupportedOperationModel>/deleteSupported}">\n                        <customData>\n                            <core:CustomData key="help-id" value="FLPPage-manage-PageDetail-Button-DeletePage" writeToDom="true" />\n                        </customData>\n                    </Button>\n                </f:actions>\n                <f:navigationActions>\n                    <Button\n                        id="buttonPreview"\n                        text="{i18n>Button.PagePreview}"\n                        type="Transparent"\n                        visible="{SupportedOperationModel>/previewSupported}"\n                        press=".preview">\n                        <customData>\n                            <core:CustomData key="help-id" value="FLPPage-manage-PageDetail-Button-PagePreview" writeToDom="true" />\n                        </customData>\n                    </Button>\n                </f:navigationActions>\n            </f:DynamicPageTitle>\n        </f:title>\n        <f:header>\n            <f:DynamicPageHeader id="dynamicPageHeader" pinnable="false">\n                <core:Fragment fragmentName="sap.ushell.applications.PageComposer.view.PageInfo" type="XML" />\n            </f:DynamicPageHeader>\n        </f:header>\n        <f:content>\n            <Panel\n                id="panel"\n                height="100%"\n                accessibleRole="Region"\n                backgroundDesign="Transparent"\n                class="sapUiNoContentPadding">\n                <customData>\n                    <core:CustomData key="help-id" value="FLPPage-manage-PageDetail-Panel-TileDisplay" writeToDom="true" />\n                </customData>\n                <headerToolbar>\n                    <OverflowToolbar id="layoutOverflowToolbar" design="Transparent" height="3rem" class="sapUshellPageLayoutHeader">\n                        <Title id="layoutTitle" class="sapContrastPlus" text="{i18n>Title.Layout}" />\n                        <ToolbarSpacer id="layoutToolbarSpacer" />\n                        <Button id="layoutButtonEdit" text="{i18n>Button.Edit}" enabled="{/page/content/editAllowed}" type="Emphasized" press=".onEdit" >\n                            <customData>\n                                <core:CustomData key="help-id" value="FLPPage-manage-PageDetail-Button-Edit" writeToDom="true" />\n                            </customData>\n                        </Button>\n                    </OverflowToolbar>\n                </headerToolbar>\n                <content>\n                    <core:Fragment fragmentName="sap.ushell.applications.PageComposer.view.Page" type="XML" />\n                </content>\n            </Panel>\n        </f:content>\n    </f:DynamicPage>\n</mvc:View>\n',
	"sap/ushell/applications/PageComposer/view/PageDetailEdit.view.xml":'<mvc:View\n    controllerName="sap.ushell.applications.PageComposer.controller.PageDetailEdit"\n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:l="sap.ui.layout"\n    xmlns:f="sap.f"\n    xmlns:mvc="sap.ui.core.mvc"\n    core:require="{ formatMessage: \'sap/base/strings/formatMessage\' }">\n    <f:DynamicPage\n        id="pageDetailEdit"\n        fitContent="true"\n        headerExpanded="{/headerExpanded}"\n        class="sapUshellPageLayout sapUiNoContentPadding">\n        <f:title>\n            <f:DynamicPageTitle id="dynamicPageTitle">\n                <f:heading>\n                    <Title id="pageId" text="{/page/content/id}" />\n                </f:heading>\n                <f:expandedContent>\n                    <HBox displayInline="true" id="hboxExpanded">\n                        <ObjectAttribute id="objectAttributeDescriptionExpanded" text="{/page/content/description}" />\n                        <!-- TBD: make visible when the role ID is available -->\n                        <ObjectAttribute\n                            id="objectAttributeRoleExpanded"\n                            visible="false"\n                            title="{i18n>Label.AssignedRole}"\n                            text=""\n                            class="sapUiLargeMarginBegin" />\n                    </HBox>\n                </f:expandedContent>\n                <f:snappedContent>\n                    <!-- Maximize working area when the header is snapped -->\n                </f:snappedContent>\n                <f:actions>\n                    <Button\n                        id="buttonEditHeader"\n                        text="{i18n>Button.EditHeader}"\n                        type="Transparent"\n                        press=".openEditPageHeaderDialog">\n                        <customData>\n                            <core:CustomData key="help-id" value="FLPPage-manage-PageDetailEdit-Button-EditHeader" writeToDom="true"/>\n                        </customData>\n                    </Button>\n                </f:actions>\n                <f:navigationActions>\n                    <Button\n                        id="buttonPreview"\n                        text="{i18n>Button.PagePreview}"\n                        type="Transparent"\n                        visible="{SupportedOperationModel>/previewSupported}"\n                        press=".preview">\n                        <customData>\n                            <core:CustomData key="help-id" value="FLPPage-manage-PageDetailEdit-Button-PagePreview" writeToDom="true"/>\n                        </customData>\n                    </Button>\n                </f:navigationActions>\n            </f:DynamicPageTitle>\n        </f:title>\n        <f:header>\n            <f:DynamicPageHeader id="dynamicPageHeader" pinnable="false">\n                <core:Fragment fragmentName="sap.ushell.applications.PageComposer.view.PageInfo" type="XML"/>\n            </f:DynamicPageHeader>\n        </f:header>\n        <f:content>\n            <l:DynamicSideContent\n                id="layoutContent"\n                sideContentFallDown="BelowM"\n                sideContentPosition="End"\n                containerQuery="true"\n                showSideContent="{/catalogsExpanded}">\n                <l:mainContent>\n                    <Panel\n                        id="panel"\n                        height="100%"\n                        accessibleRole="Region"\n                        backgroundDesign="Transparent"\n                        class="sapUiNoContentPadding">\n                        <headerToolbar>\n                            <OverflowToolbar id="layoutHeader" design="Transparent" height="3rem" class="sapUshellPageLayoutHeader">\n                                <Title text="{i18n>Title.Layout}" id="layoutTitle" />\n                                <Button\n                                    id="layoutButtonMessage"\n                                    icon="sap-icon://message-popup"\n                                    visible="{= !!(${/messages}.length) }"\n                                    tooltip="{\n                                        parts: [\'i18n>Button.Issues\', { path: \'/messages\', formatter: \'._formatLength\' } ],\n                                        formatter: \'formatMessage\'\n                                    }"\n                                    text="{= ${/messages}.length }"\n                                    type="Emphasized"\n                                    press=".handleMessagePopoverPress">\n                                    <customData>\n                                        <core:CustomData key="help-id" value="FLPPage-manage-PageDetailEdit-Button-ErrorMessage" writeToDom="true"/>\n                                    </customData>\n                                </Button>\n                                <ToolbarSpacer id="layoutHeaderSpacer" />\n                                <Button id="layoutButtonSave" text="{i18n>Button.Save}" type="Emphasized" press=".onSave" enabled="{/dirtyPage}">\n                                    <customData>\n                                        <core:CustomData key="help-id" value="FLPPage-manage-PageDetailEdit-Button-Save" writeToDom="true"/>\n                                    </customData>\n                                </Button>\n                                <Button id="layoutButtonCancel" text="{i18n>Button.Cancel}" type="Transparent" press=".onCancel">\n                                    <customData>\n                                        <core:CustomData key="help-id" value="FLPPage-manage-PageDetailEdit-Button-Cancel" writeToDom="true"/>\n                                    </customData>\n                                </Button>\n                                <Button\n                                        id="contextSelectorButton"\n                                        text="{\n                                            parts:[\'i18n>Button.ContextSelector\', \'roles>/activeRoleContextInfo\'],\n                                            formatter: \'formatMessage\'}"\n                                        type="Transparent"\n                                        press=".onOpenContextSelector">\n                                    <customData>\n                                        <core:CustomData\n                                                key="help-id"\n                                                value="FLPPage-manage-PageDetailEdit-Button-OpenContextSelector"\n                                                writeToDom="true"/>\n                                    </customData>\n                                </Button>\n                                <Button\n                                    id="toggleCatalogsButton"\n                                    press=".onUpdateSideContentVisibility"\n                                    text = "{= ${/catalogsExpanded} ? ${i18n>Button.HideCatalogs} : ${i18n>Button.ShowCatalogs}}"\n                                    type="Transparent">\n                                    <customData>\n                                        <core:CustomData key="help-id" value="FLPPage-manage-PageDetailEdit-Button-ShowCatalog" writeToDom="true"/>\n                                    </customData>\n                                </Button>\n                            </OverflowToolbar>\n                        </headerToolbar>\n                        <content>\n                            <core:Fragment fragmentName="sap.ushell.applications.PageComposer.view.Page" type="XML" />\n                        </content>\n                    </Panel>\n                </l:mainContent>\n                <l:sideContent>\n                    <core:Fragment fragmentName="sap.ushell.applications.PageComposer.view.TileSelector" type="XML" />\n                </l:sideContent>\n            </l:DynamicSideContent>\n        </f:content>\n    </f:DynamicPage>\n</mvc:View>\n',
	"sap/ushell/applications/PageComposer/view/PageInfo.fragment.xml":'<core:FragmentDefinition\n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    id="pageInfoFragment">\n    <HeaderContainer id="pageInfoHeaderContainer">\n        <VBox id="pageInfoTitleWrapper">\n            <ObjectAttribute\n                id="pageInfoTitle"\n                title="{i18n>Label.PageTitle}"\n                text="{/page/content/title}" />\n        </VBox>\n        <VBox visible="{/transportSupported}" id="pageInfoMetadataTransportWrapper">\n            <ObjectAttribute\n                id="pageInfoPackage"\n                title="{i18n>Label.Package}"\n                text="{/page/metadata/devclass}" />\n            <ObjectAttribute\n                id="pageInfoWorkbenchRequest"\n                title="{i18n>Label.WorkbenchRequest}"\n                text="{/page/metadata/transportId}"\n                visible="{=!!${/page/metadata/transportId}}" />\n        </VBox>\n        <VBox id="pageInfoMetadataCreatedWrapper">\n            <ObjectAttribute\n                id="pageInfoCreatedByFullname"\n                title="{i18n>Label.CreatedByFullname}"\n                text="{/page/content/createdByFullname}" />\n            <ObjectAttribute\n                id="pageInfoCreatedOn"\n                title="{i18n>Label.CreatedOn}"\n                text="{\n                    path: \'/page/content/createdOn\',\n                    type: \'sap.ui.model.type.Date\',\n                    formatOptions: {style: \'medium\'}\n                }" />\n        </VBox>\n        <VBox id="pageInfoMetadataModifiedWrapper">\n            <ObjectAttribute\n                id="pageInfoModifiedByFullname"\n                title="{i18n>Label.ChangedByFullname}"\n                text="{/page/content/modifiedByFullname}" />\n            <ObjectAttribute\n                id="pageInfoModifiedOn"\n                title="{i18n>Label.ChangedOn}"\n                text="{\n                    path: \'/page/content/modifiedOn\',\n                    type: \'sap.ui.model.type.Date\',\n                    formatOptions: {style: \'medium\'}\n                }" />\n        </VBox>\n    </HeaderContainer>\n</core:FragmentDefinition>\n',
	"sap/ushell/applications/PageComposer/view/PageOverview.view.xml":'<mvc:View\n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:mvc="sap.ui.core.mvc"\n    height="100%"\n    controllerName="sap.ushell.applications.PageComposer.controller.PageOverview">\n    <Page id="pageOverviewPage">\n        <customHeader>\n            <Bar id="titlebar">\n                <contentLeft>\n                    <Title id="title" text="{i18n>PageOverview.Title}" class="sapUiMediumMarginBegin">\n                        <customData>\n                            <core:CustomData key="help-id" value="FLPPage-manage-PageOverview-Header" writeToDom="true" />\n                        </customData>\n                    </Title>\n                </contentLeft>\n            </Bar>\n        </customHeader>\n        <content>\n            <Table\n                class="sapUiMediumMarginBeginEnd sapUiTinyMarginTopBottom sapUiForceWidthAuto"\n                id="table"\n                ariaLabelledBy="title"\n                busy="{/busy}"\n                items="{\n                    path: \'/pages\',\n                    key: \'id\',\n                    sorter: {\n                        path : \'content/modifiedOn\',\n                        descending: \'true\'\n                    }\n                }"\n                itemPress=".onItemPress"\n                selectionChange=".onSelectionChange"\n                updateFinished=".onTableUpdate"\n                mode="SingleSelectLeft"\n                sticky="ColumnHeaders"\n                noDataText="{i18n>Message.NoPages}">\n                <headerToolbar>\n                    <OverflowToolbar design="Solid" id="overflowToolbar">\n                        <ToolbarSpacer id="toolbarSpacer"/>\n                        <SearchField\n                            id="searchField"\n                            showRefreshButton="false"\n                            tooltip="{i18n>Tooltip.Search}"\n                            search=".onSearch"\n                            width="auto">\n                        </SearchField>\n                        <Button\n                            id="addButton"\n                            text="{i18n>Button.Create}"\n                            type="Transparent"\n                            visible="{SupportedOperationModel>/createSupported}"\n                            press=".onAdd">\n                            <customData>\n                                <core:CustomData key="help-id" value="FLPPage-manage-PageOverview-Button-Create" writeToDom="true" />\n                            </customData>\n                        </Button>\n                        <Button\n                            id="copyButton"\n                            text="{i18n>Button.Copy}"\n                            type="Transparent"\n                            enabled="{buttonStates>/isDeleteAndCopyEnabled}"\n                            visible="{SupportedOperationModel>/copySupported}"\n                            press=".onCopy">\n                            <customData>\n                                <core:CustomData key="help-id" value="LaunchpadPage-compose-PageOverview-Button-Copy" writeToDom="true" />\n                            </customData>\n                        </Button>\n                        <Button\n                            id="deleteButton"\n                            text="{i18n>Button.Delete}"\n                            type="Transparent"\n                            enabled="{buttonStates>/isDeleteAndCopyEnabled}"\n                            visible="{SupportedOperationModel>/deleteSupported}"\n                            press=".onDelete">\n                            <customData>\n                                <core:CustomData key="help-id" value="FLPPage-manage-PageOverview-Button-Delete" writeToDom="true" />\n                            </customData>\n                        </Button>\n                        <Button\n                            id="sortButton"\n                            tooltip="{i18n>Tooltip.SortSettingsButton}"\n                            icon="sap-icon://sort"\n                            type="Transparent"\n                            press=".showViewSettingsDialog(\'sort\')" />\n                        <Button\n                            id="filterButton"\n                            tooltip="{i18n>Tooltip.FilterSettingsButton}"\n                            icon="sap-icon://filter"\n                            type="Transparent"\n                            press=".showViewSettingsDialog(\'filter\')" />\n                        <Button\n                            id="groupButton"\n                            tooltip="{i18n>Tooltip.GroupSettingsButton}"\n                            icon="sap-icon://group-2"\n                            type="Transparent"\n                            press=".showViewSettingsDialog(\'group\')" />\n                    </OverflowToolbar>\n                </headerToolbar>\n                <infoToolbar>\n                    <OverflowToolbar id="infoFilterBar" visible="false">\n                        <Text id="infoFilterLabel" />\n                    </OverflowToolbar>\n                </infoToolbar>\n                <columns>\n                    <Column id="columnPageId">\n                        <ObjectIdentifier title="{i18n>Column.PageID}" text="{i18n>Column.PageDescription}" />\n                    </Column>\n                    <Column id="columnPageTitle">\n                        <Text id="columnTextPageTitle" text="{i18n>Column.PageTitle}" />\n                    </Column>\n                    <Column id="columnPageAssignmentStatus" width="12%">\n                        <Text id="columnTextPageAssignmentStatus" text="{i18n>Column.PageAssignmentStatus}" />\n                    </Column>\n                    <Column id="columnPageTransport" width="12%" visible="{/transportSupported}">\n                        <ObjectIdentifier title="{i18n>Column.PagePackage}" text="{i18n>Column.PageWorkbenchRequest}" />\n                    </Column>\n                    <Column id="columnPageCreated" width="12%">\n                        <ObjectIdentifier title="{i18n>Column.PageCreatedBy}" text="{i18n>Column.PageCreatedOn}" />\n                    </Column>\n                    <Column id="columnPageChanged" width="12%">\n                        <ObjectIdentifier title="{i18n>Column.PageChangedBy}" text="{i18n>Column.PageChangedOn}" />\n                    </Column>\n                    <Column id="columnEnd" width="4%" hAlign="End" />\n                </columns>\n                <items>\n                    <ColumnListItem id="columnListItemPage" type="Navigation">\n                        <cells>\n                            <ObjectIdentifier id="objectIdentifierPageId" title="{content/id}" text="{content/description}" />\n                        </cells>\n                        <cells>\n                            <Text id="cellTextPageTitle" text="{content/title}" />\n                        </cells>\n                        <cells>\n                            <ObjectStatus press="onErrorMessageClicked" text="{=${content/editAllowed} ? ${i18n>Message.StatusAssigned} : ${i18n>Message.NotAssigned} }" active="true" state="{=${content/editAllowed}? \'Success\' : \'Warning\'}" />\n                        </cells>\n                        <cells>\n                            <ObjectIdentifier id="cellTextPageTransport" title="{metadata/devclass}" text="{metadata/transportId}" />\n                        </cells>\n                        <cells>\n                            <ObjectIdentifier\n                                id="cellTextPageCreated"\n                                title="{content/createdByFullname}"\n                                text="{\n                                    path: \'content/createdOn\',\n                                    type: \'sap.ui.model.type.Date\',\n                                    formatOptions: { style: \'medium\' }\n                                }" />\n                        </cells>\n                        <cells>\n                            <ObjectIdentifier\n                                id="cellTextPageChanged"\n                                title="{content/modifiedByFullname}"\n                                text="{\n                                    path: \'content/modifiedOn\',\n                                    type: \'sap.ui.model.type.Date\',\n                                    formatOptions: { style: \'medium\' }\n                                }" />\n                        </cells>\n                        <cells>\n                            <Button id="cellButtonPageEdit"\n                                    press=".onEdit"\n                                    icon="sap-icon://edit"\n                                    tooltip="{i18n>Button.Edit}"\n                                    enabled= "{content/editAllowed}"\n                                    type="Transparent" />\n                        </cells>\n                    </ColumnListItem>\n                </items>\n            </Table>\n        </content>\n    </Page>\n</mvc:View>\n',
	"sap/ushell/applications/PageComposer/view/PagePreviewDialog.fragment.xml":'<core:FragmentDefinition\n    xmlns="sap.ushell.ui.launchpad"\n    xmlns:core="sap.ui.core"\n    xmlns:m="sap.m"\n    core:require="{\n        formatMessage: \'sap/base/strings/formatMessage\'\n    }">\n    <m:Dialog\n            id="pagePreviewDialog"\n            title="{\n                parts: [\'i18n>PagePreviewDialog.title\', \'/page/content/title\'],\n                formatter: \'formatMessage\'\n            }"\n            contentWidth="100%"\n            contentHeight="100%">\n        <m:content>\n            <Page\n                id="pagePreview"\n                sections="{/page/content/sections}">\n                <sections>\n                    <Section\n                        id="pagePreviewSection"\n                        class="sapContrastPlus"\n                        enableGridBreakpoints="true"\n                        title="{title}"\n                        showNoVisualizationsText="true"\n                        sizeBehavior="{viewSettings>/sizeBehavior}"\n                        visualizations="{\n                            path: \'visualizations\',\n                            factory: \'.visualizationFactory\',\n                            key: \'vizId\'\n                        }" />\n                </sections>\n            </Page>\n        </m:content>\n        <m:endButton>\n            <m:Button id="previewCloseButton" text="{i18n>Button.ClosePreview}" press=".close" />\n        </m:endButton>\n    </m:Dialog>\n</core:FragmentDefinition>\n',
	"sap/ushell/applications/PageComposer/view/TileInfoPopover.fragment.xml":'<core:FragmentDefinition\n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:formLayout="sap.ui.layout.form">\n    <ResponsivePopover id="tileInfoPopover" showHeader="false" placement="HorizontalPreferredLeft">\n        <formLayout:SimpleForm id="info" title="{title}" layout="ResponsiveGridLayout" editable="false">\n            <formLayout:content>\n                <Label id="subtitleLabel" visible="{= !!${subTitle}}" text="{i18n>TileInfoPopover.Label.Subtitle}" />\n                <Text id="subtitle" visible="{= !!${subTitle}}" text="{subTitle}" />\n\n                <Label id="iconLabel" visible="{= !!${iconUrl}}" text="{i18n>TileInfoPopover.Label.Icon}" />\n                <core:Icon id="icon" visible="{= !!${iconUrl}}" src="{= ${iconUrl} ? ${iconUrl} : \'sap-icon://border\'}" size="1.5rem" width="1.5rem" />\n\n                <Label id="semanticObjectLabel" visible="{= !!${semanticObject}}" text="{i18n>TileInfoPopover.Label.SemanticObject}" />\n                <Text id="semanticObject" visible="{= !!${semanticObject}}" text="{semanticObject}" />\n\n                <Label id="semanticActionLabel" visible="{= !!${semanticAction}}" text="{i18n>TileInfoPopover.Label.SemanticAction}" />\n                <Text id="semanticAction" visible="{= !!${semanticAction}}" text="{semanticAction}" />\n\n                <Label id="fioriIDLabel" visible="{= !!${fioriId}}" text="{i18n>TileInfoPopover.Label.FioriID}" />\n                <Text id="fioriID" visible="{= !!${fioriId}}" text="{fioriId}" />\n\n                <Label id="appDetailLabel" visible="{= !!${appDetail}}" text="{i18n>TileInfoPopover.Label.AppDetail}" />\n                <Text id="appDetail" visible="{= !!${appDetail}}" text="{appDetail}" />\n\n                <Label id="appTypeLabel" visible="{= !!${appType}}" text="{i18n>TileInfoPopover.Label.AppType}" />\n                <Text id="appType" visible="{= !!${appType}}" text="{appType}" />\n\n                <Label id="tileTypeLabel" visible="{= !!${tileType}}" text="{i18n>TileInfoPopover.Label.TileType}" />\n                <Text id="tileType" visible="{= !!${tileType}}" text="{\n                    path: \'tileType\',\n                    formatter: \'._formatTileType\'\n                }" />\n\n                <Label id="deviceWrapperLabel" visible="{= !!${deviceDesktop} || !!${deviceTablet} || !!${devicePhone}}" text="{i18n>TileInfoPopover.Label.AvailableDevices}" />\n                <HBox id="deviceWrapper" visible="{= !!${deviceDesktop} || !!${deviceTablet} || !!${devicePhone}}" justifyContent="SpaceAround">\n                    <core:Icon id="deviceDesktop" visible="{= !!${deviceDesktop}}" src="sap-icon://laptop" tooltip="{i18n>Tooltip.Desktop}" />\n                    <core:Icon id="deviceTablet" visible="{= !!${deviceTablet}}" src="sap-icon://ipad-2" />\n                    <core:Icon id="devicePhone" visible="{= !!${devicePhone}}" src="sap-icon://iphone" />\n                </HBox>\n            </formLayout:content>\n        </formLayout:SimpleForm>\n    </ResponsivePopover>\n</core:FragmentDefinition>\n',
	"sap/ushell/applications/PageComposer/view/TileSelector.fragment.xml":'<Panel\n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:dnd="sap.ui.core.dnd"\n    id="tileSelector"\n    height="100%"\n    accessibleRole="Region"\n    backgroundDesign="Transparent"\n    class="sapUiNoContentPadding"\n    core:require="{formatMessage: \'sap/base/strings/formatMessage\'}">\n    <customData><core:CustomData key="help-id" value="FLPPage-manage-TileSelector-Panel-TileSelector" writeToDom="true"/></customData>\n    <layoutData><FlexItemData growFactor="1" /></layoutData> <!-- workaround for fragment used inside of a flex container -->\n    <headerToolbar>\n        <OverflowToolbar id="tileSelectorToolbar" design="Transparent" height="3rem">\n            <SearchField\n                id="tileSelectorSearchField"\n                showRefreshButton="false"\n                width="auto"\n                value="{/searchText}"\n                tooltip="{i18n>Tooltip.SearchForTiles}"\n                placeholder="{i18n>Placeholder.SearchForTiles}"\n                search=".TileSelector.onSearchTiles" />\n            <ToolbarSpacer />\n            <Button\n                id="tileSelectorAddButton"\n                text="{i18n>Button.Add}"\n                type="Transparent"\n                press=".TileSelector.onAddTiles">\n                <customData><core:CustomData key="help-id" value="FLPPage-manage-TileSelector-Button-Add" writeToDom="true"/></customData>\n            </Button>\n            <OverflowToolbarButton\n                id="tileSelectorSortButton"\n                icon="sap-icon://sort"\n                text="{i18n>Button.SortCatalogs}"\n                tooltip="{i18n>Button.SortCatalogs}"\n                press=".TileSelector.onSortCatalogsToggle" />\n            <OverflowToolbarButton\n                id="tileSelectorCollapseButton"\n                icon="sap-icon://collapse-all"\n                text="{i18n>Button.CollapseCatalogs}"\n                tooltip="{i18n>Button.CollapseCatalogs}"\n                press=".TileSelector.onCollapseAllCatalogs" />\n            <OverflowToolbarButton\n                id="tileSelectorExpandButton"\n                icon="sap-icon://expand-all"\n                text="{i18n>Button.ExpandCatalogs}"\n                tooltip="{i18n>Button.ExpandCatalogs}"\n                press=".TileSelector.onExpandAllCatalogs" />\n        </OverflowToolbar>\n    </headerToolbar>\n    <content>\n        <Tree\n            id="tileSelectorList"\n            mode="MultiSelect"\n            modeAnimationOn="false"\n            noDataText="{i18n>Message.NoTiles}"\n            items="{ path: \'/catalogs\', key: \'vizId\' }"\n            itemPress=".TileSelector.onCatalogItemPress">\n            <infoToolbar>\n                <Toolbar\n                        id="roleContextInfoToolbar"\n                        visible="{=!!${roles>/showRoleContextInfo}}"\n                        active="true"\n                        press=".onOpenContextSelector">\n                    <Label id="roleContextInfo"\n                           text="{i18n>Message.RoleContext}"/>\n                </Toolbar>\n            </infoToolbar>\n            <items>\n                <CustomTreeItem\n                    id="tileSelectorCustomTreeItem"\n                    class="sapUshellTileSelectorListItem"\n                    type="{= ${catalogTitle} ? \'Active\' : \'Inactive\'}"> <!-- only catalogs should fire "onCatalogItemPress" -->\n                    <HBox id="tileSelectorHbox1" alignItems="Center" width="100%" class="sapUiTinyMargin">\n                        <!-- TODO: do not display tile icon until specification is ready -->\n                        <!-- <core:Icon visible="{= !${catalogTitle}}" src="{= ${iconUrl} ? ${iconUrl} : \'sap-icon://border\'}" size="1.5rem" width="1.5rem" class="sapUiSmallMarginBeginEnd" /> -->\n                        <VBox width="0" id="tileSelectorVbox1">\n                            <layoutData><FlexItemData growFactor="1" /></layoutData>\n                            <Title id="tileSelectorCatalogTitle" visible="{= !!${catalogTitle}}" text="{catalogTitle}" wrapping="true" />\n                            <Title id="tileSelectorTileTitle" visible="{= !!${title}}" text="{title}" wrapping="true" />\n                            <Text id="tileSelectorTileSubtitle" visible="{= !!${subTitle}}" text="{subTitle}" />\n                        </VBox>\n                        <Button\n                            id="tileSelectorTileButtonInfo"\n                            visible="{= !${catalogTitle}}"\n                            icon="sap-icon://hint"\n                            type="Transparent"\n                            press=".onOpenTileInfo" />\n                        <Button\n                            id="tileSelectorTileButtonAdd"\n                            visible="{= !${catalogTitle}}"\n                            text="{i18n>Button.Add}"\n                            type="Transparent"\n                            press=".TileSelector.onAddTiles" />\n                    </HBox>\n                </CustomTreeItem>\n            </items>\n            <dragDropConfig>\n                <dnd:DragInfo\n                    groupName="Section"\n                    sourceAggregation="items"\n                    dragStart=".TileSelector.onDragStart" />\n            </dragDropConfig>\n        </Tree>\n    </content>\n</Panel>\n',
	"sap/ushell/applications/PageComposer/view/ViewSettingsDialog.fragment.xml":'<core:FragmentDefinition\n    xmlns="sap.m"\n    xmlns:core="sap.ui.core">\n    <ViewSettingsDialog\n        id="viewSettingsDialog"\n        sortDescending="true"\n        confirm=".handleDialogConfirm"\n        cancel=".handleCancel"\n        resetFilters=".handleResetFilters">\n        <sortItems>\n            <ViewSettingsItem id="IDSort" text="{i18n>Column.PageID}" key="content/id" />\n            <ViewSettingsItem id="DescriptionSort" text="{i18n>Column.PageDescription}" key="content/description" />\n            <ViewSettingsItem id="TitleSort" text="{i18n>Column.PageTitle}" key="content/title" />\n            <ViewSettingsItem id="AssignmentSort" text="{i18n>Column.PageAssignmentStatus}" key="content/editAllowed" />\n            <ViewSettingsItem id="PackageSort" text="{i18n>Column.PagePackage}" key="metadata/devclass" />\n            <ViewSettingsItem id="WorkbenchRequestSort" text="{i18n>Column.PageWorkbenchRequest}" key="metadata/transportId" />\n            <ViewSettingsItem id="CreatedBySort" text="{i18n>Column.PageCreatedBy}" key="content/createdByFullname" />\n            <ViewSettingsItem id="CreatedOnSort" text="{i18n>Column.PageCreatedOn}" key="content/createdOn" />\n            <ViewSettingsItem id="ChangedBySort" text="{i18n>Column.PageChangedBy}" key="content/modifiedByFullname" />\n            <ViewSettingsItem id="ChangedOnSort" text="{i18n>Column.PageChangedOn}" key="content/modifiedOn" selected="true" />\n        </sortItems>\n        <filterItems>\n            <ViewSettingsFilterItem\n                id="AssignmentFilter"\n                text="{i18n>Column.PageAssignmentStatus}"\n                key="uniqueValues>key"\n                multiSelect="false"\n                items="{\n                    path: \'uniqueValues>/editAllowed\',\n                    key: \'id\'\n                }">\n                <items>\n                    <ViewSettingsItem\n                        text="{= ${uniqueValues>key} ? ${i18n>Message.StatusAssigned} : ${i18n>Message.NotAssigned} }"\n                        key="content/editAllowed___EQ___{uniqueValues>key}"\n                    />\n                </items>\n            </ViewSettingsFilterItem>\n            <ViewSettingsFilterItem\n                id="PackageFilter"\n                text="{i18n>Column.PagePackage}"\n                key="uniqueValues>key"\n                multiSelect="false"\n                items="{\n                    path: \'uniqueValues>/devclass\',\n                    key: \'id\'\n                }">\n                <items>\n                    <ViewSettingsItem\n                        text="{uniqueValues>key}"\n                        key="metadata/devclass___EQ___{uniqueValues>key}"\n                    />\n                </items>\n            </ViewSettingsFilterItem>\n            <ViewSettingsFilterItem\n                id="WorkbenchRequestFilter"\n                text="{i18n>Column.PageWorkbenchRequest}"\n                key="uniqueValues>key"\n                multiSelect="false"\n                items="{\n                    path: \'uniqueValues>/transportId\',\n                    key: \'id\'\n                }">\n                <items>\n                    <ViewSettingsItem\n                        text="{uniqueValues>key}"\n                        key="metadata/transportId___EQ___{uniqueValues>key}"\n                    />\n                </items>\n            </ViewSettingsFilterItem>\n            <ViewSettingsFilterItem\n                id="CreatedByFilter"\n                text="{i18n>Column.PageCreatedBy}"\n                key="uniqueValues>key"\n                multiSelect="false"\n                items="{\n                    path: \'uniqueValues>/createdByFullname\',\n                    key: \'id\'\n                }">\n                <items>\n                    <ViewSettingsItem\n                        text="{uniqueValues>key}"\n                        key="content/createdByFullname___EQ___{uniqueValues>key}"\n                    />\n                </items>\n            </ViewSettingsFilterItem>\n            <ViewSettingsCustomItem\n                id="CreatedOnFilter"\n                text="{i18n>Column.PageCreatedOn}"\n                key="content/createdOn">\n                <customControl>\n                    <DateRangeSelection\n                        id="CreatedOnDateRangeSelection"\n                        change=".handleDateRangeSelectionChanged"\n                    />\n                </customControl>\n            </ViewSettingsCustomItem>\n            <ViewSettingsFilterItem\n                id="ChangedByFilter"\n                text="{i18n>Column.PageChangedBy}"\n                key="uniqueValues>key"\n                multiSelect="false"\n                items="{\n                    path: \'uniqueValues>/modifiedByFullname\',\n                    key: \'id\'\n                }">\n                <items>\n                    <ViewSettingsItem\n                        text="{uniqueValues>key}"\n                        key="content/modifiedByFullname___EQ___{uniqueValues>key}"\n                    />\n                </items>\n            </ViewSettingsFilterItem>\n            <ViewSettingsCustomItem\n                id="ChangedOnFilter"\n                text="{i18n>Column.PageChangedOn}"\n                key="content/modifiedOn">\n                <customControl>\n                    <DateRangeSelection\n                        id="ChangedOnDateRangeSelection"\n                        change=".handleDateRangeSelectionChanged"\n                    />\n                </customControl>\n            </ViewSettingsCustomItem>\n        </filterItems>\n        <groupItems>\n            <ViewSettingsItem id="AssignmentGroup" text="{i18n>Column.PageAssignmentStatus}" key="content/editAllowed" />\n            <ViewSettingsItem id="PackageGroup" text="{i18n>Column.PagePackage}" key="metadata/devclass" />\n            <ViewSettingsItem id="WorkbenchRequestGroup" text="{i18n>Column.PageWorkbenchRequest}" key="metadata/transportId" />\n            <ViewSettingsItem id="CreatedByGroup" text="{i18n>Column.PageCreatedBy}" key="content/createdByFullname" />\n            <ViewSettingsItem id="CreatedOnGroup" text="{i18n>Column.PageCreatedOn}" key="content/createdOn" />\n            <ViewSettingsItem id="ChangedByGroup" text="{i18n>Column.PageChangedBy}" key="content/modifiedByFullname" />\n            <ViewSettingsItem id="ChangedOnGroup" text="{i18n>Column.PageChangedOn}" key="content/modifiedOn" />\n        </groupItems>\n    </ViewSettingsDialog>\n</core:FragmentDefinition>'
},"Component-preload"
);
