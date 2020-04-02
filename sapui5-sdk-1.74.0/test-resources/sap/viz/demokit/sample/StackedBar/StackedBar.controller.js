sap.ui.define([
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/BindingMode',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
        './InitPage'
    ], function(Controller, BindingMode, JSONModel, ChartFormatter, Format, InitPageUtil) {
    "use strict";

    var Controller = Controller.extend("sap.viz.sample.StackedBar.StackedBar", {

        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue1_revenue2_storeName",

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
                    vizType : "stacked_bar",
                    vizProperties : {
                        plotArea: {
                            dataLabel: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2
                            }
                        },
                        valueAxis: {
                            label: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT
                            }
                        },
                        valueAxis2: {
                            label: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT
                            }
                        }
                    }
                },{
                    name : "100%",
                    vizType : "100_stacked_bar",
                    vizProperties : {
                        plotArea: {
                            mode: "percentage",
                            dataLabel: {
                                type: "percentage",
                                formatString:ChartFormatter.DefaultPattern.STANDARDPERCENT_MFD2
                            }
                        },
                        valueAxis: {
                            label: {
                                formatString:null
                            }
                        },
                        valueAxis2: {
                            label: {
                                formatString:null
                            }
                        }
                    }
                }]
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
            if (dataset && dataset.hasOwnProperty("milk")) {
                var tmp = [], arr = dataset.milk;
                for (var i = 0; i < arr.length / 2; i++) {
                    tmp.push({key: i, value: arr[i].Revenue + arr[i + arr.length / 2].Revenue});
                }
                tmp.sort(function (a, b) {
                    return b.value - a.value;
                });
                var newArr = [];
                for (var j = 0; j < tmp.length; j++) {
                    if (j !== tmp[j].key) {
                        newArr[j] = arr[tmp[j].key];
                        newArr[j + arr.length / 2] = arr[tmp[j].key + arr.length / 2];
                    } else {
                        newArr[j] = arr[j];
                        newArr[j + arr.length / 2] = arr[j + arr.length / 2];
                    }
                }
                if (newArr.length > 0) {
                    dataset.milk = newArr;
                }
            }
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
                var dataModel = new JSONModel(this.dataPath + bindValue.value);
                this.oVizFrame.setModel(dataModel);
                var that = this;
                dataModel.attachRequestCompleted(function() {
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
        onTypeSelected : function(oEvent){
            if (!oEvent.getParameters().selected) {
                return;
            }
            var sumLabelSwitch = this.getView().byId("sumLabelSwitch");
            var typeRadio = oEvent.getSource();
            if (this.oVizFrame && typeRadio.getSelected()){
                var bindValue = typeRadio.getBindingContext().getObject();
                this.oVizFrame.setVizType(bindValue.vizType);
                this.oVizFrame.setVizProperties(bindValue.vizProperties);
                var that = this;
                this.oVizFrame.getModel().attachRequestCompleted(function() {
                    that.dataSort(this.getData());
                });
                if (bindValue.vizType === "100_stacked_bar") {
                    sumLabelSwitch.setState(false);
                    sumLabelSwitch.setEnabled(false);
                } else {
                    sumLabelSwitch.setEnabled(true);
                    sumLabelSwitch.setState(this._sumLabelSwitch);
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