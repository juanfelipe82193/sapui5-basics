sap.ui.define([
	"sap/ui/model/odata/v2/ODataModel", "sap/ui/core/util/MockServer"
], function(ODataModel, MockServer) {
	"use strict";

	return sap.ui.controller("sap.ui.comp.sample.smartmicrochart.SmartMicroChart.exampleBase.Page", {
		onInit: function() {
			this._initMockServer();
			var oModel = new ODataModel("smartmicrochart.SmartMicroChart/", true);

			var oSmartChart = this.getView().byId("smartChartBullet");
			oSmartChart.setUnitOfMeasure(this.getView().byId("unitLabelBullet").setModel(oModel));
			oSmartChart.setChartTitle(this.getView().byId("titleLabelBullet").setModel(oModel));
			oSmartChart.setChartDescription(this.getView().byId("descriptionLabelBullet").setModel(oModel));
			this.getView().byId("titleLabelBullet").bindElement("/Products('PC')");
			this.getView().byId("descriptionLabelBullet").bindElement("/Products('PC')");
			this.getView().byId("unitLabelBullet").bindElement("/Products('PC')");
			oSmartChart.setModel(oModel);

			oSmartChart = this.getView().byId("smartChartArea");
			oSmartChart.setUnitOfMeasure(this.getView().byId("unitLabelArea").setModel(oModel));
			oSmartChart.setChartTitle(this.getView().byId("titleLabelArea").setModel(oModel));
			oSmartChart.setChartDescription(this.getView().byId("descriptionLabelArea").setModel(oModel));
			oSmartChart.setModel(oModel);

			oSmartChart = this.getView().byId("smartChartLine");
			oSmartChart.setChartTitle(this.getView().byId("titleLabelLine").setModel(oModel));
			oSmartChart.setChartDescription(this.getView().byId("descriptionLabelLine").setModel(oModel));
			oSmartChart.setModel(oModel);

			oSmartChart = this.getView().byId("smartChartDonut");
			oSmartChart.setUnitOfMeasure(this.getView().byId("unitLabelDonut").setModel(oModel));
			oSmartChart.setChartTitle(this.getView().byId("titleLabelDonut").setModel(oModel));
			oSmartChart.setChartDescription(this.getView().byId("descriptionLabelDonut").setModel(oModel));
			oSmartChart.setFreeText(this.getView().byId("freeTextLabelDonut").setModel(oModel));
			this.getView().byId("unitLabelDonut").bindElement("/Sales('Keyboard')");
			oSmartChart.setModel(oModel);

			oSmartChart = this.getView().byId("smartChartPie");
			var oUnitLabelPie = this.getView().byId("unitLabelPie").setModel(oModel);
			oSmartChart.setUnitOfMeasure(oUnitLabelPie);
			oSmartChart.setChartTitle(this.getView().byId("titleLabelPie").setModel(oModel));
			oSmartChart.setChartDescription(this.getView().byId("descriptionLabelPie").setModel(oModel));
			this.getView().byId("unitLabelPie").bindElement("/Products('PC')");
			oSmartChart.setModel(oModel);

			oSmartChart = this.getView().byId("smartChartStackedBar");
			oSmartChart.setUnitOfMeasure(this.getView().byId("unitLabelBarStacked").setModel(oModel));
			oSmartChart.setChartTitle(this.getView().byId("titleLabelBarStacked").setModel(oModel));
			oSmartChart.setChartDescription(this.getView().byId("descriptionLabelBarStacked").setModel(oModel));
			oSmartChart.setModel(oModel);


			oModel = new ODataModel("smartmicrochart.SmartMicroChart2/", true);

			oSmartChart = this.getView().byId("smartChartColumn");
			oSmartChart.setUnitOfMeasure(this.getView().byId("unitLabelColumn").setModel(oModel));
			oSmartChart.setChartTitle(this.getView().byId("titleLabelColumn").setModel(oModel));
			oSmartChart.setChartDescription(this.getView().byId("descriptionLabelColumn").setModel(oModel));
			oSmartChart.setModel(oModel);
		},

		onExit: function() {
			this._oMockServer.stop();
			this._oMockServer2.stop();
		},

		_initMockServer: function() {
			this._oMockServer = new MockServer({
				rootUri: "smartmicrochart.SmartMicroChart/"
			});
			this._oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver"
			});
			this._oMockServer.start();

			this._oMockServer2 = new MockServer({
				rootUri: "smartmicrochart.SmartMicroChart2/"
			});
			this._oMockServer2.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver/metadata2.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver"
			});
			this._oMockServer2.start();
		}
	});
});
