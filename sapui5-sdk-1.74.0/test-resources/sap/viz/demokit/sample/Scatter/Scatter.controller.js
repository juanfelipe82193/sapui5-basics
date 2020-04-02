sap.ui.define([
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/BindingMode',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/controls/common/feeds/FeedItem',
        'sap/viz/ui5/data/DimensionDefinition',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
        './InitPage'
    ], function(Controller, BindingMode, JSONModel, FeedItem, DimensionDefinition, ChartFormatter, Format, InitPageUtil) {
    "use strict";

    var Controller = Controller.extend("sap.viz.sample.Scatter.Scatter", {

        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue_cost_consume_fatPercentage/1_percent",

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
            color : {
                name : "Color",
                defaultSelected : 0,
                values : [{
                    name : "Same Color"
                }, {
                    name : '1 Color / Country'
                }]
            },
            dataLabel : {
                name : "Value Label",
                defaultState : false
            },
            axisTitle : {
                name : "Axis Title",
                defaultState : false
            }
        },

        oVizFrame : null, datasetRadioGroup : null, seriesRadioGroup : null,

        onInit : function (evt) {
            Format.numericFormatter(ChartFormatter.getInstance());
            var formatPattern = ChartFormatter.DefaultPattern;
            // set explored app's demo model on this sample
            var oModel = new JSONModel(this.settingsModel);
            oModel.setDefaultBindingMode(BindingMode.OneWay);
            this.getView().setModel(oModel);

            this.countryDimension = new DimensionDefinition({name : "Country", value : "{Country}"});
            this.feedColor = new FeedItem({
                    'uid': "color",
                    'type': "Dimension",
                    'values': ["Country"]
                });
            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            oVizFrame.setVizProperties({
                plotArea: {
                    dataLabel: {
                        formatString:formatPattern.SHORTFLOAT_MFD2,
                        visible: false,
                        hideWhenOverlap: true
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
                legend: {
                    title: {
                        visible: false
                    }
                },
                sizeLegend: {
                    formatString:formatPattern.SHORTFLOAT_MFD2,
                    title: {
                        visible: true
                    }
                },
                title: {
                    visible: false
                }
            });
            var dataModel = new JSONModel(this.dataPath + "/medium.json");
            oVizFrame.setModel(dataModel);

            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(formatPattern.STANDARDFLOAT);

            InitPageUtil.initPageSettings(this.getView());
            oVizFrame.getDataset().setContext("Store Name");
        },
        onAfterRendering : function(){
            this.datasetRadioGroup = this.getView().byId('datasetRadioGroup');
            this.datasetRadioGroup.setSelectedIndex(this.settingsModel.dataset.defaultSelected);

            var colorRadioGroup = this.getView().byId('colorRadioGroup');
            colorRadioGroup.setSelectedIndex(this.settingsModel.color.defaultSelected);

            this.flattenedDataset = this.oVizFrame.getDataset();
        },
        onDatasetSelected : function(oEvent){
            var datasetRadio = oEvent.getSource();
            if (this.oVizFrame && datasetRadio.getSelected()){
                var bindValue = datasetRadio.getBindingContext().getObject();
                var dataModel = new JSONModel(this.dataPath + bindValue.value);
                this.oVizFrame.setModel(dataModel);
                this.oVizFrame.getDataset().setContext("Store Name");
            }
        },
        onColorSelected : function(oEvent){
            if (!oEvent.getParameters().selected) {
                return;
            }
            var colorRadio = oEvent.getSource();
            if (this.oVizFrame && colorRadio.getSelected()){
                var bindValue = colorRadio.getBindingContext().getObject();
                switch (bindValue.name){
                    case "Same Color":
                        this.flattenedDataset.removeDimension(this.countryDimension);
                        this.oVizFrame.setDataset(this.flattenedDataset);
                        this.oVizFrame.removeFeed(this.feedColor);
                        break;
                    case "1 Color / Country":
                        this.flattenedDataset.addDimension(this.countryDimension);
                        this.oVizFrame.setDataset(this.flattenedDataset);
                        this.oVizFrame.addFeed(this.feedColor);
                        break;
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
                    valueAxis2: {
                        title: {
                            visible: state
                        }
                    }
                });
            }
        }
    });

    return Controller;

});
