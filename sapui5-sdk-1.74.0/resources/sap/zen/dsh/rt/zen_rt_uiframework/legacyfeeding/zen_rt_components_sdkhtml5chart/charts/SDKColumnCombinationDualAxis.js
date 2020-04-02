/* global sap, $ */
/* jshint strict:false, quotmark:false*/

define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKColumnCombinationDualAxis",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBaseChart",
     "zen.rt.uiframework/legacyfeeding/zen.rt.components.html5charts/charts/helpers/DualDataSeriesHelper"],
    function(SDKBaseChart, DualDataSeriesHelper) {
SDKBaseChart.extend("sap.zen.SDKColumnCombinationDualAxisChart", {

	init : function(){
		SDKBaseChart.prototype.init.apply(this, arguments);
		this.registerHelper("sap.zen.DualDataSeriesHelper");
		DualDataSeriesHelper.apply(this, arguments);
	},

	getPropertyValues : function(){
		return {
			plotObjectType    : this.getPlotObjectType()
		};
	},

	initCvomChartType : function(){
		this.cvomType = "viz/dual_combination";
		// Mapping from cvom errors to message keys
		this.cvomErrorMappings = {
			"50005": "dualcolumn_combination_datamapping_rmd"
		};
	}
});
return sap.zen.SDKColumnCombinationDualAxisChart;
});