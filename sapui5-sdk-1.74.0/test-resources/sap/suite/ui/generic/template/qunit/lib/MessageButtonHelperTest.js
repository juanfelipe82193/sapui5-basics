/**
 * tests for the sap.suite.ui.generic.template.lib.MessageButtonHelper
 */

sap.ui.define(["testUtils/sinonEnhanced", "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/suite/ui/generic/template/lib/MessageButtonHelper",
	"sap/suite/ui/generic/template/lib/testableHelper"
], function(sinon, JSONModel, Filter, FilterOperator, MessageButtonHelper, testableHelper) {
	"use strict";

	var oMessageButtonHelper;
	var oPrivate = {};
	var oCommonUtils = {
		getText: function(sKey, iCount){
			if (sKey !== "MESSAGE_BUTTON_TOOLTIP_P" && sKey !== "MESSAGE_BUTTON_TOOLTIP_S"){
				throw new Error("Text key " + sKey + " should not be used");
			}
			return  function(oId){
				if (oId === oPrivate){
					return {
						id: oId,
						key: sKey,
						count: iCount
					};
				}
			};
		}
	};
	var oTemplateUtils = {
		oCommonUtils: oCommonUtils
	}
	var sEntitySet = "entity" + Math.random();
	var oTemplPriv;
	var oComponent = {
		getEntitySet: function(){
			return sEntitySet;
		},
		getModel: function(sName){
			if (sName === "_templPriv"){
				return oTemplPriv;
			}
			throw new Error("Only message and _templPriv model must be accessed");
		}
	};
	var oMessageButton = {};
	var oView = {};
	var oController = {
		getOwnerComponent: function(){
			return oComponent;
		},
		getView: function(){
			return oView;
		},
		byId: function(sId){
			if (sId !== "showMessages"){
				throw new Error("Only id showMessages should be requested");
			}
			return oMessageButton;
		}
	};
	var oHost = {
		controller: oController
	};
	var oMessagePopover = {
		toggle: function(){
			throw new Error("This function must not be called in this scenario");
		},
		openBy: function(){
			throw new Error("This function must not be called in this scenario");
		},
		setGroupItems: function(){
		}
	};
	var oItemBinding = {
		getLength: sinon.stub()
	};
	var oSandbox;
	var fnChangeListener;

	function assertIsText(assert, fnText, sKey, iCount){
		var oText = fnText(oPrivate);
		assert.strictEqual(oText.id, oPrivate, "Only texts provided by getText must be used");
		assert.strictEqual(oText.key, sKey, "Correct text key must be used");
		assert.strictEqual(oText.count, iCount, "Correct count must be set");
	}

	function fnGeneralSetup(){
		oSandbox = sinon.sandbox.create();
		oCommonUtils.getDialogFragment = function(sFragment){
			delete oCommonUtils.getDialogFragment;
			return oMessagePopover;
		};
		oMessagePopover.setModel = function(){
			delete oMessagePopover.setModel;
		};
		oMessagePopover.getBinding = function(){
			delete oMessagePopover.getBinding;
			return oItemBinding;
		};
		oTemplPriv = new JSONModel({
						generic: {}
					});
		var fnSetProperty = oTemplPriv.setProperty;
		oTemplPriv.setProperty = function(sProperty, oValue){
			if (sProperty !== "/generic/messageCount" && sProperty !== "/generic/messageButtonTooltip"){
				throw new Error("MessageButtonHelper should not access property " + sProperty + " of private model");
			}
			fnSetProperty.apply(oTemplPriv, arguments);
		};
		oItemBinding.attachChange = function(fnListener){
			fnChangeListener = fnListener;
			delete oItemBinding.attachChange;
		};
	}

	function fnGeneralTeardown(){
		oSandbox.restore();
	}

	function checkTemplPrivContent(assert, iLength){
		oItemBinding.getLength.returns(iLength);
		fnChangeListener();
		assert.strictEqual(oTemplPriv.getProperty("/generic/messageCount"), iLength, "number of messages must be correct");
		assertIsText(assert, oTemplPriv.getProperty("/generic/messageButtonTooltip"), iLength === 1 ? "MESSAGE_BUTTON_TOOLTIP_S" : "MESSAGE_BUTTON_TOOLTIP_P", iLength);
	}

	module("Initialization", {
		setup: fnGeneralSetup,
		teardown: fnGeneralTeardown
	});

	QUnit.test("Test that class can be instantiated", function(assert) {
		var oGetDialogFragmentSpy = oSandbox.spy(oCommonUtils, "getDialogFragment");
		var oSetModelSpy = oSandbox.spy(oMessagePopover, "setModel");
		var oGetBindingSpy = oSandbox.spy(oMessagePopover, "getBinding");
		oMessageButtonHelper = new MessageButtonHelper(oTemplateUtils, oHost, true);
		assert.ok(oGetDialogFragmentSpy.calledOnce, "One fragment must have been retrieved");
		var sFragmentName = oGetDialogFragmentSpy.args[0][0];
		assert.strictEqual(sFragmentName, "sap.suite.ui.generic.template.fragments.MessagePopover", "MessagePopover fragment must be retrieved");
		assert.ok(oSetModelSpy.calledWithExactly(sap.ui.getCore().getMessageManager().getMessageModel(), "msg"), "Message model must have been set for MessagePopover");
		assert.ok(oGetBindingSpy.calledWithExactly("items"), "items-binding must have been retrieved");
		assert.strictEqual(typeof fnChangeListener, "function", "Change listener must have been set");
		assert.strictEqual(oTemplPriv.getProperty("/generic/messageCount"), 0, "0 messages must be available in the beginning");
		assertIsText(assert, oTemplPriv.getProperty("/generic/messageButtonTooltip"), "MESSAGE_BUTTON_TOOLTIP_P", 0);
		checkTemplPrivContent(assert, 3);
		checkTemplPrivContent(assert, 0);
		checkTemplPrivContent(assert, 1);
		checkTemplPrivContent(assert, 11);
	});
/*	todo: Revitalize this coding with the new filter logic
	var fnFilterAnalyzer;

	module("adaptToContext", {
		setup: function(){
			testableHelper.startTest();
			fnFilterAnalyzer = testableHelper.observeConstructor(Filter);
			fnGeneralSetup();
			oMessageButtonHelper = new MessageButtonHelper(oTemplateUtils, oHost, true);
			oMessageButtonHelper.setEnabled(true);
		},
		teardown: function(){
			fnGeneralTeardown();
			testableHelper.endTest();
		}
	});


	function isPersistentFilter(oFilter){
		var args = fnFilterAnalyzer(oFilter);
		if (args && args.length === 1){
			var oPar = args[0];
			return oPar.path === "persistent" && oPar.operator === FilterOperator.EQ && oPar.value1 === false;
		}
	}

	function isValidationFilter(oFilter){
		var args = fnFilterAnalyzer(oFilter);
		if (args && args.length === 1){
			var oPar = args[0];
			return oPar.path === "validation" && oPar.operator === FilterOperator.EQ && oPar.value1 === true;
		}
	}

	function isEntityFilter(oFilter){
		var args = fnFilterAnalyzer(oFilter);
		if (args && args.length === 1){
			var oPar = args[0];
			return oPar.path === "target" && oPar.operator === FilterOperator.EQ && oPar.value1 === "/" + sEntitySet;
		}
	}

	function isBindingFilter(sBindingPath, oFilter){
		var args = fnFilterAnalyzer(oFilter);
		if (args && args.length === 1){
			var oPar = args[0];
			return oPar.path === "target" && oPar.operator === FilterOperator.StartsWith && oPar.value1 === sBindingPath;
		}
	}

	function fnTestContextFilter(assert, aFilterArgs, sBindingPath, aAditionalFilters){
		aAditionalFilters = aAditionalFilters || [];
		assert.strictEqual(aFilterArgs.length, 1, "Exactly one parameter must have been passed to method filter");
		var aFilters = aFilterArgs[0];
		assert.ok(Array.isArray(aFilters) && (aFilters.length === 2), "Parameter for method filter must be an array of length 2");
		var oContextFilter = isPersistentFilter(aFilters[0]) ? aFilters[1] : (isPersistentFilter(aFilters[1]) && aFilters[0]);
		assert.ok(!!oContextFilter, "Persistent filter must be one of the two array members");
		var oContextFilterArguments = fnFilterAnalyzer(oContextFilter);
		assert.strictEqual(oContextFilterArguments.length, 2, "Context filter must be created with two arguments");
		assert.strictEqual(oContextFilterArguments[1], false, "Context filter must be created with OR");
		var aContextFilters = oContextFilterArguments[0];
		assert.ok(Array.isArray(aContextFilters) && (aContextFilters.length === aAditionalFilters.length + 3), "Context filter must have been created by an array of correct length");
		assert.ok(aContextFilters.some(isValidationFilter), "Validation filter must be part of the context filter");
		assert.ok(aContextFilters.some(isEntityFilter), "Entity filter must be part of the context filter");
		assert.ok(aContextFilters.some(isBindingFilter.bind(null, sBindingPath)), "Binding path filter must be part of the context filter");
		for (var i = 0; i < aAditionalFilters.length; i++){
			var bFound = false;
			for (var j = 0; !bFound && j < aContextFilters.length; j++){
				bFound = aContextFilters[j] === aAditionalFilters[i];
			}
			assert.ok(bFound, "Additional filter " + i + " must have been added to the context filter");
		}
	}


	QUnit.test("Single call of adaptToContext", function(assert) {
		var oItemBindingFilterSpy = oSandbox.spy(oItemBinding, "filter");
		oMessageButtonHelper.adaptToContext("context1");
		assert.ok(oItemBindingFilterSpy.calledOnce, "Item binding must have been filtered");
		var aFilterArgs = oItemBindingFilterSpy.args[0];
		fnTestContextFilter(assert, aFilterArgs, "context1");
	});

	QUnit.test("Several calls of adaptToContext", function(assert) {
		var oItemBindingFilterSpy = oSandbox.spy(oItemBinding, "filter");
		oMessageButtonHelper.adaptToContext("context1");
		oMessageButtonHelper.adaptToContext("context2");
		assert.ok(oItemBindingFilterSpy.calledTwice, "Item binding must have been filtered again");
		var aFilterArgs = oItemBindingFilterSpy.args[1];
		fnTestContextFilter(assert, aFilterArgs, "context2");
		oMessageButtonHelper.adaptToContext("context1");
		assert.ok(oItemBindingFilterSpy.calledThrice, "Item binding must have been filtered again");
		aFilterArgs = oItemBindingFilterSpy.args[2];
		fnTestContextFilter(assert, aFilterArgs, "context1");
	});

	module("registerMessageFilterProvider", {
		setup: function(){
			testableHelper.startTest();
			fnFilterAnalyzer = testableHelper.observeConstructor(Filter);
			fnGeneralSetup();
			oMessageButtonHelper = new MessageButtonHelper(oTemplateUtils, oHost, true);
			oMessageButtonHelper.resume([]);
		},
		teardown: function(){
			fnGeneralTeardown();
			testableHelper.endTest();
		}
	});

	QUnit.test("registerMessageFilterProvider providing filters directly", function(assert) {
		var oItemBindingFilterSpy = oSandbox.spy(oItemBinding, "filter");
		var aFilters = [];
		for (var i = 0; i < 5; i++){
			aFilters.push(new Filter([]));
		}
		var i1 = 0;
		var fnProvider1 = function(){
			return aFilters[i1];
		};
		oMessageButtonHelper.registerMessageFilterProvider(fnProvider1);
		oMessageButtonHelper.adaptToContext("context1");
		assert.ok(oItemBindingFilterSpy.calledOnce, "Item binding must have been filtered");
		var aFilterArgs = oItemBindingFilterSpy.args[0];
		fnTestContextFilter(assert, aFilterArgs, "context1", [aFilters[0]]);
		var i2 = 1;
		var i3 = 1;
		var fnProvider2 = function(){
			return i2 === i3 ? [aFilters[i2]] : [aFilters[i2], aFilters[i3]];
		};
		oMessageButtonHelper.registerMessageFilterProvider(fnProvider2);
		assert.ok(oItemBindingFilterSpy.calledTwice, "Item binding must have been filtered again");
		aFilterArgs = oItemBindingFilterSpy.args[1];
		fnTestContextFilter(assert, aFilterArgs, "context1", [aFilters[0], aFilters[1]]);
		i1 = 2;
		i2 = 3;
		i3 = 4;
		oMessageButtonHelper.adaptToContext("context2");
		assert.ok(oItemBindingFilterSpy.calledThrice, "Item binding must have been filtered again");
		aFilterArgs = oItemBindingFilterSpy.args[2];
		fnTestContextFilter(assert, aFilterArgs, "context2", [aFilters[2], aFilters[3], aFilters[4]]);
	});

	QUnit.test("registerMessageFilterProvider providing filters via Promises", function(assert) {
		var oItemBindingFilterSpy = oSandbox.spy(oItemBinding, "filter");
		var aFilters = [];
		for (var i = 0; i < 5; i++){
			aFilters.push(new Filter([]));
		}
		var i1 = 0;
		var fnProvider1 = function(){
			return Promise.resolve(aFilters[i1]);
		};
		oMessageButtonHelper.registerMessageFilterProvider(fnProvider1);
		oMessageButtonHelper.adaptToContext("context1");
		assert.ok(oItemBindingFilterSpy.calledOnce, "Item binding must have been filtered");
		var aFilterArgs = oItemBindingFilterSpy.args[0];
		fnTestContextFilter(assert, aFilterArgs, "context1");
		var i2 = 1;
		var i3 = 1;
		var fnProvider2 = function(){
			return Promise.resolve(i2 === i3 ? [aFilters[i2]] : [aFilters[i2], aFilters[i3]]);
		};
		oMessageButtonHelper.registerMessageFilterProvider(fnProvider2);
		var done = assert.async();
		setTimeout(function(){
			aFilterArgs = oItemBindingFilterSpy.lastCall.args;
			fnTestContextFilter(assert, aFilterArgs, "context1", [aFilters[0], aFilters[1]]);
			i1 = 2;
			i2 = 3;
			i3 = 4;
			oMessageButtonHelper.adaptToContext("context2");
			aFilterArgs = oItemBindingFilterSpy.lastCall.args;
			fnTestContextFilter(assert, aFilterArgs, "context2", []);
			setTimeout(function(){
				aFilterArgs = oItemBindingFilterSpy.lastCall.args;
				fnTestContextFilter(assert, aFilterArgs, "context2", [aFilters[2], aFilters[3], aFilters[4]]);
				done();
			}, 0);
		}, 0);
	});

	QUnit.test("registerMessageFilterProvider providing filters via Promises, complex scenario", function(assert) {
		var oItemBindingFilterSpy = oSandbox.spy(oItemBinding, "filter");
		var aFilters = [];
		for (var i = 0; i < 5; i++){
			aFilters.push(new Filter([]));
		}
		var aResolves = [];
		var fnProvider1 = function(){
			return new Promise(function(fnResolve){
				aResolves.push(fnResolve);
			});
		};
		oMessageButtonHelper.registerMessageFilterProvider(fnProvider1);
		oMessageButtonHelper.adaptToContext("context1");
		var i1 = 0;
		var fnProvider2 = function(){
			return Promise.resolve(aFilters[i1]);
		};
		oMessageButtonHelper.registerMessageFilterProvider(fnProvider2);
		oMessageButtonHelper.adaptToContext("context2");
		assert.strictEqual(aResolves.length, 2, "Two Promises must have been retrieved");
		aResolves[0](aFilters[1]);   // resolve an outdated Promise
		var done = assert.async();
		setTimeout(function(){
			var aFilterArgs = oItemBindingFilterSpy.lastCall.args;
			fnTestContextFilter(assert, aFilterArgs, "context2", [aFilters[0]]);
			aResolves[1]([aFilters[2], aFilters[3]]);
			i1 = 4; // must have no effect, since fnProvider2 should not be called again
			setTimeout(function(){
				aFilterArgs = oItemBindingFilterSpy.lastCall.args;
				fnTestContextFilter(assert, aFilterArgs, "context2", [aFilters[0], aFilters[2], aFilters[3]]);
				done();
			}, 0);
		}, 0);
	});

	QUnit.test("registerMessageFilterProvider providing filters via Promises, recursive scenario", function(assert) {
		var oItemBindingFilterSpy = oSandbox.spy(oItemBinding, "filter");
		var aFilters = [];
		for (var i = 0; i < 5; i++){
			aFilters.push(new Filter([]));
		}
		var aResolves = [];
		var oRejected = Promise.reject();
		oRejected.catch(Function.prototype);
		var fnProvider1 = function(){
			return [[Promise.resolve(new Promise(function(fnResolve){
				aResolves.push(fnResolve);
			}))], oRejected];
		};
		oMessageButtonHelper.registerMessageFilterProvider(fnProvider1);
		oMessageButtonHelper.adaptToContext("context1");
		var i1 = 0;
		var fnProvider2 = function(){
			return Promise.resolve(aFilters[i1]);
		};
		oMessageButtonHelper.registerMessageFilterProvider(fnProvider2);
		oMessageButtonHelper.adaptToContext("context2");
		assert.strictEqual(aResolves.length, 2, "Two Promises must have been retrieved");
		aResolves[0](aFilters[1]);   // resolve an outdated Promise
		var done = assert.async();
		setTimeout(function(){
			var aFilterArgs = oItemBindingFilterSpy.lastCall.args;
			fnTestContextFilter(assert, aFilterArgs, "context2", [aFilters[0]]);
			aResolves[1]([aFilters[2], aFilters[3]]);
			i1 = 4; // must have no effect, since fnProvider2 should not be called again
			setTimeout(function(){
				aFilterArgs = oItemBindingFilterSpy.lastCall.args;
				fnTestContextFilter(assert, aFilterArgs, "context2", [aFilters[0], aFilters[2], aFilters[3]]);
				done();
			}, 0);
		}, 0);
	});
*/
});
