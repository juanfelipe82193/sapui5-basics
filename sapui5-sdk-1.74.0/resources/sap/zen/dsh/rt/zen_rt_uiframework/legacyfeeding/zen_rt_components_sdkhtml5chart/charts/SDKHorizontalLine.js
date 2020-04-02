define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKHorizontalLine",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBaseChart"],
    function(SDKBaseChart) {

SDKBaseChart.extend("sap.zen.SDKHorizontalLineChart", {
	
	initCvomChartType : function(){
		this.cvomType = "viz/horizontal_line";
	}
});

return sap.zen.SDKHorizontalLineChart;
});