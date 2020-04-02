/*global QUnit, sinon */
sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/microchart/InteractiveLineChart",
	"sap/suite/ui/microchart/InteractiveLineChartPoint",
	"sap/m/ValueColor",
	"sap/m/FlexBox",
	"sap/ui/Device",
	"sap/m/Label",
	"sap/suite/ui/microchart/library",
	"sap/base/Log",
	"sap/ui/core/IntervalTrigger"
], function (jQuery, InteractiveLineChart, InteractiveLineChartPoint, ValueColor, FlexBox, Device, Label, microchartLibrary, Log, IntervalTrigger) {
	"use strict";

	jQuery.sap.initMobile();


	QUnit.module("Control initialization core and theme checks", {
		beforeEach: function() {
			this.oStubIsInitialized = sinon.stub(sap.ui.getCore(), "isInitialized");
			this.oSpyAttachInit = sinon.spy(sap.ui.getCore(), "attachInit");
			this.oSpyHandleCoreInitialized = sinon.spy(InteractiveLineChart.prototype, "_handleCoreInitialized");
			this.oStubThemeApplied = sinon.stub(sap.ui.getCore(), "isThemeApplied");
			this.oStubAttachThemeApplied = sinon.stub(sap.ui.getCore(), "attachThemeChanged").callsFake(function(fn, context) {
				fn.call(context); //simulate immediate theme change
			});
			this.oSpyHandleThemeApplied = sinon.spy(InteractiveLineChart.prototype, "_handleThemeApplied");
		},
		afterEach: function() {
			this.oStubIsInitialized.restore();
			this.oSpyAttachInit.restore();
			this.oSpyHandleCoreInitialized.restore();
			this.oStubThemeApplied.restore();
			this.oStubAttachThemeApplied.restore();
			this.oSpyHandleThemeApplied.restore();
		}
	});

	QUnit.test("Core initialization check - no core, no theme", function(assert) {
		//Arrange
		this.oStubIsInitialized.returns(false);
		this.oStubThemeApplied.returns(false);

		//Act
		var oChart = new InteractiveLineChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.oSpyAttachInit.calledOnce, "Method Core.attachInit has been called once.");
		assert.ok(this.oSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.oStubAttachThemeApplied.calledOnce, "Method Core.attachThemeChanged has been called once.");
		assert.ok(this.oSpyHandleThemeApplied.calledOnce, "Method _handleThemeApplied has been called once.");
	});

	QUnit.test("Core initialization check - no core, but theme", function(assert) {
		//Arrange
		this.oStubIsInitialized.returns(false);
		this.oStubThemeApplied.returns(true);

		//Act
		var oChart = new InteractiveLineChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.oSpyAttachInit.calledOnce, "Method Core.attachInit has been called once.");
		assert.ok(this.oSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.oStubAttachThemeApplied.calledOnce, "Method Core.attachThemeChanged has been called once.");
		assert.ok(this.oSpyHandleThemeApplied.calledOnce, "Method _handleThemeApplied has been called once.");
	});

	QUnit.test("Core initialization check - core, but no theme", function(assert) {
		//Arrange
		this.oStubIsInitialized.returns(true);
		this.oStubThemeApplied.returns(false);

		//Act
		var oChart = new InteractiveLineChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.oSpyAttachInit.notCalled, "Method Core.attachInit has not been called.");
		assert.ok(this.oSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.oStubAttachThemeApplied.calledOnce, "Method Core.attachThemeChanged has been called once.");
		assert.ok(this.oSpyHandleThemeApplied.calledOnce, "Method _handleThemeApplied has been called once.");
	});

	QUnit.test("Core initialization check - core and theme", function(assert) {
		//Arrange
		this.oStubIsInitialized.returns(true);
		this.oStubThemeApplied.returns(true);

		//Act
		var oChart = new InteractiveLineChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.oSpyAttachInit.notCalled, "Method Core.attachInit has not been called.");
		assert.ok(this.oSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.oStubAttachThemeApplied.calledOnce, "Method Core.attachThemeChanged has been called once.");
		assert.ok(this.oSpyHandleThemeApplied.calledOnce, "Method _handleThemeApplied has been called once.");
	});

	QUnit.module("InteractiveLineChart is defined", {
		beforeEach: function() {
			this.oChart = new InteractiveLineChart({
				points: [
					new InteractiveLineChartPoint({label: "May", selected: true, value: 33.1}),
					new InteractiveLineChartPoint({label: "June", value: 31.7})
				]
			});
		},
		afterEach: function() {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("InteractiveLineChart can be instantiated", function(assert) {
		assert.ok(this.oChart, "The InteractiveLineChart control is found in the library and instantiated.");
		assert.equal(this.oChart.getDisplayedPoints(), 6, "PointCount property default value is properly defined.");
		assert.equal(this.oChart.getSelectionEnabled(), true, "EnableSelection property default value is properly defined.");
	});

	QUnit.test("InteractiveLineChart aggregation test", function(assert) {
		assert.ok(this.oChart.getPoints(), "InteractiveLineChartPoint is defined in the points aggregation.");
		assert.equal(this.oChart.getPoints().length, 2, "Points aggregation is multiple supported.");
	});

	QUnit.test("InteractiveLineChart getSelectedPoints method test", function(assert) {
		//Arrange
		this.oChart.addPoint(new InteractiveLineChartPoint({label: "July", selected: true, value: 33.1}));
		this.oChart.addPoint(new InteractiveLineChartPoint({label: "Aug", selected: true, value: 55.2}));
		//Act
		var oPoints = this.oChart.getSelectedPoints();
		//Assert
		assert.equal(oPoints.length, 3, "Method getSelectedPoint works properly.");
	});

	QUnit.test("InteractiveLineChart setSelectedPoints method test", function(assert) {
		//Arrange
		var aPoints = [];
		this.oChart.addPoint(new InteractiveLineChartPoint({label: "July", selected: false, value: 33.1}));
		this.oChart.addPoint(new InteractiveLineChartPoint({label: "Aug", selected: false, value: 55.2}));
		aPoints.push(this.oChart.getPoints()[2]);
		aPoints.push(this.oChart.getPoints()[3]);
		//Act
		this.oChart.setSelectedPoints(aPoints);
		//Assert
		assert.equal(this.oChart.getPoints()[0].getSelected(), false, "The first point was selected, but it is set as not selected now.");
		assert.equal(this.oChart.getPoints()[2].getSelected(), true, "The third point was not selected, but it is set as selected now.");
		assert.equal(this.oChart.getPoints()[3].getSelected(), true, "The forth point was not selected, but it is set as selected now.");
	});

	QUnit.test("InteractiveLineChart setSelectedPoints method for ChartPoint instance test", function(assert) {
		//Arrange
		var oPoint;
		this.oChart.addPoint(new InteractiveLineChartPoint({label: "July", selected: false, value: 33.1}));
		this.oChart.addPoint(new InteractiveLineChartPoint({label: "Aug", selected: false, value: 55.2}));
		oPoint = this.oChart.getPoints()[2];
		//Act
		this.oChart.setSelectedPoints(oPoint);
		//Assert
		assert.equal(this.oChart.getPoints()[0].getSelected(), false, "The first point was selected, but it is set as not selected now.");
		assert.equal(this.oChart.getPoints()[2].getSelected(), true, "The third point was not selected, but it is set as selected now.");
	});

	QUnit.test("InteractiveLineChart setSelectedPoints method for a ChartPoint which is not from points aggregation", function(assert) {
		//Arrange
		sinon.spy(Log, "warning");
		this.oChart.addPoint(new InteractiveLineChartPoint({label: "July", selected: true, value: 33.1}));
		this.oChart.addPoint(new InteractiveLineChartPoint({label: "Aug", selected: true, value: 55.2}));
		var oPoint = new InteractiveLineChartPoint({label: "Dec", selected: false, value: 88});
		//Act
		this.oChart.setSelectedPoints(oPoint);
		//Assert
		assert.ok(Log.warning.calledWith("setSelectedPoints method called with invalid InteractiveLineChartPoint element"), "Warning message is displayed.");
		assert.equal(this.oChart.getPoints()[0].getSelected(), false, "The first point was selected, it is also selected now.");
		assert.equal(this.oChart.getPoints()[1].getSelected(), false, "The second point was not selected, it is also not selected now.");
		assert.equal(this.oChart.getPoints()[2].getSelected(), false, "The third point was selected, it is also selected now.");
		Log.warning.restore();
	});

	QUnit.test("InteractiveLineChart setSelectedPoints method for an array of ChartPoints which has a valid ChartPoint and an invalid ChartPoint", function(assert) {
		//Arrange
		sinon.spy(Log, "warning");
		var aPoints = [];
		var oPoint = new InteractiveLineChartPoint({label: "Dec", selected: false, value: 88});
		aPoints.push(oPoint);
		aPoints.push(this.oChart.getPoints()[1]);
		//Act
		this.oChart.setSelectedPoints(aPoints);
		//Assert
		assert.ok(Log.warning.calledWith("setSelectedPoints method called with invalid InteractiveLineChartPoint element"), "Warning message is displayed.");
		assert.equal(this.oChart.getPoints()[0].getSelected(), false, "The first point was selected, it is not selected now.");
		assert.equal(this.oChart.getPoints()[1].getSelected(), true, "The second point was not selected, it is selected now.");
		Log.warning.restore();
	});

	QUnit.test("InteractiveLineChart setSelectedPoints method when attribute selectedPoints is null", function(assert) {
		//Arrange
		var aPoints = this.oChart.getPoints();
		//Act
		this.oChart.setSelectedPoints(null);
		//Assert
		assert.equal(aPoints[0].getSelected(), false, "First point is not selected");
		assert.equal(aPoints[1].getSelected(), false, "Second point is not selected");
	});

	QUnit.test("InteractiveLineChart setSelectedPoints method when attribute selectedPoints is undefined", function(assert) {
		//Arrange
		var aPoints = this.oChart.getPoints();
		//Act
		this.oChart.setSelectedPoints();
		//Assert
		assert.equal(aPoints[0].getSelected(), false, "First point is not selected");
		assert.equal(aPoints[1].getSelected(), false, "Second point is not selected");
	});

	QUnit.test("InteractiveLineChart is rendered", function(assert) {
		this.oChart.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
		assert.ok(this.oChart.$().length, "The InteractiveLineChart control is found in the library and instantiated");
		assert.ok(this.oChart.$()[0].id, "The id if InteractiveLineChart control is written in DOM");
		assert.ok(this.oChart.$().find(".sapSuiteILCChartCanvas").length, "The sapSuiteILCChartCanvas is written in DOM");
		assert.ok(this.oChart.$().find(".sapSuiteILCSvgElement").length, "The sapSuiteILCSvgElement is written in DOM");
		assert.ok(this.oChart.$().find(".sapSuiteILCPoint").length, "The sapSuiteILCPoint is written in DOM");
	});

	QUnit.test("Selected points are rendered", function(assert) {
		//Arrange
		this.oChart.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		//Assert
		var $SelectedElement = jQuery(this.oChart.$().find(".sapSuiteILCSection")[0]);
		var $UnselectedElement = jQuery(this.oChart.$().find(".sapSuiteILCSection")[1]);
		var $SelectedPoints = this.oChart.$().find(".sapSuiteILCPoint.sapSuiteILCSelected");
		assert.equal($SelectedElement.hasClass("sapSuiteILCSelected"), true, "The relevant class has been added to the selected element");
		assert.equal($UnselectedElement.hasClass("sapSuiteILCSelected"), false, "No class has been added to the unselected element");
		assert.equal($SelectedPoints.length, 1, "1 selected point has been found.");
	});

	QUnit.test("Disabled overlay is rendered", function(assert) {
		//Arrange
		this.oChart.setSelectionEnabled(false);
		this.oChart.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		//Assert
		assert.equal(this.oChart.$().find(".sapSuiteILCDisabledOverlay").length, 1, "The overlay div exists in dom.");
	});

	QUnit.test("Tests property displayedPoints", function(assert) {
		//Arrange
		this.oChart.addPoint(new InteractiveLineChartPoint({label: "July", selected: false, value: 33.1}));
		this.oChart.addPoint(new InteractiveLineChartPoint({label: "Aug", selected: false, value: 55.2}));
		this.oChart.setDisplayedPoints(3);
		this.oChart.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		//Assert
		assert.equal(this.oChart.getPoints().length, 4, "The number of point element is 4");
		assert.equal(this.oChart.$().find(".sapSuiteILCSection").length, 3, "The number of displayed point is 3");
	});

	QUnit.module("Events - sap.suite.ui.microchart.InteractiveLineChart", {
		beforeEach : function() {
			this.fnSelectionChangedHandler = function() {
			};
			this.oChart = new InteractiveLineChart({
				points: [
					new InteractiveLineChartPoint({label: "May", selected: true, value: 33.1}),
					new InteractiveLineChartPoint({label: "June", value: 31.7}),
					new InteractiveLineChartPoint({label: "July", selected: true, value: 23.1}),
					new InteractiveLineChartPoint({label: "Aug", selected: false, value: 55.2})
				]
			});
			this.oChart.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
			sinon.spy(this, "fnSelectionChangedHandler");
			sinon.spy(this.oChart, "fireSelectionChanged");
			sinon.spy(this.oChart, "firePress");
		},
		afterEach : function () {
			this.fnSelectionChangedHandler.restore();
			this.oChart.fireSelectionChanged.restore();
			this.oChart.firePress.restore();
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Space button is pressed", function(assert) {
		//Arrange
		var oEvent = {
			preventDefault: function(){},
			stopImmediatePropagation: function(){}
		};
		oEvent.target = this.oChart.$().find(".sapSuiteILCInteractionArea")[1];
		//Act
		this.oChart.onsapspace(oEvent);
		//Assert
		assert.ok(this.oChart.getPoints()[1].getSelected(), "The second column changed its selection after space button was clicked");
		assert.ok(this.oChart.fireSelectionChanged.calledOnce, "SelectionChanged event has been thrown");
	});

	QUnit.test("Enter button is pressed (interactive)", function(assert) {
		//Arrange
		var oEvent = {
			preventDefault: function(){},
			stopImmediatePropagation: function(){}
		};
		oEvent.target = this.oChart.$().find(".sapSuiteILCInteractionArea")[2];
		//Act
		this.oChart.onsapenter(oEvent);
		//Assert
		assert.notOk(this.oChart.getPoints()[2].getSelected(), "The third column changed its selection after enter button was clicked");
		assert.ok(this.oChart.fireSelectionChanged.calledOnce, "SelectionChanged event has been thrown");
		assert.equal(this.oChart.firePress.calledOnce, 0, "Press event is not fired in interative mode");
	});

	QUnit.test("Enter button is pressed (non-interactive)", function(assert) {
		//Arrange
		var oEventEnter = {
			preventDefault: function(){},
			stopImmediatePropagation: function(){},
			target: this.oChart.$().find(".sapSuiteILCInteractionArea")[1]
		};
		//Act
		this.oChart._bInteractiveMode = false;
		this.oChart.onsapenter(oEventEnter);
		//Assert
		assert.equal(this.oChart.getPoints()[1].getSelected(), false, "Change selection is ignored in non-interactive mode");
		assert.equal(this.oChart.fireSelectionChanged.calledOnce, 0, "SelectionChanged event is not fired in non-interative mode");
		assert.equal(this.oChart.firePress.calledOnce, 1, "Press event is fired in non-interative mode");
	});

	QUnit.test("Right arrow button is pressed", function(assert) {
		//Arrange
		var oEvent = {
			preventDefault: function(){},
			stopImmediatePropagation: function(){}
		};
		oEvent.target = this.oChart.$().find(".sapSuiteILCInteractionArea")[0];
		//Act
		this.oChart.onsapright(oEvent);
		//Assert
		assert.notOk(this.oChart.$().find(".sapSuiteILCInteractionArea")[0].hasAttribute("tabindex"), "The first column does not have tabindex after right arrow button clicked");
		assert.equal(this.oChart.$().find(".sapSuiteILCInteractionArea").eq(1).attr("tabindex"), 0, "The second column has tabindex after right arrow button clicked");
		assert.ok(this.oChart.$().find(".sapSuiteILCInteractionArea").eq(1).is(":focus"), "The second column is focused");
	});

	QUnit.test("Left arrow button is pressed", function(assert) {
		//Arrange
		var oEventRight = {
				preventDefault: function(){},
				stopImmediatePropagation: function(){}
			},
			oEventLeft = {
				preventDefault: function(){},
				stopImmediatePropagation: function(){}
			};
		oEventRight.target = this.oChart.$().find(".sapSuiteILCInteractionArea")[0];
		oEventLeft.target = this.oChart.$().find(".sapSuiteILCInteractionArea")[1];
		//Act
		this.oChart.onsapright(oEventRight);
		this.oChart.onsapleft(oEventLeft);
		//Assert
		assert.notOk(this.oChart.$().find(".sapSuiteILCInteractionArea")[1].hasAttribute("tabindex"), "The second column does not have tabindex after left arrow button clicked");
		assert.equal(this.oChart.$().find(".sapSuiteILCInteractionArea").eq(0).attr("tabindex"), 0, "The first column has tabindex after left arrow button clicked");
		assert.ok(this.oChart.$().find(".sapSuiteILCInteractionArea").eq(0).is(":focus"), "The first column is focused");
	});

	QUnit.test("Home button is pressed", function(assert) {
		//Arrange
		var oEventClick = {
			preventDefault: function(){},
			stopImmediatePropagation: function(){}
		};
		oEventClick.target = this.oChart.$().find(".sapSuiteILCInteractionArea")[2];
		this.oChart.onclick(oEventClick);
		//Act
		this.oChart.onsaphome(oEventClick);
		//Assert
		assert.equal(this.oChart.$().find(".sapSuiteILCInteractionArea").eq(0).attr("tabindex"), 0, "The first column has tabindex after home button is clicked");
		assert.ok(this.oChart.$().find(".sapSuiteILCInteractionArea").eq(0).is(":focus"), "The first column is focused");
	});

	QUnit.test("End button is pressed", function(assert) {
		//Arrange
		var oEventClick = {
			preventDefault: function(){},
			stopImmediatePropagation: function(){}
		};
		oEventClick.target = this.oChart.$().find(".sapSuiteILCInteractionArea")[2];
		this.oChart.onclick(oEventClick);
		//Act
		this.oChart.onsapend(oEventClick);
		//Assert
		assert.equal(this.oChart.$().find(".sapSuiteILCInteractionArea").eq(3).attr("tabindex"), 0, "The last column has tabindex after end button is clicked");
		assert.ok(this.oChart.$().find(".sapSuiteILCInteractionArea").eq(3).is(":focus"), "The last column is focused");
	});

	QUnit.test("Focus test for mouse click event", function(assert) {
		//Arrange
		var oEvent = {preventDefault: function(){}};
		oEvent.target = this.oChart.$().find(".sapSuiteILCInteractionArea")[1];
		//Act
		this.oChart.onclick(oEvent);
		//Assert
		assert.notOk(this.oChart.$().find(".sapSuiteILCInteractionArea")[0].hasAttribute("tabindex"), "The first column does not have tabindex after mouse clicking on second column");
		assert.equal(this.oChart.$().find(".sapSuiteILCInteractionArea").eq(1).attr("tabindex"), 0, "The second column has tabindex after mouse clicking on second column");
		assert.ok(this.oChart.$().find(".sapSuiteILCInteractionArea").eq(1).is(":focus"), "The second column is focused");
	});

	QUnit.test("SelectionChanged event handler test - selected to deselected", function(assert) {
		//Arrange
		var oEvent = {preventDefault: function(){}};
		oEvent.target = this.oChart.$().find(".sapSuiteILCInteractionArea")[0];
		this.oChart.attachEvent("selectionChanged", this.fnSelectionChangedHandler);
		//Act
		this.oChart.onclick(oEvent);
		//Assert
		assert.ok(this.fnSelectionChangedHandler.calledOnce, "SelectionChanged event handler works properly.");
		assert.equal(this.oChart.fireSelectionChanged.args[0][0].selectedPoints.length, 1, "The selected point elements array is updated.");
		assert.equal(this.oChart.fireSelectionChanged.args[0][0].point.getId(), this.oChart.getPoints()[0].getId(), "The first point was clicked");
		assert.equal(this.oChart.fireSelectionChanged.args[0][0].selected, false, "The selection state of the first point is changed to deselected now");
		assert.equal(this.oChart.fireSelectionChanged.args[0][0].selectedPoints[0].getId(), this.oChart.getPoints()[2].getId(), "Only the third point is now selected, the first point was deselected.");
	});

	QUnit.test("SelectionChanged event handler test - deselected to selected", function(assert) {
		//Arrange
		var oEvent = {preventDefault: function(){}};
		oEvent.target = this.oChart.$().find(".sapSuiteILCInteractionArea")[3];
		this.oChart.attachEvent("selectionChanged", this.fnSelectionChangedHandler);
		//Act
		this.oChart.onclick(oEvent);
		//Assert
		assert.ok(this.fnSelectionChangedHandler.calledOnce, "SelectionChanged event handler works properly.");
		assert.equal(this.oChart.fireSelectionChanged.args[0][0].selectedPoints.length, 3, "The selected point elements array is updated.");
		assert.equal(this.oChart.fireSelectionChanged.args[0][0].point.getId(), this.oChart.getPoints()[3].getId(), "The forth point was clicked");
		assert.equal(this.oChart.fireSelectionChanged.args[0][0].selected, true, "The selection state of the forth point is changed to selected now");
		assert.equal(this.oChart.fireSelectionChanged.args[0][0].selectedPoints[0].getId(), this.oChart.getPoints()[0].getId(), "The first point is selected");
		assert.equal(this.oChart.fireSelectionChanged.args[0][0].selectedPoints[1].getId(), this.oChart.getPoints()[2].getId(), "The second point is selected");
		assert.equal(this.oChart.fireSelectionChanged.args[0][0].selectedPoints[2].getId(), this.oChart.getPoints()[3].getId(), "The forth point was not selected, but it is selected now.");
	});

	QUnit.test("Click event on selection disabled line chart test", function(assert) {
		//Arrange
		this.oChart.setSelectionEnabled(false);
		this.oChart.attachEvent("selectionChanged", this.fnSelectionChangedHandler);
		sap.ui.getCore().applyChanges();
		var oEvent = {preventDefault: function(){}};
		oEvent.target = this.oChart.$().find(".sapSuiteILCDisabledOverlay")[0];
		//Act
		this.oChart.onclick(oEvent);
		//Assert
		assert.ok(this.fnSelectionChangedHandler.notCalled, "The selection changed event is not triggered when click on selection disabled chart.");
	});

	QUnit.test("Event selectionChanged in non-interactive mode is not executed", function(assert) {
		//Arrange
		var oEvent = {preventDefault: function(){}};
		this.oChart.attachEvent("selectionChanged", onSelectionChanged);
		oEvent.target = this.oChart.$().find(".sapSuiteILCInteractionArea")[0];
		//Act
		this.oChart.$().width("120px");
		this.oChart._onResize();
		this.oChart.onclick(oEvent);
		//Assert
		assert.equal(this.oChart._bInteractiveMode, false, "Non-Interactive mode is active, no onclick event was executed");
		function onSelectionChanged(oEvent) {
			assert.ok(false, "Event selectionChanged is fired");
		}
	});

	QUnit.test("Press behavior in msie", function(assert) {
		//Arrange
		var bOriginalMsie = Device.browser.msie;
		Device.browser.msie = true;
		this.oChart._bInteractiveMode = false;
		//Act
		this.oChart.$().focus().click();
		//Assert
		assert.equal(this.oChart.firePress.calledOnce, 1, "Press event is fired.");
		Device.browser.msie = bOriginalMsie;
	});

	QUnit.test("Press behavior in disabled mode", function(assert) {
		//Arrange
		this.oChart.setSelectionEnabled(false);
		this.oChart._bInteractiveMode = false;
		//Act
		this.oChart.$().focus().click();
		//Assert
		assert.equal(this.oChart.firePress.calledOnce, 0, "Press event is not fired in disabled mode.");
	});

	QUnit.test("Style classes are removed on deselection", function(assert) {
		//Arrange
		var $Point = this.oChart.$("point-0");

		//Act
		this.oChart._toggleSelected(0);

		//Assert
		assert.equal($Point.hasClass("sapSuiteILCSelected"), false, "The sapSuiteILCSelected class has been removed.");
	});

	QUnit.test("Style classes are added on selection", function(assert) {
		//Arrange
		var $Point = this.oChart.$("point-1");

		//Act
		this.oChart._toggleSelected(1);

		//Assert
		assert.equal($Point.hasClass("sapSuiteILCSelected"), true, "The sapSuiteILCSelected class has been added.");
	});

	QUnit.module("Value label position", {
		beforeEach: function() {
			this.oChart = new InteractiveLineChart({
				points: [
					new InteractiveLineChartPoint({label: "May"}),
					new InteractiveLineChartPoint({label: "June", selected: false, value: 12}),
					new InteractiveLineChartPoint({label: "July", selected: false, value: 30}),
					new InteractiveLineChartPoint({label: "Aug", selected: false, value: 48}),
					new InteractiveLineChartPoint({label: "Sept", selected: false, value: 48}),
					new InteractiveLineChartPoint({label: "Oct", selected: false, value: 38}),
					new InteractiveLineChartPoint({label: "Nov", selected: false, value: 28})
				],
				displayedPoints : 7
			});
			this.oFlexBox = new FlexBox("flexbox", {
				width: "50rem",
				height: "50rem",
				items: [this.oChart]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
			this.oChart = null;
			this.oFlexBox.destroy();
			this.oFlexBox = null;
		}
	});

	QUnit.test("N/A value", function(assert) {
		//Arrange
		var $TopLabels = this.oChart.$().find(".sapSuiteILCToplabel");
		//Act
		//Assert
		assert.ok($TopLabels.eq(0).hasClass("sapSuiteILCShiftBelow") && !$TopLabels.eq(0).hasClass("sapSuiteILCShiftAbove"), "The label is shifted below the point");
	});

	QUnit.test("Minimal value", function(assert) {
		//Arrange
		var $TopLabels = this.oChart.$().find(".sapSuiteILCToplabel");
		//Act
		//Assert
		assert.ok($TopLabels.eq(1).hasClass("sapSuiteILCShiftBelow") && !$TopLabels.eq(1).hasClass("sapSuiteILCShiftAbove"), "The label is shifted below the point");
	});

	QUnit.test("Ascending linear sequence middle value", function(assert) {
		//Arrange
		var $TopLabels = this.oChart.$().find(".sapSuiteILCToplabel");
		//Act
		//Assert
		assert.ok(!$TopLabels.eq(2).hasClass("sapSuiteILCShiftBelow") && $TopLabels.eq(2).hasClass("sapSuiteILCShiftAbove"), "The label is shifted above the point");
	});

	QUnit.test("High point", function(assert) {
		//Arrange
		var $TopLabels = this.oChart.$().find(".sapSuiteILCToplabel");
		//Act
		//Assert
		assert.ok(!$TopLabels.eq(3).hasClass("sapSuiteILCShiftBelow") && $TopLabels.eq(3).hasClass("sapSuiteILCShiftAbove"), "The label is shifted above the point");
	});

	QUnit.test("Subsequent high point", function(assert) {
		//Arrange
		var $TopLabels = this.oChart.$().find(".sapSuiteILCToplabel");
		//Act
		//Assert
		assert.ok(!$TopLabels.eq(4).hasClass("sapSuiteILCShiftBelow") && $TopLabels.eq(4).hasClass("sapSuiteILCShiftAbove"), "The label is shifted above the point");
	});

	QUnit.test("Descending linear sequence middle value", function(assert) {
		//Arrange
		var $TopLabels = this.oChart.$().find(".sapSuiteILCToplabel");
		//Act
		//Assert
		assert.ok(!$TopLabels.eq(5).hasClass("sapSuiteILCShiftBelow") && $TopLabels.eq(5).hasClass("sapSuiteILCShiftAbove"), "The label is shifted above the point");
	});

	QUnit.test("Low point but not minimal value", function(assert) {
		//Arrange
		var $TopLabels = this.oChart.$().find(".sapSuiteILCToplabel");
		//Act
		//Assert
		assert.ok($TopLabels.eq(6).hasClass("sapSuiteILCShiftBelow") && !$TopLabels.eq(6).hasClass("sapSuiteILCShiftAbove"), "The label is shifted below the point");
	});

	QUnit.module("Responsiveness tests", {
		beforeEach: function() {
			this.oChart = new InteractiveLineChart({
				points: [
					new InteractiveLineChartPoint({label: "May", selected: true, value: 33.1, displayedValue: "very long displayed value"}),
					new InteractiveLineChartPoint({label: "June", value: 31.7, displayedValue: "very long value"}),
					new InteractiveLineChartPoint({label: "July", selected: true, value: 23.1}),
					new InteractiveLineChartPoint({label: "Aug", selected: false, value: 55.2})
				]
			});
			this.oFlexBox = new FlexBox("flexbox", {
				width: "50rem",
				height: "50rem",
				items: [this.oChart]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
			sinon.spy(this.oChart, "_adjustToParent");
		},
		afterEach: function() {
			this.oChart._adjustToParent.restore();
			this.oChart.destroy();
			this.oChart = null;
			this.oFlexBox.destroy();
			this.oFlexBox = null;
		}
	});

	QUnit.test("Adjusting control paramaters in onAfterRendering", function(assert) {
		//Arrange
		//Act
		this.oChart.onAfterRendering();
		//Assert
		assert.ok(this.oChart._adjustToParent.calledOnce, "The adjusting function has been called");
	});

	QUnit.test("Setting parent context paramaters in onBeforeRendering", function(assert) {
		//Arrange
		//Act
		this.oChart.onBeforeRendering();
		//Assert
		assert.ok(this.oChart.data("_parentRenderingContext") , "The parent context has been set");
		assert.equal(this.oChart.data("_parentRenderingContext"), this.oFlexBox, "A correct control has been set as parent context");
	});

	QUnit.test("Vertical responsiveness: show chart", function(assert) {
		//Arrange
		this.oFlexBox.setHeight("130px");
		//Act
		this.oChart.rerender();
		//Assert
		var bChartVisible = this.oChart.$().css("visibility") !== "hidden";
		assert.equal(bChartVisible, true, "The chart is visible");
	});

	QUnit.test("Vertical responsiveness: hide chart", function(assert) {
		//Arrange
		this.oFlexBox.setHeight("90px");
		//Act
		this.oChart.rerender();
		//Assert
		var bChartVisible = this.oChart.$().css("visibility") !== "hidden";
		assert.equal(bChartVisible, false, "The chart is invisible");
	});

	QUnit.test("Horizontal responsiveness: show value labels", function(assert) {
		//Arrange
		this.oFlexBox.setWidth("120px");
		this.oChart.getPoints()[0].setDisplayedValue("very large displayed value");
		//Act
		this.oChart.rerender();
		//Assert
		var $TopLabels = this.oChart.$().find(".sapSuiteILCToplabel"),
			bTopLabel1Visibility = $TopLabels.eq(0).css("visibility") === "hidden",
			bTopLabel2Visibility = $TopLabels.eq(1).css("visibility") === "hidden",
			bTopLabel3Visibility = $TopLabels.eq(2).css("visibility") !== "hidden",
			bTopLabel4Visibility = $TopLabels.eq(3).css("visibility") !== "hidden";
		assert.ok(bTopLabel1Visibility, "The Label is not visible because overflow occurs");
		assert.ok(bTopLabel2Visibility, "The Label is not visible because overflow occurs");
		assert.ok(bTopLabel3Visibility, "The Label is visible because no overflow occurs");
		assert.ok(bTopLabel4Visibility, "The Label is visible because no overflow occurs");
	});

	QUnit.test("Horizontal responsiveness: show whole chart", function(assert) {
		//Arrange
		var bChartVisible = this.oChart.$().css("visibility") !== "hidden";
		var bChartNonInteractive = this.oChart.$().hasClass("sapSuiteILCNonInteractive");
		var bChartHasExpandedLabels = this.oChart.$().hasClass("sapSuiteILCExpandedLabels");
		//Act
		//Assert
		assert.equal(bChartVisible, true, "The chart is visible");
		assert.equal(bChartNonInteractive, false, "The chart is interactive");
		assert.equal(bChartHasExpandedLabels, false, "The chart has no expanded labels");
	});

	QUnit.test("Horizontal responsiveness: show truncated labels", function(assert) {
		//Arrange
		this.oChart.getPoints()[0].setLabel("large bottom label");
		//Act
		this.oChart.rerender();
		//Assert
		var bChartVisible = this.oChart.$().css("visibility") !== "hidden";
		var bChartNonInteractive = this.oChart.$().hasClass("sapSuiteILCNonInteractive");
		var bChartHasExpandedLabels = this.oChart.$().hasClass("sapSuiteILCExpandedLabels");
		assert.equal(bChartVisible, true, "The chart is visible");
		assert.equal(bChartNonInteractive, false, "The chart is interactive");
		assert.equal(bChartHasExpandedLabels, false, "The chart has no expanded labels");
	});

	QUnit.test("Horizontal responsiveness: show labels if no truncation occurs", function(assert) {
		//Arrange
		this.oFlexBox.setWidth("140px");
		//Act
		this.oChart.rerender();
		//Assert
		var bChartVisible = this.oChart.$().css("visibility") !== "hidden";
		var bChartNonInteractive = this.oChart.$().hasClass("sapSuiteILCNonInteractive");
		var bChartHasExpandedLabels = this.oChart.$().hasClass("sapSuiteILCExpandedLabels");
		assert.equal(bChartVisible, true, "The chart is visible");
		assert.equal(bChartNonInteractive, true, "The chart is not interactive");
		assert.equal(bChartHasExpandedLabels, false, "The chart has no expanded labels");
	});

	QUnit.test("Horizontal responsiveness: hide labels except the edges", function(assert) {
		//Arrange
		this.oFlexBox.setWidth("120px");
		this.oChart.getPoints()[0].setLabel("large bottom label");
		//Act
		this.oChart.rerender();
		//Assert
		var bChartVisible = this.oChart.$().css("visibility") !== "hidden";
		var bChartNonInteractive = this.oChart.$().hasClass("sapSuiteILCNonInteractive");
		var bChartHasExpandedLabels = this.oChart.$().hasClass("sapSuiteILCExpandedLabels");
		assert.equal(bChartVisible, true, "The chart is visible");
		assert.equal(bChartNonInteractive, true, "The chart is not interactive");
		assert.equal(bChartHasExpandedLabels, true, "The chart has expanded labels");
	});

	QUnit.test("Horizontal responsiveness: hide chart", function(assert) {
		//Arrange
		this.oFlexBox.setWidth("80px");
		//Act
		this.oChart.rerender();
		//Assert
		var bChartVisible = this.oChart.$().css("visibility") !== "hidden";
		assert.equal(bChartVisible, false, "The chart is invisible");
	});

	QUnit.test("Horizontal responsiveness: small font", function(assert) {
		//Arrange
		var bChartSmallFontInitial = this.oChart.$().hasClass("sapSuiteILCSmallFont");
		this.oFlexBox.setWidth("120px");
		//Act
		this.oChart.rerender();
		//Assert
		var bChartVisible = this.oChart.$().css("visibility") !== "hidden";
		var bChartSmallFont = this.oChart.$().hasClass("sapSuiteILCSmallFont");
		assert.equal(bChartVisible, true, "The chart is visible");
		assert.equal(bChartSmallFontInitial, false, "The chart has initially normal font");
		assert.equal(bChartSmallFont, true, "The chart has small font after changing the width");
	});

	QUnit.test("Horizontal responsiveness: non-interactive mode", function(assert) {
		//Arrange
		var bChartNonInteractiveInitial = this.oChart.$().hasClass("sapSuiteILCNonInteractive");
		this.oFlexBox.setWidth("120px");
		//Act
		this.oChart.rerender();
		//Assert
		var bChartVisible = this.oChart.$().css("visibility") !== "hidden";
		var bChartNonInteractive = this.oChart.$().hasClass("sapSuiteILCNonInteractive");
		assert.equal(bChartVisible, true, "The chart is visible");
		assert.equal(bChartNonInteractiveInitial, false, "The chart is interactive initially");
		assert.equal(bChartNonInteractive, true, "The chart is non-interactive after changing the width");
	});

	QUnit.module("Responsiveness tests (compact)", {
		beforeEach: function() {
			this.oChart = new InteractiveLineChart({
				points: [
					new InteractiveLineChartPoint({label: "May", selected: true, value: 33.1}),
					new InteractiveLineChartPoint({label: "June", value: 31.7}),
					new InteractiveLineChartPoint({label: "July", selected: true, value: 23.1}),
					new InteractiveLineChartPoint({label: "Aug", selected: false, value: 55.2})
				]
			});
			this.oFlexBox = new FlexBox("flexbox", {
				width: "50rem",
				height: "50rem",
				items: [this.oChart]
			}).placeAt("qunit-fixture");
			this.oFlexBox.addStyleClass("sapUiSizeCompact");
			sap.ui.getCore().applyChanges();
			this.oChart._handleThemeApplied();
			sinon.spy(this.oChart, "_adjustToParent");
		},
		afterEach: function() {
			this.oChart._adjustToParent.restore();
			this.oChart.destroy();
			this.oChart = null;
			this.oFlexBox.destroy();
			this.oFlexBox = null;
		}
	});

	QUnit.test("Compact mode is active", function(assert) {
		//Assert
		assert.equal(this.oChart._isCompact(), true, "Compact mode is active.");
	});

	QUnit.test("Content density change", function(assert) {
		//Arrange
		assert.equal(this.oChart._bCompact, true, "Compact mode was initially active.");
		//Act
		this.oFlexBox.removeStyleClass("sapUiSizeCompact");
		this.oChart._handleThemeApplied();
		//Assert
		assert.equal(this.oChart._bCompact, false, "Compact mode is not active anymore.");
	});

	QUnit.test("Horizontal responsiveness: small font", function(assert) {
		//Arrange
		var bChartSmallFontInitial = this.oChart.$().hasClass("sapSuiteILCSmallFont");
		this.oFlexBox.setWidth("120px");
		//Act
		this.oChart.rerender();
		//Assert
		var bChartVisible = this.oChart.$().css("visibility") !== "hidden";
		var bChartSmallFont = this.oChart.$().hasClass("sapSuiteILCSmallFont");
		assert.equal(bChartVisible, true, "The chart is visible");
		assert.equal(bChartSmallFontInitial, false, "The chart has initially normal font");
		assert.equal(bChartSmallFont, true, "The chart has small font after changing the width");
	});

	QUnit.test("Horizontal responsiveness: non-interactive mode", function(assert) {
		//Arrange
		var bChartNonInteractiveInitial = this.oChart.$().hasClass("sapSuiteILCNonInteractive");
		this.oFlexBox.setWidth("120px");
		//Act
		this.oChart.rerender();
		//Assert
		var bChartVisible = this.oChart.$().css("visibility") !== "hidden";
		var bChartNonInteractive = this.oChart.$().hasClass("sapSuiteILCNonInteractive");
		assert.equal(bChartVisible, true, "The chart is visible");
		assert.equal(bChartNonInteractiveInitial, false, "The chart is interactive initially");
		assert.equal(bChartNonInteractive, true, "The chart is non-interactive after changing the width");
	});

	QUnit.module("Divider tests", {
		beforeEach: function() {
			this.oChart = new InteractiveLineChart({
				points: [
					new InteractiveLineChartPoint({label: "May", selected: true, value: 33.1}),
					new InteractiveLineChartPoint({label: "June", value: 31.7}),
					new InteractiveLineChartPoint({label: "July", selected: true, value: 23.1}),
					new InteractiveLineChartPoint({label: "Aug", selected: false, value: 55.2})
				]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Positive values without 0", function(assert) {
		//Arrange
		var oDivider = this.oChart.$().find(".sapSuiteILCDivider");
		//Act
		//Assert
		assert.equal(oDivider.length, 0, "No divider is rendered");
	});

	QUnit.test("Positive values with 0", function(assert) {
		//Arrange
		this.oChart.getPoints()[0].setValue(0);
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		var oDivider = this.oChart.$().find(".sapSuiteILCDivider");
		assert.equal(oDivider.length, 0, "No divider is rendered");
	});

	QUnit.test("Negative values without 0", function(assert) {
		//Arrange
		this.oChart.getPoints()[0].setValue(-101);
		this.oChart.getPoints()[1].setValue(-13.2);
		this.oChart.getPoints()[2].setValue(-33.4);
		this.oChart.getPoints()[3].setValue(-2.1);
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		var oDivider = this.oChart.$().find(".sapSuiteILCDivider");
		assert.equal(oDivider.length, 0, "No divider is rendered");
	});

	QUnit.test("Negative values with 0", function(assert) {
		//Arrange
		this.oChart.getPoints()[0].setValue(0);
		this.oChart.getPoints()[1].setValue(-13.2);
		this.oChart.getPoints()[2].setValue(-33.4);
		this.oChart.getPoints()[3].setValue(-2.1);
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		var oDivider = this.oChart.$().find(".sapSuiteILCDivider");
		assert.equal(oDivider.length, 0, "No divider is rendered");
	});

	QUnit.test("Mixed values", function(assert) {
		//Arrange
		this.oChart.getPoints()[0].setValue(12);
		this.oChart.getPoints()[1].setValue(0);
		this.oChart.getPoints()[2].setValue(-33.4);
		this.oChart.getPoints()[3].setValue(-2.1);
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		var oDivider = this.oChart.$().find(".sapSuiteILCDivider");
		assert.equal(oDivider.length, 1, "The dvider is rendered");
	});

	QUnit.module("Scaling tests", {
		beforeEach: function() {
			this.oChart = new InteractiveLineChart({
				points: [
					new InteractiveLineChartPoint({label: "May", selected: true, value: 33.1}),
					new InteractiveLineChartPoint({label: "June", value: 31.7}),
					new InteractiveLineChartPoint({label: "July", selected: true, value: 23.1}),
					new InteractiveLineChartPoint({label: "Aug", selected: false, value: 55.2})
				]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
			this.getMax = function(aArray) {
				return aArray.reduce(function(previousValue, currentValue) {
					return Math.max(previousValue, currentValue);
				}, aArray[0]);
			};
			this.getMin = function(aArray) {
				return aArray.reduce(function(previousValue, currentValue) {
					return Math.min(previousValue, currentValue);
				}, aArray[0]);
			};
		},
		afterEach: function() {
			this.getMax = null;
			this.getMin = null;
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Scaling in if values are a subset of 0..100", function(assert) {
		//Arrange
		//Act
		this.oChart._updateNormalizedValues();
		//Assert
		assert.equal(this.oChart._aNormalizedValues[2], InteractiveLineChart.MIN_SCALED_CANVAS_VALUE, "Minimal value correctly resized");
		assert.equal(this.oChart._aNormalizedValues[3], InteractiveLineChart.MAX_SCALED_CANVAS_VALUE, "Maximal value correctly resized");
		assert.equal(this.getMax(this.oChart._aNormalizedValues), InteractiveLineChart.MAX_SCALED_CANVAS_VALUE, "100 is the maximum value after normalization");
		assert.equal(this.getMin(this.oChart._aNormalizedValues), InteractiveLineChart.MIN_SCALED_CANVAS_VALUE, "0 is the minimal value after normalization");
	});

	QUnit.test("Scaling out if big differences between values", function(assert) {
		//Arrange
		this.oChart.getPoints()[0].setValue(-675765);
		this.oChart.getPoints()[2].setValue(167897);
		//Act
		this.oChart._updateNormalizedValues();
		//Assert
		assert.equal(this.oChart._aNormalizedValues[0], InteractiveLineChart.MIN_SCALED_CANVAS_VALUE, "Negative value scaled correclty");
		assert.equal(this.oChart._aNormalizedValues[2], InteractiveLineChart.MAX_SCALED_CANVAS_VALUE, "Maximal value correctly scaled");
		assert.equal(this.getMax(this.oChart._aNormalizedValues), InteractiveLineChart.MAX_SCALED_CANVAS_VALUE, "100 is the maximum value after normalization");
		assert.equal(this.getMin(this.oChart._aNormalizedValues), InteractiveLineChart.MIN_SCALED_CANVAS_VALUE, "0 is the minimal value after normalization");
	});

	QUnit.test("Scaling in case only one value is available", function(assert) {
		//Arrange
		this.oChart.destroyPoints();
		this.oChart.addPoint(new InteractiveLineChartPoint({label: "May", selected: true, value: 33.1}));
		//Act
		this.oChart._updateNormalizedValues();
		//Assert
		assert.equal(this.oChart._aNormalizedValues[0], 50.0, "value correctly scaled");
	});

	QUnit.test("NA values have no effect on scaling of avaliable values", function(assert) {
		//Arrange
		this.oChart.getPoints()[0].setValue(null);
		this.oChart.getPoints()[2].setValue(null);
		//Act
		this.oChart._updateNormalizedValues();
		//Assert
		assert.equal(this.oChart._aNormalizedValues[1], InteractiveLineChart.MIN_SCALED_CANVAS_VALUE, "Negative value scaled correctly");
		assert.equal(this.oChart._aNormalizedValues[3], InteractiveLineChart.MAX_SCALED_CANVAS_VALUE, "Maximal value correctly scaled");
		assert.equal(this.oChart._aNormalizedValues[0], 0.0, "NA value scaled as 0");
		assert.equal(this.getMax(this.oChart._aNormalizedValues), InteractiveLineChart.MAX_SCALED_CANVAS_VALUE, "100 is the maximum value after normalization");
		assert.equal(this.getMin(this.oChart._aNormalizedValues), 0.0, "minimum 0 value is reached because of NA values");
	});

	QUnit.test("Scaling in case one value is available with several values set to NA", function(assert) {
		//Arrange
		this.oChart.getPoints()[0].setValue(null);
		this.oChart.getPoints()[1].setValue(null);
		this.oChart.getPoints()[2].setValue(null);
		//Act
		this.oChart._updateNormalizedValues();
		//Assert
		assert.equal(this.oChart._aNormalizedValues[3], 50.0, "value correctly scaled");
		assert.equal(this.oChart._aNormalizedValues[0], 0.0, "NAs are scaled as 0 in this case as well");
	});

	QUnit.test("Scaling in case all values are NA", function(assert) {
		//Arrange
		this.oChart.getPoints()[0].setValue(null);
		this.oChart.getPoints()[1].setValue(null);
		this.oChart.getPoints()[2].setValue(null);
		this.oChart.getPoints()[3].setValue(null);
		//Act
		this.oChart._updateNormalizedValues();
		//Assert
		assert.equal(this.getMax(this.oChart._aNormalizedValues), 0.0, "0 is the only value in the array if all are NA");
		assert.equal(this.getMin(this.oChart._aNormalizedValues), 0.0, "0 is the only value in the array if all are NA");
	});

	/* --------------------------------------- */
	/* ARIA Tests                              */
	/* --------------------------------------- */
	QUnit.module("ARIA tests", {
		beforeEach : function() {
			this.oChart = new InteractiveLineChart({
				points: [
					new InteractiveLineChartPoint({label: "May", selected: true, value: 33.1}),
					new InteractiveLineChartPoint({label: "June", value: 31.7}),
					new InteractiveLineChartPoint({label: "July", selected: false})
				]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Area rendering", function(assert) {
		//Arrange
		//Act
		var $Area1 = this.oChart.$().find(".sapSuiteILCInteractionArea").eq(0);
		var $Area2 = this.oChart.$().find(".sapSuiteILCInteractionArea").eq(1);
		var $Area3 = this.oChart.$().find(".sapSuiteILCInteractionArea").eq(2);
		//Assert
		//bar1
		assert.equal($Area1.attr("role"), "option", "The area1 role is <option>");
		assert.equal($Area1.attr("aria-label"), "May 33.1", "The area1 labelledby is correct");
		assert.equal($Area1.attr("aria-selected"), "true", "The area1 is selected");
		assert.equal($Area1.attr("aria-posinset"), "1", "The area1 posinset is correct");
		assert.equal($Area1.attr("aria-setsize"), "3", "The area1 setsize is correct");
		//bar2
		assert.equal($Area2.attr("role"), "option", "The area2 role is <option>");
		assert.equal($Area2.attr("aria-label"), "June 31.7", "The area2 labelledby is correct");
		assert.equal($Area2.attr("aria-selected"), "false", "The area2 is not selected");
		assert.equal($Area2.attr("aria-posinset"), "2", "The area2 posinset is correct");
		assert.equal($Area2.attr("aria-setsize"), "3", "The area2 setsize is correct");
		//bar3
		assert.equal($Area3.attr("role"), "option", "The area3 role is <option>");
		assert.equal($Area3.attr("aria-label"), "July N/A", "The area3 labelledby is correct");
		assert.equal($Area3.attr("aria-selected"), "false", "The area3 is not selected");
		assert.equal($Area3.attr("aria-posinset"), "3", "The area3 posinset is correct");
		assert.equal($Area3.attr("aria-setsize"), "3", "The area3 setsize is correct");
	});

	QUnit.test("Chart rendering (interactive)", function(assert) {
		//Arrange
		//Act
		//Assert
		var $Chart = this.oChart.$();
		assert.equal($Chart.attr("role"), "listbox", "The chart role is <listbox>");
		assert.equal($Chart.attr("aria-multiselectable"), "true", "The chart is multiselectable");
		assert.equal($Chart.attr("aria-disabled"), "false", "The chart is not disabled");
		assert.equal($Chart.hasClass("sapSuiteIBCNonInteractive"), false, "The chart is interactive");
	});

	QUnit.test("Chart rendering (non-interactive)", function(assert) {
		//Arrange
		this.oChart.$().width("120px");
		//Act
		this.oChart._onResize();
		//Assert
		var $Chart = this.oChart.$();
		assert.equal($Chart.hasClass("sapSuiteILCNonInteractive"), true, "The chart is non-interactive");
		assert.equal($Chart.attr("role"), "button", "The chart role is <button>");
		assert.equal($Chart.attr("aria-multiselectable"), "false", "The chart is not multiselectable");
		assert.equal($Chart.attr("aria-disabled"), "true", "The chart is disabled because is non-interactive");
	});

	QUnit.test("Chart rendering (non-interactive switch to interactive)", function(assert) {
		//Arrange
		this.oChart.$().width("120px");
		//Act
		this.oChart._onResize();
		this.oChart.$().width("400px");
		this.oChart._onResize();
		//Assert
		var $Chart = this.oChart.$();
		assert.equal($Chart.hasClass("sapSuiteILCNonInteractive"), false, "The chart is interactive");
		assert.equal($Chart.attr("role"), "listbox", "The chart role is <listbox>");
		assert.equal($Chart.attr("aria-multiselectable"), "true", "The chart is multiselectable");
		assert.equal($Chart.attr("aria-disabled"), "false", "The chart is not disabled");
	});

	QUnit.test("Chart labelledby", function(assert) {
		//Arrange
		var oLabel = new Label({text: "Projects by Margin"});
		//Act
		this.oChart.addAriaLabelledBy(oLabel);
		sap.ui.getCore().applyChanges();
		//Assert
		var $Chart = this.oChart.$();
		assert.equal(this.oChart.getAriaLabelledBy(), oLabel.getId(), "Chart has aria-labelledby to the associated id");
		assert.equal($Chart.attr("aria-labelledby"), oLabel.getId(), "Chart has attribute aria-labelledby to the associated id");
	});

	QUnit.test("Chart describedby", function(assert) {
		//Arrange
		var sId = this.oChart.getId();
		var sDescribedBy = sId + "-point-area-0," + sId + "-point-area-1," + sId + "-point-area-2";
		//Act
		//Assert
		var $Chart = this.oChart.$();
		assert.equal($Chart.attr("aria-describedby"), sDescribedBy, "Chart has attribute aria-describedby to the associated area ids");
	});

	QUnit.test("Chart - disabled", function(assert) {
		//Arrange
		this.oChart.setSelectionEnabled(false);
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		var $Chart = this.oChart.$();
		assert.equal($Chart.attr("aria-disabled"), "true", "The chart is disabled");
	});

	QUnit.test("Area - toggle selected", function(assert) {
		//Arrange
		var $Area = this.oChart.$().find(".sapSuiteILCInteractionArea").eq(0);
		var sAreaSelectedInitial = $Area.attr("aria-selected");
		//Act
		this.oChart._toggleSelected(0);
		//Assert
		var sAreaSelected = $Area.attr("aria-selected");
		assert.equal(sAreaSelectedInitial, "true", "Initially, the first area is selected");
		assert.equal(sAreaSelected, "false", "After changing the selection, the first area is not selected");
	});

	QUnit.test("Aria label - semantic color", function(assert) {
		//Arrange
		this.oChart.getPoints()[1].setColor(ValueColor.Good);
		sap.ui.getCore().applyChanges();
		//Act
		var $Area1 = this.oChart.$().find(".sapSuiteILCInteractionArea").eq(0);
		var $Area2 = this.oChart.$().find(".sapSuiteILCInteractionArea").eq(1);
		var $Area3 = this.oChart.$().find(".sapSuiteILCInteractionArea").eq(2);
		//Assert
		//bar1
		assert.equal($Area1.attr("aria-label"), "May 33.1 Neutral", "The aria label for bar1 is correct");
		//bar2
		assert.equal($Area2.attr("aria-label"), "June 31.7 Good", "The aria label for bar2 is correct");
		//bar3
		assert.equal($Area3.attr("aria-label"), "July N/A Neutral", "The aria label for bar3 is correct");
	});

	QUnit.module("Rendering of semantic points", {
		beforeEach: function() {
			this.oChart = new InteractiveLineChart({
				points: [
					new InteractiveLineChartPoint({
						label: "Creative Label",
						value: 100,
						color: ValueColor.Neutral
					}),
					new InteractiveLineChartPoint({
						label: "Creative Label 2",
						value: 1200,
						color: ValueColor.Good
					}),
					new InteractiveLineChartPoint({
						label: "Creative Label 3",
						value: 200,
						color: ValueColor.Critical
					}),
					new InteractiveLineChartPoint({
						label: "Creative Label 4",
						value: 500,
						color: ValueColor.Error
					})
				]
			});
			this.oChart.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("No semantic color class is added for explicit 'Neutral' color", function(assert) {
		//Arrange
		var $Point = this.oChart.$("point-0");

		//Act
		//Assert
		assert.equal($Point.hasClass("sapSuiteICSemanticColorNeutral"), false, "No semantic class found for 'Neutral'.");
		assert.equal($Point.hasClass("sapSuiteICSemanticColorGood"), false, "No semantic class found for 'Good'.");
		assert.equal($Point.hasClass("sapSuiteICSemanticColorCritical"), false, "No semantic class found for 'Critical'.");
		assert.equal($Point.hasClass("sapSuiteICSemanticColorError"), false, "No semantic class found for 'Error'.");
	});

	QUnit.test("No semantic color class is added for 'Good' color", function(assert) {
		//Arrange
		var $Point = this.oChart.$("point-1");

		//Act
		//Assert
		assert.equal($Point.hasClass("sapSuiteICSemanticColorGood"), true, "Semantic class found for 'Good'.");
	});

	QUnit.test("No semantic color class is added for 'Critical' color", function(assert) {
		//Arrange
		var $Point = this.oChart.$("point-2");

		//Act
		//Assert
		assert.equal($Point.hasClass("sapSuiteICSemanticColorCritical"), true, "Semantic class found for 'Critical'.");
	});

	QUnit.test("No semantic color class is added for 'Error' color", function(assert) {
		//Arrange
		var $Point = this.oChart.$("point-3");

		//Act
		//Assert
		assert.equal($Point.hasClass("sapSuiteICSemanticColorError"), true, "Semantic class found for 'Error'.");
	});

	QUnit.module("Execution of functions onAfterRendering", {
		beforeEach : function() {
			this.oChart = new InteractiveLineChart({
				points: [
					new InteractiveLineChartPoint({label: "May", selected: true, value: 33.1}),
					new InteractiveLineChartPoint({label: "June", value: 31.7}),
					new InteractiveLineChartPoint({label: "July", selected: false})
				]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Visibility check", function(assert) {
		//Arrange
		var oSpyCheckControlIsVisible = sinon.spy(microchartLibrary, "_checkControlIsVisible");
		//Act
		this.oChart.onAfterRendering();
		//Assert
		assert.ok(oSpyCheckControlIsVisible.calledOnce, "Method _checkControlIsVisible has been called once.");
		//Restore
		oSpyCheckControlIsVisible.restore();
	});

	QUnit.test("Function check of _onControlIsVisible", function(assert) {
		//Arrange
		var oSpyOnResize = sinon.spy(this.oChart, "_onResize");
		//Act
		this.oChart.onAfterRendering();
		//Assert
		assert.ok(this.oChart._sResizeHandlerId, "this._sResizeHandlerId is not null.");
		assert.ok(oSpyOnResize.called, "Method _onResize has been called.");
	});

	QUnit.test("Attach interval timer", function(assert) {
		//Arrange
		var oAttachIntervalTimer = sinon.spy(IntervalTrigger.prototype, "addListener");
		//Act
		this.oChart.onAfterRendering();
		//Assert
		assert.ok(oAttachIntervalTimer.callCount === 0, "The interval timer has not been attached");
		//Restore
		oAttachIntervalTimer.restore();
	});

	QUnit.module("Tooltip tests", {
		beforeEach: function() {
			this.oChart = new InteractiveLineChart("lmc1", {
				points: [
					new InteractiveLineChartPoint({label: "May", value: 33.1}),
					new InteractiveLineChartPoint({label: "June", value: 31.7})
				]
			});
			this.oFlexBox = new FlexBox("flexbox", {
				width: "50rem",
				height: "50rem",
				items: [this.oChart]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
			this.oChart = null;
			this.oFlexBox.destroy();
			this.oFlexBox = null;
		}
	});

	QUnit.test("Standard chart tooltip (non-interactive mode)", function(assert) {
		//Arrange
		this.oChart.addPoint(new InteractiveLineChartPoint({label: "July", value: 23.1}));
		this.oFlexBox.setHeight("150px");
		this.oFlexBox.setWidth("150px");

		//Act
		this.oFlexBox.rerender();

		//Assert
		var sChartTooltip = this.oChart.$().attr("title");
		assert.equal(sChartTooltip.indexOf("May: 33.1") >= 0, true, "Chart tooltip contains label and value from the first item");
		assert.equal(sChartTooltip.indexOf("June: 31.7") >= 0, true, "Chart tooltip contains label and value from the second item");
		assert.equal(sChartTooltip.indexOf("July: 23.1") >= 0, true, "Chart tooltip contains label and value from the third item");
	});

	QUnit.test("Custom chart tooltip (non-interactive mode)", function(assert) {
		//Arrange
		var sCustomTooltip = "Cumulative Totals\ncalculated in EURO";
		this.oChart.addPoint(new InteractiveLineChartPoint({label: "July", value: 23.1}));
		this.oChart.setTooltip(sCustomTooltip);
		this.oFlexBox.setHeight("150px");
		this.oFlexBox.setWidth("150px");

		//Act
		this.oFlexBox.rerender();

		//Assert
		var sChartTooltip = this.oChart.$().attr("title");
		assert.equal(sChartTooltip, sCustomTooltip, "Chart custom tooltip contains only the custom tooltip text");
	});

	QUnit.test("Custom chart tooltip (interactive mode)", function(assert) {
		//Arrange
		var sCustomTooltip = "Cumulative Totals\ncalculated in EURO";
		this.oChart.setTooltip(sCustomTooltip);

		//Act
		this.oChart.rerender();

		//Assert
		var $Chart = this.oChart.$(),
			$InteractionAreas = $Chart.find(".sapSuiteILCInteractionArea"),
			sChartTooltip = $Chart.attr("title"),
			sFirstItemTooltip = $InteractionAreas.eq(0).attr("title"),
			sSecondItemTooltip = $InteractionAreas.eq(1).attr("title");
		assert.equal(sChartTooltip, null, "The chart tooltip is empty");
		assert.equal(sFirstItemTooltip, "May:\n33.1", "First item tooltip is present and contains label and value but no custom tooltip");
		assert.equal(sSecondItemTooltip, "June:\n31.7", "Second item tooltip is present and contains label and value but no custom tooltip");
	});

	QUnit.test("Standard tooltip (interactive mode but disabled chart)", function(assert) {
		//Arrange
		this.oChart.setSelectionEnabled(false);

		//Act
		this.oChart.rerender();

		//Assert
		var $Chart = this.oChart.$(),
			$InteractionAreas = $Chart.find(".sapSuiteILCInteractionArea"),
			sChartTooltip = $Chart.attr("title"),
			sFirstItemTooltip = $InteractionAreas.eq(0).attr("title"),
			sSecondItemTooltip = $InteractionAreas.eq(1).attr("title");
		assert.ok(sChartTooltip.length > 0, "Chart tooltip is present");
		assert.equal(sFirstItemTooltip, null, "First item tooltip is not present");
		assert.equal(sSecondItemTooltip, null, "Second item tooltip is not present");
	});

	QUnit.test("Suppress tooltip (non-interactive)", function(assert) {
		//Arrange
		this.oChart.addPoint(new InteractiveLineChartPoint({label: "July", value: 23.1}));
		this.oChart.setTooltip(" ");
		this.oFlexBox.setHeight("150px");
		this.oFlexBox.setWidth("150px");

		//Act
		this.oChart.rerender();

		//Assert
		var $Chart = this.oChart.$(),
			$InteractionAreas = $Chart.find(".sapSuiteILCInteractionArea"),
			sChartTooltip = $Chart.attr("title"),
			sFirstItemTooltip = $InteractionAreas.eq(0).attr("title"),
			sSecondItemTooltip = $InteractionAreas.eq(1).attr("title");
		assert.equal(sChartTooltip, null, "Chart tooltip is not present");
		assert.equal(sFirstItemTooltip, null, "First item tooltip is not present");
		assert.equal(sSecondItemTooltip, null, "Second item tooltip is not present");
	});

	QUnit.test("Custom tooltip added to an interaction area (interactive mode)", function(assert) {
		//Arrange
		var sCustomTooltip = "Cumulative Totals\ncalculated in EURO",
			oFirstArea = this.oChart.getPoints()[0],
			oSecondArea = this.oChart.getPoints()[1];
		oFirstArea.setTooltip(sCustomTooltip);
		this.oChart.setTooltip(sCustomTooltip);

		//Act
		this.oChart.rerender();

		//Assert
		var $Chart = this.oChart.$(),
			$InteractionAreas = $Chart.find(".sapSuiteILCInteractionArea"),
			sChartTooltip = $Chart.attr("title"),
			sFirstItemTooltip = $InteractionAreas.eq(0).attr("title"),
			sSecondItemTooltip = $InteractionAreas.eq(1).attr("title"),
			sFirstItemAriaLabel = $InteractionAreas.eq(0).attr("aria-label"),
			sSecondItemAriaLabel = $InteractionAreas.eq(1).attr("aria-label");
		assert.equal(oFirstArea._bCustomTooltip, true, "First item has a custom tooltip");
		assert.equal(oSecondArea._bCustomTooltip, false, "Second item does not have a custom tooltip");
		assert.equal(sChartTooltip, null, "Chart tooltip is not present");
		assert.equal(sFirstItemTooltip, sCustomTooltip, "First item tooltip contains only custom text");
		assert.equal(sSecondItemTooltip, "June:\n31.7", "Second item tooltip contains label and value and no custom text");
		assert.equal(sFirstItemAriaLabel, sCustomTooltip, "First item aria-label contains custom text");
		assert.equal(sSecondItemAriaLabel, "June 31.7", "Second item aria-label contains label and value");
	});

	QUnit.test("Suppress interaction area tooltip (interactive mode)", function(assert) {
		//Arrange
		this.oChart.getPoints()[0].setTooltip(" ");

		//Act
		this.oChart.rerender();

		//Assert
		var $Chart = this.oChart.$(),
			$InteractionAreas = $Chart.find(".sapSuiteILCInteractionArea"),
			sFirstItemTooltip = $InteractionAreas.eq(0).attr("title"),
			sFirstItemAriaLabel = $InteractionAreas.eq(0).attr("aria-label"),
			sSecondItemTooltip = $InteractionAreas.eq(1).attr("title");
		assert.equal(sFirstItemTooltip, null, "First item tooltip is not present");
		assert.equal(sFirstItemAriaLabel, "May 33.1", "First item aria-label contains standard tooltip text");
		assert.equal(sSecondItemTooltip, "June:\n31.7", "Second item tooltip is present and contains label and value");
	});

	QUnit.test("N/A value area tooltip", function(assert) {
		//Arrange
		var oFirstPoint = this.oChart.getPoints()[0];
		oFirstPoint.setValue(null);

		//Act
		this.oChart.rerender();

		//Assert
		var $Chart = this.oChart.$(),
			$InteractionAreas = $Chart.find(".sapSuiteILCInteractionArea"),
			sFirstItemTooltip = $InteractionAreas.eq(0).attr("title"),
			sNAValue = this.oChart._oRb.getText("INTERACTIVECHART_NA");
		assert.ok(sFirstItemTooltip.indexOf(sNAValue) >= 0, "N/A Value inside tooltip provided");
	});

	QUnit.test("N/A value chart tooltip", function(assert) {
		//Arrange
		this.oChart.addPoint(new InteractiveLineChartPoint({label: "July", value: 23.1}));
		this.oFlexBox.setHeight("150px");
		this.oFlexBox.setWidth("150px");
		var oFirstArea = this.oChart.getPoints()[0];
		oFirstArea.setValue(null);

		//Act
		this.oChart.rerender();

		//Assert
		var $Chart = this.oChart.$(),
			sChartTooltip = $Chart.attr("title"),
			$InteractionAreas = $Chart.find(".sapSuiteILCInteractionArea"),
			sFirstItemTooltip = $InteractionAreas.eq(0).attr("title"),
			sNAValue = this.oChart._oRb.getText("INTERACTIVECHART_NA");
		assert.equal(sFirstItemTooltip, null, "No first item tooltip present");
		assert.equal(sChartTooltip.indexOf(sNAValue) >= 0, true, "N/A Value inside chart tooltip");
	});

	QUnit.test("Tooltip rendering (non-interactive mode switch to interactive mode)", function(assert) {
		//Arrange
		this.oChart.$().width("120px");

		//Act
		this.oChart._onResize();
		this.oChart.$().width("400px");
		this.oChart._onResize();

		//Assert
		var $Chart = this.oChart.$(),
			$InteractionAreas = $Chart.find(".sapSuiteILCInteractionArea"),
			sChartTooltip = $Chart.attr("title"),
			sFirstItemTooltip = $InteractionAreas.eq(0).attr("title"),
			sSecondItemTooltip = $InteractionAreas.eq(1).attr("title");
		assert.equal(sChartTooltip, null, "Chart tooltip is not present");
		assert.equal(sFirstItemTooltip, "May:\n33.1", "First item tooltip is present and contains label and value");
		assert.equal(sSecondItemTooltip, "June:\n31.7", "Second item tooltip is present and contains label and value");
	});

	QUnit.test("Standard behavior with semantic colors", function(assert) {
		//Arrange
		this.oChart.getPoints()[0].setColor(ValueColor.Good);
		sap.ui.getCore().applyChanges();

		//Act
		//Assert
		var $Chart = this.oChart.$(),
			$InteractionAreas = $Chart.find(".sapSuiteILCInteractionArea"),
			sFirstItemTooltip = $InteractionAreas.eq(0).attr("title"),
			sSecondItemTooltip = $InteractionAreas.eq(1).attr("title");
		assert.equal(sFirstItemTooltip, "May:\n33.1 Good", "First item tooltip is present and contains label, value and semantic description");
		assert.equal(sSecondItemTooltip, "June:\n31.7 Neutral", "Second item tooltip is present and contains label, value and semantic description");
	});

	QUnit.test("Standard behavior with semantic colors (non-interactive)", function(assert) {
		//Arrange
		this.oChart.getPoints()[0].setColor(ValueColor.Good);
		this.oFlexBox.setWidth("100px");
		sap.ui.getCore().applyChanges();

		//Act
		//Assert
		var bChartNonInteractive = this.oChart.$().hasClass("sapSuiteILCNonInteractive");
		var sChartTooltip = this.oChart.$().attr("title");
		assert.equal(bChartNonInteractive, true, "The chart is not interactive");
		assert.equal(sChartTooltip.indexOf("May: 33.1 Good") >= 0, true, "Chart tooltip contains label, value and semantic description from the first item");
		assert.equal(sChartTooltip.indexOf("June: 31.7 Neutral") >= 0, true, "Chart tooltip contains label, value and semantic description from the second item");
	});
});

