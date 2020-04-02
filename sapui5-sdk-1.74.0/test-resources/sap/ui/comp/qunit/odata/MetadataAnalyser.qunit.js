/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/odata/MetadataAnalyser", "sap/ui/model/odata/v2/ODataModel", "sap/ui/model/odata/ODataMetaModel", "sap/ui/core/util/MockServer", "sap/base/util/merge"
], function(MetadataAnalyser, ODataModel, ODataMetaModel, MockServer, merge) {
	"use strict";

	var oTestEntity, oTestEntitySet;
	function setUpMockServer() {
		// configure
		MockServer.config({
			autoRespond: true
		});

		var oMockServer = new MockServer({
			rootUri: "/odataFake/"
		});
		// simulate
		oMockServer.simulate("test-resources/sap/ui/comp/qunit/odata/mockserver/metadata.xml");
		oMockServer.start();

		return oMockServer;
	}

	QUnit.module("sap.ui.comp.odata.MetadataAnalyser", {
		before: function(assert) {
			this.oMockserver = setUpMockServer();
			this.oModel = new ODataModel("/odataFake/");
		},
		after: function() {
			this.oModel.destroy();
			MockServer.stopAll();

		},
		beforeEach: function(assert) {
			this.oMetadataAnalyser = new MetadataAnalyser();
		},
		afterEach: function() {
			this.oMetadataAnalyser.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oMetadataAnalyser);
	});

	QUnit.test("Shall not work without an ODataModel instance", function(assert) {
		var oMetadataAnalyser = new MetadataAnalyser("foo");

		assert.equal(oMetadataAnalyser._sResourceRootUri, "foo"); // deprecated since several years!
		assert.equal(oMetadataAnalyser.oModel, undefined);
		assert.equal(oMetadataAnalyser._oMetaModel, undefined);
		assert.equal(oMetadataAnalyser._oMetadata, undefined);
		assert.equal(oMetadataAnalyser._oSchemaDefinition, undefined);
	});

	QUnit.test("Shall get the metamodel, metadata and schema definition from the OData model", function(assert) {
		var oMetadata, oMetaModel, oModel, oSchemaDefinition, oMetadataAnalyser;
		oSchemaDefinition = {};
		oMetadata = {
			dataServices: {
				schema: [
					oSchemaDefinition
				]
			}
		};
		oMetaModel = {
			getProperty: function() {
				return oMetadata;
			}
		};
		oModel = {
			getServiceMetadata: function() {
				return oMetadata;
			},
			getMetaModel: function() {
				return oMetaModel;
			}
		};

		oMetadataAnalyser = new MetadataAnalyser(oModel);
		assert.equal(oMetadataAnalyser.oModel, oModel);
		assert.equal(oMetadataAnalyser._oMetaModel, oMetaModel);
		assert.equal(oMetadataAnalyser._oMetadata, oMetadata);
		assert.equal(oMetadataAnalyser._oSchemaDefinition, oSchemaDefinition);
	});

	QUnit.test("Shall return the fields for the specified entity set name", function(assert) {
		var aFields = null, sEntitySet = "TestItems";

		var done = assert.async();

		this.oModel.getMetaModel().loaded().then(function() {
			var oMetadataAnalyser = new MetadataAnalyser(this.oModel);

			aFields = oMetadataAnalyser.getFieldsByEntitySetName("Somehting that doesn't exist!");
			assert.strictEqual(aFields, null);

			sinon.spy(oMetadataAnalyser, "_enrichEntitySetMetadata");

			aFields = oMetadataAnalyser.getFieldsByEntitySetName(sEntitySet);
			assert.ok(aFields);
			assert.strictEqual(oMetadataAnalyser._enrichEntitySetMetadata.calledOnce, true);
			assert.strictEqual(aFields.length, 179);
			assert.strictEqual(aFields[0].name, "CashDiscountAmountInTransactionCurrency");
			assert.strictEqual(aFields[0].fieldLabel, "Discount (Doc. Crcy)");
			assert.strictEqual(aFields[0].sortable, true);
			assert.strictEqual(aFields[0].filterable, true);
			assert.strictEqual(aFields[0].requiredFilterField, false);
			assert.strictEqual(aFields[0].aggregationRole, "measure");
			assert.strictEqual(aFields[0].type, "Edm.Decimal");
			assert.strictEqual(aFields[0].visible, true);
			assert.strictEqual(aFields[0].displayFormat, "UpperCase");
			assert.strictEqual(aFields[0].entityName, "TestItem");

			assert.strictEqual(aFields[36].name, "AuthorizationGroup");
			assert.strictEqual(aFields[36].sortable, false);
			assert.strictEqual(aFields[36].filterable, false);

			assert.strictEqual(aFields[163].name, "HasText");
			assert.strictEqual(aFields[163].sortable, false);
			assert.strictEqual(aFields[163].filterable, true);

			assert.strictEqual(aFields[176].name, "AssignmentReference");
			assert.strictEqual(aFields[176].fieldLabel, "Assignment");
			assert.strictEqual(aFields[176].sortable, true);
			assert.strictEqual(aFields[176].filterable, true);
			assert.strictEqual(aFields[176].requiredFilterField, true);
			assert.strictEqual(aFields[176].aggregationRole, undefined);
			assert.strictEqual(aFields[176].type, "Edm.String");
			assert.strictEqual(aFields[176].visible, true);
			assert.strictEqual(aFields[176].displayFormat, undefined);
			assert.strictEqual(aFields[176].entityName, "TestItem");

			assert.strictEqual(aFields[177].name, "VisibleFalse");
			assert.strictEqual(aFields[177].visible, false);

			assert.strictEqual(aFields[178].name, "HiddenTrue");
			assert.strictEqual(aFields[178].visible, false);

			oMetadataAnalyser.destroy();
			done();
		}.bind(this));
	});

	QUnit.test("Shall return the fields for the specified entity type", function(assert) {

		var aFields = null, sEntityType = "TestItem";

		var done = assert.async();

		this.oModel.getMetaModel().loaded().then(function() {
			var oMetadataAnalyser = new MetadataAnalyser(this.oModel);

			aFields = oMetadataAnalyser.getFieldsByEntityTypeName(sEntityType);
			assert.ok(aFields);
			assert.strictEqual(aFields.length, 179);
			assert.strictEqual(aFields[0].name, "CashDiscountAmountInTransactionCurrency");
			assert.strictEqual(aFields[0].fieldLabel, "Discount (Doc. Crcy)");
			assert.strictEqual(aFields[0].filterable, true);
			// assert.strictEqual(aFields[0].sortable, true); sortable is updated only for entitySets
			assert.strictEqual(aFields[0].requiredFilterField, false);
			assert.strictEqual(aFields[0].aggregationRole, "measure");
			assert.strictEqual(aFields[0].type, "Edm.Decimal");
			assert.strictEqual(aFields[0].visible, true);
			assert.strictEqual(aFields[0].displayFormat, "UpperCase");
			assert.strictEqual(aFields[0].entityName, "TestItem");

			assert.strictEqual(aFields[2].name, "ValuatedAmntInAdditionalCrcy2");
			assert.strictEqual(aFields[2].fieldLabel, "LC3 Evaluated Amount");
			assert.strictEqual(aFields[2].filterable, true);
			// assert.strictEqual(aFields[0].sortable, true); sortable is updated only for entitySets
			assert.strictEqual(aFields[2].requiredFilterField, true);
			assert.strictEqual(aFields[2].entityName, "TestItem");

			assert.strictEqual(aFields[176].name, "AssignmentReference");
			assert.strictEqual(aFields[176].fieldLabel, "Assignment");
			// assert.strictEqual(aFields[176].sortable, true); sortable is updated only for entitySets
			assert.strictEqual(aFields[176].filterable, true);
			assert.strictEqual(aFields[176].requiredFilterField, true);
			assert.strictEqual(aFields[176].aggregationRole, undefined);
			assert.strictEqual(aFields[176].type, "Edm.String");
			assert.strictEqual(aFields[176].visible, true);
			assert.strictEqual(aFields[176].displayFormat, undefined);
			assert.strictEqual(aFields[176].entityName, "TestItem");

			assert.strictEqual(aFields[177].name, "VisibleFalse");
			assert.strictEqual(aFields[177].visible, false);

			assert.strictEqual(aFields[178].name, "HiddenTrue");
			assert.strictEqual(aFields[178].visible, false);

			oMetadataAnalyser.destroy();
			done();
		}.bind(this));
	});

	QUnit.test("Shall return the keys for the specified entity set name", function(assert) {
		var aKeys = null, sEntityType = "Item";
		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);

		aKeys = this.oMetadataAnalyser.getKeysByEntitySetName("Somehting that doesn't exist!");
		assert.strictEqual(aKeys, null);

		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns(oTestEntity);
		this.oMetadataAnalyser._oMetaModel.getODataEntitySet.returns(oTestEntitySet);

		aKeys = this.oMetadataAnalyser.getKeysByEntitySetName(sEntityType);
		assert.strictEqual(aKeys.length, 1);
		assert.equal(aKeys[0], "GeneratedID");
	});

	QUnit.test("Shall return the keys for the specified entity type", function(assert) {
		var aKeys = null, sEntityType = "Item";
		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);

		aKeys = this.oMetadataAnalyser.getKeysByEntityTypeName("Somehting that doesn't exist!");
		assert.strictEqual(aKeys, null);

		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns(oTestEntity);

		aKeys = this.oMetadataAnalyser.getKeysByEntityTypeName(sEntityType);
		assert.strictEqual(aKeys.length, 1);
		assert.equal(aKeys[0], "GeneratedID");
	});

	QUnit.test("returns the result of getMultiUnitBehaviorEnabled (based on Common.ApplyMultiUnitBehaviorForSortingAndFiltering)", function(assert) {

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);

		// no entity container
		assert.strictEqual(this.oMetadataAnalyser.getMultiUnitBehaviorEnabled(), false);

		var oEntityContainer = {
			"com.sap.vocabularies.Common.v1.ApplyMultiUnitBehaviorForSortingAndFiltering": {}
		};

		this.oMetadataAnalyser._oMetaModel.getODataEntityContainer.returns(oEntityContainer);

		// test (default true)
		assert.strictEqual(this.oMetadataAnalyser.getMultiUnitBehaviorEnabled(), true);

		oEntityContainer = {
			"com.sap.vocabularies.Common.v1.ApplyMultiUnitBehaviorForSortingAndFiltering": {
				Bool: "false"
			}
		};
		this.oMetadataAnalyser._oMetaModel.getODataEntityContainer.returns(oEntityContainer);
		// test (set to false)
		assert.strictEqual(this.oMetadataAnalyser.getMultiUnitBehaviorEnabled(), false);

		oEntityContainer = {
			"com.sap.vocabularies.Common.v1.ApplyMultiUnitBehaviorForSortingAndFiltering": {
				Bool: "true"
			}
		};
		this.oMetadataAnalyser._oMetaModel.getODataEntityContainer.returns(oEntityContainer);
		// test (set to true)
		assert.strictEqual(this.oMetadataAnalyser.getMultiUnitBehaviorEnabled(), true);

		oEntityContainer = {
			foo: "bar"
		};
		this.oMetadataAnalyser._oMetaModel.getODataEntityContainer.returns(oEntityContainer);
		// test (not present)
		assert.strictEqual(this.oMetadataAnalyser.getMultiUnitBehaviorEnabled(), false);
	});

	QUnit.test("Shall return the filterable fields/groups for the specified entity set name", function(assert) {
		var aGroups = null, aFields = null, sEntitySet = "TestItems";

		var done = assert.async();

		this.oModel.getMetaModel().loaded().then(function() {
			var oMetadataAnalyser = new MetadataAnalyser(this.oModel);

			aGroups = oMetadataAnalyser.getAllFilterableFieldsByEntitySetName("Something that doesn't exist!");
			assert.strictEqual(aGroups.length, 0);

			aGroups = oMetadataAnalyser.getAllFilterableFieldsByEntitySetName(sEntitySet);
			assert.strictEqual(aGroups.length, 1);
			assert.strictEqual(aGroups[0].groupName, undefined);
			assert.strictEqual(aGroups[0].groupEntitySetName, "TestItems");
			assert.strictEqual(aGroups[0].groupEntityTypeName, "TestItem");
			aFields = aGroups[0].fields;
			assert.strictEqual(aFields.length, 162);
			assert.strictEqual(aFields[0].name, "CashDiscountAmountInTransactionCurrency");
			assert.strictEqual(aFields[0].sortable, true);
			assert.strictEqual(aFields[0].requiredFilterField, false);
			assert.strictEqual(aFields[0].filterRestriction, undefined);

			assert.strictEqual(aFields[29].filterRestriction, "single-value");
			assert.strictEqual(aFields[30].filterRestriction, "multi-value");
			assert.strictEqual(aFields[31].filterRestriction, "interval");

			assert.strictEqual(aFields[68].name, "KeyDate");
			assert.strictEqual(aFields[68].sortable, false);
			assert.strictEqual(aFields[68].filterable, true);
			assert.strictEqual(aFields[68].requiredFilterField, false);
			assert.strictEqual(aFields[68].filterRestriction, undefined);

			assert.strictEqual(aFields[76].name, "CustomerAccountName");
			assert.strictEqual(aFields[76].sortable, false);
			assert.strictEqual(aFields[76].filterable, true);
			assert.strictEqual(aFields[76].requiredFilterField, false);
			assert.strictEqual(aFields[76].filterRestriction, undefined);

			assert.strictEqual(aFields[161].name, "AssignmentReference");
			assert.strictEqual(aFields[161].sortable, true);
			assert.strictEqual(aFields[161].filterable, true);
			assert.strictEqual(aFields[161].requiredFilterField, true);
			assert.strictEqual(aFields[161].filterRestriction, undefined);

			oMetadataAnalyser.destroy();
			done();
		}.bind(this));
	});

	QUnit.test("Is calender date shall work for sap:semantics = 'yearmonthday' and sap:display-format = 'Date'", function(assert) {
		var aFields = null, sEntitySet = "TestItems";

		var done = assert.async();

		this.oModel.getMetaModel().loaded().then(function() {
			var oMetadataAnalyser = new MetadataAnalyser(this.oModel);

			aFields = oMetadataAnalyser.getFieldsByEntitySetName(sEntitySet);

			assert.ok(aFields);
			assert.strictEqual(aFields.length, 179);

			// => Positive Test;
			// sap:semantics resp. Common.IsCalendarDate
			assert.strictEqual(aFields[39].name, "DocumentDate");
			assert.strictEqual(aFields[39].isCalendarDate, true);
			assert.strictEqual(aFields[39].displayFormat, undefined);

			// sap:display-format = 'Date'
			assert.strictEqual(aFields[45].name, "PostingDate");
			assert.strictEqual(aFields[45].isCalendarDate, false);
			assert.strictEqual(aFields[45].displayFormat, "Date");

			// Neither nor
			assert.strictEqual(aFields[176].name, "AssignmentReference");
			assert.strictEqual(aFields[176].isCalendarDate, false);

			oMetadataAnalyser.destroy();
			done();
		}.bind(this));
	});

	QUnit.test("getAllFilterableFieldsByEntitySetName shall return an array of the field names", function(assert) {
		var aFieldGroup, aFieldName;

		var done = assert.async();

		this.oModel.getMetaModel().loaded().then(function() {
			var oMetadataAnalyser = new MetadataAnalyser(this.oModel);

			aFieldGroup = oMetadataAnalyser.getAllFilterableFieldsByEntitySetName("TestItems");
			assert.ok(aFieldGroup);
			assert.equal(aFieldGroup.length, 1);

			aFieldName = aFieldGroup[0].fields;
			assert.ok(aFieldName);
			assert.equal(aFieldName.length, 162);
			assert.equal(aFieldName[0].name, "CashDiscountAmountInTransactionCurrency");
			assert.equal(aFieldName[161].name, "AssignmentReference");

			oMetadataAnalyser.destroy();
			done();
		}.bind(this));
	});

	QUnit.test("Shall return the entity type (or null) for the specified entity set name", function(assert) {
		var sEntityType = null, sName = "Items";
		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);

		sEntityType = this.oMetadataAnalyser.getEntityTypeNameFromEntitySetName("Somehting that doesn't exist!");
		assert.strictEqual(sEntityType, null);

		this.oMetadataAnalyser._oMetaModel.getODataEntitySet.returns(oTestEntitySet);

		sEntityType = this.oMetadataAnalyser.getEntityTypeNameFromEntitySetName(sName);
		assert.equal(sEntityType, "com.sap.foo.Item");
	});

	QUnit.test("Shall return the entity set name (or null) for the specified entity type name", function(assert) {
		var sEntitySet = null, sName = "Item", oEntityContainer;
		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		sEntitySet = this.oMetadataAnalyser.getEntitySetNameFromEntityTypeName("Somehting that doesn't exist!");
		assert.strictEqual(sEntitySet, null);

		oEntityContainer = {
			name: "ZFAR_CUSTOMER_LINE_ITEMS2_SRV_Entities",
			isDefaultEntityContainer: "true",
			entitySet: [
				oTestEntitySet
			],
			"foo": "bar"
		};
		this.oMetadataAnalyser._oMetaModel.getODataEntityContainer.returns(oEntityContainer);
		this.oMetadataAnalyser._oSchemaDefinition = {
			namespace: "com.sap.foo"
		};

		sEntitySet = this.oMetadataAnalyser.getEntitySetNameFromEntityTypeName(sName);
		assert.equal(sEntitySet, "Items");
	});

	QUnit.test("getValueListAnnotation shall check for the OData property on both entityType or complexType ", function(assert) {
		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);

		// Simulate that entitytype is present
		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns({});

		this.oMetadataAnalyser.getValueListAnnotation("foo");

		// Only entity type is checked
		assert.strictEqual(this.oMetadataAnalyser._oMetaModel.getODataEntityType.calledOnce, true);
		assert.strictEqual(this.oMetadataAnalyser._oMetaModel.getODataComplexType.called, false);

		// Simulate that entitytype is not present
		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns(null);

		this.oMetadataAnalyser.getValueListAnnotation("foo");

		// both entity type and complex type are checked
		assert.strictEqual(this.oMetadataAnalyser._oMetaModel.getODataEntityType.calledTwice, true);
		assert.strictEqual(this.oMetadataAnalyser._oMetaModel.getODataComplexType.calledOnce, true);

	});

	QUnit.test("getValueListAnnotation shall return the resolved ValueList annotation from ODataMetaModel/property", function(assert) {
		var mAnnotation = null, oAnnotation = null;
		var oProperty = {
			"name": "WAERS",
			"type": "Edm.String",
			"maxLength": "5",
			"sap:display-format": "UpperCase",
			"sap:label": "Currency",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Currency"
			},
			"sap:heading": "Crcy",
			"sap:quickinfo": "Currency Key",
			"sap:semantics": "currency-code",
			"com.sap.vocabularies.Common.v1.ValueList": {
				"CollectionPath": {
					"String": "VLEntitySet"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "WAERS"
						},
						"ValueListProperty": {
							"String": "WAERS"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterInOut"
					}, {
						"ValueListProperty": {
							"String": "LTEXT"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}
				]
			}
		};

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataProperty.returns(oProperty);

		mAnnotation = this.oMetadataAnalyser.getValueListAnnotation("com.sap.GL.ZAF.SomeEntity/WAERS");
		oAnnotation = mAnnotation.primaryValueListAnnotation;

		assert.ok(oAnnotation, "Annotation found");
		assert.strictEqual(mAnnotation.additionalAnnotations.length, 0);

		assert.strictEqual(oAnnotation.valueListEntitySetName, "VLEntitySet");
		assert.strictEqual(oAnnotation.keyField, "WAERS");
		assert.strictEqual(oAnnotation.isSearchSupported, false);
	});

	QUnit.test("getValueListAnnotation shall return only annotations having term com.sap.vocabularies.Common.v1.ValueList", function(assert) {
		var mAnnotation = null, oAnnotation = null;
		var oProperty = {
			"name": "WAERS",
			"type": "Edm.String",
			"maxLength": "5",
			"sap:display-format": "UpperCase",
			"sap:label": "Currency",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Currency"
			},
			"sap:heading": "Crcy",
			"sap:quickinfo": "Currency Key",
			"sap:semantics": "currency-code"
		};

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataProperty.returns(oProperty);

		mAnnotation = this.oMetadataAnalyser.getValueListAnnotation("com.sap.GL.ZAF.SomeEntity/WAERS");
		oAnnotation = mAnnotation.primaryValueListAnnotation;

		assert.ok(!oAnnotation, "No Annotation found");
		assert.strictEqual(mAnnotation.additionalAnnotations.length, 0);
	});

	QUnit.test("getValueListAnnotation shall return all the matching ValueList annotations", function(assert) {
		var mAnnotation = null, oAnnotation = null;
		var oProperty = {
			"name": "ReconciliationAccount",
			"type": "Edm.String",
			"maxLength": "10",
			"documentation": [
				{
					"text": null,
					"extensions": [
						{
							"name": "Summary",
							"value": "The reconciliation account in G/L accounting is the account which is updated parallel to the subledger account for normal postings (for example, invoice or payment).",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}, {
							"name": "LongDescription",
							"value": "For special postings (for example, down payment or bill of exchange), this account is replaced by another account (for example, 'down payments received' instead of 'receivables').\nThe replacement takes place due to the special G/L indicator which you must specify for these types of postings.",
							"attributes": [],
							"children": [],
							"namespace": "http://schemas.microsoft.com/ado/2008/09/edm"
						}
					]
				}
			],
			"extensions": [
				{
					"name": "aggregation-role",
					"value": "dimension",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "display-format",
					"value": "UpperCase",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "label",
					"value": "Recon. Account",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "heading",
					"value": "Recon.Acc.",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "quickinfo",
					"value": "Reconciliation Account in General Ledger",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}, {
					"name": "creatable",
					"value": "false",
					"namespace": "http://www.sap.com/Protocols/SAPData"
				}
			],
			"sap:aggregation-role": "dimension",
			"sap:display-format": "UpperCase",
			"sap:label": "Recon. Account",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Recon. Account"
			},
			"sap:heading": "Recon.Acc.",
			"sap:quickinfo": "Reconciliation Account in General Ledger",
			"sap:creatable": "false",
			"com.sap.vocabularies.Common.v1.ValueList": {
				"Label": {
					"String": "G/L account no. in chart of accounts"
				},
				"CollectionPath": {
					"String": "VL_SH_GL_ACCT_CA_NO"
				},
				"SearchSupported": {
					"Bool": "true"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKAN"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterIn"
					}, {
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKNR"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterOut"
					}, {
						"ValueListProperty": {
							"String": "KTOPL"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "TXT50"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}
				]
			},
			"com.sap.vocabularies.Common.v1.ValueList#GL_ACCT_CA_TEXT": {
				"Label": {
					"String": "G/L account description in chart of accounts"
				},
				"CollectionPath": {
					"String": "VL_SH_GL_ACCT_CA_TEXT"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKAN"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterIn"
					}, {
						"ValueListProperty": {
							"String": "TXT50"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "KTOPL"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKNR"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterOut"
					}
				]
			},
			"com.sap.vocabularies.Common.v1.ValueList#GL_ACCT_CA_FLAGS": {
				"Label": {
					"String": "G/L account with delete/lock flag in chart of accounts"
				},
				"CollectionPath": {
					"String": "VL_SH_GL_ACCT_CA_FLAGS"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKAN"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterIn"
					}, {
						"ValueListProperty": {
							"String": "TXT50"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "KTOPL"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "XLOEV"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "XSPEB"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "XSPEA"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "XSPEP"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKNR"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterOut"
					}
				]
			},
			"com.sap.vocabularies.Common.v1.ValueList#GL_ACCT_CA_KEY": {
				"Label": {
					"String": "Key words"
				},
				"CollectionPath": {
					"String": "VL_SH_GL_ACCT_CA_KEY"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKAN"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterIn"
					}, {
						"ValueListProperty": {
							"String": "SCHLW"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "SPRAS"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "KTOPL"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKNR"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterOut"
					}, {
						"ValueListProperty": {
							"String": "TXT50"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}
				]
			},
			"com.sap.vocabularies.Common.v1.ValueList#GL_ACCT_CC_NO": {
				"Label": {
					"String": "G/L account number in company code"
				},
				"CollectionPath": {
					"String": "VL_SH_GL_ACCT_CC_NO"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKAN"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterIn"
					}, {
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKNR"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterOut"
					}, {
						"ValueListProperty": {
							"String": "BUKRS"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "TXT50"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}
				]
			},
			"com.sap.vocabularies.Common.v1.ValueList#GL_ACCT_CC_TEXT": {
				"Label": {
					"String": "G/L account description in company code"
				},
				"CollectionPath": {
					"String": "VL_SH_GL_ACCT_CC_TEXT"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKAN"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterIn"
					}, {
						"ValueListProperty": {
							"String": "TXT50"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "BUKRS"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKNR"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterOut"
					}
				]
			},
			"com.sap.vocabularies.Common.v1.ValueList#GL_ACCT_CC_FLAGS": {
				"Label": {
					"String": "G/L account with delete/lock flag in company code"
				},
				"CollectionPath": {
					"String": "VL_SH_GL_ACCT_CC_FLAGS"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKAN"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterIn"
					}, {
						"ValueListProperty": {
							"String": "TXT50"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "BUKRS"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "XLOEV_KTP"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "XLOEV"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "XSPEB_KTP"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "XSPEB"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKNR"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterOut"
					}
				]
			},
			"com.sap.vocabularies.Common.v1.ValueList#GL_ACCT_CC_ALTERNATIV_NO": {
				"Label": {
					"String": "Alternative account number"
				},
				"CollectionPath": {
					"String": "VL_SH_GL_ACCT_CC_ALTERNATIV_NO"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKAN"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterIn"
					}, {
						"ValueListProperty": {
							"String": "ALTKT"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "BUKRS"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "TXT50"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKNR"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterOut"
					}
				]
			}
		};

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataProperty.returns(oProperty);

		mAnnotation = this.oMetadataAnalyser.getValueListAnnotation("com.sap.GL.ZAF.SomeEntity/ReconciliationAccount");
		oAnnotation = mAnnotation.primaryValueListAnnotation;

		assert.ok(oAnnotation, "Annotation found");

		assert.strictEqual(oAnnotation.valueListEntitySetName, "VL_SH_GL_ACCT_CA_NO");
		assert.strictEqual(oAnnotation.keyField, "SAKNR");
		assert.strictEqual(oAnnotation.isSearchSupported, true);
		assert.strictEqual(oAnnotation.valueListTitle, "G/L account no. in chart of accounts");

		assert.strictEqual(mAnnotation.additionalAnnotations.length, 7);

		assert.strictEqual(mAnnotation.additionalAnnotations[0].valueListEntitySetName, "VL_SH_GL_ACCT_CA_TEXT");
		assert.strictEqual(mAnnotation.additionalAnnotations[0].valueListTitle, "G/L account description in chart of accounts");
		assert.strictEqual(mAnnotation.additionalAnnotations[0].isSearchSupported, false);
		assert.strictEqual(mAnnotation.additionalAnnotations[0].qualifier, "GL_ACCT_CA_TEXT");

		assert.strictEqual(mAnnotation.additionalAnnotations[1].valueListEntitySetName, "VL_SH_GL_ACCT_CA_FLAGS");
		assert.strictEqual(mAnnotation.additionalAnnotations[1].valueListTitle, "G/L account with delete/lock flag in chart of accounts");
		assert.strictEqual(mAnnotation.additionalAnnotations[1].isSearchSupported, false);
		assert.strictEqual(mAnnotation.additionalAnnotations[1].qualifier, "GL_ACCT_CA_FLAGS");

		assert.strictEqual(mAnnotation.additionalAnnotations[6].valueListEntitySetName, "VL_SH_GL_ACCT_CC_ALTERNATIV_NO");
		assert.strictEqual(mAnnotation.additionalAnnotations[6].valueListTitle, "Alternative account number");
		assert.strictEqual(mAnnotation.additionalAnnotations[6].isSearchSupported, false);
		assert.strictEqual(mAnnotation.additionalAnnotations[6].qualifier, "GL_ACCT_CC_ALTERNATIV_NO");
	});

	QUnit.test("getValueListAnnotationLazy shall return Promise that would be resolved once the annotation is loaded", function(assert) {
		var done = assert.async();
		var oPromise;
		var oVLA = {
			"": {
				"Label": {
					"String": "G/L account no. in chart of accounts"
				},
				"CollectionPath": {
					"String": "VL_SH_GL_ACCT_CA_NO"
				},
				"SearchSupported": {
					"Bool": "true"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKAN"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterIn"
					}, {
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKNR"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterOut"
					}, {
						"ValueListProperty": {
							"String": "KTOPL"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "TXT50"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}
				]
			},
			"GL_ACCT_CA_TEXT": {
				"Label": {
					"String": "G/L account description in chart of accounts"
				},
				"CollectionPath": {
					"String": "VL_SH_GL_ACCT_CA_TEXT"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKAN"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterIn"
					}, {
						"ValueListProperty": {
							"String": "TXT50"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "KTOPL"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKNR"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterOut"
					}
				]
			},
			"GL_ACCT_CA_FLAGS": {
				"Label": {
					"String": "G/L account with delete/lock flag in chart of accounts"
				},
				"CollectionPath": {
					"String": "VL_SH_GL_ACCT_CA_FLAGS"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKAN"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterIn"
					}, {
						"ValueListProperty": {
							"String": "TXT50"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "KTOPL"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "XLOEV"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "XSPEB"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "XSPEA"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "XSPEP"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKNR"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterOut"
					}
				]
			},
			"GL_ACCT_CA_KEY": {
				"Label": {
					"String": "Key words"
				},
				"CollectionPath": {
					"String": "VL_SH_GL_ACCT_CA_KEY"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKAN"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterIn"
					}, {
						"ValueListProperty": {
							"String": "SCHLW"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "SPRAS"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "KTOPL"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKNR"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterOut"
					}, {
						"ValueListProperty": {
							"String": "TXT50"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}
				]
			},
			"GL_ACCT_CC_NO": {
				"Label": {
					"String": "G/L account number in company code"
				},
				"CollectionPath": {
					"String": "VL_SH_GL_ACCT_CC_NO"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKAN"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterIn"
					}, {
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKNR"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterOut"
					}, {
						"ValueListProperty": {
							"String": "BUKRS"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "TXT50"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}
				]
			},
			"GL_ACCT_CC_TEXT": {
				"Label": {
					"String": "G/L account description in company code"
				},
				"CollectionPath": {
					"String": "VL_SH_GL_ACCT_CC_TEXT"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKAN"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterIn"
					}, {
						"ValueListProperty": {
							"String": "TXT50"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "BUKRS"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKNR"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterOut"
					}
				]
			},
			"GL_ACCT_CC_FLAGS": {
				"Label": {
					"String": "G/L account with delete/lock flag in company code"
				},
				"CollectionPath": {
					"String": "VL_SH_GL_ACCT_CC_FLAGS"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKAN"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterIn"
					}, {
						"ValueListProperty": {
							"String": "TXT50"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "BUKRS"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "XLOEV_KTP"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "XLOEV"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "XSPEB_KTP"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "XSPEB"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKNR"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterOut"
					}
				]
			},
			"GL_ACCT_CC_ALTERNATIV_NO": {
				"Label": {
					"String": "Alternative account number"
				},
				"CollectionPath": {
					"String": "VL_SH_GL_ACCT_CC_ALTERNATIV_NO"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKAN"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterIn"
					}, {
						"ValueListProperty": {
							"String": "ALTKT"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "BUKRS"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "TXT50"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKNR"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterOut"
					}
				]
			}
		};
		var oVLPromise = Promise.resolve(oVLA);

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataProperty.returns("model/0/1/ReconciliationAccount");
		this.oMetadataAnalyser._oMetaModel.getODataValueLists.returns(oVLPromise);

		oPromise = this.oMetadataAnalyser.getValueListAnnotationLazy("com.sap.GL.ZAF.SomeEntity/ReconciliationAccount");

		assert.ok(oPromise, "Promise returned");

		oPromise.then(function(mAnnotation) {
			assert.ok(mAnnotation && mAnnotation.primaryValueListAnnotation, "Promise Resolved");
			assert.equal(mAnnotation.primaryValueListAnnotation.annotation, oVLA[""], "Annotations match");

			assert.strictEqual(mAnnotation.primaryValueListAnnotation.valueListEntitySetName, "VL_SH_GL_ACCT_CA_NO");
			assert.strictEqual(mAnnotation.primaryValueListAnnotation.keyField, "SAKNR");
			assert.strictEqual(mAnnotation.primaryValueListAnnotation.isSearchSupported, true);
			assert.strictEqual(mAnnotation.primaryValueListAnnotation.valueListTitle, "G/L account no. in chart of accounts");

			assert.strictEqual(mAnnotation.additionalAnnotations.length, 7);

			assert.strictEqual(mAnnotation.additionalAnnotations[0].valueListEntitySetName, "VL_SH_GL_ACCT_CA_TEXT");
			assert.strictEqual(mAnnotation.additionalAnnotations[0].valueListTitle, "G/L account description in chart of accounts");
			assert.strictEqual(mAnnotation.additionalAnnotations[0].isSearchSupported, false);
			assert.strictEqual(mAnnotation.additionalAnnotations[0].qualifier, "GL_ACCT_CA_TEXT");

			assert.strictEqual(mAnnotation.additionalAnnotations[1].valueListEntitySetName, "VL_SH_GL_ACCT_CA_FLAGS");
			assert.strictEqual(mAnnotation.additionalAnnotations[1].valueListTitle, "G/L account with delete/lock flag in chart of accounts");
			assert.strictEqual(mAnnotation.additionalAnnotations[1].isSearchSupported, false);
			assert.strictEqual(mAnnotation.additionalAnnotations[1].qualifier, "GL_ACCT_CA_FLAGS");

			assert.strictEqual(mAnnotation.additionalAnnotations[6].valueListEntitySetName, "VL_SH_GL_ACCT_CC_ALTERNATIV_NO");
			assert.strictEqual(mAnnotation.additionalAnnotations[6].valueListTitle, "Alternative account number");
			assert.strictEqual(mAnnotation.additionalAnnotations[6].isSearchSupported, false);
			assert.strictEqual(mAnnotation.additionalAnnotations[6].qualifier, "GL_ACCT_CC_ALTERNATIV_NO");

			done();
		});
	});

	QUnit.test("getValueListAnnotationLazy shall only return additional annotations without a PresentationVariantQualifier", function(assert) {
		var done = assert.async();
		var oPromise;
		var oVLA = {
			"": {
				"Label": {
					"String": "G/L account no. in chart of accounts"
				},
				"CollectionPath": {
					"String": "VL_SH_GL_ACCT_CA_NO"
				},
				"SearchSupported": {
					"Bool": "true"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKAN"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterIn"
					}, {
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKNR"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterOut"
					}, {
						"ValueListProperty": {
							"String": "KTOPL"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "TXT50"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}
				]
			},
			"GL_ACCT_CA_TEXT": {
				"Label": {
					"String": "G/L account description in chart of accounts"
				},
				"CollectionPath": {
					"String": "VL_SH_GL_ACCT_CA_TEXT"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKAN"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterIn"
					}, {
						"ValueListProperty": {
							"String": "TXT50"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "KTOPL"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKNR"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterOut"
					}
				]
			},
			"GL_ACCT_CA_FLAGS": {
				"Label": {
					"String": "G/L account with delete/lock flag in chart of accounts"
				},
				"CollectionPath": {
					"String": "VL_SH_GL_ACCT_CA_FLAGS"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKAN"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterIn"
					}, {
						"ValueListProperty": {
							"String": "TXT50"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "KTOPL"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "XLOEV"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "XSPEB"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "XSPEA"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "XSPEP"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKNR"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterOut"
					}
				]
			},
			"GL_ACCT_CA_KEY": {
				"Label": {
					"String": "Key words"
				},
				"CollectionPath": {
					"String": "VL_SH_GL_ACCT_CA_KEY"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKAN"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterIn"
					}, {
						"ValueListProperty": {
							"String": "SCHLW"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "SPRAS"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "KTOPL"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKNR"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterOut"
					}, {
						"ValueListProperty": {
							"String": "TXT50"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}
				]
			},
			"GL_ACCT_CC_NO": {
				"Label": {
					"String": "G/L account number in company code"
				},
				"CollectionPath": {
					"String": "VL_SH_GL_ACCT_CC_NO"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKAN"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterIn"
					}, {
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKNR"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterOut"
					}, {
						"ValueListProperty": {
							"String": "BUKRS"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "TXT50"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}
				]
			},
			"GL_ACCT_CC_TEXT": {
				"Label": {
					"String": "G/L account description in company code"
				},
				"CollectionPath": {
					"String": "VL_SH_GL_ACCT_CC_TEXT"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKAN"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterIn"
					}, {
						"ValueListProperty": {
							"String": "TXT50"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "BUKRS"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKNR"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterOut"
					}
				]
			},
			"GL_ACCT_CC_FLAGS": {
				"Label": {
					"String": "G/L account with delete/lock flag in company code"
				},
				"CollectionPath": {
					"String": "VL_SH_GL_ACCT_CC_FLAGS"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKAN"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterIn"
					}, {
						"ValueListProperty": {
							"String": "TXT50"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "BUKRS"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "XLOEV_KTP"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "XLOEV"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "XSPEB_KTP"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "XSPEB"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKNR"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterOut"
					}
				],
				"PresentationVariantQualifier": {
					"String": "GL_ACCT_CC_FLAGS"
				}
			},
			"GL_ACCT_CC_ALTERNATIV_NO": {
				"Label": {
					"String": "Alternative account number"
				},
				"CollectionPath": {
					"String": "VL_SH_GL_ACCT_CC_ALTERNATIV_NO"
				},
				"Parameters": [
					{
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKAN"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterIn"
					}, {
						"ValueListProperty": {
							"String": "ALTKT"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "BUKRS"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"ValueListProperty": {
							"String": "TXT50"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly"
					}, {
						"LocalDataProperty": {
							"PropertyPath": "ReconciliationAccount"
						},
						"ValueListProperty": {
							"String": "SAKNR"
						},
						"RecordType": "com.sap.vocabularies.Common.v1.ValueListParameterOut"
					}
				]
			}
		};
		var oVLPromise = Promise.resolve(oVLA);

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataProperty.returns("model/0/1/ReconciliationAccount");
		this.oMetadataAnalyser._oMetaModel.getODataValueLists.returns(oVLPromise);

		oPromise = this.oMetadataAnalyser.getValueListAnnotationLazy("com.sap.GL.ZAF.SomeEntity/ReconciliationAccount");

		assert.ok(oPromise, "Promise returned");

		oPromise.then(function(mAnnotation) {
			assert.ok(mAnnotation && mAnnotation.primaryValueListAnnotation, "Promise Resolved");
			assert.equal(mAnnotation.primaryValueListAnnotation.annotation, oVLA[""], "Annotations match");

			assert.strictEqual(mAnnotation.primaryValueListAnnotation.valueListEntitySetName, "VL_SH_GL_ACCT_CA_NO");
			assert.strictEqual(mAnnotation.primaryValueListAnnotation.keyField, "SAKNR");
			assert.strictEqual(mAnnotation.primaryValueListAnnotation.isSearchSupported, true);
			assert.strictEqual(mAnnotation.primaryValueListAnnotation.valueListTitle, "G/L account no. in chart of accounts");

			// only 6 additional annotations found
			assert.strictEqual(mAnnotation.additionalAnnotations.length, 6);

			assert.strictEqual(mAnnotation.additionalAnnotations[0].valueListEntitySetName, "VL_SH_GL_ACCT_CA_TEXT");
			assert.strictEqual(mAnnotation.additionalAnnotations[0].valueListTitle, "G/L account description in chart of accounts");
			assert.strictEqual(mAnnotation.additionalAnnotations[0].isSearchSupported, false);
			assert.strictEqual(mAnnotation.additionalAnnotations[0].qualifier, "GL_ACCT_CA_TEXT");

			assert.strictEqual(mAnnotation.additionalAnnotations[1].valueListEntitySetName, "VL_SH_GL_ACCT_CA_FLAGS");
			assert.strictEqual(mAnnotation.additionalAnnotations[1].valueListTitle, "G/L account with delete/lock flag in chart of accounts");
			assert.strictEqual(mAnnotation.additionalAnnotations[1].isSearchSupported, false);
			assert.strictEqual(mAnnotation.additionalAnnotations[1].qualifier, "GL_ACCT_CA_FLAGS");

			assert.strictEqual(mAnnotation.additionalAnnotations[5].valueListEntitySetName, "VL_SH_GL_ACCT_CC_ALTERNATIV_NO");
			assert.strictEqual(mAnnotation.additionalAnnotations[5].valueListTitle, "Alternative account number");
			assert.strictEqual(mAnnotation.additionalAnnotations[5].isSearchSupported, false);
			assert.strictEqual(mAnnotation.additionalAnnotations[5].qualifier, "GL_ACCT_CC_ALTERNATIV_NO");

			done();
		});
	});

	QUnit.test("getNamespace shall return the schema namespace", function(assert) {
		var oSchema, sNamespace;
		oSchema = {
			"namespace": "com.sap.GL.ZAF"
		};
		this.oMetadataAnalyser._oSchemaDefinition = oSchema;

		// Call CUT
		sNamespace = this.oMetadataAnalyser.getNamespace();

		assert.equal(sNamespace, "com.sap.GL.ZAF");
	});

	QUnit.test("getNamespace shall return undefined if there are no OData metadata", function(assert) {
		var sNamespace;
		this.oMetadataAnalyser._oSchemaDefinition = undefined;

		// Call CUT
		sNamespace = this.oMetadataAnalyser.getNamespace();

		assert.strictEqual(sNamespace, undefined);
	});

	QUnit.test("_getFullyQualifiedNameForField shall return the full name", function(assert) {
		var sFullname;
		var oEntityDef = {
			namespace: "com.sap",
			name: "Company"
		};

		// Call CUT
		sFullname = this.oMetadataAnalyser._getFullyQualifiedNameForField("MyField", oEntityDef);

		assert.equal(sFullname, "com.sap.Company/MyField");
	});

	QUnit.test("getIsSearchSupported shall return false if there is no annotation", function(assert) {
		var bIsSearchSupported;

		// Call CUT
		bIsSearchSupported = this.oMetadataAnalyser.getIsSearchSupported(undefined);

		assert.strictEqual(bIsSearchSupported, false);
	});

	QUnit.test("getIsSearchSupported shall return the value of the SearchSupported property", function(assert) {
		var bIsSearchSupported, oAnnotation;

		oAnnotation = {
			CollectionPath: {
				String: "COMPANIES"
			},
			Label: {
				String: "foo bar"
			},
			SearchSupported: {
				Bool: "true"
			},
			Parameters: []
		};

		// Call CUT
		bIsSearchSupported = this.oMetadataAnalyser.getIsSearchSupported(oAnnotation);

		assert.strictEqual(bIsSearchSupported, true);
	});

	QUnit.test("getEntityContainerAttribute shall return the attribute value from the specified attribute name on the default entity container", function(assert) {
		var sAttributeValue, oEntityContainer;

		oEntityContainer = {
			name: "ZFAR_CUSTOMER_LINE_ITEMS2_SRV_Entities",
			isDefaultEntityContainer: "true",
			entitySet: [],
			extensions: [],
			"sap:use-batch": "true",
			"sap:supported-formats": "atom json xlsx"
		};

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataEntityContainer.returns(oEntityContainer);

		sAttributeValue = this.oMetadataAnalyser.getEntityContainerAttribute("supported-formats");
		assert.strictEqual(sAttributeValue, "atom json xlsx");

		sAttributeValue = this.oMetadataAnalyser.getEntityContainerAttribute("use-batch");
		assert.strictEqual(sAttributeValue, "true");

		sAttributeValue = this.oMetadataAnalyser.getEntityContainerAttribute("something-invalid");
		assert.strictEqual(sAttributeValue, null);
	});

	QUnit.test("getEntityContainerAttribute shall return null if no extensions exist on the default entity container", function(assert) {
		var sAttributeValue, oEntityContainer;

		oEntityContainer = {
			name: "ZFAR_CUSTOMER_LINE_ITEMS2_SRV_Entities",
			isDefaultEntityContainer: "true",
			entitySet: [],
			extensions: []
		};

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataEntityContainer.returns(oEntityContainer);

		sAttributeValue = this.oMetadataAnalyser.getEntityContainerAttribute("supported-formats");
		assert.strictEqual(sAttributeValue, null);

		sAttributeValue = this.oMetadataAnalyser.getEntityContainerAttribute("use-batch");
		assert.strictEqual(sAttributeValue, null);

		sAttributeValue = this.oMetadataAnalyser.getEntityContainerAttribute("something-invalid");
		assert.strictEqual(sAttributeValue, null);
	});

	QUnit.test("getDescriptionFieldName shall return the name of the Description property/field", function(assert) {
		var sDesciptionField = null;

		var oField = {
			"name": "KeyFieldName",
			"type": "Edm.String",
			"maxLength": "10",
			"sap:aggregation-role": "dimension",
			"sap:display-format": "UpperCase",
			"sap:label": "KeyField Label",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "KeyField Label"
			},
			"sap:text": "DescriptionFieldName",
			"com.sap.vocabularies.Common.v1.Text": {
				"Path": "DescriptionFieldName"
			},
			"sap:heading": "KeyField Heading",
			"sap:quickinfo": "Quick info for KeyField",
			"sap:creatable": "false"
		};

		sinon.stub(this.oMetadataAnalyser, "getFieldsByEntitySetName").returns([
			{}, oField, {}, {}
		]);

		// Using name of the field and entity name
		sDesciptionField = this.oMetadataAnalyser.getDescriptionFieldName("KeyFieldName", "foo");
		assert.strictEqual(sDesciptionField, "DescriptionFieldName");

		// Using the field itself
		sDesciptionField = this.oMetadataAnalyser.getDescriptionFieldName(oField);
		assert.strictEqual(sDesciptionField, "DescriptionFieldName");

	});

	QUnit.test("resolveEditableFieldFor shall return the relevant field path from Common.EditableFieldFor annotation (if it exists)", function(assert) {
		var oFieldMetadata = {
			"name": "ProductForEdit",
			"type": "Edm.String",
			"maxLength": "10",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Product"
			},
			"label": "Product",
			"com.sap.vocabularies.Common.v1.Text": {
				"Path": "ProductNameName"
			}
		};

		// Check for resolved path
		assert.strictEqual(MetadataAnalyser.resolveEditableFieldFor(oFieldMetadata), undefined, "No EditableFieldFor");

		oFieldMetadata["com.sap.vocabularies.Common.v1.EditableFieldFor"] = {};
		// Check for resolved path
		assert.strictEqual(MetadataAnalyser.resolveEditableFieldFor(oFieldMetadata), undefined, "No path in EditableFieldFor");

		var sProperty = "Product";
		oFieldMetadata["com.sap.vocabularies.Common.v1.EditableFieldFor"] = {
			PropertyPath: sProperty
		};
		// Check for resolved path
		assert.strictEqual(MetadataAnalyser.resolveEditableFieldFor(oFieldMetadata), sProperty, "Path found");
	});

	QUnit.test("updateDataFieldDefault shall update the field metadata with values from DataFieldDefault annotation (Criticality - similar to LineItem)", function(assert) {
		var oFieldMetadata;

		oFieldMetadata = {
			"name": "CompanyCode",
			"type": "Edm.String",
			"maxLength": "10",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "CompanyCode Label"
			},
			"label": "CompanyCode Label",
			"com.sap.vocabularies.Common.v1.Text": {
				"Path": "DescriptionFieldName"
			},
			"com.sap.vocabularies.UI.v1.DataFieldDefault": {
				"Value": {
					"Path": "CompanyCode"
				},
				"Criticality": {
					"Path": "Path_to_Criticality"
				},
				"CriticalityRepresentation": {
					"EnumMember": "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithIcon"
				},
				"Label": {
					"String": "Label via DataFieldDefault"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField"
			}
		};

		// Using name of the field and entity name
		assert.strictEqual(oFieldMetadata.label, "CompanyCode Label");

		// Update Field with DataFieldDefault annotation
		this.oMetadataAnalyser.updateDataFieldDefault(oFieldMetadata);
		assert.strictEqual(oFieldMetadata.label, "Label via DataFieldDefault");
		assert.ok(oFieldMetadata.criticalityInfo);
		assert.strictEqual(oFieldMetadata.criticalityInfo.path, "Path_to_Criticality");
		assert.strictEqual(oFieldMetadata.criticalityInfo.criticalityRepresentationType, "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithIcon");
	});

	QUnit.test("updateDataFieldDefault shall update the field metadata with values from DataFieldDefault annotation (UrlInfo similar to LineItem)", function(assert) {
		var oFieldMetadata;

		oFieldMetadata = {
			"name": "Customer",
			"type": "Edm.String",
			"maxLength": "10",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Customer Label"
			},
			"label": "Customer Label",
			"com.sap.vocabularies.Common.v1.Text": {
				"Path": "DescriptionFieldName"
			},
			"com.sap.vocabularies.UI.v1.DataFieldDefault": {
				"Value": {
					"Path": "Customer"
				},
				"Url": {
					"Path": "CustomerURL"
				},
				"Label": {
					"String": "Label via DataFieldDefault"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataFieldWithUrl"
			}
		};

		// Using name of the field and entity name
		assert.strictEqual(oFieldMetadata.label, "Customer Label");

		// Update Field with DataFieldDefault annotation
		this.oMetadataAnalyser.updateDataFieldDefault(oFieldMetadata);
		assert.strictEqual(oFieldMetadata.label, "Label via DataFieldDefault");
		assert.ok(oFieldMetadata.urlInfo);
		assert.strictEqual(oFieldMetadata.urlInfo.urlPath, "CustomerURL");
	});

	QUnit.test("getLineItemAnnotation shall return the matching LineItem annotation with fields and labels and Criticality", function(assert) {
		var aLineItemAnnotation, oEntity, oAnnotation, oCriticality;

		aLineItemAnnotation = [
			{
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
				},
				"Value": {
					"Path": "Customer"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.String"
			}, {
				"Value": {
					"Path": "CompanyCode"
				},
				"Criticality": {
					"Path": "Path_to_Criticality"
				},
				"CriticalityRepresentation": {
					"EnumMember": "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithIcon"
				},
				"Label": {
					"String": "Kunnr"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.String"
			}, {
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
				},
				"Value": {
					"Path": "ClearingDate"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.Date"
			}, {
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
				},
				"Value": {
					"Path": "AssignmentReference"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.String"
			}, {
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
				},
				"Value": {
					"Path": "AccountingDocument"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.String"
			}, {
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Low"
				},
				"Value": {
					"Path": "AmountInCompanyCodeCurrency"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.Decimal"
			}, {
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Low"
				},
				"Value": {
					"Path": "CompanyCodeCurrency"
				},
				"Criticality": {
					"Path": "Path_to_Criticality2"
				},
				"CriticalityRepresentation": {
					"Path": "Path_to_Criticality2Representation"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.String"
			}, {
				"Value": {
					"Path": "ClearingAccountingDocument"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.String"
			}
		];

		oEntity = {
			"name": "Item",
			"key": {
				"propertyRef": [
					{
						"name": "GeneratedID"
					}
				]
			},
			"property": [],
			"sap:service-schema-version": "1",
			"sap:service-version": "1",
			"sap:semantics": "aggregate",
			"sap:content-version": "1",
			"com.sap.vocabularies.UI.v1.LineItem": aLineItemAnnotation,
			"com.sap.vocabularies.UI.v1.LineItem#foo": [],
			"$path": "/dataServices/schema/0/entityType/1"
		};

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns(oEntity);

		oAnnotation = this.oMetadataAnalyser.getLineItemAnnotation("com.sap.foo.Item");

		assert.ok(oAnnotation.fields);
		assert.ok(oAnnotation.labels);
		assert.ok(oAnnotation.importance);
		assert.ok(oAnnotation.criticality);
		assert.strictEqual(oAnnotation.fields.length, 8);
		assert.strictEqual(oAnnotation.annotation, aLineItemAnnotation);
		assert.deepEqual(oAnnotation.fields, [
			"Customer", "CompanyCode", "ClearingDate", "AssignmentReference", "AccountingDocument", "AmountInCompanyCodeCurrency", "CompanyCodeCurrency", "ClearingAccountingDocument"
		]);
		assert.strictEqual(oAnnotation.labels["CompanyCode"], "Kunnr");
		oCriticality = oAnnotation.criticality["CompanyCode"];
		assert.strictEqual(oCriticality.path, "Path_to_Criticality", "Criticality Path set correctly for CompanyCode");
		assert.strictEqual(oCriticality.criticalityRepresentationType, "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithIcon", "CriticalityRespresentationType Enum set correctly for CompanyCode");
		assert.strictEqual(oAnnotation.criticality["Customer"], undefined, "Criticality Path not set for Customer");
		assert.equal(oAnnotation.importance["Customer"], "High", "importance high has to be set on Customer");
		assert.equal(oAnnotation.importance["AssignmentReference"], "Medium", "importance medium has to be set on AssignmentReference");
		assert.equal(oAnnotation.importance["AmountInCompanyCodeCurrency"], "Low", "importance low has to be set on AmountInCompanyCodeCurrency");
		assert.equal(oAnnotation.importance["CompanyCode"], "High", "importance high has to be set on CompanyCode, as default");
		assert.ok(oAnnotation.criticality["CompanyCodeCurrency"], "Criticality set for CompanyCodeCurrency");
		oCriticality = oAnnotation.criticality["CompanyCodeCurrency"];
		assert.strictEqual(oCriticality.path, "Path_to_Criticality2", "Criticality Path set correctly for CompanyCodeCurrency");
		assert.strictEqual(oCriticality.criticalityRepresentationPath, "Path_to_Criticality2Representation", "CriticalityRespresentationPath set correctly for CompanyCodeCurrency");

		oAnnotation = this.oMetadataAnalyser.getLineItemAnnotation("com.sap.GL.ZAF.GL_ACCOUNT_BALANCE", "foo");
		assert.ok(oAnnotation);
		assert.deepEqual(oAnnotation.annotation, []);

		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns(null);
		oAnnotation = this.oMetadataAnalyser.getLineItemAnnotation("com.sap.GL.ZAF.GL_ACCOUNT_BALANCE");
		assert.ok(!oAnnotation);
	});

	QUnit.test("getLineItemAnnotation shall return the matching LineItem annotation with fields and labels and URLs", function(assert) {
		var aLineItemAnnotation, oEntity, oAnnotation, oURLInfo;

		aLineItemAnnotation = [
			{
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
				},
				"Value": {
					"Path": "Customer"
				},
				"Url": {
					"Path": "CustomerURL"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataFieldWithUrl",
				"EdmType": "Edm.String"
			}, {
				"Value": {
					"Path": "CompanyCode"
				},
				"Url": {
					"Apply": {
						"Name": "odata.fillUriTemplate",
						"Parameters": [
							{
								"Type": "String",
								"Value": "https://www.google.com/#q={company}+{product}"
							}, {
								"Type": "LabeledElement",
								"Value": {
									"Path": "Path_to_CompanyName"
								},
								"Name": "company"
							}, {
								"Type": "LabeledElement",
								"Value": {
									"Path": "Product"
								},
								"Name": "product"
							}
						]
					}
				},
				"Label": {
					"String": "Kunnr"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataFieldWithUrl",
				"EdmType": "Edm.String"
			}, {
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
				},
				"Value": {
					"Path": "ClearingDate"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.Date"
			}, {
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
				},
				"Value": {
					"Path": "AssignmentReference"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.String"
			}, {
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
				},
				"Value": {
					"Path": "AccountingDocument"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.String"
			}, {
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Low"
				},
				"Value": {
					"Path": "AmountInCompanyCodeCurrency"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.Decimal"
			}, {
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Low"
				},
				"Value": {
					"Path": "CompanyCodeCurrency"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.String"
			}, {
				"Value": {
					"Path": "ClearingAccountingDocument"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.String"
			}
		];

		oEntity = {
			"name": "Item",
			"key": {
				"propertyRef": [
					{
						"name": "GeneratedID"
					}
				]
			},
			"property": [],
			"sap:service-schema-version": "1",
			"sap:service-version": "1",
			"sap:semantics": "aggregate",
			"sap:content-version": "1",
			"com.sap.vocabularies.UI.v1.LineItem": aLineItemAnnotation,
			"$path": "/dataServices/schema/0/entityType/1"
		};

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns(oEntity);

		oAnnotation = this.oMetadataAnalyser.getLineItemAnnotation("com.sap.foo.Item");

		assert.ok(oAnnotation.fields);
		assert.ok(oAnnotation.labels);
		assert.ok(oAnnotation.importance);
		assert.ok(oAnnotation.urlInfo);
		assert.strictEqual(oAnnotation.fields.length, 8);
		assert.strictEqual(oAnnotation.annotation, aLineItemAnnotation);
		assert.deepEqual(oAnnotation.fields, [
			"Customer", "CompanyCode", "ClearingDate", "AssignmentReference", "AccountingDocument", "AmountInCompanyCodeCurrency", "CompanyCodeCurrency", "ClearingAccountingDocument"
		]);
		assert.strictEqual(oAnnotation.labels["CompanyCode"], "Kunnr");
		oURLInfo = oAnnotation.urlInfo["CompanyCode"];
		assert.ok(oURLInfo, "url info set correctly for CompanyCode");
		assert.deepEqual(oURLInfo.parameters, [
			"Product", "Path_to_CompanyName"
		], "Parameters set correctly for CompanyCode");
		oURLInfo = oAnnotation.urlInfo["Customer"];
		assert.ok(oURLInfo, "url info set correctly for Customer");
		assert.ok(!oURLInfo.parameters, "no parameters present for Customer");
		assert.ok(!oURLInfo.urlTarget, "no binding present for Customer");
		assert.strictEqual(oURLInfo.urlPath, "CustomerURL", "Url Path set for Customer");
		assert.strictEqual(oAnnotation.urlInfo["AssignmentReference"], undefined, "UrlInfo not set for AssignmentReference");
		assert.equal(oAnnotation.importance["Customer"], "High", "importance high has to be set on Customer");
		assert.equal(oAnnotation.importance["AssignmentReference"], "Medium", "importance medium has to be set on AssignmentReference");
		assert.equal(oAnnotation.importance["AmountInCompanyCodeCurrency"], "Low", "importance low has to be set on AmountInCompanyCodeCurrency");
		assert.equal(oAnnotation.importance["CompanyCode"], "High", "importance high has to be set on CompanyCode, as default");

		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns(null);
		oAnnotation = this.oMetadataAnalyser.getLineItemAnnotation("com.sap.GL.ZAF.GL_ACCOUNT_BALANCE");
		assert.ok(!oAnnotation);
	});

	QUnit.test("getPresentationVariantAnnotation shall return the matching PresentationVariant annotation with Visualizations and RequestAtLeastFields", function(assert) {
		var oPresentationVariant, aLineItemAnnotation, oEntity, oAnnotation;
		oPresentationVariant = {
			"Visualizations": [
				{
					"AnnotationPath": "@com.sap.vocabularies.UI.v1.LineItem"
				}
			],
			"RequestAtLeast": [
				{
					"PropertyPath": "Customer"
				}, {
					"PropertyPath": "CompanyCode"
				}
			],
			"SortOrder": [
				{
					"Property": {
						"PropertyPath": "CompanyCode"
					},
					"Descending": {
						"Bool": "true"
					}
				}, {
					"Property": {
						"PropertyPath": "Customer"
					}
				}
			],
			"GroupBy": [
				{
					"PropertyPath": "Customer"
				}, {
					"PropertyPath": "CompanyCode"
				}
			]
		};
		aLineItemAnnotation = [
			{
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
				},
				"Value": {
					"Path": "Customer"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.String"
			}, {
				"Value": {
					"Path": "CompanyCode"
				},
				"Label": {
					"String": "Kunnr"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.String"
			}, {
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
				},
				"Value": {
					"Path": "ClearingDate"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.Date"
			}, {
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
				},
				"Value": {
					"Path": "AssignmentReference"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.String"
			}, {
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
				},
				"Value": {
					"Path": "AccountingDocument"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.String"
			}, {
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Low"
				},
				"Value": {
					"Path": "AmountInCompanyCodeCurrency"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.Decimal"
			}, {
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Low"
				},
				"Value": {
					"Path": "CompanyCodeCurrency"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.String"
			}, {
				"Value": {
					"Path": "ClearingAccountingDocument"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.String"
			}
		];

		oEntity = {
			"name": "Item",
			"key": {
				"propertyRef": [
					{
						"name": "GeneratedID"
					}
				]
			},
			"property": [],
			"sap:service-schema-version": "1",
			"sap:service-version": "1",
			"sap:semantics": "aggregate",
			"sap:content-version": "1",
			"com.sap.vocabularies.UI.v1.PresentationVariant": oPresentationVariant,
			"com.sap.vocabularies.UI.v1.LineItem": aLineItemAnnotation,
			"com.sap.vocabularies.UI.v1.LineItem#someQualifier": [],
			"com.sap.vocabularies.UI.v1.PresentationVariant#someQualifier": {
				"Visualizations": [
					{
						"AnnotationPath": "@com.sap.vocabularies.UI.v1.LineItem#someQualifier"
					}
				]
			},
			"$path": "/dataServices/schema/0/entityType/1"
		};

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns(oEntity);

		var oPresentationAnnotation = this.oMetadataAnalyser.getPresentationVariantAnnotation("com.sap.foo.Item");
		assert.strictEqual(oPresentationAnnotation.lineItemAnnotation.annotation, aLineItemAnnotation);
		assert.strictEqual(oPresentationAnnotation.annotation, oPresentationVariant);
		assert.deepEqual(oPresentationAnnotation.requestAtLeastFields, [
			"Customer", "CompanyCode"
		], "requestAtLeastfields match");
		assert.deepEqual(oPresentationAnnotation.sortOrderFields, [
			{
				"name": "CompanyCode",
				"descending": true
			}, {
				"name": "Customer",
				"descending": false
			}
		], "sortOrderfields match");
		assert.deepEqual(oPresentationAnnotation.groupByFields, [
			"Customer", "CompanyCode"
		], "groupByFields match");
		// Check LineItem annotation resolution
		oAnnotation = oPresentationAnnotation.lineItemAnnotation;
		assert.ok(oAnnotation.fields);
		assert.ok(oAnnotation.labels);
		assert.ok(oAnnotation.importance);
		assert.strictEqual(oAnnotation.fields.length, 8);
		assert.deepEqual(oAnnotation.fields, [
			"Customer", "CompanyCode", "ClearingDate", "AssignmentReference", "AccountingDocument", "AmountInCompanyCodeCurrency", "CompanyCodeCurrency", "ClearingAccountingDocument"
		]);
		assert.strictEqual(oAnnotation.labels["CompanyCode"], "Kunnr");
		assert.equal(oAnnotation.importance["Customer"], "High", "importance high has to be set on Customer");
		assert.equal(oAnnotation.importance["AssignmentReference"], "Medium", "importance medium has to be set on AssignmentReference");
		assert.equal(oAnnotation.importance["AmountInCompanyCodeCurrency"], "Low", "importance low has to be set on AmountInCompanyCodeCurrency");
		assert.equal(oAnnotation.importance["CompanyCode"], "High", "importance high has to be set on CompanyCode, as default");

		oPresentationAnnotation = this.oMetadataAnalyser.getPresentationVariantAnnotation("com.sap.foo.Item", "someQualifier");
		assert.ok(oPresentationAnnotation);
		assert.deepEqual(oPresentationAnnotation.lineItemAnnotation.annotation, []);

		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns({});
		oAnnotation = this.oMetadataAnalyser.getPresentationVariantAnnotation("com.sap.GL.ZAF.GL_ACCOUNT_BALANCE");
		assert.ok(!oAnnotation);
	});

	QUnit.test("getSemanticObjectAnnotation shall return the SemanticObject annotation", function(assert) {
		var oProperty, oProperty2, oAnnotation;

		oProperty = {
			"name": "FixedAsset",
			"type": "Edm.String",
			"maxLength": "4",
			"sap:aggregation-role": "dimension",
			"sap:display-format": "UpperCase",
			"sap:label": "Subnumber",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Subnumber"
			},
			"sap:heading": "SNo.",
			"sap:quickinfo": "Asset Subnumber",
			"sap:creatable": "false",
			"com.sap.vocabularies.Common.v1.SemanticObject": {
				"String": "FixedAsset"
			}
		};

		oProperty2 = {
			"name": "Order",
			"type": "Edm.String",
			"maxLength": "12",
			"sap:aggregation-role": "dimension",
			"sap:display-format": "UpperCase",
			"sap:label": "Order",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Order"
			},
			"sap:quickinfo": "Order Number",
			"sap:creatable": "false",
			"com.sap.vocabularies.Common.v1.SemanticObject": {
				"String": "InternalOrder"
			}
		};

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataProperty.returns(oProperty);

		oAnnotation = this.oMetadataAnalyser.getSemanticObjectAnnotation("com.sap.foo.Item/FixedAsset");
		assert.strictEqual(oAnnotation.semanticObject, "FixedAsset");

		this.oMetadataAnalyser._oMetaModel.getODataProperty.returns(oProperty2);

		oAnnotation = this.oMetadataAnalyser.getSemanticObjectAnnotation("com.sap.foo.Item/Order");
		assert.strictEqual(oAnnotation.semanticObject, "InternalOrder");

		this.oMetadataAnalyser._oMetaModel.getODataProperty.returns(null);

		oAnnotation = this.oMetadataAnalyser.getSemanticObjectAnnotation("foo");
		assert.strictEqual(oAnnotation, undefined);
	});

	QUnit.test("getSemanticObjectsFromAnnotation", function(assert) {
		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataProperty.returns({
			"name": "FixedAsset",
			"type": "Edm.String",
			"com.sap.vocabularies.Common.v1.SemanticObject": {
				"String": "FixedAsset"
			}
		});

		var oSemanticObjects = this.oMetadataAnalyser.getSemanticObjectsFromAnnotation("com.sap.foo.Item/FixedAsset");
		assert.deepEqual(oSemanticObjects, {
			defaultSemanticObject: "FixedAsset",
			additionalSemanticObjects: []
		});

		this.oMetadataAnalyser._oMetaModel.getODataProperty.returns({
			"name": "Order",
			"type": "Edm.String",
			"com.sap.vocabularies.Common.v1.SemanticObject": {
				"String": "InternalOrder"
			}
		});

		oSemanticObjects = this.oMetadataAnalyser.getSemanticObjectsFromAnnotation("com.sap.foo.Item/Order");
		assert.deepEqual(oSemanticObjects, {
			defaultSemanticObject: "InternalOrder",
			additionalSemanticObjects: []
		});

		this.oMetadataAnalyser._oMetaModel.getODataProperty.returns(null);

		oSemanticObjects = this.oMetadataAnalyser.getSemanticObjectsFromAnnotation("foo");
		assert.strictEqual(oSemanticObjects, undefined);
	});

	QUnit.test("getSemanticObjectsFromProperty", function(assert) {

		assert.deepEqual(MetadataAnalyser.getSemanticObjectsFromProperty({
			"name": "FixedAsset",
			"type": "Edm.String",
			"com.sap.vocabularies.Common.v1.SemanticObject": {
				"String": "SemanticObject"
			},
			"com.sap.vocabularies.Common.v1.SemanticObject#additional": {
				"String": "AdditionalSemanticObject"
			}
		}), {
			defaultSemanticObject: "SemanticObject",
			additionalSemanticObjects: [
				"AdditionalSemanticObject"
			]
		});

		assert.deepEqual(MetadataAnalyser.getSemanticObjectsFromProperty({
			"name": "FixedAsset",
			"type": "Edm.String",
			"com.sap.vocabularies.Common.v1.SemanticObject": {
				"String": "SemanticObject"
			}
		}), {
			defaultSemanticObject: "SemanticObject",
			additionalSemanticObjects: []
		});

		assert.deepEqual(MetadataAnalyser.getSemanticObjectsFromProperty({
			"com.sap.vocabularies.Common.v1.SemanticObject#": {
				"String": "SemanticObject"
			}
		}), {
			defaultSemanticObject: undefined,
			additionalSemanticObjects: [
				"SemanticObject"
			]
		});

		assert.deepEqual(MetadataAnalyser.getSemanticObjectsFromProperty({
			"name": "FixedAsset",
			"type": "Edm.String"
		}), undefined);

	});

	QUnit.test("getFieldGroupAnnotation shall return the matching FieldGroup annotation array", function(assert) {
		var oEntity, aFieldGroupAnnotation, oAnnotation;

		oEntity = {
			"name": "Item",
			"key": {
				"propertyRef": [
					{
						"name": "GeneratedID"
					}
				]
			},
			"property": [],
			"extensions": [],
			"sap:service-schema-version": "1",
			"sap:service-version": "1",
			"sap:semantics": "aggregate",
			"sap:content-version": "1",
			"com.sap.vocabularies.UI.v1.FieldGroup#fin.ar.lineitems.display.CustomerGroup": {
				"Label": {
					"String": "Customer"
				},
				"Data": [
					{
						"Value": {
							"Path": "CustomerCountry"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "Industry"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "Region"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "BusinessArea"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "CityName"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "CustomerName"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "AccountCreatedByUser"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "AccountCreationDate"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Date"
					}, {
						"Value": {
							"Path": "AccountMemo"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "BranchAccount"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "BusinessPlace"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "CorporateGroup"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "CustomerAccountName"
						},
						"Label": {
							"String": "Customer Account"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "CustomerIsBlockedForPosting"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "CustomerPaymentBlockingReason"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "HeadOffice"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "IsMarkedForDeletion"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Boolean"
					}, {
						"Value": {
							"Path": "IsOneTimeAccount"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "POBox"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "POBoxPostalCode"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "PostalCode"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "SortKey"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "TradingPartnerCompanyID"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}
				],
				"RecordType": "com.sap.vocabularies.UI.v1.FieldGroupType"
			},
			"com.sap.vocabularies.UI.v1.FieldGroup#fin.ar.lineitems.display.AccountingDocumentGroup": {
				"Label": {
					"String": "Accounting Document"
				},
				"Data": [
					{
						"Value": {
							"Path": "AccountingDocumentCreationDate"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Date"
					}, {
						"Value": {
							"Path": "DocumentReferenceID"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "DocumentDate"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Date"
					}, {
						"Value": {
							"Path": "TransactionCurrency"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "BalancedAmountInCompanyCodeCurrency"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "FiscalYear"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "FiscalPeriod"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "PostingKey"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "DebitCreditCode"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "NetDueDate"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Date"
					}, {
						"Value": {
							"Path": "AmountInCompanyCodeCurrency"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "GeneralLedgerAccount"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "AccountingDocumentType"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "AccountingDocument"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "IsSalesRelated"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "SpecialGeneralLedgerCode"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "CompanyName"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "AccountingClerk"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "ReconciliationAccount"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "AccountingDocumentCategory"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "AccountingDocumentItem"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "AccountingDocumentTextCategory"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "AdditionalCurrency1"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "AdditionalCurrency2"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "AmountInAdditionalCurrency1"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "AmountInAdditionalCurrency2"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "AmountInBalanceTransactionCurrency"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "AmountInTransactionCurrency"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "BalanceTransactionCurrency"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "BilledRevenueAmountInCompanyCodeCurrency"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "CashFlowType"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "CompanyCodeCurrency"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "CostCenter"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "DocumentArchivedIndiator"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "DocumentItemText"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "EffectiveExchangeRate"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "FinancialAccountType"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "FundsManagementCenter"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "HasText"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "IsDueNet"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "IsNegativePosting"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "NetDueArrearsDays"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "PlannedAmountInTransactionCurrency"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "ProfitCenter"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "Reference1IDByBusinessPartner"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "Reference2IDByBusinessPartner"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "Reference3IDByBusinessPartner"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "SpecialGeneralLedgerTransactionType"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "ValuatedAmntInAdditionalCrcy1"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "ValuatedAmntInAdditionalCrcy2"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "ValuatedAmountInCompanyCodeCurrency"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "ValueDate"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Date"
					}
				],
				"RecordType": "com.sap.vocabularies.UI.v1.FieldGroupType"
			},
			"com.sap.vocabularies.UI.v1.FieldGroup#fin.ar.lineitems.display.ClearingGroup": {
				"Label": {
					"String": "Clearing"
				},
				"Data": [
					{
						"Value": {
							"Path": "ClearingStatus"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "ClearingAccountingDocument"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "ClearingDocFiscalYear"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "HasClearingAccountingDocument"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "IsClearingReversed"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "ToleranceGroup"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}
				],
				"RecordType": "com.sap.vocabularies.UI.v1.FieldGroupType"
			},
			"com.sap.vocabularies.UI.v1.FieldGroup#fin.ar.lineitems.display.DiscountGroup": {
				"Label": {
					"String": "Discount"
				},
				"Data": [
					{
						"Value": {
							"Path": "CashDateDueNetSymbol"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "CashDiscount1ArrearsDays"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "CashDiscount1Days"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "CashDiscount1Percent"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "CashDiscount2Days"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "CashDiscount2Percent"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "CashDiscountAmount"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "CashDiscountAmountInTransactionCurrency"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "CashDiscountAmtInCompanyCodeCrcy"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "CashDiscountBaseAmount"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "DueCalculationBaseDate"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Date"
					}, {
						"Value": {
							"Path": "DueNetSymbol"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "FixedCashDiscount"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "IsCashDiscount1Due"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "NetPaymentDays"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "CashDisount1DueDate"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Date"
					}
				],
				"RecordType": "com.sap.vocabularies.UI.v1.FieldGroupType"
			},
			"com.sap.vocabularies.UI.v1.FieldGroup#fin.ar.lineitems.display.DunningGroup": {
				"Label": {
					"String": "Dunning"
				},
				"Data": [
					{
						"Value": {
							"Path": "DunningArea"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "DunningBlockingReasonCode"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "DunningLevel"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "LastDunningDate"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Date"
					}, {
						"Value": {
							"Path": "MaximumDunningLevel"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}
				],
				"RecordType": "com.sap.vocabularies.UI.v1.FieldGroupType"
			},
			"com.sap.vocabularies.UI.v1.FieldGroup#fin.ar.lineitems.display.PaymentGroup": {
				"Label": {
					"String": "Payment"
				},
				"Data": [
					{
						"Value": {
							"Path": "AlternativePayeeAccount"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "AlternativePayerIsAllowed"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "AmountInPaymentCurrency"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "BillOfExchangeUsage"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "CreditControlArea"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "DataExchangeInstruction1"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "DataExchangeInstruction2"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "DataExchangeInstruction3"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "DataExchangeInstruction4"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "HasPaymentOrder"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "HedgedAmount"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "HouseBank"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "InterestCalculationCode"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "InterestCalculationDate"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Date"
					}, {
						"Value": {
							"Path": "InterestToBePosted"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "IntrstCalcFrequencyInMonths"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "IsAccountsReceivablePledged"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "IsDisputed"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "IsPaytAdviceSentByEDI"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "IsSinglePayment"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "IsUsedInPaymentTransaction"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "PaymentBlockingReason"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "PaymentCardItem"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "PaymentCardsSettlementRun"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "PaymentCurrency"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "PaymentDifferenceReason"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "PaymentMethod"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "PaymentMethodSupplement"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "PaymentReference"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "PaymentTerms"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "SettlementReferenceDate"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Date"
					}
				],
				"RecordType": "com.sap.vocabularies.UI.v1.FieldGroupType"
			},
			"com.sap.vocabularies.UI.v1.FieldGroup#fin.ar.lineitems.display.RefObjectsGroup": {
				"Label": {
					"String": "Referenced Objects"
				},
				"Data": [
					{
						"Value": {
							"Path": "AssignmentReference"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "AssetContract"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "BillingDocument"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "DeliveryScheduleLine"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "FixedAsset"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "FollowOnDocumentType"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "InvoiceList"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "InvoiceReference"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "MasterFixedAsset"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "Order"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "Plant"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "PurchasingDocument"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "PurchasingDocumentItem"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "RealEstateObject"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "SalesDocument"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "SalesDocumentItem"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "TreasuryContractType"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "WorkBreakdownStructureElement"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}
				],
				"RecordType": "com.sap.vocabularies.UI.v1.FieldGroupType"
			},
			"com.sap.vocabularies.UI.v1.FieldGroup#fin.ar.lineitems.display.TaxGroup": {
				"Label": {
					"String": "Tax"
				},
				"Data": [
					{
						"Value": {
							"Path": "VATRegistration"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "TargetTaxCode"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "TaxCode"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "TaxID1"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "TaxID2"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "TaxJurisdiction"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "TaxSection"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "WithholdingTaxAmount"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "WithholdingTaxBaseAmount"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}, {
						"Value": {
							"Path": "WithholdingTaxExemptionAmount"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.Decimal"
					}
				],
				"RecordType": "com.sap.vocabularies.UI.v1.FieldGroupType"
			},
			"com.sap.vocabularies.UI.v1.SelectionFields": [
				{
					"PropertyPath": "Customer"
				}, {
					"PropertyPath": "CompanyCode"
				}, {
					"PropertyPath": "KeyDate"
				}
			],
			"com.sap.vocabularies.UI.v1.LineItem#foo": [],
			"$path": "/dataServices/schema/0/entityType/1"
		};

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns(oEntity);

		aFieldGroupAnnotation = this.oMetadataAnalyser.getFieldGroupAnnotation("com.sap.foo.Item");

		assert.ok(aFieldGroupAnnotation);
		assert.strictEqual(aFieldGroupAnnotation.length, 8);

		oAnnotation = aFieldGroupAnnotation[0]; // get the 1st annotation

		assert.strictEqual(oAnnotation.groupName, "fin.ar.lineitems.display.CustomerGroup");
		assert.strictEqual(oAnnotation.groupLabel, "Customer");

		assert.deepEqual(oAnnotation.fields, [
			"CustomerCountry", "Industry", "Region", "BusinessArea", "CityName", "CustomerName", "AccountCreatedByUser", "AccountCreationDate", "AccountMemo", "BranchAccount", "BusinessPlace", "CorporateGroup", "CustomerAccountName", "CustomerIsBlockedForPosting", "CustomerPaymentBlockingReason", "HeadOffice", "IsMarkedForDeletion", "IsOneTimeAccount", "POBox", "POBoxPostalCode", "PostalCode", "SortKey", "TradingPartnerCompanyID"
		]);
		assert.strictEqual(oAnnotation.labels["CustomerAccountName"], "Customer Account");
		assert.equal(oAnnotation.importance["CustomerCountry"], "High", "importance high has to be set on CustomerCountry, as default");
		assert.equal(oAnnotation.importance["TradingPartnerCompanyID"], "High", "importance high has to be set on CompanyCode, as default");

		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns(null);
		aFieldGroupAnnotation = this.oMetadataAnalyser.getFieldGroupAnnotation("com.sap.foo.Bar");
		assert.ok(aFieldGroupAnnotation);
		assert.strictEqual(aFieldGroupAnnotation.length, 0);
	});

	QUnit.test("Destroy", function(assert) {
		assert.strictEqual(this.oMetadataAnalyser.bIsDestroyed, undefined);

		// Call CUT
		this.oMetadataAnalyser.destroy();

		assert.strictEqual(this.oMetadataAnalyser.oModel, null);
		assert.strictEqual(this.oMetadataAnalyser._oMetaModel, null);
		assert.strictEqual(this.oMetadataAnalyser._oMetadata, null);
		assert.strictEqual(this.oMetadataAnalyser._oSchemaDefinition, null);
		assert.strictEqual(this.oMetadataAnalyser.bIsDestroyed, true);
	});

	oTestEntitySet = {
		"name": "Items",
		"entityType": "com.sap.foo.Item",
		"Org.OData.Capabilities.V1.FilterRestrictions": {
			"NonFilterableProperties": [
				{
					"PropertyPath": "AuthorizationGroup"
				}, {
					"PropertyPath": "BooleanParameter"
				}
			],
			"RequiredProperties": [
				{
					"PropertyPath": "AssignmentReference"
				}, {
					"PropertyPath": "HasText"
				}
			]
		},
		"Org.OData.Capabilities.V1.SortRestrictions": {
			"NonSortableProperties": [
				{
					"PropertyPath": "AuthorizationGroup"
				}, {
					"PropertyPath": "HasText"
				}
			]
		},
		"com.sap.vocabularies.Common.v1.FilterExpressionRestrictions": [
			{
				"AllowedExpressions": {
					"EnumMember": "com.sap.vocabularies.Common.v1.FilterExpressionType/SingleInterval"
				},
				"Property": {
					"PropertyPath": "KeyDate"
				}
			}, {
				"AllowedExpressions": {
					"EnumMember": "com.sap.vocabularies.Common.v1.FilterExpressionType/SingleValue"
				},
				"Property": {
					"PropertyPath": "HasText"
				}
			}
		],

		"foo": "bar"
	};

	oTestEntity = {
		"name": "Item",
		"key": {
			"propertyRef": [
				{
					"name": "GeneratedID"
				}
			]
		},
		"property": [
			{
				"name": "CashDiscountAmountInTransactionCurrency",
				"type": "Edm.Decimal",
				"precision": "24",
				"scale": "3",
				"sap:aggregation-role": "measure",
				"sap:display-format": "UpperCase",
				"sap:unit": "TransactionCurrency",
				"sap:label": "Discount (Doc. Crcy)",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Discount (Doc. Crcy)"
				},
				"sap:quickinfo": "Current Cash Discount Amount in Document Currency",
				"sap:creatable": "false",
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "TransactionCurrency"
				}
			}, {
				"name": "ValuatedAmntInAdditionalCrcy1",
				"type": "Edm.Decimal",
				"precision": "24",
				"scale": "3",
				"sap:aggregation-role": "measure",
				"sap:display-format": "UpperCase",
				"sap:unit": "AdditionalCurrency1",
				"sap:label": "LC2 Evaluated Amount",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "LC2 Evaluated Amount"
				},
				"sap:heading": "LC2 Eval.Amount",
				"sap:quickinfo": "Amount Valuated in Local Currency 2",
				"sap:creatable": "false",
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "AdditionalCurrency1"
				}
			}, {
				"name": "ValuatedAmntInAdditionalCrcy2",
				"type": "Edm.Decimal",
				"precision": "24",
				"scale": "3",
				"sap:aggregation-role": "measure",
				"sap:display-format": "UpperCase",
				"sap:unit": "AdditionalCurrency2",
				"sap:label": "LC3 Evaluated Amount",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "LC3 Evaluated Amount"
				},
				"sap:heading": "LC3 Eval.Amount",
				"sap:quickinfo": "Amount Valuated in Local Currency 3",
				"sap:creatable": "false",
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "AdditionalCurrency2"
				}
			}, {
				"name": "ValuatedAmountInCompanyCodeCurrency",
				"type": "Edm.Decimal",
				"precision": "24",
				"scale": "3",
				"sap:aggregation-role": "measure",
				"sap:display-format": "UpperCase",
				"sap:unit": "CompanyCodeCurrency",
				"sap:label": "LC Evaluated Amount",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "LC Evaluated Amount"
				},
				"sap:heading": "LC Eval. Amount",
				"sap:quickinfo": "Amount Valuated in Local Currency",
				"sap:creatable": "false",
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "CompanyCodeCurrency"
				}
			}, {
				"name": "AmountInAdditionalCurrency1",
				"type": "Edm.Decimal",
				"precision": "24",
				"scale": "3",
				"sap:aggregation-role": "measure",
				"sap:display-format": "UpperCase",
				"sap:unit": "AdditionalCurrency1",
				"sap:label": "LC2 Amount",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "LC2 Amount"
				},
				"sap:quickinfo": "Amount in Second Local Currency",
				"sap:creatable": "false",
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "AdditionalCurrency1"
				}
			}, {
				"name": "AmountInAdditionalCurrency2",
				"type": "Edm.Decimal",
				"precision": "24",
				"scale": "3",
				"sap:aggregation-role": "measure",
				"sap:display-format": "UpperCase",
				"sap:unit": "AdditionalCurrency2",
				"sap:label": "LC3 Amount",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "LC3 Amount"
				},
				"sap:quickinfo": "Amount in Third Local Currency",
				"sap:creatable": "false",
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "AdditionalCurrency2"
				}
			}, {
				"name": "BalancedAmountInCompanyCodeCurrency",
				"type": "Edm.Decimal",
				"precision": "24",
				"scale": "3",
				"sap:aggregation-role": "measure",
				"sap:display-format": "UpperCase",
				"sap:unit": "CompanyCodeCurrency",
				"sap:label": "Amnt in LC (no sign)",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Amnt in LC (no sign)"
				},
				"sap:quickinfo": "Amount in Local Currency without +/- Signs",
				"sap:creatable": "false",
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "CompanyCodeCurrency"
				}
			}, {
				"name": "AmountInCompanyCodeCurrency",
				"type": "Edm.Decimal",
				"precision": "24",
				"scale": "3",
				"sap:aggregation-role": "measure",
				"sap:display-format": "UpperCase",
				"sap:unit": "CompanyCodeCurrency",
				"sap:label": "Amount in LC",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Amount in LC"
				},
				"sap:quickinfo": "Amount in Local Currency",
				"sap:creatable": "false",
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "CompanyCodeCurrency"
				}
			}, {
				"name": "PlannedAmountInTransactionCurrency",
				"type": "Edm.Decimal",
				"precision": "24",
				"scale": "3",
				"sap:aggregation-role": "measure",
				"sap:display-format": "UpperCase",
				"sap:unit": "TransactionCurrency",
				"sap:label": "Planned Amount",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Planned Amount"
				},
				"sap:quickinfo": "Planned Amount in Document or G/L Account Currency",
				"sap:creatable": "false",
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "TransactionCurrency"
				}
			}, {
				"name": "BilledRevenueAmountInCompanyCodeCurrency",
				"type": "Edm.Decimal",
				"precision": "24",
				"scale": "3",
				"sap:aggregation-role": "measure",
				"sap:display-format": "UpperCase",
				"sap:unit": "CompanyCodeCurrency",
				"sap:label": "Billed Revenue",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Billed Revenue"
				},
				"sap:creatable": "false",
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "CompanyCodeCurrency"
				}
			}, {
				"name": "AmountInBalanceTransactionCurrency",
				"type": "Edm.Decimal",
				"precision": "24",
				"scale": "3",
				"sap:aggregation-role": "measure",
				"sap:display-format": "UpperCase",
				"sap:unit": "BalanceTransactionCurrency",
				"sap:label": "G/L Update Amount",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "G/L Update Amount"
				},
				"sap:heading": "General Ledger Update",
				"sap:quickinfo": "Amount for Updating in General Ledger",
				"sap:creatable": "false",
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "BalanceTransactionCurrency"
				}
			}, {
				"name": "AmountInPaymentCurrency",
				"type": "Edm.Decimal",
				"precision": "24",
				"scale": "3",
				"sap:aggregation-role": "measure",
				"sap:display-format": "UpperCase",
				"sap:unit": "PaymentCurrency",
				"sap:label": "Pymt Currency Amnt",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Pymt Currency Amnt"
				},
				"sap:heading": "Pymt Crcy Amnt",
				"sap:quickinfo": "Amount in Payment Currency",
				"sap:creatable": "false",
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "PaymentCurrency"
				}
			}, {
				"name": "WithholdingTaxAmount",
				"type": "Edm.Decimal",
				"precision": "24",
				"scale": "3",
				"sap:aggregation-role": "measure",
				"sap:display-format": "UpperCase",
				"sap:unit": "TransactionCurrency",
				"sap:label": "Withholding Tax",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Withholding Tax"
				},
				"sap:creatable": "false",
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "TransactionCurrency"
				}
			}, {
				"name": "WithholdingTaxExemptionAmount",
				"type": "Edm.Decimal",
				"precision": "24",
				"scale": "3",
				"sap:aggregation-role": "measure",
				"sap:display-format": "UpperCase",
				"sap:unit": "TransactionCurrency",
				"sap:label": "Withhold. Tax Exempt",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Withhold. Tax Exempt"
				},
				"sap:heading": "W.Tax-Exempt",
				"sap:quickinfo": "Withholding Tax-Exempt Amount (in Document Currency)",
				"sap:creatable": "false",
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "TransactionCurrency"
				}
			}, {
				"name": "WithholdingTaxBaseAmount",
				"type": "Edm.Decimal",
				"precision": "24",
				"scale": "3",
				"sap:aggregation-role": "measure",
				"sap:display-format": "UpperCase",
				"sap:unit": "TransactionCurrency",
				"sap:label": "Withholding Tax Base",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Withholding Tax Base"
				},
				"sap:heading": "Withhld.Tax Base",
				"sap:quickinfo": "Withholding Tax Base Amount",
				"sap:creatable": "false",
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "TransactionCurrency"
				}
			}, {
				"name": "CashDiscountBaseAmount",
				"type": "Edm.Decimal",
				"precision": "24",
				"scale": "3",
				"sap:aggregation-role": "measure",
				"sap:display-format": "UpperCase",
				"sap:unit": "TransactionCurrency",
				"sap:label": "Cash Discount Base",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Cash Discount Base"
				},
				"sap:quickinfo": "Amount Eligible for Cash Discount in Document Currency",
				"sap:creatable": "false",
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "TransactionCurrency"
				}
			}, {
				"name": "CashDiscountAmtInCompanyCodeCrcy",
				"type": "Edm.Decimal",
				"precision": "24",
				"scale": "3",
				"sap:aggregation-role": "measure",
				"sap:display-format": "UpperCase",
				"sap:unit": "CompanyCodeCurrency",
				"sap:label": "Discount (Loc. Crcy)",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Discount (Loc. Crcy)"
				},
				"sap:quickinfo": "Cash Discount Amount in Local Currency",
				"sap:creatable": "false",
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "CompanyCodeCurrency"
				}
			}, {
				"name": "AmountInTransactionCurrency",
				"type": "Edm.Decimal",
				"precision": "24",
				"scale": "3",
				"sap:aggregation-role": "measure",
				"sap:display-format": "UpperCase",
				"sap:unit": "TransactionCurrency",
				"sap:label": "Amount in FC",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Amount in FC"
				},
				"sap:heading": "FC Amount",
				"sap:quickinfo": "Amount in Foreign Currency",
				"sap:creatable": "false",
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "TransactionCurrency"
				}
			}, {
				"name": "CashDiscountAmount",
				"type": "Edm.Decimal",
				"precision": "24",
				"scale": "3",
				"sap:aggregation-role": "measure",
				"sap:display-format": "UpperCase",
				"sap:unit": "TransactionCurrency",
				"sap:label": "Discount Amount",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Discount Amount"
				},
				"sap:quickinfo": "Cash Discount Amount in Document Currency",
				"sap:creatable": "false",
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "TransactionCurrency"
				}
			}, {
				"name": "HedgedAmount",
				"type": "Edm.Decimal",
				"precision": "24",
				"scale": "3",
				"sap:aggregation-role": "measure",
				"sap:display-format": "UpperCase",
				"sap:unit": "TransactionCurrency",
				"sap:label": "Hedged Amount",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Hedged Amount"
				},
				"sap:quickinfo": "Credit Management: Hedged Amount",
				"sap:creatable": "false",
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "TransactionCurrency"
				}
			}, {
				"name": "InterestToBePosted",
				"type": "Edm.Decimal",
				"precision": "16",
				"scale": "3",
				"sap:aggregation-role": "measure",
				"sap:display-format": "UpperCase",
				"sap:unit": "CompanyCodeCurrency",
				"sap:label": "Imputed Interest",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Imputed Interest"
				},
				"sap:quickinfo": "Imputed Interest (Days in Arrears * Amount)",
				"sap:creatable": "false",
				"Org.OData.Measures.V1.ISOCurrency": {
					"Path": "CompanyCodeCurrency"
				}
			}, {
				"name": "CashDiscount1ArrearsDays",
				"type": "Edm.Decimal",
				"precision": "5",
				"scale": "0",
				"sap:aggregation-role": "dimension",
				"sap:display-format": "UpperCase",
				"sap:label": "Disc.1 Arrears",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Disc.1 Arrears"
				},
				"sap:heading": "Arrers",
				"sap:quickinfo": "Days in Arrears for Cash Discount Terms 1",
				"sap:creatable": "false"
			}, {
				"name": "NetDueArrearsDays",
				"type": "Edm.Decimal",
				"precision": "5",
				"scale": "0",
				"sap:aggregation-role": "dimension",
				"sap:display-format": "UpperCase",
				"sap:label": "Net Arrears",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Net Arrears"
				},
				"sap:heading": "Arrear",
				"sap:quickinfo": "Days in Arrears by Net Due Date",
				"sap:creatable": "false"
			}, {
				"name": "CashDiscount1Percent",
				"type": "Edm.Decimal",
				"precision": "5",
				"scale": "3",
				"sap:aggregation-role": "dimension",
				"sap:display-format": "UpperCase",
				"sap:label": "Disc. Percent 1",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Disc. Percent 1"
				},
				"sap:heading": "Disc.1",
				"sap:quickinfo": "Cash Discount Percentage 1",
				"sap:creatable": "false"
			}, {
				"name": "CashDiscount2Percent",
				"type": "Edm.Decimal",
				"precision": "5",
				"scale": "3",
				"sap:aggregation-role": "dimension",
				"sap:display-format": "UpperCase",
				"sap:label": "Disc. Percent 2",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Disc. Percent 2"
				},
				"sap:heading": "Disc.2",
				"sap:quickinfo": "Cash Discount Percentage 2",
				"sap:creatable": "false"
			}, {
				"name": "CashDiscount1Days",
				"type": "Edm.Decimal",
				"precision": "3",
				"scale": "0",
				"sap:aggregation-role": "dimension",
				"sap:display-format": "UpperCase",
				"sap:label": "Cash Discount Days 1",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Cash Discount Days 1"
				},
				"sap:heading": "CD1",
				"sap:creatable": "false"
			}, {
				"name": "CashDiscount2Days",
				"type": "Edm.Decimal",
				"precision": "3",
				"scale": "0",
				"sap:aggregation-role": "dimension",
				"sap:display-format": "UpperCase",
				"sap:label": "Cash Discount Days 2",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Cash Discount Days 2"
				},
				"sap:heading": "CD2",
				"sap:creatable": "false"
			}, {
				"name": "NetPaymentDays",
				"type": "Edm.Decimal",
				"precision": "3",
				"scale": "0",
				"sap:aggregation-role": "dimension",
				"sap:display-format": "UpperCase",
				"sap:label": "Days Net",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Days Net"
				},
				"sap:heading": "Net",
				"sap:quickinfo": "Net Payment Terms Period",
				"sap:creatable": "false"
			}, {
				"name": "ReconciliationAccount",
				"type": "Edm.String",
				"maxLength": "10",
				"sap:aggregation-role": "dimension",
				"sap:display-format": "UpperCase",
				"sap:label": "Recon. Account",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Recon. Account"
				},
				"sap:heading": "Recon.Acc.",
				"sap:quickinfo": "Reconciliation Account in General Ledger",
				"sap:creatable": "false"
			}, {
				"name": "MasterFixedAsset",
				"type": "Edm.String",
				"maxLength": "12",
				"sap:aggregation-role": "dimension",
				"sap:display-format": "UpperCase",
				"sap:label": "Main Asset No.",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Main Asset No."
				},
				"sap:heading": "Asset",
				"sap:quickinfo": "Main Asset Number",
				"sap:creatable": "false"
			}, {
				"name": "FixedAsset",
				"type": "Edm.String",
				"maxLength": "4",
				"sap:aggregation-role": "dimension",
				"sap:display-format": "UpperCase",
				"sap:label": "Subnumber",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Subnumber"
				},
				"sap:heading": "SNo.",
				"sap:quickinfo": "Asset Subnumber",
				"sap:creatable": "false"
			}, {
				"name": "Order",
				"type": "Edm.String",
				"maxLength": "12",
				"sap:aggregation-role": "dimension",
				"sap:display-format": "UpperCase",
				"sap:label": "Order",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Order"
				},
				"sap:quickinfo": "Order Number",
				"sap:creatable": "false",
				"com.sap.vocabularies.Common.v1.SemanticObject": {
					"String": "InternalOrder"
				}
			}, {
				"name": "ClearingAccountingDocument",
				"type": "Edm.String",
				"maxLength": "10",
				"sap:aggregation-role": "dimension",
				"sap:display-format": "UpperCase",
				"sap:label": "Clearing Doc. No.",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Clearing Doc. No."
				},
				"sap:heading": "Clrng Doc.",
				"sap:quickinfo": "Clearing Document Number",
				"sap:creatable": "false"
			}, {
				"name": "ClearingDate",
				"type": "Edm.DateTime",
				"precision": "0",
				"sap:aggregation-role": "dimension",
				"sap:display-format": "Date",
				"sap:label": "Clearing Date",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Clearing Date"
				},
				"sap:heading": "Clear.Date",
				"sap:creatable": "false"
			}, {
				"name": "ClearingDocFiscalYear",
				"type": "Edm.String",
				"maxLength": "4",
				"sap:aggregation-role": "dimension",
				"sap:display-format": "UpperCase",
				"sap:label": "Clrg Fiscal Yr",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Clrg Fiscal Yr"
				},
				"sap:heading": "Year",
				"sap:quickinfo": "Fiscal Year of Clearing Document",
				"sap:creatable": "false"
			}, {
				"name": "ClearingStatus",
				"type": "Edm.String",
				"maxLength": "1",
				"sap:aggregation-role": "dimension",
				"sap:display-format": "UpperCase",
				"sap:label": "Clearing Status",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Clearing Status"
				},
				"sap:heading": "Cl.St",
				"sap:quickinfo": "Clearing Status of Item",
				"sap:creatable": "false"
			}, {
				"name": "AuthorizationGroup",
				"type": "Edm.String",
				"nullable": "false",
				"maxLength": "4",
				"sap:aggregation-role": "dimension",
				"sap:display-format": "UpperCase",
				"sap:label": "Authorization",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Authorization"
				},
				"sap:heading": "AuGr",
				"sap:quickinfo": "Authorization Group",
				"sap:creatable": "false",
				"sap:sortable": "false",
				"sap:filterable": "false"
			}, {
				"name": "AccountingDocument",
				"type": "Edm.String",
				"maxLength": "10",
				"sap:aggregation-role": "dimension",
				"sap:display-format": "UpperCase",
				"sap:label": "Document Number",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Document Number"
				},
				"sap:heading": "Doc. No.",
				"sap:quickinfo": "Accounting Document Number",
				"sap:creatable": "false",
				"com.sap.vocabularies.Common.v1.SemanticObject": {
					"String": "AccountingDocument"
				}
			}, {
				"name": "AccountingDocumentType",
				"type": "Edm.String",
				"maxLength": "2",
				"sap:aggregation-role": "dimension",
				"sap:display-format": "UpperCase",
				"sap:label": "Document Type",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Document Type"
				},
				"sap:heading": "DT",
				"sap:creatable": "false"

			}, {
				"name": "DocumentDate",
				"type": "Edm.DateTime",
				"precision": "0",
				"sap:aggregation-role": "dimension",
				"sap:display-format": "Date",
				"sap:label": "Document Date",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Document Date"
				},
				"sap:heading": "Doc. Date",
				"sap:quickinfo": "Document Date in Document",
				"sap:creatable": "false"
			}, {
				"name": "BooleanParameter",
				"type": "Edm.String",
				"nullable": "false",
				"maxLength": "5",
				"sap:aggregation-role": "dimension",
				"sap:label": "for internal use only",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "for internal use only"
				},
				"sap:heading": "Yes/No",
				"sap:quickinfo": "boolean true/false",
				"sap:creatable": "false",
				"sap:sortable": "false",
				"sap:filterable": "false"
			}, {
				"name": "Industry",
				"type": "Edm.String",
				"maxLength": "4",
				"sap:aggregation-role": "dimension",
				"sap:display-format": "UpperCase",
				"sap:text": "IndustryName",
				"com.sap.vocabularies.Common.v1.Text": {
					"Path": "IndustryName"
				},
				"sap:label": "Industry",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Industry"
				},
				"sap:heading": "Indus.",
				"sap:quickinfo": "Industry Key (Customer)",
				"sap:creatable": "false"
			}, {
				"name": "IndustryName",
				"type": "Edm.String",
				"maxLength": "20",
				"sap: label": "IndustryName",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "IndustryName"
				},
				"sap: quickinfo": "NameofIndustry(Customer)",
				"sap: creatable": "false",
				"sap: sortable": "false",
				"sap: filterable": "false"
			}, {
				"name": "PostingKey",
				"type": "Edm.String",
				"maxLength": "2",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "PostingKey",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "PostingKey"
				},
				"sap: heading": "PK",
				"sap: creatable": "false"
			}, {
				"name": "AccountingDocumentCategory",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "DocumentStatus",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "DocumentStatus"
				},
				"sap: heading": "S",
				"sap: creatable": "false"
			}, {
				"name": "PostingDate",
				"type": "Edm.DateTime",
				"precision": "0",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "Date",
				"sap: label": "PostingDate",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "PostingDate"
				},
				"sap: heading": "PstngDate",
				"sap: quickinfo": "PostingDateintheDocument",
				"sap: creatable": "false"
			}, {
				"name": "CompanyCode",
				"type": "Edm.String",
				"nullable": "false",
				"maxLength": "4",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: text": "CompanyName",
				"com.sap.vocabularies.Common.v1.Text": {
					"Path": "CompanyName"
				},
				"sap: label": "CompanyCode",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "CompanyCode"
				},
				"sap: heading": "CoCd",
				"sap: creatable": "false"
			}, {
				"name": "BusinessPlace",
				"type": "Edm.String",
				"maxLength": "4",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "BusinessPlace",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "BusinessPlace"
				},
				"sap: heading": "BusP",
				"sap: creatable": "false"

			}, {
				"name": "AccountingClerk",
				"type": "Edm.String",
				"maxLength": "2",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "AcctgClerk",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "AcctgClerk"
				},
				"sap: quickinfo": "AccountingClerk",
				"sap: creatable": "false"

			}, {
				"name": "CompanyName",
				"type": "Edm.String",
				"maxLength": "25",
				"sap: label": "CompanyName",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "CompanyName"
				},
				"sap: quickinfo": "NameofCompanyCodeorCompany",
				"sap: creatable": "false"
			}, {
				"name": "AccountingDocumentItem",
				"type": "Edm.String",
				"maxLength": "3",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "LineItem",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "LineItem"
				},
				"sap: heading": "Itm",
				"sap: quickinfo": "NumberofLineItemWithinAccountingDocument",
				"sap: creatable": "false"
			}, {
				"name": "PaymentCardsSettlementRun",
				"type": "Edm.String",
				"maxLength": "10",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "Settlement",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Settlement"
				},
				"sap: quickinfo": "PaymentCards: SettlementRun",
				"sap: creatable": "false"
			}, {
				"name": "IsAccountsReceivablePledged",
				"type": "Edm.String",
				"maxLength": "2",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "ARPledging",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "ARPledging"
				},
				"sap: heading": "ARP",
				"sap: quickinfo": "AccountsReceivablePledgingIndicator",
				"sap: creatable": "false"
			}, {
				"name": "AccountingDocumentCreationDate",
				"type": "Edm.DateTime",
				"precision": "0",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "Date",
				"sap: label": "EnteredOn",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "EnteredOn"
				},
				"sap: quickinfo": "AccountingDocumentEntryDate",
				"sap: creatable": "false"
			}, {
				"name": "SettlementReferenceDate",
				"type": "Edm.DateTime",
				"precision": "0",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "Date",
				"sap: label": "ReferenceDate",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "ReferenceDate"
				},
				"sap: heading": "Ref.Date",
				"sap: quickinfo": "ReferenceDateforSettlement",
				"sap: creatable": "false"
			}, {
				"name": "TuningParameter1",
				"type": "Edm.String",
				"nullable": "false",
				"maxLength": "40",
				"sap: aggregation-role": "dimension",
				"sap: label": "forinternaluseonly",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "forinternaluseonly"
				},
				"sap: creatable": "false",
				"sap: sortable": "false",
				"sap: filterable": "false"
			}, {
				"name": "DataExchangeInstruction1",
				"type": "Edm.String",
				"maxLength": "2",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "Instruction1",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Instruction1"
				},
				"sap: heading": "I1",
				"sap: quickinfo": "InstructionKey1",
				"sap: creatable": "false",
				"sap: filterable": "false"
			}, {
				"name": "DataExchangeInstruction2",
				"type": "Edm.String",
				"maxLength": "2",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "Instruction2",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Instruction2"
				},
				"sap: heading": "I2",
				"sap: quickinfo": "InstructionKey2",
				"sap: creatable": "false",
				"sap: filterable": "false"
			}, {
				"name": "DataExchangeInstruction3",
				"type": "Edm.String",
				"maxLength": "2",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "Instruction3",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Instruction3"
				},
				"sap: heading": "I3",
				"sap: quickinfo": "InstructionKey3",
				"sap: creatable": "false",
				"sap: filterable": "false"
			}, {
				"name": "DataExchangeInstruction4",
				"type": "Edm.String",
				"maxLength": "2",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "Instruction4",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Instruction4"
				},
				"sap: heading": "I4",
				"sap: quickinfo": "InstructionKey4",
				"sap: creatable": "false",
				"sap: filterable": "false"
			}, {
				"name": "PurchasingDocument",
				"type": "Edm.String",
				"maxLength": "10",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "PurchasingDocument",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "PurchasingDocument"
				},
				"sap: heading": "Purch.Doc.",
				"sap: quickinfo": "PurchasingDocumentNumber",
				"sap: creatable": "false"
			}, {
				"name": "PurchasingDocumentItem",
				"type": "Edm.String",
				"maxLength": "5",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "PurchasingDoc.Item",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "PurchasingDoc.Item"
				},
				"sap: heading": "PDIt.",
				"sap: quickinfo": "ItemNumberofPurchasingDocument",
				"sap: creatable": "false"
			}, {
				"name": "AccountCreationDate",
				"type": "Edm.DateTime",
				"precision": "0",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "Date",
				"sap: label": "Createdon",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Createdon"
				},
				"sap: quickinfo": "DateonWhichRecordWasCreated",
				"sap: creatable": "false"
			}, {
				"name": "AccountCreatedByUser",
				"type": "Edm.String",
				"maxLength": "12",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "Createdby",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Createdby"
				},
				"sap: quickinfo": "NameofPersonwhoCreatedtheDocument",
				"sap: creatable": "false"
			}, {
				"name": "DeliveryScheduleLine",
				"type": "Edm.String",
				"maxLength": "4",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "ScheduleLine",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "ScheduleLine"
				},
				"sap: heading": "SLNo",
				"sap: quickinfo": "DeliveryScheduleLineNumber",
				"sap: creatable": "false"
			}, {
				"name": "BranchAccount",
				"type": "Edm.String",
				"maxLength": "10",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "BranchAccountNo.",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "BranchAccountNo."
				},
				"sap: heading": "BranchAccnt",
				"sap: quickinfo": "AccountNumberoftheBranch",
				"sap: creatable": "false"
			}, {
				"name": "FundsManagementCenter",
				"type": "Edm.String",
				"maxLength": "16",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "FundsCenter",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "FundsCenter"
				},
				"sap: quickinfo": "FundsManagementCenter",
				"sap: creatable": "false"
			}, {
				"name": "GeneratedID",
				"type": "Edm.String",
				"nullable": "false",
				"sap: aggregation-role": "dimension",
				"sap: creatable": "false",
				"sap: sortable": "false",
				"sap: filterable": "false"
			}, {
				"name": "FiscalYear",
				"type": "Edm.String",
				"nullable": "false",
				"maxLength": "4",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "FiscalYear",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "FiscalYear"
				},
				"sap: heading": "Year",
				"sap: creatable": "false"
			}, {
				"name": "BusinessArea",
				"type": "Edm.String",
				"maxLength": "4",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "BusinessArea",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "BusinessArea"
				},
				"sap: heading": "BusA",
				"sap: creatable": "false"
			}, {
				"name": "HouseBank",
				"type": "Edm.String",
				"maxLength": "5",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "HouseBank",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "HouseBank"
				},
				"sap: heading": "HouseBk",
				"sap: quickinfo": "HouseBankKey",
				"sap: creatable": "false"
			}, {
				"name": "GeneralLedgerAccount",
				"type": "Edm.String",
				"maxLength": "10",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "G/LAccount",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "G/LAccount"
				},
				"sap: heading": "G/L",
				"sap: quickinfo": "GeneralLedgerAccount",
				"sap: creatable": "false"
			}, {
				"name": "AdditionalCurrency1",
				"type": "Edm.String",
				"maxLength": "5",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "LocalCurrency2",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "LocalCurrency2"
				},
				"sap: heading": "LCur2",
				"sap: quickinfo": "CurrencyKeyofSecondLocalCurrency",
				"sap: creatable": "false",
				"sap: semantics": "currency-code"
			}, {
				"name": "AdditionalCurrency2",
				"type": "Edm.String",
				"maxLength": "5",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "LocalCurrency3",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "LocalCurrency3"
				},
				"sap: heading": "LCur3",
				"sap: quickinfo": "CurrencyKeyofThirdLocalCurrency",
				"sap: creatable": "false",
				"sap: semantics": "currency-code"
			}, {
				"name": "CompanyCodeCurrency",
				"type": "Edm.String",
				"maxLength": "5",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "LocalCurrency",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "LocalCurrency"
				},
				"sap: heading": "LCurr",
				"sap: creatable": "false",
				"sap: semantics": "currency-code"
			}, {
				"name": "RealEstateObject",
				"type": "Edm.String",
				"maxLength": "8",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "RealEstateKey",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "RealEstateKey"
				},
				"sap: heading": "REKey",
				"sap: quickinfo": "InternalKeyforRealEstateObject",
				"sap: creatable": "false"
			}, {
				"name": "TuningParameter2",
				"type": "Edm.String",
				"nullable": "false",
				"maxLength": "40",
				"sap: aggregation-role": "dimension",
				"sap: label": "forinternaluseonly",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "forinternaluseonly"
				},
				"sap: creatable": "false",
				"sap: sortable": "false",
				"sap: filterable": "false"
			}, {
				"name": "FiscalYearPeriod",
				"type": "Edm.String",
				"maxLength": "7",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "Year/Period",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Year/Period"
				},
				"sap: heading": "Year/Pd",
				"sap: quickinfo": "FiscalYear/PostingPeriodofPostingDate",
				"sap: creatable": "false"
			}, {
				"name": "KeyDate",
				"type": "Edm.DateTime",
				"precision": "0",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "Date",
				"sap: label": "OpenatKeyDate",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "OpenatKeyDate"
				},
				"sap: heading": "KeyDate",
				"sap: creatable": "false",
				"sap: sortable": "false"
			}, {
				"name": "PaymentReference",
				"type": "Edm.String",
				"maxLength": "30",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "PaymentReference",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "PaymentReference"
				},
				"sap: creatable": "false"
			}, {
				"name": "CreditControlArea",
				"type": "Edm.String",
				"maxLength": "4",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "CreditControlArea",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "CreditControlArea"
				},
				"sap: heading": "CCAr",
				"sap: creatable": "false"
			}, {
				"name": "AlternativePayeeAccount",
				"type": "Edm.String",
				"maxLength": "10",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "AlternativePayer",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "AlternativePayer"
				},
				"sap: heading": "Alt.Payer",
				"sap: quickinfo": "AccountNumberofanAlternativePayer",
				"sap: creatable": "false"
			}, {
				"name": "HeadOffice",
				"type": "Edm.String",
				"maxLength": "10",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "HeadOffice",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "HeadOffice"
				},
				"sap: heading": "Hd.Office",
				"sap: quickinfo": "HeadOfficeAccountNumber(inBranchAccounts)",
				"sap: creatable": "false"
			}, {
				"name": "FinancialAccountType",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "AccountType",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "AccountType"
				},
				"sap: heading": "Acc.Type",
				"sap: creatable": "false"
			}, {
				"name": "CustomerVendorAccount",
				"type": "Edm.String",
				"maxLength": "10",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "AccountNumber",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "AccountNumber"
				},
				"sap: heading": "AccountNo.",
				"sap: creatable": "false",
				"sap: filterable": "false"
			}, {
				"name": "CorporateGroup",
				"type": "Edm.String",
				"maxLength": "10",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "CorporateGroup",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "CorporateGroup"
				},
				"sap: heading": "Corp.Grp",
				"sap: quickinfo": "CorporateGroupKey",
				"sap: creatable": "false"
			}, {
				"name": "CostCenter",
				"type": "Edm.String",
				"maxLength": "10",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "CostCenter",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "CostCenter"
				},
				"sap: heading": "CostCtr",
				"sap: creatable": "false"
			}, {
				"name": "CustomerAccountName",
				"type": "Edm.String",
				"maxLength": "4",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "AccountGroup",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "AccountGroup"
				},
				"sap: heading": "Group",
				"sap: quickinfo": "CustomerAccountGroup",
				"sap: creatable": "false"
			}, {
				"name": "Customer",
				"type": "Edm.String",
				"nullable": "false",
				"maxLength": "10",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: text": "CustomerName",
				"com.sap.vocabularies.Common.v1.Text": {
					"Path": "CustomerName"
				},
				"sap: label": "Customer",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Customer"
				},
				"sap: quickinfo": "CustomerNumber",
				"sap: creatable": "false"
			}, {
				"name": "EffectiveExchangeRate",
				"type": "Edm.String",
				"maxLength": "12",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "Effect.Exch.Rate",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Effect.Exch.Rate"
				},
				"sap: heading": "Eff.Ex.Rate",
				"sap: quickinfo": "EffectiveExchangeRateintheLineItem",
				"sap: creatable": "false",
				"sap: sortable": "false",
				"sap: filterable": "false"
			}, {
				"name": "AccountMemo",
				"type": "Edm.String",
				"maxLength": "30",
				"sap: aggregation-role": "dimension",
				"sap: visible": "false",
				"sap: label": "AccountMemo",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "AccountMemo"
				},
				"sap: heading": "Memo",
				"sap: creatable": "false"
			}, {
				"name": "CustomerCountry",
				"type": "Edm.String",
				"maxLength": "3",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "Country",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Country"
				},
				"sap: heading": "Ctr",
				"sap: quickinfo": "CountryKey",
				"sap: creatable": "false"
			}, {
				"name": "IsMarkedForDeletion",
				"type": "Edm.Boolean",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "Delete",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Delete"
				},
				"sap: heading": "Del.",
				"sap: quickinfo": "Indicator: ItemMarkedforDeletion?",
				"sap: creatable": "false"
			}, {
				"name": "DunningArea",
				"type": "Edm.String",
				"maxLength": "2",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "DunningArea",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "DunningArea"
				},
				"sap: heading": "DArea",
				"sap: creatable": "false"
			}, {
				"name": "LastDunningDate",
				"type": "Edm.DateTime",
				"precision": "0",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "Date",
				"sap: label": "LastDunned",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "LastDunned"
				},
				"sap: heading": "Dunned",
				"sap: quickinfo": "DateofLastDunningNotice",
				"sap: creatable": "false"
			}, {
				"name": "DunningBlockingReasonCode",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "DunningBlock",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "DunningBlock"
				},
				"sap: heading": "DBlock",
				"sap: creatable": "false"
			}, {
				"name": "DunningLevel",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "DunningLevel",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "DunningLevel"
				},
				"sap: heading": "DLevel",
				"sap: creatable": "false"
			}, {
				"name": "FiscalPeriod",
				"type": "Edm.String",
				"maxLength": "2",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "Period",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Period"
				},
				"sap: heading": "Pd",
				"sap: quickinfo": "FiscalPeriod",
				"sap: creatable": "false"
			}, {
				"name": "MaximumDunningLevel",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "DunningKey",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "DunningKey"
				},
				"sap: heading": "DKey",
				"sap: creatable": "false"
			}, {
				"name": "TaxCode",
				"type": "Edm.String",
				"maxLength": "2",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "Sales/PurchasesTax",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Sales/PurchasesTax"
				},
				"sap: heading": "Tx",
				"sap: quickinfo": "TaxonSales/PurchasesCode",
				"sap: creatable": "false"
			}, {
				"name": "CustomerName",
				"type": "Edm.String",
				"maxLength": "35",
				"sap: label": "CustomerName",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "CustomerName"
				},
				"sap: creatable": "false"
			}, {
				"name": "NetDueDate",
				"type": "Edm.DateTime",
				"precision": "0",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "Date",
				"sap: label": "Dueon",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Dueon"
				},
				"sap: quickinfo": "DueDateforNetPayment",
				"sap: creatable": "false"
			}, {
				"name": "CityName",
				"type": "Edm.String",
				"maxLength": "25",
				"sap: aggregation-role": "dimension",
				"sap: label": "City",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "City"
				},
				"sap: creatable": "false",
				"sap: semantics": "city"
			}, {
				"name": "POBox",
				"type": "Edm.String",
				"maxLength": "10",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "POBox",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "POBox"
				},
				"sap: creatable": "false"
			}, {
				"name": "SalesDocumentItem",
				"type": "Edm.String",
				"maxLength": "6",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "ItemNo.",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "ItemNo."
				},
				"sap: heading": "No",
				"sap: quickinfo": "ItemNumber(6Digits)",
				"sap: creatable": "false"
			}, {
				"name": "ProfitCenter",
				"type": "Edm.String",
				"maxLength": "10",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "ProfitCenter",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "ProfitCenter"
				},
				"sap: heading": "ProfitCtr",
				"sap: creatable": "false"
			}, {
				"name": "WorkBreakdownStructureElement",
				"type": "Edm.String",
				"maxLength": "24",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "WBSElement",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "WBSElement"
				},
				"sap: creatable": "false"
			}, {
				"name": "POBoxPostalCode",
				"type": "Edm.String",
				"maxLength": "10",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "POBoxPostalCode",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "POBoxPostalCode"
				},
				"sap: heading": "POBoxPCd",
				"sap: creatable": "false"
			}, {
				"name": "PostalCode",
				"type": "Edm.String",
				"maxLength": "10",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "PostalCode",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "PostalCode"
				},
				"sap: creatable": "false"
			}, {
				"name": "BalanceTransactionCurrency",
				"type": "Edm.String",
				"maxLength": "5",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "G/LCurrency",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "G/LCurrency"
				},
				"sap: heading": "Curr.",
				"sap: quickinfo": "UpdateCurrencyforGeneralLedgerTransactionFigures",
				"sap: creatable": "false",
				"sap: semantics": "currency-code"
			}, {
				"name": "PaymentCurrency",
				"type": "Edm.String",
				"maxLength": "5",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "Autom.PymtCurrency",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Autom.PymtCurrency"
				},
				"sap: heading": "PCurr",
				"sap: quickinfo": "CurrencyforAutomaticPayment",
				"sap: creatable": "false",
				"sap: semantics": "currency-code"
			}, {
				"name": "InvoiceReference",
				"type": "Edm.String",
				"maxLength": "10",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "InvoiceReference",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "InvoiceReference"
				},
				"sap: heading": "Inv.Ref.",
				"sap: quickinfo": "DocumentNo.oftheInvoicetoWhichtheTransactionBelongs",
				"sap: creatable": "false"
			}, {
				"name": "FollowOnDocumentType",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "Follow-OnDoc.Type",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Follow-OnDoc.Type"
				},
				"sap: heading": "Foll.",
				"sap: quickinfo": "Follow-OnDocumentType",
				"sap: creatable": "false"
			}, {
				"name": "Region",
				"type": "Edm.String",
				"maxLength": "3",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: text": "RegionName",
				"com.sap.vocabularies.Common.v1.Text": {
					"Path": "RegionName"
				},
				"sap: label": "Region",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Region"
				},
				"sap: heading": "Rg",
				"sap: quickinfo": "Region(Customer)",
				"sap: creatable": "false"
			}, {
				"name": "RegionName",
				"type": "Edm.String",
				"maxLength": "25",
				"sap: label": "RegionName",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "RegionName"
				},
				"sap: heading": "Region",
				"sap: quickinfo": "Region(Customer)",
				"sap: creatable": "false",
				"sap: sortable": "false",
				"sap: filterable": "false"
			}, {
				"name": "PaymentCardItem",
				"type": "Edm.String",
				"maxLength": "3",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "PaymentCardItem",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "PaymentCardItem"
				},
				"sap: heading": "PCI",
				"sap: creatable": "false"
			}, {
				"name": "PaymentDifferenceReason",
				"type": "Edm.String",
				"maxLength": "3",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "ReasonCode",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "ReasonCode"
				},
				"sap: heading": "RCd",
				"sap: quickinfo": "ReasonCodeforPayments",
				"sap: creatable": "false"
			}, {
				"name": "InvoiceList",
				"type": "Edm.String",
				"maxLength": "8",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "Coll.Inv.ListNo.",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Coll.Inv.ListNo."
				},
				"sap: heading": "Coll.Inv.",
				"sap: quickinfo": "CollectiveInvoiceListNumber",
				"sap: creatable": "false"
			}, {
				"name": "TaxSection",
				"type": "Edm.String",
				"maxLength": "4",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "SectionCode",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "SectionCode"
				},
				"sap: creatable": "false"
			}, {
				"name": "DocumentItemText",
				"type": "Edm.String",
				"maxLength": "50",
				"sap: aggregation-role": "dimension",
				"sap: label": "ItemText",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "ItemText"
				},
				"sap: creatable": "false"
			}, {
				"name": "DebitCreditCode",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "Debit/Credit",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Debit/Credit"
				},
				"sap: heading": "D/C",
				"sap: quickinfo": "Debit/CreditIndicator",
				"sap: creatable": "false"
			}, {
				"name": "CashDisount1DueDate",
				"type": "Edm.DateTime",
				"precision": "0",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "Date",
				"sap: label": "CashDisc1DueDate",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "CashDisc1DueDate"
				},
				"sap: heading": "Disc.1Due",
				"sap: quickinfo": "DueDateforCashDiscount1",
				"sap: creatable": "false"
			}, {
				"name": "SortKey",
				"type": "Edm.String",
				"maxLength": "10",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "SearchTerm",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "SearchTerm"
				},
				"sap: creatable": "false"
			}, {
				"name": "CustomerIsBlockedForPosting",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "Phys.Invent.Blocked",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Phys.Invent.Blocked"
				},
				"sap: heading": "PIB",
				"sap: quickinfo": "Indicator: HasthePhysicalInventoryBeenBlocked?",
				"sap: creatable": "false"
			}, {
				"name": "TaxID1",
				"type": "Edm.String",
				"maxLength": "16",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "TaxNumber1",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "TaxNumber1"
				},
				"sap: heading": "TaxNo.1",
				"sap: creatable": "false"
			}, {
				"name": "TaxID2",
				"type": "Edm.String",
				"maxLength": "11",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "TaxNumber2",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "TaxNumber2"
				},
				"sap: heading": "TaxNo.2",
				"sap: creatable": "false"
			}, {
				"name": "VATRegistration",
				"type": "Edm.String",
				"maxLength": "20",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "VATRegistrationNo.",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "VATRegistrationNo."
				},
				"sap: heading": "VATNo.",
				"sap: quickinfo": "VATRegistrationNumber",
				"sap: creatable": "false"
			}, {
				"name": "HasClearingAccountingDocument",
				"type": "Edm.String",
				"maxLength": "2",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "ItemStatus",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "ItemStatus"
				},
				"sap: heading": "IS",
				"sap: quickinfo": "ItemStatusSymbol: Cleared/Open",
				"sap: creatable": "false"
			}, {
				"name": "DueNetSymbol",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "DueNet(Symbol)",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "DueNet(Symbol)"
				},
				"sap: heading": "DueNet",
				"sap: quickinfo": "LineItemIsDueNet?",
				"sap: creatable": "false"
			}, {
				"name": "CashDateDueNetSymbol",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "CashDate1Due",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "CashDate1Due"
				},
				"sap: heading": "Cash1Due",
				"sap: quickinfo": "LineItemCashDiscount1IsDue?",
				"sap: creatable": "false"
			}, {
				"name": "AccountingDocumentTextCategory",
				"type": "Edm.String",
				"maxLength": "4",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "TextID",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "TextID"
				},
				"sap: heading": "T.ID",
				"sap: creatable": "false",
				"sap: sortable": "false",
				"sap: filterable": "false"
			}, {
				"name": "ToleranceGroup",
				"type": "Edm.String",
				"maxLength": "4",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "ToleranceGroup",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "ToleranceGroup"
				},
				"sap: heading": "TolGrp",
				"sap: quickinfo": "ToleranceGroupfortheBusinessPartner/G/LAccount",
				"sap: creatable": "false"
			}, {
				"name": "TaxJurisdiction",
				"type": "Edm.String",
				"maxLength": "15",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "TaxJur.",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "TaxJur."
				},
				"sap: quickinfo": "TaxJurisdiction",
				"sap: creatable": "false"
			}, {
				"name": "DueItemCategory",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: label": "DueItemCategory",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "DueItemCategory"
				},
				"sap: heading": "DICat.",
				"sap: creatable": "false"
			}, {
				"name": "SpecialGeneralLedgerTransactionType",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "SGTransactionType",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "SGTransactionType"
				},
				"sap: heading": "TT",
				"sap: quickinfo": "SpecialG/LTransactionType",
				"sap: creatable": "false"
			}, {
				"name": "SpecialGeneralLedgerCode",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "SpecialG/Lind",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "SpecialG/Lind"
				},
				"sap: heading": "SG",
				"sap: quickinfo": "SpecialG/LIndicator",
				"sap: creatable": "false"
			}, {
				"name": "PaymentMethodSupplement",
				"type": "Edm.String",
				"maxLength": "2",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "PymntMethdSupplemt",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "PymntMethdSupplemt"
				},
				"sap: heading": "PmtMthSu",
				"sap: quickinfo": "PaymentMethodSupplement",
				"sap: creatable": "false"
			}, {
				"name": "ValueDate",
				"type": "Edm.DateTime",
				"precision": "0",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "Date",
				"sap: label": "ValueDate",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "ValueDate"
				},
				"sap: creatable": "false"
			}, {
				"name": "SalesDocument",
				"type": "Edm.String",
				"maxLength": "10",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "SalesDocument",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "SalesDocument"
				},
				"sap: heading": "SalesDoc.",
				"sap: creatable": "false"
			}, {
				"name": "BillingDocument",
				"type": "Edm.String",
				"maxLength": "10",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "SDDocumentNo.",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "SDDocumentNo."
				},
				"sap: heading": "SDDoc.",
				"sap: quickinfo": "SalesandDistributionDocumentNumber",
				"sap: creatable": "false"
			}, {
				"name": "CashFlowType",
				"type": "Edm.String",
				"maxLength": "4",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "FlowType",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "FlowType"
				},
				"sap: heading": "Flow",
				"sap: creatable": "false"
			}, {
				"name": "TradingPartnerCompanyID",
				"type": "Edm.String",
				"maxLength": "6",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "CompanyID",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "CompanyID"
				},
				"sap: heading": "Co.ID",
				"sap: creatable": "false"
			}, {
				"name": "AssetContract",
				"type": "Edm.String",
				"maxLength": "13",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "ContractNumber",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "ContractNumber"
				},
				"sap: heading": "ContractNo.",
				"sap: creatable": "false"
			}, {
				"name": "TreasuryContractType",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "ContractType",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "ContractType"
				},
				"sap: creatable": "false"
			}, {
				"name": "InterestCalculationCode",
				"type": "Edm.String",
				"maxLength": "2",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "InterestIndic.",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "InterestIndic."
				},
				"sap: heading": "Int.",
				"sap: quickinfo": "InterestCalculationIndicator",
				"sap: creatable": "false"
			}, {
				"name": "TransactionCurrency",
				"type": "Edm.String",
				"maxLength": "5",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "Currency",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Currency"
				},
				"sap: heading": "Crcy",
				"sap: quickinfo": "CurrencyKey",
				"sap: creatable": "false",
				"sap: semantics": "currency-code"
			}, {
				"name": "Plant",
				"type": "Edm.String",
				"maxLength": "4",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "Plant",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Plant"
				},
				"sap: heading": "Plnt",
				"sap: creatable": "false"
			}, {
				"name": "BillOfExchangeUsage",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "BoEUsage",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "BoEUsage"
				},
				"sap: heading": "BoE",
				"sap: quickinfo": "BillofExchangeUsageType",
				"sap: creatable": "false"
			}, {
				"name": "DocumentArchivedIndiator",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "Archived",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Archived"
				},
				"sap: heading": "Arch.",
				"sap: quickinfo": "Indicator: HastheDocumentBeenArchived?",
				"sap: creatable": "false"
			}, {
				"name": "IsCleared",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "ItemCleared",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "ItemCleared"
				},
				"sap: heading": "C",
				"sap: quickinfo": "Indicator: HastheItemBeenCleared?",
				"sap: creatable": "false"
			}, {
				"name": "DocumentReferenceID",
				"type": "Edm.String",
				"maxLength": "16",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "Reference",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Reference"
				},
				"sap: quickinfo": "ReferenceDocumentNumber",
				"sap: creatable": "false"
			}, {
				"name": "IsOneTimeAccount",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "One-TimeAccount",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "One-TimeAccount"
				},
				"sap: heading": "OTA",
				"sap: quickinfo": "Indicator: IstheAccountaOne-TimeAccount?",
				"sap: creatable": "false"
			}, {
				"name": "IsCashDiscount1Due",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "CashDisc1DueInd",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "CashDisc1DueInd"
				},
				"sap: heading": "CDD",
				"sap: quickinfo": "Indicator: CashDiscountTerm1IsDueonItem?",
				"sap: creatable": "false"
			}, {
				"name": "IsDueNet",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "DueNetIndicator",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "DueNetIndicator"
				},
				"sap: heading": "Duenet",
				"sap: quickinfo": "Indicator: Itemisduenet?",
				"sap: creatable": "false"
			}, {
				"name": "IsPaytAdviceSentByEDI",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "PmtAdv.byEDI",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "PmtAdv.byEDI"
				},
				"sap: heading": "EDI",
				"sap: quickinfo": "Indicator: SendPaymentAdvicesbyEDI",
				"sap: creatable": "false"
			}, {
				"name": "IsNegativePosting",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "NegativePosting",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "NegativePosting"
				},
				"sap: heading": "NP",
				"sap: quickinfo": "Indicator: NegativePosting",
				"sap: creatable": "false"
			}, {
				"name": "IsSinglePayment",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "IndividualPayment",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "IndividualPayment"
				},
				"sap: heading": "IP",
				"sap: quickinfo": "Indicator: PayAllItemsSeparately?",
				"sap: creatable": "false"
			}, {
				"name": "HasPaymentOrder",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "PaymentSent",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "PaymentSent"
				},
				"sap: heading": "PS",
				"sap: quickinfo": "Indicator: PaymentOrderExistsforthisItem",
				"sap: creatable": "false"
			}, {
				"name": "IsClearingReversed",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "ReverseClearing",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "ReverseClearing"
				},
				"sap: heading": "R",
				"sap: quickinfo": "Indicator: ClearingwasReversed",
				"sap: creatable": "false"
			}, {
				"name": "Reference1IDByBusinessPartner",
				"type": "Edm.String",
				"maxLength": "12",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "ReferenceKey1",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "ReferenceKey1"
				},
				"sap: heading": "Ref.Key1",
				"sap: quickinfo": "BusinessPartnerReferenceKey1",
				"sap: creatable": "false"
			}, {
				"name": "Reference2IDByBusinessPartner",
				"type": "Edm.String",
				"maxLength": "12",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "ReferenceKey2",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "ReferenceKey2"
				},
				"sap: heading": "Ref.Key2",
				"sap: quickinfo": "BusinessPartnerReferenceKey2",
				"sap: creatable": "false"
			}, {
				"name": "Reference3IDByBusinessPartner",
				"type": "Edm.String",
				"maxLength": "20",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "ReferenceKey3",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "ReferenceKey3"
				},
				"sap: heading": "Ref.Key3",
				"sap: quickinfo": "ReferenceKeyforLineItem",
				"sap: creatable": "false"
			}, {
				"name": "IsDisputed",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "DisputedItem",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "DisputedItem"
				},
				"sap: heading": "D",
				"sap: quickinfo": "Indicator: Disputeditem?",
				"sap: creatable": "false"
			}, {
				"name": "HasText",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "TextExists",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "TextExists"
				},
				"sap: heading": "Txt",
				"sap: quickinfo": "Indicator: Doesatextexist?",
				"sap: creatable": "false",
				"sap: sortable": "false",
				"sap: filterable": "false"
			}, {
				"name": "IsSalesRelated",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "Sales-RelatedItem",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Sales-RelatedItem"
				},
				"sap: heading": "Sl",
				"sap: quickinfo": "Indicator: Sales-RelatedItem?",
				"sap: creatable": "false"
			}, {
				"name": "IsUsedInPaymentTransaction",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "PymtTran.",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "PymtTran."
				},
				"sap: heading": "Payment",
				"sap: quickinfo": "Indicator: IsPostingKeyUsedinaPaymentTransaction?",
				"sap: creatable": "false"
			}, {
				"name": "AlternativePayerIsAllowed",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "PayeeinDoc.",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "PayeeinDoc."
				},
				"sap: heading": "Alt.Payee",
				"sap: quickinfo": "Indicator: AlternativePayeeinDocumentAllowed",
				"sap: creatable": "false"
			}, {
				"name": "CustomerPaymentBlockingReason",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "Cust.PaymentBlock",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Cust.PaymentBlock"
				},
				"sap: heading": "CPB",
				"sap: quickinfo": "PaymentBlockonCustomer",
				"sap: creatable": "false"
			}, {
				"name": "FixedCashDiscount",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "FixedPaymentTerms",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "FixedPaymentTerms"
				},
				"sap: heading": "Terms",
				"sap: creatable": "false"
			}, {
				"name": "DueCalculationBaseDate",
				"type": "Edm.DateTime",
				"precision": "0",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "Date",
				"sap: label": "BaselineDate",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "BaselineDate"
				},
				"sap: heading": "BlineDate",
				"sap: quickinfo": "BaselineDateforDueDateCalculation",
				"sap: creatable": "false"
			}, {
				"name": "InterestCalculationDate",
				"type": "Edm.DateTime",
				"precision": "0",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "Date",
				"sap: label": "Int.LastCalculated",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Int.LastCalculated"
				},
				"sap: heading": "LstInt.Calc.",
				"sap: quickinfo": "KeyDateofLastInterestCalculation",
				"sap: creatable": "false"
			}, {
				"name": "IntrstCalcFrequencyInMonths",
				"type": "Edm.String",
				"maxLength": "2",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "InterestCalc.Freq.",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "InterestCalc.Freq."
				},
				"sap: heading": "Freq.",
				"sap: quickinfo": "InterestCalculationFrequencyinMonths",
				"sap: creatable": "false"
			}, {
				"name": "PaymentMethod",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "PaymentMethod",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "PaymentMethod"
				},
				"sap: heading": "PM",
				"sap: creatable": "false"
			}, {
				"name": "PaymentBlockingReason",
				"type": "Edm.String",
				"maxLength": "1",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "ItemPaymentBlock",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "ItemPaymentBlock"
				},
				"sap: heading": "IPB",
				"sap: quickinfo": "PaymentBlockonItem",
				"sap: creatable": "false"
			}, {
				"name": "TargetTaxCode",
				"type": "Edm.String",
				"maxLength": "2",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "TargetTaxCode",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "TargetTaxCode"
				},
				"sap: heading": "TTCd",
				"sap: quickinfo": "TargetTaxCode(forDeferredTax)",
				"sap: creatable": "false"
			}, {
				"name": "PaymentTerms",
				"type": "Edm.String",
				"maxLength": "4",
				"sap: aggregation-role": "dimension",
				"sap: display-format": "UpperCase",
				"sap: label": "PaymentTerms",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "PaymentTerms"
				},
				"sap: heading": "PayT",
				"sap: quickinfo": "TermsofPaymentKey",
				"sap: creatable": "false"
			}, {
				"name": "AssignmentReference",
				"type": "Edm.String",
				"maxLength": "18",
				"sap: aggregation-role": "dimension",
				"sap: label": "Assignment",
				"com.sap.vocabularies.Common.v1.Label": {
					"String": "Assignment"
				},
				"sap: quickinfo": "AssignmentNumber",
				"sap: creatable": "false"
			}
		],
		"sap: service-schema-version": "1",
		"sap: service-version": "1",
		"sap: semantics": "aggregate",
		"sap: content-version": "1",
		"com.sap.vocabularies.UI.v1.SelectionFields": [],
		"com.sap.vocabularies.UI.v1.LineItem": [],
		"$path": "/dataServices/schema/0/entityType/1"
	};

	QUnit.test("getSemanticObjectAnnotationFromProperty shall return the SemanticObject annotation", function(assert) {
		var oProperty, oAnnotation;

		oProperty = {
			"name": "FixedAsset",
			"type": "Edm.String",
			"maxLength": "4",
			"sap:aggregation-role": "dimension",
			"sap:display-format": "UpperCase",
			"sap:label": "Subnumber",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Subnumber"
			},
			"sap:heading": "SNo.",
			"sap:quickinfo": "Asset Subnumber",
			"sap:creatable": "false",
			"com.sap.vocabularies.Common.v1.SemanticObject": {
				"String": "FixedAsset"
			}
		};
		oAnnotation = this.oMetadataAnalyser.getSemanticObjectAnnotationFromProperty(oProperty);
		assert.strictEqual(oAnnotation.semanticObject, "FixedAsset");
	});

	QUnit.test("getSemanticObjectAnnotationFromProperty shall return null", function(assert) {
		var oProperty, oAnnotation;

		oProperty = {
			"name": "FixedAsset",
			"type": "Edm.String",
			"maxLength": "4",
			"sap:aggregation-role": "dimension",
			"sap:display-format": "UpperCase",
			"sap:label": "Subnumber",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Subnumber"
			},
			"sap:heading": "SNo.",
			"sap:quickinfo": "Asset Subnumber",
			"sap:creatable": "false"
		};
		oAnnotation = this.oMetadataAnalyser.getSemanticObjectAnnotationFromProperty(oProperty);
		assert.strictEqual(!oAnnotation, true);

		oAnnotation = this.oMetadataAnalyser.getSemanticObjectAnnotationFromProperty();
		assert.strictEqual(!oAnnotation, true);
	});

	QUnit.test("Chart - getPresentationVariantAnnotation shall return the matching PresentationVariant annotation with Visualizations, SortOrderFields,RequestAtLeastFields and MaxItems", function(assert) {
		var oPresentationVariant, oChartAnnotation, oChartAnnotation2, oEntity, oAnnotation;
		oPresentationVariant = {
			"Visualizations": [
				{
					"AnnotationPath": "@com.sap.vocabularies.UI.v1.Chart"
				}
			],
			"RequestAtLeast": [
				{
					"PropertyPath": "Customer"
				}, {
					"PropertyPath": "CompanyCode"
				}
			],
			"MaxItems": {
				"Int": 5
			},
			"SortOrder": [
				{
					"Property": {
						"PropertyPath": "CompanyCode"
					},
					"Descending": {
						"Bool": "true"
					}
				}, {
					"Property": {
						"PropertyPath": "Customer"
					}
				}
			]
		};
		oChartAnnotation = {
			ChartType: {
				EnumMember: "com.sap.vocabularies.UI.v1.ChartType/Column"
			},
			Dimensions: [
				{
					PropertyPath: "CompanyCode"
				}, {
					PropertyPath: "Customer"
				}
			],
			DimensionAttributes: [
				{
					Dimension: {
						PropertyPath: "CompanyCode"
					},
					Role: {
						EnumMember: "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series"
					}
				}, {
					Dimension: {
						PropertyPath: "Customer"
					},
					Role: {
						EnumMember: "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
					}
				}
			],
			Measures: [
				{
					PropertyPath: "AmountInCompanyCodeCurrency"
				}, {
					PropertyPath: "AmountInTransactionCurrency"
				}
			],
			MeasureAttributes: [
				{
					Measure: {
						PropertyPath: "AmountInCompanyCodeCurrency"
					},
					Role: {
						EnumMember: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
					}
				}, {
					Measure: {
						PropertyPath: "AmountInTransactionCurrency"
					},
					Role: {
						EnumMember: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis2"
					}
				}
			]
		};

		oChartAnnotation2 = merge({}, oChartAnnotation);
		oChartAnnotation2.ChartType.EnumMember = "com.sap.vocabularies.UI.v1.ChartType/Bar";

		oEntity = {
			"name": "Item",
			"key": {
				"propertyRef": [
					{
						"name": "GeneratedID"
					}
				]
			},
			"property": [],
			"sap:service-schema-version": "1",
			"sap:service-version": "1",
			"sap:semantics": "aggregate",
			"sap:content-version": "1",
			"com.sap.vocabularies.UI.v1.PresentationVariant": oPresentationVariant,
			"com.sap.vocabularies.UI.v1.Chart": oChartAnnotation,
			"com.sap.vocabularies.UI.v1.Chart#someQualifier": oChartAnnotation2,
			"com.sap.vocabularies.UI.v1.PresentationVariant#someQualifier": {
				"Visualizations": [
					{
						"AnnotationPath": "@com.sap.vocabularies.UI.v1.Chart#someQualifier"
					}
				]
			},
			"$path": "/dataServices/schema/0/entityType/1"
		};

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns(oEntity);

		var oPresentationAnnotation = this.oMetadataAnalyser.getPresentationVariantAnnotation("com.sap.foo.Item");
		assert.strictEqual(oPresentationAnnotation.chartAnnotation.annotation, oChartAnnotation);
		assert.strictEqual(oPresentationAnnotation.annotation, oPresentationVariant);

		assert.strictEqual(oPresentationAnnotation.maxItems, 5, "The supplied MaxItems property value is evaluated correctly");

		assert.deepEqual(oPresentationAnnotation.requestAtLeastFields, [
			"Customer", "CompanyCode"
		], "requestAtLeastfields match");
		assert.deepEqual(oPresentationAnnotation.sortOrderFields, [
			{
				"name": "CompanyCode",
				"descending": true
			}, {
				"name": "Customer",
				"descending": false
			}
		], "sortOrderfields match");
		// Check Chart annotation resolution
		oAnnotation = oPresentationAnnotation.chartAnnotation;
		assert.ok(oAnnotation.measureFields);
		assert.ok(oAnnotation.measureFields.length === 2);
		assert.equal(oAnnotation.measureFields[0], "AmountInCompanyCodeCurrency");
		assert.equal(oAnnotation.measureFields[1], "AmountInTransactionCurrency");

		assert.ok(oAnnotation.dimensionFields);
		assert.ok(oAnnotation.dimensionFields.length === 2);
		assert.equal(oAnnotation.dimensionFields[0], "CompanyCode");
		assert.equal(oAnnotation.dimensionFields[1], "Customer");

		assert.ok(oAnnotation.dimensionAttributes);
		assert.equal(oAnnotation.dimensionAttributes["CompanyCode"].role, "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series");
		assert.equal(oAnnotation.dimensionAttributes["Customer"].role, "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category");

		assert.ok(oAnnotation.measureAttributes);
		assert.equal(oAnnotation.measureAttributes["AmountInCompanyCodeCurrency"].role, "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1");

		assert.ok(oAnnotation.chartType === "com.sap.vocabularies.UI.v1.ChartType/Column");
		assert.ok(oAnnotation.semantics === "aggregate");

		// test again with Qualifier
		oPresentationAnnotation = this.oMetadataAnalyser.getPresentationVariantAnnotation("com.sap.foo.Item", "someQualifier");
		assert.ok(oPresentationAnnotation);
		assert.strictEqual(oPresentationAnnotation.chartAnnotation.annotation, oChartAnnotation2);
		// Check Chart annotation resolution
		oAnnotation = oPresentationAnnotation.chartAnnotation;
		assert.ok(oAnnotation.measureFields);
		assert.ok(oAnnotation.measureFields.length === 2);
		assert.equal(oAnnotation.measureFields[0], "AmountInCompanyCodeCurrency");
		assert.equal(oAnnotation.measureFields[1], "AmountInTransactionCurrency");

		assert.ok(oAnnotation.dimensionFields);
		assert.ok(oAnnotation.dimensionFields.length === 2);
		assert.equal(oAnnotation.dimensionFields[0], "CompanyCode");
		assert.equal(oAnnotation.dimensionFields[1], "Customer");

		assert.ok(oAnnotation.dimensionAttributes);
		assert.equal(oAnnotation.dimensionAttributes["CompanyCode"].role, "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series");
		assert.equal(oAnnotation.dimensionAttributes["Customer"].role, "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category");

		assert.ok(oAnnotation.measureAttributes);
		assert.equal(oAnnotation.measureAttributes["AmountInCompanyCodeCurrency"].role, "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1");
		assert.equal(oAnnotation.measureAttributes["AmountInTransactionCurrency"].role, "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis2");

		assert.ok(oAnnotation.chartType === "com.sap.vocabularies.UI.v1.ChartType/Bar");
		assert.ok(oAnnotation.semantics === "aggregate");

		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns({});
		oAnnotation = this.oMetadataAnalyser.getPresentationVariantAnnotation("com.sap.GL.ZAF.GL_ACCOUNT_BALANCE");
		assert.ok(!oAnnotation);
	});

	QUnit.test("getChartAnnotation shall return the resolved Chart annotation from ODataMetaModel/entity including datapoint", function(assert) {
		var oChartAnnotation, oChartAnnotation2, oEntity, oAnnotation;

		oChartAnnotation = {
			ChartType: {
				EnumMember: "com.sap.vocabularies.UI.v1.ChartType/Column"
			},
			Dimensions: [
				{
					PropertyPath: "CompanyCode"
				}, {
					PropertyPath: "Customer"
				}
			],
			DimensionAttributes: [
				{
					Dimension: {
						PropertyPath: "CompanyCode"
					},
					Role: {
						EnumMember: "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series"
					}
				}, {
					Dimension: {
						PropertyPath: "Customer"
					},
					Role: {
						EnumMember: "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
					}
				}
			],
			Measures: [
				{
					PropertyPath: "AmountInCompanyCodeCurrency"
				}, {
					PropertyPath: "AmountInTransactionCurrency"
				}
			],
			MeasureAttributes: [
				{
					Measure: {
						PropertyPath: "AmountInCompanyCodeCurrency"
					},
					Role: {
						EnumMember: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
					},
					DataPoint: {
						AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#someQualifier"
					}
				}
			]
		};

		oChartAnnotation2 = merge({}, oChartAnnotation);
		oChartAnnotation2.ChartType.EnumMember = "com.sap.vocabularies.UI.v1.ChartType/Bar";

		oEntity = {
			"name": "Item",
			"key": {
				"propertyRef": [
					{
						"name": "GeneratedID"
					}
				]
			},
			"property": [],
			"sap:service-schema-version": "1",
			"sap:service-version": "1",
			"sap:semantics": "aggregate",
			"sap:content-version": "1",
			"com.sap.vocabularies.UI.v1.Chart": oChartAnnotation,
			"com.sap.vocabularies.UI.v1.Chart#someQualifier": oChartAnnotation2,
			"$path": "/dataServices/schema/0/entityType/2"
		};

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns(oEntity);

		oAnnotation = this.oMetadataAnalyser.getChartAnnotation("com.sap.foo.Item");

		assert.ok(oAnnotation);
		assert.ok(oAnnotation.annotation);

		assert.ok(oAnnotation.measureFields);
		assert.ok(oAnnotation.measureFields.length === 2);
		assert.equal(oAnnotation.measureFields[0], "AmountInCompanyCodeCurrency");
		assert.equal(oAnnotation.measureFields[1], "AmountInTransactionCurrency");

		assert.ok(oAnnotation.dimensionFields);
		assert.ok(oAnnotation.dimensionFields.length === 2);
		assert.equal(oAnnotation.dimensionFields[0], "CompanyCode");
		assert.equal(oAnnotation.dimensionFields[1], "Customer");

		assert.ok(oAnnotation.dimensionAttributes);
		assert.equal(oAnnotation.dimensionAttributes["CompanyCode"].role, "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series");
		assert.equal(oAnnotation.dimensionAttributes["Customer"].role, "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category");

		assert.ok(oAnnotation.measureAttributes);
		assert.equal(oAnnotation.measureAttributes["AmountInCompanyCodeCurrency"].role, "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1");
		assert.equal(oAnnotation.measureAttributes["AmountInCompanyCodeCurrency"].dataPoint, "@com.sap.vocabularies.UI.v1.DataPoint#someQualifier");

		assert.ok(oAnnotation.chartType === "com.sap.vocabularies.UI.v1.ChartType/Column");
		assert.ok(oAnnotation.semantics === "aggregate");

		// Test again for annoation with Qualifier
		oAnnotation = this.oMetadataAnalyser.getChartAnnotation("com.sap.foo.Item", "someQualifier");

		assert.ok(oAnnotation);
		assert.ok(oAnnotation.annotation);

		assert.ok(oAnnotation.measureFields);
		assert.ok(oAnnotation.measureFields.length === 2);
		assert.equal(oAnnotation.measureFields[0], "AmountInCompanyCodeCurrency");
		assert.equal(oAnnotation.measureFields[1], "AmountInTransactionCurrency");

		assert.ok(oAnnotation.dimensionFields);
		assert.ok(oAnnotation.dimensionFields.length === 2);
		assert.equal(oAnnotation.dimensionFields[0], "CompanyCode");
		assert.equal(oAnnotation.dimensionFields[1], "Customer");

		assert.ok(oAnnotation.dimensionAttributes);
		assert.equal(oAnnotation.dimensionAttributes["CompanyCode"].role, "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series");
		assert.equal(oAnnotation.dimensionAttributes["Customer"].role, "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category");

		assert.ok(oAnnotation.measureAttributes);
		assert.equal(oAnnotation.measureAttributes["AmountInCompanyCodeCurrency"].role, "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1");

		assert.ok(oAnnotation.chartType === "com.sap.vocabularies.UI.v1.ChartType/Bar");
		assert.ok(oAnnotation.semantics === "aggregate");

		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns(null);
		oAnnotation = this.oMetadataAnalyser.getChartAnnotation("com.sap.GL.ZAF.GL_ACCOUNT_BALANCE");
		assert.ok(!oAnnotation);
	});

	QUnit.test("getDataPointAnnotation shall return the resolved DataPoint annotation from ODataMetaModel/entity", function(assert) {
		var oAnnotation;
		var oDataPointAnnotation = {
			Value: {
				PrimitiveType: "120.00"
			},
			TargetValue: {
				PrimitiveType: "100.00"
			},
			ForecastValue: {
				PrimitiveType: "110.00"
			},
			MinimumValue: {
				PrimitiveType: "0.00"
			},
			MaximumValue: {
				PrimitiveType: "200.00"
			},
			CriticalityCalculation: {
				CriticalityCalculationType: {
					ImprovementDirection: {
						ImprovementDirectionType: "Target"
					},
					ToleranceRangeLowValue: {
						PrimitiveType: "50.00"
					},
					ToleranceRangeHighValue: {
						PrimitiveType: "150.00"
					},
					DeviationRangeLowValue: {
						PrimitiveType: "0.00"
					},
					DeviationRangeHighValue: {
						PrimitiveType: "200.00"
					}
				}
			}
		};
		var oSecondDataPointAnnotation = {
			Value: {
				PrimitiveType: "Revenue"
			},
			TargetValue: {
				PrimitiveType: "TargetRevenue"
			},
			ForecastValue: {
				PrimitiveType: "ForecastRevenue"
			},
			MinimumValue: {
				PrimitiveType: "MinScaleValue"
			},
			MaximumValue: {
				PrimitiveType: "MaxScaleValue"
			},
			CriticalityCalculation: {
				CriticalityCalculationType: {
					ImprovementDirection: {
						ImprovementDirectionType: "Target"
					},
					ToleranceRangeLowValue: {
						PrimitiveType: "ThresholdCriticalBegin"
					},
					ToleranceRangeHighValue: {
						PrimitiveType: "ThresholdCriticalEnd"
					},
					DeviationRangeLowValue: {
						PrimitiveType: "ThresholdErrorBegin"
					},
					DeviationRangeHighValue: {
						PrimitiveType: "ThresholdErrorEnd"
					}
				}
			}
		};
		var oEntity = {
			"name": "Item",
			"key": {
				"propertyRef": [
					{
						"name": "GeneratedID"
					}
				]
			},
			"property": [],
			"sap:service-schema-version": "1",
			"sap:service-version": "1",
			"sap:semantics": "aggregate",
			"sap:content-version": "1",
			"com.sap.vocabularies.UI.v1.DataPoint": oDataPointAnnotation,
			"com.sap.vocabularies.UI.v1.DataPoint#SecondDataPoint": oSecondDataPointAnnotation,
			"$path": "/dataServices/schema/0/entityType/2"
		};
		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns(oEntity);

		oAnnotation = this.oMetadataAnalyser.getDataPointAnnotation("com.sap.foo.Item");

		assert.ok(oAnnotation, "Primary annotation found");
		assert.strictEqual(oAnnotation.primaryAnnotation.Value.PrimitiveType, "120.00");

		assert.ok(oAnnotation.additionalAnnotations, "Additional annotation found");
		assert.ok(oAnnotation.additionalAnnotations.hasOwnProperty("SecondDataPoint"), "Second Datapoint found");
		assert.strictEqual(oAnnotation.additionalAnnotations.SecondDataPoint.Value.PrimitiveType, "Revenue");
	});

	QUnit.test("getPresentationVariantAnnotation shall return the matching PresentationVariant annotation with all relevant Visualizations", function(assert) {
		var oPresentationVariant, aLineItemAnnotation, oChartAnnotation, oChartAnnotation2, oEntity, oAnnotation;
		oPresentationVariant = {
			"Visualizations": [
				{
					"AnnotationPath": "@com.sap.vocabularies.UI.v1.LineItem"
				}, {
					"AnnotationPath": "@com.sap.vocabularies.UI.v1.Chart"
				}, {
					"AnnotationPath": "@com.sap.vocabularies.UI.v1.Chart#someQualifier"
				}
			],
			"RequestAtLeast": [
				{
					"PropertyPath": "Customer"
				}, {
					"PropertyPath": "CompanyCode"
				}
			],
			"SortOrder": [
				{
					"Property": {
						"PropertyPath": "CompanyCode"
					},
					"Descending": {
						"Bool": "true"
					}
				}, {
					"Property": {
						"PropertyPath": "Customer"
					}
				}
			],
			"GroupBy": [
				{
					"PropertyPath": "Customer"
				}, {
					"PropertyPath": "CompanyCode"
				}
			]
		};
		aLineItemAnnotation = [
			{
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
				},
				"Value": {
					"Path": "Customer"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.String"
			}, {
				"Value": {
					"Path": "CompanyCode"
				},
				"Label": {
					"String": "Kunnr"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.String"
			}, {
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
				},
				"Value": {
					"Path": "ClearingDate"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.Date"
			}, {
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
				},
				"Value": {
					"Path": "AssignmentReference"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.String"
			}, {
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
				},
				"Value": {
					"Path": "AccountingDocument"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.String"
			}, {
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Low"
				},
				"Value": {
					"Path": "AmountInCompanyCodeCurrency"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.Decimal"
			}, {
				"com.sap.vocabularies.UI.v1.Importance": {
					"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/Low"
				},
				"Value": {
					"Path": "CompanyCodeCurrency"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.String"
			}, {
				"Value": {
					"Path": "ClearingAccountingDocument"
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"EdmType": "Edm.String"
			}
		];

		oChartAnnotation = {
			ChartType: {
				EnumMember: "com.sap.vocabularies.UI.v1.ChartType/Column"
			},
			Dimensions: [
				{
					PropertyPath: "CompanyCode"
				}, {
					PropertyPath: "Customer"
				}
			],
			DimensionAttributes: [
				{
					Dimension: {
						PropertyPath: "CompanyCode"
					},
					Role: {
						EnumMember: "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series"
					}
				}, {
					Dimension: {
						PropertyPath: "Customer"
					},
					Role: {
						EnumMember: "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category"
					}
				}
			],
			Measures: [
				{
					PropertyPath: "AmountInCompanyCodeCurrency"
				}, {
					PropertyPath: "AmountInTransactionCurrency"
				}
			],
			MeasureAttributes: [
				{
					Measure: {
						PropertyPath: "AmountInCompanyCodeCurrency"
					},
					Role: {
						EnumMember: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1"
					}
				}
			]
		};

		oChartAnnotation2 = merge({}, oChartAnnotation);
		oChartAnnotation2.ChartType.EnumMember = "com.sap.vocabularies.UI.v1.ChartType/Bar";

		oEntity = {
			"name": "Item",
			"key": {
				"propertyRef": [
					{
						"name": "GeneratedID"
					}
				]
			},
			"property": [],
			"sap:service-schema-version": "1",
			"sap:service-version": "1",
			"sap:semantics": "aggregate",
			"sap:content-version": "1",
			"com.sap.vocabularies.UI.v1.PresentationVariant": oPresentationVariant,
			"com.sap.vocabularies.UI.v1.LineItem": aLineItemAnnotation,
			"com.sap.vocabularies.UI.v1.LineItem#someQualifier": [],
			"com.sap.vocabularies.UI.v1.Chart": oChartAnnotation,
			"com.sap.vocabularies.UI.v1.Chart#someQualifier": oChartAnnotation2,
			"com.sap.vocabularies.UI.v1.PresentationVariant#someQualifier": {
				"Visualizations": [
					{
						"AnnotationPath": "@com.sap.vocabularies.UI.v1.LineItem#someQualifier"
					}, {
						"AnnotationPath": "@com.sap.vocabularies.UI.v1.Chart#someQualifier"
					}
				]
			},
			"$path": "/dataServices/schema/0/entityType/1"
		};

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns(oEntity);

		var oPresentationAnnotation = this.oMetadataAnalyser.getPresentationVariantAnnotation("com.sap.foo.Item");
		assert.strictEqual(oPresentationAnnotation.lineItemAnnotation.annotation, aLineItemAnnotation);
		assert.strictEqual(oPresentationAnnotation.annotation, oPresentationVariant);
		assert.deepEqual(oPresentationAnnotation.requestAtLeastFields, [
			"Customer", "CompanyCode"
		], "requestAtLeastfields match");
		assert.deepEqual(oPresentationAnnotation.sortOrderFields, [
			{
				"name": "CompanyCode",
				"descending": true
			}, {
				"name": "Customer",
				"descending": false
			}
		], "sortOrderfields match");
		assert.deepEqual(oPresentationAnnotation.groupByFields, [
			"Customer", "CompanyCode"
		], "groupByFields match");
		// Check LineItem annotation resolution
		oAnnotation = oPresentationAnnotation.lineItemAnnotation;
		assert.ok(oAnnotation.fields);
		assert.ok(oAnnotation.labels);
		assert.ok(oAnnotation.importance);
		assert.strictEqual(oAnnotation.fields.length, 8);
		assert.deepEqual(oAnnotation.fields, [
			"Customer", "CompanyCode", "ClearingDate", "AssignmentReference", "AccountingDocument", "AmountInCompanyCodeCurrency", "CompanyCodeCurrency", "ClearingAccountingDocument"
		]);
		assert.strictEqual(oAnnotation.labels["CompanyCode"], "Kunnr");
		assert.equal(oAnnotation.importance["Customer"], "High", "importance high has to be set on Customer");
		assert.equal(oAnnotation.importance["AssignmentReference"], "Medium", "importance medium has to be set on AssignmentReference");
		assert.equal(oAnnotation.importance["AmountInCompanyCodeCurrency"], "Low", "importance low has to be set on AmountInCompanyCodeCurrency");
		assert.equal(oAnnotation.importance["CompanyCode"], "High", "importance high has to be set on CompanyCode, as default");

		assert.strictEqual(oPresentationAnnotation.chartAnnotation.annotation, oChartAnnotation);
		assert.ok(oPresentationAnnotation.chartAnnotation.annotation !== oChartAnnotation2);
		// Check Chart annotation resolution
		oAnnotation = oPresentationAnnotation.chartAnnotation;
		assert.ok(oAnnotation.measureFields);
		assert.ok(oAnnotation.measureFields.length === 2);
		assert.equal(oAnnotation.measureFields[0], "AmountInCompanyCodeCurrency");
		assert.equal(oAnnotation.measureFields[1], "AmountInTransactionCurrency");

		assert.ok(oAnnotation.dimensionFields);
		assert.ok(oAnnotation.dimensionFields.length === 2);
		assert.equal(oAnnotation.dimensionFields[0], "CompanyCode");
		assert.equal(oAnnotation.dimensionFields[1], "Customer");

		assert.ok(oAnnotation.dimensionAttributes);
		assert.equal(oAnnotation.dimensionAttributes["CompanyCode"].role, "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series");
		assert.equal(oAnnotation.dimensionAttributes["Customer"].role, "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category");

		assert.ok(oAnnotation.measureAttributes);
		assert.equal(oAnnotation.measureAttributes["AmountInCompanyCodeCurrency"].role, "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1");

		assert.ok(oAnnotation.chartType === "com.sap.vocabularies.UI.v1.ChartType/Column");
		assert.ok(oAnnotation.semantics === "aggregate");

		// test again with Qualifier
		oPresentationAnnotation = this.oMetadataAnalyser.getPresentationVariantAnnotation("com.sap.foo.Item", "someQualifier");
		assert.ok(oPresentationAnnotation);
		assert.deepEqual(oPresentationAnnotation.lineItemAnnotation.annotation, []);
		assert.strictEqual(oPresentationAnnotation.chartAnnotation.annotation, oChartAnnotation2);
		// Check Chart annotation resolution
		oAnnotation = oPresentationAnnotation.chartAnnotation;
		assert.ok(oAnnotation.measureFields);
		assert.ok(oAnnotation.measureFields.length === 2);
		assert.equal(oAnnotation.measureFields[0], "AmountInCompanyCodeCurrency");
		assert.equal(oAnnotation.measureFields[1], "AmountInTransactionCurrency");

		assert.ok(oAnnotation.dimensionFields);
		assert.ok(oAnnotation.dimensionFields.length === 2);
		assert.equal(oAnnotation.dimensionFields[0], "CompanyCode");
		assert.equal(oAnnotation.dimensionFields[1], "Customer");

		assert.ok(oAnnotation.dimensionAttributes);
		assert.equal(oAnnotation.dimensionAttributes["CompanyCode"].role, "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series");
		assert.equal(oAnnotation.dimensionAttributes["Customer"].role, "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category");

		assert.ok(oAnnotation.measureAttributes);
		assert.equal(oAnnotation.measureAttributes["AmountInCompanyCodeCurrency"].role, "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1");

		assert.ok(oAnnotation.chartType === "com.sap.vocabularies.UI.v1.ChartType/Bar");
		assert.ok(oAnnotation.semantics === "aggregate");

		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns({});
		oAnnotation = this.oMetadataAnalyser.getPresentationVariantAnnotation("com.sap.GL.ZAF.GL_ACCOUNT_BALANCE");
		assert.ok(!oAnnotation);
	});

	QUnit.test("getTextArrangmentValue shall return the resolved TextArrangement annotation's displayBehaviour from ODataMetaModel/entity", function(assert) {
		var oTextArrangmentAnnotaion, oEntity, sDisplayBehaviour;

		oTextArrangmentAnnotaion = {
			EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"
		};

		oEntity = {
			"name": "Item",
			"key": {
				"propertyRef": [
					{
						"name": "foo"
					}
				]
			},
			"property": [],
			"com.sap.vocabularies.UI.v1.TextArrangement": oTextArrangmentAnnotaion,
			"$path": "/dataServices/schema/0/entityType/1"
		};

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns(oEntity);

		sDisplayBehaviour = this.oMetadataAnalyser.getTextArrangementValue("com.sap.foo.Item");

		assert.ok(sDisplayBehaviour);
		assert.strictEqual(sDisplayBehaviour, "idAndDescription", "Description shall be at the end");

		oTextArrangmentAnnotaion.EnumMember = "com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst";
		sDisplayBehaviour = this.oMetadataAnalyser.getTextArrangementValue("com.sap.foo.Item");
		assert.ok(sDisplayBehaviour);
		assert.strictEqual(sDisplayBehaviour, "descriptionAndId", "Description shall be at the beginning");

		oTextArrangmentAnnotaion.EnumMember = "com.sap.vocabularies.UI.v1.TextArrangementType/TextSeparate";
		sDisplayBehaviour = this.oMetadataAnalyser.getTextArrangementValue("com.sap.foo.Item");
		assert.ok(sDisplayBehaviour);
		assert.strictEqual(sDisplayBehaviour, "idOnly", "Only Id shall be present");

		oTextArrangmentAnnotaion.EnumMember = "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly";
		sDisplayBehaviour = this.oMetadataAnalyser.getTextArrangementValue("com.sap.foo.Item");
		assert.ok(sDisplayBehaviour);
		assert.strictEqual(sDisplayBehaviour, "descriptionOnly", "Only Description shall be present");

		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns(null);
		sDisplayBehaviour = this.oMetadataAnalyser.getTextArrangementValue("com.sap.GL.ZAF.GL_ACCOUNT_BALANCE");
		assert.ok(!sDisplayBehaviour);
		assert.strictEqual(sDisplayBehaviour, undefined, "undefined shall be returned when no annotation is found");
	});

	QUnit.test("getSemanticKeyAnnotation shall return the resolved SemanticKey annotation from ODataMetaModel/entity", function(assert) {
		var aSemanticKeyAnnotation, oEntity, oResolvedAnnotation;

		aSemanticKeyAnnotation = [
			{
				PropertyPath: "Company"
			}, {
				PropertyPath: "Product"
			}, {
				PropertyPath: "SomePath"
			}
		];

		oEntity = {
			"name": "Item",
			"key": {
				"propertyRef": [
					{
						"name": "foo"
					}
				]
			},
			"property": [],
			"com.sap.vocabularies.Common.v1.SemanticKey": aSemanticKeyAnnotation,
			"$path": "/dataServices/schema/0/entityType/1"
		};

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns(oEntity);

		oResolvedAnnotation = this.oMetadataAnalyser.getSemanticKeyAnnotation("com.sap.foo.Item");

		assert.ok(oResolvedAnnotation && oResolvedAnnotation.semanticKeyFields);
		assert.strictEqual(oResolvedAnnotation.semanticKeyFields.length, 3, "SemanticKey fields found");
		assert.strictEqual(oResolvedAnnotation.semanticKeyFields[0], "Company", "SemanticKey contains Company");
		assert.strictEqual(oResolvedAnnotation.semanticKeyFields[1], "Product", "SemanticKey contains Product");
		assert.strictEqual(oResolvedAnnotation.semanticKeyFields[2], "SomePath", "SemanticKey contains SomePath");
	});

	QUnit.test("Shall return the field for the specified navigationProperty path and entitySet", function(assert) {

		var oField = null;
		var done = assert.async();

		this.oModel.getMetaModel().loaded().then(function() {
			var oMetadataAnalyser = new MetadataAnalyser(this.oModel);

			oField = oMetadataAnalyser.extractNavigationPropertyField("Something that doesn't exist!", "foo");
			assert.strictEqual(oField, null);

			sinon.spy(oMetadataAnalyser, "_parseV4PropertyAnnotations");
			sinon.spy(oMetadataAnalyser, "_determineFilterAndSortInformation");

			oField = oMetadataAnalyser.extractNavigationPropertyField("toNav/CashDiscountAmountInTransactionCurrency", "NavTestItems");

			assert.ok(oField);
			assert.strictEqual(oMetadataAnalyser._parseV4PropertyAnnotations.calledOnce, true);
			assert.strictEqual(oMetadataAnalyser._determineFilterAndSortInformation.calledOnce, true);

			var oEntitySet = oMetadataAnalyser._determineFilterAndSortInformation.args[0][2];
			assert.ok(oEntitySet, "Filter and Sorting information is determined via the entity set");

			assert.strictEqual(oField.name, "CashDiscountAmountInTransactionCurrency");
			assert.strictEqual(oField.fieldLabel, "Discount (Doc. Crcy)");
			assert.strictEqual(oField.sortable, true);
			assert.strictEqual(oField.filterable, true);
			assert.strictEqual(oField.requiredFilterField, false);
			assert.strictEqual(oField.aggregationRole, "measure");
			assert.strictEqual(oField.type, "Edm.Decimal");
			assert.strictEqual(oField.visible, true);
			assert.strictEqual(oField.displayFormat, "UpperCase");
			assert.strictEqual(oField.entityName, "TestItem");
			assert.strictEqual(oField.parentPropertyName, "toNav");

			done();
		}.bind(this));
	});

	QUnit.test("Shall calculate the hierarchy annotations", function(assert) {
		var aFields = null, sEntityType = "HierarchyTestItems";

		var done = assert.async();

		this.oModel.getMetaModel().loaded().then(function() {
			var oMetadataAnalyser = new MetadataAnalyser(this.oModel);

			sinon.spy(oMetadataAnalyser, "_determineHierarchyInformation");

			aFields = oMetadataAnalyser.getFieldsByEntitySetName(sEntityType);

			assert.strictEqual(oMetadataAnalyser._determineHierarchyInformation.callCount, aFields.length, "Hierarchy Information is determined for each field");

			assert.strictEqual(aFields[4].name, "GLAccount_NodeID");
			assert.ok(aFields[4].hierarchy, "Hierarchy is defined for GLAccount_NodeID");
			assert.strictEqual(aFields[4].hierarchy.type, MetadataAnalyser.hierarchyType.nodeFor);
			assert.strictEqual(aFields[4].hierarchy.field, "GLAccount");

			assert.strictEqual(aFields[5].name, "GLAccount_NodeIDExt");
			assert.ok(aFields[5].hierarchy, "Hierarchy is defined for GLAccount_NodeIDExt");
			assert.strictEqual(aFields[5].hierarchy.type, MetadataAnalyser.hierarchyType.nodeExternalKeyFor);
			assert.strictEqual(aFields[5].hierarchy.field, "GLAccount_NodeID");

			assert.strictEqual(aFields[7].name, "GLAccount_ParentID");
			assert.ok(aFields[7].hierarchy, "Hierarchy is defined for GLAccount_ParentID");
			assert.strictEqual(aFields[7].hierarchy.type, MetadataAnalyser.hierarchyType.parentNodeFor);
			assert.strictEqual(aFields[7].hierarchy.field, "GLAccount_NodeID");

			assert.strictEqual(aFields[8].name, "GLAccount_Level");
			assert.ok(aFields[8].hierarchy, "Hierarchy is defined for GLAccount_Level");
			assert.strictEqual(aFields[8].hierarchy.type, MetadataAnalyser.hierarchyType.levelFor);
			assert.strictEqual(aFields[8].hierarchy.field, "GLAccount_NodeID");

			assert.strictEqual(aFields[9].name, "GLAccount_Drillstate");
			assert.ok(aFields[9].hierarchy, "Hierarchy is defined for GLAccount_Drillstate");
			assert.strictEqual(aFields[9].hierarchy.type, MetadataAnalyser.hierarchyType.drillStateFor);
			assert.strictEqual(aFields[9].hierarchy.field, "GLAccount_NodeID");

			assert.strictEqual(aFields[10].name, "GLAccount_Nodecount");
			assert.ok(aFields[10].hierarchy, "Hierarchy is defined for GLAccount_Nodecount");
			assert.strictEqual(aFields[10].hierarchy.type, MetadataAnalyser.hierarchyType.nodeDescendantCountFor);
			assert.strictEqual(aFields[10].hierarchy.field, "GLAccount_NodeID");

			done();
		}.bind(this));
	});

	QUnit.test("getSelectionFields shall return the resolved SelectionFields annotation from ODataMetaModel/entity", function(assert) {
		var aSelectionFieldsAnnotation, oEntity, oResolvedAnnotation;

		aSelectionFieldsAnnotation = [
			{
				PropertyPath: "Supplier"
			}, {
				PropertyPath: "ProductCategory"
			}, {
				PropertyPath: "SomePath"
			}
		];

		oEntity = {
			"name": "Item",
			"key": {
				"propertyRef": [
					{
						"name": "foo"
					}
				]
			},
			"property": [],
			"com.sap.vocabularies.UI.v1.SelectionFields": aSelectionFieldsAnnotation,
			"$path": "/dataServices/schema/0/entityType/1"
		};

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns(oEntity);

		oResolvedAnnotation = this.oMetadataAnalyser.getSelectionFieldsAnnotation("com.sap.foo.Item");

		assert.ok(oResolvedAnnotation && oResolvedAnnotation.selectionFields);
		assert.strictEqual(oResolvedAnnotation.selectionFields.length, 3, "SelectionFields annotation found");
		assert.strictEqual(oResolvedAnnotation.selectionFields[0], "Supplier", "SelectionFields contains Supplier");
		assert.strictEqual(oResolvedAnnotation.selectionFields[1], "ProductCategory", "SelectionFields contains ProductCategory");
		assert.strictEqual(oResolvedAnnotation.selectionFields[2], "SomePath", "SelectionFields contains SomePath");

		delete oEntity["com.sap.vocabularies.UI.v1.SelectionFields"];
		oResolvedAnnotation = this.oMetadataAnalyser.getSelectionFieldsAnnotation("com.sap.foo.Item");
		assert.ok(!oResolvedAnnotation);
	});

	QUnit.test("Checking isSemanticAggregation method", function(assert) {

		var oEntity = {
			"name": "Item",
			"key": {
				"propertyRef": [
					{
						"name": "foo"
					}
				]
			},
			"property": [],
			"$path": "/dataServices/schema/0/entityType/1",
			"sap:semantics": "aggregate"
		};

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns(oEntity);
		var bValue = this.oMetadataAnalyser.isSemanticAggregation("foo");
		assert.ok(bValue);

	});

	QUnit.test("Checking isHiddenFilter method", function(assert) {
		assert.ok(!MetadataAnalyser.isHiddenFilter({}));
		assert.ok(MetadataAnalyser.isHiddenFilter({
			"com.sap.vocabularies.UI.v1.HiddenFilter": {}
		}));
	});

	QUnit.test("Checking isHidden method", function(assert) {
		assert.ok(!MetadataAnalyser.isHidden({}));
		assert.ok(MetadataAnalyser.isHidden({
			"com.sap.vocabularies.UI.v1.Hidden": {}
		}));
		assert.ok(MetadataAnalyser.isHidden({
			"com.sap.vocabularies.UI.v1.Hidden": {
				Bool: "true"
			}
		}));
		assert.ok(!MetadataAnalyser.isHidden({
			"com.sap.vocabularies.UI.v1.Hidden": {
				Bool: "false"
			}
		}));
	});

	QUnit.test("Checking HiddenFilter via _parseProperty", function(assert) {
		var oProperty;

		oProperty = {
			"name": "FixedAsset",
			"type": "Edm.String",
			"sap:label": "Subnumber",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Subnumber"
			},
			"com.sap.vocabularies.UI.v1.HiddenFilter": {},
			"defaultValue": "EUR",
			"com.sap.vocabularies.Common.v1.FilterDefaultValue": {
				String: "USD"
			}
		};

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataProperty.returns(oProperty);
		sinon.stub(this.oMetadataAnalyser, "_getFullyQualifiedNameForField").returns("");

		var oField = this.oMetadataAnalyser._parseProperty(oProperty, {}, "");
		assert.ok(oField);
		assert.ok(oField.hiddenFilter);

		assert.equal(oField.defaultPropertyValue, "EUR");
		assert.equal(oField.defaultFilterValue, "USD");

	});

	QUnit.test("Checking HiddenFilter via _getFilterableAssociations", function(assert) {
		var oProperty, oProperty2;

		oProperty = {
			"name": "FixedAsset",
			"type": "Edm.String",
			"sap:label": "Subnumber",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Subnumber"
			},
			"com.sap.vocabularies.UI.v1.HiddenFilter": {}
		};

		oProperty2 = {
			"name": "FixedAsset2",
			"type": "Edm.String",
			"sap:label": "Subnumber",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Subnumber"
			}
		};

		var oEntityDef = {
			namespace: "ns",
			name: "N2",
			navigationProperty: [
				oProperty, oProperty2
			]
		};

		var oRole = {
			multiplicity: "1",
			type: "ns.N"

		};

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataAssociationEnd.returns(oRole);
		sinon.stub(this.oMetadataAnalyser, "_isFilterable").returns(true);

		var mAssoc = this.oMetadataAnalyser._getFilterableAssociations(oEntityDef, {});
		assert.ok(mAssoc);
		assert.equal(Object.keys(mAssoc).length, 1);
		assert.ok(mAssoc[oProperty2.name]);

	});

	QUnit.test("it should return a boolean and not throw an error if a wrong argument is passed", function(assert) {

		// assert
		assert.strictEqual(MetadataAnalyser.isTermTrue(null), false);
	});

	// BCP 1680351784
	// BCP 1770072944
	QUnit.test("it should return a boolean and not throw an error if a wrong argument is passed", function(assert) {

		// assert
		assert.strictEqual(MetadataAnalyser.isPropertyStringType(null), false);
	});

	QUnit.test("it should return a boolean and not throw an error if a wrong argument is passed", function(assert) {

		// assert
		assert.strictEqual(MetadataAnalyser.isTermTrue(null), false);
	});

	QUnit.test("getSelectionVariants shall return the resolved SelectionVariant annotation from ODataMetaModel/entity", function(assert) {
		var oEntity, aResolvedAnnotation;

		var oSelectionVariantQ1 = {
			"SelectOptions": [],
			"Text": {
				"String": "Select Variant: Q1"
			}
		};

		var oSelectionVariantQ2 = {
			"SelectOptions": [],
			"Text": {
				"String": "Select Variant: Q1"
			}
		};

		var oDefaultSelectionVariant = {
			"SelectOptions": [],
			"Text": {
				"String": "Select Variant: Default"
			}
		};

		oEntity = {
			"name": "Item",
			"key": {
				"propertyRef": [
					{
						"name": "foo"
					}
				]
			},
			"property": [
				{
					"name": "Prop1",
					"type": "Edm.String"
				}
			],
			"com.sap.vocabularies.UI.v1.SelectionVariant#Q1": oSelectionVariantQ1,
			"com.sap.vocabularies.UI.v1.SelectionVariant#Q2": oSelectionVariantQ2,
			"com.sap.vocabularies.UI.v1.SelectionVariant": oDefaultSelectionVariant,
			"$path": "/dataServices/schema/0/entityType/1"
		};

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns(oEntity);

		aResolvedAnnotation = this.oMetadataAnalyser.getSelectionVariantAnnotationList("com.sap.foo.Item");

		assert.ok(aResolvedAnnotation);
		assert.equal(aResolvedAnnotation.length, 3);
		assert.ok(aResolvedAnnotation[0].annotation);
		assert.ok(aResolvedAnnotation[0].qualifier);
		assert.equal(aResolvedAnnotation[0].qualifier, "Q1");
		assert.ok(aResolvedAnnotation[0].annotation.SelectOptions);
		assert.ok(aResolvedAnnotation[0].annotation.Text);
		assert.ok(aResolvedAnnotation[0].annotation.Text.String);
		assert.equal(aResolvedAnnotation[0].annotation.Text.String, oSelectionVariantQ1.Text.String);

		assert.ok(aResolvedAnnotation[2].annotation);
		assert.equal(aResolvedAnnotation[2].qualifier, "");
		assert.ok(aResolvedAnnotation[2].annotation.SelectOptions);
		assert.ok(aResolvedAnnotation[2].annotation.Text);
		assert.ok(aResolvedAnnotation[2].annotation.Text.String);
		assert.equal(aResolvedAnnotation[2].annotation.Text.String, oDefaultSelectionVariant.Text.String);

		delete oEntity["com.sap.vocabularies.UI.v1.SelectionVariant#Q1"];
		delete oEntity["com.sap.vocabularies.UI.v1.SelectionVariant#Q2"];
		delete oEntity["com.sap.vocabularies.UI.v1.SelectionVariant"];
		var mResolvedAnnotation = this.oMetadataAnalyser.getSelectionVariantAnnotationList("com.sap.foo.Item");
		assert.ok(mResolvedAnnotation);
		assert.equal(mResolvedAnnotation.length, 0);
	});

	QUnit.test("check com.sap.vocabularies.UI.v1.FilterFacets annotation", function(assert) {

		var oEntityType = {
			"name": "Item",
			"key": {
				"propertyRef": [
					{
						"name": "foo"
					}
				]
			},
			"property": [
				{
					"name": "Region",
					"type": "Edm.String"
				}
			],
			"com.sap.vocabularies.UI.v1.FieldGroup#Q1": {
				"Label": {
					"String": "Customer"
				},
				"Data": [
					{
						"Value": {
							"Path": "CustomerCountry"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "Industry"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "Region"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}
				],
				"RecordType": "com.sap.vocabularies.UI.v1.FieldGroupType"
			},
			"com.sap.vocabularies.UI.v1.FieldGroup#Q2": {
				"Label": {
					"String": "Customer"
				},
				"Data": [
					{
						"Value": {
							"Path": "CustomerCountry"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}, {
						"Value": {
							"Path": "Industry"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}
				],
				"RecordType": "com.sap.vocabularies.UI.v1.FieldGroupType"
			},
			"com.sap.vocabularies.UI.v1.FieldGroup#Q3": {
				"Label": {
					"String": "Customer"
				},
				"Data": [
					{
						"Value": {
							"Path": "Region"
						},
						"RecordType": "com.sap.vocabularies.UI.v1.DataField",
						"EdmType": "Edm.String"
					}
				],
				"RecordType": "com.sap.vocabularies.UI.v1.FieldGroupType"
			},
			"com.sap.vocabularies.UI.v1.FilterFacets": [
				{
					Label: {
						String: "L1"
					},
					RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
					Target: {
						AnnotationPath: "@UI.FieldGroup#Q1"
					}
				},
				// {
				// Label: { String: "L2"},
				// RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
				// Target: {AnnotationPath: "@UI.FieldGroup#Q2"}
				// },
				{
					// Label: { String: "L3"},
					RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
					Target: {
						AnnotationPath: "@UI.FieldGroup#Q3"
					}
				}
			]
		};

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataEntityType.returns(oEntityType);

		var aResolvedAnnotation = this.oMetadataAnalyser.getFieldGroupsByFilterFacetsAnnotation("com.sap.foo.Item");
		assert.ok(aResolvedAnnotation);
		assert.equal(aResolvedAnnotation.length, 2);
		assert.equal(aResolvedAnnotation[0].groupName, "Q1");
		assert.equal(aResolvedAnnotation[1].groupName, "Q3");

		assert.equal(aResolvedAnnotation[0].groupLabel, "L1");
		assert.equal(aResolvedAnnotation[1].groupLabel, "Customer");

		assert.equal(aResolvedAnnotation[0].fields.length, 3);
		assert.equal(aResolvedAnnotation[1].fields.length, 1);

	});

	QUnit.test("Checking com.sap.vocabularies.Common.v1.FilterDefaultValue annotation", function(assert) {
		var oProperty, oField;

		// String
		oProperty = {
			"name": "FixedAsset",
			"type": "Edm.String",
			"sap:label": "Subnumber",
			"com.sap.vocabularies.Common.v1.Label": {
				"String": "Subnumber"
			},
			"defaultValue": "EUR",
			"com.sap.vocabularies.Common.v1.FilterDefaultValue": {
				String: "USD"
			}
		};

		this.oMetadataAnalyser._oMetaModel = sinon.createStubInstance(ODataMetaModel);
		this.oMetadataAnalyser._oMetaModel.getODataProperty.returns(oProperty);
		sinon.stub(this.oMetadataAnalyser, "_getFullyQualifiedNameForField").returns("");

		oField = this.oMetadataAnalyser._parseProperty(oProperty, {}, "");
		assert.ok(oField);
		assert.equal(oField.defaultPropertyValue, "EUR");
		assert.equal(oField.defaultFilterValue, "USD");

		// Boolean
		oProperty = {
			"name": "myBoolean",
			"type": "Edm.Boolean",
			"sap:label": "Boolean",
			"com.sap.vocabularies.Common.v1.FilterDefaultValue": {
				Bool: "true"
			}
		};

		oField = this.oMetadataAnalyser._parseProperty(oProperty, {}, "");
		assert.ok(oField);
		assert.equal(oField.defaultFilterValue, "true");

		// Date
		oProperty = {
			"name": "myDate",
			"type": "Edm.DateTime",
			"com.sap.vocabularies.Common.v1.FilterDefaultValue": {
				Date: "2018-01-01"
			}
		};

		oField = this.oMetadataAnalyser._parseProperty(oProperty, {}, "");
		assert.ok(oField);
		assert.equal(oField.defaultFilterValue, "2018-01-01");

		// Time
		oProperty = {
			"name": "myTime",
			"type": "Edm.Time",
			"com.sap.vocabularies.Common.v1.FilterDefaultValue": {
				TimeOfDay: "21:45:00"
			}
		};

		oField = this.oMetadataAnalyser._parseProperty(oProperty, {}, "");
		assert.ok(oField);
		assert.equal(oField.defaultFilterValue, "21:45:00");

		// Int
		oProperty = {
			"name": "myInt",
			"type": "Edm.Int32",
			"com.sap.vocabularies.Common.v1.FilterDefaultValue": {
				Int: "1234"
			}
		};

		oField = this.oMetadataAnalyser._parseProperty(oProperty, {}, "");
		assert.ok(oField);
		assert.equal(oField.defaultFilterValue, "1234");

	});

	QUnit.test("checking getAllFilterableFieldsByEntitySetName", function(assert) {

		var oEntityBaseDef = {
			_getFilterableFieldsFromEntityDefinition: function() {
				return [];
			}
		};

		var oSubEntitySetN1 = {
			"sap:semantics": "parameters"
		};
		var oSubEntitySetN2 = {
			"sap:semantics": "parameters"
		};

		var aFields = null;
		this.oMetadataAnalyser._oMetaModel = {
			getODataEntityType: function(s) {
				return {};
			},
			getODataEntitySet: function(s) {
				switch (s) {
					case 'base':
						return {
							entityType: oEntityBaseDef
						};
					case "g1":
						return {
							entityType: oSubEntitySetN1
						};
					case "g2":
						return {
							entityType: oSubEntitySetN2
						};
					default:
						return undefined;
				}
			},
			getODataAssociationSetEnd: function(oObj, s) {
				return {
					entitySet: s
				};
			}
		};

		sinon.stub(this.oMetadataAnalyser, "_getFilterableAssociations").returns({
			"g1": "G1",
			"g2": "G2"
		});
		sinon.stub(this.oMetadataAnalyser, "_getFilterableFieldsFromEntityDefinition").returns({});

		var oStub = sinon.stub(this.oMetadataAnalyser, "_getEntityDefinition");
		oStub.withArgs("G1").returns(oSubEntitySetN1);
		oStub.withArgs("G2").returns(oSubEntitySetN2);
		oStub.withArgs(oEntityBaseDef).returns(oEntityBaseDef);

		aFields = this.oMetadataAnalyser.getAllFilterableFieldsByEntitySetName("base");
		assert.ok(aFields);
		assert.equal(aFields.length, 3);

		aFields = this.oMetadataAnalyser.getAllFilterableFieldsByEntitySetName("base", true);
		assert.ok(aFields);
		assert.equal(aFields.length, 1);

		delete oSubEntitySetN1["sap:semantics"];
		aFields = this.oMetadataAnalyser.getAllFilterableFieldsByEntitySetName("base", true);
		assert.ok(aFields);
		assert.equal(aFields.length, 2);

		delete oSubEntitySetN2["sap:semantics"];
		aFields = this.oMetadataAnalyser.getAllFilterableFieldsByEntitySetName("base", true);
		assert.ok(aFields);
		assert.equal(aFields.length, 3);

	});

	QUnit.test("checking getAllFilterableFieldsByEntitySetName with considerNavProperties", function(assert) {
		var oEntityBaseDef = {
			_getFilterableFieldsFromEntityDefinition: function() {
				return [];
			}
		};

		var oSubEntitySetN1 = {};
		var oSubEntitySetN2 = {};

		var aFields = null;
		this.oMetadataAnalyser._oMetaModel = {
			getODataEntityType: function(s) {
				return {};
			},
			getODataEntitySet: function(s) {
				switch (s) {
					case 'base':
						return {
							entityType: oEntityBaseDef
						};
					case "g1":
						return {
							entityType: oSubEntitySetN1
						};
					case "g2":
						return {
							entityType: oSubEntitySetN2
						};
					default:
						return undefined;
				}
			},
			getODataAssociationSetEnd: function(oObj, s) {
				return {
					entitySet: s
				};
			}
		};

		sinon.stub(this.oMetadataAnalyser, "_getFilterableAssociations").returns({
			"g1": "G1",
			"g2": "G2"
		});
		sinon.stub(this.oMetadataAnalyser, "_getFilterableFieldsFromEntityDefinition").returns({});

		var oStub = sinon.stub(this.oMetadataAnalyser, "_getEntityDefinition");
		oStub.withArgs("G1").returns(oSubEntitySetN1);
		oStub.withArgs("G2").returns(oSubEntitySetN2);
		oStub.withArgs(oEntityBaseDef).returns(oEntityBaseDef);

		aFields = this.oMetadataAnalyser.getAllFilterableFieldsByEntitySetName("base");
		assert.ok(aFields);
		assert.equal(aFields.length, 3);

		aFields = this.oMetadataAnalyser.getAllFilterableFieldsByEntitySetName("base", true, [
			"g1", "g2"
		]);
		assert.ok(aFields);
		assert.equal(aFields.length, 3);

		aFields = this.oMetadataAnalyser.getAllFilterableFieldsByEntitySetName("base", true, [
			"g1"
		]);
		assert.ok(aFields);
		assert.equal(aFields.length, 2);

		aFields = this.oMetadataAnalyser.getAllFilterableFieldsByEntitySetName("base", true, []);
		assert.ok(aFields);
		assert.equal(aFields.length, 1);

		aFields = this.oMetadataAnalyser.getAllFilterableFieldsByEntitySetName("base", true, null);
		assert.ok(aFields);
		assert.equal(aFields.length, 3);

	});

	QUnit.test("Check getParametersByEntitySetName", function(assert) {

		var done = assert.async();

		this.oModel.getMetaModel().loaded().then(function() {
			var oMetadataAnalyser = new MetadataAnalyser(this.oModel);

			var oResult = oMetadataAnalyser.getParametersByEntitySetName("ZEPM_C_SALESORDERITEMQUERYResults");
			assert.ok(oResult);
			assert.equal(oResult.entitySetName, "ZEPM_C_SALESORDERITEMQUERY");
			assert.equal(oResult.navPropertyName, "Results");
			assert.ok(oResult.parameters);
			assert.equal(oResult.parameters.length, 4);
			assert.equal(oResult.parameters[0], "P_KeyDate");
			assert.equal(oResult.parameters[1], "P_DisplayCurrency");
			assert.equal(oResult.parameters[2], "P_Bukrs");
			assert.equal(oResult.parameters[3], "P_Time");

			oMetadataAnalyser.destroy();
			done();
		}.bind(this));
	});

	QUnit.test("Check getSelectionPresentationVariantAnnotationList", function(assert) {

		var done = assert.async();

		this.oModel.getMetaModel().loaded().then(function() {
			var oMetadataAnalyser = new MetadataAnalyser(this.oModel);

			var oResult = oMetadataAnalyser.getSelectionPresentationVariantAnnotationList("ZEPM_C_SALESORDERITEMQUERYResults");
			assert.ok(oResult);
			assert.equal(oResult.length, 1);
			assert.equal(oResult[0].qualifier, "PS1");
			assert.equal(oResult[0].text, "PS1 Text");
			assert.ok(oResult[0].selectionVariant);
			assert.equal(oResult[0].selectionVariant.qualifier, "IDESIndirectLabor");
			assert.ok(oResult[0].selectionVariant.annotation);
			assert.equal(oResult[0].presentationVariant.qualifier, "ActualCosts");
			assert.ok(oResult[0].presentationVariant.annotation);

			oMetadataAnalyser.destroy();
			done();
		}.bind(this));
	});

	QUnit.module("Edm.String - communication and display (term annotations)");

	QUnit.test("it should interpret the com.sap.vocabularies.Common.v1.IsUpperCase OData v4 annotation", function(assert) {

		// arrange
		var oProperty = {
			"type": "Edm.String",
			"com.sap.vocabularies.Common.v1.IsUpperCase": {
				"Bool": "true"
			}
		};

		// assert
		assert.strictEqual(MetadataAnalyser.isUpperCase(oProperty), true);
	});

	QUnit.test("it should interpret the com.sap.vocabularies.Common.v1.IsDigitSequence OData v4 annotation", function(assert) {

		// arrange
		var oProperty = {
			"type": "Edm.String",
			"com.sap.vocabularies.Common.v1.IsDigitSequence": {
				"Bool": "true"
			}
		};

		// assert
		assert.ok(MetadataAnalyser.isDigitSequence(oProperty));

		// arrange 2 - test for Default
		oProperty = {
			"type": "Edm.String",
			"com.sap.vocabularies.Common.v1.IsDigitSequence": {}
		};

		// assert
		assert.ok(MetadataAnalyser.isDigitSequence(oProperty));
	});

	QUnit.test("it should interpret the com.sap.vocabularies.Communication.v1.IsEmailAddress OData v4 annotation", function(assert) {

		// arrange
		var oProperty = {
			"type": "Edm.String",
			"com.sap.vocabularies.Communication.v1.IsEmailAddress": {
				"Bool": "true"
			}
		};

		// assert
		assert.ok(MetadataAnalyser.isEmailAddress(oProperty));
		assert.strictEqual(MetadataAnalyser.getLinkDisplayFormat(oProperty), "EmailAddress");
	});

	QUnit.test("it should interpret the com.sap.vocabularies.Communication.v1.IsPhoneNumber OData v4 annotation", function(assert) {

		// arrange
		var oProperty = {
			"type": "Edm.String",
			"com.sap.vocabularies.Communication.v1.IsPhoneNumber": {
				"Bool": "true"
			}
		};

		// assert
		assert.ok(MetadataAnalyser.isPhoneNumber(oProperty));
		assert.strictEqual(MetadataAnalyser.getLinkDisplayFormat(oProperty), "PhoneNumber");
	});

	QUnit.test("it should interpret the Org.OData.Core.V1.IsUrl OData V4 annotation", function(assert) {

		// arrange
		var oProperty = {
			"type": "Edm.String",
			"Org.OData.Core.V1.IsUrl": {
				"Bool": "true"
			}
		};

		// assert
		assert.ok(MetadataAnalyser.isURL(oProperty));
		assert.strictEqual(MetadataAnalyser.getLinkDisplayFormat(oProperty), "URL");
	});

	// BCP: 1770353842
	QUnit.test("it should interpret the Org.OData.Core.V1.IsURL OData V4 annotation", function(assert) {

		// arrange
		var oProperty = {
			"type": "Edm.String",
			"Org.OData.Core.V1.IsURL": {
				"Bool": "true"
			}
		};

		// assert
		assert.ok(MetadataAnalyser.isURL(oProperty));
		assert.strictEqual(MetadataAnalyser.getLinkDisplayFormat(oProperty), "URL");
	});

	QUnit.module("ValueList");

	QUnit.test("it should interpret the com.sap.vocabularies.Common.v1.ValueListWithFixedValues OData v4 annotation", function(assert) {

		// arrange
		var oProperty = {
			"com.sap.vocabularies.Common.v1.ValueListWithFixedValues": {
				"Bool": "true"
			}
		};

		// assert
		assert.ok(MetadataAnalyser.isValueListWithFixedValues(oProperty));
		assert.strictEqual(MetadataAnalyser.getValueListMode(oProperty), "fixed-values");
	});

	QUnit.test("it should interpret the com.sap.vocabularies.Common.v1.ValueList OData v4 annotation", function(assert) {

		// arrange
		var oProperty = {
			"com.sap.vocabularies.Common.v1.ValueList": {}
		};

		// assert
		assert.ok(MetadataAnalyser.isValueList(oProperty));
	});

	QUnit.module("RecommendationList");
	QUnit.test("isRecommendationList should interpret the 'com.sap.vocabularies.UI.v1.RecommendationList' oData v4 annotation", function (assert) {
		// Arrange
		var oPropertyWithRecommendation = {
				"com.sap.vocabularies.UI.v1.RecommendationList": {}
			},
			oPropertyNoRecommendation = {
			};

		// Assert
		assert.ok(MetadataAnalyser.isRecommendationList(oPropertyWithRecommendation), "should return true if RecommendationList annotation presents");
		assert.ok(!MetadataAnalyser.isRecommendationList(oPropertyNoRecommendation), "should return false if RecommendationList annotation does not presents");
	});

	QUnit.test("_getRecommendationListAnnotation should get the RecommendationList annotation from a property path", function (assert) {
		// Arrange
		var oMetadataAnalyzer = new MetadataAnalyser();
		var sNamespace = "EPM_REF_APPS_PROD_MAN_SRV",
			sEntityTypeName = "Product",
			sFieldName = "CurrencyCode",
			sPropertyPath = sNamespace + "." + sEntityTypeName + "/" + sFieldName, // EPM_REF_APPS_PROD_MAN_SRV.Product/CurrencyCode
			sPropertyBindingPath = "binding/path/to/the/property", // This is the binding path to the property based on the PropertyPath in the entity type
			oEntityTypeStub = { name: "Some Stub EntityType" };

		var oRecommendationListAnnotation = {
			"CollectionPath": {
				"String": "SomeCollection"
			},
			"RankProperty": {
				"String": "SomeRankProperty"
			},
			"Binding": [
				{
					"LocalDataProperty": {
						"PropertyPath": "PropertyPath"
					},
					"RecommendationListProperty": {
						"String": "SomeFieldName"
					}
				}
			]
		};
		var oGetODataEntityTypeStub = this.stub().returns(oEntityTypeStub);
		var oGetODataPropertyStub = this.stub().returns(sPropertyBindingPath);
		var oBindingContextStub = {
			getObject: this.stub().returns({
				"com.sap.vocabularies.UI.v1.RecommendationList": oRecommendationListAnnotation
			})
		};
		var oCreateBindingContext = this.stub().returns(oBindingContextStub);

		oMetadataAnalyzer._oMetaModel = {
			getODataEntityType: oGetODataEntityTypeStub,
			getODataProperty: oGetODataPropertyStub,
			createBindingContext: oCreateBindingContext
		};

		// Act
		var oResult = oMetadataAnalyzer._getRecommendationListAnnotation(sPropertyPath);

		// Assert
		assert.equal(oResult, oRecommendationListAnnotation, "it should gets the annotation from the property path");
		assert.equal(oGetODataEntityTypeStub.args[0][0], sNamespace + "." + sEntityTypeName, "getODataEntityType should be called with full path to the EntityType"); //EPM_REF_APPS_PROD_MAN_SRV.Product
		assert.equal(oGetODataPropertyStub.args[0][0], oEntityTypeStub, "getODataProperty should be called with right entitytype");
		assert.equal(oGetODataPropertyStub.args[0][1], sFieldName, "getODataProperty should be called with right field name");
	});

	QUnit.test("_enrichRecommendationListAnnotation should prepare the RecommendationList annotation in a suitable format", function (assert) {
		// Arrange
		var oResultAnnotation,
			oMetadataAnalyzer = new MetadataAnalyser();
		var sEntitySetName = "RecommendationEntitySetName",
			sRankPropertyName = "RankPropertyName",
			sKeyFieldName = "CURR",
			sSecondColumnFieldName = "DESCR",
			oKeyField = { name: sKeyFieldName },
			oRankField = { name: sRankPropertyName },
			aEntityFields = [{ name: sKeyFieldName }, { name: sSecondColumnFieldName }, oRankField],
			getODataEntitySetStub = this.stub().returns({ name: sEntitySetName });
		var oRecommendationListAnnotation = {
			"CollectionPath": {
				"String": sEntitySetName
			},
			"RankProperty": {
				"String": sRankPropertyName
			},
			"Binding": [
				{
					"LocalDataProperty": {
						"PropertyPath": "PropertyPath"
					},
					"RecommendationListProperty": {
						"String": sKeyFieldName
					}
				}
			]
		};

		oMetadataAnalyzer._oMetaModel = {
			getODataEntitySet: getODataEntitySetStub
		};

		this.stub(oMetadataAnalyzer, "getKeysByEntitySetName").returns([sKeyFieldName]);
		this.stub(oMetadataAnalyzer, "getFieldsByEntitySetName").returns(aEntityFields);

		// Act
		oResultAnnotation = oMetadataAnalyzer._enrichRecommendationListAnnotation(oRecommendationListAnnotation);

		// Assert
		assert.equal(getODataEntitySetStub.callCount, 1, "getODataEntitySet is called once");
		assert.ok(getODataEntitySetStub.calledWith(sEntitySetName), "getODataEntitySet is called with " + sEntitySetName);

		assert.equal(oResultAnnotation.annotation, oRecommendationListAnnotation, "result 'annotation' property should be equal to the original annotation");
		assert.equal(oResultAnnotation.path, sEntitySetName, "result 'path' property should be equal to the CollectionPath");
		assert.equal(oResultAnnotation.entityName, sEntitySetName, "result 'entityName' property should be equal to the CollectionPath");
		assert.equal(oResultAnnotation.rankProperty, sRankPropertyName, "result 'rankProperty' property should be equal to the RankProperty");
		assert.deepEqual(oResultAnnotation.fields, aEntityFields, "result 'fields' property should be equal to the array returned from 'getFieldsByEntitySetName' method");
		assert.deepEqual(oResultAnnotation.keys, [sKeyFieldName], "result 'keys' property should be equal to the array returned from 'getKeysByEntitySetName' method");
		assert.deepEqual(oResultAnnotation.rankField, [{ name: sRankPropertyName }], "result 'rankField' property should be equal to the rankProperty description");
		assert.deepEqual(oResultAnnotation.fieldsToDisplay, [oKeyField, oRankField], "result 'fieldsToDisplay' property should be equal to the binding property and rank field fields");
	});

	QUnit.start();
});
