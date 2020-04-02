// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview handle all the resources for the different applications.
 * @version 1.74.0
 */
sap.ui.define([
    "sap/ushell/components/container/ApplicationContainer",
    "sap/ushell/components/applicationIntegration/application/PostMessageAPI",
    "sap/ushell/utils",
    "sap/ui/thirdparty/jquery",
	"sap/ushell/components/applicationIntegration/eventDelegation/tunnels",
    "sap/ui/thirdparty/URI"
], function (ApplicationContainer, PostMessageAPI, utils, jQuery, tunnels, URI) {
    "use strict";

    var oActiveApplication,
        BlueBoxHandler,
        oTunnelBank = {},
        oTunnelCallbackBank = {},
        oFuncCache = {},
        UUID = 0;

    function Application () {
        var that = this;

        this.handleMessageEvent = function (oContainer, oMessage) {
            var oMessageData = oMessage.data;

            if (typeof oMessageData === "string") {
                // it's possible that the data attribute is passed as string (IE9)
                try {
                    //TODO: here resolve the callback from the tunnels
                    oMessageData = that.parse(oMessage.data);
                } catch (e) {
                    // could be some message which is not meant for us, so we just log with debug level
                    jQuery.sap.log.debug(
                        "Message received from origin '" + oMessage.origin + "' cannot be parsed: " + e,
                        oMessageData,
                        "sap.ushell.components.container.ApplicationContainer"
                    );
                    return;
                }
            }

            if (oMessageData.action === "pro54_setGlobalDirty" &&
                localStorage.getItem(oContainer.globalDirtyStorageKey) ===
                sap.ushell.Container.DirtyState.PENDING) {
                if (!ApplicationContainer.prototype._isTrustedPostMessageSource(oContainer, oMessage)) {
                    // log w/ warning level, message would normally processed by us
                    jQuery.sap.log.warning("Received message from untrusted origin: " + oMessage.origin,
                        oMessageData, "sap.ushell.components.container.ApplicationContainer");
                    return;
                }
                jQuery.sap.log.debug("getGlobalDirty() pro54_setGlobalDirty SetItem key:" +
                    oContainer.globalDirtyStorageKey + " value: " +
                    oMessageData.parameters.globalDirty,
                    null,
                    "sap.ushell.components.container.ApplicationContainer"
                );
                utils.localStorageSetItem(oContainer.globalDirtyStorageKey,
                    oMessageData.parameters.globalDirty, true);
            } else {
                // delegate to separate method for CrossAppNavigation invocation

                that.handleServiceMessageEvent(oContainer, oMessage, oMessageData);
                // ApplicationContainer.prototype._handleServiceMessageEvent(oContainer, oMessage, oMessageData);
            }
        };

        /**
         * Helper method for handling service invocation via post message events
         * <p>
         * This feature is disabled by default, because it is not consumed by WebDynpro ABAP in version 1.24 (UI Add-on SP10).
         * It can be enabled via launchpad configuration as follows (not a public option, might be changed later):
         *
         * <code>
         *   {
         *     ervices: {
         *       PostMessage: {
         *         config: {
         *           enabled: true
         *         }
         *       }
         *     }
         *   }
         * </code>
         *
         * @param {object} oContainer the ApplicationContainer instance
         * @param {Event} oMessage
         *   the received postMessage event
         * @param {object] oMessageData the parsed message data
         *
         * @private
         * @since 1.24
         */
        this.handleServiceMessageEvent = function (oContainer, oMessage, oMessageData) {
            // we anticipate the PostMessage service for the configuration although it's not there
            // (if it doesn't come, we'll just remove the configuration option)
            var oPostMessageServiceConfig = jQuery.sap.getObject("sap-ushell-config.services.PostMessage.config", 0),
                sService = oMessageData && oMessageData.service,
                fnServicePair = tunnels.getPairedServiceCall(sService),
                sServiceName,
                oMatchHandler,
                sServiceHandlerMatchKey,
                oServiceCall,
                bIsRegistedService = false,
                oShellCommunicationHandlersObj = PostMessageAPI.getAPIs();

            jQuery.sap.log.debug("Received post message request from origin '" + oMessage.origin + "': "
                + JSON.stringify(oMessageData),
                null,
                "sap.ushell.components.container.ApplicationContainer");

            if (fnServicePair) {
                callService(fnServicePair);
                return;
            }
            //validate that service is valid
            if (oMessageData.type !== "request" || !sService) {
                return;
            }

            for (var oEntryCommHandlerKey in oShellCommunicationHandlersObj) {
                if (oShellCommunicationHandlersObj.hasOwnProperty(oEntryCommHandlerKey)) {
                    if (sService.indexOf(oEntryCommHandlerKey) !== -1) {
                        oMatchHandler = oShellCommunicationHandlersObj[oEntryCommHandlerKey];
                        sServiceHandlerMatchKey = oEntryCommHandlerKey;
                        bIsRegistedService = true;
                        break;
                    }
                }
            }

            if (bIsRegistedService === false) {
                return;
            }

            sServiceName = sService.split(".")[3];

            if (oPostMessageServiceConfig && oPostMessageServiceConfig.enabled === false) {
                jQuery.sap.log.warning("Received message for " + sServiceName + ", but this " +
                    "feature is disabled. It can be enabled via launchpad configuration " +
                    "property 'services.PostMessage.config.enabled: true'",
                    undefined, "sap.ushell.components.container.ApplicationContainer");
                return;
            }

            // custom trusted callback
            if (!ApplicationContainer.prototype._isTrustedPostMessageSource(oContainer, oMessage)) {
                // log w/ warning level, message would normally processed by us
                jQuery.sap.log.warning("Received message from untrusted origin '" + oMessage.origin + "': "
                    + JSON.stringify(oMessage.data),
                    null, "sap.ushell.components.container.ApplicationContainer");
                return;
            }

            function callService (fnServiceCall) {
                var oServiceParams = {
	                matchesLocalSid: matchesLocalSid,
	                getLocalSystemInSidForma: getLocalSystemInSidFormat,
	                storeSapSystemData: storeSapSystemData,
	                executeSetBackNavigationService: executeSetBackNavigationService,
	                sendResponseMessage: sendResponseMessage,
	                oMessage: oMessage,
	                oMessageData: oMessageData,
	                oContainer: oContainer
                };
	            try {
                    fnServiceCall(oServiceParams)
                        .done(function (oResult) {
                            sendResponseMessage("success", { result: oResult });
                        })
                        .fail(function (sMessage) {
                            sendResponseMessage("error", { message: sMessage });
                        });
	            } catch (oError) {
		            sendResponseMessage("error", { message: oError.message });
	            }
            }

            /**
             * Sends the response message in the expected format
             */
            function sendResponseMessage (sStatus, oBody) {
                var sResponseData = that.stringify({
                    type: "response",
                    service: oMessageData.service,
                    request_id: oMessageData.request_id,
                    status: sStatus,
                    body: oBody
                });

                jQuery.sap.log.debug("Sending post message response to origin ' " + oMessage.origin + "': "
                    + sResponseData,
                    null,
                    "sap.ushell.components.container.ApplicationContainer");

                if (typeof oMessage.source !== "object" || oMessage.source === null) {
                    jQuery.sap.log.debug("Cannot send response message to origin ' " + oMessage.origin,
                        "`source` member of request message is not an object",
                        "sap.ushell.components.container.ApplicationContainer");

                    return;
                }

                oMessage.source.postMessage(sResponseData, oMessage.origin);
            }

            function executeSetBackNavigationService (oMessage, oMessageData) {
                var oDeferred = new jQuery.Deferred(),
                    fnCallback;
                if (oMessageData.body && oMessageData.body.callbackMessage && oMessageData.body.callbackMessage.service) {
                    fnCallback = ApplicationContainer.prototype._backButtonPressedCallback.bind(
                        null,
                        oMessage.source,
                        oMessageData.body.callbackMessage.service,
                        oMessage.origin
                    );
                } // empty body or callback message will call the setBackNavigation with undefined, this should reset the back button callback
                oDeferred.resolve(oContainer.getShellUIService().setBackNavigation(fnCallback));
                return oDeferred.promise();
            }

            /**
             * Stores sap system data into local storage.
             *
             * @param {object} oSapSystemData
             *   The sap system data
             *
             * @param {string} [sSapSystemSrc]
             *   The sap system src
             */
            function storeSapSystemData (oSapSystemData, sSapSystemSrc) {
                var sKey,
                    oLocalStorage,
                    sStringifiedSapSystemData,
                    aSystemIds = [oSapSystemData.id];

                if (arguments.length > 1) {
                    aSystemIds.unshift(sSapSystemSrc);
                }
                try {
                    sStringifiedSapSystemData = JSON.stringify(oSapSystemData);
                } catch (e) {
                    jQuery.sap.log.error("Cannot stringify and store expanded system data: " + e);
                }

                if (sStringifiedSapSystemData) {
                    oLocalStorage = utils.getLocalStorage();

                    sKey = utils.generateLocalStorageKey("sap-system-data", aSystemIds);
                    oLocalStorage.setItem(sKey, sStringifiedSapSystemData);
                }
            }

            /**
             * Returns the id and client of the local system in sid format.
             *
             * @returns {string}
             *   the local system/client in sid format, e.g., sid(UR3.120)
             *
             * @private
             */
            function getLocalSystemInSidFormat () {
                var oSystem = sap.ushell.Container.getLogonSystem();
                var sSystemName = oSystem.getName();
                var sSystemClient = oSystem.getClient();

                return "sid(" + sSystemName + "." + sSystemClient + ")";
            }

            /**
             * Checks whether the given system is in sid format and matches the
             * local system.
             *
             * @param {string} sSidOrName
             *   The sid or name representation of the system alias
             *
             * @return {boolean}
             *   Whether the given system is in sid format and matches the local system.
             *
             * @private
             */
            function matchesLocalSid (sSidOrName) {
                return getLocalSystemInSidFormat().toLowerCase() === sSidOrName.toLowerCase();
            }

	        oServiceCall = oMatchHandler.oServiceCalls[oMessageData.service.replace(sServiceHandlerMatchKey + ".", "")];
	        if (oServiceCall && oServiceCall.executeServiceCallFn) {
		        callService(oServiceCall.executeServiceCallFn);
	        } else {
	           sendResponseMessage("error", { message: "Unknown service name: '" + oMessageData.service + "'" });
	        }
        };

        this.init = function (inBlueBoxHandler) {
            BlueBoxHandler = inBlueBoxHandler;

            this.registerShellCommunicationHandler({
                "sap.ushell.PostMessage": {
                    oServiceCalls: {
                        "callTunnelFunction": {
                            executeServiceCallFn: function (oServiceParams) {
                                var content = oServiceParams.oMessageData.body.content,
                                    aArgs = that.restoreArray(content.arguments),
                                    returnValue;
	                            returnValue = oTunnelBank[content.UUID].fnCallback.apply(this, aArgs);
                                return new jQuery.Deferred().resolve(returnValue).promise();
                            }
                        }
                    },
                    oRequestCalls: {
                        "callTunnelFunction": {
                            isActiveOnly: true,
                            distributionType: ["URL"]
                        }
                    }
                }
            });
        };

        this.restoreArray = function (oArr) {
	        var aArr = [],
		        index = 0;
	        while (oArr[index]) {
		        aArr.push(oArr[index]);
		        index++;
	        }

	        return aArr;
        };

        this._createWaitForRendererCreatedPromise = function () {
            var oPromise,
                oRenderer;

            oRenderer = sap.ushell.Container.getRenderer();
            if (oRenderer) {
                // should always be the case except initial start; in this case, we return an empty array to avoid delays by an additional async operation
                jQuery.sap.log.debug("Shell controller._createWaitForRendererCreatedPromise: shell renderer already created, return empty array.");
                return [];
            }
            oPromise = new Promise(function (resolve, reject) {
                var fnOnRendererCreated;

                fnOnRendererCreated = function () {
                    jQuery.sap.log.info("Shell controller: resolving component waitFor promise after shell renderer created event fired.");
                    resolve();
                    sap.ushell.Container.detachRendererCreatedEvent(fnOnRendererCreated);
                };
                oRenderer = sap.ushell.Container.getRenderer();
                if (oRenderer) {
                    // unlikely to happen, but be robust
                    jQuery.sap.log.debug("Shell controller: resolving component waitFor promise immediately (shell renderer already created");
                    resolve();
                } else {
                    sap.ushell.Container.attachRendererCreatedEvent(fnOnRendererCreated);
                }
            });
            return [oPromise];
        };

        // FIXME: It would be better to call a function that simply
        // and intentionally loads the dependencies of the UI5
        // application, rather than creating a component and expecting
        // the dependencies to be loaded as a side effect.
        // Moreover, the comment reads "load ui5 component via shell service"
        // however that is 'not needed' since the loaded component
        // is not used. We should evaluate the possible performance
        // hit taken due to this implicit means to an end.
        this.createComponent = function (oResolvedHashFragment, oParsedShellHash) {
            return sap.ushell.Container.getService("Ui5ComponentLoader").createComponent(
                oResolvedHashFragment,
                oParsedShellHash,
                this._createWaitForRendererCreatedPromise()
            );
        };

        this.stripURL = function (sUrl) {
            var nDomainParamStart = sUrl.indexOf("?"),
                nDomainHashStart = sUrl.indexOf("#"),
                domainUrl;

            if (nDomainParamStart >= 0) {
                domainUrl = sUrl.substr(0, nDomainParamStart);
            } else if (nDomainHashStart >= 0) {
                domainUrl = sUrl.substr(0, nDomainHashStart);
            } else {
                domainUrl = sUrl;
            }

            return domainUrl;
        };

        this.createApplicationContainer = function (sAppId, oResolvedNavigationTarget) {
            // TODO: DelegationBootstrap
            oActiveApplication = new ApplicationContainer("application" + sAppId, oResolvedNavigationTarget);
            oActiveApplication.setHandleMessageEvent(this.handleMessageEvent);
            BlueBoxHandler.setAppCapabilities(oActiveApplication, oResolvedNavigationTarget.appCapabilities);
            return oActiveApplication;
        };

        this.active = function (oApp) {
            if (oApp) {
                if (oApp.active) {
                    oApp.active();
                }
            }
        };

        this.restore = function (oApp) {
            var sDomainEnd;

            if (oApp) {
                //is Isolated application
                if (oApp.getUrl) {
                    //send post message restore
                    sDomainEnd = oApp.getUrl();
                    oActiveApplication = BlueBoxHandler.get(this.stripURL(sDomainEnd));

                    if (oActiveApplication) {
                        BlueBoxHandler.restoreApp(oActiveApplication.sApplication);
                    }
                }

                if (oApp.restore) {
                    oApp.restore();
                }

                //this is in order to support the dashboard life cycle.
                if (oApp.setInitialConfiguration) {
                    oApp.setInitialConfiguration();
                }

                if (oApp.getRouter && oApp.getRouter() && oApp.getRouter().initialize) {
                    oApp.getRouter().initialize();
                }

                oActiveApplication = oApp;
            }
        };

        this.store = function (oApp) {
            var sDomainEnd;
            //distroy the application and its resources
            // invoke the life cycle interface "suspend" for the suspend application
            if (oApp) {
                //is Isolated application
                if (oApp.getUrl) {
                    //send post message restore
                    sDomainEnd = oApp.getUrl();
                    oActiveApplication = BlueBoxHandler.get(this.stripURL(sDomainEnd));

                    if (oActiveApplication) {
                        BlueBoxHandler.storeApp(oActiveApplication.sApplication);
                    }
                }

                if (oApp.suspend) {
                    oApp.suspend();
                }
                if (oApp.getRouter && oApp.getRouter()) {
                    oApp.getRouter().stop();
                }
            }
        };

        this.destroy = function (oApp) {
            var sDomainEnd,
                oActiveApplication,
                bDistroyByPost = false;

            if (oApp) {
                if (oApp.getUrl) {
                    sDomainEnd = oApp.getUrl();
                    oActiveApplication = BlueBoxHandler.get(this.stripURL(sDomainEnd));

                    if (BlueBoxHandler.isStatefulContainerSupported(oActiveApplication)) {
                        bDistroyByPost = true;
                        BlueBoxHandler.destroyApp(oActiveApplication.sApplication);
                    }
                }

                if (oApp.destroy && bDistroyByPost === false) {
                    oApp.destroy();
                }
            }
        };

        this.getActiveAppContainer = function () {
            return oActiveApplication;
        };
    }

    Application.prototype.stringify = function (oData) {
        var createTunnel = function (fnCallback) {
            UUID++;
            //store mapping for reverse proxy

            oTunnelBank[UUID] = { fnCallback: fnCallback };

            //Store org & ctx in a bank
            //create descriptor that will enable the creation of the tunnel function on the Isolated domain/

            return {
                type: "tunnel",
                UUID: UUID
            };
        },
            cache = [],
            sResult = JSON.stringify(oData, function (key, value) {
                if (value !== null) {
                    if (typeof value === "object" || typeof value === "function") {
                        if (cache.indexOf(value) !== -1) {
                            // Duplicate reference found, discard key
                            return;
                        }
                        // Store value in our collection
                        cache.push(value);
                    }
                }
                if (typeof value === "function") {
                    var nUUID = oTunnelCallbackBank[value];

                    if (nUUID) {
                        return {
                            type: "reversetunnel",
                            UUID: nUUID
                        };
                    }
                    //TODO handle as tunnel!
                    return createTunnel(value);
                }
                return value;
            });
        return sResult;
    };

    Application.prototype.parse = function (sData) {
        var that = this;

        return JSON.parse(sData, function (key, value) {
            if (value && value.type === "reversetunnel") {
                return oTunnelBank[value.UUID].fnCallback;
            } else if (value && value.type === "tunnel") {
                var cbFunc;
                if (oFuncCache[value.UUID]) {
                    cbFunc = oFuncCache[value.UUID];
                } else {
                    var oTunnelContainer = that.getActiveAppContainer();
                    cbFunc = function () {
                        that.postMessageToIframeApp(oTunnelContainer, "sap.ushell.PostMessage", "callTunnelFunction", {
                            "content": {
                                UUID: value.UUID,
                                arguments: arguments
                            }
                        }, true);
                    };
                    cbFunc.getUUID = function () {
                        return value.UUID;
                    };
                    oTunnelCallbackBank[cbFunc] = value.UUID;
                    oFuncCache[value.UUID] = cbFunc;
                }
                return cbFunc;
            }
            return value;
        });
    };

    Application.prototype.getResponseHandler = function (sServiceName, sInterface) {
        return PostMessageAPI.getResponseHandler(sServiceName, sInterface);
    };

    Application.prototype.isActiveOnly = function (sServiceName, sInterface) {
        return PostMessageAPI.isActiveOnly(sServiceName, sInterface);
    };

    Application.prototype.isAppTypeSupported = function (oContainer, sServiceName, sInterface) {
        var oCommandInterface = PostMessageAPI._getPostMesageInterface(sServiceName, sInterface);
        return this.isAppTypeSupportedByPolicy(oContainer, oCommandInterface);
    };

    Application.prototype.isAppTypeSupportedByPolicy = function (oContainer, oPolicy) {
        if (oContainer && oContainer.getAdditionalInformation && oContainer.getAdditionalInformation().startsWith("SAPUI5.Component=")) {
            return false;
        }

        var oCommandInterface = oPolicy;

        if (!oCommandInterface || !oCommandInterface.distributionType) {
            return false;
        }

        if (oCommandInterface.distributionType.indexOf("all") >= 0) {
            return true;
        }

        //URL is a moder type event distribution is due to the subscribe
        if (oCommandInterface.distributionType.indexOf("URL") >= 0) {
            return false;
        }

        if (oContainer.getApplicationType && oCommandInterface.distributionType.indexOf(oContainer.getApplicationType()) >= 0) {
            return true;
        }

        return false;
    };

    Application.prototype.postMessageToIframeApp = function (oContainer, sServiceName, sInterface, oMessageBody, bWaitForResponse) {
        var sService = sServiceName + "." + sInterface,
            oMessage = this.createPostMessageRequest(sService, oMessageBody);

        return this.postMessageToIframe(oMessage, oContainer, bWaitForResponse);
    };

    Application.prototype.createPostMessageRequest = function (sServiceName, oMessageBody) {
        var sRequestId = Date.now().toString();

        return {
            "type": "request",
            "request_id": sRequestId,
            "service": sServiceName,
            "body": oMessageBody
        };
    };

    Application.prototype.postMessageToIframe = function (oMessage, oContainer, bWaitForResponse) {
        var that = this,
            sRequestId = oMessage.request_id,
            oIFrame = oContainer._getIFrame();

        return new Promise(function (fnNotifySuccess, fnNotifyError) {
            function fnProcessClientMessage (oEvent) {
                var oEventData;

                try {
                    oEventData = that.parse(oEvent.data, that);

                    if (sRequestId !== oEventData.request_id) {
                        return;
                    }

                    if (oEventData.status === "success") {
                        fnNotifySuccess(oEventData);
                    } else {
                        fnNotifyError(oEventData);
                    }

                    window.removeEventListener("message", fnProcessClientMessage);
                } catch (e) {
                    // Not gonna break because of a potential quirk in the framework that responded to postMessage
                    fnNotifySuccess();

                    jQuery.sap.log.warning("Obtained bad response from framework in response to message " + oMessage.request_id);
                    jQuery.sap.log.debug("Underlying framework returned invalid response data: '" + oEvent.data + "'");
                }
            }

            var sMessage = that.stringify(oMessage);
            jQuery.sap.log.debug("Sending postMessage " + sMessage + " to application container '" + oContainer.getId() + "'");

            var oUri, targetDomain;

            if (!oIFrame) {
                // TODO: need to handle the case when no Iframe found for the post message,
                //  e.g. tunnel to that ApplicationContainer that was destroied.
                fnNotifySuccess();
            } else if (bWaitForResponse) {
                window.addEventListener("message", fnProcessClientMessage, false);
                oUri = new URI(oContainer._getIFrameUrl(oIFrame));
                targetDomain = oUri.protocol() + "://" + oUri.host();
                oIFrame.contentWindow.postMessage(sMessage, targetDomain);
            } else {
                oUri = new URI(oContainer._getIFrameUrl(oIFrame));
                targetDomain = oUri.protocol() + "://" + oUri.host();
                oIFrame.contentWindow.postMessage(sMessage, targetDomain);
                fnNotifySuccess();
            }
        });
    };

    Application.prototype.registerShellCommunicationHandler = function (oCommunicationHandler) {
        PostMessageAPI.registerShellCommunicationHandler(oCommunicationHandler);
    };

    Application.prototype.addShellCommunicationHandler = function (sKey, oCommunicationEntry) {
        PostMessageAPI.addShellCommunicationHandler(sKey, oCommunicationEntry);
    };

    Application.prototype._getPostMesageInterface = function (sServiceName, sInterface) {
        return PostMessageAPI._getPostMesageInterface(sServiceName, sInterface);
    };

    return new Application();
}, /* bExport= */ true);
