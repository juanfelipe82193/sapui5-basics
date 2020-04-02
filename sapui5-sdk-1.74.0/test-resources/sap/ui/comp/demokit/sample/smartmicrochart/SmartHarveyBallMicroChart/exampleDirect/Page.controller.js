sap.ui.define([
	"sap/ui/model/odata/v2/ODataModel", "sap/ui/core/util/MockServer"
], function(ODataModel, MockServer) {
	"use strict";

	return sap.ui.controller("sap.ui.comp.sample.smartmicrochart.SmartHarveyBallMicroChart.exampleDirect.Page", {
		onInit: function() {
			this._initMockServer();

			var oDirectModel = new ODataModel("smartmicrochart.SmartHarveyBallMicroChart/", true);
			this.getView().setModel(oDirectModel);

			var oDirectSmartChartNeutral = this.getView().byId("directSmartChartNeutral");
			oDirectSmartChartNeutral.bindElement("/Products('PC')");
			var oFreeTextLabel = this.getView().byId("title");
			oDirectSmartChartNeutral.setChartTitle(oFreeTextLabel);
			oFreeTextLabel.bindElement("/Products('PC')");

			var oDirectSmartChartPositive = this.getView().byId("directSmartChartPositive");
			var oUnitOfMeasureLabel = this.getView().byId("unitOfMeasure");
			oDirectSmartChartPositive.setUnitOfMeasure(oUnitOfMeasureLabel);
			oUnitOfMeasureLabel.bindElement("/Products('Keyboard')");

			var oDirectSmartChartCritical = this.getView().byId("directSmartChartCritical");
			var oTitleLabel = this.getView().byId("chartTitle");
			oDirectSmartChartCritical.bindElement("/Products('Mouse')");
			oDirectSmartChartCritical.setChartTitle(oTitleLabel);
			oTitleLabel.bindElement("/Products('Mouse')");

			var oDirectSmartChartNegative = this.getView().byId("directSmartChartNegative");
			var oDescriptionLabel = this.getView().byId("chartDescription");
			oDirectSmartChartNegative.bindElement("/Products('Chair')");
			oDirectSmartChartNegative.setChartDescription(oDescriptionLabel);
			oDescriptionLabel.bindElement("/Products('Chair')");
		},

		onExit: function() {
			this._oMockServer.stop();
			this._oMockServer.destroy();
		},

		_initMockServer: function() {
			this._oMockServer = new MockServer({
				rootUri: "smartmicrochart.SmartHarveyBallMicroChart/"
			});

			this._oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartHarveyBallMicroChart/exampleDirect/mockserver/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartHarveyBallMicroChart/exampleDirect/mockserver"
			});

			this._oMockServer.start();
		}
	});
});
