sap.ui.define([
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/BindingMode',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/data/FlattenedDataset',
        'sap/viz/ui5/controls/common/feeds/FeedItem',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
        './InitPage'
    ], function(Controller, BindingMode, JSONModel, FlattenedDataset, FeedItem, ChartFormatter, Format, InitPageUtil) {
    "use strict";

    var Controller = Controller.extend("sap.viz.sample.TimeHighlightPeriods.TimeHighlightPeriods", {

        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/date_revenue_cost",

        settingsModel : {
                values : {
                    name : "Periodic Waterfall",
                    vizType : "timeseries_waterfall",
                    json : "/demands_supplies.json",
                    vizProperties : {
                        general: {
                            timePeriodStyle:[{
                                callback : function (data, extData) {
                                    return data["End of Period"] < 0;
                                }
                            }]
                        },
                        plotArea: {
                            window: {
                                start: "2016/12/29",
                                end: "2017/01/15"
                            },
                            dataLabel: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2,
                                visible: false,
                                showRecap: true
                            },
                            startValue: 10
                        },
                        valueAxis: {
                            visible: true,
                            label: {
                                formatString:ChartFormatter.DefaultPattern.SHORTFLOAT
                            },
                            title: {
                                visible: false
                            }
                        },
                        timeAxis: {
                            title: {
                                visible: false
                            }
                        },
                        legend: {
                            visible: false
                        },
                        title: {
                            visible: false
                        },
                        interaction: {
                            syncValueAxis: false
                        }
                    }
                }
        },

        oVizFrame : null,

        onInit : function (evt) {
            Format.numericFormatter(ChartFormatter.getInstance());
            var oModel = new JSONModel(this.settingsModel);
            oModel.setDefaultBindingMode(BindingMode.OneWay);
            this.getView().setModel(oModel);

            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            var dataModel = new JSONModel(this.dataPath + this.settingsModel.values.json);
            oVizFrame.setModel(dataModel);
            oVizFrame.setVizType(this.settingsModel.values.vizType);
            oVizFrame.setVizProperties(this.settingsModel.values.vizProperties);

            var oPopOver = this.getView().byId("idPopOver");
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString({
                "Demands": ChartFormatter.DefaultPattern.STANDARDFLOAT,
                "Supplies": ChartFormatter.DefaultPattern.STANDARDFLOAT
            });

            InitPageUtil.initPageSettings(this.getView());
        }
    });

    return Controller;

});
