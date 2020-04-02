/*global sap, jQuery */
// define a root UIComponent which exposes the main view
jQuery.sap.declare("sap.ushell.demo.AppShellUIServiceSample.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.AppShellUIServiceSample.Component", {
    oMainView : null,
    metadata: {
        manifest: "json"
    },
    createContent : function () {
        "use strict";
        this.oMainView = sap.ui.xmlview("sap.ushell.demo.AppShellUIServiceSample.App");
        return this.oMainView;
    }

});
