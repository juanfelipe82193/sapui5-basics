define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBarCombination",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBaseChart"],
    function(SDKBaseChart) {

SDKBaseChart.extend("sap.zen.SDKBarCombinationChart", {
	
	initCvomChartType : function(){
		this.cvomType = "viz/horizontal_combination";
	}
});

return sap.zen.SDKBarCombinationChart;
});
