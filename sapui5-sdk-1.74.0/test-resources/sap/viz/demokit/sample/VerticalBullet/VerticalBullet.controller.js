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

    var Controller = Controller.extend("sap.viz.sample.VerticalBullet.VerticalBullet", {

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
                defaultSelected : 0,
                values : [{
                    name : "1 Series",
                    value : [["Cost"],["Budget"],["Cost2"]]
                }, {
                    name : '2 Series',
                    value : [["Revenue", "Cost"],["Target","Budget"]]
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
               name: 'Revenue',
               value: '{Revenue}'
            },{
               name: 'Cost',
               value: '{Cost}'
            },{
               name: 'Cost1',
               value: '{Cost1}'
            },{
               name: 'Cost2',
               value: '{Cost2}'
            },{
               name: 'Target',
               value: '{Target}'
            },{
               name: 'Budget',
               value: '{Budget}'
            }],
            rules: {
                primary : [{
                    plotArea : {
                        dataPointStyle : {
                            rules : [{
                                dataContext : {Cost : "*"},
                                properties : {
                                    color : "sapUiChartPaletteSequentialHue1Light1"
                                },
                                displayName : "Actual",
                                dataName : {Cost : "Actual"}
                            }]
                        }
                    }
                }, {
                    plotArea : {
                        dataPointStyle : {
                        }
                    }
                }],
                primaryAdditional : [{
                    plotArea : {
                        dataPointStyle : {
                        }
                    }
                }]
            },
            feeds: {
                oneSeries : {
                    primary : [["Cost"], ["Budget"]],
                    primaryAdditional : [["Cost1"], ["Cost2"],["Budget"]]
                },
                twoSeries : {
                    primary : [["Revenue", "Cost"], ["Target", "Budget"]],
                    primaryAdditional: [["Cost1", "Revenue"], ["Cost2"], ["Budget", "Target"]]
                }
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
                        formatString:formatPattern.SHORTFLOAT_MFD2,
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
                    text: 'Revenue'
                }
            });
            var dataModel = new JSONModel(this.dataPath + "/betterMedium.json");
            oVizFrame.setModel(dataModel);

            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(formatPattern.STANDARDFLOAT);
            oVizFrame.setVizProperties(this.settingsModel.rules.primary[0]);

            InitPageUtil.initPageSettings(this.getView());
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
            this.oVizFrame.removeFeed(this.feedAdditionalValues);
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
        switchFeeds : function(isPrimaryAdditional, isOneSeries) {
            var feeds = this.settingsModel.feeds;
            if (isPrimaryAdditional) {
                if (isOneSeries) {
                    this.feedActualValues.setValues(feeds.oneSeries.primaryAdditional[0]);
                    this.feedAdditionalValues.setValues(feeds.oneSeries.primaryAdditional[1]);
                    this.feedTargetValues.setValues(feeds.oneSeries.primaryAdditional[2]);
                } else {
                    this.feedActualValues.setValues(feeds.twoSeries.primaryAdditional[0]);
                    this.feedAdditionalValues.setValues(feeds.twoSeries.primaryAdditional[1]);
                    this.feedTargetValues.setValues(feeds.twoSeries.primaryAdditional[2]);
                }
            } else {
                if (isOneSeries) {
                    this.feedActualValues.setValues(feeds.oneSeries.primary[0]);
                    this.feedTargetValues.setValues(feeds.oneSeries.primary[1]);
                } else {
                    this.feedActualValues.setValues(feeds.twoSeries.primary[0]);
                    this.feedTargetValues.setValues(feeds.twoSeries.primary[1]);
                }
            }
        },
        onSeriesSelected : function(oEvent){
            if (!oEvent.getParameters().selected) {
                return;
            }
            var seriesRadio = oEvent.getSource();
            if (this.oVizFrame && seriesRadio.getSelected()){
                var isPrimaryAdditional = this.hasFeed(this.feedAdditionalValues);
                var isOneSeries = seriesRadio.getText().indexOf("1") > -1;
                this.oVizFrame.removeFeed(this.feedActualValues);
                this.oVizFrame.removeFeed(this.feedTargetValues);
                if (isPrimaryAdditional){
                    this.oVizFrame.removeFeed(this.feedAdditionalValues);
                }
                this.switchFeeds(isPrimaryAdditional, isOneSeries);
                this.oVizFrame.addFeed(this.feedActualValues);
                this.oVizFrame.addFeed(this.feedTargetValues);
                if (isPrimaryAdditional){
                    this.oVizFrame.addFeed(this.feedAdditionalValues);
                }

                var rule;
                if (!isPrimaryAdditional && isOneSeries) {
                    rule = this.settingsModel.rules.primary[0];
                } else {
                    rule = this.settingsModel.rules.primary[1];
                }
                if (rule) {
                    this.oVizFrame.setVizProperties(rule);
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
        onValuesDisplayedChanged :function(oEvent){
            if (this.oVizFrame){
                var selectedKey = parseInt(oEvent.getSource().getSelectedKey());
                var bindValue = this.settingsModel.valuesDisplayed.values[selectedKey];
                this.oVizFrame.setVizProperties(bindValue.vizProperties);
                this.seriesRadioGroup.getButtons().forEach(function(oButten){
                    oButten.setEnabled(bindValue.enabled);
                });
                this.oVizFrame.removeAllFeeds();
                var seriesRadio = this.getView().byId('seriesRadioGroup');
                var rule;
                var isOneSeries = seriesRadio.getSelectedButton().getText().indexOf("1") > -1;
                var isPrimaryAdditional = (selectedKey === 1);
                this.switchFeeds(isPrimaryAdditional, isOneSeries);
                switch (selectedKey){
                    case 0:
                        if (isOneSeries) {
                            rule = this.settingsModel.rules.primary[0];
                        }
                        this.oVizFrame.addFeed(this.feedActualValues);
                        this.oVizFrame.addFeed(this.feedCategoryAxis);
                        this.oVizFrame.addFeed(this.feedTargetValues);
                        break;
                    case 1:
                        rule = this.settingsModel.rules.primaryAdditional[0];
                        this.oVizFrame.addFeed(this.feedActualValues);
                        this.oVizFrame.addFeed(this.feedCategoryAxis);
                        this.oVizFrame.addFeed(this.feedTargetValues);
                        this.oVizFrame.addFeed(this.feedAdditionalValues);
                        break;
                }
                if (rule) {
                    this.oVizFrame.setVizProperties(rule);
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