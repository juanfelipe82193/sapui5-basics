// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

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
