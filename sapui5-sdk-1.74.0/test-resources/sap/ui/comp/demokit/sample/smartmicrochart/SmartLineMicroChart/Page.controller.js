sap.ui.define([
	"sap/ui/model/odata/v2/ODataModel", "sap/ui/core/util/MockServer"
], function(ODataModel, MockServer) {
	"use strict";

	return sap.ui.controller("sap.ui.comp.sample.smartmicrochart.SmartLineMicroChart.Page", {
		onInit: function() {
			this._initMockServer();

			var oModel = new ODataModel("smartmicrochart.SmartLineMicroChart/target", true);
			var oChart = this.getView().byId("idLineChart");
			var oChartTitle = this.getView().byId("chartTitle");
			oChart.setChartTitle(oChartTitle);
			oChart.setModel(oModel);
		},

		onExit: function() {
			this._oMockServerTargetCriticality.stop();
		},

		_initMockServer: function() {
			this._oMockServerTargetCriticality = new MockServer({
				rootUri: "smartmicrochart.SmartLineMicroChart/target/"
			});

			this._oMockServerTargetCriticality.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartLineMicroChart/mockserver/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartLineMicroChart/mockserver"
			});

			this._oMockServerTargetCriticality.start();
		}
	});
});
