/* global QUnit, sinon */
(function() {
	"use strict";

	QUnit.config.autostart = false;

	sap.ui.define([
		"sap/ui/comp/providers/TableProvider", "sap/ui/Device", "sap/ui/comp/odata/MetadataAnalyser"
	], function(TableProvider, Device, MetadataAnalyser) {

		QUnit.module("sap.ui.comp.providers.TableProvider", {
			beforeEach: function() {
				this.oTableProvider = new TableProvider({
					entitySet: "foo",
					model: undefined
				});
			},
			afterEach: function() {
				this.oTableProvider.destroy();
			}
		});

		QUnit.test("Shall be instantiable", function(assert) {
			assert.ok(this.oTableProvider);
		});

		QUnit.test("Shall default UTC to true when no dateFormatSettings are passed", function(assert) {
			assert.ok(this.oTableProvider._oDateFormatSettings);
			assert.strictEqual(this.oTableProvider._oDateFormatSettings.UTC, true);
		});

		QUnit.test("Shall contain an instance of metadata analyser", function(assert) {
			assert.ok(this.oTableProvider._oMetadataAnalyser);
			assert.strictEqual(this.oTableProvider._oMetadataAnalyser instanceof MetadataAnalyser, true);
		});

		QUnit.test("Shall enable processing of DataFieldDefault on ControlProvider", function(assert) {
			// DataFieldDefault handing enabled for all tables including AnalyticalTable
			assert.strictEqual(this.oTableProvider._oControlProvider._bProcessDataFieldDefault, true);
		});

		QUnit.test("Shall contain the Metadata for the smart table", function(assert) {
			assert.ok(this.oTableProvider._aTableViewMetadata);
		});

		QUnit.test("Shall return an array of view metadata", function(assert) {
			var aTableViewMetadata = this.oTableProvider.getTableViewMetadata();
			assert.ok(aTableViewMetadata);
		});

		QUnit.test("Shall call metadata analyser API", function(assert) {
			this.oTableProvider._oMetadataAnalyser = sinon.createStubInstance(MetadataAnalyser);
			assert.ok(this.oTableProvider._oMetadataAnalyser.getMultiUnitBehaviorEnabled.notCalled);

			this.oTableProvider.getMultiUnitBehaviorEnabled();

			assert.ok(this.oTableProvider._oMetadataAnalyser.getMultiUnitBehaviorEnabled.calledOnce);
		});

		QUnit.test("_initialiseMetadata shall trigger getSemanticKeyAnnotation on the Metadatanalyser only for ResponsiveTable", function(assert) {
			// Test assuming non-Responsive usecase
			this.oTableProvider._oMetadataAnalyser = sinon.createStubInstance(MetadataAnalyser);
			this.oTableProvider._intialiseMetadata();
			assert.ok(this.oTableProvider._oMetadataAnalyser.getSemanticKeyAnnotation.notCalled);

			// Test assuming Responsive usecase
			this.oTableProvider._isMobileTable = true;

			this.oTableProvider._intialiseMetadata();
			assert.ok(this.oTableProvider._oMetadataAnalyser.getSemanticKeyAnnotation.calledOnce);
		});

		QUnit.test("_initialiseMetadata shall trigger getFieldsByEntitySetName on the Metadatanalyser", function(assert) {
			this.oTableProvider._oMetadataAnalyser = sinon.createStubInstance(MetadataAnalyser);
			this.oTableProvider._intialiseMetadata();
			assert.ok(this.oTableProvider._oMetadataAnalyser.getFieldsByEntitySetName.calledOnce);
		});

		QUnit.test("_initialiseMetadata shall not trigger _addLineItemNavigationFields for AnalyticalTable, as navigationProperty is not supported", function(assert) {
			// Test assuming Analytical usecase
			this.oTableProvider._isAnalyticalTable = true;

			sinon.spy(this.oTableProvider, "_addLineItemNavigationFields");

			this.oTableProvider._oMetadataAnalyser = sinon.createStubInstance(MetadataAnalyser);
			this.oTableProvider._intialiseMetadata();
			assert.ok(this.oTableProvider._addLineItemNavigationFields.notCalled);

			// Re-test assuming non-Analytical usecase
			delete this.oTableProvider._isAnalyticalTable;

			this.oTableProvider._intialiseMetadata();
			assert.ok(this.oTableProvider._addLineItemNavigationFields.calledOnce);
		});

		QUnit.test("_generateArrays shall create an array of hidden and initially visible fields ", function(assert) {
			this.oTableProvider._generateArrays();
			assert.deepEqual(this.oTableProvider._aIgnoredFields, []);
			assert.deepEqual(this.oTableProvider._aInitiallyVisibleFields, []);

			this.oTableProvider._sIgnoredFields = "ID,TechId,foo";
			this.oTableProvider._sInitiallyVisibleFields = "Desc,Code,bar,ColA";
			this.oTableProvider._generateArrays();
			assert.strictEqual(this.oTableProvider._aIgnoredFields.length, 3);
			assert.strictEqual(this.oTableProvider._aInitiallyVisibleFields.length, 4);
			assert.deepEqual(this.oTableProvider._aIgnoredFields, [
				"ID", "TechId", "foo"
			]);
			assert.deepEqual(this.oTableProvider._aInitiallyVisibleFields, [
				"Desc", "Code", "bar", "ColA"
			]);
		});

		QUnit.test("_initialiseMetadata shall create TableViewMetadata(getTableViewMetadata()) by ignoring the fields in _aIgnoredFields", function(assert) {
			var aBackendMetadata = [
				{
					name: "test",
					type: "Edm.String",
					visible: true
				}, {
					name: "foo",
					type: "Edm.String",
					visible: true
				}, {
					name: "ID",
					type: "Edm.String",
					visible: true
				}, {
					name: "test1",
					type: "Edm.String",
					visible: true
				}, {
					name: "test2",
					type: "Edm.String",
					visible: true
				}, {
					name: "test3",
					type: "Edm.String",
					visible: true
				}, {
					name: "test4",
					type: "Edm.String",
					visible: true
				}
			];
			var aResult = null;
			this.oTableProvider._oMetadataAnalyser = sinon.createStubInstance(MetadataAnalyser);
			this.oTableProvider._oMetadataAnalyser.getFieldsByEntitySetName.returns(aBackendMetadata);
			// No fields to ignore
			this.oTableProvider._intialiseMetadata();

			aResult = this.oTableProvider.getTableViewMetadata();

			assert.strictEqual(aResult.length, aBackendMetadata.length);

			this.oTableProvider._aTableViewMetadata = [];

			this.oTableProvider._sIgnoredFields = "ID,TechId,foo";

			this.oTableProvider._intialiseMetadata();
			// ID and foo shall be ignored!
			aResult = this.oTableProvider.getTableViewMetadata();

			// Result shall not contain ignored fields!
			assert.strictEqual(aResult.length, aBackendMetadata.length - 2);
		});

		QUnit.test("_initialiseMetadata shall create TableViewMetadata(getTableViewMetadata()) by ignoring visible=false fields", function(assert) {
			var aBackendMetadata = [
				{
					name: "test",
					type: "Edm.String",
					visible: true
				}, {
					name: "foo",
					type: "Edm.String",
					visible: true
				}, {
					name: "ID",
					type: "Edm.String",
					visible: false
				}, {
					name: "test1",
					type: "Edm.String",
					visible: false
				}, {
					name: "test2",
					type: "Edm.String",
					visible: true
				}, {
					name: "test3",
					type: "Edm.String",
					visible: true
				}, {
					name: "test4",
					type: "Edm.String",
					visible: true
				}
			];
			var aResult = null;
			this.oTableProvider._oMetadataAnalyser = sinon.createStubInstance(MetadataAnalyser);
			this.oTableProvider._oMetadataAnalyser.getFieldsByEntitySetName.returns(aBackendMetadata);

			this.oTableProvider._intialiseMetadata();
			// ID and test1 shall be ignored as they are visible=false!
			aResult = this.oTableProvider.getTableViewMetadata();

			// Result shall not contain visible=false fields!
			assert.strictEqual(aResult.length, aBackendMetadata.length - 2);

			// visible=false along with ignord fields
			this.oTableProvider._aTableViewMetadata = [];

			this.oTableProvider._sIgnoredFields = "TechId,foo";

			this.oTableProvider._intialiseMetadata();
			// ID and test1 shall be ignored as they are visible=false!
			// And foo shall be ignored as it is in the ignored list!
			aResult = this.oTableProvider.getTableViewMetadata();

			// Result shall not contain ignored fields!
			assert.strictEqual(aResult.length, aBackendMetadata.length - 3);
		});

		QUnit.test("_initialiseMetadata shall consider LineItem annotation and mark some fields as initially visible", function(assert) {
			var aBackendMetadata = [
				{
					name: "test",
					type: "Edm.String",
					visible: true
				}, {
					name: "foo",
					type: "Edm.String",
					visible: true
				}, {
					name: "ID",
					type: "Edm.String",
					visible: true
				}, {
					name: "test1",
					type: "Edm.String",
					visible: true
				}, {
					name: "test2",
					type: "Edm.String",
					visible: true
				}, {
					name: "test3",
					type: "Edm.String",
					visible: true
				}, {
					name: "test4",
					type: "Edm.String",
					visible: true
				}
			];
			var oLineItemAnnotation = {
				fields: [
					"test", "test2", "test3", "foo"
				],
				importance: {
					test: "High",
					test2: "Medium"
				}
			};
			var aResult = null;

			this.oTableProvider._oMetadataAnalyser = sinon.createStubInstance(MetadataAnalyser);
			this.oTableProvider._oMetadataAnalyser.getFieldsByEntitySetName.returns(aBackendMetadata);
			this.oTableProvider._oMetadataAnalyser.getLineItemAnnotation.returns(oLineItemAnnotation);

			// No fields to ignore
			this.oTableProvider._intialiseMetadata();

			aResult = this.oTableProvider.getTableViewMetadata();

			assert.strictEqual(aResult.length, aBackendMetadata.length);
			assert.strictEqual(aResult[0].name, "test");
			assert.strictEqual(aResult[0].isInitiallyVisible, true);
			assert.strictEqual(aResult[0].inResult, undefined, "inResult != true, since no PresentationVariant annotation exists");
			assert.strictEqual(aResult[1].name, "test2");
			assert.strictEqual(aResult[1].isInitiallyVisible, Device.system.desktop || Device.system.tablet); // only true on desktop or tablet
			// device
			assert.strictEqual(aResult[1].inResult, undefined, "inResult != true, since no PresentationVariant annotation exists");
			assert.strictEqual(aResult[2].name, "test3");
			assert.strictEqual(aResult[2].isInitiallyVisible, true);
			assert.strictEqual(aResult[3].name, "foo");
			assert.strictEqual(aResult[3].isInitiallyVisible, true);
			assert.strictEqual(aResult[4].name, "ID");
			assert.strictEqual(aResult[4].isInitiallyVisible, false);
			assert.strictEqual(aResult[5].name, "test1");
			assert.strictEqual(aResult[5].isInitiallyVisible, false);
			assert.strictEqual(aResult[6].name, "test4");
			assert.strictEqual(aResult[6].isInitiallyVisible, false);

			this.oTableProvider._aTableViewMetadata = [];
			this.oTableProvider._sIgnoredFields = "ID,TechId,foo";

			this.oTableProvider._intialiseMetadata();
			// ID and foo shall be ignored!
			aResult = this.oTableProvider.getTableViewMetadata();

			// Result shall not contain ignored fields!
			assert.strictEqual(aResult.length, aBackendMetadata.length - 2);
			assert.strictEqual(aResult[0].name, "test");
			assert.strictEqual(aResult[0].isInitiallyVisible, true);
			assert.strictEqual(aResult[0].inResult, undefined, "inResult != true, since no PresentationVariant annotation exists");
			assert.strictEqual(aResult[1].name, "test2");
			assert.strictEqual(aResult[1].isInitiallyVisible, Device.system.desktop || Device.system.tablet); // only true on desktop or tablet
			// device
			assert.strictEqual(aResult[2].name, "test3");
			assert.strictEqual(aResult[2].isInitiallyVisible, true);
			assert.strictEqual(aResult[3].name, "test1");
			assert.strictEqual(aResult[3].isInitiallyVisible, false);
			assert.strictEqual(aResult[4].name, "test4");
			assert.strictEqual(aResult[4].isInitiallyVisible, false);

			// simulating tablet, only importance high fields shall be visible
			Device.system.desktop = false;
			Device.system.tablet = true;
			Device.system.phone = false;
			this.oTableProvider._intialiseMetadata();
			aResult = this.oTableProvider.getTableViewMetadata();

			assert.strictEqual(aResult[0].name, "test");
			assert.strictEqual(aResult[0].isInitiallyVisible, true, "visible because of high importance");
			assert.strictEqual(aResult[0].inResult, undefined, "inResult != true, since no PresentationVariant annotation exists");
			assert.strictEqual(aResult[1].name, "test2");
			assert.strictEqual(aResult[1].isInitiallyVisible, true, "visible because of medium importance");
			assert.strictEqual(aResult[2].name, "test3");
			assert.strictEqual(aResult[2].isInitiallyVisible, true, "visible because of default importance set to high");
			assert.strictEqual(aResult[3].name, "test1");
			assert.strictEqual(aResult[3].isInitiallyVisible, false);
			assert.strictEqual(aResult[4].name, "test4");
			assert.strictEqual(aResult[4].isInitiallyVisible, false);

			// simulating phone, only importance high fields shall be visible
			Device.system.desktop = false;
			Device.system.tablet = false;
			Device.system.phone = true;
			this.oTableProvider._intialiseMetadata();
			aResult = this.oTableProvider.getTableViewMetadata();

			assert.strictEqual(aResult[0].name, "test");
			assert.strictEqual(aResult[0].isInitiallyVisible, true, "visible because of high importance");
			assert.strictEqual(aResult[0].inResult, undefined, "inResult != true, since no PresentationVariant annotation exists");
			assert.strictEqual(aResult[1].name, "test2");
			assert.strictEqual(aResult[1].isInitiallyVisible, false, "not visible because of medium importance on phone not sufficient");
			assert.strictEqual(aResult[2].name, "test3");
			assert.strictEqual(aResult[2].isInitiallyVisible, true, "visible because of default importance set to high");
			assert.strictEqual(aResult[3].name, "test1");
			assert.strictEqual(aResult[3].isInitiallyVisible, false);
			assert.strictEqual(aResult[4].name, "test4");
			assert.strictEqual(aResult[4].isInitiallyVisible, false);

			Device.system.desktop = true;
			Device.system.tablet = false;
			Device.system.phone = false;
		});

		QUnit.test("_initialiseMetadata shall first consider PresentationVariant annotation and it's LineItem annotation to mark some fields as initially visible (test for Analytical usecase)", function(assert) {
			var aBackendMetadata = [
				{
					name: "test",
					type: "Edm.String",
					visible: true
				}, {
					name: "foo",
					type: "Edm.String",
					visible: true
				}, {
					name: "ID",
					type: "Edm.String",
					visible: true
				}, {
					name: "test1",
					type: "Edm.String",
					visible: true
				}, {
					name: "test2",
					type: "Edm.String",
					visible: true
				}, {
					name: "test3",
					type: "Edm.String",
					visible: true
				}, {
					name: "test4",
					type: "Edm.String",
					visible: true
				}
			];
			var oLineItemAnnotation = {
				fields: [
					"test", "test2", "test3", "foo"
				],
				importance: {
					test: "High",
					test2: "Medium"
				}
			};
			var aResult = null;

			this.oTableProvider._oMetadataAnalyser = sinon.createStubInstance(MetadataAnalyser);
			this.oTableProvider._oMetadataAnalyser.getFieldsByEntitySetName.returns(aBackendMetadata);
			this.oTableProvider._oMetadataAnalyser.getPresentationVariantAnnotation.returns({
				lineItemAnnotation: oLineItemAnnotation,
				requestAtLeastFields: [
					"ID", "foo"
				],
				sortOrderFields: [
					{
						"name": "ID",
						"descending": false
					}, {
						"name": "foo",
						"descending": true
					}
				],
				groupByFields: [
					"test", "test2"
				]
			});

			// Test assuming Analytical usecase
			this.oTableProvider._isAnalyticalTable = true;

			// No fields to ignore
			this.oTableProvider._intialiseMetadata();

			aResult = this.oTableProvider.getTableViewMetadata();

			// Description/Text handing enabled for all tables including AnalyticalTable
			assert.strictEqual(this.oTableProvider._oControlProvider._bEnableDescriptions, true);

			assert.strictEqual(this.oTableProvider._oLineItemAnnotation, oLineItemAnnotation);

			assert.strictEqual(aResult.length, aBackendMetadata.length);
			assert.strictEqual(aResult[0].name, "test");
			assert.strictEqual(aResult[0].isInitiallyVisible, true);
			assert.strictEqual(aResult[0].sorted, undefined);
			assert.strictEqual(aResult[0].grouped, true, "grouped as per GroupBy");
			assert.strictEqual(aResult[1].name, "test2");
			assert.strictEqual(aResult[1].isInitiallyVisible, true);
			assert.strictEqual(aResult[1].inResult, undefined, "inResult != true, since not part of RequestAtLeastFields");
			assert.strictEqual(aResult[1].sorted, undefined);
			assert.strictEqual(aResult[1].grouped, true, "grouped as per GroupBy");
			assert.strictEqual(aResult[2].name, "test3");
			assert.strictEqual(aResult[2].isInitiallyVisible, true);
			assert.strictEqual(aResult[3].name, "foo");
			assert.strictEqual(aResult[3].isInitiallyVisible, true);
			assert.strictEqual(aResult[3].sorted, true, "sorted as per SortOrder");
			assert.strictEqual(aResult[3].sortOrder, "Descending");
			assert.strictEqual(aResult[3].inResult, true, "inResult = true, since part of RequestAtLeastFields");
			assert.strictEqual(aResult[3].grouped, undefined);
			assert.strictEqual(aResult[4].name, "ID");
			assert.strictEqual(aResult[4].isInitiallyVisible, false);
			assert.strictEqual(aResult[4].sorted, true, "sorted as per SortOrder");
			assert.strictEqual(aResult[4].sortOrder, "Ascending");
			assert.strictEqual(aResult[4].inResult, true, "inResult = true, since part of RequestAtLeastFields");
			assert.strictEqual(aResult[4].grouped, undefined);
			assert.strictEqual(aResult[5].name, "test1");
			assert.strictEqual(aResult[5].isInitiallyVisible, false);
			assert.strictEqual(aResult[5].grouped, undefined);
			assert.strictEqual(aResult[6].name, "test4");
			assert.strictEqual(aResult[6].isInitiallyVisible, false);
			assert.strictEqual(aResult[6].grouped, undefined);

			this.oTableProvider._aTableViewMetadata = [];
			this.oTableProvider._sIgnoredFields = "ID,TechId,foo";

			this.oTableProvider._intialiseMetadata();
			// ID and foo shall be ignored!
			aResult = this.oTableProvider.getTableViewMetadata();

			// Result shall not contain ignored fields!
			assert.strictEqual(aResult.length, aBackendMetadata.length - 2);
			assert.strictEqual(aResult[0].name, "test");
			assert.strictEqual(aResult[0].isInitiallyVisible, true);
			assert.strictEqual(aResult[1].name, "test2");
			assert.strictEqual(aResult[1].isInitiallyVisible, true);
			assert.strictEqual(aResult[1].inResult, undefined, "inResult != true, since not part of RequestAtLeastFields");
			assert.strictEqual(aResult[2].name, "test3");
			assert.strictEqual(aResult[2].isInitiallyVisible, true);
			assert.strictEqual(aResult[3].name, "test1");
			assert.strictEqual(aResult[3].isInitiallyVisible, false);
			assert.strictEqual(aResult[4].name, "test4");
			assert.strictEqual(aResult[4].isInitiallyVisible, false);

			// simulating tablet, only importance high fields shall be visible
			Device.system.desktop = false;
			Device.system.tablet = true;
			Device.system.phone = false;
			this.oTableProvider._intialiseMetadata();
			aResult = this.oTableProvider.getTableViewMetadata();

			assert.strictEqual(aResult[0].name, "test");
			assert.strictEqual(aResult[0].isInitiallyVisible, true, "visible because of high importance");
			assert.strictEqual(aResult[1].name, "test2");
			assert.strictEqual(aResult[1].isInitiallyVisible, true, "visible because of medium importance");
			assert.strictEqual(aResult[1].inResult, undefined, "inResult != true, since not part of RequestAtLeastFields");
			assert.strictEqual(aResult[2].name, "test3");
			assert.strictEqual(aResult[2].isInitiallyVisible, true, "visible because of default importance set to high");
			assert.strictEqual(aResult[3].name, "test1");
			assert.strictEqual(aResult[3].isInitiallyVisible, false);
			assert.strictEqual(aResult[4].name, "test4");
			assert.strictEqual(aResult[4].isInitiallyVisible, false);

			// simulating phone, only importance high fields shall be visible
			Device.system.desktop = false;
			Device.system.tablet = false;
			Device.system.phone = true;
			this.oTableProvider._intialiseMetadata();
			aResult = this.oTableProvider.getTableViewMetadata();

			assert.strictEqual(aResult[0].name, "test");
			assert.strictEqual(aResult[0].isInitiallyVisible, true, "visible because of high importance");
			assert.strictEqual(aResult[1].name, "test2");
			assert.strictEqual(aResult[1].isInitiallyVisible, false, "not visible because of medium importance on phone not sufficient");
			assert.strictEqual(aResult[1].inResult, undefined, "inResult != true, since not part of RequestAtLeastFields");
			assert.strictEqual(aResult[2].name, "test3");
			assert.strictEqual(aResult[2].isInitiallyVisible, true, "visible because of default importance set to high");
			assert.strictEqual(aResult[3].name, "test1");
			assert.strictEqual(aResult[3].isInitiallyVisible, false);
			assert.strictEqual(aResult[4].name, "test4");
			assert.strictEqual(aResult[4].isInitiallyVisible, false);

			Device.system.desktop = true;
			Device.system.tablet = false;
			Device.system.phone = false;
		});

		QUnit.test("_initialiseMetadata shall create TableViewMetadata(getTableViewMetadata()) by considering Dimensions of Text fields", function(assert) {
			var aBackendMetadata = [
				{
					name: "test",
					type: "Edm.String",
					aggregationRole: "dimension",
					visible: true
				}, {
					name: "foo",
					type: "Edm.String",
					aggregationRole: "dimension",
					visible: true
				}, {
					name: "ID",
					type: "Edm.String",
					description: "desc",
					aggregationRole: "dimension",
					visible: true
				}, {
					name: "desc",
					type: "Edm.String",
					visible: true
				}, {
					name: "Category",
					type: "Edm.String",
					description: "CategoryName",
					aggregationRole: "dimension",
					visible: true
				}, {
					name: "CategoryName",
					type: "Edm.String",
					visible: true
				}, {
					name: "Customer",
					type: "Edm.String",
					description: "CustomerName",
					aggregationRole: "dimension",
					visible: true
				}, {
					name: "CustomerName",
					aggregationRole: "dimension",
					type: "Edm.String",
					visible: true
				}, {
					name: "QuantityUnit",
					type: "Edm.String",
					description: "UnitName",
					aggregationRole: "measure",
					visible: true
				}, {
					name: "UnitName",
					type: "Edm.String",
					visible: true
				}, {
					name: "SomeId",
					type: "Edm.String",
					description: "Somedesc",
					visible: true
				}, {
					name: "Somedesc",
					type: "Edm.String",
					visible: true
				}, {
					name: "test2",
					type: "Edm.String",
					aggregationRole: "measure",
					visible: true
				}, {
					name: "test3",
					type: "Edm.String",
					aggregationRole: "measure",
					visible: true
				}, {
					name: "test4",
					type: "Edm.String",
					aggregationRole: "dimension",
					visible: true
				}
			];
			var aResult = null;
			this.oTableProvider._oMetadataAnalyser = sinon.createStubInstance(MetadataAnalyser);
			// Test assuming Analytical usecase
			this.oTableProvider._isAnalyticalTable = true;

			this.oTableProvider._oMetadataAnalyser.getFieldsByEntitySetName.returns(aBackendMetadata);
			// No fields to ignore
			this.oTableProvider._intialiseMetadata();

			aResult = this.oTableProvider.getTableViewMetadata();

			assert.strictEqual(aResult.length, aBackendMetadata.length);
			assert.strictEqual(aResult[3].name, "desc");
			assert.strictEqual(aResult[3].additionalProperty, "ID");
			assert.strictEqual(aResult[5].name, "CategoryName");
			assert.strictEqual(aResult[5].additionalProperty, "Category");
			assert.strictEqual(aResult[7].name, "CustomerName");
			assert.strictEqual(aResult[7].additionalProperty, undefined);
			assert.strictEqual(aResult[9].name, "UnitName");
			assert.strictEqual(aResult[9].additionalProperty, undefined);
			assert.strictEqual(aResult[11].name, "Somedesc");
			assert.strictEqual(aResult[11].additionalProperty, undefined);

			// Reset conditions
			this.oTableProvider._aTableViewMetadata = [];
			this.oTableProvider._mDimensionFromText = null;

			this.oTableProvider._sIgnoredFields = "ID,TechId,foo";

			this.oTableProvider._intialiseMetadata();
			// ID and foo shall be ignored!
			aResult = this.oTableProvider.getTableViewMetadata();

			// Result shall not contain ignored fields!
			assert.strictEqual(aResult.length, aBackendMetadata.length - 2);
			assert.strictEqual(aResult[1].name, "desc");
			assert.strictEqual(aResult[1].additionalProperty, undefined);
			assert.strictEqual(aResult[3].name, "CategoryName");
			assert.strictEqual(aResult[3].additionalProperty, "Category");
			assert.strictEqual(aResult[5].name, "CustomerName");
			assert.strictEqual(aResult[5].additionalProperty, undefined);
			assert.strictEqual(aResult[7].name, "UnitName");
			assert.strictEqual(aResult[7].additionalProperty, undefined);
			assert.strictEqual(aResult[9].name, "Somedesc");
			assert.strictEqual(aResult[9].additionalProperty, undefined);
		});

		QUnit.test("_initialiseMetadata shall create TableViewMetadata(getTableViewMetadata()) by considering Width of Text fields", function(assert) {
			var iMaxLength = 4;
			var iPrecision = 10;
			var aBackendMetadata = [
				{
					name: "DescId",
					type: "Edm.String",
					maxLength: iMaxLength,
					displayBehaviour: "descriptionAndId",
					description: "desc",
					visible: true
				}, {
					name: "desc",
					type: "Edm.String",
					visible: true
				}, {
					name: "DescOnly",
					type: "Edm.String",
					maxLength: iMaxLength,
					displayBehaviour: "descriptionOnly",
					description: "Somedesc",
					visible: true
				}, {
					name: "Somedesc",
					type: "Edm.String",
					visible: true
				}, {
					name: "IdDesc",
					type: "Edm.String",
					maxLength: iMaxLength,
					displayBehaviour: "idAndDescription",
					description: "Somedesc2",
					visible: true
				}, {
					name: "Somedesc2",
					type: "Edm.String",
					visible: true
				}, {
					name: "IdOnly",
					type: "Edm.String",
					maxLength: iMaxLength,
					displayBehaviour: "idOnly",
					description: "notusedDesc",
					visible: true
				}, {
					name: "notusedDesc",
					type: "Edm.String",
					visible: true
				}, {
					name: "SomeDecimalField",
					type: "Edm.Decimal",
					precision: iPrecision,
					description: "notusedDesc",
					scale: 2,
					visible: true
				}
			];
			var aResult = null;
			this.oTableProvider._oMetadataAnalyser = sinon.createStubInstance(MetadataAnalyser);

			this.oTableProvider._oMetadataAnalyser.getFieldsByEntitySetName.returns(aBackendMetadata);
			// No fields to ignore
			this.oTableProvider._intialiseMetadata();

			aResult = this.oTableProvider.getTableViewMetadata();

			assert.strictEqual(aResult.length, aBackendMetadata.length);
			assert.strictEqual(aResult[0].name, "DescId");
			assert.strictEqual(aResult[0].additionalProperty, "desc");
			assert.strictEqual(aResult[0].width, "30em", "Max width used for description first");
			assert.strictEqual(aResult[2].name, "DescOnly");
			assert.strictEqual(aResult[2].additionalProperty, "Somedesc");
			assert.strictEqual(aResult[2].width, "30em", "Max width used for description only");
			assert.strictEqual(aResult[4].name, "IdDesc");
			assert.strictEqual(aResult[4].additionalProperty, "Somedesc2");
			assert.strictEqual(aResult[4].width, iMaxLength + 0.75 + "em", "Width used based on metadata + padding");
			assert.strictEqual(aResult[6].name, "IdOnly");
			assert.strictEqual(aResult[6].additionalProperty, "notusedDesc");
			assert.strictEqual(aResult[6].width, iMaxLength + 0.75 + "em", "Width used based on metadata + padding");
			assert.strictEqual(aResult[8].name, "SomeDecimalField");
			assert.strictEqual(aResult[8].additionalProperty, "notusedDesc");
			assert.strictEqual(aResult[8].width, iPrecision + 0.75 + "em", "Width used based on metadata + padding");
		});

		QUnit.test("Destroy", function(assert) {
			assert.equal(this.oTableProvider.bIsDestroyed, undefined);
			this.oTableProvider.destroy();
			assert.equal(this.oTableProvider._oMetadataAnalyser, null);
			assert.equal(this.oTableProvider._aTableViewMetadata, null);
			assert.strictEqual(this.oTableProvider.bIsDestroyed, true);
		});

		QUnit.start();
	});

})();
