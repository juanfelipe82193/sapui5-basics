/*global QUnit,sinon*/

sap.ui.require([
	"sap/ui/comp/smartmicrochart/SmartHarveyBallMicroChart",
	"sap/ui/comp/providers/ChartProvider",
	"sap/ui/model/Model",
	"sap/ui/core/format/NumberFormat",
	"sap/ui/core/CustomData",
	"sap/ui/model/json/JSONModel",
	"sap/m/Label",
	"sap/suite/ui/microchart/HarveyBallMicroChart",
	"sap/m/Button"
], function (SmartHarveyBallMicroChart, ChartProvider, Model, NumberFormat, CustomData,
			 JSONModel, Label, HarveyBallMicroChart, Button) {
	"use strict";

	QUnit.module("SmartHarveyBallMicroChart", {
		beforeEach: function () {
			this.oChart = new SmartHarveyBallMicroChart({
				id: "smart-HarveyBall-microchart"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oChart.destroy();
		}
	});

	QUnit.test("Property chartType is read-only", function (assert) {
		this.oChart.setChartType("SomeType");
		assert.equal(this.oChart.getChartType(), "Pie", "ChartType cannot be overwritten by setter.");
	});

	QUnit.test("Should have an entitySet property from constructor", function (assert) {
		var oChart = new SmartHarveyBallMicroChart({
			entitySet: "Otto"
		});
		assert.strictEqual(oChart.getEntitySet(), "Otto");
		oChart.destroy();
	});

	QUnit.test("Check default values", function (assert) {
		assert.equal(this.oChart.getChartType(), "Pie", "ChartType default value is correct.");
		assert.equal(this.oChart.getEntitySet(), "", "EntitySet default value is correct.");
		assert.equal(this.oChart.getChartBindingPath(), "", "ChartBindingPath default value is correct.");
		assert.equal(this.oChart.getWidth(), undefined, "Width default value is correct.");
		assert.equal(this.oChart.getHeight(), undefined, "Height default value is correct.");
		assert.notOk(this.oChart.getIsResponsive(), "isResponsive default value is correct.");
		assert.strictEqual(SmartHarveyBallMicroChart.getMetadata()._sDefaultAggregation, "_chart", "The default aggregation is correctly set to _chart");
	});

	QUnit.test("Check setter for 'entitySet' Property", function (assert) {
		var oSpy = sinon.spy(this.oChart, "_initializeMetadata");
		this.oChart.setEntitySet("MySet");
		assert.strictEqual(oSpy.callCount, 1, "Method _initializeMetadata is called when entitySet has changed.");
		assert.strictEqual(this.oChart.getEntitySet(), "MySet", "EntitySet has been correctly set.");

		this.oChart.setEntitySet("MySet");
		assert.strictEqual(oSpy.callCount, 1, "Method _initializeMetadata is not called when entitySet has not changed.");

		oSpy.restore();
	});

	QUnit.test("Attaching a model ends in metadata initialization", function (assert) {
		var oSpy = sinon.spy(this.oChart, "propagateProperties");
		sinon.stub(this.oChart, "_initializeMetadata");

		this.oChart.setModel(new Model());

		assert.ok(this.oChart._initializeMetadata.calledOnce, "Attaching a model ends in property propagation which ends in init metadata.");
		assert.deepEqual(oSpy.callCount, 1, "Function propagateProperties has been called once.");

		this.oChart._initializeMetadata.restore();
	});

	QUnit.test("ChartProvider is created with correct parameters", function (assert) {
		var sEntitySet = "MySet";
		var oModel = new Model();
		this.oChart.setEntitySet(sEntitySet);

		sinon.stub(this.oChart, "getModel").returns(oModel);
		this.oChart._createChartProvider.apply(this.oChart);

		assert.ok(this.oChart._oChartProvider, "Internal ChartProvider created.");
		assert.strictEqual(this.oChart._oChartProvider.sEntitySet, sEntitySet);
		assert.strictEqual(this.oChart._oChartProvider._oParentODataModel, oModel);
	});

	QUnit.test("Should pass the Qualifier to the ChartProvider by adding CustomData", function (assert) {
		var oCustomData = new CustomData({
			key: "chartQualifier",
			value: "HarveyBallChartQualifier"
		});
		this.oChart.setEntitySet("MySet");
		this.oChart.addCustomData(oCustomData);

		sinon.stub(this.oChart, "getModel").returns(new Model());

		this.oChart._createChartProvider.apply(this.oChart);

		assert.ok(this.oChart._oChartProvider, "ChartProvider was created successfully");
		assert.strictEqual(this.oChart._oChartProvider._sChartQualifier, "HarveyBallChartQualifier", "chartQualifier was set in ChartProvider successfully");
	});

	QUnit.test("Should pass the Qualifier to the ChartProvider by calling data()", function (assert) {
		this.oChart.setEntitySet("MySet");
		this.oChart.data("chartQualifier", "HarveyBallChartQualifier");

		sinon.stub(this.oChart, "getModel").returns(new Model());

		this.oChart._createChartProvider.apply(this.oChart);

		assert.ok(this.oChart._oChartProvider, "ChartProvider was created successfully");
		assert.strictEqual(this.oChart._oChartProvider._sChartQualifier, "HarveyBallChartQualifier", "chartQualifier was set in ChartProvider successfully");
	});

	QUnit.test("Check if MetaModel loading mechanism is working for abtract Model implementations", function (assert) {
		var oModel = new Model();
		sinon.spy(this.oChart, "_initializeMetadata");
		sinon.stub(this.oChart, "_onMetadataInitialized");

		this.oChart.setModel(oModel);

		assert.strictEqual(this.oChart._initializeMetadata.callCount, 1, "_initializeMetadata has been called exactly one time");
		assert.strictEqual(this.oChart._onMetadataInitialized.callCount, 1, "_onMetadataInitialized has been called");

		this.oChart._initializeMetadata.restore();
		this.oChart._onMetadataInitialized.restore();
	});

	QUnit.module("Function _getBindingPath", {
		beforeEach: function () {
			this.oChart = new SmartHarveyBallMicroChart();
		},
		afterEach: function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Control has chartBindingPath", function (assert) {
		this.oChart.setChartBindingPath("/Some/Path");

		assert.equal(this.oChart._getBindingPath(), "/Some/Path", "ChartBindingPath has been correctly returned.");
	});

	QUnit.test("Control has entitySet", function (assert) {
		this.oChart.setEntitySet("Enten");

		assert.equal(this.oChart._getBindingPath(), "/Enten", "/{entitySet} has been correctly returned.");
	});

	QUnit.test("Control has entitySet and chartBindingPath", function (assert) {
		this.oChart.setChartBindingPath("/Some/Path");
		this.oChart.setEntitySet("Enten");

		assert.equal(this.oChart._getBindingPath(), "/Some/Path", "ChartBindingPath has been correctly returned.");
	});

	QUnit.test("Control has neither property", function (assert) {
		assert.equal(this.oChart._getBindingPath(), "", "Empty string has been returned.");
	});

	QUnit.module("Function _updateAssociations", {
		beforeEach: function () {
			this.oChart = new SmartHarveyBallMicroChart({
				id: "smart-HarveyBall-microchart"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			this.oChart._oChartViewMetadata = {
				annotation: {
					Title: {Path: "Title"}
				}
			};
			sinon.stub(this.oChart, "_checkChartMetadata").returns(true);
			sinon.stub(this.oChart, "_onMetadataInitialized");
			this.oChart._sBindingPath = "/Products";

		},
		afterEach: function () {
			this.oChart.destroy();
			this.oChart._checkChartMetadata.restore();
			this.oChart._onMetadataInitialized.restore();
		}
	});

	QUnit.test("Model is attached", function (assert) {
		var oModel = new JSONModel({
			Title: "My Title"
		});
		var oDataBinding = {
			getContexts: function () {
				return [
					oModel.createBindingContext("/")
				];
			}
		};
		this.oChart.setModel(oModel);
		var oChartTitle = new Label({text: "DefaultText"});
		this.oChart.setChartTitle(oChartTitle);

		this.oChart._updateAssociations(oDataBinding);

		assert.equal(oChartTitle.getText(), "My Title", "Aggregation has been updated.");
	});

	QUnit.module("Aria test delegeting", {
		beforeEach: function () {
			this.oSHBMC = new SmartHarveyBallMicroChart();
			this.oMC = new HarveyBallMicroChart();
			this.oSHBMC.setAggregation("_chart", this.oMC);
			this.oButton1 = new Button();
			this.oButton2 = new Button();
			this.oButton3 = new Button();
		},
		afterEach: function () {
			this.oSHBMC.destroy();
			this.oMC.destroy();
		}
	});

	QUnit.test("Test addAriaLabelledBy", function (assert) {
		var oSpyAriaLabelledBy = sinon.spy(this.oMC, "addAriaLabelledBy");

		this.oSHBMC.addAriaLabelledBy(this.oButton1);
		assert.ok(this.oMC.addAriaLabelledBy.calledOnce, "If addAriaLabelledBy function was called in MicroChart from SmartMicroChart exactly once");
		oSpyAriaLabelledBy.restore();
	});

	QUnit.test("Test removeAriaLabelledBy", function (assert) {
		var oSpyAriaLabelledBy = sinon.spy(this.oMC, "removeAriaLabelledBy");

		this.oSHBMC.addAriaLabelledBy(this.oButton1);
		this.oSHBMC.removeAriaLabelledBy(this.oButton1);
		assert.ok(this.oMC.removeAriaLabelledBy.calledOnce, "If removeAriaLabelledBy was called in MicroChart from SmartMicroChart exactly once");
		oSpyAriaLabelledBy.restore();
	});

	QUnit.test("Test removeAllAriaLabelledBy", function (assert) {
		var oSpyAriaLabelledBy = sinon.spy(this.oMC, "removeAllAriaLabelledBy");

		this.oSHBMC.addAriaLabelledBy(this.oButton1);
		this.oSHBMC.addAriaLabelledBy(this.oButton2);
		this.oSHBMC.addAriaLabelledBy(this.oButton3);

		this.oSHBMC.removeAllAriaLabelledBy(this.oText);
		assert.ok(this.oMC.removeAllAriaLabelledBy.calledOnce, "If removeAllAriaLabelledBy was called in MicroChart from SmartMicroChart exactly once");
		oSpyAriaLabelledBy.restore();
	});

	QUnit.module("sap.ui.comp.smartmicrochart.SmartHarveyBallMicroChart calculation", {
		beforeEach: function () {
			this.oChart = new SmartHarveyBallMicroChart({
				id: "smart-HarveyBall-microchart",
				entitySet: "Products"
			}).placeAt("qunit-fixture");

			sinon.stub(this.oChart, "_getPropertyAnnotation").returns({
				ISOCurrency: {
					Path: "Unit"
				},
				Label: {
					Path: "Unit"
				}
			});

			this.oChart._oChartViewMetadata = {
				annotation: {
					Measures: [
						{
							PropertyPath: "Sold"
						}],
					MeasureAttributes: [
						{
							DataPoint: {AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint"},
							RecordType: "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType"
						}
					]
				},
				measureFields: ["Sold"],
				dimensionFields: [],
				fields: []
			};
			this.oChart._sBindingPath = "/Products";
			this.oChart._oDataPointAnnotations = {
				Criticality: {
					Path: "Criticality"
				},
				Value: {
					Path: "Sold"
				},
				MaximumValue: {
					Path: "Produced"
				}
			};

			var oModel = new JSONModel({
				Products: [
					{
						Sold: 100,
						Produced: 150,
						Ctiticality: "Negative",
						Unit: "Mrd"
					},
					{
						Sold: 100,
						Produced: 150,
						Ctiticality: "Negative",
						Unit: "Mrd"
					}
				]
			});
			this.oChart.setModel(oModel);

			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oChart.destroy();
		}
	});

	QUnit.test("Check chart and target binding", function (assert) {
		this.oChart._createAndBindInnerChart();
		var oChart = this.oChart.getAggregation("_chart");

		assert.strictEqual(oChart.getBindingInfo("total").binding.getPath(), "Produced", "The total was bound successfully");
		assert.strictEqual(oChart.getBindingInfo("totalScale").binding.getPath(), "Unit", "The totalScale was bound successfully");
		assert.strictEqual(oChart.getItems()[0].getBindingInfo("color").binding.getPath(), "Criticality", "The color was bound successfully");
		assert.strictEqual(oChart.getItems()[0].getBindingInfo("fraction").binding.getPath(), "Sold", "The fraction was bound successfully");
		assert.strictEqual(oChart.getItems()[0].getBindingInfo("fractionScale").binding.getPath(), "Unit", "The fractionScale was bound successfully");

		this.oChart._getPropertyAnnotation.restore();
	});

	QUnit.test("Height and width not set when isResponsive true", function (assert) {
		this.oChart.setWidth("200px");
		this.oChart.setIsResponsive(true);

		sap.ui.getCore().applyChanges();

		assert.equal(this.oChart.getAggregation("_chart").getWidth(), "200px", "width is used when isResponsive is set on inner chart");
		assert.equal(this.oChart.getAggregation("_chart").getSize(), "Responsive", "responsive size is on inner chart");
	});

	QUnit.test("Height and width set when isResponsive false", function (assert) {
		this.oChart.setWidth("200px");
		this.oChart.setIsResponsive(false);

		sap.ui.getCore().applyChanges();

		assert.equal(this.oChart.getAggregation("_chart").getWidth(), "200px", "width is used when isResponsive is not set on inner chart");
		assert.notEqual(this.oChart.getAggregation("_chart").getSize(), "Responsive", "responsive size is on inner chart");
	});

	QUnit.test("Css class is set when isResponsive", function (assert) {
		this.oChart.setIsResponsive(false);

		sap.ui.getCore().applyChanges();

		assert.notOk(this.oChart.$().hasClass("sapSuiteUiSmartMicroChartResponsive"), "responsive class is not set");

		this.oChart.setIsResponsive(true);

		sap.ui.getCore().applyChanges();

		assert.ok(this.oChart.$().hasClass("sapSuiteUiSmartMicroChartResponsive"), "responsive class is set");
	});


	QUnit.start();
});
