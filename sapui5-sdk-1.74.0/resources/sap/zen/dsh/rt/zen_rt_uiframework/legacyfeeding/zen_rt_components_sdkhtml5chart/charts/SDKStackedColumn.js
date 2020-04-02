define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKStackedColumn",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBaseChart"],
    function(SDKBaseChart) {

SDKBaseChart.extend("sap.zen.SDKStackedColumnChart", {
	
	initCvomChartType : function(){
		this.cvomType = "viz/stacked_column";
	}
});


return sap.zen.SDKStackedColumnChart;
});
