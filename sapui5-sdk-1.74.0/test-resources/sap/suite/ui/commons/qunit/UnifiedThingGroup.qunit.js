/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/UnifiedThingGroup",
	"sap/ui/commons/TextView",
	"sap/suite/ui/commons/library",
	"sap/ui/thirdparty/jquery",
	"sap/ui/util/Mobile"
], function(
	QUnitUtils,
	createAndAppendDiv,
	UnifiedThingGroup,
	TextView,
	commonsLibrary,
	jQuery,
	Mobile
) {
	"use strict";

	// shortcut for sap.suite.ui.commons.ThingGroupDesign
	var ThingGroupDesign = commonsLibrary.ThingGroupDesign;

	createAndAppendDiv("content").setAttribute("style", "width: 100%; height: 30%;");


	Mobile.init();

	var oUTG = new UnifiedThingGroup("unified1", {
		title : "Title 1",
		description : "Description 1",
		content : new TextView("content1", { text: "Content 1" })
	});

	oUTG.placeAt("content");

	QUnit.module("Render Tests - sap.suite.ui.commons.UnifiedThingGroup");

	QUnit.test("control rendering tests", function(assert) {
		assert.ok(window.document.getElementById("unified1"), "control was rendered");
		assert.equal(window.document.getElementById("unified1-thing-group-title").innerHTML, "Title 1", "Title should appear in control");
		assert.equal(window.document.getElementById("unified1-thing-group-desc").innerHTML, "Description 1", "Description should appear in control");
		assert.equal(window.document.getElementById("content1").innerHTML, "Content 1", "Content should appear in control");
	});

	QUnit.test("design change", function(assert) {
		var done = assert.async();
		var uiUTG = sap.ui.getCore().byId("unified1");
		assert.equal(uiUTG.getDesign(), ThingGroupDesign.ZeroIndent, "ZeroIndent is a default design");
		assert.equal(jQuery(".sapSuiteUtgContentTopIndent").length, 0, "indentation style not applied");
		uiUTG.addEventDelegate({
			onAfterRendering: function() {
				assert.equal(jQuery(".sapSuiteUtgContentTopIndent").length, 1, "new style applied on design change");
				done();
			}
		});
		uiUTG.setDesign(ThingGroupDesign.TopIndent);
	});
});