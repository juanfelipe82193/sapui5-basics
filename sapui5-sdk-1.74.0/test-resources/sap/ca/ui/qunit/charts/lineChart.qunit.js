window.addEventListener("load", function () {
    // require dialog module
    jQuery.sap.require("sap.ca.ui.charts.LineChart");
    jQuery.sap.require("sap.ui.layout.HorizontalLayout");

    $ = jQuery;
    var chartID = "LINE_CHART";

    var createChart = function () {
        var oLineChart = new sap.ca.ui.charts.LineChart({id: chartID});

        var hl = new sap.ui.layout.HorizontalLayout();
        hl.addContent(oLineChart);
        hl.placeAt("content");
        sap.ui.getCore().applyChanges();

        return oLineChart;
    };

    module('Line Chart');

    /*
     * Test that the line chart has been created
     */
    test("Line Chart Creation with Id", function () {
        var oLineChart = createChart();
        strictEqual(oLineChart.getId(), chartID, "line chart ID is not" + chartID);
        oLineChart.destroy();
    });

    /*
     * Test that the line chart can be created then destroyed
     */
    test("Line Chart Destroy", function () {
        var chartID2 = "LINECHART222";
        var oLineChart = new sap.ca.ui.charts.LineChart({id: chartID2});
        oLineChart.placeAt("content");
        sap.ui.getCore().applyChanges();

        ok(!!oLineChart, "Line Chart created");
        ok(sap.ui.getCore().byId(oLineChart.getId()), "Line Chart Found");

        // Destroy object
        oLineChart.destroy();

        ok(!sap.ui.getCore().byId(oLineChart.getId()), "Line Chart destroyed");
    });

    test("LineChart getters/setters", function () {
        var oLineChart = new sap.ca.ui.charts.LineChart();

        var deprecatedFunctions = ["ChartTitle", "ChartDataset", "ChartDatasetSettings", "DatasetSettings",
            "ChartBusinessData", "DataLabelFormat", "DataPath", "Data", "MinTouchSize",
            "ShowLabel", "UseDelayedResize", "Vertical", "ChartDataset"];

        for (var i = 0; i < deprecatedFunctions.length; i++) {
            var functionName = deprecatedFunctions[i];
            ok(null === oLineChart["get" + functionName](), "deprecated get" + functionName + " called");
            ok(oLineChart["set" + functionName]("") || true, "deprecated set" + functionName + " called");
        }

        oLineChart.destroy();
    });
});
