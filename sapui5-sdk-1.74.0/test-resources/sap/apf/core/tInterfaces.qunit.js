jQuery.sap.require('sap.apf.core.instance');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper/');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfMessageHandler');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfApfApi');
jQuery.sap.require('sap.apf.api');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfResourcePathHandler');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfConfigurationFactory');
jQuery.sap.require('sap.apf.testhelper.doubles.coreApi');
jQuery.sap.require('sap.m.App');
jQuery.sap.require('sap.apf.utils.startParameter');
(function() {
	'use strict';

	function commonSetupInterfaces(assert, oContext) {
		oContext.getInject = function(fnClassName) {
			var oMessageHandler = new sap.apf.core.MessageHandler();
			var oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
				instances : {
					messageHandler: oMessageHandler,
					startParameter : new sap.apf.utils.StartParameter()
				}, 
				functions : {
					isUsingCloudFoundryProxy : function() { return false; }
				}
			});
			oCoreApi.getUriGenerator = function() {
				return sap.apf.core.utils.uriGenerator;
			};
			return {
				instances : {
					messageHandler : oMessageHandler,
					coreApi : oCoreApi
				},
				functions : {
					isUsingCloudFoundryProxy : function() { return false; }
				}
			};
		};
		oContext.compareWithInterface = function(Class, Interface) {
			var oInject = this.getInject(Class);
			var oClass = new Class(oInject);
			var oIf = new Interface();
			this.compare(oClass, oIf);
		};
		oContext.compare = function(oClass, oIf) {
			var oClassProps = Object.getOwnPropertyNames(oClass).sort();
			var oIfProps = Object.getOwnPropertyNames(oIf).sort();
			assert.deepEqual(oClassProps, oIfProps);
		};
	}
	QUnit.module('Interfaces', {
		beforeEach : function(assert) {
			commonSetupInterfaces(assert, this);
		}
	});
	QUnit.test('Message Handler Interface has same public methods as the corresponding class', function(assert) {
		var oMessageHandler = new sap.apf.core.MessageHandler();
		var oIfMessageHandler = new sap.apf.testhelper.interfaces.IfMessageHandler();
		var oMessageHandlerProps = Object.getOwnPropertyNames(oMessageHandler).sort();
		var oIfMessageHandlerProps = Object.getOwnPropertyNames(oIfMessageHandler).sort();
		assert.deepEqual(oMessageHandlerProps, oIfMessageHandlerProps);
	});
	QUnit.test('Resource Path Handler Interface has same public methods as the corresponding class', function(assert) {
		this.compareWithInterface(sap.apf.core.ResourcePathHandler, sap.apf.testhelper.interfaces.IfResourcePathHandler);
	});
	QUnit.test('Configuration Factory Interface has same public methods as the corresponding class', function(assert) {
		this.compareWithInterface(sap.apf.core.ConfigurationFactory, sap.apf.testhelper.interfaces.IfConfigurationFactory);
	});
	QUnit.module('Apf and Core Api interfaces', {
		beforeEach : function(assert) {
			commonSetupInterfaces(assert, this);
		}
	});
	QUnit.test('Core Api Interface has same public methods as the corresponding class', function(assert) {
		var oMessageHandler = new sap.apf.core.MessageHandler();
		var oCoreApi = new sap.apf.core.Instance({
			instances: {
				messageHandler : oMessageHandler,
				startParameter : new sap.apf.utils.StartParameter()
			},
			functions : {
				isUsingCloudFoundryProxy : function() { return false; }
			}
		});
		var oIfCore = new sap.apf.testhelper.interfaces.IfCoreApi();
		this.oApi = new sap.apf.Api(null);
		oCoreApi.createRepresentation = null;
		oIfCore.createRepresentation = null;
		this.compare(oCoreApi, oIfCore);
	});
	QUnit.test('Apf Api has same public methods as the corresponding (test) Interface class', function(assert) {
		var oMessageHandler = new sap.apf.core.MessageHandler();
		this.oCoreApi = new sap.apf.core.Instance({
			instances: {
				messageHandler : oMessageHandler,
				startParameter : new sap.apf.utils.StartParameter()
			},
			functions : {
				isUsingCloudFoundryProxy : function() { return false; }
			},
			corePromise : new jQuery.Deferred()
		});
		this.oIfCore = new sap.apf.testhelper.interfaces.IfCoreApi();
		var oApi = new sap.apf.Api(null); // it is mandatory that API is created, otherwise createRepresentations is missing on coreApi!!!
		var oIfApi = new sap.apf.testhelper.interfaces.IfApfApi();
		oApi.constants = null; // patching deprecated constants away, so that the test runs green on relevant members
		oIfApi.constants = null;
		this.compare(oApi, oIfApi);
	});
}());
