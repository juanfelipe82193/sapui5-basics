// define a root UIComponent which exposes the main view
/*global sap, jQuery, JSONModel*/
jQuery.sap.declare("sap.ushell.demo.UserDefaults.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.UserDefaults.Component", {

    metadata : {
        manifest: "json"
    },

    getAutoPrefixId : function() {
        return true;
    },

    createContent : function() {

        var oMainView = sap.ui.view({
            type : sap.ui.core.mvc.ViewType.XML,
            viewName : "sap.ushell.demo.UserDefaults.view.Main"
        });

        return oMainView;
    },

    init : function() {
        sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

        // this component should automatically initialize the router!
        this.getRouter().initialize();
    }

});

