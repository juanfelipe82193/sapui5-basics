// Copyright (C) 2015 SAP SE or an SAP affiliate company. All rights reserved
(function () {
    "use strict";
    /*global jQuery, sap*/
    // define a root UIComponent which exposes the main view
    jQuery.sap.declare("sap.ca.scfld.stableids.app.Component");
    jQuery.sap.require("sap.ca.scfld.stableids.app.Configuration");
    jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

    sap.ca.scfld.md.ComponentBase.extend("sap.ca.scfld.stableids.app.Component", {
        metadata : sap.ca.scfld.md.ComponentBase.createMetaData("MD", {
            "name" : "Master Detail Sample",
            "version" : "1.0.0",
            "library" : "sap.ca.scfld.stableids.app",
            "includes" : [],
            "dependencies" : {
                "libs" : ["sap.m", "sap.me"],
                "components" : []
            },
            "config" : {
                "resourceBundle" : "i18n/i18n.properties",
                "titleResource" : "shellTitle",
                "icon" : "sap-icon://Fiori2/F0002"
            },

            viewPath : "sap.ca.scfld.stableids.app.view",
            masterPageRoutes : {
                "master" : { // master is the name of the route
                    "pattern" : "", // will be the url and from has to be provided in the data
                    "view" : "S2",
                    "viewId": "test_S2"
                }
            },
            detailPageRoutes : {
                "detail" : {
                    "pattern" : "detail/{contextPath}",
                    "view" : "S3",
                    "viewId": "test_S3"
                },
                "noData" : {
                    "pattern" : "noData/{viewTitle}/{languageKey}",
                    "viewPath" : "sap.ca.scfld.md.view",
                    "view" : "empty",
                    "viewId": "test_Empty"
                }
            },
            fullScreenPageRoutes : {
                "subDetail" : {
                    "pattern" : "subDetail/{contextPath}",
                    "view" : "S4",
                    "viewId": "test_S4"
                }
            }
        }),

        /**
         * Initialize the application
         *
         * @returns {sap.ui.core.Control} the content
         */
        createContent: function () {

            var oViewData = {
                component : this
            };

            return sap.ui.view({
                viewName : "sap.ca.scfld.stableids.app.Main",
                id : "sap.ca.scfld.stableids.app.Main",
                type : sap.ui.core.mvc.ViewType.XML,
                viewData : oViewData
            });
        }
    });
}());