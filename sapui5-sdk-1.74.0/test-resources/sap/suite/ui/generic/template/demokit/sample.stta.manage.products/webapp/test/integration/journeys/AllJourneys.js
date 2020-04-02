QUnit.config.autostart = false;
QUnit.config.testTimeout = 99999;

sap.ui.require(["sap/ui/test/Opa5",
                "sap/ui/test/opaQunit",
                "STTA_MP/test/integration/pages/Common"
], function (Opa5, Common) {
		sap.ui.define([
			"sap/ui/qunit/qunit-css",
			"sap/ui/thirdparty/qunit",
			"sap/ui/qunit/qunit-junit"
		],function(){

		});
		"use strict";

		Opa5.extendConfig({
			arrangements: new Common(),
			viewNamespace: "STTA_MP.demokit",
			appParams: {
				"sap-ui-animation": false
			}
		});

		sap.ui.require([
		  "STTA_MP/test/integration/journeys/StartApp"
		], function () {
				QUnit.start();
			 }
		);
	}
);
