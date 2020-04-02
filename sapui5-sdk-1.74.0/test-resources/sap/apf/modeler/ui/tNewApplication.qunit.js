jQuery.sap.declare('sap.apf.modeler.ui.tNewApplication');
jQuery.sap.require("sap.apf.utils.utils");
jQuery.sap.require("sap.apf.core.messageObject");
(function() {
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
	QUnit.module("Adding a new application", {
		beforeEach : function(assert) {
			var that = this;
			var applicationController = new sap.ui.controller("sap.apf.modeler.ui.controller.newApplication");
			var spyOnInit = sinon.spy(applicationController, "onInit");
			this.applicationHandler = {
					setAndSave : function(appObj, uiCallback) {
						uiCallback("", {}, undefined);
					}
			};
			this.modelerCore = {
					getText : function(key) {
						return key;
					},
					showSemanticObject : function () {
						return true;
					},
					getApplicationHandler : function(callback) {
						callback(that.applicationHandler);
					},
					createMessageObject : function(settings) {
						return new sap.apf.core.MessageObject(settings);
					},
					putMessage : function() {
					}
			};
			this.getTextSpy = sinon.spy(this.modelerCore, "getText");
			this.applicationView = new sap.ui.view({
					viewName : "sap.apf.modeler.ui.view.newApplication",
					type : sap.ui.core.mvc.ViewType.XML,
					controller : applicationController,
					viewData : {
						oParentControl : new sap.m.Table(),
						oCoreApi : this.modelerCore
					}
			});
			assert.strictEqual(spyOnInit.calledOnce, true, "then new application onInit function is called when view is initialized");
		},
		afterEach : function() {
			this.getTextSpy.restore();
			this.applicationView.destroy();
		}
	});
	QUnit.test("When new application view is initialized", function(assert) {
		//arrangement
		var oDialog = this.applicationView.byId("idNewAppDialog");
		//assertions
		assert.ok(this.applicationView, "then new application view exists");
		assert.ok(oDialog, "then Dialog to add an application exists");
		assert.strictEqual(oDialog.isOpen(), true, "then Dialog to add an application is opened on UI");
		assert.strictEqual(this.applicationView.byId("idDescriptionInput").getValue(), "", "then application description is blank when view is initialized");
		assert.strictEqual(this.applicationView.byId("idSemanticObjectInput").getValue(), "FioriApplication", "then semantic object is set to 'FioriApplication' already");
		assert.strictEqual(this.getTextSpy.calledWith("newApplication"), true, "then title is set correctly for new application dialog");
		assert.strictEqual(this.getTextSpy.calledWith("description"), true, "then text for description label is set correctly");
		assert.strictEqual(this.getTextSpy.calledWith("semanticObject"), true, "then text for semantic object label is set correctly");
		assert.strictEqual(this.getTextSpy.calledWith("save"), true, "then text for save button of dialog is set correctly");
		assert.strictEqual(this.getTextSpy.calledWith("cancel"), true, "then text for cancel button of dialog is set correctly");
		assert.strictEqual(this.applicationView.byId("idSaveButton").getEnabled(), false, "then save button of dialog is disabled since decription is blank initially");
	});
	QUnit.test("When application description is changed and valid value is given in the description field", function(assert) {
		//arrangement
		var oEvent = _getEvent("TestApplication");
		//action
		this.applicationView.getController().handleAppDescriptionLiveChange(oEvent);
		//assertion
		assert.strictEqual(this.applicationView.byId("idSaveButton").getEnabled(), true, "then Save button is enabled since application decription was provided");
	});
	QUnit.test("When application description is changed and invalid value is given in the description field", function(assert) {
		//arrangement
		var oEvent = _getEvent(" ");
		//action
		this.applicationView.getController().handleAppDescriptionLiveChange(oEvent);
		//assertion
		assert.strictEqual(this.applicationView.byId("idSaveButton").getEnabled(), false, "then Save button is disabled since application decription was not provided");
	});
	QUnit.test("When clicking on Save button of Dialog and save is successful", function(assert) {
		//arrangement
		var appObj = {
			ApplicationName : "Test Application",
			SemanticObject : "FioriApplication"
		};

		var setAndSaveSpy = sinon.spy(this.applicationHandler, "setAndSave");
		var updateAppListSpy = sinon.spy(this.applicationView.getViewData().oParentControl, "fireEvent");
		this.applicationView.byId("idDescriptionInput").setValue("Test Application");
		this.applicationView.byId("idSemanticObjectInput").setValue("FioriApplication");
		//action
		this.applicationView.byId("idNewAppDialog").getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		//assertion
		assert.strictEqual(setAndSaveSpy.calledOnce, true, "then modeler core method to set and save application called");
		assert.deepEqual(setAndSaveSpy.getCall(0).args[0], appObj, "then modeler core setAndSave method called with correct app object");
		assert.ok(setAndSaveSpy.getCall(0).args[1] instanceof Function, "then modeler core setAndSave methods second parameter is the UI callback");
		assert.strictEqual(updateAppListSpy.calledOnce, true, "then event to update application list is fired");
		assert.strictEqual(updateAppListSpy.calledWith("addNewAppEvent"), true, "then event to update application list is fired with correct parameters");
		//cleanup
		this.applicationView.getViewData().oParentControl.fireEvent.restore();
	});
	QUnit.test("When clicking on Save button of Dialog and error occured in saving(messageobject is not undefined)", function(assert) {
		//arrangement
		var appObj = {
			ApplicationName : "Test Application",
			SemanticObject : "FioriApplication"
		};

		this.applicationHandler.setAndSave = function(appObject, uiCallback) {
			uiCallback("", {}, true);
		};
		var setAndSaveSpy = sinon.spy(this.applicationHandler, "setAndSave");
		var updateAppListSpy = sinon.spy(this.applicationView.getViewData().oParentControl, "fireEvent");
		var coreErrorMessageSpy = sinon.spy(this.applicationView.getViewData().oCoreApi, "putMessage");
		this.applicationView.byId("idDescriptionInput").setValue("Test Application");
		this.applicationView.byId("idSemanticObjectInput").setValue("FioriApplication");
		//action
		this.applicationView.byId("idNewAppDialog").getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		//assertion
		assert.strictEqual(setAndSaveSpy.calledOnce, true, "then modeler core method to set and save applictaion called");
		assert.deepEqual(setAndSaveSpy.getCall(0).args[0], appObj, "then modeler core setAndSave method called with correct app object");
		assert.ok(setAndSaveSpy.getCall(0).args[1] instanceof Function, "then modeler core setAndSave methods second parameter is the UI callback");
		assert.strictEqual(updateAppListSpy.calledOnce, false, "then event to update application list is not fired since there was an error in saving");
		assert.strictEqual(coreErrorMessageSpy.calledOnce, true, "then error message is logged");
		assert.strictEqual(coreErrorMessageSpy.getCall(0).args[0].getCode(), "11500", "THEN error messageCode as expected");
		//cleanup
		this.applicationView.getViewData().oParentControl.fireEvent.restore();
	});
	QUnit.test("When clicking on Save button of Dialog and service is not available", function(assert) {
		//arrangement
		var putMessageSpy = sinon.stub(this.applicationView.getViewData().oCoreApi, 'putMessage', doNothing);
		var getApplicationHandlerStub = function(callback) {
			callback(null, true);
		};
		sinon.stub(this.applicationView.getViewData().oCoreApi, "getApplicationHandler", getApplicationHandlerStub);
		this.applicationView.byId("idDescriptionInput").setValue("Test Application");
		this.applicationView.byId("idSemanticObjectInput").setValue("FioriApplication");
		//action
		this.applicationView.byId("idNewAppDialog").getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		assert.strictEqual(putMessageSpy.calledOnce, true, "then error message is logged");
		//cleanup
		this.applicationView.getViewData().oCoreApi.putMessage.restore();
	});
	QUnit.test("When clicking on Cancel button of Dialog", function(assert) {
		//action
		this.applicationView.byId("idNewAppDialog").getEndButton().firePress();
		sap.ui.getCore().applyChanges();
		//assertion
		assert.strictEqual(this.applicationView.bIsDestroyed, true, "then view is destroyed");
	});

	QUnit.module("Semantic object shall not be shown", {
		beforeEach : function(assert) {
			var applicationController = new sap.ui.controller("sap.apf.modeler.ui.controller.newApplication");
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
					viewName : "sap.apf.modeler.ui.view.newApplication",
					type : sap.ui.core.mvc.ViewType.XML,
					controller : applicationController,
					viewData : {
						oParentControl : new sap.m.Table(),
						oCoreApi : coreApi
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
}());