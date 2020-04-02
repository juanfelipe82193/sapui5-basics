// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

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