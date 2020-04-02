sap.ui.define([
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
        './InitPage'
    ], function(Controller, JSONModel, ChartFormatter, Format, InitPageUtil) {
    "use strict";

    var Controller = Controller.extend("sap.viz.sample.SelectionByApi.SelectionByApi", {

        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue1_revenue2_storeName",

        settingsModel : {
            dataset : {
                name: "Selection Mode",
                defaultSelected : 0,
                values : [{
                    name : "Category Selection by API",
                    data : "Store Name",
                    vizProperties : {
                        interaction: {
                            behaviorType: null,
                            selectability: {
                                plotLassoSelection: false,
                                legendSelection: false,
                                axisLabelSelection: true
                            }
                        }
                    }
                },{
                    name : "Series Selection by API",
                    data : "Fat Percentage",
                    vizProperties : {
                        interaction: {
                            behaviorType: null,
                            selectability: {
                                plotLassoSelection: false,
                                legendSelection: true,
                                axisLabelSelection: false
                            }
                        }
                    }
                }]
            }
        },

        oVizFrame : null, datasetRadioGroup : null,

        onInit : function (evt) {
            Format.numericFormatter(ChartFormatter.getInstance());
            var formatPattern = ChartFormatter.DefaultPattern;
            // set explored app's demo model on this sample
            var oModel = new JSONModel(this.settingsModel);
            this.getView().setModel(oModel);

            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            oVizFrame.setVizProperties({
                plotArea: {
                    dataLabel: {
                        formatString:formatPattern.SHORTFLOAT_MFD2,
                        visible: true
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
                legend: {
                    title: {
                        visible: false
                    }
                },
                interaction: {
                    selectability: {
                        plotLassoSelection: false,
                        legendSelection: false,
                        axisLabelSelection: true
                    }
                },
                title: {
                    visible: false,
                    text: 'Revenue by City and Store Name'
                },
                tooltip: {
                    visible: false
                }
            });
            var dataModel = new JSONModel(this.dataPath + "/medium.json");
            oVizFrame.setModel(dataModel);

            InitPageUtil.initPageSettings(this.getView());

            var datasetRadioGroup = this.datasetRadioGroup = this.getView().byId('datasetRadioGroup');
            var dimentionName = [{"data" : 'Store Name'},{"data" : 'Fat Percentage'}];
            oVizFrame.attachSelectData(null,function(event){
                if (event.mParameters.data.length == 1) {
                    var bindValue = dimentionName[datasetRadioGroup.getSelectedIndex()];
                    var selected = event.mParameters.data[0].data[bindValue.data];
                    var points = [{"data" : {}}];
                    points[0].data[bindValue.data] = selected;
                    this.vizSelection(points,{clearSelection: false});
                }
            });
            oVizFrame.attachDeselectData(null,function(event){
                this.vizSelection([],{clearSelection: true});
            });
        },
        onAfterRendering : function(){
            this.datasetRadioGroup.setSelectedIndex(this.settingsModel.dataset.defaultSelected);
        },
        onDatasetSelected : function(oEvent){
            var datasetRadio = oEvent.getSource();
            if (this.oVizFrame && datasetRadio.getSelected()){
                this.oVizFrame.vizSelection([],{clearSelection: true});
                var bindValue = datasetRadio.getBindingContext().getObject();
                this.oVizFrame.setVizProperties(bindValue.vizProperties);
            }
        }
    });

    return Controller;

});