sap.ui.define([
	"sap/ui/model/odata/v2/ODataModel", "sap/ui/core/util/MockServer"
], function(ODataModel, MockServer) {
	"use strict";

	return sap.ui.controller("sap.ui.comp.sample.smartmicrochart.SmartComparisonMicroChart.Page", {
		onInit: function() {
			this._initMockServer();

			var oDefaultModel = new ODataModel("smartmicrochart.SmartComparisonMicroChart/default", true);
			var oDefaultStackedBar = this.getView().byId("defaultStacked");
			var oUnitOfMeasure = this.getView().byId("unitOfMeasure");
			oDefaultStackedBar.setUnitOfMeasure(oUnitOfMeasure);
			oDefaultStackedBar.setModel(oDefaultModel);

			var oDisplayValueModel = new ODataModel("smartmicrochart.SmartComparisonMicroChart/displayValue", true);
			var oDisplayValueStackedBar = this.getView().byId("displayValuesStacked");
			var DescriptionTitle = this.getView().byId("chartDescription");
			oDisplayValueStackedBar.setChartDescription(DescriptionTitle);
			oDisplayValueStackedBar.setModel(oDisplayValueModel);
		},

		onExit: function() {
			this._oMockServerDefault.stop();
			this._oMockServerDisplayValue.stop();
		},

		_initMockServer: function() {
			this._oMockServerDefault = new MockServer({
				rootUri: "smartmicrochart.SmartComparisonMicroChart/default/"
			});
			this._oMockServerDisplayValue = new MockServer({
				rootUri: "smartmicrochart.SmartComparisonMicroChart/displayValue/"
			});

			this._oMockServerDefault.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartComparisonMicroChart/mockserver/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartComparisonMicroChart/mockserver"
			});

			this._oMockServerDisplayValue.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartComparisonMicroChart/mockserver/metadataDisplayValue.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartComparisonMicroChart/mockserver"
			});

			this._oMockServerDefault.start();
			this._oMockServerDisplayValue.start();
		}
	});
});
