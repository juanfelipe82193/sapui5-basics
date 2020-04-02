// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/thirdparty/jquery"
], function (jQuery) {
    "use strict";

    var oAPIs = {};

    function AppRuntimePostMessage () {
        this.getHandlers = function () {
            return oAPIs;
        };

        this.registerCommHandlers = function (oCommunication) {
            var aInboundsActions = [];

            Object.keys(oCommunication).forEach(function (sKey) {
                var oCommunicationEntry = oCommunication[sKey];

                if (oCommunicationEntry.oInboundActions) {
                    Object.keys(oCommunicationEntry.oInboundActions).forEach(function (key) {
                        aInboundsActions.push({
                            action: key,
                            service: sKey
                        });
                    });
                }
            });

            jQuery.extend(oAPIs, oCommunication);


            return aInboundsActions;
        };


        this.registerCommunicationHandler = function (sKey, oCommunicationEntry) {
            var oCommObject = oAPIs[sKey],
                aInboundsActions = [];

            if (!oCommObject) {
                oCommObject = oAPIs[sKey] = {
                    oInboundActions: {}
                };
            }

            if (oCommunicationEntry.oInboundActions) {
                Object.keys(oCommunicationEntry.oInboundActions).forEach(function (key) {
                    oCommObject.oInboundActions[key] = oCommunicationEntry.oInboundActions[key];
                    aInboundsActions.push({
                        action: key,
                        service: sKey
                    });
                });
            }

            return aInboundsActions;
        };

        this._getPostMesageInterface = function (sServiceName, sInterface) {
            var oCommHandlerService = oAPIs[sServiceName],
                oInterface;

            if (oCommHandlerService && oCommHandlerService.oRequestCalls && oCommHandlerService.oRequestCalls[sInterface]) {
                oInterface = oCommHandlerService.oRequestCalls[sInterface];
            }

            return oInterface;
        };
    }

    return new AppRuntimePostMessage();
});
