/*global QUnit,sinon*/
sap.ui.require([
	"jquery.sap.global",
	"sap/ui/comp/smartmicrochart/SmartAreaMicroChart",
	"sap/ui/model/json/JSONModel",
	"sap/m/Label",
	"sap/ui/model/Model",
	"sap/ui/core/CustomData",
	"sap/suite/ui/microchart/AreaMicroChart",
	"sap/m/Button"
], function (jQuery, SmartAreaMicroChart, JSONModel, Label, Model, CustomData, AreaMicroChart, Button) {
	"use strict";

	QUnit.module("sap.ui.comp.smartmicrochart.SmartAreaMicroChart", {
		beforeEach: function() {
			this.oSAMC = new SmartAreaMicroChart({
				id: "smart-area-microchart"
			}).placeAt("qunit-fixture");
			this.oSAMC._oChartViewMetadata = {
				dimensionFields: ["Date"]
			};
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oSAMC.destroy();
		}
	});

	QUnit.test("Property chartType is read-only", function(assert) {
		this.oSAMC.setChartType("SomeType");

		assert.equal(this.oSAMC.getChartType(), "Area", "ChartType cannot be overwritten by setter.");
	});

	QUnit.test("Should have an entitySet property from constructor", function(assert) {
		var oSAMC = new SmartAreaMicroChart({
			entitySet: "Otto"
		});
		assert.strictEqual(oSAMC.getEntitySet(), "Otto");
		oSAMC.destroy();
	});

	QUnit.test("Check default values", function(assert) {
		assert.equal(this.oSAMC.getChartType(), "Area", "ChartType default value is correct.");
		assert.equal(this.oSAMC.getEntitySet(), "", "EntitySet default value is correct.");
		assert.equal(this.oSAMC.getEnableAutoBinding(), true, "EnableAutoBinding default value is correct.");
		assert.equal(this.oSAMC.getChartBindingPath(), "", "ChartBindingPath default value is correct.");
		assert.notOk(this.oSAMC.getIsResponsive(), "isResponsive default value is correct.");
		assert.strictEqual(SmartAreaMicroChart.getMetadata()._sDefaultAggregation, "_chart", "The default aggregation is correctly set to _chart");
	});

	QUnit.test("Check setter for 'entitySet' Property", function(assert) {
		var oSpy = sinon.spy(this.oSAMC, "_initializeMetadata");
		this.oSAMC.setEntitySet("MySet");
		assert.strictEqual(oSpy.callCount, 1, "Method _initializeMetadata is called when entitySet has changed.");
		assert.strictEqual(this.oSAMC.getEntitySet(), "MySet", "EntitySet has been correctly set.");

		this.oSAMC.setEntitySet("MySet");
		assert.strictEqual(oSpy.callCount, 1, "Method _initializeMetadata is not called when entitySet has not changed.");

		oSpy.restore();
	});

	QUnit.test("Test for showLabel property with default value", function(assert) {
		assert.ok(this.oSAMC.getShowLabel(), "The property showLabel by default is true.");
		assert.ok(this.oSAMC.getAggregation("_chart").getShowLabel(), "showLabel is showed.");
	});

	QUnit.test("Test for showLabel property with true", function(assert) {
		var oReturn = this.oSAMC.setShowLabel(true);
		assert.ok(this.oSAMC.getShowLabel(), "The property showLabel by default is true.");
		assert.ok(oReturn.getAggregation("_chart").getProperty("showLabel"), "showLabel is showed.");
		assert.ok(oReturn instanceof SmartAreaMicroChart, "Check if return value is correct to allow method chaninging.");
	});

	QUnit.test("Test for showLabel property with false", function(assert) {
		var oReturn = this.oSAMC.setShowLabel(false);
		assert.ok(!oReturn.getAggregation("_chart").getProperty("showLabel"), "showLabel is not showed.");
		assert.ok(oReturn instanceof SmartAreaMicroChart, "Check if return value is correct to allow method chaninging.");
	});

	QUnit.test("Attaching a model ends in metadata initialization", function(assert) {
		var oSpy = sinon.spy(this.oSAMC, "propagateProperties");
		sinon.stub(this.oSAMC, "_initializeMetadata");

		this.oSAMC.setModel(new Model());

		assert.ok(this.oSAMC._initializeMetadata.calledOnce, "Attaching a model ends in property propagation which ends in init metadata.");
		assert.deepEqual(oSpy.callCount, 1, "Function propagateProperties has been called once.");

		this.oSAMC._initializeMetadata.restore();
	});

	QUnit.test("Test for enableAutoBinding with false", function(assert) {
		var oSAMC = new SmartAreaMicroChart({
			enableAutoBinding: false
		});
		assert.equal(oSAMC.getProperty("enableAutoBinding"), true, "enableAutoBinding should be always 'true'");
	});

	QUnit.test("ChartProvider is created with correct parameters", function(assert) {
		var sEntitySet = "MySet";
		var oModel = new Model();
		this.oSAMC.setEntitySet(sEntitySet);

		sinon.stub(this.oSAMC, "getModel").returns(oModel);
		this.oSAMC._createChartProvider.apply(this.oSAMC);

		assert.ok(this.oSAMC._oChartProvider, "Internal ChartProvider created.");
		assert.strictEqual(this.oSAMC._oChartProvider.sEntitySet, sEntitySet);
		assert.strictEqual(this.oSAMC._oChartProvider._oParentODataModel, oModel);
	});

	QUnit.test("Should pass the Qualifier to the ChartProvider by adding CustomData", function(assert) {
		var oCustomData = new CustomData({
			key: "chartQualifier",
			value: "AreaChartQualifier"
		});
		this.oSAMC.setEntitySet("MySet");
		this.oSAMC.addCustomData(oCustomData);

		sinon.stub(this.oSAMC, "getModel").returns(new Model());

		this.oSAMC._createChartProvider.apply(this.oSAMC);

		assert.ok(this.oSAMC._oChartProvider, "ChartProvider was created successfully");
		assert.strictEqual(this.oSAMC._oChartProvider._sChartQualifier, "AreaChartQualifier", "chartQualifier was set in ChartProvider successfully");
	});

	QUnit.test("Should pass the Qualifier to the ChartProvider by calling data()", function(assert) {
		this.oSAMC.setEntitySet("MySet");
		this.oSAMC.data("chartQualifier", "AreaChartQualifier");

		sinon.stub(this.oSAMC, "getModel").returns(new Model());

		this.oSAMC._createChartProvider.apply(this.oSAMC);

		assert.ok(this.oSAMC._oChartProvider, "ChartProvider was created successfully");
		assert.strictEqual(this.oSAMC._oChartProvider._sChartQualifier, "AreaChartQualifier", "chartQualifier was set in ChartProvider successfully");
	});

	QUnit.test("Check if MetaModel loading mechanism is working for abtract Model implementations", function(assert) {
		var oModel = new Model();
		sinon.spy(this.oSAMC, "_initializeMetadata");
		sinon.stub(this.oSAMC, "_onMetadataInitialized");

		this.oSAMC.setModel(oModel);

		assert.strictEqual(this.oSAMC._initializeMetadata.callCount, 1, "_initializeMetadata has been called exactly one time");
		assert.strictEqual(this.oSAMC._onMetadataInitialized.callCount, 1, "_onMetadataInitialized has been called");

		this.oSAMC._initializeMetadata.restore();
		this.oSAMC._onMetadataInitialized.restore();
	});

	QUnit.test("Overridden function bindElement does not bind context", function(assert) {
		this.oSAMC.bindElement("/ContextBla");

		assert.notOk(this.oSAMC.getElementBinding());
	});

	QUnit.test("Dimension formatter transforms float and date values properly", function(assert) {
		//Assert
		assert.equal(this.oSAMC._formatDimension.call(this.oSAMC, 34345.334), 34345.334, "Float value is forwarded without changes.");
		assert.equal(this.oSAMC._formatDimension.call(this.oSAMC, new Date(123123213)), 123123213, "Time stamp is correctly retrieved from Date.");
	});

	QUnit.test("Dimension formatter transforms string values in case sap semantics set as YYYY", function(assert) {
		//Arrange
		sinon.stub(this.oSAMC, "_getSemanticsPattern").returns("yyyy");
		sinon.stub(this.oSAMC, "_getPropertyAnnotation").returns({});
		//Assert
		assert.equal(this.oSAMC._formatDimension.call(this.oSAMC, "1971"), this.oSAMC._formatDimension.call(this.oSAMC, "1971"), "Timestamp extracted correcrtly from semantic string of YYYY structure.");
		//Restore
		this.oSAMC._getSemanticsPattern.restore();
		this.oSAMC._getPropertyAnnotation.restore();
	});

	QUnit.test("Dimension formatter transforms string values in case sap semantics set as YYYYMM", function(assert) {
		//Arrange
		sinon.stub(this.oSAMC, "_getSemanticsPattern").returns("yyyyMM");
		sinon.stub(this.oSAMC, "_getPropertyAnnotation").returns({});
		//Assert
		assert.equal(this.oSAMC._formatDimension.call(this.oSAMC, "197102"), this.oSAMC._formatDimension.call(this.oSAMC, "197102"), "Timestamp extracted correcrtly from semantic string of YYYY structure.");
		//Restore
		this.oSAMC._getSemanticsPattern.restore();
		this.oSAMC._getPropertyAnnotation.restore();
	});

	QUnit.test("Dimension formatter transforms string values in case sap semantics set as YYYYMMDD", function(assert) {
		//Arrange
		sinon.stub(this.oSAMC, "_getSemanticsPattern").returns("yyyyMMdd");
		sinon.stub(this.oSAMC, "_getPropertyAnnotation").returns({});
		//Assert
		assert.equal(this.oSAMC._formatDimension.call(this.oSAMC, "19710202"), this.oSAMC._formatDimension.call(this.oSAMC, "19710202"), "Timestamp extracted correcrtly from semantic string of YYYY structure.");
		//Restore
		this.oSAMC._getSemanticsPattern.restore();
		this.oSAMC._getPropertyAnnotation.restore();
	});

	QUnit.test("Dimension formatter transforms nonsemantic string properly", function(assert) {
		//Arrange
		sinon.stub(this.oSAMC, "_getSemanticsPattern").returns(null);
		sinon.stub(this.oSAMC, "_getPropertyAnnotation").returns({});
		var oSpyEnableXIndexing = sinon.spy(AreaMicroChart.prototype, "enableXIndexing");
		//Assert
		assert.equal(this.oSAMC._formatDimension.call(this.oSAMC, "asas"), 0, "String value is replaced by 0 value.");
		assert.ok(oSpyEnableXIndexing.calledOnce, "The enableXIndexing function is called once");
		//Restore
		oSpyEnableXIndexing.restore();
		this.oSAMC._getSemanticsPattern.restore();
		this.oSAMC._getPropertyAnnotation.restore();
	});

	QUnit.module("Function _getBindingPath", {
		beforeEach: function() {
			this.oSAMC = new SmartAreaMicroChart();
		},
		afterEach: function() {
			this.oSAMC.destroy();
			this.oSAMC = null;
		}
	});

	QUnit.test("Control has chartBindingPath", function(assert) {
		this.oSAMC.setChartBindingPath("/Some/Path");

		assert.equal(this.oSAMC._getBindingPath(), "/Some/Path", "ChartBindingPath has been correctly returned.");
	});

	QUnit.test("Control has entitySet", function(assert) {
		this.oSAMC.setEntitySet("Enten");

		assert.equal(this.oSAMC._getBindingPath(), "/Enten", "/{entitySet} has been correctly returned.");
	});

	QUnit.test("Control has entitySet and chartBindingPath", function(assert) {
		this.oSAMC.setChartBindingPath("/Some/Path");
		this.oSAMC.setEntitySet("Enten");

		assert.equal(this.oSAMC._getBindingPath(), "/Some/Path", "ChartBindingPath has been correctly returned.");
	});

	QUnit.test("Control has neither property", function(assert) {
		assert.equal(this.oSAMC._getBindingPath(), "", "Empty string has been returned.");
	});

	QUnit.module("sap.ui.comp.smartmicrochart.SmartAreaMicroChart criticality calculation", {
		beforeEach: function() {
			this.oSAMC = new SmartAreaMicroChart({
				id: "smart-area-microchart",
				enableAutoBinding: true
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
			this.oSAMC._oChartViewMetadata = {
				annotation: {
					ChartType: { EnumMember: "com.sap.vocabularies.UI.v1.ChartType/Area" },
					Measures: [{ PropertyPath: "Revenue" }],
					MeasureAttributes: [{
						DataPoint: { AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#AreaChartDataPoint" },
						Measure: { PropertyPath: "Revenue" },
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
			this.oSAMC._sBindingPath = "/Series";
			this.oSAMC._oDataPointAnnotations = {
				CriticalityCalculation: {
					ImprovementDirection: {
						EnumMember: "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target"
					},
					DeviationRangeHighValue: {
						Path: "PriceDeviationUpperBound"
					},
					DeviationRangeLowValue: {
						Path: "PriceDeviationLowerBound"
					},
					ToleranceRangeHighValue: {
						Path: "PriceToleranceUpperBound"
					},
					ToleranceRangeLowValue: {
						Path: "PriceToleranceLowerBound"
					}
				},
				TargetValue: {
					Path: "TargetPrice"
				},
				Value: {
					Path: "Price"
				}
			};
		},
		afterEach: function() {
			this.oSAMC.destroy();
		}
	});

	QUnit.test("Check chart and target binding", function(assert) {
		sinon.stub(this.oSAMC, "_getDataPointQualifier").returns("AreaChartDataPoint");
		this.oSAMC._createAndBindInnerChart();
		assert.strictEqual(this.oSAMC.getAggregation("_chart").getAggregation("chart").getBindingInfo("points").template.getBindingPath("y"), "Price", "The chart aggregation was bound successfully");
		assert.strictEqual(this.oSAMC.getAggregation("_chart").getAggregation("target").getBindingInfo("points").template.getBindingPath("y"), "TargetPrice", "The target aggregation was bound successfully");
		this.oSAMC._getDataPointQualifier.restore();
	});

	QUnit.test("Check _createAndBindInnerChart method and properties in annotations should be bound with aggregations in control for target criticality", function(assert) {
		sinon.stub(this.oSAMC, "_getDataPointQualifier").returns("AreaChartDataPoint");

		this.oSAMC._createAndBindInnerChart();
		// test for target direction
		assert.strictEqual(this.oSAMC.getAggregation("_chart").getAggregation("minThreshold").getBindingInfo("points").template.getBindingPath("y"), "PriceDeviationLowerBound", "The minThreshold aggregation was bound successfully");
		assert.strictEqual(this.oSAMC.getAggregation("_chart").getAggregation("innerMinThreshold").getBindingInfo("points").template.getBindingPath("y"), "PriceToleranceLowerBound", "The innerMinThreshold aggregation was bound successfully");
		assert.strictEqual(this.oSAMC.getAggregation("_chart").getAggregation("innerMaxThreshold").getBindingInfo("points").template.getBindingPath("y"), "PriceToleranceUpperBound", "The innerMaxThreshold aggregation was bound successfully");
		assert.strictEqual(this.oSAMC.getAggregation("_chart").getAggregation("maxThreshold").getBindingInfo("points").template.getBindingPath("y"), "PriceDeviationUpperBound", "The maxThreshold aggregation was bound successfully");
		assert.strictEqual(this.oSAMC.getAggregation("_chart").getInnerMaxThreshold().getProperty("color"), "Good", "InnerMaxThreshold color was correct");
		assert.strictEqual(this.oSAMC.getAggregation("_chart").getInnerMinThreshold().getProperty("color"), "Good", "InnerMinThreshold color was correct");
		assert.strictEqual(this.oSAMC.getAggregation("_chart").getMaxThreshold().getProperty("color"), "Error", "MaxThreshold color was correct");
		assert.strictEqual(this.oSAMC.getAggregation("_chart").getMinThreshold().getProperty("color"), "Error", "MinThreshold color was correct");
		this.oSAMC._getDataPointQualifier.restore();
	});

	QUnit.test("Check _createAndBindInnerChart method and properties in annotations should be bound with aggregations in control for minimize criticality", function(assert) {
		sinon.stub(this.oSAMC, "_getDataPointQualifier").returns("AreaChartDataPoint");

		this.oSAMC._oDataPointAnnotations.CriticalityCalculation.ImprovementDirection.EnumMember = "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize";
		this.oSAMC._createAndBindInnerChart();
		// test for minimize direction
		assert.strictEqual(this.oSAMC.getAggregation("_chart").getAggregation("minThreshold").getBindingInfo("points").template.getBindingPath("y"), "PriceToleranceUpperBound", "The minThreshold aggregation was bound successfully");
		assert.strictEqual(this.oSAMC.getAggregation("_chart").getAggregation("maxThreshold").getBindingInfo("points").template.getBindingPath("y"), "PriceDeviationUpperBound", "The maxThreshold aggregation was bound successfully");
		assert.strictEqual(this.oSAMC.getAggregation("_chart").getMaxThreshold().getProperty("color"), "Error", "MaxThreshold color was correct");
		assert.strictEqual(this.oSAMC.getAggregation("_chart").getMinThreshold().getProperty("color"), "Good", "MinThreshold color was correct");
		this.oSAMC._getDataPointQualifier.restore();
	});

	QUnit.test("Check _createAndBindInnerChart method and properties in annotations should be bound with aggregations in control for maximize criticality", function(assert) {
		sinon.stub(this.oSAMC, "_getDataPointQualifier").returns("AreaChartDataPoint");

		this.oSAMC._oDataPointAnnotations.CriticalityCalculation.ImprovementDirection.EnumMember = "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize";
		this.oSAMC._createAndBindInnerChart();
		// test for minimize direction
		assert.strictEqual(this.oSAMC.getAggregation("_chart").getAggregation("minThreshold").getBindingInfo("points").template.getBindingPath("y"), "PriceDeviationLowerBound", "The minThreshold aggregation was bound successfully");
		assert.strictEqual(this.oSAMC.getAggregation("_chart").getAggregation("maxThreshold").getBindingInfo("points").template.getBindingPath("y"), "PriceToleranceLowerBound", "The maxThreshold aggregation was bound successfully");
		assert.strictEqual(this.oSAMC.getAggregation("_chart").getMaxThreshold().getProperty("color"), "Good", "MaxThreshold color was correct");
		assert.strictEqual(this.oSAMC.getAggregation("_chart").getMinThreshold().getProperty("color"), "Error", "MinThreshold color was correct");
		this.oSAMC._getDataPointQualifier.restore();
	});

	QUnit.module("Label creation and binding", {
		beforeEach: function() {
			this.oSAMC = new SmartAreaMicroChart({
				id: "smart-area-microchart"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			this.oSAMC._createChartLabels();
		},
		afterEach: function() {
			this.oSAMC.destroy();
		}
	});

	QUnit.test("Labels are created", function(assert) {
		//Assert
		assert.ok(this.oSAMC.getAggregation("_chart").getAggregation("firstYLabel"), "The firstYLabel aggregation is created");
		assert.ok(this.oSAMC.getAggregation("_chart").getAggregation("firstXLabel"), "The firstXLabel aggregation is created");
		assert.ok(this.oSAMC.getAggregation("_chart").getAggregation("lastYLabel"), "The lastYLabel aggregation is created");
		assert.ok(this.oSAMC.getAggregation("_chart").getAggregation("lastXLabel"), "The lastXLabel aggregation is created");
	});

	QUnit.module("Aria test delegeting", {
		beforeEach: function() {
			this.oSAMC = new SmartAreaMicroChart();
			this.oMC = new AreaMicroChart();
			this.oSAMC.setAggregation("_chart", this.oMC);
			this.oButton1 = new Button();
			this.oButton2 = new Button();
			this.oButton3 = new Button();
		},
		afterEach: function() {
			this.oSAMC.destroy();
			this.oMC.destroy();
		}
	});

	QUnit.test("Test addAriaLabelledBy", function(assert) {
		var oSpyAriaLabelledBy = sinon.spy(this.oMC, "addAriaLabelledBy");

		this.oSAMC.addAriaLabelledBy(this.oButton1);
		assert.ok(this.oMC.addAriaLabelledBy.calledOnce, "If addAriaLabelledBy function was called in AreaMicroChart from SmartAreaMicroChart exactly once");
		oSpyAriaLabelledBy.restore();
	});

	QUnit.test("Test removeAriaLabelledBy", function(assert) {
		var oSpyAriaLabelledBy = sinon.spy(this.oMC, "removeAriaLabelledBy");

		this.oSAMC.addAriaLabelledBy(this.oButton1);
		this.oSAMC.removeAriaLabelledBy(this.oButton1);
		assert.ok(this.oMC.removeAriaLabelledBy.calledOnce, "If removeAriaLabelledBy was called in AreaMicroChart from SmartAreaMicroChart exactly once");
		oSpyAriaLabelledBy.restore();
	});

	QUnit.test("Test removeAllAriaLabelledBy", function(assert) {
		var oSpyAriaLabelledBy = sinon.spy(this.oMC, "removeAllAriaLabelledBy");

		this.oSAMC.addAriaLabelledBy(this.oButton1);
		this.oSAMC.addAriaLabelledBy(this.oButton2);
		this.oSAMC.addAriaLabelledBy(this.oButton3);

		this.oSAMC.removeAllAriaLabelledBy(this.oText);
		assert.ok(this.oMC.removeAllAriaLabelledBy.calledOnce, "If removeAllAriaLabelledBy was called in AreaMicroChart from SmartAreaMicroChart exactly once");
		oSpyAriaLabelledBy.restore();
	});

	QUnit.module("Function _updateAssociations", {
		beforeEach: function() {
			this.oSAMC = new SmartAreaMicroChart({
				id: "smart-area-microchart"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			this.oSAMC._oChartViewMetadata = {
				annotation: {
					Title: { Path: "Title" }
				}
			};
			sinon.stub(this.oSAMC, "_checkChartMetadata").returns(true);
			sinon.stub(this.oSAMC, "_onMetadataInitialized");
			this.oSAMC._sBindingPath = "/Series";

		},
		afterEach: function() {
			this.oSAMC.destroy();
			this.oSAMC._checkChartMetadata.restore();
			this.oSAMC._onMetadataInitialized.restore();
		}
	});

	QUnit.test("Model is attached", function(assert) {
		var oModel = new JSONModel({
			Title: "My Title"
		});
		var oPointsBinding = {
			getContexts: function() {
				return [
					oModel.createBindingContext("/")
				];
			}
		};
		this.oSAMC.setModel(oModel);
		var oChartTitle = new Label({ text: "DefaultText" });
		this.oSAMC.setChartTitle(oChartTitle);

		this.oSAMC._updateAssociations(oPointsBinding);

		assert.equal(oChartTitle.getText(), "My Title", "Aggregation has been updated.");
	});

	QUnit.module("Chart types", {
		beforeEach: function() {
			this.oSAMC = new SmartAreaMicroChart();
		},
		afterEach: function() {
			this.oSAMC.destroy();
		}
	});

	QUnit.test("Chart types in designtime.js and supported chart types are the same", function(assert) {
		//Arrange
		var done = assert.async();
		//Act
		this.oSAMC.getMetadata().loadDesignTime().then(function(oDesignTime) {
			var aTypes = ["Area", "Line"];
			//Assert
			assert.deepEqual(this.oSAMC._getSupportedChartTypes(), aTypes, "The supported chart types are correct");
			assert.deepEqual(oDesignTime.annotations.chartType.whiteList.values, aTypes, "The defined types in designtime.js are correct");
			done();
		}.bind(this));
	});

	QUnit.module("Function getAccessibilityInfo", {
		beforeEach: function() {
			this.oSAMC = new SmartAreaMicroChart();
		},
		afterEach: function() {
			this.oSAMC.destroy();
		}
	});

	QUnit.start();
});
