QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/demoapps/rta/fiori-elements/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"sap/ui/demoapps/rta/test/integration/pages/RTA"
], function(Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "sap.ui.demoapps.rta.fiori-elements.ext.view.",
		autoWait: true,
		asyncPolling: true
	});

	sap.ui.require([
		"sap/ui/demoapps/rta/fiori-elements/test/integration/RTAJourney"
	], function() {
		QUnit.start();
	});
});
