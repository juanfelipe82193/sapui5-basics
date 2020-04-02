// ManageProducts AllJournes x
sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/suite/ui/generic/template/integration/ManageProducts/pages/Common",
	"sap/ui/qunit/qunit-css",
	"sap/ui/thirdparty/qunit",
	"sap/ui/qunit/qunit-junit",
	"sap/ui/test/opaQunit",
	"sap/suite/ui/generic/template/integration/ManageProducts/pages/Main",
	"sap/suite/ui/generic/template/integration/ManageProducts/pages/Detail",
	"sap/suite/ui/generic/template/integration/ManageProducts/pages/Item",
	"sap/suite/ui/generic/template/integration/ManageProducts/MainJourneyButtons"
],function(Opa5, Common){
	"use strict";

	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "sap.suite.ui.generic.template.demokit",
		autoWait: true,
		appParams: {
			"sap-ui-animation": false
		},
		timeout: 60
	});
	QUnit.start();
});


