/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/RedlineElementFreehand",
	"sap/ui/vk/RedlineSurface",
	"sap/ui/vk/Redline"
], function(
	jQuery,
	RedlineElementFreehand,
	RedlineSurface,
	Redline
) {
	"use strict";

	var freehand = new RedlineElementFreehand();
	var surface = new RedlineSurface({
		virtualTop: 0,
		virtualLeft: 0,
		virtualSideLength: 500,
		redlineElements: [ freehand ]
	});
	surface.getVirtualLeft();

	QUnit.test("Testing RedlineElementFreehand", function(assert) {

		freehand.setPath([ 0.5, 0.5, 0.2, 0.2 ]);
		assert.propEqual(freehand.getPath(), [ 0.5, 0.5, 0.2, 0.2 ], "path is [0.5, 0.5]");

		freehand.edit(500, 500);
		assert.propEqual(freehand.getPath(), [ 0.5, 0.5, 0.2, 0.2, 1, 1 ], "path is [0.5, 0.5]");

		var DummyRenderManager = function() {
			this._text = "";
		};

		DummyRenderManager.prototype.write = function(text) {
			this._text += text;
		};

		DummyRenderManager.prototype.getRenderedContent = function() {
			return this._text;
		};

		DummyRenderManager.prototype.writeElementData = function() {};

		DummyRenderManager.prototype.writeAttribute = function(attribute, data) {
			this._text += " " + attribute + "='" + data + "'";
		};

		var jsonFreehand = {
			halo: true,
			elementId: "87792ba5-70c3-9f4b-0ffa-dd642222b61e",
			originX: 0.5,
			originY: 0.5,
			path: [ 0.1, 0.1, 0.4, 0.4, 0.3, 0.3 ],
			type: Redline.ElementType.Freehand,
			version: 1
		};

		freehand.importJSON(jsonFreehand);

		var dummyRenderManager = new DummyRenderManager();
		freehand.render(dummyRenderManager);

		var expectedRenderedContent = "<path d='M 300 300 L 450 450 L 400 400' stroke='#e6600d' stroke-width='2' opacity='1' fill='none' filter='url(#halo)'></path>";
		var renderedContent = dummyRenderManager.getRenderedContent();
		assert.strictEqual(renderedContent, expectedRenderedContent, "The rendered content matches the expect result.");

		var exportedJson = freehand.exportJSON();
		assert.strictEqual(exportedJson.halo, true, "Export and import 'halo' match.");
		assert.strictEqual(exportedJson.elementId, jsonFreehand.elementId, "Export and import 'elementId' match.");
		assert.strictEqual(exportedJson.originX, jsonFreehand.originX, "Export and import 'originX' match.");
		assert.strictEqual(exportedJson.originY, jsonFreehand.originY, "Export and import 'originY' match");
		assert.propEqual(exportedJson.path, jsonFreehand.path, "Export and import 'path' match.");
		assert.strictEqual(exportedJson.type, jsonFreehand.type, "Exported and import 'type' match.");
		assert.strictEqual(exportedJson.version, jsonFreehand.version, "Export and import 'version' match.");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
