sap.ui.define([
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/BindingMode',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/data/FlattenedDataset',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
        './InitPage'
    ], function(Controller, BindingMode, JSONModel, FlattenedDataset, ChartFormatter, Format, InitPageUtil) {
    "use strict";

    function resetVizFrameFeedings(newFeeds, feedsUid){
        var feeds = this.oVizFrame.getFeeds();
        for (var i = 0; i < feeds.length; i++) {
            if (feeds[i].getUid() === feedsUid) {
                var axisFeed = feeds[i];
                this.oVizFrame.removeFeed(axisFeed);
                axisFeed.setValues(newFeeds);
                this.oVizFrame.addFeed(axisFeed);
                break;
            }
        }
    }
    var Controller = Controller.extend("sap.viz.sample.StackedColumn.StackedColumn", {

        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue_cost_consume",

        settingsModel : {
            dataset : {
                name: "Dataset",
                defaultSelected : 1,
                values : [{
                    name : "Small",
                    value : "/betterSmall.json"
                },{
                    name : "Medium",
                    value : "/betterMedium.json"
                },{
                    name : "Large",
                    value : "/betterLarge.json"
                }]
            },
            dataLabel : {
                name : "Value Label",
                defaultState : true
            },
            sumLabel: {
                name: "Sum Value Label",
                defaultState : false
            },
            axisTitle : {
                name : "Axis Title",
                defaultState : false
            },
            type : {
                name : "Stacked Type",
                defaultSelected : 0,
                values : [{
                    name : "Regular",
                    vizType : "stacked_column",
                    vizProperties : {
                        plotArea: {
                            dataLabel: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2
                            }
                        }
                    }
                },{
                    name : "100%",
                    vizType : "100_stacked_column",
                    vizProperties : {
                        plotArea: {
                            mode: "percentage",
                            dataLabel: {
                                type: "percentage",
                                formatString:ChartFormatter.DefaultPattern.STANDARDPERCENT_MFD2
                            }
                        }
                    }
                }]
            },
            additionalColumn: {
                name: "Additional Column",
                defaultState: false
            },
            dimensions: {
                Small: [{
                    name: 'Seasons',
                    value: "{Seasons}"
                }],
                Medium: [{
                    name: 'Week',
                    value: "{Week}"
                }],
                Large: [{
                    name: 'Week',
                    value: "{Week}"
                }]
            },
            measures: [{
               name: 'Cost1',
               value: '{Cost1}'
            },{
               name: 'Cost2',
               value: '{Cost2}'
            }, {
                name: 'Cost3',
                value: '{Cost3}'
             }]
        },

        oVizFrame : null,

        onInit : function (evt) {
            Format.numericFormatter(ChartFormatter.getInstance());
            var formatPattern = ChartFormatter.DefaultPattern;
            // set explored app's demo model on this sample
            var oModel = new JSONModel(this.settingsModel);
            oModel.setDefaultBindingMode(BindingMode.OneWay);
            this.getView().setModel(oModel);

            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            oVizFrame.setVizProperties({
                plotArea: {
                    dataLabel: {
                        formatString:formatPattern.SHORTFLOAT_MFD2,
                        visible: true,
                        showTotal: false
                    }
                },
                valueAxis: {
                    label: {
                        formatString: formatPattern.SHORTFLOAT
                    },
                    title: {
                        visible: false
                    }
                },
                valueAxis2: {
                    label: {
                        formatString: formatPattern.SHORTFLOAT
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
            });
            var dataModel = new JSONModel(this.dataPath + "/betterMedium.json");
            oVizFrame.setModel(dataModel);

            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(formatPattern.STANDARDFLOAT);

            InitPageUtil.initPageSettings(this.getView());
        },
        onAfterRendering : function(){
            var datasetRadioGroup = this.getView().byId('datasetRadioGroup');
            datasetRadioGroup.setSelectedIndex(this.settingsModel.dataset.defaultSelected);

            var typeRadioGroup = this.getView().byId('typeRadioGroup');
            typeRadioGroup.setSelectedIndex(this.settingsModel.type.defaultSelected);
        },
        onDatasetSelected : function(oEvent){
            if (!oEvent.getParameters().selected) {
                return;
            }
            var datasetRadio = oEvent.getSource();
            if (this.oVizFrame && datasetRadio.getSelected()){
                var bindValue = datasetRadio.getBindingContext().getObject();
                var dataset = {
                    data: {
                        path: "/milk"
                    }
                };
                var dim = this.settingsModel.dimensions[bindValue.name];
                dataset.dimensions = dim;
                dataset.measures = this.settingsModel.measures;
                var oDataset = new FlattenedDataset(dataset);
                this.oVizFrame.setDataset(oDataset);
                var dataModel = new JSONModel(this.dataPath + bindValue.value);
                this.oVizFrame.setModel(dataModel);

                var feed = [];
                for (var i = 0; i < dim.length; i++) {
                    feed.push(dim[i].name);
                }
                resetVizFrameFeedings.call(this, feed, "categoryAxis");
            }
        },
        onDataLabelChanged : function(oEvent){
            if (this.oVizFrame){
                this.oVizFrame.setVizProperties({
                    plotArea: {
                        dataLabel: {
                            visible: oEvent.getParameter('state')
                        }
                    }
                });
            }
        },
        onAxisTitleChanged : function(oEvent){
            if (this.oVizFrame){
                var state = oEvent.getParameter('state');
                this.oVizFrame.setVizProperties({
                    valueAxis: {
                        title: {
                            visible: state
                        }
                    },
                    categoryAxis: {
                        title: {
                            visible: state
                        }
                    }
                });
            }
        },
        onAdditionalColumn: function(oEvent){
            if (this.oVizFrame) {
                this._additionalColumnSwitch = oEvent.getParameter('state');
                if (this._additionalColumnSwitch) {
                    this.oVizFrame.setVizProperties({
                        plotArea: {
                            series: [
                                { dataContext: {"measureNames": "Cost1"}, "stack": "a"},
                                { dataContext: {"measureNames": "Cost2"}, "stack": "a"},
                                { dataContext: {"measureNames": "Cost3"}, "stack": "b"}
                            ]
                        }
                    });
                    resetVizFrameFeedings.call(this, ["Cost1", "Cost2", "Cost3"], "valueAxis");
                } else {
                    resetVizFrameFeedings.call(this, ["Cost1", "Cost2"], "valueAxis");
                }
            }
        },
        onTypeSelected : function(oEvent){
            if (!oEvent.getParameters().selected) {
                return;
            }
            var sumLabelSwitch = this.getView().byId("sumLabelSwitch");
            var additionalColumnSwitch = this.getView().byId("additionalColumnSwitch");
            var typeRadio = oEvent.getSource();
            if (this.oVizFrame && typeRadio.getSelected()){
                var bindValue = typeRadio.getBindingContext().getObject();
                this.oVizFrame.setVizType(bindValue.vizType);
                this.oVizFrame.setVizProperties(bindValue.vizProperties);
                if (bindValue.vizType === "100_stacked_column") {
                    sumLabelSwitch.setState(false);
                    sumLabelSwitch.setEnabled(false);
                    if (this._additionalColumnSwitch){
                        var measures = ["Cost1", "Cost2"];
                        resetVizFrameFeedings.call(this, measures, "valueAxis");
                    }
                    additionalColumnSwitch.setState(false);
                    additionalColumnSwitch.setEnabled(false);
                } else {
                    sumLabelSwitch.setEnabled(true);
                    sumLabelSwitch.setState(this._sumLabelSwitch);
                    if (this._additionalColumnSwitch){
                        resetVizFrameFeedings.call(this, ["Cost1", "Cost2", "Cost3"], "valueAxis");
                    }
                    additionalColumnSwitch.setEnabled(true);
                    additionalColumnSwitch.setState(this._additionalColumnSwitch);
                }
            }
        },
        onSumLabelChanged : function(oEvent){
            if (this.oVizFrame){
                this._sumLabelSwitch = oEvent.getParameter('state');
                this.oVizFrame.setVizProperties({
                    plotArea: {
                        dataLabel: {
                            showTotal: this._sumLabelSwitch
                        }
                    }
                });
            }
        }
    });

    return Controller;

});