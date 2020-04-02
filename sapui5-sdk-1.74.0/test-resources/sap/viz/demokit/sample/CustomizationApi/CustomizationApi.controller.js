sap.ui.define([
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
        './InitPage',
        './sample/hw-bundle'
    ], function(Controller, JSONModel, ChartFormatter, Format, InitPageUtil) {
    "use strict";

    var Controller = Controller.extend("sap.viz.sample.CustomizationApi.CustomizationApi", {

        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue_cost_consume/transportation.json",

        onInit : function (evt) {
            Format.numericFormatter(ChartFormatter.getInstance());
            var formatPattern = ChartFormatter.DefaultPattern;

            var oVizFrame = this.getView().byId("idVizFrame");
            var dataModel = new JSONModel(this.dataPath);
            oVizFrame.setModel(dataModel);

            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString(formatPattern.STANDARDFLOAT);

            InitPageUtil.initPageSettings(this.getView());

            oVizFrame.setVizCustomizations({
                id: "com.sap.viz.custom.infoColumn",
                customRendererProperties: {
                    "com.sap.viz.categoryAxis.labelRenderer":
                    {
                        "rules": [
                        {
                            "dataContext": [{'Transportation Mode': "Truck"}],
                            "properties": {
                                fill: "blue",
                                stroke: "blue"
                            }
                        },
                        {
                            "dataContext": [{'Transportation Mode': "Highspeed"}],
                            "properties": {
                                fill: "blue",
                                stroke: "blue"
                            }
                        },
                        {
                            "dataContext": [{'Transportation Mode': "Ship"}],
                            "properties": {
                                fill: "blue",
                                stroke: "blue"
                            }
                        },
                        {
                            "dataContext": [{'Transportation Mode': "Plane"}],
                            "properties": {
                                fill: "blue",
                                stroke: "blue"
                            }
                        }
                        ]
                    }
                }
            });

            oVizFrame.setVizProperties({
                plotArea: {
                    dataLabel: {
                        visible: true,
                        formatString:formatPattern.SHORTFLOAT_MFD2
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
                        text: "Transportation Mode"
                    }
                },
                title: {
                    visible: false
                }
            });
        }
    });

    return Controller;

});