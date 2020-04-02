sap.ui.define([
	"sap/ui/model/odata/v2/ODataModel", "sap/ui/core/util/MockServer"
], function(ODataModel, MockServer) {
	"use strict";

	return sap.ui.controller("sap.ui.comp.sample.smartmicrochart.SmartMicroChart.exampleDataPoint.Page", {
		onInit: function() {
			this._initMockServer();
			var oModel = new ODataModel("smartmicrochart.SmartMicroChartDataPoint/", true);
			this.getView().setModel(oModel);
		},

		onExit: function() {
			this._oMockServer.stop();
		},

		_initMockServer: function() {
			this._oMockServer = new MockServer({
				rootUri: "smartmicrochart.SmartMicroChartDataPoint/"
			});

			this._oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleDataPoint/mockserver/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleDataPoint/mockserver"
			});

			this._oMockServer.start();
		}
	});
});
