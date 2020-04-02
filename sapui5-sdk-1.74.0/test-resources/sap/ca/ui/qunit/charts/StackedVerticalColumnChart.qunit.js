window.addEventListener("load", function () {
    // require dialog module
    jQuery.sap.require("sap.ca.ui.charts.StackedVerticalColumnChart");
    var oStackedVerticalColumnChart;
    var oStackedVerticalColumn100Chart;
    var oDualStackedVerticalColumnChart;
    var oDualStackedVerticalColumnChart100;
    sinon.config.useFakeTimers = false;

    var CHART_ID = "StackedVerticalColumnChartID";
    var CHART_ID_100 = "StackedVerticalColumn100ChartID";
    var CHART_ID_DUAL = "DualStackedVerticalColumnChartID";
    var CHART_ID_DUAL_100 = "DualStackedVerticalColumn100ChartID";
    $ = jQuery;
    module("StackedVerticalColumnChart");

    test("Stacked Vertical Column Chart Creation with Id", function () {
        oStackedVerticalColumnChart = new sap.ca.ui.charts.StackedVerticalColumnChart({
            chartTitle: "Stacked Vertical Column Chart",
            id: CHART_ID
        });
        oStackedVerticalColumnChart.setChartType(sap.ca.ui.charts.ChartType.StackedColumn);
        qunitChartHelper.initializeGenericChart(oStackedVerticalColumnChart, "content");
        strictEqual(oStackedVerticalColumnChart.getId(), CHART_ID, "Chart has ID " + CHART_ID);

        oStackedVerticalColumn100Chart = new sap.ca.ui.charts.StackedVerticalColumnChart({
            chartTitle: "Stacked Vertical Column 100 Chart",
            id: CHART_ID_100
        });
        oStackedVerticalColumn100Chart.setChartType(sap.ca.ui.charts.ChartType.StackedColumn100);
        qunitChartHelper.initializeGenericChart(oStackedVerticalColumn100Chart, "content");
        strictEqual(oStackedVerticalColumn100Chart.getId(), CHART_ID_100, "Chart has ID " + CHART_ID_100);

        oDualStackedVerticalColumnChart = new sap.ca.ui.charts.StackedVerticalColumnChart({
            chartTitle: "Dual Stacked Vertical Column Chart",
            id: CHART_ID_DUAL
        });
        oDualStackedVerticalColumnChart.setChartType(sap.ca.ui.charts.ChartType.DualStackedColumn);
        qunitChartHelper.initializeGenericChart(oDualStackedVerticalColumnChart, "content", true);
        strictEqual(oDualStackedVerticalColumnChart.getId(), CHART_ID_DUAL, "Chart has ID " + CHART_ID_DUAL);

        oDualStackedVerticalColumnChart100 = new sap.ca.ui.charts.StackedVerticalColumnChart({
            chartTitle: "Dual Stacked Vertical Column 100 Chart",
            id: CHART_ID_DUAL_100
        });
        oDualStackedVerticalColumnChart100.setChartType(sap.ca.ui.charts.ChartType.DualStackedColumn100);
        qunitChartHelper.initializeGenericChart(oDualStackedVerticalColumnChart100, "content", true);
        strictEqual(oDualStackedVerticalColumnChart100.getId(), CHART_ID_DUAL_100, "Chart has ID " + CHART_ID_DUAL_100);
    });

    test("Stacked Vertical Column Chart methods borrowed from class sap.ca.ui.charts.Chart", function () {
        qunitChartHelper.testGenericChartMethods(oStackedVerticalColumnChart);
        qunitChartHelper.testGenericChartMethods(oStackedVerticalColumn100Chart);
        qunitChartHelper.testGenericChartMethods(oDualStackedVerticalColumnChart, true);
        qunitChartHelper.testGenericChartMethods(oDualStackedVerticalColumnChart100, true);
    });

    test("Stacked Vertical Column Chart setters/getters test", function () {
        var oStackedVerticalColumnChart1 = new sap.ca.ui.charts.StackedVerticalColumnChart();

        oStackedVerticalColumnChart1.setMinTouchSize();
        if (jQuery.device.is.desktop) {
            equal(oStackedVerticalColumnChart1.getMinTouchSize(), "24px", "minTouchSize property is '24px'");
        } else {
            equal(oStackedVerticalColumnChart1.getMinTouchSize(), "48px", "minTouchSize property is '48px'");
        }

        oStackedVerticalColumnChart1.setType("viz/stacked_column");
        equal(oStackedVerticalColumnChart1.getType(), sap.ca.ui.charts.ChartType.StackedColumn, "type property is sap.ca.ui.charts.ChartType.StackedColumn");

        oStackedVerticalColumnChart1.setType("viz/100_stacked_column");
        equal(oStackedVerticalColumnChart1.getType(), sap.ca.ui.charts.ChartType.StackedColumn100, "type property is sap.ca.ui.charts.ChartType.StackedColumn100");

        oStackedVerticalColumnChart1.setType("viz/dual_stacked_column");
        equal(oStackedVerticalColumnChart1.getType(), sap.ca.ui.charts.ChartType.DualStackedColumn, "type property is sap.ca.ui.charts.ChartType.DualStackedColumn");

        oStackedVerticalColumnChart1.setType("viz/100_dual_stacked_column");
        equal(oStackedVerticalColumnChart1.getType(), sap.ca.ui.charts.ChartType.DualStackedColumn100, "type property is sap.ca.ui.charts.ChartType.DualStackedColumn100");

    });

    test("Stacked Vertical Column Chart create and delete test", function () {
        var oStackedVerticalColumnChart3 = new sap.ca.ui.charts.StackedVerticalColumnChart();
        qunitChartHelper.testGenericChartDestroy(oStackedVerticalColumnChart3, "content");
    });
});
