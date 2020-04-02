/*global QUnit */
sap.ui.define([
	"sap/m/Label",
	"sap/suite/ui/commons/NumericContent",
	"sap/suite/ui/commons/library",
	"sap/suite/ui/commons/HeaderCell",
	"sap/suite/ui/commons/HeaderCellItem",
	"sap/ui/util/Mobile"
], function(Label, NumericContent, commonsLibrary, HeaderCell, HeaderCellItem, Mobile) {
	"use strict";

	// shortcut for sap.suite.ui.commons.InfoTileSize
	var InfoTileSize = commonsLibrary.InfoTileSize;

	// shortcut for sap.suite.ui.commons.DeviationIndicator
	var DeviationIndicator = commonsLibrary.DeviationIndicator;

	// shortcut for sap.suite.ui.commons.InfoTileValueColor
	var InfoTileValueColor = commonsLibrary.InfoTileValueColor;

	Mobile.init();

	QUnit.module("Rendering test - sap.suite.ui.commons.HeaderCell", {
		beforeEach: function() {
			var oNVConfM = new NumericContent("conf-tile-M", {
				value: "1224",
				scale: "MM",
				valueColor: InfoTileValueColor.Good,
				indicator: DeviationIndicator.Up,
				size: InfoTileSize.M,
				formatterValue: false,
				truncateValueTo: 4
			});

			this.oHcNumeric = new HeaderCell("header-cell", {
				north: new HeaderCellItem({
					content: oNVConfM
				})
			});

			this.oHcNumeric.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oHcNumeric.destroy();
		}
	});
	QUnit.test("Header Cell rendered.", function(assert) {
		assert.ok(window.document.getElementById("header-cell"), "HeaderCell was rendered successfully");
		assert.ok(window.document.getElementById("conf-tile-M"), "Numeric content was rendered successfully");
	});
});