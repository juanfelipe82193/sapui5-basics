/**
 * Test/Example for the FLP FloatingContainer feature.
 *
 * This is an implementation of a bootstrap plugin that addresses fiori2 renderer API
 * in order to set the floating container's content and set its visibility.
 *
 * Main functionality:
 *  - Adding an activation button to the shell header (A HeaderEndItem with id "FloatingContainerButton")
 *    that shows/hides the floating container using the renderer API function setFloatingContainerVisibility
 *  - Creating a sap.m.List (id: "ContentList") that contains the items displayed in the floating container
 *    (NotificationListItems, and a Button)
 *  - A sap.m.Page (id "ContentPage") that contains the list and is the actual UI control that is set as the floating container's content.
 *    and that contains the list.
 *  - The style class listCSSClass is added in order to give ContentPage a background that distinguishes it (visually) from the FLP canvas
 *
 */
(function () {
    "use strict";
    /*global jQuery, sap, localStorage, window */
    jQuery.sap.log.debug("PluginAddFloatingContainer - module loaded");

    jQuery.sap.declare("sap.ushell.demo.PluginAddMinimalFloatingContainer");

    var bContainerVisible = false,
        oRenderer = jQuery.sap.getObject("sap.ushell.renderers.fiori2.Renderer");

    function applyRenderer() {
        var oContent,
            getRenderer = function () {
                if (!oRenderer) {
                    oRenderer = sap.ushell.Container.getRenderer("fiori2");
                }
            },

            getContainerContent = function () {
                var oFlotingContainerPage = new sap.m.Page("ContentPage", {
                    content: [new sap.m.Button("button")],
                    title: "Header of a Page"
                }).addStyleClass("listCSSClass");

                oFlotingContainerPage.setShowHeader(true);
                return oFlotingContainerPage;
            };

        if (!getRenderer()) {
            oRenderer = sap.ushell.Container.getRenderer("fiori2");
        }
        if (oRenderer) {
            bContainerVisible = oRenderer.getFloatingContainerVisiblity();
            // A shell header button that controls the visibility of the Floating Container
            oRenderer.addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem", {
                id: "FloatingContainerButton",
                icon: "sap-icon://S4Hana/S0011",
                press: function (oEvent) {
                    oRenderer.setFloatingContainerDragSelector("#ContentPage-intHeader");
                    oRenderer.setFloatingContainerVisibility(!bContainerVisible);
                    bContainerVisible = !bContainerVisible;
                }
            }, true, false, ["home", "app"]);

            oContent = getContainerContent();

            // The content is added to the container in all states
            oRenderer.setFloatingContainerContent(oContent, false);
        } else {
            jQuery.sap.log.error("BootstrapPluginSample - failed to apply renderer extensions, because 'sap.ushell.renderers.fiori2.RendererExtensions' not available");
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
