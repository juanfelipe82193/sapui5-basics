// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview an example for a custom bootstrap plug-in
 */
(function () {
    "use strict";
    /*global jQuery, sap, localStorage, window */
    jQuery.sap.log.debug("BootstrapPluginSample - module loaded");

    jQuery.sap.declare("sap.ushell.demo.BootstrapPluginSample");

    var oRendererExtensions = jQuery.sap.getObject("sap.ushell.renderers.fiori2.RendererExtensions");

    function applyRendererExtensions() {
        jQuery.sap.log.debug("BootstrapPluginSample - inserting a sample button onto the shell header after renderer was loaded");

        if (!oRendererExtensions) {
            oRendererExtensions = jQuery.sap.getObject("sap.ushell.renderers.fiori2.RendererExtensions");
        }

        if (oRendererExtensions) {
            oRendererExtensions.addHeaderItem(new sap.ushell.ui.shell.ShellHeadItem({
                tooltip: "Sample Shell Header Item",
                icon: sap.ui.core.IconPool.getIconURI("example"),
                press: function () {
                    sap.m.MessageToast.show("Sample shell header item pressed");
                }
            }));
        } else {
            jQuery.sap.log.error("BootstrapPluginSample - failed to apply renderer extensions, because 'sap.ushell.renderers.fiori2.RendererExtensions' not available");
        }
    }

    // the module could be loaded asynchronously, the shell does not guarantee a loading order;
    // therefore, we have to consider both cases, i.e. renderer is loaded before or after this module
    if (oRendererExtensions) {
        // fiori renderer already loaded, apply extensions directly
        applyRendererExtensions();
    } else {
        // fiori renderer not yet loaded, register handler for the loaded event
        sap.ui.getCore().getEventBus().subscribe("sap.ushell", "rendererLoaded", applyRendererExtensions, this);
    }

}());
