sap.ui.define([
	'sap/apf/utils/utils'
	], function(utils) {
	'use strict';

	/**
	 * @class A instance of this helper constructor function must be used for any server integrated tests from a developing point of view.
	 * The AuthTestHelper is complete independent to very other APF component such as UriGenerator. 
	 * This user is available in VS3 and VS6 with same password and same privileges, so that the integration test could run against these systems. 
	 * The passed callback function is execute after the authentication was successful. 
	 * In case of access is denied, an error is thrown and "QUnit.start()" is called to ensure that there are no hanging tests.
	 * Sequence:
	 * 1. Fetching an XSRF token. Which is sampled 10 times.
	 * 2. Checking the authentication state by calling the service document of WCA.
	 * 2.1 If auth. state is successful the callback function is called
	 * 2.2 If auth. state is denied the XSE login function is called. Which is sampled 10 times. 
	 * 3. If authentication was successful a valid token is fetched. Which is sampled 10 times.
	 * 4. Callback function is called.
	 * @param {function} - fnCallback
	 */
	function AuthTestHelper(fnDone, fnCallback) {
		var nAuthTryCounter = 0;
		var nTokenTryCounter = 0;
		var sXsrfToken = "";
		// public vars
		/**
		 * @description Contains 'apfDelegator'
		 * @returns {string}
		 */
		this.type = "authTestHelper";

		/**
		 * @description Returns the XSRF token as promise
		 * @returns {jQuery.Deferred.Promise} resolves with xsrfToken as string
		 */
		this.getXsrfToken = function() {
			return utils.createPromise(sXsrfToken);
		};
		// private functions
		function onInitAuthResponse(oData, sStatus, oJqXHR) {
			if (sStatus === "success" && (oData.xmlVersion !== undefined || oData.login !== undefined)) { // if no xmlVersion, then the request to service dokument has faild

				if ((sXsrfToken === "" || sXsrfToken === "unsafe") && nTokenTryCounter < 11) {
					setTimeout(fetchXcsrfToken.bind(this), 1000);
				} else if (fnCallback !== undefined && typeof fnCallback === "function") {
					fnCallback();
				}
			} else {
				console.log("Something went wrong!");
				fnDone();
				throw new Error("Something went wrong!");
			}
		}
		function initAuth() {
			jQuery.ajax({
				url : "/sap/hana/xs/formLogin/login.xscfunc",
				type : "POST",
				dataType : "json",
				headers : {
					"x-csrf-token" : sXsrfToken
				},
				data : sap.apf.internal.server.userData.xs,
				async : false,
				success : onInitAuthResponse.bind(this),
				error : function(oJqXHR, sStatus, sErrorThrown) {

					if (nAuthTryCounter < 11) {
						setTimeout(initAuth.bind(this), 1000);
					} else {
						console.log(sErrorThrown);
						fnDone();
						throw new Error(sErrorThrown);
					}
				}.bind(this)
			});
			nAuthTryCounter++;
		}
		function checkAuthState() {
			var sURL = "/sap/hba/r/apf/core/odata/apf.xsodata/";
			jQuery.ajax({
				url : sURL,
				type : "GET",
				headers : {
					"x-csrf-token" : sXsrfToken
				},
				async : false,
				success : function(oData, sStatus, oJqXHR) {
					if (sStatus === "success" && (oData.xmlVersion !== undefined || oData.login !== undefined)) { // if no xmlVersion, then the request to service dokument has faild	 
						if (fnCallback !== undefined && typeof fnCallback === "function") {
							fnCallback();
						}
					} else {
						initAuth.bind(this)();
					}
				}.bind(this),
				error : function(oJqXHR, sStatus, sErrorThrown) {
					initAuth.bind(this)();
				}.bind(this)
			});
		}
		function fetchXcsrfToken() {
			var sURL = "/sap/hana/xs/formLogin/token.xsjs";
			jQuery.ajax({
				url : sURL,
				type : "GET",
				beforeSend : function(xhr) {
					xhr.setRequestHeader("x-csrf-token", "Fetch");
				},
				async : false,
				success : function(data, textStatus, XMLHttpRequest) {
					sXsrfToken = XMLHttpRequest.getResponseHeader("x-csrf-token");
					checkAuthState.bind(this)();
				}.bind(this),
				error : function(oJqXHR, sStatus, sErrorThrown) {
					console.log(sErrorThrown);
					fnDone();
					throw new Error(sErrorThrown);
				}
			});
			nTokenTryCounter++;
		}
		fetchXcsrfToken.bind(this)();
	}

	/*BEGIN_COMPATIBILITY*/
	jQuery.sap.declare('sap.apf.testhelper.authTestHelper');
	sap.apf.testhelper.AuthTestHelper = AuthTestHelper;
	/*END_COMPATIBILITY*/
	return {
		constructor: AuthTestHelper
	};
});