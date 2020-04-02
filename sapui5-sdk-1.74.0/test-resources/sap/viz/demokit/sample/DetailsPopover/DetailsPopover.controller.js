sap.ui.define([
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/controls/VizTooltip',
        'sap/viz/ui5/controls/common/feeds/FeedItem',
        'sap/viz/ui5/data/DimensionDefinition',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
        './InitPage'
    ], function(Controller, JSONModel, VizTooltip, FeedItem, DimensionDefinition, ChartFormatter, Format, InitPageUtil) {
    "use strict";

    var Controller = Controller.extend("sap.viz.sample.DetailsPopover.DetailsPopover", {

        dataPath : "test-resources/sap/viz/demokit/dataset/milk_production_testing_data/revenue_cost_consume_country/1_percent",

        oVizFrame : null,

        onInit : function (evt) {
            Format.numericFormatter(ChartFormatter.getInstance());
            var formatPattern = ChartFormatter.DefaultPattern;

            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            oVizFrame.setVizProperties({
                title: {
                    visible: false
                },
                plotArea: {
                    dataLabel: {
                        formatString: formatPattern.SHORTFLOAT_MFD2,
                        visible: true,
                        hideWhenOverlap: true
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
                sizeLegend: {
                    formatString:formatPattern.SHORTFLOAT_MFD2,
                    title: {
                        visible: true
                    }
                }
            });
            var dataModel = new JSONModel(this.dataPath + "/medium.json");
            oVizFrame.setModel(dataModel);

            var oTooltip = new VizTooltip({});
            oTooltip.connect(oVizFrame.getVizUid());
            oTooltip.setFormatString(formatPattern.STANDARDFLOAT);

            InitPageUtil.initPageSettings(this.getView());
            oVizFrame.getDataset().setContext("Store Name");
        }
    });

    return Controller;

});