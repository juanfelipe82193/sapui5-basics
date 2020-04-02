/*global QUnit*/
sap.ui.define(["sap/gantt/simple/BaseImage", "sap/ui/core/Core"], function (BaseImage, Core) {
	"use strict";

	QUnit.module("Property", {
		beforeEach: function () {
			this.oShape = new BaseImage();
		},
		afterEach: function () {
			this.oShape = null;
		}
	});

	QUnit.test("default values", function (assert) {
		assert.strictEqual(this.oShape.getWidth(), 20, "Default Width is 20");
		assert.strictEqual(this.oShape.getHeight(), 20, "Default Height is 20");
	});

	QUnit.module("Function", {
		beforeEach: function () {
			this.oShape = new BaseImage({
				x: 0,
				y:0,
				src: "sap-icon://account",
				width: 15,
				height: 15
			});
			this.oShape2 = new BaseImage({
				x: 0,
				y:0,
				src: "../../image/truck.png",
				width: 15,
				height: 15
			});
		},
		afterEach: function () {
			this.oShape = null;
			this.oShape2 = null;
		}
	});

	QUnit.test("Function", function (assert) {
		assert.ok(this.oShape != null, "Shape instance is found");
		assert.strictEqual(this.oShape.getX(), 0,  "Configured X propery");
		assert.strictEqual(this.oShape.getY(), 0, "Configured Y propery");
	});

	QUnit.test("Rendering", function (assert) {
		var oRm = Core.createRenderManager();
		this.oShape.renderElement(oRm, this.oShape);
		this.oShape2.renderElement(oRm, this.oShape2);
		oRm.flush(jQuery.sap.domById("qunit-fixture"));
		oRm.destroy();
		var oIconfont = jQuery('#qunit-fixture').find("text");
		var oBitImage = jQuery('#qunit-fixture').find("image,img");
		assert.ok(oIconfont.length === 1, "Rendering base icon is OK");
		assert.ok(oBitImage.length === 1, "Rendering bitmap image icon is OK");
		assert.strictEqual(jQuery(oIconfont).attr("x"), "0",  "X propery is rendered");
		assert.strictEqual(jQuery(oIconfont).attr("y"), "0",  "Y propery is rendered");
		assert.strictEqual(jQuery(oIconfont).css("font-family"), "SAP-icons",  "Icon font family is correct");
		assert.strictEqual(jQuery(oIconfont).css("font-size"), "15px",  "Icon size is correct");

		assert.strictEqual(jQuery(oBitImage).attr("x"), "0",  "X propery is rendered");
		assert.strictEqual(jQuery(oBitImage).attr("y"), "0",  "Y propery is rendered");
		assert.strictEqual(jQuery(oBitImage).attr("width"), "15",  "Image width is correct");
		assert.strictEqual(jQuery(oBitImage).attr("height"), "15",  "Image height is correct");
		assert.strictEqual(jQuery(oBitImage).attr("xlink:href"), "../../image/truck.png",  "Image src is correct");
	});

});
