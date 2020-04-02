sap.ui.define([
	"sap/suite/ui/commons/ChartContainerContent",
	"sap/suite/ui/commons/ChartContainer",
	"sap/viz/ui5/controls/VizFrame"
], function(ChartContainerContent, ChartContainer, VizFrame) {
	"use strict";

	QUnit.module("Getter/Setter private methods", {
		beforeEach : function() {
			var oVizFrame = new VizFrame("vizFrameGetterSetterMethods");
			this.oVizFrameContent = new ChartContainerContent("chartContainerContent",{
				content : oVizFrame
			});
			this.oChartContainer = new ChartContainer("chartContainerGetterSetterMethods", {
				content : this.oVizFrameContent
			});
			this.oChartContainer.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oChartContainer.destroy();
			this.oChartContainer = null;
		}
	});

	QUnit.test("_setSelectedContent returns when content matches the already selected one", function(assert) {
		var spyGetContent = sinon.spy();
		var oSelectedContent = {
			getContent: spyGetContent
		};

		var stubGetSelectedContent = sinon.stub(this.oChartContainer, "getSelectedContent").returns(oSelectedContent);
		var spyToggleShowLegendButtons = sinon.spy(this.oChartContainer, "_toggleShowLegendButtons");

		var oChartContainer = this.oChartContainer._setSelectedContent(oSelectedContent);

		assert.ok(stubGetSelectedContent.called, "getSelectedContent called");
		assert.deepEqual(oChartContainer, this.oChartContainer, "getShowLegend called");
		assert.ok(spyGetContent.notCalled, "getContent on the selected content not called");
		assert.ok(spyToggleShowLegendButtons.notCalled, "_toggleShowLegendButtons not called");
	});

	QUnit.test("_setSelectedContent returns when content is null", function(assert) {
		var stubGetSelectedContent = sinon.stub(this.oChartContainer, "getSelectedContent");
		var spyToggleShowLegendButtons = sinon.spy(this.oChartContainer, "_toggleShowLegendButtons");

		var oChartContainer = this.oChartContainer._setSelectedContent(null);

		assert.ok(stubGetSelectedContent.called, "getSelectedContent called");
		assert.deepEqual(oChartContainer, this.oChartContainer, "getShowLegend called");
		assert.ok(spyToggleShowLegendButtons.notCalled, "_toggleShowLegendButtons not called");
	});

	QUnit.test("_setSelectedContent updates chart container when the passed value is valid", function(assert) {
		var sChart = "testChart";
		var stubGetContent = sinon.stub().returns(sChart);
		var oSelectedContent = {
			getContent: stubGetContent
		};

		var stubGetSelectedContent = sinon.stub(this.oChartContainer, "getSelectedContent");
		var stubToggleShowLegendButtons = sinon.stub(this.oChartContainer, "_toggleShowLegendButtons");
		var stubGetShowLegendButton = sinon.stub(this.oChartContainer, "getShowLegendButton").returns(false);
		var stubGetShowZoom = sinon.stub(this.oChartContainer,"getShowZoom").returns(false);
		var stubLegendButtonSetVisible = sinon.stub(this.oChartContainer._oShowLegendButton, "setVisible");
		var stubZoomInButtonSetVisible = sinon.stub(this.oChartContainer._oZoomInButton, "setVisible");
		var stubZoomOutButtonSetVisible = sinon.stub(this.oChartContainer._oZoomOutButton, "setVisible");

		var oChartContainer = this.oChartContainer._setSelectedContent(oSelectedContent);

		assert.ok(stubGetSelectedContent.called, "getSelectedContent called");
		assert.deepEqual(oChartContainer, this.oChartContainer, "getShowLegend called");
		assert.ok(stubGetContent.called, "getContent on the selected content called");
		assert.ok(stubToggleShowLegendButtons.called, "_toggleShowLegendButtons called");
		assert.ok(stubToggleShowLegendButtons.calledWith(sChart), "_toggleShowLegendButtons called with the found chart");
		assert.ok(stubGetShowLegendButton.called, "getShowLegendButton called");
		assert.ok(stubLegendButtonSetVisible.notCalled, "setVisible on _oShowLegendButton not called when getShowLegendButton is false");
		assert.ok(stubGetShowZoom.called, "getShowZoom called");
		assert.ok(stubZoomInButtonSetVisible.called, "setVisible on _oZoomInButton called");
		assert.ok(stubZoomInButtonSetVisible.calledWith(false), "setVisible on _oZoomInButton called with false when getShowZoom returns false");
		assert.ok(stubZoomInButtonSetVisible.called, "setVisible on _oZoomInButton called");
		assert.ok(stubZoomInButtonSetVisible.calledWith(false), "setVisible on _oZoomInButton called with false when getShowZoom returns false");
		assert.ok(stubZoomOutButtonSetVisible.called, "setVisible on _oZoomOutButton called");
		assert.ok(stubZoomOutButtonSetVisible.calledWith(false), "setVisible on _oZoomOutButton called with false when getShowZoom returns false");
		assert.deepEqual(this.oChartContainer._oSelectedContent, oSelectedContent, "_oSelectedContent matches the passed one");
		assert.deepEqual(this.oChartContainer, oChartContainer, "reference to this returned");

		this.oChartContainer._oSelectedContent = null;
	});

	QUnit.test("_toggleShowLegendButtons set the selected button when chart is visible", function(assert) {
		var sChartId = "testChartId";
		var bChartVisible = true;
		var stubGetId = sinon.stub().returns(sChartId);
		var stubGetVisible = sinon.stub().returns(bChartVisible);
		var oChart = {
			getId: stubGetId,
			getVisible: stubGetVisible
		};

		var oCustomData = {
			getValue: function() {
				return sChartId;
			}
		};
		var oContentIcon = {
			getCustomData: function() {
				return [oCustomData];
			}
		};
		this.oChartContainer._aUsedContentIcons = [oContentIcon, oContentIcon];
		sinon.stub(this.oChartContainer, "getSelectedContent");
		sinon.spy(this.oChartContainer, "_toggleShowLegendButtons");

		var stubSetSelectedButton = sinon.stub(this.oChartContainer._oChartSegmentedButton, "setSelectedButton");

		this.oChartContainer._toggleShowLegendButtons(oChart);

		assert.ok(oChart.getId, "getId on chart called");
		assert.ok(oChart.getVisible, "getVisible on chart called");
		assert.ok(stubSetSelectedButton.called, "setSelectedButton on _oChartSegmentedButton called");
		assert.ok(stubSetSelectedButton.calledOnce, "setSelectedButton on _oChartSegmentedButton calledonly once");
		assert.ok(stubSetSelectedButton.calledWith(sinon.match(oContentIcon)), "setSelectedButton on _oChartSegmentedButton called with the icon");

		this.oChartContainer._aUsedContentIcons = null;
	});

	QUnit.test("_toggleShowLegendButtons doesn't set any buttons when chart is not visible", function(assert) {
		var sChartId = "testChartId";
		var bChartVisible = false;
		var stubGetId = sinon.stub().returns(sChartId);
		var stubGetVisible = sinon.stub().returns(bChartVisible);
		var oChart = {
			getId: stubGetId,
			getVisible: stubGetVisible
		};
		var oCustomData = {
			getValue: function() {
				return sChartId;
			}
		};
		var oContentIcon = {
			getCustomData: function() {
				return [oCustomData];
			}
		};
		this.oChartContainer._aUsedContentIcons = [oContentIcon, oContentIcon];

		sinon.stub(this.oChartContainer, "getSelectedContent");
		sinon.spy(this.oChartContainer, "_toggleShowLegendButtons");

		var stubSetSelectedButton = sinon.stub(this.oChartContainer._oChartSegmentedButton, "setSelectedButton");

		this.oChartContainer._toggleShowLegendButtons(oChart);

		assert.ok(stubGetId.called, "getId on chart called");
		assert.ok(stubGetVisible.called, "getVisible on chart called");
		assert.ok(stubSetSelectedButton.notCalled, "setSelectedButton on _oChartSegmentedButton not called");

		this.oChartContainer._aUsedContentIcons = null;
	});

	QUnit.test("_setDefaultOnSegmentedButton sets selected button if none is set", function(assert) {
		this.oChartContainer._bSegmentedButtonSaveSelectState = false;

		var stubSetSelectedButton = sinon.stub(this.oChartContainer._oChartSegmentedButton, "setSelectedButton");

		this.oChartContainer._setDefaultOnSegmentedButton();

		assert.ok(stubSetSelectedButton.called, "setSelectedContent called");
		assert.ok(stubSetSelectedButton.calledWith(null), "setSelectedContent called with null");
		assert.equal(this.oChartContainer._bSegmentedButtonSaveSelectState, false, "_bSegmentedButtonSaveSelectState property set to false");
	});

	QUnit.test("_setDefaultOnSegmentedButton doesn't selected button if it's already set", function(assert) {
		this.oChartContainer._bSegmentedButtonSaveSelectState = true;

		var stubSetSelectedButton = sinon.stub(this.oChartContainer._oChartSegmentedButton, "setSelectedButton");

		this.oChartContainer._setDefaultOnSegmentedButton();

		assert.ok(stubSetSelectedButton.notCalled, "setSelectedContent called");
		assert.equal(this.oChartContainer._bSegmentedButtonSaveSelectState, false, "_bSegmentedButtonSaveSelectState property set to false");
	});

});
