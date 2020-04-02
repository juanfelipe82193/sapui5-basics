/**
 * tests for the sap.suite.ui.generic.template.extensionAPI.ReuseComponentSupport
 */

sap.ui.define(["testUtils/sinonEnhanced", "sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel",
	"sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport", "sap/suite/ui/generic/template/lib/reuseComponentHelper"
], function(sinon, UIComponent, JSONModel, ReuseComponentSupport, reuseComponentHelper) {
	"use strict";

	
	var oSandbox;
	var oTestComponent;
	var oMetadata = { getName: function(){ return "myName"; } };
	var oBindingContext;
	var oModel = {};
	var oExtensionAPI = {};
	
	function fnGeneralStartup(){
	    	oSandbox = sinon.sandbox.create();
	    	oTestComponent = sinon.createStubInstance(UIComponent);
			oTestComponent.getMetadata.returns(oMetadata);		
	}
	
	function fnGeneralTeardown(){
		oSandbox.restore();		
	}
	
	module("ReusableComponentSupport", {
	    setup: fnGeneralStartup,
	    teardown: fnGeneralTeardown
	});
	
	QUnit.test("Test that ReusableComponentSupport.mixInto can be called", function(assert) {
		ReuseComponentSupport.mixInto(oTestComponent, "");
		assert.ok(!oTestComponent.attachEvent.called, "No callbacks must have been registered");
		assert.ok(!oTestComponent.setModel.called, "No model must have been set");
	});
	
	
	function setBindingContext(sBindingPath){
		oBindingContext = { 
			getPath: function() { return sBindingPath; }
		};
		oTestComponent.getBindingContext.returns(oBindingContext);
	}
	
	function stubReuseComponentHelper(){
	    oSandbox.stub(reuseComponentHelper, "embeddedComponentMixInto", function(oComponent, oReuseComponentProxy){
	    	if (oTestComponent === oComponent){
	    		oReuseComponentProxy.fnExtensionAPIAvailable(oExtensionAPI);                         
	    	}	
	    });		
	}
	
	module("ReusableComponentSupport stStart and stRefresh", {
	    setup: function(){
	    	fnGeneralStartup();
			oTestComponent.oContainer = {};
			oTestComponent.getModel.returns(oModel);
	    	setBindingContext("First");
	    	stubReuseComponentHelper();
	    },
	    teardown: fnGeneralTeardown
	});
	
	QUnit.test("Test a ReusableComponentSupport with stStart but without stRefresh", function(assert) {
		var done = assert.async();
		var oStStartSpy = oSandbox.spy(oTestComponent, "stStart");
		var oReadyPromise = ReuseComponentSupport.mixInto(oTestComponent);
		oReadyPromise.then(function(){
			assert.ok(oTestComponent.attachEvent.calledOnce, "Callback must have been registered");
			var aRegistrationParams = oTestComponent.attachEvent.args[0];
			assert.strictEqual(aRegistrationParams.length, 2, "2 parameters must have been passed to the registration");
			assert.strictEqual(aRegistrationParams[0], "modelContextChange", "Callbacks must be registered at context change event");
			var fnCallBack = aRegistrationParams[1];
			fnCallBack();
			assert.ok(oStStartSpy.calledOnce, "stStart must have been called");
			assert.ok(oStStartSpy.calledOn(oTestComponent), "this context must have been set correctly for stStart");
			assert.ok(oStStartSpy.calledWithExactly(oModel, oBindingContext, oExtensionAPI), "stStart must have been called with correct parameters");
			setBindingContext("Second");
			fnCallBack();
			assert.ok(oStStartSpy.calledOnce, "stStart must not have been called again");
			done();
		});
	});
	
	QUnit.test("Test a ReusableComponentSupport with stRefresh but without stStart", function(assert) {
		var done = assert.async();
		var oStRefreshSpy = oSandbox.spy(oTestComponent, "stRefresh");
		var oReadyPromise = ReuseComponentSupport.mixInto(oTestComponent);
		oReadyPromise.then(function(){
			assert.ok(oTestComponent.attachEvent.calledOnce, "Callback must have been registered");
			var aRegistrationParams = oTestComponent.attachEvent.args[0];
			assert.strictEqual(aRegistrationParams.length, 2, "2 parameters must have been passed to the registration");
			assert.strictEqual(aRegistrationParams[0], "modelContextChange", "Callbacks must be registered at context change event");
			oTestComponent.onBeforeRendering();
			var fnCallBack = aRegistrationParams[1];
			fnCallBack();
			assert.ok(oStRefreshSpy.calledOnce, "stRefresh must have been called");
			assert.ok(oStRefreshSpy.calledWithExactly(oModel, oBindingContext, oExtensionAPI), "stRefresh must have been called with correct parameters");
			setBindingContext("Second");
			fnCallBack();
			assert.ok(oStRefreshSpy.calledTwice, "stRefresh must have been called a second time");
			assert.ok(oStRefreshSpy.alwaysCalledOn(oTestComponent), "this context must have been set correctly for stRefresh");
			assert.ok(oStRefreshSpy.secondCall.calledWithExactly(oModel, oBindingContext, oExtensionAPI), "stRefresh must have been called with correct parameters the second time");
			fnCallBack();
			assert.ok(oStRefreshSpy.calledTwice, "stRefresh must not have been called a third time, since the binding context did not change");
			done();
		});
	});
	
	QUnit.test("Test a ReusableComponentSupport with stRefresh and stStart", function(assert) {
		var done = assert.async();
		var oStRefreshSpy = oSandbox.spy(oTestComponent, "stRefresh");
		var oStStartSpy = oSandbox.spy(oTestComponent, "stStart");
		var oReadyPromise = ReuseComponentSupport.mixInto(oTestComponent);
		oReadyPromise.then(function(){
			assert.ok(oTestComponent.attachEvent.calledOnce, "Callback must have been registered");
			var aRegistrationParams = oTestComponent.attachEvent.args[0];
			assert.strictEqual(aRegistrationParams.length, 2, "2 parameters must have been passed to the registration");
			assert.strictEqual(aRegistrationParams[0], "modelContextChange", "Callbacks must be registered at context change event");
			oTestComponent.onBeforeRendering();
			var fnCallBack = aRegistrationParams[1];
			fnCallBack();
			assert.ok(!oStRefreshSpy.called, "stRefresh must not have been called at the first time");
			assert.ok(oStStartSpy.calledOnce, "stStart must have been called");
			assert.ok(oStStartSpy.calledWithExactly(oModel, oBindingContext, oExtensionAPI), "stStart must have been called with correct parameters");
			assert.ok(oStStartSpy.calledOn(oTestComponent), "this context must have been set correctly for stStart");
			setBindingContext("Second");
			fnCallBack();
			assert.ok(oStStartSpy.calledOnce, "stStart must have not been called again");
			assert.ok(oStRefreshSpy.calledOnce, "stRefresh must have been called at the second time");
			assert.ok(oStRefreshSpy.calledWithExactly(oModel, oBindingContext, oExtensionAPI), "stRefresh must have been called with correct parameters");
			fnCallBack();
			assert.ok(oStRefreshSpy.calledOnce, "stRefresh must not have been called again, since the binding context did not change");
			assert.ok(oStStartSpy.calledOnce, "stStart must have not been called again");
			setBindingContext("First");
			fnCallBack();
			assert.ok(oStRefreshSpy.calledTwice, "stRefresh must not have called again, since the binding context has changed");
			assert.ok(oStStartSpy.calledOnce, "stStart must have not been called again");
			assert.ok(oStRefreshSpy.alwaysCalledOn(oTestComponent), "this context must have been set correctly for stRefresh");
			assert.ok(oStRefreshSpy.secondCall.calledWithExactly(oModel, oBindingContext, oExtensionAPI), "stRefresh must have been called with correct parameters the second time");
			done();
		});			
	});
	
	
	module("ReusableComponentSupport model support", {
	    setup: function(){
	    	fnGeneralStartup();
	    	stubReuseComponentHelper();
	    },
	    teardown: fnGeneralTeardown
	});
	
	QUnit.test("Test a ReusableComponentSupport with component model", function(assert) {
		var done = assert.async();
		var oProperties = { 
			xyz: {},
			abc: {}
		};
		var sProperty;
		oSandbox.stub(oMetadata, "getProperties", function(){ return oProperties; });
		var i = 0;
		for (sProperty in oProperties){
			oTestComponent.getProperty.onCall(i).returns("!" + sProperty + "§");
			i++;
		}	
		var sModelName = "$$%%&&";
		var sSetPropertySpy = oTestComponent.setProperty;
		var oReadyPromise = ReuseComponentSupport.mixInto(oTestComponent, sModelName);
		oReadyPromise.then(function(){
			assert.ok(oTestComponent.setModel.calledOnce, "a model must have been set");
			var aSetModelParams = oTestComponent.setModel.args[0];
			assert.strictEqual(aSetModelParams[1], sModelName, "Model must have been set with given name");
			var oComponentModel = aSetModelParams[0];
			assert.ok(oComponentModel instanceof JSONModel, "A JSON model must have been created");
			for (sProperty in oProperties){
				var sValue = oComponentModel.getProperty("/" + sProperty);
				assert.strictEqual(sValue, "!" + sProperty + "§", "Property " + sProperty + " must have been initialized correctly");
			}
			assert.strictEqual(oTestComponent.getComponentModel(), oComponentModel, "Method getComponentModel must return the component model");
			var oPropValue = {};
			oTestComponent.setProperty("xyz", oPropValue);
			assert.strictEqual(oComponentModel.getProperty("/xyz"), oPropValue, "Setting property must be forwarded to component model");
			assert.ok(sSetPropertySpy.calledOnce, "setProperty on component must have been called");
			assert.ok(sSetPropertySpy.calledWithExactly("xyz", oPropValue), "setProperty on component must have been called with the correct parameters");
			done();
		});		
	});
});