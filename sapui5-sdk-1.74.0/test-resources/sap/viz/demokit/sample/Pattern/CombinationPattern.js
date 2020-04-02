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
        CombinationSettings : function(oView) {

            var dataPath = "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/date_revenue_actual_forcast_target";

            var settingsModel = ({
                key: "4",
                name : "Combined Col & Line",
                value : [["Actual", "Forecast"],["Actual", "Target"],["Actual", "Target"]],
                vizType : "timeseries_combination",
                json : ["/timeaxis/actual_forecast.json",
                    "/timeaxis/actual_target.json",
                    "/timeaxis/semantic.json"],
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
                    },{
                       name: 'Target',
                       value: '{Target}'
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
                                            "lineColor":"sapUiChartPaletteQualitativeHue1",
                                            "lineType":"dash"
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
                                        "dataContext": {"Target": '*'},
                                        "properties": {
                                            "color":"sapUiChartZeroAxisColor",
                                            "lineColor":"sapUiChartZeroAxisColor" ,
                                            "lineType":"dot",
                                            "pattern":"noFill"
                                        },
                                        "displayName":"Target",
                                        "dataName" : {
                                            "Target" : "Target"
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
                                    },
                                    {
                                        "dataContext": {"Target": '*'},
                                        "properties": {
                                            "color":"sapUiChartZeroAxisColor",
                                            "lineColor":"sapUiChartZeroAxisColor",
                                            "lineType":"dot",
                                            "pattern":"noFill"
                                        },
                                        "displayName":"Target",
                                        "dataName" : {
                                            "Target" : "Target"
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
                         levels: ['quarter', 'year']
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
                oVizFrame.setVizType(bindValue.vizType);
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
