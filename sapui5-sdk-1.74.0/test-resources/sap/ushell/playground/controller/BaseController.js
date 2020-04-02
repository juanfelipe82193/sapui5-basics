// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("sap.ushell.playground.controller.BaseController", {
        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },
        navigateTo: function (routeName) {
            this._destroyControlsWithHardcodedIds();
            this.getRouter().navTo(routeName);
        },
        _destroyControlsWithHardcodedIds: function () {
            var aIds = [
                "sapUshellNavHierarchyItems",
                "navMenuInnerTitle",
                "sapUshellRelatedAppsLabel",
                "sapUshellNavRelatedAppsFlexBox",
                "sapUshellRelatedAppsItems",
                "allMyAppsView"
            ];
            var oControl;

            for (var i = 0; i < aIds.length; i++) {
                oControl = sap.ui.getCore().byId(aIds[i]);
                if (oControl) {
                    oControl.destroy();
                }
            }
        }
    });
});
