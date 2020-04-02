(function () {
    "use strict";

    /*global jQuery, sap */
    jQuery.sap.declare("sap.ushell.demo.HelloWorldPluginSample.Component");
    jQuery.sap.require("sap.ui.core.Component");

    sap.ui.core.Component.extend("sap.ushell.demo.HelloWorldPluginSample.Component", {

        metadata : {
            "manifest": "json"
        },

        init: function () {
            _forceLogInfo("HelloWorldPluginSample initialized");

            // just for demo - do NOT directly trigger UI actions for productive plug-ins
            // ui5 is available, but DOM might not be ready yet
            if (sap.ui.getCore().isInitialized()) {
                this._sayHello();
            } else {
                sap.ui.getCore().attachInit(this._sayHello.bind(this));
            }
        },

        _sayHello: function() {
            var oConfig = this.getComponentData().config,
                sMessage = (oConfig && oConfig.message) || "Hello World from SAP Fiori launchpad plug-in",
                iDuration = oConfig && oConfig.duration;

            sap.m.MessageToast.show(sMessage, {
                duration: iDuration
            });
        }
    });

    // private helper to ensure that a message is logged with INFO level
    function _forceLogInfo(sMessage) {
        var iCurrentLogLevel = jQuery.sap.log.getLevel();

        if (iCurrentLogLevel < jQuery.sap.log.Level.INFO) {
            jQuery.sap.log.setLevel(jQuery.sap.log.Level.INFO);
            jQuery.sap.log.info(sMessage, undefined, "sap.ushell.demo.HelloWorldPluginSample.Component");
            jQuery.sap.log.setLevel(iCurrentLogLevel);
        } else {
            jQuery.sap.log.info(sMessage, undefined, "sap.ushell.demo.HelloWorldPluginSample.Component");
        }
    }
})();
