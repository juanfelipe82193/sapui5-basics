/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery,sinon */
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.ui.thirdparty.sinon");
jQuery.sap.require("sap.apf.testhelper.doubles.messageHandler");
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.utils.utils");
jQuery.sap.require("sap.apf.modeler.core.configurationObjects");
jQuery.sap.require("sap.apf.modeler.core.configurationEditor");
jQuery.sap.require("sap.apf.modeler.core.step");
jQuery.sap.require("sap.apf.modeler.core.hierarchicalStep");
jQuery.sap.require("sap.apf.modeler.core.elementContainer");
jQuery.sap.require("sap.apf.modeler.core.representation");
jQuery.sap.require("sap.apf.modeler.core.facetFilter");
jQuery.sap.require("sap.apf.modeler.core.smartFilterBar");
jQuery.sap.require("sap.apf.modeler.core.navigationTarget");
jQuery.sap.require("sap.apf.core.configurationFactory");
jQuery.sap.require("sap.apf.core.metadataFactory");
jQuery.sap.require("sap.apf.modeler.core.registryWrapper");
(function() {
	'use strict';
	var measureDisplayOptions = sap.apf.core.constants.representationMetadata.measureDisplayOptions;
	var displayOptions = sap.apf.core.constants.representationMetadata.labelDisplayOptions;
	var kind42 = 'kind42', kind33 = 'kind33', keyHugo = 'hugo', keyMara = 'mara';
	function ConfigHandler() {
		this.getConfiguration = function(id) {
			return {
				AnalyticalConfigurationName : "myConfig"
			};
		};
		this.getType = function() {
			return "configHandler";
		};
	}
	function Empty() {
		this.getType = function() {
			return "empty";
		};
	}
	QUnit.module("Serialization", {
		beforeEach : function() {
			var textKeyCounter = 0;
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
			this.inject = {
				instances : {
					messageHandler : this.messageHandler,
					textPool : {
						getPersistentKey : function(id) {
							return id; //"persistentTextKey-" + (++textKeyCounter);
						},
						get : function(id) {
							return {
								TextElement : id,
								TextElementDescription : id + "Description"
							};
						}
					},
					metadataFactory : {
						getMetadata : function(service) {
							
							return jQuery.Deferred().resolve({
								getAllPropertiesOfEntitySet : function(entitySet) {
									if (entitySet === "myInvalidEntitySet") {
										return [];
									}
									return [ "property1", "property2" ];
								},
								getEntitySetByEntityType : function(entityType) {
									if (entityType === "entityType1") {
										return "entitySet1";
									} else if (entityType === "entityType2") {
										return "entitySet2";
									}
									return "";
								}
							});
						}
					}
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable
				}
			};
			this.service = "hugo-service";
			this.entitySet = "hugo-view";
			this.template4CategoryMouse = {
				labelKey : "textReference-mouse"
			};
			this.template4CategoryCat = {
				labelKey : "textReference-cat"
			};
			this.editor = new sap.apf.modeler.core.ConfigurationEditor("apf1972-tempId", {
				instances : {
					messageHandler : this.messageHandler,
					persistenceProxy : new Empty(),
					configurationHandler : new ConfigHandler(),
					textPool : {
						getPersistentKey : function() {
							return "persistentTextKey-" + (++textKeyCounter);
						},
						get : function(id) {
							return {
								TextElement : id,
								TextElementDescription : id + "Description"
							};
						}
					}
				},
				constructors : {
					MetadataFactory : sap.apf.core.MetadataFactory,
					Hashtable : sap.apf.utils.Hashtable,
					Step : sap.apf.modeler.core.Step,
					HierarchicalStep : sap.apf.modeler.core.HierarchicalStep,
					ElementContainer : sap.apf.modeler.core.ElementContainer,
					Representation : sap.apf.modeler.core.Representation,
					ConfigurationObjects : sap.apf.modeler.core.ConfigurationObjects,
					SmartFilterBar : sap.apf.modeler.core.SmartFilterBar,
					FacetFilter : sap.apf.modeler.core.FacetFilter,
					NavigationTarget : sap.apf.modeler.core.NavigationTarget,
					ConfigurationFactory : function a() {
						return null;
					}
				}
			});
			this.editor.setApplicationTitle("appTitleTextKey");
			this.configurationObjects = new sap.apf.modeler.core.ConfigurationObjects(this.inject);
		}
	});
	QUnit.test("WHEN serializeCategory THEN validates", function(assert) {
		var factory = new sap.apf.modeler.core.ConfigurationObjects(this.inject);
		var categoryId = this.editor.setCategory(this.template4CategoryMouse);
		this.editor.setCategory(this.template4CategoryCat);
		var category = factory.serializeCategory(this.editor.getCategory(categoryId));
		assert.equal(factory.validateCategory(category), true, "category");
	});
	QUnit.test("serializeConfiguration category", function(assert) {
		var factory = new sap.apf.modeler.core.ConfigurationObjects(this.inject);
		var catKey = this.editor.setCategory(this.template4CategoryCat);
		var obj = factory.serializeConfiguration(this.editor);
		assert.equal(obj.analyticalConfigurationName, "myConfig", "THEN the assert.expected Name is serialized");
		assert.equal(obj.categories[0].id, catKey, "GIVEN category in editor WHEN serializeConfiguration THEN category is contained");
		assert.equal(obj.categories[0].description, "textReference-catDescription", "GIVEN category in editor WHEN serializeConfiguration THEN description  is contained");
		assert.equal(factory.validateCategory(obj.categories[0]), true, "GIVEN category in editor WHEN serializeConfiguration THEN category is contained");
		assert.equal(factory.validateCategory(obj.categories[0]), true, "GIVEN category in editor WHEN serializeConfiguration THEN category is valid");
	});
	QUnit.test("serializeConfiguration config itself", function(assert) {
		var factory = new sap.apf.modeler.core.ConfigurationObjects(this.inject);
		var obj = factory.serializeConfiguration(this.editor);
		assert.equal(factory.validateConfiguration(obj), true, " WHEN serializeConfiguration THEN result validates");
	});
	QUnit.test("serializeConfiguration step", function(assert) {
		var factory = new sap.apf.modeler.core.ConfigurationObjects(this.inject);
		var catId = this.editor.setCategory(this.template4CategoryCat); // at least one category is required for validity
		var stepId = this.editor.createStep(catId);
		var step = this.editor.getStep(stepId);
		step.setLeftLowerCornerTextKey("leftLower");
		step.setTitleId("titleId");
		step.setLongTitleId("longTitleId");
		step.addNavigationTarget("navTarId1");
		var obj = factory.serializeConfiguration(this.editor);
		assert.equal(obj.steps[0].id, stepId, "GIVEN step in editor WHEN serializeConfiguration THEN step is contained");
		assert.equal(factory.validateStep(obj.steps[0]), true, " WHEN serializeConfiguration THEN step validates");
		assert.notEqual(obj.steps[0].thumbnail, undefined, "WHEN setLeftLowerCornerTextKey THEN thumbnail exists");
		assert.notEqual(obj.steps[0].thumbnail.leftLower, undefined, "WHEN setLeftLowerCornerTextKey THEN thumbnail exists");
		assert.equal(obj.steps[0].description, "titleIdDescription", "Expected description");
		assert.equal(obj.steps[0].thumbnail.leftUpper, undefined, "WHEN setLeftLowerCornerTextKey THEN leftUpper is undefined");
		assert.deepEqual(obj.steps[0].navigationTargets, [ {
			type : "navigationTarget",
			id : "navTarId1"
		} ], "WHEN setNavigationTarget THEN navigation target is serialized");
	});
	QUnit.test("serializeConfiguration step.thumbnail", function(assert) {
		var factory = new sap.apf.modeler.core.ConfigurationObjects(this.inject);
		var catId = this.editor.setCategory(this.template4CategoryCat); // at least one category is required for validity
		this.editor.createStep(catId);
		var obj = factory.serializeConfiguration(this.editor);
		assert.equal(obj.steps[0].thumbnail, undefined, "WHEN no setLeftLowerCornerTextKey THEN no thumbnail exists");
	});
	QUnit.test("serializeConfiguration step.filterMapping", function(assert) {
		var factory = new sap.apf.modeler.core.ConfigurationObjects(this.inject);
		var catId = this.editor.setCategory(this.template4CategoryCat); // at least one category is required for validity
		var stepId = this.editor.createStep(catId);
		var step = this.editor.getStep(stepId);
		step.setFilterMappingService("filterMappingService");
		step.setFilterMappingEntitySet("filterMappingEntitySet");
		step.addFilterMappingTargetProperty("filterMappingTargetProperty1");
		step.addFilterMappingTargetProperty("filterMappingTargetProperty2");
		step.setFilterMappingTargetPropertyLabelKey("labelTextKey");
		step.setFilterMappingTargetPropertyLabelDisplayOption("key");
		var obj = factory.serializeConfiguration(this.editor);
		assert.ok(obj.steps[0].filterMapping, "Property filterMapping exists");
		assert.equal(obj.steps[0].filterMapping.requestForMappedFilter, obj.requests[1].id, "Correct filter mapping request id added");
		assert.deepEqual(obj.steps[0].filterMapping.target, [ "filterMappingTargetProperty1", "filterMappingTargetProperty2" ], "Filter mapping target properties are existing");
		assert.equal(obj.steps[0].filterMapping.keepSource, "false", "Filter mapping keepSource property set correctly");
		assert.equal(obj.requests[1].service, "filterMappingService", "Filter mapping service exists");
		assert.equal(obj.requests[1].entitySet, "filterMappingEntitySet", "Filter mapping entity set exists");
		assert.strictEqual(obj.steps[0].filterMapping.targetPropertyLabelKey, "labelTextKey", "Filter Mapping Target Property Label Key is Serialized");
		assert.strictEqual(obj.steps[0].filterMapping.targetPropertyDisplayOption, "key", "Filter Mapping Target Property Display Option is Serialized");
		step.setFilterMappingKeepSource(true);
		obj = factory.serializeConfiguration(this.editor);
		assert.equal(obj.steps[0].filterMapping.keepSource, "true", "Filter mapping keepSource property changed correctly");
	});
	QUnit.test("serializeConfiguration hierarchical step", function(assert) {
		var factory = new sap.apf.modeler.core.ConfigurationObjects(this.inject);
		var catId = this.editor.setCategory(this.template4CategoryCat); // at least one category is required for validity
		var stepId = this.editor.createHierarchicalStep(catId);
		var step = this.editor.getStep(stepId);
		step.setHierarchyProperty("hierarchyProperty");
		step.setLeftLowerCornerTextKey("leftLower");
		var obj = factory.serializeConfiguration(this.editor);
		assert.equal(obj.steps[0].id, stepId, "Step has correct id");
		assert.equal(obj.steps[0].type, "hierarchicalStep", "Step has correct type");
		assert.equal(obj.steps[0].thumbnail.leftLower.key, "leftLower", "Serialization of normal step is also called");
		assert.equal(obj.steps[0].hierarchyProperty, "hierarchyProperty", "HierarchyProperty is serialized");
	});
	QUnit.test("serializeConfiguration hierarchical step with representation", function(assert) {
		var factory = new sap.apf.modeler.core.ConfigurationObjects(this.inject);
		var catId = this.editor.setCategory(this.template4CategoryCat); // at least one category is required for validity
		var stepId = this.editor.createHierarchicalStep(catId);
		var step = this.editor.getStep(stepId);
		step.setHierarchyProperty("hierarchyProperty");
		var representation = step.createRepresentation();
		representation.setHierarchyPropertyTextLabelKey("key");
		representation.setHierarchyPropertyLabelDisplayOption("Text");
		var obj = factory.serializeConfiguration(this.editor);
		assert.equal(obj.bindings[0].representations[0].parameter.hierarchicalProperty[0].fieldName, "hierarchyProperty", "HierarchyProperty is serialized on representation");
		assert.equal(obj.bindings[0].representations[0].parameter.hierarchicalProperty[0].kind, "hierarchicalColumn", "Kind is 'hierarchyProperty'");
		assert.equal(obj.bindings[0].representations[0].parameter.hierarchicalProperty[0].fieldDesc.type, "label", "FieldDesc.type is label");
		assert.equal(obj.bindings[0].representations[0].parameter.hierarchicalProperty[0].fieldDesc.kind, "text", "FieldDesc.kind is text");
		assert.equal(obj.bindings[0].representations[0].parameter.hierarchicalProperty[0].fieldDesc.key, "key", "FieldDesc.key is provided correctly");
		assert.equal(obj.bindings[0].representations[0].parameter.hierarchicalProperty[0].labelDisplayOption, "Text", "LabelDisplayOption provided corretly");

		step.setHierarchyProperty("hierarchyProperty2");
		obj = factory.serializeConfiguration(this.editor);
		assert.equal(obj.bindings[0].representations[0].parameter.hierarchicalProperty[0].fieldName, "hierarchyProperty2", "HierarchyProperty can be changed after representation is created");
	});
	QUnit.test("serializeConfiguration minimal facet filter without requests", function(assert) {
		var facetFilter, facetFilterId;
		this.editor.setFilterOption({facetFilter : true});
		facetFilterId = this.editor.createFacetFilter();
		facetFilter = this.editor.getFacetFilter(facetFilterId);
		facetFilter.setLabelKey("labelKey");
		facetFilter.setProperty("property");
		facetFilter.setInvisible();
		var obj = this.configurationObjects.serializeConfiguration(this.editor);
		assert.equal(obj.facetFilters[0].valueHelpRequest, undefined, "No valueHelpRequest ID set");
		assert.equal(obj.facetFilters[0].filterResolutionRequest, undefined, "No filterResolutionRequest ID set");
		assert.equal(obj.requests.length, 0, "No request 'skeletons' created");
		assert.strictEqual(obj.facetFilters[0].invisible, true, 'Invisibility set');
		assert.strictEqual(obj.facetFilters[0].valueList, undefined, "valueList not set");
	});
	QUnit.test("serializeConfiguration filter option 'none'", function(assert) {
		this.editor.setFilterOption({none : true});
		var obj = this.configurationObjects.serializeConfiguration(this.editor);
		assert.strictEqual(obj.facetFilters, undefined, "Property facetFilters not contained in serializable object");
		assert.strictEqual(obj.smartFilterBar, undefined, "Property smartFilterBar not contained in serializable object");
	});
	QUnit.test("serializeConfiguration filter option 'facetFilter'", function(assert) {
		this.editor.setFilterOption({facetFilter : true});
		var obj = this.configurationObjects.serializeConfiguration(this.editor);
		assert.ok(jQuery.isArray(obj.facetFilters), "Property facetFilters is empty array");
	});
	QUnit.test("serializeConfiguration with complete smartFilterbar", function(assert) {
		var service = "/test/service";
		var entitySet = "entitySet";
		this.editor.setFilterOption({smartFilterBar : true});
		var smartFilterBar = this.editor.getSmartFilterBar();
		smartFilterBar.setService(service);
		smartFilterBar.setEntitySet(entitySet);
		var serializedObject = this.configurationObjects.serializeConfiguration(this.editor);
		assert.equal(serializedObject.smartFilterBar.id, "SmartFilterBar-1", "Static Id for SmartFilterBar retrieved");
		assert.equal(serializedObject.smartFilterBar.type, "smartFilterBar", "Type for SmartFilterBar retrieved");
		assert.equal(serializedObject.smartFilterBar.service, service, "Service from SmartFilterBar retrieved");
		assert.equal(serializedObject.smartFilterBar.entitySet, entitySet, "Entity Set from SmartFilterBar retrieved");
	});
	QUnit.test("serializeConfiguration with empty smartFilterbar", function(assert) {
		this.editor.setFilterOption({smartFilterBar : true});
		var serializedObject = this.configurationObjects.serializeConfiguration(this.editor);
		assert.equal(serializedObject.smartFilterBar.id, "SmartFilterBar-1", "Static Id for SmartFilterBar retrieved");
		assert.equal(serializedObject.smartFilterBar.type, "smartFilterBar", "Type for SmartFilterBar retrieved");
		assert.equal(serializedObject.smartFilterBar.service, undefined, "Undefined if empty SmartFilterBar");
		assert.equal(serializedObject.smartFilterBar.entitySet, undefined, "Undefined if empty SmartFilterBar");
	});
	QUnit.test("serializeConfiguration full facet filter", function(assert) {
		assert.expect(28);
		var facetFilter, facetFilterId, facetFilterTwo, facetFilterIdTwo;
		this.editor.setFilterOption({facetFilter : true});
		facetFilterId = this.editor.createFacetFilter();
		facetFilter = this.editor.getFacetFilter(facetFilterId);
		facetFilter.setUseSameRequestForValueHelpAndFilterResolution(false);
		facetFilter.setServiceOfValueHelp("serviceForValueHelp");
		facetFilter.setServiceOfFilterResolution("serviceForFilterResolution");
		facetFilter.setEntitySetOfValueHelp("entitySetForValueHelp");
		facetFilter.setEntitySetOfFilterResolution("entitySetForFilterResolution");
		facetFilter.addSelectPropertyOfValueHelp("selectPropertyForValueHelp1");
		facetFilter.addSelectPropertyOfValueHelp("selectPropertyForValueHelp2");
		facetFilter.addSelectPropertyOfFilterResolution("selectPropertyForFilterResolution3");
		facetFilter.addSelectPropertyOfFilterResolution("selectPropertyForFilterResolution4");
		facetFilter.setPreselectionFunction("preselectionFunction");
		facetFilter.setPreselectionDefaults([ "preselectionDefault1", "preselectionDefault2" ]);
		facetFilter.setValueList(["LValue1", "LValue2"]);
		facetFilter.setLabelKey("labelKey");
		facetFilter.setProperty("property");
		facetFilter.setAlias("alias");
		facetFilter.setMultiSelection(true);

		facetFilterIdTwo = this.editor.createFacetFilter();
		facetFilterTwo = this.editor.getFacetFilter(facetFilterIdTwo);
		facetFilterTwo.setValueList(["SecondFilterValue1", "SecondFilterValue2"]);
		facetFilterTwo.setNoneSelection(true);

		var obj = this.configurationObjects.serializeConfiguration(this.editor);
		assert.equal(this.configurationObjects.validateFacetFilter(obj.facetFilters[0]), true, "Validation of facet filter");
		assert.equal(obj.facetFilters[0].id, facetFilterId, "id serialized");
		assert.equal(obj.facetFilters[0].description, "labelKeyDescription", "assert.expect(ed description");
		assert.equal(obj.facetFilters[0].alias, "alias", "alias serialized");
		assert.equal(obj.facetFilters[0].property, "property", "property serialized");
		assert.equal(obj.facetFilters[0].hasAutomaticSelection, "false", "automatic selection serialized");
		assert.equal(obj.facetFilters[0].multiSelection, "true", "multiSelection serialized");
		assert.equal(obj.facetFilters[0].useSameRequestForValueHelpAndFilterResolution, "false", "useSameRequestForValueHelpAndFilterResolution serialized");
		assert.equal(obj.facetFilters[0].preselectionFunction, undefined, "preselectionFunction serialied to undefined");
		assert.deepEqual(obj.facetFilters[0].preselectionDefaults, [ "preselectionDefault1", "preselectionDefault2" ], "preselectionDefaults serialied");
		assert.strictEqual(obj.facetFilters[1].preselectionDefaults, null, "None option serialized as null value in preselectionDefaults");
		assert.deepEqual(obj.facetFilters[0].valueList, ["LValue1", "LValue2"], "valueList serialied");
		assert.equal(obj.facetFilters[0].label.key, "labelKey", "labelKey returned from double!");
		
		assert.deepEqual(obj.facetFilters[1].valueList, ["SecondFilterValue1", "SecondFilterValue2"], "ValueList is serialized. Serizalization of two facet filters possible.");
		// requests
		assert.equal(obj.facetFilters[0].valueHelpRequest, "ValueHelp-request-for-" + facetFilterId, "Value help request serialized");
		assert.equal(obj.facetFilters[0].filterResolutionRequest, "FilterResolution-request-for-" + facetFilterId, "Filter resolution request serialized");
		assert.equal(obj.facetFilters[0].valueHelpRequest, obj.requests[1].id, "valueHelpRequest corresponds to request");
		assert.equal(obj.facetFilters[0].filterResolutionRequest, obj.requests[0].id, "filterResolutionRequest corresponds to request");
		assert.deepEqual(obj.requests[1].selectProperties, [ "selectPropertyForValueHelp1", "selectPropertyForValueHelp2" ], "request.selectProperties serialized");
		assert.deepEqual(obj.requests[0].selectProperties, [ "selectPropertyForFilterResolution3", "selectPropertyForFilterResolution4" ], "request.selectProperties serialized");
		facetFilter.setPreselectionFunction("preselectionFunction");
		obj = this.configurationObjects.serializeConfiguration(this.editor);
		assert.equal(obj.facetFilters[0].preselectionFunction, "preselectionFunction", "preselectionFunction serialied");
		assert.deepEqual(obj.facetFilters[0].preselectionDefaults, [], "preselectionDefaults serialied");
		assert.equal(obj.facetFilters[0].hasAutomaticSelection, "false", "automatic selection serialied");
		facetFilter.setAutomaticSelection(true);
		obj = this.configurationObjects.serializeConfiguration(this.editor);
		assert.equal(obj.facetFilters[0].preselectionFunction, undefined, "preselectionFunction serialied");
		assert.deepEqual(obj.facetFilters[0].preselectionDefaults, [], "preselectionDefaults serialied");
		assert.equal(obj.facetFilters[0].hasAutomaticSelection, "true", "automatic selection serialied");
		facetFilter.setUseSameRequestForValueHelpAndFilterResolution(true);
		obj = this.configurationObjects.serializeConfiguration(this.editor);
		assert.equal(obj.facetFilters[0].useSameRequestForValueHelpAndFilterResolution, "true", "useSameRequestForValueHelpAndFilterResolution serialized");
		assert.equal(obj.facetFilters[0].valueHelpRequest, obj.facetFilters[0].filterResolutionRequest, "THEN same request is used for value help and filter resolution");
	});
	QUnit.test("serializeConfiguration for minimal navigation target", function(assert) {
		var navigationTarget;
		var navigationTargetId = this.editor.createNavigationTarget();
		navigationTarget = this.editor.getNavigationTarget(navigationTargetId);
		navigationTarget.setSemanticObject("SemanticObject01");
		navigationTarget.setAction("Action01");
		navigationTarget.setStepSpecific();
		navigationTarget.setUseDynamicParameters(true);
		var obj = this.configurationObjects.serializeConfiguration(this.editor);
		assert.equal(this.configurationObjects.validateNavigationTarget(obj.navigationTargets[0]), true, "Validation of navigation target");
		assert.equal(obj.navigationTargets[0].id, navigationTargetId, "id serialized");
		assert.equal(obj.navigationTargets[0].semanticObject, "SemanticObject01", "semanticObject serialized");
		assert.equal(obj.navigationTargets[0].action, "Action01", "action serialized");
		assert.equal(obj.navigationTargets[0].isStepSpecific, true, "stepSpecific serialized");
		assert.equal(obj.navigationTargets[0].useDynamicParameters, true, "useDynamicParameters serialized");
	});
	QUnit.test("serializeConfiguration for navigation target with titleKey", function(assert) {
		var navigationTarget;
		var navigationTargetId = this.editor.createNavigationTarget();
		navigationTarget = this.editor.getNavigationTarget(navigationTargetId);
		navigationTarget.setSemanticObject("SemanticObject01");
		navigationTarget.setAction("Action01");
		navigationTarget.setTitleKey("titleKey");
		var obj = this.configurationObjects.serializeConfiguration(this.editor);
		assert.deepEqual(obj.navigationTargets[0].title, {
			type: "label",
			kind: "text",
			key: "titleKey"
		}, "TitleKey serialized");
	});
	QUnit.test("serializeConfiguration for navigation target with filter mapping", function(assert) {
		var navigationTargetId = this.editor.createNavigationTarget();
		var navigationTarget = this.editor.getNavigationTarget(navigationTargetId);
		navigationTarget.setSemanticObject("SemanticObject01");
		navigationTarget.setAction("Action01");
		navigationTarget.setStepSpecific();
		var filterMappingService = "filterMappingService";
		var filterMappingEntitySet = "filterMappingEntitySet";
		var filterMappingTargetProperty1 = "filterMappingTargetProperty1";
		var filterMappingTargetProperty2 = "filterMappingTargetProperty2";
		navigationTarget.setFilterMappingService(filterMappingService);
		navigationTarget.setFilterMappingEntitySet(filterMappingEntitySet);
		navigationTarget.addFilterMappingTargetProperty(filterMappingTargetProperty1);
		navigationTarget.addFilterMappingTargetProperty(filterMappingTargetProperty2);
		navigationTarget.addNavigationParameter("key", "value");
		navigationTarget.addNavigationParameter("key2", "value2");
		var obj = this.configurationObjects.serializeConfiguration(this.editor);
		assert.equal(this.configurationObjects.validateNavigationTarget(obj.navigationTargets[0]), true, "Validation of navigation target");
		assert.equal(obj.navigationTargets[0].id, navigationTargetId, "id serialized");
		assert.equal(obj.navigationTargets.length, 1, "Right number of navigation targets");
		assert.equal(obj.requests.length, 1, "Right number of requests");
		assert.equal(obj.requests[0].service, "filterMappingService", "Filter mapping service exists");
		assert.equal(obj.requests[0].entitySet, "filterMappingEntitySet", "Filter mapping entity set exists");
		assert.deepEqual(obj.navigationTargets[0].filterMapping.target, [ filterMappingTargetProperty1, filterMappingTargetProperty2 ], "Filter mapping target properties are existing");
		assert.deepEqual(obj.navigationTargets[0].parameters, [{key: "key", value: "value"}, {key: "key2", value: "value2"}], "Navigation parameters serialized");
	});
	QUnit.test("serializeConfiguration request", function(assert) {
		var catId = this.editor.setCategory(this.template4CategoryCat); // at least one category is required for validity
		var stepId = this.editor.createStep(catId);
		var step = this.editor.getStep(stepId);
		step.setService("service");
		step.setEntitySet("entitySet");
		step.addSelectProperty("property");
		var obj = this.configurationObjects.serializeConfiguration(this.editor);
		assert.notEqual(obj.requests[0], undefined, "GIVEN step WHEN serializeConfiguration THEN step references request ");
		var request = obj.requests[0];
		var validate1 = this.configurationObjects.validateRequest(request);
		assert.equal(validate1, true, "GIVEN step WHEN serializeConfiguration THEN request validates");
		assert.equal(obj.requests[0].id, obj.steps[0].request, "GIVEN step WHEN serializeConfiguration THEN request is contained");
		assert.equal(obj.requests[0].selectProperties[0], "property", "GIVEN request WHEN serializeConfiguration THEN request has selectProperty");
		assert.equal(obj.requests[0].service, "service", "GIVEN request WHEN serializeConfiguration THEN request has service");
		assert.equal(obj.requests[0].entitySet, "entitySet", "GIVEN request WHEN serializeConfiguration THEN request has entitySet");
		assert.equal(this.configurationObjects.validateConfiguration(obj), true, " WHEN serializeConfiguration THEN result validates");
	});
	QUnit.test("serializeConfiguration binding", function(assert) {
		var catId = this.editor.setCategory(this.template4CategoryCat); // at least one category is required for validity
		var stepId = this.editor.createStep(catId);
		var step = this.editor.getStep(stepId);
		step.addFilterProperty("property");
		var obj = this.configurationObjects.serializeConfiguration(this.editor);
		assert.notEqual(obj.bindings[0], undefined, "GIVEN step WHEN serializeConfiguration THEN binding is contained");
		var validate1 = this.configurationObjects.validateBinding(obj.bindings[0]);
		assert.equal(validate1, true, "GIVEN step WHEN serializeConfiguration THEN binding validates");
		assert.equal(obj.bindings[0].id, obj.steps[0].binding, "GIVEN step WHEN serializeConfiguration THEN step references binding");
		assert.equal(obj.bindings[0].requiredFilters[0], "property", "GIVEN step.addFilterProperty WHEN serializeConfiguration THEN binding contains requiredFilter");
	});
	QUnit.test("serializeConfiguration binding: required filter with label key and label displayOption", function(assert) {
		var catId = this.editor.setCategory(this.template4CategoryCat); // at least one category is required for validity
		var stepId = this.editor.createStep(catId);
		var step = this.editor.getStep(stepId);
		step.addFilterProperty("property");
		step.setFilterPropertyLabelKey("FilterPropertyTextKey");
		step.setFilterPropertyLabelDisplayOption("Text");
		var obj = this.configurationObjects.serializeConfiguration(this.editor);
		assert.ok(obj.bindings[0].requiredFilterOptions, "Serialized binding has an object for requiredFilterOptions");
		assert.strictEqual(obj.bindings[0].requiredFilterOptions.labelDisplayOption, "Text","requiredFilterOptions has correcct labelDisplayOption");
		assert.ok(obj.bindings[0].requiredFilterOptions.fieldDesc, "requiredFilterOptions has object for fieldDesc");
		assert.strictEqual(obj.bindings[0].requiredFilterOptions.fieldDesc.type, "label","fieldDesc has correcct type");
		assert.strictEqual(obj.bindings[0].requiredFilterOptions.fieldDesc.kind, "text","fieldDesc has correcct kind");
		assert.strictEqual(obj.bindings[0].requiredFilterOptions.fieldDesc.key, "FilterPropertyTextKey","fieldDesc has correcct Key");
	});
	QUnit.test("serializeConfiguration representation", function(assert) {
		var catId = this.editor.setCategory(this.template4CategoryCat); // at least one category is required for validity
		var stepId = this.editor.createStep(catId);
		var step = this.editor.getStep(stepId);
		var representationOne = step.createRepresentation();
		representationOne.setRepresentationType('RepresentationTypeOne');
		representationOne.setAlternateRepresentationType('AlternateRepresentationTypeOne');
		representationOne.addDimension('OneDimPropOne');
		representationOne.addDimension('OneDimPropTwo');
		representationOne.setDimensionTextLabelKey('OneDimPropTwo', 'LabelKeyForOneDimPropTwo');
		representationOne.setLabelDisplayOption('OneDimPropOne', displayOptions.TEXT);
		representationOne.addMeasure('OneMeasurePropOne');
		representationOne.addMeasure('OneMeasurePropTwo');
		representationOne.setMeasureDisplayOption('OneMeasurePropOne', measureDisplayOptions.LINE);
		representationOne.addOrderbySpec(keyMara, false);
		representationOne.addOrderbySpec(keyHugo, true);
		representationOne.removeOrderbySpec(keyMara);
		representationOne.addProperty('PropertyOne');
		representationOne.setPropertyTextLabelKey('PropertyOne', 'PropertyTextLabelKey');
		representationOne.setPropertyKind('PropertyOne', 'PropertyKind');
		var representationTwo = step.createRepresentation();
		representationTwo.setRepresentationType('RepresentationTypeTwo');
		representationTwo.setAlternateRepresentationType('AlternateRepresentationTypeTwo');
		representationTwo.addDimension('TwoDimPropOne');
		representationTwo.setDimensionKind('TwoDimPropOne', kind42);
		representationTwo.addDimension('TwoDimPropTwo');
		representationTwo.addMeasure('TwoMeasurePropOne');
		representationTwo.setMeasureTextLabelKey('TwoMeasurePropOne', 'LabelKeyForTwoMeasurePropOne');
		var representationThree = step.createRepresentation();
		representationThree.addOrderbySpec(keyHugo, true);
		representationThree.addOrderbySpec(keyMara, false);
		representationThree.addOrderbySpec('eva', false);
		representationThree.addOrderbySpec('hans', false);
		representationThree.removeOrderbySpec('eva');
		var representationFour = step.createRepresentation();
		representationFour.addOrderbySpec(keyHugo, true);
		representationFour.addOrderbySpec(keyMara, false);
		representationFour.addOrderbySpec('eva', false);
		representationFour.addOrderbySpec('hans', false);
		representationFour.removeAllOrderbySpecs();
		var obj = this.configurationObjects.serializeConfiguration(this.editor);
		assert.equal(obj.bindings[0].representations[0].id, 'Step-1-Representation-1', 'Id "Step-1-Representation-1" of 1st representation');
		assert.equal(obj.bindings[0].representations[0].representationTypeId, 'RepresentationTypeOne', 'RepresentationTypeId of 1st representation');
		assert.equal(obj.bindings[0].representations[0].parameter.alternateRepresentationTypeId, 'AlternateRepresentationTypeOne', 'Alternate representation type id of 1st representation');
		assert.equal(obj.bindings[0].representations[0].parameter.dimensions[0].fieldName, 'OneDimPropOne', '1st dimension of 1st representation');
		assert.equal(obj.bindings[0].representations[0].parameter.dimensions[0].labelDisplayOption, displayOptions.TEXT, 'displayOption');
		assert.equal(obj.bindings[0].representations[0].parameter.dimensions[1].fieldName, 'OneDimPropTwo', '2nd dimension of 1st representation');
		assert.equal(obj.bindings[0].representations[0].parameter.dimensions[1].fieldDesc.type, 'label', 'Field descriptor type');
		assert.equal(obj.bindings[0].representations[0].parameter.dimensions[1].fieldDesc.kind, 'text', 'Field descriptor kind');
		assert.equal(obj.bindings[0].representations[0].parameter.dimensions[1].fieldDesc.key, 'LabelKeyForOneDimPropTwo', 'Field descriptor key');
		assert.equal(obj.bindings[0].representations[0].parameter.measures[0].fieldName, 'OneMeasurePropOne', '1st measure of 1st representation');
		assert.equal(obj.bindings[0].representations[0].parameter.measures[0].measureDisplayOption, 'line', '1st measuere has correct measure display option');
		assert.equal(obj.bindings[0].representations[0].parameter.measures[1].fieldName, 'OneMeasurePropTwo', '2nd measure of 1st representation');
		assert.ok(!obj.bindings[0].representations[0].parameter.sort, 'At this position the sort attribute did exist temporarily in an older software version: use the orderby information instead');
		assert.equal(obj.bindings[0].representations[0].parameter.orderby[0].property, keyHugo, 'WHEN addOrderbySpec THEN orderby list non-empty');
		assert.equal(obj.bindings[0].representations[0].parameter.orderby[0].ascending, true, 'WHEN addOrderbySpec THEN orderby list non-empty');
		assert.equal(obj.bindings[0].representations[0].parameter.properties[0].fieldName, 'PropertyOne', 'Property was serialized');
		assert.equal(obj.bindings[0].representations[0].parameter.properties[0].kind, 'PropertyKind', 'Property was serialized');
		assert.equal(obj.bindings[0].representations[0].parameter.properties[0].fieldDesc.type, 'label', 'Field descriptor type');
		assert.equal(obj.bindings[0].representations[0].parameter.properties[0].fieldDesc.kind, 'text', 'Field descriptor kind');
		assert.equal(obj.bindings[0].representations[0].parameter.properties[0].fieldDesc.key, 'PropertyTextLabelKey', 'Property was serialized');
		assert.equal(obj.bindings[0].representations[1].id, 'Step-1-Representation-2', 'Id "Step-1-Representation-2" of 2nd representation');
		assert.equal(obj.bindings[0].representations[1].representationTypeId, 'RepresentationTypeTwo', 'RepresentationTypeId of 2nd representation');
		assert.equal(obj.bindings[0].representations[1].parameter.alternateRepresentationTypeId, 'AlternateRepresentationTypeTwo', 'Alternate representation type id of 2nd representation');
		assert.equal(obj.bindings[0].representations[1].parameter.dimensions[0].fieldName, 'TwoDimPropOne', '1st dimension of 2nd representation');
		assert.equal(obj.bindings[0].representations[1].parameter.dimensions[0].kind, kind42, '1st dimension of 2nd representation is kind42');
		assert.equal(obj.bindings[0].representations[1].parameter.dimensions[1].fieldName, 'TwoDimPropTwo', '2nd dimension of 2nd representation');
		assert.equal(obj.bindings[0].representations[1].parameter.measures[0].fieldName, 'TwoMeasurePropOne', '1st measure of 1st representation');
		assert.equal(obj.bindings[0].representations[1].parameter.measures[0].fieldDesc.type, 'label', 'Field descriptor type');
		assert.equal(obj.bindings[0].representations[1].parameter.measures[0].fieldDesc.kind, 'text', 'Field descriptor kind');
		assert.equal(obj.bindings[0].representations[1].parameter.measures[0].fieldDesc.key, 'LabelKeyForTwoMeasurePropOne', 'Field descriptor key');
		assert.equal(obj.bindings[0].representations[2].parameter.orderby.length, 3, 'WHEN 4 addOrderbySpec and 1 removeOrderbySpec THEN orderby list size === 3');
		assert.equal(obj.bindings[0].representations[3].parameter.orderby, undefined, 'WHEN 4 addOrderbySpec and removeAllOrderbySpecs THEN orderby list is undefined');
	});
	QUnit.test("GIVEN step in editor WHEN serializeConfiguration THEN step is contained & valid", function(assert) {
		var factory = new sap.apf.modeler.core.ConfigurationObjects(this.inject);
		var catId = this.editor.setCategory(this.template4CategoryCat); // at least one category is required for validity
		var stepId = this.editor.createStep(catId);
		var step = this.editor.getStep(stepId);
		step.setTitleId("title");
		step.setLongTitleId("longTile");
		this.editor.setCategory(this.template4CategoryCat); // at least one category is required for validity
		var obj = factory.serializeConfiguration(this.editor);
		assert.equal(obj.steps[0].id, stepId, "the step");
		assert.equal(factory.validateStep(obj.steps[0]), true, "contained & valid");
	});
	QUnit.module("TopN", {
		beforeEach : function() {
			var textKeyCounter = 0;
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
			this.inject = {
				instances : {
					messageHandler : this.messageHandler,
					textPool : {
						getPersistentKey : function(id) {
							return id; //"persistentTextKey-" + (++textKeyCounter);
						},
						get : function(id) {
							return {
								TextElement : id,
								TextElementDescription : id + "Description"
							};
						}
					}
				}
			};
			this.template4CategoryCat = {
				labelKey : "textReference-cat"
			};
			this.editor = new sap.apf.modeler.core.ConfigurationEditor("apf1972-tempId", {
				instances : {
					messageHandler : this.messageHandler,
					persistenceProxy : new Empty(),
					configurationHandler : new ConfigHandler(),
					textPool : {
						getPersistentKey : function() {
							return "persistentTextKey-" + (++textKeyCounter);
						},
						get : function(id) {
							return {
								TextElement : id,
								TextElementDescription : id + "Description"
							};
						}
					}
				},
				constructors : {
					MetadataFactory : sap.apf.core.MetadataFactory,
					Hashtable : sap.apf.utils.Hashtable,
					Step : sap.apf.modeler.core.Step,
					ElementContainer : sap.apf.modeler.core.ElementContainer,
					Representation : sap.apf.modeler.core.Representation,
					ConfigurationObjects : sap.apf.modeler.core.ConfigurationObjects,
					FacetFilter : sap.apf.modeler.core.FacetFilter,
					NavigationTarget : sap.apf.modeler.core.NavigationTarget,
					SmartFilterBar : sap.apf.modeler.core.SmartFilterBar,
					ConfigurationFactory : function a() {
						return null;
					}
				}
			});
			this.editor.setApplicationTitle("appTitleTextKey");
			this.factory = new sap.apf.modeler.core.ConfigurationObjects(this.inject);
			this.catId = this.editor.setCategory(this.template4CategoryCat); // at least one category is required for validity
			this.stepId = this.editor.createStep(this.catId);
			this.step = this.editor.getStep(this.stepId);
			this.step.addSelectProperty('propertyName1');
			this.step.addSelectProperty('propertyName2');
			this.representation = this.step.createRepresentation();
			this.step.createRepresentation();
			this.representation.addOrderbySpec('initialProperty', false);
		}
	});
	QUnit.test("Set topN on step with 2 Representations", function(assert) {
		var orderBy = [ {
			property : "propertyName1",
			ascending : true
		}, {
			property : "propertyName2",
			ascending : false
		} ];
		this.step.setTopNValue(42);
		this.step.setTopNSortProperties(orderBy);
		var obj = this.factory.serializeConfiguration(this.editor);
		assert.deepEqual(obj.steps[0].topNSettings.top, 42, "THEN topN is serialized on step itself");
		assert.deepEqual(obj.steps[0].topNSettings.orderby, orderBy, "THEN orderby is serialized on step itself");
		assert.deepEqual(obj.bindings[0].representations[0].parameter.orderby, orderBy, "THEN orderby of representation 1 is fine");
		assert.equal(obj.bindings[0].representations[0].parameter.top, 42, "THEN topN of representation 1 is fine");
		assert.deepEqual(obj.bindings[0].representations[1].parameter.orderby, orderBy, "THEN orderby of representation 2 is fine");
		assert.equal(obj.bindings[0].representations[1].parameter.top, 42, "THEN topN of representation 2 is fine");
	});
	QUnit.test("Set topN on with ascending as string 'true'", function(assert) {
		var orderBy = [ {
			property : "propertyName1",
			ascending : "true"
		}];
		var expectedSerializedOrderBy = [{
			property: "propertyName1",
			ascending: true
		}];
		this.step.setTopNValue(42);
		this.step.setTopNSortProperties(orderBy);
		var obj = this.factory.serializeConfiguration(this.editor);
		assert.deepEqual(obj.steps[0].topNSettings.orderby, expectedSerializedOrderBy, "Orderby.ascending is serialized as boolean on step");
		assert.deepEqual(obj.bindings[0].representations[0].parameter.orderby, expectedSerializedOrderBy, "Orderby.ascending is serialized as boolean on representation");
	});
	QUnit.test("Set topN on step with 2 Representations and remove selectedProperty", function(assert) {
		var orderBy = [ {
			property : "propertyName1",
			ascending : true
		}, {
			property : "propertyName2",
			ascending : false
		} ];
		var expectOrder = [{
			property : "propertyName1",
			ascending : true
		}];
		this.step.setTopNValue(42);
		this.step.setTopNSortProperties(orderBy);
		this.step.removeSelectProperty('propertyName2');
		this.step.getTopN();
		var obj = this.factory.serializeConfiguration(this.editor);
		assert.deepEqual(obj.steps[0].topNSettings.top, 42, "THEN topN is serialized on step itself");
		assert.deepEqual(obj.steps[0].topNSettings.orderby, expectOrder, "THEN orderby is serialized on step itself");
		assert.deepEqual(obj.bindings[0].representations[0].parameter.orderby, expectOrder, "THEN orderby of representation 1 is fine");
		assert.equal(obj.bindings[0].representations[0].parameter.top, 42, "THEN topN of representation 1 is fine");
		assert.deepEqual(obj.bindings[0].representations[1].parameter.orderby, expectOrder, "THEN orderby of representation 2 is fine");
		assert.equal(obj.bindings[0].representations[1].parameter.top, 42, "THEN topN of representation 2 is fine");
	});
	QUnit.test("Reset topN on step with 2 Representations", function(assert) {
		var orderBy = [ {
			property : "propertyName1",
			ascending : true
		}, {
			property : "propertyName2",
			ascending : false
		} ];
		this.step.setTopNValue(42);
		this.step.setTopNSortProperties(orderBy);
		this.step.resetTopN();
		var obj = this.factory.serializeConfiguration(this.editor);
		assert.deepEqual(obj.steps[0].topNSettings, undefined, "THEN topN is not serialized on step ");
		assert.deepEqual(obj.bindings[0].representations[0].parameter.orderby, orderBy, "THEN orderby of representation 1 is fine");
		assert.equal(obj.bindings[0].representations[0].parameter.top, undefined, "THEN topN of representation 1 is fine");
		assert.deepEqual(obj.bindings[0].representations[1].parameter.orderby, orderBy, "THEN orderby of representation 2 is fine");
		assert.equal(obj.bindings[0].representations[1].parameter.top, undefined, "THEN topN of representation 2 is fine");
	});
	//------------------------------------------------------------
	QUnit.module("RegistryWrapper ", {
		beforeEach : function() {
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
			this.inject = {
				instances : {
					messageHandler : this.messageHandler
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable
				}
			};
		}
	});
	QUnit.test("ConfigurationFactory Registry", function(assert) {
		var that = this;
		var myProbe = function(registry) {
			that.registry = registry;
		};
		var inject = {
			instances : {
				messageHandler : this.inject.instances.messageHandler
			},
			constructors : {
				RegistryProbe : myProbe
			}
		};
		var factory = new sap.apf.core.ConfigurationFactory(inject);
		assert.notEqual(factory.getRegistry(), undefined, "WHEN Inject Registry Wrapper to ConfigurationFactory THEN getRegistry is defined");
		assert.equal(this.registry instanceof sap.apf.utils.Hashtable, true, "probe receives hashtable");
	});
	QUnit.test("GIVEN class RegistryWrapper - inject to ConfigurationFactory", function(assert) {
		var inject = {
			instances : {
				messageHandler : this.inject.instances.messageHandler
			},
			constructors : {
				RegistryProbe : sap.apf.modeler.core.RegistryWrapper
			}
		};
		var factory = new sap.apf.core.ConfigurationFactory(inject);
		assert.equal(factory.getRegistry() instanceof sap.apf.modeler.core.RegistryWrapper, true, "WHEN Inject Registry Wrapper to ConfigurationFactory THEN getRegistry is defined");
		assert.equal(typeof factory.getRegistry().getSteps(), 'object', "returns array");
		assert.equal(factory.getRegistry().getSteps().length, 0, "empty array");
		assert.equal(typeof factory.getRegistry().getCategories(), 'object', "returns array");
		assert.equal(factory.getRegistry().getCategories().length, 0, "empty array");
	});
	QUnit.test("test getItem .. GIVEN RegistryWrapper", function(assert) {
		var step = {
			type : "step",
			id : "step-4711"
		};
		var category = {
			type : "category",
			id : "cat-4711"
		};
		var hashtable = new sap.apf.utils.Hashtable(this.messageHandler);
		hashtable.setItem(step.id, step);
		hashtable.setItem(category.id, category);
		var registry = new sap.apf.modeler.core.RegistryWrapper(hashtable);
		var retrieved = registry.getItem(step.id);
		assert.notEqual(retrieved, undefined);
		assert.deepEqual(retrieved, step);
		assert.deepEqual(registry.getItem(category.id), category);
		assert.equal(registry.getSteps().length, 1, "registry exposes step");
		assert.equal(registry.getCategories().length, 1, "registry exposes step");
	});
	QUnit.test("getSteps with hierarchical step", function(assert) {
		var step = {
				type : "hierarchicalStep",
				id : "step-4711"
		};
		var hashtable = new sap.apf.utils.Hashtable(this.messageHandler);
		hashtable.setItem(step.id, step);
		var registry = new sap.apf.modeler.core.RegistryWrapper(hashtable);
		assert.equal(registry.getSteps().length, 1, "registry exposes also hierarchical steps");
	});
	QUnit.test('Get facetFilters returns indicator for empty facet filter array', function(assert) {
		var hashtable = new sap.apf.utils.Hashtable(this.messageHandler);
		hashtable.setItem(sap.apf.core.constants.existsEmptyFacetFilterArray, true);
		var registry = new sap.apf.modeler.core.RegistryWrapper(hashtable);
		assert.deepEqual(registry.getFacetFilters(), {emptyArray : true}, 'Indicator that facet filter config is emptry array');
	});
	//------------------------------------------------------------
	function commonProducer(){
		var that = this;
		this.categoryK747 = "category-747";
		this.labelKey747 = "textKey-4711";
		this.stepKey320 = "step-a320";
		this.hierarchicalStepKey320 = "hierarchicalStep-a320";
		this.stepKey330 = "step-a330";
		this.property310 = "property-a310";
		this.propertyFilter410 = "property-a410";
		this.service13 = "service-13";
		this.entitySet13 = "entitySet-13";
		this.titleId42 = "titleId42";
		this.longTitleId43 = "longTitleId43";
		this.facetFilterKey = "facetFilter-11";
		this.service11 = "service-11";
		this.navigationTargetKey = "navigationTarget-170630-FA";
		this.semanticObject = "SemanticObjectValue";
		this.action = "ActionValue";
		this.serviceForValueHelp = "serviceForValueHelp";
		this.serviceForFilterResolution = "serviceForFilterResolution";
		this.entitySet11 = "entitySet-11";
		this.entitySetForValueHelp = "entitySetForValueHelp";
		this.entitySetForFilterResolution = "entitySetForFilterResolution";
		this.alias11 = "alias-11";
		this.property11 = "prop11";
		this.selectPropertyForValueHelp1 = "selectPropertyForValueHelp1";
		this.selectPropertyForValueHelp2 = "selectPropertyForValueHelp2";
		this.selectPropertyForFilterResolution1 = "selectPropertyForFilterResolution1";
		this.selectPropertyForFilterResolution2 = "selectPropertyForFilterResolution2";
		this.preselectionDefaults = [ "preselectionDefault1", "preselectionDefault2" ];
		this.valueList = ["LValue1", "LValue2"];
		this.labelKey11 = "labelKey-1100";
		this.preselectionFunction11 = "preselectionFunction11";
		this.filterMappingService = "filterMappingService";
		this.filterMappingEntitySet = "filterMappingEntitySet";
		this.filterMappingTargetProperty1 = "filterMappingTargetProperty1";
		this.filterMappingTargetProperty2 = "filterMappingTargetProperty2";
		/* Simulate save and load with help of a second configuration editor, called producer 
		 */
		this.RegistryProducer = function() {
			var hash = new sap.apf.utils.Hashtable(that.messageHandler);
			var configuration = "";
			var producer = new sap.apf.modeler.core.ConfigurationEditor("apf1972-producer", that.editorInject);
			/**
			 * Use this method after setting up the configuration
			 */
			this.executeTheSerialization = function() {
				configuration = that.configurationObjects.serializeConfiguration(producer);
				configuration.steps.forEach(function(item) {
					hash.setItem(item.id, item);
				});
				if(configuration.facetFilters){
					configuration.facetFilters.forEach(function(item) {
						hash.setItem(item.id, item);
					});
				}
				configuration.categories.forEach(function(item) {
					hash.setItem(item.id, item);
				});
				configuration.requests.forEach(function(item) {
					hash.setItem(item.id, item);
				});
				configuration.bindings.forEach(function(item) {
					hash.setItem(item.id, item);
				});
				hash.setItem('applicationTitle', configuration.applicationTitle);
				if(configuration.smartFilterBar){
					hash.setItem(configuration.smartFilterBar.id, configuration.smartFilterBar);
				}
			};
			/** use this function to get a configuration editor for creating steps, categories and facetFilters.
			 * The created entities can be serialized using executeTheSerialization.
			 * Note, this editor is not connected to the tests.
			 */
			this.getProducingEditor = function() {
				return producer;
			};
			/**@protected*/
			this.getItem = function(key) {
				return hash.getItem(key);
			};
			this.getSteps = function() {
				return configuration.steps;
			};
			this.getCategories = function() {
				return configuration.categories;
			};
			this.getFacetFilters = function() {
				return configuration.facetFilters || []; //Immitate real RegistryWrapper behaviour
			};
			this.getNavigationTargets = function() { //Only for test purposes
				return configuration.navigationTargets;
			};
			this.getRequests = function() { //Only for test purposes
				return configuration.requests;
			};
			this.getBindings = function() { //Only for test purposes
				return configuration.bindings;
			};
			this.deleteProperties = function(){
				delete configuration.bindings[0].representations[0].parameter.properties;
			};
		};//ctor
		this.produceACompleteFacetFilter = function(producer, bUsePreselectFunction) {
			// facet filter setup
			producer.setFilterOption({facetFilter : true});
			var facetFilterId = producer.createFacetFilterWithId(that.facetFilterKey);
			var facetFilter = producer.getFacetFilter(facetFilterId);
			facetFilter.setUseSameRequestForValueHelpAndFilterResolution(false);
			facetFilter.setAlias(that.alias11);
			facetFilter.setProperty(that.property11);
			facetFilter.setMultiSelection(true);
			facetFilter.setLabelKey(that.labelKey11);
			if (bUsePreselectFunction) {
				facetFilter.setPreselectionFunction(that.preselectionFunction11);
			} else {
				facetFilter.setPreselectionDefaults(that.preselectionDefaults);
			}
			facetFilter.setValueList(that.valueList);
			// facet filter requests
			facetFilter.setServiceOfValueHelp(that.serviceForValueHelp);
			facetFilter.setServiceOfFilterResolution(that.serviceForFilterResolution);
			facetFilter.setEntitySetOfValueHelp(that.entitySetForValueHelp);
			facetFilter.setEntitySetOfFilterResolution(that.entitySetForFilterResolution);
			facetFilter.addSelectPropertyOfValueHelp(that.selectPropertyForValueHelp1);
			facetFilter.addSelectPropertyOfValueHelp(that.selectPropertyForValueHelp2);
			facetFilter.addSelectPropertyOfFilterResolution(that.selectPropertyForFilterResolution1);
			facetFilter.addSelectPropertyOfFilterResolution(that.selectPropertyForFilterResolution2);
		};
		this.produceAMinimalFacetFilter = function(producer) {
			producer.setFilterOption({facetFilter : true});
			var facetFilterId = producer.createFacetFilterWithId(that.facetFilterKey);
			var facetFilter = producer.getFacetFilter(facetFilterId);
			facetFilter.setProperty(that.property11);
			facetFilter.setLabelKey(that.labelKey11);
			facetFilter.setInvisible();
		};
		this.produceACompleteNavigationTarget = function(producer) {
			var navigationTargetId = producer.createNavigationTargetWithId(that.navigationTargetKey);
			var navigationTarget = producer.getNavigationTarget(navigationTargetId);
			navigationTarget.setSemanticObject(that.semanticObject);
			navigationTarget.setAction(that.action);
			navigationTarget.setStepSpecific();
			navigationTarget.setUseDynamicParameters(true);
			navigationTarget.setFilterMappingService(that.filterMappingService);
			navigationTarget.setFilterMappingEntitySet(that.filterMappingEntitySet);
			navigationTarget.addFilterMappingTargetProperty(that.filterMappingTargetProperty1);
			navigationTarget.addFilterMappingTargetProperty(that.filterMappingTargetProperty2);
			navigationTarget.addNavigationParameter("key", "value");
			navigationTarget.setTitleKey("NavigationTargetTitleKey");
		};
		this.produceStepWithTopN = function(producer, categoryId) {
			var orderBy = [ {
				property : "propertyName1",
				ascending : true
			}, {
				property : "propertyName2",
				ascending : false
			} ];
			var stepId = producer.createStepWithId(this.stepKey330);
			producer.addCategoryStepAssignment(categoryId, that.stepKey330);
			var step = producer.getStep(stepId);
			step.setTitleId(that.titleId42);
			step.setLongTitleId(that.longTitleId43);
			step.addSelectProperty('propertyName1');
			step.addSelectProperty('propertyName2');
			var representation = step.createRepresentation();
			representation.setRepresentationType('DummyRepresentationType');
			representation = step.createRepresentation();
			representation.setRepresentationType('DummyRepresentationType');
			step.setTopN(42, orderBy);
		};
		this.produceACompleteStep = function(producer, categoryId, optionalRepresentationId) {
			var representation;
			var stepId = producer.createStepWithId(that.stepKey320);
			producer.addCategoryStepAssignment(categoryId, that.stepKey320);
			var step = producer.getStep(stepId);
			step.setTitleId(that.titleId42);
			step.setLongTitleId(that.longTitleId43);
			step.setLeftLowerCornerTextKey('setLeftLowerCornerTextKey');
			step.setLeftUpperCornerTextKey('setLeftUpperCornerTextKey');
			step.setRightLowerCornerTextKey('setRightLowerCornerTextKey');
			step.setRightUpperCornerTextKey('setRightUpperCornerTextKey');
			// request begins here
			step.addSelectProperty(that.property310);
			step.setService(that.service13);
			step.setEntitySet(that.entitySet13);
			// binding begins here
			step.addFilterProperty(that.propertyFilter410);
			step.setFilterPropertyLabelDisplayOption("Text");
			step.setFilterPropertyLabelKey("FilterPropertyTextKey");
			if (optionalRepresentationId) {
				representation = step.createRepresentation({ id : optionalRepresentationId});
			} else {
				representation = step.createRepresentation();
			}
			representation.setRepresentationType('DummyRepresentationType');
			representation.setAlternateRepresentationType('AlternateRepresentationType');
			representation.addDimension('DimPropOne');
			representation.setDimensionTextLabelKey('DimPropOne', 'LabelKeyForDimPropOne');
			representation.addDimension('DimPropTwo');
			representation.setDimensionKind('DimPropTwo', kind42);
			representation.setLabelDisplayOption('DimPropTwo', displayOptions.TEXT);
			representation.addMeasure('MeasurePropOne');
			representation.setMeasureDisplayOption('MeasurePropOne', measureDisplayOptions.LINE);
			representation.setMeasureTextLabelKey('MeasurePropOne', 'LabelKeyForMeasurePropOne');
			representation.setMeasureKind('MeasurePropOne', kind33);
			representation.addMeasure('MeasurePropTwo');
			representation.setMeasureKind('MeasurePropTwo', kind42);
			representation.addProperty('PropertyOne');
			representation.setPropertyTextLabelKey('PropertyOne', 'PropertyLabelKey');
			representation.setPropertyKind('PropertyOne', 'PropertyKind');
			representation.setWidthProperty('name', 'adam');
			representation.setWidthProperty('more', 'eva');
			representation.addOrderbySpec(that.property11, true);
			representation.addOrderbySpec(that.propertyFilter410, false);
			representation.setLeftLowerCornerTextKey("setLeftLowerCornerTextKey");
			representation.setLeftUpperCornerTextKey("setLeftUpperCornerTextKey");
			representation.setRightLowerCornerTextKey("setRightLowerCornerTextKey");
			representation.setRightUpperCornerTextKey("setRightUpperCornerTextKey");
			var secondRepresentation = step.createRepresentation();
			secondRepresentation.setRepresentationType('SecondDummyRepresentationType');
			secondRepresentation.setAlternateRepresentationType('SecondAlternateRepresentationType');
			secondRepresentation.addDimension('SecondDimPropOne');
			step.setFilterMappingService("filterMappingService");
			step.setFilterMappingEntitySet("filterMappingEntitySet");
			step.addFilterMappingTargetProperty("filterMappingTargetProperty1");
			step.addFilterMappingTargetProperty("filterMappingTargetProperty2");
			step.setFilterMappingTargetPropertyLabelKey("labelKey");
			step.setFilterMappingTargetPropertyLabelDisplayOption("displayOption");
			step.setFilterMappingKeepSource(true);
			step.addNavigationTarget("navTarId1");
		};
		this.produceACompleteHierarchicalStep = function(producer, categoryId) {
			var stepId = producer.createHierarchicalStepWithId(that.hierarchicalStepKey320);
			producer.addCategoryStepAssignment(categoryId, that.stepKey320);
			var step = producer.getStep(stepId);
			step.setLongTitleId(that.longTitleId43);
			step.setHierarchyProperty("hierarchyProperty");
			var representation = step.createRepresentation();
			representation.setHierarchyPropertyTextLabelKey("textKey");
			representation.setHierarchyPropertyLabelDisplayOption("Text");
		};
		this.produceACompleteConfiguration = function(producer, optionalRepresentationId) {
			producer.setApplicationTitle('textKeyOfApplicationTitle');
			producer.createCategoryWithId({
				labelKey : that.labelKey747
			}, that.categoryK747);
			this.produceACompleteStep(producer, that.categoryK747, optionalRepresentationId);
			this.produceACompleteFacetFilter(producer);
			this.produceACompleteNavigationTarget(producer);
		};
	}
	QUnit.module("Map to design time", {
		beforeEach : function() {
			commonProducer.call(this);
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
			this.configurationObjects = new sap.apf.modeler.core.ConfigurationObjects({
				instances : {
					messageHandler : this.messageHandler,
					textPool : {
						getPersistentKey : function(key) {
							return key;
						},
						get : function(id) {
							return {
								TextElement : id,
								TextElementDescription : id + "Description"
							};
						}
					},
					metadataFactory : {
						getMetadata : function(service) {
							return jQuery.Deferred().resolve({
								getAllPropertiesOfEntitySet : function(entitySet) {
									if (entitySet === "myInvalidEntitySet") {
										return [];
									}
									return [ "property1", "property2" ];
								},
								getEntitySetByEntityType : function(entityType) {
									if (entityType === "entityType1") {
										return "entitySet1";
									} else if (entityType === "entityType2") {
										return "entitySet2";
									}
									return "";
								}
							});
						}
					}
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable
				}
			});
			this.editorInject = {
				instances : {
					messageHandler : this.messageHandler,
					persistenceProxy : new Empty(),
					configurationHandler : new ConfigHandler(),
					textPool : {
						getPersistentKey : function(key) {
							return key;
						}
					}
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable,
					Step : sap.apf.modeler.core.Step,
					HierarchicalStep : sap.apf.modeler.core.HierarchicalStep,
					SmartFilterBar : sap.apf.modeler.core.SmartFilterBar,
					FacetFilter : sap.apf.modeler.core.FacetFilter,
					NavigationTarget : sap.apf.modeler.core.NavigationTarget,
					ElementContainer : sap.apf.modeler.core.ElementContainer,
					Representation : sap.apf.modeler.core.Representation,
					ConfigurationObjects : sap.apf.modeler.core.ConfigurationObjects,
					ConfigurationFactory : Empty
				}
			};
			this.configurationEditor = new sap.apf.modeler.core.ConfigurationEditor("apf1972-tempId", this.editorInject);
			this.configurationEditor.registerServiceAsPromise = function(service) {
				
				return sap.apf.utils.createPromise(false);
			};
			this.registry = new this.RegistryProducer();
		}
	});
	QUnit.test("Application title", function(assert) {
		var done = assert.async();
		this.produceACompleteConfiguration(this.registry.getProducingEditor());
		this.registry.executeTheSerialization();
		assert.equal(this.configurationEditor.getApplicationTitle(), undefined, "application title not set");
		this.configurationObjects.mapToDesignTimeAsPromise(this.registry, this.configurationEditor).then(function() {
			assert.equal(this.configurationEditor.getApplicationTitle(), "textKeyOfApplicationTitle", "application title mapped to design time");
			done();
		}.bind(this));
	});
	QUnit.test("self test GIVEN producer with step", function(assert) {
		this.produceACompleteConfiguration(this.registry.getProducingEditor());
		this.registry.executeTheSerialization();
		assert.notEqual(this.registry.getSteps()[0], undefined, "THEN step exists");
		assert.notEqual(this.registry.getCategories()[0], undefined, "THEN category exists");
		assert.notEqual(this.registry.getRequests()[0], undefined, "THEN request exists");
		assert.notEqual(this.registry.getBindings()[0], undefined, "THEN binding exists");
		assert.equal(this.registry.getSteps()[0].id, this.stepKey320, "same id");
		assert.equal(this.registry.getCategories()[0].id, this.categoryK747, "same id");
		assert.equal(this.registry.getBindings()[0].id, "binding-for-" + this.stepKey320, "well formed id");
		assert.equal(this.registry.getRequests()[0].id, "request-for-" + this.stepKey320, "well formed id");
		assert.equal(this.registry.getItem(this.stepKey320).id, this.stepKey320, "same id");
		assert.equal(this.registry.getItem(this.categoryK747).id, this.categoryK747, "same id");
	});
	QUnit.test("GIVEN this. configurationEditor & filled registry", function(assert) {
		var done = assert.async();
		this.registry.getProducingEditor().setFilterOption({facetFilter : true});
		this.produceACompleteConfiguration(this.registry.getProducingEditor());
		this.registry.executeTheSerialization();
		assert.equal(this.configurationEditor.getCategories().length, 0, "configurationEditor supposedly empty :getCategories");
		assert.equal(this.configurationEditor.getSteps().length, 0, "configurationEditor supposedly empty :getSteps");
		assert.equal(this.configurationEditor.getFacetFilters().length, 0, "configurationEditor supposedly empty :getFacetFilters");
		assert.equal(this.configurationEditor.getNavigationTargets().length, 0, "configurationEditor supposedly empty :getNavigationTargets");
		this.configurationObjects.mapToDesignTimeAsPromise(this.registry, this.configurationEditor).then(function() {
			assert.notEqual(this.configurationEditor.getCategories().length, 0, "WHEN mapToDesignTime THEN configurationEditor non-empty :)");
			assert.notEqual(this.configurationEditor.getSteps().length, 0, "WHEN mapToDesignTime THEN configurationEditor non-empty :)");
			assert.notEqual(this.configurationEditor.getFacetFilters().length, 0, "WHEN mapToDesignTime THEN configurationEditor non-empty :)");
			assert.notEqual(this.configurationEditor.getNavigationTargets().length, 0, "WHEN mapToDesignTime THEN configurationEditor non-empty :)");
			assert.notEqual(this.configurationEditor.getCategoryStepAssignments(this.categoryK747).length, 0, "WHEN mapToDesignTime THEN configurationEditor non-empty :)");
			assert.notEqual(this.configurationEditor.getSteps()[0].getSelectProperties().length, 0, "WHEN mapToDesignTime THEN configurationEditor non-empty :)");
			assert.notEqual(this.configurationEditor.getSteps()[0].getFilterProperties().length, 0, "WHEN mapToDesignTime THEN configurationEditor non-empty :)");
			assert.notEqual(this.configurationEditor.getSteps()[0].getRepresentations().length, 0, "WHEN mapToDesignTime THEN configurationEditor non-empty :)");
			assert.notEqual(this.configurationEditor.getSteps()[0].getId(), undefined, "WHEN mapToDesignTime THEN configurationEditor contained 1 complete step");
			assert.notEqual(this.configurationEditor.getSteps()[0].getLongTitleId(), undefined, "WHEN mapToDesignTime THEN configurationEditor contained 1 complete step");
			assert.notEqual(this.configurationEditor.getSteps()[0].getService(), undefined, "WHEN mapToDesignTime THEN configurationEditor contained 1 complete step");
			assert.notEqual(this.configurationEditor.getSteps()[0].getTitleId(), undefined, "WHEN mapToDesignTime THEN configurationEditor contained 1 complete step");
			assert.equal(this.configurationEditor.getSteps()[0].getLeftLowerCornerTextKey(), 'setLeftLowerCornerTextKey', "WHEN mapToDesignTime THEN configurationEditor contained 1 complete step");
			assert.equal(this.configurationEditor.getSteps()[0].getLeftUpperCornerTextKey(), 'setLeftUpperCornerTextKey', "WHEN mapToDesignTime THEN configurationEditor contained 1 complete step");
			assert.equal(this.configurationEditor.getSteps()[0].getRightLowerCornerTextKey(), 'setRightLowerCornerTextKey', "WHEN mapToDesignTime THEN configurationEditor contained 1 complete step");
			assert.equal(this.configurationEditor.getSteps()[0].getRightUpperCornerTextKey(), 'setRightUpperCornerTextKey', "WHEN mapToDesignTime THEN configurationEditor contained 1 complete step");
			assert.deepEqual(this.configurationEditor.getSteps()[0].getNavigationTargets(), [ "navTarId1" ], "WHEN mapToDesignTime THEN configurationEditor contained 1 complete step");
			done();
		}.bind(this));
	});
	QUnit.test("GIVEN representation with predefined ID", function(assert){
		var done = assert.async();
		this.produceACompleteConfiguration(this.registry.getProducingEditor(), "representationId-99");
		this.registry.executeTheSerialization();
		this.configurationObjects.mapToDesignTimeAsPromise(this.registry, this.configurationEditor).then(function() {
			assert.strictEqual(this.configurationEditor.getSteps()[0].getRepresentations()[0].id, "representationId-99", "THEN representation id is preserved");
			done();
		}.bind(this));
	});
	QUnit.test("GIVEN registry with category", function(assert) {
		var done = assert.async();
		this.produceACompleteConfiguration(this.registry.getProducingEditor());
		this.registry.executeTheSerialization();
		assert.equal(this.configurationEditor.getCategories().length, 0, "configurationEditor supposedly empty :getCategories");
		assert.equal(this.configurationEditor.getSteps().length, 0, "configurationEditor supposedly empty :getSteps");
		assert.equal(this.configurationEditor.getFacetFilters().length, 0, "configurationEditor supposedly empty :getFacetFilters");
		this.configurationObjects.mapToDesignTimeAsPromise(this.registry, this.configurationEditor).then(function(){
			assert.equal(this.configurationEditor.getCategories()[0].getId(), this.categoryK747, "WHEN mapToDesignTime THEN category in editor under same ID");
			assert.equal(this.configurationEditor.getCategories()[0].labelKey, "textKey-4711", "WHEN mapToDesignTime THEN category in editor has correct labelKey");
			done();
		}.bind(this));
	});
	QUnit.test("Deserialize Step", function(assert) {
		var that = this;
		assert.expect(14);
		var done = assert.async();
		var producer = this.registry.getProducingEditor();
		producer.createCategoryWithId({
			labelKey : that.labelKey747
		}, that.categoryK747);
		this.produceACompleteStep(producer, that.categoryK747);
		this.registry.executeTheSerialization();
		this.configurationEditor.registerServiceAsPromise = function(service) {
			if(service === that.service13){
				assert.ok(true, "WHEN mapToDesignTimeAsPromise THEN registerService is called with the serialized service");
			} else if(service === "filterMappingService"){
				assert.ok(true, "WHEN mapToDesignTimeAsPromise THEN registerService is called with the filterMappingRequest");
			} else {
				assert.ok(false, "RegisterService should not be called with any other service");
			}
			return sap.apf.utils.createPromise(null);
		};
		this.configurationObjects.mapToDesignTimeAsPromise(this.registry, this.configurationEditor).then(function(){
			assert.notEqual(this.configurationEditor.getSteps()[0], undefined, "WHEN mapToDesignTime THEN step exists in editor");
			assert.equal(this.configurationEditor.getSteps()[0].getId(), this.registry.getSteps()[0].id, "WHEN mapToDesignTime THEN step in editor under same ID");
			assert.equal(this.configurationEditor.getSteps()[0].getService(), this.service13, "WHEN mapToDesignTime THEN request/service exists");
			assert.equal(this.configurationEditor.getSteps()[0].getEntitySet(), this.entitySet13, "WHEN mapToDesignTime THEN request/entitySet exists");
			assert.equal(this.configurationEditor.getSteps()[0].getSelectProperties()[0], this.property310, "WHEN mapToDesignTime THEN request/selectProperties exists");
			assert.equal(this.configurationEditor.getSteps()[0].getFilterProperties()[0], this.propertyFilter410, "FilterProperty mapped to design time");
			assert.equal(this.configurationEditor.getSteps()[0].getFilterPropertyLabelDisplayOption(), "Text", "FilterProperty LabelDisplayOption mapped to design time");
			assert.equal(this.configurationEditor.getSteps()[0].getFilterPropertyLabelKey(), "FilterPropertyTextKey", "FilterProperty Label Key mapped to design time");
			assert.equal(this.configurationEditor.getSteps()[0].getTitleId(), this.titleId42, "WHEN mapToDesignTime THEN title is set");
			assert.equal(this.configurationEditor.getSteps()[0].getLongTitleId(), this.longTitleId43, "WHEN mapToDesignTime THEN longTitle is set");
			assert.equal(this.configurationEditor.getCategoryStepAssignments(that.categoryK747).length, 1, "WHEN mapToDesignTime THEN 1 category step assignment transferred");
			assert.equal(this.configurationEditor.getCategoryStepAssignments(that.categoryK747)[0], that.stepKey320, "WHEN mapToDesignTime THEN getCategoryStepAssignments() returns step IDs and has correct id");
			done();
		}.bind(this));
	});
	QUnit.test("Deserialize representation without hierarchicalProperty (Backward compatibility)", function(assert) {
		var that = this;
		var done = assert.async();
		var producer = this.registry.getProducingEditor();
		producer.createCategoryWithId({
			labelKey : that.labelKey747
		}, that.categoryK747);
		this.produceACompleteStep(producer, that.categoryK747);
		this.registry.executeTheSerialization();
		delete this.registry.getBindings()[0].representations[0].parameter.hierarchicalProperty; // Old configurations
		this.configurationObjects.mapToDesignTimeAsPromise(this.registry, this.configurationEditor).then(function(){
			assert.equal(this.configurationEditor.getSteps()[0].getId(), this.registry.getSteps()[0].id, "Step deserialized successfully");
			assert.equal(this.configurationEditor.getSteps()[0].getRepresentations()[0].getId(), "step-a320-Representation-1", "Representation deserialized successfully");
			done();
		}.bind(this));
	});
	QUnit.test("GIVEN registry with hierarchical step and representation", function(assert) {
		var that = this;
		var done = assert.async();
		var producer = this.registry.getProducingEditor();
		producer.createCategoryWithId({
			labelKey : that.labelKey747
		}, that.categoryK747);
		this.produceACompleteHierarchicalStep(producer, that.categoryK747);
		this.registry.executeTheSerialization();
		this.configurationObjects.mapToDesignTimeAsPromise(this.registry, this.configurationEditor).then(function(){
			assert.notEqual(this.configurationEditor.getSteps()[0], undefined, "WHEN mapToDesignTime THEN step exists in editor");
			assert.equal(this.configurationEditor.getSteps()[0].getId(), this.registry.getSteps()[0].id, "WHEN mapToDesignTime THEN step in editor under same ID");
			assert.equal(this.configurationEditor.getSteps()[0].getType(), "hierarchicalStep", "HierarchicalStep is created");
			assert.equal(this.configurationEditor.getSteps()[0].getHierarchyProperty(), "hierarchyProperty", "HierarchyProeprty is deserialized");
			assert.equal(this.configurationEditor.getSteps()[0].getLongTitleId(), this.longTitleId43, "Normal step property is also deserialized");
			assert.equal(this.configurationEditor.getSteps()[0].getRepresentations()[0].getHierarchyProperty(), "hierarchyProperty", "HierarchyProperty is desrialized on representation");
			assert.equal(this.configurationEditor.getSteps()[0].getRepresentations()[0].getHierarchyPropertyTextLabelKey(), "textKey", "HierarchyPropertyTextKey is desrialized on representation");
			assert.equal(this.configurationEditor.getSteps()[0].getRepresentations()[0].getHierarchyPropertyLabelDisplayOption(), "Text", "HierarchyPropertyLabelDisplayOption is desrialized on representation");
			done();
		}.bind(this));
	});
	QUnit.test('Deserialize step with 2 representations and topN', function(assert) {
		var done = assert.async();
		var expectedOrderBySpecs = [ {
			property : "propertyName1",
			ascending : true
		}, {
			property : "propertyName2",
			ascending : false
		} ];
		var that = this;
		var producer = this.registry.getProducingEditor();
		producer.createCategoryWithId({
			labelKey : that.labelKey747
		}, that.categoryK747);
		this.produceStepWithTopN(producer, that.categoryK747);
		this.registry.executeTheSerialization();
		this.configurationObjects.mapToDesignTimeAsPromise(this.registry, this.configurationEditor).then(function(){
			assert.equal(this.configurationEditor.getSteps()[0].getTopN().top, 42, "WHEN mapToDesignTime  THEN top N counter has been deserialized");
			assert.deepEqual(this.configurationEditor.getSteps()[0].getTopN().orderby, expectedOrderBySpecs, "WHEN mapToDesignTime  THEN order by list of the top N has been deserialized");
			done();
		}.bind(this));
	});
	QUnit.test('Deserialize representation for step', function(assert) {
		var done = assert.async();
		var modelRepresentation, secondModelRepresentation;
		var producer = this.registry.getProducingEditor();
		producer.createCategoryWithId({
			labelKey : this.labelKey747
		}, this.categoryK747);
		this.produceACompleteStep(producer, this.categoryK747);
		this.registry.executeTheSerialization();
		this.configurationObjects.mapToDesignTimeAsPromise(this.registry, this.configurationEditor).then(function(){
			modelRepresentation = this.configurationEditor.getSteps()[0].getRepresentations()[0];
			secondModelRepresentation = this.configurationEditor.getSteps()[0].getRepresentations()[1];
			assert.equal(this.configurationEditor.getSteps()[0].getRepresentations().length, 2, 'Two representations assert.expect(ed');
			assert.equal(modelRepresentation.getRepresentationType(), 'DummyRepresentationType', 'Assigned representation type');
			assert.equal(modelRepresentation.getAlternateRepresentationType(), 'AlternateRepresentationType', 'Assigned alternative representation type');
			assert.equal(modelRepresentation.getDimensions().length, 2, 'Two dimension properties');
			assert.equal(modelRepresentation.getMeasures().length, 2, 'Two measure properties');
			assert.equal(modelRepresentation.getDimensionKind('DimPropTwo'), kind42, 'Kind set ');
			assert.equal(modelRepresentation.getDimensionTextLabelKey('DimPropOne'), 'LabelKeyForDimPropOne', 'Label key for dimension property');
			assert.equal(modelRepresentation.getLabelDisplayOption('DimPropOne'), undefined, 'undefined displayOption for dimension propertyOne');
			assert.equal(modelRepresentation.getLabelDisplayOption('DimPropTwo'), displayOptions.TEXT, 'Text as displayOption for dimension propertyTwo');
			assert.equal(modelRepresentation.getMeasureTextLabelKey('MeasurePropOne'), 'LabelKeyForMeasurePropOne', 'Label key for measure property');
			assert.equal(modelRepresentation.getMeasureKind('MeasurePropOne'), kind33, 'Kind set ');
			assert.equal(modelRepresentation.getMeasureKind('MeasurePropTwo'), kind42, 'Kind set ');
			assert.equal(modelRepresentation.getMeasureDisplayOption('MeasurePropOne'), measureDisplayOptions.LINE, 'Line as displayOption for measure propertyOne');
			assert.equal(modelRepresentation.getMeasureDisplayOption('MeasurePropTwo'), undefined, 'undefined as displayOption for measure propertyTwo');
			assert.equal(modelRepresentation.getProperties()[0], 'PropertyOne', 'Property set');
			assert.equal(modelRepresentation.getPropertyTextLabelKey('PropertyOne'), 'PropertyLabelKey', 'PropertyLabelKey is set');
			assert.equal(modelRepresentation.getPropertyKind('PropertyOne'), 'PropertyKind', 'PropertyKind is set');
			assert.equal(modelRepresentation.getWidthProperties().name, 'adam', "WHEN setWidthProperty THEN getWidthProperties returns object with set property");
			assert.equal(modelRepresentation.getWidthProperties().more, 'eva', "WHEN setWidthProperty THEN getWidthProperties returns object with set property");
			assert.equal(modelRepresentation.getOrderbySpecifications().length, 2, "WHEN addOrderbySpec THEN serialized list member increases");
			assert.equal(modelRepresentation.getOrderbySpecifications()[0].property, this.property11, "WHEN addOrderbySpec THEN serialized list has property");
			assert.equal(modelRepresentation.getOrderbySpecifications()[0].ascending, true, "WHEN addOrderbySpec THEN serialized list has ascending");
			assert.equal(modelRepresentation.getOrderbySpecifications()[1].property, this.propertyFilter410, "WHEN addOrderbySpec THEN serialized list has property");
			assert.equal(modelRepresentation.getOrderbySpecifications()[1].ascending, false, "WHEN addOrderbySpec THEN serialized list has ascending");
			assert.equal(modelRepresentation.getLeftLowerCornerTextKey(), "setLeftLowerCornerTextKey", "WHEN mapToDesignTime THEN configurationEditor contained 1 complete representation with LeftLower corner texts");
			assert.equal(modelRepresentation.getLeftUpperCornerTextKey(), "setLeftUpperCornerTextKey", "WHEN mapToDesignTime THEN configurationEditor contained 1 complete representation with LeftUpper corner texts");
			assert.equal(modelRepresentation.getRightLowerCornerTextKey(), "setRightLowerCornerTextKey", "WHEN mapToDesignTime THEN configurationEditor contained 1 complete representation with RightLower corner texts");
			assert.equal(modelRepresentation.getRightUpperCornerTextKey(), "setRightUpperCornerTextKey", "WHEN mapToDesignTime THEN configurationEditor contained 1 complete representation with RightUpper corner texts");
			assert.equal(secondModelRepresentation.getRepresentationType(), 'SecondDummyRepresentationType', 'Representation type assigned to 2nd representation');
			assert.equal(secondModelRepresentation.getAlternateRepresentationType(), 'SecondAlternateRepresentationType', 'Alternative representation type assigned to 2nd representation');
			assert.equal(secondModelRepresentation.getDimensions()[0], 'SecondDimPropOne', 'Dimension assigned to 2nd representation');
			assert.equal(secondModelRepresentation.getOrderbySpecifications().length, 0, "WHEN no addOrderbySpec THEN no serialized list ");

			done();
		}.bind(this));
		
	});
	QUnit.test('Deserialize representation without properties (old configuration)', function(assert) {
		var done = assert.async();
		var modelRepresentation;
		var producer = this.registry.getProducingEditor();
		producer.createCategoryWithId({
			labelKey : this.labelKey747
		}, this.categoryK747);
		this.produceACompleteStep(producer, this.categoryK747);
		this.registry.executeTheSerialization();
		this.registry.deleteProperties();
		this.configurationObjects.mapToDesignTimeAsPromise(this.registry, this.configurationEditor).then(function(){
			modelRepresentation = this.configurationEditor.getSteps()[0].getRepresentations()[0];
			assert.deepEqual(modelRepresentation.getProperties(), [], 'getProperties returns empty array');
			done();
		}.bind(this));
	});
	QUnit.test('Deserialize filter mapping', function(assert) {
		var done = assert.async();
		var producer = this.registry.getProducingEditor();
		producer.createCategoryWithId({
			labelKey : this.labelKey747
		}, this.categoryK747);
		this.produceACompleteStep(producer, this.categoryK747);
		this.registry.executeTheSerialization();
		this.configurationObjects.mapToDesignTimeAsPromise(this.registry, this.configurationEditor).then(function(){
			assert.equal(this.configurationEditor.getSteps()[0].getFilterMappingService(), "filterMappingService", "Correct filter mapping service returned");
			assert.equal(this.configurationEditor.getSteps()[0].getFilterMappingEntitySet(), "filterMappingEntitySet", "Correct filter mapping entity set returned");
			assert.deepEqual(this.configurationEditor.getSteps()[0].getFilterMappingTargetProperties(), [ "filterMappingTargetProperty1", "filterMappingTargetProperty2" ], "Correct filter mapping target properties returned");
			assert.equal(this.configurationEditor.getSteps()[0].getFilterMappingKeepSource(), true, "Correct value for keep source property returned");
			assert.strictEqual(this.configurationEditor.getSteps()[0].getFilterMappingTargetPropertyLabelKey(), "labelKey", "Correct label key returned");
			assert.strictEqual(this.configurationEditor.getSteps()[0].getFilterMappingTargetPropertyLabelDisplayOption(), "displayOption", "Correct label display option returned");
			done();
		}.bind(this));
	});
	QUnit.test("Deserialize SmartFilterBar", function(assert) {
		var done = assert.async();
		var service = "/test/service";
		var entitySet = "testEntitySet";
		var smartFilterBar = this.registry.getProducingEditor().getSmartFilterBar();
		smartFilterBar.setService(service);
		smartFilterBar.setEntitySet(entitySet);
		var spyOnRegisterServiceAsPromise = sinon.spy(this.configurationEditor, "registerServiceAsPromise");
		this.registry.executeTheSerialization();

		this.configurationObjects.mapToDesignTimeAsPromise(this.registry, this.configurationEditor).then(function(){
			var smartFilterBar = this.configurationEditor.getSmartFilterBar();
			assert.equal(smartFilterBar.getId(), "SmartFilterBar-1", "Id exists");
			assert.equal(smartFilterBar.getService(), service, "Service exists");
			assert.equal(smartFilterBar.getEntitySet(), entitySet, "Entity Set exists");
			assert.deepEqual(this.configurationEditor.getFilterOption(), {smartFilterBar : true}, "Filter option correctly determined");
			assert.equal(spyOnRegisterServiceAsPromise.calledOnce, true, "THEN service was registered");
			assert.equal(spyOnRegisterServiceAsPromise.calledWith("/test/service"), true, "THEN argument for service as expected");
			this.configurationEditor.registerServiceAsPromise.restore();
			done();
		}.bind(this));
	});
	QUnit.test("Deserialize empty SmartFilterBar", function(assert) {
		var done = assert.async();
		this.registry.getProducingEditor().setFilterOption({smartFilterBar : true});
		this.registry.executeTheSerialization();

		this.configurationObjects.mapToDesignTimeAsPromise(this.registry, this.configurationEditor).then(function(){
			var smartFilterBar = this.configurationEditor.getSmartFilterBar();
			assert.equal(smartFilterBar.getId(), "SmartFilterBar-1", "Id exists");
			assert.deepEqual(this.configurationEditor.getFilterOption(), {smartFilterBar : true}, "Filter option correctly determined");
			done();
		}.bind(this));
	});
	QUnit.test('Deserialize empty facet filter array', function(assert) {
		var done = assert.async();
		var registryWrapper;
		var registry = new sap.apf.utils.Hashtable(this.messageHandler);
		registry.setItem('applicationTitle', {});
		registry.setItem(sap.apf.core.constants.existsEmptyFacetFilterArray, true);
		registryWrapper = new sap.apf.modeler.core.RegistryWrapper(registry);
		
		this.configurationObjects.mapToDesignTimeAsPromise(registryWrapper, this.configurationEditor).then(function(){
			assert.deepEqual(this.configurationEditor.getFilterOption(), {facetFilter : true}, 'Right indicator for filter option returned');
			done();
		}.bind(this));
	});
	QUnit.test("Deserialize facet filter", function(assert) {
		assert.expect(18);
		var done = assert.async();
		this.registry.getProducingEditor().setFilterOption({facetFilter : true});
		this.produceACompleteFacetFilter(this.registry.getProducingEditor());
		this.registry.executeTheSerialization();
		var that = this;
		this.configurationEditor.registerServiceAsPromise = function(service) {
			assert.ok([ that.serviceForValueHelp, that.serviceForFilterResolution ].indexOf(service) >= 0, "WHEN mapToDesignTimeAsPromise THEN registerService is called with the serialized services");
			return sap.apf.utils.createPromise(false);
		};
		this.configurationObjects.mapToDesignTimeAsPromise(this.registry, this.configurationEditor).then(function(){
			var facetFilter = this.configurationEditor.getFacetFilters()[0];
			assert.ok(facetFilter, "Facet Filter exists");
			assert.equal(facetFilter.getProperty(), this.property11, "property exists");
			assert.equal(facetFilter.getAlias(), this.alias11, "alias exists");
			assert.ok(facetFilter.isMultiSelection(), "multi selection is true");
			assert.equal(facetFilter.getAutomaticSelection(), false, "no automatic selection");
			assert.equal(facetFilter.getPreselectionFunction(), undefined, "preselection function is reset");
			assert.deepEqual(facetFilter.getPreselectionDefaults(), this.preselectionDefaults, "preselection defaults exist");
			assert.deepEqual(facetFilter.getValueList(), this.valueList, "value list default exists");
			assert.equal(facetFilter.getUseSameRequestForValueHelpAndFilterResolution(), false, "Flag as assert.expect(ed");
			assert.equal(facetFilter.getServiceOfValueHelp(), this.serviceForValueHelp, "Service for Value help");
			assert.equal(facetFilter.getEntitySetOfValueHelp(), this.entitySetForValueHelp, "Entity set for Value help exists");
			assert.deepEqual(facetFilter.getSelectPropertiesOfValueHelp(), [ this.selectPropertyForValueHelp1, this.selectPropertyForValueHelp2 ], "Select properties for Value help exists");
			assert.equal(facetFilter.getServiceOfFilterResolution(), this.serviceForFilterResolution, "Service for filter resoulution exists");
			assert.equal(facetFilter.getEntitySetOfFilterResolution(), this.entitySetForFilterResolution, "Entity set for filter resolution exists");
			assert.deepEqual(facetFilter.getSelectPropertiesOfFilterResolution(), [ this.selectPropertyForFilterResolution1, this.selectPropertyForFilterResolution2 ], "Select properties for filter resolution exists");
			assert.deepEqual(this.configurationEditor.getFilterOption(), {facetFilter : true}, 'Right indicator for filter option returned');
			done();
		}.bind(this));
	});
	QUnit.test("Deserialize facet filter with preselection function", function(assert) {
		var done = assert.async();
		this.registry.getProducingEditor().setFilterOption({facetFilter : true});
		this.produceACompleteFacetFilter(this.registry.getProducingEditor(), true);
		this.registry.executeTheSerialization();
		this.configurationObjects.mapToDesignTimeAsPromise(this.registry, this.configurationEditor).then(function(){
			var facetFilter = this.configurationEditor.getFacetFilters()[0];
			assert.equal(facetFilter.getPreselectionFunction(), this.preselectionFunction11, "preselection function is set");
			assert.deepEqual(facetFilter.getPreselectionDefaults(), [], "preselection defaults are not set");
			done();
		}.bind(this));
	});
	QUnit.test("Deserialize minimal facet filter", function(assert) {
		var done = assert.async();
		this.registry.getProducingEditor().setFilterOption({facetFilter : true});
		this.produceAMinimalFacetFilter(this.registry.getProducingEditor());
		this.registry.executeTheSerialization();
		this.configurationObjects.mapToDesignTimeAsPromise(this.registry, this.configurationEditor).then(function(){
			var facetFilter = this.configurationEditor.getFacetFilters()[0];
			assert.ok(facetFilter, "Minimal facet filter without valueHelpRequest and filterResolutionRequest can be deserialized");
			assert.strictEqual(facetFilter.isVisible(), false, 'Minimal facet filter being set to invisible during setup correctly deserialized');
			assert.equal(facetFilter.getNoneSelection(), true, 'None selection set as default for minimal configuration');
			done();
		}.bind(this));
	});
	QUnit.test("Deserialize filter option 'none'", function(assert) {
		var done = assert.async();
		this.registry.getProducingEditor().setFilterOption({none : true});
		this.registry.executeTheSerialization();
		this.configurationObjects.mapToDesignTimeAsPromise(this.registry, this.configurationEditor).then(function(){
			assert.deepEqual(this.configurationEditor.getFilterOption(), {none : true}, 'Right indicator for filter option returned');
			done();
		}.bind(this));
	});
	QUnit.test("Deserialize navigation target", function(assert) {
		var done = assert.async();
		this.produceACompleteNavigationTarget(this.registry.getProducingEditor());
		this.registry.executeTheSerialization();
		this.configurationObjects.mapToDesignTimeAsPromise(this.registry, this.configurationEditor).then(function(){
			var navigationTarget = this.configurationEditor.getNavigationTargets()[0];
			assert.ok(navigationTarget, "Navigation Target exists");
			assert.equal(navigationTarget.getSemanticObject(), this.semanticObject, "semantic object exists");
			assert.equal(navigationTarget.getAction(), this.action, "action exists");
			assert.equal(navigationTarget.isStepSpecific(), true, "is step specific");
			assert.equal(navigationTarget.getUseDynamicParameters(), true, "use dynamic parameters");
			assert.equal(navigationTarget.getFilterMappingService(), this.filterMappingService, "getFilterMappingService() returns correct service");
			assert.equal(navigationTarget.getFilterMappingEntitySet(), this.filterMappingEntitySet, "getFilterMappingEntitySet() returns correct entity set");
			assert.deepEqual(navigationTarget.getFilterMappingTargetProperties(), [ this.filterMappingTargetProperty1, this.filterMappingTargetProperty2 ], "getFilterMappingTargetProperties() returns correct array of target properties");
			assert.deepEqual(navigationTarget.getAllNavigationParameters(), [{key: "key", value: "value"}], "NavigationParameter mapped to design time");
			assert.deepEqual(navigationTarget.getTitleKey(), "NavigationTargetTitleKey", "Title key is mapped to design time");
			done();
		}.bind(this));
	});
	QUnit.test("test deep assert.equal(ity of GIVEN step", function(assert) {
		var done = assert.async();
		var producer = this.registry.getProducingEditor();
		producer.createCategoryWithId({
			labelKey : this.labelKey747
		}, this.categoryK747);
		this.produceACompleteStep(producer, this.categoryK747);
		this.registry.executeTheSerialization();
		this.configurationObjects.mapToDesignTimeAsPromise(this.registry, this.configurationEditor).then(function(){
			var step = this.configurationObjects.serializeConfiguration(this.configurationEditor).steps[0];
			assert.deepEqual(step, this.registry.getSteps()[0], "WHEN mapToDesignTime THEN input and output step are deep assert.equal(");
			done();
		}.bind(this));
	});
	//------------------------------------------------------------
	QUnit.module("Serializable configuration object", {
		beforeEach : function() {
			commonProducer.call(this);
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
			this.configurationObjects = new sap.apf.modeler.core.ConfigurationObjects({
				instances : {
					messageHandler : this.messageHandler,
					textPool : {
						getPersistentKey : function(key) {
							return key;
						},
						get : function(id) {
							return {
								TextElement : id,
								TextElementDescription : id + "Description"
							};
						}
					}
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable,
					Step : sap.apf.modeler.core.Step,
					FacetFilter : sap.apf.modeler.core.FacetFilter,
					ElementContainer : sap.apf.modeler.core.ElementContainer,
					Representation : sap.apf.modeler.core.Representation
				}
			});
			this.editorInject = {
				instances : {
					messageHandler : this.messageHandler,
					persistenceProxy : new Empty(),
					configurationHandler : new ConfigHandler(),
					textPool : {
						getPersistentKey : function(key) {
							return key;
						}
					}
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable,
					Step : sap.apf.modeler.core.Step,
					HierarchicalStep : sap.apf.modeler.core.HierarchicalStep,
					SmartFilterBar : sap.apf.modeler.core.SmartFilterBar,
					FacetFilter : sap.apf.modeler.core.FacetFilter,
					NavigationTarget : sap.apf.modeler.core.NavigationTarget,
					ElementContainer : sap.apf.modeler.core.ElementContainer,
					Representation : sap.apf.modeler.core.Representation,
					ConfigurationObjects : sap.apf.modeler.core.ConfigurationObjects,
					ConfigurationFactory : Empty
				}
			};
			var producer = new sap.apf.modeler.core.ConfigurationEditor("apf1972-producer", this.editorInject);
			this.produceACompleteConfiguration(producer);
			this.configuration = this.configurationObjects.serializeConfiguration(producer);
		}
	});
	QUnit.test("GIVEN a serializable configuration object", function(assert) {
		assert.expect(1);
		var expectedResult = [  "textKeyOfApplicationTitle",
		                        "titleId42",
		                        "longTitleId43",
		                        "setLeftUpperCornerTextKey",
		                        "setLeftLowerCornerTextKey",
		                        "setRightUpperCornerTextKey",
		                        "setRightLowerCornerTextKey",
		                        "FilterPropertyTextKey",
		                        "LabelKeyForDimPropOne",
		                        "LabelKeyForMeasurePropOne",
		                        "PropertyLabelKey",
		                        "setLeftUpperCornerTextKey",
		                        "setLeftLowerCornerTextKey",
		                        "setRightUpperCornerTextKey",
		                        "setRightLowerCornerTextKey",
		                        "textKey-4711",
		                        "NavigationTargetTitleKey",
		                        "labelKey-1100"];
		var textKeys = sap.apf.modeler.core.ConfigurationObjects.getTextKeysFromConfiguration(this.configuration);
		assert.deepEqual(textKeys, expectedResult, "WHEN sap.apf.modeler.core.ConfigurationObjects.getTextKeysFromConfiguration() THEN the right text keys are returned");
	});
	QUnit.module("deepDataCopy", {});
	QUnit.test("WHEN deepDataCopy", function(assert) {
		var input = {
			obj1 : "hello",
			obj2 : {
				x : "1",
				copy : function() {
					return {
						y : "2"
					};
				}
			},
			obj3 : {
				x : "2"
			},
			obj4 : 0,
			obj5 : true,
			obj6 : undefined,
			obj7 : [ "Anton", "Hugo", "Berta" ],
			obj8 : {
				Barray : [ "Anton", "Berta", "Hugo" ],
				subobject : {
					x : 3,
					y : "34",
					c : true
				}
			}
		};
		var expected = {
			obj1 : "hello",
			obj2 : {
				y : "2"
			},
			obj3 : {
				x : "2"
			},
			obj4 : 0,
			obj5 : true,
			obj6 : undefined,
			obj7 : [ "Anton", "Hugo", "Berta" ],
			obj8 : {
				Barray : [ "Anton", "Berta", "Hugo" ],
				subobject : {
					x : 3,
					y : "34",
					c : true
				}
			}
		};
		var result = sap.apf.modeler.core.ConfigurationObjects.deepDataCopy(input);
		assert.deepEqual(result, expected, "Expected data is returned");
		assert.notEqual(input.obj3, expected.obj2, "New object instances returned by the deep copy for objects");
		assert.notEqual(input.obj7, expected.obj7, "New object instances returned by the deep copy for objects");
		assert.notEqual(input.obj8.Barray, expected.obj8.Barray, "New object instances returned by the deep copy for array sub objects");
		assert.notEqual(input.obj8.subobject, expected.obj8.subobject, "New object instances returned by the deep copy for sub objects");
		var func = function(a) {
			return a;
		};
		assert.equal(sap.apf.modeler.core.ConfigurationObjects.deepDataCopy(func), func, "Function attribute is tranferred directly to copy result");
	});
	QUnit.module("Texts", {
		beforeEach : function() {
			var that = this;
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
			this.inject = {
				instances : {
					messageHandler : this.messageHandler,
					persistenceProxy : {}
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable
				}
			};
			this.configurationObjects = new sap.apf.modeler.core.ConfigurationObjects(this.inject);
			this.returnWithError = false;
			this.configurationObjects.loadAllConfigurations = function(applicationId, callbackAfterLoad) {
				var resultValue = [ {
					a : "Any characteristic 1",
					b : "Any characteristic 2",
					c : "Any characteristic 3",
					SerializedAnalyticalConfiguration : JSON.stringify({
						ignore1 : "ignore",
						long1 : {
							type : "label",
							kind : "text",
							key : "key1"
						},
						long2 : {
							type : "label",
							kind : "text",
							key : "key2"
						},
						long3 : {
							type : "label",
							kind : "text",
							key : "key1"
						},
						long4 : {
							type : "label",
							kind : "text",
							key : "key1"
						}
					})
				}, {
					a : "Any characteristic 1",
					b : "Any characteristic 2",
					c : "Any characteristic 3",
					SerializedAnalyticalConfiguration : JSON.stringify({
						ignore1 : "ignore",
						long1 : {
							type : "label",
							kind : "text",
							key : "key0"
						},
						long3 : {
							type : "label",
							kind : "text",
							key : "key1"
						},
						long4 : {
							type : "label",
							kind : "text",
							key : "key3"
						},
						long5 : {
							type : "label",
							kind : "text",
							key : "key4"
						}
					})
				} ];
				if (that.returnWithError) {
					callbackAfterLoad(undefined, undefined, that.error);
					return;
				}
				that.calledApplication = applicationId;
				callbackAfterLoad(resultValue, undefined, undefined);
			};
			this.application = "AppA";
			this.error = {
				Error : "Error Object"
			};
		}
	});
	QUnit.test("WHEN getTextKeysFromAllConfigurations in case of normal processing", function(assert) {
		assert.expect(8);
		var that = this;
		this.configurationObjects.getTextKeysFromAllConfigurations(this.application, function(textKeys, messageObject) {
			assert.ok(!messageObject, "THEN no error object is returned");
			assert.equal(that.calledApplication, that.application, "THEN all configurations for the right application are loaded from the server");
			var keys = textKeys.getKeys();
			assert.equal(keys.length, 5, "THEN five text keys are returned");
			for(var i = 0; i < 5; i++) {
				assert.notEqual(keys.indexOf("key" + i), -1, "THEN key" + i + " is returned");
			}
		});
	});
	QUnit.test("WHEN getTextKeysFromAllConfigurations in case of error", function(assert) {
		assert.expect(2);
		var that = this;
		this.returnWithError = true;
		this.configurationObjects.getTextKeysFromAllConfigurations(this.application, function(textKeys, messageObject) {
			assert.equal(messageObject, that.error, "Then error is returned");
			assert.ok(!textKeys, "THEN no textKeys are returned");
		});
	});
}());