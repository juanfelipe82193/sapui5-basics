/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/providers/BaseValueListProvider",
	"sap/ui/comp/util/DateTimeUtil",
	"sap/m/MultiComboBox",
	"sap/ui/comp/library"
], function(BaseValueListProvider, DateTimeUtil, MultiComboBox, library) {
	"use strict";

	var DisplayBehaviour = library.smartfilterbar.DisplayBehaviour;

	QUnit.module("sap.ui.comp.providers.BaseValueListProvider", {
		beforeEach: function() {
			this.sTitle = "foo";
			this.oAnnotation = {valueListEntitySetName: "Chuck", keyField: "TheKey", descriptionField: "Desc", keys: ["TheKey"], fields: [{name: "MyText", type: "Edm.String"}, {name: "MyDate",type: "Edm.DateTime", displayFormat: "Date"}], valueListFields: [{name: "TheKey", type: "Edm.String", visible: true}, {name: "Desc",type: "Edm.String", visible: true}, {name: "DoB",type: "Edm.DateTime", displayFormat: "Date", visible: true}, {name: "employed", type: "Edm.Boolean", visible: false}]};
			this.oModel = {read: sinon.stub()};
			this.oBaseValueListProvider = new BaseValueListProvider({title:this.sTitle,control: new MultiComboBox(), aggregation:"items",annotation:this.oAnnotation,model:this.oModel});
		},
		afterEach: function() {
			this.oBaseValueListProvider.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oBaseValueListProvider);
	});

	QUnit.test("Shall default UTC to true when no dateFormatSettings are passed", function(assert) {
		assert.ok(this.oBaseValueListProvider._oDateFormatSettings);
		assert.strictEqual(this.oBaseValueListProvider._oDateFormatSettings.UTC, true);
	});

	QUnit.test("Shall contain the necessary params", function(assert) {
		assert.strictEqual(this.oBaseValueListProvider.sKey,this.oAnnotation.keyField);
		assert.strictEqual(this.oBaseValueListProvider.sDescription,this.oAnnotation.descriptionField);
		assert.strictEqual(this.oBaseValueListProvider.oODataModel,this.oModel);
		assert.strictEqual(this.oBaseValueListProvider.oFilterModel,this.oAnnotation.filterModel);
		assert.strictEqual(this.oBaseValueListProvider._aKeys,this.oAnnotation.keys);
		assert.strictEqual(this.oBaseValueListProvider.sDDLBDisplayBehaviour, DisplayBehaviour.descriptionOnly);
		assert.strictEqual(this.oBaseValueListProvider.sTokenDisplayBehaviour, DisplayBehaviour.descriptionAndId);
	});

	QUnit.test("Shall contain the necessary columns", function(assert) {
		var aCols = this.oBaseValueListProvider._aCols;
		assert.strictEqual(aCols.length, 3);
	});

	QUnit.test("_calculateFilterInputData Shall set mFilterInputData & aFilterField", function(assert) {
		var oData = {"field":"value","field2":"value2","SomeField":"value3"};
		this.oBaseValueListProvider.oFilterModel = {getData:function(){return oData;}};
		this.oBaseValueListProvider.mInParams = {field:"field",SomeField:"field3"};
		this.oBaseValueListProvider._calculateFilterInputData();
		assert.ok(this.oBaseValueListProvider.mFilterInputData);
		assert.strictEqual(this.oBaseValueListProvider.mFilterInputData.field, "value");
		assert.strictEqual(this.oBaseValueListProvider.mFilterInputData.field3, "value3");
		assert.ok(this.oBaseValueListProvider.aFilterField);
		assert.strictEqual(this.oBaseValueListProvider.aFilterField.length, 2);
		assert.strictEqual(this.oBaseValueListProvider.aFilterField[0], "field");
		assert.strictEqual(this.oBaseValueListProvider.aFilterField[1], "field3");
	});

	QUnit.test("_calculateFilterInputData Shall set mFilterInputData & aFilterField from FilterProvider/SmartFilter (visble fields)", function(assert) {
		var oVisibleFieldData = {"field":"value","field2":"value2","SomeField":"value3"};
		this.oBaseValueListProvider.oFilterProvider = {_oSmartFilter:{getFilterData:function(){return oVisibleFieldData;}}};
		this.oBaseValueListProvider.mInParams = {field:"field",SomeField:"field3"};
		this.oBaseValueListProvider._calculateFilterInputData();
		assert.ok(this.oBaseValueListProvider.mFilterInputData);
		assert.strictEqual(this.oBaseValueListProvider.mFilterInputData.field, "value");
		assert.strictEqual(this.oBaseValueListProvider.mFilterInputData.field3, "value3");
		assert.ok(this.oBaseValueListProvider.aFilterField);
		assert.strictEqual(this.oBaseValueListProvider.aFilterField.length, 2);
		assert.strictEqual(this.oBaseValueListProvider.aFilterField[0], "field");
		assert.strictEqual(this.oBaseValueListProvider.aFilterField[1], "field3");
	});

	QUnit.test("_calculateFilterInputData Shall set mFilterInputData & aFilterField (SmartField scenario, with a Date input)", function(assert) {

		var oDate = new Date();
		var oDatePlusTimezone = DateTimeUtil.utcToLocal(oDate);

		this.oBaseValueListProvider.oODataModel = {};
		this.oBaseValueListProvider.mInParams = {stringField:"MyText", dateField:"MyDate"};

		var oBindingContext = {
		    getProperty: function(s) {
               return (s === "dateField") ? oDate : s;
		    }
		};
		sinon.stub(this.oBaseValueListProvider.oControl, "getBindingContext").returns(oBindingContext);

		this.oBaseValueListProvider._calculateFilterInputData();
		assert.ok(this.oBaseValueListProvider.mFilterInputData);
		assert.strictEqual(this.oBaseValueListProvider.mFilterInputData.MyText, "stringField");
		assert.strictEqual(this.oBaseValueListProvider.mFilterInputData.MyDate.toJSON(),  oDatePlusTimezone.toJSON());
		assert.ok(this.oBaseValueListProvider.aFilterField);
		assert.strictEqual(this.oBaseValueListProvider.aFilterField.length, 2);
		assert.strictEqual(this.oBaseValueListProvider.aFilterField[0], "MyText");
		assert.strictEqual(this.oBaseValueListProvider.aFilterField[1], "MyDate");
	});


	QUnit.test("_calculateAndSetFilterOutputData shall call setFilterData on the filterProvider", function(assert) {
		//Single-Value
		var aData = [{"field":"value"},{"SomeField":"value3"}];
		this.oBaseValueListProvider.oFilterProvider = {setFilterData:sinon.stub(), _getFieldMetadata:sinon.stub()};
		this.oBaseValueListProvider.mOutParams = {field1:"field",field2:"FieldTwo"};
		this.oBaseValueListProvider._calculateAndSetFilterOutputData(aData);
		assert.strictEqual(this.oBaseValueListProvider.oFilterProvider.setFilterData.calledOnce, true);
		assert.strictEqual(this.oBaseValueListProvider.oFilterProvider.setFilterData.calledWith({field1:{items:[{key:"value"}], ranges:[]}}), true);

		//Multi-value
		var oData = {"field1":{items:[{key:"value2"}]},"SomeField":"value3"};
		this.oBaseValueListProvider.oFilterModel = {getData:function(){return oData;}};
		aData = [{"field":"value"}, {"field":"value1"}, {"field":"value2"},{"SomeField":"value3"}];
		this.oBaseValueListProvider.oFilterProvider.setFilterData.reset();
		this.oBaseValueListProvider._calculateAndSetFilterOutputData(aData);
		assert.strictEqual(this.oBaseValueListProvider.oFilterProvider.setFilterData.calledOnce, true);
		assert.strictEqual(this.oBaseValueListProvider.oFilterProvider.setFilterData.calledWith({field1:{items:[{key:"value2"},{key:"value1"},{key:"value"}], ranges:[]}}), true);

		//Multi-value DateTime outParameter value
		var oData = {"datefield":{items:[{key:"value2"}]}};
		this.oBaseValueListProvider.oFilterProvider = {
			setFilterData:sinon.stub(),
			_getFieldMetadata:function() { return { "type": "Edm.DateTime"}; }
		};
		this.oBaseValueListProvider.oFilterModel = {getData:function(){return oData;}};
		var oDate = new Date();
		var oDateResult = DateTimeUtil.utcToLocal(oDate);

		aData = [{"datefield": oDate}];
		this.oBaseValueListProvider.mOutParams = {field1:"datefield"};

		this.oBaseValueListProvider.oFilterProvider.setFilterData.reset();
		this.oBaseValueListProvider._calculateAndSetFilterOutputData(aData);

		assert.strictEqual(this.oBaseValueListProvider.oFilterProvider.setFilterData.calledOnce, true);
		assert.strictEqual(this.oBaseValueListProvider.oFilterProvider.setFilterData.calledWith({field1:{items:[], ranges:[{
			"exclude": false,
			"operation": "EQ",
			"keyField": "field1",
			"value1": oDateResult,
			"value2": null
		}] }} ), true);
	});

	QUnit.test("_calculateAndSetFilterOutputData shall call setData on the filterModel", function(assert) {
		//Single-Value
		var aData = [{"field":"value"},{"SomeField":"value3"}];
		var oFilterModel = {getData:sinon.stub(), setData:sinon.stub()};
		this.oBaseValueListProvider.oFilterModel = oFilterModel;
		this.oBaseValueListProvider.oFilterProvider = {setFilterData:function(mFilterOutputData) { oFilterModel.setData(mFilterOutputData, true);},_getFieldMetadata:sinon.stub()};
		this.oBaseValueListProvider.mOutParams = {field1:"field",field2:"FieldTwo"};
		this.oBaseValueListProvider._calculateAndSetFilterOutputData(aData);
		assert.strictEqual(this.oBaseValueListProvider.oFilterModel.setData.calledOnce, true);
		assert.strictEqual(this.oBaseValueListProvider.oFilterModel.setData.calledWith({field1:{items:[{key:"value"}], ranges:[]}}), true);
	});

	QUnit.test("_resolveAnnotationData adds correctly the valueListFields from the annotation to the _aCols array", function (assert) {
		var aFields = [{
				name: "CURR",
				type: "Edm.String",
				maxLength: "4",
				fieldLabel: "Currency Code",
				visible: true
			}],
			oAnnotation = {
				valueListEntitySetName: "EntityName",
				keyField: "keyField",
				valueListFields: aFields
			};

		this.oBaseValueListProvider._resolveAnnotationData(oAnnotation);

		assert.equal(this.oBaseValueListProvider._aCols[0].template, aFields[0].name, "a visible field is added to the _aCols array");

	});

	QUnit.test("_getColumnConfigFromField should create column configuration from a field metadata", function (assert) {
		// Arrange
		var oFieldStub = {
			type: "Edm.String",
			fieldLabel: "FieldLabel",
			quickInfo: "Tooltip",
			name: "Path in the model",
			sortable: true
		};

		// Act
		var oResult = this.oBaseValueListProvider._getColumnConfigFromField(oFieldStub);

		// Arrange
		assert.equal(oResult.label, oFieldStub.fieldLabel, "'label' should be equal to the 'fieldLabel' from the field");
		assert.equal(oResult.sort, oFieldStub.name, "'sort' should be equal to the 'name' if sortable is 'true' in the field");
		assert.equal(oResult.sortOrder, "Ascending", "'sortOrder' should be equal to Ascending");
		assert.equal(oResult.template, oFieldStub.name, "'template' should be equal to the 'name' from the field");
		assert.equal(oResult.tooltip, oFieldStub.quickInfo, "'tooltip' should be equal to the 'quickInfo' from the field");
		assert.equal(oResult.type, "string", "'type' should be equal to the 'string' for 'Edm.String'");
		assert.equal(oResult.width, "15em", "'width' should be equal to the '15em' if no min/max length is set");
	});

	QUnit.start();

});
