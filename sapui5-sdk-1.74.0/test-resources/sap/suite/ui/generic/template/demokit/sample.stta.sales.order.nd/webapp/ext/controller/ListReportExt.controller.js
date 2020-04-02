sap.ui.define("STTA_SO_ND.ext.controller.ListReportExt", [	
], function () {
	"use strict";
	return {
		onClickActionNavigatioButton: function (oEvent) {
			var oCrossAppNavigator = sap.ushell && sap.ushell.Container
				&& sap.ushell.Container.getService("CrossApplicationNavigation");
			oCrossAppNavigator.toExternal({
				target: {
					semanticObject: "SalesOrder",
					action: "MultiViews"
				},
				params: {
					mode: 'create'
				}
			});
		},
		onRandomOppID: function (oEvent) {
			var oModel,
				aSelectedContexts = this.extensionAPI.getSelectedContexts();
			for (var i = 0; i < aSelectedContexts.length; i++) {
				oModel = aSelectedContexts[i].getModel();
				oModel.setProperty(aSelectedContexts[i].sPath + "/OpportunityID", (Math.floor(Math.random() * 10000)).toString());
			}
			this.extensionAPI.refreshTable();
		}
	};
});
