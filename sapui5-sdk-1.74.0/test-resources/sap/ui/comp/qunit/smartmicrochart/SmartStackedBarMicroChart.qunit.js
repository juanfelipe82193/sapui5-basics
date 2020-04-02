/*global QUnit,sinon*/

sap.ui.require([
	"sap/ui/comp/smartmicrochart/SmartStackedBarMicroChart",
	"sap/ui/comp/providers/ChartProvider",
	"sap/ui/model/Model",
	"sap/ui/core/format/NumberFormat",
	"sap/ui/core/CustomData",
	"sap/ui/model/json/JSONModel",
	"sap/m/Label",
	"sap/suite/ui/microchart/StackedBarMicroChart",
	"sap/suite/ui/microchart/library",
	"sap/m/Button"
], function (SmartStackedBarMicroChart, ChartProvider, Model, NumberFormat, CustomData,
			 JSONModel, Label, StackedBarMicroChart, library, Button) {
	"use strict";

	QUnit.module("SmartBulletMicroChart", {
		beforeEach: function() {
			this.oSSBMC = new SmartStackedBarMicroChart({
				id: "smart-stackedbar-microchart"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oSSBMC.destroy();
		}
	});

	QUnit.test("Property chartType is read-only", function(assert) {
		this.oSSBMC.setChartType("SomeType");
		assert.equal(this.oSSBMC.getChartType(), "BarStacked", "ChartType cannot be overwritten by setter.");
	});

	QUnit.test("Should have an entitySet property from constructor", function(assert) {
		var oSSBMC = new SmartStackedBarMicroChart({
			entitySet: "Otto"
		});
		assert.strictEqual(oSSBMC.getEntitySet(), "Otto");
		oSSBMC.destroy();
	});

	QUnit.test("Check default values", function(assert) {
		assert.equal(this.oSSBMC.getChartType(), "BarStacked", "ChartType default value is correct.");
		assert.equal(this.oSSBMC.getEntitySet(), "", "EntitySet default value is correct.");
		assert.equal(this.oSSBMC.getChartBindingPath(), "", "ChartBindingPath default value is correct.");
		assert.equal(this.oSSBMC.getWidth(), undefined, "Width default value is correct.");
		assert.equal(this.oSSBMC.getHeight(), undefined, "Height default value is correct.");
		assert.notOk(this.oSSBMC.getIsResponsive(), "isResponsive default value is correct.");
		assert.strictEqual(SmartStackedBarMicroChart.getMetadata()._sDefaultAggregation, "_chart", "The default aggregation is correctly set to _chart");
	});

	QUnit.test("Check setter for 'entitySet' Property", function(assert) {
		var oSpy = sinon.spy(this.oSSBMC, "_initializeMetadata");
		this.oSSBMC.setEntitySet("MySet");
		assert.strictEqual(oSpy.callCount, 1, "Method _initializeMetadata is called when entitySet has changed.");
		assert.strictEqual(this.oSSBMC.getEntitySet(), "MySet", "EntitySet has been correctly set.");

		this.oSSBMC.setEntitySet("MySet");
		assert.strictEqual(oSpy.callCount, 1, "Method _initializeMetadata is not called when entitySet has not changed.");

		oSpy.restore();
	});


	QUnit.test("Attaching a model ends in metadata initialization", function(assert) {
		var oSpy = sinon.spy(this.oSSBMC, "propagateProperties");
		sinon.stub(this.oSSBMC, "_initializeMetadata");

		this.oSSBMC.setModel(new Model());

		assert.ok(this.oSSBMC._initializeMetadata.calledOnce, "Attaching a model ends in property propagation which ends in init metadata.");
		assert.deepEqual(oSpy.callCount, 1, "Function propagateProperties has been called once.");

		this.oSSBMC._initializeMetadata.restore();
	});

	QUnit.test("ChartProvider is created with correct parameters", function(assert) {
		var sEntitySet = "MySet";
		var oModel = new Model();
		this.oSSBMC.setEntitySet(sEntitySet);

		sinon.stub(this.oSSBMC, "getModel").returns(oModel);
		this.oSSBMC._createChartProvider.apply(this.oSSBMC);

		assert.ok(this.oSSBMC._oChartProvider, "Internal ChartProvider created.");
		assert.strictEqual(this.oSSBMC._oChartProvider.sEntitySet, sEntitySet);
		assert.strictEqual(this.oSSBMC._oChartProvider._oParentODataModel, oModel);
	});

	QUnit.test("Should pass the Qualifier to the ChartProvider by adding CustomData", function(assert) {
		var oCustomData = new CustomData({
			key: "chartQualifier",
			value: "StackedBarChartQualifier"
		});
		this.oSSBMC.setEntitySet("MySet");
		this.oSSBMC.addCustomData(oCustomData);

		sinon.stub(this.oSSBMC, "getModel").returns(new Model());

		this.oSSBMC._createChartProvider.apply(this.oSSBMC);

		assert.ok(this.oSSBMC._oChartProvider, "ChartProvider was created successfully");
		assert.strictEqual(this.oSSBMC._oChartProvider._sChartQualifier, "StackedBarChartQualifier", "chartQualifier was set in ChartProvider successfully");
	});

	QUnit.test("Should pass the Qualifier to the ChartProvider by calling data()", function(assert) {
		this.oSSBMC.setEntitySet("MySet");
		this.oSSBMC.data("chartQualifier", "StackedBarChartQualifier");

		sinon.stub(this.oSSBMC, "getModel").returns(new Model());

		this.oSSBMC._createChartProvider.apply(this.oSSBMC);

		assert.ok(this.oSSBMC._oChartProvider, "ChartProvider was created successfully");
		assert.strictEqual(this.oSSBMC._oChartProvider._sChartQualifier, "StackedBarChartQualifier", "chartQualifier was set in ChartProvider successfully");
	});

	QUnit.test("Check if MetaModel loading mechanism is working for abtract Model implementations", function(assert) {
		var oModel = new Model();
		sinon.spy(this.oSSBMC, "_initializeMetadata");
		sinon.stub(this.oSSBMC, "_onMetadataInitialized");

		this.oSSBMC.setModel(oModel);

		assert.strictEqual(this.oSSBMC._initializeMetadata.callCount, 1, "_initializeMetadata has been called exactly one time");
		assert.strictEqual(this.oSSBMC._onMetadataInitialized.callCount, 1, "_onMetadataInitialized has been called");

		this.oSSBMC._initializeMetadata.restore();
		this.oSSBMC._onMetadataInitialized.restore();
	});

	QUnit.module("Function _getBindingPath", {
		beforeEach: function() {
			this.oSSBMC = new SmartStackedBarMicroChart();
		},
		afterEach: function() {
			this.oSSBMC.destroy();
			this.oSSBMC = null;
		}
	});

	QUnit.test("Control has chartBindingPath", function(assert) {
		this.oSSBMC.setChartBindingPath("/Some/Path");

		assert.equal(this.oSSBMC._getBindingPath(), "/Some/Path", "ChartBindingPath has been correctly returned.");
	});

	QUnit.test("Control has entitySet", function(assert) {
		this.oSSBMC.setEntitySet("Enten");

		assert.equal(this.oSSBMC._getBindingPath(), "/Enten", "/{entitySet} has been correctly returned.");
	});

	QUnit.test("Control has entitySet and chartBindingPath", function(assert) {
		this.oSSBMC.setChartBindingPath("/Some/Path");
		this.oSSBMC.setEntitySet("Enten");

		assert.equal(this.oSSBMC._getBindingPath(), "/Some/Path", "ChartBindingPath has been correctly returned.");
	});

	QUnit.test("Control has neither property", function(assert) {
		assert.equal(this.oSSBMC._getBindingPath(), "", "Empty string has been returned.");
	});

	QUnit.module("Function _updateAssociations", {
		beforeEach: function() {
			this.oSSBMC = new SmartStackedBarMicroChart({
				id: "smart-stackedbar-microchart"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			this.oSSBMC._oChartViewMetadata = {
				annotation: {
					Title: { Path: "Title" }
				}
			};
			sinon.stub(this.oSSBMC, "_checkChartMetadata").returns(true);
			sinon.stub(this.oSSBMC, "_onMetadataInitialized");
			this.oSSBMC._sBindingPath = "/Series";

		},
		afterEach: function() {
			this.oSSBMC.destroy();
			this.oSSBMC._checkChartMetadata.restore();
			this.oSSBMC._onMetadataInitialized.restore();
		}
	});

	QUnit.test("Model is attached", function(assert) {
		var oModel = new JSONModel({
			Title: "My Title"
		});
		var oBarsBinding = {
			getContexts: function() {
				return [
					oModel.createBindingContext("/")
				];
			}
		};
		this.oSSBMC.setModel(oModel);
		var oChartTitle = new Label({ text: "DefaultText" });
		this.oSSBMC.setChartTitle(oChartTitle);

		this.oSSBMC._updateAssociations(oBarsBinding);

		assert.equal(oChartTitle.getText(), "My Title", "Aggregation has been updated.");
	});


	QUnit.module("Aria test delegeting", {
		beforeEach: function() {
			this.oSSBMC = new SmartStackedBarMicroChart();
			this.oMC = new StackedBarMicroChart();
			this.oSSBMC.setAggregation("_chart", this.oMC);
			this.oButton1 = new Button();
			this.oButton2 = new Button();
			this.oButton3 = new Button();
		},
		afterEach: function() {
			this.oSSBMC.destroy();
			this.oMC.destroy();
		}
	});

	QUnit.test("Test addAriaLabelledBy", function(assert) {
		var oSpyAriaLabelledBy = sinon.spy(this.oMC, "addAriaLabelledBy");

		this.oSSBMC.addAriaLabelledBy(this.oButton1);
		assert.ok(this.oMC.addAriaLabelledBy.calledOnce, "If addAriaLabelledBy function was called in MicroChart from SmartMicroChart exactly once");
		oSpyAriaLabelledBy.restore();
	});

	QUnit.test("Test removeAriaLabelledBy", function(assert) {
		var oSpyAriaLabelledBy = sinon.spy(this.oMC, "removeAriaLabelledBy");

		this.oSSBMC.addAriaLabelledBy(this.oButton1);
		this.oSSBMC.removeAriaLabelledBy(this.oButton1);
		assert.ok(this.oMC.removeAriaLabelledBy.calledOnce, "If removeAriaLabelledBy was called in MicroChart from SmartMicroChart exactly once");
		oSpyAriaLabelledBy.restore();
	});

	QUnit.test("Test removeAllAriaLabelledBy", function(assert) {
		var oSpyAriaLabelledBy = sinon.spy(this.oMC, "removeAllAriaLabelledBy");

		this.oSSBMC.addAriaLabelledBy(this.oButton1);
		this.oSSBMC.addAriaLabelledBy(this.oButton2);
		this.oSSBMC.addAriaLabelledBy(this.oButton3);

		this.oSSBMC.removeAllAriaLabelledBy(this.oText);
		assert.ok(this.oMC.removeAllAriaLabelledBy.calledOnce, "If removeAllAriaLabelledBy was called in MicroChart from SmartMicroChart exactly once");
		oSpyAriaLabelledBy.restore();
	});

	QUnit.module("sap.ui.comp.smartmicrochart.SmartStackedBarMicroChart calculation", {
		beforeEach: function() {
			this.oSSBMC = new SmartStackedBarMicroChart({
				id: "smart-stackedbar-microchart",
				entitySet: "Prices"
			}).placeAt("qunit-fixture");

			this.oSSBMC._oChartViewMetadata = {
				annotation: {
					ChartType: { EnumMember: "com.sap.vocabularies.UI.v1.ChartType/BarStacked" },
					Measures: [{ PropertyPath: "Price" }],
					MeasureAttributes: [{
						DataPoint: { AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#StackedBarChartDataPoint" },
						Measure: { PropertyPath: "Price" },
						RecordType: "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
						Role: { EnumMember: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1" }
					}]
				},
				measureFields: [{}],
				dimensionFields: ["Day"],
				fields: [
					{
						name: "Day"
					}
				]
			};
			this.oSSBMC._sBindingPath = "/Series";
			this.oSSBMC._oDataPointAnnotations = {
				Criticality: {
					Path: "Criticality"
				},
				Value: {
					Path: "Price"
				}
			};

			var oModel = new JSONModel({
				Prices: [
					{
						Price: 0,
						Ctiticality: "Neutral"
					}
				]
			});
			this.oSSBMC.setModel(oModel);

			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oSSBMC.destroy();
		}
	});

	QUnit.test("Check chart and target binding", function(assert) {
		sinon.stub(this.oSSBMC, "_getDataPointQualifier").returns("StackedBarChartDataPoint");
		sinon.stub(this.oSSBMC, "_getPropertyAnnotation").returns({});
		this.oSSBMC._createAndBindInnerChart();
		assert.strictEqual(this.oSSBMC.getAggregation("_chart").getBindingInfo("bars").template.getBindingPath("value"), "Price", "The aggregation value was bound successfully");
		assert.strictEqual(this.oSSBMC.getAggregation("_chart").getBindingInfo("bars").template.getBindingPath("valueColor"), "Criticality", "The aggregation valueColor was bound successfully");
		assert.strictEqual(this.oSSBMC.getAggregation("_chart").getBindingInfo("bars").template.getBindingPath("displayValue"), undefined, "The aggregation displayValue was not bound");
		this.oSSBMC._getDataPointQualifier.restore();
		this.oSSBMC._getPropertyAnnotation.restore();
	});

	QUnit.test("Height and width not set when isResponsive true", function(assert) {
		this.oSSBMC.setHeight("200px");
		this.oSSBMC.setWidth("200px");
		this.oSSBMC.setIsResponsive(true);

		sap.ui.getCore().applyChanges();

		assert.equal(this.oSSBMC.getAggregation("_chart").getWidth(), "200px", "width is used when isResponsive is set on inner chart");
		assert.equal(this.oSSBMC.getAggregation("_chart").getHeight(), "200px", "height is used when isResponsive is set on inner chart");
		assert.equal(this.oSSBMC.getAggregation("_chart").getSize(), "Responsive", "responsive size is on inner chart");
	});

	QUnit.test("Height and width set when isResponsive false", function(assert) {
		this.oSSBMC.setHeight("200px");
		this.oSSBMC.setWidth("200px");
		this.oSSBMC.setIsResponsive(false);

		sap.ui.getCore().applyChanges();

		assert.equal(this.oSSBMC.getAggregation("_chart").getWidth(), "200px", "width is used when isResponsive is not set on inner chart");
		assert.equal(this.oSSBMC.getAggregation("_chart").getHeight(), "200px", "height is used when isResponsive is not set on inner chart");
		assert.notEqual(this.oSSBMC.getAggregation("_chart").getSize(), "Responsive", "responsive size is on inner chart");
	});

	QUnit.test("Css class is set when isResponsive", function(assert) {
		this.oSSBMC.setIsResponsive(false);

		sap.ui.getCore().applyChanges();

		assert.notOk(this.oSSBMC.$().hasClass("sapSuiteUiSmartMicroChartResponsive"), "responsive class is not set");

		this.oSSBMC.setIsResponsive(true);

		sap.ui.getCore().applyChanges();

		assert.ok(this.oSSBMC.$().hasClass("sapSuiteUiSmartMicroChartResponsive"), "responsive class is set");
	});

	QUnit.module("sap.ui.comp.smartmicrochart.SmartStackedBarMicroChart calculation 2", {
		beforeEach: function() {
			this.oSSBMC = new SmartStackedBarMicroChart({
				id: "smart-stackedbar-microchart"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
			this.oSSBMC._oChartViewMetadata = {
				annotation: {
					ChartType: { EnumMember: "com.sap.vocabularies.UI.v1.ChartType/BarStacked" },
					Measures: [{ PropertyPath: "Price" }],
					MeasureAttributes: [{
						DataPoint: { AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#StackedBarChartDataPoint" },
						Measure: { PropertyPath: "Price" },
						RecordType: "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
						Role: { EnumMember: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1" }
					}]
				},
				measureFields: [{}],
				dimensionFields: ["Day"],
				fields: [
					{
						name: "Day"
					}
				]
			};
			this.oSSBMC._sBindingPath = "/Series";
			this.oSSBMC._oDataPointAnnotations = {
				Value: {
					Path: "Price"
				}
			};
		},
		afterEach: function() {
			this.oSSBMC.destroy();
		}
	});

	QUnit.test("Check chart and target binding", function(assert) {
		sinon.stub(this.oSSBMC, "_getDataPointQualifier").returns("StackedBarChartDataPoint");
		sinon.stub(this.oSSBMC, "_getPropertyAnnotation").returns(
				{
					"com.sap.vocabularies.Common.v1.Text": {
						Path: "DisplayValue"
					}
				}
		);
		this.oSSBMC._createAndBindInnerChart();
		assert.strictEqual(this.oSSBMC.getAggregation("_chart").getBindingInfo("bars").template.getBindingPath("value"), "Price", "The aggregation value was bound successfully");
		assert.strictEqual(this.oSSBMC.getAggregation("_chart").getBindingInfo("bars").template.getBindingPath("valueColor"), undefined, "The aggregation valueColor was not bound");
		assert.strictEqual(this.oSSBMC.getAggregation("_chart").getBindingInfo("bars").template.getBindingPath("displayValue"), "DisplayValue", "The aggregation displayValue was bound successfully");
		this.oSSBMC._getDataPointQualifier.restore();
		this.oSSBMC._getPropertyAnnotation.restore();
	});

	QUnit.start();
});
