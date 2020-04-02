sap.ui.define([
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/BindingMode',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/controls/common/feeds/FeedItem',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
        './InitPage'
    ], function(Controller, BindingMode, JSONModel, FeedItem, ChartFormatter, Format, InitPageUtil) {
    "use strict";

    var Controller = Controller.extend("sap.viz.sample.Heatmap.Heatmap", {

        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/heatmap",

        dataPointStyle : {
            "rules" : [
                {
                    "dataContext":
                        {"Revenue": {min: 5800000}},
                    "properties": {
                            "color":"sapUiChartPaletteSemanticGood"
                    },
                    "displayName": "> 5.8M"
                },
                {
                    "dataContext":
                        {"Revenue": {min: 2700000, max: 5800000}},
                    "properties": {
                            "color":"sapUiChartPaletteSemanticCritical"
                    },
                    "displayName": "2.7M - 5.8M"
                },
                {
                    "dataContext":
                        {"Revenue": {max: 2700000}},
                    "properties": {
                            "color":"sapUiChartPaletteSemanticBad"
                    },
                    "displayName": "< 2.7M"
                }
            ]
        },

        semantciState : false,

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
                defaultState : false
            },
            axisTitle : {
                name : "Axis Title",
                defaultState : false
            },
            semanticColors : {
                name : "Semantic Colors",
                defaultState : false
            },
            color : {
                name : "Color",
                defaultSelected : 1,
                values : [{
                    name : "3 Sections",
                    value : [{
                        "feed": "color",
                        "type": "color",
                        "numOfSegments": 3,
                        "palette": ["sapUiChartPaletteSequentialHue1Light2", "sapUiChartPaletteSequentialHue1",
                            "sapUiChartPaletteSequentialHue1Dark2"]
                    }]
                },{
                    name : "5 Sections",
                    value : [{
                        "feed": "color",
                        "type": "color",
                        "numOfSegments": 5,
                        "palette": ["sapUiChartPaletteSequentialHue1Light2", "sapUiChartPaletteSequentialHue1Light1",
                            "sapUiChartPaletteSequentialHue1", "sapUiChartPaletteSequentialHue1Dark1",
                            "sapUiChartPaletteSequentialHue1Dark2"]
                    }]
                },{
                    name : "8 Sections",
                    value : [{
                        "feed": "color",
                        "type": "color",
                        "numOfSegments": 8,
                        "palette": ["sapUiChartPaletteSequentialHue3Dark1", "sapUiChartPaletteSequentialHue3",
                            "sapUiChartPaletteSequentialHue3Light1", "sapUiChartPaletteSequentialHue3Light2",
                            "sapUiChartPaletteSequentialHue1Light2", "sapUiChartPaletteSequentialHue1Light1",
                            "sapUiChartPaletteSequentialHue1", "sapUiChartPaletteSequentialHue1Dark1"]
                    }]
                }]
            }
        },

        oVizFrame : null, datasetRadioGroup : null, colorRadioGroup : null,
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
                    background: {
                        border: {
                            top: {
                                visible: false
                            },
                            bottom: {
                                visible: false
                            },
                            left: {
                                visible: false
                            },
                            right: {
                                visible: false
                            }
                        }
                    },
                    dataLabel: {
                        formatString:formatPattern.SHORTFLOAT_MFD2,
                        visible: false
                    }
                },
                categoryAxis: {
                    title: {
                        visible: false
                    }
                },
                categoryAxis2: {
                    title: {
                        visible: false
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
                    text: 'Revenue by City and Store Name'
                }
            });
            var dataModel = new JSONModel(this.dataPath + "/2d/medium.json");
            oVizFrame.setModel(dataModel);

            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(formatPattern.STANDARDFLOAT);

            InitPageUtil.initPageSettings(this.getView());
        },
        onAfterRendering : function(){
            this.datasetRadioGroup = this.getView().byId('datasetRadioGroup');
            this.datasetRadioGroup.setSelectedIndex(this.settingsModel.dataset.defaultSelected);

            this.colorRadioGroup = this.getView().byId('colorRadioGroup');
            this.colorRadioGroup.setSelectedIndex(this.settingsModel.color.defaultSelected);
        },
        onDatasetSelected : function(oEvent){
            var datasetRadio = oEvent.getSource();
            if (this.oVizFrame && datasetRadio.getSelected()){
                var bindValue = datasetRadio.getBindingContext().getObject();
                var dataModel = new JSONModel(this.dataPath + "/2d" + bindValue.value);
                this.oVizFrame.setModel(dataModel);

                if (bindValue.name === 'Small') {
                    this.dataPointStyle = {
                        "rules" : [
                            {
                                "dataContext":
                                    {"Revenue": {min: 270000}},
                                "properties": {
                                        "color":"sapUiChartPaletteSemanticGood"
                                },
                                "displayName": "> 270k"
                            },
                            {
                                "dataContext":
                                    {"Revenue": {min: 90000, max: 270000}},
                                "properties": {
                                        "color":"sapUiChartPaletteSemanticCritical"
                                },
                                "displayName": "90k - 270k"
                            },
                            {
                                "dataContext":
                                    {"Revenue": {max: 90000}},
                                "properties": {
                                        "color":"sapUiChartPaletteSemanticBad"
                                },
                                "displayName": "< 90k"
                            }
                        ]
                    };
                } else if (bindValue.name === 'Medium') {
                    this.dataPointStyle = {
                        "rules" : [
                            {
                                "dataContext":
                                    {"Revenue": {min: 5800000}},
                                "properties": {
                                        "color":"sapUiChartPaletteSemanticGood"
                                },
                                "displayName": "> 5.8M"
                            },
                            {
                                "dataContext":
                                    {"Revenue": {min: 2700000, max: 5800000}},
                                "properties": {
                                        "color":"sapUiChartPaletteSemanticCritical"
                                },
                                "displayName": "2.7M - 5.8M"
                            },
                            {
                                "dataContext":
                                    {"Revenue": {max: 2700000}},
                                "properties": {
                                        "color":"sapUiChartPaletteSemanticBad"
                                },
                                "displayName": "< 2.7M"
                            }
                        ]
                    };
                } else {
                    this.dataPointStyle = {
                        "rules" : [
                            {
                                "dataContext":
                                    {"Revenue": {min: 4800000}},
                                "properties": {
                                        "color":"sapUiChartPaletteSemanticGood"
                                },
                                "displayName": "> 4.8M"
                            },
                            {
                                "dataContext":
                                    {"Revenue": {min: 1600000, max: 4800000}},
                                "properties": {
                                        "color":"sapUiChartPaletteSemanticCritical"
                                },
                                "displayName": "1.6M - 4.8M"
                            },
                            {
                                "dataContext":
                                    {"Revenue": {max: 1600000}},
                                "properties": {
                                        "color":"sapUiChartPaletteSemanticBad"
                                },
                                "displayName": "< 1.6M"
                            }
                        ],
                        "others" : {
                            "properties": {
                                "color": "#dddddd"
                            },
                            "displayName": "No value"
                        }
                    };
                }
            }

            if (this.semantciState) {
                this.oVizFrame.setVizProperties({
                    plotArea: {
                        dataPointStyle: this.dataPointStyle
                    }
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
                    },
                    categoryAxis2: {
                        title: {
                            visible: state
                        }
                    }
                });
            }
        },
        onsemanticColorsChanged: function(oEvent){
            if (this.oVizFrame){
                this.semantciState = oEvent.getParameter('state');
                this.colorRadioGroup.setEnabled(!this.semantciState);
                if (this.semantciState) {
                    this.oVizFrame.setVizProperties({
                        plotArea: {
                            dataPointStyle: this.dataPointStyle
                        }
                    });
                } else {
                    this.oVizFrame.setVizProperties({
                        plotArea: { dataPointStyle: {}}
                    });
                }
            }
        },
        onColorSelected :function(oEvent){
            var colorRadio = oEvent.getSource();
            if (this.oVizFrame && colorRadio.getSelected()){
                var bindValue = colorRadio.getBindingContext().getObject();
                this.oVizFrame.setVizScales(bindValue.value);
            }
        }
    });

    return Controller;

});