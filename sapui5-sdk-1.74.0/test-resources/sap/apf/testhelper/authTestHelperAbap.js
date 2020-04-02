jQuery.sap.declare('sap.apf.testhelper.authTestHelperAbap');
jQuery.sap.require('sap.apf.utils.utils');
(function() {
	'use strict';
	/**
	 * @class authorization test helper for abap based gateway system
	 * @param  {function} callback this function is executed, when the new instance creation has finished.
	 * @param  {object} config configuration of services on the gateway system
	 * @param  {string} config.serviceRoot a ODATA service root of the system
	 */
	sap.apf.testhelper.AuthTestHelperAbap = function(fnDone, callback, config) {
		var xsrfToken;
		/**
		 * @description Returns the XSRF token as string
		 * @returns {String}
		 */
		this.getXsrfToken = function() {
			return sap.apf.utils.createPromise(xsrfToken);
		};
		function init() {
			jQuery.ajax({
				url : config.serviceRoot + "$metadata",
				type : "GET",
				beforeSend : function(xhr) {
					xhr.setRequestHeader("x-csrf-token", "Fetch");
				},
				username : sap.apf.internal.server.userData.abapSystem.user,
				password : sap.apf.internal.server.userData.abapSystem.password,
				async : false,
				cache : false,
				success : function(data, textStatus, XMLHttpRequest) {
					xsrfToken = XMLHttpRequest.getResponseHeader("x-csrf-token");
					if (!xsrfToken) {
						console.log("x-scrf-token not available");
						fnDone();
						throw new Error("x-scrf-token not available");
					}
					callback();
				},
				error : function(oJqXHR, sStatus, sErrorThrown) {
					console.log(sErrorThrown);
					fnDone();
					throw new Error(sErrorThrown);
				}
			});
		}
		init();
	};

}());