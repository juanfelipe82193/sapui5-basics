/*global sap, jQuery, JSONModel*/
(function () {
    "use strict";
    sap.ui.controller("sap.ushell.demo.AppStateSample.Main", {
        /**
        * Called when a controller is instantiated and its View controls (if available) are already created.
        * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
        * @memberOf Main
        */
        onInit: function () {
            var listView =  sap.ui.view({ type: sap.ui.core.mvc.ViewType.XML,
                viewName: "sap.ushell.demo.AppStateSample.view.List",
                id : "List"
                }),
                oApp = this.byId("app");
            oApp.addMasterPage(listView);
        },

    /**
    * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
    * (NOT before the first rendering! onInit() is used for that one!).
    * @memberOf Main
    */
    // onBeforeRendering: function() {
    //
    //},

    /**
    * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
    * This hook is the same one that SAPUI5 controls get after being rendered.
    * @memberOf Main
    */
    //onAfterRendering: function() {
    //
    //},

    /**
    * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
    * @memberOf Main
    */
        onExit: function () {
            jQuery.sap.log.info("Main view destroyed");
        }
    });
}());