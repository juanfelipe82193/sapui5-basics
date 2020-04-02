//Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview PageRuntime controller for PageRuntime view
 *
 * @version 1.74.0
 */

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/GenericTile",
    "sap/ushell/resources",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Config",
    "sap/ushell/components/pages/formatter/PageRuntimeFormatter",
    "sap/m/library",
    "sap/m/MessageToast",
    "sap/ushell/components/pages/StateManager",
    "sap/base/util/ObjectPath",
    "sap/ushell/EventHub",
    "sap/base/Log",
    "sap/ushell/utils"
], function (Controller, GenericTile, resources, JSONModel, Config, PageRuntimeFormatter, library, MessageToast, oStateManager, ObjectPath, EventHub, Log, oUtils) {
    "use strict";

    /**
     * Controller of the PagesRuntime view.
     * It is responsible for navigating between different pages and combines the
     * Pages service (@see sap.ushell.services.Pages) with the
     * VisualizationLoading service (@see sap.ushell.services.VisualizationLoading) to create
     * the content area of the Fiori Launchpad.
     *
     * @param {string} sId Controller id
     * @param {object} oParams Controller parameters
     *
     * @class
     * @extends sap.ui.core.mvc.Controller
     *
     * @private
     * @since 1.72.0
     * @alias sap.ushell.components.pages.controller.Pages
     */
    return Controller.extend("sap.ushell.components.pages.controller.Pages", /** @lends sap.ushell.components.pages.controller.Pages.prototype */ {
        formatter: PageRuntimeFormatter,

        /**
         * UI5 lifecycle method which is called upon controller initialization.
         * It gets all the required UShell services and sets the Pages service
         * model to the view. It also sets a separate model to the view which includes
         * some settings which change the view behavior.
         *
         * @private
         * @since 1.72.0
         */
        onInit: function () {
            this._oVisualizationLoadingService = sap.ushell.Container.getServiceAsync("VisualizationLoading");
            this._oPagesService = sap.ushell.Container.getServiceAsync("Pages");
            this._oURLParsingService = sap.ushell.Container.getServiceAsync("URLParsing");

            this._oViewSettingsModel = new JSONModel({
                sizeBehavior: Config.last("/core/home/sizeBehavior"),
                actionModeActive: false
            });
            this.getView().setModel(this._oViewSettingsModel, "viewSettings");

            this._aConfigListeners = Config.on("/core/home/sizeBehavior").do(function (sSizeBehavior) {
                this._oViewSettingsModel.setProperty("/sizeBehavior", sSizeBehavior);
            }.bind(this));

            this._oErrorPageModel = new JSONModel({
                icon: "sap-icon://documents",
                text: "",
                description: "",
                details: ""
            });
            this.getView().setModel(this._oErrorPageModel, "errorPage");

            this._oPagesService.then(function (oPagesService) {
                this.getView().setModel(oPagesService.getModel());
            }.bind(this));

            this.sCurrentTargetPageId = "";
            this._openFLPPage();

            this.oContainerRouter = sap.ushell.Container.getRenderer().getRouter();
            this.oContainerRouter.getRoute("home").attachMatched(this._openFLPPage, this);
            this.oContainerRouter.getRoute("openFLPPage").attachMatched(this._openFLPPage, this);

            this.oErrorPage = this.byId("errorPage");
            this.oPagesNavContainer = this.byId("pagesNavContainer");
            this.oPagesRuntimeNavContainer = this.byId("pagesRuntimeNavContainer");
            // Handles the states(visible/invisible, active/inactive) of the visualizations
            oStateManager.init(this.oPagesRuntimeNavContainer, this.oPagesNavContainer);

            this.oEventHubListener = EventHub.once("PagesRuntimeRendered").do(function () {
                if (Config.last("/core/shell/enablePersonalization")) {
                    this._createActionModeButton();
                }
            }.bind(this));
        },

        /**
         * Gets the url parameters and returns the spaceId and pageId of the target page.
         *
         * @returns {Promise<object>} Resolves to an object contains the pageId and spaceId
         *
         * @private
         * @since 1.72.0
         */
        _getPageAndSpaceId: function () {
            return this._oURLParsingService.then(function (urlParsingService) {
                var oHash = urlParsingService.parseShellHash(window.hasher.getHash());
                var oIntent = {
                    semanticObject: oHash.semanticObject || "",
                    action: oHash.action || ""
                };
                var oHashPartsParams = oHash.params || {};
                var aPageId = oHashPartsParams.pageId || [];
                var aSpaceId = oHashPartsParams.spaceId || [];


               return this._parsePageAndSpaceId(aPageId, aSpaceId, oIntent);
            }.bind(this));
        },

        /**
         * Parses the given spaceId and pageId. When there are no pageId and spaceId given but the intent is Shell-home,
         * returns the spaceId and pageId of the default page. When there is no pageId and spaceId, only a pageId or a
         * spaceId, or more than one pageId or spaceId given, returns a rejected promise with an error message.
         *
         * @param {array} pageId An array that contains the page id of the page which should be displayed
         * @param {array} spaceId An array that contains the space id of the page which should be displayed
         * @param {object} intent An object that contains the semantic object and action of the page which
         * should be displayed
         *
         * @returns {Promise<object>} Resolves to an object contains the pageId and spaceId
         *
         * @private
         * @since 1.72.0
         */
        _parsePageAndSpaceId: function (pageId, spaceId, intent) {
            if (pageId.length < 1 && spaceId.length < 1) {
                if (intent.semanticObject === "Shell" && intent.action === "home") {
                    return this._getAssignedPage();
                }
                return Promise.reject(resources.i18n.getText("PageRuntime.NoPageIdAndSpaceIdProvided"));
            }

            if (pageId.length === 1 && spaceId.length === 0) {
                return Promise.reject(resources.i18n.getText("PageRuntime.OnlyPageIdProvided"));
            }

            if (pageId.length === 0 && spaceId.length === 1) {
                return Promise.reject(resources.i18n.getText("PageRuntime.OnlySpaceIdProvided"));
            }

            if (pageId.length > 1 || spaceId.length > 1) {
                return Promise.reject(resources.i18n.getText("PageRuntime.MultiplePageOrSpaceIdProvided"));
            }

            if (pageId[0] === "") {
                return Promise.reject(resources.i18n.getText("PageRuntime.InvalidPageId"));
            }

            if (spaceId[0] === "") {
                return Promise.reject(resources.i18n.getText("PageRuntime.InvalidSpaceId"));
            }

            return Promise.resolve({
                pageId: pageId[0],
                spaceId: spaceId[0]
            });
        },

        /**
         * Returns the default page of the current user.
         * It uses the Menu service to retrieve the first menu entry.
         * We currently interpret the first menu entry as the "default"
         * page.
         *
         * @returns {Promise<object>} Resolves to an object contains the pageId and spaceId of the page
         *
         * @private
         * @since 1.72.0
         */
        _getAssignedPage: function () {
            return sap.ushell.Container.getServiceAsync("Menu")
                .then(function (oMenuService) {
                    return oMenuService.getMenuEntries();
                })
                .then(function (aMenuEntries) {
                    if (aMenuEntries.length === 0) {
                        return Promise.reject(resources.i18n.getText("PageRuntime.NoAssignedPage"));
                    }

                    var oParams = {};

                    if (ObjectPath.get("target.parameters", aMenuEntries[0])) {
                        aMenuEntries[0].target.parameters.forEach(function (oParameter) {
                            if (oParameter.name && oParameter.value) {
                                oParams[oParameter.name] = oParameter.value;
                            }
                        });
                    }

                    if (!oParams.spaceId || !oParams.pageId) {
                        return Promise.reject(resources.i18n.getText("PageRuntime.CannotFindADefaultPage"));
                    }

                    return {
                        spaceId: oParams.spaceId,
                        pageId: oParams.pageId
                    };
                });
        },

        /**
         * Triggers the navigation to a specific page after the pageId is returned and the
         * VisualizationLoading service loaded all the visualization data
         * and the Pages service could successfully load the requested
         * page. Triggers the navigation to an error page when an error occurs.
         *
         * @returns {Promise<string>}
         *  A promise which resolves with the path to the page model after
         *  the page was successfully loaded.
         *
         * @private
         * @since 1.72.0
         */
        _openFLPPage: function () {
            var sPageId,
                sSpaceId;

            return this._getPageAndSpaceId().then(function (ids) {
                sPageId = ids.pageId;
                sSpaceId = ids.spaceId;

                // This property may be updated by consecutive calls to _openFLPPage and prevents race conditions when
                // opening pages.
                this.sCurrentTargetPageId = sPageId;

                return this._oVisualizationLoadingService.then(function (oVisService) {
                    this._oResolvedVisualizationLoadingService = oVisService;

                    return Promise.all([ oVisService.loadVisualizationData(), this._oPagesService ]);
                }.bind(this)).then(function (results) {
                    var oPageService = results[1];
                    return oPageService.loadPage(sPageId);
                }).then(function () {
                    if (this.sCurrentTargetPageId === sPageId) {
                        oUtils.setPerformanceMark("FLP-TTI-Homepage");
                        this._navigate(sPageId);
                    }
                }.bind(this)).catch(function (error) {
                    if (error instanceof Error) {
                        // E.g. UI5 modules cannot be loaded
                        this._oErrorPageModel.setProperty("/text", resources.i18n.getText("PageRuntime.GeneralError.Text"));
                    } else {
                        var sDescription = resources.i18n.getText("PageRuntime.CannotLoadPage.Description") + JSON.stringify(error);

                        this._oErrorPageModel.setProperty("/icon", "sap-icon://documents");
                        this._oErrorPageModel.setProperty("/text", resources.i18n.getText("PageRuntime.CannotLoadPage.Text", [sPageId, sSpaceId]));
                        this._oErrorPageModel.setProperty("/description", "");
                        this._oErrorPageModel.setProperty("/details", sDescription);
                    }

                    this.oPagesRuntimeNavContainer.to(this.oErrorPage);
                }.bind(this));
            }.bind(this)).catch(function (error) {
                this._oErrorPageModel.setProperty("/icon", "sap-icon://documents");
                this._oErrorPageModel.setProperty("/text", error|| "");
                this._oErrorPageModel.setProperty("/description", "");
                this._oErrorPageModel.setProperty("/details", "");

                this.oPagesRuntimeNavContainer.to(this.oErrorPage);
            }.bind(this));
        },

        /**
         * Loops through every page in the inner NavContainer and displays
         * the one which was specified.
         *
         * @param {string} targetPageId The ID of the page which should be displayed
         *
         * @private
         * @since 1.72.0
         */
        _navigate: function (targetPageId) {
            var aPageControls = this.oPagesNavContainer.getPages();
            var sPageId;

            for (var i = 0; i < aPageControls.length; i++) {
                sPageId = aPageControls[i].data("pageId");
                if (targetPageId && targetPageId === sPageId) {
                    this.oPagesNavContainer.to(aPageControls[i]);
                    this.oPagesRuntimeNavContainer.to(this.oPagesNavContainer);
                    return;
                }
            }
        },

         /**
          * Displays the description of the current error and hide the button after it is pressed.
          *
          * @since 1.73.0
          * @private
          */
        _pressViewDetailsButton: function () {
            var sErrorDetails = this._oErrorPageModel.getProperty("/details") || "";
            this._oErrorPageModel.setProperty("/description", sErrorDetails);
        },

        /**
         * Copies the content of the text provided to the clipboard and shows a MessageToast with a success or error message
         *
         * @param {string} text The text that should be copied to the clipboard
         *
         * @since 1.73.0
         * @private
         */
        _copyToClipboard: function () {
            var oTemporaryDomElement = document.createElement("textarea");
            try {
                oTemporaryDomElement.contentEditable = true;
                oTemporaryDomElement.readonly = false;
                oTemporaryDomElement.textContent = this._oErrorPageModel.getProperty("/description");
                document.documentElement.appendChild(oTemporaryDomElement);

                oTemporaryDomElement.select();
                document.execCommand("copy");
                MessageToast.show(resources.i18n.getText("PageRuntime.CannotLoadPage.CopySuccess"), {
                    closeOnBrowserNavigation: false
                });
            } catch (oException) {
                MessageToast.show(resources.i18n.getText("PageRuntime.CannotLoadPage.CopyFail"), {
                    closeOnBrowserNavigation: false
                });
            } finally {
                oTemporaryDomElement.parentNode.removeChild(oTemporaryDomElement);
            }
        },

        /**
         * UI5 factory function which is used by the sections control
         * inside the runtime view to fill the visualizations aggregation
         * (@see sap.ushell.ui.launchpad.Section)
         *
         * @param {string} id Control ID
         * @param {sap.ui.model.Context} context UI5 context
         * @returns {sap.ui.core.Control} The UI5 control
         *
         * @private
         * @since 1.72.0
         */
        _visualizationFactory: function (id, context) {
            if (this._oResolvedVisualizationLoadingService) {
                var oVisualization = context.getObject();
                return this._oResolvedVisualizationLoadingService.instantiateVisualization(oVisualization);
            }
            return new GenericTile({
                state: library.LoadState.Failed
            });
        },

        /**
         * UI5 lifecycle method which is called upon controller destruction.
         * It detaches the router events and config listeners.
         *
         * @private
         * @since 1.72.0
         */
        onExit: function () {
            this.oContainerRouter.getRoute("home").detachMatched(this._openFLPPage, this);
            this.oContainerRouter.getRoute("openFLPPage").detachMatched(this._openFLPPage, this);
            this._aConfigListeners.off();
            this.oEventHubListener.off();
            oStateManager.exit();
        },

        /**
         * Creates the user action menu entry for the actionmode
         *
         * @private
         * @since 1.74.0
         */
        _createActionModeButton: function () {
            var oActionButtonObjectData = {
                id: "ActionModeBtn",
                text: resources.i18n.getText("PageRuntime.EditMode.Activate"),
                icon: "sap-icon://edit",
                press: [ this.pressActionModeButton, this ]
            };

            // in case the edit home page button was moved to the shell header,
            // it was already created as an shell Head Item in Control Manager
            // only here we have access to the text and press method
            var oTileActionsButton = sap.ui.getCore().byId(oActionButtonObjectData.id);
            if (oTileActionsButton) {
                oTileActionsButton.setTooltip(oActionButtonObjectData.text);
                oTileActionsButton.setText(oActionButtonObjectData.text);
                oTileActionsButton.attachPress(oActionButtonObjectData.press);
            } else {
                var oAddActionButtonParameters = {
                    controlType: "sap.ushell.ui.launchpad.ActionItem",
                    oControlProperties: oActionButtonObjectData,
                    bIsVisible: true,
                    aStates: ["home"]
                };
                var oRenderer = sap.ushell.Container.getRenderer("fiori2");
                oRenderer.addUserAction(oAddActionButtonParameters).done(function (oActionButton) {
                    oTileActionsButton = oActionButton;
                    // if xRay is enabled
                    if (Config.last("/core/extension/enableHelp")) {
                        oTileActionsButton.addStyleClass("help-id-ActionModeBtn");// xRay help ID
                    }
                });
            }
        },

        /**
         * Handles the button press on the user action menu entry
         *
         * @private
         * @since 1.74.0
         */
        pressActionModeButton: function () {
            var bActionModeActive = this.getView().getModel("viewSettings").getProperty("/actionModeActive");
            sap.ui.require([
                "sap/ushell/components/pages/ActionMode"
            ], function (ActionMode) {
                if (bActionModeActive) {
                    ActionMode.cancel();
                } else {
                    ActionMode.start(this);
                }
            }.bind(this));
        },

        /**
         * Generic handler for action mode actions
         *
         * @param {string} sHandler Name of the handler within the action mode module
         * @param {sap.ui.base.Event} oEvent Event object
         * @param {sap.ui.core.Control} oSource Source control
         * @param {object} oParameters Event parameters
         *
         * @private
         * @since 1.74.0
         */
        handleEditModeAction: function (sHandler, oEvent, oSource, oParameters) {
            sap.ui.require([
                "sap/ushell/components/pages/ActionMode"
            ], function (ActionMode) {
                ActionMode[sHandler](oEvent, oSource, oParameters);
            });
        },

        /**
         * Handler for visualization drag and drop
         *
         * @param {sap.ui.base.Event} oEvent Event object
         * @param {sap.ui.core.Control} oSource Source control
         * @param {object} oParameters Event parameters
         *
         * @private
         * @since 1.74.0
         */
        visualizationMove: function (oEvent, oSource, oParameters) {
            Log.info("visualization should be moved");
        }
    });
});
