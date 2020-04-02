/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/RedlineElementRectangle",
	"sap/ui/vk/RedlineSurface",
	"sap/ui/vk/Redline"
], function(
	jQuery,
	RedlineElementRectangle,
	RedlineSurface,
	Redline
) {
	"use strict";

	var rectangle = new RedlineElementRectangle({
		originX: 0.5,
		originY: 0.5
	});
	var surface = new RedlineSurface({
		virtualTop: 0,
		virtualLeft: 0,
		virtualSideLength: 500,
		redlineElements: [ rectangle ]
	});
	surface.getVirtualLeft();

	QUnit.test("Testing RedlineElementRectangle", function(assert) {
		rectangle.setWidth(0.1);
		assert.strictEqual(rectangle.getWidth(), 0.1, "'width' is 0.1");

		rectangle.setHeight(0.1);
		assert.strictEqual(rectangle.getHeight(), 0.1, "'height' is 0.1");

		rectangle.edit(500, 500);
		assert.strictEqual(rectangle.getWidth(), 0.5, "After editing by (500, 500), 'width' becomes 0.5");
		assert.strictEqual(rectangle.getHeight(), 0.5, "After editing by (500, 500), 'height' becomes 0.5");

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

		var jsonRectangle = {
			halo: true,
			elementId: "4a397a49-8d2b-502e-5ae7-e969e39d9cfa",
			originX: 0.5,
			originY: 0.2,
			height: 0.1,
			width: 0.3,
			type: Redline.ElementType.Rectangle,
			version: 1
		};

		rectangle.importJSON(jsonRectangle);

		var dummyRenderManager = new DummyRenderManager();
		rectangle.render(dummyRenderManager);

		var expectedRenderedContent = "<rect x='250' y='100' width='150' height='50' fill='rgba(0, 0, 0, 0)' stroke='#e6600d' stroke-width='2' opacity='1' filter='url(#halo)'></rect>";
		var renderedContent = dummyRenderManager.getRenderedContent();
		assert.strictEqual(renderedContent, expectedRenderedContent, "The rendered content matches the expect result.");

		var exportedJson = rectangle.exportJSON();
		assert.strictEqual(exportedJson.halo, jsonRectangle.halo, "Export and import 'halo' match.");
		assert.strictEqual(exportedJson.elementId, jsonRectangle.elementId, "Export and import 'elementId' match.");
		assert.strictEqual(exportedJson.originX, jsonRectangle.originX, "Export and import 'originX' match.");
		assert.strictEqual(exportedJson.originY, jsonRectangle.originY, "Export and import 'originY' match");
		assert.strictEqual(exportedJson.width, jsonRectangle.width, "Export and import 'width' match.");
		assert.strictEqual(exportedJson.height, jsonRectangle.height, "Export and import 'height' match.");
		assert.strictEqual(exportedJson.type, jsonRectangle.type, "Exported and import 'type' match.");
		assert.strictEqual(exportedJson.version, jsonRectangle.version, "Export and import 'version' match.");

	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
