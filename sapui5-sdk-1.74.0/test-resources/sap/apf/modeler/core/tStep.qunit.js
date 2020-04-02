/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */

jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');

jQuery.sap.require('sap.apf.utils.hashtable');
jQuery.sap.require('sap.apf.modeler.core.step');
jQuery.sap.require('sap.apf.modeler.core.hierarchicalStep');
jQuery.sap.require('sap.apf.modeler.core.elementContainer');
jQuery.sap.require('sap.apf.modeler.core.representation');
jQuery.sap.require('sap.apf.modeler.core.configurationObjects');

(function() {
	'use strict';

	var keyText42 = 'keyText-42';
	var propertyKeyOtto = 'otto';
	var propertyKeyMara = 'mara';
	var plum = 'plum';
	var apple = 'apple';
	function commonSetup () {
		this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
		this.inject = {
			instances : {
				messageHandler : this.messageHandler
			},
			constructors : {
				Hashtable : sap.apf.utils.Hashtable,
				Step : sap.apf.modeler.core.Step,
				ElementContainer : sap.apf.modeler.core.ElementContainer,
				Representation : sap.apf.modeler.core.Representation
			}
		};
		this.service = 'hugo-service';
		this.entitySet = 'hugo-view';
		this.step = new sap.apf.modeler.core.Step('xyz',
				this.inject);
	}
	function commonSetupForConsumableProperties(){
		this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
		this.inject = {
			instances : {
				messageHandler : this.messageHandler,
				metadataFactory: {
					getMetadata : function(serviceRoot){
							if(serviceRoot !== "ServiceNotAvailable"){
								return jQuery.Deferred().resolve({
									getAllPropertiesOfEntitySet: function (entitySet){
										if(entitySet){
											return ["PropertyNotSelected", "PropertyInMetadataAndAsSelectProperty", "HierarchyProperty"];
										}
										return [];
									}
								});
							}
							return jQuery.Deferred().resolve();
					}
				}
			},
			constructors : {
				Hashtable : sap.apf.utils.Hashtable,
				ElementContainer : sap.apf.modeler.core.ElementContainer,
				Representation : sap.apf.modeler.core.Representation
			}
		};
		this.step = new sap.apf.modeler.core.Step('xyz',this.inject);
		this.step.setService("service");
		this.step.setEntitySet("entitySet");
		this.step.addSelectProperty("PropertyNotInMetadata");
		this.step.addSelectProperty("PropertyInMetadataAndAsSelectProperty");
		this.representation = this.step.createRepresentation();
	}
	QUnit.module('Step Class',{
		beforeEach : function() {
			commonSetup.call(this);
		}
	});
	QUnit.test('getType', function (assert){
		assert.strictEqual(this.step.getType(), "step", "Correct type returned");
	});
	QUnit.test('WHEN Create one step THEN returns instance', function(assert) {
		assert.ok(this.step, 'Creation successful');
		assert.equal(this.step.getId(), 'xyz');
	});
	QUnit.test('Set request', function(assert) {
		this.step.setService(this.service);
		this.step.setEntitySet(this.entitySet);
		assert.equal(this.step.getService(), this.service, 'WHEN setService THEN getService is initialized');
		assert.equal(this.step.getEntitySet(), this.entitySet, 'WHEN setEntitySet THEN getEntitySet is initialized');
	});
	QUnit.test('GIVEN a step WHEN addSelectProperty THEN getSelectProperties contains it ', function(assert) {
		this.step.addSelectProperty(apple);
		this.step.addSelectProperty(plum);
		assert.equal(this.step.getSelectProperties().length, 2, 'added 2');
		assert.notEqual(this.step.getSelectProperties().indexOf(apple), -1,
				'contained');
		assert.notEqual(this.step.getSelectProperties().indexOf(plum), -1,
				'contained');
	});
	QUnit.test('GIVEN a step & select Property WHEN removeSelectProperty THEN getSelectProperties does not contains it', function(assert) {
		this.step.addSelectProperty(apple);
		this.step.addSelectProperty(plum);
		this.step.removeSelectProperty(plum);
		assert.equal(this.step.getSelectProperties().length, 1, 'added 2');
		assert.notEqual(this.step.getSelectProperties().indexOf(apple), -1, 'contained');
		assert.equal(this.step.getSelectProperties().indexOf(plum), -1, 'contained');
	});
	QUnit.test('GIVEN a step WHEN filterProperty THEN reflected in getFilterProperties()', function(assert) {
		this.step.addFilterProperty(apple);
		this.step.addFilterProperty(plum);
		assert.equal(this.step.getFilterProperties().length, 2, 'added 2');
		this.step.removeFilterProperty(plum);
		assert.equal(this.step.getFilterProperties().length, 1, 'added 2');
		assert.notEqual(this.step.getFilterProperties().indexOf(apple), -1, 'contained');
		assert.equal(this.step.getFilterProperties().indexOf(plum), -1, 'contained');
	});
	QUnit.test('GIVEN a step WHEN add/remove/getRepresentation THEN reflected by getRepresentations()', function(assert) {
		var reprObj = this.step.createRepresentation();
		assert.equal(this.step.getRepresentations().length, 1, 'Representation added');
		assert.equal(this.step.getRepresentation(reprObj.getId()).getId(), reprObj.getId(), 'Id invariant');
		var reprObj2 = this.step.createRepresentation();
		this.step.removeRepresentation(reprObj.getId());
		assert.equal(this.step.getRepresentations().length, 1, 'One representation removed');
		assert.equal(this.step.getRepresentation(reprObj.getId()), undefined, 'First representation removed');
		assert.notEqual(this.step.getRepresentation(reprObj2.getId()), undefined, 'Second representation exists');
		this.step.removeRepresentation(reprObj2.getId());
		assert.equal(this.step.getRepresentations().length, 0, 'No representations available');
		assert.equal(this.step.getRepresentation(reprObj2.getId()), undefined, 'Second representation removed');
	});
	QUnit.test('GIVEN a representation with id', function(assert){
		var reprObj = this.step.createRepresentation({ id : "representation-99"});
		assert.strictEqual(reprObj.id, "representation-99", "THEN id is preserved");
	});
	QUnit.test('GIVEN a step WHEN add/removeNavigationTargets THEN reflected by getNavigationTargets', function(assert) {
		var navTargets = this.step.getNavigationTargets();
		assert.equal(navTargets.length, 0, 'No navigation targets are assigned to the step');
		this.step.addNavigationTarget('navTargetId1');
		navTargets = this.step.getNavigationTargets();
		assert.equal(navTargets.length, 1, 'WHEN addNavigationTarget THEN a navigation target is assigned to the step');
		assert.ok(navTargets.indexOf('navTargetId1') > -1, 'WHEN addNavigationTarget THEN the right navigation target is assigned to the step');
		this.step.addNavigationTarget('navTargetId2');
		navTargets = this.step.getNavigationTargets();
		assert.equal(navTargets.length, 2, 'WHEN addNavigationTarget THEN two navigation targets are assigned to the step');
		assert.ok(navTargets.indexOf('navTargetId1') > -1, 'WHEN addNavigationTarget THEN the right navigation target is assigned to the step');
		assert.ok(navTargets.indexOf('navTargetId2') > -1, 'WHEN addNavigationTarget THEN the right navigation target is assigned to the step');
		this.step.removeNavigationTarget('navTargetId2');
		navTargets = this.step.getNavigationTargets();
		assert.equal(navTargets.length, 1,'WHEN removeNavigationTarget THEN one navigation target is assigned to the step');
		assert.ok(navTargets.indexOf('navTargetId1') > -1, 'WHEN removeNavigationTarget THEN the right navigation target is still assigned to the step');
	});
	QUnit.test('Apply moveRepresentationBefore, moveRepresentationToEnd, moveRepresentationUpOrDown', function(assert) {
		var rep1 = this.step.createRepresentation();
		var rep2 = this.step.createRepresentation();
		var rep3 = this.step.createRepresentation();

		var reps = this.step.getRepresentations();
		assert.equal(reps[0], rep1, 'First representation expected');
		assert.equal(reps[1], rep2, 'Second representation expected');
		assert.equal(reps[2], rep3, 'Third representation expected');
		this.step.moveRepresentationBefore(rep1.getId(), rep3.getId());
		reps = this.step.getRepresentations();
		assert.equal(reps[0], rep3, 'Third representation expected');
		assert.equal(reps[1], rep1, 'First representation expected');
		assert.equal(reps[2], rep2, 'Second representation expected');
		this.step.moveRepresentationToEnd(rep3.getId());
		reps = this.step.getRepresentations();
		assert.equal(reps[0], rep1, 'First representation expected');
		assert.equal(reps[1], rep2, 'Second representation expected');
		assert.equal(reps[2], rep3, 'Third representation expected');

		this.step.moveRepresentationUpOrDown(rep1.getId(), 1);
		reps = this.step.getRepresentations();
		assert.equal(reps[0], rep2, 'Second representation expected');
		assert.equal(reps[1], rep1, 'First representation expected');
		assert.equal(reps[2], rep3, 'Third representation expected');
	});
	QUnit.test('GIVEN a step WHEN copyRepresentation THEN reflected by get', function(assert) {
		var id = this.step.createRepresentation().getId();
		var list = this.step.getRepresentations();
		assert.equal(list.length, 1, 'non-empty');
		var newId = this.step.copyRepresentation(id);
		list = this.step.getRepresentations();
		assert.equal(list.length, 2, 'entry added by copy');
		assert.ok(this.step.getRepresentation(newId), 'entry can be retrieved by new Id');
	});
	QUnit.test('GIVEN a step - id format, filter & select properties', function(assert) {
		var reprObj = this.step.createRepresentation();
		assert.notEqual(reprObj.getId().indexOf('Representation'), -1, 'WHEN createRepresentation THEN key format ok');
		assert.notEqual(reprObj.getId().indexOf(this.step.getId()), -1, 'WHEN createRepresentation THEN key format ok');
		this.step.addFilterProperty(propertyKeyOtto);
		assert.notEqual((this.step.getFilterProperties()[0]).indexOf(propertyKeyOtto), -1, 'WHEN addFilterProperty THEN getFilterProperties returns added id');
		this.step.addSelectProperty(propertyKeyMara);
		assert.notEqual((this.step.getSelectProperties()[0]).indexOf(propertyKeyMara), -1, 'WHEN addSelectProperty THEN getFilterProperties returns added id');
	});
	QUnit.test('GIVEN a step - titles', function(assert) {
		this.step.setTitleId('titleId');
		assert.equal(this.step.getTitleId(), 'titleId', 'WHEN setTitleId(x) THEN getTitleId returns x');
		this.step.setLongTitleId('longTitleId');
		assert.equal(this.step.getLongTitleId(), 'longTitleId', 'WHEN setLongTitleId(x) THEN getLongTitleId returns x');
	});
	QUnit.test('GIVEN a step - thumbnail texts', function(assert) {
		this.step.setLeftUpperCornerTextKey(keyText42);
		assert.equal(this.step.getLeftUpperCornerTextKey(), keyText42, 'WHEN set left upper THEN left upper returned');
		this.step.setRightUpperCornerTextKey(keyText42);
		assert.equal(this.step.getRightUpperCornerTextKey(), keyText42, 'WHEN set right upper THEN right upper returned'); 
		this.step.setLeftLowerCornerTextKey(keyText42);
		assert.equal(this.step.getLeftLowerCornerTextKey(), keyText42, 'WHEN set left lower upper THEN left lower returned');
		this.step.setRightLowerCornerTextKey(keyText42);
		assert.equal(this.step.getRightLowerCornerTextKey(), keyText42, 'WHEN set right lower THEN right lower returned');
	});
	QUnit.test('GIVEN a step - copy', function(assert) {
		var newIdForCopy;
		var representations;
		var navTargets;
		var copiedStep = this.step.copy();
		assert.equal(copiedStep.getId(), this.step.getId(), 'Copied step has same Id');
		
		this.step.createRepresentation();
		this.step.setService('service');
		this.step.setEntitySet('entitySet');
		this.step.addFilterProperty('filterProperty1');
		this.step.addFilterProperty('filterProperty2');
		this.step.addSelectProperty('selectProperty1');
		this.step.addSelectProperty('selectProperty2');
		this.step.setTitleId('titleId');
		this.step.setLongTitleId('longTitleId');
		this.step.setLeftUpperCornerTextKey('leftUpper');
		this.step.setRightUpperCornerTextKey('rightUpper');
		this.step.setLeftLowerCornerTextKey('leftLower');
		this.step.setRightLowerCornerTextKey('rightLower');
		this.step.setFilterMappingService('filterMappingService');
		this.step.setFilterMappingEntitySet('filterMappingEntitySet');
		this.step.addFilterMappingTargetProperty('filterMappingTargetProperty1');
		this.step.addFilterMappingTargetProperty('filterMappingTargetProperty2');
		this.step.setFilterMappingKeepSource(true);
		this.step.addNavigationTarget('navTargetId1');
		newIdForCopy = 'newStepIdForCopy';
		copiedStep = this.step.copy(newIdForCopy);

		assert.equal(copiedStep.getId(), newIdForCopy, 'Copied step has the new Id');
		assert.notEqual(this.step, copiedStep, 'Copied step is new step instance');
		representations = copiedStep.getRepresentations();
		assert.equal(representations.length, 1, 'Copied step has representation');
		assert.equal(representations[0].getId().indexOf(copiedStep.getId()), 0, 'Copied representation starts with new step id');
		assert.equal(copiedStep.getService(), 'service', 'Copied step has correct service');
		assert.equal(copiedStep.getEntitySet(), 'entitySet', 'Copied step has correct entity set');
		assert.deepEqual(copiedStep.getFilterProperties(), ['filterProperty1', 'filterProperty2' ], 'Copied step has correct filter properties');
		assert.deepEqual(copiedStep.getSelectProperties(), ['selectProperty1', 'selectProperty2' ], 'Copied step has correct select properties');
		assert.equal(copiedStep.getTitleId(), 'titleId', 'Copied step has correct title id');
		assert.equal(copiedStep.getLongTitleId(), 'longTitleId', 'Copied step has correct long title id');
		assert.equal(copiedStep.getLeftUpperCornerTextKey(), 'leftUpper', 'Copied step has correct leftUpper corner text');
		assert.equal(copiedStep.getRightUpperCornerTextKey(), 'rightUpper', 'Copied step has correct rightUpper corner text');
		assert.equal(copiedStep.getLeftLowerCornerTextKey(), 'leftLower', 'Copied step has correct leftLower corner text');
		assert.equal(copiedStep.getRightLowerCornerTextKey(), 'rightLower', 'Copied step has correct rightLower corner text');
		assert.equal(copiedStep.getFilterMappingService(), 'filterMappingService', 'Copied step has correct filter mapping service');
		assert.equal(copiedStep.getFilterMappingEntitySet(), 'filterMappingEntitySet', 'Copied step has correct filter mappingentity set');
		assert.deepEqual(copiedStep.getFilterMappingTargetProperties(), ['filterMappingTargetProperty1', 'filterMappingTargetProperty2' ], 'Copied step has correct filter mapping target properties');
		assert.equal(copiedStep.getFilterMappingKeepSource(), true, 'Copied step has correct value for filter mapping property keepSource');

		navTargets = this.step.getNavigationTargets();
		assert.equal(navTargets.length, 1, 'Copied step has the right number of navigation targets');
		assert.ok(navTargets.indexOf('navTargetId1') > -1, 'Copied step has the right navigation target assigned');
		
		//Case for copy configuration - no new step id required
		copiedStep = this.step.copy();
		assert.equal(copiedStep.getRepresentations()[0].getId().indexOf(copiedStep.getId()), 0, 'Copied representation starts with new step id');
	});
	QUnit.module("Filter Property Options", {
		beforeEach : function() {
			commonSetup.call(this);
			this.step.addFilterProperty("FilterProperty");
		}
	});
	QUnit.test("Get Filter Property label key", function(assert){
		assert.strictEqual(this.step.getFilterPropertyLabelKey(), undefined, "No Label key returned");
	});
	QUnit.test("Set Filter Property label key", function(assert){
		this.step.setFilterPropertyLabelKey("TextKey");
		assert.strictEqual(this.step.getFilterPropertyLabelKey(), "TextKey", "Label key returned");
	});
	QUnit.test("Get Filter Property label key after removing filter property", function(assert){
		this.step.setFilterPropertyLabelKey("TextKey");
		this.step.removeFilterProperty("FilterProperty");
		assert.strictEqual(this.step.getFilterPropertyLabelKey(), undefined, "No Label key returned");
	});
	QUnit.test("Get Filter Property label key after adding filter property", function(assert){
		this.step.setFilterPropertyLabelKey("TextKey");
		this.step.addFilterProperty("FilterProperty");
		assert.strictEqual(this.step.getFilterPropertyLabelKey(), undefined, "No Label key returned");
	});
	QUnit.test("Copy Text Label Key", function(assert){
		this.step.setFilterPropertyLabelKey("TextKey");
		var step2 = this.step.copy();
		assert.strictEqual(step2.getFilterPropertyLabelKey(), "TextKey", "Label key copied");
	});
	QUnit.test("Get Filter Property label display option", function(assert){
		assert.strictEqual(this.step.getFilterPropertyLabelDisplayOption(), undefined, "No Label display option returned");
	});
	QUnit.test("Set Filter Property label display option", function(assert){
		this.step.setFilterPropertyLabelDisplayOption("Text");
		assert.strictEqual(this.step.getFilterPropertyLabelDisplayOption(), "Text", "Label display option returned");
	});
	QUnit.test("Get Filter Property label display option after removing filter property", function(assert){
		this.step.setFilterPropertyLabelDisplayOption("Text");
		this.step.removeFilterProperty("FilterProperty");
		assert.strictEqual(this.step.getFilterPropertyLabelDisplayOption(), undefined, "No Label display option returned");
	});
	QUnit.test("Get Filter Property label display option after adding filter property", function(assert){
		this.step.setFilterPropertyLabelDisplayOption("Text");
		this.step.addFilterProperty("FilterProperty");
		assert.strictEqual(this.step.getFilterPropertyLabelDisplayOption(), undefined, "No Label display option returned");
	});
	QUnit.test("Copy Text Label display option", function(assert){
		this.step.setFilterPropertyLabelDisplayOption("Text");
		var step2 = this.step.copy();
		assert.strictEqual(step2.getFilterPropertyLabelDisplayOption(), "Text", "Label display option copied");
	});
	QUnit.module("Filter Mapping Target Property Options", {
		beforeEach : function() {
			commonSetup.call(this);
			this.step.addFilterMappingTargetProperty("FilterMappingTargetProperty");
		}
	});
	QUnit.test("Get Filter Mapping Target Property label key", function(assert){
		assert.strictEqual(this.step.getFilterMappingTargetPropertyLabelKey(), undefined, "No Filter Mapping Target Property Label key returned");
	});
	QUnit.test("Set Filter Mapping Target Property label key", function(assert){
		this.step.setFilterMappingTargetPropertyLabelKey("TextKey");
		assert.strictEqual(this.step.getFilterMappingTargetPropertyLabelKey(), "TextKey", "Label key returned");
	});
	QUnit.test("Get Filter Mapping Target Property label key after removing target property", function(assert){
		this.step.setFilterMappingTargetPropertyLabelKey("TextKey");
		this.step.removeFilterMappingTargetProperty("FilterMappingTargetProperty");
		assert.strictEqual(this.step.getFilterMappingTargetPropertyLabelKey(), undefined, "No Label key returned");
	});
	QUnit.test("Get Filter Mapping Target Property label key after adding target property", function(assert){
		this.step.setFilterMappingTargetPropertyLabelKey("TextKey");
		this.step.addFilterMappingTargetProperty("FilterMappingTargetProperty");
		assert.strictEqual(this.step.getFilterMappingTargetPropertyLabelKey(), undefined, "No Label key returned");
	});
	QUnit.test("Copy Text Label Key", function(assert){
		this.step.setFilterMappingTargetPropertyLabelKey("TextKey");
		var step2 = this.step.copy();
		assert.strictEqual(step2.getFilterMappingTargetPropertyLabelKey(), "TextKey", "Label key copied");
	});
	QUnit.test("Get Filter Mapping Target Property label display option", function(assert){
		assert.strictEqual(this.step.getFilterMappingTargetPropertyLabelDisplayOption(), undefined, "No Label display option returned");
	});
	QUnit.test("Set Filter Mapping Target Property label display option", function(assert){
		this.step.setFilterMappingTargetPropertyLabelDisplayOption("Text");
		assert.strictEqual(this.step.getFilterMappingTargetPropertyLabelDisplayOption(), "Text", "Label display option returned");
	});
	QUnit.test("Get Filter Mapping Target Property label display option after removing target property", function(assert){
		this.step.setFilterMappingTargetPropertyLabelDisplayOption("Text");
		this.step.removeFilterMappingTargetProperty("FilterMappingTargetProperty");
		assert.strictEqual(this.step.getFilterMappingTargetPropertyLabelDisplayOption(), undefined, "No Label display option returned");
	});
	QUnit.test("Get Filter Mapping Target Property label display option after adding target property", function(assert){
		this.step.setFilterMappingTargetPropertyLabelDisplayOption("Text");
		this.step.addFilterMappingTargetProperty("FilterMappingTargetProperty");
		assert.strictEqual(this.step.getFilterMappingTargetPropertyLabelDisplayOption(), undefined, "No Label display option returned");
	});
	QUnit.test("Copy Text Label display option", function(assert){
		this.step.setFilterMappingTargetPropertyLabelDisplayOption("Text");
		var step2 = this.step.copy();
		assert.strictEqual(step2.getFilterMappingTargetPropertyLabelDisplayOption(), "Text", "Label display option copied");
	});
	QUnit.module('Filter Mapping', {
		beforeEach : function() {
			commonSetup.call(this);
		}
	});
	QUnit.test('Filter Mapping - Setter, Getter and Remove', function(assert) {
		var filterMappingService = 'filterMappingService';
		var filterMappingEntitySet = 'filterMappingEntitySet';
		var filterMappingTargetProperty1 = 'filterMappingTargetProperty1';
		var filterMappingTargetProperty2 = 'filterMappingTargetProperty2';

		this.step.setFilterMappingService(filterMappingService);
		this.step.setFilterMappingEntitySet(filterMappingEntitySet);
		this.step.addFilterMappingTargetProperty(filterMappingTargetProperty1);
		this.step.addFilterMappingTargetProperty(filterMappingTargetProperty2);

		assert.equal(this.step.getFilterMappingService(), filterMappingService, 'Method getFilterMappingService() returns correct service');
		assert.equal(this.step.getFilterMappingEntitySet(), filterMappingEntitySet, 'Method getFilterMappingEntitySet() returns correct entity set');
		assert.deepEqual(this.step.getFilterMappingTargetProperties(), [ filterMappingTargetProperty1, filterMappingTargetProperty2 ], 'Method getFilterMappingTargetProperties() returns correct array of target properties');

		this.step.removeFilterMappingTargetProperty(filterMappingTargetProperty1);
		assert.equal(this.step.getFilterMappingTargetProperties().indexOf(filterMappingTargetProperty1), -1, 'Filter mapping target properties can be removed');

		assert.equal(this.step.getFilterMappingKeepSource(), false, 'Default value for filter mapping property keepSource is boolean false');
		this.step.setFilterMappingKeepSource(true);
		assert.equal(this.step.getFilterMappingKeepSource(), true, 'Filter mapping value for property keepSource successfully changed to boolean true');
	});
	QUnit.module('Get consumable properties for top N',{
		beforeEach : function() {
			commonSetupForConsumableProperties.call(this);
		}
	});
	QUnit.test("No Service entered", function(assert){
		this.step.setService("");
		this.step.setEntitySet("");
		var expected = {
				available : [],
				consumable : []
		};
		this.step.getConsumablePropertiesForTopN().done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.test("Service not available", function(assert){
		this.step.setService("ServiceNotAvailable");
		var expected = {
				available : [],
				consumable : []
		};
		this.step.getConsumablePropertiesForTopN().done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.test("No Properties already used", function(assert){
		var expected = {
				available : ["PropertyInMetadataAndAsSelectProperty"],
				consumable : ["PropertyInMetadataAndAsSelectProperty"]
		};
		this.step.getConsumablePropertiesForTopN().done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.test("Already used property", function(assert){
		this.step.setTopN(41,[{
			property: "PropertyInMetadataAndAsSelectProperty",
			ascending: true
		}]);
		var expected = {
				available : ["PropertyInMetadataAndAsSelectProperty"],
				consumable : []
		};
		this.step.getConsumablePropertiesForTopN().done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.test("Already used property is not in Metadata", function(assert){
		this.step.setTopN(41,[{
			property: "PropertyNotInMetadata",
			ascending: true
		}]);
		var expected = {
				available : ["PropertyInMetadataAndAsSelectProperty"],
				consumable : ["PropertyInMetadataAndAsSelectProperty"]
		};
		this.step.getConsumablePropertiesForTopN().done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.test("Already used property is not a selected property", function(assert){
		this.step.setTopN(41,[{
			property: "PropertyNotSelected",
			ascending: true
		}]);
		var expected = {
				available : ["PropertyInMetadataAndAsSelectProperty"],
				consumable : ["PropertyInMetadataAndAsSelectProperty"]
		};
		this.step.getConsumablePropertiesForTopN().done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.module('Get consumable properties for representation properties',{
		beforeEach : function() {
			commonSetupForConsumableProperties.call(this);
		}
	});
	QUnit.test("No Service entered", function(assert){
		this.step.setService("");
		this.step.setEntitySet("");
		var expected = {
				available : [],
				consumable : []
		};
		this.step.getConsumablePropertiesForRepresentation(this.representation.getId()).done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.test("Service not available", function(assert){
		this.step.setService("ServiceNotAvailable");
		var expected = {
				available : [],
				consumable : []
		};
		this.step.getConsumablePropertiesForRepresentation(this.representation.getId()).done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.test("No Properties already used", function(assert){
		var expected = {
				available : ["PropertyInMetadataAndAsSelectProperty"],
				consumable : ["PropertyInMetadataAndAsSelectProperty"]
		};
		this.step.getConsumablePropertiesForRepresentation(this.representation.getId()).done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.test("Already selected property as dimension", function(assert){
		this.representation.addDimension("PropertyInMetadataAndAsSelectProperty");
		var expected = {
				available : ["PropertyInMetadataAndAsSelectProperty"],
				consumable : []
		};
		this.step.getConsumablePropertiesForRepresentation(this.representation.getId()).done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.test("Already selected property as measure", function(assert){
		this.representation.addMeasure("PropertyInMetadataAndAsSelectProperty");
		var expected = {
				available : ["PropertyInMetadataAndAsSelectProperty"],
				consumable : []
		};
		this.step.getConsumablePropertiesForRepresentation(this.representation.getId()).done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.test("Already selected property as property", function(assert){
		this.representation.addProperty("PropertyInMetadataAndAsSelectProperty");
		var expected = {
				available : ["PropertyInMetadataAndAsSelectProperty"],
				consumable : []
		};
		this.step.getConsumablePropertiesForRepresentation(this.representation.getId()).done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.test("Already selected dimension not in Metadata", function(assert){
		this.representation.addDimension("PropertyNotInMetadata");
		var expected = {
				available : ["PropertyInMetadataAndAsSelectProperty"],
				consumable : ["PropertyInMetadataAndAsSelectProperty"]
		};
		this.step.getConsumablePropertiesForRepresentation(this.representation.getId()).done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.test("Already selected measure not in Metadata", function(assert){
		this.representation.addMeasure("PropertyNotInMetadata");
		var expected = {
				available : ["PropertyInMetadataAndAsSelectProperty"],
				consumable : ["PropertyInMetadataAndAsSelectProperty"]
		};
		this.step.getConsumablePropertiesForRepresentation(this.representation.getId()).done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.test("Already selected property not in Metadata", function(assert){
		this.representation.addProperty("PropertyNotInMetadata");
		var expected = {
				available : ["PropertyInMetadataAndAsSelectProperty"],
				consumable : ["PropertyInMetadataAndAsSelectProperty"]
		};
		this.step.getConsumablePropertiesForRepresentation(this.representation.getId()).done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.test("Already selected dimension not a selected property", function(assert){
		this.representation.addDimension("PropertyNotSelected");
		var expected = {
				available : ["PropertyInMetadataAndAsSelectProperty"],
				consumable : ["PropertyInMetadataAndAsSelectProperty"]
		};
		this.step.getConsumablePropertiesForRepresentation(this.representation.getId()).done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.test("Already selected measure not a selected property", function(assert){
		this.representation.addMeasure("PropertyNotSelected");
		var expected = {
				available : ["PropertyInMetadataAndAsSelectProperty"],
				consumable : ["PropertyInMetadataAndAsSelectProperty"]
		};
		this.step.getConsumablePropertiesForRepresentation(this.representation.getId()).done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.test("Already selected property not a selected property", function(assert){
		this.representation.addProperty("PropertyNotSelected");
		var expected = {
				available : ["PropertyInMetadataAndAsSelectProperty"],
				consumable : ["PropertyInMetadataAndAsSelectProperty"]
		};
		this.step.getConsumablePropertiesForRepresentation(this.representation.getId()).done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.test("Hierarchy Property is available and not consumable", function(assert){
		this.hStep = new sap.apf.modeler.core.HierarchicalStep('xyz',this.inject);
		this.hStep.setService("service");
		this.hStep.setEntitySet("entitySet");
		this.hStep.addSelectProperty("PropertyNotInMetadata");
		this.hStep.addSelectProperty("PropertyInMetadataAndAsSelectProperty");
		this.representation = this.hStep.createRepresentation();
		this.hStep.setHierarchyProperty("HierarchyProperty");
		var expected = {
				available : ["PropertyInMetadataAndAsSelectProperty", "HierarchyProperty"],
				consumable : ["PropertyInMetadataAndAsSelectProperty"]
		};
		this.hStep.getConsumablePropertiesForRepresentation(this.representation.getId()).done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.test("Hierarchy Property is not available and not consumable", function(assert){
		this.hStep = new sap.apf.modeler.core.HierarchicalStep('xyz',this.inject);
		this.hStep.setService("service");
		this.hStep.setEntitySet("entitySet");
		this.hStep.addSelectProperty("PropertyNotInMetadata");
		this.hStep.addSelectProperty("PropertyInMetadataAndAsSelectProperty");
		this.representation = this.hStep.createRepresentation();
		this.hStep.setHierarchyProperty("HierarchyPropertyNotInMetadata");
		var expected = {
				available : ["PropertyInMetadataAndAsSelectProperty"],
				consumable : ["PropertyInMetadataAndAsSelectProperty"]
		};
		this.step.getConsumablePropertiesForRepresentation(this.representation.getId()).done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.module('Get consumable properties for representation sort properties',{
		beforeEach : function() {
			commonSetupForConsumableProperties.call(this);
		}
	});
	QUnit.test("No Service entered", function(assert){
		this.step.setService("");
		this.step.setEntitySet("");
		var expected = {
				available : [],
				consumable : []
		};
		this.step.getConsumableSortPropertiesForRepresentation(this.representation.getId()).done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.test("Service not available", function(assert){
		this.step.setService("ServiceNotAvailable");
		var expected = {
				available : [],
				consumable : []
		};
		this.step.getConsumableSortPropertiesForRepresentation(this.representation.getId()).done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.test("No Properties already used", function(assert){
		var expected = {
				available : ["PropertyInMetadataAndAsSelectProperty"],
				consumable : ["PropertyInMetadataAndAsSelectProperty"]
		};
		this.step.getConsumableSortPropertiesForRepresentation(this.representation.getId()).done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.test("Already used property", function(assert){
		this.representation.addOrderbySpec("PropertyInMetadataAndAsSelectProperty", true);
		var expected = {
				available : ["PropertyInMetadataAndAsSelectProperty"],
				consumable : []
		};
		this.step.getConsumableSortPropertiesForRepresentation(this.representation.getId()).done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.test("Already used property is not in Metadata", function(assert){
		this.representation.addOrderbySpec("PropertyNotInMetadata", true);
		var expected = {
				available : ["PropertyInMetadataAndAsSelectProperty"],
				consumable : ["PropertyInMetadataAndAsSelectProperty"]
		};
		this.step.getConsumableSortPropertiesForRepresentation(this.representation.getId()).done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
	QUnit.test("Already used property is not a selected property", function(assert){
		this.representation.addOrderbySpec("PropertyNotSelected", true);
		var expected = {
				available : ["PropertyInMetadataAndAsSelectProperty"],
				consumable : ["PropertyInMetadataAndAsSelectProperty"]
		};
		this.step.getConsumableSortPropertiesForRepresentation(this.representation.getId()).done(function(result){
			assert.deepEqual(result, expected, "Expected available and consumable properties returned");
		});
	});
}());