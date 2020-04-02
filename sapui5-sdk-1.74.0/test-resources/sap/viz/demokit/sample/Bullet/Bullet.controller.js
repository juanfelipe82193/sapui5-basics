sap.ui.define([
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/BindingMode',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
        './InitPage'
    ], function(Controller, BindingMode, JSONModel, ChartFormatter, Format, InitPageUtil) {
    "use strict";

    var Controller = Controller.extend("sap.viz.sample.Bullet.Bullet", {

        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue_additional_forecast_target",

        settingsModel : {
            dataset : {
                name: "Dataset",
                defaultSelected : 1,
                values : [{
                    name : "Small",
                    value : "/small.json"
                },{
                    name : "Medium",
                    value : "/medium.json"
                },{
                    name : "Large",
                    value : "/large.json"
                }]
            },
            series : {
                name : "Series",
                defaultSelected : 0,
                values : [{
                    name : "1 Series",
                    value : [["Revenue"],["Target"],["Additional Revenue"],["Forecast"]]
                }, {
                    name : '2 Series',
                    value : [["Revenue", "Revenue2"],["Target","Target2"],["Additional Revenue", "Additional Revenue2"],["Forecast", "Forecast2"]]
                }]
            },
            dataLabel : {
                name : "Value Label",
                defaultState : false,
                enabled: false
            },
            axisTitle : {
                name : "Axis Title",
                defaultState : false
            },
            valuesDisplayed : {
                name : "Values Displayed",
                defaultSelected : 0,
                values : [{
                    key : "0",
                    name : "Primary Only",
                    enabled : true,
                    vizProperties : {
                        plotArea: {
                            colorPalette: null,
                            gap: {
                                visible: false
                            }
                        }
                    }
                },{
                    key : "1",
                    name : "Primary + Additional",
                    enabled : true,
                    vizProperties : {
                        plotArea: {
                            colorPalette: null,
                            gap: {
                                visible: false
                            }
                        }
                    }
                }]
            }
        },

        oVizFrame : null,

        feedActualValues : null, feedCategoryAxis : null, feedTargetValues : null,
        feedAdditionalValues : null, feedForecastValues : null, seriesRadioGroup : null,

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
                        formatString: formatPattern.SHORTFLOAT_MFD2,
                        visible: true
                    },
                    gap: {
                        visible: false
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
                    visible: false,
                    text: 'Revenue by City and Store Name'
                }
            });
            var dataModel = new JSONModel(this.dataPath + "/medium.json");
            oVizFrame.setModel(dataModel);

            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(formatPattern.STANDARDFLOAT);

            InitPageUtil.initPageSettings(this.getView());
            var that = this;
            dataModel.attachRequestCompleted(function() {
                that.dataSort(this.getData());
            });
        },
        dataSort: function(dataset) {
            //let data sorted by revenue
            if (dataset && dataset.hasOwnProperty("milk")) {
                var arr = dataset.milk;
                arr = arr.sort(function (a, b) {
                    return b.Revenue - a.Revenue;
                });
            }
        },
        onAfterRendering : function(){
            var datasetRadioGroup = this.getView().byId('datasetRadioGroup');
            datasetRadioGroup.setSelectedIndex(this.settingsModel.dataset.defaultSelected);

            this.seriesRadioGroup = this.getView().byId('seriesRadioGroup');
            this.seriesRadioGroup.setSelectedIndex(this.settingsModel.series.defaultSelected);

            var valueLabelSwitch = this.getView().byId('valueLabelSwitch');
            valueLabelSwitch.setEnabled(this.settingsModel.dataLabel.enabled);

            this.feedActualValues = this.getView().byId('feedActualValues');
            this.feedCategoryAxis = this.getView().byId('feedCategoryAxis');
            this.feedTargetValues = this.getView().byId('feedTargetValues');
            this.feedAdditionalValues = this.getView().byId('feedAdditionalValues');
            this.feedForecastValues = this.getView().byId('feedForecastValues');
            this.oVizFrame.removeFeed(this.feedAdditionalValues);
            this.oVizFrame.removeFeed(this.feedForecastValues);
        },
        onDatasetSelected : function(oEvent){
            if (!oEvent.getParameters().selected) {
                return;
            }
            var datasetRadio = oEvent.getSource();
            if (this.oVizFrame && datasetRadio.getSelected()){
                var bindValue = datasetRadio.getBindingContext().getObject();
                var dataModel = new JSONModel(this.dataPath + bindValue.value);
                this.oVizFrame.setModel(dataModel);

                var that = this;
                dataModel.attachRequestCompleted(function() {
                    that.dataSort(this.getData());
                });
            }
        },
        onSeriesSelected : function(oEvent){
            if (!oEvent.getParameters().selected) {
                return;
            }
            var seriesRadio = oEvent.getSource();
            if (this.oVizFrame && seriesRadio.getSelected()){
                var bindValue = seriesRadio.getBindingContext().getObject();

                this.oVizFrame.removeFeed(this.feedActualValues);
                this.feedActualValues.setValues(bindValue.value[0]);
                this.oVizFrame.addFeed(this.feedActualValues);

                this.oVizFrame.removeFeed(this.feedTargetValues);
                this.feedTargetValues.setValues(bindValue.value[1]);
                this.oVizFrame.addFeed(this.feedTargetValues);
            }
            if (this.hasFeed(this.feedAdditionalValues)){
                this.oVizFrame.removeFeed(this.feedAdditionalValues);
                this.feedAdditionalValues.setValues(bindValue.value[2]);
                this.oVizFrame.addFeed(this.feedAdditionalValues);
            }
            if (this.hasFeed(this.feedForecastValues)){
                this.oVizFrame.removeFeed(this.feedForecastValues);
                this.feedForecastValues.setValues(bindValue.value[3]);
                this.oVizFrame.addFeed(this.feedForecastValues);
            }

            var that = this;
            this.oVizFrame.getModel().attachRequestCompleted(function() {
                that.dataSort(this.getData());
            });
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
        onValuesDisplayedChanged :function(oEvent){
            if (this.oVizFrame){
                var selectedKey = parseInt(oEvent.getSource().getSelectedKey());
                var bindValue = this.settingsModel.valuesDisplayed.values[selectedKey];
                this.oVizFrame.setVizProperties(bindValue.vizProperties);
                this.seriesRadioGroup.getButtons().forEach(function(oButten){
                    oButten.setEnabled(bindValue.enabled);
                });
                this.oVizFrame.removeAllFeeds();
                switch (selectedKey){
                    case 0:
                        this.oVizFrame.addFeed(this.feedActualValues);
                        this.oVizFrame.addFeed(this.feedCategoryAxis);
                        this.oVizFrame.addFeed(this.feedTargetValues);
                        break;
                    case 1:
                        this.oVizFrame.addFeed(this.feedActualValues);
                        this.oVizFrame.addFeed(this.feedCategoryAxis);
                        this.oVizFrame.addFeed(this.feedTargetValues);
                        this.oVizFrame.addFeed(this.feedAdditionalValues);
                        break;
                }
            }
        },
        hasFeed : function(feedItem){
            var FeedItems = this.oVizFrame.getFeeds();
            var len = FeedItems.length;
            for (var i = 0; i < len; i++){
                if (FeedItems[i] == feedItem) {
                    return true;
                }
            }
            return false;
        }
    });

    return Controller;

});