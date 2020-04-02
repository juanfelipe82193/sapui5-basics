/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");

QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ushell/sample/OpaFLPSandbox/test/integration/pages/Common"
], function (Opa5, Common) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "sap.ushell.sample.OpaFLPSandbox.view."
	});

	sap.ui.require([
		"sap/ushell/sample/OpaFLPSandbox/test/integration/pages/Master",
		"sap/ushell/sample/OpaFLPSandbox/test/integration/pages/Detail",
		"sap/ushell/sample/OpaFLPSandbox/test/integration/journeys/MasterJourney"
	], function () {
		QUnit.start();
	});
});
