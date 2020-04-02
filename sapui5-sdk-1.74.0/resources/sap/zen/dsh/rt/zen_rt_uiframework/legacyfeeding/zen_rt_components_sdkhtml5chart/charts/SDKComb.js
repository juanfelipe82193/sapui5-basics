define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKComb",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBaseChart"],
    function(SDKBaseChart, DataSeriesHelper) {

SDKBaseChart.extend("sap.zen.SDKCombinationChart", {
	
	initCvomChartType : function(){
		this.cvomType = "viz/combination";
	}
});

return sap.zen.SDKCombinationChart;
});