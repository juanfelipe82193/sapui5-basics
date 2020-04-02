// define a root UIComponent which exposes the main view
/*global sap, jQuery, JSONModel, setTimeout*/

(function () {
    "use strict";
    jQuery.sap.declare("sap.ushell.demo.PluginAddUsageAnalyticsCustomMessage.Component");
    jQuery.sap.require("sap.ui.core.UIComponent");

    sap.ui.core.UIComponent.extend("sap.ushell.demo.PluginAddUsageAnalyticsCustomMessage.Component", {

        // use inline declaration instead of component.json to save 1 round trip
        metadata : {
            "manifest": "json"
        },

        createContent : function () {
            jQuery.sap.require("sap.ui.model.resource.ResourceModel");

            var oModel = new sap.ui.model.json.JSONModel(),
                i18n = this.getModel("i18n").getResourceBundle();

            sap.ushell.Container.getService("UsageAnalytics").setLegalText(i18n.getText("legal_message"));
        },
        /**
         * Initialization phase of component
         *
         * @private
         */
//        init : function () {
//        }

    });
}());
