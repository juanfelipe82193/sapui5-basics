/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(function(){
	'use strict';
	var LabelForRepresentationTypes = function(oTextReader) {
		this.oTextReader = oTextReader;
	};
	LabelForRepresentationTypes.prototype.getLabelsForChartType = function(sRepresentationType, sKind) {
		var xyAxisChartLabel = {
			"xAxis" : this.oTextReader("dim-for-xaxis"),
			"legend" : this.oTextReader("dim-for-legend"),
			"yAxis" : this.oTextReader("meas-for-yaxis")
		};
		var yxAxisChartLabel = {
			"xAxis" : this.oTextReader("dim-for-yaxis"),
			"legend" : this.oTextReader("dim-for-legend"),
			"yAxis" : this.oTextReader("meas-for-xaxis")
		};
		var xyAxisChartLabelWith2Axis = {
			"xAxis" : this.oTextReader("dim-for-xaxis"),
			"legend" : this.oTextReader("dim-for-legend"),
			"yAxis" : this.oTextReader("meas-for-leftVAxis"),
			"yAxis2" : this.oTextReader("meas-for-rightVAxis")
		};
		var xyAxisChartLabelAndMeasureOption = {
			"xAxis" : this.oTextReader("dim-for-xaxis"),
			"legend" : this.oTextReader("dim-for-legend"),
			"yAxis" : this.oTextReader("meas-for-yaxis-Display")
		};
		var xyAxisChartLabelWith2AxisAndMeasureOption = {
			"xAxis" : this.oTextReader("dim-for-xaxis"),
			"legend" : this.oTextReader("dim-for-legend"),
			"yAxis" : this.oTextReader("meas-for-leftVAxis-Display"),
			"yAxis2" : this.oTextReader("meas-for-rightVAxis-Display")
		};
		var oRepresentationTypeLabels = {
			"ColumnChart" : xyAxisChartLabel,
			"BarChart" : yxAxisChartLabel,
			"LineChart" : xyAxisChartLabel,
			"LineChartWithTwoVerticalAxes" : xyAxisChartLabelWith2Axis,
			"LineChartWithTimeAxis" : xyAxisChartLabel,
			"PieChart" : {
				"sectorColor" : this.oTextReader("dim-for-sectorColor"),
				"sectorSize" : this.oTextReader("meas-for-sectorSize")
			},
			"DonutChart" : {
				"sectorColor" : this.oTextReader("dim-for-sectorColor"),
				"sectorSize" : this.oTextReader("meas-for-sectorSize")
			},
			"ScatterPlotChart" : {
				"regionColor" : this.oTextReader("dim-for-colorDataPoints"),
				"regionShape" : this.oTextReader("dim-for-shapeDataPoints"),
				"xAxis" : this.oTextReader("meas-for-xaxis"),
				"yAxis" : this.oTextReader("meas-for-yaxis")
			},
			"BubbleChart" : {
				"regionColor" : this.oTextReader("dim-for-bubbleColor"),
				"regionShape" : this.oTextReader("dim-for-bubbleShape"),
				"xAxis" : this.oTextReader("meas-for-xaxis"),
				"yAxis" : this.oTextReader("meas-for-yaxis"),
				"bubbleWidth" : this.oTextReader("meas-for-bubbleWidth")
			},
			"StackedColumnChart" : xyAxisChartLabel,
			"StackedBarChart" : yxAxisChartLabel,
			"PercentageStackedColumnChart" : xyAxisChartLabel,
			"PercentageStackedBarChart" : yxAxisChartLabel,
			"HeatmapChart" : {
				"xAxis" : this.oTextReader("dim-for-xaxis"),
				"xAxis2" : this.oTextReader("dim-for-yaxis"),
				"sectorColor" : this.oTextReader("meas-for-sectorColor")
			},
			"CombinationChart" : xyAxisChartLabelAndMeasureOption,
			"StackedCombinationChart" : xyAxisChartLabelAndMeasureOption,
			"DualCombinationChart" : xyAxisChartLabelWith2AxisAndMeasureOption,
			"DualStackedCombinationChart" : xyAxisChartLabelWith2AxisAndMeasureOption,
			"TableRepresentation" : {
				"column" : this.oTextReader("prop-for-column")
			},
			"TreeTableRepresentation" : {
				"hierarchicalColumn" : this.oTextReader("prop-for-hierarchy-column"),
				"column" : this.oTextReader("prop-for-column")
			}
		};
		return oRepresentationTypeLabels[sRepresentationType][sKind];
	};
	return LabelForRepresentationTypes;
});