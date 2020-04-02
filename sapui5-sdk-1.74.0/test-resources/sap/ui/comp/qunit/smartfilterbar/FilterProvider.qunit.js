 /* globals QUnit, sinon */
 QUnit.config.autostart = false;

 sap.ui.define([
	 "sap/ui/comp/library",
	 "sap/ui/comp/smartfilterbar/FilterProvider",
	 "sap/ui/comp/odata/MetadataAnalyser",
	 "sap/ui/comp/odata/ODataType",
	 'sap/ui/comp/util/FormatUtil',
	 "sap/ui/model/odata/v2/ODataModel",
	 "sap/ui/model/odata/type/Decimal",
	 "sap/ui/model/json/JSONModel",
	 "sap/ui/model/Filter",
	 "sap/ui/base/ManagedObject",
	 "sap/m/Input",
	 "sap/ui/comp/smartfilterbar/SFBMultiInput",
	 "sap/m/DatePicker",
	 "sap/m/DateRangeSelection",
	 "sap/m/Select",
	 "sap/m/ComboBox",
	 "sap/m/MultiComboBox",
	 "sap/m/TimePicker",
	 "sap/m/SearchField",
	 "sap/base/util/merge",
	 "sap/ui/model/FilterOperator",
	 'sap/ui/comp/util/FilterUtil'
 ], function(
	 library,
	 FilterProvider,
	 MetadataAnalyser,
	 ODataType,
	 FormatUtil,
	 ODataModel,
	 TypeDecimal,
	 JSONModel,
	 Filter,
	 ManagedObject,
	 Input,
	 MultiInput,
	 DatePicker,
	 DateRangeSelection,
	 Select,
	 ComboBox,
	 MultiComboBox,
	 TimePicker,
	 SearchField,
	 merge,
	 FilterOperator,
	 FilterUtil
 ) {
	 "use strict";

	 var oModel = sinon.createStubInstance(ODataModel);

	 QUnit.module("sap.ui.comp.smartfilterbar.FilterProvider", {
		 beforeEach: function() {
			 this.oFilterProvider = new FilterProvider({
				 entityType: "foo",
				 model: oModel
			 });
			 var oEmptyJson = {
				 "SomeCrap": "",
				 "SomeMoreCrap": {
					 "items": [],
					 "value": ""
				 }
			 };
			 this.oNonEmptyJson = {
				 "CountryCode": {
					 "value": "dsagfdsg",
					 "items": [
						 {
							 "key": "GT",
							 "text": "Guatemala"
						 }, {
							 "key": "GQ",
							 "text": "Equatorial Guin"
						 }, {
							 "key": "GH",
							 "text": "Ghana"
						 }, {
							 "key": "GA",
							 "text": "Gabon"
						 }, {
							 "key": "FI",
							 "text": "Finland"
						 }, {
							 "key": "DJ",
							 "text": "Djibouti"
						 }, {
							 "key": "EE",
							 "text": "Estonia"
						 }, {
							 "key": "BH",
							 "text": "Bahrain"
						 }, {
							 "key": "BE",
							 "text": "Belgium"
						 }, {
							 "key": "AX",
							 "text": ""
						 }, {
							 "key": "AS",
							 "text": "Samoa, America"
						 }, {
							 "key": "AQ",
							 "text": "Antarctica"
						 }, {
							 "key": "AI",
							 "text": "Anguilla"
						 }, {
							 "key": "AF",
							 "text": "Afghanistan"
						 }, {
							 "key": "AD",
							 "text": "Andorran"
						 }
					 ]
				 },
				 "RegionCode": {
					 "value": "fds",
					 "items": [
						 {
							 "key": "CA",
							 "text": "CA"
						 }, {
							 "key": "CL",
							 "text": "[object Object] (CL)"
						 }, {
							 "key": "CH",
							 "text": "[object Object] (CH)"
						 }, {
							 "key": "CO",
							 "text": "[object Object] (CO)"
						 }, {
							 "key": "FR",
							 "text": "[object Object] (FR)"
						 }, {
							 "key": "NL",
							 "text": "[object Object] (NL)"
						 }, {
							 "key": "NO",
							 "text": "[object Object] (NO)"
						 }, {
							 "key": "ID",
							 "text": "[object Object] (ID)"
						 }, {
							 "key": "HU",
							 "text": "[object Object] (HU)"
						 }, {
							 "key": "AR",
							 "text": "[object Object] (AR)"
						 }
					 ]
				 }
			 };
			 this.oJson = merge({}, this.oNonEmptyJson, oEmptyJson);
			 this.sJson = JSON.stringify(this.oJson);
		 },
		 afterEach: function() {
			 this.oFilterProvider.destroy();
		 }
	 });

	 QUnit.test("Shall be instantiable", function(assert) {
		 assert.ok(this.oFilterProvider);
	 });

	 QUnit.test("Shall default UTC to true when no dateFormatSettings are passed", function(assert) {
		 assert.ok(this.oFilterProvider._oDateFormatSettings);
		 assert.strictEqual(this.oFilterProvider._oDateFormatSettings.UTC, true);
	 });

	 QUnit.test("Shall contain an instance of metadata analyser", function(assert) {
		 assert.ok(this.oFilterProvider._oMetadataAnalyser);
		 assert.strictEqual(this.oFilterProvider._oMetadataAnalyser instanceof MetadataAnalyser, true);
	 });

	 QUnit.test("Shall contain the Metadata for the smart filter bar", function(assert) {
		 assert.ok(this.oFilterProvider._aFilterBarViewMetadata);
	 });

	 QUnit.test("Shall return a JSON Model", function(assert) {
		 assert.ok(this.oFilterProvider.oModel);
		 assert.strictEqual(this.oFilterProvider.getModel() instanceof JSONModel, true);
	 });

	 QUnit.test("Shall return an array of view metadata", function(assert) {
		 var aFilterViewMetadata = this.oFilterProvider.getFilterBarViewMetadata();
		 assert.ok(aFilterViewMetadata);
	 });

	 QUnit.test("Shall return an empty array if there are no filters", function(assert) {
		 var aFilters, aNames = [];
		 aFilters = this.oFilterProvider.getFilters(aNames);
		 assert.ok(aFilters);
		 assert.strictEqual(aFilters.length, 0);
	 });

	 QUnit.test("Shall return an array of filters", function(assert) {
		 var oJsonModel = new JSONModel({
			 foo: "test",
			 foo1: "test1",
			 foo2: "test2"
		 });
		 this.oFilterProvider.oModel = oJsonModel;
		 var aNames = [
			 "foo", "foo1"
		 ]; // Visible field names
		 var aFilters = this.oFilterProvider.getFilters(aNames);
		 assert.ok(aFilters);
		 // Top level filters
		 assert.strictEqual(aFilters.length, 1);
		 // Get the internal filters array from the top level filter array
		 aFilters = aFilters[0].aFilters;
		 assert.strictEqual(aFilters.length, 2);
		 // order doesn't matter here but it should be one of these
		 assert.strictEqual(aFilters[1] instanceof Filter, true);
		 assert.strictEqual(aFilters[1].sPath, "foo");
		 assert.strictEqual(aFilters[1].oValue1, "test");
	 });

	 QUnit.test("Method _getControlConstructor shall create the MultiInput control as per the metadata/configuration", function(assert) {
		 var fControlConstructor, oFieldViewMetadata;

		 oFieldViewMetadata = {
			 controlType: library.smartfilterbar.ControlType.input,
			 filterRestriction: library.smartfilterbar.FilterType.multiple,
			 hasValueHelpDialog: true
		 };
		 fControlConstructor = this.oFilterProvider._getControlConstructor(oFieldViewMetadata);
		 assert.equal(fControlConstructor, MultiInput);
	 });

	 QUnit.test("Method _getControlConstructor shall create MultiInput control without a dialog if the valuehelpDialog is explicitly switched off", function(assert) {
		 var fControlConstructor, oFieldViewMetadata;

		 oFieldViewMetadata = {
			 controlType: library.smartfilterbar.ControlType.input,
			 filterRestriction: library.smartfilterbar.FilterType.multiple,
			 hasValueHelpDialog: false
		 };
		 fControlConstructor = this.oFilterProvider._getControlConstructor(oFieldViewMetadata);
		 assert.equal(fControlConstructor, MultiInput);
	 });

	 QUnit.test("Method _getControlConstructor shall create the MultiComboBox control as per the metadata/configuration", function(assert) {
		 var fControlConstructor, oFieldViewMetadata;

		 oFieldViewMetadata = {
			 controlType: library.smartfilterbar.ControlType.dropDownList,
			 filterRestriction: library.smartfilterbar.FilterType.multiple
		 };
		 fControlConstructor = this.oFilterProvider._getControlConstructor(oFieldViewMetadata);
		 assert.equal(fControlConstructor, MultiComboBox);
	 });

	 QUnit.test("Method _getControlConstructor shall create the ComboBox control as per the metadata", function(assert) {
		 var fControlConstructor, oFieldViewMetadata;

		 oFieldViewMetadata = {
			 controlType: library.smartfilterbar.ControlType.dropDownList,
			 filterRestriction: library.smartfilterbar.FilterType.single
		 };
		 fControlConstructor = this.oFilterProvider._getControlConstructor(oFieldViewMetadata);
		 assert.equal(fControlConstructor, ComboBox);

	 });

	 QUnit.test("Method _getControlConstructor shall create the DatePicker control as per the metadata (single-value)", function(assert) {
		 var fControlConstructor, oFieldViewMetadata;

		 oFieldViewMetadata = {
			 controlType: library.smartfilterbar.ControlType.date,
			 filterRestriction: library.smartfilterbar.FilterType.single
		 };
		 fControlConstructor = this.oFilterProvider._getControlConstructor(oFieldViewMetadata);
		 assert.equal(fControlConstructor, DatePicker);
	 });

	 QUnit.test("Method _getControlConstructor shall create the MultiInput control as per the metadata (multi-value)", function(assert) {
		 var fControlConstructor, oFieldViewMetadata;

		 oFieldViewMetadata = {
			 controlType: library.smartfilterbar.ControlType.date,
			 filterRestriction: library.smartfilterbar.FilterType.multiple
		 };
		 fControlConstructor = this.oFilterProvider._getControlConstructor(oFieldViewMetadata);
		 assert.equal(fControlConstructor, MultiInput);
	 });

	 QUnit.test("Method _getControlConstructor shall create the MultiInput control as per the metadata (unrestricted/unknown)", function(assert) {
		 var fControlConstructor, oFieldViewMetadata;

		 oFieldViewMetadata = {
			 controlType: library.smartfilterbar.ControlType.date,
			 filterRestriction: "foo"// unrestricted
		 };
		 fControlConstructor = this.oFilterProvider._getControlConstructor(oFieldViewMetadata);
		 assert.equal(fControlConstructor, MultiInput);
	 });

	 QUnit.test("Method _getControlConstructor shall create the DateRangeSelection control as per the metadata", function(assert) {
		 var fControlConstructor, oFieldViewMetadata;

		 oFieldViewMetadata = {
			 controlType: library.smartfilterbar.ControlType.date,
			 filterRestriction: library.smartfilterbar.FilterType.interval
		 };
		 fControlConstructor = this.oFilterProvider._getControlConstructor(oFieldViewMetadata);
		 assert.equal(fControlConstructor, DateRangeSelection);
	 });

	 QUnit.test("Method _getControlConstructor shall return sap.m.Input for Edm.String and single-value", function(assert) {
		 var fControlConstructor, oFieldViewMetadata;

		 oFieldViewMetadata = {
			 controlType: library.smartfilterbar.ControlType.input,
			 filterRestriction: library.smartfilterbar.FilterType.single,
			 hasValueHelpDialog: true
		 };
		 fControlConstructor = this.oFilterProvider._getControlConstructor(oFieldViewMetadata);
		 assert.equal(fControlConstructor, Input);

		 oFieldViewMetadata = {
			 controlType: library.smartfilterbar.ControlType.input,
			 filterRestriction: library.smartfilterbar.FilterType.single,
			 hasValueHelpDialog: false
		 };
		 fControlConstructor = this.oFilterProvider._getControlConstructor(oFieldViewMetadata);
		 assert.equal(fControlConstructor, Input);

	 });

	 QUnit.test("Destroy", function(assert) {
		 assert.equal(this.oFilterProvider.bIsDestroyed, undefined);
		 this.oFilterProvider.destroy();
		 assert.equal(this.oFilterProvider._oMetadataAnalyser, null);
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata, null);
		 assert.strictEqual(this.oFilterProvider.bIsDestroyed, true);
	 });

	 QUnit.test("Method _isVisible shall return the visible flag from the additional configuration", function(assert) {
		 var bIsVisible;

		 // Call CUT
		 bIsVisible = this.oFilterProvider._isVisible({
			 isVisible: false
		 });

		 assert.strictEqual(bIsVisible, false);
	 });

	 QUnit.test("Method _isMandatory shall use the value from the OData metadata if there is no additional configuration", function(assert) {
		 var bIsMandatory;

		 // Call CUT
		 bIsMandatory = this.oFilterProvider._isMandatory({
			 requiredFilterField: true
		 }, undefined);

		 assert.strictEqual(bIsMandatory, true);
	 });

	 QUnit.test("Method _isMandatory shall use the value from the additional configuration", function(assert) {
		 var bIsMandatory;

		 // Call CUT
		 bIsMandatory = this.oFilterProvider._isMandatory({
			 requiredFilterField: true
		 }, {
			 mandatory: library.smartfilterbar.MandatoryType.notMandatory
		 });

		 assert.strictEqual(bIsMandatory, false);
	 });

	 QUnit.test("Method _isMandatory shall use the value from the OData metadata if the additional configuration has no explicit value", function(assert) {
		 var bIsMandatory;

		 // Call CUT
		 bIsMandatory = this.oFilterProvider._isMandatory({
			 requiredFilterField: true
		 }, {
			 mandatory: library.smartfilterbar.MandatoryType.auto
		 });

		 assert.strictEqual(bIsMandatory, true);
	 });

	 QUnit.test("Method _getIndex shall return the index from the additional configuration", function(assert) {
		 var index;

		 // Call CUT
		 index = this.oFilterProvider._getIndex({}, {
			 index: 0
		 });

		 assert.strictEqual(index, 0);
	 });

	 QUnit.test("Method _getIndex shall return undefined if there is no index from the additional configuration", function(assert) {
		 var index;

		 // Call CUT
		 index = this.oFilterProvider._getIndex({}, undefined);

		 assert.strictEqual(index, undefined);
	 });

	 QUnit.test("Method _getGroupIndex shall return the index from the additional configuration for groups", function(assert) {
		 var index;

		 // Call CUT
		 index = this.oFilterProvider._getGroupIndex({
			 index: 5
		 });

		 assert.strictEqual(index, 5);
	 });

	 QUnit.test("Method _applyGroupId shall consider the groupId of a field", function(assert) {
		 var oGroup1, oGroup2;

		 oGroup1 = {
			 groupName: "group1",
			 fields: [
				 {
					 key: "field1",
					 groupId: "group2"
				 }, {
					 key: "field2",
					 groupId: "group1"
				 }
			 ]
		 };
		 oGroup2 = {
			 groupName: "group2"
		 };
		 this.oFilterProvider._aFilterBarViewMetadata = [
			 oGroup1, oGroup2
		 ];

		 // Call CUT
		 this.oFilterProvider._applyGroupId();

		 assert.ok(this.oFilterProvider._aFilterBarViewMetadata);
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[0].groupName, "group1");
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[1].groupName, "group2");
		 assert.strictEqual(this.oFilterProvider._aFilterBarViewMetadata[0].fields.length, 1, "field1 shall be removed from group1");
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[0].fields[0].key, "field2");
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[1].fields.length, 1, "field1 shall be moved to group2");
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[1].fields[0].key, "field1");
	 });

	 QUnit.test("Method _applyGroupId shall consider the groupId of all fields", function(assert) {
		 var oGroup1, oGroup2;

		 oGroup1 = {
			 groupName: "group1",
			 fields: [
				 {
					 key: "field1",
					 groupId: "group2"
				 }, {
					 key: "field2",
					 groupId: "group2"
				 }
			 ]
		 };
		 oGroup2 = {
			 groupName: "group2"
		 };
		 this.oFilterProvider._aFilterBarViewMetadata = [
			 oGroup1, oGroup2
		 ];

		 // Call CUT
		 this.oFilterProvider._applyGroupId();

		 assert.ok(this.oFilterProvider._aFilterBarViewMetadata);
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata.length, 2);
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[0].groupName, "group1");
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[1].groupName, "group2");
		 assert.strictEqual(this.oFilterProvider._aFilterBarViewMetadata[0].fields.length, 0, "field1 shall be removed from group1");
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[1].fields.length, 2);
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[1].fields[0].key, "field1");
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[1].fields[1].key, "field2");
	 });

	 QUnit.test("Method _applyGroupId shall not break if a field is moved to its origin group", function(assert) {
		 var oGroup1;

		 oGroup1 = {
			 groupName: "group1",
			 fields: [
				 {
					 key: "field1",
					 groupId: "group1"
				 }
			 ]
		 };
		 this.oFilterProvider._aFilterBarViewMetadata = [
			 oGroup1
		 ];

		 // Call CUT
		 this.oFilterProvider._applyGroupId();

		 assert.ok(this.oFilterProvider._aFilterBarViewMetadata);
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata.length, 1);
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[0].groupName, "group1");
		 assert.strictEqual(this.oFilterProvider._aFilterBarViewMetadata[0].fields.length, 1);
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[0].fields[0].key, "field1");
	 });

	 QUnit.test("Method _applyGroupId shall not break if there are no groups", function(assert) {
		 this.oFilterProvider._aFilterBarViewMetadata = [];

		 // Call CUT
		 this.oFilterProvider._applyGroupId();

		 assert.ok(this.oFilterProvider._aFilterBarViewMetadata);
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata.length, 0);
	 });

	 QUnit.test("Method _applyIndexes shall consider the index of groups", function(assert) {

		 this.oFilterProvider._aFilterBarViewMetadata = [
			 {
				 key: "group1",
				 index: 2
			 }, {
				 key: "group2"
			 }, {
				 key: "group3"
			 }
		 ];

		 // Call CUT
		 this.oFilterProvider._applyIndexes();

		 assert.ok(this.oFilterProvider._aFilterBarViewMetadata);
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata.length, 3);
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[0].key, "group2");
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[1].key, "group3");
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[2].key, "group1");
	 });

	 QUnit.test("Method _applyIndexes shall consider the index of groups. If there are no indexes, the originl order shall be kept", function(assert) {

		 this.oFilterProvider._aFilterBarViewMetadata = [
			 {
				 key: "group1"
			 }, {
				 key: "group2"
			 }, {
				 key: "group3"
			 }
		 ];

		 // Call CUT
		 this.oFilterProvider._applyIndexes();

		 assert.ok(this.oFilterProvider._aFilterBarViewMetadata);
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata.length, 3);
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[0].key, "group1");
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[1].key, "group2");
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[2].key, "group3");
	 });

	 QUnit.test("Method _applyIndexes shall consider the index of groups. The index shall be zero based.", function(assert) {

		 this.oFilterProvider._aFilterBarViewMetadata = [
			 {
				 key: "group1",
				 index: 2
			 }, {
				 key: "group2",
				 index: 0
			 }, {
				 key: "group3"
			 }
		 ];

		 // Call CUT
		 this.oFilterProvider._applyIndexes();

		 assert.ok(this.oFilterProvider._aFilterBarViewMetadata);
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata.length, 3);
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[0].key, "group2");
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[1].key, "group3");
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[2].key, "group1");
	 });

	 QUnit.test("Method _applyIndexes shall consider the index of groups. Too large indexes shall be appended to the Array", function(assert) {

		 this.oFilterProvider._aFilterBarViewMetadata = [
			 {
				 key: "group1",
				 index: 2
			 }, {
				 key: "group2",
				 index: 8
			 }, {
				 key: "group3"
			 }
		 ];

		 // Call CUT
		 this.oFilterProvider._applyIndexes();

		 assert.ok(this.oFilterProvider._aFilterBarViewMetadata);
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata.length, 3);
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[0].key, "group3");
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[1].key, "group1");
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[2].key, "group2");
	 });

	 QUnit.test("Method _applyIndexes shall consider the index of groups. Fields having the same index shall keep their original order", function(assert) {

		 this.oFilterProvider._aFilterBarViewMetadata = [
			 {
				 key: "group1",
				 index: 2
			 }, {
				 key: "group2",
				 index: 1
			 }, {
				 key: "group3",
				 index: 1
			 }
		 ];

		 // Call CUT
		 this.oFilterProvider._applyIndexes();

		 assert.ok(this.oFilterProvider._aFilterBarViewMetadata);
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata.length, 3);
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[0].key, "group2");
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[1].key, "group3");
		 assert.equal(this.oFilterProvider._aFilterBarViewMetadata[2].key, "group1");
	 });

	 QUnit.test("Method _getGroupLabel shall return the label from the additional configuration if specified", function(assert) {
		 var sLabel;

		 // Call CUT
		 sLabel = this.oFilterProvider._getGroupLabel({}, {
			 label: "Hello World"
		 });

		 assert.equal(sLabel, "Hello World");
	 });

	 QUnit.test("Method _getGroupLabel shall return the label from the OData metadata if there is no additional configuration", function(assert) {
		 var sLabel;

		 // Call CUT
		 sLabel = this.oFilterProvider._getGroupLabel({
			 groupLabel: "ODataLabel"
		 }, undefined);

		 assert.equal(sLabel, "ODataLabel");
	 });

	 QUnit.test("Method _getGroupID shall return the groupId from the additional configuration if specified, ignoring metadata", function(assert) {
		 var sGroupID;
		 sGroupID = this.oFilterProvider._getGroupID({
			 requiredFilterField: true
		 }, {
			 groupId: "Some_Group"
		 });
		 assert.strictEqual(sGroupID, "Some_Group");
	 });

	 QUnit.test("Method _getGroupID shall return the groupId  as '_BASIC' if field is required in metadata,  and no additional configuration is specified", function(assert) {
		 var sGroupID;
		 sGroupID = this.oFilterProvider._getGroupID({
			 requiredFilterField: true
		 }, {});
		 assert.strictEqual(sGroupID, "_BASIC");
	 });

	 QUnit.test("Method _createControl shall return the custom control if it is specified in the additional configuration", function(assert) {
		 var oControl, oControlActual;

		 oControl = new Input();

		 // Call CUT
		 oControlActual = this.oFilterProvider._createControl({
			 customControl: oControl
		 });

		 assert.equal(oControlActual, oControl);
	 });

	 QUnit.test("Method _createControl shall set MaxLength according to the metadata if the controlType is sap.m.Input", function(assert) {
		 sinon.spy(Input.prototype, "setMaxLength");
		 var oFieldViewMetadata = {
			 fControlConstructor: Input,
			 fieldName: "foo",
			 maxLength: "10",
			 name: "foofoo",
			 groupName: "fooGroup"
		 };

		 this.oFilterProvider._oSmartFilter = new ManagedObject("aTestId");

		 this.oFilterProvider._createControl(oFieldViewMetadata);

		 assert.strictEqual(Input.prototype.setMaxLength.calledOnce, true);
		 assert.strictEqual(Input.prototype.setMaxLength.calledWith(10), true);
		 Input.prototype.setMaxLength.restore();
		 this.oFilterProvider._oSmartFilter.destroy();
	 });

	 QUnit.test("Method _createControl shall create type from ODataType during binding if the controlType is sap.m.Input", function(assert) {
		 sinon.spy(Input.prototype, "bindProperty");
		 var oFieldViewMetadata = {
			 fControlConstructor: Input,
			 fieldName: "foo",
			 type: "Edm.Decimal",
			 name: "foofoo",
			 groupName: "fooGroup"
		 };

		 this.oFilterProvider._oSmartFilter = new ManagedObject("anotherTestId");

		 this.oFilterProvider._createControl(oFieldViewMetadata);

		 assert.strictEqual(Input.prototype.bindProperty.calledOnce, true);
		 var bindingArgs = Input.prototype.bindProperty.args[0][1];
		 assert.strictEqual(bindingArgs.type instanceof TypeDecimal, true);
		 Input.prototype.bindProperty.restore();
		 this.oFilterProvider._oSmartFilter.destroy();
	 });

	 QUnit.test("Method _getAdditionalConfigurationForCustomFilterFields shall return the the key of all custom filter fields", function(assert) {
		 var aAdditionalCustomFieldConfiguration;

		 this.oFilterProvider._oAdditionalConfiguration = {
			 getControlConfiguration: sinon.stub().returns([
				 {
					 key: "field1"
				 }, {
					 key: "field2"
				 }
			 ])
		 };
		 this.oFilterProvider._aFilterBarFieldNames = [
			 "field2", "field3"
		 ];

		 // Call CUT
		 aAdditionalCustomFieldConfiguration = this.oFilterProvider._getAdditionalConfigurationForCustomFilterFields();

		 assert.ok(aAdditionalCustomFieldConfiguration);
		 assert.equal(aAdditionalCustomFieldConfiguration.length, 1);
		 assert.equal(aAdditionalCustomFieldConfiguration[0].key, "field1");
	 });

	 QUnit.test("Method _getAdditionalConfigurationForCustomGroups shall return the the key of all custom groups", function(assert) {
		 var aAdditionalCustomGroupConfiguration, aODATAGroup;

		 this.oFilterProvider._oAdditionalConfiguration = {
			 getGroupConfiguration: sinon.stub().returns([
				 {
					 key: "group1"
				 }, {
					 key: "custom"
				 }
			 ])
		 };
		 aODATAGroup = [
			 {
				 groupName: "group1"
			 }, {
				 groupName: "group2"
			 }
		 ];

		 // Call CUT
		 aAdditionalCustomGroupConfiguration = this.oFilterProvider._getAdditionalConfigurationForCustomGroups(aODATAGroup);

		 assert.ok(aAdditionalCustomGroupConfiguration);
		 assert.equal(aAdditionalCustomGroupConfiguration.length, 1);
		 assert.equal(aAdditionalCustomGroupConfiguration[0].key, "custom");
	 });

	 QUnit.test("Method _createFieldMetadataForCustomFilterFields shall return undefined if there is no custom control in the additional configuration", function(assert) {
		 var oControlConfiguration, oFieldMetadata;

		 oControlConfiguration = {
			 customControl: undefined
		 };

		 // Call CUT
		 oFieldMetadata = this.oFilterProvider._createFieldMetadataForCustomFilterFields(oControlConfiguration);

		 assert.strictEqual(oFieldMetadata, undefined);
	 });

	 QUnit.test("Method _createFieldMetadataForCustomFilterFields shall return the view metadata for a custom filter fields", function(assert) {
		 var oControlConfiguration, oFieldMetadata;

		 oControlConfiguration = {
			 customControl: new Input(),
			 key: "key",
			 label: "label",
			 groupId: "groupId",
			 index: 5
		 };

		 // Call CUT
		 oFieldMetadata = this.oFilterProvider._createFieldMetadataForCustomFilterFields(oControlConfiguration);

		 assert.ok(oFieldMetadata);
		 assert.ok(oFieldMetadata.control instanceof Input);
		 assert.equal(oFieldMetadata.name, "key");
		 assert.equal(oFieldMetadata.label, "label");
		 assert.equal(oFieldMetadata.groupId, "groupId");
		 assert.equal(oFieldMetadata.index, 5);
		 assert.equal(oFieldMetadata.isVisible, true);

	 });

	 QUnit.test("Method _createFieldMetadataForCustomFilterFields shall set a flag isCustomFilterField in the metadata", function(assert) {
		 var oControlConfiguration, oFieldMetadata;

		 oControlConfiguration = {
			 customControl: new Input(),
			 key: "key",
			 label: "label",
			 groupId: "groupId",
			 index: 5
		 };

		 // Call CUT
		 oFieldMetadata = this.oFilterProvider._createFieldMetadataForCustomFilterFields(oControlConfiguration);

		 assert.ok(oFieldMetadata);
		 assert.strictEqual(oFieldMetadata.isCustomFilterField, true);
	 });

	 QUnit.test("Method _createFieldMetadataForCustomFilterFields shall consider the isVisible flag from the additional configuration", function(assert) {
		 var oControlConfiguration, oFieldMetadata;

		 oControlConfiguration = {
			 customControl: new Input(),
			 key: "key",
			 label: "label",
			 groupId: "groupId",
			 isVisible: false
		 };

		 // Call CUT
		 oFieldMetadata = this.oFilterProvider._createFieldMetadataForCustomFilterFields(oControlConfiguration);

		 assert.strictEqual(oFieldMetadata.isVisible, false);
	 });

	 QUnit.test("Method _createGroupMetadataForCustomGroup shall return the view metadata for a custom filter fields", function(assert) {
		 var oGroupConfiguration, oGroupMetadata;

		 oGroupConfiguration = {
			 key: "key",
			 label: "label",
			 index: 5
		 };

		 // Call CUT
		 oGroupMetadata = this.oFilterProvider._createGroupMetadataForCustomGroup(oGroupConfiguration);

		 assert.ok(oGroupMetadata);
		 assert.equal(oGroupMetadata.groupName, "key");
		 assert.equal(oGroupMetadata.groupLabel, "label");
		 assert.equal(oGroupMetadata.index, 5);
	 });

	 QUnit.test("Method _createInitialModel shall call _createInitialModelForField for every field", function(assert) {
		 var oGroup1, oGroup2;

		 oGroup1 = {
			 groupName: "group1",
			 fields: [
				 {
					 key: "field1"
				 }, {
					 key: "field2"
				 }
			 ]
		 };
		 oGroup2 = {
			 groupName: "group2",
			 fields: [
				 {
					 key: "field3"
				 }
			 ]
		 };
		 this.oFilterProvider._aFilterBarViewMetadata = [
			 oGroup1, oGroup2
		 ];
		 this.oFilterProvider._createInitialModelForField = sinon.stub();

		 // Call CUT
		 this.oFilterProvider._createInitialModel();

		 assert.ok(this.oFilterProvider._createInitialModelForField.calledThrice, "shall be called for every field");
	 });

	 QUnit.test("Method _createInitialModelForField shall update the JSON data for the model for single value", function(assert) {
		 var oJSONData = {};
		 this.oFilterProvider._createInitialModelForField(oJSONData, {
			 fieldName: "field1",
			 filterRestriction: library.smartfilterbar.FilterType.single
		 });

		 assert.strictEqual(oJSONData.field1, null);
	 });

	 QUnit.test("Method _createInitialModelForField shall update the JSON data for the model for mulitple", function(assert) {
		 var oJSONData = {};
		 this.oFilterProvider._createInitialModelForField(oJSONData, {
			 fieldName: "field1",
			 filterRestriction: library.smartfilterbar.FilterType.multiple
		 });

		 assert.deepEqual(oJSONData.field1, {
			 value: null,
			 items: []
		 });
	 });

	 QUnit.test("Method _createInitialModelForField shall update the JSON data for the model for empty/unrstricted", function(assert) {
		 var oJSONData = {};
		 this.oFilterProvider._createInitialModelForField(oJSONData, {
			 fieldName: "field1",
			 filterRestriction: library.smartfilterbar.FilterType.auto
		 });

		 assert.deepEqual(oJSONData.field1, {
			 value: null,
			 ranges: [],
			 items: []
		 });
	 });

	 QUnit.test("Method _createInitialModelForField shall update the JSON data for the model for interval", function(assert) {
		 var oJSONData = {};
		 this.oFilterProvider._createInitialModelForField(oJSONData, {
			 fieldName: "field1",
			 filterRestriction: library.smartfilterbar.FilterType.interval
		 });

		 assert.deepEqual(oJSONData.field1, {
			 low: null,
			 high: null
		 });
	 });

	 QUnit.test("Method _createInitialModelForField shall not handle custom filter fields", function(assert) {
		 var oJSONData = {};

		 // Call CUT
		 this.oFilterProvider._createInitialModelForField(oJSONData, {
			 fieldName: "field1",
			 isCustomFilterField: true
		 });

		 assert.strictEqual(oJSONData.field1, undefined);
	 });

	 QUnit.test("Method _createFieldMetadata shall set a flag isCustomFilterField to false if there is no custom control", function(assert) {
		 var oFieldMetadata;

		 this.oFilterProvider._oAdditionalConfiguration = {
			 getControlConfigurationByKey: sinon.stub()
		 };

		 // Call CUT
		 oFieldMetadata = this.oFilterProvider._createFieldMetadata({
			 name: "foo"
		 });

		 assert.strictEqual(oFieldMetadata.isCustomFilterField, false);
	 });

	 QUnit.test("Method _createFieldMetadata shall set a flag isCustomFilterField if there is a custom control in the additional configuration", function(assert) {
		 var oODataMetadata, oFieldMetadata, oControlConfiguration;

		 oODataMetadata = {
			 name: "foo"
		 };
		 oControlConfiguration = {
			 customControl: new Input()
		 };
		 this.oFilterProvider._oAdditionalConfiguration = {
			 getControlConfigurationByKey: sinon.stub().returns(oControlConfiguration)
		 };

		 // Call CUT
		 oFieldMetadata = this.oFilterProvider._createFieldMetadata(oODataMetadata);

		 assert.strictEqual(oFieldMetadata.isCustomFilterField, true);
	 });

	 QUnit.test("Method _createFieldMetadata shall set a flag isCustomFilterField if there is a custom control in the additional configuration", function(assert) {
		 var oODataMetadata, oFieldMetadata, oControlConfiguration;

		 oODataMetadata = {
			 name: "foo"
		 };
		 oControlConfiguration = {
			 customControl: new Input()
		 };
		 this.oFilterProvider._oAdditionalConfiguration = {
			 getControlConfigurationByKey: sinon.stub().returns(oControlConfiguration)
		 };

		 // Call CUT
		 oFieldMetadata = this.oFilterProvider._createFieldMetadata(oODataMetadata);

		 assert.strictEqual(oFieldMetadata.isCustomFilterField, true);
	 });

	 QUnit.test("Method _getFilterRestriction shall return auto if there are no additional information in OData or control configuration", function(assert) {
		 var oODataMetadata, sFilterRestriction, oControlConfiguration;

		 oODataMetadata = {};
		 oControlConfiguration = {};

		 // Call CUT
		 sFilterRestriction = this.oFilterProvider._getFilterRestriction(oODataMetadata, oControlConfiguration);

		 assert.equal(sFilterRestriction, library.smartfilterbar.FilterType.auto);
	 });

	 QUnit.test("Method _getFilterRestriction shall return the filter type from the additional configuration if specified", function(assert) {
		 var oODataMetadata, sFilterRestriction, oControlConfiguration;

		 oODataMetadata = {};
		 oControlConfiguration = {
			 filterType: library.smartfilterbar.FilterType.interval
		 };

		 // Call CUT
		 sFilterRestriction = this.oFilterProvider._getFilterRestriction(oODataMetadata, oControlConfiguration);

		 assert.equal(sFilterRestriction, library.smartfilterbar.FilterType.interval);
	 });

	 QUnit.test("Method _getFilterRestriction shall return the filter type from the OData metadata if there is no additional configuration", function(assert) {
		 var oODataMetadata, sFilterRestriction;

		 oODataMetadata = {
			 filterRestriction: "multi-value"
		 };

		 // Call CUT
		 sFilterRestriction = this.oFilterProvider._getFilterRestriction(oODataMetadata);

		 assert.equal(sFilterRestriction, library.smartfilterbar.FilterType.multiple);
	 });

	 QUnit.test("Method _getFilterRestriction shall return the value from the additional config as this overrides the OData metadata", function(assert) {
		 var oODataMetadata, sFilterRestriction, oControlConfiguration;

		 oODataMetadata = {
			 filterRestriction: "multi-value"
		 };
		 oControlConfiguration = {
			 filterType: library.smartfilterbar.FilterType.interval
		 };

		 // Call CUT
		 sFilterRestriction = this.oFilterProvider._getFilterRestriction(oODataMetadata, oControlConfiguration);

		 assert.equal(sFilterRestriction, library.smartfilterbar.FilterType.interval);
	 });

	 QUnit.test("Method _getFilterRestriction shall return the value from the ODAata metadata if the additional config is set to 'auto'", function(assert) {
		 var oODataMetadata, sFilterRestriction, oControlConfiguration;

		 oODataMetadata = {
			 filterRestriction: "multi-value"
		 };
		 oControlConfiguration = {
			 filterType: library.smartfilterbar.FilterType.auto
		 };

		 // Call CUT
		 sFilterRestriction = this.oFilterProvider._getFilterRestriction(oODataMetadata, oControlConfiguration);

		 assert.equal(sFilterRestriction, library.smartfilterbar.FilterType.multiple);
	 });

	 QUnit.test("Method _hasValueHelpDialog shall return false if the control type is set to dropdown", function(assert) {
		 var bHasValueHelpDialog;

		 // Call CUT
		 bHasValueHelpDialog = this.oFilterProvider._hasValueHelpDialog(null, {
			 controlType: library.smartfilterbar.ControlType.dropDownList,
			 hasValueHelpDialog: true
		 });

		 assert.strictEqual(bHasValueHelpDialog, false, "There shall be no value help dialog for a drop down list box");
	 });

	 QUnit.test("Method _hasValueHelpDialog shall return false, if there are no ValueHelp Annotations and there is a filter-restriction", function(assert) {
		 var bHasValueHelpDialog, oFieldViewMetadata;
		 oFieldViewMetadata = {
			 filterRestriction: library.smartfilterbar.FilterType.single,
			 oValueListAnnotation: undefined
		 };

		 // Call CUT
		 bHasValueHelpDialog = this.oFilterProvider._hasValueHelpDialog(oFieldViewMetadata, undefined);

		 assert.strictEqual(bHasValueHelpDialog, false);
	 });

	 QUnit.test("Method _hasValueHelpDialog shall return true, if there are no ValueHelp Annotations and is no filter-restriction", function(assert) {
		 var bHasValueHelpDialog, oFieldViewMetadata;
		 oFieldViewMetadata = {
			 filterRestriction: library.smartfilterbar.FilterType.auto,
			 oValueListAnnotation: undefined
		 };

		 // Call CUT
		 bHasValueHelpDialog = this.oFilterProvider._hasValueHelpDialog(oFieldViewMetadata, undefined);

		 assert.strictEqual(bHasValueHelpDialog, true);
	 });

	 QUnit.test("Method _getControlType shall return the value from the additional configuration (if specified)", function(assert) {
		 var sControlType;

		 // Call CUT
		 sControlType = this.oFilterProvider._getControlType({
			 type: "Edm.DateTime",
			 displayFormat: "Date"
		 }, {
			 controlType: library.smartfilterbar.ControlType.input
		 });

		 assert.equal(sControlType, library.smartfilterbar.ControlType.input);
	 });

	 QUnit.test("Method _getControlType shall return 'date' if specified in OData metadata and not overwritten in additional configuration", function(assert) {
		 var sControlType;

		 // Call CUT
		 sControlType = this.oFilterProvider._getControlType({
			 type: "Edm.DateTime",
			 displayFormat: "Date"
		 }, undefined);

		 assert.equal(sControlType, library.smartfilterbar.ControlType.date);
	 });

	 QUnit.test("Method _getControlType shall return 'input' if the type from OData metadata NE string and not overwritten in additional configuration", function(assert) {
		 var sControlType;

		 // Call CUT
		 sControlType = this.oFilterProvider._getControlType({
			 type: "foo"
		 }, undefined);

		 assert.equal(sControlType, library.smartfilterbar.ControlType.input);
	 });

	 QUnit.test("Method Get Filter Data", function(assert) {
		 this.oFilterProvider.oModel.setData(this.oJson);
		 var oResult = this.oFilterProvider.getFilterData();
		 assert.deepEqual(oResult, this.oJson);
	 });

	 QUnit.test("Method Get Filter Data as String", function(assert) {
		 this.oFilterProvider.oModel.setJSON(this.sJson);
		 var sResult = this.oFilterProvider.getFilterDataAsString();
		 assert.strictEqual(sResult, this.sJson);
	 });

	 QUnit.test("Method Get Only Filled Filter Data without field names", function(assert) {
		 this.oFilterProvider.oModel.setData(this.oJson);
		 var oResult = this.oFilterProvider.getFilledFilterData();
		 assert.deepEqual(oResult, {});
	 });

	 QUnit.test("Method Get Only Filled Filter Data", function(assert) {
		 this.oFilterProvider.oModel.setData(this.oJson);
		 var aFieldNames = [];
		 for ( var sName in this.oJson) {
			 aFieldNames.push(sName);
		 }
		 var oResult = this.oFilterProvider.getFilledFilterData(aFieldNames);
		 assert.deepEqual(oResult, this.oNonEmptyJson);
	 });

	 QUnit.test("Method Get Only Filled Filter Data as String", function(assert) {
		 this.oFilterProvider.oModel.setJSON(this.sJson);
		 var aFieldNames = [];
		 for ( var sName in this.oJson) {
			 aFieldNames.push(sName);
		 }
		 var sResult = this.oFilterProvider.getFilledFilterDataAsString(aFieldNames);
		 var oResult = JSON.parse(sResult);
		 assert.deepEqual(oResult, this.oNonEmptyJson);
	 });

	 QUnit.test("Method Set Filter Data without replace", function(assert) {
		 this.oFilterProvider.oModel.setData(this.oJson);
		 var oJson = {
			 "SomeCrap": ""
		 };
		 this.oFilterProvider.setFilterData(oJson, false);
		 var oResult = this.oFilterProvider.oModel.getData();
		 assert.deepEqual(oResult, this.oJson);
	 });

	 QUnit.test("Method Set Filter Data as string without replace", function(assert) {
		 this.oFilterProvider.oModel.setData(this.oJson);
		 var sJson = '{"SomeCrap":""}';
		 this.oFilterProvider.setFilterDataAsString(sJson, false);
		 var sResult = this.oFilterProvider.oModel.getJSON();
		 assert.strictEqual(sResult, this.sJson);
	 });

	 QUnit.test("Method Set Filter Data by replacing existing data", function(assert) {
		 this.oFilterProvider.oModel.setData(this.oJson);
		 var oJson = {
			 "SomeCrap": ""
		 };
		 this.oFilterProvider.setFilterData(oJson, true);
		 var oResult = this.oFilterProvider.oModel.getData();
		 assert.deepEqual(oResult, oJson);
	 });

	 QUnit.test("Method Set Filter Data as string by replacing existing data", function(assert) {
		 this.oFilterProvider.oModel.setData(this.oJson);
		 var oJson = {
			 "SomeCrap": ""
		 };
		 var sJson = JSON.stringify(oJson);
		 this.oFilterProvider.setFilterDataAsString(sJson, true);
		 var sResult = this.oFilterProvider.oModel.getJSON();
		 assert.strictEqual(sResult, sJson);
	 });

	 QUnit.test("Method _hasBasicSearch shall return false if there is basic search is disabled ", function(assert) {
		 var bHasBasicSearch;
		 this.oFilterProvider = new FilterProvider({
			 entityType: "foo",
			 model: oModel,
			 basicSearchFieldName: undefined,
			 enableBasicSearch: false
		 });

		 // Call CUT
		 bHasBasicSearch = this.oFilterProvider._hasBasicSearch();

		 assert.strictEqual(bHasBasicSearch, false);
	 });

	 QUnit.test("Method _createBasicSearchFieldMetadata shall create a sap.m.SearchField", function(assert) {
		 var bBasicSearchFieldMetadata;

		 var oSmartFilter = {
			 getId: function() {
				 return "SmartFilterBar";
			 }
		 };

		 this.oFilterProvider = new FilterProvider({
			 entityType: "COMPANY",
			 model: oModel,
			 basicSearchFieldName: "CompanyCode",
			 smartFilter: oSmartFilter
		 });

		 // Call CUT
		 bBasicSearchFieldMetadata = this.oFilterProvider._createBasicSearchFieldMetadata();

		 assert.ok(bBasicSearchFieldMetadata);
		 assert.ok(bBasicSearchFieldMetadata.control instanceof SearchField);
		 assert.equal(bBasicSearchFieldMetadata.groupId, FilterProvider.BASIC_FILTER_AREA_ID);
	 });

	 QUnit.test("Method considerAnalyticParameters ", function(assert) {
		 sinon.stub(MetadataAnalyser.prototype, "getParametersByEntitySetName");
		 this.oFilterProvider = new FilterProvider({
			 entityType: "foo",
			 model: oModel,
			 considerAnalyticalParameters: true
		 });

		 assert.ok(this.oFilterProvider._bConsiderAnalyticalParameters);
		 MetadataAnalyser.prototype.getParametersByEntitySetName.restore();
	 });

	 QUnit.test("Method _createParameters ", function(assert) {

		 sinon.stub(this.oFilterProvider, "_getAnalyticParameterization");
		 sinon.stub(this.oFilterProvider, "_createAnalyticalParameters");
		 sinon.stub(this.oFilterProvider, "_createNonAnalyticalParameters");

		 sinon.stub(this.oFilterProvider._oMetadataAnalyser, "isSemanticAggregation").returns(true);

		 this.oFilterProvider._createParameters();
		 assert.ok(!this.oFilterProvider._createAnalyticalParameters.called);
		 assert.ok(!this.oFilterProvider._createNonAnalyticalParameters.called);

		 this.oFilterProvider.sEntitySet = {};
		 this.oFilterProvider._createNonAnalyticalParameters.reset();
		 this.oFilterProvider._oMetadataAnalyser.isSemanticAggregation.restore();
		 sinon.stub(this.oFilterProvider._oMetadataAnalyser, "isSemanticAggregation").returns(false);
		 this.oFilterProvider._createParameters();

		 assert.ok(!this.oFilterProvider._createAnalyticalParameters.called);
		 assert.ok(this.oFilterProvider._createNonAnalyticalParameters.called);

		 this.oFilterProvider._bConsiderAnalyticalParameters = true;
		 this.oFilterProvider._oMetadataAnalyser.isSemanticAggregation.restore();
		 sinon.stub(this.oFilterProvider._oMetadataAnalyser, "isSemanticAggregation").returns(true);
		 this.oFilterProvider._createNonAnalyticalParameters.reset();

		 this.oFilterProvider._createParameters();

		 var done = assert.async();
		 Promise.all(this.oFilterProvider._aPromises).then(function() {
			 assert.ok(this.oFilterProvider._createAnalyticalParameters.called);
			 assert.ok(!this.oFilterProvider._createNonAnalyticalParameters.called);
			 done();
		 }.bind(this));

	 });

	 QUnit.test("Method _createAnalyticParameters ", function(assert) {

		 var oParameterization = {
			 getAllParameterNames: function() {
				 return [
					 "A", "B"
				 ];
			 },
			 getEntitySet: function() {
				 return {
					 getQName: sinon.stub()
				 };
			 }
		 };

		 this.oFilterProvider._oMetadataAnalyser = {
			 getFieldsByEntitySetName: function() {
				 return [
					 {
						 name: "A",
						 visible: true
					 }, {
						 name: "B",
						 visible: true
					 }, {
						 name: "C",
						 visible: true
					 }
				 ];
			 }
		 };

		 this.oFilterProvider._createFieldMetadata = function(o) {
			 return o;
		 };

		 this.oFilterProvider._createAnalyticParameters(oParameterization);
		 assert.equal(this.oFilterProvider._aAnalyticalParameters.length, 2);
		 assert.equal(this.oFilterProvider._aAnalyticalParameters[0].fieldName, "$Parameter.A");
		 assert.equal(this.oFilterProvider._aAnalyticalParameters[1].fieldName, "$Parameter.B");

		 this.oFilterProvider._oMetadataAnalyser = {
			 getFieldsByEntitySetName: function() {
				 return [
					 {
						 name: "A",
						 visible: false
					 }, {
						 name: "B",
						 visible: true
					 }, {
						 name: "C",
						 visible: true
					 }
				 ];
			 }
		 };

		 this.oFilterProvider._aAnalyticalParameters = [];
		 this.oFilterProvider._createAnalyticParameters(oParameterization);
		 assert.equal(this.oFilterProvider._aAnalyticalParameters.length, 1);
		 assert.equal(this.oFilterProvider._aAnalyticalParameters[0].fieldName, "$Parameter.B");
	 });

	 QUnit.test("Method _createNonAnalyticalParameters ", function(assert) {

		 var oParameterization = {
			 entitySetName: "EntitySet",
			 navPropertyName: "Results",
			 parameters: [
				 "A", "B"
			 ]
		 };
		 this.oFilterProvider.sEntitySet = {};

		 sinon.stub(this.oFilterProvider._oMetadataAnalyser, "getParametersByEntitySetName").returns(oParameterization);
		 sinon.stub(this.oFilterProvider._oMetadataAnalyser, "getFieldsByEntitySetName").returns([
			 {
				 name: "A",
				 visible: true
			 }, {
				 name: "B",
				 visible: true
			 }, {
				 name: "C",
				 visible: true
			 }
		 ]);

		 this.oFilterProvider._createFieldMetadata = function(o) {
			 return o;
		 };

		 this.oFilterProvider._createNonAnalyticalParameters();
		 assert.equal(this.oFilterProvider._aAnalyticalParameters.length, 2);
		 assert.equal(this.oFilterProvider._aAnalyticalParameters[0].fieldName, "$Parameter.A");
		 assert.equal(this.oFilterProvider._aAnalyticalParameters[1].fieldName, "$Parameter.B");

		 this.oFilterProvider._oMetadataAnalyser.getFieldsByEntitySetName.restore();
		 sinon.stub(this.oFilterProvider._oMetadataAnalyser, "getFieldsByEntitySetName").returns([
			 {
				 name: "A",
				 visible: false
			 }, {
				 name: "B",
				 visible: true
			 }, {
				 name: "C",
				 visible: true
			 }
		 ]);

		 this.oFilterProvider._aAnalyticalParameters = [];
		 this.oFilterProvider._createNonAnalyticalParameters();
		 assert.equal(this.oFilterProvider._aAnalyticalParameters.length, 1);
		 assert.equal(this.oFilterProvider._aAnalyticalParameters[0].fieldName, "$Parameter.B");
	 });

	 QUnit.test("Method _createNonAnalyticalParameters with custom filter", function(assert) {

		 var oParameterization = {
			 entitySetName: "EntitySet",
			 navPropertyName: "Results",
			 parameters: [
				 "A", "B"
			 ]
		 };
		 this.oFilterProvider.sEntitySet = {};

		 sinon.stub(this.oFilterProvider._oMetadataAnalyser, "getParametersByEntitySetName").returns(oParameterization);
		 sinon.stub(this.oFilterProvider._oMetadataAnalyser, "getFieldsByEntitySetName").returns([
			 {
				 name: "A",
				 visible: true
			 }, {
				 name: "B",
				 visible: true
			 }, {
				 name: "C",
				 visible: true
			 }
		 ]);

		 this.oFilterProvider._createFieldMetadata = function(o) {
			 return o;
		 };

		 this.oFilterProvider._createNonAnalyticalParameters();
		 assert.equal(this.oFilterProvider._aAnalyticalParameters.length, 2);
		 assert.equal(this.oFilterProvider._aAnalyticalParameters[0].fieldName, "$Parameter.A");
		 assert.equal(this.oFilterProvider._aAnalyticalParameters[1].fieldName, "$Parameter.B");

		 this.oFilterProvider._oMetadataAnalyser.getFieldsByEntitySetName.restore();
		 sinon.stub(this.oFilterProvider._oMetadataAnalyser, "getFieldsByEntitySetName").returns([
			 {
				 name: "A",
				 visible: true
			 }, {
				 name: "B",
				 visible: true
			 }, {
				 name: "C",
				 visible: true
			 }
		 ]);

		 this.oFilterProvider._createFieldMetadata = function(o) {
			 if (o.name === "A") {
				 o.isCustomFilterField = true;
			 }
			 return o;
		 };

		 this.oFilterProvider._aAnalyticalParameters = [];
		 this.oFilterProvider._createNonAnalyticalParameters();
		 assert.equal(this.oFilterProvider._aAnalyticalParameters.length, 1);
		 assert.equal(this.oFilterProvider._aAnalyticalParameters[0].fieldName, "$Parameter.B");
	 });

	 QUnit.test("Method _createAnalyticParameterMetadata ", function(assert) {

		 var oObjA = {
			 name: "A"
		 };
		 var oObjB = {
			 name: "B",
			 defaultPropertyValue: "EUR"
		 };
		 var oObjC = {
			 name: "C",
			 defaultPropertyValue: "USD"
		 };

		 var oStub = sinon.stub(this.oFilterProvider, "_createFieldMetadata").returns({});
		 oStub.withArgs(oObjA).returns(oObjA);
		 oStub.withArgs(oObjB).returns(oObjB);
		 oStub.withArgs(oObjC).returns(oObjC);

		 var oParam = this.oFilterProvider._createAnalyticParameterMetadata(oObjA);
		 assert.ok(oParam);
		 assert.ok(oParam.isParameter);
		 assert.ok(oParam.isMandatory);
		 assert.ok(oParam.visibleInAdvancedArea);
		 assert.equal(oParam.fieldName, "$Parameter.A");
		 assert.ok(!oParam.defaultFilterValues);

		 oParam = this.oFilterProvider._createAnalyticParameterMetadata(oObjB);
		 assert.ok(oParam);
		 assert.ok(oParam.isParameter);
		 assert.ok(oParam.isMandatory);
		 assert.ok(oParam.visibleInAdvancedArea);
		 assert.equal(oParam.fieldName, "$Parameter.B");
		 assert.deepEqual(oParam.defaultPropertyValue, "EUR");

		 oParam = this.oFilterProvider._createAnalyticParameterMetadata(oObjC);
		 assert.ok(oParam);
		 assert.ok(oParam.isParameter);
		 assert.ok(oParam.isMandatory);
		 assert.ok(oParam.visibleInAdvancedArea);
		 assert.equal(oParam.fieldName, "$Parameter.C");
		 assert.deepEqual(oParam.defaultPropertyValue, "USD");
	 });

	 QUnit.test("Method getAnalyticBindingPath ", function(assert) {

		 sinon.stub(this.oFilterProvider, "getAnalyticParameters").returns([
			 {
				 fieldName: 'p.A'
			 }
		 ]);
		 sinon.stub(this.oFilterProvider, "getFilledFilterData").returns({
			 'p.A': "A"
		 });
		 this.oFilterProvider._oParameterization = {};
		 var oStub = sinon.stub(this.oFilterProvider, "_createAnalyticBindingPath");

		 this.oFilterProvider.getAnalyticBindingPath();
		 assert.ok(oStub.calledOnce);
	 });

	 QUnit.test("Method getAnalyticBindingPath for non analytical services", function(assert) {

		 sinon.stub(this.oFilterProvider, "getAnalyticParameters").returns([
			 {
				 fieldName: 'p.A'
			 }
		 ]);
		 sinon.stub(this.oFilterProvider, "getFilledFilterData").returns({
			 'p.A': "A"
		 });
		 var oStub = sinon.stub(this.oFilterProvider, "_createNonAnalyticBindingPath");

		 this.oFilterProvider.getAnalyticBindingPath();
		 assert.ok(oStub.calledOnce);
	 });

	 QUnit.test("Method _createAnalyticBindingPath ", function(assert) {

		 var sResult = "", sPeriod = "";
		 var oParamRequest = {
			 setParameterValue: function(a, v) {
				 sResult += (sPeriod + a + '=' + v);
				 sPeriod = ",";
				 return sResult;
			 },
			 getURIToParameterizationEntry: function() {
				 sResult = "/EntitySet(" + sResult + ")";
				 return sResult;
			 }
		 };

		 this.oFilterProvider._oParameterization = {
			 getNavigationPropertyToQueryResult: sinon.stub().returns("Results")
		 };

		 sinon.stub(this.oFilterProvider, "_getParameterizationRequest").returns(oParamRequest);

		 var sPath = this.oFilterProvider._createAnalyticBindingPath([
			 {
				 name: 'name1',
				 fieldName: 'p.name1'
			 }, {
				 name: 'name2',
				 fieldName: 'p.name2'
			 }
		 ], {
			 'p.name1': 'a',
			 'p.name2': 'b'
		 });

		 assert.ok(sPath);
		 assert.equal(sPath, "/EntitySet(name1=a,name2=b)/Results");
	 });

	 QUnit.test("Method _createNonAnalyticBindingPath ", function(assert) {

		 this.oFilterProvider._oNonAnaParameterization = {
			 entitySetName: "EntitySet",
			 navPropertyName: "Results",
			 parameters: [
				 "name1", "name2"
			 ]
		 };

		 this.oFilterProvider._oParentODataModel = {
			 formatValue: function(v, t) {
				 return v;
			 }
		 };

		 var sPath = this.oFilterProvider._createNonAnalyticBindingPath([
			 {
				 name: 'name1',
				 fieldName: 'p.name1'
			 }, {
				 name: 'name2',
				 fieldName: 'p.name2'
			 }
		 ], {
			 'p.name1': 'a',
			 'p.name2': 'b'
		 });

		 assert.ok(sPath);
		 assert.equal(sPath, "/EntitySet(name1=a,name2=b)/Results");
	 });

	 QUnit.test("Method _createAnalyticBindingPath with Date", function(assert) {

		 var sResult = "";
		 var oParamRequest = {
			 setParameterValue: function(a, v) {
				 sResult += (a + '=' + v.getUTCDate());
				 return sResult;
			 },
			 getURIToParameterizationEntry: function() {
				 sResult = "/EntitySet(" + sResult + ")";
				 return sResult;
			 }
		 };

		 this.oFilterProvider._oParameterization = {
			 getNavigationPropertyToQueryResult: sinon.stub().returns("Results")
		 };

		 sinon.stub(this.oFilterProvider, "_getParameterizationRequest").returns(oParamRequest);

		 var oDate = new Date("2017-04-22T12:00:00.000Z");

		 this.oFilterProvider._oDateFormatSettings = null;

		 var sPath = this.oFilterProvider._createAnalyticBindingPath([
			 {
				 name: 'name1',
				 fieldName: 'p.name1'
			 }
		 ], {
			 'p.name1': oDate
		 });
		 assert.ok(sPath);
		 assert.equal(sPath, "/EntitySet(name1=22)/Results");

		 sResult = "";
		 this.oFilterProvider._oDateFormatSettings = {
			 UTC: true
		 };

		 sPath = this.oFilterProvider._createAnalyticBindingPath([
			 {
				 name: 'name1',
				 fieldName: 'p.name1'
			 }
		 ], {
			 'p.name1': oDate
		 });
		 assert.ok(sPath);
		 assert.equal(sPath, "/EntitySet(name1=22)/Results");

	 });

	 QUnit.test("check enhanced DateRangeType handling", function(assert) {

		 var oFieldMetadata = {}, oFieldEnrichtedMetadata;

		 sinon.stub(this.oFilterProvider, "_getFieldName").returns("fieldName");
		 sinon.stub(this.oFilterProvider, "_getControlConstructor").returns(DateRangeSelection);

		 var done = assert.async();

		 oFieldEnrichtedMetadata = this.oFilterProvider._createFieldMetadata(oFieldMetadata);
		 assert.ok(!oFieldEnrichtedMetadata.conditionType);

		 this.oFilterProvider._bUseDateRangeType = true;
		 sap.ui.require([
			 "sap/ui/comp/config/condition/DateRangeType"
		 ], function(fConditionType) {

			 oFieldEnrichtedMetadata = this.oFilterProvider._createFieldMetadata(oFieldMetadata);
			 assert.ok(oFieldEnrichtedMetadata.conditionType);

			 done();

		 }.bind(this));

	 });

	 QUnit.test("Method _createInitialModelForField for Edm.DateTime and displayFormat === 'Date' ", function(assert) {
		 var oJSONData = {};

		 var aDefaultValues = [
			 {
				 low: "2016-08-26T00:00:00.000",
				 high: "2016-11-20T00:00:00.000"
			 }
		 ];

		 var oFilterMetadaData = {
			 fieldName: "field1",
			 filterType: "date",
			 filterRestriction: "single",
			 type: "Edm.DateTime",
			 displayFormat: "Date",
			 defaultFilterValues: aDefaultValues
		 };

		 this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
		 assert.deepEqual(oJSONData.field1, new Date(aDefaultValues[0].low));

		 oJSONData = {};
		 oFilterMetadaData.filterRestriction = "interval";
		 this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
		 assert.deepEqual(oJSONData.field1.low, new Date(aDefaultValues[0].low));
		 assert.deepEqual(oJSONData.field1.high, new Date(aDefaultValues[0].high));

		 aDefaultValues = [
			 {
				 low: "2016-08-26T00:00:00.000",
				 high: ""
			 }, {
				 low: "2016-08-27T00:00:00.000",
				 high: ""
			 }, {
				 low: "2016-08-28T00:00:00.000",
				 high: ""
			 }
		 ];
		 oJSONData = {};
		 oFilterMetadaData.filterRestriction = "auto";
		 oFilterMetadaData.defaultFilterValues = aDefaultValues;
		 this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
		 assert.ok(oJSONData.field1.ranges);
		 assert.equal(oJSONData.field1.ranges.length, 3);
		 assert.deepEqual(oJSONData.field1.ranges[0].value1, new Date(aDefaultValues[2].low));
		 assert.deepEqual(oJSONData.field1.ranges[1].value1, new Date(aDefaultValues[1].low));
		 assert.deepEqual(oJSONData.field1.ranges[2].value1, new Date(aDefaultValues[0].low));

		 oJSONData = {};
		 oFilterMetadaData.filterRestriction = "multiple";
		 this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
		 assert.ok(oJSONData.field1.items);
		 assert.equal(oJSONData.field1.items.length, 3);
		 assert.deepEqual(oJSONData.field1.items[0].key, new Date(aDefaultValues[2].low));
		 assert.deepEqual(oJSONData.field1.items[1].key, new Date(aDefaultValues[1].low));
		 assert.deepEqual(oJSONData.field1.items[2].key, new Date(aDefaultValues[0].low));

	 });

	 //TODO this test is testing DateTime and not Time
	 // QUnit.test("Method _createInitialModelForField for Edm.Time", function(assert) {
	 // 	var oJSONData = {};

	 // 	var aDefaultValues = [
	 // 		{
	 // 			low: "2016-08-26T20:00:00.000Z",
	 // 			high: "2016-11-20T20:00:00.000Z"
	 // 		}
	 // 	];

	 // 	var oFilterMetadaData = {
	 // 		fieldName: "field1",
	 // 		filterType: "time",
	 // 		type: "Edm.Time",
	 // 		filterRestriction: "single",
	 // 		defaultFilterValues: aDefaultValues
	 // 	};

	 // 	this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
	 // 	assert.deepEqual(oJSONData.field1, new Date(aDefaultValues[0].low));

	 // 	oJSONData = {};
	 // 	oFilterMetadaData.filterRestriction = "interval";
	 // 	this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
	 // 	assert.deepEqual(oJSONData.field1.low, new Date(aDefaultValues[0].low));
	 // 	assert.deepEqual(oJSONData.field1.high, new Date(aDefaultValues[0].high));

	 // 	aDefaultValues = [
	 // 		{
	 // 			low: "2016-08-26T20:00:00.000Z",
	 // 			high: ""
	 // 		}, {
	 // 			low: "2016-08-27T20:00:00.000Z",
	 // 			high: ""
	 // 		}, {
	 // 			low: "2016-08-28T20:00:00.000Z",
	 // 			high: ""
	 // 		}
	 // 	];
	 // 	oJSONData = {};
	 // 	oFilterMetadaData.filterRestriction = "auto";
	 // 	oFilterMetadaData.defaultFilterValues = aDefaultValues;
	 // 	this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
	 // 	assert.ok(oJSONData.field1.ranges);
	 // 	assert.equal(oJSONData.field1.ranges.length, 3);
	 // 	assert.deepEqual(oJSONData.field1.ranges[0].value1, new Date(aDefaultValues[2].low));
	 // 	assert.deepEqual(oJSONData.field1.ranges[1].value1, new Date(aDefaultValues[1].low));
	 // 	assert.deepEqual(oJSONData.field1.ranges[2].value1, new Date(aDefaultValues[0].low));

	 // 	oJSONData = {};
	 // 	oFilterMetadaData.filterRestriction = "multiple";
	 // 	this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
	 // 	assert.ok(oJSONData.field1.items);
	 // 	assert.equal(oJSONData.field1.items.length, 3);
	 // 	assert.deepEqual(oJSONData.field1.items[0].key, new Date(aDefaultValues[2].low));
	 // 	assert.deepEqual(oJSONData.field1.items[1].key, new Date(aDefaultValues[1].low));
	 // 	assert.deepEqual(oJSONData.field1.items[2].key, new Date(aDefaultValues[0].low));

	 // });

	 // QUnit.test("Method _createInitialModelForField for Date with default values passed by the DefaultFilterValue annotation", function(assert) {
	 // 	var oJSONData = {};

	 // 	var oFilterMetadaData = {
	 // 		fieldName: "field1",
	 // 		filterType: "date",
	 // 		filterRestriction: "single",
	 // 		defaultFilterValue: "2015-12-24"
	 // 	};

	 // 	this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
	 // 	assert.deepEqual(oJSONData.field1, new Date(oFilterMetadaData.defaultFilterValue));

	 // 	oFilterMetadaData.defaultFilterValue = "2016-08-26T20:00:00.000Z";

	 // 	oJSONData = {};
	 // 	oFilterMetadaData.filterRestriction = "interval";
	 // 	this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
	 // 	assert.deepEqual(oJSONData.field1.low, new Date(oFilterMetadaData.defaultFilterValue));
	 // 	assert.deepEqual(oJSONData.field1.high, new Date(oFilterMetadaData.defaultFilterValue));

	 // 	oJSONData = {};
	 // 	oFilterMetadaData.filterRestriction = "auto";
	 // 	this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
	 // 	assert.ok(oJSONData.field1.ranges);
	 // 	assert.equal(oJSONData.field1.ranges.length, 1);
	 // 	assert.deepEqual(oJSONData.field1.ranges[0].value1, new Date(oFilterMetadaData.defaultFilterValue));

	 // 	oJSONData = {};
	 // 	oFilterMetadaData.filterRestriction = "multiple";
	 // 	this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
	 // 	assert.ok(oJSONData.field1.items);
	 // 	assert.equal(oJSONData.field1.items.length, 1);
	 // 	assert.deepEqual(oJSONData.field1.items[0].key, new Date(oFilterMetadaData.defaultFilterValue));

	 // });

	 // QUnit.test("Method _createInitialModelForField for Time with default values passed by the DefaultFilterValue annotation", function(assert) {
	 // 	var oJSONData = {};

	 // 	var oFilterMetadaData = {
	 // 		fieldName: "field1",
	 // 		filterType: "time",
	 // 		filterRestriction: "single",
	 // 		defaultFilterValue: "2016-08-26T20:00:00.000Z"
	 // 	};

	 // 	this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
	 // 	assert.deepEqual(oJSONData.field1, new Date(oFilterMetadaData.defaultFilterValue));

	 // 	oJSONData = {};
	 // 	oFilterMetadaData.filterRestriction = "interval";
	 // 	this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
	 // 	assert.deepEqual(oJSONData.field1.low, new Date(oFilterMetadaData.defaultFilterValue));
	 // 	assert.deepEqual(oJSONData.field1.high, new Date(oFilterMetadaData.defaultFilterValue));

	 // 	oJSONData = {};
	 // 	oFilterMetadaData.filterRestriction = "auto";
	 // 	this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
	 // 	assert.ok(oJSONData.field1.ranges);
	 // 	assert.equal(oJSONData.field1.ranges.length, 1);
	 // 	assert.deepEqual(oJSONData.field1.ranges[0].value1, new Date(oFilterMetadaData.defaultFilterValue));

	 // 	oJSONData = {};
	 // 	oFilterMetadaData.filterRestriction = "multiple";
	 // 	this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
	 // 	assert.ok(oJSONData.field1.items);
	 // 	assert.equal(oJSONData.field1.items.length, 1);
	 // 	assert.deepEqual(oJSONData.field1.items[0].key, new Date(oFilterMetadaData.defaultFilterValue));

	 // });

	 QUnit.test("Method _createInitialModelForField for String with default values passed by the DefaultFilterValue annotation", function(assert) {
		 var oJSONData = {};

		 var oFilterMetadaData = {
			 fieldName: "field1",
			 filterType: "string",
			 filterRestriction: "single",
			 defaultFilterValue: "STRING"
		 };

		 this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
		 assert.deepEqual(oJSONData.field1, oFilterMetadaData.defaultFilterValue);

		 oJSONData = {};
		 oFilterMetadaData.filterRestriction = "interval";
		 this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
		 assert.deepEqual(oJSONData.field1.low, oFilterMetadaData.defaultFilterValue);
		 assert.deepEqual(oJSONData.field1.high, oFilterMetadaData.defaultFilterValue);

		 oJSONData = {};
		 oFilterMetadaData.filterRestriction = "auto";
		 this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
		 assert.ok(oJSONData.field1.ranges);
		 assert.equal(oJSONData.field1.ranges.length, 1);
		 assert.deepEqual(oJSONData.field1.ranges[0].value1, oFilterMetadaData.defaultFilterValue);

		 oJSONData = {};
		 oFilterMetadaData.filterRestriction = "multiple";
		 this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
		 assert.ok(oJSONData.field1.items);
		 assert.equal(oJSONData.field1.items.length, 1);
		 assert.deepEqual(oJSONData.field1.items[0].key, oFilterMetadaData.defaultFilterValue);

	 });

	 QUnit.test("Method _createInitialModelForField for Bool with default values passed by the DefaultFilterValue annotation", function(assert) {
		 var oJSONData = {};

		 var oFilterMetadaData = {
			 fieldName: "field1",
			 filterType: "bool",
			 filterRestriction: "single",
			 defaultFilterValue: "true"
		 };

		 this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
		 assert.deepEqual(oJSONData.field1, oFilterMetadaData.defaultFilterValue);

		 oJSONData = {};
		 oFilterMetadaData.filterRestriction = "interval";
		 this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
		 assert.deepEqual(oJSONData.field1.low, oFilterMetadaData.defaultFilterValue);
		 assert.deepEqual(oJSONData.field1.high, oFilterMetadaData.defaultFilterValue);

		 oJSONData = {};
		 oFilterMetadaData.filterRestriction = "auto";
		 this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
		 assert.ok(oJSONData.field1.ranges);
		 assert.equal(oJSONData.field1.ranges.length, 1);
		 assert.deepEqual(oJSONData.field1.ranges[0].value1, oFilterMetadaData.defaultFilterValue);

		 oJSONData = {};
		 oFilterMetadaData.filterRestriction = "multiple";
		 this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
		 assert.ok(oJSONData.field1.items);
		 assert.equal(oJSONData.field1.items.length, 1);
		 assert.deepEqual(oJSONData.field1.items[0].key, oFilterMetadaData.defaultFilterValue);

	 });

	 QUnit.test("Method _createInitialModelForField for Numeric with default values passed by the DefaultFilterValue annotation", function(assert) {
		 var oJSONData = {};

		 var oFilterMetadaData = {
			 fieldName: "field1",
			 filterType: "numeric",
			 filterRestriction: "single",
			 defaultFilterValue: "3.14"
		 };

		 this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
		 assert.deepEqual(oJSONData.field1, oFilterMetadaData.defaultFilterValue);

		 oFilterMetadaData = {
			 fieldName: "field1",
			 filterType: "numeric",
			 filterRestriction: "single",
			 defaultFilterValue: "1,234,567.89"
		 };

		 this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
		 assert.deepEqual(oJSONData.field1, oFilterMetadaData.defaultFilterValue);

		 oJSONData = {};
		 oFilterMetadaData.filterRestriction = "interval";
		 this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
		 assert.deepEqual(oJSONData.field1.low, oFilterMetadaData.defaultFilterValue);
		 assert.deepEqual(oJSONData.field1.high, oFilterMetadaData.defaultFilterValue);

		 oJSONData = {};
		 oFilterMetadaData.filterRestriction = "auto";
		 this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
		 assert.ok(oJSONData.field1.ranges);
		 assert.equal(oJSONData.field1.ranges.length, 1);
		 assert.deepEqual(oJSONData.field1.ranges[0].value1, oFilterMetadaData.defaultFilterValue);

		 oJSONData = {};
		 oFilterMetadaData.filterRestriction = "multiple";
		 this.oFilterProvider._createInitialModelForField(oJSONData, oFilterMetadaData, true);
		 assert.ok(oJSONData.field1.items);
		 assert.equal(oJSONData.field1.items.length, 1);
		 assert.deepEqual(oJSONData.field1.items[0].key, oFilterMetadaData.defaultFilterValue);

	 });

	 QUnit.test("Method _determineFieldLabel", function(assert) {
		 var sLabel;

		 var oFieldViewMetadata = {
			 name: "Filter1",
			 label: "METADATA_LABEL"
		 };

		 this.oFilterProvider._oSmartFilter = {
			 determineFilterItemByName: function(n) {
				 if (n === "Filter1") {
					 return {
						 getLabel: function() {
							 return "FILTER_LABEL";
						 }
					 };
				 }
				 return null;
			 }
		 };

		 sLabel = this.oFilterProvider._determineFieldLabel(oFieldViewMetadata);
		 assert.equal(sLabel, "FILTER_LABEL");

		 oFieldViewMetadata.name = "Another";
		 sLabel = this.oFilterProvider._determineFieldLabel(oFieldViewMetadata);
		 assert.equal(sLabel, "METADATA_LABEL");

	 });

	 QUnit.test("Method _createSelectionVariants/getSelectionVariants", function(assert) {

		 sinon.stub(this.oFilterProvider._oMetadataAnalyser, "getSelectionVariantAnnotationList").returns([
			 {}
		 ]);

		 assert.ok(this.oFilterProvider.getSelectionVariants());
		 assert.equal(this.oFilterProvider.getSelectionVariants().length, 0);

		 this.oFilterProvider._createSelectionVariants();
		 assert.ok(this.oFilterProvider.getSelectionVariants());
		 assert.equal(this.oFilterProvider.getSelectionVariants().length, 1);
	 });

	 QUnit.test("Method _createFieldMetadata for Edm.Boolean", function(assert) {

		 var oFilterFieldODataMetadata = {
			 entityName: "ZEPM_C_SALESORDERITEMQUERYResult",
			 fieldLabel: "Label",
			 filterRestriction: "single",
			 fullName: "ZEPM_C_SALESORDERITEMQUERY_CDS.ZEPM_C_SALESORDERITEMQUERYResult/LocalBoolean",
			 name: "LocalBoolean",
			 type: "Edm.Boolean",
			 hasFixedValues: false

		 };

		 sinon.stub(this.oFilterProvider, "_getFilterRestriction").returns("single");

		 var oFieldViewMetadata = this.oFilterProvider._createFieldMetadata(oFilterFieldODataMetadata);
		 assert.ok(oFieldViewMetadata);
		 assert.ok(oFieldViewMetadata.fControlConstructor === Select);

		 oFilterFieldODataMetadata.hasFixedValues = true;
		 oFieldViewMetadata = this.oFilterProvider._createFieldMetadata(oFilterFieldODataMetadata);
		 assert.ok(oFieldViewMetadata);
		 assert.ok(oFieldViewMetadata.fControlConstructor === Input);

		 var fUpdateValueListmetadata = this.oFilterProvider._updateValueListMetadata;
		 this.oFilterProvider._updateValueListMetadata = function(a, b) {
			 a.hasValueListAnnotation = true;
		 };

		 oFieldViewMetadata = this.oFilterProvider._createFieldMetadata(oFilterFieldODataMetadata);
		 assert.ok(oFieldViewMetadata);
		 assert.ok(oFieldViewMetadata.fControlConstructor === ComboBox);

		 this.oFilterProvider._updateValueListMetadata = fUpdateValueListmetadata;

	 });

	 QUnit.test("Method attachPendingChange/detachPendingChange", function(assert) {
		 var fFunc = function() {
		 };

		 assert.ok(!this.oFilterProvider._oEventProvider);

		 this.oFilterProvider.attachPendingChange(fFunc);
		 assert.ok(this.oFilterProvider._oEventProvider);
		 assert.ok(this.oFilterProvider._oEventProvider.hasListeners("PendingChange"));

		 this.oFilterProvider.detachPendingChange(fFunc);
		 assert.ok(this.oFilterProvider._oEventProvider);
		 assert.ok(!this.oFilterProvider._oEventProvider.hasListeners("PendingChange"));

	 });

	 QUnit.test("Method clear/reset", function(assert) {

		 var oSpy = sinon.spy(this.oFilterProvider, "_createInitialModel");
		 oSpy.withArgs(false);
		 oSpy.withArgs(true);

		 this.oFilterProvider.clear();
		 assert.ok(oSpy.withArgs(false).called);
		 assert.ok(!oSpy.withArgs(true).called);

		 this.oFilterProvider.reset();
		 assert.ok(oSpy.withArgs(false).called);
		 assert.ok(oSpy.withArgs(true).called);

	 });

	 QUnit.test("Method getParameters", function(assert) {

		 sinon.stub(this.oFilterProvider.oModel, "getProperty").returns("Search");

		 var oParam = this.oFilterProvider.getParameters();
		 assert.ok(oParam);
		 assert.equal(oParam.custom["search"], "Search");
		 assert.ok(!oParam.custom["search-focus"]);

		 this.oFilterProvider._sBasicSearchFieldName = "FIELD";
		 oParam = this.oFilterProvider.getParameters();
		 assert.ok(oParam);
		 assert.equal(oParam.custom["search"], "Search");
		 assert.equal(oParam.custom["search-focus"], "FIELD");

	 });

	 QUnit.test("Method _createGroupMetadata", function(assert) {

		 var oODataFilterBarGroup = {
			 groupName: "GName"
		 };
		 sinon.stub(this.oFilterProvider, "_getGroupLabel").returns("GNameLabel");
		 sinon.stub(this.oFilterProvider, "_getGroupIndex").returns(2);
		 this.oFilterProvider._oAdditionalConfiguration = {
			 getGroupConfigurationByKey: function() {
				 return null;
			 }
		 };

		 var oGroupMetaData = this.oFilterProvider._createGroupMetadata(oODataFilterBarGroup);
		 assert.ok(oGroupMetaData);
		 assert.equal(oGroupMetaData.groupName, "GName");
		 assert.equal(oGroupMetaData.groupLabel, "GNameLabel");
		 assert.ok(oGroupMetaData.fields);
		 assert.equal(oGroupMetaData.index, 2);
	 });

	 QUnit.test("Method _createControl shall create type sap.m.Input", function(assert) {
		 var oFieldViewMetadata = {
			 fControlConstructor: Input,
			 filterRestriction: "interval",
			 fieldName: "foo"
		 };

		 sinon.stub(this.oFilterProvider, "_createFilterControlId").returns("anotherTestId");

		 var oControl = this.oFilterProvider._createControl(oFieldViewMetadata);
		 assert.ok(oControl);
		 assert.ok(oControl instanceof Input);
		 oControl.destroy();

	 });

	 QUnit.test("Method _createControl shall create type sap.m.DataPicker", function(assert) {

		 var oFieldViewMetadata = {
			 controlType: "date",
			 filterRestriction: "single",
			 fieldName: "foo",
			 type: "Edm.DateTime",
			 name: "foofoo",
			 groupName: "fooGroup"
		 };

		 oFieldViewMetadata.fControlConstructor = this.oFilterProvider._getControlConstructor(oFieldViewMetadata);

		 sinon.stub(this.oFilterProvider, "_createFilterControlId").returns("anotherTestId");

		 var oControl = this.oFilterProvider._createControl(oFieldViewMetadata);
		 assert.ok(oControl);
		 assert.ok(oControl instanceof DatePicker);
		 oControl.destroy();
	 });

	 QUnit.test("Method _createControl shall create type  sap.m.DateRangeSelection", function(assert) {

		 var oFieldViewMetadata = {
			 controlType: "date",
			 filterRestriction: "interval",
			 fieldName: "foo",
			 type: "Edm.DateTime",
			 name: "foofoo",
			 groupName: "fooGroup"
		 };

		 oFieldViewMetadata.fControlConstructor = this.oFilterProvider._getControlConstructor(oFieldViewMetadata);

		 sinon.stub(this.oFilterProvider, "_createFilterControlId").returns("anotherTestId");

		 var oControl = this.oFilterProvider._createControl(oFieldViewMetadata);
		 assert.ok(oControl);
		 assert.ok(oControl instanceof DateRangeSelection);
		 oControl.destroy();
	 });

	 QUnit.test("Method _createControl shall create type sap.m.Select/sap.m.ComboBox/sap.m.MultiComboBo", function(assert) {

		 var oFieldViewMetadata = {
			 controlType: "dropDownList",
			 filterRestriction: "single",
			 fieldName: "foo",
			 type: "Edm.Boolean",
			 name: "foofoo",
			 groupName: "fooGroup"
		 };

		 oFieldViewMetadata.fControlConstructor = this.oFilterProvider._getControlConstructor(oFieldViewMetadata);

		 sinon.stub(this.oFilterProvider, "_createFilterControlId").returns("anotherTestId");

		 var oControl = this.oFilterProvider._createControl(oFieldViewMetadata);
		 assert.ok(oControl);
		 assert.ok(oControl instanceof Select);
		 oControl.destroy();

		 oFieldViewMetadata.type = "Edm.String";
		 oFieldViewMetadata.fControlConstructor = this.oFilterProvider._getControlConstructor(oFieldViewMetadata);

		 oControl = this.oFilterProvider._createControl(oFieldViewMetadata);
		 assert.ok(oControl);
		 assert.ok(oControl instanceof ComboBox);
		 oControl.destroy();

		 oFieldViewMetadata.filterRestriction = "multiple";
		 oFieldViewMetadata.fControlConstructor = this.oFilterProvider._getControlConstructor(oFieldViewMetadata);

		 oControl = this.oFilterProvider._createControl(oFieldViewMetadata);
		 assert.ok(oControl);
		 assert.ok(oControl instanceof MultiComboBox);
		 oControl.destroy();

	 });

	 QUnit.test("Method _createControl shall create type  sap.m.TimePicker/sap.m.MultiInput", function(assert) {

		 var oFieldViewMetadata = {
			 filterRestriction: "single",
			 fieldName: "foo",
			 type: "Edm.Time",
			 name: "foofoo",
			 groupName: "fooGroup"
		 };

		 oFieldViewMetadata.fControlConstructor = this.oFilterProvider._getControlConstructor(oFieldViewMetadata);

		 sinon.stub(this.oFilterProvider, "_createFilterControlId").returns("anotherTestId");
		 sinon.stub(this.oFilterProvider, "_associateValueHelpDialog");
		 sinon.stub(this.oFilterProvider, "_associateValueList");

		 var oControl = this.oFilterProvider._createControl(oFieldViewMetadata);
		 assert.ok(oControl);
		 assert.ok(oControl instanceof TimePicker);
		 oControl.destroy();

		 oFieldViewMetadata.filterRestriction = "multiple";
		 oFieldViewMetadata.hasValueHelpDialog = true;
		 oFieldViewMetadata.hasTypeAhead = true;
		 oFieldViewMetadata.displayFormat = "UpperCase";
		 oFieldViewMetadata.fControlConstructor = this.oFilterProvider._getControlConstructor(oFieldViewMetadata);

		 oControl = this.oFilterProvider._createControl(oFieldViewMetadata);
		 assert.ok(oControl);
		 assert.ok(oControl instanceof MultiInput);
		 oControl.destroy();
	 });

	 QUnit.test("Method _updateDisplayBehaviour", function(assert) {

		 var sReturn = null;

		 sinon.stub(this.oFilterProvider, "_getGroupLabel").returns("GNameLabel");
		 sinon.stub(this.oFilterProvider, "_getGroupIndex").returns(2);
		 this.oFilterProvider._oMetadataAnalyser = {
			 getTextArrangementValue: function() {
				 return sReturn;
			 }
		 };

		 assert.ok(!this.oFilterProvider._sTextArrangementDisplayBehaviour);
		 assert.ok(!this.oFilterProvider.sDefaultDropDownDisplayBehaviour);
		 assert.ok(!this.oFilterProvider.sDefaultTokenDisplayBehaviour);

		 this.oFilterProvider._updateDisplayBehaviour();
		 assert.ok(!this.oFilterProvider._sTextArrangementDisplayBehaviour);
		 assert.ok(this.oFilterProvider.sDefaultDropDownDisplayBehaviour);
		 assert.equal(this.oFilterProvider.sDefaultDropDownDisplayBehaviour, "descriptionOnly");
		 assert.ok(this.oFilterProvider.sDefaultTokenDisplayBehaviour);
		 assert.equal(this.oFilterProvider.sDefaultTokenDisplayBehaviour, "descriptionAndId");

		 sReturn = "FIRST";
		 this.oFilterProvider.sDefaultDropDownDisplayBehaviour = null;
		 this.oFilterProvider.sDefaultTokenDisplayBehaviour = null;
		 this.oFilterProvider._updateDisplayBehaviour();
		 assert.ok(this.oFilterProvider._sTextArrangementDisplayBehaviour);
		 assert.ok(this.oFilterProvider.sDefaultDropDownDisplayBehaviour);
		 assert.equal(this.oFilterProvider.sDefaultDropDownDisplayBehaviour, sReturn);
		 assert.ok(this.oFilterProvider.sDefaultTokenDisplayBehaviour);
		 assert.equal(this.oFilterProvider.sDefaultTokenDisplayBehaviour, sReturn);

	 });

	 QUnit.test("Method _getFilterType", function(assert) {

		 var oField = {
			 type: "Edm.Int16",
			 displayFormat: "Date"
		 };

		 var sReturn = this.oFilterProvider._getFilterType(oField);
		 assert.equal(sReturn, "numeric");

		 oField.type = "Edm.DateTime";
		 sReturn = this.oFilterProvider._getFilterType(oField);
		 assert.equal(sReturn, "date");

		 oField.type = "Edm.String";
		 sReturn = this.oFilterProvider._getFilterType(oField);
		 assert.equal(sReturn, "string");

		 oField.type = "Edm.Boolean";
		 sReturn = this.oFilterProvider._getFilterType(oField);
		 assert.equal(sReturn, "boolean");

		 oField.type = "Edm.Time";
		 sReturn = this.oFilterProvider._getFilterType(oField);
		 assert.equal(sReturn, "time");

	 });

	 QUnit.test("Method _updateValueListMetadata ", function(assert) {

		 var oFieldView = {};
		 var oFieldMeta = {};

		 this.oFilterProvider._updateValueListMetadata(oFieldView, oFieldMeta);
		 assert.ok(oFieldView.hasOwnProperty("hasValueListAnnotation"));
		 assert.ok(!oFieldView.hasValueListAnnotation);

		 oFieldView = {};
		 oFieldMeta = {
			 "sap:value-list": "some thing"
		 };
		 this.oFilterProvider._updateValueListMetadata(oFieldView, oFieldMeta);
		 assert.ok(oFieldView.hasOwnProperty("hasValueListAnnotation"));
		 assert.ok(oFieldView.hasValueListAnnotation);
		 assert.ok(oFieldView.hasOwnProperty("hasFixedValues"));
		 assert.ok(!oFieldView.hasFixedValues);

		 oFieldView = {};
		 oFieldMeta = {
			 "sap:value-list": "fixed-values"
		 };
		 this.oFilterProvider._updateValueListMetadata(oFieldView, oFieldMeta);
		 assert.ok(oFieldView.hasOwnProperty("hasValueListAnnotation"));
		 assert.ok(oFieldView.hasValueListAnnotation);
		 assert.ok(oFieldView.hasOwnProperty("hasFixedValues"));
		 assert.ok(oFieldView.hasFixedValues);

		 oFieldView = {};
		 oFieldMeta = {
			 "com.sap.vocabularies.Common.v1.ValueList": "valuelist"
		 };
		 this.oFilterProvider._updateValueListMetadata(oFieldView, oFieldMeta);
		 assert.ok(oFieldView.hasOwnProperty("hasValueListAnnotation"));
		 assert.ok(oFieldView.hasValueListAnnotation);
		 assert.ok(oFieldView.hasOwnProperty("hasFixedValues"));
		 assert.ok(!oFieldView.hasFixedValues);

		 oFieldView = {};
		 oFieldMeta = {
			 "com.sap.vocabularies.Common.v1.ValueList": "fixed-values"
		 };
		 this.oFilterProvider._oMetadataAnalyser = {
			 getValueListSemantics: function() {
				 return "fixed-values";
			 }
		 };
		 this.oFilterProvider._updateValueListMetadata(oFieldView, oFieldMeta);
		 assert.ok(oFieldView.hasOwnProperty("hasValueListAnnotation"));
		 assert.ok(oFieldView.hasValueListAnnotation);
		 assert.ok(oFieldView.hasOwnProperty("hasFixedValues"));
		 assert.ok(oFieldView.hasFixedValues);

		 oFieldView = {};
		 oFieldMeta = {
			 "com.sap.vocabularies.Common.v1.ValueList": {},
			 "com.sap.vocabularies.Common.v1.ValueListWithFixedValues": {
				 "Bool": "true"
			 }
		 };

		 this.oFilterProvider._oMetadataAnalyser = {
			 getValueListSemantics: function() {
				 return undefined;
			 }
		 };
		 this.oFilterProvider._updateValueListMetadata(oFieldView, oFieldMeta);
		 assert.ok(oFieldView.hasOwnProperty("hasValueListAnnotation"));
		 assert.ok(oFieldView.hasValueListAnnotation);
		 assert.ok(oFieldView.hasOwnProperty("hasFixedValues"));
		 assert.ok(oFieldView.hasFixedValues);

	 });

	 QUnit.test("Method _checkMetadataDefaultValue ", function(assert) {

		 var oFieldViewMetadata = {
			 defaultFilterValue: "true",
			 fieldName: "foo",
			 precision: 1,
			 type: "Edm.Boolean"
		 };

		 var oFieldViewMetadata2 = {
			 defaultFilterValue: "PT12H34M56S",
			 fieldName: "boo",
			 type: "Edm.Time"
		 };

		 sinon.spy(this.oFilterProvider, "_getType");
		 sinon.spy(this.oFilterProvider, "_getTime");

		 this.oFilterProvider._checkMetadataDefaultValue(oFieldViewMetadata);
		 assert.ok(this.oFilterProvider._getType.called);
		 assert.ok(!this.oFilterProvider._getTime.called);

		 this.oFilterProvider._checkMetadataDefaultValue(oFieldViewMetadata2);
		 assert.ok(this.oFilterProvider._getType.calledOnce);
		 assert.ok(this.oFilterProvider._getTime.called);
	 });

	 QUnit.test("Method _checkMetadataDefaultValue ", function(assert) {

		 var oJSONData = {};

		 var oFieldViewMetadata = {
			 defaultFilterValue: "PT12H34M56S",
			 fieldName: "foo",
			 type: "Edm.Time",
			 filterType: "time",
			 filterRestriction: "single"
		 };

		 this.oFilterProvider._createInitialModelForField(oJSONData, oFieldViewMetadata, true);
		 assert.ok(oJSONData.foo);
		 assert.ok(oJSONData.foo instanceof Date);

	 });

	 QUnit.test("Method _parseFilterData single", function(assert) {

		 var oJson = {
			 "DateTimeOffsetFilter": {
				 value: null,
				 items: [],
				 ranges: [
					 {
						 operation: "EQ",
						 value1: "2017-10-01T04:13:26.000Z"
					 }
				 ]
			 }
		 };

		 this.oFilterProvider._aFilterBarDateTimeFieldNames = [
			 "DateTimeOffsetFilter"
		 ];
		 this.oFilterProvider.oModel.oData = {
			 DateTimeOffsetFilter: null
		 };

		 var oReturn = this.oFilterProvider._parseFilterData(oJson);
		 assert.ok(oReturn);
		 assert.deepEqual(oReturn.DateTimeOffsetFilter, new Date("2017-10-01T04:13:26.000Z"));
	 });

	 QUnit.test("Method _parseFilterData range", function(assert) {

		 var oJson = {
			 "DateTimeOffsetFilter": {
				 value: null,
				 items: [],
				 ranges: [
					 {
						 exclude: false,
						 operation: "BT",
						 value1: "2017-10-01T04:13:26.000Z",
						 value2: "2017-10-02T04:13:26.000Z"
					 }
				 ]
			 }
		 };

		 this.oFilterProvider.oModel.oData = {
			 DateTimeOffsetFilter: {
				 value: null,
				 items: [],
				 ranges: []
			 }
		 };

		 var oReturn = this.oFilterProvider._parseFilterData(oJson);
		 assert.ok(oReturn);
		 assert.deepEqual(oReturn.DateTimeOffsetFilter, oJson.DateTimeOffsetFilter);

	 });

	 QUnit.test("Method _parseFilterData numeric interval", function(assert) {

		 var oJson = {
			 "IntervalValue": {
				 value: null,
				 low: 0,
				 high: 100
			 }
		 };

		 this.oFilterProvider.oModel.oData = {
			 IntervalValue: {
				 low: null,
				 high: null
			 }
		 };

		 var oReturn = this.oFilterProvider._parseFilterData(oJson);
		 assert.ok(oReturn);
		 assert.deepEqual(oReturn.IntervalValue.low, "0-100");

		 oJson.IntervalValue.low = -1;
		 oJson.IntervalValue.high = 0;

		 oReturn = this.oFilterProvider._parseFilterData(oJson);
		 assert.ok(oReturn);
		 assert.deepEqual(oReturn.IntervalValue.low, "-1-0");
	 });

	 QUnit.test("Method getFilters single", function(assert) {

		 var oJson = {
			 "DateTimeOffsetFilter": {
				 value: null,
				 items: [],
				 ranges: [
					 {
						 operation: "EQ",
						 value1: "2017-10-01T04:13:26.000Z"
					 }
				 ]
			 }
		 };

		 this.oFilterProvider._aFilterBarDateTimeFieldNames = [
			 "DateTimeOffsetFilter"
		 ];
		 this.oFilterProvider.oModel.oData = {
			 DateTimeOffsetFilter: null
		 };

		 var oReturn = this.oFilterProvider._parseFilterData(oJson);
		 assert.ok(oReturn);

		 this.oFilterProvider.oModel.oData = oReturn;

		 this.oFilterProvider._oDateFormatSettings = null;

		 oReturn = this.oFilterProvider.getFilters([
			 "DateTimeOffsetFilter"
		 ]);
		 assert.ok(oReturn);
		 assert.ok(oReturn[0]);
		 assert.equal(oReturn[0].oValue1.toJSON(), oJson.DateTimeOffsetFilter.ranges[0].value1);

	 });

	 QUnit.test("Method _updateMultiValueControl with MultiInput control", function(assert) {

		 var oControl = new MultiInput();
		 var aItems = [
			 {
				 key: "1",
				 text: "one"
			 }, {
				 key: "2",
				 text: "two"
			 }
		 ];
		 var aRanges = [
			 {
				 tokenText: "tokenText",
				 operation: "EQ",
				 value1: "1",
				 value2: "2",
				 exclude: false
			 }
		 ];

		 this.oFilterProvider._updateMultiValueControl(oControl, aItems, aRanges);
		 var aTokens = oControl.getTokens();
		 assert.ok(aTokens);
		 assert.equal(aTokens.length, 3);
		 assert.equal(aTokens[0].getKey(), aItems[1].key);
		 assert.equal(aTokens[0].getText(), aItems[1].text);
		 assert.equal(aTokens[0].getTooltip(), aItems[1].text);

		 assert.equal(aTokens[1].getKey(), aItems[0].key);
		 assert.equal(aTokens[1].getText(), aItems[0].text);
		 assert.equal(aTokens[1].getTooltip(), aItems[0].text);

		 assert.equal(aTokens[2].getText(), aRanges[0].tokenText);
		 assert.equal(aTokens[2].getTooltip(), aRanges[0].tokenText);

		 oControl.destroy();
	 });

	 QUnit.test("Method _updateMultiValueControl with MultiInput control does not throw an exception if text is not escaped", function(assert) {
		 var oControl = new MultiInput();
		 var aItems = [
			 {
				 key: "key",
				 text: "not_escaped{"
			 }, {
				 key: "not_escaped{",
				 text: "text"
			 }
		 ];
		 var aRanges = [
			 {
				 tokenText: "not_escaped{",
				 operation: "EQ",
				 value1: "1",
				 value2: "2",
				 exclude: false
			 }
		 ];

		 this.oFilterProvider._updateMultiValueControl(oControl, aItems, aRanges);

		 assert.ok(true, "No exception is thrown");
	 });

	 QUnit.test("Method _updateMultiValueControl with MultiComboBox control", function(assert) {

		 var oControl = new MultiComboBox();
		 var aItems = [
			 {
				 key: "1"
			 }, {
				 key: "2"
			 }
		 ];

		 this.oFilterProvider._updateMultiValueControl(oControl, aItems);
		 var aKeys = oControl.getSelectedKeys();
		 assert.ok(aKeys);
		 assert.equal(aKeys.length, 2);

		 oControl.destroy();
	 });

	 QUnit.test("Method _handleMultiInput", function(assert) {
		 var oControl = new MultiInput();
		 var oFieldMetadata = {
			 fieldName: "A",
			 type: "Edm.String"
		 };

		 var oType = this.oFilterProvider._getType(oFieldMetadata);

		 var aItems = [
			 {
				 key: "1",
				 text: "one"
			 }
		 ];

		 this.oFilterProvider.oModel.oData = {
			 "A": {}
		 };

		 this.oFilterProvider._handleMultiInput(oControl, oFieldMetadata, oType);

		 this.oFilterProvider._updateMultiValueControl(oControl, aItems);

		 var aValue = this.oFilterProvider.getModel().getProperty("/A/items");
		 assert.ok(aValue);
		 assert.equal(aValue.length, 1);
		 assert.equal(aValue[0].key, "1");
		 assert.equal(aValue[0].text, "one");

		 oControl.destroy();
	 });

	 QUnit.test("Method _validateConditionTypeFields", function(assert) {

		 assert.ok(!this.oFilterProvider._validateConditionTypeFields());

		 this.oFilterProvider._mConditionTypeFields = {
			 "one": {
				 conditionType: {
					 validate: function() {
					 }
				 }
			 }
		 };

		 assert.ok(this.oFilterProvider._validateConditionTypeFields());

		 this.oFilterProvider._mConditionTypeFields = null;
	 });

	 QUnit.test("Method _handleFilterDataUpdate", function(assert) {

		 var aFieldName = [
			 "A"
		 ];

		 this.oFilterProvider._aFilterBarMultiValueFieldMetadata = [
			 {
				 fieldName: "A",
				 type: "Edm.String"
			 }
		 ];

		 this.oFilterProvider.oModel.oData = {
			 "A": {}
		 };

		 sinon.stub(this.oFilterProvider, "_updateMultiValueControl");

		 this.oFilterProvider._handleFilterDataUpdate(aFieldName);
		 assert.ok(this.oFilterProvider._updateMultiValueControl.called);
	 });

	 QUnit.test("Method _getGroupIDFromFieldGroup", function(assert) {

		 var oFieldViewMetadata = {
			 fieldNameOData: "A"
		 };

		 this.oFilterProvider._aFieldGroupAnnotation = [
			 {
				 fields: [
					 "A"
				 ],
				 groupName: "G"
			 }
		 ];

		 var sGroupName = this.oFilterProvider._getGroupIDFromFieldGroup(oFieldViewMetadata);
		 assert.equal(sGroupName, "G");
	 });

	 QUnit.test("Method _getLabelFromFieldGroup ", function(assert) {

		 var oFieldViewMetadata = {
			 fieldNameOData: "A"
		 };

		 this.oFilterProvider._aFieldGroupAnnotation = [
			 {
				 fields: [
					 "A"
				 ],
				 labels: {
					 "A": "label"
				 }
			 }
		 ];

		 var sLabel = this.oFilterProvider._getLabelFromFieldGroup(oFieldViewMetadata);
		 assert.equal(sLabel, "label");
	 });

	 QUnit.test("Method _associateValueHelpDialog", function(assert) {

		 var oControl = new MultiInput();
		 var oFieldViewMetadata = {
			 fullName: "A",
			 hasValueListAnnotation: false,
			 preventInitialDataFetchInValueHelpDialog: true,
			 filterRestriction: "single",
			 filterType: "Edm.String",
			 visibleInAdvancedArea: true
		 };

		 assert.equal(this.oFilterProvider._aValueHelpDialogProvider.length, 0);

		 this.oFilterProvider._associateValueHelpDialog(oControl, oFieldViewMetadata, true, false);

		 assert.equal(this.oFilterProvider._aValueHelpDialogProvider.length, 1);

		 oControl.destroy();
	 });

	 QUnit.test("Method _associateValueList", function(assert) {

		 var oControl = new MultiInput();
		 var oFieldViewMetadata = {
			 fullName: "A",
			 hasValueListAnnotation: true,
			 filterRestriction: "single",
			 filterType: "Edm.String",
			 visibleInAdvancedArea: true
		 };

		 assert.equal(this.oFilterProvider._aValueListProvider.length, 0);

		 this.oFilterProvider._associateValueList(oControl, "", oFieldViewMetadata, false);

		 assert.equal(this.oFilterProvider._aValueListProvider.length, 1);

		 oControl.destroy();
	 });

	 QUnit.test("Method generateFilters", function(assert) {

		 var oFilter;
		 var aFieldNames = [
			 "A"
		 ];
		 var mSettings = {
			 viewMetadataData: []
		 };
		 var oDate1 = new Date();

		 var aResult = FilterProvider.generateFilters(aFieldNames, {
			 "A": {
				 low: "0"
			 }
		 }, mSettings);
		 assert.ok(aResult);
		 assert.equal(aResult.length, 1);
		 assert.equal(aResult[0].sPath, "A");
		 assert.equal(aResult[0].sOperator, "EQ");
		 assert.equal(aResult[0].oValue1, "0");

		 aResult = FilterProvider.generateFilters(aFieldNames, {
			 "A": {
				 low: oDate1
			 }
		 }, mSettings);
		 assert.ok(aResult);
		 assert.equal(aResult.length, 1);
		 assert.equal(aResult[0].sPath, "A");
		 assert.equal(aResult[0].sOperator, "EQ");
		 assert.equal(aResult[0].oValue1, oDate1);

		 aResult = FilterProvider.generateFilters(aFieldNames, {
			 "A": {
				 low: "0",
				 high: "1"
			 }
		 }, mSettings);
		 assert.ok(aResult);
		 assert.equal(aResult.length, 1);
		 assert.equal(aResult[0].sPath, "A");
		 assert.equal(aResult[0].sOperator, "BT");
		 assert.equal(aResult[0].oValue1, "0");
		 assert.equal(aResult[0].oValue2, "1");

		 aResult = FilterProvider.generateFilters(aFieldNames, {
			 "A": {
				 items: [
					 {
						 key: "0"
					 }
				 ]
			 }
		 }, mSettings);
		 assert.ok(aResult);
		 assert.equal(aResult.length, 1);
		 assert.ok(aResult[0].aFilters);
		 assert.equal(aResult[0].aFilters.length, 1);
		 assert.equal(aResult[0].aFilters[0].sPath, "A");
		 assert.equal(aResult[0].aFilters[0].sOperator, "EQ");
		 assert.equal(aResult[0].aFilters[0].oValue1, "0");

		 aResult = FilterProvider.generateFilters(aFieldNames, {
			 "A": {
				 items: [],
				 ranges: [
					 {
						 operation: "EQ",
						 value1: "1",
						 exclude: false
					 }
				 ]
			 }
		 }, mSettings);
		 assert.ok(aResult);
		 assert.equal(aResult.length, 1);
		 assert.ok(aResult[0].aFilters);
		 assert.equal(aResult[0].aFilters.length, 1);
		 assert.equal(aResult[0].aFilters[0].sPath, "A");
		 assert.equal(aResult[0].aFilters[0].sOperator, "EQ");
		 assert.equal(aResult[0].aFilters[0].oValue1, "1");

		 aResult = FilterProvider.generateFilters(aFieldNames, {
			 "A": {
				 items: [],
				 ranges: [
					 {
						 operation: "EQ",
						 value1: "1",
						 exclude: true
					 }
				 ]
			 }
		 }, mSettings);
		 assert.ok(aResult);
		 assert.equal(aResult.length, 1);
		 assert.ok(aResult[0].aFilters);
		 assert.equal(aResult[0].aFilters.length, 1);
		 assert.equal(aResult[0].aFilters[0].sPath, "A");
		 assert.equal(aResult[0].aFilters[0].sOperator, "NE");
		 assert.equal(aResult[0].aFilters[0].oValue1, "1");

		 // Empty scenario
		 aResult = FilterProvider.generateFilters(aFieldNames, {
			 "A": {
				 items: [],
				 ranges: [
					 {
						 operation: "Empty"
					 }
				 ]
			 }
		 }, mSettings);

		 oFilter = aResult[0].aFilters[0];
		 assert.strictEqual(oFilter.bAnd, undefined, "The filter should be 'or' operation");
		 assert.strictEqual(oFilter.aFilters.length, 2, "There should be 2 conditions");
		 assert.strictEqual(oFilter.aFilters[0].sOperator, FilterOperator.EQ, "Correct filter operator assigned");
		 assert.strictEqual(oFilter.aFilters[0].oValue1, "", "Expected value assigned");
		 assert.strictEqual(oFilter.aFilters[1].sOperator, FilterOperator.EQ, "Correct filter operator assigned");
		 assert.strictEqual(oFilter.aFilters[1].oValue1, null, "Expected value assigned");

		 // Empty scenario - exclude
		 aResult = FilterProvider.generateFilters(aFieldNames, {
			 "A": {
				 items: [],
				 ranges: [
					 {
						 operation: "Empty",
						 exclude: true
					 }
				 ]
			 }
		 }, mSettings);

		 oFilter = aResult[0].aFilters[0];
		 assert.strictEqual(oFilter.bAnd, true, "The filter should be 'and' operation");
		 assert.strictEqual(oFilter.aFilters.length, 2, "There should be 2 conditions");
		 assert.strictEqual(oFilter.aFilters[0].sOperator, FilterOperator.NE, "Correct filter operator assigned");
		 assert.strictEqual(oFilter.aFilters[0].oValue1, "", "Expected value assigned");
		 assert.strictEqual(oFilter.aFilters[1].sOperator, FilterOperator.NE, "Correct filter operator assigned");
		 assert.strictEqual(oFilter.aFilters[1].oValue1, null, "Expected value assigned");

	 });

	 QUnit.test("Method generateFilters - exclude operations", function(assert) {
		// Arrange and Act
		var oTransformSpy = sinon.spy(FilterUtil, "getTransformedExcludeOperation"),
			aResult = FilterProvider.generateFilters(["A"], {
				"A": {
					items: [],
					ranges: [
						{
							operation: "BT",
							exclude: true,
							value1: 10,
							value2: 20
						},
						{
							operation: "NB",
							exclude: true,
							value1: 10,
							value2: 20
						}
					]
				 }
			}, {viewMetadataData: []}),
			oFilter1 = aResult[0].aFilters[0],
			oFilter2 = aResult[0].aFilters[1];

		// Assert
		assert.strictEqual(oFilter1.sOperator, "NB", "Correct operations transformed for first filter");
		assert.strictEqual(oFilter1.oValue1, 10, "Correct value");
		assert.strictEqual(oFilter1.oValue2, 20, "Correct value");

		assert.strictEqual(oFilter2.sOperator, "NB", "Operation not transformed for second filter");
		assert.strictEqual(oFilter2.oValue1, 10, "Correct value");
		assert.strictEqual(oFilter2.oValue2, 20, "Correct value");

		assert.strictEqual(oTransformSpy.callCount, 2, "Transformation method from FilterUtil called 2 times");
		assert.ok(oTransformSpy.firstCall.calledWithExactly("NB"), "Call with NB as value");
		assert.strictEqual(oTransformSpy.firstCall.returnValue, "NB", "Returned not-transformed value");
		assert.ok(oTransformSpy.secondCall.calledWithExactly("BT"), "Call with BT as value");
		assert.strictEqual(oTransformSpy.secondCall.returnValue, "NB", "Returned transformed value NB");

		// Cleanup
		oTransformSpy.restore();

	});

	QUnit.test("Method generateFilters - BCP: 1970554351 filters for custom controls are ignored", function(assert) {
		// Arrange and Act
		var aResult = FilterProvider.generateFilters(["A"], {
			"A": {
					items: [],
					ranges: [
						{
							operation: "EQ",
							value1: "foo"
						}
					]
				}
			},
			{
				viewMetadataData: [
					{
						fields: [
							{fieldName: "A", isCustomFilterField: true}
						]
					}
				]
			});

		// Assert
		assert.strictEqual(aResult.length, 0, "There should be no filters generated for custom control field");
	});

	 QUnit.test("Method parseFilterData", function(assert) {
		 var oData = {
			 "A": {
				 low: "a"
			 }
		 }, mSettings = {}, oDate1 = new Date(), oDate2 = new Date();

		 var oResult = FilterProvider.parseFilterData(oData, {
			 "A": {
				 low: "b"
			 }
		 }, mSettings, true);
		 assert.ok(oResult);
		 assert.ok(oResult["A"]);
		 assert.equal(oResult["A"].low, "b");

		 oResult = FilterProvider.parseFilterData(oData, {
			 "A": {
				 low: "0",
				 high: "1"
			 }
		 }, mSettings, true);
		 assert.ok(oResult);
		 assert.ok(oResult["A"]);
		 assert.equal(oResult["A"].low, "0-1");
		 assert.equal(oResult["A"].high, null);

		 oResult = FilterProvider.parseFilterData(oData, {
			 "A": {
				 low: oDate1,
				 high: oDate2
			 }
		 }, {
			 dateFields: [
				 "A"
			 ]
		 }, true);
		 assert.ok(oResult);
		 assert.ok(oResult["A"]);
		 assert.equal(oResult["A"].low.toISOString(), oDate1.toISOString());
		 assert.equal(oResult["A"].high.toISOString(), oDate2.toISOString());

		 oResult = FilterProvider.parseFilterData({
			 "A": {
				 items: []
			 }
		 }, {
			 "A": {
				 items: [
					 {
						 key: "1",
						 text: "one"
					 }
				 ]
			 }
		 }, {}, true);
		 assert.ok(oResult);
		 assert.ok(oResult["A"]);
		 assert.ok(oResult["A"].items);
		 assert.equal(oResult["A"].items.length, 1);
		 assert.equal(oResult["A"].items[0].key, "1");
		 assert.equal(oResult["A"].items[0].text, "one");

		 oResult = FilterProvider.parseFilterData({
			 "A": {
				 items: []
			 }
		 }, {
			 "A": {
				 ranges: [
					 {
						 operation: "EQ",
						 exclude: false,
						 value1: "0",
						 value2: "1"
					 }
				 ]
			 }
		 }, {}, true);
		 assert.ok(oResult);
		 assert.ok(oResult["A"]);
		 assert.ok(oResult["A"].ranges);
		 assert.equal(oResult["A"].ranges.length, 1);
		 assert.equal(oResult["A"].ranges[0].value1, "0");
		 assert.equal(oResult["A"].ranges[0].value2, "1");

		 oResult = FilterProvider.parseFilterData({
			 "A": {
				 items: []
			 }
		 }, {
			 "A": {
				 ranges: [
					 {
						 operation: "EQ",
						 exclude: false,
						 value1: oDate1,
						 value2: oDate2
					 }
				 ]
			 }
		 }, {
			 dateTimeMultiValueFields: [
				 "A"
			 ]
		 }, true);
		 assert.ok(oResult);
		 assert.ok(oResult["A"]);
		 assert.ok(oResult["A"].ranges);
		 assert.equal(oResult["A"].ranges.length, 1);
		 assert.equal(oResult["A"].ranges[0].value1, oDate1);
		 assert.equal(oResult["A"].ranges[0].value2, oDate2);

		 oResult = FilterProvider.parseFilterData({
			 "A": {
				 items: []
			 }
		 }, {
			 "A": {
				 ranges: [
					 {
						 operation: "EQ",
						 exclude: false,
						 value1: oDate1,
						 value2: oDate2
					 }
				 ]
			 }
		 }, {
			 timeIntervalFields: [
				 "A"
			 ]
		 }, true);
		 assert.ok(oResult);
		 assert.ok(oResult["A"]);
		 assert.ok(oResult["A"].ranges);
		 assert.equal(oResult["A"].ranges.length, 1);
		 assert.equal(oResult["A"].ranges[0].value1, oDate1);
		 assert.equal(oResult["A"].ranges[0].value2, oDate2);

		 oResult = FilterProvider.parseFilterData({
			 "A": {
				 items: []
			 }
		 }, {
			 "A": {
				 ranges: [
					 {
						 operation: "EQ",
						 exclude: false,
						 value1: oDate1.toISOString(),
						 value2: oDate2.toISOString()
					 }
				 ]
			 }
		 }, {
			 timeIntervalFields: [
				 "A"
			 ]
		 }, true);
		 assert.ok(oResult);
		 assert.ok(oResult["A"]);
		 assert.ok(oResult["A"].ranges);
		 assert.equal(oResult["A"].ranges.length, 1);
		 assert.equal(oResult["A"].ranges[0].value1.toISOString(), oDate1.toISOString());
		 assert.equal(oResult["A"].ranges[0].value2.toISOString(), oDate2.toISOString());

		 oResult = FilterProvider.parseFilterData({
			 "A": {
				 items: []
			 }
		 }, {
			 "A": {
				 ranges: [
					 {
						 operation: "EQ",
						 exclude: false,
						 value1: oDate1.toISOString(),
						 value2: oDate2.toISOString()
					 }
				 ]
			 }
		 }, {
			 dateFields: [
				 "A"
			 ]
		 }, true);
		 assert.ok(oResult);
		 assert.ok(oResult["A"]);
		 assert.ok(oResult["A"].ranges);
		 assert.equal(oResult["A"].ranges.length, 1);
		 assert.equal(oResult["A"].ranges[0].value1.toISOString(), oDate1.toISOString());
		 assert.equal(oResult["A"].ranges[0].value2.toISOString(), oDate2.toISOString());

		 oResult = FilterProvider.parseFilterData({
			 "A": {
				 items: []
			 }
		 }, {
			 "A": oDate2.toISOString()
		 }, {
			 dateFields: [
				 "A"
			 ]
		 }, true);
		 assert.ok(oResult);
		 assert.ok(oResult["A"]);
		 assert.ok(oResult["A"].ranges);
		 assert.equal(oResult["A"].ranges.length, 1);
		 assert.equal(oResult["A"].ranges[0].value1.toISOString(), oDate1.toISOString());
		 assert.equal(oResult["A"].ranges[0].value2, null);

		 oResult = FilterProvider.parseFilterData({
			 "A": ""
		 }, {
			 "A": "b"
		 }, mSettings, true);
		 assert.ok(oResult);
		 assert.ok(oResult["A"]);
		 assert.equal(oResult["A"], "b");

		 oResult = FilterProvider.parseFilterData({
			 "A": ""
		 }, {
			 "A": {
				 value: true
			 }
		 }, mSettings, true);
		 assert.ok(oResult);
		 assert.ok(oResult["A"]);
		 assert.equal(oResult["A"], true);

		 oResult = FilterProvider.parseFilterData({
			 "A": ""
		 }, {
			 "A": oDate1.toISOString()
		 }, {
			 dateFields: [
				 "A"
			 ]
		 }, true);
		 assert.ok(oResult);
		 assert.ok(oResult["A"]);
		 assert.equal(oResult["A"].toISOString(), oDate1.toISOString());

		 oResult = FilterProvider.parseFilterData({
			 "A": ""
		 }, {
			 "A": {
				 items: [
					 {
						 key: "1",
						 text: "one"
					 }
				 ]
			 }
		 }, {}, true);
		 assert.ok(oResult);
		 assert.ok(oResult["A"]);
		 assert.equal(oResult["A"], "1");

		 oResult = FilterProvider.parseFilterData({
			 "A": ""
		 }, {
			 "A": {
				 ranges: [
					 {
						 operation: "EQ",
						 exclude: false,
						 value1: "0",
						 value2: "1"
					 }
				 ]
			 }
		 }, {}, true);
		 assert.ok(oResult);
		 assert.ok(oResult["A"]);
		 assert.equal(oResult["A"], "0");

		 oResult = FilterProvider.parseFilterData({
			 "A": ""
		 }, {
			 "A": {
				 ranges: [
					 {
						 operation: "EQ",
						 exclude: false,
						 value1: oDate1.toISOString(),
						 value2: ""
					 }
				 ]
			 }
		 }, {
			 dateFields: [
				 "A"
			 ]
		 }, true);
		 assert.ok(oResult);
		 assert.ok(oResult["A"]);
		 assert.equal(oResult["A"].toISOString(), oDate1.toISOString());

	 });

	 QUnit.test("Method _intialiseMetadata", function(assert) {

		 sinon.stub(this.oFilterProvider, "_createParameters");

		 this.oFilterProvider._intialiseMetadata();

		 assert.ok(this.oFilterProvider._createParameters.called);
	 });

	 QUnit.test("Method _createAnalyticalParameters ", function(assert) {

		 var oParams = {
			 getAllParameterNames: function() {
				 return [];
			 },
			 getEntitySet: function() {
				 return {
					 getQName: function() {
						 return {};
					 }
				 };
			 }
		 };

		 sinon.stub(this.oFilterProvider, "_getAnalyticParameterization").returns(oParams);
		 sinon.stub(this.oFilterProvider, "_createParametersByEntitySetName");

		 this.oFilterProvider._createAnalyticalParameters();

		 assert.ok(this.oFilterProvider._createParametersByEntitySetName.called);
	 });

	 QUnit.test("Method _initializeConditionTypeFields  ", function(assert) {

		 var oFlag = false;
		 this.oFilterProvider._mConditionTypeFields = {
			 "A": {
				 conditionType: {
					 initialize: function() {
					 },
					 getAsync: function() {
						 return true;
					 },
					 attachPendingChange: function() {
						 oFlag = true;
					 },
					 destroy: function() {
					 }
				 }
			 }
		 };

		 this.oFilterProvider._initializeConditionTypeFields();
		 assert.ok(oFlag);

		 this.oFilterProvider._mConditionTypeFields = null;
	 });

	 QUnit.test("Method _getType", function(assert) {

		 var oFieldViewMetadata = {
			 defaultFilterValue: "true",
			 fieldName: "foo",
			 precision: 1,
			 type: "Edm.Boolean"
		 };

		 sinon.spy(this.oFilterProvider, "_getType");
		 sinon.stub(ODataType, "getType").returns({});

		 oFieldViewMetadata.ui5Type = this.oFilterProvider._getType(oFieldViewMetadata);
		 assert.ok(this.oFilterProvider._getType.called);
		 assert.ok(ODataType.getType.called);

		 this.oFilterProvider._getType.reset();
		 ODataType.getType.reset();

		 this.oFilterProvider._getType(oFieldViewMetadata);
		 assert.ok(this.oFilterProvider._getType.called);
		 assert.ok(!ODataType.getType.called);

		 ODataType.getType.restore();
	 });

	 QUnit.test("Method _updateMultiValueControl with empty", function(assert) {

		 var oControl = new MultiInput(), aItems = [], aTokens, sEmpty = FormatUtil.getFormattedRangeText(library.valuehelpdialog.ValueHelpRangeOperation.Empty, null, null, false);
		 var aRanges = [
			 {
				 value1: "",
				 operation: "EQ",
				 exclude: false
			 }
		 ];
		 var oFieldMetadata = {};

		 this.oFilterProvider._updateMultiValueControl(oControl, aItems, aRanges, oFieldMetadata);
		 aTokens = oControl.getTokens();
		 assert.ok(aTokens);
		 assert.equal(aTokens.length, 1);
		 assert.equal(aTokens[0].getText(), sEmpty);

	 });

	 QUnit.test("Method _updateMultiValueControl with date", function(assert) {

		 var oControl = new MultiInput(), aItems = [], aTokens, sDate = "2018-09-06T00:00:00Z";
		 var aRanges = [
			 {
				 value1: new Date(sDate),
				 operation: "EQ",
				 exclude: false
			 }
		 ];
		 var oFieldMetadata = {
			 filterType: "date",
			 displayFormat: "Date",
			 type: "Edm.DateTime"
		 };
		 this.oFilterProvider._oDateFormatSettings = {
			 style: "short"
		 };

		 sap.ui.getCore().getConfiguration().setLanguage("EN");

		 oFieldMetadata.ui5Type = this.oFilterProvider._getType(oFieldMetadata);

		 this.oFilterProvider._updateMultiValueControl(oControl, aItems, aRanges, oFieldMetadata);
		 aTokens = oControl.getTokens();
		 assert.ok(aTokens);
		 assert.equal(aTokens.length, 1);
		 assert.equal(aTokens[0].getText(), "=9/6/18");

	 });

	 QUnit.test("Method _updateMultiValueControl with numeric", function(assert) {

		 var oControl = new MultiInput(), aItems = [], aTokens, nNum = 10;
		 var aRanges = [
			 {
				 value1: nNum,
				 operation: "EQ",
				 exclude: false
			 }
		 ];
		 var oFieldMetadata = {
			 filterType: "numeric",
			 type: "Edm.Int32"
		 };
		 this.oFilterProvider._oDateFormatSettings = {
			 style: "short"
		 };

		 sap.ui.getCore().getConfiguration().setLanguage("EN");

		 oFieldMetadata.ui5Type = this.oFilterProvider._getType(oFieldMetadata);

		 this.oFilterProvider._updateMultiValueControl(oControl, aItems, aRanges, oFieldMetadata);
		 aTokens = oControl.getTokens();
		 assert.ok(aTokens);
		 assert.equal(aTokens.length, 1);
		 assert.equal(aTokens[0].getText(), "=10");

	 });

	 QUnit.test("Method getFilterContextUrl with wrong model type", function(assert) {

		 this.oFilterProvider._oParentODataModel = {
			 isA: function(s) {
				 return false;
			 }
		 };

		 var sUrl = this.oFilterProvider.getFilterContextUrl();
		 assert.ok(!sUrl);
	 });

	 QUnit.test("Method getFilterContextUrl", function(assert) {

		 var oMetaModel = {
			 getODataEntitySet: function() {
				 return {
					 name: "EntitySet"
				 };
			 }
		 };

		 this.oFilterProvider._oParentODataModel = {
			 isA: function(s) {
				 return true;
			 },
			 getMetaModel: function() {
				 return oMetaModel;
			 },
			 _getServerUrl: function() {
				 return "server";
			 },
			 sServiceUrl: "/service"
		 };

		 var sUrl = this.oFilterProvider.getFilterContextUrl();
		 assert.ok(sUrl);
		 assert.equal(sUrl, "server/service/$metadata#EntitySet");
	 });

	 QUnit.test("Method getParameterContextUrl analytic/non analytic", function(assert) {

		 var oEntitySet = {
			 getQName: function() {
				 return "EntitySet";
			 }
		 };

		 this.oFilterProvider._oParameterization = {
			 getEntitySet: function() {
				 return oEntitySet;
			 }
		 };

		 this.oFilterProvider._oParentODataModel = {
			 isA: function(s) {
				 return true;
			 },
			 getMetaModel: function() {
				 return {};
			 },
			 _getServerUrl: function() {
				 return "server";
			 },
			 sServiceUrl: "/service"
		 };

		 var sUrl = this.oFilterProvider.getParameterContextUrl();
		 assert.ok(sUrl);
		 assert.equal(sUrl, "server/service/$metadata#EntitySet");

		 this.oFilterProvider._oParameterization = null;
		 this.oFilterProvider._oNonAnaParameterization = {
			 entitySetName: "EntitySet"
		 };

		 sUrl = this.oFilterProvider.getParameterContextUrl();
		 assert.ok(sUrl);
		 assert.equal(sUrl, "server/service/$metadata#EntitySet");

	 });

	 QUnit.test("Method _createFilterProvider ", function(assert) {

		 var oSmartFilterBar = {
			 getId: function() {
				 return "SFB";
			 }
		 };
		 var aGroups = [
			 {
				 fields: []
			 }
		 ];

		 sinon.stub(MetadataAnalyser.prototype, "getAllFilterableFieldsByEntitySetName").returns(aGroups);
		 sinon.stub(MetadataAnalyser.prototype, "getFieldGroupsByFilterFacetsAnnotation").returns(aGroups);

		 var oFilterProviderPromise = FilterProvider._createFilterProvider({
			 entityType: "foo",
			 model: oModel,
			 enableBasicSearch: true,
			 smartFilter: oSmartFilterBar
		 });

		 var done = assert.async();

		 oFilterProviderPromise.then(function(oFilterProvider) {
			 assert.ok(oFilterProvider);

			 MetadataAnalyser.prototype.getAllFilterableFieldsByEntitySetName.reset();
			 MetadataAnalyser.prototype.getFieldGroupsByFilterFacetsAnnotation.reset();

			 oFilterProvider.destroy();

			 done();
		 });

	 });

	 QUnit.test("Method adaptTime", function(assert) {

		 var oDate, oResultDate;

		 oDate = new Date(999999999999);
		 assert.equal(oDate.getMilliseconds(), 999, "Unmodified date has 999 milliseconds");

		 oDate = FilterProvider.adaptTime(new Date(999999999999), {displayFormat: "Date"});
		 assert.equal(oDate.getUTCHours(), 0, "Date: 0 Hours");
		 assert.equal(oDate.getUTCMinutes(), 0, "Date: 0 Minutes");
		 assert.equal(oDate.getUTCSeconds(), 0, "Date: 0 Seconds");
		 assert.equal(oDate.getUTCMilliseconds(), 0, "Date: 0 Milliseconds");

		 oDate = FilterProvider.adaptTime(new Date(999999999999), {precision: "0"});
		 assert.equal(oDate.getMilliseconds(), 0, "Precision 0: 0 Milliseconds");

		 oDate = FilterProvider.adaptTime(new Date(999999999999), {precision: "1"});
		 assert.equal(oDate.getMilliseconds(), 900, "Precision 1: 900 Milliseconds");

		 oDate = FilterProvider.adaptTime(new Date(999999999999), {precision: "2"});
		 assert.equal(oDate.getMilliseconds(), 990, "Precision 2: 990 Milliseconds");

		 oDate = FilterProvider.adaptTime(new Date(999999999999), {precision: "3"});
		 assert.equal(oDate.getMilliseconds(), 999, "Precision 3: 999 Milliseconds");

		 oDate = FilterProvider.adaptTime(new Date(999999999999), {});
		 assert.equal(oDate.getMilliseconds(), 999, "Precision undefined: 999 Milliseconds");

		 oDate = FilterProvider.adaptTime(new Date(999999999999), undefined);
		 assert.equal(oDate.getMilliseconds(), 999, "Precision undefined: 999 Milliseconds");

		 oDate = FilterProvider.adaptTime(new Date(999999999999), {precision: "5"});
		 assert.equal(oDate.getMilliseconds(), 999, "Precision 5: 999 Milliseconds");

		 oDate = new Date(0);
		 oResultDate = FilterProvider.adaptTime(oDate, {precision: "0"});
		 assert.strictEqual(oDate, oResultDate, "Returns same instance if no adaption is needed");

		 oDate = new Date(999999999999);
		 oResultDate = FilterProvider.adaptTime(oDate, {precision: "3"});
		 assert.strictEqual(oDate, oResultDate, "Returns same instance if no adaption is needed");

		 oDate = new Date(999999999999);
		 oResultDate = FilterProvider.adaptTime(oDate, undefined);
		 assert.strictEqual(oDate, oResultDate, "Returns same instance if no metadata is available");

		 oDate = "2018-05-30";
		 oResultDate = FilterProvider.adaptTime(oDate, {precision: "0"});
		 assert.strictEqual(oDate, oResultDate, "Returns other types unchanged");

	 });

	 QUnit.module("sap.ui.comp.smartfilterbar.FilterProvider: Date Controls validation", {
		 beforeEach: function() {
			 this.oFilterProvider = new FilterProvider({
				 entityType: "foo",
				 model: oModel
			 });
		 },
		 afterEach: function() {
			 this.oFilterProvider.destroy();
		 }
	 });

	 QUnit.test("Method _getSelectedDateRange should return array [date, date] if a date is passed to it", function(assert) {
		 var oDate = new Date(2019, 5, 7);

		 var aResult = this.oFilterProvider._getSelectedDateRange(oDate);

		 assert.ok(Array.isArray(aResult), "The returned value should be an array");
		 assert.equal(aResult.length, 2, "The length of the array should be 2");
		 assert.equal(aResult[0], oDate, "The first object of the array should be equal to the passed date");
		 assert.equal(aResult[1], oDate, "The second object of the array should be equal to the passed date");
	 });

	 QUnit.test("Method _getSelectedDateRange should return the same array that is passed to it", function(assert) {
		 var aDate = [new Date(2019, 5, 7), new Date(2019, 5, 9)];

		 var aResult = this.oFilterProvider._getSelectedDateRange(aDate);

		 assert.equal(aResult, aDate, "The returned array is the same array");
	 });

	 QUnit.test("Method _getDateFieldOutOfRangeErrorText should return the min date error message if min date is outside of the control boundaries", function (assert) {
		 var sExpectedMinDateErrorKey = "FILTER_BAR_DATE_FIELD_MIN_DATE_ERROR",
			 oMinDate = new Date(2019, 5, 7),
			 oMaxDate = new Date(2019, 5, 10),
			 aSelectedDateRange = [new Date(2019, 5, 6), new Date(2019, 5, 8)],
			 oControlStub = {
				 getMinDate: function () {
					 return oMinDate;
				 },
				 getMaxDate: function () {
					 return oMaxDate;
				 }
			 },
			 oTypeStub = {
				 formatValue: function () {}
			 },
			 oRbStub = {
				 // This value will be returned by the _getDateFieldOutOfRangeErrorText
				 // In this call we just return the argument passed to the getText method.
				 getText: this.stub().returnsArg(0)
			 };

		 var sResult = this.oFilterProvider._getDateFieldOutOfRangeErrorText(oControlStub, aSelectedDateRange, oTypeStub, oRbStub);

		 assert.equal(sResult, sExpectedMinDateErrorKey, "getText should be called with first argument " + sExpectedMinDateErrorKey);
	 });

	 QUnit.test("Method _getDateFieldOutOfRangeErrorText should return the max date error message if max date is outside of the control boundaries", function (assert) {
		 var sExpectedMinDateErrorKey = "FILTER_BAR_DATE_FIELD_MAX_DATE_ERROR",
			 oMinDate = new Date(2019, 5, 7),
			 oMaxDate = new Date(2019, 5, 10),
			 aSelectedDateRange = [new Date(2019, 5, 8), new Date(2019, 5, 11)],
			 oControlStub = {
				 getMinDate: function () {
					 return oMinDate;
				 },
				 getMaxDate: function () {
					 return oMaxDate;
				 }
			 },
			 oTypeStub = {
				 formatValue: function () {}
			 },
			 oRbStub = {
				 // This value will be returned by the _getDateFieldOutOfRangeErrorText
				 // In this call we just return the argument passed to the getText method.
				 getText: this.stub().returnsArg(0)
			 };

		 var sResult = this.oFilterProvider._getDateFieldOutOfRangeErrorText(oControlStub, aSelectedDateRange, oTypeStub, oRbStub);

		 assert.equal(sResult, sExpectedMinDateErrorKey, "getText should be called with first argument " + sExpectedMinDateErrorKey);
	 });

	 QUnit.test("DatePicker change event should set correct error messages when min date is not respected", function(assert) {
		 var oSelectedDate = new Date(2019, 5, 6),
			 oMinDate = new Date(2019, 5, 10),
			 sExpectedMinDate = "2019/5/10",
			 sExpectedText = "Enter a valid date after: " + sExpectedMinDate,
			 oFieldViewMetadata = {
				 controlType: "date",
				 filterRestriction: "single",
				 fieldName: "foo",
				 type: "Edm.DateTime",
				 name: "foofoo",
				 groupName: "fooGroup"
			 };

		 // Create control
		 oFieldViewMetadata.fControlConstructor = this.oFilterProvider._getControlConstructor(oFieldViewMetadata);
		 var oGetTypeStub = this.stub(this.oFilterProvider, "_getType").callsFake(function () {
				 return {
					 formatValue: function () { return sExpectedMinDate; }
				 };
			 }),
			 oControl = this.oFilterProvider._createControl(oFieldViewMetadata);

		 // Stub parse methods so we do not rely on the locale to pass the right date
		 // This will be removed when datepicker provides the needed information in the event
		 var oParseValueStub = this.stub(oControl, "_parseValue").callsFake(function () {
				 return oSelectedDate;
			 }),
			 oSetValueStateTextSpy = this.spy(oControl, "setValueStateText");

		 oControl.setMinDate(oMinDate);
		 oControl.fireChangeEvent("string reprensetation of the date. No need to be real because stub of the _parseValue", { valid: false });

		 assert.equal(oSetValueStateTextSpy.args[0][0], sExpectedText, "setValueStateText should be called with the correct max date error");

		 // Cleanup
		 oGetTypeStub.restore();
		 oParseValueStub.restore();
		 oSetValueStateTextSpy.restore();
		 oControl.destroy();
	 });

	 QUnit.test("DatePicker change event should set correct error messages when max date is not respected", function(assert) {
		 var oSelectedDate = new Date(2019, 5, 11),
			 oMaxDate = new Date(2019, 5, 10),
			 sExpectedMaxDate = "2019/5/10",
			 sExpectedText = "Enter a valid date before: " + sExpectedMaxDate,
			 oFieldViewMetadata = {
				 controlType: "date",
				 filterRestriction: "single",
				 fieldName: "foo",
				 type: "Edm.DateTime",
				 name: "foofoo",
				 groupName: "fooGroup"
			 };

		 // Create control
		 oFieldViewMetadata.fControlConstructor = this.oFilterProvider._getControlConstructor(oFieldViewMetadata);
		 var oGetTypeStub = this.stub(this.oFilterProvider, "_getType").callsFake(function () {
				 return {
					 formatValue: function () { return sExpectedMaxDate; }
				 };
			 }),
			 oControl = this.oFilterProvider._createControl(oFieldViewMetadata);

		 // Stub parse methods so we do not rely on the locale to pass the right date
		 // This will be removed when datepicker provides the needed information in the event
		 var oParseValueStub = this.stub(oControl, "_parseValue").callsFake(function () {
				 return oSelectedDate;
			 }),
			 oSetValueStateTextSpy = this.spy(oControl, "setValueStateText");

		 oControl.setMaxDate(oMaxDate);
		 oControl.fireChangeEvent("string reprensetation of the date. No need to be real because stub of the _parseValue", { valid: false });

		 assert.equal(oSetValueStateTextSpy.args[0][0], sExpectedText, "setValueStateText should be called with the correct max date error");

		 // Cleanup
		 oGetTypeStub.restore();
		 oParseValueStub.restore();
		 oSetValueStateTextSpy.restore();
		 oControl.destroy();
	 });

	 QUnit.test("Method getFilledFilterData with boolean=false/true", function(assert) {

		  var oData = {
			"booleanFalse" : {
				value: false,
				items: [],
				ranges: []
			},
			"booleanTrue" : {
				value: true,
				items: [],
				ranges: []
			}
		  };

		  if ( this.oFilterProvider.oModel) {
			  this.oFilterProvider.oModel.destroy();
		  }
		  this.oFilterProvider.oModel = {
			   getData: function() { return oData;}
		  };

		  var aResult = this.oFilterProvider.getFilledFilterData(["booleanFalse", "booleanTrue"]);
		  assert.ok(aResult);
		  assert.equal(Object.keys(aResult).length, 2);

		  assert.ok(!aResult["booleanFalse"].value);
		  assert.ok(aResult["booleanTrue"].value);

		  this.oFilterProvider.oModel = null;
	 });

	 QUnit.module("Internal methods", {
		 beforeEach: function () {
			 this.oFP = new FilterProvider();
		 },
		 afterEach: function () {
			 this.oFP.destroy();
		 }
	 });

	 QUnit.test("_setControlDisplayFormat", function (assert) {
		 // Arrange
		 var oControl = {
				 setDisplayFormat: sinon.stub()
			 },
			 // Mock object with only style parameter
			 oDateFormatSettings = {
				 style: "short"
			 };

		 // Act
		 this.oFP._setControlDisplayFormat(oControl, oDateFormatSettings);

		 // Assert
		 assert.strictEqual(oControl.setDisplayFormat.callCount, 1, "Method called once");
		 assert.ok(oControl.setDisplayFormat.calledWith("short"), "Method called with expected parameter");

		 // Arrange - mock object with both parameters
		 oDateFormatSettings = {
			 style: "long",
			 pattern: "YYYY-MM-DD"
		 };
		 oControl.setDisplayFormat.reset();

		 // Act
		 this.oFP._setControlDisplayFormat(oControl, oDateFormatSettings);

		 // Assert
		 assert.strictEqual(oControl.setDisplayFormat.callCount, 1, "Method called once");
		 assert.ok(oControl.setDisplayFormat.calledWith("long"), "Method called with expected parameter");

		 // Arrange - mock object with only pattern parameter
		 oDateFormatSettings = {
			 pattern: "YYYY-MM-DD"
		 };
		 oControl.setDisplayFormat.reset();

		 // Act
		 this.oFP._setControlDisplayFormat(oControl, oDateFormatSettings);

		 // Assert
		 assert.strictEqual(oControl.setDisplayFormat.callCount, 1, "Method called once");
		 assert.ok(oControl.setDisplayFormat.calledWith("YYYY-MM-DD"), "Method called with expected parameter");

		 // Arrange - empty mock object
		 oDateFormatSettings = {};
		 oControl.setDisplayFormat.reset();

		 // Act
		 this.oFP._setControlDisplayFormat(oControl, oDateFormatSettings);

		 // Assert
		 assert.strictEqual(oControl.setDisplayFormat.callCount, 0, "Method should not be called");

		 // Arrange
		 oControl.setDisplayFormat.reset();

		 // Act - no date format settings
		 this.oFP._setControlDisplayFormat(oControl);

		 // Assert
		 assert.strictEqual(oControl.setDisplayFormat.callCount, 0, "Method should not be called");

	 });

	 QUnit.test("_getStringEmptyFilter", function (assert) {
		// Arrange
		var oFilter;

		// Act - include operation - nullable: false
		oFilter = FilterProvider._getStringEmptyFilter("test", {nullable: "false"});

		// Assert
		assert.strictEqual(oFilter._bMultiFilter, false, "We have a single filter");
		assert.strictEqual(oFilter.oValue1, "", "Value is empty string");
		assert.strictEqual(oFilter.sOperator, "EQ", "Operator is EQ");

		// Act - include operation - nullable: true
		 oFilter = FilterProvider._getStringEmptyFilter("test", {/* in this case nullable is not defined */});

		// Assert
		assert.strictEqual(oFilter._bMultiFilter, true, "We have a multi filter");
		assert.strictEqual(oFilter.aFilters.length, 2, "We have two filters created");
		assert.strictEqual(oFilter.bAnd, undefined, "Filter is of type OR");
		assert.strictEqual(oFilter.aFilters[0].sOperator, "EQ", "Operator for filter is EQ");
		assert.strictEqual(oFilter.aFilters[1].sOperator, "EQ", "Operator for filter is EQ");
		assert.strictEqual(oFilter.aFilters[0].oValue1, "", "Value is empty string");
		assert.strictEqual(oFilter.aFilters[1].oValue1, null, "Value is null");

		// Act - exclude operation - nullable: false
		oFilter = FilterProvider._getStringEmptyFilter("test", {nullable: "false"}, true);

		// Assert
		assert.strictEqual(oFilter._bMultiFilter, false, "We have a single filter");
		assert.strictEqual(oFilter.sOperator, "NE", "Operator is NE");
		assert.strictEqual(oFilter.oValue1, "", "Value is empty string");

		// Act - exclude operation - nullable: true
		oFilter = FilterProvider._getStringEmptyFilter("test", {nullable: "true"}, true);

		// Assert
		assert.strictEqual(oFilter._bMultiFilter, true, "We have a multi filter");
		assert.strictEqual(oFilter.aFilters.length, 2, "We have two filters created");
		assert.strictEqual(oFilter.bAnd, true, "Filter is of type AND");
		assert.strictEqual(oFilter.aFilters[0].sOperator, "NE", "Operator for filter is NE");
		assert.strictEqual(oFilter.aFilters[1].sOperator, "NE", "Operator for filter is NE");
		assert.strictEqual(oFilter.aFilters[0].oValue1, "", "Value is empty string");
		assert.strictEqual(oFilter.aFilters[1].oValue1, null, "Value is null");
	 });

	 QUnit.start();

 });
