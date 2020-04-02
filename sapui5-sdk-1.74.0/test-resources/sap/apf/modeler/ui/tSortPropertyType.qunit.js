/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
sap.ui.define('sap/apf/modeler/ui/tSortPropertyType',[
	"sap/apf/modeler/ui/utils/propertyTypeOrchestration",
	"sap/apf/modeler/ui/controller/sortPropertyType",
	"sap/apf/modeler/ui/utils/textManipulator",
	"sap/apf/modeler/ui/utils/constants"

], function(propertyTypeOrchestration, sortPropertyType, textManipulator, uiModelerConstants) {
	'use strict';

	QUnit.module("Given an orchestration and a sortPropertyType instance and a stub view", {
		beforeEach : function(assert) {
			var that = this;
			var viewCount = 0;
			this.available = ["otto", "hugo"];
			this.oPropertyTypeOrchestration = new propertyTypeOrchestration.PropertyTypeOrchestration();
			var spy_getSortPropertyInformationList = sinon.spy(that.oPropertyTypeOrchestration, "getSortPropertyInformationList");
			var spy_updatePropertyTypeRow = sinon.spy(that.oPropertyTypeOrchestration, "updatePropertyTypeRow");
			var spy_removePropertyTypeReference = sinon.spy(that.oPropertyTypeOrchestration, "removePropertyTypeReference");
			var spy_updateAllSelectControlsForPropertyType = sinon.spy(that.oPropertyTypeOrchestration, "updateAllSelectControlsForPropertyType");
			var stub_getConsumableAndAvailablePropertiesAsPromise = sinon.stub(propertyTypeOrchestration, "getConsumableAndAvailablePropertiesAsPromise", function() {
				return new Promise(function(resolve) {
					resolve({
						available: that.available,
						consumable : []
					});
				});
			});
			this.spies = [];
			this.spy_removePrefixText;

			that.createSortPropertyTypeContext = function (initialSelectedProperty){
				var viewId = "view-id-" + viewCount++;

				var innerContext = {
					viewData: {
						oPropertyOrchestration: that.oPropertyTypeOrchestration,
						oParentObject: {getId: function() { return "repr-testId"}},
						oPropertyTypeHandlerBackLink : {
							byId: function(){
								return {
									removeItem: function(){}
								};
							},
							handlePressOfRemove: function(){}
						},
						oStepPropertyMetadataHandler:{
							oStep: {
								getType: function() {}
							}
						}
					},
					selectedTestKey : initialSelectedProperty,
					sortPropertyTypeController : new sap.ui.controller("sap.apf.modeler.ui.controller.sortPropertyType"),
					setSelectionOnValueHelp : function(translatedKey){
						innerContext.selectedTestKey = translatedKey;
					},
					dropDownController : {
						getSelectedKey: function(){
							return innerContext.selectedTestKey;
						},
						setSelectedKey: function(key){
							innerContext.selectedTestKey = key;
						},
						getItems : function() {
							return [{}, {}, {}]; // same length as this.available PLUS "None"
						},
						removeItem: function() {},
						addItem: function() {}
					},
					view : {
						getViewData: function() {
							return innerContext.viewData;
						},
						getId : function() {
							return viewId;
						},
						fireEvent: function () {}, // catch all events do nothing
						getController : function() {
							return innerContext.sortPropertyTypeController;
						},
						destroy: function(){}
					},
					stubForSortPropertyTypeController : {
						getView : function(){
							return innerContext.view;
						},
						byId : function(){
							return innerContext.dropDownController;
						},
						oTextReader : function(text) {
							if (text === "none"){
								return "translated None";
							} else if (text === uiModelerConstants.texts.NOTAVAILABLE){
								return "Not-Available";
							}
							return "should not be seen! ";
						},
						oConfigurationEditor : {
							setIsUnsaved: function() {}
						}
					}
				};
				jQuery.extend(innerContext.sortPropertyTypeController, innerContext.stubForSortPropertyTypeController);
				that.spies.push({
					getConsumableAndAvailablePropertiesAsPromise : stub_getConsumableAndAvailablePropertiesAsPromise,
					setSelectedKey : sinon.spy(innerContext.dropDownController, "setSelectedKey"),
					addItem : sinon.spy(innerContext.dropDownController, "addItem"),
					removeItem : sinon.spy(innerContext.dropDownController, "removeItem"),
					setIsUnsaved: sinon.spy(innerContext.stubForSortPropertyTypeController.oConfigurationEditor, "setIsUnsaved"),
					getSortPropertyInformationList: spy_getSortPropertyInformationList,
					updatePropertyTypeRow: spy_updatePropertyTypeRow,
					updateOfConfigurationObject : sinon.spy(innerContext.sortPropertyTypeController, "updateOfConfigurationObject"),
					removePropertyTypeReference: spy_removePropertyTypeReference,
					handlePressOfRemove: sinon.spy(innerContext.viewData.oPropertyTypeHandlerBackLink, "handlePressOfRemove"),
					updateAllSelectControlsForPropertyType: spy_updateAllSelectControlsForPropertyType,
					destroy: sinon.spy(innerContext.view, "destroy")
				});
				return innerContext;
			};
			this.assertOrchestrationUpdate = function(spies, spec){
				assert.strictEqual(spies.updatePropertyTypeRow.callCount, 1, "Then updatePropertyRow is called once");
				assert.strictEqual(spies.updatePropertyTypeRow.getCall(0).args[0], spec.sViewId, "And arg[0] is the view ID");
				assert.strictEqual(spies.updatePropertyTypeRow.getCall(0).args[1], spec.sSelectedProperty, "And arg[1] is the changed selection");
			};
			this.commonAsserts = function(spies, context, selectedProperty) {
				assert.strictEqual(that.oPropertyTypeOrchestration.getPropertyTypeRow(context.view.getId()).propertyRowInformation.sProperty, selectedProperty, "Then orchestration row is updated");
				assert.strictEqual(spies.getSortPropertyInformationList.callCount, 1, "Then getSortPropertyInformationList is called once");
				assert.strictEqual(spies.removeItem.callCount, context.dropDownController.getItems().length, "Then removeItem is called for all items");
				assert.strictEqual(spies.setSelectedKey.callCount, 1, "Then setSelectedKey is called once");
				assert.strictEqual(spies.setSelectedKey.getCall(0).args[0], selectedProperty, "Then setSelectedKey is called with " + selectedProperty);
			};
		},
		afterEach : function(){
			if(this.spy_removePrefixText){
				this.spy_removePrefixText.restore();
			}
			this.spies.forEach(function(aSpy){
				aSpy.getConsumableAndAvailablePropertiesAsPromise.restore(); // static method
			});
		}
	});
	QUnit.test("Given 2 selectable properties, one selected, WHEN change selection to the other",function(assert) {
		// arrange
		assert.expect(4+5+3);
		var that = this;
		var done = assert.async();
		var inputContractTranslatedKey = "hugo";
		var context = that.createSortPropertyTypeContext("otto");
		that.oPropertyTypeOrchestration.addPropertyTypeReference(context.view.getId(), {sProperty: context.selectedTestKey}, "Any", context.view);
		// act
		context.setSelectionOnValueHelp(inputContractTranslatedKey);
		context.sortPropertyTypeController.handleChangeForSortProperty().then(function() {
			// verify
			that.assertOrchestrationUpdate(that.spies[0], {
					sViewId: context.view.getId(),
					sSelectedProperty: inputContractTranslatedKey
				});
			that.commonAsserts(that.spies[0], context, inputContractTranslatedKey);
			assert.strictEqual(that.spies[0].getConsumableAndAvailablePropertiesAsPromise.callCount, 1, "Then getConsumableAndAvailablePropertiesAsPromise is called once");
			assert.strictEqual(that.spies[0].addItem.callCount, 1 + that.available.length, "Then addItem is called for available properties PLUS 'None'");
			assert.strictEqual(that.spies[0].updateOfConfigurationObject.callCount, 1, "Then updateOfConfigurationObject is called once");
			assert.strictEqual(that.spies[0].setIsUnsaved.callCount, 1, "Then setIsUnsaved is called once");
			done();
		});
	});
	QUnit.test("Given 2 selectable properties, one selected, WHEN change selection to 'None'",function(assert) {
		// arrange
		assert.expect(9+3);
		var that = this;
		var done = assert.async();
		var context = that.createSortPropertyTypeContext("otto");
		that.oPropertyTypeOrchestration.addPropertyTypeReference(context.view.getId(), {sProperty: context.selectedTestKey}, "Any", context.view);
		var inputContractTranslatedKey = context.view.getController().oTextReader("none");
		// act
		context.setSelectionOnValueHelp(inputContractTranslatedKey);
		context.sortPropertyTypeController.handleChangeForSortProperty().then(function() {
			// verify
			that.assertOrchestrationUpdate(that.spies[0], {
				sViewId: context.view.getId(),
				sSelectedProperty: inputContractTranslatedKey
			});
			that.commonAsserts(that.spies[0], context, inputContractTranslatedKey);
			assert.strictEqual(that.spies[0].getConsumableAndAvailablePropertiesAsPromise.callCount, 1, "Then getConsumableAndAvailablePropertiesAsPromise is called once");
			assert.strictEqual(that.spies[0].addItem.callCount, 1 + that.available.length, "Then addItem is called for available properties PLUS 'None'");
			assert.strictEqual(that.spies[0].updateOfConfigurationObject.callCount, 1, "Then updateOfConfigurationObject is called once");
			assert.strictEqual(that.spies[0].setIsUnsaved.callCount, 1, "Then setIsUnsaved is called once");
			done();
		});
	});
	QUnit.test("Given 2 selectable properties, one selected, WHEN change selection to not-available property",function(assert) {
		// arrange
		assert.expect(6);
		var that = this;
		var done = assert.async();
		var context = that.createSortPropertyTypeContext("otto");
		that.oPropertyTypeOrchestration.addPropertyTypeReference(context.view.getId(), {sProperty: context.selectedTestKey}, "Any", context.view);
		var inputContractTranslatedKey = "anna";
		var expectedPrefixedProperty = "Not-Available" + ": " + inputContractTranslatedKey;
		// act
		context.setSelectionOnValueHelp(inputContractTranslatedKey);
		context.sortPropertyTypeController.handleChangeForSortProperty().then(function() {
			// verify
			assert.strictEqual(that.oPropertyTypeOrchestration.getPropertyTypeRow(context.view.getId()).propertyRowInformation.sProperty, inputContractTranslatedKey, "Then orchestration row is updated");
			assert.strictEqual(that.spies[0].setSelectedKey.getCall(0).args[0], expectedPrefixedProperty, "Then setSelectedKey is called with " + expectedPrefixedProperty);

			assert.strictEqual(that.spies[0].getConsumableAndAvailablePropertiesAsPromise.callCount, 1, "Then getConsumableAndAvailablePropertiesAsPromise is called once");
			assert.strictEqual(that.spies[0].addItem.callCount, 1 + that.available.length + 1, "Then addItem is called for available properties PLUS 'None' PLUS not available property");
			assert.strictEqual(that.spies[0].updateOfConfigurationObject.callCount, 1, "Then updateOfConfigurationObject is called once");
			assert.strictEqual(that.spies[0].setIsUnsaved.callCount, 1, "Then setIsUnsaved is called once");
			done();
		});
	});
	QUnit.test("Given 2 selectable properties, and 2 rows, WHEN change selection in 1st row to 'None'",function(assert) {
		// arrange
		assert.expect(16+3);
		var that = this;
		var done = assert.async();
		var row_1 = that.createSortPropertyTypeContext("otto");
		that.oPropertyTypeOrchestration.addPropertyTypeReference(row_1.view.getId(), {sProperty: row_1.selectedTestKey}, "Any", row_1.view);
		var row_2 = that.createSortPropertyTypeContext("hugo");
		that.oPropertyTypeOrchestration.addPropertyTypeReference(row_2.view.getId(), {sProperty: row_2.selectedTestKey}, "Any", row_2.view);

		var inputContractTranslatedKey = row_1.view.getController().oTextReader("none");
		// act
		row_1.setSelectionOnValueHelp(inputContractTranslatedKey);
		row_1.sortPropertyTypeController.handleChangeForSortProperty().then(function() {
			// verify
			that.assertOrchestrationUpdate(that.spies[0], {
				sViewId: row_1.view.getId(),
				sSelectedProperty: inputContractTranslatedKey
			});
			that.commonAsserts(that.spies[0], row_1, inputContractTranslatedKey);
			that.commonAsserts(that.spies[1], row_2, "hugo");

			assert.strictEqual(that.spies[0].getConsumableAndAvailablePropertiesAsPromise.callCount, 2, "Then getConsumableAndAvailablePropertiesAsPromise is called for every row");
			assert.strictEqual(that.spies[0].addItem.callCount, 1 + that.available.length - 1, "row_1: Then addItem is called for consumable properties PLUS 'None'");
			assert.strictEqual(that.spies[1].addItem.callCount, 1 + that.available.length, "row_2: Then addItem is called for available properties PLUS 'None'");
			assert.strictEqual(that.spies[0].setIsUnsaved.callCount, 1, "Then setIsUnsaved is called once");
			assert.strictEqual(that.spies[0].updateOfConfigurationObject.callCount, 1, "Then updateOfConfigurationObject is called once");
			assert.strictEqual(that.spies[1].updateOfConfigurationObject.callCount, 0, "Then updateOfConfigurationObject is not called");

			done();
		});
	});
	QUnit.test("Given 2 selectable properties, and 2 rows, one pre-selected with None, WHEN change selection in 2nd row to available property",function(assert) {
		// arrange
		assert.expect(16);
		var that = this;
		var done = assert.async();
		var row_1 = that.createSortPropertyTypeContext("otto");
		that.oPropertyTypeOrchestration.addPropertyTypeReference(row_1.view.getId(), {sProperty: row_1.selectedTestKey}, "Any", row_1.view);
		var row_2 = that.createSortPropertyTypeContext(row_1.view.getController().oTextReader("none"));
		that.oPropertyTypeOrchestration.addPropertyTypeReference(row_2.view.getId(), {sProperty: row_2.selectedTestKey}, "Any", row_2.view);

		var inputContractTranslatedKey = "hugo";
		// act
		row_2.setSelectionOnValueHelp(inputContractTranslatedKey);
		row_2.sortPropertyTypeController.handleChangeForSortProperty().then(function() {
			// verify
			that.commonAsserts(that.spies[0], row_1, "otto");
			that.commonAsserts(that.spies[1], row_2, inputContractTranslatedKey);

			assert.strictEqual(that.spies[0].getConsumableAndAvailablePropertiesAsPromise.callCount, 2, "Then getConsumableAndAvailablePropertiesAsPromise is called for every row");
			assert.strictEqual(that.spies[0].addItem.callCount, 1 + that.available.length - 1, "row_1: Then addItem is called for consumable properties PLUS 'None'");
			assert.strictEqual(that.spies[1].addItem.callCount, 1 + that.available.length - 1, "row_2: Then addItem is called for consumable properties PLUS 'None'");
			assert.strictEqual(that.spies[1].setIsUnsaved.callCount, 1, "Then setIsUnsaved is called once by 2nd row");
			assert.strictEqual(that.spies[1].updateOfConfigurationObject.callCount, 1, "Then updateOfConfigurationObject is called once");
			assert.strictEqual(that.spies[0].updateOfConfigurationObject.callCount, 0, "Then updateOfConfigurationObject is not called");

			done();
		});
	});
	QUnit.test("Given 1 sortPropertyType, WHEN calling the UI handler for change of direction", function(assert) {
		// arrange
		assert.expect(2);
		var that = this;
		var property4SortDirection = "anna";
		this.spy_removePrefixText = sinon.stub(textManipulator, "removePrefixText");
		this.spy_removePrefixText.returns(property4SortDirection);
		var row_1 = that.createSortPropertyTypeContext("true");
		var changedIsAscending = "false";
		// Act
		row_1.setSelectionOnValueHelp(changedIsAscending);
		row_1.sortPropertyTypeController.handleChangeForSortDirection();

		// verify
		assert.strictEqual(that.spies[0].updateOfConfigurationObject.callCount, 1, "Then updateOfConfigurationObject is called once");
		assert.strictEqual(that.spies[0].setIsUnsaved.callCount, 1, "Then setIsUnsaved is called once");
	});
	QUnit.test("When removing a sort row", function(assert) {
		// arrange
		var done = assert.async();
		assert.expect(6);
		var that = this;
		var row_1 = that.createSortPropertyTypeContext("any");
		// Act
		row_1.sortPropertyTypeController.handlePressOfRemovePropertyIcon().then(function(){
			//verify
			assert.strictEqual(that.spies[0].removePropertyTypeReference.callCount, 1, 'Then the Orchestration object us updated');
			assert.strictEqual(that.spies[0].updateOfConfigurationObject.callCount, 1, 'And the config object is updated, too');
			assert.strictEqual(that.spies[0].setIsUnsaved.callCount, 1, 'And the editor is set as changed');
			assert.strictEqual(that.spies[0].updateAllSelectControlsForPropertyType.callCount, 1, 'And all rows and their value help controls are updated');
			assert.strictEqual(that.spies[0].handlePressOfRemove.callCount, 1, 'And the PropertyTypeState gets updated');
			assert.strictEqual(that.spies[0].destroy.callCount, 1, 'And the view of the removed row got destroyed');
			done();
		});
	});
});