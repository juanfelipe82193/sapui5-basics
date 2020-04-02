define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKArea",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBaseChart"],
    function(SDKBaseChart) {

    SDKBaseChart.extend("sap.zen.SDKAreaChart", {
	
	initCvomChartType : function(){
		this.cvomType = "viz/area";
	}
});

return sap.zen.SDKAreaChart;
});