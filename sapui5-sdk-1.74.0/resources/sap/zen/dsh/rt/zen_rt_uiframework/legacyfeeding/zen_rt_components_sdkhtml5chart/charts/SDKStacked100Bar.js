define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKStacked100Bar",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBaseChart"],
    function(SDKBaseChart) {

SDKBaseChart.extend("sap.zen.SDKStacked100BarChart", {
	
	initCvomChartType : function(){
		this.cvomType = "viz/100_stacked_bar";
	}
});

return sap.zen.SDKStacked100BarChart;
});
