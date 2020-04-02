define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBar",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBaseChart"],
    function(SDKBaseChart) {

SDKBaseChart.extend("sap.zen.SDKBarChart", {
	
	initCvomChartType : function(){
		this.cvomType = "viz/bar";
	}

});

return sap.zen.SDKBarChart;
});
