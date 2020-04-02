sap.ui.define([
	'sap/apf/base/Component'
	], function(BaseComponent) {
	'use strict';
	/*BEGIN_COMPATIBILITY*/
	BaseComponent = BaseComponent || sap.apf.base.Component;
	/*END_COMPATIBILITY*/
	var inject = {
		constructors: {
			UiInstance: function(){},
			CoreInstance: function(){
				this.getReducedCombinedContext = function(){};
				this.getFunctionCreateRequest = function(){};
				this.getCumulativeFilterUpToActiveStep = function(){};
				this.getActiveStep = function(){};
				this.getStartParameterFacade = function(){
					return {
						getXappStateId: function(){},
						isFilterReductionActive: false
					};
				};
				this.getMetadataFacade = function(){
					return {
						getAllParameterEntitySetKeyProperties: ""
					};
				};
				this.getNavigationTargets = function(){};
				this.destroy = function(){};
			},
			StartFilterHandler: function(){
				this.setRestrictionByProperty = function(){};
				this.getRestrictionByProperty = function(){};
			},
			FilterIdHandler: function(){},
			SerializationMediator: function(){},
			NavigationHandler: function(){},
			ExternalContext: function(){}
		},
		probe: function(){}
	};

	BaseComponent.extend("sap.apf.testhelper.multi.Component", {
		metadata : {
			"name" : "sap.apf.testhelper.multi.Component",
			"manifest": {}
		},
		init : function() {
			sap.apf.base.Component.prototype.init.apply(this, arguments);
		},
		createContent : function() {
			sap.apf.base.Component.prototype.init.apply(this, arguments);
		},
		getInjections : function() {
			return inject;
		}
	});
	var componentCounter = 1;
	function createComponent(testEnv){
		var sId = ("MultiComp") + componentCounter++;

		var oComponent = new sap.apf.testhelper.multi.Component({
			id : sId,
			componentData : {}
		});
		return {
			id: sId,
			oComponent: oComponent
		};
	}

	QUnit.module('Given 2 instances of sap.apf.base.Component', {
		beforeEach: function(assert) {
			this.spy = {};
			this.spy.CoreInstance = sinon.spy(inject.constructors, "CoreInstance");
			this.spy.UiInstance = sinon.spy(inject.constructors, "UiInstance");
			this.spy.NavigationHandler = sinon.spy(inject.constructors, "NavigationHandler");
			this.comp1 = createComponent(this);
			this.comp2 = createComponent(this);
		},
		afterEach: function(assert){
			this.comp1.oComponent.destroy();
			this.comp2.oComponent.destroy();
		}
	});
	QUnit.test('When creating the components', function(assert){
		assert.strictEqual(this.spy.CoreInstance.callCount, 2, "Then CoreInstance constructor is called twice");
		assert.strictEqual(this.spy.UiInstance.callCount, 2, "Then UiInstance constructor is called twice");
		assert.strictEqual(this.spy.NavigationHandler.callCount, 2, "Then NavigationHandler constructor is called twice");
		assert.notStrictEqual(this.comp1.oComponent.getApi(), this.comp2.oComponent.getApi(), "Then both api instances are not equal")
	});
});
