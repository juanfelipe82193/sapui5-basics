// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview A facade to any OData service, providing CSRF token handling and a default
 * error handler.
 */

(function () {
  "use strict";
  /*global jQuery, sap */
  jQuery.sap.declare("sap.ui2.srvc.ODataService");

  var fnRequire;

  // Note: Only the section between @begin and @end is included in pbs-template.js.
  // In pbs-template fnRequire is differently initialized (in case UI5 is not available)!
  // Thus this variable is used in the coding below and not directly jQuery.sap.require.
  // avoid fnRequire = jQuery.sap.require as require cannot be spied on afterwards
  fnRequire = function () {
    jQuery.sap.require.apply(this, arguments);
  };

  function nop() {/* null object pattern */}

 /// @begin
  var mCsrfTokens;

  if (!sap.ui2.srvc.Map) {
    fnRequire("sap.ui2.srvc.utils");
  }
  mCsrfTokens = new sap.ui2.srvc.Map();
  // "public class" ************************************************************

  /**
   * Constructs a facade to any OData service, providing token handling for SAP NetWeaver Gateway's
   * token-based CSRF protection mechanism. See
   * <a href="http://help.sap.com/saphelp_gateway20sp07/helpdata/en/e6/cae27d5e8d4996add4067280c8714e/content.htm?frameset=/en/04/58f03908ce451aa734674e17a43775/frameset.htm&current_toc=/en/57/a41787789c4eca867d9a09696fc42c/plain.htm&node_id=203">
   * Cross-Site Request Forgery Protection</a>.
   *
   * @param {sap.ui2.srvc.ODataWrapper} oODataWrapper
   *   OData wrapper instance this service facade delegates to
   * @param {function (string, [object])} [fnDefaultFailure]
   *   error handler taking an error message and, since version 1.28.6, an
   *   optional object containing the complete error information as delivered
   *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
   *   for more details.
   *
   * @class
   * @borrows sap.ui2.srvc.ODataWrapper#submitBatchQueue as this.submitBatchQueue
   * @public
   * @since 1.19.0
   */
  sap.ui2.srvc.ODataService = function (oODataWrapper, fnDefaultFailure) {
    var sBaseUrl;

    // BEWARE: constructor code below!

    // "private" methods -------------------------------------------------------

    // "public" methods --------------------------------------------------------

    /**
     * Returns the current value of the CSRF token. It is initially empty and determined
     * automatically by <code>sap.ui2.srvc.ODataWrapper</code> on successful read requests.
     *
     * @returns {string}
     *   the current value of the CSRF token
     * @public
     * @since 1.7.0
     * @see #refreshCsrfToken
     * @see #setCsrfToken
     */
    this.getCsrfToken = function () {
      if (mCsrfTokens.get(sBaseUrl) && mCsrfTokens.get(sBaseUrl).token) {
        return mCsrfTokens.get(sBaseUrl).token;
      }
      return "";
    };

    /**
     * Returns the default error handler for this facade.
     *
     * @returns {function (string, [object])}
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @since 1.2.0
     */
    this.getDefaultErrorHandler = function () {
      return fnDefaultFailure;
    };

    /**
     * Opens a new queue where all requests are parked until a call to {@link #submitBatchQueue}.
     *
     * @public
     * @since 1.19.0
     */
    this.openBatchQueue = function () {
      oODataWrapper.openBatchQueue();
    };

    /**
     * Refreshes the CSRF token of this OData service by reading the service document again, which
     * is never cached. Called automatically by <code>sap.ui2.srvc.ODataWrapper</code> on a write
     * operation if the CSRF token is missing or expired.
     *
     * @param {function ()} fnSuccess
     *   a callback function that is executed if the request succeeds
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @public
     * @since 1.17.0
     * @see #getCsrfToken
     * @see #setCsrfToken
     * @see sap.ui2.srvc.ODataWrapper#read
     */
    this.refreshCsrfToken = function (fnSuccess, fnFailure) {
      var oTokenData;

      if (typeof fnSuccess !== "function") {
        throw new sap.ui2.srvc.Error("Success callback is not a function",
            "sap.ui2.srvc.ODataService");
      }
      fnFailure = fnFailure || fnDefaultFailure;

      oTokenData = mCsrfTokens.get(sBaseUrl);

      if (!oTokenData.fetchingInProgress) {
        // fetch token
        oTokenData.token = undefined;
        oTokenData.fetchingInProgress = true;

        // GET service document which is never cached
        oODataWrapper.read("", function () {
          // wrapper.read does a setCsrfToken call
          if (!mCsrfTokens.get(sBaseUrl) || !mCsrfTokens.get(sBaseUrl).token) {

            fnFailure("No CSRF token delivered");

            oTokenData.errorHandlers.forEach(function (fnHandler) {
              fnHandler("No CSRF token delivered");
            });
          } else {
            // drop excess parameters; Note: try/catch already done by read()!
            fnSuccess();
            oTokenData.successHandlers.forEach(function (fnHandler) {
              fnHandler();
            });
          }
          oTokenData.successHandlers = [];
          oTokenData.errorHandlers = [];
          // TODO clarify if should be done in setCsrfToken (called by wrapper.read) (interference
          // with GET?)
          oTokenData.fetchingInProgress = false;
        }, function () {
          oTokenData.fetchingInProgress = false;
          fnFailure.apply(null, arguments);
        });
      } else {
        // token fetching already in progress by other instance, only register handlers
        oTokenData.successHandlers.push(fnSuccess);
        oTokenData.errorHandlers.push(fnFailure);
      }
    };

    /**
     * Determines the new value of the CSRF token. Use this function to synchronize the CSRF token
     * across multiple instances of this facade in case their first read requests run in parallel.
     * Retrieve the token from a service in the success handler of its read request and distribute
     * it to all other services; do so for each service. Note that the last success handler of all
     * first read requests run in parallel determines the token to be used for modifications.
     * <p>
     * If debugging HTTP traffic, watch out for <code>x-csrf-token</code> headers and
     * <code>sap-XSRF_*</code> cookies.
     *
     * @param {string} [sNewCsrfToken=""]
     *   the new value of the CSRF token, which may be <code>null</code> or <code>undefined</code>
     * @public
     * @since 1.7.0
     * @see #getCsrfToken
     * @see #refreshCsrfToken
     */
    this.setCsrfToken = function (sNewCsrfToken) {
      var oTokenData;
      // sNewCsrfToken must be a string OR undefined
      if (sNewCsrfToken && typeof sNewCsrfToken !== "string") {
        throw new sap.ui2.srvc.Error("Invalid CSRF token: " + sNewCsrfToken,
          "sap.ui2.srvc.ODataService");
      }
      oTokenData = mCsrfTokens.get(sBaseUrl);
      oTokenData.token = sNewCsrfToken;
    };

    /**
     * Sets the default error handler for this facade.
     *
     * @param {function (string, [object])} fnNewDefaultFailure
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @public
     * @since 1.2.0
     */
    this.setDefaultErrorHandler = function (fnNewDefaultFailure) {
      if (fnNewDefaultFailure && typeof fnNewDefaultFailure !== "function") {
        throw new sap.ui2.srvc.Error("Error callback is not a function",
          "sap.ui2.srvc.ODataService");
      }
      fnDefaultFailure = fnNewDefaultFailure || nop;
    };

    // cf. "@borrows sap.ui2.srvc.ODataWrapper#submitBatchQueue as this.submitBatchQueue"
    this.submitBatchQueue = function () {
      oODataWrapper.submitBatchQueue.apply(oODataWrapper, arguments);
    };

    /**
     * Returns this facade's string representation.
     *
     * @param {boolean} [bVerbose=false]
     *   flag whether to show all properties
     * @returns {string}
     *   this facade's string representation
     * @since 1.2.0
     */
    this.toString = function (bVerbose) {
      var aResult = ['sap.ui2.srvc.ODataService({'];
      if (bVerbose) {
        aResult.push('csrfToken:"', this.getCsrfToken(), '"');
        aResult.push(',oODataWrapper:', oODataWrapper.toString(true));
      }
      aResult.push('})');
      return aResult.join('');
    };

    // constructor code -------------------------------------------------------
    if (!sap.ui2.srvc.Error) { // not needed anymore as error is part of utils
      fnRequire("sap.ui2.srvc.error");
    }
    if (!oODataWrapper) {
      throw new sap.ui2.srvc.Error("Missing OData wrapper", "sap.ui2.srvc.ODataService");
    }

    sBaseUrl = oODataWrapper.getBaseUrl();
    if (!mCsrfTokens.get(sBaseUrl)) {
      mCsrfTokens.put(sBaseUrl, {
        //token: undefined,
        fetchingInProgress: false,
        successHandlers: [],
        errorHandlers: []
      });
    }

    this.setDefaultErrorHandler(fnDefaultFailure);
  };

/// @end

  /**
   * for test purposes only
   */
  sap.ui2.srvc.ODataService.resetSharedCsrfTokens = function () {
    mCsrfTokens = new sap.ui2.srvc.Map();
  };
}());
