sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/fl/FakeLrepConnectorLocalStorage',
	'sap/ui/core/util/MockServer'

], function(
	UIComponent,
	FakeLrepConnectorLocalStorage,
	MockServer
) {
	"use strict";

	return UIComponent.extend("applicationUnderTest.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			this.oMockServer = new MockServer({
				rootUri: "applicationUnderTest/"
			});
			this.oMockServer.simulate("mockserver/metadata.xml", "mockserver/");
			this.oMockServer.start();

			// Init LRep for VariantManagement (we have to fake the connection to LRep in order to be independent from backend)
			FakeLrepConnectorLocalStorage.enableFakeConnector();
			FakeLrepConnectorLocalStorage.forTesting.synchronous.clearAll();

			// Save Variant
			FakeLrepConnectorLocalStorage.forTesting.synchronous.store("id_applicationUnderTest00_table", {
				changeType: "table",
				conditions: {},
				content: {
					filter: {
						filterItems: [
							{
								columnKey: "Name",
								exclude: false,
								operation: "EQ",
								value1: "Gladiator MX"
							}
						]
					}
				},
				context: "",
				creation: "2017-09-15T07:22:03.112Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTest00_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTest/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTest.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTest"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.51.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Filter By Name 'Gladiator MX'"
					}
				},
				validAppVersions: {
					creation: "",
					from: ""
				}

			});
			// call the base component's init function and create the App view
			UIComponent.prototype.init.apply(this, arguments);
		},

		destroy: function() {
			this.oMockServer.stop();
			this.oMockServer.destroy();
			FakeLrepConnectorLocalStorage.disableFakeConnector();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});
});
