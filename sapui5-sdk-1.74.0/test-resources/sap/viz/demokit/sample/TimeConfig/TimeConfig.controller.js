sap.ui.define([
        'sap/ui/core/mvc/Controller',
        'sap/ui/core/Title',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/data/FlattenedDataset',
        'sap/viz/ui5/controls/common/feeds/FeedItem',
        'sap/viz/ui5/controls/Popover',
        'sap/viz/ui5/controls/VizFrame',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format'
    ], function(Controller, Title, JSONModel, FlattenedDataset, FeedItem, Popover, VizFrame, ChartFormatter, Format) {
    "use strict";

    var Controller = Controller.extend("sap.viz.sample.TimeConfig.TimeConfig", {

        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/date_cost",

        settingsModel : {
            values:[{
                text: "Levels: Quarter & Year",
                vizType : "timeseries_column",
                json : "/cost_quarter_year.json",
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
                        levels: ["year", "quarter"],
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
            }, {
                text: "Levels: Quarter",
                vizType : "timeseries_line",
                json : "/cost_quarterlevels.json",
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
                        levels: ["quarter"],
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
            }, {
                text: "Show First & Last Dates Only",
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
                        levels: ["year", "month"],
                        title: {
                            visible: false
                        },
                        label: {
                            showFirstLastDataOnly: true
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
            }, {
                text: "Ignore Missing Value",
                vizType : "timeseries_line",
                json : "/cost_year_month.json",
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
                        title: {
                            visible: false
                        },
                        levels: ["year", "month"]
                    },
                    plotArea: {
                        window: {
                            start: "firstDataPoint",
                            end: "lastDataPoint"
                        },
                        dataPoint: {
                            invalidity: "ignore"
                        }
                    },
                    valueAxis: {
                        title: {
                            visible: false
                        },
                        label: {
                            formatString: ChartFormatter.DefaultPattern.SHORTFLOAT
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
                text: "Break Missing Value",
                vizType : "timeseries_line",
                json : "/cost_year_month.json",
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
                        title: {
                            visible: false
                        },
                        levels: ["year", "month"]
                    },
                    plotArea: {
                        window: {
                            start: "firstDataPoint",
                            end: "lastDataPoint"
                        },
                        dataPoint: {
                            invalidity: "break"
                        }
                    },
                    valueAxis: {
                        title: {
                            visible: false
                        },
                        label: {
                            formatString: ChartFormatter.DefaultPattern.SHORTFLOAT
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
            Format.numericFormatter(ChartFormatter.getInstance());
            var oView = this.getView();
            var oModel = new JSONModel(this.settingsModel);
            oView.setModel(oModel);

            var bindValue = this.settingsModel.values;

            var oSimpleForm = oView.byId("SimpleFormDisplay");

            var feedValueAxis, feedTimeAxis, oVizFrame, oDataset, dataModel, titleText, oPopOver;
            for (var i = 0; i < 5; i++) {
                titleText = new Title({'text':bindValue[i].text});
                oSimpleForm.addContent(titleText);
                //oVizFrame = null;
                oPopOver = new Popover({});
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
                oSimpleForm.addContent(oVizFrame);
                oPopOver.connect(oVizFrame.getVizUid());
                oPopOver.setFormatString(ChartFormatter.DefaultPattern.STANDARDFLOAT);
            }
        }
    });

    return Controller;

});
