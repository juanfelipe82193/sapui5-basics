sap.ui.define("STTAMPTT.ext.controller.ListReportExt", [
	"sap/m/MessageBox"
], function(MessageBox) {
	"use strict";
	return {
		onClickAction: function (oEvent) {
			MessageBox.success("Custom Action triggered", {});
		}
	};
});