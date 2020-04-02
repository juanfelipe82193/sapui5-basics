/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/apf/modeler/ui/utils/labelForRepresentationTypes"
], function(LabelForRepresentationTypes){
	'use strict';
	var oLabelForRepresentationTypes, spyOnTextReader;
	function _commonAction(sChartType, aKinds) {
		var labels = [];
		aKinds.forEach(function(sKind) {
			labels.push(oLabelForRepresentationTypes.getLabelsForChartType(sChartType, sKind));
		});
		return labels;
	}
	function _commonXYAxisLabelAsserts(assert) {
		assert.strictEqual(spyOnTextReader.calledWith("dim-for-xaxis"), true, 'then xAxis label is right');
		assert.strictEqual(spyOnTextReader.calledWith("dim-for-legend"), true, 'then legend label is right');
		assert.strictEqual(spyOnTextReader.calledWith("meas-for-yaxis"), true, 'then yAxis label is right');
	}
	function _commonYXAxisLabelAsserts(assert) {
		assert.strictEqual(spyOnTextReader.calledWith("dim-for-yaxis"), true, 'then yAxis label is right');
		assert.strictEqual(spyOnTextReader.calledWith("dim-for-legend"), true, 'then legend label is right');
		assert.strictEqual(spyOnTextReader.calledWith("meas-for-xaxis"), true, 'then xAxis label is right');
	}
	QUnit.module("Label for representation type ", {
		beforeEach : function(assert) {
			var oTextReader = function(key) {
				return key;
			};
			oLabelForRepresentationTypes = new LabelForRepresentationTypes(oTextReader);
			spyOnTextReader = sinon.spy(oLabelForRepresentationTypes, "oTextReader");
		},
		afterEach : function() {
			spyOnTextReader.restore();
		}
	});
	QUnit.test('When initialization', function(assert) {
		assert.ok(oLabelForRepresentationTypes, 'then object exists');
	});
	QUnit.test('When chart type is Column', function(assert) {
		//action
		_commonAction("ColumnChart", [ "xAxis", "legend", "yAxis" ]);
		//assert
		_commonXYAxisLabelAsserts(assert);
	});
	QUnit.test('When chart type is Bar', function(assert) {
		//action
		_commonAction("BarChart", [ "yAxis", "legend", "xAxis" ]);
		//assert
		_commonYXAxisLabelAsserts(assert);
	});
	QUnit.test('When chart type is Line', function(assert) {
		//action
		_commonAction("LineChart", [ "xAxis", "legend", "yAxis" ]);
		//assert
		_commonXYAxisLabelAsserts(assert);
	});
	QUnit.test('When chart type is LineChartWithTwoVerticalAxes', function(assert) {
		//action
		_commonAction("LineChartWithTwoVerticalAxes", [ "xAxis", "legend", "yAxis", "yAxis2" ]);
		//assert
		assert.strictEqual(spyOnTextReader.calledWith("dim-for-xaxis"), true, 'then xAxis label is right');
		assert.strictEqual(spyOnTextReader.calledWith("dim-for-legend"), true, 'then legend label is right');
		assert.strictEqual(spyOnTextReader.calledWith("meas-for-leftVAxis"), true, 'then leftVerticalAxis label is right');
		assert.strictEqual(spyOnTextReader.calledWith("meas-for-rightVAxis"), true, 'then rightVerticalAxis label is right');
	});
	QUnit.test('When chart type is LineChartWithTimeAxis', function(assert) {
		//action
		_commonAction("LineChartWithTimeAxis", [ "xAxis", "legend", "yAxis" ]);
		//assert
		_commonXYAxisLabelAsserts(assert);
	});
	QUnit.test('When chart type is PieChart', function(assert) {
		//action
		_commonAction("PieChart", [ "sectorColor", "sectorSize" ]);
		//assert
		assert.strictEqual(spyOnTextReader.calledWith("dim-for-sectorColor"), true, 'then sectorColor label is right');
		assert.strictEqual(spyOnTextReader.calledWith("meas-for-sectorSize"), true, 'then sectorSize label is right');
	});
	QUnit.test('When chart type is DonutChart', function(assert) {
		//action
		_commonAction("DonutChart", [ "sectorColor", "sectorSize" ]);
		//assert
		assert.strictEqual(spyOnTextReader.calledWith("dim-for-sectorColor"), true, 'then sectorColor label is right');
		assert.strictEqual(spyOnTextReader.calledWith("meas-for-sectorSize"), true, 'then sectorSize label is right');
	});
	QUnit.test('When chart type is ScatterPlotChart', function(assert) {
		//action
		_commonAction("ScatterPlotChart", [ "regionColor", "regionShape", "xAxis", "yAxis" ]);
		//assert
		assert.strictEqual(spyOnTextReader.calledWith("dim-for-colorDataPoints"), true, 'then scatterplot Color label is right');
		assert.strictEqual(spyOnTextReader.calledWith("dim-for-shapeDataPoints"), true, 'then scatterplot Shape label is right');
		assert.strictEqual(spyOnTextReader.calledWith("meas-for-xaxis"), true, 'then xAxis label is right');
		assert.strictEqual(spyOnTextReader.calledWith("meas-for-yaxis"), true, 'then yAxis label is right');
	});
	QUnit.test('When chart type is BubbleChart', function(assert) {
		//action
		_commonAction("BubbleChart", [ "regionColor", "regionShape", "xAxis", "yAxis", "bubbleWidth" ]);
		//assert
		assert.strictEqual(spyOnTextReader.calledWith("dim-for-bubbleColor"), true, 'then bubbleColor label is right');
		assert.strictEqual(spyOnTextReader.calledWith("dim-for-bubbleShape"), true, 'then bubbleShape label is right');
		assert.strictEqual(spyOnTextReader.calledWith("meas-for-xaxis"), true, 'then xAxis label is right');
		assert.strictEqual(spyOnTextReader.calledWith("meas-for-yaxis"), true, 'then yAxis label is right');
		assert.strictEqual(spyOnTextReader.calledWith("meas-for-bubbleWidth"), true, 'then bubbleWidth label is right');
	});
	QUnit.test('When chart type is StackedColumnChart', function(assert) {
		//action
		_commonAction("StackedColumnChart", [ "xAxis", "legend", "yAxis" ]);
		//assert
		_commonXYAxisLabelAsserts(assert);
	});
	QUnit.test('When chart type is StackedBarChart', function(assert) {
		//action
		_commonAction("StackedBarChart", [ "yAxis", "legend", "xAxis" ]);
		//assert
		_commonYXAxisLabelAsserts(assert);
	});
	QUnit.test('When chart type is PercentageStackedColumnChart', function(assert) {
		//action
		_commonAction("PercentageStackedColumnChart", [ "xAxis", "legend", "yAxis" ]);
		//assert
		_commonXYAxisLabelAsserts(assert);
	});
	QUnit.test('When chart type is PercentageStackedBarChart', function(assert) {
		//action
		_commonAction("PercentageStackedBarChart", [ "yAxis", "legend", "xAxis" ]);
		//assert
		_commonYXAxisLabelAsserts(assert);
	});
	QUnit.test('When chart type is HeatmapChart', function(assert) {
		//action
		_commonAction("HeatmapChart", [ "xAxis", "xAxis2", "sectorColor" ]);
		//assert
		assert.strictEqual(spyOnTextReader.calledWith("dim-for-xaxis"), true, 'then xAxis label is right');
		assert.strictEqual(spyOnTextReader.calledWith("dim-for-yaxis"), true, 'then xAxis2 label is right');
		assert.strictEqual(spyOnTextReader.calledWith("meas-for-sectorColor"), true, 'then sectorColor label is right');
	});
	QUnit.test('When chart type is TableRepresentation', function(assert) {
		//action
		_commonAction("TableRepresentation", [ "column" ]);
		//assert
		assert.strictEqual(spyOnTextReader.calledWith("prop-for-column"), true, 'then column label is right');
	});
	QUnit.test('When chart type is Tree Table Representation', function(assert) {
		//action
		_commonAction("TreeTableRepresentation", [ "hierarchicalColumn", "column" ]);
		//assert
		assert.strictEqual(spyOnTextReader.calledWith("prop-for-hierarchy-column"), true, 'then hierarchical column label is right');
		assert.strictEqual(spyOnTextReader.calledWith("prop-for-column"), true, 'then column label is right');
	});
	QUnit.test('When chart type is Dual Stacked Combination', function(assert) {
		//action
		var labels = _commonAction("DualStackedCombinationChart", [ "xAxis", "legend", "yAxis", "yAxis2"]);
		//assert
		assert.deepEqual(labels, ["dim-for-xaxis", "dim-for-legend", "meas-for-leftVAxis-Display", "meas-for-rightVAxis-Display"], "Labels for dual stacked combination chart are correct");
		assert.strictEqual(spyOnTextReader.calledWith("dim-for-xaxis"), true, 'then xAxis label is right');
		assert.strictEqual(spyOnTextReader.calledWith("dim-for-legend"), true, 'then legend label is right');
		assert.strictEqual(spyOnTextReader.calledWith("meas-for-leftVAxis-Display"), true, 'then leftVerticalAxis label is right');
		assert.strictEqual(spyOnTextReader.calledWith("meas-for-rightVAxis-Display"), true, 'then rightVerticalAxis label is right');
	});
	QUnit.test('When chart type is Dual Combination', function(assert) {
		//action
		var labels = _commonAction("DualCombinationChart", [ "xAxis", "legend", "yAxis", "yAxis2"]);
		//assert
		assert.deepEqual(labels, ["dim-for-xaxis", "dim-for-legend", "meas-for-leftVAxis-Display", "meas-for-rightVAxis-Display"], "Labels for dual combination chart are correct");
		assert.strictEqual(spyOnTextReader.calledWith("dim-for-xaxis"), true, 'then xAxis label is right');
		assert.strictEqual(spyOnTextReader.calledWith("dim-for-legend"), true, 'then legend label is right');
		assert.strictEqual(spyOnTextReader.calledWith("meas-for-leftVAxis-Display"), true, 'then leftVerticalAxis label is right');
		assert.strictEqual(spyOnTextReader.calledWith("meas-for-rightVAxis-Display"), true, 'then rightVerticalAxis label is right');
	});
	QUnit.test('When chart type is Combination', function(assert) {
		//action
		var labels = _commonAction("CombinationChart", [ "xAxis", "legend", "yAxis"]);
		//assert
		assert.deepEqual(labels, ["dim-for-xaxis", "dim-for-legend", "meas-for-yaxis-Display"], "Labels for combination chart are correct");
		assert.strictEqual(spyOnTextReader.calledWith("dim-for-xaxis"), true, 'then xAxis label is right');
		assert.strictEqual(spyOnTextReader.calledWith("dim-for-legend"), true, 'then legend label is right');
		assert.strictEqual(spyOnTextReader.calledWith("meas-for-yaxis-Display"), true, 'then vertical axis label is right');
	});
	QUnit.test('When chart type is Stacked Combination', function(assert) {
		//action
		var labels = _commonAction("StackedCombinationChart", [ "xAxis", "legend", "yAxis"]);
		//assert
		assert.deepEqual(labels, ["dim-for-xaxis", "dim-for-legend", "meas-for-yaxis-Display"], "Labels for stacked combination chart are correct");
		assert.strictEqual(spyOnTextReader.calledWith("dim-for-xaxis"), true, 'then xAxis label is right');
		assert.strictEqual(spyOnTextReader.calledWith("dim-for-legend"), true, 'then legend label is right');
		assert.strictEqual(spyOnTextReader.calledWith("meas-for-yaxis-Display"), true, 'then vertical axis label is right');
	});
});
