/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.thirdparty.sinon");
jQuery.sap.require("sap.apf.modeler.core.instance");
jQuery.sap.require('sap.apf.modeler.ui.utils.navigationHandler');
// BlanketJS coverage (Add URL param 'coverage=true' to see coverage results)
if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 8)) {
	jQuery.sap.require("sap.ui.qunit.qunit-coverage");
}
(function() {
	"use strict";
	QUnit.module("Navigation Handler Scenario Test", {
		beforeEach : function() {
			this.oNavigationHandler = sap.apf.modeler.ui.utils.navigationHandler.getInstance();
			var configuration = {};
			var oCore = new sap.apf.modeler.core.Instance(configuration);
			//Create Dummy Page inject dialog as dependent
			var oPage = new sap.m.Page();
			oPage.placeAt("holder");
			//Stub ConfigList Instance
			this.oConfigListInstance = {
				getView : function() {
					return oPage;
				},
				oCoreApi : oCore,
				configurationHandler : {
					resetConfiguration : sinon.spy()
				}
			};
			//Stub Callback Instance
			this.oLODCallback = {
				yes : sinon.spy(),
				no : sinon.spy(),
				cancel : sinon.spy()
			};
			this.oMandatoryCallback = {
				yes : sinon.spy(),
				no : sinon.spy()
			};
		},
		afterEach : function() {
			jQuery("#holder").html(""); // Clear content in the dom holder
			return;
		}
	});
	QUnit.test("Test availability of Navigation Handler Instance", function(assert) {
		assert.expect(1);
		assert.ok(this.oNavigationHandler, "Configuration List Controller is Available");
	});
	QUnit.test("Test availability of Navigation Handler API's", function(assert) {
		assert.expect(2);
		assert.ok(typeof this.oNavigationHandler.throwLossOfDataPopup === "function", "throwLossOfDataPopup API is available");
		assert.ok(typeof this.oNavigationHandler.throwMandatoryPopup === "function", "throwMandatoryPopup API is available");
	});
	QUnit.test("Test loss of data popup dialog content", function(assert) {
		assert.expect(7);
		var oSelf = this, done;
		this.oNavigationHandler.throwLossOfDataPopup(this.oConfigListInstance, this.oLODCallback);
		var dialogInstance = oSelf.oConfigListInstance.getView().getDependents()[0];
		var oCoreApi = oSelf.oConfigListInstance.oCoreApi;
		assert.ok(dialogInstance, "Dialog Instance exists");
		assert.equal(dialogInstance.getTitle(), oCoreApi.getText("warning"), "Warning Dialog Appeared");
		assert.equal(dialogInstance.getButtons().length, 3, "Three action buttons exists");
		assert.equal(dialogInstance.getButtons()[0].getText(), oCoreApi.getText("yes"), "Yes Button with text exists");
		assert.equal(dialogInstance.getButtons()[1].getText(), oCoreApi.getText("no"), "No Button with text exists");
		assert.equal(dialogInstance.getButtons()[2].getText(), oCoreApi.getText("cancel"), "Cancel Button with text exists");
		assert.equal(dialogInstance.getContent()[0].getText(), oCoreApi.getText("unsavedConfiguration"), "Loss of data message content text matches");
		dialogInstance.getButtons()[2].firePress();
		done = assert.async();
		dialogInstance.attachAfterClose(function() {
			done();
		});
	});
	QUnit.test("Test Yes Action loss of data popup dialog", function(assert) {
		assert.expect(1);
		var oSelf = this, done;
		this.oNavigationHandler.throwLossOfDataPopup(this.oConfigListInstance, this.oLODCallback);
		var dialogInstance = oSelf.oConfigListInstance.getView().getDependents()[0];
		dialogInstance.getButtons()[0].firePress();
		assert.ok(oSelf.oLODCallback.yes.calledOnce, "Yes Callback called");
		done = assert.async();
		dialogInstance.attachAfterClose(function() {
			done();
		});
	});
	QUnit.test("Test No Action loss of data popup dialog", function(assert) {
		assert.expect(2);
		var oSelf = this, done;
		this.oNavigationHandler.throwLossOfDataPopup(this.oConfigListInstance, this.oLODCallback);
		var dialogInstance = oSelf.oConfigListInstance.getView().getDependents()[0];
		dialogInstance.getButtons()[1].firePress();
		assert.ok(oSelf.oConfigListInstance.configurationHandler.resetConfiguration.called, "Reset Configuration was called");
		assert.ok(oSelf.oLODCallback.no.calledOnce, "No Callback called");
		done = assert.async();
		dialogInstance.attachAfterClose(function() {
			done();
		});
	});
	QUnit.test("Test Cancel Action loss of data popup dialog", function(assert) {
		assert.expect(1);
		var oSelf = this, done;
		this.oNavigationHandler.throwLossOfDataPopup(this.oConfigListInstance, this.oLODCallback);
		var dialogInstance = oSelf.oConfigListInstance.getView().getDependents()[0];
		dialogInstance.getButtons()[2].firePress();
		assert.ok(oSelf.oLODCallback.cancel.calledOnce, "Cancel Callback called");
		done = assert.async();
		dialogInstance.attachAfterClose(function() {
			done();
		});
	});
	QUnit.test("Test manadatory popup dialog content", function(assert) {
		assert.expect(6);
		var oSelf = this, done;
		this.oNavigationHandler.throwMandatoryPopup(this.oConfigListInstance, this.oMandatoryCallback);
		var dialogInstance = oSelf.oConfigListInstance.getView().getDependents()[0];
		var oCoreApi = oSelf.oConfigListInstance.oCoreApi;
		assert.ok(dialogInstance, "Dialog Instance exists");
		assert.equal(dialogInstance.getTitle(), oCoreApi.getText("warning"), "Warning Dialog Appeared");
		assert.equal(dialogInstance.getButtons().length, 2, "Two action buttons exists");
		assert.equal(dialogInstance.getButtons()[0].getText(), oCoreApi.getText("yes"), "Yes Button with text exists");
		assert.equal(dialogInstance.getButtons()[1].getText(), oCoreApi.getText("no"), "No Button with text exists");
		assert.equal(dialogInstance.getContent()[0].getText(), oCoreApi.getText("mandatoryField"), "Manadatory message content text matches");
		dialogInstance.getButtons()[1].firePress();
		done = assert.async();
		dialogInstance.attachAfterClose(function() {
			done();
		});
	});
	QUnit.test("Test Yes action for manadatory popup dialog content", function(assert) {
		assert.expect(1);
		var oSelf = this, done;
		this.oNavigationHandler.throwMandatoryPopup(this.oConfigListInstance, this.oMandatoryCallback);
		var dialogInstance = oSelf.oConfigListInstance.getView().getDependents()[0];
		dialogInstance.getButtons()[0].firePress();
		assert.ok(oSelf.oMandatoryCallback.yes.calledOnce, "Yes Callback called");
		done = assert.async();
		dialogInstance.attachAfterClose(function() {
			done();
		});
	});
	QUnit.test("Test No action for manadatory popup dialog content", function(assert) {
		assert.expect(1);
		var oSelf = this, done;
		this.oNavigationHandler.throwMandatoryPopup(this.oConfigListInstance, this.oMandatoryCallback);
		var dialogInstance = oSelf.oConfigListInstance.getView().getDependents()[0];
		dialogInstance.getButtons()[1].firePress();
		assert.ok(oSelf.oMandatoryCallback.no.calledOnce, "No Callback called");
		done = assert.async();
		dialogInstance.attachAfterClose(function() {
			done();
		});
	});
}());