sap.ui.define([
    "sap/ui/core/service/ServiceFactoryRegistry",
    "sap/ui/core/service/ServiceFactory",
    "sap/ui/core/service/Service",
    "../../../ui5service/_ShellUIService/shelluiservice.class.factory",
    "sap/ushell/appRuntime/ui5/AppRuntimeService"
],function (ServiceFactoryRegistry, ServiceFactory, Service, fnDefineClass, AppRuntimeService) {
    "use strict";

    var oService =  fnDefineClass({
        serviceRegistry: ServiceFactoryRegistry,
        serviceFactory: ServiceFactory,
        service: Service
    });

    var sLastSetTitle;

    var ShellUIServiceProxy = oService.extend("sap.ushell.appRuntime.services.ShellUIService", {

        setTitle: function (sTitle) {
            sLastSetTitle = sTitle;
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.ShellUIService.setTitle", { "sTitle" : sTitle });
        },

        getTitle: function () {
            return sLastSetTitle;
        },

        setHierarchy : function (aHierarchyLevels) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.ShellUIService.setHierarchy", { "aHierarchyLevels" : aHierarchyLevels });
        },

        setRelatedApps : function (aRelatedApps) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.ShellUIService.setRelatedApps", { "aRelatedApps" : aRelatedApps });
        }

    });

    return ShellUIServiceProxy;
}, true);
