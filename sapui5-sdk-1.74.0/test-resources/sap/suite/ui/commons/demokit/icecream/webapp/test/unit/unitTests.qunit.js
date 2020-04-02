/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sap/suite/ui/commons/demo/tutorial/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
