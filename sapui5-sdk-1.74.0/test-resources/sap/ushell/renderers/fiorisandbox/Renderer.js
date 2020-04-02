// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The SAPUI5 component of SAP's Fiori sandbox renderer for the Unified Shell.
 *
 * @version 1.74.0
 */
/**
 * @namespace Namespace for SAP's Fiori sandbox renderer for the Unified Shell. The renderer consists
 * of an SAPUI5 component called <code>sap.ushell.renderers.sandbox.Renderer</code>.
 *
 * @name sap.ushell.renderers.fiorisandbox
 * @see sap.ushell.renderers.fiorisandbox.Renderer
 * @since 1.15.0
 * @private
 */
(function () {
    "use strict";
    /*global jQuery, sap */
    jQuery.sap.declare("sap.ushell.renderers.fiorisandbox.Renderer");

    jQuery.sap.require("sap.ui.core.UIComponent");
    jQuery.sap.require("sap.ushell.services.ShellNavigation");
    /**
     * This method MUST be called by the Unified Shell's container only, others MUST call
     * <code>
     * sap.ushell.Container.createRenderer("sap.ushell.renderers.fiorisandbox.Renderer")
     * </code>.
     *
     * @class The SAPUI5 component of the Fiori sandbox renderer for the Unified Shell.
     *
     * @extends sap.ui.core.UIComponent
     * @name sap.ushell.renderers.fiorisandbox.Renderer
     * @see sap.ushell.services.Container#createRenderer
     * @since 1.15.0
     */
    sap.ui.core.UIComponent.extend("sap.ushell.renderers.fiorisandbox.Renderer", {
        metadata : {
            version : "1.74.0",
            dependencies : {
                version : "1.74.0",
                libs : [ "sap.ui.core" ],
                components: []
            }
        }
    });

    /**
     * *TODO*
     *
     * @returns *TODO*
     *
     * @methodOf sap.ushell.renderers.fiorisandbox.Renderer#
     * @name createContent
     * @since 1.15.0
     *
     * @private
     */
    sap.ushell.renderers.fiorisandbox.Renderer.prototype.createContent = function () {
        return sap.ui.view({
            type: sap.ui.core.mvc.ViewType.XML,
            viewName: "sap.ushell.renderers.fiorisandbox.Shell",
            viewData: this.getComponentData()
        });
    };
}());