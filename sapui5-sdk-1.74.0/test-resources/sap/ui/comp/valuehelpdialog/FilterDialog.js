sap.ui.require([
	'sap/ui/comp/valuehelpdialog/ValueHelpDialog',
	'sap/ui/comp/filterbar/FilterBar',
	'sap/ui/comp/valuehelpdialog/ValueHelpRangeOperation',
	'sap/m/Button',
	'sap/m/MessageToast',
	'sap/m/Token'
], function (
		ValueHelpDialog,
		FilterBar,
		ValueHelpRangeOperation,
		Button,
		MessageToast,
		Token
	) {
	"use strict";

	var theFilterButton = new Button({
		text: "Filter"
	});

	theFilterButton.attachPress(function() {

			var oValueHelpDialog = new ValueHelpDialog({
				title: "Enter Some Filters",
				modal: true,
				filterMode: true,
				maxIncludeRanges: -1,
				maxExcludeRanges: 2,

				ok: function(oControlEvent) {
					var aTokens = oControlEvent.getParameter("tokens");

					var sTokens = "";
					for (var i = 0; i < aTokens.length; i++) {
						var oToken = aTokens[i];
						sTokens += oToken.getText() + " ";
					}
					//theTokenInput.setTokens(aTokens);

					MessageToast.show("Tokens= " + sTokens);
					oValueHelpDialog.close();
				},

				cancel: function(oControlEvent) {
					MessageToast.show("Cancel pressed!");
					oValueHelpDialog.close();
				}
			});

			//oValueHelpDialog.setIncludeRangeOperations([ ValueHelpRangeOperation.BT ]);

			oValueHelpDialog.setRangeKeyFields(["CompanyCode"]);

			var rangeToken1 = new Token({key: "i1", text: "ID: a..z"}).data("range", { "exclude": false, "operation": ValueHelpRangeOperation.BT, "keyField": "CompanyCode", "value1": "a", "value2": "z"});
			var rangeToken2 = new Token({key: "i2", text: "ID: =foo"}).data("range", { "exclude": false, "operation": ValueHelpRangeOperation.EQ, "keyField": "CompanyCode", "value1": "foo", "value2": ""});
			var aTokens = [rangeToken1, rangeToken2];
			oValueHelpDialog.setTokens(aTokens);

			if (this.$().closest(".sapUiSizeCompact").length > 0) { // check if the Token field runs in Compact mode
				oValueHelpDialog.addStyleClass("sapUiSizeCompact");
			}

			oValueHelpDialog.open();
		}

	);

	theFilterButton.placeAt("content");

});