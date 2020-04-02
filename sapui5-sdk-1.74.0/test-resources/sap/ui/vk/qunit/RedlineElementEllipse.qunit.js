/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/RedlineElementEllipse",
	"sap/ui/vk/RedlineSurface",
	"sap/ui/vk/Redline"
], function(
	jQuery,
	RedlineElementEllipse,
	RedlineSurface,
	Redline
) {
	"use strict";

	var ellipse = new RedlineElementEllipse();
	var surface = new RedlineSurface({
		virtualTop: 0,
		virtualLeft: 0,
		virtualSideLength: 500,
		redlineElements: [ ellipse ]
	});
	surface.getVirtualLeft();

	QUnit.test("Testing RedlineElementEllipse", function(assert) {
		ellipse.setRadiusX(0.2);
		assert.strictEqual(ellipse.getRadiusX(), 0.2, "'radiusX' is 0.2");

		ellipse.setRadiusY(0.1);
		assert.strictEqual(ellipse.getRadiusY(), 0.1, "'radiusY' is 0.1");

		var fillColor = "rgba(0, 0, 255, 1)";
		ellipse.setFillColor(fillColor);
		assert.strictEqual(ellipse.getFillColor(), fillColor, "Fill color is " + fillColor);

		ellipse.edit(250, 400);
		assert.strictEqual(ellipse.getRadiusX(), 0.5, "After editing by (250, 400), 'radiusX' becomes 0.5");
		assert.strictEqual(ellipse.getRadiusY(), 0.8, "After editing by (250, 400), 'radiusY' becomes 0.8");

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

		var jsonEllipse = {
			halo: false,
			elementId: "693c84bf-32e6-d335-2fd3-3f1ac1cc50d1",
			originX: 0.5,
			originY: 0.2,
			radiusX: 0.1,
			radiusY: 0.3,
			strokeColor: "rgba(0, 0, 255, 1)",
			fillColor: "rgba(0, 0, 255, 1)",
			type: Redline.ElementType.Ellipse,
			version: 1
		};

		ellipse.importJSON(jsonEllipse);

		var dummyRenderManager = new DummyRenderManager();
		ellipse.render(dummyRenderManager);

		var expectedRenderedContent = "<ellipse cx='250' cy='100' rx='50' ry='150' fill='rgba(0, 0, 255, 1)' stroke='rgba(0, 0, 255, 1)' stroke-width='2' opacity='1'></ellipse>";
		var renderedContent = dummyRenderManager.getRenderedContent();
		assert.strictEqual(renderedContent, expectedRenderedContent, "The rendered content matches the expect result.");

		var exportedJson = ellipse.exportJSON();
		assert.strictEqual(exportedJson.halo, false, "Export and import 'halo' match.");
		assert.strictEqual(exportedJson.elementId, jsonEllipse.elementId, "Export and import 'elementId' match.");
		assert.strictEqual(exportedJson.originX, jsonEllipse.originX, "Export and import 'originX' match.");
		assert.strictEqual(exportedJson.originY, jsonEllipse.originY, "Export and import 'originY' match");
		assert.strictEqual(exportedJson.radiusX, jsonEllipse.radiusX, "Export and import 'radiusX' match.");
		assert.strictEqual(exportedJson.radiusY, jsonEllipse.radiusY, "Export and import 'radiusY' match.");
		assert.strictEqual(exportedJson.strokeColor, jsonEllipse.strokeColor, "Export and import 'strokeColor' match.");
		assert.strictEqual(exportedJson.fillColor, jsonEllipse.fillColor, "Export and import 'fillColor' match.");
		assert.strictEqual(exportedJson.type, jsonEllipse.type, "Exported and import 'type' match.");
		assert.strictEqual(exportedJson.version, jsonEllipse.version, "Export and import 'version' match.");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
