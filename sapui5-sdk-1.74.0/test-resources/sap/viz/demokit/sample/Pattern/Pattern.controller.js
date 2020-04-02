sap.ui.define([
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/data/FlattenedDataset',
        'sap/viz/ui5/controls/common/feeds/FeedItem',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
        './InitPage',
        './LinePattern',
        './ColumnPattern',
        './BarPattern',
        './BulletPattern',
        './CombinationPattern'
    ], function(Controller, JSONModel, FlattenedDataset, FeedItem, ChartFormatter, Format,
        InitPageUtil, LinePattern, ColumnPattern, BarPattern, BulletPattern, CombinationPattern) {
    "use strict";

    var Controller = Controller.extend("sap.viz.sample.Pattern.Pattern", {

        settingsModel : {
            chartType : {
                name: "Chart Type",
                defaultSelected : 2,
                values : [{
                    key: "0",
                    name : "Column & Stacked Column"
                },{
                    key: "1",
                    name : "Bar & Stacked Bar"
                },{
                    key: "2",
                    name : "Line"
                },{
                    key: "3",
                    name : "Bullet Horizontal & Vertical"
                },{
                    key: "4",
                    name : "Combined Col & Line"
                }]
            }
        },

        oSimpleForm : null,


        onInit : function (evt) {
            Format.numericFormatter(ChartFormatter.getInstance());

            var oView = this.getView();

            var oModel = new JSONModel(this.settingsModel);
            oView.setModel(oModel);

            var oSimpleForm = this.oSimpleForm = oView.byId("SimpleFormDisplay");
            oSimpleForm.addStyleClass("settingsFormGrid");

            LinePattern.lineSettings(oView);

            InitPageUtil.initPageSettings(oView);
        },
        onAfterRendering : function(){
            var oView = this.getView();
            var chartTypeSelection = oView.byId('chartTypeSelect');
            chartTypeSelection.setSelectedKey('2');
        },
        onChartTypeChanged : function(oEvent){
            if (this.oSimpleForm){
                var selectedKey = this.chart = parseInt(oEvent.getSource().getSelectedKey());

                this.oSimpleForm.destroyContent();
                this.oSimpleForm.destroyTitle();

                var oView = this.getView();

                switch (selectedKey){
                    case 0:
                        ColumnPattern.ColumnSettings(oView);
                        break;
                    case 1:
                        BarPattern.BarSettings(oView);
                        break;
                    case 2:
                        LinePattern.lineSettings(oView);
                        break;
                    case 3:
                        BulletPattern.BulletSettings(oView);
                        break;
                    case 4:
                        CombinationPattern.CombinationSettings(oView);
                        break;
                }
            }
        }
    });

    return Controller;

});