/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
sap.ui.define([], function() {
	'use strict';

	var ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch = function (oConfig) {
		var sUrl = oConfig.url;
		var deferred;
		function determineHrefPrefixBeforeTestResources() {
			var sHref = jQuery(location).attr('href');
			sHref = sHref.replace(location.protocol + "//" + location.host, "");
			return sHref.slice(0, sHref.indexOf("test-resources"));
		}
		function replacePrefix(text){
			var prefix = determineHrefPrefixBeforeTestResources();
			if (!(prefix.includes('/context.htm') || prefix.includes('/debug.htm'))){
				return text.replace(/\/apf-test\//g, prefix);
			}
			// KARMA patch
			return text.replace(/\/apf-test\/test-resources\//g, "/base/apf-lib/src/test/uilib/");
		}

		if (sUrl.search('/apf-test/test-resources') > -1) {
			sUrl = replacePrefix(sUrl);
		}
		oConfig.url = sUrl;

		if (oConfig.success) {
			var fnOriginalSuccess = oConfig.success;
			oConfig.success = function(oData, sStatus, oJqXHR) {
				if (oData && oData.applicationConfiguration) {
					var sResponse = JSON.stringify(oData);
					var prefix = determineHrefPrefixBeforeTestResources();
					sResponse = sResponse.replace(/\/apf-test\//g, prefix);
					oData = JSON.parse(sResponse);
				}
				fnOriginalSuccess(oData, sStatus, oJqXHR);
			};
			return jQuery.ajax(oConfig);
		}
		deferred = new jQuery.Deferred();
		jQuery.ajax(oConfig).done(function(oData, sStatus, oJqXHR){
				if (oData && oData.applicationConfiguration) {
					var sResponse = JSON.stringify(oData);
					// var prefix = determineHrefPrefixBeforeTestResources();
					sResponse = replacePrefix(sResponse); // sResponse.replace(/\/apf-test\//g, prefix);
					oData = JSON.parse(sResponse);
				}
				deferred.resolve(oData, sStatus, oJqXHR);
		});
		return deferred.promise();
	};

	/* BEGIN COMPABILITY */
	sap.apf.testhelper.doubles.ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch = ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch;
	/* END COMPAbILITY */

	return ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch;

}, true /* EXPORT TO GLOBAL */);
