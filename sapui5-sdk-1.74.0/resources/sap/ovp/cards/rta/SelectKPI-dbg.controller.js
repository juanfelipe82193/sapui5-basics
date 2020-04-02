sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"
], function (Controller, Filter, FilterOperator) {
    'use strict';

    return Controller.extend("sap.ovp.cards.rta.SelectKPI", {
        onInit: function () {

        },
        onAfterRendering: function () {

        },

        _filterTable: function (oEvent, aFields, sId) {
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

        onSearch: function (oEvent) {
            var oView = this.getView(),
                oModel = oView.getModel(),
                iLength;

            this._filterTable(oEvent, ["GroupTitle", "KPITitle", "GroupID", "KPIID", "KPIQualifier"], "KPITable");

            iLength = oView.byId("KPITable").getBinding("items").getLength();
            oModel.setProperty("/NoOfKPIItem", iLength);

            oModel.refresh(true);
        },

        onItemPress: function (oEvent) {
            var oSelectedItem = oEvent.getSource(),
                oSelectedItemContext = oSelectedItem.getBindingContext(),
                oValue = oSelectedItemContext.getObject();

            this.updateKPIItemPath(oValue, oEvent);
        }
    });
});