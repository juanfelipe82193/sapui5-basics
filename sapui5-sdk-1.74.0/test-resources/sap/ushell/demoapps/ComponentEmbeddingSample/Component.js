// define a root UIComponent which exposes the main view
/*global sap, jQuery, JSONModel, setTimeout*/

(function () {
    "use strict";
    jQuery.sap.declare("sap.ushell.demo.ComponentEmbeddingSample.Component");
    jQuery.sap.require("sap.ui.core.UIComponent");

    sap.ui.core.UIComponent.extend("sap.ushell.demo.ComponentEmbeddingSample.Component", {

        // use inline declaration instead of component.json to save 1 round trip
        metadata : {
            "manifest": "json"
        },

        createContent : function () {
            this.oMainView = sap.ui.view({
                type : sap.ui.core.mvc.ViewType.JS,
                viewName : "sap.ushell.demo.ComponentEmbeddingSample.Main"
            });
            return this.oMainView;
        },

        /**
         * Initialization phase of component
         *
         * @private
         */
//        init : function () {
//            debugger;
//        }

    });
}());
