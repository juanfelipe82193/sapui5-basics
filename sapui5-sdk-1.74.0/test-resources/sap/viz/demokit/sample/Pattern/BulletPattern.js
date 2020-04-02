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
        BulletSettings : function(oView) {

            var dataPath = "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/date_revenue_actual_forcast_target";

            var settingsModel = ({
                key: "3",
                name : "Bullet Horizontal & Vertical",
                value : [["Forecast", "Target"],["Actual", "Target"],["Forecast", "Target"],["Commitment","Actual","Target"]],
                vizType : ["timeseries_bullet","timeseries_bullet","bullet","bullet"],
                json : ["/bullet/vertical_forecast_target.json",
                    "/bullet/vertical_semantic.json",
                    "/bullet/forecast_target.json",
                    "/bullet/actual_commitment_target.json"],
                dataset : [{
                    dimensions: [{
                        name: 'Date',
                        value: '{Date}',
                        dataType:'date'
                    }],
                    measures: [{
                        name: 'Forecast',
                        value: '{Forecast}'
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
                       value: '{Date}',
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
                       name: 'Product',
                       value: "{Product}"
                    }],
                    measures: [{
                       name: 'Forecast',
                       value: '{Forecast}'
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
                       name: 'Actual',
                       value: '{Actual}'
                    },{
                       name: 'Commitment',
                       value: '{Commitment}'
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
                                        "dataContext": {"Date": {"in":[1469980700000, 1477929700000]},"Actual": '*'},
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
                },{
                    plotArea: {
                        dataPointStyle: {
                            "rules":
                                [
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
                        dataPointStyle: {
                            "rules":
                                [
                                    {
                                        "dataContext": {"Commitment": '*'},
                                        "properties": {
                                            "color":{"additionalColor":"sapUiChartPaletteQualitativeHue2"},
                                            "pattern":{"additionalColor":"diagonalLightStripe"}
                                        },
                                        "displayName":{"additionalColor":"Commitment"},
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

            for (var i = 0; i < 4; i++) {
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

                switch (i){
                    case 0:
                    case 1:
                        var  feedTimeAxis = new FeedItem({
                            'uid': "timeAxis",
                            'type': "Dimension",
                            'values': ["Date"]
                        }),
                        feedActualValues = new FeedItem({
                            'uid': "actualValues",
                            'type': "Measure",
                            'values': [bindValue.value[i][0]]
                        }),
                        feedTargetValues = new FeedItem({
                            'uid': "targetValues",
                            'type': "Measure",
                            'values': [bindValue.value[i][1]]
                        });
                        oVizFrame.addFeed(feedTimeAxis);
                        oVizFrame.addFeed(feedTargetValues);
                        oVizFrame.addFeed(feedActualValues);
                        break;
                    case 2:
                        var  feedCategoryAxis = new FeedItem({
                            'uid': "categoryAxis",
                            'type': "Dimension",
                            'values': ["Product"]
                        }),
                        feedActualValues = new FeedItem({
                            'uid': "actualValues",
                            'type': "Measure",
                            'values': [bindValue.value[i][0]]
                        }),
                        feedTargetValues = new FeedItem({
                            'uid': "targetValues",
                            'type': "Measure",
                            'values': [bindValue.value[i][1]]
                        });
                        oVizFrame.addFeed(feedCategoryAxis);
                        oVizFrame.addFeed(feedTargetValues);
                        oVizFrame.addFeed(feedActualValues);
                        break;
                    case 3:
                        var  feedCategoryAxis = new FeedItem({
                            'uid': "categoryAxis",
                            'type': "Dimension",
                            'values': ["Product"]
                        }),
                        feedActualValues = new FeedItem({
                            'uid': "actualValues",
                            'type': "Measure",
                            'values': [bindValue.value[i][1]]
                        }),
                        feedAdditionalValues = new FeedItem({
                            'uid': "additionalValues",
                            'type': "Measure",
                            'values': [bindValue.value[i][0]]
                        }),
                        feedTargetValues = new FeedItem({
                            'uid': "targetValues",
                            'type': "Measure",
                            'values': [bindValue.value[i][2]]
                        });
                        oVizFrame.addFeed(feedCategoryAxis);
                        oVizFrame.addFeed(feedTargetValues);
                        oVizFrame.addFeed(feedActualValues);
                        oVizFrame.addFeed(feedAdditionalValues);
                        break;

                }

                oPopOver.connect(oVizFrame.getVizUid());
                oPopOver.setFormatString(ChartFormatter.DefaultPattern.STANDARDFLOAT);

                var oFormTitle = new Title({'text':''});
                oSimpleForm.addContent(oFormTitle);
                oSimpleForm.addContent(oVizFrame);
            }
        }
    };
});