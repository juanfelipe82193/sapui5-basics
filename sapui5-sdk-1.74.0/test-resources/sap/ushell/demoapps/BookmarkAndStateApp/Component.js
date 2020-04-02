// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
jQuery.sap.declare("sap.ushell.demo.bookmarkstate.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

//new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.bookmarkstate.Component", {

    metadata : {

        version : "1.74.0",

        library : "sap.ushell.demo.bookmarkstate",

        includes : [ ],

        dependencies : {
            libs : [ "sap.m" ],
            components : []
        },
        config: {
            "title": "Bookmark With State",
            fullWidth: true
        }
    },

    createContent: function() {
        return sap.ui.xmlview("sap.ushell.demo.bookmarkstate.bookmark");
    }
});
