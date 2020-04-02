jQuery.sap.registerModulePath('sap.apf.testhelper', '../../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require('sap.apf.utils.utils');
sap.ui.define([
	"sap/apf/modeler/ui/utils/stepPropertyMetadataHandler"
], function(StepPropertyMetadataHandler){
	'use strict';
	var oStepPropertyMetadataHandler, spyOnGetEntityTypeMetadata;
	function _getModelForTreeTableRepresentation() {
		return [ {
			"key" : "TreeTableRepresentation",
			"name" : "text : TreeTableRepresentation"
		} ];
	}
	function _getModelForRepresentation() {
		return [ {
			"key" : "ColumnChart",
			"name" : "text : ColumnChart"
		}, {
			"key" : "BarChart",
			"name" : "text : BarChart"
		}, {
			"key" : "LineChart",
			"name" : "text : LineChart"
		}, {
			"key" : "LineChartWithTwoVerticalAxes",
			"name" : "text : LineChartWithTwoVerticalAxes"
		}, {
			"key" : "LineChartWithTimeAxis",
			"name" : "text : LineChartWithTimeAxis"
		}, {
			"key" : "PieChart",
			"name" : "text : PieChart"
		}, {
			"key" : "DonutChart",
			"name" : "text : DonutChart"
		}, {
			"key" : "ScatterPlotChart",
			"name" : "text : ScatterPlotChart"
		}, {
			"key" : "BubbleChart",
			"name" : "text : BubbleChart"
		}, {
			"key" : "StackedColumnChart",
			"name" : "text : StackedColumnChart"
		}, {
			"key" : "StackedBarChart",
			"name" : "text : StackedBarChart"
		}, {
			"key" : "PercentageStackedColumnChart",
			"name" : "text : PercentageStackedColumnChart"
		}, {
			"key" : "PercentageStackedBarChart",
			"name" : "text : PercentageStackedBarChart"
		}, {
			"key" : "CombinationChart",
			"name" : "text : CombinationChart"
		}, {
			"key" : "StackedCombinationChart",
			"name" : "text : StackedCombinationChart"
		}, {
			"key" : "DualCombinationChart",
			"name" : "text : DualCombinationChart"
		}, {
			"key" : "DualStackedCombinationChart",
			"name" : "text : DualStackedCombinationChart"
		},{
			"key" : "HeatmapChart",
			"name" : "text : HeatmapChart"
		}, {
			"key" : "TableRepresentation",
			"name" : "text : tableView"
		} ];
	}
	QUnit.module("Step Property Metadata Handler ", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(oModelerInstance) {
				var oCoreApi, oStep;
				oCoreApi = oModelerInstance.modelerCore;
				oCoreApi.getText = function(key) {
					return "text : " + key;
				};
				oStep = oModelerInstance.unsavedStepWithFilterMapping;
				oCoreApi.getEntityTypeMetadataAsPromise = oModelerInstance.configurationEditorForUnsavedConfig.getEntityTypeMetadataAsPromise;
				spyOnGetEntityTypeMetadata = sinon.spy(oCoreApi, "getEntityTypeMetadataAsPromise");
				oStepPropertyMetadataHandler = new StepPropertyMetadataHandler(oCoreApi, oStep);
				oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(entityTypeMetadata) {
					that.entityTypeMetadata = entityTypeMetadata;
					done();
				});
			});
		},
		afterEach : function() {
			spyOnGetEntityTypeMetadata.restore();
		}
	});
	QUnit.test('When initialization', function(assert) {
		assert.ok(oStepPropertyMetadataHandler, 'then object exists');
	});
	QUnit.test('When we get dimensions of a step', function(assert) {
		//arrange
		var aExpectedProperties = [ "property1", "property3", "property1Text" ];
		//assert
		assert.deepEqual(oStepPropertyMetadataHandler.getDimensionsProperties(this.entityTypeMetadata), aExpectedProperties, 'then 3 values are returned');
	});
	QUnit.test('When we get measures of a step', function(assert) {
		//arrange
		var aExpectedProperties = [ "property4" ];
		//assert
		assert.deepEqual(oStepPropertyMetadataHandler.getMeasures(this.entityTypeMetadata), aExpectedProperties, 'then 1 measure is returned');
	});
	QUnit.test('When we get select properties of a step', function(assert) {
		//arrange
		var aExpectedProperties = [ "property1", "property3", "property4", "property1Text" ];
		//assert
		assert.deepEqual(oStepPropertyMetadataHandler.getProperties(), aExpectedProperties, 'then 4 values are returned');
	});
	QUnit.test('When a property which exists is passed', function(assert) {
		//arrange
		var oExpectedMetadata = {
			"aggregation-role" : "dimension",
			"dataType" : {
				"maxLength" : "10",
				"type" : "Edm.String"
			},
			"label" : "Dimensionproperty1",
			"name" : "Dimension",
			"text" : "property1Text"
		};
		//assert
		assert.deepEqual(oStepPropertyMetadataHandler.getPropertyMetadata(this.entityTypeMetadata, "property1"), oExpectedMetadata, 'then metadata of the property is returned');
		assert.strictEqual(spyOnGetEntityTypeMetadata.calledWith("testService1", "entitySet1"), true, 'then metadata is fetched for the entity');
	});
	QUnit.test('When a property that does not exist is passed ', function(assert) {
		//assert
		assert.deepEqual(oStepPropertyMetadataHandler.getPropertyMetadata(this.entityTypeMetadata, "property9"), undefined, 'then metadata is returned as undefined');
		assert.strictEqual(spyOnGetEntityTypeMetadata.calledWith("testService1", "entitySet1"), true, 'then metadata is fetched for the entity');
	});
	QUnit.test('When the default label of a property is present', function(assert) {
		//arrange
		var oExpectedMetadata = "Dimensionproperty3";
		//assert
		assert.deepEqual(oStepPropertyMetadataHandler.getDefaultLabel(this.entityTypeMetadata, "property3"), oExpectedMetadata, 'then default property is returned');
	});
	QUnit.test('When a default label of a property is not present', function(assert) {
		//arrange
		var oExpectedMetadata = "Measureproperty4";
		//assert
		assert.deepEqual(oStepPropertyMetadataHandler.getDefaultLabel(this.entityTypeMetadata, "property4"), oExpectedMetadata, 'then the name of the property is returned');
	});
	QUnit.test('When a text property is present in select properties for a particular property', function(assert) {
		//assert
		assert.deepEqual(oStepPropertyMetadataHandler.hasTextPropertyOfDimension(this.entityTypeMetadata, "property1"), true, 'then result is true');
	});
	QUnit.test('When a text property is not present in select properties for a particular property', function(assert) {
		//assert
		assert.deepEqual(oStepPropertyMetadataHandler.hasTextPropertyOfDimension(this.entityTypeMetadata, "property3"), false, 'then result is false');
	});
	QUnit.test('When the chart type model is prepared for a step', function(assert) {
		//assert
		assert.deepEqual(oStepPropertyMetadataHandler.getRepresentationTypesArray(), _getModelForRepresentation(), 'then correct model is set for the chart type');
	});
	QUnit.module("Step Property Metadata Handler - When no metadata is available", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(oModelerInstance) {
				var oCoreApi, oStep;
				oCoreApi = oModelerInstance.modelerCore;
				oStep = oModelerInstance.unsavedStepWithFilterMapping;
				oCoreApi.getEntityTypeMetadataAsPromise = function() {
					return sap.apf.utils.createPromise(undefined);
				};
				oStepPropertyMetadataHandler = new StepPropertyMetadataHandler(oCoreApi, oStep);
				oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(entityTypeMetadata) {
					that.entityTypeMetadata = entityTypeMetadata;
					done();
				});
			});
		}
	});
	QUnit.test('When initialization', function(assert) {
		assert.ok(oStepPropertyMetadataHandler, 'then object exists');
	});
	QUnit.test('When we get dimensions of a step', function(assert) {
		//arrange
		var aExpectedProperties = [];
		//assert
		assert.deepEqual(oStepPropertyMetadataHandler.getDimensionsProperties(this.entityTypeMetadata), aExpectedProperties, 'then an empty array for dimensions is returned');
	});
	QUnit.test('When we get measures of a step', function(assert) {
		//arrange
		var aExpectedProperties = [];
		//assert
		assert.deepEqual(oStepPropertyMetadataHandler.getMeasures(this.entityTypeMetadata), aExpectedProperties, 'then an empty array for measures is returned');
	});
	QUnit.test('When we get select properties of a step', function(assert) {
		//arrange
		var aExpectedProperties = [ "property1", "property3", "property4", "property1Text" ];
		//assert
		assert.deepEqual(oStepPropertyMetadataHandler.getProperties(), aExpectedProperties, 'then an empty array for properties is returned');
	});
	QUnit.test('When getting metadata for a property which exists', function(assert) {
		//assert
		assert.deepEqual(oStepPropertyMetadataHandler.getPropertyMetadata(this.entityTypeMetadata, "property9"), undefined, 'then undefined is returned since metadta is not available');
	});
	QUnit.test('When getting default label of a property', function(assert) {
		//arrange
		var sDefaultLabel = "";
		//assert
		assert.deepEqual(oStepPropertyMetadataHandler.getDefaultLabel(this.entityTypeMetadata, "property9"), sDefaultLabel, 'then empty default label is returned');
	});
	QUnit.test('When finding whether a dimension has text property associated with it', function(assert) {
		//assert
		assert.deepEqual(oStepPropertyMetadataHandler.hasTextPropertyOfDimension(this.entityTypeMetadata, "property9"), false, 'then default value false is returned');
	});
	QUnit.test('When finding whether a dimension has text property associated with it', function(assert) {
		//assert
		assert.deepEqual(oStepPropertyMetadataHandler.hasTextPropertyOfDimension(this.entityTypeMetadata, "property9"), false, 'then default value false is returned');
	});
	QUnit.test('When we get type of a step', function(assert) {
		//arrange
		var aExpectedtype = "step";
		//assert
		assert.strictEqual(oStepPropertyMetadataHandler.getStepType(), aExpectedtype, 'then correct step type is returned ');
	});
	QUnit.module("Step Property Metadata Handler for a hierarchical step ", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(oModelerInstance) {
				var oCoreApi, oStep;
				oCoreApi = oModelerInstance.modelerCore;
				oStep = oModelerInstance.firstHierarchicalStep;
				oCoreApi.getEntityTypeMetadataAsPromise = oModelerInstance.configurationEditorForUnsavedConfig.getEntityTypeMetadataAsPromise;
				spyOnGetEntityTypeMetadata = sinon.spy(oCoreApi, "getEntityTypeMetadataAsPromise");
				oStepPropertyMetadataHandler = new StepPropertyMetadataHandler(oCoreApi, oStep);
				oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(entityTypeMetadata) {
					that.entityTypeMetadata = entityTypeMetadata;
					done();
				});
			});
		},
		afterEach : function() {
			spyOnGetEntityTypeMetadata.restore();
		}
	});
	QUnit.test('When the chart type model is prepared for a hierarchical step', function(assert) {
		//assert
		assert.deepEqual(oStepPropertyMetadataHandler.getRepresentationTypesArray(), _getModelForTreeTableRepresentation(), 'then correct model is set for the chart type');
	});
	QUnit.test('When we get select properties of a hierarchical step', function(assert) {
		//arrange
		var aExpectedProperties = [ "nonHierarchicalproperty1", "nonHierarchicalproperty2" ];
		//assert
		assert.deepEqual(oStepPropertyMetadataHandler.getProperties(), aExpectedProperties, 'then 2 values are returned ');
	});
	QUnit.test('When we get select hierarchical properties of a hierarchical step', function(assert) {
		//arrange
		var aExpectedProperties = "hierarchicalproperty1";
		//assert
		assert.deepEqual(oStepPropertyMetadataHandler.getHierarchicalProperty(), aExpectedProperties, 'then one hierarchical property is returned ');
	});
	QUnit.test('When we get type of a hierarchical step', function(assert) {
		//arrange
		var aExpectedtype = "hierarchicalStep";
		//assert
		assert.strictEqual(oStepPropertyMetadataHandler.getStepType(), aExpectedtype, 'then correct step type is returned ');
	});
});