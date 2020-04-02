/*global QUnit, sinon */

sap.ui.define([
	"sap/ui/core/Core",
	"sap/gantt/simple/UtilizationLineChart",
	"sap/gantt/simple/UtilizationBarChart",
	"sap/gantt/simple/UtilizationDimension",
	"sap/gantt/simple/UtilizationPeriod",
	"sap/gantt/misc/AxisTime",
	"sap/gantt/misc/Format"
],function(
	Core,
	UtilizationLineChart,
	UtilizationBarChart,
	UtilizationDimension,
	UtilizationPeriod,
	AxisTime,
	Format
) {
	"use strict";

	var placeAt = function(oElement) {
		var target = document.getElementById("content");
		var oRm = Core.createRenderManager();
		oRm.write('<svg id="svg-container" xmlns="http://www.w3.org/2000/svg" width="500" height="100" viewBox="0 0 500 100" version="1.1">');
		oElement.renderElement(oRm, oElement);
		oRm.write('</svg>');
		oRm.flush(target);
		oRm.destroy();
	};

	var mockAxisTime = function(oElement, aTimeRange) {
		oElement.setRowYCenter(50);
		oElement._iBaseRowHeight = 100;
		oElement.mAxisTime = new AxisTime(aTimeRange, [0, 500]);
	};

	var aTimeRange = [Format.abapTimestampToDate("20180101000000"), Format.abapTimestampToDate("20180331235959")];


	// ================================================================================
	// Utilization Line Chart
	// ================================================================================
	QUnit.module("UtilizationLineChart Basic", {
		beforeEach: function() {
			this.sut = new UtilizationLineChart({
				time: aTimeRange[0],
				endTime: aTimeRange[1]
			});

			mockAxisTime(this.sut, aTimeRange);
			placeAt(this.sut);
		},
		afterEach: function() {
			this.sut.destroy();
			this.sut = null;
		}
	});

	QUnit.test("Initial Rendering", function(assert) {
		assert.notEqual(jQuery.sap.domById(this.sut.getId()), null, "ULC Svg Element should be rendered");
	});

	QUnit.test("Property - Default Values", function(assert) {
		assert.equal(this.sut.getShowMiddleLine(), true, "Default showMiddleLine");
		assert.equal(this.sut.getOverConsumptionMargin(), 25.0, "Default overConsumptionMargin");
		assert.equal(this.sut.getOverConsumptionColor(), "red", "Default overConsumptionColor");
		assert.equal(this.sut.getRemainCapacityColor(), "lightgray", "Default remainCapacityColor");

		assert.ok(this.sut.mDefaultDefs != null, "Default over consuption pattern created");
	});

	QUnit.test("Property - calculated values", function(assert) {
		assert.equal(this.sut.getHeight(), 100, "Height default value is inherit to row height");
		assert.equal(this.sut.getWidth(), 500, "The ULC shape width is correct");
	});

	var aPeriods = [
		{
			from: "20180101000000",
			to: "20180101000000",
			value: 0
		},
		{
			from: "20180101000000",
			to: "20180201000000",
			value: 0
		},
		{
			from: "20180201000000",
			to: "20180201000000",
			value: 120
		},
		{
			from: "20180201000000",
			to: "20180301000000",
			value: 120
		},
		{
			from: "20180301000000",
			to: "20180301000000",
			value: 0
		},
		{
			from: "20180301000000",
			to: "20180331000000",
			value: 0
		}
	].map(function(oItem){
		oItem.from = Format.abapTimestampToDate(oItem.from);
		oItem.to = Format.abapTimestampToDate(oItem.to);
		return oItem;
	});

	QUnit.module("UtilizationLineChart with dimensions", {
		beforeEach: function(){
			var oJSONModel = new sap.ui.model.json.JSONModel();
			oJSONModel.setData(aPeriods);
			this.sut = new UtilizationLineChart({
				time: aTimeRange[0],
				endTime: aTimeRange[1],
				dimensions: [
					new UtilizationDimension({
						name: "Weight",
						dimensionColor: "yellow",
						periods: {
							path :"/",
							template: new UtilizationPeriod({
								from: "{from}",
								to: "{to}",
								value: "{value}"
							}),
							templateSharable: true
						}
					})
				]
			});


			this.sut.setModel(oJSONModel);
		},
		afterEach: function() {
			this.sut.destroy();
			this.sut = null;
		}
	});

	QUnit.test("aggregation binding: dimension & periods", function(assert) {
		assert.equal(this.sut.getDimensions().length, 1, "1 dimension bound to ULC");

		var oDimension = this.sut.getDimensions()[0];
		assert.equal(oDimension.getName(), "Weight", "dimension name set correctly");
		assert.equal(oDimension.getDimensionColor(), "yellow", "dimension color set correctly");
		assert.equal(oDimension.getPeriods().length, 6, "6 periods belongs to first dimension");
	});

	QUnit.test("Rendering - with dimensions", function(assert) {
		mockAxisTime(this.sut, aTimeRange);
		placeAt(this.sut);

		var $dom = jQuery.sap.byId(this.sut.getId());
		assert.ok($dom.hasClass("sapGanttUtilizationLine"), "DOM has correct class name");

		assert.ok(this.sut.getDomRef(), "The element DOM is found");

		var oDimension = this.sut.getDimensions()[0],
			sClipPathId = oDimension.getId() + "-clipPath";
		// there will be a clipPath generated for this dimension
		assert.ok(jQuery.sap.domById(sClipPathId) != null, "dimension clippath rendered");

		// each dimension has a path, a rectangle which refer to the over comsumption clip-path and normal clip-Path
		assert.ok(jQuery.sap.domById(oDimension.getId() + "-ulcPath"), "The dimension has the actual path DOM");
		assert.ok(jQuery.sap.domById(oDimension.getId() + "-ulcRect"), "The dimension has a rectangle clip the remain consuption");

		// middleLine is rendered
		assert.ok($dom.find("path.sapGanttUtilizationMiddleLine").length === 1, "middle line is rendered");
		assert.ok(this.sut.getDomRef("middleLine"), "there is an element with -middleLine suffix");

		// rendered has correct tooltip rectangles, the other 3 has 0 width so will not rendered
		assert.equal($dom.find(".ulc-tooltips rect").length, 3, "DOM has 3 rectangles to show tooltips");

		// there is a ulc background rendered
		assert.ok(this.sut.getDomRef("ulcBg"), "there is an element with -ulcBg suffix");

		// there is a ulc over capacity background rendered
		assert.ok(this.sut.getDomRef("ulcOverConsumptionBg"), "there is an element with -ulcOverConsumptionBg suffix");
	});

	QUnit.test("Rendering - inner element widths heights", function(assert) {
		mockAxisTime(this.sut, aTimeRange);
		placeAt(this.sut);

		var fnValueOf = function($elem, sAttr) {
			return parseInt($elem.attr(sAttr), 10);
		};

		var $ulcBg = jQuery(this.sut.getDomRef("ulcBg"));
		assert.equal(fnValueOf($ulcBg, "height"), 100, "the ulc background taken the entire row height");
		assert.equal(fnValueOf($ulcBg, "width"), 500, "the ulc background width is as same as the UtilizationLineChart range width");

		var $ulcOverBg = jQuery(this.sut.getDomRef("ulcOverConsumptionBg"));

		assert.equal(fnValueOf($ulcOverBg, "height"), this.sut.getThresholdHeight(100), "the ulc over consumption height calculate correctly");
		assert.equal(fnValueOf($ulcOverBg, "width"), fnValueOf($ulcBg, "width"), "the ulc over consumption width is same as ulcBg");
	});

	// ================================================================================
	// Utilization Bar Chart
	// ================================================================================


	var fnMockGanttChartBase = function(oElement) {
		sinon.stub(oElement, "getGanttChartBase").returns({
			getRenderedTimeRange: function() {
				return aTimeRange;
			}
		});
	};

	QUnit.module("UtilizationBarChart Basic", {
		beforeEach: function() {
			this.sut = new UtilizationBarChart({
				time: aTimeRange[0],
				endTime: aTimeRange[1]
			});
			fnMockGanttChartBase(this.sut);
		},
		afterEach: function() {
			this.sut.destroy();
			this.sut = null;
		}
	});

	QUnit.test("Property - Default Values", function(assert) {
		assert.equal(this.sut.getOverConsumptionMargin(), 25.0, "Default overConsumptionMargin");
		assert.equal(this.sut.getOverConsumptionColor(), "red", "Default overConsumptionColor");

		// remain capacity color is overwritten to show as white
		assert.equal(this.sut.getRemainCapacityColor(), "#fff", "Default remainCapacityColor");

		assert.equal(this.sut.getConsumptionColor(), "lightgray", "Default consuptionColor set");
		assert.ok(this.sut.mDefaultDefs != null, "has default background defs");
	});

	QUnit.test("Basic Rendering", function(assert) {
		mockAxisTime(this.sut, aTimeRange);
		placeAt(this.sut);

		assert.ok(this.sut.getDomRef() != null, "UBC has DOM rendered");

		var $dom = jQuery.sap.byId(this.sut.getId());
		assert.ok($dom.hasClass("sapGanttUtilizationBar"), "DOM has correct class name");
		assert.equal($dom.attr("id"), this.sut.getId(), "id attribute is set");
		assert.equal($dom.attr("data-sap-ui"), this.sut.getId(), "eusure the element can be found by Core");

		assert.ok(this.sut.getDomRef("defaultBgPattern"), "UBC has DOM with defaultBgPattern as suffix");

		var oUbcBg = this.sut.getDomRef("ubcBg");
		assert.ok(oUbcBg != null, "UBC has a rectangle as background");
		assert.equal(oUbcBg.getAttribute("height"), "100", "UBC background take the entire row height");
		assert.equal(oUbcBg.getAttribute("width"), "500", "UBC background has same width of time range");
		assert.equal(oUbcBg.getAttribute("fill"), "url(#" + this.sut.getId() + "-defaultBgPattern)", "ubc bg use default bg pattern");


		this.sut.setFill("red");
		placeAt(this.sut);
		oUbcBg = this.sut.getDomRef("ubcBg");
		assert.equal(oUbcBg.getAttribute("fill"), "red", "ubc bg changed to red");
		assert.ok(this.sut.getDomRef("defaultBgPattern") == null, "UBC doesn't have defaultBgPattern as suffix any longer");
	});

	var aUBCPeriods = [
		{
			time: "20180101000000",
			supply: 0,
			demand: 5
		},
		{
			time: "20180115000000",
			supply: 15,
			demand: 18
		},
		{
			time: "20180201000000",
			supply: 10,
			demand: 5
		},
		{
			time: "20180215000000",
			supply: 8,
			demand: 10
		},
		{
			time: "20180301000000",
			supply: 5,
			demand: 2
		},
		{
			time: "20180331000000",
			supply: 15,
			demand: 12
		}
	].map(function(oItem){
		oItem.time = Format.abapTimestampToDate(oItem.time);
		return oItem;
	});
	QUnit.module("UBC - with periods", {
		beforeEach: function() {
			this.sut = new UtilizationBarChart({
				time: aTimeRange[0],
				endTime: aTimeRange[1],
				periods: {
					path :"/",
					template: new UtilizationPeriod({
						from: "{time}",
						supply: "{supply}",
						demand: "{demand}"
					}),
					templateSharable: true
				}
			});
			fnMockGanttChartBase(this.sut);

			var oJSONModel = new sap.ui.model.json.JSONModel();
			oJSONModel.setData(aUBCPeriods);
			this.sut.setModel(oJSONModel);
		},
		afterEach: function() {
			this.sut.destroy();
			this.sut = null;
		}
	});

	QUnit.test("UBC - rendering periods", function(assert) {
		mockAxisTime(this.sut, aTimeRange);
		placeAt(this.sut);

		assert.ok(this.sut.getPeriods().length, 6, "six peroids are bound to UBC");
		assert.ok(this.sut.getDomRef("ubcOCP"), "UBC Over Consumption Polygon found");
		assert.equal(this.sut.getDomRef("ubcOCP").getAttribute("fill"), this.sut.getOverConsumptionColor(), "OCP fill color correctly rendered");

		assert.ok(this.sut.getDomRef("ubcRCP"), "UBC Remain Consumption Polygon found");
		assert.equal(this.sut.getDomRef("ubcRCP").getAttribute("fill"), this.sut.getRemainCapacityColor(), "RCP fill color correctly rendered");

		assert.ok(this.sut.getDomRef("ubcCP"), "UBC Consumption Polygon found");
		assert.equal(this.sut.getDomRef("ubcCP").getAttribute("fill"), this.sut.getConsumptionColor(), "CP fill color correctly rendered");

		assert.ok(this.sut.getDomRef("ubcPath"), "UBC Actual consumption path found");
	});

	QUnit.test("UBC - filterPeriods", function(assert) {
		aUBCPeriods.splice(0, 0, {
			time: new Date(2017, 12, 31),
			supply: 0,
			demand: 0
		});

		// this will be filter out because it's not sit into the range
		aUBCPeriods.push({
			time: new Date(2018, 3, 1),
			supply: 0,
			demand: 0
		});
		aUBCPeriods.push({
			time: new Date(2018, 3, 2),
			supply: 0,
			demand: 0
		});

		this.sut.getModel().setData(aUBCPeriods);

		var aFiltered = this.sut.filterPeriods();

		assert.equal(aFiltered.length, 8, "filterPeriods works correctly");
	});
});
