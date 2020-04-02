define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKRadar",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBaseChart"],
    function(SDKBaseChart) {

SDKBaseChart.extend("sap.zen.SDKRadarChart", {
	
	initCvomChartType : function(){
		this.cvomType = "viz/radar";
	},
	
	 getDataFeeding : function(keyfigureaxis, keyfigureindex, rowDimensionCounter, colDimensionCounter, measureSize){
		 var chartDataFeedingHelper = this.getChartDataFeedingHelper();
		 var bindingColor = chartDataFeedingHelper.getDataRadarFeedingColor(keyfigureaxis, keyfigureindex, rowDimensionCounter, colDimensionCounter);
         var bindingShape = [];
         var bindingAxes = chartDataFeedingHelper.getDataRadarFeedingAxes(keyfigureaxis, colDimensionCounter);
   
         var dataFeeding = [{
				     		"feedId" : "radarAxesValues",
				    		"binding" : [{
				    				"type" : "measureValuesGroup",
				    				"index" : 1
				    			}
				    		]
				    	}, {
				    		"feedId" : "regionColor",
				    		"binding" : bindingColor
				    	}, {
				    		"feedId" : "regionShape",
				    		"binding" : bindingShape
				    	}, {
				    		"feedId" : "radarAxes",
				    		"binding" : bindingAxes
				    	}
				    ];

         return dataFeeding;
  }
});


return sap.zen.SDKRadarChart;
});
