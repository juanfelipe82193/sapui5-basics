sap.ui.define([
    "sap/ui/demo/nav/controller/BaseController",
    "sap/ui/core/Item",
    "sap/ui/core/routing/History",
    "sap/ui/core/routing/HashChanger"
], function (BaseController, Item, History, HashChanger) {
    "use strict";


    return BaseController.extend("sap.ui.demo.nav.controller.App", {

        onInit: function () {
            // This is ONLY for being used within the tutorial.
            // The default log level of the current running environment may be higher than INFO,
            // in order to see the debug info in the console, the log level needs to be explicitly
            // set to INFO here.
            // But for application development, the log level doesn't need to be set again in the code.
            jQuery.sap.log.setLevel(jQuery.sap.log.Level.INFO);
        }
    });

});
