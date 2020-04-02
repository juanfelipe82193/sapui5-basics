/*globals QUnit*/
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/library",
	"sap/ui/comp/smartfilterbar/AdditionalConfigurationHelper",
	"sap/ui/comp/smartfilterbar/ControlConfiguration",
	"sap/ui/comp/smartfilterbar/GroupConfiguration",
	"sap/ui/comp/smartfilterbar/SelectOption",
	"sap/m/Input"
], function(library, AdditionalConfigurationHelper, ControlConfiguration, GroupConfiguration, SelectOption, Input){
	"use strict";

	QUnit.module("sap.ui.comp.smartfilterbar.AdditionalConfigurationHelper", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});

	QUnit.test("getJSONFromAdditionalConfiguration shall return an simple empty JS Object", function(assert) {
		var oAdditionalConfigurationHelper;

		//Call CUT
		oAdditionalConfigurationHelper = new AdditionalConfigurationHelper([],[]);

		assert.ok(oAdditionalConfigurationHelper);
		assert.deepEqual(oAdditionalConfigurationHelper.controlConfiguration, []);
		assert.deepEqual(oAdditionalConfigurationHelper.groupConfiguration, []);
	});

	QUnit.test("getJSONFromAdditionalConfiguration shall convert the additional configuration into a JS Object", function(assert) {
		var oGroupConfiguration, oControlConfiguration, oDefaultFilterValue, oCustomControl, oAdditionalConfigurationHelper;

		//Control Configuration
		oControlConfiguration = new ControlConfiguration();
		oControlConfiguration.setKey("key");
		oControlConfiguration.setGroupId("groupId");
		oControlConfiguration.setVisible(false);
		oControlConfiguration.setMandatory(library.smartfilterbar.MandatoryType.mandatory);
		oControlConfiguration.setWidth('12rem');
		oControlConfiguration.setHasValueHelpDialog(true);
		oControlConfiguration.setHasTypeAhead(true);
		oControlConfiguration.setControlType(library.smartfilterbar.ControlType.input);
		oControlConfiguration.setIndex(5);
		oControlConfiguration.setFilterType(library.smartfilterbar.FilterType.single);
		oControlConfiguration.setPreventInitialDataFetchInValueHelpDialog(true);
		oDefaultFilterValue = new SelectOption();
		oDefaultFilterValue.setLow("low");
		oControlConfiguration.addDefaultFilterValue(oDefaultFilterValue);
		oCustomControl = new Input();
		oControlConfiguration.setCustomControl(oCustomControl);

		//Group Configuration
		oGroupConfiguration = new GroupConfiguration();
		oGroupConfiguration.setKey("key");
		oGroupConfiguration.setIndex(5);

		//Call CUT
		oAdditionalConfigurationHelper = new AdditionalConfigurationHelper([oControlConfiguration],[oGroupConfiguration]);

		//Assert control Configuration
		assert.ok(oAdditionalConfigurationHelper);
		assert.ok(oAdditionalConfigurationHelper.controlConfiguration);
		assert.equal(oAdditionalConfigurationHelper.controlConfiguration.length, 1);
		assert.equal(oAdditionalConfigurationHelper.controlConfiguration[0].key, "key");
		assert.equal(oAdditionalConfigurationHelper.controlConfiguration[0].groupId, "groupId" );
		assert.strictEqual(oAdditionalConfigurationHelper.controlConfiguration[0].isVisible, false );
		assert.strictEqual(oAdditionalConfigurationHelper.controlConfiguration[0].mandatory, library.smartfilterbar.MandatoryType.mandatory );
		assert.equal(oAdditionalConfigurationHelper.controlConfiguration[0].width, '12rem' );
		assert.strictEqual(oAdditionalConfigurationHelper.controlConfiguration[0].hasValueHelpDialog, true);
		assert.strictEqual(oAdditionalConfigurationHelper.controlConfiguration[0].hasTypeAhead, true);
		assert.equal(oAdditionalConfigurationHelper.controlConfiguration[0].controlType, library.smartfilterbar.ControlType.input);
		assert.equal(oAdditionalConfigurationHelper.controlConfiguration[0].filterType, library.smartfilterbar.FilterType.single);
		assert.ok(oAdditionalConfigurationHelper.controlConfiguration[0].defaultFilterValues);
		assert.equal(oAdditionalConfigurationHelper.controlConfiguration[0].defaultFilterValues.length, 1);
		assert.equal(oAdditionalConfigurationHelper.controlConfiguration[0].defaultFilterValues[0].low, "low");
		assert.strictEqual(oAdditionalConfigurationHelper.controlConfiguration[0].preventInitialDataFetchInValueHelpDialog, true);

		//Assert group Configuration
		assert.ok(oAdditionalConfigurationHelper.groupConfiguration);
		assert.equal(oAdditionalConfigurationHelper.groupConfiguration.length, 1);
		assert.equal(oAdditionalConfigurationHelper.groupConfiguration[0].key, "key");
		assert.equal(oAdditionalConfigurationHelper.groupConfiguration[0].index, 5);

	});

	QUnit.test("getControlConfigurationByKey shall return undefined if the parameter 'key' is invalid", function(assert) {
		var oAdditionalConfigurationHelper, oControlConfiguration;
		oAdditionalConfigurationHelper = new AdditionalConfigurationHelper();

		//Call CUT
		oControlConfiguration = oAdditionalConfigurationHelper.getControlConfigurationByKey(undefined);

		assert.strictEqual(oControlConfiguration, undefined);
	});

	QUnit.test("getControlConfigurationByKey shall return undefined if the key does not exist", function(assert) {
		var oAdditionalConfigurationHelper, oControlConfiguration;
		oAdditionalConfigurationHelper = new AdditionalConfigurationHelper();

		//Call CUT
		oControlConfiguration = oAdditionalConfigurationHelper.getControlConfigurationByKey("iDoNotExist");

		assert.strictEqual(oControlConfiguration, undefined);
	});

	QUnit.test("getControlConfigurationByKey shall return the control configuration for the specified key", function(assert) {
		var oAdditionalConfigurationHelper, oControlConfiguration;

		//Create Control Configuration
		oControlConfiguration = new ControlConfiguration();
		oControlConfiguration.setKey("key");
		oAdditionalConfigurationHelper = new AdditionalConfigurationHelper([oControlConfiguration]);

		//Call CUT
		oControlConfiguration = oAdditionalConfigurationHelper.getControlConfigurationByKey("key");

		assert.ok(oControlConfiguration);
		assert.equal(oControlConfiguration.key, "key");
	});

	QUnit.test("getGroupConfigurationByKey shall return undefined if the parameter 'key' is invalid", function(assert) {
		var oAdditionalConfigurationHelper, oGroupConfiguration;
		oAdditionalConfigurationHelper = new AdditionalConfigurationHelper();

		//Call CUT
		oGroupConfiguration = oAdditionalConfigurationHelper.getGroupConfigurationByKey(undefined);

		assert.strictEqual(oGroupConfiguration, undefined);
	});

	QUnit.test("getGroupConfigurationByKey shall return undefined if the key does not exist", function(assert) {
		var oAdditionalConfigurationHelper, oGroupConfiguration;
		oAdditionalConfigurationHelper = new AdditionalConfigurationHelper();

		//Call CUT
		oGroupConfiguration = oAdditionalConfigurationHelper.getGroupConfigurationByKey("iDoNotExist");

		assert.strictEqual(oGroupConfiguration, undefined);
	});

	QUnit.test("getGroupConfigurationByKey shall return the control configuration for the specified key", function(assert) {
		var oAdditionalConfigurationHelper, oGroupConfiguration;

		//Create Control Configuration
		oGroupConfiguration = new GroupConfiguration();
		oGroupConfiguration.setKey("key");
		oAdditionalConfigurationHelper = new AdditionalConfigurationHelper([], [oGroupConfiguration]);

		//Call CUT
		oGroupConfiguration = oAdditionalConfigurationHelper.getGroupConfigurationByKey("key");

		assert.ok(oGroupConfiguration);
		assert.equal(oGroupConfiguration.key, "key");
	});

	QUnit.start();

});