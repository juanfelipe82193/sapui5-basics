sap.ui.define("SOITMAGGR.ext.controller.ListReportExtension", [
	"sap/m/StandardListItem",
	"sap/m/Dialog",
	"sap/m/List",
	"sap/m/Button"
], function (StandardListItem, Dialog, List, Button) {
	"use strict";
	return {
		onShowSelected: function (oEvent) {
			var oControl = oEvent.getSource(),
				oExtensionAPI = this.extensionAPI,
				oItemIndex = {},
				aItems = [],
				oTable, aContext, sItem, iItem, oParameterDialog;

			while (oControl && !oControl.getTable) { // find control with a getTable method (SmartTable)
				oControl = oControl.getParent();
			}
			oTable = oControl.getTable();
			aContext = oExtensionAPI.getSelectedContexts(oTable);

			for (var i = 0; i < aContext.length; i++) {
				sItem = aContext[i].getObject().SalesOrderId;
				iItem = oItemIndex[sItem];
				if (iItem >= 0) {
					aItems[iItem].setCounter(aItems[iItem].getCounter() + 1);
				} else {
					iItem = aItems.push(new StandardListItem({
						title: sItem,
						counter: 1
					})) - 1;
					oItemIndex[sItem] = iItem;
				}
			}

			oParameterDialog = new Dialog({
				title: "Show Selected",
				content: [new List({
					headerText: "Sales Order Items (" + aContext.length + ")",
					items: aItems
				})],
				beginButton: new Button({
					text: "OK",
					press: function () {
						oParameterDialog.close();
					}
				}),
				afterClose: function () {
					oParameterDialog.destroy();
				}
			});

			oParameterDialog.open();
		}
	};
});
