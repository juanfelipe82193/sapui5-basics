jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
(function(){
	function _getAllAvailableSemanticObjectsStub(callBackFn) {
		callBackFn([]);
	}
	function _getSemanticActionsStub(args) {
		return jQuery.Deferred().resolve({semanticActions : []});
	}
	function getOriginalKeyAsTextTranslationIndependant(resourceKey, parameters) {
		var text = resourceKey;
		
		if (parameters) {
			parameters.foreach(function(parameter){
				text = text + " {" + parameter + "}";
			});
		}
		return text;
	}
	function commonSetup(id, assert) {
		var testEnv = this;
		var done = assert.async();//Stop the tests until modeler instance is got
		sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
			testEnv.modelerInstance = modelerInstance;
			var stubOnGetAllAvailableSemanticObjects = sinon.stub(modelerInstance.modelerCore, "getAllAvailableSemanticObjects", _getAllAvailableSemanticObjectsStub);
			var stubOnGetSemanticActions = sinon.stub(modelerInstance.modelerCore, "getSemanticActions", _getSemanticActionsStub);
			testEnv.oNavigationTargetController = new sap.ui.controller("sap.apf.modeler.ui.controller.navigationTarget");
			testEnv.oNavigationTargetView = new sap.ui.view({
				viewName : "sap.apf.modeler.ui.view.navigationTarget",
				type : sap.ui.core.mvc.ViewType.XML,
				controller : testEnv.oNavigationTargetController,
				viewData : {
					updateSelectedNode : modelerInstance.updateSelectedNode,
					updateTitleAndBreadCrumb : modelerInstance.updateTitleAndBreadCrumb,
					oConfigurationHandler : modelerInstance.configurationHandler,
					oConfigurationEditor : modelerInstance.configurationEditorForUnsavedConfig,
					getText : getOriginalKeyAsTextTranslationIndependant,
					getAllAvailableSemanticObjects : stubOnGetAllAvailableSemanticObjects,
					getSemanticActions : stubOnGetSemanticActions,
					createMessageObject : modelerInstance.modelerCore.createMessageObject,
					putMessage : modelerInstance.modelerCore.putMessage,
					setNavigationTargetName : modelerInstance.setNavigationTargetName,
					oParams : {
						name : "navigationTarget",
						arguments : {
							configId : modelerInstance.tempUnsavedConfigId,
							navTargetId : testEnv.modelerInstance[id]
						}
					}
				}
			});
			testEnv.navigationTarget = modelerInstance.configurationEditorForUnsavedConfig.getNavigationTarget(testEnv.modelerInstance[id]);
			testEnv.addNavigationParameterSpy = sinon.spy(testEnv.navigationTarget, "addNavigationParameter");
			testEnv.removeNavigationParameterSpy = sinon.spy(testEnv.navigationTarget, "removeNavigationParameter");
			testEnv.spyOnConfigEditorSetIsUnsaved = sinon.spy(modelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
			done();//Start the test once modeler instance is got and setup is done
		});
	}
	function commonTeardown(){
		this.spyOnConfigEditorSetIsUnsaved.restore();
		this.modelerInstance.modelerCore.getAllAvailableSemanticObjects.restore();
		this.modelerInstance.modelerCore.getSemanticActions.restore();
		this.modelerInstance.reset();
		this.addNavigationParameterSpy.restore();
		this.removeNavigationParameterSpy.restore();
	}
	QUnit.module("Navigation parameters", {
		beforeEach : function(assert){
			commonSetup.call(this, "firstNavigationTargetId", assert);
		},
		afterEach: function() {
			commonTeardown.apply(this);
		}
	});
	QUnit.test("Initial", function(assert){
		var oController = this.oNavigationTargetView.getController();
		assert.strictEqual(oController.byId("idNavigationParametersHeaderLabel").getText(), "navigationParametersHeader", "Header set");
		var navigationParameters = oController.byId("idNavigationParameterBox").getItems();
		assert.strictEqual(navigationParameters.length, 1, "One navigation parameter initially created");
		assert.strictEqual(navigationParameters[0].byId("idNavigationParametersLabel").getText(), "navigationStaticParametersLabel", "Label set");
		assert.strictEqual(navigationParameters[0].byId("idNavigationParametersKey").getPlaceholder(), "navigationParametersKey", "Placeholder for key set");
		assert.strictEqual(navigationParameters[0].byId("idNavigationParametersKey").getValueStateText(), "navigationParametersKeyErrorState", "Error message set for Key field");
		assert.strictEqual(navigationParameters[0].byId("idNavigationParametersValue").getValueStateText(), "navigationParametersValueErrorState", "Error message set for Value field");
		assert.strictEqual(navigationParameters[0].byId("idNavigationParametersValue").getPlaceholder(), "navigationParametersValue", "Placeholder for value set");
		assert.strictEqual(navigationParameters[0].byId("idAddNavigationParameter").getVisible(), true, "Add button visible");
		assert.strictEqual(navigationParameters[0].byId("idRemoveNavigationParameter").getVisible(), false, "Remove button not visible");
	});
	QUnit.test("Add and remove", function(assert){
		var oController = this.oNavigationTargetView.getController();
		var firstNavigationParameter = oController.byId("idNavigationParameterBox").getItems()[0];
		//add second element
		firstNavigationParameter.byId("idAddNavigationParameter").firePress();
		var navigationParameters = oController.byId("idNavigationParameterBox").getItems();
		var secondParameter = navigationParameters[1];
		assert.strictEqual(navigationParameters.length, 2, "A second parameter view added");
		assert.strictEqual(firstNavigationParameter.byId("idAddNavigationParameter").getVisible(), false, "Add button for first parameter not visible");
		assert.strictEqual(firstNavigationParameter.byId("idRemoveNavigationParameter").getVisible(), true, "Remove button for first parameter visible");
		assert.strictEqual(secondParameter.byId("idAddNavigationParameter").getVisible(), true, "Add button for second parameter visible");
		assert.strictEqual(secondParameter.byId("idRemoveNavigationParameter").getVisible(), true, "Remove button for second parameter visible");

		//remove first element
		firstNavigationParameter.byId("idRemoveNavigationParameter").firePress();
		navigationParameters = oController.byId("idNavigationParameterBox").getItems();
		assert.strictEqual(navigationParameters.length, 1, "Only one view remains");
		assert.strictEqual(secondParameter.byId("idAddNavigationParameter").getVisible(), true, "Add button still visible");
		assert.strictEqual(secondParameter.byId("idRemoveNavigationParameter").getVisible(), false, "Remove button not visible anymore");
		assert.strictEqual(navigationParameters.indexOf(firstNavigationParameter), -1, "First parameter not available anymore");
		assert.strictEqual(navigationParameters.indexOf(secondParameter), 0, "Second parameter still available");
	});
	QUnit.test("Enter parameter and value - key entered first", function(assert) {
		var oController = this.oNavigationTargetView.getController();
		var firstNavigationParameter = oController.byId("idNavigationParameterBox").getItems()[0];
		//enter key
		firstNavigationParameter.byId("idNavigationParametersKey").setValue("key");
		firstNavigationParameter.byId("idNavigationParametersKey").fireChange();
		assert.strictEqual(firstNavigationParameter.getController().oldKey, "key", "Key from change event stored");
		assert.strictEqual(this.addNavigationParameterSpy.callCount, 0, "addNavigationParameter not yet called");
		//enter value
		firstNavigationParameter.byId("idNavigationParametersValue").setValue("value");
		firstNavigationParameter.byId("idNavigationParametersValue").fireChange();
		assert.strictEqual(this.spyOnConfigEditorSetIsUnsaved.callCount, 1, "Configuration Editor set to unsaved");
		assert.strictEqual(this.addNavigationParameterSpy.callCount, 1, "addNavigationParameter called once");
		assert.strictEqual(this.addNavigationParameterSpy.getCall(0).args[0], "key", "addNavigationParameter called with key");
		assert.strictEqual(this.addNavigationParameterSpy.getCall(0).args[1], "value", "addNavigationParameter called with value");
	});
	QUnit.test("Enter parameter and value - value entered first", function(assert) {
		var oController = this.oNavigationTargetView.getController();
		var firstNavigationParameter = oController.byId("idNavigationParameterBox").getItems()[0];
		//enter value
		firstNavigationParameter.byId("idNavigationParametersValue").setValue("value");
		firstNavigationParameter.byId("idNavigationParametersValue").fireChange();
		assert.strictEqual(this.addNavigationParameterSpy.callCount, 0, "addNavigationParameter not yet called");
		//enter key
		firstNavigationParameter.byId("idNavigationParametersKey").setValue("key");
		firstNavigationParameter.byId("idNavigationParametersKey").fireChange();
		assert.strictEqual(this.spyOnConfigEditorSetIsUnsaved.callCount, 1, "Configuration Editor set to unsaved");
		assert.strictEqual(firstNavigationParameter.getController().oldKey, "key", "Key from change event stored");
		assert.strictEqual(this.addNavigationParameterSpy.callCount, 1, "addNavigationParameter called once");
		assert.strictEqual(this.addNavigationParameterSpy.getCall(0).args[0], "key", "addNavigationParameter called with key");
		assert.strictEqual(this.addNavigationParameterSpy.getCall(0).args[1], "value", "addNavigationParameter called with value");
	});
	QUnit.test("Enter parameter and value and remove with minus button", function(assert) {
		var oController = this.oNavigationTargetView.getController();
		var navigationParameters = oController.byId("idNavigationParameterBox");
		var firstNavigationParameter = navigationParameters.getItems()[0];
		var secondNavigationParameter;
		var thirdNavigationParameter;	
		// Enter key and value for first parameter
		firstNavigationParameter.byId("idNavigationParametersKey").setValue("key1");
		firstNavigationParameter.byId("idNavigationParametersValue").setValue("value1");
		firstNavigationParameter.byId("idNavigationParametersValue").fireChange();
		// Add second parameter
		firstNavigationParameter.byId("idAddNavigationParameter").firePress();
		// Enter key and value for second parameter
		secondNavigationParameter = navigationParameters.getItems()[1];
		secondNavigationParameter.byId("idNavigationParametersKey").setValue("key2");
		secondNavigationParameter.byId("idNavigationParametersValue").setValue("value2");
		secondNavigationParameter.byId("idNavigationParametersValue").fireChange();
		// Add third parameter
		secondNavigationParameter.byId("idAddNavigationParameter").firePress();
		// Enter key and value for third parameter
		thirdNavigationParameter = navigationParameters.getItems()[2];
		thirdNavigationParameter.byId("idNavigationParametersKey").setValue("key3");
		thirdNavigationParameter.byId("idNavigationParametersValue").setValue("value3");
		thirdNavigationParameter.byId("idNavigationParametersValue").fireChange();
		// Remove first parameter
		this.spyOnConfigEditorSetIsUnsaved.callCount = 0;
		assert.strictEqual(this.navigationTarget.getAllNavigationParameters().length, 3, "Core has three values");
		assert.strictEqual(this.removeNavigationParameterSpy.callCount, 0, "removeNavigationParameter not yet called");
		firstNavigationParameter.byId("idRemoveNavigationParameter").firePress();
		assert.strictEqual(this.spyOnConfigEditorSetIsUnsaved.callCount, 1, "Configuration Editor set to unsaved");
		assert.strictEqual(this.removeNavigationParameterSpy.callCount, 1, "removeNavigationParameter called once");
		assert.strictEqual(this.removeNavigationParameterSpy.getCall(0).args[0], "key1", "removeNavigationParameter called with key");
	});
	QUnit.test("Enter parameter with an already existing key", function(assert) {
		var oController = this.oNavigationTargetView.getController();
		var navigationParameters = oController.byId("idNavigationParameterBox");
		var firstNavigationParameter = navigationParameters.getItems()[0];
		var secondNavigationParameter;
		// Enter key and value for first parameter
		firstNavigationParameter.byId("idNavigationParametersKey").setValue("key");
		firstNavigationParameter.byId("idNavigationParametersValue").setValue("value1");
		firstNavigationParameter.byId("idNavigationParametersValue").fireChange();
		// Add second parameter
		firstNavigationParameter.byId("idAddNavigationParameter").firePress();
		// Enter key and value for second parameter
		secondNavigationParameter = navigationParameters.getItems()[1];
		secondNavigationParameter.byId("idNavigationParametersKey").setValue("key");
		secondNavigationParameter.byId("idNavigationParametersValue").setValue("value2");
		secondNavigationParameter.byId("idNavigationParametersValue").fireChange();
		// Check for duplicates
		assert.strictEqual(this.navigationTarget.getAllNavigationParameters().length, 1, "Core has one value");
		assert.strictEqual(this.addNavigationParameterSpy.callCount, 1, "addNavigationParameter called once");
		assert.strictEqual(this.addNavigationParameterSpy.getCall(0).args[0], "key", "addNavigationParameter called with key");
		assert.strictEqual(secondNavigationParameter.byId("idNavigationParametersKey").getValueState(), sap.ui.core.ValueState.Error, "Error state set");
		// Update second key
		secondNavigationParameter.byId("idNavigationParametersKey").setValue("key2");
		secondNavigationParameter.byId("idNavigationParametersValue").fireChange();
		assert.strictEqual(this.navigationTarget.getAllNavigationParameters().length, 2, "Core has two values");
		assert.strictEqual(this.addNavigationParameterSpy.callCount, 2, "addNavigationParameter called twice");
		assert.strictEqual(this.addNavigationParameterSpy.getCall(1).args[0], "key2", "addNavigationParameter called with key");
		assert.strictEqual(secondNavigationParameter.byId("idNavigationParametersKey").getValueState(), sap.ui.core.ValueState.None, "Error state removed");
	});
	QUnit.test("Change Key", function(assert){
		var oController = this.oNavigationTargetView.getController();
		var navigationParameters = oController.byId("idNavigationParameterBox");
		var firstNavigationParameter = navigationParameters.getItems()[0];
		// Enter key and value for first parameter
		firstNavigationParameter.byId("idNavigationParametersKey").setValue("key");
		firstNavigationParameter.byId("idNavigationParametersValue").setValue("value1");
		firstNavigationParameter.byId("idNavigationParametersValue").fireChange();
		assert.strictEqual(this.addNavigationParameterSpy.getCall(0).args[0], "key", "addNavigationParameter called with key");
		assert.strictEqual(this.addNavigationParameterSpy.getCall(0).args[1], "value1", "addNavigationParameter called with value");
		assert.strictEqual(this.addNavigationParameterSpy.getCall(0).args[2], 0, "addNavigationParameter called with index");
		assert.strictEqual(this.spyOnConfigEditorSetIsUnsaved.callCount, 1, "Configuration Editor set to unsaved");
		//Change key
		firstNavigationParameter.byId("idNavigationParametersKey").setValue("key2");
		firstNavigationParameter.byId("idNavigationParametersValue").fireChange();
		assert.strictEqual(this.spyOnConfigEditorSetIsUnsaved.callCount, 3, "Configuration Editor set to unsaved");
		assert.strictEqual(this.removeNavigationParameterSpy.getCall(0).args[0], "key", "old key removed");
		assert.strictEqual(this.addNavigationParameterSpy.getCall(1).args[0], "key2", "addNavigationParameter called with key2");
		assert.strictEqual(this.addNavigationParameterSpy.getCall(1).args[1], "value1", "addNavigationParameter called with value");
		assert.strictEqual(this.addNavigationParameterSpy.getCall(1).args[2], 0, "addNavigationParameter called with index");
		assert.strictEqual(this.navigationTarget.getAllNavigationParameters().length, 1, "Core has one value");
		assert.strictEqual(this.navigationTarget.getAllNavigationParameters()[0].key, "key2", "Core has updated key");
	});
	QUnit.test("Change Key of second entry", function(assert){
		var oController = this.oNavigationTargetView.getController();
		var navigationParameters = oController.byId("idNavigationParameterBox");
		var firstNavigationParameter = navigationParameters.getItems()[0];
		firstNavigationParameter.byId("idAddNavigationParameter").firePress();
		var secondNavigationParameter = navigationParameters.getItems()[1];
		// Enter key and value for first parameter
		secondNavigationParameter.byId("idNavigationParametersKey").setValue("key");
		secondNavigationParameter.byId("idNavigationParametersValue").setValue("value1");
		secondNavigationParameter.byId("idNavigationParametersValue").fireChange();
		assert.strictEqual(this.addNavigationParameterSpy.getCall(0).args[0], "key", "addNavigationParameter called with key");
		assert.strictEqual(this.addNavigationParameterSpy.getCall(0).args[1], "value1", "addNavigationParameter called with value");
		assert.strictEqual(this.addNavigationParameterSpy.getCall(0).args[2], 1, "addNavigationParameter called with index");
		assert.strictEqual(this.spyOnConfigEditorSetIsUnsaved.callCount, 1, "Configuration Editor set to unsaved");
		//Change key
		secondNavigationParameter.byId("idNavigationParametersKey").setValue("key2");
		secondNavigationParameter.byId("idNavigationParametersValue").fireChange();
		assert.strictEqual(this.spyOnConfigEditorSetIsUnsaved.callCount, 3, "Configuration Editor set to unsaved");
		assert.strictEqual(this.removeNavigationParameterSpy.getCall(0).args[0], "key", "old key removed");
		assert.strictEqual(this.addNavigationParameterSpy.getCall(1).args[0], "key2", "addNavigationParameter called with key2");
		assert.strictEqual(this.addNavigationParameterSpy.getCall(1).args[1], "value1", "addNavigationParameter called with value");
		assert.strictEqual(this.addNavigationParameterSpy.getCall(1).args[2], 1, "addNavigationParameter called with index");
		assert.strictEqual(this.navigationTarget.getAllNavigationParameters().length, 1, "Core has one value");
		assert.strictEqual(this.navigationTarget.getAllNavigationParameters()[0].key, "key2", "Core has updated key");
	});
	QUnit.test("Change Value", function(assert){
		var oController = this.oNavigationTargetView.getController();
		var navigationParameters = oController.byId("idNavigationParameterBox");
		var firstNavigationParameter = navigationParameters.getItems()[0];
		// Enter key and value for first parameter
		firstNavigationParameter.byId("idNavigationParametersKey").setValue("key");
		firstNavigationParameter.byId("idNavigationParametersValue").setValue("value1");
		firstNavigationParameter.byId("idNavigationParametersValue").fireChange();
		assert.strictEqual(this.addNavigationParameterSpy.getCall(0).args[0], "key", "addNavigationParameter called with key");
		assert.strictEqual(this.addNavigationParameterSpy.getCall(0).args[1], "value1", "addNavigationParameter called with value");
		assert.strictEqual(this.spyOnConfigEditorSetIsUnsaved.callCount, 1, "Configuration Editor set to unsaved");
		//Change value
		firstNavigationParameter.byId("idNavigationParametersValue").setValue("value2");
		firstNavigationParameter.byId("idNavigationParametersValue").fireChange();
		assert.strictEqual(this.spyOnConfigEditorSetIsUnsaved.callCount, 3, "Configuration Editor set to unsaved");
		assert.strictEqual(this.removeNavigationParameterSpy.getCall(0).args[0], "key", "old entry removed");
		assert.strictEqual(this.addNavigationParameterSpy.getCall(1).args[0], "key", "addNavigationParameter called with key");
		assert.strictEqual(this.addNavigationParameterSpy.getCall(1).args[1], "value2", "addNavigationParameter called with value");
		assert.strictEqual(this.navigationTarget.getAllNavigationParameters().length, 1, "Core has one value");
		assert.strictEqual(this.navigationTarget.getAllNavigationParameters()[0].value, "value2", "Core has updated value");
	});
	QUnit.test("Remove parameter by entering empty key", function(assert){
		var oController = this.oNavigationTargetView.getController();
		var navigationParameters = oController.byId("idNavigationParameterBox");
		var firstNavigationParameter = navigationParameters.getItems()[0];
		// Enter key and value for first parameter
		firstNavigationParameter.byId("idNavigationParametersKey").setValue("key");
		firstNavigationParameter.byId("idNavigationParametersValue").setValue("value1");
		firstNavigationParameter.byId("idNavigationParametersValue").fireChange();
		assert.strictEqual(this.addNavigationParameterSpy.getCall(0).args[0], "key", "addNavigationParameter called with key");
		assert.strictEqual(this.addNavigationParameterSpy.getCall(0).args[1], "value1", "addNavigationParameter called with value");
		//Change key
		firstNavigationParameter.byId("idNavigationParametersKey").setValue("");
		firstNavigationParameter.byId("idNavigationParametersValue").fireChange();
		assert.strictEqual(this.removeNavigationParameterSpy.getCall(0).args[0], "key", "key entry removed");
		assert.strictEqual(this.navigationTarget.getAllNavigationParameters().length, 0, "Core has no value");
	});
	QUnit.test("Remove parameter by entering empty key", function(assert){
		var oController = this.oNavigationTargetView.getController();
		var navigationParameters = oController.byId("idNavigationParameterBox");
		var firstNavigationParameter = navigationParameters.getItems()[0];
		// Enter key and value for first parameter
		firstNavigationParameter.byId("idNavigationParametersKey").setValue("key");
		firstNavigationParameter.byId("idNavigationParametersValue").setValue("value1");
		firstNavigationParameter.byId("idNavigationParametersValue").fireChange();
		assert.strictEqual(this.addNavigationParameterSpy.getCall(0).args[0], "key", "addNavigationParameter called with key");
		assert.strictEqual(this.addNavigationParameterSpy.getCall(0).args[1], "value1", "addNavigationParameter called with value");
		//Change key
		firstNavigationParameter.byId("idNavigationParametersKey").setValue("");
		firstNavigationParameter.byId("idNavigationParametersValue").fireChange();
		assert.strictEqual(this.removeNavigationParameterSpy.getCall(0).args[0], "key", "key entry removed");
		assert.strictEqual(this.navigationTarget.getAllNavigationParameters().length, 0, "Core has no value");
	});
	QUnit.module("Navigation paramters with initial parameters", {
		beforeEach : function(assert){
			commonSetup.call(this, "fourthNavigationTargetId", assert);
		},
		afterEach: function() {
			commonTeardown.apply(this);
		}
	});
	QUnit.test("Load navigation parameters from saved navigationTarget", function(assert){
		var oController = this.oNavigationTargetView.getController();
		var navigationParameters = oController.byId("idNavigationParameterBox");
		assert.strictEqual(navigationParameters.getItems().length, 2, "Two loaded parameters available");
		var firstNavigationParameter = navigationParameters.getItems()[0];
		assert.strictEqual(firstNavigationParameter.byId("idNavigationParametersKey").getValue(), "key1", "First navigation parameter has correct key");
		assert.strictEqual(firstNavigationParameter.byId("idNavigationParametersValue").getValue(), "value1", "First navigation parameter has correct value");
		var secondNavigationParameter = navigationParameters.getItems()[1];
		assert.strictEqual(secondNavigationParameter.byId("idNavigationParametersKey").getValue(), "key2", "Second navigation parameter has correct key");
		assert.strictEqual(secondNavigationParameter.byId("idNavigationParametersValue").getValue(), "value2", "Second navigation parameter has correct value");
	});
	QUnit.test("Update loaded navigation parameter", function(assert){
		var oController = this.oNavigationTargetView.getController();
		var navigationParameters = oController.byId("idNavigationParameterBox");
		assert.strictEqual(navigationParameters.getItems().length, 2, "Two loaded parameters available");
		var firstNavigationParameter = navigationParameters.getItems()[0];
		assert.strictEqual(firstNavigationParameter.byId("idNavigationParametersKey").getValue(), "key1", "First navigation parameter has correct key");
		assert.strictEqual(firstNavigationParameter.byId("idNavigationParametersValue").getValue(), "value1", "First navigation parameter has correct value");
		assert.strictEqual(this.navigationTarget.getAllNavigationParameters().length, 2, "Two values stored in core");
		firstNavigationParameter.byId("idNavigationParametersKey").setValue("key11");
		firstNavigationParameter.byId("idNavigationParametersValue").setValue("value11");
		firstNavigationParameter.byId("idNavigationParametersValue").fireChange();
		assert.strictEqual(this.removeNavigationParameterSpy.getCall(0).args[0], "key1", "key 1 removed");
		assert.strictEqual(this.addNavigationParameterSpy.getCall(0).args[0], "key11", "key11 added");
		assert.strictEqual(this.addNavigationParameterSpy.getCall(0).args[1], "value11", "value11 added");
		assert.strictEqual(navigationParameters.getItems().length, 2, "Still two loaded parameters available");
		assert.strictEqual(this.navigationTarget.getAllNavigationParameters().length, 2, "Two values stored in core");
	});
	QUnit.module("Validate Navigation Parameters", {
		beforeEach : function(assert){
			commonSetup.call(this, "fourthNavigationTargetId", assert);
		},
		afterEach: function() {
			commonTeardown.apply(this);
		}
	});
	QUnit.test("Validate with no changes", function(assert){
		assert.ok(this.oNavigationTargetController.getValidationState(), "Navigation Target is valid");
	});
	QUnit.test("Remove key and validate", function(assert){
		var navigationParameters = this.oNavigationTargetController.byId("idNavigationParameterBox");
		var firstNavigationParameter = navigationParameters.getItems()[0];
		firstNavigationParameter.byId("idNavigationParametersKey").setValue("");
		firstNavigationParameter.byId("idNavigationParametersKey").fireChange();
		assert.notOk(this.oNavigationTargetController.getValidationState(), "Navigation Target is not valid");
		assert.strictEqual(firstNavigationParameter.byId("idNavigationParametersKey").getValueState(), sap.ui.core.ValueState.Error, "Value state of key entry set to Error");
		assert.strictEqual(firstNavigationParameter.byId("idNavigationParametersKey").getValueStateText(), "navigationParametersKeyErrorState", "Error message set for Key field");
		assert.strictEqual(firstNavigationParameter.byId("idNavigationParametersValue").getValueState(), sap.ui.core.ValueState.None, "No Error for Value field");
		firstNavigationParameter.byId("idNavigationParametersKey").setValue("Key");
		firstNavigationParameter.byId("idNavigationParametersKey").fireChange();
		assert.strictEqual(firstNavigationParameter.byId("idNavigationParametersKey").getValueState(), sap.ui.core.ValueState.None, "Error state removed after entering key");
	});
	QUnit.test("Remove value and validate", function(assert){
		var navigationParameters = this.oNavigationTargetController.byId("idNavigationParameterBox");
		var firstNavigationParameter = navigationParameters.getItems()[0];
		firstNavigationParameter.byId("idNavigationParametersValue").setValue("");
		firstNavigationParameter.byId("idNavigationParametersValue").fireChange();
		assert.notOk(this.oNavigationTargetController.getValidationState(), "Navigation Target is not valid");
		assert.strictEqual(firstNavigationParameter.byId("idNavigationParametersValue").getValueState(), sap.ui.core.ValueState.Error, "Value state of Value entry set to Error");
		assert.strictEqual(firstNavigationParameter.byId("idNavigationParametersValue").getValueStateText(), "navigationParametersValueErrorState", "Error message set for Value field");
		assert.strictEqual(firstNavigationParameter.byId("idNavigationParametersKey").getValueState(), sap.ui.core.ValueState.None, "No Error for Key field");
		firstNavigationParameter.byId("idNavigationParametersValue").setValue("Key");
		firstNavigationParameter.byId("idNavigationParametersValue").fireChange();
		assert.strictEqual(firstNavigationParameter.byId("idNavigationParametersKey").getValueState(), sap.ui.core.ValueState.None, "Error state removed after entering Value");
	});
	QUnit.test("Remove key and value and validate", function(assert){
		var navigationParameters = this.oNavigationTargetController.byId("idNavigationParameterBox");
		var firstNavigationParameter = navigationParameters.getItems()[0];
		firstNavigationParameter.byId("idNavigationParametersKey").setValue("");
		firstNavigationParameter.byId("idNavigationParametersValue").setValue("");
		firstNavigationParameter.byId("idNavigationParametersValue").fireChange();
		assert.ok(this.oNavigationTargetController.getValidationState(), "Navigation Target is valid");
	});
	QUnit.test("Enter duplicate field and validate", function(assert){
		var navigationParameters = this.oNavigationTargetController.byId("idNavigationParameterBox");
		var firstNavigationParameter = navigationParameters.getItems()[0];
		firstNavigationParameter.byId("idNavigationParametersKey").setValue("key2");
		firstNavigationParameter.byId("idNavigationParametersValue").fireChange();
		assert.notOk(this.oNavigationTargetController.getValidationState(), "Navigation Target is not valid");
		assert.strictEqual(firstNavigationParameter.byId("idNavigationParametersKey").getValueState(), sap.ui.core.ValueState.Error, "Value state of key entry set to Error");
		assert.strictEqual(firstNavigationParameter.byId("idNavigationParametersKey").getValueStateText(), "navigationParametersKeyErrorState", "Error message set for Key field");
		assert.strictEqual(firstNavigationParameter.byId("idNavigationParametersValue").getValueState(), sap.ui.core.ValueState.None, "No Error for Value field");
		firstNavigationParameter.byId("idNavigationParametersKey").setValue("Key");
		firstNavigationParameter.byId("idNavigationParametersKey").fireChange();
		assert.strictEqual(firstNavigationParameter.byId("idNavigationParametersKey").getValueState(), sap.ui.core.ValueState.None, "Error state removed after entering key");
	});
})();