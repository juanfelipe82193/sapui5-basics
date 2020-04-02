// Use this test page to test the API and features of the FieldHelp.
// The interaction with the Field is tested on the field test page.

/* global QUnit, sinon */
/*eslint max-nested-callbacks: [2, 10]*/

sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/mdc/field/FieldValueHelp",
	"sap/ui/mdc/field/FieldValueHelpContentWrapperBase",
	"sap/ui/mdc/condition/Condition",
	"sap/ui/mdc/condition/ConditionModel",
	"sap/ui/mdc/condition/FilterOperatorUtil",
	"sap/ui/mdc/util/BaseType",
	"sap/ui/mdc/field/InParameter",
	"sap/ui/mdc/field/OutParameter",
	"sap/ui/mdc/field/FieldBaseDelegate",
	"sap/ui/mdc/FilterField",
	"sap/ui/mdc/FilterBar",
	"sap/ui/core/Icon",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/type/String",
	"sap/ui/Device"
], function (
		qutils,
		FieldValueHelp,
		FieldValueHelpContentWrapperBase,
		Condition,
		ConditionModel,
		FilterOperatorUtil,
		BaseType,
		InParameter,
		OutParameter,
		FieldBaseDelegate,
		FilterField,
		FilterBar,
		Icon,
		JSONModel,
		StringType,
		Device
	) {
	"use strict";

	var iDialogDuration = sap.ui.getCore().getConfiguration().getAnimationMode() === "none" ? 15 : 500;
	var iPopoverDuration = Device.browser.firefox ? 410 : 355;

	var oModel = new JSONModel({
		items:[{text: "Item 1", key: "I1", additionalText: "Text 1", filter: "XXX"},
		       {text: "Item 2", key: "I2", additionalText: "Text 2", filter: "XXX"},
		       {text: "X-Item 3", key: "I3", additionalText: "Text 3", filter: "YYY"}],
		test: "Hello",
		contexts: [{icon: "sap-icon://sap-ui5", inParameter: "in1", outParameter: "out1"},
		           {icon: "sap-icon://lightbulb", inParameter: "in2", outParameter: "out2"},
		           {icon: "sap-icon://camera", inParameter: "in3", outParameter: "out3"}]
		});
	sap.ui.getCore().setModel(oModel);

	var oDialogContent;
	var oSuggestContent;
	var oWrapper;
	var oListBinding;
	var oFieldHelp;
	var oField;
	var oField2;
	var oType;
	var iDisconnect = 0;
	var iSelect = 0;
	var aSelectConditions;
	var bSelectAdd;
	var sSelectId;
	var iNavigate = 0;
	var sNavigateValue;
	var sNavigateKey;
	var sNavigateId;
	var oNavigateCondition;
	var iDataUpdate = 0;
	var sDataUpdateId;
	var iOpen = 0;
	var bOpenSuggest;
	var bDataRequested;

	var _myDisconnectHandler = function(oEvent) {
		iDisconnect++;
	};

	var _mySelectHandler = function(oEvent) {
		iSelect++;
		aSelectConditions = oEvent.getParameter("conditions");
		bSelectAdd = oEvent.getParameter("add");
		sSelectId = oEvent.oSource.getId();
	};

	var _myNavigateHandler = function(oEvent) {
		iNavigate++;
		sNavigateValue = oEvent.getParameter("value");
		sNavigateKey = oEvent.getParameter("key");
		sNavigateId = oEvent.oSource.getId();
		oNavigateCondition = oEvent.getParameter("condition");
	};

	var _myDataUpdateHandler = function(oEvent) {
		iDataUpdate++;
		sDataUpdateId = oEvent.oSource.getId();
	};

	var _myOpenHandler = function(oEvent) {
		iOpen++;
		bOpenSuggest = oEvent.getParameter("suggestion");
	};

	var _myDataRequestedHandler = function(oEvent) {
		bDataRequested = true;
	};

	var oFilters;
	var sSearch;
	var sWrapperId;
	var _applyFilters = function(aFilters, sMySearch) {
		sSearch = sMySearch;
		oFilters = {};
		sWrapperId = this.getId();

		var fnCollectFilters = function(oFilter, oFilters) {
			if (!oFilter) {
				return;
			}
			if (Array.isArray(oFilter)) {
				oFilter.forEach(function(oFilter, iIndex, aFilters) {
					fnCollectFilters(oFilter, oFilters);
				});
			} else if (oFilter._bMultiFilter) {
				oFilter.aFilters.forEach(function(oFilter, iIndex, aFilters) {
					fnCollectFilters(oFilter, oFilters);
				});
			} else {
				var sPath = oFilter.sPath;
				if (!oFilters[sPath]) {
					oFilters[sPath] = [];
				}
				oFilters[sPath].push({operator: oFilter.sOperator, value: oFilter.oValue1, value2: oFilter.oValue2});
			}
		};

		fnCollectFilters(aFilters, oFilters);

		if (oListBinding.isSuspended()) {
			oListBinding.resume();
		}

	};

	var _isSuspended = function() {
		return oListBinding.isSuspended();
	};

	/* first test it without the Field to prevent loading of popup etc. */
	/* use dummy control to simulate Field */

	var _initFields = function() {
		oField = new Icon("I1", {src:"sap-icon://sap-ui5"});
		oField2 = new Icon("I2", {src:"sap-icon://sap-ui5"});

		oType = new StringType();
		oField.getFieldPath = function() {return "key";};
		oField._getFormatOptions = function() {
			return {
				valueType: oType,
				maxConditions: -1,
				delegate: FieldBaseDelegate,
				operators: ["EEQ"]
				};
		};

		oField2.getFieldPath = function() {return "key";};
		oField2.getMaxConditions = function() {return -1;};
		oField2.getDisplay = function() {return "Value";};
		oField2.getRequired = function() {return true;};
		oField2.getDataType = function() {return "Edm.String";};
		oField2._getDataType = function() {return oType;};
		oField2._getFormatOptions = function() {
			return {
				valueType: oType,
				maxConditions: -1,
				delegate: FieldBaseDelegate,
				operators: FilterOperatorUtil.getOperatorsForType(BaseType.String)
				};
		};

		oField.placeAt("content");
		oField2.placeAt("content");
		sap.ui.getCore().applyChanges();
	};

	var _initFieldHelp = function() {
		oDialogContent = new Icon("DC1", {src:"sap-icon://sap-ui5"});
		oSuggestContent = new Icon("SC1", {src:"sap-icon://sap-ui5"});

		oListBinding = oModel.bindList("/items");
		oWrapper = new FieldValueHelpContentWrapperBase("W1");
		sinon.spy(oWrapper, "initialize");
		sinon.stub(oWrapper, "getDialogContent").returns(oDialogContent);
		sinon.stub(oWrapper, "getSuggestionContent").returns(oSuggestContent);
		sinon.spy(oWrapper, "fieldHelpOpen");
		sinon.spy(oWrapper, "fieldHelpClose");
		sinon.spy(oWrapper, "getFilterEnabled");
		sinon.spy(oWrapper, "navigate");
		sinon.stub(oWrapper, "applyFilters").callsFake(_applyFilters);
		sinon.stub(oWrapper, "isSuspended").callsFake(_isSuspended);
		var oStub = sinon.stub(oWrapper, "getTextForKey").returns("");
		oStub.withArgs("I1").returns("Item 1");
		oStub.withArgs("I2").returns({key: "I2", description: "Item 2", inParameters: {myTestIn: "In2"}, outParameters: {myTest: "Out2"}});
		oStub.withArgs("I3").returns("X-Item 3");
		oStub.withArgs("I4").returns(new Promise(function(fResolve) {fResolve({key: "I4", description: "Item 4", inParameters: {myTestIn: "In4"}, outParameters: {myTest: "Out4"}});}));
		oStub.withArgs("I5").returns(new Promise(function(fResolve) {throw new Error("wrong key");}));
		oStub = sinon.stub(oWrapper, "getKeyForText");
		oStub.withArgs("Item 1").returns("I1");
		oStub.withArgs("Item 2").returns({key: "I2", description: "Item 2", inParameters: {myTestIn: "In2"}, outParameters: {myTest: "Out2"}});
		oStub.withArgs("X-Item 3").returns("I3");
		oStub.withArgs("Item 4").returns(new Promise(function(fResolve) {fResolve({key: "I4", description: "Item 4", inParameters: {myTestIn: "In4"}, outParameters: {myTest: "Out4"}});}));
		oStub.withArgs("Item 5").returns(new Promise(function(fResolve) {throw new Error("wrong text");}));
		sinon.stub(oWrapper, "getListBinding").returns(oListBinding);

		oFieldHelp = new FieldValueHelp("F1-H", {
					disconnect: _myDisconnectHandler,
					select: _mySelectHandler,
					navigate: _myNavigateHandler,
					dataUpdate: _myDataUpdateHandler,
					open: _myOpenHandler,
					dataRequested: _myDataRequestedHandler,
					content: oWrapper,
					filterFields: "*text,additionalText*",
					descriptionPath: "text"
				});
		_initFields();
		oField.addDependent(oFieldHelp);
		oFieldHelp.connect(oField);
	};

	var _teardown = function() {
		oDialogContent.destroy();
		oDialogContent = undefined;
		oSuggestContent.destroy();
		oSuggestContent = undefined;
		oListBinding.destroy();
		oListBinding = undefined;
		oWrapper.destroy();
		oWrapper = undefined;
		oFieldHelp.destroy();
		oFieldHelp = undefined;
		oField.destroy();
		oField = undefined;
		oField2.destroy();
		oField2 = undefined;
		oType.destroy();
		oType = undefined;
		iDisconnect = 0;
		iSelect = 0;
		aSelectConditions = undefined;
		bSelectAdd = undefined;
		sSelectId = undefined;
		iNavigate = 0;
		sNavigateValue = undefined;
		sNavigateKey = undefined;
		sNavigateId = undefined;
		oNavigateCondition = undefined;
		iDataUpdate = 0;
		sDataUpdateId = undefined;
		iOpen = 0;
		bOpenSuggest = undefined;
		bDataRequested = undefined;
		oFilters = undefined;
		sSearch = undefined;
		sWrapperId = undefined;
	};

	QUnit.module("ValueHelp", {
		beforeEach: _initFieldHelp,
		afterEach: _teardown
	});

	QUnit.test("icon", function(assert) {

		assert.equal(oFieldHelp.getIcon(), "sap-icon://value-help", "ValueHelp icon as default");

		oFieldHelp.setNoDialog(true);
		assert.equal(oFieldHelp.getIcon(), "sap-icon://slim-arrow-down", "ComboBox icon if noDialog");

	});

	QUnit.test("openByTyping", function(assert) {

		assert.ok(oFieldHelp.openByTyping(), "openByTyping active as defalut (as FilterFields has a default)");

		oFieldHelp.setFilterFields("");
		assert.notOk(oFieldHelp.openByTyping(), "openByTyping not active if no FilterFields set (not known how to search)");

	});

	QUnit.test("getTextForKey", function(assert) {

		var vResult = oFieldHelp.getTextForKey("I1");
		assert.equal(vResult, "Item 1", "Text for key");
		assert.ok(oWrapper.getTextForKey.calledWith("I1"), "getTextForKey of Wrapper called");

		vResult = oFieldHelp.getTextForKey("Test");
		assert.equal(vResult, "", "Text for not existing key");

		oFieldHelp.addOutParameter(new OutParameter({value: "{/test}", helpPath: "myTest"}));
		vResult = oFieldHelp.getTextForKey("I2", undefined, {test: "X"});
		assert.equal(vResult.description, "Item 2", "Text for key");
		assert.ok(oWrapper.getTextForKey.calledWith("I2", undefined, {myTest: "X"}), "getTextForKey of Wrapper called with outParameter");
		assert.notOk(vResult.inParameters, "No In-paramters in result");
		assert.deepEqual(vResult.outParameters, {test: "Out2"} , "Out-parameters in result");

		oFieldHelp.addInParameter(new InParameter({value: "{/testIn}", helpPath: "myTestIn"}));
		vResult = oFieldHelp.getTextForKey("I2", {testIn: "X"}, {test: "Y"});
		assert.equal(vResult.description, "Item 2", "Text for key");
		assert.ok(oWrapper.getTextForKey.calledWith("I2", {myTestIn: "X"}, {myTest: "Y"}), "getTextForKey of Wrapper called with In- and OutParameter");
		assert.deepEqual(vResult.inParameters, {testIn: "In2"} , "In-parameters in result");
		assert.deepEqual(vResult.outParameters, {test: "Out2"} , "Out-parameters in result");

		//TODO: only possible if fieldHelp is connected to field, otherwise wrong bindingContext
//		var fnDone = assert.async();
//		setTimeout( function(){
//			sText = oFieldHelp.getTextForKey("I2");
//			assert.equal(sText, "Item 2", "Text for key");
//			assert.ok(oWrapper.getTextForKey.calledWith("I2", {}, {myTest: "Hello"}), "getTextForKey of Wrapper called with In- and OutParameter and default values");
//			fnDone();
//		}, 0); // update binding

		assert.notOk(bDataRequested, "No dataRequested event fired");

		oWrapper.getListBinding.returns(null);
		vResult = oFieldHelp.getTextForKey("I4");
		assert.ok(vResult instanceof Promise, "Promise returned");
		assert.ok(bDataRequested, "dataRequested event fired");

		var fnDone = assert.async();
		vResult.then(function(vResult) {
			assert.equal(vResult.description, "Item 4", "Text for key");
			assert.deepEqual(vResult.inParameters, {testIn: "In4"} , "In-parameters in result");
			assert.deepEqual(vResult.outParameters, {test: "Out4"} , "Out-parameters in result");

			vResult = oFieldHelp.getTextForKey("I5");
			assert.ok(vResult instanceof Promise, "Promise returned");

			vResult.then(function(vResult) {
				assert.notOk(true, "Promise Then must not be called");
				fnDone();
			}).catch(function(oError) {
				assert.ok(true, "Promise Catch called");
				fnDone();
			});
		});

	});

	QUnit.test("getKeyForText", function(assert) {

		var vResult = oFieldHelp.getKeyForText("Item 1");
		assert.equal(vResult, "I1", "key for text");
		assert.ok(oWrapper.getKeyForText.calledWith("Item 1"), "getKeyForText of Wrapper called");

		vResult = oFieldHelp.getKeyForText("Item 2");
		assert.equal(vResult.key, "I2", "key for text");
		assert.ok(oWrapper.getKeyForText.calledWith("Item 2"), "getKeyForText of Wrapper called");
		assert.notOk(vResult.inParameters, "No In-paramters in result");
		assert.notOk(vResult.outParameters, "No out-paramters in result");

		oFieldHelp.addInParameter(new InParameter({value: "{/testIn}", helpPath: "myTestIn"}));
		oFieldHelp.addOutParameter(new OutParameter({value: "{/test}", helpPath: "myTest"}));
		vResult = oFieldHelp.getKeyForText("Item 2");
		assert.equal(vResult.key, "I2", "key for text");
		assert.ok(oWrapper.getKeyForText.calledWith("Item 2"), "getKeyForText of Wrapper called");
		assert.deepEqual(vResult.inParameters, {testIn: "In2"} , "In-parameters in result");
		assert.deepEqual(vResult.outParameters, {test: "Out2"} , "Out-parameters in result");

		vResult = oFieldHelp.getKeyForText("X");
		assert.notOk(vResult, "key for not existing text");

		assert.notOk(bDataRequested, "No dataRequested event fired");

		oWrapper.getListBinding.returns(null);
		vResult = oFieldHelp.getKeyForText("Item 4");
		assert.ok(vResult instanceof Promise, "Promise returned");
		assert.ok(bDataRequested, "dataRequested event fired");

		var fnDone = assert.async();
		vResult.then(function(vResult) {
			assert.equal(vResult.key, "I4", "key for text");
			assert.deepEqual(vResult.inParameters, {testIn: "In4"} , "In-parameters in result");
			assert.deepEqual(vResult.outParameters, {test: "Out4"} , "Out-parameters in result");

			vResult = oFieldHelp.getKeyForText("Item 5");
			assert.ok(vResult instanceof Promise, "Promise returned");

			vResult.then(function(vResult) {
				assert.notOk(true, "Promise Then must not be called");
				fnDone();
			}).catch(function(oError) {
				assert.ok(true, "Promise Catch called");
				fnDone();
			});
		});

	});

	QUnit.test("onFieldChange", function(assert) {

		var oOutParameter = new OutParameter({value: "{/test}", helpPath: "myTest"});
		oFieldHelp.addOutParameter(oOutParameter);
		var oCondition = Condition.createCondition("EEQ", ["Test", "Test Text"], undefined, {"test": "Test"});
		oFieldHelp.setConditions([oCondition]);

		oFieldHelp.onFieldChange();
		assert.equal(oOutParameter.getValue(), "Test", "Out-parameter updated");

		oOutParameter.destroy();
		oOutParameter = new OutParameter({value: "{/test}", helpPath: "myTest", mode: "WhenEmpty"});
		oFieldHelp.addOutParameter(oOutParameter);
		oCondition = Condition.createCondition("EEQ", ["Test2", "Test Text2"], undefined, {"test": "Test2"});
		oFieldHelp.setConditions([oCondition]);

		oFieldHelp.onFieldChange();
		assert.equal(oOutParameter.getValue(), "Test", "Out-parameter not updated");

		oOutParameter.destroy();
		oOutParameter = new OutParameter({value: "{/test}", fixedValue: "X"});
		oFieldHelp.addOutParameter(oOutParameter);
		oFieldHelp.onFieldChange();
		assert.equal(oOutParameter.getValue(), "X", "Out-parameter updated");

		oOutParameter.destroy();

	});

	QUnit.test("onFieldChange using conditions in OutParameter", function(assert) {

		var oOutParameter = new OutParameter({value: "{cm>/conditions/test}", helpPath: "myTest"});
		var oCM = new ConditionModel();
		oOutParameter.setModel(oCM, "cm");
		oFieldHelp.addOutParameter(oOutParameter);
		var oCondition = Condition.createCondition("EEQ", ["Test", "Test Text"], undefined, {"test": "Test"});
		var oCondition2 = Condition.createCondition("EEQ", ["Test2", "Test Text2"], undefined, {"test": "Test2"});
		oFieldHelp.setConditions([oCondition, oCondition2]);

		oFieldHelp.onFieldChange();
		var vValue = oOutParameter.getValue();
		assert.ok(Array.isArray(vValue), "OutParameter contains array");
		assert.equal(vValue.length, 2, "Out-parameter 2 entries");
		assert.equal(vValue[0].operator, "EEQ", "Out-parameter[0] operator");
		assert.equal(vValue[0].values[0], "Test", "Out-parameter[0] value");
		assert.equal(vValue[1].operator, "EEQ", "Out-parameter[1] operator");
		assert.equal(vValue[1].values[0], "Test2", "Out-parameter[1] value");
		var aConditions = oCM.getConditions("test");
		assert.equal(aConditions.length, 2, "ConditionModel 2 entries");

		oOutParameter.destroy();
		oOutParameter = new OutParameter({value: "{cm>/conditions/test}", helpPath: "myTest", mode: "WhenEmpty"});
		oOutParameter.setModel(oCM, "cm");
		oFieldHelp.addOutParameter(oOutParameter);
		oFieldHelp.setConditions([oCondition]);

		oFieldHelp.onFieldChange();
		vValue = oOutParameter.getValue();
		assert.ok(Array.isArray(vValue), "OutParameter contains array");
		assert.equal(vValue.length, 2, "Out-parameter 2 entries");
		assert.equal(vValue[0].operator, "EEQ", "Out-parameter[0] operator");
		assert.equal(vValue[0].values[0], "Test", "Out-parameter[0] value");
		assert.equal(vValue[1].operator, "EEQ", "Out-parameter[1] operator");
		assert.equal(vValue[1].values[0], "Test2", "Out-parameter[1] value");
		aConditions = oCM.getConditions("test");
		assert.equal(aConditions.length, 2, "ConditionModel 2 entries");

		oOutParameter.destroy();
		oCM.removeAllConditions("test");
		oOutParameter = new OutParameter({value: "{cm>/conditions/test}", fixedValue: "X"});
		oOutParameter.setModel(oCM, "cm");
		oFieldHelp.addOutParameter(oOutParameter);
		oCondition = Condition.createCondition("EEQ", ["Test", "Test Text"], undefined, {"test": "Test"});
		oFieldHelp.setConditions([oCondition]);
		oFieldHelp.onFieldChange();
		vValue = oOutParameter.getValue();
		assert.ok(Array.isArray(vValue), "OutParameter contains array");
		assert.equal(vValue.length, 1, "Out-parameter 1 entry");
		assert.equal(vValue[0].operator, "EEQ", "Out-parameter[0] operator");
		assert.equal(vValue[0].values[0], "X", "Out-parameter[0] value");
		aConditions = oCM.getConditions("test");
		assert.equal(aConditions.length, 1, "ConditionModel 1 entry");

		oOutParameter.destroy();
		oCM.destroy();

	});

	QUnit.module("Connect", {
		beforeEach: _initFieldHelp,
		afterEach: _teardown
	});

	QUnit.test("getMaxConditions", function(assert) {

		assert.equal(oFieldHelp.getMaxConditions(), 1, "getMaxConditions default");

		oFieldHelp.connect(oField2);
		assert.equal(oFieldHelp.getMaxConditions(), -1, "MaxConditions taken from Field");

	});

	QUnit.test("getDisplay", function(assert) {

		assert.notOk(oFieldHelp.getDisplay(), "getDisplay default");

		oFieldHelp.connect(oField2);
		assert.equal(oFieldHelp.getDisplay(), "Value", "Display taken from Field");

	});

	QUnit.test("getRequired", function(assert) {

		assert.equal(oFieldHelp.getRequired(), false, "getRequired default");

		oFieldHelp.connect(oField2);
		assert.equal(oFieldHelp.getRequired(), true, "Required taken from Field");

	});

	QUnit.test("getDataType", function(assert) {

		assert.equal(oFieldHelp.getDataType(), "sap.ui.model.type.String", "getDataType default");

		oFieldHelp.connect(oField2);
		assert.equal(oFieldHelp.getDataType(), "Edm.String", "DataType taken from Field");

	});

	QUnit.test("_getFormatOptions", function(assert) {

		assert.ok(oFieldHelp._getFormatOptions(), "FormatOptions returned");
		assert.deepEqual(oFieldHelp._getFormatOptions(), oField._getFormatOptions(), "FormatOptions taken from Field");

		oFieldHelp.connect();
		assert.ok(oFieldHelp._getFormatOptions(), "FormatOptions returned default");
		assert.deepEqual(oFieldHelp._getFormatOptions(), {}, "_getFormatOptions is empty object per default");

	});

	QUnit.test("_getKeyPath", function(assert) {

		assert.equal(oFieldHelp._getKeyPath(), "key", "_getKeyPath");

		oFieldHelp.setKeyPath("MyKey");
		assert.equal(oFieldHelp._getKeyPath(), "MyKey", "_getKeyPath");

	});

	QUnit.module("Suggestion", {
		beforeEach: _initFieldHelp,
		afterEach: _teardown
	});

	QUnit.test("content display in suggestion", function(assert) {

		oFieldHelp.open(true);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover"], function (Popover) {
			setTimeout( function(){
				var oPopover = oFieldHelp.getAggregation("_popover");
				assert.ok(oPopover, "Popover created");
				if (oPopover) {
					assert.equal(iOpen, 1, "Open event fired");
					assert.ok(bOpenSuggest, "Open as suggestion");
					assert.ok(oPopover.isOpen(), "Popover is open");
					assert.ok(oFieldHelp.isOpen(), "FieldHelp is open");
					assert.ok(oWrapper.initialize.called, "Wrapper.initialize is called");
					assert.ok(oWrapper.fieldHelpOpen.calledWith(true), "fieldHelpOpen of Wrapper called");
					assert.ok(oWrapper.getSuggestionContent.called, "Wrapper.getSuggestionContent is called");
					assert.notOk(oWrapper.getDialogContent.called, "Wrapper.getDialogContent is not called");
					var oContent = oPopover._getAllContent()[0];
					assert.ok(oContent, "Popover has content");
					assert.equal(oContent.getId(), "SC1", "content is Popover content");
					assert.equal(iDataUpdate, 1, "DataUpdate event fired");
					assert.equal(oPopover.getInitialFocus(), "I1", "Initial focus on Field");
					var oScrollDelegate1 = oFieldHelp.getScrollDelegate();
					var oScrollDelegate2 = oPopover.getScrollDelegate();
					assert.equal(oScrollDelegate1, oScrollDelegate2, "oScrollDelegate of Popover used");
				}
				oFieldHelp.close();
				setTimeout( function(){
					assert.ok(oWrapper.fieldHelpClose.called, "fieldHelpClose of Wrapper called");
					fnDone();
				}, iPopoverDuration); // to wait until popover is closed
			}, iPopoverDuration); // to wait until popover is open
		});

	});

	QUnit.test("toggleOpen in suggestion", function(assert) {

		oFieldHelp.toggleOpen(true);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover"], function (Popover) {
			var oPopover = oFieldHelp.getAggregation("_popover");
			if (oPopover) {
				assert.equal(iOpen, 1, "Open event fired");
				assert.ok(bOpenSuggest, "Open as suggestion");
				setTimeout( function(){
					assert.ok(oPopover.isOpen(), "Popover is open");
					oFieldHelp.toggleOpen(true);
					setTimeout( function(){
						assert.notOk(oPopover.isOpen(), "Popover is not open");
						fnDone();
					}, iPopoverDuration); // to wait until popover is closed
				}, iPopoverDuration); // to wait until popover is open
			} else {
				fnDone();
			}
		});

	});

	QUnit.test("FilterValue in suggestion", function(assert) {

		oFieldHelp.setFilterValue("It");

		oFieldHelp.open(true);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover"], function (Popover) {
			setTimeout( function(){
				assert.ok(oWrapper.getFilterEnabled.called, "Wrapper.getFilterEnabled is called");
				assert.notOk(oWrapper.getListBinding.called, "Wrapper.getListBinding is not called");
				assert.ok(oWrapper.applyFilters.called, "Wrapper.applyFilters is called");
				assert.notOk(sSearch, "No $search used");
				var oCheckFilters = {text: [{operator: "StartsWith", value: "It", value2: undefined}], additionalText: [{operator: "StartsWith", value: "It", value2: undefined}]};
				assert.deepEqual(oFilters, oCheckFilters, "Filters used");
				oFieldHelp.setFilterValue("X");
				setTimeout( function(){
					assert.notOk(sSearch, "No $search used");
					oCheckFilters = {text: [{operator: "StartsWith", value: "X", value2: undefined}], additionalText: [{operator: "StartsWith", value: "X", value2: undefined}]};
					assert.deepEqual(oFilters, oCheckFilters, "Filters used");

					oFieldHelp.setFilterValue();
					var oInParameter = new InParameter({ value: "Text 2", helpPath: "additionalText"});
					oFieldHelp.addInParameter(oInParameter);
					setTimeout( function(){
						assert.notOk(sSearch, "No $search used");
						oCheckFilters = {additionalText: [{operator: "EQ", value: "Text 2", value2: undefined}]};
						assert.deepEqual(oFilters, oCheckFilters, "Filters used");

						oInParameter.setValue("Text 3");
						setTimeout( function(){
							assert.notOk(sSearch, "No $search used");
							oCheckFilters = {additionalText: [{operator: "EQ", value: "Text 3", value2: undefined}]};
							assert.deepEqual(oFilters, oCheckFilters, "Filters used");

							oInParameter.setValue("XXX");
							oInParameter.setHelpPath("filter");
							setTimeout( function(){
								assert.notOk(sSearch, "No $search used");
								oCheckFilters = {filter: [{operator: "EQ", value: "XXX", value2: undefined}]};
								assert.deepEqual(oFilters, oCheckFilters, "Filters used");

								oFieldHelp.close();
								setTimeout( function(){
									assert.ok(oWrapper.fieldHelpClose.called, "fieldHelpClose of Wrapper called");
									fnDone();
								}, iPopoverDuration); // to wait until popover is closed
							}, 0); // update binding
						}, 0); // update binding
					}, 0); // update binding
				}, 0); // update binding
			}, iPopoverDuration); // to wait until popover is open
		});

	});

	QUnit.test("FilterValue in suggestion with conditions in InParameters", function(assert) {

		var oInParameter = new InParameter({
			helpPath: "filter"
		});
		oFieldHelp.addInParameter(oInParameter);
		oInParameter = new InParameter({
			value: [Condition.createCondition("EQ", ["Text 2"]), Condition.createCondition("EQ", ["Text 3"], {filter: "XXX"})],
			helpPath: "additionalText"
		});
		oFieldHelp.addInParameter(oInParameter);
		oFieldHelp.setFilterValue("It");

		oFieldHelp.open(true);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover"], function (Popover) {
			setTimeout( function(){
				var oCheckFilters = {
						text: [{operator: "StartsWith", value: "It", value2: undefined}],
						additionalText: [{operator: "StartsWith", value: "It", value2: undefined}, {operator: "EQ", value: "Text 2", value2: undefined}, {operator: "EQ", value: "Text 3", value2: undefined}],
						filter: [{operator: "EQ", value: "XXX", value2: undefined}]};
				assert.deepEqual(oFilters, oCheckFilters, "Filters used");

				oInParameter.destroy();
				setTimeout( function(){
					oCheckFilters = {text: [{operator: "StartsWith", value: "It", value2: undefined}], additionalText: [{operator: "StartsWith", value: "It", value2: undefined}]};
					assert.deepEqual(oFilters, oCheckFilters, "Filters used");

					oFieldHelp.close();
					setTimeout( function(){
						assert.ok(oWrapper.fieldHelpClose.called, "fieldHelpClose of Wrapper called");
						fnDone();
					}, iPopoverDuration); // to wait until popover is closed
				}, 0); // update binding
			}, iPopoverDuration); // to wait until popover is open
		});

	});

	QUnit.test("FilterValue in suggestion with suspended ListBinding", function(assert) {

		oListBinding.suspend();

		oFieldHelp.open(true);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover"], function (Popover) {
			setTimeout( function(){
				assert.notOk(oListBinding.isSuspended(), "ListBinding not suspended after open without suggestion");

				oListBinding.suspend();
				oFieldHelp.setFilterValue("It");
				setTimeout( function(){
					assert.notOk(oListBinding.isSuspended(), "ListBinding not suspended after setting filterValue");

					oFieldHelp.close();
					setTimeout( function(){
						fnDone();
					}, iPopoverDuration); // to wait until popover is closed
				}, 0); // update binding
			}, iPopoverDuration); // to wait until popover is open
		});

	});

	QUnit.test("navigate in suggestion", function(assert) {

		oFieldHelp.navigate(1);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover"], function (Popover) {
			assert.ok(oWrapper.navigate.calledWith(1), "Wrapper.navigate called");
			assert.equal(iOpen, 1, "Open event fired");
			oWrapper.fireNavigate({key: "I1", description: "Item 1"});
			setTimeout( function(){
				var oPopover = oFieldHelp.getAggregation("_popover");
				if (oPopover) {
					assert.ok(bOpenSuggest, "Open as suggestion");
					assert.ok(oPopover.isOpen(), "Field help opened");
					assert.equal(iNavigate, 1, "Navigate event fired");
					assert.equal(sNavigateValue, "Item 1", "Navigate event value");
					assert.equal(sNavigateKey, "I1", "Navigate event key");
					assert.ok(oNavigateCondition, "NavigateEvent condition");
					assert.equal(oNavigateCondition.operator, "EEQ", "NavigateEvent condition operator");
					assert.equal(oNavigateCondition.values[0], "I1", "NavigateEvent condition key");
					assert.equal(oNavigateCondition.values[1], "Item 1", "NavigateEvent condition description");
					assert.notOk(oNavigateCondition.hasOwnProperty("inParameters"), "no in-parameters set");
					assert.notOk(oNavigateCondition.hasOwnProperty("outParameters"), "no out-parameters set");

					oFieldHelp.addInParameter(new InParameter({value: "{testIn}", helpPath: "myTestIn"}));
					oFieldHelp.addOutParameter(new OutParameter({value: "{testOut}", helpPath: "myTestOut"}));
					oFieldHelp.navigate(1);
					oWrapper.fireNavigate({key: "I2", description: "Item 2", inParameters: {myTestIn: "X"}, outParameters: {myTestOut: "Y"}});
					assert.equal(iNavigate, 2, "Navigate event fired");
					assert.equal(sNavigateValue, "Item 2", "Navigate event value");
					assert.equal(sNavigateKey, "I2", "Navigate event key");
					assert.ok(oNavigateCondition, "NavigateEvent condition");
					assert.ok(oNavigateCondition.hasOwnProperty("inParameters"), "in-parameters set");
					assert.ok(oNavigateCondition.inParameters && oNavigateCondition.inParameters.hasOwnProperty("testIn"), "in-parameters has 'testIn'");
					assert.equal(oNavigateCondition.inParameters && oNavigateCondition.inParameters.testIn, "X", "in-parameters 'testIn'");
					assert.ok(oNavigateCondition.hasOwnProperty("outParameters"), "out-parameters set");
					assert.ok(oNavigateCondition.outParameters && oNavigateCondition.outParameters.hasOwnProperty("testOut"), "out-parameters has 'testOut'");
					assert.equal(oNavigateCondition.outParameters && oNavigateCondition.outParameters.testOut, "Y", "out-parameters 'testOut'");
				}
				oFieldHelp.close();
				setTimeout( function(){
					assert.ok(oWrapper.fieldHelpClose.called, "fieldHelpClose of Wrapper called");
					fnDone();
				}, iPopoverDuration); // to wait until popover is closed
			}, iPopoverDuration); // to wait until popover is open
		});

	});

	QUnit.test("navigate in suggestion with suspended ListBinding", function(assert) {

		oListBinding.suspend();
		oFieldHelp.navigate(1);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover"], function (Popover) {
			setTimeout( function(){
				assert.notOk(oListBinding.isSuspended(), "ListBinding not suspended after navigate");
				assert.ok(oWrapper.navigate.calledWith(1), "Wrapper.navigate called");
				assert.equal(iOpen, 1, "Open event fired");
				oWrapper.fireNavigate({key: "I1", description: "Item 1"});
				setTimeout( function(){
					oFieldHelp.close();
					setTimeout( function(){
						assert.ok(oWrapper.fieldHelpClose.called, "fieldHelpClose of Wrapper called");
						fnDone();
					}, iPopoverDuration); // to wait until popover is closed
				}, iPopoverDuration); // to wait until popover is open
			}, 0); // update binding
		});

	});

	QUnit.test("select item in suggestion", function(assert) {

		oFieldHelp.open(true);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover"], function (Popover) {
			var oPopover = oFieldHelp.getAggregation("_popover");
			if (oPopover) {
				setTimeout( function(){
					oWrapper.fireSelectionChange({selectedItems: [{key: "I2", description: "Item 2"}]});
					setTimeout( function(){
						assert.equal(iSelect, 1, "Select event fired");
						assert.equal(aSelectConditions.length, 1, "one condition returned");
						assert.equal(aSelectConditions[0].operator, "EEQ", "Condition operator");
						assert.equal(aSelectConditions[0].values[0], "I2", "Condition values[0}");
						assert.equal(aSelectConditions[0].values[1], "Item 2", "Condition values[1}");
						assert.notOk(aSelectConditions[0].inParameters, "Condition no in-parameters");
						assert.notOk(aSelectConditions[0].outParameters, "Condition no out-parameters");
						assert.ok(bSelectAdd, "Items should be added");
						assert.notOk(oPopover.isOpen(), "Field help closed");
						fnDone();
					}, iPopoverDuration); // to wait until popover is closed
				}, iPopoverDuration); // to wait until popover is open
			} else {
				fnDone();
			}
		});

	});

	QUnit.test("select item in suggestion using in/out-parameters", function(assert) {

		oFieldHelp.addInParameter(new InParameter({value: "{testIn}", helpPath: "myTestIn"}));
		oFieldHelp.addOutParameter(new OutParameter({value: "{testOut}", helpPath: "myTestOut"}));
		oFieldHelp.addOutParameter(new OutParameter({value: "{testOut2}", fixedValue: "Z"}));
		oFieldHelp.open(true);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover"], function (Popover) {
			var oPopover = oFieldHelp.getAggregation("_popover");
			if (oPopover) {
				setTimeout( function(){
					oWrapper.fireSelectionChange({selectedItems: [{key: "I2", description: "Item 2", inParameters: {myTestIn: "X"}, outParameters: {myTestOut: "Y"}}]});
					setTimeout( function(){
						assert.equal(iSelect, 1, "Select event fired");
						assert.equal(aSelectConditions.length, 1, "one condition returned");
						assert.equal(aSelectConditions[0].operator, "EEQ", "Condition operator");
						assert.equal(aSelectConditions[0].values[0], "I2", "Condition values[0}");
						assert.equal(aSelectConditions[0].values[1], "Item 2", "Condition values[1}");
						assert.ok(aSelectConditions[0].inParameters, "Condition in-parameters set");
						assert.ok(aSelectConditions[0].inParameters && aSelectConditions[0].inParameters.hasOwnProperty("testIn"), "Condition in-parameters has 'testIn'");
						assert.equal(aSelectConditions[0].inParameters && aSelectConditions[0].inParameters.testIn, "X", "Condition in-parameters 'test'");
						assert.ok(aSelectConditions[0].outParameters, "Condition out-parameters set");
						assert.ok(aSelectConditions[0].outParameters && aSelectConditions[0].outParameters.hasOwnProperty("testOut"), "Condition out-parameters has 'testOut'");
						assert.equal(aSelectConditions[0].outParameters && aSelectConditions[0].outParameters.testOut, "Y", "Condition out-parameters 'test'");
						assert.ok(aSelectConditions[0].outParameters && aSelectConditions[0].outParameters.hasOwnProperty("testOut2"), "Condition out-parameters has 'testOut2'");
						assert.equal(aSelectConditions[0].outParameters && aSelectConditions[0].outParameters.testOut2, "Z", "Condition out-parameters 'test'");
						assert.ok(bSelectAdd, "Items should be added");
						assert.notOk(oPopover.isOpen(), "Field help closed");
						fnDone();
					}, iPopoverDuration); // to wait until popover is closed
				}, iPopoverDuration); // to wait until popover is open
			} else {
				fnDone();
			}
		});

	});

	QUnit.test("noDialog open", function(assert) {

		oFieldHelp.setNoDialog(true);
		oFieldHelp.open(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover", "sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
				function (Popover, Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			setTimeout( function(){
				var oPopover = oFieldHelp.getAggregation("_popover");
				var oDialog = oFieldHelp.getAggregation("_dialog");
				assert.ok(oPopover, "Popover created");
				assert.notOk(oDialog, "no dialog created");
				if (oPopover) {
					assert.equal(iOpen, 1, "Open event fired");
					assert.ok(bOpenSuggest, "Open as suggestion");
					assert.ok(oPopover.isOpen(), "Popover is open");
					assert.ok(oWrapper.getSuggestionContent.called, "Wrapper.getSuggestionContent is called");
					assert.notOk(oWrapper.getDialogContent.called, "Wrapper.getDialogContent is not called");
				}
				oFieldHelp.toggleOpen();
				setTimeout( function(){
					assert.ok(oWrapper.fieldHelpClose.called, "fieldHelpClose of Wrapper called");
					fnDone();
				}, iPopoverDuration); // to wait until popover is closed
			}, iPopoverDuration); // to wait until popover is open
		});

	});

	QUnit.test("assign wrapper while opening", function(assert) {

		oFieldHelp.setContent();
		oFieldHelp.attachOpen(function(){
			if (!oFieldHelp.getContent()) {
				oFieldHelp.setContent(oWrapper);
			}
		});

		iDataUpdate = 0;
		oFieldHelp.open(true);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover"], function (Popover) {
			setTimeout( function(){
				var oPopover = oFieldHelp.getAggregation("_popover");
				var oContent;
				if (oPopover) {
					assert.ok(oPopover.isOpen(), "Popover is open");
					assert.ok(oWrapper.getSuggestionContent.called, "Wrapper.getSuggestionContent is called");
					oContent = oPopover._getAllContent()[0];
					assert.ok(oContent, "Popover has content");
					assert.equal(oContent.getId(), "SC1", "content is Popover content");
					assert.equal(iDataUpdate, 1, "DataUpdate event fired");
				}
				oFieldHelp.close();
				setTimeout( function(){
					// test same but popover already exist
					oFieldHelp.setContent();
					iDataUpdate = 0;
					oFieldHelp.open(true);
					setTimeout( function(){
						assert.ok(oPopover.isOpen(), "Popover is open");
						oContent = oPopover._getAllContent()[0];
						assert.ok(oContent, "Popover has content");
						assert.equal(oContent.getId(), "SC1", "content is Popover content");
						assert.equal(iDataUpdate, 1, "DataUpdate event fired");
						oFieldHelp.close();
						setTimeout( function(){
							fnDone();
						}, iPopoverDuration); // to wait until popover is closed
					}, iPopoverDuration); // to wait until popover is open
				}, iPopoverDuration); // to wait until popover is closed
			}, iPopoverDuration); // to wait until popover is open
		});

	});

	QUnit.test("assign wrapper while navigate", function(assert) {

		oFieldHelp.setContent();
		oFieldHelp.attachOpen(function(){
			if (!oFieldHelp.getContent()) {
				setTimeout( function(){ // assign async
					oFieldHelp.setContent(oWrapper);
				}, 0);
			}
		});

		oWrapper.navigate.restore();
		sinon.stub(oWrapper, "navigate").callsFake(
				function() {
					oWrapper.fireNavigate({key: "I1", description: "Item 1"});
				}
		);

		iDataUpdate = 0;
		oFieldHelp.navigate(1); // so also navigation could be tested
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover"], function (Popover) {
			setTimeout( function(){
				var oPopover = oFieldHelp.getAggregation("_popover");
				if (oPopover) {
					assert.ok(oPopover.isOpen(), "Popover is open");
					var oContent = oPopover._getAllContent()[0];
					assert.ok(oContent, "Popover has content");
					assert.equal(oContent.getId(), "SC1", "content is Popover content");
					assert.equal(iDataUpdate, 1, "DataUpdate event fired");
					assert.equal(iNavigate, 1, "Navigate event fired");
					assert.equal(sNavigateValue, "Item 1", "Navigate event value");
					assert.equal(sNavigateKey, "I1", "Navigate event key");
				}
				oFieldHelp.close();
				setTimeout( function(){
					fnDone();
				}, iPopoverDuration); // to wait until popover is closed
			}, iPopoverDuration); // to wait until popover is open
		});

	});

	QUnit.test("assign content while opening", function(assert) {

		oWrapper.getSuggestionContent.returns(null);
		oWrapper.getListBinding.returns(null);
		oFieldHelp.attachOpen(function(){
			if (!oWrapper.getSuggestionContent()) {
				setTimeout( function(){ // assign async
					oWrapper.getSuggestionContent.returns(oSuggestContent);
					oWrapper.getListBinding.returns(oListBinding);
					oWrapper.fireDataUpdate({contentChange: true});
				}, 0);
			}
		});

		iDataUpdate = 0;
		oFieldHelp.setFilterValue("It");
		oFieldHelp.open(true);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover"], function (Popover) {
			setTimeout( function(){
				var oPopover = oFieldHelp.getAggregation("_popover");
				if (oPopover) {
					assert.ok(oPopover.isOpen(), "Popover is open");
					var oContent = oPopover._getAllContent()[0];
					assert.ok(oContent, "Popover has content");
					assert.equal(oContent.getId(), "SC1", "content is Popover content");
					assert.equal(iDataUpdate, 1, "DataUpdate event fired");
					var oCheckFilters = {text: [{operator: "StartsWith", value: "It", value2: undefined}], additionalText: [{operator: "StartsWith", value: "It", value2: undefined}]};
					assert.deepEqual(oFilters, oCheckFilters, "Filters used");
					var oCM = oFieldHelp._oFilterConditionModel;
					assert.notOk(oCM._oListBinding, "No ListBinding in ConditionModel");

					// change ListBinding of wrapper
					var oListBinding2 = oModel.bindList("/items"); // use different binding
					oWrapper.getListBinding.returns(oListBinding2);
					oWrapper.fireDataUpdate({contentChange: true});
					var oCM2 = oFieldHelp._oFilterConditionModel;
					assert.equal(oCM, oCM2, "no new ConditionModel");
					oListBinding2.destroy();
				}
				oFieldHelp.close();
				setTimeout( function(){
					fnDone();
				}, iPopoverDuration); // to wait until popover is closed
			}, iPopoverDuration); // to wait until popover is open
		});

	});

	QUnit.test("clone", function(assert) {

		oFieldHelp.open(true);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover"], function (Popover) {
			setTimeout( function(){
				var oClone = oFieldHelp.clone("MyClone");
				assert.ok(oClone, "FieldHelp cloned");
				oClone.connect(oField2);

				var oCloneWrapper = oClone.getContent();
				var oClonePopover = oClone.getAggregation("_popover");
				assert.ok(oCloneWrapper, "Clone has wrapper");
				assert.equal(oCloneWrapper.getId(), "W1-MyClone", "Id of cloned wrapper");
				assert.notOk(oClonePopover, "no Popover for clone created");

				iDataUpdate = 0;
				sDataUpdateId = undefined;
				oWrapper.fireDataUpdate({contentChange: false});
				assert.equal(iDataUpdate, 1, "DataUpdate event fired once");
				assert.equal(sDataUpdateId, oFieldHelp.getId(), "DataUpdate Id");

				iDataUpdate = 0;
				sDataUpdateId = undefined;
				oCloneWrapper.fireDataUpdate({contentChange: false});
				assert.equal(iDataUpdate, 1, "DataUpdate event on clone fired once");
				assert.equal(sDataUpdateId, oClone.getId(), "DataUpdate Id on clone");

				oWrapper.fireSelectionChange({selectedItems: [{key: "I2", description: "Item 2"}]});
				assert.equal(iSelect, 1, "Select event fired once");
				assert.equal(sSelectId, oFieldHelp.getId(), "Select Id");

				iSelect = 0;
				sSelectId = undefined;
				oCloneWrapper.fireSelectionChange({selectedItems: [{key: "I1", description: "Item 1"}]});
				assert.equal(iSelect, 1, "Select event on clone fired once");
				assert.equal(sSelectId, oClone.getId(), "Select Id on clone");

				oWrapper.fireNavigate({key: "I1", description: "Item 1"});
				assert.equal(iNavigate, 1, "Navigate event fired once");
				assert.equal(sNavigateId, oFieldHelp.getId(), "Navigate Id");

				iNavigate = 0;
				sNavigateId = undefined;
				oCloneWrapper.fireNavigate({key: "I2", description: "Item 2"});
				assert.equal(iNavigate, 1, "Navigate event on clone fired once");
				assert.equal(sNavigateId, oClone.getId(), "Navigate Id on clone");

				oFieldHelp.close();
				setTimeout( function(){
					fnDone();
				}, iPopoverDuration); // to wait until popover is closed
			}, iPopoverDuration); // to wait until popover is open
		});

	});

	QUnit.module("Dialog", {
		beforeEach: _initFieldHelp,
		afterEach: _teardown
	});

	QUnit.test("content display in dialog", function(assert) {

		oDialogContent.getScrollDelegate = function() {return "X";}; // Dummy for testing
		oFieldHelp.open(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
				function (Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			var oDialog = oFieldHelp.getAggregation("_dialog");
			setTimeout( function(){
				assert.ok(oDialog, "dialog created");
				if (oDialog) {
					assert.equal(iOpen, 1, "Open event fired");
					assert.notOk(bOpenSuggest, "Open not as suggestion");
					assert.ok(oDialog.isOpen(), "Dialog is open");
					assert.ok(oFieldHelp.isOpen(), "FieldHelp is open");
					assert.ok(oWrapper.initialize.called, "Wrapper.initialize is called");
					assert.ok(oWrapper.fieldHelpOpen.calledWith(false), "fieldHelpOpen of Wrapper called");
					assert.notOk(oWrapper.getSuggestionContent.called, "Wrapper.getSuggestionContent is  not called");
					assert.ok(oWrapper.getDialogContent.called, "Wrapper.getDialogContent is called");
					var oVHP = oDialog.getContent()[0];
					assert.ok(oVHP, "Dialog has content");
					assert.notOk(oVHP.getShowFilterbar(), "No FilterBar shown");
					assert.ok(oVHP && oVHP.isA("sap.ui.mdc.field.ValueHelpPanel"), "content is ValueHelpPanel");
					assert.equal(oVHP.getId(), "F1-H-VHP", "ValueHelpPanel ID");
					assert.equal(iDataUpdate, 1, "DataUpdate event fired");
					var oContent = oVHP.getTable();
					assert.ok(oContent, "ValueHelpPanel has table assigned");
					assert.equal(oContent.getId(), "DC1", "Content ID");
					assert.notOk(oVHP._oDefineConditionPanel, "no DefineConditionPanel");
					var aButtons = oDialog.getButtons();
					assert.equal(aButtons.length, 2, "Dialog has 2 Buttons");
					assert.equal(aButtons[0].getId(), "F1-H-ok", "Dialog has OK-Button");
					assert.equal(aButtons[1].getId(), "F1-H-cancel", "Dialog has Cancel-Button");
					var oScrollDelegate = oFieldHelp.getScrollDelegate();
					assert.equal(oScrollDelegate, "X", "oScrollDelegate of Dialog content used");
				}
				oFieldHelp.close();
				assert.ok(oFieldHelp.isOpen(), "Field help sill opened");
				assert.notOk(oFieldHelp.isOpen(true), "Field help not opened if closing is checked");
				setTimeout( function(){
					assert.ok(oWrapper.fieldHelpClose.called, "fieldHelpClose of Wrapper called");
					fnDone();
				}, iDialogDuration); // to wait until dialog is closed
			}, iDialogDuration); // to wait until dialog is open
		});

	});

	QUnit.test("content changed in dialog", function(assert) {

		oFieldHelp.open(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
				function (Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			var oDialog = oFieldHelp.getAggregation("_dialog");
			var oMyContent;
			setTimeout( function(){
				if (oDialog) {
					assert.equal(iOpen, 1, "Open event fired");
					assert.notOk(bOpenSuggest, "Open not as suggestion");
					assert.ok(oDialog.isOpen(), "Dialog is open");

					oMyContent = new Icon("DC2", {src:"sap-icon://sap-ui5"});
					oWrapper.getDialogContent.returns(oMyContent);
					oWrapper.fireDataUpdate({contentChange: true});

					var oVHP = oDialog.getContent()[0];
					assert.ok(oVHP, "Dialog has content");
					var oContent = oVHP.getTable();
					assert.ok(oContent, "ValueHelpPanel has table assigned");
					assert.equal(oContent.getId(), "DC2", "Content ID");
				}
				oFieldHelp.close();
				setTimeout( function(){
					oMyContent.destroy();
					fnDone();
				}, iDialogDuration); // to wait until dialog is closed
			}, iDialogDuration); // to wait until dialog is open
		});

	});

	QUnit.test("toggleOpen in dialog", function(assert) {

		oFieldHelp.toggleOpen(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
        function (Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			var oDialog = oFieldHelp.getAggregation("_dialog");
			if (oDialog) {
				assert.equal(iOpen, 1, "Open event fired");
				assert.notOk(bOpenSuggest, "Open not as suggestion");
				setTimeout( function(){
					assert.ok(oDialog.isOpen(), "Dialog is open");
					oFieldHelp.toggleOpen(false);
					setTimeout( function(){
						assert.notOk(oDialog.isOpen(), "Dialog is not open");
						fnDone();
					}, iDialogDuration); // to wait until dialog is closed
				}, iDialogDuration); // to wait until dialog is open
			} else {
				fnDone();
			}
		});

	});

	QUnit.test("open dialog while suggestion is open", function(assert) {

		oFieldHelp.open(true);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover", "sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
				function (Popover, Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			var oPopover = oFieldHelp.getAggregation("_popover");
			assert.ok(oPopover, "Popover created");
			if (oPopover) {
				setTimeout( function(){
					assert.ok(oPopover.isOpen(), "Popover is open");
					oFieldHelp.open(false);
					setTimeout( function(){
						var oDialog = oFieldHelp.getAggregation("_dialog");
						if (oDialog) {
							assert.equal(iOpen, 2, "Open event fired");
							assert.notOk(bOpenSuggest, "Open not as suggestion");
							assert.ok(oDialog.isOpen(), "Dialog is open");
							assert.notOk(oPopover.isOpen(), "Popover is not open");
							oFieldHelp.close(false);
							setTimeout( function(){
								fnDone();
							}, iDialogDuration); // to wait until dialog is closed
						}
					}, iPopoverDuration); // to wait until dialog is open and popover is closed
				}, iPopoverDuration); // to wait until popover is open
			} else {
				fnDone();
			}
		});

	});

	QUnit.test("DefineConditionPanel in dialog", function(assert) {

		oFieldHelp.connect(oField2);
		oFieldHelp.setShowConditionPanel(true);
		oFieldHelp.open(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
				function (Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			var oDialog = oFieldHelp.getAggregation("_dialog");
			if (oDialog) {
				var oVHP = oDialog.getContent()[0];
				assert.ok(oVHP, "Dialog has content");
				assert.ok(oVHP && oVHP.isA("sap.ui.mdc.field.ValueHelpPanel"), "content is ValueHelpPanel");
				var oContent = oVHP.getTable();
				assert.ok(oContent, "ValueHelpPanel has table assigned");
				assert.ok(oVHP._oDefineConditionPanel, "DefineConditionPanel assigned");
				var aButtons = oDialog.getButtons();
				assert.equal(aButtons.length, 2, "Dialog has 2 Buttons");
			}
			fnDone();
		});

	});

	QUnit.test("DefineConditionPanel without table in dialog", function(assert) {

		oFieldHelp.connect(oField2);
		oFieldHelp.setContent();
		oFieldHelp.setShowConditionPanel(true);
		oFieldHelp.open(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
				function (Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			var oDialog = oFieldHelp.getAggregation("_dialog");
			if (oDialog) {
				var oVHP = oDialog.getContent()[0];
				assert.ok(oVHP, "Dialog has content");
				assert.ok(oVHP && oVHP.isA("sap.ui.mdc.field.ValueHelpPanel"), "content is ValueHelpPanel");
				var oContent = oVHP.getTable();
				assert.notOk(oContent, "ValueHelpPanel has no content assigned");
				assert.ok(oVHP._oDefineConditionPanel, "DefineConditionPanel assigned");
				var aButtons = oDialog.getButtons();
				assert.equal(aButtons.length, 2, "Dialog has 2 Buttons");
			}
			fnDone();
		});

	});

	QUnit.test("DefineConditionPanel for singleSelect fields in dialog", function(assert) {

		oFieldHelp.setShowConditionPanel(true);
		oFieldHelp.open(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
				function (Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			var oDialog = oFieldHelp.getAggregation("_dialog");
			if (oDialog) {
				var oVHP = oDialog.getContent()[0];
				assert.ok(oVHP, "Dialog has content");
				assert.ok(oVHP && oVHP.isA("sap.ui.mdc.field.ValueHelpPanel"), "content is ValueHelpPanel");
				var oContent = oVHP.getTable();
				assert.ok(oContent, "ValueHelpPanel has content assigned");
				assert.equal(oContent.getId(), "DC1", "Content ID");
				assert.notOk(oVHP._oDefineConditionPanel, "no DefineConditionPanel");
				var aButtons = oDialog.getButtons();
				assert.equal(aButtons.length, 2, "Dialog has 2 Buttons");
			}
			fnDone();
		});

	});

	QUnit.test("title in dialog", function(assert) {

		oFieldHelp.setTitle("Title");
		oFieldHelp.open(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
				function (Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			var oDialog = oFieldHelp.getAggregation("_dialog");
			if (oDialog) {
				assert.equal(oDialog.getTitle(), "Title", "Dialog title");
				oFieldHelp.setTitle("Title1");
				assert.equal(oDialog.getTitle(), "Title1", "Dialog title");
			}
			fnDone();
		});

	});

	QUnit.test("selected item in dialog", function(assert) {

		oFieldHelp.setConditions([Condition.createCondition("EEQ", ["I2", "Item 2"])]);

		oFieldHelp.open(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
				function (Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			var oDialog = oFieldHelp.getAggregation("_dialog");
			if (oDialog) {
				var aItems = oWrapper.getSelectedItems();
				assert.equal(aItems.length, 1, "Wrapper: one selected item");
				assert.equal(aItems[0].key, "I2", "Item key");
				oFieldHelp.setConditions([Condition.createCondition("EEQ", ["I3", "Item 3"])]);
				aItems = oWrapper.getSelectedItems();
				assert.equal(aItems.length, 1, "Wrapper: one selected item");
				assert.equal(aItems[0].key, "I3", "Item key");
				fnDone();
			} else {
				fnDone();
			}
		});

	});

	QUnit.test("select item in dialog", function(assert) {

		oFieldHelp.setConditions([Condition.createCondition("EEQ", ["I1", "Item 1"])]);
		oFieldHelp.open(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
				function (Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			var oDialog = oFieldHelp.getAggregation("_dialog");
			if (oDialog) {
				setTimeout( function(){
					oWrapper.fireSelectionChange({selectedItems: [{key: "I2", description: "Item 2"}]});
					assert.equal(iSelect, 0, "Select event not fired");

					var oValueHelpPanel = oDialog.getContent()[0];
					assert.notOk(oValueHelpPanel.getShowTokenizer(), "no Tokenizer shown");

					var aButtons = oDialog.getButtons();
					aButtons[0].firePress(); // simulate button press

					setTimeout( function(){
						assert.equal(iSelect, 1, "Select event fired after OK");
						assert.equal(aSelectConditions.length, 1, "one condition returned");
						assert.equal(aSelectConditions[0].operator, "EEQ", "Condition operator");
						assert.equal(aSelectConditions[0].values[0], "I2", "Condition values[0}");
						assert.equal(aSelectConditions[0].values[1], "Item 2", "Condition values[1}");
						assert.notOk(aSelectConditions[0].inParameters, "Condition no in-parameters");
						assert.notOk(aSelectConditions[0].outParameters, "Condition no out-parameters");
						assert.notOk(bSelectAdd, "Items should not be added");
						assert.notOk(oDialog.isOpen(), "Field help closed");
						var aConditions = oFieldHelp.getConditions();
						assert.equal(aConditions.length, 1, "one condition set");
						assert.equal(aConditions[0].operator, "EEQ", "Condition operator");
						assert.equal(aConditions[0].values[0], "I2", "Condition values[0}");
						assert.equal(aConditions[0].values[1], "Item 2", "Condition values[1}");
						assert.notOk(aConditions[0].inParameters, "Condition no in-parameters");
						assert.notOk(aConditions[0].outParameters, "Condition no out-parameters");
						fnDone();
					}, iDialogDuration); // wait until dialog is closed
				}, iDialogDuration); // to wait until dialog is open
			} else {
				fnDone();
			}
		});

	});

	QUnit.test("select item in dialog using out-parameters", function(assert) {

		oFieldHelp.addInParameter(new InParameter({value: "{testIn}", helpPath: "myTestIn"}));
		oFieldHelp.addOutParameter(new OutParameter({value: "{testOut}", helpPath: "myTestOut"}));
		var oCondition = Condition.createCondition("EEQ", ["I1", "Item 1"], {test: "X"});
		oFieldHelp.setConditions([oCondition]);
		oFieldHelp.open(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
				function (Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			var oDialog = oFieldHelp.getAggregation("_dialog");
			if (oDialog) {
				setTimeout( function(){
					oWrapper.fireSelectionChange({selectedItems: [{key: "I2", description: "Item 2", inParameters: {myTestIn: "X"}, outParameters: {myTestOut: "Y"}}]});

					var aButtons = oDialog.getButtons();
					aButtons[0].firePress(); // simulate button press

					setTimeout( function(){
						assert.equal(iSelect, 1, "Select event fired after OK");
						assert.equal(aSelectConditions.length, 1, "one condition returned");
						assert.equal(aSelectConditions[0].operator, "EEQ", "Condition operator");
						assert.equal(aSelectConditions[0].values[0], "I2", "Condition values[0}");
						assert.equal(aSelectConditions[0].values[1], "Item 2", "Condition values[1}");
						assert.ok(aSelectConditions[0].inParameters, "Condition in-parameters set");
						assert.ok(aSelectConditions[0].inParameters && aSelectConditions[0].inParameters.hasOwnProperty("testIn"), "Condition in-parameters has 'testIn'");
						assert.equal(aSelectConditions[0].inParameters && aSelectConditions[0].inParameters.testIn, "X", "Condition in-parameters 'testIn'");
						assert.ok(aSelectConditions[0].outParameters, "Condition out-parameters set");
						assert.ok(aSelectConditions[0].outParameters && aSelectConditions[0].outParameters.hasOwnProperty("testOut"), "Condition out-parameters has 'testOut'");
						assert.equal(aSelectConditions[0].outParameters && aSelectConditions[0].outParameters.testOut, "Y", "Condition out-parameters 'testOut'");
						assert.notOk(bSelectAdd, "Items should not be added");
						assert.notOk(oDialog.isOpen(), "Field help closed");
						var aConditions = oFieldHelp.getConditions();
						assert.equal(aConditions.length, 1, "one condition set");
						assert.equal(aConditions[0].operator, "EEQ", "Condition operator");
						assert.equal(aConditions[0].values[0], "I2", "Condition values[0}");
						assert.equal(aConditions[0].values[1], "Item 2", "Condition values[1}");
						assert.ok(aConditions[0].inParameters, "Condition in-parameters set");
						assert.ok(aConditions[0].inParameters && aConditions[0].inParameters.hasOwnProperty("testIn"), "Condition in-parameters has 'testIn'");
						assert.equal(aConditions[0].inParameters && aConditions[0].inParameters.testIn, "X", "Condition in-parameters 'testIn'");
						assert.ok(aConditions[0].outParameters, "Condition out-parameters set");
						assert.ok(aConditions[0].outParameters && aConditions[0].outParameters.hasOwnProperty("testOut"), "Condition out-parameters has 'testOut'");
						assert.equal(aConditions[0].outParameters && aConditions[0].outParameters.testOut, "Y", "Condition out-parameters 'testOut'");
						fnDone();
					}, iDialogDuration); // wait until dialog is closed
				}, iDialogDuration); // to wait until dialog is open
			} else {
				fnDone();
			}
		});

	});

	QUnit.test("select more items in dialog", function(assert) {

		oFieldHelp.connect(oField2);
		oFieldHelp.setConditions([Condition.createCondition("EEQ", ["I1", "Item 1"]),
		                          Condition.createCondition("StartsWith", ["X"])]);
		oFieldHelp.open(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
				function (Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			var oDialog = oFieldHelp.getAggregation("_dialog");
			if (oDialog) {
				setTimeout( function(){
					oWrapper.fireSelectionChange({selectedItems: [{key: "I1", description: "Item 1"}, {key: "I2", description: "Item 2"}]});
					assert.equal(iSelect, 0, "Select event not fired");

					var oValueHelpPanel = oDialog.getContent()[0];
					assert.ok(oValueHelpPanel.getShowTokenizer(), "Tokenizer shown");

					var aButtons = oDialog.getButtons();
					aButtons[0].firePress(); // simulate button press

					setTimeout( function(){
						assert.equal(iSelect, 1, "Select event fired after OK");
						assert.equal(aSelectConditions.length, 3, "three conditions returned");
						assert.equal(aSelectConditions[0].operator, "EEQ", "Condition operator");
						assert.equal(aSelectConditions[0].values[0], "I1", "Condition values[0}");
						assert.equal(aSelectConditions[0].values[1], "Item 1", "Condition values[1}");
						assert.equal(aSelectConditions[1].operator, "StartsWith", "Condition operator");
						assert.equal(aSelectConditions[1].values[0], "X", "Condition values[0}");
						assert.equal(aSelectConditions[2].operator, "EEQ", "Condition operator");
						assert.equal(aSelectConditions[2].values[0], "I2", "Condition values[0}");
						assert.equal(aSelectConditions[2].values[1], "Item 2", "Condition values[1}");
						assert.notOk(bSelectAdd, "Items should not be added");
						assert.notOk(oDialog.isOpen(), "Field help closed");
						var aConditions = oFieldHelp.getConditions();
						assert.equal(aConditions.length, 3, "3 conditions set");
						assert.equal(aConditions[0].operator, "EEQ", "Condition operator");
						assert.equal(aConditions[0].values[0], "I1", "Condition values[0}");
						assert.equal(aConditions[0].values[1], "Item 1", "Condition values[1}");
						assert.equal(aConditions[1].operator, "StartsWith", "Condition operator");
						assert.equal(aConditions[1].values[0], "X", "Condition values[0}");
						assert.equal(aConditions[2].operator, "EEQ", "Condition operator");
						assert.equal(aConditions[2].values[0], "I2", "Condition values[0}");
						assert.equal(aConditions[2].values[1], "Item 2", "Condition values[1}");
						fnDone();
					}, iDialogDuration); // wait until dialog is closed
				}, iDialogDuration); // to wait until dialog is open
			} else {
				fnDone();
			}
		});

	});

	QUnit.test("select more items in dialog with maxConditions", function(assert) {

		oField2.getMaxConditions = function() {return 2;};
		oFieldHelp.connect(oField2);
		oFieldHelp.setConditions([Condition.createCondition("EEQ", ["I1", "Item 1"])]);
		oFieldHelp.open(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
				function (Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			var oDialog = oFieldHelp.getAggregation("_dialog");
			if (oDialog) {
				setTimeout( function(){
					oWrapper.fireSelectionChange({selectedItems: [{key: "I1", description: "Item 1"}, {key: "I2", description: "Item 2"}, {key: "I3", description: "Item 3"}]});

					var aButtons = oDialog.getButtons();
					aButtons[0].firePress(); // simulate button press

					var aConditions = oFieldHelp.getConditions();
					assert.equal(aConditions.length, 2, "2 conditions set");
					assert.equal(aConditions[0].operator, "EEQ", "Condition operator");
					assert.equal(aConditions[0].values[0], "I2", "Condition values[0}");
					assert.equal(aConditions[0].values[1], "Item 2", "Condition values[1}");
					assert.equal(aConditions[1].operator, "EEQ", "Condition operator");
					assert.equal(aConditions[1].values[0], "I3", "Condition values[0}");
					assert.equal(aConditions[1].values[1], "Item 3", "Condition values[1}");

					setTimeout( function(){
						assert.equal(iSelect, 1, "Select event fired after OK");
						assert.equal(aSelectConditions.length, 2, "2 conditions returned");
						assert.equal(aSelectConditions[0].operator, "EEQ", "Condition operator");
						assert.equal(aSelectConditions[0].values[0], "I2", "Condition values[0}");
						assert.equal(aSelectConditions[0].values[1], "Item 2", "Condition values[1}");
						assert.equal(aSelectConditions[1].operator, "EEQ", "Condition operator");
						assert.equal(aSelectConditions[1].values[0], "I3", "Condition values[0}");
						assert.equal(aSelectConditions[1].values[1], "Item 3", "Condition values[1}");
						assert.notOk(bSelectAdd, "Items should not be added");
						assert.notOk(oDialog.isOpen(), "Field help closed");
						fnDone();
					}, iDialogDuration); // wait until dialog is closed
				}, iDialogDuration); // to wait until dialog is open
			} else {
				fnDone();
			}
		});

	});

	QUnit.test("cancel dialog", function(assert) {

		oFieldHelp.open(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
				function (Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			var oDialog = oFieldHelp.getAggregation("_dialog");
			if (oDialog) {
				setTimeout( function(){
					oWrapper.fireSelectionChange({selectedItems: [{key: "I2", description: "Item 2"}]});
					assert.equal(iSelect, 0, "Select event not fired");

					var aButtons = oDialog.getButtons();
					aButtons[1].firePress(); // simulate button press
					setTimeout( function(){
						assert.equal(iSelect, 0, "Select event not fired after Cancel");
						var aConditions = oFieldHelp.getConditions();
						assert.equal(aConditions.length, 0, "no conditions set");
						assert.notOk(oDialog.isOpen(), "Field help closed");
						fnDone();
					}, iDialogDuration); // wait until dialog is closed
				}, iDialogDuration); // to wait until dialog is open
			} else {
				fnDone();
			}
		});

	});

	QUnit.test("search in Dialog", function(assert) {

		oFieldHelp.open(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
				function (Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			var oDialog = oFieldHelp.getAggregation("_dialog");
			if (oDialog) {
				setTimeout( function(){
					var oVHP = oDialog.getContent()[0];
					assert.ok(oVHP.getSearchEnabled(), "Search is enabled");
					assert.ok(oVHP.getBinding("filterConditions"), "FilterConditions bound");
					var oSearchFilterField = oVHP.byId("SearchField");
					var oSearchField = oSearchFilterField.getAggregation("_content")[0];
					qutils.triggerCharacterInput(oSearchField.getFocusDomRef(), "-" );
					oSearchField.setValue("-"); // as onInput SearchField sets it's value
					qutils.triggerKeydown(oSearchField.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
					qutils.triggerKeyup(oSearchField.getFocusDomRef().id, jQuery.sap.KeyCodes.ENTER, false, false, false);
					setTimeout( function(){
						assert.ok(oWrapper.getFilterEnabled.called, "Wrapper.getFilterEnabled is called");
						assert.notOk(oWrapper.getListBinding.called, "Wrapper.getListBinding is not called");
						var oCheckFilters = {text: [{operator: "Contains", value: "-", value2: undefined}], additionalText: [{operator: "Contains", value: "-", value2: undefined}]};
						assert.deepEqual(oFilters, oCheckFilters, "Filters used");
						oFieldHelp.close();
						setTimeout( function(){
							assert.ok(oWrapper.fieldHelpClose.called, "fieldHelpClose of Wrapper called");
							assert.notOk(oVHP.getBinding("filterConditions"), "FilterConditions not bound");
							fnDone();
						}, iDialogDuration); // to wait until dialog is closed
					}, 0); // binding update is async
				}, iDialogDuration); // to wait until popover is open
			} else {
				fnDone();
			}
		});

	});

	QUnit.test("search in Dialog with suspended ListBinding", function(assert) {

		oListBinding.suspend();
		oFieldHelp.open(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
				function (Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			var oDialog = oFieldHelp.getAggregation("_dialog");
			if (oDialog) {
				setTimeout( function(){
					assert.ok(oListBinding.isSuspended(), "ListBinding suspended after open");

					var oVHP = oDialog.getContent()[0];
					oVHP.fireSearch(); // fake just empty search
					setTimeout( function(){
						assert.notOk(oListBinding.isSuspended(), "ListBinding not suspended after search");
						var aContexts = oListBinding.getContexts();
						assert.equal(aContexts.length, 3, "List has 3 Items");
						oFieldHelp.close();
						setTimeout( function(){
							fnDone();
						}, iDialogDuration); // to wait until dialog is closed
					}, 0); // binding update is async
				}, iDialogDuration); // to wait until popover is open
			} else {
				fnDone();
			}
		});

	});

	QUnit.test("disable search", function(assert) {

		oFieldHelp.setFilterFields("");
		oFieldHelp.open(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
				function (Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			var oDialog = oFieldHelp.getAggregation("_dialog");
			if (oDialog) {
				setTimeout( function(){
					var oVHP = oDialog.getContent()[0];
					assert.notOk(oVHP.getSearchEnabled(), "Search is disabled");
					assert.notOk(oVHP.getBinding("filterConditions"), "FilterConditions not bound");

					oFieldHelp.setFilterFields("*text*");
					assert.ok(oVHP.getSearchEnabled(), "Search is rnabled");
					assert.ok(oVHP.getBinding("filterConditions"), "FilterConditions bound");

					oFieldHelp.setFilterFields("");
					assert.notOk(oVHP.getSearchEnabled(), "Search is disabled");
					assert.notOk(oVHP.getBinding("filterConditions"), "FilterConditions not bound");

					oFieldHelp.close();
					setTimeout( function(){
						fnDone();
					}, iDialogDuration); // to wait until dialog is closed
				}, iDialogDuration); // to wait until popover is open
			} else {
				fnDone();
			}
		});

	});

	QUnit.test("assign wrapper while opening", function(assert) {

		oFieldHelp.setContent();
		oFieldHelp.attachOpen(function(){
			if (!oFieldHelp.getContent()) {
				setTimeout( function(){
					oFieldHelp.setContent(oWrapper);
				}, 0);
			}
		});

		iDataUpdate = 0;
		oFieldHelp.open(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
				function (Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			setTimeout( function(){
				var oDialog = oFieldHelp.getAggregation("_dialog");
				if (oDialog) {
					assert.ok(oDialog.isOpen(), "Dialog is open");
					assert.ok(oWrapper.fieldHelpOpen.calledWith(false), "fieldHelpOpen of Wrapper called");
					assert.ok(oWrapper.getDialogContent.called, "Wrapper.getDialogContent is called");
					var oVHP = oDialog.getContent()[0];
					var oContent = oVHP.getTable();
					assert.ok(oContent, "ValueHelpPanel has table assigned");
					assert.equal(oContent.getId(), "DC1", "Content ID");
					assert.equal(iDataUpdate, 1, "DataUpdate event fired");
				}
				oFieldHelp.close();
				setTimeout( function(){
							fnDone();
				}, iDialogDuration); // to wait until dialog is closed
			}, iDialogDuration); // to wait until dialog is open
		});

	});

	var oFilterBar;
	var oFilterField;

	QUnit.module("FilterBar", {
		beforeEach: function() {
			_initFieldHelp();

			oFilterField = new FilterField("MyFilterField", {
				label: "Label",
				conditions: "{$filters>/conditions/additionalText}"
			});

			oFilterBar = new FilterBar("MyFilterBar", {
				liveMode: false,
				filterItems: [oFilterField]
			});

			oFieldHelp.setFilterBar(oFilterBar);
		},
		afterEach: function() {
			_teardown();
			oFilterBar = undefined; // destroyed vis FieldHelp
			oFilterField = undefined; // destroyed via FilterBar
		}
	});

	QUnit.test("FilterBar shown in dialog", function(assert) {

		oFieldHelp.open(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
				function (Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			var oDialog = oFieldHelp.getAggregation("_dialog");
			setTimeout( function(){
				var oVHP = oDialog.getContent()[0];
				assert.ok(oVHP.getShowFilterbar(), "ValueHelpPanel showFilterbar");
				assert.ok(oVHP._oFilterbar, "ValueHelpPanel FilterBar used");
				assert.ok(oFilterBar.getDomRef(), "FilterBar rendered");

				oFilterField.setConditions([Condition.createCondition("Contains", ["2"])]); // fake change
				setTimeout( function(){ // update binding (FilterBar)
					setTimeout( function(){ // update binding (FilterConditionModel) - to check no live update
						oFilterBar.fireSearch(); // fake "Go"
						setTimeout( function(){ // update binding (FilterConditionModel)
							var oCheckFilters = {additionalText: [{operator: "Contains", value: "2", value2: undefined}]};
							assert.deepEqual(oFilters, oCheckFilters, "Filters used");

							oFieldHelp.close();
							setTimeout( function(){
								fnDone();
							}, iDialogDuration); // to wait until dialog is closed
						}, 0);
					}, 0);
				}, 0);
			}, iDialogDuration); // to wait until dialog is open
		});

	});

	QUnit.test("FilterBar and in-parameter", function(assert) {

		oFieldHelp.addInParameter( new InParameter({ value: "Text 2", helpPath: "additionalText"}));
		oFieldHelp.open(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
				function (Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			var oDialog = oFieldHelp.getAggregation("_dialog");
			setTimeout( function(){
				var oVHP = oDialog.getContent()[0];
				assert.ok(oVHP.getShowFilterbar(), "ValueHelpPanel showFilterbar");
				assert.ok(oVHP._oFilterbar, "ValueHelpPanel FilterBar used");
				assert.ok(oFilterBar.getDomRef(), "FilterBar rendered");
				var aConditions = oFilterField.getConditions();
				assert.equal(aConditions.length, 1, "One condition in FilterField");
				assert.equal(aConditions[0].operator, "EEQ", "Operator of Condition");
				assert.equal(aConditions[0].values[0], "Text 2", "Value of Condition");

				oFilterField.setConditions([]); // fake change
				oFilterBar.fireSearch(); // fake "Go"
				setTimeout( function(){ // update binding (FilterBar)
					setTimeout( function(){ // update binding (FilterConditionModel)
						var aContexts = oListBinding.getContexts();
						assert.equal(aContexts.length, 3, "List has 3 Items after update");

						oFieldHelp.close();
						setTimeout( function(){
							fnDone();
						}, iDialogDuration); // to wait until dialog is closed
					}, 0);
				}, 0);
			}, iDialogDuration); // to wait until dialog is open
		});

	});

	QUnit.test("FilterBar and in-parameter as condition", function(assert) {

		var oInParameter = new InParameter({value: [Condition.createCondition("EQ", ["Text 2"])], helpPath: "additionalText"});
		oFieldHelp.addInParameter(oInParameter);
		oFieldHelp.open(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
				function (Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			var oDialog = oFieldHelp.getAggregation("_dialog");
			setTimeout( function(){
				var oVHP = oDialog.getContent()[0];
				assert.ok(oVHP.getShowFilterbar(), "ValueHelpPanel showFilterbar");
				assert.ok(oVHP._oFilterbar, "ValueHelpPanel FilterBar used");
				assert.ok(oFilterBar.getDomRef(), "FilterBar rendered");
				var aConditions = oFilterField.getConditions();
				assert.equal(aConditions.length, 1, "One condition in FilterField");
				assert.equal(aConditions[0].operator, "EQ", "Operator of Condition");
				assert.equal(aConditions[0].values[0], "Text 2", "Value of Condition");

				oInParameter.destroy();
				setTimeout( function(){ // update binding (FilterBar)
					setTimeout( function(){ // update binding (FilterConditionModel)
						aConditions = oFilterField.getConditions();
						assert.equal(aConditions.length, 0, "mo condition in FilterField");
						var aContexts = oListBinding.getContexts();
						assert.equal(aContexts.length, 3, "List has 3 Items after update");

						oFieldHelp.close();
						setTimeout( function(){
							fnDone();
						}, iDialogDuration); // to wait until dialog is closed
					}, 0);
				}, 0);
			}, iDialogDuration); // to wait until dialog is open
		});

	});

	QUnit.test("FilterBar after open and in-parameter", function(assert) {

		oFieldHelp.setFilterBar();
		oFieldHelp.addInParameter( new InParameter({ value: "Text 2", helpPath: "additionalText"}));
		oFieldHelp.open(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
				function (Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			var oDialog = oFieldHelp.getAggregation("_dialog");
			setTimeout( function(){
				oFieldHelp.setFilterBar(oFilterBar);
				setTimeout( function(){ // update binding (FilterBar)
					setTimeout( function(){ // update binding (FilterConditionModel)
						sap.ui.getCore().applyChanges();
						var oVHP = oDialog.getContent()[0];
						assert.ok(oVHP.getShowFilterbar(), "ValueHelpPanel showFilterbar");
						assert.ok(oVHP._oFilterbar, "ValueHelpPanel FilterBar used");
						assert.ok(oFilterBar.getDomRef(), "FilterBar rendered");
						var aConditions = oFilterField.getConditions();
						assert.equal(aConditions.length, 1, "One condition in FilterField");
						assert.equal(aConditions[0].operator, "EEQ", "Operator of Condition");
						assert.equal(aConditions[0].values[0], "Text 2", "Value of Condition");
						oFieldHelp.close();
						setTimeout( function(){
							fnDone();
						}, iDialogDuration); // to wait until dialog is closed
					}, 0);
				}, 0);
			}, iDialogDuration); // to wait until dialog is open
		});

	});

	QUnit.test("FilterBar in suggestion", function(assert) {

		oFilterField.setConditions([Condition.createCondition("Contains", ["2"])]);
		oFieldHelp.open(true);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Popover"], function (Popover) {
			setTimeout( function(){
				var aContexts = oListBinding.getContexts();
				assert.equal(aContexts.length, 3, "List has 3 Items");

				oFieldHelp.close();
				setTimeout( function(){
					fnDone();
				}, iPopoverDuration); // to wait until popover is closed
			}, iPopoverDuration); // to wait until popover is open
		});

	});

	QUnit.test("FilterBar in suggestion after dialog", function(assert) {

		oWrapper.getAsyncKeyText = function() {return true;}; // to fake async support
		oFilterField.setConditions([Condition.createCondition("Contains", ["2"])]);
		oFieldHelp.open(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel", "sap/m/Popover"],
				function (Dialog, Button, ValueHelpPanel, DefineConditionPanel, Popover) {
			setTimeout( function(){
				setTimeout( function(){ // update binding (FilterBar)
					setTimeout( function(){ // update binding (FilterConditionModel)
						var oCheckFilters = {additionalText: [{operator: "Contains", value: "2", value2: undefined}]};
						assert.deepEqual(oFilters, oCheckFilters, "Filters used");
						oFieldHelp.close();
						setTimeout( function(){
							oFieldHelp.open(true);
							setTimeout( function(){
								assert.deepEqual(oFilters, {}, "no Filters used");

								oFieldHelp.close();
								setTimeout( function(){
									fnDone();
								}, iPopoverDuration); // to wait until popover is closed
							}, iPopoverDuration); // to wait until popover is open
						}, iDialogDuration); // to wait until dialog is closed
					}, 0);
				}, 0);
			}, iDialogDuration); // to wait until dialog is open
		});

	});

	QUnit.test("clone", function(assert) {

		oFilterBar.setLiveMode(true); // to have direct update
		var oClone = oFieldHelp.clone();
		var oCloneFilterBar = oClone.getFilterBar();
		var oCloneFilterField = oCloneFilterBar.getFilterItems()[0];
		var oCloneWrapper = oClone.getContent();
		var oCloneListBinding = oModel.bindList("/items");
		sinon.stub(oCloneWrapper, "getListBinding").returns(oCloneListBinding);
		sinon.stub(oCloneWrapper, "applyFilters").callsFake(_applyFilters);
		oClone.connect(oField2);

		oFieldHelp.open(false);
		oClone.open(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
				function (Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			setTimeout( function(){
				oFilterField.setConditions([Condition.createCondition("Contains", ["2"])]); // fake change
				setTimeout( function(){ // update binding (FilterBar)
					setTimeout( function(){ // update binding (FilterConditionModel)
						var oCheckFilters = {additionalText: [{operator: "Contains", value: "2", value2: undefined}]};
						assert.deepEqual(oFilters, oCheckFilters, "Filters used");
						assert.equal(sWrapperId, "W1", "Wrapper ID for applyFilters");

						oCloneFilterField.setConditions([Condition.createCondition("Contains", ["1"])]); // fake change
						setTimeout( function(){ // update binding (FilterBar)
							setTimeout( function(){ // update binding (FilterConditionModel)
								var oCheckFilters = {additionalText: [{operator: "Contains", value: "1", value2: undefined}]};
								assert.deepEqual(oFilters, oCheckFilters, "Filters used");
								assert.equal(sWrapperId, "W1-__clone0", "Wrapper ID for applyFilters");

								oFieldHelp.close();
								oClone.close();
								setTimeout( function(){
									oCloneListBinding.destroy();
									oClone.destroy();
									fnDone();
								}, iDialogDuration); // to wait until dialog is closed
							}, 0);
						}, 0);
					}, 0);
				}, 0);
			}, iDialogDuration); // to wait until dialog is open
		});

	});

	QUnit.test("FilterBar and suspended ListBinding", function(assert) {

		oListBinding.suspend();
		oFieldHelp.addInParameter( new InParameter({ value: "Text 2", helpPath: "additionalText"}));
		oFieldHelp.open(false);
		var fnDone = assert.async();
		sap.ui.require(["sap/m/Dialog", "sap/m/Button", "sap/ui/mdc/field/ValueHelpPanel", "sap/ui/mdc/field/DefineConditionPanel"],
				function (Dialog, Button, ValueHelpPanel, DefineConditionPanel) {
			setTimeout( function(){
				assert.ok(oListBinding.isSuspended(), "ListBinding still suspended after open");

				oFilterField.setConditions([]); // fake change
				oFilterBar.fireSearch(); // fake "Go"
				setTimeout( function(){ // update binding (FilterBar)
					setTimeout( function(){ // update binding (FilterConditionModel)
						assert.notOk(oListBinding.isSuspended(), "ListBinding not suspended after search event");

						oFieldHelp.close();
						setTimeout( function(){
							fnDone();
						}, iDialogDuration); // to wait until dialog is closed
					}, 0);
				}, 0);
			}, iDialogDuration); // to wait until dialog is open
		});

	});

	function _initBoundFieldHelp() {

		_initFieldHelp();

		oField.bindProperty("src", {path: "icon"});
		var oBindingContext = oModel.getContext("/contexts/0/");
		oField.setBindingContext(oBindingContext);
		oField2.bindProperty("src", {path: "icon"});
		oBindingContext = oModel.getContext("/contexts/1/");
		oField2.setBindingContext(oBindingContext);

	}

	QUnit.module("BindingContext", {
		beforeEach: _initBoundFieldHelp,
		afterEach: _teardown
	});

	QUnit.test("connect", function(assert) {

			var oBindingContext = oField.getBindingContext();
			assert.ok(oFieldHelp.getBindingContext(), "FieldHelp has BindingContext");
			assert.equal(oFieldHelp.getBindingContext(), oBindingContext, "FieldHelp has BindingContext of Field");

			oFieldHelp.connect(oField2);
			oBindingContext = oField2.getBindingContext();
			assert.ok(oFieldHelp.getBindingContext(), "FieldHelp has BindingContext");
			assert.equal(oFieldHelp.getBindingContext(), oBindingContext, "FieldHelp has BindingContext of Field2");

	});

	QUnit.test("context change on open", function(assert) {

		oFieldHelp.connect(oField2);
		var oBindingContext = oModel.getContext("/contexts/2/");
		oField2.setBindingContext(oBindingContext);
		oFieldHelp.open(true);
		assert.ok(oFieldHelp.getBindingContext(), "FieldHelp has BindingContext");
		assert.equal(oFieldHelp.getBindingContext(), oBindingContext, "FieldHelp has BindingContext of Field");

	});

	QUnit.test("getTextForKey", function(assert) {

		oFieldHelp.addOutParameter(new OutParameter({value: "{outParameter}", helpPath: "myTestOut"}));
		oFieldHelp.addInParameter(new InParameter({value: "{inParameter}", helpPath: "myTestIn"}));
		oFieldHelp.getTextForKey("I2");
		assert.ok(oWrapper.getTextForKey.calledWith("I2", {myTestIn: "in1"}), "getTextForKey of Wrapper called with In-Parameter");

		var oBindingContext = oModel.getContext("/contexts/2/");
		oFieldHelp.getTextForKey("I2", undefined, undefined, oBindingContext);
		assert.ok(oWrapper.getTextForKey.calledWith("I2", {myTestIn: "in3"}), "getTextForKey of Wrapper called with In-Parameter");
		assert.equal(oFieldHelp.getBindingContext(), oField.getBindingContext(), "FieldHelp has BindingContext of Field");

	});

	QUnit.test("getKeyForText", function(assert) {

		oFieldHelp.addOutParameter(new OutParameter({value: "{outParameter}", helpPath: "myTestOut"}));
		oFieldHelp.addInParameter(new InParameter({value: "{inParameter}", helpPath: "myTestIn"}));
		oFieldHelp.getKeyForText("Item 2");
		assert.ok(oWrapper.getKeyForText.calledWith("Item 2", {myTestIn: "in1"}), "getKeyForText of Wrapper called");

		var oBindingContext = oModel.getContext("/contexts/2/");
		oFieldHelp.getKeyForText("Item 2", oBindingContext);
		assert.ok(oWrapper.getKeyForText.calledWith("Item 2", {myTestIn: "in3"}), "getKeyForText of Wrapper called");
		assert.equal(oFieldHelp.getBindingContext(), oField.getBindingContext(), "FieldHelp has BindingContext of Field");

	});

	QUnit.test("onFieldChange", function(assert) {

		var oOutParameter = new OutParameter({value: "{outParameter}", helpPath: "myTestOut"});
		oFieldHelp.addOutParameter(oOutParameter);
		var oCondition = Condition.createCondition("EEQ", ["Test", "Test Text"], undefined, {"outParameter": "Test"});
		oFieldHelp.setConditions([oCondition]);

		oFieldHelp.onFieldChange();
		assert.equal(oOutParameter.getValue(), "Test", "Out-parameter updated");
		var oData = oModel.getData();
		assert.equal(oData.contexts[0].outParameter, "Test", "Out-parameter updated in Model");

		oFieldHelp.connect(oField2);
		oCondition = Condition.createCondition("EEQ", ["Test2", "Test Text2"], undefined, {"outParameter": "Test2"});
		oFieldHelp.setConditions([oCondition]);
		assert.equal(oOutParameter.getValue(), "out2", "Out-parameter from right bindingConext");
		oFieldHelp.onFieldChange();
		assert.equal(oOutParameter.getValue(), "Test2", "Out-parameter updated");
		oData = oModel.getData();
		assert.equal(oData.contexts[1].outParameter, "Test2", "Out-parameter updated in Model");

	});

});
