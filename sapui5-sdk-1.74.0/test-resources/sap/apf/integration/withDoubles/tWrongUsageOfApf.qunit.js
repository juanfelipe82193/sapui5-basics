/*global sap, jQuery, sinon, OData, location */

jQuery.sap.declare('sap.apf.integration.withDoubles.tWrongUsageOfApf');

(function () {
	'use strict';
	jQuery.sap.require("sap.ui.thirdparty.qunit");
	jQuery.sap.require("sap.ui.thirdparty.sinon");
	jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
	jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
	jQuery.sap.require('sap.apf.testhelper.odata.sampleServiceData');
	jQuery.sap.require('sap.apf.testhelper.interfaces.IfResourcePathHandler');
	jQuery.sap.require('sap.apf.testhelper.odata.savedPaths');
	jQuery.sap.require('sap.apf.testhelper.doubles.UiInstance');
	jQuery.sap.require('sap.apf.testhelper.helper');
	jQuery.sap.require('sap.apf.testhelper.createComponentAsPromise');
	jQuery.sap.require('sap.apf.testhelper.doubles.request');
	jQuery.sap.require('sap.apf.testhelper.doubles.Representation');
	jQuery.sap.require('sap.apf.testhelper.doubles.metadata');
	jQuery.sap.require('sap.apf.testhelper.doubles.resourcePathHandler');

	jQuery.sap.require('sap.apf.Component');

	sap.apf.testhelper.injectURLParameters({
		"error-handling": "true"
	});

	QUnit.module("Empty application configuration", {
		afterEach: function () {
			this.oCompContainer && this.oCompContainer.destroy();
		}
	});

	QUnit.test("WHEN empty analytical configuration file is loaded", function (assert) {

		var done = assert.async();

		function ajaxWrapper(oParam1, oParam2) {
			var deferred = jQuery.Deferred();
			if (oParam1 && oParam1.type !== 'HEAD' && oParam1.url.indexOf("sampleConfiguration.json") > 0) {
				jQuery.ajax(oParam1, oParam2).done(function(arg1, arg2, arg3){
					deferred.resolve({}, arg2, arg3);
				});
				return deferred.promise();
			} else if (oParam1.success) {
				var fnOriginalSuccess = oParam1.success;
				oParam1.success = function (oData, sStatus, oJqXHR) {
					if (oData && oData.applicationConfiguration) {
						var sResponse = JSON.stringify(oData);
						var sHref = jQuery(location).attr('href');
						sHref = sHref.replace(location.protocol + "//" + location.host, "");
						sHref = sHref.slice(0, sHref.indexOf("test-resources"));
						sResponse = sResponse.replace(/\/apf-test\//g, sHref);
						oData = JSON.parse(sResponse);
					}
					fnOriginalSuccess(oData, sStatus, oJqXHR);
				};
				return jQuery.ajax(oParam1, oParam2);
			}
			jQuery.ajax(oParam1, oParam2).done(function(oData, sStatus, oJqXHR){
				if (oData && oData.applicationConfiguration) {
					var sResponse = JSON.stringify(oData);
					var sHref = jQuery(location).attr('href');
					sHref = sHref.replace(location.protocol + "//" + location.host, "");
					sHref = sHref.slice(0, sHref.indexOf("test-resources"));
					sResponse = sResponse.replace(/\/apf-test\//g, sHref);
					oData = JSON.parse(sResponse);
				}
				deferred.resolve(oData, sStatus, oJqXHR);
			});
			return deferred.promise();
		}

		var inject = {
				constructors : {
					SessionHandler: sap.apf.core.SessionHandler,
					UiInstance: sap.apf.testhelper.doubles.UiInstance
				},
				functions : {
					ajax: ajaxWrapper,
					messageCallbackForStartup: function(messageObject) {
						assert.equal(messageObject.getPrevious().getCode(), "5102", "THEN error message 5102 as expected");
						done();
					}
				}
		};
		sap.apf.testhelper.createComponentAsPromise(this, 
				{ componentId : "CompAjax1",  inject : inject, componentData : {}});
	});

	QUnit.module("Empty Application Configuration", {
		afterEach: function () {
			this.oCompContainer.destroy();
		}
	});

	QUnit.test("WHEN Empty application configuration is loaded THEN fatal message", function (assert) {
		var done = assert.async();
		function ajaxWrapperThatReturnsEmptyApplicationDefinition(oParam1, oParam2) {
			if (oParam1 && oParam1.type !== 'HEAD' && oParam1.url.indexOf("applicationConfiguration.json") > 0) {
				var deferred = jQuery.Deferred();
				jQuery.ajax(oParam1, oParam2).done(function(arg1, arg2, arg3){
					deferred.resolve({}, arg2, arg3);
				});
				return deferred.promise();
			}
			return jQuery.ajax(oParam1, oParam2);
		}
		var inject = {
				constructors : {
					SessionHandler: sap.apf.core.SessionHandler,
					UiInstance: sap.apf.testhelper.doubles.UiInstance
				},
				functions : {
					ajax: ajaxWrapperThatReturnsEmptyApplicationDefinition,
					messageCallbackForStartup: function(messageObject) {
						assert.equal(messageObject.getPrevious().getCode(), "5055", "THEN error message 5055 as expected");
						done();
					}
				}
		};
		sap.apf.testhelper.createComponentAsPromise(this, 
				{ componentId : "CompAjax1",  inject : inject, componentData : {}});
		
	});

}());
