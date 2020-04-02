
sap.ui.define([
    "sap/ui/core/UIComponent"
], function (UIComponent) {
    "use strict";
    return UIComponent.extend("sap.ushell.demo.FioriToExtAppTarget.Component", {

            metadata : {

                version : "1.74.0",

                library : "sap.ushell.demo.FioriToExtAppTarget",

                includes : [ ],

                dependencies : {
                    libs : [ "sap.m" ],
                    components : []
                },
                config: {
                    "title": "Fiori Sandbox Default App",
                    "icon" : "sap-icon://Fiori2/F0429"
                },

                rootView: {
                    viewName: "sap.ushell.demo.FioriToExtAppTarget.App",
                    type: "XML"
                },

                routing: {
                    config: {
                        routerClass: "sap.m.routing.Router",
                        viewType: "XML",
                        viewPath: "sap.ushell.demo.FioriToExtAppTarget",  // leave empty, common prefix
                        targetControl: "rootControl",
                        controlId: "rootControl",
                        controlAggregation: "pages"

                    },
                    routes: [
                        {
                            pattern: "", // will be the url and from has to be provided in the data
                            view : "First",
                            name: "First"
                        }
                        ,
                        {
                            pattern: "Second/{index}", // will be the url and from has to be provided in the data
                            view : "Second",
                            name: "Second"
                        }
                    ]
                }
            },

            init : function() {
                sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
                this.getRouter().initialize();
            }

    });
});


