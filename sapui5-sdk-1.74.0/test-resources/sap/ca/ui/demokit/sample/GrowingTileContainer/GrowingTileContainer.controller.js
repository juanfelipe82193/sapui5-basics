sap.ui.controller("sap.ca.ui.sample.GrowingTileContainer.GrowingTileContainer", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf views.control.GrowingTileContainer
*/
onInit: function () {
    jQuery.sap.require("sap.ui.app.MockServer");

    var oMockServer = new sap.ui.app.MockServer({
        rootUri: "/sap/hierarchicalData/"});
    oMockServer.simulate("test-resources/sap/ca/ui/demokit/sample/GrowingTileContainer/hierarchicalSelectDialogMetadata.xml");
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