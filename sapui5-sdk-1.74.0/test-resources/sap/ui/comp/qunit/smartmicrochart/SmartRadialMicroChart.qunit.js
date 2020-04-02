/*global QUnit,sinon*/

sap.ui.require([
	"jquery.sap.global",
	"sap/ui/comp/smartmicrochart/SmartRadialMicroChart",
	"sap/ui/comp/smartmicrochart/SmartMicroChartBase",
	"sap/ui/core/CustomData",
	"sap/ui/model/Model",
	"sap/ui/comp/providers/ChartProvider",
	"sap/ui/model/json/JSONModel",
	"sap/m/Label",
	"sap/suite/ui/microchart/RadialMicroChart",
	"sap/suite/ui/microchart/library",
	"sap/base/Log",
	"sap/m/Button"
], function (jQuery, SmartRadialMicroChart, SmartMicroChartBase, CustomData, Model, ChartProvider, JSONModel,
			 Label, RadialMicroChart, microchartLibrary, Log, Button) {
	"use strict";

	QUnit.module("Metadata tests", {
		beforeEach: function () {
			this.oSRMC = new SmartRadialMicroChart();
		},
		afterEach: function () {
			this.oSRMC.destroy();
			this.oSRMC = null;
		}
	});

	QUnit.test("Default values", function (assert) {
		assert.equal(this.oSRMC.getChartType(), "Donut", "ChartType default value is correct.");
		assert.equal(this.oSRMC.getEntitySet(), "", "EntitySet default value is correct.");
		assert.equal(this.oSRMC.getEnableAutoBinding(), false, "EnableAutoBinding default value is correct.");
		assert.equal(this.oSRMC.getChartBindingPath(), "", "ChartBindingPath default value is correct.");
		assert.notOk(this.oSRMC.getIsResponsive(), "isResponsive default value is correct.");
		assert.ok(this.oSRMC.getMetadata().getDefaultAggregationName(), "_chart");
	});

	QUnit.test("Chart type", function (assert) {
		var oChart = this.oSRMC.setChartType("MyChart");

		assert.notEqual(this.oSRMC.getChartType(), "MyChart", "Function setChartType does not overwrite default chart type.");
		assert.equal(oChart, this.oSRMC, "Function setChartType correctly returns this-reference.");
	});

	QUnit.test("Setter for 'entitySet' Property - w/ change", function (assert) {
		//Arrange
		var oSpy = sinon.spy(this.oSRMC, "_initializeMetadata");

		//Action
		this.oSRMC.setEntitySet("MySet");

		//Assert
		assert.strictEqual(oSpy.callCount, 1, "Method _initializeMetadata is called when entitySet has changed.");
		assert.strictEqual(this.oSRMC.getEntitySet(), "MySet", "EntitySet has been correctly set.");

		oSpy.restore();
	});

	QUnit.test("Setter for 'entitySet' Property - w/o change", function (assert) {
		//Arrange
		var oSpy = sinon.spy(this.oSRMC, "_initializeMetadata");

		//Action
		this.oSRMC.setEntitySet("MySet");

		//Assert
		assert.strictEqual(oSpy.callCount, 1, "Method _initializeMetadata is not called when entitySet has not changed.");

		oSpy.restore();
	});

	QUnit.test("Should pass the Qualifier to the ChartProvider by adding CustomData", function (assert) {
		var oCustomData = new CustomData({
			key: "chartQualifier",
			value: "DonutChartQualifier"
		});
		this.oSRMC.setEntitySet("MySet");
		this.oSRMC.addCustomData(oCustomData);

		sinon.stub(this.oSRMC, "getModel").returns(new Model());

		this.oSRMC._createChartProvider.apply(this.oSRMC);

		assert.ok(this.oSRMC._oChartProvider, "ChartProvider was created successfully");
		assert.strictEqual(this.oSRMC._oChartProvider._sChartQualifier, "DonutChartQualifier", "ChartQualifier was successfully set in ChartProvider.");
	});

	QUnit.module("Passing parent context to the child in case of using responsiveness for annotated charts", {
		beforeEach: function () {
			this.oSRMC = new SmartRadialMicroChart({
				isResponsive: true
			});
		},
		afterEach: function () {
			this.oSRMC.destroy();
		}
	});

	QUnit.test("Passing parent context from SmartRadialMicroChart", function (assert) {
		//Arrange
		sinon.spy(microchartLibrary, "_passParentContextToChild");
		//Act
		this.oSRMC.onBeforeRendering();
		//Assert
		assert.ok(microchartLibrary._passParentContextToChild.calledOnce, "The function that passes parent rendering context to the child has been called.");
		microchartLibrary._passParentContextToChild.restore();
	});

	QUnit.test("If responsiveness is not used, property 'size' needs to be set to 'Auto'", function (assert) {
		//Arrange
		var oInnerChart = this.oSRMC.getAggregation("_chart");
		this.oSRMC.setIsResponsive(false, true);
		//Act
		this.oSRMC.onBeforeRendering();
		//Assert
		assert.equal(oInnerChart.getSize(), "Auto", "Property 'size' is set to 'Auto'");
	});

	QUnit.module("Annotation management tests", {
		beforeEach: function () {
			this.oSRMC = new SmartRadialMicroChart();
		},
		afterEach: function () {
			this.oSRMC.destroy();
			this.oSRMC = null;
		}
	});

	QUnit.test("Should trigger initializeMetadata and call _createChartProvider when entitySet and model are both set", function (assert) {
		var sEntitySet = "MySet", oModel = new Model();

		sinon.stub(ChartProvider.prototype, "getChartViewMetadata").returns({fields: []});
		sinon.stub(this.oSRMC, "_createAndBindInnerChart");

		sinon.spy(this.oSRMC, "_initializeMetadata");
		sinon.spy(this.oSRMC, "_createChartProvider");
		sinon.spy(this.oSRMC, "fireInitialize");

		this.oSRMC.setEntitySet(sEntitySet);
		this.oSRMC.setModel(oModel);

		assert.strictEqual(this.oSRMC._oChartProvider.sEntitySet, sEntitySet, "EntitySet was set in ChartProvider successfully");
		assert.strictEqual(this.oSRMC._oChartProvider._oParentODataModel, this.oSRMC.getModel(), "Data model was set in ChartProvider successfully");

		assert.ok(this.oSRMC._initializeMetadata.called, "Function initializeMetadata was called");
		assert.ok(this.oSRMC._createChartProvider.called, "Function createChartProvider was called");
		assert.ok(this.oSRMC.fireInitialize.calledOnce, "Function fireInitialize was called once");
		assert.ok(this.oSRMC._bIsInitialized, "SmartBulletMicroChart was initialized");

		ChartProvider.prototype.getChartViewMetadata.restore();
		this.oSRMC._initializeMetadata.restore();
		this.oSRMC._createChartProvider.restore();
	});

	QUnit.test("Properties binding", function (assert) {
		this.oSRMC._oDataPointAnnotations = {
			Value: {
				Path: "Revenue"
			},
			TargetValue: {
				Path: "TargetRevenue"
			}
		};
		this.oSRMC._bindProperties();

		assert.strictEqual(this.oSRMC.getAggregation("_chart").getBindingPath("fraction"), "Revenue", "The property path Revenue in annotations was bound to the property in control successfully");
		assert.strictEqual(this.oSRMC.getAggregation("_chart").getBindingPath("total"), "TargetRevenue", "The property path TargetRevenue in annotations was bound to the property in control successfully");
	});

	QUnit.test("Properties binding - percentage", function (assert) {
		this.oSRMC._oDataPointAnnotations = {
			Value: {
				Path: "RevenuePercent"
			}
		};
		this.oSRMC._bindProperties();

		assert.notOk(this.oSRMC.getAggregation("_chart").getBindingPath("fraction"), "The property path Revenue in annotations was not bound to the property in control.");
		assert.notOk(this.oSRMC.getAggregation("_chart").getBindingPath("total"), "The property path TargetRevenue in annotations was bound not to the property in control.");
		assert.strictEqual(this.oSRMC.getAggregation("_chart").getBindingPath("percentage"), "RevenuePercent", "The property path RevenuePercent in annotations was bound to the property in control.");
	});

	QUnit.test("Inner chart creation and binding", function (assert) {
		//Arrange
		var oSpyBindProperties = sinon.spy(this.oSRMC, "_bindProperties");
		var oSpyUpdateAssociations = sinon.spy(this.oSRMC, "_updateAssociations");
		this.oSRMC._oDataPointAnnotations = {
			Value: {},
			TargetValue: {}
		};

		//Action
		this.oSRMC._createAndBindInnerChart();

		//Assert
		assert.ok(oSpyBindProperties.calledOnce, "Function _bindProperties has been called once.");
		assert.ok(oSpyUpdateAssociations.calledOnce, "Function _updateAssociations has been called once.");
	});

	QUnit.module("Aria test delegeting", {
		beforeEach: function() {
			this.oSRMC = new SmartRadialMicroChart();
			this.oMC = new RadialMicroChart();
			this.oSRMC.setAggregation("_chart", this.oMC);
			this.oButton1 = new Button();
			this.oButton2 = new Button();
			this.oButton3 = new Button();
		},
		afterEach: function() {
			this.oSRMC.destroy();
			this.oMC.destroy();
		}
	});

	QUnit.test("Test addAriaLabelledBy", function(assert) {
		var oSpyAriaLabelledBy = sinon.spy(this.oMC, "addAriaLabelledBy");

		this.oSRMC.addAriaLabelledBy(this.oButton1);
		assert.ok(this.oMC.addAriaLabelledBy.calledOnce, "If addAriaLabelledBy function was called in MicroChart from SmartMicroChart exactly once");
		oSpyAriaLabelledBy.restore();
	});

	QUnit.test("Test removeAriaLabelledBy", function(assert) {
		var oSpyAriaLabelledBy = sinon.spy(this.oMC, "removeAriaLabelledBy");

		this.oSRMC.addAriaLabelledBy(this.oButton1);
		this.oSRMC.removeAriaLabelledBy(this.oButton1);
		assert.ok(this.oMC.removeAriaLabelledBy.calledOnce, "If removeAriaLabelledBy was called in MicroChart from SmartMicroChart exactly once");
		oSpyAriaLabelledBy.restore();
	});

	QUnit.test("Test removeAllAriaLabelledBy", function(assert) {
		var oSpyAriaLabelledBy = sinon.spy(this.oMC, "removeAllAriaLabelledBy");

		this.oSRMC.addAriaLabelledBy(this.oButton1);
		this.oSRMC.addAriaLabelledBy(this.oButton2);
		this.oSRMC.addAriaLabelledBy(this.oButton3);

		this.oSRMC.removeAllAriaLabelledBy(this.oText);
		assert.ok(this.oMC.removeAllAriaLabelledBy.calledOnce, "If removeAllAriaLabelledBy was called in MicroChart from SmartMicroChart exactly once");
		oSpyAriaLabelledBy.restore();
	});

	QUnit.module("Color calculation", {
		beforeEach: function () {
			this.oSRMC = new SmartRadialMicroChart({
				entitySet: "Entities"
			}).placeAt("qunit-fixture");
			this.oSRMC.bindElement("/");
			this.oSRMC.setModel(new JSONModel({
				Criticality: "Positive",
				DeviationRangeHighValue: 75,
				ToleranceRangeHighValue: 25,
				DeviationRangeLowValue: 25,
				Value: 100,
				Total: 100
			}));
			this.oSRMC._oDataPointAnnotations = {
				Value: {
					Path: "Value"
				},
				TargetValue: {
					Path: "Total"
				},
				CriticalityCalculation: {
					ImprovementDirection: {
						EnumMember: SmartMicroChartBase._MINIMIZE
					},
					DeviationRangeHighValue: {
						Path: "DeviationRangeHighValue"
					},
					ToleranceRangeHighValue: {
						Path: "ToleranceRangeHighValue"
					},
					DeviationRangeLowValue: {
						Path: "DeviationRangeLowValue",
						Decimal: 100
					},
					ToleranceRangeLowValue: {
						Decimal: 75
					}
				}
			};

			this.oStubGetProperty = sinon.stub(this.oSRMC.getAggregation("_chart"), "getProperty");
			this.oSpyGetValueColor = sinon.spy(this.oSRMC, "_getValueColor");
			this.oSpyGetValueColorMin = sinon.spy(this.oSRMC, "_getValueColorForMinimize");
			this.oSpyGetValueColorMax = sinon.spy(this.oSRMC, "_getValueColorForMaximize");

			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oSpyGetValueColor.restore();
			this.oSpyGetValueColorMin.restore();
			this.oSpyGetValueColorMax.restore();
			this.oSpyGetValueColorMin = null;
			this.oSpyGetValueColorMax = null;
			this.oStubGetProperty = null;
			this.oSpyGetValueColor = null;

			this.oSRMC.destroy();
			this.oSRMC = null;
		}
	});

	QUnit.test("Minimize direction - positive", function (assert) {
		//Arrange
		this.oSRMC.getModel().setProperty("/Value", 15);

		//Action
		this.oSRMC._bindProperties();

		//Assert
		assert.ok(this.oSpyGetValueColor.calledOnce, "Formatter function _getValueColor has been called.");
		assert.equal(this.oSpyGetValueColor.returnValues[0], "Good", "The color calculation test for positive range was successful");
		assert.ok(this.oSpyGetValueColorMin.calledOnce, "Function _getValueColorForMinimize has been called.");
	});

	QUnit.test("Minimize direction - critical", function (assert) {
		//Arrange
		this.oSRMC.getModel().setProperty("/Value", 50);

		//Action
		this.oSRMC._bindProperties();

		//Assert
		assert.ok(this.oSpyGetValueColor.calledOnce, "Formatter function _getValueColor has been called.");
		assert.equal(this.oSpyGetValueColor.returnValues[0], "Critical", "The color calculation test for critical range was successful");
		assert.ok(this.oSpyGetValueColorMin.calledOnce, "Function _getValueColorForMinimize has been called.");
	});

	QUnit.test("Minimize direction - negative", function (assert) {
		//Arrange
		this.oSRMC.getModel().setProperty("/Value", 85);

		//Action
		this.oSRMC._bindProperties();

		//Assert
		assert.ok(this.oSpyGetValueColor.calledOnce, "Formatter function _getValueColor has been called.");
		assert.equal(this.oSpyGetValueColor.returnValues[0], "Error", "The color calculation test for negative range was successful");
		assert.ok(this.oSpyGetValueColorMin.calledOnce, "Function _getValueColorForMinimize has been called.");
	});

	QUnit.test("Maximize direction - positive", function (assert) {
		//Arrange
		this.oSRMC._oDataPointAnnotations.CriticalityCalculation.ImprovementDirection.EnumMember = SmartMicroChartBase._MAXIMIZE;
		this.oSRMC.getModel().setProperty("/Value", 85);

		//Action
		this.oSRMC._bindProperties();

		//Assert
		assert.ok(this.oSpyGetValueColor.calledOnce, "Formatter function _getValueColor has been called.");
		assert.equal(this.oSpyGetValueColor.returnValues[0], "Good", "The color calculation test for positive range was successful");
		assert.ok(this.oSpyGetValueColorMax.calledOnce, "Function _getValueColorForMaximize has been called.");
	});

	QUnit.test("Maximize direction - critical", function (assert) {
		//Arrange
		this.oSRMC._oDataPointAnnotations.CriticalityCalculation.ImprovementDirection.EnumMember = SmartMicroChartBase._MAXIMIZE;
		this.oSRMC.getModel().setProperty("/Value", 50);

		//Action
		this.oSRMC._bindProperties();

		//Assert
		assert.ok(this.oSpyGetValueColor.calledOnce, "Formatter function _getValueColor has been called.");
		assert.equal(this.oSpyGetValueColor.returnValues[0], "Critical", "The color calculation test for critical range was successful");
		assert.ok(this.oSpyGetValueColorMax.calledOnce, "Function _getValueColorForMaximize has been called.");
	});

	QUnit.test("Maximize direction - negative", function (assert) {
		//Arrange
		this.oSRMC._oDataPointAnnotations.CriticalityCalculation.ImprovementDirection.EnumMember = SmartMicroChartBase._MAXIMIZE;
		this.oSRMC.getModel().setProperty("/Value", 15);

		//Action
		this.oSRMC._bindProperties();

		//Assert
		assert.ok(this.oSpyGetValueColor.calledOnce, "Formatter function _getValueColor has been called.");
		assert.equal(this.oSpyGetValueColor.returnValues[0], "Error", "The color calculation test for negative range was successful");
		assert.ok(this.oSpyGetValueColorMax.calledOnce, "Function _getValueColorForMaximize has been called.");
	});

	QUnit.test("Directly set criticality", function (assert) {
		//Arrange
		this.oSRMC._oDataPointAnnotations = {
			Criticality: {
				Path: "Criticality"
			}
		};

		//Action
		this.oSRMC._bindProperties();

		//Assert
		assert.ok(this.oSpyGetValueColor.calledOnce, "The color calculation has been called once.");
		assert.equal(this.oSpyGetValueColor.returnValues[0], "Good", "Color formatter correctly returned Positive.");
	});

	QUnit.test("Arbitrary ImprovementDirection", function (assert) {
		//Arrange
		this.oSRMC._oDataPointAnnotations.CriticalityCalculation.ImprovementDirection.EnumMember = "Ich bin eine Biene!";
		var oSpyLog = sinon.spy(Log, "warning");

		//Action
		this.oSRMC._bindProperties();

		//Assert
		assert.ok(this.oSpyGetValueColor.calledOnce, "The color calculation has been called once.");
		assert.equal(this.oSpyGetValueColor.returnValues[0], "Neutral", "The color calculation test for invalid improvement direction was successfully set to Neutral.");
		assert.ok(oSpyLog.calledOnce, "Function Log.warning has been called once.");
		assert.equal(oSpyLog.firstCall.args[0], "The improvement direction in DataPoint annotation must be either Minimize, Maximize or Target.", "Function Log.warning has been called correctly.");

		oSpyLog.restore();
	});

	QUnit.module("Auto binding", {
		beforeEach: function () {
			this.oSRMC = new SmartRadialMicroChart({
				enableAutoBinding: true,
				chartBindingPath: "/Products('PC')",
				entitySet: "Products"
			}).placeAt("qunit-fixture");
			this.oSRMC.setModel(new JSONModel({
				"Products('PC')": {}
			}));
		},
		afterEach: function () {
			this.oSRMC.destroy();
			this.oSRMC = null;
		}
	});

	QUnit.test("Auto binding - binding context set", function (assert) {
		//Assert
		assert.equal(this.oSRMC.getBindingContext().getPath(), "/Products('PC')");
	});

	QUnit.module("Association handling", {
		beforeEach: function () {
			this.oSRMC = new SmartRadialMicroChart().placeAt("qunit-fixture");
			this.oSRMC._oChartViewMetadata = {
				annotation: {
					Title: {
						Path: "Title"
					}
				}
			};
			this.oLabel = new Label({text: "DefaultText"});
			this.oLabel.setModel(new JSONModel({
				Title: "A title"
			}));
			this.oLabel.bindElement("/");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oSRMC.destroy();
			this.oLabel.destroy();

			this.oSRMC = null;
			this.oLabel = null;
		}
	});

	QUnit.test("Function setAssociation", function (assert) {
		//Arrange
		sinon.spy(this.oSRMC, "_updateAssociation");

		//Action
		this.oSRMC.setChartTitle(this.oLabel);

		//Assert
		assert.ok(this.oSRMC._updateAssociation.calledOnce, "Function _updateAssociation has been called once.");
		assert.equal(this.oLabel.getBinding("text").getPath(), "Title", "The associated label's text's binding path has been correctly set.");
		assert.equal(this.oLabel.getText(), "A title", "The associated label's text has been correctly set.");

		this.oSRMC._updateAssociation.restore();
	});

	QUnit.module("Chart types", {
		beforeEach: function () {
			this.oSRMC = new SmartRadialMicroChart();
		},
		afterEach: function () {
			this.oSRMC.destroy();
		}
	});

	QUnit.test("Chart types in designtime.js and supported chart types are the same", function (assert) {
		//Arrange
		var done = assert.async();
		//Act
		this.oSRMC.getMetadata().loadDesignTime().then(function (oDesignTime) {
			var aTypes = ["Donut"];
			//Assert
			assert.deepEqual(this.oSRMC._getSupportedChartTypes(), aTypes, "The supported chart types are correct");
			assert.deepEqual(oDesignTime.annotations.chartType.whiteList.values, aTypes, "The defined types in designtime.js are correct");
			done();
		}.bind(this));
	});

	QUnit.start();
});
