sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/suite/ui/commons/NumericContent",
	"sap/suite/ui/commons/library",
	"sap/ui/util/Mobile"
], function(QUnitUtils, NumericContent, commonsLibrary, Mobile) {
	"use strict";

	// shortcut for sap.suite.ui.commons.InfoTileValueColor
	var InfoTileValueColor = commonsLibrary.InfoTileValueColor;

	// shortcut for sap.suite.ui.commons.DeviationIndicator
	var DeviationIndicator = commonsLibrary.DeviationIndicator;

	// shortcut for sap.suite.ui.commons.LoadState
	var LoadState = commonsLibrary.LoadState;

	// shortcut for sap.suite.ui.commons.InfoTileSize
	var InfoTileSize = commonsLibrary.InfoTileSize;


	Mobile.init();

	QUnit.module("Rendering", {
		beforeEach : function() {
			this.oNumericContent = new NumericContent("numeric-content", {
				size : InfoTileSize.L,
				state : LoadState.Loaded,
				scale : "M",
				indicator : DeviationIndicator.Up,
				truncateValueTo : 4,
				nullifyValue : true,
				formatterValue : false,
				valueColor : InfoTileValueColor.Good,
				icon : "sap-icon://customer-financial-fact-sheet"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oNumericContent.destroy();
		}
	});

	QUnit.test("Numeric Content rendered.", function(assert) {
		assert.ok(window.document.getElementById("numeric-content"), "NumericContent was rendered successfully");
	});
});