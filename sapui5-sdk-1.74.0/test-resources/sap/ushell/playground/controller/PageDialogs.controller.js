// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ushell/playground/controller/BaseController",
    "sap/ushell/Config",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/playground/i18n/pageComposer/resources",
    "sap/ushell/applications/PageComposer/controller/CreatePageDialog.controller",
    "sap/ushell/applications/PageComposer/controller/DeleteDialog.controller",
    "sap/ushell/applications/PageComposer/controller/EditDialog.controller",
    "sap/ushell/applications/PageComposer/controller/CopyPageDialog.controller"
], function (
    BaseController,
    Config,
    JSONModel,
    resources,
    CreatePageDialogController,
    DeleteDialogController,
    EditPageDialogController,
    CopyPageDialogController
) {
    "use strict";

    var oModel;

    return BaseController.extend("sap.ushell.playground.controller.PageDialogs", {
        onInit: function () {
            oModel = new JSONModel({
                result: ""
            });
            this.getView().setModel(oModel);

            jQuery.extend(sap, {
                ushell: {
                    Container: {
                        getUser: function () {
                            return {
                                getLanguage: function () {
                                    return "EN";
                                }
                            };
                        }
                    }
                }
            });
        },

        openCreatePageDialogWithTransport: function () {
            var oView = this.getOwnerComponent().getRootControl();
            sap.ui.require([
                "sap/ushell/applications/PageComposer/util/Transport"
            ], function (transportHelper) {
                if (!this.oCreatePageDialogController) {
                    this.oCreatePageDialogController = new CreatePageDialogController(oView);
                }
                this.oCreatePageDialogController.load().then(function () {
                    return this.getOwnerComponent().createTransportComponent().then(function (transportComponent) {
                        return transportHelper.enhanceDialogWithTransport(
                            this.oCreatePageDialogController,
                            transportComponent
                        );
                    }.bind(this));
                }.bind(this)).then(function (enhancedDialog) {
                    if (enhancedDialog) {
                        enhancedDialog.open();
                    }
                });
            }.bind(this));
        },

        openCreatePageDialog: function () {
            var oView = this.getOwnerComponent().getRootControl();

            if (!this.oCreatePageDialogController) {
                this.oCreatePageDialogController = new CreatePageDialogController(oView);
            }
            this.oCreatePageDialogController.load().then(function () {
                this.oCreatePageDialogController.open();
            }.bind(this));
        },

        _createDeleteDialog: function () {
            var oView = this.getOwnerComponent().getRootControl();

            return new Promise(function (resolve) {
                if (!this.oDeleteDialogController) {
                    this.oDeleteDialogController = new DeleteDialogController(oView);
                }
                this.oDeleteDialogController.load().then(function () {
                    this.oDeleteDialogController.getModel().setProperty("/message", resources.i18n.getText("DeleteDialog.Text"));
                    resolve(this.oDeleteDialogController);
                }.bind(this));
            }.bind(this));
        },

        openDeletePageDialog: function () {
            this._createDeleteDialog().then(function (dialogController) {
                dialogController.open();
            });
        },

        openEditPageDialogWithTransport: function () {
            var fnOnConfirm = function (event) {
                event.getSource().getParent().destroy();
            };
            sap.ui.require([
                "sap/ushell/applications/PageComposer/util/Transport"
            ], function (transportHelper) {
                return Promise.all([
                    this.getOwnerComponent().createTransportComponent("TEST_PACKAGE"),
                    this._createEditDialog()
                ]).then(function (result) {
                    var oTransportComponent = result[0];
                    var oDialog = result[1];
                    oDialog.getModel().setProperty("/message", resources.i18n.getText("EditDialog.TransportRequired"));
                    var oEnhancedDialog = transportHelper.enhanceDialogWithTransport(oDialog, oTransportComponent, fnOnConfirm);
                    oEnhancedDialog.open();
                });
            }.bind(this));
        },

        _createEditDialog: function () {
            var oView = this.getOwnerComponent().getRootControl();

            return new Promise(function (resolve) {
                if (!this.oEditPageDialogController) {
                    this.oEditPageDialogController = new EditPageDialogController(oView);
                }
                this.oEditPageDialogController.load().then(function () {
                    resolve(this.oEditPageDialogController);
                }.bind(this));
            }.bind(this));
        },

        openDeletePageDialogWithTransport: function () {
            var fnOnConfirm = function (event) {
                event.getSource().getParent().destroy();
            };
            sap.ui.require([
                "sap/ushell/applications/PageComposer/util/Transport"
            ], function (transportHelper) {
                return Promise.all([
                    this.getOwnerComponent().createTransportComponent("TEST_PACKAGE"),
                    this._createDeleteDialog()
                ]).then(function (result) {
                    var oTransportComponent = result[0];
                    var oDialog = result[1];
                    oDialog.getModel().setProperty("/message", resources.i18n.getText("DeleteDialog.TransportRequired"));
                    var oEnhancedDialog = transportHelper.enhanceDialogWithTransport(oDialog, oTransportComponent, fnOnConfirm);
                    oEnhancedDialog.open();
                });
            }.bind(this));
        },

        _createCopyDialog: function () {
            var oView = this.getOwnerComponent().getRootControl();

            return new Promise(function (resolve) {
                if (!this.oCopyPageDialogController) {
                    this.oCopyPageDialogController = new CopyPageDialogController(oView);
                }
                this.oCopyPageDialogController.load().then(function () {
                    resolve(this.oCopyPageDialogController);
                }.bind(this));
            }.bind(this));
        },

        openCopyPageDialog: function () {
            this._createCopyDialog().then(function (dialogController) {
                dialogController.open();
                dialogController.getModel().setProperty("/sourceId", "SOME-TEST-PAGE");
            });
        },

        openCopyPageDialogWithTransport: function () {
            var fnOnConfirm = function (event) {
                event.getSource().getParent().destroy();
            };
            sap.ui.require([
                "sap/ushell/applications/PageComposer/util/Transport"
            ], function (transportHelper) {
                return Promise.all([
                    this.getOwnerComponent().createTransportComponent("TEST_PACKAGE"),
                    this._createCopyDialog()
                ]).then(function (result) {
                    var oTransportComponent = result[0];
                    var oDialog = result[1];
                    var oEnhancedDialog = transportHelper.enhanceDialogWithTransport(oDialog, oTransportComponent, fnOnConfirm);
                    oEnhancedDialog.open();
                    oDialog.getModel().setProperty("/sourceId", "SOME-TEST-PAGE");
                });
            }.bind(this));
        }
    });
});