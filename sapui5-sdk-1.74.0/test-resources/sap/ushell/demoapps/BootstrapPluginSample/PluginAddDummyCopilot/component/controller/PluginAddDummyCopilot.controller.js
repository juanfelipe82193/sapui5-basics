// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend("sap.ushell.demo.PluginAddDummyCopilot.component.controller", {
        _getRenderer: function () {
            return sap.ushell.Container.getRenderer("fiori2");
        },
        onClose: function () {
            this._getRenderer().setFloatingContainerVisibility(false);
        }
    });
});