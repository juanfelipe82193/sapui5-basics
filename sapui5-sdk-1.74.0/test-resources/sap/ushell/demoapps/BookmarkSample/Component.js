/*
 * Copyright (C) 2015 SAP AG or an SAP affiliate company. All rights reserved
 */

//define a root UIComponent which exposes the main view
jQuery.sap.declare("sap.ushell.demo.bookmark.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

//new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.bookmark.Component", {
    metadata : {
        "manifest": "json"
    },

    /**
     *  Initialize the application
     *  @returns {sap.ui.core.Control} the content
     */
    createContent: function() {
        jQuery.sap.log.info("sap.ushell.demo.bookmark: Component.createContent");
        this.oMainView = sap.ui.xmlview("sap.ushell.demo.bookmark.bookmark");
        return this.oMainView;
    }

});
