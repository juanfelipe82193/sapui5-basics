// define a root UIComponent which exposes the main view
/*global sap, jQuery */
jQuery.sap.declare("sap.ushell.demo.PersSrvTest.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.PersSrvTest.Component", {

    oMainView : null,

    metadata : {
        manifest: "json"
    },

    createContent : function () {
        "use strict";
        var oComponentData = this.getComponentData && this.getComponentData();

        this.oMainView = sap.ui.xmlview("sap.ushell.demo.PersSrvTest.App");

        return this.oMainView;
    }

});
