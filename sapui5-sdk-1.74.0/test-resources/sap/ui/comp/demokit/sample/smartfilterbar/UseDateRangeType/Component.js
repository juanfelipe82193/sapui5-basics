sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/fl/FakeLrepConnectorLocalStorage',
	'sap/ui/core/util/MockServer'
], function(UIComponent, FakeLrepConnectorLocalStorage, MockServer) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartfilterbar.UseDateRangeType.Component", {
		metadata: {
			manifest: "json"
		},
		constructor: function () {
			UIComponent.prototype.constructor.apply(this, arguments);
			FakeLrepConnectorLocalStorage.enableFakeConnector();

			//Start Mockserver
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
		},

		destroy: function() {
			UIComponent.prototype.destroy.apply(this, arguments);
			FakeLrepConnectorLocalStorage.disableFakeConnector();

			this._oMockServer.stop();
		}
	});
});
