/*global QUnit,sinon*/
sap.ui.require([
	"sap/ui/comp/smartmicrochart/SmartBulletMicroChart",
	"sap/ui/comp/providers/ChartProvider",
	"sap/ui/model/Model",
	"sap/ui/core/format/NumberFormat",
	"sap/ui/core/CustomData",
	"sap/ui/model/json/JSONModel",
	"sap/m/Label",
	"sap/suite/ui/microchart/BulletMicroChart",
	"sap/suite/ui/microchart/library",
	"sap/m/Button"
], function (SmartBulletMicroChart, ChartProvider, Model, NumberFormat, CustomData,
			 JSONModel, Label, BulletMicroChart, microchartLibrary, Button) {
	"use strict";

	QUnit.module("SmartBulletMicroChart", {
		beforeEach: function() {
			this.oSBMC = new SmartBulletMicroChart({
				id: "smart-bullet-microchart"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oSBMC.destroy();
		}
	});

	QUnit.test("Property chartType is read-only", function(assert) {
		this.oSBMC.setChartType("One-Piece-Pie-Chart");
		assert.equal(this.oSBMC.getChartType(), "Bullet", "ChartType cannot be overwritten by setter.");
	});

	QUnit.test("Check default values", function(assert) {
		assert.equal(this.oSBMC.getChartType(), "Bullet", "ChartType default value is correct.");
		assert.equal(this.oSBMC.getEntitySet(), "", "EntitySet default value is correct.");
		assert.equal(this.oSBMC.getEnableAutoBinding(), false, "EnableAutoBinding default value is correct.");
		assert.equal(this.oSBMC.getChartBindingPath(), "", "ChartBindingPath default value is correct.");
		assert.notOk(this.oSBMC.getIsResponsive(), "isResponsive default value is correct.");
		assert.equal(SmartBulletMicroChart.getMetadata()._sDefaultAggregation, "_chart", "The default aggregation is correctly set to _chart");
	});

	QUnit.test("Check setter for 'entitySet' Property", function(assert) {
		var oSpy = sinon.spy(this.oSBMC, "_initializeMetadata");
		this.oSBMC.setEntitySet("MySet");
		assert.strictEqual(oSpy.callCount, 1, "Method _initializeMetadata is called when entitySet has changed.");
		assert.strictEqual(this.oSBMC.getEntitySet(), "MySet", "EntitySet has been correctly set.");

		this.oSBMC.setEntitySet("MySet");
		assert.strictEqual(oSpy.callCount, 1, "Method _initializeMetadata is not called when entitySet has not changed.");

		oSpy.restore();
	});

	QUnit.test("Test for showLabel property with default value", function(assert) {
		assert.ok(this.oSBMC.getShowLabel(), "The property showLabel by default is true.");
		assert.ok(this.oSBMC.getAggregation("_chart").getShowActualValue(), "ActualValue is showed.");
		assert.ok(this.oSBMC.getAggregation("_chart").getShowTargetValue(), "TargetValue is showed.");
		assert.ok(this.oSBMC.getAggregation("_chart").getShowDeltaValue(), "DeltaValue is showed.");
		assert.ok(this.oSBMC.getAggregation("_chart").getShowValueMarker(), "ValueMarker is showed.");
	});

	QUnit.test("Test for showLabel property with true", function(assert) {
		var oReturn = this.oSBMC.setShowLabel(true);
		assert.ok(this.oSBMC.getShowLabel(), "The property showLabel by default is true.");
		assert.ok(oReturn.getAggregation("_chart").getProperty("showActualValue"), "ActualValue is showed.");
		assert.ok(oReturn.getAggregation("_chart").getProperty("showTargetValue"), "TargetValue is showed.");
		assert.ok(oReturn.getAggregation("_chart").getProperty("showDeltaValue"), "DeltaValue is showed.");
		assert.ok(oReturn.getAggregation("_chart").getProperty("showValueMarker"), "ValueMarker is showed.");
		assert.ok(oReturn instanceof SmartBulletMicroChart, "Check if return value is correct to allow method chaninging.");
	});

	QUnit.test("Test for showLabel property with false", function(assert) {
		var oReturn = this.oSBMC.setShowLabel(false);
		assert.ok(!oReturn.getAggregation("_chart").getProperty("showActualValue"), "ActualValue is not showed.");
		assert.ok(!oReturn.getAggregation("_chart").getProperty("showTargetValue"), "TargetValue is not showed.");
		assert.ok(!oReturn.getAggregation("_chart").getProperty("showDeltaValue"), "DeltaValue is not showed.");
		assert.ok(!oReturn.getAggregation("_chart").getProperty("showValueMarker"), "ValueMarker is not showed.");
		assert.ok(oReturn instanceof SmartBulletMicroChart, "Check if return value is correct to allow method chaninging.");
	});

	QUnit.test("Should pass the Qualifier to the ChartProvider by adding CustomData", function(assert) {
		var oCustomData = new CustomData({
			key: "chartQualifier",
			value: "BulletChartQualifier"
		});
		this.oSBMC.setEntitySet("MySet");
		this.oSBMC.addCustomData(oCustomData);

		sinon.stub(this.oSBMC, "getModel").returns(new Model());

		this.oSBMC._createChartProvider.apply(this.oSBMC);

		assert.ok(this.oSBMC._oChartProvider, "ChartProvider was created successfully");
		assert.strictEqual(this.oSBMC._oChartProvider._sChartQualifier, "BulletChartQualifier", "chartQualifier was set in ChartProvider successfully");
	});

	QUnit.test("Should pass the Qualifier to the ChartProvider by calling data()", function(assert) {
		this.oSBMC.setEntitySet("MySet");
		this.oSBMC.data("chartQualifier", "BulletChartQualifier");

		sinon.stub(this.oSBMC, "getModel").returns(new Model());

		this.oSBMC._createChartProvider.apply(this.oSBMC);

		assert.ok(this.oSBMC._oChartProvider, "ChartProvider was created successfully");
		assert.strictEqual(this.oSBMC._oChartProvider._sChartQualifier, "BulletChartQualifier", "chartQualifier was set in ChartProvider successfully");
	});

	QUnit.test("Should trigger initialiseMetadata and call _createChartProvider when entitySet and model are both set", function(assert) {
		var sEntitySet = "MySet", oModel = new sap.ui.model.Model();

		sinon.stub(ChartProvider.prototype, "getChartViewMetadata").returns({ fields: [] });
		sinon.stub(this.oSBMC, "_createAndBindInnerChart");

		sinon.spy(this.oSBMC, "_initializeMetadata");
		sinon.spy(this.oSBMC, "_createChartProvider");
		sinon.spy(this.oSBMC, "fireInitialize");

		this.oSBMC.setEntitySet(sEntitySet);
		this.oSBMC.setModel(oModel);

		assert.strictEqual(this.oSBMC._oChartProvider.sEntitySet, sEntitySet, "EntitySet was set in ChartProvider successfully");
		assert.strictEqual(this.oSBMC._oChartProvider._oParentODataModel, this.oSBMC.getModel(), "Data model was set in ChartProvider successfully");

		assert.ok(this.oSBMC._initializeMetadata.called, "Function initializeMetadata was called");
		assert.ok(this.oSBMC._createChartProvider.called, "Function createChartProvider was called");
		assert.ok(this.oSBMC.fireInitialize.calledOnce, "Function fireInitialize was called once");
		assert.ok(this.oSBMC._bIsInitialized, "SmartBulletMicroChart was initialized");

		ChartProvider.prototype.getChartViewMetadata.restore();
		this.oSBMC._initializeMetadata.restore();
		this.oSBMC._createChartProvider.restore();
	});

	QUnit.test("GetDatapointQualifier method test", function(assert) {
		this.oSBMC._oChartViewMetadata = {
			annotation: {
				ChartType: { EnumMember: "com.sap.vocabularies.UI.v1.ChartType/Bullet" },
				Measures: [{ PropertyPath: "Revenue" }],
				MeasureAttributes: [{
					DataPoint: { AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#BulletChartDataPoint" },
					Measure: { PropertyPath: "Revenue" },
					RecordType: "com.sap.vocabularies.UI.v1.ChartMeasureAttributeType",
					Role: { EnumMember: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1" }
				}]
			}
		};
		var sQualifier = this.oSBMC._getDataPointQualifier.apply(this.oSBMC);

		assert.equal(sQualifier, "BulletChartDataPoint", "The qualifier of datapoint in annotations was extracted successfully");
	});

	QUnit.test("Properties binding test", function(assert) {
		this.oSBMC._oDataPointAnnotations = {
			ForecastValue: {
				Path: "ForecastRevenue"
			},
			MaximumValue: {
				Path: "MaxValue"
			},
			MinimumValue: {
				Path: "MinValue"
			},
			TargetValue: {
				Path: "TargetRevenue"
			},
			Value: {
				Path: "Revenue"
			}
		};
		sinon.stub(this.oSBMC, "_getPropertyAnnotation").returns({});
		sinon.spy(this.oSBMC, "_getLabelNumberFormatter");
		this.oSBMC._bindValueProperties();

		assert.strictEqual(this.oSBMC.getAggregation("_chart").getBindingPath("targetValue"), "TargetRevenue", "The property path TargetRevenue in annotations was bound to the property in control successfully");
		assert.strictEqual(this.oSBMC.getAggregation("_chart").getBindingPath("forecastValue"), "ForecastRevenue", "The property path ForecastRevenue in annotations was bound to the property in control successfully");
		assert.strictEqual(this.oSBMC.getAggregation("_chart").getBindingPath("maxValue"), "MaxValue", "The property path MaxValue in annotations was bound to the property in control successfully");
		assert.strictEqual(this.oSBMC.getAggregation("_chart").getBindingPath("minValue"), "MinValue", "The property path MinValue in annotations was bound to the property in control successfully");
		assert.ok(this.oSBMC._getLabelNumberFormatter.called, "The function that creates the NumberFormat Object has been called.");

		this.oSBMC._getPropertyAnnotation.restore();
		this.oSBMC._getLabelNumberFormatter.restore();
	});

	QUnit.test("MinValue and MaxValue test", function(assert) {
		this.oSBMC._oDataPointAnnotations = {
			MaximumValue: {
				Decimal: "100"
			},
			MinimumValue: {
				Decimal: "1"
			}
		};
		this.oSBMC._bindValueProperties();

		assert.strictEqual(this.oSBMC.getAggregation("_chart").getMinValue(), 1, "MinValue was set correctly");
		assert.strictEqual(this.oSBMC.getAggregation("_chart").getMaxValue(), 100, "MaxValue was set correctly");
	});

	QUnit.test("Thresholds aggregation binding test - target direction", function(assert) {
		this.oSBMC._oDataPointAnnotations = {
			CriticalityCalculation: {
				ImprovementDirection: { EnumMember: "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target" },
				DeviationRangeLowValue: { Path: "DeviationRangeLow" },
				ToleranceRangeLowValue: { Path: "ToleranceRangeLow" },
				ToleranceRangeHighValue: { Path: "ToleranceRangeHigh" },
				DeviationRangeHighValue: { Path: "DeviationRangeHigh" }
			}
		};

		this.oSBMC._bindChartThresholds();
		assert.strictEqual(this.oSBMC.getAggregation("_chart").getAggregation("thresholds").length, 4, "The number of thresholds are right");
		assert.strictEqual(this.oSBMC.getAggregation("_chart").getAggregation("thresholds")[0].getBindingPath("value"), "DeviationRangeLow", "The first threshold (DeviationLow) aggregation was bound correctly");
		assert.strictEqual(this.oSBMC.getAggregation("_chart").getAggregation("thresholds")[0].getProperty("color"), "Error", "The first threshold (DeviationLow) color was bound correctly");
		assert.strictEqual(this.oSBMC.getAggregation("_chart").getAggregation("thresholds")[1].getBindingPath("value"), "ToleranceRangeLow", "The second threshold (ToleranceLow) aggregation was bound correctly");
		assert.strictEqual(this.oSBMC.getAggregation("_chart").getAggregation("thresholds")[1].getProperty("color"), "Critical", "The second threshold (ToleranceLow) color was bound correctly");
		assert.strictEqual(this.oSBMC.getAggregation("_chart").getAggregation("thresholds")[2].getBindingPath("value"), "ToleranceRangeHigh", "The third threshold (ToleranceHigh) aggregation was bound correctly");
		assert.strictEqual(this.oSBMC.getAggregation("_chart").getAggregation("thresholds")[2].getProperty("color"), "Critical", "The third threshold (ToleranceHigh) color was bound correctly");
		assert.strictEqual(this.oSBMC.getAggregation("_chart").getAggregation("thresholds")[3].getBindingPath("value"), "DeviationRangeHigh", "The forth threshold (DeviationHigh) aggregation was bound correctly");
		assert.strictEqual(this.oSBMC.getAggregation("_chart").getAggregation("thresholds")[3].getProperty("color"), "Error", "The forth threshold (DeviationHigh) color was bound correctly");
	});

	QUnit.test("Thresholds aggregation binding test - minimize direction", function(assert) {
		this.oSBMC._oDataPointAnnotations = {
			CriticalityCalculation: {
				ImprovementDirection: { EnumMember: "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize" },
				ToleranceRangeHighValue: { Path: "ToleranceRangeHigh" },
				DeviationRangeHighValue: { Path: "DeviationRangeHigh" }
			}
		};

		this.oSBMC._bindChartThresholds();
		assert.strictEqual(this.oSBMC.getAggregation("_chart").getAggregation("thresholds").length, 2, "The number of thresholds are right");
		assert.strictEqual(this.oSBMC.getAggregation("_chart").getAggregation("thresholds")[0].getBindingPath("value"), "ToleranceRangeHigh", "The first threshold (ToleranceHigh) aggregation was bound correctly");
		assert.strictEqual(this.oSBMC.getAggregation("_chart").getAggregation("thresholds")[0].getProperty("color"), "Critical", "The first threshold (ToleranceHigh) color was bound correctly");
		assert.strictEqual(this.oSBMC.getAggregation("_chart").getAggregation("thresholds")[1].getBindingPath("value"), "DeviationRangeHigh", "The second threshold (DeviationHigh) aggregation was bound correctly");
		assert.strictEqual(this.oSBMC.getAggregation("_chart").getAggregation("thresholds")[1].getProperty("color"), "Error", "The second threshold (DeviationHigh) color was bound correctly");
	});

	QUnit.test("Thresholds aggregation binding test - Maximize direction", function(assert) {
		this.oSBMC._oDataPointAnnotations = {
			CriticalityCalculation: {
				ImprovementDirection: { EnumMember: "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize" },
				DeviationRangeLowValue: { Path: "DeviationRangeLow" },
				ToleranceRangeLowValue: { Path: "ToleranceRangeLow" }
			}
		};

		this.oSBMC._bindChartThresholds();
		assert.strictEqual(this.oSBMC.getAggregation("_chart").getAggregation("thresholds").length, 2, "The number of thresholds are right");
		assert.strictEqual(this.oSBMC.getAggregation("_chart").getAggregation("thresholds")[0].getBindingPath("value"), "DeviationRangeLow", "The first threshold (DeviationLow) aggregation was bound correctly");
		assert.strictEqual(this.oSBMC.getAggregation("_chart").getAggregation("thresholds")[0].getProperty("color"), "Error", "The first threshold (DeviationLow) color was bound correctly");
		assert.strictEqual(this.oSBMC.getAggregation("_chart").getAggregation("thresholds")[1].getBindingPath("value"), "ToleranceRangeLow", "The second threshold (ToleranceLow) aggregation was bound correctly");
		assert.strictEqual(this.oSBMC.getAggregation("_chart").getAggregation("thresholds")[1].getProperty("color"), "Critical", "The second threshold (ToleranceLow) color was bound correctly");
	});

	QUnit.test("Actual aggregation binding test", function(assert) {
		this.oSBMC._oDataPointAnnotations = {
			CriticalityCalculation: {
				ImprovementDirection: { EnumMember: "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target" },
				DeviationRangeLowValue: { Path: "DeviationRangeLow" },
				ToleranceRangeLowValue: { Path: "ToleranceRangeLow" },
				ToleranceRangeHighValue: { Path: "ToleranceRangeHigh" },
				DeviationRangeHighValue: { Path: "DeviationRangeHigh" }
			},
			Value: { Path: "Revenue" },
			Criticality: { Path: "Error" }
		};
		sinon.stub(this.oSBMC, "_getPropertyAnnotation").returns({});
		sinon.spy(this.oSBMC, "_getLabelNumberFormatter");

		this.oSBMC._bindActualValue();
		var oBindingInfo = this.oSBMC.getAggregation("_chart").getAggregation("actual").getBindingInfo("color");
		assert.ok(this.oSBMC._getLabelNumberFormatter.called, "The function that creates the NumberFormat Object has been called.");
		assert.strictEqual(this.oSBMC.getAggregation("_chart").getAggregation("actual").getBindingPath("value"), "Revenue", "The actual value was bound successfully");
		assert.strictEqual(oBindingInfo.parts[0].path, "Revenue", "The actual color (part 0) was bound successfully");
		assert.strictEqual(oBindingInfo.parts[1].path, "Error", "The actual color (part 1) was bound successfully");

		this.oSBMC._getPropertyAnnotation.restore();
		this.oSBMC._getLabelNumberFormatter.restore();
	});

	QUnit.module("Aria test delegeting", {
		beforeEach: function() {
			this.oSBMC = new SmartBulletMicroChart();
			this.oMC = new BulletMicroChart();
			this.oSBMC.setAggregation("_chart", this.oMC);
			this.oButton1 = new Button();
			this.oButton2 = new Button();
			this.oButton3 = new Button();
		},
		afterEach: function() {
			this.oSBMC.destroy();
			this.oMC.destroy();
		}
	});

	QUnit.test("Test addAriaLabelledBy", function(assert) {
		var oSpyAriaLabelledBy = sinon.spy(this.oMC, "addAriaLabelledBy");

		this.oSBMC.addAriaLabelledBy(this.oButton1);
		assert.ok(this.oMC.addAriaLabelledBy.calledOnce, "If addAriaLabelledBy function was called in MicroChart from SmartMicroChart exactly once");
		oSpyAriaLabelledBy.restore();
	});

	QUnit.test("Test removeAriaLabelledBy", function(assert) {
		var oSpyAriaLabelledBy = sinon.spy(this.oMC, "removeAriaLabelledBy");

		this.oSBMC.addAriaLabelledBy(this.oButton1);
		this.oSBMC.removeAriaLabelledBy(this.oButton1);
		assert.ok(this.oMC.removeAriaLabelledBy.calledOnce, "If removeAriaLabelledBy was called in MicroChart from SmartMicroChart exactly once");
		oSpyAriaLabelledBy.restore();
	});

	QUnit.test("Test removeAllAriaLabelledBy", function(assert) {
		var oSpyAriaLabelledBy = sinon.spy(this.oMC, "removeAllAriaLabelledBy");

		this.oSBMC.addAriaLabelledBy(this.oButton1);
		this.oSBMC.addAriaLabelledBy(this.oButton2);
		this.oSBMC.addAriaLabelledBy(this.oButton3);

		this.oSBMC.removeAllAriaLabelledBy(this.oText);
		assert.ok(this.oMC.removeAllAriaLabelledBy.calledOnce, "If removeAllAriaLabelledBy was called in MicroChart from SmartMicroChart exactly once");
		oSpyAriaLabelledBy.restore();
	});

	QUnit.module("SmartBulletMicroChart - check color calculation (target)", {
		beforeEach: function() {
			this.oSBMC = new SmartBulletMicroChart({
				id: "smart-bullet-microchart",
				entitySet: "Entities",
				enableAutoBinding: true,
				chartBindingPath: "/"
			}).placeAt("qunit-fixture");

			sinon.stub(this.oSBMC, "_checkChartMetadata").returns(true);
			sinon.stub(ChartProvider.prototype, "getChartDataPointMetadata").returns({
				primaryAnnotation: {
					Value: {
						Path: "Value"
					},
					CriticalityCalculation: {
						ImprovementDirection: {
							EnumMember: "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target"
						},
						DeviationRangeLowValue: {
							Path: "DeviationLow"
						},
						ToleranceRangeLowValue: {
							Path: "ToleranceLow"
						},
						ToleranceRangeHighValue: {
							Path: "ToleranceHigh"
						},
						DeviationRangeHighValue: {
							Path: "DeviationHigh"
						}
					}
				}
			});
			sinon.stub(ChartProvider.prototype, "getChartViewMetadata").returns({
				annotation: {
					Title: {
						String: "{i18n>MY_TITLE_KEY}"
					},
					Description: {
						String: "{i18n>MY_DESP_KEY}"
					}
				}
			});
			sinon.stub(this.oSBMC, "_getPropertyAnnotation").returns({
				ISOCurrency: {
					String: "Euro"
				}
			});
			var oModel = new JSONModel({
				DeviationLow: 10,
				ToleranceLow: 15,
				ToleranceHigh: 200,
				DeviationHigh: 215,
				Value: 0
			});
			this.oSBMC.setModel(oModel);
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oSBMC._checkChartMetadata.restore();
			ChartProvider.prototype.getChartDataPointMetadata.restore();
			ChartProvider.prototype.getChartViewMetadata.restore();
			this.oSBMC._getPropertyAnnotation.restore();
			this.oSBMC.destroy();
		}
	});
	QUnit.test("Critical color", function(assert) {
		this.oSBMC.getModel().setProperty("/Value", 12);

		var sColor = this.oSBMC.getAggregation("_chart").getAggregation("actual").getColor();

		assert.strictEqual(sColor, "Critical", "The color calculation test for critical range was successful");
	});

	QUnit.test("Good color", function(assert) {
		this.oSBMC.getModel().setProperty("/Value", 100);

		var sColor = this.oSBMC.getAggregation("_chart").getAggregation("actual").getColor();

		assert.strictEqual(sColor, "Good", "The color calculation test for good range was successful");
	});

	QUnit.test("Bar color set directly via path in criticality annotation", function(assert) {
		var oModel = new JSONModel({
			Criticality: "Neutral",
			Revenue: 100
		});
		this.oSBMC.setModel(oModel);

		this.oSBMC._oDataPointAnnotations = {
			Criticality: {
				Path: "/Criticality"
			},
			Value: {
				Path: "/Revenue"
			}
		};

		this.oSBMC._bindActualValue();
		var sColor = this.oSBMC.getAggregation("_chart").getAggregation("actual").getColor();
		assert.strictEqual(sColor, "Neutral", "The color calculation test for neutral status was correct");

		this.oSBMC.getModel().setProperty("/Criticality", "Negative", null, false);
		sColor = this.oSBMC.getAggregation("_chart").getAggregation("actual").getColor();
		assert.strictEqual(sColor, "Error", "The color calculation test for negative status was correct");
	});

	QUnit.test("Check method _createAndBindInnerChart", function(assert) {
		var oModel = new JSONModel({
			Criticality: "Positive",
			Revenue: 100
		});
		this.oSBMC.setModel(oModel);

		sinon.stub(this.oSBMC, "_getDataPointQualifier").returns("BulletChartDataPoint");
		this.oSBMC._oDataPointAnnotations = {
			Criticality: {
				Path: "/Criticality"
			},
			Value: {
				Path: "/Revenue"
			}
		};
		this.oSBMC._createAndBindInnerChart();

		var sColor = this.oSBMC.getAggregation("_chart").getAggregation("actual").getColor();
		assert.strictEqual(sColor, "Good", "The color for neutral status was correct");

		var oActualValue = this.oSBMC.getAggregation("_chart").getAggregation("actual");
		var iValue = oActualValue.getValue();
		assert.strictEqual(iValue, 100, "The value bound to the chart was correct");

		this.oSBMC._getDataPointQualifier.restore();
	});

	QUnit.test("Check overwritten method bindObject", function(assert) {
		var oModel = new JSONModel({
			Criticality: "Critical",
			Revenue: 100
		});
		this.oSBMC.setModel(oModel);

		this.oSBMC._oDataPointAnnotations = {
			Criticality: {
				Path: "Criticality"
			},
			Value: {
				Path: "Revenue"
			}
		};

		this.oSBMC.bindObject("/");
		this.oSBMC._bindActualValue();

		var oActualValue = this.oSBMC.getAggregation("_chart").getAggregation("actual");
		var iValue = oActualValue.getValue();
		assert.strictEqual(iValue, 100, "The value using relative paths provided by bindObject was correct");

		var sColor = oActualValue.getColor();
		assert.strictEqual(sColor, "Critical", "The color using relative paths provided by bindObject for critical status was correct");
	});

	QUnit.test("Height and width not set when isResponsive true", function(assert) {
		this.oSBMC.setHeight("200px");
		this.oSBMC.setWidth("200px");
		this.oSBMC.setIsResponsive(true);

		sap.ui.getCore().applyChanges();

		assert.equal(this.oSBMC.getAggregation("_chart").getWidth(), "200px", "width is used when isResponsive is set on inner chart");
		assert.equal(this.oSBMC.getAggregation("_chart").getHeight(), "200px", "height is used when isResponsive is set on inner chart");
		assert.ok(this.oSBMC.getAggregation("_chart").getIsResponsive(), "isResponsive is true on inner chart");
	});

	QUnit.test("Height and width set when isResponsive false", function(assert) {
		this.oSBMC.setHeight("200px");
		this.oSBMC.setWidth("200px");
		this.oSBMC.setIsResponsive(false);

		sap.ui.getCore().applyChanges();

		assert.equal(this.oSBMC.getAggregation("_chart").getWidth(), "200px", "width is used when isResponsive is not set on inner chart");
		assert.equal(this.oSBMC.getAggregation("_chart").getHeight(), "200px", "height is used when isResponsive is not set on inner chart");
		assert.notOk(this.oSBMC.getAggregation("_chart").getIsResponsive(), "isResponsive is false on inner chart");
	});

	QUnit.test("Css class is set when isResponsive", function(assert) {
		this.oSBMC.setIsResponsive(false);

		sap.ui.getCore().applyChanges();

		assert.notOk(this.oSBMC.$().hasClass("sapSuiteUiSmartMicroChartResponsive"), "responsive class is not set");

		this.oSBMC.setIsResponsive(true);

		sap.ui.getCore().applyChanges();

		assert.ok(this.oSBMC.$().hasClass("sapSuiteUiSmartMicroChartResponsive"), "responsive class is set");
	});

	QUnit.module("SmartBulletMicroChart - check color calculation (minimize)", {
		beforeEach: function() {
			this.oSBMC = new SmartBulletMicroChart({
				id: "smart-bullet-microchart",
				entitySet: "Entities",
				enableAutoBinding: true,
				chartBindingPath: "/"
			}).placeAt("qunit-fixture");

			sinon.stub(this.oSBMC, "_checkChartMetadata").returns(true);
			sinon.stub(ChartProvider.prototype, "getChartDataPointMetadata").returns({
				primaryAnnotation: {
					Value: {
						Path: "Value"
					},
					CriticalityCalculation: {
						ImprovementDirection: { EnumMember: "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize" },
						ToleranceRangeHighValue: {
							Path: "ToleranceHigh"
						},
						DeviationRangeHighValue: {
							Path: "DeviationHigh"
						}
					}
				}
			});
			sinon.stub(ChartProvider.prototype, "getChartViewMetadata").returns({
				annotation: {
					Title: {
						String: "{i18n>MY_TITLE_KEY}"
					},
					Description: {
						String: "{i18n>MY_DESP_KEY}"
					}
				}
			});
			sinon.stub(this.oSBMC, "_getPropertyAnnotation").returns({});
			var oModel = new JSONModel({
				ToleranceHigh: 100,
				DeviationHigh: 200,
				Value: 90
			});
			this.oSBMC.setModel(oModel);
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oSBMC._checkChartMetadata.restore();
			ChartProvider.prototype.getChartDataPointMetadata.restore();
			ChartProvider.prototype.getChartViewMetadata.restore();
			this.oSBMC._getPropertyAnnotation.restore();
			this.oSBMC.destroy();
		}
	});

	QUnit.test("Good color", function(assert) {
		this.oSBMC.getModel().setProperty("/Value", 20.0);

		var sColor = this.oSBMC.getAggregation("_chart").getAggregation("actual").getColor();

		assert.strictEqual(sColor, "Good", "The color calculation test for good range was successful");
	});

	QUnit.test("Critical color", function(assert) {
		this.oSBMC.getModel().setProperty("/Value", 120.0);

		var sColor = this.oSBMC.getAggregation("_chart").getAggregation("actual").getColor();

		assert.strictEqual(sColor, "Critical", "The color calculation test for critical range was successful");
	});

	QUnit.test("Error color", function(assert) {
		this.oSBMC.getModel().setProperty("/Value", 250.0);

		var sColor = this.oSBMC.getAggregation("_chart").getAggregation("actual").getColor();

		assert.strictEqual(sColor, "Error", "The color calculation test for error range was successful");
	});

	QUnit.module("SmartBulletMicroChart - check color calculation (maximize)", {
		beforeEach: function() {
			this.oSBMC = new SmartBulletMicroChart({
				id: "smart-bullet-microchart",
				entitySet: "Entities",
				enableAutoBinding: true,
				chartBindingPath: "/"
			}).placeAt("qunit-fixture");

			sinon.stub(this.oSBMC, "_checkChartMetadata").returns(true);
			sinon.stub(ChartProvider.prototype, "getChartDataPointMetadata").returns({
				primaryAnnotation: {
					Value: {
						Path: "Value"
					},
					CriticalityCalculation: {
						ImprovementDirection: {
							EnumMember: "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize"
						},
						DeviationRangeLowValue: {
							Path: "DeviationLow"
						},
						ToleranceRangeLowValue: {
							Path: "ToleranceLow"
						}
					}
				}
			});
			sinon.stub(ChartProvider.prototype, "getChartViewMetadata").returns({
				annotation: {
					Title: {
						String: "{i18n>MY_TITLE_KEY}"
					},
					Description: {
						String: "{i18n>MY_DESP_KEY}"
					}
				}
			});
			sinon.stub(this.oSBMC, "_getPropertyAnnotation").returns({});
			var oModel = new JSONModel({
				DeviationLow: 50,
				ToleranceLow: 100,
				Value: 0
			});
			this.oSBMC.setModel(oModel);
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oSBMC._checkChartMetadata.restore();
			ChartProvider.prototype.getChartDataPointMetadata.restore();
			ChartProvider.prototype.getChartViewMetadata.restore();
			this.oSBMC._getPropertyAnnotation.restore();
			this.oSBMC.destroy();
		}
	});

	QUnit.test("Error color", function(assert) {
		this.oSBMC.getModel().setProperty("/Value", 20);

		var sColor = this.oSBMC.getAggregation("_chart").getAggregation("actual").getColor();

		assert.strictEqual(sColor, "Error", "The color calculation test for error range was successful");
	});
	QUnit.test("Critical color", function(assert) {
		this.oSBMC.getModel().setProperty("/Value", 75);

		var sColor = this.oSBMC.getAggregation("_chart").getAggregation("actual").getColor();

		assert.strictEqual(sColor, "Critical", "The color calculation test for critical range was successful");
	});
	QUnit.test("Good color", function(assert) {
		this.oSBMC.getModel().setProperty("/Value", 250);

		var sColor = this.oSBMC.getAggregation("_chart").getAggregation("actual").getColor();

		assert.strictEqual(sColor, "Good", "The color calculation test for good range was successful");
	});

	QUnit.module("SmartBulletMicroChart: localizable associations", {
		beforeEach: function() {
			this.oSBMC = new SmartBulletMicroChart({
				id: "smart-bullet-microchart",
				entitySet: "Products"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
			//simulate i18n model
			this.oSBMC.setModel(new Model());
			this.oSBMC.setModel(new JSONModel({
				MY_TITLE_KEY: "This is a title",
				MY_DESP_KEY: "This is a description",
				MY_UNIT_KEY: "Yen"
			}), "i18n");
			this.oSBMC._oDataPointAnnotations = {
				Value: {
					Path: "Product"
				}
			};
			this.oSBMC._oChartViewMetadata = {
				annotation: {
					Title: {
						String: "{i18n>MY_TITLE_KEY}"
					},
					Description: {
						String: "{i18n>MY_DESP_KEY}"
					}
				}
			};
			sinon.stub(this.oSBMC, "_checkChartMetadata").returns(true);
		},
		afterEach: function() {
			this.oSBMC.destroy();
			this.oSBMC = null;
		}
	});

	QUnit.test("ChartTitle Association", function(assert) {
		//Arrange
		var oLabel = new sap.m.Label({ text: "DefaultText" });
		oLabel.setModel(this.oSBMC.getModel("i18n"), "i18n");
		oLabel.bindElement("i18n>/");

		//Act
		this.oSBMC.setChartTitle(oLabel);

		//Assert
		assert.equal(oLabel.getBinding("text").getPath(), "MY_TITLE_KEY", "Correct binding path.");
		assert.equal(oLabel.getText(), "This is a title", "Correct text.");
	});

	QUnit.test("ChartDescription Association", function(assert) {
		//Arrange
		var oLabel = new Label({ text: "DefaultText" });
		oLabel.setModel(this.oSBMC.getModel("i18n"), "i18n");
		oLabel.bindElement("i18n>/");

		//Act
		this.oSBMC.setChartDescription(oLabel);

		//Assert
		assert.equal(oLabel.getBinding("text").getPath(), "MY_DESP_KEY", "Correct binding path.");
		assert.equal(oLabel.getText(), "This is a description", "Correct text.");
	});
	QUnit.test("UnitOfMeasure Association", function(assert) {
		//Arrange
		var oDataProperty = {
			"NAMESPACE.ISOCurrency": {
				String: "{i18n>MY_UNIT_KEY}"
			},
			name: "Revenue",
			precision: "16",
			somethingDifferent: "others",
			type: "Edm.Decimal"
		};
		var oLabel = new Label({ text: "DefaultText" });
		oLabel.setModel(this.oSBMC.getModel("i18n"), "i18n");
		oLabel.bindElement("i18n>/");

		sinon.stub(this.oSBMC, "getModel").returns(this.oSBMC.oMetaModel = new sap.ui.model.Model());
		this.oSBMC._createChartProvider.apply(this.oSBMC);
		sinon.stub(this.oSBMC._oChartProvider._oMetadataAnalyser, "getEntityTypeNameFromEntitySetName").returns("BmcNamespace.ProductType");
		sinon.stub(this.oSBMC, "_getPropertyAnnotation").returns(oDataProperty);

		//Act
		this.oSBMC.setUnitOfMeasure(oLabel);

		//Assert
		assert.equal(oLabel.getBinding("text").getPath(), "MY_UNIT_KEY", "Correct binding path.");
		assert.equal(oLabel.getText(), "Yen", "Correct text.");

		this.oSBMC._getPropertyAnnotation.restore();
	});

	QUnit.module("Auto binding", {
		beforeEach: function() {
			this.oSBMC = new SmartBulletMicroChart({
				enableAutoBinding: true,
				chartBindingPath: "/Products('PC')",
				entitySet: "Products"
			}).placeAt("qunit-fixture");
			this.oSBMC.setModel(new JSONModel({
				"Products('PC')": {}
			}));
		},
		afterEach: function() {
			this.oSBMC.destroy();
			this.oSBMC = null;
		}
	});

	QUnit.test("Auto binding - binding context set", function(assert) {
		//Assert
		assert.equal(this.oSBMC.getBindingContext().getPath(), "/Products('PC')");
	});

	QUnit.module("Association handling", {
		beforeEach: function() {
			this.oSBMC = new SmartBulletMicroChart().placeAt("qunit-fixture");
			this.oSBMC._oChartViewMetadata = {
				annotation: {
					Title: {
						Path: "Title"
					}
				}
			};
			this.oLabel = new Label({ text: "DefaultText" });
			this.oLabel.setModel(new JSONModel({
				Title: "A title"
			}));
			this.oLabel.bindElement("/");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oSBMC.destroy();
			this.oLabel.destroy();

			this.oSBMC = null;
			this.oLabel = null;
		}
	});

	QUnit.test("Function setAssociation", function(assert) {
		//Arrange
		sinon.spy(this.oSBMC, "_updateAssociation");

		//Action
		this.oSBMC.setChartTitle(this.oLabel);

		//Assert
		assert.ok(this.oSBMC._updateAssociation.calledOnce, "Function _updateAssociation has been called once.");
		assert.equal(this.oLabel.getBinding("text").getPath(), "Title", "The associated label's text's binding path has been correctly set.");
		assert.equal(this.oLabel.getText(), "A title", "The associated label's text has been correctly set.");

		this.oSBMC._updateAssociation.restore();
	});

	QUnit.module("Chart types", {
		beforeEach: function() {
			this.oSBMC = new SmartBulletMicroChart();
		},
		afterEach: function() {
			this.oSBMC.destroy();
		}
	});

	QUnit.test("Chart types in designtime.js and supported chart types are the same", function(assert) {
		//Arrange
		var done = assert.async();
		//Act
		this.oSBMC.getMetadata().loadDesignTime().then(function(oDesignTime) {
			var aTypes = ["Bullet"];
			//Assert
			assert.deepEqual(this.oSBMC._getSupportedChartTypes(), aTypes, "The supported chart types are correct");
			assert.deepEqual(oDesignTime.annotations.chartType.whiteList.values, aTypes, "The defined types in designtime.js are correct");
			done();
		}.bind(this));
	});

	QUnit.module("Function getAccessibilityInfo", {
		beforeEach: function() {
			this.oSBMC = new SmartBulletMicroChart();
		},
		afterEach: function() {
			this.oSBMC.destroy();
		}
	});

	QUnit.start();
});
