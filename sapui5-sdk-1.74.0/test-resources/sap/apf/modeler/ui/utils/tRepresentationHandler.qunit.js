sap.ui.define('sap/apf/modeler/ui/tRepresentationHandler', [
	"sap/apf/modeler/ui/utils/representationHandler",
	"sap/apf/ui/utils/representationTypesHandler",
	"sap/apf/core/representationTypes",
	"sap/apf/modeler/core/representation",
	"sap/apf/modeler/core/elementContainer",
	"sap/apf/utils/hashtable"
], function(RepresentationHandler, RepresentationTypesHandler, RepresentationTypes, CoreRepresentation, ElementContainer, Hashtable) {
	QUnit.module("GIVEN a representationType the respective kind dependent mandatory field information is returned", {
		beforeEach : function(assert) {
			var context = this;
			var oRepresentation = {
					getRepresentationType : function(){
						return context.representationType;
					},
					getDimensions : function(){
						return ["dimension1", "dimension2", "dimension3"];
					},
					getMeasures : function(){
						return ["measure1", "measure2", "measure3"];
					},
					getMeasureKind : function(property){
						return context.measureKinds[property];
					},
					getDimensionKind : function(property){
						return context.dimensionKinds[property];
					},
					getProperties : function(){
						return ["property1", "property2", "property3"];
					},
					getPropertyKind : function(property){
						return context.propertyKinds[property];
					},
					getHierarchyProperty : function(){
						return "hierarchicalProperty";
					}
			};
			var textReader = function(){
				return "none";
			};
			this.representationHandler = new RepresentationHandler(oRepresentation, new RepresentationTypesHandler(new RepresentationTypes()), textReader);
		},
		afterEach : function() {
		}
	});
	QUnit.test("Column Chart - dimensions", function(assert){
		this.representationType = "ColumnChart";
		this.dimensionKinds = {
			dimension1 : "xAxis",
			dimension2 : "xAxis"
		};
		var expectedDimensionKindDefinition = [{
			sProperty : "dimension1",
			sContext : "xAxis",
			bMandatory : false
		}, {
			sProperty : "dimension2",
			sContext : "xAxis",
			bMandatory : false
		}];
		assert.deepEqual(this.representationHandler.getActualDimensions(), expectedDimensionKindDefinition, "Expexted dimension kind definition returned");
	});
	QUnit.test("Column Chart - legends", function(assert){
		this.representationType = "ColumnChart";
		this.dimensionKinds = {
				dimension1 : "legend",
				dimension2 : "legend"
		};
		var expectedDimensionKindDefinition = [{
			sProperty : "dimension1",
			sContext : "legend",
			bMandatory : false
		}, {
			sProperty : "dimension2",
			sContext : "legend",
			bMandatory : false
		}];
		assert.deepEqual(this.representationHandler.getActualLegends(), expectedDimensionKindDefinition, "Expexted legends kind definition returned");
	});
	QUnit.test("Column Chart - measures", function(assert){
		this.representationType = "ColumnChart";
		this.measureKinds = {
				measure1 : "yAxis",
				measure2 : "yAxis"
		};
		var expectedMeasureKindDefinition = [{
			sProperty : "measure1",
			sContext : "yAxis",
			bMandatory : true
		}, {
			sProperty : "measure2",
			sContext : "yAxis",
			bMandatory : false
		}];
		assert.deepEqual(this.representationHandler.getActualMeasures(), expectedMeasureKindDefinition, "Expexted measures kind definition returned");
	});
	QUnit.test("Line Chart with 2 axis - dimensions", function(assert){
		this.representationType = "LineChartWithTwoVerticalAxes";
		this.dimensionKinds = {
			dimension1 : "xAxis",
			dimension2 : "xAxis"
		};
		var expectedDimensionKindDefinition = [{
			sProperty : "dimension1",
			sContext : "xAxis",
			bMandatory : true
		}, {
			sProperty : "dimension2",
			sContext : "xAxis",
			bMandatory : false
		}];
		assert.deepEqual(this.representationHandler.getActualDimensions(), expectedDimensionKindDefinition, "Expexted dimension kind definition returned");
	});
	QUnit.test("Line Chart with 2 axis - legends", function(assert){
		this.representationType = "LineChartWithTwoVerticalAxes";
		this.dimensionKinds = {
				dimension1 : "legend",
				dimension2 : "legend"
		};
		var expectedDimensionKindDefinition = [{
			sProperty : "dimension1",
			sContext : "legend",
			bMandatory : false
		}, {
			sProperty : "dimension2",
			sContext : "legend",
			bMandatory : false
		}];
		assert.deepEqual(this.representationHandler.getActualLegends(), expectedDimensionKindDefinition, "Expexted legends kind definition returned");
	});
	QUnit.test("Line Chart with 2 axis - measures", function(assert){
		this.representationType = "LineChartWithTwoVerticalAxes";
		this.measureKinds = {
				measure1 : "yAxis",
				measure2 : "yAxis2"
		};
		var expectedMeasureKindDefinition = [{
			sProperty : "measure1",
			sContext : "yAxis",
			bMandatory : true
		}, {
			sProperty : "measure2",
			sContext : "yAxis2",
			bMandatory : true
		}];
		assert.deepEqual(this.representationHandler.getActualMeasures(), expectedMeasureKindDefinition, "Expexted measure kind definition returned");
	});
	QUnit.test("Line Chart with 2 axis - empty kind field is mandatory", function(assert){
		this.representationType = "LineChartWithTwoVerticalAxes";
		this.measureKinds = {};
		var expectedMeasureKindDefinition = [{
			sProperty : "",
			sContext : "yAxis",
			bMandatory : true
		}, {
			sProperty : "",
			sContext : "yAxis2",
			bMandatory : true
		}];
		assert.deepEqual(this.representationHandler.getActualMeasures(), expectedMeasureKindDefinition, "Expexted measure kind definition returned");
	});
	QUnit.test("Table Representation", function(assert){
		this.representationType = "TableRepresentation";
		this.propertyKinds = {
			property1 : "column",
			property2 : "column"
		};
		var expectedPropertyKindDefinition = [{
			sProperty : "property1",
			sContext : "column",
			bMandatory : true
		}, {
			sProperty : "property2",
			sContext : "column",
			bMandatory : false
		}];
		assert.deepEqual(this.representationHandler.getActualProperties(), expectedPropertyKindDefinition, "Expexted properties kind definition returned");
	});
	QUnit.test("Tree Table Representation - properties", function(assert){
		this.representationType = "TreeTableRepresentation";
		this.propertyKinds = {
				property1 : "column",
				property2 : "column"
		};
		var expectedPropertyKindDefinition = [{
			sProperty : "property1",
			sContext : "column",
			bMandatory : false
		}, {
			sProperty : "property2",
			sContext : "column",
			bMandatory : false
		}];
		assert.deepEqual(this.representationHandler.getActualProperties(), expectedPropertyKindDefinition, "Expexted properties kind definition returned");
	});
	QUnit.test("Tree Table Representation - hierarchical property", function(assert){
		this.representationType = "TreeTableRepresentation";
		var expectedPropertyKindDefinition = [{
			sProperty : "hierarchicalProperty",
			sContext : "hierarchicalColumn",
			bMandatory : false
		}];
		assert.deepEqual(this.representationHandler.getHierarchicalProperty(), expectedPropertyKindDefinition, "Expexted properties kind definition returned");
	});
	QUnit.module("GIVEN a combinationChart with not enough measures available", {
		beforeEach : function(assert) {
			var context = this;
			var oRepresentation = {
					getRepresentationType : function(){
						return "CombinationChart";
					},
					getMeasures : function(){
						return context.measures;
					},
					getMeasureKind : function(property){
						return "yAxis";
					}
			};
			var textReader = function(){
				return "none";
			};
			this.representationHandler = new RepresentationHandler(oRepresentation, new RepresentationTypesHandler(new RepresentationTypes()), textReader);
		},
		afterEach : function() {
		}
	});
	QUnit.test("Get Actual Measures with no measure set", function(assert) {
		this.measures = [];
		var expectedMeasureKindDefinition = [{
			sProperty : "",
			sContext : "yAxis",
			bMandatory : true
		}, {
			sProperty : "",
			sContext : "yAxis",
			bMandatory : true
		}];
		assert.deepEqual(this.representationHandler.getActualMeasures(), expectedMeasureKindDefinition, "2 empty rows returned");
	});
	QUnit.test("Get Actual Measures with one measure set", function(assert) {
		this.measures = ["measure1"];
		var expectedMeasureKindDefinition = [{
			sProperty : "measure1",
			sContext : "yAxis",
			bMandatory : true
		}, {
			sProperty : "",
			sContext : "yAxis",
			bMandatory : true
		}];
		assert.deepEqual(this.representationHandler.getActualMeasures(), expectedMeasureKindDefinition, "1 filled row and 1 empty row returned");
	});
	QUnit.module("getActual functions when no dimensions/measures are selected on Step level", {
		beforeEach : function(assert) {
			this.oRepresentation = new CoreRepresentation("id",{
				constructors : {
					ElementContainer : ElementContainer,
					Hashtable : Hashtable
				},
				instances : {
					messageHandler : {
						check : function(){}
					}
				}
			});
			var textReader = function(){
				return "none";
			};
			this.representationHandler = new RepresentationHandler(this.oRepresentation, new RepresentationTypesHandler(new RepresentationTypes()), textReader);
		}
	});
	QUnit.test("Column Chart", function(assert) {
		//setup
		this.oRepresentation.setRepresentationType("ColumnChart");
		//Dimension
		var expectedDimensions = [{
			sProperty : "none",
			sContext : "xAxis",
			bMandatory : false
		}];
		assert.deepEqual(this.representationHandler.getActualDimensions(), expectedDimensions, "GetActual dimension returns correct empty entries");
		//Legend
		var expectedLegends = [{
			sProperty : "none",
			sContext : "legend",
			bMandatory : false
		}];
		assert.deepEqual(this.representationHandler.getActualLegends(), expectedLegends, "GetActual legends returns correct empty entries");
		//Measures
		var expectedMeasures = [{
			sProperty : "",
			sContext : "yAxis",
			bMandatory : true
		}];
		assert.deepEqual(this.representationHandler.getActualMeasures(), expectedMeasures, "GetActual Measures returns correct empty entries");
	});
	QUnit.test("Line Chart", function(assert) {
		//setup
		this.oRepresentation.setRepresentationType("LineChart");
		//Dimension
		var expectedDimensions = [{
			sProperty : "",
			sContext : "xAxis",
			bMandatory : true
		}];
		assert.deepEqual(this.representationHandler.getActualDimensions(), expectedDimensions, "GetActual dimension returns correct empty entries");
		//Legend
		var expectedLegends = [{
			sProperty : "none",
			sContext : "legend",
			bMandatory : false
		}];
		assert.deepEqual(this.representationHandler.getActualLegends(), expectedLegends, "GetActual legends returns correct empty entries");
		//Measures
		var expectedMeasures = [{
			sProperty : "",
			sContext : "yAxis",
			bMandatory : true
		}];
		assert.deepEqual(this.representationHandler.getActualMeasures(), expectedMeasures, "GetActual Measures returns correct empty entries");
	});
	QUnit.test("Line Chart with two vertical axes", function(assert) {
		//setup
		this.oRepresentation.setRepresentationType("LineChartWithTwoVerticalAxes");
		//Dimension
		var expectedDimensions = [{
			sProperty : "",
			sContext : "xAxis",
			bMandatory : true
		}];
		assert.deepEqual(this.representationHandler.getActualDimensions(), expectedDimensions, "GetActual dimension returns correct empty entries");
		//Legend
		var expectedLegends = [{
			sProperty : "none",
			sContext : "legend",
			bMandatory : false
		}];
		assert.deepEqual(this.representationHandler.getActualLegends(), expectedLegends, "GetActual legends returns correct empty entries");
		//Measures
		var expectedMeasures = [{
			sProperty : "",
			sContext : "yAxis",
			bMandatory : true
		},{
			sProperty : "",
			sContext : "yAxis2",
			bMandatory : true
		}];
		assert.deepEqual(this.representationHandler.getActualMeasures(), expectedMeasures, "GetActual Measures returns correct empty entries");
	});
	QUnit.test("Scatter", function(assert) {
		//setup
		this.oRepresentation.setRepresentationType("ScatterPlotChart");
		//Dimension
		var expectedDimensions = [];
		assert.deepEqual(this.representationHandler.getActualDimensions(), expectedDimensions, "GetActual dimension returns correct empty entries");
		//Legend
		var expectedLegends = [{
			sProperty : "none",
			sContext : "regionColor",
			bMandatory : false
		},{
			sProperty : "none",
			sContext : "regionShape",
			bMandatory : false
		}];
		assert.deepEqual(this.representationHandler.getActualLegends(), expectedLegends, "GetActual legends returns correct empty entries");
		//Measures
		var expectedMeasures = [{
			sProperty : "",
			sContext : "xAxis",
			bMandatory : true
		},{
			sProperty : "",
			sContext : "yAxis",
			bMandatory : true
		}];
		assert.deepEqual(this.representationHandler.getActualMeasures(), expectedMeasures, "GetActual Measures returns correct empty entries");
	});
	QUnit.test("BubbleChart", function(assert) {
		//setup
		this.oRepresentation.setRepresentationType("BubbleChart");
		//Dimension
		var expectedDimensions = [];
		assert.deepEqual(this.representationHandler.getActualDimensions(), expectedDimensions, "GetActual dimension returns correct empty entries");
		//Legend
		var expectedLegends = [{
			sProperty : "none",
			sContext : "regionColor",
			bMandatory : false
		},{
			sProperty : "none",
			sContext : "regionShape",
			bMandatory : false
		}];
		assert.deepEqual(this.representationHandler.getActualLegends(), expectedLegends, "GetActual legends returns correct empty entries");
		//Measures
		var expectedMeasures = [{
			sProperty : "",
			sContext : "xAxis",
			bMandatory : true
		},{
			sProperty : "",
			sContext : "yAxis",
			bMandatory : true
		},{
			sProperty : "",
			sContext : "bubbleWidth",
			bMandatory : true
		}];
		assert.deepEqual(this.representationHandler.getActualMeasures(), expectedMeasures, "GetActual Measures returns correct empty entries");
	});
	QUnit.test("Heatmap", function(assert) {
		//setup
		this.oRepresentation.setRepresentationType("HeatmapChart");
		//Dimension
		var expectedDimensions = [{
			sProperty : "",
			sContext : "xAxis",
			bMandatory : true
		},{
			sProperty : "none",
			sContext : "xAxis2",
			bMandatory : false
		}];
		assert.deepEqual(this.representationHandler.getActualDimensions(), expectedDimensions, "GetActual dimension returns correct empty entries");
		//Legend
		var expectedLegends = [];
		assert.deepEqual(this.representationHandler.getActualLegends(), expectedLegends, "GetActual legends returns correct empty entries");
		//Measures
		var expectedMeasures = [{
			sProperty : "",
			sContext : "sectorColor",
			bMandatory : true
		}];
		assert.deepEqual(this.representationHandler.getActualMeasures(), expectedMeasures, "GetActual Measures returns correct empty entries");
	});
	QUnit.test("Table", function(assert) {
		//setup
		this.oRepresentation.setRepresentationType("TableRepresentation");
		//Properties
		var expectedProperties = [{
			sProperty : "",
			sContext : "column",
			bMandatory : true
		}];
		assert.deepEqual(this.representationHandler.getActualProperties(), expectedProperties, "GetActual properties returns correct empty entries");
	});
	QUnit.test("TreeTable", function(assert) {
		//setup
		this.oRepresentation.setRepresentationType("TreeTableRepresentation");
		//Properties
		var expectedProperties = [{
			sProperty : "none",
			sContext : "column",
			bMandatory : false
		}];
		assert.deepEqual(this.representationHandler.getActualProperties(), expectedProperties, "GetActual properties returns correct empty entries");
		//Hierarchical Property - this test is more for consistency reason, it is not possible to have a treeTable as representation without having a hierarchical property
		var expectedHierarchicalProperties = [{
			sProperty : undefined,
			sContext : "hierarchicalColumn",
			bMandatory : false
		}];
		assert.deepEqual(this.representationHandler.getHierarchicalProperty(), expectedHierarchicalProperties, "GetHierarchicalProperty returns correct empty entries");
	});
});