sap.ui.define([ "sap/ui/core/mvc/Controller", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"
], function(Controller, Filter, FilterOperator) {
    'use strict';

    return Controller.extend("sap.ovp.cards.rta.SelectLinks", {
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
                iLength;

            this._filterTable(oEvent, ["name", "value"], "LinkTable");

            iLength = oView.byId("LinkTable").getBinding("items").getLength();
            oModel.setProperty("/NoOfLinks", iLength);

            oModel.refresh(true);
        },

        onItemPress : function (oEvent) {
            var oSelectedItem = oEvent.getSource(),
                oSelectedItemContext = oSelectedItem.getBindingContext(),
                sIntent = oSelectedItemContext.getProperty("value");

            this.updateLinkPath(sIntent);
        }
    });
});