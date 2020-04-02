/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.tRepresentationSortProperty');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require('sap.apf.modeler.ui.utils.stepPropertyMetadataHandler');
sap.ui.define([
	"sap/apf/modeler/ui/utils/propertyTypeOrchestration"
], function(propertyTypeOrchestration) {
	'use strict';
	var spyOnConfigEditorSetIsUnsaved, spyOnParentStepRemoveAllOrderBy, spyOnParentStepRemoveOrderBy, spyOnParentStepAddOrderBy, spyFireEvent, oRepresentationSortPropertyView, spyOnGetText, oModelerInstance, oStepPropertyMetadataHandler;
	function _getSortProperties(bHasMultipleSortProperty) {
		var aProperties;
		if (bHasMultipleSortProperty === undefined) {
			aProperties = [ "property4" ];
		} else {
			aProperties = bHasMultipleSortProperty ? [ "property1", "property3" ] : [ "property4" ];
		}
		return aProperties;
	}
	function _placeViewAt(oRepresentationSortPropertyView) {
		var divToPlaceRepSortProp = document.createElement("div");
		divToPlaceRepSortProp.setAttribute('id', 'contentOfFF');
		document.body.appendChild(divToPlaceRepSortProp);
		oRepresentationSortPropertyView.placeAt("contentOfFF");
		sap.ui.getCore().applyChanges();
	}
	var oModelForSortProperty = {
		"Objects" : [ {
			"key" : "None",
			"name" : "None"
		}, {
			"key" : "property1",
			"name" : "property1"
		}, {
			"key" : "property4",
			"name" : "property4"
		} ]
	};
	var oModelForNotAvailableProperty = {
		"Objects" : [ {
			"key" : "None",
			"name" : "None"
		}, {
			"key" : "property1",
			"name" : "property1"
		}, {
			"key" : "property3",
			"name" : "property3"
		}, {
			"key" : "property1Text",
			"name" : "property1Text"
		}, {
			"key" : "Not Available: property4",
			"name" : "Not Available: property4"
		} ]
	};
	var oModelForSortDirection = {
		"Objects" : [ {
			"key" : "true",
			"name" : "Ascending"
		}, {
			"key" : "false",
			"name" : "Descending"
		} ]
	};
	function _instantiateRepresentationSortPropertyView(oParentStepObject, assert, bHasMultipleSortProperty) {
		var oPropertyTypeState = {
			getPropertyValueState : function() {
				var aProperties = _getSortProperties(bHasMultipleSortProperty);
				return aProperties;
			},
			indexOfPropertyTypeViewId : function() {
				return bHasMultipleSortProperty ? [ "property1" ] : 0;
			}
		};
		var oPropertyTypeData = {
			sProperty : _getSortProperties(bHasMultipleSortProperty)[0],
			sContext : "Ascending"
		};
		var oRepresentationSortPropertyController = new sap.ui.controller("sap.apf.modeler.ui.controller.representationSortPropertyType");
		var spyOnInit = sinon.spy(oRepresentationSortPropertyController, "onInit");
		var setDetailDataSpy = sinon.spy(oRepresentationSortPropertyController, "setDetailData");
		var disableViewSpy = sinon.spy(oRepresentationSortPropertyController, "disableView");
		var oPropertyOrchestration = new propertyTypeOrchestration.PropertyTypeOrchestration();
		propertyTypeOrchestration.getConsumableAndAvailablePropertiesAsPromise = function(){
			return new Promise(function(resolve) {
				resolve({
					available: ["Hugo", "Arno"],
					consumable: []
				});
			});
		};
		oRepresentationSortPropertyView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.sortPropertyType",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oRepresentationSortPropertyController,
			viewData : {
				oStepPropertyMetadataHandler : oStepPropertyMetadataHandler,
				oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
				oParentObject : oParentStepObject.getRepresentations()[0],
				oCoreApi : oModelerInstance.modelerCore,
				oPropertyTypeState : oPropertyTypeState,
				oPropertyTypeData : oPropertyTypeData,
				oPropertyOrchestration : oPropertyOrchestration
			}
		});
		oPropertyOrchestration.addPropertyTypeReference(oRepresentationSortPropertyView.getId(), {sProperty: "Hugo"}, "Any", oRepresentationSortPropertyView);
		oRepresentationSortPropertyView.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
		assert.strictEqual(spyOnInit.calledOnce, true, "then representation Sort Property onInit function is called and view is initialized");
		assert.strictEqual(setDetailDataSpy.calledOnce, true, "then representation Sort Property setDetailData function is called and view is initialized");
		assert.strictEqual(disableViewSpy.calledOnce, true, "then representation Sort Property disableView function is called");
		return oRepresentationSortPropertyView;
	}
	function _commonAssertsOnInitialization(assert, oRepresentationView, bIsSortVisible) {
		//view availability assert
		assert.ok(oRepresentationView, "then Representation Sort Property view is available");
		//getText asserts
		assert.strictEqual(spyOnGetText.called, true, "then getText function is called to set texts on UI");
		//sort property and sort direction label asserts
		assert.strictEqual(spyOnGetText.calledWith("sortingField"), true, "then label for sort field is set correctly");
		assert.strictEqual(spyOnGetText.calledWith("direction"), true, "then label for direction for sorting is set correctly");
		//Aria label for add/delete button asserts
		assert.strictEqual(spyOnGetText.calledWith("ariaTextForAddIcon"), true, "then aria label for add button is set correctly");
		assert.strictEqual(spyOnGetText.calledWith("ariaTextForDeleteIcon"), true, "then aria label for delete button is set correctly");
		assert.strictEqual(spyOnGetText.calledWith("addButton"), true, "then tooltip for add button is set correctly");
		assert.strictEqual(spyOnGetText.calledWith("deleteButton"), true, "then tooltip for delete button is set correctly");
		//assert for visibility of the control 
		assert.equal(oRepresentationView.byId("idSortProperty").getEnabled(), bIsSortVisible, "then sort property dropdown is enabled/disabled accordingly");
		assert.equal(oRepresentationView.byId("idSortDirection").getEnabled(), bIsSortVisible, "then sort direction dropdown is enabled/disabled accordingly");
	}
	function _commonSpiesForTest(oParentStepObject) {
		oStepPropertyMetadataHandler = new sap.apf.modeler.ui.utils.StepPropertyMetadataHandler(oModelerInstance.modelerCore, oParentStepObject);
		spyOnGetText = sinon.spy(oModelerInstance.modelerCore, "getText");
		spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
		spyOnParentStepRemoveOrderBy = sinon.spy(oModelerInstance.unsavedStepWithFilterMapping.getRepresentations()[0], "removeOrderbySpec");
		spyOnParentStepRemoveAllOrderBy = sinon.spy(oModelerInstance.unsavedStepWithFilterMapping.getRepresentations()[0], "removeAllOrderbySpecs");
		spyOnParentStepAddOrderBy = sinon.spy(oModelerInstance.unsavedStepWithFilterMapping.getRepresentations()[0], "addOrderbySpec");
	}
	function _commonCleanUpForAfterEach() {
		oModelerInstance.configurationEditorForUnsavedConfig.setIsUnsaved.restore();
		oModelerInstance.unsavedStepWithFilterMapping.getRepresentations()[0].removeOrderbySpec.restore();
		oModelerInstance.unsavedStepWithFilterMapping.getRepresentations()[0].removeAllOrderbySpecs.restore();
		oModelerInstance.unsavedStepWithFilterMapping.getRepresentations()[0].addOrderbySpec.restore();
		spyOnGetText.restore();
		sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		oModelerInstance.reset();
		oRepresentationSortPropertyView.destroy();
	}
	QUnit.module("Sort property for a Representation - one sort property and no top N available on the parent step", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesForTest(oModelerInstance.unsavedStepWithFilterMapping);
				sinon.stub(oModelerInstance.unsavedStepWithFilterMapping, "getConsumableSortPropertiesForRepresentation", function() {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1", "property4" ],
						consumable : [ "property1" ]
					});
					return deferred.promise();
				});
				oRepresentationSortPropertyView = _instantiateRepresentationSortPropertyView(oModelerInstance.unsavedStepWithFilterMapping, assert, false);
				spyFireEvent = sinon.spy(oRepresentationSortPropertyView, "fireEvent");
				done();
			});
		},
		afterEach : function() {
			oModelerInstance.unsavedStepWithFilterMapping.getConsumableSortPropertiesForRepresentation.restore();
			_commonCleanUpForAfterEach();
		}
	});
	QUnit.test("When Representation sort property view is initialized with one sort property", function(assert) {
		//common asserts
		_commonAssertsOnInitialization(assert, oRepresentationSortPropertyView, true);
		//assert for the default sort property and sort direction
		assert.strictEqual(oRepresentationSortPropertyView.byId("idSortProperty").getSelectedKey(), "property4", "then correct sort property is selected");
		assert.strictEqual(oRepresentationSortPropertyView.byId("idSortDirection").getSelectedKey(), "true", "then correct sort direction is selected");
		//model for sort property and sort direction
		assert.deepEqual(oRepresentationSortPropertyView.byId("idSortProperty").getModel().getData(), oModelForSortProperty, "then correct model for sort property is set");
		assert.deepEqual(oRepresentationSortPropertyView.byId("idSortDirection").getModel().getData(), oModelForSortDirection, "then correct model for sort direction is set");
		//visibility for add/remove button
		assert.strictEqual(oRepresentationSortPropertyView.byId("idAddPropertyIcon").getVisible(), true, "then add button is shown for the sort property row");
		assert.strictEqual(oRepresentationSortPropertyView.byId("idRemovePropertyIcon").getVisible(), false, "then delete button is not shown for the only sort property row");
	});
	QUnit.test("When a sort row is added", function(assert) {
		//arrange
		var spyFireEventOnFocusOfAdd = sinon.spy(oRepresentationSortPropertyView.byId("idAddPropertyIcon"), "fireEvent");
		//act 
		oRepresentationSortPropertyView.getController().handlePressOfAddPropertyIcon();
		_placeViewAt(oRepresentationSortPropertyView);
		//assert
		assert.strictEqual(spyFireEvent.getCall(0).args[0], sap.apf.modeler.ui.utils.CONSTANTS.events.ADDPROPERTY, "then ADDPROPERTY is fired with correct first parameter when sort property is changed");
		assert.strictEqual(spyFireEventOnFocusOfAdd.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.SETFOCUSONADDICON), true, "then SETFOCUSONADDICON event is fired");
		assert.strictEqual(spyFireEvent.getCall(0).args[1].sProperty, "property1", "then ADDPROPERTY is fired with correct second parameter when sort property is changed");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.callCount, 1, "then configuration editor is set as unsaved");
	});
	QUnit.test("When setNextPropertyInParentObject is invoked by pressing the add icon", function(assert) {
		//act
		oRepresentationSortPropertyView.getController().setNextPropertyInParentObject();
		//assert
		assert.strictEqual(oRepresentationSortPropertyView.byId("idSortDirection").getSelectedKey(), "true", "then Ascending is selected in the sort direction");
	});
	QUnit.test("When removePropertyFromParentObject is invoked", function(assert) {
		//act 
		oRepresentationSortPropertyView.getController().removePropertyFromParentObject();
		//assert
		assert.strictEqual(spyOnParentStepRemoveOrderBy.calledOnce, true, "then removeOrderbySpec is called on the representation");
	});
	QUnit.module("Sort property for a Representation - multiple sort properties", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesForTest(oModelerInstance.unsavedStepWithFilterMapping);
				sinon.stub(oModelerInstance.unsavedStepWithFilterMapping, "getConsumableSortPropertiesForRepresentation", function() {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1", "property4" ],
						consumable : [ "property1" ]
					});
					return deferred.promise();
				});
				oRepresentationSortPropertyView = _instantiateRepresentationSortPropertyView(oModelerInstance.unsavedStepWithFilterMapping, assert, true);
				spyFireEvent = sinon.spy(oRepresentationSortPropertyView, "fireEvent");
				done();
			});
		},
		afterEach : function() {
			oModelerInstance.unsavedStepWithFilterMapping.getConsumableSortPropertiesForRepresentation.restore();
			_commonCleanUpForAfterEach();
		}
	});
	QUnit.test("When Representation sort property view is initialized", function(assert) {
		//common asserts
		_commonAssertsOnInitialization(assert, oRepresentationSortPropertyView, true);
		//assert for the default sort property and sort direction
		assert.strictEqual(oRepresentationSortPropertyView.byId("idSortDirection").getSelectedKey(), "true", "then correct sort direction is selected");
		//model for sort property and sort direction
		assert.deepEqual(oRepresentationSortPropertyView.byId("idSortDirection").getModel().getData(), oModelForSortDirection, "then correct model for sort direction is set");
		//visibility for add/remove button
		assert.strictEqual(oRepresentationSortPropertyView.byId("idAddPropertyIcon").getVisible(), true, "then add button is shown for the sort property row");
		assert.strictEqual(oRepresentationSortPropertyView.byId("idRemovePropertyIcon").getVisible(), true, "then delete button is shown for the second sort property row");
	});
	QUnit.module("Sort property for a Representation - with top N available on the parent", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesForTest(oModelerInstance.unsavedStepWithoutFilterMapping);
				sinon.stub(oModelerInstance.unsavedStepWithoutFilterMapping, "getConsumableSortPropertiesForRepresentation", function() {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1", "property3", "property4" ],
						consumable : [ "property1", "property4" ]
					});
					return deferred.promise();
				});
				oRepresentationSortPropertyView = _instantiateRepresentationSortPropertyView(oModelerInstance.unsavedStepWithoutFilterMapping, assert, false);
				spyFireEvent = sinon.spy(oRepresentationSortPropertyView, "fireEvent");
				done();
			});
		},
		afterEach : function() {
			oModelerInstance.unsavedStepWithoutFilterMapping.getConsumableSortPropertiesForRepresentation.restore();
			_commonCleanUpForAfterEach();
		}
	});
	QUnit.test("When Representation sort property view is initialized - Top N available in the parent step", function(assert) {
		//common asserts
		_commonAssertsOnInitialization(assert, oRepresentationSortPropertyView, false);
		//model for sort property and sort direction
		assert.deepEqual(oRepresentationSortPropertyView.byId("idSortProperty").getModel().getData(), oModelForSortProperty, "then correct model for sort property is set");
		assert.deepEqual(oRepresentationSortPropertyView.byId("idSortDirection").getModel().getData(), oModelForSortDirection, "then correct model for sort direction is set");
		//visibility for add/remove button
		assert.strictEqual(oRepresentationSortPropertyView.byId("idAddPropertyIcon").getVisible(), false, "then add button is not visible");
		assert.strictEqual(oRepresentationSortPropertyView.byId("idRemovePropertyIcon").getVisible(), false, "then delete button is not visible");
	});
	QUnit.module("Sort property for representation - Validate previously selected values", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesForTest(oModelerInstance.unsavedStepWithFilterMapping);
				sinon.stub(oModelerInstance.unsavedStepWithFilterMapping, "getConsumableSortPropertiesForRepresentation", function() {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1", "property3", "property1Text" ],
						consumable : [ "property1", "property3", "property1Text" ]
					});
					return deferred.promise();
				});
				oRepresentationSortPropertyView = _instantiateRepresentationSortPropertyView(oModelerInstance.unsavedStepWithFilterMapping, assert);
				spyFireEvent = sinon.spy(oRepresentationSortPropertyView, "fireEvent");
				done();
			});
		},
		afterEach : function() {
			oModelerInstance.unsavedStepWithFilterMapping.getConsumableSortPropertiesForRepresentation.restore();
			_commonCleanUpForAfterEach();
		}
	});
	QUnit.test("When representation sort property view is initialized", function(assert) {
		//common asserts
		_commonAssertsOnInitialization(assert, oRepresentationSortPropertyView, true);
		//assert for the default sort property and sort direction
		assert.strictEqual(oRepresentationSortPropertyView.byId("idSortProperty").getSelectedKey(), "Not Available: property4", "then selected sort property is marked as not available ");
		assert.strictEqual(oRepresentationSortPropertyView.byId("idSortDirection").getSelectedKey(), "true", "then correct sort direction is selected");
		//model for sort property and sort direction
		assert.deepEqual(oRepresentationSortPropertyView.byId("idSortProperty").getModel().getData(), oModelForNotAvailableProperty, "then correct model for sort property is set");
		assert.deepEqual(oRepresentationSortPropertyView.byId("idSortDirection").getModel().getData(), oModelForSortDirection, "then correct model for sort direction is set");
		//visibility for add/remove button
		assert.strictEqual(oRepresentationSortPropertyView.byId("idAddPropertyIcon").getVisible(), true, "then add button is shown for the sort property row");
		assert.strictEqual(oRepresentationSortPropertyView.byId("idRemovePropertyIcon").getVisible(), false, "then delete button is not shown for the only sort property row");
	});
	QUnit.module("Reduced Value help for representation sort properties", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesForTest(oModelerInstance.unsavedStepWithFilterMapping);
				sinon.stub(oModelerInstance.unsavedStepWithFilterMapping, "getConsumableSortPropertiesForRepresentation", function() {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1", "property4" ],
						consumable : [ "property1", "property4" ]
					});
					return deferred.promise();
				});
				oRepresentationSortPropertyView = _instantiateRepresentationSortPropertyView(oModelerInstance.unsavedStepWithFilterMapping, assert);
				done();
			});
		},
		afterEach : function() {
			oModelerInstance.unsavedStepWithFilterMapping.getConsumableSortPropertiesForRepresentation.restore();
			_commonCleanUpForAfterEach();
		}
	});
	QUnit.test("When no properties are used for sort", function(assert) {
		assert.strictEqual(oRepresentationSortPropertyView.byId("idSortProperty").getSelectedKey(), "property4", "then value for sort property is set as property4");
		assert.deepEqual(oRepresentationSortPropertyView.byId("idSortProperty").getModel().getData(), oModelForSortProperty, "then model for sort property type is set");
	});
	QUnit.module("Reduced Value help for representation sort properties", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesForTest(oModelerInstance.unsavedStepWithFilterMapping);
				sinon.stub(oModelerInstance.unsavedStepWithFilterMapping, "getConsumableSortPropertiesForRepresentation", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1", "property4" ],
						consumable : []
					});
					return deferred.promise();
				});
				oRepresentationSortPropertyView = _instantiateRepresentationSortPropertyView(oModelerInstance.unsavedStepWithFilterMapping, assert);
				done();
			});
		},
		afterEach : function() {
			oModelerInstance.unsavedStepWithFilterMapping.getConsumableSortPropertiesForRepresentation.restore();
			_commonCleanUpForAfterEach();
		}
	});
	QUnit.test("When all properties are already used in representation sort fields", function(assert) {
		assert.strictEqual(oRepresentationSortPropertyView.byId("idSortProperty").getSelectedKey(), "property4", "then value for property type is set as property4");
		oModelForSortProperty = {
			"Objects" : [ {
				"key" : "None",
				"name" : "None"
			}, {
				"key" : "property4",
				"name" : "property4"
			} ]
		};
		assert.deepEqual(oRepresentationSortPropertyView.byId("idSortProperty").getModel().getData(), oModelForSortProperty, "then model for sort property type is set");
	});
	QUnit.module("Reduced Value help for representation sort properties", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesForTest(oModelerInstance.unsavedStepWithFilterMapping);
				sinon.stub(oModelerInstance.unsavedStepWithFilterMapping, "getConsumableSortPropertiesForRepresentation", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1" ],
						consumable : [ "property1" ]
					});
					return deferred.promise();
				});
				oRepresentationSortPropertyView = _instantiateRepresentationSortPropertyView(oModelerInstance.unsavedStepWithFilterMapping, assert);
				done();
			});
		},
		afterEach : function() {
			oModelerInstance.unsavedStepWithFilterMapping.getConsumableSortPropertiesForRepresentation.restore();
			_commonCleanUpForAfterEach();
		}
	});
	QUnit.test("When already selected property is not available in metadata", function(assert) {
		//assume property4 is not available in metadata
		oModelForSortProperty = {
			"Objects" : [ {
				"key" : "None",
				"name" : "None"
			}, {
				"key" : "property1",
				"name" : "property1"
			}, {
				"key" : "Not Available: property4",
				"name" : "Not Available: property4"
			} ]
		};
		assert.strictEqual(oRepresentationSortPropertyView.byId("idSortProperty").getSelectedKey(), "Not Available: property4", "then value for property type is set as NotAvailable:property4");
		assert.deepEqual(oRepresentationSortPropertyView.byId("idSortProperty").getModel().getData(), oModelForSortProperty, "then model for sort property type is set");
	});
	QUnit.test("When already selected dimension is removed as a select property from step level", function(assert) {
		//assume property4 is removed as select property from step level
		oModelForSortProperty = {
			"Objects" : [ {
				"key" : "None",
				"name" : "None"
			}, {
				"key" : "property1",
				"name" : "property1"
			}, {
				"key" : "Not Available: property4",
				"name" : "Not Available: property4"
			} ]
		};
		assert.strictEqual(oRepresentationSortPropertyView.byId("idSortProperty").getSelectedKey(), "Not Available: property4", "then value for property type is set as NotAvailable:property4");
		assert.deepEqual(oRepresentationSortPropertyView.byId("idSortProperty").getModel().getData(), oModelForSortProperty, "then model for sort property type is set");
	});
	function browserTestsCommonSetup(assert, browserName, browserVersion){
		var done = assert.async();
		if (browserVersion){
			sap.ui.Device.browser.version = browserVersion;
		}
		if (browserName === "ie"){
			sap.ui.Device.browser.msie = true;
		} else {
			sap.ui.Device.browser.msie = false;
		}
		sap.ui.Device.browser.name = browserName;
		oRepresentationSortPropertyView = _instantiateRepresentationSortPropertyView(oModelerInstance.unsavedStepWithFilterMapping, assert, false);
		oRepresentationSortPropertyView.loaded().then(function(){
			assert.strictEqual(oRepresentationSortPropertyView.byId("idSortPropertyTypeForm").getAriaLabelledBy()[0], oRepresentationSortPropertyView.byId("idAriaPropertyForSortGroup").getId(), "then sort property type form is labeled correctly");
			done();
		});
		return oRepresentationSortPropertyView;
	}
	QUnit.module("Browser specific functionality", {
		beforeEach : function(assert){
			var done = assert.async();
			this.oBrowserSettings = jQuery.extend(true, {}, sap.ui.Device.browser);
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesForTest(oModelerInstance.unsavedStepWithFilterMapping);
				sinon.stub(oModelerInstance.unsavedStepWithFilterMapping, "getConsumableSortPropertiesForRepresentation", function() {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1", "property4" ],
						consumable : [ "property1" ]
					});
					return deferred.promise();
				});
				done();
			});
		},
		afterEach : function(){
			sap.ui.Device.browser = this.oBrowserSettings;
			oModelerInstance.unsavedStepWithFilterMapping.getConsumableSortPropertiesForRepresentation.restore();
			_commonCleanUpForAfterEach();
		}
	});
	QUnit.test("When Sort Property view is initialized on Internet Explorer 11", function(assert) {
		var oRepSortPropertyView = browserTestsCommonSetup(assert,"ie", 11);
		assert.strictEqual(oRepSortPropertyView.byId("idAriaPropertyForSortGroup").getText(), "Sorting", "then text for aria label is set correctly");
	});
	QUnit.test("When Property view is initialized on Internet Explorer version below 11 (IE10)", function(assert) {
		var oRepSortPropertyView = browserTestsCommonSetup(assert,"ie", 10);
		assert.strictEqual(oRepSortPropertyView.byId("idAriaPropertyForSortGroup").getText(), "", "then text for aria label is not set");
	});
	QUnit.test("When Property view is initialized on Internet Explorer version below 11 (IE10.1)", function(assert) {
		var oRepSortPropertyView = browserTestsCommonSetup(assert,"ie", 10.1);
		assert.strictEqual(oRepSortPropertyView.byId("idAriaPropertyForSortGroup").getText(), "", "then text for aria label is not set");
	});
	QUnit.test("When Property view is initialized on Google Chrome", function(assert) {
		var oRepSortPropertyView = browserTestsCommonSetup(assert,"cr");
		assert.strictEqual(oRepSortPropertyView.byId("idAriaPropertyForSortGroup").getText(), "", "then text for aria label is not set");
	});
	QUnit.test("When Property view is initialized on Mozilla Firefox", function(assert) {
		var oRepSortPropertyView = browserTestsCommonSetup(assert,"ff");
		assert.strictEqual(oRepSortPropertyView.byId("idAriaPropertyForSortGroup").getText(), "", "then text for aria label is not set");
	});
	QUnit.test("When Property view is initialized on Edge Browser", function(assert) {
		var oRepSortPropertyView = browserTestsCommonSetup(assert,"ed");
		assert.strictEqual(oRepSortPropertyView.byId("idAriaPropertyForSortGroup").getText(), "", "then text for aria label is not set");
	});
	QUnit.test("When Property view is initialized on Safari", function(assert) {
		var oRepSortPropertyView = browserTestsCommonSetup(assert,"sf");
		assert.strictEqual(oRepSortPropertyView.byId("idAriaPropertyForSortGroup").getText(), "", "then text for aria label is not set");
	});
	QUnit.test("When Property view is initialized on Android Browser", function(assert) {
		var oRepSortPropertyView = browserTestsCommonSetup(assert,"an");
		assert.strictEqual(oRepSortPropertyView.byId("idAriaPropertyForSortGroup").getText(), "", "then text for aria label is not set");
	});

	QUnit.module("Given a RepresentationSortPropertySortType controller", {
		beforeEach: function(assert){
			var that = this;
			that.sortInformationList = [];
			this.sortPropertyTypeController = new sap.ui.controller("sap.apf.modeler.ui.controller.representationSortPropertyType");
			var oPropertyTypeOrchestration = {
				getSortPropertyInformationList : function(){
					return that.sortInformationList;
				}
			};
			var stubObj = {
				oParentObject : {
					addOrderbySpec: function() {},
					removeAllOrderbySpecs: function() {}
				},
				getView : function(){
					return {
						getViewData : function(){
							return {
								oPropertyOrchestration: oPropertyTypeOrchestration
							};
						}
					};
				}
			};
			jQuery.extend(this.sortPropertyTypeController, stubObj);
			this.spies = {
				addOrderbySpec: sinon.spy(this.sortPropertyTypeController.oParentObject, "addOrderbySpec"),
				removeAllOrderbySpecs: sinon.spy(this.sortPropertyTypeController.oParentObject, "removeAllOrderbySpecs")
			};
		}
	});
	QUnit.test("When calling updateOfConfigurationObject", function(assert){
		// arrange
		this.sortInformationList = [];
		// act
		this.sortPropertyTypeController.updateOfConfigurationObject();
		// verify
		assert.strictEqual(this.spies.removeAllOrderbySpecs.callCount, 1 , "Then the order by specs are removed");
		assert.strictEqual(this.spies.addOrderbySpec.callCount, 0 , "And no orderBy specs are added");
	});
	QUnit.test("When calling updateOfConfigurationObject", function(assert){
		// arrange
		var reference2property = {};
		var reference2ascending = {};
		this.sortInformationList = [{property : reference2property, ascending : reference2ascending}];
		// act
		this.sortPropertyTypeController.updateOfConfigurationObject();
		// verify
		assert.strictEqual(this.spies.removeAllOrderbySpecs.callCount, 1 , "Then the order by specs are removed");
		assert.strictEqual(this.spies.addOrderbySpec.callCount, 1 , "And no orderBy specs are added");
		assert.strictEqual(this.spies.addOrderbySpec.getCall(0).args[0], reference2property, "And property is handed over correctly");
		assert.strictEqual(this.spies.addOrderbySpec.getCall(0).args[1], reference2ascending, "And ascending is handed over correctly");
	});
});