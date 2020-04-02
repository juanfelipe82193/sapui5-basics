/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */

sap.ui.define([
	'sap/apf/modeler/ui/utils/propertyTypeOrchestration',
	'sap/apf/modeler/ui/controller/propertyType',
	'sap/apf/modeler/ui/utils/constants'
], function (propertyTypeOrchestrationModule, propertyType, oModelerConstants) {
	'use strict';

	function createPromise(){
		return new Promise(function(resolve){
			resolve();
		});
	}

	QUnit.module('Given instance of PropertyType', {
		beforeEach: function() {
			var that = this;
			this.oDropDownView = {
				getItems: function() {
					return [1, 2, 3]; // return the key/value-pairs describing the properties to be deleted
				},
				removeItem: function() {
				}, // do nothing
				addItem: function() {
				}, // do nothing
				setSelectedKey: function() {
				} // do nothing
			};
			this.oPropertyTypeController = new sap.ui.controller('sap.apf.modeler.ui.controller.propertyType');
			this.oPropertyTypeController.byId = function() { // stub
				return that.oDropDownView;
			};
			this.oPropertyTypeController.oTextReader = function() {
				return 'None'; // could also be not-available
			};
			this.availableProperties = ['1', '2', '3', '4'];
			this.consumableProperties = ['1', '2', '3', '4'];
			this.prefixFromTextReader = this.oPropertyTypeController.oTextReader() + ": ";
			this.spy = {
				removeItems: sinon.spy(this.oDropDownView, 'removeItem'),
				addItem: sinon.spy(this.oDropDownView, 'addItem'),
				setSelectedKey: sinon.spy(this.oDropDownView, 'setSelectedKey')
			};
		},
		afterEach: function() {
		}
	});
	QUnit.test('When removeAllItemsFromDropDownList', function(assert) {
		// Act
		this.oPropertyTypeController.removeAllItemsFromDropDownList();
		// Verify
		assert.strictEqual(this.spy.removeItems.callCount, this.oDropDownView.getItems().length, 'Then remove all Items');
	});
	QUnit.test('Given setItemsOfDropDownList: When selected key is not existing in the list of properties to be added to the drop down', function(assert) {
		// Arrange
		var consumableProperties = [];
		var availableProperties = ['1', '2'];
		var selectedProperty = '1';
		var isMandatory = true;
		var aggregationRole = oModelerConstants.aggregationRoles.DIMENSION;
		var expectedItemsInDropDown = [selectedProperty].concat(consumableProperties);
		// Act
		this.oPropertyTypeController.setItemsOfDropDownList(consumableProperties, availableProperties, selectedProperty, isMandatory, aggregationRole);
		// Verify
		_assertItemsOfDropDown(assert, this, expectedItemsInDropDown);
		assert.ok(true, 'Then the selected key is added to the list of properties to be added to the drop down');
	});
	QUnit.test('Given setItemsOfDropDownList: When selected key is not existing in the list of properties to be added to the drop down', function(assert) {
		// Arrange
		var consumableProperties = ['2'];
		var availableProperties = ['1', '2'];
		var selectedProperty = '1';
		var isMandatory = true;
		var aggregationRole = oModelerConstants.aggregationRoles.DIMENSION;
		var expectedItemsInDropDown = [selectedProperty].concat(consumableProperties);
		// Act
		this.oPropertyTypeController.setItemsOfDropDownList(consumableProperties, availableProperties, selectedProperty, isMandatory, aggregationRole);
		// Verify
		_assertItemsOfDropDown(assert, this, expectedItemsInDropDown);
		assert.ok(true, 'Then the selected key is added to the list of properties to be added to the drop down');
	});
	QUnit.test('Given setItemsOfDropDownList: When selected key is not existing in the list of properties to be added to the drop down', function(assert) {
		// Arrange
		var consumableProperties = [];
		var availableProperties = ['1', '2'];
		var selectedProperty = '1';
		var isMandatory = true;
		var aggregationRole = oModelerConstants.aggregationRoles.MEASURE;
		var expectedItemsInDropDown = availableProperties;
		// Act
		this.oPropertyTypeController.setItemsOfDropDownList(consumableProperties, availableProperties, selectedProperty, isMandatory, aggregationRole);
		// Verify
		_assertItemsOfDropDown(assert, this, expectedItemsInDropDown);
		assert.ok(true, 'Then the selected key is added to the list of properties to be added to the drop down');
	});

	function _assertItemsOfDropDown(assert, context, expectedItemsInDropDown) {
		context.spy.addItem.getCalls().forEach(function(singleCall, index) {
			assert.strictEqual(singleCall.args[0].getKey(), expectedItemsInDropDown[index], 'Then the property is added to drop down as expected');
		});
	}

	function _commonAssertsForSetItemsOfDropDownList(assert, context, setupSpec, testSpec) {
		context.oPropertyTypeController.setItemsOfDropDownList(context.consumableProperties, context.availableProperties, setupSpec.selectedProperty, setupSpec.bMandatory, setupSpec.aggregationRole);
		assert.strictEqual(context.spy.addItem.callCount, testSpec.addItem.callCount, 'Then addItem is called for the selected key and for all list members');
		assert.strictEqual(context.spy.addItem.getCall(0).args[0].getKey(), testSpec.addItem.firstItem, 'Then the first item in the list is added as expected');
		assert.strictEqual(context.spy.setSelectedKey.callCount, 1, 'Then setSelectedKey is called only once');
		assert.strictEqual(context.spy.setSelectedKey.getCall(0).args[0], testSpec.setSelectedKey.selectedProperty, 'Then setSelectedKey is called with selectedProperty');
	}

	QUnit.test('When setItemsOfDropDownList is called for a Non-Mandatory Dimension property with "None" selected', function(assert) {
		// Arrange
		var setupSpec = {
			bMandatory: false,
			aggregationRole: oModelerConstants.aggregationRoles.DIMENSION,
			selectedProperty: 'None'
		};
		// Verify
		var testSpec = {
			addItem: {
				callCount: 5,
				firstItem: 'None'
			},
			setSelectedKey: {
				selectedProperty: setupSpec.selectedProperty
			}
		};
		_commonAssertsForSetItemsOfDropDownList(assert, this, setupSpec, testSpec);
	});
	QUnit.test('When setItemsOfDropDownList is called for a Non-Mandatory Dimension property with available property selected', function(assert) {
		// Arrange
		var setupSpec = {
			bMandatory: false,
			aggregationRole: oModelerConstants.aggregationRoles.DIMENSION,
			selectedProperty: '4'
		};
		// Verify
		var testSpec = {
			addItem: {
				callCount: 5,
				firstItem: 'None'
			},
			setSelectedKey: {
				selectedProperty: setupSpec.selectedProperty
			}
		};
		_commonAssertsForSetItemsOfDropDownList(assert, this, setupSpec, testSpec);
	});
	QUnit.test('When setItemsOfDropDownList is called for a Non-Mandatory Dimension property with NOT-available property selected', function(assert) {
		// Arrange
		var setupSpec = {
			bMandatory: false,
			aggregationRole: oModelerConstants.aggregationRoles.DIMENSION,
			selectedProperty: '5'
		};
		// Verify
		var testSpec = {
			addItem: {
				callCount: 6,
				firstItem: 'None'
			},
			setSelectedKey: {
				selectedProperty: this.prefixFromTextReader + setupSpec.selectedProperty
			}
		};
		_commonAssertsForSetItemsOfDropDownList(assert, this, setupSpec, testSpec);
	});
	QUnit.test('When setItemsOfDropDownList is called for a Non-Mandatory Measure property with available property selected', function(assert) {
		// Arrange
		var setupSpec = {
			bMandatory: false,
			aggregationRole: oModelerConstants.aggregationRoles.MEASURE,
			selectedProperty: '4'
		};
		// Verify
		var testSpec = {
			addItem: {
				callCount: 4,
				firstItem: this.consumableProperties[0]
			},
			setSelectedKey: {
				selectedProperty: setupSpec.selectedProperty
			}
		};
		_commonAssertsForSetItemsOfDropDownList(assert, this, setupSpec, testSpec);
	});
	QUnit.test('When setItemsOfDropDownList is called for a Non-Mandatory Measure property with NOT-available property selected', function(assert) {
		// Arrange
		var setupSpec = {
			bMandatory: false,
			aggregationRole: oModelerConstants.aggregationRoles.MEASURE,
			selectedProperty: '5'
		};
		// Verify
		var testSpec = {
			addItem: {
				callCount: 5,
				firstItem: this.prefixFromTextReader + setupSpec.selectedProperty
			},
			setSelectedKey: {
				selectedProperty: this.prefixFromTextReader + setupSpec.selectedProperty
			}
		};
		_commonAssertsForSetItemsOfDropDownList(assert, this, setupSpec, testSpec);
	});
	QUnit.test('When setItemsOfDropDownList is called for a Mandatory Dimension property with available property selected', function(assert) {
		// Arrange
		var setupSpec = {
			bMandatory: true,
			aggregationRole: oModelerConstants.aggregationRoles.DIMENSION,
			selectedProperty: '4'
		};
		// Verify
		var testSpec = {
			addItem: {
				callCount: 4,
				firstItem: this.consumableProperties[0]
			},
			setSelectedKey: {
				selectedProperty: setupSpec.selectedProperty
			}
		};
		_commonAssertsForSetItemsOfDropDownList(assert, this, setupSpec, testSpec);
	});
	QUnit.test('When setItemsOfDropDownList is called for a Mandatory Measure property with NOT-available property selected', function(assert) {
		// Arrange
		var setupSpec = {
			bMandatory: true,
			aggregationRole: oModelerConstants.aggregationRoles.MEASURE,
			selectedProperty: '5'
		};
		// Verify
		var testSpec = {
			addItem: {
				callCount: 5,
				firstItem: this.prefixFromTextReader + setupSpec.selectedProperty
			},
			setSelectedKey: {
				selectedProperty: this.prefixFromTextReader + setupSpec.selectedProperty
			}
		};
		_commonAssertsForSetItemsOfDropDownList(assert, this, setupSpec, testSpec);
	});

	QUnit.module('Given instance of PropertyType and a stubbing for updateRepresentationAndView', {
		beforeEach: function(){
			this.oPropertyTypeController = new sap.ui.controller('sap.apf.modeler.ui.controller.propertyType');
			this.spies = {
				updateOfConfigurationObjectAsPromise: sinon.stub(this.oPropertyTypeController, 'updateOfConfigurationObjectAsPromise',
					function(){
						return createPromise();
				}),
				setDetailData: sinon.stub(this.oPropertyTypeController, 'setDetailData', function(){}),
				enableDisableLabelDisplayOptionTypeAsPromise: sinon.stub(this.oPropertyTypeController, 'enableDisableLabelDisplayOptionTypeAsPromise',
					function(){
						return createPromise();
					})
			};
		},
		afterEach: function(){
			var that = this;
			Object.keys(this.spies).forEach(function(member){
				that.spies[member].restore();
			});
		}
	});
	QUnit.test('WHEN calling updateRepresentationAndView', function(assert){
		var that = this;
		assert.expect(3);
		var done = assert.async();
		// Act
		this.oPropertyTypeController.updateRepresentationAndView().then(function(){
			// THEN prove function composition
			assert.strictEqual(that.spies.updateOfConfigurationObjectAsPromise.callCount, 1, "Then updateOfConfigurationObjectAsPromise is called once");
			assert.strictEqual(that.spies.setDetailData.callCount, 1, "Then setDetailData is called once");
			assert.strictEqual(that.spies.enableDisableLabelDisplayOptionTypeAsPromise.callCount, 1, "Then enableDisableLabelDisplayOptionTypeAsPromise is called once");
			done();
		});
	});

	QUnit.module('Given instance of PropertyType', {
		beforeEach: function(){
			var that = this;
			this.oPropertyTypeController = new sap.ui.controller('sap.apf.modeler.ui.controller.propertyType');
			this.stubbedArrayOfCurrentPropertiesState = [];
			this.matchingListIndex = 0;
			this.oPropertyTypeState = {
				getPropertyValueState: function(){
					return that.stubbedArrayOfCurrentPropertiesState;
				},
				indexOfPropertyTypeViewId: function(){
					return that.matchingListIndex;
				}
			};
			this.stubbedPropertyInformationList = [{
				any: 42
			}];
			this.getPropertyInformationList = function(){
				return that.stubbedPropertyInformationList;
			};
			this.oPropertyTypeController.getView = function() {
				return {
					getViewData: function(){
						return {
							oPropertyTypeState: that.oPropertyTypeState,
							oPropertyOrchestration: {
								getPropertyInformationList: that.getPropertyInformationList
							}
						};
					},
					getId: function(){
						return "propertyType-Id";
					}
				};
			};
			this.spies = {
				updatePropertiesInConfiguration: sinon.stub(this.oPropertyTypeController, 'updatePropertiesInConfiguration',
					function(){}),
				getPropertyInformationList: sinon.spy(this, 'getPropertyInformationList')
			};
		},
		afterEach: function(){
			var that = this;
			Object.keys(this.spies).forEach(function(member){
				that.spies[member].restore();
			});
		}
	});
	QUnit.test('WHEN calling updateOfConfigurationObjectAsPromise', function(assert){
		var that = this;
		assert.expect(3);
		var done = assert.async();
		// Arrange
		// Act
		this.oPropertyTypeController.updateRepresentationAndView().then(function(){
			// THEN prove function composition
			assert.strictEqual(that.spies.getPropertyInformationList.callCount, 1, "Then getPropertyInformationList is called once");
			assert.strictEqual(that.spies.updatePropertiesInConfiguration.callCount, 1, "And updatePropertiesInConfiguration is called once");
			assert.deepEqual(that.spies.updatePropertiesInConfiguration.getCall(0).args[0], that.stubbedPropertyInformationList, "And its parameter is an array of PropertyInfo objects");
			done();
		});
	});

	QUnit.module('Given instance of PropertyType and a minimal stubbed PropertyType controller and view, editor and orchestration', {
		beforeEach: function () {
			var that = this;
			that.mIsSwapCase = false;
			this.selectedKey = 'hanna';
			this.dependentSelectedKey = 'otto';
			this.viewId = 'Test-PropertyType-View-Id1';
			this.updateRepresentationAndView = function () {
				return createPromise();
			};
			this.configurationEditor = {
				setIsUnsaved: function () {}
			};
			this.dependentPropertyTypeRow = {
				propertyRowInformation: {
					sProperty: that.dependentSelectedKey
				},
				oView: {
					getController: function () {
						return {
							updateRepresentationAndView: that.updateRepresentationAndView,
							oConfigurationEditor: {
								setIsUnsaved: function () {}
							}
						};
					}
				}
			};
			this.oPropertyOrchestration = {
				updateAllSelectControlsForPropertyType: function () {
					return createPromise();
				},
				getProperties: function () {
					return [that.selectedKey];
				},
				isSwapCase: function () {
					return that.mIsSwapCase;
				},
				getPropertyTypeRow: function () {
					return that.dependentPropertyTypeRow;
				},
				getPropertyTypeRowByPropertyName: function(){
					return that.dependentPropertyTypeRow;
				},
				removePropertyTypeReference: function(){}
			};
			this.oDropDownView = {
				getSelectedKey: function () {
					return that.selectedKey;
				},
				getItems : function (){
					return [];
				},
				attachEvent : function () {},
				removeItem: function(){} // for removal of vBox
			};
			this.oViewData = {
				oPropertyOrchestration: that.oPropertyOrchestration,
				oPropertyTypeState: {
					indexOfPropertyTypeViewId: function () {
						return 0; // index
					},
					getPropertyValueState: function () {
						return [{/*empty*/}];
					}
				},
				oPropertyTypeHandlerBackLink: {
					handlePressOfRemove: function(){}
				}
			};
			this.oView = {
				getId: function () { return that.viewId; },
				fireEvent: function () {}, // catch all events do nothing
				getViewData: function () {
					return that.oViewData;
				},
				destroy: function(){}
			};
			this.oStubbedContextContract = {
				byId: function () { // stub
					return that.oDropDownView;
				},
				getView: function () {
					return that.oView;
				},
				oTextReader: function () {
					return 'prefix-';
				},
				updateOfConfigurationObjectAsPromise: function () {
					return createPromise();
				},
				setDetailData: function () {},
				enableDisableLabelDisplayOptionTypeAsPromise: function () {
					return createPromise();
				},
				oConfigurationEditor: this.configurationEditor
			};
			this.oPropertyTypeController = new sap.ui.controller('sap.apf.modeler.ui.controller.propertyType');
			jQuery.extend(this.oPropertyTypeController, this.oStubbedContextContract);

			this.spies = {
				updateAllSelectControlsForPropertyType: sinon.spy(this.oPropertyOrchestration, 'updateAllSelectControlsForPropertyType'),
				updateRepresentationAndView: sinon.spy(that.oPropertyTypeController, 'updateRepresentationAndView'),
				setIsUnsaved: sinon.spy(that.configurationEditor, 'setIsUnsaved'),
				isSwapCase: sinon.spy(that.oPropertyOrchestration, 'isSwapCase'),
				dependentControllerUpdateRepresentationAndView: sinon.spy(that, 'updateRepresentationAndView'),
				destroy: sinon.spy(that.oView, "destroy"),
				removePropertyTypeReference: sinon.spy(that.oPropertyOrchestration, "removePropertyTypeReference"),
				updateOfConfigurationObjectAsPromise: sinon.spy(that.oPropertyTypeController, 'updateOfConfigurationObjectAsPromise'),
				handlePressOfRemove: sinon.spy(that.oViewData.oPropertyTypeHandlerBackLink, "handlePressOfRemove"),
				_shallAddPropertyBeHandled : sinon.stub(that.oPropertyTypeController, "_shallAddPropertyBeHandled"),
				fireEvent: sinon.spy(that.oView, "fireEvent")
			};
		},
		afterEach: function () {
			var that = this;
			Object.keys(this.spies).forEach(function(member){
				that.spies[member].restore();
			});
		}
	});
	QUnit.test('When calling UI event handleChangeForPropertyTypeAsPromise', function (assert) {
		assert.expect(9);
		// Arrange
		var done = assert.async();
		var that = this;
		var event = {};
		// Act
		this.oPropertyTypeController.handleChangeForPropertyTypeAsPromise(event).then(function () {
			// Verify
			assert.strictEqual(that.spies.updateAllSelectControlsForPropertyType.callCount, 1, 'Then updateAllSelectControlsForPropertyType is called once');
			assert.strictEqual(that.spies.updateAllSelectControlsForPropertyType.getCall(0).args[0], that.viewId, 'Then called with the view id');
			assert.strictEqual(that.spies.updateAllSelectControlsForPropertyType.getCall(0).args[1], that.selectedKey, 'Then called with selectedKey of the drop down box');
			assert.strictEqual(that.spies.updateRepresentationAndView.callCount, 1, 'Then updateRepresentationAndView is called once');
			assert.strictEqual(that.spies.isSwapCase.callCount, 1, 'Then isSwapCase is called once');
			assert.strictEqual(that.spies.isSwapCase.getCall(0).args[0], that.viewId, 'Then called with the viewId');
			assert.strictEqual(that.spies.isSwapCase.getCall(0).args[1], that.selectedKey, 'Then called with the selected key of the event/view');
			assert.strictEqual(that.spies.dependentControllerUpdateRepresentationAndView.callCount, 0, 'Then updateRepresentationAndView is not called ');
			assert.strictEqual(that.spies.setIsUnsaved.callCount, 1, 'Then setIsUnsaved is called once');
			done();
		});
	});
	QUnit.test('When calling UI event handleChangeForPropertyTypeAsPromise in swap case for Measures', function (assert) {
		assert.expect(10);
		// Arrange
		var done = assert.async();
		var that = this;
		this.updateRepresentationAndView = function() {
			assert.strictEqual(that.spies.updateAllSelectControlsForPropertyType.callCount, 1, 'Then the swap has already updated the two rows in orchestration');
			return createPromise();
		};
		this.spies.dependentControllerUpdateRepresentationAndView = sinon.spy(that, 'updateRepresentationAndView');
		var event = {};
		that.mIsSwapCase = true;
		// Act
		this.oPropertyTypeController.handleChangeForPropertyTypeAsPromise(event).then(function () {
			// Verify
			assert.strictEqual(that.spies.updateAllSelectControlsForPropertyType.callCount, 1, 'Then updateAllSelectControlsForPropertyType is called once');
			assert.strictEqual(that.spies.updateAllSelectControlsForPropertyType.getCall(0).args[0], that.viewId, 'Then called with the view id');
			assert.strictEqual(that.spies.updateAllSelectControlsForPropertyType.getCall(0).args[1], that.selectedKey, 'Then called with selectedKey of the drop down box');
			assert.strictEqual(that.spies.updateRepresentationAndView.callCount, 1, 'Then updateRepresentationAndView is called once');
			assert.strictEqual(that.spies.isSwapCase.callCount, 1, 'Then isSwapCase is called once');
			assert.strictEqual(that.spies.isSwapCase.getCall(0).args[0], that.viewId, 'Then called with the viewId');
			assert.strictEqual(that.spies.isSwapCase.getCall(0).args[1], that.selectedKey, 'Then called with the selected key of the event/view');
			assert.strictEqual(that.spies.dependentControllerUpdateRepresentationAndView.callCount, 1, 'Then updateRepresentationAndView is called once or updating the dependent property type');
			assert.strictEqual(that.spies.setIsUnsaved.callCount, 1, 'Then setIsUnsaved is called once');
			done();
		});
	});
	QUnit.test('When removing a row', function (assert) {
		assert.expect(6);
		// Arrange
		var done = assert.async();
		var that = this;
		// act
		this.oPropertyTypeController.handlePressOfRemovePropertyIcon().then(function(){
			// verify
			assert.strictEqual(that.spies.removePropertyTypeReference.callCount, 1, 'Then the Orchestration object us updated');
			assert.strictEqual(that.spies.updateOfConfigurationObjectAsPromise.callCount, 1, 'And the config object is updated, too');
			assert.strictEqual(that.spies.setIsUnsaved.callCount, 1, 'And the editor is set as changed');
			assert.strictEqual(that.spies.updateAllSelectControlsForPropertyType.callCount, 1, 'And all rows and their value help controls are updated');
			assert.strictEqual(that.spies.handlePressOfRemove.callCount, 1, 'And the PropertyTypeState gets updated');
			assert.strictEqual(that.spies.destroy.callCount, 1, 'And the view of the removed row got destroyed');
			done();
		});
	});
	QUnit.test("When adding a row and _shallAddPropertyBeHandled returns true", function(assert) {
		// Arrange
		var that = this;
		this.spies._shallAddPropertyBeHandled.returns(true);
		// act
		this.oPropertyTypeController.handlePressOfAddPropertyIcon();
		// verify
		assert.strictEqual(that.spies.setIsUnsaved.callCount, 1, 'And the editor is set as changed');
		assert.strictEqual(that.spies.fireEvent.callCount, 1, 'And the update is delegated to PropertyTypeHandler');
		assert.strictEqual(that.spies.fireEvent.getCall(0).args[0], oModelerConstants.events.ADDPROPERTY, 'And the update is delegated to PropertyTypeHandler');
	});
	QUnit.test("When adding a row and _shallAddPropertyBeHandled returns false", function(assert) {
		// Arrange
		var that = this;
		this.spies._shallAddPropertyBeHandled.returns(false);
		// act
		this.oPropertyTypeController.handlePressOfAddPropertyIcon();
		// verify
		assert.strictEqual(that.spies.setIsUnsaved.callCount, 0, 'And the editor is not set as changed');
		assert.strictEqual(that.spies.fireEvent.callCount, 0, 'And the update is NOT delegated to PropertyTypeHandler');
	});
});