// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview an example for a custom bootstrap plug-in which FOR USE in Selenium test
 */
(function () {
    "use strict";
    /*global jQuery, sap, localStorage, window */
    jQuery.sap.log.debug("PluginAddButtonToActionSheet - module loaded");

    jQuery.sap.declare("sap.ushell.demo.PluginAddButtonToActionSheet");

    var oRendererExtensions = jQuery.sap.getObject("sap.ushell.renderers.fiori2.RendererExtensions");

    function applyRendererExtensions() {
        jQuery.sap.log.debug("PluginAddButtonToActionSheet - inserting a sample button onto the shell's action sheet after renderer was loaded");

        if (!oRendererExtensions) {
            oRendererExtensions = jQuery.sap.getObject("sap.ushell.renderers.fiori2.RendererExtensions");
        }

        if (oRendererExtensions) {
            oRendererExtensions.addOptionsActionSheetButton(
                new sap.m.Button('newButtonId', {
                    text: 'New_Button',
                    press: function () {
                        window.alert('new_button_clicked');
                    }
                }),
                "home"
            );
            jQuery.sap.log.debug("PluginAddButtonToActionSheet - Added a sample button onto the shell's action ONLY for Home state");
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
