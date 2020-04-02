/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery sinon */
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.modeler.core.navigationTarget");
jQuery.sap.require("sap.apf.modeler.core.configurationObjects");
jQuery.sap.require("sap.apf.modeler.core.elementContainer");
(function() {
	'use strict';
	QUnit.module("M Navigation Target", {
		beforeEach : function() {
			this.id = "NavigationTargetId";
			this.semanticObject = "SemanticObject01";
			this.action = "Action01";
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
			this.inject = {
				instances : {
					messageHandler : this.messageHandler
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable,
					ElementContainer : sap.apf.modeler.core.ElementContainer
				}
			};
			this.navigationTarget = new sap.apf.modeler.core.NavigationTarget(this.id, this.inject);
			this.filterMappingService = "filterMappingService";
			this.filterMappingEntitySet = "filterMappingEntitySet";
			this.filterMappingTargetProperty1 = "filterMappingTargetProperty1";
			this.filterMappingTargetProperty2 = "filterMappingTargetProperty2";
		}
	});
	QUnit.test("navigationTarget instantiation", function(assert) {
		assert.ok(this.navigationTarget instanceof sap.apf.modeler.core.NavigationTarget, "WHEN instantiate THEN an instance of the right type is returned");
		var result = this.navigationTarget.getId();
		assert.equal(result, this.id, "WHEN getId THEN the right id is returned");
	});
	QUnit.test("navigationTarget set/get for attributes", function(assert) {
		var result;
		this.navigationTarget.setSemanticObject(this.semanticObject);
		result = this.navigationTarget.getSemanticObject();
		assert.equal(result, this.semanticObject, "WHEN set/getSemanticObject THEN the right value is returned");
		this.navigationTarget.setAction(this.action);
		result = this.navigationTarget.getAction();
		assert.equal(result, this.action, "WHEN set/getAction THEN the right value is returned");
		assert.notOk(this.navigationTarget.getUseDynamicParameters(), "THEN this flag is not set by default");
		this.navigationTarget.setUseDynamicParameters(true);
		assert.ok(this.navigationTarget.getUseDynamicParameters(), "THEN this flag is now set");
		this.navigationTarget.setUseDynamicParameters(false);
		assert.notOk(this.navigationTarget.getUseDynamicParameters(), "THEN this flag is now no more set");
	});
	QUnit.test("Filter Mapping - Setter, Getter and Remove", function(assert) {
		this.navigationTarget.setFilterMappingService(this.filterMappingService);
		this.navigationTarget.setFilterMappingEntitySet(this.filterMappingEntitySet);
		this.navigationTarget.addFilterMappingTargetProperty(this.filterMappingTargetProperty1);
		this.navigationTarget.addFilterMappingTargetProperty(this.filterMappingTargetProperty2);
		assert.equal(this.navigationTarget.getFilterMappingService(), this.filterMappingService, "Method getFilterMappingService() returns correct service");
		assert.equal(this.navigationTarget.getFilterMappingEntitySet(), this.filterMappingEntitySet, "Method getFilterMappingEntitySet() returns correct entity set");
		assert.deepEqual(this.navigationTarget.getFilterMappingTargetProperties(), [ this.filterMappingTargetProperty1, this.filterMappingTargetProperty2 ], "Method getFilterMappingTargetProperties() returns correct array of target properties");
		this.navigationTarget.removeFilterMappingTargetProperty(this.filterMappingTargetProperty1);
		assert.equal(this.navigationTarget.getFilterMappingTargetProperties().indexOf(this.filterMappingTargetProperty1), -1, "Filter mapping target properties can be removed");
	});
	QUnit.test("Set and Get title key", function(assert){
		this.navigationTarget.setTitleKey("titleKey");
		assert.strictEqual(this.navigationTarget.getTitleKey(), "titleKey", "Correct titleKey returned");
	});
	QUnit.test("navigationTarget copy with new id", function(assert) {
		this.navigationTarget.setSemanticObject(this.semanticObject);
		this.navigationTarget.setAction(this.action);
		this.navigationTarget.setStepSpecific();
		this.navigationTarget.setUseDynamicParameters(true);
		this.navigationTarget.setFilterMappingService(this.filterMappingService);
		this.navigationTarget.setFilterMappingEntitySet(this.filterMappingEntitySet);
		this.navigationTarget.addFilterMappingTargetProperty(this.filterMappingTargetProperty1);
		this.navigationTarget.addFilterMappingTargetProperty(this.filterMappingTargetProperty2);
		this.navigationTarget.addNavigationParameter("key", "value");
		this.navigationTarget.setTitleKey("titleKey");
		var newIdForCopy = "NewIdForCopy";
		var copy = this.navigationTarget.copy(newIdForCopy);
		assert.equal(copy.getId(), newIdForCopy, "WHEN copy with new id THEN the copy gets the new id");
		assert.ok(copy instanceof sap.apf.modeler.core.NavigationTarget, "WHEN copy with new id THEN an instance of the right type is returned");
		assert.equal(copy.getSemanticObject(), this.semanticObject, "WHEN copy with new id THEN the value of the semantic object is copied as well");
		assert.equal(copy.getAction(), this.action, "WHEN copy with new id THEN the value of the action is copied as well");
		assert.ok(copy.isStepSpecific(), "WHEN copy with new id THEN isStepSpecific information is copied as well");
		assert.equal(copy.getFilterMappingService(), this.filterMappingService, "WHEN copy with new id THEN getFilterMappingService() returns correct service");
		assert.equal(copy.getFilterMappingEntitySet(), this.filterMappingEntitySet, "WHEN copy with new id THEN getFilterMappingEntitySet() returns correct entity set");
		assert.deepEqual(copy.getFilterMappingTargetProperties(), [ this.filterMappingTargetProperty1, this.filterMappingTargetProperty2 ], "WHEN copy with new id THEN getFilterMappingTargetProperties() returns correct array of target properties");
		assert.deepEqual(copy.getAllNavigationParameters(), [{key: "key", value: "value"}], "Navigation parameter copied");
		assert.strictEqual(copy.getTitleKey(), this.navigationTarget.getTitleKey(),"Title key copied");
		assert.strictEqual(copy.getUseDynamicParameters(), true, "THEN flag useDynamicParameters is copied");
	});
	QUnit.test("navigationTarget copy without new id", function(assert) {
		this.navigationTarget.setSemanticObject(this.semanticObject);
		this.navigationTarget.setAction(this.action);
		this.navigationTarget.setStepSpecific();
		this.navigationTarget.setUseDynamicParameters(true);
		this.navigationTarget.setFilterMappingService(this.filterMappingService);
		this.navigationTarget.setFilterMappingEntitySet(this.filterMappingEntitySet);
		this.navigationTarget.addFilterMappingTargetProperty(this.filterMappingTargetProperty1);
		this.navigationTarget.addFilterMappingTargetProperty(this.filterMappingTargetProperty2);
		var copy = this.navigationTarget.copy();
		assert.equal(copy.getId(), this.id, "WHEN copy without new id THEN the copy gets the old id");
		assert.ok(copy instanceof sap.apf.modeler.core.NavigationTarget, "WHEN copy without new id  THEN an instance of the right type is returned");
		assert.equal(copy.getSemanticObject(), this.semanticObject, "WHEN copy without new id  THEN the value of the semantic object is copied as well");
		assert.equal(copy.getAction(), this.action, "WHEN copy without new id  THEN the value of the action is copied as well");
		assert.ok(copy.isStepSpecific(), "WHEN copy without new id THEN isStepSpecific information is copied as well");
		assert.equal(copy.getFilterMappingService(), this.filterMappingService, "WHEN copy with new id THEN getFilterMappingService() returns correct service");
		assert.equal(copy.getFilterMappingEntitySet(), this.filterMappingEntitySet, "WHEN copy with new id THEN getFilterMappingEntitySet() returns correct entity set");
		assert.deepEqual(copy.getFilterMappingTargetProperties(), [ this.filterMappingTargetProperty1, this.filterMappingTargetProperty2 ], "WHEN copy with new id THEN getFilterMappingTargetProperties() returns correct array of target properties");
		assert.strictEqual(copy.getUseDynamicParameters(), true, "THEN flag useDynamicParameters is copied");
	});
	QUnit.module("Navigation Target Parameters", {
		beforeEach : function() {
			this.id = "NavigationTargetId";
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
			this.inject = {
				instances : {
					messageHandler : this.messageHandler
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable,
					ElementContainer : sap.apf.modeler.core.ElementContainer
				}
			};
			this.navigationTarget = new sap.apf.modeler.core.NavigationTarget(this.id, this.inject);
		}
	});
	QUnit.test("Add and get", function(assert){
		assert.strictEqual(this.navigationTarget.getNavigationParameter("key"), undefined, "Undefined returned for not existing parameter");
		this.navigationTarget.addNavigationParameter("key", "value");
		assert.deepEqual(this.navigationTarget.getNavigationParameter("key"), {key: "key", value: "value"}, "Added parameter returned");
	});
	QUnit.test("Add at a specific position", function(assert){
		//prepare
		this.navigationTarget.addNavigationParameter("key1", "value");
		this.navigationTarget.addNavigationParameter("key3", "value");
		assert.deepEqual(this.navigationTarget.getAllNavigationParameters(), [{
			key: "key1",
			value: "value"
		},{
			key: "key3",
			value: "value"
		}], "Array contains added parameters");
		//Test
		this.navigationTarget.addNavigationParameter("key0", "value", 0);
		assert.deepEqual(this.navigationTarget.getAllNavigationParameters(), [{
			key: "key0",
			value: "value"
		},{
			key: "key1",
			value: "value"
		},{
			key: "key3",
			value: "value"
		}], "Parameter added at top");
		this.navigationTarget.addNavigationParameter("key2", "value", 2);
		assert.deepEqual(this.navigationTarget.getAllNavigationParameters(), [{
			key: "key0",
			value: "value"
		},{
			key: "key1",
			value: "value"
		},{
			key: "key2",
			value: "value"
		},{
			key: "key3",
			value: "value"
		}], "Parameter added in the middle");
		this.navigationTarget.addNavigationParameter("key4", "value", 4);
		assert.deepEqual(this.navigationTarget.getAllNavigationParameters(), [{
			key: "key0",
			value: "value"
		},{
			key: "key1",
			value: "value"
		},{
			key: "key2",
			value: "value"
		},{
			key: "key3",
			value: "value"
		},{
			key: "key4",
			value: "value"
		}], "Parameter added at the end");
	});
	QUnit.test("Add and getAll", function(assert){
		var expected = [{
			key: "key",
			value: "value"
		}, {
			key: "key2",
			value: "value2"
		}];
		assert.deepEqual(this.navigationTarget.getAllNavigationParameters(), [], "Empty array returned for no existing parameters");
		this.navigationTarget.addNavigationParameter("key", "value");
		this.navigationTarget.addNavigationParameter("key2", "value2");
		assert.deepEqual(this.navigationTarget.getAllNavigationParameters(), expected, "Array with added parameters returned");
	});
	QUnit.test("Remove first value", function(assert){
		var expected = [{
			key: "key2",
			value: "value2"
		}, {
			key: "key3",
			value: "value3"
		}];
		this.navigationTarget.addNavigationParameter("key", "value");
		this.navigationTarget.addNavigationParameter("key2", "value2");
		this.navigationTarget.addNavigationParameter("key3", "value3");
		this.navigationTarget.removeNavigationParameter("key");
		assert.deepEqual(this.navigationTarget.getAllNavigationParameters(), expected, "Array without removed parameter returned");
	});
	QUnit.test("Remove second value", function(assert){
		var expected = [{
			key: "key",
			value: "value"
		}, {
			key: "key3",
			value: "value3"
		}];
		this.navigationTarget.addNavigationParameter("key", "value");
		this.navigationTarget.addNavigationParameter("key2", "value2");
		this.navigationTarget.addNavigationParameter("key3", "value3");
		this.navigationTarget.removeNavigationParameter("key2");
		assert.deepEqual(this.navigationTarget.getAllNavigationParameters(), expected, "Array without removed parameter returned");
	});
}());