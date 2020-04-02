sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/commons/ChartContainerContent",
	"sap/suite/ui/commons/ChartContainer",
	"sap/viz/ui5/controls/VizFrame",
	"sap/suite/ui/commons/ChartContainerToolbarPlaceholder",
	"sap/m/ToolbarDesign",
	"sap/ui/Device",
	"sap/m/ButtonType",
	"sap/m/Button",
	"sap/ui/core/Control",
	"sap/m/ToolbarSpacer",
	"sap/ui/thirdparty/sinon"
], function(jQuery, ChartContainerContent, ChartContainer, VizFrame, ChartContainerToolbarPlaceholder, ToolbarDesign, Device,
            ButtonType, Button, Control, ToolbarSpacer, sinon) {
	"use strict";

	QUnit.module("Helper methods", {
		beforeEach : function() {
			this.clock = sinon.useFakeTimers();
			var oVizFrame = new VizFrame("vizFrameHelpers");
			this.oVizFrameContent = new ChartContainerContent("chartContainerContentHelpers",{
				content : oVizFrame
			});
			this.oChartContainer = new ChartContainer("chartContainerHelpers", {
				content : this.oVizFrameContent
			});
			this.oChartContainer.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.clock.restore();
			this.oChartContainer.destroy();
			this.oChartContainer = null;
		}
	});

	QUnit.test("_toggleFullScreen shows fullscreen when it's off", function(assert) {
		var bFullScreen = false;
		var stubGetProperty = sinon.stub(this.oChartContainer, "getProperty").returns(bFullScreen);
		var stubCloseFullScreen = sinon.stub(this.oChartContainer, "_closeFullScreen");
		var stubOpenFullScreen = sinon.stub(this.oChartContainer, "_openFullScreen");
		var stubSetProperty = sinon.stub(this.oChartContainer, "setProperty");

		this.oChartContainer._toggleFullScreen();

		assert.ok(stubGetProperty.called, "getProperty called");
		assert.ok(stubGetProperty.calledWith("fullScreen"), "getProperty called with fullscreen");
		assert.ok(stubCloseFullScreen.notCalled, "closeFullScreen not called");
		assert.ok(stubOpenFullScreen.called, "closeFullScreen called");
		assert.ok(stubSetProperty.called, "setProperty called");
		assert.ok(stubSetProperty.calledWith("fullScreen", true, true), "property set to true");
	});

	QUnit.test("_toggleFullScreen hides fullscreen when it's on", function(assert) {
		var bFullScreen = true;

		var stubGetProperty = sinon.stub(this.oChartContainer, "getProperty").returns(bFullScreen);
		var spyGetAggregation = sinon.spy(this.oChartContainer, "getAggregation");
		var stubInvalidate = sinon.stub(this.oChartContainer, "invalidate");
		var stubCloseFullScreen = sinon.stub(this.oChartContainer, "_closeFullScreen");
		var stubOpenFullScreen = sinon.stub(this.oChartContainer, "_openFullScreen");
		var stubSetProperty = sinon.stub(this.oChartContainer, "setProperty");

		this.oChartContainer._toggleFullScreen();

		assert.ok(stubGetProperty.called, "getProperty called");
		assert.ok(stubGetProperty.calledWith("fullScreen"), "getProperty called with fullscreen");
		assert.ok(spyGetAggregation.called, "getAggregation called");
		assert.ok(spyGetAggregation.calledWith("content"), "getAggregation called with content");
		assert.ok(stubInvalidate.called, "invalidate called");
		assert.ok(stubCloseFullScreen.called, "closeFullScreen called");
		assert.ok(stubOpenFullScreen.notCalled, "closeFullScreen not called");
		assert.ok(stubSetProperty.called, "setProperty called");
		assert.ok(stubSetProperty.calledWith("fullScreen", false, true), "property set to true");
	});

	QUnit.test("_openFullScreen opens the full screen", function(assert) {
		var stubOpen = sinon.stub(this.oChartContainer._oPopup, "open");
		var stubSetContent = sinon.stub(this.oChartContainer._oPopup, "setContent");

		this.oChartContainer._openFullScreen();

		assert.ok(this.oChartContainer._$overlay, "overlay jQuery property cretaed");
		assert.ok(this.oChartContainer._$overlay.hasClass("sapSuiteUiCommonsChartContainerOverlay"), "overlay has class sapSuiteUiCommonsChartContainerOverlay");
		assert.ok(this.oChartContainer._$overlay.hasClass("sapSuiteUiCommonsChartContainerChartArea"), "overlay has class sapSuiteUiCommonsChartContainerChartArea");
		assert.ok(this.oChartContainer._$overlay.find(this.oChartContainer.$content), "overlay has the content appended to it");
		assert.ok(stubOpen.called, "open on the popup called");
		assert.ok(stubSetContent.called, "setContent on the popup called");
	});

	QUnit.test("_closeFullScreen closes the full screen", function(assert) {
		var sContent = "testContent";

		var spyDestroy = sinon.spy();
		var spyReplaceWith = sinon.spy();
		var spyRemove = sinon.spy();
		var stubSetDesign = sinon.stub(this.oChartContainer._oToolBar, "setDesign");
		var stubClose = sinon.stub(this.oChartContainer._oPopup, "close");

		this.oChartContainer._oScrollEnablement = {
			destroy: spyDestroy
		};
		this.oChartContainer.$content = sContent;
		this.oChartContainer.$tempNode = {
			replaceWith: spyReplaceWith
		};
		this.oChartContainer._$overlay = {
			remove: spyRemove
		};

		this.oChartContainer._closeFullScreen();

		assert.ok(spyDestroy.called, "replaceWith on the $tmpNode called");
		assert.ok(spyReplaceWith.called, "replaceWith on the $tmpNode called");
		assert.ok(spyReplaceWith.calledWith(sContent), "replaceWith on the $tmpNode called with the content");
		assert.ok(stubSetDesign.called, "setDesign on the Toolbar called");
		assert.ok(stubSetDesign.calledWith(sinon.match(ToolbarDesign.Auto)), "setDesign on the Toolbar called with 'sap.m.ToolbarDesign.Auto'");
		assert.deepEqual(this.oChartContainer._oScrollEnablement, null, "_oScrollEnablement is null");
		assert.ok(stubClose.called, "close on the popup called");
		assert.ok(spyRemove.called, "remove on overlay called");

		this.$tempNode = null;
		this.$content = null;
	});

	QUnit.test("_performHeightChanges perform height changes is viz frame", function(assert) {
		var spyGetAutoAdjustHeight = sinon.spy(this.oChartContainer, "getAutoAdjustHeight");
		var stubGetFullScreen = sinon.stub(this.oChartContainer, "getFullScreen").returns(true);
		var spyGetSelectedContent = sinon.spy(this.oChartContainer, "getSelectedContent");
		var stubRerender = sinon.stub(this.oChartContainer, "rerender");
		var stubRememberOriginalHeight = sinon.stub(this.oChartContainer, "_rememberOriginalHeight");

		this.oChartContainer._performHeightChanges();

		assert.ok(spyGetAutoAdjustHeight.called, "getAutoAdjustHeight called");
		assert.ok(stubGetFullScreen.called, "getFullScreen called");
		assert.ok(spyGetSelectedContent.called, "getSelectedContent called");
		assert.ok(stubRememberOriginalHeight.called, "_rememberOriginalHeight called");
		assert.ok(stubRerender.notCalled, "rerender not called");
	});

	QUnit.test("_performHeightChanges re-renders when content is not a VizFrame", function(assert) {
		var done = assert.async();
		var sOffsetWidth = "testOffsetWidth";
		var $SelectedContent = {
			innerWidth: function () {
				return sOffsetWidth;
			}
		};
		var stubGetSelectedContentJQueryRef = sinon.stub().returns($SelectedContent),
			stubGetMetadata = sinon.stub().returns({
				getName: sinon.stub().returns("sap.ui.table.Table")
			});
		var oContent = {
			$: stubGetSelectedContentJQueryRef,
			getMetadata: stubGetMetadata
		};
		var stubGetContent = sinon.stub().returns(oContent);
		var oSelectedContent = {
			getContent: stubGetContent
		};

		this.oChartContainer.addStyleClass("sapUiResponsiveContentPadding");
		this.oChartContainer.invalidate();
		sap.ui.getCore().applyChanges();

		var spyGetAutoAdjustHeight = sinon.spy(this.oChartContainer, "getAutoAdjustHeight");
		var stubGetFullScreen = sinon.stub(this.oChartContainer, "getFullScreen").returns(true);
		var stubGetSelectedContent = sinon.stub(this.oChartContainer, "getSelectedContent").returns(oSelectedContent);
		var spyGetDomRef = sinon.spy(this.oChartContainer, "getDomRef");
		var stubRememberOriginalHeight = sinon.stub(this.oChartContainer, "_rememberOriginalHeight");
		var stubRerender = sinon.stub(this.oChartContainer, "rerender");
		this.checkRendererLoop = function () {
			sap.ui.getCore().applyChanges();
			assert.equal(stubRerender.callCount, 1, "rerender still called once - no re-render loop detected");
			done();
		};

		this.oChartContainer._performHeightChanges();

		assert.ok(spyGetAutoAdjustHeight.called, "getAutoAdjustHeight called");
		assert.ok(stubGetFullScreen.called, "getFullScreen called");
		assert.ok(stubGetSelectedContent.called, "getSelectedContent called");
		assert.ok(stubGetContent.called, "getContent called");
		assert.ok(stubGetSelectedContentJQueryRef.called, "getDomRef on selected content's content called");
		assert.ok(spyGetDomRef.called, "getDomRef on chart container called");
		assert.ok(stubRememberOriginalHeight.notCalled, "_rememberOriginalHeight not called");
		assert.equal(stubRerender.callCount, 1,"rerender called once");
		this.clock.tick(1000000);
		this.checkRendererLoop();
	});

	QUnit.test("_rememberOriginalHeight stores the height when the chart has height", function(assert) {
		this.oChartContainer._mOriginalVizFrameHeights = ["test", "test2"];

		var iHeight = 5;
		var iId = 2;
		var stubGetHeight = sinon.stub().returns(iHeight);
		var stubGetId = sinon.stub().returns(iId);
		var oChart = {
			getHeight: stubGetHeight,
			getId: stubGetId
		};

		this.oChartContainer._rememberOriginalHeight(oChart);

		assert.ok(stubGetHeight.called, "getHeight on the passed chart called");
		assert.ok(stubGetId.called, "getId on the passed chart called");
		assert.equal(this.oChartContainer._mOriginalVizFrameHeights[iId], iHeight, "Height added to the viz frame heights properly");
	});

	QUnit.test("_rememberOriginalHeight stores the height as 0 when the chart has no height", function(assert) {
		this.oChartContainer._mOriginalVizFrameHeights = ["test", "test2"];

		var iId = 2;
		var stubGetId = sinon.stub().returns(iId);
		var oChart = {
			getHeight: "nonFunction",
			getId: stubGetId
		};

		this.oChartContainer._rememberOriginalHeight(oChart);

		assert.ok(stubGetId.called, "getId on the passed chart called");
		assert.equal(this.oChartContainer._mOriginalVizFrameHeights[iId], 0, "Height set as 0");
	});

	QUnit.test("_switchChart selects the chart from the passed id", function(assert) {
		var sChartId = "chartId";
		var sChart = "testChart";

		var stubFindChartById = sinon.stub(this.oChartContainer, "_findChartById").returns(sChart);
		var stubSetSelectedContent = sinon.stub(this.oChartContainer, "_setSelectedContent").returns(sChart);
		var stubFireContentChange = sinon.stub(this.oChartContainer, "fireContentChange");
		var stubRerender = sinon.stub(this.oChartContainer, "rerender");

		this.oChartContainer._switchChart(sChartId);

		assert.ok(stubFindChartById.called, "_findChartById called");
		assert.ok(stubSetSelectedContent.called, "_setSelectedContent called");
		assert.ok(stubSetSelectedContent.calledWith(sChart), "_setSelectedContent called with the found chart");
		assert.ok(stubFireContentChange.called, "fireContentChange called");
		assert.ok(stubFireContentChange.calledWith(sinon.match({
			selectedItemId : sChartId
		})), "fireContentChange called with an object with the id");
		assert.ok(stubRerender.called, "rerender called");
	});

	QUnit.test("_chartChange changes the chart properly", function(assert) {
		var aUsedIcons = this.oChartContainer._aUsedContentIcons.slice();
		this.oChartContainer._bChartContentHasChanged = true;

		var spyGetContent = sinon.spy(this.oChartContainer, "getContent");
		var spyDestroyButtons = sinon.spy(this.oChartContainer, "_destroyButtons");
		var stubRemoveAllButtons = sinon.stub(this.oChartContainer._oChartSegmentedButton, "removeAllButtons");
		var stubSetDefaultOnSegmentedButton = sinon.stub(this.oChartContainer, "_setDefaultOnSegmentedButton");
		var stubSwitchChart = sinon.stub(this.oChartContainer, "switchChart");
		var stubGetShowLegend = sinon.stub(this.oChartContainer, "getShowLegend");
		var stubSetSelectedContent = sinon.stub(this.oChartContainer, "_setSelectedContent");

		this.oChartContainer._chartChange();

		assert.ok(spyGetContent.called, "getContent called");
		assert.ok(spyDestroyButtons.called, "getContent called");
		assert.ok(spyDestroyButtons.calledWith(sinon.match(aUsedIcons)), "getContent called");
		assert.ok(stubRemoveAllButtons.notCalled, "removeAllButtons on _oChartSegmentedButton not called");
		assert.ok(stubSetDefaultOnSegmentedButton.notCalled, "_setDefaultOnSegmentedButton not called");
		assert.ok(stubSwitchChart.notCalled, "switchChart not called");
		assert.ok(stubGetShowLegend.called, "getShowLegend called");
		assert.ok(stubSetSelectedContent.called, "_setSelectedContent called");
		assert.ok(this.oChartContainer._oActiveChartButton, "_oActiveChartButton is set");
		assert.ok(this.oChartContainer._oActiveChartButton instanceof Button, "_oActiveChartButton is an sap.m.Button");
		assert.ok(this.oChartContainer._aUsedContentIcons.length > 0, "_aUsedContentIcons are created");
		assert.equal(this.oChartContainer._bChartContentHasChanged, false, "_bChartContentHasChanged set to false");
	});

	QUnit.test("_chartChange changes the chart to null is there's no content", function(assert) {
		var aUsedIcons = "testIcons";
		this.oChartContainer._bChartContentHasChanged = true;
		this.oChartContainer._aUsedContentIcons = "testIcons";

		var stubGetContent = sinon.stub(this.oChartContainer, "getContent").returns([]);
		var stubDestroyButtons = sinon.stub(this.oChartContainer, "_destroyButtons");
		var stubRemoveAllButtons = sinon.stub(this.oChartContainer._oChartSegmentedButton, "removeAllButtons");
		var stubSetDefaultOnSegmentedButton = sinon.stub(this.oChartContainer, "_setDefaultOnSegmentedButton");
		var stubSwitchChart = sinon.stub(this.oChartContainer, "switchChart");

		this.oChartContainer._chartChange();

		assert.ok(stubGetContent.called, "getContent called");
		assert.ok(stubDestroyButtons.called, "getContent called");
		assert.ok(stubDestroyButtons.calledWith(aUsedIcons), "getContent called with the used icons");
		assert.ok(stubRemoveAllButtons.called, "removeAllButtons on _oChartSegmentedButton called");
		assert.ok(stubSetDefaultOnSegmentedButton.called, "_setDefaultOnSegmentedButton called");
		assert.ok(stubSwitchChart.called, "switchChart called");
		assert.ok(stubSwitchChart.calledWith(null), "switchChart called with null");
		assert.deepEqual(this.oChartContainer._aUsedContentIcons, [], "_aUsedContentIcons is set to an empty array");
		assert.equal(this.oChartContainer._bChartContentHasChanged, false, "_bChartContentHasChanged set to false");
	});

	QUnit.test("_findChartById returns if no content was found", function(assert) {
		var stubGetAggregation = sinon.stub(this.oChartContainer, "getAggregation");

		var oChart = this.oChartContainer._findChartById();

		assert.ok(stubGetAggregation.called, "getAggregation called");
		assert.ok(stubGetAggregation.calledWith("content"), "getAggregation called with 'content'");
		assert.deepEqual(oChart, null, "null returned");
	});

	QUnit.test("_findChartById returns if no content was found", function(assert) {
		var sChartId = "testId";
		var stubGetId = sinon.stub().returns(sChartId);
		var oContent = {
			getId: stubGetId
		};
		var stubGetContent = sinon.stub().returns(oContent);
		var oObject = {
			getContent: stubGetContent
		};
		var stubGetAggregation = sinon.stub(this.oChartContainer, "getAggregation").returns([oObject]);

		var oChart = this.oChartContainer._findChartById(sChartId);

		assert.ok(stubGetAggregation.called, "getAggregation called");
		assert.ok(stubGetAggregation.calledWith("content"), "getAggregation called with 'content'");
		assert.ok(stubGetContent.called, "getContent called");
		assert.ok(stubGetId.called, "getId called");
		assert.deepEqual(oChart, oObject, "found chart is found");
	});

	QUnit.test("_getToolbarPlaceHolderPosition returns -1 if the position wasn't found", function(assert) {
		var oToolbar = {
			getContent: function() {
				return [];
			}
		};

		var iPosition = this.oChartContainer._getToolbarPlaceHolderPosition(oToolbar);

		assert.equal(iPosition, -1, "-1 returned");
	});

	QUnit.test("_getToolbarPlaceHolderPosition returns the position", function(assert) {
		var oPlaceholder = new ChartContainerToolbarPlaceholder();
		var oToolbar = {
			getContent: function() {
				return [{}, oPlaceholder];
			}
		};

		var iPosition = this.oChartContainer._getToolbarPlaceHolderPosition(oToolbar);

		assert.equal(iPosition, 1, "correct position returned");
	});

	QUnit.test("_addContentToolbar adds content to toolbar if there isn't one and no position is specified", function(assert) {
		this.oChartContainer._bHasApplicationToolbar = false;

		var sContent = "testContent";

		var stubAddContent = sinon.stub(this.oChartContainer._oToolBar, "addContent");
		var stubInsertContent = sinon.stub(this.oChartContainer._oToolBar, "insertContent");

		this.oChartContainer._addContentToolbar(sContent);

		assert.ok(stubAddContent.called, "addContent on _oToolBar called");
		assert.ok(stubAddContent.calledWith(sContent), "addContent on _oToolBar called with the passed content");
		assert.ok(stubInsertContent.notCalled, "insertContent on _oToolBar not called");
	});

	QUnit.test("_addContentToolbar inserts content to toolbar if there isn't one and a position is specified", function(assert) {
		this.oChartContainer._bHasApplicationToolbar = false;

		var sContent = "testContent";
		var iIndex = 4;

		var stubAddContent = sinon.stub(this.oChartContainer._oToolBar, "addContent");
		var stubInsertContent = sinon.stub(this.oChartContainer._oToolBar, "insertContent");

		this.oChartContainer._addContentToolbar(sContent, iIndex);

		assert.ok(stubAddContent.notCalled, "addContent on _oToolBar not called");
		assert.ok(stubInsertContent.called, "insertContent on _oToolBar called");
		assert.ok(stubInsertContent.calledWith(sContent, iIndex), "insertContent on _oToolBar called with the passed content and index");
	});

	QUnit.test("_addContentToolbar inserts content to toolbar if there is one and a position is specified", function(assert) {
		var oContent = new Control();
		var iIndex = 4;
		var iPlaceholderPosition = 3;

		this.oChartContainer._bHasApplicationToolbar = true;
		this.oChartContainer._iPlaceholderPosition = iPlaceholderPosition;

		var stubAddContent = sinon.stub(this.oChartContainer._oToolBar, "addContent");
		var stubInsertContent = sinon.stub(this.oChartContainer._oToolBar, "insertAggregation");

		this.oChartContainer._addContentToolbar(oContent, iIndex);

		assert.ok(stubAddContent.notCalled, "addContent on _oToolBar not called");
		assert.ok(stubInsertContent.called, "insertAggregation on _oToolBar called");
		assert.ok(stubInsertContent.calledWith("content", oContent, iPlaceholderPosition + iIndex), "insertAggregtaion on _oToolBar called with the passed content and index");
		assert.equal(this.oChartContainer._iPlaceholderPosition, iPlaceholderPosition + iIndex + 1, "placeholder position updated correctly");
	});

	QUnit.test("_addContentToolbar updates placeholder position and returns when content is ToolbarSpacer", function(assert) {
		var oContent = new ToolbarSpacer();
		var iPlaceholderPosition = 3;

		this.oChartContainer._bHasApplicationToolbar = true;

		var stubAddContent = sinon.stub(this.oChartContainer._oToolBar, "addContent");
		var stubInsertContent = sinon.stub(this.oChartContainer._oToolBar, "insertContent");
		var stubGetToolbarPlaceHolderPosition = sinon.stub(this.oChartContainer, "_getToolbarPlaceHolderPosition").returns(iPlaceholderPosition);

		this.oChartContainer._addContentToolbar(oContent);

		assert.ok(stubAddContent.notCalled, "addContent on _oToolBar not called");
		assert.ok(stubInsertContent.notCalled, "insertContent on _oToolBar not called");
		assert.ok(stubGetToolbarPlaceHolderPosition.called, "_getToolbarPlaceHolderPosition called");
		assert.equal(this.oChartContainer._iPlaceholderPosition, iPlaceholderPosition, "placeholder position updated correctly");
	});

	QUnit.test("_rearrangeToolbar inserts toolbarContent into the toolbar", function(assert) {
		var sContent1 = "testContent1";
		var sContent2 = "testContent2";
		this.oChartContainer._aToolbarContent = [sContent1, sContent2];

		var stubInsertContent = sinon.stub(this.oChartContainer._oToolBar, "insertContent");

		this.oChartContainer._rearrangeToolbar();

		assert.ok(stubInsertContent.called, "insertContent on _oToolBar called");
		assert.ok(stubInsertContent.calledTwice, "insertContent on _oToolBar called");
		assert.ok(stubInsertContent.calledWith(sContent1, 0), "insertContent on _oToolBar called with the 1st content");
		assert.ok(stubInsertContent.calledWith(sContent2, 1), "insertContent on _oToolBar called with the 2nd content");
	});

	QUnit.test("_adjustIconsDisplay adds the legend button if it should be shown", function(assert) {
		var bShowLegendButton = true;
		var sLegendButton = "testShowLegendButton";

		this.oChartContainer._oShowLegendButton = sLegendButton;

		var spyGetShowLegendButton = sinon.stub(this.oChartContainer, "getShowLegendButton").returns(bShowLegendButton);
		var stubAddContentToolbar = sinon.stub(this.oChartContainer, "_addContentToolbar");

		this.oChartContainer._adjustIconsDisplay();

		assert.ok(spyGetShowLegendButton.called, "getShowLegendButton called");
		assert.ok(stubAddContentToolbar.called, "_addContentToolbar called");
		assert.ok(stubAddContentToolbar.calledWith(sLegendButton), "_addContentToolbar called with the legend button");

		this.oChartContainer._oShowLegendButton = null;
	});

	QUnit.test("_adjustIconsDisplay doesn't add the legend button if it should not be shown", function(assert) {
		var bShowLegendButton = false;
		var sLegendButton = "testShowLegendButton";

		this.oChartContainer._oShowLegendButton = sLegendButton;

		var spyGetShowLegendButton = sinon.stub(this.oChartContainer, "getShowLegendButton").returns(bShowLegendButton);
		var stubAddContentToolbar = sinon.stub(this.oChartContainer, "_addContentToolbar");

		this.oChartContainer._adjustIconsDisplay();

		assert.ok(spyGetShowLegendButton.called, "getShowLegendButton called");
		assert.ok(stubAddContentToolbar.neverCalledWith(sLegendButton), "_addContentToolbar not called with the legend button");

		this.oChartContainer._oShowLegendButton = null;
	});

	QUnit.test("_adjustIconsDisplay adds the zoom buttons if they should be shown", function(assert) {
		if (Device.system.desktop) {
			var sZoomInButton = "testZoomInButton";
			var sZoomOutButton = "testZoomOutButton";

			this.oChartContainer._oZoomInButton = sZoomInButton;
			this.oChartContainer._oZoomOutButton = sZoomOutButton;

			var oStubGetShowZoom = sinon.stub(this.oChartContainer, "getShowZoom").returns(true);
			var oStubAddContentToolbar = sinon.stub(this.oChartContainer, "_addContentToolbar");

			this.oChartContainer._adjustIconsDisplay();

			assert.ok(oStubGetShowZoom.called, "getShowZoom called");
			assert.ok(oStubAddContentToolbar.called, "_addContentToolbar called");
			assert.ok(oStubAddContentToolbar.calledWith(sZoomInButton), "_addContentToolbar called with the zoom in button");
			assert.ok(oStubAddContentToolbar.calledWith(sZoomOutButton), "_addContentToolbar called with the zoom out button");

			this.oChartContainer._oZoomInButton = null;
			this.oChartContainer._oZoomOutButton = null;
		} else {
			assert.ok(!Device.system.desktop, "Skipping the test for mobile devices that do not have zoom buttons");
		}
	});

	QUnit.test("_adjustIconsDisplay doesn't adds the zoom buttons if they should not be shown", function(assert) {
		var bShowZoom = false;
		var sZoomInButton = "testZoomInButton";
		var sZoomOutButton = "testZoomOutButton";

		this.oChartContainer._oZoomInButton = sZoomInButton;
		this.oChartContainer._oZoomOutButton = sZoomOutButton;

		var spyGetShowZoom = sinon.stub(this.oChartContainer, "getShowZoom").returns(bShowZoom);
		var stubAddContentToolbar = sinon.stub(this.oChartContainer, "_addContentToolbar");

		this.oChartContainer._adjustIconsDisplay();

		assert.ok(spyGetShowZoom.called, "getShowZoom called");
		assert.ok(stubAddContentToolbar.neverCalledWith(sZoomInButton), "_addContentToolbar not called with the zoom in button");
		assert.ok(stubAddContentToolbar.neverCalledWith(sZoomOutButton), "_addContentToolbar not called with the zoom out button");

		this.oChartContainer._oZoomInButton = null;
		this.oChartContainer._oZoomOutButton = null;
	});

	QUnit.test("_adjustIconsDisplay adds the personalization button if it should be shown", function(assert) {
		var bShowPersonalization = true;
		var sPersonalizationButton = "testPersonalizationButton";

		this.oChartContainer._oPersonalizationButton = sPersonalizationButton;

		var spyGetShowPersonalization = sinon.stub(this.oChartContainer, "getShowPersonalization").returns(bShowPersonalization);
		var stubAddContentToolbar = sinon.stub(this.oChartContainer, "_addContentToolbar");

		this.oChartContainer._adjustIconsDisplay();

		assert.ok(spyGetShowPersonalization.called, "getShowPersonalization called");
		assert.ok(stubAddContentToolbar.called, "_addContentToolbar called");
		assert.ok(stubAddContentToolbar.calledWith(sPersonalizationButton), "_addContentToolbar called with the personalization button");

		this.oChartContainer._oPersonalizationButton = null;
	});

	QUnit.test("_adjustIconsDisplay doesn't add the personalization button if it should not be shown", function(assert) {
		var bShowPersonalization = false;
		var sPersonalizationButton = "testPersonalizationButton";

		this.oChartContainer._oPersonalizationButton = sPersonalizationButton;

		var spyGetShowPersonalization = sinon.stub(this.oChartContainer, "getShowPersonalization").returns(bShowPersonalization);
		var stubAddContentToolbar = sinon.stub(this.oChartContainer, "_addContentToolbar");

		this.oChartContainer._adjustIconsDisplay();

		assert.ok(spyGetShowPersonalization.called, "getShowPersonalization called");
		assert.ok(stubAddContentToolbar.neverCalledWith(sPersonalizationButton), "_addContentToolbar not called with the personalization button");

		this.oChartContainer._oPersonalizationButton = null;
	});

	QUnit.test("_adjustIconsDisplay adds the fullscreen button if it should be shown", function(assert) {
		var bShowFullScreen = true;
		var sFullScreenButton = "testPersonalizationButton";

		this.oChartContainer._oFullScreenButton = sFullScreenButton;

		var spyGetShowFullScreen = sinon.stub(this.oChartContainer, "getShowFullScreen").returns(bShowFullScreen);
		var stubAddContentToolbar = sinon.stub(this.oChartContainer, "_addContentToolbar");

		this.oChartContainer._adjustIconsDisplay();

		assert.ok(spyGetShowFullScreen.called, "getShowPersonalization called");
		assert.ok(stubAddContentToolbar.called, "_addContentToolbar called");
		assert.ok(stubAddContentToolbar.calledWith(sFullScreenButton), "_addContentToolbar called with the fullscreen button");

		this.oChartContainer._oFullScreenButton = null;
	});

	QUnit.test("_adjustIconsDisplay doesn't add the fullscreen button if it should not be shown", function(assert) {
		var bShowFullScreen = false;
		var sFullScreenButton = "testPersonalizationButton";

		this.oChartContainer._oFullScreenButton = sFullScreenButton;

		var spyGetShowFullScreen = sinon.stub(this.oChartContainer, "getShowFullScreen").returns(bShowFullScreen);
		var stubAddContentToolbar = sinon.stub(this.oChartContainer, "_addContentToolbar");

		this.oChartContainer._adjustIconsDisplay();

		assert.ok(spyGetShowFullScreen.called, "getShowPersonalization called");
		assert.ok(stubAddContentToolbar.neverCalledWith(sFullScreenButton), "_addContentToolbar not called with the fullscreen button");

		this.oChartContainer._oFullScreenButton = null;
	});

	QUnit.test("_adjustIconsDisplay adds all _aCustomIcons to content toolbar", function(assert) {
		var sCustomIcon1 = "testIcon1";
		var sCustomIcon2 = "testIcon2";
		this.oChartContainer._aCustomIcons = [sCustomIcon1, sCustomIcon2];

		var stubAddContentToolbar = sinon.stub(this.oChartContainer, "_addContentToolbar");

		this.oChartContainer._adjustIconsDisplay();

		assert.ok(stubAddContentToolbar.called, "_addContentToolbar called");
		assert.ok(stubAddContentToolbar.calledWith(sCustomIcon1), "_addContentToolbar called with the first icon");
		assert.ok(stubAddContentToolbar.calledWith(sCustomIcon2), "_addContentToolbar called with the second icon");

		this.oChartContainer._aCustomIcons = [];
	});

	QUnit.test("_adjustIconsDisplay removes segmented buttons when chart container is rendered", function(assert) {
		this.oChartContainer._bControlNotRendered = false;

		var spyRemoveAllButtons = sinon.stub(this.oChartContainer._oChartSegmentedButton, "removeAllButtons");

		this.oChartContainer._adjustIconsDisplay();

		assert.ok(spyRemoveAllButtons.called, "removeAllButtons on _oChartSegmentedButton called");
	});

	QUnit.test("_adjustIconsDisplay doesn't remove segmented buttons when chart container is not yet rendered", function(assert) {
		this.oChartContainer._bControlNotRendered = true;

		var spyRemoveAllButtons = sinon.stub(this.oChartContainer._oChartSegmentedButton, "removeAllButtons");

		this.oChartContainer._adjustIconsDisplay();

		assert.ok(spyRemoveAllButtons.notCalled, "removeAllButtons on _oChartSegmentedButton not called");
	});

	QUnit.test("_adjustIconsDisplay adds all _aCustomIcons to content toolbar", function(assert) {
		var spyAddButton = sinon.spy();
		var oChartSegmentedButton = {
			addButton: spyAddButton
		};
		this.oChartContainer._oChartSegmentedButton = oChartSegmentedButton;
		var sIcon1 = "testIcon1";
		var sIcon2 = "testIcon2";
		this.oChartContainer._aUsedContentIcons = [sIcon1, sIcon2];
		this.oChartContainer._bControlNotRendered = true;

		var stubAddContentToolbar = sinon.stub(this.oChartContainer, "_addContentToolbar");

		this.oChartContainer._adjustIconsDisplay();

		assert.ok(spyAddButton.called, "_addContentToolbar called");
		assert.ok(spyAddButton.calledTwice, "_addContentToolbar called twice");
		assert.ok(stubAddContentToolbar.called, "_addContentToolbar called");
		assert.ok(stubAddContentToolbar.calledWith(sinon.match(oChartSegmentedButton)), "_addContentToolbar called with the chart segmented button");

		this.oChartContainer._aUsedContentIcons = [];
		this.oChartContainer._oChartSegmentedButton = null;
	});

	QUnit.test("_adjustSelectorDisplay updates chart and content if there are no dimension selectors", function(assert) {
		this.oChartContainer._aDimensionSelectors = [];

		var spySetVisible = sinon.stub(this.oChartContainer._oChartTitle, "setVisible");
		var stubAddContentToolbar = sinon.stub(this.oChartContainer, "_addContentToolbar");

		this.oChartContainer._adjustSelectorDisplay();

		assert.ok(spySetVisible.called, "setVisible on _oChartTitle called");
		assert.ok(spySetVisible.calledWith(true), "setVisible on _oChartTitle called with true");
		assert.ok(stubAddContentToolbar.called, "_addContentToolbar called");
		assert.ok(stubAddContentToolbar.calledWith(this.oChartContainer._oChartTitle), "_addContentToolbar called with _oChartTitle");
	});

	QUnit.test("_adjustSelectorDisplay updates chart and content if there are dimension selectors", function(assert) {
		var spySetAutoAdjustWidth = sinon.spy();
		var oDimensionSelector = {
			setAutoAdjustWidth: spySetAutoAdjustWidth
		};
		this.oChartContainer._aDimensionSelectors = [oDimensionSelector, oDimensionSelector];

		var spySetVisible = sinon.stub(this.oChartContainer._oChartTitle, "setVisible");
		var stubAddContentToolbar = sinon.stub(this.oChartContainer, "_addContentToolbar");

		this.oChartContainer._adjustSelectorDisplay();

		assert.ok(spySetVisible.notCalled, "setVisible on _oChartTitle called");
		assert.ok(spySetAutoAdjustWidth.called, "setAutoAdjustWidth on the dimension selector called");
		assert.ok(spySetAutoAdjustWidth.calledTwice, "setAutoAdjustWidth on the dimension selector called twice");
		assert.ok(spySetAutoAdjustWidth.calledWith(true), "setAutoAdjustWidth on the dimension selector called with true");
		assert.ok(stubAddContentToolbar.called, "_addContentToolbar called");
		assert.ok(stubAddContentToolbar.calledWith(oDimensionSelector), "_addContentToolbar called with the first dimension selector");
		assert.ok(stubAddContentToolbar.calledWith(oDimensionSelector), "_addContentToolbar called with the second dimension selector");

		this.oChartContainer._aDimensionSelectors = [];
	});

	QUnit.test("_adjustDisplay adjusts display properly", function(assert) {
		var bHeightSet = false;
		this.oChartContainer._bHasApplicationToolbar = true;
		this.oChartContainer._iPlaceholderPosition = "test";

		var spyRemoveAllContent = sinon.spy();
		var oToolbar = {
			removeAllContent: spyRemoveAllContent,
			removeContent: function () {
				return {
					destroy: function () {}
				};
			},
			setProperty : function (sName) {
				if (sName === "height") {
					bHeightSet = true;
				}
			}
		};

		var stubGetToolbar = sinon.stub(this.oChartContainer, "getToolbar").returns(oToolbar);

		sinon.stub(this.oChartContainer, "_rearrangeToolbar");

		var stubAdjustSelectorDisplay = sinon.stub(this.oChartContainer, "_adjustSelectorDisplay");
		var stubAddContentToolbar = sinon.stub(this.oChartContainer, "_addContentToolbar");
		var stubAdjustIconsDisplay = sinon.stub(this.oChartContainer, "_adjustIconsDisplay");

		this.oChartContainer._adjustDisplay();

		assert.ok(stubGetToolbar.called, "getToolbar called");
		assert.deepEqual(this.oChartContainer._oToolBar, oToolbar, "_oToolBar initiated successfully");
		assert.ok(spyRemoveAllContent.called, "removeAllContent on _oToolBar called");
		assert.equal(this.oChartContainer._iPlaceholderPosition, 0, "_iPlaceholderPosition set as 0");
		assert.ok(stubAdjustSelectorDisplay.called, "_adjustSelectorDisplay called");
		assert.ok(stubAddContentToolbar.called, "_addContentToolbar called");
		assert.ok(stubAdjustIconsDisplay.called, "_adjustIconsDisplay called");
		assert.ok(bHeightSet, "Toolbar height set properly to 3 rem in any case");

		this.oChartContainer._oToolBar = null;
	});

	QUnit.test("_addButtonToCustomIcons adds an overflowToolbar button to the custom icons", function(assert) {
		this.oChartContainer._aCustomIcons = [];

		var sTooltip = "iconTooltip";
		var sSrc = "testSource";

		var stubGetTooltip = sinon.stub().returns(sTooltip);
		var stubGetSrc = sinon.stub().returns(sSrc);
		var stubGetVisible = sinon.stub().returns(false);
		var oIcon = {
			getTooltip: stubGetTooltip,
			getSrc: stubGetSrc,
			getVisible: stubGetVisible
		};

		this.oChartContainer._addButtonToCustomIcons(oIcon);

		assert.ok(stubGetTooltip.called, "getTooltip called");
		assert.ok(stubGetSrc.called, "getSrc called");
		assert.ok(stubGetVisible.called, "getVisible called");
		var oBtn = this.oChartContainer._aCustomIcons[0];
		assert.ok(oBtn, "icon has been added");
		assert.equal(oBtn.getIcon(), sSrc, "icon added properly");
		assert.equal(oBtn.getText(), sTooltip, "text set as tooltip");
		assert.notOk(oBtn.getVisible(), "button set as invisible");
		assert.equal(oBtn.getTooltip(), sTooltip, "tooltip set as the past tooltip");
		assert.equal(oBtn.getType(), ButtonType.Transparent, "button type set as sap.m.ButtonType.Transparent");
	});

	QUnit.test("_zoom zooms in when needed", function(assert) {
		var bZoomIn = true;
		var oContent = new VizFrame();
		var stubGetContent = sinon.stub().returns(oContent);
		var oSelectedContent = {
			getContent: stubGetContent
		};

		var stubGetSelectedContent = sinon.stub(this.oChartContainer, "getSelectedContent").returns(oSelectedContent);
		var stubZoom = sinon.stub(oContent, "zoom");
		var stubFireCustomZoomInPress = sinon.stub(this.oChartContainer, "fireCustomZoomInPress");
		var stubFireCustomZoomOutPress = sinon.stub(this.oChartContainer, "fireCustomZoomOutPress");

		this.oChartContainer._zoom(bZoomIn);

		assert.ok(stubGetSelectedContent.called, "getSelectedContent called");
		assert.ok(stubGetContent.called, "getContent called");
		assert.ok(stubZoom.called, "zoomIn on the chart called");
		assert.ok(stubZoom.calledWith(sinon.match({"direction": "in"})), "zoomIn on the chart called with direction in");
		assert.ok(stubFireCustomZoomInPress.called, "fireCustomZoomInPress on the chart called");
		assert.ok(stubFireCustomZoomOutPress.notCalled, "fireCustomZoomOutPress on the chart not called");
	});

	QUnit.test("_zoom zooms out when needed", function(assert) {
		var bZoomIn = false;
		var oContent = new VizFrame();
		var stubGetContent = sinon.stub().returns(oContent);
		var oSelectedContent = {
			getContent: stubGetContent
		};

		var stubGetSelectedContent = sinon.stub(this.oChartContainer, "getSelectedContent").returns(oSelectedContent);
		var stubZoom = sinon.stub(oContent, "zoom");
		var stubFireCustomZoomInPress = sinon.stub(this.oChartContainer, "fireCustomZoomInPress");
		var stubFireCustomZoomOutPress = sinon.stub(this.oChartContainer, "fireCustomZoomOutPress");

		this.oChartContainer._zoom(bZoomIn);

		assert.ok(stubGetSelectedContent.called, "getSelectedContent called");
		assert.ok(stubGetContent.called, "getContent called");
		assert.ok(stubZoom.called, "zoomIn on the chart called");
		assert.ok(stubZoom.calledWith(sinon.match({"direction": "out"})), "zoomIn on the chart called with direction out");
		assert.ok(stubFireCustomZoomInPress.notCalled, "fireCustomZoomInPress on the chart not called");
		assert.ok(stubFireCustomZoomOutPress.called, "fireCustomZoomOutPress on the chart called");
	});

	QUnit.test("_destroyButtons destroys all passed buttons", function(assert) {
		var spyDestroy = sinon.spy();
		var oButton = {
			destroy: spyDestroy
		};
		var aButtons = [oButton, oButton];

		this.oChartContainer._destroyButtons(aButtons);

		assert.ok(spyDestroy.called, "destroy called");
		assert.ok(spyDestroy.calledTwice, "destroy called twice");
	});


	QUnit.test("_setShowLegendForAllCharts shows legend for all charts", function(assert) {
		var bShowLegend = true;
		var spySetLegendVisible = sinon.spy();
		var oInnerChart = {
			setLegendVisible: spySetLegendVisible
		};
		var spyGetInnerContent = sinon.stub().returns(oInnerChart);
		var oContent = {
			getContent: spyGetInnerContent
		};
		var aContents = [oContent, oContent];

		var stubGetContent = sinon.stub(this.oChartContainer, "getContent").returns(aContents);

		this.oChartContainer._setShowLegendForAllCharts(bShowLegend);

		assert.ok(stubGetContent.called, "getContent called");
		assert.ok(spyGetInnerContent.called, "getContent on innner content called");
		assert.ok(spyGetInnerContent.calledTwice, "getContent on innner content called twice");
		assert.ok(spySetLegendVisible.called, "setLegendVisible on innner chart called");
		assert.ok(spySetLegendVisible.calledTwice, "setLegendVisible on innner chart called twice");
		assert.ok(spySetLegendVisible.calledWith(bShowLegend), "setLegendVisible on innner chart called with the passed show legend flag");
	});

});
