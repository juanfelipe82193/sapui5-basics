define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKLine",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBaseChart"],
    function(SDKBaseChart) {

SDKBaseChart.extend("sap.zen.SDKLineChart", {
	
	initCvomChartType : function(){
		this.cvomType = "viz/line";
	}
});

return sap.zen.SDKLineChart;
});
