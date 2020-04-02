// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview ClientSideTargetResolutionAdapter for the abap platform.
 *
 * The ClientSideTargetResolutionAdapter must perform the following two task:
 *   <ul>
 *     <li>provide the getInbounds method to return the list of Target Mappings used by ClientSideTargetResolution service;</li>
 *     <li>provide the resolveHashFragmentFallback function, a fallback method called by ClientSideTargetResolution service.</li>
 *   </ul>
 *
 * @version 1.74.0
 */
sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/base/util/ObjectPath",
    "sap/base/util/isPlainObject",
    "sap/ushell/utils",
    "sap/ui2/srvc/ODataWrapper" // required for "sap.ui2.srvc.createODataWrapper"
], function (
    jQuery,
    ObjectPath,
    isPlainObject,
    ushellUtils
    // ODataWrapper
) {
    "use strict";

    var S_COMPONENT = "sap.ushell_abap.adapters.abap.ClientSideTargetResolutionAdapter",
        // list of parameters which are wd relevant and should not be compacted
        aNotCompactedWDAParameters = [
            "sap-wd-configId",
            "SAP-WD-CONFIGID",
            "sap-client",
            "SAP-CLIENT",
            "System",
            "SYSTEM",
            "sap-language",
            "SAP-LANGUAGE",
            "sap-wd-htmlrendermode",
            "sap-wd-deltarendering",
            "wdallowvaluesuggest",
            "sap-wd-lightspeed",
            "sap-wd-remotedesktop",
            "sap-wd-flashdebug",
            "sap-accessibility",
            "sap-theme",
            "sap-*",
            "SAP-*",
            "wd*",
            "WD*"
        ];

    /**
     * Constructs a new instance of the ClientSideTargetResolutionAdapter for the ABAP platform
     *
     * @param {object} oSystem The system served by the adapter
     * @param {string} sParameters Parameter string, not in use
     * @param {object} oAdapterConfig A potential adapter configuration
     *
     * This adapter has the following peculiarity: a member initialSegmentPromise may be present as a configuration member.
     *
     * This member is a thenable which may resolve to invoke a function with a first argument:
     * <code>[aSegments, oTargetMappings, oSystemAliases]</code>
     *
     * When satisfying request to the inbounds, if aSegments is a subset of this initial request, this response may
     * be used if faster than the full request.
     *
     * There is at most one such promise.
     *
     * @constructor
     * @since 1.34.0
     * @private
     */
    var ClientSideTargetResolutionAdapter = function (oSystem, sParameters, oAdapterConfig) {
        var that = this;

        // The local system alias. This adapter uses this hardcoded object to resolve "", the local system alias.
        this._oLocalSystemAlias = {
            http: {
                id: "",
                host: "",
                port: "",
                pathPrefix: "/sap/bc/"
            },
            https: {
                id: "",
                host: "",
                port: "",
                pathPrefix: "/sap/bc/"
            },
            rfc: {
                id: "",
                systemId: "",
                host: "",
                service: 0,
                loginGroup: "",
                sncNameR3: "",
                sncQoPR3: ""
            },
            id: "",
            client: "",
            language: ""
        };

        // if this property is true, the adapter can provide:
        //   a) efficiently cached Full Target resuts,
        //   and b) optionally a segemented result
        this.hasSegmentedAccess = true;
        this._oAdapterConfig = oAdapterConfig && oAdapterConfig.config;

        // the Application container will add some more parameters,
        // thus the URL limit here is lower than the technical target url length limit (<2000).
        this._wdLengthLimit = 1800;

        this._oODataWrapper = undefined;
        this._getODataWrapper = function () {
            if (!this._oODataWrapper) {
                this._oODataWrapper = sap.ui2.srvc.createODataWrapper("/sap/opu/odata/UI2/INTEROP/");
            }
            return this._oODataWrapper;
        };

        /*
         * The variable below is the most complete list of inbounds (i.e., converted target mappings) received so far.
         *
         * Note that it is always overwritten when a full target mapping response is received.
         *
         * Note that it is only set by the initial request if it has not been set by a non-empty result yet!
         * So it's value evolves towards the full response either:
         *   [] -> [initial response] -> [full response]
         *   or
         *   [] -> [full response]
         */
        this._aTargetMappings = []; // write in target mappings initially (convert when needed)
        this._aInbounds = []; // read from here (the converted target mappings)

        // this variable *may* reflect an initial segment as received by the oInitialSegmentPromise
        this._aInitialSegment = undefined;

        this._oSystemAliasBuffer = new ushellUtils.Map();

        this._storeFromFullStartupResponse = function (oFullStartupResult) {
            if (oFullStartupResult) {
                if (oFullStartupResult.targetMappings) {
                    // inbound conversion
                    that._aTargetMappings = oFullStartupResult.targetMappings;
                }
                if (oFullStartupResult.systemAliases) {
                    that._writeUserSystemAliasesToBuffer(oFullStartupResult.systemAliases);
                }
            }
        };

        this._fallbackToFullStartupRequest = function (fnResolve, fnReject) {
            jQuery.sap.log.debug(
                "Falling back to full start_up request from adapter",
                "",
                "sap.ushell_abap.adapters.abap.ClientSideTargetResolutionAdapter"
            );
            that._requestAllTargetMappings()
                .done(function (oFullStartupResult) {
                    that._storeFromFullStartupResponse(oFullStartupResult);
                    fnResolve(); // resolve the full promise
                })
                .fail(function (sMsg) {
                    fnReject(sMsg); // reject the full promise
                });
        };

        this._iTargetMappingsUnusedPromiseRejectCount = 0;
        this._oInitialSegmentPromise = oAdapterConfig && oAdapterConfig.config && oAdapterConfig.config.initialSegmentPromise
            || (new Promise(function (fnResolve, fnReject1) {
                that._iTargetMappingsUnusedPromiseRejectCount++;
                if (that._iTargetMappingsUnusedPromiseRejectCount === 2) {
                    that._fallbackToFullStartupRequest(fnResolve, fnReject1);
                }
            }));
        this._oNavTargetPromise = oAdapterConfig && oAdapterConfig.config && oAdapterConfig.config.navTargetDataPromise
            || (new Promise(function (fnResolve, fnReject2) {
                that._iTargetMappingsUnusedPromiseRejectCount++;
                if (that._iTargetMappingsUnusedPromiseRejectCount === 2) {
                    that._fallbackToFullStartupRequest(fnResolve, fnReject2);
                }
            }));

        this._oInitialSegmentPromise.then(function (aArgs) {
            if (aArgs === null) {
                jQuery.sap.log.debug(
                    "Initial target mappings segment promise resolved with 'null'",
                    "Will not process initial target mappings segments again (mostly likely because this is no longer needed)",
                    "sap.ushell_abap.adapters.abap.ClientSideTargetResolutionAdapter"
                );
                return;
            }

            if (that._aTargetMappings.length === 0) { // ignore if != 0, because the full response came already
                jQuery.sap.log.debug(
                    "Segmented start_up response returned",
                    "storing system aliases and inbounds from segment",
                    "sap.ushell_abap.adapters.abap.ClientSideTargetResolutionAdapter"
                );
                var aRequestedSegments = aArgs[0],
                    aTargetMappings = aArgs[1],
                    aSystemAliases = aArgs[2];

                // we use this as an indicator whether the full request has succeeded
                // can't get worse
                that._aTargetMappings = aTargetMappings;
                that._writeUserSystemAliasesToBuffer(aSystemAliases);
                that._aInitialSegment = aRequestedSegments;
            } else {
                jQuery.sap.log.debug(
                    "Segmented start_up response returned",
                    "ignoring response because the full target mapping response returned before",
                    "sap.ushell_abap.adapters.abap.ClientSideTargetResolutionAdapter"
                );
            }
        }).catch(function (sReason) {
            jQuery.sap.log.error(
                "Initial segment promise was rejected.",
                sReason,
                "sap.ushell_abap.adapters.abap.ClientSideTargetResolutionAdapter"
            );
        });

        this._oNavTargetPromise.then(function (oFullStartupResult) {
            jQuery.sap.log.debug(
                "Full start_up response returned",
                "storing system aliases and inbounds",
                "sap.ushell_abap.adapters.abap.ClientSideTargetResolutionAdapter"
            );
            that._storeFromFullStartupResponse(oFullStartupResult);
        });
    };

    /**
     * Provides fallback resolution for {@link sap.ushell.services.ClientSideTargetResolution#resolveHashFragment}
     * in case the resolution result cannot be determined on the client.
     *
     * @param {string} sOriginalShellHash the hash fragment string originally passed to the resolveHashFragment call
     * @param {object} oInbound the target mapping that matched <code>sOriginalShellHash</code> during
     *   {@link sap.ushell.services.ClientSideTargetResolution#resolveHashFragment}
     * @param {object} oParams the intent parameters (including default parameters) that should be added to the resulting shell hash.
     *   <p>This is an object like:</p>
     *   <pre>
     *   {
     *     "paramName1": ["value1", "value2"], // multiple parameters in URL
     *     "paramName2": ["value3"]
     *   }
     *   </pre>
     * @return {jQuery.Deferred.Promise} a jQuery promise that resolves to an object containing the resolution result as in
     *   {@link sap.ushell.services.ClientSideTargetResolution#resolveHashFragment}
     * @private
     */
    ClientSideTargetResolutionAdapter.prototype.resolveHashFragmentFallback = function (sOriginalShellHash, oInbound, oParams) {
        var sShellHashForLpdCust = this._constructShellHashForLpdCust(oInbound, oParams),
            sSapSystem = oParams && oParams["sap-system"] && oParams["sap-system"][0],
            oDeferredCB = new jQuery.Deferred();

        this._resolveHashFragmentBE(
            sShellHashForLpdCust || sOriginalShellHash
        ).done(function (oResult) {
            // if a sap-system is "only" added per defaulting in the Target Mapping,
            // it is not returned as part of the (NWBC/WDA/WebGui) URL, thus it must be propagated here
            if (oResult && sSapSystem) {
                oResult["sap-system"] = oResult["sap-system"] || sSapSystem;
            }
            oDeferredCB.resolve(oResult);
        }).fail(oDeferredCB.reject.bind(oDeferredCB));

        return oDeferredCB.promise();
    };

    // functions past this point are helpers for the getInbounds function

    /**
     * Produces a list of Inbounds suitable for ClientSideTargetResolution.
     * When aSegment is defined, an initial promise matching the segment may be used to supply the result
     *
     * @param {array} aSegment if present, restricting segment. The function may then return the segment matching this
     * @returns {jQuery.Deferred.Promise} a jQuery promise that resolves to an array of Inbounds in ClientSideTargetResolution format.
     * @private
     */
    ClientSideTargetResolutionAdapter.prototype.getInbounds = function (aSegment) {
        var oDeferred = new jQuery.Deferred(),
            that = this;

        this._oInitialSegmentPromise.then(function (aInitialSegmentAndTargetMappings) {

            if (aInitialSegmentAndTargetMappings === null) {
                /*
                 * When this promise resolved with null it means that target mappings won't be taken from an initial segment ever
                 * in the future (mostly likely because this is not needed, e.g., no direct start).
                 */
                return;
            }

            if (that._isInSegment(aSegment, that._aInitialSegment)) {
                jQuery.sap.log.debug(
                    "Got inbounds from initial segment",
                    "",
                    "sap.ushell_abap.adapters.abap.ClientSideTargetResolutionAdapter"
                );
                that._aInbounds = that._formatDirectStart(that._aTargetMappings);
                oDeferred.resolve(that._aInbounds);
            } else {
                jQuery.sap.log.debug(
                    "Did not get inbound in initial segment",
                    "",
                    "sap.ushell_abap.adapters.abap.ClientSideTargetResolutionAdapter"
                );
            }
        });

        // must wait on the full target mappings promise to complete before returning
        this._oNavTargetPromise.then(function () {
            jQuery.sap.log.debug(
                "Got inbounds from full start_up response",
                "",
                "sap.ushell_abap.adapters.abap.ClientSideTargetResolutionAdapter"
            );

            // convert (once) when needed
            that._aInbounds = that._formatDirectStart(that._aTargetMappings);

            // we don't want to check for the initial segment in the future anymore, since we've got all the inbounds now.
            that.getInbounds = function () {
                // replace implementation of this method (no conversion in future calls anymore!)
                return new jQuery.Deferred().resolve(that._aInbounds).promise();
            };

            oDeferred.resolve(that._aInbounds);
        }, function (sMsg) {
            oDeferred.reject(sMsg);
        });

        return oDeferred.promise();
    };

    /**
     * Test whether aSubSegment is completely contained in aSegment
     *
     * @param {object[]} aSubSegment the segment to test
     * @param {object[]} aSegment the full segment
     * @return {boolean} true if aSubSegment is contained in aSegment
     */
    ClientSideTargetResolutionAdapter.prototype._isInSegment = function (aSubSegment, aSegment) {
        if (!Array.isArray(aSegment) || !Array.isArray(aSubSegment)) {
            return false;
        }
        return aSubSegment.every(function (oEntry) {
            return !aSegment.every(function (oTestEntry) {
                return !(oEntry.semanticObject === oTestEntry.semanticObject
                    && oEntry.action === oTestEntry.action);
            });
        });
    };

    /**
     * Obtain the full set of inbounds via the start_up service.
     *
     * @return {jQuery.Deferred.promise} a jQuery promise that is resolved with a
     */
    ClientSideTargetResolutionAdapter.prototype._requestAllTargetMappings = function () {
        var mParameterMap = sap.ui2.srvc.getParameterMap();
        var oDeferred = new jQuery.Deferred();
        var sRequestUrl = "/sap/bc/ui2/start_up?so=%2A&action=%2A&",
            sCacheId = (ObjectPath.create("services.targetMappings", this._oAdapterConfig).cacheId
                && ("&sap-cache-id=" + ObjectPath.create("services.targetMappings", this._oAdapterConfig).cacheId)) || "";

        // add client and language if in url

        /**
         * Copies the URL parameter with the given name from <code>mParameterMap</code> to
         * <code>sRequestUrl</code> if within the relevant list.
         *
         * @param {string} sName URL parameter name
         * @private
         */
        function copyParameter (sName) {
            var sValue = mParameterMap[sName];
            if (sValue) {
                sRequestUrl += sName + "=" + encodeURIComponent(sValue[0]) + "&";
            }
        }
        copyParameter("sap-language");
        copyParameter("sap-client");
        sap.ui2.srvc.get(
            sRequestUrl + "&shellType=" + sap.ushell_abap.getShellType() + "&depth=0" + sCacheId,
            false, /* xml= */
            function (sNavTargetDataResult) {
                var oNavTargetDataResult = JSON.parse(sNavTargetDataResult);
                if (!oNavTargetDataResult) {
                    oDeferred.reject("Malformed Full TM Result");
                }
                oDeferred.resolve(oNavTargetDataResult);
            },
            function (sMessage) {
                oDeferred.reject(sMessage);
            }
        );
        return oDeferred.promise();
    };

    /**
     * Formats a set of target mappings returned by the start_up result into inbounds.
     *
     * @param {object} [oDirectStartResponse] the targetMappings member of the start_up response. This is an object like:
     *   <pre>
     *   {
     *     Object-action: {
     *       semanticObject: "Object",
     *       semanticAction: "action",
     *       allowParams: true,
     *       formFactors: {
     *         desktop: true,
     *         tablet: true,
     *         phone: true
     *       },
     *       parameterMappings: {
     *         NAME1: { target: "NEW_NAME1" },
     *         ...
     *       },
     *       text: "Text ",
     *       applicationType: "SAPUI5",
     *       applicationDependencies: "...",
     *       url: "/sap/bc/ui5_ui5/ui2/test_path",
     *       createdOn: "2015-08-04",
     *       catalogId: "X-SAP-UI2-CATALOGPAGE:/UI2/CATALOG",
     *       tmChipId: "01O2TR99M0M42Q838RE8YGK0Z"
     *     },
     *     ...
     *   }
     *   </pre>
     * @return {object[]} an array of inbounds suitable for ClientSideTargetResolution service consumption.
     *   This array may be empty in case the input oDirectStartResponse parameter was <code>undefined</code>.
     */
    ClientSideTargetResolutionAdapter.prototype._formatDirectStart = function (oDirectStartResponse) {
        var that = this;
        if (!oDirectStartResponse) {
            this._aInitialSegment = undefined; // disable for now!
            return [];
        }

        function mapOne (sSrcId, oSrc) {
            // the result inbound
            var oTarget = {};

            var aMatch = sSrcId.match(/^([^-]+)-([^~]+)/);
            if (!aMatch) {
                jQuery.sap.log.warning(
                    "The target mapping id " + sSrcId + " is not valid",
                    "this target mapping will be discarded",
                    "sap.ushell_abap.adapters.abap.ClientSideTargetResolutionAdapter"
                );
                return undefined;
            }

            // TODO: remove once this is fixed on the backend
            if (!oSrc.hasOwnProperty("text")) {
                oSrc.text = "";
            }

            oTarget.semanticObject = aMatch[1];
            oTarget.action = aMatch[2];
            oTarget.id = sSrcId;
            oTarget.title = oSrc.text;
            oTarget.permanentKey = "X-SAP-UI2-PAGE:" + oSrc.catalogId + ":" + oSrc.tmChipId;

            // resolution result
            var oFakeResolutionResult = {};
            ["applicationType", "applicationDependencies", "applicationData", "postParameters", "text", "url", "systemAlias"].forEach(function (sPropName) {
                oFakeResolutionResult[sPropName] = oSrc[sPropName];
            });

            // take component name from applicationDependencies if not supplied
            oTarget.resolutionResult = sap.ushell_abap.bootstrap.adjustNavTargetResult(oFakeResolutionResult);
            oTarget.resolutionResult.additionalInformation = oTarget.resolutionResult.additionalInformation || "";

            // enable usage of the app ID hint
            oTarget.resolutionResult.appId = oTarget.permanentKey;

            /*
             * Keep the systemAliasSemantics to "apply" for Shell-WCF URLs, because these URLs,
             * like other URLs are expressed under this assumption (that the server does not already interpolate system alias data).
             * At least on ABAP. This fix is necessary because the default behavior for the WCF URL resolver was changed in
             * ClientSideTargetResolution after support for WCF application types was introduced.
             */
            var oResolutionResult = oTarget.resolutionResult,
                sOriginalApplicationType = oResolutionResult.applicationType;
            if (sSrcId.indexOf("Shell-startWCF") === 0 && sOriginalApplicationType === "URL") {
                oTarget.resolutionResult.systemAliasSemantics = "apply";
            }

            // ClientSideTargetResolution relies on different application types than the ones returned by the OData service.
            oTarget.resolutionResult.applicationType = that._formatApplicationType(sSrcId, oTarget.resolutionResult);

            // Forward the name of the systemAlias used to interpolate the URL
            // ClientSideTargetResolution will de-interpolate the URL before applying sap-system
            oTarget.resolutionResult.systemAlias = oSrc.systemAlias || ""; // NOTE: "" is the local system alias

            oTarget.deviceTypes = oSrc.formfactors;
            oTarget.resolutionResult["sap.ui"] = {};
            oTarget.resolutionResult["sap.ui"].technology = oTarget.resolutionResult.applicationType;
            if (oTarget.resolutionResult["sap.ui"].technology === "SAPUI5") {
                oTarget.resolutionResult["sap.ui"].technology = "UI5";
            }
            if (oTarget.resolutionResult["sap.ui"].technology === "TR") {
                oTarget.resolutionResult["sap.ui"].technology = "GUI";
            }
            if (!oTarget.deviceTypes) {
                oTarget.deviceTypes = oSrc.formFactors || {};
            }
            oTarget.deviceTypes.desktop = oTarget.deviceTypes.desktop || false;
            oTarget.deviceTypes.phone = oTarget.deviceTypes.phone || false;
            oTarget.deviceTypes.tablet = oTarget.deviceTypes.tablet || false;

            // signature
            if (Array.isArray(oSrc.signature)) {
                oTarget.signature = {};
                oTarget.signature.additionalParameters = oSrc.allowParams ? "allowed" : "ignored";
                oTarget.signature.parameters = {};
                oSrc.signature.forEach(function (oBadParam) {
                    var oParam = {};
                    var sUserDefaultValue;
                    var sName = oBadParam.name;
                    if (oBadParam.defaultValue && oBadParam.defaultValue.value) {
                        oParam.defaultValue = {};
                        oParam.defaultValue.value = oBadParam.defaultValue.value;
                        oParam.defaultValue.format = oBadParam.defaultValue.format || "plain";
                        sUserDefaultValue = that._extractUserDefaultValue(oParam.defaultValue.value);
                        if (sUserDefaultValue) {
                            // a user default value
                            oParam.defaultValue = {
                                "value": sUserDefaultValue,
                                "format": "reference"
                            };
                        }
                    }
                    if (oBadParam.filter && oBadParam.filter.value) {
                        oParam.filter = {};
                        oParam.filter.value = oBadParam.filter.value;
                        oParam.filter.format = oBadParam.filter.format || "plain";
                        sUserDefaultValue = that._extractUserDefaultValue(oParam.filter.value);
                        if (sUserDefaultValue) {
                            // a user default value
                            oParam.filter = {
                                "value": sUserDefaultValue,
                                "format": "reference"
                            };
                        }
                    }
                    if (oBadParam.renameTo) {
                        oParam.renameTo = oBadParam.renameTo;
                    }
                    oParam.required = oBadParam.required || false;
                    oTarget.signature.parameters[sName] = oParam;
                });
            } else {
                oTarget.signature = jQuery.extend(true, { parameters: {} }, oSrc.signature);
                oTarget.signature.additionalParameters = oTarget.signature.additionalParameters || (oSrc.allowParams ? "allowed" : "ignored");
                Object.keys(oTarget.signature.parameters).forEach(function (sKey) {
                    var oParam = oTarget.signature.parameters[sKey];
                    if (oParam.filter) {
                        oParam.filter.format = oParam.filter.format || "plain";
                    }
                    if (oParam.defaultValue) {
                        oParam.defaultValue.format = oParam.defaultValue.format || "plain";
                    }
                    oParam.required = oParam.required || false;

                    // TODO: remove once fixed on backend
                    if (oParam.filter && oParam.filter.hasOwnProperty("format") && !(oParam.filter.hasOwnProperty("value"))) {
                        delete oParam.filter;
                    }
                    if (oParam.defaultValue && oParam.defaultValue.hasOwnProperty("format") && !(oParam.defaultValue.hasOwnProperty("value"))) {
                        delete oParam.defaultValue;
                    }
                });
            }

            var oSapHideIntentLinkParam = oTarget.signature && oTarget.signature.parameters && oTarget.signature.parameters["sap-hide-intent-link"];
            if (oSapHideIntentLinkParam && oSapHideIntentLinkParam.hasOwnProperty("defaultValue")) {
                oTarget.hideIntentLink = oSapHideIntentLinkParam.defaultValue.value === "true";
            }

            if (oSapHideIntentLinkParam && !oSapHideIntentLinkParam.required && oSapHideIntentLinkParam.hasOwnProperty("defaultValue")) {
                // NOTE: we actually delete it only if it's a default value
                delete oTarget.signature.parameters["sap-hide-intent-link"];
            }

            // process parameter mappings if they are there
            if (typeof oSrc.parameterMappings === "object") {
                Object.keys(oSrc.parameterMappings).forEach(function (sKey) {
                    var oMapping = oSrc.parameterMappings[sKey];
                    if (sKey && oMapping.target) {
                        oTarget.signature.parameters[sKey] = oTarget.signature.parameters[sKey] || {};
                        oTarget.signature.parameters[sKey].renameTo = oMapping.target;
                    }
                });
            }
            return oTarget;
        }

        var aRes = [];
        Object.keys(oDirectStartResponse).forEach(function (sKey) {
            var r = mapOne(sKey, oDirectStartResponse[sKey]);
            if (r) {
                aRes.push(r);
            }
        });
        return aRes;
    };

    /**
     * Extracts a valid <code>applicationType</code> field for ClientSideTargetResolution from the given object.
     *
     * @param {string} sTargetMappingId A unique identified
     * @param {object} oResolutionResult The (pre-resolution) resolutionResult of the navigation target.
     * @returns {string} One of the following application types compatible with ClientSideTargetResolution service:
     *   "TR", "SAPUI5", "WDA", "URL".
     */
    ClientSideTargetResolutionAdapter.prototype._formatApplicationType = function (sTargetMappingId, oResolutionResult) {
        var sApplicationType = oResolutionResult.applicationType,
            sUrl = oResolutionResult.url || "";

        function logErrorMessage (oNavTargetExpand, sDefault) {
            jQuery.sap.log.warning(
                "Cannot detect application type for TargetMapping id '" + sTargetMappingId + "', will default to " + sDefault + " application type",
                "TargetMapping URL is '" + sUrl + "'",
                S_COMPONENT
            );
        }

        if (sApplicationType === "SAPUI5") {
            return "SAPUI5";
        }

        if (sApplicationType === "URL" &&
            oResolutionResult.additionalInformation &&
            oResolutionResult.additionalInformation.indexOf("SAPUI5.Component=") === 0) {

            return "SAPUI5";
        }
        if (sApplicationType === "WDA" || sApplicationType === "TR" || sApplicationType === "WCF") {
            // trust the server

            // NOTE: "WDA" is there for robustness, in case the right application type is sent at some point from the server.
            return sApplicationType;
        }

        // Change the application type to WCF
        // Check FLPINTEGRATION2015-1463
        if (sTargetMappingId.indexOf("Shell-startWCF") === 0 && sApplicationType === "URL") {
            return "WCF";
        }

        if (sApplicationType === "NWBC") {
            if (sUrl.indexOf("/~canvas;window=app/wda") >= 0) {
                return "WDA";
            }
            if (sUrl.indexOf("/~canvas;window=app/transaction") >= 0) {
                return "TR";
            }

            logErrorMessage(oResolutionResult, "TR" /*default*/);

            /*
             * There is no special reason the default is "TR" at this point,
             * it's 50% chance the right type is chosen for NWBC applicationType.
             */
            return "TR";
        }

        if (sApplicationType !== "URL") {
            logErrorMessage(oResolutionResult, "URL" /*default*/);
        }

        return "URL";
    };

    /**
     * Extracts a user default value from the given string.
     *
     * @param {string} sString any string that may contain a user default placeholder. A valid placeholder has the following properties:
     *   <ul>
     *     <li>Starts with the sequence "%%"</li>
     *     <li>Ends with the sequence "%%"</li>
     *     <li>Contains at least one character between the start and the end sequence</li>
     *   </ul>
     *
     *   Example:<br/>
     *   <pre>
     *   %%UserDefault.desktopMode%%
     *   </pre>
     * @returns {string} the recognized user default parameter contained within the placeholder,
     *   or undefined if not found or not valid placeholder was found in the string.
     * @private
     */
    ClientSideTargetResolutionAdapter.prototype._extractUserDefaultValue = function (sString) {
        var sRes,
            rPlaceholderParser = new RegExp("^%%(UserDefault[.].+)%%$"),
            aMatch = rPlaceholderParser.exec(sString);

        return aMatch ? aMatch[1] : sRes;
    };

    /**
     * Format a ABAP proprietary OData response signature (TargetMapping/Signature)
     * into a canonical "Signature" format as used in the AppDescriptor.
     *
     * @param {object} oODataResponse the proprietary OData response parameter signature
     * @param {string} sAllowAdditionalParameters the value of allowAdditionalParameters in the ODataResponse
     * @return {object} canonical response
     * @private
     */
    ClientSideTargetResolutionAdapter.prototype._formatSignature = function (oODataResponse, sAllowAdditionalParameters) {
        var that = this,
            oRes = {
                "parameters": {},
                "additionalParameters": sAllowAdditionalParameters === false ? "ignored" : "allowed"
            };

        if (!oODataResponse.results) {
            return oRes;
        }

        oODataResponse.results.forEach(function (oEntry) {
            var oParam,
                sEntryName = oEntry.name,
                sEntryValue,
                sUserDefaultValue;

            if (Object.prototype.hasOwnProperty.call(oRes.parameters, sEntryName)) {
                jQuery.sap.log.error(
                    "Duplicate property name " + sEntryName + " in " + JSON.stringify(oODataResponse),
                    "sap.ui2.srvc.ClientSideTargetResolutionAdapter._formatSignature");
            }

            oRes.parameters[sEntryName] = {
                "required": that._getObjectDefaulting(oEntry, "required", false)
            };

            oParam = oRes.parameters[sEntryName];
            sEntryValue = that._getObjectDefaulting(oEntry, "value", "");

            if (oEntry.regexp === true) {
                oParam.filter = {
                    "value": (sEntryValue === "" ? ".*" : sEntryValue),
                    "format": "regexp"
                };
                return;
            }

            if (oEntry.required === false) {
                // if not required, the value represents a default value
                sUserDefaultValue = that._extractUserDefaultValue(sEntryValue);

                if (sUserDefaultValue) {
                    // a user default value
                    oParam.defaultValue = {
                        "value": sUserDefaultValue,
                        "format": "reference"
                    };
                    return;
                }

                if (sEntryValue !== "") { // note: empty string -> no default value
                    // a regular default value
                    oParam.defaultValue = { "value": sEntryValue };
                }
                return;
            }

            if (oEntry.required === true && oEntry.value) {
                // if required, the value represents a filter value
                sUserDefaultValue = that._extractUserDefaultValue(sEntryValue);

                if (sUserDefaultValue) {
                    // a user default value
                    oParam.filter = {
                        "value": sUserDefaultValue,
                        "format": "reference"
                    };
                    return;
                }

                if (sEntryValue !== "") { // note: empty string -> no filter value
                    oParam.filter = {
                        "value": sEntryValue
                    };
                }
            }
        });
        return oRes;
    };

    /**
     * Format a ABAP proprietary OData response parameter mappings (TargetMappings/NavTargetFLP/ParameterMappings or
     * TargetMappings/NavTargetNWBC/ParameterMappings) by blending it into the SignatureParameters section of a
     * constructed oSignature object, ("target" property becomes "renameTo" member of the Signature).
     *
     * If necessary, the parameter is created.
     *
     * @param {object} oSignature the signature object
     * @param {object} oODataParameterMappings the ParameterMappings object returned in the ODataResponse
     * @private
     */
    ClientSideTargetResolutionAdapter.prototype._mergeParameterMappingsIntoSignature = function (oSignature, oODataParameterMappings) {
        var aParameterMappingsOriginal = oODataParameterMappings.results;
        // no results
        if (!aParameterMappingsOriginal) {
            return;
        }
        aParameterMappingsOriginal.forEach(function (oParameterMappingOriginal) {
            var sSource = oParameterMappingOriginal.source;
            var sTarget = oParameterMappingOriginal.target;
            // find a parameter, if not, create one
            if (sTarget) {
                oSignature.parameters[sSource] = oSignature.parameters[sSource] || {};
                if (oSignature.parameters[sSource].renameTo) {
                    jQuery.sap.log.warning(
                        "duplicate parameter mapping for'" + sSource + "'",
                        "OData Parameter mappings is " + JSON.stringify(oParameterMappingOriginal, null, "   "),
                        S_COMPONENT
                    );
                }
                oSignature.parameters[sSource].renameTo = sTarget;
            }
        });
    };

    /**
     * Format a ABAP proprietary OData response FormFactors object into a canonical "deviceTypes" object as used in the AppDescriptor
     *
     * @param {object} oFormFactors form factors as they appear in the OData response
     * @return {object} canonical response
     * @private
     */
    ClientSideTargetResolutionAdapter.prototype._formatDeviceTypes = function (oFormFactors) {
        var oRes = {},
            that = this;

        ["desktop", "tablet", "phone"].forEach(function (sProp) {
            oRes[sProp] = that._getObjectDefaulting(oFormFactors, sProp, false);
        });
        return oRes;
    };

    /**
     * Return the member of an object, if undefined, return the provided default value.
     *
     * @param {object} oRoot root object
     * @param {string} sStr path to property
     * @param {variant} vDefault the default value
     * @return {variant} the evaluated property value may be an original reference to a sub entity of root
     * @private
     */
    ClientSideTargetResolutionAdapter.prototype._getObjectDefaulting = function (oRoot, sStr, vDefault) {
        var o = ObjectPath.get(sStr || "", oRoot);
        return (o === undefined) ? vDefault : o;
    };

    // functions past this point are helpers for the resolveHashFragmentFallback function

    /**
     * Constructs a shell hash for LPD_CUST resolution.
     *
     * @param {object} oInbound an inbound object matched via ClientSideTargetResolution service. This object is a structure like:
     *   <pre>
     *   {
     *     "semanticObject": <string>,
     *     "action": <action>,
     *     "title": <string>,
     *     "deviceTypes": <object>,
     *     "signature": <object>,
     *     "resolutionResult": {
     *       "applicationType": <string>,
     *       "additionalInformation": <string>,
     *       "text": <string>,
     *       "ui5ComponentName": <string>,
     *       "applicationDependencies": <object>,
     *       "url": <string>,
     *       "systemAlias": <string>,
     *       "_original": {
     *         "__metadata": <object>,
     *         "id": <string>,
     *         "shellType": <string>,
     *         "postParameters": <string>,
     *         "text": <string>,
     *         "applicationData": <string>,
     *         "applicationAlias": <string>,
     *         "applicationType": <string>,
     *         "url": <string>,
     *         "xappState": <string>,
     *         "iappState": <string>,
     *         "systemAlias": <string>,
     *         "applicationDependencies": <string>
     *       }
     *     }
     *   }
     *   </pre>
     * @param {object} oParams the intent parameters (including default parameters) that should be added to the resulting shell hash.
     *   This is an object like:
     *   <pre>
     *   {
     *     "paramName1": ["value1", "value2"], // multiple parameters in URL
     *     "paramName2": ["value3"]
     *   }
     *   </pre>
     * @return {string} a shell hash suitable for LPD_CUST resolution, that is, with the tilde-prefixed Target Mapping id and parameters.
     *   Through these ids ResolveLink can be pointed to a specific target mapping,
     *   skipping the matching and filtering steps of nav target resolution.<br />
     *
     *   Example shell hash: <code>Action-toappnavsample~6cn?p1=v1&p2=v2</code>
     *   <br />
     *   Returns undefined if it is not possible to obtain the tilde-prefixed id from the given target mapping.
     *
     *   NOTE: the resulting shell hash does not have a leading "#".
     * @private
     */
    ClientSideTargetResolutionAdapter.prototype._constructShellHashForLpdCust = function (oInbound, oParams) {
        var sLpdCustShellHash = "",
            sFailReason,
            // Extract the id from the target mapping
            oTargetMappingOriginal = jQuery.sap.getObject("resolutionResult._original", 2, oInbound);

        if (!isPlainObject(oTargetMappingOriginal)) {
            sFailReason = "the given target mapping is not an object";
        }
        if (!sFailReason && !oTargetMappingOriginal.hasOwnProperty("id")) {
            sFailReason = "no id found in target mapping _original object";
        }
        if (!sFailReason && typeof oTargetMappingOriginal.id !== "string") {
            sFailReason = "the target mapping id was not a string";
        }
        if (!sFailReason && oTargetMappingOriginal.id.length === 0) {
            sFailReason = "the target mapping id was an empty string";
        }
        if (sFailReason) {
            jQuery.sap.log.error("Cannot construct Shell Hash for LPD_CUST resolution",
                sFailReason, "sap.ushell_abap.adapters.abap.ClientSideTargetResolutionAdapter");

            return undefined;
        }

        sLpdCustShellHash += oTargetMappingOriginal.id;

        // Concatenate parameters if any
        var sBusinessParams = sap.ushell.Container.getService("URLParsing").paramsToString(oParams);

        if (sBusinessParams.length > 0) {
            sLpdCustShellHash += "?" + sBusinessParams;
        }

        return sLpdCustShellHash;
    };

    /**
     * Open the batch queue if it is not already open.
     * The method has no effect if the queue is already open
     *
     * @param {object} oODataWrapper a {@link sap.ui2.srvc.ODataWrapper} object.
     * @returns {boolean} true iff batch queue was opened by this method
     * @private
     */
    ClientSideTargetResolutionAdapter.prototype._openBatchQueueUnlessOpen = function (oODataWrapper) {
        if (oODataWrapper.isBatchQueueOpen()) {
            return false;
        }
        oODataWrapper.openBatchQueue();
        return true;
    };

    /**
     * Returns the current shell type, without relying on the existence of {@link sap.ushell_abap#getShellType}.
     *
     * @returns {string} the shell type ("NWBC" or "FLP"). Defaults to "FLP" in case the adapter is not running on the ABAP platform.
     * @private
     * @see sap.ushell_abap.adapters.abap.LaunchPageAdapter.prototype._getShellType
     */
    ClientSideTargetResolutionAdapter.prototype._getShellType = function () {
        if (sap && sap.ushell_abap && typeof sap.ushell_abap.getShellType === "function") {
            return sap.ushell_abap.getShellType();
        }
        return "FLP";
    };

    /**
     * Resolves the URL hash fragment.
     *
     * The hash fragment is resolved with the /sap/opu/odata/UI2/INTEROP/ResolveLink OData function import.
     * This is an asynchronous operation. The form factor of the current device is used to filter the navigation targets returned.
     *
     * @param {string} sFragmentNoHash The URL hash fragment in internal format (as obtained by the hasher service from SAPUI5,
     *   not as given in <code>location.hash</code>) without the leading "#".
     * @returns {object} A jQuery.Promise. Its <code>done()</code> function gets an object that you can use to create a
     *   {@link sap.ushell.components.container.ApplicationContainer} or <code>undefined</code> in case the hash fragment was empty.
     * @private
     */
    ClientSideTargetResolutionAdapter.prototype._resolveHashFragmentBE = function (sFragmentNoHash) {
        var oDeferred = new jQuery.Deferred(),
            that = this,
            bBatchQueueOpened,
            sFormFactor = sap.ui2.srvc.getFormFactor();

        /**
         * @param {string} sUnencoded an OData URL query parameter
         * @returns {string} the encoded OData URL query parameter
         */
        function encodeODataQueryParameter (sUnencoded) {
            /*
             * parameters for OData queries must be url-encoded and single quotes must be escaped
             * by an additional single quote (single quote is not encoded by encodeURIComponent)
             * see internal CSN 0003969932 2013
             */
            return encodeURIComponent(sUnencoded).replace(/'/g, "''");
        }

        bBatchQueueOpened = this._openBatchQueueUnlessOpen(this._getODataWrapper());

        this._oODataWrapper.read("ResolveLink?linkId='"
            + encodeODataQueryParameter(sFragmentNoHash) + "'&shellType='" + that._getShellType() + "'"
            + (sFormFactor ?
                "&formFactor='" + encodeODataQueryParameter(sFormFactor) + "'" : ""),
            function (oResult) {
                var i,
                    sDetails = "",
                    oAdjustedResult;

                if (oResult.results.length) {
                    if (oResult.results.length > 1) {
                        // console log because of multiple targets
                        for (i = 0; i < oResult.results.length; i += 1) {
                            delete oResult.results[i].__metadata; // simplify output
                            sDetails += (i === 0 ? "used target: " : "\nignored target: ")
                                + JSON.stringify(oResult.results[i]);
                        }
                        jQuery.sap.log.error("INTEROP service's ResolveLink operation "
                            + "returned " + oResult.results.length + " targets for hash '#"
                            + sFragmentNoHash + "', first one is used.",
                            sDetails,
                            "sap.ushell_abap.adapters.abap.ClientSideTargetResolutionAdapter");
                    }

                    oResult = oResult.results[0];
                    oAdjustedResult = sap.ushell_abap.bootstrap.adjustNavTargetResult(oResult);
                    oAdjustedResult.url = sap.ushell_abap.bootstrap.addPostParametersToNavTargetResultUrl(
                        oResult.postParameters, oAdjustedResult.url);

                    // Fix application type to ensure backward compatible behavior after incompatible server-side change.
                    if (oAdjustedResult && oAdjustedResult.applicationType === "SAPUI5") {
                        oAdjustedResult.applicationType = "URL";
                    }

                    that._compactTooLongWdaUrl(oAdjustedResult).done(function (oCompactedResult) {
                        oDeferred.resolve(oCompactedResult);
                    }).fail(function (sMsg) {
                        oDeferred.reject("Could not resolve link '" + sFragmentNoHash + "' due to compactation failure" + sMsg);
                    });
                } else {
                    oDeferred.reject("Could not resolve link '" + sFragmentNoHash + "'");
                }
            }, function (sMessage) {
                oDeferred.reject(sMessage);
            });

        if (bBatchQueueOpened) {
            that._getODataWrapper().submitBatchQueue(function () { }, oDeferred.reject.bind(oDeferred));
        }
        return oDeferred.promise();
    };

    ClientSideTargetResolutionAdapter.prototype._compactTooLongWdaUrl = function (oResult) {
        var oDeferred = new jQuery.Deferred();
        if (oResult && oResult.applicationType === "NWBC" &&
            oResult.url &&
            oResult.url.indexOf("/ui2/nwbc/~canvas;window=") === 0 &&
            oResult.url.length > this._getWDAUrlShorteningLengthLimit()
        ) {
            this._compactUrl(oResult.url).done(function (sCompactedUrl) {
                oResult.url = sCompactedUrl;
                oDeferred.resolve(oResult);
            }).fail(oDeferred.reject.bind(oDeferred));
            return oDeferred.promise();
        }
        // we do not compact
        return oDeferred.resolve(oResult).promise();
    };

    ClientSideTargetResolutionAdapter.prototype._compactUrl = function (sUrl) {
        var m = sUrl.match(/\?.*/);
        var oUrlParsingService = sap.ushell.Container.getService("URLParsing");
        if (!(m && m[0] && m[0].length > this._getWDAUrlShorteningLengthLimit() - 200)) {
            return new jQuery.Deferred().resolve(sUrl).promise();
        }
        var oParams = oUrlParsingService.parseParameters(m[0]);
        var oDeferred = new jQuery.Deferred();
        sap.ushell.Container.getService("ShellNavigation").compactParams(oParams, aNotCompactedWDAParameters, undefined /* no Component */)
            .done(function (oCompactedParams) {
                var sReconstructedUrl = sUrl.match(/^[^?]*/)[0] + "?" + oUrlParsingService.paramsToString(oCompactedParams);
                oDeferred.resolve(sReconstructedUrl);
            }).fail(oDeferred.reject.bind(oDeferred));
        return oDeferred.promise();
    };

    ClientSideTargetResolutionAdapter.prototype._getWDAUrlShorteningLengthLimit = function () {
        /*
         * URL compaction for WDA only works if the WDA backend is of a sufficient high release thus this is potentially incompatible
         * if we start compacting URLs for an "old" release on a platform which supports longer urls
         * (where one may have gotten away with overly long URLs before).
         */
        var vNoWDACompact = ushellUtils.getParameterValueBoolean("sap-ushell-nowdaurlshortening");
        if (vNoWDACompact) {
            return 6000000;
        }
        return this._wdLengthLimit;
    };

    /**
     * Resolves a specific system alias.
     *
     * @param {string} sSystemAlias the system alias name to be resolved
     * @return {jQuery.Deferred.Promise} a jQuery promise that resolves to a system alias data object. A live object is returned!
     *   The service must not change it. If the alias could not be resolved the promise is rejected.
     *
     *   Format of system alias data object. Example:
     *   <pre>
     *   {
     *     id: "AB1CLNT000",
     *     client: "000",
     *     language: "EN",
     *       http: {
     *         id: "AB1CLNT000_HTTP",
     *         host: "ldcab1.xyz.com",
     *         port: 10000,
     *         pathPrefix: "/abc/def/"
     *       },
     *       https: {
     *         id: "AB1CLNT000_HTTPS",
     *         host: "ldcab1.xyz.com",
     *         port: 20000,
     *         pathPrefix: "/abc/def/"
     *       },
     *       rfc: {
     *         id: "AB1CLNT000",
     *         systemId: "AB1",
     *         host: "ldcsab1.xyz.com",
     *         port: 0,
     *         loginGroup: "PUBLIC",
     *         sncNameR3: "",
     *         sncQoPR3: "8"
     *       }
     *   }
     *   </pre>
     * @private
     */
    ClientSideTargetResolutionAdapter.prototype.resolveSystemAlias = function (sSystemAlias) {
        var sMessage,
            oDeferred = new jQuery.Deferred(),
            that = this,
            oSystemAliasData;

        // check if we have it already
        oSystemAliasData = this._readSystemAliasFromBuffer(sSystemAlias); // note: already in ClientSideTargetResolutionAdapter format
        if (oSystemAliasData) {
            jQuery.sap.log.debug(
                "System alias '" + sSystemAlias + "' was already buffered",
                "",
                "sap.ushell_abap.adapters.abap.ClientSideTargetResolutionAdapter"
            );
            window.setTimeout(function () {
                oDeferred.resolve(oSystemAliasData);
            }, 0);
        } else {
            jQuery.sap.log.debug(
                "System alias '" + sSystemAlias + "' is not in buffer",
                "",
                "sap.ushell_abap.adapters.abap.ClientSideTargetResolutionAdapter"
            );

            // must wait at least on the small start_up response before using INTEROP

            /*
             * Trigger call to front-end server. This case may occur, for example, during application direct start with
             * a system alias that is not sent by the backend. Backend only sends data about the system aliases that are
             * mentioned in the systemAlias fields of the target mappings (or for virtual target mappings).
             */
            var fnRetryBufferOrUseInterop = function () {
                oSystemAliasData = that._readSystemAliasFromBuffer(sSystemAlias); // note: already in ClientSideTargetResolutionAdapter format
                if (oSystemAliasData) {
                    jQuery.sap.log.debug(
                        "System alias '" + sSystemAlias + "' is now in buffer",
                        "Skipping INTEROP service call",
                        "sap.ushell_abap.adapters.abap.ClientSideTargetResolutionAdapter"
                    );
                    oDeferred.resolve(oSystemAliasData);
                } else {
                    jQuery.sap.log.debug(
                        "System alias '" + sSystemAlias + "' still not in buffer",
                        "Resolving via INTEROP service",
                        "sap.ushell_abap.adapters.abap.ClientSideTargetResolutionAdapter"
                    );
                    that._readSystemAliasViaInterop(sSystemAlias)
                        .fail(function (sError) {
                            oDeferred.reject(sError);
                        })
                        .done(function (oOdataSystemAliasData) {
                            oSystemAliasData = that._fixSystemAlias(oOdataSystemAliasData);

                            if (oSystemAliasData && oSystemAliasData.id) {
                                that._writeSystemAliasToBuffer(oSystemAliasData);
                                oDeferred.resolve(oSystemAliasData);
                            } else {
                                sMessage = "Data returned for system alias is not valid";
                                jQuery.sap.log.warning("ClientSideTargetResolutionAdapter: " + sMessage);
                                oDeferred.reject(sMessage);
                            }

                        });
                }
            };

            this._oInitialSegmentPromise.then(fnRetryBufferOrUseInterop, fnRetryBufferOrUseInterop);
        }

        return oDeferred.promise();
    };

    /**
     * Writes an array of objects representing system alias data into the runtime buffer.
     *
     * @param {object|object[]} [vSystemAliases] Array or Object of system aliases
     * @private
     */
    ClientSideTargetResolutionAdapter.prototype._writeUserSystemAliasesToBuffer = function (vSystemAliases) {
        var that = this;

        if (typeof vSystemAliases === "undefined") {
            // nop in case no argument or undefined is passed
            return;
        }

        if (isPlainObject(vSystemAliases)) {
            Object.keys(vSystemAliases).forEach(function (sSystemAliasKey) {
                that._writeSystemAliasToBuffer(that._fixSystemAlias(vSystemAliases[sSystemAliasKey]));
            });
            return;
        }

        vSystemAliases.forEach(function (oSystemAlias) {
            that._writeSystemAliasToBuffer(that._fixSystemAlias(oSystemAlias));
        });
    };

    /**
     * Reads system alias data from the runtime buffer
     *
     * If there is no entry in the buffer for this ID <code>undefined</code> is returned.
     *
     * @param {string} sSystemAliasId ID of the system alias to be retrieved from the buffer.
     * @returns {object} A system alias data object is returned which can be directly passed to the service.
     *   If the buffer does not contain data for that system alias <code> undefined</code> is returned.
     * @private
     */
    ClientSideTargetResolutionAdapter.prototype._readSystemAliasFromBuffer = function (sSystemAliasId) {
        // note "" means local system alias
        var oResolvedSystemAlias = this._oSystemAliasBuffer.get(sSystemAliasId);

        if (!oResolvedSystemAlias && sSystemAliasId === "") {
            return this._oLocalSystemAlias;
        }

        return oResolvedSystemAlias;
    };

    /**
     * Writes a system alias data from the runtime buffer
     * If there is no entry in the buffer for this ID <code>undefined</code> is returned.
     *
     * @param {string} oSystemAliasData Data to be added to the buffer. The data format has to be the one described in
     *   <code>resolveSystemAlias</code>.
     * @returns {object} The provided system alias data object.
     * @private
     */
    ClientSideTargetResolutionAdapter.prototype._writeSystemAliasToBuffer = function (oSystemAliasData) {
        if (oSystemAliasData && oSystemAliasData.id) {
            this._oSystemAliasBuffer.put(oSystemAliasData.id, oSystemAliasData);
        }
        return oSystemAliasData;
    };

    /**
     * Amends system alias sent from the backend for robustness.
     * Mostly because the backend serializer deletes any key that has an empty value.
     *
     * @param {string} oSystemAlias System alias data in Odata JSON format
     * @returns {object} a jQuery promise that resolves to a system alias data object in OData JSON format.
     *   If the alias could not be resolved the promise is rejected.
     *   If an empty object is received the promise is resolved.
     * @private
     */
    ClientSideTargetResolutionAdapter.prototype._fixSystemAlias = function (oSystemAlias) {
        oSystemAlias = oSystemAlias || {};

        delete oSystemAlias.__metadata;

        var oFixedSystemAlias = {};
        oFixedSystemAlias.id = oSystemAlias.id || "";
        oFixedSystemAlias.client = oSystemAlias.client || "";
        oFixedSystemAlias.language = oSystemAlias.language || "";

        ["http", "https"].forEach(function (sDestination) {
            if (oSystemAlias.hasOwnProperty(sDestination)) {
                delete oSystemAlias[sDestination].__metadata;

                if (oSystemAlias[sDestination].id !== "") {
                    oFixedSystemAlias[sDestination] = jQuery.extend({
                        id: "",
                        host: "",
                        port: "",
                        pathPrefix: ""
                    }, oSystemAlias[sDestination]);
                }
            }
        });

        if (oSystemAlias.hasOwnProperty("rfc") && oSystemAlias.rfc.id) {
            delete oSystemAlias.rfc.__metadata;
            oFixedSystemAlias.rfc = jQuery.extend({
                id: "",
                systemId: "",
                host: "",
                service: 0,
                loginGroup: "",
                sncNameR3: "",
                sncQoPR3: ""
            }, oSystemAlias.rfc);
        }

        return oFixedSystemAlias;
    };

    /**
     * Reads the system alias data for one system alias ID using the interop service.
     *
     * @param {string} sSystemAliasId System alias ID
     * @returns {object} a jQuery promise that resolves to a system alias data object in OData JSON format.
     *   If the alias could not be resolved the promise is rejected.
     *   If an empty object is received the promise is resolved.
     * @private
     */
    ClientSideTargetResolutionAdapter.prototype._readSystemAliasViaInterop = function (sSystemAliasId) {
        var oDeferred = new jQuery.Deferred(),
            sRelativeUrl = "SystemAliases(id='" + encodeURIComponent(sSystemAliasId) + "')?$format=json";

        this._getODataWrapper().read(
            sRelativeUrl,
            function (oSystemAliasData) {
                oDeferred.resolve(oSystemAliasData);
            },
            function (sMessage) {
                oDeferred.reject(sMessage);
            }
        );

        return oDeferred.promise();
    };

    /**
     * Reads and returns the available system aliases from the internal buffer
     *
     * @returns {object} A object containing information about all available system aliases
     * @private
     */
    ClientSideTargetResolutionAdapter.prototype.getSystemAliases = function () {
        return (this._oSystemAliasBuffer && this._oSystemAliasBuffer.entries) || {};
    };

    return ClientSideTargetResolutionAdapter;
}, true /* bExport */);
