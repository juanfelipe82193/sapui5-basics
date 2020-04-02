/*global QUnit,sinon*/
sap.ui.require([
	"jquery.sap.global",
	"sap/ui/comp/smartmicrochart/SmartColumnMicroChart",
	"sap/ui/model/json/JSONModel",
	"sap/m/Label",
	"sap/ui/model/Model",
	"sap/ui/core/CustomData",
	"sap/suite/ui/microchart/ColumnMicroChart",
	"sap/m/Button"
], function (jQuery, SmartColumnMicroChart, JSONModel, Label, Model, CustomData, ColumnMicroChart, Button) {
	"use strict";

	QUnit.module("sap.ui.comp.smartmicrochart.SmartColumnMicroChart", {
		beforeEach: function() {
			this.oSCMC = new SmartColumnMicroChart({
				id: "smart-column-microchart"
			}).placeAt("qunit-fixture");
			this.oSCMC._oChartViewMetadata = {
				dimensionFields: ["Date"]
			};
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oSCMC.destroy();
		}
	});

	QUnit.test("Property chartType is read-only", function(assert) {
		this.oSCMC.setChartType("SomeType");

		assert.equal(this.oSCMC.getChartType(), "Column", "ChartType cannot be overwritten by setter.");
	});

	QUnit.test("Should have an entitySet property from constructor", function(assert) {
		var oSCMC = new SmartColumnMicroChart({
			entitySet: "Otto"
		});
		assert.strictEqual(oSCMC.getEntitySet(), "Otto");
		oSCMC.destroy();
	});

	QUnit.test("Check default values", function(assert) {
		assert.equal(this.oSCMC.getChartType(), "Column", "ChartType default value is correct.");
		assert.equal(this.oSCMC.getEntitySet(), "", "EntitySet default value is correct.");
		assert.equal(this.oSCMC.getChartBindingPath(), "", "ChartBindingPath default value is correct.");
		assert.notOk(this.oSCMC.getIsResponsive(), "isResponsive default value is correct.");
		assert.strictEqual(SmartColumnMicroChart.getMetadata()._sDefaultAggregation, "_chart", "The default aggregation is correctly set to _chart");
	});

	QUnit.test("Check setter for 'entitySet' Property", function(assert) {
		var oSpy = sinon.spy(this.oSCMC, "_initializeMetadata");
		this.oSCMC.setEntitySet("MySet");
		assert.strictEqual(oSpy.callCount, 1, "Method _initializeMetadata is called when entitySet has changed.");
		assert.strictEqual(this.oSCMC.getEntitySet(), "MySet", "EntitySet has been correctly set.");

		this.oSCMC.setEntitySet("MySet");
		assert.strictEqual(oSpy.callCount, 1, "Method _initializeMetadata is not called when entitySet has not changed.");

		oSpy.restore();
	});

	QUnit.test("Test for showLabel property with default value", function(assert) {
		assert.ok(this.oSCMC.getShowLabel(), "The property showLabel by default is true.");
		assert.ok(this.oSCMC.getAggregation("_chart").getShowTopLabels(), "getShowTopLabels is true.");
		assert.ok(this.oSCMC.getAggregation("_chart").getShowBottomLabels(), "getShowBottomLabels is true.");
	});

	QUnit.test("Test for showLabel property with true", function(assert) {
		var oReturn = this.oSCMC.setShowLabel(true);
		assert.ok(this.oSCMC.getShowLabel(), "The property showLabel by default is true.");
		assert.ok(oReturn.getAggregation("_chart").getProperty("showTopLabels"), "getShowTopLabels is showed.");
		assert.ok(oReturn.getAggregation("_chart").getProperty("showBottomLabels"), "getShowBottomLabels is showed.");
		assert.ok(oReturn instanceof SmartColumnMicroChart, "Check if return value is correct to allow method chaninging.");
	});

	QUnit.test("Test for showLabel property with false", function(assert) {
		var oReturn = this.oSCMC.setShowLabel(false);
		assert.ok(!oReturn.getAggregation("_chart").getProperty("showTopLabels"), "getShowTopLabels is not showed.");
		assert.ok(!oReturn.getAggregation("_chart").getProperty("showBottomLabels"), "getShowBottomLabels is not showed.");
		assert.ok(oReturn instanceof SmartColumnMicroChart, "Check if return value is correct to allow method chaninging.");
	});

	QUnit.test("Attaching a model ends in metadata initialization", function(assert) {
		var oSpy = sinon.spy(this.oSCMC, "propagateProperties");
		sinon.stub(this.oSCMC, "_initializeMetadata");

		this.oSCMC.setModel(new Model());

		assert.ok(this.oSCMC._initializeMetadata.calledOnce, "Attaching a model ends in property propagation which ends in init metadata.");
		assert.deepEqual(oSpy.callCount, 1, "Function propagateProperties has been called once.");

		this.oSCMC._initializeMetadata.restore();
	});

	QUnit.test("ChartProvider is created with correct parameters", function(assert) {
		var sEntitySet = "MySet";
		var oModel = new Model();
		this.oSCMC.setEntitySet(sEntitySet);

		sinon.stub(this.oSCMC, "getModel").returns(oModel);
		this.oSCMC._createChartProvider.apply(this.oSCMC);

		assert.ok(this.oSCMC._oChartProvider, "Internal ChartProvider created.");
		assert.strictEqual(this.oSCMC._oChartProvider.sEntitySet, sEntitySet);
		assert.strictEqual(this.oSCMC._oChartProvider._oParentODataModel, oModel);
	});

	QUnit.test("Should pass the Qualifier to the ChartProvider by adding CustomData", function(assert) {
		var oCustomData = new CustomData({
			key: "chartQualifier",
			value: "ColumnChartQualifier"
		});
		this.oSCMC.setEntitySet("MySet");
		this.oSCMC.addCustomData(oCustomData);

		sinon.stub(this.oSCMC, "getModel").returns(new Model());

		this.oSCMC._createChartProvider.apply(this.oSCMC);

		assert.ok(this.oSCMC._oChartProvider, "ChartProvider was created successfully");
		assert.strictEqual(this.oSCMC._oChartProvider._sChartQualifier, "ColumnChartQualifier", "chartQualifier was set in ChartProvider successfully");
	});

	QUnit.test("Should pass the Qualifier to the ChartProvider by calling data()", function(assert) {
		this.oSCMC.setEntitySet("MySet");
		this.oSCMC.data("chartQualifier", "ColumnChartQualifier");

		sinon.stub(this.oSCMC, "getModel").returns(new Model());

		this.oSCMC._createChartProvider.apply(this.oSCMC);

		assert.ok(this.oSCMC._oChartProvider, "ChartProvider was created successfully");
		assert.strictEqual(this.oSCMC._oChartProvider._sChartQualifier, "ColumnChartQualifier", "chartQualifier was set in ChartProvider successfully");
	});

	QUnit.test("Check if MetaModel loading mechanism is working for abtract Model implementations", function(assert) {
		var oModel = new Model();
		sinon.spy(this.oSCMC, "_initializeMetadata");
		sinon.stub(this.oSCMC, "_onMetadataInitialized");

		this.oSCMC.setModel(oModel);

		assert.strictEqual(this.oSCMC._initializeMetadata.callCount, 1, "_initializeMetadata has been called exactly one time");
		assert.strictEqual(this.oSCMC._onMetadataInitialized.callCount, 1, "_onMetadataInitialized has been called");

		this.oSCMC._initializeMetadata.restore();
		this.oSCMC._onMetadataInitialized.restore();
	});

	QUnit.test("Overridden function bindElement does not bind context", function(assert) {
		this.oSCMC.bindElement("/ContextBla");

		assert.notOk(this.oSCMC.getElementBinding());
	});

	QUnit.test("Dimension formatter transforms float and date values properly", function(assert) {
		//Assert
		assert.equal(this.oSCMC._formatDimension.call(this.oSCMC, 34345.334), 34345.334, "Float value is forwarded without changes.");
		assert.equal(this.oSCMC._formatDimension.call(this.oSCMC, new Date(123123213)), 123123213, "Time stamp is correctly retrieved from Date.");
	});

	QUnit.test("Dimension formatter transforms string values in case sap semantics set as YYYY", function(assert) {
		//Arrange
		sinon.stub(this.oSCMC, "_getSemanticsPattern").returns("yyyy");
		sinon.stub(this.oSCMC, "_getPropertyAnnotation").returns({});
		//Assert
		assert.equal(this.oSCMC._formatDimension.call(this.oSCMC, "1971"), this.oSCMC._formatDimension.call(this.oSCMC, "1971"), "Timestamp extracted correcrtly from semantic string of YYYY structure.");
		//Restore
		this.oSCMC._getSemanticsPattern.restore();
		this.oSCMC._getPropertyAnnotation.restore();
	});

	QUnit.test("Dimension formatter transforms string values in case sap semantics set as YYYYMM", function(assert) {
		//Arrange
		sinon.stub(this.oSCMC, "_getSemanticsPattern").returns("yyyyMM");
		sinon.stub(this.oSCMC, "_getPropertyAnnotation").returns({});
		//Assert
		assert.equal(this.oSCMC._formatDimension.call(this.oSCMC, "197102"), this.oSCMC._formatDimension.call(this.oSCMC, "197102"), "Timestamp extracted correcrtly from semantic string of YYYY structure.");
		//Restore
		this.oSCMC._getSemanticsPattern.restore();
		this.oSCMC._getPropertyAnnotation.restore();
	});

	QUnit.test("Dimension formatter transforms string values in case sap semantics set as YYYYMMDD", function(assert) {
		//Arrange
		sinon.stub(this.oSCMC, "_getSemanticsPattern").returns("yyyyMMdd");
		sinon.stub(this.oSCMC, "_getPropertyAnnotation").returns({});
		//Assert
		assert.equal(this.oSCMC._formatDimension.call(this.oSCMC, "19710202"), this.oSCMC._formatDimension.call(this.oSCMC, "19710202"), "Timestamp extracted correcrtly from semantic string of YYYY structure.");
		//Restore
		this.oSCMC._getSemanticsPattern.restore();
		this.oSCMC._getPropertyAnnotation.restore();
	});

	QUnit.module("Function _getBindingPath", {
		beforeEach: function() {
			this.oSCMC = new SmartColumnMicroChart();
		},
		afterEach: function() {
			this.oSCMC.destroy();
			this.oSCMC = null;
		}
	});

	QUnit.test("Control has chartBindingPath", function(assert) {
		this.oSCMC.setChartBindingPath("/Some/Path");

		assert.equal(this.oSCMC._getBindingPath(), "/Some/Path", "ChartBindingPath has been correctly returned.");
	});

	QUnit.test("Control has entitySet", function(assert) {
		this.oSCMC.setEntitySet("Enten");

		assert.equal(this.oSCMC._getBindingPath(), "/Enten", "/{entitySet} has been correctly returned.");
	});

	QUnit.test("Control has entitySet and chartBindingPath", function(assert) {
		this.oSCMC.setChartBindingPath("/Some/Path");
		this.oSCMC.setEntitySet("Enten");

		assert.equal(this.oSCMC._getBindingPath(), "/Some/Path", "ChartBindingPath has been correctly returned.");
	});

	QUnit.test("Control has neither property", function(assert) {
		assert.equal(this.oSCMC._getBindingPath(), "", "Empty string has been returned.");
	});

	QUnit.module("Label creation and binding", {
		beforeEach: function() {
			this.oSCMC = new SmartColumnMicroChart({
				id: "smart-column-microchart"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			this.oSCMC._createChartLabels();
		},
		afterEach: function() {
			this.oSCMC.destroy();
		}
	});

	QUnit.test("Labels are created", function(assert) {
		//Assert
		assert.ok(this.oSCMC.getAggregation("_chart").getAggregation("leftTopLabel"), "The leftTopLabel aggregation is created");
		assert.ok(this.oSCMC.getAggregation("_chart").getAggregation("leftBottomLabel"), "The leftBottomLabel aggregation is created");
		assert.ok(this.oSCMC.getAggregation("_chart").getAggregation("rightTopLabel"), "The rightTopLabel aggregation is created");
		assert.ok(this.oSCMC.getAggregation("_chart").getAggregation("rightBottomLabel"), "The rightBottomLabel aggregation is created");
	});

	QUnit.module("Aria test delegeting", {
		beforeEach: function() {
			this.oSCMC = new SmartColumnMicroChart();
			this.oMC = new ColumnMicroChart();
			this.oSCMC.setAggregation("_chart", this.oMC);
			this.oButton1 = new Button();
			this.oButton2 = new Button();
			this.oButton3 = new Button();
		},
		afterEach: function() {
			this.oSCMC.destroy();
			this.oMC.destroy();
		}
	});

	QUnit.test("Test addAriaLabelledBy", function(assert) {
		var oSpyAriaLabelledBy = sinon.spy(this.oMC, "addAriaLabelledBy");

		this.oSCMC.addAriaLabelledBy(this.oButton1);
		assert.ok(this.oMC.addAriaLabelledBy.calledOnce, "If addAriaLabelledBy function was called in ColumnMicroChart from SmartColumnMicroChart exactly once");
		oSpyAriaLabelledBy.restore();
	});

	QUnit.test("Test removeAriaLabelledBy", function(assert) {
		var oSpyAriaLabelledBy = sinon.spy(this.oMC, "removeAriaLabelledBy");

		this.oSCMC.addAriaLabelledBy(this.oButton1);
		this.oSCMC.removeAriaLabelledBy(this.oButton1);
		assert.ok(this.oMC.removeAriaLabelledBy.calledOnce, "If removeAriaLabelledBy was called in ColumnMicroChart from SmartColumnMicroChart exactly once");
		oSpyAriaLabelledBy.restore();
	});

	QUnit.test("Test removeAllAriaLabelledBy", function(assert) {
		var oSpyAriaLabelledBy = sinon.spy(this.oMC, "removeAllAriaLabelledBy");

		this.oSCMC.addAriaLabelledBy(this.oButton1);
		this.oSCMC.addAriaLabelledBy(this.oButton2);
		this.oSCMC.addAriaLabelledBy(this.oButton3);

		this.oSCMC.removeAllAriaLabelledBy(this.oText);
		assert.ok(this.oMC.removeAllAriaLabelledBy.calledOnce, "If removeAllAriaLabelledBy was called in ColumnMicroChart from SmartColumnMicroChart exactly once");
		oSpyAriaLabelledBy.restore();
	});

	QUnit.module("Function _updateAssociations", {
		beforeEach: function() {
			this.oSCMC = new SmartColumnMicroChart({
				id: "smart-column-microchart"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			this.oSCMC._oChartViewMetadata = {
				annotation: {
					Title: { Path: "Title" }
				}
			};
			sinon.stub(this.oSCMC, "_checkChartMetadata").returns(true);
			sinon.stub(this.oSCMC, "_onMetadataInitialized");
			this.oSCMC._sBindingPath = "/Series";

		},
		afterEach: function() {
			this.oSCMC.destroy();
			this.oSCMC._checkChartMetadata.restore();
			this.oSCMC._onMetadataInitialized.restore();
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
		this.oSCMC.setModel(oModel);
		var oChartTitle = new Label({ text: "DefaultText" });
		this.oSCMC.setChartTitle(oChartTitle);

		this.oSCMC._updateAssociations(oPointsBinding);

		assert.equal(oChartTitle.getText(), "My Title", "Aggregation has been updated.");
	});

	QUnit.module("Chart types", {
		beforeEach: function() {
			this.oSCMC = new SmartColumnMicroChart();
		},
		afterEach: function() {
			this.oSCMC.destroy();
		}
	});

	QUnit.test("Chart types in designtime.js and supported chart types are the same", function(assert) {
		//Arrange
		var done = assert.async();
		//Act
		this.oSCMC.getMetadata().loadDesignTime().then(function(oDesignTime) {
			var aTypes = ["Column"];
			//Assert
			assert.deepEqual(this.oSCMC._getSupportedChartTypes(), aTypes, "The supported chart types are correct");
			assert.deepEqual(oDesignTime.annotations.chartType.whiteList.values, aTypes, "The defined types in designtime.js are correct");
			done();
		}.bind(this));
	});


	QUnit.module("sap.ui.comp.smartmicrochart.SmartColumnMicroChart calculation", {
		beforeEach: function() {
			this.oSCMC = new SmartColumnMicroChart({
				id: "smart-column-microchart",
				entitySet: "Prices"
			}).placeAt("qunit-fixture");

			this.oSCMC._oChartViewMetadata = {
				annotation: {
					ChartType: { EnumMember: "com.sap.vocabularies.UI.v1.ChartType/Column" },
					Measures: [{ PropertyPath: "Price" }],
					MeasureAttributes: [{
						DataPoint: { AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#ColumnChartDataPoint" },
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
			this.oSCMC._sBindingPath = "/Series";
			this.oSCMC._aDataPointAnnotations = [{
				Criticality: {
					Path: "Criticality"
				},
				Value: {
					Path: "Price"
				}
			}];

			var oModel = new JSONModel({
				Prices: [
					{
						Price: 0,
						Ctiticality: "Neutral"
					}
				]
			});
			this.oSCMC.setModel(oModel);

			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oSCMC.destroy();
		}
	});

	QUnit.test("Check chart and target binding", function(assert) {
		sinon.stub(this.oSCMC, "_getDataPointQualifier").returns("ColumnChartDataPoint");
		sinon.stub(this.oSCMC, "_getPropertyAnnotation").returns({});
		sinon.stub(this.oSCMC, "updateChartLabels");
		this.oSCMC._createAndBindInnerChart();
		assert.strictEqual(this.oSCMC.getAggregation("_chart").getBindingInfo("columns").template.getBindingPath("value"), "Price", "The aggregation value was bound successfully");
		assert.strictEqual(this.oSCMC.getAggregation("_chart").getBindingInfo("columns").template.getBindingPath("color"), "Criticality", "The aggregation valueColor was bound successfully");
		assert.strictEqual(this.oSCMC.getAggregation("_chart").getBindingInfo("columns").template.getBindingPath("displayValue"), undefined, "The aggregation displayValue was not bound");
		this.oSCMC._getDataPointQualifier.restore();
		this.oSCMC._getPropertyAnnotation.restore();
		this.oSCMC.updateChartLabels.restore();
	});

	QUnit.test("Height and width not set when isResponsive true", function(assert) {
		this.oSCMC.setHeight("200px");
		this.oSCMC.setWidth("200px");
		this.oSCMC.setIsResponsive(true);

		sap.ui.getCore().applyChanges();

		assert.equal(this.oSCMC.getAggregation("_chart").getWidth(), "200px", "width is used when isResponsive is set on inner chart");
		assert.equal(this.oSCMC.getAggregation("_chart").getHeight(), "200px", "height is used when isResponsive is set on inner chart");
		assert.equal(this.oSCMC.getAggregation("_chart").getSize(), "Responsive", "responsive size is on inner chart");
	});

	QUnit.test("Height and width set when isResponsive false", function(assert) {
		this.oSCMC.setHeight("200px");
		this.oSCMC.setWidth("200px");
		this.oSCMC.setIsResponsive(false);

		sap.ui.getCore().applyChanges();

		assert.equal(this.oSCMC.getAggregation("_chart").getWidth(), "200px", "width is used when isResponsive is not set on inner chart");
		assert.equal(this.oSCMC.getAggregation("_chart").getHeight(), "200px", "height is used when isResponsive is not set on inner chart");
		assert.notEqual(this.oSCMC.getAggregation("_chart").getSize(), "Responsive", "responsive size is on inner chart");
	});

	QUnit.test("Css class is set when isResponsive", function(assert) {
		this.oSCMC.setIsResponsive(false);

		sap.ui.getCore().applyChanges();

		assert.notOk(this.oSCMC.$().hasClass("sapSuiteUiSmartMicroChartResponsive"), "responsive class is not set");

		this.oSCMC.setIsResponsive(true);

		sap.ui.getCore().applyChanges();

		assert.ok(this.oSCMC.$().hasClass("sapSuiteUiSmartMicroChartResponsive"), "responsive class is set");
	});

	QUnit.start();
});
