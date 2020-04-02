/*global QUnit */
sap.ui.define(["sap/ui/base/Object", "sap/gantt/drawer/CursorLine", "sap/gantt/config/Locale"], function(BaseObject, CursorLine, GanttLocale){
	"use strict";

	var MockAxisTime = BaseObject.extend("MockAxisTime", {});
	MockAxisTime.prototype.timeToView = function(){
		return 500;
	};
	MockAxisTime.prototype.viewToTime = function() {
		return new Date(2016, 1, 7, 12, 59, 59);
	};
	MockAxisTime.prototype.getZoomStrategy = function() {
		return {
			//mock axisTimeStrategy
			getLowerRowFormatter : function(){
				return sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "d.M."
				}, new sap.ui.core.Locale(sap.ui.getCore().getConfiguration().getLanguage().toLowerCase()));
			}

		};
	};
	MockAxisTime.prototype.getCurrentTickTimeIntervalKey = function() {
		return '1week';
	};

	jQuery('<svg id="chart-header" class="sapGanttChartHeaderSvg" width="1000" height="100"></svg>' +
			'<svg id="chart" class="sapGanttChartSvg" width="1000" height="500"></svg>').appendTo("body");

	var oCursorLine;
	var aSvgBodyNode = d3.selectAll(".sapGanttChartSvg"),
		aSvgHeaderNode = d3.selectAll(".sapGanttChartHeaderSvg"),
		oAxisTime = new MockAxisTime(),
		oLocale = new GanttLocale({
			timeZone: "CET",
			utcdiff: "010000",
			utcsign: "+"
		}),
		oSvgPoint = {
			svgHeight: 500,
			svgId: "chart",
			x: 300,
			y: 20
		};

	CursorLine.prototype._getAxisTime = function(elementId) {
		return oAxisTime;
	};

	QUnit.module("CursorLine Module",{
		beforeEach: function() {
			oCursorLine = new CursorLine();
			oCursorLine.drawSvg(aSvgBodyNode, aSvgHeaderNode, oLocale, oSvgPoint);
		},
		afterEach: function(){
			oCursorLine.destroySvg(aSvgBodyNode, aSvgHeaderNode);
			oCursorLine = null;
		}
	});
	QUnit.test("Cursor Line should be draw correctly", function(assert){
		var $header = jQuery('.sapGanttChartHeaderSvg').find('rect.sapGanttCursorLineHeader');
		assert.ok($header.length === 1, "CurorLine header found");

		var $text = jQuery('.sapGanttChartHeaderSvg').find('text.sapGanttCursorLineLabel');
		assert.ok($text.length === 1, "CurorLine time label found");

		var $body = jQuery('.sapGanttChartSvg').find('path.sapGanttCursorLineBody');
		assert.ok($body.length === 1, "CurorLine body found");
	});

	QUnit.test("Cursor Line text label should be correct", function(assert){
		var $text = jQuery('.sapGanttChartHeaderSvg').find('text.sapGanttCursorLineLabel');
		assert.equal($text.text(), "7.2.", "CurorLine time label not found");
	});

	QUnit.test("Cursor Line should be destroyed", function(assert){
		oCursorLine.destroySvg(aSvgBodyNode, aSvgHeaderNode);
		var $header = jQuery('.sapGanttChartHeaderSvg').find('rect.sapGanttCursorLineHeader');
		assert.ok($header.length === 0, "CurorLine header not removed");

		$header = jQuery('.sapGanttChartHeaderSvg').find('rect.sapGanttCursorLineHeader');
		assert.equal($header.length, 0, "CurorLine header not removed");

		var $text = jQuery('.sapGanttChartHeaderSvg').find('text.sapGanttCursorLineLabel');
		assert.equal($text.length, 0, "CurorLine time label not removed");

		var $body = jQuery('.sapGanttChartSvg').find('path.sapGanttCursorLineBody');
		assert.equal($body.length , 0, "CurorLine body not not removed");
	});
});
