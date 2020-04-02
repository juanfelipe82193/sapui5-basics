sap.ui.define([
	'sap/ui/comp/library',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/type/String',
	'sap/m/Token'
], function (compLibrary, Controller, typeString, Token) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.valuehelpdialog.conditionsTabOnly.ValueHelpDialogConditionsTabOnly", {
		onInit: function () {
			this._oMultiInput = this.getView().byId("multiInput");
			this._oMultiInput.setTokens(this._getDefaultTokens());
		},

		onValueHelpRequested: function() {
			this._oValueHelpDialog = sap.ui.xmlfragment("sap.ui.comp.sample.valuehelpdialog.conditionsTabOnly.ValueHelpDialogConditionsTabOnly", this);
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
		},

		_getDefaultTokens: function () {
			var ValueHelpRangeOperation = compLibrary.valuehelpdialog.ValueHelpRangeOperation;
			var oToken1 = new Token({
				key: "range_0",
				text: "=HT-1001"
			}).data("range", {
				"exclude": false,
				"operation": ValueHelpRangeOperation.EQ,
				"keyField": "ProductId",
				"value1": "HT-1001",
				"value2": ""
			});
			var oToken2 = new Token({
				key: "range_1",
				text: "!(=HT-1000)"
			}).data("range", {
				"exclude": true,
				"operation": ValueHelpRangeOperation.EQ,
				"keyField": "ProductId",
				"value1": "HT-1000",
				"value2": ""
			});

			return [oToken1, oToken2];
		}
	});
});
