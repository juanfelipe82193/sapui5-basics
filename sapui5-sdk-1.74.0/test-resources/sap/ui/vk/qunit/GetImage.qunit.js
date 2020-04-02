/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/threejs/Viewport",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector"
],
function(
	jQuery,
	Viewport,
	loader
) {
	"use strict";

	var viewport = new Viewport();
	viewport.placeAt("content");
	var tolerance = 3;

	// This si workaround for Internet Explorer which doesn't implement "slice"
	if (!Uint8Array.prototype.slice) {
		Object.defineProperty(Uint8ClampedArray.prototype, "slice", {
		  value: Array.prototype.slice
		});
	}

	QUnit.moduleWithContentConnector("GetImage", "test-resources/sap/ui/vk/qunit/media/boxes.three.json", "threejs.test.json", function(assert) {
		viewport.setContentConnector(this.contentConnector);
		viewport.getCamera().setPosition([ 0, 0, 10 ]);
	});

	var getPixel = function(image, x, y){
		var canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;

		var context = canvas.getContext("2d");
		context.drawImage(image, 0, 0);

		var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

		var index = (y * imageData.width + x) * 4;
		return imageData.data.slice(index, index + 4);
	};

	QUnit.test("Original background", function(assert) {
		var done = assert.async();

		viewport.setHeight("200px");
		var imgData = viewport.getImage(100, 100);
		assert.ok(imgData !== null && imgData.length > 10, "Image received");

		var img = document.createElement("img");
		document.body.appendChild(img);
		img.onload = function() {
			assert.equal(img.width, 100, "Image width is correct");
			assert.equal(img.height, 100, "Image height is correct");

			var pixel = getPixel(img, 0, 0);
			assert.ok(Math.abs(pixel[0] - 50) < tolerance && Math.abs(pixel[1] - 50) < tolerance && Math.abs(pixel[2] - 50) < tolerance, "Top is dark grey");

			pixel = getPixel(img, 0, 100 - 1);
			assert.ok(Math.abs(pixel[0] - 255) < tolerance && Math.abs(pixel[1] - 255) < tolerance && Math.abs(pixel[2] - 255) < tolerance, "Bottom is white");
			document.body.removeChild(img);
			done();
		};
		img.src = imgData;
	});

	QUnit.test("Solid background", function(assert) {
		var done = assert.async();

		viewport.setHeight("200px");
		var imgData = viewport.getImage(100, 100, "rgb(255,0,0)");
		assert.ok(imgData !== null && imgData.length > 10, "Image received");

		var img = document.createElement("img");
		document.body.appendChild(img);
		img.onload = function() {
			assert.equal(img.width, 100, "Image width is correct");
			assert.equal(img.height, 100, "Image height is correct");

			var pixel = getPixel(img, 0, 0);
			assert.ok(pixel[0] === 255 && pixel[1] === 0 && pixel[2] === 0, "Top is red");

			pixel = getPixel(img, 0, 100 - 1);
			assert.ok(pixel[0] === 255 && pixel[1] === 0 && pixel[2] === 0, "Bottom is also red");
			document.body.removeChild(img);
			done();
		};
		img.src = imgData;
	});

	QUnit.test("Gradient background", function(assert) {
		var done = assert.async();

		viewport.setHeight("200px");
		var imgData = viewport.getImage(100, 100, "rgb(255,0,0)", "rgb(0,255,0)");
		assert.ok(imgData !== null && imgData.length > 10, "Image received");

		var img = document.createElement("img");
		document.body.appendChild(img);

		var phase = 1;
		var pixel = null;
		img.onload = function() {
			switch (phase) {
				case 1:
					assert.equal(img.width, 100, "Image width is correct");
					assert.equal(img.height, 100, "Image height is correct");

					pixel = getPixel(img, 0, 0);
					assert.ok(Math.abs(pixel[0] - 255) < tolerance && Math.abs(pixel[1] - 1) < tolerance && pixel[2] === 0, "Top is red");

					pixel = getPixel(img, 0, 100 - 1);
					assert.ok(Math.abs(pixel[0] - 1) < tolerance && Math.abs(pixel[1] - 255) < tolerance && pixel[2] === 0, "Bottom is green");

					imgData = viewport.getImage();
					assert.ok(imgData !== null && imgData.length > 10, "Default image size received");
					phase++;
					img.src = imgData;
				break;
				case 2:
					assert.equal(img.width, 16, "Default image width is correct");
					assert.equal(img.height, 16, "Default image height is correct");

					pixel = getPixel(img, 0, 0);
					assert.ok(Math.abs(pixel[0] - 55) < tolerance && Math.abs(pixel[1] - 55) < tolerance && Math.abs(pixel[2] - 55) < tolerance, "Top is dark grey");

					pixel = getPixel(img, 0, 16 - 1);
					assert.ok(Math.abs(pixel[0] - 250) < tolerance && Math.abs(pixel[1] - 250) < tolerance && Math.abs(pixel[2] - 250) < tolerance, "Bottom is white");

					document.body.removeChild(img);
					done();
				break;
				default:
				break;
			}
		};
		img.src = imgData;
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
