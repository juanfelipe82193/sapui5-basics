sap.ui.define(['sap/ui/test/Opa5'], function(Opa5) {
	"use strict";

	// All the arrangements for all Opa tests are defined here
	var Common = Opa5.extend("sap.suite.ui.generic.template.integration.ManageProducts.pages.Common", {
 
		iStartMyApp : function() {

			// start without debug parameter, loads much faster
			// this.iStartMyAppInAFrame("../../../template/demokit/demokit.html?sap-ui-debug=true&responderOn=true&demoApp=products&sap-ui-language=en_US");
			return this.iStartMyAppInAFrame("test-resources/sap/suite/ui/generic/template/demokit/demokit.html?serverDelay=0&responderOn=true&demoApp=sttaproducts&sap-ui-language=en_US");
		},
		iStartMyAppWithChange : function() {
			// start with fake LRep json which contains a change
			return this.iStartMyAppInAFrame("test-resources/sap/suite/ui/generic/template/demokit/demokit.html?serverDelay=0&responderOn=true&withChange=true&demoApp=sttaproducts&sap-ui-language=en_US");
		}
	});

	return Common;

});