sap.ui.define("sap.apf.modeler.ui.tImportDeliveredContent", [
	"sap/apf/testhelper/modelerUIHelper",
	"sap/ui/thirdparty/sinon"
], function(modelerUIHelper, sinon) {
	'use strict';

	var oImportDeliveredContentView,
		getTextSpy,
		readAllConfigurationsFromVendorLayerSpy,
		importConfigurationSpy,
		fireEventSpy,
		callbackOverwrite,
		callbackDoNotOverwrite,
		createMessageObjectSpy,
		putMessageStub;
	function _readAllConfigurationsFromVendorLayerStub() {
		var aConfigs = [ {
			applicationText : "Test Application",
			configurationText : "Test Configuration",
			value : "appId.configId"
		} ];
		var oDeferredCall = new jQuery.Deferred();
		oDeferredCall.resolve(aConfigs);
		return oDeferredCall.promise();
	}
	function _importConfigurationFromVendorLayerStub(appId, configId, callback, callbackImportDeliveredContent1) {
		callback(callbackOverwrite, callbackDoNotOverwrite, "Test Configuration");
	}
	function _selectItemAndPressOk() {
		oImportDeliveredContentView.byId("idAppConfigCombobox").setSelectedItem(oImportDeliveredContentView.byId("idAppConfigCombobox").getItems()[1]);
		oImportDeliveredContentView.byId("idImportDeliveredContentDialog").getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
	}
	QUnit.module("Test Import Configuration from LREP vendor layer when lrep is active", {
		beforeEach : function(assert) {
			var oImportDeliveredContentController = new sap.ui.controller("sap.apf.modeler.ui.controller.importDeliveredContent");
			var spyOnInit = sinon.spy(oImportDeliveredContentController, "onInit");
			var done = assert.async();
			var that = this;
			this.oModelerInstance = null;
			modelerUIHelper.getModelerInstance(function(modelerInstance) {
				that.oModelerInstance = modelerInstance;
				var oParentControl = new sap.m.Table();
				getTextSpy = sinon.spy(that.oModelerInstance.modelerCore, "getText");
				createMessageObjectSpy = sinon.spy(that.oModelerInstance.modelerCore, "createMessageObject");
				putMessageStub = sinon.stub(that.oModelerInstance.modelerCore, "putMessage", function(){});
				readAllConfigurationsFromVendorLayerSpy = sinon.stub(that.oModelerInstance.modelerCore, "readAllConfigurationsFromVendorLayer", _readAllConfigurationsFromVendorLayerStub);
				oImportDeliveredContentView = new sap.ui.view({
					viewName : "sap.apf.modeler.ui.view.importDeliveredContent",
					type : sap.ui.core.mvc.ViewType.XML,
					controller : oImportDeliveredContentController,
					viewData : {
						oParentControl : oParentControl,
						oCoreApi : that.oModelerInstance.modelerCore
					}
				});
				callbackOverwrite = sinon.stub();
				callbackDoNotOverwrite = sinon.stub();
				importConfigurationSpy = sinon.stub(oImportDeliveredContentView.getViewData().oCoreApi, "importConfigurationFromVendorLayer", _importConfigurationFromVendorLayerStub);
				fireEventSpy = sinon.spy(oImportDeliveredContentView.getViewData().oParentControl, "fireEvent");
				setTimeout(function(){
					assert.strictEqual(spyOnInit.calledOnce, true, "then import delivered content onInit function is called when view is initialized");
					done();
				},1);
			});
		},
		afterEach : function() {
			callbackOverwrite.reset();
			callbackDoNotOverwrite.reset();
			getTextSpy.restore();
			createMessageObjectSpy.restore();
			putMessageStub.restore();
			readAllConfigurationsFromVendorLayerSpy.restore();
			importConfigurationSpy.restore();
			fireEventSpy.restore();
			oImportDeliveredContentView.destroy();
			modelerUIHelper.destroyModelerInstance();
		}
	});

	QUnit.test("When clicking on Cancel button of Dialog", function(assert) {
		var done = assert.async();
		assert.expect(2);
		//action
		setTimeout(function(){
			oImportDeliveredContentView.byId("idImportDeliveredContentDialog").getEndButton().firePress();
			sap.ui.getCore().applyChanges();
			//assertion
			assert.strictEqual(oImportDeliveredContentView.bIsDestroyed, true, "then view is destroyed");
			done();
		},0);
	});
	QUnit.test("When importing delivered content and server error occurs while doing import", function(assert) {
		var done = assert.async();
		assert.expect(5);
		//arrangement
		importConfigurationSpy.restore();//restore global stub and restub again because only callbackImportDeliveredContent should be executed
		var importConfigurationLocalStub = function(appId, configId, callback, callbackImportDeliveredContent) {
			callbackImportDeliveredContent("", {}, {});
		};
		importConfigurationSpy = sinon.stub(oImportDeliveredContentView.getViewData().oCoreApi, "importConfigurationFromVendorLayer", importConfigurationLocalStub);
		//action - select an item from combo box and click import
		setTimeout(function(){
			_selectItemAndPressOk();
			//assertion
			assert.strictEqual(fireEventSpy.calledOnce, false, "then event to update application list is not fired since an error occured");
			assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
			assert.strictEqual(putMessageStub.calledOnce, true, "then putMessageStub is called once");
			assert.strictEqual(putMessageStub.getCall(0).args[0].getCode(), "11502", "then error message with correct code is logged");
			done();
		},0);
	});
});
