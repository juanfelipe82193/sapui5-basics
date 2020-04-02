/*global sap, QUnit, sinon*/
sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/suite/ui/commons/library",
	"sap/suite/ui/commons/imageeditor/ImageEditor",
	"sap/suite/ui/commons/imageeditor/ImageEditorContainer",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/m/Input",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/ValueState"
], function(jQuery, library, ImageEditor, ImageEditorContainer, createAndAppendDiv, Input, JSONModel,
			ValueState) {
	"use strict";

	var ImageEditorContainerMode = library.ImageEditorContainerMode,
		ImageEditorMode = library.ImageEditorMode,
		ImageEditorContainerButton = library.ImageEditorContainerButton,
		sBigImg = sap.ui.require.toUrl("test-resources") + "/sap/suite/ui/commons/qunit/imageeditor/images/300x246.jpg";

	createAndAppendDiv("content");

	function render(oElement) {
		oElement.placeAt("content");
		sap.ui.getCore().applyChanges();
	}

	QUnit.module("ImageEditorContainer without rendering", {
		beforeEach: function() {
			this.oImageEditorContainer = new ImageEditorContainer();
			this.oImageEditor = new ImageEditor();
			this.oSandbox = sinon.sandbox.create();
		},
		afterEach: function() {
			this.oSandbox.restore();
			this.oImageEditor.destroy();
			this.oImageEditorContainer.destroy();
		}
	});

	QUnit.test("Default properties", function(assert) {
		assert.equal(this.oImageEditorContainer.getMode(), ImageEditorContainerMode.Filter, "Filter is default mode");
		assert.equal(this.oImageEditorContainer.getImageEditor(), null, "no image editor");
		assert.deepEqual(this.oImageEditorContainer.getEnabledButtons(),
			[ImageEditorContainerButton.Filter, ImageEditorContainerButton.Transform, ImageEditorContainerButton.Crop],
			"enabledButtons are in correct order");
	});

	QUnit.test("Modes", function(assert) {
		this.oSandbox.spy(this.oImageEditorContainer, "_setModeFilter");
		this.oSandbox.spy(this.oImageEditorContainer, "_setModeTransform");
		this.oSandbox.spy(this.oImageEditorContainer, "_setModeCrop");

		this.oImageEditorContainer.setMode(ImageEditorContainerMode.Filter);
		assert.ok(this.oImageEditorContainer._setModeFilter.calledOnce, "_setModeFilter called");
		assert.notOk(this.oImageEditorContainer._setModeTransform.called, "_setModeTransform not called");
		assert.notOk(this.oImageEditorContainer._setModeCrop.called, "_setModeCrop not called");

		this.oImageEditorContainer.setMode(ImageEditorContainerMode.Transform);
		assert.ok(this.oImageEditorContainer._setModeFilter.calledOnce, "_setModeFilter not called");
		assert.ok(this.oImageEditorContainer._setModeTransform.calledOnce, "_setModeTransform called");
		assert.notOk(this.oImageEditorContainer._setModeCrop.called, "_setModeCrop not called");

		this.oImageEditorContainer.setMode(ImageEditorContainerMode.Crop);
		assert.ok(this.oImageEditorContainer._setModeFilter.calledOnce, "_setModeFilter not called");
		assert.ok(this.oImageEditorContainer._setModeTransform.calledOnce, "_setModeTransform not called");
		assert.ok(this.oImageEditorContainer._setModeCrop.calledOnce, "_setModeCrop called");
	});

	QUnit.test("setImageEditor", function(assert) {
		this.oSandbox.spy(this.oImageEditorContainer, "_detachEditorEvents");
		this.oSandbox.spy(this.oImageEditorContainer, "_attachEditorEvents");
		this.oSandbox.spy(this.oImageEditorContainer, "_onImageLoaded");

		this.oImageEditorContainer.setImageEditor(this.oImageEditor);
		assert.equal(this.oImageEditorContainer._detachEditorEvents.getCall(0).args[0], null, "_detachEditorEvents called with null");
		assert.equal(this.oImageEditorContainer._attachEditorEvents.getCall(0).args[0], this.oImageEditor, "_attachEditorEvents called with new imageeditor");
		assert.notOk(this.oImageEditorContainer._onImageLoaded.called, "_onImageLoaded not called");

		var oAnotherImage = new ImageEditor();

		this.oImageEditorContainer.setImageEditor(oAnotherImage);
		assert.equal(this.oImageEditorContainer._detachEditorEvents.getCall(1).args[0], this.oImageEditor, "_detachEditorEvents called with last image editor");
		assert.equal(this.oImageEditorContainer._attachEditorEvents.getCall(1).args[0], oAnotherImage, "_attachEditorEvents called with new imageeditor");
		assert.notOk(this.oImageEditorContainer._onImageLoaded.called, "_onImageLoaded not called");

		oAnotherImage.destroy();
	});

	QUnit.test("destroyImageEditor", function(assert) {
		this.oSandbox.spy(this.oImageEditorContainer, "_detachEditorEvents");

		this.oImageEditorContainer.setImageEditor(this.oImageEditor);
		this.oImageEditorContainer.destroyImageEditor();
		assert.ok(this.oImageEditorContainer._detachEditorEvents.calledTwice, "_detachEditorEvents called twice");
		assert.equal(this.oImageEditorContainer._detachEditorEvents.getCall(1).args[0], this.oImageEditor, "_detachEditorEvents called with last image editor");
	});

	QUnit.test("setEnabledButtons", function(assert) {
		var aEnabledButtons = [];

		this.oSandbox.spy(this.oImageEditorContainer, "_updateToolbarsContent");
		this.oSandbox.spy(this.oImageEditorContainer, "setProperty");

		this.oImageEditorContainer.setEnabledButtons(aEnabledButtons);
		assert.ok(this.oImageEditorContainer._updateToolbarsContent.calledOnce, "_updateToolbarsContent called");
		assert.equal(this.oImageEditorContainer.setProperty.getCall(0).args[0], "enabledButtons", "setProperty called for enabledButtons");
		assert.deepEqual(this.oImageEditorContainer.setProperty.getCall(0).args[1], aEnabledButtons, "setProperty called with enabled buttons");
	});

	QUnit.test("getToolbar", function(assert) {
		this.oSandbox.spy(this.oImageEditorContainer, "_getHeaderToolbar");

		this.oImageEditorContainer.getToolbar();
		assert.ok(this.oImageEditorContainer._getHeaderToolbar.calledOnce, "_getHeaderToolbar called ");
	});

	QUnit.test("getToolbarIds", function(assert) {
		var oIds = this.oImageEditorContainer.getToolbarIds();

		Object.keys(oIds).forEach(function(sKey) {
			assert.ok(oIds[sKey].startsWith(this.oImageEditorContainer.getId()), "id is prefixed");
			assert.ok(sap.ui.getCore().byId(oIds[sKey]), "object exists");
		}, this);
	});

	QUnit.test("_setModeFilter", function(assert) {
		this.oImageEditorContainer.setImageEditor(this.oImageEditor);
		this.oImageEditorContainer._setModeFilter();

		assert.equal(this.oImageEditorContainer.getMode(), ImageEditorContainerMode.Filter, "filter set");
		assert.equal(this.oImageEditor.getMode(), ImageEditorMode.Default, "mode set");

		assert.ok(this.oImageEditorContainer._getFilterButton().getPressed(), "Filter button selected");
		assert.notOk(this.oImageEditorContainer._getTransformButton().getPressed(), "Transform button not selected");
		assert.notOk(this.oImageEditorContainer._getCropButton().getPressed(), "Crop button not selected");

		assert.notDeepEqual(this.oImageEditorContainer._getOptionsPanel().getItems(), this.oImageEditorContainer._getFilterPanelContent(), "filter content not set without loaded image");
		// assert.ok(this.oImageEditorContainer._getFilterGridList().getItems()[0].getSelected, "first item is selected");
	});

	QUnit.test("_setModeTransform", function(assert) {
		this.oImageEditorContainer.setImageEditor(this.oImageEditor);
		this.oImageEditorContainer._setModeTransform();

		assert.equal(this.oImageEditorContainer.getMode(), ImageEditorContainerMode.Transform, "filter set");
		assert.equal(this.oImageEditor.getMode(), ImageEditorMode.Resize, "mode set");

		assert.notOk(this.oImageEditorContainer._getFilterButton().getPressed(), "Filter button not selected");
		assert.ok(this.oImageEditorContainer._getTransformButton().getPressed(), "Transform button selected");
		assert.notOk(this.oImageEditorContainer._getCropButton().getPressed(), "Crop button not selected");

		assert.notDeepEqual(this.oImageEditorContainer._getOptionsPanel().getItems(), this.oImageEditorContainer._getTransformPanelContent(), "transform content not set without loaded image");
	});

	QUnit.test("_setModeCrop", function(assert) {
		this.oImageEditorContainer.setImageEditor(this.oImageEditor);
		this.oImageEditorContainer._setModeCrop();

		assert.equal(this.oImageEditorContainer.getMode(), ImageEditorContainerMode.Crop, "crop set");
		assert.equal(this.oImageEditor.getMode(), ImageEditorMode.CropRectangle, "mode set");

		assert.notOk(this.oImageEditorContainer._getFilterButton().getPressed(), "Filter button not selected");
		assert.notOk(this.oImageEditorContainer._getTransformButton().getPressed(), "Transform button not selected");
		assert.ok(this.oImageEditorContainer._getCropButton().getPressed(), "Crop button selected");

		assert.notDeepEqual(this.oImageEditorContainer._getOptionsPanel().getItems(), this.oImageEditorContainer._getCropPanelContent(), "crop content not set without loaded image");
	});

	var aToolbarSettings = [
		{
			enabledButtons: [ImageEditorContainerButton.Filter, ImageEditorContainerButton.Transform, ImageEditorContainerButton.Crop],
			customItems: [],
			headerCheck: ["undoButton", "historyButton", "zoominButton", "zoomLabel", "zoomoutButton", "zoomToFitButton", "separator", "filterButton", "transformButton", "cropButton", "spacer"],
			mobileHeaderCheck: false,
			mobileFooterCheck: ["mobileUndoButton", "mobileHistoryButton", "mobileFilterButton", "mobileTransformButton", "mobileCropButton", "mobileFooterSpacer", "mobileApplyButton"]
		},
		{
			enabledButtons: [ImageEditorContainerButton.Transform, ImageEditorContainerButton.Filter],
			customItems: [],
			headerCheck: ["undoButton", "historyButton", "zoominButton", "zoomLabel", "zoomoutButton", "zoomToFitButton", "separator", "transformButton",  "filterButton", "spacer"],
			mobileHeaderCheck: false,
			mobileFooterCheck: ["mobileUndoButton", "mobileHistoryButton", "mobileTransformButton", "mobileFilterButton", "mobileFooterSpacer", "mobileApplyButton"]
		},
		{
			enabledButtons: [ImageEditorContainerButton.Transform, ImageEditorContainerButton.Filter],
			customItems: [],
			headerCheck: ["undoButton", "historyButton", "zoominButton", "zoomLabel", "zoomoutButton", "zoomToFitButton", "separator", "transformButton",  "filterButton", "spacer"],
			mobileHeaderCheck: false,
			mobileFooterCheck: ["mobileUndoButton", "mobileHistoryButton", "mobileTransformButton", "mobileFilterButton", "mobileFooterSpacer", "mobileApplyButton"]
		},
		{
			enabledButtons: [ImageEditorContainerButton.Transform, ImageEditorContainerButton.Filter],
			customItems: [new Input(), new Input()],
			headerCheck: ["undoButton", "historyButton", "zoominButton", "zoomLabel", "zoomoutButton", "zoomToFitButton", "separator", "transformButton",  "filterButton", "spacer", "proxy", "proxy"],
			mobileHeaderCheck: ["mobileSpacer", "proxy", "proxy"],
			mobileFooterCheck: ["mobileUndoButton", "mobileHistoryButton", "mobileTransformButton", "mobileFilterButton", "mobileFooterSpacer", "mobileApplyButton"]
		}
	];

	aToolbarSettings.forEach(function(oSettings) {
		QUnit.test("_updateToolbarsContent default", function(assert) {
			var oHeaderToolbar, oMobileHeaderToolbar, oMobileFooterToolbar,
				aHeaderToolbarContent, aMobileHeaderToolbarContent, aMobileFooterToolbarContent;

			this.oImageEditorContainer.setEnabledButtons(oSettings.enabledButtons);
			this.oImageEditorContainer.removeAllCustomResizeItems();
			oSettings.customItems.forEach(function(oItem) {
				this.oImageEditorContainer.addCustomToolbarControl(oItem);
			}, this);

			this.oImageEditorContainer._updateToolbarsContent();

			oHeaderToolbar = this.oImageEditorContainer._getHeaderToolbar();
			oMobileHeaderToolbar = this.oImageEditorContainer._getMobileHeaderToolbar();
			oMobileFooterToolbar = this.oImageEditorContainer._getMobileFooterToolbar();

			aHeaderToolbarContent = oHeaderToolbar.getContent();
			assert.equal(aHeaderToolbarContent.length, oSettings.headerCheck.length, "correct number of items in header toolbar");
			aHeaderToolbarContent.forEach(function(oContent, iIndex) {
				assert.ok(oContent.getId().includes(oSettings.headerCheck[iIndex]), oSettings.headerCheck[iIndex] + " in header toolbar on position " + iIndex.toString());
			}, this);

			if (!oSettings.mobileHeaderCheck) {
				assert.notOk(oMobileHeaderToolbar.getVisible(), "mobile header toolbar not visible");
			} else {
				aMobileHeaderToolbarContent = oMobileHeaderToolbar.getContent();
				assert.equal(aMobileHeaderToolbarContent.length, oSettings.mobileHeaderCheck.length, "correct number of items in mobile header toolbar");
				aMobileHeaderToolbarContent.forEach(function(oContent, iIndex) {
					assert.ok(oContent.getId().includes(oSettings.mobileHeaderCheck[iIndex]), oSettings.mobileHeaderCheck[iIndex] + " in mobile header toolbar on position " + iIndex.toString());
				}, this);
			}

			aMobileFooterToolbarContent = oMobileFooterToolbar.getContent();
			assert.equal(aMobileFooterToolbarContent.length, oSettings.mobileFooterCheck.length, "correct number of items in mobile footer toolbar");
			aMobileFooterToolbarContent.forEach(function(oContent, iIndex) {
				assert.ok(oContent.getId().includes(oSettings.mobileFooterCheck[iIndex]), oSettings.mobileFooterCheck[iIndex] + " in mobile footer toolbar on position " + iIndex.toString());
			}, this);
		});
	});

	QUnit.test("zoomToFit called on img load", function(assert) {
		var that = this,
			fnDone = assert.async();

		render(this.oImageEditorContainer);

		this.oSandbox.spy(this.oImageEditor, "zoomToFit");

		this.oImageEditorContainer.setImageEditor(this.oImageEditor);
		sap.ui.getCore().applyChanges();

		this.oImageEditor.attachLoaded(function() {
			assert.ok(that.oImageEditor.zoomToFit.calledOnce, "zoomToFit called");
			fnDone();
		});
		this.oImageEditor.setSrc(sBigImg);
	});

	QUnit.test("zoomToFit called on rendering", function(assert) {
		var that = this,
			fnDone = assert.async();


		this.oImageEditorContainer.setImageEditor(this.oImageEditor);

		this.oImageEditor.attachLoaded(function() {
			that.oSandbox.spy(that.oImageEditor, "zoomToFit");
			render(that.oImageEditorContainer);

			assert.ok(that.oImageEditor.zoomToFit.calledOnce, "zoomToFit called");
			fnDone();
		});
		this.oImageEditor.setSrc(sBigImg);
	});

	QUnit.test("zoomToFit called on setImageEditor", function(assert) {
		var that = this,
			fnDone = assert.async();

		render(this.oImageEditorContainer);


		this.oImageEditor.attachLoaded(function() {
			that.oSandbox.spy(that.oImageEditor, "zoomToFit");
			that.oImageEditorContainer.setImageEditor(that.oImageEditor);
			sap.ui.getCore().applyChanges();

			assert.ok(that.oImageEditor.zoomToFit.calledOnce, "zoomToFit called");
			fnDone();
		});
		this.oImageEditor.setSrc(sBigImg);
	});

	QUnit.module("ImageEditorContainer with rendering", {
		beforeEach: function(assert) {
			var that = this,
				fnDone = assert.async();

			this.oImageEditor = new ImageEditor({
				src: sBigImg
			});

			this.oImageEditor.attachEventOnce("loaded", function() {
				render(that.oImageEditorContainer);
				fnDone();
			});

			this.oImageEditorContainer = new ImageEditorContainer({
				imageEditor: this.oImageEditor
			});
			this.oSandbox = sinon.sandbox.create();
		},
		afterEach: function() {
			this.oSandbox.restore();
			this.oImageEditor.destroy();
			this.oImageEditorContainer.destroy();
		}
	});

	QUnit.test("customToolbarContent", function(assert) {
		var oInput = new Input();

		assert.notOk(oInput.getDomRef(), "input is not rendered");

		this.oImageEditorContainer.addCustomToolbarControl(oInput);
		sap.ui.getCore().applyChanges();

		assert.ok(oInput.getDomRef(), "input is rendered");
		assert.ok(this.oImageEditorContainer.getToolbar().$().find("#" + oInput.getId())[0], "input is in toolbar");
		assert.notOk(oInput.getBlocked(), "input is not blocked");

		this.oImageEditor.setSrc();
		sap.ui.getCore().applyChanges();

		assert.notOk(oInput.getBlocked(), "input still not blocked on custom control even when no image is loaded");
	});

	QUnit.test("_onNumberInputChange valid number", function(assert) {
		var oInput = new Input({
				value: "{/testValue}",
				valueState: "{/testValueState}",
				valueStateText: "{/testValueStateText}"
			}),
			oEvent = {},
			iValue = 5;

		this.oImageEditorContainer.callbackSpy = this.oSandbox.stub();
		oInput.setModel(this.oImageEditorContainer._oModel);
		oEvent.getSource = function() {
			return oInput;
		};
		oEvent.getParameter = this.oSandbox.stub();
		oEvent.getParameter.withArgs("value").returns(iValue);


		this.oImageEditorContainer._onNumberInputChange(
			{min: ImageEditor.LIMITS.WIDTH_MIN, max: ImageEditor.LIMITS.WIDTH_MAX, callback: "callbackSpy"},
			oEvent
		);

		assert.equal(this.oImageEditorContainer._oModel.getProperty("/testValue"), iValue, "value set");
		assert.notOk(this.oImageEditorContainer._oModel.getProperty("/testValueState"), "valueState none");
		assert.notOk(this.oImageEditorContainer._oModel.getProperty("/testValueStateText"), "valueStateText not set");
		assert.ok(this.oImageEditorContainer.callbackSpy.calledOnce, "callback called");
	});

	QUnit.test("_onNumberInputChange big number", function(assert) {
		var oInput = new Input({
				value: "{/testValue}",
				valueState: "{/testValueState}",
				valueStateText: "{/testValueStateText}"
			}),
			oEvent = {},
			iValue = 50000;

		this.oImageEditorContainer.callbackSpy = this.oSandbox.stub();
		oInput.setModel(this.oImageEditorContainer._oModel);
		oEvent.getSource = function() {
			return oInput;
		};
		oEvent.getParameter = this.oSandbox.stub();
		oEvent.getParameter.withArgs("value").returns(iValue);


		this.oImageEditorContainer._onNumberInputChange(
			{min: ImageEditor.LIMITS.WIDTH_MIN, max: ImageEditor.LIMITS.WIDTH_MAX, callback: "callbackSpy"},
			oEvent
		);

		assert.notOk(this.oImageEditorContainer._oModel.getProperty("/testValue"), "value not set");
		assert.equal(this.oImageEditorContainer._oModel.getProperty("/testValueState"), ValueState.Warning, "valueState warning");
		assert.ok(this.oImageEditorContainer._oModel.getProperty("/testValueStateText"), "valueStateText set");
		assert.ok(this.oImageEditorContainer.callbackSpy.calledOnce, "callback called");
	});

	QUnit.test("_undo", function(assert) {
		this.oSandbox.spy(this.oImageEditor, "undo");

		this.oImageEditorContainer._undo();
		assert.ok(this.oImageEditor.undo.calledOnce, "undo called");
	});

	QUnit.test("_redo", function(assert) {
		this.oSandbox.spy(this.oImageEditor, "redo");

		this.oImageEditorContainer._redo();
		assert.ok(this.oImageEditor.redo.calledOnce, "redo called");
	});

	QUnit.test("_jumpToHistory", function(assert) {
		this.oSandbox.spy(this.oImageEditor, "jumpToHistory");

		this.oImageEditorContainer._jumpToHistory();
		assert.ok(this.oImageEditor.jumpToHistory.calledOnce, "jumpToHistory called");
	});

	QUnit.test("_setZoom", function(assert) {
		this.oSandbox.spy(this.oImageEditor, "zoom");

		this.oImageEditorContainer._setZoom(100);
		assert.ok(this.oImageEditor.zoom.calledOnce, "zoom called");
	});

	QUnit.test("_setWidth", function(assert) {
		this.oSandbox.spy(this.oImageEditor, "setWidth");

		this.oImageEditorContainer._setWidth();
		assert.ok(this.oImageEditor.setWidth.calledOnce, "setWidth called");
	});

	QUnit.test("_setHeight", function(assert) {
		this.oSandbox.spy(this.oImageEditor, "setHeight");

		this.oImageEditorContainer._setHeight();
		assert.ok(this.oImageEditor.setHeight.calledOnce, "setHeight called");
	});

	QUnit.test("_setSize", function(assert) {
		this.oSandbox.spy(this.oImageEditor, "setSize");

		this.oImageEditorContainer._setSize();
		assert.ok(this.oImageEditor.setSize.calledOnce, "setSize called");
	});

	QUnit.test("_rotate", function(assert) {
		this.oSandbox.spy(this.oImageEditor, "rotate");

		this.oImageEditorContainer._rotate();
		assert.ok(this.oImageEditor.rotate.calledOnce, "rotate called");
	});

	QUnit.test("_flip", function(assert) {
		this.oSandbox.spy(this.oImageEditor, "flip");

		this.oImageEditorContainer._flip();
		assert.ok(this.oImageEditor.flip.calledOnce, "flip called");
	});

	QUnit.test("_setKeepResizeAspectRatio", function(assert) {
		this.oSandbox.spy(this.oImageEditor, "setKeepResizeAspectRatio");

		this.oImageEditorContainer._setKeepResizeAspectRatio();
		assert.ok(this.oImageEditor.setKeepResizeAspectRatio.calledOnce, "setKeepResizeAspectRatio called");
	});

	QUnit.test("_setKeepCropAspectRatio", function(assert) {
		this.oSandbox.spy(this.oImageEditor, "setKeepCropAspectRatio");

		this.oImageEditorContainer._setKeepCropAspectRatio();
		assert.ok(this.oImageEditor.setKeepCropAspectRatio.calledOnce, "setKeepCropAspectRatio called");
	});

	QUnit.test("_applyCurrentFilter", function(assert) {
		var sFilter =  this.oImageEditorContainer._oModel.getProperty("/filter/filters/0/type");

		this.oImageEditorContainer._oModel.setProperty("/filter/selectedFilter", this.oImageEditorContainer._oModel.getProperty("/filter/filters/0"));
		this.oSandbox.spy(this.oImageEditor, sFilter);

		this.oImageEditorContainer._applyCurrentFilter();
		assert.ok(this.oImageEditor[sFilter].calledOnce, sFilter + " called");
	});

	QUnit.test("_getHistoryPopover", function(assert) {
		var oPopover = this.oImageEditorContainer._getHistoryPopover();
		assert.ok(oPopover.isA("sap.m.ResponsivePopover"), "popover returned");
	});

	QUnit.test("_setModeFilter", function(assert) {
		this.oImageEditorContainer.setImageEditor(this.oImageEditor);
		this.oImageEditorContainer._setModeFilter();

		assert.equal(this.oImageEditorContainer.getMode(), ImageEditorContainerMode.Filter, "filter set");
		assert.equal(this.oImageEditor.getMode(), ImageEditorMode.Default, "mode set");

		assert.ok(this.oImageEditorContainer._getFilterButton().getPressed(), "Filter button selected");
		assert.notOk(this.oImageEditorContainer._getTransformButton().getPressed(), "Transform button not selected");
		assert.notOk(this.oImageEditorContainer._getCropButton().getPressed(), "Crop button not selected");

		assert.deepEqual(this.oImageEditorContainer._getOptionsPanel().getItems(), this.oImageEditorContainer._getFilterPanelContent(), "filter content set");
		assert.ok(this.oImageEditorContainer._getFilterGridList().getItems()[0].getSelected, "first item is selected");
	});

	QUnit.test("_setModeTransform", function(assert) {
		this.oImageEditorContainer.setImageEditor(this.oImageEditor);
		this.oImageEditorContainer._setModeTransform();

		assert.equal(this.oImageEditorContainer.getMode(), ImageEditorContainerMode.Transform, "filter set");
		assert.equal(this.oImageEditor.getMode(), ImageEditorMode.Resize, "mode set");

		assert.notOk(this.oImageEditorContainer._getFilterButton().getPressed(), "Filter button not selected");
		assert.ok(this.oImageEditorContainer._getTransformButton().getPressed(), "Transform button selected");
		assert.notOk(this.oImageEditorContainer._getCropButton().getPressed(), "Crop button not selected");

		assert.deepEqual(this.oImageEditorContainer._getOptionsPanel().getItems(), this.oImageEditorContainer._getTransformPanelContent(), "transform content set");
	});

	QUnit.test("_setModeCrop", function(assert) {
		this.oImageEditorContainer.setImageEditor(this.oImageEditor);
		this.oImageEditorContainer._setModeCrop();

		assert.equal(this.oImageEditorContainer.getMode(), ImageEditorContainerMode.Crop, "crop set");
		assert.equal(this.oImageEditor.getMode(), ImageEditorMode.CropRectangle, "mode set");

		assert.notOk(this.oImageEditorContainer._getFilterButton().getPressed(), "Filter button not selected");
		assert.notOk(this.oImageEditorContainer._getTransformButton().getPressed(), "Transform button not selected");
		assert.ok(this.oImageEditorContainer._getCropButton().getPressed(), "Crop button selected");

		assert.deepEqual(this.oImageEditorContainer._getOptionsPanel().getItems(), this.oImageEditorContainer._getCropPanelContent(), "crop content set");
		assert.ok(this.oImageEditorContainer._getRectangleCropGridList().getItems()[0].getSelected, "first item is selected");
	});

});
