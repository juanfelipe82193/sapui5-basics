// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview The UI integration's SAPUI5 control which supports application embedding.
 * @version 1.74.0
 */
sap.ui.define([
    "sap/ui/Device",
    "sap/ushell/utils",
    "sap/ushell/ApplicationType",
    "sap/m/MessagePopover",
    "sap/ui/core/Component",
    "sap/ui/core/ComponentContainer",
    "sap/ui/core/Control",
    "sap/ui/thirdparty/URI",
    "sap/ushell/EventHub",
    "sap/ui/core/Icon",
    "sap/ushell/System",
    "sap/ushell/User",
    "sap/m/Text",
    "sap/base/util/UriParameters",
    "sap/base/util/deepEqual",
    "sap/base/util/uid",
    "sap/base/security/encodeXML"
], function (
    Device,
    utils,
    ApplicationType,
    MessagePopover,
    Component,
    ComponentContainer,
    Control,
    URI,
    EventHub,
    Icon,
    System,
    User,
    Text,
    UriParameters,
    deepEqual,
    fnGetUid,
    encodeXML
) {
    "use strict";

    var sPREFIX = "sap.ushell.components.container.",
        sCOMPONENT = sPREFIX + "ApplicationContainer",
        sDIRTY_STATE_PREFIX = "sap.ushell.Container.dirtyState.",
        mLogouts,
        oShellCommunicationHandlersObj,
        fnHandleMessageEvent,
        oResourceBundle;

    //These params should be excluded from the URL for WDA & WebGUI apps
    var URL_PARAMS_FILTER = ["sap-ach", "sap-fiori-id", "sap-hide-intent-link", "sap-priority", "sap-tag",
        "sap-ui-app-id-hint", "sap-ui-debug", "sap-ui-fl-control-variant-id", "sap-ui-fl-max-layer",
        "sap-ui-tech-hint", "sap-ui2-tcode", "sap-ui2-wd-app-id", "sap-ui2-wd-conf-id", "sap-ushell-cdm-site-url",
        "sap-ushell-defaultedParameterNames", "sap-ushell-navmode", "sap-ushell-next-navmode", "sap-ushell-url"];

    /**
     * Method to adapt the CrossApplicationNavigation service method
     * isUrlSupported to the request as issued by the SAP UI5 MessagePopover control
     *
     * @param {object} an object defined by the MessagePopover control containing the URL
     *  which should be validated and an ES6 promise object which has to be used to receive the validation results.
     *  This promise always needs to be resolved expecting { allowed: true|false } as a an argument to the resolve function.
     *
     * @since 1.30.0
     * @private
     */
    function adaptIsUrlSupportedResultForMessagePopover (oToBeValidated) {
        var oCAService = sap.ushell.Container.getService("CrossApplicationNavigation");
        oCAService.isUrlSupported(oToBeValidated.url).done(function () {
            oToBeValidated.promise.resolve({ "allowed": true, "id": oToBeValidated.id });
        }).fail(function () {
            oToBeValidated.promise.resolve({ "allowed": false, "id": oToBeValidated.id });
        });
    }

    function initializeMessagePopover (eventData) {
        //Hook CrossApplicationNavigation URL validation logic into the sap.m.MessagePopover control
        var oMessageConceptDefaultHandlers = {
            "asyncURLHandler": ApplicationContainer.prototype._adaptIsUrlSupportedResultForMessagePopover
        };
        if (MessagePopover && MessagePopover.setDefaultHandlers) {
            MessagePopover.setDefaultHandlers(oMessageConceptDefaultHandlers);
        }
        EventHub.emit("StepDone", eventData.stepName);
    }

    /*
    MessagePopover and its dependent controls resources are ~200K. In order to minimize core-min file it is bundled in core-ext file.
    Therefore we need to wait until all resorces are loaded, before we initialize the MessagePopover.
    */
    EventHub.once("initMessagePopover").do(initializeMessagePopover);

    mLogouts = new utils.Map();

    /**
     * Returns the logout handler function for the given container object.
     *
     * @param {sap.ushell.components.container.ApplicationContainer} oContainer
     *   the container object for which the logout handler is of interest
     * @returns {function}
     *   the logout handler function for the given container. If no handler is registered
     *   <code>undefined</code> is returned.
     * @private
     */
    function getLogoutHandler (oContainer) {
        return mLogouts.get(oContainer.getId());
    }

    function getCommunicationHandlers () {
        return oShellCommunicationHandlersObj;
    }

    /**
     * Returns a map of all search parameters present in the search string of the given URL.
     *
     * @param {string} sUrl
     *   the URL
     * @returns {object}
     *   in member <code>startupParameters</code> <code>map&lt;string, string[]}></code> from key to array of values,
     *   in members <code>sap-xapp-state</code> an array of Cross application Navigation state keys, if present
     *   Note that this key is removed from startupParameters!
     * @private
     */
    function getParameterMap (sUrl) {
        var mParams = new UriParameters(sUrl).mParams,
            xAppState = mParams["sap-xapp-state"],
            oResult;
        delete mParams["sap-xapp-state"];
        oResult = {
            startupParameters: mParams
        };
        if (xAppState) {
            oResult["sap-xapp-state"] = xAppState;
        }
        return oResult;
    }

    /**
     * Returns a translated text from the resource bundle.
     *
     * @param {string} sKey
     *   the key in the resource bundle
     * @param {string[]} [aArgs]
     *   arguments to replace {0}..{9}
     * @returns {string}
     *   the translated text
     */
    function getTranslatedText (sKey, aArgs) {
        if (!oResourceBundle) {
            oResourceBundle = jQuery.sap.resources({
                url: jQuery.sap.getModulePath(sPREFIX) + "/resources/resources.properties",
                language: sap.ui.getCore().getConfiguration().getLanguage()
            });
        }
        return oResourceBundle.getText(sKey, aArgs);
    }

    /**
     * Creates some SAPUI5 control telling the user that an error has occured.
     *
     * @returns {sap.ui.core.Control}
     */
    function createErrorControl () {
        return new Icon({
            size: "2rem",
            src: "sap-icon://error",
            tooltip: ApplicationContainer.prototype._getTranslatedText("an_error_has_occured")
        });
    }

    /**
     * Destroys the child aggregation.
     */
    function destroyChild (oContainer) {
        var oChild = oContainer.getAggregation("child"),
            sComponentName;

        if (oChild instanceof ComponentContainer) {
            // name contains .Component - must be trimmed
            sComponentName = oChild.getComponentInstance().getMetadata().getName()
                .replace(/\.Component$/, "");
            jQuery.sap.log.debug("unloading component " + sComponentName, null, sCOMPONENT);
        }
        oContainer.destroyAggregation("child");
    }

    /**
     * Creates a new SAPUI5 view or component for the given container and makes it a child. A view
     * is created if the name ends with ".view.(viewType)".
     * @param {sap.ushell.components.container.ApplicationContainer} oContainer
     *   the container
     * @param {string} sUrl
     *   the base URL
     * @param {string} sAdditionalInformation
     *   the additional information in the form "SAPUI5=<view_or_component_name>"
     * @returns {sap.ui.core.mvc.View|sap.ui.core.Control}
     *   the view, or some "error" control
     */
    function createUi5View (oContainer, sUrl, sAdditionalInformation) {
        var oComponent,
            oControl,
            iIndex,
            iLast,
            aMatches,
            oUrlData,
            sNamespace,
            oViewData = {},
            sViewName,
            sViewType;

        iIndex = sUrl.indexOf("?");
        if (iIndex >= 0) {
            // pass GET parameters of URL via view data
            oUrlData = ApplicationContainer.prototype._getParameterMap(sUrl);
            oViewData = oUrlData.startupParameters;
            sUrl = sUrl.slice(0, iIndex);
        }

        if (sUrl.slice(-1) !== "/") {
            sUrl += "/"; // ensure URL ends with a slash
        }

        if (/\.view\.(\w+)$/i.test(sAdditionalInformation)) {
            // ends with ".view.(viewType)": a view description
            // /SAPUI5=(namespace)/(viewName).view.(viewType)/
            aMatches = /^SAPUI5=(?:([^/]+)\/)?([^/]+)\.view\.(\w+)$/i.exec(sAdditionalInformation);
            if (!aMatches) {
                jQuery.sap.log.error("Invalid SAPUI5 URL", sAdditionalInformation, sCOMPONENT);
                return ApplicationContainer.prototype._createErrorControl();
            }
            // determine namespace, view name, and view type
            sNamespace = aMatches[1];
            sViewName = aMatches[2];
            sViewType = aMatches[3].toUpperCase(); // @see sap.ui.core.mvc.ViewType

            if (sNamespace) {
                // prefix view name with namespace
                sViewName = sNamespace + "." + sViewName;
            } else {
                // derive namespace from view name's "package"
                iLast = sViewName.lastIndexOf(".");
                if (iLast < 1) {
                    jQuery.sap.log.error("Missing namespace", sAdditionalInformation, sCOMPONENT);
                    return ApplicationContainer.prototype._createErrorControl();
                }
                sNamespace = sViewName.slice(0, iLast);
            }
        } else {
            // a component
            sNamespace = sAdditionalInformation.replace(/^SAPUI5=/, "");
        }

        jQuery.sap.registerModulePath(sNamespace, sUrl + sNamespace.replace(/\./g, "/"));

        // destroy the child control before creating a new control with the same ID
        ApplicationContainer.prototype._destroyChild(oContainer);
        if (sViewName) {
            if (oContainer.getApplicationConfiguration()) {
                oViewData.config = oContainer.getApplicationConfiguration();
            }
            oControl = sap.ui.view({
                id: oContainer.getId() + "-content",
                type: sViewType,
                viewData: oViewData || {},
                viewName: sViewName
            });
            oContainer.fireEvent("applicationConfiguration");
        } else {
            jQuery.sap.log.debug("loading component " + sNamespace, null, sCOMPONENT);
            // presence of startupParameters member indicates root component, thus
            // we assure it's always filled with at least empty object
            var componentData = oUrlData ? {
                startupParameters: oUrlData.startupParameters
            } : { startupParameters: {} };
            if (oUrlData && oUrlData["sap-xapp-state"]) {
                componentData["sap-xapp-state"] = oUrlData["sap-xapp-state"];
            }
            if (oContainer.getApplicationConfiguration()) {
                componentData.config = oContainer.getApplicationConfiguration();
            }

            oComponent = sap.ui.component({
                id: oContainer.getId() + "-component",
                componentData: componentData,
                name: sNamespace
            });
            //TODO ensure event is fired even in error case (try/catch)
            oContainer.fireEvent("applicationConfiguration",
                { "configuration": oComponent.getMetadata().getConfig() });
            oControl = new ComponentContainer({
                id: oContainer.getId() + "-content",
                component: oComponent
            });
        }
        oControl.setWidth(oContainer.getWidth());
        oControl.setHeight(oContainer.getHeight());
        oControl.addStyleClass("sapUShellApplicationContainer");
        // Note: As a composite control, we need to aggregate our children (at least internally)!
        oContainer.setAggregation("child", oControl, true);
        return oControl;
    }

    /**
     * publish an external event asynchronously via the event bus
     * The channel id is hard coded to sap.ushell
     * @param {string} sEventName event name
     * @param {object} oData event parameters
     */
    function publishExternalEvent (sEventName, oData) {
        setTimeout(function () {
            sap.ui.getCore().getEventBus().publish("sap.ushell", sEventName, oData);
        }, 0);
    }

    /**
     * Creates a new SAPUI5 component for the given container and makes it a child.
     * @param {sap.ushell.components.container.ApplicationContainer} oContainer
     *   the container
     * @param {string} sUrl
     *   the base URL
     * @param {string} sComponentName the component name
     * @returns {sap.ui.core.ComponentContainer|sap.ui.core.Control}
     *   a componentContainer for the component or or some "error" control
     */
    function createUi5Component (oContainer, sUrl, sComponentName) {
        var iIndex,
            oComponent,
            oComponentContainer,
            oUrlData,
            oComponentData = { startupParameters: {} },
            oComponentConfig,
            oComponentHandle = oContainer.getComponentHandle(),
            oPluginManager = sap.ushell.Container.getService("PluginManager"),
            oPluginLoadingPromise,
            sPluginLoadingPromiseState;

        utils.addTime("createUi5Component");
        iIndex = sUrl.indexOf("?");
        if (iIndex >= 0) {
            // pass GET parameters of URL via component data as member startupParameters and as xAppState
            // (to allow blending with other oComponentData usage, e.g. extensibility use case)
            oUrlData = ApplicationContainer.prototype._getParameterMap(sUrl);
            oComponentData = {
                startupParameters: oUrlData.startupParameters
            };
            if (oUrlData["sap-xapp-state"]) {
                oComponentData["sap-xapp-state"] = oUrlData["sap-xapp-state"];
            }
            sUrl = sUrl.slice(0, iIndex);
        }

        if (oContainer.getApplicationConfiguration()) {
            oComponentData.config = oContainer.getApplicationConfiguration();
        }

        if (sUrl.slice(-1) !== "/") {
            sUrl += "/"; // ensure URL ends with a slash
        }

        // destroy the child control before creating a new control with the same ID
        ApplicationContainer.prototype._destroyChild(oContainer);

        oComponentConfig = {
            id: oContainer.getId() + "-component",
            name: sComponentName,
            componentData: oComponentData
        };

        jQuery.sap.log.debug("Creating component instance for " + sComponentName, JSON.stringify(oComponentConfig), sCOMPONENT);

        sap.ui.getCore().getEventBus().publish("sap.ushell.components.container.ApplicationContainer", "_prior.newUI5ComponentInstantion", {
            name: sComponentName
        });

        if (oComponentHandle) {
            oComponent = oComponentHandle.getInstance(oComponentConfig);
        } else {
            jQuery.sap.registerModulePath(sComponentName, sUrl);
            jQuery.sap.log.error("No component handle available for '" + sComponentName + "'; fallback to component.load()", null, sCOMPONENT);
            oComponent = sap.ui.component({
                id: oContainer.getId() + "-component",
                name: sComponentName,
                componentData: oComponentData
            });
        }
        //TODO ensure event is fired even in error case (try/catch)
        oContainer.fireEvent("applicationConfiguration",
            { "configuration": oComponent.getMetadata().getConfig() });
        oComponentContainer = new ComponentContainer({
            id: oContainer.getId() + "-content",
            component: oComponent
        });

        oComponentContainer.setHeight(oContainer.getHeight());
        oComponentContainer.setWidth(oContainer.getWidth());
        oComponentContainer.addStyleClass("sapUShellApplicationContainer");
        oContainer._disableRouterEventHandler = ApplicationContainer.prototype._disableRouter.bind(this, oComponent);
        sap.ui.getCore().getEventBus().subscribe("sap.ushell.components.container.ApplicationContainer", "_prior.newUI5ComponentInstantion", oContainer._disableRouterEventHandler);

        // Note: As a composite control, we need to aggregate our children (at least internally)!
        oContainer.setAggregation("child", oComponentContainer, true);

        if (oPluginManager) {
            oPluginLoadingPromise = oPluginManager.getPluginLoadingPromise("RendererExtensions");
            sPluginLoadingPromiseState = oPluginLoadingPromise && oPluginLoadingPromise.state();
            if (sPluginLoadingPromiseState === "pending") {
                oPluginLoadingPromise
                    .done(function () {
                        ApplicationContainer.prototype._publishExternalEvent("appComponentLoaded", { component: oComponent });
                    })
                    .fail(function () {
                        ApplicationContainer.prototype._publishExternalEvent("appComponentLoaded", { component: oComponent });
                    });
            }

            if (sPluginLoadingPromiseState === "resolved" || sPluginLoadingPromiseState === "rejected") {
                ApplicationContainer.prototype._publishExternalEvent("appComponentLoaded", { component: oComponent });
            }
        } else {
            ApplicationContainer.prototype._publishExternalEvent("appComponentLoaded", { component: oComponent });
        }

        return oComponentContainer;
    }

    /**
     * Invoke <code>getRouter.stop()<code> on the oComponentAn event handler for the onNewAppInstantiated event
     * @param {object} oComponent
     *   a SAPUI5 Component instance
     */
    function disableRouter (oComponent) {
        var rt;
        if ((oComponent instanceof Component) && (typeof oComponent.getRouter === "function")) {
            rt = oComponent.getRouter();
            if (rt && (typeof rt.stop === "function")) {
                jQuery.sap.log.info("router stopped for instance " + oComponent.getId());
                rt.stop();
            }
        }
    }

    /**
     * Creates a system object that describes the URL's server.
     * @param {string} sUrl
     *   the URL
     * @param {object}
     *   the system object with <code>alias</code>, <code>baseUrl</code> describing the URL's
     *   server and <code>client</code> the client from the request property
     *   <code>sap-client</code>.
     */
    function createSystemForUrl (sUrl) {
        var oAnchor = document.createElement("a"),
            sClient = new UriParameters(sUrl).get("sap-client"),
            sBase;

        oAnchor.href = sUrl;
        sBase = oAnchor.protocol + "//" + oAnchor.host;
        return new System({
            alias: sClient ? sBase + "?sap-client=" + sClient : sBase,
            baseUrl: sBase,
            client: sClient || undefined,
            platform: "abap"
        });
    }

    /**
     * Determine if the source of a received postMessage can be considered as trusted. We consider
     * the content window of the application container's iframe as trusted
     *
     * @param {object} oContainer
     *   the application container instance
     * @param {object} oMessage
     *   the postMessage event object
     * @returns {boolean}
     *   true if source is considered to be trustworthy
     * @private
     * @since 1.24
     */
    function isTrustedPostMessageSource (oContainer, oMessage) {
        var bTrusted = false,
            oDomRef = oContainer.getDomRef(),
            oUri,
            sOrigin;

        // In case the app runs in iFrame, we need to change the position of the oDomRef from the (parent) div element to the IFrame element
        if (oContainer.getIframeWithPost() === true && oDomRef && oDomRef.getAttribute && oDomRef.getAttribute("sap-iframe-app") == "true") {
            oDomRef = jQuery("#" + oDomRef.getAttribute("id") + "-iframe")[0];
        }

        if (oDomRef) {
            // In case the app runs in iFrame we trust the iframe itself and all the URLs from the same origin
            // as configured in iFrame.
            oUri = URI(oContainer._getIFrameUrl(oDomRef) || window.location && window.location.href || "");
            sOrigin = oUri.protocol() + "://" + oUri.host();

            bTrusted = (oMessage.source === oDomRef.contentWindow) || (oMessage.origin === sOrigin);
        }

        return bTrusted;
    }

    /**
     * Callback for the back button registered via
     * <code>sap.ushell.ui5service.ShellUIService#setBackNavigation</code>
     *
     * Sends a postMessage request to the source window for triggering the
     * back navigation in the application.
     *
     * @param {object} oSourceWindow
     *   the source window object
     * @param {string} sServiceName
     *   the service name returned from the previous setBackNavigation
     *   postMessage request
     * @param {string} sOrigin
     *   a string identifying the origin where the message is sent from
     */
    function backButtonPressedCallback (oSourceWindow, sServiceName, sOrigin) {
        var sRequestData = JSON.stringify({
            type: "request",
            service: sServiceName,
            request_id: fnGetUid(),
            body: {}
        });

        jQuery.sap.log.debug("Sending post message request to origin ' " + sOrigin + "': " + sRequestData,
            null,
            "sap.ushell.components.container.ApplicationContainer");

        oSourceWindow.postMessage(sRequestData, sOrigin);
    }

    /**
     * Returns the IFrame rendered by this application container.
     *
     * @returns {object}
     *    The iFrame DOM element or null if this cannot be retrieved.
     */
    function getIFrame () {
        var oIFrame = this.getDomRef();
        if (!oIFrame || oIFrame.tagName !== "IFRAME") {
            if (this.getIframeWithPost() === true && oIFrame && oIFrame.getAttribute && oIFrame.getAttribute("sap-iframe-app") == "true") {
                return jQuery("#" + oIFrame.getAttribute("id") + "-iframe")[0];
            }
            return null;
        }
        return oIFrame;
    }

    /**
     * Returns the IFrame URL (both in a simple iframe or in iframe with form+post)
     *
     * @param {object} oIFrame
     *   optional. the iframe DOM element.
     * @returns {string}
     *    The iFrame URL.
     */
    function getIFrameUrl (oIFrame) {
        var sUrl;

        if (oIFrame === undefined) {
            oIFrame = this._getIFrame();
        }
        sUrl = oIFrame.src;

        if (this.getIframeWithPost() === true) {
            sUrl = jQuery("#" + oIFrame.getAttribute("id").replace("-iframe", "-form"))[0].action;
        }

        return sUrl;
    }

    /**
     * Event handler receiving post message events
     *
     * @param {object} oContainer
     *   the current application container.
     * @param {Event} oMessage
     *   the received postMessage event
     *
     * @private
     * @since 1.21.2
     *
     */
    function handleMessageEvent (oContainer, oMessage) {
        var sUi5ComponentName = oContainer.getUi5ComponentName && oContainer.getUi5ComponentName(),
            oMessageData = oMessage.data;

        if (typeof sUi5ComponentName === "string") {
            jQuery.sap.log.debug(
                "Skipping handling of postMessage 'message' event with data '" + JSON.stringify(oMessageData) + "' on container of UI5 application '" + sUi5ComponentName + "'",
                "Only non UI5 application containers can handle 'message' postMessage event",
                "sap.ushell.components.container.ApplicationContainer"
            );
            return;
        }
        if (!oContainer.getActive()) {
            jQuery.sap.log.debug(
                "Skipping handling of postMessage 'message' event with data '" + JSON.stringify(oMessageData) + "' on inactive container '" + oContainer.getId() + "'",
                "Only active containers can handle 'message' postMessage event",
                "sap.ushell.components.container.ApplicationContainer"
            );
            return;
        }

        fnHandleMessageEvent(oContainer, oMessage);
    }

    /**
     * Logout Event Handler.
     * Calls the logout URL when the NWBC is used in the canvas.
     *
     * @param {sap.ushell.components.container.ApplicationContainer} oContainer
     *   application container having the NWBC iframe
     * @param {sap.ui.base.Event} oEvent
     *   oEvent.preventDefault() is called to let the caller know that the
     *   following redirect has to be deferred in order get the NWBC logout done.
     *
     * @private
     */
    function logout (oContainer, oEvent) {
        var oIframe = oContainer._getIFrame(),
            sApplicationType = oContainer.getApplicationType();

        if (utils.isApplicationTypeEmbeddedInIframe(oContainer.getApplicationType(sApplicationType)) && oIframe) {
            var oUri = new URI(oContainer._getIFrameUrl(oIframe));
            var targetDomain = oUri.protocol() + "://" + oUri.host();

            oIframe.contentWindow.postMessage(JSON.stringify(
                { action: "pro54_disableDirtyHandler" }
            ), targetDomain);
            // tell caller that at least one NWBC needs some time to receive a message
            oEvent.preventDefault();
        }
    }

    /**
     * Renders the given child control inside a DIV representing the given container.
     *
     * @param {sap.ui.core.RenderManager} oRenderManager
     * @param {sap.ushell.components.container.ApplicationContainer} oContainer
     *     the application container which is "replaced" by the error control
     * @param {sap.ui.core.Control} [oChild]
     */
    function renderControlInDiv (oRenderManager, oContainer, oChild) {
        oRenderManager
            .write("<div")
            .writeControlData(oContainer)
            .writeAccessibilityState(oContainer)
            .addClass("sapUShellApplicationContainer")
            .writeClasses(oContainer)
            .addStyle("height", oContainer.getHeight())
            .addStyle("width", oContainer.getWidth())
            .writeStyles()
            .write(">")
            .renderControl(oChild);
        oRenderManager
            .write("</div>");
    }

    /**
     * Amends the NavTargetResolution response with theme, sap-ushell-version, accessibility and post parameters if present.
     * Theme and accessibility information is only added for the NWBC application type.
     *
     * @param {string} sUrl
     *   Already resolved url (NavTargetResolution response)
     * @param {string} sUrlApplicationType
     *   The application type of <code>sUrl</code>
     * @param {string} sTargetNavigationMode
     *   The (external) navigation mode to add in the sap-target-navmode parameter
     * @returns {string}
     *   Modified url having additional parameters
     * @private
     */
    function adjustNwbcUrl (sUrl, sUrlApplicationType, sTargetNavigationMode, bReuseSession) {
        var sTheme,
            getAccessibility = function () {
                var vUrl = utils.getParameterValueBoolean("sap-accessibility");
                if (vUrl !== undefined) {
                    return vUrl;
                }
                return sap.ushell.Container.getUser().getAccessibilityMode();
            },
            getTheme = function () {
                var oResolvedUrlParameters = new UriParameters(sUrl) || { mParams: {} };
            
                // To take care of the precedence of the intent over UI5 configuration
                if (oResolvedUrlParameters.mParams["sap-theme"] === undefined) {
                    return sap.ushell.Container.getUser()
                        .getTheme(User.prototype.constants.themeFormat.NWBC);
                }
                return undefined;
            },
            getStatistics = function () {
                var bAddStatistics = false,
                    oResolvedUrlParameters = new UriParameters(sUrl) || { mParams: {} };

                // To take care of the precedence of the intent over UI5 configuration
                bAddStatistics = sap.ui.getCore().getConfiguration().getStatistics()
                    && oResolvedUrlParameters.mParams["sap-statistics"] === undefined;
                return bAddStatistics;
            },
            getInAppState = function () {
                var sHash = window.hasher && window.hasher.getHash(),
                    sKey = "",
                    aParams;

                if (sHash && sHash.length > 0 && sHash.indexOf("sap-iapp-state=") > 0) {
                    aParams = /(?:sap-iapp-state=)([^&/]+)/.exec(sHash);
                    if (aParams && aParams.length === 2) {
                        sKey = aParams[1];
                    }
                }

                return sKey;
            },
            getDensity = function () {
                var sVal = "";
                var bIsCompact = (!!jQuery("body.sapUiSizeCompact").length);
                var bIsCozy = (!!jQuery("body.sapUiSizeCozy").length);

                if (bIsCompact === true) {
                    sVal = "0";
                } else if (bIsCozy) {
                    sVal = "1";
                }

                return sVal;
            };

        // force IE to edge mode
        sUrl += sUrl.indexOf("?") >= 0 ? "&" : "?";
        sUrl += "sap-ie=edge";
        // transport sap-theme to NWBC HTML
        sTheme = getTheme();

        if (sTheme) {
            sUrl += sUrl.indexOf("?") >= 0 ? "&" : "?";
            sUrl += "sap-theme=" + encodeURIComponent(sTheme);
            // note, we do not replace existing parameters
        }
        if (sTargetNavigationMode) {
            sUrl += sUrl.indexOf("?") >= 0 ? "&" : "?";
            sUrl += "sap-target-navmode=" + encodeURIComponent(sTargetNavigationMode);
            // note, we do not replace existing parameters
        }
        if (getAccessibility()) {
            // propagate accessibility mode
            // Note: This is handled by the WebGUI/WDA framework which expects a value of "X"!
            sUrl += sUrl.indexOf("?") >= 0 ? "&" : "?";
            sUrl += "sap-accessibility=X";
            // note, we do not replace existing parameters
        }
        if (getStatistics()) {
            // propagate statistics = true
            // Note: This is handled by the IFC handler on ABAP, which expects a value of "true" (not "X")
            sUrl += sUrl.indexOf("?") >= 0 ? "&" : "?";
            sUrl += "sap-statistics=true";
            // note, we do not replace existing parameters
        }

        if (bReuseSession) {
            sUrl += sUrl.indexOf("?") >= 0 ? "&" : "?";
            sUrl += "sap-keepclientsession=1";
        }

        var sKey = getInAppState();
        if (sKey && sKey.length > 0) {
            sUrl += sUrl.indexOf("?") >= 0 ? "&" : "?";
            sUrl += "sap-iapp-state=" + sKey;
        }

        var sDensity = getDensity();
        if (sDensity && sDensity.length > 0) {
            sUrl += sUrl.indexOf("?") >= 0 ? "&" : "?";
            sUrl += "sap-touch=" + sDensity;
        }

        return utils.appendSapShellParam(sUrl, sUrlApplicationType);
    }

    /**
     * Renders the SAPUI5 component with the given name and URL. If the child aggregation is already set and no properties have changed,
     * the component is not recreated.
     */
    function renderUi5Component (oRenderManager, oContainer, sUrl, sComponentName) {
        var oChild = oContainer.getAggregation("child");

        if (!oChild || oContainer._bRecreateChild) {
            oChild = ApplicationContainer.prototype._createUi5Component(oContainer, sUrl, sComponentName);
            oContainer._bRecreateChild = false;
        }

        ApplicationContainer.prototype._renderControlInDiv(oRenderManager, oContainer, oChild);
    }

    /**
     * Sets the property with the specified key and value and sets the flag _bPropertyChanged to true
     */
    function setProperty (oContainer, sKey, vValue) {
        var vOldValue = oContainer.getProperty(sKey);

        if (deepEqual(vOldValue, vValue)) {
            return;
        }

        oContainer.setProperty(sKey, vValue);
        oContainer._bRecreateChild = true;
    }

    /**
     * Renders the given container control with the help of the given render manager using the given
     * attributes.
     *
     * @param {sap.ui.core.RenderManager} oRenderManager
     * @param {sap.ushell.components.container.ApplicationContainer} oContainer
     * @param {ApplicationType.enum} sApplicationType
     *   the application type
     * @param {string} sUrl
     *   the base URL
     * @param {string} sAdditionalInformation
     *   the additional information in the form "SAPUI5=&lt;view name&gt;"
     */
    function render (oRenderManager, oContainer, sApplicationType, sUrl, sAdditionalInformation) {
        var fnLogout;

        // remove container from list of NWBC-containing containers
        // (if this container was an NWBC container before)
        localStorage.removeItem(oContainer.globalDirtyStorageKey);

        // render as SAPUI5 component if specified in additionalInformation
        if (sAdditionalInformation &&
            sAdditionalInformation.indexOf("SAPUI5.Component=") === 0 &&
            sApplicationType === ApplicationType.URL.type) {

            renderUi5Component(oRenderManager, oContainer, sUrl, sAdditionalInformation.replace(/^SAPUI5\.Component=/, ""));
            return;
        }

        // render as SAPUI5 view if specified in additionalInformation
        if (sAdditionalInformation
            && sAdditionalInformation.indexOf("SAPUI5=") === 0
            && sApplicationType === ApplicationType.URL.type) {
            ApplicationContainer.prototype._renderControlInDiv(oRenderManager, oContainer,
                ApplicationContainer.prototype._createUi5View(oContainer, sUrl, sAdditionalInformation));
            return;
        }
        jQuery.sap.log.debug("Not resolved as \"SAPUI5.Component=\" or \"SAPUI5=\" , " +
            "will attempt to load into iframe " + sAdditionalInformation);

        if (!oContainer.getActive()) {
            jQuery.sap.log.debug("Skipping rendering container iframe", "Container '" + oContainer.getId() + "' is inactive");
            return;
        }

        try {
            sUrl = oContainer.getFrameSource(sApplicationType, sUrl, sAdditionalInformation);
        } catch (ex) {
            jQuery.sap.log.error(ex.message || ex, null, sCOMPONENT);
            oContainer.fireEvent("applicationConfiguration");
            oRenderManager.renderControl(ApplicationContainer.prototype._createErrorControl());
            return;
        }

        if (sap.ushell.Container) {
            fnLogout = ApplicationContainer.prototype._getLogoutHandler(oContainer);
            if (!fnLogout) {
                if (utils.isApplicationTypeEmbeddedInIframe(sApplicationType)) {
                    // create only for NWBC if not already existing
                    fnLogout = ApplicationContainer.prototype._logout.bind(null, oContainer);
                    mLogouts.put(oContainer.getId(), fnLogout);
                    sap.ushell.Container.attachLogoutEvent(fnLogout);
                    sap.ushell.Container.addRemoteSystem(ApplicationContainer.prototype._createSystemForUrl(sUrl));
                }
            } else if (!utils.isApplicationTypeEmbeddedInIframe(sApplicationType)) {
                // detach if not used *anymore*
                sap.ushell.Container.detachLogoutEvent(fnLogout);
                mLogouts.remove(oContainer.getId());
            }
        }

        if (utils.isApplicationTypeEmbeddedInIframe(sApplicationType)) {
            var sTargetNavigationMode = oContainer.getTargetNavigationMode();

            // amend already resolved url with additional parameters
            sUrl = ApplicationContainer.prototype._adjustNwbcUrl(sUrl, sApplicationType, sTargetNavigationMode, oContainer.getIsStateful());

            // add this container to list of NWBC-containing containers
            utils.localStorageSetItem(oContainer.globalDirtyStorageKey,
                sap.ushell.Container.DirtyState.INITIAL);
        }

        //for local environment without URL template
        sUrl = adjustURLForIsolationOpeningWithoutURLTemplate(sUrl);

        //This block is relevant for "Starting WebGUI/WebDynpro apps with a POST" BLI since 1.68
        if (oContainer.getIframeWithPost() === true && utils.isApplicationTypeEmbeddedInIframe(sApplicationType)) {
            oContainer.oDeferredRenderer = new jQuery.Deferred();
            sUrl = ApplicationContainer.prototype._filterURLParams(sUrl);
            var aInfoArray = [];
            var aKeysArray = ApplicationContainer.prototype._getParamKeys(sUrl, aInfoArray);

            //generate the <div> element that wraps the <form> and the <iframe>
            ApplicationContainer.prototype._generateRootElementForIFrame(oRenderManager, oContainer, true);

            if (aKeysArray.length > 0) {
                var oCAService = sap.ushell.Container.getService("CrossApplicationNavigation");

                oCAService.getAppStateData(aKeysArray).then(function (aDataArray) {
                    var oNewRenderManager;
                    var oDomRef = jQuery("#" + oContainer.getId());
                    if (oDomRef) {
                        oNewRenderManager = sap.ui.getCore().createRenderManager();
                        ApplicationContainer.prototype._buildHTMLElements(oNewRenderManager, oContainer, aDataArray, aInfoArray, sUrl, true);

                        oNewRenderManager.flush(oDomRef[0]);
                        oNewRenderManager.destroy();
                        oContainer.oDeferredRenderer.resolve();
                    }
                }, function (sError) {
                    ApplicationContainer.prototype._buildHTMLElements(oRenderManager, oContainer, undefined, aInfoArray, sUrl, true);
                    oContainer.oDeferredRenderer.resolve();
                });
            } else {
                ApplicationContainer.prototype._buildHTMLElements(oRenderManager, oContainer, undefined, aInfoArray, sUrl, false);
                oContainer.oDeferredRenderer.resolve();
            }

            ApplicationContainer.prototype._generateRootElementForIFrame(oRenderManager, oContainer, false);
            return;
        }

        // embed URL via <IFRAME>
        oContainer.fireEvent("applicationConfiguration");
        oRenderManager
            .write("<iframe")
            .writeControlData(oContainer)
            .writeAccessibilityState(oContainer)
            .writeAttributeEscaped("src", sUrl)
            .addClass("sapUShellApplicationContainer")
            .writeClasses(oContainer)
            .addStyle("height", oContainer.getHeight())
            .addStyle("width", oContainer.getWidth())
            .writeStyles()
            .write("></iframe>");
    }

    function adjustURLForIsolationOpeningWithoutURLTemplate (sUrl) {
        var oURI = new URI();

        if (oURI.query(true).hasOwnProperty("sap-isolation-enabled")) {
            var oParser = sap.ushell.Container.getService("URLParsing"),
                sHash = oParser.getHash(oURI.toString());
            if (sHash) {
                var oHash = oParser.parseShellHash("#" + sHash),
                    sParams = oParser.paramsToString(oHash.params);
                if (sParams && sParams.length >= 0) {
                    var oState1 = sap.ushell.Container.getService("AppState").createEmptyAppState(),
                        oState2 = sap.ushell.Container.getService("AppState").createEmptyAppState(),
                        sStartupParams = "";
                    if (sParams.indexOf("sap-intent-param") >= 0) {
                        sStartupParams = encodeURIComponent(sParams);
                    } else {
                        oState1.setData(sParams);
                        oState1.save();
                        sStartupParams = encodeURIComponent("sap-intent-param=" + oState1.getKey());
                    }
                    oState2.setData("sap-startup-params=" + sStartupParams);
                    oState2.save();
                    sUrl = sUrl.split("#")[0] + "&sap-intent-param=" + oState2.getKey() + "#" + window.hasher.getHash();
                } else {
                    sUrl = sUrl.split("#")[0] + "#" + window.hasher.getHash();
                }
            } else {
                sUrl += "#" + window.hasher.getHash();
            }
        }

        return sUrl;
    }

    function filterURLParams (sUrl) {
        var uri = new URI(sUrl);
        uri = uri.removeSearch(URL_PARAMS_FILTER);
        return uri.toString();
    }

    function getParamKeys (sUrl, aInfoArray) {
        var aAppStateKeysArray = [],
            aParams;

        if (sUrl.indexOf("sap-intent-param=") > 0) {
            aParams = /(?:sap-intent-param=)([^&/]+)/.exec(sUrl);
            if (aParams && aParams.length === 2) {
                aAppStateKeysArray.push([aParams[1]]);
                aInfoArray.push("sap-intent-param-data");
            }
        }

        if (sUrl.indexOf("sap-xapp-state=") > 0) {
            aParams = /(?:sap-xapp-state=)([^&/]+)/.exec(sUrl);
            if (aParams && aParams.length === 2) {
                aAppStateKeysArray.push([aParams[1]]);
                aInfoArray.push("sap-xapp-state-data");
            }
        }

        if (sUrl.indexOf("sap-iapp-state=") > 0) {
            aParams = /(?:sap-iapp-state=)([^&/]+)/.exec(sUrl);
            if (aParams && aParams.length === 2) {
                aAppStateKeysArray.push([aParams[1]]);
                aInfoArray.push("sap-iapp-state-data");
            }
        }

        return aAppStateKeysArray;
    }

    function buildHTMLElements (oRenderManager, oContainer, aAdditionalDataArray, aInfoArray, sUrl, bIsDelayedRendering) {
        var sFormId = oContainer.getId() + "-form",
            statement = "",
            sStatements = "",
            bIsHidden = false;

        if (aAdditionalDataArray === undefined) {
            aAdditionalDataArray = [];
        }
        aAdditionalDataArray.push([sap.ushell.Container.getFLPUrl(true)]);
        aInfoArray.push("sap-flp-url");

        var data = "";
        aInfoArray.forEach(function (item, index) {
            if (aAdditionalDataArray[index][0]) {
                if (typeof aAdditionalDataArray[index][0] === "object") {
                    data = JSON.stringify(aAdditionalDataArray[index][0]);
                } else {
                    data = aAdditionalDataArray[index][0];
                }
                statement = "<input name=\"" + item + "\" value=\"" + encodeXML(data) + "\"/>";
                sStatements += statement;
            }
        });

        oContainer.fireEvent("applicationConfiguration");
        oRenderManager
            .write("<form")
            .writeAttributeEscaped("method", "post")
            .writeAttributeEscaped("id", sFormId)
            .writeAttributeEscaped("name", sFormId)
            .writeAttributeEscaped("target", oContainer.getId() + "-iframe")
            .writeAttributeEscaped("action", sUrl)
            .addStyle("display", "none")
            .writeStyles()
            .write(">")
            .writeAttributeEscaped(sStatements)
            .write("</form>");

        // When sending a POST request, we concatenate the string "-iframe" to the 'id' attribute of the <iframe> node.
        // The reason is that in POST request the IFRAME element is a child of a new 'div' element, that holds the
        // original id of the <iframe> node, and in order not to associate them with them with the same id we add this string.
        var sID = oContainer.sId;
        if (!bIsDelayedRendering && oContainer.hasStyleClass("hidden")) {
            bIsHidden = true;
            oContainer.toggleStyleClass("hidden", false);
        }

        oContainer.sId += "-iframe";
        oRenderManager
            .write("<iframe")
            .writeAttributeEscaped("name", oContainer.getId())
            .writeControlData(oContainer)
            .writeAccessibilityState(oContainer)
            .writeAttributeEscaped("sap-orig-src", sUrl)
            .addClass("sapUShellApplicationContainer")
            .writeClasses(oContainer)
            .addStyle("height", oContainer.getHeight())
            .addStyle("width", oContainer.getWidth())
            .writeStyles()
            .write("></iframe>");

        // Set the oContainer.sId back to its original value (without the string "-iframe")
        oContainer.sId = sID;

        if (bIsHidden) {
            oContainer.toggleStyleClass("hidden", true);
        }

        // The form submission happens in the onAfterRendering()
    }

    function generateRootElementForIFrame (oRenderManager, oContainer, bStart) {
        if (bStart) {
            oRenderManager.write("<div")
                .writeControlData(oContainer)
                .writeAttributeEscaped("sap-iframe-app", "true")
                .addClass("sapUShellApplicationContainer")
                .writeClasses(oContainer)
                .addStyle("height", oContainer.getHeight())
                .addStyle("width", oContainer.getWidth())
                .writeStyles()
                .write(">");
        } else {
            oRenderManager.write("</div>");
        }
    }

    /**
     * Creates a new container control embedding the application with the given URL. The default
     * application type is "URL" and allows to embed web applications into an <code>IFRAME</code>.
     * By default, the container is visible and occupies the whole width and height of its parent.
     *
     * @class A container control capable of embedding a variety of application types.
     * <p>
     * <strong>Experimental API: This container is still under construction, so some
     * implementation details can be changed in future.</strong>
     * </p><p>
     * <b>Note:</b> The browser does not allow to move an <code>IFRAME</code> around in the DOM
     * while keeping its state. Thus every rerendering of this control necessarily resets the
     * embedded web application to its initial state!
     * </p><p>
     * <b>Note:</b> You <b>must</b> <code>exit</code> the control when you no longer need it.
     *
     * </p><p>
     * <b>Embedding SAPUI5 Components:</b>
     * </p><p>
     * The container is able to embed an SAPUI5 component. It is embedded directly into the page,
     * no <code>IFRAME</code> is used.
     * </p><p>
     * SAPUI5 components are described with <code>applicationType</code> "URL", a base URL and the
     * component name in <code>additionalInformation</code>. The format is
     * <code>SAPUI5=<i>componentNamespace</i></code>. The application container will register a
     * module path for the URL with the component's namespace.
     * </p><p>
     * The query parameters from the URL will be passed into the component. They can be retrieved
     * using the method <code>getComponentData()</code>. Query parameters are always passed as
     * arrays (see example 2 below).
     * </p><p>
     * <b>Example 1:</b> Let <code>url</code> be "http://anyhost:1234/path/to/app" and
     * <code>additionalInformation</code> be "SAPUI5=some.random.package". Then the
     * container registers the path "http://anyhost:1234/path/to/app/some/random/package" for the
     * namespace "some.random.package", loads and creates "some.random.package.Component".
     * </p><p>
     * <b>Example 2:</b> Let <code>url</code> be "http://anyhost:1234/?foo=bar&foo=baz&bar=baz".
     * Then the <code>componentData</code> object will be
     * <code>{foo: ["bar", "baz"], bar: ["baz"]}</code>.
     * </p><p>
     * <b>Warning:</b> The container control embeds a <i>component</i> only. This can only work if
     * this component is fully encapsulated and properly declares all dependencies in its metadata
     * object. If you want to support that your component can be embedded into a shell using this
     * container, you have to prepare it accordingly:
     * <ul>
     * <li>The container control can only embed components that originate on the same server as the
     * shell due to the browser's same origin policy. Consider using an SAP Web Dispatcher if this
     * is not the case.
     * <li>If your component relies on some additional Javascript, declare the dependencies to
     * libraries or other components in the component's metadata object.
     * <li>Do <i>not</i> use <code>jQuery.sap.registerModulePath()</code> with a relative URL. The
     * base for this relative URL is the web page. And this page is the shell when embedding the
     * component via the container, not the page you used when developing the component.
     * <li>If your component needs additional styles, declare them using the <code>includes</code>
     * property of the component metadata object.
     * <li> Consider calling <code>jQuery.sap.getModulePath(&lt;componentName&gt;)</code> to
     * determine the root path of your component.
     * <li>If any of these requirements is not met, it is still possible to embed this view with
     * its own page using <code>applicationType="URL"</code>, no <code>additionalInformation</code>
     * and the URL of the web page in <code>url</code>. Then of course it is embedded using an
     * <code>IFRAME</code>. This has many limitations, especially the resource-based navigation
     * using hash changes will not be supported.
     * </ul>
     *
     * </p><p>
     * <b>Embedding SAPUI5 Views</b>
     * <p>
     * Embedding views is <strong>deprecated</strong> and might not be supported in future versions.
     * </p>
     * <p>
     * It is also possible to embed a SAPUI5 view. It is embedded directly into the page, no
     * <code>IFRAME</code> is used.
     * </p><p>
     * SAPUI5 views are described with <code>applicationType</code> "URL", a base URL and the view
     * description in <code>additionalInformation</code>. The format is
     * <code>SAPUI5=<i>namespace</i>.<i>viewName</i>.view.<i>viewType</i></code>. From
     * this information the module path and the view URL is determined. Request parameters present
     * in the URL will be passed to the created view and can be accessed via
     * <code>sap.ui.core.mvc.View#getViewData()</code>. The object passed to the view data is the
     * same as describe for the component data above.
     * </p><p>
     * <b>Warning:</b> The container control embeds a <i>view</i> only. So similar restrictions
     * as for components apply. Since the view has no metadata object to describe dependencies you
     * will have to use <code>jQuery.sap.require()</code> to load needed modules and
     * <code>jQuery.sap.includeStyleSheet()</code> to load additional styles.
     *
     * @extends sap.ui.core.Control
     * @name sap.ushell.components.container.ApplicationContainer
     * @since 1.15.0
     *
     * @property {string} [additionalInformation=""]
     *   Additional information about the application. Currently this is used to describe a SAPUI5
     *   component or a view in a SAPUI5 application.
     * @property {object} [application]
     *   The application descriptor as received from the start-up service. If an application is
     *   given the properties <code>url</code>, <code>applicationType</code> and
     *   <code>additionalInformation</code> are taken from the application and <i>not</i> from the
     *   control properties.
     * @property {object} [applicationConfiguration]
     *   The configuration data of this application as defined in the application descriptor
     *    or in the flexible configuration object.
     * @property {object} [componentHandle]
     *   The component handle - for SAPUI5 components, this contains a handle to the
     *   component metadata and constructor which might already be loaded
     * @property {ApplicationType.enum} [applicationType="URL"]
     *   The type of the embedded application.
     * @property {sap.ui.core.CSSSize} [height="100%"]
     *   The container's height as a CSS size. This attribute is provided to the browser "as is"!
     *   <b>Note:</b> The HTML 4.01 specification allows pixels and percentages,
     *   but the HTML 5 specification allows pixels only!
     * @property {string} url
     *   The URL to the embedded application.
     * @property {boolean} [visible="true"]
     *   Whether the container control is visible at all. <b>Note:</b> An invisible container does
     *   not render any DOM content. Changing the visibility leads to rerendering!
     * @property {sap.ui.core.CSSSize} [width="100%"]
     *   The container's width as a CSS size. This attribute is provided to the browser "as is"!
     *   <b>Note:</b> The HTML 4.01 specification allows pixels and percentages,
     *   but the HTML 5 specification allows pixels only!
     */
    /**
     * Event which is fired when the <code>ApplicationContainer</code> control is rendered. The
     * event holds a technology specific configuration object for the embedded application.
     * As of now, only configuration for an embedded <em>SAPUI5 component</em> is supported.
     *
     * @event
     * @name sap.ushell.components.container.ApplicationContainer.applicationConfiguration
     * @param {object} configuration
     *     The technology specific configuration object of the embedded application.
     *     <code>undefined</code>, if the <code>ApplicationContainer</code> control does not
     *     provide a configuration for the technology of the embedded application or if there is a
     *     rendering issue with the application.<br/>
     *     For SAPUI5 components, the <code>config</code> property of the component metadata is
     *     provided.
     *
     * @public
     */
    var ApplicationContainer = Control.extend(sCOMPONENT, {
        metadata: {
            properties: {
                additionalInformation: { defaultValue: "", type: "string" },
                application: { type: "object" },
                applicationConfiguration: { type: "object" },
                applicationType: { defaultValue: "URL", type: sPREFIX + "ApplicationType" },
                height: { defaultValue: "100%", type: "sap.ui.core.CSSSize" },
                navigationMode: { defaultValue: "", type: "string" },
                targetNavigationMode: { defaultValue: "", type: "string" },
                text: { defaultValue: "", type: "string" },
                url: { defaultValue: "", type: "string" },
                visible: { defaultValue: true, type: "boolean" },
                active: { defaultValue: true, type: "boolean" },
                "sap-system": { type: "string" },
                applicationDependencies: { type: "object" },
                componentHandle: { type: "object" },
                ui5ComponentName: { type: "string" },
                width: { defaultValue: "100%", type: "sap.ui.core.CSSSize" },
                shellUIService: { type: "object" },
                appIsolationService: { type: "object" },
                reservedParameters: { type: "object" },
                coreResourcesFullyLoaded: { type: "boolean" },
                isStateful: { defaultValue: false, type: "boolean" },
                iframeHandlers: { defaultValue: "", type: "string" },
                iframeWithPost: { defaultValue: false, type: "boolean" },
                beforeAppCloseEvent: { type: "object" }
            },
            events: {
                "applicationConfiguration": {}
            },
            aggregations: {
                child: { multiple: false, type: "sap.ui.core.Control", visibility: "hidden" }
            },
            library: "sap.ushell",
            designtime: "sap/ushell/designtime/ApplicationContainer.designtime"
        },

        exit: function () {
            var fnLogout,
                that = this;
            if (sap.ushell.Container) {
                fnLogout = ApplicationContainer.prototype._getLogoutHandler(that);
                if (fnLogout) {
                    sap.ushell.Container.detachLogoutEvent(fnLogout);
                    mLogouts.remove(that.getId());
                }
            }
            // remove container from list of NWBC-containing containers
            // (if this container was an NWBC container before)
            localStorage.removeItem(that.globalDirtyStorageKey);

            // remove all event listeners
            if (that._unloadEventListener) {
                removeEventListener("unload", that._unloadEventListener);
            }

            if (that._disableRouterEventHandler) {
                sap.ui.getCore().getEventBus().unsubscribe("sap.ushell.components.container.ApplicationContainer", "_prior.newUI5ComponentInstantion", that._disableRouterEventHandler);//{ sValue : sServiceUrl }
            }

            if (that._storageEventListener) {
                removeEventListener("storage", that._storageEventListener);
            }

            if (that._messageEventListener) {
                removeEventListener("message", that._messageEventListener);
            }

            ApplicationContainer.prototype._destroyChild(that);

            // just to be sure in case it will be added some time
            if (Control.exit) {
                Control.exit.apply(that);
            }
        },

        setHandleMessageEvent: function (inFnHandleMessageEvent) {
            fnHandleMessageEvent = inFnHandleMessageEvent;
        },

        /**
         * Initialization of <code>ApplicationContainer</code> instance.
         */
        init: function () {
            var that = this;
            that.globalDirtyStorageKey = sDIRTY_STATE_PREFIX + fnGetUid();

            if (new UriParameters(window.location.href).get("sap-post") === "true") {
                that.setIframeWithPost(true);
            }

            // be sure to remove entry from list of NWBC-containing containers
            // when the window is closed
            that._unloadEventListener = that.exit.bind(that);
            addEventListener("unload", that._unloadEventListener); //TODO doesn't work in IE9 when F5 is pressed?!

            that._storageEventListener = function (oStorageEvent) {
                var sApplicationType = that.getApplicationType();
                if (oStorageEvent.key === that.globalDirtyStorageKey
                    && oStorageEvent.newValue === sap.ushell.Container.DirtyState.PENDING
                    && utils.isApplicationTypeEmbeddedInIframe(sApplicationType)) {

                    var oIframe = that._getIFrame();
                    if (oIframe) {
                        jQuery.sap.log.debug(
                            "getGlobalDirty() send pro54_getGlobalDirty ",
                            null,
                            "sap.ushell.components.container.ApplicationContainer"
                        );

                        var oUri = new URI(that._getIFrameUrl(oIframe));
                        var targetDomain = oUri.protocol() + "://" + oUri.host();
                        oIframe.contentWindow.postMessage(
                            JSON.stringify({ action: "pro54_getGlobalDirty" }),
                            targetDomain
                        );
                    }
                }
            };
            addEventListener("storage", that._storageEventListener);

            that._messageEventListener = ApplicationContainer.prototype._handleMessageEvent.bind(null, that);
            addEventListener("message", that._messageEventListener);
        },

        onAfterRendering: function (/*oEvent*/) {
            var that = this;

            //always prevent re-rendering of application container
            this.rerender = function () { /* avoid re-rendering of this control */ };

            // iOS Safari ignores CSS width and height of the iframe. The iframe is as big as its contents.
            // Scrolling inside of a such an iframe is not possible. Scroll the parent container instead.
            if (Device.os.ios && this.$().prop("tagName") === "IFRAME") {
                this.$().parent().css("overflow", "auto");
            }

            if (this.oDeferredRenderer) {
                this.oDeferredRenderer.done(function () {
                    var oForm = document.getElementById(that.getId() + "-form");
                    if (oForm) {
                        oForm.submit();
                    }
                });
            }
        },

        /**
         * Renders the given container control with the help of the given render manager.
         *
         * @param {sap.ui.core.RenderManager} oRenderManager
         * @param {sap.ushell.components.container.ApplicationContainer} oContainer
         *
         * @private
         */
        renderer: function (oRenderManager, oContainer) {
            // Note: "this" refers to the renderer instance, which does not matter here!
            var oApplication = oContainer.getApplication(),
                oLaunchpadData = oContainer.launchpadData,
                oLoadingIndicator;

            if (!oContainer.getVisible()) {
                // Note: even invisible controls need to render their ID for later re-rendering
                ApplicationContainer.prototype._renderControlInDiv(oRenderManager, oContainer);
                return;
            }

            if (oContainer.error) {
                delete oContainer.error;
                ApplicationContainer.prototype._renderControlInDiv(oRenderManager, oContainer, ApplicationContainer.prototype._createErrorControl());
            } else if (!oApplication) {
                // the standard properties
                ApplicationContainer.prototype._render(oRenderManager, oContainer, oContainer.getApplicationType(),
                    oContainer.getUrl(), oContainer.getAdditionalInformation());
            } else if (!oApplication.isResolvable()) {
                // the standard application data
                ApplicationContainer.prototype._render(oRenderManager, oContainer, oApplication.getType(),
                    oApplication.getUrl(), "");
            } else if (oLaunchpadData) {
                // the application, already resolved
                // Note that ResolveLink appends a "?" to the URL if additionalData (aka
                // additionalInformation) is supplied.
                ApplicationContainer.prototype._render(oRenderManager, oContainer, oLaunchpadData.applicationType,
                    oLaunchpadData.Absolute.url.replace(/\?$/, ""),
                    oLaunchpadData.applicationData);
            } else {
                jQuery.sap.log.debug("Resolving " + oApplication.getUrl(), null,
                    sCOMPONENT);

                oApplication.resolve(function (oResolved) {
                    jQuery.sap.log.debug("Resolved " + oApplication.getUrl(),
                        JSON.stringify(oResolved),
                        sCOMPONENT);
                    // TODO: where to keep the internal property launchpadData? At the Application!
                    oContainer.launchpadData = oResolved;
                    ApplicationContainer.prototype._destroyChild(oContainer);
                }, function (sError) {
                    var fnApplicationErrorHandler = oApplication.getMenu().getDefaultErrorHandler();
                    if (fnApplicationErrorHandler) {
                        fnApplicationErrorHandler(sError);
                    }
                    ApplicationContainer.prototype._destroyChild(oContainer);
                    oContainer.error = sError;
                });
                oLoadingIndicator = new Text({
                    text: ApplicationContainer.prototype._getTranslatedText("loading", [oApplication.getText()])
                });
                ApplicationContainer.prototype._destroyChild(oContainer);
                oContainer.setAggregation("child", oLoadingIndicator);
                ApplicationContainer.prototype._renderControlInDiv(oRenderManager, oContainer, oLoadingIndicator);
            }
        }
    });

    /**
     * Returns the resulting source URL for the (internal) frame used to embed the given application.
     * This hook method may be overridden; we recommend to replace it per object, not at the
     * prototype.
     * <p>
     * The default implementation returns the URL "as is", but checks that the given application
     * type is one of <code>ApplicationType.enum</code> and throws
     * an error in case it is not. It ignores the additional information.
     * <p>
     * You may want to end your implementation with
     * <code>return
     * sap.ushell.components.container.ApplicationContainer.prototype.getFrameSource.call(this,
     * sApplicationType, sUrl, sAdditionalInformation);</code> in order to reuse the default
     * behavior. To override the error checks, simply replace any additional application types you
     * wish to support with <code>ApplicationType.enum.URL</code>.
     *
     * @param {ApplicationType.enum} sApplicationType
     *   the application type
     * @param {string} sUrl
     *   the base URL
     * @param {string} sAdditionalInformation
     *   the additional information
     * @returns {string}
     * @since 1.15.0
     */
    ApplicationContainer.prototype.getFrameSource
        = function (sApplicationType, sUrl/*, sAdditionalInformation*/) {
            if (!Object.prototype.hasOwnProperty.call(
                ApplicationType.enum,
                sApplicationType
            )) {
                // Note: do not use sap.ushell.utils.Error here as the exception is already caught
                // and logged in render()
                throw new Error("Illegal application type: " + sApplicationType);
            }
            return sUrl;
        };

    // overwrite setters to trigger component recreation only if relevant properties have changed
    ApplicationContainer.prototype.setUrl = function (sValue) {
        setProperty(this, "url", sValue);
    };

    ApplicationContainer.prototype.setAdditionalInformation = function (sValue) {
        setProperty(this, "additionalInformation", sValue);
    };

    ApplicationContainer.prototype.setApplicationType = function (sValue) {
        setProperty(this, "applicationType", sValue);
    };

    ApplicationContainer.prototype.createPostMessageRequest = function (sServiceName, oMessageBody) {
        var sRequestId = Date.now().toString();

        return {
            "type": "request",
            "request_id": sRequestId,
            "service": sServiceName,
            "body": oMessageBody
        };
    };

    ApplicationContainer.prototype.setNewTRApplicationContext = function (sUrl) {
        var oIFrame = this._getIFrame();
        if (!oIFrame) {
            return Promise.reject({
                message: "Expected an exisiting TR application application frame but found none."
            });
        }

        sUrl = utils.appendSapShellParam(sUrl);
        var oRequestMessage = this.createPostMessageRequest("sap.its.startService", {
            "url": sUrl
        });

        return this.postMessageToIframe(oRequestMessage, oIFrame, true /* bWaitForResponse */).catch(function (oEventData) {
            return Promise.reject({
                eventData: oEventData,
                message: "Failed to change application context."
            });
        });
    };

    /**
     * Sends a postMessage to the given IFrame following a specific Post
     * Message Protocol, waiting for a response.
     *
     * @param {object} oMessage
     *  A message object like:
     *  <pre>
     *   {
     *       "type": "request",
     *       "request_id": "1234567",
     *       "service": "some.target.serviceName",
     *       "body": {
     *           // ...
     *       }
     *   };
     *  </pre>
     * @param {object} oIFrame
     *  The IFrame to post the message to.
     * @param {boolean} [bWaitForResponse]
     *  Whether to wait for response or just send the message.
     * @return {Promise}
     *  If <code>bWaitForResponse</code> is false, returns a promise that
     *  resolves to undefined after posting the message to the iframe.
     *  If <code>bWaitForResponse</code> is true, returns a promise resolving
     *  or rejecting with the response from the sent message. The promise is
     *  only rejected when it is certain that the operation is unsuccessful
     *  (i.e., the endpoint genuinely flagged the failure occurred). The
     *  promise is not rejected when the response cannot be parsed. In this
     *  case a debug and a warning message is logged. The called service can
     *  send another response in this case.
     *  The called service cannot post multiple responses if a valid
     *  (successful or unsuccessful) response was already posted.
     *
     * @private
     */
    ApplicationContainer.prototype.postMessageToIframe = function (oMessage, oIFrame, bWaitForResponse) {
        var that = this;
        var sRequestId = oMessage.request_id;

        return new Promise(function (fnNotifySuccess, fnNotifyError) {
            function fnProcessClientMessage (oEvent) {
                var oEventData;

                try {
                    oEventData = JSON.parse(oEvent.data, that);

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

            var sMessage = JSON.stringify(oMessage);
            jQuery.sap.log.debug("Sending postMessage " + sMessage + " to application container '" + that.getId() + "'");

            var oUri = new URI(that._getIFrameUrl(oIFrame));
            var targetDomain = oUri.protocol() + "://" + oUri.host();

            if (bWaitForResponse) {
                window.addEventListener("message", fnProcessClientMessage, false);
                oIFrame.contentWindow.postMessage(sMessage, targetDomain);
            } else {
                oIFrame.contentWindow.postMessage(sMessage, targetDomain);
                fnNotifySuccess();
            }
        });
    };

    ApplicationContainer.prototype.postMessageToCurrentIframe = function (oMessage, bWaitForResponse) {
        if (bWaitForResponse === undefined) {
            bWaitForResponse = false;
        }
        var oIFrame = this._getIFrame();
        if (!oIFrame) {
            if (bWaitForResponse) {
                return Promise.reject({ message: "Expected opened iframe not found." });
            }
            return;
        }

        return this.postMessageToIframe(oMessage, oIFrame, bWaitForResponse);
    };

    ApplicationContainer.prototype.setNewApplicationContext = function (sApplicationType, sUrl) {
        var that = this;
        // Consider that we can have different procedures for setting a new context
        // for applications of different types e.g. TR, UI5, NWBC, WDA etc.
        //
        // In general an arbitrary application type identified as 'XYZ' should
        // conventionally have a method that implements setting a new context
        // for it with the name 'setNewXYZApplicationContext'.
        //
        // So, we dynamically find the method for handling the respective type as
        // follows:
        var fnSetNewContext = this["setNew" + sApplicationType + "ApplicationContext"];
        if (!fnSetNewContext) {
            return Promise.reject({
                message: "Unsupported application type"
            });
        }

        var oIFrame = this._getIFrame();
        if (!oIFrame) {
            return Promise.reject({
                message: "Expected an exisiting TR application application frame but found none."
            });
        }

        // Ensure session is closed before navigating, otherwise inplace navigation breaks
        var oRequestMessage = this.createPostMessageRequest("sap.gui.triggerCloseSessionImmediately", {});
        return this.postMessageToIframe(oRequestMessage, oIFrame, true/* bWaitForResponse */)
            .then(
                function () {
                    return fnSetNewContext.call(that, sUrl);
                },
                function (oEventData) {
                    return Promise.reject({
                        eventData: oEventData,
                        message: "Failed to change application context."
                    });
                }
            );
    };

    /**
     * Method called by the shell controller after the next application is opened.
     *
     * @param {string} sNextApplicationType
     *   The application type of the currently opened application.
     *
     * @private
     */
    ApplicationContainer.prototype.onApplicationOpened = function (sNextApplicationType) {
        var bIsStatefulContainer = this.getIsStateful();
        if (!bIsStatefulContainer) {
            return Promise.resolve();
        }

        var sMyApplicationType = this.getApplicationType();
        if (sMyApplicationType === "TR" && sNextApplicationType !== "TR") {

            var oIFrame = this._getIFrame();
            if (!oIFrame) {
                return Promise.reject({
                    message: "Expected an exisiting TR application application frame but found none."
                });
            }

            var oRequestMessage = this.createPostMessageRequest("sap.gui.triggerCloseSession", {});

            return this.postMessageToIframe(oRequestMessage, oIFrame, false /* bWaitForResponse */).catch(function (oEventData) {
                return Promise.reject({
                    eventData: oEventData,
                    message: "Failed to change application context."
                });
            });
        }

        return Promise.resolve();
    };

    /**
     * Method called by the appLifeCycle to post messages to IFrame
     *
     * @param {string} sMessage
     *   the post message to be created
     *
     * @private
     */
    ApplicationContainer.prototype.postMessageRequest = function (sMessage, oBody) {
        var oIFrame = this._getIFrame();
        if (!oIFrame) {
            return Promise.reject({
                message: "Expected an exisiting TR application application frame but found none."
            });
        }

        var oRequestMessage = this.createPostMessageRequest(sMessage, oBody || {});
        return this.postMessageToIframe(oRequestMessage, oIFrame, false /* bWaitForResponse */).catch(function (oEventData) {
            return Promise.reject({
                eventData: oEventData,
                message: "Failed to post message."
            });
        });
    };

    /**
     * Method called by the appLifeCycle to post a "before close" message to the app
     * running in the iframe before the iframe its destroyed.
     * The message is sent only if the iframe registered to be informed with this message.
     * This mechanism was added to solve the change made in Chrome to disallow Sync XHR on
     * browser close.
     *
     * @return {Promise}
     *  A promise object in case a post message is sent, and "undefined" in case no message needs
     *  to be sent. In case of real promise, it will be resolved when the iframe response back that
     *  it processed the message.
     *
     * @private
     */
    ApplicationContainer.prototype.sendBeforeAppCloseEvent = function () {
        var oEventData = this.getBeforeAppCloseEvent && this.getBeforeAppCloseEvent(),
            oRequestMessage;
        if (oEventData && oEventData.enabled && oEventData.enabled === true) {
            oRequestMessage = this.createPostMessageRequest("sap.ushell.services.CrossApplicationNavigation.beforeAppCloseEvent", oEventData.params);
            return this.postMessageToIframe(oRequestMessage, this._getIFrame(), true);
        } else {
            return undefined;
        }
    };

    //Attach private functions which should be testable via unit tests to the prototype of the ApplicationContainer
    //to make them available outside for testing.
    ApplicationContainer.prototype._getCommunicationHandlers = getCommunicationHandlers;
    ApplicationContainer.prototype._adaptIsUrlSupportedResultForMessagePopover = adaptIsUrlSupportedResultForMessagePopover;
    ApplicationContainer.prototype._getLogoutHandler = getLogoutHandler;
    ApplicationContainer.prototype._getParameterMap = getParameterMap;
    ApplicationContainer.prototype._getTranslatedText = getTranslatedText;
    ApplicationContainer.prototype._createErrorControl = createErrorControl;
    ApplicationContainer.prototype._destroyChild = destroyChild;
    ApplicationContainer.prototype._createUi5View = createUi5View;
    ApplicationContainer.prototype._publishExternalEvent = publishExternalEvent;
    ApplicationContainer.prototype._createUi5Component = createUi5Component;
    ApplicationContainer.prototype._disableRouter = disableRouter;
    ApplicationContainer.prototype._createSystemForUrl = createSystemForUrl;
    ApplicationContainer.prototype._isTrustedPostMessageSource = isTrustedPostMessageSource;
    ApplicationContainer.prototype._handleMessageEvent = handleMessageEvent;
    ApplicationContainer.prototype._logout = logout;
    ApplicationContainer.prototype._renderControlInDiv = renderControlInDiv;
    ApplicationContainer.prototype._adjustNwbcUrl = adjustNwbcUrl;
    ApplicationContainer.prototype._render = render;
    ApplicationContainer.prototype._getParamKeys = getParamKeys;
    ApplicationContainer.prototype._buildHTMLElements = buildHTMLElements;
    ApplicationContainer.prototype._generateRootElementForIFrame = generateRootElementForIFrame;
    ApplicationContainer.prototype._backButtonPressedCallback = backButtonPressedCallback;
    ApplicationContainer.prototype._getIFrame = getIFrame;
    ApplicationContainer.prototype._getIFrameUrl = getIFrameUrl;
    ApplicationContainer.prototype._filterURLParams = filterURLParams;

    return ApplicationContainer;
}, true);
