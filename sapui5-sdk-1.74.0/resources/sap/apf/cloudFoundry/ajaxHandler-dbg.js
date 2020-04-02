sap.ui.define([], function(){
	'use strict';

	/**
	 * this ajax wrapper takes care of token handling on ajax requestsfor SAP CloudFoundry. It automatically fetches 
	 * the xsrf token and sets the proper request headers. Assumption is, that there is no parallel put / post / delete to the get
	 * or a put / post / delete operation before the get. This holds currently for the runtime, because the analytical configuration
	 * is fetched before access to analysis paths takes place. Also in the modeler the application list is retrieved as first action.
	 * @constructor
	 * @name sap.apf.cloudFoundry.AjaxHandler
	 * @since SAP UI5 1.54.0.
	 *
	 * @param {sap.apf.core.ajax} inject.functions.coreAjax the core ajax, to whom the ajax call is delegated
	 * @param {sap.apf.core.MessageHandler} inject.instances.messageHandler the message handler
	 */
	var AjaxHandler = function(inject) {
		var coreAjax = inject.functions.coreAjax;
		var messageHandler = inject.instances.messageHandler;
		var xsrfToken;

		/**
		 * the ajax call
		 * @param {object} settings are equal to the ajax settings
		 */
		this.send = function(settings) {

			if (settings.type === "POST" || settings.type === "PUT" || settings.type === "DELETE" ||
				settings.method === "POST" || settings.method === "PUT" || settings.method === "DELETE") {

				settings.headers = settings.headers || {};
				settings.headers["X-CSRF-Token"] = xsrfToken;
				if (settings.data && !settings.headers["Content-Type"]) {
					settings.headers["Content-Type"] = "application/json;charset=utf-8";
				}
				coreAjax(settings);
			} else if (xsrfToken === undefined) {
				var originalSuccess = settings.success;
				var originalError = settings.error;
				settings.beforeSend = function(xhr) {
					xhr.setRequestHeader("x-csrf-token", "Fetch");
				};
				settings.success = function(oData, sStatus, oXMLHttpRequest){
					xsrfToken =  oXMLHttpRequest.getResponseHeader("x-csrf-token");
					originalSuccess(oData, sStatus, oXMLHttpRequest);
				};
				settings.error = function(jqXHR, textStatus, errorThrown) {
					//same handling as in session handler!
					xsrfToken = "";
					var messageObject = messageHandler.createMessageObject({code : 5105});
					messageHandler.putMessage(messageObject);
					originalError(jqXHR, textStatus, errorThrown);
				};
				coreAjax(settings);
			} else {
				coreAjax(settings);
			}
		};
	};

	/* BEGIN_COMPATIBILITY */
	sap.apf.cloudFoundry.AjaxHandler = AjaxHandler;
	/* END_COMPATIBILITY */
	return AjaxHandler;
}, true);