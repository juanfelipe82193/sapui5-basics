sap.ui.define([ "sap/ui/model/odata/v2/ODataModel", "sap/ui/core/util/MockServer" ],
	function(ODataModel, MockServer) {
	"use strict";

	return sap.ui.controller("sap.ui.comp.sample.smartmicrochart.SmartBulletMicroChart.exampleTarget.Page", {
		onInit: function() {
			this._initMockServer();

			var oTargetModel = new ODataModel("smartmicrochart.SmartBulletMicroChart/target", true);
			this.getView().setModel(oTargetModel);

			var oTargetSmartChart = this.getView().byId("targetSmartChart");
			oTargetSmartChart.bindElement("/Products('PC')");

			var oTargetSmartChartWarningLow = this.getView().byId("targetSmartChartWarningLow");
			oTargetSmartChartWarningLow.bindElement("/Products('Mouse')");

			var oTargetSmartChartWarningHigh = this.getView().byId("targetSmartChartWarningHigh");
			oTargetSmartChartWarningHigh.bindElement("/Products('Keyboard')");

			var oTargetSmartChartErrorLow = this.getView().byId("targetSmartChartErrorLow");
			oTargetSmartChartErrorLow.bindElement("/Products('Chair')");

			var oTargetSmartChartErrorHigh = this.getView().byId("targetSmartChartErrorHigh");
			oTargetSmartChartErrorHigh.bindElement("/Products('Headset')");

		},

		onExit : function() {
			this._oMockServer.stop();
			this._oMockServer.destroy();
		},

		_initMockServer : function() {
			this._oMockServer = new MockServer({
				rootUri : "smartmicrochart.SmartBulletMicroChart/target/"
			});

			this._oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartBulletMicroChart/exampleTarget/mockserver/metadata.xml", {
				sMockdataBaseUrl : "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartBulletMicroChart/exampleTarget/mockserver"
			});

			this._oMockServer.start();
		}
	});
});