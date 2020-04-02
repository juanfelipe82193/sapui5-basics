sap.ui.define([
	"sap/ui/model/odata/v2/ODataModel", "sap/ui/core/util/MockServer"
], function(ODataModel, MockServer) {
	"use strict";

	return sap.ui.controller("sap.ui.comp.sample.smartmicrochart.SmartRadialMicroChart.exampleMaximize.Page", {
		onInit: function() {
			this._initMockServer();

			var oMaximizeModel = new ODataModel("smartmicrochart.SmartRadialMicroChart/maximize", true);
			this.getView().setModel(oMaximizeModel);

			var oMaximizeSmartChart = this.getView().byId("maximizeSmartChart");
			oMaximizeSmartChart.bindElement("/Products('PC')");

			var oMaximizeSmartChartWarning = this.getView().byId("maximizeSmartChartWarning");
			oMaximizeSmartChartWarning.bindElement("/Products('Mouse')");

			var oMaximizeSmartChartError = this.getView().byId("maximizeSmartChartError");
			oMaximizeSmartChartError.bindElement("/Products('Chair')");
		},

		onExit: function() {
			this._oMockServer.stop();
			this._oMockServer.destroy();
		},

		_initMockServer: function() {
			this._oMockServer = new MockServer({
				rootUri: "smartmicrochart.SmartRadialMicroChart/maximize/"
			});

			this._oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartRadialMicroChart/exampleMaximize/mockserver/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartRadialMicroChart/exampleMaximize/mockserver"
			});

			this._oMockServer.start();
		}
	});
});
