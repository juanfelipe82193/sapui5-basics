/*global QUnit, sinon */
sap.ui.define([
	"sap/ui/generic/app/util/MessageUtil",
	"sap/m/Dialog",
	"sap/m/MessageBox",
	"jquery.sap.global",
	"sap/m/MessageToast",
	"sap/ui/core/mvc/XMLView",
	"sap/ui/core/message/Message",
	"sap/ui/core/library",
	"sap/ui/core/message/ControlMessageProcessor"
], function(
	MessageUtil,
	Dialog,
	MessageBox,
	jQuery,
	MessageToast,
	XMLView,
	Message,
	coreLibrary,
	ControlMessageProcessor
) {
	"use strict";

	// shortcut for sap.ui.core.MessageType
	var MessageType = coreLibrary.MessageType;

	//Helper function to create a DialogFragmentProvider
	function createDialogFragmentProvider(oParentView, sContentDensityClass){
		var fnDialogFragmentProvider;

		fnDialogFragmentProvider = function(sName, oFragmentController) {
			var oFragment;
			var oDialogFragmentControllerWrapper = {
					onMessageDialogClose: function() {
						oFragmentController.onMessageDialogClose();
						oFragment.destroy();
					}
			};

			oFragment = sap.ui.xmlfragment(sName, oDialogFragmentControllerWrapper);
			if (sContentDensityClass){
				jQuery.sap.syncStyleClass(sContentDensityClass, oParentView, oFragment);
			}
			oParentView.addDependent(oParentView);
			return oFragment;
		};

		return fnDialogFragmentProvider;
	}


	QUnit.module("handleError", {
		beforeEach: function() {
			this.oMessageUtil = MessageUtil;
		},
		afterEach: function() {
			delete this.oMessageUtil;
		}
	});

	/*
	TODO: the handleError method is removed, the logic is moved to the sap.suite.ui.generic library, we therefore
	should move the tests to the suite library. Also twe should add tests for the new addTransientErrorMessage and
	parseErrorResponse

	QUnit.test("trigger MessageBox with actions: callAction, deleteEntity, editEntity, activateDraftEntity, anyOtherValue", function(assert) {
		var mParameters = {};
		var sContentDensityClass = "MyContentDensityClass";
		var oNavigationController;

		mParameters.response = {
				response: {message: "Something went wrong", statusCode: 400}
		};
		mParameters.errorContext = {
				lastOperation: {name: ""},
				showMessages: true
		};

		aOperations = ["", "callAction", "deleteEntity", "editEntity", "activateDraftEntity", "anyOtherValue"];
		for (var i = 0; i < aOperations.length; i++){
			mParameters.errorContext.lastOperation.name = aOperations[i];
			sinon.stub(sap.m.MessageBox, "show");
			this.oMessageUtil.handleError(mParameters, sContentDensityClass, oNavigationController);
			assert.ok(sap.m.MessageBox.show.calledOnce, "MessageBox.show was called once");
			assert.ok(sap.m.MessageBox.show.calledWithMatch(mParameters.response.response.message,
				{
					icon: sap.m.MessageBox.Icon.ERROR,title: sap.ui.getCore().getLibraryResourceBundle("sap.ui.generic.app").getText("ERROR_TITLE"),
					actions: [sap.m.MessageBox.Action.OK],styleClass: sContentDensityClass
				}), "MessageBox.show was called with correct parameters"
			);
			//Tidy up...
			sap.m.MessageBox.show.restore();
		}
	});

	QUnit.test("trigger MessagePage", function(assert) {
		var mParameters = {};
		var sContentDensityClass = "MyContentDensityClass";
		var bStubCalled;
		var oNavigationController = {navigateToMessagePage:function(){bStubCalled = true;}};

		mParameters.response = {
				response: {message: "Something went wrong", statusCode: 400}
		};

		//Case 1: addEntry
		bStubCalled = false;
		mParameters.errorContext = {
				lastOperation: {name: "addEntry"},
				showMessages: false
		};
		this.oMessageUtil.handleError(mParameters, sContentDensityClass, oNavigationController);
		assert.ok(bStubCalled, "NavigationController.navigateToMessagePage was called once");

		//Case 2: saveEntry
		bStubCalled = false;
		mParameters.errorContext = {
				lastOperation: {name: "saveEntity"},
				showMessages: false,
				isDraft: true
		};
		this.oMessageUtil.handleError(mParameters, sContentDensityClass, oNavigationController);
		assert.ok(bStubCalled, "NavigationController.navigateToMessagePage was called once");

		//Case 2: modifyEntity
		bStubCalled = false;
		mParameters.response.response.statusCode = 428;
		mParameters.errorContext = {
				lastOperation: {name: "modifyEntity"},
				showMessages: false,
				isDraft: true
		};
		this.oMessageUtil.handleError(mParameters, sContentDensityClass, oNavigationController);
		assert.ok(bStubCalled, "NavigationController.navigateToMessagePage was called once");
	});
*/

	QUnit.module("handleTransientMessages", {
		beforeEach: function() {
			this.oMessageUtil = MessageUtil;
			sinon.stub(Dialog.prototype, "open");
			sinon.stub(MessageToast, "show");
			var sXml = '<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" ></mvc:View>';
			this.oParentView = new XMLView({viewContent: sXml});
		},
		afterEach: function() {
			Dialog.prototype.open.restore();
			MessageToast.show.restore();
			sap.ui.getCore().getMessageManager().removeAllMessages();
			delete this.oMessageUtil;
			this.oParentView.destroy(true);
		}
	});

	QUnit.test("no transient message", function(assert) {
		var fnFragmentProvider = createDialogFragmentProvider(this.oParentView, "MyDensityClass");

		this.oMessageUtil.handleTransientMessages(fnFragmentProvider);
		assert.ok(!Dialog.prototype.open.called, "Dialog.open not called, as expected.");
	});

	QUnit.test("one success transient message with Fragment Provider Callback Class", function(assert) {
		var fnFragmentProvider = createDialogFragmentProvider(this.oParentView, "MyDensityClass");

		//Provide one success message to the message model
		var oTransientMessage = new Message({
			id: 123,
			message: "No error occured - everything's fine",
			description: "",
			type: MessageType.Success,
			processor: new ControlMessageProcessor(),
			persistent: true
		});
		sap.ui.getCore().getMessageManager().addMessages(oTransientMessage);

		this.oMessageUtil.handleTransientMessages(fnFragmentProvider);
		assert.ok(!Dialog.prototype.open.called, "Dialog.open not called, as expected.");
		assert.ok(MessageToast.show.calledOnce, "MessageToast called once - as expected");
	});

	QUnit.test("one success transient message with Property Bag", function(assert) {
		//Provide one success message to the message model
		var oTransientMessage = new Message({
			id: 123,
			message: "No error occured - everything's fine",
			description: "",
			type: MessageType.Success,
			processor: new ControlMessageProcessor(),
			persistent: true
		});
		sap.ui.getCore().getMessageManager().addMessages(oTransientMessage);

		this.oMessageUtil.handleTransientMessages({owner: this.oParentView, contentDensityClass: "MyDensityClass"});
		assert.ok(!Dialog.prototype.open.called, "Dialog.open not called, as expected.");
		assert.ok(MessageToast.show.calledOnce, "MessageToast called once - as expected");
	});

	QUnit.test("one error transient message", function(assert) {
		var fnFragmentProvider = createDialogFragmentProvider(this.oParentView, "MyDensityClass");
		var oTransientMessage = new Message({
			id: 123,
			message: "An error occured",
			description: "",
			type: MessageType.Error,
			processor: new ControlMessageProcessor(),
			persistent: true
		});
		sap.ui.getCore().getMessageManager().addMessages(oTransientMessage);
		this.oMessageUtil.handleTransientMessages(fnFragmentProvider);
		assert.ok(Dialog.prototype.open.calledOnce, "Dialog.open called, as expected.");
		assert.ok(!MessageToast.show.called, "MessageToast not called - as expected");
	});

	QUnit.test("no transient message, but two other", function(assert) {
		var fnFragmentProvider = createDialogFragmentProvider(this.oParentView, "MyDensityClass");
		var aMessages = [];
		aMessages.push(new Message({
				id: 123,
				message: "An error occured",
				description: "",
				type: MessageType.Warning,
				processor: new ControlMessageProcessor(),
				persistent: false
			})
		);
		aMessages.push(new Message({
				id: 123,
				message: "An error occured",
				description: "",
				type: MessageType.Success,
				processor: new ControlMessageProcessor(),
				persistent: false
			})
		);
		sap.ui.getCore().getMessageManager().addMessages(aMessages);

		this.oMessageUtil.handleTransientMessages(fnFragmentProvider);
		assert.ok(!Dialog.prototype.open.called, "Dialog.open not called, as expected.");
		assert.ok(!MessageToast.show.called, "MessageToast not called - as expected");
	});


	QUnit.module("removeTransientMessages", {
		beforeEach: function() {
			this.oMessageUtil = MessageUtil;
		},
		afterEach: function() {
			delete this.oMessageUtil;
			sap.ui.getCore().getMessageManager().removeAllMessages();
		}
	});

	QUnit.test("delete one transient, leave one other", function(assert) {
		sap.ui.getCore().getMessageManager().removeAllMessages();
		var aMessages = [];
		aMessages.push(new Message({
				id: 123,
				message: "An error occured",
				description: "",
				type: MessageType.Warning,
				processor: new ControlMessageProcessor(),
				persistent: false
			})
		);
		aMessages.push(new Message({
				id: 123,
				message: "An error occured",
				description: "",
				type: MessageType.Warning,
				processor: new ControlMessageProcessor(),
				persistent: true
			})
		);
		sap.ui.getCore().getMessageManager().addMessages(aMessages);
		this.oMessageUtil.removeTransientMessages();
		assert.ok(sap.ui.getCore().getMessageManager().getMessageModel().oData.length == 1, "Exactly one message remains");
	});
});