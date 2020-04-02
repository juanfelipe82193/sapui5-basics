/*global QUnit */
sap.ui.define([
    "sap/ui/qunit/QUnitUtils",
    "sap/ui/qunit/utils/createAndAppendDiv",
    "sap/suite/ui/commons/MonitoringTile",
    "sap/suite/ui/commons/library",
    "sap/ui/util/Mobile"
], function(QUnitUtils, createAndAppendDiv, MonitoringTile, commonsLibrary, Mobile) {
	"use strict";

	// shortcut for sap.suite.ui.commons.LoadState
	var LoadState = commonsLibrary.LoadState;

	// shortcut for sap.suite.ui.commons.InfoTileTextColor
	var InfoTileTextColor = commonsLibrary.InfoTileTextColor;

	// shortcut for sap.suite.ui.commons.InfoTileSize
	var InfoTileSize = commonsLibrary.InfoTileSize;

	createAndAppendDiv("uiArea");




	Mobile.init();

	var oNV = new MonitoringTile("monitoring-tile",{
		size: InfoTileSize.L,
		value: "12",
		title : "Approve Travel Requests",
		footer : "3 overdue requests",
		footerColor: InfoTileTextColor.Critical,
		state: LoadState.Loaded
	});
	oNV.setIconSrc("sap-icon://travel-expense");
	oNV.placeAt("uiArea");

	QUnit.module("Rendering test - sap.suite.ui.commons.MonitoringTile");

	QUnit.test("Monitoring Tile rendered.", function(assert) {
		assert.ok(window.document.getElementById("monitoring-tile"), "MonitoringTile was rendered successfully");
		assert.ok(window.document.getElementById("monitoring-tile-title-text"), "Title was rendered successfully");
		assert.ok(window.document.getElementById("monitoring-tile-footer-text"), "Footer was rendered successfully");
		assert.ok(window.document.getElementById("monitoring-tile-monitoring-tile-cnt-value"), "Value was rendered successfully");
	});

});