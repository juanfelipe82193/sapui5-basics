/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.modeler.ui.tStepSortProperty');
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.require('sap.apf.modeler.ui.utils.stepPropertyMetadataHandler');
(function() {
	'use strict';
	var spyFireEvent,
		spyOnConfigEditorSetIsUnsaved,
		spyOnParentStepSetTopN,
		oStepSortPropertyView,
		spyOnGetText,
		oModelerInstance,
		oStepPropertyMetadataHandler;

	function createPromise(){
		return new Promise(function(resolve){
			resolve();
		});
	}
	function _getSortProperties(bHasMultipleSortProperty) {
		var aProperties;
		if (bHasMultipleSortProperty === undefined) {
			aProperties = [ "property3" ];
		} else {
			aProperties = bHasMultipleSortProperty ? [ "property1", "property3" ] : [ "property1" ];
		}
		return aProperties;
	}
	var oModelForSortProperty = {
		"Objects" : [ {
			"key" : "property1",
			"name" : "property1"
		}, {
			"key" : "property3",
			"name" : "property3"
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
	function _placeViewAt(oStepSortPropertyView) {
		var divToPlaceStepSortProp = document.createElement("div");
		divToPlaceStepSortProp.setAttribute('id', 'contentOfFF');
		document.body.appendChild(divToPlaceStepSortProp);
		oStepSortPropertyView.placeAt("contentOfFF");
		sap.ui.getCore().applyChanges();
	}
	function _instantiateStepSortPropertyView(oParentObject, assert, bHasMultipleSortProperty) {
		var oPropertyTypeState = {
			getPropertyValueState : function() {
				var aProperties = _getSortProperties(bHasMultipleSortProperty);
				return aProperties;
			},
			indexOfPropertyTypeViewId : function() {
				return bHasMultipleSortProperty ? 1 : 0;
			}
		};
		var oPropertyTypeData = {
			sProperty : _getSortProperties(bHasMultipleSortProperty)[0],
			sContext : "Ascending"
		};
		var oPropertyOrchestration = {
			removePropertyTypeReference : function(){},
			updateAllSelectControlsForPropertyType: function(){
				return createPromise();
			}
		};
		var oStepSortPropertyController = new sap.ui.controller("sap.apf.modeler.ui.controller.stepSortPropertyType");
		var spyOnInit = sinon.spy(oStepSortPropertyController, "onInit");
		var setDetailDataSpy = sinon.spy(oStepSortPropertyController, "setDetailData");
		var disableViewSpy = sinon.spy(oStepSortPropertyController, "disableView");
		oStepSortPropertyView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.sortPropertyType",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oStepSortPropertyController,
			viewData : {
				oPropertyOrchestration: oPropertyOrchestration,
				oStepPropertyMetadataHandler : oStepPropertyMetadataHandler,
				oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
				oParentObject : oParentObject,
				oCoreApi : oModelerInstance.modelerCore,
				oPropertyTypeState : oPropertyTypeState,
				oPropertyTypeData : oPropertyTypeData
			}
		});
		oStepSortPropertyView.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
		assert.strictEqual(spyOnInit.calledOnce, true, "then Step Sort Property onInit function is called");
		assert.strictEqual(setDetailDataSpy.calledOnce, true, "then Step Sort Property setDetailData function is called");
		assert.strictEqual(disableViewSpy.calledOnce, true, "then Step Sort Property disableView function is called");
		return oStepSortPropertyView;
	}
	function _commonAssertsOnInitialization(assert, oStepSortPropertyView) {
		//view availability assert
		assert.ok(oStepSortPropertyView, "then Step Sort Property view is available");
		//getText asserts
		assert.strictEqual(spyOnGetText.called, true, "then getText function is called to set texts on UI");
		//sort property and sort direction label asserts
		assert.strictEqual(spyOnGetText.calledWith("sortingField"), true, "then label for sort field is set correctly");
		assert.strictEqual(spyOnGetText.calledWith("direction"), true, "then label for direction for sorting is set correctly");
		//Aria label and tooltip for add/delete button asserts
		assert.strictEqual(spyOnGetText.calledWith("ariaTextForAddIcon"), true, "then aria label for add button is set correctly");
		assert.strictEqual(spyOnGetText.calledWith("ariaTextForDeleteIcon"), true, "then aria label for delete button is set correctly");
		assert.strictEqual(spyOnGetText.calledWith("addButton"), true, "then tooltip for add button is set correctly");
		assert.strictEqual(spyOnGetText.calledWith("deleteButton"), true, "then tooltip for delete button is set correctly");
	}
	function _commonSpiesForTest() {
		oStepPropertyMetadataHandler = new sap.apf.modeler.ui.utils.StepPropertyMetadataHandler(oModelerInstance.modelerCore, oModelerInstance.unsavedStepWithoutFilterMapping);
		spyOnGetText = sinon.spy(oModelerInstance.modelerCore, "getText");
		spyOnParentStepSetTopN = sinon.spy(oModelerInstance.unsavedStepWithoutFilterMapping, "setTopNSortProperties");
		spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
	}
	function _commonCleanUpForAfterEach() {
		oModelerInstance.configurationEditorForUnsavedConfig.setIsUnsaved.restore();
		spyOnParentStepSetTopN.restore();
		spyOnGetText.restore();
		oStepSortPropertyView.destroy();
		sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
		oModelerInstance.reset();
	}
	QUnit.module("Sort property for step - One sort property", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesForTest();
				sinon.stub(oModelerInstance.unsavedStepWithoutFilterMapping, "getConsumablePropertiesForTopN", function() {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1", "property3" ],
						consumable : [ "property1", "property3" ]
					});
					return deferred.promise();
				});
				oStepSortPropertyView = _instantiateStepSortPropertyView(oModelerInstance.unsavedStepWithoutFilterMapping, assert, false);
				spyFireEvent = sinon.spy(oStepSortPropertyView, "fireEvent");
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpForAfterEach();
		}
	});
	QUnit.test("When step sort property view is initialized with one sort property", function(assert) {
		//common asserts
		_commonAssertsOnInitialization(assert, oStepSortPropertyView);
		//assert for the default sort property and sort direction
		assert.strictEqual(oStepSortPropertyView.byId("idSortProperty").getSelectedKey(), "property1", "then correct sort property is selected");
		assert.strictEqual(oStepSortPropertyView.byId("idSortDirection").getSelectedKey(), "true", "then correct sort direction is selected");
		//model for sort property and sort direction
		assert.deepEqual(oStepSortPropertyView.byId("idSortProperty").getModel().getData(), oModelForSortProperty, "then correct model for sort property is set");
		assert.deepEqual(oStepSortPropertyView.byId("idSortDirection").getModel().getData(), oModelForSortDirection, "then correct model for sort direction is set");
		//visibility for add/remove button
		assert.strictEqual(oStepSortPropertyView.byId("idAddPropertyIcon").getVisible(), true, "then add button is shown for the sort property row");
		assert.strictEqual(oStepSortPropertyView.byId("idRemovePropertyIcon").getVisible(), false, "then delete button is not shown for the only sort property row");
	});
	QUnit.test("When a sort row is added", function(assert) {
		//arrange
		var spyFireEventOnFocusOfAdd = sinon.spy(oStepSortPropertyView.byId("idAddPropertyIcon"), "fireEvent");
		//act
		oStepSortPropertyView.getController().handlePressOfAddPropertyIcon();
		_placeViewAt(oStepSortPropertyView);
		//assert
		assert.strictEqual(spyFireEvent.getCall(0).args[0], sap.apf.modeler.ui.utils.CONSTANTS.events.ADDPROPERTY, "then ADDPROPERTY is fired with correct first parameter when sort property is changed");
		assert.strictEqual(spyFireEvent.getCall(0).args[1].sProperty, "property1", "then ADDPROPERTY is fired with correct second parameter when sort property is changed");
		assert.strictEqual(spyFireEventOnFocusOfAdd.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.SETFOCUSONADDICON), true, "then SETFOCUSONADDICON event is fired");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set as unsaved");
	});
	QUnit.module("Sort property for step - Multiple sort properties", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				oModelerInstance.unsavedStepWithoutFilterMapping.setTopNSortProperties([ {
					property : "property3",
					ascending : true
				}, {
					property : "property1",
					ascending : false
				} ]);
				_commonSpiesForTest();
				sinon.stub(oModelerInstance.unsavedStepWithoutFilterMapping, "getConsumablePropertiesForTopN", function() {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1", "property3" ],
						consumable : []
					});
					return deferred.promise();
				});
				oStepSortPropertyView = _instantiateStepSortPropertyView(oModelerInstance.unsavedStepWithoutFilterMapping, assert, true);
				spyFireEvent = sinon.spy(oStepSortPropertyView, "fireEvent");
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpForAfterEach();
		}
	});
	QUnit.test("When step sort property view is initialized with multiple sort properties", function(assert) {
		var oModelForSortProperty = {
			"Objects" : [ {
				"key" : "property3",
				"name" : "property3"
			} ]
		};
		//common asserts
		_commonAssertsOnInitialization(assert, oStepSortPropertyView);
		//assert for the default sort property and sort direction
		assert.strictEqual(oStepSortPropertyView.byId("idSortProperty").getSelectedKey(), "property3", "then first property is selected as sort property");
		assert.strictEqual(oStepSortPropertyView.byId("idSortDirection").getSelectedKey(), "true", "then correct sort direction is selected");
		//model for sort property and sort direction
		assert.deepEqual(oStepSortPropertyView.byId("idSortProperty").getModel().getData(), oModelForSortProperty, "then correct model for second row of sort property is set");
		assert.deepEqual(oStepSortPropertyView.byId("idSortDirection").getModel().getData(), oModelForSortDirection, "then correct model for sort direction is set");
		//visibility for add/remove button
		assert.strictEqual(oStepSortPropertyView.byId("idAddPropertyIcon").getVisible(), true, "then add button is shown for the sort property row");
		assert.strictEqual(oStepSortPropertyView.byId("idRemovePropertyIcon").getVisible(), true, "then delete button is shown for the second sort property row");
	});
	QUnit.module("Sort property for step - When properties are not available", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesForTest();
				sinon.stub(oModelerInstance.unsavedStepWithoutFilterMapping, "getConsumablePropertiesForTopN", function() {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1" ],
						consumable : [ "property1" ]
					});
					return deferred.promise();
				});
				oStepSortPropertyView = _instantiateStepSortPropertyView(oModelerInstance.unsavedStepWithoutFilterMapping, assert);
				spyFireEvent = sinon.spy(oStepSortPropertyView, "fireEvent");
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpForAfterEach();
		}
	});
	QUnit.test("When step sort property view is initialized with unavailable sort properties", function(assert) {
		//common asserts
		_commonAssertsOnInitialization(assert, oStepSortPropertyView);
		//assert for the default sort property and sort direction
		assert.strictEqual(oStepSortPropertyView.byId("idSortProperty").getSelectedKey(), "Not Available: property3", "then selected sort property is marked as not available");
		assert.strictEqual(oStepSortPropertyView.byId("idSortDirection").getSelectedKey(), "true", "then correct sort direction is selected");
		//visibility for add/remove button
		assert.strictEqual(oStepSortPropertyView.byId("idAddPropertyIcon").getVisible(), true, "then add button is shown for the sort property row");
		assert.strictEqual(oStepSortPropertyView.byId("idRemovePropertyIcon").getVisible(), false, "then delete button is not shown for the only sort property row");
	});
	QUnit.module("Reduced Value help for step topN properties", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesForTest();
				sinon.stub(oModelerInstance.unsavedStepWithoutFilterMapping, "getConsumablePropertiesForTopN", function() {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1", "property3" ],
						consumable : [ "property1", "property3" ]
					});
					return deferred.promise();
				});
				oStepSortPropertyView = _instantiateStepSortPropertyView(oModelerInstance.unsavedStepWithoutFilterMapping, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpForAfterEach();
		}
	});
	QUnit.test("When no properties are used for topN", function(assert) {
		assert.strictEqual(oStepSortPropertyView.byId("idSortProperty").getSelectedKey(), "property3", "then value for topN property is set as property3");
		assert.deepEqual(oStepSortPropertyView.byId("idSortProperty").getModel().getData(), oModelForSortProperty, "then model for sort property type is set");
	});
	QUnit.module("Reduced Value help for step topN properties", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesForTest();
				sinon.stub(oModelerInstance.unsavedStepWithoutFilterMapping, "getConsumablePropertiesForTopN", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1", "property3" ],
						consumable : []
					});
					return deferred.promise();
				});
				oStepSortPropertyView = _instantiateStepSortPropertyView(oModelerInstance.unsavedStepWithoutFilterMapping, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpForAfterEach();
		}
	});
	QUnit.test("When all properties are already used in topN fields", function(assert) {
		assert.strictEqual(oStepSortPropertyView.byId("idSortProperty").getSelectedKey(), "property3", "then value for property type is set as property3");
		oModelForSortProperty = {
			"Objects" : [ {
				"key" : "property3",
				"name" : "property3"
			} ]
		};
		assert.deepEqual(oStepSortPropertyView.byId("idSortProperty").getModel().getData(), oModelForSortProperty, "then model for sort property type is set");
	});
	QUnit.module("Reduced Value help for step topN properties", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				_commonSpiesForTest();
				sinon.stub(oModelerInstance.unsavedStepWithoutFilterMapping, "getConsumablePropertiesForTopN", function(oRepId) {
					var deferred = jQuery.Deferred();
					deferred.resolve({
						available : [ "property1" ],
						consumable : [ "property1" ]
					});
					return deferred.promise();
				});
				oStepSortPropertyView = _instantiateStepSortPropertyView(oModelerInstance.unsavedStepWithoutFilterMapping, assert);
				done();
			});
		},
		afterEach : function() {
			_commonCleanUpForAfterEach();
		}
	});
	QUnit.test("When already selected property is not available in metadata", function(assert) {
		//assume property3 is not available in metadata
		oModelForSortProperty = {
			"Objects" : [ {
				"key" : "property1",
				"name" : "property1"
			}, {
				"key" : "Not Available: property3",
				"name" : "Not Available: property3"
			} ]
		};
		assert.strictEqual(oStepSortPropertyView.byId("idSortProperty").getSelectedKey(), "Not Available: property3", "then value for property type is set as NotAvailable:property3");
		assert.deepEqual(oStepSortPropertyView.byId("idSortProperty").getModel().getData(), oModelForSortProperty, "then model for sort property type is set");
	});
	QUnit.test("When already selected dimension is removed as a select property from step level", function(assert) {
		//assume property3 is removed as select property from step level
		oModelForSortProperty = {
			"Objects" : [ {
				"key" : "property1",
				"name" : "property1"
			}, {
				"key" : "Not Available: property3",
				"name" : "Not Available: property3"
			} ]
		};
		assert.strictEqual(oStepSortPropertyView.byId("idSortProperty").getSelectedKey(), "Not Available: property3", "then value for property type is set as NotAvailable:property3");
		assert.deepEqual(oStepSortPropertyView.byId("idSortProperty").getModel().getData(), oModelForSortProperty, "then model for sort property type is set");
	});

	QUnit.module("Given a stepSortPropertySortType controller", {
		beforeEach: function(assert){
			var that = this;
			that.sortInformationList = [];
			this.sortPropertyTypeController = new sap.ui.controller("sap.apf.modeler.ui.controller.stepSortPropertyType");
			var oPropertyOrchestration = {
				getSortPropertyInformationList : function(){
					return that.sortInformationList;
				}
			};
			var stubObj = {
				oParentObject : {
					setTopNSortProperties: function() {}
				},
				getView : function(){
					return {
						getViewData : function(){
							return {
								oPropertyOrchestration: oPropertyOrchestration
							};
						}
					};
				}
			};
			jQuery.extend(this.sortPropertyTypeController, stubObj);
			this.spies = {
				setTopNSortProperties: sinon.spy(this.sortPropertyTypeController.oParentObject, "setTopNSortProperties")
			};
		}
	});
	QUnit.test("When calling updateOfConfigurationObject", function(assert){
		// arrange
		this.sortInformationList = [];
		// act
		this.sortPropertyTypeController.updateOfConfigurationObject();
		// verify
		assert.strictEqual(this.spies.setTopNSortProperties.callCount, 1 , "Then top N sort properties are set");
		assert.strictEqual(this.spies.setTopNSortProperties.getCall(0).args[0], this.sortInformationList , "Then top N sort properties are set with expected parameter");
	});
}());