

define("zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKColumn",
    ["zen.rt.uiframework/legacyfeeding/zen.rt.components.sdkhtml5chart/charts/SDKBaseChart"],
    function(SDKBaseChart) {

    SDKBaseChart.extend("sap.zen.SDKColumnChart", { cvomType: "viz/column" });

	return sap.zen.SDKColumnChart;
});
