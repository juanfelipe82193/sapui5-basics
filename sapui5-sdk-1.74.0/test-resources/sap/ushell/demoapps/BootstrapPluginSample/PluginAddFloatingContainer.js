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

    jQuery.sap.declare("sap.ushell.demo.PluginAddFloatingContainer");
    // register
    sap.ui.getCore().getEventBus().subscribe("launchpad", "shellFloatingContainerIsDocked", _onDock, this);
    sap.ui.getCore().getEventBus().subscribe("launchpad", "shellFloatingContainerIsAccessible",_onAccessible );
    sap.ui.getCore().getEventBus().subscribe("launchpad", "shellFloatingContainerIsUnDocked", _onUnDock, this);

    //This function implement logic for un-dock event
    function _onUnDock() {
        jQuery("#ContentPage").removeClass("sapUshellShellFloatingContainerFullHeight");
    }

    //This function implement logic for dock event
    function _onDock() {
        jQuery("#ContentPage").addClass("sapUshellShellFloatingContainerFullHeight");
    }

    //This function implement logic for accesablity events
    function _onAccessible(){
        var oFloatingContainer = document.getElementById("shell-floatingContainer");
        oFloatingContainer.focus();
    }

    var bContainerVisible = false,
        oRenderer = jQuery.sap.getObject("sap.ushell.renderers.fiori2.Renderer");

    function applyRenderer() {
        var oContent,
            getRenderer = function () {
                if (!oRenderer) {
                    oRenderer = sap.ushell.Container.getRenderer("fiori2");
                }
            },
            applyContentStyles = function () {
                var style = document.createElement('style');

                style.type = 'text/css';
                style.innerHTML = ".listCSSClass {background: rgba(187, 230, 211, .25); height: 220px; padding: 5px; }";
                style.innerHTML += ".listCSSClass section {position: relative}";
                document.getElementsByTagName('head')[0].appendChild(style);
            },

            getContainerContent = function () {
                // On click, the toggles the FloatingContainer's visibility (i.e. closes the container)
                    var oExitButton = new sap.m.ActionListItem("ExitButton", {
                        text: "Exit",
                        press: function (oEvent) {
                            oRenderer.setFloatingContainerVisibility(!bContainerVisible);
                            bContainerVisible = !bContainerVisible;
                        }
                    }),
                    oContentList = new sap.m.List("ContentList", {
                        items: [oExitButton]
                    }),
                    oFlotingContainerPage = new sap.m.Page("ContentPage", {
                        content: [oContentList],
                        title: "Header of a Page"
                    }).addStyleClass("listCSSClass");

                applyContentStyles();
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
                    var state = oRenderer.getFloatingContainerState();
                    if(state.indexOf("docked") != -1){
                        jQuery("#ContentPage").addClass("sapUshellShellFloatingContainerFullHeight");
                    }
                }
            }, true, false, ["home", "app"]);

            oContent = getContainerContent();

            // Setting the content of the Floating Container for the states "home" and "app"

            // The content is added to the container only in the current state
            //oRenderer.setFloatingContainerContent(oContent, true);

            // The content is added to the container in "home" and "app" states
            //oRenderer.setFloatingContainerContent(oContent, false , ["home", "app"]);

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
