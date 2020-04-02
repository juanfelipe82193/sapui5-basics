sap.ui.define([], function() {
	'use strict';

	var module = {
		/**
		 * @description tests, whether the array aContained is included in aData
		 * @param {Object[]} aContained
		 * @param {Object[]} aData
		 * @returns {boolean} true if each member of aContained is member of aData.
		 */
		isContainedInArray: function(aContained, aData) {
			function existsAMatch(oRecord, aData) {
				return aData.filter(function(oDataItem){
					return isObjectMatch(oRecord, oDataItem);
				}).length > 0;
			}
			function isObjectMatch(oRecord, oData){
				return Object.keys(oRecord).every(function(key){
					return oRecord[key] === oData[key];
				});
			}
			return aContained.every(function(record){
				return existsAMatch(record, aData);
			});
		},
		/**
		 * Adjust url roots with "/apf-test/" with roots of current deployment project, e.g. /qunit-testrunner/, /sapui5-sdk-dist/ etc.
		 * As an effect, tests with ajax access to local resources run in eclipse, on jenkins, karma or in web ide.
		 * @param {function} fnOriginalAjax the ajax function, where the URLs have to be adjusted.
		 * @returns undefined
		 */
		adjustResourcePaths: function(fnOriginalAjax) {
			jQuery.ajax = function(oConfig) {
				var sUrl = oConfig.url;

				oConfig.url = module.adjustUrl(sUrl);
				return fnOriginalAjax(oConfig);
			};
		},
		/**
		 * adjust roots with /apf-test/ to different deployment projects
		 */
		adjustUrl: function(sUrl) {
			if (sUrl.search('/apf-test/test-resources') > -1) {
				var sHref = jQuery(location).attr('href');
				sHref = sHref.replace(location.protocol + "//" + location.host, "");
				sHref = sHref.slice(0, sHref.indexOf("test-resources"));
				if (sHref.indexOf("/debug.htm") === 0 || sHref.indexOf("/context.htm") === 0) { // Karma case, debug or run
					sUrl = sUrl.replace(/\/apf-test\/test-resources/g, "base/test/uilib");
				} else if (sHref.indexOf("hc_orionpath") > -1) {
					sUrl = sUrl.replace(/\/apf-test\/test-resources/g, "/apf-lib/src/test/uilib");
				} else {
					sUrl = sUrl.replace(/\/apf-test\//g, sHref);
				}
			}
			return sUrl;
		},
		/**
		 * Returns the path to the test folder, depending on the server like Tomcat or Karma.
		 * The path ends without slash: "/".
		 * @returns {*}
		 */
		determineTestResourcePath: function() {
			var sApfLocation = jQuery.sap.getModulePath("sap.apf") + '/';
			var sHref = jQuery(location).attr('href');
			var testRessourcePath = "test-resources/sap/apf";
			var index = sApfLocation.indexOf("/base");
			if (index > -1) { // Karma
				return "/base/test/uilib/sap/apf";
			}
			index = sHref.indexOf("hc_orionpath");
			if (index > -1) {
				return "/apf-lib/src/test/uilib/sap/apf";
			}
			// HTML QUnit based
			//extract deployment project and use it as path to test resources
			sHref = sHref.replace(location.protocol + "//" + location.host, "");
			sHref = sHref.slice(0, sHref.indexOf("test-resources/sap/apf"));
			return sHref + testRessourcePath;
		},
		/**
		 * Replaces "/sap.apf.test/" in applicationConfiguration.json by current deployment project, e.g. /qunit-testrunner/, /sapui5-sdk-dist/ etc.
		 * @returns undefined
		 */
		replacePathsInAplicationConfiguration: function(fnOriginalAjax) {
			jQuery.ajax = function(oConfig) {
				if (!oConfig.success) {
					return fnOriginalAjax(oConfig);
				}
				var fnOriginalSuccess = oConfig.success;
				oConfig.success = function(oData, sStatus, oJqXHR) {
					if (oData && oData.applicationConfiguration) {
						var sResponse = JSON.stringify(oData);
						var sHref = jQuery(location).attr('href');
						sHref = sHref.replace(location.protocol + "//" + location.host, "");
						sHref = sHref.slice(0, sHref.indexOf("test-resources"));
						if (sHref.indexOf("/debug.htm") === 0 || sHref.indexOf("/context.htm") === 0) { // Karma case, debug or run
							sResponse = sResponse.replace(/\/apf-test\/test-resources/g, "base/test/uilib");
						} else if (sHref.indexOf("hc_orionpath") > -1) {
							sResponse = sResponse.replace(/\/apf-test\/test-resources/g, "/apf-lib/src/test/uilib");
						} else {
							sResponse = sResponse.replace(/\/apf-test\//g, sHref);
						}
						oData = JSON.parse(sResponse);
					}
					fnOriginalSuccess(oData, sStatus, oJqXHR);
				};
				return fnOriginalAjax(oConfig);
			};
		},
		/**
		 * resolves the test server to the name of required application configuration so that paths can be correct
		 * @returns {string}
		 */
		determineApplicationConfigName: function() {
			var originLocation = location.protocol + "//" + location.host;
			if (originLocation.toString().search("localhost") > -1) {
				/* KARMA ports */
				if (originLocation.toString().search(/(localhost:9876|localhost:9877|localhost:9878|localhost:9879)/i) > -1) {
					return "applicationConfigurationKarma.json";
				}
				// Tomcat Jetty et al
				return "applicationConfiguration.json";
			}
			// Server (HANA) test
			return "applicationConfiguration.json";
		},
		/**
		 * add predefined url parameters to the current html page.
		 */
		injectURLParameters: function(oKeyValuePairs) {
			var currentParams = document.location.search.substr(1).split('&');
			if (currentParams[0] === "") {
				currentParams = [];
			}
			var paramsChanged = false;
			var aKeyValue, j;
			function setParameter(key, value) {
				key = encodeURI(key);
				value = encodeURI(value);
				for (j = 0; j < currentParams.length; ++j) {
					aKeyValue = currentParams[j].split('=');
					if (aKeyValue[0] === key) {
						if (aKeyValue[1] === value) {
							return;
						}
						aKeyValue[1] = value;
						currentParams[j] = aKeyValue.join('=');
						paramsChanged = true;
						return;
					}
				}
				currentParams.push([key, value].join('='));
				paramsChanged = true;
			}
			for (var prop in oKeyValuePairs) {
				if ( oKeyValuePairs.hasOwnProperty(prop)){
					setParameter(prop, oKeyValuePairs[prop]);
				}
			}
			if (paramsChanged) {
				if (window.history.pushState) { // html5 work-around
					window.history.pushState(null, null, "?" + currentParams.join('&'));
				} else {
					document.location.search = currentParams.join('&');
				}
			}
		},
		startMicroSeconds: null,
		generateGuidForTesting: function() {
			if (!module.startMicroSeconds) {
				module.startMicroSeconds = new Date().valueOf();
			} else {
				module.startMicroSeconds++;
			}
			return "FFFFFFFFFFFFFFFFFFF" + module.startMicroSeconds;
		}
	};

	/*BEGIN_COMPATIBILITY*/
	jQuery.sap.declare("sap.apf.testhelper.helper");
	Object.keys(module).forEach(function(key) {
		sap.apf.testhelper[key] = module[key];
	});
	/*END_COMPATIBILITY*/

	return module;
});
