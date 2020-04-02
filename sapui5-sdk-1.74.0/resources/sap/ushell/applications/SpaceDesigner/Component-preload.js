//@ui5-bundle Component-preload.js
sap.ui.require.preload({
	"sap/ushell/applications/SpaceDesigner/Component.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/UIComponent",
    "./controller/ErrorDialog",
    "sap/ui/model/json/JSONModel",
    "./util/SpacePersistence"
], function (UIComponent, ErrorDialog, JSONModel, SpacePersistence) {
    "use strict";

    return UIComponent.extend("sap.ushell.applications.SpaceDesigner.Component", {
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


            this.getModel("SpaceRepository").setHeaders({
                "sap-language": sap.ushell.Container.getUser().getLanguage(),
                "sap-client": sap.ushell.Container.getLogonSystem().getClient()
            });



            this.setMetaModelData();
        },

        /**
         * Instantiates the space persistence utility and returns the created instance.
         *
         * @returns {sap.ushell.applications.SpaceDesigner.util.SpacePersistence} An instance of the space persistence utility.
         * @protected
         */
        getSpaceRepository: function () {
            if (!this.oSpacePersistenceInstance) {
                this.oSpacePersistenceInstance = new SpacePersistence(
                    this.getModel("SpaceRepository"),
                    this.getModel("i18n").getResourceBundle()
                );
            }
            return this.oSpacePersistenceInstance;
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
         * Handles startup parameters for spaceId, roleIds and mode
         * If there is a spaceId set, navigate to that spaceId in edit|view mode and append the roleIds as query param
         *
         * @param {object} startupParameters The parameters passed as startup params to the application via URL
         *
         * @private
         */
        _handleStartupParams: function (startupParameters) {
            var sSpaceId = startupParameters.spaceId && startupParameters.spaceId[0];
            var sRoleId = startupParameters.roleId && startupParameters.roleId[0];
            var sMode = startupParameters.mode && startupParameters.mode[0];

            this._saveRole(sRoleId);

            if (sSpaceId) {
                sMode = ["edit", "view"].indexOf(sMode) > -1 ? sMode : "view";
                this.getRouter().navTo(sMode, { spaceId: encodeURIComponent(sSpaceId) }, true);
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
         * @param {string} [spacePackage] The space package name
         * @returns {Promise<sap.ui.core.Component>} Promise resolving to the component instance or void if
         * no component is declared
         * Rejected if transport is not supported
         * @protected
         */
        createTransportComponent: function (spacePackage) {
            if (this.isTransportSupported()) {
                if (!this._oTransportPromise) {
                    this._oTransportPromise = this.createComponent({
                        async: true,
                        usage: "transportInformation"
                    });
                }

                return this._oTransportPromise.then(function (transportComponent) {
                    transportComponent.reset({
                        "package": spacePackage
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
            this.getModel("SpaceRepository").getMetaModel().loaded().then(function () {
                var oMetaModel = this.getModel("SpaceRepository").getMetaModel();
                var oMetaModelData = {
                    copySupported: !!oMetaModel.getODataFunctionImport("copySpace"),
                    deleteSupported: !!oMetaModel.getODataFunctionImport("deleteSpace"),
                    createSupported: this.getMetadata().getConfig().enableCreate,
                    previewSupported: this.getMetadata().getConfig().enablePreview
                };
                this.setModel(new JSONModel(oMetaModelData), "SupportedOperationModel");
            }.bind(this));
        }
    });
});
},
	"sap/ushell/applications/SpaceDesigner/controller/App.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "./BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("sap.ushell.applications.SpaceDesigner.controller.App", {});
});
},
	"sap/ushell/applications/SpaceDesigner/controller/BaseController.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

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
},
	"sap/ushell/applications/SpaceDesigner/controller/BaseDialog.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

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

    return BaseController.extend("sap.ushell.applications.SpaceComposer.controller.BaseDialog.controller", {
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
         * Pre-filters available packages by the space ID namespace.
         * If a namespace is detected in the space ID, it is then copied to the package input field if it is empty.
         * Does nothing if the package input field is not empty or if the dialog is not enhanced with transport information.
         *
         * @param {string} sSpaceID The space ID to check if it contains a namespace and extract it.
         * @param {boolean} [bFetchSuggestionOnly] If "true", will only fetch package suggestions;
         *   otherwise, will set the detected namespace into the package input field and trigger validations.
         */
        handlePackageNamespaceChange: function (sSpaceID, bFetchSuggestionOnly) {
            var oTransportComponent = this._oView.byId("transportContainer").getComponentInstance(),
                oPackageInput = oTransportComponent && oTransportComponent.getRootControl().byId("packageInput");
            if (oPackageInput && !oPackageInput.getValue().length) {
                var sPackageNamespace = sSpaceID.split("/"); sPackageNamespace.pop(); sPackageNamespace = sPackageNamespace.join("/");
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
         * Called on the live change of the space ID.
         *
         * @param {sap.ui.base.Event} oEvent The change event.
         * @private
         */
        onSpaceIDLiveChange: function (oEvent) {
            var oInput = oEvent.getSource(),
                oModel = this.getModel(),
                sInputValue = oInput.getValue(),
                bIsValid = this.isValidID(sInputValue),
                oValidation = merge({}, oModel.getProperty("/validation"), { id: bIsValid }),
                sValueState = bIsValid ? ValueState.None : ValueState.Error;
            oModel.setProperty("/validation", oValidation);
            oInput.setValueState(sValueState);
            if (sInputValue.length > 0) {
                oInput.setValueStateText(this._oResourceBundle.getText("Message.InvalidSpaceID"));
            } else {
                oInput.setValueStateText(this._oResourceBundle.getText("Message.EmptySpaceID"));
            }
            this.handlePackageNamespaceChange(sInputValue, true);
        },

        /**
         * Called on the change of the space ID.
         *
         * @param {sap.ui.base.Event} oEvent The change event.
         * @private
         */
        onSpaceIDChange: function (oEvent) {
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
	"sap/ushell/applications/SpaceDesigner/controller/CopySpaceDialog.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

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

    return BaseDialogController.extend("sap.ushell.applications.SpaceDesigner.controller.CopySpaceDialog", {
        constructor: function (oView, oResourceBundle) {
            this._oView = oView;
            this._oModel = new JSONModel({ validation: { id: false } });
            this.sViewId = "copyDialog";
            this.sId = "sap.ushell.applications.SpaceDesigner.view.CopySpaceDialog";
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
                        title: oModel.getProperty("/title")
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
            var oFragment = this._oView.byId("copyDialog");
            sap.ui.getCore().getMessageManager().registerObject(oFragment, true);
            this._resetModel(oFragment.getModel());
        }
    });
});
},
	"sap/ushell/applications/SpaceDesigner/controller/CreateSpaceDialog.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

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

    return BaseDialogController.extend("sap.ushell.applications.SpaceDesigner.controller.CreatePageDialog", {
        constructor: function (oView, oResourceBundle) {
            this._oView = oView;
            this._oModel = new JSONModel({
                validation: {
                    id: false,
                    title: false
                }
            });
            this._oResourceBundle = oResourceBundle;
            this.sViewId = "createSpaceDialog";
            this.sId = "sap.ushell.applications.SpaceDesigner.view.CreateSpaceDialog";
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
                        title: oModel.getProperty("/title")
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
            var oFragment = this._oView.byId("createSpaceDialog");
            sap.ui.getCore().getMessageManager().registerObject(oFragment, true);
            this._resetModel(oFragment.getModel());
        }
    });
});
},
	"sap/ushell/applications/SpaceDesigner/controller/CustomString.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/model/SimpleType"
], function (SimpleType) {
    "use strict";

    return SimpleType.extend("sap.ushell.applications.SpaceDesigner.controller.CustomString", {
        formatValue: function (sValue) {
            return sValue;
        },

        parseValue: function (sValue) {
            return sValue.toUpperCase();
        },

        validateValue: function (sValue) {
        }
    });
});
},
	"sap/ushell/applications/SpaceDesigner/controller/DeleteDialog.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

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

    return BaseDialogController.extend("sap.ushell.applications.SpaceDesigner.controller.DeleteDialog.controller", {
        constructor: function (oView) {
            this._oView = oView;
            this._createOrResetModel();

            this.sViewId = "deleteDialog";
            this.sId = "sap.ushell.applications.SpaceDesigner.view.DeleteDialog";
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
	"sap/ushell/applications/SpaceDesigner/controller/EditDialog.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

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

    return BaseDialogController.extend("sap.ushell.applications.SpaceDesigner.controller.EditDialog.controller", {
        constructor: function (oView) {
            this._oView = oView;
            this._oModel = new JSONModel({
                title: "",
                message: "",
                validation: {}
            });

            this.sViewId = "editDialog";
            this.sId = "sap.ushell.applications.SpaceDesigner.view.EditDialog";
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
	"sap/ushell/applications/SpaceDesigner/controller/ErrorDialog.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

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
            name: "sap.ushell.applications.SpaceDesigner.view.ErrorDialog",
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
	"sap/ushell/applications/SpaceDesigner/controller/ErrorPage.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "./BaseController"
], function (
    BaseController
) {
    "use strict";

    return BaseController.extend("sap.ushell.applications.SpaceDesigner.controller.ErrorPage", {
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
	"sap/ushell/applications/SpaceDesigner/controller/SpaceDetail.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/base/Log",
    "sap/base/strings/formatMessage"
], function (
    BaseController,
    JSONModel,
    MessageToast,
    Log,
    formatMessage
) {
    "use strict";
    return BaseController.extend("sap.ushell.applications.SpaceDesigner.controller.SpaceDetail", {
        /**
         * Called when controller is initialized.
         *
         * @private
         */
        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("view").attachPatternMatched(this._onPageMatched, this);
            this.setModel(new JSONModel({
                space: {},
                editMode: false,
                transportSupported: this.getOwnerComponent().isTransportSupported()
            }));

            this.getView().addEventDelegate({
                onBeforeHide: this.onRouteLeave.bind(this)
            });
        },

        /**
         * Called when space detail view is exited.
         *
         * @private
         */
        onExit: function () {
            this.space.exit();
        },

        formatMessage: formatMessage,

        /**
         * Called if the route matched the pattern for viewing a space.
         * Loads the space with the id given in the URL parameter
         *
         * @param {sap.ui.base.Event} event The routing event
         *
         * @private
         */
        _onPageMatched: function (event) {
            var oArguments = event.getParameter("arguments");
            var sSpaceId = oArguments.spaceId;
            var sRole = this.getOwnerComponent().getRole();
            this.getModel().setProperty("/space", {});
            this.getView().setBusy(true);

            Log.info("The space with id " + sSpaceId + " was opened in view mode scoped by the following role", sRole);

            this._loadSpace(decodeURIComponent(sSpaceId)).then(function (oSpace) {
                this.getModel().setProperty("/space", oSpace);

            }.bind(this)).catch(function () {
                this.navigateToErrorPage(sSpaceId);
            }.bind(this)).finally(function () {
                this.getView().setBusy(false);
            }.bind(this));
        },

        /**
         * Loads the page with the given pageId from the PagePersistence.
         *
         * @param {string} spaceId The pageId to load
         * @returns {Promise<object>} A promise resolving to the page
         *
         * @private
         */
        _loadSpace: function (spaceId) {
            return Promise.all([
                this.getSpaceRepository().getSpace(spaceId)
            ]).then(function (promiseResults) {
                this.getModel().updateBindings(true);
                return promiseResults[1];
            }.bind(this));
        },

        /**
         * Navigates to the space detail page
         *
         * @param {string} spaceId The pageId to navigate to
         *
         * @private
         */
        _navigateToEdit: function (spaceId) {

        },

        /**
         * Called if the delete action has been confirmed
         *
         * @param {sap.ui.base.Event} oEvent The deleteSpace event
         * @returns {Promise<void>} A promise resolving when the space has been deleted
         *
         * @private
         */
        _deleteSpace: function (oEvent) {
            var oDialog = oEvent.getSource().getParent();
            var sTransportId = oEvent.metadata && oEvent.metadata.transportId || "";
            var sSpaceToDeleteId = this.getModel().getProperty("/space/content/id");
            var sSuccessMsg = this.getResourceBundle().getText("Message.SuccessDeletePage");

            return this.getSpaceRepository().deleteSpace(sSpaceToDeleteId, sTransportId)
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
            var oSpace = this.getModel().getProperty("/space");
            this.checkShowDeleteDialog(oSpace, this._deleteSpace.bind(this));
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
        }
    });
});
},
	"sap/ushell/applications/SpaceDesigner/controller/SpaceOverview.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

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

    return BaseController.extend("sap.ushell.applications.SpaceDesigner.controller.Main", {
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
            this.getRouter().getRoute("overview").attachPatternMatched(this._onSpaceOverviewMatched, this);
            this.setModel(this._createInitialButtonStateModel(), "buttonStates");
        },

        /**
         * Called if a list item in the spaceOverview table is pressed.
         *
         * @param {sap.ui.base.Event} oEvent The press event
         *
         * @private
         */
        onItemPress: function (oEvent) {
            var oSpace = oEvent.getParameter("listItem").getBindingContext().getObject();
            this._navigateToDetail(oSpace.content.id);
        },

        /**
         * Called if the route is entered. Refreshes the model.
         *
         * @private
         */
        _onSpaceOverviewMatched: function () {
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
         * @param {string} spaceId The page ID to navigate to
         *
         * @private
         */
        _navigateToDetail: function (spaceId) {
            this.getRouter().navTo("view", {
                spaceId: encodeURIComponent(spaceId)
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
                        this._navigateToEdit(pageInfo.content.id);
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
            var oFilter = new Filter({
                filters: aFilters,
                and: false
            });

            oBinding.filter([oFilter]);

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
            return this._loadAvailableSpaces().then(function (spaces) {
                this.getModel().setSizeLimit(spaces.spaces.length);
                this.getModel().setProperty("/spaces", spaces.spaces);
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
         * Load available spaces from the space persistence
         *
         * @returns {Promise<{spaces: array}>} A promise which contains an object with the pages
         *
         * @private
         */
        _loadAvailableSpaces: function () {
            return this.getSpaceRepository().getSpaces().then(function (aSpaces) {
                return { spaces: aSpaces };
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
        }
    });
});
},
	"sap/ushell/applications/SpaceDesigner/i18n/i18n.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# __ldi.translation.uuid=2eee8fe0-a16a-4a2d-8360-c42e14108eea\n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=Maintain Spaces\n\n#XBUT\nButton.Add=Add\n#XBUT\nButton.Cancel=Cancel\n#XBUT\nButton.Copy=Copy\n#XBUT\nButton.Create=Create\n#XBUT\nButton.Delete=Delete\n#XBUT\nButton.Edit=Edit\n#XBUT\nButton.Save=Save\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowPages=Show Pages\n#XBUT\nButton.HidePages=Hide Pages\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=Issues: {0}\n#XBUT\nButton.SortPages=Toggle Pages Sort Order\n#XBUT\nButton.ShowDetails=Show Details\n#XBUT\nButton.ErrorMsg=Error Messages\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=Search\n#XTOL\nTooltip.SearchForTiles=Search for Spaces\n\n#XFLD\nLabel.SpaceID=Space ID\n#XFLD\nLabel.Title=Title\n#XFLD\nLabel.WorkbenchRequest=Workbench Request\n#XFLD\nLabel.Package=Package\n#XFLD\nLabel.TransportInformation=Transport Information\n#XFLD\nLabel.Details=Details:\n#XFLD\nLabel.ResponseCode=Response Code:\n#XFLD\nLabel.Description=Description\n#XFLD\nLabel.CreatedByFullname=Created By\n#XFLD\nLabel.CreatedOn=Created On\n#XFLD\nLabel.ChangedByFullname=Changed By\n#XFLD\nLabel.ChangedOn=Changed On\n#XFLD\nLabel.PageTitle=Page Title\n#XFLD\nLabel.AssignedRole=Assigned Role\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=Title\n#XCOL\nColumn.SpaceDescription=Description\n#XCOL\nColumn.SpacePackage=Package\n#XCOL\nColumn.SpaceWorkbenchRequest=Workbench Request\n#XCOL\nColumn.SpaceCreatedBy=Created By\n#XCOL\nColumn.SpaceCreatedOn=Created On\n#XCOL\nColumn.SpaceChangedBy=Changed By\n#XCOL\nColumn.SpaceChangedOn=Changed On\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Title\n#XCOL\nColumn.PageDescription=Description\n#XCOL\nColumn.PagePackage=Package\n#XCOL\nColumn.PageWorkbenchRequest=Workbench Request\n#XCOL\nColumn.PageCreatedBy=Created By\n#XCOL\nColumn.PageCreatedOn=Created On\n#XCOL\nColumn.PageChangedBy=Changed By\n#XCOL\nColumn.PageChangedOn=Changed On\n\n#XTOL\nPlaceholder.CopySpaceTitle=Copy of "{0}"\n#XTOL\nPlaceholder.CopySpaceID=Copy of "{0}"\n\n#XMSG\nMessage.NoInternetConnection=Please check your internet connection.\n#XMSG\nMessage.SavedChanges=Your changes have been saved.\n#XMSG\nMessage.InvalidPageID=Please only use the following characters: A-Z, 0-9, _ and /. The page ID should not start with a number.\n#XMSG\nMessage.EmptySpaceID=Please provide a valid Space ID.\n#XMSG\nMessage.EmptyTitle=Please provide a valid title.\n#XMSG\nMessage.SuccessDeletePage=The selected page has been deleted.\n#XMSG\nMessage.ClipboardCopySuccess=Details were copied successfully.\n#YMSE\nMessage.ClipboardCopyFail=An error occurred while copying details.\n#XMSG\nMessage.SpaceCreated=The space has been created.\n\n#XMSG\nMessage.NavigationTargetError=Navigation target could not be resolved.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=Failed to resolve the navigation target of tile: "{0}".\\n\\nThis is most likely caused by invalid configuration of SAP Fiori launchpad content. The visualization cannot open an application.\n#XMSG\nMessage.PageIsOutdated=A newer version of this page has already been saved.\n#XMSG\nMessage.SaveChanges=Please save your changes.\n#XMSG\nMessage.NoSpaces=No spaces available.\n#XMSG\nMessage.NoSpacesFound=No spaces found. Try adjusting your search.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=New Space\n#XTIT\nDeleteDialog.Title=Delete\n#XMSG\nDeleteDialog.Text=Are you sure you want to delete the selected space?\n#XBUT\nDeleteDialog.ConfirmButton=Delete\n#XTIT\nDeleteDialog.LockedTitle=Space Locked\n#XMSG\nDeleteDialog.LockedText=The selected space is locked by user "{0}".\n#XMSG\nDeleteDialog.TransportRequired=Please select a transport package to delete the selected space.\n\n#XMSG\nEditDialog.LockedText=The selected space is locked by user "{0}".\n#XMSG\nEditDialog.TransportRequired=Please select a transport package to edit the selected space.\n#XTIT\nEditDialog.Title=Edit space\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=This space has been created in language "{0}" but your logon language is set to "{1}". Please change your logon language to "{0}" to proceed.\n\n#XTIT\nErrorDialog.Title=Error\n\n#XTIT\nSpaceOverview.Title=Maintain Pages\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=Layout\n\n#XTIT\nCopyDialog.Title=Copy Space\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=Do you want to copy "{0}"?\n#XFLD\nCopyDialog.NewID=Copy of "{0}"\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=Sorry, we could not find this space.\n#XLNK\nErrorPage.Link=Maintain Spaces\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_ar.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=\\u0635\\u064A\\u0627\\u0646\\u0629 \\u0627\\u0644\\u0645\\u0633\\u0627\\u062D\\u0627\\u062A\n\n#XBUT\nButton.Add=\\u0625\\u0636\\u0627\\u0641\\u0629\n#XBUT\nButton.Cancel=\\u0625\\u0644\\u063A\\u0627\\u0621\n#XBUT\nButton.Copy=\\u0646\\u0633\\u062E\n#XBUT\nButton.Create=\\u0625\\u0646\\u0634\\u0627\\u0621\n#XBUT\nButton.Delete=\\u062D\\u0630\\u0641\n#XBUT\nButton.Edit=\\u062A\\u062D\\u0631\\u064A\\u0631\n#XBUT\nButton.Save=\\u062D\\u0641\\u0638\n#XBUT\nButton.Ok=\\u0645\\u0648\\u0627\\u0641\\u0642\n#XBUT\nButton.ShowPages=\\u0625\\u0638\\u0647\\u0627\\u0631 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0627\\u062A\n#XBUT\nButton.HidePages=\\u0625\\u062E\\u0641\\u0627\\u0621 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0627\\u062A\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=\\u0627\\u0644\\u0645\\u0634\\u0643\\u0644\\u0627\\u062A\\: {0}\n#XBUT\nButton.SortPages=\\u062A\\u0628\\u062F\\u064A\\u0644 \\u062A\\u0633\\u0644\\u0633\\u0644 \\u062A\\u0631\\u062A\\u064A\\u0628 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0627\\u062A\n#XBUT\nButton.ShowDetails=\\u0625\\u0638\\u0647\\u0627\\u0631 \\u0627\\u0644\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644\n#XBUT\nButton.ErrorMsg=\\u0631\\u0633\\u0627\\u0626\\u0644 \\u0627\\u0644\\u062E\\u0637\\u0623\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=\\u0628\\u062D\\u062B\n#XTOL\nTooltip.SearchForTiles=\\u0627\\u0644\\u0628\\u062D\\u062B \\u0639\\u0646 \\u0627\\u0644\\u0645\\u0633\\u0627\\u062D\\u0627\\u062A\n\n#XFLD\nLabel.SpaceID=\\u0645\\u0639\\u0631\\u0641 \\u0627\\u0644\\u0645\\u0633\\u0627\\u062D\\u0629\n#XFLD\nLabel.Title=\\u0627\\u0644\\u0639\\u0646\\u0648\\u0627\\u0646\n#XFLD\nLabel.WorkbenchRequest=\\u0637\\u0644\\u0628 \\u0645\\u0646\\u0636\\u062F\\u0629 \\u0627\\u0644\\u0639\\u0645\\u0644\n#XFLD\nLabel.Package=\\u0627\\u0644\\u062D\\u0632\\u0645\\u0629\n#XFLD\nLabel.TransportInformation=\\u0645\\u0639\\u0644\\u0648\\u0645\\u0627\\u062A \\u0627\\u0644\\u0646\\u0642\\u0644\n#XFLD\nLabel.Details=\\u0627\\u0644\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644\\:\n#XFLD\nLabel.ResponseCode=\\u0631\\u0645\\u0632 \\u0627\\u0644\\u0627\\u0633\\u062A\\u062C\\u0627\\u0628\\u0629\\:\n#XFLD\nLabel.Description=\\u0627\\u0644\\u0648\\u0635\\u0641\n#XFLD\nLabel.CreatedByFullname=\\u062A\\u0645 \\u0627\\u0644\\u0625\\u0646\\u0634\\u0627\\u0621 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629\n#XFLD\nLabel.CreatedOn=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0625\\u0646\\u0634\\u0627\\u0621\n#XFLD\nLabel.ChangedByFullname=\\u062A\\u0645 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629\n#XFLD\nLabel.ChangedOn=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\n#XFLD\nLabel.PageTitle=\\u0639\\u0646\\u0648\\u0627\\u0646 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629\n#XFLD\nLabel.AssignedRole=\\u0627\\u0644\\u062F\\u0648\\u0631 \\u0627\\u0644\\u0645\\u0639\\u064A\\u0651\\u064E\\u0646\n\n#XCOL\nColumn.SpaceID=\\u0627\\u0644\\u0645\\u0639\\u0631\\u0641\n#XCOL\nColumn.SpaceTitle=\\u0627\\u0644\\u0639\\u0646\\u0648\\u0627\\u0646\n#XCOL\nColumn.SpaceDescription=\\u0627\\u0644\\u0648\\u0635\\u0641\n#XCOL\nColumn.SpacePackage=\\u0627\\u0644\\u062D\\u0632\\u0645\\u0629\n#XCOL\nColumn.SpaceWorkbenchRequest=\\u0637\\u0644\\u0628 \\u0645\\u0646\\u0636\\u062F\\u0629 \\u0627\\u0644\\u0639\\u0645\\u0644\n#XCOL\nColumn.SpaceCreatedBy=\\u062A\\u0645 \\u0627\\u0644\\u0625\\u0646\\u0634\\u0627\\u0621 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629\n#XCOL\nColumn.SpaceCreatedOn=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0625\\u0646\\u0634\\u0627\\u0621\n#XCOL\nColumn.SpaceChangedBy=\\u062A\\u0645 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629\n#XCOL\nColumn.SpaceChangedOn=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\n\n#XCOL\nColumn.PageID=\\u0627\\u0644\\u0645\\u0639\\u0631\\u0641\n#XCOL\nColumn.PageTitle=\\u0627\\u0644\\u0639\\u0646\\u0648\\u0627\\u0646\n#XCOL\nColumn.PageDescription=\\u0627\\u0644\\u0648\\u0635\\u0641\n#XCOL\nColumn.PagePackage=\\u0627\\u0644\\u062D\\u0632\\u0645\\u0629\n#XCOL\nColumn.PageWorkbenchRequest=\\u0637\\u0644\\u0628 \\u0645\\u0646\\u0636\\u062F\\u0629 \\u0627\\u0644\\u0639\\u0645\\u0644\n#XCOL\nColumn.PageCreatedBy=\\u062A\\u0645 \\u0627\\u0644\\u0625\\u0646\\u0634\\u0627\\u0621 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629\n#XCOL\nColumn.PageCreatedOn=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u0625\\u0646\\u0634\\u0627\\u0621\n#XCOL\nColumn.PageChangedBy=\\u062A\\u0645 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631 \\u0628\\u0648\\u0627\\u0633\\u0637\\u0629\n#XCOL\nColumn.PageChangedOn=\\u062A\\u0627\\u0631\\u064A\\u062E \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\n\n#XTOL\nPlaceholder.CopySpaceTitle=\\u0646\\u0633\\u062E\\u0629 \\u0645\\u0646 "{0}"\n#XTOL\nPlaceholder.CopySpaceID=\\u0646\\u0633\\u062E\\u0629 \\u0645\\u0646 "{0}"\n\n#XMSG\nMessage.NoInternetConnection=\\u064A\\u064F\\u0631\\u062C\\u0649 \\u0641\\u062D\\u0635 \\u0627\\u062A\\u0635\\u0627\\u0644 \\u0627\\u0644\\u0625\\u0646\\u062A\\u0631\\u0646\\u062A.\n#XMSG\nMessage.SavedChanges=\\u062A\\u0645 \\u062D\\u0641\\u0638 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A \\u0627\\u0644\\u062E\\u0627\\u0635\\u0629 \\u0628\\u0643.\n#XMSG\nMessage.InvalidPageID=\\u064A\\u0631\\u062C\\u0649 \\u0641\\u0642\\u0637 \\u0627\\u0633\\u062A\\u062E\\u062F\\u0627\\u0645 \\u0627\\u0644\\u0623\\u062D\\u0631\\u0641 \\u0627\\u0644\\u062A\\u0627\\u0644\\u064A\\u0629\\: A-Z  0-9\\u060C _ \\u0648 /. \\u064A\\u062C\\u0628 \\u0623\\u0644\\u0627 \\u064A\\u0628\\u062F\\u0623 \\u0645\\u0639\\u0631\\u0641 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629 \\u0628\\u0631\\u0642\\u0645.\n#XMSG\nMessage.EmptySpaceID=\\u064A\\u064F\\u0631\\u062C\\u0649 \\u062A\\u0642\\u062F\\u064A\\u0645 \\u0645\\u0639\\u0631\\u0641 \\u0645\\u0633\\u0627\\u062D\\u0629 \\u0635\\u0627\\u0644\\u062D.\n#XMSG\nMessage.EmptyTitle=\\u064A\\u0631\\u062C\\u0649 \\u062A\\u0642\\u062F\\u064A\\u0645 \\u0639\\u0646\\u0648\\u0627\\u0646 \\u0635\\u0627\\u0644\\u062D.\n#XMSG\nMessage.SuccessDeletePage=\\u062A\\u0645 \\u062D\\u0630\\u0641 \\u0627\\u0644\\u0643\\u0627\\u0626\\u0646 \\u0627\\u0644\\u0645\\u062D\\u062F\\u062F.\n#XMSG\nMessage.ClipboardCopySuccess=\\u062A\\u0645 \\u0646\\u0633\\u062E \\u0627\\u0644\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644 \\u0628\\u0646\\u062C\\u0627\\u062D.\n#YMSE\nMessage.ClipboardCopyFail=\\u062D\\u062F\\u062B \\u062E\\u0637\\u0623 \\u0623\\u062B\\u0646\\u0627\\u0621 \\u0646\\u0633\\u062E \\u0627\\u0644\\u062A\\u0641\\u0627\\u0635\\u064A\\u0644.\n#XMSG\nMessage.SpaceCreated=\\u062A\\u0645 \\u0625\\u0646\\u0634\\u0627\\u0621 \\u0627\\u0644\\u0645\\u0633\\u0627\\u062D\\u0629.\n\n#XMSG\nMessage.NavigationTargetError=\\u062A\\u0639\\u0630\\u0631 \\u062D\\u0644 \\u0647\\u062F\\u0641 \\u0627\\u0644\\u062A\\u0646\\u0642\\u0644.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=\\u0641\\u0634\\u0644 \\u062D\\u0644 \\u0647\\u062F\\u0641 \\u0627\\u0644\\u062A\\u0646\\u0642\\u0644 \\u0644\\u0644\\u0625\\u0637\\u0627\\u0631\\: "{0}".\\n\\n\\u0647\\u0630\\u0627 \\u0639\\u0644\\u0649 \\u0627\\u0644\\u0623\\u0631\\u062C\\u062D \\u0628\\u0633\\u0628\\u0628 \\u0627\\u0644\\u062A\\u0643\\u0648\\u064A\\u0646 \\u063A\\u064A\\u0631 \\u0627\\u0644\\u0635\\u0627\\u0644\\u062D \\u0644\\u0645\\u062D\\u062A\\u0648\\u0649 \\u0644\\u0648\\u062D\\u0629 \\u062A\\u0634\\u063A\\u064A\\u0644 SAP Fiori. \\u0644\\u0627 \\u064A\\u0645\\u0643\\u0646 \\u0644\\u0644\\u0639\\u0631\\u0636 \\u0641\\u062A\\u062D \\u062A\\u0637\\u0628\\u064A\\u0642.\n#XMSG\nMessage.PageIsOutdated=\\u062A\\u0645 \\u062D\\u0641\\u0638 \\u0623\\u062D\\u062F\\u062B \\u0625\\u0635\\u062F\\u0627\\u0631 \\u0645\\u0646 \\u0647\\u0630\\u0647 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0629 \\u0645\\u0633\\u0628\\u0642\\u064B\\u0627.\n#XMSG\nMessage.SaveChanges=\\u064A\\u0631\\u062C\\u0649 \\u062D\\u0641\\u0638 \\u0627\\u0644\\u062A\\u063A\\u064A\\u064A\\u0631\\u0627\\u062A \\u0627\\u0644\\u062E\\u0627\\u0635\\u0629 \\u0628\\u0643.\n#XMSG\nMessage.NoSpaces=\\u0644\\u0627 \\u062A\\u062A\\u0648\\u0641\\u0631 \\u0645\\u0633\\u0627\\u062D\\u0627\\u062A.\n#XMSG\nMessage.NoSpacesFound=\\u0644\\u0645 \\u064A\\u062A\\u0645 \\u0627\\u0644\\u0639\\u062B\\u0648\\u0631 \\u0639\\u0644\\u0649 \\u0645\\u0633\\u0627\\u062D\\u0627\\u062A. \\u062D\\u0627\\u0648\\u0644 \\u062A\\u0639\\u062F\\u064A\\u0644 \\u0628\\u062D\\u062B\\u0643.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=\\u0645\\u0633\\u0627\\u062D\\u0629 \\u062C\\u062F\\u064A\\u062F\\u0629\n#XTIT\nDeleteDialog.Title=\\u062D\\u0630\\u0641\n#XMSG\nDeleteDialog.Text=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0628\\u0627\\u0644\\u062A\\u0623\\u0643\\u064A\\u062F \\u062D\\u0630\\u0641 \\u0627\\u0644\\u0645\\u0633\\u0627\\u062D\\u0629 \\u0627\\u0644\\u0645\\u062D\\u062F\\u062F\\u0629\\u061F\n#XBUT\nDeleteDialog.ConfirmButton=\\u062D\\u0630\\u0641\n#XTIT\nDeleteDialog.LockedTitle=\\u0627\\u0644\\u0645\\u0633\\u0627\\u062D\\u0629 \\u0645\\u0624\\u0645\\u0651\\u064E\\u0646\\u0629\n#XMSG\nDeleteDialog.LockedText=\\u0627\\u0644\\u0645\\u0633\\u0627\\u062D\\u0629 \\u0627\\u0644\\u0645\\u062D\\u062F\\u062F\\u0629 \\u0645\\u0624\\u0645\\u0651\\u064E\\u0646\\u0629 \\u0645\\u0646 \\u0642\\u0628\\u0644 \\u0627\\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 "{0}".\n#XMSG\nDeleteDialog.TransportRequired=\\u064A\\u064F\\u0631\\u062C\\u0649 \\u062A\\u062D\\u062F\\u064A\\u062F \\u062D\\u0632\\u0645\\u0629 \\u0627\\u0644\\u0646\\u0642\\u0644 \\u0644\\u062D\\u0630\\u0641 \\u0627\\u0644\\u0645\\u0633\\u0627\\u062D\\u0629 \\u0627\\u0644\\u0645\\u062D\\u062F\\u062F\\u0629.\n\n#XMSG\nEditDialog.LockedText=\\u0627\\u0644\\u0645\\u0633\\u0627\\u062D\\u0629 \\u0627\\u0644\\u0645\\u062D\\u062F\\u062F\\u0629 \\u0645\\u0624\\u0645\\u0651\\u064E\\u0646\\u0629 \\u0645\\u0646 \\u0642\\u0628\\u0644 \\u0627\\u0644\\u0645\\u0633\\u062A\\u062E\\u062F\\u0645 "{0}".\n#XMSG\nEditDialog.TransportRequired=\\u064A\\u064F\\u0631\\u062C\\u0649 \\u062A\\u062D\\u062F\\u064A\\u062F \\u062D\\u0632\\u0645\\u0629 \\u0627\\u0644\\u0646\\u0642\\u0644 \\u0644\\u062A\\u062D\\u0631\\u064A\\u0631 \\u0627\\u0644\\u0645\\u0633\\u0627\\u062D\\u0629 \\u0627\\u0644\\u0645\\u062D\\u062F\\u062F\\u0629.\n#XTIT\nEditDialog.Title=\\u062A\\u062D\\u0631\\u064A\\u0631 \\u0627\\u0644\\u0645\\u0633\\u0627\\u062D\\u0629\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=\\u062A\\u0645 \\u0625\\u0646\\u0634\\u0627\\u0621 \\u0647\\u0630\\u0647 \\u0627\\u0644\\u0645\\u0633\\u0627\\u062D\\u0629 \\u0628\\u0627\\u0644\\u0644\\u063A\\u0629 "{0}" \\u0648\\u0644\\u0643\\u0646 \\u062A\\u0645 \\u062A\\u0639\\u064A\\u064A\\u0646 \\u0644\\u063A\\u0629 \\u062A\\u0633\\u062C\\u064A\\u0644 \\u0627\\u0644\\u062F\\u062E\\u0648\\u0644 \\u0627\\u0644\\u062E\\u0627\\u0635\\u0629 \\u0628\\u0643 \\u0625\\u0644\\u0649 "{1}".\\u064A\\u064F\\u0631\\u062C\\u064A \\u062A\\u063A\\u064A\\u064A\\u0631 \\u0644\\u063A\\u0629 \\u062A\\u0633\\u062C\\u064A\\u0644 \\u0627\\u0644\\u062F\\u062E\\u0648\\u0644 \\u0627\\u0644\\u062E\\u0627\\u0635\\u0629 \\u0628\\u0643 \\u0625\\u0644\\u0649 "{0}" \\u0644\\u0644\\u0645\\u062A\\u0627\\u0628\\u0639\\u0629.\n\n#XTIT\nErrorDialog.Title=\\u062E\\u0637\\u0623\n\n#XTIT\nSpaceOverview.Title=\\u0635\\u064A\\u0627\\u0646\\u0629 \\u0627\\u0644\\u0635\\u0641\\u062D\\u0627\\u062A\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=\\u0627\\u0644\\u0645\\u062E\\u0637\\u0637\n\n#XTIT\nCopyDialog.Title=\\u0646\\u0633\\u062E \\u0627\\u0644\\u0645\\u0633\\u0627\\u062D\\u0629\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=\\u0647\\u0644 \\u062A\\u0631\\u064A\\u062F \\u0646\\u0633\\u062E "{0}"\\u061F\n#XFLD\nCopyDialog.NewID=\\u0646\\u0633\\u062E\\u0629 \\u0645\\u0646 "{0}"\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=\\u0639\\u0630\\u0631\\u064B\\u0627\\u060C \\u0644\\u0627 \\u064A\\u0645\\u0643\\u0646\\u0646\\u0627 \\u0627\\u0644\\u0639\\u062B\\u0648\\u0631 \\u0639\\u0644\\u0649 \\u0647\\u0630\\u0647 \\u0627\\u0644\\u0645\\u0633\\u0627\\u062D\\u0629.\n#XLNK\nErrorPage.Link=\\u0635\\u064A\\u0627\\u0646\\u0629 \\u0627\\u0644\\u0645\\u0633\\u0627\\u062D\\u0627\\u062A\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_bg.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=\\u041F\\u043E\\u0434\\u0434\\u0440\\u044A\\u0436\\u043A\\u0430 \\u043D\\u0430 \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u0430\n\n#XBUT\nButton.Add=\\u0414\\u043E\\u0431\\u0430\\u0432\\u044F\\u043D\\u0435\n#XBUT\nButton.Cancel=\\u041E\\u0442\\u043A\\u0430\\u0437\n#XBUT\nButton.Copy=\\u041A\\u043E\\u043F\\u0438\\u0440\\u0430\\u043D\\u0435\n#XBUT\nButton.Create=\\u0421\\u044A\\u0437\\u0434\\u0430\\u0432\\u0430\\u043D\\u0435\n#XBUT\nButton.Delete=\\u0418\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435\n#XBUT\nButton.Edit=\\u0420\\u0435\\u0434\\u0430\\u043A\\u0442\\u0438\\u0440\\u0430\\u043D\\u0435\n#XBUT\nButton.Save=\\u0417\\u0430\\u043F\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowPages=\\u041F\\u043E\\u043A\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0438\n#XBUT\nButton.HidePages=\\u0421\\u043A\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0438\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=\\u041F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\u0438\\: {0}\n#XBUT\nButton.SortPages=\\u041F\\u0440\\u0435\\u0432\\u043A\\u043B\\u044E\\u0447\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0440\\u0435\\u0434\\u0430 \\u043D\\u0430 \\u0441\\u043E\\u0440\\u0442\\u0438\\u0440\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0438\n#XBUT\nButton.ShowDetails=\\u041F\\u043E\\u043A\\u0430\\u0437\\u0432\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438\n#XBUT\nButton.ErrorMsg=\\u0421\\u044A\\u043E\\u0431\\u0449\\u0435\\u043D\\u0438\\u044F \\u0437\\u0430 \\u0433\\u0440\\u0435\\u0448\\u043A\\u0438\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435\n#XTOL\nTooltip.SearchForTiles=\\u0422\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u0430\n\n#XFLD\nLabel.SpaceID=\\u0418\\u0414 \\u043D\\u0430 \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E\n#XFLD\nLabel.Title=\\u0417\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435\n#XFLD\nLabel.WorkbenchRequest=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u0438\\u043D\\u0441\\u0442\\u0440\\u0443\\u043C\\u0435\\u043D\\u0442\\u0430\\u043B\\u043D\\u0438 \\u0441\\u0440\\u0435\\u0434\\u0441\\u0442\\u0432\\u0430\n#XFLD\nLabel.Package=\\u041F\\u0430\\u043A\\u0435\\u0442\n#XFLD\nLabel.TransportInformation=\\u0418\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0438\\u044F \\u0437\\u0430 \\u0442\\u0440\\u0430\\u043D\\u0441\\u043F\\u043E\\u0440\\u0442\n#XFLD\nLabel.Details=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438\\:\n#XFLD\nLabel.ResponseCode=\\u041A\\u043E\\u0434 \\u043D\\u0430 \\u043E\\u0442\\u0433\\u043E\\u0432\\u043E\\u0440\\:\n#XFLD\nLabel.Description=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\n#XFLD\nLabel.CreatedByFullname=\\u0421\\u044A\\u0437\\u0434\\u0430\\u043B\n#XFLD\nLabel.CreatedOn=\\u0421\\u044A\\u0437\\u0434\\u0430\\u0434\\u0435\\u043D \\u043D\\u0430\n#XFLD\nLabel.ChangedByFullname=\\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438\\u043B\n#XFLD\nLabel.ChangedOn=\\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0435\\u043D \\u043D\\u0430\n#XFLD\nLabel.PageTitle=\\u0417\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435 \\u043D\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\n#XFLD\nLabel.AssignedRole=\\u041F\\u0440\\u0438\\u0441\\u044A\\u0435\\u0434\\u0438\\u043D\\u0435\\u043D\\u0430 \\u0440\\u043E\\u043B\\u044F\n\n#XCOL\nColumn.SpaceID=\\u0418\\u0414\n#XCOL\nColumn.SpaceTitle=\\u0417\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435\n#XCOL\nColumn.SpaceDescription=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\n#XCOL\nColumn.SpacePackage=\\u041F\\u0430\\u043A\\u0435\\u0442\n#XCOL\nColumn.SpaceWorkbenchRequest=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u0438\\u043D\\u0441\\u0442\\u0440\\u0443\\u043C\\u0435\\u043D\\u0442\\u0430\\u043B\\u043D\\u0438 \\u0441\\u0440\\u0435\\u0434\\u0441\\u0442\\u0432\\u0430\n#XCOL\nColumn.SpaceCreatedBy=\\u0421\\u044A\\u0437\\u0434\\u0430\\u043B\n#XCOL\nColumn.SpaceCreatedOn=\\u0421\\u044A\\u0437\\u0434\\u0430\\u0434\\u0435\\u043D\\u043E \\u043D\\u0430\n#XCOL\nColumn.SpaceChangedBy=\\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438\\u043B\n#XCOL\nColumn.SpaceChangedOn=\\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0435\\u043D\\u043E \\u043D\\u0430\n\n#XCOL\nColumn.PageID=\\u0418\\u0414\n#XCOL\nColumn.PageTitle=\\u0417\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435\n#XCOL\nColumn.PageDescription=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\n#XCOL\nColumn.PagePackage=\\u041F\\u0430\\u043A\\u0435\\u0442\n#XCOL\nColumn.PageWorkbenchRequest=\\u0417\\u0430\\u044F\\u0432\\u043A\\u0430 \\u0437\\u0430 \\u0438\\u043D\\u0441\\u0442\\u0440\\u0443\\u043C\\u0435\\u043D\\u0442\\u0430\\u043B\\u043D\\u0438 \\u0441\\u0440\\u0435\\u0434\\u0441\\u0442\\u0432\\u0430\n#XCOL\nColumn.PageCreatedBy=\\u0421\\u044A\\u0437\\u0434\\u0430\\u043B\n#XCOL\nColumn.PageCreatedOn=\\u0421\\u044A\\u0437\\u0434\\u0430\\u0434\\u0435\\u043D\\u043E \\u043D\\u0430\n#XCOL\nColumn.PageChangedBy=\\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438\\u043B\n#XCOL\nColumn.PageChangedOn=\\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0435\\u043D\\u043E \\u043D\\u0430\n\n#XTOL\nPlaceholder.CopySpaceTitle=\\u041A\\u043E\\u043F\\u0438\\u0435 \\u043D\\u0430 \\u201C{0}\\u201D\n#XTOL\nPlaceholder.CopySpaceID=\\u041A\\u043E\\u043F\\u0438\\u0435 \\u043D\\u0430 \\u201C{0}\\u201D\n\n#XMSG\nMessage.NoInternetConnection=\\u041C\\u043E\\u043B\\u044F, \\u043F\\u0440\\u043E\\u0432\\u0435\\u0440\\u0435\\u0442\\u0435 \\u0438\\u043D\\u0442\\u0435\\u0440\\u043D\\u0435\\u0442 \\u0432\\u0440\\u044A\\u0437\\u043A\\u0430\\u0442\\u0430 \\u0441\\u0438.\n#XMSG\nMessage.SavedChanges=\\u0412\\u0430\\u0448\\u0438\\u0442\\u0435 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438 \\u0441\\u0430 \\u0437\\u0430\\u043F\\u0430\\u0437\\u0435\\u043D\\u0438.\n#XMSG\nMessage.InvalidPageID=\\u041C\\u043E\\u043B\\u044F, \\u0438\\u0437\\u043F\\u043E\\u043B\\u0437\\u0432\\u0430\\u0439\\u0442\\u0435 \\u0441\\u0430\\u043C\\u043E \\u0441\\u043B\\u0435\\u0434\\u043D\\u0438\\u0442\\u0435 \\u0441\\u0438\\u043C\\u0432\\u043E\\u043B\\u0438\\: A-Z, 0-9, _ \\u0438 /. \\u0418\\u0414 \\u043D\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430\\u0442\\u0430 \\u043D\\u0435 \\u043C\\u043E\\u0436\\u0435 \\u0434\\u0430 \\u0437\\u0430\\u043F\\u043E\\u0447\\u0432\\u0430 \\u0441 \\u0446\\u0438\\u0444\\u0440\\u0430.\n#XMSG\nMessage.EmptySpaceID=\\u041C\\u043E\\u043B\\u044F, \\u0432\\u044A\\u0432\\u0435\\u0434\\u0435\\u0442\\u0435 \\u0432\\u0430\\u043B\\u0438\\u0434\\u0435\\u043D \\u0418\\u0414 \\u043D\\u0430 \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E.\n#XMSG\nMessage.EmptyTitle=\\u041C\\u043E\\u043B\\u044F, \\u0432\\u044A\\u0432\\u0435\\u0434\\u0435\\u0442\\u0435 \\u0432\\u0430\\u043B\\u0438\\u0434\\u043D\\u043E \\u0437\\u0430\\u0433\\u043B\\u0430\\u0432\\u0438\\u0435.\n#XMSG\nMessage.SuccessDeletePage=\\u0418\\u0437\\u0431\\u0440\\u0430\\u043D\\u0438\\u044F\\u0442 \\u043E\\u0431\\u0435\\u043A\\u0442 \\u0435 \\u0438\\u0437\\u0442\\u0440\\u0438\\u0442.\n#XMSG\nMessage.ClipboardCopySuccess=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438\\u0442\\u0435 \\u0434\\u0430\\u043D\\u043D\\u0438 \\u0441\\u0430 \\u043A\\u043E\\u043F\\u0438\\u0440\\u0430\\u043D\\u0438 \\u0443\\u0441\\u043F\\u0435\\u0448\\u043D\\u043E.\n#YMSE\nMessage.ClipboardCopyFail=\\u0412\\u044A\\u0437\\u043D\\u0438\\u043A\\u043D\\u0430 \\u0433\\u0440\\u0435\\u0448\\u043A\\u0430 \\u043F\\u043E \\u0432\\u0440\\u0435\\u043C\\u0435 \\u043D\\u0430 \\u043A\\u043E\\u043F\\u0438\\u0440\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u043E\\u0434\\u0440\\u043E\\u0431\\u043D\\u0438 \\u0434\\u0430\\u043D\\u043D\\u0438.\n#XMSG\nMessage.SpaceCreated=\\u041F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E\\u0442\\u043E \\u0435 \\u0441\\u044A\\u0437\\u0434\\u0430\\u0434\\u0435\\u043D\\u043E.\n\n#XMSG\nMessage.NavigationTargetError=\\u0426\\u0435\\u043B\\u0442\\u0430 \\u043D\\u0430 \\u043D\\u0430\\u0432\\u0438\\u0433\\u0430\\u0446\\u0438\\u044F\\u0442\\u0430 \\u043D\\u0435 \\u043C\\u043E\\u0436\\u0435 \\u0434\\u0430 \\u0431\\u044A\\u0434\\u0435 \\u043E\\u043F\\u0440\\u0435\\u0434\\u0435\\u043B\\u0435\\u043D\\u0430.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=\\u0426\\u0435\\u043B\\u0442\\u0430 \\u043D\\u0430 \\u043D\\u0430\\u0432\\u0438\\u0433\\u0430\\u0446\\u0438\\u044F \\u043D\\u0430 \\u043F\\u043B\\u043E\\u0447\\u043A\\u0430\\u0442\\u0430 "{0}\\u201D \\u043D\\u0435 \\u0431\\u0435\\u0448\\u0435 \\u043E\\u043F\\u0440\\u0435\\u0434\\u0435\\u043B\\u0435\\u043D\\u0430.\\n\\n\\u0422\\u043E\\u0432\\u0430 \\u043D\\u0430\\u0439-\\u0432\\u0435\\u0440\\u043E\\u044F\\u0442\\u043D\\u043E \\u0441\\u0435 \\u0434\\u044A\\u043B\\u0436\\u0438 \\u043D\\u0430 \\u0433\\u0440\\u0435\\u0448\\u043D\\u0430 \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F \\u043D\\u0430 \\u0441\\u044A\\u0434\\u044A\\u0440\\u0436\\u0430\\u043D\\u0438\\u0435\\u0442\\u043E \\u043D\\u0430 \\u043A\\u043E\\u043D\\u0442\\u0440\\u043E\\u043B\\u043D\\u0438\\u044F \\u043F\\u0430\\u043D\\u0435\\u043B \\u043D\\u0430 SAP Fiori. \\u0412\\u0438\\u0437\\u0443\\u0430\\u043B\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F\\u0442\\u0430 \\u043D\\u0435 \\u043C\\u043E\\u0436\\u0435 \\u0434\\u0430 \\u043E\\u0442\\u0432\\u043E\\u0440\\u0438 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0435.\n#XMSG\nMessage.PageIsOutdated=\\u0412\\u0435\\u0447\\u0435 \\u0438\\u043C\\u0430 \\u0437\\u0430\\u043F\\u0430\\u0437\\u0435\\u043D\\u0430 \\u043F\\u043E-\\u043D\\u043E\\u0432\\u0430 \\u0432\\u0435\\u0440\\u0441\\u0438\\u044F \\u043D\\u0430 \\u0442\\u0430\\u0437\\u0438 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0430.\n#XMSG\nMessage.SaveChanges=\\u041C\\u043E\\u043B\\u044F, \\u0437\\u0430\\u043F\\u0430\\u0437\\u0435\\u0442\\u0435 \\u043D\\u0430\\u043F\\u0440\\u0430\\u0432\\u0435\\u043D\\u0438\\u0442\\u0435 \\u043E\\u0442 \\u0432\\u0430\\u0441 \\u043F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0438.\n#XMSG\nMessage.NoSpaces=\\u041D\\u044F\\u043C\\u0430 \\u043D\\u0430\\u043B\\u0438\\u0447\\u043D\\u0438 \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u0430.\n#XMSG\nMessage.NoSpacesFound=\\u041D\\u0435 \\u0441\\u0430 \\u043D\\u0430\\u043C\\u0435\\u0440\\u0435\\u043D\\u0438 \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u0430. \\u041F\\u0440\\u043E\\u043C\\u0435\\u043D\\u0435\\u0442\\u0435 \\u043A\\u0440\\u0438\\u0442\\u0435\\u0440\\u0438\\u0438\\u0442\\u0435 \\u0437\\u0430 \\u0442\\u044A\\u0440\\u0441\\u0435\\u043D\\u0435.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=\\u041D\\u043E\\u0432\\u043E \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E\n#XTIT\nDeleteDialog.Title=\\u0418\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435\n#XMSG\nDeleteDialog.Text=\\u041F\\u043E\\u0442\\u0432\\u044A\\u0440\\u0436\\u0434\\u0430\\u0432\\u0430\\u0442\\u0435 \\u043B\\u0438, \\u0447\\u0435 \\u0436\\u0435\\u043B\\u0430\\u0435\\u0442\\u0435 \\u0434\\u0430 \\u0438\\u0437\\u0442\\u0440\\u0438\\u0435\\u0442\\u0435 \\u0438\\u0437\\u0431\\u0440\\u0430\\u043D\\u043E\\u0442\\u043E \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E?\n#XBUT\nDeleteDialog.ConfirmButton=\\u0418\\u0437\\u0442\\u0440\\u0438\\u0432\\u0430\\u043D\\u0435\n#XTIT\nDeleteDialog.LockedTitle=\\u041F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E\\u0442\\u043E \\u0435 \\u0437\\u0430\\u043A\\u043B\\u044E\\u0447\\u0435\\u043D\\u043E\n#XMSG\nDeleteDialog.LockedText=\\u0418\\u0437\\u0431\\u0440\\u0430\\u043D\\u043E\\u0442\\u043E \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E \\u0435 \\u0437\\u0430\\u043A\\u043B\\u044E\\u0447\\u0435\\u043D\\u043E \\u043E\\u0442 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B \\u201C{0}\\u201D.\n#XMSG\nDeleteDialog.TransportRequired=\\u041C\\u043E\\u043B\\u044F, \\u0438\\u0437\\u0431\\u0435\\u0440\\u0435\\u0442\\u0435 \\u043F\\u0430\\u043A\\u0435\\u0442 \\u0437\\u0430 \\u043F\\u0440\\u0435\\u043D\\u043E\\u0441, \\u0437\\u0430 \\u0434\\u0430 \\u0438\\u0437\\u0442\\u0440\\u0438\\u0435\\u0442\\u0435 \\u0438\\u0437\\u0431\\u0440\\u0430\\u043D\\u043E\\u0442\\u043E \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E.\n\n#XMSG\nEditDialog.LockedText=\\u0418\\u0437\\u0431\\u0440\\u0430\\u043D\\u043E\\u0442\\u043E \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E \\u0435 \\u0437\\u0430\\u043A\\u043B\\u044E\\u0447\\u0435\\u043D\\u043E \\u043E\\u0442 \\u043F\\u043E\\u0442\\u0440\\u0435\\u0431\\u0438\\u0442\\u0435\\u043B \\u201C{0}\\u201D.\n#XMSG\nEditDialog.TransportRequired=\\u041C\\u043E\\u043B\\u044F, \\u0438\\u0437\\u0431\\u0435\\u0440\\u0435\\u0442\\u0435 \\u043F\\u0430\\u043A\\u0435\\u0442 \\u0437\\u0430 \\u043F\\u0440\\u0435\\u043D\\u043E\\u0441, \\u0437\\u0430 \\u0434\\u0430 \\u0440\\u0435\\u0434\\u0430\\u043A\\u0442\\u0438\\u0440\\u0430\\u0442\\u0435 \\u0438\\u0437\\u0431\\u0440\\u0430\\u043D\\u043E\\u0442\\u043E \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E.\n#XTIT\nEditDialog.Title=\\u0420\\u0435\\u0434\\u0430\\u043A\\u0442\\u0438\\u0440\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=\\u0422\\u043E\\u0432\\u0430 \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E \\u0435 \\u0441\\u044A\\u0437\\u0434\\u0430\\u0434\\u0435\\u043D\\u043E \\u043D\\u0430 {0}, \\u0430 \\u0435\\u0437\\u0438\\u043A\\u044A\\u0442, \\u0441 \\u043A\\u043E\\u0439\\u0442\\u043E \\u0441\\u0442\\u0435 \\u0432\\u043B\\u0435\\u0437\\u043B\\u0438 \\u0432 \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0430\\u0442\\u0430, \\u0435 {1}. \\u0417\\u0430 \\u0434\\u0430 \\u043F\\u0440\\u043E\\u0434\\u044A\\u043B\\u0436\\u0438\\u0442\\u0435, \\u043C\\u043E\\u043B\\u044F \\u0437\\u0430\\u0434\\u0430\\u0439\\u0442\\u0435 {0} \\u043A\\u0430\\u0442\\u043E \\u0435\\u0437\\u0438\\u043A \\u0437\\u0430 \\u0432\\u043B\\u0438\\u0437\\u0430\\u043D\\u0435 \\u0432 \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0430\\u0442\\u0430.\n\n#XTIT\nErrorDialog.Title=\\u0413\\u0440\\u0435\\u0448\\u043A\\u0430\n\n#XTIT\nSpaceOverview.Title=\\u041F\\u043E\\u0434\\u0434\\u0440\\u044A\\u0436\\u043A\\u0430 \\u043D\\u0430 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u0438\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=\\u0424\\u043E\\u0440\\u043C\\u0430\\u0442\n\n#XTIT\nCopyDialog.Title=\\u041A\\u043E\\u043F\\u0438\\u0440\\u0430\\u043D\\u0435 \\u043D\\u0430 \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=\\u0416\\u0435\\u043B\\u0430\\u0435\\u0442\\u0435 \\u043B\\u0438 \\u0434\\u0430 \\u043A\\u043E\\u043F\\u0438\\u0440\\u0430\\u0442\\u0435 {0}?\n#XFLD\nCopyDialog.NewID=\\u041A\\u043E\\u043F\\u0438\\u0435 \\u043D\\u0430 \\u201C{0}\\u201D\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=\\u0417\\u0430 \\u0441\\u044A\\u0436\\u0430\\u043B\\u0435\\u043D\\u0438\\u0435, \\u043D\\u0435 \\u043C\\u043E\\u0436\\u0435\\u043C \\u0434\\u0430 \\u043E\\u0442\\u043A\\u0440\\u0438\\u0435\\u043C \\u0442\\u043E\\u0432\\u0430 \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E.\n#XLNK\nErrorPage.Link=\\u041F\\u043E\\u0434\\u0434\\u0440\\u044A\\u0436\\u043A\\u0430 \\u043D\\u0430 \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u0430\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_ca.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=Actualitzar espais\n\n#XBUT\nButton.Add=Afegir\n#XBUT\nButton.Cancel=Cancel\\u00B7lar\n#XBUT\nButton.Copy=Copiar\n#XBUT\nButton.Create=Crear\n#XBUT\nButton.Delete=Suprimir\n#XBUT\nButton.Edit=Tractar\n#XBUT\nButton.Save=Desar\n#XBUT\nButton.Ok=D\'acord\n#XBUT\nButton.ShowPages=Visualitzar p\\u00E0gines\n#XBUT\nButton.HidePages=Ocultar p\\u00E0gines\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=Problemes\\: {0}\n#XBUT\nButton.SortPages=Alternar ordre de classificaci\\u00F3 de les p\\u00E0gines\n#XBUT\nButton.ShowDetails=Mostrar detalls\n#XBUT\nButton.ErrorMsg=Missatges d\'error\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=Cercar\n#XTOL\nTooltip.SearchForTiles=Cercar espais\n\n#XFLD\nLabel.SpaceID=ID d\'espai\n#XFLD\nLabel.Title=T\\u00EDtol\n#XFLD\nLabel.WorkbenchRequest=Ordre de workenbch\n#XFLD\nLabel.Package=Paquet\n#XFLD\nLabel.TransportInformation=Informaci\\u00F3 de transport\n#XFLD\nLabel.Details=Detalls\\:\n#XFLD\nLabel.ResponseCode=Codi de resposta\\:\n#XFLD\nLabel.Description=Descripci\\u00F3\n#XFLD\nLabel.CreatedByFullname=Creat per\n#XFLD\nLabel.CreatedOn=Creat el\n#XFLD\nLabel.ChangedByFullname=Modificat per\n#XFLD\nLabel.ChangedOn=Modificat el\n#XFLD\nLabel.PageTitle=T\\u00EDtol de p\\u00E0gina\n#XFLD\nLabel.AssignedRole=Rol assignat\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=T\\u00EDtol\n#XCOL\nColumn.SpaceDescription=Descripci\\u00F3\n#XCOL\nColumn.SpacePackage=Paquet\n#XCOL\nColumn.SpaceWorkbenchRequest=Ordre de workenbch\n#XCOL\nColumn.SpaceCreatedBy=Creat per\n#XCOL\nColumn.SpaceCreatedOn=Creat el\n#XCOL\nColumn.SpaceChangedBy=Modificat per\n#XCOL\nColumn.SpaceChangedOn=Modificat el\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=T\\u00EDtol\n#XCOL\nColumn.PageDescription=Descripci\\u00F3\n#XCOL\nColumn.PagePackage=Paquet\n#XCOL\nColumn.PageWorkbenchRequest=Ordre de workenbch\n#XCOL\nColumn.PageCreatedBy=Creat per\n#XCOL\nColumn.PageCreatedOn=Creat el\n#XCOL\nColumn.PageChangedBy=Modificat per\n#XCOL\nColumn.PageChangedOn=Modificat el\n\n#XTOL\nPlaceholder.CopySpaceTitle=C\\u00F2pia de "{0}"\n#XTOL\nPlaceholder.CopySpaceID=C\\u00F2pia de "{0}"\n\n#XMSG\nMessage.NoInternetConnection=Verifiqueu la connexi\\u00F3 a Internet.\n#XMSG\nMessage.SavedChanges=S\'han desat les modificacions.\n#XMSG\nMessage.InvalidPageID=Feu servir nom\\u00E9s els seg\\u00FCents car\\u00E0cters\\: A-Z a-z 0-9 _ i /. L\'ID de p\\u00E0gina no pot comen\\u00E7ar amb un n\\u00FAmero.\n#XMSG\nMessage.EmptySpaceID=Indiqueu un ID d\'espai v\\u00E0lid.\n#XMSG\nMessage.EmptyTitle=Indiqueu un t\\u00EDtol v\\u00E0lid.\n#XMSG\nMessage.SuccessDeletePage=S\\u2019ha suprimit l\'objecte seleccionat.\n#XMSG\nMessage.ClipboardCopySuccess=Els detalls s\'han copiat correctament.\n#YMSE\nMessage.ClipboardCopyFail=S\'ha produ\\u00EFt un error en copiar els detalls.\n#XMSG\nMessage.SpaceCreated=S\\u2019ha creat l\'espai.\n\n#XMSG\nMessage.NavigationTargetError=No s\'ha pogut solucionar la destinaci\\u00F3 de navegaci\\u00F3.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=No s\'\'ha pogut solucionar la destinaci\\u00F3 de navegaci\\u00F3 del mosaic\\: "{0}".\\n\\nSegurament a causa d\'\'una configuraci\\u00F3 de contingut de la plataforma de llan\\u00E7ament de SAP Fiori incorrecta. La visualitzaci\\u00F3n no pot obrir una aplicaci\\u00F3.\n#XMSG\nMessage.PageIsOutdated=Ja s\'ha desat una versi\\u00F3 m\\u00E9s recent d\'aquesta p\\u00E0gina.\n#XMSG\nMessage.SaveChanges=Deseu les modificacions.\n#XMSG\nMessage.NoSpaces=No hi ha espais disponibles.\n#XMSG\nMessage.NoSpacesFound=No s\'ha trobat cap espai. Intenteu ajustar la cerca.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=Espai nou\n#XTIT\nDeleteDialog.Title=Suprimir\n#XMSG\nDeleteDialog.Text=Segur que voleu suprimir l\'espai seleccionat?\n#XBUT\nDeleteDialog.ConfirmButton=Suprimir\n#XTIT\nDeleteDialog.LockedTitle=Espai bloquejat\n#XMSG\nDeleteDialog.LockedText=L\\u2019usuari "{0}" ha bloquejat l\'\'espai seleccionat.\n#XMSG\nDeleteDialog.TransportRequired=Seleccioneu un paquet de transport per suprimir l\'espai seleccionat.\n\n#XMSG\nEditDialog.LockedText=L\\u2019usuari "{0}" ha bloquejat l\'\'espai seleccionat.\n#XMSG\nEditDialog.TransportRequired=Seleccioneu un paquet de transport per editar l\'espai seleccionat.\n#XTIT\nEditDialog.Title=Editar espai\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=Aquest espai s\'\'ha creat en l\'\'idioma "{0}", per\\u00F2 el vostre idioma de registre \\u00E9s "{1}". Modifiqueu el vostre idioma de registre a "{0}" per a continuar.\n\n#XTIT\nErrorDialog.Title=Error\n\n#XTIT\nSpaceOverview.Title=Actualitzar p\\u00E0gines\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=Disposici\\u00F3\n\n#XTIT\nCopyDialog.Title=Copiar espai\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=Voleu copiar "{0}"?\n#XFLD\nCopyDialog.NewID=C\\u00F2pia de "{0}"\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=No s\'ha trobat aquest espai.\n#XLNK\nErrorPage.Link=Actualitzar espais\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_cs.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=\\u00DAdr\\u017Eba prostor\\u016F\n\n#XBUT\nButton.Add=P\\u0159idat\n#XBUT\nButton.Cancel=Zru\\u0161it\n#XBUT\nButton.Copy=Kop\\u00EDrovat\n#XBUT\nButton.Create=Vytvo\\u0159it\n#XBUT\nButton.Delete=Odstranit\n#XBUT\nButton.Edit=Upravit\n#XBUT\nButton.Save=Ulo\\u017Eit\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowPages=Zobrazit str\\u00E1nky\n#XBUT\nButton.HidePages=Skr\\u00FDt str\\u00E1nky\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=Probl\\u00E9my\\: {0}\n#XBUT\nButton.SortPages=P\\u0159epnout po\\u0159ad\\u00ED t\\u0159\\u00EDd\\u011Bn\\u00ED str\\u00E1nek\n#XBUT\nButton.ShowDetails=Zobrazit detaily\n#XBUT\nButton.ErrorMsg=Chybov\\u00E9 zpr\\u00E1vy\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=Hledat\n#XTOL\nTooltip.SearchForTiles=Hledat prostory\n\n#XFLD\nLabel.SpaceID=ID prostoru\n#XFLD\nLabel.Title=Titulek\n#XFLD\nLabel.WorkbenchRequest=Po\\u017Eadavek na workbench\n#XFLD\nLabel.Package=Paket\n#XFLD\nLabel.TransportInformation=Informace o transportu\n#XFLD\nLabel.Details=Detaily\\:\n#XFLD\nLabel.ResponseCode=K\\u00F3d odpov\\u011Bdi\\:\n#XFLD\nLabel.Description=Popis\n#XFLD\nLabel.CreatedByFullname=Vytvo\\u0159il(a)\n#XFLD\nLabel.CreatedOn=Vytvo\\u0159eno dne\n#XFLD\nLabel.ChangedByFullname=Autor zm\\u011Bny\n#XFLD\nLabel.ChangedOn=Zm\\u011Bn\\u011Bno dne\n#XFLD\nLabel.PageTitle=Titulek str\\u00E1nky\n#XFLD\nLabel.AssignedRole=P\\u0159i\\u0159azen\\u00E1 role\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=Titulek\n#XCOL\nColumn.SpaceDescription=Popis\n#XCOL\nColumn.SpacePackage=Paket\n#XCOL\nColumn.SpaceWorkbenchRequest=Po\\u017Eadavek na workbench\n#XCOL\nColumn.SpaceCreatedBy=Vytvo\\u0159il\n#XCOL\nColumn.SpaceCreatedOn=Vytvo\\u0159eno dne\n#XCOL\nColumn.SpaceChangedBy=Autor zm\\u011Bny\n#XCOL\nColumn.SpaceChangedOn=Zm\\u011Bn\\u011Bno dne\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Titulek\n#XCOL\nColumn.PageDescription=Popis\n#XCOL\nColumn.PagePackage=Paket\n#XCOL\nColumn.PageWorkbenchRequest=Po\\u017Eadavek na workbench\n#XCOL\nColumn.PageCreatedBy=Vytvo\\u0159il\n#XCOL\nColumn.PageCreatedOn=Vytvo\\u0159eno dne\n#XCOL\nColumn.PageChangedBy=Autor zm\\u011Bny\n#XCOL\nColumn.PageChangedOn=Zm\\u011Bn\\u011Bno dne\n\n#XTOL\nPlaceholder.CopySpaceTitle=Kopie \\u201E{0}\\u201C\n#XTOL\nPlaceholder.CopySpaceID=Kopie \\u201E{0}\\u201C\n\n#XMSG\nMessage.NoInternetConnection=Zkontrolujte va\\u0161e p\\u0159ipojen\\u00ED k internetu.\n#XMSG\nMessage.SavedChanges=Va\\u0161e zm\\u011Bny byly ulo\\u017Eeny.\n#XMSG\nMessage.InvalidPageID=Pou\\u017E\\u00EDvejte jen n\\u00E1sleduj\\u00EDc\\u00ED znaky\\: A-Z 0-9 _ a /. ID str\\u00E1nky by nem\\u011Blo za\\u010D\\u00EDnat \\u010D\\u00EDslem.\n#XMSG\nMessage.EmptySpaceID=Zadejte platn\\u00E9 ID prostoru.\n#XMSG\nMessage.EmptyTitle=Zadejte platn\\u00FD titulek.\n#XMSG\nMessage.SuccessDeletePage=Vybran\\u00FD objekt byl odstran\\u011Bn.\n#XMSG\nMessage.ClipboardCopySuccess=Detaily byly \\u00FAsp\\u011B\\u0161n\\u011B zkop\\u00EDrov\\u00E1ny.\n#YMSE\nMessage.ClipboardCopyFail=P\\u0159i kop\\u00EDrov\\u00E1n\\u00ED detail\\u016F do\\u0161lo k chyb\\u011B.\n#XMSG\nMessage.SpaceCreated=Prostor byl vytvo\\u0159en.\n\n#XMSG\nMessage.NavigationTargetError=C\\u00EDl navigace nebylo mo\\u017En\\u00E9 rozli\\u0161it.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=Nezda\\u0159ilo se rozli\\u0161it c\\u00EDl navigace dla\\u017Edice\\: "{0}".\\n\\nTo je zp\\u016Fsobeno pravd\\u011Bpodobn\\u011B neplatnou konfigurac\\u00ED obsahu launchpadu SAP Fiori . Vizualizace nem\\u016F\\u017Ee otev\\u0159\\u00EDt aplikaci.\n#XMSG\nMessage.PageIsOutdated=Ji\\u017E byla ulo\\u017Eena nov\\u011Bj\\u0161\\u00ED verze t\\u00E9to str\\u00E1nky.\n#XMSG\nMessage.SaveChanges=Ulo\\u017Ete va\\u0161e zm\\u011Bny.\n#XMSG\nMessage.NoSpaces=\\u017D\\u00E1dn\\u00E9 prostory neexistuj\\u00ED.\n#XMSG\nMessage.NoSpacesFound=\\u017D\\u00E1dn\\u00E9 prostory nenalezeny. Zkuste upravit va\\u0161e hled\\u00E1n\\u00ED.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=Nov\\u00FD prostor\n#XTIT\nDeleteDialog.Title=Odstranit\n#XMSG\nDeleteDialog.Text=Chcete opravdu odstranit vybran\\u00FD prostor?\n#XBUT\nDeleteDialog.ConfirmButton=Odstranit\n#XTIT\nDeleteDialog.LockedTitle=Prostor blokov\\u00E1n\n#XMSG\nDeleteDialog.LockedText=Vybran\\u00FD prostor je blokov\\u00E1n u\\u017Eivatelem \\u201E{0}\\u201C.\n#XMSG\nDeleteDialog.TransportRequired=Vyberte transportn\\u00ED paket pro odstran\\u011Bn\\u00ED vybran\\u00E9ho prostoru.\n\n#XMSG\nEditDialog.LockedText=Vybran\\u00FD prostor je blokov\\u00E1n u\\u017Eivatelem \\u201E{0}\\u201C.\n#XMSG\nEditDialog.TransportRequired=Vyberte transportn\\u00ED paket pro \\u00FApravu vybran\\u00E9ho prostoru.\n#XTIT\nEditDialog.Title=Upravit prostor\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=Tento prostor byl vytvo\\u0159en v jazyce "{0}", ale v\\u00E1\\u0161 p\\u0159ihla\\u0161ovac\\u00ED jazyk je nastaven na "{1}". Pro pokra\\u010Dov\\u00E1n\\u00ED zm\\u011B\\u0148te v\\u00E1\\u0161 p\\u0159ihla\\u0161ovac\\u00ED jazyk na "{0}".\n\n#XTIT\nErrorDialog.Title=Chyba\n\n#XTIT\nSpaceOverview.Title=Prov\\u00E9st \\u00FAdr\\u017Ebu str\\u00E1nek\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=Layout\n\n#XTIT\nCopyDialog.Title=Kop\\u00EDrovat prostor\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=Chcete kop\\u00EDrovat \\u201E{0}\\u201C?\n#XFLD\nCopyDialog.NewID=Kopie \\u201E{0}\\u201C\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=Omlouv\\u00E1me se, tento prostor jsme nemohli naj\\u00EDt.\n#XLNK\nErrorPage.Link=\\u00DAdr\\u017Eba prostor\\u016F\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_da.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=Vedligehold pladser\n\n#XBUT\nButton.Add=Tilf\\u00F8j\n#XBUT\nButton.Cancel=Afbryd\n#XBUT\nButton.Copy=Kopi\\u00E9r\n#XBUT\nButton.Create=Opret\n#XBUT\nButton.Delete=Slet\n#XBUT\nButton.Edit=Rediger\n#XBUT\nButton.Save=Gem\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowPages=Vis sider\n#XBUT\nButton.HidePages=Skjul sider\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=Problemer\\: {0}\n#XBUT\nButton.SortPages=Skift sorteringsr\\u00E6kkef\\u00F8lge for sider\n#XBUT\nButton.ShowDetails=Vis detaljer\n#XBUT\nButton.ErrorMsg=Fejlmeddelelser\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=S\\u00F8g\n#XTOL\nTooltip.SearchForTiles=S\\u00F8g efter pladser\n\n#XFLD\nLabel.SpaceID=Plads-ID\n#XFLD\nLabel.Title=Titel\n#XFLD\nLabel.WorkbenchRequest=Workbench-ordre\n#XFLD\nLabel.Package=Pakke\n#XFLD\nLabel.TransportInformation=Transportinformationer\n#XFLD\nLabel.Details=Detaljer\\:\n#XFLD\nLabel.ResponseCode=Svarkode\\:\n#XFLD\nLabel.Description=Beskrivelse\n#XFLD\nLabel.CreatedByFullname=Oprettet af\n#XFLD\nLabel.CreatedOn=Oprettet den\n#XFLD\nLabel.ChangedByFullname=\\u00C6ndret af\n#XFLD\nLabel.ChangedOn=\\u00C6ndret den\n#XFLD\nLabel.PageTitle=Sidetitel\n#XFLD\nLabel.AssignedRole=Allokeret rolle\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=Titel\n#XCOL\nColumn.SpaceDescription=Beskrivelse\n#XCOL\nColumn.SpacePackage=Pakke\n#XCOL\nColumn.SpaceWorkbenchRequest=Workbench-ordre\n#XCOL\nColumn.SpaceCreatedBy=Oprettet af\n#XCOL\nColumn.SpaceCreatedOn=Oprettet den\n#XCOL\nColumn.SpaceChangedBy=\\u00C6ndret af\n#XCOL\nColumn.SpaceChangedOn=\\u00C6ndret den\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Titel\n#XCOL\nColumn.PageDescription=Beskrivelse\n#XCOL\nColumn.PagePackage=Pakke\n#XCOL\nColumn.PageWorkbenchRequest=Workbench-ordre\n#XCOL\nColumn.PageCreatedBy=Oprettet af\n#XCOL\nColumn.PageCreatedOn=Oprettet den\n#XCOL\nColumn.PageChangedBy=\\u00C6ndret af\n#XCOL\nColumn.PageChangedOn=\\u00C6ndret den\n\n#XTOL\nPlaceholder.CopySpaceTitle=Kopi af "{0}"\n#XTOL\nPlaceholder.CopySpaceID=Kopi af "{0}"\n\n#XMSG\nMessage.NoInternetConnection=Kontroller din internetforbindelse.\n#XMSG\nMessage.SavedChanges=Dine \\u00E6ndringer er gemt.\n#XMSG\nMessage.InvalidPageID=Anvend kun f\\u00F8lgende tegn\\: A-Z, 0-9, _ og /. Side-ID\'en b\\u00F8r ikke starte med et tal.\n#XMSG\nMessage.EmptySpaceID=Angiv en gyldig plads-ID.\n#XMSG\nMessage.EmptyTitle=Angiv en gyldig titel.\n#XMSG\nMessage.SuccessDeletePage=Det valgte objekt er slettet.\n#XMSG\nMessage.ClipboardCopySuccess=Detaljer blev kopieret uden fejl.\n#YMSE\nMessage.ClipboardCopyFail=Der opstod en fejl ved kopiering af detaljer.\n#XMSG\nMessage.SpaceCreated=Pladsen er oprettet.\n\n#XMSG\nMessage.NavigationTargetError=Navigationsm\\u00E5let kunne ikke opl\\u00F8ses.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=Kunne ikke opl\\u00F8se navigationsm\\u00E5let for flise\\: "{0}".\\n\\nDette skyldes h\\u00F8jst sandsynligt en forkert SAP Fiori-launchpad-indholdskonfiguration. Visualiseringen kan ikke \\u00E5bne en applikation.\n#XMSG\nMessage.PageIsOutdated=En nyere version af denne side er allerede gemt.\n#XMSG\nMessage.SaveChanges=Gem dine \\u00E6ndringer.\n#XMSG\nMessage.NoSpaces=Ingen pladser tilg\\u00E6ngelige.\n#XMSG\nMessage.NoSpacesFound=Ingen pladser fundet. Pr\\u00F8v at tilpasse din s\\u00F8gning.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=Ny plads\n#XTIT\nDeleteDialog.Title=Slet\n#XMSG\nDeleteDialog.Text=Er du sikker p\\u00E5, du vil slette den valgte plads?\n#XBUT\nDeleteDialog.ConfirmButton=Slet\n#XTIT\nDeleteDialog.LockedTitle=Plads sp\\u00E6rret\n#XMSG\nDeleteDialog.LockedText=Den valgte plads er sp\\u00E6rret af bruger "{0}".\n#XMSG\nDeleteDialog.TransportRequired=V\\u00E6lg en transportpakke for at slette den valgte plads.\n\n#XMSG\nEditDialog.LockedText=Den valgte plads er sp\\u00E6rret af bruger "{0}".\n#XMSG\nEditDialog.TransportRequired=V\\u00E6lg en transportpakke for at redigere den valgte plads.\n#XTIT\nEditDialog.Title=Rediger plads\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=Denne plads er oprettet p\\u00E5 sprog "{0}", men dit logonsprog er indstillet til "{1}". \\u00C6ndr dit logonsprog til "{0}" for at forts\\u00E6tte.\n\n#XTIT\nErrorDialog.Title=Fejl\n\n#XTIT\nSpaceOverview.Title=Vedligehold sider\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=Layout\n\n#XTIT\nCopyDialog.Title=Kopier plads\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=Vil du kopiere "{0}"?\n#XFLD\nCopyDialog.NewID=Kopi af "{0}"\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=Beklager, vi kunne ikke finde denne plads.\n#XLNK\nErrorPage.Link=Vedligehold pladser\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_de.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=Bereiche pflegen\n\n#XBUT\nButton.Add=Hinzuf\\u00FCgen\n#XBUT\nButton.Cancel=Abbrechen\n#XBUT\nButton.Copy=Kopieren\n#XBUT\nButton.Create=Anlegen\n#XBUT\nButton.Delete=L\\u00F6schen\n#XBUT\nButton.Edit=Bearbeiten\n#XBUT\nButton.Save=Sichern\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowPages=Seiten anzeigen\n#XBUT\nButton.HidePages=Seiten ausblenden\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=Probleme\\: {0}\n#XBUT\nButton.SortPages=Seitensortierreihenfolge wechseln\n#XBUT\nButton.ShowDetails=Details einblenden\n#XBUT\nButton.ErrorMsg=Fehlermeldungen\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=Suchen\n#XTOL\nTooltip.SearchForTiles=Nach Bereichen suchen\n\n#XFLD\nLabel.SpaceID=Bereichs-ID\n#XFLD\nLabel.Title=Titel\n#XFLD\nLabel.WorkbenchRequest=Workbench-Auftrag\n#XFLD\nLabel.Package=Paket\n#XFLD\nLabel.TransportInformation=Transportinformationen\n#XFLD\nLabel.Details=Details\\:\n#XFLD\nLabel.ResponseCode=Antwortcode\\:\n#XFLD\nLabel.Description=Beschreibung\n#XFLD\nLabel.CreatedByFullname=Angelegt von\n#XFLD\nLabel.CreatedOn=Angelegt am\n#XFLD\nLabel.ChangedByFullname=Ge\\u00E4ndert von\n#XFLD\nLabel.ChangedOn=Ge\\u00E4ndert am\n#XFLD\nLabel.PageTitle=Seitentitel\n#XFLD\nLabel.AssignedRole=Zugewiesene Rolle\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=Titel\n#XCOL\nColumn.SpaceDescription=Beschreibung\n#XCOL\nColumn.SpacePackage=Paket\n#XCOL\nColumn.SpaceWorkbenchRequest=Workbench-Auftrag\n#XCOL\nColumn.SpaceCreatedBy=Angelegt von\n#XCOL\nColumn.SpaceCreatedOn=Angelegt am\n#XCOL\nColumn.SpaceChangedBy=Ge\\u00E4ndert von\n#XCOL\nColumn.SpaceChangedOn=Ge\\u00E4ndert am\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Titel\n#XCOL\nColumn.PageDescription=Beschreibung\n#XCOL\nColumn.PagePackage=Paket\n#XCOL\nColumn.PageWorkbenchRequest=Workbench-Auftrag\n#XCOL\nColumn.PageCreatedBy=Angelegt von\n#XCOL\nColumn.PageCreatedOn=Angelegt am\n#XCOL\nColumn.PageChangedBy=Ge\\u00E4ndert von\n#XCOL\nColumn.PageChangedOn=Ge\\u00E4ndert am\n\n#XTOL\nPlaceholder.CopySpaceTitle=Kopie von "{0}"\n#XTOL\nPlaceholder.CopySpaceID=Kopie von "{0}"\n\n#XMSG\nMessage.NoInternetConnection=Bitte pr\\u00FCfen Sie Ihre Internetverbindung.\n#XMSG\nMessage.SavedChanges=Ihre \\u00C4nderungen wurden gesichert.\n#XMSG\nMessage.InvalidPageID=Bitte verwenden Sie nur die folgenden Zeichen\\: A-Z, 0-9, _ und /. Die Seiten-ID sollte nicht mit einer Nummer beginnen.\n#XMSG\nMessage.EmptySpaceID=Bitte geben Sie eine g\\u00FCltige Bereichs-ID an.\n#XMSG\nMessage.EmptyTitle=Bitte geben Sie einen g\\u00FCltigen Titel an.\n#XMSG\nMessage.SuccessDeletePage=Das ausgew\\u00E4hlte Objekt wurde gel\\u00F6scht.\n#XMSG\nMessage.ClipboardCopySuccess=Details wurden erfolgreich kopiert.\n#YMSE\nMessage.ClipboardCopyFail=Fehler beim Kopieren der Details.\n#XMSG\nMessage.SpaceCreated=Der Bereich wurde angelegt.\n\n#XMSG\nMessage.NavigationTargetError=Das Navigationsziel konnte nicht aufgel\\u00F6st werden.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=Das Navigationsziel der Kachel "{0}" kann nicht aufgel\\u00F6st werden. \\n\\nM\\u00F6gliche Ursache\\: Der Inhalt des SAP Fiori Launchpad ist inkorrekt konfiguriert worden. Die Visualisierung kann keine Anwendung \\u00F6ffnen.\n#XMSG\nMessage.PageIsOutdated=Eine neuere Version dieser Seite wurde bereits gesichert.\n#XMSG\nMessage.SaveChanges=Bitte sichern Sie Ihre \\u00C4nderungen.\n#XMSG\nMessage.NoSpaces=Keine Bereiche verf\\u00FCgbar.\n#XMSG\nMessage.NoSpacesFound=Keine Bereiche gefunden. Versuchen Sie, Ihre Suche anzupassen.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=Neuer Bereich\n#XTIT\nDeleteDialog.Title=L\\u00F6schen\n#XMSG\nDeleteDialog.Text=Wollen Sie den ausgew\\u00E4hlten Bereich wirklich l\\u00F6schen?\n#XBUT\nDeleteDialog.ConfirmButton=L\\u00F6schen\n#XTIT\nDeleteDialog.LockedTitle=Bereich gesperrt\n#XMSG\nDeleteDialog.LockedText=Der ausgew\\u00E4hlte Bereich wird von Benutzer "{0}" gesperrt.\n#XMSG\nDeleteDialog.TransportRequired=Bitte w\\u00E4hlen Sie ein Transportpaket aus, um den ausgew\\u00E4hlten Bereich zu l\\u00F6schen.\n\n#XMSG\nEditDialog.LockedText=Der ausgew\\u00E4hlte Bereich wird von Benutzer "{0}" gesperrt.\n#XMSG\nEditDialog.TransportRequired=Bitte w\\u00E4hlen Sie ein Transportpaket aus, um den ausgew\\u00E4hlten Bereich zu bearbeiten.\n#XTIT\nEditDialog.Title=Bereich bearbeiten\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=Dieser Bereich wurde in der Sprache "{0}" angelegt, aber Ihre Anmeldesprache ist auf "{1}" gesetzt. Bitte \\u00E4ndern Sie Ihre Anmeldesprache zu "{0}", um fortzufahren.\n\n#XTIT\nErrorDialog.Title=Fehler\n\n#XTIT\nSpaceOverview.Title=Seiten pflegen\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=Layout\n\n#XTIT\nCopyDialog.Title=Bereich kopieren\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=Wollen Sie "{0}" kopieren?\n#XFLD\nCopyDialog.NewID=Kopie von "{0}"\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=Dieser Bereich wurde leider nicht gefunden.\n#XLNK\nErrorPage.Link=Bereiche pflegen\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_el.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=\\u03A3\\u03C5\\u03BD\\u03C4\\u03AE\\u03C1\\u03B7\\u03C3\\u03B7 \\u03A7\\u03CE\\u03C1\\u03C9\\u03BD\n\n#XBUT\nButton.Add=\\u03A0\\u03C1\\u03BF\\u03C3\\u03B8\\u03AE\\u03BA\\u03B7\n#XBUT\nButton.Cancel=\\u0391\\u03BA\\u03CD\\u03C1\\u03C9\\u03C3\\u03B7\n#XBUT\nButton.Copy=\\u0391\\u03BD\\u03C4\\u03B9\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE\n#XBUT\nButton.Create=\\u0394\\u03B7\\u03BC\\u03B9\\u03BF\\u03C5\\u03C1\\u03B3\\u03AF\\u03B1\n#XBUT\nButton.Delete=\\u0394\\u03B9\\u03B1\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE\n#XBUT\nButton.Edit=E\\u03C0\\u03B5\\u03BE\\u03B5\\u03C1\\u03B3\\u03B1\\u03C3\\u03AF\\u03B1\n#XBUT\nButton.Save=\\u0391\\u03C0\\u03BF\\u03B8\\u03AE\\u03BA\\u03B5\\u03C5\\u03C3\\u03B7\n#XBUT\nButton.Ok=\\u039F\\u039A\n#XBUT\nButton.ShowPages=\\u0395\\u03BC\\u03C6\\u03AC\\u03BD\\u03B9\\u03C3\\u03B7 \\u03A3\\u03B5\\u03BB\\u03AF\\u03B4\\u03C9\\u03BD\n#XBUT\nButton.HidePages=\\u0391\\u03C0\\u03CC\\u03BA\\u03C1\\u03C5\\u03C8\\u03B7 \\u03A3\\u03B5\\u03BB\\u03AF\\u03B4\\u03C9\\u03BD\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=\\u03A0\\u03C1\\u03BF\\u03B2\\u03BB\\u03AE\\u03BC\\u03B1\\u03C4\\u03B1\\: {0}\n#XBUT\nButton.SortPages=\\u0395\\u03BD\\u03B1\\u03BB\\u03BB\\u03B1\\u03B3\\u03AE \\u03A3\\u03B5\\u03B9\\u03C1\\u03AC\\u03C2 \\u03A4\\u03B1\\u03BE\\u03B9\\u03BD\\u03CC\\u03BC\\u03B7\\u03C3\\u03B7\\u03C2 \\u03A3\\u03B5\\u03BB\\u03AF\\u03B4\\u03C9\\u03BD\n#XBUT\nButton.ShowDetails=\\u0395\\u03BC\\u03C6\\u03AC\\u03BD\\u03B9\\u03C3\\u03B7 \\u039B\\u03B5\\u03C0\\u03C4\\u03BF\\u03BC\\u03B5\\u03C1\\u03B5\\u03B9\\u03CE\\u03BD\n#XBUT\nButton.ErrorMsg=\\u039C\\u03B7\\u03BD\\u03CD\\u03BC\\u03B1\\u03C4\\u03B1 \\u039B\\u03AC\\u03B8\\u03BF\\u03C5\\u03C2\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=\\u0391\\u03BD\\u03B1\\u03B6\\u03AE\\u03C4\\u03B7\\u03C3\\u03B7\n#XTOL\nTooltip.SearchForTiles=\\u0391\\u03BD\\u03B1\\u03B6\\u03AE\\u03C4\\u03B7\\u03C3\\u03B7 \\u03A7\\u03CE\\u03C1\\u03C9\\u03BD\n\n#XFLD\nLabel.SpaceID=ID \\u03A7\\u03CE\\u03C1\\u03BF\\u03C5\n#XFLD\nLabel.Title=\\u03A4\\u03AF\\u03C4\\u03BB\\u03BF\\u03C2\n#XFLD\nLabel.WorkbenchRequest=\\u0391\\u03AF\\u03C4\\u03B7\\u03C3\\u03B7 \\u03A0\\u03B5\\u03B4\\u03AF\\u03BF\\u03C5 \\u0395\\u03C1\\u03B3\\u03B1\\u03C3\\u03B9\\u03CE\\u03BD\n#XFLD\nLabel.Package=\\u03A0\\u03B1\\u03BA\\u03AD\\u03C4\\u03BF\n#XFLD\nLabel.TransportInformation=\\u03A0\\u03BB\\u03B7\\u03C1\\u03BF\\u03C6\\u03BF\\u03C1\\u03AF\\u03B5\\u03C2 \\u039C\\u03B5\\u03C4\\u03B1\\u03C6\\u03BF\\u03C1\\u03AC\\u03C2\n#XFLD\nLabel.Details=\\u039B\\u03B5\\u03C0\\u03C4\\u03BF\\u03BC\\u03AD\\u03C1\\u03B5\\u03B9\\u03B5\\u03C2\\:\n#XFLD\nLabel.ResponseCode=\\u039A\\u03C9\\u03B4\\u03B9\\u03BA\\u03CC\\u03C2 \\u0391\\u03C0\\u03AC\\u03BD\\u03C4\\u03B7\\u03C3\\u03B7\\u03C2\\:\n#XFLD\nLabel.Description=\\u03A0\\u03B5\\u03C1\\u03B9\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE\n#XFLD\nLabel.CreatedByFullname=\\u0394\\u03B7\\u03BC\\u03B9\\u03BF\\u03C5\\u03C1\\u03B3\\u03AE\\u03B8\\u03B7\\u03BA\\u03B5 \\u0391\\u03C0\\u03CC\n#XFLD\nLabel.CreatedOn=\\u0394\\u03B7\\u03BC\\u03B9\\u03BF\\u03C5\\u03C1\\u03B3\\u03AE\\u03B8\\u03B7\\u03BA\\u03B5 \\u03A3\\u03C4\\u03B9\\u03C2\n#XFLD\nLabel.ChangedByFullname=\\u0391\\u03BB\\u03BB\\u03B1\\u03B3\\u03BC\\u03AD\\u03BD\\u03BF \\u0391\\u03C0\\u03CC\n#XFLD\nLabel.ChangedOn=\\u0391\\u03BB\\u03BB\\u03B1\\u03BE\\u03B5 \\u03A3\\u03C4\\u03B9\\u03C2\n#XFLD\nLabel.PageTitle=\\u03A4\\u03AF\\u03C4\\u03BB\\u03BF\\u03C2 \\u03A3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1\\u03C2\n#XFLD\nLabel.AssignedRole=\\u0391\\u03BD\\u03C4\\u03B9\\u03C3\\u03C4\\u03BF\\u03B9\\u03C7\\u03B9\\u03C3\\u03BC\\u03AD\\u03BD\\u03BF\\u03C2 \\u03A1\\u03CC\\u03BB\\u03BF\\u03C2\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=\\u03A4\\u03AF\\u03C4\\u03BB\\u03BF\\u03C2\n#XCOL\nColumn.SpaceDescription=\\u03A0\\u03B5\\u03C1\\u03B9\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE\n#XCOL\nColumn.SpacePackage=\\u03A0\\u03B1\\u03BA\\u03AD\\u03C4\\u03BF\n#XCOL\nColumn.SpaceWorkbenchRequest=\\u0391\\u03AF\\u03C4\\u03B7\\u03C3\\u03B7 \\u03A0\\u03B5\\u03B4\\u03AF\\u03BF\\u03C5 \\u0395\\u03C1\\u03B3\\u03B1\\u03C3\\u03B9\\u03CE\\u03BD\n#XCOL\nColumn.SpaceCreatedBy=\\u0394\\u03B7\\u03BC\\u03B9\\u03BF\\u03C5\\u03C1\\u03B3\\u03B7\\u03BC\\u03AD\\u03BD\\u03BF \\u0391\\u03C0\\u03CC\n#XCOL\nColumn.SpaceCreatedOn=\\u0394\\u03B7\\u03BC\\u03B9\\u03BF\\u03C5\\u03C1\\u03B3\\u03AE\\u03B8\\u03B7\\u03BA\\u03B5 \\u03A3\\u03C4\\u03B9\\u03C2\n#XCOL\nColumn.SpaceChangedBy=\\u0391\\u03BB\\u03BB\\u03B1\\u03B3\\u03BC\\u03AD\\u03BD\\u03BF \\u0391\\u03C0\\u03CC\n#XCOL\nColumn.SpaceChangedOn=\\u0391\\u03BB\\u03BB\\u03B1\\u03BE\\u03B5 \\u03A3\\u03C4\\u03B9\\u03C2\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=\\u03A4\\u03AF\\u03C4\\u03BB\\u03BF\\u03C2\n#XCOL\nColumn.PageDescription=\\u03A0\\u03B5\\u03C1\\u03B9\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE\n#XCOL\nColumn.PagePackage=\\u03A0\\u03B1\\u03BA\\u03AD\\u03C4\\u03BF\n#XCOL\nColumn.PageWorkbenchRequest=\\u0391\\u03AF\\u03C4\\u03B7\\u03C3\\u03B7 \\u03A0\\u03B5\\u03B4\\u03AF\\u03BF\\u03C5 \\u0395\\u03C1\\u03B3\\u03B1\\u03C3\\u03B9\\u03CE\\u03BD\n#XCOL\nColumn.PageCreatedBy=\\u0394\\u03B7\\u03BC\\u03B9\\u03BF\\u03C5\\u03C1\\u03B3\\u03B7\\u03BC\\u03AD\\u03BD\\u03BF \\u0391\\u03C0\\u03CC\n#XCOL\nColumn.PageCreatedOn=\\u0394\\u03B7\\u03BC\\u03B9\\u03BF\\u03C5\\u03C1\\u03B3\\u03AE\\u03B8\\u03B7\\u03BA\\u03B5 \\u03A3\\u03C4\\u03B9\\u03C2\n#XCOL\nColumn.PageChangedBy=\\u0391\\u03BB\\u03BB\\u03B1\\u03B3\\u03BC\\u03AD\\u03BD\\u03BF \\u0391\\u03C0\\u03CC\n#XCOL\nColumn.PageChangedOn=\\u0391\\u03BB\\u03BB\\u03B1\\u03BE\\u03B5 \\u03A3\\u03C4\\u03B9\\u03C2\n\n#XTOL\nPlaceholder.CopySpaceTitle=\\u0391\\u03BD\\u03C4\\u03AF\\u03B3\\u03C1\\u03B1\\u03C6\\u03BF \\u03C4\\u03BF\\u03C5 \\u00AB{0}\\u00BB\n#XTOL\nPlaceholder.CopySpaceID=\\u0391\\u03BD\\u03C4\\u03AF\\u03B3\\u03C1\\u03B1\\u03C6\\u03BF \\u03C4\\u03BF\\u03C5 \\u00AB{0}\\u00BB\n\n#XMSG\nMessage.NoInternetConnection=\\u0395\\u03BB\\u03AD\\u03B3\\u03BE\\u03C4\\u03B5 \\u03C4\\u03B7 \\u03C3\\u03CD\\u03BD\\u03B4\\u03B5\\u03C3\\u03AE \\u03C3\\u03B1\\u03C2 \\u03C3\\u03C4\\u03BF \\u03B4\\u03B9\\u03B1\\u03B4\\u03AF\\u03BA\\u03C4\\u03C5\\u03BF.\n#XMSG\nMessage.SavedChanges=\\u039F\\u03B9 \\u03B1\\u03BB\\u03BB\\u03B1\\u03B3\\u03AD\\u03C2 \\u03C3\\u03B1\\u03C2 \\u03B1\\u03C0\\u03BF\\u03B8\\u03B7\\u03BA\\u03B5\\u03CD\\u03C4\\u03B7\\u03BA\\u03B1\\u03BD.\n#XMSG\nMessage.InvalidPageID=\\u03A7\\u03C1\\u03B7\\u03C3\\u03B9\\u03BC\\u03BF\\u03C0\\u03BF\\u03B9\\u03AE\\u03C3\\u03C4\\u03B5 \\u03BC\\u03CC\\u03BD\\u03BF \\u03C4\\u03BF\\u03C5\\u03C2 \\u03B5\\u03BE\\u03AE\\u03C2 \\u03C7\\u03B1\\u03C1\\u03B1\\u03BA\\u03C4\\u03AE\\u03C1\\u03B5\\u03C2\\: \\u0391-\\u0396, 0-9, _ and /. \\u03A4\\u03BF ID \\u03C3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1\\u03C2 \\u03B4\\u03B5\\u03BD \\u03C0\\u03C1\\u03AD\\u03C0\\u03B5\\u03B9 \\u03BD\\u03B1 \\u03BE\\u03B5\\u03BA\\u03B9\\u03BD\\u03AC\\u03B5\\u03B9 \\u03BC\\u03B5 \\u03B1\\u03C1\\u03B9\\u03B8\\u03BC\\u03CC.\n#XMSG\nMessage.EmptySpaceID=\\u0395\\u03B9\\u03C3\\u03AC\\u03B3\\u03B5\\u03C4\\u03B5 \\u03AD\\u03B3\\u03BA\\u03C5\\u03C1\\u03BF ID \\u03C7\\u03CE\\u03C1\\u03BF\\u03C5.\n#XMSG\nMessage.EmptyTitle=\\u0395\\u03B9\\u03C3\\u03AC\\u03B3\\u03B5\\u03C4\\u03B5 \\u03AD\\u03B3\\u03BA\\u03C5\\u03C1\\u03BF \\u03C4\\u03AF\\u03C4\\u03BB\\u03BF.\n#XMSG\nMessage.SuccessDeletePage=\\u03A4\\u03BF \\u03B5\\u03C0\\u03B9\\u03BB\\u03B5\\u03B3\\u03BC\\u03AD\\u03BD\\u03BF \\u03B1\\u03BD\\u03C4\\u03B9\\u03BA\\u03B5\\u03AF\\u03BC\\u03B5\\u03BD\\u03BF \\u03B4\\u03B9\\u03B1\\u03B3\\u03C1\\u03AC\\u03C6\\u03B7\\u03BA\\u03B5.\n#XMSG\nMessage.ClipboardCopySuccess=\\u039B\\u03B5\\u03C0\\u03C4\\u03BF\\u03BC\\u03AD\\u03C1\\u03B5\\u03B9\\u03B5\\u03C2 \\u03B1\\u03BD\\u03C4\\u03B9\\u03B3\\u03C1\\u03AC\\u03C6\\u03B7\\u03BA\\u03B1\\u03BD \\u03B5\\u03C0\\u03B9\\u03C4\\u03C5\\u03C7\\u03CE\\u03C2.\n#YMSE\nMessage.ClipboardCopyFail=\\u03A3\\u03C6\\u03AC\\u03BB\\u03BC\\u03B1 \\u03B5\\u03BC\\u03C6\\u03B1\\u03BD\\u03AF\\u03C3\\u03C4\\u03B7\\u03BA\\u03B5 \\u03B1\\u03BA\\u03C4\\u03AC \\u03C4\\u03B7\\u03BD \\u03B1\\u03BD\\u03C4\\u03B9\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE \\u03BB\\u03B5\\u03C0\\u03C4\\u03BF\\u03BC\\u03B5\\u03C1\\u03B5\\u03B9\\u03CE\\u03BD.\n#XMSG\nMessage.SpaceCreated=\\u039F \\u03C7\\u03CE\\u03C1\\u03BF\\u03C2 \\u03B4\\u03B7\\u03BC\\u03B9\\u03BF\\u03C5\\u03C1\\u03B3\\u03AE\\u03B8\\u03B7\\u03BA\\u03B5.\n\n#XMSG\nMessage.NavigationTargetError=\\u03A3\\u03C4\\u03CC\\u03C7\\u03BF\\u03C2 \\u03C0\\u03BB\\u03BF\\u03AE\\u03B3\\u03B7\\u03C3\\u03B7\\u03C2 \\u03B4\\u03B5\\u03BD \\u03B5\\u03C0\\u03B9\\u03BB\\u03CD\\u03B8\\u03B7\\u03BA\\u03B5.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=\\u0391\\u03C0\\u03BF\\u03C4\\u03C5\\u03C7\\u03AF\\u03B1 \\u03B5\\u03C0\\u03AF\\u03BB\\u03C5\\u03C3\\u03B7\\u03C2 \\u03C3\\u03C4\\u03CC\\u03C7\\u03BF\\u03C5 \\u03C0\\u03BB\\u03BF\\u03AE\\u03B3\\u03B7\\u03C3\\u03B7\\u03C2 \\u03C4\\u03BF\\u03C5 \\u03C0\\u03BB\\u03B1\\u03BA\\u03B9\\u03B4\\u03AF\\u03BF\\u03C5 \\u00AB{0}\\u00BB.\\n\\n\\u0391\\u03C5\\u03C4\\u03CC \\u03C0\\u03B9\\u03B8\\u03B1\\u03BD\\u03CE\\u03C2 \\u03BD\\u03B1 \\u03C0\\u03C1\\u03BF\\u03BA\\u03B1\\u03BB\\u03B5\\u03AF\\u03C4\\u03B1\\u03B9 \\u03B1\\u03C0\\u03CC \\u03BB\\u03B1\\u03BD\\u03B8\\u03B1\\u03C3\\u03BC\\u03AD\\u03BD\\u03B7 \\u03B4\\u03B9\\u03B1\\u03BC\\u03CC\\u03C1\\u03C6\\u03C9\\u03C3\\u03B7 \\u03C0\\u03B5\\u03C1\\u03B9\\u03B5\\u03C7\\u03BF\\u03BC\\u03AD\\u03BD\\u03BF\\u03C5 SAP Fiori launchpad. \\u0397 \\u03BF\\u03C0\\u03C4\\u03B9\\u03BA\\u03BF\\u03C0\\u03BF\\u03AF\\u03B7\\u03C3\\u03B7 \\u03B4\\u03B5\\u03BD \\u03C0\\u03BC\\u03BF\\u03C1\\u03B5\\u03AF \\u03BD\\u03B1 \\u03B1\\u03BD\\u03BF\\u03AF\\u03BE\\u03B5\\u03B9 \\u03C4\\u03B7\\u03BD \\u03B5\\u03C6\\u03B1\\u03C1\\u03BC\\u03BF\\u03B3\\u03AE.\n#XMSG\nMessage.PageIsOutdated=\\u039C\\u03AF\\u03B1 \\u03BD\\u03AD\\u03B1 \\u03AD\\u03BA\\u03B4\\u03BF\\u03C3\\u03B7 \\u03B1\\u03C5\\u03C4\\u03AE\\u03C2 \\u03C4\\u03B7\\u03C2 \\u03C3\\u03B5\\u03BB\\u03AF\\u03B4\\u03B1\\u03C2 \\u03B1\\u03C0\\u03BF\\u03B8\\u03B7\\u03BA\\u03B5\\u03CD\\u03C4\\u03B7\\u03BA\\u03B5 \\u03AE\\u03B4\\u03B7.\n#XMSG\nMessage.SaveChanges=\\u0391\\u03C0\\u03BF\\u03B8\\u03B7\\u03BA\\u03B5\\u03CD\\u03C3\\u03C4\\u03B5 \\u03C4\\u03B9\\u03C2 \\u03B1\\u03BB\\u03BB\\u03B1\\u03B3\\u03AD\\u03C2.\n#XMSG\nMessage.NoSpaces=\\u03A7\\u03CE\\u03C1\\u03BF\\u03B9 \\u03BC\\u03B7 \\u03B4\\u03B9\\u03B1\\u03B8\\u03AD\\u03C3\\u03B9\\u03BC\\u03BF\\u03B9.\n#XMSG\nMessage.NoSpacesFound=\\u03A7\\u03CE\\u03C1\\u03BF\\u03B9 \\u03B4\\u03B5\\u03BD \\u03B2\\u03C1\\u03AD\\u03B8\\u03B7\\u03BA\\u03B1\\u03BD. \\u03A0\\u03C1\\u03BF\\u03C3\\u03C0\\u03B1\\u03B8\\u03AE\\u03C3\\u03C4\\u03B5 \\u03BD\\u03B1 \\u03C0\\u03C1\\u03BF\\u03C3\\u03B1\\u03C1\\u03BC\\u03CC\\u03C3\\u03B5\\u03C4\\u03B5 \\u03C4\\u03B7\\u03BD \\u03B1\\u03BD\\u03B1\\u03B6\\u03AE\\u03C4\\u03B7\\u03C3\\u03AE \\u03C3\\u03B1\\u03C2.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=\\u039D\\u03AD\\u03BF\\u03C2 \\u03A7\\u03CE\\u03C1\\u03BF\\u03C2\n#XTIT\nDeleteDialog.Title=\\u0394\\u03B9\\u03B1\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE\n#XMSG\nDeleteDialog.Text=\\u0398\\u03AD\\u03BB\\u03B5\\u03C4\\u03B5 \\u03BD\\u03B1 \\u03B4\\u03B9\\u03B1\\u03B3\\u03C1\\u03AC\\u03C8\\u03B5\\u03C4\\u03B5 \\u03C4\\u03BF\\u03BD \\u03B5\\u03C0\\u03B9\\u03BB\\u03B5\\u03B3\\u03BC\\u03AD\\u03BD\\u03BF \\u03C7\\u03CE\\u03C1\\u03BF;\n#XBUT\nDeleteDialog.ConfirmButton=\\u0394\\u03B9\\u03B1\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE\n#XTIT\nDeleteDialog.LockedTitle=\\u03A7\\u03CE\\u03C1\\u03BF\\u03C2 \\u039A\\u03BB\\u03B5\\u03B9\\u03B4\\u03CE\\u03B8\\u03B7\\u03BA\\u03B5\n#XMSG\nDeleteDialog.LockedText=\\u039F \\u03B5\\u03C0\\u03B9\\u03BB\\u03B5\\u03B3\\u03BC\\u03AD\\u03BD\\u03BF\\u03C2 \\u03C7\\u03CE\\u03C1\\u03BF\\u03C2 \\u03B5\\u03AF\\u03BD\\u03B1\\u03B9 \\u03BA\\u03BB\\u03B5\\u03B9\\u03B4\\u03C9\\u03BC\\u03AD\\u03BD\\u03BF\\u03C2 \\u03B1\\u03C0\\u03CC \\u03C7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7 \\u00AB{0}\\u00BB.\n#XMSG\nDeleteDialog.TransportRequired=\\u0395\\u03C0\\u03B9\\u03BB\\u03AD\\u03BE\\u03C4\\u03B5 \\u03AD\\u03BD\\u03B1 \\u03C0\\u03B1\\u03BA\\u03AD\\u03C4\\u03BF \\u03BC\\u03B5\\u03C4\\u03B1\\u03C6\\u03BF\\u03C1\\u03AC\\u03C2 \\u03B3\\u03B9\\u03B1 \\u03BD\\u03B1 \\u03B4\\u03B9\\u03B1\\u03B3\\u03C1\\u03AC\\u03C8\\u03B5\\u03C4\\u03B5 \\u03C4\\u03BF\\u03BD \\u03B5\\u03C0\\u03B9\\u03BB\\u03B5\\u03B3\\u03BC\\u03AD\\u03BD\\u03BF \\u03C7\\u03CE\\u03C1\\u03BF.\n\n#XMSG\nEditDialog.LockedText=\\u039F \\u03B5\\u03C0\\u03B9\\u03BB\\u03B5\\u03B3\\u03BC\\u03AD\\u03BD\\u03BF\\u03C2 \\u03C7\\u03CE\\u03C1\\u03BF\\u03C2 \\u03B5\\u03AF\\u03BD\\u03B1\\u03B9 \\u03BA\\u03BB\\u03B5\\u03B9\\u03B4\\u03C9\\u03BC\\u03AD\\u03BD\\u03BF\\u03C2 \\u03B1\\u03C0\\u03CC \\u03C7\\u03C1\\u03AE\\u03C3\\u03C4\\u03B7 \\u00AB{0}\\u00BB.\n#XMSG\nEditDialog.TransportRequired=\\u0395\\u03C0\\u03B9\\u03BB\\u03AD\\u03BE\\u03C4\\u03B5 \\u03AD\\u03BD\\u03B1 \\u03C0\\u03B1\\u03BA\\u03AD\\u03C4\\u03BF \\u03BC\\u03B5\\u03C4\\u03B1\\u03C6\\u03BF\\u03C1\\u03AC\\u03C2 \\u03B3\\u03B9\\u03B1 \\u03BD\\u03B1 \\u03B5\\u03C0\\u03B5\\u03BE\\u03B5\\u03C1\\u03B3\\u03B1\\u03C3\\u03C4\\u03B5\\u03AF\\u03C4\\u03B5 \\u03C4\\u03BF\\u03BD \\u03B5\\u03C0\\u03B9\\u03BB\\u03B5\\u03B3\\u03BC\\u03AD\\u03BD\\u03BF \\u03C7\\u03CE\\u03C1\\u03BF.\n#XTIT\nEditDialog.Title=\\u0395\\u03C0\\u03B5\\u03BE\\u03B5\\u03C1\\u03B3\\u03B1\\u03C3\\u03AF\\u03B1 \\u03C7\\u03CE\\u03C1\\u03BF\\u03C5\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=\\u0391\\u03C5\\u03C4\\u03CC\\u03C2 \\u03BF \\u03C7\\u03CE\\u03C1\\u03BF\\u03C2 \\u03B4\\u03B7\\u03BC\\u03B9\\u03BF\\u03C5\\u03C1\\u03B3\\u03AE\\u03B8\\u03B7\\u03BA\\u03B5 \\u03C3\\u03B5 \\u03B3\\u03BB\\u03CE\\u03C3\\u03C3\\u03B1 \\u00AB{0}\\u00BB \\u03B1\\u03BB\\u03BB\\u03AC \\u03B7 \\u03B3\\u03BB\\u03CE\\u03C3\\u03C3\\u03B1 \\u03C3\\u03CD\\u03BD\\u03B4\\u03B5\\u03C3\\u03AE\\u03C2 \\u03C3\\u03B1\\u03C2 \\u03BF\\u03C1\\u03AF\\u03B6\\u03B5\\u03C4\\u03B1\\u03B9 \\u03C3\\u03B5 \\u00AB{1}\\u00BB. \\u0391\\u03BB\\u03BB\\u03AC\\u03BE\\u03C4\\u03B5 \\u03C4\\u03B7\\u03BD \\u03B3\\u03BB\\u03CE\\u03C3\\u03C3\\u03B1 \\u03C3\\u03CD\\u03BD\\u03B4\\u03B5\\u03C3\\u03B7\\u03C2 \\u03C3\\u03B5 \\u00AB{0}\\u00BB \\u03B3\\u03B9\\u03B1 \\u03BD\\u03B1 \\u03C3\\u03C5\\u03BD\\u03B5\\u03C7\\u03AF\\u03C3\\u03B5\\u03C4\\u03B5.\n\n#XTIT\nErrorDialog.Title=\\u03A3\\u03C6\\u03AC\\u03BB\\u03BC\\u03B1\n\n#XTIT\nSpaceOverview.Title=\\u03A3\\u03C5\\u03BD\\u03C4\\u03AE\\u03C1\\u03B7\\u03C3\\u03B7 \\u03A3\\u03B5\\u03BB\\u03AF\\u03B4\\u03C9\\u03BD\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=\\u0394\\u03B9\\u03AC\\u03C4\\u03B1\\u03BE\\u03B7\n\n#XTIT\nCopyDialog.Title=\\u0391\\u03BD\\u03C4\\u03B9\\u03B3\\u03C1\\u03B1\\u03C6\\u03AE \\u03A7\\u03CE\\u03C1\\u03BF\\u03C5\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=\\u0398\\u03AD\\u03BB\\u03B5\\u03C4\\u03B5 \\u03BD\\u03B1 \\u03B1\\u03BD\\u03C4\\u03B9\\u03B3\\u03C1\\u03AC\\u03C8\\u03B5\\u03C4\\u03B5 \\u00AB{0}\\u00BB;\n#XFLD\nCopyDialog.NewID=\\u0391\\u03BD\\u03C4\\u03AF\\u03B3\\u03C1\\u03B1\\u03C6\\u03BF \\u03C4\\u03BF\\u03C5 \\u00AB{0}\\u00BB\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=\\u039B\\u03C5\\u03C0\\u03BF\\u03CD\\u03BC\\u03B1\\u03C3\\u03C4\\u03B5, \\u03BF \\u03C7\\u03CE\\u03C1\\u03BF\\u03C2 \\u03B4\\u03B5\\u03BD \\u03B2\\u03C1\\u03AD\\u03B8\\u03B7\\u03BA\\u03B5.\n#XLNK\nErrorPage.Link=\\u03A3\\u03C5\\u03BD\\u03C4\\u03AE\\u03C1\\u03B7\\u03C3\\u03B7 \\u03A7\\u03CE\\u03C1\\u03C9\\u03BD\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_en.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=Maintain Spaces\n\n#XBUT\nButton.Add=Add\n#XBUT\nButton.Cancel=Cancel\n#XBUT\nButton.Copy=Copy\n#XBUT\nButton.Create=Create\n#XBUT\nButton.Delete=Delete\n#XBUT\nButton.Edit=Edit\n#XBUT\nButton.Save=Save\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowPages=Show Pages\n#XBUT\nButton.HidePages=Hide Pages\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=Issues\\: {0}\n#XBUT\nButton.SortPages=Toggle Pages Sort Order\n#XBUT\nButton.ShowDetails=Show Details\n#XBUT\nButton.ErrorMsg=Error Messages\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=Search\n#XTOL\nTooltip.SearchForTiles=Search for Spaces\n\n#XFLD\nLabel.SpaceID=Space ID\n#XFLD\nLabel.Title=Title\n#XFLD\nLabel.WorkbenchRequest=Workbench Request\n#XFLD\nLabel.Package=Package\n#XFLD\nLabel.TransportInformation=Transport Information\n#XFLD\nLabel.Details=Details\\:\n#XFLD\nLabel.ResponseCode=Response Code\\:\n#XFLD\nLabel.Description=Description\n#XFLD\nLabel.CreatedByFullname=Created By\n#XFLD\nLabel.CreatedOn=Created On\n#XFLD\nLabel.ChangedByFullname=Changed By\n#XFLD\nLabel.ChangedOn=Changed On\n#XFLD\nLabel.PageTitle=Page Title\n#XFLD\nLabel.AssignedRole=Assigned Role\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=Title\n#XCOL\nColumn.SpaceDescription=Description\n#XCOL\nColumn.SpacePackage=Package\n#XCOL\nColumn.SpaceWorkbenchRequest=Workbench Request\n#XCOL\nColumn.SpaceCreatedBy=Created By\n#XCOL\nColumn.SpaceCreatedOn=Created On\n#XCOL\nColumn.SpaceChangedBy=Changed By\n#XCOL\nColumn.SpaceChangedOn=Changed On\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Title\n#XCOL\nColumn.PageDescription=Description\n#XCOL\nColumn.PagePackage=Package\n#XCOL\nColumn.PageWorkbenchRequest=Workbench Request\n#XCOL\nColumn.PageCreatedBy=Created By\n#XCOL\nColumn.PageCreatedOn=Created On\n#XCOL\nColumn.PageChangedBy=Changed By\n#XCOL\nColumn.PageChangedOn=Changed On\n\n#XTOL\nPlaceholder.CopySpaceTitle=Copy of "{0}"\n#XTOL\nPlaceholder.CopySpaceID=Copy of "{0}"\n\n#XMSG\nMessage.NoInternetConnection=Please check your internet connection.\n#XMSG\nMessage.SavedChanges=Your changes have been saved.\n#XMSG\nMessage.InvalidPageID=Please only use the following characters\\: A-Z, 0-9, _ and /. The page ID should not start with a number.\n#XMSG\nMessage.EmptySpaceID=Please provide a valid space ID.\n#XMSG\nMessage.EmptyTitle=Please provide a valid title.\n#XMSG\nMessage.SuccessDeletePage=The selected object has been deleted.\n#XMSG\nMessage.ClipboardCopySuccess=Details were copied successfully.\n#YMSE\nMessage.ClipboardCopyFail=An error occurred while copying details.\n#XMSG\nMessage.SpaceCreated=The space has been created.\n\n#XMSG\nMessage.NavigationTargetError=Navigation target could not be resolved.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=Failed to resolve the navigation target of tile\\: "{0}".\\n\\nThis is most likely caused by an invalid configuration of SAP Fiori launchpad content. The visualization cannot open an application.\n#XMSG\nMessage.PageIsOutdated=A newer version of this page has already been saved.\n#XMSG\nMessage.SaveChanges=Please save your changes.\n#XMSG\nMessage.NoSpaces=No spaces available.\n#XMSG\nMessage.NoSpacesFound=No spaces found. Try adjusting your search.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=New Space\n#XTIT\nDeleteDialog.Title=Delete\n#XMSG\nDeleteDialog.Text=Are you sure you want to delete the selected space?\n#XBUT\nDeleteDialog.ConfirmButton=Delete\n#XTIT\nDeleteDialog.LockedTitle=Space Locked\n#XMSG\nDeleteDialog.LockedText=The selected space is locked by user "{0}".\n#XMSG\nDeleteDialog.TransportRequired=Please select a transport package to delete the selected space.\n\n#XMSG\nEditDialog.LockedText=The selected space is locked by user "{0}".\n#XMSG\nEditDialog.TransportRequired=Please select a transport package to edit the selected space.\n#XTIT\nEditDialog.Title=Edit space\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=This space has been created in language "{0}" but your logon language is set to "{1}". Please change your logon language to "{0}" to proceed.\n\n#XTIT\nErrorDialog.Title=Error\n\n#XTIT\nSpaceOverview.Title=Maintain Pages\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=Layout\n\n#XTIT\nCopyDialog.Title=Copy Space\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=Do you want to copy "{0}"?\n#XFLD\nCopyDialog.NewID=Copy of "{0}"\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=Sorry, we could not find this space.\n#XLNK\nErrorPage.Link=Maintain Spaces\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_en_US_sappsd.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=[[[\\u039C\\u0105\\u012F\\u014B\\u0163\\u0105\\u012F\\u014B \\u015C\\u03C1\\u0105\\u010B\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219]]]\n\n#XBUT\nButton.Add=[[[\\u0100\\u018C\\u018C\\u2219]]]\n#XBUT\nButton.Cancel=[[[\\u0108\\u0105\\u014B\\u010B\\u0113\\u013A\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XBUT\nButton.Copy=[[[\\u0108\\u014F\\u03C1\\u0177]]]\n#XBUT\nButton.Create=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XBUT\nButton.Delete=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XBUT\nButton.Edit=[[[\\u0114\\u018C\\u012F\\u0163]]]\n#XBUT\nButton.Save=[[[\\u015C\\u0105\\u028B\\u0113]]]\n#XBUT\nButton.Ok=[[[\\u014E\\u0136\\u2219\\u2219]]]\n#XBUT\nButton.ShowPages=[[[\\u015C\\u0125\\u014F\\u0175 \\u01A4\\u0105\\u011F\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219]]]\n#XBUT\nButton.HidePages=[[[\\u0124\\u012F\\u018C\\u0113 \\u01A4\\u0105\\u011F\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219]]]\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=[[[\\u012C\\u015F\\u015F\\u0171\\u0113\\u015F\\: {0}]]]\n#XBUT\nButton.SortPages=[[[\\u0162\\u014F\\u011F\\u011F\\u013A\\u0113 \\u01A4\\u0105\\u011F\\u0113\\u015F \\u015C\\u014F\\u0157\\u0163 \\u014E\\u0157\\u018C\\u0113\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XBUT\nButton.ShowDetails=[[[\\u015C\\u0125\\u014F\\u0175 \\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XBUT\nButton.ErrorMsg=[[[\\u0114\\u0157\\u0157\\u014F\\u0157 \\u039C\\u0113\\u015F\\u015F\\u0105\\u011F\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XTOL\nTooltip.SearchForTiles=[[[\\u015C\\u0113\\u0105\\u0157\\u010B\\u0125 \\u0192\\u014F\\u0157 \\u015C\\u03C1\\u0105\\u010B\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XFLD\nLabel.SpaceID=[[[\\u015C\\u03C1\\u0105\\u010B\\u0113 \\u012C\\u010E\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.Title=[[[\\u0162\\u012F\\u0163\\u013A\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.WorkbenchRequest=[[[\\u0174\\u014F\\u0157\\u0137\\u0183\\u0113\\u014B\\u010B\\u0125 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.Package=[[[\\u01A4\\u0105\\u010B\\u0137\\u0105\\u011F\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.TransportInformation=[[[\\u0162\\u0157\\u0105\\u014B\\u015F\\u03C1\\u014F\\u0157\\u0163 \\u012C\\u014B\\u0192\\u014F\\u0157\\u0271\\u0105\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.Details=[[[\\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F\\:\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.ResponseCode=[[[\\u0158\\u0113\\u015F\\u03C1\\u014F\\u014B\\u015F\\u0113 \\u0108\\u014F\\u018C\\u0113\\:\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.Description=[[[\\u010E\\u0113\\u015F\\u010B\\u0157\\u012F\\u03C1\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.CreatedByFullname=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113\\u018C \\u0181\\u0177\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.CreatedOn=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113\\u018C \\u014E\\u014B\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.ChangedByFullname=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113\\u018C \\u0181\\u0177\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.ChangedOn=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113\\u018C \\u014E\\u014B\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.PageTitle=[[[\\u01A4\\u0105\\u011F\\u0113 \\u0162\\u012F\\u0163\\u013A\\u0113\\u2219\\u2219\\u2219\\u2219]]]\n#XFLD\nLabel.AssignedRole=[[[\\u0100\\u015F\\u015F\\u012F\\u011F\\u014B\\u0113\\u018C \\u0158\\u014F\\u013A\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XCOL\nColumn.SpaceID=[[[\\u012C\\u010E\\u2219\\u2219]]]\n#XCOL\nColumn.SpaceTitle=[[[\\u0162\\u012F\\u0163\\u013A\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XCOL\nColumn.SpaceDescription=[[[\\u010E\\u0113\\u015F\\u010B\\u0157\\u012F\\u03C1\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XCOL\nColumn.SpacePackage=[[[\\u01A4\\u0105\\u010B\\u0137\\u0105\\u011F\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XCOL\nColumn.SpaceWorkbenchRequest=[[[\\u0174\\u014F\\u0157\\u0137\\u0183\\u0113\\u014B\\u010B\\u0125 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XCOL\nColumn.SpaceCreatedBy=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113\\u018C \\u0181\\u0177\\u2219\\u2219\\u2219\\u2219]]]\n#XCOL\nColumn.SpaceCreatedOn=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113\\u018C \\u014E\\u014B\\u2219\\u2219\\u2219\\u2219]]]\n#XCOL\nColumn.SpaceChangedBy=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113\\u018C \\u0181\\u0177\\u2219\\u2219\\u2219\\u2219]]]\n#XCOL\nColumn.SpaceChangedOn=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113\\u018C \\u014E\\u014B\\u2219\\u2219\\u2219\\u2219]]]\n\n#XCOL\nColumn.PageID=[[[\\u012C\\u010E\\u2219\\u2219]]]\n#XCOL\nColumn.PageTitle=[[[\\u0162\\u012F\\u0163\\u013A\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XCOL\nColumn.PageDescription=[[[\\u010E\\u0113\\u015F\\u010B\\u0157\\u012F\\u03C1\\u0163\\u012F\\u014F\\u014B\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XCOL\nColumn.PagePackage=[[[\\u01A4\\u0105\\u010B\\u0137\\u0105\\u011F\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XCOL\nColumn.PageWorkbenchRequest=[[[\\u0174\\u014F\\u0157\\u0137\\u0183\\u0113\\u014B\\u010B\\u0125 \\u0158\\u0113\\u01A3\\u0171\\u0113\\u015F\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XCOL\nColumn.PageCreatedBy=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113\\u018C \\u0181\\u0177\\u2219\\u2219\\u2219\\u2219]]]\n#XCOL\nColumn.PageCreatedOn=[[[\\u0108\\u0157\\u0113\\u0105\\u0163\\u0113\\u018C \\u014E\\u014B\\u2219\\u2219\\u2219\\u2219]]]\n#XCOL\nColumn.PageChangedBy=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113\\u018C \\u0181\\u0177\\u2219\\u2219\\u2219\\u2219]]]\n#XCOL\nColumn.PageChangedOn=[[[\\u0108\\u0125\\u0105\\u014B\\u011F\\u0113\\u018C \\u014E\\u014B\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTOL\nPlaceholder.CopySpaceTitle=[[[\\u0108\\u014F\\u03C1\\u0177 \\u014F\\u0192 "{0}"]]]\n#XTOL\nPlaceholder.CopySpaceID=[[[\\u0108\\u014F\\u03C1\\u0177 \\u014F\\u0192 "{0}"]]]\n\n#XMSG\nMessage.NoInternetConnection=[[[\\u01A4\\u013A\\u0113\\u0105\\u015F\\u0113 \\u010B\\u0125\\u0113\\u010B\\u0137 \\u0177\\u014F\\u0171\\u0157 \\u012F\\u014B\\u0163\\u0113\\u0157\\u014B\\u0113\\u0163 \\u010B\\u014F\\u014B\\u014B\\u0113\\u010B\\u0163\\u012F\\u014F\\u014B.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.SavedChanges=[[[\\u0176\\u014F\\u0171\\u0157 \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F \\u0125\\u0105\\u028B\\u0113 \\u0183\\u0113\\u0113\\u014B \\u015F\\u0105\\u028B\\u0113\\u018C.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.InvalidPageID=[[[\\u01A4\\u013A\\u0113\\u0105\\u015F\\u0113 \\u014F\\u014B\\u013A\\u0177 \\u0171\\u015F\\u0113 \\u0163\\u0125\\u0113 \\u0192\\u014F\\u013A\\u013A\\u014F\\u0175\\u012F\\u014B\\u011F \\u010B\\u0125\\u0105\\u0157\\u0105\\u010B\\u0163\\u0113\\u0157\\u015F\\: \\u0100-\\u017B, 0-9, _ \\u0105\\u014B\\u018C /. \\u0162\\u0125\\u0113 \\u03C1\\u0105\\u011F\\u0113 \\u012C\\u010E \\u015F\\u0125\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u015F\\u0163\\u0105\\u0157\\u0163 \\u0175\\u012F\\u0163\\u0125 \\u0105 \\u014B\\u0171\\u0271\\u0183\\u0113\\u0157.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.EmptySpaceID=[[[\\u01A4\\u013A\\u0113\\u0105\\u015F\\u0113 \\u03C1\\u0157\\u014F\\u028B\\u012F\\u018C\\u0113 \\u0105 \\u028B\\u0105\\u013A\\u012F\\u018C \\u015C\\u03C1\\u0105\\u010B\\u0113 \\u012C\\u010E.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.EmptyTitle=[[[\\u01A4\\u013A\\u0113\\u0105\\u015F\\u0113 \\u03C1\\u0157\\u014F\\u028B\\u012F\\u018C\\u0113 \\u0105 \\u028B\\u0105\\u013A\\u012F\\u018C \\u0163\\u012F\\u0163\\u013A\\u0113.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.SuccessDeletePage=[[[\\u0162\\u0125\\u0113 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C \\u03C1\\u0105\\u011F\\u0113 \\u0125\\u0105\\u015F \\u0183\\u0113\\u0113\\u014B \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113\\u018C.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.ClipboardCopySuccess=[[[\\u010E\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F \\u0175\\u0113\\u0157\\u0113 \\u010B\\u014F\\u03C1\\u012F\\u0113\\u018C \\u015F\\u0171\\u010B\\u010B\\u0113\\u015F\\u015F\\u0192\\u0171\\u013A\\u013A\\u0177.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#YMSE\nMessage.ClipboardCopyFail=[[[\\u0100\\u014B \\u0113\\u0157\\u0157\\u014F\\u0157 \\u014F\\u010B\\u010B\\u0171\\u0157\\u0157\\u0113\\u018C \\u0175\\u0125\\u012F\\u013A\\u0113 \\u010B\\u014F\\u03C1\\u0177\\u012F\\u014B\\u011F \\u018C\\u0113\\u0163\\u0105\\u012F\\u013A\\u015F.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.SpaceCreated=[[[\\u0162\\u0125\\u0113 \\u015F\\u03C1\\u0105\\u010B\\u0113 \\u0125\\u0105\\u015F \\u0183\\u0113\\u0113\\u014B \\u010B\\u0157\\u0113\\u0105\\u0163\\u0113\\u018C.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XMSG\nMessage.NavigationTargetError=[[[\\u0143\\u0105\\u028B\\u012F\\u011F\\u0105\\u0163\\u012F\\u014F\\u014B \\u0163\\u0105\\u0157\\u011F\\u0113\\u0163 \\u010B\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u0183\\u0113 \\u0157\\u0113\\u015F\\u014F\\u013A\\u028B\\u0113\\u018C.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=[[[\\u0191\\u0105\\u012F\\u013A\\u0113\\u018C \\u0163\\u014F \\u0157\\u0113\\u015F\\u014F\\u013A\\u028B\\u0113 \\u0163\\u0125\\u0113 \\u014B\\u0105\\u028B\\u012F\\u011F\\u0105\\u0163\\u012F\\u014F\\u014B \\u0163\\u0105\\u0157\\u011F\\u0113\\u0163 \\u014F\\u0192 \\u0163\\u012F\\u013A\\u0113\\: "{0}".\\n\\n\\u0162\\u0125\\u012F\\u015F \\u012F\\u015F \\u0271\\u014F\\u015F\\u0163 \\u013A\\u012F\\u0137\\u0113\\u013A\\u0177 \\u010B\\u0105\\u0171\\u015F\\u0113\\u018C \\u0183\\u0177 \\u012F\\u014B\\u028B\\u0105\\u013A\\u012F\\u018C \\u010B\\u014F\\u014B\\u0192\\u012F\\u011F\\u0171\\u0157\\u0105\\u0163\\u012F\\u014F\\u014B \\u014F\\u0192 \\u015C\\u0100\\u01A4 \\u0191\\u012F\\u014F\\u0157\\u012F \\u013A\\u0105\\u0171\\u014B\\u010B\\u0125\\u03C1\\u0105\\u018C \\u010B\\u014F\\u014B\\u0163\\u0113\\u014B\\u0163. \\u0162\\u0125\\u0113 \\u028B\\u012F\\u015F\\u0171\\u0105\\u013A\\u012F\\u017E\\u0105\\u0163\\u012F\\u014F\\u014B \\u010B\\u0105\\u014B\\u014B\\u014F\\u0163 \\u014F\\u03C1\\u0113\\u014B \\u0105\\u014B \\u0105\\u03C1\\u03C1\\u013A\\u012F\\u010B\\u0105\\u0163\\u012F\\u014F\\u014B.]]]\n#XMSG\nMessage.PageIsOutdated=[[[\\u0100 \\u014B\\u0113\\u0175\\u0113\\u0157 \\u028B\\u0113\\u0157\\u015F\\u012F\\u014F\\u014B \\u014F\\u0192 \\u0163\\u0125\\u012F\\u015F \\u03C1\\u0105\\u011F\\u0113 \\u0125\\u0105\\u015F \\u0105\\u013A\\u0157\\u0113\\u0105\\u018C\\u0177 \\u0183\\u0113\\u0113\\u014B \\u015F\\u0105\\u028B\\u0113\\u018C.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.SaveChanges=[[[\\u01A4\\u013A\\u0113\\u0105\\u015F\\u0113 \\u015F\\u0105\\u028B\\u0113 \\u0177\\u014F\\u0171\\u0157 \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113\\u015F.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.NoSpaces=[[[\\u0143\\u014F \\u015F\\u03C1\\u0105\\u010B\\u0113\\u015F \\u0105\\u028B\\u0105\\u012F\\u013A\\u0105\\u0183\\u013A\\u0113.\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nMessage.NoSpacesFound=[[[\\u0143\\u014F \\u015F\\u03C1\\u0105\\u010B\\u0113\\u015F \\u0192\\u014F\\u0171\\u014B\\u018C. \\u0162\\u0157\\u0177 \\u0105\\u018C\\u0135\\u0171\\u015F\\u0163\\u012F\\u014B\\u011F \\u0177\\u014F\\u0171\\u0157 \\u015F\\u0113\\u0105\\u0157\\u010B\\u0125.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=[[[\\u0143\\u0113\\u0175 \\u015C\\u03C1\\u0105\\u010B\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XTIT\nDeleteDialog.Title=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nDeleteDialog.Text=[[[\\u0100\\u0157\\u0113 \\u0177\\u014F\\u0171 \\u015F\\u0171\\u0157\\u0113 \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113 \\u0163\\u0125\\u0113 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C \\u015F\\u03C1\\u0105\\u010B\\u0113?\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XBUT\nDeleteDialog.ConfirmButton=[[[\\u010E\\u0113\\u013A\\u0113\\u0163\\u0113\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XTIT\nDeleteDialog.LockedTitle=[[[\\u015C\\u03C1\\u0105\\u010B\\u0113 \\u013B\\u014F\\u010B\\u0137\\u0113\\u018C\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG\nDeleteDialog.LockedText=[[[\\u0162\\u0125\\u0113 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C \\u015F\\u03C1\\u0105\\u010B\\u0113 \\u012F\\u015F \\u013A\\u014F\\u010B\\u0137\\u0113\\u018C \\u0183\\u0177 \\u0171\\u015F\\u0113\\u0157 "{0}".]]]\n#XMSG\nDeleteDialog.TransportRequired=[[[\\u01A4\\u013A\\u0113\\u0105\\u015F\\u0113 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0105 \\u0163\\u0157\\u0105\\u014B\\u015F\\u03C1\\u014F\\u0157\\u0163 \\u03C1\\u0105\\u010B\\u0137\\u0105\\u011F\\u0113 \\u0163\\u014F \\u018C\\u0113\\u013A\\u0113\\u0163\\u0113 \\u0163\\u0125\\u0113 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C \\u015F\\u03C1\\u0105\\u010B\\u0113.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XMSG\nEditDialog.LockedText=[[[\\u0162\\u0125\\u0113 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C \\u015F\\u03C1\\u0105\\u010B\\u0113 \\u012F\\u015F \\u013A\\u014F\\u010B\\u0137\\u0113\\u018C \\u0183\\u0177 \\u0171\\u015F\\u0113\\u0157 "{0}".]]]\n#XMSG\nEditDialog.TransportRequired=[[[\\u01A4\\u013A\\u0113\\u0105\\u015F\\u0113 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163 \\u0105 \\u0163\\u0157\\u0105\\u014B\\u015F\\u03C1\\u014F\\u0157\\u0163 \\u03C1\\u0105\\u010B\\u0137\\u0105\\u011F\\u0113 \\u0163\\u014F \\u0113\\u018C\\u012F\\u0163 \\u0163\\u0125\\u0113 \\u015F\\u0113\\u013A\\u0113\\u010B\\u0163\\u0113\\u018C \\u015F\\u03C1\\u0105\\u010B\\u0113.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XTIT\nEditDialog.Title=[[[\\u0114\\u018C\\u012F\\u0163 \\u015F\\u03C1\\u0105\\u010B\\u0113\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=[[[\\u0162\\u0125\\u012F\\u015F \\u015F\\u03C1\\u0105\\u010B\\u0113 \\u0125\\u0105\\u015F \\u0183\\u0113\\u0113\\u014B \\u010B\\u0157\\u0113\\u0105\\u0163\\u0113\\u018C \\u012F\\u014B \\u013A\\u0105\\u014B\\u011F\\u0171\\u0105\\u011F\\u0113 "{0}" \\u0183\\u0171\\u0163 \\u0177\\u014F\\u0171\\u0157 \\u013A\\u014F\\u011F\\u014F\\u014B \\u013A\\u0105\\u014B\\u011F\\u0171\\u0105\\u011F\\u0113 \\u012F\\u015F \\u015F\\u0113\\u0163 \\u0163\\u014F "{1}". \\u01A4\\u013A\\u0113\\u0105\\u015F\\u0113 \\u010B\\u0125\\u0105\\u014B\\u011F\\u0113 \\u0177\\u014F\\u0171\\u0157 \\u013A\\u014F\\u011F\\u014F\\u014B \\u013A\\u0105\\u014B\\u011F\\u0171\\u0105\\u011F\\u0113 \\u0163\\u014F "{0}" \\u0163\\u014F \\u03C1\\u0157\\u014F\\u010B\\u0113\\u0113\\u018C.]]]\n\n#XTIT\nErrorDialog.Title=[[[\\u0114\\u0157\\u0157\\u014F\\u0157\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT\nSpaceOverview.Title=[[[\\u039C\\u0105\\u012F\\u014B\\u0163\\u0105\\u012F\\u014B \\u01A4\\u0105\\u011F\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=[[[\\u013B\\u0105\\u0177\\u014F\\u0171\\u0163\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n\n#XTIT\nCopyDialog.Title=[[[\\u0108\\u014F\\u03C1\\u0177 \\u015C\\u03C1\\u0105\\u010B\\u0113\\u2219\\u2219\\u2219\\u2219]]]\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=[[[\\u010E\\u014F \\u0177\\u014F\\u0171 \\u0175\\u0105\\u014B\\u0163 \\u0163\\u014F \\u010B\\u014F\\u03C1\\u0177 "{0}"?]]]\n#XFLD\nCopyDialog.NewID=[[[\\u0108\\u014F\\u03C1\\u0177 \\u014F\\u0192 "{0}"]]]\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=[[[\\u015C\\u014F\\u0157\\u0157\\u0177, \\u0175\\u0113 \\u010B\\u014F\\u0171\\u013A\\u018C \\u014B\\u014F\\u0163 \\u0192\\u012F\\u014B\\u018C \\u0163\\u0125\\u012F\\u015F \\u015F\\u03C1\\u0105\\u010B\\u0113.\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219\\u2219]]]\n#XLNK\nErrorPage.Link=[[[\\u039C\\u0105\\u012F\\u014B\\u0163\\u0105\\u012F\\u014B \\u015C\\u03C1\\u0105\\u010B\\u0113\\u015F\\u2219\\u2219\\u2219\\u2219]]]\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_en_US_saptrc.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=wtMOxx5pnxsmWc5FkIpwDw_Maintain Spaces\n\n#XBUT\nButton.Add=lFYOT+NcbE7oDPtO6YEw1A_Add\n#XBUT\nButton.Cancel=p5xj5lBSlmxDOAMd3wM6fg_Cancel\n#XBUT\nButton.Copy=2ljLSY0YZl0Ccd7uLsmnsg_Copy\n#XBUT\nButton.Create=/Kb/n2ueZCRER3WM5rZOXw_Create\n#XBUT\nButton.Delete=mvg8dFirwGh+GQqPNRxGNA_Delete\n#XBUT\nButton.Edit=JEnPpFNbusbOCTr/sZpDQg_Edit\n#XBUT\nButton.Save=t8iOIwuw1lEsCxSYukv6Zg_Save\n#XBUT\nButton.Ok=nFM+Jhqv1KPhah7nM1EiqQ_OK\n#XBUT\nButton.ShowPages=w1l6QEDYIEr6rGR9JGGTkQ_Show Pages\n#XBUT\nButton.HidePages=jKDr7GNVHKXksnJF8njw1g_Hide Pages\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=i/7I9nuTIVOS3dEGUmiyzg_Issues\\: {0}\n#XBUT\nButton.SortPages=0eJaCHMyTb6g9zimssaNXg_Toggle Pages Sort Order\n#XBUT\nButton.ShowDetails=aOkZvROs7jqi1vXkG7JSzg_Show Details\n#XBUT\nButton.ErrorMsg=UW5rEwUBzepxrrLjxxkCvQ_Error Messages\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=V3oUqZfWcxQoKSQ5xBUCXg_Search\n#XTOL\nTooltip.SearchForTiles=zVqT3owOIlBaOEhVBU6zXQ_Search for Spaces\n\n#XFLD\nLabel.SpaceID=GNLdaFmuuBVmqd1XUZPWfg_Space ID\n#XFLD\nLabel.Title=AgmV1NT/OFN5Ogeg4v/vNA_Title\n#XFLD\nLabel.WorkbenchRequest=ez9IYAbKazuaM80MoUAZwg_Workbench Request\n#XFLD\nLabel.Package=greYn3ioidSLgT8cb997yA_Package\n#XFLD\nLabel.TransportInformation=tkNkoYR+JwW2uznATc+Kag_Transport Information\n#XFLD\nLabel.Details=+zCp0Q7sUZESsK3Zr8D6xg_Details\\:\n#XFLD\nLabel.ResponseCode=rftoKnL27yZxJUHkpYMbmQ_Response Code\\:\n#XFLD\nLabel.Description=CKE/C6d5B/UAYrttoPlQYw_Description\n#XFLD\nLabel.CreatedByFullname=4ZA+XRK/NijrYqNA9flQNA_Created By\n#XFLD\nLabel.CreatedOn=haJVUGLcyp2S3OzpNG+LIA_Created On\n#XFLD\nLabel.ChangedByFullname=epZPS4lr6JBjKQjAGv59Pw_Changed By\n#XFLD\nLabel.ChangedOn=GJ+mw8B5i2qpI7CIN3WSGw_Changed On\n#XFLD\nLabel.PageTitle=ewYR8dR9cq8f9BIUB+CZAA_Page Title\n#XFLD\nLabel.AssignedRole=jg/mgWP+yQiovhcd81CdQQ_Assigned Role\n\n#XCOL\nColumn.SpaceID=l82C2DXMZCGSZnhJpATZww_ID\n#XCOL\nColumn.SpaceTitle=DYmAI5Xk8L2uJFBH39Mdjg_Title\n#XCOL\nColumn.SpaceDescription=W0HyIy60PmFnSg3STTvNtA_Description\n#XCOL\nColumn.SpacePackage=cw29nbOpcV81KmLyvPTxBQ_Package\n#XCOL\nColumn.SpaceWorkbenchRequest=v3mAN9UliyDBLSvwxP0ZKQ_Workbench Request\n#XCOL\nColumn.SpaceCreatedBy=rMSTCElmz9T2TrNs0CxUlw_Created By\n#XCOL\nColumn.SpaceCreatedOn=Ce9xqQ7fAySj7LINQhg2Fw_Created On\n#XCOL\nColumn.SpaceChangedBy=DYHcSjLyfNRvqOLKICw5Fg_Changed By\n#XCOL\nColumn.SpaceChangedOn=6avJld5olmNpbO5KjNlsWA_Changed On\n\n#XCOL\nColumn.PageID=sZvqXisZdphAASVmEMlybw_ID\n#XCOL\nColumn.PageTitle=PHpM/QgJu8UA5Yrx4Kq37Q_Title\n#XCOL\nColumn.PageDescription=xZEGa5VxZESE7WL55FVlcQ_Description\n#XCOL\nColumn.PagePackage=jH0e/qM4Cp8/DBHtuVHlCg_Package\n#XCOL\nColumn.PageWorkbenchRequest=EUaH0UY3hMt4LYHImqvkYQ_Workbench Request\n#XCOL\nColumn.PageCreatedBy=nMC1VH9l+LPs0SERCcyrxA_Created By\n#XCOL\nColumn.PageCreatedOn=xhOy5efAnK88aF7FxYPf8g_Created On\n#XCOL\nColumn.PageChangedBy=L4L2d/fG1SxOHEQuoRCM+g_Changed By\n#XCOL\nColumn.PageChangedOn=1SF+Fi6Ab5WhIF5E53GEoA_Changed On\n\n#XTOL\nPlaceholder.CopySpaceTitle=N5D0H6O7XFyszUSCnI3ZaQ_Copy of "{0}"\n#XTOL\nPlaceholder.CopySpaceID=kTlfTr8Rybt2eigl1SNORQ_Copy of "{0}"\n\n#XMSG\nMessage.NoInternetConnection=fMDyOW05TZigQjDMB9ILYQ_Please check your internet connection.\n#XMSG\nMessage.SavedChanges=pT2K1JdMVBE+2Cob7g5oxw_Your changes have been saved.\n#XMSG\nMessage.InvalidPageID=u0OoUUOpoEpixhaBdI5sGQ_Please only use the following characters\\: A-Z, 0-9, _ and /. The page ID should not start with a number.\n#XMSG\nMessage.EmptySpaceID=xjSdUxvd94qq6wuiw/CcKw_Please provide a valid Space ID.\n#XMSG\nMessage.EmptyTitle=IAqtgIxlpoyVnhqu8tdorg_Please provide a valid title.\n#XMSG\nMessage.SuccessDeletePage=7jjruKv8S9qkRIiKxZWJzw_The selected page has been deleted.\n#XMSG\nMessage.ClipboardCopySuccess=L/Z3wQEoqdn6i87WlWZ/yw_Details were copied successfully.\n#YMSE\nMessage.ClipboardCopyFail=hxhxzCBMDomIuUpWdCXo4w_An error occurred while copying details.\n#XMSG\nMessage.SpaceCreated=nyRYg4/ec+D4P2QWY5e+Kw_The space has been created.\n\n#XMSG\nMessage.NavigationTargetError=6iS2Au50EVZD2lXnksdXuw_Navigation target could not be resolved.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=+QWLyRr1lTNkH2Va1kM8ng_Failed to resolve the navigation target of tile\\: "{0}".\\n\\nThis is most likely caused by invalid configuration of SAP Fiori launchpad content. The visualization cannot open an application.\n#XMSG\nMessage.PageIsOutdated=sefk7hNND6UEnq0qk5FWbA_A newer version of this page has already been saved.\n#XMSG\nMessage.SaveChanges=IuIxOC8nKjhPArpohTXA4A_Please save your changes.\n#XMSG\nMessage.NoSpaces=qJI9iwmX0QLt65WtZZZIZA_No spaces available.\n#XMSG\nMessage.NoSpacesFound=4TkTIUBBlvI3kZ9TC18tEA_No spaces found. Try adjusting your search.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=KSBfmOSvv1dw/jwt6sgtKA_New Space\n#XTIT\nDeleteDialog.Title=l47poLC0k37cykLUbbitLA_Delete\n#XMSG\nDeleteDialog.Text=BCaxKkbX5VTXl9bfuuC2/w_Are you sure you want to delete the selected space?\n#XBUT\nDeleteDialog.ConfirmButton=mli3Hxj8BS1knQUkoDbgGQ_Delete\n#XTIT\nDeleteDialog.LockedTitle=lWqcjTkyFIZXORGAqjPMsg_Space Locked\n#XMSG\nDeleteDialog.LockedText=+lUOlEFoIfprWuxckSnwEA_The selected space is locked by user "{0}".\n#XMSG\nDeleteDialog.TransportRequired=R7cA5QkoaE977tjt1AF8GA_Please select a transport package to delete the selected space.\n\n#XMSG\nEditDialog.LockedText=3474xmqzQtIt5mp4Hw/T0A_The selected space is locked by user "{0}".\n#XMSG\nEditDialog.TransportRequired=lBtctMI+kcLw+XrRed7+Dg_Please select a transport package to edit the selected space.\n#XTIT\nEditDialog.Title=s5FNdMw/qE6TAyQY8KXXYg_Edit space\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=AAB3TP3U7Mmu2QW007b0Hg_This space has been created in language "{0}" but your logon language is set to "{1}". Please change your logon language to "{0}" to proceed.\n\n#XTIT\nErrorDialog.Title=smwGhYkS0xV05NDD7ZQZ9w_Error\n\n#XTIT\nSpaceOverview.Title=A/HB/UIrRQkWHbxspvGkCQ_Maintain Pages\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=JpW9/GxEh+JsR90n7YwnmA_Layout\n\n#XTIT\nCopyDialog.Title=9C6QEJMg8+pYYZdYpOQSLg_Copy Space\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=81ZZ+4QJSKfYrN2u00M7tg_Do you want to copy "{0}"?\n#XFLD\nCopyDialog.NewID=0RTJAqLnItaGCY7y0EGVGg_Copy of "{0}"\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=TPwlqnGGBPmucf+PNe35GA_Sorry, we could not find this space.\n#XLNK\nErrorPage.Link=oJQIRs9JokRFswmmH21+4Q_Maintain Spaces\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_es.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=Actualizar espacios\n\n#XBUT\nButton.Add=A\\u00F1adir\n#XBUT\nButton.Cancel=Cancelar\n#XBUT\nButton.Copy=Copiar\n#XBUT\nButton.Create=Crear\n#XBUT\nButton.Delete=Borrar\n#XBUT\nButton.Edit=Tratar\n#XBUT\nButton.Save=Guardar\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowPages=Mostrar p\\u00E1ginas\n#XBUT\nButton.HidePages=Ocultar p\\u00E1ginas\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=Problemas\\: {0}\n#XBUT\nButton.SortPages=Conmutar el orden de clasificaci\\u00F3n de las p\\u00E1ginas\n#XBUT\nButton.ShowDetails=Mostrar detalles\n#XBUT\nButton.ErrorMsg=Mensajes de error\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=Buscar\n#XTOL\nTooltip.SearchForTiles=Buscar por espacios\n\n#XFLD\nLabel.SpaceID=ID de espacio\n#XFLD\nLabel.Title=T\\u00EDtulo\n#XFLD\nLabel.WorkbenchRequest=Orden de Workbench\n#XFLD\nLabel.Package=Paquete\n#XFLD\nLabel.TransportInformation=Informaci\\u00F3n de transporte\n#XFLD\nLabel.Details=Detalles\\:\n#XFLD\nLabel.ResponseCode=C\\u00F3digo de respuesta\\:\n#XFLD\nLabel.Description=Descripci\\u00F3n\n#XFLD\nLabel.CreatedByFullname=Creado por\n#XFLD\nLabel.CreatedOn=Creado el\n#XFLD\nLabel.ChangedByFullname=Modificado por\n#XFLD\nLabel.ChangedOn=Modificado el\n#XFLD\nLabel.PageTitle=T\\u00EDtulo de p\\u00E1gina\n#XFLD\nLabel.AssignedRole=Rol asignado\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=T\\u00EDtulo\n#XCOL\nColumn.SpaceDescription=Descripci\\u00F3n\n#XCOL\nColumn.SpacePackage=Paquete\n#XCOL\nColumn.SpaceWorkbenchRequest=Orden de Workbench\n#XCOL\nColumn.SpaceCreatedBy=Creado por\n#XCOL\nColumn.SpaceCreatedOn=Creado el\n#XCOL\nColumn.SpaceChangedBy=Modificado por\n#XCOL\nColumn.SpaceChangedOn=Modificado el\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=T\\u00EDtulo\n#XCOL\nColumn.PageDescription=Descripci\\u00F3n\n#XCOL\nColumn.PagePackage=Paquete\n#XCOL\nColumn.PageWorkbenchRequest=Orden de Workbench\n#XCOL\nColumn.PageCreatedBy=Creado por\n#XCOL\nColumn.PageCreatedOn=Creado el\n#XCOL\nColumn.PageChangedBy=Modificado por\n#XCOL\nColumn.PageChangedOn=Modificado el\n\n#XTOL\nPlaceholder.CopySpaceTitle=Copia de "{0}"\n#XTOL\nPlaceholder.CopySpaceID=Copia de "{0}"\n\n#XMSG\nMessage.NoInternetConnection=Compruebe la conexi\\u00F3n a Internet.\n#XMSG\nMessage.SavedChanges=Los cambios se han grabado.\n#XMSG\nMessage.InvalidPageID=Utilice solo los siguientes caracteres\\: A-Z a-z 0-9 _ y /. El ID de p\\u00E1gina no debe empezar con un n\\u00FAmero.\n#XMSG\nMessage.EmptySpaceID=Indique un ID de espacio v\\u00E1lido.\n#XMSG\nMessage.EmptyTitle=Indique un t\\u00EDtulo v\\u00E1lido.\n#XMSG\nMessage.SuccessDeletePage=Se ha borrado el objeto seleccionado.\n#XMSG\nMessage.ClipboardCopySuccess=Los detalles se han copiado correctamente.\n#YMSE\nMessage.ClipboardCopyFail=Se ha producido un error al copiar detalles.\n#XMSG\nMessage.SpaceCreated=Se ha creado el espacio.\n\n#XMSG\nMessage.NavigationTargetError=No se ha podido solucionar el destino de navegaci\\u00F3n.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=Se ha producido un error al solucionar el destino de navegaci\\u00F3n del mosaico\\: "{0}".\\n\\nEsto se debe probablemente a una configuraci\\u00F3n de contenido de la rampa de lanzamiento de SAP Fiori no v\\u00E1lida. La visualizaci\\u00F3n no puede abrir una aplicaci\\u00F3n.\n#XMSG\nMessage.PageIsOutdated=Ya se ha grabado una versi\\u00F3n m\\u00E1s reciente de esta p\\u00E1gina.\n#XMSG\nMessage.SaveChanges=Grabe los cambios.\n#XMSG\nMessage.NoSpaces=No hay espacios disponibles.\n#XMSG\nMessage.NoSpacesFound=No se han encontrado espacios. Intente ajustar la b\\u00FAsqueda.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=Espacio nuevo\n#XTIT\nDeleteDialog.Title=Borrar\n#XMSG\nDeleteDialog.Text=\\u00BFSeguro que desea borrar el espacio seleccionado?\n#XBUT\nDeleteDialog.ConfirmButton=Borrar\n#XTIT\nDeleteDialog.LockedTitle=Espacio bloqueado\n#XMSG\nDeleteDialog.LockedText=El usuario "{0}" ha bloqueado el espacio seleccionado.\n#XMSG\nDeleteDialog.TransportRequired=Seleccione un paquete de transporte para borrar el espacio seleccionado.\n\n#XMSG\nEditDialog.LockedText=El usuario "{0}" ha bloqueado el espacio seleccionado.\n#XMSG\nEditDialog.TransportRequired=Seleccione un paquete de transporte para editar el espacio seleccionado.\n#XTIT\nEditDialog.Title=Editar espacio\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=Este espacio se ha creado en el idioma "{0}", pero su idioma de registro est\\u00E1 establecido como "{1}". Modifique su idioma de registro a "{0}" para continuar.\n\n#XTIT\nErrorDialog.Title=Error\n\n#XTIT\nSpaceOverview.Title=Actualizar p\\u00E1ginas\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=Layout\n\n#XTIT\nCopyDialog.Title=Copiar espacio\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=\\u00BFDesea copiar "{0}"?\n#XFLD\nCopyDialog.NewID=Copia de "{0}"\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=Este espacio no existe.\n#XLNK\nErrorPage.Link=Actualizar espacios\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_et.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=Halda ruume\n\n#XBUT\nButton.Add=Lisa\n#XBUT\nButton.Cancel=T\\u00FChista\n#XBUT\nButton.Copy=Kopeeri\n#XBUT\nButton.Create=Loo\n#XBUT\nButton.Delete=Kustuta\n#XBUT\nButton.Edit=Redigeeri\n#XBUT\nButton.Save=Salvesta\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowPages=Kuva lehed\n#XBUT\nButton.HidePages=Peida lehed\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=Probleemid\\: {0}\n#XBUT\nButton.SortPages=Vaheta lehtede sortimisj\\u00E4rjestust\n#XBUT\nButton.ShowDetails=Kuva \\u00FCksikasjad\n#XBUT\nButton.ErrorMsg=T\\u00F5rketeated\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=Otsing\n#XTOL\nTooltip.SearchForTiles=Otsi ruume\n\n#XFLD\nLabel.SpaceID=Ruumi ID\n#XFLD\nLabel.Title=Tiitel\n#XFLD\nLabel.WorkbenchRequest=T\\u00F6\\u00F6lauataotlus\n#XFLD\nLabel.Package=Pakett\n#XFLD\nLabel.TransportInformation=Transporditeave\n#XFLD\nLabel.Details=\\u00DCksikasjad\\:\n#XFLD\nLabel.ResponseCode=Vastuse kood\\:\n#XFLD\nLabel.Description=Kirjeldus\n#XFLD\nLabel.CreatedByFullname=Autor\n#XFLD\nLabel.CreatedOn=Loomiskuup\\u00E4ev\n#XFLD\nLabel.ChangedByFullname=Muutja\n#XFLD\nLabel.ChangedOn=Muutmiskuup\\u00E4ev\n#XFLD\nLabel.PageTitle=Lehe tiitel\n#XFLD\nLabel.AssignedRole=M\\u00E4\\u00E4ratud roll\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=Tiitel\n#XCOL\nColumn.SpaceDescription=Kirjeldus\n#XCOL\nColumn.SpacePackage=Pakett\n#XCOL\nColumn.SpaceWorkbenchRequest=T\\u00F6\\u00F6lauataotlus\n#XCOL\nColumn.SpaceCreatedBy=Autor\n#XCOL\nColumn.SpaceCreatedOn=Loomiskuup\\u00E4ev\n#XCOL\nColumn.SpaceChangedBy=Muutja\n#XCOL\nColumn.SpaceChangedOn=Muutmiskuup\\u00E4ev\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Tiitel\n#XCOL\nColumn.PageDescription=Kirjeldus\n#XCOL\nColumn.PagePackage=Pakett\n#XCOL\nColumn.PageWorkbenchRequest=T\\u00F6\\u00F6lauataotlus\n#XCOL\nColumn.PageCreatedBy=Autor\n#XCOL\nColumn.PageCreatedOn=Loomiskuup\\u00E4ev\n#XCOL\nColumn.PageChangedBy=Muutja\n#XCOL\nColumn.PageChangedOn=Muutmiskuup\\u00E4ev\n\n#XTOL\nPlaceholder.CopySpaceTitle=Koopia\\: {0}\n#XTOL\nPlaceholder.CopySpaceID=Koopia\\: {0}\n\n#XMSG\nMessage.NoInternetConnection=Kontrollige oma Interneti-\\u00FChendust.\n#XMSG\nMessage.SavedChanges=Teie muudatused on salvestatud.\n#XMSG\nMessage.InvalidPageID=Kasutage ainult j\\u00E4rgmisi m\\u00E4rke\\: A\\u2013Z, 0\\u20139, _ ja /. Lehe ID ei tohi alata numbriga.\n#XMSG\nMessage.EmptySpaceID=Sisestage sobiv ruumi ID.\n#XMSG\nMessage.EmptyTitle=Sisestage sobiv tiitel.\n#XMSG\nMessage.SuccessDeletePage=Valitud objekt on kustutatud.\n#XMSG\nMessage.ClipboardCopySuccess=\\u00DCksikasjad on kopeeritud.\n#YMSE\nMessage.ClipboardCopyFail=\\u00DCksikasjade kopeerimisel ilmnes t\\u00F5rge.\n#XMSG\nMessage.SpaceCreated=Ruum on loodud.\n\n#XMSG\nMessage.NavigationTargetError=Navigeerimise sihti ei saanud lahendada.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=Paani navigeerimise sihi lahendamine nurjus\\: \\u201E{0}\\u201C.\\n\\nSelle p\\u00F5hjus on t\\u00F5en\\u00E4oliselt SAP Fiori k\\u00E4ivituspaani sisu sobimatu konfiguratsioon. Visualiseering ei saa rakendust avada.\n#XMSG\nMessage.PageIsOutdated=Sellest lehest on juba salvestatud uuem versioon.\n#XMSG\nMessage.SaveChanges=Salvestage oma muudatused.\n#XMSG\nMessage.NoSpaces=Ruume pole saadaval.\n#XMSG\nMessage.NoSpacesFound=\\u00DChtegi ruumi ei leitud. Proovige oma otsingut korrigeerida.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=Uus ruum\n#XTIT\nDeleteDialog.Title=Kustuta\n#XMSG\nDeleteDialog.Text=Kas soovite kindlasti valitud ruumi kustutada?\n#XBUT\nDeleteDialog.ConfirmButton=Kustuta\n#XTIT\nDeleteDialog.LockedTitle=Ruum on lukus\n#XMSG\nDeleteDialog.LockedText=Kasutaja {0} on valitud ruumi lukustanud.\n#XMSG\nDeleteDialog.TransportRequired=Valitud ruumi kustutamiseks valige transpordipakett.\n\n#XMSG\nEditDialog.LockedText=Kasutaja {0} on valitud ruumi lukustanud.\n#XMSG\nEditDialog.TransportRequired=Valitud ruumi redigeerimiseks valige transpordipakett.\n#XTIT\nEditDialog.Title=Redigeeri ruumi\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=See ruum on loodud keeles "{0}", kuid teie sisselogimiskeeleks on m\\u00E4\\u00E4ratud "{1}". J\\u00E4tkamiseks muutke oma sisselogimiskeeleks "{0}".\n\n#XTIT\nErrorDialog.Title=T\\u00F5rge\n\n#XTIT\nSpaceOverview.Title=Halda lehti\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=Paigutus\n\n#XTIT\nCopyDialog.Title=Kopeeri ruum\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=Kas soovite \\u00FCksuse {0} kopeerida?\n#XFLD\nCopyDialog.NewID=Koopia\\: {0}\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=Me ei leidnud kahjuks seda ruumi.\n#XLNK\nErrorPage.Link=Halda ruume\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_fi.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=Yll\\u00E4pid\\u00E4 tiloja\n\n#XBUT\nButton.Add=Lis\\u00E4\\u00E4\n#XBUT\nButton.Cancel=Peruuta\n#XBUT\nButton.Copy=Kopioi\n#XBUT\nButton.Create=Luo\n#XBUT\nButton.Delete=Poista\n#XBUT\nButton.Edit=K\\u00E4sittele\n#XBUT\nButton.Save=Tallenna\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowPages=N\\u00E4yt\\u00E4 sivut\n#XBUT\nButton.HidePages=Piilota sivut\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=Ongelmat\\: {0}\n#XBUT\nButton.SortPages=Vaihda sivujen lajitteluj\\u00E4rjestys\n#XBUT\nButton.ShowDetails=N\\u00E4yt\\u00E4 lis\\u00E4tiedot\n#XBUT\nButton.ErrorMsg=Virheilmoitukset\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=Hae\n#XTOL\nTooltip.SearchForTiles=Hae tiloja\n\n#XFLD\nLabel.SpaceID=Tilan tunnus\n#XFLD\nLabel.Title=Otsikko\n#XFLD\nLabel.WorkbenchRequest=Ty\\u00F6p\\u00F6yt\\u00E4tilaus\n#XFLD\nLabel.Package=Paketti\n#XFLD\nLabel.TransportInformation=Siirron tiedot\n#XFLD\nLabel.Details=Lis\\u00E4tiedot\\:\n#XFLD\nLabel.ResponseCode=Vastauskoodi\\:\n#XFLD\nLabel.Description=Kuvaus\n#XFLD\nLabel.CreatedByFullname=Tekij\\u00E4\n#XFLD\nLabel.CreatedOn=Luontip\\u00E4iv\\u00E4m\\u00E4\\u00E4r\\u00E4\n#XFLD\nLabel.ChangedByFullname=Muuttaja\n#XFLD\nLabel.ChangedOn=Muutosp\\u00E4iv\\u00E4m\\u00E4\\u00E4r\\u00E4\n#XFLD\nLabel.PageTitle=Sivun otsikko\n#XFLD\nLabel.AssignedRole=Kohdistettu rooli\n\n#XCOL\nColumn.SpaceID=Tunnus\n#XCOL\nColumn.SpaceTitle=Otsikko\n#XCOL\nColumn.SpaceDescription=Kuvaus\n#XCOL\nColumn.SpacePackage=Paketti\n#XCOL\nColumn.SpaceWorkbenchRequest=Ty\\u00F6p\\u00F6yt\\u00E4tilaus\n#XCOL\nColumn.SpaceCreatedBy=Tekij\\u00E4\n#XCOL\nColumn.SpaceCreatedOn=Luontip\\u00E4iv\\u00E4m\\u00E4\\u00E4r\\u00E4\n#XCOL\nColumn.SpaceChangedBy=Muuttaja\n#XCOL\nColumn.SpaceChangedOn=Muutosp\\u00E4iv\\u00E4m\\u00E4\\u00E4r\\u00E4\n\n#XCOL\nColumn.PageID=Tunnus\n#XCOL\nColumn.PageTitle=Otsikko\n#XCOL\nColumn.PageDescription=Kuvaus\n#XCOL\nColumn.PagePackage=Paketti\n#XCOL\nColumn.PageWorkbenchRequest=Ty\\u00F6p\\u00F6yt\\u00E4tilaus\n#XCOL\nColumn.PageCreatedBy=Tekij\\u00E4\n#XCOL\nColumn.PageCreatedOn=Luontip\\u00E4iv\\u00E4m\\u00E4\\u00E4r\\u00E4\n#XCOL\nColumn.PageChangedBy=Muuttaja\n#XCOL\nColumn.PageChangedOn=Muutosp\\u00E4iv\\u00E4m\\u00E4\\u00E4r\\u00E4\n\n#XTOL\nPlaceholder.CopySpaceTitle=Kohteen \\u201D{0}\\u201D kopio\n#XTOL\nPlaceholder.CopySpaceID=Kohteen \\u201D{0}\\u201D kopio\n\n#XMSG\nMessage.NoInternetConnection=Tarkista internet-yhteytesi.\n#XMSG\nMessage.SavedChanges=Muutoksesi on tallennettu.\n#XMSG\nMessage.InvalidPageID=K\\u00E4yt\\u00E4 vain seuraavia merkkej\\u00E4\\: A-Z, 0-9, _ ja /. Sivun tunnuksen ei pit\\u00E4isi alkaa numerolla.\n#XMSG\nMessage.EmptySpaceID=Anna kelpaava tilan tunnus.\n#XMSG\nMessage.EmptyTitle=Anna kelpaava otsikko.\n#XMSG\nMessage.SuccessDeletePage=Valittu objekti on poistettu.\n#XMSG\nMessage.ClipboardCopySuccess=Lis\\u00E4tietojen kopiointi onnistui.\n#YMSE\nMessage.ClipboardCopyFail=Lis\\u00E4tietojen kopioinnissa tapahtui virhe.\n#XMSG\nMessage.SpaceCreated=Tila on luotu.\n\n#XMSG\nMessage.NavigationTargetError=Navigointikohdetta ei voitu ratkaista.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=Ruudun "{0}\\u201D navigointikohteen ratkaiseminen ep\\u00E4onnistui.\\n\\nT\\u00E4m\\u00E4 johtuu todenn\\u00E4k\\u00F6isesti virheellisest\\u00E4 SAP Fiori -aloituspaneelin sis\\u00E4ll\\u00F6n konfiguraatiosta. Visualisointi ei voi avata sovellusta.\n#XMSG\nMessage.PageIsOutdated=T\\u00E4m\\u00E4n sivun uudempi versio on jo tallennettu.\n#XMSG\nMessage.SaveChanges=Tallenna muutoksesi.\n#XMSG\nMessage.NoSpaces=Tiloja ei ole k\\u00E4ytett\\u00E4viss\\u00E4.\n#XMSG\nMessage.NoSpacesFound=Tiloja ei l\\u00F6ydetty. Yrit\\u00E4 mukauttaa hakuasi.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=Uusi tila\n#XTIT\nDeleteDialog.Title=Poista\n#XMSG\nDeleteDialog.Text=Haluatko varmasti poistaa valitun tilan?\n#XBUT\nDeleteDialog.ConfirmButton=Poista\n#XTIT\nDeleteDialog.LockedTitle=Tila lukittu\n#XMSG\nDeleteDialog.LockedText=K\\u00E4ytt\\u00E4j\\u00E4 \\u201D{0}\\u201D on lukinnut valitun tilan.\n#XMSG\nDeleteDialog.TransportRequired=Valitse siirtopaketti valitun tilan poistamiseksi.\n\n#XMSG\nEditDialog.LockedText=K\\u00E4ytt\\u00E4j\\u00E4 \\u201D{0}\\u201D on lukinnut valitun tilan.\n#XMSG\nEditDialog.TransportRequired=Valitse siirtopaketti valitun tilan muokkaamista varten.\n#XTIT\nEditDialog.Title=Muokkaa tilaa\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=T\\u00E4m\\u00E4 tila on luotu kielell\\u00E4 "{0}\\u201D mutta kirjautumiskieleksesi on asetettu "{1}". Muuta kirjautumiskieleksi "{0}" jatkamista varten.\n\n#XTIT\nErrorDialog.Title=Virhe\n\n#XTIT\nSpaceOverview.Title=Yll\\u00E4pid\\u00E4 sivuja\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=Asettelu\n\n#XTIT\nCopyDialog.Title=Kopioi tila\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=Haluatko kopioida kohteen \\u201D{0}\\u201D?\n#XFLD\nCopyDialog.NewID=Kohteen \\u201D{0}\\u201D kopio\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=T\\u00E4t\\u00E4 tilaa ei valitettavasti l\\u00F6ytynyt.\n#XLNK\nErrorPage.Link=Yll\\u00E4pid\\u00E4 tiloja\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_fr.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=G\\u00E9rer espaces\n\n#XBUT\nButton.Add=Ajouter\n#XBUT\nButton.Cancel=Interrompre\n#XBUT\nButton.Copy=Copier\n#XBUT\nButton.Create=Cr\\u00E9er\n#XBUT\nButton.Delete=Supprimer\n#XBUT\nButton.Edit=Traiter\n#XBUT\nButton.Save=Sauvegarder\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowPages=Afficher pages\n#XBUT\nButton.HidePages=Masquer pages\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=Probl\\u00E8mes \\: {0}\n#XBUT\nButton.SortPages=Changer l\'ordre de tri des pages\n#XBUT\nButton.ShowDetails=Afficher d\\u00E9tails\n#XBUT\nButton.ErrorMsg=Messages d\'erreur\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=Rechercher\n#XTOL\nTooltip.SearchForTiles=Rechercher espaces\n\n#XFLD\nLabel.SpaceID=ID d\'espace\n#XFLD\nLabel.Title=Titre\n#XFLD\nLabel.WorkbenchRequest=Ordre du Workbench\n#XFLD\nLabel.Package=Package\n#XFLD\nLabel.TransportInformation=Informations de transport\n#XFLD\nLabel.Details=D\\u00E9tails\n#XFLD\nLabel.ResponseCode=Code de r\\u00E9ponse\n#XFLD\nLabel.Description=Description\n#XFLD\nLabel.CreatedByFullname=Cr\\u00E9\\u00E9 par\n#XFLD\nLabel.CreatedOn=Cr\\u00E9\\u00E9e le\n#XFLD\nLabel.ChangedByFullname=Modifi\\u00E9 par\n#XFLD\nLabel.ChangedOn=Modifi\\u00E9 le\n#XFLD\nLabel.PageTitle=Titre de page\n#XFLD\nLabel.AssignedRole=R\\u00F4le affect\\u00E9\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=Titre\n#XCOL\nColumn.SpaceDescription=D\\u00E9signation\n#XCOL\nColumn.SpacePackage=Paquet\n#XCOL\nColumn.SpaceWorkbenchRequest=Ordre du Workbench\n#XCOL\nColumn.SpaceCreatedBy=Cr\\u00E9\\u00E9 par\n#XCOL\nColumn.SpaceCreatedOn=Cr\\u00E9\\u00E9e le\n#XCOL\nColumn.SpaceChangedBy=Modifi\\u00E9 par\n#XCOL\nColumn.SpaceChangedOn=Modifi\\u00E9 le\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Titre\n#XCOL\nColumn.PageDescription=D\\u00E9signation\n#XCOL\nColumn.PagePackage=Paquet\n#XCOL\nColumn.PageWorkbenchRequest=Ordre du Workbench\n#XCOL\nColumn.PageCreatedBy=Cr\\u00E9\\u00E9 par\n#XCOL\nColumn.PageCreatedOn=Cr\\u00E9\\u00E9e le\n#XCOL\nColumn.PageChangedBy=Modifi\\u00E9 par\n#XCOL\nColumn.PageChangedOn=Modifi\\u00E9 le\n\n#XTOL\nPlaceholder.CopySpaceTitle=Copie de "{0}"\n#XTOL\nPlaceholder.CopySpaceID=Copie de "{0}"\n\n#XMSG\nMessage.NoInternetConnection=V\\u00E9rifiez votre connexion Internet.\n#XMSG\nMessage.SavedChanges=Vos modifications ont \\u00E9t\\u00E9 sauvegard\\u00E9es.\n#XMSG\nMessage.InvalidPageID=Utilisez uniquement les caract\\u00E8res suivants \\: A-Z, 0-9, _ et /. L\'ID de page ne doit pas commencer par un nombre.\n#XMSG\nMessage.EmptySpaceID=Indiquez un ID d\\u2019espace valide.\n#XMSG\nMessage.EmptyTitle=Indiquez un titre valide.\n#XMSG\nMessage.SuccessDeletePage=Objet s\\u00E9lectionn\\u00E9 supprim\\u00E9\n#XMSG\nMessage.ClipboardCopySuccess=D\\u00E9tails copi\\u00E9s correctement.\n#YMSE\nMessage.ClipboardCopyFail=Une erreur est survenue lors de la copie des d\\u00E9tails.\n#XMSG\nMessage.SpaceCreated=L"espace a \\u00E9t\\u00E9 cr\\u00E9\\u00E9.\n\n#XMSG\nMessage.NavigationTargetError=Impossible de r\\u00E9soudre la cible de navigation\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=La r\\u00E9solution de la cible de navigation de la vignette a \\u00E9chou\\u00E9 \\: "{0}".\\n\\nCela est tr\\u00E8s probablement d\\u00FB \\u00E0 une configuration non valide du contenu de la barre de lancement SAP Fiori. La visualisation ne peut pas ouvrir une application.\n#XMSG\nMessage.PageIsOutdated=Une nouvelle version de cette page a d\\u00E9j\\u00E0 \\u00E9t\\u00E9 sauvegard\\u00E9e.\n#XMSG\nMessage.SaveChanges=Sauvegardez vos modifications.\n#XMSG\nMessage.NoSpaces=Aucun espace disponible\n#XMSG\nMessage.NoSpacesFound=Aucun espace trouv\\u00E9. Adaptez votre recherche.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=Nouvel espace\n#XTIT\nDeleteDialog.Title=Supprimer\n#XMSG\nDeleteDialog.Text=Voulez-vous vraiment supprimer l\'espace s\\u00E9lectionn\\u00E9\\u00A0?\n#XBUT\nDeleteDialog.ConfirmButton=Supprimer\n#XTIT\nDeleteDialog.LockedTitle=Espace bloqu\\u00E9\n#XMSG\nDeleteDialog.LockedText=L\'\'espace s\\u00E9lectionn\\u00E9 est bloqu\\u00E9 par l\'\'utilisateur "{0}".\n#XMSG\nDeleteDialog.TransportRequired=S\\u00E9lectionnez un paquet de transport pour supprimer l\'espace s\\u00E9lectionn\\u00E9.\n\n#XMSG\nEditDialog.LockedText=L\'\'espace s\\u00E9lectionn\\u00E9 est bloqu\\u00E9 par l\'\'utilisateur "{0}".\n#XMSG\nEditDialog.TransportRequired=S\\u00E9lectionnez un paquet de transport pour traiter l\'espace s\\u00E9lectionn\\u00E9.\n#XTIT\nEditDialog.Title=Traiter espace\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=Cet espace a \\u00E9t\\u00E9 cr\\u00E9\\u00E9 en "{0}" mais votre langue de connexion param\\u00E9tr\\u00E9e est "{1}". Modifiez votre langue de connexion en "{0}" pour continuer.\n\n#XTIT\nErrorDialog.Title=Erreur\n\n#XTIT\nSpaceOverview.Title=G\\u00E9rer pages\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=Mise en forme\n\n#XTIT\nCopyDialog.Title=Copier espace\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=Voulez-vous copier "{0}" ?\n#XFLD\nCopyDialog.NewID=Copie de "{0}"\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=D\\u00E9sol\\u00E9, cet espace est introuvable.\n#XLNK\nErrorPage.Link=G\\u00E9rer espaces\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_hi.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=\\u0938\\u094D\\u092A\\u0947\\u0938 \\u0930\\u0916\\u0947\\u0902\n\n#XBUT\nButton.Add=\\u091C\\u094B\\u0921\\u093C\\u0947\\u0902\n#XBUT\nButton.Cancel=\\u0930\\u0926\\u094D\\u0926 \\u0915\\u0930\\u0947\\u0902\n#XBUT\nButton.Copy=\\u092A\\u094D\\u0930\\u0924\\u093F \\u092C\\u0928\\u093E\\u090F\\u0902\n#XBUT\nButton.Create=\\u092C\\u0928\\u093E\\u090F\\u0902\n#XBUT\nButton.Delete=\\u0939\\u091F\\u093E\\u090F\\u0902\n#XBUT\nButton.Edit=\\u0938\\u0902\\u092A\\u093E\\u0926\\u093F\\u0924 \\u0915\\u0930\\u0947\\u0902\n#XBUT\nButton.Save=\\u0938\\u0939\\u0947\\u091C\\u0947\\u0902\n#XBUT\nButton.Ok=\\u0920\\u0940\\u0915\n#XBUT\nButton.ShowPages=\\u092A\\u0943\\u0937\\u094D\\u0920 \\u0926\\u093F\\u0916\\u093E\\u090F\\u0902\n#XBUT\nButton.HidePages=\\u092A\\u0943\\u0937\\u094D\\u0920 \\u091B\\u093F\\u092A\\u093E\\u090F\\u0902\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=\\u0938\\u092E\\u0938\\u094D\\u092F\\u093E\\u090F\\u0902\\: {0}\n#XBUT\nButton.SortPages=\\u092A\\u0943\\u0937\\u094D\\u0920\\u094B\\u0902 \\u0915\\u0947 \\u0938\\u0949\\u0930\\u094D\\u091F \\u0911\\u0930\\u094D\\u0921\\u0930 \\u0915\\u094B \\u091F\\u0949\\u0917\\u0932 \\u0915\\u0930\\u0947\\u0902\n#XBUT\nButton.ShowDetails=\\u0935\\u093F\\u0935\\u0930\\u0923\\u094B\\u0902 \\u0915\\u094B \\u0926\\u093F\\u0916\\u093E\\u090F\\u0902\n#XBUT\nButton.ErrorMsg=\\u0924\\u094D\\u0930\\u0941\\u091F\\u093F \\u0938\\u0902\\u0926\\u0947\\u0936\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=\\u0916\\u094B\\u091C\\u0947\\u0902\n#XTOL\nTooltip.SearchForTiles=\\u0938\\u094D\\u092A\\u0947\\u0938 \\u0916\\u094B\\u091C\\u0947\\u0902\n\n#XFLD\nLabel.SpaceID=\\u0938\\u094D\\u092A\\u0947\\u0938 ID\n#XFLD\nLabel.Title=\\u0936\\u0940\\u0930\\u094D\\u0937\\u0915\n#XFLD\nLabel.WorkbenchRequest=\\u0935\\u0930\\u094D\\u0915\\u092C\\u0947\\u0902\\u091A \\u0905\\u0928\\u0941\\u0930\\u094B\\u0927\n#XFLD\nLabel.Package=\\u092A\\u0948\\u0915\\u0947\\u091C\n#XFLD\nLabel.TransportInformation=\\u092A\\u0930\\u093F\\u0935\\u0939\\u0928 \\u091C\\u093E\\u0928\\u0915\\u093E\\u0930\\u0940\n#XFLD\nLabel.Details=\\u0935\\u093F\\u0935\\u0930\\u0923\\u0903\n#XFLD\nLabel.ResponseCode=\\u092A\\u094D\\u0930\\u0924\\u093F\\u0915\\u094D\\u0930\\u093F\\u092F\\u093E \\u0915\\u094B\\u0921\\:\n#XFLD\nLabel.Description=\\u0935\\u0930\\u094D\\u0923\\u0928\n#XFLD\nLabel.CreatedByFullname=\\u0928\\u093F\\u0930\\u094D\\u092E\\u093E\\u0924\\u093E\n#XFLD\nLabel.CreatedOn=\\u0928\\u093F\\u0930\\u094D\\u092E\\u093E\\u0923 \\u0926\\u093F\\u0928\\u093E\\u0902\\u0915\n#XFLD\nLabel.ChangedByFullname=\\u092A\\u0930\\u093F\\u0935\\u0930\\u094D\\u0924\\u0928\\u0915\\u0930\\u094D\\u0924\\u093E\n#XFLD\nLabel.ChangedOn=\\u0907\\u0938 \\u0926\\u093F\\u0928\\u093E\\u0902\\u0915 \\u0915\\u094B \\u092A\\u0930\\u093F.\n#XFLD\nLabel.PageTitle=\\u092A\\u0943\\u0937\\u094D\\u0920 \\u0936\\u0940\\u0930\\u094D\\u0937\\u0915\n#XFLD\nLabel.AssignedRole=\\u0905\\u0938\\u093E\\u0907\\u0928 \\u0915\\u0940 \\u0917\\u0908 \\u092D\\u0942\\u092E\\u093F\\u0915\\u093E\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=\\u0936\\u0940\\u0930\\u094D\\u0937\\u0915\n#XCOL\nColumn.SpaceDescription=\\u0935\\u0930\\u094D\\u0923\\u0928\n#XCOL\nColumn.SpacePackage=\\u092A\\u0948\\u0915\\u0947\\u091C\n#XCOL\nColumn.SpaceWorkbenchRequest=\\u0935\\u0930\\u094D\\u0915\\u092C\\u0947\\u0902\\u091A \\u0905\\u0928\\u0941\\u0930\\u094B\\u0927\n#XCOL\nColumn.SpaceCreatedBy=\\u0928\\u093F\\u0930\\u094D\\u092E\\u093E\\u0924\\u093E\n#XCOL\nColumn.SpaceCreatedOn=\\u0928\\u093F\\u0930\\u094D\\u092E\\u093E\\u0923 \\u0926\\u093F\\u0928\\u093E\\u0902\\u0915\n#XCOL\nColumn.SpaceChangedBy=\\u092A\\u0930\\u093F\\u0935\\u0930\\u094D\\u0924\\u0928\\u0915\\u0930\\u094D\\u0924\\u093E\n#XCOL\nColumn.SpaceChangedOn=\\u0907\\u0938 \\u0926\\u093F\\u0928\\u093E\\u0902\\u0915 \\u0915\\u094B \\u092A\\u0930\\u093F.\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=\\u0936\\u0940\\u0930\\u094D\\u0937\\u0915\n#XCOL\nColumn.PageDescription=\\u0935\\u0930\\u094D\\u0923\\u0928\n#XCOL\nColumn.PagePackage=\\u092A\\u0948\\u0915\\u0947\\u091C\n#XCOL\nColumn.PageWorkbenchRequest=\\u0935\\u0930\\u094D\\u0915\\u092C\\u0947\\u0902\\u091A \\u0905\\u0928\\u0941\\u0930\\u094B\\u0927\n#XCOL\nColumn.PageCreatedBy=\\u0928\\u093F\\u0930\\u094D\\u092E\\u093E\\u0924\\u093E\n#XCOL\nColumn.PageCreatedOn=\\u0928\\u093F\\u0930\\u094D\\u092E\\u093E\\u0923 \\u0926\\u093F\\u0928\\u093E\\u0902\\u0915\n#XCOL\nColumn.PageChangedBy=\\u092A\\u0930\\u093F\\u0935\\u0930\\u094D\\u0924\\u0928\\u0915\\u0930\\u094D\\u0924\\u093E\n#XCOL\nColumn.PageChangedOn=\\u0907\\u0938 \\u0926\\u093F\\u0928\\u093E\\u0902\\u0915 \\u0915\\u094B \\u092A\\u0930\\u093F.\n\n#XTOL\nPlaceholder.CopySpaceTitle="{0}" \\u0915\\u0940 \\u092A\\u094D\\u0930\\u0924\\u093F \\u092C\\u0928\\u093E\\u090F\\u0902\n#XTOL\nPlaceholder.CopySpaceID="{0}" \\u0915\\u0940 \\u092A\\u094D\\u0930\\u0924\\u093F \\u092C\\u0928\\u093E\\u090F\\u0902\n\n#XMSG\nMessage.NoInternetConnection=\\u0915\\u0943\\u092A\\u092F\\u093E \\u0905\\u092A\\u0928\\u0947 \\u0907\\u0902\\u091F\\u0930\\u0928\\u0947\\u091F \\u0915\\u0928\\u0947\\u0915\\u094D\\u0936\\u0928 \\u0915\\u0940 \\u091C\\u093E\\u0902\\u091A \\u0915\\u0930\\u0947\\u0902.\n#XMSG\nMessage.SavedChanges=\\u0906\\u092A\\u0915\\u0947 \\u092A\\u0930\\u093F\\u0935\\u0930\\u094D\\u0924\\u0928\\u094B\\u0902 \\u0915\\u094B \\u0938\\u0939\\u0947\\u091C\\u093E \\u0917\\u092F\\u093E \\u0939\\u0948.\n#XMSG\nMessage.InvalidPageID=\\u0915\\u0943\\u092A\\u092F\\u093E \\u0915\\u0947\\u0935\\u0932 \\u0928\\u093F\\u092E\\u094D\\u0928\\u0932\\u093F\\u0916\\u093F\\u0924 \\u0935\\u0930\\u094D\\u0923\\u094B\\u0902 \\u0915\\u093E \\u0909\\u092A\\u092F\\u094B\\u0917 \\u0915\\u0930\\u0947\\u0902\\: A-Z a-z 0-9 _ /. \\u092A\\u0943\\u0937\\u094D\\u0920 \\u0906\\u0908\\u0921\\u0940 \\u0915\\u093F\\u0938\\u0940 \\u0928\\u0902\\u092C\\u0930 \\u0938\\u0947 \\u0936\\u0941\\u0930\\u0942 \\u0928\\u0939\\u0940\\u0902 \\u0939\\u094B\\u0928\\u0940 \\u091A\\u093E\\u0939\\u093F\\u090F.\n#XMSG\nMessage.EmptySpaceID=\\u0915\\u0943\\u092A\\u092F\\u093E \\u0915\\u094B\\u0908 \\u092E\\u093E\\u0928 \\u0938\\u094D\\u092A\\u0947\\u0938 ID \\u092A\\u094D\\u0930\\u0926\\u093E\\u0928 \\u0915\\u0930\\u0947\\u0902.\n#XMSG\nMessage.EmptyTitle=\\u0915\\u0943\\u092A\\u092F\\u093E \\u0915\\u094B\\u0908 \\u092E\\u093E\\u0928 \\u0936\\u0940\\u0930\\u094D\\u0937\\u0915 \\u092A\\u094D\\u0930\\u0926\\u093E\\u0928 \\u0915\\u0930\\u0947\\u0902.\n#XMSG\nMessage.SuccessDeletePage=\\u091A\\u092F\\u0928\\u093F\\u0924 \\u0911\\u092C\\u094D\\u091C\\u0947\\u0915\\u094D\\u091F \\u0939\\u091F\\u093E \\u0926\\u093F\\u092F\\u093E \\u0917\\u092F\\u093E \\u0939\\u0948.\n#XMSG\nMessage.ClipboardCopySuccess=\\u0935\\u093F\\u0935\\u0930\\u0923 \\u0938\\u092B\\u0932\\u0924\\u093E\\u092A\\u0942\\u0930\\u094D\\u0935\\u0915 \\u092A\\u094D\\u0930\\u0924\\u093F \\u092C\\u0928\\u093E\\u092F\\u093E \\u0917\\u092F\\u093E.\n#YMSE\nMessage.ClipboardCopyFail=\\u0935\\u093F\\u0935\\u0930\\u0923 \\u092A\\u094D\\u0930\\u0924\\u093F \\u092C\\u0928\\u093E\\u0924\\u0947 \\u0938\\u092E\\u092F \\u0924\\u094D\\u0930\\u0941\\u091F\\u093F \\u0909\\u0924\\u094D\\u092A\\u0928\\u094D\\u0928 \\u0939\\u0941\\u0908.\n#XMSG\nMessage.SpaceCreated=\\u0938\\u094D\\u092A\\u0947\\u0938 \\u092C\\u0928\\u093E\\u0908 \\u091C\\u093E \\u091A\\u0941\\u0915\\u0940 \\u0939\\u0948.\n\n#XMSG\nMessage.NavigationTargetError=\\u0928\\u0947\\u0935\\u093F\\u0917\\u0947\\u0936\\u0928 \\u0932\\u0915\\u094D\\u0937\\u094D\\u092F \\u0915\\u094B \\u0939\\u0932 \\u0928\\u0939\\u0940\\u0902 \\u0915\\u093F\\u092F\\u093E \\u091C\\u093E \\u0938\\u0915\\u093E.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=\\u091F\\u093E\\u0907\\u0932 \\u0915\\u0947 \\u0928\\u0947\\u0935\\u093F\\u0917\\u0947\\u0936\\u0928 \\u0932\\u0915\\u094D\\u0937\\u094D\\u092F \\u0915\\u094B \\u0939\\u0932 \\u0915\\u0930\\u0928\\u0947 \\u092E\\u0947\\u0902 \\u0935\\u093F\\u092B\\u0932\\: "{0}".\\n\\n\\u092F\\u0939 SAP Fiori \\u0932\\u0949\\u0928\\u094D\\u091A\\u092A\\u0948\\u0921 \\u0938\\u093E\\u092E\\u0917\\u094D\\u0930\\u0940 \\u0915\\u0947 \\u0905\\u092E\\u093E\\u0928\\u094D\\u092F \\u0915\\u0949\\u0928\\u094D\\u092B\\u093C\\u093F\\u0917\\u0930\\u0947\\u0936\\u0928 \\u0915\\u0947 \\u0915\\u093E\\u0930\\u0923 \\u0938\\u092C\\u0938\\u0947 \\u0905\\u0927\\u093F\\u0915 \\u0938\\u0902\\u092D\\u093E\\u0935\\u0928\\u093E \\u0939\\u0948. \\u0935\\u093F\\u091C\\u093C\\u0941\\u0905\\u0932\\u093E\\u0907\\u091C\\u093C\\u0947\\u0936\\u0928 \\u0915\\u094B\\u0908 \\u090F\\u092A\\u094D\\u0932\\u093F\\u0915\\u0947\\u0936\\u0928 \\u0928\\u0939\\u0940\\u0902 \\u0916\\u094B\\u0932 \\u0938\\u0915\\u0924\\u093E.\n#XMSG\nMessage.PageIsOutdated=\\u0907\\u0938 \\u092A\\u0943\\u0937\\u094D\\u0920 \\u0915\\u093E \\u0928\\u092F\\u093E \\u0938\\u0902\\u0938\\u094D\\u0915\\u0930\\u0923 \\u092A\\u0939\\u0932\\u0947 \\u0939\\u0940 \\u0938\\u0939\\u0947\\u091C\\u093E \\u091C\\u093E \\u091A\\u0941\\u0915\\u093E \\u0939\\u0948.\n#XMSG\nMessage.SaveChanges=\\u0915\\u0943\\u092A\\u092F\\u093E \\u0905\\u092A\\u0928\\u0947 \\u092C\\u0926\\u0932\\u093E\\u0935\\u094B\\u0902 \\u0915\\u094B \\u0938\\u0939\\u0947\\u091C\\u0947\\u0902.\n#XMSG\nMessage.NoSpaces=\\u0915\\u094B\\u0908 \\u0938\\u094D\\u092A\\u0947\\u0938 \\u092E\\u094C\\u091C\\u0942\\u0926 \\u0928\\u0939\\u0940\\u0902 \\u0939\\u0948.\n#XMSG\nMessage.NoSpacesFound=\\u0915\\u094B\\u0908 \\u0938\\u094D\\u092A\\u0947\\u0938 \\u0928\\u0939\\u0940\\u0902 \\u092E\\u093F\\u0932\\u093E. \\u0905\\u092A\\u0928\\u0940 \\u0916\\u094B\\u091C \\u0915\\u093E \\u0938\\u092E\\u093E\\u092F\\u094B\\u091C\\u0928 \\u0915\\u0930\\u0928\\u0947 \\u0915\\u093E \\u092A\\u094D\\u0930\\u092F\\u093E\\u0938 \\u0915\\u0930\\u0947\\u0902.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=\\u0928\\u092F\\u093E \\u0938\\u094D\\u092A\\u0947\\u0938\n#XTIT\nDeleteDialog.Title=\\u0939\\u091F\\u093E\\u090F\\u0902\n#XMSG\nDeleteDialog.Text=\\u0915\\u094D\\u092F\\u093E \\u0906\\u092A \\u0935\\u093E\\u0915\\u0908 \\u091A\\u092F\\u0928\\u093F\\u0924 \\u0938\\u094D\\u092A\\u0947\\u0938 \\u0915\\u094B \\u0939\\u091F\\u093E\\u0928\\u093E \\u091A\\u093E\\u0939\\u0924\\u0947 \\u0939\\u0948?\n#XBUT\nDeleteDialog.ConfirmButton=\\u0939\\u091F\\u093E\\u090F\\u0902\n#XTIT\nDeleteDialog.LockedTitle=\\u0938\\u094D\\u092A\\u0947\\u0938 \\u0932\\u0949\\u0915 \\u0915\\u093F\\u092F\\u093E \\u0917\\u092F\\u093E\n#XMSG\nDeleteDialog.LockedText=\\u091A\\u092F\\u0928\\u093F\\u0924 \\u0938\\u094D\\u092A\\u0947\\u0938 "{0}" \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0915\\u0947 \\u0926\\u094D\\u0935\\u093E\\u0930\\u093E \\u0932\\u0949\\u0915 \\u0915\\u0930 \\u0926\\u093F\\u092F\\u093E \\u0917\\u092F\\u093E \\u0939\\u0948.\n#XMSG\nDeleteDialog.TransportRequired=\\u091A\\u092F\\u0928\\u093F\\u0924 \\u0938\\u094D\\u092A\\u0947\\u0938 \\u0915\\u094B \\u0939\\u091F\\u093E\\u0928\\u0947 \\u0915\\u0947 \\u0932\\u093F\\u090F \\u0915\\u0943\\u092A\\u092F\\u093E \\u0915\\u094B\\u0908 \\u091F\\u094D\\u0930\\u093E\\u0902\\u0938\\u092A\\u094B\\u0930\\u094D\\u091F \\u092A\\u0948\\u0915\\u0947\\u091C \\u091A\\u0941\\u0928\\u0947\\u0902.\n\n#XMSG\nEditDialog.LockedText=\\u091A\\u092F\\u0928\\u093F\\u0924 \\u0938\\u094D\\u092A\\u0947\\u0938 "{0}" \\u0909\\u092A\\u092F\\u094B\\u0917\\u0915\\u0930\\u094D\\u0924\\u093E \\u0915\\u0947 \\u0926\\u094D\\u0935\\u093E\\u0930\\u093E \\u0932\\u0949\\u0915 \\u0915\\u0930 \\u0926\\u093F\\u092F\\u093E \\u0917\\u092F\\u093E \\u0939\\u0948.\n#XMSG\nEditDialog.TransportRequired=\\u091A\\u092F\\u0928\\u093F\\u0924 \\u0938\\u094D\\u092A\\u0947\\u0938 \\u0915\\u094B \\u0938\\u0902\\u092A\\u093E\\u0926\\u093F\\u0924 \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0947 \\u0932\\u093F\\u090F \\u0915\\u0943\\u092A\\u092F\\u093E \\u0915\\u094B\\u0908 \\u091F\\u094D\\u0930\\u093E\\u0902\\u0938\\u092A\\u094B\\u0930\\u094D\\u091F \\u092A\\u0948\\u0915\\u0947\\u091C \\u091A\\u0941\\u0928\\u0947\\u0902.\n#XTIT\nEditDialog.Title=\\u0938\\u094D\\u092A\\u0947\\u0938 \\u0915\\u094B \\u0938\\u0902\\u092A\\u093E\\u0926\\u093F\\u0924 \\u0915\\u0930\\u0947\\u0902\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=\\u0907\\u0938 \\u0938\\u094D\\u092A\\u0947\\u0938 \\u0915\\u094B "{0}" \\u092D\\u093E\\u0937\\u093E \\u092E\\u0947\\u0902 \\u092C\\u0928\\u093E\\u092F\\u093E \\u0917\\u092F\\u093E \\u0939\\u0948, \\u0932\\u0947\\u0915\\u093F\\u0928 \\u0906\\u092A\\u0915\\u0940 \\u0932\\u0949\\u0917 \\u0911\\u0928 \\u092D\\u093E\\u0937\\u093E "{1}\\u201D \\u0938\\u0947\\u091F \\u0939\\u0948. \\u0915\\u0943\\u092A\\u092F\\u093E \\u0906\\u0917\\u0947 \\u092C\\u0922\\u093C\\u0928\\u0947 \\u0915\\u0947 \\u0932\\u093F\\u090F \\u0905\\u092A\\u0928\\u0940 \\u0932\\u0949\\u0917 \\u0911\\u0928 \\u092D\\u093E\\u0937\\u093E \\u0915\\u094B "{0}\\u201D \\u092E\\u0947\\u0902 \\u092C\\u0926\\u0932\\u0947\\u0902.\n\n#XTIT\nErrorDialog.Title=\\u0924\\u094D\\u0930\\u0941\\u091F\\u093F\n\n#XTIT\nSpaceOverview.Title=\\u092A\\u0943\\u0937\\u094D\\u0920 \\u092C\\u0928\\u093E\\u090F \\u0930\\u0916\\u0947\\u0902\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=\\u0932\\u0947\\u0906\\u0909\\u091F\n\n#XTIT\nCopyDialog.Title=\\u0938\\u094D\\u092A\\u0947\\u0938 \\u0915\\u0949\\u092A\\u0940 \\u0915\\u0930\\u0947\\u0902\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=\\u0915\\u094D\\u092F\\u093E \\u0906\\u092A "{0}" \\u0915\\u094B \\u0915\\u0949\\u092A\\u0940 \\u0915\\u0930\\u0928\\u093E \\u091A\\u093E\\u0939\\u0924\\u0947 \\u0939\\u0948\\u0902?\n#XFLD\nCopyDialog.NewID="{0}" \\u0915\\u0940 \\u092A\\u094D\\u0930\\u0924\\u093F \\u092C\\u0928\\u093E\\u090F\\u0902\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=\\u0915\\u094D\\u0937\\u092E\\u093E \\u0915\\u0930\\u0947\\u0902, \\u0939\\u092E \\u0907\\u0938 \\u0938\\u094D\\u092A\\u0947\\u0938 \\u0915\\u094B \\u0928\\u0939\\u0940\\u0902 \\u0922\\u0942\\u0902\\u0922 \\u0938\\u0915\\u0947.\n#XLNK\nErrorPage.Link=\\u0938\\u094D\\u092A\\u0947\\u0938 \\u0930\\u0916\\u0947\\u0902\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_hu.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=Terek karbantart\\u00E1sa\n\n#XBUT\nButton.Add=Hozz\\u00E1ad\\u00E1s\n#XBUT\nButton.Cancel=M\\u00E9gse\n#XBUT\nButton.Copy=M\\u00E1sol\\u00E1s\n#XBUT\nButton.Create=L\\u00E9trehoz\\u00E1s\n#XBUT\nButton.Delete=T\\u00F6rl\\u00E9s\n#XBUT\nButton.Edit=Feldolgoz\\u00E1s\n#XBUT\nButton.Save=Ment\\u00E9s\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowPages=Oldalak megjelen\\u00EDt\\u00E9se\n#XBUT\nButton.HidePages=Oldalak elrejt\\u00E9se\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=Probl\\u00E9m\\u00E1k\\: {0}\n#XBUT\nButton.SortPages=Oldalak rendez\\u00E9si sorrendj\\u00E9nek v\\u00E1lt\\u00E1sa\n#XBUT\nButton.ShowDetails=Inform\\u00E1ci\\u00F3k megjelen\\u00EDt\\u00E9se\n#XBUT\nButton.ErrorMsg=Hiba\\u00FCzenetek\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=Keres\\u00E9s\n#XTOL\nTooltip.SearchForTiles=T\\u00E9rkeres\\u00E9s\n\n#XFLD\nLabel.SpaceID=T\\u00E9razonos\\u00EDt\\u00F3\n#XFLD\nLabel.Title=C\\u00EDm\n#XFLD\nLabel.WorkbenchRequest=Workbench-k\\u00E9relem\n#XFLD\nLabel.Package=Csomag\n#XFLD\nLabel.TransportInformation=Transzportinform\\u00E1ci\\u00F3\n#XFLD\nLabel.Details=R\\u00E9szletek\\:\n#XFLD\nLabel.ResponseCode=V\\u00E1laszk\\u00F3d\\:\n#XFLD\nLabel.Description=Le\\u00EDr\\u00E1s\n#XFLD\nLabel.CreatedByFullname=L\\u00E9trehozta\\:\n#XFLD\nLabel.CreatedOn=L\\u00E9trehoz\\u00E1s d\\u00E1tuma\n#XFLD\nLabel.ChangedByFullname=M\\u00F3dos\\u00EDt\\u00F3\n#XFLD\nLabel.ChangedOn=M\\u00F3dos\\u00EDt\\u00E1s d\\u00E1tuma\n#XFLD\nLabel.PageTitle=Oldal c\\u00EDme\n#XFLD\nLabel.AssignedRole=Hozz\\u00E1rendelt szerep\n\n#XCOL\nColumn.SpaceID=Azonos\\u00EDt\\u00F3\n#XCOL\nColumn.SpaceTitle=C\\u00EDm\n#XCOL\nColumn.SpaceDescription=Megnevez\\u00E9s\n#XCOL\nColumn.SpacePackage=Csomag\n#XCOL\nColumn.SpaceWorkbenchRequest=Workbench-k\\u00E9relem\n#XCOL\nColumn.SpaceCreatedBy=L\\u00E9trehozta\n#XCOL\nColumn.SpaceCreatedOn=L\\u00E9trehoz\\u00E1s d\\u00E1tuma\n#XCOL\nColumn.SpaceChangedBy=M\\u00F3dos\\u00EDt\\u00F3\n#XCOL\nColumn.SpaceChangedOn=M\\u00F3dos\\u00EDt\\u00E1s d\\u00E1tuma\n\n#XCOL\nColumn.PageID=Azonos\\u00EDt\\u00F3\n#XCOL\nColumn.PageTitle=C\\u00EDm\n#XCOL\nColumn.PageDescription=Megnevez\\u00E9s\n#XCOL\nColumn.PagePackage=Csomag\n#XCOL\nColumn.PageWorkbenchRequest=Workbench-k\\u00E9relem\n#XCOL\nColumn.PageCreatedBy=L\\u00E9trehozta\n#XCOL\nColumn.PageCreatedOn=L\\u00E9trehoz\\u00E1s d\\u00E1tuma\n#XCOL\nColumn.PageChangedBy=M\\u00F3dos\\u00EDt\\u00F3\n#XCOL\nColumn.PageChangedOn=M\\u00F3dos\\u00EDt\\u00E1s d\\u00E1tuma\n\n#XTOL\nPlaceholder.CopySpaceTitle={0} m\\u00E1solata\n#XTOL\nPlaceholder.CopySpaceID={0} m\\u00E1solata\n\n#XMSG\nMessage.NoInternetConnection=Ellen\\u0151rizze az internetkapcsolat\\u00E1t.\n#XMSG\nMessage.SavedChanges=A m\\u00F3dos\\u00EDt\\u00E1sok mentve.\n#XMSG\nMessage.InvalidPageID=Csak a k\\u00F6vetkez\\u0151 karaktereket haszn\\u00E1lja\\: A-Z a-z 0-9 _ \\u00E9s /. Az oldalazonos\\u00EDt\\u00F3 nem kezd\\u0151dhet sz\\u00E1mmal.\n#XMSG\nMessage.EmptySpaceID=Adjon meg \\u00E9rv\\u00E9nyes t\\u00E9razonos\\u00EDt\\u00F3t.\n#XMSG\nMessage.EmptyTitle=Adjon meg \\u00E9rv\\u00E9nyes c\\u00EDmet.\n#XMSG\nMessage.SuccessDeletePage=A kiv\\u00E1lasztott objektum t\\u00F6rl\\u0151d\\u00F6tt.\n#XMSG\nMessage.ClipboardCopySuccess=A r\\u00E9szletek sikeresen m\\u00E1solva.\n#YMSE\nMessage.ClipboardCopyFail=Hiba l\\u00E9pett fel a r\\u00E9szletek m\\u00E1sol\\u00E1sakor.\n#XMSG\nMessage.SpaceCreated=A t\\u00E9r l\\u00E9trej\\u00F6tt.\n\n#XMSG\nMessage.NavigationTargetError=A navig\\u00E1ci\\u00F3s c\\u00E9l nem tal\\u00E1lhat\\u00F3.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=A(z) {0} csempe navig\\u00E1ci\\u00F3s c\\u00E9lja nem tal\\u00E1lhat\\u00F3.\\n\\nEnnek oka val\\u00F3sz\\u00EDn\\u0171leg egy helytelen SAP Fiori-ind\\u00EDt\\u00F3pulti tartalomkonfigur\\u00E1ci\\u00F3. A megjelen\\u00EDt\\u00E9s nem tudja az alkalmaz\\u00E1st megnyitni.\n#XMSG\nMessage.PageIsOutdated=M\\u00E1r mentett\\u00E9k az oldal \\u00FAjabb verzi\\u00F3j\\u00E1t.\n#XMSG\nMessage.SaveChanges=Mentse a m\\u00F3dos\\u00EDt\\u00E1sait.\n#XMSG\nMessage.NoSpaces=Nincs el\\u00E9rhet\\u0151 t\\u00E9r.\n#XMSG\nMessage.NoSpacesFound=Nem tal\\u00E1lhat\\u00F3 t\\u00E9r. M\\u00F3dos\\u00EDtsa a keres\\u00E9st.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=\\u00DAj t\\u00E9r\n#XTIT\nDeleteDialog.Title=T\\u00F6rl\\u00E9s\n#XMSG\nDeleteDialog.Text=Biztosan t\\u00F6rli a kijel\\u00F6lt teret?\n#XBUT\nDeleteDialog.ConfirmButton=T\\u00F6rl\\u00E9s\n#XTIT\nDeleteDialog.LockedTitle=T\\u00E9r z\\u00E1rolva\n#XMSG\nDeleteDialog.LockedText=A kiv\\u00E1lasztott teret "{0}" felhaszn\\u00E1l\\u00F3 z\\u00E1rolja.\n#XMSG\nDeleteDialog.TransportRequired=V\\u00E1lasszon egy transzportcsomagot a kiv\\u00E1lasztott t\\u00E9r t\\u00F6rl\\u00E9s\\u00E9hez.\n\n#XMSG\nEditDialog.LockedText=A kiv\\u00E1lasztott teret "{0}" felhaszn\\u00E1l\\u00F3 z\\u00E1rolja.\n#XMSG\nEditDialog.TransportRequired=V\\u00E1lasszon egy transzportcsomagot a kiv\\u00E1lasztott t\\u00E9r szerkeszt\\u00E9s\\u00E9hez.\n#XTIT\nEditDialog.Title=T\\u00E9r szerkeszt\\u00E9se\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=Ez a t\\u00E9r "{0}" nyelven k\\u00E9sz\\u00FClt, de a bejelentkez\\u00E9si nyelve "{1}". A folytat\\u00E1shoz m\\u00F3dos\\u00EDtsa a bejelentkez\\u00E9si nyelvet erre\\:"{0}".\n\n#XTIT\nErrorDialog.Title=Hiba\n\n#XTIT\nSpaceOverview.Title=Oldalak karbantart\\u00E1sa\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=Layout\n\n#XTIT\nCopyDialog.Title=T\\u00E9r m\\u00E1sol\\u00E1sa\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=M\\u00E1solja a k\\u00F6vetkez\\u0151t\\: "{0}"?\n#XFLD\nCopyDialog.NewID={0} m\\u00E1solata\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=Sajnos a t\\u00E9r nem tal\\u00E1lhat\\u00F3.\n#XLNK\nErrorPage.Link=Terek karbantart\\u00E1sa\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_it.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=Aggiorna spazi\n\n#XBUT\nButton.Add=Aggiungi\n#XBUT\nButton.Cancel=Annulla\n#XBUT\nButton.Copy=Copia\n#XBUT\nButton.Create=Crea\n#XBUT\nButton.Delete=Elimina\n#XBUT\nButton.Edit=Elabora\n#XBUT\nButton.Save=Salva\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowPages=Visualizza pagine\n#XBUT\nButton.HidePages=Nascondi pagine\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=Problemi\\: {0}\n#XBUT\nButton.SortPages=Attiva/disattiva ordine di classificazione pagine\n#XBUT\nButton.ShowDetails=Visualizza dettagli\n#XBUT\nButton.ErrorMsg=Messaggi di errore\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=Ricerca\n#XTOL\nTooltip.SearchForTiles=Ricerca spazi\n\n#XFLD\nLabel.SpaceID=ID spazio\n#XFLD\nLabel.Title=Titolo\n#XFLD\nLabel.WorkbenchRequest=Richiesta workbench\n#XFLD\nLabel.Package=Pacchetto\n#XFLD\nLabel.TransportInformation=Informazioni trasporto\n#XFLD\nLabel.Details=Dettagli\\:\n#XFLD\nLabel.ResponseCode=Codice risposta\\:\n#XFLD\nLabel.Description=Descrizione\n#XFLD\nLabel.CreatedByFullname=Autore creazione\n#XFLD\nLabel.CreatedOn=Data di creazione\n#XFLD\nLabel.ChangedByFullname=Autore modifica\n#XFLD\nLabel.ChangedOn=Data di modifica\n#XFLD\nLabel.PageTitle=Titolo pagina\n#XFLD\nLabel.AssignedRole=Ruolo attribuito\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=Titolo\n#XCOL\nColumn.SpaceDescription=Descrizione\n#XCOL\nColumn.SpacePackage=Pacchetto\n#XCOL\nColumn.SpaceWorkbenchRequest=Richiesta workbench\n#XCOL\nColumn.SpaceCreatedBy=Autore creazione\n#XCOL\nColumn.SpaceCreatedOn=Data di creazione\n#XCOL\nColumn.SpaceChangedBy=Autore modifica\n#XCOL\nColumn.SpaceChangedOn=Data di modifica\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Titolo\n#XCOL\nColumn.PageDescription=Descrizione\n#XCOL\nColumn.PagePackage=Pacchetto\n#XCOL\nColumn.PageWorkbenchRequest=Richiesta workbench\n#XCOL\nColumn.PageCreatedBy=Autore creazione\n#XCOL\nColumn.PageCreatedOn=Data di creazione\n#XCOL\nColumn.PageChangedBy=Autore modifica\n#XCOL\nColumn.PageChangedOn=Data di modifica\n\n#XTOL\nPlaceholder.CopySpaceTitle=Copia di "{0}"\n#XTOL\nPlaceholder.CopySpaceID=Copia di "{0}"\n\n#XMSG\nMessage.NoInternetConnection=Controlla la connessione Internet.\n#XMSG\nMessage.SavedChanges=Le modifiche sono state salvate.\n#XMSG\nMessage.InvalidPageID=Utilizza solo i seguenti caratteri\\: A-Z, 0-9, _ e /. L\'ID pagina non dovrebbe iniziare con un numero.\n#XMSG\nMessage.EmptySpaceID=Fornisci un ID dello spazio valido.\n#XMSG\nMessage.EmptyTitle=Fornisci un titolo valido.\n#XMSG\nMessage.SuccessDeletePage=L\'oggetto selezionato \\u00E8 stato eliminato.\n#XMSG\nMessage.ClipboardCopySuccess=I dettagli sono stati copiati correttamente.\n#YMSE\nMessage.ClipboardCopyFail=Errore durante la copia dei dettagli.\n#XMSG\nMessage.SpaceCreated=Lo spazio \\u00E8 stato creato.\n\n#XMSG\nMessage.NavigationTargetError=La destinazione di navigazione non \\u00E8 stata risolta.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=Risoluzione fallita della destinazione di navigazione del tile\\: "{0}".\\n\\nCi\\u00F2 dipende molto probabilmente da una configurazione errata del contenuto del launchpad di SAP Fiori. La visualizzazione non pu\\u00F2 aprire un\'\'applicazione.\n#XMSG\nMessage.PageIsOutdated=Una versione pi\\u00F9 recente di questa pagina \\u00E8 gi\\u00E0 stata salvata.\n#XMSG\nMessage.SaveChanges=Salva le modifiche.\n#XMSG\nMessage.NoSpaces=Nessuno spazio disponibile.\n#XMSG\nMessage.NoSpacesFound=Nessuno spazio trovato. Prova a correggere la ricerca.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=Nuovo spazio\n#XTIT\nDeleteDialog.Title=Elimina\n#XMSG\nDeleteDialog.Text=Confermare l\'eliminazione dello spazio selezionato?\n#XBUT\nDeleteDialog.ConfirmButton=Elimina\n#XTIT\nDeleteDialog.LockedTitle=Spazio bloccato\n#XMSG\nDeleteDialog.LockedText=Lo spazio selezionato \\u00E8 bloccato dall\'\'utente "{0}".\n#XMSG\nDeleteDialog.TransportRequired=Seleziona un pacchetto di trasporto per eliminare lo spazio selezionato.\n\n#XMSG\nEditDialog.LockedText=Lo spazio selezionato \\u00E8 bloccato dall\'\'utente "{0}".\n#XMSG\nEditDialog.TransportRequired=Seleziona un pacchetto di trasporto per elaborare lo spazio selezionato.\n#XTIT\nEditDialog.Title=Elabora spazio\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=Questo spazio \\u00E8 stato creato nella lingua "{0}" ma la tua lingua di logon \\u00E8 impostata su "{1}". Modifica la tua lingua di logon su "{0}" per continuare.\n\n#XTIT\nErrorDialog.Title=Errore/i\n\n#XTIT\nSpaceOverview.Title=Elabora pagine\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=Layout\n\n#XTIT\nCopyDialog.Title=Copia spazio\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=Copiare "{0}"?\n#XFLD\nCopyDialog.NewID=Copia di "{0}"\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=Purtroppo lo spazio non \\u00E8 stato trovato.\n#XLNK\nErrorPage.Link=Aggiorna spazi\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_iw.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=\\u05EA\\u05D7\\u05D6\\u05E7 \\u05DE\\u05E8\\u05D5\\u05D5\\u05D7\\u05D9\\u05DD\n\n#XBUT\nButton.Add=\\u05D4\\u05D5\\u05E1\\u05E3\n#XBUT\nButton.Cancel=\\u05D1\\u05D8\\u05DC\n#XBUT\nButton.Copy=\\u05D4\\u05E2\\u05EA\\u05E7\n#XBUT\nButton.Create=\\u05E6\\u05D5\\u05E8\n#XBUT\nButton.Delete=\\u05DE\\u05D7\\u05E7\n#XBUT\nButton.Edit=\\u05E2\\u05E8\\u05D5\\u05DA\n#XBUT\nButton.Save=\\u05E9\\u05DE\\u05D5\\u05E8\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowPages=\\u05D4\\u05E6\\u05D2 \\u05D3\\u05E4\\u05D9\\u05DD\n#XBUT\nButton.HidePages=\\u05D4\\u05E1\\u05EA\\u05E8 \\u05D3\\u05E4\\u05D9\\u05DD\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=\\u05D1\\u05E2\\u05D9\\u05D5\\u05EA\\: {0}\n#XBUT\nButton.SortPages=\\u05D4\\u05D7\\u05DC\\u05E3 \\u05D0\\u05EA \\u05E1\\u05D3\\u05E8 \\u05DE\\u05D9\\u05D5\\u05DF \\u05D4\\u05D3\\u05E4\\u05D9\\u05DD\n#XBUT\nButton.ShowDetails=\\u05D4\\u05E6\\u05D2 \\u05E4\\u05E8\\u05D8\\u05D9\\u05DD\n#XBUT\nButton.ErrorMsg=\\u05D4\\u05D5\\u05D3\\u05E2\\u05D5\\u05EA \\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=\\u05D7\\u05E4\\u05E9\n#XTOL\nTooltip.SearchForTiles=\\u05D7\\u05E4\\u05E9 \\u05DE\\u05E8\\u05D5\\u05D5\\u05D7\\u05D9\\u05DD\n\n#XFLD\nLabel.SpaceID=\\u05D6\\u05D9\\u05D4\\u05D5\\u05D9 \\u05DE\\u05E8\\u05D5\\u05D5\\u05D7\n#XFLD\nLabel.Title=\\u05DB\\u05D5\\u05EA\\u05E8\\u05EA\n#XFLD\nLabel.WorkbenchRequest=\\u05D1\\u05E7\\u05E9\\u05EA Workbench\n#XFLD\nLabel.Package=\\u05D7\\u05D1\\u05D9\\u05DC\\u05D4\n#XFLD\nLabel.TransportInformation=\\u05DE\\u05D9\\u05D3\\u05E2 \\u05E2\\u05DC \\u05D8\\u05E8\\u05E0\\u05E1\\u05E4\\u05D5\\u05E8\\u05D8\n#XFLD\nLabel.Details=\\u05E4\\u05E8\\u05D8\\u05D9\\u05DD\\:\n#XFLD\nLabel.ResponseCode=\\u05E7\\u05D5\\u05D3 \\u05EA\\u05D2\\u05D5\\u05D1\\u05D4\\:\n#XFLD\nLabel.Description=\\u05EA\\u05D9\\u05D0\\u05D5\\u05E8\n#XFLD\nLabel.CreatedByFullname=\\u05E0\\u05D5\\u05E6\\u05E8 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9\n#XFLD\nLabel.CreatedOn=\\u05E0\\u05D5\\u05E6\\u05E8 \\u05D1\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA\n#XFLD\nLabel.ChangedByFullname=\\u05E9\\u05D5\\u05E0\\u05D4 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9\n#XFLD\nLabel.ChangedOn=\\u05E9\\u05D5\\u05E0\\u05D4 \\u05D1\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA\n#XFLD\nLabel.PageTitle=\\u05DB\\u05D5\\u05EA\\u05E8\\u05EA \\u05D3\\u05E3\n#XFLD\nLabel.AssignedRole=\\u05EA\\u05E4\\u05E7\\u05D9\\u05D3 \\u05DE\\u05D5\\u05E7\\u05E6\\u05D4\n\n#XCOL\nColumn.SpaceID=\\u05D6\\u05D9\\u05D4\\u05D5\\u05D9\n#XCOL\nColumn.SpaceTitle=\\u05DB\\u05D5\\u05EA\\u05E8\\u05EA\n#XCOL\nColumn.SpaceDescription=\\u05EA\\u05D9\\u05D0\\u05D5\\u05E8\n#XCOL\nColumn.SpacePackage=\\u05D7\\u05D1\\u05D9\\u05DC\\u05D4\n#XCOL\nColumn.SpaceWorkbenchRequest=\\u05D1\\u05E7\\u05E9\\u05EA Workbench\n#XCOL\nColumn.SpaceCreatedBy=\\u05E0\\u05D5\\u05E6\\u05E8 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9\n#XCOL\nColumn.SpaceCreatedOn=\\u05E0\\u05D5\\u05E6\\u05E8 \\u05D1\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA\n#XCOL\nColumn.SpaceChangedBy=\\u05E9\\u05D5\\u05E0\\u05D4 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9\n#XCOL\nColumn.SpaceChangedOn=\\u05E9\\u05D5\\u05E0\\u05D4 \\u05D1\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA\n\n#XCOL\nColumn.PageID=\\u05D6\\u05D9\\u05D4\\u05D5\\u05D9\n#XCOL\nColumn.PageTitle=\\u05DB\\u05D5\\u05EA\\u05E8\\u05EA\n#XCOL\nColumn.PageDescription=\\u05EA\\u05D9\\u05D0\\u05D5\\u05E8\n#XCOL\nColumn.PagePackage=\\u05D7\\u05D1\\u05D9\\u05DC\\u05D4\n#XCOL\nColumn.PageWorkbenchRequest=\\u05D1\\u05E7\\u05E9\\u05EA Workbench\n#XCOL\nColumn.PageCreatedBy=\\u05E0\\u05D5\\u05E6\\u05E8 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9\n#XCOL\nColumn.PageCreatedOn=\\u05E0\\u05D5\\u05E6\\u05E8 \\u05D1\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA\n#XCOL\nColumn.PageChangedBy=\\u05E9\\u05D5\\u05E0\\u05D4 \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9\n#XCOL\nColumn.PageChangedOn=\\u05E9\\u05D5\\u05E0\\u05D4 \\u05D1\\u05EA\\u05D0\\u05E8\\u05D9\\u05DA\n\n#XTOL\nPlaceholder.CopySpaceTitle=\\u05E2\\u05D5\\u05EA\\u05E7 \\u05E9\\u05DC "{0}"\n#XTOL\nPlaceholder.CopySpaceID=\\u05E2\\u05D5\\u05EA\\u05E7 \\u05E9\\u05DC "{0}"\n\n#XMSG\nMessage.NoInternetConnection=\\u05D1\\u05D3\\u05D5\\u05E7 \\u05D0\\u05EA \\u05D7\\u05D9\\u05D1\\u05D5\\u05E8 \\u05D4\\u05D0\\u05D9\\u05E0\\u05D8\\u05E8\\u05E0\\u05D8 \\u05E9\\u05DC\\u05DA.\n#XMSG\nMessage.SavedChanges=\\u05D4\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD \\u05E9\\u05D1\\u05D9\\u05E6\\u05E2\\u05EA \\u05E0\\u05E9\\u05DE\\u05E8\\u05D5.\n#XMSG\nMessage.InvalidPageID=\\u05D4\\u05E9\\u05EA\\u05DE\\u05E9 \\u05E8\\u05E7 \\u05D1\\u05EA\\u05D5\\u05D5\\u05D9\\u05DD \\u05D4\\u05D1\\u05D0\\u05D9\\u05DD\\: A-Z,\\u200F 0-9, _ \\u05D5- /. \\u05D6\\u05D9\\u05D4\\u05D5\\u05D9 \\u05D4\\u05D3\\u05E3 \\u05DC\\u05D0 \\u05D9\\u05DB\\u05D5\\u05DC \\u05DC\\u05D4\\u05EA\\u05D7\\u05D9\\u05DC \\u05E2\\u05DD \\u05DE\\u05E1\\u05E4\\u05E8.\n#XMSG\nMessage.EmptySpaceID=\\u05E1\\u05E4\\u05E7 \\u05D6\\u05D9\\u05D4\\u05D5\\u05D9 \\u05DE\\u05E8\\u05D5\\u05D5\\u05D7 \\u05D7\\u05D5\\u05E7\\u05D9.\n#XMSG\nMessage.EmptyTitle=\\u05E1\\u05E4\\u05E7 \\u05DB\\u05D5\\u05EA\\u05E8\\u05EA \\u05D7\\u05D5\\u05E7\\u05D9\\u05EA.\n#XMSG\nMessage.SuccessDeletePage=\\u05D4\\u05D0\\u05D5\\u05D1\\u05D9\\u05D9\\u05E7\\u05D8 \\u05E9\\u05E0\\u05D1\\u05D7\\u05E8 \\u05E0\\u05DE\\u05D7\\u05E7.\n#XMSG\nMessage.ClipboardCopySuccess=\\u05E4\\u05E8\\u05D8\\u05D9\\u05DD \\u05D4\\u05D5\\u05E2\\u05EA\\u05E7\\u05D5 \\u05D1\\u05D4\\u05E6\\u05DC\\u05D7\\u05D4.\n#YMSE\nMessage.ClipboardCopyFail=\\u05D0\\u05D9\\u05E8\\u05E2\\u05D4 \\u05E9\\u05D2\\u05D9\\u05D0\\u05D4 \\u05D1\\u05DE\\u05D4\\u05DC\\u05DA \\u05D4\\u05E2\\u05EA\\u05E7\\u05EA \\u05E4\\u05E8\\u05D8\\u05D9\\u05DD.\n#XMSG\nMessage.SpaceCreated=\\u05D4\\u05DE\\u05E8\\u05D5\\u05D5\\u05D7 \\u05E0\\u05D5\\u05E6\\u05E8.\n\n#XMSG\nMessage.NavigationTargetError=\\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05E7\\u05D1\\u05D5\\u05E2 \\u05D9\\u05E2\\u05D3 \\u05E0\\u05D9\\u05D5\\u05D5\\u05D8.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=\\u05E7\\u05D1\\u05D9\\u05E2\\u05EA \\u05D9\\u05E2\\u05D3 \\u05D4\\u05E0\\u05D9\\u05D5\\u05D5\\u05D8 \\u05E9\\u05DC \\u05D4\\u05D0\\u05E8\\u05D9\\u05D7 \\u05E0\\u05DB\\u05E9\\u05DC\\u05D4\\: "{0}".\\n\\n\\u05E1\\u05D1\\u05D9\\u05E8 \\u05DC\\u05D4\\u05E0\\u05D9\\u05D7 \\u05E9\\u05D4\\u05D3\\u05D1\\u05E8 \\u05E0\\u05D2\\u05E8\\u05DD \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 \\u05EA\\u05E6\\u05D5\\u05E8\\u05D4 \\u05E9\\u05D2\\u05D5\\u05D9\\u05D4 \\u05E9\\u05DC \\u05EA\\u05D5\\u05DB\\u05DF \\u05DC\\u05D5\\u05D7 \\u05D4\\u05E4\\u05E2\\u05DC\\u05D4 \\u05E9\\u05DC SAP Fiori. \\u05D4\\u05D4\\u05DE\\u05D7\\u05E9\\u05D4 \\u05D4\\u05D5\\u05D5\\u05D9\\u05D6\\u05D5\\u05D0\\u05DC\\u05D9\\u05EA \\u05DC\\u05D0 \\u05D9\\u05DB\\u05D5\\u05DC\\u05D4 \\u05DC\\u05E4\\u05EA\\u05D5\\u05D7 \\u05D9\\u05D9\\u05E9\\u05D5\\u05DD.\n#XMSG\nMessage.PageIsOutdated=\\u05D2\\u05E8\\u05E1\\u05D4 \\u05D7\\u05D3\\u05E9\\u05D4 \\u05D9\\u05D5\\u05EA\\u05E8 \\u05E9\\u05DC \\u05D3\\u05E3 \\u05D6\\u05D4 \\u05DB\\u05D1\\u05E8 \\u05E0\\u05E9\\u05DE\\u05E8\\u05D4.\n#XMSG\nMessage.SaveChanges=\\u05E9\\u05DE\\u05D5\\u05E8 \\u05D0\\u05EA \\u05D4\\u05E9\\u05D9\\u05E0\\u05D5\\u05D9\\u05D9\\u05DD.\n#XMSG\nMessage.NoSpaces=\\u05D0\\u05D9\\u05DF \\u05DE\\u05E8\\u05D5\\u05D5\\u05D7\\u05D9\\u05DD \\u05D6\\u05DE\\u05D9\\u05E0\\u05D9\\u05DD.\n#XMSG\nMessage.NoSpacesFound=\\u05DC\\u05D0 \\u05E0\\u05DE\\u05E6\\u05D0\\u05D5 \\u05DE\\u05E8\\u05D5\\u05D5\\u05D7\\u05D9\\u05DD. \\u05E0\\u05E1\\u05D4 \\u05DC\\u05D4\\u05EA\\u05D0\\u05D9\\u05DD \\u05D0\\u05EA \\u05D4\\u05D7\\u05D9\\u05E4\\u05D5\\u05E9 \\u05E9\\u05DC\\u05DA.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=\\u05DE\\u05E8\\u05D5\\u05D5\\u05D7 \\u05D7\\u05D3\\u05E9\n#XTIT\nDeleteDialog.Title=\\u05DE\\u05D7\\u05E7\n#XMSG\nDeleteDialog.Text=\\u05D4\\u05D0\\u05DD \\u05D0\\u05EA\\u05D4 \\u05D1\\u05D8\\u05D5\\u05D7 \\u05E9\\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05DE\\u05D7\\u05D5\\u05E7 \\u05D0\\u05EA \\u05D4\\u05DE\\u05E8\\u05D5\\u05D5\\u05D7 \\u05E9\\u05E0\\u05D1\\u05D7\\u05E8?\n#XBUT\nDeleteDialog.ConfirmButton=\\u05DE\\u05D7\\u05E7\n#XTIT\nDeleteDialog.LockedTitle=\\u05DE\\u05E8\\u05D5\\u05D5\\u05D7 \\u05E0\\u05E2\\u05D5\\u05DC\n#XMSG\nDeleteDialog.LockedText=\\u05D4\\u05DE\\u05E8\\u05D5\\u05D5\\u05D7 \\u05E9\\u05E0\\u05D1\\u05D7\\u05E8 \\u05E0\\u05E0\\u05E2\\u05DC \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 "{0}".\n#XMSG\nDeleteDialog.TransportRequired=\\u05D1\\u05D7\\u05E8 \\u05D7\\u05D1\\u05D9\\u05DC\\u05EA \\u05D8\\u05E8\\u05E0\\u05E1\\u05E4\\u05D5\\u05E8\\u05D8 \\u05DC\\u05DE\\u05D7\\u05D9\\u05E7\\u05EA \\u05D4\\u05DE\\u05E8\\u05D5\\u05D5\\u05D7 \\u05D4\\u05E0\\u05D1\\u05D7\\u05E8.\n\n#XMSG\nEditDialog.LockedText=\\u05D4\\u05DE\\u05E8\\u05D5\\u05D5\\u05D7 \\u05E9\\u05E0\\u05D1\\u05D7\\u05E8 \\u05E0\\u05E0\\u05E2\\u05DC \\u05E2\\u05DC-\\u05D9\\u05D3\\u05D9 \\u05DE\\u05E9\\u05EA\\u05DE\\u05E9 "{0}".\n#XMSG\nEditDialog.TransportRequired=\\u05D1\\u05D7\\u05E8 \\u05D7\\u05D1\\u05D9\\u05DC\\u05EA \\u05D8\\u05E8\\u05E0\\u05E1\\u05E4\\u05D5\\u05E8\\u05D8 \\u05DC\\u05E2\\u05E8\\u05D9\\u05DB\\u05EA \\u05D4\\u05DE\\u05E8\\u05D5\\u05D5\\u05D7 \\u05D4\\u05E0\\u05D1\\u05D7\\u05E8.\n#XTIT\nEditDialog.Title=\\u05E2\\u05E8\\u05D5\\u05DA \\u05DE\\u05E8\\u05D5\\u05D5\\u05D7\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=\\u05DE\\u05E8\\u05D5\\u05D5\\u05D7 \\u05D6\\u05D4 \\u05E0\\u05D5\\u05E6\\u05E8 \\u05D1\\u05E9\\u05E4\\u05D4 \'\'{0}\'\', \\u05D0\\u05E3 \\u05E9\\u05E4\\u05EA \\u05D4\\u05DB\\u05E0\\u05D9\\u05E1\\u05D4 \\u05DC\\u05DE\\u05E2\\u05E8\\u05DB\\u05EA \\u05DE\\u05D5\\u05D2\\u05D3\\u05E8\\u05EA \\u05DB-\'\'{1}\'\'. \\u05E9\\u05E0\\u05D4 \\u05D0\\u05EA \\u05E9\\u05E4\\u05EA \\u05D4\\u05DB\\u05E0\\u05D9\\u05E1\\u05D4 \\u05DC\\u05DE\\u05E2\\u05E8\\u05DB\\u05EA \\u05DC-\'\'{0}\'\' \\u05DB\\u05D3\\u05D9 \\u05DC\\u05D4\\u05DE\\u05E9\\u05D9\\u05DA.\n\n#XTIT\nErrorDialog.Title=\\u05E9\\u05D2\\u05D9\\u05D0\\u05D4\n\n#XTIT\nSpaceOverview.Title=\\u05EA\\u05D7\\u05D6\\u05E7 \\u05D3\\u05E4\\u05D9\\u05DD\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=\\u05E4\\u05E8\\u05D9\\u05E1\\u05D4\n\n#XTIT\nCopyDialog.Title=\\u05D4\\u05E2\\u05EA\\u05E7 \\u05DE\\u05E8\\u05D5\\u05D5\\u05D7\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=\\u05D4\\u05D0\\u05DD \\u05D1\\u05E8\\u05E6\\u05D5\\u05E0\\u05DA \\u05DC\\u05D4\\u05E2\\u05EA\\u05D9\\u05E7 \\u05D0\\u05EA "{0}"?\n#XFLD\nCopyDialog.NewID=\\u05E2\\u05D5\\u05EA\\u05E7 \\u05E9\\u05DC "{0}"\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=\\u05DE\\u05E6\\u05D8\\u05E2\\u05E8\\u05D9\\u05DD, \\u05DC\\u05D0 \\u05E0\\u05D9\\u05EA\\u05DF \\u05D4\\u05D9\\u05D4 \\u05DC\\u05DE\\u05E6\\u05D5\\u05D0 \\u05DE\\u05E8\\u05D5\\u05D5\\u05D7 \\u05D6\\u05D4.\n#XLNK\nErrorPage.Link=\\u05EA\\u05D7\\u05D6\\u05E7 \\u05DE\\u05E8\\u05D5\\u05D5\\u05D7\\u05D9\\u05DD\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_ja.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=\\u9818\\u57DF\\u306E\\u8A2D\\u5B9A\n\n#XBUT\nButton.Add=\\u8FFD\\u52A0\n#XBUT\nButton.Cancel=\\u4E2D\\u6B62\n#XBUT\nButton.Copy=\\u30B3\\u30D4\\u30FC\n#XBUT\nButton.Create=\\u767B\\u9332\n#XBUT\nButton.Delete=\\u524A\\u9664\n#XBUT\nButton.Edit=\\u7DE8\\u96C6\n#XBUT\nButton.Save=\\u4FDD\\u5B58\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowPages=\\u30DA\\u30FC\\u30B8\\u3092\\u8868\\u793A\n#XBUT\nButton.HidePages=\\u30DA\\u30FC\\u30B8\\u3092\\u975E\\u8868\\u793A\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=\\u554F\\u984C\\: {0}\n#XBUT\nButton.SortPages=\\u30DA\\u30FC\\u30B8\\u30BD\\u30FC\\u30C8\\u9806\\u5E8F\\u306E\\u30C8\\u30B0\\u30EB\n#XBUT\nButton.ShowDetails=\\u8A73\\u7D30\\u8868\\u793A\n#XBUT\nButton.ErrorMsg=\\u30A8\\u30E9\\u30FC\\u30E1\\u30C3\\u30BB\\u30FC\\u30B8\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=\\u691C\\u7D22\n#XTOL\nTooltip.SearchForTiles=\\u9818\\u57DF\\u306E\\u691C\\u7D22\n\n#XFLD\nLabel.SpaceID=\\u9818\\u57DF ID\n#XFLD\nLabel.Title=\\u30BF\\u30A4\\u30C8\\u30EB\n#XFLD\nLabel.WorkbenchRequest=\\u30EF\\u30FC\\u30AF\\u30D9\\u30F3\\u30C1\\u4F9D\\u983C\n#XFLD\nLabel.Package=\\u30D1\\u30C3\\u30B1\\u30FC\\u30B8\n#XFLD\nLabel.TransportInformation=\\u79FB\\u9001\\u60C5\\u5831\n#XFLD\nLabel.Details=\\u8A73\\u7D30\\:\n#XFLD\nLabel.ResponseCode=\\u5FDC\\u7B54\\u30B3\\u30FC\\u30C9\\:\n#XFLD\nLabel.Description=\\u5185\\u5BB9\\u8AAC\\u660E\n#XFLD\nLabel.CreatedByFullname=\\u4F5C\\u6210\\u8005\n#XFLD\nLabel.CreatedOn=\\u4F5C\\u6210\\u6642\\u9593\n#XFLD\nLabel.ChangedByFullname=\\u5909\\u66F4\\u8005\n#XFLD\nLabel.ChangedOn=\\u5909\\u66F4\\u65E5\\u4ED8\n#XFLD\nLabel.PageTitle=\\u30DA\\u30FC\\u30B8\\u30BF\\u30A4\\u30C8\\u30EB\n#XFLD\nLabel.AssignedRole=\\u5272\\u308A\\u5F53\\u3066\\u3089\\u308C\\u305F\\u30ED\\u30FC\\u30EB\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=\\u30BF\\u30A4\\u30C8\\u30EB\n#XCOL\nColumn.SpaceDescription=\\u5185\\u5BB9\\u8AAC\\u660E\n#XCOL\nColumn.SpacePackage=\\u30D1\\u30C3\\u30B1\\u30FC\\u30B8\n#XCOL\nColumn.SpaceWorkbenchRequest=\\u30EF\\u30FC\\u30AF\\u30D9\\u30F3\\u30C1\\u4F9D\\u983C\n#XCOL\nColumn.SpaceCreatedBy=\\u767B\\u9332\\u8005\n#XCOL\nColumn.SpaceCreatedOn=\\u4F5C\\u6210\\u6642\\u9593\n#XCOL\nColumn.SpaceChangedBy=\\u5909\\u66F4\\u8005\n#XCOL\nColumn.SpaceChangedOn=\\u5909\\u66F4\\u65E5\\u4ED8\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=\\u30BF\\u30A4\\u30C8\\u30EB\n#XCOL\nColumn.PageDescription=\\u5185\\u5BB9\\u8AAC\\u660E\n#XCOL\nColumn.PagePackage=\\u30D1\\u30C3\\u30B1\\u30FC\\u30B8\n#XCOL\nColumn.PageWorkbenchRequest=\\u30EF\\u30FC\\u30AF\\u30D9\\u30F3\\u30C1\\u4F9D\\u983C\n#XCOL\nColumn.PageCreatedBy=\\u767B\\u9332\\u8005\n#XCOL\nColumn.PageCreatedOn=\\u4F5C\\u6210\\u6642\\u9593\n#XCOL\nColumn.PageChangedBy=\\u5909\\u66F4\\u8005\n#XCOL\nColumn.PageChangedOn=\\u5909\\u66F4\\u65E5\\u4ED8\n\n#XTOL\nPlaceholder.CopySpaceTitle="{0}" \\u306E\\u30B3\\u30D4\\u30FC\n#XTOL\nPlaceholder.CopySpaceID="{0}" \\u306E\\u30B3\\u30D4\\u30FC\n\n#XMSG\nMessage.NoInternetConnection=\\u30A4\\u30F3\\u30BF\\u30FC\\u30CD\\u30C3\\u30C8\\u63A5\\u7D9A\\u3092\\u30C1\\u30A7\\u30C3\\u30AF\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\n#XMSG\nMessage.SavedChanges=\\u5909\\u66F4\\u304C\\u4FDD\\u5B58\\u3055\\u308C\\u307E\\u3057\\u305F\\u3002\n#XMSG\nMessage.InvalidPageID=A-Z\\u30010-9\\u3001_ \\u304A\\u3088\\u3073 / \\u306E\\u6587\\u5B57\\u306E\\u307F\\u4F7F\\u7528\\u3057\\u3066\\u304F\\u3060\\u3002\\u30DA\\u30FC\\u30B8 ID \\u306E\\u5148\\u982D\\u306B\\u306F\\u6570\\u5B57\\u3092\\u4F7F\\u7528\\u3057\\u306A\\u3044\\u3067\\u304F\\u3060\\u3055\\u3044\\u3002\n#XMSG\nMessage.EmptySpaceID=\\u6709\\u52B9\\u306A\\u9818\\u57DF ID \\u3092\\u5165\\u529B\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\n#XMSG\nMessage.EmptyTitle=\\u6709\\u52B9\\u306A\\u30BF\\u30A4\\u30C8\\u30EB\\u3092\\u6307\\u5B9A\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\n#XMSG\nMessage.SuccessDeletePage=\\u9078\\u629E\\u3057\\u305F\\u30AA\\u30D6\\u30B8\\u30A7\\u30AF\\u30C8\\u304C\\u524A\\u9664\\u3055\\u308C\\u307E\\u3057\\u305F\n#XMSG\nMessage.ClipboardCopySuccess=\\u8A73\\u7D30\\u304C\\u6B63\\u5E38\\u306B\\u30B3\\u30D4\\u30FC\\u3055\\u308C\\u307E\\u3057\\u305F\\u3002\n#YMSE\nMessage.ClipboardCopyFail=\\u8A73\\u7D30\\u306E\\u30B3\\u30D4\\u30FC\\u4E2D\\u306B\\u30A8\\u30E9\\u30FC\\u304C\\u767A\\u751F\\u3057\\u307E\\u3057\\u305F\\u3002\n#XMSG\nMessage.SpaceCreated=\\u9818\\u57DF\\u304C\\u767B\\u9332\\u3055\\u308C\\u307E\\u3057\\u305F\\u3002\n\n#XMSG\nMessage.NavigationTargetError=\\u30CA\\u30D3\\u30B2\\u30FC\\u30B7\\u30E7\\u30F3\\u30BF\\u30FC\\u30B2\\u30C3\\u30C8\\u3092\\u89E3\\u6790\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\\u3002\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=\\u30BF\\u30A4\\u30EB "{0}" \\u306E\\u30CA\\u30D3\\u30B2\\u30FC\\u30B7\\u30E7\\u30F3\\u30BF\\u30FC\\u30B2\\u30C3\\u30C8\\u3092\\u89E3\\u6790\\u3067\\u304D\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\\u3002\\n\\n\\u3053\\u308C\\u306F\\u3001SAP Fiori \\u30E9\\u30A6\\u30F3\\u30C1\\u30D1\\u30C3\\u30C9\\u30B3\\u30F3\\u30C6\\u30F3\\u30C4\\u306E\\u8A2D\\u5B9A\\u304C\\u7121\\u52B9\\u306A\\u5834\\u5408\\u306B\\u6700\\u3082\\u767A\\u751F\\u3057\\u307E\\u3059\\u3002\\u30D3\\u30B8\\u30E5\\u30A2\\u30EB\\u5316\\u3067\\u30A2\\u30D7\\u30EA\\u30B1\\u30FC\\u30B7\\u30E7\\u30F3\\u3092\\u958B\\u3051\\u307E\\u305B\\u3093\\u3002\n#XMSG\nMessage.PageIsOutdated=\\u3053\\u306E\\u30DA\\u30FC\\u30B8\\u306E\\u65B0\\u3057\\u3044\\u30D0\\u30FC\\u30B8\\u30E7\\u30F3\\u304C\\u3059\\u3067\\u306B\\u4FDD\\u5B58\\u3055\\u308C\\u3066\\u3044\\u307E\\u3059\\u3002\n#XMSG\nMessage.SaveChanges=\\u5909\\u66F4\\u3092\\u4FDD\\u5B58\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\n#XMSG\nMessage.NoSpaces=\\u5229\\u7528\\u53EF\\u80FD\\u306A\\u9818\\u57DF\\u304C\\u3042\\u308A\\u307E\\u305B\\u3093\\u3002\n#XMSG\nMessage.NoSpacesFound=\\u9818\\u57DF\\u304C\\u898B\\u3064\\u304B\\u308A\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\\u3002\\u691C\\u7D22\\u3092\\u8ABF\\u6574\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=\\u65B0\\u898F\\u9818\\u57DF\n#XTIT\nDeleteDialog.Title=\\u524A\\u9664\n#XMSG\nDeleteDialog.Text=\\u9078\\u629E\\u3057\\u305F\\u9818\\u57DF\\u3092\\u524A\\u9664\\u3057\\u307E\\u3059\\u304B\\u3002\n#XBUT\nDeleteDialog.ConfirmButton=\\u524A\\u9664\n#XTIT\nDeleteDialog.LockedTitle=\\u9818\\u57DF\\u306F\\u30ED\\u30C3\\u30AF\\u6E08\n#XMSG\nDeleteDialog.LockedText=\\u9078\\u629E\\u3057\\u305F\\u9818\\u57DF\\u306F\\u3001\\u30E6\\u30FC\\u30B6 "{0}" \\u306B\\u3088\\u3063\\u3066\\u30ED\\u30C3\\u30AF\\u3055\\u308C\\u3066\\u3044\\u307E\\u3059\\u3002\n#XMSG\nDeleteDialog.TransportRequired=\\u9078\\u629E\\u3057\\u305F\\u9818\\u57DF\\u3092\\u524A\\u9664\\u3059\\u308B\\u305F\\u3081\\u3001\\u79FB\\u9001\\u30D1\\u30C3\\u30B1\\u30FC\\u30B8\\u3092\\u9078\\u629E\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\n\n#XMSG\nEditDialog.LockedText=\\u9078\\u629E\\u3057\\u305F\\u9818\\u57DF\\u306F\\u3001\\u30E6\\u30FC\\u30B6 "{0}" \\u306B\\u3088\\u3063\\u3066\\u30ED\\u30C3\\u30AF\\u3055\\u308C\\u3066\\u3044\\u307E\\u3059\\u3002\n#XMSG\nEditDialog.TransportRequired=\\u9078\\u629E\\u3057\\u305F\\u9818\\u57DF\\u3092\\u7DE8\\u96C6\\u3059\\u308B\\u305F\\u3081\\u3001\\u79FB\\u9001\\u30D1\\u30C3\\u30B1\\u30FC\\u30B8\\u3092\\u9078\\u629E\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\n#XTIT\nEditDialog.Title=\\u9818\\u57DF\\u306E\\u7DE8\\u96C6\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=\\u3053\\u306E\\u9818\\u57DF\\u306F\\u8A00\\u8A9E "{0}" \\u3067\\u767B\\u9332\\u3055\\u308C\\u307E\\u3057\\u305F\\u304C\\u3001\\u30ED\\u30B0\\u30AA\\u30F3\\u8A00\\u8A9E\\u306F "{1}".\\u306B\\u8A2D\\u5B9A\\u3055\\u308C\\u3066\\u3044\\u307E\\u3059\\u3002\\u7D9A\\u884C\\u3059\\u308B\\u306B\\u306F\\u3001\\u30ED\\u30B0\\u30AA\\u30F3\\u8A00\\u8A9E\\u3092 "{0}" \\u306B\\u5909\\u66F4\\u3057\\u3066\\u304F\\u3060\\u3055\\u3044\\u3002\n\n#XTIT\nErrorDialog.Title=\\u30A8\\u30E9\\u30FC\n\n#XTIT\nSpaceOverview.Title=\\u30DA\\u30FC\\u30B8\\u66F4\\u65B0\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=\\u30EC\\u30A4\\u30A2\\u30A6\\u30C8\n\n#XTIT\nCopyDialog.Title=\\u9818\\u57DF\\u306E\\u30B3\\u30D4\\u30FC\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message="{0}" \\u3092\\u30B3\\u30D4\\u30FC\\u3057\\u307E\\u3059\\u304B\\u3002\n#XFLD\nCopyDialog.NewID="{0}" \\u306E\\u30B3\\u30D4\\u30FC\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=\\u3053\\u306E\\u9818\\u57DF\\u306F\\u898B\\u3064\\u304B\\u308A\\u307E\\u305B\\u3093\\u3067\\u3057\\u305F\\u3002\n#XLNK\nErrorPage.Link=\\u9818\\u57DF\\u306E\\u8A2D\\u5B9A\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_kk.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=\\u0411\\u043E\\u0441 \\u043E\\u0440\\u044B\\u043D\\u0434\\u0430\\u0440 \\u0430\\u043B\\u0443\n\n#XBUT\nButton.Add=\\u049A\\u043E\\u0441\\u0443\n#XBUT\nButton.Cancel=\\u0411\\u043E\\u043B\\u0434\\u044B\\u0440\\u043C\\u0430\\u0443\n#XBUT\nButton.Copy=\\u041A\\u04E9\\u0448\\u0456\\u0440\\u0443\n#XBUT\nButton.Create=\\u0416\\u0430\\u0441\\u0430\\u0443\n#XBUT\nButton.Delete=\\u0416\\u043E\\u044E\n#XBUT\nButton.Edit=\\u04E8\\u04A3\\u0434\\u0435\\u0443\n#XBUT\nButton.Save=\\u0421\\u0430\\u049B\\u0442\\u0430\\u0443\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowPages=\\u0411\\u0435\\u0442\\u0442\\u0435\\u0440\\u0434\\u0456 \\u043A\\u04E9\\u0440\\u0441\\u0435\\u0442\\u0443\n#XBUT\nButton.HidePages=\\u0411\\u0435\\u0442\\u0442\\u0435\\u0440\\u0434\\u0456 \\u0436\\u0430\\u0441\\u044B\\u0440\\u0443\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=\\u041C\\u04D9\\u0441\\u0435\\u043B\\u0435\\u043B\\u0435\\u0440\\: {0}\n#XBUT\nButton.SortPages=\\u0411\\u0435\\u0442\\u0442\\u0435\\u0440\\u0434\\u0456\\u04A3 \\u0441\\u04B1\\u0440\\u044B\\u043F\\u0442\\u0430\\u0443 \\u0440\\u0435\\u0442\\u0456\\u043D \\u0430\\u0443\\u044B\\u0441\\u0442\\u044B\\u0440\\u044B\\u043F-\\u049B\\u043E\\u0441\\u0443\n#XBUT\nButton.ShowDetails=\\u0422\\u043E\\u043B\\u044B\\u049B \\u043C\\u04D9\\u043B\\u0456\\u043C\\u0435\\u0442\\u0442\\u0456 \\u043A\\u04E9\\u0440\\u0441\\u0435\\u0442\\u0443\n#XBUT\nButton.ErrorMsg=\\u049A\\u0430\\u0442\\u0435 \\u0442\\u0443\\u0440\\u0430\\u043B\\u044B \\u0445\\u0430\\u0431\\u0430\\u0440\\u043B\\u0430\\u0440\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=\\u0406\\u0437\\u0434\\u0435\\u0443\n#XTOL\nTooltip.SearchForTiles=\\u0411\\u043E\\u0441 \\u043E\\u0440\\u044B\\u043D\\u0434\\u0430\\u0440\\u0434\\u044B \\u0456\\u0437\\u0434\\u0435\\u0443\n\n#XFLD\nLabel.SpaceID=\\u0411\\u043E\\u0441 \\u043E\\u0440\\u044B\\u043D \\u0438\\u0434\\u0435\\u043D\\u0442\\u0438\\u0444\\u0438\\u043A\\u0430\\u0442\\u043E\\u0440\\u044B\n#XFLD\nLabel.Title=\\u0410\\u0442\\u0430\\u0443\n#XFLD\nLabel.WorkbenchRequest=\\u0410\\u0441\\u043F\\u0430\\u043F\\u0442\\u044B\\u049B \\u049B\\u04B1\\u0440\\u0430\\u043B\\u0434\\u0430\\u0440 \\u0441\\u04B1\\u0440\\u0430\\u0443\\u044B\n#XFLD\nLabel.Package=\\u0411\\u0443\\u043C\\u0430\n#XFLD\nLabel.TransportInformation=\\u0422\\u0430\\u0441\\u044B\\u043C\\u0430\\u043B\\u0434\\u0430\\u0443 \\u0442\\u0443\\u0440\\u0430\\u043B\\u044B \\u0430\\u049B\\u043F\\u0430\\u0440\\u0430\\u0442\n#XFLD\nLabel.Details=\\u0422\\u043E\\u043B\\u044B\\u049B \\u043C\\u04D9\\u043B\\u0456\\u043C\\u0435\\u0442\\:\n#XFLD\nLabel.ResponseCode=\\u0416\\u0430\\u0443\\u0430\\u043F \\u043A\\u043E\\u0434\\u044B\\:\n#XFLD\nLabel.Description=\\u0421\\u0438\\u043F\\u0430\\u0442\\u0442\\u0430\\u043C\\u0430\n#XFLD\nLabel.CreatedByFullname=\\u0416\\u0430\\u0441\\u0430\\u0493\\u0430\\u043D\n#XFLD\nLabel.CreatedOn=\\u0416\\u0430\\u0441\\u0430\\u043B\\u0493\\u0430\\u043D \\u043A\\u04AF\\u043D\\u0456\n#XFLD\nLabel.ChangedByFullname=\\u04E8\\u0437\\u0433\\u0435\\u0440\\u0442\\u043A\\u0435\\u043D\n#XFLD\nLabel.ChangedOn=\\u04E8\\u0437\\u0433\\u0435\\u0440\\u0442\\u0456\\u043B\\u0433\\u0435\\u043D \\u043A\\u04AF\\u043D\\u0456\n#XFLD\nLabel.PageTitle=\\u0411\\u0435\\u0442 \\u0442\\u0430\\u049B\\u044B\\u0440\\u044B\\u0431\\u044B\n#XFLD\nLabel.AssignedRole=\\u0422\\u0430\\u0493\\u0430\\u0439\\u044B\\u043D\\u0434\\u0430\\u043B\\u0493\\u0430\\u043D \\u0440\\u04E9\\u043B\n\n#XCOL\nColumn.SpaceID=\\u0418\\u0434.\n#XCOL\nColumn.SpaceTitle=\\u0410\\u0442\\u0430\\u0443\n#XCOL\nColumn.SpaceDescription=\\u0421\\u0438\\u043F\\u0430\\u0442\\u0442\\u0430\\u043C\\u0430\n#XCOL\nColumn.SpacePackage=\\u0411\\u0443\\u043C\\u0430\n#XCOL\nColumn.SpaceWorkbenchRequest=\\u0410\\u0441\\u043F\\u0430\\u043F\\u0442\\u044B\\u049B \\u049B\\u04B1\\u0440\\u0430\\u043B\\u0434\\u0430\\u0440 \\u0441\\u04B1\\u0440\\u0430\\u0443\\u044B\n#XCOL\nColumn.SpaceCreatedBy=\\u0416\\u0430\\u0441\\u0430\\u0493\\u0430\\u043D\n#XCOL\nColumn.SpaceCreatedOn=\\u0416\\u0430\\u0441\\u0430\\u043B\\u0493\\u0430\\u043D \\u043A\\u04AF\\u043D\\u0456\n#XCOL\nColumn.SpaceChangedBy=\\u04E8\\u0437\\u0433\\u0435\\u0440\\u0442\\u043A\\u0435\\u043D\n#XCOL\nColumn.SpaceChangedOn=\\u04E8\\u0437\\u0433\\u0435\\u0440\\u0442\\u0456\\u043B\\u0433\\u0435\\u043D \\u043A\\u04AF\\u043D\\u0456\n\n#XCOL\nColumn.PageID=\\u0418\\u0434.\n#XCOL\nColumn.PageTitle=\\u0410\\u0442\\u0430\\u0443\n#XCOL\nColumn.PageDescription=\\u0421\\u0438\\u043F\\u0430\\u0442\\u0442\\u0430\\u043C\\u0430\n#XCOL\nColumn.PagePackage=\\u0411\\u0443\\u043C\\u0430\n#XCOL\nColumn.PageWorkbenchRequest=\\u0410\\u0441\\u043F\\u0430\\u043F\\u0442\\u044B\\u049B \\u049B\\u04B1\\u0440\\u0430\\u043B\\u0434\\u0430\\u0440 \\u0441\\u04B1\\u0440\\u0430\\u0443\\u044B\n#XCOL\nColumn.PageCreatedBy=\\u0416\\u0430\\u0441\\u0430\\u0493\\u0430\\u043D\n#XCOL\nColumn.PageCreatedOn=\\u0416\\u0430\\u0441\\u0430\\u043B\\u0493\\u0430\\u043D \\u043A\\u04AF\\u043D\\u0456\n#XCOL\nColumn.PageChangedBy=\\u04E8\\u0437\\u0433\\u0435\\u0440\\u0442\\u043A\\u0435\\u043D\n#XCOL\nColumn.PageChangedOn=\\u04E8\\u0437\\u0433\\u0435\\u0440\\u0442\\u0456\\u043B\\u0433\\u0435\\u043D \\u043A\\u04AF\\u043D\\u0456\n\n#XTOL\nPlaceholder.CopySpaceTitle="{0}" \\u043A\\u04E9\\u0448\\u0456\\u0440\\u043C\\u0435\\u0441\\u0456\n#XTOL\nPlaceholder.CopySpaceID="{0}" \\u043A\\u04E9\\u0448\\u0456\\u0440\\u043C\\u0435\\u0441\\u0456\n\n#XMSG\nMessage.NoInternetConnection=\\u0418\\u043D\\u0442\\u0435\\u0440\\u043D\\u0435\\u0442 \\u0431\\u0430\\u0439\\u043B\\u0430\\u043D\\u044B\\u0441\\u044B\\u043D \\u0442\\u0435\\u043A\\u0441\\u0435\\u0440\\u0456\\u04A3\\u0456\\u0437.\n#XMSG\nMessage.SavedChanges=\\u04E8\\u0437\\u0433\\u0435\\u0440\\u0456\\u0441\\u0442\\u0435\\u0440 \\u0441\\u0430\\u049B\\u0442\\u0430\\u043B\\u0434\\u044B.\n#XMSG\nMessage.InvalidPageID=\\u0422\\u0435\\u043A \\u043A\\u0435\\u043B\\u0435\\u0441\\u0456 \\u0442\\u0430\\u04A3\\u0431\\u0430\\u043B\\u0430\\u0440\\u0434\\u044B \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u044B\\u04A3\\u044B\\u0437\\: A-Z, 0-9, _ \\u0436\\u04D9\\u043D\\u0435 /. \\u0411\\u0435\\u0442 \\u0438\\u0434. \\u0441\\u0430\\u043D\\u043D\\u0430\\u043D \\u0431\\u0430\\u0441\\u0442\\u0430\\u043B\\u043C\\u0430\\u0443\\u044B \\u0442\\u0438\\u0456\\u0441.\n#XMSG\nMessage.EmptySpaceID=\\u0416\\u0430\\u0440\\u0430\\u043C\\u0434\\u044B \\u0431\\u043E\\u0441 \\u043E\\u0440\\u044B\\u043D \\u0438\\u0434\\u0435\\u043D\\u0442\\u0438\\u0444\\u0438\\u043A\\u0430\\u0442\\u043E\\u0440\\u044B\\u043D \\u043A\\u04E9\\u0440\\u0441\\u0435\\u0442\\u0456\\u04A3\\u0456\\u0437.\n#XMSG\nMessage.EmptyTitle=\\u0416\\u0430\\u0440\\u0430\\u043C\\u0434\\u044B \\u0442\\u0430\\u049B\\u044B\\u0440\\u044B\\u043F\\u0442\\u044B \\u043A\\u04E9\\u0440\\u0441\\u0435\\u0442\\u0456\\u04A3\\u0456\\u0437.\n#XMSG\nMessage.SuccessDeletePage=\\u0422\\u0430\\u04A3\\u0434\\u0430\\u043B\\u0493\\u0430\\u043D \\u043D\\u044B\\u0441\\u0430\\u043D \\u0436\\u043E\\u0439\\u044B\\u043B\\u0434\\u044B.\n#XMSG\nMessage.ClipboardCopySuccess=\\u0422\\u043E\\u043B\\u044B\\u049B \\u043C\\u04D9\\u043B\\u0456\\u043C\\u0435\\u0442 \\u0441\\u04D9\\u0442\\u0442\\u0456 \\u043A\\u04E9\\u0448\\u0456\\u0440\\u0456\\u043B\\u0434\\u0456.\n#YMSE\nMessage.ClipboardCopyFail=\\u041C\\u04D9\\u043B\\u0456\\u043C\\u0435\\u0442\\u0442\\u0435\\u0440\\u0434\\u0456 \\u043A\\u04E9\\u0448\\u0456\\u0440\\u0443 \\u043A\\u0435\\u0437\\u0456\\u043D\\u0434\\u0435 \\u049B\\u0430\\u0442\\u0435 \\u043E\\u0440\\u044B\\u043D \\u0430\\u043B\\u0434\\u044B.\n#XMSG\nMessage.SpaceCreated=\\u0411\\u043E\\u0441 \\u043E\\u0440\\u044B\\u043D \\u0436\\u0430\\u0441\\u0430\\u043B\\u0434\\u044B.\n\n#XMSG\nMessage.NavigationTargetError=\\u041D\\u0430\\u0432\\u0438\\u0433\\u0430\\u0446\\u0438\\u044F \\u043C\\u0430\\u049B\\u0441\\u0430\\u0442\\u044B\\u043D \\u0448\\u0435\\u0448\\u0443 \\u043C\\u04AF\\u043C\\u043A\\u0456\\u043D \\u0431\\u043E\\u043B\\u043C\\u0430\\u0434\\u044B.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=\\u041A\\u0435\\u043B\\u0435\\u0441\\u0456 \\u043F\\u043B\\u0438\\u0442\\u043A\\u0430\\u043D\\u044B\\u04A3 \\u043D\\u0430\\u0432\\u0438\\u0433\\u0430\\u0446\\u0438\\u044F \\u043C\\u0430\\u049B\\u0441\\u0430\\u0442\\u044B\\u043D \\u0448\\u0435\\u0448\\u0443 \\u043C\\u04AF\\u043C\\u043A\\u0456\\u043D \\u0431\\u043E\\u043B\\u043C\\u0430\\u0434\\u044B\\: "{0}".\\n\\n\\u0411\\u04B1\\u043B SAP Fiori \\u0456\\u0441\\u043A\\u0435 \\u049B\\u043E\\u0441\\u0443 \\u043F\\u0430\\u043D\\u0435\\u043B\\u0456 \\u043C\\u0430\\u0437\\u043C\\u04B1\\u043D\\u044B\\u043D\\u044B\\u04A3 \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u044F\\u0441\\u044B \\u0436\\u0430\\u0440\\u0430\\u043C\\u0441\\u044B\\u0437 \\u0431\\u043E\\u043B\\u0443\\u044B\\u043D\\u0430\\u043D \\u043E\\u0440\\u044B\\u043D \\u0430\\u043B\\u0443\\u044B \\u043C\\u04AF\\u043C\\u043A\\u0456\\u043D. \\u0412\\u0438\\u0437\\u0443\\u0430\\u043B\\u0438\\u0437\\u0430\\u0446\\u0438\\u044F \\u0430\\u0440\\u049B\\u044B\\u043B\\u044B \\u049B\\u043E\\u043B\\u0434\\u0430\\u043D\\u0431\\u0430 \\u0430\\u0448\\u044B\\u043B\\u043C\\u0430\\u0439\\u0434\\u044B.\n#XMSG\nMessage.PageIsOutdated=\\u0411\\u04B1\\u043B \\u0431\\u0435\\u0442\\u0442\\u0456\\u04A3 \\u0436\\u0430\\u04A3\\u0430 \\u043D\\u04B1\\u0441\\u049B\\u0430\\u0441\\u044B \\u04D9\\u043B\\u0434\\u0435\\u049B\\u0430\\u0448\\u0430\\u043D \\u0441\\u0430\\u049B\\u0442\\u0430\\u043B\\u0434\\u044B.\n#XMSG\nMessage.SaveChanges=\\u04E8\\u0437\\u0433\\u0435\\u0440\\u0456\\u0441\\u0442\\u0435\\u0440\\u0434\\u0456 \\u0441\\u0430\\u049B\\u0442\\u0430\\u04A3\\u044B\\u0437.\n#XMSG\nMessage.NoSpaces=\\u0411\\u043E\\u0441 \\u043E\\u0440\\u044B\\u043D\\u0434\\u0430\\u0440 \\u049B\\u043E\\u043B\\u0436\\u0435\\u0442\\u0456\\u043C\\u0434\\u0456 \\u0435\\u043C\\u0435\\u0441.\n#XMSG\nMessage.NoSpacesFound=\\u0411\\u043E\\u0441 \\u043E\\u0440\\u044B\\u043D\\u0434\\u0430\\u0440 \\u0442\\u0430\\u0431\\u044B\\u043B\\u043C\\u0430\\u0434\\u044B. \\u0406\\u0437\\u0434\\u0435\\u0443 \\u0448\\u0430\\u0440\\u0442\\u044B\\u043D \\u0440\\u0435\\u0442\\u0442\\u0435\\u043F \\u043A\\u04E9\\u0440\\u0456\\u04A3\\u0456\\u0437.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=\\u0416\\u0430\\u04A3\\u0430 \\u0431\\u043E\\u0441 \\u043E\\u0440\\u044B\\u043D\n#XTIT\nDeleteDialog.Title=\\u0416\\u043E\\u044E\n#XMSG\nDeleteDialog.Text=\\u0422\\u0430\\u04A3\\u0434\\u0430\\u043B\\u0493\\u0430\\u043D \\u0431\\u043E\\u0441 \\u043E\\u0440\\u044B\\u043D\\u0434\\u044B \\u0440\\u0430\\u0441\\u044B\\u043C\\u0435\\u043D \\u0434\\u0435 \\u0436\\u043E\\u044E \\u043A\\u0435\\u0440\\u0435\\u043A \\u043F\\u0435?\n#XBUT\nDeleteDialog.ConfirmButton=\\u0416\\u043E\\u044E\n#XTIT\nDeleteDialog.LockedTitle=\\u0411\\u043E\\u0441 \\u043E\\u0440\\u044B\\u043D \\u049B\\u04B1\\u043B\\u044B\\u043F\\u0442\\u0430\\u043B\\u0493\\u0430\\u043D\n#XMSG\nDeleteDialog.LockedText=\\u0422\\u0430\\u04A3\\u0434\\u0430\\u043B\\u0493\\u0430\\u043D \\u0431\\u043E\\u0441 \\u043E\\u0440\\u044B\\u043D\\u0434\\u044B "{0}\\u201D \\u0434\\u0435\\u0433\\u0435\\u043D \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B \\u049B\\u04B1\\u043B\\u044B\\u043F\\u0442\\u0430\\u0493\\u0430\\u043D.\n#XMSG\nDeleteDialog.TransportRequired=\\u0422\\u0430\\u04A3\\u0434\\u0430\\u043B\\u0493\\u0430\\u043D \\u0431\\u043E\\u0441 \\u043E\\u0440\\u044B\\u043D\\u0434\\u044B \\u0436\\u043E\\u044E \\u04AF\\u0448\\u0456\\u043D \\u0442\\u0430\\u0441\\u044B\\u043C\\u0430\\u043B\\u0434\\u0430\\u0443 \\u0431\\u0443\\u043C\\u0430\\u0441\\u044B\\u043D \\u0442\\u0430\\u04A3\\u0434\\u0430\\u04A3\\u044B\\u0437.\n\n#XMSG\nEditDialog.LockedText=\\u0422\\u0430\\u04A3\\u0434\\u0430\\u043B\\u0493\\u0430\\u043D \\u0431\\u043E\\u0441 \\u043E\\u0440\\u044B\\u043D\\u0434\\u044B "{0}\\u201D \\u0434\\u0435\\u0433\\u0435\\u043D \\u043F\\u0430\\u0439\\u0434\\u0430\\u043B\\u0430\\u043D\\u0443\\u0448\\u044B \\u049B\\u04B1\\u043B\\u044B\\u043F\\u0442\\u0430\\u0493\\u0430\\u043D.\n#XMSG\nEditDialog.TransportRequired=\\u0422\\u0430\\u04A3\\u0434\\u0430\\u043B\\u0493\\u0430\\u043D \\u0431\\u043E\\u0441 \\u043E\\u0440\\u044B\\u043D\\u0434\\u044B \\u04E9\\u04A3\\u0434\\u0435\\u0443 \\u04AF\\u0448\\u0456\\u043D \\u0442\\u0430\\u0441\\u044B\\u043C\\u0430\\u043B\\u0434\\u0430\\u0443 \\u0431\\u0443\\u043C\\u0430\\u0441\\u044B\\u043D \\u0442\\u0430\\u04A3\\u0434\\u0430\\u04A3\\u044B\\u0437.\n#XTIT\nEditDialog.Title=\\u0411\\u043E\\u0441 \\u043E\\u0440\\u044B\\u043D\\u0434\\u044B \\u04E9\\u04A3\\u0434\\u0435\\u0443\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=\\u0411\\u04B1\\u043B \\u0431\\u043E\\u0441 \\u043E\\u0440\\u044B\\u043D "{0}\\u201D \\u0442\\u0456\\u043B\\u0456\\u043D\\u0434\\u0435 \\u0436\\u0430\\u0441\\u0430\\u043B\\u0434\\u044B, \\u0431\\u0456\\u0440\\u0430\\u049B \\u0436\\u04AF\\u0439\\u0435\\u0433\\u0435 \\u043A\\u0456\\u0440\\u0443 \\u0442\\u0456\\u043B\\u0456\\u04A3\\u0456\\u0437 "{1}\\u201D \\u043F\\u0430\\u0440\\u0430\\u043C\\u0435\\u0442\\u0440\\u0456\\u043D\\u0435 \\u043E\\u0440\\u043D\\u0430\\u0442\\u044B\\u043B\\u0493\\u0430\\u043D. \\u0416\\u0430\\u043B\\u0493\\u0430\\u0441\\u0442\\u044B\\u0440\\u0443 \\u04AF\\u0448\\u0456\\u043D \\u0436\\u04AF\\u0439\\u0435\\u0433\\u0435 \\u043A\\u0456\\u0440\\u0443 \\u0442\\u0456\\u043B\\u0456\\u043D "{0}\\u201D \\u0442\\u0456\\u043B\\u0456\\u043D\\u0435 \\u04E9\\u0437\\u0433\\u0435\\u0440\\u0442\\u0456\\u04A3\\u0456\\u0437.\n\n#XTIT\nErrorDialog.Title=\\u049A\\u0430\\u0442\\u0435\n\n#XTIT\nSpaceOverview.Title=\\u0411\\u0435\\u0442\\u0442\\u0435\\u0440\\u0434\\u0456 \\u0436\\u04AF\\u0440\\u0433\\u0456\\u0437\\u0443\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=\\u041F\\u0456\\u0448\\u0456\\u043C\n\n#XTIT\nCopyDialog.Title=\\u0411\\u043E\\u0441 \\u043E\\u0440\\u044B\\u043D\\u0434\\u044B \\u043A\\u04E9\\u0448\\u0456\\u0440\\u0456\\u043F \\u0430\\u043B\\u0443\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message="{0}" \\u043A\\u04E9\\u0448\\u0456\\u0440\\u0443 \\u049B\\u0430\\u0436\\u0435\\u0442 \\u043F\\u0435?\n#XFLD\nCopyDialog.NewID="{0}" \\u043A\\u04E9\\u0448\\u0456\\u0440\\u043C\\u0435\\u0441\\u0456\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=\\u04E8\\u043A\\u0456\\u043D\\u0456\\u0448\\u043A\\u0435 \\u043E\\u0440\\u0430\\u0439, \\u0431\\u04B1\\u043B \\u0431\\u043E\\u0441 \\u043E\\u0440\\u044B\\u043D \\u0442\\u0430\\u0431\\u044B\\u043B\\u043C\\u0430\\u0434\\u044B.\n#XLNK\nErrorPage.Link=\\u0411\\u043E\\u0441 \\u043E\\u0440\\u044B\\u043D\\u0434\\u0430\\u0440 \\u0430\\u043B\\u0443\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_ko.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=\\uACF5\\uAC04 \\uC720\\uC9C0\\uBCF4\\uC218\n\n#XBUT\nButton.Add=\\uCD94\\uAC00\n#XBUT\nButton.Cancel=\\uCDE8\\uC18C\n#XBUT\nButton.Copy=\\uBCF5\\uC0AC\n#XBUT\nButton.Create=\\uC0DD\\uC131\n#XBUT\nButton.Delete=\\uC0AD\\uC81C\n#XBUT\nButton.Edit=\\uD3B8\\uC9D1\n#XBUT\nButton.Save=\\uC800\\uC7A5\n#XBUT\nButton.Ok=\\uD655\\uC778\n#XBUT\nButton.ShowPages=\\uD398\\uC774\\uC9C0 \\uD45C\\uC2DC\n#XBUT\nButton.HidePages=\\uD398\\uC774\\uC9C0 \\uC228\\uAE30\\uAE30\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=\\uC774\\uC288\\: {0}\n#XBUT\nButton.SortPages=\\uD398\\uC774\\uC9C0 \\uC815\\uB82C \\uC21C\\uC11C \\uC804\\uD658\n#XBUT\nButton.ShowDetails=\\uC138\\uBD80\\uC0AC\\uD56D \\uD45C\\uC2DC\n#XBUT\nButton.ErrorMsg=\\uC624\\uB958 \\uBA54\\uC2DC\\uC9C0\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=\\uAC80\\uC0C9\n#XTOL\nTooltip.SearchForTiles=\\uACF5\\uAC04 \\uAC80\\uC0C9\n\n#XFLD\nLabel.SpaceID=\\uACF5\\uAC04 ID\n#XFLD\nLabel.Title=\\uC81C\\uBAA9\n#XFLD\nLabel.WorkbenchRequest=\\uC6CC\\uD06C\\uBCA4\\uCE58 \\uC694\\uCCAD\n#XFLD\nLabel.Package=\\uD328\\uD0A4\\uC9C0\n#XFLD\nLabel.TransportInformation=\\uC804\\uC1A1 \\uC815\\uBCF4\n#XFLD\nLabel.Details=\\uC138\\uBD80\\uC0AC\\uD56D\\:\n#XFLD\nLabel.ResponseCode=\\uC751\\uB2F5 \\uCF54\\uB4DC\\:\n#XFLD\nLabel.Description=\\uB0B4\\uC5ED\n#XFLD\nLabel.CreatedByFullname=\\uC0DD\\uC131\\uC790\n#XFLD\nLabel.CreatedOn=\\uC0DD\\uC131\\uC77C\n#XFLD\nLabel.ChangedByFullname=\\uBCC0\\uACBD\\uC790\n#XFLD\nLabel.ChangedOn=\\uBCC0\\uACBD\\uC77C\n#XFLD\nLabel.PageTitle=\\uD398\\uC774\\uC9C0 \\uC81C\\uBAA9\n#XFLD\nLabel.AssignedRole=\\uC9C0\\uC815\\uB41C \\uC5ED\\uD560\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=\\uC81C\\uBAA9\n#XCOL\nColumn.SpaceDescription=\\uB0B4\\uC5ED\n#XCOL\nColumn.SpacePackage=\\uD328\\uD0A4\\uC9C0\n#XCOL\nColumn.SpaceWorkbenchRequest=\\uC6CC\\uD06C\\uBCA4\\uCE58 \\uC694\\uCCAD\n#XCOL\nColumn.SpaceCreatedBy=\\uC0DD\\uC131\\uC790\n#XCOL\nColumn.SpaceCreatedOn=\\uC0DD\\uC131\\uC77C\n#XCOL\nColumn.SpaceChangedBy=\\uBCC0\\uACBD\\uC790\n#XCOL\nColumn.SpaceChangedOn=\\uBCC0\\uACBD\\uC77C\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=\\uC81C\\uBAA9\n#XCOL\nColumn.PageDescription=\\uB0B4\\uC5ED\n#XCOL\nColumn.PagePackage=\\uD328\\uD0A4\\uC9C0\n#XCOL\nColumn.PageWorkbenchRequest=\\uC6CC\\uD06C\\uBCA4\\uCE58 \\uC694\\uCCAD\n#XCOL\nColumn.PageCreatedBy=\\uC0DD\\uC131\\uC790\n#XCOL\nColumn.PageCreatedOn=\\uC0DD\\uC131\\uC77C\n#XCOL\nColumn.PageChangedBy=\\uBCC0\\uACBD\\uC790\n#XCOL\nColumn.PageChangedOn=\\uBCC0\\uACBD\\uC77C\n\n#XTOL\nPlaceholder.CopySpaceTitle="{0}" \\uBCF5\\uC0AC\n#XTOL\nPlaceholder.CopySpaceID="{0}" \\uBCF5\\uC0AC\n\n#XMSG\nMessage.NoInternetConnection=\\uC778\\uD130\\uB137 \\uC5F0\\uACB0\\uC744 \\uD655\\uC778\\uD558\\uC2ED\\uC2DC\\uC624.\n#XMSG\nMessage.SavedChanges=\\uBCC0\\uACBD \\uB0B4\\uC6A9\\uC774 \\uC800\\uC7A5\\uB418\\uC5C8\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nMessage.InvalidPageID=A-Z, 0-9, _, / \\uBB38\\uC790\\uB9CC \\uC0AC\\uC6A9\\uD558\\uC2ED\\uC2DC\\uC624. \\uD398\\uC774\\uC9C0 ID\\uB294 \\uC22B\\uC790\\uB85C \\uC2DC\\uC791\\uD560 \\uC218 \\uC5C6\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nMessage.EmptySpaceID=\\uC720\\uD6A8\\uD55C \\uACF5\\uAC04 ID\\uB97C \\uC9C0\\uC815\\uD558\\uC2ED\\uC2DC\\uC624.\n#XMSG\nMessage.EmptyTitle=\\uC720\\uD6A8\\uD55C \\uC81C\\uBAA9\\uC744 \\uC9C0\\uC815\\uD558\\uC2ED\\uC2DC\\uC624.\n#XMSG\nMessage.SuccessDeletePage=\\uC120\\uD0DD\\uD55C \\uC624\\uBE0C\\uC81D\\uD2B8\\uAC00 \\uC0AD\\uC81C\\uB418\\uC5C8\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nMessage.ClipboardCopySuccess=\\uC138\\uBD80\\uC0AC\\uD56D\\uC774 \\uBCF5\\uC0AC\\uB418\\uC5C8\\uC2B5\\uB2C8\\uB2E4.\n#YMSE\nMessage.ClipboardCopyFail=\\uC138\\uBD80\\uC0AC\\uD56D \\uBCF5\\uC0AC \\uC911 \\uC624\\uB958\\uAC00 \\uBC1C\\uC0DD\\uD588\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nMessage.SpaceCreated=\\uACF5\\uAC04\\uC774 \\uC0DD\\uC131\\uB418\\uC5C8\\uC2B5\\uB2C8\\uB2E4.\n\n#XMSG\nMessage.NavigationTargetError=\\uD0D0\\uC0C9 \\uB300\\uC0C1\\uC744 \\uACB0\\uC815\\uD560 \\uC218 \\uC5C6\\uC2B5\\uB2C8\\uB2E4.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=\\uD0C0\\uC77C "{0}"\\uC758 \\uD0D0\\uC0C9 \\uB300\\uC0C1\\uC744 \\uACB0\\uC815\\uD558\\uC9C0 \\uBABB\\uD588\\uC2B5\\uB2C8\\uB2E4.\\n\\n\\uC774\\uB294 SAP Fiori LaunchPad \\uCEE8\\uD150\\uD2B8\\uC758 \\uC798\\uBABB\\uB41C \\uAD6C\\uC131\\uC774 \\uC6D0\\uC778\\uC77C \\uC218 \\uC788\\uC2B5\\uB2C8\\uB2E4. \\uC2DC\\uAC01\\uD654\\uC5D0\\uC11C \\uC5B4\\uD50C\\uB9AC\\uCF00\\uC774\\uC158\\uC744 \\uC5F4 \\uC218 \\uC5C6\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nMessage.PageIsOutdated=\\uC774 \\uD398\\uC774\\uC9C0\\uC758 \\uCD5C\\uC2E0 \\uBC84\\uC804\\uC774 \\uC774\\uBBF8 \\uC800\\uC7A5\\uB418\\uC5C8\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nMessage.SaveChanges=\\uBCC0\\uACBD\\uC0AC\\uD56D\\uC744 \\uC800\\uC7A5\\uD558\\uC2ED\\uC2DC\\uC624.\n#XMSG\nMessage.NoSpaces=\\uC0AC\\uC6A9 \\uAC00\\uB2A5\\uD55C \\uACF5\\uAC04\\uC774 \\uC5C6\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nMessage.NoSpacesFound=\\uACF5\\uAC04\\uC774 \\uC5C6\\uC2B5\\uB2C8\\uB2E4. \\uAC80\\uC0C9\\uC744 \\uC870\\uC815\\uD558\\uC2ED\\uC2DC\\uC624.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=\\uC2E0\\uADDC \\uACF5\\uAC04\n#XTIT\nDeleteDialog.Title=\\uC0AD\\uC81C\n#XMSG\nDeleteDialog.Text=\\uC120\\uD0DD\\uD55C \\uACF5\\uAC04\\uC744 \\uC0AD\\uC81C\\uD558\\uC2DC\\uACA0\\uC2B5\\uB2C8\\uAE4C?\n#XBUT\nDeleteDialog.ConfirmButton=\\uC0AD\\uC81C\n#XTIT\nDeleteDialog.LockedTitle=\\uACF5\\uAC04 \\uC7A0\\uAE40\n#XMSG\nDeleteDialog.LockedText=\\uC120\\uD0DD\\uD55C \\uACF5\\uAC04\\uC740 "{0}" \\uC0AC\\uC6A9\\uC790\\uC5D0 \\uC758\\uD574 \\uC7A0\\uACA8 \\uC788\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nDeleteDialog.TransportRequired=\\uC120\\uD0DD\\uD55C \\uACF5\\uAC04\\uC744 \\uC0AD\\uC81C\\uD558\\uB824\\uBA74 \\uC804\\uC1A1 \\uD328\\uD0A4\\uC9C0\\uB97C \\uC120\\uD0DD\\uD558\\uC2ED\\uC2DC\\uC624.\n\n#XMSG\nEditDialog.LockedText=\\uC120\\uD0DD\\uD55C \\uACF5\\uAC04\\uC740 "{0}" \\uC0AC\\uC6A9\\uC790\\uC5D0 \\uC758\\uD574 \\uC7A0\\uACA8 \\uC788\\uC2B5\\uB2C8\\uB2E4.\n#XMSG\nEditDialog.TransportRequired=\\uC120\\uD0DD\\uD55C \\uACF5\\uAC04\\uC744 \\uD3B8\\uC9D1\\uD558\\uB824\\uBA74 \\uC804\\uC1A1 \\uD328\\uD0A4\\uC9C0\\uB97C \\uC120\\uD0DD\\uD558\\uC2ED\\uC2DC\\uC624.\n#XTIT\nEditDialog.Title=\\uACF5\\uAC04 \\uD3B8\\uC9D1\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=\\uC774 \\uACF5\\uAC04\\uC740 "{0}" \\uC5B8\\uC5B4\\uB85C \\uC0DD\\uC131\\uB418\\uC5C8\\uC9C0\\uB9CC \\uB85C\\uADF8\\uC628 \\uC5B8\\uC5B4\\uAC00 "{1}"(\\uC73C)\\uB85C \\uC124\\uC815\\uB418\\uC5B4 \\uC788\\uC2B5\\uB2C8\\uB2E4. \\uACC4\\uC18D\\uD558\\uB824\\uBA74 \\uB85C\\uADF8\\uC628 \\uC5B8\\uC5B4\\uB97C "{0}"(\\uC73C)\\uB85C \\uBCC0\\uACBD\\uD558\\uC2ED\\uC2DC\\uC624.\n\n#XTIT\nErrorDialog.Title=\\uC624\\uB958\n\n#XTIT\nSpaceOverview.Title=\\uD398\\uC774\\uC9C0 \\uC720\\uC9C0\\uBCF4\\uC218\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=\\uB808\\uC774\\uC544\\uC6C3\n\n#XTIT\nCopyDialog.Title=\\uACF5\\uAC04 \\uBCF5\\uC0AC\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message="{0}"\\uC744(\\uB97C) \\uBCF5\\uC0AC\\uD558\\uC2DC\\uACA0\\uC2B5\\uB2C8\\uAE4C?\n#XFLD\nCopyDialog.NewID="{0}" \\uBCF5\\uC0AC\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=\\uC8C4\\uC1A1\\uD569\\uB2C8\\uB2E4. \\uC774 \\uACF5\\uAC04\\uC744 \\uCC3E\\uC744 \\uC218 \\uC5C6\\uC2B5\\uB2C8\\uB2E4.\n#XLNK\nErrorPage.Link=\\uACF5\\uAC04 \\uC720\\uC9C0\\uBCF4\\uC218\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_lt.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=Tvarkyti plotus\n\n#XBUT\nButton.Add=Prid\\u0117ti\n#XBUT\nButton.Cancel=At\\u0161aukti\n#XBUT\nButton.Copy=Kopijuoti\n#XBUT\nButton.Create=Kurti\n#XBUT\nButton.Delete=Naikinti\n#XBUT\nButton.Edit=Redaguoti\n#XBUT\nButton.Save=\\u012Era\\u0161yti\n#XBUT\nButton.Ok=Gerai\n#XBUT\nButton.ShowPages=Rodyti puslapius\n#XBUT\nButton.HidePages=Sl\\u0117pti puslapius\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=Problemos\\: {0}\n#XBUT\nButton.SortPages=Perjungti puslapi\\u0173 rikiavimo tvark\\u0105\n#XBUT\nButton.ShowDetails=Rodyti i\\u0161sami\\u0105 informacij\\u0105\n#XBUT\nButton.ErrorMsg=Klaid\\u0173 prane\\u0161imai\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=Ie\\u0161koti\n#XTOL\nTooltip.SearchForTiles=Ie\\u0161koti plot\\u0173\n\n#XFLD\nLabel.SpaceID=Ploto ID\n#XFLD\nLabel.Title=Pavadinimas\n#XFLD\nLabel.WorkbenchRequest=Instrumentini\\u0173 priemoni\\u0173 u\\u017Eklausa\n#XFLD\nLabel.Package=Paketas\n#XFLD\nLabel.TransportInformation=Transporto informacija\n#XFLD\nLabel.Details=I\\u0161sami informacija\\:\n#XFLD\nLabel.ResponseCode=Atsakymo kodas\\:\n#XFLD\nLabel.Description=Apra\\u0161as\n#XFLD\nLabel.CreatedByFullname=Autorius\n#XFLD\nLabel.CreatedOn=Suk\\u016Brimo data\n#XFLD\nLabel.ChangedByFullname=Keitimo autorius\n#XFLD\nLabel.ChangedOn=Keitimo data\n#XFLD\nLabel.PageTitle=Puslapio pavadinimas\n#XFLD\nLabel.AssignedRole=Priskirtas vaidmuo\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=Antra\\u0161t\\u0117\n#XCOL\nColumn.SpaceDescription=Apra\\u0161as\n#XCOL\nColumn.SpacePackage=Paketas\n#XCOL\nColumn.SpaceWorkbenchRequest=Instrumentini\\u0173 priemoni\\u0173 u\\u017Eklausa\n#XCOL\nColumn.SpaceCreatedBy=Autorius\n#XCOL\nColumn.SpaceCreatedOn=Suk\\u016Brimo data\n#XCOL\nColumn.SpaceChangedBy=Keitimo autorius\n#XCOL\nColumn.SpaceChangedOn=Keitimo data\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Antra\\u0161t\\u0117\n#XCOL\nColumn.PageDescription=Apra\\u0161as\n#XCOL\nColumn.PagePackage=Paketas\n#XCOL\nColumn.PageWorkbenchRequest=Instrumentini\\u0173 priemoni\\u0173 u\\u017Eklausa\n#XCOL\nColumn.PageCreatedBy=Autorius\n#XCOL\nColumn.PageCreatedOn=Suk\\u016Brimo data\n#XCOL\nColumn.PageChangedBy=Keitimo autorius\n#XCOL\nColumn.PageChangedOn=Keitimo data\n\n#XTOL\nPlaceholder.CopySpaceTitle={0} kopija\n#XTOL\nPlaceholder.CopySpaceID={0} kopija\n\n#XMSG\nMessage.NoInternetConnection=Patikrinkite interneto ry\\u0161\\u012F.\n#XMSG\nMessage.SavedChanges=J\\u016Bs\\u0173 pakeitimai \\u012Fra\\u0161yti.\n#XMSG\nMessage.InvalidPageID=Naudokite tik \\u0161iuos simbolius\\: A\\u2013Z, 0\\u20139, _ ir /. Puslapio ID negali prasid\\u0117ti skaitmeniu.\n#XMSG\nMessage.EmptySpaceID=Pateikite galiojant\\u012F ploto ID.\n#XMSG\nMessage.EmptyTitle=Pateikite galiojant\\u012F pavadinim\\u0105.\n#XMSG\nMessage.SuccessDeletePage=Pasirinktas objektas buvo panaikintas.\n#XMSG\nMessage.ClipboardCopySuccess=Informacija nukopijuota s\\u0117kmingai.\n#YMSE\nMessage.ClipboardCopyFail=Kopijuojant informacij\\u0105 \\u012Fvyko klaida.\n#XMSG\nMessage.SpaceCreated=Plotas sukurtas.\n\n#XMSG\nMessage.NavigationTargetError=Nepavyko i\\u0161spr\\u0119sti nar\\u0161ymo tikslo.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=Nepavyko i\\u0161spr\\u0119sti poekranio \\u201E{0}\\u201C nar\\u0161ymo tikslo.\\n\\nTai grei\\u010Diausiai \\u012Fvyko d\\u0117l netinkamos \\u201ESAP Fiori\\u201C paleidimo skydelio turinio konfig\\u016Bracijos. Vizualizacija negali atidaryti taikomosios programos.\n#XMSG\nMessage.PageIsOutdated=Jau yra \\u012Fra\\u0161yta naujesn\\u0117 \\u0161io puslapio versija.\n#XMSG\nMessage.SaveChanges=\\u012Era\\u0161ykite savo keitimus.\n#XMSG\nMessage.NoSpaces=N\\u0117ra prieinam\\u0173 plot\\u0173.\n#XMSG\nMessage.NoSpacesFound=Nerasta plot\\u0173. Pabandykite pakoreguoti ie\\u0161kos kriterijus.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=Naujas plotas\n#XTIT\nDeleteDialog.Title=Naikinti\n#XMSG\nDeleteDialog.Text=Ar tikrai norite naikinti pasirinkt\\u0105 plot\\u0105?\n#XBUT\nDeleteDialog.ConfirmButton=Naikinti\n#XTIT\nDeleteDialog.LockedTitle=Plotas u\\u017Erakintas\n#XMSG\nDeleteDialog.LockedText=Pasirinkt\\u0105 plot\\u0105 u\\u017Erakino vartotojas \\u201E{0}\\u201C.\n#XMSG\nDeleteDialog.TransportRequired=Nor\\u0117dami panaikinti pasirinkt\\u0105 plot\\u0105 pasirinkite transportavimo paket\\u0105.\n\n#XMSG\nEditDialog.LockedText=Pasirinkt\\u0105 plot\\u0105 u\\u017Erakino vartotojas \\u201E{0}\\u201C.\n#XMSG\nEditDialog.TransportRequired=Nor\\u0117dami redaguoti pasirinkt\\u0105 plot\\u0105, pasirinkite transportavimo paket\\u0105.\n#XTIT\nEditDialog.Title=Redaguoti plot\\u0105\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=\\u0160is plotas sukurtas \\u201E{0}\\u201C kalba, ta\\u010Diau j\\u016Bs\\u0173 \\u012F\\u0117jimo kalba nustatyta \\u012F \\u201E{1}\\u201C. Pakeiskite savo \\u012F\\u0117jimo kalb\\u0105 \\u012F \\u201E{0}\\u201C, kad gal\\u0117tum\\u0117te t\\u0119sti.\n\n#XTIT\nErrorDialog.Title=Klaida\n\n#XTIT\nSpaceOverview.Title=Tvarkyti puslapius\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=I\\u0161d\\u0117stymas\n\n#XTIT\nCopyDialog.Title=Kopijuoti plot\\u0105\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=Ar norite nukopijuoti {0}?\n#XFLD\nCopyDialog.NewID={0} kopija\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=Apgailestaujame, \\u0161io ploto rasti nepavyko.\n#XLNK\nErrorPage.Link=I\\u0161laikyti tarpus\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_ms.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=Selenggarakan Ruang\n\n#XBUT\nButton.Add=Tambah\n#XBUT\nButton.Cancel=Batal\n#XBUT\nButton.Copy=Salin\n#XBUT\nButton.Create=Cipta\n#XBUT\nButton.Delete=Padam\n#XBUT\nButton.Edit=Edit\n#XBUT\nButton.Save=Simpan\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowPages=Tunjukkan Halaman\n#XBUT\nButton.HidePages=Sembunyikan Halaman\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=Keluaran\\: {0}\n#XBUT\nButton.SortPages=Togol Urutan Isihan Halaman\n#XBUT\nButton.ShowDetails=Tunjukkan Butiran\n#XBUT\nButton.ErrorMsg=Mesej Ralat\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=Cari\n#XTOL\nTooltip.SearchForTiles=Cari Ruang\n\n#XFLD\nLabel.SpaceID=ID Ruang\n#XFLD\nLabel.Title=Tajuk\n#XFLD\nLabel.WorkbenchRequest=Permintaan Workbench\n#XFLD\nLabel.Package=Pakej\n#XFLD\nLabel.TransportInformation=Maklumat Pengangkutan\n#XFLD\nLabel.Details=Butiran\\:\n#XFLD\nLabel.ResponseCode=Kod Maklum Balas\\:\n#XFLD\nLabel.Description=Perihalan\n#XFLD\nLabel.CreatedByFullname=Dicipta oleh\n#XFLD\nLabel.CreatedOn=Dicipta pada\n#XFLD\nLabel.ChangedByFullname=Diubah oleh\n#XFLD\nLabel.ChangedOn=Diubah pada\n#XFLD\nLabel.PageTitle=Tajuk Halaman\n#XFLD\nLabel.AssignedRole=Fungsi Diumpukkan\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=Tajuk\n#XCOL\nColumn.SpaceDescription=Perihalan\n#XCOL\nColumn.SpacePackage=Pakej\n#XCOL\nColumn.SpaceWorkbenchRequest=Permintaan Workbench\n#XCOL\nColumn.SpaceCreatedBy=Dicipta oleh\n#XCOL\nColumn.SpaceCreatedOn=Dicipta pada\n#XCOL\nColumn.SpaceChangedBy=Diubah oleh\n#XCOL\nColumn.SpaceChangedOn=Diubah pada\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Tajuk\n#XCOL\nColumn.PageDescription=Perihalan\n#XCOL\nColumn.PagePackage=Pakej\n#XCOL\nColumn.PageWorkbenchRequest=Permintaan Workbench\n#XCOL\nColumn.PageCreatedBy=Dicipta oleh\n#XCOL\nColumn.PageCreatedOn=Dicipta pada\n#XCOL\nColumn.PageChangedBy=Diubah oleh\n#XCOL\nColumn.PageChangedOn=Diubah pada\n\n#XTOL\nPlaceholder.CopySpaceTitle=Salinan bagi "{0}"\n#XTOL\nPlaceholder.CopySpaceID=Salinan bagi "{0}"\n\n#XMSG\nMessage.NoInternetConnection=Sila semak sambungan internet anda.\n#XMSG\nMessage.SavedChanges=Perubahan anda telah disimpan.\n#XMSG\nMessage.InvalidPageID=Sila gunakan hanya aksara berikut\\: A-Z, 0-9, _ dan /. ID halaman tidak harus bermula dengan nombor.\n#XMSG\nMessage.EmptySpaceID=Sila sediakan ID ruang yang sah.\n#XMSG\nMessage.EmptyTitle=Sila sediakan tajuk yang sah.\n#XMSG\nMessage.SuccessDeletePage=Objek terpilih telah dipadam.\n#XMSG\nMessage.ClipboardCopySuccess=Butiran berjaya disalin.\n#YMSE\nMessage.ClipboardCopyFail=Ralat berlaku ketika menyalin butiran.\n#XMSG\nMessage.SpaceCreated=Ruang telah dicipta.\n\n#XMSG\nMessage.NavigationTargetError=Sasaran navigasi tidak boleh diselesaikan.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=Gagal untuk selesaikan sasaran navigasi bagi jubin\\:  "{0}".\\n\\nPerkara ini berkemungkinan besar disebabkan oleh konfigurasi kandungan SAP Fiori launchpad yang tidak sah. Penggambaran tidak boleh membuka aplikasi.\n#XMSG\nMessage.PageIsOutdated=Versi terkini bagi halaman ini telah disimpan.\n#XMSG\nMessage.SaveChanges=Sila simpan perubahan anda.\n#XMSG\nMessage.NoSpaces=Tiada ruang tersedia.\n#XMSG\nMessage.NoSpacesFound=Tiada ruang ditemui. Cuba laraskan carian anda.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=Ruang Baharu\n#XTIT\nDeleteDialog.Title=Padam\n#XMSG\nDeleteDialog.Text=Adakah anda pasti anda ingin memadam ruang dipilih?\n#XBUT\nDeleteDialog.ConfirmButton=Padam\n#XTIT\nDeleteDialog.LockedTitle=Ruang Dikunci\n#XMSG\nDeleteDialog.LockedText=Ruang dipilih dikunci oleh pengguna "{0}".\n#XMSG\nDeleteDialog.TransportRequired=Sila pilih pakej pemindahan untuk memadam ruang dipilih.\n\n#XMSG\nEditDialog.LockedText=Ruang dipilih dikunci oleh pengguna "{0}".\n#XMSG\nEditDialog.TransportRequired=Sila pilih pakej pemindahan untuk mengedit ruang dipilih.\n#XTIT\nEditDialog.Title=Edit ruang\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=Ruang ini telah dicipta dalam bahasa "{0}" tetapi bahasa log masuk anda ditetapkan kepada "{1}". Sila ubah bahasa log masuk anda kepada "{0}" untuk teruskan.\n\n#XTIT\nErrorDialog.Title=Ralat\n\n#XTIT\nSpaceOverview.Title=Selenggarakan Halaman\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=Tataletak\n\n#XTIT\nCopyDialog.Title=Salin Ruang\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=Adakah anda ingin salin "{0}"?\n#XFLD\nCopyDialog.NewID=Salinan bagi "{0}"\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=Maaf, kami tidak dapat menemui ruang ini.\n#XLNK\nErrorPage.Link=Selenggarakan Ruang\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_nl.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=Ruimten verzorgen\n\n#XBUT\nButton.Add=Toevoegen\n#XBUT\nButton.Cancel=Afbreken\n#XBUT\nButton.Copy=Kopi\\u00EBren\n#XBUT\nButton.Create=Cre\\u00EBren\n#XBUT\nButton.Delete=Verwijderen\n#XBUT\nButton.Edit=Bewerken\n#XBUT\nButton.Save=Opslaan\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowPages=Pagina\'s weergeven\n#XBUT\nButton.HidePages=Pagina\'s verbergen\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=Problemen\\: {0}\n#XBUT\nButton.SortPages=Sorteervolgorde pagina\'s omschakelen\n#XBUT\nButton.ShowDetails=Details weergeven\n#XBUT\nButton.ErrorMsg=Foutmeldingen\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=Zoeken\n#XTOL\nTooltip.SearchForTiles=Zoeken naar ruimten\n\n#XFLD\nLabel.SpaceID=Ruimte-ID\n#XFLD\nLabel.Title=Titel\n#XFLD\nLabel.WorkbenchRequest=Workbenchopdracht\n#XFLD\nLabel.Package=Pakket\n#XFLD\nLabel.TransportInformation=Transportinformatie\n#XFLD\nLabel.Details=Details\\:\n#XFLD\nLabel.ResponseCode=Responscode\\:\n#XFLD\nLabel.Description=Omschrijving\n#XFLD\nLabel.CreatedByFullname=Gecre\\u00EBerd door\n#XFLD\nLabel.CreatedOn=Gecre\\u00EBerd op\n#XFLD\nLabel.ChangedByFullname=Gewijzigd door\n#XFLD\nLabel.ChangedOn=Gewijzigd op\n#XFLD\nLabel.PageTitle=Paginatitel\n#XFLD\nLabel.AssignedRole=Toegewezen rol\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=Titel\n#XCOL\nColumn.SpaceDescription=Omschrijving\n#XCOL\nColumn.SpacePackage=Pakket\n#XCOL\nColumn.SpaceWorkbenchRequest=Workbenchopdracht\n#XCOL\nColumn.SpaceCreatedBy=Gecre\\u00EBerd door\n#XCOL\nColumn.SpaceCreatedOn=Gecre\\u00EBerd op\n#XCOL\nColumn.SpaceChangedBy=Gewijzigd door\n#XCOL\nColumn.SpaceChangedOn=Gewijzigd op\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Titel\n#XCOL\nColumn.PageDescription=Omschrijving\n#XCOL\nColumn.PagePackage=Pakket\n#XCOL\nColumn.PageWorkbenchRequest=Workbenchopdracht\n#XCOL\nColumn.PageCreatedBy=Gecre\\u00EBerd door\n#XCOL\nColumn.PageCreatedOn=Gecre\\u00EBerd op\n#XCOL\nColumn.PageChangedBy=Gewijzigd door\n#XCOL\nColumn.PageChangedOn=Gewijzigd op\n\n#XTOL\nPlaceholder.CopySpaceTitle=Kopie van "{0}"\n#XTOL\nPlaceholder.CopySpaceID=Kopie van "{0}"\n\n#XMSG\nMessage.NoInternetConnection=Controleer uw internetverbinding.\n#XMSG\nMessage.SavedChanges=Uw wijzigingen zijn opgeslagen.\n#XMSG\nMessage.InvalidPageID=Gebruik alleen de volgende tekens\\: A-Z, 0-9, _ en /. De pagina-ID mag niet beginnen met een cijfer.\n#XMSG\nMessage.EmptySpaceID=Geef een geldige ruimte-ID op.\n#XMSG\nMessage.EmptyTitle=Geef een geldige titel op.\n#XMSG\nMessage.SuccessDeletePage=Het geselecteerde object is verwijderd.\n#XMSG\nMessage.ClipboardCopySuccess=Details zijn gekopieerd.\n#YMSE\nMessage.ClipboardCopyFail=Fout opgetreden tijdens kopi\\u00EBren van details.\n#XMSG\nMessage.SpaceCreated=De ruimte is gecre\\u00EBerd.\n\n#XMSG\nMessage.NavigationTargetError=Navigatiedoel kan niet worden opgelost.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=Navigatiedoel van tegel\\: "{0}" kan niet worden opgelost.\\n\\nDit komt vermoedelijk door onjuist geconfigureerde SAP Fiori-launchpadcontent. De visualisatie kan geen applicatie openen.\n#XMSG\nMessage.PageIsOutdated=Er is al een nieuwere versie van deze pagina opgeslagen.\n#XMSG\nMessage.SaveChanges=Sla uw wijzigingen op.\n#XMSG\nMessage.NoSpaces=Geen ruimten beschikbaar.\n#XMSG\nMessage.NoSpacesFound=Geen ruimten gevonden. Pas uw zoekopdracht aan.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=Nieuwe ruimte\n#XTIT\nDeleteDialog.Title=Verwijderen\n#XMSG\nDeleteDialog.Text=Weet u zeker dat u de geselecteerde ruimte wilt verwijderen?\n#XBUT\nDeleteDialog.ConfirmButton=Verwijderen\n#XTIT\nDeleteDialog.LockedTitle=Ruimte geblokkeerd\n#XMSG\nDeleteDialog.LockedText=De geselecteerde ruimte is geblokkeerd door gebruiker "{0}".\n#XMSG\nDeleteDialog.TransportRequired=Selecteer een transportpakket om de geselecteerde ruimte te verwijderen.\n\n#XMSG\nEditDialog.LockedText=De geselecteerde ruimte is geblokkeerd door gebruiker "{0}".\n#XMSG\nEditDialog.TransportRequired=Selecteer een transportpakket om de geselecteerde ruimte te bewerken.\n#XTIT\nEditDialog.Title=Ruimte bewerken\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=Deze ruimte is gecre\\u00EBerd in taal "{0}", maar uw aanmeldtaal is ingesteld op "{1}". Wijzig uw aanmeldtaal in "{0}" om verder te gaan.\n\n#XTIT\nErrorDialog.Title=Fout\n\n#XTIT\nSpaceOverview.Title=Pagina\'s verzorgen\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=Lay-out\n\n#XTIT\nCopyDialog.Title=Ruimte kopi\\u00EBren\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=Wilt u "{0}" kopi\\u00EBren?\n#XFLD\nCopyDialog.NewID=Kopie van "{0}"\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=Deze ruimte is niet gevonden.\n#XLNK\nErrorPage.Link=Ruimten verzorgen\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_no.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=Vedlikehold omr\\u00E5der\n\n#XBUT\nButton.Add=Tilf\\u00F8y\n#XBUT\nButton.Cancel=Avbryt\n#XBUT\nButton.Copy=Kopier\n#XBUT\nButton.Create=Opprett\n#XBUT\nButton.Delete=Slett\n#XBUT\nButton.Edit=Rediger\n#XBUT\nButton.Save=Lagre\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowPages=Vis sider\n#XBUT\nButton.HidePages=Skjul sider\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=Problemer\\: {0}\n#XBUT\nButton.SortPages=Veksle sidesortering\n#XBUT\nButton.ShowDetails=Vis detaljer\n#XBUT\nButton.ErrorMsg=Feilmeldinger\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=S\\u00F8k\n#XTOL\nTooltip.SearchForTiles=S\\u00F8k etter omr\\u00E5der\n\n#XFLD\nLabel.SpaceID=Omr\\u00E5de-ID\n#XFLD\nLabel.Title=Tittel\n#XFLD\nLabel.WorkbenchRequest=Workbenchordre\n#XFLD\nLabel.Package=Pakke\n#XFLD\nLabel.TransportInformation=Transportinformasjon\n#XFLD\nLabel.Details=Detaljer\\:\n#XFLD\nLabel.ResponseCode=Svarkode\\:\n#XFLD\nLabel.Description=Beskrivelse\n#XFLD\nLabel.CreatedByFullname=Opprettet av\n#XFLD\nLabel.CreatedOn=Opprettet den\n#XFLD\nLabel.ChangedByFullname=Endret av\n#XFLD\nLabel.ChangedOn=Endret den\n#XFLD\nLabel.PageTitle=Sidetittel\n#XFLD\nLabel.AssignedRole=Tilordnet rolle\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=Tittel\n#XCOL\nColumn.SpaceDescription=Beskrivelse\n#XCOL\nColumn.SpacePackage=Pakke\n#XCOL\nColumn.SpaceWorkbenchRequest=Workbenchordre\n#XCOL\nColumn.SpaceCreatedBy=Opprettet av\n#XCOL\nColumn.SpaceCreatedOn=Opprettet den\n#XCOL\nColumn.SpaceChangedBy=Endret av\n#XCOL\nColumn.SpaceChangedOn=Endret den\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Tittel\n#XCOL\nColumn.PageDescription=Beskrivelse\n#XCOL\nColumn.PagePackage=Pakke\n#XCOL\nColumn.PageWorkbenchRequest=Workbenchordre\n#XCOL\nColumn.PageCreatedBy=Opprettet av\n#XCOL\nColumn.PageCreatedOn=Opprettet den\n#XCOL\nColumn.PageChangedBy=Endret av\n#XCOL\nColumn.PageChangedOn=Endret den\n\n#XTOL\nPlaceholder.CopySpaceTitle=Kopi av "{0}"\n#XTOL\nPlaceholder.CopySpaceID=Kopi av "{0}"\n\n#XMSG\nMessage.NoInternetConnection=Kontroller Internett-forbindelsen.\n#XMSG\nMessage.SavedChanges=Endringene er lagret.\n#XMSG\nMessage.InvalidPageID=Bruk bare f\\u00F8lgende tegn\\: A-Z, 0-9, _ og /. Side-ID-en kan ikke starte med et tall.\n#XMSG\nMessage.EmptySpaceID=Oppgi en gyldig omr\\u00E5de-ID.\n#XMSG\nMessage.EmptyTitle=Oppgi en gyldig tittel.\n#XMSG\nMessage.SuccessDeletePage=Valgt objekt er slettet.\n#XMSG\nMessage.ClipboardCopySuccess=Detaljene er kopiert.\n#YMSE\nMessage.ClipboardCopyFail=Det oppstod en feil under kopiering av detaljer.\n#XMSG\nMessage.SpaceCreated=Omr\\u00E5det er opprettet.\n\n#XMSG\nMessage.NavigationTargetError=Kan ikke bryte ned navigeringsm\\u00E5let.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=Kan ikke bryte ned navigeringsm\\u00E5let for ruten\\: "{0}".\\n\\nDette skyldes mest sannsynlig feil konfigurasjon av SAP Fiori-startfeltinnhold. Visualiseringen kan ikke \\u00E5pne en applikasjon.\n#XMSG\nMessage.PageIsOutdated=En nyere versjon av denne siden er allerede lagret.\n#XMSG\nMessage.SaveChanges=Lagre endringene.\n#XMSG\nMessage.NoSpaces=Ingen omr\\u00E5der tilgjengelig.\n#XMSG\nMessage.NoSpacesFound=Finner ingen omr\\u00E5der. Pr\\u00F8v \\u00E5 justere s\\u00F8ket.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=Nytt omr\\u00E5de\n#XTIT\nDeleteDialog.Title=Slett\n#XMSG\nDeleteDialog.Text=Er du sikker p\\u00E5 at du vil slette valgt omr\\u00E5de?\n#XBUT\nDeleteDialog.ConfirmButton=Slett\n#XTIT\nDeleteDialog.LockedTitle=Omr\\u00E5de sperret\n#XMSG\nDeleteDialog.LockedText=Valgt omr\\u00E5de er sperret av brukeren "{0}".\n#XMSG\nDeleteDialog.TransportRequired=Velg en transportpakke for \\u00E5 slette valgt omr\\u00E5de.\n\n#XMSG\nEditDialog.LockedText=Valgt omr\\u00E5de er sperret av brukeren "{0}".\n#XMSG\nEditDialog.TransportRequired=Velg en transportpakke for \\u00E5 redigere valgt omr\\u00E5de.\n#XTIT\nEditDialog.Title=Rediger omr\\u00E5de\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=Dette omr\\u00E5det er opprettet p\\u00E5 spr\\u00E5ket "{0}", men p\\u00E5loggingsspr\\u00E5ket ditt er satt til "{1}". Endre p\\u00E5loggingsspr\\u00E5ket til "{0}" for \\u00E5 fortsette.\n\n#XTIT\nErrorDialog.Title=Feil\n\n#XTIT\nSpaceOverview.Title=Vedlikehold sider\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=Oppsett\n\n#XTIT\nCopyDialog.Title=Kopier omr\\u00E5de\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=Vil du kopiere "{0}"?\n#XFLD\nCopyDialog.NewID=Kopi av "{0}"\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=Beklager, vi finner ikke dette omr\\u00E5det.\n#XLNK\nErrorPage.Link=Vedlikehold omr\\u00E5der\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_pl.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=Opracowanie przestrzeni\n\n#XBUT\nButton.Add=Dodaj\n#XBUT\nButton.Cancel=Anuluj\n#XBUT\nButton.Copy=Kopiuj\n#XBUT\nButton.Create=Utw\\u00F3rz\n#XBUT\nButton.Delete=Usu\\u0144\n#XBUT\nButton.Edit=Edytuj\n#XBUT\nButton.Save=Zapisz\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowPages=Poka\\u017C strony\n#XBUT\nButton.HidePages=Ukryj strony\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=Problemy\\: {0}\n#XBUT\nButton.SortPages=Zmie\\u0144 kolejno\\u015B\\u0107 sortowania stron\n#XBUT\nButton.ShowDetails=Poka\\u017C szczeg\\u00F3\\u0142y\n#XBUT\nButton.ErrorMsg=Komunikaty o b\\u0142\\u0119dzie\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=Szukaj\n#XTOL\nTooltip.SearchForTiles=Szukaj przestrzeni\n\n#XFLD\nLabel.SpaceID=ID przestrzeni\n#XFLD\nLabel.Title=Tytu\\u0142\n#XFLD\nLabel.WorkbenchRequest=Zlecenie Workbench\n#XFLD\nLabel.Package=Pakiet\n#XFLD\nLabel.TransportInformation=Informacje o transporcie\n#XFLD\nLabel.Details=Szczeg\\u00F3\\u0142y\\:\n#XFLD\nLabel.ResponseCode=Kod odpowiedzi\\:\n#XFLD\nLabel.Description=Opis\n#XFLD\nLabel.CreatedByFullname=Utworzone przez\n#XFLD\nLabel.CreatedOn=Utworzono dnia\n#XFLD\nLabel.ChangedByFullname=Zmienione przez\n#XFLD\nLabel.ChangedOn=Zmieniono dnia\n#XFLD\nLabel.PageTitle=Tytu\\u0142 strony\n#XFLD\nLabel.AssignedRole=Przypisana rola\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=Tytu\\u0142\n#XCOL\nColumn.SpaceDescription=Opis\n#XCOL\nColumn.SpacePackage=Pakiet\n#XCOL\nColumn.SpaceWorkbenchRequest=Zlecenie Workbench\n#XCOL\nColumn.SpaceCreatedBy=Utworzone przez\n#XCOL\nColumn.SpaceCreatedOn=Utworzono dnia\n#XCOL\nColumn.SpaceChangedBy=Zmienione przez\n#XCOL\nColumn.SpaceChangedOn=Zmieniono dnia\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Tytu\\u0142\n#XCOL\nColumn.PageDescription=Opis\n#XCOL\nColumn.PagePackage=Pakiet\n#XCOL\nColumn.PageWorkbenchRequest=Zlecenie Workbench\n#XCOL\nColumn.PageCreatedBy=Utworzone przez\n#XCOL\nColumn.PageCreatedOn=Utworzono dnia\n#XCOL\nColumn.PageChangedBy=Zmienione przez\n#XCOL\nColumn.PageChangedOn=Zmieniono dnia\n\n#XTOL\nPlaceholder.CopySpaceTitle=Kopia "{0}"\n#XTOL\nPlaceholder.CopySpaceID=Kopia "{0}"\n\n#XMSG\nMessage.NoInternetConnection=Sprawd\\u017A po\\u0142\\u0105czenie z Internetem.\n#XMSG\nMessage.SavedChanges=Twoje zmiany zosta\\u0142y zapisane.\n#XMSG\nMessage.InvalidPageID=U\\u017Cyj tylko nast\\u0119puj\\u0105cych znak\\u00F3w\\: A-Z, 0-9, _ oraz /. ID strony nie powinien rozpoczyna\\u0107 si\\u0119 liczb\\u0105.\n#XMSG\nMessage.EmptySpaceID=Podaj prawid\\u0142owy ID przestrzeni.\n#XMSG\nMessage.EmptyTitle=Podaj prawid\\u0142owy tytu\\u0142.\n#XMSG\nMessage.SuccessDeletePage=Wybrany obiekt zosta\\u0142 usuni\\u0119ty.\n#XMSG\nMessage.ClipboardCopySuccess=Pomy\\u015Blnie skopiowano szczeg\\u00F3\\u0142y.\n#YMSE\nMessage.ClipboardCopyFail=Wyst\\u0105pi\\u0142 b\\u0142\\u0105d podczas kopiowania szczeg\\u00F3\\u0142\\u00F3w.\n#XMSG\nMessage.SpaceCreated=Utworzono przestrze\\u0144.\n\n#XMSG\nMessage.NavigationTargetError=Nie mo\\u017Cna by\\u0142o rozwin\\u0105\\u0107 celu nawigacji.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=B\\u0142\\u0105d rozwijania celu nawigacji kafelka\\: "{0}".\\n\\nNajprawdopodobniej jest to spowodowane nieprawid\\u0142ow\\u0105 konfiguracj\\u0105 zawarto\\u015Bci okna wywo\\u0142a\\u0144 SAP Fiori. Wizualizacja nie mo\\u017Ce otworzy\\u0107 aplikacji.\n#XMSG\nMessage.PageIsOutdated=Zapisano ju\\u017C nowsz\\u0105 wersj\\u0119 tej strony.\n#XMSG\nMessage.SaveChanges=Zapisz zmiany.\n#XMSG\nMessage.NoSpaces=Brak przestrzeni.\n#XMSG\nMessage.NoSpacesFound=Nie znaleziono przestrzeni. Spr\\u00F3buj dostosowa\\u0107 wyszukiwanie.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=Nowa przestrze\\u0144\n#XTIT\nDeleteDialog.Title=Usuwanie\n#XMSG\nDeleteDialog.Text=Czy na pewno chcesz usun\\u0105\\u0107 wybran\\u0105 przestrze\\u0144?\n#XBUT\nDeleteDialog.ConfirmButton=Usu\\u0144\n#XTIT\nDeleteDialog.LockedTitle=Przestrze\\u0144 zablokowana\n#XMSG\nDeleteDialog.LockedText=Wybrana przestrze\\u0144 jest zablokowana przez u\\u017Cytkownika "{0}".\n#XMSG\nDeleteDialog.TransportRequired=Wybierz pakiet transportowy, aby usun\\u0105\\u0107 wybran\\u0105 przestrze\\u0144.\n\n#XMSG\nEditDialog.LockedText=Wybrana przestrze\\u0144 jest zablokowana przez u\\u017Cytkownika "{0}".\n#XMSG\nEditDialog.TransportRequired=Wybierz pakiet transportowy, aby edytowa\\u0107 wybran\\u0105 przestrze\\u0144.\n#XTIT\nEditDialog.Title=Edycja przestrzeni\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=Ta przestrze\\u0144 zosta\\u0142a utworzona w j\\u0119zyku "{0}", a Tw\\u00F3j j\\u0119zyk logowania jest ustawiony na "{1}". Aby kontynuowa\\u0107, zmie\\u0144 j\\u0119zyk logowania na "{0}".\n\n#XTIT\nErrorDialog.Title=B\\u0142\\u0105d\n\n#XTIT\nSpaceOverview.Title=Opracowanie stron\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=Uk\\u0142ad\n\n#XTIT\nCopyDialog.Title=Kopiowanie przestrzeni\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=Czy chcesz skopiowa\\u0107 "{0}"?\n#XFLD\nCopyDialog.NewID=Kopia "{0}"\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=Niestety, nie mo\\u017Cemy znale\\u017A\\u0107 tej przestrzeni.\n#XLNK\nErrorPage.Link=Opracowanie przestrzeni\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_pt.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=Atualizar espa\\u00E7os\n\n#XBUT\nButton.Add=Adicionar\n#XBUT\nButton.Cancel=Cancelar\n#XBUT\nButton.Copy=Copiar\n#XBUT\nButton.Create=Criar\n#XBUT\nButton.Delete=Eliminar\n#XBUT\nButton.Edit=Editar\n#XBUT\nButton.Save=Gravar\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowPages=Exibir p\\u00E1ginas\n#XBUT\nButton.HidePages=Ocultar p\\u00E1ginas\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=Problemas\\: {0}\n#XBUT\nButton.SortPages=Comutar sequ\\u00EAncia de ordena\\u00E7\\u00E3o de p\\u00E1ginas\n#XBUT\nButton.ShowDetails=Exibir detalhes\n#XBUT\nButton.ErrorMsg=Mensagens de erro\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=Procurar\n#XTOL\nTooltip.SearchForTiles=Procurar espa\\u00E7os\n\n#XFLD\nLabel.SpaceID=ID de espa\\u00E7o\n#XFLD\nLabel.Title=T\\u00EDtulo\n#XFLD\nLabel.WorkbenchRequest=Ordem de workbench\n#XFLD\nLabel.Package=Pacote\n#XFLD\nLabel.TransportInformation=Informa\\u00E7\\u00E3o de transporte\n#XFLD\nLabel.Details=Detalhes\\:\n#XFLD\nLabel.ResponseCode=C\\u00F3digo de resposta\\:\n#XFLD\nLabel.Description=Descri\\u00E7\\u00E3o\n#XFLD\nLabel.CreatedByFullname=Criado por\n#XFLD\nLabel.CreatedOn=Criada em\n#XFLD\nLabel.ChangedByFullname=Modificado por\n#XFLD\nLabel.ChangedOn=Modificado em\n#XFLD\nLabel.PageTitle=T\\u00EDtulo da p\\u00E1gina\n#XFLD\nLabel.AssignedRole=Fun\\u00E7\\u00E3o atribu\\u00EDda\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=T\\u00EDtulo\n#XCOL\nColumn.SpaceDescription=Descri\\u00E7\\u00E3o\n#XCOL\nColumn.SpacePackage=Pacote\n#XCOL\nColumn.SpaceWorkbenchRequest=Ordem de workbench\n#XCOL\nColumn.SpaceCreatedBy=Criado por\n#XCOL\nColumn.SpaceCreatedOn=Criada em\n#XCOL\nColumn.SpaceChangedBy=Modificado por\n#XCOL\nColumn.SpaceChangedOn=Modificado em\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=T\\u00EDtulo\n#XCOL\nColumn.PageDescription=Descri\\u00E7\\u00E3o\n#XCOL\nColumn.PagePackage=Pacote\n#XCOL\nColumn.PageWorkbenchRequest=Ordem de workbench\n#XCOL\nColumn.PageCreatedBy=Criado por\n#XCOL\nColumn.PageCreatedOn=Criada em\n#XCOL\nColumn.PageChangedBy=Modificado por\n#XCOL\nColumn.PageChangedOn=Modificado em\n\n#XTOL\nPlaceholder.CopySpaceTitle=C\\u00F3pia de "{0}"\n#XTOL\nPlaceholder.CopySpaceID=C\\u00F3pia de "{0}"\n\n#XMSG\nMessage.NoInternetConnection=Verifique a sua conex\\u00E3o de Internet.\n#XMSG\nMessage.SavedChanges=As suas modifica\\u00E7\\u00F5es foram gravadas.\n#XMSG\nMessage.InvalidPageID=Utilize somente os seguintes caracteres\\: A-Z, 0-9, _ e /. O ID da p\\u00E1gina n\\u00E3o deve come\\u00E7ar com um n\\u00FAmero.\n#XMSG\nMessage.EmptySpaceID=Forne\\u00E7a um ID de espa\\u00E7o v\\u00E1lido.\n#XMSG\nMessage.EmptyTitle=Forne\\u00E7a um t\\u00EDtulo v\\u00E1lido.\n#XMSG\nMessage.SuccessDeletePage=O objeto selecionado foi eliminado.\n#XMSG\nMessage.ClipboardCopySuccess=Os detalhes foram copiados com \\u00EAxito.\n#YMSE\nMessage.ClipboardCopyFail=Ocorreu um erro ao copiar os detalhes.\n#XMSG\nMessage.SpaceCreated=O espa\\u00E7o foi criado.\n\n#XMSG\nMessage.NavigationTargetError=N\\u00E3o foi poss\\u00EDvel resolver o destino de navega\\u00E7\\u00E3o.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=Falha ao resolver o destino de navega\\u00E7\\u00E3o do bloco\\: "{0}".\\n\\nIsto foi muito provavelmente causado por uma configura\\u00E7\\u00E3o inv\\u00E1lida de conte\\u00FAdo do launchpad do SAP Fiori. A visualiza\\u00E7\\u00E3o n\\u00E3o pode abrir uma aplica\\u00E7\\u00E3o.\n#XMSG\nMessage.PageIsOutdated=J\\u00E1 foi gravada uma vers\\u00E3o mais recente dessa p\\u00E1gina.\n#XMSG\nMessage.SaveChanges=Grave suas modifica\\u00E7\\u00F5es.\n#XMSG\nMessage.NoSpaces=Nenhum espa\\u00E7o dispon\\u00EDvel.\n#XMSG\nMessage.NoSpacesFound=Nenhum espa\\u00E7o encontrado. Tente ajustar sua pesquisa.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=Novo espa\\u00E7o\n#XTIT\nDeleteDialog.Title=Eliminar\n#XMSG\nDeleteDialog.Text=Voc\\u00EA quer mesmo eliminar o espa\\u00E7o selecionado?\n#XBUT\nDeleteDialog.ConfirmButton=Eliminar\n#XTIT\nDeleteDialog.LockedTitle=Espa\\u00E7o bloqueado\n#XMSG\nDeleteDialog.LockedText=O espa\\u00E7o selecionado est\\u00E1 bloqueado pelo usu\\u00E1rio "{0}".\n#XMSG\nDeleteDialog.TransportRequired=Selecione um pacote de transporte para eliminar o espa\\u00E7o selecionado.\n\n#XMSG\nEditDialog.LockedText=O espa\\u00E7o selecionado est\\u00E1 bloqueado pelo usu\\u00E1rio "{0}".\n#XMSG\nEditDialog.TransportRequired=Selecione um pacote de transporte para processar o espa\\u00E7o selecionado.\n#XTIT\nEditDialog.Title=Processar espa\\u00E7o\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=Este espa\\u00E7o foi criado no idioma "{0}", mas o seu idioma de logon est\\u00E1 definido como "{1}". Modifique o seu idioma de logon para "{0}" para continuar.\n\n#XTIT\nErrorDialog.Title=Erro\n\n#XTIT\nSpaceOverview.Title=Atualizar p\\u00E1ginas\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=Layout\n\n#XTIT\nCopyDialog.Title=Copiar espa\\u00E7o\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=Quer copiar "{0}"?\n#XFLD\nCopyDialog.NewID=C\\u00F3pia de \\u201C{0}\\u201D\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=N\\u00E3o foi poss\\u00EDvel encontrar este espa\\u00E7o.\n#XLNK\nErrorPage.Link=Atualizar espa\\u00E7os\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_ru.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=\\u0412\\u0435\\u0434\\u0435\\u043D\\u0438\\u0435 \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\n\n#XBUT\nButton.Add=\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C\n#XBUT\nButton.Cancel=\\u041E\\u0442\\u043C\\u0435\\u043D\\u0438\\u0442\\u044C\n#XBUT\nButton.Copy=\\u0421\\u043A\\u043E\\u043F\\u0438\\u0440\\u043E\\u0432\\u0430\\u0442\\u044C\n#XBUT\nButton.Create=\\u0421\\u043E\\u0437\\u0434\\u0430\\u0442\\u044C\n#XBUT\nButton.Delete=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C\n#XBUT\nButton.Edit=\\u041E\\u0431\\u0440\\u0430\\u0431\\u043E\\u0442\\u0430\\u0442\\u044C\n#XBUT\nButton.Save=\\u0421\\u043E\\u0445\\u0440\\u0430\\u043D\\u0438\\u0442\\u044C\n#XBUT\nButton.Ok=\\u041E\\u041A\n#XBUT\nButton.ShowPages=\\u041F\\u043E\\u043A\\u0430\\u0437\\u0430\\u0442\\u044C \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u044B\n#XBUT\nButton.HidePages=\\u0421\\u043A\\u0440\\u044B\\u0442\\u044C \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u044B\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=\\u041F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\u044B\\: {0}\n#XBUT\nButton.SortPages=\\u041F\\u0435\\u0440\\u0435\\u043A\\u043B\\u044E\\u0447\\u0438\\u0442\\u044C \\u0441\\u043E\\u0440\\u0442\\u0438\\u0440\\u043E\\u0432\\u043A\\u0443 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\n#XBUT\nButton.ShowDetails=\\u041F\\u043E\\u043A\\u0430\\u0437\\u0430\\u0442\\u044C \\u0441\\u0432\\u0435\\u0434\\u0435\\u043D\\u0438\\u044F\n#XBUT\nButton.ErrorMsg=\\u0421\\u043E\\u043E\\u0431\\u0449\\u0435\\u043D\\u0438\\u044F \\u043E\\u0431 \\u043E\\u0448\\u0438\\u0431\\u043A\\u0430\\u0445\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=\\u041F\\u043E\\u0438\\u0441\\u043A\n#XTOL\nTooltip.SearchForTiles=\\u041F\\u043E\\u0438\\u0441\\u043A \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\n\n#XFLD\nLabel.SpaceID=\\u0418\\u0434. \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u0430\n#XFLD\nLabel.Title=\\u0417\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A\n#XFLD\nLabel.WorkbenchRequest=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0441 \\u043A \\u0438\\u043D\\u0441\\u0442\\u0440\\u0443\\u043C\\u0435\\u043D\\u0442\\u0430\\u043B\\u044C\\u043D\\u044B\\u043C \\u0441\\u0440\\u0435\\u0434\\u0441\\u0442\\u0432\\u0430\\u043C\n#XFLD\nLabel.Package=\\u041F\\u0430\\u043A\\u0435\\u0442\n#XFLD\nLabel.TransportInformation=\\u0418\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0438\\u044F \\u043E \\u043F\\u0435\\u0440\\u0435\\u043D\\u043E\\u0441\\u0435\n#XFLD\nLabel.Details=\\u0421\\u0432\\u0435\\u0434\\u0435\\u043D\\u0438\\u044F\\:\n#XFLD\nLabel.ResponseCode=\\u041A\\u043E\\u0434 \\u043E\\u0442\\u0432\\u0435\\u0442\\u0430\\:\n#XFLD\nLabel.Description=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\n#XFLD\nLabel.CreatedByFullname=\\u0421\\u043E\\u0437\\u0434\\u0430\\u043B\n#XFLD\nLabel.CreatedOn=\\u0414\\u0430\\u0442\\u0430 \\u0441\\u043E\\u0437\\u0434\\u0430\\u043D\\u0438\\u044F\n#XFLD\nLabel.ChangedByFullname=\\u0410\\u0432\\u0442\\u043E\\u0440 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F\n#XFLD\nLabel.ChangedOn=\\u0414\\u0430\\u0442\\u0430 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F\n#XFLD\nLabel.PageTitle=\\u0417\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u044B\n#XFLD\nLabel.AssignedRole=\\u041F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0435\\u043D\\u043D\\u0430\\u044F \\u0440\\u043E\\u043B\\u044C\n\n#XCOL\nColumn.SpaceID=\\u0418\\u0434\\u0435\\u043D\\u0442\\u0438\\u0444\\u0438\\u043A\\u0430\\u0442\\u043E\\u0440\n#XCOL\nColumn.SpaceTitle=\\u0417\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A\n#XCOL\nColumn.SpaceDescription=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\n#XCOL\nColumn.SpacePackage=\\u041F\\u0430\\u043A\\u0435\\u0442\n#XCOL\nColumn.SpaceWorkbenchRequest=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0441 \\u043A \\u0438\\u043D\\u0441\\u0442\\u0440\\u0443\\u043C\\u0435\\u043D\\u0442\\u0430\\u043B\\u044C\\u043D\\u044B\\u043C \\u0441\\u0440\\u0435\\u0434\\u0441\\u0442\\u0432\\u0430\\u043C\n#XCOL\nColumn.SpaceCreatedBy=\\u0421\\u043E\\u0437\\u0434\\u0430\\u043B\n#XCOL\nColumn.SpaceCreatedOn=\\u0414\\u0430\\u0442\\u0430 \\u0441\\u043E\\u0437\\u0434\\u0430\\u043D\\u0438\\u044F\n#XCOL\nColumn.SpaceChangedBy=\\u0410\\u0432\\u0442\\u043E\\u0440 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F\n#XCOL\nColumn.SpaceChangedOn=\\u0414\\u0430\\u0442\\u0430 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F\n\n#XCOL\nColumn.PageID=\\u0418\\u0434.\n#XCOL\nColumn.PageTitle=\\u0417\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A\n#XCOL\nColumn.PageDescription=\\u041E\\u043F\\u0438\\u0441\\u0430\\u043D\\u0438\\u0435\n#XCOL\nColumn.PagePackage=\\u041F\\u0430\\u043A\\u0435\\u0442\n#XCOL\nColumn.PageWorkbenchRequest=\\u0417\\u0430\\u043F\\u0440\\u043E\\u0441 \\u043A \\u0438\\u043D\\u0441\\u0442\\u0440\\u0443\\u043C\\u0435\\u043D\\u0442\\u0430\\u043B\\u044C\\u043D\\u044B\\u043C \\u0441\\u0440\\u0435\\u0434\\u0441\\u0442\\u0432\\u0430\\u043C\n#XCOL\nColumn.PageCreatedBy=\\u0421\\u043E\\u0437\\u0434\\u0430\\u043B\n#XCOL\nColumn.PageCreatedOn=\\u0414\\u0430\\u0442\\u0430 \\u0441\\u043E\\u0437\\u0434\\u0430\\u043D\\u0438\\u044F\n#XCOL\nColumn.PageChangedBy=\\u0410\\u0432\\u0442\\u043E\\u0440 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F\n#XCOL\nColumn.PageChangedOn=\\u0414\\u0430\\u0442\\u0430 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F\n\n#XTOL\nPlaceholder.CopySpaceTitle=\\u041A\\u043E\\u043F\\u0438\\u044F "{0}"\n#XTOL\nPlaceholder.CopySpaceID=\\u041A\\u043E\\u043F\\u0438\\u044F "{0}"\n\n#XMSG\nMessage.NoInternetConnection=\\u041F\\u0440\\u043E\\u0432\\u0435\\u0440\\u044C\\u0442\\u0435 \\u0438\\u043D\\u0442\\u0435\\u0440\\u043D\\u0435\\u0442-\\u0441\\u043E\\u0435\\u0434\\u0438\\u043D\\u0435\\u043D\\u0438\\u0435.\n#XMSG\nMessage.SavedChanges=\\u0412\\u0430\\u0448\\u0438 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F \\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u0435\\u043D\\u044B.\n#XMSG\nMessage.InvalidPageID=\\u0418\\u0441\\u043F\\u043E\\u043B\\u044C\\u0437\\u0443\\u0439\\u0442\\u0435 \\u0442\\u043E\\u043B\\u044C\\u043A\\u043E \\u0441\\u043B\\u0435\\u0434\\u0443\\u044E\\u0449\\u0438\\u0435 \\u0441\\u0438\\u043C\\u0432\\u043E\\u043B\\u044B\\: A-Z, 0-9, _ \\u0438 /. \\u0418\\u0434. \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u044B \\u043D\\u0435 \\u0434\\u043E\\u043B\\u0436\\u0435\\u043D \\u043D\\u0430\\u0447\\u0438\\u043D\\u0430\\u0442\\u044C\\u0441\\u044F \\u0441 \\u0446\\u0438\\u0444\\u0440\\u044B.\n#XMSG\nMessage.EmptySpaceID=\\u0423\\u043A\\u0430\\u0436\\u0438\\u0442\\u0435 \\u0434\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0438\\u0434. \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u0430.\n#XMSG\nMessage.EmptyTitle=\\u0423\\u043A\\u0430\\u0436\\u0438\\u0442\\u0435 \\u0434\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0437\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A.\n#XMSG\nMessage.SuccessDeletePage=\\u0412\\u044B\\u0431\\u0440\\u0430\\u043D\\u043D\\u044B\\u0439 \\u043E\\u0431\\u044A\\u0435\\u043A\\u0442 \\u0443\\u0434\\u0430\\u043B\\u0435\\u043D.\n#XMSG\nMessage.ClipboardCopySuccess=\\u0421\\u0432\\u0435\\u0434\\u0435\\u043D\\u0438\\u044F \\u0441\\u043A\\u043E\\u043F\\u0438\\u0440\\u043E\\u0432\\u0430\\u043D\\u044B.\n#YMSE\nMessage.ClipboardCopyFail=\\u041F\\u0440\\u0438 \\u043A\\u043E\\u043F\\u0438\\u0440\\u043E\\u0432\\u0430\\u043D\\u0438\\u0438 \\u0441\\u0432\\u0435\\u0434\\u0435\\u043D\\u0438\\u0439 \\u043F\\u0440\\u043E\\u0438\\u0437\\u043E\\u0448\\u043B\\u0430 \\u043E\\u0448\\u0438\\u0431\\u043A\\u0430.\n#XMSG\nMessage.SpaceCreated=\\u041F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E \\u0441\\u043E\\u0437\\u0434\\u0430\\u043D\\u043E.\n\n#XMSG\nMessage.NavigationTargetError=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u0440\\u0430\\u0437\\u0432\\u0435\\u0440\\u043D\\u0443\\u0442\\u044C \\u0446\\u0435\\u043B\\u044C \\u043D\\u0430\\u0432\\u0438\\u0433\\u0430\\u0446\\u0438\\u0438.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=\\u041D\\u0435 \\u0443\\u0434\\u0430\\u043B\\u043E\\u0441\\u044C \\u0440\\u0430\\u0437\\u0432\\u0435\\u0440\\u043D\\u0443\\u0442\\u044C \\u0446\\u0435\\u043B\\u044C \\u043D\\u0430\\u0432\\u0438\\u0433\\u0430\\u0446\\u0438\\u0438 \\u0434\\u043B\\u044F \\u043F\\u043B\\u0438\\u0442\\u043A\\u0438\\: "{0}".\\n\\n\\u0421\\u043A\\u043E\\u0440\\u0435\\u0435 \\u0432\\u0441\\u0435\\u0433\\u043E, \\u044D\\u0442\\u043E \\u0432\\u044B\\u0437\\u0432\\u0430\\u043D\\u043E \\u043D\\u0435\\u043F\\u0440\\u0430\\u0432\\u0438\\u043B\\u044C\\u043D\\u043E\\u0439 \\u043A\\u043E\\u043D\\u0444\\u0438\\u0433\\u0443\\u0440\\u0430\\u0446\\u0438\\u0435\\u0439 \\u043A\\u043E\\u043D\\u0442\\u0435\\u043D\\u0442\\u0430 \\u043F\\u0430\\u043D\\u0435\\u043B\\u0438 \\u0437\\u0430\\u043F\\u0443\\u0441\\u043A\\u0430 SAP Fiori. \\u0412\\u0438\\u0437\\u0443\\u0430\\u043B\\u0438\\u0437\\u0430\\u0446\\u0438\\u044E \\u043D\\u0435\\u0432\\u043E\\u0437\\u043C\\u043E\\u0436\\u043D\\u043E \\u043E\\u0442\\u043A\\u0440\\u044B\\u0442\\u044C \\u0432 \\u043F\\u0440\\u0438\\u043B\\u043E\\u0436\\u0435\\u043D\\u0438\\u0438.\n#XMSG\nMessage.PageIsOutdated=\\u041D\\u043E\\u0432\\u0430\\u044F \\u0432\\u0435\\u0440\\u0441\\u0438\\u044F \\u044D\\u0442\\u043E\\u0439 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\\u044B \\u0443\\u0436\\u0435 \\u0441\\u043E\\u0445\\u0440\\u0430\\u043D\\u0435\\u043D\\u0430.\n#XMSG\nMessage.SaveChanges=\\u0421\\u043E\\u0445\\u0440\\u0430\\u043D\\u0438\\u0442\\u0435 \\u0441\\u0432\\u043E\\u0438 \\u0438\\u0437\\u043C\\u0435\\u043D\\u0435\\u043D\\u0438\\u044F.\n#XMSG\nMessage.NoSpaces=\\u041F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u0430 \\u043D\\u0435\\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u044B.\n#XMSG\nMessage.NoSpacesFound=\\u041F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u0430 \\u043D\\u0435 \\u043D\\u0430\\u0439\\u0434\\u0435\\u043D\\u044B. \\u0418\\u0437\\u043C\\u0435\\u043D\\u0438\\u0442\\u0435 \\u043A\\u0440\\u0438\\u0442\\u0435\\u0440\\u0438\\u0438 \\u043F\\u043E\\u0438\\u0441\\u043A\\u0430.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=\\u041D\\u043E\\u0432\\u043E\\u0435 \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E\n#XTIT\nDeleteDialog.Title=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C\n#XMSG\nDeleteDialog.Text=\\u0414\\u0435\\u0439\\u0441\\u0442\\u0432\\u0438\\u0442\\u0435\\u043B\\u044C\\u043D\\u043E \\u0443\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C \\u0432\\u044B\\u0431\\u0440\\u0430\\u043D\\u043D\\u043E\\u0435 \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E?\n#XBUT\nDeleteDialog.ConfirmButton=\\u0423\\u0434\\u0430\\u043B\\u0438\\u0442\\u044C\n#XTIT\nDeleteDialog.LockedTitle=\\u041F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E \\u0437\\u0430\\u0431\\u043B\\u043E\\u043A\\u0438\\u0440\\u043E\\u0432\\u0430\\u043D\\u043E\n#XMSG\nDeleteDialog.LockedText=\\u0412\\u044B\\u0431\\u0440\\u0430\\u043D\\u043D\\u043E\\u0435 \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E \\u0437\\u0430\\u0431\\u043B\\u043E\\u043A\\u0438\\u0440\\u043E\\u0432\\u0430\\u043D\\u043E \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u0435\\u043C "{0}".\n#XMSG\nDeleteDialog.TransportRequired=\\u0412\\u044B\\u0431\\u0435\\u0440\\u0438\\u0442\\u0435 \\u043F\\u0430\\u043A\\u0435\\u0442 \\u043F\\u0435\\u0440\\u0435\\u043D\\u043E\\u0441\\u0430 \\u0434\\u043B\\u044F \\u0443\\u0434\\u0430\\u043B\\u0435\\u043D\\u0438\\u044F \\u0432\\u044B\\u0431\\u0440\\u0430\\u043D\\u043D\\u043E\\u0433\\u043E \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u0430.\n\n#XMSG\nEditDialog.LockedText=\\u0412\\u044B\\u0431\\u0440\\u0430\\u043D\\u043D\\u043E\\u0435 \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E \\u0437\\u0430\\u0431\\u043B\\u043E\\u043A\\u0438\\u0440\\u043E\\u0432\\u0430\\u043D\\u043E \\u043F\\u043E\\u043B\\u044C\\u0437\\u043E\\u0432\\u0430\\u0442\\u0435\\u043B\\u0435\\u043C "{0}".\n#XMSG\nEditDialog.TransportRequired=\\u0412\\u044B\\u0431\\u0435\\u0440\\u0438\\u0442\\u0435 \\u043F\\u0430\\u043A\\u0435\\u0442 \\u043F\\u0435\\u0440\\u0435\\u043D\\u043E\\u0441\\u0430 \\u0434\\u043B\\u044F \\u0440\\u0435\\u0434\\u0430\\u043A\\u0442\\u0438\\u0440\\u043E\\u0432\\u0430\\u043D\\u0438\\u044F \\u0432\\u044B\\u0431\\u0440\\u0430\\u043D\\u043D\\u043E\\u0433\\u043E \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u0430.\n#XTIT\nEditDialog.Title=\\u0420\\u0435\\u0434\\u0430\\u043A\\u0442\\u0438\\u0440\\u043E\\u0432\\u0430\\u0442\\u044C \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=\\u042D\\u0442\\u043E \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E \\u0441\\u043E\\u0437\\u0434\\u0430\\u043D\\u043E \\u043D\\u0430 \\u044F\\u0437\\u044B\\u043A\\u0435 "{0}", \\u043D\\u043E \\u0432\\u044B \\u0432\\u044B\\u043F\\u043E\\u043B\\u043D\\u0438\\u043B\\u0438 \\u0432\\u0445\\u043E\\u0434 \\u043D\\u0430 \\u044F\\u0437\\u044B\\u043A\\u0435 "{1}". \\u0414\\u043B\\u044F \\u043F\\u0440\\u043E\\u0434\\u043E\\u043B\\u0436\\u0435\\u043D\\u0438\\u044F \\u0440\\u0430\\u0431\\u043E\\u0442\\u044B \\u0438\\u0437\\u043C\\u0435\\u043D\\u0438\\u0442\\u0435 \\u044F\\u0437\\u044B\\u043A \\u0432\\u0445\\u043E\\u0434\\u0430 \\u043D\\u0430 "{0}".\n\n#XTIT\nErrorDialog.Title=\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430\n\n#XTIT\nSpaceOverview.Title=\\u0412\\u0435\\u0434\\u0435\\u043D\\u0438\\u0435 \\u0441\\u0442\\u0440\\u0430\\u043D\\u0438\\u0446\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=\\u0424\\u043E\\u0440\\u043C\\u0430\\u0442\n\n#XTIT\nCopyDialog.Title=\\u0421\\u043A\\u043E\\u043F\\u0438\\u0440\\u043E\\u0432\\u0430\\u0442\\u044C \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=\\u0421\\u043A\\u043E\\u043F\\u0438\\u0440\\u043E\\u0432\\u0430\\u0442\\u044C "{0}"?\n#XFLD\nCopyDialog.NewID=\\u041A\\u043E\\u043F\\u0438\\u044F "{0}"\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=\\u041F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\\u043E \\u043D\\u0435 \\u043D\\u0430\\u0439\\u0434\\u0435\\u043D\\u043E.\n#XLNK\nErrorPage.Link=\\u0412\\u0435\\u0434\\u0435\\u043D\\u0438\\u0435 \\u043F\\u0440\\u043E\\u0441\\u0442\\u0440\\u0430\\u043D\\u0441\\u0442\\u0432\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_sh.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=Odr\\u017Eavaj mesta\n\n#XBUT\nButton.Add=Dodaj\n#XBUT\nButton.Cancel=Odustani\n#XBUT\nButton.Copy=Kopiraj\n#XBUT\nButton.Create=Kreiraj\n#XBUT\nButton.Delete=Izbri\\u0161i\n#XBUT\nButton.Edit=Uredi\n#XBUT\nButton.Save=Sa\\u010Duvaj\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowPages=Poka\\u017Ei stranice\n#XBUT\nButton.HidePages=Sakrij stranice\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=Problemi\\: {0}\n#XBUT\nButton.SortPages=Prebaci redosled re\\u0111anja stranica\n#XBUT\nButton.ShowDetails=Poka\\u017Ei detalje\n#XBUT\nButton.ErrorMsg=Poruke o gre\\u0161kama\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=Tra\\u017Ei\n#XTOL\nTooltip.SearchForTiles=Tra\\u017Ei mesta\n\n#XFLD\nLabel.SpaceID=ID mesta\n#XFLD\nLabel.Title=Naslov\n#XFLD\nLabel.WorkbenchRequest=Zahtev za radno okru\\u017Eenje\n#XFLD\nLabel.Package=Paket\n#XFLD\nLabel.TransportInformation=Informacije o prenosu\n#XFLD\nLabel.Details=Detalji\\:\n#XFLD\nLabel.ResponseCode=\\u0160ifra odgovora\\:\n#XFLD\nLabel.Description=Opis\n#XFLD\nLabel.CreatedByFullname=Kreirao\n#XFLD\nLabel.CreatedOn=Kreirano\n#XFLD\nLabel.ChangedByFullname=Promenio\n#XFLD\nLabel.ChangedOn=Promenjeno\n#XFLD\nLabel.PageTitle=Naslov stranice\n#XFLD\nLabel.AssignedRole=Dodeljena uloga\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=Naslov\n#XCOL\nColumn.SpaceDescription=Opis\n#XCOL\nColumn.SpacePackage=Paket\n#XCOL\nColumn.SpaceWorkbenchRequest=Zahtev za radno okru\\u017Eenje\n#XCOL\nColumn.SpaceCreatedBy=Kreirao\n#XCOL\nColumn.SpaceCreatedOn=Kreirano\n#XCOL\nColumn.SpaceChangedBy=Promenio\n#XCOL\nColumn.SpaceChangedOn=Promenjeno\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Naslov\n#XCOL\nColumn.PageDescription=Opis\n#XCOL\nColumn.PagePackage=Paket\n#XCOL\nColumn.PageWorkbenchRequest=Zahtev za radno okru\\u017Eenje\n#XCOL\nColumn.PageCreatedBy=Kreirao\n#XCOL\nColumn.PageCreatedOn=Kreirano\n#XCOL\nColumn.PageChangedBy=Promenio\n#XCOL\nColumn.PageChangedOn=Promenjeno\n\n#XTOL\nPlaceholder.CopySpaceTitle=Kopija "{0}"\n#XTOL\nPlaceholder.CopySpaceID=Kopija "{0}"\n\n#XMSG\nMessage.NoInternetConnection=Proverite internet vezu.\n#XMSG\nMessage.SavedChanges=Va\\u0161e promene su sa\\u010Duvane.\n#XMSG\nMessage.InvalidPageID=Koristite samo slede\\u0107e znakove\\: A-Z, 0-9, _ i /. ID stranice ne sme po\\u010Dinjati brojem.\n#XMSG\nMessage.EmptySpaceID=Navedite va\\u017Ee\\u0107i ID mesta.\n#XMSG\nMessage.EmptyTitle=Navedite va\\u017Ee\\u0107i naslov.\n#XMSG\nMessage.SuccessDeletePage=Odabrani objekat je izbrisan.\n#XMSG\nMessage.ClipboardCopySuccess=Detalji su uspe\\u0161no kopirani.\n#YMSE\nMessage.ClipboardCopyFail=Gre\\u0161ka pri kopiranju detalja.\n#XMSG\nMessage.SpaceCreated=Mesto je kreirano.\n\n#XMSG\nMessage.NavigationTargetError=Cilj usmeravanja se ne mo\\u017Ee razre\\u0161iti.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=Nije mogu\\u0107e razre\\u0161iti cilj usmeravanja podekrana\\: "{0}".\\n\\nNajverovatniji uzrok je neta\\u010Dna konfiguracija sadr\\u017Eaja SAP Fiori launchpad-a Vizualizacija ne mo\\u017Ee da otvori aplikaciju.\n#XMSG\nMessage.PageIsOutdated=Novija verzija ove stranice je ve\\u0107 sa\\u010Duvana.\n#XMSG\nMessage.SaveChanges=Sa\\u010Duvajte svoje promene.\n#XMSG\nMessage.NoSpaces=Mesta nisu dostupna.\n#XMSG\nMessage.NoSpacesFound=Mesta nisu na\\u0111ena. Poku\\u0161ajte da prilagodite tra\\u017Eenje.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=Novo mesto\n#XTIT\nDeleteDialog.Title=Izbri\\u0161i\n#XMSG\nDeleteDialog.Text=Da li sigurno \\u017Eelite da izbri\\u0161ete odabrano mesto?\n#XBUT\nDeleteDialog.ConfirmButton=Izbri\\u0161i\n#XTIT\nDeleteDialog.LockedTitle=Mesto zaklju\\u010Dano\n#XMSG\nDeleteDialog.LockedText=Odabrano mesto je zaklju\\u010Dao korisnik "{0}".\n#XMSG\nDeleteDialog.TransportRequired=Odaberite paket za transport za brisanje odabranog mesta.\n\n#XMSG\nEditDialog.LockedText=Odabrano mesto je zaklju\\u010Dao korisnik "{0}".\n#XMSG\nEditDialog.TransportRequired=Odaberite paket za transport za ure\\u0111ivanje odabranog mesta.\n#XTIT\nEditDialog.Title=Uredi mesto\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=Ovo mesto je kreirano na jeziku "{0}", a va\\u0161 jezik prijave je postavljen na "{1}". Za nastavak promenite jezik prijave na "{0}".\n\n#XTIT\nErrorDialog.Title=Gre\\u0161ka\n\n#XTIT\nSpaceOverview.Title=Odr\\u017Eavaj stranice\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=Izgled\n\n#XTIT\nCopyDialog.Title=Kopiraj mesto\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=Da li \\u017Eelite da kopirate "{0}"?\n#XFLD\nCopyDialog.NewID=Kopija "{0}"\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=Na\\u017Ealost, nismo na\\u0161li ovo mesto.\n#XLNK\nErrorPage.Link=Odr\\u017Eavaj mesta\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_sk.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=\\u00DAdr\\u017Eba priestorov\n\n#XBUT\nButton.Add=Prida\\u0165\n#XBUT\nButton.Cancel=Zru\\u0161i\\u0165\n#XBUT\nButton.Copy=Kop\\u00EDrova\\u0165\n#XBUT\nButton.Create=Vytvori\\u0165\n#XBUT\nButton.Delete=Vymaza\\u0165\n#XBUT\nButton.Edit=Upravi\\u0165\n#XBUT\nButton.Save=Ulo\\u017Ei\\u0165\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowPages=Zobrazi\\u0165 str\\u00E1nky\n#XBUT\nButton.HidePages=Skry\\u0165 str\\u00E1nky\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=Probl\\u00E9my\\: {0}\n#XBUT\nButton.SortPages=Prepn\\u00FA\\u0165 poradie triedenia str\\u00E1nok\n#XBUT\nButton.ShowDetails=Zobrazi\\u0165 detaily\n#XBUT\nButton.ErrorMsg=Chybov\\u00E9 hl\\u00E1senia\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=H\\u013Eada\\u0165\n#XTOL\nTooltip.SearchForTiles=H\\u013Eada\\u0165 priestory\n\n#XFLD\nLabel.SpaceID=ID priestoru\n#XFLD\nLabel.Title=Nadpis\n#XFLD\nLabel.WorkbenchRequest=Po\\u017Eiadavka na workbench\n#XFLD\nLabel.Package=Paket\n#XFLD\nLabel.TransportInformation=Inform\\u00E1cie o transporte\n#XFLD\nLabel.Details=Detaily\\:\n#XFLD\nLabel.ResponseCode=K\\u00F3d odpovede\\:\n#XFLD\nLabel.Description=Popis\n#XFLD\nLabel.CreatedByFullname=Vytvoril\n#XFLD\nLabel.CreatedOn=Vytvoren\\u00E9 d\\u0148a\n#XFLD\nLabel.ChangedByFullname=Zmenil\n#XFLD\nLabel.ChangedOn=Zmenen\\u00E9 d\\u0148a\n#XFLD\nLabel.PageTitle=Nadpis str\\u00E1nky\n#XFLD\nLabel.AssignedRole=Priraden\\u00E1 rola\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=Nadpis\n#XCOL\nColumn.SpaceDescription=Popis\n#XCOL\nColumn.SpacePackage=Paket\n#XCOL\nColumn.SpaceWorkbenchRequest=Po\\u017Eiadavka na workbench\n#XCOL\nColumn.SpaceCreatedBy=Vytvoril\n#XCOL\nColumn.SpaceCreatedOn=Vytvoren\\u00E9 d\\u0148a\n#XCOL\nColumn.SpaceChangedBy=Zmenil\n#XCOL\nColumn.SpaceChangedOn=Zmenen\\u00E9 d\\u0148a\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Nadpis\n#XCOL\nColumn.PageDescription=Popis\n#XCOL\nColumn.PagePackage=Paket\n#XCOL\nColumn.PageWorkbenchRequest=Po\\u017Eiadavka na workbench\n#XCOL\nColumn.PageCreatedBy=Vytvoril\n#XCOL\nColumn.PageCreatedOn=Vytvoren\\u00E9 d\\u0148a\n#XCOL\nColumn.PageChangedBy=Zmenil\n#XCOL\nColumn.PageChangedOn=Zmenen\\u00E9 d\\u0148a\n\n#XTOL\nPlaceholder.CopySpaceTitle=K\\u00F3pia "{0}"\n#XTOL\nPlaceholder.CopySpaceID=K\\u00F3pia "{0}"\n\n#XMSG\nMessage.NoInternetConnection=Skontrolujte internetov\\u00E9 pripojenie.\n#XMSG\nMessage.SavedChanges=Va\\u0161e zmeny boli ulo\\u017Een\\u00E9.\n#XMSG\nMessage.InvalidPageID=Pou\\u017Eite len nasledovn\\u00E9 znaky\\: A-Z, 0-9, _ a /. ID str\\u00E1nky nem\\u00E1 za\\u010D\\u00EDna\\u0165 \\u010D\\u00EDslom.\n#XMSG\nMessage.EmptySpaceID=Zadajte platn\\u00E9 ID priestoru.\n#XMSG\nMessage.EmptyTitle=Zadajte platn\\u00FD nadpis.\n#XMSG\nMessage.SuccessDeletePage=Zvolen\\u00FD objekt bol vymazan\\u00FD.\n#XMSG\nMessage.ClipboardCopySuccess=Detaily boli \\u00FAspe\\u0161ne skop\\u00EDrovan\\u00E9.\n#YMSE\nMessage.ClipboardCopyFail=Pri kop\\u00EDrovan\\u00ED detailov sa vyskytla chyba.\n#XMSG\nMessage.SpaceCreated=Priestor bol vytvoren\\u00FD.\n\n#XMSG\nMessage.NavigationTargetError=Cie\\u013E navig\\u00E1cie sa nepodarilo rozpozna\\u0165.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=Nepodarilo sa rozpozna\\u0165 cie\\u013E navig\\u00E1cie pre dla\\u017Edicu\\: "{0}".\\n\\nJe to pravdepodobne sp\\u00F4soben\\u00E9 nespr\\u00E1vnou konfigur\\u00E1ciou obsahu launchpadu SAP Fiori. Vizualiz\\u00E1cia nem\\u00F4\\u017Ee otvori\\u0165 aplik\\u00E1ciu.\n#XMSG\nMessage.PageIsOutdated=Nov\\u0161ia verzia tejto str\\u00E1nky u\\u017E bola ulo\\u017Een\\u00E1.\n#XMSG\nMessage.SaveChanges=Ulo\\u017Ete svoje zmeny.\n#XMSG\nMessage.NoSpaces=K dispoz\\u00EDcii nie s\\u00FA \\u017Eiadne priestory.\n#XMSG\nMessage.NoSpacesFound=Nena\\u0161li sa \\u017Eiadne priestory. Sk\\u00FAste upravi\\u0165 svoje h\\u013Eadanie.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=Nov\\u00FD priestor\n#XTIT\nDeleteDialog.Title=Vymaza\\u0165\n#XMSG\nDeleteDialog.Text=Naozaj chcete vybrat\\u00FD priestor vymaza\\u0165?\n#XBUT\nDeleteDialog.ConfirmButton=Vymaza\\u0165\n#XTIT\nDeleteDialog.LockedTitle=Priestor blokovan\\u00FD\n#XMSG\nDeleteDialog.LockedText=Vybrat\\u00FD priestor blokuje pou\\u017E\\u00EDvate\\u013E "{0}".\n#XMSG\nDeleteDialog.TransportRequired=Ak chcete vybrat\\u00FD priestor vymaza\\u0165, vyberte transportn\\u00FD paket.\n\n#XMSG\nEditDialog.LockedText=Vybrat\\u00FD priestor blokuje pou\\u017E\\u00EDvate\\u013E "{0}".\n#XMSG\nEditDialog.TransportRequired=Ak chcete vybrat\\u00FD priestor upravi\\u0165, vyberte transportn\\u00FD paket.\n#XTIT\nEditDialog.Title=Upravi\\u0165 priestor\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=Tento priestor bol vytvoren\\u00FD v jazyku "{0}", ale v\\u00E1\\u0161 prihlasovac\\u00ED jazyk je nastaven\\u00FD na "{1}". Ak chcete pokra\\u010Dova\\u0165, zme\\u0148te svoj prihlasovac\\u00ED jazyk na "{0}".\n\n#XTIT\nErrorDialog.Title=Chyba\n\n#XTIT\nSpaceOverview.Title=\\u00DAdr\\u017Eba str\\u00E1nok\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=Rozlo\\u017Eenie\n\n#XTIT\nCopyDialog.Title=Kop\\u00EDrova\\u0165 priestor\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=Chcete kop\\u00EDrova\\u0165 "{0}"?\n#XFLD\nCopyDialog.NewID=K\\u00F3pia "{0}"\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=\\u013Dutujeme, tento priestor sa n\\u00E1m nepodarilo n\\u00E1js\\u0165.\n#XLNK\nErrorPage.Link=\\u00DAdr\\u017Eba priestorov\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_sl.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=Vzdr\\u017Euj prostore\n\n#XBUT\nButton.Add=Dodaj\n#XBUT\nButton.Cancel=Preklic\n#XBUT\nButton.Copy=Kopiranje\n#XBUT\nButton.Create=Kreiraj\n#XBUT\nButton.Delete=Brisanje\n#XBUT\nButton.Edit=Urejanje\n#XBUT\nButton.Save=Shranjevanje\n#XBUT\nButton.Ok=V redu\n#XBUT\nButton.ShowPages=Skrij strani\n#XBUT\nButton.HidePages=Prika\\u017Ei strani\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=Te\\u017Eave\\: {0}\n#XBUT\nButton.SortPages=Preklop zaporedja razvr\\u0161\\u010Danja strani\n#XBUT\nButton.ShowDetails=Poka\\u017Ei podrobnosti\n#XBUT\nButton.ErrorMsg=Sporo\\u010Dila o napakah\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=I\\u0161\\u010Di\n#XTOL\nTooltip.SearchForTiles=I\\u0161\\u010Di prostore\n\n#XFLD\nLabel.SpaceID=ID prostora\n#XFLD\nLabel.Title=Naziv\n#XFLD\nLabel.WorkbenchRequest=Zahteva za Workbench\n#XFLD\nLabel.Package=Paket\n#XFLD\nLabel.TransportInformation=Informacije o transportu\n#XFLD\nLabel.Details=Detajli\\:\n#XFLD\nLabel.ResponseCode=Koda odgovora\\:\n#XFLD\nLabel.Description=Opis\n#XFLD\nLabel.CreatedByFullname=Kreiral\n#XFLD\nLabel.CreatedOn=Kreirano dne\n#XFLD\nLabel.ChangedByFullname=Spremenil\n#XFLD\nLabel.ChangedOn=Spremenjeno dne\n#XFLD\nLabel.PageTitle=Naslov strani\n#XFLD\nLabel.AssignedRole=Dodeljena vloga\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=Naslov\n#XCOL\nColumn.SpaceDescription=Opis\n#XCOL\nColumn.SpacePackage=Paket\n#XCOL\nColumn.SpaceWorkbenchRequest=Zahteva za Workbench\n#XCOL\nColumn.SpaceCreatedBy=Kreiral\n#XCOL\nColumn.SpaceCreatedOn=Kreirano dne\n#XCOL\nColumn.SpaceChangedBy=Spremenil\n#XCOL\nColumn.SpaceChangedOn=Spremenjeno dne\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Naslov\n#XCOL\nColumn.PageDescription=Opis\n#XCOL\nColumn.PagePackage=Paket\n#XCOL\nColumn.PageWorkbenchRequest=Zahteva za Workbench\n#XCOL\nColumn.PageCreatedBy=Kreiral\n#XCOL\nColumn.PageCreatedOn=Kreirano dne\n#XCOL\nColumn.PageChangedBy=Spremenil\n#XCOL\nColumn.PageChangedOn=Spremenjeno dne\n\n#XTOL\nPlaceholder.CopySpaceTitle=Kopija "{0}"\n#XTOL\nPlaceholder.CopySpaceID=Kopija "{0}"\n\n#XMSG\nMessage.NoInternetConnection=Prosim, preverite svojo internetno povezavo.\n#XMSG\nMessage.SavedChanges=Va\\u0161e spremembe so bile shranjene.\n#XMSG\nMessage.InvalidPageID=Prosim, uporabite le naslednje znake\\: A-Z a-z 0-9 _ in /. ID strani se ne sme za\\u010Deti s \\u0161tevilko.\n#XMSG\nMessage.EmptySpaceID=Navedite veljaven ID prostora.\n#XMSG\nMessage.EmptyTitle=Prosim, navedite veljaven naslov.\n#XMSG\nMessage.SuccessDeletePage=Izbrani objekt je bil izbrisan.\n#XMSG\nMessage.ClipboardCopySuccess=Detajli so bili uspe\\u0161no kopirani.\n#YMSE\nMessage.ClipboardCopyFail=Pri kopiranju detajlov je pri\\u0161lo do napake.\n#XMSG\nMessage.SpaceCreated=Prostor je bil kreiran.\n\n#XMSG\nMessage.NavigationTargetError=Cilja navigacije ni bilo mogo\\u010De razre\\u0161iti.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=Navigacije do cilja plo\\u0161\\u010Dice ni bilo mogo\\u010De razre\\u0161iti\\: "{0}".\\n\\nRazlog je verjetno nepravilna konfiguracija vsebine SAP Fiori Launchpada. Vizualizacija ne bo vidna uporabniku.\n#XMSG\nMessage.PageIsOutdated=Novej\\u0161a verzija te strani je bila \\u017Ee shranjena.\n#XMSG\nMessage.SaveChanges=Prosim, shranite svoje spremembe.\n#XMSG\nMessage.NoSpaces=Prostori niso na voljo.\n#XMSG\nMessage.NoSpacesFound=Prostori niso najdeni. Poskusite prilagoditi svoje iskanje.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=Nov prostor\n#XTIT\nDeleteDialog.Title=Izbri\\u0161i\n#XMSG\nDeleteDialog.Text=Res \\u017Eelite izbrisati izbrane prostore?\n#XBUT\nDeleteDialog.ConfirmButton=Izbri\\u0161i\n#XTIT\nDeleteDialog.LockedTitle=Prostor blokiran\n#XMSG\nDeleteDialog.LockedText=Izbrani prostor je blokiral uporabnik "{0}".\n#XMSG\nDeleteDialog.TransportRequired=Prosim, izberite transportni paket za brisanje izbranega prostora.\n\n#XMSG\nEditDialog.LockedText=Izbrani prostor je blokiral uporabnik "{0}".\n#XMSG\nEditDialog.TransportRequired=Prosim, izberite transportni paket za urejanje izbranega prostora.\n#XTIT\nEditDialog.Title=Uredi prostor\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=Ta prostor je bil kreiran v jeziku "{0}", jezik prijave pa je nastavljen na "{1}". Za nadaljevanje spremenite jezik prijave na "{0}".\n\n#XTIT\nErrorDialog.Title=Napaka\n\n#XTIT\nSpaceOverview.Title=Vzdr\\u017Eevanje strani\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=Izgled\n\n#XTIT\nCopyDialog.Title=Kopiraj prostor\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=\\u017Delite kopirati "{0}"?\n#XFLD\nCopyDialog.NewID=Kopija "{0}"\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=Tega prostora ni mogo\\u010De najti.\n#XLNK\nErrorPage.Link=Vzdr\\u017Euj prostore\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_sv.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=Underh\\u00E5ll omr\\u00E5den\n\n#XBUT\nButton.Add=L\\u00E4gg till\n#XBUT\nButton.Cancel=Avbryt\n#XBUT\nButton.Copy=Kopiera\n#XBUT\nButton.Create=Skapa\n#XBUT\nButton.Delete=Radera\n#XBUT\nButton.Edit=Bearbeta\n#XBUT\nButton.Save=Spara\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowPages=Visa sidor\n#XBUT\nButton.HidePages=D\\u00F6lj sidor\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=Problem\\: {0}\n#XBUT\nButton.SortPages=V\\u00E4xla sorteringsf\\u00F6ljd f\\u00F6r sidor\n#XBUT\nButton.ShowDetails=Visa detaljer\n#XBUT\nButton.ErrorMsg=Felmeddelanden\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=S\\u00F6k\n#XTOL\nTooltip.SearchForTiles=S\\u00F6k omr\\u00E5den\n\n#XFLD\nLabel.SpaceID=Omr\\u00E5des-ID\n#XFLD\nLabel.Title=Rubrik\n#XFLD\nLabel.WorkbenchRequest=Workbenchorder\n#XFLD\nLabel.Package=Paket\n#XFLD\nLabel.TransportInformation=Transportinformation\n#XFLD\nLabel.Details=Detaljer\\:\n#XFLD\nLabel.ResponseCode=Svarskod\\:\n#XFLD\nLabel.Description=Beskrivning\n#XFLD\nLabel.CreatedByFullname=Uppl\\u00E4ggning av\n#XFLD\nLabel.CreatedOn=Uppl\\u00E4ggning den\n#XFLD\nLabel.ChangedByFullname=\\u00C4ndring av\n#XFLD\nLabel.ChangedOn=\\u00C4ndring den\n#XFLD\nLabel.PageTitle=Sidrubrik\n#XFLD\nLabel.AssignedRole=Allokerad roll\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=Rubrik\n#XCOL\nColumn.SpaceDescription=Beskrivning\n#XCOL\nColumn.SpacePackage=Paket\n#XCOL\nColumn.SpaceWorkbenchRequest=Workbenchorder\n#XCOL\nColumn.SpaceCreatedBy=Uppl\\u00E4ggning av\n#XCOL\nColumn.SpaceCreatedOn=Uppl\\u00E4ggning den\n#XCOL\nColumn.SpaceChangedBy=\\u00C4ndring av\n#XCOL\nColumn.SpaceChangedOn=\\u00C4ndring den\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Rubrik\n#XCOL\nColumn.PageDescription=Beskrivning\n#XCOL\nColumn.PagePackage=Paket\n#XCOL\nColumn.PageWorkbenchRequest=Workbenchorder\n#XCOL\nColumn.PageCreatedBy=Uppl\\u00E4ggning av\n#XCOL\nColumn.PageCreatedOn=Uppl\\u00E4ggning den\n#XCOL\nColumn.PageChangedBy=\\u00C4ndring av\n#XCOL\nColumn.PageChangedOn=\\u00C4ndring den\n\n#XTOL\nPlaceholder.CopySpaceTitle=Kopia av "{0}"\n#XTOL\nPlaceholder.CopySpaceID=Kopia av "{0}"\n\n#XMSG\nMessage.NoInternetConnection=Kontrollera internetuppkopplingen.\n#XMSG\nMessage.SavedChanges=\\u00C4ndringar har sparats.\n#XMSG\nMessage.InvalidPageID=Anv\\u00E4nd endast f\\u00F6ljande tecken\\: A-Z, 0-9, _ och /. Sid-ID f\\u00E5r inte b\\u00F6rja med en siffra.\n#XMSG\nMessage.EmptySpaceID=Ange giltig omr\\u00E5des-ID.\n#XMSG\nMessage.EmptyTitle=Ange en giltig rubrik.\n#XMSG\nMessage.SuccessDeletePage=Valt objekt har raderats.\n#XMSG\nMessage.ClipboardCopySuccess=Detaljer har kopierats.\n#YMSE\nMessage.ClipboardCopyFail=Ett fel intr\\u00E4ffade vid kopiering av detaljer.\n#XMSG\nMessage.SpaceCreated=Omr\\u00E5det har skapats.\n\n#XMSG\nMessage.NavigationTargetError=Navigeringsm\\u00E5l kunde inte \\u00E5tg\\u00E4rdas.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=Navigeringsm\\u00E5l f\\u00F6r panel "{0}" kunde inte \\u00E5tg\\u00E4rdas.\\n\\nDetta beror troligen p\\u00E5 en felaktig inneh\\u00E5llskonfiguration f\\u00F6r SAP Fiori-launchpad. Visualiseringen kan inte \\u00F6ppna en applikation.\n#XMSG\nMessage.PageIsOutdated=En nyare version av denna sida har redan sparats.\n#XMSG\nMessage.SaveChanges=Spara dina \\u00E4ndringar.\n#XMSG\nMessage.NoSpaces=Inga tillg\\u00E4ngliga omr\\u00E5den.\n#XMSG\nMessage.NoSpacesFound=Inga omr\\u00E5den hittades. Pr\\u00F6va att anpassa s\\u00F6kningen.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=Nytt omr\\u00E5de\n#XTIT\nDeleteDialog.Title=Radera\n#XMSG\nDeleteDialog.Text=Ska valt omr\\u00E5de raderas?\n#XBUT\nDeleteDialog.ConfirmButton=Radera\n#XTIT\nDeleteDialog.LockedTitle=Omr\\u00E5de har sp\\u00E4rrats\n#XMSG\nDeleteDialog.LockedText=Valt omr\\u00E5de sp\\u00E4rras av anv\\u00E4ndare "{0}".\n#XMSG\nDeleteDialog.TransportRequired=V\\u00E4lj ett transportpaket f\\u00F6r att radera valt omr\\u00E5de.\n\n#XMSG\nEditDialog.LockedText=Valt omr\\u00E5de sp\\u00E4rras av anv\\u00E4ndare "{0}".\n#XMSG\nEditDialog.TransportRequired=V\\u00E4lj ett transportpaket f\\u00F6r att bearbeta valt omr\\u00E5de.\n#XTIT\nEditDialog.Title=Bearbeta omr\\u00E5de\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=Omr\\u00E5det har skapats p\\u00E5 "{0}" men ditt inloggningsspr\\u00E5k \\u00E4r "{1}". \\u00C4ndra ditt inloggningsspr\\u00E5k till "{0}" f\\u00F6r att forts\\u00E4tta.\n\n#XTIT\nErrorDialog.Title=Fel\n\n#XTIT\nSpaceOverview.Title=Underh\\u00E5ll sidor\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=Layout\n\n#XTIT\nCopyDialog.Title=Kopiera omr\\u00E5de\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=Ska "{0}" kopieras?\n#XFLD\nCopyDialog.NewID=Kopia av "{0}"\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=Omr\\u00E5det kunde inte hittas.\n#XLNK\nErrorPage.Link=Underh\\u00E5ll omr\\u00E5den\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_th.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=\\u0E1B\\u0E23\\u0E31\\u0E1A\\u0E1B\\u0E23\\u0E38\\u0E07\\u0E1E\\u0E37\\u0E49\\u0E19\\u0E17\\u0E35\\u0E48\n\n#XBUT\nButton.Add=\\u0E40\\u0E1E\\u0E34\\u0E48\\u0E21\n#XBUT\nButton.Cancel=\\u0E22\\u0E01\\u0E40\\u0E25\\u0E34\\u0E01\n#XBUT\nButton.Copy=\\u0E04\\u0E31\\u0E14\\u0E25\\u0E2D\\u0E01\n#XBUT\nButton.Create=\\u0E2A\\u0E23\\u0E49\\u0E32\\u0E07\n#XBUT\nButton.Delete=\\u0E25\\u0E1A\n#XBUT\nButton.Edit=\\u0E41\\u0E01\\u0E49\\u0E44\\u0E02\n#XBUT\nButton.Save=\\u0E40\\u0E01\\u0E47\\u0E1A\\u0E1A\\u0E31\\u0E19\\u0E17\\u0E36\\u0E01\n#XBUT\nButton.Ok=\\u0E15\\u0E01\\u0E25\\u0E07\n#XBUT\nButton.ShowPages=\\u0E41\\u0E2A\\u0E14\\u0E07\\u0E2B\\u0E19\\u0E49\\u0E32\n#XBUT\nButton.HidePages=\\u0E0B\\u0E48\\u0E2D\\u0E19\\u0E2B\\u0E19\\u0E49\\u0E32\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=\\u0E1B\\u0E31\\u0E0D\\u0E2B\\u0E32\\: {0}\n#XBUT\nButton.SortPages=\\u0E2A\\u0E25\\u0E31\\u0E1A\\u0E25\\u0E33\\u0E14\\u0E31\\u0E1A\\u0E01\\u0E32\\u0E23\\u0E08\\u0E31\\u0E14\\u0E40\\u0E23\\u0E35\\u0E22\\u0E07\\u0E2B\\u0E19\\u0E49\\u0E32\n#XBUT\nButton.ShowDetails=\\u0E41\\u0E2A\\u0E14\\u0E07\\u0E23\\u0E32\\u0E22\\u0E25\\u0E30\\u0E40\\u0E2D\\u0E35\\u0E22\\u0E14\n#XBUT\nButton.ErrorMsg=\\u0E02\\u0E49\\u0E2D\\u0E04\\u0E27\\u0E32\\u0E21\\u0E41\\u0E2A\\u0E14\\u0E07\\u0E02\\u0E49\\u0E2D\\u0E1C\\u0E34\\u0E14\\u0E1E\\u0E25\\u0E32\\u0E14\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=\\u0E04\\u0E49\\u0E19\\u0E2B\\u0E32\n#XTOL\nTooltip.SearchForTiles=\\u0E04\\u0E49\\u0E19\\u0E2B\\u0E32\\u0E1E\\u0E37\\u0E49\\u0E19\\u0E17\\u0E35\\u0E48\n\n#XFLD\nLabel.SpaceID=ID \\u0E1E\\u0E37\\u0E49\\u0E19\\u0E17\\u0E35\\u0E48\n#XFLD\nLabel.Title=\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E40\\u0E23\\u0E37\\u0E48\\u0E2D\\u0E07\n#XFLD\nLabel.WorkbenchRequest=\\u0E04\\u0E33\\u0E02\\u0E2D Workbench\n#XFLD\nLabel.Package=\\u0E41\\u0E1E\\u0E04\\u0E40\\u0E01\\u0E08\n#XFLD\nLabel.TransportInformation=\\u0E02\\u0E49\\u0E2D\\u0E21\\u0E39\\u0E25\\u0E01\\u0E32\\u0E23\\u0E17\\u0E23\\u0E32\\u0E19\\u0E2A\\u0E1B\\u0E2D\\u0E23\\u0E4C\\u0E15\n#XFLD\nLabel.Details=\\u0E23\\u0E32\\u0E22\\u0E25\\u0E30\\u0E40\\u0E2D\\u0E35\\u0E22\\u0E14\\:\n#XFLD\nLabel.ResponseCode=\\u0E23\\u0E2B\\u0E31\\u0E2A\\u0E01\\u0E32\\u0E23\\u0E15\\u0E2D\\u0E1A\\u0E2A\\u0E19\\u0E2D\\u0E07\\:\n#XFLD\nLabel.Description=\\u0E04\\u0E33\\u0E2D\\u0E18\\u0E34\\u0E1A\\u0E32\\u0E22\n#XFLD\nLabel.CreatedByFullname=\\u0E2A\\u0E23\\u0E49\\u0E32\\u0E07\\u0E42\\u0E14\\u0E22\n#XFLD\nLabel.CreatedOn=\\u0E2A\\u0E23\\u0E49\\u0E32\\u0E07\\u0E40\\u0E21\\u0E37\\u0E48\\u0E2D\n#XFLD\nLabel.ChangedByFullname=\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E41\\u0E1B\\u0E25\\u0E07\\u0E42\\u0E14\\u0E22\n#XFLD\nLabel.ChangedOn=\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E41\\u0E1B\\u0E25\\u0E07\\u0E40\\u0E21\\u0E37\\u0E48\\u0E2D\n#XFLD\nLabel.PageTitle=\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E2B\\u0E19\\u0E49\\u0E32\n#XFLD\nLabel.AssignedRole=\\u0E1A\\u0E17\\u0E1A\\u0E32\\u0E17\\u0E17\\u0E35\\u0E48\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E40\\u0E23\\u0E37\\u0E48\\u0E2D\\u0E07\n#XCOL\nColumn.SpaceDescription=\\u0E04\\u0E33\\u0E2D\\u0E18\\u0E34\\u0E1A\\u0E32\\u0E22\n#XCOL\nColumn.SpacePackage=\\u0E41\\u0E1E\\u0E04\\u0E40\\u0E01\\u0E08\n#XCOL\nColumn.SpaceWorkbenchRequest=\\u0E04\\u0E33\\u0E02\\u0E2D Workbench\n#XCOL\nColumn.SpaceCreatedBy=\\u0E2A\\u0E23\\u0E49\\u0E32\\u0E07\\u0E42\\u0E14\\u0E22\n#XCOL\nColumn.SpaceCreatedOn=\\u0E2A\\u0E23\\u0E49\\u0E32\\u0E07\\u0E40\\u0E21\\u0E37\\u0E48\\u0E2D\n#XCOL\nColumn.SpaceChangedBy=\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E41\\u0E1B\\u0E25\\u0E07\\u0E42\\u0E14\\u0E22\n#XCOL\nColumn.SpaceChangedOn=\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E41\\u0E1B\\u0E25\\u0E07\\u0E40\\u0E21\\u0E37\\u0E48\\u0E2D\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E40\\u0E23\\u0E37\\u0E48\\u0E2D\\u0E07\n#XCOL\nColumn.PageDescription=\\u0E04\\u0E33\\u0E2D\\u0E18\\u0E34\\u0E1A\\u0E32\\u0E22\n#XCOL\nColumn.PagePackage=\\u0E41\\u0E1E\\u0E04\\u0E40\\u0E01\\u0E08\n#XCOL\nColumn.PageWorkbenchRequest=\\u0E04\\u0E33\\u0E02\\u0E2D Workbench\n#XCOL\nColumn.PageCreatedBy=\\u0E2A\\u0E23\\u0E49\\u0E32\\u0E07\\u0E42\\u0E14\\u0E22\n#XCOL\nColumn.PageCreatedOn=\\u0E2A\\u0E23\\u0E49\\u0E32\\u0E07\\u0E40\\u0E21\\u0E37\\u0E48\\u0E2D\n#XCOL\nColumn.PageChangedBy=\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E41\\u0E1B\\u0E25\\u0E07\\u0E42\\u0E14\\u0E22\n#XCOL\nColumn.PageChangedOn=\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E41\\u0E1B\\u0E25\\u0E07\\u0E40\\u0E21\\u0E37\\u0E48\\u0E2D\n\n#XTOL\nPlaceholder.CopySpaceTitle=\\u0E2A\\u0E33\\u0E40\\u0E19\\u0E32\\u0E02\\u0E2D\\u0E07 "{0}"\n#XTOL\nPlaceholder.CopySpaceID=\\u0E2A\\u0E33\\u0E40\\u0E19\\u0E32\\u0E02\\u0E2D\\u0E07 "{0}"\n\n#XMSG\nMessage.NoInternetConnection=\\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E15\\u0E23\\u0E27\\u0E08\\u0E2A\\u0E2D\\u0E1A\\u0E01\\u0E32\\u0E23\\u0E40\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E21\\u0E15\\u0E48\\u0E2D\\u0E2D\\u0E34\\u0E19\\u0E40\\u0E15\\u0E2D\\u0E23\\u0E4C\\u0E40\\u0E19\\u0E47\\u0E15\\u0E02\\u0E2D\\u0E07\\u0E04\\u0E38\\u0E13\n#XMSG\nMessage.SavedChanges=\\u0E01\\u0E32\\u0E23\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E41\\u0E1B\\u0E25\\u0E07\\u0E02\\u0E2D\\u0E07\\u0E04\\u0E38\\u0E13\\u0E16\\u0E39\\u0E01\\u0E40\\u0E01\\u0E47\\u0E1A\\u0E1A\\u0E31\\u0E19\\u0E17\\u0E36\\u0E01\\u0E41\\u0E25\\u0E49\\u0E27\n#XMSG\nMessage.InvalidPageID=\\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E43\\u0E0A\\u0E49\\u0E2D\\u0E31\\u0E01\\u0E02\\u0E23\\u0E30\\u0E15\\u0E48\\u0E2D\\u0E44\\u0E1B\\u0E19\\u0E35\\u0E49\\u0E40\\u0E17\\u0E48\\u0E32\\u0E19\\u0E31\\u0E49\\u0E19\\: A-Z a-z 0-9 _ / \\u0E41\\u0E25\\u0E30 ID \\u0E2B\\u0E19\\u0E49\\u0E32\\u0E15\\u0E49\\u0E2D\\u0E07\\u0E44\\u0E21\\u0E48\\u0E02\\u0E36\\u0E49\\u0E19\\u0E15\\u0E49\\u0E19\\u0E14\\u0E49\\u0E27\\u0E22\\u0E15\\u0E31\\u0E27\\u0E40\\u0E25\\u0E02\n#XMSG\nMessage.EmptySpaceID=\\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E1B\\u0E49\\u0E2D\\u0E19 ID \\u0E1E\\u0E37\\u0E49\\u0E19\\u0E17\\u0E35\\u0E48\\u0E17\\u0E35\\u0E48\\u0E16\\u0E39\\u0E01\\u0E15\\u0E49\\u0E2D\\u0E07\n#XMSG\nMessage.EmptyTitle=\\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E23\\u0E30\\u0E1A\\u0E38\\u0E0A\\u0E37\\u0E48\\u0E2D\\u0E40\\u0E23\\u0E37\\u0E48\\u0E2D\\u0E07\\u0E17\\u0E35\\u0E48\\u0E16\\u0E39\\u0E01\\u0E15\\u0E49\\u0E2D\\u0E07\n#XMSG\nMessage.SuccessDeletePage=\\u0E2D\\u0E2D\\u0E1A\\u0E40\\u0E08\\u0E04\\u0E17\\u0E35\\u0E48\\u0E40\\u0E25\\u0E37\\u0E2D\\u0E01\\u0E16\\u0E39\\u0E01\\u0E25\\u0E1A\\u0E41\\u0E25\\u0E49\\u0E27\n#XMSG\nMessage.ClipboardCopySuccess=\\u0E04\\u0E31\\u0E14\\u0E25\\u0E2D\\u0E01\\u0E23\\u0E32\\u0E22\\u0E25\\u0E30\\u0E40\\u0E2D\\u0E35\\u0E22\\u0E14\\u0E44\\u0E14\\u0E49\\u0E2A\\u0E33\\u0E40\\u0E23\\u0E47\\u0E08\n#YMSE\nMessage.ClipboardCopyFail=\\u0E21\\u0E35\\u0E02\\u0E49\\u0E2D\\u0E1C\\u0E34\\u0E14\\u0E1E\\u0E25\\u0E32\\u0E14\\u0E40\\u0E01\\u0E34\\u0E14\\u0E02\\u0E36\\u0E49\\u0E19\\u0E02\\u0E13\\u0E30\\u0E04\\u0E31\\u0E14\\u0E25\\u0E2D\\u0E01\\u0E23\\u0E32\\u0E22\\u0E25\\u0E30\\u0E40\\u0E2D\\u0E35\\u0E22\\u0E14\n#XMSG\nMessage.SpaceCreated=\\u0E2A\\u0E23\\u0E49\\u0E32\\u0E07\\u0E1E\\u0E37\\u0E49\\u0E19\\u0E17\\u0E35\\u0E48\\u0E41\\u0E25\\u0E49\\u0E27\n\n#XMSG\nMessage.NavigationTargetError=\\u0E44\\u0E21\\u0E48\\u0E2A\\u0E32\\u0E21\\u0E32\\u0E23\\u0E16\\u0E41\\u0E01\\u0E49\\u0E44\\u0E02\\u0E40\\u0E1B\\u0E49\\u0E32\\u0E2B\\u0E21\\u0E32\\u0E22\\u0E01\\u0E32\\u0E23\\u0E40\\u0E19\\u0E27\\u0E34\\u0E40\\u0E01\\u0E15\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=\\u0E44\\u0E21\\u0E48\\u0E2A\\u0E32\\u0E21\\u0E32\\u0E23\\u0E16\\u0E41\\u0E01\\u0E49\\u0E44\\u0E02\\u0E40\\u0E1B\\u0E49\\u0E32\\u0E2B\\u0E21\\u0E32\\u0E22\\u0E01\\u0E32\\u0E23\\u0E40\\u0E19\\u0E27\\u0E34\\u0E40\\u0E01\\u0E15\\u0E02\\u0E2D\\u0E07 Tile\\: "{0}"\\n\\n\\u0E0B\\u0E36\\u0E48\\u0E07\\u0E40\\u0E1B\\u0E47\\u0E19\\u0E44\\u0E1B\\u0E44\\u0E14\\u0E49\\u0E27\\u0E48\\u0E32\\u0E08\\u0E30\\u0E40\\u0E01\\u0E34\\u0E14\\u0E08\\u0E32\\u0E01\\u0E01\\u0E32\\u0E23\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E23\\u0E39\\u0E1B\\u0E41\\u0E1A\\u0E1A\\u0E40\\u0E19\\u0E37\\u0E49\\u0E2D\\u0E2B\\u0E32 SAP Fiori Launchpad \\u0E44\\u0E21\\u0E48\\u0E16\\u0E39\\u0E01\\u0E15\\u0E49\\u0E2D\\u0E07 \\u0E01\\u0E32\\u0E23\\u0E41\\u0E2A\\u0E14\\u0E07\\u0E20\\u0E32\\u0E1E\\u0E44\\u0E21\\u0E48\\u0E2A\\u0E32\\u0E21\\u0E32\\u0E23\\u0E16\\u0E40\\u0E1B\\u0E34\\u0E14\\u0E41\\u0E2D\\u0E1E\\u0E1E\\u0E25\\u0E34\\u0E40\\u0E04\\u0E0A\\u0E31\\u0E19\\u0E44\\u0E14\\u0E49\n#XMSG\nMessage.PageIsOutdated=\\u0E40\\u0E27\\u0E2D\\u0E23\\u0E4C\\u0E0A\\u0E31\\u0E19\\u0E17\\u0E35\\u0E48\\u0E43\\u0E2B\\u0E21\\u0E48\\u0E01\\u0E27\\u0E48\\u0E32\\u0E02\\u0E2D\\u0E07\\u0E2B\\u0E19\\u0E49\\u0E32\\u0E19\\u0E35\\u0E49\\u0E16\\u0E39\\u0E01\\u0E40\\u0E01\\u0E47\\u0E1A\\u0E1A\\u0E31\\u0E19\\u0E17\\u0E36\\u0E01\\u0E41\\u0E25\\u0E49\\u0E27\n#XMSG\nMessage.SaveChanges=\\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E40\\u0E01\\u0E47\\u0E1A\\u0E1A\\u0E31\\u0E19\\u0E17\\u0E36\\u0E01\\u0E01\\u0E32\\u0E23\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E41\\u0E1B\\u0E25\\u0E07\\u0E02\\u0E2D\\u0E07\\u0E04\\u0E38\\u0E13\n#XMSG\nMessage.NoSpaces=\\u0E44\\u0E21\\u0E48\\u0E21\\u0E35\\u0E1E\\u0E37\\u0E49\\u0E19\\u0E17\\u0E35\\u0E48\\u0E17\\u0E35\\u0E48\\u0E1E\\u0E23\\u0E49\\u0E2D\\u0E21\\u0E43\\u0E0A\\u0E49\\u0E07\\u0E32\\u0E19\n#XMSG\nMessage.NoSpacesFound=\\u0E44\\u0E21\\u0E48\\u0E1E\\u0E1A\\u0E1E\\u0E37\\u0E49\\u0E19\\u0E17\\u0E35\\u0E48 \\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E25\\u0E2D\\u0E07\\u0E1B\\u0E23\\u0E31\\u0E1A\\u0E01\\u0E32\\u0E23\\u0E04\\u0E49\\u0E19\\u0E2B\\u0E32\\u0E02\\u0E2D\\u0E07\\u0E04\\u0E38\\u0E13\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=\\u0E1E\\u0E37\\u0E49\\u0E19\\u0E17\\u0E35\\u0E48\\u0E43\\u0E2B\\u0E21\\u0E48\n#XTIT\nDeleteDialog.Title=\\u0E25\\u0E1A\n#XMSG\nDeleteDialog.Text=\\u0E04\\u0E38\\u0E13\\u0E41\\u0E19\\u0E48\\u0E43\\u0E08\\u0E2B\\u0E23\\u0E37\\u0E2D\\u0E44\\u0E21\\u0E48\\u0E27\\u0E48\\u0E32\\u0E15\\u0E49\\u0E2D\\u0E07\\u0E01\\u0E32\\u0E23\\u0E25\\u0E1A\\u0E1E\\u0E37\\u0E49\\u0E19\\u0E17\\u0E35\\u0E48\\u0E17\\u0E35\\u0E48\\u0E40\\u0E25\\u0E37\\u0E2D\\u0E01?\n#XBUT\nDeleteDialog.ConfirmButton=\\u0E25\\u0E1A\n#XTIT\nDeleteDialog.LockedTitle=\\u0E1E\\u0E37\\u0E49\\u0E19\\u0E17\\u0E35\\u0E48\\u0E16\\u0E39\\u0E01\\u0E25\\u0E47\\u0E2D\\u0E04\n#XMSG\nDeleteDialog.LockedText=\\u0E1E\\u0E37\\u0E49\\u0E19\\u0E17\\u0E35\\u0E48\\u0E17\\u0E35\\u0E48\\u0E40\\u0E25\\u0E37\\u0E2D\\u0E01\\u0E16\\u0E39\\u0E01\\u0E25\\u0E47\\u0E2D\\u0E04\\u0E42\\u0E14\\u0E22\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49 "{0}"\n#XMSG\nDeleteDialog.TransportRequired=\\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E40\\u0E25\\u0E37\\u0E2D\\u0E01\\u0E41\\u0E1E\\u0E04\\u0E40\\u0E01\\u0E08\\u0E01\\u0E32\\u0E23\\u0E17\\u0E23\\u0E32\\u0E19\\u0E2A\\u0E1B\\u0E2D\\u0E23\\u0E4C\\u0E15\\u0E40\\u0E1E\\u0E37\\u0E48\\u0E2D\\u0E25\\u0E1A\\u0E1E\\u0E37\\u0E49\\u0E19\\u0E17\\u0E35\\u0E48\\u0E17\\u0E35\\u0E48\\u0E40\\u0E25\\u0E37\\u0E2D\\u0E01\n\n#XMSG\nEditDialog.LockedText=\\u0E1E\\u0E37\\u0E49\\u0E19\\u0E17\\u0E35\\u0E48\\u0E17\\u0E35\\u0E48\\u0E40\\u0E25\\u0E37\\u0E2D\\u0E01\\u0E16\\u0E39\\u0E01\\u0E25\\u0E47\\u0E2D\\u0E04\\u0E42\\u0E14\\u0E22\\u0E1C\\u0E39\\u0E49\\u0E43\\u0E0A\\u0E49 "{0}"\n#XMSG\nEditDialog.TransportRequired=\\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E40\\u0E25\\u0E37\\u0E2D\\u0E01\\u0E41\\u0E1E\\u0E04\\u0E40\\u0E01\\u0E08\\u0E01\\u0E32\\u0E23\\u0E17\\u0E23\\u0E32\\u0E19\\u0E2A\\u0E1B\\u0E2D\\u0E23\\u0E4C\\u0E15\\u0E40\\u0E1E\\u0E37\\u0E48\\u0E2D\\u0E41\\u0E01\\u0E49\\u0E44\\u0E02\\u0E1E\\u0E37\\u0E49\\u0E19\\u0E17\\u0E35\\u0E48\\u0E17\\u0E35\\u0E48\\u0E40\\u0E25\\u0E37\\u0E2D\\u0E01\n#XTIT\nEditDialog.Title=\\u0E41\\u0E01\\u0E49\\u0E44\\u0E02\\u0E1E\\u0E37\\u0E49\\u0E19\\u0E17\\u0E35\\u0E48\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=\\u0E1E\\u0E37\\u0E49\\u0E19\\u0E17\\u0E35\\u0E48\\u0E19\\u0E35\\u0E49\\u0E16\\u0E39\\u0E01\\u0E2A\\u0E23\\u0E49\\u0E32\\u0E07\\u0E40\\u0E1B\\u0E47\\u0E19\\u0E20\\u0E32\\u0E29\\u0E32 "{0}" \\u0E41\\u0E15\\u0E48\\u0E20\\u0E32\\u0E29\\u0E32\\u0E17\\u0E35\\u0E48\\u0E43\\u0E0A\\u0E49\\u0E40\\u0E02\\u0E49\\u0E32\\u0E2A\\u0E39\\u0E48\\u0E23\\u0E30\\u0E1A\\u0E1A\\u0E02\\u0E2D\\u0E07\\u0E04\\u0E38\\u0E13\\u0E16\\u0E39\\u0E01\\u0E01\\u0E33\\u0E2B\\u0E19\\u0E14\\u0E40\\u0E1B\\u0E47\\u0E19 "{1}" \\u0E01\\u0E23\\u0E38\\u0E13\\u0E32\\u0E40\\u0E1B\\u0E25\\u0E35\\u0E48\\u0E22\\u0E19\\u0E20\\u0E32\\u0E29\\u0E32\\u0E17\\u0E35\\u0E48\\u0E43\\u0E0A\\u0E49\\u0E40\\u0E02\\u0E49\\u0E32\\u0E2A\\u0E39\\u0E48\\u0E23\\u0E30\\u0E1A\\u0E1A "{0}" \\u0E40\\u0E1E\\u0E37\\u0E48\\u0E2D\\u0E14\\u0E33\\u0E40\\u0E19\\u0E34\\u0E19\\u0E01\\u0E32\\u0E23\\u0E15\\u0E48\\u0E2D\n\n#XTIT\nErrorDialog.Title=\\u0E02\\u0E49\\u0E2D\\u0E1C\\u0E34\\u0E14\\u0E1E\\u0E25\\u0E32\\u0E14\n\n#XTIT\nSpaceOverview.Title=\\u0E1B\\u0E23\\u0E31\\u0E1A\\u0E1B\\u0E23\\u0E38\\u0E07\\u0E2B\\u0E19\\u0E49\\u0E32\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=\\u0E42\\u0E04\\u0E23\\u0E07\\u0E23\\u0E48\\u0E32\\u0E07\n\n#XTIT\nCopyDialog.Title=\\u0E04\\u0E31\\u0E14\\u0E25\\u0E2D\\u0E01\\u0E1E\\u0E37\\u0E49\\u0E19\\u0E17\\u0E35\\u0E48\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=\\u0E04\\u0E38\\u0E13\\u0E41\\u0E19\\u0E48\\u0E43\\u0E08\\u0E2B\\u0E23\\u0E37\\u0E2D\\u0E44\\u0E21\\u0E48\\u0E27\\u0E48\\u0E32\\u0E15\\u0E49\\u0E2D\\u0E07\\u0E01\\u0E32\\u0E23\\u0E04\\u0E31\\u0E14\\u0E25\\u0E2D\\u0E01 "{0}"?\n#XFLD\nCopyDialog.NewID=\\u0E2A\\u0E33\\u0E40\\u0E19\\u0E32\\u0E02\\u0E2D\\u0E07 "{0}"\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=\\u0E02\\u0E2D\\u0E2D\\u0E20\\u0E31\\u0E22 \\u0E40\\u0E23\\u0E32\\u0E44\\u0E21\\u0E48\\u0E1E\\u0E1A\\u0E1E\\u0E37\\u0E49\\u0E19\\u0E17\\u0E35\\u0E48\\u0E19\\u0E35\\u0E49\n#XLNK\nErrorPage.Link=\\u0E1B\\u0E23\\u0E31\\u0E1A\\u0E1B\\u0E23\\u0E38\\u0E07\\u0E1E\\u0E37\\u0E49\\u0E19\\u0E17\\u0E35\\u0E48\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_tr.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=Alanlar\\u0131n bak\\u0131m\\u0131n\\u0131 yap\n\n#XBUT\nButton.Add=Ekle\n#XBUT\nButton.Cancel=\\u0130ptal et\n#XBUT\nButton.Copy=Kopyala\n#XBUT\nButton.Create=Olu\\u015Ftur\n#XBUT\nButton.Delete=Sil\n#XBUT\nButton.Edit=D\\u00FCzenle\n#XBUT\nButton.Save=Kaydet\n#XBUT\nButton.Ok=Tamam\n#XBUT\nButton.ShowPages=Sayfalar\\u0131 g\\u00F6ster\n#XBUT\nButton.HidePages=Sayfalar\\u0131 gizle\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=Sorunlar\\: {0}\n#XBUT\nButton.SortPages=Sayfalar\\u0131n s\\u0131ralamas\\u0131n\\u0131 de\\u011Fi\\u015Ftir\n#XBUT\nButton.ShowDetails=Ayr\\u0131nt\\u0131lar\\u0131 g\\u00F6r\\u00FCnt\\u00FCle\n#XBUT\nButton.ErrorMsg=Hata iletileri\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=Arama\n#XTOL\nTooltip.SearchForTiles=Alanlar\\u0131 ara\n\n#XFLD\nLabel.SpaceID=Alan tan\\u0131t\\u0131c\\u0131s\\u0131\n#XFLD\nLabel.Title=Ba\\u015Fl\\u0131k\n#XFLD\nLabel.WorkbenchRequest=\\u00C7al\\u0131\\u015Fma ekran\\u0131 talebi\n#XFLD\nLabel.Package=Paket\n#XFLD\nLabel.TransportInformation=Ta\\u015F\\u0131ma bilgileri\n#XFLD\nLabel.Details=Ayr\\u0131nt\\u0131lar\\:\n#XFLD\nLabel.ResponseCode=Yan\\u0131t kodu\\:\n#XFLD\nLabel.Description=Tan\\u0131m\n#XFLD\nLabel.CreatedByFullname=Olu\\u015Fturan\n#XFLD\nLabel.CreatedOn=Olu\\u015Fturma tarihi\n#XFLD\nLabel.ChangedByFullname=De\\u011Fi\\u015Ftiren\n#XFLD\nLabel.ChangedOn=De\\u011Fi\\u015Fiklik tarihi\n#XFLD\nLabel.PageTitle=Sayfa ba\\u015Fl\\u0131\\u011F\\u0131\n#XFLD\nLabel.AssignedRole=Tayin edilen rol\n\n#XCOL\nColumn.SpaceID=Tan\\u0131t\\u0131c\\u0131\n#XCOL\nColumn.SpaceTitle=Ba\\u015Fl\\u0131k\n#XCOL\nColumn.SpaceDescription=Tan\\u0131m\n#XCOL\nColumn.SpacePackage=Paket\n#XCOL\nColumn.SpaceWorkbenchRequest=\\u00C7al\\u0131\\u015Fma ekran\\u0131 talebi\n#XCOL\nColumn.SpaceCreatedBy=Olu\\u015Fturan\n#XCOL\nColumn.SpaceCreatedOn=Olu\\u015Fturma tarihi\n#XCOL\nColumn.SpaceChangedBy=De\\u011Fi\\u015Ftiren\n#XCOL\nColumn.SpaceChangedOn=De\\u011Fi\\u015Fiklik tarihi\n\n#XCOL\nColumn.PageID=Tan\\u0131t\\u0131c\\u0131\n#XCOL\nColumn.PageTitle=Ba\\u015Fl\\u0131k\n#XCOL\nColumn.PageDescription=Tan\\u0131m\n#XCOL\nColumn.PagePackage=Paket\n#XCOL\nColumn.PageWorkbenchRequest=\\u00C7al\\u0131\\u015Fma ekran\\u0131 talebi\n#XCOL\nColumn.PageCreatedBy=Olu\\u015Fturan\n#XCOL\nColumn.PageCreatedOn=Olu\\u015Fturma tarihi\n#XCOL\nColumn.PageChangedBy=De\\u011Fi\\u015Ftiren\n#XCOL\nColumn.PageChangedOn=De\\u011Fi\\u015Fiklik tarihi\n\n#XTOL\nPlaceholder.CopySpaceTitle="{0}" kopyas\\u0131\n#XTOL\nPlaceholder.CopySpaceID="{0}" kopyas\\u0131\n\n#XMSG\nMessage.NoInternetConnection=\\u0130nternet ba\\u011Flant\\u0131n\\u0131z\\u0131 kontrol edin.\n#XMSG\nMessage.SavedChanges=De\\u011Fi\\u015Fiklikleriniz kaydedildi.\n#XMSG\nMessage.InvalidPageID=Yaln\\u0131zca \\u015Fu karakterleri kullan\\u0131n\\: A-Z, 0-9, _ ve /. Sayfa tan\\u0131t\\u0131c\\u0131s\\u0131 say\\u0131 ile ba\\u015Flamamal\\u0131.\n#XMSG\nMessage.EmptySpaceID=Ge\\u00E7erli alan tan\\u0131t\\u0131c\\u0131s\\u0131 girin.\n#XMSG\nMessage.EmptyTitle=Ge\\u00E7erli ba\\u015Fl\\u0131k girin.\n#XMSG\nMessage.SuccessDeletePage=Se\\u00E7ilen nesne silindi.\n#XMSG\nMessage.ClipboardCopySuccess=Ayr\\u0131nt\\u0131lar ba\\u015Far\\u0131yla kopyaland\\u0131.\n#YMSE\nMessage.ClipboardCopyFail=Ayr\\u0131nt\\u0131lar kopyalan\\u0131rken hata olu\\u015Ftu.\n#XMSG\nMessage.SpaceCreated=Alan olu\\u015Fturuldu.\n\n#XMSG\nMessage.NavigationTargetError=Dola\\u015Fma hedefi \\u00E7\\u00F6z\\u00FClemedi.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=Kutucu\\u011Fun dola\\u015Fma hedefini \\u00E7\\u00F6zme ba\\u015Far\\u0131s\\u0131z oldu\\: "{0}".\\n\\nBunun nedeni b\\u00FCy\\u00FCk olas\\u0131l\\u0131kla ge\\u00E7ersiz SAP Fiori ba\\u015Flatma \\u00E7ubu\\u011Fu i\\u00E7erik konfig\\u00FCrasyonudur. G\\u00F6rselle\\u015Ftirme, uygulama a\\u00E7am\\u0131yor.\n#XMSG\nMessage.PageIsOutdated=Bu sayfan\\u0131n daha yeni versiyonu zaten sakland\\u0131.\n#XMSG\nMessage.SaveChanges=De\\u011Fi\\u015Fikliklerinizi kaydedin.\n#XMSG\nMessage.NoSpaces=Kullan\\u0131labilir alan yok.\n#XMSG\nMessage.NoSpacesFound=Alan bulunamad\\u0131. Araman\\u0131z\\u0131 ayarlamay\\u0131 deneyin.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=Yeni alan\n#XTIT\nDeleteDialog.Title=Sil\n#XMSG\nDeleteDialog.Text=Se\\u00E7ilen alan\\u0131 silmek istedi\\u011Finizden emin misiniz?\n#XBUT\nDeleteDialog.ConfirmButton=Sil\n#XTIT\nDeleteDialog.LockedTitle=Alan bloke edildi\n#XMSG\nDeleteDialog.LockedText=Se\\u00E7ilen alan "{0}" kullan\\u0131c\\u0131s\\u0131 taraf\\u0131ndan bloke edildi.\n#XMSG\nDeleteDialog.TransportRequired=Se\\u00E7ilen alan\\u0131 silmek i\\u00E7in aktar\\u0131m paketi se\\u00E7in.\n\n#XMSG\nEditDialog.LockedText=Se\\u00E7ilen alan "{0}" kullan\\u0131c\\u0131s\\u0131 taraf\\u0131ndan bloke edildi.\n#XMSG\nEditDialog.TransportRequired=Se\\u00E7ilen alan\\u0131 d\\u00FCzenlemek i\\u00E7in aktar\\u0131m paketi se\\u00E7in.\n#XTIT\nEditDialog.Title=Alan\\u0131 d\\u00FCzenle\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=Bu alan "{0}" dilinde olu\\u015Fturuldu ancak sizin oturum a\\u00E7ma diliniz "{1}" olarak ayarlanm\\u0131\\u015F. Devam etmek i\\u00E7in oturum a\\u00E7ma dilinizi "{0}" olarak de\\u011Fi\\u015Ftirin.\n\n#XTIT\nErrorDialog.Title=Hata\n\n#XTIT\nSpaceOverview.Title=Sayfalar\\u0131n bak\\u0131m\\u0131n\\u0131 yap\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=D\\u00FCzen\n\n#XTIT\nCopyDialog.Title=Alan\\u0131 kopyala\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message="{0}" \\u00F6\\u011Fesini kopyalamak istiyor musunuz?\n#XFLD\nCopyDialog.NewID="{0}" kopyas\\u0131\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=\\u00DCzg\\u00FCn\\u00FCz, bu alan\\u0131 bulamad\\u0131k.\n#XLNK\nErrorPage.Link=Alanlar\\u0131n bak\\u0131m\\u0131n\\u0131 yap\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_uk.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=\\u0412\\u0435\\u0441\\u0442\\u0438 \\u043F\\u043B\\u043E\\u0449\\u0456\n\n#XBUT\nButton.Add=\\u0414\\u043E\\u0434\\u0430\\u0442\\u0438\n#XBUT\nButton.Cancel=\\u0421\\u043A\\u0430\\u0441\\u0443\\u0432\\u0430\\u0442\\u0438\n#XBUT\nButton.Copy=\\u041A\\u043E\\u043F\\u0456\\u044E\\u0432\\u0430\\u0442\\u0438\n#XBUT\nButton.Create=\\u0421\\u0442\\u0432\\u043E\\u0440\\u0438\\u0442\\u0438\n#XBUT\nButton.Delete=\\u0412\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438\n#XBUT\nButton.Edit=\\u0420\\u0435\\u0434\\u0430\\u0433\\u0443\\u0432\\u0430\\u0442\\u0438\n#XBUT\nButton.Save=\\u0417\\u0431\\u0435\\u0440\\u0435\\u0433\\u0442\\u0438\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowPages=\\u041F\\u043E\\u043A\\u0430\\u0437\\u0430\\u0442\\u0438 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0438\n#XBUT\nButton.HidePages=\\u041F\\u0440\\u0438\\u0445\\u043E\\u0432\\u0430\\u0442\\u0438 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0438\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=\\u041F\\u0440\\u043E\\u0431\\u043B\\u0435\\u043C\\u0438\\: {0}\n#XBUT\nButton.SortPages=\\u041F\\u0435\\u0440\\u0435\\u043C\\u043A\\u043D\\u0443\\u0442\\u0438 \\u043F\\u043E\\u0440\\u044F\\u0434\\u043E\\u043A \\u0441\\u043E\\u0440\\u0442\\u0443\\u0432\\u0430\\u043D\\u043D\\u044F \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043E\\u043A\n#XBUT\nButton.ShowDetails=\\u041F\\u043E\\u043A\\u0430\\u0437\\u0430\\u0442\\u0438 \\u043F\\u043E\\u0434\\u0440\\u043E\\u0431\\u0438\\u0446\\u0456\n#XBUT\nButton.ErrorMsg=\\u041F\\u043E\\u0432\\u0456\\u0434\\u043E\\u043C\\u043B\\u0435\\u043D\\u043D\\u044F \\u043F\\u0440\\u043E \\u043F\\u043E\\u043C\\u0438\\u043B\\u043A\\u0443\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=\\u041F\\u043E\\u0448\\u0443\\u043A\n#XTOL\nTooltip.SearchForTiles=\\u041F\\u043E\\u0448\\u0443\\u043A \\u043F\\u043B\\u043E\\u0449\n\n#XFLD\nLabel.SpaceID=\\u0406\\u0414 \\u043F\\u043B\\u043E\\u0449\\u0456\n#XFLD\nLabel.Title=\\u0417\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A\n#XFLD\nLabel.WorkbenchRequest=\\u0417\\u0430\\u043F\\u0438\\u0442 \\u0456\\u043D\\u0441\\u0442\\u0440\\u0443\\u043C\\u0435\\u043D\\u0442\\u0430\\u043B\\u044C\\u043D\\u0438\\u0445 \\u0437\\u0430\\u0441\\u043E\\u0431\\u0456\\u0432\n#XFLD\nLabel.Package=\\u041F\\u0430\\u043A\\u0435\\u0442\n#XFLD\nLabel.TransportInformation=\\u0406\\u043D\\u0444\\u043E\\u0440\\u043C\\u0430\\u0446\\u0456\\u044F \\u043F\\u0440\\u043E \\u0442\\u0440\\u0430\\u043D\\u0441\\u043F\\u043E\\u0440\\u0442\n#XFLD\nLabel.Details=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u0438\\u0446\\u0456\\:\n#XFLD\nLabel.ResponseCode=\\u041A\\u043E\\u0434 \\u0432\\u0456\\u0434\\u043F\\u043E\\u0432\\u0456\\u0434\\u0456\\:\n#XFLD\nLabel.Description=\\u041E\\u043F\\u0438\\u0441\n#XFLD\nLabel.CreatedByFullname=\\u0410\\u0432\\u0442\\u043E\\u0440 \\u0441\\u0442\\u0432\\u043E\\u0440\\u0435\\u043D\\u043D\\u044F\n#XFLD\nLabel.CreatedOn=\\u0414\\u0430\\u0442\\u0430 \\u0441\\u0442\\u0432\\u043E\\u0440\\u0435\\u043D\\u043D\\u044F\n#XFLD\nLabel.ChangedByFullname=\\u0410\\u0432\\u0442\\u043E\\u0440 \\u0437\\u043C\\u0456\\u043D\\u0438\n#XFLD\nLabel.ChangedOn=\\u0414\\u0430\\u0442\\u0430 \\u0437\\u043C\\u0456\\u043D\\u0438\n#XFLD\nLabel.PageTitle=\\u0417\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0438\n#XFLD\nLabel.AssignedRole=\\u041F\\u0440\\u0438\\u0441\\u0432\\u043E\\u0454\\u043D\\u0430 \\u0440\\u043E\\u043B\\u044C\n\n#XCOL\nColumn.SpaceID=\\u0406\\u0414\n#XCOL\nColumn.SpaceTitle=\\u0417\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A\n#XCOL\nColumn.SpaceDescription=\\u041E\\u043F\\u0438\\u0441\n#XCOL\nColumn.SpacePackage=\\u041F\\u0430\\u043A\\u0435\\u0442\n#XCOL\nColumn.SpaceWorkbenchRequest=\\u0417\\u0430\\u043F\\u0438\\u0442 \\u0456\\u043D\\u0441\\u0442\\u0440\\u0443\\u043C\\u0435\\u043D\\u0442\\u0430\\u043B\\u044C\\u043D\\u0438\\u0445 \\u0437\\u0430\\u0441\\u043E\\u0431\\u0456\\u0432\n#XCOL\nColumn.SpaceCreatedBy=\\u0410\\u0432\\u0442\\u043E\\u0440 \\u0441\\u0442\\u0432\\u043E\\u0440\\u0435\\u043D\\u043D\\u044F\n#XCOL\nColumn.SpaceCreatedOn=\\u0414\\u0430\\u0442\\u0430 \\u0441\\u0442\\u0432\\u043E\\u0440\\u0435\\u043D\\u043D\\u044F\n#XCOL\nColumn.SpaceChangedBy=\\u0410\\u0432\\u0442\\u043E\\u0440 \\u0437\\u043C\\u0456\\u043D\\u0438\n#XCOL\nColumn.SpaceChangedOn=\\u0414\\u0430\\u0442\\u0430 \\u0437\\u043C\\u0456\\u043D\\u0438\n\n#XCOL\nColumn.PageID=\\u0406\\u0414\n#XCOL\nColumn.PageTitle=\\u0417\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A\n#XCOL\nColumn.PageDescription=\\u041E\\u043F\\u0438\\u0441\n#XCOL\nColumn.PagePackage=\\u041F\\u0430\\u043A\\u0435\\u0442\n#XCOL\nColumn.PageWorkbenchRequest=\\u0417\\u0430\\u043F\\u0438\\u0442 \\u0456\\u043D\\u0441\\u0442\\u0440\\u0443\\u043C\\u0435\\u043D\\u0442\\u0430\\u043B\\u044C\\u043D\\u0438\\u0445 \\u0437\\u0430\\u0441\\u043E\\u0431\\u0456\\u0432\n#XCOL\nColumn.PageCreatedBy=\\u0410\\u0432\\u0442\\u043E\\u0440 \\u0441\\u0442\\u0432\\u043E\\u0440\\u0435\\u043D\\u043D\\u044F\n#XCOL\nColumn.PageCreatedOn=\\u0414\\u0430\\u0442\\u0430 \\u0441\\u0442\\u0432\\u043E\\u0440\\u0435\\u043D\\u043D\\u044F\n#XCOL\nColumn.PageChangedBy=\\u0410\\u0432\\u0442\\u043E\\u0440 \\u0437\\u043C\\u0456\\u043D\\u0438\n#XCOL\nColumn.PageChangedOn=\\u0414\\u0430\\u0442\\u0430 \\u0437\\u043C\\u0456\\u043D\\u0438\n\n#XTOL\nPlaceholder.CopySpaceTitle=\\u041A\\u043E\\u043F\\u0456\\u044F \\u00AB{0}\\u00BB\n#XTOL\nPlaceholder.CopySpaceID=\\u041A\\u043E\\u043F\\u0456\\u044F \\u00AB{0}\\u00BB\n\n#XMSG\nMessage.NoInternetConnection=\\u041F\\u0435\\u0440\\u0435\\u0432\\u0456\\u0440\\u0442\\u0435 \\u0432\\u0430\\u0448\\u0435 \\u0406\\u043D\\u0442\\u0435\\u0440\\u043D\\u0435\\u0442-\\u043F\\u0456\\u0434\\u043A\\u043B\\u044E\\u0447\\u0435\\u043D\\u043D\\u044F.\n#XMSG\nMessage.SavedChanges=\\u0412\\u0430\\u0448\\u0456 \\u0437\\u043C\\u0456\\u043D\\u0438 \\u0437\\u0431\\u0435\\u0440\\u0435\\u0436\\u0435\\u043D\\u043E.\n#XMSG\nMessage.InvalidPageID=\\u0412\\u0438\\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u043E\\u0432\\u0443\\u0439\\u0442\\u0435 \\u043B\\u0438\\u0448\\u0435 \\u043D\\u0430\\u0441\\u0442\\u0443\\u043F\\u043D\\u0456 \\u0441\\u0438\\u043C\\u0432\\u043E\\u043B\\u0438\\: A-Z, 0-9, _ \\u0456 /. \\u0406\\u0414 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0438 \\u043D\\u0435 \\u043F\\u043E\\u0432\\u0438\\u043D\\u0435\\u043D \\u043F\\u043E\\u0447\\u0438\\u043D\\u0430\\u0442\\u0438\\u0441\\u044F \\u0437 \\u0447\\u0438\\u0441\\u043B\\u0430.\n#XMSG\nMessage.EmptySpaceID=\\u0412\\u043A\\u0430\\u0436\\u0456\\u0442\\u044C \\u0434\\u0456\\u0439\\u0441\\u043D\\u0438\\u0439 \\u0406\\u0414 \\u043F\\u043B\\u043E\\u0449\\u0456.\n#XMSG\nMessage.EmptyTitle=\\u0412\\u043A\\u0430\\u0436\\u0456\\u0442\\u044C \\u0434\\u0456\\u0439\\u0441\\u043D\\u0438\\u0439 \\u0437\\u0430\\u0433\\u043E\\u043B\\u043E\\u0432\\u043E\\u043A.\n#XMSG\nMessage.SuccessDeletePage=\\u0412\\u0438\\u0431\\u0440\\u0430\\u043D\\u0438\\u0439 \\u043E\\u0431\'\\u0454\\u043A\\u0442 \\u0432\\u0438\\u0434\\u0430\\u043B\\u0435\\u043D\\u043E.\n#XMSG\nMessage.ClipboardCopySuccess=\\u041F\\u043E\\u0434\\u0440\\u043E\\u0431\\u0438\\u0446\\u0456 \\u0443\\u0441\\u043F\\u0456\\u0448\\u043D\\u043E \\u0441\\u043A\\u043E\\u043F\\u0456\\u0439\\u043E\\u0432\\u0430\\u043D\\u043E\n#YMSE\nMessage.ClipboardCopyFail=\\u041F\\u0440\\u0438 \\u043A\\u043E\\u043F\\u0456\\u044E\\u0432\\u0430\\u043D\\u043D\\u0456 \\u043F\\u043E\\u0434\\u0440\\u043E\\u0431\\u0438\\u0446\\u044C \\u0441\\u0442\\u0430\\u043B\\u0430\\u0441\\u044F \\u043F\\u043E\\u043C\\u0438\\u043B\\u043A\\u0430.\n#XMSG\nMessage.SpaceCreated=\\u041F\\u043B\\u043E\\u0449\\u0430 \\u0441\\u0442\\u0432\\u043E\\u0440\\u0435\\u043D\\u0430.\n\n#XMSG\nMessage.NavigationTargetError=\\u041D\\u0435 \\u0432\\u0434\\u0430\\u043B\\u043E\\u0441\\u044F \\u0440\\u043E\\u0437\\u0432\'\\u044F\\u0437\\u0430\\u0442\\u0438 \\u0446\\u0456\\u043B\\u044C \\u043D\\u0430\\u0432\\u0456\\u0433\\u0430\\u0446\\u0456\\u0457.\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=\\u041D\\u0435 \\u0432\\u0434\\u0430\\u043B\\u043E\\u0441\\u044F \\u0440\\u043E\\u0437\\u0432\'\'\\u044F\\u0437\\u0430\\u0442\\u0438 \\u0446\\u0456\\u043B\\u044C \\u043D\\u0430\\u0432\\u0456\\u0433\\u0430\\u0446\\u0456\\u0457 \\u043F\\u043B\\u0438\\u0442\\u043A\\u0438\\: "{0}".\\n\\n\\u0419\\u043C\\u043E\\u0432\\u0456\\u0440\\u043D\\u0456\\u0448\\u0435 \\u0437\\u0430 \\u0432\\u0441\\u0435 \\u043F\\u0440\\u0438\\u0447\\u0438\\u043D\\u043E\\u044E \\u0446\\u044C\\u043E\\u0433\\u043E \\u0454 \\u043D\\u0435\\u043F\\u0440\\u0430\\u0432\\u0438\\u043B\\u044C\\u043D\\u0430 \\u043A\\u043E\\u043D\\u0444\\u0456\\u0433\\u0443\\u0440\\u0430\\u0446\\u0456\\u044F \\u0432\\u043C\\u0456\\u0441\\u0442\\u0443 \\u043F\\u0430\\u043D\\u0435\\u043B\\u0456 \\u0437\\u0430\\u043F\\u0443\\u0441\\u043A\\u0443 SAP Fiori. \\u0412\\u0456\\u0437\\u0443\\u0430\\u043B\\u0456\\u0437\\u0430\\u0446\\u0456\\u044F \\u043D\\u0435 \\u043C\\u043E\\u0436\\u0435 \\u0432\\u0456\\u0434\\u043A\\u0440\\u0438\\u0442\\u0438 \\u0437\\u0430\\u0441\\u0442\\u043E\\u0441\\u0443\\u043D\\u043E\\u043A.\n#XMSG\nMessage.PageIsOutdated=\\u041D\\u043E\\u0432\\u0456\\u0448\\u0430 \\u0432\\u0435\\u0440\\u0441\\u0456\\u044F \\u0446\\u0456\\u0454\\u0457 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0438 \\u0443\\u0441\\u043F\\u0456\\u0448\\u043D\\u043E \\u0437\\u0431\\u0435\\u0440\\u0435\\u0436\\u0435\\u043D\\u0430.\n#XMSG\nMessage.SaveChanges=\\u0417\\u0431\\u0435\\u0440\\u0435\\u0436\\u0456\\u0442\\u044C \\u0432\\u0430\\u0448\\u0456 \\u0437\\u043C\\u0456\\u043D\\u0438\n#XMSG\nMessage.NoSpaces=\\u041F\\u043B\\u043E\\u0449\\u0456 \\u043D\\u0435\\u0434\\u043E\\u0441\\u0442\\u0443\\u043F\\u043D\\u0456.\n#XMSG\nMessage.NoSpacesFound=\\u041F\\u043B\\u043E\\u0449\\u0456 \\u043D\\u0435 \\u0437\\u043D\\u0430\\u0439\\u0434\\u0435\\u043D\\u0456. \\u0421\\u043F\\u0440\\u043E\\u0431\\u0443\\u0439\\u0442\\u0435 \\u0432\\u0456\\u0434\\u043A\\u043E\\u0440\\u0438\\u0433\\u0443\\u0432\\u0430\\u0442\\u0438 \\u0432\\u0430\\u0448 \\u043F\\u043E\\u0448\\u0443\\u043A.\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=\\u041D\\u043E\\u0432\\u0430 \\u043F\\u043B\\u043E\\u0449\\u0430\n#XTIT\nDeleteDialog.Title=\\u0412\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438\n#XMSG\nDeleteDialog.Text=\\u0412\\u0438 \\u0434\\u0456\\u0439\\u0441\\u043D\\u043E \\u0431\\u0430\\u0436\\u0430\\u0454\\u0442\\u0435 \\u0432\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438 \\u0432\\u0438\\u0431\\u0440\\u0430\\u043D\\u0443 \\u043F\\u043B\\u043E\\u0449\\u0443?\n#XBUT\nDeleteDialog.ConfirmButton=\\u0412\\u0438\\u0434\\u0430\\u043B\\u0438\\u0442\\u0438\n#XTIT\nDeleteDialog.LockedTitle=\\u041F\\u043B\\u043E\\u0449\\u0430 \\u0437\\u0430\\u0431\\u043B\\u043E\\u043A\\u043E\\u0432\\u0430\\u043D\\u0430\n#XMSG\nDeleteDialog.LockedText=\\u0412\\u0438\\u0431\\u0440\\u0430\\u043D\\u0430 \\u043F\\u043B\\u043E\\u0449\\u0430 \\u0437\\u0430\\u0431\\u043B\\u043E\\u043A\\u043E\\u0432\\u0430\\u043D\\u0430 \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0435\\u043C \\u00AB{0}\\u00BB.\n#XMSG\nDeleteDialog.TransportRequired=\\u0412\\u0438\\u0431\\u0435\\u0440\\u0456\\u0442\\u044C \\u043F\\u0430\\u043A\\u0435\\u0442 \\u043F\\u0435\\u0440\\u0435\\u043D\\u0435\\u0441\\u0435\\u043D\\u043D\\u044F \\u0434\\u043B\\u044F \\u0432\\u0438\\u0434\\u0430\\u043B\\u0435\\u043D\\u043D\\u044F \\u0432\\u0438\\u0431\\u0440\\u0430\\u043D\\u043E\\u0457 \\u043F\\u043B\\u043E\\u0449\\u0456.\n\n#XMSG\nEditDialog.LockedText=\\u0412\\u0438\\u0431\\u0440\\u0430\\u043D\\u0430 \\u043F\\u043B\\u043E\\u0449\\u0430 \\u0437\\u0430\\u0431\\u043B\\u043E\\u043A\\u043E\\u0432\\u0430\\u043D\\u0430 \\u043A\\u043E\\u0440\\u0438\\u0441\\u0442\\u0443\\u0432\\u0430\\u0447\\u0435\\u043C \\u00AB{0}\\u00BB.\n#XMSG\nEditDialog.TransportRequired=\\u0412\\u0438\\u0431\\u0435\\u0440\\u0456\\u0442\\u044C \\u043F\\u0430\\u043A\\u0435\\u0442 \\u043F\\u0435\\u0440\\u0435\\u043D\\u0435\\u0441\\u0435\\u043D\\u043D\\u044F \\u0434\\u043B\\u044F \\u0440\\u0435\\u0434\\u0430\\u0433\\u0443\\u0432\\u0430\\u043D\\u043D\\u044F \\u0432\\u0438\\u0431\\u0440\\u0430\\u043D\\u043E\\u0457 \\u043F\\u043B\\u043E\\u0449\\u0456.\n#XTIT\nEditDialog.Title=\\u0420\\u0435\\u0434\\u0430\\u0433\\u0443\\u0432\\u0430\\u0442\\u0438 \\u043F\\u043B\\u043E\\u0449\\u0443\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=\\u0426\\u044E \\u043F\\u043B\\u043E\\u0449\\u0443 \\u0431\\u0443\\u043B\\u043E \\u0441\\u0442\\u0432\\u043E\\u0440\\u0435\\u043D\\u043E \\u043C\\u043E\\u0432\\u043E\\u044E "{0}", \\u0430\\u043B\\u0435 \\u0432\\u0430\\u0448\\u0430 \\u043C\\u043E\\u0432\\u0430 \\u0432\\u0445\\u043E\\u0434\\u0443 \\u0434\\u043E \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0438 \\u0431\\u0443\\u043B\\u0430 \\u0432\\u0441\\u0442\\u0430\\u043D\\u043E\\u0432\\u043B\\u0435\\u043D\\u0430 \\u043D\\u0430 "{1}". \\u0429\\u043E\\u0431 \\u043F\\u0440\\u043E\\u0434\\u043E\\u0432\\u0436\\u0438\\u0442\\u0438, \\u0437\\u043C\\u0456\\u043D\\u0456\\u0442\\u044C \\u0432\\u0430\\u0448\\u0443 \\u043C\\u043E\\u0432\\u0443 \\u0432\\u0445\\u043E\\u0434\\u0443 \\u0434\\u043E \\u0441\\u0438\\u0441\\u0442\\u0435\\u043C\\u0438 \\u043D\\u0430 "{0}\\u00BB.\n\n#XTIT\nErrorDialog.Title=\\u041F\\u043E\\u043C\\u0438\\u043B\\u043A\\u0430\n\n#XTIT\nSpaceOverview.Title=\\u0412\\u0435\\u0441\\u0442\\u0438 \\u0441\\u0442\\u043E\\u0440\\u0456\\u043D\\u043A\\u0438\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=\\u0424\\u043E\\u0440\\u043C\\u0430\\u0442\n\n#XTIT\nCopyDialog.Title=\\u041A\\u043E\\u043F\\u0456\\u044E\\u0432\\u0430\\u0442\\u0438 \\u043F\\u043B\\u043E\\u0449\\u0443\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=\\u041A\\u043E\\u043F\\u0456\\u044E\\u0432\\u0430\\u0442\\u0438 {0}?\n#XFLD\nCopyDialog.NewID=\\u041A\\u043E\\u043F\\u0456\\u044F \\u00AB{0}\\u00BB\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=\\u0412\\u0438\\u0431\\u0430\\u0447\\u0442\\u0435, \\u043D\\u0435\\u043C\\u043E\\u0436\\u043B\\u0438\\u0432\\u043E \\u0437\\u043D\\u0430\\u0439\\u0442\\u0438 \\u0446\\u044E \\u043F\\u043B\\u043E\\u0449\\u0443.\n#XLNK\nErrorPage.Link=\\u0412\\u0435\\u0441\\u0442\\u0438 \\u043F\\u043B\\u043E\\u0449\\u0456\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_zh_CN.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=\\u7EF4\\u62A4\\u7A7A\\u95F4\n\n#XBUT\nButton.Add=\\u6DFB\\u52A0\n#XBUT\nButton.Cancel=\\u53D6\\u6D88\n#XBUT\nButton.Copy=\\u590D\\u5236\n#XBUT\nButton.Create=\\u521B\\u5EFA\n#XBUT\nButton.Delete=\\u5220\\u9664\n#XBUT\nButton.Edit=\\u7F16\\u8F91\n#XBUT\nButton.Save=\\u4FDD\\u5B58\n#XBUT\nButton.Ok=\\u786E\\u5B9A\n#XBUT\nButton.ShowPages=\\u663E\\u793A\\u9875\\u9762\n#XBUT\nButton.HidePages=\\u9690\\u85CF\\u9875\\u9762\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=\\u95EE\\u9898\\uFF1A{0}\n#XBUT\nButton.SortPages=\\u5207\\u6362\\u9875\\u9762\\u6392\\u5E8F\\u987A\\u5E8F\n#XBUT\nButton.ShowDetails=\\u663E\\u793A\\u8BE6\\u7EC6\\u4FE1\\u606F\n#XBUT\nButton.ErrorMsg=\\u9519\\u8BEF\\u6D88\\u606F\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=\\u641C\\u7D22\n#XTOL\nTooltip.SearchForTiles=\\u641C\\u7D22\\u7A7A\\u95F4\n\n#XFLD\nLabel.SpaceID=\\u7A7A\\u95F4\\u6807\\u8BC6\n#XFLD\nLabel.Title=\\u6807\\u9898\n#XFLD\nLabel.WorkbenchRequest=\\u5DE5\\u4F5C\\u53F0\\u8BF7\\u6C42\n#XFLD\nLabel.Package=\\u5305\n#XFLD\nLabel.TransportInformation=\\u4F20\\u8F93\\u4FE1\\u606F\n#XFLD\nLabel.Details=\\u8BE6\\u7EC6\\u4FE1\\u606F\\uFF1A\n#XFLD\nLabel.ResponseCode=\\u54CD\\u5E94\\u4EE3\\u7801\\uFF1A\n#XFLD\nLabel.Description=\\u63CF\\u8FF0\n#XFLD\nLabel.CreatedByFullname=\\u521B\\u5EFA\\u8005\n#XFLD\nLabel.CreatedOn=\\u521B\\u5EFA\\u65E5\\u671F\n#XFLD\nLabel.ChangedByFullname=\\u66F4\\u6539\\u8005\n#XFLD\nLabel.ChangedOn=\\u66F4\\u6539\\u65E5\\u671F\n#XFLD\nLabel.PageTitle=\\u9875\\u9762\\u6807\\u9898\n#XFLD\nLabel.AssignedRole=\\u5DF2\\u5206\\u914D\\u89D2\\u8272\n\n#XCOL\nColumn.SpaceID=\\u6807\\u8BC6\n#XCOL\nColumn.SpaceTitle=\\u6807\\u9898\n#XCOL\nColumn.SpaceDescription=\\u63CF\\u8FF0\n#XCOL\nColumn.SpacePackage=\\u5305\n#XCOL\nColumn.SpaceWorkbenchRequest=\\u5DE5\\u4F5C\\u53F0\\u8BF7\\u6C42\n#XCOL\nColumn.SpaceCreatedBy=\\u521B\\u5EFA\\u8005\n#XCOL\nColumn.SpaceCreatedOn=\\u521B\\u5EFA\\u65E5\\u671F\n#XCOL\nColumn.SpaceChangedBy=\\u66F4\\u6539\\u8005\n#XCOL\nColumn.SpaceChangedOn=\\u66F4\\u6539\\u65E5\\u671F\n\n#XCOL\nColumn.PageID=\\u6807\\u8BC6\n#XCOL\nColumn.PageTitle=\\u6807\\u9898\n#XCOL\nColumn.PageDescription=\\u63CF\\u8FF0\n#XCOL\nColumn.PagePackage=\\u5305\n#XCOL\nColumn.PageWorkbenchRequest=\\u5DE5\\u4F5C\\u53F0\\u8BF7\\u6C42\n#XCOL\nColumn.PageCreatedBy=\\u521B\\u5EFA\\u8005\n#XCOL\nColumn.PageCreatedOn=\\u521B\\u5EFA\\u65E5\\u671F\n#XCOL\nColumn.PageChangedBy=\\u66F4\\u6539\\u8005\n#XCOL\nColumn.PageChangedOn=\\u66F4\\u6539\\u65E5\\u671F\n\n#XTOL\nPlaceholder.CopySpaceTitle="{0}" \\u7684\\u526F\\u672C\n#XTOL\nPlaceholder.CopySpaceID="{0}" \\u7684\\u526F\\u672C\n\n#XMSG\nMessage.NoInternetConnection=\\u8BF7\\u68C0\\u67E5 internet \\u8FDE\\u63A5\\u3002\n#XMSG\nMessage.SavedChanges=\\u6240\\u505A\\u66F4\\u6539\\u5DF2\\u4FDD\\u5B58\\u3002\n#XMSG\nMessage.InvalidPageID=\\u8BF7\\u4EC5\\u4F7F\\u7528\\u4EE5\\u4E0B\\u5B57\\u7B26\\uFF1AA-Z\\u30010-9\\u3001_ \\u548C /\\u3002\\u9875\\u9762\\u6807\\u8BC6\\u4E0D\\u5E94\\u4EE5\\u6570\\u5B57\\u5F00\\u5934\\u3002\n#XMSG\nMessage.EmptySpaceID=\\u8BF7\\u63D0\\u4F9B\\u6709\\u6548\\u7684\\u7A7A\\u95F4\\u6807\\u8BC6\\u3002\n#XMSG\nMessage.EmptyTitle=\\u8BF7\\u63D0\\u4F9B\\u6709\\u6548\\u7684\\u6807\\u9898\\u3002\n#XMSG\nMessage.SuccessDeletePage=\\u6240\\u9009\\u5BF9\\u8C61\\u5DF2\\u5220\\u9664\\u3002\n#XMSG\nMessage.ClipboardCopySuccess=\\u8BE6\\u7EC6\\u4FE1\\u606F\\u5DF2\\u6210\\u529F\\u590D\\u5236\\u3002\n#YMSE\nMessage.ClipboardCopyFail=\\u590D\\u5236\\u8BE6\\u7EC6\\u4FE1\\u606F\\u65F6\\u51FA\\u9519\\u3002\n#XMSG\nMessage.SpaceCreated=\\u7A7A\\u95F4\\u5DF2\\u521B\\u5EFA\\u3002\n\n#XMSG\nMessage.NavigationTargetError=\\u65E0\\u6CD5\\u89E3\\u6790\\u5BFC\\u822A\\u76EE\\u6807\\u3002\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=\\u89E3\\u6790\\u78C1\\u8D34\\u7684\\u5BFC\\u822A\\u76EE\\u6807\\u5931\\u8D25\\uFF1A"{0}"\\u3002\\n\\n\\u8FD9\\u6781\\u6709\\u53EF\\u80FD\\u662F\\u7531\\u4E8E SAP Fiori \\u5FEB\\u901F\\u542F\\u52A8\\u677F\\u5185\\u5BB9\\u914D\\u7F6E\\u65E0\\u6548\\u6240\\u9020\\u6210\\u7684\\u3002\\u53EF\\u89C6\\u5316\\u65E0\\u6CD5\\u6253\\u5F00\\u5E94\\u7528\\u7A0B\\u5E8F\\u3002\n#XMSG\nMessage.PageIsOutdated=\\u5DF2\\u4FDD\\u5B58\\u6B64\\u9875\\u9762\\u7684\\u8F83\\u65B0\\u7248\\u672C\\u3002\n#XMSG\nMessage.SaveChanges=\\u8BF7\\u4FDD\\u5B58\\u6240\\u505A\\u66F4\\u6539\\u3002\n#XMSG\nMessage.NoSpaces=\\u65E0\\u53EF\\u7528\\u7A7A\\u95F4\\u3002\n#XMSG\nMessage.NoSpacesFound=\\u672A\\u627E\\u5230\\u7A7A\\u95F4\\u3002\\u5C1D\\u8BD5\\u5BF9\\u641C\\u7D22\\u8FDB\\u884C\\u8C03\\u6574\\u3002\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=\\u65B0\\u7A7A\\u95F4\n#XTIT\nDeleteDialog.Title=\\u5220\\u9664\n#XMSG\nDeleteDialog.Text=\\u662F\\u5426\\u786E\\u5B9A\\u8981\\u5220\\u9664\\u6240\\u9009\\u7A7A\\u95F4\\uFF1F\n#XBUT\nDeleteDialog.ConfirmButton=\\u5220\\u9664\n#XTIT\nDeleteDialog.LockedTitle=\\u7A7A\\u95F4\\u5DF2\\u9501\\u5B9A\n#XMSG\nDeleteDialog.LockedText=\\u6240\\u9009\\u7A7A\\u95F4\\u5DF2\\u7531\\u7528\\u6237 "{0}" \\u9501\\u5B9A\\u3002\n#XMSG\nDeleteDialog.TransportRequired=\\u8BF7\\u9009\\u62E9\\u4F20\\u8F93\\u5305\\u4EE5\\u5220\\u9664\\u6240\\u9009\\u7A7A\\u95F4\\u3002\n\n#XMSG\nEditDialog.LockedText=\\u6240\\u9009\\u7A7A\\u95F4\\u5DF2\\u7531\\u7528\\u6237 "{0}" \\u9501\\u5B9A\\u3002\n#XMSG\nEditDialog.TransportRequired=\\u8BF7\\u9009\\u62E9\\u4F20\\u8F93\\u5305\\u4EE5\\u7F16\\u8F91\\u6240\\u9009\\u7A7A\\u95F4\\u3002\n#XTIT\nEditDialog.Title=\\u7F16\\u8F91\\u7A7A\\u95F4\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=\\u6B64\\u7A7A\\u95F4\\u4EE5 "{0}" \\u8BED\\u8A00\\u521B\\u5EFA\\uFF0C\\u4F46\\u767B\\u5F55\\u8BED\\u8A00\\u5374\\u8BBE\\u7F6E\\u4E3A "{1}"\\u3002\\u8BF7\\u5C06\\u767B\\u5F55\\u8BED\\u8A00\\u66F4\\u6539\\u4E3A "{0}" \\u4EE5\\u7EE7\\u7EED\\u3002\n\n#XTIT\nErrorDialog.Title=\\u9519\\u8BEF\n\n#XTIT\nSpaceOverview.Title=\\u7EF4\\u62A4\\u9875\\u9762\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=\\u5E03\\u5C40\n\n#XTIT\nCopyDialog.Title=\\u590D\\u5236\\u7A7A\\u95F4\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=\\u662F\\u5426\\u8981\\u590D\\u5236 "{0}"\\uFF1F\n#XFLD\nCopyDialog.NewID="{0}" \\u7684\\u526F\\u672C\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=\\u62B1\\u6B49\\uFF0C\\u65E0\\u6CD5\\u627E\\u5230\\u6B64\\u7A7A\\u95F4\\u3002\n#XLNK\nErrorPage.Link=\\u7EF4\\u62A4\\u7A7A\\u95F4\n',
	"sap/ushell/applications/SpaceDesigner/i18n/i18n_zh_TW.properties":'# Translatable texts for the Fiori Launchpad Space Designer application\n# \n\n#XTIT: Title of the "Maintain Spaces" application.\nSpaceDesigner.AppTitle=\\u7DAD\\u8B77\\u7A7A\\u9593\n\n#XBUT\nButton.Add=\\u65B0\\u589E\n#XBUT\nButton.Cancel=\\u53D6\\u6D88\n#XBUT\nButton.Copy=\\u8907\\u88FD\n#XBUT\nButton.Create=\\u5EFA\\u7ACB\n#XBUT\nButton.Delete=\\u522A\\u9664\n#XBUT\nButton.Edit=\\u7DE8\\u8F2F\n#XBUT\nButton.Save=\\u5132\\u5B58\n#XBUT\nButton.Ok=\\u78BA\\u5B9A\n#XBUT\nButton.ShowPages=\\u986F\\u793A\\u9801\\u9762\n#XBUT\nButton.HidePages=\\u96B1\\u85CF\\u9801\\u9762\n#XBUT: Parameter "{0}" is the number of issues on the page being edited.\nButton.Issues=\\u6838\\u767C\\uFF1A{0}\n#XBUT\nButton.SortPages=\\u5207\\u63DB\\u9801\\u9762\\u6392\\u5E8F\\u9806\\u5E8F\n#XBUT\nButton.ShowDetails=\\u986F\\u793A\\u660E\\u7D30\n#XBUT\nButton.ErrorMsg=\\u932F\\u8AA4\\u8A0A\\u606F\n\n#XTOL: Tooltip for the search button.\nTooltip.Search=\\u641C\\u5C0B\n#XTOL\nTooltip.SearchForTiles=\\u641C\\u5C0B\\u7A7A\\u9593\n\n#XFLD\nLabel.SpaceID=\\u7A7A\\u9593 ID\n#XFLD\nLabel.Title=\\u6A19\\u984C\n#XFLD\nLabel.WorkbenchRequest=\\u5DE5\\u4F5C\\u53F0\\u8ACB\\u6C42\n#XFLD\nLabel.Package=\\u5957\\u4EF6\n#XFLD\nLabel.TransportInformation=\\u50B3\\u8F38\\u8CC7\\u8A0A\n#XFLD\nLabel.Details=\\u660E\\u7D30\\uFF1A\n#XFLD\nLabel.ResponseCode=\\u56DE\\u61C9\\u4EE3\\u78BC\\uFF1A\n#XFLD\nLabel.Description=\\u8AAA\\u660E\n#XFLD\nLabel.CreatedByFullname=\\u5EFA\\u7ACB\\u8005\n#XFLD\nLabel.CreatedOn=\\u5EFA\\u7ACB\\u65E5\\u671F\n#XFLD\nLabel.ChangedByFullname=\\u66F4\\u6539\\u8005\n#XFLD\nLabel.ChangedOn=\\u66F4\\u6539\\u65E5\\u671F\n#XFLD\nLabel.PageTitle=\\u9801\\u9762\\u6A19\\u984C\n#XFLD\nLabel.AssignedRole=\\u6307\\u6D3E\\u89D2\\u8272\n\n#XCOL\nColumn.SpaceID=ID\n#XCOL\nColumn.SpaceTitle=\\u6A19\\u984C\n#XCOL\nColumn.SpaceDescription=\\u8AAA\\u660E\n#XCOL\nColumn.SpacePackage=\\u5957\\u4EF6\n#XCOL\nColumn.SpaceWorkbenchRequest=\\u5DE5\\u4F5C\\u53F0\\u8ACB\\u6C42\n#XCOL\nColumn.SpaceCreatedBy=\\u5EFA\\u7ACB\\u8005\n#XCOL\nColumn.SpaceCreatedOn=\\u5EFA\\u7ACB\\u65E5\\u671F\n#XCOL\nColumn.SpaceChangedBy=\\u66F4\\u6539\\u8005\n#XCOL\nColumn.SpaceChangedOn=\\u66F4\\u6539\\u65E5\\u671F\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=\\u6A19\\u984C\n#XCOL\nColumn.PageDescription=\\u8AAA\\u660E\n#XCOL\nColumn.PagePackage=\\u5957\\u4EF6\n#XCOL\nColumn.PageWorkbenchRequest=\\u5DE5\\u4F5C\\u53F0\\u8ACB\\u6C42\n#XCOL\nColumn.PageCreatedBy=\\u5EFA\\u7ACB\\u8005\n#XCOL\nColumn.PageCreatedOn=\\u5EFA\\u7ACB\\u65E5\\u671F\n#XCOL\nColumn.PageChangedBy=\\u66F4\\u6539\\u8005\n#XCOL\nColumn.PageChangedOn=\\u66F4\\u6539\\u65E5\\u671F\n\n#XTOL\nPlaceholder.CopySpaceTitle="{0}" \\u7684\\u526F\\u672C\n#XTOL\nPlaceholder.CopySpaceID="{0}" \\u7684\\u526F\\u672C\n\n#XMSG\nMessage.NoInternetConnection=\\u8ACB\\u6AA2\\u67E5\\u60A8\\u7684\\u7DB2\\u8DEF\\u9023\\u7DDA\\u3002\n#XMSG\nMessage.SavedChanges=\\u5DF2\\u5132\\u5B58\\u60A8\\u7684\\u66F4\\u6539\\u3002\n#XMSG\nMessage.InvalidPageID=\\u8ACB\\u50C5\\u4F7F\\u7528\\u4EE5\\u4E0B\\u5B57\\u5143\\uFF1AA-Z\\u30010-9\\u3001_ \\u548C /\\uFF0C\\u9801\\u9762 ID \\u4E0D\\u6703\\u4F7F\\u7528\\u6578\\u5B57\\u4F5C\\u70BA\\u958B\\u982D\\u3002\n#XMSG\nMessage.EmptySpaceID=\\u8ACB\\u63D0\\u4F9B\\u6709\\u6548\\u7A7A\\u9593 ID\\u3002\n#XMSG\nMessage.EmptyTitle=\\u8ACB\\u63D0\\u4F9B\\u6709\\u6548\\u6A19\\u984C\\u3002\n#XMSG\nMessage.SuccessDeletePage=\\u5DF2\\u522A\\u9664\\u6240\\u9078\\u7269\\u4EF6\\u3002\n#XMSG\nMessage.ClipboardCopySuccess=\\u5DF2\\u6210\\u529F\\u8907\\u88FD\\u660E\\u7D30\\u3002\n#YMSE\nMessage.ClipboardCopyFail=\\u8907\\u88FD\\u660E\\u7D30\\u6642\\u767C\\u751F\\u932F\\u8AA4\\u3002\n#XMSG\nMessage.SpaceCreated=\\u5DF2\\u5EFA\\u7ACB\\u7A7A\\u9593\\u3002\n\n#XMSG\nMessage.NavigationTargetError=\\u7121\\u6CD5\\u89E3\\u6C7A\\u700F\\u89BD\\u76EE\\u6A19\\u3002\n#YMSG: Parameter "{0}" is the title of the application launch tile.\nMessage.NavTargetResolutionError=\\u7121\\u6CD5\\u89E3\\u6C7A\\u529F\\u80FD\\u78DA "{0}" \\u7684\\u700F\\u89BD\\u76EE\\u6A19\\u3002\\n\\n\\u6700\\u53EF\\u80FD\\u7684\\u539F\\u56E0\\u662F\\u4F7F\\u7528\\u7121\\u6548\\u7684 SAP Fiori \\u555F\\u52D5\\u53F0\\u5167\\u5BB9\\u7D44\\u614B\\uFF0C\\u8996\\u89BA\\u6548\\u679C\\u7121\\u6CD5\\u958B\\u555F\\u61C9\\u7528\\u7A0B\\u5F0F\\u3002\n#XMSG\nMessage.PageIsOutdated=\\u5DF2\\u5132\\u5B58\\u6B64\\u9801\\u9762\\u7684\\u8F03\\u65B0\\u7248\\u672C\\u3002\n#XMSG\nMessage.SaveChanges=\\u8ACB\\u5132\\u5B58\\u60A8\\u7684\\u66F4\\u6539\\u3002\n#XMSG\nMessage.NoSpaces=\\u6C92\\u6709\\u7A7A\\u9593\\u3002\n#XMSG\nMessage.NoSpacesFound=\\u627E\\u4E0D\\u5230\\u7A7A\\u9593\\uFF0C\\u8ACB\\u5617\\u8A66\\u8ABF\\u6574\\u60A8\\u7684\\u641C\\u5C0B\\u3002\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog title.\nCreateSpaceDialog.Title=\\u65B0\\u7A7A\\u9593\n#XTIT\nDeleteDialog.Title=\\u522A\\u9664\n#XMSG\nDeleteDialog.Text=\\u60A8\\u78BA\\u5B9A\\u8981\\u522A\\u9664\\u6240\\u9078\\u7A7A\\u9593\\u55CE\\uFF1F\n#XBUT\nDeleteDialog.ConfirmButton=\\u522A\\u9664\n#XTIT\nDeleteDialog.LockedTitle=\\u5DF2\\u9396\\u4F4F\\u7A7A\\u9593\n#XMSG\nDeleteDialog.LockedText=\\u4F7F\\u7528\\u8005 "{0}" \\u9396\\u4F4F\\u6240\\u9078\\u7A7A\\u9593\\u3002\n#XMSG\nDeleteDialog.TransportRequired=\\u8ACB\\u9078\\u64C7\\u50B3\\u8F38\\u5957\\u4EF6\\u4EE5\\u522A\\u9664\\u6240\\u9078\\u7A7A\\u9593\\u3002\n\n#XMSG\nEditDialog.LockedText=\\u4F7F\\u7528\\u8005 "{0}" \\u9396\\u4F4F\\u6240\\u9078\\u7A7A\\u9593\\u3002\n#XMSG\nEditDialog.TransportRequired=\\u8ACB\\u9078\\u64C7\\u50B3\\u8F38\\u5957\\u4EF6\\u4EE5\\u7DE8\\u8F2F\\u6240\\u9078\\u7A7A\\u9593\\u3002\n#XTIT\nEditDialog.Title=\\u7DE8\\u8F2F\\u7A7A\\u9593\n#XMSG: Parameter "{0}" is the masterLanguage of the page. Parameter "{1}" is the language of the user.\nEditDialog.LanguageMismatch=\\u6B64\\u7A7A\\u9593\\u5DF2\\u4F7F\\u7528\\u8A9E\\u8A00 "{0}" \\u5EFA\\u7ACB\\uFF0C\\u4F46\\u60A8\\u7684\\u767B\\u5165\\u8A9E\\u8A00\\u8A2D\\u70BA "{1}"\\u3002\\u8ACB\\u5C07\\u767B\\u5165\\u8A9E\\u8A00\\u66F4\\u6539\\u70BA "{0}" \\u4EE5\\u7E7C\\u7E8C\\u9032\\u884C\\u3002\n\n#XTIT\nErrorDialog.Title=\\u932F\\u8AA4\n\n#XTIT\nSpaceOverview.Title=\\u7DAD\\u8B77\\u9801\\u9762\n\n#XTIT: "Layout" title of a page composer section.\nTitle.Layout=\\u914D\\u7F6E\n\n#XTIT\nCopyDialog.Title=\\u8907\\u88FD\\u7A7A\\u9593\n#XMSG: Parameter "{0}" is the title of the page being copied.\nCopyDialog.Message=\\u60A8\\u8981\\u8907\\u88FD "{0}" \\u55CE\\uFF1F\n#XFLD\nCopyDialog.NewID={0} \\u7684\\u526F\\u672C\n\n##############\n# Error Page\n##############\n#XMSG\nErrorPage.Message=\\u5F88\\u62B1\\u6B49\\uFF0C\\u6211\\u5011\\u627E\\u4E0D\\u5230\\u6B64\\u7A7A\\u9593\\u3002\n#XLNK\nErrorPage.Link=\\u7DAD\\u8B77\\u7A7A\\u9593\n',
	"sap/ushell/applications/SpaceDesigner/localService/mockserver.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

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
	"sap/ushell/applications/SpaceDesigner/manifest.json":'{\n    "_version": "1.17.0",\n    "sap.app": {\n        "i18n": "i18n/i18n.properties",\n        "id": "sap.ushell.applications.SpaceDesigner",\n        "type": "component",\n        "embeddedBy": "",\n        "title": "{{SpaceDesigner.AppTitle}}",\n        "ach": "CA-FLP-FE-COR",\n        "dataSources": {\n            "SpaceRepositoryService": {\n                "uri": "/sap/opu/odata/UI2/FDM_SPACE_REPOSITORY_SRV/",\n                "type": "OData",\n                "settings": {\n                    "odataVersion": "2.0",\n                    "localUri": "localService/space/metadata.xml"\n                }\n            }\n        },\n        "cdsViews": [],\n        "offline": false\n    },\n    "sap.ui": {\n        "technology": "UI5",\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": false,\n            "phone": false\n        },\n        "fullWidth": true\n    },\n    "sap.ui5": {\n        "resources": {\n            "js": [],\n            "css": [\n                {\n                    "uri": "css/style.css"\n                }\n            ]\n        },\n        "autoPrefixId": true,\n        "componentUsages": {\n            "transportInformation": {\n                "name": "sap.ushell_abap.transport",\n                "lazy": true,\n                "componentData": {\n                    "supported": true\n                }\n            }\n        },\n        "dependencies": {\n            "minUI5Version": "1.72.0",\n            "libs": {\n                "sap.ui.core": {\n                    "lazy": false\n                },\n                "sap.f": {\n                    "lazy": false\n                },\n                "sap.m": {\n                    "lazy": false\n                },\n                "sap.ui.layout": {\n                    "lazy": false\n                },\n                "sap.ushell": {\n                    "lazy": false\n                }\n            },\n            "components": {\n                "sap.ushell_abap.transport": {\n                    "lazy": true,\n                    "manifest" : true\n                }\n            }\n        },\n        "models": {\n            "SpaceRepository": {\n                "dataSource": "SpaceRepositoryService",\n                "preload": true,\n                "settings": {\n                    "defaultCountMode": "None",\n                    "skipMetadataAnnotationParsing": true,\n                    "useBatch": true\n                }\n            },\n            "i18n": {\n                "type": "sap.ui.model.resource.ResourceModel",\n                "uri": "i18n/i18n.properties"\n            }\n        },\n        "rootView": {\n            "viewName": "sap.ushell.applications.SpaceDesigner.view.App",\n            "type": "XML",\n            "async": true,\n            "id": "SpaceDesigner"\n        },\n        "handleValidation": false,\n        "config": {\n            "fullWidth": true,\n            "sapFiori2Adaptation": true,\n            "enableCreate": true,\n            "enablePreview": false,\n            "checkLanguageMismatch": true\n        },\n        "routing": {\n            "config": {\n                "routerClass": "sap.m.routing.Router",\n                "viewType": "XML",\n                "viewPath": "sap.ushell.applications.SpaceDesigner.view",\n                "controlId": "spaceDesigner",\n                "controlAggregation": "pages",\n                "async": true,\n                "fullWidth" : true\n            },\n            "routes": [\n                {\n                    "pattern": "",\n                    "name": "overview",\n                    "target": "overview"\n                },\n                {\n                    "pattern": "view/{spaceId}:?query:",\n                    "name": "view",\n                    "target": "view"\n                },\n                {\n                    "pattern": "edit/{spaceId}:?query:",\n                    "name": "edit",\n                    "target": "edit"\n                },\n                {\n                    "pattern": "error/{spaceId}",\n                    "name": "error",\n                    "target": "error"\n                }\n            ],\n            "targets": {\n                "overview": {\n                    "viewId": "spaceOverview",\n                    "viewName": "SpaceOverview"\n                },\n                "view": {\n                    "viewId": "view",\n                    "viewName": "SpaceDetail"\n                },\n                "error": {\n                    "viewId": "error",\n                    "viewName": "ErrorPage"\n                }\n            }\n        },\n        "contentDensities": { "compact": true, "cozy": true }\n    }\n}\n',
	"sap/ushell/applications/SpaceDesigner/test/initMockServer.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

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
        "/sap/opu/odata/UI2/FDM_SPACE_REPOSITORY_SRV/",
        "../localService/space/metadata.xml",
        {
            sMockdataBaseUrl: "../localService/space/mockData"
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
                name: "sap.ushell.applications.SpaceDesigner",
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
	"sap/ushell/applications/SpaceDesigner/util/SpacePersistence.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview SpacePersistence utility to interact with the /UI2/FDM_SPACE_REPOSITORY_SRV service on ABAP
 * @version 1.74.0
 */
sap.ui.define([], function () {
    "use strict";

    /**
     * Constructs a new instance of the SpacePersistence utility.
     *
     * @param {sap.ui.model.odata.v2.ODataModel} oDataModel The ODataModel for the SpacePersistenceService
     * @param {sap.base.i18n.ResourceBundle} oResourceBundle The translation bundle
     * @constructor
     *
     * @since 1.70.0
     *
     * @private
     */
    var SpacePersistence = function (oDataModel, oResourceBundle) {
        this._oODataModel = oDataModel;
        this._oResourceBundle = oResourceBundle;
        this._oEtags = {};
    };

    /**
     * Returns a promise which resolves to an array of space headers of all available spaces.
     *
     * @returns {Promise<object[]>} Resolves to an array of spaces headers
     *
     * @since 1.70.0
     *
     * @protected
     */
    SpacePersistence.prototype.getSpaces = function () {
        return this._readSpaces()
            .then(function (spaces) {
                for (var i = 0; i < spaces.results.length; i++) {
                    this._storeETag(spaces.results[i]);
                }
                return spaces;
            }.bind(this))
            .then(this._convertODataToSpaceList)
            .catch(this._rejectWithErrorMessage.bind(this));
    };

    /**
     * Returns a space
     *
     * @param {string} sSpaceId The space ID
     * @returns {Promise<object>} Resolves to a space
     *
     * @since 1.70.0
     *
     * @protected
     */
    SpacePersistence.prototype.getSpace = function (sSpaceId) {
        return this._readSpace(sSpaceId)
            .then(function (space) {
                this._storeETag(space);
                return space;
            }.bind(this))
            .then(this._convertODataToReferenceSpace)
            .catch(this._rejectWithErrorMessage.bind(this));
    };

    /**
     * Creates a new space
     *
     * @param {object} oSpaceToCreate The new space
     * @returns {Promise} Resolves when the space has been created successfully
     *
     * @since 1.70.0
     *
     * @protected
     */
    SpacePersistence.prototype.createSpace = function (oSpaceToCreate) {
        var spaceToCreate = this._convertReferenceSpaceToOData(oSpaceToCreate);

        return this._createSpace(spaceToCreate).then(this._storeETag.bind(this));
    };

    /**
     * Updates a space. This method expects to get the complete space. Pages
     * that are left out will be deleted.
     *
     * @param {object} oUpdatedSpace The updated space data
     * @returns {Promise} Resolves when the space has been updated successfully
     *
     * @since 1.70.0
     *
     * @protected
     */
    SpacePersistence.prototype.updateSpace = function (oUpdatedSpace) {
        var oUpdatedODataSpace = this._convertReferenceSpaceToOData(oUpdatedSpace);

        oUpdatedODataSpace.modifiedOn = this._oEtags[oUpdatedSpace.content.id].modifiedOn;

        return this._createSpace(oUpdatedODataSpace)
            .then(this._storeETag.bind(this))
            .catch(this._rejectWithErrorMessage.bind(this));
    };

    /**
     * Deletes a  space
     *
     * @param {string} sSpaceId The ID of the space to be deleted
     * @param {string} sTransportId The transport workbench
     * @returns {Promise} Resolves when the space has been deleted successfully
     *
     * @since 1.70.0
     *
     * @protected
     */
    SpacePersistence.prototype.deleteSpace = function (sSpaceId, sTransportId) {
        return new Promise(function (resolve, reject) {
            this._oODataModel.callFunction("/deleteSpace", {
                method: "POST",
                urlParameters: {
                    spaceId: sSpaceId,
                    transportId: sTransportId,
                    modifiedOn: this._oEtags[sSpaceId].modifiedOn
                },
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Copy a  space
     *
     * @param  {object} oSpaceToCreate The space data to copy
     * @returns {Promise} Resolves when the space has been deleted successfully
     *
     * @since 1.70.0
     *
     * @protected
     */
    SpacePersistence.prototype.copySpace = function (oSpaceToCreate) {
        return new Promise(function (resolve, reject) {
            this._oODataModel.callFunction("/copySpace", {
                method: "POST",
                urlParameters: {
                    targetId: oSpaceToCreate.content.targetId.toUpperCase(),
                    sourceId: oSpaceToCreate.content.sourceId,
                    title: oSpaceToCreate.content.title,
                    devclass: oSpaceToCreate.metadata.devclass,
                    transportId: oSpaceToCreate.metadata.transportId
                },
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Reads the headers of the available spaces from the server
     *
     * @returns {Promise<object>} Resolves to the space headers in the OData format
     *
     * @since 1.70.0
     *
     * @private
     */
    SpacePersistence.prototype._readSpaces = function () {
        return new Promise(function (resolve, reject) {
            this._oODataModel.read("/spaceSet", {
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Reads a space from the server
     *
     * @param {string} sSpaceId The space ID
     * @returns {Promise<object>} Resolves to a space in the OData format
     *
     * @since 1.70.0
     *
     * @private
     */
    SpacePersistence.prototype._readSpace = function (sSpaceId) {
        return new Promise(function (resolve, reject) {
            this._oODataModel.read("/spaceSet('" + encodeURIComponent(sSpaceId) + "')", {
                urlParameters: {
                    "$expand": "pages"
                },
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Creates a space on the server
     *
     * @param {object} oNewSpace The space data
     * @returns {Promise} Space the OData format
     *
     * @since 1.70.0
     *
     * @private
     */
    SpacePersistence.prototype._createSpace = function (oNewSpace) {
        return new Promise(function (resolve, reject) {
            this._oODataModel.create("/spaceSet", oNewSpace, {
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Converts a list of space headers from the OData format into the FLP internal format
     *
     * @param {object[]} aSpaces The space headers in the OData format
     * @returns {object[]} The space headers in the FLP-internal format
     *
     * @since 1.70.0
     *
     * @private
     */
    SpacePersistence.prototype._convertODataToSpaceList = function (aSpaces) {
        return aSpaces.results.map(function (oSpace) {
            return {
                content: {
                    id: oSpace.id,
                    title: oSpace.title,
                    description: oSpace.description,
                    createdBy: oSpace.createdBy,
                    createdByFullname: oSpace.createdByFullname,
                    createdOn: oSpace.createdOn,
                    modifiedBy: oSpace.modifiedBy,
                    modifiedByFullname: oSpace.modifiedByFullname,
                    modifiedOn: oSpace.modifiedOn,
                    masterLanguage: oSpace.masterLanguage
                },
                metadata: {
                    devclass: oSpace.devclass,
                    transportId: oSpace.transportId
                }
            };
        });
    };

    /**
     * Converts a reference space from the OData format to the FLP internal format
     *
     * @param {object} oSpace The space in the OData format
     * @returns {object} The space in the FLP format
     *
     * @since 1.70.0
     *
     * @private
     */
    SpacePersistence.prototype._convertODataToReferenceSpace = function (oSpace) {
        return {
            content: {
                id: oSpace.id,
                title: oSpace.title,
                description: oSpace.description,
                createdBy: oSpace.createdBy,
                createdByFullname: oSpace.createdByFullname,
                createdOn: oSpace.createdOn,
                modifiedBy: oSpace.modifiedBy,
                modifiedByFullname: oSpace.modifiedByFullname,
                modifiedOn: oSpace.modifiedOn,
                masterLanguage: oSpace.masterLanguage,
                pages: oSpace.pages.results.map(function (page) {
                    return {
                        id: page.id,
                        title: page.title
                    };
                })
            },
            metadata: {
                transportId: oSpace.transportId,
                devclass: oSpace.devclass
            }
        };
    };

    /**
     * Converts the reference space from the FLP internal format to the OData format
     *
     * @param {object} oSpace The space in the FLP format
     * @returns {object} The space in the OData format
     *
     * @since 1.70.0
     *
     * @private
     */
    SpacePersistence.prototype._convertReferenceSpaceToOData = function (oSpace) {
        var oReferenceSpace = oSpace.content,
            oMetadata = oSpace.metadata;

        var oODataSpace = {
            id: oReferenceSpace.id,
            title: oReferenceSpace.title,
            description: oReferenceSpace.description,
            devclass: oMetadata.devclass,
            transportId: oMetadata.transportId,
            pages: (oReferenceSpace.pages || []).map(function (page) {
                return {
                    id: page.id,
                    title: page.title
                };
            })
        };

        return oODataSpace;
    };

    /**
     * Stores the etag for a newly retrieved
     *
     * @param {object} oSpace The newly retrieved
     *
     * @since 1.70.0
     *
     * @private
     */
    SpacePersistence.prototype._storeETag = function (oSpace) {
        this._oEtags[oSpace.id] = {
            // this is used as an etag for the deep update
            modifiedOn: oSpace.modifiedOn,
            // this etag is used for deletion
            etag: oSpace.__metadata.etag
        };
    };

    /**
     * Aborts all the pending requests
     * @since 1.72.0
     */
    SpacePersistence.prototype.abortPendingBackendRequests = function () {
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
    SpacePersistence.prototype._rejectWithErrorMessage = function (oError) {
        var sErrorMessage;

        if (oError.statusCode === "412") {
            sErrorMessage = this._oResourceBundle.getText("Message.SpaceIsOutdated");
        } else {
            try {
                sErrorMessage = JSON.parse(oError.responseText).error.message.value || oError.message;
            } catch (error) {
                sErrorMessage = oError.message;
            }
        }
        return Promise.reject(sErrorMessage);
    };



    return SpacePersistence;
}, true /* bExport */);
},
	"sap/ushell/applications/SpaceDesigner/util/Transport.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

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
     * @param {sap.ushell.applications.SpaceDesigner.controller.CreateSpaceDialog} oDialog The dialog controller
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
     * @param {sap.ushell.applications.SpaceDesigner.controller.CreateSpaceDialog} dialog The dialog controller
     * @param {object} transportComponent The component with the transport fields
     * @param {function} onConfirm The confirm function
     * @returns {sap.ushell.applications.SpaceDesigner.controller.CreateSpaceDialog} The enhanced dialog
     *
     * @protected
     */
    TransportHelper.prototype.enhanceDialogWithTransport = function (dialog, transportComponent, onConfirm) {
        var fnChangeHandler = this._changeHandler(dialog);
        fnChangeHandler(false);
        var fnConfirmHandler = function (spaceInfo) {
            var oSpaceInfo = transportComponent.decorateResultWithTransportInformation(spaceInfo);
            onConfirm(oSpaceInfo);
        };
        transportComponent.attachChangeEventHandler(fnChangeHandler);
        dialog.attachConfirm(fnConfirmHandler);
        dialog.transportExtensionPoint(transportComponent);

        return dialog;
    };

    return TransportHelper;
});
},
	"sap/ushell/applications/SpaceDesigner/view/App.view.xml":'<mvc:View\n        controllerName="sap.ushell.applications.SpaceDesigner.controller.App"\n        xmlns="sap.m"\n        xmlns:mvc="sap.ui.core.mvc"\n        height="100%"\n        class="sapUiGlobalBackgroundColor"\n        displayBlock="true">\n    <NavContainer id="spaceDesigner" />\n</mvc:View>',
	"sap/ushell/applications/SpaceDesigner/view/CopySpaceDialog.fragment.xml":'<Dialog\n    xmlns="sap.m"\n    id="copyDialog"\n    title="{i18n>CopyDialog.Title}"\n    beforeOpen=".onBeforeOpen"\n    afterClose=".destroy"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:core="sap.ui.core"\n    core:require="{\n        formatMessage: \'sap/base/strings/formatMessage\',\n        String: \'sap/ui/model/type/String\',\n        CustomString: \'sap/ushell/applications/SpaceDesigner/controller/CustomString\'\n    }">\n    <content>\n        <f:SimpleForm id="copyForm" editable="true">\n            <Text id="copyMessage" text="{\n                parts: [\'i18n>CopyDialog.Message\', \'/sourceId\'],\n                formatter: \'formatMessage\'\n            }" />\n            <Label id="copySpaceIdLabel" text="{i18n>Label.SpaceID}" labelFor="copyId" />\n            <Input\n                maxLength="35"\n                required="true"\n                id="copySpaceIdInput"\n                placeholder="{\n                    parts: [\'i18n>Placeholder.CopySpaceTitle\', \'/sourceId\'],\n                    formatter: \'formatMessage\'\n                }"\n                change=".onSpaceIDChange"\n                liveChange=".onSpaceIDLiveChange"\n                valueLiveUpdate="true"\n                value="{ path: \'/targetId\',\n                         type: \'CustomString\'\n                       }" />\n            <Label id="copyTitleLabel" text="{i18n>Label.Title}" labelFor="copyTitle" />\n            <Input\n                id="copyTitle"\n                required="true"\n                maxLength="100"\n                value="{ path: \'/title\', type: \'String\' }"\n                liveChange=".onTitleLiveChange"\n                valueLiveUpdate="true"\n                valueStateText="{i18n>Message.EmptyTitle}"\n                placeholder="{\n                    parts: [\'i18n>Placeholder.CopySpaceTitle\', \'/sourceTitle\'],\n                    formatter: \'formatMessage\'\n                }" />\n        </f:SimpleForm>\n        <core:ComponentContainer id="transportContainer" lifecycle="Application"/>\n    </content>\n    <beginButton>\n        <Button\n            id="copySpaceSaveButton"\n            type="Emphasized"\n            text="{i18n>Button.Copy}"\n            press=".onConfirm"\n            enabled="{ path: \'/validation\', formatter: \'.validate\' }" />\n    </beginButton>\n    <endButton>\n        <Button id="copySpaceCancelButton" text="{i18n>Button.Cancel}" press=".onCancel" />\n    </endButton>\n</Dialog>\n',
	"sap/ushell/applications/SpaceDesigner/view/CreateSpaceDialog.fragment.xml":'<Dialog\n    xmlns="sap.m"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:core="sap.ui.core"\n    id="createSpaceDialog"\n    title="{i18n>CreateSpaceDialog.Title}"\n    beforeOpen=".onBeforeOpen"\n    afterClose=".destroy"\n    core:require="{\n        String: \'sap/ui/model/type/String\',\n        CustomString: \'sap/ushell/applications/SpaceDesigner/controller/CustomString\'\n    }">\n    <content>\n        <f:SimpleForm id="createSpaceDialogForm" editable="true">\n            <Label id="createSpaceIdLabel" text="{i18n>Label.SpaceID}" />\n            <Input\n                maxLength="35"\n                required="true"\n                id="createSpaceIdInput"\n                change=".onSpaceIDChange"\n                liveChange=".onSpaceIDLiveChange"\n                valueLiveUpdate="true"\n                value="{ path: \'/id\', type: \'CustomString\' }" />\n            <Label id="createSpaceTitleLabel" text="{i18n>Label.Title}" />\n            <Input\n                maxLength="100"\n                required="true"\n                id="createSpaceTitleInput"\n                liveChange=".onTitleLiveChange"\n                valueLiveUpdate="true"\n                valueStateText="{i18n>Message.EmptyTitle}"\n                value="{ path: \'/title\', type: \'String\' }" />\n        </f:SimpleForm>\n        <core:ComponentContainer id="transportContainer" lifecycle="Application"/>\n    </content>\n    <beginButton>\n        <Button\n            id="createSpaceSaveButton"\n            type="Emphasized"\n            text="{i18n>Button.Create}"\n            press=".onConfirm"\n            enabled="{ path: \'/validation\', formatter: \'.validate\' }" />\n    </beginButton>\n    <endButton>\n        <Button id="createSpaceCancelButton" text="{i18n>Button.Cancel}" press=".onCancel" />\n    </endButton>\n</Dialog>\n',
	"sap/ushell/applications/SpaceDesigner/view/DeleteDialog.fragment.xml":'<core:FragmentDefinition\n        xmlns="sap.m"\n        xmlns:core="sap.ui.core" >\n    <Dialog\n            id="deleteDialog"\n            title="{i18n>DeleteDialog.Title}"\n            type="Message"\n            afterClose=".destroy"\n            state="Warning">\n        <content>\n            <Text id="deleteMessage" text="{/message}" />\n\n            <core:ComponentContainer id="transportContainer" lifecycle="Application"/>\n        </content>\n\n        <beginButton>\n            <Button id="deleteConfirmButton"\n                    text="{i18n>DeleteDialog.ConfirmButton}"\n                    press=".onConfirm"\n                    type="Emphasized"\n                    enabled="{ path: \'/validation\', formatter: \'.validate\' }" />\n        </beginButton>\n\n        <endButton>\n            <Button id="deleteCancelButton" text="{i18n>Button.Cancel}" press="onCancel" />\n        </endButton>\n    </Dialog>\n</core:FragmentDefinition>',
	"sap/ushell/applications/SpaceDesigner/view/EditDialog.fragment.xml":'<core:FragmentDefinition\n        xmlns="sap.m"\n        xmlns:core="sap.ui.core" >\n    <Dialog\n            id="editDialog"\n            title="{i18n>EditDialog.Title}"\n            type="Message"\n            afterClose=".destroy"\n            state="Warning">\n        <content>\n            <Text id="editMessage" text="{/message}" />\n\n            <core:ComponentContainer id="transportContainer" lifecycle="Application"/>\n        </content>\n\n        <beginButton>\n            <Button id="editSaveButton"\n                    text="{i18n>Button.Save}"\n                    press=".onConfirm"\n                    type="Emphasized"\n                    enabled="{ path: \'/validation\', formatter: \'.validate\' }" />\n        </beginButton>\n\n        <endButton>\n            <Button id="editCancelButton"\n                    text="{i18n>Button.Cancel}"\n                    press="onCancel" />\n        </endButton>\n    </Dialog>\n</core:FragmentDefinition>',
	"sap/ushell/applications/SpaceDesigner/view/ErrorDialog.fragment.xml":'<core:FragmentDefinition\n        xmlns="sap.m"\n        xmlns:core="sap.ui.core" >\n    <Dialog\n        id="errorDialog"\n        title="{i18n>ErrorDialog.Title}"\n        type="Message"\n        afterClose=".onAfterClose"\n        contentWidth="30rem"\n        state="Error">\n        <content>\n            <VBox id="errorDialogMessageWrapper">\n                <Text\n                    id="errorDialogMessageText"\n                    text="{/message}"\n                    class="sapUiSmallMarginBottom" />\n                <Link\n                    id="errorDialogMessageLink"\n                    text="{i18n>Button.ShowDetails}"\n                    visible="{=!${/showDetails}}"\n                    press=".onShowDetails" />\n            </VBox>\n            <VBox  id="errorDialogDetailsWrapper" visible="{/showDetails}">\n                <Text id="errorDialogResponseCodeText" text="{i18n>Label.ResponseCode} {/statusCode} - {/statusText}" class="sapUiSmallMarginBottom" />\n                <Text id="errorDialogDetailsText" text="{i18n>Label.Details}" />\n                <Text id="errorDialogDescriptionText" text="{/description}" renderWhitespace="true" />\n            </VBox>\n        </content>\n\n        <buttons>\n            <Button id="errorDialogButtonConfirm" text="{i18n>Button.Ok}" press=".onConfirm" />\n            <Button id="errorDialogButtonCopy" text="{i18n>Button.Copy}" press=".onCopy" />\n        </buttons>\n    </Dialog>\n</core:FragmentDefinition>',
	"sap/ushell/applications/SpaceDesigner/view/ErrorPage.view.xml":'<mvc:View\n    controllerName="sap.ushell.applications.SpaceDesigner.controller.ErrorPage"\n    height="100%"\n    xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m">\n    <MessagePage\n            id="messagePageError"\n            showHeader="false"\n            text="{i18n>ErrorPage.Message}"\n            icon="sap-icon://document">\n        <customDescription>\n            <Link text="{i18n>ErrorPage.Link}" press=".onLinkPress"/>\n        </customDescription>\n    </MessagePage>\n</mvc:View>\n',
	"sap/ushell/applications/SpaceDesigner/view/SpaceDetail.view.xml":'<mvc:View\n    controllerName="sap.ushell.applications.SpaceDesigner.controller.SpaceDetail"\n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:f="sap.f"\n    xmlns:mvc="sap.ui.core.mvc">\n    <f:DynamicPage\n        id="spaceDetail"\n        fitContent="true"\n        class="sapUshellSpaceLayout sapUiNoContentPadding"\n        backgroundDesign="Transparent">\n        <f:title>\n            <f:DynamicPageTitle id="dynamicPageTitle">\n                <f:heading>\n                    <Title id="title" text="{/space/content/title}" />\n                </f:heading>\n                <f:expandedContent>\n                    <HBox displayInline="true" id="hboxExpanded">\n                        <ObjectAttribute id="objectAttributeSpaceIdExpanded" title="{i18n>Label.SpaceID}" text="{/space/content/id}">\n                            <customData>\n                                <core:CustomData key="help-id" value="FLPSpace-Designer-SpaceDetail-Header" writeToDom="true" />\n                            </customData>\n                        </ObjectAttribute>\n                        <!-- TBD: make visible when the role ID is available -->\n                        <ObjectAttribute\n                            id="objectAttributeRoleExpanded"\n                            visible="false"\n                            title="{i18n>Label.AssignedRole}"\n                            text=""\n                            class="sapUiLargeMarginBegin" />\n                    </HBox>\n                </f:expandedContent>\n                <f:snappedContent>\n                    <HBox displayInline="true" id="hboxSnapped">\n                        <ObjectAttribute id="objectAttributeSpaceIdSnapped" title="{i18n>Label.SpaceID}" text="{/space/content/id}" />\n                        <!-- TBD: make visible when the role ID is available -->\n                        <ObjectAttribute\n                            id="objectAttributeRoleSnapped"\n                            visible="false"\n                            title="{i18n>Label.AssignedRole}"\n                            text="assigned role"\n                            class="sapUiLargeMarginBegin" />\n                    </HBox>\n                </f:snappedContent>\n                <f:actions>\n                    <Button\n                        id="buttonCopy"\n                        text="{i18n>Button.Copy}"\n                        type="Transparent"\n                        press=".onCopy"\n                        visible="{SupportedOperationModel>/copySupported}">\n                        <customData>\n                            <core:CustomData key="help-id" value="FLPSpace-Designer-SpaceDetail-Button-CopySpace" writeToDom="true" />\n                        </customData>\n                    </Button>\n                    <Button\n                        id="buttonDelete"\n                        text="{i18n>Button.Delete}"\n                        type="Transparent"\n                        press=".onDelete"\n                        visible="{SupportedOperationModel>/deleteSupported}">\n                        <customData>\n                            <core:CustomData key="help-id" value="FLPSpace-Designer-SpaceDetail-Button-DeleteSpace" writeToDom="true" />\n                        </customData>\n                    </Button>\n                </f:actions>\n            </f:DynamicPageTitle>\n        </f:title>\n        <f:header>\n            <f:DynamicPageHeader id="dynamicPageHeader" pinnable="false">\n                <core:Fragment fragmentName="sap.ushell.applications.SpaceDesigner.view.SpaceInfo" type="XML" />\n            </f:DynamicPageHeader>\n        </f:header>\n        <f:content>\n            <Panel\n                id="panel"\n                height="100%"\n                accessibleRole="Region"\n                backgroundDesign="Transparent"\n                class="sapUiNoContentPadding">\n                <customData>\n                    <core:CustomData key="help-id" value="FLPSpace-Designer-SpaceDetail-Panel-PageListDisplay" writeToDom="true" />\n                </customData>\n                <headerToolbar>\n                    <OverflowToolbar id="layoutOverflowToolbar" design="Transparent" height="3rem" class="sapUshellSpaceLayoutHeader">\n                        <Title id="layoutTitle" class="sapContrastPlus" text="{i18n>Title.Layout}" />\n                        <ToolbarSpacer id="layoutToolbarSpacer" />\n                        <Button id="layoutButtonEdit" text="{i18n>Button.Edit}" type="Emphasized" press=".onEdit" >\n                            <customData>\n                                <core:CustomData key="help-id" value="FLPSpace-Designer-SpaceDetail-Button-Edit" writeToDom="true" />\n                            </customData>\n                        </Button>\n                    </OverflowToolbar>\n                </headerToolbar>\n                <content>\n                    <!-- <core:Fragment fragmentName="sap.ushell.applications.SpaceDesigner.view.PageList" type="XML" /> -->\n                </content>\n            </Panel>\n        </f:content>\n    </f:DynamicPage>\n</mvc:View>\n',
	"sap/ushell/applications/SpaceDesigner/view/SpaceInfo.fragment.xml":'<core:FragmentDefinition\n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:f="sap.f">\n    <HeaderContainer id="spaceInfoHeaderContainer">\n        <VBox id="spaceInfoDescriptionWrapper">\n            <ObjectAttribute\n                id="spaceInfoDescription"\n                title="{i18n>Label.Description}"\n                text="{/space/content/description}" />\n        </VBox>\n        <VBox visible="{/transportSupported}" id="spaceInfoMetadataTransportWrapper">\n            <ObjectAttribute\n                id="spaceInfoPackage"\n                title="{i18n>Label.Package}"\n                text="{/space/metadata/devclass}" />\n            <ObjectAttribute\n                id="spaceInfoWorkbenchRequest"\n                title="{i18n>Label.WorkbenchRequest}"\n                text="{/space/metadata/transportId}"\n                visible="{=!!${/space/metadata/transportId}}" />\n        </VBox>\n        <VBox id="spaceInfoMetadataCreatedWrapper">\n            <ObjectAttribute\n                id="spaceInfoCreatedByFullname"\n                title="{i18n>Label.CreatedByFullname}"\n                text="{/space/content/createdByFullname}" />\n            <ObjectAttribute\n                id="spaceInfoCreatedOn"\n                title="{i18n>Label.CreatedOn}"\n                text="{\n                    path: \'/space/content/createdOn\',\n                    type: \'sap.ui.model.type.Date\',\n                    formatOptions: {style: \'medium\'}\n                }" />\n        </VBox>\n        <VBox id="spaceInfoMetadataModifiedWrapper">\n            <ObjectAttribute\n                id="spaceInfoModifiedByFullname"\n                title="{i18n>Label.ChangedByFullname}"\n                text="{/space/content/modifiedByFullname}" />\n            <ObjectAttribute\n                id="spaceInfoModifiedOn"\n                title="{i18n>Label.ChangedOn}"\n                text="{\n                    path: \'/space/content/modifiedOn\',\n                    type: \'sap.ui.model.type.Date\',\n                    formatOptions: {style: \'medium\'}\n                }" />\n        </VBox>\n    </HeaderContainer>\n</core:FragmentDefinition>\n',
	"sap/ushell/applications/SpaceDesigner/view/SpaceOverview.view.xml":'<mvc:View\n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:mvc="sap.ui.core.mvc"\n    height="100%"\n    controllerName="sap.ushell.applications.SpaceDesigner.controller.SpaceOverview">\n    <Page id="spaceOverview">\n        <customHeader>\n            <Bar id="titlebar">\n                <contentLeft>\n                    <Title id="title" text="{i18n>SpaceOverview.Title}" class="sapUiMediumMarginBegin">\n                        <customData>\n                            <core:CustomData key="help-id" value="FLPSpace-Designer-SpaceOverview-Header" writeToDom="true" />\n                        </customData>\n                    </Title>\n                </contentLeft>\n            </Bar>\n        </customHeader>\n        <content>\n            <Table\n                class="sapUiMediumMarginBeginEnd sapUiTinyMarginTopBottom sapUiForceWidthAuto"\n                id="table"\n                ariaLabelledBy="title"\n                busy="{/busy}"\n                items="{\n                    path: \'/spaces\',\n                    key: \'id\',\n                    sorter: {\n                        path : \'content/modifiedOn\',\n                        descending: \'true\'\n                    }\n                }"\n                itemPress=".onItemPress"\n                selectionChange=".onSelectionChange"\n                updateFinished=".onTableUpdate"\n                mode="SingleSelectLeft"\n                sticky="ColumnHeaders"\n                noDataText="{i18n>Message.NoSpaces}">\n                <headerToolbar>\n                    <OverflowToolbar design="Solid" id="overflowToolbar">\n                        <Title text="Spaces (0)" level="H2"/>\n                        <ToolbarSpacer id="toolbarSpacer"/>\n                        <SearchField\n                            id="searchField"\n                            showRefreshButton="false"\n                            tooltip="{i18n>Tooltip.Search}"\n                            search=".onSearch"\n                            width="auto">\n                        </SearchField>\n                        <Button\n                            id="addButton"\n                            text="{i18n>Button.Create}"\n                            type="Transparent"\n                            visible="{SupportedOperationModel>/createSupported}"\n                            press=".onAdd">\n                            <customData>\n                                <core:CustomData key="help-id" value="FLPSpace-Designer-SpaceOverview-Button-Create" writeToDom="true" />\n                            </customData>\n                        </Button>\n                        <Button\n                            id="copyButton"\n                            text="{i18n>Button.Copy}"\n                            type="Transparent"\n                            enabled="{buttonStates>/isDeleteAndCopyEnabled}"\n                            visible="{SupportedOperationModel>/copySupported}"\n                            press=".onCopy">\n                            <customData>\n                                <core:CustomData key="help-id" value="FLPSpace-Designer-SpaceOverview-Button-Copy" writeToDom="true" />\n                            </customData>\n                        </Button>\n                        <Button\n                            id="deleteButton"\n                            text="{i18n>Button.Delete}"\n                            type="Transparent"\n                            enabled="{buttonStates>/isDeleteAndCopyEnabled}"\n                            visible="{SupportedOperationModel>/deleteSupported}"\n                            press=".onDelete">\n                            <customData>\n                                <core:CustomData key="help-id" value="FLPSpace-Designer-SpaceOverview-Button-Delete" writeToDom="true" />\n                            </customData>\n                        </Button>\n                    </OverflowToolbar>\n                </headerToolbar>\n                <columns>\n                    <Column id="columnSpaceId">\n                        <ObjectIdentifier title="{i18n>Column.SpaceID}" text="{i18n>Column.SpaceTitle}" />\n                    </Column>\n                    <Column id="columnSpaceDescription">\n                        <Text id="columnTextSpaceDescription" text="{i18n>Column.SpaceDescription}" />\n                    </Column>\n                    <Column id="columnSpaceTransport" width="12%" visible="{/transportSupported}">\n                        <ObjectIdentifier title="{i18n>Column.SpacePackage}" text="{i18n>Column.SpaceWorkbenchRequest}" />\n                    </Column>\n                    <Column id="columnSpaceCreated" width="12%">\n                        <ObjectIdentifier title="{i18n>Column.SpaceCreatedBy}" text="{i18n>Column.SpaceCreatedOn}" />\n                    </Column>\n                    <Column id="columnSpaceChanged" width="12%">\n                        <ObjectIdentifier title="{i18n>Column.SpaceChangedBy}" text="{i18n>Column.SpaceChangedOn}" />\n                    </Column>\n                    <Column id="columnEnd" width="4%" hAlign="End" />\n                </columns>\n                <items>\n                    <ColumnListItem id="columnListItemPage" type="Navigation">\n                        <cells>\n                            <ObjectIdentifier id="objectIdentifierSpaceId" title="{content/id}" text="{content/title}" />\n                        </cells>\n                        <cells>\n                            <Text id="cellTextSpaceDescription" text="{content/description}" />\n                        </cells>\n                        <cells>\n                            <ObjectIdentifier id="cellTextSpaceTransport" title="{metadata/devclass}" text="{metadata/transportId}" />\n                        </cells>\n                        <cells>\n                            <ObjectIdentifier\n                                id="cellTextSpaceCreated"\n                                title="{content/createdByFullname}"\n                                text="{\n                                    path: \'content/createdOn\',\n                                    type: \'sap.ui.model.type.Date\',\n                                    formatOptions: { style: \'medium\' }\n                                }" />\n                        </cells>\n                        <cells>\n                            <ObjectIdentifier\n                                id="cellTextSpaceChanged"\n                                title="{content/modifiedByFullname}"\n                                text="{\n                                    path: \'content/modifiedOn\',\n                                    type: \'sap.ui.model.type.Date\',\n                                    formatOptions: { style: \'medium\' }\n                                }" />\n                        </cells>\n                        <cells>\n                            <Button id="cellButtonSpaceEdit"\n                                    press=".onEdit"\n                                    icon="sap-icon://edit"\n                                    tooltip="{i18n>Button.Edit}"\n                                    type="Transparent" />\n                        </cells>\n                    </ColumnListItem>\n                </items>\n            </Table>\n        </content>\n    </Page>\n</mvc:View>\n'
},"Component-preload"
);
