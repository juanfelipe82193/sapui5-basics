/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/RedlineSurface",
	"sap/ui/vk/Redline",
	"sap/ui/vk/RedlineElementEllipse"
], function(
	jQuery,
	RedlineSurface,
	Redline,
	RedlineElementEllipse
) {
	"use strict";

	var redlineSurface = new RedlineSurface({
		virtualTop: 0,
		virtualLeft: 0,
		virtualSideLength: 600
	}).placeAt("content");

	redlineSurface.onAfterRendering = function() {
		redlineSurface.getDomRef().style.width = "100%";
		redlineSurface.getDomRef().style.height = "100%";
	};

	QUnit.test("Testing conversions", function(assert) {

		var x = redlineSurface._toVirtualSpace(300, 600).x;
		var y = redlineSurface._toVirtualSpace(300, 600).y;
		assert.strictEqual(x, 0.5, "300px in virtual space is 0.5");
		assert.strictEqual(y, 1, "600px in virtual space is 1");

		var m = redlineSurface._toPixelSpace(0.5, 1).x;
		var n = redlineSurface._toPixelSpace(0.5, 1).y;
		assert.strictEqual(m, 300, "0.5 in pixel space is 300");
		assert.strictEqual(n, 600, "1 in pixel space is 600");

		var topValueVirtual = 450,
			topValuePixels = redlineSurface._toPixelSpace(topValueVirtual),
			newTopValueVirtual = redlineSurface._toVirtualSpace(topValuePixels);
		assert.strictEqual(topValueVirtual, newTopValueVirtual, "You get the same value if you convert virtual => pixels => virtual");

	});

	QUnit.test("Testing importJSON & exportJSON", function(assert) {

		var ellipse = new RedlineElementEllipse({
			originX: 0.5,
			originY: 0.5,
			radiusX: 0.2,
			radiusY: 0.3,
			strokeColor: "rgba(0, 255, 0, 1)"
		});
		redlineSurface.addRedlineElement(ellipse);

		var exportedJson = redlineSurface.exportJSON();
		var aggregationEllipse = redlineSurface.getRedlineElements()[0];

		assert.strictEqual(aggregationEllipse.getOriginX(), exportedJson[0].originX, "The aggregation and the exported element have the same 'originX'.");
		assert.strictEqual(aggregationEllipse.getOriginY(), exportedJson[0].originY, "The aggregation and the exported element have the same 'originY'.");
		assert.strictEqual(aggregationEllipse.getRadiusX(), exportedJson[0].radiusX, "The aggregation and the exported element have the same 'radiusX'.");
		assert.strictEqual(aggregationEllipse.getRadiusY(), exportedJson[0].radiusY, "The aggregation and the exported element have the same 'radiusY'.");
		assert.strictEqual(aggregationEllipse.getOpacity(), exportedJson[0].opacity, "The aggregation and the exported element have the same 'opacity'.");
		assert.strictEqual(aggregationEllipse.getFillColor(), exportedJson[0].fillColor, "The aggregation and the exported element have the same fill color.");
		assert.strictEqual(aggregationEllipse.getStrokeColor(), exportedJson[0].strokeColor, "The aggregation and the exported element have the same stroke color.");
		assert.strictEqual(aggregationEllipse.getStrokeWidth(), exportedJson[0].strokeWidth, "The aggregation and the exported element have the same stroke width.");
		assert.strictEqual(Redline.ElementType.Ellipse, exportedJson[0].type, "The aggregation and the exported element are both ellipses.");

		redlineSurface.destroyRedlineElements();

		var jsonEllipse = {
			originX: 0.4,
			originY: 0.6,
			opacity: 1,
			strokeColor: "rgba(255, 255, 0, 1)",
			strokeWidth: 5,
			type: "ellipse",
			version: 1,
			radiusX: 0.1,
			radiusY: 0.3,
			fillColor: "rgba(0, 0, 0, 0)"
		};
		redlineSurface.importJSON(jsonEllipse);

		var importedEllipse = redlineSurface.getRedlineElements()[0];

		assert.strictEqual(importedEllipse.getOriginX(), jsonEllipse.originX, "The imported aggregation and the json element have the same 'originX'.");
		assert.strictEqual(importedEllipse.getOriginY(), jsonEllipse.originY, "The imported aggregation and the json element have the same 'originY'.");
		assert.strictEqual(importedEllipse.getRadiusX(), jsonEllipse.radiusX, "The imported aggregation and the json element have the same 'radiusX'.");
		assert.strictEqual(importedEllipse.getRadiusY(), jsonEllipse.radiusY, "The imported aggregation and the json element have the same 'radiusY'.");
		assert.strictEqual(importedEllipse.getOpacity(), jsonEllipse.opacity, "The imported aggregation and the json element have the same 'opacity'.");
		assert.strictEqual(importedEllipse.getFillColor(), jsonEllipse.fillColor, "The imported aggregation and the json element have the same fill color.");
		assert.strictEqual(importedEllipse.getStrokeColor(), jsonEllipse.strokeColor, "The imported aggregation and the json element have the same stroke color.");
		assert.strictEqual(importedEllipse.getStrokeWidth(), jsonEllipse.strokeWidth, "The imported aggregation and the json element have the same stroke width.");
		assert.strictEqual(Redline.ElementType.Ellipse, jsonEllipse.type, "The imported aggregation and the json element are both ellipses.");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
