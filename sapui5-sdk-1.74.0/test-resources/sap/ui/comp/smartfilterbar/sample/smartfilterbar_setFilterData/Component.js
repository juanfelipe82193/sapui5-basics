
sap.ui.getCore().attachInit(function() {
	"use strict";
	sap.ui.define([
		'sap/ui/core/UIComponent',
		'sap/ui/fl/FakeLrepConnectorLocalStorage',
		'sap/ui/core/util/MockServer'

	], function (UIComponent, FakeLrepConnectorLocalStorage, MockServer) {

		return UIComponent.extend("sap.ui.comp.sample.smartfilterbar_setFilterData.Component", {
			metadata: {
				rootView: {
					"viewName": "sap.ui.comp.sample.smartfilterbar_setFilterData.SmartFilterBar",
					"type": "XML",
					"async": true
				},
				dependencies: {
					libs: [
						"sap.m", "sap.ui.comp"
					]
				}
			},
			init: function () {

				// OData Mockserver
				var oMockServer = new MockServer({
					rootUri: "/foo/"
				});
				this._oMockServer = oMockServer;
				var sMockdataUrl = sap.ui.require.toUrl("sap/ui/comp/sample/smartfilterbar_setFilterData/mockserver");
				var sMetadataUrl = sMockdataUrl + "/metadata.xml";
				oMockServer.simulate(sMetadataUrl, {
					sMockdataBaseUrl: sMockdataUrl,
					aEntitySetsNames: [
						"ZEPM_C_SALESORDERITEMQUERYResults", "ZEPM_C_SALESORDERITEMQUERY", "VL_FV_XFELD", "VL_SH_H_T001"
					]
				});

				var fnCustom = function (oEvent) {

					// filter according to the parameter. simulate table binding
					var sCurrency = this._oFilterBar.getFilterData()["$Parameter.P_DisplayCurrency"];
					var aResults = [];
					oEvent.getParameter("oFilteredData").results.forEach(function (item) {
						if (item.DisplayCurrency === sCurrency) {
							aResults.push(item);
						}
					});

					oEvent.getParameter("oFilteredData").results = aResults;
				}.bind(this);
				oMockServer.attachAfter("GET", fnCustom, "ZEPM_C_SALESORDERITEMQUERY");
				oMockServer.start();

				// LREP Mock
				FakeLrepConnectorLocalStorage.enableFakeConnector();

				UIComponent.prototype.init.apply(this, arguments);
			},

			destroy: function () {
				// OData Mockserver
				this._oMockServer.stop();

				// LREP Mock
				FakeLrepConnectorLocalStorage.disableFakeConnector();

				UIComponent.prototype.destroy.apply(this, arguments);
			}
		});
	});
});