/*global QUnit, sinon */
sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/microchart/InteractiveDonutChart",
	"sap/suite/ui/microchart/InteractiveDonutChartSegment",
	"sap/m/FlexBox",
	"sap/m/ValueColor",
	"sap/ui/Device",
	"sap/m/Label",
	"sap/suite/ui/microchart/library",
	"sap/base/Log",
	"sap/ui/core/IntervalTrigger"
], function (jQuery, InteractiveDonutChart, InteractiveDonutChartSegment, FlexBox, ValueColor, Device, Label, microchartLibrary, Log, IntervalTrigger) {
	"use strict";

	jQuery.sap.initMobile();


	QUnit.module("Control initialization core and theme checks", {
		beforeEach: function() {
			this.oStubIsInitialized = sinon.stub(sap.ui.getCore(), "isInitialized");
			this.oSpyAttachInit = sinon.spy(sap.ui.getCore(), "attachInit");
			this.oSpyHandleCoreInitialized = sinon.spy(InteractiveDonutChart.prototype, "_handleCoreInitialized");
			this.oStubThemeApplied = sinon.stub(sap.ui.getCore(), "isThemeApplied");
			this.oStubAttachThemeApplied = sinon.stub(sap.ui.getCore(), "attachThemeChanged").callsFake(function(fn, context) {
				fn.call(context); //simulate immediate theme change
			});
			this.oSpyHandleThemeApplied = sinon.spy(InteractiveDonutChart.prototype, "_handleThemeApplied");
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
		var oChart = new InteractiveDonutChart();

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
		var oChart = new InteractiveDonutChart();

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
		var oChart = new InteractiveDonutChart();

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
		var oChart = new InteractiveDonutChart();

		//Assert
		assert.ok(oChart._bThemeApplied, "Rendering variable has been correctly set.");
		assert.ok(this.oSpyAttachInit.notCalled, "Method Core.attachInit has not been called.");
		assert.ok(this.oSpyHandleCoreInitialized.calledOnce, "Method _handleCoreInitialized has been called once.");
		assert.ok(this.oStubAttachThemeApplied.calledOnce, "Method Core.attachThemeChanged has been called once.");
		assert.ok(this.oSpyHandleThemeApplied.calledOnce, "Method _handleThemeApplied has been called once.");
	});

	QUnit.module("InteractiveDonutChart instantiation", {
		beforeEach: function() {
			this.oChart = new InteractiveDonutChart();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("InteractiveDonutChart can be instantiated", function(assert) {
		assert.ok(this.oChart, "The InteractiveDonutChart control is found in the library and instantiated");
	});

	QUnit.test("InteractiveDonutChart property DisplayedSegments", function(assert) {
		assert.equal(this.oChart.getDisplayedSegments(), 3, "The property displayedSegments is found and correctly set to the default value");
	});

	QUnit.test("InteractiveDonutChart property selectionEnabled", function(assert) {
		assert.ok(this.oChart.getSelectionEnabled(), "The property selectionEnabled is found and correctly set to the default value");
	});

	QUnit.test("InteractiveDonutChart _segmentSelectedClass property is correct", function(assert) {
		assert.equal(InteractiveDonutChart.SEGMENT_CSSCLASS_SELECTED, "sapSuiteIDCLegendSegmentSelected", "_segmentSelectedClass is set correctly");
	});

	QUnit.module("InteractiveDonutChart rendering", {
		beforeEach: function () {
			this.oChart = new InteractiveDonutChart();
			this.oChart.addSegment(new InteractiveDonutChartSegment({
				label: "Phase 4",
				value: 40.0,
				displayedValue: "40.0%"
			}));
			this.oChart.addSegment(new InteractiveDonutChartSegment({
				label: "Phase 2",
				value: 21.5,
				displayedValue: "21.5%",
				color: ValueColor.Good
			}));
			this.oChart.addSegment(new InteractiveDonutChartSegment({
				label: "Other",
				value: 38.5,
				displayedValue: "38.5%",
				selected: true,
				color: ValueColor.Critical
			}));
			this.oChart.addSegment(new InteractiveDonutChartSegment({
				label: "Other2",
				value: 21.0,
				displayedValue: "21.0%",
				color: ValueColor.Error
			}));
			this.oChart.placeAt("qunit-fixture");
			this.oRenderer = this.oChart.getRenderer();
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oChart.destroy();
		}
	});

	QUnit.test("InteractiveDonutChart _segmentSelectedClass property is correct", function(assert) {
		assert.equal(InteractiveDonutChart.SEGMENT_CSSCLASS_SELECTED, "sapSuiteIDCLegendSegmentSelected", "_segmentSelectedClass is set correctly");
	});

	QUnit.test("InteractiveDonutChart basic layout rendering", function(assert) {
		assert.ok(this.oChart.$().hasClass("sapSuiteIDC"), "The root DOM element was rendered successfully");
	});

	QUnit.test("InteractiveDonutChart basic layout rendering: chart and legend", function(assert) {
		assert.ok(this.oChart.$().find(".sapSuiteIDCChart").length > 0, "The chart DOM element was rendered successfully");
		assert.ok(this.oChart.$().find(".sapSuiteIDCChartSVG").length > 0, "The chart SVG DOM element was rendered successfully");
		assert.ok(this.oChart.$().find(".sapSuiteIDCLegend").length > 0, "The legend DOM element was rendered successfully");
	});

	QUnit.test("SVG element is not focusable", function(assert) {
		assert.equal(this.oChart.$().find(".sapSuiteIDCChartSVG").attr("focusable"), "false", "The 'focusable' attribute is set on the SVG element.");
	});

	QUnit.test("Calculation function for the sum", function(assert) {
		assert.equal(this.oRenderer._calculateSum(this.oChart), 100.0, "The sum is correctly calculated based on only the first displayedSegments segments");
	});

	QUnit.test("Calculation of gap size (belize)", function(assert) {
		//Assert
		//Act
		var oStubGetTheme = sinon.stub(sap.ui.getCore().getConfiguration(), "getTheme").returns("sap_belize");
		this.oChart.rerender();
		//Assert
		assert.equal(this.oRenderer._fSegmentHalfGapSize, this.oRenderer.SEGMENT_HALF_GAP_SIZE, "There is no segment gap size");
		oStubGetTheme.restore();
	});

	QUnit.test("Calculation of gap size (hcb)", function(assert) {
		//Assert
		//Act
		var oStubGetTheme = sinon.stub(sap.ui.getCore().getConfiguration(), "getTheme").returns("sap_hcb");
		this.oChart.rerender();
		//Assert
		assert.equal(this.oRenderer._fSegmentHalfGapSize, this.oRenderer.SEGMENT_HALF_GAP_SIZE_HCB, "There is a 1px segment gap size for sap_hcb theme");
		oStubGetTheme.restore();
	});

	QUnit.test("Calculation function for the fraction of half a circle", function(assert) {
		assert.equal(this.oRenderer._calculateCircleFraction(100, 50), Math.PI, "The fraction of half a circle is correctly calculated");
		assert.equal(this.oRenderer._calculateCircleFraction(100, 0), 0, "The fraction of zero value is correctly calculated");
		assert.equal(this.oRenderer._calculateCircleFraction(100, 100), 2 * Math.PI, "The fraction of the full circle is correctly calculated");
	});

	QUnit.test("Check path generation", function(assert) {
		var sSVGPath, sSVGPathExpected;

		sSVGPath = this.oRenderer._calculateSegmentPath(100, 25, 0, 50, 30, 0);
		sSVGPathExpected = "M0 -30 L0 -50 A50,50 0 0,1 49.99,0 L29.99 0 A30,30 0 0,0 0,-30";

		assert.strictEqual(sSVGPath, sSVGPathExpected, "The path is composed as expected");
	});

	QUnit.test("Check path generation with border", function(assert) {
		var sSVGPath, sSVGPathExpected;

		sSVGPath = this.oRenderer._calculateSegmentPath(100, 25, 0, 50, 30, 0.5);
		sSVGPathExpected = "M0.5 -30.01 L0.5 -50.01 A50,50 0 0,1 49.99,-0.5 L29.99 -0.5 A30,30 0 0,0 0.5,-30.01";

		assert.strictEqual(sSVGPath, sSVGPathExpected, "The path is composed as expected");
	});

	QUnit.test("Check legend value rendering w/o displayedValue", function(assert) {
		assert.expect(1);

		//Arrange
		var oSegment = this.oChart.getSegments()[0];
		oSegment.setDisplayedValue();

		//Act
		sap.ui.getCore().applyChanges();

		//Assert
		assert.equal(jQuery(this.oChart.$().find(".sapSuiteIDCLegendValue")[0]).text(), String(oSegment.getValue()), "Legend item has been correctly rendered to unformatted value");
	});

	QUnit.test("Check legend N/A handling on null value", function(assert) {
		assert.expect(1);

		//Arrange
		var sNAText = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.microchart").getText("INTERACTIVECHART_NA");
		this.oChart.getSegments()[0].setValue(null);

		//Act
		sap.ui.getCore().applyChanges();

		//Assert
		assert.equal(jQuery(this.oChart.$().find(".sapSuiteIDCLegendValue")[0]).text(), sNAText, "Legend item has been correctly rendered to N/A");
	});

	QUnit.test("Check legend N/A handling on undefined value", function(assert) {
		assert.expect(1);

		//Arrange
		this.oChart.getSegments()[0].setValue();
		var sNAText = sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.microchart").getText("INTERACTIVECHART_NA");

		//Act
		sap.ui.getCore().applyChanges();

		//Assert
		assert.equal(jQuery(this.oChart.$().find(".sapSuiteIDCLegendValue")[0]).text(), sNAText, "Legend item has been correctly rendered to N/A");
	});

	QUnit.test("Check ghost rendering", function(assert) {
		//Arrange
		var $Ghosts = this.oChart.$().find(".sapSuiteIDCChartSegmentGhost");

		//Assert
		assert.equal($Ghosts.length, 3, "All ghost segments were found");
		assert.equal(jQuery($Ghosts[0]).css("display"), "inline", "Unselected segment ghost is visible but with transparent color (touch area extended)");
		assert.equal(jQuery($Ghosts[1]).css("display"), "inline", "Unselected segment ghost is visible but with transparent color (touch area extended)");
		assert.equal(jQuery($Ghosts[2]).css("display"), "inline", "Selected segment ghost is visible");
		assert.equal(jQuery($Ghosts[2]).hasClass("sapSuiteIDCChartSegmentGhostSelected"), true, "Selected segment ghost is selected");
		assert.equal(jQuery($Ghosts[0]).attr("data-sap-ui-idc-selection-index"), 0, "Ghost segment selection index 0 has been correctly set in order");
		assert.equal(jQuery($Ghosts[1]).attr("data-sap-ui-idc-selection-index"), 1, "Ghost segment selection index 1 has been correctly set in order");
		assert.equal(jQuery($Ghosts[2]).attr("data-sap-ui-idc-selection-index"), 2, "Ghost segment selection index 2 has been correctly set in order");
	});

	QUnit.test("Check segment rendering", function(assert) {
		//Arrange
		var $Segments = this.oChart.$().find(".sapSuiteIDCChartSegment");

		//Assert
		assert.equal($Segments.length, 3, "All segments were found");
		assert.equal(this.oChart.$().find(".sapSuiteIDCChartSegmentSelected").length, 1, "Selected segment has been rendered correctly");
	});

	QUnit.test("Disabled overlay is rendered", function(assert) {
		//Arrange
		this.oChart.setSelectionEnabled(false);
		//Act
		sap.ui.getCore().applyChanges();
		//Assert
		assert.equal(this.oChart.$().find(".sapSuiteIDCDisabledOverlay").length, 1, "The overlay div for the chart exists in dom.");
	});

	QUnit.test("Legend entries are resized", function(assert) {
		//Arrange
		sinon.spy(this.oChart, "onAfterRendering");
		sinon.spy(this.oChart, "_handleLegendEntrySizing");

		//Act
		this.oChart.invalidate();
		sap.ui.getCore().applyChanges();

		//Assert
		assert.ok(this.oChart.onAfterRendering.calledOnce, "Function onAfterRendering has been called.");
		assert.ok(this.oChart._handleLegendEntrySizing.calledOnce, "Function _handleLegendEntrySizing has been called.");

		this.oChart._handleLegendEntrySizing.restore();
	});

	QUnit.test("No semantic marker is rendered for Neutral color", function(assert) {
		assert.equal(this.oChart.$("interactionArea-0").find(".sapSuiteIDCSemanticMarker").length, 0, "No marker has been found for Neutral.");
	});

	QUnit.test("Semantic marker has correct class for Good color", function(assert) {
		//Arrange
		var $Marker = this.oChart.$("interactionArea-1").find(".sapSuiteIDCSemanticMarker");

		//Assert
		assert.equal($Marker.length, 1, "A marker has been found for Good.");
		assert.equal($Marker.hasClass("sapSuiteICSemanticColorGood"), true, "The correct color class has been added.");
	});

	QUnit.test("Semantic marker has correct class for Critical color", function(assert) {
		//Arrange
		var $Marker = this.oChart.$("interactionArea-2").find(".sapSuiteIDCSemanticMarker");

		//Assert
		assert.equal($Marker.length, 1, "A marker has been found for Critical.");
		assert.equal($Marker.hasClass("sapSuiteICSemanticColorCritical"), true, "The correct color class has been added.");
	});

	QUnit.test("Semantic marker has correct class for Error color", function(assert) {
		//Arrange
		this.oChart.setDisplayedSegments(4);
		sap.ui.getCore().applyChanges();
		var $Marker = this.oChart.$("interactionArea-3").find(".sapSuiteIDCSemanticMarker");

		//Assert
		assert.equal($Marker.length, 1, "A marker has been found for Error.");
		assert.equal($Marker.hasClass("sapSuiteICSemanticColorError"), true, "The correct color class has been added.");
	});

	if (Device.system.desktop && !Device.system.combi) {
		QUnit.module("Donut-Segment synchronisation tests", {
			beforeEach: function() {
				this.oChart = new InteractiveDonutChart({
					segments : [
						new InteractiveDonutChartSegment({
							value: 20
						}),
						new InteractiveDonutChartSegment({
							value: 40
						}),
						new InteractiveDonutChartSegment({
							value: 40
						})
					]
				});
				this.oChart.placeAt("qunit-fixture");
			},
			afterEach: function() {
				this.oChart.destroy();
				this.oChart = null;
			}
		});

		QUnit.test("Hover handlers are attached", function(assert) {
			//Arrange
			sinon.spy(this.oChart, "_attachHoverHandlers");
			sinon.spy(this.oChart, "onAfterRendering");

			//Act
			sap.ui.getCore().applyChanges();

			//Assert
			assert.ok(this.oChart.onAfterRendering.calledOnce, "Function onAfterRendering has been called.");
			assert.ok(this.oChart._attachHoverHandlers.calledOnce, "Function _attachHoverHandlers has been called.");
		});

		QUnit.test("Hover handlers are called - mousein on legend", function(assert) {
			//Arrange
			sinon.spy(this.oChart, "_handleHoverSync");
			sinon.spy(this.oChart, "onAfterRendering");

			//Act
			sap.ui.getCore().applyChanges();
			this.oChart.$().find(".sapSuiteIDCLegendSegment").trigger("mousemove");

			//Assert
			assert.ok(this.oChart.onAfterRendering.calledOnce, "Function onAfterRendering has been called once.");
			assert.equal(this.oChart._handleHoverSync.callCount, 3, "Function _handleHoverSync has been called thrice.");
			assert.ok(this.oChart._handleHoverSync.firstCall.calledWith(0), "Function _handleHoverSync has been called correctly called for first segment.");
			assert.ok(this.oChart._handleHoverSync.secondCall.calledWith(1), "Function _handleHoverSync has been called correctly called for second segment.");
			assert.ok(this.oChart._handleHoverSync.thirdCall.calledWith(2), "Function _handleHoverSync has been called correctly called for third segment.");
			assert.equal(this.oChart.$().find(".sapSuiteIDCChartSegmentGhost").filter(function() {
				return jQuery(this).css("fill") !== "transparent";
			}).length, 3, "Ghost segments have been shown.");
			assert.equal(this.oChart.$().find(".sapSuiteIDCLegendSegmentHover").length, 3, "Style classes for legend items have been attached.");
		});

		QUnit.test("Hover handlers are called - mousein on selected ghost segments", function(assert) {
			//Arrange
			var aSegments = this.oChart.getSegments();
			sinon.spy(this.oChart, "_handleHoverSync");

			this.oChart.setSelectedSegments([ aSegments[0], aSegments[2] ]); //select first and third segment

			//Act
			sap.ui.getCore().applyChanges();
			this.oChart.$().find("path:not(.sapSuiteIDCChartSegmentGhost)").trigger("mousemove");

			//Assert
			assert.equal(this.oChart._handleHoverSync.callCount, 3, "Function _handleHoverSync has been called three times.");
			assert.equal(this.oChart.$().find(".sapSuiteIDCChartSegmentGhostSelected.sapSuiteIDCChartSegmentGhostHighlight").filter(function() {
				return jQuery(this).css("fill") !== "transparent";
			}).length, 2, "Ghost segments (selected highlight) have been shown.");
			assert.equal(this.oChart.$().find(".sapSuiteIDCChartSegmentGhost:not(.sapSuiteIDCChartSegmentGhostSelected.sapSuiteIDCChartSegmentGhostHighlight)").filter(function() {
				return jQuery(this).css("fill") !== "transparent";
			}).length, 1, "Ghost segment with normal state has been shown.");
			assert.equal(this.oChart.$().find(".sapSuiteIDCLegendSegmentSelected.sapSuiteIDCLegendSegmentHover").length, 2, "Style classes for legend items (selected hover) have been attached.");
			assert.equal(this.oChart.$().find(".sapSuiteIDCLegendSegmentHover").length, 3, "Style class for legend item (hover) has been attached.");
		});

		QUnit.test("Hover handlers are called - mouseout from selected ghost segments", function(assert) {
			//Arrange
			var aSegments = this.oChart.getSegments();
			sinon.spy(this.oChart, "_handleHoverSync");

			this.oChart.setSelectedSegments([ aSegments[0], aSegments[2] ]); //select first and third segment

			//Act
			sap.ui.getCore().applyChanges();
			this.oChart.$().find("path:not(.sapSuiteIDCChartSegmentGhost)").trigger("mouseout");

			//Assert
			assert.equal(this.oChart._handleHoverSync.callCount, 3, "Function _handleHoverSync has been called three times.");
			assert.ok(this.oChart._handleHoverSync.firstCall.calledWith(0, true), "Function _handleHoverSync has been called for first segment.");
			assert.ok(this.oChart._handleHoverSync.secondCall.calledWith(1), "Function _handleHoverSync has been called second segment.");
			assert.ok(this.oChart._handleHoverSync.thirdCall.calledWith(2, true), "Function _handleHoverSync has been called third segment.");
			assert.equal(this.oChart.$().find(".sapSuiteIDCChartSegmentGhostHighlight").filter(function() {
				return jQuery(this).css("fill") !== "transparent";
			}).length, 0, "No highlight ghost segments are visible.");
			assert.equal(this.oChart.$().find(".sapSuiteIDCChartSegmentGhostSelected").filter(function() {
				return jQuery(this).css("fill") !== "transparent";
			}).length, 2, "Ghost segments with selected state have been shown.");
			assert.equal(this.oChart.$().find(".sapSuiteIDCLegendSegmentSelected").length, 2, "Style classes for selected legend items have been attached.");
			assert.equal(this.oChart.$().find(".sapSuiteIDCLegendSegment:not(.sapSuiteIDCLegendSegmentSelected)").length, 1, "Style classe for non-selected legend items has been attached.");
			assert.equal(this.oChart.$().find(".sapSuiteIDCLegendSegmentHover").length, 0, "Style class for legend item (hover) has not been attached.");
		});

		QUnit.test("Hover handlers are called - mousein on selected segments", function(assert) {
			//Arrange
			var aSegments = this.oChart.getSegments();
			sinon.spy(this.oChart, "_handleHoverSync");

			this.oChart.setSelectedSegments([ aSegments[0], aSegments[2] ]); //select first and third segment

			//Act
			sap.ui.getCore().applyChanges();
			this.oChart.$().find(".sapSuiteIDCLegendSegment").trigger("mousemove");

			//Assert
			assert.equal(this.oChart._handleHoverSync.callCount, 3, "Function _handleHoverSync has been called three times.");
			assert.equal(this.oChart.$().find(".sapSuiteIDCChartSegmentSelected.sapSuiteIDCChartSegmentHighlight").length, 2, "Segments (selected highlight) have been shown.");
			assert.equal(this.oChart.$().find(".sapSuiteIDCChartSegment:not(.sapSuiteIDCChartSegmentSelected.sapSuiteIDCChartSegmentHighlight)").length, 1, "Segment with normal state has been shown.");
			assert.equal(this.oChart.$().find(".sapSuiteIDCLegendSegmentSelected.sapSuiteIDCLegendSegmentHover").length, 2, "Style classes for legend items (selected hover) have been attached.");
			assert.equal(this.oChart.$().find(".sapSuiteIDCLegendSegmentHover").length, 3, "Style class for legend item (hover) has been attached.");
		});

		QUnit.test("Hover handlers are called - mouseout from selected segments", function(assert) {
			//Arrange
			var aSegments = this.oChart.getSegments();
			sinon.spy(this.oChart, "_handleHoverSync");

			this.oChart.setSelectedSegments([ aSegments[0], aSegments[2] ]); //select first and third segment

			//Act
			sap.ui.getCore().applyChanges();
			this.oChart.$().find(".sapSuiteIDCLegendSegment").trigger("mouseout");

			//Assert
			assert.equal(this.oChart._handleHoverSync.callCount, 3, "Function _handleHoverSync has been called three times.");
			assert.ok(this.oChart._handleHoverSync.firstCall.calledWith(0, true), "Function _handleHoverSync has been called for first segment.");
			assert.ok(this.oChart._handleHoverSync.secondCall.calledWith(1), "Function _handleHoverSync has been called second segment.");
			assert.ok(this.oChart._handleHoverSync.thirdCall.calledWith(2, true), "Function _handleHoverSync has been called third segment.");
			assert.equal(this.oChart.$().find(".sapSuiteIDCChartSegmentSelected.sapSuiteIDCChartSegmentHighlight").length, 0, "No highlight selected segments are visible.");
			assert.equal(this.oChart.$().find(".sapSuiteIDCChartSegmentSelected").length, 2, "Segments with selected state have been shown.");
			assert.equal(this.oChart.$().find(".sapSuiteIDCLegendSegmentSelected").length, 2, "Style classes for selected legend items have been attached.");
			assert.equal(this.oChart.$().find(".sapSuiteIDCLegendSegment:not(.sapSuiteIDCLegendSegmentSelected)").length, 1, "Style classe for non-selected legend items has been attached.");
			assert.equal(this.oChart.$().find(".sapSuiteIDCLegendSegmentHover").length, 0, "Style class for legend item (hover) has not been attached.");
		});

		QUnit.test("Hover handlers are called - mousein on normal segments", function(assert) {
			//Arrange
			sinon.spy(this.oChart, "_handleHoverSync");

			//Act
			sap.ui.getCore().applyChanges();
			this.oChart.$().find("path:not(.sapSuiteIDCChartSegmentGhost)").trigger("mousemove");

			//Assert
			assert.equal(this.oChart._handleHoverSync.callCount, 3, "Function _handleHoverSync has been called three times.");
			assert.equal(this.oChart.$().find(".sapSuiteIDCChartSegmentHighlight").filter(function() {
				return jQuery(this).css("fill") !== "transparent";
			}).length, 3, "Ghost segments (highlight) have been shown.");
			assert.equal(this.oChart.$().find(".sapSuiteIDCChartSegment:not(.sapSuiteIDCChartSegmentHighlight)").filter(function() {
				return jQuery(this).css("fill") !== "transparent";
			}).length, 0, "Ghost segment with normal state has been shown.");
			assert.equal(this.oChart.$().find(".sapSuiteIDCLegendSegmentHover").length, 3, "Style classes for legend items (hover) have been attached.");
		});
	}

	QUnit.module("Keyboard support tests", {
		beforeEach: function() {
			this.oChart = new InteractiveDonutChart({
				segments : [
					new InteractiveDonutChartSegment(),
					new InteractiveDonutChartSegment(),
					new InteractiveDonutChartSegment()
				]
			});
			this.oChart.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
			sinon.spy(this.oChart, "firePress");
		},
		afterEach: function() {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Down arrow button is pressed", function(assert) {
		//Arrange
		var oEventDown = {
			preventDefault : function(){},
			stopImmediatePropagation: function(){}
		};
		oEventDown.target = this.oChart.$().find(".sapSuiteIDCLegendSegment")[0];
		//Act
		this.oChart.onsapdown(oEventDown);
		//Assert
		assert.notOk(this.oChart.$().find(".sapSuiteIDCLegendSegment")[0].hasAttribute("tabindex"), "The first segment does not have tabindex after down arrow button was clicked");
		assert.equal(this.oChart.$().find(".sapSuiteIDCLegendSegment").eq(1).attr("tabindex"), 0, "The second segment has tabindex after down arrow button was clicked");
		assert.ok(this.oChart.$().find(".sapSuiteIDCLegendSegment").eq(1).is(":focus"), "The second segment is focused");
	});

	QUnit.test("Up arrow button is pressed", function(assert) {
		//Arrange
		var oEventDown = {
				preventDefault : function(){},
				stopImmediatePropagation: function(){}
			},
			oEventUp = {
				preventDefault: function(){},
				stopImmediatePropagation: function(){}
			};
		oEventDown.target = this.oChart.$().find(".sapSuiteIDCLegendSegment")[0];
		oEventUp.target = this.oChart.$().find(".sapSuiteIDCLegendSegment")[1];
		//Act
		this.oChart.onsapdown(oEventDown);
		this.oChart.onsapup(oEventUp);
		//Assert
		assert.notOk(this.oChart.$().find(".sapSuiteIDCLegendSegment")[1].hasAttribute("tabindex"), "The second segment does not have tabindex after up arrow button was clicked");
		assert.equal(this.oChart.$().find(".sapSuiteIDCLegendSegment").eq(0).attr("tabindex"), 0, "The first segment has tabindex after up arrow button was clicked");
		assert.ok(this.oChart.$().find(".sapSuiteIDCLegendSegment").eq(0).is(":focus"), "The first segment is focused");
	});

	QUnit.test("Home button is pressed", function(assert) {
		//Arrange
		var oEventClick = {
			preventDefault : function(){},
			stopImmediatePropagation: function(){}
		};
		oEventClick.target = this.oChart.$().find(".sapSuiteIDCLegendSegment")[2];
		//Act
		this.oChart.onsaphome(oEventClick);
		//Assert
		assert.equal(this.oChart.$().find(".sapSuiteIDCLegendSegment").eq(0).attr("tabindex"), 0, "The first segment has tabindex after home button is clicked");
		assert.ok(this.oChart.$().find(".sapSuiteIDCLegendSegment").eq(0).is(":focus"), "The first segment is focused");
	});

	QUnit.test("End button is pressed", function(assert) {
		//Arrange
		var oEventClick = {
			preventDefault : function(){},
			stopImmediatePropagation: function(){}
		};
		oEventClick.target = this.oChart.$().find(".sapSuiteIDCLegendSegment")[1];
		//Act
		this.oChart.onsapend(oEventClick);
		//Assert
		assert.equal(this.oChart.$().find(".sapSuiteIDCLegendSegment").eq(2).attr("tabindex"), 0, "The last segment has tabindex after end button is clicked");
		assert.ok(this.oChart.$().find(".sapSuiteIDCLegendSegment").eq(2).is(":focus"), "The last segment is focused");
	});

	QUnit.test("Space button is pressed", function(assert) {
		//Arrange
		var oEvent = {
			preventDefault : function(){},
			stopImmediatePropagation: function(){}
		};
		oEvent.target = this.oChart.$().find(".sapSuiteIDCLegendSegment")[1];
		var oSpyFireSelectionChanged = sinon.spy(this.oChart, "fireSelectionChanged");
		//Act
		this.oChart.onsapspace(oEvent);
		//Assert
		assert.ok(this.oChart.getSegments()[1].getSelected(), "The second segment changed its selection after space button was clicked");
		assert.ok(oSpyFireSelectionChanged.called, "fireSelectionChanged is called");
	});

	QUnit.test("Enter button is pressed (interactive)", function(assert) {
		//Arrange
		var oEvent = {
			preventDefault : function(){},
			stopImmediatePropagation: function(){},
			target: this.oChart.$().find(".sapSuiteIDCLegendSegment")[2]
		};
		var oSpyFireSelectionChanged = sinon.spy(this.oChart, "fireSelectionChanged");
		var bSelected = this.oChart.getSegments()[2].getSelected();
		//Act
		this.oChart.onsapenter(oEvent);
		//Assert
		assert.notEqual(bSelected, this.oChart.getSegments()[2].getSelected(), "The third segment changed its selection after enter button was clicked");
		assert.ok(oSpyFireSelectionChanged.called, "fireSelectionChanged is called");
		assert.equal(this.oChart.firePress.calledOnce, 0, "Press event is not fired in interative mode");
	});

	QUnit.test("Enter button is pressed (non-interactive)", function(assert) {
		//Arrange
		var oEventEnter = {
			preventDefault: function(){},
			stopImmediatePropagation: function(){},
			target: this.oChart.$().find(".sapSuiteIDCLegendSegment")[1]
		};
		var oSpyFireSelectionChanged = sinon.spy(this.oChart, "fireSelectionChanged");
		this.oChart._bInteractiveMode = false;
		//Act
		this.oChart.onsapenter(oEventEnter);
		//Assert
		assert.equal(this.oChart.getSegments()[1].getSelected(), false, "Change selection is ignored in non-interactive mode");
		assert.equal(oSpyFireSelectionChanged.called, false, "SelectionChanged event is not fired in non-interative mode");
		assert.equal(this.oChart.firePress.calledOnce, 1, "Press event is fired in non-interative mode");
	});

	QUnit.module("Events tests", {
		beforeEach : function() {
			this.fnSelectionChangedHandler = function() {};
			this.oChart = new InteractiveDonutChart({
				segments : [
					new InteractiveDonutChartSegment({selected : true}),
					new InteractiveDonutChartSegment(),
					new InteractiveDonutChartSegment(),
					new InteractiveDonutChartSegment()
				]
			});
			this.oChart.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
			sinon.spy(this, "fnSelectionChangedHandler");
			this.oSpyFireSelectionChanged = sinon.spy(this.oChart, "fireSelectionChanged");
			sinon.spy(this.oChart, "firePress");
		},
		afterEach : function () {
			this.fnSelectionChangedHandler.restore();
			this.oSpyFireSelectionChanged = null;
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Event selectionChanged in non-interactive mode is not executed for click event", function(assert) {
		//Arrange
		var oEvent = {
			preventDefault: function(){},
			target: this.oChart.$().find(".sapSuiteIDCLegendSegment")[0]
		};
		this.oChart._bInteractiveMode = false;
		//Act
		this.oChart.onclick(oEvent);
		//Assert
		assert.equal(this.oSpyFireSelectionChanged.called, false, "SelectionChanged event is not fired in non-interative mode");
		assert.equal(this.oChart.firePress.calledOnce, 1, "Press event is fired in non-interative mode");
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

	QUnit.test("Focus test for mouse click event", function(assert) {
		//Arrange
		var oEvent = {preventDefault: function(){}};
		oEvent.target = this.oChart.$().find(".sapSuiteIDCLegendSegment")[1];
		//Act
		this.oChart.onclick(oEvent);
		//Assert
		assert.notOk(this.oChart.$().find(".sapSuiteIDCLegendSegment")[0].hasAttribute("tabindex"), "The first column does not have tabindex after mouse clicking on second column");
		assert.equal(this.oChart.$().find(".sapSuiteIDCLegendSegment").eq(1).attr("tabindex"), 0, "The second column has tabindex after mouse clicking on second column");
		assert.ok(this.oChart.$().find(".sapSuiteIDCLegendSegment").eq(1).is(":focus"), "The second column is focused");
	});

	QUnit.test("Method onclick toggles selected when index is valid", function(assert) {
		//Arrange
		var iIndex = 3;
		var oEvent = { target: "<div class='sapSuiteIDCLegendSegment' data-sap-ui-idc-selection-index='" + iIndex + "'></div>" };
		var aSegments = [
			new InteractiveDonutChartSegment(),
			new InteractiveDonutChartSegment(),
			new InteractiveDonutChartSegment(),
			new InteractiveDonutChartSegment()
		];
		var aSelectedSegments = [ aSegments[iIndex] ];
		var oStubGetSegments = sinon.stub(this.oChart, "getAggregation").withArgs("segments").returns(aSegments);
		var oSpyToggleSelected = sinon.spy(this.oChart, "_toggleSelected");
		sinon.stub(this.oChart, "getSelectedSegments").returns(aSelectedSegments);

		//Act
		this.oChart.onclick(oEvent);

		//Assert
		assert.ok(oStubGetSegments.called, "getAggregation on segments is called");
		assert.ok(oSpyToggleSelected.called, "_toggleSelected is called");
		assert.ok(oSpyToggleSelected.calledWith(iIndex), "_toggleSelected is called with the found index");
		assert.ok(this.oSpyFireSelectionChanged.called, "fireSelectionChanged is called");
		assert.ok(this.oSpyFireSelectionChanged.calledWithMatch({
			selectedSegments : aSelectedSegments,
			segment : aSegments[iIndex],
			selected : true
		}), "fireSelectionChanged is called with the correct params");
	});

	QUnit.test("Method onclick returns when index is NaN", function(assert) {
		//Arrange
		var iIndex = "Sakamoto";
		var oEvent = {
			target: "<div data-sap-ui-idc-selection-index='" + iIndex + "'></div>"
		};
		var aSegments = [ {}, {}, {}, {} ];
		var oStubGetSegments = sinon.stub(this.oChart, "getAggregation").withArgs("segments").returns(aSegments);
		var oSpyToggleSelected = sinon.spy(this.oChart, "_toggleSelected");

		//Act
		this.oChart.onclick(oEvent);

		//Assert
		assert.ok(oStubGetSegments.called, "getAggregation on segments is called");
		assert.ok(oSpyToggleSelected.notCalled, "_toggleSelected is not called");
		assert.ok(this.oSpyFireSelectionChanged.notCalled, "fireSelectionChanged is not called");
	});

	QUnit.test("Method onclick returns when index is larger than segment count", function(assert) {
		//Arrange
		var iIndex = 15;
		var oEvent = {
			target: "<div data-sap-ui-idc-selection-index='" + iIndex + "'></div>"
		};
		var aSegments = [ {}, {}, {}, {} ];
		var oStubGetSegments = sinon.stub(this.oChart, "getAggregation").withArgs("segments").returns(aSegments);
		var oSpyToggleSelected = sinon.spy(this.oChart, "_toggleSelected");

		//Act
		this.oChart.onclick(oEvent);

		//Assert
		assert.ok(oStubGetSegments.called, "getAggregation on segments is called");
		assert.ok(oSpyToggleSelected.notCalled, "_toggleSelected is not called");
		assert.ok(this.oSpyFireSelectionChanged.notCalled, "fireSelectionChanged is not called");
	});

	QUnit.test("Click event on selection disabled segment chart test", function(assert) {
		//Arrange
		this.oChart.setSelectionEnabled(false);
		this.oChart.attachEvent("selectionChanged", this.fnSelectionChangedHandler);
		sap.ui.getCore().applyChanges();
		var oEvent = {preventDefault : function(){}};
		oEvent.target = this.oChart.$().find(".sapSuiteIDCDisabledOverlay")[0];
		//Act
		this.oChart.onclick(oEvent);
		//Assert
		assert.ok(this.fnSelectionChangedHandler.notCalled, "The selection changed event is not triggered when click on selection disabled chart.");
	});

	QUnit.test("SelectionChanged event handler test - selected to deselected", function(assert) {
		//Arrange
		var oEvent = {preventDefault: function(){}};
		var iIndex = 0;
		oEvent.target = this.oChart.$().find(".sapSuiteIDCLegendSegment")[iIndex];
		this.oChart.attachEvent("selectionChanged", this.fnSelectionChangedHandler);
		//Act
		this.oChart.onclick(oEvent);
		//Assert
		assert.ok(this.fnSelectionChangedHandler.calledOnce, "SelectionChanged event handler works properly.");
		assert.equal(this.oChart.fireSelectionChanged.args[0][0].selectedSegments.length, 0, "The selected elements array is updated.");
		assert.equal(this.oChart.fireSelectionChanged.args[0][0].segment.getId(), this.oChart.getSegments()[iIndex].getId(), "The first segment was clicked");
		assert.equal(this.oChart.fireSelectionChanged.args[0][0].selected, false, "The selection state of the first segment is changed to deselected");
	});

	QUnit.test("SelectionChanged event handler test - deselected to selected", function(assert) {
		//Arrange
		var oEvent = {preventDefault: function(){}};
		var iIndex = 2;
		oEvent.target = this.oChart.$().find(".sapSuiteIDCLegendSegment")[iIndex];
		this.oChart.attachEvent("selectionChanged", this.fnSelectionChangedHandler);
		//Act
		this.oChart.onclick(oEvent);
		//Assert
		assert.ok(this.fnSelectionChangedHandler.calledOnce, "SelectionChanged event handler works properly.");
		assert.equal(this.oChart.fireSelectionChanged.args[0][0].selectedSegments.length, 2, "The selected elements array is updated.");
		assert.equal(this.oChart.fireSelectionChanged.args[0][0].segment.getId(), this.oChart.getSegments()[iIndex].getId(), "The third segment was clicked");
		assert.equal(this.oChart.fireSelectionChanged.args[0][0].selected, true, "The selection state of the third segment is changed to selected");
		assert.equal(this.oChart.fireSelectionChanged.args[0][0].selectedSegments[0].getId(), this.oChart.getSegments()[0].getId(), "The first segment is selected");
		assert.equal(this.oChart.fireSelectionChanged.args[0][0].selectedSegments[1].getId(), this.oChart.getSegments()[iIndex].getId(), "The third segment is now selected");
	});

	QUnit.module("API and private methods tests", {
		beforeEach : function() {
			this.oChart = new InteractiveDonutChart();
			this.oChart.addSegment( new InteractiveDonutChartSegment({selected : true}));
			this.oChart.addSegment( new InteractiveDonutChartSegment());
			this.oChart.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Method getSelectedSegments - single selection", function(assert) {
		//Arrange
		var aSegments = this.oChart.getAggregation("segments");
		var aSelectedSegments = this.oChart.getSelectedSegments();

		//Assert
		assert.equal(aSelectedSegments.length, 1, "One segment is selected");
		assert.equal(aSelectedSegments[0].getSelected(), true, "First segment is selected");
		assert.equal(aSelectedSegments[0].getId(), aSegments[0].getId(), "First selected segment is the first segment of the aggregation segments");
	});

	QUnit.test("Method getSelectedSegments - multiple selection", function(assert) {
		//Arrange
		this.oChart.addSegment(new InteractiveDonutChartSegment({selected : true}));
		var aSegments = this.oChart.getAggregation("segments");
		var aSelectedSegments = this.oChart.getSelectedSegments();

		//Assert
		assert.equal(aSelectedSegments.length, 2, "Two segments are selected");
		assert.equal(aSelectedSegments[0].getSelected(), true, "First segment is selected");
		assert.equal(aSelectedSegments[0].getId(), aSegments[0].getId(), "First selected segment is the first segment of the aggregation segments");
		assert.equal(aSelectedSegments[1].getId(), aSegments[2].getId(), "Second selected segment is the third segment of the aggregation segments");
	});

	QUnit.test("Method setSelectedSegments - single selection", function(assert) {
		//Arrange
		var aSegments = this.oChart.getAggregation("segments");

		//Act
		this.oChart.setSelectedSegments(aSegments[1]);

		//Assert
		assert.equal(aSegments[0].getSelected(), false, "First segment is not selected");
		assert.equal(aSegments[1].getSelected(), true, "Second segment is selected");
	});

	QUnit.test("Method setSelectedSegments - multiple selection", function(assert) {
		//Arrange
		this.oChart.addSegment(new InteractiveDonutChartSegment({selected : true}));
		this.oChart.addSegment(new InteractiveDonutChartSegment());
		var aSegments = this.oChart.getAggregation("segments");

		//Act
		this.oChart.setSelectedSegments([aSegments[1], this.oChart.getAggregation("segments")[3]]);

		//Assert
		assert.equal(aSegments[0].getSelected(), false, "First segment is not selected");
		assert.equal(aSegments[1].getSelected(), true, "Second segment is selected");
		assert.equal(aSegments[2].getSelected(), false, "Third segment is not selected");
		assert.equal(aSegments[3].getSelected(), true, "Fourth segment is selected");
	});

	QUnit.test("Method setSelectedSegments - selection contains an invalid segment element", function(assert) {
		//Arrange
		var aSegments = this.oChart.getAggregation("segments");
		var oInvalidSegment = new InteractiveDonutChartSegment({label : "invalidSegment"});
		sinon.spy(Log, "warning");

		//Act
		this.oChart.setSelectedSegments([aSegments[1], oInvalidSegment]);

		//Assert
		assert.equal(aSegments[0].getSelected(), false, "First segment is not selected");
		assert.equal(aSegments[1].getSelected(), true, "Second segment is selected");
		assert.equal(Log.warning.callCount, 1, "Warning logged once");
		assert.ok(Log.warning.calledWith("Method setSelectedSegments called with invalid InteractiveDonutChartSegment element"),
			"Warning logged with expected message");

		// Restore
		Log.warning.restore();
	});

	QUnit.test("Method setSelectedSegments - selection contains an invalid object", function(assert) {
		//Arrange
		var aSegments = this.oChart.getAggregation("segments");
		var oInvalidElement = {label : "dummy"};
		sinon.spy(Log, "warning");

		//Act
		this.oChart.setSelectedSegments([aSegments[1], oInvalidElement]);

		//Assert
		assert.equal(aSegments[0].getSelected(), false, "First segment is not selected");
		assert.equal(aSegments[1].getSelected(), true, "Second segment is selected");
		assert.equal(Log.warning.callCount, 1, "Warning logged once");
		assert.ok(Log.warning.calledWith("Method setSelectedSegments called with invalid InteractiveDonutChartSegment element"),
			"Warning logged with expected message");

		// Restore
		Log.warning.restore();
	});

	QUnit.test("Method setSelectedSegments - selection contains an array of two invalid objects only", function(assert) {
		//Arrange
		var aSegments = this.oChart.getAggregation("segments");
		var aArrayOfInvalidObjects = [{label : "dummy1"}, {label : "dummy2"}];
		sinon.spy(Log, "warning");

		//Act
		this.oChart.setSelectedSegments(aArrayOfInvalidObjects);

		//Assert
		assert.equal(aSegments[0].getSelected(), false, "First segment is not selected");
		assert.equal(aSegments[1].getSelected(), false, "Second segment is not selected");
		assert.equal(Log.warning.callCount, 2, "Warning logged twice");

		// Restore
		Log.warning.restore();
	});

	QUnit.test("Method _deselectAllSelectedSegments", function(assert) {
		//Act
		this.oChart._deselectAllSelectedSegments();

		//Assert
		assert.equal(this.oChart.getAggregation("segments")[0].getSelected(), false, "First segment is not selected");
		assert.equal(this.oChart.getAggregation("segments")[1].getSelected(), false, "Second segment is not selected");
	});

	QUnit.test("Method _toggleSelected adds selected class when it is selected", function(assert) {
		//Arrange
		var iIndex = 0;
		var $InteractionArea = this.oChart.$("interactionArea-" + iIndex);
		$InteractionArea.addClass(this.oChart.SEGMENT_CSSCLASS_SELECTED);
		var oSpyGetSegments = sinon.spy(this.oChart, "getAggregation");
		//Act
		this.oChart._toggleSelected(iIndex);
		//Assert
		assert.ok(oSpyGetSegments.called, "getSegments is called");
		assert.equal($InteractionArea.hasClass(this.oChart.SEGMENT_CSSCLASS_SELECTED), false, "Interaction area doesn't have _segmentSelectedClass");
	});

	QUnit.test("Method _toggleSelected removes selected class when the item is being deselected", function(assert) {
		//Arrange
		var iIndex = 0;
		var $InteractionArea = this.oChart.$("interactionArea-" + iIndex);
		$InteractionArea.addClass(this.oChart.SEGMENT_CSSCLASS_SELECTED);
		var oSpyGetSegments = sinon.spy(this.oChart, "getAggregation");

		//Act
		this.oChart._toggleSelected(iIndex);

		//Assert
		assert.ok(oSpyGetSegments.calledWith("segments"), "getAggregation on segments is called");
		assert.equal($InteractionArea.hasClass(this.oChart.SEGMENT_CSSCLASS_SELECTED), false, "Interaction area doesn't have _segmentSelectedClass");
	});

	QUnit.test("Method _getSegmentColor mixes the colors with the right factor for getting a valid segment color", function(assert) {
		//Arrange
		this.oChart.addSegment(new InteractiveDonutChartSegment());
		this.oChart.addSegment(new InteractiveDonutChartSegment());
		var oDonutRenderer = this.oChart.getRenderer();
		var iSegmentsCount = this.oChart.getSegments().length;
		var oSpyMixColors = sinon.spy(oDonutRenderer, "_mixColors");
		//Act
		for (var i = 0; i < iSegmentsCount; i++) {
			oDonutRenderer._getSegmentColor(i, iSegmentsCount);
		}
		//Assert
		assert.equal(oSpyMixColors.callCount, iSegmentsCount, "The function mixColors was called " + iSegmentsCount + " times for retrieving the right color value for each segment");
		assert.ok(oSpyMixColors.firstCall.calledWith(sinon.match.any, sinon.match.any, 0), "The function mixColors was called with the mix factor of 0");
		assert.ok(oSpyMixColors.secondCall.calledWith(sinon.match.any, sinon.match.any, 0.25), "The function mixColors was called with the mix factor of 25%");
		assert.ok(oSpyMixColors.thirdCall.calledWith(sinon.match.any, sinon.match.any, 0.5), "The function mixColors was called with the mix factor of 50%");
		assert.ok(oSpyMixColors.lastCall.calledWith(sinon.match.any, sinon.match.any, 0.75), "The function mixColors was called with the mix factor of 75%");
	});

	QUnit.test("Method _mixColors creates correct colors", function(assert) {
		//Arrange
		var oDonutRenderer = this.oChart.getRenderer();
		//Act
		// Belize
		var color1 = "#427cac",
			color2 = "#ffffff";
		var SMixedColor1 = oDonutRenderer._mixColors(color1, color2, 1);
		var SMixedColor2 = oDonutRenderer._mixColors(color1, color2, 0.5);
		var SMixedColor3 = oDonutRenderer._mixColors(color1, color2, 0.33);
		var SMixedColor4 = oDonutRenderer._mixColors(color1, color2, 0.66);
		// Belize-Plus
		color1 = "#91c8f6";
		var SMixedColor5 = oDonutRenderer._mixColors(color1, color2, 1);
		var SMixedColor6 = oDonutRenderer._mixColors(color1, color2, 0.5);
		var SMixedColor7 = oDonutRenderer._mixColors(color1, color2, 0.33);
		var SMixedColor8 = oDonutRenderer._mixColors(color1, color2, 0.66);
		// HCB
		color1 = "#ffffff";
		var SMixedColor9 = oDonutRenderer._mixColors(color1, color2, 1);
		var SMixedColor10 = oDonutRenderer._mixColors(color1, color2, 0.5);
		var SMixedColor11 = oDonutRenderer._mixColors(color1, color2, 0.33);
		var SMixedColor12 = oDonutRenderer._mixColors(color1, color2, 0.66);

		//Assert
		assert.equal(SMixedColor1, "#427cac", "Mixed color 1 correctly mixed with given weight");
		assert.equal(SMixedColor2, "#a1bed6", "Mixed color 2 correctly mixed with given weight");
		assert.equal(SMixedColor3, "#80a7c7", "Mixed color 3 correctly mixed with given weight");
		assert.equal(SMixedColor4, "#bfd2e3", "Mixed color 4 correctly mixed with given weight");

		assert.equal(SMixedColor5, "#91c8f6", "Mixed color 5 correctly mixed with given weight");
		assert.equal(SMixedColor6, "#c8e4fb", "Mixed color 6 correctly mixed with given weight");
		assert.equal(SMixedColor7, "#b5daf9", "Mixed color 7 correctly mixed with given weight");
		assert.equal(SMixedColor8, "#daecfc", "Mixed color 8 correctly mixed with given weight");

		assert.equal(SMixedColor9, "#ffffff", "Mixed color 9 correctly mixed with given weight");
		assert.equal(SMixedColor10, "#ffffff", "Mixed color 10 correctly mixed with given weight");
		assert.equal(SMixedColor11, "#ffffff", "Mixed color 11 correctly mixed with given weight");
		assert.equal(SMixedColor12, "#ffffff", "Mixed color 12 correctly mixed with given weight");
	});

	QUnit.module("Responsiveness tests", {
		beforeEach: function() {
			this.oChart = new InteractiveDonutChart({
				segments: [
					new InteractiveDonutChartSegment({label: "May", selected: true, value: 33.1, displayedValue: "very long displayed value"}),
					new InteractiveDonutChartSegment({label: "June", value: 31.7, displayedValue: "very long value"}),
					new InteractiveDonutChartSegment({label: "July", selected: true, value: 23.1})
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

	QUnit.test("Vertical responsiveness: show chart", function(assert) {
		//Arrange
		this.oFlexBox.setHeight("116px");
		//Act
		this.oChart.rerender();
		//Assert
		assert.notEqual(this.oChart.$().css("visibility"), "hidden", "The chart is visible");
	});

	QUnit.test("Vertical responsiveness: hide chart", function(assert) {
		//Arrange
		this.oFlexBox.setHeight("109px");
		//Act
		this.oChart.rerender();
		//Assert
		assert.equal(this.oChart.$().css("visibility"), "hidden", "The chart is invisible");
	});

	QUnit.test("Vertical responsiveness: non-interactive mode", function(assert) {
		//Arrange
		var bChartNonInteractiveInitial = this.oChart.$().hasClass("sapSuiteIDCNonInteractive");
		this.oFlexBox.setHeight("112px");
		//Act
		this.oChart.rerender();
		//Assert
		var bChartNonInteractive = this.oChart.$().hasClass("sapSuiteIDCNonInteractive");
		assert.notEqual(this.oChart.$().css("visibility"), "hidden", "The chart is visible");
		assert.equal(bChartNonInteractiveInitial, false, "The chart was interactive initially");
		assert.equal(bChartNonInteractive, true, "The chart is non-interactive after changing the height");
	});

	QUnit.test("Vertical responsiveness: hide chart", function(assert) {
		//Arrange
		this.oFlexBox.setHeight("109px");
		//Act
		this.oChart.rerender();
		//Assert
		assert.equal(this.oChart.$().css("visibility"), "hidden", "The chart is invisible");
	});

	QUnit.test("Vertical responsiveness: small font", function(assert) {
		//Arrange
		var bChartSmallFontInitial = this.oChart.$().hasClass("sapSuiteIDCSmallFont");
		this.oFlexBox.setHeight("120px");
		//Act
		this.oChart.rerender();
		//Assert
		var bChartSmallFont = this.oChart.$().hasClass("sapSuiteIDCSmallFont");
		assert.notEqual(this.oChart.$().css("visibility"), "hidden", "The chart is visible");
		assert.equal(bChartSmallFontInitial, false, "The chart has, initially, normal font");
		assert.equal(bChartSmallFont, true, "The chart has small font after changing the width");
	});

	QUnit.test("Horizontal responsiveness: show whole chart", function(assert) {
		//Arrange
		var bChartNonInteractive = this.oChart.$().hasClass("sapSuiteIDCNonInteractive");
		var $ChartDonut = this.oChart.$().find(".sapSuiteIDCChart");
		var $ChartLegend = this.oChart.$().find(".sapSuiteIDCLegend");
		//Act
		//Assert
		assert.notEqual(this.oChart.$().css("visibility"), "hidden", "The chart is visible");
		assert.equal(bChartNonInteractive, false, "The chart is interactive");
		assert.notEqual($ChartDonut.length, 0, "The chart has donut");
		assert.notEqual($ChartLegend.length, 0, "The chart has legend");
	});

	QUnit.test("Horizontal responsiveness: hide donut", function(assert) {
		//Arrange
		this.oFlexBox.setWidth("220px");
		//Act
		this.oChart.rerender();
		//Assert
		var $ChartLegend = this.oChart.$().find(".sapSuiteIDCLegend");
		var bChartFullWidth = this.oChart.$().hasClass("sapSuiteIDCFullWidth");
		var bChartSmallFont = this.oChart.$().hasClass("sapSuiteIDCFullWidthSmallFont");
		assert.notEqual(this.oChart.$().css("visibility"), "hidden", "The chart is visible");
		assert.notEqual($ChartLegend.length, 0, "The chart has legend");
		assert.equal(bChartFullWidth, true, "The chart is in full width mode (no donut)");
		assert.equal(bChartSmallFont, false, "The chart has no small fonts");
		for (var i = 0; i < this.oChart.getSegments().length; i++) {
			var sChartLegendMarkerCssVisibility = this.oChart.$().find(".sapSuiteIDCLegendMarker").eq(i).css("visibility");
			assert.equal(sChartLegendMarkerCssVisibility, "hidden", "The chart legend marker " + (i + 1) + " is not visible");
		}
	});

	QUnit.test("Horizontal responsiveness: hide chart", function(assert) {
		//Arrange
		this.oFlexBox.setWidth("109px");
		//Act
		this.oChart.rerender();
		//Assert
		assert.equal(this.oChart.$().css("visibility"), "hidden", "The chart is invisible");
	});

	QUnit.test("Horizontal responsiveness: small font in normal mode", function(assert) {
		//Arrange
		var bChartSmallFontInitial = this.oChart.$().hasClass("sapSuiteIDCSmallLegendPadding");
		this.oFlexBox.setWidth("290px");
		//Act
		this.oChart.rerender();
		//Assert
		var bChartSmallFont = this.oChart.$().hasClass("sapSuiteIDCSmallLegendPadding");
		assert.notEqual(this.oChart.$().css("visibility"), "hidden", "The chart is visible");
		assert.equal(bChartSmallFontInitial, false, "Initially, the chart has normal font");
		assert.equal(bChartSmallFont, true, "After changing the width, the chart has small font");
	});

	QUnit.test("Horizontal responsiveness: small font in full width mode", function(assert) {
		//Arrange
		var bChartSmallFontInitial = this.oChart.$().hasClass("sapSuiteIDCFullWidthSmallFont");
		this.oFlexBox.setWidth("170px");
		//Act
		this.oChart.rerender();
		//Assert
		var bChartSmallFont = this.oChart.$().hasClass("sapSuiteIDCFullWidthSmallFont");
		assert.notEqual(this.oChart.$().css("visibility"), "hidden", "The chart is visible");
		assert.equal(bChartSmallFontInitial, false, "Initially, the chart has normal font");
		assert.equal(bChartSmallFont, true, "After changing the width, the chart has small font");
	});

	QUnit.module("Responsiveness tests (compact)", {
		beforeEach: function() {
			this.oChart = new InteractiveDonutChart({
				segments: [
					new InteractiveDonutChartSegment({label: "May", selected: true, value: 33.1, displayedValue: "very long displayed value"}),
					new InteractiveDonutChartSegment({label: "June", value: 31.7, displayedValue: "very long value"}),
					new InteractiveDonutChartSegment({label: "July", selected: true, value: 23.1}),
					new InteractiveDonutChartSegment({label: "Aug", selected: false, value: 55.2})
				],
				displayedSegments: 4
			});
			this.oFlexBox = new FlexBox("flexbox", {
				width: "50rem",
				height: "50rem",
				items: [this.oChart]
			}).placeAt("qunit-fixture");
			this.oFlexBox.addStyleClass("sapUiSizeCompact");
			sap.ui.getCore().applyChanges();
			this.oChart._handleThemeApplied();
		},
		afterEach: function() {
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

	QUnit.test("Vertical responsiveness: small font", function(assert) {
		//Arrange
		var bChartSmallFontInitial = this.oChart.$().hasClass("sapSuiteIDCSmallFont");
		this.oFlexBox.setHeight("132px");
		//Act
		this.oChart.rerender();
		//Assert
		var bChartSmallFont = this.oChart.$().hasClass("sapSuiteIDCSmallFont");
		assert.notEqual(this.oChart.$().css("visibility"), "hidden", "The chart is visible");
		assert.equal(bChartSmallFontInitial, false, "Initially, the chart has normal font");
		assert.equal(bChartSmallFont, true, "After changing the width, the chart has small font");
	});

	QUnit.test("Vertical responsiveness: non-interactive mode", function(assert) {
		//Arrange
		var bChartNonInteractiveInitial = this.oChart.$().hasClass("sapSuiteIDCNonInteractive");
		this.oFlexBox.setHeight("135px");
		//Act
		this.oChart.rerender();
		//Assert
		var bChartNonInteractive = this.oChart.$().hasClass("sapSuiteIDCNonInteractive");
		assert.notEqual(this.oChart.$().css("visibility"), "hidden", "The chart is visible");
		assert.equal(bChartNonInteractiveInitial, false, "Initially, the chart was interactive");
		assert.equal(bChartNonInteractive, true, "After changing the height, the chart is non-interactive");
	});

	QUnit.module("Adjusts to parent inside a Flexbox", {
		beforeEach: function() {
			this.oChart = new InteractiveDonutChart();
			this.oChart.addSegment( new InteractiveDonutChartSegment({selected : true}));
			this.oChart.addSegment( new InteractiveDonutChartSegment());
			this.oFlexBox = new FlexBox("fbFlexBox-idc", {
				items: [this.oChart],
				width: "20rem",
				height: "10rem"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
			sinon.spy(this.oChart, "_adjustToParent");
		},
		afterEach: function() {
			this.oChart.destroy();
			this.oChart = null;
			this.oFlexBox.destroy();
			this.oFlexBox = null;
		}
	});

	QUnit.test("Chart is rendered with the proper width and height", function(assert) {
		//Arrange
		var iChartWidthExpected = this.oFlexBox.$().innerWidth();
		var iChartHeightExpected = this.oFlexBox.$().innerHeight();
		//Act
		//Assert
		assert.equal(this.oChart.$().outerWidth(true), iChartWidthExpected, "Chart is rendered with expected width");
		assert.equal(this.oChart.$().outerHeight(true), iChartHeightExpected, "Chart is rendered with expected height");
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
		assert.equal(this.oChart.data("_parentRenderingContext"), this.oFlexBox, "A correct control has been set as parent context");
	});

	QUnit.module("ARIA tests", {
		beforeEach: function() {
			this.oChart = new InteractiveDonutChart({
				segments: [
					new InteractiveDonutChartSegment({
						label: "May",
						selected: true,
						value: 33.1
					}),
					new InteractiveDonutChartSegment({
						label: "June",
						value: 31.7
					}),
					new InteractiveDonutChartSegment({
						label: "July",
						selected: false
					})
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
		var $Area1 = this.oChart.$().find(".sapSuiteIDCLegendSegment").eq(0);
		var $Area2 = this.oChart.$().find(".sapSuiteIDCLegendSegment").eq(1);
		var $Area3 = this.oChart.$().find(".sapSuiteIDCLegendSegment").eq(2);
		//Assert
		//segment1
		assert.equal($Area1.attr("role"), "option", "The area1 role is <option>");
		assert.equal($Area1.attr("aria-label"), "May 33.1", "The area1 label is correct");
		assert.equal($Area1.attr("aria-selected"), "true", "The area1 is selected");
		assert.equal($Area1.attr("aria-posinset"), "1", "The area1 posinset is correct");
		assert.equal($Area1.attr("aria-setsize"), "3", "The area1 setsize is correct");
		//segment2
		assert.equal($Area2.attr("role"), "option", "The area2 role is <option>");
		assert.equal($Area2.attr("aria-label"), "June 31.7", "The area2 label is correct");
		assert.equal($Area2.attr("aria-selected"), "false", "The area2 is not selected");
		assert.equal($Area2.attr("aria-posinset"), "2", "The area2 posinset is correct");
		assert.equal($Area2.attr("aria-setsize"), "3", "The area2 setsize is correct");
		//segment3
		assert.equal($Area3.attr("role"), "option", "The area3 role is <option>");
		assert.equal($Area3.attr("aria-label"), "July N/A", "The area3 label is correct");
		assert.equal($Area3.attr("aria-selected"), "false", "The area3 is not selected");
		assert.equal($Area3.attr("aria-posinset"), "3", "The area3 posinset is correct");
		assert.equal($Area3.attr("aria-setsize"), "3", "The area3 setsize is correct");
	});

	QUnit.test("Semantic colors", function(assert) {
		//Arrange
		this.oChart.getSegments()[0].setColor(ValueColor.Good);
		sap.ui.getCore().applyChanges();

		//Act
		//Assert
		assert.equal(this.oChart.$("interactionArea-0").attr("aria-label"), "May 33.1 Good", "The area1 label is correct");
		assert.equal(this.oChart.$("interactionArea-1").attr("aria-label"), "June 31.7 Neutral", "The area2 label is correct");
		assert.equal(this.oChart.$("interactionArea-2").attr("aria-label"), "July N/A Neutral", "The area3 label is correct");
	});


	QUnit.test("Chart rendering (interactive)", function(assert) {
		//Arrange
		//Act
		//Assert
		var $Chart = this.oChart.$();
		assert.equal($Chart.attr("role"), "listbox", "The chart role is <listbox>");
		assert.equal($Chart.attr("aria-multiselectable"), "true", "The chart is multiselectable");
		assert.equal($Chart.attr("aria-disabled"), "false", "The chart is not disabled");
		assert.equal($Chart.hasClass("sapSuiteIDCNonInteractive"), false, "The chart is interactive");
	});

	QUnit.test("Chart rendering (non-interactive)", function(assert) {
		//Arrange
		this.oChart.$().height("112px");
		//Act
		this.oChart._onResize();
		//Assert
		var $Chart = this.oChart.$();
		assert.equal($Chart.hasClass("sapSuiteIDCNonInteractive"), true, "The chart is non-interactive");
		assert.equal($Chart.attr("role"), "button", "The chart role is <button>");
		assert.equal($Chart.attr("aria-multiselectable"), "false", "The chart is not multiselectable");
		assert.equal($Chart.attr("aria-disabled"), "true", "The chart is disabled because is non-interactive");
	});

	QUnit.test("Chart rendering (non-interactive switch to interactive)", function(assert) {
		//Arrange
		this.oChart.$().height("112px");
		//Act
		this.oChart._onResize();
		this.oChart.$().height("400px");
		this.oChart._onResize();
		//Assert
		var $Chart = this.oChart.$();
		assert.equal($Chart.hasClass("sapSuiteIDCNonInteractive"), false, "The chart is interactive");
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
		var sDescribedBy = sId + "-interactionArea-0," + sId + "-interactionArea-1," + sId + "-interactionArea-2";
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
		var $Area = this.oChart.$().find(".sapSuiteIDCLegendSegment").eq(0);
		var sAreaSelectedInitial = $Area.attr("aria-selected");
		//Act
		this.oChart._toggleSelected(0);
		//Assert
		var sAreaSelected = $Area.attr("aria-selected");
		assert.equal(sAreaSelectedInitial, "true", "Initially, the first area is selected");
		assert.equal(sAreaSelected, "false", "After changing the selection, the first area is not selected");
	});

	QUnit.module("Execution of functions onAfterRendering", {
		beforeEach : function() {
			this.oChart = new InteractiveDonutChart({
				segments : [
					new InteractiveDonutChartSegment({label: "May", selected: true, value: 33.1}),
					new InteractiveDonutChartSegment({label: "June", value: 31.7}),
					new InteractiveDonutChartSegment({label: "July", selected: false})
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
		oAttachIntervalTimer.restore();
	});

	QUnit.module("Tooltip tests", {
		beforeEach: function() {
			this.oChart = new InteractiveDonutChart({
				segments: [
					new InteractiveDonutChartSegment({label: "Label1", selected: true, value: 33.1, displayedValue: "Text 1"}),
					new InteractiveDonutChartSegment({label: "Label2", value: 31.7}),
					new InteractiveDonutChartSegment({label: "Label3"})
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

	QUnit.test("Interactive", function(assert) {
		//Arrange
		this.oFlexBox.setHeight("300px");
		this.oChart.rerender();
		//Act
		//Assert
		var oLegendSegment = this.oChart.$().find(".sapSuiteIDCLegendSegment");
		var oChartSegment = this.oChart.$().find(".sapSuiteIDCChartSegment title");
		var oChartSegmentGhost = this.oChart.$().find(".sapSuiteIDCChartSegmentGhost title");
		var sExpectedChartTitle = undefined;
		var sExpectedSegmentTitle1 = "Label1:33.1";
		var sExpectedSegmentLegendTitle1 = "Label1:33.1";
		var sExpectedSegmentTitle2 = "Label2:31.7";
		var sExpectedSegmentLegendTitle2 = "Label2:31.7";
		var sExpectedSegmentLegendTitle3 = "Label3:N/A";
		var sActualChartTitle = this.oChart.$().attr("title");
		var sActualLegendSegment1 = oLegendSegment.eq(0).attr("title").replace(/[\n]/g, "");
		var sActualLegendSegment2 = oLegendSegment.eq(1).attr("title").replace(/[\n]/g, "");
		var sActualLegendSegment3 = oLegendSegment.eq(2).attr("title").replace(/[\n]/g, "");
		var sActualChartSegment1 = oChartSegment.eq(0).text().replace(/[\n]/g, "");
		var sActualChartSegment2 = oChartSegment.eq(1).text().replace(/[\n]/g, "");
		var sActualChartSegment3 = oChartSegment.eq(2).text().replace(/[\n]/g, "");
		var sActualChartSegmentGhost1 = oChartSegmentGhost.eq(0).text().replace(/[\n]/g, "");
		var sActualChartSegmentGhost2 = oChartSegmentGhost.eq(1).text().replace(/[\n]/g, "");
		var sActualChartSegmentGhost3 = oChartSegmentGhost.eq(2).text().replace(/[\n]/g, "");

		assert.equal(sActualChartTitle, sExpectedChartTitle, "Chart title correctly set");
		// segment with displayedValue set
		assert.equal(sActualLegendSegment1, sExpectedSegmentLegendTitle1, "Legend segment 1 title correctly set");

		// segment without displayedValue
		assert.equal(sActualLegendSegment2, sExpectedSegmentLegendTitle2, "Legend segment 2 title correctly set");

		// N/A segment
		assert.equal(sActualLegendSegment3, sExpectedSegmentLegendTitle3, "Legend segment 3 title correctly set");
		assert.equal(sActualChartSegment1, sExpectedSegmentTitle1, "Chart segment 1 title correctly set");
		assert.equal(sActualChartSegment2, sExpectedSegmentTitle2, "Chart segment 2 title correctly set");
		assert.equal(sActualChartSegment3, "", "Chart segment 3 title should be empty as it is not rendered");
		assert.equal(sActualChartSegmentGhost1, sExpectedSegmentTitle1, "Chart segment ghost 1 title correctly set");
		assert.equal(sActualChartSegmentGhost2, sExpectedSegmentTitle2, "Chart segment ghost 2 title correctly set");
		assert.equal(sActualChartSegmentGhost3, "", "Chart segment ghost 3 title should be empty as it is not rendered");
	});

	QUnit.test("Non-Interactive", function(assert) {
		//Arrange
		this.oFlexBox.setHeight("120px");
		this.oFlexBox.setWidth("320px");
		this.oChart.rerender();
		//Act
		//Assert
		var oLegendSegment = this.oChart.$().find(".sapSuiteIDCLegendSegment");
		var oChartSegment = this.oChart.$().find(".sapSuiteIDCChartSegment title");
		var oChartSegmentGhost = this.oChart.$().find(".sapSuiteIDCChartSegmentGhost title");
		var sExpectedChartTitle = "Label1: 33.1\nLabel2: 31.7\nLabel3: N/A";
		var sExpectedSegmentTitle1 = undefined;
		var sExpectedSegmentTitle2 = undefined;
		var sExpectedSegmentTitle3 = undefined;
		var sActualChartTitle = this.oChart.$().attr("title");
		var sActualLegendSegment1 = oLegendSegment.eq(0).attr("title");
		var sActualLegendSegment2 = oLegendSegment.eq(1).attr("title");
		var sActualLegendSegment3 = oLegendSegment.eq(2).attr("title");

		assert.equal(sActualChartTitle, sExpectedChartTitle, "Chart title correctly set");
		// segment with displayedValue set
		assert.equal(sActualLegendSegment1, sExpectedSegmentTitle1, "Legend segment 1 title correctly set");
		// segment without displayedValue
		assert.equal(sActualLegendSegment2, sExpectedSegmentTitle2, "Legend segment 2 title correctly set");
		// N/A segment
		assert.equal(sActualLegendSegment3, sExpectedSegmentTitle3, "Legend segment 3 title correctly set");
		assert.equal(oChartSegment.length, 0, "Chart segment title tag is not present");
		assert.equal(oChartSegmentGhost.length, 0, "Chart ghost segment title tag is not present");
	});

	QUnit.test("Interactive, but selection disabled", function(assert) {
		//Arrange
		this.oChart.setSelectionEnabled(false);
		this.oChart.rerender();
		//Act
		//Assert
		var oLegendSegment = this.oChart.$().find(".sapSuiteIDCLegendSegment");
		var oChartSegment = this.oChart.$().find(".sapSuiteIDCChartSegment title");
		var oChartSegmentGhost = this.oChart.$().find(".sapSuiteIDCChartSegmentGhost title");
		var sExpectedChartTitle = "Label1: 33.1\nLabel2: 31.7\nLabel3: N/A";
		var sExpectedSegmentTitle1 = undefined;
		var sExpectedSegmentTitle2 = undefined;
		var sExpectedSegmentTitle3 = undefined;
		var sActualChartTitle = this.oChart.$().attr("title");
		var sActualLegendSegment1 = oLegendSegment.eq(0).attr("title");
		var sActualLegendSegment2 = oLegendSegment.eq(1).attr("title");
		var sActualLegendSegment3 = oLegendSegment.eq(2).attr("title");

		assert.equal(sActualChartTitle, sExpectedChartTitle, "Chart title correctly set");
		// segment with displayedValue set
		assert.equal(sActualLegendSegment1, sExpectedSegmentTitle1, "Legend segment 1 title correctly set");
		// segment without displayedValue
		assert.equal(sActualLegendSegment2, sExpectedSegmentTitle2, "Legend segment 2 title correctly set");
		// N/A segment
		assert.equal(sActualLegendSegment3, sExpectedSegmentTitle3, "Legend segment 3 title correctly set");
		assert.equal(oChartSegment.length, 0, "Chart segment title tag is not present");
		assert.equal(oChartSegmentGhost.length, 0, "Chart ghost segment title tag is not present");
	});

	QUnit.test("Non-Interactive custom chart title", function(assert) {
		//Arrange
		this.oFlexBox.setHeight("120px");
		this.oFlexBox.setWidth("320px");
		this.oChart.setTooltip("custom tooltip");
		this.oChart.rerender();
		//Act
		//Assert
		var oLegendSegment = this.oChart.$().find(".sapSuiteIDCLegendSegment");
		var oChartSegment = this.oChart.$().find(".sapSuiteIDCChartSegment title");
		var oChartSegmentGhost = this.oChart.$().find(".sapSuiteIDCChartSegmentGhost title");
		var sExpectedChartTitle = "custom tooltip";
		var sExpectedSegmentTitle1 = undefined;
		var sExpectedSegmentTitle2 = undefined;
		var sExpectedSegmentTitle3 = undefined;
		var sActualChartTitle = this.oChart.$().attr("title");
		var sActualLegendSegment1 = oLegendSegment.eq(0).attr("title");
		var sActualLegendSegment2 = oLegendSegment.eq(1).attr("title");
		var sActualLegendSegment3 = oLegendSegment.eq(2).attr("title");

		assert.equal(sActualChartTitle, sExpectedChartTitle, "Chart title correctly set");
		// segment with displayedValue set
		assert.equal(sActualLegendSegment1, sExpectedSegmentTitle1, "Legend segment 1 title correctly set");
		// segment without displayedValue
		assert.equal(sActualLegendSegment2, sExpectedSegmentTitle2, "Legend segment 2 title correctly set");
		// N/A segment
		assert.equal(sActualLegendSegment3, sExpectedSegmentTitle3, "Legend segment 3 title correctly set");
		assert.equal(oChartSegment.length, 0, "Chart segment title tag is not present");
		assert.equal(oChartSegmentGhost.length, 0, "Chart ghost segment title tag is not present");
	});

	QUnit.test("Interactive custom segment tooltips", function(assert) {
		//Arrange
		this.oChart.getSegments()[0].setTooltip("custom tooltip 1");
		this.oChart.getSegments()[1].setTooltip("custom tooltip 2");
		this.oChart.getSegments()[2].setTooltip("custom tooltip 3");
		this.oChart.rerender();
		//Act
		//Assert
		var oLegendSegment = this.oChart.$().find(".sapSuiteIDCLegendSegment");
		var oChartSegment = this.oChart.$().find(".sapSuiteIDCChartSegment title");
		var oChartSegmentGhost = this.oChart.$().find(".sapSuiteIDCChartSegmentGhost title");
		var sExpectedChartTitle = undefined;
		var sExpectedSegmentTitle1 = "custom tooltip 1";
		var sExpectedSegmentTitle2 = "custom tooltip 2";
		var sExpectedSegmentTitle3 = "custom tooltip 3";
		var sActualChartTitle = this.oChart.$().attr("title");
		var sActualLegendSegment1 = oLegendSegment.eq(0).attr("title");
		var sActualLegendSegment2 = oLegendSegment.eq(1).attr("title");
		var sActualLegendSegment3 = oLegendSegment.eq(2).attr("title");
		var sActualLegendSegmentAriaLabel1 = oLegendSegment.eq(0).attr("aria-label");
		var sActualLegendSegmentAriaLabel2 = oLegendSegment.eq(1).attr("aria-label");
		var sActualLegendSegmentAriaLabel3 = oLegendSegment.eq(2).attr("aria-label");
		var sActualChartSegment1 = oChartSegment.eq(0).text();
		var sActualChartSegment2 = oChartSegment.eq(1).text();
		var sActualChartSegment3 = oChartSegment.eq(2).text();
		var sActualChartSegmentGhost1 = oChartSegmentGhost.eq(0).text();
		var sActualChartSegmentGhost2 = oChartSegmentGhost.eq(1).text();
		var sActualChartSegmentGhost3 = oChartSegmentGhost.eq(2).text();

		assert.equal(sActualChartTitle, sExpectedChartTitle, "Chart title correctly set");

		assert.equal(sActualLegendSegment1, sExpectedSegmentTitle1, "Legend segment 1 title correctly set");
		assert.equal(sActualLegendSegment2, sExpectedSegmentTitle2, "Legend segment 2 title correctly set");
		assert.equal(sActualLegendSegment3, sExpectedSegmentTitle3, "Legend segment 3 title correctly set");

		assert.equal(sActualLegendSegmentAriaLabel1, sExpectedSegmentTitle1, "Legend segment 1 aria-label correctly set");
		assert.equal(sActualLegendSegmentAriaLabel2, sExpectedSegmentTitle2, "Legend segment 2 aria-label correctly set");
		assert.equal(sActualLegendSegmentAriaLabel3, sExpectedSegmentTitle3, "Legend segment 3 aria-label correctly set");

		assert.equal(sActualChartSegment1, sExpectedSegmentTitle1, "Chart segment 1 title correctly set");
		assert.equal(sActualChartSegment2, sExpectedSegmentTitle2, "Chart segment 2 title correctly set");
		assert.equal(sActualChartSegment3, "", "Chart segment 3 title should be empty as it is not rendered");

		assert.equal(sActualChartSegmentGhost1, sExpectedSegmentTitle1, "Chart segment ghost 1 title correctly set");
		assert.equal(sActualChartSegmentGhost2, sExpectedSegmentTitle2, "Chart segment ghost 2 title correctly set");
		assert.equal(sActualChartSegmentGhost3, "", "Chart segment ghost 3 title should be empty as it is not rendered");
	});

	QUnit.test("Interactive custom segment tooltips with line break", function(assert) {
		//Arrange
		this.oChart.getSegments()[0].setTooltip("custom\ntooltip 1");
		this.oChart.rerender();

		//Act
		//Assert
		var $LegendSegment = this.oChart.$().find(".sapSuiteIDCLegendSegment").eq(0);
		var $ChartSegmentTitle = this.oChart.$().find(".sapSuiteIDCChartSegment title").eq(0);
		var $ChartSegmentGhostTitle = this.oChart.$().find(".sapSuiteIDCChartSegmentGhost title").eq(0);
		var sExpectedTooltip = "custom\ntooltip 1";

		assert.equal($LegendSegment.attr("title"), sExpectedTooltip, "Legend segment title correctly set");
		assert.equal(text($ChartSegmentTitle[0]), sExpectedTooltip, "Chart segment title correctly set");
		assert.equal(text($ChartSegmentGhostTitle[0]), sExpectedTooltip, "Chart segment ghost title correctly set");

		function text(element) {
			var aChildren = jQuery.makeArray(element.childNodes);
			var sHTML = "";
			for (var i = 0; i < aChildren.length; i++) {
				sHTML += aChildren[i].nodeName.toUpperCase() === "BR" ? "\n" : aChildren[i].textContent;
			}
			return sHTML;
		}
	});

	QUnit.test("Interactive chart, semantic colors", function(assert) {
		//Arrange
		this.oChart.getSegments()[0].setColor(ValueColor.Error);
		sap.ui.getCore().applyChanges();

		//Act
		//Assert
		assert.equal(this.oChart.$("interactionArea-0").attr("title"), "Label1:\n33.1 Critical", "The tooltip of the first legend entry has been set correctly.");
		assert.equal(this.oChart.$("interactionArea-1").attr("title"), "Label2:\n31.7 Neutral", "The tooltip of the second legend entry has been set correctly.");
		assert.equal(this.oChart.$("interactionArea-2").attr("title"), "Label3:\nN/A Neutral", "The tooltip of the third legend entry has been set correctly.");
	});

	QUnit.test("Suppress segment tooltip (interactive)", function(assert) {
		//Arrange
		this.oChart.getSegments()[0].setTooltip(" ");

		//Act
		this.oChart.rerender();

		//Assert
		var $LegendSegment = this.oChart.$().find(".sapSuiteIDCLegendSegment"),
			$ChartSegmentTitle = this.oChart.$().find(".sapSuiteIDCChartSegment title"),
			$ChartSegmentGhostTitle = this.oChart.$().find(".sapSuiteIDCChartSegmentGhost title"),
			sActualLegendSegment1 = $LegendSegment.eq(0).attr("title"),
			sActualChartSegment1 = $ChartSegmentTitle.eq(0).text(),
			sActualChartSegmentGhost1 = $ChartSegmentGhostTitle.eq(0).text(),
			sActualLegendSegmentAriaLabel1 = $LegendSegment.eq(0).attr("aria-label");
			sActualChartSegment1 = sActualChartSegment1.replace(/[\n]/g, "");
			sActualChartSegmentGhost1 = sActualChartSegmentGhost1.replace(/[\n]/g, "");
		assert.equal(sActualLegendSegment1, null, "First legend segment tooltip is not present");
		assert.equal(sActualChartSegment1, "Label2:31.7", "First chart segment tooltip is not present. Second chart segment tooltip is the first to show up.");
		assert.equal(sActualChartSegmentGhost1, "Label2:31.7", "First chart segment ghost tooltip is not present. Second chart segment ghost tooltip is the first to show up.");
		assert.equal(sActualLegendSegmentAriaLabel1, "Label1 Text 1", "First legend segment aria-label contains standard tooltip text");
	});
});
