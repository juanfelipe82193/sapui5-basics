/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/apf/ui/utils/representationTypesHandler",
	"sap/apf/modeler/ui/utils/labelForRepresentationTypes",
	"sap/apf/modeler/ui/utils/constants"
], function(RepresentationTypesHandler, LabelForRepresentationTypes, constants){
	'use strict';
	var oPropertyTypes = constants.propertyTypes;
	QUnit.module("RepresentationTypesHandler API's ", {
		beforeEach : function(assert) {
			this.oRepresentationTypesHandler = new RepresentationTypesHandler();
		}
	});
	QUnit.test('When initialization', function(assert) {
		assert.ok(this.oRepresentationTypesHandler, 'then object exists');
	});
	QUnit.test('When fetching label for a representation type for a given kind', function(assert) {
		// arrange
		var sRepresentationType = "BarChart", sKind = sap.apf.core.constants.representationMetadata.kind.YAXIS;
		var spyOnGetLabelsForChartType;
		function oTextReader() {
			return;
		}
		spyOnGetLabelsForChartType = sinon.spy(LabelForRepresentationTypes.prototype, "getLabelsForChartType");
		// act
		this.oRepresentationTypesHandler.getLabelsForChartType(oTextReader, sRepresentationType, sKind);
		// assert
		assert.strictEqual(spyOnGetLabelsForChartType.calledOnce, true, "labels fetched from LabelForRepresentationTypes");
		assert.strictEqual(spyOnGetLabelsForChartType.calledWith(sRepresentationType, sKind), true, "then label is fetched with correct parameters");
		// cleanup
		spyOnGetLabelsForChartType.restore();
	});
	QUnit.test('When searching for a representation type', function(assert) {
		// arrange
		var sRepresentationType = "BarChart";
		var expectedResult = 1;
		// act
		var nIndex = this.oRepresentationTypesHandler.indexOfRepresentationType(sRepresentationType);
		// assert
		assert.strictEqual(expectedResult, nIndex, " then representationType is found at the appropriate index");
	});
	QUnit.test('When searching for a representation type', function(assert) {
		// arrange
		var sRepresentationType = "Hugo";
		var expectedResult = -1;
		// act
		var nIndex = this.oRepresentationTypesHandler.indexOfRepresentationType(sRepresentationType);
		// assert
		assert.strictEqual(expectedResult, nIndex, " then representationType is not found");
	});
	QUnit.test('When searching for a picture for a representation type', function(assert) {
		// arrange
		var sRepresentationType = "BarChart";
		var expectedResult = "sap-icon://horizontal-bar-chart";
		// act
		var oPicture = this.oRepresentationTypesHandler.getPictureOfRepresentationType(sRepresentationType);
		// assert
		assert.strictEqual(expectedResult, oPicture, " then correct picture is found for the representation type");
	});
	QUnit.test('When searching for a picture for a non present representation type', function(assert) {
		// arrange
		var sRepresentationType = "Hugo";
		var expectedResult = null;
		// act
		var oPicture = this.oRepresentationTypesHandler.getPictureOfRepresentationType(sRepresentationType);
		// assert
		assert.strictEqual(expectedResult, oPicture, " then no picture is found for the representation type");
	});
	QUnit.test('When searching for a constructor for a representation type', function(assert) {
		// arrange
		var sRepresentationType = "BarChart";
		var expectedResult = "sap.apf.ui.representations.barChart";
		// act
		var oConstructor = this.oRepresentationTypesHandler.getConstructorOfRepresentationType(sRepresentationType);
		// assert
		assert.strictEqual(expectedResult, oConstructor, " then correct constructor is found for the representation type");
	});
	QUnit.test('When searching for a constructor for a non present representation type', function(assert) {
		// arrange
		var sRepresentationType = "Hugo";
		var expectedResult = null;
		// act
		var oPicture = this.oRepresentationTypesHandler.getConstructorOfRepresentationType(sRepresentationType);
		// assert
		assert.strictEqual(expectedResult, oPicture, " then no constructor is found for the representation type");
	});
	QUnit.test('When retrieving kinds of representation type for dimensions property type', function(assert) {
		// arrange
		var sRepresentationType = "BarChart";
		var expectedResult = [ sap.apf.core.constants.representationMetadata.kind.XAXIS ];
		// act
		var aSupportedKinds = this.oRepresentationTypesHandler.getKindsForDimensionPropertyType(sRepresentationType);
		// assert
		assert.deepEqual(expectedResult, aSupportedKinds, " then correct supported kinds are fetched for the representation type");
	});
	QUnit.test('When retrieving kinds of an invalid representation type for dimensions property type', function(assert) {
		// arrange
		var sRepresentationType = "Hugo";
		var expectedResult = [];
		// act
		var aSupportedKinds = this.oRepresentationTypesHandler.getKindsForDimensionPropertyType(sRepresentationType);
		// assert
		assert.deepEqual(expectedResult, aSupportedKinds, " then no supported kinds are fetched for the representation type");
	});
	QUnit.test('When retrieving kinds of representation type for legends property type', function(assert) {
		// arrange
		var sRepresentationType = "BarChart";
		var expectedResult = [ sap.apf.core.constants.representationMetadata.kind.LEGEND ];
		// act
		var aSupportedKinds = this.oRepresentationTypesHandler.getKindsForLegendPropertyType(sRepresentationType);
		// assert
		assert.deepEqual(expectedResult, aSupportedKinds, " then correct supported kinds are fetched for the representation type");
	});
	QUnit.test('When retrieving kinds of an invalid representation type for legends property type', function(assert) {
		// arrange
		var sRepresentationType = "Hugo";
		var expectedResult = [];
		// act
		var aSupportedKinds = this.oRepresentationTypesHandler.getKindsForLegendPropertyType(sRepresentationType);
		// assert
		assert.deepEqual(expectedResult, aSupportedKinds, " then no supported kinds are fetched for the representation type");
	});
	QUnit.test('When retrieving kinds of representation type for measures property type', function(assert) {
		// arrange
		var sRepresentationType = "BarChart";
		var expectedResult = [ sap.apf.core.constants.representationMetadata.kind.YAXIS ];
		// act
		var aSupportedKinds = this.oRepresentationTypesHandler.getKindsForMeasurePropertyType(sRepresentationType);
		// assert
		assert.deepEqual(expectedResult, aSupportedKinds, " then correct supported kinds are fetched for the representation type");
	});
	QUnit.test('When retrieving kinds of an invalid representation type for measures property type', function(assert) {
		// arrange
		var sRepresentationType = "Hugo";
		var expectedResult = [];
		// act
		var aSupportedKinds = this.oRepresentationTypesHandler.getKindsForMeasurePropertyType(sRepresentationType);
		// assert
		assert.deepEqual(expectedResult, aSupportedKinds, " then no supported kinds are fetched for the representation type");
	});
	QUnit.test('When retrieving kinds of an invalid(existing) representation type for property property type', function(assert) {
		// arrange
		var sRepresentationType = "BarChart";
		var expectedResult = [];
		// act
		var aSupportedKinds = this.oRepresentationTypesHandler.getKindsForPropertyType(sRepresentationType);
		// assert
		assert.deepEqual(expectedResult, aSupportedKinds, " then no supported kinds are fetched for the representation type");
	});
	QUnit.test('When retrieving kinds of an invalid(non existing) representation type for property property type', function(assert) {
		// arrange
		var sRepresentationType = "Hugo";
		var expectedResult = [];
		// act
		var aSupportedKinds = this.oRepresentationTypesHandler.getKindsForPropertyType(sRepresentationType);
		// assert
		assert.deepEqual(expectedResult, aSupportedKinds, " then no supported kinds are fetched for the representation type");
	});
	QUnit.test('When retrieving kinds of a representation type for property property type', function(assert) {
		// arrange
		var sRepresentationType = "TableRepresentation";
		var expectedResult = [ sap.apf.core.constants.representationMetadata.kind.COLUMN ];
		// act
		var aSupportedKinds = this.oRepresentationTypesHandler.getKindsForPropertyType(sRepresentationType);
		// assert
		assert.deepEqual(expectedResult, aSupportedKinds, " then correct supported kinds are fetched for the representation type");
	});
	QUnit.test('When checking whether 2 chart types are similar', function(assert) {
		// arrange
		var sFirstRepresentationType = "BarChart", sSecondRepresentationType = "LineChart";
		var expectedResult = true;
		// act
		var bIsChartTypeSimilar = this.oRepresentationTypesHandler.isChartTypeSimilar(sFirstRepresentationType, sSecondRepresentationType);
		// assert
		assert.strictEqual(expectedResult, bIsChartTypeSimilar, " then chart types are similar");
	});
	QUnit.test('When checking whether 2 chart types are not similar', function(assert) {
		// arrange
		var sFirstRepresentationType = "BarChart", sSecondRepresentationType = "ScatterPlotChart";
		var expectedResult = false;
		// act
		var bIsChartTypeSimilar = this.oRepresentationTypesHandler.isChartTypeSimilar(sFirstRepresentationType, sSecondRepresentationType);
		// assert
		assert.strictEqual(expectedResult, bIsChartTypeSimilar, " then chart types are not similar");
	});
	QUnit.test('When checking whether addition is enabled for dimension property type for a valid representation type and a valid kind', function(assert) {
		// arrange
		var sRepresentationType = "BarChart", sPropertyType = oPropertyTypes.DIMENSION, sKind = sap.apf.core.constants.representationMetadata.kind.XAXIS;
		var expectedResult = true;
		// act
		var bIsAdditionEnabled = this.oRepresentationTypesHandler.isAdditionToBeEnabled(sRepresentationType, sPropertyType, sKind);
		// assert
		assert.strictEqual(expectedResult, bIsAdditionEnabled, " then addition is enabled");
	});
	QUnit.test('When checking whether addition is enabled for dimension property type for an invalid representation type', function(assert) {
		// arrange
		var sRepresentationType = "Hugo", sPropertyType = oPropertyTypes.DIMENSION, sKind = sap.apf.core.constants.representationMetadata.kind.XAXIS;
		var expectedResult = false;
		// act
		var bIsAdditionEnabled = this.oRepresentationTypesHandler.isAdditionToBeEnabled(sRepresentationType, sPropertyType, sKind);
		// assert
		assert.strictEqual(expectedResult, bIsAdditionEnabled, " then addition is disabled");
	});
	QUnit.test('When checking whether addition is enabled for dimension property type for an valid representation type and an invalid kind', function(assert) {
		// arrange
		var sRepresentationType = "BarChart", sPropertyType = oPropertyTypes.DIMENSION, sKind = "XYAXIS";
		var expectedResult = false;
		// act
		var bIsAdditionEnabled = this.oRepresentationTypesHandler.isAdditionToBeEnabled(sRepresentationType, sPropertyType, sKind);
		// assert
		assert.strictEqual(expectedResult, bIsAdditionEnabled, " then addition is disabled");
	});
	QUnit.test('When checking whether addition is enabled for legend property type for a valid representation type and a valid kind', function(assert) {
		// arrange
		var sRepresentationType = "BarChart", sPropertyType = oPropertyTypes.LEGEND, sKind = sap.apf.core.constants.representationMetadata.kind.LEGEND;
		var expectedResult = true;
		// act
		var bIsAdditionEnabled = this.oRepresentationTypesHandler.isAdditionToBeEnabled(sRepresentationType, sPropertyType, sKind);
		// assert
		assert.strictEqual(expectedResult, bIsAdditionEnabled, " then addition is enabled");
	});
	QUnit.test('When checking whether addition is enabled for legend property type for an invalid representation type', function(assert) {
		// arrange
		var sRepresentationType = "Hugo", sPropertyType = oPropertyTypes.LEGEND, sKind = sap.apf.core.constants.representationMetadata.kind.LEGEND;
		var expectedResult = false;
		// act
		var bIsAdditionEnabled = this.oRepresentationTypesHandler.isAdditionToBeEnabled(sRepresentationType, sPropertyType, sKind);
		// assert
		assert.strictEqual(expectedResult, bIsAdditionEnabled, " then addition is disabled");
	});
	QUnit.test('When checking whether addition is enabled for legend property type for an valid representation type and an invalid kind', function(assert) {
		// arrange
		var sRepresentationType = "BarChart", sPropertyType = oPropertyTypes.LEGEND, sKind = "XYAXIS";
		var expectedResult = false;
		// act
		var bIsAdditionEnabled = this.oRepresentationTypesHandler.isAdditionToBeEnabled(sRepresentationType, sPropertyType, sKind);
		// assert
		assert.strictEqual(expectedResult, bIsAdditionEnabled, " then addition is disabled");
	});
	QUnit.test('When checking whether addition is enabled for measures property type for a valid representation type and a valid kind', function(assert) {
		// arrange
		var sRepresentationType = "BarChart", sPropertyType = oPropertyTypes.MEASURE, sKind = sap.apf.core.constants.representationMetadata.kind.YAXIS;
		var expectedResult = true;
		// act
		var bIsAdditionEnabled = this.oRepresentationTypesHandler.isAdditionToBeEnabled(sRepresentationType, sPropertyType, sKind);
		// assert
		assert.strictEqual(expectedResult, bIsAdditionEnabled, " then addition is enabled");
	});
	QUnit.test('When checking whether addition is enabled for measure property type for an invalid representation type', function(assert) {
		// arrange
		var sRepresentationType = "Hugo", sPropertyType = oPropertyTypes.MEASURE, sKind = sap.apf.core.constants.representationMetadata.kind.YAXIS;
		var expectedResult = false;
		// act
		var bIsAdditionEnabled = this.oRepresentationTypesHandler.isAdditionToBeEnabled(sRepresentationType, sPropertyType, sKind);
		// assert
		assert.strictEqual(expectedResult, bIsAdditionEnabled, " then addition is disabled");
	});
	QUnit.test('When checking whether addition is enabled for measure property type for an valid representation type and an invalid kind', function(assert) {
		// arrange
		var sRepresentationType = "BarChart", sPropertyType = oPropertyTypes.MEASURE, sKind = "XYAXIS";
		var expectedResult = false;
		// act
		var bIsAdditionEnabled = this.oRepresentationTypesHandler.isAdditionToBeEnabled(sRepresentationType, sPropertyType, sKind);
		// assert
		assert.strictEqual(expectedResult, bIsAdditionEnabled, " then addition is disabled");
	});
	QUnit.test('When checking whether addition is enabled for property property type for a valid representation type', function(assert) {
		// arrange
		var sRepresentationType = "TableRepresentation", sPropertyType = oPropertyTypes.PROPERTY, sKind = sap.apf.core.constants.representationMetadata.kind.COLUMN;
		var expectedResult = true;
		// act
		var bIsAdditionEnabled = this.oRepresentationTypesHandler.isAdditionToBeEnabled(sRepresentationType, sPropertyType, sKind);
		// assert
		assert.strictEqual(expectedResult, bIsAdditionEnabled, " then addition is enabled");
	});
	QUnit.test('When retrieving kinds of a representation type for hierarchical property type', function(assert) {
		// arrange
		var sRepresentationType = "TreeTableRepresentation";
		var expectedResult = [ sap.apf.core.constants.representationMetadata.kind.HIERARCHIALCOLUMN ];
		// act
		var aSupportedKinds = this.oRepresentationTypesHandler.getKindsForHierarchicalPropertyType(sRepresentationType);
		// assert
		assert.deepEqual(expectedResult, aSupportedKinds, " then correct supported kinds are fetched for the representation type");
	});
	QUnit.test('When checking whether addition is enabled for hierarchical property type', function(assert) {
		// arrange
		var sRepresentationType = "TreeTableRepresentation", sPropertyType = oPropertyTypes.HIERARCHIALCOLUMN, sKind = sap.apf.core.constants.representationMetadata.kind.HIERARCHIALCOLUMN;
		var expectedResult = false;
		// act
		var bIsAdditionEnabled = this.oRepresentationTypesHandler.isAdditionToBeEnabled(sRepresentationType, sPropertyType, sKind);
		// assert
		assert.strictEqual(expectedResult, bIsAdditionEnabled, " then addition is disabled");
	});
	QUnit.test('When checking whether addition is enabled for property property type for an invalid representation type', function(assert) {
		// arrange
		var sRepresentationType = "Hugo", sPropertyType = oPropertyTypes.PROPERTY, sKind = sap.apf.core.constants.representationMetadata.kind.COLUMN;
		var expectedResult = false;
		// act
		var bIsAdditionEnabled = this.oRepresentationTypesHandler.isAdditionToBeEnabled(sRepresentationType, sPropertyType, sKind);
		// assert
		assert.strictEqual(expectedResult, bIsAdditionEnabled, " then addition is disabled");
	});
	QUnit.test('isCombinationChart', function(assert) {
		assert.strictEqual(false, this.oRepresentationTypesHandler.isCombinationChart("abc"), "Not known chart type returns false");
		assert.strictEqual(false, this.oRepresentationTypesHandler.isCombinationChart("ColumnChart"), "ColumnChart is not a combinationChart");
		assert.strictEqual(true, this.oRepresentationTypesHandler.isCombinationChart("DualStackedCombinationChart"), "DualStackedCombinationChart is a combinationChart");
	});
	QUnit.test("getDefaultCountForRepresentationKind", function(assert){
		assert.strictEqual(this.oRepresentationTypesHandler.getDefaultCountForRepresentationKind("ColumnChart", "xAxis"), 1, "Column Chart xAxis has 1 default count");
		assert.strictEqual(this.oRepresentationTypesHandler.getDefaultCountForRepresentationKind("ColumnChart", "legend"), 0, "Column Chart legend has 0 default count");
		assert.strictEqual(this.oRepresentationTypesHandler.getDefaultCountForRepresentationKind("ColumnChart", "yAxis"), 1, "Column Chart yAxis has 1 default count");

		assert.strictEqual(this.oRepresentationTypesHandler.getDefaultCountForRepresentationKind("CombinationChart", "xAxis"), 1, "Combination Chart xAxis has 1 default count");
		assert.strictEqual(this.oRepresentationTypesHandler.getDefaultCountForRepresentationKind("CombinationChart", "legend"), 0, "Combination Chart legend has 0 default count");
		assert.strictEqual(this.oRepresentationTypesHandler.getDefaultCountForRepresentationKind("CombinationChart", "yAxis"), 2, "Combination Chart yAxis has 2 default count");

		assert.strictEqual(this.oRepresentationTypesHandler.getDefaultCountForRepresentationKind("InvalidChart", "yAxis"), 0, "Invalid Chart type returns 0");
		assert.strictEqual(this.oRepresentationTypesHandler.getDefaultCountForRepresentationKind("BubbleChart", "legend"), 0, "Invalid kind returns 0");
	});
});
