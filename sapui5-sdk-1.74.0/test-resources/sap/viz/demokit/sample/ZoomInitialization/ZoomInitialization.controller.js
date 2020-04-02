sap.ui.define([
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/data/FlattenedDataset',
        'sap/viz/ui5/controls/common/feeds/FeedItem',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
        './InitPage'
    ], function(Controller, JSONModel, FlattenedDataset, FeedItem, ChartFormatter, Format, InitPageUtil) {
    "use strict";

    var Controller = Controller.extend("sap.viz.sample.ZoomInitialization.ZoomInitialization", {

        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data",

        settingsModel : {
            dataset : {
                name: "Zoom Initialization",
                defaultSelected : 0,
                values : [{
                    name : "Overview",
                    vizProperties : [{
                        plotArea: {
                            window: {
                                start: "firstDataPoint",
                                end: "lastDataPoint"
                            }
                        }
                    },{
                        plotArea: {
                            window: {
                                start: {
                                    valueAxis: null,
                                    valueAxis2: null
                                },
                                end: {
                                    valueAxis: null,
                                    valueAxis2: null
                                }
                            }
                        }
                    },{
                        plotArea: {
                            window: {
                                start: null,
                                end: null
                            }
                        },
                        timeAxis: {
                            interval: {
                                unit: "auto"
                            }
                        }
                    }]
                },{
                    name : "Initial Range",
                    vizProperties : [{
                        plotArea: {
                            window: {
                                start: {
                                    categoryAxis: {
                                        'Store Name': 'Greens'
                                    }
                                },
                                end: {
                                    categoryAxis: {
                                        'Store Name': 'Public Market'
                                    }
                                }
                            }
                        }
                    },{
                        plotArea: {
                            window: {
                                start: {
                                    valueAxis: 4000000,
                                    valueAxis2: 600000
                                },
                                end: {
                                    valueAxis: 6500000,
                                    valueAxis2: 1200000
                                }
                            }
                        }
                    },{
                        plotArea: {
                            window: {
                                start: 1354291200000,
                                end: 1358524800000
                            }
                        }
                    }]
                },{
                    name : "None (default)",
                    vizProperties : [{
                        plotArea: {
                            window: {
                                start: "firstDataPoint",
                                end: null
                            }
                        }
                    },{
                        plotArea: {
                            window: {
                                start: {
                                    valueAxis: 0,
                                    valueAxis2: 0
                                },
                                end: {
                                    valueAxis: 7000000,
                                    valueAxis2: 2000000
                                }
                            }
                        }
                    },{
                        plotArea: {
                            window: {
                                start: "firstDataPoint",
                                end: null
                            }
                        }
                    }]
                }]
            },
            series : {
                name : "Axis Type",
                defaultSelected : 0,
                enabled : false,
                values : [{
                    name : "Categorical Axis",
                    path : "/revenue_cost_consume/large.json",
                    vizType : "bar",
                    key : 0,
                    value : ["Revenue"],
                    dataset : {
                        dimensions: [{
                            name: "Store Name",
                            value: "{Store Name}"
                        }],
                        measures: [{
                            name: 'Revenue',
                            value: '{Revenue}'
                        }, {
                            name: 'Cost',
                            value: '{Cost}'
                        }],
                        data: {
                            path: "/milk"
                        }
                    },
                    vizProperties : {
                        plotArea: {
                            window: {
                                start: "firstDataPoint",
                                end: "lastDataPoint"
                            },
                            dataLabel: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2,
                                visible: true
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
                        categoryAxis: {
                            title: {
                                visible: false
                            }
                        },
                        title: {
                            visible: false,
                            text: 'Revenue by City and Store Name'
                        }
                    }
                }, {
                    name : 'Value Axis',
                    path : "/revenue_cost_consume_country/1_percent/large.json",
                    vizType : "bubble",
                    key : 1,
                    value : ["Revenue"],
                    dataset : {
                        measures: [{
                            name: 'Store Name',
                            value: '{Store Name}'
                        }, {
                            name: 'Revenue',
                            value: '{Revenue}'
                        }, {
                            name: 'Cost',
                            value: '{Cost}'
                        }, {
                            name: 'Consumption',
                            value: '{Consumption}'
                        }],
                        data: {
                            path: "/milk"
                        }
                    },
                    vizProperties : {
                        plotArea: {
                            window: {
                                start: "firstDataPoint",
                                end: "lastDataPoint"
                            },
                            dataLabel: {
                                formatString: ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2,
                                visible: true,
                                hideWhenOverlap: true
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
                        valueAxis2: {
                            label: {
                                formatString: ChartFormatter.DefaultPattern.SHORTFLOAT
                            },
                            title: {
                                visible: false
                            }
                        },
                        sizeLegend: {
                            formatString: ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2,
                            title: {
                                visible: true
                            }
                        },
                        title: {
                            visible: false
                        }
                    }
                }, {
                    name : 'Time Axis',
                    path : "/date_revenue_cost/column/large.json",
                    vizType : "timeseries_line",
                    key : 2,
                    value : ["Cost"],
                    dataset : {
                        dimensions: [{
                            name: 'Date',
                            value: "{Date}",
                            dataType: 'date'
                        }],
                        measures: [{
                            name: 'Cost',
                            value: '{Cost}'
                        }],
                        data: {
                            path: "/milk"
                        }
                    },
                    vizProperties : {
                        plotArea: {
                            dataLabel: {
                                visible: false
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
                        timeAxis: {
                            title: {
                                visible: false
                            }
                        },
                        title: {
                            visible: false
                        }
                    }
                }]
            }
        },

        oVizFrame : null, datasetRadioGroup : null, seriesRadioGroup : null,

        onInit : function (evt) {
            Format.numericFormatter(ChartFormatter.getInstance());
            var formatPattern = ChartFormatter.DefaultPattern;
            // set explored app's demo model on this sample
            var oModel = new JSONModel(this.settingsModel);
            this.getView().setModel(oModel);

            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            var props = this.settingsModel.series.values[0].vizProperties;
            props.plotArea.window = { start: null, end: null};
            oVizFrame.setVizProperties(props);
            var dataModel = new JSONModel(this.dataPath + "/revenue_cost_consume/large.json");
            oVizFrame.setModel(dataModel);

            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString({
                "Date":"YearMonthDay",
                "Cost":formatPattern.STANDARDFLOAT,
                "Revenue":formatPattern.STANDARDFLOAT
            });

            InitPageUtil.initPageSettings(this.getView());
        },
        onAfterRendering : function(){
            this.datasetRadioGroup = this.getView().byId('datasetRadioGroup');
            this.datasetRadioGroup.setSelectedIndex(this.settingsModel.dataset.defaultSelected);

            this.seriesRadioGroup = this.getView().byId('seriesRadioGroup');
            this.seriesRadioGroup.setSelectedIndex(this.settingsModel.series.defaultSelected);
        },
        onDatasetSelected : function(oEvent){
            if (!oEvent.getParameters().selected) {
                return;
            }
            var datasetRadio = oEvent.getSource();
            if (this.oVizFrame && datasetRadio.getSelected()){
                var bindValue = datasetRadio.getBindingContext().getObject();
                var vizProperties = bindValue.vizProperties[this.seriesRadioGroup.getSelectedIndex()];
                this.oVizFrame.setVizProperties(vizProperties);
            }
        },
        onSeriesSelected : function(oEvent){
            var seriesRadio = oEvent.getSource();
            if (this.oVizFrame && seriesRadio.getSelected()){
                var bindValue = seriesRadio.getBindingContext().getObject();
                this.oVizFrame.destroyDataset();
                this.oVizFrame.destroyFeeds();
                this.oVizFrame.setVizType(bindValue.vizType);
                var oModel = new JSONModel(this.dataPath + bindValue.path);
                var oDataset = new FlattenedDataset(bindValue.dataset);
                this.oVizFrame.setDataset(oDataset);
                this.oVizFrame.setModel(oModel);
                var feedValueAxis = new FeedItem({
                    'uid': "valueAxis",
                    'type': "Measure",
                    'values': bindValue.value
                }),
                feedCategoryAxis = new FeedItem({
                    'uid': "categoryAxis",
                    'type': "Dimension",
                    'values': ["Store Name"]
                }),
                feedValueAxis2 = new FeedItem({
                    'uid': "valueAxis2",
                    'type': "Measure",
                    'values': ["Cost"]
                }),
                feedBubbleWidth = new FeedItem({
                    'uid': "bubbleWidth",
                    'type': "Measure",
                    'values': ["Consumption"]
                }),
                feedTimeAxis = new FeedItem({
                    'uid': "timeAxis",
                    'type': "Dimension",
                    'values': ["Date"]
                });
                switch (bindValue.vizType){
                    case "bar":
                        this.oVizFrame.addFeed(feedValueAxis);
                        this.oVizFrame.addFeed(feedCategoryAxis);
                        break;
                    case "bubble":
                        this.oVizFrame.addFeed(feedValueAxis);
                        this.oVizFrame.addFeed(feedValueAxis2);
                        this.oVizFrame.addFeed(feedBubbleWidth);
                        break;
                    case "timeseries_line":
                        this.oVizFrame.addFeed(feedValueAxis);
                        this.oVizFrame.addFeed(feedTimeAxis);
                        break;
                }
                this.oVizFrame.setVizProperties(bindValue.vizProperties);
                var vizProperties = this.settingsModel.dataset.values[this.datasetRadioGroup.getSelectedIndex()].vizProperties[bindValue.key];
                this.oVizFrame.setVizProperties(vizProperties);
            }
        }
    });

    return Controller;

});