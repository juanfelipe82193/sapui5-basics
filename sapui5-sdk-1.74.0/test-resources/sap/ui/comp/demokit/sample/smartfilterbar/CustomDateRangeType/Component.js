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

	return UIComponent.extend("sap.ui.comp.sample.smartfilterbar.CustomDateRangeType.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			// Start Mockserver
			this._oMockServer = new MockServer({
				rootUri: "/MockDataService/"
			});
			var sMockdataUrl = sap.ui.require.toUrl("sap/ui/comp/sample/smartfilterbar/mockserver");
			var sMetadataUrl = sMockdataUrl + "/metadata.xml";
			this._oMockServer.simulate(sMetadataUrl, {
				sMockdataBaseUrl: sMockdataUrl,
				aEntitySetsNames: [
					"LineItemsSet", "VL_SH_H_T001", "VL_SH_DEBIA"
				]
			});
			this._oMockServer.start();

			FakeLrepConnectorLocalStorage.enableFakeConnector();

			// call the base component's init function and create the App view
			UIComponent.prototype.init.apply(this, arguments);
		},

		destroy: function() {
			this._oMockServer.stop();
			FakeLrepConnectorLocalStorage.disableFakeConnector();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});
});
