sap.ui.define([
		"sap/apf/modeler/ui/utils/propertyTypeOrchestration",
		"sap/apf/modeler/ui/utils/constants"
	],
	function(propertyTypeOrchestrationModule, modelerConstants) {
		'use strict';

		var sortDirectionControlNameConst = 'idSortDirection';

		QUnit.module("Given _relativeComplement", {});
		QUnit.test("When calling _relativeComplement", function (assert) {
			// Arrange
			var testContractList = [
				{a: [], b: [], expectedResult: []},
				{a: [1,2,3], b: [], expectedResult: [1,2,3]},
				{a: [1,2,3], b: [3], expectedResult: [1,2]},
				{a: [1,2,3,3], b: [3], expectedResult: [1,2]},
				{a: [], b: [1], expectedResult: []}
			];
			testContractList.forEach(function (testContract) {
				// Act
				var relativeComplement = propertyTypeOrchestrationModule._relativeComplement(testContract.a, testContract.b);
				// Verify
				assert.deepEqual(relativeComplement, testContract.expectedResult, "Then [" + testContract.a + "] \\ [" + testContract.b + "] = [" + relativeComplement + "]");
			});
		});

		QUnit.module("Given an instance of class PropertyTypeOrchestration", {
			beforeEach : function() {
				this.oOrchestration = new propertyTypeOrchestrationModule.PropertyTypeOrchestration();
				this.spies = {}
			},
			afterEach : function() {
				var that = this;
				Object.keys(this.spies).forEach(function(member){
					that.spies[member].restore();
				});
			}

		});
		QUnit.test("When adding a new Property Type reference", function(assert){
			// Arrange
			var inputContract = {
				sProperty : "property1"
			};
			// Act
			this.oOrchestration.addPropertyTypeReference("hugo", inputContract);
			// Verify
			assert.strictEqual(this.oOrchestration._getPropertyTypeRows()[0].controlId, "hugo", "Then the control id is defined");
			assert.strictEqual(this.oOrchestration._getPropertyTypeRows()[0].propertyRowInformation, inputContract, "Then the input contract is contained");
		});
		QUnit.test("When removing an existing Property Type reference", function(assert){
			// Arrange
			var expectedResult = [];
			var prerequisite = {
				sProperty : "property1"
			};
			this.oOrchestration.addPropertyTypeReference("hugo", prerequisite);
			// Act
			this.oOrchestration.removePropertyTypeReference("hugo");
			// Verify
			assert.deepEqual(this.oOrchestration._getPropertyTypeRows(), expectedResult, "Then the property type row has been removed");
		});
		QUnit.test("Given no rows When calling getSelectedProperties", function (assert) {
			// Act
			var selectedProperties = this.oOrchestration.getSelectedProperties();
			// Verify
			assert.strictEqual(selectedProperties.length, 0, "Then no selected properties are returned ");
		});
		QUnit.test("Given 1 row When calling getSelectedProperties", function (assert) {
			// Arrange
			this.oOrchestration.addPropertyTypeReference("PropertyType-controllerId", {
				sProperty: "hugo"
			});
			// Act
			var selectedProperties = this.oOrchestration.getSelectedProperties();
			// Verify
			assert.strictEqual(selectedProperties.length, 1, "Then 1 selected property returned");
			assert.strictEqual(selectedProperties[0], "hugo", "And property is hugo");
		});
		QUnit.test("Given many rows When calling getSelectedProperties", function (assert) {
			// Arrange
			this.oOrchestration.addPropertyTypeReference("PropertyType-controllerId", {
				sProperty: "hugo"
			});
			this.oOrchestration.addPropertyTypeReference("PropertyType-controllerId", {
				sProperty: "anna"
			});
			// Act
			var selectedProperties = this.oOrchestration.getSelectedProperties();
			// Verify
			assert.strictEqual(selectedProperties.length, 2, "Then 1 selected property returned");
			assert.strictEqual(selectedProperties[1], "anna", "And one of the properties is anna");
		});
		QUnit.test("When swapping properties between two property type controls of kind MEASURE", function (assert) {
			var done = assert.async();
			assert.expect(2);
			// Arrange
			var aSelectedProperties = ["property1", "property2"];
			var aControlIds = ["view1", "view2"];
			var stubbedView = {
				getController: function(){
					return {
						setDetailData: function(){}
					}
				}
			};
			var aPropertyTypeRows = [
				{propertyRowInformation: {sProperty: aSelectedProperties[0]}, controlId: aControlIds[0], oView: stubbedView},
				{propertyRowInformation: {sProperty: aSelectedProperties[1]}, controlId: aControlIds[1], oView: stubbedView}
			];
			this.spies._getPropertyTypeRows = sinon.stub(this.oOrchestration, "_getPropertyTypeRows", function() {
				return aPropertyTypeRows;
			});
			this.spies.getPropertyTypeRow = sinon.stub(this.oOrchestration, "getPropertyTypeRow", function(sViewId) {
				if (sViewId === aControlIds[0]){
					return aPropertyTypeRows[0];
				} else if (sViewId === aControlIds[1]){
					return aPropertyTypeRows[1];
				}
			});
			// Act
			this.oOrchestration._swapPropertiesBetweenControls(aControlIds[0], aSelectedProperties[1]).then(function(){
				// Verify
				assert.strictEqual(aPropertyTypeRows[1].propertyRowInformation.sProperty, aSelectedProperties[0], "then the selected property of the first property type row has been reassigned as the selected property of the second property type row");
				assert.strictEqual(aPropertyTypeRows[0].propertyRowInformation.sProperty, aSelectedProperties[1], "then the selected property of the second property type row has been reassigned as the selected property of the first property type row");
				done();
			});
		});
		QUnit.test("Given some PropertyTypeRows When calling getPropertyTypeRowByPropertyName", function(assert){
			// Arrange
			var property = "hugo";
			var creationData = {
				sProperty : property
			};
			this.oOrchestration.addPropertyTypeReference("PropertyType-controllerId", creationData);
			// Act
			var result = this.oOrchestration.getPropertyTypeRowByPropertyName(property);
			// Verify
			assert.notStrictEqual(result, undefined, "Then the result is not undefined");
			assert.strictEqual(result.propertyRowInformation.sProperty, property, "Then returns the expected row");
		});
		QUnit.test("Given some PropertyTypeRows When calling getPropertyTypeRowByPropertyName", function(assert){
			// Arrange
			var property = "hugo";
			var creationData = {
				sProperty : property
			};
			this.oOrchestration.addPropertyTypeReference("PropertyType-controllerId", creationData);
			// Act
			var result = this.oOrchestration.getPropertyTypeRowByPropertyName("not-existing");
			// Verify
			assert.strictEqual(result, undefined, "Then returns undefined");
		});
		QUnit.test("Given no PropertyTypeRows When calling getPropertyTypeRowByPropertyName", function(assert){
			// Arrange
			// Act
			var result = this.oOrchestration.getPropertyTypeRowByPropertyName("not-existing");
			// Verify
			assert.strictEqual(result, undefined, "Then returns undefined");
		});
		QUnit.test("Given a PropertyTypeRow of type MEASURE When calling getAggregationRole", function(assert) {
			// Arrange
			this.oOrchestration.addPropertyTypeReference("hugo", {}, modelerConstants.propertyTypes.MEASURE, undefined);
			// Act
			var role = this.oOrchestration.getAggregationRole();
			// Verify
			assert.strictEqual(role, modelerConstants.aggregationRoles.MEASURE, "THEN the aggregation role is MEASURE");
		});
		QUnit.test("Given a PropertyTypeRow of type DIMENSION When calling getAggregationRole", function(assert) {
			// Arrange
			this.oOrchestration.addPropertyTypeReference("hugo", {}, modelerConstants.propertyTypes.DIMENSION, undefined);
			// Act
			var role = this.oOrchestration.getAggregationRole();
			// Verify
			assert.strictEqual(role, modelerConstants.aggregationRoles.DIMENSION, "THEN the aggregation role is DIMENSION");
		});

		QUnit.module("Given an instance of class PropertyTypeOrchestration with some property row added", {
			beforeEach : function() {
				this.oOrchestration = new propertyTypeOrchestrationModule.PropertyTypeOrchestration();
				this.stubbedView = {
					oViewData:{
						oRepresentationHandler: {
							oRepresentation: {
								getDimensionTextLabelKey: function(){
									return "someKey-DIMENSION";
								},
								getMeasureTextLabelKey: function(){
									return "someKey-MEASURE";
								},
								getPropertyTextLabelKey: function(){
									return "someKey-PROPERTY";
								},
								getLabelDisplayOption: function(){
									return {
										"getLabelDisplayOption-result": null
									}
								},
								getMeasureDisplayOption: function(){
									return "someDisplayOption-MEASURE";
								}
							}
						}
					},
					getController: function() {
						return {
							byId: function(id){
								if (id === 'idSortDirection') {
									return {
										getSelectedKey: function(){
											return "true";
										}
									};
								}
								return null; // wrong id
							},
							oTextReader: function() {
								return "None";
							}
						};
					}
				};
				this.myTest = function(assert, testCase){
					assert.expect(1);
					// Arrange
					var property = "hugo";
					var context = "peter";
					var propertyRowInformation = {
						sProperty: property,
						sContext: context
					};
					var expectedResult = [
						{
							sProperty: property,
							sKind: context,
							sTextLabelKey: testCase.expected.sTextLabelKey,
							sLabelDisplayOption: testCase.expected.sLabelDisplayOption,
							sMeasureDisplayOption: testCase.expected.sMeasureDisplayOption
						}
					];
					this.oOrchestration.addPropertyTypeReference("PropertyType-controllerId", propertyRowInformation, testCase.in.propertyType, this.stubbedView);
					// Act
					var result = this.oOrchestration.getPropertyInformationList();
					// Verify
					assert.deepEqual(result, expectedResult, "Then returns the expected result");

				};
				this.spies = {}
			},
			afterEach : function() {
				var that = this;
				Object.keys(this.spies).forEach(function(member){
					that.spies[member].restore();
				});
			}

		});
		QUnit.test("Given 0 rows, when calling getPropertyInformationList ", function(assert) {
			// Act
			var result = this.oOrchestration.getPropertyInformationList();
			// Verify
			assert.strictEqual(result.length, 0, "Then result is empty");

		});
		QUnit.test("Given 1 row, when calling getPropertyInformationList ", function(assert) {
			// Arrange
			var propertyRowInformation = {
				sProperty: "hugo",
				sContext: "some-context"
			};
			this.oOrchestration.addPropertyTypeReference("PropertyType-controllerId", propertyRowInformation, "any", this.stubbedView);
			// Act
			var result = this.oOrchestration.getPropertyInformationList();
			// Verify
			assert.strictEqual(result.length, 1, "Then returns array with 1 element");
			assert.strictEqual(result[0].sKind, propertyRowInformation.sContext, "Then sKind is set");
			assert.strictEqual(result[0].sProperty, propertyRowInformation.sProperty, "Then sProperty is set");
		});
		QUnit.test("Given 1 'None' row, when calling getPropertyInformationList ", function(assert) {
			// Arrange
			var propertyRowInformation = {
				sProperty: "None",
				sContext: "some-context"
			};
			this.oOrchestration.addPropertyTypeReference("PropertyType-controllerId", propertyRowInformation, "any", this.stubbedView);
			// Act
			var result = this.oOrchestration.getPropertyInformationList();
			// Verify
			assert.strictEqual(result.length, 0, "Then does not return the 'None' row");
		});
		QUnit.test("Given 2 'None' rows, when calling getPropertyInformationList ", function(assert) {
			// Arrange
			var propertyRowInformation = {
				sProperty: "None"
			};
			this.oOrchestration.addPropertyTypeReference("id-1", propertyRowInformation, 42, this.stubbedView);
			this.oOrchestration.addPropertyTypeReference("id-2", propertyRowInformation, 43, this.stubbedView);
			this.oOrchestration.addPropertyTypeReference("id-3", { sProperty: "Otto" }, 44,  this.stubbedView);
			// Act
			var result = this.oOrchestration.getPropertyInformationList();
			// Verify
			assert.strictEqual(result.length, 1, "Then does not return the 'None' row");
		});
		QUnit.test("When calling getPropertyInformationList for type MEASURE", function(assert) {
			this.myTest(assert, {
				in: {
					propertyType: modelerConstants.propertyTypes.MEASURE
				},
				expected : {
					sTextLabelKey: this.stubbedView.oViewData.oRepresentationHandler.oRepresentation.getMeasureTextLabelKey(),
					sLabelDisplayOption: this.stubbedView.oViewData.oRepresentationHandler.oRepresentation.getLabelDisplayOption(),
					sMeasureDisplayOption: this.stubbedView.oViewData.oRepresentationHandler.oRepresentation.getMeasureDisplayOption()
				}
			});
		});
		QUnit.test("When calling getPropertyInformationList for type MEASURE and a row with a 'None' selection", function(assert) {
			// Arrange
			this.oOrchestration.addPropertyTypeReference("PropertyType-controllerId2", {sProperty: "None", sContext: "otto"}, modelerConstants.propertyTypes.MEASURE, this.stubbedView);
			// Though the orchestration object holds 2 rows, the row with "none" is expected to be filtered out before the result list of length 1 is compiled from the remaining row.
			// Act & Verify
			this.myTest(assert, {
				in: {
					propertyType: modelerConstants.propertyTypes.MEASURE
				},
				expected : {
					sTextLabelKey: this.stubbedView.oViewData.oRepresentationHandler.oRepresentation.getMeasureTextLabelKey(),
					sLabelDisplayOption: this.stubbedView.oViewData.oRepresentationHandler.oRepresentation.getLabelDisplayOption(),
					sMeasureDisplayOption: this.stubbedView.oViewData.oRepresentationHandler.oRepresentation.getMeasureDisplayOption()
				}
			});
		});
		QUnit.test("When calling getPropertyInformationList for type DIMENSION", function(assert) {
			this.myTest(assert, {
				in: {
					propertyType: modelerConstants.propertyTypes.DIMENSION
				},
				expected : {
					sTextLabelKey: this.stubbedView.oViewData.oRepresentationHandler.oRepresentation.getDimensionTextLabelKey(),
					sLabelDisplayOption: this.stubbedView.oViewData.oRepresentationHandler.oRepresentation.getLabelDisplayOption(),
					sMeasureDisplayOption: this.stubbedView.oViewData.oRepresentationHandler.oRepresentation.getMeasureDisplayOption()
				}
			});
		});
		QUnit.test("When calling getPropertyInformationList for type LEGEND", function(assert) {
			this.myTest(assert, {
				in: {
					propertyType: modelerConstants.propertyTypes.LEGEND
				},
				expected : {
					sTextLabelKey: this.stubbedView.oViewData.oRepresentationHandler.oRepresentation.getDimensionTextLabelKey(),
					sLabelDisplayOption: this.stubbedView.oViewData.oRepresentationHandler.oRepresentation.getLabelDisplayOption(),
					sMeasureDisplayOption: this.stubbedView.oViewData.oRepresentationHandler.oRepresentation.getMeasureDisplayOption()
				}
			});
		});
		QUnit.test("When calling getPropertyInformationList for type PROPERTY", function(assert) {
			this.myTest(assert, {
				in: {
					propertyType: modelerConstants.propertyTypes.PROPERTY
				},
				expected : {
					sTextLabelKey: this.stubbedView.oViewData.oRepresentationHandler.oRepresentation.getPropertyTextLabelKey(),
					sLabelDisplayOption: this.stubbedView.oViewData.oRepresentationHandler.oRepresentation.getLabelDisplayOption(),
					sMeasureDisplayOption: this.stubbedView.oViewData.oRepresentationHandler.oRepresentation.getMeasureDisplayOption()
				}
			});
		});
		QUnit.test("Given 1 row, when calling getPropertyInformationList for modelerConstants.propertyTypes.DIMENSION", function(assert) {
			// Arrange
			var propertyRowInformation = {
				sProperty: "hugo",
				sContext: "some-context"
			};
			this.oOrchestration.addPropertyTypeReference("PropertyType-controllerId",
				propertyRowInformation,
				modelerConstants.propertyTypes.DIMENSION,
				this.stubbedView);
			// Act
			var result = this.oOrchestration.getPropertyInformationList();
			// Verify
			assert.notStrictEqual(result[0].sTextLabelKey, null, "Then sTextLabelKey is not null");
		});

		QUnit.test("Given 1 row, when calling getPropertyInformationList for any other type", function(assert) {
			// Arrange
			var propertyRowInformation = {
				sProperty: "hugo",
				sContext: "some-context"
			};
			this.oOrchestration.addPropertyTypeReference("PropertyType-controllerId", propertyRowInformation, "any", this.stubbedView);
			// Act
			var result = this.oOrchestration.getPropertyInformationList();
			// Verify
			assert.strictEqual(result[0].sTextLabelKey, null, "Then sTextLabelKey is null");
		});

		QUnit.test("Given 0 rows, when calling getSortPropertyInformationList ", function(assert) {
			// Act
			var result = this.oOrchestration.getSortPropertyInformationList(sortDirectionControlNameConst);
			// Verify
			assert.strictEqual(result.length, 0, "Then result is empty");

		});
		QUnit.test("Given 1 row, when calling getSortPropertyInformationList ", function(assert) {
			// Arrange
			var propertyRowInformation = {
				sProperty: "anna"
			};
			var outboundContract = {
				property: propertyRowInformation.sProperty,
				ascending: true
			};
			this.oOrchestration.addPropertyTypeReference("PropertyType-controllerId", propertyRowInformation, "any", this.stubbedView);
			// Act
			var result = this.oOrchestration.getSortPropertyInformationList(sortDirectionControlNameConst);
			// Verify
			assert.strictEqual(result.length, 1, "Then returns array with 1 element");
			assert.strictEqual(result[0].property, propertyRowInformation.sProperty, "Then sProperty is set");
			assert.strictEqual(result[0].ascending, true, "Then direction aka 'ascending' is set true");
			assert.deepEqual(result[0], outboundContract, "Then the result schema is as expected");
		});
		QUnit.test("Given 1 'None' row, when calling getSortPropertyInformationList ", function(assert) {
			// Arrange
			var propertyRowInformation = {
				sProperty: "None"
			};
			this.oOrchestration.addPropertyTypeReference("PropertyType-controllerId", propertyRowInformation, "any", this.stubbedView);
			// Act
			var result = this.oOrchestration.getSortPropertyInformationList(sortDirectionControlNameConst);
			// Verify
			assert.strictEqual(result.length, 0, "Then does not return the 'None' row");
		});
		QUnit.test("Given 2 'None' rows, when calling getSortPropertyInformationList ", function(assert) {
			// Arrange
			var propertyRowInformation = {
				sProperty: "None"
			};
			this.oOrchestration.addPropertyTypeReference("id-1", propertyRowInformation, 42, this.stubbedView);
			this.oOrchestration.addPropertyTypeReference("id-2", propertyRowInformation, 43, this.stubbedView);
			this.oOrchestration.addPropertyTypeReference("id-3", { sProperty: "Otto" }, 44,  this.stubbedView);
			// Act
			var result = this.oOrchestration.getSortPropertyInformationList(sortDirectionControlNameConst);
			// Verify
			assert.strictEqual(result.length, 1, "Then does not return the 'None' row");
			assert.strictEqual(result[0].property, "Otto", "Then sProperty is set");
		});

		QUnit.module("Given the module PropertyTypeOrchestration", {
		});
		QUnit.test("_mapPropertyType2AggregationRole", function(assert){
			var result = propertyTypeOrchestrationModule._mapPropertyType2AggregationRole(modelerConstants.propertyTypes.MEASURE);
			assert.strictEqual(result, modelerConstants.aggregationRoles.MEASURE, "map a propertyType MEASURE to aggregationRole MEASURE" );

			var result2 = propertyTypeOrchestrationModule._mapPropertyType2AggregationRole(modelerConstants.propertyTypes.DIMENSION);
			assert.strictEqual(result2, modelerConstants.aggregationRoles.DIMENSION, "map a propertyType DIMENSION to aggregationRole DIMENSION" );

			var result3 = propertyTypeOrchestrationModule._mapPropertyType2AggregationRole(modelerConstants.propertyTypes.LEGEND);
			assert.strictEqual(result3, modelerConstants.aggregationRoles.DIMENSION, "map a propertyType LEGEND to aggregationRole DIMENSION" );

			var result4 = propertyTypeOrchestrationModule._mapPropertyType2AggregationRole(undefined);
			assert.strictEqual(result4, null, "map undefined to null" );
		});
		QUnit.module("Given the module PropertyTypeOrchestration", {
			beforeEach: function() {
				var that = this;
				that.oController = {
					removeAllItemsFromDropDownList: function(){},
					setItemsOfDropDownList: function(){}
				};
				that.stubbedPropertyTypeOrchestration = {
					getSelectedProperties : function () {
						return;
					}
				};
				that.oStep = {
					getType: function(){ return "";}
				};
				that.oView = {
					getController: function(){
						return that.oController; // return a stubbed PropertyType
					},
					getViewData: function(){ // input contract on the viewData
						return {
							oStepPropertyMetadataHandler: {
								debugId: "oStepPropertyMetadataHandler",
								oStep: that.oStep
							},
							oParentObject: {
								getId: function(){
									return "hugo-ReprId-byParentObj";
								}
							},
							oPropertyOrchestration: that.stubbedPropertyTypeOrchestration
						};
					}
				};
				that.propertyRowInformation = {
					sProperty: "hugo",
					bMandatory: false,
					sContext: undefined // xAxis, yAxis, legend, ...
				};
				that.oPropertyTypeRow = {
					controlId : "any",
					propertyRowInformation : that.propertyRowInformation,
					sPropertyType : "schnickSchnack",
					oView : that.oView
				};
				that.reference2Consumable = [{}];
				that.reference2Available = [{}];
				that.reference2ReturnFrom_getSelectedProperties = [{}];
				that.reference2ReturnFrom_relativeComplement = [{}];
				that.returnedAggregationRole = "stubbedAggregationRole";
				this.spies = {
					removeAllItemsFromDropDownList: sinon.spy(that.oController, "removeAllItemsFromDropDownList"),
					setItemsOfDropDownList: sinon.spy(that.oController, "setItemsOfDropDownList"),
					_mapPropertyType2AggregationRole: sinon.stub(propertyTypeOrchestrationModule, "_mapPropertyType2AggregationRole",
						function(){
							return that.returnedAggregationRole;
						}),
					getConsumableAndAvailablePropertiesAsPromise: sinon.stub(propertyTypeOrchestrationModule, "getConsumableAndAvailablePropertiesAsPromise",
						function() {
							return new Promise(function(resolve) {
								resolve({
									consumable: that.reference2Consumable,
									available: that.reference2Available
								});
							});
						}
					),
					getSelectedProperties : sinon.stub(that.stubbedPropertyTypeOrchestration, "getSelectedProperties", function () {
						return that.reference2ReturnFrom_getSelectedProperties;
					}),
					_relativeComplement : sinon.stub(propertyTypeOrchestrationModule, "_relativeComplement", function () {
						return that.reference2ReturnFrom_relativeComplement;
					})
				};
			},
			afterEach: function() {
				var that = this;
				Object.keys(this.spies).forEach(function(member){
					that.spies[member].restore();
				});
			}
		});
		QUnit.test("_updateDropDownOfAControl", function(assert){
			var done = assert.async();
			var that = this;
			// Act
			propertyTypeOrchestrationModule._updateDropDownOfAControl(that.oPropertyTypeRow).then(function(){
				// Verify
				assert.strictEqual(that.spies._mapPropertyType2AggregationRole.callCount, 1, "Then _mapPropertyType2AggregationRole is called");
				assert.strictEqual(that.spies._mapPropertyType2AggregationRole.getCall(0).args[0], that.oPropertyTypeRow.sPropertyType, "Then oPropertyTypeRow.sPropertyType is passed");
				assert.strictEqual(that.spies.removeAllItemsFromDropDownList.callCount, 1, "Then removeAllItemsFromDropDownList is called");
				assert.strictEqual(that.spies.getSelectedProperties.callCount, 1, "Then getSelectedProperties is called");
				assert.strictEqual(that.spies._relativeComplement.callCount, 1, "Then _relativeComplement is called");
				assert.strictEqual(that.spies._relativeComplement.getCall(0).args[0], that.reference2Available, "Then _relativeComplement is called with the result of getConsumableAndAvailablePropertiesAsPromise");
				assert.strictEqual(that.spies._relativeComplement.getCall(0).args[1], that.reference2ReturnFrom_getSelectedProperties, "Then _relativeComplement is called with the result of getSelectedProperties");
				assert.strictEqual(that.spies._relativeComplement.getCall(0).args.length, 2, "Then _relativeComplement is called with two parameters");

				assert.strictEqual(that.spies.setItemsOfDropDownList.callCount, 1, "Then setItemsOfDropDownList is called");
				assert.strictEqual(that.spies.setItemsOfDropDownList.getCall(0).args.length, 5, "Then the number of provided arguments is as expected");
				assert.strictEqual(that.spies.setItemsOfDropDownList.getCall(0).args[0], that.reference2ReturnFrom_relativeComplement, "Then the consumable properties' result of _relativeComplement is passed here");
				assert.strictEqual(that.spies.setItemsOfDropDownList.getCall(0).args[1], that.reference2Available, "Then the available properties' result of getConsumableAndAvailablePropertiesAsPromise is passed here");
				assert.strictEqual(that.spies.setItemsOfDropDownList.getCall(0).args[2], that.oPropertyTypeRow.propertyRowInformation.sProperty, "Then the selected property is passed");
				assert.strictEqual(that.spies.setItemsOfDropDownList.getCall(0).args[3], that.oPropertyTypeRow.propertyRowInformation.bMandatory, "Then the property mandatory information is passed");
				assert.strictEqual(that.spies.setItemsOfDropDownList.getCall(0).args[4], that.returnedAggregationRole, "Then the correct aggregation role is passed");
				assert.strictEqual(that.spies.getConsumableAndAvailablePropertiesAsPromise.callCount, 1, "Then getConsumableAndAvailablePropertiesAsPromise is called once");
				assert.strictEqual(that.spies.getConsumableAndAvailablePropertiesAsPromise.getCall(0).args[0], "hugo-ReprId-byParentObj", "Then the representationId of the representation in the RepresentationHandler is passed");
				assert.strictEqual(that.spies.getConsumableAndAvailablePropertiesAsPromise.getCall(0).args[1], "stubbedAggregationRole", "Then the aggregation role resulting from mapPropertyType2AggregationRole is passed");
				assert.strictEqual(that.spies.getConsumableAndAvailablePropertiesAsPromise.getCall(0).args[2].debugId, that.oView.getViewData().oStepPropertyMetadataHandler.debugId, "Then the oStepPropertyMetadataHandler of the oView is passed");
				assert.strictEqual(that.spies.getConsumableAndAvailablePropertiesAsPromise.getCall(0).args.length, 3, "Then the number of provided arguments is as expected");
				done();
			});
		});
		QUnit.test("_updateDropDownOfAControl in case of sorting + hierarchical step", function(assert){
			var done = assert.async();
			var that = this;
			// arrange
			that.spies.getType = sinon.stub(that.oStep, "getType");
			that.spies.getType.returns("hierarchicalStep"); // this is a constant (but not in any constants file)
			that.oPropertyTypeRow.sPropertyType = modelerConstants.propertyTypes.REPRESENTATIONSORT;

			var expectedAggregationRole = modelerConstants.aggregationRoles.MEASURE;

			// act
			propertyTypeOrchestrationModule._updateDropDownOfAControl(that.oPropertyTypeRow).then(function() {
				// verify
				assert.strictEqual(that.spies.getConsumableAndAvailablePropertiesAsPromise.getCall(0).args[1], expectedAggregationRole, "Then the aggregation role is MEASURE, and the result from _mapPropertyType2AggregationRole is ignored");
				done();
			});
		});
		QUnit.test("_isPropertyAlreadySelected", function (assert) {
			var testContract = [
				{list:[], value: "1", expected: false},
				{list:["1"], value: "1", expected: true},
				{list:["1","2","3"], value: "1", expected: true},
				{list:["1","2","3"], value: "4", expected: false}
			];
			testContract.forEach(function (contract) {
				// Act
				var result = propertyTypeOrchestrationModule._isPropertyAlreadySelected(contract.list, contract.value);
				// Verify
				assert.strictEqual(result, contract.expected, "Then [" + contract.list + "] contains (" + contract.value + ") = " + contract.expected);
			});
		});

		QUnit.module("Given getConsumableAndAvailablePropertiesAsPromise & all properties have some fixed aggregation-role", {
			beforeEach: function(){
				var that = this;
				this.internalContract = {
					internalContract: "internal contract"
				};
				var oController = {
					getPropertyMetadata: function(_unused, sProperty) {
						var metadataMap = {
							"D_1": modelerConstants.aggregationRoles.DIMENSION,
							"D_2": modelerConstants.aggregationRoles.DIMENSION,
							"M_1": modelerConstants.aggregationRoles.MEASURE,
							"M_2": modelerConstants.aggregationRoles.MEASURE,
							"U_1": null, // neutral, no filtering
							"U_2": null
						};
						return {
							"aggregation-role": metadataMap[sProperty]
						}; // return the aggregation role indexed by property name.
					},
					getEntityTypeMetadataAsPromise: function() {
						var promise = new Promise(function(resolve) {
							resolve(that.internalContract);
						});
						return promise;
					},
					oStep: {
						debugName: "peter"
					}
				};
				this.createStepPropertyMetadataHandler = function(stubbedConsumableAndAvailableProperties){
					oController.oStep.getConsumablePropertiesForRepresentation = function() {
						var promise = new Promise(function(resolve) {
							resolve({
								consumable: stubbedConsumableAndAvailableProperties.consumable,
								available: stubbedConsumableAndAvailableProperties.available
							});
						});
						return promise;
					};
					return oController;
				};
			}
		});

		function execTestSpec(assert, context, testCase){
			// Arrange
			var done = assert.async();
			var stubbedConsumableAndAvailableProperties = testCase.inputContract.consumableAndAvailableProperties;
			var oStepPropertyMetadataHandler = context.createStepPropertyMetadataHandler(stubbedConsumableAndAvailableProperties);
			var representationId = "any"; // neutral for the test case combination

				// Act
			propertyTypeOrchestrationModule.getConsumableAndAvailablePropertiesAsPromise(representationId,
				testCase.inputContract.desiredAggregationType, oStepPropertyMetadataHandler).then(
					function(result){
						// Verify
						assert.deepEqual(result, testCase.outputContract.result,
							"Then the result contains all properties matching the given aggregation-role: " + testCase.inputContract.desiredAggregationType);
						done();
					});
		}
		QUnit.test("When calling getConsumableAndAvailablePropertiesAsPromise .. check calls (function composition) on which this call depends", function(assert) {
			var context = this;
			assert.expect(7);
			// Arrange
			var done = assert.async();
			var stubbedConsumableAndAvailableProperties = {  // neutral for this test, but array must be non-empty
				consumable: ["hugo"],
				available: ["otto"]
			};
			var oStepPropertyMetadataHandler = context.createStepPropertyMetadataHandler(stubbedConsumableAndAvailableProperties);
			var representationId = "any";
			var desiredAggregationType = null;
			var spies = {
				getEntityTypeMetadataAsPromise: sinon.spy(oStepPropertyMetadataHandler, "getEntityTypeMetadataAsPromise"),
				getPropertyMetadata: sinon.spy(oStepPropertyMetadataHandler, "getPropertyMetadata"),
				getConsumablePropertiesForRepresentation: sinon.spy(oStepPropertyMetadataHandler.oStep, "getConsumablePropertiesForRepresentation")
			};
			// Act
			propertyTypeOrchestrationModule.getConsumableAndAvailablePropertiesAsPromise( representationId, desiredAggregationType, oStepPropertyMetadataHandler).then(
				function(result){
					// Verify
					assert.strictEqual(spies.getConsumablePropertiesForRepresentation.callCount, 1, "getConsumablePropertiesForRepresentation is called once");
					assert.strictEqual(spies.getConsumablePropertiesForRepresentation.getCall(0).args[0], representationId, "representationId is being passed");
					assert.strictEqual(spies.getEntityTypeMetadataAsPromise.callCount, 1, "getEntityTypeMetadataAsPromise is called once");
					assert.strictEqual(spies.getPropertyMetadata.callCount, 2,"getPropertyMetadata is called once");
					assert.strictEqual(spies.getPropertyMetadata.getCall(0).args[0], context.internalContract,
							"the result of getEntityTypeMetadataAsPromise shall be referentially equal to the parameter of getPropertyMetadata");
					assert.strictEqual(spies.getPropertyMetadata.getCall(0).args[1], stubbedConsumableAndAvailableProperties.consumable[0],
						"one property of the stubbed consumable properties is passed as parameter to getPropertyMetadata");
					assert.strictEqual(spies.getPropertyMetadata.getCall(1).args[1], stubbedConsumableAndAvailableProperties.available[0],
						"one property of the stubbed available properties is passed as parameter to getPropertyMetadata");
					done();
				});
		});
		QUnit.test("When calling with [] x []", function(assert) {
			execTestSpec(assert, this,{
				inputContract: {
					desiredAggregationType: modelerConstants.aggregationRoles.DIMENSION,
					consumableAndAvailableProperties: {
						consumable: [],
						available: []
					}
				},
				outputContract: {
					result: {
						consumable: [],
						available: []
					}
				}
			});
		});
		QUnit.test("When calling with [] x [] & aggregationRole is MEASURE", function(assert) {
			execTestSpec(assert, this,{
				inputContract: {
					desiredAggregationType: modelerConstants.aggregationRoles.MEASURE,
					consumableAndAvailableProperties: {
						consumable: [],
						available: []
					}
				},
				outputContract: {
					result: {
						consumable: [],
						available: []
					}
				}
			});
		});
		QUnit.test("When calling with [] x [] & aggregationRole is undefined", function(assert) {
			execTestSpec(assert, this,{
				inputContract: {
					desiredAggregationType: undefined,
					consumableAndAvailableProperties: {
						consumable: [],
						available: []
					}
				},
				outputContract: {
					result: {
						consumable: [],
						available: []
					}
				}
			});
		});
		QUnit.test("When calling with [...] x [] & aggregationRole is DIMENSION", function(assert) {
			execTestSpec(assert, this,{
				inputContract: {
					desiredAggregationType: modelerConstants.aggregationRoles.DIMENSION,
					consumableAndAvailableProperties: {
						consumable: ["D_1", "M_2", "U_1"],
						available: []
					}
				},
				outputContract: {
					result: {
						consumable: ["D_1"],
						available: []
					}
				}
			});
		});
		QUnit.test("When calling with [...] x [] & aggregationRole is MEASURE", function(assert) {
			execTestSpec(assert, this,{
				inputContract: {
					desiredAggregationType: modelerConstants.aggregationRoles.MEASURE,
					consumableAndAvailableProperties: {
						consumable: ["D_1", "M_2", "U_1"],
						available: []
					}
				},
				outputContract: {
					result: {
						consumable: ["M_2"],
						available: []
					}
				}
			});
		});
		QUnit.test("Sorting: When calling with [...] x [] & aggregationRole is null ", function(assert) {
			execTestSpec(assert, this,{
				inputContract: {
					desiredAggregationType: null,
					consumableAndAvailableProperties: {
						consumable: ["D_1", "M_2", "U_1"],
						available: []
					}
				},
				outputContract: {
					result: {
						consumable: ["D_1", "M_2", "U_1"],
						available: []
					}
				}
			});
		});
		QUnit.test("When calling with [] x [...] & aggregationRole is DIMENSION", function(assert) {
			execTestSpec(assert, this,{
				inputContract: {
					desiredAggregationType: modelerConstants.aggregationRoles.DIMENSION,
					consumableAndAvailableProperties: {
						consumable: [],
						available: ["D_1", "M_2", "U_1"]
					}
				},
				outputContract: {
					result: {
						consumable: [],
						available: ["D_1"]
					}
				}
			});
		});
		QUnit.test("When calling with [] x [...] & aggregationRole is MEASURE", function(assert) {
			execTestSpec(assert, this,{
				inputContract: {
					desiredAggregationType: modelerConstants.aggregationRoles.MEASURE,
					consumableAndAvailableProperties: {
						consumable: [],
						available: ["D_1", "M_2", "U_1"]
					}
				},
				outputContract: {
					result: {
						consumable: [],
						available: ["M_2"]
					}
				}
			});
		});
		QUnit.test("Sorting: When calling with [] x [...] & aggregationRole is null", function(assert) {
			execTestSpec(assert, this,{
				inputContract: {
					desiredAggregationType: null,
					consumableAndAvailableProperties: {
						consumable: [],
						available: ["D_1", "M_2", "U_1"]
					}
				},
				outputContract: {
					result: {
						consumable: [],
						available: ["D_1", "M_2", "U_1"]
					}
				}
			});
		});

		QUnit.module("Given getPropertyListAndSelectedKeyAsPromise & consumable properties with some fixed aggregation-role", {
			beforeEach: function() {
				var that = this;
				this.allProperties = ["P_hugo", "P_otto", "M_1"];
				this.prefix = "not there: ";
				this.addPrefixText = function(aTexts, oTextReader){
					return [ that.prefix + aTexts[0]]
				};
				this.oController = {
					oTextReader: function(key){
						return {
							"none": "none"
						}[key];
					}
				};
			}
		});
		QUnit.test("When calling getPropertyListAndSelectedKey", function(assert){
			var that = this;
			// note the function side effects the array. Which is unproblematic as long as array is locally created.
			function setMandatory(boolV){
				var clone = jQuery.extend({}, that.oController, {
					oView: {
						oViewData: {
							oPropertyTypeData: {
								bMandatory: boolV
							}
						}
					}
				});
				return clone;
			}
			function doAllTests(assert, context, testSpec){
				testSpec.forEach(function(testCase) {
					// Act
					var result = propertyTypeOrchestrationModule.getPropertyListAndSelectedKey(
						testCase.inputContract.aProperties,
						testCase.inputContract.sSelectedKey,
						testCase.inputContract.controller,
						testCase.inputContract.aAvailable,
						that.addPrefixText);
					// Verify
					assert.deepEqual(result.aAllProperties, testCase.outputContract.expected.aAllProperties,
						"Then aAllProperties === " + testCase.outputContract.expected.aAllProperties.toString());
					assert.strictEqual(result.sSelectedKey, testCase.outputContract.expected.sSelectedKey,
						"Then sSelectedKey === " + testCase.outputContract.expected.sSelectedKey);
				});
			}
			doAllTests(assert, that, [
				{
					inputContract: {
						sSelectedKey: "P_hugo",
						aProperties: ["P_hugo", "M_1"],
						aAvailable : {
							available: ["P_hugo", "M_1"]
						},
						controller: setMandatory(true)
					},
					outputContract: {
						expected: {
							aAllProperties : ["P_hugo", "M_1"],
							sSelectedKey : "P_hugo"
						}
					}
				},{
					inputContract: {
						sSelectedKey: "Otto",
						aProperties: ["Otto", "M_1"],
						aAvailable : {
							available: ["Otto", "M_1"]
						},
						controller: setMandatory(false)
					},
					outputContract: {
						expected: {
							aAllProperties : ["none", "Otto", "M_1"],
							sSelectedKey : "Otto"
						}
					}
				},{
					inputContract: {
						sSelectedKey: "anna",
						aProperties: ["Otto", "M_1"],
						aAvailable : {
							available: ["Otto", "M_1"]
						},
						controller: setMandatory(true)
					},
					outputContract: {
						expected: {
							aAllProperties : ["Otto", "M_1", that.prefix + "anna"],
							sSelectedKey : that.prefix + "anna"
						}
					}
				},{
					inputContract: {
						sSelectedKey: "hanna",
						aProperties: ["Otto", "M_1"],
						aAvailable : {
							available: ["Otto", "hanna", "M_1"]
						},
						controller: setMandatory(true)
					},
					outputContract: {
						expected: {
							aAllProperties : ["Otto", "M_1", "hanna"],
							sSelectedKey : "hanna"
						}
					}
				},{
					inputContract: {
						sSelectedKey: "hanna",
						aProperties: ["Otto", "M_1"],
						aAvailable : {
							available: ["Otto", "hanna", "M_1"]
						},
						controller: setMandatory(false)
					},
					outputContract: {
						expected: {
							aAllProperties : ["none", "Otto", "M_1", "hanna"],
							sSelectedKey : "hanna"
						}
					}
				}
			]);
		});

		QUnit.module("Given an instance of class PropertyTypeOrchestration", {
			beforeEach : function() {
				this.oOrchestration = new propertyTypeOrchestrationModule.PropertyTypeOrchestration();
				this.sViewId = "id1";
				this.sPropertyName = "hugo";
				this.oPropertyRow = {
					oView : { isEmpty: true },
					controlId : this.sViewId,
					propertyRowInformation : {
						sProperty : this.sPropertyName
					},
					sPropertyType : "any"
				};
				this.oOrchestration.addPropertyTypeReference(this.oPropertyRow.controlId, this.oPropertyRow.propertyRowInformation, this.oPropertyRow.sPropertyType, this.oPropertyRow.oView);
				this.spies = {
					_updateDropDownOfAControl : sinon.stub(propertyTypeOrchestrationModule, "_updateDropDownOfAControl", function() {
					})
				}
			},
			afterEach : function() {
				var that = this;
				Object.keys(that.spies).forEach(function(member){
					that.spies[member].restore();
				});
			}
		});
		QUnit.test("When calling updateAllSelectControlsForPropertyType for a single propertyRow", function(assert){
			//Act
			this.oOrchestration.updateAllSelectControlsForPropertyType("id1", "nin");
			//Verify
			assert.strictEqual(this.oOrchestration.getPropertyTypeRow("id1").propertyRowInformation.sProperty, "nin", "then the selected key is updated");
			assert.strictEqual(this.spies._updateDropDownOfAControl.callCount, 1, "Then _updateDropDownOfAControl is called as many times as there are registered property rows");
			assert.deepEqual(this.spies._updateDropDownOfAControl.getCall(0).args[0], this.oPropertyRow, "then the oPropertyRow is passed");
			assert.strictEqual(this.spies._updateDropDownOfAControl.getCall(0).args[0].propertyRowInformation.sProperty, "nin", "then the oPropertyRow updated selected key has been passed");
		});
		QUnit.test("When calling updateAllSelectControlsForPropertyType for a 2 propertyRows", function(assert) {
			// Arrange
			this.oOrchestration.addPropertyTypeReference("id2",{sProperty:"anna"},"any",this.oPropertyRow.oView);
			// Act
			this.oOrchestration.updateAllSelectControlsForPropertyType("id1", "nin");
			// Verify
			assert.strictEqual(this.spies._updateDropDownOfAControl.callCount, this.oOrchestration._getPropertyTypeRows().length,
				"Then _updateDropDownOfAControl is called as many times as there are registered property rows");
			assert.ok(this.spies._updateDropDownOfAControl.getCall(0).args[0].propertyRowInformation.sProperty === "nin"
				|| this.spies._updateDropDownOfAControl.getCall(1).args[0].propertyRowInformation.sProperty === "nin"
				, "then the updated oPropertyRow is processed");
		});
		QUnit.test("When calling updateAllDropDownsAsPromise with 1 row", function(assert) {
			var that = this;
			var done = assert.async();
			assert.expect(1);
			// Act
			this.oOrchestration.updateAllDropDownsAsPromise().then(function(){
				assert.strictEqual(that.spies._updateDropDownOfAControl.callCount, that.oOrchestration._getPropertyTypeRows().length,
					"Then _updateDropDownOfAControl is called as many times as there are registered property rows");
				done();
			});
		});
		QUnit.test("When updating a row", function(assert) {
			var that = this;
			// Arrange
			var sChangedPropertyName = "otto";
			// Act
			this.oOrchestration.updatePropertyTypeRow(this.sViewId, sChangedPropertyName);
			// Verify
			assert.strictEqual(that.oOrchestration._getPropertyTypeRows().length, 1, "Then there is still only 1 row");
			assert.strictEqual(that.oOrchestration.getPropertyTypeRow(this.sViewId).propertyRowInformation.sProperty,
				sChangedPropertyName, "Then the property name of the row has been updated");
			assert.strictEqual(that.oOrchestration.getPropertyTypeRow(this.sViewId),
				that.oOrchestration.getPropertyTypeRowByPropertyName(sChangedPropertyName), "Then the row can also be accessed by its changed name");
			assert.strictEqual(that.oOrchestration.getPropertyTypeRowByPropertyName(this.sPropertyName), undefined, sChangedPropertyName,
				"Then there is no row accessible with the old name");
		});
	});