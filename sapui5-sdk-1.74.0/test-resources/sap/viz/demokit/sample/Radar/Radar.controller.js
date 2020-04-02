sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/BindingMode',
    'sap/ui/model/json/JSONModel',
    'sap/viz/ui5/format/ChartFormatter',
    'sap/viz/ui5/api/env/Format',
    './InitPage'
], function(Controller, BindingMode, JSONModel, ChartFormatter, Format, InitPageUtil) {
"use strict";

var Controller = Controller.extend("sap.viz.sample.Radar.Radar", {

    dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/radar",

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
                value : ["Revenue"]
            }, {
                name : '2 Series',
                value : ["Revenue", "Cost"]
            }, {
                name : '3 Series',
                value : ["Revenue", "Cost", "Consumption"]
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
                    formatString: formatPattern.SHORTFLOAT_MFD2,
                    visible: false
                },
                polarAxis: {
                    label: {
                        formatString: formatPattern.SHORTFLOAT_MFD2
                    },
                    title: {
                        visible: true
                    }
                },
                valueAxis: {
                    label: {
                        formatString: formatPattern.SHORTFLOAT_MFD2
                    },
                    title: {
                        visible: true
                    }
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

        var seriesRadioGroup = this.getView().byId('seriesRadioGroup');
        seriesRadioGroup.setSelectedIndex(this.settingsModel.series.defaultSelected);
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

            var feedValueAxis = this.getView().byId('valueAxisFeed');
            this.oVizFrame.removeFeed(feedValueAxis);
            feedValueAxis.setValues(bindValue.value);
            this.oVizFrame.addFeed(feedValueAxis);
            var that = this;
            this.oVizFrame.getModel().attachRequestCompleted(function() {
                that.dataSort(this.getData());
            });
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
                plotArea: {
                    polarAxis: {
                        title: {
                            visible: state,
                            style: {
                                fontWeight: "regular"
                            }
                        }
                    },
                    valueAxis: {
                        title: {
                            visible: state,
                            style: {
                                fontWeight: "regular"
                            }
                        }
                    }
                }
            });
        }
    }
});

return Controller;

});