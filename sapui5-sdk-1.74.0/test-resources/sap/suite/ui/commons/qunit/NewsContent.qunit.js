sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/suite/ui/commons/NewsContent",
	"sap/suite/ui/commons/library",
	"sap/m/MessageToast",
	"sap/ui/util/Mobile"
], function(QUnitUtils, NewsContent, commonsLibrary, MessageToast, Mobile) {
	"use strict";

	// shortcut for sap.suite.ui.commons.InfoTileSize
	var InfoTileSize = commonsLibrary.InfoTileSize;


	Mobile.init();

	QUnit.module("Rendering", {
		beforeEach : function() {
			this.oNewsContent = new NewsContent("news-content",{
				size: InfoTileSize.M,
				contentText: "SAP Unveils Powerful New Player Comparison Tool Exclusively on NFL.com",
				subheader: "August 21, 2013",
				tooltip: "Test tooltip",
				press: function (oEvent) {
					MessageToast.show("The news content is pressed.");
				}
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oNewsContent.destroy();
		}
	});

	QUnit.test("NewsContent wrapper is working", function(assert) {
		assert.ok(window.document.getElementById("news-content"), "NewsContent was rendered successfully");
	});
});