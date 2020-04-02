/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/MonitoringContent",
	"sap/suite/ui/commons/library",
	"sap/ui/util/Mobile"
], function(QUnitUtils, createAndAppendDiv, MonitoringContent, commonsLibrary, Mobile) {
	"use strict";

	// shortcut for sap.suite.ui.commons.LoadState
	var LoadState = commonsLibrary.LoadState;

	// shortcut for sap.suite.ui.commons.InfoTileSize
	var InfoTileSize = commonsLibrary.InfoTileSize;

	createAndAppendDiv("uiArea");




	Mobile.init();

	var oMC = new MonitoringContent("monitoring-cnt",{
		size: InfoTileSize.L,
		value: "12",
		state: LoadState.Loaded
	});
	oMC.setIconSrc("sap-icon://travel-expense");
	oMC.placeAt("uiArea");

	QUnit.module("Rendering test - sap.suite.ui.commons.MonitoringContent");

	QUnit.test("Monitoring Content rendered.", function(assert) {
		assert.ok(window.document.getElementById("monitoring-cnt"), "MonitoringContent was rendered successfully");
		assert.ok(window.document.getElementById("monitoring-cnt-value"), "Value was rendered successfully");
		assert.ok(window.document.getElementById("monitoring-cnt-icon"), "Icon was rendered successfully");
	});

});