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

    var Controller = Controller.extend("sap.viz.sample.ReferenceLine.ReferenceLine", {

        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data",
        settingsModel : {
            dataset : {
                name: "Examples",
                defaultSelected : 0,
                values : [{
                    name : "With Value Axis",
                    value : "/revenue_cost_consume/medium.json",
                    vizType : "bar",
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
                            dataLabel: {
                                visible: true,
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2
                            }
                        },
                        valueAxis: {
                            label: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT
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
                },{
                    name : "With Time Axis",
                    value : "/date_revenue_cost/column/large.json",
                    vizType : "timeseries_line",
                    dataset : {
                        dimensions: [{
                            name: 'Date',
                            value: "{Date}",
                            dataType: 'date'
                        }],
                        measures: [{
                            name: 'Revenue',
                            value: '{Revenue}'
                        }],
                        data: {
                            path: "/milk"
                        }
                    },
                    vizProperties : {
                        valueAxis: {
                            visible: true,
                            label: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT
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
                        plotArea: {
                            window: {
                                start: "8/1/2012",
                                end: "6/30/2013"
                            },
                            dataLabel: {
                                visible: false
                            }
                        },
                        title: {
                            visible: false
                        }
                    }
                }]
            },
            semanticColor: {
                name:"Semantic colors",
                defaultState: false,
                values: [{
                        color:["sapUiPositiveElement"]
                    },{
                        color:["sapUiNegativeElement", "sapUiCriticalElement", "sapUiPositiveElement"]
                }
                ]
            },
            lines:{
                name: "Ref.lines",
                defaultSelected : 0,
                values : [{
                    name : "One",
                    key : 0,
                    value : [{
                        plotArea: {
                            referenceLine: {
                                line: {
                                    valueAxis: [{
                                        value: 1100000,
                                        visible: true,
                                        label: {
                                            text: "Average Revenue",
                                            visible: true
                                        }
                                    }]
                                }
                            }
                        }
                    },{
                        plotArea: {
                            referenceLine: {
                                line: {
                                    valueAxis: [{
                                        value: 5000000,
                                        visible: true,
                                        label: {
                                            text: "Average Revenue",
                                            visible: true
                                        }
                                    }]
                                }
                            }
                        }
                    }]
                },{
                    name : "Multiple",
                    key : 1,
                    value : [{
                        plotArea: {
                            referenceLine: {
                                line: {
                                    valueAxis: [{
                                        value: 600000,
                                        visible: true,
                                        label: {
                                            text: "Low Performance",
                                            visible: true
                                        }
                                    },{
                                        value: 1396251,
                                        visible: true,
                                        label: {
                                            text: "Medium Performance",
                                            visible: true
                                        }
                                    },{
                                        value: 2400000,
                                        visible: true,
                                        label: {
                                            text: "High Performance",
                                            visible: true
                                        }
                                    }]
                                }
                            }
                        }
                    }, {
                        plotArea: {
                            referenceLine: {
                                line: {
                                    valueAxis: [{
                                        value: 1600000,
                                        visible: true,
                                        label: {
                                            text: "Low Performance",
                                            visible: true
                                        }
                                    },{
                                        value: 10100000,
                                        visible: true,
                                        label: {
                                            text: "Medium Performance",
                                            visible: true
                                        }
                                    },{
                                        value: 12800000,
                                        visible: true,
                                        label: {
                                            text: "High Performance",
                                            visible: true
                                        }
                                    }]
                                }
                            }
                        }
                    }]
                }]
            }
        },

        oVizFrame : null, datasetRadioGroup: null, linesRadioGroup: null,
        semanticColorSwitch: null,

        onInit : function (evt) {
            Format.numericFormatter(ChartFormatter.getInstance());
            // set explored app's demo model on this sample
            var oModel = new JSONModel(this.settingsModel);
            var oView = this.getView();
            oView.setModel(oModel);

            var oVizFrame = this.oVizFrame = oView.byId("idVizFrame");
            oVizFrame.setVizProperties(this.settingsModel.dataset.values[0].vizProperties);
            var dataModel = new JSONModel(this.dataPath + "/revenue_cost_consume/medium.json");
            oVizFrame.setModel(dataModel);
            oVizFrame.setVizProperties(this.settingsModel.lines.values[0].value[0]);

            var oPopOver = oView.byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(ChartFormatter.DefaultPattern.STANDARDFLOAT);

            InitPageUtil.initPageSettings(oView);
        },
        onAfterRendering : function(){
            var oView = this.getView();
            this.datasetRadioGroup = oView.byId('datasetRadioGroup');
            this.datasetRadioGroup.setSelectedIndex(this.settingsModel.dataset.defaultSelected);
            this.linesRadioGroup = oView.byId('linesRadioGroup');
            this.linesRadioGroup.setSelectedIndex(this.settingsModel.dataset.defaultSelected);
            this.semanticColorSwitch = oView.byId('semanticColorSwitch');
            this.semanticColorSwitch.setState(this.settingsModel.semanticColor.defaultState);
        },
        onDatasetSelected : function(oEvent){
            var datasetRadio = oEvent.getSource();
            if (this.oVizFrame && datasetRadio.getSelected()){
                this.oVizFrame.destroyDataset();
                this.oVizFrame.destroyFeeds();
                var bindValue = datasetRadio.getBindingContext().getObject();
                this.oVizFrame.setVizType(bindValue.vizType);
                this.oVizFrame.setVizProperties(bindValue.vizProperties);
                this.oVizFrame.setDataset(new FlattenedDataset(bindValue.dataset));
                var dataModel = new JSONModel(this.dataPath + bindValue.value);
                this.oVizFrame.setModel(dataModel);
                var feedValueAxis = new FeedItem({
                    'uid': "valueAxis",
                    'type': "Measure",
                    'values': ["Revenue"]
                }),
                feedCategoryAxis = new FeedItem({
                    'uid': "categoryAxis",
                    'type': "Dimension",
                    'values': ["Store Name"]
                }),
                feedTimeAxis = new FeedItem({
                    'uid': "timeAxis",
                    'type': "Dimension",
                    'values': ["Date"]
                });
                this.oVizFrame.addFeed(feedValueAxis);
                var lines, index = this.linesRadioGroup.getSelectedIndex(),
                    state = this.semanticColorSwitch.getState(),
                    settingsModel = this.settingsModel;
                if (bindValue.vizType === "bar") {
                    this.oVizFrame.addFeed(feedCategoryAxis);
                    lines = this.getReferenceLines(settingsModel.lines.values[index].value[0], state, settingsModel.semanticColor.values[index].color);
                } else {
                    this.oVizFrame.addFeed(feedTimeAxis);
                    lines = this.getReferenceLines(settingsModel.lines.values[index].value[1], state, settingsModel.semanticColor.values[index].color);
                }
                this.oVizFrame.setVizProperties({
                    plotArea: {
                        referenceLine: {
                            line: lines
                        }
                    }
                });
            }
        },
        onLinesSelected : function(oEvent){
            var linesRadio = oEvent.getSource();
            if (this.oVizFrame && linesRadio.getSelected()){
                var bindValue = linesRadio.getBindingContext().getObject();
                var oVizProperties = bindValue.value[this.datasetRadioGroup.getSelectedIndex()];

                var lines = this.getReferenceLines(oVizProperties, this.semanticColorSwitch.getState(), this.settingsModel.semanticColor.values[bindValue.key].color);
                this.oVizFrame.setVizProperties({
                    plotArea: {
                        referenceLine: {
                            line: lines
                        }
                    }
                });
            }
        },
        getReferenceLines: function(oVizProperties, oSemanticColorState, oColors) {
            var lines = oVizProperties.plotArea.referenceLine.line.valueAxis;
            if (oSemanticColorState) {
                for (var i = 0; i < lines.length; i++) {
                    lines[i].color = oColors[i];
                    lines[i].label.background = oColors[i];
                }
            } else {
                for (var i = 0; i < lines.length; i++) {
                    lines[i].color = undefined;
                    lines[i].label.background = undefined;
                }
            }
            return {valueAxis: lines};
        },
        onSemanticColorChanged : function(oEvent){
            if (this.oVizFrame) {
                var oVizProperties = this.oVizFrame.getVizProperties();
                var lines = this.getReferenceLines(oVizProperties, oEvent.getParameter('state'),
                    this.settingsModel.semanticColor.values[this.linesRadioGroup.getSelectedIndex()].color);
                this.oVizFrame.setVizProperties({
                    plotArea: {
                        referenceLine: {
                            line: lines
                        }
                    }
                });
            }
        }
    });

    return Controller;

});
