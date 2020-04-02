sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/suite/ui/commons/TileContent",
	"sap/suite/ui/commons/NewsContent",
	"sap/ui/util/Mobile"
], function(QUnitUtils, TileContent, NewsContent, Mobile) {
	"use strict";


	Mobile.init();

	QUnit.module("Rendering", {
		beforeEach : function() {
			this.oTileContent = new TileContent("tile-content", {
				footer: "Current Quarter",
				unit : "EUR",
				size : "Auto",
				content: new NewsContent("news", {
					size : "Auto",
					contentText: "SAP Unveils Powerful New Player Comparison Tool Exclusively on NFL.com",
					subheader: "SAP News"
				})
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oTileContent.destroy();
		}
	});

	QUnit.test("TileContent wrapper is working", function(assert) {
		assert.ok(window.document.getElementById("tile-content"), "TileContent was rendered successfully");
	});
});