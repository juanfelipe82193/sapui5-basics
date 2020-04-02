(function () {
	'use strict';

	jQuery.sap.require("sap.ui.thirdparty.qunit");
	jQuery.sap.require("sap.ui.thirdparty.sinon");
	jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
	jQuery.sap.require('sap.apf.testhelper.stub.ajaxStub');
	jQuery.sap.require('sap.apf.testhelper.odata.savedPaths');
	jQuery.sap.require('sap.apf.testhelper.doubles.UiInstance');
	jQuery.sap.require('sap.apf.testhelper.helper');
	jQuery.sap.require('sap.apf.testhelper.doubles.component');
	jQuery.sap.require('sap.apf.testhelper.createComponentAsPromise');
	jQuery.sap.require('sap.apf.testhelper.doubles.Representation');
	jQuery.sap.require('sap.apf.testhelper.doubles.ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch');

	jQuery.sap.require('sap.apf.Component');
	QUnit.module("tComponent -- APF API", {
		beforeEach : function(assert) {
			var done = assert.async();
			var path = "/apf-test/test-resources/sap/apf/testhelper/config/applicationConfiguration.json";	
			var inject =  { functions : 
				{ ajax : sap.apf.testhelper.doubles.ajaxWithAdjustedResourcePathsAndApplicationConfigurationPatch }
			};
			var afterStartup = function() {
				done();
			};
			this.oComponent = sap.apf.testhelper.doubles.component.create(this, "compId", inject,  path, {}, undefined, afterStartup);
		},
		afterEach : function(assert) {
			this.oCompContainer.destroy();
		}
	});
	QUnit.test("Check putMessage() and interaction between MessageHandler, ResourcePathHandler and TextResourceHandler", function(assert) {
		var sMessageText;
		var sMessageCode;
		var fnCallback = function(oMessageObject) {
			sMessageCode = oMessageObject.getCode();
			sMessageText = oMessageObject.getMessage();
		};

		this.oComponent.getProbe().messageHandler.setMessageCallback(fnCallback);
		var oMessageObject = this.oComponent.oApi.createMessageObject({
			code : "5206",
			aParameters : [],
			oCallingObject : this
		});

		this.oComponent.oApi.putMessage(oMessageObject);
		assert.equal(sMessageCode, "5206", "Correct message code expected");
		assert.equal(sMessageText, "SQL error 268 during server request; insufficient privileges", "Correct message text expected");
	});
	QUnit.module('tComponent -- Create multiple instances', {
		beforeEach : function(assert) {
			var done = assert.async();
			this.oContext1 = {};
			this.oContext2 = {};

			sap.apf.testhelper.createComponentAsPromise(this.oContext1, 
					{ stubAjaxForResourcePaths : true, doubleUiInstance : true, componentId: "Comp1"}).done(function(){


						sap.apf.testhelper.createComponentAsPromise(this.oContext2, 
								{ stubAjaxForResourcePaths : true, doubleUiInstance : true, componentId: "Comp2"}).done(function(){
									this.oApi1 = this.oContext1.oApi;
									this.oApi2 = this.oContext2.oApi;
									done();
								}.bind(this));
					}.bind(this));
		},
		afterEach : function() {
			this.oContext1.oCompContainer.destroy();
			this.oContext2.oCompContainer.destroy();
		}
	});
	QUnit.test('Handling of multiple components', function(assert) {
		var oMessageObject = this.oApi1.createMessageObject({
			code : "5100"
		});
		assert.ok(oMessageObject, "Proper access to api function");
		assert.ok(this.oApi1 !== this.oApi2, "different references");
		var bCalled1 = false;
		var bCalled2 = false;
		var fnCallback1 = function() {
			bCalled1 = true;
		};
		var fnCallback2 = function() {
			bCalled2 = true;
		};
		var oMessageObject = this.oApi1.createMessageObject({
			code : "5001"
		});
		this.oContext1.oComponent.getProbe().messageHandler.setMessageCallback(fnCallback1);
		this.oContext1.oComponent.getProbe().messageHandler.setMessageCallback(fnCallback2);
		try {
			this.oApi1.putMessage(oMessageObject);
		} catch (oError) {
			assert.ok(true, "Exception was raised on fatal message");
		}
		assert.ok(bCalled1 !== bCalled2, "contexts are different");
		this.oContext2.oCompContainer.destroy();
		var oMessageObject1 = this.oApi1.createMessageObject({
			code : "5100"
		});
		assert.ok(oMessageObject1, "Proper access to api function of second Api");
	});
	QUnit.module("Component: Destroy", {
		beforeEach : function() {
			var sId = "Comp1";
			var oComponent;
			var fnUiInstance = sap.apf.ui.Instance;
			sap.apf.ui.Instance = sap.apf.testhelper.doubles.UiInstance;
			sap.apf.testhelper.stub.stubJQueryAjax();
			oComponent = new sap.apf.Component({
				id : sId,
				componentData : {
					startupParameters : {}
				}
			});
			jQuery.ajax.restore();
			sap.apf.ui.Instance = fnUiInstance;
			var sContId = "Comp" + sId;
			this.oCompContainer = new sap.ui.core.ComponentContainer(sContId, {
				component : oComponent
			});
			this.oCompContainer.setComponent(oComponent);
			this.oApi = oComponent.getApi();
			this.spyComponentExit = sinon.spy(oComponent, "exit");
			this.spyApiDestroy = sinon.spy(this.oApi, "destroy");
		},
		afterEach : function() {
			this.spyComponentExit.restore();
		}
	});
	QUnit.test("WHEN component container is removed", function(assert) {
		this.oCompContainer.destroy();
		assert.ok(this.spyComponentExit.calledOnce, "THEN exit is called in COMPONENT");
		assert.ok(this.spyApiDestroy.calledOnce, "THEN destroy is called in ApiT");
	});
}());