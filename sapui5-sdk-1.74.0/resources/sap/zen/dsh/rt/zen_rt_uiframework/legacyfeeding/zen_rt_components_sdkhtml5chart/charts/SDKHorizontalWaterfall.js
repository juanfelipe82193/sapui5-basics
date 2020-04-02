define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKHorizontalWaterfall",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBaseChart",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/dataMappers/SDKWaterfallDataMapper"],
    function(SDKBaseChart, SDKWaterfallDataMapper) {

SDKBaseChart.extend("sap.zen.SDKHorizontalWaterfallChart", {
	
	initCvomChartType : function(){
		this.cvomType = "viz/horizontal_waterfall";
	},
	
	getDataMapper : function() {
		return new SDKWaterfallDataMapper();
	},

	getDataFeeding : function(keyfigureaxis, keyfigureindex){
		return undefined;
	}
});


return sap.zen.SDKHorizontalWaterfallChart;
});
