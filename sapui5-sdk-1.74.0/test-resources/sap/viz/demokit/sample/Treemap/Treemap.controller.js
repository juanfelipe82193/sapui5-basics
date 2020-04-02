sap.ui.define([
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/BindingMode',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
        './InitPage'
    ], function(Controller, BindingMode, JSONModel, ChartFormatter, Format, InitPageUtil) {
    "use strict";

    var Controller = Controller.extend("sap.viz.sample.Treemap.Treemap", {

        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue_cost_consume_country/1_percent",

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
            dataLabel : {
                name : "Value Label",
                defaultState : true
            },
            semanticColor: {
                name:"Semantic colors",
                defaultState: false,
                values: {
                            "false":{},
                            "true":{
                                rules:[
                                    {
                                        dataContext: {Revenue:{min:2600000}},
                                        properties:{
                                            color: "sapUiChartPaletteSemanticGood"
                                        },
                                        displayName: "> 2.6M"
                                    },
                                                                        {
                                        dataContext: {Revenue:{min:1300000, max:2600000}},
                                        properties:{
                                            color: "sapUiChartPaletteSemanticCritical"
                                        },
                                        displayName: "1.3M - 2.6M"
                                    },
                                    {
                                        dataContext: {Revenue:{max:1300000}},
                                        properties:{
                                            color: "sapUiChartPaletteSemanticBad"
                                        },
                                        displayName: "< 1.3M"
                                    }

                                ]
                            }
                        }
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
                        formatString:formatPattern.SHORTFLOAT_MFD2,
                        visible: true
                    }
                },
                legend: {
                    visible: true,
                    formatString:formatPattern.SHORTFLOAT,
                    title: {
                        visible: false
                    }
                },
                title: {
                    visible: false,
                    text: 'Revenue and Cost by Country and Store Name'
                }
            });
            var dataModel = new JSONModel(this.dataPath + "/medium.json");

            oVizFrame.setModel(dataModel);

            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(formatPattern.STANDARDFLOAT);

            InitPageUtil.initPageSettings(this.getView());
        },
        onAfterRendering : function(){
            this.datasetRadioGroup = this.getView().byId('datasetRadioGroup');
            this.datasetRadioGroup.setSelectedIndex(this.settingsModel.dataset.defaultSelected);

            },
        onDatasetSelected : function(oEvent){
            var datasetRadio = oEvent.getSource();
            if (this.oVizFrame && datasetRadio.getSelected()){
                var bindValue = datasetRadio.getBindingContext().getObject();
                var dataModel = new JSONModel(this.dataPath + bindValue.value);
                this.oVizFrame.setModel(dataModel);
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
        onSemanticColorChanged : function(oEvent){
            if (this.oVizFrame) {
                var oVizProperties = this.oVizFrame.getVizProperties();
                console.log(oVizProperties); // eslint-disable-line no-console
                this.oVizFrame.setVizProperties({
                    plotArea: {
                        dataPointStyle: this.settingsModel.semanticColor.values[oEvent.getParameter("state")]
                    }
                });
                window.test = this.oVizFrame.getVizProperties();
            }
        }
    });

    return Controller;

});