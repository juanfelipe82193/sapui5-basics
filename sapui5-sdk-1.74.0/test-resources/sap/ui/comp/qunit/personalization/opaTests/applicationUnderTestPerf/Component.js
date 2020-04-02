sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/fl/FakeLrepConnectorLocalStorage',
	'sap/ui/core/util/MockServer',
	'sap/chart/library' // In here as chart lib cannot be loaded in manifest due to interference with sinon - workarround
], function(
	UIComponent,
	FakeLrepConnectorLocalStorage,
	MockServer,
	chartLib // In here as chart lib cannot be loaded in manifest due to interference with sinon - workarround
) {
	"use strict";

	return UIComponent.extend("applicationUnderTestPerf.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			this.oMockServer = new MockServer({
				rootUri: "applicationUnderTestPerf/"
			});
			this.oMockServer.simulate("mockserver/metadata.xml", "mockserver/");
			this.oMockServer.start();

			// Init LRep for VariantManagement (we have to fake the connection to LRep in order to be independent from backend)
			FakeLrepConnectorLocalStorage.enableFakeConnector();
			FakeLrepConnectorLocalStorage.forTesting.synchronous.clearAll();

			// Save Filter Variant
			FakeLrepConnectorLocalStorage.forTesting.synchronous.store("id_applicationUnderTestPerf00_table", {
				changeType: "table",
				conditions: {},
				content: {
					filter: {
						filterItems: [
							{
								columnKey: "Name",
								exclude: false,
								operation: "Contains",
								value1: "Gladiator MX",
								value2: ""
							}
						]
					}
				},
				context: "",
				creation: "2018-01-27T22:10:29.555Z",
				dependentSelector: {},
				fileName: "id_applicationUnderTestPerf00_table",
				fileType: "variant",
				layer: "USER",
				namespace: "apps/applicationUnderTestPerf/changes/",
				originalLanguage: "EN",
				packageName: "",
				reference: "applicationUnderTestPerf.Component",
				selector: {
					persistencyKey: "PKeyApplicationUnderTestPerf"
				},
				support: {
					generator: "Change.createInitialFileContent",
					sapui5Version: "1.53.0-SNAPSHOT",
					service: "",
					user: ""
				},
				texts: {
					variantName: {
						type: "XFLD",
						value: "Filtered By Name 'Gladiator MX'"
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
			FakeLrepConnectorLocalStorage.disableFakeConnector();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});
});
