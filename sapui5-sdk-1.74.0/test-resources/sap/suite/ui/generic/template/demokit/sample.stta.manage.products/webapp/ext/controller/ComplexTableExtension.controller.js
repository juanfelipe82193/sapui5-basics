sap.ui.define("STTA_MP.ext.controller.ComplexTableExtension", [
	"sap/m/MessageBox"
], function(MessageBox) {
	"use strict";

	return {
		onCTAction1 : function(oEvent) {
			MessageBox.success("Hello from Complex Table custom action 1!", {});
		},	
		onCTAction2 : function(oEvent) {
			MessageBox.success("Hello from Complex Table custom action 2!", {});
		}
	};
});