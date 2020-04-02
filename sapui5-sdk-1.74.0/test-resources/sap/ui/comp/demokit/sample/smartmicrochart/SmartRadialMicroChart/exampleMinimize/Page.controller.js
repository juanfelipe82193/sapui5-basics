sap.ui.define([
	"sap/ui/model/odata/v2/ODataModel", "sap/ui/core/util/MockServer"
], function(ODataModel, MockServer) {
	"use strict";

	return sap.ui.controller("sap.ui.comp.sample.smartmicrochart.SmartRadialMicroChart.exampleMinimize.Page", {
		onInit: function() {
			this._initMockServer();

			var oMinimizeModel = new ODataModel("smartmicrochart.SmartRadialMicroChart/minimize", true);
			this.getView().setModel(oMinimizeModel);

			var oMinimizeSmartChart = this.getView().byId("minimizeSmartChart");
			oMinimizeSmartChart.bindElement("/Products('PC')");

			var oMinimizeSmartChartWarning = this.getView().byId("minimizeSmartChartWarning");
			oMinimizeSmartChartWarning.bindElement("/Products('Mouse')");

			var oMinimizeSmartChartError = this.getView().byId("minimizeSmartChartError");
			oMinimizeSmartChartError.bindElement("/Products('Chair')");
		},

		onExit: function() {
			this._oMockServer.stop();
			this._oMockServer.destroy();
		},

		_initMockServer: function() {
			this._oMockServer = new MockServer({
				rootUri: "smartmicrochart.SmartRadialMicroChart/minimize/"
			});

			this._oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartRadialMicroChart/exampleMinimize/mockserver/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartRadialMicroChart/exampleMinimize/mockserver"
			});

			this._oMockServer.start();
		}
	});
});
