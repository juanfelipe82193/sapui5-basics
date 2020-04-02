/* Test the application list controller and view of the modeler */

sap.ui.define("sap.apf.modeler.ui.tApplicationList", [
	'sap/apf/core/messageObject',
	'sap/m/Text'
], function(MessageObject, Text){
	'use strict';

	function _getAppListStub() {
		return [ {
			Application : "1",
			ApplicationName : "app1",
			SemanticObject : "so1"
		}, {
			Application : "2",
			ApplicationName : "app2",
			SemanticObject : "so2"
		} ];
	}
	function _doNothing() {
	}

	QUnit.module("Application list Unit tests", {
		beforeEach : function(assert) {
			var that = this;
			this.applicationListController = new sap.ui.controller("sap.apf.modeler.ui.controller.applicationList");
			var spyOnInit = sinon.spy(this.applicationListController, "onInit");

			sap.ui.core.UIComponent.extend("sap.apf.modeler.Component", {});
			this.getRouterSpy = sinon.stub(sap.ui.core.UIComponent, "getRouterFor", function() {
				return {
					attachRoutePatternMatched : _doNothing,
					navTo : _doNothing
				};
			});
			this.applicationHandler = {
					setAndSave : function(appObj, uiCallback) {
						uiCallback("", {}, undefined);
					},
					removeApplication : _doNothing,
					getList : _getAppListStub
			};
			this.getAppListSpy = sinon.spy(this.applicationHandler, "getList");
			this.textPool = {
					removeTexts : function(aUnusedTexts, appId, callback) {
						callback(undefined);
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
					getConfigurationHandler : function(appId, callback) {
						callback(that.configurationHandler);
					},
					getUnusedTextKeys : function(appId, callback) {
						callback(["unusedKey1, unusedKey2"], undefined);
					},
					createMessageObject : function(settings) {
						return new MessageObject(settings);
					},
					putMessage : function() {
					},
					isVendorContentAvailable : _doNothing,
					readAllConfigurationsFromVendorLayer : _doNothing
				};
			this.getApplicationHandlerSpy = sinon.spy(this.modelerCore, "getApplicationHandler");
			this.getOwnerComponentSpy = sinon.stub(this.applicationListController, "getOwnerComponent", function() {
				return {
					oCoreApi : that.modelerCore
				};
			});
			this.getTextSpy = sinon.spy(this.modelerCore, "getText");
			this.applicationListView = new sap.ui.view({
				viewName : "sap.apf.modeler.ui.view.applicationList",
				type : sap.ui.core.mvc.ViewType.XML,
				controller : this.applicationListController
			});
			assert.strictEqual(spyOnInit.calledOnce, true, "then applicationList onInit function is called when view is initialized");
			spyOnInit.restore();
		},
		_editAppDescriptionAndSemanticObject : function() {
			this.applicationListView.getController().handleOnLiveChange();
			this.applicationListView.byId("idApplicationTable").getModel().getData().Objects[0].id = "3";
			this.applicationListView.byId("idApplicationTable").getModel().getData().Objects[0].description = "app3";
			this.applicationListView.byId("idApplicationTable").getModel().getData().Objects[0].semanticObject = "so3";
		},
		assertButtonsAndApplicationListAreInValidState : function(assert) {
			assert.strictEqual(this.applicationListView.byId("idNewButton").getEnabled(), true, "then Add New application button is enabled");
			assert.strictEqual(this.applicationListView.byId("idImportButton").getVisible(), true, "then Import Button is visible");
			assert.strictEqual(this.applicationListView.byId("idImportButton").getEnabled(), true, "then Import Button is enabled");
			assert.strictEqual(this.applicationListView.byId("idApplicationTable").getMode(), "None", "then Application table mode is set to None");
			assert.strictEqual(this.applicationListView.byId("idApplicationTable").getItems()[0].getType(), "Navigation", "then all list items are in navigation mode");
			assert.strictEqual(this.applicationListView.byId("idApplicationTable").getItems()[0].getCells()[0].getVisible(), true, "then Application Description input is visible");
			assert.strictEqual(this.applicationListView.byId("idApplicationTable").getItems()[0].getCells()[1].getVisible(), true, "then Semantic Object input is visible");
			assert.strictEqual(this.applicationListView.byId("idApplicationTable").getItems()[0].getCells()[2].getVisible(), true, "then textpool cleanup icon is visibile");
			assert.strictEqual(this.applicationListView.byId("idApplicationTable").getItems()[0].getCells()[2].getTooltip(), "text : textCleanUp", "then textpool cleanup icon tooltip is set");
			assert.strictEqual(this.applicationListView.byId("idApplicationTable").getItems()[0].getCells()[3].getVisible(), true, "then edit icon is visibile");
			assert.strictEqual(this.applicationListView.byId("idApplicationTable").getItems()[0].getCells()[3].getTooltip(), "text : editApplication", "then Edit icon tooltip is set");
			assert.strictEqual(this.applicationListView.byId("idApplicationTable").getItems()[0].getCells()[4].getVisible(), true, "then delete icon is visibile");
			assert.strictEqual(this.applicationListView.byId("idApplicationTable").getItems()[0].getCells()[4].getTooltip(), "text : deleteApplication", "then Delete icon tooltip is set");
		},
		getDialogByTitleKey : function(key) {
			sap.ui.getCore().applyChanges();
			var title = this.modelerCore.getText(key);
			var oExpectedDialog;
			jQuery.each(jQuery('.sapMDialog'), function(name, element) {
				var oDialog = sap.ui.getCore().byId(element.getAttribute("id"));
				if (title.indexOf(oDialog.getTitle()) !== -1 && oDialog.getTitle() !== "") { // matching even if text resource missing
					oExpectedDialog = oDialog;
				}
			});
			return oExpectedDialog;
		},
		afterEach : function() {
			this.getRouterSpy.restore();
			this.getOwnerComponentSpy.restore();
			this.getTextSpy.restore();
			this.getApplicationHandlerSpy.restore();
			this.getAppListSpy.restore();
			this.applicationListView.destroy();
		}
	});
	QUnit.test("When applicationList view is initialized", function(assert) {
		//arrangement
		var oExpectedData = {
			Objects : [ {
				description : "app1",
				id : "1",
				semanticObject : "so1"
			}, {
				description : "app2",
				id : "2",
				semanticObject : "so2"
			} ]
		};
		//assertions
		assert.ok(this.applicationListView, "then applicationList view exists");
		assert.strictEqual(this.getOwnerComponentSpy.calledOnce, true, "then getOwnerComponent of applicationList controller called once");
		assert.strictEqual(this.getTextSpy.calledWith("configModelerTitle"), true, "then title for entire configuration modeler application is set correctly");
		assert.strictEqual(this.getTextSpy.calledWith("applicationOverview"), true, "then title for application overview screen is set correctly");
		assert.strictEqual(this.getTextSpy.calledWith("applications"), true, "then label for displaying application count is set correctly");
		assert.strictEqual(this.getTextSpy.calledWith("description"), true, "then column header for description in table is set correctly");
		assert.strictEqual(this.getTextSpy.calledWith("semanticObject"), true, "then column header for semantic object in table is set correctly");
		assert.strictEqual(this.getTextSpy.calledWith("import"), true, "then text for import button is requested");
		assert.strictEqual(this.applicationListView.byId("idImportButton").getText(), "text : import", "then text for import button is set correctly");
		assert.strictEqual(this.applicationListView.byId("idImportButton").getTooltip(), "text : importConfig", "then tooltip for import button is set correctly");
		assert.strictEqual(this.getTextSpy.calledWith("newApplication"), true, "then tooltip for newApplication button is requested");
		assert.strictEqual(this.getTextSpy.calledWith("new"), true, "then text for newApplication button is requested");
		assert.strictEqual(this.applicationListView.byId("idNewButton").getText(), "text : new", "then text for new button  is set correctly");
		assert.strictEqual(this.applicationListView.byId("idNewButton").getTooltip(), "text : newApplication", "then tooltip for new button  is set correctly");
		assert.strictEqual(this.getTextSpy.calledWith("editApplication"), true, "then text for edit application icon is set correctly");
		assert.strictEqual(this.getTextSpy.calledWith("deleteApplication"), true, "then text for delete application icon is set correctly");
		assert.strictEqual(this.getApplicationHandlerSpy.calledOnce, true, "then getApplicationHandlerSpy is called once");
		assert.strictEqual(this.getAppListSpy.calledOnce, true, "then getAppListSpy is called once");
		assert.strictEqual(this.applicationListView.byId("idAppCount").getText(), "(2)", "then application count is set correctly");
		assert.deepEqual(this.applicationListView.byId("idApplicationTable").getModel().getData(), oExpectedData, "then model with expected data is set to the table");
		//assertions for events attached to controls
		assert.strictEqual(this.applicationListView.byId("idApplicationTable").mEventRegistry.hasOwnProperty("addNewAppEvent"), true, "then addNewAppEvent is attached to the table");
		assert.strictEqual(this.applicationListView.byId("idApplicationTable").mEventRegistry.hasOwnProperty("updateAppListEvent"), true, "then updateAppListEvent is attached to the table");
		assert.strictEqual(this.applicationListView.byId("idApplicationTable").getColumns()[1].getVisible(), true, "THEN semantic object column is visible");
	});
	QUnit.test("When add new application button is clicked", function(assert) {
		//action
		this.applicationListView.byId("idNewButton").firePress();
		sap.ui.getCore().applyChanges();
		//assertions
		assert.strictEqual(this.applicationListView.getDependents()[0].getViewName(), "sap.apf.modeler.ui.view.newApplication", "then newApplication view is instantiated");
		assert.strictEqual(this.applicationListView.getDependents()[0].byId("idNewAppDialog").isOpen(), true, "then dialog to add new application is opened");
		//cleanup
		this.applicationListView.getDependents()[0].byId("idNewAppDialog").getEndButton().firePress();
		sap.ui.getCore().applyChanges();
		this.applicationListView.removeAllDependents();
	});
	QUnit.test("When edit icon on an application list item in first row is pressed", function(assert) {
		var done = assert.async();
		var testContext = this;
		var originalView = sap.ui.view;
		var editApplicationView;
		var expectedApplicationData = {
				description : "app1",
				id : "1",
				semanticObject : "so1"
		};
		var viewStub = function(configurationData) {
			var View = function(settings) {
			//assertions
			assert.deepEqual(settings.viewData.applicationData, expectedApplicationData, "THEN application data has been handed over to the view");
			assert.strictEqual(settings.viewData.coreApi, testContext.modelerCore, "THEN modelerCore has been handed over to the view");
			assert.strictEqual(settings.async, true, "THEN view is loaded in async mode");

			settings.async = false;
			editApplicationView = originalView(settings);

			this.loaded = function() {
				var deferred = jQuery.Deferred();
				deferred.resolve(editApplicationView);
				return deferred.promise();
				};
			};
			return new View(configurationData);
		};
		var editApplicationViewSpy = sinon.stub(sap.ui, "view", viewStub);
		//action
		this.applicationListView.byId("idApplicationTable").getItems()[0].getCells()[3].firePress();
		sap.ui.getCore().applyChanges();

		//cleanup
		editApplicationView.loaded().then(function(){
			editApplicationView.byId("idEditAppDialog").close();
			testContext.applicationListView.removeAllDependents();
			editApplicationViewSpy.restore();
			done();
		});
	});
	QUnit.test("When edit icon on an application list item in second row is pressed", function(assert) {
		var done = assert.async();
		var testContext = this;
		var originalView = sap.ui.view;
		var editApplicationView;
		var expectedApplicationData = {
				description : "app2",
				id : "2",
				semanticObject : "so2"
		};
		var viewStub = function(configurationData) {
			var View = function(settings) {
			//assertions
			assert.strictEqual(settings.viewName, "sap.apf.modeler.ui.view.editApplication", "THEN correct view name");
			assert.deepEqual(settings.viewData.applicationData, expectedApplicationData, "THEN application data has been handed over to the view");
			assert.strictEqual(settings.viewData.coreApi, testContext.modelerCore, "THEN modelerCore has been handed over to the view");
			assert.strictEqual(settings.async, true, "THEN view is loaded in async mode");

			settings.async = false;
			editApplicationView = originalView(settings);

			this.loaded = function() {
				var deferred = jQuery.Deferred();
				deferred.resolve(editApplicationView);
				return deferred.promise();
				};
			};
			return new View(configurationData);
		};
		var editApplicationViewSpy = sinon.stub(sap.ui, "view", viewStub);
		this.applicationListView.byId("idApplicationTable").getItems()[1].getCells()[3].firePress();
		sap.ui.getCore().applyChanges();

		//cleanup
		editApplicationView.loaded().then(function(){
			editApplicationView.byId("idEditAppDialog").close();
			testContext.applicationListView.removeAllDependents();
			editApplicationViewSpy.restore();
			done();
		});
	});
	QUnit.test("When list item is pressed from table", function(assert) {
		//arrangement
		var mParameters = {
			listItem : this.applicationListView.byId("idApplicationTable").getItems()[0],
			srcControl : this.applicationListView.byId("idApplicationTable")
		};
		this.applicationListView.byId("idApplicationTable").fireItemPress(mParameters);
		sap.ui.getCore().applyChanges();
		//assertion
		assert.strictEqual(this.getRouterSpy.calledOnce, true, "then navigation to configuration list view happened");
	});
	QUnit.test("When either description or semantic object is clicked", function(assert) {
		//arrangement
		var oEvt = {
			currentTarget : {
				id : this.applicationListView.byId("idApplicationTable").getItems()[0].getCells()[0].getId()
			}
		};
		//action
		this.applicationListView.getController().handleNavigationToConfigurationList(oEvt);
		//assertion
		assert.strictEqual(this.getRouterSpy.calledOnce, true, "then navigation to configuration list view happened");
	});
	QUnit.test("When textpool cleanup icon on an application list item is pressed AND then the cancel button is pressed", function(assert) {
		var fragmentId = "idTextpoolCleanupConfirmationFragment";
		//action
		
		this.applicationListView.byId("idApplicationTable").getItems()[0].getCells()[2].firePress();
		sap.ui.getCore().applyChanges();
		//assertions
		assert.strictEqual(sap.ui.core.Fragment.byId(fragmentId, "idTextpoolCleanupConfirmation").getTitle(), "text : confirmation", "THEN title set as expected");
		assert.strictEqual(this.getTextSpy.calledWith("ok"), true, "then text of confirm button is set correctly");
		assert.strictEqual(this.getTextSpy.calledWith("cancel"), true, "then text of cancel button is set correctly");
		assert.strictEqual(sap.ui.core.Fragment.byId(fragmentId, "idConfirmTextpoolCleanupButton").getText(), "text : ok", "THEN ok button text set as expected");
		assert.strictEqual(sap.ui.core.Fragment.byId(fragmentId, "idCancelTextpoolCleanupButton").getText(), "text : cancel", "THEN cancel button text set as expected");

		assert.strictEqual(this.getTextSpy.calledWith("textpoolCleanupConfirmation"), true, "then message inside confirmation dialog is set correctly");
		assert.strictEqual(this.applicationListView.getDependents()[0].getContent()[0].getText(), "text : textpoolCleanupConfirmation", "THEN  text set as expected");

		this.applicationListView.getDependents()[0].getEndButton().firePress();
		sap.ui.getCore().applyChanges();
		assert.strictEqual(this.applicationListView.getDependents()[0], undefined, "then on cancel press text pool cleanup confirmation dialog is destroyed");
		//cleanup
		this.applicationListView.removeAllDependents();
	});
	QUnit.test("When textpool cleanup icon on an application list item is pressed AND then the ok button is pressed", function(assert) {
		//arrangement
		var coreApi = this.modelerCore;
		var getConfigurationHandlerSpy = sinon.spy(coreApi, "getConfigurationHandler");
		var getUnusedTextKeysSpy = sinon.spy(coreApi, "getUnusedTextKeys");
		var createMessageObjectSpy = sinon.spy(coreApi, "createMessageObject");
		var putMessageSpy = sinon.spy(coreApi, "putMessage");
		var removeTextsSpy = sinon.spy(this.textPool, "removeTexts");
		//action
		this.applicationListView.byId("idApplicationTable").getItems()[0].getCells()[2].firePress();
		sap.ui.getCore().applyChanges();

		this.applicationListView.getDependents()[0].getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		//assertions
		assert.strictEqual(getConfigurationHandlerSpy.calledOnce, true, "then getConfigurationHandlerSpy is called once");
		assert.strictEqual(getUnusedTextKeysSpy.calledOnce, true, "then getUnusedTextKeys is called once");
		assert.strictEqual(getUnusedTextKeysSpy.getCall(0).args[0], "1", "then application id as argument");
		assert.strictEqual(removeTextsSpy.calledOnce, true, "then removeTextsSpy is called once");
		assert.deepEqual(removeTextsSpy.getCall(0).args[0], ["unusedKey1, unusedKey2"], "then used text keys are handed over");
		assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
		assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
		assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "11511", "then success message with correct code is logged");

		assert.strictEqual(this.applicationListView.getDependents()[0], undefined, "then on cancel press text pool cleanup confirmation dialog is destroyed");
		//cleanup
		this.applicationListView.removeAllDependents();
		getConfigurationHandlerSpy.restore();
		getUnusedTextKeysSpy.restore();
		removeTextsSpy.restore();
		createMessageObjectSpy.restore();
		putMessageSpy.restore();
	});
	QUnit.test("When textpool cleanup dialog and ok button is clicked and error occurs while gettingUnusedTexts", function(assert) {
		//arrangement
		var coreApi = this.modelerCore;
		var createMessageObjectSpy = sinon.spy(coreApi, "createMessageObject");
		var putMessageSpy = sinon.spy(coreApi, "putMessage");
		var getConfigurationHandlerSpy = sinon.spy(coreApi, "getConfigurationHandler");
		var successMsgToastSpy = sinon.spy(sap.m.MessageToast, "show");

		function _getUnusedTextKeysLocalStub(appId, callback) {
			callback("", "");
		}
		var getUnusedTextKeysSpy = sinon.stub(coreApi, "getUnusedTextKeys", _getUnusedTextKeysLocalStub);
		var removeTextsSpy = sinon.spy(this.textPool, "removeTexts");
		//action
		this.applicationListView.byId("idApplicationTable").getItems()[0].getCells()[2].firePress();
		sap.ui.getCore().applyChanges();

		this.applicationListView.getDependents()[0].getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		//assertions
		assert.strictEqual(getConfigurationHandlerSpy.calledOnce, true, "then getConfigurationHandlerSpy is called once");
		assert.strictEqual(getUnusedTextKeysSpy.calledOnce, true, "then getUnusedTextKeys is called once");
		assert.strictEqual(removeTextsSpy.calledOnce, false, "then removeTextsSpy is not called");
		assert.strictEqual(successMsgToastSpy.calledOnce, false, "then successMsgToastSpy is not called");
		assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
		assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
		assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "11506", "then error message with correct code is logged");
		//cleanup
		this.applicationListView.removeAllDependents();
		getConfigurationHandlerSpy.restore();
		getUnusedTextKeysSpy.restore();
		successMsgToastSpy.restore();
		removeTextsSpy.restore();
		createMessageObjectSpy.restore();
		putMessageSpy.restore();
	});
	QUnit.test("When textpool cleanup button is clicked and error occurs in removeTexts", function(assert) {
		//arrangement
		var coreApi = this.modelerCore;
		var createMessageObjectSpy = sinon.spy(coreApi, "createMessageObject");
		var putMessageSpy = sinon.spy(coreApi, "putMessage");
		var getConfigurationHandlerSpy = sinon.spy(coreApi, "getConfigurationHandler");
		var getUnusedTextKeysSpy = sinon.spy(coreApi, "getUnusedTextKeys");
		var successMsgToastSpy = sinon.spy(sap.m.MessageToast, "show");

		function _removeTextsLocalStub(aUnusedTexts, appId, callback) {
			callback("");
		}
		var removeTextsSpy = sinon.stub(this.textPool, "removeTexts", _removeTextsLocalStub);
		//action
		this.applicationListView.byId("idApplicationTable").getItems()[0].getCells()[2].firePress();
		sap.ui.getCore().applyChanges();

		this.applicationListView.getDependents()[0].getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		//assertions
		assert.strictEqual(getConfigurationHandlerSpy.calledOnce, true, "then getConfigurationHandlerSpy is called once");
		assert.strictEqual(getUnusedTextKeysSpy.calledOnce, true, "then getUnusedTextKeys is called once");
		assert.strictEqual(removeTextsSpy.calledOnce, true, "then removeTextsSpy is called once");
		assert.strictEqual(successMsgToastSpy.calledOnce, false, "then successMsgToastSpy is not called");
		assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
		assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
		assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "11507", "then error message with correct code is logged");

		//cleanup
		this.applicationListView.removeAllDependents();
		getConfigurationHandlerSpy.restore();
		getUnusedTextKeysSpy.restore();
		successMsgToastSpy.restore();
		removeTextsSpy.restore();
		createMessageObjectSpy.restore();
		putMessageSpy.restore();
	});
	QUnit.test("When delete icon on an application list item is pressed", function(assert) {
		//action

		this.applicationListView.byId("idApplicationTable").getItems()[0].getCells()[4].firePress();
		sap.ui.getCore().applyChanges();
		//assertions
		assert.strictEqual(this.applicationListView.getDependents()[0].getId(), "idDeleteConfirmationFragment--idDeleteConfirmation", "then delete confirmation fragment is instantiated");
		assert.strictEqual(this.applicationListView.getDependents()[0].isOpen(), true, "then delete confirmation dialog is opened");
		assert.strictEqual(this.getTextSpy.calledWith("confirmation"), true, "then title for delete confirmation dialog is set correctly");
		assert.strictEqual(this.getTextSpy.calledWith("deleteApp"), true, "then message inside delete confirmation dialog is set correctly");
		assert.strictEqual(this.getTextSpy.calledWith("deleteButton"), true, "then text of delete button is set correctly");
		assert.strictEqual(this.getTextSpy.calledWith("cancel"), true, "then text of cancel button is set correctly");
		this.applicationListView.getDependents()[0].getEndButton().firePress();
		sap.ui.getCore().applyChanges();
		assert.strictEqual(this.applicationListView.getDependents()[0], undefined, "then on cancel press delete confirmation dialog is destroyed");
		//cleanup
		this.applicationListView.removeAllDependents();
	});
	QUnit.test("When deleting a application clicking yes button on delete confirmation dialog", function(assert) {
		//arrangement
		var deleteAppStub = function(removeId, callback) {
			callback("", {}, undefined);
		};
		var deleteAppSpy = sinon.stub(this.applicationHandler, "removeApplication", deleteAppStub);
		//action

		this.applicationListView.byId("idApplicationTable").getItems()[0].getCells()[4].firePress();
		sap.ui.getCore().applyChanges();
		this.applicationListView.getDependents()[0].getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		//assertions
		assert.strictEqual(deleteAppSpy.calledOnce, true, "then deleteAppSpy is called once");
		this.assertButtonsAndApplicationListAreInValidState(assert);
		//cleanup
		deleteAppSpy.restore();
		this.applicationListView.removeAllDependents();
	});
	QUnit.test("When error occurs while deleting an application", function(assert) {
		//arrangement
		var createMessageObjectSpy = sinon.spy(this.modelerCore, "createMessageObject");
		var putMessageSpy = sinon.spy(this.modelerCore, "putMessage");
		var deleteAppStub = function(removeId, callback) {
			callback("", {}, {});
		};
		var deleteAppSpy = sinon.stub(this.applicationHandler, "removeApplication", deleteAppStub);
		//action
		this.applicationListView.byId("idApplicationTable").getItems()[0].getCells()[4].firePress();
		sap.ui.getCore().applyChanges();
		this.applicationListView.getDependents()[0].getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		//assertions
		assert.strictEqual(deleteAppSpy.calledOnce, true, "then deleteAppSpy is called once");
		assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
		assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
		assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "11501", "then error message with correct code is logged");
		this.assertButtonsAndApplicationListAreInValidState(assert);

		//cleanup
		deleteAppSpy.restore();
		this.applicationListView.removeAllDependents();
		createMessageObjectSpy.restore();
		putMessageSpy.restore();
	});
	QUnit.test("When back button in application overview screen is clicked", function(assert) {
		//arrangement
		var navBackSpy = sinon.stub(window.history, "go", _doNothing);
		//action
		this.applicationListView.getController().handleNavBack();
		//assertion
		assert.strictEqual(navBackSpy.calledOnce, true, "then handler for navigating back to previous page called");
	});
	QUnit.test("When vendor content is not active and import button in footer is clicked", function(assert) {
		//arrangement
		var stubIsVendorContentAvailable = sinon.stub(this.modelerCore, "isVendorContentAvailable", function() {
			return false;
		});
		//action
		this.applicationListView.byId("idImportButton").firePress();
		sap.ui.getCore().applyChanges();
		//assertions on Import Files dialog which opens
		assert.strictEqual(this.applicationListView.getDependents()[0].getViewName(), "sap.apf.modeler.ui.view.importFiles", "then importFiles view is instantiated");
		assert.strictEqual(this.applicationListView.getDependents()[0].byId("idImportFilesDialog").isOpen(), true, "then dialog for importFiles is opened");
		assert.strictEqual(stubIsVendorContentAvailable.callCount, 1, "THEN function isVendorContentAvailable has been called");
		//cleanup
		this.applicationListView.getDependents()[0].byId("idImportFilesDialog").getEndButton().firePress();
		sap.ui.getCore().applyChanges();
		this.applicationListView.removeAllDependents();
		this.modelerCore.isVendorContentAvailable.restore();
	});
	QUnit.test("When vendor content is available and import button in footer is clicked", function(assert) {
		//arrangement
		//placing of view for popover assertions
		var divToPlaceAppList = document.createElement("div");
		divToPlaceAppList.setAttribute('id', 'contentOfAppList');
		document.body.appendChild(divToPlaceAppList);
		this.applicationListView.placeAt("contentOfAppList");
		sap.ui.getCore().applyChanges();
		//stubs
		var stubIsVendorContentAvailable = sinon.stub(this.modelerCore, "isVendorContentAvailable", function() {
			return true;
		});
		sinon.stub(this.modelerCore, "readAllConfigurationsFromVendorLayer", function() {
			var oDefferedCall = new jQuery.Deferred().resolve([]);
			return oDefferedCall.promise();
		});
		//action
		this.applicationListView.byId("idImportButton").firePress();
		sap.ui.getCore().applyChanges();
		//assertions for popover which opens up when lrep is active
		assert.strictEqual(jQuery(".sapMPopover").length, 1, "then popover opened on UI");
		assert.strictEqual(sap.ui.getCore().byId(jQuery(".sapMPopover")[0].id).getContent()[0].getItems().length, 2, "then popover contains two list items");
		assert.strictEqual(this.getTextSpy.calledWith("importDeliveredContent"), true, "then title for Import delivered content popover list item is set correctly");
		assert.strictEqual(this.getTextSpy.calledWith("importFiles"), true, "then title for Import Files popover list item is set correctly");
		assert.strictEqual(stubIsVendorContentAvailable.callCount, 1, "THEN function isVendorContentAvailable has been called");
		//action - click on "Import Delivered Content from popover"
		sap.ui.getCore().byId(jQuery(".sapMPopover")[0].id).getContent()[0].getItems()[0].firePress();
		sap.ui.getCore().applyChanges();
		//assertions on import delivered content view
		assert.strictEqual(this.applicationListView.getDependents()[0].getViewName(), "sap.apf.modeler.ui.view.importDeliveredContent", "then importDeliveredContent view is instantiated");
		assert.strictEqual(this.applicationListView.getDependents()[0].byId("idImportDeliveredContentDialog").isOpen(), true, "then dialog for ImportDeliveredContent is opened");
		//cleanup
		this.applicationListView.getDependents()[0].byId("idImportDeliveredContentDialog").getEndButton().firePress();
		sap.ui.getCore().applyChanges();
		this.applicationListView.removeAllDependents();
		//action
		this.applicationListView.byId("idImportButton").firePress();
		sap.ui.getCore().applyChanges();
		//action - click on "Import Files from popover"
		sap.ui.getCore().byId(jQuery(".sapMPopover")[0].id).getContent()[0].getItems()[1].firePress();
		sap.ui.getCore().applyChanges();
		//assertions on Import Files dialog which opens
		assert.strictEqual(this.applicationListView.getDependents()[0].getViewName(), "sap.apf.modeler.ui.view.importFiles", "then importFiles view is instantiated");
		assert.strictEqual(this.applicationListView.getDependents()[0].byId("idImportFilesDialog").isOpen(), true, "then dialog for importFiles is opened");
		//cleanup
		this.applicationListView.getDependents()[0].byId("idImportFilesDialog").getEndButton().firePress();
		sap.ui.getCore().applyChanges();
		this.applicationListView.removeAllDependents();
		this.modelerCore.isVendorContentAvailable.restore();
		this.modelerCore.readAllConfigurationsFromVendorLayer.restore();
		document.body.removeChild(document.getElementById('contentOfAppList'));
	});
	QUnit.test("When a new application is saved", function(assert) {
		//arrangement
		var createMessageObjectSpy = sinon.spy(this.modelerCore, "createMessageObject");
		var putMessageSpy = sinon.spy(this.modelerCore, "putMessage");
		var oEvent = {
			getParameter : _doNothing
		};
		//action
		this.applicationListView.getController().handleAdditionOfNewApp(oEvent);
		//assertions
		assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
		assert.strictEqual(putMessageSpy.calledOnce, true, "then putMessageSpy is called once");
		assert.strictEqual(putMessageSpy.getCall(0).args[0].getCode(), "11512", "then error message with correct code is logged");
		//cleanup
		createMessageObjectSpy.restore();
		putMessageSpy.restore();
	});
	QUnit.module("Visibility of the semantic object column", {
		beforeEach : function(assert) {
			var that = this;
			var applicationListController = new sap.ui.controller("sap.apf.modeler.ui.controller.applicationList");
			this.applicationHandler = {
					setAndSave : function(appObj, uiCallback) {
						uiCallback("", {}, undefined);
					},
					getList : _getAppListStub
			};
			this.modelerCore = {
				getText : function(key) {
					return key;
				},
				showSemanticObject : function () {
					return false;
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
			sap.ui.core.UIComponent.extend("sap.apf.modeler.Component", {});
			this.getRouterSpy = sinon.stub(sap.ui.core.UIComponent, "getRouterFor", function() {
				return {
					attachRoutePatternMatched : _doNothing,
					navTo : _doNothing
				};
			});
			this.getOwnerComponentSpy = sinon.stub(applicationListController, "getOwnerComponent", function() {
				return { oCoreApi : that.modelerCore };
			});
			this.applicationListView = new sap.ui.view({
				viewName : "sap.apf.modeler.ui.view.applicationList",
				type : sap.ui.core.mvc.ViewType.XML,
				controller : applicationListController
			});
		},
		afterEach : function() {
			this.getRouterSpy.restore();
			this.getOwnerComponentSpy.restore();
			this.applicationListView.destroy();
		}
	});
	QUnit.test("WHEN column for semantic object shall not be shown", function(assert){
		assert.strictEqual(this.applicationListView.byId("idApplicationTable").getColumns()[1].getVisible(), false, "THEN semantic object column is NOT visible");
		assert.strictEqual(this.getTextSpy.calledWith("semanticObject"), false, "then column header for semantic object in table is NOT set");
	});
	QUnit.module("Searchfield", {
		beforeEach : function(assert) {
			var that = this;
			this.applist = [ {
				Application : "1",
				ApplicationName : "app1",
				SemanticObject : "so1"
			}, {
				Application : "2",
				ApplicationName : "app2",
				SemanticObject : "so2"
			} ];
			var applicationListController = new sap.ui.controller("sap.apf.modeler.ui.controller.applicationList");
			this.applicationHandler = {
					setAndSave : function(appObj, uiCallback) {
						uiCallback("", {}, undefined);
					},
					getList : function() {
						return that.applist;
					},
					removeApplication: function(removeId, callback) {
						callback("", {}, undefined);
				}
			};
			this.modelerCore = {
				getText : function(key) {
					return key;
				},
				showSemanticObject : function () {
					return false;
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
			sap.ui.core.UIComponent.extend("sap.apf.modeler.Component", {});
			this.getRouterSpy = sinon.stub(sap.ui.core.UIComponent, "getRouterFor", function() {
				return {
					attachRoutePatternMatched : _doNothing,
					navTo : _doNothing
				};
			});
			this.getOwnerComponentSpy = sinon.stub(applicationListController, "getOwnerComponent", function() {
				return { oCoreApi : that.modelerCore };
			});
			this.applicationListView = sap.ui.view({
				viewName : "sap.apf.modeler.ui.view.applicationList",
				type : sap.ui.core.mvc.ViewType.XML,
				controller : applicationListController
			});
		},
		afterEach : function() {
			this.getRouterSpy.restore();
			this.getOwnerComponentSpy.restore();
			this.applicationListView.destroy();
		}
	});
	QUnit.test("WHEN search field is filled and search is triggered", function(assert){
		var table = this.applicationListView.byId("idApplicationTable");
		var searchField = this.applicationListView.byId("idApplicationListSearchField");
		var items = table.getItems();
		assert.strictEqual(items.length, 2, "THEN two applications");
		assert.strictEqual(items[0].getCells()[0].getText(), "app1", "THEN application name as expected");
		assert.strictEqual(items[1].getCells()[0].getText(), "app2", "THEN application name as expected");
		searchField.fireLiveChange({
			newValue : "app2"
		});
		items = table.getItems();
		assert.strictEqual(items.length, 1, "THEN only one application");
		assert.strictEqual(items[0].getCells()[0].getText(), "app2", "THEN application name as expected");
		searchField.fireLiveChange({
			newValue : "notValidSearchValue"
		});
		items = table.getItems();
		assert.strictEqual(items.length, 0, "THEN no application");
		searchField.fireLiveChange({
			newValue : ""
		});
		items = table.getItems();
		assert.strictEqual(items.length, 2, "THEN two applications again");
		assert.strictEqual(items[0].getCells()[0].getText(), "app1", "THEN application name as expected");
		assert.strictEqual(items[1].getCells()[0].getText(), "app2", "THEN application name as expected");
	});
	QUnit.test("WHEN search is active and a new application is added", function(assert){
		var table = this.applicationListView.byId("idApplicationTable");
		var searchField = this.applicationListView.byId("idApplicationListSearchField");
		//Preparation
		searchField.fireLiveChange({
			newValue : "Z"
		});
		var items = table.getItems();
		assert.strictEqual(items.length, 0, "THEN no application");
		assert.strictEqual(this.applicationListView.getController().actualQuery, "Z", "THEN actual value of search field is remembered");
		//action
		this.applist.push({
				Application : "3",
				ApplicationName : "ZI",
				SemanticObject : "so"
			});
		var event = {
				getParameter : function() {}
		};
		this.applicationListView.getController().handleAdditionOfNewApp(event);
		//assertions
		items = table.getItems();
		assert.strictEqual(items.length, 1, "THEN 1 application");
		assert.strictEqual(items[0].getCells()[0].getText(), "ZI", "THEN application name as expected");
		searchField.fireLiveChange({
			newValue : ""
		});
		items = table.getItems();
		assert.strictEqual(items.length, 3, "THEN three applications again");
	});
	QUnit.test("WHEN search is active and an application is deleted", function(assert){
		var table = this.applicationListView.byId("idApplicationTable");
		var searchField = this.applicationListView.byId("idApplicationListSearchField");
		this.applist.push({
			Application : "3",
			ApplicationName : "ZI",
			SemanticObject : "so"
		});
		var event = {
			getParameter : function() {}
		};
		this.applicationListView.getController().handleAdditionOfNewApp(event);
		searchField.fireLiveChange({
			newValue : "Z"
		});
		// action for remove
		this.applist.pop();

		//action
		this.applicationListView.byId("idApplicationTable").getItems()[0].getCells()[4].firePress();
		sap.ui.getCore().applyChanges();
		this.applicationListView.getDependents()[0].getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		var items = table.getItems();
		assert.strictEqual(items.length, 0, "THEN no visible applications again");
		searchField.fireLiveChange({
			newValue : ""
		});
		items = table.getItems();
		assert.strictEqual(items.length, 2, "THEN two applications again");
	});
	QUnit.test("WHEN search is active and an application is imported", function(assert){
		var table = this.applicationListView.byId("idApplicationTable");
		var searchField = this.applicationListView.byId("idApplicationListSearchField");

		searchField.fireLiveChange({
			newValue : "Z"
		});
		var items = table.getItems();
		assert.strictEqual(items.length, 0, "THEN no application");
		this.applist.push({
			Application : "3",
			ApplicationName : "ZI",
			SemanticObject : "so"
		});
		this.applicationListView.getController().handleAppListUpdate();

		items = table.getItems();
		assert.strictEqual(items.length, 1, "THEN one applications again");
		searchField.fireLiveChange({
			newValue : ""
		});
		items = table.getItems();
		assert.strictEqual(items.length, 3, "THEN three applications again");
	});
});