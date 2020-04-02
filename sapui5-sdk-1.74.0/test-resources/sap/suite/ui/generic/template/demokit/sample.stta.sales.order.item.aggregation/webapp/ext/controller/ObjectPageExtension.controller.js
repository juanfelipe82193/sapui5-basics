sap.ui.define("SOITMAGGR.ext.controller.ObjectPageExtension", [
	"sap/m/MessageBox"
], function (MessageBox) {
	"use strict";
	return {
		onShowSelectedCount: function (oEvent) {
			var oControl = oEvent.getSource(),
				oExtensionAPI = this.extensionAPI,
				oTable, aContext;

			while (oControl && !oControl.getTable) { // find control with a getTable method (SmartTable)
				oControl = oControl.getParent();
			}
			oTable = oControl.getTable();
			aContext = oExtensionAPI.getSelectedContexts(oTable.getId());
			MessageBox.information("" + aContext.length);
		}
	};
});
