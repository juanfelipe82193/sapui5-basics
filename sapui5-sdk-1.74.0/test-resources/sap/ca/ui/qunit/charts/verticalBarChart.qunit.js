window.addEventListener("load", function () {
    // require dialog module
    jQuery.sap.require("sap.ca.ui.charts.VerticalBarChart");
    var oVerticalBarChart;
    sinon.config.useFakeTimers = false;

    var CHART_ID = "verticalChartID";
    $ = jQuery;
    module("verticalChart");

    test("Vertical Bar Chart Creation with Id", function () {
        oVerticalBarChart = new sap.ca.ui.charts.VerticalBarChart({
            chartTitle: "Vertical Chart",
            id: CHART_ID
        });

        qunitChartHelper.initializeGenericChart(oVerticalBarChart, "content");
        strictEqual(oVerticalBarChart.getId(), CHART_ID, "Chart has ID " + CHART_ID);
    });

    test("Vertical Chart methods borrowed from class sap.ca.ui.charts.Chart", function () {
        qunitChartHelper.testGenericChartMethods(oVerticalBarChart);
    });

    test("Vertical Chart setters/getters test", function () {
        var oVerticalBarChart1 = new sap.ca.ui.charts.VerticalBarChart();
        oVerticalBarChart1.setBarWidth("30px");
        var barWidth = oVerticalBarChart1.getBarWidth();
        equal(barWidth, "30px", "barWidth property is '30px");
    });

    test("Vertical Chart create and delete test", function () {
        var oVerticalBarChart3 = new sap.ca.ui.charts.VerticalBarChart();
        qunitChartHelper.testGenericChartDestroy(oVerticalBarChart3, "content");
    });
});
