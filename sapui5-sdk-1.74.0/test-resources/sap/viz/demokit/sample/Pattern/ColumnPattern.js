sap.ui.define([
        'sap/ui/core/Title',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/controls/Popover',
        'sap/viz/ui5/controls/VizFrame',
        'sap/viz/ui5/controls/common/feeds/FeedItem',
        'sap/viz/ui5/data/FlattenedDataset',
        'sap/viz/ui5/format/ChartFormatter'
    ], function(Title, JSONModel, Popover, VizFrame, FeedItem, FlattenedDataset, ChartFormatter) {
    "use strict";
    return {
        ColumnSettings : function(oView) {

            var dataPath = "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/date_revenue_actual_forcast_target";

            var settingsModel = ({
                key: "0",
                name : "Column & Stacked Column",
                value : [["Actual", "Forecast"],["Actual", "Target"],["Actual"],["Actual 2","Actual 1"]],
                vizType : ["timeseries_column","timeseries_column","timeseries_column","timeseries_stacked_column"],
                json : ["/timeaxis/actual_forecast.json",
                    "/timeaxis/actual_target.json",
                    "/timeaxis/semantic.json",
                    "/timeaxis/semantic2.json"],
                dataset : [{
                    dimensions: [{
                        name: 'Date',
                        value: "{Date}",
                        dataType:'date'
                    }],
                    measures: [{
                        name: 'Actual',
                        value: '{Actual}'
                    },{
                        name: 'Forecast',
                        value: '{Forecast}'
                    }],
                    data: {
                        path: "/milk"
                    }
                },{
                    dimensions: [{
                       name: 'Date',
                       value: "{Date}",
                       dataType:'date'
                   }],
                   measures: [{
                       name: 'Actual',
                       value: '{Actual}'
                   },{
                       name: 'Target',
                       value: '{Target}'
                   }],
                   data: {
                       path: "/milk"
                   }
                },{
                    dimensions: [{
                       name: 'Date',
                       value: "{Date}",
                       dataType:'date'
                    }],
                    measures: [{
                       name: 'Actual',
                       value: '{Actual}'
                    }],
                    data: {
                       path: "/milk"
                    }
                },{
                    dimensions: [{
                       name: 'Date',
                       value: "{Date}",
                       dataType:'date'
                    }],
                    measures: [{
                       name: 'Actual 1',
                       value: '{Actual 1}'
                    },{
                       name: 'Actual 2',
                       value: '{Actual 2}'
                   }],
                    data: {
                       path: "/milk"
                    }
                }],
                rules : [{
                    plotArea: {
                        dataPointStyle: {
                            "rules":
                                [
                                    {
                                        "dataContext": {"Actual": '*'},
                                        "properties": {
                                            "color":"sapUiChartPaletteQualitativeHue1"
                                        },
                                        "displayName":"Actual",
                                        "dataName" : {
                                            "Actual" : "Actual"
                                        }
                                    },
                                    {
                                        "dataContext": {"Forecast": '*'},
                                        "properties": {
                                            "color":"sapUiChartPaletteQualitativeHue1",
                                            "pattern":"diagonalLightStripe"
                                        },
                                        "displayName":"Forecast",
                                        "dataName" : {
                                            "Forecast" : "Forecast"
                                        }
                                    }

                                ]
                        }
                     }
                },{
                    plotArea: {
                        seriesStyle: {
                            "rules":
                                [
                                    {
                                        "dataContext": {"Target": '*'},
                                        "properties": {
                                            "dataPoint" :{
                                                    "pattern":"noFill"
                                                }
                                        }
                                    }
                                ]
                        },
                        colorPalette:["sapUiChartPaletteQualitativeHue1","sapUiChartZeroAxisColor"]
                     }
                },{
                    plotArea: {
                        dataPointStyle: {
                            "rules":
                                [
                                    {
                                        "dataContext": {"Date": {max : 1462032000000}, "Actual": '*'},
                                        "properties": {
                                            "color":"sapUiChartPaletteQualitativeHue1"
                                        },
                                        "displayName":"Actual",
                                        "dataName" : {
                                            "Actual" : "Actual"
                                        }
                                    },
                                    {
                                        "dataContext": {"Date": {min : 1469980800000}, "Actual": '*'},
                                        "properties": {
                                            "color":"sapUiChartPaletteQualitativeHue1",
                                            "pattern":"diagonalLightStripe"
                                        },
                                        "displayName":"Forecast",
                                        "dataName" : {
                                            "Actual" : "Forecast"
                                        }
                                    }
                                ]
                        }
                     }
                },{
                    plotArea: {
                        dataPointStyle: {
                            "rules":
                                [
                                    {
                                        "dataContext": {"Date": {max : 1462032000000}, "Actual 1": '*'},
                                        "properties": {
                                            "color":"sapUiChartPaletteQualitativeHue1"
                                        },
                                        "displayName":"Actual 1",
                                        "dataName" : {
                                            "Actual 1" : "Actual 1"
                                        }
                                    },
                                    {
                                        "dataContext": {"Date": {min : 1469980800000}, "Actual 1": '*'},
                                        "properties": {
                                            "color":"sapUiChartPaletteQualitativeHue1",
                                            "pattern":"diagonalLightStripe"
                                        },
                                        "displayName":"Forecast 1",
                                        "dataName" : {
                                            "Actual 1" : "Forecast 1"
                                        }
                                    },
                                    {
                                        "dataContext": {"Date": {max : 1462032000000}, "Actual 2": '*'},
                                        "properties": {
                                            "color":"sapUiChartPaletteQualitativeHue2"
                                        },
                                        "displayName":"Actual 2",
                                        "dataName" : {
                                            "Actual 2" : "Actual 2"
                                        }
                                    },
                                    {
                                        "dataContext": {"Date": {min : 1469980800000}, "Actual 2": '*'},
                                        "properties": {
                                            "color":"sapUiChartPaletteQualitativeHue2",
                                            "pattern":"diagonalLightStripe"
                                        },
                                        "displayName":"Forecast 2",
                                        "dataName" : {
                                            "Actual 2" : "Forecast 2"
                                        }
                                    }
                                ]
                        }
                     }
                }],
                commonrules : {
                    plotArea: {
                        dataLabel: {
                            formatString:ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2,
                            visible: false
                        },
                        window: {
                            start: "firstDataPoint",
                            end: "lastDataPoint"
                        }
                     },
                    valueAxis: {
                        label: {
                            formatString: ChartFormatter.DefaultPattern.SHORTFLOAT
                        },
                        title: {
                            visible: false
                        }
                    },
                    title: {
                        visible: false
                    },
                    timeAxis:{
                        title: {
                            visible: false
                        },
                        levels: ['quarter', 'year'],
                        interval : {
                            unit : ''
                        }
                    }
                }
            });

            var bindValue = settingsModel;
            var oSimpleForm = oView.byId("SimpleFormDisplay");

            for (var i = 0; i < bindValue.value.length; i++) {
                var oPopOver = new Popover({});

                var oVizFrame = new VizFrame({
                    'width': '100%',
                    'height': '280px',
                    'uiConfig' : {
                    'applicationSet': 'fiori'
                    }
                });

                var dataModel = new JSONModel(dataPath + bindValue.json[i]);
                oVizFrame.setModel(dataModel);
                var oDataset = new FlattenedDataset(bindValue.dataset[i]);
                oVizFrame.setDataset(oDataset);
                oVizFrame.setVizType(bindValue.vizType[i]);
                oVizFrame.setVizProperties(bindValue.commonrules);
                oVizFrame.setVizProperties(bindValue.rules[i]);
                var  feedTimeAxis = new FeedItem({
                    'uid': "timeAxis",
                    'type': "Dimension",
                    'values': ["Date"]
                }),
                feedValueAxis = new FeedItem({
                    'uid': "valueAxis",
                    'type': "Measure",
                    'values': bindValue.value[i]
                });
                oVizFrame.addFeed(feedValueAxis);
                oVizFrame.addFeed(feedTimeAxis);

                oPopOver.connect(oVizFrame.getVizUid());
                oPopOver.setFormatString(ChartFormatter.DefaultPattern.STANDARDFLOAT);

                var oFormTitle = new Title({'text':''});
                oSimpleForm.addContent(oFormTitle);
                oSimpleForm.addContent(oVizFrame);
            }



        }
    };
});
