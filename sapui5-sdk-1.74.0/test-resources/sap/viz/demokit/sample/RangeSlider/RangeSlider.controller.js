sap.ui.define([
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        'sap/ui/model/FilterOperator',
        'sap/ui/model/Filter',
        'sap/viz/ui5/data/FlattenedDataset',
        'sap/viz/ui5/controls/common/feeds/FeedItem',
        'sap/viz/ui5/controls/Popover',
        'sap/viz/ui5/controls/VizFrame',
        'sap/viz/ui5/controls/VizSlider',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
        './InitPage'
    ], function(Controller, JSONModel,  FilterOperator, Filter, FlattenedDataset, FeedItem, Popover, VizFrame, VizSlider, ChartFormatter, Format, InitPageUtil) {
    "use strict";

    var Controller = Controller.extend("sap.viz.sample.RangeSlider.RangeSlider", {

        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/date_revenue_cost",

        settingsModel : {
            values:[{
                vizType : "timeseries_column",
                json : "/timeBulletStacked.json",
                dataset : {
                    "dimensions": [{
                        "name": "Date",
                        "value": "{Date}",
                        "dataType":"Date"
                    }],
                    "measures": [{
                        "name": "Cost",
                        "value": "{Cost}"
                    }],
                    data: {
                        path: "/milk"
                    }
                },
                vizProperties: {
                    timeAxis: {
                            title: {
                                visible: false
                            }
                        },
                    plotArea: {
                        dataLabel: {
                            formatString: ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2,
                            visible: false
                        },
                        window: {
                            start:"firstDataPoint",
                            end:"lastDataPoint"
                        }
                    },
                    valueAxis: {
                        label: {
                            formatString: ChartFormatter.DefaultPattern.SHORTFLOAT
                        },
                        title: {
                            visible: false
                        }
                    },
                    title: {
                        visible: false
                    },
                    legend: {
                        visible: true
                    }
                }
            }]
        },

        onInit : function (evt) {
            Format.numericFormatter(ChartFormatter.getInstance());
            var oView = this.getView();
            var oModel = new JSONModel(this.settingsModel);
            oView.setModel(oModel);
            var bindValue = this.settingsModel.values;

            var oVizFrame = oView.byId("idVizFrame");
            oVizFrame.setVizProperties(bindValue[0].vizProperties);
            var dataModel = new JSONModel(this.dataPath + bindValue[0].json);
            oVizFrame.setModel(dataModel);
            var oPopOver = new Popover({});
            oPopOver.connect(oVizFrame.getVizUid());
            oPopOver.setFormatString({
                "Cost": ChartFormatter.DefaultPattern.STANDARDFLOAT
            });
            oVizFrame.setLayoutData(new sap.m.FlexItemData({
                    maxHeight: '90%',
                    baseSize : '100%',
                    order: 0
                })
            );

            var oRangeSlider = oView.byId("idVizSlider");
            oRangeSlider.setModel(dataModel);
            oRangeSlider.setValueAxisVisible(false);
            oRangeSlider.setShowPercentageLabel(false);
            oRangeSlider.setShowStartEndLabel(false);
            oRangeSlider.setLayoutData(new sap.m.FlexItemData({
                maxHeight: '7%',
                baseSize: '100%',
                order: 1,
                styleClass: 'rangeSliderPadding'
            }));

            oRangeSlider.attachRangeChanged(function(e){
                var data = e.getParameters().data;
                var start = data.start.Date;
                var end = data.end.Date;
                var dateFilter =  new Filter({
                    path: "Date",
                    test: function(oValue) {
                        var time = Date.parse(new Date(oValue));
                        return (time >= start && time <= end);
                    }
                });
                oVizFrame.getDataset().getBinding('data').filter([dateFilter]);
            });

            InitPageUtil.initPageSettings(oView);
        }
    });

    return Controller;

});
