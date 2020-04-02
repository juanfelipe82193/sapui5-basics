define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKWaterfall",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBaseChart",
     "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/dataMappers/SDKWaterfallDataMapper"
    ],
    function(SDKBaseChart, SDKWaterfallDataMapper) {

SDKBaseChart.extend("sap.zen.SDKWaterfallChart", {
	
	initCvomChartType : function(){
		this.cvomType = "viz/waterfall";
	},
	
	getDataMapper : function() {
		return new SDKWaterfallDataMapper();
	},

	getDataFeeding : function(){}
});

return sap.zen.SDKWaterfallChart;
});
