// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * This component wraps the FLP sandbox and handles the life cycle for the test execution. It allows
 * OPA5 to execute the FLP as component rather than running it in an iFrame. This speeds up the test
 * execution as the UI core need not to be started again for each test.
 */
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ushell/opa/flpSandbox/flpSandbox"
], function (UIComponent, oFlpSandbox) {
    "use strict";
    return UIComponent.extend("sap.ushell.opa.flpSandbox.Component", {
        /**
         * The component is initialized by OPA5 automatically during the startup of each test and calls the init method once.
         * @protected
         * @override
         */
        init : function () {
            var oComponentData = this.getComponentData() || {};
            oFlpSandbox.init(oComponentData.adapter, oComponentData.ushellConfig, oComponentData.overrideDefault);
        },
        /**
         * Place the sandbox in the rendered div by the component
         * @protected
         * @override
         */
        onAfterRendering: function () {
            var sId = this.getId() + "-uiarea";
            createRootDomElement(sId, this.getUIArea().getRootNode());
            oFlpSandbox.placeAt(sId);
        },
        /**
         * The component is destroyed by OPA5 automatically.
         * @protected
         * @override
         */
        exit: function () {
            oFlpSandbox.exit();
        }
    });

    function createRootDomElement (sId, oNode) {
        // a DOM element is required to place the launchpad
        // it should be located within the UI Area of the current component to allow a proper tear down
        // and clean DOM for each test.
        if (!document.getElementById(sId)) {
            var div = document.createElement("div");
            div.setAttribute("id", sId);
            oNode.appendChild(div);
        }
    }
});