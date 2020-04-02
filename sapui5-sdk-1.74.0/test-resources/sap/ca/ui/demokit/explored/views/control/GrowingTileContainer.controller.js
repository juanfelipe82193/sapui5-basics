sap.ui.controller("views.control.GrowingTileContainer", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf views.control.GrowingTileContainer
     */
    onInit: function () {
        util.UiFactory.fillPageHeader(this.byId("page"), this.getView(), util.Title.GROWING_TILE_CONTAINER, "sap.ca.ui.GrowingTileContainer");

        jQuery.sap.require("sap.ui.app.MockServer");

        var oMockServer = new sap.ui.app.MockServer({
            rootUri: "/sap/hierarchicalData/"});
        oMockServer.simulate("views/control/models/hierarchicalSelectDialogMetadata.xml");
        oMockServer.start();

        var m = new sap.ui.model.odata.ODataModel("/sap/hierarchicalData/", true);
        this.getView().setModel(m, "odata");

    },

    _onSearch: function (oEvent) {
        var growingTile = this.byId('growingTile');
        var binding = growingTile.getBinding('content');
        var v = oEvent.getParameters().query;
        var aFilters = [new sap.ui.model.Filter("Title", sap.ui.model.FilterOperator.Contains, v)];
        binding.filter(aFilters);
    }
});