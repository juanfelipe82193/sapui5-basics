sap.ui.define([
	"sap/ui/core/UIComponent",
	'sap/ui/fl/FakeLrepConnectorLocalStorage',
	'sap/ui/core/util/MockServer'
], function(
	UIComponent,
	FakeLrepConnectorLocalStorage,
	MockServer
){
	"use strict";

	return UIComponent.extend("DateRangeSample.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			// Start Mockserver
			var oMockServer = new MockServer({
				rootUri: "sapuicompsmarttable/"
			});
			oMockServer.simulate("./mockserver/metadata.xml", "./mockserver/");
			oMockServer.start();

			FakeLrepConnectorLocalStorage.enableFakeConnector();

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