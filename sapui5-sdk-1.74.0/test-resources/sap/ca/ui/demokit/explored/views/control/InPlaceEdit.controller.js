sap.ui.controller("sap.ca.ui.sample.views.control.InPlaceEdit", {


/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
*/
    onInit : function() {
        var page = this.getView().byId("page");
        util.UiFactory.fillPageHeader(page, this.getView(), util.Title.INPLACE_EDIT, "sap.ca.ui.InPlaceEdit");
    }
});