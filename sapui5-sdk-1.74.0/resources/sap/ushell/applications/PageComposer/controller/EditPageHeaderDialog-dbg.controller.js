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
