sap.ui.define([
	"sap/ui/model/odata/v2/ODataModel", "sap/ui/core/util/MockServer"
], function(ODataModel, MockServer) {
	"use strict";

	return sap.ui.controller("sap.ui.comp.sample.smartmicrochart.SmartColumnMicroChart.Page", {
		onInit: function() {
			this._initMockServer();

			var oModel = new ODataModel("smartmicrochart.SmartColumnMicroChart", true);
			var oSmartChart = this.getView().byId("SmartChart");

			var oUnitOfMeasure = this.getView().byId("unitOfMeasure");
			oSmartChart.setUnitOfMeasure(oUnitOfMeasure);

			var oTitle = this.getView().byId("title");
			oSmartChart.setChartTitle(oTitle);

			var oDescription = this.getView().byId("description");
			oSmartChart.setChartDescription(oDescription);

			oSmartChart.setModel(oModel);


			var oSmartChart2 = this.getView().byId("SmartChart2");
			oModel = new ODataModel("smartmicrochart.SmartColumnMicroChart2", true);
			oSmartChart2.setModel(oModel);
		},

		onExit: function() {
			this._oMockServer.stop();
			this._oMockServer2.stop();
		},

		_initMockServer: function() {
			this._oMockServer = new MockServer({
				rootUri: "smartmicrochart.SmartColumnMicroChart/"
			});

			this._oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartColumnMicroChart/mockserver/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartColumnMicroChart/mockserver"
			});

			this._oMockServer.start();

			this._oMockServer2 = new MockServer({
				rootUri: "smartmicrochart.SmartColumnMicroChart2/"
			});

			this._oMockServer2.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartColumnMicroChart/mockserver/metadataColumnLabels.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartColumnMicroChart/mockserver"
			});

			this._oMockServer2.start();
		}
	});
});
