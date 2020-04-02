sap.ui.define([ "sap/ui/model/odata/v2/ODataModel", "sap/ui/core/util/MockServer" ],
	function(ODataModel, MockServer) {
	"use strict";

	return sap.ui.controller("sap.ui.comp.sample.smartmicrochart.SmartBulletMicroChart.exampleDeltaMode.Page", {
		onInit: function() {
			this._initMockServer();

			var oTargetModel = new ODataModel("smartmicrochart.SmartBulletMicroChart/target", true);
			this.getView().setModel(oTargetModel);

			var oTargetSmartChart = this.getView().byId("targetSmartChart");
			oTargetSmartChart.bindElement("/Products('PC')");

			var oTargetSmartChartWarningLow = this.getView().byId("targetSmartChartWarningLow");
			oTargetSmartChartWarningLow.bindElement("/Products('Mouse')");

			var oTargetSmartChartErrorLow = this.getView().byId("targetSmartChartErrorLow");
			oTargetSmartChartErrorLow.bindElement("/Products('Chair')");

		},

		onExit : function() {
			this._oMockServer.stop();
			this._oMockServer.destroy();
		},

		_initMockServer : function() {
			this._oMockServer = new MockServer({
				rootUri : "smartmicrochart.SmartBulletMicroChart/target/"
			});

			this._oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartBulletMicroChart/exampleDeltaMode/mockserver/metadata.xml", {
				sMockdataBaseUrl : "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartBulletMicroChart/exampleDeltaMode/mockserver"
			});

			this._oMockServer.start();
		}
	});
});
