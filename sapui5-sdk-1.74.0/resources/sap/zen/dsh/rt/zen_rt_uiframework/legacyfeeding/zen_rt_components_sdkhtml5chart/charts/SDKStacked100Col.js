define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKStacked100Col",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBaseChart"],
    function(SDKBaseChart) {

SDKBaseChart.extend("sap.zen.SDKStacked100ColChart", {
	
	initCvomChartType : function(){
		this.cvomType = "viz/100_stacked_column";
	}
});

return sap.zen.SDKStacked100ColChart;
});