sap.ui.define([
	"sap/ui/model/odata/v2/ODataModel", "sap/ui/core/util/MockServer", "sap/ui/core/CustomData"
], function(ODataModel, MockServer, CustomData) {
	"use strict";

	return sap.ui.controller("sap.ui.comp.sample.smartmicrochart.SmartBulletMicroChart.exampleDirect.Page", {
		onInit: function() {
			this._initMockServer();

			var oDirectModel = new ODataModel("smartmicrochart.SmartBulletMicroChart/", true);
			this.getView().setModel(oDirectModel);
			var oDirectSmartChartNeutral = this.getView().byId("directSmartChartNeutral");
			var oUnitOfMeasureLabel = this.getView().byId("unitOfMeasure");
			oDirectSmartChartNeutral.bindElement("/Products('PC')");
			oDirectSmartChartNeutral.setUnitOfMeasure(oUnitOfMeasureLabel);
			oUnitOfMeasureLabel.bindElement("/Products('PC')");

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
				rootUri: "smartmicrochart.SmartBulletMicroChart/"
			});

			this._oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartBulletMicroChart/exampleDirect/mockserver/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartBulletMicroChart/exampleDirect/mockserver"
			});

			this._oMockServer.start();
		}
	});
});
