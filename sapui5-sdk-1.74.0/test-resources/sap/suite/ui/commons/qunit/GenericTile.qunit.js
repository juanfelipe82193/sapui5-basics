sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/suite/ui/commons/GenericTile",
	"sap/suite/ui/commons/library",
	"sap/suite/ui/commons/TileContent",
	"sap/suite/ui/commons/NumericContent",
	"sap/ui/util/Mobile"
], function(
	QUnitUtils,
	GenericTile,
	commonsLibrary,
	TileContent,
	NumericContent,
	Mobile
) {
	"use strict";

	// shortcut for sap.suite.ui.commons.InfoTileValueColor
	var InfoTileValueColor = commonsLibrary.InfoTileValueColor;

	// shortcut for sap.suite.ui.commons.DeviationIndicator
	var DeviationIndicator = commonsLibrary.DeviationIndicator;

	// shortcut for sap.suite.ui.commons.LoadState
	var LoadState = commonsLibrary.LoadState;

	// shortcut for sap.suite.ui.commons.FrameType
	var FrameType = commonsLibrary.FrameType;


	Mobile.init();

	QUnit.module("Rendering", {
		beforeEach : function() {
			this.oGenericTile = new GenericTile("generic-tile", {
				subheader: "Expenses By Region",
				frameType: FrameType.OneByOne,
				size: "Auto",
				header: "Comparative Annual Totals",
				headerImage: "../demokit/images/people/female_BaySu.jpg",
				tileContent:
					new TileContent("tile-cont", {
						unit: "EUR",
						size:"Auto",
						footer: "Current Quarter",
						content:
							new NumericContent("numeric-cnt", {
								state: LoadState.Loaded,
								scale: "M",
								indicator: DeviationIndicator.Up,
								truncateValueTo: 4,
								value: 20,
								nullifyValue: true,
								formatterValue: false,
								valueColor: InfoTileValueColor.Good,
								icon: "sap-icon://customer-financial-fact-sheet"
							})
					})
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oGenericTile.destroy();
		}
	});

	QUnit.test("GenericTile wrapper is working", function(assert) {
		assert.ok(window.document.getElementById("generic-tile"), "GenericTile was rendered successfully");
	});
});