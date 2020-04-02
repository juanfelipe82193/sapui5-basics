// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/core/service/ServiceFactory",
    "sap/ui/core/service/ServiceFactoryRegistry"
], function (Object, ServiceFactory, ServiceFactoryRegistry) {
    "use strict";

    return Object.extend("sap.ushell.Container", {
        constructor: function () {
        },
        getService: function () {
            return {
                isEnabled: function () {
                    return sap.ui.getCore().getModel().getData().allMyApps;
                }
            };
        },
        registerMockService: function (serviceName, MockService) {
            var sServiceNamespace = "sap.ushell.ui5service." + serviceName;
            var ServiceMockClass = ServiceFactory.extend(sServiceNamespace, {
                createInstance: function (oDataContext) {
                    var oMockService = new MockService(oDataContext);
                    return Promise.resolve(oMockService);
                }
            });
            ServiceFactoryRegistry.register(sServiceNamespace, new ServiceMockClass());
        }
    });
}, true);