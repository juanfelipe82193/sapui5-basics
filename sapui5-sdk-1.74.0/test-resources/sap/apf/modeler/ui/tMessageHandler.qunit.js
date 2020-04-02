/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.ui.core.mvc.XMLView");
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
jQuery.sap.declare('sap.apf.modeler.ui.controller.tMessageHandler');
(function() {
	'use strict';
	var oMessageHandlerView, oModelerInstance;
	function getDialogByTitleKey(key) {
		sap.ui.getCore().applyChanges();
		var title = oModelerInstance.modelerCore.getText(key);
		var oExpectedDialog;
		jQuery.each(jQuery('.sapMDialog'), function(name, element) {
			var oDialog = sap.ui.getCore().byId(element.getAttribute("id"));
			if (title.indexOf(oDialog.getTitle()) !== -1 && oDialog.getTitle() !== "") { // matching even if text resource missing
				oExpectedDialog = oDialog;
			}
		});
		return oExpectedDialog;
	}
	function doNothing() {
	}
	QUnit.module("Message Handler tests ", {
		beforeEach : function(assert) {
			var done = assert.async();
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				oMessageHandlerView = sap.ui.view({
					viewName : "sap.apf.modeler.ui.view.messageHandler",
					type : "XML",
					viewData : oModelerInstance.modelerCore
				});
				done();
			});
		},
		afterEach : function() {
			oMessageHandlerView.destroy();
		}
	});
	QUnit.test('when initialization', function(assert) {
		assert.ok(oMessageHandlerView, 'then view exists');
	});
	QUnit.test('When Calling show Message with Error Message object', function(assert) {
		//arrangement
		var dialog, spyMessageBox, errorMessageObject;
		spyMessageBox = sinon.spy(sap.m.MessageBox, 'error');
		errorMessageObject = oModelerInstance.modelerCore.createMessageObject({
			code : "10002"
		});
		errorMessageObject.setSeverity("error");
		errorMessageObject.setMessage("This is an Error Message");
		//action
		oMessageHandlerView.getController().showMessage(errorMessageObject);
		//assert
		assert.ok(errorMessageObject, "Then Message Object is created");
		assert.strictEqual(spyMessageBox.calledOnce, true, "then Message Box is opened on UI");
		assert.strictEqual(spyMessageBox.getCall(0).args[0], "This is an Error Message", "then message displayed in message box is correct");
		//action
		dialog = getDialogByTitleKey("Error");
		assert.ok(dialog, "then message box of type error is opened on UI");
		dialog.getButtons()[0].firePress();
		sap.ui.getCore().applyChanges();
		//cleanup
		spyMessageBox.restore();
	});
	QUnit.test('When Calling show Message with Success Message object', function(assert) {
		//arrangement
		var spyMessageToastShow, successMessageObject;
		spyMessageToastShow = sinon.spy(sap.m.MessageToast, 'show');
		successMessageObject = oModelerInstance.modelerCore.createMessageObject({
			code : "10001"
		});
		successMessageObject.setSeverity("success");
		successMessageObject.setMessage("This is a Success Message");
		//action
		oMessageHandlerView.getController().showMessage(successMessageObject);
		//assert
		assert.ok(successMessageObject, "Then Success Message Object created");
		assert.strictEqual(spyMessageToastShow.called, true, "Then Message Toast is shown");
		assert.strictEqual(spyMessageToastShow.getCall(0).args[0], "This is a Success Message", "then message displayed in message toast is correct");
		//cleanup
		spyMessageToastShow.restore();
	});
	QUnit.test('When calling show Message with Unknown Message object', function(assert) {
		//arrangement
		var spyUnknowError, unknownMessage;
		spyUnknowError = sinon.spy(jQuery.sap.log, 'error');
		unknownMessage = oModelerInstance.modelerCore.createMessageObject({
			code : "10001"
		});
		unknownMessage.setSeverity("Unknown");
		unknownMessage.setMessage("This is Unknown Message");
		//action
		oMessageHandlerView.getController().showMessage(unknownMessage);
		//assert
		assert.ok(unknownMessage, "Then Unknown Message Object created");
		assert.strictEqual(spyUnknowError.called, true, "Then unknown error is logged on console");
		//cleanup
		jQuery.sap.log.error.restore();
	});
	QUnit.test('When calling show message with a Fatal Error object', function(assert) {
		//arrangement
		var navToPrevPage, fatalMO, dialog, getTextSpy, showDetailsDialog, previousMessageObject;
		getTextSpy = sinon.spy(oModelerInstance.modelerCore, "getText");
		navToPrevPage = sinon.stub(window.history, 'go', doNothing);
		previousMessageObject = oModelerInstance.modelerCore.createMessageObject({
			code : "10001"
		});
		previousMessageObject.setSeverity("fatal");
		previousMessageObject.setMessage("This is a Previous Message");
		fatalMO = oModelerInstance.modelerCore.createMessageObject({
			code : "10001"
		});
		fatalMO.setSeverity("fatal");
		fatalMO.setMessage("This is a Fatal Message");
		fatalMO.setPrevious(previousMessageObject);
		//action
		oMessageHandlerView.getController().showMessage(fatalMO);
		//assert
		dialog = oMessageHandlerView.byId("idFatalDialog");
		assert.ok(fatalMO, "Then Fatal Message Object created");
		assert.strictEqual(dialog.isOpen(), true, "Error dialog is open");
		assert.strictEqual(getTextSpy.calledWith("error"), true, "The title of dialog is fatal");
		assert.strictEqual(getTextSpy.calledWith("showDetailsLink"), true, "Then show details link is present inside the dialog");
		assert.strictEqual(getTextSpy.calledWith("close"), true, "then close button is present in the dialog ");
		assert.strictEqual(getTextSpy.calledWith("fatalErrorMessage"), true, "then fatal message is displayed in the dialog");
		//action - Click show details link
		dialog.getContent()[1].getItems()[0].firePress();
		//assert
		showDetailsDialog = oMessageHandlerView.byId("idShowDetailsDialog");
		assert.strictEqual(showDetailsDialog.isOpen(), true, "then Show Details dialog is opened on Ui");
		assert.strictEqual(getTextSpy.calledWith("close"), true, "then close button is present in the dialog ");
		//action - close the show details dialog and fatal dialog
		showDetailsDialog.getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		dialog.getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		//assert
		assert.strictEqual(navToPrevPage.calledOnce, true, "then navigates to previous page");
		// cleanups
		navToPrevPage.restore();
		showDetailsDialog.destroy();
		dialog.destroy();
	});
	QUnit.test('When Calling show Message with Information Message object', function(assert) {
		//arrangement
		var dialog, spyMessageBox, infoMessageObject;
		spyMessageBox = sinon.spy(sap.m.MessageBox, 'information');
		infoMessageObject = oModelerInstance.modelerCore.createMessageObject({
			code : "10002"
		});
		infoMessageObject.setSeverity("information");
		infoMessageObject.setMessage("This is an Information Message");
		//action
		oMessageHandlerView.getController().showMessage(infoMessageObject);
		//assert
		assert.ok(infoMessageObject, "Then Message Object is created");
		assert.strictEqual(spyMessageBox.calledOnce, true, "then Message Box is opened on UI");
		assert.strictEqual(spyMessageBox.getCall(0).args[0], "This is an Information Message", "then message displayed in message box is correct");
		//action
		dialog = getDialogByTitleKey("Information");
		assert.ok(dialog, "then message box of type error is opened on UI");
		dialog.getButtons()[0].firePress();
		sap.ui.getCore().applyChanges();
		//cleanup
		spyMessageBox.restore();
	});

	
	QUnit.module("MessageHandler closeFatalErrorDialog Injection", {
		// by default, useFakeTimers will be enabled. However, this causes issues with asynchronous requiring, as the clock must be advanced manually
		// we don't have a reference to the clock, so we must disable useFakeTimers for the tests
		beforeEach: function() {
			sinon.config = sinon.config || {};
			this._oldUseFakeTimers = sinon.config.useFakeTimers;
			sinon.config.useFakeTimers = false;
		},
		afterEach: function() {
			sinon.config.useFakeTimers = this._oldUseFakeTimers;
		}
	});
	QUnit.test('When closeFatalErrorDialog is not injected', function(assert) {
		var done = assert.async();
		// arrangement
		sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(oModelerInstance) {
			sap.ui.core.mvc.XMLView.create({
				viewName : "sap.apf.modeler.ui.view.messageHandler",
				type : "XML",
				viewData : oModelerInstance.modelerCore
			}).then(function(oMessageHandlerView) {
				// Error Message
				var oMessageObject = oModelerInstance.modelerCore.createMessageObject({
					code : "10001"
				});
				oMessageObject.setSeverity("fatal");
				oMessageObject.setMessage("This is Fatal Message");

				var navToPrevPageSpy = sinon.stub(window.history, 'go', doNothing);

				// action
				oMessageHandlerView.getController().showMessage(oMessageObject);
				var oFatalDialog = oMessageHandlerView.byId("idFatalDialog");

				// assert
				assert.strictEqual(oFatalDialog.isOpen(), true, "then Error dialog is open");
				oFatalDialog.getBeginButton().firePress();
				sap.ui.getCore().applyChanges();
				assert.strictEqual(navToPrevPageSpy.calledOnce, true, "then navigates to previous page");

				// cleanup
				navToPrevPageSpy.restore();
				oFatalDialog.destroy();
				oMessageHandlerView.destroy();
				done();
			}).catch(function() {
				assert.ok(false);
				done();
			});
		});
	});

	QUnit.test('When closeFatalErrorDialog is injected', function(assert) {
		var done = assert.async();
		var closeFatalErrorDialog = sinon.spy();

		// arrangement
		sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(oModelerInstance) {
			// we can't provide injections with getModelerInstance(), as oModelerInstance is a singleton
			// so we mock getGenericExit here
			var getGenericExit = sinon.stub(oModelerInstance.modelerCore, 'getGenericExit');
			getGenericExit.returns(closeFatalErrorDialog);

			sap.ui.core.mvc.XMLView.create({
				viewName : "sap.apf.modeler.ui.view.messageHandler",
				type : "XML",
				viewData : oModelerInstance.modelerCore
			}).then(function(oMessageHandlerView) {
				// Error Message
				var oMessageObject = oModelerInstance.modelerCore.createMessageObject({
					code : "10001"
				});
				oMessageObject.setSeverity("fatal");
				oMessageObject.setMessage("This is Fatal Message");
	
				var navToPrevPageSpy = sinon.stub(window.history, 'go', doNothing);
	
				// action
				oMessageHandlerView.getController().showMessage(oMessageObject);
				var oFatalDialog = oMessageHandlerView.byId("idFatalDialog");
	
				// assert
				assert.strictEqual(oFatalDialog.isOpen(), true, "then Error dialog is open");
				oFatalDialog.getBeginButton().firePress();
				sap.ui.getCore().applyChanges();
				assert.strictEqual(navToPrevPageSpy.calledOnce, false, "then does not navigate to previous page");
				assert.strictEqual(closeFatalErrorDialog.calledOnce, true, "then call injected method");
				assert.ok(closeFatalErrorDialog.firstCall.args[0] instanceof sap.apf.modeler.core.Instance, "then first parameter of call to exit is the core instance");
				assert.ok(closeFatalErrorDialog.firstCall.args[1] instanceof sap.ui.core.mvc.Controller, "then second parameter of call to exit is the Controller");
				assert.ok(closeFatalErrorDialog.firstCall.args[2] instanceof sap.m.Dialog, "then third parameter of call to exit is the Dialog");
	
				// cleanup
				navToPrevPageSpy.restore();
				getGenericExit.restore();
				oFatalDialog.destroy();
				oMessageHandlerView.destroy();
				done();
			}).catch(function() {
				assert.ok(false);
				done();
			});
		});
	});
})();