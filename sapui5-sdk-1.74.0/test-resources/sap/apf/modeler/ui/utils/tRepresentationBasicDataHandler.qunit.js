jQuery.sap.declare('sap.apf.modeler.ui.tRepresentationBasicDataHandler');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require('sap.apf.utils.utils');

sap.ui.define([
	"sap/apf/modeler/ui/utils/representationHandler",
	"sap/apf/modeler/ui/utils/representationBasicDataHandler",
	"sap/apf/ui/utils/representationTypesHandler",
	"sap/apf/modeler/ui/utils/constants",
	"sap/apf/modeler/ui/utils/viewValidator",
	"sap/apf/modeler/ui/utils/propertyTypeOrchestration"
], function(RepresentationHandler, RepresentationBasicDataHandler, RepresentationTypesHandler, modelerUiConstants, ViewValidator,
			propertyTypeOrchestration){
	'use strict';

	function createStepPropertyMetadataHandler(oStep) {
		return {
			getDimensionsProperties : _fnReturnEmptyArray,
			getMeasures : _fnReturnEmptyArray,
			getDefaultLabel : _doNothing,
			getProperties : _fnReturnEmptyArray,
			getEntityTypeMetadataAsPromise : sap.apf.utils.createPromise,
			getStepType : _doNothing,
			getHierarchicalProperty : _doNothing,
			hasTextPropertyOfDimension : _doNothing,
			oStep: oStep
		};
	}

	function _fnReturnEmptyArray() {
		return [];
	}
	function _doNothing() {
	}
	function _fnReturnRepViewStub(testEnv) {
		var oView = {
			testName: "stubbed View",
			getViewData : function() {
				return {
					oConfigurationEditor : testEnv.oModelerInstance.configurationEditorForUnsavedConfig,
					oCoreApi : testEnv.oModelerInstance.modelerCore,
					oConfigurationHandler : testEnv.oModelerInstance.configurationHandler
				};
			},
			attachEvent : _doNothing,
			getController : function() {
				return {
					createId : function(id) {
						return id;
					},
					byId : function(id) {
						return testEnv.oBasicDataLayout;
					}
				};
			}
		};
		return oView;
	}
	function _commonInitialization(testEnv, namedParameters, done) {
		testEnv.oBasicDataLayout = new sap.m.VBox("idBasicDataLayout");
		
		var representationIndex = namedParameters.representationIndex;
		var isHierarchicalStep = namedParameters.isHierarchicalStep;

		sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(oModelerInstance) {
			testEnv.oModelerInstance = oModelerInstance;
			
			testEnv.getTextStub = sinon.stub(oModelerInstance.modelerCore, "getText", function(key) {
				switch (key) {
				case "none": return "<none>";
				default: return "<unknown:" + key + ">";
				}
			});

			var oStepPropertyMetadataHandler = isHierarchicalStep
				? createStepPropertyMetadataHandler(testEnv.oModelerInstance.firstHierarchicalStep)
				: createStepPropertyMetadataHandler(testEnv.oModelerInstance.unsavedStepWithoutFilterMapping);

			var oRepresentation =  isHierarchicalStep
				? oModelerInstance.firstHierarchicalStep.getRepresentations()[representationIndex]
				: oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[representationIndex];
			var oRepresentationTypeHandler = new RepresentationTypesHandler(testEnv.oModelerInstance.modelerCore.getRepresentationTypes());
			var oRepresentationHandler = new RepresentationHandler(oRepresentation, oRepresentationTypeHandler, testEnv.oModelerInstance.modelerCore.getText);

			var oViewValidator = new ViewValidator({
				byId : function(){}
			});
			testEnv.oRepresentationBasicDataHandler
				= new RepresentationBasicDataHandler(_fnReturnRepViewStub(testEnv), oStepPropertyMetadataHandler, oRepresentationHandler, oViewValidator);

			done();
		});
	}
	function _commonCleanUpsInAfterEach(testEnv) {
		testEnv.getTextStub.restore();
		testEnv.oModelerInstance.reset();
		testEnv.oBasicDataLayout.destroyItems();
		testEnv.oBasicDataLayout.destroy();
	}
	QUnit.module(
			"For chart types like ColumnChart,BarChart,LineChart,LineChartWithTwoVerticalAxes,LineChartWithTimeAxis,ScatterPlotChart,BubbleChart,StackedColumnChart,StackedBarChart,PercentageStackedColumnChart,PercentageStackedBarChart,HeatMapChart",
			{
				beforeEach : function(assert) {
					var done = assert.async();
					_commonInitialization(this, {representationIndex: 0}, done);
				},
				afterEach : function(assert) {
					_commonCleanUpsInAfterEach(this);
				}
			});
	QUnit.test('When instantiating basic data', function(assert) {
		//arrange
		var done = assert.async();
		var that = this;
		var spyOnAttachEvent = sinon.spy(that.oRepresentationBasicDataHandler.oRepresentationView, "attachEvent");
		var oExpectedDimensionsToBeCreated = [ {
			sContext : "xAxis",
			sProperty : "property2",
			bMandatory: false
		} ];
		var oExpectedLegendsToBeCreated = [ {
			sContext : "legend",
			sProperty : "property3",
			bMandatory: false
		} ];
		var oExpectedMeasuresToBeCreated = [ {
			sContext : "yAxis",
			sProperty : "property4",
			bMandatory: true
		} ];
		//action
		that.oRepresentationBasicDataHandler.instantiateBasicDataAsPromise()
			.then(function(){
				//assert
				var aItems = that.oRepresentationBasicDataHandler.oRepresentationView.getController().byId("idBasicDataLayout").getItems();
				assert.strictEqual(that.oRepresentationBasicDataHandler.nCounter, 3, 'then three propertyTypeHandler views are created each for dimensions, legend and measures respectively');
				assert.strictEqual(aItems[0].getId(), "iddimensions", "then dimension propertyTypeHandler view exists");
				assert.strictEqual(aItems[1].getId(), "idlegend", "then legend propertyTypeHandler view exists");
				assert.strictEqual(aItems[2].getId(), "idmeasures", "then measure propertyTypeHandler view exists");
				assert.strictEqual(aItems.length, 3, "then dimension,legend,measure propertyTypeHandler view is inserted in the parent representation view");
				assert.deepEqual(aItems[0].getViewData().aPropertiesToBeCreated, oExpectedDimensionsToBeCreated, "then Dimension row for xAxis is to be created");
				assert.deepEqual(aItems[1].getViewData().aPropertiesToBeCreated, oExpectedLegendsToBeCreated, "then Dimension row for legend is to be created");
				assert.deepEqual(aItems[2].getViewData().aPropertiesToBeCreated, oExpectedMeasuresToBeCreated, "then Measure row for yAxis is to be created");
				assert.strictEqual(spyOnAttachEvent.calledThrice, true, 'then attachEvent is called three times on parent representation object');
				assert.strictEqual(spyOnAttachEvent.calledWith(modelerUiConstants.events.REMOVEALLPROPERTIESFROMPARENTOBJECT), true, 'then removeAllPropertiesFromParentObject event is attached on representation view');
				spyOnAttachEvent.restore();
				done();
			});
	});
	QUnit.module("For a PieChart", {
		beforeEach : function(assert) {
			var done = assert.async();
			_commonInitialization(this, {representationIndex: 1}, done);
		},
		afterEach : function(assert) {
			_commonCleanUpsInAfterEach(this);
		}
	});
	QUnit.test('When instantiating basic data', function(assert) {
		var done = assert.async();
		var that = this;
		//arrange
		var spyOnAttachEvent = sinon.spy(that.oRepresentationBasicDataHandler.oRepresentationView, "attachEvent");
		var oExpectedDimensionsToBeCreated = [ {
			sContext : "sectorColor",
			sProperty : "<none>",
			bMandatory: false
		} ];
		var oExpectedMeasuresToBeCreated = [ {
			sContext : "sectorSize",
			sProperty : "",
			bMandatory: true
		} ];
		//action
		that.oRepresentationBasicDataHandler.instantiateBasicDataAsPromise()
			.then(function(){
				//assert
				var aItems = that.oRepresentationBasicDataHandler.oRepresentationView.getController().byId("idBasicDataLayout").getItems();
				assert.strictEqual(that.oRepresentationBasicDataHandler.nCounter, 2, 'then two propertyTypeHandler views are created each for dimensions and measures');
				assert.strictEqual(aItems[0].getId(), "iddimensions", "then dimension propertyTypeHandler view exists");
				assert.strictEqual(aItems[1].getId(), "idmeasures", "then measure propertyTypeHandler view exists");
				assert.strictEqual(aItems.length, 2, "then dimensions and measures propertyTypeHandler view is inserted in the parent representation view");
				assert.deepEqual(aItems[0].getViewData().aPropertiesToBeCreated, oExpectedDimensionsToBeCreated, "then Dimension row for sector color is to be created");
				assert.deepEqual(aItems[1].getViewData().aPropertiesToBeCreated, oExpectedMeasuresToBeCreated, "then Measure row sector size is to be created");
				assert.strictEqual(spyOnAttachEvent.calledTwice, true, 'then attachEvent is called twice on parent representation object');
				assert.strictEqual(spyOnAttachEvent.calledWith(modelerUiConstants.events.REMOVEALLPROPERTIESFROMPARENTOBJECT), true, 'then removeAllPropertiesFromParentObject event is attached on representation view');
				spyOnAttachEvent.restore();
				done();
			});
	});
	QUnit.module("For a Table representation", {
		beforeEach : function(assert) {
			var done = assert.async();
			_commonInitialization(this, {representationIndex: 2}, done);
		},
		afterEach : function(assert) {
			_commonCleanUpsInAfterEach(this);
		}
	});
	QUnit.test('When instantiating basic data', function(assert) {
		var done = assert.async();
		var that = this;
		//arrange
		var spyOnAttachEvent = sinon.spy(that.oRepresentationBasicDataHandler.oRepresentationView, "attachEvent");
		var oExpectedPropertiesToBeCreated = [ {
			sContext : "column",
			sProperty : "",
			bMandatory: true
		} ];
		//action
		that.oRepresentationBasicDataHandler.instantiateBasicDataAsPromise()
			.then(function(){
				//assert
				var aItems = that.oRepresentationBasicDataHandler.oRepresentationView.getController().byId("idBasicDataLayout").getItems();
				assert.strictEqual(that.oRepresentationBasicDataHandler.nCounter, 1, 'then one propertyTypeHandler view is created for property');
				assert.strictEqual(aItems[0].getId(), "idproperty", "then propertyTypeHandler view for property is exists");
				assert.strictEqual(aItems.length, 1, "then property propertyTypeHandler view is inserted in the parent representation view");
				assert.deepEqual(aItems[0].getViewData().aPropertiesToBeCreated, oExpectedPropertiesToBeCreated, "then one property row is to be created");
				assert.strictEqual(spyOnAttachEvent.calledOnce, true, 'then attachEvent is called once on parent representation object');
				assert.strictEqual(spyOnAttachEvent.calledWith(modelerUiConstants.events.REMOVEALLPROPERTIESFROMPARENTOBJECT), true, 'then removeAllPropertiesFromParentObject event is attached on representation view');
				spyOnAttachEvent.restore();
				done();
			});
	});
	QUnit.test('When destroying basic data', function(assert) {
		var done = assert.async();
		var that = this;
		var spyOnClearValidatorFields = sinon.spy(this.oRepresentationBasicDataHandler.oViewValidator, "clearFields");
		//action
		that.oRepresentationBasicDataHandler.instantiateBasicDataAsPromise()
			.then(function(){
				that.oRepresentationBasicDataHandler.destroyBasicData();
				//assert
				assert.strictEqual(that.oRepresentationBasicDataHandler.oRepresentationView.getController().byId("idBasicDataLayout").getItems().length, 0, 'then tems inside representation basic data are destroyed');
				assert.strictEqual(spyOnClearValidatorFields.called, true, "then fields are cleared from the view Validator");
				done();
			});
	});
	QUnit.module("For a Tree Table representation", {
		beforeEach : function(assert) {
			var testEnv = this;
			var done = assert.async();
			_commonInitialization(testEnv, {isHierarchicalStep: true, representationIndex: 0}, function(){
				testEnv.oRepresentationBasicDataHandler.oStepPropertyMetadataHandler.getPropertyMetadata =
					function(entityTypeMetadata, sProperty){
						return {
							// here we could set the "aggregation-role" and thus influence the filter on consumable or available properties
						};
					};
				done();
			});
		},
		afterEach : function(assert) {
			_commonCleanUpsInAfterEach(this);
		}
	});
	QUnit.test('When instantiating basic data', function(assert) {
		var done = assert.async();
		var that = this;
		//arrange
		var spyOnAttachEvent = sinon.spy(that.oRepresentationBasicDataHandler.oRepresentationView, "attachEvent");
		var oExpectedHierarchicalPropertyToBeCreated = [ {
			sContext : "hierarchicalColumn",
			sProperty : "hierarchicalproperty1",
			bMandatory: false
		} ];
		var oExpectedPropertyToBeCreated = [ {
			sContext : "column",
			sProperty : "<none>",
			bMandatory: false
		} ];
		//action
		that.oRepresentationBasicDataHandler.instantiateBasicDataAsPromise()
			.then(function(){
				//assert
				var aItems = that.oRepresentationBasicDataHandler.oRepresentationView.getController().byId("idBasicDataLayout").getItems();
				assert.strictEqual(that.oRepresentationBasicDataHandler.nCounter, 2, 'then two propertyTypeHandler view is created for property and hierarchical property');
				assert.strictEqual(aItems[0].getId(), "idhierarchicalColumn", "then propertyTypeHandler view for hierarchical property exists");
				assert.strictEqual(aItems[1].getId(), "idproperty", "then propertyTypeHandler view for property exists");
				assert.strictEqual(aItems.length, 2, "then property and hierarchical propertyTypeHandler view is inserted in the parent representation view");
				assert.deepEqual(aItems[0].getViewData().aPropertiesToBeCreated, oExpectedHierarchicalPropertyToBeCreated, "then one hierarchical property row is to be created");
				assert.deepEqual(aItems[1].getViewData().aPropertiesToBeCreated, oExpectedPropertyToBeCreated, "then one property row is to be created");
				assert.strictEqual(spyOnAttachEvent.callCount, 2, 'then attachEvent is called twice for hierarchical representation');
				spyOnAttachEvent.restore();
				done();
			});
	});
	QUnit.module("Instantiate basic data promise", {
		beforeEach : function() {
			var that = this;
			that.createdItems = [];
			this.viewStub = sinon.stub(sap.ui, "view", function(viewArguments){
				var deferred = jQuery.Deferred();
				var id;
				setTimeout(function(){
					id = viewArguments.id;
					deferred.resolve();
				},1);
				return {
					getController : function (){
						return {
							initPromise : deferred,
							handleRemoveOfProperty : function(){}
						};
					},
					getId : function(){
						return id;
					}
				};
			});
			var oRepresentationHandler = {
				getActualDimensions : function(){
					return [{
						sProperty : "dimension1",
						sContext : "xAxis"
					}];
				},
				getActualLegends : function(){
					return [{
						sProperty : "legend1",
						sContext : "legend"
					}];
				},
				getActualMeasures : function(){
					return [{
						sProperty : "measure1",
						sContext : "yAxis"
					}];
				},
				getActualProperties : function(){
					return [{
						sProperty : "property1",
						sContext : "column"
					}];
				},
				getHierarchicalProperty : function(){
					return [{
						sProperty : "hierarchyProperty1",
						sContext : "hierarchicalcolumn"
					}];
				},
				oRepresentation : {
					getRepresentationType : function(){
						return that.representationType || "ColumnChart";
					},
					getId : function(){
						return "step-42";
					}
				}
			};
			var oViewValidator = new ViewValidator();
			var oRepresentationView = {
				getController : function(){
					return {
						byId : function(){
							return {
								destroyItems : function (){},
								insertItem : function (view){
									that.createdItems.push(view);
								}
							};
						},
						createId : function(id){
							return id;
						}
					};
				},
				getViewData : function(){
					return {
						oConfigurationHandler : {
							getTextPool : function(){}
						}
					};
				},
				attachEvent : function(){}
			};
			// var consumables = [{
			// 	sProperty : "dimension1",
			// 	sContext : "xAxis"
			// }, {
			// 	sProperty : "legend1",
			// 	sContext : "legend"
			// }, {
			// 	sProperty : "measure1",
			// 	sContext : "yAxis"
			// }, {
			// 	sProperty : "property1",
			// 	sContext : "column"
			// }, {
			// 	sProperty : "hierarchyProperty1",
			// 	sContext : "hierarchicalcolumn"
			// }];
			var consumables = [
				"dimension1",
				"legend1",
				"measure1",
				"property1",
				"hierarchyProperty1"
			];
			var step = {
				getConsumablePropertiesForRepresentation: function(){
					return new Promise(function(resolve){
						resolve({
							consumable: consumables,
							available: consumables
						});
					});
				}

			};
			that.oStepPropertyMetadataHandler = createStepPropertyMetadataHandler(step);
			that.oStepPropertyMetadataHandler.getPropertyMetadata = function(entityTypeMetadata, sProperty){
				// here we could set the "aggregation-role" and thus influence the filter on consumable or available properties
				if(sProperty === "measure1") {
					return {
						"aggregation-role": "measure"
					};
				}
				if(sProperty === "dimension1" || sProperty === "legend1" || sProperty === "property1" || sProperty === "hierarchyProperty1" ) {
					return {
						"aggregation-role": "dimension"
					};
				}
			};
			// that.oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise = new Promise(function(resolve) {
			// 	resolve({});
			// });
			that.representationBasicDataHandler =
				new RepresentationBasicDataHandler(oRepresentationView, this.oStepPropertyMetadataHandler, oRepresentationHandler, oViewValidator);
			// Spies
			this.spy_prepareCommonView = sinon.spy(this.representationBasicDataHandler,"_prepareCommonView");
		},
		afterEach : function(){
			this.viewStub.restore();
			this.representationBasicDataHandler._prepareCommonView.restore();
		}
	});
	var callContract4_prepareCommonView = function(assert, that, testSpec) {
		assert.strictEqual(that.spy_prepareCommonView.getCall(testSpec.callIndex).args[1], testSpec.sPropertyType,
			"Call Contract: arg[1] is an sPropertyType");
		assert.strictEqual(that.spy_prepareCommonView.getCall(testSpec.callIndex).args[2].length, testSpec.propertyInformationLength,
			"Call Contract: arg[2] is an array of PropertyInformation");
		assert.ok(that.spy_prepareCommonView.getCall(testSpec.callIndex).args[3] instanceof propertyTypeOrchestration.PropertyTypeOrchestration,
			"Call Contract: arg[3] is a PropertyTypeOrchestration");
	};
	QUnit.test("Column Chart", function(assert) {
		var that = this;
		var done = assert.async();
		// Act
		that.representationBasicDataHandler.instantiateBasicDataAsPromise().then(function(){
			assert.strictEqual(that.spy_prepareCommonView.callCount, 3, "Call Contract: Then 3 groups created");
			callContract4_prepareCommonView(assert, that, {
				callIndex: 0,
				sPropertyType: modelerUiConstants.propertyTypes.DIMENSION,
				propertyInformationLength : 1
			});
			callContract4_prepareCommonView(assert, that, {
				callIndex: 1,
				sPropertyType: modelerUiConstants.propertyTypes.LEGEND,
				propertyInformationLength : 1
			});
			callContract4_prepareCommonView(assert, that, {
				callIndex: 2,
				sPropertyType: modelerUiConstants.propertyTypes.MEASURE,
				propertyInformationLength : 1
			});
			done();
		});
	});
	QUnit.test("Table Representation", function(assert) {
		var that = this;
		this.representationType = "TableRepresentation";
		var done = assert.async();
		this.representationBasicDataHandler.instantiateBasicDataAsPromise().then(function(){
			assert.strictEqual(that.spy_prepareCommonView.callCount, 1, "Call Contract: Then 1 groups created");
			callContract4_prepareCommonView(assert, that, {
				callIndex: 0,
				sPropertyType: modelerUiConstants.propertyTypes.PROPERTY,
				propertyInformationLength : 1
			});
			done();
		});
	});
	QUnit.test("Tree Table Representation", function(assert) {
		var that = this;
		this.representationType = "TreeTableRepresentation";
		var done = assert.async();
		this.representationBasicDataHandler.instantiateBasicDataAsPromise().then(function(){
			assert.strictEqual(that.spy_prepareCommonView.callCount, 2, "Call Contract: Then 2 groups created, one for hierarchy, one for the rest");
			callContract4_prepareCommonView(assert, that, {
				callIndex: 0,
				sPropertyType: modelerUiConstants.propertyTypes.HIERARCHIALCOLUMN,
				propertyInformationLength : 1
			});
			callContract4_prepareCommonView(assert, that, {
				callIndex: 1,
				sPropertyType: modelerUiConstants.propertyTypes.PROPERTY,
				propertyInformationLength : 1
			});
			done();
		});
	});

	// Test the integration with PropertyTypeOrchestration
	QUnit.module("Given a setup as for a ColumnChart & PropertyTypeOrchestration",{
		beforeEach : function(assert) {
			var done = assert.async();
			_commonInitialization(this, {representationIndex: 0}, done);
		},
		afterEach : function(assert) {
			_commonCleanUpsInAfterEach(this);
		}
	});

});