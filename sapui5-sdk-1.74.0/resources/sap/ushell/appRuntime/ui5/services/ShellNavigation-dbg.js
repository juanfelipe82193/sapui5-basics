sap.ui.define([
    "sap/ushell/services/ShellNavigation",
    "sap/ushell/appRuntime/ui5/AppRuntimeService"
],function (ShellNavigation, AppRuntimeService) {
    "use strict";

    function ShellNavigationProxy (oContainerInterface, sParameters, oServiceConfiguration) {
        ShellNavigation.call(this, oContainerInterface, sParameters, oServiceConfiguration);

        this.toExternal = function (oArgs, oComponent, bWriteHistory) {
            AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.ShellNavigation.toExternal", {
                    "oArgs": oArgs,
                    "bWriteHistory": bWriteHistory
                });
        };

        this.toAppHash = function (sAppHash, bWriteHistory) {
            AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.ShellNavigation.toExternal", {
                    "sAppHash": sAppHash,
                    "bWriteHistory": bWriteHistory
                });
        };
    }

    ShellNavigationProxy.prototype = Object.create(ShellNavigation.prototype);
    ShellNavigationProxy.hasNoAdapter = ShellNavigation.hasNoAdapter;

    return ShellNavigationProxy;
}, true);
