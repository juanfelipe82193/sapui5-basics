sap.ui.define([
	"sap/suite/ui/commons/ChartContainerContent",
	"sap/suite/ui/commons/ChartContainer",
	"sap/viz/ui5/controls/VizFrame",
	"sap/ui/Device"
], function(ChartContainerContent, ChartContainer, VizFrame, Device) {
	"use strict";

	QUnit.module("Event handling", {
		beforeEach : function() {
			this.oVizFrameContent = new ChartContainerContent("chartContainerContent",{
				content : new VizFrame("vizFrameEvents")
			});
			this.oChartContainer = new ChartContainer("chartContainerEvents", {
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

	QUnit.test("_onButtonIconPress switches chart", function(assert) {
		var sChartId = "testChartId";
		var oCustomData = {
			getValue: function() {
				return sChartId;
			}
		};
		var oSource = {
			getCustomData: function() {
				return [oCustomData];
			}
		};
		var oEvent = {
			getSource: function() {
				return oSource;
			}
		};

		var stubSwitchChart = sinon.stub(this.oChartContainer, "_switchChart");

		this.oChartContainer._onButtonIconPress(oEvent);

		assert.ok(stubSwitchChart.called, "_switchChart called");
		assert.ok(stubSwitchChart.calledWith(sChartId), "_switchChart called with the found chart id");
	});

	QUnit.test("_onFullScreenButtonPress pressed state", function(assert) {
		// Arrange
		this.oChartContainer._bSegmentedButtonSaveSelectState = false;
		var sTooltipText = this.oChartContainer._oResBundle.getText("CHARTCONTAINER_FULLSCREEN_CLOSE");
		var oSetIconStub = sinon.stub(this.oChartContainer._oFullScreenButton, "setIcon");
		var oToggleFullScreenStub = sinon.stub(this.oChartContainer, "_toggleFullScreen");
		var oSetTooltipOnFullscreenButton = sinon.stub(this.oChartContainer._oFullScreenButton, "setTooltip");
		var oFocusOnFullscreenButton = sinon.stub(this.oChartContainer._oFullScreenButton, "focus");

		// Act
		this.oChartContainer._onFullScreenButtonPress({
			getParameter : function () {
				return true;
			}
		});

		// Assert
		assert.equal(this.oChartContainer._bSegmentedButtonSaveSelectState, true, "_bSegmentedButtonSaveSelectState is true");
		assert.ok(oSetIconStub.calledWith("sap-icon://exit-full-screen"), "setIcon called with the correct icon");
		assert.ok(oToggleFullScreenStub.called, "_toggleFullScreen called");
		assert.ok(oSetTooltipOnFullscreenButton.calledWith(sTooltipText), "tooltip was set to 'Close Full Screen'");
		assert.ok(oFocusOnFullscreenButton.called, "Focus is set on fullscreen button after full screen opened");
	});

	QUnit.test("_onFullScreenButtonPress unpressed state", function(assert) {
		// Arrange
		this.oChartContainer._bSegmentedButtonSaveSelectState = false;
		var sTooltipText = this.oChartContainer._oResBundle.getText("CHARTCONTAINER_FULLSCREEN");
		var oSetIconStub = sinon.stub(this.oChartContainer._oFullScreenButton, "setIcon");
		var oToggleFullScreenStub = sinon.stub(this.oChartContainer, "_toggleFullScreen");
		var oSetTooltipOnFullscreenButton = sinon.stub(this.oChartContainer._oFullScreenButton, "setTooltip");
		var oFocusOnFullscreenButton = sinon.stub(this.oChartContainer._oFullScreenButton, "focus");

		// Act
		this.oChartContainer._onFullScreenButtonPress({
			getParameter : function () {
				return false;
			}
		});

		// Assert
		assert.equal(this.oChartContainer._bSegmentedButtonSaveSelectState, true, "_bSegmentedButtonSaveSelectState is true");
		assert.ok(oSetIconStub.calledWith("sap-icon://full-screen"), "setIcon called with the correct icon");
		assert.ok(oToggleFullScreenStub.called, "_toggleFullScreen called");
		assert.ok(oSetTooltipOnFullscreenButton.calledWith(sTooltipText), "tooltip was set to 'Open Full Screen'");
		assert.ok(oFocusOnFullscreenButton.called, "Focus is set on fullscreen button after full screen closed");
	});

	QUnit.test("_onShowLegendButtonPress calls legend button press method", function(assert) {
		this.oChartContainer._bSegmentedButtonSaveSelectState = false;

		var stubOnLegendButtonPress = sinon.stub(this.oChartContainer, "_onLegendButtonPress");

		this.oChartContainer._onShowLegendButtonPress();

		assert.equal(this.oChartContainer._bSegmentedButtonSaveSelectState, true, "_bSegmentedButtonSaveSelectState is true");
		assert.ok(stubOnLegendButtonPress.called, "_onLegendButtonPress called");
	});

	QUnit.test("_onChartSegmentButtonSelect switches the chart", function(assert) {
		var sChartId = "testChartId";
		var oCustomData = {
			getValue: function() {
				return sChartId;
			}
		};
		var oParameter = {
			getCustomData: function() {
				return [oCustomData];
			}
		};
		var oEvent = {
			getParameter: function() {
				return oParameter;
			}
		};

		this.oChartContainer._bSegmentedButtonSaveSelectState = false;

		var spyGetParameter = sinon.spy(oEvent, "getParameter");
		var stubSwitchChart = sinon.stub(this.oChartContainer, "_switchChart");

		this.oChartContainer._onChartSegmentButtonSelect(oEvent);

		assert.equal(this.oChartContainer._bSegmentedButtonSaveSelectState, true, "_bSegmentedButtonSaveSelectState is true");
		assert.ok(spyGetParameter.called, "getParameter called");
		assert.ok(spyGetParameter.calledWith("button"), "getParameter called 'button'");
		assert.ok(stubSwitchChart.called, "_switchChart called");
		assert.ok(stubSwitchChart.calledWith(sChartId), "_switchChart called with the found chart id");
	});

	QUnit.test("_onOverflowToolbarButtonPress fires button press with the correct props", function(assert) {
		var sSource = "testSource";
		var spyGetSource = sinon.stub().returns(sSource);
		var oEvent = {
			getSource: spyGetSource
		};
		var spyFirePress = sinon.spy();
		var oData = {
			icon: {
				firePress: spyFirePress
			}
		};

		sinon.stub(this.oChartContainer, "_onLegendButtonPress");

		this.oChartContainer._onOverflowToolbarButtonPress(oEvent, oData);

		assert.ok(spyGetSource.called, "getSource called");
		assert.ok(spyFirePress.called, "firePress called");
		assert.ok(spyFirePress.calledWith(sinon.match({
			controlReference : sSource
		})), "firePress called with the correct props");
	});

	QUnit.test("_onLegendButtonPress setShowLegend properly if getLegendVisible is a method", function(assert) {
		var bLegendVisible = true;
		var spySetLegendVisible = sinon.spy();
		var oSelectedChart = {
			getLegendVisible : function() {
				return bLegendVisible;
			},
			setLegendVisible: spySetLegendVisible
		};
		var oSelectedContent = {
			getContent : function() {
				return oSelectedChart;
			}
		};

		var stubGetSelectedContent = sinon.stub(this.oChartContainer, "getSelectedContent").returns(oSelectedContent);
		var stubSetShowLegend = sinon.stub(this.oChartContainer, "setShowLegend");

		this.oChartContainer._onLegendButtonPress();

		assert.ok(stubGetSelectedContent.called, "getSelectedContent called");
		assert.ok(spySetLegendVisible.called, "setLegendVisible called");
		assert.ok(spySetLegendVisible.calledWith(!bLegendVisible), "setLegendVisible called with the opposite value of current legendVisible property");
		assert.ok(stubSetShowLegend.called, "setShowLegend called");
		assert.ok(stubSetShowLegend.calledWith(!bLegendVisible), "setLegendVisible called with the opposite value of current legendVisible property");
	});

	QUnit.test("_onLegendButtonPress setShowLegend properly if getLegendVisible is not a method", function(assert) {
		// Somehow this test is not working in firefox because of a VizFrame error.
		if (Device.browser.firefox === true) {
			assert.expect(0);
			return;
		}
		var bLegendVisible = true;
		var oSelectedChart = {
			getLegendVisible : false
		};
		var oSelectedContent = {
			getContent : function() {
				return oSelectedChart;
			}
		};

		var stubGetSelectedContent = sinon.stub(this.oChartContainer, "getSelectedContent").returns(oSelectedContent);
		var spyGetContent = sinon.spy(oSelectedContent, "getContent");
		var stubGetShowLegend = sinon.stub(this.oChartContainer, "getShowLegend").returns(bLegendVisible);
		var stubSetShowLegend = sinon.stub(this.oChartContainer, "setShowLegend");

		this.oChartContainer._onLegendButtonPress();

		assert.ok(stubGetSelectedContent.called, "getSelectedContent called");
		assert.ok(spyGetContent.called, "getShowLegend called");
		assert.ok(stubGetShowLegend.called, "getShowLegend called");
		assert.ok(stubSetShowLegend.called, "setShowLegend called");
		assert.ok(stubSetShowLegend.calledWith(!bLegendVisible), "setLegendVisible called with the opposite value of current getShowLegend return value");
	});

	QUnit.test("_onLegendButtonPress setShowLegend properly if there's no content", function(assert) {
		var bLegendVisible = true;

		var stubGetSelectedContent = sinon.stub(this.oChartContainer, "getSelectedContent");
		var stubGetShowLegend = sinon.stub(this.oChartContainer, "getShowLegend").returns(bLegendVisible);
		var stubSetShowLegend = sinon.stub(this.oChartContainer, "setShowLegend");

		this.oChartContainer._onLegendButtonPress();

		assert.ok(stubGetSelectedContent.called, "getSelectedContent called");
		assert.ok(stubGetShowLegend.called, "getShowLegend called");
		assert.ok(stubSetShowLegend.called, "setShowLegend called");
		assert.ok(stubSetShowLegend.calledWith(!bLegendVisible), "setLegendVisible called with the opposite value of current getShowLegend return value");
	});

	QUnit.module("Private API", {
		beforeEach : function() {
			this.oChartContainer = new ChartContainer();
			this.oChartContainer.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oChartContainer.destroy();
			this.oChartContainer = null;
		}
	});

	QUnit.test("ChartContainer._onLegendButtonPress", function(assert) {
		var oButton = this.oChartContainer._oShowLegendButton;
		oButton.attachPress(function(oEvent) {
			assert.ok(true, "Event was fired");
		});
		this.oChartContainer._onLegendButtonPress();
		assert.strictEqual(this.oChartContainer.getShowLegend(), false, "showLegend is set to false");
	});

	QUnit.test("ChartContainer._oPersonalizationPress", function(assert) {
		var oButton = this.oChartContainer._oPersonalizationButton;
		oButton.attachPress(function(oEvent) {
			assert.ok(true, "Event was fired");
		});
		oButton.firePress();
	});

});
