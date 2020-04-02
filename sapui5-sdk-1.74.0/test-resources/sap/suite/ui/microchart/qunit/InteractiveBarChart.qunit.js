/*global QUnit, sinon */
sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/microchart/InteractiveBarChart",
	"sap/suite/ui/microchart/InteractiveBarChartBar",
	"sap/m/FlexBox",
	"sap/m/ValueColor",
	"sap/m/Label",
	"sap/ui/Device",
	"sap/suite/ui/microchart/library",
	"sap/base/Log",
	"sap/ui/core/IntervalTrigger"
], function (jQuery, InteractiveBarChart, InteractiveBarChartBar, FlexBox, ValueColor, Label, Device, microchartLibrary, Log, IntervalTrigger) {
	"use strict";

	jQuery.sap.initMobile();


	QUnit.module("Control initialization core and theme checks", {
		beforeEach: function() {
			this.oStubIsInitialized = sinon.stub(sap.ui.getCore(), "isInitialized");
			this.oSpyAttachInit = sinon.spy(sap.ui.getCore(), "attachInit");
			this.oSpyHandleCoreInitialized = sinon.spy(InteractiveBarChart.prototype, "_handleCoreInitialized");
			this.oStubThemeApplied = sinon.stub(sap.ui.getCore(), "isThemeApplied");
			this.oStubAttachThemeApplied = sinon.stub(sap.ui.getCore(), "attachThemeChanged").callsFake(function(fn, context) {
				fn.call(context); //simulate immediate theme change
			});
			this.oSpyHandleThemeApplied = sinon.spy(InteractiveBarChart.prototype, "_handleThemeApplied");
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
		var oChart = new InteractiveBarChart();

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
		var oChart = new InteractiveBarChart();

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
		var oChart = new InteractiveBarChart();

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
		var oChart = new InteractiveBarChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.oSpyAttachInit.notCalled, "Method Core.attachInit has not been called.");
		assert.ok(this.oSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.oStubAttachThemeApplied.calledOnce, "Method Core.attachThemeChanged has been called once.");
		assert.ok(this.oSpyHandleThemeApplied.calledOnce, "Method _handleThemeApplied has been called once.");
	});

	QUnit.module("Basic tests", {
		beforeEach : function() {
			this.oChart = new InteractiveBarChart({
				bars: [
					new InteractiveBarChartBar({selected: true}),
					new InteractiveBarChartBar()
				]
			});
		},
		afterEach : function() {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("InteractiveBarChart can be instantiated", function(assert) {
		//Assert
		assert.ok(this.oChart, "The InteractiveBarChart control is found in the library and instantiated");
	});

	QUnit.test("Default values of properties", function(assert) {
		//Assert
		assert.strictEqual(this.oChart.getDisplayedBars(), 3, "Property 'displayedBars': default value is 3");
		assert.strictEqual(this.oChart.getSelectionEnabled(), true, "Property 'selectionEnabled': default value is true");
	});

	QUnit.test("Aggregation test", function(assert) {
		//Assert
		assert.ok(this.oChart.getBars(), "InteractiveBarChartBar is defined in the bars aggregation");
		assert.equal(this.oChart.getBars().length, 2, "Bars aggregation: multiple is supported");
	});

	QUnit.test("Disabled overlay is rendered", function(assert) {
		//Arrange
		this.oChart.setSelectionEnabled(false);
		this.oChart.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
		//Assert
		assert.equal(this.oChart.$().find(".sapSuiteIBCDisabledOverlay").length, 1, "The overlay div exists in dom.");
	});

	/* --------------------------------------- */
	/* Events tests                            */
	/* --------------------------------------- */
	QUnit.module("Event tests", {
		beforeEach : function() {
			this.fnSelectionChangedHandler = function() {
			};
			this.oChart = new InteractiveBarChart({
				bars: [
					new InteractiveBarChartBar()
				]
			});
			sinon.spy(this, "fnSelectionChangedHandler");
			this.oFlexBox = new FlexBox("flexbox-events", {
				width: "400px",
				height: "5000px",
				items: [this.oChart]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.fnSelectionChangedHandler.restore();
			this.oChart.destroy();
			this.oChart = null;
			this.oFlexBox.destroy();
			this.oFlexBox = null;
		}
	});

	QUnit.test("Event selectionChanged", function(assert) {
		//Arrange
		this.oChart.addBar(new InteractiveBarChartBar());
		this.oChart.addBar(new InteractiveBarChartBar({selected: true}));
		var oEvent = {preventDefault: function(){}},
			aBars = this.oChart.getBars(),
			aSelectedBars = [];
		aSelectedBars.push(aBars[0]);
		aSelectedBars.push(aBars[2]);
		this.oChart.attachEvent("selectionChanged", onSelectionChanged);
		sap.ui.getCore().applyChanges();
		oEvent.target = this.oChart.$().find(".sapSuiteIBCBarInteractionArea")[0];
		//Act
		this.oChart.onclick(oEvent);
		//Assert
		assert.expect(3); // verifies the event handler was executed
		function onSelectionChanged(oEvent) {
			assert.ok(true, "Event selectionChanged fired");
			assert.deepEqual(oEvent.getParameter("selectedBars"), aSelectedBars, "Expected parameter selectedBars provided");
			assert.equal(oEvent.getParameter("selected"), true, "Value of property selected is true");
		}
	});

	QUnit.test("Event selectionChanged in non-interactive mode", function(assert) {
		//Arrange
		this.oChart.addBar(new InteractiveBarChartBar());
		this.oChart.addBar(new InteractiveBarChartBar({selected: true}));
		var oEvent = {preventDefault: function(){}};
		this.oChart.attachEvent("selectionChanged", onSelectionChanged);
		oEvent.target = this.oChart.$().find(".sapSuiteIBCBarInteractionArea")[0];
		//Act
		this.oFlexBox.setHeight("1rem");
		sap.ui.getCore().applyChanges();
		this.oChart.onclick(oEvent);
		//Assert
		assert.equal(this.oChart._bInteractiveMode, false, "Non-Interactive mode is active, no onclick event was executed");
		assert.equal(this.oChart.$().hasClass("sapSuiteIBCNonInteractive"), true, "The chart is non-interactive");
		function onSelectionChanged(oEvent) {
			assert.ok(false, "Event selectionChanged is fired");
		}
	});

	QUnit.test("No click event on selection disabled bar chart", function(assert) {
		//Arrange
		this.oChart.setSelectionEnabled(false);
		this.oChart.attachEvent("selectionChanged", this.fnSelectionChangedHandler);
		sap.ui.getCore().applyChanges();
		var oEvent = {preventDefault: function(){}};
		oEvent.target = this.oChart.$().find(".sapSuiteIBCDisabledOverlay")[0];
		//Act
		this.oChart.onclick(oEvent);
		//Assert
		assert.ok(this.fnSelectionChangedHandler.notCalled, "The selectionChanged event is not triggered when clicked on selection disabled bar chart");
	});

	QUnit.module("Keyboard support tests", {
		beforeEach: function() {
			this.oPressHandler = sinon.spy();
			this.oChart = new InteractiveBarChart({
				min: 0,
				max: 100,
				bars: [
					{label : "label1", value : 90, displayedValue : "90%"},
					{label : "label2", value : 90, displayedValue : "90%"},
					{label : "label3", value : 90, displayedValue : "90%"}
				],
				press: this.oPressHandler
			});
			this.oChart.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
			sinon.spy(this.oChart, "fireSelectionChanged");
			sinon.spy(this.oChart, "firePress");
		},
		afterEach: function() {
			this.oChart.fireSelectionChanged.restore();
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Enter button is pressed (interactive)", function(assert) {
		//Arrange
		var oEventEnter = {
			preventDefault: function(){},
			stopImmediatePropagation: function(){},
			target: this.oChart.$().find(".sapSuiteIBCBarInteractionArea")[1]
		};
		//Act
		this.oChart.onsapenter(oEventEnter);
		//Assert
		assert.ok(this.oChart.getBars()[1].getSelected(), "The second bar is changed to selected after the enter button was clicked on it");
		assert.ok(this.oChart.fireSelectionChanged.calledOnce, "SelectionChanged event is fired");
		assert.notOk(this.oChart.firePress.calledOnce, "Press event is not fired in interative mode");
	});

	QUnit.test("Enter button is pressed (non-interactive)", function(assert) {
		//Arrange
		var oEventEnter = {
			preventDefault: function(){},
			stopImmediatePropagation: function(){},
			target: this.oChart.$().find(".sapSuiteIBCBarInteractionArea")[1]
		};
		//Act
		this.oChart._bInteractiveMode = false;
		this.oChart.onsapenter(oEventEnter);
		//Assert
		assert.equal(this.oChart.getBars()[1].getSelected(), false, "Change selection is ignored in non-interactive mode");
		assert.equal(this.oChart.fireSelectionChanged.callCount, 0, "SelectionChanged event is not fired in non-interative mode");
		assert.equal(this.oChart.firePress.callCount, 1, "Press event is fired in non-interative mode");
	});

	QUnit.test("Space button is pressed", function(assert) {
		//Arrange
		var oEventSpace = {
			preventDefault: function(){},
			stopImmediatePropagation: function(){},
			target: this.oChart.$().find(".sapSuiteIBCBarInteractionArea")[1]
		};
		//Act
		this.oChart.onsapspace(oEventSpace);
		//Assert
		assert.ok(this.oChart.getBars()[1].getSelected(), "The second bar is changed to selected after the space button was clicked on it");
		assert.ok(this.oChart.fireSelectionChanged.calledOnce, "SelectionChanged event is fired");
	});

	QUnit.test("Down arrow button is pressed", function(assert) {
		//Arrange
		var oEventDown = {
			preventDefault: function(){},
			stopImmediatePropagation: function(){},
			target: this.oChart.$().find(".sapSuiteIBCBarInteractionArea")[0]
		};
		//Act
		this.oChart.onsapdown(oEventDown);
		//Assert
		assert.notOk(this.oChart.$().find(".sapSuiteIBCBarInteractionArea")[0].hasAttribute("tabindex"), "The first bar does not have tabindex after down arrow button was clicked");
		assert.equal(this.oChart.$().find(".sapSuiteIBCBarInteractionArea").eq(1).attr("tabindex"), 0, "The second bar has tabindex after down arrow button was clicked");
		assert.ok(this.oChart.$().find(".sapSuiteIBCBarInteractionArea").eq(1).is(":focus"), "The second bar is focused");
	});

	QUnit.test("Up arrow button is pressed", function(assert) {
		//Arrange
		var oEventDown = {
			preventDefault: function(){},
			stopImmediatePropagation: function(){},
			target: this.oChart.$().find(".sapSuiteIBCBarInteractionArea")[0]
		};
		var oEventUp = {
			preventDefault: function(){},
			stopImmediatePropagation: function(){},
			target: this.oChart.$().find(".sapSuiteIBCBarInteractionArea")[1]
		};
		//Act
		this.oChart.onsapdown(oEventDown);
		this.oChart.onsapup(oEventUp);
		//Assert
		assert.notOk(this.oChart.$().find(".sapSuiteIBCBarInteractionArea")[1].hasAttribute("tabindex"), "The second bar does not have tabindex after up arrow button was clicked");
		assert.equal(this.oChart.$().find(".sapSuiteIBCBarInteractionArea").eq(0).attr("tabindex"), 0, "The first bar has tabindex after up arrow button was clicked");
		assert.ok(this.oChart.$().find(".sapSuiteIBCBarInteractionArea").eq(0).is(":focus"), "The first bar is focused");
	});

	QUnit.test("Home button is pressed", function(assert) {
		//Arrange
		var oEventHome = {
			preventDefault: function(){},
			stopImmediatePropagation: function(){},
			target: this.oChart.$().find(".sapSuiteIBCBarInteractionArea")[2]
		};
		this.oChart.onclick(oEventHome);
		//Act
		this.oChart.onsaphome(oEventHome);
		//Assert
		assert.equal(this.oChart.$().find(".sapSuiteIBCBarInteractionArea").eq(0).attr("tabindex"), 0, "The first bar has tabindex after home button is clicked");
		assert.ok(this.oChart.$().find(".sapSuiteIBCBarInteractionArea").eq(0).is(":focus"), "The first bar is focused");
	});

	QUnit.test("End button is pressed", function(assert) {
		//Arrange
		var oEventEnd = {
			preventDefault: function(){},
			stopImmediatePropagation: function(){},
			target: this.oChart.$().find(".sapSuiteIBCBarInteractionArea")[1]
		};
		this.oChart.onclick(oEventEnd);
		//Act
		this.oChart.onsapend(oEventEnd);
		//Assert
		assert.equal(this.oChart.$().find(".sapSuiteIBCBarInteractionArea").eq(2).attr("tabindex"), 0, "The last bar has tabindex after end button is clicked");
		assert.ok(this.oChart.$().find(".sapSuiteIBCBarInteractionArea").eq(2).is(":focus"), "The last bar is focused");
	});

	QUnit.test("Press behavior in msie", function(assert) {
		//Arrange
		var bOriginalMsie = Device.browser.msie;
		Device.browser.msie = true;
		this.oChart._bInteractiveMode = false;
		//Act
		this.oChart.$().focus().click();
		//Assert
		assert.equal(this.oPressHandler.callCount, 1, "Chart press handler called.");
		Device.browser.msie = bOriginalMsie;
	});

	QUnit.test("Press behavior in disabled mode", function(assert) {
		//Arrange
		this.oChart.setSelectionEnabled(false);
		this.oChart._bInteractiveMode = false;
		//Act
		this.oChart.$().focus().click();
		//Assert
		assert.equal(this.oPressHandler.callCount, 0, "Chart press handler not called in disabled mode.");
	});

	/* --------------------------------------- */
	/* API methods tests                       */
	/* --------------------------------------- */
	QUnit.module("API methods tests", {
		beforeEach : function() {
			this.oChart = new InteractiveBarChart({
				bars: [
					new InteractiveBarChartBar({selected: true}),
					new InteractiveBarChartBar()
				]
			});
			this.oChart.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Method getSelectedBars - single selection", function(assert) {
		//Arrange
		var aBars = this.oChart.getBars(),
			aSelectedBars = this.oChart.getSelectedBars();
		//Assert
		assert.equal(aSelectedBars.length, 1, "One bar is selected");
		assert.equal(aSelectedBars[0].getSelected(), true, "First bar is selected");
		assert.equal(aSelectedBars[0].getId(), aBars[0].getId(), "First selected bar is the first bar of the aggregation bars");
	});

	QUnit.test("Method getSelectedBars - multiple selection", function(assert) {
		//Arrange
		this.oChart.addBar(new InteractiveBarChartBar({selected: true}));
		var aBars = this.oChart.getBars(),
			aSelectedBars = this.oChart.getSelectedBars();
		//Assert
		assert.equal(aSelectedBars.length, 2, "Two bars are selected");
		assert.equal(aSelectedBars[0].getSelected(), true, "First bar is selected");
		assert.equal(aSelectedBars[0].getId(), aBars[0].getId(), "First selected bar is the first bar of the aggregation bars");
		assert.equal(aSelectedBars[1].getId(), aBars[2].getId(), "Second selected bar is the third bar of the aggregation bars");
	});

	QUnit.test("Method setSelectedBars - single selection", function(assert) {
		//Arrange
		var aBars = this.oChart.getBars();
		//Act
		this.oChart.setSelectedBars(aBars[1]);
		//Assert
		assert.equal(aBars[0].getSelected(), false, "First bar is not selected");
		assert.equal(aBars[1].getSelected(), true, "Second bar is selected");
	});

	QUnit.test("Method setSelectedBars - multiple selection", function(assert) {
		//Arrange
		this.oChart.addBar(new InteractiveBarChartBar({selected: true}));
		this.oChart.addBar(new InteractiveBarChartBar());
		var aBars = this.oChart.getBars();
		//Act
		this.oChart.setSelectedBars([aBars[1],this.oChart.getBars()[3]]);
		//Assert
		assert.equal(aBars[0].getSelected(), false, "First bar is not selected");
		assert.equal(aBars[1].getSelected(), true, "Second bar is selected");
		assert.equal(aBars[2].getSelected(), false, "Third bar is not selected");
		assert.equal(aBars[3].getSelected(), true, "Fourth bar is selected");
	});

	QUnit.test("Method setSelectedBars - selection contains an invalid bar element", function(assert) {
		//Arrange
		var aBars = this.oChart.getBars(),
			oInvalidBar = new InteractiveBarChartBar({label: "invalidBar"});
		sinon.spy(Log, "warning");
		//Act
		this.oChart.setSelectedBars([aBars[1], oInvalidBar]);
		//Assert
		assert.equal(aBars[0].getSelected(), false, "First bar is not selected");
		assert.equal(aBars[1].getSelected(), true, "Second bar is selected");
		assert.equal(Log.warning.callCount, 1, "Warning logged once");
		assert.ok(Log.warning.calledWith("setSelectedBars method called with invalid InteractiveBarChartBar element"),
			"Warning logged with expected message");
		// Restore
		Log.warning.restore();
	});

	QUnit.test("Method setSelectedBars - selection contains an invalid object", function(assert) {
		//Arrange
		var aBars = this.oChart.getBars(),
			oInvalidElement = {label: "dummy"};
		sinon.spy(Log, "warning");
		//Act
		this.oChart.setSelectedBars([aBars[1], oInvalidElement]);
		//Assert
		assert.equal(aBars[0].getSelected(), false, "First bar is not selected");
		assert.equal(aBars[1].getSelected(), true, "Second bar is selected");
		assert.equal(Log.warning.callCount, 1, "Warning logged once");
		assert.ok(Log.warning.calledWith("setSelectedBars method called with invalid InteractiveBarChartBar element"),
			"Warning logged with expected message");
		// Restore
		Log.warning.restore();
	});

	QUnit.test("Method setSelectedBars - selection contains an array of two invalid objects only", function(assert) {
		//Arrange
		var aBars = this.oChart.getBars(),
			aArrayOfInvalidObjects = [{label: "dummy"}, "dummyText"];
		sinon.spy(Log, "warning");
		//Act
		this.oChart.setSelectedBars(aArrayOfInvalidObjects);
		//Assert
		assert.equal(aBars[0].getSelected(), false, "First bar is not selected");
		assert.equal(aBars[1].getSelected(), false, "Second bar is not selected");
		assert.equal(Log.warning.callCount, 2, "Warning logged once");
		assert.ok(Log.warning.calledWith("setSelectedBars method called with invalid InteractiveBarChartBar element"),
			"Warning logged with expected message");
		// Restore
		Log.warning.restore();
	});

	QUnit.test("Method setSelectedBars - attribute selectedBars is null", function(assert) {
		//Arrange
		var aBars = this.oChart.getBars();
		//Act
		this.oChart.setSelectedBars(null);
		//Assert
		assert.equal(aBars[0].getSelected(), false, "First bar is not selected");
		assert.equal(aBars[1].getSelected(), false, "Second bar is not selected");
	});

	QUnit.test("Method setSelectedBars - attribute selectedBars is undefined", function(assert) {
		//Arrange
		var aBars = this.oChart.getBars();
		//Act
		this.oChart.setSelectedBars();
		//Assert
		assert.equal(aBars[0].getSelected(), false, "First bar is not selected");
		assert.equal(aBars[1].getSelected(), false, "Second bar is not selected");
	});

	QUnit.test("Method validateProperty for labelWidth - minimum", function(assert) {
		//Arrange

		//Act
		this.oChart.setLabelWidth("0%");
		var sLabelWidth = this.oChart.getLabelWidth();

		//Assert
		assert.equal(sLabelWidth, "0%", "Property labelWidth correctly set");
	});

	QUnit.test("Method validateProperty for labelWidth - maximum", function(assert) {
		//Arrange

		//Act
		this.oChart.setLabelWidth("100%");
		var sLabelWidth = this.oChart.getLabelWidth();
		//Assert
		assert.equal(sLabelWidth, "100%", "Property labelWidth correctly set");
	});

	QUnit.test("Method validateProperty for labelWidth - below minimum", function(assert) {
		//Arrange

		//Act
		this.oChart.setLabelWidth("-50%");
		var sLabelWidth = this.oChart.getLabelWidth();
		//Assert
		assert.equal(sLabelWidth, "40%", "Property labelWidth correctly set to default value");
	});

	QUnit.test("Method validateProperty for labelWidth - above maximum", function(assert) {
		//Arrange

		//Act
		this.oChart.setLabelWidth("150%");
		var sLabelWidth = this.oChart.getLabelWidth();
		//Assert
		assert.equal(sLabelWidth, "40%", "Property labelWidth correctly set to default value");
	});

	/* --------------------------------------- */
	/* Private methods tests                   */
	/* --------------------------------------- */
	QUnit.test("Method _deselectAllSelectedBars", function(assert) {
		//Act
		this.oChart._deselectAllSelectedBars();
		//Assert
		assert.equal(this.oChart.getBars()[0].getSelected(), false, "First bar is not selected");
		assert.equal(this.oChart.getBars()[1].getSelected(), false, "Second bar is not selected");
	});

	QUnit.test("Method _toggleSelected", function(assert) {
		//Arrange
		this.oChart.addBar(new InteractiveBarChartBar());
		this.oChart.addBar(new InteractiveBarChartBar({selected: true}));
		var aBars = this.oChart.getBars();
		//Act
		this.oChart._toggleSelected(2);
		//Assert
		assert.equal(aBars[0].getSelected(), true, "First bar is selected, selection was not changed");
		assert.equal(aBars[1].getSelected(), false, "Second bar is not selected, selection was not changed");
		assert.equal(aBars[2].getSelected(), true, "Third bar is selected, selection was updated");
		assert.equal(aBars[3].getSelected(), true, "Fourth bar is selected, selection was not changed");
	});

	QUnit.test("Method _toggleSelected from selected to not selected", function(assert) {
		//Arrange
		var $interactionArea0 = this.oChart.$("interactionArea-0");
		$interactionArea0.addClass("sapSuiteIBCBarSelected");
		//Act
		this.oChart._toggleSelected(0);
		//Assert
		assert.equal($interactionArea0.hasClass("sapSuiteIBCBarSelected"), false, "Class sapSuiteIBCBarSelected toggled on the first bar");
	});

	QUnit.test("Method _toggleSelected from not selected to selected", function(assert) {
		//Arrange
		var $interactionArea1 = this.oChart.$("interactionArea-1");
		//Act
		this.oChart._toggleSelected(1);
		//Assert
		assert.ok($interactionArea1.hasClass("sapSuiteIBCBarSelected"), "Class sapSuiteIBCBarSelected toggled on the second bar");
	});

	QUnit.test("Method _calcPercent", function(assert) {
		//Arrange
		var fDeltaValue = 100,
			fChartEdgeValue = 0,
			fSpaceValuePercent = 1,
			fSpaceValuePixel = 100;
		//Act
		var fBarValue = 0;
		var sCalcPercent1 = this.oChart._calcPercent(fBarValue, fDeltaValue, fChartEdgeValue, fSpaceValuePercent, fSpaceValuePixel);
		fBarValue = 100;
		var sCalcPercent2 = this.oChart._calcPercent(fBarValue, fDeltaValue, fChartEdgeValue, fSpaceValuePercent, fSpaceValuePixel);
		fBarValue = 0.1;
		var sCalcPercent3 = this.oChart._calcPercent(fBarValue, fDeltaValue, fChartEdgeValue, fSpaceValuePercent, fSpaceValuePixel);
		//Assert
		assert.equal(sCalcPercent1, "0.00000%", "The calculation returned 0%");
		assert.equal(sCalcPercent2, "100.00000%", "The calculation returned 100%");
		assert.equal(sCalcPercent3, "0.10000%", "The calculation returned 0.1%");
	});

	/* --------------------------------------- */
	/* ValueLabel positions                    */
	/* --------------------------------------- */
	QUnit.module("ValueLabel positions", {
		beforeEach : function() {
			this.oChart = new InteractiveBarChart({
				min: -100,
				max: 100,
				displayedBars: 100,
				bars: [
					{label : "small positive value label", value : 50, displayedValue : "small"},
					{label : "long positive value label", value : 50, displayedValue : "long positive value label xxxxxxxxxxxxxxxxxxxxxxxxxxxx"},
					{label : "small negative value label", value : -50, displayedValue : "small"},
					{label : "long negative value label", value : -50, displayedValue : "long negative value label xxxxxxxxxxxxxxxxxxxxxxxxxxxx"},
					{label : "zero value label", value : 0, displayedValue : "random lengh zero value"},
					{label : "minimal positive value label", value : 0.001, displayedValue : "random positive value label"},
					{label : "minimal negative value label", value : -0.001, displayedValue : "random negative value label"},
					{label : "null value label"}
				]
			});
			this.oFlexBox = new FlexBox("flexbox", {
				width: "400px",
				height: "5000px",
				items: [this.oChart]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oChart.destroy();
			this.oChart = null;
			this.oFlexBox.destroy();
			this.oFlexBox = null;
		}
	});

	QUnit.test("show labels outside", function(assert) {
		//Arrange

		//Act

		//Assert
		var aDisplayedValues = this.oChart.$().find(".sapSuiteIBCBarValue");
		assert.notOk(aDisplayedValues.eq(0).hasClass("sapSuiteIBCBarValueOutside"), "The valuelabel is shown inside the bar");
		assert.ok(aDisplayedValues.eq(1).hasClass("sapSuiteIBCBarValueOutside"), "The valuelabel is shown outside the bar");
		assert.notOk(aDisplayedValues.eq(2).hasClass("sapSuiteIBCBarValueOutside"), "The valuelabel is shown inside the bar");
		assert.ok(aDisplayedValues.eq(3).hasClass("sapSuiteIBCBarValueOutside"), "The valuelabel is shown outside the bar");
		assert.ok(aDisplayedValues.eq(4).hasClass("sapSuiteIBCBarValueOutside"), "The valuelabel is shown outside the bar for zero value bars");
		assert.ok(aDisplayedValues.eq(5).hasClass("sapSuiteIBCBarValueOutside"), "The valuelabel is shown outside the bar");
		assert.ok(aDisplayedValues.eq(6).hasClass("sapSuiteIBCBarValueOutside"), "The valuelabel is shown outside the bar");
		assert.ok(aDisplayedValues.eq(7).hasClass("sapSuiteIBCBarValueOutside"), "The valuelabel is shown outside the bar for null values");
	});

	QUnit.test("show labels outside - FullWidth", function(assert) {
		//Arrange
		this.oChart.setLabelWidth("0%");
		this.oChart.setMin(-101);
		sap.ui.getCore().applyChanges();
		//Act

		//Assert
		var aDisplayedValues = this.oChart.$().find(".sapSuiteIBCBarValue");

		assert.notOk(aDisplayedValues.eq(0).hasClass("sapSuiteIBCBarValueOutside"), "The valuelabel is shown inside the bar");
		assert.ok(aDisplayedValues.eq(1).hasClass("sapSuiteIBCBarValueOutside"), "The valuelabel is shown outside the bar");
		assert.notOk(aDisplayedValues.eq(2).hasClass("sapSuiteIBCBarValueOutside"), "The valuelabel is shown inside the bar");
		assert.ok(aDisplayedValues.eq(3).hasClass("sapSuiteIBCBarValueOutside"), "The valuelabel is shown outside the bar");
		assert.ok(aDisplayedValues.eq(4).hasClass("sapSuiteIBCBarValueOutside"), "The valuelabel is shown outside the bar for zero value bars");
		assert.ok(aDisplayedValues.eq(5).hasClass("sapSuiteIBCBarValueOutside"), "The valuelabel is shown outside the bar");
		assert.ok(aDisplayedValues.eq(6).hasClass("sapSuiteIBCBarValueOutside"), "The valuelabel is shown outside the bar");
		assert.ok(aDisplayedValues.eq(7).hasClass("sapSuiteIBCBarValueOutside"), "The valuelabel is shown outside the bar for null values");
	});

	/* --------------------------------------- */
	/* Bar tests                               */
	/* --------------------------------------- */
	QUnit.module("Bar width", {
		beforeEach : function() {
			this.oChart = new InteractiveBarChart({
				min: 0,
				max: 0,
				displayedBars: 100,
				bars: [
					{label : "positive value", value : 100, displayedValue : "100%"},
					{label : "negative value", value : -100, displayedValue : "-100%"},
					{label : "zero value", value : 0, displayedValue : "0%"},
					{label : "minimal positive", value : 0.001, displayedValue : "0.0001"},
					{label : "minimal negative", value : -0.001, displayedValue : "-0.0001"},
					{label : "surpassed positive", value : 222, displayedValue : "222"},
					{label : "surpassed negative", value : -222, displayedValue : "-222"},
					{label : "null value"}
				]
			});
			this.oFlexBox = new FlexBox("flexbox", {
				width: "500px",
				height: "5000px",
				items: [this.oChart]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oChart.destroy();
			this.oChart = null;
			this.oFlexBox.destroy();
			this.oFlexBox = null;
		}
	});

	QUnit.test("Positive values", function(assert) {
		//Arrange
		this.oChart.setMin(0);
		this.oChart.setMax(100);
		sap.ui.getCore().applyChanges();
		//Act

		//Assert
		var $BarsPositive = this.oChart.$().find(".sapSuiteIBCBarPositive"),
			aDisplayedValues = this.oChart.$().find(".sapSuiteIBCBarValue");

		var oBarContainerPositive = this.oChart.$().find(".sapSuiteIBCBarWrapperPositive");
		var oBarContainerNegative = this.oChart.$().find(".sapSuiteIBCBarWrapperNegative");

		assert.ok(oBarContainerPositive.eq(0).width() > 0, "The positive space is visible");
		assert.equal(oBarContainerNegative.eq(0).width(), 0, "The negative space is invisible");

		assert.equal($BarsPositive.eq(0).width(), oBarContainerPositive.width(), "The bar takes up the whole width");
		assert.equal($BarsPositive.eq(1).width(), 0, "The bar takes up no width in the positive space");
		assert.equal($BarsPositive.eq(2).width(), 0, "Zero value should never take up any positive or negative width");
		assert.equal($BarsPositive.eq(3).width(), 1, "A very small positive value should take up at least one pixel in the positive space");
		assert.equal($BarsPositive.eq(4).width(), 0, "The bar takes up no width in the positive space");
		assert.equal($BarsPositive.eq(5).width(), oBarContainerPositive.width(), "The bar takes up the whole width");
		assert.equal($BarsPositive.eq(6).width(), 0, "The bar takes up no width in the positive space");
		assert.equal($BarsPositive.eq(7).width(), 0, "The null value should never take up any width");

		// All negative wrappers should have a width of 0
		oBarContainerNegative.each(function() {
			assert.equal(jQuery(this).width(), 0, "With no negative space, the bar should not occupy any width");
		});

		assert.notEqual(aDisplayedValues.eq(0).css("visibility"), "hidden", "In case of positive values and enough space the valuelabel is visible.");
		assert.equal(aDisplayedValues.eq(1).css("visibility"), "hidden", "In case of negative values the valuelabel is invisible.");
		assert.notEqual(aDisplayedValues.eq(2).css("visibility"), "hidden", "In case of the zero value and enough space the valuelabel is visible.");
		assert.notEqual(aDisplayedValues.eq(3).css("visibility"), "hidden", "In case of positive values and enough space the valuelabel is visible.");
		assert.equal(aDisplayedValues.eq(4).css("visibility"), "hidden", "In case of negative values the valuelabel should is invisible.");
		assert.notEqual(aDisplayedValues.eq(5).css("visibility"), "hidden", "In case of positive values and enough space the valuelabel is visible.");
		assert.equal(aDisplayedValues.eq(6).css("visibility"), "hidden", "In case of negative values the valuelabel is invisible.");
		assert.notEqual(aDisplayedValues.eq(7).css("visibility"), "hidden", "N/A label is always visible");
	});

	QUnit.test("Negative values", function(assert) {
		//Arrange
		this.oChart.setMin(-100);
		this.oChart.setMax(0);
		sap.ui.getCore().applyChanges();
		//Act

		//Assert
		var $BarsNegative = this.oChart.$().find(".sapSuiteIBCBarNegative"),
			aDisplayedValues = this.oChart.$().find(".sapSuiteIBCBarValue");

		var oBarContainerPositive = this.oChart.$().find(".sapSuiteIBCBarWrapperPositive");
		var oBarContainerNegative = this.oChart.$().find(".sapSuiteIBCBarWrapperNegative");

		assert.equal(oBarContainerPositive.eq(0).width(), 0, "The positive space is invisible");
		assert.ok(oBarContainerNegative.eq(0).width() > 0, "The negative space is visible");

		assert.equal($BarsNegative.eq(0).width(), 0, "The bar takes up no width in the negative space");
		assert.equal($BarsNegative.eq(1).width(), oBarContainerNegative.width(), "The bar takes up the whole width");
		assert.equal($BarsNegative.eq(2).width(), 0, "Zero value should never take up any positive or negative width");
		assert.equal($BarsNegative.eq(3).width(), 0, "The bar takes up no width in the negative space");
		assert.equal($BarsNegative.eq(4).width(), 1, "A very small negative value should take up at least one pixel in the negative space");
		assert.equal($BarsNegative.eq(5).width(), 0, "The bar takes up no width in the negative space");
		assert.equal($BarsNegative.eq(6).width(), oBarContainerNegative.width(), "The bar takes up the whole width");
		assert.equal($BarsNegative.eq(7).width(), 0, "The null value should never take up any positive or negative width");

		// All positive wrappers should have a width of 0
		oBarContainerPositive.each(function() {
			assert.equal(jQuery(this).width(), 0, "With no positive space, the bar should not occupy any width");
		});

		assert.equal(aDisplayedValues.eq(0).css("visibility"), "hidden", "In case of positive values the valuelabel is invisible.");
		assert.notEqual(aDisplayedValues.eq(1).css("visibility"), "hidden", "In case of negative values and enough space the valuelabel is visible.");
		assert.notEqual(aDisplayedValues.eq(2).css("visibility"), "hidden", "In case of the zero value and enough space the valuelabel is visible.");
		assert.equal(aDisplayedValues.eq(3).css("visibility"), "hidden", "In case of positive values the valuelabel is invisible.");
		assert.notEqual(aDisplayedValues.eq(4).css("visibility"), "hidden", "In case of negative values and enough space the valuelabel is visible.");
		assert.equal(aDisplayedValues.eq(5).css("visibility"), "hidden", "In case of positive values the valuelabel is invisible.");
		assert.notEqual(aDisplayedValues.eq(6).css("visibility"), "hidden", "In case of negative values and enough space the valuelabel is visible.");
		assert.notEqual(aDisplayedValues.eq(7).css("visibility"), "hidden", "N/A label is always visible");
	});

	QUnit.test("Mixed values", function(assert) {
		//Arrange
		this.oChart.setMin(-100);
		this.oChart.setMax(100);
		sap.ui.getCore().applyChanges();
		//Act

		//Assert
		var $BarsPositive = this.oChart.$().find(".sapSuiteIBCBarPositive"),
			$BarsNegative = this.oChart.$().find(".sapSuiteIBCBarNegative"),
			aDisplayedValues = this.oChart.$().find(".sapSuiteIBCBarValue");

		var oBarContainerPositive = this.oChart.$().find(".sapSuiteIBCBarWrapperPositive");
		var oBarContainerNegative = this.oChart.$().find(".sapSuiteIBCBarWrapperNegative");

		assert.ok(oBarContainerPositive.eq(0).width() > 0, "The positive space is visible");
		assert.ok(oBarContainerNegative.eq(0).width() > 0, "The negative space is visible");

		assert.equal($BarsNegative.eq(0).width(), 0, "The bar takes up no width in the negative space");
		assert.equal($BarsNegative.eq(1).width(), oBarContainerNegative.width(), "The bar takes up the whole width (negative)");
		assert.equal($BarsNegative.eq(2).width(), 0, "Zero value should never take up any positive or negative width");
		assert.equal($BarsNegative.eq(3).width(), 0, "The bar takes up no width in the negative space");
		assert.equal($BarsNegative.eq(4).width(), 1, "A very small negative value should take up at least one pixel in the negative space");
		assert.equal($BarsNegative.eq(5).width(), 0, "The bar takes up no width in the negative space");
		assert.equal($BarsNegative.eq(6).width(), oBarContainerNegative.width(), "The bar takes up the whole width (negative)");
		assert.equal($BarsNegative.eq(7).width(), 0, "The null value should never take up any positive or negative width");

		assert.equal($BarsPositive.eq(0)[0].style.width, "100%", "The bar takes up the whole width (first positive bar)");
		assert.equal($BarsPositive.eq(1).width(), 0, "The bar takes up no width in the positive space");
		assert.equal($BarsPositive.eq(2).width(), 0, "Zero value should never take up any positive or negative width");
		assert.equal($BarsPositive.eq(3).width(), 1, "A very small positive value should take up at least one pixel in the positive space");
		assert.equal($BarsPositive.eq(4).width(), 0, "The bar takes up no width in the positive space");
		assert.equal($BarsPositive.eq(5)[0].style.width, "100%", "The bar takes up the whole width (positive)");
		assert.equal($BarsPositive.eq(6).width(), 0, "The bar takes up no width in the positive space");
		assert.equal($BarsPositive.eq(7).width(), 0, "The null value should never take up any positive or negative width");

		for (var i = 0; i < this.oChart.getBars().length; i++) {
			assert.notEqual(aDisplayedValues.eq(i).css("visibility"), "hidden", "In case of mixed values and enough space the valuelabels are always visible.");
		}
	});

	QUnit.test("Bar borders", function(assert) {
		//Arrange
		this.oChart.setMin(-100);
		this.oChart.setMax(100);
		sap.ui.getCore().applyChanges();

		//Act
		var $BarsPositive = this.oChart.$().find(".sapSuiteIBCBarPositive"),
			$BarsNegative = this.oChart.$().find(".sapSuiteIBCBarNegative");

		//Assert
		assert.ok($BarsPositive.eq(0).hasClass("sapSuiteIBCValuePositive"), "Positive bar of positive value contains class sapSuiteIBCValuePositive");
		assert.ok($BarsPositive.eq(1).hasClass("sapSuiteIBCValueNegative"), "Positive bar of negative value contains class sapSuiteIBCValueNegative");
		assert.ok($BarsPositive.eq(2).hasClass("sapSuiteIBCBarValueNull"), "Positive bar of zero value contains class sapSuiteIBCBarValueNull");
		assert.ok($BarsPositive.eq(7).hasClass("sapSuiteIBCBarValueNull"), "Positive bar of N/A contains class sapSuiteIBCBarValueNull");
		assert.ok($BarsNegative.eq(0).hasClass("sapSuiteIBCValuePositive"), "Negative bar of positive value contains class sapSuiteIBCValuePositive");
		assert.ok($BarsNegative.eq(1).hasClass("sapSuiteIBCValueNegative"), "Negative bar of negative value contains class sapSuiteIBCValueNegative");
		assert.ok($BarsNegative.eq(2).hasClass("sapSuiteIBCBarValueNull"), "Negative bar of zero value contains class sapSuiteIBCBarValueNull");
		assert.ok($BarsNegative.eq(7).hasClass("sapSuiteIBCBarValueNull"), "Negative bar of N/A contains class sapSuiteIBCBarValueNull");
	});

	/* --------------------------------------- */
	/* Responsiveness tests                    */
	/* --------------------------------------- */
	QUnit.module("Responsiveness tests", {
		beforeEach : function() {
			this.oChart = new InteractiveBarChart({
				min: 0,
				max: 100,
				bars: [
					{label : "label", value : 90, displayedValue : "90%"}
				]
			});
			this.oFlexBox = new FlexBox("flexbox", {
				width: "300rem",
				height: "300rem",
				items: [this.oChart]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oChart.destroy();
			this.oChart = null;
			this.oFlexBox.destroy();
			this.oFlexBox = null;
		}
	});

	QUnit.test("Adjusting control paramaters in onAfterRendering", function(assert) {
		//Arrange
		sinon.spy(this.oChart, "_adjustToParent");
		//Act
		this.oChart.onAfterRendering();
		//Assert
		assert.ok(this.oChart._adjustToParent.calledOnce, "The adjusting function has been called once");
		// Restore
		this.oChart._adjustToParent.restore();
	});

	QUnit.test("Setting parent context paramaters in onBeforeRendering", function(assert) {
		//Act
		this.oChart.onBeforeRendering();
		//Assert
		assert.ok(this.oChart.data("_parentRenderingContext") , "The parent context has been set");
		assert.equal(this.oChart.data("_parentRenderingContext"), this.oFlexBox, "A correct control has been set as parent context");
	});

	QUnit.test("Vertical: Normal state", function(assert) {
		//Arrange
		var bSmallFont = this.oChart.$().hasClass("sapSuiteIBCSmallFont");
		//Assert
		assert.equal(bSmallFont, false, "No small font is used");
	});

	QUnit.test("Vertical: Setting bar smaller", function(assert) {
		//Arrange
		var iAreaHeightInitial = this.oChart.$("interactionArea-0").outerHeight();
		this.oChart.$().height("2.5rem");
		//Act
		this.oChart._onResize();
		//Assert
		var iAreaHeight = this.oChart.$("interactionArea-0").outerHeight();
		assert.ok(iAreaHeight < iAreaHeightInitial, "Area height is decreased for smaller container height");
	});

	QUnit.test("Vertical: Setting font smaller", function(assert) {
		//Arrange
		this.oChart.$().height("1.7rem");
		//Act
		this.oChart._onResize();
		//Assert
		var bSmallFont = this.oChart.$().hasClass("sapSuiteIBCSmallFont");
		assert.equal(bSmallFont, true, "Font size is decreased");
	});

	QUnit.test("Vertical: Hide bar's label", function(assert) {
		//Arrange
		this.oChart.$().height("1.345rem");
		//Act
		this.oChart._onResize();
		//Assert
		var $ActiveArea = this.oChart.$().find(".sapSuiteIBCBarInteractionArea[tabindex='0']");
		var sBarLabelDisplay = this.oChart.$().find(".sapSuiteIBCBarValue").css("visibility");
		var sAreaDisplay = this.oChart.$().css("visibility");
		var bInteractiveMode = this.oChart._bInteractiveMode;
		assert.equal(sBarLabelDisplay, "hidden", "Bar label is hidden");
		assert.ok(sAreaDisplay !== "hidden", "Area label is visible");
		assert.equal(bInteractiveMode, false, "Non-interactive mode is active");
		assert.equal(this.oChart.$().hasClass("sapSuiteIBCNonInteractive"), true, "The chart is non-interactive");
		assert.ok(!$ActiveArea.attr("tabindex"), "No area has tabindex in non-interactive mode");
		assert.equal(this.oChart.$().attr("tabindex"), 0, "The whole chart has tabindex in non-interactive mode");
	});

	QUnit.test("Vertical: Interactive mode", function(assert) {
		//Arrange
		//Act
		//Assert
		var $Chart = this.oChart.$();
		var $ActiveArea = $Chart.find(".sapSuiteIBCBarInteractionArea[tabindex='0']");
		var bInteractiveMode = this.oChart._bInteractiveMode;
		assert.equal(bInteractiveMode, true, "Interactive mode is active");
		assert.equal($Chart.hasClass("sapSuiteIBCNonInteractive"), false, "The chart is interactive");
		assert.equal($ActiveArea.length, 1, "First area has tabindex in interactive mode");
		assert.ok(!$Chart.attr("tabindex"), "The whole chart has no tabindex in interactive mode");
		assert.equal($Chart.attr("role"), "listbox", "The chart role is <listbox>");
		assert.equal($Chart.attr("aria-multiselectable"), "true", "The chart is multiselectable");
	});

	QUnit.test("Vertical: Non-Interactive mode", function(assert) {
		//Arrange
		this.oChart.$().height("1.5rem");
		//Act
		this.oChart._onResize();
		//Assert
		var $Chart = this.oChart.$();
		var $ActiveArea = $Chart.find(".sapSuiteIBCBarInteractionArea[tabindex='0']");
		var bInteractiveMode = this.oChart._bInteractiveMode;
		assert.equal(bInteractiveMode, false, "Non-interactive mode is active");
		assert.equal($Chart.hasClass("sapSuiteIBCNonInteractive"), true, "The chart is non-interactive");
		assert.equal($ActiveArea.length, 0, "No area has tabindex in non-interactive mode");
		assert.equal($Chart.attr("tabindex"), 0, "The whole chart has tabindex in non-interactive mode");
		assert.equal($Chart.attr("role"), "button", "The chart role is <button>");
		assert.equal($Chart.attr("aria-multiselectable"), "false", "The chart is not multiselectable");
	});

	QUnit.test("Vertical: Interactive mode (after non-interactive)", function(assert) {
		//Arrange
		//Act
		this.oChart.$().height("1.5rem");
		this.oChart._onResize();
		this.oChart.$().height("50rem");
		this.oChart._onResize();
		//Assert
		var $Chart = this.oChart.$();
		var $ActiveArea = $Chart.find(".sapSuiteIBCBarInteractionArea[tabindex='0']");
		var bInteractiveMode = this.oChart._bInteractiveMode;
		assert.equal(bInteractiveMode, true, "Interactive mode is active");
		assert.equal($Chart.hasClass("sapSuiteIBCNonInteractive"), false, "The chart is interactive");
		assert.equal($ActiveArea.length, 1, "First area has tabindex in interactive mode");
		assert.ok(!$Chart.attr("tabindex"), "The whole chart has no tabindex in interactive mode");
		assert.equal($Chart.attr("role"), "listbox", "The chart role is <listbox>");
		assert.equal($Chart.attr("aria-multiselectable"), "true", "The chart is multiselectable");
	});

	QUnit.test("Vertical: Hide chart", function(assert) {
		//Arrange
		this.oChart.$().height("1rem");
		//Act
		this.oChart._onResize();
		//Assert
		var sAreaDisplay = this.oChart.$().css("visibility");
		assert.equal(sAreaDisplay, "hidden", "Chart is hidden");
	});

	QUnit.test("Horizontal: Normal state", function(assert) {
		//Arrange
		var sAreaDisplay = this.oChart.$().css("visibility");
		var bLabelFullWidth = this.oChart.$().hasClass("sapSuiteIBCFullWidth");
		var bSmallFont = this.oChart.$().hasClass("sapSuiteIBCSmallFont");
		//Assert
		assert.equal(bSmallFont, false, "No small font is used");
		assert.equal(bLabelFullWidth, false, "The label is not in full width mode");
		assert.ok(sAreaDisplay !== "hidden", "The area is visible");
	});

	QUnit.test("Horizontal: Setting font smaller", function(assert) {
		//Arrange
		this.oChart.$().width("280px");
		//Act
		this.oChart._onResize();
		//Assert
		var bSmallFont = this.oChart.$().hasClass("sapSuiteIBCSmallFont");
		assert.ok(bSmallFont, "Font size is decreased");
	});

	QUnit.test("Horizontal: Move labels above the bars", function(assert) {
		//Arrange
		this.oChart.$().width("70px");
		//Act
		this.oChart.getBars()[0].setDisplayedValue("very long long label label label");
		this.oChart._onResize();
		//Assert
		var bLabelFullWidth = this.oChart.$().hasClass("sapSuiteIBCFullWidth");
		assert.equal(bLabelFullWidth, true, "The labels are in full width mode");
	});

	QUnit.test("Horizontal: Hide bar's label when labels are above", function(assert) {
		//Arrange
		this.oChart.$().height("1.345rem");
		this.oChart.$().width("140px");
		//Act
		this.oChart._onResize();
		//Assert
		var sBarLabelDisplay = this.oChart.$().find(".sapSuiteIBCBarValue").css("visibility");
		var sAreaDisplay = this.oChart.$().css("visibility");
		var bInteractiveMode = this.oChart._bInteractiveMode;
		assert.equal(sBarLabelDisplay, "hidden", "Bar label is hidden");
		assert.ok(sAreaDisplay !== "hidden", "Area label is visible");
		assert.equal(bInteractiveMode, false, "Selection area is disabled: non-interactive mode activated");
	});

	QUnit.test("Horizontal: Hide chart", function(assert) {
		//Arrange
		this.oChart.$().width("129px");
		//Act
		this.oChart._onResize();
		//Assert
		var sAreaDisplay = this.oChart.$().css("visibility");
		assert.equal(sAreaDisplay, "hidden", "Chart is hidden");
	});

	/* --------------------------------------- */
	/* Responsiveness tests (compact)          */
	/* --------------------------------------- */
	QUnit.module("Responsiveness tests for compact mode", {
		beforeEach : function() {
			this.oChart = new InteractiveBarChart({
				min: 0,
				max: 100,
				bars: [
					{label : "label", value : 90, displayedValue : "90%"}
				]
			});
			this.oFlexBox = new FlexBox("flexbox", {
				width: "30rem",
				height: "30rem",
				items: [this.oChart]
			}).placeAt("qunit-fixture");
			this.oFlexBox.addStyleClass("sapUiSizeCompact");
			sap.ui.getCore().applyChanges();
			this.oChart._handleThemeApplied();
			this.oAttachIntervalTimer = sinon.spy(IntervalTrigger.prototype, "addListener");
		},
		afterEach : function() {
			this.oChart.destroy();
			this.oChart = null;
			this.oFlexBox.destroy();
			this.oFlexBox = null;
			this.oAttachIntervalTimer.restore();
		}
	});

	QUnit.test("Attached interval timer after rendering", function(assert) {
		//Arrange
		//Act
		this.oChart.invalidate();
		sap.ui.getCore().applyChanges();
		//Assert
		assert.ok(this.oAttachIntervalTimer.callCount !== 0, "the handler was attached");
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

	QUnit.test("Vertical: Normal state", function(assert) {
		//Arrange
		var bSmallFont = this.oChart.$().hasClass("sapSuiteIBCSmallFont");
		//Assert
		assert.equal(bSmallFont, false, "No small font is used (compact mode)");
	});

	QUnit.test("Vertical: Setting bar smaller", function(assert) {
		//Arrange
		var iAreaHeightInitial = this.oChart.$("interactionArea-0").outerHeight();
		this.oChart.$().height("2.125rem");
		//Act
		this.oChart._onResize();
		//Assert
		var iAreaHeight = this.oChart.$("interactionArea-0").outerHeight();
		assert.ok(iAreaHeight < iAreaHeightInitial, "Area height is decreased for smaller container height");
	});

	QUnit.test("Vertical: Setting font smaller", function(assert) {
		//Arrange
		this.oChart.$().height("1.5rem");
		//Act
		this.oChart._onResize();
		//Assert
		var bSmallFont = this.oChart.$().hasClass("sapSuiteIBCSmallFont");
		assert.ok(bSmallFont, "Font size is decreased for compact mode");
	});

	QUnit.test("Vertical: Hide bar's label", function(assert) {
		//Arrange
		this.oChart.$().height("1.2rem");
		//Act
		this.oChart._onResize();
		//Assert
		var sBarLabelDisplay = this.oChart.$().find(".sapSuiteIBCBarValue").css("visibility");
		var bInteractiveCssClass = this.oChart.$().hasClass("sapSuiteIBCNonInteractive");
		var bInteractiveMode = this.oChart._bInteractiveMode;
		assert.equal(sBarLabelDisplay, "hidden", "Bar label is hidden for compact mode");
		assert.equal(bInteractiveMode, false, "Non-interactive mode activated for compact mode");
		assert.equal(bInteractiveCssClass, true, "Non-interactive css class present for compact mode");
	});

	QUnit.test("Vertical: Hide chart", function(assert) {
		//Arrange
		this.oChart.$().height("1rem");
		//Act
		this.oChart._onResize();
		//Assert
		var sAreaDisplay = this.oChart.$().css("visibility");
		assert.equal(sAreaDisplay, "hidden", "Chart is hidden for compact mode");
	});

	QUnit.test("Horizontal: Normal state", function(assert) {
		//Arrange
		var sAreaDisplay = this.oChart.$().css("visibility");
		var bSmallFont = this.oChart.$().hasClass("sapSuiteIBCSmallFont");
		var bLabelFullWidth = this.oChart.$().hasClass("sapSuiteIBCFullWidth");
		//Assert
		assert.equal(bSmallFont, false, "No small font is used (compact mode)");
		assert.equal(bLabelFullWidth, false, "The label is not in full width mode (compact)");
		assert.ok(sAreaDisplay !== "hidden", "The area is visible (compact mode)");
	});

	QUnit.test("Horizontal: Setting font smaller", function(assert) {
		//Arrange
		this.oChart.$().width("280px");
		//Act
		this.oChart._onResize();
		//Assert
		var bSmallFont = this.oChart.$().hasClass("sapSuiteIBCSmallFont");
		assert.ok(bSmallFont, "Font size is decreased for compact mode");
	});

	QUnit.test("Horizontal: Move labels above the bars", function(assert) {
		//Arrange
		this.oChart.$().width("70px");
		//Act
		this.oChart.getBars()[0].setDisplayedValue("very long long label label label");
		this.oChart._onResize();
		//Assert
		var bLabelFullWidth = this.oChart.$().hasClass("sapSuiteIBCFullWidth");
		assert.equal(bLabelFullWidth, true, "The labels are in full width mode (compact)");
	});

	QUnit.test("Horizontal: Hide chart", function(assert) {
		//Arrange
		this.oChart.$().width("129px");
		//Act
		this.oChart._onResize();
		//Assert
		var sAreaDisplay = this.oChart.$().css("visibility");
		assert.equal(sAreaDisplay, "hidden", "Chart is hidden for compact mode");
	});

	/* --------------------------------------- */
	/* Missing or Wrong Data Tests             */
	/* --------------------------------------- */
	QUnit.module("Missing or Wrong Data Tests", {
		beforeEach : function() {
			this.oChart = new InteractiveBarChart({
				bars: [
					new InteractiveBarChartBar()
				]
			});
			this.oChart.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("No min provided - positive max provided", function(assert) {
		//Arrange
		this.oChart.setMax(100);
		this.oChart.getBars()[0].setValue(50);
		sap.ui.getCore().applyChanges();
		var $bar0 = this.oChart.$("bar-positive-0"),
			$BarsPositive = this.oChart.$().find(".sapSuiteIBCBarPositive"),
			oBarContainerPositive = this.oChart.$().find(".sapSuiteIBCBarWrapperPositive"),
			oBarContainerNegative = this.oChart.$().find(".sapSuiteIBCBarWrapperNegative");
		//Assert
		assert.equal($bar0.length, 1, "The bar is rendered");
		assert.ok(oBarContainerPositive.eq(0).width() > 0, "The positive space is visible");
		assert.ok(oBarContainerNegative.eq(0).width() === 0, "The negative space is not visible");
		assert.equal($BarsPositive.eq(0)[0].style.width, "50%", "The bar takes up the correct space");
	});

	QUnit.test("No min provided - negative max provided", function(assert) {
		//Arrange
		this.oChart.setMax(-100);
		this.oChart.getBars()[0].setValue(-150);
		sap.ui.getCore().applyChanges();
		var $bar0 = this.oChart.$("bar-negative-0"),
			$BarsNegative = this.oChart.$().find(".sapSuiteIBCBarNegative"),
			oBarContainerPositive = this.oChart.$().find(".sapSuiteIBCBarWrapperPositive"),
			oBarContainerNegative = this.oChart.$().find(".sapSuiteIBCBarWrapperNegative");
		//Assert
		assert.equal($bar0.length, 1, "The bar is rendered");
		assert.ok(oBarContainerPositive.eq(0).width() === 0, "The positive space is not visible");
		assert.ok(oBarContainerNegative.eq(0).width() > 0, "The negative space is visible");
		assert.equal($BarsNegative.eq(0)[0].style.width, "100%", "The bar takes up the correct space");
	});

	QUnit.test("No max provided - positive min provided", function(assert) {
		//Arrange
		this.oChart.setMin(100);
		this.oChart.getBars()[0].setValue(150);
		sap.ui.getCore().applyChanges();
		var $bar0 = this.oChart.$("bar-positive-0"),
			$BarsPositive = this.oChart.$().find(".sapSuiteIBCBarPositive"),
			oBarContainerPositive = this.oChart.$().find(".sapSuiteIBCBarWrapperPositive"),
			oBarContainerNegative = this.oChart.$().find(".sapSuiteIBCBarWrapperNegative");
		//Assert
		assert.equal($bar0.length, 1, "The bar is rendered");
		assert.ok(oBarContainerPositive.eq(0).width() > 0, "The positive space is visible");
		assert.ok(oBarContainerNegative.eq(0).width() === 0, "The negative space is not visible");
		assert.equal($BarsPositive.eq(0)[0].style.width, "100%", "The bar takes up the correct space");
	});

	QUnit.test("No max provided - negative min provided", function(assert) {
		//Arrange
		this.oChart.setMin(-100);
		this.oChart.getBars()[0].setValue(-150);
		sap.ui.getCore().applyChanges();
		var $bar0 = this.oChart.$("bar-negative-0"),
			$BarsNegative = this.oChart.$().find(".sapSuiteIBCBarNegative"),
			oBarContainerPositive = this.oChart.$().find(".sapSuiteIBCBarWrapperPositive"),
			oBarContainerNegative = this.oChart.$().find(".sapSuiteIBCBarWrapperNegative");
		//Assert
		assert.equal($bar0.length, 1, "The bar is rendered");
		assert.ok(oBarContainerPositive.eq(0).width() === 0, "The positive space is not visible");
		assert.ok(oBarContainerNegative.eq(0).width() > 0, "The negative space is visible");
		assert.equal($BarsNegative.eq(0)[0].style.width, "100%", "The bar takes up the correct space");
	});

	QUnit.test("No min, no max provided - positive bar value provided", function(assert) {
		//Arrange
		this.oChart.getBars()[0].setValue(77);
		sap.ui.getCore().applyChanges();
		var $bar0 = this.oChart.$("bar-positive-0"),
			$BarsPositive = this.oChart.$().find(".sapSuiteIBCBarPositive"),
			oBarContainerPositive = this.oChart.$().find(".sapSuiteIBCBarWrapperPositive"),
			oBarContainerNegative = this.oChart.$().find(".sapSuiteIBCBarWrapperNegative");
		//Assert
		assert.equal($bar0.length, 1, "The bar is rendered");
		assert.ok(oBarContainerPositive.eq(0).width() > 0, "The positive space is visible");
		assert.ok(oBarContainerNegative.eq(0).width() === 0, "The negative space is not visible");
		assert.equal($BarsPositive.eq(0)[0].style.width, "100%", "The bar takes up the correct space");
	});

	QUnit.test("No min, no max provided - negative bar value provided", function(assert) {
		//Arrange
		this.oChart.getBars()[0].setValue(-77);
		sap.ui.getCore().applyChanges();
		var $bar0 = this.oChart.$("bar-negative-0"),
			$BarsNegative = this.oChart.$().find(".sapSuiteIBCBarNegative"),
			oBarContainerPositive = this.oChart.$().find(".sapSuiteIBCBarWrapperPositive"),
			oBarContainerNegative = this.oChart.$().find(".sapSuiteIBCBarWrapperNegative");
		//Assert
		assert.equal($bar0.length, 1, "The bar is rendered");
		assert.ok(oBarContainerPositive.eq(0).width() === 0, "The positive space is not visible");
		assert.ok(oBarContainerNegative.eq(0).width() > 0, "The negative space is visible");
		assert.equal($BarsNegative.eq(0)[0].style.width, "100%", "The bar takes up the correct space");
	});

	QUnit.test("No value provided: bar width should be 0% and N/A displayed", function(assert) {
		//Arrange
		this.oChart.setMin(0);
		this.oChart.setMax(100);
		sap.ui.getCore().applyChanges();
		var $bar0 = this.oChart.$("bar-positive-0"),
			fBarWidth = $bar0.width();
		//Assert
		assert.equal(fBarWidth, 0, "The bar width is 0px");
		assert.equal(this.oChart.$("displayedValue-0").text(), this.oChart._oRb.getText("INTERACTIVECHART_NA"), "N/A is displayed");
	});

	QUnit.test("Min is negative, max is positive: positive bar should be rendered", function(assert) {
		//Arrange
		this.oChart.setMin(-20);
		this.oChart.setMax(100);
		this.oChart.getBars()[0].setValue(50);
		sap.ui.getCore().applyChanges();
		var $bar0 = this.oChart.$("bar-positive-0");
		//Assert
		assert.equal($bar0.length, 1, "Bar is rendered");
	});

	QUnit.test("Min and Max is negative: negative bar should be rendered", function(assert) {
		//Arrange
		this.oChart.setMin(-100);
		this.oChart.setMax(-20);
		this.oChart.getBars()[0].setValue(-50);
		sap.ui.getCore().applyChanges();
		var $bar0 = this.oChart.$("bar-negative-0");
		//Assert
		assert.equal($bar0.length, 1, "Bar is rendered");
	});

	QUnit.test("Min is negative: bar width should be 0% and N/A displayed", function(assert) {
		//Arrange
		this.oChart.setMin(-100);
		this.oChart.setMax(0);
		sap.ui.getCore().applyChanges();
		var $bar0 = this.oChart.$("bar-negative-0"),
			fBarWidth = $bar0.width();
		//Assert
		assert.equal(fBarWidth, 0, "The bar width is 0px");
		assert.equal(this.oChart.$("displayedValue-0").text(), this.oChart._oRb.getText("INTERACTIVECHART_NA"), "N/A is displayed");
	});

	QUnit.test("Min is larger than Max: no bar should be rendered", function(assert) {
		//Arrange
		this.oChart.setMin(100);
		this.oChart.setMax(20);
		this.oChart.getBars()[0].setValue(50);
		sap.ui.getCore().applyChanges();
		var $bar0 = this.oChart.$("bar-positive-0");
		//Assert
		assert.equal($bar0.length, 0, "No bar is rendered");
	});

	QUnit.test("DisplayedValue is empty: Value should be displayed", function(assert) {
		//Arrange
		this.oChart.setMin(0);
		this.oChart.setMax(100);
		this.oChart.getBars()[0].setValue(50);
		sap.ui.getCore().applyChanges();
		var $displayedValue = this.oChart.$("displayedValue-0");
		//Assert
		assert.equal($displayedValue.text(), "50", "Value is displayed if no displayedValue is provided");
	});

	/* --------------------------------------- */
	/* ARIA Tests                              */
	/* --------------------------------------- */
	QUnit.module("ARIA tests", {
		beforeEach : function() {
			this.oChart = new InteractiveBarChart({
				min: 0,
				max: 100,
				bars: [
					new InteractiveBarChartBar({selected: true, label: "Label1", displayedValue: "20%", value: 20}),
					new InteractiveBarChartBar({label: "Label2", value: 50}),
					new InteractiveBarChartBar()
				]
			});
			this.oChart.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Bar rendering", function(assert) {
		//Arrange
		this.oChart.getBars()[1].setColor(ValueColor.Good);
		sap.ui.getCore().applyChanges();
		//Act
		var $Bar1 = this.oChart.$().find(".sapSuiteIBCBarInteractionArea").eq(0);
		var $Bar2 = this.oChart.$().find(".sapSuiteIBCBarInteractionArea").eq(1);
		var $Bar3 = this.oChart.$().find(".sapSuiteIBCBarInteractionArea").eq(2);
		//Assert
		//bar1
		assert.equal($Bar1.attr("role"), "option", "The bar role is <option>");
		assert.equal($Bar1.attr("aria-label"), "Label1 20% " + this.oChart._oRb.getText("SEMANTIC_COLOR_NEUTRAL"), "The bar labelledby is correct");
		assert.equal($Bar1.attr("aria-selected"), "true", "The bar1 is selected");
		assert.equal($Bar1.attr("aria-posinset"), "1", "The bar1 posinset is correct");
		assert.equal($Bar1.attr("aria-setsize"), "3", "The chart setsize is correct");
		//bar2
		assert.equal($Bar2.attr("aria-label"), "Label2 50 " + this.oChart._oRb.getText("SEMANTIC_COLOR_GOOD"), "The bar labelledby is correct");
		assert.equal($Bar2.attr("aria-selected"), "false", "The bar2 is not selected");
		assert.equal($Bar2.attr("aria-posinset"), "2", "The bar2 posinset is correct");
		assert.equal($Bar2.attr("aria-setsize"), "3", "The chart setsize is correct");
		//bar3
		assert.equal($Bar3.attr("aria-label"), "N/A " + this.oChart._oRb.getText("SEMANTIC_COLOR_NEUTRAL"), "The bar labelledby is correct");
		assert.equal($Bar3.attr("aria-selected"), "false", "The bar3 is not selected");
		assert.equal($Bar3.attr("aria-posinset"), "3", "The bar3 posinset is correct");
		assert.equal($Bar3.attr("aria-setsize"), "3", "The chart setsize is correct");
	});

	QUnit.test("Chart rendering (interactive)", function(assert) {
		//Arrange
		//Act
		//Assert
		var $Chart = this.oChart.$();
		assert.equal($Chart.attr("role"), "listbox", "The chart role is <listbox>");
		assert.equal($Chart.attr("aria-multiselectable"), "true", "The chart is multiselectable");
		assert.equal($Chart.attr("aria-disabled"), "false", "The chart is not disabled");
		assert.equal(this.oChart._bInteractiveMode, true, "The chart is interactive");
		assert.equal($Chart.hasClass("sapSuiteIBCNonInteractive"), false, "The chart is interactive");
	});

	QUnit.test("Chart rendering (non-interactive)", function(assert) {
		//Arrange
		this.oChart.$().height("1.5rem");
		//Act
		this.oChart._onResize();
		//Assert
		var $Chart = this.oChart.$();
		assert.equal(this.oChart._bInteractiveMode, false, "The chart is non-interactive");
		assert.equal($Chart.attr("role"), "button", "The chart role is <button>");
		assert.equal($Chart.attr("aria-multiselectable"), "false", "The chart is not multiselectable");
		assert.equal($Chart.attr("aria-disabled"), "true", "The chart is disabled in non-interactive mode");
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
		var sDescribedBy = sId + "-interactionArea-0," + sId + "-interactionArea-1," + sId + "-interactionArea-2";
		//Act
		//Assert
		var $Chart = this.oChart.$();
		assert.equal($Chart.attr("aria-describedby"), sDescribedBy, "Chart has attribute aria-describedby to the associated area ids");
	});

	QUnit.test("Chart - disabled", function(assert) {
		//Arrange
		//Act
		this.oChart.setSelectionEnabled(false);
		sap.ui.getCore().applyChanges();
		//Assert
		var $Chart = this.oChart.$();
		assert.equal($Chart.attr("aria-disabled"), "true", "The chart is disabled");
	});

	QUnit.test("Bar - toggle selected", function(assert) {
		//Arrange
		var $Bar = this.oChart.$().find(".sapSuiteIBCBarInteractionArea").eq(0);
		var sBarSelectedInitial = $Bar.attr("aria-selected");
		//Act
		this.oChart._toggleSelected(0);
		//Assert
		var sBarSelected = $Bar.attr("aria-selected");
		assert.equal(sBarSelectedInitial, "true", "Initially, the first bar is selected");
		assert.equal(sBarSelected, "false", "Eventually, the first bar is not selected");
	});

	QUnit.test("The semantic marker is rendered correctly after the color property of the bar set to good", function(assert) {
		//Arrange
		this.oChart.getBars()[0].setColor(ValueColor.Good);

		//Act
		sap.ui.getCore().applyChanges();
		var $Marker = this.oChart.$().find(".sapSuiteIBCBarInteractionArea").find(".sapSuiteIBCSemanticMarker");

		//Assert
		assert.equal($Marker.length, 1, "Only one bar has semantic color");
		assert.ok($Marker.hasClass("sapSuiteIBCSemanticGood"), "The semantic color class has been applied correctly");
	});

	QUnit.test("The semantic marker is rendered correctly after the color property of the bar set to critical", function(assert) {
		//Arrange
		this.oChart.getBars()[0].setColor(ValueColor.Critical);

		//Act
		sap.ui.getCore().applyChanges();
		var $Marker = this.oChart.$().find(".sapSuiteIBCBarInteractionArea").find(".sapSuiteIBCSemanticMarker");

		//Assert
		assert.equal($Marker.length, 1, "Only one bar has semantic color");
		assert.ok($Marker.hasClass("sapSuiteIBCSemanticCritical"), "The semantic color class has been applied correctly");
	});

	QUnit.test("The semantic marker is rendered correctly after the color property of the bar set to error", function(assert) {
		//Arrange
		this.oChart.getBars()[0].setColor(ValueColor.Error);

		//Act
		sap.ui.getCore().applyChanges();
		var $Marker = this.oChart.$().find(".sapSuiteIBCBarInteractionArea").find(".sapSuiteIBCSemanticMarker");

		//Assert
		assert.equal($Marker.length, 1, "Only one bar has semantic color");
		assert.ok($Marker.hasClass("sapSuiteIBCSemanticError"), "The semantic color class has been applied correctly");
	});

	QUnit.module("Execution of functions onAfterRendering", {
		beforeEach: function() {
			this.oChart = new InteractiveBarChart({
				bars: [
					new InteractiveBarChartBar()
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

	QUnit.test("Visibility check", function(assert) {
		//Arrange
		var oSpyCheckControlIsVisible = sinon.spy(microchartLibrary, "_checkControlIsVisible");
		//Act
		this.oChart.onAfterRendering();
		//Assert
		assert.ok(oSpyCheckControlIsVisible.calledOnce, "Method _checkControlIsVisible has been called once.");
		oSpyCheckControlIsVisible.restore();
	});

	QUnit.test("Function check of _onControlIsVisible", function(assert) {
		//Arrange
		var oSpyCalcBarsWidth = sinon.spy(this.oChart, "_calcBarsWidth"),
			oSpyOnResize = sinon.spy(this.oChart, "_onResize");
		//Act
		this.oChart.onAfterRendering();
		//Assert
		assert.ok(this.oChart._sResizeHandlerId, "this._sResizeHandlerId is not null.");
		assert.ok(oSpyCalcBarsWidth.called, "Method _calcBarsWidth has been called.");
		assert.ok(oSpyOnResize.called, "Method _onResize has been called.");
	});

	QUnit.test("Attach interval timer", function(assert) {
		//Arrange
		var oAttachIntervalTimer = sinon.spy(IntervalTrigger.prototype, "addListener");
		//Act
		this.oChart.onAfterRendering();
		//Assert
		assert.ok(oAttachIntervalTimer.callCount === 0, "The interval timer has not been attached");
		oAttachIntervalTimer.restore();
	});

	QUnit.module("Tooltip tests", {
		beforeEach: function() {
			this.oChart = new InteractiveBarChart("lmc1", {
				bars: [
					new InteractiveBarChartBar({label: "May", selected: true, value: 33.1}),
					new InteractiveBarChartBar({label: "June", value: 31.7})
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
		this.oChart.addBar(new InteractiveBarChartBar({label: "July", value: 23.1, color: ValueColor.Good}));
		this.oFlexBox.setHeight("150px");
		this.oFlexBox.setWidth("150px");

		//Act
		this.oFlexBox.rerender();

		//Assert
		var sChartTooltip = this.oChart.$().attr("title");
		assert.equal(sChartTooltip.indexOf("May: 33.1 " + this.oChart._oRb.getText("SEMANTIC_COLOR_NEUTRAL")) >= 0, true, "Chart tooltip contains label and value from the first item");
		assert.equal(sChartTooltip.indexOf("June: 31.7 " + this.oChart._oRb.getText("SEMANTIC_COLOR_NEUTRAL")) >= 0, true, "Chart tooltip contains label and value from the second item");
		assert.equal(sChartTooltip.indexOf("July: 23.1 " + this.oChart._oRb.getText("SEMANTIC_COLOR_GOOD")) >= 0, true, "Chart tooltip contains label and value from the third item");
	});

	QUnit.test("Custom chart tooltip (non-interactive mode)", function(assert) {
		//Arrange
		var sCustomTooltip = "Cumulative Totals\ncalculated in EURO";
		this.oChart.addBar(new InteractiveBarChartBar({label: "July", value: 23.1}));
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
			$InteractionAreas = $Chart.find(".sapSuiteIBCBarInteractionArea"),
			sChartTooltip = $Chart.attr("title"),
			sFirstItemTooltip = $InteractionAreas.eq(0).attr("title"),
			sSecondItemTooltip = $InteractionAreas.eq(1).attr("title");
		assert.equal(sChartTooltip, null, "The chart tooltip is empty");
		assert.equal(sFirstItemTooltip, "May:\n33.1", "First item tooltip is present and contains label and value but no custom tooltip");
		assert.equal(sSecondItemTooltip, "June:\n31.7", "Second item tooltip is present and contains label and value but no custom tooltip");
	});

	QUnit.test("Standard tooltip with semantic color", function(assert) {
		//Arrange
		this.oChart.addBar(new InteractiveBarChartBar({label: "July", value: 23.1, color: ValueColor.Good}));

		//Act
		this.oChart.rerender();

		//Assert
		var $Chart = this.oChart.$(),
			$InteractionAreas = $Chart.find(".sapSuiteIBCBarInteractionArea"),
			sFirstItemTooltip = $InteractionAreas.eq(0).attr("title"),
			sSecondItemTooltip = $InteractionAreas.eq(1).attr("title"),
			sThirdItemTooltip = $InteractionAreas.eq(2).attr("title");
		assert.equal(sFirstItemTooltip, "May:\n33.1 " + this.oChart._oRb.getText("SEMANTIC_COLOR_NEUTRAL"), "First item tooltip is present and contains semantic information");
		assert.equal(sSecondItemTooltip, "June:\n31.7 " + this.oChart._oRb.getText("SEMANTIC_COLOR_NEUTRAL"), "Second item tooltip is present and contains semantic information");
		assert.equal(sThirdItemTooltip, "July:\n23.1 " + this.oChart._oRb.getText("SEMANTIC_COLOR_GOOD"), "Third item tooltip is present and contains semantic information");
	});

	QUnit.test("Standard tooltip (interactive mode but disabled chart)", function(assert) {
		//Arrange
		this.oChart.setSelectionEnabled(false);

		//Act
		this.oChart.rerender();

		//Assert
		var $Chart = this.oChart.$(),
			$InteractionAreas = $Chart.find(".sapSuiteIBCBarInteractionArea"),
			sChartTooltip = $Chart.attr("title"),
			sFirstItemTooltip = $InteractionAreas.eq(0).attr("title"),
			sSecondItemTooltip = $InteractionAreas.eq(1).attr("title");
		assert.ok(sChartTooltip.length > 0, "Chart tooltip is present");
		assert.equal(sFirstItemTooltip, null, "First item tooltip is not present");
		assert.equal(sSecondItemTooltip, null, "Second item tooltip is not present");
	});

	QUnit.test("Supress tooltip (non-interactive)", function(assert) {
		//Arrange
		this.oChart.addBar(new InteractiveBarChartBar({label: "July", value: 23.1}));
		this.oChart.setTooltip(" ");
		this.oFlexBox.setHeight("150px");
		this.oFlexBox.setWidth("150px");

		//Act
		this.oChart.rerender();

		//Assert
		var $Chart = this.oChart.$(),
			$InteractionAreas = $Chart.find(".sapSuiteIBCBarInteractionArea"),
			sChartTooltip = $Chart.attr("title"),
			sFirstItemTooltip = $InteractionAreas.eq(0).attr("title"),
			sSecondItemTooltip = $InteractionAreas.eq(1).attr("title");
		assert.equal(sChartTooltip, null, "Chart tooltip is not present");
		assert.equal(sFirstItemTooltip, null, "First item tooltip is not present");
		assert.equal(sSecondItemTooltip, null, "Second item tooltip is not present");
	});

	QUnit.test("Custom tooltip at element level (interactive mode)", function(assert) {
		//Arrange
		var sCustomTooltip = "Cumulative Totals",
			oFirstBar = this.oChart.getBars()[0],
			oSecondBar = this.oChart.getBars()[1];
		oFirstBar.setTooltip(sCustomTooltip);
		this.oChart.setTooltip(sCustomTooltip);

		//Act
		this.oChart.rerender();

		//Assert
		var $Chart = this.oChart.$(),
			$InteractionAreas = $Chart.find(".sapSuiteIBCBarInteractionArea"),
			sChartTooltip = $Chart.attr("title"),
			sFirstItemTooltip = $InteractionAreas.eq(0).attr("title"),
			sSecondItemTooltip = $InteractionAreas.eq(1).attr("title"),
			sFirstItemAriaLabel = $InteractionAreas.eq(0).attr("aria-label"),
			sSecondItemAriaLabel = $InteractionAreas.eq(1).attr("aria-label");
		assert.equal(oFirstBar._bCustomTooltip, true, "First item has a custom tooltip");
		assert.equal(oSecondBar._bCustomTooltip, false, "Second item does not have a custom tooltip");
		assert.equal(sChartTooltip, null, "Chart tooltip is not present");
		assert.equal(sFirstItemTooltip, sCustomTooltip, "First item tooltip contains only custom text");
		assert.equal(sSecondItemTooltip, "June:\n31.7", "Second item tooltip contains label and value and no custom text");
		assert.equal(sFirstItemAriaLabel, sCustomTooltip, "First item aria-label contains custom text");
		assert.equal(sSecondItemAriaLabel, "June 31.7", "Second item aria-label contains label and value");
	});

	QUnit.test("Suppress element tooltip (interactive)", function(assert) {
		//Arrange
		this.oChart.getBars()[0].setTooltip(" ");

		//Act
		this.oChart.rerender();

		//Assert
		var $Chart = this.oChart.$(),
			$InteractionAreas = $Chart.find(".sapSuiteIBCBarInteractionArea"),
			sFirstItemTooltip = $InteractionAreas.eq(0).attr("title"),
			sFirstItemAriaLabel = $InteractionAreas.eq(0).attr("aria-label"),
			sSecondItemTooltip = $InteractionAreas.eq(1).attr("title");
		assert.equal(sFirstItemTooltip, null, "First item tooltip is not present");
		assert.equal(sFirstItemAriaLabel, "May 33.1", "First item aria-label contains standard tooltip text");
		assert.equal(sSecondItemTooltip, "June:\n31.7", "Second item tooltip is present and contains label and value");
	});

	QUnit.test("N/A value bar tooltip", function(assert) {
		//Arrange
		var oFirstBar = this.oChart.getBars()[0];
		oFirstBar.setValue(null);

		//Act
		this.oChart.rerender();

		//Assert
		var $InteractionAreas = this.oChart.$().find(".sapSuiteIBCBarInteractionArea"),
			sFirstItemTooltip = $InteractionAreas.eq(0).attr("title"),
			sNAValue = this.oChart._oRb.getText("INTERACTIVECHART_NA");
		assert.equal(sFirstItemTooltip.indexOf(sNAValue) >= 0, true, "N/A Value inside tooltip provided");
	});

	QUnit.test("N/A value chart tooltip", function(assert) {
		//Arrange
		this.oChart.addBar(new InteractiveBarChartBar({label: "July", value: 23.1}));
		this.oFlexBox.setHeight("150px");
		this.oFlexBox.setWidth("150px");
		var oFirstBar = this.oChart.getBars()[0];
		oFirstBar.setValue(null);

		//Act
		this.oChart.rerender();

		//Assert
		var $Chart = this.oChart.$(),
			sChartTooltip = $Chart.attr("title"),
			$InteractionAreas = $Chart.find(".sapSuiteIBCBarInteractionArea"),
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
			$InteractionAreas = $Chart.find(".sapSuiteIBCBarInteractionArea"),
			sChartTooltip = $Chart.attr("title"),
			sFirstItemTooltip = $InteractionAreas.eq(0).attr("title"),
			sSecondItemTooltip = $InteractionAreas.eq(1).attr("title");
		assert.equal(sChartTooltip, null, "Chart tooltip is not present");
		assert.equal(sFirstItemTooltip, "May:\n33.1", "First item tooltip is present and contains label and value");
		assert.equal(sSecondItemTooltip, "June:\n31.7", "Second item tooltip is present and contains label and value");
	});
});

