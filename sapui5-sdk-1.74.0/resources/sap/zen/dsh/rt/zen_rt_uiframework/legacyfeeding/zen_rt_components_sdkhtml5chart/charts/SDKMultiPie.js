define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKMultiPie",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBaseChart",
     "zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/dataMappers/SDKMultiPieDataMapper",
     ],
    function(SDKBaseChart, SDKMultiPieDataMapper) {

SDKBaseChart.extend("sap.zen.SDKMultiPieChart", { cvomType: "viz/multi_pie" });

return sap.zen.SDKMultiPieChart;
});