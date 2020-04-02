/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/NativeViewport"
], function(
	jQuery,
	NativeViewport
) {
	"use strict";

	var nativeViewport = new NativeViewport();
	nativeViewport.placeAt("content");

	QUnit.test("Tests started", function(assert) {
		var done = assert.async();

		assert.ok(true, "Page loaded");

		var loadImageTest = function(loadingSucceded, loadingShouldSucceed, assertionName) {
			QUnit.test("Test image loading", function(assert) {
				assert.strictEqual(loadingSucceded, loadingShouldSucceed, assertionName);
			});
		};

		var commandRun = false;
		var queueThisCommand = function() {
			commandRun = true;
		};

		var testQueueCommand = function(commandRun) {
			QUnit.test("queueCommand", function(assert) {
				assert.ok(commandRun, "The queued command was run.");
			});
		};

		var testGetViewInfo = function(customViewInfo, retrievedViewInfo) {
			QUnit.test("getViewInfo & setViewInfo", function(assert) {
				assert.propEqual(customViewInfo, retrievedViewInfo, "The retrieved view info is the same with the one that was used in setViewInfo.");
			});
		};

		var testBeginGestureEndGesture = function(gestureCoordinates) {
			QUnit.test("beginGesture & endGesture", function(assert) {
				assert.strictEqual(gestureCoordinates.gxCoordBeforeBeginGesture, 0, "Before beginning gesture, NativeViewport._gx is 0.");
				assert.strictEqual(gestureCoordinates.gyCoordBeforeBeginGesture, 0, "Before beginning gesture, NativeViewport._gy is 0.");
				assert.notStrictEqual(gestureCoordinates.gxCoordAfterBeginGesture, 0, "After beginning gesture, NativeViewport._gx is different than 0.");
				assert.notStrictEqual(gestureCoordinates.gyCoordAfterBeginGesture, 0, "After beginning gesture, NativeViewport._gy is different than 0.");
				assert.strictEqual(gestureCoordinates.gxCoordAfterEndGesture, 0, "After ending the gesture, NativeViewport._gx is 0.");
				assert.strictEqual(gestureCoordinates.gyCoordAfterEndGesture, 0, "After ending the gesture, NativeViewport._gy is 0.");
			});
		};

		var testPan = function(viewInfoBeforePan, viewInfoAfterPan, panFactor) {
			QUnit.test("pan", function(assert) {
				assert.strictEqual(viewInfoBeforePan.camera[4] + panFactor.deltaX, viewInfoAfterPan.camera[4], "The native viewport has been panned with the right delta X factor.");
				assert.strictEqual(viewInfoBeforePan.camera[5] + panFactor.deltaY, viewInfoAfterPan.camera[5], "The native viewport has been panned with the right delta Y factor.");
			});
		};

		var testZoom = function(viewInfoBeforeZoom, viewInfoAfterZoom, zoomFactor) {
			QUnit.test("zoom", function(assert) {
				assert.strictEqual(viewInfoBeforeZoom.camera[0] * zoomFactor, viewInfoAfterZoom.camera[0], "The native viewport has been zoomed in with the right zoom factor.");
			});
		};

		nativeViewport.loadUrl(
			"test-resources/sap/ui/vk/qunit/media/cat.jpg",
			loadImageTest.bind(undefined, true, true, "valid jpg should load"),
			loadImageTest.bind(undefined, false, true, "valid jpg should load"),
			null,
			"jpg");


		nativeViewport.loadUrl("test-resources/sap/ui/vk/qunit/media/picture_does_not_exist.jpg",
			loadImageTest.bind(undefined, true, false, "inexistent jpg should not load"),
			loadImageTest.bind(undefined, false, false, "inexistent jpg should not load"),
			null,
			"jpg");

		nativeViewport.loadUrl("test-resources/sap/ui/vk/qunit/media/box.vds",
			loadImageTest.bind(undefined, true, false, "invalid resource type should not load (for example, vds extension)"),
			loadImageTest.bind(undefined, false, false, "invalid resource type should not load(for example, vds extension)"),
			null,
			"vds");

		nativeViewport.loadUrl("test-resources/sap/ui/vk/qunit/media/Che.svg",
			loadImageTest.bind(undefined, true, true, "valid svg, not interactive, should load"),
			loadImageTest.bind(undefined, false, true, "valid svg, not interactive, should load"),
			null,
			"svg");

		// The SVG loading error event is available in IE only so we won't run this test in any other browser
		if (sap.ui.Device.browser.msie) {
			nativeViewport.loadUrl("test-resources/sap/ui/vk/qunit/media/some_svg_that_does_not_exist.svg",
				loadImageTest.bind(undefined, true, false, "inexistent svg should not load"),
				loadImageTest.bind(undefined, false, false, "inexistent svg should not load"),
				null,
				"svg");
		}
		nativeViewport.loadUrl("test-resources/sap/ui/vk/qunit/media/cat.jpg",
			function() {
				this.queueCommand(queueThisCommand);
				testQueueCommand(commandRun);

				var customViewInfo = {
					camera: [ 1, 0, 0, 1, 1, 1 ]
				};

				this.setViewInfo(customViewInfo);
				var retrievedViewInfo = this.getViewInfo();

				testGetViewInfo(customViewInfo, retrievedViewInfo);

				var gestureCoordinates = {};
				gestureCoordinates.gxCoordBeforeBeginGesture = this._gx;
				gestureCoordinates.gyCoordBeforeBeginGesture = this._gy;
				this.beginGesture(10, 10);
				gestureCoordinates.gxCoordAfterBeginGesture = this._gx;
				gestureCoordinates.gyCoordAfterBeginGesture = this._gy;
				this.endGesture();
				gestureCoordinates.gxCoordAfterEndGesture = this._gx;
				gestureCoordinates.gyCoordAfterEndGesture = this._gy;

				testBeginGestureEndGesture(gestureCoordinates);

				var panFactor = {
					deltaX: 30,
					deltaY: 30
				};
				var viewInfoBeforePan = this.getViewInfo();
				this.pan(panFactor.deltaX, panFactor.deltaY);
				var viewInfoAfterPan = this.getViewInfo();

				testPan(viewInfoBeforePan, viewInfoAfterPan, panFactor);

				var zoomFactor = 2;
				var viewInfoBeforeZoom = this.getViewInfo();
				this.zoom(zoomFactor);
				var viewInfoAfterZoom = this.getViewInfo();

				testZoom(viewInfoBeforeZoom, viewInfoAfterZoom, zoomFactor);

				done();
			}.bind(nativeViewport),
			function() {
				done();
			},
			null,
			"jpg");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
