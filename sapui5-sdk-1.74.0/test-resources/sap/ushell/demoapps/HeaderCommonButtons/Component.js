(function () {
    "use strict";

    /*global jQuery, sap */
    jQuery.sap.declare("sap.ushell.demo.HeaderCommonButtons.Component");
    jQuery.sap.require("sap.ui.core.Component");

    // new Component
    sap.ui.core.Component.extend("sap.ushell.demo.HeaderCommonButtons.Component", {

        metadata: {
            version: "1.74.0",
            library: "sap.ushell.demo.HeaderCommonButtons"
        },
        init: function () {
            sap.ushell.Container.getRenderer("fiori2").addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem",
                {
                    id: "xraybtn",
                    tooltip: "This button simulates the xray help",
                    icon: "sap-icon://sys-help",
                    visible: true,
                    showSeparator: false,
                },
                true,
                false);

            sap.ushell.Container.getRenderer("fiori2").addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem",
                {
                    id: "copilotBtn",
                    tooltip: "This button simulates CoPilot",
                    icon: "sap-icon://co",
                    visible: true,
                    showSeparator: false,
                },
                true,
                false);
        }
    });
})();
