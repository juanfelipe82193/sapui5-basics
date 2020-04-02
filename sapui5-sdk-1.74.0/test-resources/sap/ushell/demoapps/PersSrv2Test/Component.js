// define a root UIComponent which exposes the main view
/*global sap, jQuery */
jQuery.sap.declare("sap.ushell.demo.PersSrv2Test.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.PersSrv2Test.Component", {

    oMainView : null,

    metadata : {
        manifest: "json"
    },

    createContent : function () {
        "use strict";
        var oComponentData = this.getComponentData && this.getComponentData();

        this.oMainView = sap.ui.xmlview("sap.ushell.demo.PersSrv2Test.App");

        return this.oMainView;
    }

});
