define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKScatter",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBaseChart"],
    function(SDKBaseChart) {

    SDKBaseChart.extend("sap.zen.SDKScatterChart", {
	
	initCvomChartType : function(){
		this.cvomType = "viz/scatter";
	},


	getDataFeeding : function(keyfigureaxis, keyfigureindex, rowDimensionCounter, colDimensionCounter){
		var chartDataFeedingHelper = this.getChartDataFeedingHelper();
		var bindingColor = chartDataFeedingHelper.getDataScatterFeedingColor(keyfigureaxis, keyfigureindex, rowDimensionCounter, colDimensionCounter);
		var bindingShape = chartDataFeedingHelper.getDataScatterFeedingShape(keyfigureaxis, keyfigureindex, rowDimensionCounter, colDimensionCounter);

		var dataFeeding = [{
								"feedId" : "primaryValues",
								"binding" : [{
										"type" : "measureValuesGroup",
										"index" : 1
									}
								]
							}, {
								"feedId" : "secondaryValues",
								"binding" : [{
										"type" : "measureValuesGroup",
										"index" : 2
									}
								]
							}, {
								"feedId" : "regionColor",
								"binding" : bindingColor
							}, {
								"feedId" : "regionShape",
								"binding" : bindingShape
							}
						];

		return dataFeeding;
	}
});


return sap.zen.SDKScatterChart;
});


