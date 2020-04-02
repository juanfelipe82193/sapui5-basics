define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKHorizontalArea",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBaseChart"],
    function(SDKBaseChart) {

SDKBaseChart.extend("sap.zen.SDKHorizontalAreaChart", {
	
	initCvomChartType : function(){
		this.cvomType = "viz/horizontal_area";
	}

});

return sap.zen.SDKHorizontalAreaChart;
});