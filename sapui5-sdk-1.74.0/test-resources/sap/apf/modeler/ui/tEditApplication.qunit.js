sap.ui.define([
	'sap/apf/core/messageObject'
], function(MessageObject){
	'use strict';

	//function to return handle change event
	function _getEvent(sValue) {
		return {
			getParameters : function() {
				return {
					value : sValue
				};
			}
		};
	}
	function doNothing() {
	}
	QUnit.module("Edit an application", {
		beforeEach : function(assert) {
			var that = this;
			var applicationController = sap.ui.controller("sap.apf.modeler.ui.controller.editApplication");
			var spyOnInit = sinon.spy(applicationController, "onInit");
			this.applicationHandler = {
					setAndSave : function(appObj, uiCallback, id) {
						uiCallback("", {}, undefined);
					}
			};
			this.configurationHandler = {
				getTextPool : function() {
					return that.textPool;
				}
			};
			this.modelerCore = {
					getText : function(key) {
						return "text : " + key;
					},
					showSemanticObject : function () {
						return true;
					},
					getApplicationHandler : function(callback) {
						callback(that.applicationHandler);
					},
					createMessageObject : function(settings) {
						return new MessageObject(settings);
					},
					putMessage : function() {
					}
			};
			this.getTextSpy = sinon.spy(this.modelerCore, "getText");
			this.applicationView = sap.ui.view({
					viewName : "sap.apf.modeler.ui.view.editApplication",
					type : sap.ui.core.mvc.ViewType.XML,
					controller : applicationController,
					viewData : {
						parentControl : new sap.m.Table(),
						coreApi : this.modelerCore,
						applicationData : {
							id : "1111",
							description : "myApplication",
							semanticObject : "semanticObjectName"
						}
					}
			});
			assert.strictEqual(spyOnInit.calledOnce, true, "then new application onInit function is called when view is initialized");
		},
		afterEach : function() {
			this.getTextSpy.restore();
			this.applicationView.destroy();
		}
	});
	QUnit.test("When the edit application view is initialized", function(assert) {
		//arrangement
		var oDialog = this.applicationView.byId("idEditAppDialog");
		//assertions
		assert.ok(this.applicationView, "then new application view exists");
		assert.ok(oDialog, "then Dialog to add an application exists");
		assert.strictEqual(oDialog.isOpen(), true, "then Dialog to add an application is opened on UI");
		assert.strictEqual(this.applicationView.byId("idDescriptionInput").getValue(), "myApplication", "then application description is initialized when view is initialized");
		assert.strictEqual(this.applicationView.byId("idSemanticObjectInput").getValue(), "semanticObjectName", "then semantic object is initialized");
		assert.strictEqual(this.applicationView.byId("idEditAppDialog").getTitle(), "text : editApplication", "then title is set correctly for new application dialog");
		assert.strictEqual(this.applicationView.byId("idDescriptionLabel").getText(), "text : description", "then text for description label is set correctly");
		assert.strictEqual(this.applicationView.byId("idSemanticObjectLabel").getText(), "text : semanticObject", "then text for semantic object label is set correctly");
		assert.strictEqual(this.applicationView.byId("idSaveButton").getText(), "text : save", "then text for save button of dialog is set correctly");
		assert.strictEqual(this.applicationView.byId("idCancelButton").getText(), "text : cancel", "then text for cancel button of dialog is set correctly");
		assert.strictEqual(this.applicationView.byId("idSaveButton").getEnabled(), false, "then save button of dialog is disabled since decription is blank initially");
	});
	QUnit.test("When application description is changed and valid value is given in the description field", function(assert) {
		//arrangement
		var oEvent = _getEvent("TestApplication");
		//action
		this.applicationView.getController().handleAppDescriptionLiveChange(oEvent);
		//assertion
		assert.strictEqual(this.applicationView.byId("idSaveButton").getEnabled(), true, "then Save button is enabled since application description was provided");
	});
	QUnit.test("When application description is changed and EMPTY value is given in the description field", function(assert) {
		//arrangement
		var oEvent = _getEvent("");
		//action
		this.applicationView.getController().handleAppDescriptionLiveChange(oEvent);
		//assertion
		assert.strictEqual(this.applicationView.byId("idSaveButton").getEnabled(), false, "then Save button is disabled since application description was NOT provided");
	});
	QUnit.test("When semantic object is changed and INVALID value is given in the description field before", function(assert) {
		//arrangement
		this.applicationView.byId("idDescriptionInput").setValue("");
		var oEvent = _getEvent("validSemanticObject");
		//action
		this.applicationView.getController().handleSemanticObjectLiveChange(oEvent);
		//assertion
		assert.strictEqual(this.applicationView.byId("idSaveButton").getEnabled(), false, "then Save button is disabled since application description was NOT provided");
	});
	QUnit.test("When semantic object is changed and OLD value is given in the description field before", function(assert) {
		//arrangement
		this.applicationView.byId("idDescriptionInput").setValue("newApp");
		var oEvent = _getEvent("validSemanticObject");
		//action
		this.applicationView.getController().handleSemanticObjectLiveChange(oEvent);
		assert.strictEqual(this.applicationView.byId("idSaveButton").getEnabled(), true, "then Save button is enabled");
		oEvent = _getEvent("myApplication");
		//action
		this.applicationView.getController().handleAppDescriptionLiveChange(oEvent);
		assert.strictEqual(this.applicationView.byId("idSaveButton").getEnabled(), true, "then Save button remains enabled");

		//assertion
	});
	QUnit.test("When semantic object is changed and valid value is already set in the description field", function(assert) {
		//arrangement
		this.applicationView.byId("idDescriptionInput").setValue("newDescription");
		var oEvent = _getEvent("validSemanticObject");
		//action
		this.applicationView.getController().handleSemanticObjectLiveChange(oEvent);
		//assertion
		assert.strictEqual(this.applicationView.byId("idSaveButton").getEnabled(), true, "then Save button is enabled since application description was provided");
	});
	QUnit.test("When semantic object is changed and valid value is given in the description field before", function(assert) {
		//arrangement
		var oEvent = _getEvent("validSemanticObject");
		//action
		this.applicationView.getController().handleSemanticObjectLiveChange(oEvent);
		//assertion
		assert.strictEqual(this.applicationView.byId("idSaveButton").getEnabled(), true, "then Save button is enabled since application description was provided");
	});
	QUnit.test("When semantic object is set to initial and valid value is given in the description field before", function(assert) {
		//arrangement
		this.applicationView.byId("idDescriptionInput").setValue("newDescription");
		var oEvent = _getEvent("");
		//action
		this.applicationView.getController().handleSemanticObjectLiveChange(oEvent);
		//assertion
		assert.strictEqual(this.applicationView.byId("idSaveButton").getEnabled(), true, "then Save button is enabled since application description was provided");
	});
	QUnit.test("When clicking on Save button of Dialog and save is successful", function(assert) {
		//arrangement
		var appObj = {
			Application: "1111",
			ApplicationName : "Test Application",
			SemanticObject : "FioriApplication"
		};

		var setAndSaveSpy = sinon.spy(this.applicationHandler, "setAndSave");
		var updateAppListSpy = sinon.spy(this.applicationView.getViewData().parentControl, "fireEvent");
		this.applicationView.byId("idDescriptionInput").setValue("Test Application");
		this.applicationView.byId("idSemanticObjectInput").setValue("FioriApplication");
		//action
		this.applicationView.byId("idEditAppDialog").getButtons()[0].firePress();
		sap.ui.getCore().applyChanges();
		//assertion
		assert.strictEqual(setAndSaveSpy.calledOnce, true, "then modeler core method to set and save application called");
		assert.deepEqual(setAndSaveSpy.getCall(0).args[0], appObj, "then modeler core setAndSave method called with correct app object");
		assert.ok(setAndSaveSpy.getCall(0).args[1] instanceof Function, "then modeler core setAndSave methods second parameter is the UI callback");
		assert.strictEqual(setAndSaveSpy.getCall(0).args[2], "1111", "then modeler core setAndSave methods third parameter is the application id");
		assert.strictEqual(updateAppListSpy.calledOnce, true, "then event to update application list is fired");
		assert.strictEqual(updateAppListSpy.calledWith("updateAppListEvent"), true, "then event to update application list is fired with correct parameters");
		//cleanup
		this.applicationView.getViewData().parentControl.fireEvent.restore();
	});
	QUnit.test("When clicking on Save button of Dialog and error occured in saving(messageobject is not undefined)", function(assert) {
		//arrangement
		var appObj = {
			Application: "1111",
			ApplicationName : "Test Application",
			SemanticObject : "FioriApplication"
		};

		this.applicationHandler.setAndSave = function(appObject, uiCallback, id) {
			uiCallback("", {}, true);
		};
		var setAndSaveSpy = sinon.spy(this.applicationHandler, "setAndSave");
		var updateAppListSpy = sinon.spy(this.applicationView.getViewData().parentControl, "fireEvent");
		var coreErrorMessageSpy = sinon.spy(this.applicationView.getViewData().coreApi, "putMessage");
		this.applicationView.byId("idDescriptionInput").setValue("Test Application");
		this.applicationView.byId("idSemanticObjectInput").setValue("FioriApplication");
		//action
		this.applicationView.byId("idEditAppDialog").getButtons()[0].firePress();
		sap.ui.getCore().applyChanges();
		//assertion
		assert.strictEqual(setAndSaveSpy.calledOnce, true, "then modeler core method to set and save applictaion called");
		assert.deepEqual(setAndSaveSpy.getCall(0).args[0], appObj, "then modeler core setAndSave method called with correct app object");
		assert.ok(setAndSaveSpy.getCall(0).args[1] instanceof Function, "then modeler core setAndSave methods second parameter is the UI callback");
		assert.strictEqual(updateAppListSpy.calledOnce, false, "then event to update application list is not fired since there was an error in saving");
		assert.strictEqual(coreErrorMessageSpy.calledOnce, true, "then error message is logged");
		assert.strictEqual(coreErrorMessageSpy.getCall(0).args[0].getCode(), "11500", "THEN error messageCode as expected");
		//cleanup
		this.applicationView.getViewData().parentControl.fireEvent.restore();
	});
	QUnit.test("When clicking on Save button of Dialog and service is not available", function(assert) {
		//arrangement
		var putMessageSpy = sinon.stub(this.applicationView.getViewData().coreApi, 'putMessage', doNothing);
		var getApplicationHandlerStub = function(callback) {
			callback(null, true);
		};
		sinon.stub(this.applicationView.getViewData().coreApi, "getApplicationHandler", getApplicationHandlerStub);
		this.applicationView.byId("idDescriptionInput").setValue("Test Application");
		this.applicationView.byId("idSemanticObjectInput").setValue("FioriApplication");
		//action
		this.applicationView.byId("idEditAppDialog").getButtons()[0].firePress();
		sap.ui.getCore().applyChanges();
		assert.strictEqual(putMessageSpy.calledOnce, true, "then error message is logged");
		assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "11509", "THEN error messageCode as expected");
		//cleanup
		this.applicationView.getViewData().coreApi.putMessage.restore();
	});
	QUnit.test("When clicking on Cancel button of Dialog", function(assert) {
		var setAndSaveSpy = sinon.spy(this.applicationHandler, "setAndSave");
		var dialog = this.applicationView.byId("idEditAppDialog");
		var closeDialogSpy = sinon.spy(dialog, "close");
		this.applicationView.byId("idDescriptionInput").setValue("Test Application");
		this.applicationView.byId("idSemanticObjectInput").setValue("FioriApplication");
		this.applicationView.byId("idEditAppDialog").getButtons()[1].firePress();
		sap.ui.getCore().applyChanges();
		assert.strictEqual(closeDialogSpy.calledOnce, true, "then view is destroyed");
		assert.strictEqual(setAndSaveSpy.callCount, 0, "THEN save was not called");
		setAndSaveSpy.restore();
		closeDialogSpy.restore();
	});
	QUnit.module("Semantic object shall not be shown", {
		beforeEach : function(assert) {
			var applicationController = new sap.ui.controller("sap.apf.modeler.ui.controller.editApplication");
			var coreApi = {
					showSemanticObject : function() { return false; },
					getText : function(key) {
						if (key === "semanticObject") {
							assert.notEqual(key, "semanticObject", "THEN text for semantic object is not requested");
						}
						return key;
					}
			};
			this.applicationView = new sap.ui.view({
					viewName : "sap.apf.modeler.ui.view.editApplication",
					type : sap.ui.core.mvc.ViewType.XML,
					controller : applicationController,
					viewData : {
						parentControl : new sap.m.Table(),
						coreApi : coreApi,
						applicationData : {
							id : "1111",
							description : "myApplication",
							semanticObject : "semanticObjectName"
						}
					}
				});
		},
		afterEach : function() {
			this.applicationView.destroy();
		}
	});
	QUnit.test("WHEN method showSemanticObject returns false", function(assert){
		assert.strictEqual(this.applicationView.byId("idSemanticObjectInput").getValue(), "", "then semantic object is set to empty String");
		assert.strictEqual(this.applicationView.byId("idSemanticObjectBox").getVisible(), false, "then semantic object label and input field is invisible");
	});
});