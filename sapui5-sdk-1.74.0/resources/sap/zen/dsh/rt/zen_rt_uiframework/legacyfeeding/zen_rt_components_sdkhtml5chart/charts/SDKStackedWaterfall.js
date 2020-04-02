define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKStackedWaterfall",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBaseChart",
    "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/dataMappers/SDKStackedWaterfallDataMapper"],
    function(SDKBaseChart, SDKStackedWaterfallDataMapper) {

SDKBaseChart.extend("sap.zen.SDKStackedWaterfallChart", {
	
	initCvomChartType : function(){
		this.cvomType = "viz/stacked_waterfall";
	},

	getDataFeeding : function(){},
	
	getDataMapper : function() {
		return new SDKStackedWaterfallDataMapper();
	}
});

return sap.zen.SDKStackedWaterfallChart;
});
