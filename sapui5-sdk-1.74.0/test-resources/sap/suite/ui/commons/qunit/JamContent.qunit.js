/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/suite/ui/commons/JamContent",
	"sap/suite/ui/commons/library",
	"sap/ui/util/Mobile"
], function(QUnitUtils, JamContent, commonsLibrary, Mobile) {
	"use strict";

	// shortcut for sap.suite.ui.commons.InfoTileValueColor
	var InfoTileValueColor = commonsLibrary.InfoTileValueColor;

	// shortcut for sap.suite.ui.commons.InfoTileSize
	var InfoTileSize = commonsLibrary.InfoTileSize;


	Mobile.init();

	QUnit.module("Rendering", {
		beforeEach : function() {
			this.oJamContent = new JamContent("jam-content",{
				size: InfoTileSize.M,
				contentText: "@@notify Great outcome of the Presentation today. The new functionality and the new design was well received.",
				subheader: "about 1 minute ago in Computer Market",
				valueColor: InfoTileValueColor.Neutral,
				truncateValueTo: 4,
				value: "-888"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oJamContent.destroy();
		}
	});

	QUnit.test("JamContent wrapper is working", function(assert) {
		assert.ok(window.document.getElementById("jam-content"), "JamContent was rendered successfully");
	});
});