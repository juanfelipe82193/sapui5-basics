sap.ui.define([
	"sap/ui/model/odata/v2/ODataModel", "sap/ui/core/util/MockServer"
], function(ODataModel, MockServer) {
	"use strict";

	return sap.ui.controller("sap.ui.comp.sample.smartmicrochart.SmartStackedBarMicroChart.Page", {
		onInit: function() {
			this._initMockServer();

			var oDefaultModel = new ODataModel("smartmicrochart.SmartStackedBarMicroChart/default", true);
			var oDefaultStackedBar = this.getView().byId("defaultStacked");
			var oUnitOfMeasure = this.getView().byId("unitOfMeasure");
			oDefaultStackedBar.setUnitOfMeasure(oUnitOfMeasure);
			oDefaultStackedBar.setModel(oDefaultModel);

			var oDisplayValueModel = new ODataModel("smartmicrochart.SmartStackedBarMicroChart/displayValue", true);
			var oDisplayValueStackedBar = this.getView().byId("displayValuesStacked");
			var oChartTitle = this.getView().byId("chartTitle");
			oDisplayValueStackedBar.setChartTitle(oChartTitle);
			oDisplayValueStackedBar.setModel(oDisplayValueModel);
		},

		onExit: function() {
			this._oMockServerDefault.stop();
			this._oMockServerDisplayValue.stop();
		},

		_initMockServer: function() {
			this._oMockServerDefault = new MockServer({
				rootUri: "smartmicrochart.SmartStackedBarMicroChart/default/"
			});
			this._oMockServerDisplayValue = new MockServer({
				rootUri: "smartmicrochart.SmartStackedBarMicroChart/displayValue/"
			});

			this._oMockServerDefault.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartStackedBarMicroChart/mockserver/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartStackedBarMicroChart/mockserver"
			});

			this._oMockServerDisplayValue.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartStackedBarMicroChart/mockserver/metadataDisplayValue.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartStackedBarMicroChart/mockserver"
			});

			this._oMockServerDefault.start();
			this._oMockServerDisplayValue.start();
		}
	});
});
