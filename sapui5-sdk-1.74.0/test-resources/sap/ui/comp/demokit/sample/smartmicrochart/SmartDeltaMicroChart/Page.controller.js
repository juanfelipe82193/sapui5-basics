sap.ui.define([ "sap/ui/model/odata/v2/ODataModel", "sap/ui/core/util/MockServer" ],
	function(ODataModel, MockServer) {
	"use strict";

	return sap.ui.controller("sap.ui.comp.sample.smartmicrochart.SmartDeltaMicroChart.Page", {
		onInit: function() {
			this._initMockServer();

			var oModel = new ODataModel("smartmicrochart.SmartDeltaMicroChart", true);
			this.getView().setModel(oModel);

			var oDeltaChart1 = this.getView().byId("deltaChart1");
			oDeltaChart1.setChartTitle(this.getView().byId("chartTitle"));
			oDeltaChart1.setChartDescription(this.getView().byId("chartDescription"));


			var oDeltaChart2 = this.getView().byId("deltaChart2");
			oDeltaChart2.bindElement("/Products('Mouse')");
			var oUnitOfMeasure = this.getView().byId("unitOfMeasure");
			oUnitOfMeasure.bindElement("/Products('Mouse')");
			oDeltaChart2.setUnitOfMeasure(oUnitOfMeasure);
		},

		onExit : function() {
			this._oMockServer.stop();
			this._oMockServer.destroy();
		},

		_initMockServer : function() {
			this._oMockServer = new MockServer({
				rootUri : "smartmicrochart.SmartDeltaMicroChart/"
			});

			this._oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartDeltaMicroChart/mockserver/metadata.xml", {
				sMockdataBaseUrl : "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartDeltaMicroChart/mockserver"
			});

			this._oMockServer.start();
		}
	});
});
