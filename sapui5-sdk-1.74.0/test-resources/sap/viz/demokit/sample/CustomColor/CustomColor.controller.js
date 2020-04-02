sap.ui.define([
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/controls/common/feeds/FeedItem',
        'sap/viz/ui5/data/DimensionDefinition',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
        './InitPage'
    ], function(Controller, JSONModel, FeedItem, DimensionDefinition, ChartFormatter,
        Format, InitPageUtil) {
    "use strict";

    var Controller = Controller.extend("sap.viz.sample.CustomColor.CustomColor", {

        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue_cost_consume",

        settingsModel : {
            dataset : {
                name: "Custom Color",
                defaultSelected : 0,
                values : [{
                    name : "Good / Bad",
                    value : ["Revenue"],
                    path: "/medium.json",
                    vizProperties : {
                        plotArea: {
                            dataPointStyle: {
                                "rules":
                                [
                                    {
                                        "dataContext": {"Revenue": {"max": 1500000}},
                                        "properties": {
                                            "color":"sapUiChartPaletteSemanticBad"
                                        },
                                        "displayName":"Revenue < 1.5M"
                                    }
                                ],
                                "others":
                                {
                                    "properties": {
                                         "color": "sapUiChartPaletteSemanticGood"
                                    },
                                    "displayName": "Revenue > 1.5M"
                                }
                            }
                        }
                    }
                },{
                    name : "Color One Category",
                    path: "/medium.json",
                    value : ["Revenue"],
                    vizProperties : {
                        plotArea: {
                            dataPointStyle: {
                                "rules":
                                [
                                    {
                                        "dataContext": {"Store Name": "Alexei's Specialities"},
                                        "properties": {
                                            "color":"sapUiChartPaletteQualitativeHue1"
                                        },
                                        "displayName":"Alexei’s Specialties"
                                    }
                                ],
                                "others":
                                {
                                    "properties": {
                                         "color": "sapUiChartPaletteQualitativeHue2"
                                    },
                                    "displayName": "Other Stores"
                                }
                            }
                        }
                    }
                },{
                    name : "Color Two Series",
                    path: "/year_cost.json",
                    value : ["Revenue"],
                    vizProperties :{
                        plotArea: {
                            dataPointStyle: {
                                "rules":
                                [
                                    {
                                        "dataContext": {"Year": "2013"},
                                        "properties": {
                                                "color":"sapUiChartPaletteSequentialHue1Light2"
                                        },
                                        "displayName": "2013"
                                    },
                                    {
                                        "dataContext": {"Year": "2014"},
                                        "properties": {
                                                "color":"sapUiChartPaletteSequentialHue1"
                                        },
                                        "displayName": "2014"
                                    }
                                ]
                            }
                        }
                    }
                }]
            }
        },

        oVizFrame : null,
        feedValueAxis : null,
        yearDimension : new DimensionDefinition({name : "Year", value : "{Year}"}),
        feedColor : new FeedItem({
                'uid': "color",
                'type': "Dimension",
                'values': ["Year"]
        }),

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
                    },
                     dataPointStyle: {
                        "rules":
                        [
                            {
                                "dataContext": {"Revenue": {"max": 1500000}},
                                "properties": {
                                    "color":"sapUiChartPaletteSemanticBad"
                                },
                                "displayName":"Revenue < 1.5M"
                            }
                        ],
                        "others":
                        {
                            "properties": {
                                 "color": "sapUiChartPaletteSemanticGood"
                            },
                            "displayName": "Revenue > 1.5M"
                        }
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
            var dataModel = new JSONModel(this.dataPath + "/medium.json");
            oVizFrame.setModel(dataModel);

            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(formatPattern.STANDARDFLOAT);

            InitPageUtil.initPageSettings(this.getView());
        },
        onAfterRendering : function(){
            var datasetRadioGroup = this.getView().byId('datasetRadioGroup');
            datasetRadioGroup.setSelectedIndex(this.settingsModel.dataset.defaultSelected);
            this.feedValueAxis = this.getView().byId('feedValueAxis');
        },
        onDatasetSelected : function(oEvent){
            var datasetRadio = oEvent.getSource();
            if (this.oVizFrame && datasetRadio.getSelected()){
                var flattenedDataset = this.oVizFrame.getDataset();
                var bindValue = datasetRadio.getBindingContext().getObject();
                var dataModel = new JSONModel(this.dataPath + bindValue.path);
                this.oVizFrame.setModel(dataModel);
                if (bindValue.name === "Color Two Series") {
                    flattenedDataset.addDimension(this.yearDimension);
                    this.oVizFrame.addFeed(this.feedColor);
                } else {
                    flattenedDataset.removeDimension(this.yearDimension);
                    this.oVizFrame.removeFeed(this.feedColor);
                }
                this.oVizFrame.setDataset(flattenedDataset);
                this.oVizFrame.removeFeed(this.feedValueAxis);
                this.feedValueAxis.setValues(bindValue.value);
                this.oVizFrame.addFeed(this.feedValueAxis);
                this.oVizFrame.setVizProperties(bindValue.vizProperties);
            }
        }
    });

    return Controller;

});