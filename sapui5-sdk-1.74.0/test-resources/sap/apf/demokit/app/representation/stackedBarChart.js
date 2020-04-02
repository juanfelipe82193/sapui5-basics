jQuery.sap.declare('sap.apf.demokit.app.representation.stackedBarChart');
jQuery.sap.require("sap.apf.ui.representations.BaseVizFrameChartRepresentation");
/**
 * @class stackedBarChart constructor.
 * @param oParametersdefines parameters required for chart such as Dimension/Measures,tooltip, axis information.
 * @returns chart object
 */
sap.apf.demokit.app.representation.stackedBarChart = function(oApi, oParameters) {
	sap.apf.ui.representations.BaseVizFrameChartRepresentation.apply(this, [ oApi, oParameters ]);
	this.type = "StackedBarChart";
	this.chartType = "stacked_bar";
	this._createDefaultFeedItemId();
};
sap.apf.demokit.app.representation.stackedBarChart.prototype = Object.create(sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype);
//Set the "constructor" property to refer to stackedBarChart
sap.apf.demokit.app.representation.stackedBarChart.prototype.constructor = sap.apf.demokit.app.representation.stackedBarChart;
/** 
 * @method _createDefaultFeedItemId
 * @description reads the oParameters for chart and modifies it by including a default feedItem id 
 * in case the "kind" property is not defined in dimension/measures
 */
sap.apf.demokit.app.representation.stackedBarChart.prototype._createDefaultFeedItemId = function() {
	this.parameter.measures.forEach(function(measure, index) {
		if (measure.kind === undefined) {//handle the scenario where the kind is not available
			measure.axisfeedItemId = index === 0 ? sap.apf.core.constants.vizFrame.feedItemTypes.VALUEAXIS : sap.apf.core.constants.vizFrame.feedItemTypes.VALUEAXIS2;
		}
	});
	this.parameter.dimensions.forEach(function(dimension, index) {
		if (dimension.kind === undefined) {//handle the scenario where the kind is not available
			dimension.axisfeedItemId = index === 0 ? sap.apf.core.constants.vizFrame.feedItemTypes.CATEGORYAXIS : sap.apf.core.constants.vizFrame.feedItemTypes.COLOR;
		}
	});
};
/**
 * @method handleCustomFormattingOnChart
 * @description sets the custom format string
 */
sap.apf.demokit.app.representation.stackedBarChart.prototype.handleCustomFormattingOnChart = function() {
	var superClass = this;
	var aMeasure = superClass.getMeasures();
	var sFormatString = superClass.getFormatStringForMeasure(aMeasure[0]); //get the format string from base class
	superClass.setFormatString("xAxis", sFormatString);
};
