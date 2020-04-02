sap.ui.define(['sap/ui/test/Opa5', "sap/ui/test/matchers/AggregationFilled",
               "sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaDataStore",
               "sap/ui/test/actions/Press"],
	function(Opa5, AggregationFilled, OpaDataStore, Press) {
		"use strict";

		return Opa5.extend("sap.suite.ui.generic.template.integration.Common.Common", {
			iStartMyApp : function(oOptions) {
				// start without debug parameter, loads much faster
				// this.iStartMyAppInAFrame("../../../template/demokit/demokit.html?sap-ui-debug=true&responderOn=true&demoApp=products&sap-ui-language=en_US");
				return this.iStartMyAppInAFrame(oOptions);
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
