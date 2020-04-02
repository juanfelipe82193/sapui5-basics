/* global QUnit */

sap.ui.define([
	"sap/ui/vk/DrawerToolbar",
	"sap/m/Button"
], function(
	DrawerToolbar,
	Button
) {
	"use strict";

QUnit.test("Toolbar Creation", function(assert) {
	var Toolbar = new DrawerToolbar();
	assert.ok(Toolbar._getToolbar(), "Toolbar created");
	assert.ok(Toolbar._getToolbar().getContent().length == 18, "All content exists");
	Toolbar.destroy();
});

QUnit.test("Add Content To Toolbar", function(assert) {
	var Toolbar = new DrawerToolbar();
	var button = new Button();
	button.vitId = "QUnitButton";
	var contentToolbar = Toolbar._getToolbar();
	contentToolbar.addContent(button);
	assert.ok(contentToolbar.getContent().length == 19, "Button added to content");
	Toolbar.destroy();
});

QUnit.test("Remove Content From Toolbar", function(assert) {
	var Toolbar = new DrawerToolbar();
	var contentToolbar = Toolbar._getToolbar();
	var getIndex = function(name){
		var content = contentToolbar.getContent();
		for (var i = 0; i < content.length; i++) {
			if (content[i].vitId == name){
				return i;
			}
		}
	};
	contentToolbar.removeContent(getIndex("VIT-Hide"));
	contentToolbar.removeContent(getIndex("VIT-Orbit"));
	assert.ok(contentToolbar.getContent().length == 16, "Buttons removed from content");
	contentToolbar.removeContent(getIndex("VIT-Show"));
	assert.ok(contentToolbar.getContent().length == 14, "Beginning spacer removed automatically");
	contentToolbar.removeContent(getIndex("VIT-Fit-To-View"));
	assert.ok(contentToolbar.getContent().length == 12, "Side by side spacer removed automatically");
	contentToolbar.removeContent(getIndex("VIT-Fullscreen"));
	assert.ok(contentToolbar.getContent().length == 10, "Ending spacer removed automatically");
	Toolbar.destroy();
});

QUnit.done(function() {
	jQuery("#content").hide();
});

});