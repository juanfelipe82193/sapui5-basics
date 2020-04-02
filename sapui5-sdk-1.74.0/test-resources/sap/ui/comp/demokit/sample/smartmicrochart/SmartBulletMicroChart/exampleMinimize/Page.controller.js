sap.ui.define([
	"sap/ui/model/odata/v2/ODataModel", "sap/ui/core/util/MockServer"
], function(ODataModel, MockServer) {
	"use strict";

	return sap.ui.controller("sap.ui.comp.sample.smartmicrochart.SmartBulletMicroChart.exampleMinimize.Page", {
		onInit: function() {
			this._initMockServer();

			var oMinimizeModel = new ODataModel("smartmicrochart.SmartBulletMicroChart/minimize", true);

			var oMinimizeSmartChart = this.getView().byId("minimizeSmartChart");
			oMinimizeSmartChart.bindElement("/Products('PC')");

			var oMinimizeSmartChartWarning = this.getView().byId("minimizeSmartChartWarning");
			oMinimizeSmartChartWarning.bindElement("/Products('Mouse')");

			var oMinimizeSmartChartError = this.getView().byId("minimizeSmartChartError");
			oMinimizeSmartChartError.bindElement("/Products('Chair')");

			oMinimizeSmartChart.setModel(oMinimizeModel);
			oMinimizeSmartChartWarning.setModel(oMinimizeModel);
			oMinimizeSmartChartError.setModel(oMinimizeModel);
		},

		onExit: function() {
			this._oMockServer.stop();
			this._oMockServer.destroy();
		},

		_initMockServer: function() {
			this._oMockServer = new MockServer({
				rootUri: "smartmicrochart.SmartBulletMicroChart/minimize/"
			});

			this._oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartBulletMicroChart/exampleMinimize/mockserver/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartBulletMicroChart/exampleMinimize/mockserver"
			});

			this._oMockServer.start();
		}
	});
});
