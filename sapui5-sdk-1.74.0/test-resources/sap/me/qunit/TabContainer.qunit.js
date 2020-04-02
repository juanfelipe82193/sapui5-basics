/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/me/TabContainer",
	"sap/m/Button",
	"sap/ui/thirdparty/jquery"
], function(QUnitUtils, createAndAppendDiv, TabContainer, Button, jQuery) {
	"use strict";

	// prepare DOM
	createAndAppendDiv("content");


	var tc = new TabContainer("tc", {
		contentInfo: new Button({text: "Info"}),
		contentAttachments: new Button({text: "Attachments"}),
		contentNotes: new Button({text: "Notes"})
	}).placeAt("content");


	QUnit.test("TabContainer rendered", function(assert) {
		assert.ok(document.getElementById("tc"), "TabContainer should be rendered");
		assert.equal(jQuery(".sapUIMeTabContainerButtons").length, 1, "Buttons area should be rendered");

		var $buttons = jQuery(".sapUIMeTabContainerButtons").children();
		assert.equal($buttons.filter(":eq(0)").length, 1, "First Button should be rendered");
		assert.equal($buttons.filter(":eq(1)").length, 1, "Second Button should be rendered");
		assert.equal($buttons.filter(":eq(2)").length, 1, "Third Button should be rendered");
	});

	QUnit.test("Selection", function(assert) {
		var $buttons = jQuery(".sapUIMeTabContainerButtons").children();
		assert.equal($buttons.filter(":eq(0)").hasClass("sapUIMeTabContainerTabSelected"), true, "First Button should be marked as selected");
		assert.equal($buttons.filter(":eq(1)").hasClass("sapUIMeTabContainerTabSelected"), false,"Second Button should not be marked as selected");
		assert.equal($buttons.filter(":eq(2)").hasClass("sapUIMeTabContainerTabSelected"), false, "Third  Button should not be marked as selected");

		tc.setSelectedTab(1);
		sap.ui.getCore().applyChanges();

		var $buttons = jQuery(".sapUIMeTabContainerButtons").children();
		assert.equal($buttons.filter(":eq(0)").hasClass("sapUIMeTabContainerTabSelected"), false, "First Button should not be marked as selected");
		assert.equal($buttons.filter(":eq(1)").hasClass("sapUIMeTabContainerTabSelected"), true,"Second Button should be marked as selected");
		assert.equal($buttons.filter(":eq(2)").hasClass("sapUIMeTabContainerTabSelected"), false, "Third  Button should not be marked as selected");
	});
});