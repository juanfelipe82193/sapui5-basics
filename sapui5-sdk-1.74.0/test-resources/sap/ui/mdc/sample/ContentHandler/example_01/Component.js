sap.ui.define([
	"sap/ui/core/UIComponent", "sap/ui/fl/FakeLrepConnectorLocalStorage", "sap/ui/rta/util/UrlParser", "sap/ui/fl/FakeLrepConnector", "sap/ui/core/util/MockServer", "sap/ui/model/resource/ResourceModel", "sap/ui/model/odata/v2/ODataModel", "sap/ui/model/json/JSONModel", "sap/ui/rta/Utils"
], function(UIComponent, FakeLrepConnectorLocalStorage, UrlParser, FakeLrepConnector, MockServer, ResourceModel, ODataModel, JSONModel, Utils) {

	"use strict";

	return UIComponent.extend("sap.ui.mdc.sample.ContentHandler.example_01.Component", {

		metadata: {
			manifest: "json"
		},

		constructor: function() {
			UIComponent.prototype.constructor.apply(this, arguments);
			this._createFakeLrep();
		},

		init: function() {
			this._adaptButtonConfiguration();
			this._startMockServer();
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
		},

		_startMockServer: function() {
			var sURL = "/destinations/E91/sap/opu/odata/SAP/VariantManagementTest/";
			var oMockServer = new MockServer({
				rootUri: sURL
			});
			this._sResourcePath = sap.ui.require.toUrl("sap/ui/mdc/sample/ContentHandler/example_01");

			oMockServer.simulate(this._sResourcePath + "/mockserver/metadata.xml", this._sResourcePath + "/mockserver");

			oMockServer.start();

			this.setModel(new ODataModel(sURL, {
				defaultBindingMode: "TwoWay"
			}));
			return sURL;
		},

		_adaptButtonConfiguration: function() {
			this.setModel(new JSONModel({
				showAdaptButton: !Utils.getUshellContainer()
			}), "app");
		},

		_createFakeLrep: function() {
			if (UrlParser.getParam('sap-rta-mock-lrep') !== false) {
				var mAppManifest = this.getManifestEntry("sap.app");
				var mSettings = {};
				//				mSettings.sInitialComponentJsonPath = jQuery.sap.getModulePath("sap.ui.fl.qunit.testResources").replace('resources', 'test-resources') + "/FakeVariantLrepResponse.json";
				FakeLrepConnectorLocalStorage.enableFakeConnector(mSettings, mAppManifest.id + '.Component', mAppManifest.applicationVersion.version);
			}
		},

		destroy: function() {
			if (UrlParser.getParam('sap-rta-mock-lrep') !== false) {
				var mAppManifest = this.getManifestEntry("sap.app");
				FakeLrepConnector.disableFakeConnector(mAppManifest.id + '.Component', mAppManifest.applicationVersion.version);
			}
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		}

	});
});
