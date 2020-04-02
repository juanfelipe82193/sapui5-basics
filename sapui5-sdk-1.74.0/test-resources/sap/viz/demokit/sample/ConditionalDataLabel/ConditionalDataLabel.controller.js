sap.ui.define([
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
        './InitPage'
    ], function(Controller, JSONModel, ChartFormatter, Format, InitPageUtil) {
    "use strict";

    var Controller = Controller.extend("sap.viz.sample.ConditionalDataLabel.ConditionalDataLabel", {

        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue_cost_consume/timemonth.json",

        settingsModel : {
            customValueDisplay : {
                name: "Custom Value Display",
                defaultSelected : 0,
                values : [{
                    name : "First & Last",
                    vizProperties : {
                        plotArea: {
                                callout: {
                                    top: [{
                                        dataContext: [{
                                            Month: "1/1/2016"
                                        },{
                                            Month: "12/1/2016"
                                        }]
                                    }]
                                },
                                dataPointStyle: {
                                        "rules":
                                        [
                                    {
                                        "dataContext": {"Month": "1/1/2016"},
                                        "properties": {
                                            "dataLabel": true
                                        }
                                    },
                                    {
                                        "dataContext": {"Month": "12/1/2016"},
                                        "properties": {
                                            "dataLabel": true
                                        }
                                    }
                                ],
                                "others":
                                {
                                    "properties": {
                                         "dataLabel": false
                                    }
                                }
                            }
                        }
                    }
                },{
                    name : "Max & Min",
                    vizProperties : {
                        plotArea: {
                            callout: {
                                left: [{
                                    dataContext: [{
                                        Month: "9/1/2016"
                                    },{
                                        Month: "3/1/2016"
                                    }]
                                }]
                            },
                            dataPointStyle: {
                                "rules":
                                [
                            {
                                "dataContext": {"Month": "9/1/2016"},
                                "properties": {
                                    "dataLabel": true
                                }
                            },
                            {
                                "dataContext": {"Month": "3/1/2016"},
                                "properties": {
                                    "dataLabel": true
                                }
                            }
                        ],
                                "others":
                                {
                                    "properties": {
                                         "dataLabel": false
                                    }
                                }
                            }
                        }
                    }
                },{
                    name : "1 Specific Date Only",
                    vizProperties : {
                        plotArea: {
                            callout: {
                                top: [{
                                    dataContext: [{
                                        Month: "7/1/2016"
                                    }]
                                }]
                            },
                            dataPointStyle: {
                                "rules":
                                [
                                    {
                                        "dataContext": {"Month": "7/1/2016"},
                                        "properties": {
                                            "dataLabel": true
                                        }
                                    }
                                ],
                                "others":
                                {
                                    "properties": {
                                        "dataLabel": false
                                    }
                                }
                            }
                        }
                    }
                }]
            },
            valueLabelPosition : {
                name: "Value Label Position",
                defaultSelected : 0,
                values : [{
                    name : "Outside",
                    value: false
                },{
                    name : "Inside",
                    value: true
                }]
            }
        },

        oVizFrame : null,
        feedValueAxis : null,

        onInit : function (evt) {
            Format.numericFormatter(ChartFormatter.getInstance());
            var formatPattern = ChartFormatter.DefaultPattern;
            // set explored app's demo model on this sample
            var oModel = new JSONModel(this.settingsModel);
            this.getView().setModel(oModel);

            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            var defaultValue = this.settingsModel.customValueDisplay.defaultSelected;
            var plotArea = this.settingsModel.customValueDisplay.values[defaultValue].vizProperties.plotArea;
            defaultValue = this.settingsModel.valueLabelPosition.defaultSelected;
            var valueLabelPosition = this.settingsModel.valueLabelPosition.values[defaultValue].value;
            var vizProperties = {
                interaction: {
                        zoom: {
                            enablement: "disabled"
                        }
                    },
                valueAxis: {
                        label: {
                            formatString: formatPattern.SHORTFLOAT
                        },
                        title: {
                            visible: false
                        },
                        visible: false
                },
                timeAxis:{
                    title: {
                        visible: false
                    },
                    levels: ['month'],
                    interval : {
                        unit : ''
                    }
                },
                title: {
                    visible: false
                },
                legend: {
                    visible: false
                },
                plotArea: {
                    dataLabel: {
                        style: {
                            fontWeight: 'bold'
                        },
                        formatString: formatPattern.SHORTFLOAT_MFD2,
                        hideWhenOverlap : false
                    },
                    isFixedDataPointSize : false,
                    callout : {
                        label: {
                            formatString: formatPattern.SHORTFLOAT_MFD2
                        }
                    },
                    window : {
                        start: "firstDataPoint",
                        end: "lastDataPoint"
                    }
                }
            };
            this._plotAreaProps = plotArea;
            this._valueLabelPosition = valueLabelPosition;
            this.updateProperties();

            oVizFrame.setVizProperties(vizProperties);
            var dataModel = new JSONModel(this.dataPath);
            oVizFrame.setModel(dataModel);

            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(formatPattern.STANDARDFLOAT);

            InitPageUtil.initPageSettings(this.getView());
        },
        onAfterRendering : function(){
            var customValueDisplayRadioGroup = this.getView().byId('customValueDisplayRadioGroup');
            customValueDisplayRadioGroup.setSelectedIndex(this.settingsModel.customValueDisplay.defaultSelected);

            var valueLabelPositionRadioGroup = this.getView().byId('valueLabelPositionRadioGroup');
            valueLabelPositionRadioGroup.setSelectedIndex(this.settingsModel.valueLabelPosition.defaultSelected);
        },
        updateProperties : function() {
            if (this.oVizFrame) {
                var vizProperties = {};
                vizProperties.plotArea = {};
                vizProperties.plotArea.callout = {};

                var plotArea = this._plotAreaProps,
                    valueLabelPosition = this._valueLabelPosition;

                if (valueLabelPosition) {
                    //Datalabel Inside: Turn off callout label and use dataPointStyle to show labels
                    vizProperties.plotArea.dataPointStyle = plotArea.dataPointStyle;
                    vizProperties.plotArea.callout.top = null;
                    vizProperties.plotArea.callout.left = null;
                } else {
                    //Datalabel Outside: use callout
                    vizProperties.plotArea.dataPointStyle = null;
                    vizProperties.plotArea.callout.top = plotArea.callout.top;
                    vizProperties.plotArea.callout.left = plotArea.callout.left;
                }

                this.oVizFrame.setVizProperties(vizProperties);
            }
        },
        onCustomValueSelected : function(oEvent){
            var eRatio = oEvent.getSource();
            if (eRatio.getSelected()){
                var bindValue = eRatio.getBindingContext().getObject();
                this._plotAreaProps = bindValue.vizProperties.plotArea;
                this.updateProperties();
            }
        },
        onLabelPosSelected : function(oEvent) {
            var eRatio = oEvent.getSource();
            if (eRatio.getSelected()) {
                this._valueLabelPosition = eRatio.getBindingContext().getObject().value;
                this.updateProperties();
            }
        }
    });

    return Controller;

});
