sap.ui.define(['sap/ui/test/Opa5'],
	function(Opa5) {
		"use strict";

		return Opa5.extend("sap.suite.ui.generic.template.opa.SalesOrderNonDraft.pages.Common", {
			iStartMyApp : function(opaFrame,oOptions) {
				// start without debug parameter, loads much faster
				// this.iStartMyAppInAFrame("../../../template/demokit/demokit.html?sap-ui-debug=true&responderOn=true&demoApp=products&sap-ui-language=en_US");

				if (oOptions) {
					opaFrame = opaFrame + "&manifest=" + oOptions; //&manifest=manifestWithFCL
				}
				console.log ( "OPA5::Common.js::iStartMyApp" + " opaFrame: " + opaFrame);
				return this.iStartMyAppInAFrame(opaFrame);
			},

			iTeardownMyApp: function() {
				return this.iTeardownMyAppFrame();
			},

			iLookAtTheScreen: function() {
				return this;
			},

			iClickTheButtonWithId: function(sId, sButtonText) {
			 	return this.waitFor({
			 		id: sId,
			 		success: function (oButton) {
			 			oButton.firePress();
			 		},
			 		errorMessage: "The " + sButtonText + " button could not be found"
			 	});
			}
		});
	}
);
