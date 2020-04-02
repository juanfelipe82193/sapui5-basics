sap.ui.define([
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/appRuntime/ui5/AppRuntimeService"
],function (AppConfiguration, AppRuntimeService) {
    "use strict";

    function AppConfigurationProxy () {
        sap.ushell.services.AppConfiguration = this;
        
        AppConfiguration.constructor.call(this);

        this.setApplicationFullWidth = function (bValue) {
            AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.AppConfiguration.setApplicationFullWidth", {
                    "bValue": bValue
                });
        };
    }

    return new AppConfigurationProxy();
}, true);
