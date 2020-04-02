sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/fl/FakeLrepConnectorLocalStorage',
	'sap/ui/core/util/MockServer'
], function(UIComponent, FakeLrepConnectorLocalStorage, MockServer) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartfilterbar.example1.Component", {

		_oMockServer: null,

		metadata: {
			rootView: {
			 "viewName": "sap.ui.comp.sample.smartfilterbar.example1.SmartFilterBar",
			   "type": "XML",
			  "async": true
			},
			dependencies: {
				libs: [ "sap.m", "sap.ui.comp" ]
			},
			config: {
				sample: {
					stretch: true,
					files: [
						"SmartFilterBar.view.xml",
						"SmartFilterBar.controller.js",
						"../mockserver/LineItemsSet.json",
						"../mockserver/metadata.xml",
						"../mockserver/VL_SH_H_T001.json",
						"../mockserver/VL_SH_DEBIA.json"
					]
				}
			}
		},
		constructor: function () {
			sap.ui.core.UIComponent.prototype.constructor.apply(this, arguments);
			sap.ui.fl.FakeLrepConnectorLocalStorage.enableFakeConnector();

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
			sap.ui.fl.FakeLrepConnectorLocalStorage.disableFakeConnector();
			sap.ui.core.UIComponent.prototype.destroy.apply(this, arguments);

			this._oMockServer.stop();
		}
	});
});