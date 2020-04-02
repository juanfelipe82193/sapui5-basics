define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKStackedBar",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBaseChart"],
    function(SDKBaseChart) {

SDKBaseChart.extend("sap.zen.SDKStackedBarChart", {
	
	initCvomChartType : function(){
		this.cvomType = "viz/stacked_bar";
	}
});

return sap.zen.SDKStackedBarChart;
});
