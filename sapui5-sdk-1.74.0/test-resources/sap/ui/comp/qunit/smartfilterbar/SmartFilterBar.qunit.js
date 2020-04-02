/* globals QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/qunit/QUnitUtils", "sap/ui/events/KeyCodes", "sap/ui/comp/smartfilterbar/SmartFilterBar", "sap/ui/comp/smartfilterbar/ControlConfiguration", "sap/ui/comp/smartfilterbar/GroupConfiguration", "sap/ui/comp/smartfilterbar/SelectOption", "sap/ui/comp/filterbar/FilterBar", "sap/ui/comp/filterbar/FilterGroupItem", "sap/m/Input", "sap/m/ComboBox",
	"sap/m/CheckBox", "sap/m/TimePicker", "sap/m/DateTimePicker", "sap/ui/core/ValueState", "sap/ui/model/json/JSONModel", "sap/ui/model/json/JSONPropertyBinding", "sap/m/DatePicker", "sap/m/SearchField", "sap/m/MessageBox", "sap/m/DateRangeSelection", "sap/m/MultiInput", "sap/m/Select", 'sap/ui/core/Item'
], function(qutils, KeyCodes, SmartFilterBar, ControlConfiguration, GroupConfiguration, SelectOption, FilterBar, FilterGroupItem, Input, ComboBox,
            CheckBox, TimePicker, DateTimePicker, ValueState, JSONModel, JSONPropertyBinding, DatePicker, SearchField, MessageBox, DateRangeSelection, MultiInput, Select, Item) {
	"use strict";

	QUnit.module("sap.ui.comp.smartfilterbar.SmartFilterBar", {
		beforeEach: function() {
			this.oSmartFilter = new SmartFilterBar();
		},
		afterEach: function() {
			this.oSmartFilter.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oSmartFilter);
	});

	QUnit.test("Shall have entitySet property", function(assert) {
		this.oSmartFilter.setEntitySet("foo");
		assert.strictEqual(this.oSmartFilter.getEntitySet(), "foo");
	});

	QUnit.test("Shall have entityType property", function(assert) {
		this.oSmartFilter.setEntityType("foo");
		assert.strictEqual(this.oSmartFilter.getEntityType(), "foo");
	});

	QUnit.test("Shall have resourceUri property", function(assert) {
		this.oSmartFilter.setResourceUri("foo");
		assert.strictEqual(this.oSmartFilter.getResourceUri(), "foo");
	});

	QUnit.test("Shall have getFilters method", function(assert) {
		var aFilters = this.oSmartFilter.getFilters();
		assert.strictEqual(aFilters.length, 0);
	});

	QUnit.test("Shall delegate getFilters call to FilterProvider", function(assert) {
		var aVisibleFields = [
			"Company", "foo", "bar"
		];
		var aRequestedFields = [
			"foo", "Ledger"
		];
		var fVisibleFieldStub = sinon.stub(this.oSmartFilter, "_getVisibleFieldNames");
		fVisibleFieldStub.returns(aVisibleFields);
		this.oSmartFilter._oFilterProvider = {
			getFilters: sinon.stub(),
			getAnalyticParameters: sinon.stub().returns([])
		};

		this.oSmartFilter.getFilters();
		assert.strictEqual(this.oSmartFilter._oFilterProvider.getFilters.calledOnce, true);
		assert.strictEqual(this.oSmartFilter._oFilterProvider.getFilters.calledWithExactly(aVisibleFields), true);

		this.oSmartFilter._oFilterProvider.getFilters.reset();

		this.oSmartFilter.getFilters(aRequestedFields);
		assert.strictEqual(this.oSmartFilter._oFilterProvider.getFilters.calledOnce, true);
		assert.strictEqual(this.oSmartFilter._oFilterProvider.getFilters.calledWithExactly(aRequestedFields), true);

		this.oSmartFilter._oFilterProvider = null;
	});

	QUnit.test("Shall delegate getFilledFilterData method to FilterProvider by default", function(assert) {
		this.oSmartFilter._oFilterProvider = {
			getFilterData: sinon.stub(),
			getFilledFilterData: sinon.stub()
		};
		this.oSmartFilter.getFilterData();
		assert.strictEqual(this.oSmartFilter._oFilterProvider.getFilterData.calledOnce, false);
		assert.strictEqual(this.oSmartFilter._oFilterProvider.getFilledFilterData.calledOnce, true);
		this.oSmartFilter._oFilterProvider = null;
	});

	QUnit.test("Shall delegate getFilterDataAsString method to FilterProvider by default", function(assert) {
		this.oSmartFilter._oFilterProvider = {
			getFilterDataAsString: sinon.stub(),
			getFilledFilterDataAsString: sinon.stub()
		};
		this.oSmartFilter.getFilterDataAsString();
		assert.strictEqual(this.oSmartFilter._oFilterProvider.getFilterDataAsString.calledOnce, false);
		assert.strictEqual(this.oSmartFilter._oFilterProvider.getFilledFilterDataAsString.calledOnce, true);
		this.oSmartFilter._oFilterProvider = null;
	});

	QUnit.test("Shall delegate getFilterData method to FilterProvider if true is passed", function(assert) {
		this.oSmartFilter._oFilterProvider = {
			getFilterData: sinon.stub(),
			getFilledFilterData: sinon.stub()
		};
		this.oSmartFilter.getFilterData(true);
		assert.strictEqual(this.oSmartFilter._oFilterProvider.getFilterData.calledOnce, true);
		assert.strictEqual(this.oSmartFilter._oFilterProvider.getFilledFilterData.calledOnce, false);
		this.oSmartFilter._oFilterProvider = null;
	});

	QUnit.test("Shall delegate getFilterDataAsString method to FilterProvider if true is passed", function(assert) {
		this.oSmartFilter._oFilterProvider = {
			getFilterDataAsString: sinon.stub(),
			getFilledFilterDataAsString: sinon.stub()
		};
		this.oSmartFilter.getFilterDataAsString(true);
		assert.strictEqual(this.oSmartFilter._oFilterProvider.getFilterDataAsString.calledOnce, true);
		assert.strictEqual(this.oSmartFilter._oFilterProvider.getFilledFilterDataAsString.calledOnce, false);
		this.oSmartFilter._oFilterProvider = null;
	});

	QUnit.test("Shall delegate setFilterData method to FilterProvider", function(assert) {
		var oObj = {
			foo: "bar"
		};
		this.oSmartFilter._oFilterProvider = {
			setFilterData: sinon.stub()
		};
		this.oSmartFilter.setFilterData(oObj);
		assert.strictEqual(this.oSmartFilter._oFilterProvider.setFilterData.calledOnce, true);
		assert.strictEqual(this.oSmartFilter._oFilterProvider.setFilterData.calledWith(oObj), true);
		this.oSmartFilter._oFilterProvider = null;
	});

	QUnit.test("Shall delegate setFilterDataAsString method to FilterProvider", function(assert) {
		var sObj = "{\"foo\":\"bar\"}";
		this.oSmartFilter._oFilterProvider = {
			setFilterData: sinon.stub()
		};
		this.oSmartFilter.setFilterDataAsString(sObj);
		assert.strictEqual(this.oSmartFilter._oFilterProvider.setFilterData.calledOnce, true);
		assert.strictEqual(JSON.stringify(this.oSmartFilter._oFilterProvider.setFilterData.args[0][0]), sObj);
		this.oSmartFilter._oFilterProvider = null;
	});

	QUnit.test("Destroy", function(assert) {
		assert.equal(this.oSmartFilter.bIsDestroyed, undefined);
		this.oSmartFilter.destroy();
		assert.equal(this.oSmartFilter._oFilterProvider, null);
		assert.equal(this.oSmartFilter._aFilterBarViewMetadata, null);
		assert.strictEqual(this.oSmartFilter.bIsDestroyed, true);
	});

	// QUnit.test("Shall clear all fields and fire an event when the user clicks on the reset button", function(assert) {
	// var fEventHandler;

	// fEventHandler = sinon.stub();
	// this.oSmartFilter.attachReset(fEventHandler)
	// sinon.spy(this.oSmartFilter,"_resetFilterFields")
	// this.oSmartFilter._oFilterProvider = {reset:sinon.stub()};

	// //Call CUT
	// this.oSmartFilter.reset();

	// assert.ok(this.oSmartFilter._resetFilterFields.calledOnce);
	// assert.ok(this.oSmartFilter._oFilterProvider.reset.calledOnce);
	// assert.ok(fEventHandler.calledOnce);
	// });

	QUnit.test("Shall pass the BasicSearchFieldName to the FilterProvider", function(assert) {

		sinon.stub(this.oSmartFilter, "_initializeVariantManagement");
		sinon.stub(this.oSmartFilter, "getModel");

		this.oSmartFilter.getModel.returns({
			getMetaModel: function() {
				return null;
			}
		});

		this.oSmartFilter.setBasicSearchFieldName("CompanyCode");

		// Call CUT
		var done = assert.async();
		this.oSmartFilter._createFilterProvider(this.oSmartFilter.getModel(), "", "COMPANIES", "").then(function(oFilterProvider) {
			assert.ok(oFilterProvider);
			assert.equal(oFilterProvider._sBasicSearchFieldName, "CompanyCode");
			done();
		});

	});

	QUnit.test("_handleControlConfigurationChanged shall set the visible property of the FilterItem", function(assert) {
		var oControlConfiguration, oFilterItem;
		oControlConfiguration = {
			getVisible: sinon.stub().returns(true),
			getKey: sinon.stub()
		};
		oFilterItem = {
			setVisible: sinon.stub()
		};
		this.oSmartFilter._getFilterItemByName = sinon.stub().returns(oFilterItem);

		// Call CUT
		this.oSmartFilter._handleControlConfigurationChanged({
			getParameter: sinon.stub().returns("visible"),
			oSource: oControlConfiguration
		});

		assert.ok(oFilterItem.setVisible.calledOnce);
		assert.strictEqual(oFilterItem.setVisible.args[0][0], true);
	});

	QUnit.test("_handleControlConfigurationChanged shall set the label property of the FilterItem", function(assert) {
		var oControlConfiguration, oFilterItem;
		oControlConfiguration = {
			getLabel: sinon.stub().returns("HelloWorld"),
			getKey: sinon.stub()
		};
		oFilterItem = {
			setLabel: sinon.stub()
		};
		this.oSmartFilter._getFilterItemByName = sinon.stub().returns(oFilterItem);

		// Call CUT
		this.oSmartFilter._handleControlConfigurationChanged({
			getParameter: sinon.stub().returns("label"),
			oSource: oControlConfiguration
		});

		assert.ok(oFilterItem.setLabel.calledOnce);
		assert.strictEqual(oFilterItem.setLabel.args[0][0], "HelloWorld");
	});

	QUnit.test("_handleControlConfigurationChanged shall set the visibleInAdvancedArea property of the FilterItem", function(assert) {
		var oControlConfiguration, oFilterItem;
		oControlConfiguration = {
			getVisibleInAdvancedArea: sinon.stub().returns(true),
			getKey: sinon.stub()
		};
		oFilterItem = {
			setVisibleInAdvancedArea: sinon.stub()
		};
		this.oSmartFilter._getFilterItemByName = sinon.stub().returns(oFilterItem);

		// Call CUT
		this.oSmartFilter._handleControlConfigurationChanged({
			getParameter: sinon.stub().returns("visibleInAdvancedArea"),
			oSource: oControlConfiguration
		});

		assert.ok(oFilterItem.setVisibleInAdvancedArea.calledOnce);
		assert.strictEqual(oFilterItem.setVisibleInAdvancedArea.args[0][0], true);
	});

	QUnit.test("fireSearch shall call _validateMandatoryFields and show an error message if empty fields exist", function(assert) {
		var sinonClock = sinon.useFakeTimers();

		sinon.stub(this.oSmartFilter, "setFilterBarExpanded");
		this.oSmartFilter._validateMandatoryFields = sinon.stub().returns(false);
		MessageBox.show = sinon.stub();
		this.oSmartFilter.fireEvent = sinon.stub();

		this.oSmartFilter.search();
		sinonClock.tick(SmartFilterBar.LIVE_MODE_INTERVAL);

		assert.strictEqual(this.oSmartFilter._validateMandatoryFields.called, true);
		assert.strictEqual(this.oSmartFilter.fireEvent.called, false);
		assert.strictEqual(MessageBox.show.calledOnce, true);

		this.oSmartFilter._validateMandatoryFields.returns(true);
		MessageBox.show.reset();
		this.oSmartFilter.fireEvent.reset();

		this.oSmartFilter.search();
		sinonClock.tick(SmartFilterBar.LIVE_MODE_INTERVAL);

		assert.strictEqual(this.oSmartFilter._validateMandatoryFields.called, true);
		assert.strictEqual(this.oSmartFilter.fireEvent.calledOnce, true);
		assert.strictEqual(MessageBox.show.called, false);

		sinonClock.restore();
	});

	QUnit.test("_validateMandatoryFields shall return true if no empty mandatory fields exist/default", function(assert) {
		var bContinue = this.oSmartFilter._validateMandatoryFields();

		assert.strictEqual(bContinue, true);
	});

	QUnit.test("_validateMandatoryFields shall return true if no empty mandatory fields (modelled) exist", function(assert) {
		var oData, aFilterItems, bContinue = false;
		oData = {
			foo: "bar"
		};
		aFilterItems = [
			{
				getName: sinon.stub().returns("foo"),
				getKey: sinon.stub(),
				data: sinon.stub().returns(false)
			}
		];
		this.oSmartFilter.getFilterData = sinon.stub().returns(oData);
		this.oSmartFilter.determineMandatoryFilterItems = sinon.stub().returns(aFilterItems);
		this.oSmartFilter.determineControlByFilterItem = sinon.stub().returns(new Input());

		bContinue = this.oSmartFilter._validateMandatoryFields();
		assert.strictEqual(bContinue, true);
	});

	QUnit.test("_validateMandatoryFields shall return true if no empty mandatory fields (custom) exist", function(assert) {
		var oData = {}, aFilterItems, bContinue = false;
		aFilterItems = [
			{
				getName: sinon.stub().returns("foo"),
				getKey: sinon.stub(),
				data: sinon.stub().returns(true)
			}
		];
		this.oSmartFilter.getFilterData = sinon.stub().returns(oData);
		this.oSmartFilter.determineMandatoryFilterItems = sinon.stub().returns(aFilterItems);
		this.oSmartFilter.determineControlByFilterItem = sinon.stub().returns(new Input({
			value: "bar"
		}));

		bContinue = this.oSmartFilter._validateMandatoryFields();
		assert.strictEqual(bContinue, true);
	});

	QUnit.test("_validateMandatoryFields shall return false if an empty mandatory field (modelled) exist", function(assert) {
		var oData, aFilterItems, bContinue = false;
		oData = {
			foo: ""
		};
		aFilterItems = [
			{
				getName: sinon.stub().returns("foo"),
				getKey: sinon.stub(),
				data: sinon.stub().returns(false)
			}
		];
		this.oSmartFilter.getFilterData = sinon.stub().returns(oData);
		this.oSmartFilter.determineMandatoryFilterItems = sinon.stub().returns(aFilterItems);
		this.oSmartFilter.determineControlByFilterItem = sinon.stub().returns(new Input());

		bContinue = this.oSmartFilter._validateMandatoryFields();
		assert.strictEqual(bContinue, false);
	});

	QUnit.test("_validateMandatoryFields shall return false if an empty mandatory field (Custom) exist", function(assert) {
		var oData = {}, aFilterItems, bContinue = false;
		aFilterItems = [
			{
				getName: sinon.stub().returns("foo"),
				getKey: sinon.stub(),
				data: sinon.stub().returns(true)
			}
		];
		this.oSmartFilter.getFilterData = sinon.stub().returns(oData);
		this.oSmartFilter.determineMandatoryFilterItems = sinon.stub().returns(aFilterItems);
		this.oSmartFilter.determineControlByFilterItem = sinon.stub().returns(new Input());

		bContinue = this.oSmartFilter._validateMandatoryFields();
		assert.strictEqual(bContinue, false);
	});

	QUnit.test("check getFiltersWithValues", function(assert) {

		var Control = function() {
			Control.prototype.getValue = function() {
				return "X";
			};
			Control.prototype.data = function(s) {
				return true;
			};
		};

		var FilterItem = function(sName) {
			this.sName = sName;
			FilterItem.prototype.data = function(s) {
				return {};
			};
			FilterItem.prototype.getName = function() {
				return this.sName;
			};
		};

		var aFilterItems = [
			new FilterItem("A"), new FilterItem("B"), new FilterItem("C"), new FilterItem("D")
		];

		var oData = [];
		oData["B"] = "X";

		aFilterItems[2].data = sinon.stub().returns(null);
		aFilterItems[1].data = sinon.stub().returns(null);

		this.oSmartFilter.getAllFilterItems = sinon.stub().returns(aFilterItems);
		this.oSmartFilter.getFilterData = sinon.stub().returns(oData);
		this.oSmartFilter.determineControlByFilterItem = sinon.stub();
		this.oSmartFilter.determineControlByFilterItem.withArgs(aFilterItems[0]).returns(new Control()); // getValue
		this.oSmartFilter.determineControlByFilterItem.withArgs(aFilterItems[1]).returns(new Control()); // odata value
		this.oSmartFilter.determineControlByFilterItem.withArgs(aFilterItems[2]).returns(new Control()); // odata no value
		this.oSmartFilter.determineControlByFilterItem.withArgs(aFilterItems[3]).returns(null); // no control

		var aFiltersWithValues = this.oSmartFilter.getFiltersWithValues();
		assert.ok(aFiltersWithValues);
		assert.equal(aFiltersWithValues.length, 2);
	});

	QUnit.test("check _checkForValues", function(assert) {
		var FilterItem = function(sName) {
			this.sName = sName;
			FilterItem.prototype.data = function(s) {
				return {};
			};
			FilterItem.prototype.getName = function() {
				return this.sName;
			};
		};

		var oFilterItem = new FilterItem("A");
		var oControl = new Input();
		sinon.spy(oControl, 'getValue');

		oControl.data("hasValue", true);
		var bHasValue = this.oSmartFilter._checkForValues({}, oFilterItem, oControl);
		assert.equal(bHasValue, true);

		oControl.data("hasValue", false);
		bHasValue = this.oSmartFilter._checkForValues({}, oFilterItem, oControl);
		assert.equal(bHasValue, false);

		oControl.data("hasValue", null);
		bHasValue = this.oSmartFilter._checkForValues({}, oFilterItem, oControl);
		assert.equal(bHasValue, false); // via getValue
		assert.ok(oControl.getValue.calledOnce);

		oControl.data("hasValue", "false");
		bHasValue = this.oSmartFilter._checkForValues({}, oFilterItem, oControl);
		assert.equal(bHasValue, false);

		oControl.data("hasValue", "true");
		bHasValue = this.oSmartFilter._checkForValues({}, oFilterItem, oControl);
		assert.equal(bHasValue, true);
	});

	QUnit.test("check _checkForValues for Select control; special handling for Edm.Boolean", function(assert) {
		var FilterItem = function(sName) {
			this.sName = sName;
			FilterItem.prototype.data = function(s) {
				return false;
			};
			FilterItem.prototype.getName = function() {
				return this.sName;
			};
		};

		this.oSmartFilter._aFilterBarViewMetadata = [ {groupName: "G1", fields: [ {fieldName: "Bool", type: "Edm.Boolean"}, {fieldName: "String", type: "Edm.String"} ]}];


		var oFilterItem = new FilterItem("Bool");
		var oControl = new Select();
		var oItem = new Item({
			key: "",
			text: ""
		});
		oControl.addItem(oItem);
		oControl.setSelectedItem(oItem);


		var bHasValue = this.oSmartFilter._checkForValues({ String: "BBB"}, oFilterItem, oControl);
		assert.ok(!bHasValue);

		bHasValue = this.oSmartFilter._checkForValues({ Bool: "true", String: "BBB"}, oFilterItem, oControl);
		assert.ok(bHasValue);

		oFilterItem = new FilterItem("String");

		bHasValue = this.oSmartFilter._checkForValues({}, oFilterItem, oControl);
		assert.ok(bHasValue);

		bHasValue = this.oSmartFilter._checkForValues({ Bool: "true", String: "BBB"}, oFilterItem, oControl);
		assert.ok(bHasValue);
	});

	QUnit.test("_checkForValues for MultiInput control when hasValue data is forgotten tries to get value from the tokens", function (assert) {
		// Arrange
		var oFilterItemStub = {
				data: this.stub().withArgs("isCustomField").returns(true)
			},
			oMultiInputStub = {
				data: this.stub().withArgs("hasValue").returns(undefined),
				getTokens: this.stub().returns(["value 1"])
			},
			bResult;

		// Act
		bResult = this.oSmartFilter._checkForValues({}, oFilterItemStub, oMultiInputStub);

		// Assert
		assert.equal(oMultiInputStub.getTokens.callCount, 1, "getTokens method is called once");
		assert.equal(bResult, true, "_checkForValues returns true if MultiInput has at least one token");
	});

	QUnit.test("check initialise event with variant management", function(assert) {

		var oInitialized = 0;
		assert.ok(this.oSmartFilter._oSmartVariantManagement);

		this.oSmartFilter._oSmartVariantManagement.initialise = function() {
			oInitialized++;
		};
		sinon.stub(this.oSmartFilter._oSmartVariantManagement, "addPersonalizableControl");

		this.oSmartFilter.setPersistencyKey("DUMMY");

		this.oSmartFilter._initializeVariantManagement();

		assert.equal(oInitialized, 1);

	});

	QUnit.test("check initialise with custom data executeStandardVariantOnSelect", function(assert) {

		if (this.oSmartFilter._oSmartVariantManagement) {
			this.oSmartFilter._oSmartVariantManagement.destroy();
			this.oSmartFilter._oSmartVariantManagement = null;
			this.oSmartFilter._oVariantManagement = null;
		}

		this.oSmartFilter.attachInitialise(function() {
		});

		this.oSmartFilter.data("executeStandardVariantOnSelect", true);
		this.oSmartFilter._createVariantManagement();
		assert.ok(this.oSmartFilter._oSmartVariantManagement);

		var that = this;
		this.oSmartFilter._oSmartVariantManagement.initialise = function() {
			that.oSmartFilter.fireInitialise();
		};
		sinon.stub(this.oSmartFilter._oSmartVariantManagement, "addPersonalizableControl");
		this.oSmartFilter.setPersistencyKey("DUMMY");

		assert.ok(!this.oSmartFilter._oSmartVariantManagement.bExecuteOnSelectForStandardViaXML);

		this.oSmartFilter._initializeVariantManagement();

		assert.ok(this.oSmartFilter._oSmartVariantManagement.bExecuteOnSelectForStandardViaXML);

	});

	QUnit.test("check initialise event without persistency key", function(assert) {

		var oInitialize = 0;
		var oInitialized = 0;

		this.oSmartFilter.attachInitialise(function() {
			oInitialize++;
		});
		this.oSmartFilter.attachInitialized(function() {
			oInitialized++;
		});

		assert.ok(this.oSmartFilter._oSmartVariantManagement);

		sinon.stub(this.oSmartFilter._oSmartVariantManagement, "initialise");

		this.oSmartFilter._initializeVariantManagement();

		assert.ok(!this.oSmartFilter._oSmartVariantManagement.initialise.called);

		assert.equal(oInitialize, 1);
		assert.equal(oInitialized, 1);
	});

	QUnit.test("check initialise event without smart variant control", function(assert) {

		var oInitialized = 0;
		this.oSmartFilter.attachInitialise(function() {
			oInitialized++;
		});

		this.oSmartFilter.setPersistencyKey("DUMMY");
		sinon.stub(this.oSmartFilter._oSmartVariantManagement, "initialise");
		this.oSmartFilter._oSmartVariantManagement = null;

		this.oSmartFilter._initializeVariantManagement();

		assert.equal(oInitialized, 1);
	});

	QUnit.test("check _getFilterInformation", function(assert) {

		this.oSmartFilter._aFilterBarViewMetadata = [
			{
				"groupName": "_BASIC",
				"fields": [
					{
						"name": "_BASIC_SEARCH_FIELD",
						"type": "Edm.String",
						"filterRestriction": "single_value",
						"isCustomFilterField": false,
						"groupId": "_BASIC",
						"control": {
							attachSearch: sinon.stub(),
							attachLiveChange: sinon.stub()
						}
					}
				]
			}, {
				"groupName": "_BASIC",
				"fields": [
					{
						"fieldName": "BLDAT",
						"type": "Edm.DateTime",
						"filterRestriction": "multiple",
						"isCustomFilterField": false,
						"groupId": "_BASIC",
						"control": {}
					}
				]
			}, {
				"groupName": "GROUP1",
				"fields": [
					{
						"fieldName": "BLDAT2",
						"type": "Edm.DateTime",
						"filterRestriction": "multiple",
						"isCustomFilterField": false,
						"groupId": "GROUP1",
						"control": {}
					}
				]
			}
		];

		this.oSmartFilter._oFilterProvider = {
			getAnalyticParameters: sinon.stub().returns([
				{
					fieldName: "A_PARA"
				}
			])
		};

		sinon.stub(this.oSmartFilter, "setBasicSearch");
		sinon.spy(this.oSmartFilter, "_createFieldInAdvancedArea");
		sinon.spy(this.oSmartFilter, "_createAnalyticParameter");

		sinon.stub(this.oSmartFilter, "_handleEnter");
		sinon.stub(this.oSmartFilter, "_handleChange");

		var aFields = this.oSmartFilter._getFilterInformation();
		assert.ok(aFields);
		assert.equal(aFields.length, 3);

		assert.equal(aFields[0].fieldName, "BLDAT");
		assert.equal(aFields[0].groupName, "__$INTERNAL$");
		assert.ok(aFields[0].factory);

		assert.equal(aFields[1].fieldName, "BLDAT2");
		assert.equal(aFields[1].groupName, "GROUP1");
		assert.ok(aFields[1].factory);

		assert.equal(aFields[2].fieldName, "A_PARA");
		assert.equal(aFields[2].groupName, "__$INTERNAL$");
		assert.ok(aFields[2].factory);

		assert.ok(this.oSmartFilter.setBasicSearch.calledOnce);
		assert.equal(this.oSmartFilter._createFieldInAdvancedArea.called, true);
		assert.ok(this.oSmartFilter._createAnalyticParameter.calledOnce);

	});

	QUnit.test("check addFieldToAdvancedArea ", function(assert) {
		var bVisibleInAdvancedArea = false;
		var oFilterItem = {
			setVisibleInAdvancedArea: function(bFlag) {
				bVisibleInAdvancedArea = bFlag;
			}
		};

		sinon.stub(this.oSmartFilter, "_getFilterItemByName").returns(oFilterItem);
		assert.ok(!bVisibleInAdvancedArea);
		this.oSmartFilter.addFieldToAdvancedArea("");
		assert.ok(bVisibleInAdvancedArea);
	});

	QUnit.test("check getConditionTypeByKey", function(assert) {

		var oFilterProvider = {
			_mConditionTypeFields: {
				dummy: {
					conditionType: "conditionType"
				}
			}
		};
		this.oSmartFilter._oFilterProvider = oFilterProvider;

		var conditionType = this.oSmartFilter.getConditionTypeByKey("dummy");
		assert.strictEqual(conditionType, "conditionType");

	});

	QUnit.test("check setSmartVariant", function(assert) {

		var oControl = new Input({
			id: "dummy"
		});

		var aAssoc = this.oSmartFilter.getAssociation("smartVariant");
		assert.ok(!aAssoc);

		this.oSmartFilter.setSmartVariant(oControl.getId());

		aAssoc = this.oSmartFilter.getAssociation("smartVariant");
		assert.ok(aAssoc);

		oControl.destroy();
	});

	QUnit.test("check getSmartVariant", function(assert) {

		var oControl = new Input({
			id: "dummy"
		});

		sinon.stub(this.oSmartFilter, "getAssociation").returns(oControl.getId());
		var oSV = this.oSmartFilter.getSmartVariant();
		assert.ok(oSV);
		assert.strictEqual(oSV, oControl);

		sinon.stub(this.oSmartFilter, "getAdvancedMode").returns(true);
		oSV = this.oSmartFilter.getSmartVariant();
		assert.ok(!oSV);

		oControl.destroy();

	});

	QUnit.test("check fireReset", function(assert) {
		sinon.spy(this.oSmartFilter, "fireEvent");
		this.oSmartFilter.fireReset();

		assert.ok(this.oSmartFilter.fireEvent.called);
	});

	QUnit.test("check fireClear", function(assert) {
		sinon.spy(this.oSmartFilter, "fireEvent");
		this.oSmartFilter.fireClear();

		assert.ok(this.oSmartFilter.fireEvent.called);
	});

	QUnit.test("check _handleGroupConfigurationChanged", function(assert) {

		var sLabel = null;
		var oFilterGroupItem = {
			setGroupTitle: function(s) {
				sLabel = s;
			}
		};

		var oEvent = {
			oSource: {
				getLabel: function() {
					return "mylabel";
				},
				getKey: function() {
					return "";
				}
			},
			getParameter: function(sName) {
				return "label";
			}
		};

		sinon.stub(this.oSmartFilter, "_getFilterGroupItemByGroupName").returns(oFilterGroupItem);

		assert.ok(!sLabel);
		this.oSmartFilter._handleGroupConfigurationChanged(oEvent);
		assert.strictEqual(sLabel, "mylabel");
	});

	QUnit.test("check _createFieldInAdvancedArea", function(assert) {

		var oControl = new Input({
			id: "dummy"
		});

		var oField = {
			quickInfo: "quickinfo",
			label: "label",
			fieldName: "name",
			isMandatory: false,
			isVisible: true,
			groupEntitySet: "SET",
			groupEntityType: "TYPE"
		};
		sinon.spy(this.oSmartFilter, "addFilterGroupItem");
		sinon.stub(this.oSmartFilter, "_createFilterFieldControl").withArgs(oField).returns(oField.control = oControl);

		sinon.stub(this.oSmartFilter, "getConditionTypeByKey").returns(false);

		var oFilter = this.oSmartFilter._createFieldInAdvancedArea({
			groupName: "__$INTERNAL$",
			groupLabel: ""
		}, oField);
		assert.ok(oFilter);
		assert.ok(oFilter.factory);
		assert.ok(!this.oSmartFilter.addFilterGroupItem.called);

		oFilter.factory();
		assert.ok(this.oSmartFilter.addFilterGroupItem.called);

		var aContent = this.oSmartFilter._mAdvancedAreaFilter[FilterBar.INTERNAL_GROUP].items[0].container.getContent();
		assert.equal(aContent.length, 2);
		assert.ok(aContent[0].isA("sap.m.Label"));
		assert.ok(aContent[1].isA("sap.m.Input"));
		assert.equal(oControl.getTooltip(), "quickinfo");

		oFilter = this.oSmartFilter.determineFilterItemByName("name");
		assert.ok(oFilter);
		assert.equal(oFilter.getEntitySetName(), "SET");
		assert.equal(oFilter.getEntityTypeName(), "TYPE");
	});

	//BCP : 1970470346
	QUnit.test("check _createFieldInAdvancedArea overwrite correct tooltip", function(assert) {

		var oControl = new Input({
			id: "dummy",
			tooltip: "control tooltip"
		});

		var oField = {
			quickInfo: "quickinfo",
			label: "label",
			fieldName: "name",
			isMandatory: false,
			isVisible: true,
			groupEntitySet: "SET",
			groupEntityType: "TYPE"
		};

		sinon.spy(this.oSmartFilter, "addFilterGroupItem");
		sinon.stub(this.oSmartFilter, "_createFilterFieldControl").withArgs(oField).returns(oField.control = oControl);
		sinon.stub(this.oSmartFilter, "getConditionTypeByKey").returns(false);

		var oFilter = this.oSmartFilter._createFieldInAdvancedArea({
			groupName: "__$INTERNAL$",
			groupLabel: ""
		}, oField);

		oFilter.factory();
		var aContent = this.oSmartFilter._mAdvancedAreaFilter[FilterBar.INTERNAL_GROUP].items[0].container.getContent();
		assert.equal(aContent[1].getTooltip(),oControl.getTooltip());
	});


	QUnit.test("check _onChange", function(assert) {

		var oControl = new Input({
			id: "dummy"
		});

		oControl.setValueState(ValueState.Error);
		oControl.data("__mandatoryEmpty", true);

		var oEvent = {
			getSource: function() {
				return oControl;
			},
			getParameter: function(s) {
				return "";
			}
		};

		this.oSmartFilter._oFilterProvider = {
			_updateConditionTypeFields: sinon.stub()
		};
		sinon.spy(this.oSmartFilter, "search");
		this.oSmartFilter._onChange(oEvent);
		assert.strictEqual(oControl.getValueState(), ValueState.None);

		oControl.data("__mandatoryEmpty", null);
		oControl.data("__validationError", true);
		oControl.setValueState(ValueState.Error);

		this.oSmartFilter._onChange(oEvent);
		assert.ok(this.oSmartFilter.search.notCalled);
		assert.strictEqual(oControl.getValueState(), ValueState.None);

		oControl.destroy();
	});

	QUnit.test("check _onChange with LiveMode", function(assert) {
		var oControl = new Input({
			id: "dummy"
		});

		oControl.setValueState(ValueState.Error);
		oControl.data("__mandatoryEmpty", true);

		var oEvent = {
			getSource: function() {
				return oControl;
			},
			getParameter: function(s) {
				return "";
			}
		};

		sinon.spy(this.oSmartFilter, "_search");
		sinon.spy(this.oSmartFilter, "triggerSearch");

		sinon.stub(this.oSmartFilter, "_isPhone").returns(false);
		this.oSmartFilter.setLiveMode(true);
		var sinonClock = sinon.useFakeTimers();

		this.oSmartFilter._oFilterProvider = {
			_updateConditionTypeFields: sinon.stub(),
			_validateConditionTypeFields: sinon.stub(),
			getFilledFilterData: sinon.stub(),
			isPending: function() {
				return false;
			}
		};

		this.oSmartFilter._onChange(oEvent);
		assert.ok(this.oSmartFilter._search.notCalled);
		sinonClock.tick(SmartFilterBar.LIVE_MODE_INTERVAL);

		assert.ok(this.oSmartFilter._search.calledOnce);
		assert.ok(this.oSmartFilter.triggerSearch.calledOnce);

		sinonClock.restore();
		oControl.destroy();
	});

	QUnit.test("_onChange of ComboBox control should set '_bDirtyViaDialog' to 'true' when ValueHelpDialog's control triggers the change", function (assert) {
		// Arrange
		var oControl = new ComboBox({
			value: "some value"
		});
		var oEvent = {
			getSource: function() {
				return oControl;
			},
			getParameter: function(s) {
				return "";
			}
		};
		this.oSmartFilter._oFilterDialog = {
			isOpen: function () { return true; },
			destroy: function () {}
		};

		// Act
		this.oSmartFilter._onChange(oEvent);

		// Assert
		assert.ok(this.oSmartFilter._bDirtyViaDialog, "the _bDirtyViaDialog should be set to 'true' when onChange event of Combobox is fired (even when no selected item presents - in case of not valid string entered)");

		// Cleanup
		oControl.destroy();
	});

	QUnit.test("check _getFilterItemByName", function(assert) {

		sinon.stub(this.oSmartFilter, "determineFilterItemByName").returns({});

		this.oSmartFilter._getFilterItemByName("hugo");

		assert.ok(this.oSmartFilter.determineFilterItemByName.called);

	});

	QUnit.test("check _getFilterGroupItemByGroupName", function(assert) {

		sinon.stub(this.oSmartFilter, "determineFilterItemByName").returns({});

		this.oSmartFilter._getFilterItemByName("hugo");

		assert.ok(this.oSmartFilter.determineFilterItemByName.called);

	});

	QUnit.test("check _createFilterFieldControl", function(assert) {

		var oControl = new Input({
			id: "dummy"
		});

		var oField = {
			conditionType: {
				initializeFilterItem: function() {
					return oControl;
				}
			},
			fCreateControl: function(oField) {
				return oControl;
			}
		};

		this.oSmartFilter._createFilterFieldControl(oField);
		assert.ok(oField.control);
		oField.control.destroy();

		delete oField.conditionType;
		this.oSmartFilter._createFilterFieldControl(oField);
		assert.ok(oField.control);
		oField.control.destroy();
	});

	QUnit.test("check triggerSearch", function(assert) {
		sinon.stub(this.oSmartFilter, "_search");

		var sinonClock = sinon.useFakeTimers();
		this.oSmartFilter.triggerSearch();
		sinonClock.tick(SmartFilterBar.LIVE_MODE_INTERVAL);
		sinonClock.restore();

		assert.ok(this.oSmartFilter._search.calledOnce);
	});

	QUnit.test("check triggerSearch calling twice with LIVE_MODE_INTERVAL", function(assert) {
		sinon.stub(this.oSmartFilter, "_search");

		var sinonClock = sinon.useFakeTimers();
		// Search 1
		this.oSmartFilter.triggerSearch(SmartFilterBar.LIVE_MODE_INTERVAL);
		// Wait for half-time
		sinonClock.tick(SmartFilterBar.LIVE_MODE_INTERVAL / 2);
		// Search 2
		this.oSmartFilter.triggerSearch(SmartFilterBar.LIVE_MODE_INTERVAL);
		// Wait for full-time
		sinonClock.tick(SmartFilterBar.LIVE_MODE_INTERVAL);
		sinonClock.restore();

		assert.ok(this.oSmartFilter._search.calledOnce);
	});

	QUnit.test("check _setFocusOnFirstErroneousField", function(assert) {

		var sinonClock = sinon.useFakeTimers();

		var aControl = [
			new Input(), new Input(), new Input()
		];

		aControl[0].setValueState(ValueState.Error);
		aControl[2].setValueState(ValueState.Error);
		sinon.spy(aControl[0], "focus");
		sinon.spy(aControl[1], "focus");
		sinon.spy(aControl[2], "focus");

		sinon.stub(this.oSmartFilter, "_validateState").returns(false);
		sinon.stub(this.oSmartFilter, "getAllFilterItems").returns([
			"A", "B", "C"
		]);
		var oSinonStub = sinon.stub(this.oSmartFilter, "determineControlByFilterItem");
		oSinonStub.withArgs("A").returns(aControl[0]);
		oSinonStub.withArgs("B").returns(aControl[1]);
		oSinonStub.withArgs("C").returns(aControl[2]);

		sinon.spy(this.oSmartFilter, "_setFocusOnFirstErroneousField");

		this.oSmartFilter.setShowMessages(false);
		this.oSmartFilter.search();

		sinonClock.tick(500);

		assert.equal(this.oSmartFilter._setFocusOnFirstErroneousField.calledOnce, true);
		assert.equal(aControl[0].focus.called, true);
		assert.equal(aControl[1].focus.called, false);
		assert.equal(aControl[2].focus.called, false);

		aControl[0].destroy();
		aControl[1].destroy();
		aControl[2].destroy();

		sinonClock.restore();
	});

	QUnit.test("check liveMode", function(assert) {
		sinon.stub(this.oSmartFilter, "_isPhone").returns(false);
		assert.ok(this.oSmartFilter._oSearchButton.getVisible());

		assert.ok(!this.oSmartFilter.getLiveMode());

		this.oSmartFilter.setLiveMode(true);
		assert.ok(this.oSmartFilter.getLiveMode());
		assert.ok(this.oSmartFilter.isLiveMode());
		assert.ok(!this.oSmartFilter._oSearchButton.getVisible());

		this.oSmartFilter._isPhone.restore();
		sinon.stub(this.oSmartFilter, "_isPhone").returns(true);
		this.oSmartFilter._oSearchButton.setVisible(true);

		this.oSmartFilter.setLiveMode(true);
		assert.ok(!this.oSmartFilter.isLiveMode());
		assert.ok(this.oSmartFilter.getLiveMode());
		assert.ok(this.oSmartFilter._oSearchButton.getVisible());
	});

	QUnit.test("check _resetFilterFields", function(assert) {

		this.oSmartFilter._oFilterProvider = {
			reset: sinon.stub()
		};
		sinon.stub(this.oSmartFilter, "_clearErroneusControlValues");

		this.oSmartFilter._resetFilterFields();

		assert.ok(this.oSmartFilter._clearErroneusControlValues.called);
	});

	QUnit.test("check _clearFilterFields", function(assert) {

		this.oSmartFilter._oFilterProvider = {
			clear: sinon.stub()
		};
		sinon.stub(this.oSmartFilter, "_clearErroneusControlValues");

		this.oSmartFilter._clearFilterFields();

		assert.ok(this.oSmartFilter._clearErroneusControlValues.called);
	});

	QUnit.test("check _clearErroneusControlValues", function(assert) {
		var oControl1 = new Input();
		var oControl2 = new Input();
		var oControl3 = new Input();

		var oControlDRT = new Input();

		var oControlDP = new DatePicker();
		sinon.stub(oControlDP, "getBinding").returns({
			checkUpdate: function(b) {
			}
		});

		var oModel = new JSONModel({
			value: ""
		});
		oControl1.setModel(oModel, "$test");
		oControl2.setModel(oModel, "$test");
		oControl3.setModel(oModel, "$test");
		oControlDRT.setModel(oModel, "$test");

		oControl1.bindProperty("value", "$test>/value");
		oControl2.bindProperty("value", "$test>/value");
		oControl3.bindProperty("value", "$test>/value");
		oControlDRT.bindProperty("value", "$test>/value");

		oControl2.setValueState(ValueState.Error);
		oControl3.setValueState(ValueState.Error);

		oControlDRT.setValueState(ValueState.Error);
		oControlDP.setValueState(ValueState.Error);

		this.oSmartFilter._oFilterProvider = {
			_mConditionTypeFields: {}
		};

		this.oSmartFilter._oFilterProvider._mConditionTypeFields["DRT"] = {};

		var Filter = function(sName) {
			this._sName = sName;
			this.getName = function() {
				return this._sName;
			};
		};

		var aFilters = [
			new Filter("A"), new Filter("B"), new Filter("C"), new Filter("DP"), new Filter("DRT")
		];

		sinon.stub(this.oSmartFilter, "getAllFilterItems").returns(aFilters);
		var oStub = sinon.stub(this.oSmartFilter, "determineControlByFilterItem");
		oStub.withArgs(aFilters[0]).returns(oControl1);
		oStub.withArgs(aFilters[1]).returns(oControl2);
		oStub.withArgs(aFilters[2]).returns(oControl3);
		oStub.withArgs(aFilters[3]).returns(oControlDP);
		oStub.withArgs(aFilters[4]).returns(oControlDRT);

		sinon.stub(JSONPropertyBinding.prototype, "checkUpdate");
		this.oSmartFilter._clearErroneusControlValues();

		assert.equal(oControlDP.getValueState(), ValueState.None);
		assert.equal(oControlDRT.getValueState(), ValueState.None);

		assert.ok(JSONPropertyBinding.prototype.checkUpdate.calledTwice);

		this.oSmartFilter._oFilterProvider = null;
		oControl1.destroy();
		oControl2.destroy();
		oControl3.destroy();
		oControlDP.destroy();
		oControlDRT.destroy();

	});

	QUnit.test("check setConsiderAnalyticalParameters", function(assert) {

		assert.ok(!this.oSmartFilter.getConsiderAnalyticalParameters());

		this.oSmartFilter.setConsiderAnalyticalParameters(true);

		assert.ok(this.oSmartFilter.getConsiderAnalyticalParameters());

	});

	QUnit.test("check getAnalyticBindingPath", function(assert) {

		this.oSmartFilter.setConsiderAnalyticalParameters(true);
		this.oSmartFilter._oFilterProvider = {
			getAnalyticBindingPath: sinon.stub()
		};

		this.oSmartFilter.getAnalyticBindingPath();

		assert.ok(this.oSmartFilter._oFilterProvider.getAnalyticBindingPath.calledOnce);
	});

	QUnit.test("check getFilters with analytical parameters", function(assert) {

		var oStub = sinon.stub(this.oSmartFilter, "_getVisibleFieldNames");
		oStub.withArgs(true).returns([
			'p.A', 'B', 'C', 'p.D'
		]);

		this.oSmartFilter._oFilterProvider = {
			getFilters: function(a) {
				assert.ok(a);
				assert.equal(a.length, 4);
				assert.equal(a[0], 'p.A');
				assert.equal(a[1], 'B');
				assert.equal(a[2], 'C');
				assert.equal(a[3], 'p.D');
			}
		};

		this.oSmartFilter.getFilters();

	});

	QUnit.test("check _createAnalyticParameter", function(assert) {

		var oParam = {
			quickInfo: "quickinfo",
			label: "label",
			fieldName: "fieldName",
			isMandatory: true,
			isVisible: true,
			control: {}
		};

		sinon.stub(this.oSmartFilter, "_createFilterFieldControl");
		sinon.stub(this.oSmartFilter, "_addParameter");

		var oParamRes = this.oSmartFilter._createAnalyticParameter(oParam);
		assert.ok(oParamRes);
		assert.ok(oParamRes.factory);

		oParamRes.factory();
		assert.ok(this.oSmartFilter._addParameter.calledOnce);

		this.oSmartFilter._addParameter.restore();
		sinon.stub(this.oSmartFilter, "_addParameter");
		delete oParamRes.control;
		oParamRes.factory();
		assert.ok(!this.oSmartFilter._addParameter.calledOnce);

	});

	QUnit.test("check _getVisibleFieldNames", function(assert) {

		var aFilters = [
			{
				getName: function() {
					return "A";
				},
				_isParameter: function() {
					return false;
				}
			}, {
				getName: function() {
					return "B";
				},
				_isParameter: function() {
					return true;
				}
			}, {
				getName: function() {
					return "C";
				},
				_isParameter: function() {
					return true;
				}
			}, {
				getName: function() {
					return "D";
				},
				_isParameter: function() {
					return false;
				}
			}
		];

		sinon.stub(this.oSmartFilter, "getAllFilterItems").returns(aFilters);

		aFilters = this.oSmartFilter._getVisibleFieldNames(true);
		assert.ok(aFilters);
		assert.equal(aFilters.length, 2);
		assert.equal(aFilters[0], "D");
		assert.equal(aFilters[1], "A");

		aFilters = this.oSmartFilter._getVisibleFieldNames();
		assert.ok(aFilters);
		assert.equal(aFilters.length, 4);
		assert.equal(aFilters[0], "D");
		assert.equal(aFilters[1], "C");
		assert.equal(aFilters[2], "B");
		assert.equal(aFilters[3], "A");
	});

	QUnit.test("check triggerSearch ", function(assert) {
		sinon.stub(this.oSmartFilter, "triggerSearch");
		sinon.stub(this.oSmartFilter, "_search");
		this.oSmartFilter.search();

		assert.ok(this.oSmartFilter.triggerSearch.calledOnce);
		assert.ok(!this.oSmartFilter._search.called);
	});

	QUnit.test("check search with basic search field", function(assert) {
		var oSearchField = new SearchField();

		sinon.stub(this.oSmartFilter, "search");

		this.oSmartFilter._attachToBasicSearch(oSearchField);
		oSearchField.fireSearch();
		assert.ok(this.oSmartFilter.search.calledOnce);

		// livemode
		this.oSmartFilter.search.restore();
		sinon.stub(this.oSmartFilter, "search");

		this.oSmartFilter.setLiveMode(true);
		oSearchField.fireSearch();
		/*
		 * if (this.oSmartFilter._isPhone()) { assert.ok(this.oSmartFilter.search.calledOnce); } else {
		 * assert.ok(!this.oSmartFilter.search.calledOnce); }
		 */
		assert.ok(this.oSmartFilter.search.calledOnce);

		// open filters dialog
		this.oSmartFilter.search.restore();
		sinon.stub(this.oSmartFilter, "search");

		this.oSmartFilter.setLiveMode(false);
		sinon.stub(this.oSmartFilter, "isDialogOpen").returns(true);
		oSearchField.fireSearch();
		assert.ok(!this.oSmartFilter.search.called);

		oSearchField.destroy();
	});

	QUnit.test("XCheck if all properties defined in the class of the control are declared in designtime metadata (there are also inherited properties)", function(assert) {
		var mProperties = this.oSmartFilter.getMetadata()._mProperties;
		assert.ok(mProperties);

		var done = assert.async();

		this.oSmartFilter.getMetadata().loadDesignTime().then(function(oDesignTimeMetadata) {
			var aProperties = Object.keys(mProperties);
			aProperties.forEach(function(element) {
				assert.ok(oDesignTimeMetadata.properties[element]);
			});
			done();
		});
	});

	QUnit.test("check property useDateRangeType ", function(assert) {

		assert.ok(!this.oSmartFilter.getUseDateRangeType());

		this.oSmartFilter.setUseDateRangeType(true);

		assert.ok(this.oSmartFilter.getUseDateRangeType());
	});

	QUnit.test("check validateMandatoryFields", function(assert) {

		sinon.spy(this.oSmartFilter, "_validateMandatoryFields");

		sinon.stub(this.oSmartFilter, "determineMandatoryFilterItems").returns([
			{
				getName: function() {
					return "A";
				},
				data: function(s) {
					return null;
				}
			}, {
				getName: function() {
					return "B";
				},
				data: function(s) {
					return null;
				}
			}
		]);
		sinon.stub(this.oSmartFilter, "determineControlByFilterItem").returns({
			setValueState: function() {
			},
			getValueState: function() {
				return "None";
			},
			data: function(s) {
				return null;
			}
		});

		sinon.stub(this.oSmartFilter, "getFilterData").returns({
			"A": "a",
			"B": "b"
		});
		assert.ok(this.oSmartFilter.validateMandatoryFields());

		this.oSmartFilter.getFilterData.restore();
		sinon.stub(this.oSmartFilter, "getFilterData").returns({
			"A": "a"
		});
		assert.ok(!this.oSmartFilter.validateMandatoryFields());

		assert.ok(this.oSmartFilter._validateMandatoryFields.calledTwice);
	});

	QUnit.test("check verifySearchAllowed", function(assert) {

		sinon.stub(this.oSmartFilter, "validateMandatoryFields").returns(true);
		sinon.stub(this.oSmartFilter, "_validateState").returns(true);
		assert.deepEqual(this.oSmartFilter.verifySearchAllowed(), {});

		this.oSmartFilter.validateMandatoryFields.restore();
		sinon.stub(this.oSmartFilter, "validateMandatoryFields").returns(false);
		assert.deepEqual(this.oSmartFilter.verifySearchAllowed(), {
			mandatory: true
		});

		this.oSmartFilter._validateState.restore();
		sinon.stub(this.oSmartFilter, "_validateState").returns(false);
		assert.deepEqual(this.oSmartFilter.verifySearchAllowed(), {
			error: true
		});

		this.oSmartFilter._validateState.restore();
		sinon.stub(this.oSmartFilter, "getAllFilterItems").returns([
			{}, {}
		]);
		sinon.stub(this.oSmartFilter, "determineControlByFilterItem").returns({
			__bValidatingToken: true,
			getValueState: function() {
				return "None";
			},
			data: function(s) {
				return null;
			}
		});
		assert.deepEqual(this.oSmartFilter.verifySearchAllowed(), {
			pending: true
		});

	});

	QUnit.test("check suppressSelection", function(assert) {

		sinon.stub(this.oSmartFilter, "_search");

		this.oSmartFilter.search(true);
		assert.ok(this.oSmartFilter._search.called);

		this.oSmartFilter._search.restore();
		sinon.stub(this.oSmartFilter, "_search");

		this.oSmartFilter.setSuppressSelection(true);
		this.oSmartFilter.search(true);
		assert.ok(!this.oSmartFilter._search.called);

		this.oSmartFilter._search.restore();
		sinon.stub(this.oSmartFilter, "_search");

		this.oSmartFilter.setSuppressSelection(false);
		this.oSmartFilter.search(true);
		assert.ok(this.oSmartFilter._search.called);

	});

	QUnit.test("check _handleControlConfigurationChangedForDelayedFilterItems", function(assert) {

		var oControlConfig = {
			getLabel: function() {
				return "LABEL";
			},
			getVisible: function() {
				return false;
			},
			getVisibleInAdvancedArea: function() {
				return true;
			}
		};

		this.oSmartFilter._aFilterBarViewMetadata = [
			{
				groupName: "G1",
				fields: [
					{
						fieldName: "A"
					}, {
						fieldName: "B"
					}, {
						fieldName: "C"
					}
				]
			}, {
				groupName: "G2",
				fields: [
					{
						fieldName: "D"
					}, {
						fieldName: "E"
					}
				]
			}
		];

		this.oSmartFilter._handleControlConfigurationChangedForDelayedFilterItems("D", oControlConfig, "label");
		assert.ok(this.oSmartFilter._aFilterBarViewMetadata[1].fields[0].hasOwnProperty("label"));
		assert.equal(this.oSmartFilter._aFilterBarViewMetadata[1].fields[0].label, "LABEL");

		this.oSmartFilter._handleControlConfigurationChangedForDelayedFilterItems("A", oControlConfig, "visible");
		assert.ok(this.oSmartFilter._aFilterBarViewMetadata[0].fields[0].hasOwnProperty("isVisible"));
		assert.equal(this.oSmartFilter._aFilterBarViewMetadata[0].fields[0].isVisible, false);

		this.oSmartFilter._handleControlConfigurationChangedForDelayedFilterItems("E", oControlConfig, "visibleInAdvancedArea");
		assert.ok(this.oSmartFilter._aFilterBarViewMetadata[1].fields[1].hasOwnProperty("visibleInAdvancedArea"));
		assert.equal(this.oSmartFilter._aFilterBarViewMetadata[1].fields[1].visibleInAdvancedArea, true);

	});

	QUnit.test("check _handleControlConfigurationChanged", function(assert) {

		sinon.spy(this.oSmartFilter, "_handleControlConfigurationChangedForDelayedFilterItems");
		var oControlConfig = {
			getLabel: function() {
				return "LABEL";
			},
			getKey: function() {
				return "D";
			}
		};

		var oEvent = {
			oSource: oControlConfig,
			getParameter: function(s) {
				return "label";
			}
		};

		this.oSmartFilter._aFilterBarViewMetadata = [
			{
				groupName: "G1",
				fields: [
					{
						fieldName: "A"
					}, {
						fieldName: "B"
					}, {
						fieldName: "C"
					}
				]
			}, {
				groupName: "G2",
				fields: [
					{
						fieldName: "D"
					}, {
						fieldName: "E"
					}
				]
			}
		];

		this.oSmartFilter._handleControlConfigurationChanged(oEvent);
		assert.ok(this.oSmartFilter._aFilterBarViewMetadata[1].fields[0].hasOwnProperty("label"));
		assert.equal(this.oSmartFilter._aFilterBarViewMetadata[1].fields[0].label, "LABEL");

		assert.ok(this.oSmartFilter._handleControlConfigurationChangedForDelayedFilterItems.called);

	});

	QUnit.test("check _handleGroupConfigurationLabelChangedForDelayedFilterItems", function(assert) {

		this.oSmartFilter._aFilterBarViewMetadata = [
			{
				groupName: "G1",
				fields: [
					{
						fieldName: "A"
					}, {
						fieldName: "B"
					}, {
						fieldName: "C"
					}
				]
			}, {
				groupName: "G2",
				fields: [
					{
						fieldName: "D"
					}, {
						fieldName: "E"
					}
				]
			}
		];

		this.oSmartFilter._handleGroupConfigurationLabelChangedForDelayedFilterItems("G2", "LABEL");
		assert.ok(this.oSmartFilter._aFilterBarViewMetadata[1].hasOwnProperty("groupLabel"));
		assert.equal(this.oSmartFilter._aFilterBarViewMetadata[1].groupLabel, "LABEL");

	});

	QUnit.test("check _handleGroupConfigurationLabelChangedForDelayedFilterItems", function(assert) {

		sinon.spy(this.oSmartFilter, "_handleGroupConfigurationLabelChangedForDelayedFilterItems");

		this.oSmartFilter._aFilterBarViewMetadata = [
			{
				groupName: "G1",
				fields: [
					{
						fieldName: "A"
					}, {
						fieldName: "B"
					}, {
						fieldName: "C"
					}
				]
			}, {
				groupName: "G2",
				fields: [
					{
						fieldName: "D"
					}, {
						fieldName: "E"
					}
				]
			}
		];

		this.oSmartFilter._handleGroupConfigurationLabelChangedForDelayedFilterItems("G1", "LABEL");
		assert.ok(this.oSmartFilter._aFilterBarViewMetadata[0].hasOwnProperty("groupLabel"));
		assert.equal(this.oSmartFilter._aFilterBarViewMetadata[0].groupLabel, "LABEL");

		assert.ok(this.oSmartFilter._handleGroupConfigurationLabelChangedForDelayedFilterItems.called);

	});

	QUnit.test("Checking 'considerSelectionVariants' property", function(assert) {
		assert.ok(!this.oSmartFilter.getConsiderSelectionVariants());
		this.oSmartFilter.setConsiderSelectionVariants(true);
		assert.ok(this.oSmartFilter.getConsiderSelectionVariants());
	});

	QUnit.test("check fireInitialized", function(assert) {

		sinon.stub(this.oSmartFilter, "getSelectionVariants").returns([
			{
				qualifier: "Q1",
				annotation: {
					Text: {
						String: "Variant Q1"
					}
				}
			}, {
				qualifier: "Q2",
				annotation: {
					Text: {
						String: "Variant Q2"
					}
				}
			}
		]);

		sinon.spy(this.oSmartFilter._oSmartVariantManagement, "registerSelectionVariantHandler");

		this.oSmartFilter.fireInitialized();
		assert.ok(!this.oSmartFilter._oSmartVariantManagement.registerSelectionVariantHandler.called);

		this.oSmartFilter.setConsiderSelectionvariants(true);
		this.oSmartFilter.setPersistencyKey("DUMMY");
		this.oSmartFilter.fireInitialized();
		assert.ok(this.oSmartFilter._oSmartVariantManagement.registerSelectionVariantHandler.called);

		var aEntries = this.oSmartFilter._oSmartVariantManagement.getVariantItems();
		assert.ok(aEntries);
		assert.equal(aEntries.length, 2);

	});

	QUnit.test("check getSelectionVariant", function(assert) {

		var aSelectionVariants = [
			{
				qualifier: "Q1",
				annotation: {
					Text: {
						String: "Variant Q1"
					}
				}
			}, {
				qualifier: "Q2",
				annotation: {
					Text: {
						String: "Variant Q2"
					}
				}
			}
		];

		sinon.stub(this.oSmartFilter, "getSelectionVariants").returns(aSelectionVariants);

		sinon.stub(this.oSmartFilter, "convertSelectionVariantToInternalVariant");
		this.oSmartFilter.convertSelectionVariantToInternalVariant.withArgs(aSelectionVariants[0].annotation).returns("Q1_Content");

		var sContent = this.oSmartFilter.getSelectionVariant("#Q1");
		assert.equal(sContent, "Q1_Content");
		assert.ok(this.oSmartFilter.convertSelectionVariantToInternalVariant.called);

	});

	QUnit.test("check convertSelectionVariantToInternalVariant", function(assert) {

		var oSelectionVariant = {
			Parameters: [
				{
					PropertyName: {
						PropertyPath: "Kunnr"
					},
					PropertyValue: {
						String: "KUNDE"
					}
				}
			],
			SelectOptions: [
				{
					PropertyName: {
						PropertyPath: "Bukrs"
					},
					Ranges: [
						{
							Low: {
								String: "0001"
							},
							Option: {
								EnumMember: "UI.SelectionRangeOptionType/EQ"
							},
							Sign: {
								EnumMember: "UI.SelectionRangeSignType/I"
							}
						}
					]
				}, {
					PropertyName: {
						PropertyPath: "BUDAT"
					},
					Ranges: [
						{
							Low: {
								String: "02.14.2017"
							},
							High: {
								String: "02.17.2017"
							},
							Option: {
								EnumMember: "UI.SelectionRangeOptionType/BT"
							},
							Sign: {
								EnumMember: "UI.SelectionRangeSignType/I"
							}
						}
					]
				}
			]
		};

		var oResult = {
			"Kunnr": "KUNDE",
			"Bukrs": {
				"ranges": [
					{
						"exclude": false,
						"operation": "EQ",
						"keyField": "Bukrs",
						"value1": "0001",
						"value2": null
					}
				],
				"items": [],
				"value": null
			},
			"BUDAT": {
				"low": "02.14.2017",
				"high": "02.17.2017"
			}
		};

		var aViewMetadata = [
			{
				groupName: "_BASIC",
				fields: [
					{
						fieldName: "Bukrs",
						control: new MultiInput(),
						filterRestriction: "auto"
					}, {
						fieldName: "BUDAT",
						control: new DateRangeSelection(),
						filterRestriction: "interval"
					}, {
						fieldName: "Kunnr",
						control: new Input(),
						filterRestriction: "single"
					}
				]
			}
		];

		sinon.stub(this.oSmartFilter, "getFilterBarViewMetadata").returns(aViewMetadata);

		this.oSmartFilter.setPersistencyKey("PESISTENCY.KEY");

		var oVariantContent = this.oSmartFilter.convertSelectionVariantToInternalVariant(oSelectionVariant);
		assert.ok(oVariantContent);
		// assert.ok(oVariantContent["PESISTENCY.KEY"]);
		assert.ok(oVariantContent.filterbar);
		assert.equal(oVariantContent.filterbar.length, 3);
		assert.equal(oVariantContent.version, "V2");
		assert.ok(oVariantContent.filterBarVariant);
		assert.deepEqual(JSON.parse(oVariantContent.filterBarVariant), oResult);
	});

	QUnit.test("check _search with messagebox displayed", function(assert) {

		this.oSmartFilter.setLiveMode(true);

		sinon.stub(this.oSmartFilter, "verifySearchAllowed").returns({
			error: true
		});

		sinon.stub(MessageBox, "error");

		this.oSmartFilter._search();

		assert.ok(!MessageBox.error.called);

		this.oSmartFilter.setLiveMode(false);

		this.oSmartFilter._search();
		assert.ok(MessageBox.error.called);

		MessageBox.error.restore();
	});

	QUnit.test("check @i18n label functionality", function(assert) {
		var oFieldGroup = {
			groupName: "G1",
			groupLabel: "G1_LABEL"
		};
		var oField1 = {
			quickInfo: "QI",
			fieldName: "FIELD1",
			label: "FIELD1_LABEL",
			isMndatory: false,
			isVisible: true,
			visibleInAdvancedArea: true,
			control: {},
			hiddenFilter: false
		};
		var oField2 = {
			quickInfo: "QI",
			fieldName: "FIELD2",
			label: "@i18n>FIELD2_LABEL",
			isMndatory: false,
			isVisible: true,
			visibleInAdvancedArea: true,
			control: {},
			hiddenFilter: false
		};
		var oParam = {
			quickInfo: "QI",
			fieldName: "$Parameter.P1",
			label: "@i18n>P1_LABEL",
			isMndatory: false,
			isVisible: true,
			control: {}
		};

		sinon.spy(FilterGroupItem.prototype, "setLabel");
		sinon.spy(FilterGroupItem.prototype, "bindProperty");

		sinon.stub(this.oSmartFilter, "_createFilterFieldControl");
		var oPreFilter1 = this.oSmartFilter._createFieldInAdvancedArea(oFieldGroup, oField1);
		assert.ok(oPreFilter1);

		var oPreFilter2 = this.oSmartFilter._createFieldInAdvancedArea(oFieldGroup, oField2);
		assert.ok(oPreFilter1);

		var oPreFilter3 = this.oSmartFilter._createAnalyticParameter(oParam);

		oPreFilter1.factory();
		assert.ok(FilterGroupItem.prototype.setLabel.calledOnce);
		assert.ok(!FilterGroupItem.prototype.bindProperty.called);

		oPreFilter2.factory();
		assert.ok(FilterGroupItem.prototype.setLabel.calledTwice);
		assert.ok(!FilterGroupItem.prototype.bindProperty.calledOnce);

		oPreFilter3.factory();
		assert.ok(FilterGroupItem.prototype.setLabel.calledThrice);
		assert.ok(!FilterGroupItem.prototype.bindProperty.calledTwice);

	});

	QUnit.test("check ensureLoadedValueHelp", function(assert) {

		var sCalled = null;
		var aVHProviders = [
			{
				sFieldName: "A",
				_bValueListRequested: true,
				loadAnnotation: function() {
					sCalled = "A";
				}
			}, {
				sFieldName: "B",
				_bValueListRequested: false,
				loadAnnotation: function() {
					sCalled = "B";
				}
			}
		];

		this.oSmartFilter._oFilterProvider = {
			getAssociatedValueHelpProviders: function() {
				return aVHProviders;
			}
		};

		this.oSmartFilter.ensureLoadedValueHelp("A");
		assert.ok(sCalled === null);

		this.oSmartFilter.ensureLoadedValueHelp("B");
		assert.equal(sCalled, "B");

		this.oSmartFilter._oFilterProvider = null;

	});

	QUnit.test("check ensureLoadedValueList", function(assert) {

		var sCalled = null;
		var aVLProviders = [
			{
				sFieldName: "A",
				_bValueListRequested: true,
				loadAnnotation: function() {
					sCalled = "A";
				}
			}, {
				sFieldName: "B",
				_bValueListRequested: false,
				loadAnnotation: function() {
					sCalled = "B";
				}
			}
		];

		this.oSmartFilter._oFilterProvider = {
			getAssociatedValueListProviders: function() {
				return aVLProviders;
			}
		};

		this.oSmartFilter.ensureLoadedValueList("A");
		assert.ok(sCalled === null);

		this.oSmartFilter.ensureLoadedValueList("B");
		assert.equal(sCalled, "B");

		this.oSmartFilter._oFilterProvider = null;

	});

	QUnit.test("check ensureLoadedValueHelpList", function(assert) {
		sinon.stub(this.oSmartFilter, "ensureLoadedValueHelp");
		sinon.stub(this.oSmartFilter, "ensureLoadedValueList");

		this.oSmartFilter.ensureLoadedValueHelpList();
		assert.ok(this.oSmartFilter.ensureLoadedValueHelp.calledOnce);
		assert.ok(this.oSmartFilter.ensureLoadedValueList.calledOnce);
	});

	QUnit.test("check collapse after Go on tablet", function(assert) {

		sinon.stub(SmartFilterBar.prototype, "_isTablet").returns(false);
		sinon.stub(SmartFilterBar.prototype, "_isPhone").returns(false);

		var oSmartFilter = new SmartFilterBar();
		assert.ok(oSmartFilter.getFilterBarExpanded());
		oSmartFilter._search();
		assert.ok(oSmartFilter.getFilterBarExpanded());

		oSmartFilter.destroy();
		SmartFilterBar.prototype._isTablet.restore();

		sinon.stub(SmartFilterBar.prototype, "_isTablet").returns(true);

		oSmartFilter = new SmartFilterBar();

		assert.ok(!oSmartFilter.getFilterBarExpanded());
		sinon.stub(oSmartFilter, "verifySearchAllowed").returns({});

		oSmartFilter.setFilterBarExpanded(true);
		assert.ok(oSmartFilter.getFilterBarExpanded());

		oSmartFilter._search();
		assert.ok(!oSmartFilter.getFilterBarExpanded());

		SmartFilterBar.prototype._isTablet.restore();
		SmartFilterBar.prototype._isPhone.restore();
		oSmartFilter.destroy();

		oSmartFilter = null;
	});

	QUnit.test("check getParameterBindingPath", function(assert) {

		sinon.stub(this.oSmartFilter, "getAnalyticBindingPath");
		this.oSmartFilter.getParameterBindingPath();
		assert.ok(this.oSmartFilter.getAnalyticBindingPath.called);
	});

	QUnit.test("check _onMetadataInitialised", function(assert) {

		var done = assert.async();

		var oFilterProvider = {
			getFilterBarViewMetadata: function() {
				return [];
			},
			attachPendingChange: function() {
			}
		};

		var fResolve, oPromise = new Promise(function(resolve) {
			fResolve = resolve;
		});

		var oFlexRuntimeInfoAPI = {
			isFlexSupported: function() {
				return true;
			},
			waitForChanges: function() {
				return Promise.resolve();
			}
		};

		sinon.stub(this.oSmartFilter, "_getFlexRuntimeInfoAPI").returns(Promise.resolve(oFlexRuntimeInfoAPI));

		sinon.stub(this.oSmartFilter, "_initializeVariantManagement");

		sinon.stub(this.oSmartFilter, "_createFilterProvider").callsFake(function() { fResolve(oFilterProvider); return oPromise;});


		assert.ok(!this.oSmartFilter._bCreateFilterProviderCalled);

		var oModel = new JSONModel();
		this.oSmartFilter.setModel(oModel);
		this.oSmartFilter.setEntitySet("A");
		this.oSmartFilter._onMetadataInitialised();

		oPromise.then(function() {
			assert.ok(this.oSmartFilter._bCreateFilterProviderCalled);
			assert.ok(this.oSmartFilter._createFilterProvider.calledOnce);
			done();
		}.bind(this));

	});

	QUnit.test("check getFilterContextUrl/getParameterContextUrl", function(assert) {

		var oFilterProvider = {
			getFilterContextUrl: function() {
				return "filterURL";
			},
			getParameterContextUrl: function() {
				return "parameterURL";
			}
		};

		this.oSmartFilter._oFilterProvider = oFilterProvider;

		assert.equal(this.oSmartFilter.getFilterContextUrl(), "filterURL");
		assert.equal(this.oSmartFilter.getParameterContextUrl(), "parameterURL");

		this.oSmartFilter._oFilterProvider = null;
	});

	QUnit.test("check _createArrayFromString ", function(assert) {
		this.oSmartFilter.setNavigationProperties("A, B, C");

		var aArray = this.oSmartFilter._createArrayFromString(this.oSmartFilter.getNavigationProperties());
		assert.ok(aArray);
		assert.equal(aArray.length, 3);
	});

	QUnit.test("keyup event with 'Enter' key on a checkbox should NOT trigger search", function (assert) {
		// Arrange
		var oControlStub = new CheckBox(),
			oSearchSpy = this.spy(this.oSmartFilter, "search");
		oControlStub.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// Act
		this.oSmartFilter._handleEnter(oControlStub);
		qutils.triggerKeyup(oControlStub.getId(), KeyCodes.ENTER, false, false, false);

		// Assert
		assert.equal(oSearchSpy.callCount, 0, "search method should NOT be called");

		// Cleanup
		oControlStub.destroy();
		oSearchSpy.restore();
	});

	// keyup event with 'Enter' key on a sap.m.MultiInput should trigger search
	testKeyupEnterOnControlsThatTriggerSearch(MultiInput);

	// keyup event with 'Enter' key on a sap.m.Input should trigger search
	testKeyupEnterOnControlsThatTriggerSearch(Input);

	// keyup event with 'Enter' key on a sap.m.DatePicker should trigger search
	testKeyupEnterOnControlsThatTriggerSearch(DatePicker);

	// keyup event with 'Enter' key on a sap.m.DateTimePicker should trigger search
	testKeyupEnterOnControlsThatTriggerSearch(DateTimePicker);

	// keyup event with 'Enter' key on a sap.m.DatePicker should trigger search
	testKeyupEnterOnControlsThatTriggerSearch(DateRangeSelection);

	// keyup event with 'Enter' key on a sap.m.TimePicker should trigger search
	testKeyupEnterOnControlsThatTriggerSearch(TimePicker);

	function testKeyupEnterOnControlsThatTriggerSearch (oControlType) {
		QUnit.test("keyup event with 'Enter' key on a " + oControlType.getMetadata().getName() + " should trigger search", function (assert) {
			// Arrange
			var oControlStub = new oControlType(),
				oSearchSpy = this.spy(this.oSmartFilter, "search");
			oControlStub.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			// Act
			this.oSmartFilter._handleEnter(oControlStub);
			qutils.triggerKeyup(oControlStub.getId(), KeyCodes.ENTER, false, false, false);

			// Assert
			assert.equal(oSearchSpy.callCount, 1, "search method should be called");

			// Cleanup
			oControlStub.destroy();
			oSearchSpy.restore();
		});
	}

	QUnit.start();

});
