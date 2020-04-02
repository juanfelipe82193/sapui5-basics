/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	'sap/apf/modeler/ui/utils/propertyTypeState',
	'sap/m/VBox'
], function(PropertyTypeState, sapmVBox) {
	'use strict';
	var oPropertyTypeState, oView, oView1;
	QUnit.module("Property type state", {
		beforeEach : function(assert) {
			oPropertyTypeState = new PropertyTypeState();
			oPropertyTypeState.addProperty("test1");
			oPropertyTypeState.addProperty("test2");
			oPropertyTypeState.addProperty("test3");
			oPropertyTypeState.addProperty("test4");
			assert.deepEqual(oPropertyTypeState.getPropertyValueState(), [ "test1", "test2", "test3", "test4" ], 'then property type state has 4 values');
			oPropertyTypeState.addPropertyTypeViewId("viewId1");
			oPropertyTypeState.addPropertyTypeViewId("viewId2");
			oPropertyTypeState.addPropertyTypeViewId("viewId3");
			oPropertyTypeState.addPropertyTypeViewId("viewId4");
		}
	});
	QUnit.test('When initialization', function(assert) {
		assert.ok(oPropertyTypeState, 'then object exists');
	});
	QUnit.test('When adding a valid Property', function(assert) {
		//arrange
		var aExpectedProperties = [ "test1", "test2", "test3", "test4", "test2" ];
		//action
		oPropertyTypeState.addProperty("test2");
		//assert
		assert.deepEqual(oPropertyTypeState.getPropertyValueState(), aExpectedProperties, 'then new property was added');
	});
	QUnit.test('When adding a Property which is undefined', function(assert) {
		//arrange
		var aExpectedProperties = [ "test1", "test2", "test3", "test4" ];
		//action
		oPropertyTypeState.addProperty(undefined);
		//assert
		assert.deepEqual(oPropertyTypeState.getPropertyValueState(), aExpectedProperties, 'then undefined was not added');
	});
	QUnit.test('When adding a Property which is null', function(assert) {
		//arrange
		var aExpectedProperties = [ "test1", "test2", "test3", "test4" ];
		//action
		oPropertyTypeState.addProperty(null);
		//assert
		assert.deepEqual(oPropertyTypeState.getPropertyValueState(), aExpectedProperties, 'then null was not added');
	});
	QUnit.test('When adding Property At', function(assert) {
		//arrange
		var aExpectedProperties = [ "test1", "test2", "test5", "test3", "test4" ];
		//action
		oPropertyTypeState.addPropertyAt("test5", 2);
		//assert
		assert.deepEqual(oPropertyTypeState.getPropertyValueState(), aExpectedProperties, 'then new property was added at the expected index');
	});
	QUnit.test('Adding Property when no arguments are passed', function(assert) {
		//arrange
		var aExpectedProperties = [ "test1", "test2", "test3", "test4" ];
		//action
		oPropertyTypeState.addPropertyAt("");
		//assert
		assert.deepEqual(oPropertyTypeState.getPropertyValueState(), aExpectedProperties, 'then new property was not added as no arguments are passed');
	});
	QUnit.test('When adding Property At wrong index', function(assert) {
		//arrange
		var aExpectedProperties = [ "test1", "test2", "test3", "test4" ];
		//action
		oPropertyTypeState.addPropertyAt("test5", 6);
		//assert
		assert.deepEqual(oPropertyTypeState.getPropertyValueState(), aExpectedProperties, 'then new property was not added as the index was wrong');
	});
	QUnit.test('When updating Property At', function(assert) {
		//arrange
		var aExpectedProperties = [ "test6", "test2", "test3", "test4" ];
		//action
		oPropertyTypeState.updatePropertyAt("test6", 0);
		//assert
		assert.deepEqual(oPropertyTypeState.getPropertyValueState(), aExpectedProperties, 'then property value was updated at the expected index');
	});
	QUnit.test('When updating Property when no arguments are passed', function(assert) {
		//arrange
		var aExpectedProperties = [ "test1", "test2", "test3", "test4" ];
		//action
		oPropertyTypeState.updatePropertyAt("");
		//assert
		assert.deepEqual(oPropertyTypeState.getPropertyValueState(), aExpectedProperties, 'then property value was not updated as arguments was not passed');
	});
	QUnit.test('When updating Property At wrong index', function(assert) {
		//arrange
		var aExpectedProperties = [ "test1", "test2", "test3", "test4" ];
		//action
		oPropertyTypeState.updatePropertyAt("test6", 6);
		//assert
		assert.deepEqual(oPropertyTypeState.getPropertyValueState(), aExpectedProperties, 'then property value was not updated as the index was wrong');
	});
	QUnit.test('When updating Property At wrong index', function(assert) {
		//arrange
		var aExpectedProperties = [ "test1", "test2", "test3", "test4" ];
		//action
		oPropertyTypeState.updatePropertyAt("test6", -1);
		//assert
		assert.deepEqual(oPropertyTypeState.getPropertyValueState(), aExpectedProperties, 'then property value was not updated as the index was wrong');
	});
	QUnit.test('When removing Property At', function(assert) {
		//arrange
		var aExpectedProperties = [ "test1", "test2", "test4" ];
		//action
		oPropertyTypeState.removePropertyAt(2);
		//assert
		assert.deepEqual(oPropertyTypeState.getPropertyValueState(), aExpectedProperties, 'then property value was removed at the expected index');
	});
	QUnit.test('When removing Property At wrong index', function(assert) {
		//arrange
		var aExpectedProperties = [ "test1", "test2", "test3", "test4" ];
		//action
		oPropertyTypeState.removePropertyAt(9);
		//assert
		assert.deepEqual(oPropertyTypeState.getPropertyValueState(), aExpectedProperties, 'then property value was not removed as the index was wrong');
	});
	QUnit.test('When removing All Properties', function(assert) {
		//arrange
		var aExpectedProperties = [];
		//action
		oPropertyTypeState.removeAllProperties();
		//assert
		assert.deepEqual(oPropertyTypeState.getPropertyValueState(), aExpectedProperties, 'then all properties were removed');
	});
	QUnit.test('When checking if the property is present exactly once for a property that does not repeat', function(assert) {
		//assert
		assert.strictEqual(oPropertyTypeState.isPropertyPresentExactlyOnce("test1"), true, 'then true is returned');
	});
	QUnit.test('When checking if the property is present exactly once for a property which repeats ', function(assert) {
		//arrange 
		var aExpectedProperties = [ "test1", "test2", "test3", "test4", "test1" ];
		//action
		oPropertyTypeState.addPropertyAt("test1", 4);
		//assert
		assert.deepEqual(oPropertyTypeState.getPropertyValueState(), aExpectedProperties, 'then a repeating property is added at the requested index');
		assert.strictEqual(oPropertyTypeState.isPropertyPresentExactlyOnce("test1"), false, 'then false is returned');
	});
	QUnit.test('When adding a valid viewId', function(assert) {
		//arrange
		var aExpectedProperties = [ "viewId1", "viewId2", "viewId3", "viewId4", "viewId5" ];
		//action
		oPropertyTypeState.addPropertyTypeViewId("viewId5");
		//assert
		assert.deepEqual(oPropertyTypeState.aPropertyTypeViewIds, aExpectedProperties, 'then new viewId was added');
	});
	QUnit.test('When adding a viewId which is undefined', function(assert) {
		//arrange
		var aExpectedProperties = [ "viewId1", "viewId2", "viewId3", "viewId4" ];
		//action
		oPropertyTypeState.addPropertyTypeViewId(undefined);
		//assert
		assert.deepEqual(oPropertyTypeState.aPropertyTypeViewIds, aExpectedProperties, 'then undefined was not added');
	});
	QUnit.test('When adding a viewId which is null', function(assert) {
		//arrange
		var aExpectedProperties = [ "viewId1", "viewId2", "viewId3", "viewId4" ];
		//action
		oPropertyTypeState.addPropertyTypeViewId(null);
		//assert
		assert.deepEqual(oPropertyTypeState.aPropertyTypeViewIds, aExpectedProperties, 'then null was not added');
	});
	QUnit.test('When adding viewId At', function(assert) {
		//arrange
		var aExpectedProperties = [ "viewId1", "viewId2", "test5", "viewId3", "viewId4" ];
		//action
		oPropertyTypeState.addPropertyTypeViewIdAt("test5", 2);
		//assert
		assert.deepEqual(oPropertyTypeState.aPropertyTypeViewIds, aExpectedProperties, 'then new viewId was added at the expected index');
	});
	QUnit.test('Adding viewId when no arguments are passed', function(assert) {
		//arrange
		var aExpectedProperties = [ "viewId1", "viewId2", "viewId3", "viewId4" ];
		//action
		oPropertyTypeState.addPropertyTypeViewIdAt("");
		//assert
		assert.deepEqual(oPropertyTypeState.aPropertyTypeViewIds, aExpectedProperties, 'then new viewId was not added as no arguments are passed');
	});
	QUnit.test('When adding viewId At wrong index', function(assert) {
		//arrange
		var aExpectedProperties = [ "viewId1", "viewId2", "viewId3", "viewId4" ];
		//action
		oPropertyTypeState.addPropertyTypeViewIdAt("test5", 6);
		//assert
		assert.deepEqual(oPropertyTypeState.aPropertyTypeViewIds, aExpectedProperties, 'then new viewId was not added as the index was wrong');
	});
	QUnit.test('When removing viewId At', function(assert) {
		//arrange
		var aExpectedProperties = [ "viewId1", "viewId2", "viewId4" ];
		//action
		oPropertyTypeState.removePropertyTypeViewIdAt(2);
		//assert
		assert.deepEqual(oPropertyTypeState.aPropertyTypeViewIds, aExpectedProperties, 'then viewId value was removed at the expected index');
	});
	QUnit.test('When removing viewId At wrong index', function(assert) {
		//arrange
		var aExpectedProperties = [ "viewId1", "viewId2", "viewId3", "viewId4" ];
		//action
		oPropertyTypeState.removePropertyTypeViewIdAt(9);
		//assert
		assert.deepEqual(oPropertyTypeState.aPropertyTypeViewIds, aExpectedProperties, 'then viewId value was not removed as the index was wrong');
	});
	QUnit.test('When removing All viewId', function(assert) {
		//arrange
		var aExpectedProperties = [];
		//action
		oPropertyTypeState.removeAllPropertyTypeViewIds();
		//assert
		assert.deepEqual(oPropertyTypeState.aPropertyTypeViewIds, aExpectedProperties, 'then all viewId were removed');
	});
	QUnit.test('When checking the index of the viewId', function(assert) {
		//arrange
		var nExpectedIndex = 0;
		//action
		var nActualIndex = oPropertyTypeState.indexOfPropertyTypeViewId("viewId1");
		//assert
		assert.strictEqual(nActualIndex, nExpectedIndex, 'then index of the viewId is returned ');
	});
	QUnit.test('When checking the index of the viewId which does not exist', function(assert) {
		//arrange
		var nExpectedIndex = -1;
		//action
		var nActualIndex = oPropertyTypeState.indexOfPropertyTypeViewId("viewId6");
		//assert
		assert.strictEqual(nActualIndex, nExpectedIndex, 'then index of the viewId is returned as -1');
	});
	QUnit.test('When checking the index of the viewId which is undefined', function(assert) {
		//arrange
		var nExpectedIndex = -1;
		//action
		var nActualIndex = oPropertyTypeState.indexOfPropertyTypeViewId(undefined);
		//assert
		assert.strictEqual(nActualIndex, nExpectedIndex, 'then index of the viewId is returned as -1');
	});
	QUnit.module("Getting view", {
		beforeEach : function(assert) {
			oPropertyTypeState = new PropertyTypeState();
			oView = new sap.m.VBox("viewId7");
			oPropertyTypeState.addPropertyTypeViewId("viewId7", 0);
			oView1 = new sap.m.VBox("viewId8");
			oPropertyTypeState.addPropertyTypeViewId("viewId8", 1);
		},
		afterEach : function() {
			oView.destroy();
			oView1.destroy();
		}
	});
	QUnit.test('When getting a view at valid index', function(assert) {
		//arrange
		var oExpectedView = oView1;
		//action
		var oActualView = oPropertyTypeState.getViewAt(1);
		//assert
		assert.strictEqual(oActualView, oExpectedView, 'then correct view is returned');
	});
	QUnit.test('When getting a view with invalid index(null,undefined or blank)', function(assert) {
		//action
		var oActualView = oPropertyTypeState.getViewAt(null);
		//assert
		assert.strictEqual(oActualView, undefined, 'then view is not returned');
		//action
		var oActualView = oPropertyTypeState.getViewAt(undefined);
		//assert
		assert.strictEqual(oActualView, undefined, 'then view is not returned');
		//action
		var oActualView = oPropertyTypeState.getViewAt("");
		//assert
		assert.strictEqual(oActualView, undefined, 'then view is not returned');
	});
});
