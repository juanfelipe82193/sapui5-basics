/*global sap, QUnit, sinon*/
sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/suite/ui/commons/library",
	"sap/suite/ui/commons/imageeditor/ImageEditor",
	"sap/suite/ui/commons/imageeditor/HistoryItem",
	"sap/suite/ui/commons/imageeditor/FilterHistoryItem",
	"sap/suite/ui/commons/imageeditor/FilterUtils",
	"sap/ui/Device",
	"sap/ui/core/util/File",
	"sap/ui/qunit/utils/createAndAppendDiv"
], function(jQuery, library, ImageEditor, HistoryItem, FilterHistoryItem, FilterUtils, Device,
			FileUtil, createAndAppendDiv) {
	"use strict";

	var ImageEditorMode = library.ImageEditorMode,
		ImageFormat = library.ImageFormat,
		sBigImg = sap.ui.require.toUrl("test-resources") + "/sap/suite/ui/commons/qunit/imageeditor/images/300x246.jpg",
		sSmallImg = sap.ui.require.toUrl("test-resources") + "/sap/suite/ui/commons/qunit/imageeditor/images/30x24.jpg",
		iBigWidth = 300,
		iBigHeight = 246,
		iSmallWidth = 30,
		iSmallHeight = 24;

	createAndAppendDiv("content");

	function render(oElement) {
		oElement.placeAt("content");
		sap.ui.getCore().applyChanges();
	}

	function compareCanvases(oCanvas1, oCanvas2) {
		return oCanvas1.toDataURL() === oCanvas2.toDataURL();
	}

	function loadImageToCanvas(sSrc) {
		var oImg = new Image(),
			oCanvas = document.createElement("canvas");

		oImg.crossOrigin = "Anonymous";

		return new Promise(function(resolve, reject) {
			oImg.src = sSrc;

			oImg.onload = function() {
				oCanvas.width = oImg.width;
				oCanvas.height = oImg.height;
				oCanvas.getContext("2d").drawImage(oImg, 0, 0);

				resolve(oCanvas);
			};
			oImg.onerror = function() {
				reject();
			};
		});
	}

	function createSvgRect(iWidth, iHeight) {
		return "data:image/svg+xml;base64," + btoa('<svg viewBox="0 0 ' + iWidth + ' ' + iHeight + '" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="' + iWidth + '" height="' + iHeight + '"></rect></svg>');
	}

	QUnit.module("ImageEditor without image, without rendering", {
		beforeEach: function () {
			this.oImageEditor = new ImageEditor();
			this.oSandbox = sinon.sandbox.create();
		},
		afterEach: function () {
			this.oSandbox.restore();
			this.oImageEditor.destroy();
		}
	});

	/**
	 * Properties
	 */

	QUnit.test("Default properties", function(assert) {
		assert.equal(this.oImageEditor.getProperty("src"), "", "src property is \"\"");
		assert.equal(this.oImageEditor.getProperty("mode"), ImageEditorMode.Default, "mode property is Default");
		assert.equal(this.oImageEditor.getProperty("keepCropAspectRatio"), true, "keepCropAspectRatio property is true");
		assert.equal(this.oImageEditor.getProperty("keepResizeAspectRatio"), true, "keepResizeAspectRatio property is true");
	});

	QUnit.test("Src set to correct image", function(assert) {
		var that = this,
			fnDone = assert.async();

		this.oImageEditor.attachLoaded(function() {
			var oTestCanvasPromise = loadImageToCanvas(sSmallImg);

			oTestCanvasPromise.then(function(oTestCanvas) {
				assert.ok(compareCanvases(that.oImageEditor._oCanvas, oTestCanvas), "correct image is loaded");
				fnDone();
			});
		});

		this.oImageEditor.setSrc(sSmallImg);
	});

	QUnit.test("Src set to incorrect source", function(assert) {
		var fnDone = assert.async();

		this.oImageEditor.attachError(function() {
			assert.ok(true, "error event fired");
			fnDone();
		});

		this.oImageEditor.setSrc("wrong url");
	});

	QUnit.test("Src changed from correct to empty", function(assert) {
		var that = this,
			fnDone = assert.async();

		function onFirstLoad() {
			that.oImageEditor.detachLoaded(onFirstLoad);
			that.oImageEditor.attachLoaded(onSecondLoad);
			that.oImageEditor.setSrc("");
		}

		function onSecondLoad() {
			assert.equal(that.oImageEditor._oCanvas.width, 0, "width is 0");
			assert.equal(that.oImageEditor._oCanvas.height, 0, "height is 0");
			fnDone();
		}

		this.oImageEditor.attachLoaded(onFirstLoad);
		this.oImageEditor.setSrc(sSmallImg);
	});

	QUnit.test("Change modes", function(assert) {
		this.oImageEditor.setMode(ImageEditorMode.CropRectangle);
		this.oImageEditor.setMode(ImageEditorMode.CropEllipse);
		this.oImageEditor.setMode(ImageEditorMode.Resize);
		this.oImageEditor.setMode(ImageEditorMode.Default);
		assert.ok(true, "modes changed without an error");
	});

	QUnit.test("Change keepCropAspectRatio", function(assert) {
		this.oImageEditor.setKeepCropAspectRatio(false);
		this.oImageEditor.setKeepCropAspectRatio(true);
		assert.ok(true, "keepCropAspectRatio changed without an error");
	});

	QUnit.test("Change keepResizeAspectRatio", function(assert) {
		this.oImageEditor.setKeepResizeAspectRatio(false);
		this.oImageEditor.setKeepResizeAspectRatio(true);
		assert.ok(true, "keepResizeAspectRatio changed without an error");
	});

	/**
	 * Public API
	 */

	QUnit.test("getLoaded without src", function(assert) {
		assert.notOk(this.oImageEditor.getLoaded(), "getLoaded returns false");
	});

	QUnit.test("getLoaded with src set", function(assert) {
		var that = this,
			fnDone = assert.async();

		this.oImageEditor.attachLoaded(function() {
			assert.ok(that.oImageEditor.getLoaded(), "image loaded");
			fnDone();
		});

		this.oImageEditor.setSrc(sSmallImg);
		assert.notOk(this.oImageEditor.getLoaded(), "image not yet loaded");
	});

	QUnit.test("getLoaded with wrong src set", function(assert) {
		var that = this,
			fnDone = assert.async();

		this.oImageEditor.attachError(function() {
			assert.notOk(that.oImageEditor.getLoaded(), "no image loaded");
			fnDone();
		});

		this.oImageEditor.setSrc("wrong url");
		assert.notOk(this.oImageEditor.getLoaded(), "image not yet loaded");
	});

	var aThrowablePublicMethods = [
		"setSize", "getWidth", "getPreviewWidth", "setWidth", "getHeight", "getPreviewHeight", "setHeight", "rotate",
		"flipVertical", "flipHorizontal", "flip", "applyVisibleCrop", "rectangleCrop", "ellipseCrop", "customShapeCrop",
		"setCustomShapeCropAreaRatio",
		"setCropArea", "setCropAreaByRatio", "setCropAreaBySize", "zoomToFit", "sepia", "grayscale", "saturate", "invert", "brightness",
		"contrast", "applyPreview", "cancelPreview", "undo", "redo", "jumpToHistory", "getImagePngDataURL",
		"getImageJpegDataURL", "getImageDataURL", "getImageAsBlob", "openSaveDialog"
	];

	aThrowablePublicMethods.forEach(function(sMethod) {
		QUnit.test(sMethod + " without image", function(assert) {
			var that = this;

			assert.throws(function() {
				that.oImageEditor[sMethod]();
			}, sMethod + " thrown an exception");
		});
	});

	QUnit.module("ImageEditor with image, without rendering", {
		beforeEach: function (assert) {
			var fnDone = assert.async();

			this.oImageEditor = new ImageEditor({
				src: sSmallImg,
				loaded: function() {
					fnDone();
				}
			});
			this.oSandbox = sinon.sandbox.create();
		},
		afterEach: function () {
			this.oSandbox.restore();
			this.oImageEditor.destroy();
		}
	});

	QUnit.test("setSize", function(assert) {
		var iWidth = 100,
			iHeight = 100,
			bPreview = true;

		this.oSandbox.spy(this.oImageEditor, "_cancelPreview");
		this.oSandbox.spy(this.oImageEditor, "_setCanvasSize");
		this.oSandbox.spy(this.oImageEditor, "_addHistory");

		this.oImageEditor.setSize(iWidth, iHeight, bPreview);
		assert.ok(this.oImageEditor._cancelPreview.calledOnce, "_cancelPreview called");
		assert.deepEqual(this.oImageEditor._setCanvasSize.getCall(0).args, [iWidth, iHeight], "_setCanvasSize called correctly");
		assert.ok(this.oImageEditor._addHistory.getCall(0).args[0].isA("sap.suite.ui.commons.imageeditor.ResizeHistoryItem"), "ResizeHistoryItem used");
		assert.equal(this.oImageEditor._addHistory.getCall(0).args[1], bPreview, "bPreview parameter propagated into _addHistory");
	});

	QUnit.test("getWidth", function(assert) {
		assert.equal(this.oImageEditor.getWidth(), iSmallWidth, "width is correct");
		this.oImageEditor.setWidth(40);
		assert.equal(this.oImageEditor.getWidth(), 40, "changed width is correct");
		this.oImageEditor.setWidth(150, true);
		assert.equal(this.oImageEditor.getWidth(), 40, "preview width not returned");
		this.oImageEditor.setWidth(60);
		assert.equal(this.oImageEditor.getWidth(), 60, "changed width is correct");
	});

	QUnit.test("getPreviewWidth", function(assert) {
		assert.equal(this.oImageEditor.getPreviewWidth(), iSmallWidth, "width is correct");
		this.oImageEditor.setWidth(40);
		assert.equal(this.oImageEditor.getPreviewWidth(), 40, "changed width is correct");
		this.oImageEditor.setWidth(150, true);
		assert.equal(this.oImageEditor.getPreviewWidth(), 150, "preview width returned");
		this.oImageEditor.setWidth(60);
		assert.equal(this.oImageEditor.getPreviewWidth(), 60, "changed width is correct");
	});

	QUnit.test("setWidth", function(assert) {
		var bPreview = true;

		this.oSandbox.spy(this.oImageEditor, "_cancelPreview");
		this.oSandbox.spy(this.oImageEditor, "_setCanvasSize");
		this.oSandbox.spy(this.oImageEditor, "_addHistory");

		this.oImageEditor.setKeepResizeAspectRatio(false);
		this.oImageEditor.setWidth(iSmallHeight);

		assert.ok(this.oImageEditor._cancelPreview.calledOnce, "_cancelPreview called");
		assert.deepEqual(this.oImageEditor._setCanvasSize.getCall(0).args, [iSmallHeight, iSmallHeight], "_setCanvasSize called correctly");
		assert.ok(this.oImageEditor._addHistory.getCall(0).args[0].isA("sap.suite.ui.commons.imageeditor.ResizeHistoryItem"), "ResizeHistoryItem used");

		this.oImageEditor.setKeepResizeAspectRatio(true);
		this.oImageEditor.setWidth(100, bPreview);
		assert.deepEqual(this.oImageEditor._setCanvasSize.getCall(1).args, [100, 100], "_setCanvasSize called correctly");
		assert.equal(this.oImageEditor._addHistory.getCall(1).args[1], bPreview, "bPreview parameter propagated into _addHistory");

		this.oImageEditor.setKeepResizeAspectRatio(false);
		this.oImageEditor.setWidth(150);
		assert.deepEqual(this.oImageEditor._setCanvasSize.getCall(2).args, [150, 100], "_setCanvasSize called correctly");
		assert.deepEqual(this.oImageEditor._addHistory.getCall(2).args[0].getOldWidth(), iSmallHeight, "correct old width on history item");
		assert.deepEqual(this.oImageEditor._addHistory.getCall(2).args[0].getOldHeight(), iSmallHeight, "correct old height on history item");
		assert.deepEqual(this.oImageEditor._addHistory.getCall(2).args[0].getWidth(), 150, "correct current width on history item");
		assert.deepEqual(this.oImageEditor._addHistory.getCall(2).args[0].getHeight(), 100, "correct current height on history item");
	});

	QUnit.test("getHeight", function(assert) {
		assert.equal(this.oImageEditor.getHeight(), iSmallHeight, "height is correct");
		this.oImageEditor.setHeight(40);
		assert.equal(this.oImageEditor.getHeight(), 40, "changed height is correct");
		this.oImageEditor.setHeight(150, true);
		assert.equal(this.oImageEditor.getHeight(), 40, "preview height not returned");
		this.oImageEditor.setHeight(60);
		assert.equal(this.oImageEditor.getHeight(), 60, "changed height is correct");
	});

	QUnit.test("getPreviewHeight", function(assert) {
		assert.equal(this.oImageEditor.getPreviewHeight(), iSmallHeight, "height is correct");
		this.oImageEditor.setHeight(40);
		assert.equal(this.oImageEditor.getPreviewHeight(), 40, "changed height is correct");
		this.oImageEditor.setHeight(150, true);
		assert.equal(this.oImageEditor.getPreviewHeight(), 150, "preview height returned");
		this.oImageEditor.setHeight(60);
		assert.equal(this.oImageEditor.getPreviewHeight(), 60, "changed height is correct");
	});

	QUnit.test("setHeight", function(assert) {
		var bPreview = true;

		this.oSandbox.spy(this.oImageEditor, "_cancelPreview");
		this.oSandbox.spy(this.oImageEditor, "_setCanvasSize");
		this.oSandbox.spy(this.oImageEditor, "_addHistory");

		this.oImageEditor.setKeepResizeAspectRatio(false);
		this.oImageEditor.setHeight(iSmallWidth);

		assert.ok(this.oImageEditor._cancelPreview.calledOnce, "_cancelPreview called");
		assert.deepEqual(this.oImageEditor._setCanvasSize.getCall(0).args, [iSmallWidth, iSmallWidth], "_setCanvasSize called correctly");
		assert.ok(this.oImageEditor._addHistory.getCall(0).args[0].isA("sap.suite.ui.commons.imageeditor.ResizeHistoryItem"), "ResizeHistoryItem used");

		this.oImageEditor.setKeepResizeAspectRatio(true);
		this.oImageEditor.setHeight(100, bPreview);
		assert.deepEqual(this.oImageEditor._setCanvasSize.getCall(1).args, [100, 100], "_setCanvasSize called correctly");
		assert.equal(this.oImageEditor._addHistory.args[1][1], bPreview, "bPreview parameter propagated into _addHistory");

		this.oImageEditor.setKeepResizeAspectRatio(false);
		this.oImageEditor.setHeight(150);
		assert.deepEqual(this.oImageEditor._setCanvasSize.getCall(2).args, [100, 150], "_setCanvasSize called correctly");
		assert.deepEqual(this.oImageEditor._addHistory.getCall(2).args[0].getOldWidth(), iSmallWidth, "correct old width on history item");
		assert.deepEqual(this.oImageEditor._addHistory.getCall(2).args[0].getOldHeight(), iSmallWidth, "correct old height on history item");
		assert.deepEqual(this.oImageEditor._addHistory.getCall(2).args[0].getWidth(), 100, "correct current width on history item");
		assert.deepEqual(this.oImageEditor._addHistory.getCall(2).args[0].getHeight(), 150, "correct current height on history item");
	});

	QUnit.test("rotate", function(assert) {
		var bPreview = true,
			iDegrees = 42;

		this.oSandbox.spy(this.oImageEditor, "_cancelPreview");
		this.oSandbox.spy(this.oImageEditor, "_setRotation");
		this.oSandbox.spy(this.oImageEditor, "_addHistory");

		this.oImageEditor.rotate(iDegrees, bPreview);

		assert.ok(this.oImageEditor._cancelPreview.calledOnce, "_cancelPreview called");
		assert.deepEqual(this.oImageEditor._setRotation.getCall(0).args, [iDegrees], "_setRotation called correctly");
		assert.ok(this.oImageEditor._addHistory.getCall(0).args[0].isA("sap.suite.ui.commons.imageeditor.RotateHistoryItem"), "RotateHistoryItem used");
		assert.equal(this.oImageEditor._addHistory.getCall(0).args[0].getDegrees(), iDegrees, "correct degrees on history item");
		assert.equal(this.oImageEditor._addHistory.getCall(0).args[1], bPreview, "bPreview parameter propagated into _addHistory");
	});

	QUnit.test("flipVertical", function(assert) {
		var bPreview = true;

		this.oSandbox.spy(this.oImageEditor, "_cancelPreview");
		this.oSandbox.spy(this.oImageEditor, "_flipVertical");
		this.oSandbox.spy(this.oImageEditor, "_addHistory");

		this.oImageEditor.flipVertical(bPreview);

		assert.ok(this.oImageEditor._cancelPreview.calledOnce, "_cancelPreview called");
		assert.ok(this.oImageEditor._flipVertical.calledOnce, "_flipVertical called correctly");
		assert.ok(this.oImageEditor._addHistory.getCall(0).args[0].isA("sap.suite.ui.commons.imageeditor.FlipHistoryItem"), "FlipHistoryItem used");
		assert.ok(this.oImageEditor._addHistory.getCall(0).args[0].getVertical(), "vertical true on history item");
		assert.notOk(this.oImageEditor._addHistory.getCall(0).args[0].getHorizontal(), "horizontal false on history item");
		assert.equal(this.oImageEditor._addHistory.getCall(0).args[1], bPreview, "bPreview parameter propagated into _addHistory");
	});

	QUnit.test("flipHorizontal", function(assert) {
		var bPreview = true;

		this.oSandbox.spy(this.oImageEditor, "_cancelPreview");
		this.oSandbox.spy(this.oImageEditor, "_flipHorizontal");
		this.oSandbox.spy(this.oImageEditor, "_addHistory");

		this.oImageEditor.flipHorizontal(bPreview);

		assert.ok(this.oImageEditor._cancelPreview.calledOnce, "_cancelPreview called");
		assert.ok(this.oImageEditor._flipHorizontal.calledOnce, "_flipHorizontal called correctly");
		assert.ok(this.oImageEditor._addHistory.getCall(0).args[0].isA("sap.suite.ui.commons.imageeditor.FlipHistoryItem"), "FlipHistoryItem used");
		assert.notOk(this.oImageEditor._addHistory.getCall(0).args[0].getVertical(), "vertical false on history item");
		assert.ok(this.oImageEditor._addHistory.getCall(0).args[0].getHorizontal(), "horizontal true on history item");
		assert.equal(this.oImageEditor._addHistory.getCall(0).args[1], bPreview, "bPreview parameter propagated into _addHistory");
	});

	QUnit.test("flip", function(assert) {
		var bPreview = true,
			bVertical = true,
			bHorizontal = true;

		this.oSandbox.spy(this.oImageEditor, "_cancelPreview");
		this.oSandbox.spy(this.oImageEditor, "_flip");
		this.oSandbox.spy(this.oImageEditor, "_addHistory");

		this.oImageEditor.flip(bVertical, bHorizontal, bPreview);

		assert.ok(this.oImageEditor._cancelPreview.calledOnce, "_cancelPreview called");
		assert.ok(this.oImageEditor._flip.calledOnce, "_flipHorizontal called correctly");
		assert.ok(this.oImageEditor._addHistory.getCall(0).args[0].isA("sap.suite.ui.commons.imageeditor.FlipHistoryItem"), "FlipHistoryItem used");
		assert.equal(this.oImageEditor._addHistory.getCall(0).args[0].getVertical(), bVertical, "vertical correct on history item");
		assert.equal(this.oImageEditor._addHistory.getCall(0).args[0].getHorizontal(), bHorizontal, "horizontal correct on history item");
		assert.equal(this.oImageEditor._addHistory.getCall(0).args[1], bPreview, "bPreview parameter propagated into _addHistory");

		bVertical = false;
		bHorizontal = false;
		this.oImageEditor.flip(bVertical, bHorizontal, bPreview);
		assert.equal(this.oImageEditor._addHistory.getCall(1).args[0].getVertical(), bVertical, "vertical correct on history item");
		assert.equal(this.oImageEditor._addHistory.getCall(1).args[0].getHorizontal(), bHorizontal, "horizontal correct on history item");
	});

	QUnit.test("applyVisibleCrop", function(assert) {
		var that = this;

		assert.throws(function() {
			that.oImageEditor.applyVisibleCrop();
		}, "applyVisibleCrop thrown an exception");
	});

	QUnit.test("rectangleCrop", function(assert) {
		var bPreview = true,
			iX = 5,
			iY = 7,
			iWidth = 10,
			iHeight = 8;

		this.oSandbox.spy(this.oImageEditor, "_cancelPreview");
		this.oSandbox.spy(this.oImageEditor, "_rectangleCrop");
		this.oSandbox.spy(this.oImageEditor, "_addHistory");

		this.oImageEditor.rectangleCrop(iX, iY, iWidth, iHeight, bPreview);

		assert.ok(this.oImageEditor._cancelPreview.calledOnce, "_cancelPreview called");
		assert.ok(this.oImageEditor._rectangleCrop.calledOnce, "_rectangleCrop called correctly");
		assert.ok(this.oImageEditor._addHistory.getCall(0).args[0].isA("sap.suite.ui.commons.imageeditor.CropRectangleHistoryItem"), "CropRectangleHistoryItem used");
		assert.equal(this.oImageEditor._addHistory.getCall(0).args[0].getX(), iX, "x correct on history item");
		assert.equal(this.oImageEditor._addHistory.getCall(0).args[0].getY(), iY, "y correct on history item");
		assert.equal(this.oImageEditor._addHistory.getCall(0).args[0].getWidth(), iWidth, "width correct on history item");
		assert.equal(this.oImageEditor._addHistory.getCall(0).args[0].getHeight(), iHeight, "height correct on history item");
		assert.equal(this.oImageEditor._addHistory.getCall(0).args[0].getOldWidth(), iSmallWidth, "old width correct on history item");
		assert.equal(this.oImageEditor._addHistory.getCall(0).args[0].getOldHeight(), iSmallHeight, "old height correct on history item");
		assert.equal(this.oImageEditor._addHistory.getCall(0).args[1], bPreview, "bPreview parameter propagated into _addHistory");
		assert.equal(this.oImageEditor.getPreviewWidth(), iWidth, "new width is correct");
		assert.equal(this.oImageEditor.getPreviewHeight(), iHeight, "new height is correct");
	});

	QUnit.test("ellipseCrop", function(assert) {
		var bPreview = true,
			iX = 10,
			iY = 7,
			iXRadius = 4,
			iYRadius = 3;

		this.oSandbox.spy(this.oImageEditor, "_cancelPreview");
		this.oSandbox.spy(this.oImageEditor, "_ellipseCrop");
		this.oSandbox.spy(this.oImageEditor, "_addHistory");

		this.oImageEditor.ellipseCrop(iX, iY, iXRadius, iYRadius, bPreview);

		assert.ok(this.oImageEditor._cancelPreview.calledOnce, "_cancelPreview called");
		assert.ok(this.oImageEditor._ellipseCrop.calledOnce, "_ellipseCrop called correctly");
		assert.ok(this.oImageEditor._addHistory.getCall(0).args[0].isA("sap.suite.ui.commons.imageeditor.CropEllipseHistoryItem"), "CropEllipseHistoryItem used");
		assert.equal(this.oImageEditor._addHistory.getCall(0).args[0].getX(), iX, "x correct on history item");
		assert.equal(this.oImageEditor._addHistory.getCall(0).args[0].getY(), iY, "y correct on history item");
		assert.equal(this.oImageEditor._addHistory.getCall(0).args[0].getRx(), iXRadius, "x radius correct on history item");
		assert.equal(this.oImageEditor._addHistory.getCall(0).args[0].getRy(), iYRadius, "y radius correct on history item");
		assert.equal(this.oImageEditor._addHistory.getCall(0).args[0].getOldWidth(), iSmallWidth, "old width correct on history item");
		assert.equal(this.oImageEditor._addHistory.getCall(0).args[0].getOldHeight(), iSmallHeight, "old height correct on history item");
		assert.equal(this.oImageEditor._addHistory.getCall(0).args[1], bPreview, "bPreview parameter propagated into _addHistory");
		assert.equal(this.oImageEditor.getPreviewWidth(), iXRadius * 2, "new width is correct");
		assert.equal(this.oImageEditor.getPreviewHeight(), iYRadius * 2, "new height is correct");
	});

	QUnit.test("customShapeCrop _throwIfCustomShapeNotLoaded", function(assert) {
		var that = this;

		assert.throws(function() {
			that.oImageEditor.customShapeCrop(5, 7, 10, 8);
		}, "customShapeCrop throws _throwIfCustomShapeNotLoaded");
	});

	QUnit.test("customShapeCrop", function(assert) {
		var that = this,
			fnDone = assert.async(),
			bPreview = true,
			iX = 5,
			iY = 7,
			iWidth = 10,
			iHeight = 8;

		this.oSandbox.spy(this.oImageEditor, "_cancelPreview");
		this.oSandbox.spy(this.oImageEditor, "_customShapeCrop");
		this.oSandbox.spy(this.oImageEditor, "_addHistory");

		this.oImageEditor.attachCustomShapeLoaded(function() {
			that.oImageEditor.customShapeCrop(iX, iY, iWidth, iHeight, bPreview);

			assert.ok(that.oImageEditor._cancelPreview.calledOnce, "_cancelPreview called");
			assert.ok(that.oImageEditor._customShapeCrop.calledOnce, "_customShapeCrop called correctly");
			assert.ok(that.oImageEditor._addHistory.getCall(0).args[0].isA("sap.suite.ui.commons.imageeditor.CropCustomShapeHistoryItem"), "CropCustomShapeHistoryItem used");
			assert.equal(that.oImageEditor._addHistory.getCall(0).args[0].getX(), iX, "x correct on history item");
			assert.equal(that.oImageEditor._addHistory.getCall(0).args[0].getY(), iY, "y correct on history item");
			assert.equal(that.oImageEditor._addHistory.getCall(0).args[0].getWidth(), iWidth, "width correct on history item");
			assert.equal(that.oImageEditor._addHistory.getCall(0).args[0].getHeight(), iHeight, "height correct on history item");
			assert.equal(that.oImageEditor._addHistory.getCall(0).args[0].getOldWidth(), iSmallWidth, "old width correct on history item");
			assert.equal(that.oImageEditor._addHistory.getCall(0).args[0].getOldHeight(), iSmallHeight, "old height correct on history item");
			assert.equal(that.oImageEditor._addHistory.getCall(0).args[1], bPreview, "bPreview parameter propagated into _addHistory");
			assert.equal(that.oImageEditor.getPreviewWidth(), iWidth, "new width is correct");
			assert.equal(that.oImageEditor.getPreviewHeight(), iHeight, "new height is correct");

			fnDone();
		});

		if (Device.browser.msie) {
			assert.throws(
				function() {
					that.oImageEditor.setCustomShapeSrc(createSvgRect(16, 9));
				},
				"cannot be used in IE"
			);
			fnDone();
		} else {
			this.oImageEditor.setCustomShapeSrc(createSvgRect(16, 9));
		}
	});

	QUnit.test("setCropArea", function(assert) {
		var iX = 5,
			iY = 7,
			iWidth = 10,
			iHeight = 8;

		this.oSandbox.spy(this.oImageEditor, "_limitCropArea");
		this.oSandbox.spy(this.oImageEditor, "_setCropArea");

		this.oImageEditor.setCropArea(iX, iY, iWidth, iHeight);

		assert.ok(this.oImageEditor._limitCropArea.calledOnce, "_limitCropArea called");
		assert.ok(this.oImageEditor._setCropArea.calledOnce, "_setCropArea called");
	});

	var aCropRatios = [
		{
			widthRatio: 1,
			heightRatio: 1,
			x: "5.40",
			y: "2.40",
			width: "19.20",
			height: "19.20"
		},
		{
			widthRatio: 2,
			heightRatio: 1,
			x: "3.00",
			y: "6.00",
			width: "24.00",
			height: "12.00"
		},
		{
			widthRatio: 1,
			heightRatio: 2,
			x: "10.20",
			y: "2.40",
			width: "9.60",
			height: "19.20"
		},
		{
			widthRatio: 16,
			heightRatio: 9,
			x: "3.00",
			y: "5.25",
			width: "24.00",
			height: "13.50"
		}
	];

	aCropRatios.forEach(function(oRatio) {
		QUnit.test("setCropAreaByRatio " + oRatio.widthRatio + ":" + oRatio.heightRatio, function(assert) {
			this.oSandbox.spy(this.oImageEditor, "_setCropArea");

			this.oImageEditor.setCropAreaByRatio(oRatio.widthRatio, oRatio.heightRatio);

			assert.equal(this.oImageEditor._setCropArea.getCall(0).args[0].toFixed(2), oRatio.x, "correct x coordinate");
			assert.equal(this.oImageEditor._setCropArea.getCall(0).args[1].toFixed(2), oRatio.y, "correct y coordinate");
			assert.equal(this.oImageEditor._setCropArea.getCall(0).args[2].toFixed(2), oRatio.width, "correct width");
			assert.equal(this.oImageEditor._setCropArea.getCall(0).args[3].toFixed(2), oRatio.height, "correct height");
		});
	});

	QUnit.test("setCustomShapeCropAreaRatio", function(assert) {
		var that = this,
			fnDone = assert.async(),
			iWidth = 4,
			iHeight = 2,
			oCropArea;

		that.oImageEditor.attachCustomShapeLoaded(function() {
			that.oImageEditor.setCustomShapeCropAreaRatio();
			oCropArea = that.oImageEditor.getCropArea();
			if (!Device.browser.msie) {
				assert.equal(oCropArea.width / oCropArea.height, iWidth / iHeight, "crop area has correct ratio");
			} else {
				assert.equal((oCropArea.width / oCropArea.height).toFixed(2), (that.oImageEditor.getWidth() / that.oImageEditor.getHeight()).toFixed(2), "crop area has correct ratio");
			}

			fnDone();
		});

		if (Device.browser.msie) {
			assert.throws(
				function() {
					that.oImageEditor.setCustomShapeSrc(createSvgRect(iWidth, iHeight));
				},
				"cannot be used in IE"
			);
			fnDone();
		} else {
			this.oImageEditor.setCustomShapeSrc(createSvgRect(iWidth, iHeight));
		}
	});

	QUnit.test("setCropAreaBySize", function(assert) {
		var iWidth = 10,
			iHeight = 8;

		this.oSandbox.spy(this.oImageEditor, "_limitCropArea");
		this.oSandbox.spy(this.oImageEditor, "_setCropArea");

		this.oImageEditor.setCropAreaBySize(iWidth, iHeight);

		assert.ok(this.oImageEditor._limitCropArea.calledOnce, "_limitCropArea called");
		assert.equal(this.oImageEditor._limitCropArea.getCall(0).args[0], null, "_limitCropArea given null as x parameter");
		assert.equal(this.oImageEditor._limitCropArea.getCall(0).args[1], null, "_limitCropArea given null as y parameter");
		assert.ok(this.oImageEditor._setCropArea.calledOnce, "_setCropArea called");
	});

	QUnit.test("getCropArea", function(assert) {
		var oCropArea,
			oTestCropArea = {
				x: 0,
				y: 1,
				width: 2,
				height: 3
			};

		oCropArea = this.oImageEditor.getCropArea();
		assert.equal(oCropArea, null, "crop area is initially null");

		this.oImageEditor.setCropArea(oTestCropArea.x, oTestCropArea.y, oTestCropArea.width, oTestCropArea.height);
		oCropArea = this.oImageEditor.getCropArea();
		assert.deepEqual(oCropArea, oTestCropArea, "crop area returns correct data");
		assert.notEqual(oCropArea, oTestCropArea, "clone of crop area is returned instead of the original object");
	});

	QUnit.test("zoom", function(assert) {
		var iZoomLvl = 200;

		this.oSandbox.spy(this.oImageEditor, "_setZoom");

		this.oImageEditor.zoom(iZoomLvl);

		assert.ok(this.oImageEditor._setZoom.calledOnce, "_setZoom called");
		assert.equal(this.oImageEditor._setZoom.getCall(0).args[0], iZoomLvl, "zoomLvl parameter given to _setZoom");
	});

	QUnit.test("zoomIn", function(assert) {
		this.oSandbox.spy(this.oImageEditor, "_zoomIn");

		this.oImageEditor.zoomIn();

		assert.ok(this.oImageEditor._zoomIn.calledOnce, "_zoomIn called");
	});

	QUnit.test("zoomOut", function(assert) {
		this.oSandbox.spy(this.oImageEditor, "_zoomOut");

		this.oImageEditor.zoomOut();

		assert.ok(this.oImageEditor._zoomOut.calledOnce, "_zoomOut called");
	});

	var aFilters = [
		"sepia", "grayscale", "saturate", "invert", "brightness", "contrast"
	];

	aFilters.forEach(function(sFilter) {
		QUnit.test(sFilter, function(assert) {
			var bPreview = true,
				iValue = 80;

			this.oSandbox.spy(this.oImageEditor, "_cancelPreview");
			this.oSandbox.spy(this.oImageEditor, "_addHistory");

			this.oImageEditor[sFilter](iValue, bPreview);

			assert.ok(this.oImageEditor._cancelPreview.calledOnce, "_cancelPreview called");
			assert.equal(this.oImageEditor._addHistory.getCall(0).args[1], bPreview, "bPreview parameter propagated into _addHistory");
			assert.ok(this.oImageEditor._addHistory.getCall(0).args[0].isA("sap.suite.ui.commons.imageeditor.FilterHistoryItem"), "FilterHistoryItem used");
			assert.equal(this.oImageEditor._addHistory.getCall(0).args[0].getValue(), iValue, "value passed");
		});
	});

	QUnit.test("applyPreview", function(assert) {
		this.oSandbox.spy(this.oImageEditor, "_applyPreview");

		this.oImageEditor.applyPreview();

		assert.ok(this.oImageEditor._applyPreview.calledOnce, "_applyPreview called");
	});

	QUnit.test("cancelPreview", function(assert) {
		this.oSandbox.spy(this.oImageEditor, "_cancelPreview");

		this.oImageEditor.cancelPreview();

		assert.ok(this.oImageEditor._cancelPreview.calledOnce, "_cancelPreview called");
	});

	QUnit.test("undo", function(assert) {
		var iHistoryIndex = this.oImageEditor.getHistoryIndex();

		this.oSandbox.spy(this.oImageEditor, "_jumpToHistory");

		this.oImageEditor.undo();

		assert.ok(this.oImageEditor._jumpToHistory.calledOnce, "_jumpToHistory called");
		assert.ok(this.oImageEditor._jumpToHistory.getCall(0).args[0], iHistoryIndex - 1, "correct history index passed");
	});

	QUnit.test("redo", function(assert) {
		var iHistoryIndex = this.oImageEditor.getHistoryIndex();

		this.oSandbox.spy(this.oImageEditor, "_jumpToHistory");

		this.oImageEditor.redo();

		assert.ok(this.oImageEditor._jumpToHistory.calledOnce, "_jumpToHistory called");
		assert.ok(this.oImageEditor._jumpToHistory.getCall(0).args[0], iHistoryIndex - +1, "correct history index passed");
	});

	QUnit.test("jumpToHistory", function(assert) {
		var iHistoryIndex = 5;

		this.oSandbox.spy(this.oImageEditor, "_jumpToHistory");

		this.oImageEditor.jumpToHistory(iHistoryIndex);

		assert.ok(this.oImageEditor._jumpToHistory.calledOnce, "_jumpToHistory called");
		assert.ok(this.oImageEditor._jumpToHistory.getCall(0).args[0], iHistoryIndex, "correct history index passed");
	});

	QUnit.test("getHistory", function(assert) {
		var aHistory;

		aHistory = this.oImageEditor.getHistory();
		assert.equal(aHistory.length, 0, "no history items initially");

		this.oImageEditor.setSize(10, 10);
		this.oImageEditor.setSize(20, 20);
		aHistory = this.oImageEditor.getHistory();
		assert.equal(aHistory.length, 2, "history items are added after actions");

		this.oImageEditor.setSize(20, 20);
		aHistory = this.oImageEditor.getHistory();
		assert.equal(aHistory.length, 2, "history item not added if its same as the last one");
	});

	QUnit.test("getHistoryIndex", function(assert) {
		var iHistoryIndex;

		iHistoryIndex = this.oImageEditor.getHistoryIndex();
		assert.equal(iHistoryIndex, 0, "historyIndex is 0 initially");

		this.oImageEditor.setSize(10, 10);
		this.oImageEditor.setSize(20, 20);
		this.oImageEditor.setSize(40, 40);
		this.oImageEditor.setSize(50, 50);
		iHistoryIndex = this.oImageEditor.getHistoryIndex();
		assert.equal(iHistoryIndex, 0, "historyIndex is 0 after doing some actions");

		this.oImageEditor.undo();
		iHistoryIndex = this.oImageEditor.getHistoryIndex();
		assert.equal(iHistoryIndex, 1, "historyIndex is 1 after undo");

		this.oImageEditor.undo();
		iHistoryIndex = this.oImageEditor.getHistoryIndex();
		assert.equal(iHistoryIndex, 2, "historyIndex is 2 after second undo");

		this.oImageEditor.redo();
		iHistoryIndex = this.oImageEditor.getHistoryIndex();
		assert.equal(iHistoryIndex, 1, "historyIndex is 1 after second redo");

		this.oImageEditor.jumpToHistory(3);
		iHistoryIndex = this.oImageEditor.getHistoryIndex();
		assert.equal(iHistoryIndex, 3, "historyIndex is set to 3 after jumping in history");

		this.oImageEditor.setSize(10, 10);
		iHistoryIndex = this.oImageEditor.getHistoryIndex();
		assert.equal(iHistoryIndex, 0, "historyIndex is reset to 0 after doing some action");
	});

	QUnit.test("getImagePngDataURL", function(assert) {
		var sDataUrl = this.oImageEditor.getImagePngDataURL();

		assert.ok(sDataUrl.startsWith("data:image/png;base64"), "png data url returned");
	});

	QUnit.test("getImageJpegDataURL", function(assert) {
		var sDataUrl = this.oImageEditor.getImageJpegDataURL();

		assert.ok(sDataUrl.startsWith("data:image/jpeg;base64"), "png data url returned");
	});

	QUnit.test("getImageDataURL", function(assert) {
		var sDataUrl;

		this.oSandbox.spy(this.oImageEditor, "_getFileFormat");

		sDataUrl = this.oImageEditor.getImageDataURL();
		assert.ok(sDataUrl.startsWith("data:image/"), "data url returned");
		assert.ok(this.oImageEditor._getFileFormat.calledOnce, "_getFileFormat called");

		sDataUrl = this.oImageEditor.getImageDataURL(ImageFormat.Jpeg);
		assert.ok(sDataUrl.startsWith("data:image/jpeg"), "data url returned");
		assert.ok(this.oImageEditor._getFileFormat.calledOnce, "_getFileFormat not called");
	});

	QUnit.test("openSaveDialog", function(assert) {
		var that = this,
			fnDone = assert.async(),
			sFileName = "testName",
			sFileFormat = ImageFormat.Jpeg,
			fQuality = 0.42;

		this.oSandbox.spy(this.oImageEditor, "_getFileName");
		this.oSandbox.spy(this.oImageEditor, "_getFileFormat");
		this.oSandbox.stub(FileUtil, "save").onCall(0).callsFake(function() {
			assert.ok(that.oImageEditor._getFileName.calledOnce, "_getFileName called");
			assert.ok(that.oImageEditor._getFileFormat.calledOnce, "_getFileFormat called");
			assert.ok(FileUtil.save.getCall(0).args[0] instanceof Blob, "save called with blob");
			assert.equal(FileUtil.save.getCall(0).args.length, 4, "save called with 4 params");
		}).onCall(1).callsFake(function() {
			assert.ok(that.oImageEditor._getFileName.calledOnce, "_getFileName not called");
			assert.ok(that.oImageEditor._getFileFormat.calledOnce, "_getFileFormat not called");
			assert.ok(FileUtil.save.getCall(1).args[0] instanceof Blob, "save called with blob");
			assert.equal(FileUtil.save.getCall(1).args[1], sFileName, "correct file name passed");
			assert.equal(FileUtil.save.getCall(1).args[2], "jpeg", "correct extension passed");
			assert.equal(FileUtil.save.getCall(1).args[3], "image/jpeg", "correct file format passed");
			assert.equal(FileUtil.save.getCall(1).args.length, 4, "save called with 4 params");
			fnDone();
		});

		this.oImageEditor.openSaveDialog();

		this.oImageEditor.openSaveDialog(sFileName, sFileFormat, fQuality);
	});

	QUnit.test("getImageAsBlob", function(assert) {
		var fnDone = assert.async();

		this.oImageEditor.getImageAsBlob().then(function(oBlob) {
			assert.ok(oBlob instanceof Blob, "blob returned");
			fnDone();
		});
	});

	/**
	 * Private functions
	 */

	QUnit.test("_getLastImg", function(assert) {
		var that = this,
			fnDone = assert.async(),
			oLastImgCanvas;

		var oTestCanvasPromise = loadImageToCanvas(sSmallImg);

		oTestCanvasPromise.then(function(oTestCanvas) {
			oLastImgCanvas = that.oImageEditor._getLastImg();
			assert.ok(compareCanvases(oLastImgCanvas, oTestCanvas), "after load, last img returnes the original image");

			that.oImageEditor.setSize(100, 100);
			oLastImgCanvas = that.oImageEditor._getLastImg();
			assert.ok(compareCanvases(that.oImageEditor._oCanvas, oLastImgCanvas), "after change, last img holds same image as canvas");

			that.oImageEditor.setSize(200,200, true);
			oLastImgCanvas = that.oImageEditor._getLastImg();
			assert.notOk(compareCanvases(that.oImageEditor._oCanvas, oLastImgCanvas), "preview is not stored in last img");
			fnDone();
		});
	});

	QUnit.test("_addHistory", function(assert) {
		var oHistoryItem = new HistoryItem();

		this.oSandbox.spy(this.oImageEditor, "_addNewHistory");
		this.oSandbox.spy(this.oImageEditor, "_updateFilters");

		this.oImageEditor._addHistory(oHistoryItem, true);
		assert.equal(this.oImageEditor.getHistory().length, 0, "preview not stored in history");
		assert.equal(this.oImageEditor._oPreview, oHistoryItem, "item stored in preview");
		assert.notOk(this.oImageEditor._addNewHistory.called, "_addNewHistory was not called on preview");

		this.oImageEditor._addHistory(oHistoryItem, false);
		assert.equal(this.oImageEditor.getHistory().length, 1, "item not stored in history");
		assert.equal(this.oImageEditor._oPreview, null, "preview is removed");
		assert.ok(this.oImageEditor._addNewHistory.calledOnce, "_addNewHistory was called");
	});

	QUnit.test("_cancelPreview", function(assert) {
		this.oImageEditor.setSize(100, 100, true);

		this.oSandbox.spy(this.oImageEditor, "_addNewHistory");
		this.oSandbox.spy(this.oImageEditor, "_updateFilters");

		this.oImageEditor._cancelPreview();
		assert.equal(this.oImageEditor._oPreview, null, "preview is removed");
		assert.ok(this.oImageEditor._updateFilters.calledOnce, "_updateFilters was called");
	});

	QUnit.test("_jumpToHistory", function(assert) {
		this.oImageEditor._jumpToHistory(-5);
		assert.equal(this.oImageEditor.getHistoryIndex(), 0, "cannot go outside history bounds");

		this.oImageEditor._jumpToHistory(5);
		assert.equal(this.oImageEditor.getHistoryIndex(), 0, "cannot go outside history bounds");

		this.oImageEditor.setSize(100, 100);
		this.oImageEditor.rotate(45);
		this.oImageEditor.flip(true, true);
		this.oImageEditor.rectangleCrop(0, 0, 50, 50);
		this.oImageEditor.ellipseCrop(15, 15, 5, 5);

		this.oSandbox.spy(this.oImageEditor, "_setCanvasSize");
		this.oSandbox.spy(this.oImageEditor, "_setRotation");
		this.oSandbox.spy(this.oImageEditor, "_flip");
		this.oSandbox.spy(this.oImageEditor, "_rectangleCrop");
		this.oSandbox.spy(this.oImageEditor, "_ellipseCrop");

		this.oImageEditor._jumpToHistory(4);
		assert.equal(this.oImageEditor._setCanvasSize.callCount, 1, "_setCanvasSize was called");

		this.oImageEditor._jumpToHistory(3);
		assert.equal(this.oImageEditor._setCanvasSize.callCount, 1, "_setCanvasSize not called");
		assert.equal(this.oImageEditor._setRotation.callCount, 1, "_setRotation was called");

		this.oImageEditor._jumpToHistory(4);
		assert.equal(this.oImageEditor._setCanvasSize.callCount, 2, "_setCanvasSize was called");

		this.oImageEditor._jumpToHistory(0);
		assert.equal(this.oImageEditor._setCanvasSize.callCount, 2, "_setCanvasSize not called");
		assert.equal(this.oImageEditor._setRotation.callCount, 2, "_setRotation was called");
		assert.equal(this.oImageEditor._flip.callCount, 1, "_flip was called");
		assert.equal(this.oImageEditor._rectangleCrop.callCount, 1, "_rectangleCrop was called");
		assert.equal(this.oImageEditor._ellipseCrop.callCount, 1, "_ellipseCrop was called");
	});

	QUnit.test("_limitCropArea", function(assert) {
		var oCropArea;

		oCropArea = this.oImageEditor._limitCropArea(0, 0, 150, 150);
		assert.equal(oCropArea.x, 0, "x is still 0");
		assert.equal(oCropArea.y, 0, "y is still 0");
		assert.equal(oCropArea.width, iSmallWidth, "width constrained to img width");
		assert.equal(oCropArea.height, iSmallHeight, "height constrained to img height");

		oCropArea = this.oImageEditor._limitCropArea(iSmallWidth - 5, iSmallHeight - 5, iSmallWidth, iSmallHeight);
		assert.equal(oCropArea.x, 0, "x is still 0");
		assert.equal(oCropArea.y, 0, "y is still 0");
		assert.equal(oCropArea.width, iSmallWidth, "width constrained to img width");
		assert.equal(oCropArea.height, iSmallHeight, "height constrained to img height");

		oCropArea = this.oImageEditor._limitCropArea(0, 0, 150, 150);
		assert.equal(oCropArea.x, 0, "x is still 0");
		assert.equal(oCropArea.y, 0, "y is still 0");
		assert.equal(oCropArea.width, iSmallWidth, "width constrained to img width");
		assert.equal(oCropArea.height, iSmallHeight, "height constrained to img height");

		oCropArea = this.oImageEditor._limitCropArea(iSmallWidth, iSmallHeight, 5, 5);
		assert.equal(oCropArea.x, iSmallWidth - 5, "x is still " + iSmallWidth - 5);
		assert.equal(oCropArea.y, iSmallHeight - 5, "y is still " + iSmallHeight - 5);
		assert.equal(oCropArea.width, 5, "width constrained to img width");
		assert.equal(oCropArea.height, 5, "height constrained to img height");
	});

	QUnit.test("_constraintValue", function(assert) {
		var iMin = -20,
			iMax = 20;

		assert.equal(this.oImageEditor._constraintValue(0, iMin, iMax), 0, "value kept");
		assert.equal(this.oImageEditor._constraintValue(5.5, iMin, iMax), 6, "value rounded");
		assert.equal(this.oImageEditor._constraintValue(-25, iMin, iMax), iMin, "value constrained");
		assert.equal(this.oImageEditor._constraintValue(-Infinity, iMin, iMax), iMin, "value constrained");
		assert.equal(this.oImageEditor._constraintValue(150, iMin, iMax), iMax, "value constrained");
		assert.equal(this.oImageEditor._constraintValue(Infinity, iMin, iMax), iMax, "value constrained");
	});

	QUnit.test("_setZoom", function(assert) {
		var iZoomLvl = 150;

		this.oImageEditor._setZoom(iZoomLvl);
		assert.ok(this.oImageEditor._oCanvas.style.transform.indexOf("scale(" + iZoomLvl / 100 + "") >= 0, "zoom set on canvas");
	});

	QUnit.test("_setCanvasSize", function(assert) {
		var iWidth = 100,
			iHeight = 150,
			iOriginalWidth = this.oImageEditor.getWidth(),
			iOriginalHeight = this.oImageEditor.getHeight();

		this.oSandbox.spy(this.oImageEditor._oContext, "drawImage");

		this.oImageEditor._setCanvasSize(iWidth, iHeight);
		assert.equal(this.oImageEditor.getPreviewWidth(), iWidth, "width set");
		assert.equal(this.oImageEditor.getPreviewHeight(), iHeight, "height set");
		assert.deepEqual(this.oImageEditor._oContext.drawImage.getCall(0).args, [
			this.oImageEditor._getLastImg(), 0, 0, iOriginalWidth, iOriginalHeight, 0, 0, iWidth, iHeight
		], "drawImage called with correct parameters (skews the original image)");
	});

	QUnit.test("_setRotation", function(assert) {
		var that = this,
			fnDone = assert.async(),
			aDegrees = [1, 10, 30, 45, 90, 180, -25, -70, 270],
			fRatio;

		var oTestCanvasPromise = loadImageToCanvas(sSmallImg);
		oTestCanvasPromise.then(function(oTestCanvas) {
			jQuery("#content").append(oTestCanvas);
			fRatio = oTestCanvas.width / oTestCanvas.clientWidth;

			aDegrees.forEach(function(iDegrees) {
				oTestCanvas.style.transform = "rotate(" + iDegrees + "deg)";
				that.oImageEditor._setRotation(iDegrees);
				assert.equal(Math.floor(oTestCanvas.getBoundingClientRect().width * fRatio), that.oImageEditor.getPreviewWidth(), "width changed correctly");
				assert.equal(Math.floor(oTestCanvas.getBoundingClientRect().height * fRatio), that.oImageEditor.getPreviewHeight(), "height changed correctly");
			});

			jQuery(oTestCanvas).remove();
			fnDone();
		});
	});

	QUnit.test("_rectangleCrop", function(assert) {
		var iWidth = 10,
			iHeight = 10;

		this.oImageEditor._rectangleCrop(0, 0, iWidth, iHeight);
		assert.equal(this.oImageEditor.getPreviewWidth(), iWidth, "width ok");
		assert.equal(this.oImageEditor.getPreviewHeight(), iHeight, "height ok");
	});

	QUnit.test("_ellipseCrop", function(assert) {
		var iWidth = 5,
			iHeight = 5;

		this.oImageEditor._ellipseCrop(12, 12, iWidth, iHeight);
		assert.equal(this.oImageEditor.getPreviewWidth(), iWidth * 2, "width ok");
		assert.equal(this.oImageEditor.getPreviewHeight(), iHeight * 2, "height ok");
	});

	QUnit.test("_customShapeCrop", function(assert) {
		var that = this,
			fnDone = assert.async(),
			iWidth = 10,
			iHeight = 10;

		that.oImageEditor.attachCustomShapeLoaded(function() {
			that.oImageEditor._customShapeCrop(0, 0, iWidth, iHeight);
			assert.equal(that.oImageEditor.getPreviewWidth(), iWidth, "width ok");
			assert.equal(that.oImageEditor.getPreviewHeight(), iHeight, "height ok");
			fnDone();
		});

		if (Device.browser.msie) {
			assert.throws(
				function() {
					that.oImageEditor.setCustomShapeSrc(createSvgRect(iWidth, iHeight));
				},
				"cannot be used in IE"
			);
			fnDone();
		} else {
			this.oImageEditor.setCustomShapeSrc(createSvgRect(iWidth, iHeight));
		}
	});


	QUnit.test("_getFinalisedCanvas", function(assert) {
		var oCanvas;

		this.oSandbox.spy(this.oImageEditor, "_applyFilterHistory");

		oCanvas = this.oImageEditor._getFinalisedCanvas();

		assert.ok(this.oImageEditor._applyFilterHistory.calledOnce, "_applyFilterHistory called");
		assert.notEqual(this.oImageEditor._oCanvas, oCanvas, "returned canvas is not the same as the shown canvas");
		assert.equal(this.oImageEditor.getWidth(), oCanvas.width, "width ok");
		assert.equal(this.oImageEditor.getHeight(), oCanvas.height, "width ok");
	});

	QUnit.test("_applyFilterHistory", function(assert) {
		this.oSandbox.stub(FilterUtils, "sepia");
		this.oImageEditor._aHistory = [
			new HistoryItem(), new FilterHistoryItem({type: "sepia"}), new FilterHistoryItem({type: "sepia"}),
			new HistoryItem(), new HistoryItem(), new FilterHistoryItem({type: "sepia"})
		];

		this.oImageEditor._applyFilterHistory();

		assert.ok(FilterUtils.sepia.calledThrice, "fakeFilter called 3 times");
	});

	QUnit.test("_applyFilterHistory with jump in history", function(assert) {
		this.oSandbox.stub(FilterUtils, "sepia");
		this.oImageEditor._aHistory = [
			new HistoryItem(), new FilterHistoryItem({type: "sepia"}), new FilterHistoryItem({type: "sepia"}),
			new HistoryItem(), new HistoryItem(), new FilterHistoryItem({type: "sepia"})
		];

		this.oImageEditor._jumpToHistory(2);
		this.oImageEditor._applyFilterHistory();

		if (Device.browser.msie) {
			assert.equal(FilterUtils.sepia.callCount, 4, "fakeFilter called four times");
		} else {
			assert.equal(FilterUtils.sepia.callCount, 2, "fakeFilter called twice");
		}
	});

	QUnit.test("_updateFilters", function(assert) {
		this.oImageEditor.sepia(50);
		this.oImageEditor.brightness(50);
		this.oImageEditor.sepia(50);

		this.oImageEditor._updateFilters();

		if (!Device.browser.msie) {
			assert.equal(this.oImageEditor._oCanvas.style.filter,
				"sepia(50%) brightness(50%) sepia(50%)",
				"correct css filters");
		} else {
			assert.ok(true);
		}
	});

	aFilters.forEach(function(sFilter) {
		QUnit.test("_applyFilterItem " + sFilter, function(assert) {
			var oHistoryItem = new FilterHistoryItem({
				type: sFilter,
				value: 100,
				unit: "%"
			});

			this.oSandbox.spy(oHistoryItem, "getType");

			this.oImageEditor._applyFilterItem(oHistoryItem);
			assert.ok(oHistoryItem.getType.calledOnce);
		});
	});

	QUnit.test("_drawImage", function(assert) {
		var that = this,
			fnDone = assert.async(),
			oTestCanvasPromise = loadImageToCanvas(sBigImg);

		oTestCanvasPromise.then(function(oTestCanvas) {
			that.oImageEditor._drawImage(oTestCanvas);

			assert.ok(compareCanvases(that.oImageEditor._oCanvas, oTestCanvas), "image drawn");
			fnDone();
		});
	});

	QUnit.test("_createBlob png", function(assert) {
		var that = this,
			fnDone = assert.async(),
			oImg = document.createElement("img"),
			oCanvas = document.createElement("canvas"),
			oContext = oCanvas.getContext("2d");

		this.oSandbox.spy(this.oImageEditor._oCanvas, "toDataURL");

		oImg.onload = function() {
			oCanvas.width = oImg.width;
			oCanvas.height = oImg.height;
			oContext.drawImage(oImg, 0, 0);
			assert.ok(compareCanvases(that.oImageEditor._oCanvas, oCanvas), "returned image is same as original");
			fnDone();
		};

		this.oImageEditor._createBlob(this.oImageEditor._oCanvas, "image/png").then(function(oBlob) {
			assert.ok(oBlob instanceof Blob, "blob returned");
			assert.equal(oBlob.type, "image/png", "format is png");
			assert.equal(that.oImageEditor._oCanvas.toDataURL.getCall(0).args[0], "image/png", "toDataURL recieved format parameter");

			var oUrl = window.URL;
			oImg.src = oUrl.createObjectURL(oBlob);
			oUrl.revokeObjectURL(oBlob);
		});
	});

	QUnit.test("_createBlob jpg", function(assert) {
		var that = this,
			fnDone = assert.async(),
			oImg = document.createElement("img"),
			oCanvas = document.createElement("canvas"),
			oContext = oCanvas.getContext("2d"),
			fQuality = 0.5;

		this.oSandbox.spy(this.oImageEditor._oCanvas, "toDataURL");

		oImg.onload = function() {
			oCanvas.width = oImg.width;
			oCanvas.height = oImg.height;
			oContext.drawImage(oImg, 0, 0);
			assert.notOk(compareCanvases(that.oImageEditor._oCanvas, oCanvas), "returned jpeg isnt fully equal with original image");
			fnDone();
		};

		this.oImageEditor._createBlob(this.oImageEditor._oCanvas, "image/jpeg", fQuality).then(function(oBlob) {
			assert.ok(oBlob instanceof Blob, "blob returned");
			assert.equal(oBlob.type, "image/jpeg", "format is jpeg");
			assert.equal(that.oImageEditor._oCanvas.toDataURL.getCall(0).args[0], "image/jpeg", "toDataURL recieved format parameter");
			assert.equal(that.oImageEditor._oCanvas.toDataURL.getCall(0).args[1], fQuality, "toDataURL recieved format parameter");

			var oUrl = window.URL;
			oImg.src = oUrl.createObjectURL(oBlob);
			oUrl.revokeObjectURL(oBlob);
		});
	});

	QUnit.test("_getFileName", function(assert) {
		var sTestName1 = "testFile1",
			sTestName2 = "testFile2.jpg",
			sTestName2Stripped = "testFile2",
			oFile1,
			oFile2;

		if (!Device.browser.msie) {
			oFile1 = new File([""], sTestName1);
			oFile2 = new File([""], sTestName2);

			assert.equal(this.oImageEditor._getFileName(), "30x24", "default name is 'image'");

			this.oImageEditor.setSrc(oFile1);
			assert.equal(this.oImageEditor._getFileName(), sTestName1, "name of the file is returned if File is used instead of image url");

			this.oImageEditor.setSrc(oFile2);
			assert.equal(this.oImageEditor._getFileName(), sTestName2Stripped, "name of the file is returned without extension part");
		} else {
			assert.ok(true);
		}
	});

	QUnit.test("_convertImageFormatEnumToMime", function(assert) {
		assert.equal(this.oImageEditor._convertImageFormatEnumToMime(), undefined, "without parameter returns undefined");
		assert.equal(this.oImageEditor._convertImageFormatEnumToMime(ImageFormat.Png), "image/png", "with Png returns png");
		assert.equal(this.oImageEditor._convertImageFormatEnumToMime(ImageFormat.Jpeg), "image/jpeg", "with jpeg returns jpeg");
	});

	QUnit.test("_getFileFormat", function(assert) {
		var oFile, oBlob;

		if (!Device.browser.msie) {
			oFile = new File([""], "testFile1", {type: "image/jpeg"});
			oBlob = new Blob([""], {type: "image/jpeg"});

			assert.equal(this.oImageEditor._getFileFormat(), "image/jpeg", " type of the file is returned");

			this.oImageEditor.setSrc(oFile);
			assert.equal(this.oImageEditor._getFileFormat(), "image/jpeg", "type of the file is returned");

			this.oImageEditor.setSrc(oBlob);
			this.oSandbox.stub(this.oImageEditor, "getSrc").returns(oBlob);
			assert.equal(this.oImageEditor._getFileFormat(), "image/jpeg", "type of the file is returned");
		} else {
			assert.ok(true);
		}
	});

	QUnit.test("_setZoom", function(assert) {
		this.oSandbox.spy(this.oImageEditor, "_scaleCropArea");

		this.oImageEditor._setZoom(100);

		assert.notOk(this.oImageEditor._scaleCropArea.called, "_scaleCropArea not called");


		this.oImageEditor.setScaleCropArea(true);
		this.oImageEditor._setZoom(100);

		assert.ok(this.oImageEditor._scaleCropArea.calledOnce, "_scaleCropArea called");
	});

	QUnit.test("_scaleCropArea", function(assert) {
		this.oSandbox.spy(this.oImageEditor, "_setCropArea");

		this.oImageEditor._scaleCropArea(100, 150);
		assert.notOk(this.oImageEditor._setCropArea.called, "_setCropArea not called");

		this.oImageEditor._oCropArea = {
			x: 0,
			y:0,
			width: 10,
			height: 10
		};
		this.oImageEditor._scaleCropArea(100, 150);
		assert.ok(this.oImageEditor._setCropArea.calledOnce, "_setCropArea called");
	});

	var aZoomIns = [
		{current: 1, after: 5},
		{current: 500, after: 500},
		{current: 100, after: 110},
		{current: 42, after: 50}
	];

	aZoomIns.forEach(function(oZoomIn) {
		QUnit.test("_zoomIn", function(assert) {
			var oParams = {};

			this.oImageEditor._setZoom(oZoomIn.current);
			this.oSandbox.spy(this.oImageEditor, "_setZoom");

			this.oImageEditor._zoomIn(oParams);

			assert.ok(this.oImageEditor._setZoom.calledOnce, "_setZoom called");
			assert.equal(this.oImageEditor._setZoom.getCall(0).args[0], oZoomIn.after, "correct zoom level");
			assert.equal(this.oImageEditor._setZoom.getCall(0).args[1], oParams, "oParams forwarded");
		});
	});

	var aZoomOuts = [
		{current: 1, after: 1},
		{current: 500, after: 400},
		{current: 100, after: 90},
		{current: 42, after: 33}
	];

	aZoomOuts.forEach(function(oZoomOut) {
		QUnit.test("_zoomOut", function(assert) {
			var oParams = {};

			this.oImageEditor._setZoom(oZoomOut.current);
			this.oSandbox.spy(this.oImageEditor, "_setZoom");

			this.oImageEditor._zoomOut(oParams);

			assert.ok(this.oImageEditor._setZoom.calledOnce, "_setZoom called");
			assert.equal(this.oImageEditor._setZoom.getCall(0).args[0], oZoomOut.after, "correct zoom level");
			assert.equal(this.oImageEditor._setZoom.getCall(0).args[1], oParams, "oParams forwarded");
		});
	});

	QUnit.module("ImageEditor with image, with rendering", {
		beforeEach: function (assert) {
			var fnDone = assert.async();

			this.oImageEditor = new ImageEditor();
			this.oImageEditor.attachEventOnce("loaded", function() {
				fnDone();
			});
			this.oImageEditor.setSrc(sBigImg);

			render(this.oImageEditor);
			this.oSandbox = sinon.sandbox.create();
		},
		afterEach: function () {
			this.oSandbox.restore();
			this.oImageEditor.destroy();
		}
	});

	QUnit.test("applyVisibleCrop", function(assert) {
		this.oSandbox.spy(this.oImageEditor, "_cancelPreview");
		this.oSandbox.spy(this.oImageEditor, "_applyRectangleCrop");
		this.oSandbox.spy(this.oImageEditor, "_applyEllipseCrop");
		this.oSandbox.spy(this.oImageEditor, "_addHistory");

		this.oImageEditor.setMode(ImageEditorMode.Default);
		sap.ui.getCore().applyChanges();
		this.oImageEditor.applyVisibleCrop();
		assert.notOk(this.oImageEditor._cancelPreview.called, "_cancelPreview not called");
		assert.notOk(this.oImageEditor._addHistory.called, "_addHistory not called");

		this.oImageEditor.setMode(ImageEditorMode.CropRectangle);
		sap.ui.getCore().applyChanges();
		this.oImageEditor.applyVisibleCrop();
		assert.ok(this.oImageEditor._applyRectangleCrop.calledOnce, "_applyRectangleCrop called");
		assert.ok(this.oImageEditor._cancelPreview.calledOnce, "_cancelPreview called");
		assert.ok(this.oImageEditor._cancelPreview.calledOnce, "_addHistory called");

		this.oImageEditor.setMode(ImageEditorMode.CropEllipse);
		sap.ui.getCore().applyChanges();
		this.oImageEditor.applyVisibleCrop();
		assert.ok(this.oImageEditor._applyEllipseCrop.calledOnce, "_applyEllipseCrop called");
		assert.ok(this.oImageEditor._cancelPreview.calledTwice, "_cancelPreview called");
		assert.ok(this.oImageEditor._cancelPreview.calledTwice, "_addHistory called");
	});

	QUnit.test("zoomToFit", function(assert) {
		this.oSandbox.spy(this.oImageEditor, "_zoomToFit");

		this.oImageEditor.zoomToFit();

		assert.ok(this.oImageEditor._zoomToFit.calledOnce, "_zoomToFit called");

	});

	QUnit.test("_zoomToFit bigger width", function(assert) {
		var oContent = document.getElementById("content"),
			sOriginalWidth = oContent.style.width,
			sOriginalHeight = oContent.style.height,
			iContainerWidth = 100,
			iContainerHeight = 10,
			iImgWidth = 200,
			iImgHeight = 20;

		oContent.style.width = iContainerWidth + "px";
		oContent.style.height = iContainerHeight + "px";
		this.oImageEditor.setSize(iImgWidth, iImgHeight);

		this.oImageEditor._zoomToFit();

		if (Device.browser.msie) {
			assert.equal(this.oImageEditor.getZoomLevel(), 1);
		} else {
			assert.equal(this.oImageEditor.getZoomLevel(), iContainerWidth * 100 / iImgWidth, "img is fitting correctly");
		}

		oContent.style.width = sOriginalWidth;
		oContent.style.height = sOriginalHeight;
	});

	QUnit.test("_zoomToFit bigger height", function(assert) {
		var oContent = document.getElementById("content"),
			sOriginalWidth = oContent.style.width,
			sOriginalHeight = oContent.style.height,
			iContainerWidth = 10,
			iContainerHeight = 100,
			iImgWidth = 20,
			iImgHeight = 200;

		oContent.style.width = iContainerWidth + "px";
		oContent.style.height = iContainerHeight + "px";
		this.oImageEditor.setSize(iImgWidth, iImgHeight);

		this.oImageEditor._zoomToFit();

		if (Device.browser.msie) {
			assert.equal(this.oImageEditor.getZoomLevel(), 1);
		} else {
			assert.equal(this.oImageEditor.getZoomLevel(), iContainerHeight * 100 / iImgHeight, "img is fitting correctly");
		}

		oContent.style.width = sOriginalWidth;
		oContent.style.height = sOriginalHeight;
	});

	QUnit.test("_setCropArea", function(assert) {
		var oCropArea,
			iWidth = iBigWidth - 10,
			iHeight = iBigHeight - 10,
			iX = 5,
			iY = 5;

		this.oImageEditor._setCropArea(null, null, iWidth, iHeight);
		oCropArea = this.oImageEditor.getCropArea();

		assert.equal(oCropArea.x, iX, "x ok");
		assert.equal(oCropArea.y, iY, "y ok");
	});

	QUnit.test("Default mode re-rendering", function(assert) {
		var that = this;

		function checkIfOk() {
			assert.ok(that.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorCanvasInnerContainer").is(":visible"), "inner container visible");
			assert.ok(that.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorCanvas").is(":visible"), "canvas visible");
			assert.notOk(that.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorCropOverlayContainer").is(":visible"), "svg overylay not visible");
			assert.notOk(that.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorTransformHandlers").is(":visible"), "transform handlers not visible");
			assert.notOk(that.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorCropInnerRectangle").is(":visible"), "crop area not visible");
		}

		checkIfOk();
		that.oImageEditor.invalidate();
		checkIfOk();
	});

	QUnit.test("Resize mode re-rendering", function(assert) {
		var that = this;

		function checkIfOk() {
			assert.ok(that.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorCanvasInnerContainer").is(":visible"), "inner container visible");
			assert.ok(that.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorCanvas").is(":visible"), "canvas visible");
			assert.notOk(that.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorCropOverlayContainer").is(":visible"), "svg overylay not visible");
			assert.ok(that.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorTransformHandlers").is(":visible"), "transform visible");
			assert.notOk(that.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorCropInnerRectangle").is(":visible"), "crop area not visible");
		}

		that.oImageEditor.setMode(ImageEditorMode.Resize);
		sap.ui.getCore().applyChanges();

		checkIfOk();
		that.oImageEditor.invalidate();
		checkIfOk();
	});

	QUnit.test("Rectangle crop mode re-rendering", function(assert) {
		var that = this,
			$CropArea;

		function checkIfOk() {
			assert.ok(that.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorCanvasInnerContainer").is(":visible"), "inner container visible");
			assert.ok(that.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorCanvas").is(":visible"), "canvas visible");
			assert.ok(that.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorCropOverlayContainer").is(":visible"), "svg overylay visible");
			assert.notOk(that.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorTransformHandlers").is(":visible"), "transform not visible");
			assert.ok(that.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorCropInnerRectangle").is(":visible"), "crop area visible");
			that.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorCropItemRectangle:not(.sapSuiteUiCommonsImageEditorCropItemEllipse)").each(function() {
				assert.ok(jQuery(this).is(":visible"), "rectangle item visible");
			});
			that.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorCropItemEllipse:not(.sapSuiteUiCommonsImageEditorCropItemRectangle)").each(function() {
				assert.notOk(jQuery(this).is(":visible"), "ellipse item not visible");
			});
		}

		that.oImageEditor.setMode(ImageEditorMode.CropRectangle);
		sap.ui.getCore().applyChanges();

		checkIfOk();
		$CropArea = this.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorCropInnerRectangle");
		assert.equal($CropArea[0].style.top, "10%", "top is 10%");
		assert.equal($CropArea[0].style.left, "10%", "left is 10%");
		assert.equal($CropArea[0].style.width, "80%", "width is 80%");
		assert.equal($CropArea[0].style.height, "80%", "height is 80%");

		that.oImageEditor.setCropAreaByRatio(1, 1);
		assert.equal($CropArea[0].style.top, "10%", "top is 10%");
		assert.equal($CropArea[0].style.left, "17.2%", "left is 17.2%");
		assert.equal($CropArea[0].style.width, "65.6%", "width is 65.6%");
		assert.equal($CropArea[0].style.height, "80%", "height is 80%");

		that.oImageEditor.invalidate();
		checkIfOk();
		assert.equal($CropArea[0].style.top, "10%", "top is 10%");
		assert.equal($CropArea[0].style.left, "17.2%", "left is 17.2%");
		assert.equal($CropArea[0].style.width, "65.6%", "width is 65.6%");
		assert.equal($CropArea[0].style.height, "80%", "height is 80%");
	});

	QUnit.test("Ellipse crop mode re-rendering", function(assert) {
		var that = this,
			$CropArea;

		function checkIfOk() {
			assert.ok(that.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorCanvasInnerContainer").is(":visible"), "inner container visible");
			assert.ok(that.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorCanvas").is(":visible"), "canvas visible");
			assert.ok(that.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorCropOverlayContainer").is(":visible"), "svg overylay visible");
			assert.notOk(that.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorTransformHandlers").is(":visible"), "transform not visible");
			assert.ok(that.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorCropInnerRectangle").is(":visible"), "crop area visible");
			that.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorCropItemRectangle:not(.sapSuiteUiCommonsImageEditorCropItemEllipse)").each(function() {
				assert.notOk(jQuery(this).is(":visible") && jQuery(this).css("display") !== "none", "rectangle item not visible");
			});
			that.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorCropItemEllipse:not(.sapSuiteUiCommonsImageEditorCropItemRectangle)").each(function() {
				assert.ok(jQuery(this).is(":visible"), "ellipse item visible");
			});
		}

		that.oImageEditor.setMode(ImageEditorMode.CropEllipse);
		sap.ui.getCore().applyChanges();

		checkIfOk();
		$CropArea = this.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorCropInnerRectangle");
		assert.equal($CropArea[0].style.top, "10%", "top is 10%");
		assert.equal($CropArea[0].style.left, "10%", "left is 10%");
		assert.equal($CropArea[0].style.width, "80%", "width is 80%");
		assert.equal($CropArea[0].style.height, "80%", "height is 80%");

		that.oImageEditor.setCropAreaByRatio(1, 1);
		assert.equal($CropArea[0].style.top, "10%", "top is 10%");
		assert.equal($CropArea[0].style.left, "17.2%", "left is 17.2%");
		assert.equal($CropArea[0].style.width, "65.6%", "width is 65.6%");
		assert.equal($CropArea[0].style.height, "80%", "height is 80%");

		that.oImageEditor.invalidate();
		checkIfOk();
		assert.equal($CropArea[0].style.top, "10%", "top is 10%");
		assert.equal($CropArea[0].style.left, "17.2%", "left is 17.2%");
		assert.equal($CropArea[0].style.width, "65.6%", "width is 65.6%");
		assert.equal($CropArea[0].style.height, "80%", "height is 80%");
	});

	QUnit.test("_getMaxCropAreaWidth", function(assert) {
		var iMaxWidth;

		this.oImageEditor._setCropArea(0, 0, 5, 5);
		this.oImageEditor.setKeepCropAspectRatio(false);

		iMaxWidth = this.oImageEditor._getMaxCropAreaWidth();
		assert.equal(iMaxWidth, iBigWidth, "max width is correct");

		iMaxWidth = this.oImageEditor._getMaxCropAreaWidth(true);
		assert.equal(iMaxWidth, iBigWidth, "max width is correct");


		this.oImageEditor.setKeepCropAspectRatio(true);

		iMaxWidth = this.oImageEditor._getMaxCropAreaWidth();
		assert.equal(iMaxWidth, iBigWidth, "max width is correct");

		iMaxWidth = this.oImageEditor._getMaxCropAreaWidth(true);
		assert.equal(iMaxWidth, iBigHeight, "max width is correct");


		this.oImageEditor._setCropArea(0, 0, 10, 5);
		this.oImageEditor.setKeepCropAspectRatio(false);

		iMaxWidth = this.oImageEditor._getMaxCropAreaWidth();
		assert.equal(iMaxWidth, iBigWidth, "max width is correct");

		iMaxWidth = this.oImageEditor._getMaxCropAreaWidth(true);
		assert.equal(iMaxWidth, iBigWidth, "max width is correct");

		this.oImageEditor.setKeepCropAspectRatio(true);

		iMaxWidth = this.oImageEditor._getMaxCropAreaWidth();
		assert.equal(iMaxWidth, iBigWidth, "max width is correct");

		iMaxWidth = this.oImageEditor._getMaxCropAreaWidth(true);
		assert.equal(iMaxWidth, iBigWidth, "max width is correct");

		this.oImageEditor._setCropArea(0, 0, 5, 10);
		this.oImageEditor.setKeepCropAspectRatio(false);

		iMaxWidth = this.oImageEditor._getMaxCropAreaWidth();
		assert.equal(iMaxWidth, iBigWidth, "max width is correct");

		iMaxWidth = this.oImageEditor._getMaxCropAreaWidth(true);
		assert.equal(iMaxWidth, iBigWidth, "max width is correct");

		this.oImageEditor.setKeepCropAspectRatio(true);

		iMaxWidth = this.oImageEditor._getMaxCropAreaWidth();
		assert.equal(iMaxWidth, iBigWidth, "max width is correct");

		iMaxWidth = this.oImageEditor._getMaxCropAreaWidth(true);
		assert.equal(iMaxWidth, 123, "max width is correct");
	});

	QUnit.test("_getMaxCropAreaHeight", function(assert) {
		var iMaxWidth;

		this.oImageEditor._setCropArea(0, 0, 5, 5);
		this.oImageEditor.setKeepCropAspectRatio(false);

		iMaxWidth = this.oImageEditor._getMaxCropAreaHeight();
		assert.equal(iMaxWidth, iBigHeight, "max height is correct");

		iMaxWidth = this.oImageEditor._getMaxCropAreaHeight(true);
		assert.equal(iMaxWidth, iBigHeight, "max height is correct");


		this.oImageEditor.setKeepCropAspectRatio(true);

		iMaxWidth = this.oImageEditor._getMaxCropAreaHeight();
		assert.equal(iMaxWidth, iBigHeight, "max height is correct");

		iMaxWidth = this.oImageEditor._getMaxCropAreaHeight(true);
		assert.equal(iMaxWidth, iBigHeight, "max height is correct");


		this.oImageEditor._setCropArea(0, 0, 10, 5);
		this.oImageEditor.setKeepCropAspectRatio(false);

		iMaxWidth = this.oImageEditor._getMaxCropAreaHeight();
		assert.equal(iMaxWidth, iBigHeight, "max height is correct");

		iMaxWidth = this.oImageEditor._getMaxCropAreaHeight(true);
		assert.equal(iMaxWidth, iBigHeight, "max height is correct");

		this.oImageEditor.setKeepCropAspectRatio(true);

		iMaxWidth = this.oImageEditor._getMaxCropAreaHeight();
		assert.equal(iMaxWidth, iBigHeight, "max height is correct");

		iMaxWidth = this.oImageEditor._getMaxCropAreaHeight(true);
		assert.equal(iMaxWidth, 150, "max height is correct");

		this.oImageEditor._setCropArea(0, 0, 5, 10);
		this.oImageEditor.setKeepCropAspectRatio(false);

		iMaxWidth = this.oImageEditor._getMaxCropAreaHeight();
		assert.equal(iMaxWidth, iBigHeight, "max height is correct");

		iMaxWidth = this.oImageEditor._getMaxCropAreaHeight(true);
		assert.equal(iMaxWidth, iBigHeight, "max height is correct");

		this.oImageEditor.setKeepCropAspectRatio(true);

		iMaxWidth = this.oImageEditor._getMaxCropAreaHeight();
		assert.equal(iMaxWidth, iBigHeight, "max height is correct");

		iMaxWidth = this.oImageEditor._getMaxCropAreaHeight(true);
		assert.equal(iMaxWidth, iBigHeight, "max height is correct");
	});

	QUnit.test("No image loaded text", function(assert) {
		assert.notOk(this.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorNoData").is(":visible"), "text is not visible when image loaded");

		this.oImageEditor.setSrc("");
		assert.ok(this.oImageEditor.$().find(".sapSuiteUiCommonsImageEditorNoData").is(":visible"), "text is visible when no image loaded");
	});
});
