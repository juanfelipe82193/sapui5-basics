/*global QUnit,sinon*/

sap.ui.require([
	"sap/ui/thirdparty/jquery",
	"sap/ui/comp/smartmicrochart/SmartLineMicroChart",
	"sap/ui/model/json/JSONModel",
	"sap/m/Label",
	"sap/ui/model/Model",
	"sap/ui/core/CustomData",
	"sap/suite/ui/microchart/LineMicroChart",
	"sap/m/Button"
], function (jQuery, SmartLineMicroChart, JSONModel, Label, Model, CustomData, LineMicroChart, Button) {
	"use strict";

	QUnit.module("sap.ui.comp.smartmicrochart.SmartLineMicroChart", {
		beforeEach: function() {
			this.oSLMC = new SmartLineMicroChart({
				id: "smart-line-microchart"
			}).placeAt("qunit-fixture");
			this.oSLMC._oChartViewMetadata = {
				dimensionFields: ["Date"]
			};
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oSLMC.destroy();
		}
	});

	QUnit.test("Property chartType is read-only", function(assert) {
		this.oSLMC.setChartType("SomeType");

		assert.equal(this.oSLMC.getChartType(), "Line", "ChartType cannot be overwritten by setter.");
	});

	QUnit.test("Should have an entitySet property from constructor", function(assert) {
		var oSLMC = new SmartLineMicroChart({
			entitySet: "Otto"
		});
		assert.strictEqual(oSLMC.getEntitySet(), "Otto");
		oSLMC.destroy();
	});

	QUnit.test("Check default values", function(assert) {
		assert.equal(this.oSLMC.getChartType(), "Line", "ChartType default value is correct.");
		assert.equal(this.oSLMC.getEntitySet(), "", "EntitySet default value is correct.");
		assert.equal(this.oSLMC.getChartBindingPath(), "", "ChartBindingPath default value is correct.");
		assert.notOk(this.oSLMC.getIsResponsive(), "isResponsive default value is correct.");
		assert.strictEqual(SmartLineMicroChart.getMetadata()._sDefaultAggregation, "_chart", "The default aggregation is correctly set to _chart");
	});

	QUnit.test("Check setter for 'entitySet' Property", function(assert) {
		var oSpy = sinon.spy(this.oSLMC, "_initializeMetadata");
		this.oSLMC.setEntitySet("MySet");
		assert.strictEqual(oSpy.callCount, 1, "Method _initializeMetadata is called when entitySet has changed.");
		assert.strictEqual(this.oSLMC.getEntitySet(), "MySet", "EntitySet has been correctly set.");

		this.oSLMC.setEntitySet("MySet");
		assert.strictEqual(oSpy.callCount, 1, "Method _initializeMetadata is not called when entitySet has not changed.");

		oSpy.restore();
	});

	QUnit.test("Test for showLabel property with default value", function(assert) {
		assert.ok(this.oSLMC.getShowLabel(), "The property showLabel by default is true.");
		assert.ok(this.oSLMC.getAggregation("_chart").getShowTopLabels(), "getShowTopLabels is true.");
		assert.ok(this.oSLMC.getAggregation("_chart").getShowBottomLabels(), "getShowBottomLabels is true.");
	});

	QUnit.test("Test for showLabel property with true", function(assert) {
		var oReturn = this.oSLMC.setShowLabel(true);
		assert.ok(this.oSLMC.getShowLabel(), "The property showLabel by default is true.");
		assert.ok(oReturn.getAggregation("_chart").getProperty("showTopLabels"), "getShowTopLabels is showed.");
		assert.ok(oReturn.getAggregation("_chart").getProperty("showBottomLabels"), "getShowBottomLabels is showed.");
		assert.ok(oReturn instanceof SmartLineMicroChart, "Check if return value is correct to allow method chaninging.");
	});

	QUnit.test("Test for showLabel property with false", function(assert) {
		var oReturn = this.oSLMC.setShowLabel(false);
		assert.ok(!oReturn.getAggregation("_chart").getProperty("showTopLabels"), "getShowTopLabels is not showed.");
		assert.ok(!oReturn.getAggregation("_chart").getProperty("showBottomLabels"), "getShowBottomLabels is not showed.");
		assert.ok(oReturn instanceof SmartLineMicroChart, "Check if return value is correct to allow method chaninging.");
	});

	QUnit.test("Attaching a model ends in metadata initialization", function(assert) {
		var oSpy = sinon.spy(this.oSLMC, "propagateProperties");
		sinon.stub(this.oSLMC, "_initializeMetadata");

		this.oSLMC.setModel(new Model());

		assert.ok(this.oSLMC._initializeMetadata.calledOnce, "Attaching a model ends in property propagation which ends in init metadata.");
		assert.deepEqual(oSpy.callCount, 1, "Function propagateProperties has been called once.");

		this.oSLMC._initializeMetadata.restore();
	});


	QUnit.test("ChartProvider is created with correct parameters", function(assert) {
		var sEntitySet = "MySet";
		var oModel = new Model();
		this.oSLMC.setEntitySet(sEntitySet);

		sinon.stub(this.oSLMC, "getModel").returns(oModel);
		this.oSLMC._createChartProvider.apply(this.oSLMC);

		assert.ok(this.oSLMC._oChartProvider, "Internal ChartProvider created.");
		assert.strictEqual(this.oSLMC._oChartProvider.sEntitySet, sEntitySet);
		assert.strictEqual(this.oSLMC._oChartProvider._oParentODataModel, oModel);
	});

	QUnit.test("Should pass the Qualifier to the ChartProvider by adding CustomData", function(assert) {
		var oCustomData = new CustomData({
			key: "chartQualifier",
			value: "LineChartQualifier"
		});
		this.oSLMC.setEntitySet("MySet");
		this.oSLMC.addCustomData(oCustomData);

		sinon.stub(this.oSLMC, "getModel").returns(new Model());

		this.oSLMC._createChartProvider.apply(this.oSLMC);

		assert.ok(this.oSLMC._oChartProvider, "ChartProvider was created successfully");
		assert.strictEqual(this.oSLMC._oChartProvider._sChartQualifier, "LineChartQualifier", "chartQualifier was set in ChartProvider successfully");
	});

	QUnit.test("Should pass the Qualifier to the ChartProvider by calling data()", function(assert) {
		this.oSLMC.setEntitySet("MySet");
		this.oSLMC.data("chartQualifier", "LineChartQualifier");

		sinon.stub(this.oSLMC, "getModel").returns(new Model());

		this.oSLMC._createChartProvider.apply(this.oSLMC);

		assert.ok(this.oSLMC._oChartProvider, "ChartProvider was created successfully");
		assert.strictEqual(this.oSLMC._oChartProvider._sChartQualifier, "LineChartQualifier", "chartQualifier was set in ChartProvider successfully");
	});

	QUnit.test("Check if MetaModel loading mechanism is working for abtract Model implementations", function(assert) {
		var oModel = new Model();
		sinon.spy(this.oSLMC, "_initializeMetadata");
		sinon.stub(this.oSLMC, "_onMetadataInitialized");

		this.oSLMC.setModel(oModel);

		assert.strictEqual(this.oSLMC._initializeMetadata.callCount, 1, "_initializeMetadata has been called exactly one time");
		assert.strictEqual(this.oSLMC._onMetadataInitialized.callCount, 1, "_onMetadataInitialized has been called");

		this.oSLMC._initializeMetadata.restore();
		this.oSLMC._onMetadataInitialized.restore();
	});

	QUnit.test("Overridden function bindElement does not bind context", function(assert) {
		this.oSLMC.bindElement("/ContextBla");

		assert.notOk(this.oSLMC.getElementBinding());
	});

	QUnit.test("Dimension formatter transforms float and date values properly", function(assert) {
		//Assert
		assert.equal(this.oSLMC._formatDimension.call(this.oSLMC, 34345.334), 34345.334, "Float value is forwarded without changes.");
		assert.equal(this.oSLMC._formatDimension.call(this.oSLMC, new Date(123123213)), 123123213, "Time stamp is correctly retrieved from Date.");
	});

	QUnit.test("Dimension formatter transforms string values in case sap semantics set as YYYY", function(assert) {
		//Arrange
		sinon.stub(this.oSLMC, "_getSemanticsPattern").returns("yyyy");
		sinon.stub(this.oSLMC, "_getPropertyAnnotation").returns({});
		//Assert
		assert.equal(this.oSLMC._formatDimension.call(this.oSLMC, "1971"), this.oSLMC._formatDimension.call(this.oSLMC, "1971"), "Timestamp extracted correcrtly from semantic string of YYYY structure.");
		//Restore
		this.oSLMC._getSemanticsPattern.restore();
		this.oSLMC._getPropertyAnnotation.restore();
	});

	QUnit.test("Dimension formatter transforms string values in case sap semantics set as YYYYMM", function(assert) {
		//Arrange
		sinon.stub(this.oSLMC, "_getSemanticsPattern").returns("yyyyMM");
		sinon.stub(this.oSLMC, "_getPropertyAnnotation").returns({});
		//Assert
		assert.equal(this.oSLMC._formatDimension.call(this.oSLMC, "197102"), this.oSLMC._formatDimension.call(this.oSLMC, "197102"), "Timestamp extracted correcrtly from semantic string of YYYY structure.");
		//Restore
		this.oSLMC._getSemanticsPattern.restore();
		this.oSLMC._getPropertyAnnotation.restore();
	});

	QUnit.test("Dimension formatter transforms string values in case sap semantics set as YYYYMMDD", function(assert) {
		//Arrange
		sinon.stub(this.oSLMC, "_getSemanticsPattern").returns("yyyyMMdd");
		sinon.stub(this.oSLMC, "_getPropertyAnnotation").returns({});
		//Assert
		assert.equal(this.oSLMC._formatDimension.call(this.oSLMC, "19710202"), this.oSLMC._formatDimension.call(this.oSLMC, "19710202"), "Timestamp extracted correcrtly from semantic string of YYYY structure.");
		//Restore
		this.oSLMC._getSemanticsPattern.restore();
		this.oSLMC._getPropertyAnnotation.restore();
	});

	QUnit.module("Aria test delegeting", {
		beforeEach: function() {
			this.oSLMC = new SmartLineMicroChart();
			this.oMC = new LineMicroChart();
			this.oSLMC.setAggregation("_chart", this.oMC);
			this.oButton1 = new Button();
			this.oButton2 = new Button();
			this.oButton3 = new Button();
		},
		afterEach: function() {
			this.oSLMC.destroy();
			this.oMC.destroy();
		}
	});

	QUnit.test("Test addAriaLabelledBy", function(assert) {
		var oSpyAriaLabelledBy = sinon.spy(this.oMC, "addAriaLabelledBy");

		this.oSLMC.addAriaLabelledBy(this.oButton1);
		assert.ok(this.oMC.addAriaLabelledBy.calledOnce, "If addAriaLabelledBy function was called in MicroChart from SmartMicroChart exactly once");
		oSpyAriaLabelledBy.restore();
	});

	QUnit.test("Test removeAriaLabelledBy", function(assert) {
		var oSpyAriaLabelledBy = sinon.spy(this.oMC, "removeAriaLabelledBy");

		this.oSLMC.addAriaLabelledBy(this.oButton1);
		this.oSLMC.removeAriaLabelledBy(this.oButton1);
		assert.ok(this.oMC.removeAriaLabelledBy.calledOnce, "If removeAriaLabelledBy was called in MicroChart from SmartMicroChart exactly once");
		oSpyAriaLabelledBy.restore();
	});

	QUnit.test("Test removeAllAriaLabelledBy", function(assert) {
		var oSpyAriaLabelledBy = sinon.spy(this.oMC, "removeAllAriaLabelledBy");

		this.oSLMC.addAriaLabelledBy(this.oButton1);
		this.oSLMC.addAriaLabelledBy(this.oButton2);
		this.oSLMC.addAriaLabelledBy(this.oButton3);

		this.oSLMC.removeAllAriaLabelledBy(this.oText);
		assert.ok(this.oMC.removeAllAriaLabelledBy.calledOnce, "If removeAllAriaLabelledBy was called in MicroChart from SmartMicroChart exactly once");
		oSpyAriaLabelledBy.restore();
	});

	QUnit.module("Function _getBindingPath", {
		beforeEach: function() {
			this.oSLMC = new SmartLineMicroChart();
		},
		afterEach: function() {
			this.oSLMC.destroy();
			this.oSLMC = null;
		}
	});

	QUnit.test("Control has chartBindingPath", function(assert) {
		this.oSLMC.setChartBindingPath("/Some/Path");

		assert.equal(this.oSLMC._getBindingPath(), "/Some/Path", "ChartBindingPath has been correctly returned.");
	});

	QUnit.test("Control has entitySet", function(assert) {
		this.oSLMC.setEntitySet("Enten");

		assert.equal(this.oSLMC._getBindingPath(), "/Enten", "/{entitySet} has been correctly returned.");
	});

	QUnit.test("Control has entitySet and chartBindingPath", function(assert) {
		this.oSLMC.setChartBindingPath("/Some/Path");
		this.oSLMC.setEntitySet("Enten");

		assert.equal(this.oSLMC._getBindingPath(), "/Some/Path", "ChartBindingPath has been correctly returned.");
	});

	QUnit.test("Control has neither property", function(assert) {
		assert.equal(this.oSLMC._getBindingPath(), "", "Empty string has been returned.");
	});

	QUnit.module("Function _updateAssociations", {
		beforeEach: function() {
			this.oSLMC = new SmartLineMicroChart({
				id: "smart-line-microchart"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			this.oSLMC._oChartViewMetadata = {
				annotation: {
					Title: { Path: "Title" }
				}
			};
			sinon.stub(this.oSLMC, "_checkChartMetadata").returns(true);
			sinon.stub(this.oSLMC, "_onMetadataInitialized");
			this.oSLMC._sBindingPath = "/Series";

		},
		afterEach: function() {
			this.oSLMC.destroy();
			this.oSLMC._checkChartMetadata.restore();
			this.oSLMC._onMetadataInitialized.restore();
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
		this.oSLMC.setModel(oModel);
		var oChartTitle = new Label({ text: "DefaultText" });
		this.oSLMC.setChartTitle(oChartTitle);

		this.oSLMC._updateAssociations(oPointsBinding);

		assert.equal(oChartTitle.getText(), "My Title", "Aggregation has been updated.");
	});

	QUnit.module("Chart types", {
		beforeEach: function() {
			this.oSLMC = new SmartLineMicroChart();
		},
		afterEach: function() {
			this.oSLMC.destroy();
		}
	});

	QUnit.test("Chart types in designtime.js and supported chart types are the same", function(assert) {
		//Arrange
		var done = assert.async();
		//Act
		this.oSLMC.getMetadata().loadDesignTime().then(function(oDesignTime) {
			var aTypes = ["Line"];
			//Assert
			assert.deepEqual(this.oSLMC._getSupportedChartTypes(), aTypes, "The supported chart types are correct");
			assert.deepEqual(oDesignTime.annotations.chartType.whiteList.values, aTypes, "The defined types in designtime.js are correct");
			done();
		}.bind(this));
	});

	QUnit.start();
});
