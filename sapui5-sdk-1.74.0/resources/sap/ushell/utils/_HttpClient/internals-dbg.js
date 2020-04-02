// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/* global Promise */

sap.ui.define([
    "sap/base/Log",
    "sap/ui/thirdparty/jquery"
], function (Log, jQuery) {
    "use strict";

    var oCachedCsrfToken = { token: null }, // see comment at csrfTokenReadFromCache
        fnCsrfTokenIsCachedBound = csrfTokenIsCached.bind(null, oCachedCsrfToken),
        fnCsrfTokenReadFromCacheBound = csrfTokenReadFromCache.bind(null, oCachedCsrfToken),
        fnCsrfTokenWriteToCacheBound = csrfTokenWriteToCache.bind(null, oCachedCsrfToken),
        fnExecuteRequestBound = executeRequest.bind(null, XMLHttpRequest),
        fnCsrfTokenFetchBound = csrfTokenFetch.bind(null, fnExecuteRequestBound, csrfTokenExtractFromResponseHeader);

    return Object.create(null, {
        _executeRequest: { value: executeRequest },
        executeRequest: { value: fnExecuteRequestBound },
        executeRequestWithCsrfToken: { value: executeRequestWithCsrfToken },
        isSafeHttpMethod: { value: isSafeHttpMethod },
        isValidHttpMethod: { value: isValidHttpMethod },
        summariseResponse: { value: summariseResponse },
        processResponse: { value: processResponse },
        getHttpRequestWrapper: { value: getHttpRequestWrapper },
        containsCSRFTokenHeaderEntry: { value: containsCSRFTokenHeaderEntry },
        csrfTokenReadFromCache: { value: fnCsrfTokenReadFromCacheBound },
        csrfTokenWriteToCache: { value: fnCsrfTokenWriteToCacheBound },
        csrfTokenIsCached: { value: fnCsrfTokenIsCachedBound },
        _csrfTokenFetch: { value: csrfTokenFetch },
        csrfTokenFetch: { value: fnCsrfTokenFetchBound },
        _csrfTokenGet: { value: csrfTokenGet },
        csrfTokenGet: {
            value: csrfTokenGet.bind(null,
                fnCsrfTokenIsCachedBound,
                fnCsrfTokenReadFromCacheBound,
                fnCsrfTokenWriteToCacheBound,
                fnCsrfTokenFetchBound
            )
        },
        csrfTokenAddToRequestHeader: { value: csrfTokenAddToRequestHeader },
        csrfTokenExtractFromResponseHeader: { value: csrfTokenExtractFromResponseHeader }
    });

    function executeRequestWithCsrfToken (
        // injected dependencies
        fnExecuteRequest,
        fnCsrfTokenWriteToCache,
        fnCsrfTokenGet,
        fnCsrfTokenFetch,
        fnCsrfTokenAddToRequestHeader,
        fnCsrfTokenExtractFromResponseHeader,
        fnIsSafeHttpMethod,
        // call params
        sRequestMethod,
        sUrl,
        oConfig
    ) {
        function tokenIsInvalid (oResponse) {
            return (oResponse && (oResponse.status === 403) &&
                (fnCsrfTokenExtractFromResponseHeader(oResponse).toLowerCase() === "required"));
        }

        var oExtendedConfig;

        if (!/Function/.test(Object.prototype.toString.call(fnExecuteRequest)) ||
            !/Function/.test(Object.prototype.toString.call(fnCsrfTokenWriteToCache)) ||
            !/Function/.test(Object.prototype.toString.call(fnCsrfTokenFetch)) ||
            !/Function/.test(Object.prototype.toString.call(fnCsrfTokenGet)) ||
            !/Function/.test(Object.prototype.toString.call(fnCsrfTokenAddToRequestHeader)) ||
            !/Function/.test(Object.prototype.toString.call(fnCsrfTokenExtractFromResponseHeader)) ||
            !/Function/.test(Object.prototype.toString.call(fnIsSafeHttpMethod))
        ) {
            throw new Error("DependencyInjectionError: one or more of the injected dependencies is invalid");
        }
        if (!/String/.test(Object.prototype.toString.call(sRequestMethod)) ||
            !/String/.test(Object.prototype.toString.call(sUrl))
        ) {
            throw new Error("IllegalArgumentError: one or more of the arguments is invalid");
        }
        if (!oConfig) {
            oConfig = {};
        }
        return new Promise(function (resolve, reject) {
            function handleFinalError (vError) {
                // final failure
                Log.error(vError, null, "sap.ushell.util.HttpClient");
                reject(vError);
            }

            if (!fnIsSafeHttpMethod(sRequestMethod)) {
                fnCsrfTokenGet(sUrl)
                    .then(function (sCsrfToken) {
                        // Use the token for the first request
                        oExtendedConfig = fnCsrfTokenAddToRequestHeader(sCsrfToken, oConfig);
                        return fnExecuteRequest(sRequestMethod, sUrl, oExtendedConfig);
                    })
                    .then(function (oResponse) {
                        resolve(oResponse);
                    })
                    .catch(function (vError) {
                        if (tokenIsInvalid(vError)) {
                            // We fetch a new CSRF token and do a second execute request with that token
                            fnCsrfTokenFetch(sUrl)
                                .then(function (sCsrfToken) {
                                    oExtendedConfig = fnCsrfTokenAddToRequestHeader(sCsrfToken, oConfig);
                                    return fnExecuteRequest(sRequestMethod, sUrl, oExtendedConfig);
                                })
                                .then(function (oResponse) {
                                    resolve(oResponse);
                                })
                                .catch(handleFinalError);
                        } else {
                            handleFinalError(vError);
                        }
                    });
            } else {
                // no CSRF token is used but we fetch it
                oExtendedConfig = fnCsrfTokenAddToRequestHeader("fetch", oConfig);
                fnExecuteRequest(sRequestMethod, sUrl, oExtendedConfig)
                    .then(function (oResponse) {
                        // cache CSRF token if there is one
                        var sCsrfToken = fnCsrfTokenExtractFromResponseHeader(oResponse);
                        if (sCsrfToken) {
                            fnCsrfTokenWriteToCache(sCsrfToken);
                        }
                        resolve(oResponse);
                    })
                    .catch(handleFinalError);
            }
        });
    }

    // A simple request function.
    function executeRequest (
        // injected dependencies
        FnXhr,
        // params
        sRequestMethod,
        sUrl,
        oConfig
    ) {
        var aHeaders,
            oRequestData,
            oXhr;

        if (!/Function/.test(Object.prototype.toString.call(FnXhr))) {
            throw new Error("DependencyInjectionError: one or more of the injected dependencies is invalid");
        }
        if (!/String/.test(Object.prototype.toString.call(sRequestMethod)) ||
            !/String/.test(Object.prototype.toString.call(sUrl))
        ) {
            throw new Error("IllegalArgumentException: one or more of the arguments is invalid");
        }

        oXhr = new FnXhr();

        if (/[a-z]/.test(sRequestMethod)) {
            sRequestMethod = sRequestMethod.toUpperCase();
        }

        if (oConfig) {
            aHeaders = !oConfig.headers
                ? []
                : Object
                    .keys(oConfig.headers)
                    .map(function (sHeader) {
                        return {
                            name: sHeader,
                            value: this[sHeader]
                        };
                    }, oConfig.headers);

            oRequestData = oConfig.data;
        } else {
            aHeaders = [];
        }

        return new Promise(function (fnResolve, fnReject) {
            [
                "load",
                "error"
            ].forEach(function (sEvent) {
                oXhr.addEventListener(
                    sEvent,
                    processResponse.bind(null, oXhr, fnResolve, fnReject)
                );
            });

            oXhr.open(sRequestMethod, sUrl);

            aHeaders.forEach(function (oHeader) {
                oXhr.setRequestHeader(oHeader.name, oHeader.value);
            });

            oXhr.send(JSON.stringify(oRequestData));
        });
    }

    function getHttpRequestWrapper (sMethodName, fnHttpRequest, sBaseUrl, oCommonConfig) {
        if (
            !/String/.test(Object.prototype.toString.call(sMethodName)) ||
            !/Function/.test(Object.prototype.toString.call(fnHttpRequest)) ||
            !/String/.test(Object.prototype.toString.call(sBaseUrl))
        ) {
            throw new Error("IllegalArgumentError: one or more of the arguments is invalid");
        }

        return function (sPath, oSpecialConfig) {
            return fnHttpRequest(
                sMethodName,
                sBaseUrl.replace(/\/$/, "") + "/" + sPath.replace(/^\//, ""),
                jQuery.extend(
                    {},
                    oCommonConfig,
                    oSpecialConfig
                )
            );
        };
    }

    function processResponse (oXhr, fnOK, fnError) {
        var oResponse;

        if (
            !oXhr ||
            !/Number/.test(Object.prototype.toString.call(oXhr.status)) ||
            !/Function/.test(Object.prototype.toString.call(oXhr.getAllResponseHeaders))
        ) {
            throw new Error("IllegalArgumentError: invalid XMLHttpRequest instance");
        }

        oResponse = summariseResponse(oXhr);

        if (oXhr.status < 200 || oXhr.status > 299) {
            fnError(oResponse);
        } else {
            fnOK(oResponse);
        }
    }

    function summariseResponse (oXhr) {
        return {
            status: oXhr.status,
            statusText: oXhr.statusText,
            responseText: oXhr.responseText,
            responseHeaders: oXhr.getAllResponseHeaders()
                .split(/\r\n/g)
                .filter(function (sItem) {
                    return sItem.length > 0;
                })
                .map(function (sHeader) {
                    var aParts = sHeader.split(":");
                    return {
                        name: aParts[0].trim(),
                        value: aParts[1].trim()
                    };
                })
        };
    }

    function containsCSRFTokenHeaderEntry (oHeaders) {
        var sHeaderValue = oHeaders["x-csrf-token"] || oHeaders["X-CSRF-TOKEN"];

        return !!sHeaderValue && /String/.test(Object.prototype.toString.call(sHeaderValue));
    }

    function isSafeHttpMethod (sHttpMethod) {
        switch (sHttpMethod) {
            case "HEAD":
            case "GET":
            case "OPTIONS":
                return true;
            case "POST":
            case "PUT":
            case "DELETE":
                return false;
            default:
                throw new Error("IllegalArgumentError: '" + sHttpMethod + "' is not a supported request method");
        }
    }

    function isValidHttpMethod (sHttpMethod) {
        switch (sHttpMethod) {
            case "HEAD":
            case "GET":
            case "OPTIONS":
            case "POST":
            case "PUT":
            case "DELETE":
                return true;
            default:
                throw new Error("IllegalArgumentError: '" + sHttpMethod + "' is not a supported request method");
        }
    }

    function csrfTokenReadFromCache (
        // Attention!
        // Currently we cache one token for all URLs. This is not the way to go if the server returns
        // different tokens for different URLs and we use the HttpClient in the context of different URLs.
        // We need to clarify with the BE team on for what URLs the server/runtime agent will return the same
        // token. Also we need to clarify if this HttpClient will be used for different servers.
        // As a consequence in future the API will have sUrl as parameter and the structure of oCsrfToken needs to have
        // name / value pairs with the URLs or parts of it as names.
        oCsrfToken // injected dependency
    ) {
        return oCsrfToken.token;
    }

    function csrfTokenWriteToCache (
        // see comment at csrfTokenReadFromCache
        oCsrfToken, // injected dependency
        sNewCsrfToken
    ) {
        oCsrfToken.token = sNewCsrfToken;
    }

    function csrfTokenIsCached (
        // see comment at csrfTokenReadFromCache
        oCsrfToken // injected dependency
    ) {
        return !!oCsrfToken.token;
    }

    function csrfTokenGet (
        // injected dependencies
        fnCsrfTokenIsCached,
        fnCsrfTokenReadFromCache,
        fnCsrfTokenWriteToCache,
        fnCsrfTokenFetch,
        // parameter
        sUrl
    ) {
        if (!/Function/.test(Object.prototype.toString.call(fnCsrfTokenIsCached)) ||
            !/Function/.test(Object.prototype.toString.call(fnCsrfTokenReadFromCache)) ||
            !/Function/.test(Object.prototype.toString.call(fnCsrfTokenWriteToCache)) ||
            !/Function/.test(Object.prototype.toString.call(fnCsrfTokenFetch))
        ) {
            throw new Error("DependencyInjectionError: one or more of the injected dependencies is invalid");
        }
        if (!/String/.test(Object.prototype.toString.call(sUrl))) {
            throw new Error("IllegalArgumentError: one or more of the arguments is invalid");
        }
        return new Promise(function (resolve, reject) {
            if (fnCsrfTokenIsCached()) {
                resolve(fnCsrfTokenReadFromCache());
            } else {
                fnCsrfTokenFetch(sUrl)
                    .then(function (sCsrfToken) {
                        fnCsrfTokenWriteToCache(sCsrfToken);
                        resolve(sCsrfToken);
                    })
                    .catch(function (vError) {
                        reject(vError);
                    });
            }
        });
    }

    function csrfTokenFetch (
        // injected dependencies
        fnExecuteRequest,
        fnCsrfTokenExtractFromResponseHeader,
        // parameter
        sUrl
    ) {
        if (!/Function/.test(Object.prototype.toString.call(fnExecuteRequest)) ||
            !/Function/.test(Object.prototype.toString.call(fnCsrfTokenExtractFromResponseHeader))
        ) {
            throw new Error("DependencyInjectionError: one or more of the injected dependencies is invalid");
        }
        if (!/String/.test(Object.prototype.toString.call(sUrl))) {
            throw new Error("IllegalArgumentError: one or more of the arguments is invalid");
        }
        return fnExecuteRequest("OPTIONS", sUrl, {
            headers: { "x-csrf-token": "fetch" }
        })
            .then(function (oResponse) {
                return fnCsrfTokenExtractFromResponseHeader(oResponse);
            });
    }

    // creates a copy of oConfig and extends it
    function csrfTokenAddToRequestHeader (sHeaderValue, oConfig) {
        var oExtendedConfig,
            oObjectWithCsrfHeader = { "x-csrf-token": sHeaderValue };

        if (!/String/.test(Object.prototype.toString.call(sHeaderValue)) ||
            !/object Object/.test(Object.prototype.toString.call(oConfig))) {
            throw new Error("IllegalArgumentError: one or more of the arguments is invalid");
        }
        oExtendedConfig = jQuery.extend(true, {}, oConfig);
        if (!oExtendedConfig.headers) {
            oExtendedConfig.headers = oObjectWithCsrfHeader;
        } else {
            jQuery.extend(oExtendedConfig.headers, oObjectWithCsrfHeader);
        }
        return oExtendedConfig;
    }

    function csrfTokenExtractFromResponseHeader (oResponse) {
        var oCsrfToken;

        if (!/Array/.test(Object.prototype.toString.call(oResponse.responseHeaders))) {
            return undefined;
        }
        oCsrfToken = oResponse.responseHeaders
            .filter(function (oHeader) {
                return oHeader.name === "x-csrf-token";
            })[0];
        return oCsrfToken && oCsrfToken.value ? oCsrfToken.value : undefined;
    }
});
