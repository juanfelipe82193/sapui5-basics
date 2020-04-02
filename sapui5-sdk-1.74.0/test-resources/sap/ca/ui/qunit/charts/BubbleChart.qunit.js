window.addEventListener("load", function () {
    // require dialog module
    jQuery.sap.require("sap.ca.ui.charts.BubbleChart");
    jQuery.sap.require("sap.ui.model.json.JSONModel");
    jQuery.sap.require("sap.viz.ui5.data.FlattenedDataset");
    jQuery.sap.require("sap.ui.layout.HorizontalLayout");

    sinon.config.useFakeTimers = false;

    $ = jQuery;
    module('Bubble');

    var chartID = "BUBBLECHART";
    var createChart = function () {
        var oBubbleChart = new sap.ca.ui.charts.BubbleChart({id: chartID});

        var oData = {
            businessData: [
                {Country: "Canada", revenue: 1410.87, profit: -141.25, date: 1379421492000, label: "Canada Label"},
                {Country: "China", revenue: 3338.29, profit: 133.82, date: 1379422492000, label: "China Label"},
                {Country: "France", revenue: 987.66, profit: 348.76, date: 1387422592000, label: "France Label"},
                {Country: "Germany", revenue: 2170.23, profit: 417.29, date: 1369422492000, label: "Germany Label"},
                {Country: "India", revenue: 6170.93, profit: 517.00, date: 1379422492000, label: "India Label"},
                {
                    Country: "United States",
                    revenue: 1005.08,
                    profit: 609.16,
                    date: 1377422492000,
                    label: "States label"
                },
                {Country: "US", revenue: 490.87, profit: -141.25, date: 1373422492000, label: "US Label"},
                {Country: "UK", revenue: 1038.29, profit: 133.82, date: 1379482492000, label: "UK Label"},
                {Country: "Ireland", revenue: 887.66, profit: 318.76, date: 1369422492000, label: "Ireland Label"},
                {Country: "Spain", revenue: 4705.23, profit: 217.29, date: 1375422492000, label: "Spain Label"},
                {Country: "IR", revenue: 1370.93, profit: 167.00, date: 1373422492000, label: "IR LAbel"},
                {Country: "IN", revenue: 905.08, profit: 659.16, date: 1374422492000, label: "IN Label"}
            ]
        };

        oBubbleChart._oModel = new sap.ui.model.json.JSONModel();
        oBubbleChart._oModel.setData(oData);
        oBubbleChart.setModel(oBubbleChart._oModel);
        oBubbleChart.oDataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions: [
                {axis: 1, name: 'Country', value: "{Country}"}
            ],
            measures: [
                {
                    group: 1, name: 'Date',
                    value: {
                        path: 'date', formatter: function ($) {
                            return (new Date(parseInt($, 10)).getTime() - Date.now()) / 1000 / 3600 / 24;
                        }
                    }
                },
                {group: 2, name: 'Profit', value: '{profit}'},
                {group: 3, name: 'Revenue', value: '{revenue}'}
            ],
            data: {path: "/businessData"}
        });

        oBubbleChart.setTitle("Test Bubble Chart");
        var hl = new sap.ui.layout.HorizontalLayout();
        hl.addContent(oBubbleChart);
        hl.placeAt("content");
        sap.ui.getCore().applyChanges();

        return oBubbleChart;
    };

    test("Bubble Chart Creation with Id", function () {
        var oBubbleChartUI = createChart();
        //var aBubble = sap.ui.getCore().byId(chartID);
        equal(oBubbleChartUI.getId(), chartID, "Bubble chart ID is not" + chartID);
        oBubbleChartUI.destroy();
    });

    test("Bubble Chart create and delete test", function () {
        var oBubbleChart2 = new sap.ca.ui.charts.BubbleChart();
        oBubbleChart2.placeAt("content");
        sap.ui.getCore().applyChanges();

        ok(!!oBubbleChart2, "Bubble Chart created");
        ok(sap.ui.getCore().byId(oBubbleChart2.getId()), "Bubble Chart Found");

        // Destroy object
        oBubbleChart2.destroy();

        ok(!sap.ui.getCore().byId(oBubbleChart2.getId()), "Bubble Chart destroyed");
    });

    test("Bubble Chart setters/getters test", function () {
        var oBubbleChart = new sap.ca.ui.charts.BubbleChart();

        oBubbleChart.setLabelProperty(["first", "second"]);
        var labelProps = oBubbleChart.getLabelProperty();
        ok(labelProps[0] === "first", "1st label property is 'first'");
        ok(labelProps[1] === "second", "2nd label property is 'second'");

        oBubbleChart.setMinimumLabelSize(123);
        ok(oBubbleChart.getMinimumLabelSize() === 123, "Minimum label size is 123");

        //    oBubbleChart.setShowCustomLabels(false);
        //    ok(false === oBubbleChart.getShowCustomLabels(), "showCustomLabel false");
        //    oBubbleChart.setShowCustomLabels(true);
        //    ok(true === oBubbleChart.getShowCustomLabels(), "showCustomLabel true");

        oBubbleChart.setShowCustomLabels(false);
        ok(false === oBubbleChart.getShowCustomLabels(), "ShowCustomLabel false");
        oBubbleChart.setShowCustomLabels(true);
        ok(true === oBubbleChart.getShowCustomLabels(), "ShowCustomLabel true");

        oBubbleChart.setShowSizeLegend(false);
        ok(false === oBubbleChart.getShowSizeLegend(), "ShowSizeLegend false");
        oBubbleChart.setShowSizeLegend(true);
        ok(true === oBubbleChart.getShowSizeLegend(), "ShowSizeLegend true");

        //    oBubbleChart.setShowTitle(false);
        //    ok(false === oBubbleChart.getShowTitle(), "ShowTitle false");
        //    oBubbleChart.setShowTitle(true);
        //    ok(true === oBubbleChart.getShowTitle(), "ShowTitle true");

        //    oBubbleChart.setShowXAxisLabel(false);
        //    ok(false === oBubbleChart.getShowXAxisLabel(), "ShowXAxisLabel false");
        //    oBubbleChart.setShowXAxisLabel(true);
        ok(true === oBubbleChart.getShowXAxisLabel(), "ShowXAxisLabel true");

        //    oBubbleChart.setShowYAxisLabel(false);
        //    ok(false === oBubbleChart.getShowYAxisLabel(), "ShowYAxisLabel false");
        //    oBubbleChart.setShowYAxisLabel(true);
        ok(true === oBubbleChart.getShowYAxisLabel(), "ShowYAxisLabel true");

        oBubbleChart.setXAxisFixedRange(false);
        ok(false === oBubbleChart.getXAxisFixedRange(), "XAxisFixedRange false");
        oBubbleChart.setXAxisFixedRange(true);
        ok(true === oBubbleChart.getXAxisFixedRange(), "XAxisFixedRange true");

        oBubbleChart.setXAxisMaxValue(20);
        ok(20 === oBubbleChart.getXAxisMaxValue(), "XAxisMaxValue 20");
        oBubbleChart.setXAxisMaxValue(400);
        ok(400 === oBubbleChart.getXAxisMaxValue(), "XAxisMaxValue 400");

        oBubbleChart.setXAxisMinValue(33);
        ok(33 === oBubbleChart.getXAxisMinValue(), "XAxisMinValue 33");
        oBubbleChart.setXAxisMinValue(444);
        ok(444 === oBubbleChart.getXAxisMinValue(), "XAxisMinValue 444");

        oBubbleChart.setXAxisTitle("my Title");
        ok("my Title" === oBubbleChart.getXAxisTitle(), "XAxisTitle");

        oBubbleChart.setYAxisFixedRange(false);
        ok(false === oBubbleChart.getYAxisFixedRange(), "YAxisFixedRange false");
        oBubbleChart.setYAxisFixedRange(true);
        ok(true === oBubbleChart.getYAxisFixedRange(), "YAxisFixedRange true");

        oBubbleChart.setYAxisMaxValue(444);
        ok(444 === oBubbleChart.getYAxisMaxValue(), "YAxisMaxValue 444");
        oBubbleChart.setYAxisMaxValue(111);
        ok(111 === oBubbleChart.getYAxisMaxValue(), "YAxisMaxValue 111");

        oBubbleChart.setYAxisMinValue(123);
        ok(123 === oBubbleChart.getYAxisMinValue(), "YAxisMinValue 123");
        oBubbleChart.setYAxisMinValue(987);
        ok(987 === oBubbleChart.getYAxisMinValue(), "YAxisMinValue 987");

        oBubbleChart.setYAxisTitle("my other title");
        ok("my other title" === oBubbleChart.getYAxisTitle(), "YAxisTitle");

        //     ok(null === oBubbleChart.getContent(), "getContent should return null");
        oBubbleChart.destroy();
    });
});
