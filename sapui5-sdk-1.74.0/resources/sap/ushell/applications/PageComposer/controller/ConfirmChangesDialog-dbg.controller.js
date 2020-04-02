// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

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
