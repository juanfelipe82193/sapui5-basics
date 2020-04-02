/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */

jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper");
jQuery.sap.require("sap.apf.utils.utils");

sap.ui.define([
	"sap/apf/ui/utils/representationTypesHandler",
	"sap/apf/core/representationTypes",
	"sap/apf/modeler/ui/utils/propertyTypeOrchestration",
	"sap/apf/modeler/ui/utils/constants"
], function(RepresentationTypesHandler, RepresentationTypes, propertyTypeOrchestrationModule, uiModelerConstants){
	'use strict';
	var oModelerInstance, oPropTypeHandlerView;
	function _instantiateView(sId, assert, context) {
		var oPropTypeHandlerController = new sap.ui.controller("sap.apf.modeler.ui.controller.propertyTypeHandler");
		context.oStepPropertyMetadataTypeHandlerStub = {
			getDimensionsProperties : function() {
				return [ "property1", "property2", "property3" ];
			},
			getDefaultLabel : function(entityTypeMetadata, oText) {
				return oText;
			},
			hasTextPropertyOfDimension : function(entityTypeMetadata, sProperty) {
				var bHasTextProperty;
				if (sProperty === "property1") {
					bHasTextProperty = true;
				} else {
					bHasTextProperty = false;
				}
				return bHasTextProperty;
			},
			oStep : oModelerInstance.unsavedStepWithoutFilterMapping,
			getEntityTypeMetadataAsPromise : function() {
				return sap.apf.utils.createPromise({});
			}
		};
		var oRepresentationTypeHandlerStub = {
			getLabelsForChartType : function() {
				return "Dimension for Horizontal Axis / Display";
			},
			isAdditionToBeEnabled : function() {
				return true;
			}
		};
		context.representationId = "Step-1-Representation-1";
		var oRepresentationHandlerStub = {
			oRepresentation : {
				getId : function (){
					return context.representationId;
				}
			},
			getActualDimensions : function() {
				return [ {
					sContext : "xAxis",
					sProperty : "property2"
				} ];
			}
		};
		var oPropertyTypeStateStub = {
			getPropertyValueState : function() {
				return [ "property1" ];
			},
			indexOfPropertyTypeViewId : function() {
				return 0;
			}
		};
		context.aValidatorFields = [];
		var oViewValidator = {
			addField : function(id){
				context.aValidatorFields.push(id);
			}
		};
		var oViewDataForPropertyTypeStub = {
			oConfigurationHandler : oModelerInstance.configurationHandler,
			oParentObject : sId,
			oStepPropertyMetadataHandler : context.oStepPropertyMetadataTypeHandlerStub,
			oRepresentationTypeHandler : oRepresentationTypeHandlerStub,
			oCoreApi : oModelerInstance.modelerCore,
			oRepresentationHandler : oRepresentationHandlerStub,
			oPropertyTypeState : oPropertyTypeStateStub,
			sPropertyType : sap.apf.modeler.ui.utils.CONSTANTS.propertyTypes.DIMENSION,
			oBasicDataLayout : new sap.m.VBox(),
			oViewValidator : oViewValidator
		};
		context.oPropertyTypeOrchestration = new propertyTypeOrchestrationModule.PropertyTypeOrchestration();
		context.spy.addPropertyTypeReference = sinon.spy(context.oPropertyTypeOrchestration, "addPropertyTypeReference");
		context.spy.updateAllSelectControlsForPropertyType = sinon.spy(context.oPropertyTypeOrchestration, "updateAllSelectControlsForPropertyType");
		oPropTypeHandlerView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.propertyTypeHandler",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oPropTypeHandlerController,
			viewData : {
				debugName: "sap.apf.modeler.ui.view.propertyTypeHandler",
				oViewDataForPropertyType : oViewDataForPropertyTypeStub,
				aPropertiesToBeCreated : [ {
					sContext : "xAxis",
					sProperty : "property1",
					bMandatory : true
				}, {
					sContext : "xAxis",
					sProperty : "property2",
					bMandatory : false
				} ],
				oPropertyOrchestration: context.oPropertyTypeOrchestration
			}
		});
		oPropTypeHandlerView.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
		return oPropTypeHandlerView;
	}
	function _createEvent(sId, sProperty) {
		return {
			getSource : function() {
				return sId;
			},
			getParameter : function(sKind) {
				var sValue;
				if (sKind === "sProperty") {
					sValue = sProperty;
				} else {
					sValue = "xAxis";
				}
				return sValue;
			}
		};
	}
	function _commonCleanUpsInAfterEach() {
		oModelerInstance.reset();
		sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		oPropTypeHandlerView.destroy();
	}
	QUnit.module("For a Representation property type handler", {
		beforeEach: function (assert) {
			var context = this;
			var done = assert.async();
			this.spy = {}; // this is necessary!
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function (modelerInstance) {
				oModelerInstance = modelerInstance;
				oPropTypeHandlerView = _instantiateView(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], assert, context);
				done();
			});
		},
		afterEach: function () {
			_commonCleanUpsInAfterEach();
			if (this.spy.getPropertyTypeRow) {
				this.spy.getPropertyTypeRow.restore();
			}
			if (this.spy.updateAllSelectControlsForPropertyType) {
				this.spy.updateAllSelectControlsForPropertyType.restore();
			}
			if (this.spy.addPropertyTypeReference) {
				this.spy.addPropertyTypeReference.restore();
			}
			if (this.spy.removePropertyTypeReference) {
				this.spy.removePropertyTypeReference.restore();
			}
			if (this.spy.getConsumableAndAvailablePropertiesAsPromise){
				this.spy.getConsumableAndAvailablePropertiesAsPromise.restore();
			}
		}
	});
	QUnit.test("When Property type handler view is initialized", function(assert) {
		//asserts
		assert.expect(8);
		assert.ok(oPropTypeHandlerView, "then property view is available");
		assert.ok(oPropTypeHandlerView.byId("idPropertyTypeVBox"), "then value for property type handler vbox is available");
		assert.strictEqual(oPropTypeHandlerView.getController().nCounter, 2, 'then two propertyTypeHandler views are created for dimensions');
		assert.strictEqual(oPropTypeHandlerView.getController().byId("idPropertyTypeVBox").getItems().length, 2, "then 2 dimensions vbox of propertyTypeHandler view is created");
		assert.strictEqual(this.spy.updateAllSelectControlsForPropertyType.callCount, 1, "then updateAllSelectControlsForPropertyType() has been called once for a propertyTypeHandler instance");
		//assertions for events attached to controls
		assert.deepEqual(this.aValidatorFields, [oPropTypeHandlerView.getId() + "--iddimensionsView0--idPropertyType"], "then the mandatory field is added to the view validator");
		assert.strictEqual(oPropTypeHandlerView.getController().byId("idPropertyTypeVBox").getItems()[0].getController().getView().byId("idPropertyTypeLabel").getRequired(), true, "then the mandatory field label is set as required");
		assert.strictEqual(oPropTypeHandlerView.getController().byId("idPropertyTypeVBox").getItems()[1].getController().getView().byId("idPropertyTypeLabel").getRequired(), false, "then the non-mandatory field label is not set as required");
	});
	QUnit.test("When add icon is pressed", function(assert) {
		//arrange
		var that = this;
		var oEvt = _createEvent(oPropTypeHandlerView.byId(oPropTypeHandlerView.getController().oPropertyTypeState.aPropertyTypeViewIds[0]), "property1");
		var id = "__xmlview1--iddimensionsView0";
		var id2 = "__xmlview1--iddimensionsView1";
		var idView2 = "__xmlview2--iddimensionsView0";
		var id2View2 = "__xmlview2--iddimensionsView1";
		oEvt.getParameter = function(){
			return {
				getId : function(){
					return id;
				}
			};
		};
		this.spy.getPropertyTypeRow = sinon.stub(this.oPropertyTypeOrchestration, 'getPropertyTypeRow', function () {
			return {
				controlId: 'idPropertyType-1',
				propertyRowInformation: {
					sProperty: 'property1',
					sContext: 'xAxis',
					bMandatory: false
				},
				sPropertyType: uiModelerConstants.propertyTypes.DIMENSION,
				oView: {
					oViewData : {}
				}
			};
		});
		this.spy.getConsumableAndAvailablePropertiesAsPromise = sinon.stub(propertyTypeOrchestrationModule, "getConsumableAndAvailablePropertiesAsPromise", function () {
			that.resolveGetConsumables = jQuery.Deferred();
			return that.resolveGetConsumables;
		});
		this.spy._relativeComplement = sinon.spy(propertyTypeOrchestrationModule, "_relativeComplement");
		var selectedPropertiesReference = [];
		this.spy.getSelectedProperties = sinon.stub(this.oPropertyTypeOrchestration, "getSelectedProperties", function() {
			return selectedPropertiesReference;
		});
		//act
		oPropTypeHandlerView.getController().handlePressOfAdd(oEvt);
		this.spy.updateAllSelectControlsForPropertyType.reset(); // reset the callCount, as updateAllSelectControlsForPropertyType is called once for every Property type handler view when it is initialized (which is not in the scope of this test)
		assert.strictEqual(this.spy.updateAllSelectControlsForPropertyType.callCount, 0, "Then updateAllSelectControlsForPropertyType was not already called (promise not yet resolved)");
		var consumablePropertiesReference = [];
		this.resolveGetConsumables.resolve({consumable: consumablePropertiesReference, available: consumablePropertiesReference});
		//assert
		assert.expect(16);
		assert.strictEqual(this.spy.updateAllSelectControlsForPropertyType.callCount, 1, "Then updateAllSelectControlsForPropertyType was called once");
		assert.strictEqual(this.spy.getConsumableAndAvailablePropertiesAsPromise.callCount, 3, "Then getConsumableAndAvailablePropertiesAsPromise is called three times (1x from handlePressOfAdd, 2x from _updateDropDownOfAControl)");
		assert.ok(contains([this.representationId, "Step-6-Representation-1"], this.spy.getConsumableAndAvailablePropertiesAsPromise.getCall(0).args[0]), "Then getConsumableAndAvailablePropertiesAsPromise was called with expected parameters"); // async -> necessary to avoid togglers (order is unknown)
		assert.ok(contains([this.representationId, "Step-6-Representation-1"], this.spy.getConsumableAndAvailablePropertiesAsPromise.getCall(1).args[0]), "Then getConsumableAndAvailablePropertiesAsPromise was called with expected parameters"); // async -> necessary to avoid togglers (order is unknown)
		assert.ok(contains([this.representationId, "Step-6-Representation-1"], this.spy.getConsumableAndAvailablePropertiesAsPromise.getCall(2).args[0]), "Then getConsumableAndAvailablePropertiesAsPromise was called with expected parameters"); // async -> necessary to avoid togglers (order is unknown)

		assert.strictEqual(this.spy.getConsumableAndAvailablePropertiesAsPromise.getCall(0).args[1], uiModelerConstants.aggregationRoles.DIMENSION, "Then getConsumableAndAvailablePropertiesAsPromise was called with expected parameters");
		assert.strictEqual(this.spy.getConsumableAndAvailablePropertiesAsPromise.getCall(0).args[2], this.oStepPropertyMetadataTypeHandlerStub, "Then getConsumableAndAvailablePropertiesAsPromise was called with expected parameters");
		assert.strictEqual(this.spy._relativeComplement.callCount, 1, "Then _relativeComplement is called once (to determine the correct default property)");
		assert.strictEqual(this.spy._relativeComplement.getCall(0).args[0], consumablePropertiesReference, "Then _relativeComplement is called with consumablePropertiesReference");
		assert.strictEqual(this.spy._relativeComplement.getCall(0).args[1], selectedPropertiesReference, "Then _relativeComplement is called with selectedPropertiesReference");

		assert.strictEqual(this.spy.addPropertyTypeReference.callCount, 2, "Then addPropertyTypeReference was called twice (2 views)");
		assert.ok(contains([id, idView2], this.spy.addPropertyTypeReference.getCall(0).args[0]), "Then addPropertyTypeReference was called with expected parameters"); // async -> necessary to avoid togglers (order is unknown)
		assert.ok(contains([id2, id2View2], this.spy.addPropertyTypeReference.getCall(1).args[0]), "Then addPropertyTypeReference was called with expected parameters"); // async -> necessary to avoid togglers (order is unknown)
		assert.strictEqual(oPropTypeHandlerView.getController().byId("idPropertyTypeVBox").getItems().length, 2, "then 2 dimensions vbox of propertyTypeHandler view is created");
		assert.strictEqual(oPropTypeHandlerView.getController().nCounter, 2, 'then two propertyTypeHandler views are created for dimensions');
		function contains(list, item){
			return list.indexOf(item) !== -1;
		}
	});
	QUnit.test("When remove icon is pressed", function(assert) {
		//arrange
		this.spy.updateAllSelectControlsForPropertyType.reset(); // reset the callCount, as updateAllSelectControlsForPropertyType is called once for every Property type handler view when it is initialized (which is not in the scope of this test)
		this.spy.removePropertyTypeReference = sinon.spy(this.oPropertyTypeOrchestration, "removePropertyTypeReference");
		this.spy.getConsumableAndAvailablePropertiesAsPromise = sinon.stub(propertyTypeOrchestrationModule, "getConsumableAndAvailablePropertiesAsPromise", function () {
			var deferred = jQuery.Deferred();
			deferred.resolve({consumable: [], available: []});
			return deferred;
		});
		var viewId = oPropTypeHandlerView.getController().oPropertyTypeState.aPropertyTypeViewIds[1];
		var oEvt = _createEvent(oPropTypeHandlerView.byId(viewId), "property2");
		oPropTypeHandlerView.getController().handlePressOfRemove(oEvt);
		//assert
		assert.expect(1);
		assert.strictEqual(oPropTypeHandlerView.getController().byId("idPropertyTypeVBox").getItems().length, 1, "then 2nd dimensions vbox of propertyTypeHandler view is removed");
	});
	QUnit.test("When property value state is updated", function(assert) {
		//arrange
		var spyOnIndexOfItem = sinon.spy(oPropTypeHandlerView.byId("idPropertyTypeVBox"), "indexOfItem");
		var spyOnUpdatePropertyAt = sinon.spy(oPropTypeHandlerView.getController().oPropertyTypeState, "updatePropertyAt");
		var oEvt = _createEvent(oPropTypeHandlerView.byId(oPropTypeHandlerView.getController().oPropertyTypeState.aPropertyTypeViewIds[0]), "property2");
		//action
		oPropTypeHandlerView.getController().updatePropertyValueState(oEvt);
		//assert
		assert.expect(4);
		assert.strictEqual(spyOnIndexOfItem.callCount, 1, "then index of item is updated");
		assert.strictEqual(spyOnIndexOfItem.calledWith(oPropTypeHandlerView.byId(oPropTypeHandlerView.getController().oPropertyTypeState.aPropertyTypeViewIds[0])), true, "then index of items are updated with current index value of control");
		assert.strictEqual(spyOnUpdatePropertyAt.callCount, 1, "then property is updated for current dimension property");
		assert.strictEqual(spyOnUpdatePropertyAt.calledWith("property2", 0), true, "then property is updated with current value");
	});
	QUnit.test("When property is removed", function(assert) {
		//arrange
		var spyFireEvent = sinon.spy(oPropTypeHandlerView.byId("idPropertyTypeVBox").getItems()[0], "fireEvent");
		//action
		oPropTypeHandlerView.getController().handleRemoveOfProperty();
		//assert
		assert.expect(1);
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.REMOVEPROPERTYFROMPARENTOBJECT), true, "then REMOVEPROPERTYFROMPARENTOBJECT event is fired");
	});
	QUnit.module("Initialization Promise", {
		beforeEach : function() {
			var context = this;
			context.spy = {};
			context.oPropertyTypeOrchestration = new propertyTypeOrchestrationModule.PropertyTypeOrchestration();
			context.spy.addPropertyTypeReference = sinon.stub(context.oPropertyTypeOrchestration, "addPropertyTypeReference", function() {});
			context.spy.updateAllSelectControlsForPropertyType = sinon.stub(context.oPropertyTypeOrchestration, "updateAllSelectControlsForPropertyType", function() {});
			context.stepType = "";
			this.oPropTypeHandlerView = new sap.ui.view({
				viewName : "sap.apf.modeler.ui.view.propertyTypeHandler",
				type : sap.ui.core.mvc.ViewType.XML,
				viewData : {
					oViewDataForPropertyType : {
						sPropertyType  : "dimensions",
						oCoreApi: {
							getText : function(textKey){
								return textKey;
							}
						},
						oViewValidator : {
							addField : function(){}
						},
						oStepPropertyMetadataHandler : {
							oStep : {
								getConsumablePropertiesForRepresentation : function(){
									var deferred = jQuery.Deferred();
									setTimeout(function(){
										deferred.resolve({
											available : ["property1", "property2", "property3"],
											consumable : ["property3"]
										});
									}, 1);
									return deferred;
								},
								getType : function() {
									return context.stepType;
								}
							},
							getEntityTypeMetadataAsPromise : function (){
								return jQuery.Deferred().resolve({});
							},
							getPropertyMetadata : function(){
								return {};
							}
						},
						oParentObject : {
							getId : function(){
								return "id";
							},
							getLabelDisplayOption  : function(){
								return "key";
							},
							getDimensionTextLabelKey : function() {
								return "textLabelKey";
							},
							getRepresentationType : function(){
								return "ColumnChart";
							}
						},
						oConfigurationHandler : {
							getTextPool : function(){
								return {
									get : function(textKey){
										return {
											TextElementDescription : textKey
										};
									}
								};
							}
						},
						oRepresentationTypeHandler : new RepresentationTypesHandler(new RepresentationTypes())
					},
					aPropertiesToBeCreated : [ {
						sContext : "xAxis",
						sProperty : "property1",
						bMandatory : true
					}, {
						sContext : "xAxis",
						sProperty : "property2",
						bMandatory : false
					} ],
					oPropertyOrchestration : context.oPropertyTypeOrchestration
				}
			});
		}
	});
	QUnit.test("Dimensions are filled after initialization", function(assert) {
		var done = assert.async();
		assert.expect(4);
		var oController = this.oPropTypeHandlerView.getController();
		var propertyTypeContainer = this.oPropTypeHandlerView.byId("idPropertyTypeVBox");
		oController.initPromise.then(function(){
			assert.ok(true, "InitializationPromise is resolved");
			assert.strictEqual(propertyTypeContainer.getItems().length, 2, "Then 2 propertyType views are created");
			assert.strictEqual(propertyTypeContainer.getItems()[0].byId("idPropertyType").getSelectedKey(), "property1", "Then the first selected key is set");
			assert.strictEqual(propertyTypeContainer.getItems()[1].byId("idPropertyType").getSelectedKey(), "property2", "Then the second selected key is set");
			done();
		});
	});
	QUnit.test("When add icon is pressed in case of sorting in hierarchical step", function(assert) {
		//arrange
		var that = this;
		var id = "__xmlview1--iddimensionsView0";
		var oEvt = {};
		oEvt.getParameter = function(){
			return {
				getId : function(){
					return id;
				}
			};
		};
		that.stepType = "hierarchicalStep";
		this.spy.getPropertyTypeRow = sinon.stub(this.oPropertyTypeOrchestration, 'getPropertyTypeRow', function () {
			return {
				controlId: 'idPropertyType-1',
				propertyRowInformation: {
					sProperty: 'property1',
					sContext: 'xAxis',
					bMandatory: false
				},
				sPropertyType: uiModelerConstants.propertyTypes.REPRESENTATIONSORT,
				oView: {
					oViewData : that.oViewData,
					getViewData : function() {
						return that.oViewData;
					}
				}
			};
		});
		this.spy.getConsumableAndAvailablePropertiesAsPromise = sinon.stub(propertyTypeOrchestrationModule, "getConsumableAndAvailablePropertiesAsPromise", function () {
			that.resolveGetConsumables = jQuery.Deferred();
			return that.resolveGetConsumables;
		});
		var selectedPropertiesReference = [];
		this.spy.getSelectedProperties = sinon.stub(this.oPropertyTypeOrchestration, "getSelectedProperties", function() {
			return selectedPropertiesReference;
		});
		//act
		this.oPropTypeHandlerView.getController().handlePressOfAdd(oEvt);
		var consumablePropertiesReference = [];
		this.resolveGetConsumables.resolve({consumable: consumablePropertiesReference, available: consumablePropertiesReference});
		// verify
		assert.expect(1);
		assert.strictEqual(this.spy.getConsumableAndAvailablePropertiesAsPromise.getCall(0).args[1], uiModelerConstants.aggregationRoles.MEASURE, "Then the aggregation role is MEASURE, and the result from _mapPropertyType2AggregationRole is ignored");
	});
});