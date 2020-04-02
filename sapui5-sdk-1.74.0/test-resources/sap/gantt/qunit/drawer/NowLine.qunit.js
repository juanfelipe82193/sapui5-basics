/*global QUnit */
sap.ui.define(["sap/gantt/drawer/NowLine", "sap/ui/base/Object"], function(NowLine, BaseObject){
	"use strict";

	var MockAxisTime = BaseObject.extend("MockAxisTime", {});
	MockAxisTime.prototype.timeToView = function(){
		return 500;
	};
	MockAxisTime.prototype.getNowLabel = function(){
		return [{"value": 500}];
	};

	var oNowline;
	QUnit.module("Nowline Module",{
		beforeEach: function() {
			jQuery('<svg id="header" class="sapGanttChartHeaderSvg" width="1000" height="100"></svg>' +
					'<svg id="chart" class="sapGanttChartSvg" width="1000" height="500"></svg>').appendTo("body");
			var $header = d3.select("#header"),
				$chart = d3.select("#chart");
			oNowline = new NowLine(new MockAxisTime());
			oNowline.drawSvg($chart, $header);
		},
		afterEach: function(){
			var $header = d3.select("#header"),
				$chart = d3.select("#chart");
			oNowline.destroySvg($chart, $header);
			oNowline = null;
		}
	});
	QUnit.test("Nowline header and body triangle draw", function(assert){
		var $header = jQuery('.sapGanttChartHeaderSvg').find('g.sapGanttNowLineHeaderSvgPath');
		assert.ok($header.length === 1, "Nowline header not found");

		var $body = jQuery('.sapGanttChartSvg').find('g.sapGanttNowLineBodySvgLine');
		assert.ok($body.length === 1, "Nowline body not found");
	});
	QUnit.test("Nowline Line destroy should remove path", function(assert){
		oNowline.destroySvg(d3.select("#chart"), d3.select("#header"));

		var $header = jQuery('.sapGanttChartHeaderSvg').find('g.sapGanttNowLineHeaderSvgPath');
		assert.ok($header.length === 0, "Nowline was found after destroy");

		var $body = jQuery('.sapGanttChartSvg').find('g.sapGanttNowLineBodySvgLine');
		assert.ok($body.length === 0, "Nowline body was found after destroy");
	});

	QUnit.test("nowline body height should equal browser height", function(assert){
		var $body = jQuery('.sapGanttChartSvg').find('g.sapGanttNowLineBodySvgLine');
		var $path = $body.find('line');

		assert.ok($path.length === 1, "path had been drawn");
		var x1 = $path.attr('x1'),
			y1 = $path.attr('y1'),
			x2 = $path.attr('x2'),
			y2 = $path.attr('y2');
		assert.equal(x1, 500);
		assert.equal(y1, 0);
		assert.equal(x2, 500);
		assert.equal(y2, jQuery(window).height() + jQuery('#header').height());

	});
	// Put it to the last, I'm too lazy to change the prototype back
	QUnit.test("Nowline was exceed the time horizon and not draw", function(assert){
		oNowline.destroySvg(d3.select("#chart"), d3.select("#header"));

		MockAxisTime.prototype.timeToView = function(){
			return 1500;
		};
		MockAxisTime.prototype.getNowLabel = function(){
			return [{"value": 1500}];
		};
		oNowline = new NowLine(new MockAxisTime());
		oNowline.drawSvg(d3.select("#chart"), d3.select("#header"));
		var $rect = jQuery('.sapGanttChartHeaderSvg').find('path');
		assert.ok($rect.length === 0, "Nowline should been drawn if exceed time horizon");
	});
});
