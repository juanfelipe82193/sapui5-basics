/**
 * tests for the sap.suite.ui.generic.template.designtime.Column.designtime.js
 */
sap.ui.define([
		"testUtils/sinonEnhanced",
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
		"sap/suite/ui/generic/template/designtime/Column.designtime",
		"sap/suite/ui/generic/template/designtime/virtualProperties/ColumnType",
		"sap/suite/ui/generic/template/designtime/virtualProperties/ChartType",
		"sap/suite/ui/generic/template/designtime/virtualProperties/ChartMeasures",
		"sap/suite/ui/generic/template/js/AnnotationHelper",
		"sap/m/Column"
	],
	function(sinon, Utils, DesigntimeUtils, ColumnDesigntime, ColumnType, ChartType, ChartMeasures, AnnotationHelper) {
		"use strict";


		var	COLUMNTYPE_DATAFIELD = "DataField",
			COLUMNTYPE_CONNECTEDFIELDS = "ConnectedFields",
			COLUMNTYPE_CHART = "Chart",
			COLUMNTYPE_RATING = "RatingIndicator",
			COLUMNTYPE_PROGRESS = "ProgressIndicator",
			COLUMNTYPE_CONTACT = "Contact",
			COLUMNTYPE_INTENTBASEDNAV = "DataFieldWithIntentBasedNavigation",
			COLUMNTYPE_FORINTENTBASEDNAV = "DataFieldForIntentBasedNavigation",
			COLUMNTYPE_DATAFIELDWITHNAVPATH = "DataFieldWithNavigationPath",
			COLUMNTYPE_DATAFIELDFORACTION = "DataFieldForAction",
			COLUMNTYPE_DATAFIELDWITHURL = "DataFieldWithUrl",
			COLUMNTYPE_TOOLBARBUTTON = "ToolbarButton";

		var CHARTTYPE_DONUT = "Donut",
			CHARTTYPE_BULLET = "Bullet",
			CHARTTYPE_AREA = "Area";

		var LINEITEM = "com.sap.vocabularies.UI.v1.LineItem";

		QUnit.dump.maxDepth = 20;

		/********************************************************************************/
		QUnit.module("The function getColumnProperties", {
			beforeEach: function() {
				this.allProperties = {
					firstProperty: {ignore: true},
					hAlign: {ignore: true}
				};
				this.oIgnoreAllPropertiesStub = sinon.stub(DesigntimeUtils, "ignoreAllProperties").returns(this.allProperties);
				this.oColumn = {
					getId: function() {
						return "ListReport--Table--Column";
					}
				};
				this.oGetODataEntityTypeStub = sinon.stub(Utils, "getODataEntityType");
			},
			afterEach: function() {
				this.oIgnoreAllPropertiesStub.restore();
				this.oGetODataEntityTypeStub.restore();
			}
		});

		QUnit.test("getColumnProperties with empty column", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns("AnyOther");

			// Act
			var oProperties =  ColumnDesigntime.getColumnProperties(this.oColumn);

			// Assert
			assert.deepEqual(oProperties.firstProperty, {ignore: true}, "Blacklisted property is ignored");
			assert.deepEqual(oProperties.hAlign, {ignore: false}, "Property hAlign is active");
			assert.deepEqual(oProperties.hAlign, {ignore: false}, "Property width is active");
			assert.equal(oProperties.columnType.virtual, true, "Property columnType is present");
			assert.equal(oProperties.columnType.ignore(), true, "Property columnType is not active for empty element");
			assert.equal(oProperties.columnType.name, "Column type", "Property columnType has the right name");
			assert.equal(oProperties.columnType.type, "EnumType", "Property columnType has the right type");
			assert.notEqual(oProperties.columnType.multiple, true, "Property columnType is not multiple");
			assert.equal(oProperties.chartType.virtual, true, "Property chartType is present");
			assert.equal(oProperties.chartType.ignore(), true, "Property chartType is not active for empty element");
			assert.equal(oProperties.chartType.name, "Chart Type", "Property chartType has the right name");
			assert.equal(oProperties.chartType.type, "EnumType", "Property chartType has the right type");
			assert.notEqual(oProperties.chartType.multiple, true, "Property chartType is not multiple");
			assert.equal(oProperties.vMeasures.virtual, true, "Property vMeasures is present");
			assert.equal(oProperties.vMeasures.ignore(), true, "Property vMeasures is not active for empty element");
			assert.equal(oProperties.vMeasures.name, "Measures and Attributes", "Property vMeasures has the right name");
			assert.equal(oProperties.vMeasures.type, "Collection", "Property vMeasures has the right type");
			assert.equal(oProperties.vMeasures.multiple, true, "Property vMeasures is multiple");

			this.oGetColumnTypeStub.restore();
		});

		QUnit.test("getColumnProperties with non-chart column", function() {
			// Arrange
			this.oTypeValues = {
				one: "value"
			}
			this.oGetRecordStub = sinon.stub(Utils, "getLineItemRecordForColumn").returns({my: "dummy record"});
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns("AnyOther");
			this.oGetColumnTypeValuesStub = sinon.stub(ColumnType, "getColumnTypeValues").returns(this.oTypeValues);

			// Act
			var oProperties =  ColumnDesigntime.getColumnProperties(this.oColumn);

			// Assert
			assert.equal(oProperties.columnType.virtual, true, "Property columnType is present");
			assert.equal(oProperties.columnType.ignore(), false, "Property columnType is not active for empty element");
			assert.deepEqual(oProperties.columnType.possibleValues, this.oTypeValues, "Property columnType has the right possible values");
			assert.equal(oProperties.columnType.get(this.oColumn), "AnyOther", "Property columnType has the right value");
			assert.equal(oProperties.vMeasures.virtual, true, "Property vMeasures is present");
			assert.equal(oProperties.vMeasures.ignore(), true, "Property vMeasures is not active");
			assert.equal(oProperties.chartType.virtual, true, "Property chartType is present");
			assert.equal(oProperties.chartType.ignore(), true, "Property chartType is not active");

			this.oGetRecordStub.restore();
			this.oGetColumnTypeStub.restore();
			this.oGetColumnTypeValuesStub.restore();
		});

		QUnit.test("getColumnProperties with chart column", function() {
			// Arrange
			this.oGetRecordStub = sinon.stub(Utils, "getLineItemRecordForColumn").returns({my: "dummy record"});
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns("Chart");
			this.oTypeValue =  {
				Area: {
					displayName: "Smart Area Micro Chart"
				},
				Donut: {
					displayName: "Smart Radial Micro Chart"
				},
				Bullet: {
					displayName: "Smart Bullet Micro Chart"
				}
			};
			this.oGetChartTypeValuesStub = sinon.stub(ChartType, "getChartTypeValues").returns(this.oTypeValue);
			this.oGetChartTypeValueStub = sinon.stub(ChartType, "getChartType").returns("chartType");

			// Act
			var oProperties =  ColumnDesigntime.getColumnProperties(this.oColumn);

			// Assert
			assert.equal(oProperties.columnType.virtual, true, "Property columnType is present");
			assert.equal(oProperties.columnType.ignore(), false, "Property columnType is not active for empty element");
			assert.equal(oProperties.vMeasures.virtual, true, "Property vMeasures is present");
			assert.equal(oProperties.vMeasures.ignore(), false, "Property vMeasures is not active for empty element");
			assert.equal(oProperties.chartType.virtual, true, "Property chartType is present");
			assert.equal(oProperties.chartType.ignore(), false, "Property chartType is active");
			assert.deepEqual(oProperties.chartType.possibleValues, this.oTypeValue, "Property chartType has the right possible values");
			assert.equal(oProperties.chartType.get(this.oColumn), "chartType", "Property chartType has the right value");

			this.oGetRecordStub.restore();
			this.oGetColumnTypeStub.restore();
			this.oGetChartTypeValueStub.restore();
			this.oGetChartTypeValuesStub.restore();
		});

		/***************************************************/
		QUnit.module("The ignore functions for annotations", {

			beforeEach: function() {
				this.oGetMeasureDefinitionStub = sinon.stub(ChartMeasures, "getMeasureDefinition").returns({});
				this.oGetLineItemsStub = sinon.stub(Utils, "getLineItems").returns([]);
				this.sut = ColumnDesigntime.getDesigntime().annotations;
				this.oElement = {};
			},
			afterEach: function() {
				this.oGetLineItemsStub.restore();
				//this.oGetColumnTypeStub.restore();
				this.oGetMeasureDefinitionStub.restore();
			}
		});

		QUnit.test("columnDataField.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType");

			// Act
			var bIgnore = this.sut.columnDataField.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "columnDataField is ignored for an undefined column type");

			this.oGetColumnTypeStub.restore();
		});

		QUnit.test("columnDataField.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_PROGRESS);

			// Act
			var bIgnore = this.sut.columnDataField.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "columnDataField is ignored for a column of type ProgressIndicator");

			this.oGetColumnTypeStub.restore();
		});

		QUnit.test("columnDataField.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_DATAFIELD);

			// Act
			var bIgnore = this.sut.columnDataField.ignore(this.oElement);

			// Assert
			assert.notOk(bIgnore, "columnDataField is active for a column of type DataField");

			this.oGetColumnTypeStub.restore();
		});

		/*** Next annotation ***/

		QUnit.test("columnDataFieldWithUrl.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType");

			// Act
			var bIgnore = this.sut.columnDataFieldWithUrl.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "columnDataFieldWithUrl is ignored for an undefined column type");

			this.oGetColumnTypeStub.restore();
		});

		QUnit.test("columnDataFieldWithUrl.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_PROGRESS);

			// Act
			var bIgnore = this.sut.columnDataFieldWithUrl.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "columnDataFieldWithUrl is ignored for a column of type ProgressIndicator");

			this.oGetColumnTypeStub.restore();
		});

		QUnit.test("columnDataFieldWithUrl.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_DATAFIELDWITHURL);

			// Act
			var bIgnore = this.sut.columnDataFieldWithUrl.ignore(this.oElement);

			// Assert
			assert.notOk(bIgnore, "columnDataFieldWithUrl is active for a column of type DataFieldWithUrl");

			this.oGetColumnTypeStub.restore();
		});

		/*** Next annotation ***/

		QUnit.test("dataFieldForAction.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType");

			// Act
			var bIgnore = this.sut.dataFieldForAction.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "dataFieldForAction is ignored for an undefined column type");

			this.oGetColumnTypeStub.restore();
		});

		QUnit.test("dataFieldForAction.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_PROGRESS);

			// Act
			var bIgnore = this.sut.dataFieldForAction.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "dataFieldForAction is ignored for a column of type ProgressIndicator");

			this.oGetColumnTypeStub.restore();
		});

		QUnit.test("dataFieldForAction.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_DATAFIELDFORACTION);

			// Act
			var bIgnore = this.sut.dataFieldForAction.ignore(this.oElement);

			// Assert
			assert.notOk(bIgnore, "dataFieldForAction is active for a column of type DataFieldWithUrl");

			this.oGetColumnTypeStub.restore();
		});

		/*** Next annotation ***/

		QUnit.test("dataFieldWithIBN.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType");

			// Act
			var bIgnore = this.sut.dataFieldWithIBN.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "dataFieldWithIBN is ignored for an undefined column type");

			this.oGetColumnTypeStub.restore();
		});

		QUnit.test("dataFieldWithIBN.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_PROGRESS);

			// Act
			var bIgnore = this.sut.dataFieldWithIBN.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "dataFieldWithIBN is ignored for a column of type ProgressIndicator");

			this.oGetColumnTypeStub.restore();
		});

		QUnit.test("dataFieldWithIBN.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_INTENTBASEDNAV);

			// Act
			var bIgnore = this.sut.dataFieldWithIBN.ignore(this.oElement);

			// Assert
			assert.notOk(bIgnore, "dataFieldWithIBN is active for a column of type DataFieldWithIntentBasedNavigation");

			this.oGetColumnTypeStub.restore();
		});

		/*** Next annotation ***/

		QUnit.test("dataFieldForAnnotationRating.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType");

			// Act
			var bIgnore = this.sut.dataFieldForAnnotationRating.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "dataFieldForAnnotationRating is ignored for an undefined column type");

			this.oGetColumnTypeStub.restore();
		});

		QUnit.test("dataFieldForAnnotationRating.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_PROGRESS);

			// Act
			var bIgnore = this.sut.dataFieldForAnnotationRating.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "dataFieldForAnnotationRating is ignored for a column of type ProgressIndicator");

			this.oGetColumnTypeStub.restore();
		});

		QUnit.test("dataFieldForAnnotationRating.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_RATING);

			// Act
			var bIgnore = this.sut.dataFieldForAnnotationRating.ignore(this.oElement);

			// Assert
			assert.notOk(bIgnore, "dataFieldForAnnotationRating is active for a column of type Rating indicator");

			this.oGetColumnTypeStub.restore();
		});

		/*** Next annotation ***/

		QUnit.test("dataFieldForAnnotationConnectedFields.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType");

			// Act
			var bIgnore = this.sut.dataFieldForAnnotationConnectedFields.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "dataFieldForAnnotationConnectedFields is ignored for an undefined column type");

			this.oGetColumnTypeStub.restore();
		});

		QUnit.test("dataFieldForAnnotationConnectedFields.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_PROGRESS);

			// Act
			var bIgnore = this.sut.dataFieldForAnnotationConnectedFields.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "dataFieldForAnnotationConnectedFields is ignored for a column of type ProgressIndicator");

			this.oGetColumnTypeStub.restore();
		});

		QUnit.test("dataFieldForAnnotationConnectedFields.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_CONNECTEDFIELDS);

			// Act
			var bIgnore = this.sut.dataFieldForAnnotationConnectedFields.ignore(this.oElement);

			// Assert
			assert.notOk(bIgnore, "dataFieldForAnnotationConnectedFields is active for a column of type ConnectedFields");

			this.oGetColumnTypeStub.restore();
		});

		/*** Next annotation ***/

		QUnit.test("dataPointRating.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType");

			// Act
			var bIgnore = this.sut.dataPointRating.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "dataPointRating is ignored for an undefined column type");

			this.oGetColumnTypeStub.restore();
		});

		QUnit.test("dataPointRating.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_PROGRESS);

			// Act
			var bIgnore = this.sut.dataPointRating.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "dataPointRating is ignored for a column of type ProgressIndicator");

			this.oGetColumnTypeStub.restore();
		});

		QUnit.test("dataPointRating.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_RATING);

			// Act
			var bIgnore = this.sut.dataPointRating.ignore(this.oElement);

			// Assert
			assert.notOk(bIgnore, "dataPointRating is active for a column of type Rating indicator");

			this.oGetColumnTypeStub.restore();
		});


		/*** Next annotation ***/

		QUnit.test("dataFieldForAnnotationProgress.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType");

			// Act
			var bIgnore = this.sut.dataFieldForAnnotationProgress.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "dataFieldForAnnotationProgress is ignored for an undefined column type");

			this.oGetColumnTypeStub.restore();
		});

		QUnit.test("dataFieldForAnnotationProgress.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_DATAFIELD);

			// Act
			var bIgnore = this.sut.dataFieldForAnnotationProgress.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "dataFieldForAnnotationProgress is ignored for a column of type Datafield");

			this.oGetColumnTypeStub.restore();
		});

		QUnit.test("dataFieldForAnnotationProgress.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_PROGRESS);

			// Act
			var bIgnore = this.sut.dataFieldForAnnotationProgress.ignore(this.oElement);

			// Assert
			assert.notOk(bIgnore, "dataFieldForAnnotationProgress is active for a column of type ProgressIndicator");

			this.oGetColumnTypeStub.restore();
		});

		/*** Next annotation ***/

		QUnit.test("dataPointProgress.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType");

			// Act
			var bIgnore = this.sut.dataPointProgress.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "dataPointProgress is ignored for an undefined column type");

			this.oGetColumnTypeStub.restore();
		});

		QUnit.test("dataPointProgress.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_DATAFIELD);

			// Act
			var bIgnore = this.sut.dataPointProgress.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "dataPointProgress is ignored for a column of type Datafield");

			this.oGetColumnTypeStub.restore();
		});

		QUnit.test("dataPointProgress.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_PROGRESS);

			// Act
			var bIgnore = this.sut.dataPointProgress.ignore(this.oElement);

			// Assert
			assert.notOk(bIgnore, "dataPointProgress is active for a column of type ProgressIndicator");

			this.oGetColumnTypeStub.restore();
		});

		/*** Next annotation ***/

		QUnit.test("dataFieldForAnnotationContact.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType");

			// Act
			var bIgnore = this.sut.dataFieldForAnnotationContact.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "dataFieldForAnnotationContact is ignored for an undefined column type");

			this.oGetColumnTypeStub.restore();
		});

		QUnit.test("dataFieldForAnnotationContact.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_DATAFIELD);

			// Act
			var bIgnore = this.sut.dataFieldForAnnotationContact.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "dataFieldForAnnotationContact is ignored for a column of type Datafield");

			this.oGetColumnTypeStub.restore();
		});

		QUnit.test("dataFieldForAnnotationContact.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_CONTACT);

			// Act
			var bIgnore = this.sut.dataFieldForAnnotationContact.ignore(this.oElement);

			// Assert
			assert.notOk(bIgnore, "dataFieldForAnnotationContact is active for a column of type Contact");

			this.oGetColumnTypeStub.restore();
		});

		/*** Next annotation ***/

		QUnit.test("dataFieldForAnnotationChartWithDimensions.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_CHART);
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType");

			// Act
			var bIgnore = this.sut.dataFieldForAnnotationChartWithDimensions.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "dataFieldForAnnotationChartWithDimensions is ignored for an undefined chart type");

			this.oGetColumnTypeStub.restore();
			this.oGetChartTypeStub.restore();
		});

		QUnit.test("dataFieldForAnnotationChartWithDimensions.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_CHART);
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType").returns(CHARTTYPE_DONUT);

			// Act
			var bIgnore = this.sut.dataFieldForAnnotationChartWithDimensions.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "dataFieldForAnnotationChartWithDimensions is ignored for chart type Donut");

			this.oGetColumnTypeStub.restore();
			this.oGetChartTypeStub.restore();
		});

		QUnit.test("dataFieldForAnnotationChartWithDimensions.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_CHART);
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType").returns(CHARTTYPE_BULLET);

			// Act
			var bIgnore = this.sut.dataFieldForAnnotationChartWithDimensions.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "dataFieldForAnnotationChartWithDimensions is ignored for chart type Bullet");

			this.oGetColumnTypeStub.restore();
			this.oGetChartTypeStub.restore();
		});

		QUnit.test("dataFieldForAnnotationChartWithDimensions.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_CHART);
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType").returns(CHARTTYPE_AREA);

			// Act
			var bIgnore = this.sut.dataFieldForAnnotationChartWithDimensions.ignore(this.oElement);

			// Assert
			assert.notOk(bIgnore, "dataFieldForAnnotationChartWithDimensions is active for chart type Area");

			this.oGetColumnTypeStub.restore();
			this.oGetChartTypeStub.restore();
		});

		/*** Next annotation ***/

		QUnit.test("dataFieldForAnnotationChartNoDimensions.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_CHART);
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType");

			// Act
			var bIgnore = this.sut.dataFieldForAnnotationChartNoDimensions.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "dataFieldForAnnotationChartNoDimensions is ignored for an undefined chart type");

			this.oGetColumnTypeStub.restore();
			this.oGetChartTypeStub.restore();
		});

		QUnit.test("dataFieldForAnnotationChartNoDimensions.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_CHART);
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType").returns(CHARTTYPE_DONUT);

			// Act
			var bIgnore = this.sut.dataFieldForAnnotationChartNoDimensions.ignore(this.oElement);

			// Assert
			assert.notOk(bIgnore, "dataFieldForAnnotationChartNoDimensions is active for chart type Donut");

			this.oGetColumnTypeStub.restore();
			this.oGetChartTypeStub.restore();
		});

		QUnit.test("dataFieldForAnnotationChartNoDimensions.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_CHART);
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType").returns(CHARTTYPE_BULLET);

			// Act
			var bIgnore = this.sut.dataFieldForAnnotationChartNoDimensions.ignore(this.oElement);

			// Assert
			assert.notOk(bIgnore, "dataFieldForAnnotationChartNoDimensions is active for chart type Bullet");

			this.oGetColumnTypeStub.restore();
			this.oGetChartTypeStub.restore();
		});

		QUnit.test("dataFieldForAnnotationChartNoDimensions.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_CHART);
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType").returns(CHARTTYPE_AREA);

			// Act
			var bIgnore = this.sut.dataFieldForAnnotationChartNoDimensions.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "dataFieldForAnnotationChartNoDimensions is ignored for chart type Area");

			this.oGetColumnTypeStub.restore();
			this.oGetChartTypeStub.restore();
		});

		/*** Next annotation ***/

		QUnit.test("chartWithDimensions.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_CHART);
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType");

			// Act
			var bIgnore = this.sut.chartWithDimensions.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "chartWithDimensions is ignored for an undefined chart type");

			this.oGetColumnTypeStub.restore();
			this.oGetChartTypeStub.restore();
		});

		QUnit.test("chartWithDimensions.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_CHART);
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType").returns(CHARTTYPE_DONUT);

			// Act
			var bIgnore = this.sut.chartWithDimensions.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "chartWithDimensions is ignored for chart type Donut");

			this.oGetColumnTypeStub.restore();
			this.oGetChartTypeStub.restore();
		});

		QUnit.test("chartWithDimensions.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_CHART);
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType").returns(CHARTTYPE_BULLET);

			// Act
			var bIgnore = this.sut.chartWithDimensions.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "chartWithDimensions is ignored for chart type Bullet");

			this.oGetColumnTypeStub.restore();
			this.oGetChartTypeStub.restore();
		});

		QUnit.test("chartWithDimensions.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_CHART);
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType").returns(CHARTTYPE_AREA);

			// Act
			var bIgnore = this.sut.chartWithDimensions.ignore(this.oElement);

			// Assert
			assert.notOk(bIgnore, "chartWithDimensions is active for chart type Area");

			this.oGetColumnTypeStub.restore();
			this.oGetChartTypeStub.restore();
		});

		/*** Next annotation ***/

		QUnit.test("chartNoDimensions.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_CHART);
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType");

			// Act
			var bIgnore = this.sut.chartNoDimensions.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "chartNoDimensions is ignored for an undefined chart type");

			this.oGetColumnTypeStub.restore();
			this.oGetChartTypeStub.restore();
		});

		QUnit.test("chartNoDimensions.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_CHART);
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType").returns(CHARTTYPE_DONUT);

			// Act
			var bIgnore = this.sut.chartNoDimensions.ignore(this.oElement);

			// Assert
			assert.notOk(bIgnore, "chartNoDimensions is active for chart type Donut");

			this.oGetColumnTypeStub.restore();
			this.oGetChartTypeStub.restore();
		});

		QUnit.test("chartNoDimensions.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_CHART);
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType").returns(CHARTTYPE_BULLET);

			// Act
			var bIgnore = this.sut.chartNoDimensions.ignore(this.oElement);

			// Assert
			assert.notOk(bIgnore, "chartNoDimensions is active for chart type Bullet");

			this.oGetColumnTypeStub.restore();
			this.oGetChartTypeStub.restore();
		});

		QUnit.test("chartNoDimensions.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_CHART);
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType").returns(CHARTTYPE_AREA);

			// Act
			var bIgnore = this.sut.chartNoDimensions.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "chartNoDimensions is ignored for chart type Area");

			this.oGetChartTypeStub.restore();
			this.oGetColumnTypeStub.restore();
		});

		/*** Next annotation ***/

		QUnit.test("columnImportance.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType");

			// Act
			var bIgnore = this.sut.columnImportance.ignore(this.oElement);

			// Assert
			assert.ok(bIgnore, "columnImportance is ignored for an undefined column type");

			this.oGetColumnTypeStub.restore();
		});

		QUnit.test("columnImportance.ignore", function() {
			// Arrange
			this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType").returns(COLUMNTYPE_DATAFIELD);

			// Act
			var bIgnore = this.sut.columnImportance.ignore(this.oElement);

			// Assert
			assert.notOk(bIgnore, "columnImportance is ignored for a column of type Datafield");

			this.oGetColumnTypeStub.restore();
		});

		/***************************************************/
		QUnit.module("The functions getAnnotations", {

			beforeEach: function() {
				this.oGetMeasureDefinitionStub = sinon.stub(ChartMeasures, "getMeasureDefinition").returns({});
				this.oGetLineItemsStub = sinon.stub(Utils, "getLineItems").returns([]);
				this.oElement = {};
				this.oResourceBundle = sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();
				this.oGetTextStub = sinon.stub(this.oResourceBundle, "getText").returns("stubbedText");
				this.oGetColumnTypeStub = sinon.stub(ColumnType, "getColumnType");

				this.oExpectedAnnotations = {
					columnDataField: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataField",
						whiteList: {
							properties: ["Value", "Label", "Criticality", "CriticalityRepresentation"],
							mandatory: ["Value"],
							expressionTypes: {
								Value: ["Path"],
								Label: ["String"],
								Criticality: ["Path"]
							}
						},
						appliesTo: ["Column"],
						links: {}
					},
					columnDataFieldWithUrl: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataFieldWithUrl",
						whiteList: {
							mandatory: ["Url", "Value"],
							expressionTypes: {
								Value: ["Path"],
								Criticality: ["Path"]
							}
						},
						appliesTo: ["Column"],
						links: {}
					},
					columnDataFieldWithNavigationPath: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataFieldWithNavigationPath",
						whiteList: {
							properties: ["Target", "Value", "Label"],
							mandatory: ["Target", "Value"],
							expressionTypes: {
								Label: ["String"],
							}
						},
						defaultValue: null,
						appliesTo: ["Column"],
						links: {}
					},
					dataFieldForAction: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataFieldForAction",
						whiteList: {
							properties: ["Action", "Label", "Criticality", "InvocationGrouping"],
							mandatory: ["Action"],
							expressionTypes: {
								Action: ["String"],
								Label: ["String"],
								Criticality: ["Path"]
							}
						},
						appliesTo: ["Column"],
						links: {}
					},
					dataFieldForAnnotationChartWithDimensions: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataFieldForAnnotation",
						whiteList: {
							properties: ["Target", "Label"],
							mandatory: ["Target"],
							expressionTypes: {
								Label: ["String"]
							}
						},
						refersTo: [{
							annotation: "chartWithDimensions",
							referredBy: "Target"
						}],
						appliesTo: ["Column"],
						links: {}
					},
					dataFieldForAnnotationChartNoDimensions: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataFieldForAnnotation",
						whiteList: {
							properties: ["Target", "Label"],
							mandatory: ["Target"],
							expressionTypes: {
								Label: ["String"]
							}
						},
						refersTo: [{
							annotation: "chartNoDimensions",
							referredBy: "Target"
						}],
						appliesTo: ["Column"],
						links: {}
					},
					dataFieldForAnnotationRating: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataFieldForAnnotation",
						whiteList: {
							properties: ["Target", "Label"],
							mandatory: ["Target"],
							expressionTypes: {
								Label: ["String"]
							}
						},
						refersTo: [{
							annotation: "dataPointRating",
							referredBy: "Target"
						}],
						appliesTo: ["Column"],
						links: {}
					},
					dataFieldForAnnotationProgress: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataFieldForAnnotation",
						whiteList: {
							properties: ["Target", "Label"],
							mandatory: ["Target"],
							expressionTypes: {
								Label: ["String"]
							}
						},
						refersTo: [{
							annotation: "dataPointProgress",
							referredBy: "Target"
						}],
						appliesTo: ["Column"],
						links: {}
					},
					dataFieldForAnnotationContact: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataFieldForAnnotation",
						whiteList: {
							properties: ["Target", "Label"],
							mandatory: ["Target"],
							expressionTypes: {
								Label: ["String"]
							}
						},
						refersTo: [{
							annotation: "contact",
							referredBy: "Target"
						}],
						appliesTo: ["Column"],
						links: {}
					},
					dataFieldForAnnotationConnectedFields: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataFieldForAnnotation",
						whiteList: {
							properties: ["Target", "Label"],
							mandatory: ["Target"],
							expressionTypes: {
								Label: ["String"]
							}
						},
						refersTo: [{
							annotation: "fieldGroup",
							referredBy: "Target"
						}],
						appliesTo: ["Column"],
						links: {}
					},
					dataFieldWithIBN: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataFieldWithIntentBasedNavigation",
						whiteList: {
							properties: ["SemanticObject", "Action", "Label", "Value"],
							mandatory: ["SemanticObject", "Action"],
							expressionTypes: {
								SemanticObject: ["String"],
								Action: ["String"],
								Label: ["String"]
							}
						},
						appliesTo: ["Column"],
						links: {}
					},
					dataFieldForIBN: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataFieldForIntentBasedNavigation",
						whiteList: {
							properties: ["SemanticObject", "Action", "RequiresContext", "Label"],
							mandatory: ["SemanticObject", "RequiresContext"],
							expressionTypes: {
								SemanticObject: ["String"],
								Action: ["String"],
								Label: ["String"]
							}
						},
						appliesTo: ["Column"],
						links: {}
					},
					chartWithDimensions: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "Chart",
						target: ["EntityType"],
						whiteList: {
							properties: [
								"Description",
								"Dimensions",
								"vMeasures"  //virtual property
							],
							mandatory: ["vMeasures"],
							Dimensions: {
								mandatory: ["PropertyPath"]
							}
						},
						appliesTo: ["Column"],
						links: {}
					},
					chartNoDimensions: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "Chart",
						target: ["EntityType"],
						whiteList: {
							properties: [
								"Description",
								"vMeasures"  //virtual property
							],
							mandatory: ["vMeasures"]
						},
						appliesTo: ["Column"],
						links: {}
					},
					fieldGroup: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "FieldGroup",
						whiteList: {
							properties: ["vData"]
						},
						links: {}
					},
					dataPointRating: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataPoint",
						target: ["EntityType"],
						links: {},
						whiteList: {
							properties: ["Value", "TargetValue"],
							mandatory: ["Value"],
							expressionTypes: {
								Value: ["Path"],
								TargetValue: ["Path", "String", "Int", "Decimal"]
							}
						},
					},
					dataPointProgress: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "DataPoint",
						target: ["EntityType"],
						links: {},
						whiteList: {
							properties: ["Value", "TargetValue"],
							mandatory: ["Value"],
							expressionTypes: {
								Value: ["Path"],
								TargetValue: ["Path", "String", "Int", "Decimal"]
							}
						}
					},
					columnLabelOnProperty: { ignore: true },
					contact: {
						namespace: "com.sap.vocabularies.Communication.v1",
						annotation: "Contact",
						target: ["EntityType"],
						whiteList: {
							properties: [
								"fn", "n", "tel", "email", "photo", "title", "org", "role"
							],
							expressionTypes: {
								fn: ["Path"],
								photo: ["Path"],
								title: ["Path"],
								org: ["Path"],
								role: ["Path"]
							},
							n: {
								expressionTypes: {
									surname: ["Path"],
									given: ["Path"],
									additional: ["Path"],
									prefix: ["Path"],
									suffix: ["Path"]
								}
							}
						},
						appliesTo: ["Column"],
						links: {}
					},
					textArrangement: { ignore: true },
					columnImportance: {
						namespace: "com.sap.vocabularies.UI.v1",
						annotation: "Importance",
						target: ["Record"],
						appliesTo: ["Column"],
						links: {}
					}
				};
			},
			afterEach: function() {
				this.oGetLineItemsStub.restore();
				this.oGetTextStub.restore();
				this.oGetMeasureDefinitionStub.restore();
				this.oGetColumnTypeStub.restore();
			},
			_resolveFunction: function(vProperty, oElement) {
				// logic copied from /sap/ui/rta/service/Property.js
				return typeof vProperty === "function"
					? vProperty(oElement)
					: (vProperty || false);
			},
			_resolveFunctions: function(oAnnotations, oElement) {
				var oAnnotation;
				for (var sAnnotation in oAnnotations) {
					oAnnotation = oAnnotations[sAnnotation];
					oAnnotation.ignore = this._resolveFunction(oAnnotation.ignore, oElement);
					oAnnotation.links = {};
				}
			}
		});

		QUnit.test("Annotations for column type DataField", function() {
			// Arrange
			this.oGetColumnTypeStub.returns(COLUMNTYPE_DATAFIELD);

			// Act
			var oAnnotations = ColumnDesigntime.getAnnotations(this.oElement, this.oResourceBundle);

			// Assert
			this._resolveFunctions(oAnnotations, this.oElement);

			this.oExpectedAnnotations.columnDataField.ignore = false;
			assert.deepEqual(oAnnotations.columnDataField, this.oExpectedAnnotations.columnDataField, "columnDataField has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithUrl.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithUrl, this.oExpectedAnnotations.columnDataFieldWithUrl, "columnDataFieldWithUrl has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithNavigationPath.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithNavigationPath, this.oExpectedAnnotations.columnDataFieldWithNavigationPath, "columnDataFieldWithNavigationPath has the right properties.");
			this.oExpectedAnnotations.dataFieldForAction.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAction, this.oExpectedAnnotations.dataFieldForAction, "dataFieldForAction has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartWithDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions, "dataFieldForAnnotationChartWithDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartNoDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions, "dataFieldForAnnotationChartNoDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationRating.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationRating, this.oExpectedAnnotations.dataFieldForAnnotationRating, "dataFieldForAnnotationRating has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationProgress, this.oExpectedAnnotations.dataFieldForAnnotationProgress, "dataFieldForAnnotationProgress has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationContact.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationContact, this.oExpectedAnnotations.dataFieldForAnnotationContact, "dataFieldForAnnotationContact has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationConnectedFields, this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields, "dataFieldForAnnotationConnectedFields has the right properties.");
			this.oExpectedAnnotations.dataFieldWithIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldWithIBN, this.oExpectedAnnotations.dataFieldWithIBN, "dataFieldWithIBN has the right properties.");
			this.oExpectedAnnotations.dataFieldForIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForIBN, this.oExpectedAnnotations.dataFieldForIBN, "dataFieldForIBN has the right properties.");
			this.oExpectedAnnotations.chartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartWithDimensions, this.oExpectedAnnotations.chartWithDimensions, "chartWithDimensions has the right properties.");
			this.oExpectedAnnotations.chartNoDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartNoDimensions, this.oExpectedAnnotations.chartNoDimensions, "chartNoDimensions has the right properties.");
			this.oExpectedAnnotations.fieldGroup.ignore = true;
			assert.deepEqual(oAnnotations.fieldGroup, this.oExpectedAnnotations.fieldGroup, "fieldGroup has the right properties.");
			this.oExpectedAnnotations.dataPointRating.ignore = true;
			assert.deepEqual(oAnnotations.dataPointRating, this.oExpectedAnnotations.dataPointRating, "dataPointRating has the right properties.");
			this.oExpectedAnnotations.dataPointProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataPointProgress, this.oExpectedAnnotations.dataPointProgress, "dataPointProgress has the right properties.");
			this.oExpectedAnnotations.contact.ignore = true;
			assert.deepEqual(oAnnotations.contact, this.oExpectedAnnotations.contact, "contact has the right properties.");
			this.oExpectedAnnotations.columnImportance.ignore = false;
			assert.deepEqual(oAnnotations.columnImportance, this.oExpectedAnnotations.columnImportance, "columnImportance has the right properties.");
		});

		QUnit.test("Annotations for column type Rating", function() {
			// Arrange
			this.oGetColumnTypeStub.returns(COLUMNTYPE_RATING);

			// Act
			var oAnnotations = ColumnDesigntime.getAnnotations(this.oElement, this.oResourceBundle);

			// Assert
			this._resolveFunctions(oAnnotations, this.oElement);

			this.oExpectedAnnotations.columnDataField.ignore = true;
			assert.deepEqual(oAnnotations.columnDataField, this.oExpectedAnnotations.columnDataField, "columnDataField has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithUrl.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithUrl, this.oExpectedAnnotations.columnDataFieldWithUrl, "columnDataFieldWithUrl has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithNavigationPath.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithNavigationPath, this.oExpectedAnnotations.columnDataFieldWithNavigationPath, "columnDataFieldWithNavigationPath has the right properties.");
			this.oExpectedAnnotations.dataFieldForAction.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAction, this.oExpectedAnnotations.dataFieldForAction, "dataFieldForAction has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartWithDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions, "dataFieldForAnnotationChartWithDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartNoDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions, "dataFieldForAnnotationChartNoDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationRating.ignore = false;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationRating, this.oExpectedAnnotations.dataFieldForAnnotationRating, "dataFieldForAnnotationRating has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationProgress, this.oExpectedAnnotations.dataFieldForAnnotationProgress, "dataFieldForAnnotationProgress has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationContact.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationContact, this.oExpectedAnnotations.dataFieldForAnnotationContact, "dataFieldForAnnotationContact has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationConnectedFields, this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields, "dataFieldForAnnotationConnectedFields has the right properties.");
			this.oExpectedAnnotations.dataFieldWithIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldWithIBN, this.oExpectedAnnotations.dataFieldWithIBN, "dataFieldWithIBN has the right properties.");
			this.oExpectedAnnotations.dataFieldForIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForIBN, this.oExpectedAnnotations.dataFieldForIBN, "dataFieldForIBN has the right properties.");
			this.oExpectedAnnotations.chartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartWithDimensions, this.oExpectedAnnotations.chartWithDimensions, "chartWithDimensions has the right properties.");
			this.oExpectedAnnotations.chartNoDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartNoDimensions, this.oExpectedAnnotations.chartNoDimensions, "chartNoDimensions has the right properties.");
			this.oExpectedAnnotations.fieldGroup.ignore = true;
			assert.deepEqual(oAnnotations.fieldGroup, this.oExpectedAnnotations.fieldGroup, "fieldGroup has the right properties.");
			this.oExpectedAnnotations.dataPointRating.ignore = false;
			assert.deepEqual(oAnnotations.dataPointRating, this.oExpectedAnnotations.dataPointRating, "dataPointRating has the right properties.");
			this.oExpectedAnnotations.dataPointProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataPointProgress, this.oExpectedAnnotations.dataPointProgress, "dataPointProgress has the right properties.");
			this.oExpectedAnnotations.contact.ignore = true;
			assert.deepEqual(oAnnotations.contact, this.oExpectedAnnotations.contact, "contact has the right properties.");
			this.oExpectedAnnotations.columnImportance.ignore = false;
			assert.deepEqual(oAnnotations.columnImportance, this.oExpectedAnnotations.columnImportance, "columnImportance has the right properties.");
		});

		QUnit.test("Annotations for column type Progress", function() {
			// Arrange
			this.oGetColumnTypeStub.returns(COLUMNTYPE_PROGRESS);

			// Act
			var oAnnotations = ColumnDesigntime.getAnnotations(this.oElement, this.oResourceBundle);

			// Assert
			this._resolveFunctions(oAnnotations, this.oElement);

			this.oExpectedAnnotations.columnDataField.ignore = true;
			assert.deepEqual(oAnnotations.columnDataField, this.oExpectedAnnotations.columnDataField, "columnDataField has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithUrl.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithUrl, this.oExpectedAnnotations.columnDataFieldWithUrl, "columnDataFieldWithUrl has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithNavigationPath.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithNavigationPath, this.oExpectedAnnotations.columnDataFieldWithNavigationPath, "columnDataFieldWithNavigationPath has the right properties.");
			this.oExpectedAnnotations.dataFieldForAction.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAction, this.oExpectedAnnotations.dataFieldForAction, "dataFieldForAction has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartWithDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions, "dataFieldForAnnotationChartWithDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartNoDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions, "dataFieldForAnnotationChartNoDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationRating.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationRating, this.oExpectedAnnotations.dataFieldForAnnotationRating, "dataFieldForAnnotationRating has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationProgress.ignore = false;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationProgress, this.oExpectedAnnotations.dataFieldForAnnotationProgress, "dataFieldForAnnotationProgress has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationContact.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationContact, this.oExpectedAnnotations.dataFieldForAnnotationContact, "dataFieldForAnnotationContact has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationConnectedFields, this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields, "dataFieldForAnnotationConnectedFields has the right properties.");
			this.oExpectedAnnotations.dataFieldWithIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldWithIBN, this.oExpectedAnnotations.dataFieldWithIBN, "dataFieldWithIBN has the right properties.");
			this.oExpectedAnnotations.dataFieldForIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForIBN, this.oExpectedAnnotations.dataFieldForIBN, "dataFieldForIBN has the right properties.");
			this.oExpectedAnnotations.chartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartWithDimensions, this.oExpectedAnnotations.chartWithDimensions, "chartWithDimensions has the right properties.");
			this.oExpectedAnnotations.chartNoDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartNoDimensions, this.oExpectedAnnotations.chartNoDimensions, "chartNoDimensions has the right properties.");
			this.oExpectedAnnotations.fieldGroup.ignore = true;
			assert.deepEqual(oAnnotations.fieldGroup, this.oExpectedAnnotations.fieldGroup, "fieldGroup has the right properties.");
			this.oExpectedAnnotations.dataPointRating.ignore = true;
			assert.deepEqual(oAnnotations.dataPointRating, this.oExpectedAnnotations.dataPointRating, "dataPointRating has the right properties.");
			this.oExpectedAnnotations.dataPointProgress.ignore = false;
			assert.deepEqual(oAnnotations.dataPointProgress, this.oExpectedAnnotations.dataPointProgress, "dataPointProgress has the right properties.");
			this.oExpectedAnnotations.contact.ignore = true;
			assert.deepEqual(oAnnotations.contact, this.oExpectedAnnotations.contact, "contact has the right properties.");
			this.oExpectedAnnotations.columnImportance.ignore = false;
			assert.deepEqual(oAnnotations.columnImportance, this.oExpectedAnnotations.columnImportance, "columnImportance has the right properties.");
		});

		QUnit.test("Annotations for column type Contact", function() {
			// Arrange
			this.oGetColumnTypeStub.returns(COLUMNTYPE_CONTACT);

			// Act
			var oAnnotations = ColumnDesigntime.getAnnotations(this.oElement, this.oResourceBundle);

			// Assert
			this._resolveFunctions(oAnnotations, this.oElement);

			this.oExpectedAnnotations.columnDataField.ignore = true;
			assert.deepEqual(oAnnotations.columnDataField, this.oExpectedAnnotations.columnDataField, "columnDataField has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithUrl.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithUrl, this.oExpectedAnnotations.columnDataFieldWithUrl, "columnDataFieldWithUrl has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithNavigationPath.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithNavigationPath, this.oExpectedAnnotations.columnDataFieldWithNavigationPath, "columnDataFieldWithNavigationPath has the right properties.");
			this.oExpectedAnnotations.dataFieldForAction.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAction, this.oExpectedAnnotations.dataFieldForAction, "dataFieldForAction has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartWithDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions, "dataFieldForAnnotationChartWithDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartNoDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions, "dataFieldForAnnotationChartNoDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationRating.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationRating, this.oExpectedAnnotations.dataFieldForAnnotationRating, "dataFieldForAnnotationRating has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationProgress, this.oExpectedAnnotations.dataFieldForAnnotationProgress, "dataFieldForAnnotationProgress has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationContact.ignore = false;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationContact, this.oExpectedAnnotations.dataFieldForAnnotationContact, "dataFieldForAnnotationContact has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationConnectedFields, this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields, "dataFieldForAnnotationConnectedFields has the right properties.");
			this.oExpectedAnnotations.dataFieldWithIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldWithIBN, this.oExpectedAnnotations.dataFieldWithIBN, "dataFieldWithIBN has the right properties.");
			this.oExpectedAnnotations.dataFieldForIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForIBN, this.oExpectedAnnotations.dataFieldForIBN, "dataFieldForIBN has the right properties.");
			this.oExpectedAnnotations.chartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartWithDimensions, this.oExpectedAnnotations.chartWithDimensions, "chartWithDimensions has the right properties.");
			this.oExpectedAnnotations.chartNoDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartNoDimensions, this.oExpectedAnnotations.chartNoDimensions, "chartNoDimensions has the right properties.");
			this.oExpectedAnnotations.fieldGroup.ignore = true;
			assert.deepEqual(oAnnotations.fieldGroup, this.oExpectedAnnotations.fieldGroup, "fieldGroup has the right properties.");
			this.oExpectedAnnotations.dataPointRating.ignore = true;
			assert.deepEqual(oAnnotations.dataPointRating, this.oExpectedAnnotations.dataPointRating, "dataPointRating has the right properties.");
			this.oExpectedAnnotations.dataPointProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataPointProgress, this.oExpectedAnnotations.dataPointProgress, "dataPointProgress has the right properties.");
			this.oExpectedAnnotations.contact.ignore = false;
			assert.deepEqual(oAnnotations.contact, this.oExpectedAnnotations.contact, "contact has the right properties.");
			this.oExpectedAnnotations.columnImportance.ignore = false;
			assert.deepEqual(oAnnotations.columnImportance, this.oExpectedAnnotations.columnImportance, "columnImportance has the right properties.");
		});

		QUnit.test("Annotations for column type WithIBN", function() {
			// Arrange
			this.oGetColumnTypeStub.returns(COLUMNTYPE_INTENTBASEDNAV);

			// Act
			var oAnnotations = ColumnDesigntime.getAnnotations(this.oElement, this.oResourceBundle);

			// Assert
			this._resolveFunctions(oAnnotations, this.oElement);

			this.oExpectedAnnotations.columnDataField.ignore = true;
			assert.deepEqual(oAnnotations.columnDataField, this.oExpectedAnnotations.columnDataField, "columnDataField has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithUrl.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithUrl, this.oExpectedAnnotations.columnDataFieldWithUrl, "columnDataFieldWithUrl has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithNavigationPath.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithNavigationPath, this.oExpectedAnnotations.columnDataFieldWithNavigationPath, "columnDataFieldWithNavigationPath has the right properties.");
			this.oExpectedAnnotations.dataFieldForAction.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAction, this.oExpectedAnnotations.dataFieldForAction, "dataFieldForAction has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartWithDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions, "dataFieldForAnnotationChartWithDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartNoDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions, "dataFieldForAnnotationChartNoDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationRating.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationRating, this.oExpectedAnnotations.dataFieldForAnnotationRating, "dataFieldForAnnotationRating has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationProgress, this.oExpectedAnnotations.dataFieldForAnnotationProgress, "dataFieldForAnnotationProgress has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationContact.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationContact, this.oExpectedAnnotations.dataFieldForAnnotationContact, "dataFieldForAnnotationContact has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationConnectedFields, this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields, "dataFieldForAnnotationConnectedFields has the right properties.");
			this.oExpectedAnnotations.dataFieldWithIBN.ignore = false;
			assert.deepEqual(oAnnotations.dataFieldWithIBN, this.oExpectedAnnotations.dataFieldWithIBN, "dataFieldWithIBN has the right properties.");
			this.oExpectedAnnotations.dataFieldForIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForIBN, this.oExpectedAnnotations.dataFieldForIBN, "dataFieldForIBN has the right properties.");
			this.oExpectedAnnotations.chartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartWithDimensions, this.oExpectedAnnotations.chartWithDimensions, "chartWithDimensions has the right properties.");
			this.oExpectedAnnotations.chartNoDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartNoDimensions, this.oExpectedAnnotations.chartNoDimensions, "chartNoDimensions has the right properties.");
			this.oExpectedAnnotations.fieldGroup.ignore = true;
			assert.deepEqual(oAnnotations.fieldGroup, this.oExpectedAnnotations.fieldGroup, "fieldGroup has the right properties.");
			this.oExpectedAnnotations.dataPointRating.ignore = true;
			assert.deepEqual(oAnnotations.dataPointRating, this.oExpectedAnnotations.dataPointRating, "dataPointRating has the right properties.");
			this.oExpectedAnnotations.dataPointProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataPointProgress, this.oExpectedAnnotations.dataPointProgress, "dataPointProgress has the right properties.");
			this.oExpectedAnnotations.contact.ignore = true;
			assert.deepEqual(oAnnotations.contact, this.oExpectedAnnotations.contact, "contact has the right properties.");
			this.oExpectedAnnotations.columnImportance.ignore = false;
			assert.deepEqual(oAnnotations.columnImportance, this.oExpectedAnnotations.columnImportance, "columnImportance has the right properties.");
		});

		QUnit.test("Annotations for column type ForIBN", function() {
			// Arrange
			this.oGetColumnTypeStub.returns(COLUMNTYPE_FORINTENTBASEDNAV);

			// Act
			var oAnnotations = ColumnDesigntime.getAnnotations(this.oElement, this.oResourceBundle);

			// Assert
			this._resolveFunctions(oAnnotations, this.oElement);

			this.oExpectedAnnotations.columnDataField.ignore = true;
			assert.deepEqual(oAnnotations.columnDataField, this.oExpectedAnnotations.columnDataField, "columnDataField has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithUrl.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithUrl, this.oExpectedAnnotations.columnDataFieldWithUrl, "columnDataFieldWithUrl has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithNavigationPath.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithNavigationPath, this.oExpectedAnnotations.columnDataFieldWithNavigationPath, "columnDataFieldWithNavigationPath has the right properties.");
			this.oExpectedAnnotations.dataFieldForAction.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAction, this.oExpectedAnnotations.dataFieldForAction, "dataFieldForAction has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartWithDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions, "dataFieldForAnnotationChartWithDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartNoDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions, "dataFieldForAnnotationChartNoDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationRating.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationRating, this.oExpectedAnnotations.dataFieldForAnnotationRating, "dataFieldForAnnotationRating has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationProgress, this.oExpectedAnnotations.dataFieldForAnnotationProgress, "dataFieldForAnnotationProgress has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationContact.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationContact, this.oExpectedAnnotations.dataFieldForAnnotationContact, "dataFieldForAnnotationContact has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationConnectedFields, this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields, "dataFieldForAnnotationConnectedFields has the right properties.");
			this.oExpectedAnnotations.dataFieldWithIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldWithIBN, this.oExpectedAnnotations.dataFieldWithIBN, "dataFieldWithIBN has the right properties.");
			this.oExpectedAnnotations.dataFieldForIBN.ignore = false;
			assert.deepEqual(oAnnotations.dataFieldForIBN, this.oExpectedAnnotations.dataFieldForIBN, "dataFieldForIBN has the right properties.");
			this.oExpectedAnnotations.chartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartWithDimensions, this.oExpectedAnnotations.chartWithDimensions, "chartWithDimensions has the right properties.");
			this.oExpectedAnnotations.chartNoDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartNoDimensions, this.oExpectedAnnotations.chartNoDimensions, "chartNoDimensions has the right properties.");
			this.oExpectedAnnotations.fieldGroup.ignore = true;
			assert.deepEqual(oAnnotations.fieldGroup, this.oExpectedAnnotations.fieldGroup, "fieldGroup has the right properties.");
			this.oExpectedAnnotations.dataPointRating.ignore = true;
			assert.deepEqual(oAnnotations.dataPointRating, this.oExpectedAnnotations.dataPointRating, "dataPointRating has the right properties.");
			this.oExpectedAnnotations.dataPointProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataPointProgress, this.oExpectedAnnotations.dataPointProgress, "dataPointProgress has the right properties.");
			this.oExpectedAnnotations.contact.ignore = true;
			assert.deepEqual(oAnnotations.contact, this.oExpectedAnnotations.contact, "contact has the right properties.");
			this.oExpectedAnnotations.columnImportance.ignore = false;
			assert.deepEqual(oAnnotations.columnImportance, this.oExpectedAnnotations.columnImportance, "columnImportance has the right properties.");
		});

		QUnit.test("Annotations for column type DataFieldWithNavigationPath", function() {
			// Arrange
			this.oGetColumnTypeStub.returns(COLUMNTYPE_DATAFIELDWITHNAVPATH);

			// Act
			var oAnnotations = ColumnDesigntime.getAnnotations(this.oElement, this.oResourceBundle);

			// Assert
			this._resolveFunctions(oAnnotations, this.oElement);

			this.oExpectedAnnotations.columnDataField.ignore = true;
			assert.deepEqual(oAnnotations.columnDataField, this.oExpectedAnnotations.columnDataField, "columnDataField has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithUrl.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithUrl, this.oExpectedAnnotations.columnDataFieldWithUrl, "columnDataFieldWithUrl has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithNavigationPath.ignore = false;
			assert.deepEqual(oAnnotations.columnDataFieldWithNavigationPath, this.oExpectedAnnotations.columnDataFieldWithNavigationPath, "columnDataFieldWithNavigationPath has the right properties.");
			this.oExpectedAnnotations.dataFieldForAction.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAction, this.oExpectedAnnotations.dataFieldForAction, "dataFieldForAction has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartWithDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions, "dataFieldForAnnotationChartWithDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartNoDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions, "dataFieldForAnnotationChartNoDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationRating.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationRating, this.oExpectedAnnotations.dataFieldForAnnotationRating, "dataFieldForAnnotationRating has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationProgress, this.oExpectedAnnotations.dataFieldForAnnotationProgress, "dataFieldForAnnotationProgress has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationContact.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationContact, this.oExpectedAnnotations.dataFieldForAnnotationContact, "dataFieldForAnnotationContact has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationConnectedFields, this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields, "dataFieldForAnnotationConnectedFields has the right properties.");
			this.oExpectedAnnotations.dataFieldWithIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldWithIBN, this.oExpectedAnnotations.dataFieldWithIBN, "dataFieldWithIBN has the right properties.");
			this.oExpectedAnnotations.dataFieldForIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForIBN, this.oExpectedAnnotations.dataFieldForIBN, "dataFieldForIBN has the right properties.");
			this.oExpectedAnnotations.chartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartWithDimensions, this.oExpectedAnnotations.chartWithDimensions, "chartWithDimensions has the right properties.");
			this.oExpectedAnnotations.chartNoDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartNoDimensions, this.oExpectedAnnotations.chartNoDimensions, "chartNoDimensions has the right properties.");
			this.oExpectedAnnotations.fieldGroup.ignore = true;
			assert.deepEqual(oAnnotations.fieldGroup, this.oExpectedAnnotations.fieldGroup, "fieldGroup has the right properties.");
			this.oExpectedAnnotations.dataPointRating.ignore = true;
			assert.deepEqual(oAnnotations.dataPointRating, this.oExpectedAnnotations.dataPointRating, "dataPointRating has the right properties.");
			this.oExpectedAnnotations.dataPointProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataPointProgress, this.oExpectedAnnotations.dataPointProgress, "dataPointProgress has the right properties.");
			this.oExpectedAnnotations.contact.ignore = true;
			assert.deepEqual(oAnnotations.contact, this.oExpectedAnnotations.contact, "contact has the right properties.");
			this.oExpectedAnnotations.columnImportance.ignore = false;
			assert.deepEqual(oAnnotations.columnImportance, this.oExpectedAnnotations.columnImportance, "columnImportance has the right properties.");
		});

		QUnit.test("Annotations for column type DataFieldForAction", function() {
			// Arrange
			this.oGetColumnTypeStub.returns(COLUMNTYPE_DATAFIELDFORACTION);

			// Act
			var oAnnotations = ColumnDesigntime.getAnnotations(this.oElement, this.oResourceBundle);

			// Assert
			this._resolveFunctions(oAnnotations, this.oElement);

			this.oExpectedAnnotations.columnDataField.ignore = true;
			assert.deepEqual(oAnnotations.columnDataField, this.oExpectedAnnotations.columnDataField, "columnDataField has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithUrl.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithUrl, this.oExpectedAnnotations.columnDataFieldWithUrl, "columnDataFieldWithUrl has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithNavigationPath.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithNavigationPath, this.oExpectedAnnotations.columnDataFieldWithNavigationPath, "columnDataFieldWithNavigationPath has the right properties.");
			this.oExpectedAnnotations.dataFieldForAction.ignore = false;
			assert.deepEqual(oAnnotations.dataFieldForAction, this.oExpectedAnnotations.dataFieldForAction, "dataFieldForAction has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartWithDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions, "dataFieldForAnnotationChartWithDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartNoDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions, "dataFieldForAnnotationChartNoDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationRating.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationRating, this.oExpectedAnnotations.dataFieldForAnnotationRating, "dataFieldForAnnotationRating has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationProgress, this.oExpectedAnnotations.dataFieldForAnnotationProgress, "dataFieldForAnnotationProgress has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationContact.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationContact, this.oExpectedAnnotations.dataFieldForAnnotationContact, "dataFieldForAnnotationContact has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationConnectedFields, this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields, "dataFieldForAnnotationConnectedFields has the right properties.");
			this.oExpectedAnnotations.dataFieldWithIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldWithIBN, this.oExpectedAnnotations.dataFieldWithIBN, "dataFieldWithIBN has the right properties.");
			this.oExpectedAnnotations.dataFieldForIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForIBN, this.oExpectedAnnotations.dataFieldForIBN, "dataFieldForIBN has the right properties.");
			this.oExpectedAnnotations.chartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartWithDimensions, this.oExpectedAnnotations.chartWithDimensions, "chartWithDimensions has the right properties.");
			this.oExpectedAnnotations.chartNoDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartNoDimensions, this.oExpectedAnnotations.chartNoDimensions, "chartNoDimensions has the right properties.");
			this.oExpectedAnnotations.fieldGroup.ignore = true;
			assert.deepEqual(oAnnotations.fieldGroup, this.oExpectedAnnotations.fieldGroup, "fieldGroup has the right properties.");
			this.oExpectedAnnotations.dataPointRating.ignore = true;
			assert.deepEqual(oAnnotations.dataPointRating, this.oExpectedAnnotations.dataPointRating, "dataPointRating has the right properties.");
			this.oExpectedAnnotations.dataPointProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataPointProgress, this.oExpectedAnnotations.dataPointProgress, "dataPointProgress has the right properties.");
			this.oExpectedAnnotations.contact.ignore = true;
			assert.deepEqual(oAnnotations.contact, this.oExpectedAnnotations.contact, "contact has the right properties.");
			this.oExpectedAnnotations.columnImportance.ignore = false;
			assert.deepEqual(oAnnotations.columnImportance, this.oExpectedAnnotations.columnImportance, "columnImportance has the right properties.");
		});

		QUnit.test("Annotations for 'column type' Toolbar button", function() {
			// Arrange
			this.oGetColumnTypeStub.returns(COLUMNTYPE_TOOLBARBUTTON);

			// Act
			var oAnnotations = ColumnDesigntime.getAnnotations(this.oElement, this.oResourceBundle);

			// Assert
			this._resolveFunctions(oAnnotations, this.oElement);

			this.oExpectedAnnotations.columnDataField.ignore = true;
			assert.deepEqual(oAnnotations.columnDataField, this.oExpectedAnnotations.columnDataField, "columnDataField has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithUrl.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithUrl, this.oExpectedAnnotations.columnDataFieldWithUrl, "columnDataFieldWithUrl has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithNavigationPath.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithNavigationPath, this.oExpectedAnnotations.columnDataFieldWithNavigationPath, "columnDataFieldWithNavigationPath has the right properties.");
			this.oExpectedAnnotations.dataFieldForAction.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAction, this.oExpectedAnnotations.dataFieldForAction, "dataFieldForAction has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartWithDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions, "dataFieldForAnnotationChartWithDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartNoDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions, "dataFieldForAnnotationChartNoDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationRating.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationRating, this.oExpectedAnnotations.dataFieldForAnnotationRating, "dataFieldForAnnotationRating has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationProgress, this.oExpectedAnnotations.dataFieldForAnnotationProgress, "dataFieldForAnnotationProgress has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationContact.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationContact, this.oExpectedAnnotations.dataFieldForAnnotationContact, "dataFieldForAnnotationContact has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationConnectedFields, this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields, "dataFieldForAnnotationConnectedFields has the right properties.");
			this.oExpectedAnnotations.dataFieldWithIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldWithIBN, this.oExpectedAnnotations.dataFieldWithIBN, "dataFieldWithIBN has the right properties.");
			this.oExpectedAnnotations.dataFieldForIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForIBN, this.oExpectedAnnotations.dataFieldForIBN, "dataFieldForIBN has the right properties.");
			this.oExpectedAnnotations.chartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartWithDimensions, this.oExpectedAnnotations.chartWithDimensions, "chartWithDimensions has the right properties.");
			this.oExpectedAnnotations.chartNoDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartNoDimensions, this.oExpectedAnnotations.chartNoDimensions, "chartNoDimensions has the right properties.");
			this.oExpectedAnnotations.fieldGroup.ignore = true;
			assert.deepEqual(oAnnotations.fieldGroup, this.oExpectedAnnotations.fieldGroup, "fieldGroup has the right properties.");
			this.oExpectedAnnotations.dataPointRating.ignore = true;
			assert.deepEqual(oAnnotations.dataPointRating, this.oExpectedAnnotations.dataPointRating, "dataPointRating has the right properties.");
			this.oExpectedAnnotations.dataPointProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataPointProgress, this.oExpectedAnnotations.dataPointProgress, "dataPointProgress has the right properties.");
			this.oExpectedAnnotations.contact.ignore = true;
			assert.deepEqual(oAnnotations.contact, this.oExpectedAnnotations.contact, "contact has the right properties.");
			this.oExpectedAnnotations.columnImportance.ignore = true;
			assert.deepEqual(oAnnotations.columnImportance, this.oExpectedAnnotations.columnImportance, "columnImportance has the right properties.");
		});

		QUnit.test("Annotations for column type DataFieldWithUrl", function() {
			// Arrange
			this.oGetColumnTypeStub.returns(COLUMNTYPE_DATAFIELDWITHURL);

			// Act
			var oAnnotations = ColumnDesigntime.getAnnotations(this.oElement, this.oResourceBundle);

			// Assert
			this._resolveFunctions(oAnnotations, this.oElement);

			this.oExpectedAnnotations.columnDataField.ignore = true;
			assert.deepEqual(oAnnotations.columnDataField, this.oExpectedAnnotations.columnDataField, "columnDataField has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithUrl.ignore = false;
			assert.deepEqual(oAnnotations.columnDataFieldWithUrl, this.oExpectedAnnotations.columnDataFieldWithUrl, "columnDataFieldWithUrl has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithNavigationPath.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithNavigationPath, this.oExpectedAnnotations.columnDataFieldWithNavigationPath, "columnDataFieldWithNavigationPath has the right properties.");
			this.oExpectedAnnotations.dataFieldForAction.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAction, this.oExpectedAnnotations.dataFieldForAction, "dataFieldForAction has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartWithDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions, "dataFieldForAnnotationChartWithDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartNoDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions, "dataFieldForAnnotationChartNoDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationRating.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationRating, this.oExpectedAnnotations.dataFieldForAnnotationRating, "dataFieldForAnnotationRating has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationProgress, this.oExpectedAnnotations.dataFieldForAnnotationProgress, "dataFieldForAnnotationProgress has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationContact.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationContact, this.oExpectedAnnotations.dataFieldForAnnotationContact, "dataFieldForAnnotationContact has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationConnectedFields, this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields, "dataFieldForAnnotationConnectedFields has the right properties.");
			this.oExpectedAnnotations.dataFieldWithIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldWithIBN, this.oExpectedAnnotations.dataFieldWithIBN, "dataFieldWithIBN has the right properties.");
			this.oExpectedAnnotations.dataFieldForIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForIBN, this.oExpectedAnnotations.dataFieldForIBN, "dataFieldForIBN has the right properties.");
			this.oExpectedAnnotations.chartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartWithDimensions, this.oExpectedAnnotations.chartWithDimensions, "chartWithDimensions has the right properties.");
			this.oExpectedAnnotations.chartNoDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartNoDimensions, this.oExpectedAnnotations.chartNoDimensions, "chartNoDimensions has the right properties.");
			this.oExpectedAnnotations.fieldGroup.ignore = true;
			assert.deepEqual(oAnnotations.fieldGroup, this.oExpectedAnnotations.fieldGroup, "fieldGroup has the right properties.");
			this.oExpectedAnnotations.dataPointRating.ignore = true;
			assert.deepEqual(oAnnotations.dataPointRating, this.oExpectedAnnotations.dataPointRating, "dataPointRating has the right properties.");
			this.oExpectedAnnotations.dataPointProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataPointProgress, this.oExpectedAnnotations.dataPointProgress, "dataPointProgress has the right properties.");
			this.oExpectedAnnotations.contact.ignore = true;
			assert.deepEqual(oAnnotations.contact, this.oExpectedAnnotations.contact, "contact has the right properties.");
			this.oExpectedAnnotations.columnImportance.ignore = false;
			assert.deepEqual(oAnnotations.columnImportance, this.oExpectedAnnotations.columnImportance, "columnImportance has the right properties.");
		});

		QUnit.test("Annotations for column type Connected fields", function() {
			// Arrange
			this.oGetColumnTypeStub.returns(COLUMNTYPE_CONNECTEDFIELDS);

			// Act
			var oAnnotations = ColumnDesigntime.getAnnotations(this.oElement, this.oResourceBundle);

			// Assert
			this._resolveFunctions(oAnnotations, this.oElement);

			this.oExpectedAnnotations.columnDataField.ignore = true;
			assert.deepEqual(oAnnotations.columnDataField, this.oExpectedAnnotations.columnDataField, "columnDataField has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithUrl.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithUrl, this.oExpectedAnnotations.columnDataFieldWithUrl, "columnDataFieldWithUrl has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithNavigationPath.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithNavigationPath, this.oExpectedAnnotations.columnDataFieldWithNavigationPath, "columnDataFieldWithNavigationPath has the right properties.");
			this.oExpectedAnnotations.dataFieldForAction.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAction, this.oExpectedAnnotations.dataFieldForAction, "dataFieldForAction has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartWithDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions, "dataFieldForAnnotationChartWithDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartNoDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions, "dataFieldForAnnotationChartNoDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationRating.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationRating, this.oExpectedAnnotations.dataFieldForAnnotationRating, "dataFieldForAnnotationRating has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationProgress, this.oExpectedAnnotations.dataFieldForAnnotationProgress, "dataFieldForAnnotationProgress has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationContact.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationContact, this.oExpectedAnnotations.dataFieldForAnnotationContact, "dataFieldForAnnotationContact has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields.ignore = false;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationConnectedFields, this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields, "dataFieldForAnnotationConnectedFields has the right properties.");
			this.oExpectedAnnotations.dataFieldWithIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldWithIBN, this.oExpectedAnnotations.dataFieldWithIBN, "dataFieldWithIBN has the right properties.");
			this.oExpectedAnnotations.dataFieldForIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForIBN, this.oExpectedAnnotations.dataFieldForIBN, "dataFieldForIBN has the right properties.");
			this.oExpectedAnnotations.chartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartWithDimensions, this.oExpectedAnnotations.chartWithDimensions, "chartWithDimensions has the right properties.");
			this.oExpectedAnnotations.chartNoDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartNoDimensions, this.oExpectedAnnotations.chartNoDimensions, "chartNoDimensions has the right properties.");
			this.oExpectedAnnotations.fieldGroup.ignore = false;
			assert.deepEqual(oAnnotations.fieldGroup, this.oExpectedAnnotations.fieldGroup, "fieldGroup has the right properties.");
			this.oExpectedAnnotations.dataPointRating.ignore = true;
			assert.deepEqual(oAnnotations.dataPointRating, this.oExpectedAnnotations.dataPointRating, "dataPointRating has the right properties.");
			this.oExpectedAnnotations.dataPointProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataPointProgress, this.oExpectedAnnotations.dataPointProgress, "dataPointProgress has the right properties.");
			this.oExpectedAnnotations.contact.ignore = true;
			assert.deepEqual(oAnnotations.contact, this.oExpectedAnnotations.contact, "contact has the right properties.");
			this.oExpectedAnnotations.columnImportance.ignore = false;
			assert.deepEqual(oAnnotations.columnImportance, this.oExpectedAnnotations.columnImportance, "columnImportance has the right properties.");
		});

		QUnit.test("Annotations for column type Chart, chart type Donut", function() {
			// Arrange
			this.oGetColumnTypeStub.returns(COLUMNTYPE_CHART);
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType").returns(CHARTTYPE_DONUT);

			// Act
			var oAnnotations = ColumnDesigntime.getAnnotations(this.oElement, this.oResourceBundle);

			// Assert
			this._resolveFunctions(oAnnotations, this.oElement);

			this.oExpectedAnnotations.columnDataField.ignore = true;
			assert.deepEqual(oAnnotations.columnDataField, this.oExpectedAnnotations.columnDataField, "columnDataField has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithUrl.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithUrl, this.oExpectedAnnotations.columnDataFieldWithUrl, "columnDataFieldWithUrl has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithNavigationPath.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithNavigationPath, this.oExpectedAnnotations.columnDataFieldWithNavigationPath, "columnDataFieldWithNavigationPath has the right properties.");
			this.oExpectedAnnotations.dataFieldForAction.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAction, this.oExpectedAnnotations.dataFieldForAction, "dataFieldForAction has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartWithDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions, "dataFieldForAnnotationChartWithDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions.ignore = false;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartNoDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions, "dataFieldForAnnotationChartNoDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationRating.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationRating, this.oExpectedAnnotations.dataFieldForAnnotationRating, "dataFieldForAnnotationRating has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationProgress, this.oExpectedAnnotations.dataFieldForAnnotationProgress, "dataFieldForAnnotationProgress has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationContact.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationContact, this.oExpectedAnnotations.dataFieldForAnnotationContact, "dataFieldForAnnotationContact has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationConnectedFields, this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields, "dataFieldForAnnotationConnectedFields has the right properties.");
			this.oExpectedAnnotations.dataFieldWithIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldWithIBN, this.oExpectedAnnotations.dataFieldWithIBN, "dataFieldWithIBN has the right properties.");
			this.oExpectedAnnotations.dataFieldForIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForIBN, this.oExpectedAnnotations.dataFieldForIBN, "dataFieldForIBN has the right properties.");
			this.oExpectedAnnotations.chartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartWithDimensions, this.oExpectedAnnotations.chartWithDimensions, "chartWithDimensions has the right properties.");
			this.oExpectedAnnotations.chartNoDimensions.ignore = false;
			assert.deepEqual(oAnnotations.chartNoDimensions, this.oExpectedAnnotations.chartNoDimensions, "chartNoDimensions has the right properties.");
			this.oExpectedAnnotations.fieldGroup.ignore = true;
			assert.deepEqual(oAnnotations.fieldGroup, this.oExpectedAnnotations.fieldGroup, "fieldGroup has the right properties.");
			this.oExpectedAnnotations.dataPointRating.ignore = true;
			assert.deepEqual(oAnnotations.dataPointRating, this.oExpectedAnnotations.dataPointRating, "dataPointRating has the right properties.");
			this.oExpectedAnnotations.dataPointProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataPointProgress, this.oExpectedAnnotations.dataPointProgress, "dataPointProgress has the right properties.");
			this.oExpectedAnnotations.contact.ignore = true;
			assert.deepEqual(oAnnotations.contact, this.oExpectedAnnotations.contact, "contact has the right properties.");
			this.oExpectedAnnotations.columnImportance.ignore = false;
			assert.deepEqual(oAnnotations.columnImportance, this.oExpectedAnnotations.columnImportance, "columnImportance has the right properties.");

			this.oGetChartTypeStub.restore();
		});

		QUnit.test("Annotations for column type Chart, chart type Bullet", function() {
			// Arrange
			this.oGetColumnTypeStub.returns(COLUMNTYPE_CHART);
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType").returns(CHARTTYPE_BULLET);

			// Act
			var oAnnotations = ColumnDesigntime.getAnnotations(this.oElement, this.oResourceBundle);

			// Assert
			this._resolveFunctions(oAnnotations, this.oElement);

			this.oExpectedAnnotations.columnDataField.ignore = true;
			assert.deepEqual(oAnnotations.columnDataField, this.oExpectedAnnotations.columnDataField, "columnDataField has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithUrl.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithUrl, this.oExpectedAnnotations.columnDataFieldWithUrl, "columnDataFieldWithUrl has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithNavigationPath.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithNavigationPath, this.oExpectedAnnotations.columnDataFieldWithNavigationPath, "columnDataFieldWithNavigationPath has the right properties.");
			this.oExpectedAnnotations.dataFieldForAction.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAction, this.oExpectedAnnotations.dataFieldForAction, "dataFieldForAction has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartWithDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions, "dataFieldForAnnotationChartWithDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions.ignore = false;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartNoDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions, "dataFieldForAnnotationChartNoDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationRating.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationRating, this.oExpectedAnnotations.dataFieldForAnnotationRating, "dataFieldForAnnotationRating has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationProgress, this.oExpectedAnnotations.dataFieldForAnnotationProgress, "dataFieldForAnnotationProgress has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationContact.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationContact, this.oExpectedAnnotations.dataFieldForAnnotationContact, "dataFieldForAnnotationContact has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationConnectedFields, this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields, "dataFieldForAnnotationConnectedFields has the right properties.");
			this.oExpectedAnnotations.dataFieldWithIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldWithIBN, this.oExpectedAnnotations.dataFieldWithIBN, "dataFieldWithIBN has the right properties.");
			this.oExpectedAnnotations.dataFieldForIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForIBN, this.oExpectedAnnotations.dataFieldForIBN, "dataFieldForIBN has the right properties.");
			this.oExpectedAnnotations.chartWithDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartWithDimensions, this.oExpectedAnnotations.chartWithDimensions, "chartWithDimensions has the right properties.");
			this.oExpectedAnnotations.chartNoDimensions.ignore = false;
			assert.deepEqual(oAnnotations.chartNoDimensions, this.oExpectedAnnotations.chartNoDimensions, "chartNoDimensions has the right properties.");
			this.oExpectedAnnotations.fieldGroup.ignore = true;
			assert.deepEqual(oAnnotations.fieldGroup, this.oExpectedAnnotations.fieldGroup, "fieldGroup has the right properties.");
			this.oExpectedAnnotations.dataPointRating.ignore = true;
			assert.deepEqual(oAnnotations.dataPointRating, this.oExpectedAnnotations.dataPointRating, "dataPointRating has the right properties.");
			this.oExpectedAnnotations.dataPointProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataPointProgress, this.oExpectedAnnotations.dataPointProgress, "dataPointProgress has the right properties.");
			this.oExpectedAnnotations.contact.ignore = true;
			assert.deepEqual(oAnnotations.contact, this.oExpectedAnnotations.contact, "contact has the right properties.");
			this.oExpectedAnnotations.columnImportance.ignore = false;
			assert.deepEqual(oAnnotations.columnImportance, this.oExpectedAnnotations.columnImportance, "columnImportance has the right properties.");

			this.oGetChartTypeStub.restore();
		});

		QUnit.test("Annotations for column type Chart, chart type Area", function() {
			// Arrange
			this.oGetColumnTypeStub.returns(COLUMNTYPE_CHART);
			this.oGetChartTypeStub = sinon.stub(ChartType, "getChartType").returns(CHARTTYPE_AREA);

			// Act
			var oAnnotations = ColumnDesigntime.getAnnotations(this.oElement, this.oResourceBundle);

			// Assert
			this._resolveFunctions(oAnnotations, this.oElement);

			this.oExpectedAnnotations.columnDataField.ignore = true;
			assert.deepEqual(oAnnotations.columnDataField, this.oExpectedAnnotations.columnDataField, "columnDataField has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithUrl.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithUrl, this.oExpectedAnnotations.columnDataFieldWithUrl, "columnDataFieldWithUrl has the right properties.");
			this.oExpectedAnnotations.columnDataFieldWithNavigationPath.ignore = true;
			assert.deepEqual(oAnnotations.columnDataFieldWithNavigationPath, this.oExpectedAnnotations.columnDataFieldWithNavigationPath, "columnDataFieldWithNavigationPath has the right properties.");
			this.oExpectedAnnotations.dataFieldForAction.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAction, this.oExpectedAnnotations.dataFieldForAction, "dataFieldForAction has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions.ignore = false;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartWithDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartWithDimensions, "dataFieldForAnnotationChartWithDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationChartNoDimensions, this.oExpectedAnnotations.dataFieldForAnnotationChartNoDimensions, "dataFieldForAnnotationChartNoDimensions has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationRating.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationRating, this.oExpectedAnnotations.dataFieldForAnnotationRating, "dataFieldForAnnotationRating has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationProgress, this.oExpectedAnnotations.dataFieldForAnnotationProgress, "dataFieldForAnnotationProgress has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationContact.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationContact, this.oExpectedAnnotations.dataFieldForAnnotationContact, "dataFieldForAnnotationContact has the right properties.");
			this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForAnnotationConnectedFields, this.oExpectedAnnotations.dataFieldForAnnotationConnectedFields, "dataFieldForAnnotationConnectedFields has the right properties.");
			this.oExpectedAnnotations.dataFieldWithIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldWithIBN, this.oExpectedAnnotations.dataFieldWithIBN, "dataFieldWithIBN has the right properties.");
			this.oExpectedAnnotations.dataFieldForIBN.ignore = true;
			assert.deepEqual(oAnnotations.dataFieldForIBN, this.oExpectedAnnotations.dataFieldForIBN, "dataFieldForIBN has the right properties.");
			this.oExpectedAnnotations.chartWithDimensions.ignore = false;
			assert.deepEqual(oAnnotations.chartWithDimensions, this.oExpectedAnnotations.chartWithDimensions, "chartWithDimensions has the right properties.");
			this.oExpectedAnnotations.chartNoDimensions.ignore = true;
			assert.deepEqual(oAnnotations.chartNoDimensions, this.oExpectedAnnotations.chartNoDimensions, "chartNoDimensions has the right properties.");
			this.oExpectedAnnotations.fieldGroup.ignore = true;
			assert.deepEqual(oAnnotations.fieldGroup, this.oExpectedAnnotations.fieldGroup, "fieldGroup has the right properties.");
			this.oExpectedAnnotations.dataPointRating.ignore = true;
			assert.deepEqual(oAnnotations.dataPointRating, this.oExpectedAnnotations.dataPointRating, "dataPointRating has the right properties.");
			this.oExpectedAnnotations.dataPointProgress.ignore = true;
			assert.deepEqual(oAnnotations.dataPointProgress, this.oExpectedAnnotations.dataPointProgress, "dataPointProgress has the right properties.");
			this.oExpectedAnnotations.contact.ignore = true;
			assert.deepEqual(oAnnotations.contact, this.oExpectedAnnotations.contact, "contact has the right properties.");
			this.oExpectedAnnotations.columnImportance.ignore = false;
			assert.deepEqual(oAnnotations.columnImportance, this.oExpectedAnnotations.columnImportance, "columnImportance has the right properties.");

			this.oGetChartTypeStub.restore();
		});

		/***************************************************/
		QUnit.module("The function getCommonInstanceData", {

			beforeEach: function() {
				this.oSmartControlStub = {
					getCustomData: function() {
						return;
					}
				};
				this.oDataEntityType = {
					namespace: "ns",
					name: "MyEntityType"
				};
				this.oGetMeasureDefinitionStub = sinon.stub(ChartMeasures, "getMeasureDefinition ").returns({});
				this.oGetLineItemsStub = sinon.stub(Utils, "getLineItems").returns([]);
				this.sut = ColumnDesigntime.getDesigntime();
				this.sut.oGetSmartTableControl = sinon.stub(AnnotationHelper, "getSmartTableControl").returns(this.oSmartControlStub);
				this.sut.oGetLineItemQualifier = sinon.stub(AnnotationHelper, "getLineItemQualifier");
			},
			afterEach: function() {
				this.oGetLineItemsStub.restore();
				this.oGetMeasureDefinitionStub.restore();
				this.sut.oGetSmartTableControl.restore();
				this.sut.oGetLineItemQualifier.restore();
			}
		});

		QUnit.test("getCommonInstanceData", function() {
			// Arrange
			this.oGetIndexStub = sinon.stub(Utils, "getLineItemRecordIndex").returns(1);
			this.oGetODataEntityTypeStub = sinon.stub(Utils, "getODataEntityType");

			var oElement =  {
				getModel: function() {
					return {
						getMetaModel: function() {
							return {};
						}
					};
				}
			};

			// Act
			var oCommonInstanceData = this.sut.getCommonInstanceData(oElement);

			// Assert
			var oExpectedInstanceData = {
				annotation: LINEITEM,
				target: undefined,
				qualifier: null
			};
			assert.deepEqual(oCommonInstanceData, oExpectedInstanceData , "returns no target if no entity type can be determined");

			this.oGetIndexStub.restore();
			this.oGetODataEntityTypeStub.restore();
		});

		QUnit.test("getCommonInstanceData", function() {
			// Arrange
			this.oGetIndexStub = sinon.stub(Utils, "getLineItemRecordIndex").returns(-1);
			this.oGetODataEntityTypeStub = sinon.stub(Utils, "getODataEntityType").returns(this.oDataEntityType);

			var oElement =  {
				getModel: function() {
					return {
						getMetaModel: function() {
							return {
								/*getODataEntityType: function() {
									return {
										namespace: "ns",
										name: "MyEntityType"
									};
								}*/
							};
						}
					};
				}
			};

			// Act
			var oCommonInstanceData = this.sut.getCommonInstanceData(oElement);

			// Assert
			var oExpectedInstanceData = {
				annotation: LINEITEM,
				target: undefined,
				qualifier: null
			};
			assert.deepEqual(oCommonInstanceData, oExpectedInstanceData , "returns no target if no record could be identified");

			this.oGetIndexStub.restore();
			this.oGetODataEntityTypeStub.restore();
		});

		QUnit.test("getCommonInstanceData", function() {
			// Arrange
			this.oGetIndexStub = sinon.stub(Utils, "getLineItemRecordIndex").returns(1);
			this.oGetODataEntityTypeStub = sinon.stub(Utils, "getODataEntityType").returns(this.oDataEntityType);

			var oElement =  {
				getModel: function() {
					return {
						getMetaModel: function() {
							return {
								/*getODataEntityType: function() {
									return {
										namespace: "ns",
										name: "MyEntityType"
									};
								}*/
							};
						}
					};
				}
			};

			// Act
			var oCommonInstanceData = this.sut.getCommonInstanceData(oElement);

			// Assert
			var oExpectedInstanceData = {
				annotation: LINEITEM,
				target: "ns.MyEntityType/" + LINEITEM + "/1" ,
				qualifier: null
			};
			assert.deepEqual(oCommonInstanceData, oExpectedInstanceData , "returns the right target for a record");

			this.oGetIndexStub.restore();
			this.oGetODataEntityTypeStub.restore();
		});
	});
