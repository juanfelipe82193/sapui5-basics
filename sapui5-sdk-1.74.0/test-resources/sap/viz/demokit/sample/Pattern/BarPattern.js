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
        BarSettings : function(oView) {

            var dataPath = "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/date_revenue_actual_forcast_target";

            var settingsModel = ({
                key: "1",
                name : "Bar & Stacked Bar",
                value : [["Actual", "Forecast"],["Actual", "Target"],["Commitment","Actual 2","Actual 1"]],
                vizType : ["bar","bar","stacked_bar"],
                json : ["/stackedbar/actual_forecast.json",
                    "/stackedbar/actual_target.json",
                    "/stackedbar/actual_actual2_commitment.json"],
                dataset : [{
                    dimensions: [{
                        name: 'Product',
                        value: "{Product}"
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
                       name: 'Product',
                       value: "{Product}"
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
                       name: 'Product',
                       value: "{Product}"
                    }],
                    measures: [{
                       name: 'Actual 1',
                       value: '{Actual 1}'
                    },{
                       name: 'Actual 2',
                       value: '{Actual 2}'
                    },{
                       name: 'Commitment',
                       value: '{Commitment}'
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
                                            "Actual" : "Actual "
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
                                            "Forecast" : "Forecast "
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
                                        "dataContext": {"Actual 1": '*'},
                                        "properties": {
                                            "color":"sapUiChartPaletteQualitativeHue1"
                                        },
                                        "displayName":"Actual 1",
                                        "dataName" : {
                                            "Actual 1" : "Actual 1"
                                        }
                                    },
                                    {
                                        "dataContext": {"Actual 2": '*'},
                                        "properties": {
                                            "color":"sapUiChartPaletteQualitativeHue2"
                                        },
                                        "displayName":"Actual 2",
                                        "dataName" : {
                                            "Actual 2" : "Actual 2"
                                        }
                                    },
                                    {
                                        "dataContext": {"Commitment": '*'},
                                        "properties": {
                                            "color":"sapUiChartPaletteQualitativeHue3",
                                            "pattern":"diagonalLightStripe"
                                        },
                                        "displayName":"Commitment",
                                        "dataName" : {
                                            "Commitment" : "Commitment"
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
                    categoryAxis:{
                        title: {
                            visible: false
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
                var  feedCategoryAxis = new FeedItem({
                    'uid': "categoryAxis",
                    'type': "Dimension",
                    'values': ["Product"]
                }),
                feedValueAxis = new FeedItem({
                    'uid': "valueAxis",
                    'type': "Measure",
                    'values': bindValue.value[i]
                });
                oVizFrame.addFeed(feedValueAxis);
                oVizFrame.addFeed(feedCategoryAxis);

                oPopOver.connect(oVizFrame.getVizUid());
                oPopOver.setFormatString(ChartFormatter.DefaultPattern.STANDARDFLOAT);

                var oFormTitle = new Title({'text':''});
                oSimpleForm.addContent(oFormTitle);
                oSimpleForm.addContent(oVizFrame);
            }


        }
    };
});
