// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview A wrapper around <code>OData</code>, providing CSRF token handling, caching and
 * generic batch support.
 */

(function () {
  "use strict";
  /*global jQuery, OData, sap, window */
  jQuery.sap.declare("sap.ui2.srvc.ODataWrapper");

  // Note: Only the section between @begin and @end is included in pbs-template.js.
  // In pbs-template fnRequire is differently initialized (in case UI5 is not available)!
  // Thus this variable is used in the coding below and not directly jQuery.sap.require.
  // avoid fnRequire = jQuery.sap.require as require cannot be spied on afterwards
  var fnRequire = function () {
    jQuery.sap.require.apply(this, arguments);
  };
  function nop() {/* null object pattern */}

  sap.ui2.srvc.testPublishAt = sap.ui2.srvc.testPublishAt || function () {
    // intentionally left blank
  };

/// @begin
  // if OData is missing, automatically require SAPUI5's datajs implementation
  if (typeof OData !== "object") {
    fnRequire("sap.ui.thirdparty.datajs");
  }

  /**
   * Reject the given <code>jQuery.Deferred</code> object(s) (array or single one) with the
   * given error response.
   *
   * @param {jQuery.Deferred|jQuery.Deferred[]} vDeferred
   *   deferred or array of deferreds to be rejected
   * @param {object} oResponse
   *   parameter of (each) reject call
   */
  function reject(vDeferred, oResponse) {
    if (sap.ui2.srvc.isArray(vDeferred)) {
      // a failed change set: reject each single jQuery.Deferred in the same way
      vDeferred.forEach(function (oDeferred) {
        oDeferred.reject(oResponse);
      });
    } else {
      // a failed GET request
      vDeferred.reject(oResponse);
    }
  }

  // "public class" ************************************************************

  /**
   * Constructs a wrapper around <code>OData</code>, providing CSRF token handling, caching and
   * generic batch support. The sap-statistics header is automatically added to all requests if
   * the URL query parameter <code>sap-statistics=true</code> is set (see
   * <a href="http://help.sap.com/saphelp_nw74/helpdata/de/40/93b81292194d6a926e105c10d5048d/content.htm">
   * SAP Performance Statistics</a>).
   * If <code>OData</code> is missing, "sap.ui.thirdparty.datajs" is required automatically.
   * <p>
   * The preferred way to call the constructor is from a "sub-class" of
   * {@link sap.ui2.srvc.ODataService}:
   * <pre>
   *   function Service() {
   *     var oWrapper = new sap.ui2.srvc.ODataWrapper(oSettings, this);
   *     sap.ui2.srvc.ODataService.call(this, oWrapper, fnDefaultFailure);
   *   }
   *   var myService = new Service();
   * </pre>
   * This provides public inheritance of <code>sap.ui2.srvc.ODataService</code> methods and
   * private inheritance of <code>sap.ui2.srvc.ODataWrapper</code> methods. In case you are not
   * providing a public "sub-class" of <code>sap.ui2.srvc.ODataService</code> but only want to
   * use methods from <code>sap.ui2.srvc.ODataWrapper</code>,
   * {@link sap.ui2.srvc.createODataWrapper} is the preferred way to construct an instance.
   *
   * @param {object} oSettings
   *   An object containing various properties:
   *   <pre>
   *     {
   *       baseUrl: "/OData/OData.svc", // Mandatory base URL of the OData service
   *       supportsChangeSets: false,   // Type: boolean, Default: false
   *                                    // Whether the OData service supports change sets with <b>multiple</b>
   *                                    // operations bundled into a single logical unit of work. Otherwise
   *                                    // each modifying operation is isolated in a change set of its own.
   *       "sap-language": "EN",        // header which is set for all requests sent
   *       "sap-client": 120,           // header which is set for all requests sent
   *       "sap-statistics": true       // header which is set for all requests sent; in order to receive
   *                                    // some performance statistics
   *     }
   *   </pre>
   * @param {sap.ui2.srvc.ODataService} oODataService
   *   facade to any OData service, keeping track of CSRF token and default error handler
   *   (see {@link #getODataService})
   *
   * @class
   * @public
   * @since 1.19.0
   */
  // OLD API: function (sBaseUrl, oODataService, bSupportsChangeSets)
  sap.ui2.srvc.ODataWrapper = function (oSettings, oODataService) {
    var S_STICKY_SESSION_HEADER = "saplb", // header to check during sticky session
      aBatchQueue, // corresponds to data.__batchRequests
      bChangeSetOpen, // whether a change set is currently open at the end of our batch queue
      aDeferredQueue, // jQuery.Deferred() objects corresponding to each request
      bRefreshingCsrfToken, // whether CSRF token is currently being refreshed automatically(!)
      that = this,
      sBaseUrl,
      bSupportsChangeSets;

    // BEWARE: constructor code below!

    // "private" methods -------------------------------------------------------

    /**
     * Converts old api calls of the ODataWrapper constructor to the current one.
     * @param {object} oArgs
     *   An arguments object containing the parameters of the constructor function. See Constructor for details.
     * @returns {object}
     *   Settings for ODataWrapper in an object instead of arguments
     * @private
     */
    function handleOldConstructorApi(oArgs) {
      var oSettings = {};

      oSettings.baseUrl = oArgs[0];
      // This is not a mandatory parameter and might be undefined
      if (typeof oArgs[2] === 'boolean') {
        oSettings.supportsChangeSets = oArgs[2];
      }

      return oSettings;
    }

    /* eslint-disable no-unused-vars */
    /**
     * Getter mainly used for testing.
     *
     * @returns {object}
     */
    sap.ui2.srvc.testPublishAt(that);
    function getBatchQueue() {
        return aBatchQueue;
    }
    /* eslint-enable no-unused-vars */

    /**
     * Iterates over the given headers map and returns the first value for the requested key (case
     * insensitive). If no such key is found, <code>undefined</code> is returned.
     *
     * @param {string} sKey
     *   the requested key
     * @param {object} [mHeaders={}]
     *   an object treated as a <code>map&lt;string, object&gt;</code>
     * @returns {string}
     *   the header value or <code>undefined</code> if the header was not found
     */
    sap.ui2.srvc.testPublishAt(that);
    function headerValue(sKey, mHeaders) {
      var sCurrentKey;
      sKey = sKey.toLowerCase();
      for (sCurrentKey in mHeaders) {
        if (Object.prototype.hasOwnProperty.call(mHeaders, sCurrentKey)
            && sCurrentKey.toLowerCase() === sKey) {
          return mHeaders[sCurrentKey];
        }
      }
      return undefined;
    }

    /**
     * Gets an object supposed to be the headers object used for OData requests.
     * Adds headers set as static properties of sap.ui2.srvc.ODataWrapper or as part of Constructor settings.
     * The following headers may be added:
     *  - sap-language
     *  - sap-statistics
     *  - sap-client
     *
     * @param {object} [oHeaders={}]
     *   optional object supposed to be the headers object used for OData requests
     * @returns {object}
     *   returns oHeader (if not given, a new object is created) additional headers may be added as
     *   properties to the object.
     */
    function addGlobalSapHeaders(oHeaders) {
      var sSapLanguage = oSettings["sap-language"] || sap.ui2.srvc.ODataWrapper["sap-language"],
        sSapStatistics = oSettings["sap-statistics"] || sap.ui2.srvc.ODataWrapper["sap-statistics"],
        sSapClient = oSettings["sap-client"] || sap.ui2.srvc.ODataWrapper["sap-client"];

      oHeaders = oHeaders || {};
      if (sSapLanguage) {
        oHeaders["sap-language"] = sSapLanguage;
      }
      if (sSapStatistics || (sSapStatistics === "false")) {
        // If sSapStatistics is set, all requests done via ODataWrapper, will contain the
        // sap-statistics header. See
        // http://help.sap.com/saphelp_nw74/helpdata/de/40/93b81292194d6a926e105c10d5048d/content.htm
        oHeaders["sap-statistics"] = "" + sSapStatistics;
      }
      if (sSapClient) {
          oHeaders["sap-client"] = sSapClient;
      }
      return oHeaders;
    }

    /**
     * Adds previously detected sticky session headers to the given object
     * (which is supposed to be the headers object used for OData requests).
     *
     * @param {object} [oHeaders={}]
     *   optional object supposed to be the headers object used for OData requests
     * @returns {object}
     *   returns oHeader (if not given, a new object is created) additional
     *   headers may be added as properties to the object.
     */
    function addStickySessionHeader(oHeaders) {
      oHeaders = oHeaders || {};

      var oStickySessionConfiguration =
        sap.ui2.srvc.ODataWrapper.oStickySessionConfiguration[sBaseUrl];

      /*
       * NOTE: not assuming oStickySessionConfiguration is defined (see comment
       * on assigment of sap.ui2.srvc.ODataWrapper.oStickySessionConfiguration)
       * down in this file.
       */
      if (typeof oStickySessionConfiguration === "undefined") {
        return oHeaders;
      }

      if (oStickySessionConfiguration && oStickySessionConfiguration.enabled &&
        typeof oStickySessionConfiguration.value !== "undefined") {

        oHeaders[S_STICKY_SESSION_HEADER] = oStickySessionConfiguration.value;
      }

      return oHeaders;
    }

    /**
     * Detects sticky session based on the given response headers and, in case
     * of success, updates the static
     * sap.ui2.srvc.ODataWrapper.oStickySessionConfiguration with the sticky
     * session value found in the header.
     *
     * @param {object} oResponseHeaders
     *   the response headers
     */
    sap.ui2.srvc.testPublishAt(that);
    function detectStickySession(oResponseHeaders) {
      var sHeaderValue,
        oStickySessionConfiguration =
        sap.ui2.srvc.ODataWrapper.oStickySessionConfiguration[sBaseUrl];

      if (!oStickySessionConfiguration || !oStickySessionConfiguration.enabled) {
        return;
      }

      // add sticky session header value if found
      sHeaderValue = headerValue(S_STICKY_SESSION_HEADER, oResponseHeaders);
      if (typeof sHeaderValue === "undefined") {
        return;
      }

      if (oStickySessionConfiguration.value !== sHeaderValue) { // take the last value from server
        oStickySessionConfiguration.value = sHeaderValue;
      }
    }

    /**
     * Iterates over the given headers map and returns the first value for the well-known
     * "X-CSRF-Token" key (case insensitive). If no such key is found, <code>""</code> is
     * returned.
     *
     * @param {object} [mHeaders={}]
     *   an object treated as a <code>map&lt;string, object&gt;</code>
     * @returns {string}
     */
    sap.ui2.srvc.testPublishAt(that);
    function csrfTokenValue(mHeaders) {
      return headerValue("x-csrf-token", mHeaders) || "";
    }

    /**
     * Wrapper around
     * <a href="http://datajs.codeplex.com/wikipage?title=datajs%20OData%20API#OData.request">
     * <code>OData.request</code></a> which is able to automatically fetch a CSRF token if
     * required.
     *
     * @param {string} sRequestUrl
     *   a string containing the <b>absolute</b> URL
     * @param {string} sMethod
     *   the HTTP method to use, e.g. "POST"
     * @param {object} oPayload
     *   payload of the request (in intermediate format)
     * @param {function(object)} [fnSuccess]
     *   callback function that is executed if the request succeeds, taking the processed data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   Defaults to the OData service facade's default error handler
     * @param {object} [oHandler]
     *   (OData/datajs) handler for the response data
     * @param {boolean} [bIsRepeatedRequest]
     *   This function recursively calls itself to re-execute it in case the CSRF token was invalid and has been fetched.
     *   To prevent endless loops when the server returns an invalid token, this flag is used.
     */
    sap.ui2.srvc.testPublishAt(that);
    function doRequest(sRequestUrl, sMethod, oPayload, fnSuccess, fnFailure, oHandler, bIsRepeatedRequest) {
      var oHeaders;
      fnSuccess = fnSuccess || nop;
      fnFailure = fnFailure || oODataService.getDefaultErrorHandler();
      that.check(fnSuccess, fnFailure);
      oHeaders = {
        'Accept': "application/json",
        'Accept-Language': (sap.ui && sap.ui.getCore().getConfiguration().getLanguage()) || "",
        'X-CSRF-Token': oODataService.getCsrfToken()
      };

      addGlobalSapHeaders(oHeaders);
      addStickySessionHeader(oHeaders);

      OData.request({
        requestUri: sRequestUrl,
        method: sMethod,
        data: oPayload,
        headers : oHeaders
      },
        function (oData, oResponse) {
          detectStickySession((oResponse || {}).headers);
          jQuery.sap.log.debug("Received OData response for " + sMethod + ' "' + sRequestUrl + '"',
            null,
            "sap.ui2.srvc.ODataWrapper");
          // Note: drop excess parameters; try/catch
          sap.ui2.srvc.call(fnSuccess.bind(null, oData), fnFailure);
        },
        function (oError) {
          // wrappers for success & failure handlers to reset flag
          function failure() {
            fnFailure.apply(null, arguments);
          }
          function success() {
            fnSuccess.apply(null, arguments);
          }

          if (!bIsRepeatedRequest
              && oError.response.statusCode === 403
              && csrfTokenValue(oError.response.headers).toLowerCase() === "required") {
            // refresh CSRF token and repeat original request
            jQuery.sap.log.debug("CSRF token required for " + sMethod + ' "' + sRequestUrl
              + '", refreshing it', JSON.stringify(oError.response),
              "sap.ui2.srvc.ODataWrapper");

            oODataService.refreshCsrfToken(
              doRequest.bind(that, sRequestUrl, sMethod, oPayload, success, failure, oHandler, /*bIsRepeatedRequest*/ true),
              failure
            );
          } else {
            that.onError(sMethod, sRequestUrl, fnFailure, /*oDeferred*/null, oError);
          }
        },
        oHandler);
      jQuery.sap.log.debug("Sent OData request for " + sMethod + ' "' + sRequestUrl + '"', null,
        "sap.ui2.srvc.ODataWrapper");
    }

    /**
     * Transforms the given absolute URL into a relative URL w.r.t. this OData wrapper's base URL,
     * removing protocol, host, port, and base URL, but preserving query parameters and a fragment
     * part.
     *
     * @param {string} sRequestUrl
     *   a string containing an <b>absolute</b> URL, e.g.
     *   "http://acme.corp/OData/OData.svc/Products(1)?$foo=bar#abc"
     * @returns {string}
     *   a string containing the <b>relative</b> URL w.r.t. this OData wrapper's base URL, e.g.
     *   "Products(1)?$foo=bar#abc"
     */
    sap.ui2.srvc.testPublishAt(that);
    function toRelativeUrl(sRequestUrl) {
      var i = sRequestUrl.indexOf(sBaseUrl);
      if (i < 0) {
        throw new sap.ui2.srvc.Error('Not relative to base URL "' + sBaseUrl + '": ' + sRequestUrl,
          "sap.ui2.srvc.ODataWrapper");
      }
      return sRequestUrl.slice(i + sBaseUrl.length);
    }

    /**
     * Transforms the given relative URL into an absolute URL w.r.t. this OData wrapper's base URL,
     * making sure there is exactly one slash in between.
     *
     * @param {string} sRelativeUrl
     *   a string containing the <b>relative</b> URL w.r.t. this OData wrapper's base URL, e.g.
     *   "Products(1)"
     * @returns {string}
     *   a string containing the <b>absolute</b> URL, e.g. "/OData/OData.svc/Products(1)"
     */
    sap.ui2.srvc.testPublishAt(that);
    function toRequestUrl(sRelativeUrl) {
      if (/^\//.test(sRelativeUrl)) {
        throw new sap.ui2.srvc.Error("Not a relative URL: " + sRelativeUrl,
          "sap.ui2.srvc.ODataWrapper");
      }
      return sBaseUrl + sRelativeUrl;
    }

    /**
     * Wrapper around
     * <a href="http://datajs.codeplex.com/wikipage?title=datajs%20OData%20API#OData.read">
     * <code>OData.read</code></a> which supports queuing up for "$batch" requests.
     *
     * @param {string} sRelativeUrl
     *   a string containing the <b>relative</b> URL w.r.t. this OData wrapper's base URL, e.g.
     *   "Products(1)"
     * @param {function(object,object)} fnRawSuccess
     *   a callback function that is executed if the request succeeds, taking the processed data
     *   and the response object
     * @param {function (object)} fnRawFailure
     *   a callback function that is executed if the request fails, taking an error object
     */
    sap.ui2.srvc.testPublishAt(that);
    function readOrBatch(sRelativeUrl, fnRawSuccess, fnRawFailure) {
      var oDeferred,
        sRequestUrl = toRequestUrl(sRelativeUrl),
        oHeaders = addStickySessionHeader(addGlobalSapHeaders()); // may return an empty object

      if (aBatchQueue) {
        jQuery.sap.log.debug('Queued OData request for GET "' + sRelativeUrl + '"', null,
          "sap.ui2.srvc.ODataWrapper");
        aBatchQueue.push({
          method: "GET",
          requestUri: sRelativeUrl,
          headers: oHeaders
        });
        oDeferred = (new jQuery.Deferred()).done(fnRawSuccess).fail(fnRawFailure);
        aDeferredQueue.push(oDeferred);
        bChangeSetOpen = false;
        return;
      }

      // add specifc headers for read request
      oHeaders["Accept"] = "application/json";
      oHeaders["Accept-Language"] = (sap.ui && sap.ui.getCore().getConfiguration().getLanguage()) || "";
      // always fetch a new token with GET requests;
      // this avoids using old tokens from responses served from browser cache
      // see internal BCP incident 1570753380
      oHeaders["X-CSRF-Token"] = "Fetch";

      OData.read({
        requestUri: sRequestUrl,
        headers: oHeaders
      }, fnRawSuccess, fnRawFailure);
      jQuery.sap.log.debug('Sent OData request for GET "' + sRequestUrl + '"', null,
        "sap.ui2.srvc.ODataWrapper");
    }

    /**
     * Wrapper around {@link #doRequest} which supports queuing up for "$batch" requests.
     *
     * @param {string} sRelativeUrl
     *   a string containing the <b>relative</b> URL w.r.t. this OData wrapper's base URL, e.g.
     *   "Products"
     * @param {string} sMethod
     *   the HTTP method to use, either "POST", "PUT" or "DELETE" (retrieve requests using "GET"
     *   must be made via {@link #readOrBatch} instead!)
     * @param {object} oPayload
     *   payload of the request (in intermediate format)
     * @param {function(object)} [fnSuccess]
     *   callback function that is executed if the request succeeds, taking the processed data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   Defaults to the OData service facade's default error handler
     */
    sap.ui2.srvc.testPublishAt(that);
    function requestOrBatch(sRelativeUrl, sMethod, oPayload, fnSuccess, fnFailure) {
      /*jslint nomen:true */
      var oDeferred,
        oChangeRequest = {
          data: oPayload,
          method: sMethod,
          requestUri: sRelativeUrl,
          headers: addStickySessionHeader(addGlobalSapHeaders()) // may return an empty object
        },
        sRequestUrl = toRequestUrl(sRelativeUrl);

      if (aBatchQueue) {
        fnSuccess = fnSuccess || nop;
        fnFailure = fnFailure || oODataService.getDefaultErrorHandler();
        that.check(fnSuccess, fnFailure);
        jQuery.sap.log.debug("Queued OData request for " + sMethod + ' "' + sRelativeUrl + '"',
          null, "sap.ui2.srvc.ODataWrapper");
        if (!bChangeSetOpen) {
          aBatchQueue.push({__changeRequests: []});
          aDeferredQueue.push([]);
          bChangeSetOpen = bSupportsChangeSets;
        }
        aBatchQueue[aBatchQueue.length - 1].__changeRequests.push(oChangeRequest);
        oDeferred = (new jQuery.Deferred())
          .done(function (oData, oResponse) {
            jQuery.sap.log.debug("Received OData response for "
              + sMethod + ' "' + sRequestUrl + '"', null, "sap.ui2.srvc.ODataWrapper");
            // Note: drop excess parameters; try/catch
            sap.ui2.srvc.call(fnSuccess.bind(null, oData), fnFailure);
          })
          .fail(that.onError.bind(that, sMethod, sRequestUrl, fnFailure, /*oDeferred*/null));
        aDeferredQueue[aDeferredQueue.length - 1].push(oDeferred);
        return;
      }

      doRequest(sRequestUrl, sMethod, oPayload, fnSuccess, fnFailure);
    }

    // "public" methods --------------------------------------------------------

    /**
     * Checks whether session stickyness is configured and enabled
     *
     * @returns {boolean}
     *   whether the sticky session header is configured and active
     *
     * @public
     *
     * @since 1.30.0
     */
    this.isStickySessionEnabled = function() {
      return (sap.ui2.srvc.ODataWrapper.oStickySessionConfiguration[sBaseUrl] || {}).enabled || false;
    };

    /**
     * <p>
     * Configures and activates session stickiness.
     * </p>
     * <p>
     * Session stickiness allows the client to execute OData requests to the
     * same application server. This is achieved by copying a certain sticky
     * session header
     * (found in the OData response from the server) to the OData request made
     * by ODataWrapper, indicating the load balancer that requests should be
     * made against a certain application server. Once detected, the sticky
     * header is automatically shared by all instances of
     * <code>sap.ui2.srvc.ODataWrapper</code> connected to exactly the same
     * base URL.
     * </p>
     * <p>
     * NOTE: The sticky session header sent from the server always overrides
     * the last sticky session header requested. This is to avoid that the
     * feature is disabled if the load balancer returns another value for the
     * sticky session header for some reason (e.g. the application server goes
     * offline).
     * </p>
     * <p>
     * NOTE: In line with {@link sap.ui2.srvc.PageBuildingService}, session
     * stickiness is only supported in scopes different from PERS.
     * </p>
     * <p>
     * Currently, session stickiness is affected by the following limitations:
     * <ul>
     * <li>If the client caches the response headers for certain requests, these
     * cached headers will be used instead of the headers sent from the server
     * (as in if cache was disabled).</li>
     * <li>If initial requests to different URLs that share the same base URL are
     * performed asynchronously (e.g. through multiple instances of
     * ODataWrapper), sticky session may be disabled for a part or all of these
     * initial requests. This is because the requests are made before the first
     * response with a sticky session header is obtained.</li>
     * <li>This mechanism only guarantees that requests are forwarded to the
     * specified application server. For example, if the application server in
     * turn contacts further load balanced servers, the session may not be
     * maintain and load balancing may still occur.</li>
     * </ul>
     * </p>
     * @public
     *
     * @since 1.30.0
     */
    this.enableStickySession = function() {
      sap.ui2.srvc.ODataWrapper.oStickySessionConfiguration[sBaseUrl].enabled = true;
    };

    /**
     * Checks that the given callback functions are really functions. This check
     * is useful to "fail fast" because these callbacks are not called immediately.
     *
     * @param {function} fnSuccess
     *   success callback
     * @param {function} fnFailure
     *   error callback
     *
     * @public
     * @since 1.19.0
     */
    this.check = function (fnSuccess, fnFailure) {
      if (!fnSuccess) {
        throw new sap.ui2.srvc.Error("Missing success callback",
          "sap.ui2.srvc.ODataWrapper");
      }
      if (typeof fnSuccess !== "function") {
        throw new sap.ui2.srvc.Error("Success callback is not a function",
          "sap.ui2.srvc.ODataWrapper");
      }
      if (!fnFailure) {
        throw new sap.ui2.srvc.Error("Missing error callback",
          "sap.ui2.srvc.ODataWrapper");
      }
      if (typeof fnFailure !== "function") {
        throw new sap.ui2.srvc.Error("Error callback is not a function",
          "sap.ui2.srvc.ODataWrapper");
      }
    };

    /**
     * Wrapper around <code>OData.request</code> which is able to automatically fetch a CSRF token
     * if required. It uses POST as a method.
     *
     * @param {string} sRelativeUrl
     *   a string containing the <b>relative</b> URL w.r.t. this OData wrapper's base URL, e.g.
     *   "Products"
     * @param {object} oPayload
     *   payload of the request (in intermediate format)
     * @param {function(object)} [fnSuccess]
     *   callback function that is executed if the request succeeds, taking the processed data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   Defaults to the OData service facade's default error handler
     *
     * @public
     * @since 1.19.0
     */
    this.create = function (sRelativeUrl, oPayload, fnSuccess, fnFailure) {
      requestOrBatch(sRelativeUrl, "POST", oPayload, fnSuccess, fnFailure);
    };

    /**
     * Wrapper around <code>OData.request</code> which is able to automatically fetch a CSRF token
     * if required. It uses DELETE as a method.
     *
     * @param {string|object} vEntity
     *   either a string containing the <b>relative</b> URL w.r.t. this OData wrapper's base URL,
     *   e.g. "Products(1)", or the datajs representation of the entity
     * @param {function()} [fnSuccess]
     *   callback function that is executed if the request succeeds, taking no data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   Defaults to the OData service facade's default error handler
     *
     * @public
     * @since 1.19.0
     */
    this.del = function (vEntity, fnSuccess, fnFailure) {
      /*jslint nomen:true */
      var sRelativeUrl = vEntity;

      if (typeof sRelativeUrl !== "string") {
        sRelativeUrl = toRelativeUrl(vEntity.__metadata.uri);
      }

      requestOrBatch(sRelativeUrl, "DELETE", null, function (oData) {
        if (fnSuccess) {
          // Note: try/catch already done by doRequest()
          fnSuccess(); // drop excess parameters (oData === undefined)
        }
      }, fnFailure);
    };

    /**
     * Returns the wrapper's base URL.
     *
     * @returns {string}
     *   base URL of the OData service, e.g. "/OData/OData.svc/"
     *
     * @public
     * @since 1.19.0
    */
    this.getBaseUrl = function () {
      return sBaseUrl;
    };

    /**
     * Returns this wrapper's facade to an OData service (which was passed to the constructor
     * {@link sap.ui2.srvc.ODataWrapper}).
     *
     * @returns {sap.ui2.srvc.ODataService}
     *   this wrapper's facade to an OData service.
     *
     * @public
     * @since 1.19.1
     */
    this.getODataService = function () {
      return oODataService;
    };

    /**
     * Wraps the given generic OData failure handler. It processes the raw
     * OData error response object, calls the given failure handler with an
     * error message and, since version 1.28.6, an object containing additional
     * technical details.  If a Deferred object is given, it is rejected with
     * the same arguments passed to the failure handler call.
     *
     * This method logs technical information to the console if this is
     * available at the time the error occurs.
     *
     * @param {string} sMethod
     *   the HTTP method used in the OData request, e.g. "POST"
     * @param {string} sRequestUrl
     *   the <b>absolute</b> URL the request is sent to
     * @param {function (string, [object])} fnFailure
     *   the wrapped failure handler that will be called synchronously. The
     *   first parameter is a human-readable error message containing technical
     *   information, including sMethod and sRequestUrl; the second parameter
     *   is an <b>optional</b> object containing the complete error information
     *   returned in the <code>error</code> value contained in the body of the
     *   OData error response object, plus the HTTP response status code.
     *
     *   For example, the returned error object has the following structure:
     *   <pre>
     *   {
     *     httpStatus: 404,
     *     // ... other keys and values from oError.response.body.error
     *   }
     *   </pre>
     *
     *   Please refer to the documentation of the specific OData service used
     *   for details about keys and values returned in
     *   <code>oError.response.body.error</code>.<br />
     *
     *   <b>IMPORTANT:</b> the second parameter may be undefined if the error
     *   cannot be parsed or is not returned in the OData error response.<br />
     *
     *   <b>NOTE:</b> the second parameter is returned since version 1.28.6.
     * @param {jQuery.Deferred} [oDeferred]
     *   a <code>jQuery.Deferred</code> object that will be rejected with the
     *   same arguments fnFailure is called
     * @param {object} oError
     *   error object provided by datajs, should contain the response
     *
     * @public
     * @since 1.19.0
     */
    this.onError = function (sMethod, sRequestUrl, fnFailure, oDeferred, oError) {
      var oParsedErrorInformation,
        sMessage = "Error ";

      if (oError.response && oError.response.statusCode) {
        sMessage += "(" + oError.response.statusCode + ", " + oError.response.statusText + ") ";
      }
      sMessage += "in OData response for " + sMethod + ' "' + sRequestUrl + '": ' + oError.message;

      if (oError.response && oError.response.body) {

        try {
          oParsedErrorInformation = JSON.parse(oError.response.body).error;

          if (oParsedErrorInformation) {

            if (oParsedErrorInformation.hasOwnProperty("message") &&
                oParsedErrorInformation.message.hasOwnProperty("value")) {
              sMessage += "\nDetails: " + oParsedErrorInformation.message.value;
            }

            // NOTE: there was an agreement to not alter the data in
            // oError.response.body.error (except from adding the status if
            // it's not there already)
            if (oError.response.statusCode && !oParsedErrorInformation.httpStatus) {
              oParsedErrorInformation.httpStatus = oError.response.statusCode;
            }
          }
        } catch (ex) {
          // do not rely on subtleties of error response, treat error details as optional
        }
      }

      jQuery.sap.log.error(sMessage, JSON.stringify(oError.response),
        "sap.ui2.srvc.ODataWrapper");

      if (oDeferred) {
        oDeferred.reject(sMessage, oParsedErrorInformation);
      }
      fnFailure(sMessage, oParsedErrorInformation);
    };

    /**
     * Opens a new queue where all requests are parked until a call to {@link #submitBatchQueue}.
     *
     * @public
     * @since 1.19.0
     *
     * @see #isBatchQueueOpen
     * @see #submitBatchQueue
     */
    this.openBatchQueue = function () {
      if (aBatchQueue) {
        throw new sap.ui2.srvc.Error("Batch queue already open", "sap.ui2.srvc.ODataWrapper");
      }

      aBatchQueue = [];
      aDeferredQueue = [];
      bChangeSetOpen = false;
    };

    /**
     * Checks whether the queue of requests is already open or not
     *
     * @returns {boolean}
     *   true if batchQueue is already open
     *
     * @public
     * @since 1.34.0
     *
     * @see #openBatchQueue
     * @see #submitBatchQueue
     */
    this.isBatchQueueOpen = function() {
        return !!aBatchQueue;
    };

    /**
     * Wrapper around
     * <a href="http://datajs.codeplex.com/wikipage?title=datajs%20OData%20API#OData.read">
     * <code>OData.read</code></a> which supports caching.
     *
     * @param {string} sRelativeUrl
     *   a string containing the <b>relative</b> URL w.r.t. this OData wrapper's base URL, e.g.
     *   "Products(1)"
     * @param {function(object)} fnSuccess
     *   a callback function that is executed if the request succeeds, taking the processed data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   Defaults to the OData service facade's default error handler
     *   ({@link sap.ui2.srvc.ODataService#getDefaultErrorHandler})
     * @param {boolean} [bCache=false]
     *   whether the response is cached for further calls (since 1.11.0) in
     *   <code>OData.read.$cache</code>, a <code>sap.ui2.srvc.Map</code> from
     *   <code>sRequestUrl</code> to a <code>jQuery.Deferred</code> object created on demand;
     *   without this flag, the cache is neither written nor read!
     *
     * @public
     * @since 1.19.0
     */
    this.read = function (sRelativeUrl, fnSuccess, fnFailure, bCache) {
      var oDeferred,
        sRequestUrl = toRequestUrl(sRelativeUrl),
        sSapMessage;

      /*
       * Success handler for <code>OData.read</code>.
       */
      function success(oData, oResponse) {
        detectStickySession(oResponse.headers);
        oODataService.setCsrfToken(
          csrfTokenValue(oResponse.headers) || oODataService.getCsrfToken() // prefer a new token
        );
        jQuery.sap.log.debug('Received OData response for GET "' + sRequestUrl + '"', null,
          "sap.ui2.srvc.ODataWrapper");
        // The sap-message header is a Gateway feature used e.g. by the INTEROP service
        // It returns structured information (as XML). We don't evaluate it, we only log it.
        // Severity is also part of the structure, but we simply assume warning.
        sSapMessage = headerValue("sap-message", oResponse.headers);
        if (sSapMessage) {
          jQuery.sap.log.warning("SAP message for GET " + sRequestUrl, sSapMessage,
            "sap.ui2.srvc.ODataWrapper");
        }
        if (oDeferred) {
          // put arguments for fnSuccess into cache; clone oData first
          oDeferred.resolve(JSON.parse(JSON.stringify(oData)), oODataService.getCsrfToken());
        }
        // Note: drop excess parameters; try/catch
        sap.ui2.srvc.call(fnSuccess.bind(null, oData), fnFailure);
      }

      fnFailure = fnFailure || oODataService.getDefaultErrorHandler();
      this.check(fnSuccess, fnFailure);

      if (bCache) {
        OData.read.$cache = OData.read.$cache || new sap.ui2.srvc.Map();
        oDeferred = OData.read.$cache.get(sRequestUrl); // the promise is cached
        if (oDeferred) {
          jQuery.sap.log.debug('Using cached response for GET "' + sRequestUrl + '"', null,
            "sap.ui2.srvc.ODataWrapper");
          oDeferred.done(function (oData, sCachedCsrfToken) {
            // prefer our own token
            oODataService.setCsrfToken(oODataService.getCsrfToken() || sCachedCsrfToken);
            // clone cached oData before passing to success handler
            // Note: try/catch
            sap.ui2.srvc.call(fnSuccess.bind(null, JSON.parse(JSON.stringify(oData))), fnFailure);
          }).fail(fnFailure);
          return;
        }
        oDeferred = new jQuery.Deferred();
        OData.read.$cache.put(sRequestUrl, oDeferred.promise());
      }

      readOrBatch(
        sRelativeUrl,
        success,
        this.onError.bind(this, "GET", sRequestUrl, fnFailure, oDeferred)
      );
    };

    /**
     * Performs a batch request with the given payload.
     *
     * <b>Warning:</b> This bypasses the batch queue.
     *
     * @param {object} oPayload
     *   payload of the request (in intermediate format)
     * @param {function(object)} [fnSuccess]
     *   callback function that is executed if the request succeeds, taking the processed data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   Defaults to the OData service facade's default error handler
     * @private
     */
    this.batch = function (oPayload, fnSuccess, fnFailure) {
      var sRequestUrl = toRequestUrl("$batch");

      doRequest(sRequestUrl, "POST", oPayload, fnSuccess, fnFailure, OData.batchHandler);
    };

    /**
     * Submits the current batch queue opened by {@link #openBatchQueue} by sending a single
     * "$batch" request to the OData service and deletes the current batch queue immediately.
     *
     * @param {function()} [fnBatchAccepted]
     *   A callback function that is executed if the batch request is accepted by the
     *   server, no matter whether individual operations fail. It will be called <b>after</b> all
     *   success or failure handlers of individual operations.
     * @param {function(string, [object])} [fnBatchItselfFailed]
     *   A callback function that is executed if the batch request itself
     *   fails, error handler taking an error message and, since version
     *   1.28.6, an optional object containing the complete error information
     *   as delivered by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.<br />
     *
     *   Defaults to the OData service facade's default
     *   error handler ({@link sap.ui2.srvc.ODataService#getDefaultErrorHandler}).<br />
     *
     *   This is called <b>instead</b> of individual failure handlers in this case!
     *
     * @public
     * @since 1.19.0
     *
     * @see #openBatchQueue
     * @see #isBatchQueueOpen
     */
    this.submitBatchQueue = function (fnBatchAccepted, fnBatchItselfFailed) {
      /*jslint nomen:true */
      var aMyDeferredQueue = aDeferredQueue; // used in closure below

      /*
       * Success handler for $batch request.
       *
       * @param {object} oData
       */
      function onBatchSuccess(oData) {
        var iActual = oData.__batchResponses.length,
          iExpected = aMyDeferredQueue.length;

        if (iExpected !== iActual) {
          that.onError("POST", toRequestUrl("$batch"), fnBatchItselfFailed, /*oDeferred*/null, {
            message: "Protocol error! Expected " + iExpected
              + " responses, but received " + iActual
          });
          return;
        }

        oData.__batchResponses.forEach(function (oResponse, i) {
          // Note: "raw" success/failure signatures for all requests!
          var oDeferred = aMyDeferredQueue[i];
          if (oResponse.response) {
            // if it contains a nested response, it must be a failure
            reject(oDeferred, oResponse);
          } else if (oResponse.__changeResponses) {
            // successful change set
            oResponse.__changeResponses.forEach(function (oChangeResponse, j) {
              oDeferred[j].resolve(oChangeResponse.data, oChangeResponse);
            });
          } else {
            // successful GET request
            oDeferred.resolve(oResponse.data, oResponse);
          }
        });

        if (fnBatchAccepted) {
          sap.ui2.srvc.call(fnBatchAccepted, oODataService.getDefaultErrorHandler());
        }
      }

      if (!aBatchQueue) {
        throw new sap.ui2.srvc.Error("No open batch queue to submit", "sap.ui2.srvc.ODataWrapper");
      }

      if (aBatchQueue.length > 0) {
        this.batch({__batchRequests: aBatchQueue}, onBatchSuccess, fnBatchItselfFailed);
      } else if (fnBatchAccepted) {
        // call success handler (if given) directly (async) if batchQueue is empty
        sap.ui2.srvc.call(fnBatchAccepted, oODataService.getDefaultErrorHandler(), /*async=*/true);
      }

      aBatchQueue = undefined;
      aDeferredQueue = undefined; // be nice to the garbage collector
    };

    /**
     * Returns this wrapper's string representation.
     *
     * @param {boolean} [bVerbose=false]
     *   flag whether to show all properties
     * @returns {string}
     *   this wrapper's string representation
     *
     * @public
     * @since 1.19.0
     */
    this.toString = function (bVerbose) {
      var aResult = ['sap.ui2.srvc.ODataWrapper({sBaseUrl:"', sBaseUrl, '"'];
//      if (bVerbose) {
//      }
      aResult.push('})');
      return aResult.join('');
    };

    /** executes a put request
     *
     * @param {string} sRelativeUrl the relative URL to use
     * @param {object} oPayload the payload
     * @param {function ()} [fnSuccess]
     *   callback function that is executed if the request succeeds, taking no data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   Defaults to the OData service facade's default error handler
     */
    this.put = function (sRelativeUrl, oPayload, fnSuccess, fnFailure) {
      requestOrBatch(sRelativeUrl, "PUT", oPayload, function (oData) {
        if (fnSuccess) {
          // Note: try/catch already done by doRequest()
          fnSuccess(); // drop excess parameters (oData === undefined)
        }
      }, fnFailure);
    };
    /**
     * Generic entity update method.
     *
     * @param {object} oEntity
     *   the datajs representation of the entity
     * @param {function ()} [fnSuccess]
     *   callback function that is executed if the request succeeds, taking no data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   Defaults to the OData service facade's default error handler
     *
     * @public
     * @since 1.19.0
     */
    this.update = function (oEntity, fnSuccess, fnFailure) {
      /*jslint nomen:true */
      var oPayload = {
          "__metadata": {
            type: oEntity.__metadata && oEntity.__metadata.type
          }
        },
        sPropertyName,
        sRelativeUrl = toRelativeUrl(oEntity.__metadata.uri);

      // copy all original property values of entity into request data
      for (sPropertyName in oEntity) {
        if (Object.prototype.hasOwnProperty.call(oEntity, sPropertyName)
            && sPropertyName.indexOf('$') !== 0
            && typeof oEntity[sPropertyName] !== "object") {
          oPayload[sPropertyName] = oEntity[sPropertyName];
        }
      }
      this.put(sRelativeUrl, oPayload, fnSuccess, fnFailure);
    };

    // constructor code -------------------------------------------------------
    if (!sap.ui2.srvc.Map) {
      fnRequire("sap.ui2.srvc.utils");
    }

    // Detect old API and transform it to the current one
    if (typeof oSettings === 'string') {
      oSettings = handleOldConstructorApi(arguments);
    } else if (typeof oSettings === 'object') {
      // clone to ensure it is not changed afterwards
      oSettings = cloneObject(oSettings);
    }

    if (!oSettings || !oSettings.baseUrl || typeof oSettings.baseUrl !== "string") {
      throw new sap.ui2.srvc.Error("Missing base URL", "sap.ui2.srvc.ODataWrapper");
    }
    if (!oODataService || typeof oODataService !== "object") {
      throw new sap.ui2.srvc.Error("Missing OData service facade", "sap.ui2.srvc.ODataWrapper");
    }

    // ensure that base URL has a trailing /
    oSettings.baseUrl = oSettings.baseUrl.replace(/\/$/, "") + "/";

    sBaseUrl = oSettings.baseUrl;
    bSupportsChangeSets = oSettings.supportsChangeSets;

    if (typeof sap.ui2.srvc.ODataWrapper.oStickySessionConfiguration === "undefined") {
      jQuery.sap.log.error("sap.ui2.srvc.ODataWrapper.oStickySessionConfiguration is not defined!",
        "the sap.ui2.srvc.ODataWrapper constructor was called before the static property was defined",
        "sap.ui2.srvc.ODataWrapper");
    } else if (typeof sap.ui2.srvc.ODataWrapper.oStickySessionConfiguration[sBaseUrl] === "undefined") {

      // Define the sticky session configuration for the base URL managed by
      // this ODataWrapper instance.
      sap.ui2.srvc.ODataWrapper.oStickySessionConfiguration[sBaseUrl] = {
        enabled: false, // sticky session disabled by default
        value: undefined // the value detected if enabled = true
      };
    }
  };

  /**
   * Detects and, if needed, converts old api calls of the createODataWrapper function to the current one.
   * @param {object} oArgs
   *   An arguments object containing the parameters of the createODataWrapper function. See createODataWrapper for details
   * @returns {object}
   *   Settings for ODataWrapper and default failure function
   * @private
   */
  function handleOldCreateODataWrapperApi (oArgs) {
    var oSettings = {};
    var oTransformedApi = {};

    oSettings.baseUrl = oArgs[0];
    // These are non mandatory parameters and might be undefined
    if (typeof oArgs[1] === 'boolean') {
      oSettings.supportsChangeSets = oArgs[1];
    }
    if (typeof oArgs[2] === 'function') {
      oTransformedApi.defaultFailure = oArgs[2];
    }
    oTransformedApi.settings = oSettings;

    return oTransformedApi;
  }

  /**
   * Clones an Object to avoid unwanted changes
   * @param {object} oInputObject
   *   The object that needs to be cloned
   * @returns {object}
   *   The cloned object
   * @private
   */
  function cloneObject (oInputObject) {
    if (oInputObject === undefined) {
      return undefined;
    }
    try {
      return JSON.parse(JSON.stringify(oInputObject));
    } catch (e) {
      return undefined;
    }
  }

  /*
   * Configuration for sticky session is done here as it is a static property
   * that should not rely on the instance initialization. Also, it may happen
   * that an already defined sap.ui2.srvc.ODataWrapper name is re-assigned
   * because this file is re-executed or re-loaded. Such a scenario may be
   * possible if this file is required twice (after being registered to two
   * different module paths).
   */
  if (typeof sap.ui2.srvc.ODataWrapper.oStickySessionConfiguration === "undefined") {
    sap.ui2.srvc.ODataWrapper.oStickySessionConfiguration = {};
  }

  // public factory function ***************************************************

  /**
   * Checks the sap-statistics setting form UI5's configuration and set it on the ODataWrapper.
   * If UI5 is not available, it is checked if the sap-statistics query parameter is set.
   * Note: this function is directly executed
   * @param {string} getWindowLocationSearch
   *   value of window.location.search; to be able to test the behavior of this method with
   *   different search strings.
   * @private
   */
  sap.ui2.srvc.testPublishAt(sap.ui2.srvc.ODataWrapper);
  function checkSapStatisticsSetting(sWindowLocationSearch) {
    try {
      // read the value from UI5 as it may be set via [CTRL-SHIFT-ALT-P]
      sap.ui2.srvc.ODataWrapper["sap-statistics"] =
        sap.ui.getCore().getConfiguration().getStatistics();
    } catch (e) {
      // Read sap-statistics directly form query parameter in scenarios without UI5
      sap.ui2.srvc.ODataWrapper["sap-statistics"] =
        /sap-statistics=(true|x|X)/.test(sWindowLocationSearch);
    }
  }
  // call function directly (immediate function pattern will break testPublishAt)
  checkSapStatisticsSetting(window.location.search);

  /**
   * Constructs and returns a {@link sap.ui2.srvc.ODataWrapper} which knows its
   * {@link sap.ui2.srvc.ODataService} twin, see {@link sap.ui2.srvc.ODataWrapper#getODataService}.
   *
   * @param {object} oSettings
   *   An object containing various properties:
   *   <pre>
   *     {
   *       baseUrl: "/OData/OData.svc", // Mandatory base URL of the OData service
   *       supportsChangeSets: false,   // Type: boolean, Default: false
   *                                    // Whether the OData service supports change sets with <b>multiple</b>
   *                                    // operations bundled into a single logical unit of work. Otherwise
   *                                    // each modifying operation is isolated in a change set of its own.
   *       "sap-language": "EN",        // header which is set for all requests sent
   *       "sap-client": 120,           // header which is set for all requests sent
   *       "sap-statistics": true       // header which is set for all requests sent; in order to receive
   *                                    // some performance statistics
   *     }
   *   </pre>
   * @param {function (string, [object])} [fnDefaultFailure]
   *   error handler taking an error message and, since version 1.28.6, an
   *   optional object containing the complete error information as delivered
   *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
   *   for more details.
   * @returns {sap.ui2.srvc.ODataWrapper}
   *   new instance of ODataWapper/ODataService
   *
   * @public
   * @since 1.19.1
   */
  // OLD API: function (sBaseUrl, bSupportsChangeSets, fnDefaultFailure)
  sap.ui2.srvc.createODataWrapper = function (oSettings, fnDefaultFailure) {
    // If old API is used we need to transform it to the current one.
    if (typeof arguments[0] === 'string') {
      var oTransformedApi = handleOldCreateODataWrapperApi(arguments);
      oSettings = oTransformedApi.settings;
      if (oTransformedApi.defaultFailure) {
        fnDefaultFailure = oTransformedApi.defaultFailure;
      }
    } else if (typeof arguments[0] === 'object') {
      // clone to ensure it is not changed afterwards
      oSettings = cloneObject(oSettings);
    }

    function Service() {
      var oWrapper = new sap.ui2.srvc.ODataWrapper(oSettings, this);
      fnRequire("sap.ui2.srvc.ODataService");
      sap.ui2.srvc.ODataService.call(this, oWrapper, fnDefaultFailure);
      return oWrapper;
    }

    return new Service(); // BEWARE: this actually _returns_ the wrapper, not the service!
  };
/// @end
}());
