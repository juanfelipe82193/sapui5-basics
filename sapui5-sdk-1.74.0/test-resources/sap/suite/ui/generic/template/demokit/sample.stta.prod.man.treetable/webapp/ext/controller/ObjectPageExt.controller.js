sap.ui.define("STTAMPTT.ext.controller.ObjectPageExt", [
	"sap/m/MessageBox"
], function(MessageBox) {
	"use strict";
	return {
		onClickAction: function (oEvent) {
			MessageBox.success("Custom Action triggered", {});
		}
	};
});
