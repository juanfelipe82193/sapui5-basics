define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKPie",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBaseChart",
     "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/dataMappers/SDKPieDataMapper"],
    function(SDKBaseChart, SDKPieDataMapper) {

SDKBaseChart.extend("sap.zen.SDKPieChart", {
	
	initCvomChartType : function(){
		this.cvomType = "viz/pie";
	},
	
	getDataMapper : function() {
		return new SDKPieDataMapper();
	},

	getDataFeeding: function() {}
});


return sap.zen.SDKPieChart;
});
