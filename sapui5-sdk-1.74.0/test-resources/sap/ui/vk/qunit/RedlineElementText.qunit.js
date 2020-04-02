/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/RedlineElementText",
	"sap/ui/vk/RedlineSurface",
	"sap/ui/vk/Redline"
], function(
	jQuery,
	RedlineElementText,
	RedlineSurface,
	Redline
) {
	"use strict";

	var text = new RedlineElementText({
		originX: 0.5,
		originY: 0.5
	});
	var surface = new RedlineSurface({
		virtualTop: 0,
		virtualLeft: 0,
		virtualSideLength: 500,
		redlineElements: [ text ]
	});
	surface.getVirtualLeft();

	QUnit.test("Testing RedlineElementText", function(assert) {
		text.edit(125, 375);
		assert.strictEqual(text.getOriginX(), 0.25, "After editing by (125, 375), 'originX' becomes 0.25");
		assert.strictEqual(text.getOriginY(), 0.75, "After editing by (125, 375), 'originY' becomes 0.75");

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

		var jsonText = {
			halo: false,
			elementId: "68b6c919-1226-b075-cd23-5647ed03c90a",
			originX: 0.5,
			originY: 0.2,
			text: "ABC 123",
			font: "Comic Sans MS",
			fontSize: 123,
			opacity: 0.8,
			fillColor: "rgba(10,20,30,0.4)",
			strokeColor: "rgba(50,60,70,0.8)",
			strokeWidth: 3,
			strokeDashArray: [ 5, 6 ],
			type: Redline.ElementType.Text,
			version: 1
		};

		text.importJSON(jsonText);

		var dummyRenderManager = new DummyRenderManager();
		text.render(dummyRenderManager);

		var expectedRenderedContent =
			"<text x='250' y='100' font-family='Comic Sans MS' font-size='123' fill='rgba(10,20,30,0.4)' stroke='rgba(50,60,70,0.8)' stroke-width='3' stroke-dasharray='5,6' opacity='0.8'>ABC 123</text>";
		var renderedContent = dummyRenderManager.getRenderedContent();
		assert.strictEqual(renderedContent, expectedRenderedContent, "The rendered content matches the expect result.");

		var exportedJson = text.exportJSON();
		assert.strictEqual(exportedJson.halo, jsonText.halo, "Export and import 'halo' match.");
		assert.strictEqual(exportedJson.elementId, jsonText.elementId, "Export and import 'elementId' match.");
		assert.strictEqual(exportedJson.originX, jsonText.originX, "Export and import 'originX' match.");
		assert.strictEqual(exportedJson.originY, jsonText.originY, "Export and import 'originY' match");
		assert.strictEqual(exportedJson.text, jsonText.text, "Export and import 'text' match.");
		assert.strictEqual(exportedJson.font, jsonText.font, "Export and import 'font' match.");
		assert.strictEqual(exportedJson.fontSize, jsonText.fontSize, "Export and import 'fontSize' match.");
		assert.strictEqual(exportedJson.fillColor, jsonText.fillColor, "Export and import 'fillColor' match.");
		assert.strictEqual(exportedJson.strokeColor, jsonText.strokeColor, "Export and import 'strokeColor' match.");
		assert.strictEqual(exportedJson.strokeWidth, jsonText.strokeWidth, "Export and import 'strokeWidth' match.");
		assert.deepEqual(exportedJson.strokeDashArray, jsonText.strokeDashArray, "Export and import 'strokeDashArray' match.");
		assert.strictEqual(exportedJson.opacity, jsonText.opacity, "Export and import 'opacity' match.");
		assert.strictEqual(exportedJson.type, jsonText.type, "Exported and import 'type' match.");
		assert.strictEqual(exportedJson.version, jsonText.version, "Export and import 'version' match.");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
