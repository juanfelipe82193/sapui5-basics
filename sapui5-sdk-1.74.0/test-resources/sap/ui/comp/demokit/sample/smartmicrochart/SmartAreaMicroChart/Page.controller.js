sap.ui.define([
	"sap/ui/model/odata/v2/ODataModel", "sap/ui/core/util/MockServer"
], function(ODataModel, MockServer) {
	"use strict";

	return sap.ui.controller("sap.ui.comp.sample.smartmicrochart.SmartAreaMicroChart.Page", {
		onInit: function() {
			this._initMockServer();

			var oNeutralModel = new ODataModel("smartmicrochart.SmartAreaMicroChart/neutral", true);
			var oNeutralSmartChart = this.getView().byId("NeutralSmartChart");
			var oUnitOfMeasure = this.getView().byId("unitOfMeasure");
			oNeutralSmartChart.setUnitOfMeasure(oUnitOfMeasure);
			var oChartTitle = this.getView().byId("chartTitle1");
			oNeutralSmartChart.setChartTitle(oChartTitle);
			oNeutralSmartChart.setModel(oNeutralModel);

			var oTargetModel = new ODataModel("smartmicrochart.SmartAreaMicroChart/target", true);
			var oTargetSmartChart = this.getView().byId("TargetSmartChart");
			oChartTitle = this.getView().byId("chartTitle");
			oTargetSmartChart.setChartTitle(oChartTitle);
			oTargetSmartChart.setModel(oTargetModel);

			var oMaximizeModel = new ODataModel("smartmicrochart.SmartAreaMicroChart/maximize", true);
			var oMaximizeSmartChart = this.getView().byId("MaximizeSmartChart");
			var oChartDescription = this.getView().byId("chartDescription");
			oMaximizeSmartChart.setChartDescription(oChartDescription);
			oMaximizeSmartChart.setModel(oMaximizeModel);

			var oMinimizeModel = new ODataModel("smartmicrochart.SmartAreaMicroChart/minimize", true);
			var oMinimizeSmartChart = this.getView().byId("MinimizeSmartChart");
			oMinimizeSmartChart.setModel(oMinimizeModel);
		},

		onExit: function() {
			this._oMockServerNeutralCriticality.stop();
			this._oMockServerTargetCriticality.stop();
			this._oMockServerMaximizeCriticality.stop();
			this._oMockServerMinimizeCriticality.stop();
		},

		_initMockServer: function() {
			this._oMockServerNeutralCriticality = new MockServer({
				rootUri: "smartmicrochart.SmartAreaMicroChart/neutral/"
			});
			this._oMockServerTargetCriticality = new MockServer({
				rootUri: "smartmicrochart.SmartAreaMicroChart/target/"
			});
			this._oMockServerMaximizeCriticality = new MockServer({
				rootUri: "smartmicrochart.SmartAreaMicroChart/maximize/"
			});
			this._oMockServerMinimizeCriticality = new MockServer({
				rootUri: "smartmicrochart.SmartAreaMicroChart/minimize/"
			});

			this._oMockServerNeutralCriticality.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartAreaMicroChart/mockserver/metadataNeutral.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartAreaMicroChart/mockserver"
			});

			this._oMockServerTargetCriticality.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartAreaMicroChart/mockserver/metadataTarget.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartAreaMicroChart/mockserver"
			});

			this._oMockServerMaximizeCriticality.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartAreaMicroChart/mockserver/metadataMaximize.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartAreaMicroChart/mockserver"
			});

			this._oMockServerMinimizeCriticality.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartAreaMicroChart/mockserver/metadataMinimize.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartAreaMicroChart/mockserver"
			});

			this._oMockServerNeutralCriticality.start();
			this._oMockServerTargetCriticality.start();
			this._oMockServerMaximizeCriticality.start();
			this._oMockServerMinimizeCriticality.start();
		}
	});
});
