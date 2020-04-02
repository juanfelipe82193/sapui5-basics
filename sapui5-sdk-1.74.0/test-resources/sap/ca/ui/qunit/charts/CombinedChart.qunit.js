window.addEventListener("load", function () {
    jQuery.sap.require("sap.ca.ui.charts.CombinedChart");
    var oCombined;
    sinon.config.useFakeTimers = false;

    var CHART_ID = "combinedChartID";
    $ = jQuery;

    module("CombinedChart");

    test("Object Creation with Id", function () {
        oCombined = new sap.ca.ui.charts.CombinedChart({
            id: CHART_ID,
            chartTitle: "Combined Chart"
        });
        qunitChartHelper.initializeGenericChart(oCombined, "content");
        strictEqual(oCombined.getId(), CHART_ID, "Chart has ID " + CHART_ID);
    });

    test("Combined Chart methods borrowed from class sap.ca.ui.charts.Chart", function () {
        qunitChartHelper.testGenericChartMethods(oCombined);
    });

    test("Combined Chart setters/getters test", function () {
        var oCombined1 = new sap.ca.ui.charts.CombinedChart();
        oCombined1.setPrimaryAxis(["Country"]);
        var primaryAxis = oCombined1.getPrimaryAxis();
        ok(primaryAxis[0] === "Country", "primaryAxis property is 'Country'");

        oCombined1.setSecondAxis(["Profit"]);
        var secondAxis = oCombined1.getSecondAxis();
        ok(secondAxis[0] === "Profit", "secondAxis property is 'Profit'");
    });

    test("Combined Chart create and delete test", function () {
        var oCombined3 = new sap.ca.ui.charts.CombinedChart();
        qunitChartHelper.testGenericChartDestroy(oCombined3, "content");
    });
});
