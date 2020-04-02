sap.ui.define([
	'sap/ui/core/UIComponent',
	"sap/ui/fl/FakeLrepConnectorLocalStorage",
	'sap/ui/core/util/MockServer'
], function(
	UIComponent,
	FakeLrepConnectorLocalStorage,
	MockServer
) {
	"use strict";

	return UIComponent.extend("applicationUnderTestIgnoreSimple.Component", {

		init: function() {
			// Init LRep for VariantManagement (we have to fake the connection to LRep in order to be independent from backend)
			FakeLrepConnectorLocalStorage.enableFakeConnector();
			FakeLrepConnectorLocalStorage.forTesting.synchronous.clearAll();
			this.oMockServer = new MockServer({
				rootUri: "applicationUnderTestIgnoreSimple/"
			});
			this.oMockServer.simulate("mockserver/metadata.xml", "mockserver/");
			this.oMockServer.start();

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
