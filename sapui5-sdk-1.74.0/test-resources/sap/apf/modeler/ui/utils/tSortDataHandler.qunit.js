jQuery.sap.registerModulePath('sap.apf.testhelper', '../../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
sap.ui.define([
	"sap/apf/modeler/ui/utils/sortDataHandler",
	"sap/apf/modeler/ui/utils/constants"
], function(SortDataHandler, modelerUiConstants){
	'use strict';
	var oSortDataHandler, oStepPropertyMetadataHandler, oModelerInstance, oSortLayout;
	oStepPropertyMetadataHandler = {
		getDimensions : _fnReturnEmptyArray,
		getMeasures : _fnReturnEmptyArray,
		getDefaultLabel : _doNothing,
		getProperties : _fnReturnEmptyArray,
		getEntityTypeMetadataAsPromise : function() {
			return new Promise(function(resolve) {
				resolve({});
			});
		},
		getPropertyMetadata : function() {
			return {"aggregation-role" : null}; // needs to be null as getConsumableAndAvailablePropertiesAsPromise shall not filter out measures or dimensions
		}
	};
	function _fnPropertiesToBeCreated(property, context) {
		return [ {
			sProperty : property,
			sContext : context
		} ];
	}
	function _fnReturnEmptyArray() {
		return [];
	}
	function _doNothing() {
	}
	function _fnViewStub() {
		return {
			getViewData : function() {
				return {
					oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
					oCoreApi : oModelerInstance.modelerCore,
					oConfigurationHandler : oModelerInstance.configurationHandler
				};
			},
			attachEvent : _doNothing,
			getController : function() {
				return {
					createId : function(id) {
						return id;
					},
					byId : function(id) {
						return oSortLayout;
					}
				};
			}
		};
	}
	function _commonSpiesInBeforeEach(oParentObject, oStepObj, assert) {
		oSortLayout = new sap.m.VBox("idSortLayout");
		oStepPropertyMetadataHandler.oStep = oStepObj;
		oSortDataHandler = new SortDataHandler(_fnViewStub(), oParentObject, oStepPropertyMetadataHandler, oModelerInstance.modelerCore.getText);
		assert.ok(oSortDataHandler, 'then object exists');
	}
	function _commonCleanUpsInAfterEach() {
		oSortLayout.destroyItems();
		oSortLayout.destroy();
		sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		oModelerInstance.reset();
	}
	QUnit.module("Sort Data Handler for an existing step with topN", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach(oModelerInstance.unsavedStepWithoutFilterMapping, oModelerInstance.unsavedStepWithoutFilterMapping, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test('When instantiating step sort data', function(assert) {
		//arrange
		var spyOnAttachEvent = sinon.spy(oSortDataHandler.oParentView, "attachEvent");
		var oExpectedPropertiesToBeCreated = _fnPropertiesToBeCreated("property3", "true");
		//action
		oSortDataHandler.instantiateStepSortData();
		//assert
		assert.strictEqual(oSortDataHandler.oParentView.getController().byId("idSortLayout").getItems()[0].getId(), "idstepSort", "then step sort propertyTypeHandler view exists");
		assert.strictEqual(oSortDataHandler.oParentView.getController().byId("idSortLayout").getItems().length, 1, "then step sort propertyTypeHandler view is inserted in the parent step view");
		assert.deepEqual(oSortDataHandler.oParentView.getController().byId("idSortLayout").getItems()[0].getViewData().aPropertiesToBeCreated, oExpectedPropertiesToBeCreated, "then sort property row for property3 is to be created");
		assert.strictEqual(spyOnAttachEvent.calledOnce, true, 'then attachEvent is called once on step view');
		assert.strictEqual(spyOnAttachEvent.calledWith(modelerUiConstants.events.step.SETTOPNPROPERTIES), true, 'then setTopNProperties event is attached on step view');
	});
	QUnit.module("Sort Data Handler for an existing representation whose parent step does not have a topN", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach(oModelerInstance.unsavedStepWithFilterMapping.getRepresentations()[0], oModelerInstance.unsavedStepWithFilterMapping, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test('When instantiating representation sort data', function(assert) {
		//arrange
		var spyOnAttachEvent = sinon.spy(oSortDataHandler.oParentView, "attachEvent");
		var oExpectedPropertiesToBeCreated = _fnPropertiesToBeCreated("property4", "true");
		//action
		oSortDataHandler.instantiateRepresentationSortData();
		//assert
		assert.strictEqual(oSortDataHandler.oParentView.getController().byId("idSortLayout").getItems()[0].getId(), "idrepresentationSort", "then representation sort propertyTypeHandler view exists");
		assert.strictEqual(oSortDataHandler.oParentView.getController().byId("idSortLayout").getItems().length, 1, "then representation sort propertyTypeHandler view is inserted in the parent representation view");
		assert.deepEqual(oSortDataHandler.oParentView.getController().byId("idSortLayout").getItems()[0].getViewData().aPropertiesToBeCreated, oExpectedPropertiesToBeCreated, "then sort property row for property4 is to be created");
		assert.strictEqual(spyOnAttachEvent.calledOnce, true, 'then attachEvent is called once on representation view');
		assert.strictEqual(spyOnAttachEvent.calledWith(modelerUiConstants.events.step.SETTOPNPROPERTIES), true, 'then setTopNProperties event is attached on representation view');
	});
	QUnit.module("Sort Data Handler for an existing representation whose parent step has a topN", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach(oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0], oModelerInstance.unsavedStepWithoutFilterMapping, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test('When instantiating representation sort data', function(assert) {
		//arrange
		var spyOnAttachEvent = sinon.spy(oSortDataHandler.oParentView, "attachEvent");
		var oExpectedPropertiesToBeCreated = _fnPropertiesToBeCreated("property3", "true");
		//action
		oSortDataHandler.instantiateRepresentationSortData();
		//assert
		assert.strictEqual(oSortDataHandler.oParentView.getController().byId("idSortLayout").getItems()[0].getId(), "idrepresentationSort", "then representation sort propertyTypeHandler view exists");
		assert.strictEqual(oSortDataHandler.oParentView.getController().byId("idSortLayout").getItems().length, 1, "then representation sort propertyTypeHandler view is inserted in the parent representation view");
		assert.deepEqual(oSortDataHandler.oParentView.getController().byId("idSortLayout").getItems()[0].getViewData().aPropertiesToBeCreated, oExpectedPropertiesToBeCreated, "then sort property row for property3 is to be created");
		assert.strictEqual(spyOnAttachEvent.calledOnce, true, 'then attachEvent is called once on representation view');
		assert.strictEqual(spyOnAttachEvent.calledWith(modelerUiConstants.events.step.SETTOPNPROPERTIES), true, 'then setTopNProperties event is attached on representation view');
	});
	QUnit.module("Sort Data Handler for a new representation", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesInBeforeEach(oModelerInstance.unsavedStepWithFilterMapping.getRepresentations()[1], oModelerInstance.unsavedStepWithFilterMapping, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpsInAfterEach();
		}
	});
	QUnit.test('When instantiating representation sort data', function(assert) {
		//arrange
		var spyOnAttachEvent = sinon.spy(oSortDataHandler.oParentView, "attachEvent");
		var oExpectedPropertiesToBeCreated = _fnPropertiesToBeCreated("None", "true");
		//action
		oSortDataHandler.instantiateRepresentationSortData();
		//assert
		assert.strictEqual(oSortDataHandler.oParentView.getController().byId("idSortLayout").getItems()[0].getId(), "idrepresentationSort", "then representation sort propertyTypeHandler view exists");
		assert.strictEqual(oSortDataHandler.oParentView.getController().byId("idSortLayout").getItems().length, 1, "then representation sort propertyTypeHandler view is inserted in the parent representation view");
		assert.deepEqual(oSortDataHandler.oParentView.getController().byId("idSortLayout").getItems()[0].getViewData().aPropertiesToBeCreated, oExpectedPropertiesToBeCreated, "then sort property row for None property is to be created");
		assert.strictEqual(spyOnAttachEvent.calledOnce, true, 'then attachEvent is called once on representation view');
		assert.strictEqual(spyOnAttachEvent.calledWith(modelerUiConstants.events.step.SETTOPNPROPERTIES), true, 'then setTopNProperties event is attached on representation view');
	});
	QUnit.test('When destroying sort data', function(assert) {
		//action
		oSortDataHandler.destroySortData();
		//assert
		assert.strictEqual(oSortDataHandler.oParentView.getController().byId("idSortLayout").getItems().length, 0, 'then tems inside sort data layout are destroyed');
	});
});