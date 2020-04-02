// define a root UIComponent which exposes the main view
/*global sap, jQuery, JSONModel*/
jQuery.sap.declare("sap.ushell.demo.AppContextSample.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.AppContextSample.Component", {

    oMainView : null,

    // use inline declaration instead of component.json to save 1 round trip
    metadata : {

        version : "1.74.0",

        library : "sap.ushell.demo.AppContextSample",

        dependencies : {
            libs : [ "sap.m" ],
            components : []
        },
        config: {
            "title": "App Context Sample",
            //"resourceBundle" : "i18n/i18n.properties",
            //"titleResource" : "shellTitle",
            "icon" : "sap-icon://Fiori2/F0429"
        }
    // properties : {
    // // the shell passes application startup parameters using the
    // // componentData object
    // componentData : {
    // type : "object"
    // }
    // }
    },

    createContent : function () {
        "use strict";
        var oComponentData = this.getComponentData && this.getComponentData();
        jQuery.sap.log.info("sap.ushell.demo.AppNavSample: app was started with parameters " + JSON.stringify(oComponentData.startupParameters || {}));
        this.sFruitFavsContextKey = (oComponentData.startupParameters && oComponentData.startupParameters.fruitfavscontextkey && oComponentData.startupParameters.fruitfavscontextkey[0]) || "";
        this.oMainView = sap.ui.xmlview("sap.ushell.demo.AppContextSample.App");
        /* *StartupParameters* (2)   */
        /* http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#Action-toappnavsample?AAA=BBB&DEF=HIJ */
        /* results in   { AAA : [ "BBB"], DEF: ["HIJ"] }  */
        return this.oMainView;
    }

});
