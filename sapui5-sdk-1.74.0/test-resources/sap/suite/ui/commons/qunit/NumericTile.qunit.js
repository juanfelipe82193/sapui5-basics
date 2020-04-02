/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/NumericTile",
	"sap/suite/ui/commons/library",
	"sap/ui/util/Mobile"
], function(QUnitUtils, createAndAppendDiv, NumericTile, commonsLibrary, Mobile) {
	"use strict";

	// shortcut for sap.suite.ui.commons.LoadState
	var LoadState = commonsLibrary.LoadState;

	// shortcut for sap.suite.ui.commons.DeviationIndicator
	var DeviationIndicator = commonsLibrary.DeviationIndicator;

	// shortcut for sap.suite.ui.commons.InfoTileValueColor
	var InfoTileValueColor = commonsLibrary.InfoTileValueColor;

	// shortcut for sap.suite.ui.commons.InfoTileSize
	var InfoTileSize = commonsLibrary.InfoTileSize;

	createAndAppendDiv("uiArea");




	Mobile.init();

	var oNV = new NumericTile("numeric-tile",{
		size: InfoTileSize.L,
		value: "65.5",
		scale: "M",
		unit: "EUR",
		valueColor: InfoTileValueColor.Good,
		indicator: DeviationIndicator.Up,
		title : "US Profit Margin",
		footer : "Current Quarter",
		description: "Desc1",
		state: LoadState.Loaded
	});
	oNV.placeAt("uiArea");

	QUnit.module("Rendering test - sap.suite.ui.commons.NumericTile");

	QUnit.test("Numeric Tile rendered.", function(assert) {
		assert.ok(window.document.getElementById("numeric-tile"), "NumericTile was rendered successfully");
		assert.ok(window.document.getElementById("numeric-tile-title-text"), "Title was rendered successfully");
		assert.ok(window.document.getElementById("numeric-tile-footer-text"), "Footer was rendered successfully");
		assert.ok(window.document.getElementById("numeric-tile-numeric-tile-cnt-indicator"), "Indicator was rendered successfully");
		assert.ok(window.document.getElementById("numeric-tile-numeric-tile-cnt-value"), "Value was rendered successfully");
		assert.ok(window.document.getElementById("numeric-tile-numeric-tile-cnt-scale"), "Scale was rendered successfully");
		assert.ok(window.document.getElementById("numeric-tile-description-text"), "Description was rendered successfully");
	});

});