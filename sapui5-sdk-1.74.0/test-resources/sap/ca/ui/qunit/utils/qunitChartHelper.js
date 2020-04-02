jQuery.sap.require("sap.ui.model.json.JSONModel");
jQuery.sap.require("sap.viz.ui5.data.FlattenedDataset");
jQuery.sap.require("sap.ui.layout.HorizontalLayout");

var qunitChartHelper = {

    initializeGenericChart : function(oChart, sPlaceAt, withSecondAxis) {
        var oModel = new sap.ui.model.json.JSONModel({
            businessData: [
                {COUNTRY: "Canada", DIVISION:'H-524-720', REVENUE: 410.87, PROFIT: 141.25,PLANNED: 290.12},
                {COUNTRY: "China", DIVISION:'H-524-720',REVENUE: 338.29, PROFIT: 133.82,PLANNED: 190.12},
                {COUNTRY: "France", DIVISION:'H-524-720',REVENUE: 487.66, PROFIT: 348.76,PLANNED: 290.50},
                {COUNTRY: "Germany", DIVISION:'H-524-720',REVENUE: 470.23, PROFIT: 217.29,PLANNED: 290.50},
                {COUNTRY: "India", DIVISION:'H-524-721',REVENUE: 170.93, PROFIT: 117.00,PLANNED: 110.50},
                {COUNTRY: "United States", DIVISION:'H-524-721',REVENUE: 905.08, PROFIT: 609.16,PLANNED: 710.50},
                {COUNTRY: "Italy", DIVISION:'H-524-721',REVENUE: 410.87, PROFIT: 141.25,PLANNED: 410.50},
                {COUNTRY: "Spain", DIVISION:'H-524-721',REVENUE: 338.29, PROFIT: 133.82,PLANNED: 110.50},
                {COUNTRY: "Portugal", DIVISION:'H-524-722',REVENUE: 487.66, PROFIT: 348.76,PLANNED: 310.50},
                {COUNTRY: "Ireland", DIVISION:'H-524-722',REVENUE: 470.23, PROFIT: 217.29,PLANNED: 240.50},
                {COUNTRY: "Scotland", DIVISION:'H-524-722',REVENUE: 170.93, PROFIT: 117.00,PLANNED: 140.50},
                {COUNTRY: "Wales", DIVISION:'H-524-722',REVENUE: 905.08, PROFIT: 609.16,PLANNED: 540.50},
                {COUNTRY: "England", DIVISION:'H-524-723',REVENUE: 410.87, PROFIT: 141.25,PLANNED: 140.50},
                {COUNTRY: "Belgium", DIVISION:'H-524-723',REVENUE: 338.29, PROFIT: 133.82,PLANNED: 240.50},
                {COUNTRY: "Andorra", DIVISION:'H-524-723',REVENUE: 487.66, PROFIT: 348.76,PLANNED: 362.50},
                {COUNTRY: "Netherlands",DIVISION:'H-524-723', REVENUE: 470.23, PROFIT: 217.29,PLANNED: 362.50},
                {COUNTRY: "Poland", DIVISION:'H-524-724',REVENUE: 170.93, PROFIT: 117.00,PLANNED: 162.50},
                {COUNTRY: "Danemark",DIVISION:'H-524-724', REVENUE: 905.08, PROFIT: 609.16,PLANNED: 562.50},
                {COUNTRY: "Sweden", DIVISION:'H-524-724',REVENUE: 410.87, PROFIT: 141.25,PLANNED: 262.50},
                {COUNTRY: "Norway", DIVISION:'H-524-725',REVENUE: 338.29, PROFIT: 133.82,PLANNED: 262.50},
                {COUNTRY: "Finland",DIVISION:'H-524-725', REVENUE: 487.66, PROFIT: 348.76,PLANNED: 352.50},
                {COUNTRY: "Russia", DIVISION:'H-524-725',REVENUE: 470.23, PROFIT: 217.29,PLANNED: 252.50},
                {COUNTRY: "Bularia", DIVISION:'H-524-725',REVENUE: 170.93, PROFIT: 117.00,PLANNED: 152.50},
                {COUNTRY: "Romania", DIVISION:'H-524-726',REVENUE: 905.08, PROFIT: 609.16,PLANNED: 652.50},
                {COUNTRY: "Alabania", DIVISION:'H-524-726',REVENUE: 410.87, PROFIT: 141.25,PLANNED: 452.50},
                {COUNTRY: "Greece", DIVISION:'H-524-726',REVENUE: 338.29, PROFIT: 133.82,PLANNED: 366.50},
                {COUNTRY: "Turkey", DIVISION:'H-524-726',REVENUE: 487.66, PROFIT: 348.76,PLANNED: 466.50},
                {COUNTRY: "South Africa", DIVISION:'H-524-727',REVENUE: 470.23, PROFIT: 217.29,PLANNED: 466.50},
                {COUNTRY: "Australia", DIVISION:'H-524-727',REVENUE: 170.93, PROFIT: 117.00,PLANNED: 166.50},
                {COUNTRY: "New Zeland", DIVISION:'H-524-727',REVENUE: 905.08, PROFIT: 609.16,PLANNED: 945.50},
                {COUNTRY: "Japan", DIVISION:'H-524-727',REVENUE: 410.87, PROFIT: 141.25,PLANNED: 445.50},
                {COUNTRY: "Indonesia",DIVISION:'H-524-728', REVENUE: 338.29, PROFIT: 133.82,PLANNED: 345.50},
                {COUNTRY: "Argentina", DIVISION:'H-524-728',REVENUE: 487.66, PROFIT: 348.76,PLANNED: 368.50},
                {COUNTRY: "Mexico", DIVISION:'H-524-728',REVENUE: 470.23, PROFIT: 217.29,PLANNED: 468.50},
                {COUNTRY: "Brazil", DIVISION:'H-524-728',REVENUE: 170.93, PROFIT: 117.00,PLANNED: 168.50},
                {COUNTRY: "Chile", DIVISION:'H-524-729',REVENUE: 905.08, PROFIT: 609.16,PLANNED: 657.50},
                {COUNTRY: "Peru", DIVISION:'H-524-729',REVENUE: 410.87, PROFIT: 141.25,PLANNED: 457.50},
                {COUNTRY: "Colombia", DIVISION:'H-524-729',REVENUE: 338.29, PROFIT: 133.82,PLANNED: 357.50},
                {COUNTRY: "Venezuela", DIVISION:'H-524-729',REVENUE: 487.66, PROFIT: 348.76,PLANNED: 457.50},
                {COUNTRY: "Uruguay", DIVISION:'H-524-730',REVENUE: 470.23, PROFIT: 217.29,PLANNED: 457.50},
                {COUNTRY: "Honduras", DIVISION:'H-524-730',REVENUE: 170.93, PROFIT: 117.00,PLANNED: 157.50},
                {COUNTRY: "Ghana", DIVISION:'H-524-730',REVENUE: 905.08, PROFIT: 609.16,PLANNED: 957.50},
                {COUNTRY: "Israel", DIVISION:'H-524-730',REVENUE: 410.87, PROFIT: 141.25,PLANNED: 499.50},
                {COUNTRY: "Lybia",DIVISION:'H-524-731', REVENUE: 338.29, PROFIT: 133.82,PLANNED: 399.50},
                {COUNTRY: "Algeria", DIVISION:'H-524-731',REVENUE: 487.66, PROFIT: 348.76,PLANNED: 499.50},
                {COUNTRY: "Marroco", DIVISION:'H-524-731',REVENUE: 470.23, PROFIT: 217.29,PLANNED: 499.50},
                {COUNTRY: "Guinea", DIVISION:'H-524-732',REVENUE: 170.93, PROFIT: 117.00,PLANNED: 144.50},
                {COUNTRY: "Iran",DIVISION:'H-524-732', REVENUE: 905.08, PROFIT: 609.16,PLANNED: 944.50},
                {COUNTRY: "Irak", DIVISION:'H-524-732',REVENUE: 410.87, PROFIT: 141.25,PLANNED: 455.50},
                {COUNTRY: "Egypt", DIVISION:'H-524-732',REVENUE: 338.29, PROFIT: 133.82,PLANNED: 355.50},
                {COUNTRY: "Kenya", DIVISION:'H-524-732',REVENUE: 487.66, PROFIT: 348.76,PLANNED: 455.50},
                {COUNTRY: "Island", DIVISION:'H-524-720',REVENUE: 470.23, PROFIT: 217.29,PLANNED: 455.50},
                {COUNTRY: "Cuba", DIVISION:'H-524-720',REVENUE: 170.93, PROFIT: 117.00,PLANNED: 155.50},
                {COUNTRY: "Pakistan",DIVISION:'H-524-720', REVENUE: 905.08, PROFIT: 609.16,PLANNED: 955}
            ]
        });
        var oDataset = new sap.viz.ui5.data.FlattenedDataset({
            dimensions: [
                {
                    axis: 1,
                    name: 'COUNTRY',
                    value: "{COUNTRY}"

                }
            ],

            measures: [
                {
                    name: 'PROFIT',
                    value: '{PROFIT}'
                },
                {
                    name: 'REVENUE',
                    value: '{REVENUE}'
                }
            ],

            data:{
                path:"/businessData"
            }
        });

        var oDatasetWithSecondAxis = new sap.viz.ui5.data.FlattenedDataset({
            dimensions: [
                {
                    axis: 1,
                    name: 'COUNTRY',
                    value: "{COUNTRY}"

                },
                {
                    axis: 2,
                    name: 'DIVISION',
                    value: "{DIVISION}"

                }
            ],

            measures: [
                {
                    name: 'PROFIT',
                    value: '{PROFIT}',
                    group: 1
                },
                {
                    name: 'REVENUE',
                    value: '{REVENUE}',
                    group: 2
                },
                {
                    name: 'PLANNED',
                    value: '{PLANNED}',
                    group: 2
                }
            ],

            data:{
                path:"/businessData"
            }
        });


        if (withSecondAxis) {
            oDatasetWithSecondAxis.setModel(oModel);
        }else {
            oDataset.setModel(oModel);
        }
        var  errMsgModel;
        try {
            oChart.setModel(oModel);
        } catch (err) {
            errMsgModel = err.message;
        }
        equal(errMsgModel, undefined, "setModel doesn't throw error");
        var  errMsgDataset;
        try {
            if (withSecondAxis) {
                oChart.setDataset(oDatasetWithSecondAxis);
            }else {
                oChart.setDataset(oDataset);
            }
        } catch (err) {
            errMsgDataset = err.message;
        }
        equal(errMsgDataset, undefined, "setDataset doesn't throw error");
        ok(oChart.getDataset() !== undefined &&  oChart.getDataset() !== null, "dataset property is not undefined");

        var oHorizontalLayout = sap.ui.getCore().byId("content-layout");
        if(!oHorizontalLayout)  {
            oHorizontalLayout = new sap.ui.layout.HorizontalLayout("content-layout");
            oHorizontalLayout.placeAt(sPlaceAt);
        }
        oHorizontalLayout.addContent(oChart);
    },

    testGenericChartMethods : function(oChart, withSecondAxis){
        ok(oChart.getInternalVizChart() !== undefined && oChart.getInternalVizChart() !== null , "InternalVizChart property is not undefined");
        var chartType  = oChart.getChartType();
        ok(chartType !== undefined && chartType !== null  && chartType !== "", "chartType property is not undefined");
        var vizChartType = sap.ca.ui.charts.ChartType.getChartProperties(oChart.getChartType());
        ok(vizChartType !== undefined && vizChartType !== null, "Check getChartProperties");

        switch(chartType) {
            case sap.ca.ui.charts.ChartType.Bar:
                ok(oChart instanceof sap.ca.ui.charts.HorizontalBarChart, "Check chartType property");
                equal(vizChartType.name, "Bar", "Check viz name is Bar");
                equal(vizChartType.dualAxis, false, "Check dualAxis is false");
                equal(vizChartType.stacked, false, "Check stacked is false");
                break;
            case sap.ca.ui.charts.ChartType.StackedBar:
                ok(oChart instanceof sap.ca.ui.charts.StackedHorizontalBarChart, "Check chartType property");
                equal(vizChartType.name, "StackedColumn", "Check viz name is StackedColumn");
                equal(vizChartType.dualAxis, false, "Check dualAxis is false");
                equal(vizChartType.stacked, true, "Check stacked is true");
                break;
            case  sap.ca.ui.charts.ChartType.StackedBar100:
                ok(oChart instanceof sap.ca.ui.charts.StackedHorizontalBarChart, "Check chartType property");
                equal(vizChartType.name, "StackedColumn100", "Check viz name is StackedColumn100");
                equal(vizChartType.dualAxis, false, "Check dualAxis is false");
                equal(vizChartType.stacked, true, "Check stacked is true");
                break;
            case sap.ca.ui.charts.ChartType.DualStackedBar:
                ok(oChart instanceof sap.ca.ui.charts.StackedHorizontalBarChart, "Check chartType property");
                equal(vizChartType.name, "DualStackedColumn", "Check viz name is DualStackedColumn");
                equal(vizChartType.dualAxis, true, "Check dualAxis is true");
                equal(vizChartType.stacked, true, "Check stacked is true");
                break;
            case  sap.ca.ui.charts.ChartType.DualStackedBar100:
                ok(oChart instanceof sap.ca.ui.charts.StackedHorizontalBarChart, "Check chartType property");
                equal(vizChartType.name, "DualStackedColumn100", "Check viz name is DualStackedColumn100");
                equal(vizChartType.dualAxis, true, "Check dualAxis is true");
                equal(vizChartType.stacked, true, "Check stacked is true");
                break;
            case sap.ca.ui.charts.ChartType.Column:
                ok(oChart instanceof sap.ca.ui.charts.VerticalBarChart, "Check chartType property");
                equal(vizChartType.name, "Column", "Check viz name is Column");
                equal(vizChartType.dualAxis, false, "Check dualAxis is false");
                equal(vizChartType.stacked, false, "Check stacked is false");
                break;
            case sap.ca.ui.charts.ChartType.StackedColumn:
                ok(oChart instanceof sap.ca.ui.charts.StackedVerticalColumnChart, "Check chartType property");
                equal(vizChartType.name, "StackedColumn", "Check viz name is StackedColumn");
                equal(vizChartType.dualAxis, false, "Check dualAxis is false");
                equal(vizChartType.stacked, true, "Check stacked is true");
                break;
            case sap.ca.ui.charts.ChartType.StackedColumn100 :
                ok(oChart instanceof sap.ca.ui.charts.StackedVerticalColumnChart, "Check chartType property");
                equal(vizChartType.name, "StackedColumn100", "Check viz name is StackedColumn100");
                equal(vizChartType.dualAxis, false, "Check dualAxis is false");
                equal(vizChartType.stacked, true, "Check stacked is true");
                break;
            case sap.ca.ui.charts.ChartType.DualStackedColumn :
                ok(oChart instanceof sap.ca.ui.charts.StackedVerticalColumnChart, "Check chartType property");
                equal(vizChartType.name, "DualStackedColumn", "Check viz name is DualStackedColumn");
                equal(vizChartType.dualAxis, true, "Check dualAxis is true");
                equal(vizChartType.stacked, true, "Check stacked is true");
                break;
            case  sap.ca.ui.charts.ChartType.DualStackedColumn100:
                ok(oChart instanceof sap.ca.ui.charts.StackedVerticalColumnChart, "Check chartType property");
                equal(vizChartType.name, "DualStackedColumn100", "Check viz name is DualStackedColumn100");
                equal(vizChartType.dualAxis, true, "Check dualAxis is true");
                equal(vizChartType.stacked, true, "Check stacked is true");
                break;
            case  sap.ca.ui.charts.ChartType.Line :
                ok(oChart instanceof sap.ca.ui.charts.LineChart, "Check chartType property");
                equal(vizChartType.name, "Line", "Check viz name is Line");
                equal(vizChartType.dualAxis, false, "Check dualAxis is false");
                equal(vizChartType.stacked, false, "Check stacked is false");
                break;
            case  sap.ca.ui.charts.ChartType.Combination:
                ok(oChart instanceof sap.ca.ui.charts.CombinedChart, "Check chartType property");
                equal(vizChartType.name, "Combination", "Check viz name is Combination");
                equal(vizChartType.dualAxis, false, "Check dualAxis is false");
                equal(vizChartType.stacked, true, "Check stacked is true");
                break;
            case sap.ca.ui.charts.ChartType.Bubble:
                ok(oChart instanceof sap.ca.ui.charts.BubbleChart, "Check chartType property");
                equal(vizChartType.name, "Bubble", "Check viz name is Bubble");
                equal(vizChartType.dualAxis, false, "Check dualAxis is false");
                equal(vizChartType.stacked, true, "Check stacked is true");
                break;
        }
        ok(oChart.getHeight() !== undefined && oChart.getHeight() !== null  && oChart.getHeight() !== "", "height property is not undefined");
        ok(oChart.getWidth() !== undefined && oChart.getWidth() !== null  && oChart.getWidth() !== "", "width property is not undefined");


        oChart.setTitle("chart title");
        equal(oChart.getTitle(), "chart title", "title property is 'chart title'");

        oChart.setNoData(new sap.m.Text({text : 'no data'}));

        var noData = oChart.getNoData();
        ok(noData && noData instanceof sap.m.Text && noData.getText() == 'no data', "NoData property is 'no data'");

        var oSubHeader = new sap.m.Bar({
            contentMiddle : [new sap.m.Text({text: "Mike McQuota"})],
            contentRight: [new sap.m.Button({
                icon : "sap-icon://slim-arrow-right"
            })]
        });
        var  errMsgPopoverSubHeader;
        try {
            oChart.setPopoverSubHeader(oSubHeader);
        } catch (err) {
            errMsgPopoverSubHeader = err.message;
        }
        equal(errMsgPopoverSubHeader, undefined, "setPopoverSubHeader doesn't throw error");
        var oFooter = new sap.m.Bar({
            contentRight : [new sap.m.Button({
                icon : "sap-icon://inspection",
                text : "Details"
            })]
        });

        var errMsgPopoverFooter;
        try {
            oChart.setPopoverFooter(oFooter);
        } catch (err) {
            errMsgPopoverFooter = err.message;
        }
        equal(errMsgPopoverFooter, undefined, "setPopoverFooter doesn't throw error");

        var enumLabelFormatter = sap.ca.ui.charts.DefaultFormatterFunction.SHORTNUMBER;

        oChart.setYAxisLabelFormatter(enumLabelFormatter);
        var resultYAxisLabelFormatter = oChart.getYAxisLabelFormatter();
        ok(resultYAxisLabelFormatter
            && enumLabelFormatter.toString() === resultYAxisLabelFormatter.toString(),
            "Check property yAxisLabelFormatter");

        if (withSecondAxis){
            var enumLabel2Formatter = sap.ca.ui.charts.DefaultFormatterFunction.STANDARDNUMBER;
            oChart.setYAxis2LabelFormatter(enumLabel2Formatter);
            var resultYAxis2LabelFormatter = oChart.getYAxis2LabelFormatter();
            ok(resultYAxis2LabelFormatter
                && enumLabel2Formatter.toString() === resultYAxis2LabelFormatter.toString(),
                "Check property yAxisLabelFormatter");
        }
        var errMsgDataLabelFormatter;
        var arrayDataLabelFormatter = [[sap.ca.ui.charts.DefaultFormatterFunction.STANDARDNUMBER,sap.ca.ui.charts.DefaultFormatterFunction.SHORTNUMBER]];
        try {
            oChart.setDataLabelFormatter(arrayDataLabelFormatter);
        } catch (err) {
            errMsgDataLabelFormatter = err.message;
        }
        equal(errMsgDataLabelFormatter, undefined, "setDataLabelFormatter doesn't throw error");

        var resultDataLabelFormatter = oChart.getDataLabelFormatter();
        ok(resultDataLabelFormatter
            && arrayDataLabelFormatter.toString() === resultDataLabelFormatter.toString(),
            "Check property dataLabelFormatter");

        var arrayPopoverFormatter = [[sap.ca.ui.charts.DefaultFormatterFunction.SHORTNUMBER,sap.ca.ui.charts.DefaultFormatterFunction.SHORTNUMBER]];
        oChart.setPopoverFormatter(arrayPopoverFormatter);
        var resultPopoverFormatter =  oChart.getPopoverFormatter();
        ok(resultPopoverFormatter
            && arrayPopoverFormatter.toString() === resultPopoverFormatter.toString(),
            "Check property popoverFormatter");

        var arrayPlotAreaAxisTooltipFormatter = [sap.ca.ui.charts.DefaultFormatterFunction.SHORTNUMBER,sap.ca.ui.charts.DefaultFormatterFunction.SHORTNUMBER];
        var errMsgPlotAreaAxisTooltipFormatter;
        try {
            oChart.setPlotAreaAxisTooltipFormatter(arrayPlotAreaAxisTooltipFormatter);
        } catch (err) {
            errMsgPlotAreaAxisTooltipFormatter = err.message;
        }
        equal(errMsgPlotAreaAxisTooltipFormatter, undefined, "setPlotAreaAxisTooltipFormatter doesn't throw error");
        var resultPlotAreaAxisTooltipFormatter = oChart.getPlotAreaAxisTooltipFormatter();
        ok(resultPlotAreaAxisTooltipFormatter
            && arrayPlotAreaAxisTooltipFormatter.toString() === resultPlotAreaAxisTooltipFormatter.toString(),
            "Check property plotAreaAxisTooltipFormatter");

        oChart.setSelectionMode(sap.ca.ui.charts.ChartSelectionMode.Single);
        equal(oChart.getSelectionMode().toLowerCase(), sap.ca.ui.charts.ChartSelectionMode.Single.toLowerCase(),
            "selectionMode property is 'sap.ca.ui.charts.ChartSelectionMode.Single'");

        oChart.setSelectionMode(sap.ca.ui.charts.ChartSelectionMode.Multiple);
        equal(oChart.getSelectionMode().toLowerCase(), sap.ca.ui.charts.ChartSelectionMode.Multiple.toLowerCase(),
            "selectionMode property is 'sap.ca.ui.charts.ChartSelectionMode.Multiple'");

        oChart.setSelectionMode(sap.ca.ui.charts.ChartSelectionMode.None);
        equal(oChart.getSelectionMode().toLowerCase(), sap.ca.ui.charts.ChartSelectionMode.None.toLowerCase(),
            "selectionMode property is 'sap.ca.ui.charts.ChartSelectionMode.None'");

        oChart.setShowDataLabel(true);
        equal(oChart.getShowDataLabel(), true, "showDataLabel property is true");
        oChart.setShowDataLabel(false);
        equal(oChart.getShowDataLabel(), false, "showDataLabel property is false");

        oChart.setShowLegend (true);
        equal(oChart.getShowLegend(), true, "showLegend property is true");
        oChart.setShowLegend (false);
        equal(oChart.getShowLegend(), false, "showLegend property is false");

        oChart.setShowPopover(true);
        equal(oChart.getShowPopover(), true, "showPopover property is true");
        oChart.setShowPopover(false);
        equal(oChart.getShowPopover(), false, "showPopover property is false");

        oChart.setShowTooltip(true);
        equal(oChart.getShowTooltip(), true, "showTooltip property is true");
        oChart.setShowTooltip(false);
        equal(oChart.getShowTooltip(), false, "showTooltip property is false");

        oChart.setMinShapeSize();
        if (jQuery.device.is.desktop) {
            equal(oChart.getMinShapeSize(), "24px", "minShapeSize property is '24px'");
        }   else {
            equal(oChart.getMinShapeSize(), "48px", "minShapeSize property is '48px'");
        }

        var fnSemanticColoring =  jQuery.proxy(function(data) {
            if(data.val > 700) {
                return sap.ca.ui.charts.ChartSemanticColor.BadLight;
            }
            else if(data.val > 400) {
                return sap.ca.ui.charts.ChartSemanticColor.CriticalLight;
            }
            else if(data.val > 200) {
                return sap.ca.ui.charts.ChartSemanticColor.NeutralLight;
            }
            else {
                return sap.ca.ui.charts.ChartSemanticColor.GoodLight;
            }
        }, this);

        oChart.setChartSemanticColorFormatter(fnSemanticColoring);
        var resultFnSemanticColoring = oChart.getChartSemanticColorFormatter();
        var checkSemanticColoring;
        if (resultFnSemanticColoring){
            checkSemanticColoring = resultFnSemanticColoring({val:800});
        }
        ok(resultFnSemanticColoring
            && checkSemanticColoring
            && checkSemanticColoring === sap.ca.ui.charts.ChartSemanticColor.BadLight,
            "Check property chartSemanticColorFormatter");

        var advancedSettings = {
            title:{
                visible: true,
                text : "This is customer defined title"
            }
        };
        oChart.setAdvancedChartSettings(advancedSettings);
        var resultAdvancedSettings =  oChart.getAdvancedChartSettings(advancedSettings);
        deepEqual(advancedSettings, resultAdvancedSettings, "check property advancedChartSettings");
    },

    testGenericChartDestroy :function(oChart, sPlaceAt){
        oChart.placeAt(sPlaceAt);
        ok(!!oChart, "Chart created" );
        ok(sap.ui.getCore().byId(oChart.getId()), "Chart Found");
        // Destroy object
          oChart.destroy();
        ok(!sap.ui.getCore().byId(oChart.getId()), "Chart destroyed");
    }

};
