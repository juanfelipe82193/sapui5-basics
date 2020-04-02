// define a root UIComponent which exposes the main view
/*global sap, jQuery, JSONModel*/
jQuery.sap.declare("sap.ushell.demo.AppNavSample2.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.AppNavSample2.Component", {
    metadata: {
        "manifest": "json"
    },

    getAutoPrefixId : function() {
        return true;
    },

    createContent : function() {

        var oMainView = sap.ui.view({
            type : sap.ui.core.mvc.ViewType.XML,
            viewName : "sap.ushell.demo.AppNavSample2.Main",
        });

        return oMainView;
    },

    init : function() {
        sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

        // this component should automatically initialize the router!
        this.getRouter().initialize();

        // trigger direct inner-app navigation if intent parameter navTo set
        // we use this for testing the correct stopping of the previous app's
        // router upon cross-app navigation
        var oStartupParameters = this.getComponentData().startupParameters,
            sNavTo = oStartupParameters && oStartupParameters.navTo && oStartupParameters.navTo[0];

        if (sNavTo) {
            this.getRouter().navTo(sNavTo, null, true);
        }
    }

});

