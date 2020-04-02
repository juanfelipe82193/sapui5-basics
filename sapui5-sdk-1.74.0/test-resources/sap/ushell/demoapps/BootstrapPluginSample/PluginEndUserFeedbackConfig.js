// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview Bootstrap plug-in for changing EndUserFeedback configuration
 */
(function () {
    "use strict";
    /*global jQuery, sap, localStorage, window */
    jQuery.sap.log.debug("PluginEndUserFeedbackConfig - module loaded");

    jQuery.sap.declare("sap.ushell.demo.PluginEndUserFeedbackConfig");

    var oRenderer = jQuery.sap.getObject("sap.ushell.renderers.fiori2.Renderer");

    function applyRenderer() {
        jQuery.sap.log.debug("PluginEndUserFeedbackConfig - renderer was loaded");

        if (!oRenderer) {
            oRenderer = sap.ushell.Container.getRenderer("fiori2");
        }

        if (oRenderer) {
            // Call renderer API in order to change the EndUserFeedback configuration
            oRenderer.makeEndUserFeedbackAnonymousByDefault(false);
            oRenderer.showEndUserFeedbackLegalAgreement(false);

            jQuery.sap.log.debug("PluginEndUserFeeRdbackConfig - changed EndUserFeedback configuration");
        } else {
            jQuery.sap.log.error("PluginEndUserFeedbackConfig - failed to apply renderer , because 'sap.ushell.renderers.fiori2.Renderer' not available");
        }
    }

    // the module could be loaded asynchronously, the shell does not guarantee a loading order;
    // therefore, we have to consider both cases, i.e. renderer is loaded before or after this module
    if (oRenderer) {
        // fiori renderer already loaded, apply extensions directly
        applyRenderer();
    } else {
        // fiori renderer not yet loaded, register handler for the loaded event
        sap.ui.getCore().getEventBus().subscribe("sap.ushell", "rendererLoaded", applyRenderer, this);
    }
}());
