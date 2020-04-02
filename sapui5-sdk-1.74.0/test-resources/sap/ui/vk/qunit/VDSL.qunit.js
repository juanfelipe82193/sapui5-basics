/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector"
], function(
	jQuery,
	loader
) {
	"use strict";

	QUnit.moduleWithContentConnector("VDSL", "test-resources/sap/ui/vk/qunit/media/box.vdsl", "vdsl", function(assert) {
		this.nodeHierarchy = this.contentConnector.getContent().getDefaultNodeHierarchy();
	});

	QUnit.test("VDSL", function(assert) {
		var colorBoxNodeRefs = this.nodeHierarchy.findNodesByName({ value: "colorBox" });
		var smallBoxNodeRefs = this.nodeHierarchy.findNodesByName({ value: "smallBox" });

		assert.equal(colorBoxNodeRefs.length, 1, "colorBox is found");
		assert.equal(smallBoxNodeRefs.length, 0, "smallBox is suppressed");

		var colorBoxNodeProxy = this.nodeHierarchy.createNodeProxy(colorBoxNodeRefs[0]);
		assert.equal(colorBoxNodeProxy.getOpacity(), 0.3, "n1 opacity is 0.3");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
