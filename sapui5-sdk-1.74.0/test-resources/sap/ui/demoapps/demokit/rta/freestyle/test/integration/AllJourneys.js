QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/demoapps/rta/freestyle/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"sap/ui/demoapps/rta/freestyle/test/integration/pages/Browser",
	"sap/ui/demoapps/rta/freestyle/test/integration/pages/Master",
	"sap/ui/demoapps/rta/freestyle/test/integration/pages/NotFound",
	"sap/ui/demoapps/rta/freestyle/test/integration/pages/ProductMaster",
	"sap/ui/demoapps/rta/freestyle/test/integration/pages/ProductDisplay",
	"sap/ui/demoapps/rta/test/integration/pages/RTA"
], function(Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "sap.ui.demoapps.rta.freestyle.view.",
		autoWait: true,
		asyncPolling: true,
		timeout: 100
	});

	sap.ui.require([
		"sap/ui/demoapps/rta/freestyle/test/integration/ProductMasterJourney",
		"sap/ui/demoapps/rta/freestyle/test/integration/NotFoundJourney",
		"sap/ui/demoapps/rta/freestyle/test/integration/RTAJourney",
		"sap/ui/demoapps/rta/freestyle/test/integration/RTAPersonalizationJourney"
	], function() {
		QUnit.start();
	});
});
