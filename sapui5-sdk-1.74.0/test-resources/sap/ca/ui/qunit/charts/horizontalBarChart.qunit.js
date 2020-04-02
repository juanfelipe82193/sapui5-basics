window.addEventListener("load", function () {
    // require dialog module
    jQuery.sap.require("sap.ca.ui.charts.HorizontalBarChart");
    var oHorizontalBarChart;
    sinon.config.useFakeTimers = false;

    var CHART_ID = "HorizontalBarChartID";
    $ = jQuery;
    module("HorizontalBarChart");

    test("Horizontal Bar Chart Creation with Id", function () {
        oHorizontalBarChart = new sap.ca.ui.charts.HorizontalBarChart({
            chartTitle: "Horizontal Chart",
            id: CHART_ID
        });

        qunitChartHelper.initializeGenericChart(oHorizontalBarChart, "content");
        strictEqual(oHorizontalBarChart.getId(), CHART_ID, "Chart has ID " + CHART_ID);
    });

    test("Horizontal Bar Chart methods borrowed from class sap.ca.ui.charts.Chart", function () {
        qunitChartHelper.testGenericChartMethods(oHorizontalBarChart);
    });

    test("Horizontal Bar Chart setters/getters test", function () {
        var oHorizontalBarChart1 = new sap.ca.ui.charts.HorizontalBarChart();
        oHorizontalBarChart1.setBarHeight("30px");
        var barHeight = oHorizontalBarChart1.getBarHeight();
        equal(barHeight, "30px", "barHeight property is '30px");
    });

    test("Horizontal Bar Chart create and delete test", function () {
        var oHorizontalBarChart3 = new sap.ca.ui.charts.HorizontalBarChart();
        qunitChartHelper.testGenericChartDestroy(oHorizontalBarChart3, "content");
    });
});
