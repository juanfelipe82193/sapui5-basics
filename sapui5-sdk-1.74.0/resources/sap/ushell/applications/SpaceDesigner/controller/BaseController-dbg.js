// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "../util/Transport",
    "sap/m/MessageBox",
    "sap/m/library",
    "sap/base/Log"
], function (
    Controller,
    UIComponent,
    TransportHelper,
    MessageBox,
    sapMLibrary,
    Log
) {
    "use strict";

    return Controller.extend("sap.ushell.applications.SpaceDesigner.controller.BaseController", {
        /**
         * Instantiates the space persistence utility and returns the created instance.
         *
         * @returns {sap.ushell.applications.SpaceDesigner.util.SpacePersistence} An instance of the space persistence utility.
         * @protected
         */
        getSpaceRepository: function () {
            return this.getOwnerComponent().getSpaceRepository();
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
         * @returns {Promise<object>} A promise resolving to the EditSpace dialog controller.
         * @private
         */
        _createEditDialog: function (onConfirm, onCancel) {
            return new Promise(function (resolve) {
                sap.ui.require([
                    "sap/ushell/applications/SpaceDesigner/controller/EditDialog.controller"
                ], function (EditSpaceDialogController) {
                    if (!this.oEditSpaceDialogController) {
                        this.oEditSpaceDialogController = new EditSpaceDialogController(
                            this.getRootView(),
                            this.getResourceBundle()
                        );
                    }
                    this.oEditSpaceDialogController.attachCancel(onCancel);
                    this.oEditSpaceDialogController.attachConfirm(onConfirm);
                    this.oEditSpaceDialogController.load().then(function () {
                        resolve(this.oEditSpaceDialogController);
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        },

        /**
         * Shows the create space dialog and enhances it with transport fields if required.
         *
         * @param {function} onConfirm Function to call when create is confirmed.
         * @param {function} onCancel Function to call when create is cancelled.
         * @returns {Promise<object>} A promise resolving to the CreateSpace dialog controller.
         * @protected
         */
        showCreateDialog: function (onConfirm, onCancel) {
            return new Promise(function (resolve, reject) {
                sap.ui.require([
                    "sap/ushell/applications/SpaceDesigner/controller/CreateSpaceDialog.controller"
                ], function (CreateSpaceDialogController) {
                    if (!this.oCreateSpaceDialogController) {
                        this.oCreateSpaceDialogController = new CreateSpaceDialogController(
                            this.getRootView(),
                            this.getResourceBundle()
                        );
                    }
                    this.oCreateSpaceDialogController.attachConfirm(onConfirm);
                    this.oCreateSpaceDialogController.attachCancel(onCancel);
                    this.oCreateSpaceDialogController.load().then(function () {
                        if (this.getOwnerComponent().isTransportSupported()) {
                            return this.getOwnerComponent().createTransportComponent().then(function (oTransportComponent) {
                                return this.getTransportHelper().enhanceDialogWithTransport(
                                    this.oCreateSpaceDialogController,
                                    oTransportComponent,
                                    onConfirm
                                );
                            }.bind(this));
                        }
                        return this.oCreateSpaceDialogController;
                    }.bind(this)).then(function (oEnhancedDialog) {
                        if (oEnhancedDialog) {
                            oEnhancedDialog.open();
                        }
                        resolve();
                    }).catch(function (oError) {
                        this.oCreateSpaceDialogController.destroy();
                        this.handleBackendError(oError);
                        reject();
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        },

        /**
         * Shows the delete space dialog.
         *
         * @param {function} onConfirm Function to call when delete is confirmed.
         * @param {function} onCancel Function to call when delete is cancelled.
         * @returns {Promise<object>} A promise resolving to the delete dialog controller.
         * @private
         */
        _createDeleteDialog: function (onConfirm, onCancel) {
            return new Promise(function (resolve) {
                sap.ui.require([
                    "sap/ushell/applications/SpaceDesigner/controller/DeleteDialog.controller"
                ], function (DeleteDialogController) {
                    if (!this.oDeleteSpaceDialogController) {
                        this.oDeleteSpaceDialogController = new DeleteDialogController(
                            this.getRootView(),
                            this.getResourceBundle()
                        );
                    }
                    this.oDeleteSpaceDialogController.attachCancel(onCancel);
                    this.oDeleteSpaceDialogController.attachConfirm(onConfirm);
                    this.oDeleteSpaceDialogController.load().then(function () {
                        resolve(this.oDeleteSpaceDialogController);
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        },

        /**
         * Checks if the edit dialog should be shown and creates the dialog if required.
         *
         * @param {object} space The space to edit.
         * @param {function} onConfirm The confirm function.
         * @param {function} onCancel Function to call when delete is cancelled.
         * @return {Promise<void>} A promise resolving when the dialog is shown
         * @protected
         */
        checkShowEditDialog: function (space, onConfirm, onCancel) {
            var fnError = this.handleBackendError.bind(this);

            if (!this.getOwnerComponent().isTransportSupported()) {
                return Promise.resolve();
            }
            return this.getOwnerComponent().createTransportComponent(space.metadata.devclass)
                .then(function (oTransportComponent) {
                    return Promise.all([
                        oTransportComponent.showTransport(space),
                        oTransportComponent.showLockedMessage(space)
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
         * @param {object} space The space object.
         * @param {function} [onConfirm] The confirm function handler.
         * @param {function} [onCancel] The cancel function handler.
         * @return {Promise<void>} A promise resolving when the dialog is shown
         * @protected
         */
        checkShowDeleteDialog: function (space, onConfirm, onCancel) {
            var oResourceBundle = this.getResourceBundle();
            var fnError = this.handleBackendError.bind(this);

            if (!this.getOwnerComponent().isTransportSupported()) {
                return this._createDeleteDialog(onConfirm, onCancel).then(function (oDialog) {
                    oDialog.getModel().setProperty("/message", oResourceBundle.getText("DeleteDialog.Text"));
                    oDialog.open();
                });
            }
            return this.getOwnerComponent().createTransportComponent(space.metadata.devclass)
                .then(function (oTransportComponent) {
                    return Promise.all([
                        oTransportComponent.showTransport(space),
                        oTransportComponent.showLockedMessage(space)
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
         * Shows the copy space dialog and enhances it with transport fields if required.
         *
         * @param {function} oSpace space to copy.
         * @param {function} onConfirm Function to call when copy is confirmed.
         * @param {function} onCancel Function to call when copy is cancelled.
         * @return {Promise<void>} A promise resolving when the dialog is shown
         * @protected
         */
        showCopyDialog: function (oSpace, onConfirm, onCancel) {
            return new Promise(function (resolve, reject) {
                sap.ui.require([
                    "sap/ushell/applications/SpaceDesigner/controller/CopySpaceDialog.controller"
                ], function (CopySpaceDialogController) {
                    if (!this.oCopySpaceDialogController) {
                        this.oCopySpaceDialogController = new CopySpaceDialogController(
                            this.getRootView(),
                            this.getResourceBundle()
                        );
                    }
                    this.oCopySpaceDialogController.attachConfirm(onConfirm);
                    this.oCopySpaceDialogController.attachCancel(onCancel);
                    return this.oCopySpaceDialogController.load().then(function () {
                        if (this.getOwnerComponent().isTransportSupported()) {
                            return this.getOwnerComponent().createTransportComponent().then(function (transportComponent) {
                                return this.getTransportHelper().enhanceDialogWithTransport(
                                    this.oCopySpaceDialogController,
                                    transportComponent,
                                    onConfirm
                                );
                            }.bind(this));
                        }
                        return this.oCopySpaceDialogController;
                    }.bind(this)).then(function (enhancedDialog) {
                        if (enhancedDialog) {
                            enhancedDialog.open();
                            enhancedDialog.getModel().setProperty("/sourceId", oSpace.content.id);
                            enhancedDialog.getModel().setProperty("/sourceTitle", oSpace.content.title);
                        }
                        resolve();
                    }).catch(function (error) {
                        this.oCopySpaceDialogController.destroy();
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
         * @param {boolean} [bNavToSpaceOverview] Indicates whether to navigate to the space overview after close.
         * @protected
         */
        showMessageBoxError: function (sErrorMsg, bNavToSpaceOverview) {
            if (bNavToSpaceOverview) {
                MessageBox.error(sErrorMsg, {
                    onClose: function () {
                        this.navigateToSpaceOverview();
                    }.bind(this)
                });
            } else {
                MessageBox.error(sErrorMsg);
            }
        },

        /**
         * Navigates to the spaceOverview page.
         *
         * @protected
         */
        navigateToSpaceOverview: function () {
            this.getRouter().navTo("overview");
        },

        /**
         * Navigates to the error page.
         *
         * @param {string} sSpaceId The error message.
         * @protected
         */
        navigateToErrorPage: function (sSpaceId) {
            this.getRouter().navTo("error", {
                spaceId: encodeURIComponent(sSpaceId)
            }, null, true);
        },

        /**
         * Checks if the space masterLanguage is the same as the logon language.
         * Shows error message box if false
         *
         * @param {object} space The space to check
         * @return {boolean} The result - true if there is a mismatch, false if there is none
         */
        checkMasterLanguageMismatch: function (space) {
            var bCheckLanguageMismatch = this.getOwnerComponent().getMetadata().getConfig().checkLanguageMismatch;
            var sUserLanguage = sap.ui.getCore().getConfiguration().getSAPLogonLanguage().toUpperCase();
            var sSpaceMasterLanguage = space.content.masterLanguage.toUpperCase();

            if (bCheckLanguageMismatch && sUserLanguage !== sSpaceMasterLanguage) {
                this.showMessageBoxError(this.getResourceBundle().getText(
                    "EditDialog.LanguageMismatch",
                    [
                        sSpaceMasterLanguage,
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
            this.getSpaceRepository().abortPendingBackendRequests();
        }
    });
});
