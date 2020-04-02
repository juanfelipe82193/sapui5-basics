(function () {
    "use strict";
    /*global jQuery, sap, localStorage, window */
    jQuery.sap.log.debug("PluginAddToolAreaWithTextOnly - module loaded");

    jQuery.sap.declare("sap.ushell.demo.PluginAddToolAreaWithTextOnly");

    var oRenderer = sap.ushell.Container.getRenderer("fiori2");

    function applyRenderer() {
        jQuery.sap.log.debug("PluginAddToolAreaWithTextOnly - inserting a sample button onto the shell's side bar after renderer was loaded");

        if (!oRenderer) {
            oRenderer = sap.ushell.Container.getRenderer("fiori2");
        }

        if (oRenderer) {
            oRenderer.addToolAreaItem(
                {
                    id: 'sideBarButton',
                    //icon: "sap-icon://documents",
                    text: "Overview",
                    expandable: false,
                    press: function (evt) {
                        window.alert('Press' );
                    },
                    expand: function (evt) {
                        window.alert('Expand' );
                    }
                }, true, false, ["home"]);
            oRenderer.addToolAreaItem(
                {
                    id: 'sideBarButton1',
                    //icon: "sap-icon://newspaper",
                    expandable: false,
                    text: "Destinations",
                    press: function (evt) {
                        window.alert('Press' );
                    },
                    expand: function (evt) {
                        window.alert('Expand' );
                    }
                }, true, false, ["home", "app"]);
            oRenderer.addToolAreaItem(
                {
                    id: 'sideBarButton2',
                    //icon: "sap-icon://settings",
                    expandable: false,
                    text: "Logging",
                    press: function (evt) {
                        window.alert('Press' );
                    }
                }, true, false, ["home", "app"]);
            oRenderer.addToolAreaItem(
                {
                    id: 'sideBarButton3',
                    //icon: "sap-icon://wrench",
                    expandable: false,
                    text: "Data Source Binding",
                    press: function (evt) {
                        window.alert('Press' );
                    },
                    expand: function (evt) {
                        window.alert('Expand' );
                    }
                }, true, false, ["home", "app"]);
            oRenderer.addToolAreaItem(
                {
                    id: 'sideBarButton4',
                    //icon: "sap-icon://employee-approvals",
                    expandable: false,
                    text: "Roles",
                    press: function (evt) {
                        window.alert('Press' );
                    }
                }, true, false, ["home", "app"]);
            oRenderer.addToolAreaItem(
                {
                    id: 'sideBarButton5',
                    //icon: "sap-icon://employee-approvals",
                    expandable: false,
                    text: "JMX Console",
                    press: function (evt) {
                        window.alert('Press' );
                    }
                }, true, false, ["home", "app"]);
            oRenderer.addToolAreaItem(
                {
                    id: 'sideBarButton6',
                    //icon: "sap-icon://employee-approvals",
                    expandable: false,
                    text: "Resources",
                    press: function (evt) {
                        window.alert('Press' );
                    }
                }, true, false, ["home", "app"]);
            oRenderer.addToolAreaItem(
                {
                    id: 'sideBarButton7',
                    //icon: "sap-icon://employee-approvals",
                    expandable: false,
                    text: "Performance Statistics",
                    press: function (evt) {
                        window.alert('Press' );
                    }
                }, true, false, ["home", "app"]);
            oRenderer.addToolAreaItem(
                {
                    id: 'sideBarButton8',
                    //icon: "sap-icon://employee-approvals",
                    expandable: false,
                    text: "Monitoring",
                    press: function (evt) {
                        window.alert('Press' );
                    }
                }, true, false, ["home", "app"]);
            oRenderer.addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem", {
                tooltip: "Sample Shell Header Item",
                icon: sap.ui.core.IconPool.getIconURI("action-settings"),
                press: function () {
                    sap.m.MessageToast.show("Sample shell header item pressed");
                }
            }, true, false, ["home", "app"]);

            oRenderer.addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem", {
                tooltip: "Sample Shell Header Item",
                icon: sap.ui.core.IconPool.getIconURI("sys-help"),
                press: function () {
                    sap.m.MessageToast.show("Sample shell header item pressed");
                }
            }, true, false, ["home", "app"]);

            oRenderer.addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem", {
                tooltip: "Sample Shell Header Item",
                icon: sap.ui.core.IconPool.getIconURI("marketing-campaign"),
                press: function () {
                    sap.m.MessageToast.show("Sample shell header item pressed");
                }
            }, true, false, ["home", "app"]);
            oRenderer.addHeaderItem("sap.ushell.ui.shell.ShellHeadItem", {
                id: "toggleToolArea",
                icon: sap.ui.core.IconPool.getIconURI("menu2"),
                press: function (oEvent) {
                    var oSource = oEvent.getSource(),
                        bState = oSource.getModel().getProperty("/currentState/toolAreaVisible");
                    var oRenderer = sap.ushell.Container.getRenderer("fiori2");
                    oRenderer.showToolArea("home", !bState);
                    oRenderer.showToolArea("app", !bState);
                }
            }, true, true);

            oRenderer.setHeaderTitle("SAP HANA Cloud Platform Cockpit")

            jQuery.sap.log.debug("PluginAddToolAreaWithTextOnly - Added a sample button onto the shell's side bar ONLY for Home state");
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

