sap.ui.define([
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/BindingMode',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/controls/common/feeds/FeedItem',
        'sap/viz/ui5/data/FlattenedDataset',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
        './InitPage'
    ], function(Controller, BindingMode, JSONModel, FeedItem, FlattenedDataset, ChartFormatter,
        Format, InitPageUtil) {
    "use strict";

    var Controller = Controller.extend("sap.viz.sample.CombinedColumnLine.CombinedColumnLine", {

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
            series : {
                name : "Series",
                defaultSelected : 1,
                enabled : false,
                values : [{
                    name : "1 Series",
                    value : ["Revenue"]
                }, {
                    name : '2 Series',
                    value : ["Revenue", "Cost"]
                }]
            },
            dataLabel : {
                name : "Value Label",
                defaultState : false
            },
            axisTitle : {
                name : "Axis Title",
                defaultState : false
            },
            chartType : {
                name : "Chart Type",
                defaultSelected : 0,
                values : [{
                    name : "Column + Line",
                    vizType : "combination",
                    value : ["Revenue", "Cost"]
                }, {
                    name : 'Stacked Column + Line',
                    vizType : "stacked_combination",
                    value : ["Revenue", "Cost2", "Cost1"]
                }]
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
               name: 'Cost',
               value: '{Cost}'
            },{
               name: 'Cost1',
               value: '{Cost1}'
            },{
               name: 'Cost2',
               value: '{Cost2}'
            },{
               name: 'Revenue',
               value: '{Revenue}'
            }]
        },

        oVizFrame : null,
        datasetRadioGroup : null,

        onInit : function (evt) {
            Format.numericFormatter(ChartFormatter.getInstance());
            var formatPattern = ChartFormatter.DefaultPattern;            // set explored app's demo model on this sample
            var oModel = new JSONModel(this.settingsModel);
            oModel.setDefaultBindingMode(BindingMode.OneWay);
            this.getView().setModel(oModel);

            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            oVizFrame.setVizProperties({
                plotArea: {
                    dataLabel: {
                        formatString: formatPattern.SHORTFLOAT_MFD2,
                        visible: false
                    },
                    dataShape: {
                        primaryAxis: ["line", "bar", "bar"]
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
                categoryAxis: {
                    title: {
                        visible: false
                    }
                },
                title: {
                    visible: false
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
            this.datasetRadioGroup = this.getView().byId('datasetRadioGroup');
            this.datasetRadioGroup.setSelectedIndex(this.settingsModel.dataset.defaultSelected);

            var seriesRadioGroup = this.getView().byId('seriesRadioGroup');
            seriesRadioGroup.setSelectedIndex(this.settingsModel.series.defaultSelected);
            seriesRadioGroup.setEnabled(this.settingsModel.series.enabled);
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

                var feeds = this.oVizFrame.getFeeds();
                for (var i = 0; i < feeds.length; i++) {
                    if (feeds[i].getUid() === "categoryAxis") {
                        var categoryAxisFeed = feeds[i];
                        this.oVizFrame.removeFeed(categoryAxisFeed);
                        var feed = [];
                        for (var i = 0; i < dim.length; i++) {
                            feed.push(dim[i].name);
                        }
                        categoryAxisFeed.setValues(feed);
                        this.oVizFrame.addFeed(categoryAxisFeed);
                        break;
                    }
                }
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
        onChartTypeSelected : function(oEvent){
            if (!oEvent.getParameters().selected) {
                return;
            }
            var chartTypeRadio = oEvent.getSource();
            if (this.oVizFrame && chartTypeRadio.getSelected()){
                var bindValue = chartTypeRadio.getBindingContext().getObject();
                this.oVizFrame.setVizType(bindValue.vizType);
                var selectedDataset = this.settingsModel.dataset.values[this.datasetRadioGroup.getSelectedIndex()];
                var dataModel = new JSONModel(this.dataPath + selectedDataset.value);
                this.oVizFrame.setModel(dataModel);
                this.oVizFrame.removeAllFeeds();
                var dim = this.settingsModel.dimensions[selectedDataset.name];
                var feed = [];
                for (var i = 0; i < dim.length; i++) {
                    feed.push(dim[i].name);
                }
                var feedValueAxis = new FeedItem({
                    'uid': "valueAxis",
                    'type': "Measure",
                    'values': bindValue.value
                });
                var feedCategoryAxis = new FeedItem({
                    'uid': "categoryAxis",
                    'type': "Dimension",
                    'values': feed
                });
                this.oVizFrame.addFeed(feedValueAxis);
                this.oVizFrame.addFeed(feedCategoryAxis);
            }
        }
    });

    return Controller;

});