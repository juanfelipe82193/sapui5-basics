define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKGenericViz",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBaseChart"],
    function(SDKBaseChart) {

SDKBaseChart.extend("sap.zen.SDKGenericViz", {

    isGenericViz: true,
		
	setVizId : function(id){
		this.cvomType = id;
	}
});

return sap.zen.SDKGenericViz;
});