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
		callbackImportDeliveredContent,
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
		callbackImportDeliveredContent = callbackImportDeliveredContent1;
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
				assert.strictEqual(spyOnInit.calledOnce, true, "then import delivered content onInit function is called when view is initialized");
				done();
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
	QUnit.test("When import delivered content view is initialized", function(assert) {
		//arrangement
		var oDialog = oImportDeliveredContentView.byId("idImportDeliveredContentDialog");
		var oAppConfigCombo = oImportDeliveredContentView.byId("idAppConfigCombobox");
		//assertions on import delivered content dialog
		assert.ok(oImportDeliveredContentView, "then import delivered content view exists");
		assert.ok(oDialog, "then Dialog to import configurations from vendor layer exists");
		assert.strictEqual(oDialog.isOpen(), true, "then Dialog to import configurations from vendor layer is opened on UI");
		assert.strictEqual(getTextSpy.calledWith("importDeliveredContent"), true, "then title is set correctly for import delivered content dialog");
		assert.strictEqual(getTextSpy.calledWith("configuration"), true, "then text for configuration label is set correctly");
		assert.strictEqual(getTextSpy.calledWith("configFileInputPlaceHolder"), true, "then placeholder for application-configuration combobox is set correctly");
		assert.strictEqual(getTextSpy.calledWith("import"), true, "then text for import button of dialog is set correctly");
		assert.strictEqual(getTextSpy.calledWith("cancel"), true, "then text for cancel button of dialog is set correctly");
		assert.strictEqual(oAppConfigCombo.getItems().length, 2, "then two items available in combo box(header + one app-config)");
		assert.strictEqual(getTextSpy.calledWith("application"), true, "then column header for list of applications set correctly in combo box");
		assert.strictEqual(getTextSpy.calledWith("configuration"), true, "then column header for list of configurations set correctly in combo box");
		assert.strictEqual(oAppConfigCombo.getItems()[1].data("value"), "appId.configId", "then config available in combo box");
	});
	QUnit.test("When importing delivered content and entering an application name which does not exist in list of applications in vendor layer", function(assert) {
		//action
		oImportDeliveredContentView.byId("idAppConfigCombobox").setValue("Dummy Application");
		oImportDeliveredContentView.byId("idImportDeliveredContentDialog").getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		//assertion
		assert.strictEqual(oImportDeliveredContentView.byId("idAppConfigCombobox").getValueState(), sap.ui.core.ValueState.Error, "then value state of combo box is set to error state");
		assert.strictEqual(importConfigurationSpy.called, false, "then importConfigurationFromVendor function is not called");
		assert.strictEqual(fireEventSpy.calledOnce, false, "then event to update application list is not fired since import did not happen");
	});
	QUnit.test("When importing delivered content and selecting an application name from existing list of applications in vendor layer", function(assert) {
		//action
		oImportDeliveredContentView.byId("idAppConfigCombobox").setSelectedItem(oImportDeliveredContentView.byId("idAppConfigCombobox").getItems()[1]);
		oImportDeliveredContentView.byId("idAppConfigCombobox").fireSelectionChange();
		oImportDeliveredContentView.byId("idImportDeliveredContentDialog").getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		//assertion
		assert.strictEqual(oImportDeliveredContentView.byId("idAppConfigCombobox").getValueState(), sap.ui.core.ValueState.None, "then value state of combo box is set to None");
	});
	QUnit.test("When importing delivered content and when both application and configuration do not exist", function(assert) {
		//arrangement
		importConfigurationSpy.restore();//restore global stub and restub again because only callbackImportDeliveredContent should be executed
		var importConfigurationLocalStub = function(appId, configId, callback, callbackImportDeliveredContent) {
			callbackImportDeliveredContent("", {}, undefined);
		};
		importConfigurationSpy = sinon.stub(oImportDeliveredContentView.getViewData().oCoreApi, "importConfigurationFromVendorLayer", importConfigurationLocalStub);
		assert.expect(11);
		var done = assert.async();
		setTimeout(function(){
			//action - select an item from combo box and click import
			_selectItemAndPressOk();
			//assertion
			assert.strictEqual(importConfigurationSpy.calledOnce, true, "then importConfigurationFromVendorLayer function is called once");
			assert.strictEqual(importConfigurationSpy.getCall(0).args[0], "appId", "then importConfigurationFromVendorLayer function is called with appId as first parameter");
			assert.strictEqual(importConfigurationSpy.getCall(0).args[1], "configId", "then importConfigurationFromVendorLayer function is called with configId as second parameter");
			assert.ok(importConfigurationSpy.getCall(0).args[2] instanceof Function, "then importConfigurationFromVendorLayer functions third parameter is a callback(callbackOverwrite,callbackNew)");
			assert.ok(importConfigurationSpy.getCall(0).args[3] instanceof Function, "then importConfigurationFromVendorLayer functions forth parameter is a callback");
			assert.strictEqual(fireEventSpy.calledOnce, true, "then event to update application list is fired");
			assert.strictEqual(fireEventSpy.calledWith("updateAppListEvent"), true, "then event to update application list is fired with correct parameters");
			assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
			assert.strictEqual(putMessageStub.calledOnce, true, "then putMessageStub is called once");
			assert.strictEqual(putMessageStub.getCall(0).args[0].getCode(), "11515", "then error message with correct code is logged");
			done();
		},1);
	});
	QUnit.test("When importing delivered content and when configuration already exists", function(assert) {
		//action - select an item from combo box and click import
		assert.expect(20);
		var done = assert.async();
		setTimeout(function() {
			_selectItemAndPressOk();
			//assertions on overwrite confirmation which opens on UI
			var oOverwriteDialog = oImportDeliveredContentView.getDependents()[0];
			assert.strictEqual(oOverwriteDialog.isOpen(), true, "then Dialog for overwrite confirmation is opened on UI");
			assert.strictEqual(getTextSpy.calledWith("configAlreadyExists"), true, "then title of overwrite confirmation dialog is set correctly");
			assert.strictEqual(getTextSpy.calledWith("overwriteDialogMsg"), true, "then Overwrite confirmation message label available in the dialog");
			assert.strictEqual(oOverwriteDialog.getContent()[0].getItems()[1].getButtons().length, 2, "then two options either to overwrite or create a new config available");
			assert.strictEqual(oOverwriteDialog.getContent()[0].getItems()[1].getSelectedIndex(), 0, "then first option to overwrite existing configuration is selected by default");
			assert.strictEqual(getTextSpy.calledWith("overwriteConfig"), true, "then text of radio button to overwrite configuration set correctly");
			assert.strictEqual(getTextSpy.calledWith("doNotOverwriteConfig"), true, "then text of radio button to create a new configuration set correctly");
			assert.strictEqual(getTextSpy.calledWith("newConfigTitle"), true, "then text of label for new configuration title set correctly");
			assert.strictEqual(oOverwriteDialog.getContent()[0].getItems()[2].getVisible(), false, "then layout for new configuration title is not visible initially");
			assert.strictEqual(getTextSpy.calledWith("ok"), true, "then text of begin button of overwrite dialog set correctly");
			assert.strictEqual(getTextSpy.calledWith("cancel"), true, "then text of end button of overwrite dialog set correctly");
			//action - select do not overwrite existing configuration radio option(create a new config)
			oOverwriteDialog.getContent()[0].getItems()[1].setSelectedButton(oOverwriteDialog.getContent()[0].getItems()[1].getButtons()[1]);
			oImportDeliveredContentView.getController().handleChangeForOverwriteConfigOptions();
			//assertions- when do not overwrite existing configuration radio option is selected (create a new config)
			assert.strictEqual(oOverwriteDialog.getContent()[0].getItems()[2].getVisible(), true, "then layout for new configuration title is visible");
			assert.strictEqual(oOverwriteDialog.getContent()[0].getItems()[2].getItems()[1].getEnabled(), true, "then input for new configuration title is enabled");
			assert.strictEqual(oOverwriteDialog.getContent()[0].getItems()[2].getItems()[1].getValue(), "Test Configuration", "then input for new configuration title is prefilled with existing configuration name");
			//action - select again first option to overwrite configuration
			oOverwriteDialog.getContent()[0].getItems()[1].setSelectedButton(oOverwriteDialog.getContent()[0].getItems()[1].getButtons()[0]);
			oImportDeliveredContentView.getController().handleChangeForOverwriteConfigOptions();
			//assertions - when there is title for new config title in input field
			assert.strictEqual(oOverwriteDialog.getContent()[0].getItems()[2].getVisible(), true, "then layout for new configuration title is still visible since the input field contains a title");
			assert.strictEqual(oOverwriteDialog.getContent()[0].getItems()[2].getItems()[1].getEnabled(), false, "then input for new configuration title is disabled since we switched back to overwrite config option");
			//action - select do not overwrite existing configuration radio option,clear the title in input field and again select first option to overwrite configuration
			oOverwriteDialog.getContent()[0].getItems()[1].setSelectedButton(oOverwriteDialog.getContent()[0].getItems()[1].getButtons()[1]);
			oImportDeliveredContentView.getController().handleChangeForOverwriteConfigOptions();
			oOverwriteDialog.getContent()[0].getItems()[2].getItems()[1].setValue("");
			oOverwriteDialog.getContent()[0].getItems()[1].setSelectedButton(oOverwriteDialog.getContent()[0].getItems()[1].getButtons()[0]);
			oImportDeliveredContentView.getController().handleChangeForOverwriteConfigOptions();
			//assertions - when there is no title for new config title in input field. Its blank.
			assert.strictEqual(oOverwriteDialog.getContent()[0].getItems()[2].getVisible(), false, "then layout for new configuration title is not visible since the input field was empty");
			//action - select do not overwrite existing configuration radio option,keep input field empty and click on Import
			oOverwriteDialog.getContent()[0].getItems()[1].setSelectedButton(oOverwriteDialog.getContent()[0].getItems()[1].getButtons()[1]);
			oImportDeliveredContentView.getController().handleChangeForOverwriteConfigOptions();
			oOverwriteDialog.getBeginButton().firePress();
			sap.ui.getCore().applyChanges();
			//assertions - when title for new configuration is left empty
			assert.strictEqual(oOverwriteDialog.getContent()[0].getItems()[2].getItems()[1].getValueState(), sap.ui.core.ValueState.Error, "then Value state for input field is set to Error since its blank");
			//act - close the dialog
			oOverwriteDialog.getEndButton().firePress();
			sap.ui.getCore().applyChanges();
			//assertions - when overwrite dialog is closed
			assert.strictEqual(oImportDeliveredContentView.getDependents()[0], undefined, "then on cancel press overwrite dialog is destroyed");
			done();
		},0);
	});
	QUnit.test("When importing delivered content and when configuration already exists and on overwriting the existing configuration", function(assert) {
		//action
		assert.expect(9);
		var done = assert.async();
		setTimeout(function(){
			_selectItemAndPressOk();
			oImportDeliveredContentView.getDependents()[0].getBeginButton().firePress();
			sap.ui.getCore().applyChanges();
			callbackImportDeliveredContent("", {}, undefined);//call callbackImport explicitly after callbackOverwrite/callbackCreateNew are executed
			//assertion
			assert.strictEqual(importConfigurationSpy.calledOnce, true, "then importConfigurationFromyVendorLayer function is called once");
			assert.strictEqual(callbackOverwrite.calledOnce, true, "then callback for overwrite is called and existing configuration is overwritten");
			assert.strictEqual(callbackDoNotOverwrite.called, false, "then callback for creating a new config is not called");
			assert.strictEqual(fireEventSpy.calledOnce, true, "then event to update application list is fired");
			assert.strictEqual(fireEventSpy.calledWith("updateAppListEvent"), true, "then event to update application list is fired with correct parameters");
			assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
			assert.strictEqual(putMessageStub.calledOnce, true, "then putMessageStub is called once");
			assert.strictEqual(putMessageStub.getCall(0).args[0].getCode(), "11515", "then error message with correct code is logged");
			done();
		},0);
	});
	QUnit.test("When importing delivered content and when configuration already exists and on overwriting the existing configuration", function(assert) {
		//action
		assert.expect(9);
		var done = assert.async();
		setTimeout(function(){
			_selectItemAndPressOk();
			oImportDeliveredContentView.getDependents()[0].getBeginButton().firePress();
			sap.ui.getCore().applyChanges();
			callbackImportDeliveredContent("", {}, undefined);//call callbackImport explicitly after callbackOverwrite/callbackCreateNew are executed
			//assertion
			assert.strictEqual(importConfigurationSpy.calledOnce, true, "then importConfigurationFromyVendorLayer function is called once");
			assert.strictEqual(callbackOverwrite.calledOnce, true, "then callback for overwrite is called and existing configuration is overwritten");
			assert.strictEqual(callbackDoNotOverwrite.called, false, "then callback for creating a new config is not called");
			assert.strictEqual(fireEventSpy.calledOnce, true, "then event to update application list is fired");
			assert.strictEqual(fireEventSpy.calledWith("updateAppListEvent"), true, "then event to update application list is fired with correct parameters");
			assert.strictEqual(createMessageObjectSpy.calledOnce, true, "then createMessageObjectSpy is called once");
			assert.strictEqual(putMessageStub.calledOnce, true, "then putMessageStub is called once");
			assert.strictEqual(putMessageStub.getCall(0).args[0].getCode(), "11515", "then error message with correct code is logged");
			done();
	},0);
	});
	QUnit.test("When importing delivered content and when configuration already exists and on not overwriting existing configuration and not providing title for new config", function(assert) {
		//action
		assert.expect(5);
		var done = assert.async();
		setTimeout(function() {
			_selectItemAndPressOk();
			var oOverwriteDialog = oImportDeliveredContentView.getDependents()[0];
			oOverwriteDialog.getContent()[0].getItems()[1].setSelectedButton(oOverwriteDialog.getContent()[0].getItems()[1].getButtons()[1]);
			oImportDeliveredContentView.getController().handleChangeForOverwriteConfigOptions();
			oOverwriteDialog.getContent()[0].getItems()[2].getItems()[1].setValue("");
			oOverwriteDialog.getBeginButton().firePress();
			sap.ui.getCore().applyChanges();
			//assertion
			assert.strictEqual(importConfigurationSpy.calledOnce, true, "then importConfigurationFromVendorLayer function is called once");
			assert.strictEqual(callbackOverwrite.called, false, "then callback for creating a new config is not called");
			assert.strictEqual(callbackDoNotOverwrite.called, false, "then callback for overwrite is not called");
			assert.strictEqual(oOverwriteDialog.getContent()[0].getItems()[2].getItems()[1].getValueState(), sap.ui.core.ValueState.Error, "then Value state for input field is set to Error since title for new config is empty");
			//cleanup
			oOverwriteDialog.getEndButton().firePress();
			sap.ui.getCore().applyChanges();
			done();
		}, 0);
	});
});
