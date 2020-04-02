/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
sap.ui.define([
	'sap/apf/core/sessionHandler',
	'sap/apf/utils/utils'
], function (SessionHandler, utils) {
	'use strict';

	/* BEG COMPABILITY */
	SessionHandler = SessionHandler || sap.apf.core.SessionHandler;
	/* END COMPABILITY */

	var SessionHandlerStubbedAjax = function(oInject){
		SessionHandler.call(this, oInject); // inherit
		this.ajax = function(oSettings) {
			var oXMLHttpRequest = {
					getResponseHeader : function(sParam) {
						if (sParam === "x-sap-login-page") {
							return null;
						}
						return "dummyXsrfTokenFromSessionHandler" + utils.createPseudoGuid(32);
					}
			};
			var oXMLHttpRequestNullXsrfToken = {
					getResponseHeader : function(sParam) {
						return null;
					}
			};
			if(oSettings.url === "notAvailableServiceRoot"){
				oSettings.error({}, {}, {});
			} else if (oSettings.url === "noHeadRequestAllowed" && oSettings.type === "HEAD"){
				oSettings.error({status : 405}, {}, {});
			} else if (oSettings.url === "noRequestAllowed"){
				oSettings.error({status : 405}, {}, {});
			} else if (oSettings.url === "nullXsrfToken"){
				setTimeout(function() {
					oSettings.success({}, {}, oXMLHttpRequestNullXsrfToken);
				}, 1);
			} else {
				setTimeout(function() {
					oSettings.success({}, {}, oXMLHttpRequest);
				}, 1);
			}
		};
	};

	/* BEGIN COMPABILITY */
	sap.apf.testhelper.doubles.SessionHandlerStubbedAjax = SessionHandlerStubbedAjax;
	/* END COMPABILITY */

	return SessionHandlerStubbedAjax;
}, true /* EXPORT TO GLOBAL */);
