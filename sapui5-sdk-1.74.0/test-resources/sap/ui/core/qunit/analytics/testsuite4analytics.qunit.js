/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
/*global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sap/ui/core/qunit/analytics/AnalyticalBinding.qunit",
		"sap/ui/core/qunit/analytics/odata4analytics.qunit",
		"sap/ui/table/qunit/AnalyticalTable.qunit"
	], function () {
		QUnit.start();
	});
});
