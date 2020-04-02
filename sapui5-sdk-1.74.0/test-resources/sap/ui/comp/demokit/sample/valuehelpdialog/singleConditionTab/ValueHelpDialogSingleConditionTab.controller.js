sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/type/String'
], function (Controller, typeString) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.valuehelpdialog.singleConditionTab.ValueHelpDialogSingleConditionTab", {
		onInit: function () {
			this._oMultiInput = this.getView().byId("multiInput");
		},

		onValueHelpRequested: function() {
			this._oValueHelpDialog = sap.ui.xmlfragment("sap.ui.comp.sample.valuehelpdialog.singleConditionTab.ValueHelpDialogSingleConditionTab", this);
			this.getView().addDependent(this._oValueHelpDialog);
			this._oValueHelpDialog.setRangeKeyFields([{
				label: "Product",
				key: "ProductId",
				type: "string",
				typeInstance: new typeString({}, {
					maxLength: 7
				})
			}]);

			this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
			this._oValueHelpDialog.open();
		},

		onValueHelpOkPress: function (oEvent) {
			var aTokens = oEvent.getParameter("tokens");
			this._oMultiInput.setTokens(aTokens);
			this._oValueHelpDialog.close();
		},

		onValueHelpCancelPress: function () {
			this._oValueHelpDialog.close();
		},

		onValueHelpAfterClose: function () {
			this._oValueHelpDialog.destroy();
		}
	});
});
