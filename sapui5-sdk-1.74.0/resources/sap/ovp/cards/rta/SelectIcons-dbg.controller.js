sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"
], function(Controller, Filter, FilterOperator) {
    'use strict';

    return Controller.extend("sap.ovp.cards.rta.SelectIcons", {
        onInit : function() {

        },
        onAfterRendering : function() {

        },

        _filterTable : function (oEvent, aFields, sId) {
            var sQuery = oEvent.getParameter("query"),
                oGlobalFilter = null,
                aFilters = [];

            for (var i = 0; i < aFields.length; i++) {
                aFilters.push(new Filter(aFields[i], FilterOperator.Contains, sQuery));
            }

            if (sQuery) {
                oGlobalFilter = new Filter(aFilters, false);
            }

            this.getView().byId(sId).getBinding("items").filter(oGlobalFilter, "Application");
        },

        filterTable : function (oEvent) {
            var oView = this.getView(),
                oModel = oView.getModel(),
                sTableName = oModel.getProperty("/tableName"),
                iLength;

            if (sTableName === "IconTable") {
                this._filterTable(oEvent, ["Icon", "Name"], "IconTable");

                iLength = oView.byId("IconTable").getBinding("items").getLength();
                oModel.setProperty("/NoOfIcons", iLength);
            } else if (sTableName === "ImageTable") {
                this._filterTable(oEvent, ["Name"], "ImageTable");

                iLength = oView.byId("ImageTable").getBinding("items").getLength();
                oModel.setProperty("/NoOfImages", iLength);
            }

            oModel.refresh(true);
        },

        onItemPress : function (oEvent) {
            var oSelectedItem = oEvent.getSource(),
                oSelectedItemContext = oSelectedItem.getBindingContext(),
                oModel = this.getView().getModel(),
                sTableName = oModel.getProperty("/tableName"),
                sUri;

            if (sTableName === "IconTable") {
                sUri = oSelectedItemContext.getProperty("Icon");
            } else if (sTableName === "ImageTable") {
                sUri = oSelectedItemContext.getProperty("Image");
            }

            this.updateIconPath(sUri);
        },

        onSelectionChange : function (oEvent) {
            var sKey = oEvent.getParameter("item").getKey(),
                oModel = this.getView().getModel();

            oModel.setProperty("/tableName", sKey);
            oModel.refresh(true);
        }
    });
});