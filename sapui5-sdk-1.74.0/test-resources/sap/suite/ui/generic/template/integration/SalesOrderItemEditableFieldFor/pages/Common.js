sap.ui.define(['sap/ui/test/Opa5'], function(Opa5) {
	"use strict";

	return Opa5.extend("sap.suite.ui.generic.template.opa.SalesOrderItemEditableFieldFor.pages.Common", {
		iStartMyApp: function(opaFrame, oOptions) {
			if (oOptions) {
				opaFrame = opaFrame + "&manifest=" + oOptions;
			}
			console.log("OPA5::Common.js::iStartMyApp" + " opaFrame: " + opaFrame);
			return this.iStartMyAppInAFrame(opaFrame);
		},

		iTeardownMyApp: function() {
			return this.iTeardownMyAppFrame();
		}
	});
});
