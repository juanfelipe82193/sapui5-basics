window.addEventListener("load", function () {
    // require dialog module
    jQuery.sap.require("sap.ca.ui.charts.StackedHorizontalBarChart");
    var oStackedHorizontalBarChart;
    var oStackedHorizontalBar100Chart;
    var oDualStackedHorizontalBarChart;
    var oDualStackedHorizontalBarChart100;

    sinon.config.useFakeTimers = false;

    var CHART_ID = "StackedHorizontalBarChartID";
    var CHART_ID_100 = "StackedHorizontalBar100ChartID";
    var CHART_ID_DUAL = "DualStackedHorizontalBarChartID";
    var CHART_ID_DUAL_100 = "DualStackedHorizontalBar100ChartID";

    $ = jQuery;
    module("StackedHorizontalBarChart");

    test("Stacked Horizontal Bar Chart Creation with Id", function () {
        oStackedHorizontalBarChart = new sap.ca.ui.charts.StackedHorizontalBarChart({
            chartTitle: "Stacked Horizontal Bar Chart",
            id: CHART_ID
        });
        oStackedHorizontalBarChart.setChartType(sap.ca.ui.charts.ChartType.StackedBar);
        qunitChartHelper.initializeGenericChart(oStackedHorizontalBarChart, "content");
        strictEqual(oStackedHorizontalBarChart.getId(), CHART_ID, "Chart has ID " + CHART_ID);

        oStackedHorizontalBar100Chart = new sap.ca.ui.charts.StackedHorizontalBarChart({
            chartTitle: "Stacked Horizontal Bar 100 Chart",
            id: CHART_ID_100
        });
        oStackedHorizontalBar100Chart.setChartType(sap.ca.ui.charts.ChartType.StackedBar100);
        qunitChartHelper.initializeGenericChart(oStackedHorizontalBar100Chart, "content");
        strictEqual(oStackedHorizontalBar100Chart.getId(), CHART_ID_100, "Chart has ID " + CHART_ID_100);

        oDualStackedHorizontalBarChart = new sap.ca.ui.charts.StackedHorizontalBarChart({
            chartTitle: "Dual Stacked Horizontal Bar Chart",
            id: CHART_ID_DUAL
        });
        oDualStackedHorizontalBarChart.setChartType(sap.ca.ui.charts.ChartType.DualStackedBar);
        qunitChartHelper.initializeGenericChart(oDualStackedHorizontalBarChart, "content", true);
        strictEqual(oDualStackedHorizontalBarChart.getId(), CHART_ID_DUAL, "Chart has ID " + CHART_ID_DUAL);

        oDualStackedHorizontalBarChart100 = new sap.ca.ui.charts.StackedHorizontalBarChart({
            chartTitle: "Dual Stacked Horizontal Bar 100 Chart",
            id: CHART_ID_DUAL_100
        });
        oDualStackedHorizontalBarChart100.setChartType(sap.ca.ui.charts.ChartType.DualStackedBar100);
        qunitChartHelper.initializeGenericChart(oDualStackedHorizontalBarChart100, "content", true);
        strictEqual(oDualStackedHorizontalBarChart100.getId(), CHART_ID_DUAL_100, "Chart has ID " + CHART_ID_DUAL_100);
    });

    test("Stacked Horizontal Bar Chart methods borrowed from class sap.ca.ui.charts.Chart", function () {
        qunitChartHelper.testGenericChartMethods(oStackedHorizontalBarChart);
        qunitChartHelper.testGenericChartMethods(oStackedHorizontalBar100Chart);
        qunitChartHelper.testGenericChartMethods(oDualStackedHorizontalBarChart, true);
        qunitChartHelper.testGenericChartMethods(oDualStackedHorizontalBarChart100, true);
    });

    test("Stacked Horizontal Bar Chart setters/getters test", function () {
        var oStackedHorizontalBarChart1 = new sap.ca.ui.charts.StackedHorizontalBarChart();

        oStackedHorizontalBarChart1.setMinTouchSize();
        if (jQuery.device.is.desktop) {
            equal(oStackedHorizontalBarChart1.getMinTouchSize(), "24px", "minTouchSize property is '24px'");
        } else {
            equal(oStackedHorizontalBarChart1.getMinTouchSize(), "48px", "minTouchSize property is '48px'");
        }

        oStackedHorizontalBarChart1.setType("viz/stacked_bar");
        equal(oStackedHorizontalBarChart1.getType(), sap.ca.ui.charts.ChartType.StackedBar, "type property is sap.ca.ui.charts.ChartType.StackedBar");

        oStackedHorizontalBarChart1.setType("viz/100_stacked_bar");
        equal(oStackedHorizontalBarChart1.getType(), sap.ca.ui.charts.ChartType.StackedBar100, "type property is sap.ca.ui.charts.ChartType.StackedBar100");

        oStackedHorizontalBarChart1.setType("viz/dual_stacked_bar");
        equal(oStackedHorizontalBarChart1.getType(), sap.ca.ui.charts.ChartType.DualStackedBar, "type property is sap.ca.ui.charts.ChartType.DualStackedBar");

        oStackedHorizontalBarChart1.setType("viz/100_dual_stacked_bar");
        equal(oStackedHorizontalBarChart1.getType(), sap.ca.ui.charts.ChartType.DualStackedBar100, "type property is sap.ca.ui.charts.ChartType.DualStackedBar100");

    });

    test("Stacked Horizontal Bar Chart create and delete test", function () {
        var oStackedHorizontalBarChart3 = new sap.ca.ui.charts.StackedHorizontalBarChart();
        qunitChartHelper.testGenericChartDestroy(oStackedHorizontalBarChart3, "content");
    });
});
