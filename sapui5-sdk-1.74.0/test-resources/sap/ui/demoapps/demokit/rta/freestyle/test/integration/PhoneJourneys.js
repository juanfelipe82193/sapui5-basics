jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/demoapps/rta/freestyle/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"sap/ui/demoapps/rta/freestyle/test/integration/pages/App",
	"sap/ui/demoapps/rta/freestyle/test/integration/pages/Browser",
	"sap/ui/demoapps/rta/freestyle/test/integration/pages/Master",
	"sap/ui/demoapps/rta/freestyle/test/integration/pages/Detail",
	"sap/ui/demoapps/rta/freestyle/test/integration/pages/NotFound"
], function(Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "sap.ui.demoapps.rta.freestyle.view."
	});

	sap.ui.require([
		"sap/ui/demoapps/rta/freestyle/test/integration/NavigationJourneyPhone",
		"sap/ui/demoapps/rta/freestyle/test/integration/NotFoundJourneyPhone",
		"sap/ui/demoapps/rta/freestyle/test/integration/BusyJourneyPhone"
	], function() {
		QUnit.start();
	});
});
