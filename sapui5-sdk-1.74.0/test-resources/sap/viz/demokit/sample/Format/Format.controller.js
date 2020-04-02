sap.ui.define([
        'sap/ui/core/mvc/Controller',
        'sap/ui/core/Title',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/data/FlattenedDataset',
        'sap/viz/ui5/controls/common/feeds/FeedItem',
        'sap/viz/ui5/controls/Popover',
        'sap/viz/ui5/controls/VizTooltip',
        'sap/viz/ui5/controls/VizFrame',
        'sap/viz/ui5/format/ChartFormatter',
        './CustomerFormat'
    ], function(Controller, Title, JSONModel, FlattenedDataset, FeedItem, Popover, VizTooltip, VizFrame,
        ChartFormatter, CustomerFormat) {
    "use strict";

    var Controller = Controller.extend("sap.viz.sample.Format.Format", {

        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/date_cost",

        settingsModel : {
            values : [{
                text: "Pre-defined Format: STANDARDPERCENT",
                vizType : "heatmap",
                json : "/cost_storeName.json",
                dataset : {
                    "dimensions": [{
                        "name": "Month",
                        "value": "{Month}"
                    },{
                        "name": "Store Name",
                        "value": "{Store Name}"
                    }],
                    "measures": [{
                        "name": "cost",
                        "value": "{cost}"
                    }],
                    data: {
                        path: "/milk"
                    }
                },
                vizProperties : {
                    categoryAxis: {
                        title: {
                            visible: false
                        }
                    },
                    categoryAxis2: {
                        title: {
                            visible: false
                        }
                    },
                    legend: {
                        formatString: ChartFormatter.DefaultPattern.STANDARDPERCENT
                    },
                    title: {
                        visible: false
                    }
                }
            },{
                text: "Register Format: Percentage with 1 Digit",
                vizType : "line",
                json : "/cost_quarter.json",
                dataset : {
                    "dimensions": [{
                        "name": "Date",
                        "value": "{Date}"
                    }],
                    "measures": [{
                        "name": "cost",
                        "value": "{cost}"
                    }],
                    data: {
                        path: "/milk"
                    }
                },
                vizProperties : {
                    plotArea: {
                        dataLabel: {
                            formatString:CustomerFormat.FIORI_LABEL_PERCENTAGEFORMAT_1,
                            visible: false
                        },
                        window: {
                            start: "firstDataPoint",
                            end: "lastDataPoint"
                        },
                        primaryScale: {
                            "minValue": 0.8,
                            "maxValue": 1,
                            "fixedRange": true
                        }
                    },
                    categoryAxis: {
                        title: {
                            visible: false
                        }
                    },
                    valueAxis: {
                        label: {
                            formatString: CustomerFormat.FIORI_LABEL_PERCENTAGEFORMAT_1
                        },
                        title: {
                            visible: false
                        }
                    },
                    title: {
                        visible: false
                    },
                    legend: {
                        visible: false
                    }
                }
            },{
                text: "Register Format: MMdd",
                vizType : "timeseries_line",
                json : "/cost_day.json",
                dataset : {
                    "dimensions": [{
                        "name": "Date",
                        "value": "{Date}",
                        "dataType":'date'
                    }],
                    "measures": [{
                        "name": "cost",
                        "value": "{cost}"
                    }],
                    data: {
                        path: "/milk"
                    }
                },
                vizProperties : {
                    timeAxis: {
                        levels: ["day"],
                        levelConfig: {
                            day: {
                                formatString: CustomerFormat.FIORI_LEVEL_DAY
                            }
                        },
                        title: {
                            visible: false
                        }
                    },
                    plotArea: {
                        window: {
                            start: "firstDataPoint",
                            end: "lastDataPoint"
                        }
                    },
                    valueAxis: {
                        title: {
                            visible: false
                        }
                    },
                    title: {
                        visible: false
                    },
                    legend: {
                        visible: false
                    }
                }
            },{
                text: "Register Format: MMMMM",
                vizType : "timeseries_column",
                json : "/cost_month.json",
                dataset : {
                    "dimensions": [{
                        "name": "Date",
                        "value": "{Date}",
                        "dataType":'date'
                    }],
                    "measures": [{
                        "name": "cost",
                        "value": "{cost}"
                    }],
                    data: {
                        path: "/milk"
                    }
                },
                vizProperties : {
                    timeAxis: {
                        levels: ["month"],
                        levelConfig: {
                            month: {
                                formatString: CustomerFormat.FIORI_LEVEL_MONTH
                            }
                        },
                        title: {
                            visible: false
                        }
                    },
                    plotArea: {
                        window: {
                            start: "firstDataPoint",
                            end: "lastDataPoint"
                        }
                    },
                    valueAxis: {
                        title: {
                            visible: false
                        }
                    },
                    title: {
                        visible: false
                    },
                    legend: {
                        visible: false
                    }
                }
            }]
        },

        onInit : function (evt) {
            this.initCustomFormat();

            var oView = this.getView();

            var oModel = new JSONModel(this.settingsModel);
            oView.setModel(oModel);

            var bindValue = this.settingsModel.values;

            var oNumberSimpleForm = oView.byId("SimpleFormChange480_12120Dual_Number");
            oNumberSimpleForm.setTitle(new Title({'text':"Number"}));
            oNumberSimpleForm.addStyleClass("settingsFormGrid");

            var oDateSimpleForm = oView.byId("SimpleFormChange480_12120Dual_Date");
            oDateSimpleForm.setTitle(new Title({'text':"Date & Time"}));
            oDateSimpleForm.addStyleClass("settingsFormGrid");

            var feedValueAxis, feedTimeAxis, feedCategoryAxis, feedCategoryAxis2, feedColor, oVizFrame, oDataset, dataModel,
                titleText, oTooltip;
            for (var i = 0; i < 4; i++) {
                titleText = new Title({'text':bindValue[i].text});
                //oVizFrame = null;
                oTooltip = new VizTooltip({});
                oVizFrame = new VizFrame({
                    'width': '100%',
                    'height': '280px',
                    'uiConfig' : {
                    'applicationSet': 'fiori'
                    }
                });
                dataModel = new JSONModel(this.dataPath + bindValue[i].json);
                oVizFrame.setModel(dataModel);
                oDataset = new FlattenedDataset(bindValue[i].dataset);
                oVizFrame.setDataset(oDataset);
                oVizFrame.setVizType(bindValue[i].vizType);
                oVizFrame.setVizProperties(bindValue[i].vizProperties);

                if (i === 0) {
                    oNumberSimpleForm.addContent(titleText);
                    feedCategoryAxis = new FeedItem({
                        'uid': "categoryAxis",
                        'type': "Dimension",
                        'values': ["Month"]
                    });
                    feedCategoryAxis2 = new FeedItem({
                        'uid': "categoryAxis2",
                        'type': "Dimension",
                        'values': ["Store Name"]
                    });
                    feedColor = new FeedItem({
                        'uid': "color",
                        'type': "Measure",
                        'values': ["cost"]
                    });
                    oVizFrame.addFeed(feedCategoryAxis);
                    oVizFrame.addFeed(feedCategoryAxis2);
                    oVizFrame.addFeed(feedColor);
                    oVizFrame.setVizScales([{
                        "feed": "color",
                        "type": "color",
                        "palette": ["sapUiChartPaletteSequentialHue1Light2",  "sapUiChartPaletteSequentialHue1", "sapUiChartPaletteSequentialHue1Dark2"],
                        "nullColor": "sapUiChoroplethRegionBG",
                        "numOfSegments": 3
                    }]);
                    oNumberSimpleForm.addContent(oVizFrame);
                    oTooltip.setFormatString(ChartFormatter.DefaultPattern.STANDARDPERCENT);
                } else if (i === 1) {
                    oNumberSimpleForm.addContent(titleText);
                    feedCategoryAxis = new FeedItem({
                        'uid': "categoryAxis",
                        'type': "Dimension",
                        'values': ["Date"]
                    });
                    feedValueAxis = new FeedItem({
                        'uid': "valueAxis",
                        'type': "Measure",
                        'values': ["cost"]
                    });
                    oVizFrame.addFeed(feedCategoryAxis);
                    oVizFrame.addFeed(feedValueAxis);
                    oNumberSimpleForm.addContent(oVizFrame);
                    oTooltip.setFormatString(ChartFormatter.DefaultPattern.STANDARDPERCENT);
                } else {
                    oDateSimpleForm.addContent(titleText);
                    feedTimeAxis = new FeedItem({
                        'uid': "timeAxis",
                        'type': "Dimension",
                        'values': ["Date"]
                    });
                    feedValueAxis = new FeedItem({
                        'uid': "valueAxis",
                        'type': "Measure",
                        'values': ["cost"]
                    });
                    oVizFrame.addFeed(feedTimeAxis);
                    oVizFrame.addFeed(feedValueAxis);
                    oDateSimpleForm.addContent(oVizFrame);
                    oTooltip.setFormatString(ChartFormatter.DefaultPattern.STANDARDFLOAT);
                }
                oTooltip.connect(oVizFrame.getVizUid());
            }
        },
        initCustomFormat : function(){
            CustomerFormat.registerCustomFormat();
        }
    });

    return Controller;

});