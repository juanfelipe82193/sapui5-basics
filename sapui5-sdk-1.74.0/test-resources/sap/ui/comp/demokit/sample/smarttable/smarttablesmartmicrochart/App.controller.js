sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/core/util/MockServer'
], function (Controller, ODataModel, MockServer) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smarttable.smarttablesmartmicrochart.App", {
		onInit: function () {
			this._initMockServer();
			var oModel = new ODataModel("sap.ui.comp.sample.smarttable.smarttablesmartmicrochart", true);
			var oView = this.getView();
			oView.setModel(oModel);
		},

		onExit: function () {
			this._oMockServer.stop();
		},

		_initMockServer: function () {
			var oMockServer = new MockServer({
				rootUri: "sap.ui.comp.sample.smarttable.smarttablesmartmicrochart/"
			});
			this._oMockServer = oMockServer;
			this._oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smarttable/smarttablesmartmicrochart/mockserver/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smarttable/smarttablesmartmicrochart/mockserver"
			});
			oMockServer.start();
		},

		onBeforeExport: function (oEvt) {
			var mExcelSettings = oEvt.getParameter("exportSettings");

			// Disable Worker as Mockserver is used in Demokit sample
			mExcelSettings.worker = false;
		},

		onBeforeRebindTable: function (oEvent) {
			var bindingParams = oEvent.getParameter("bindingParams");
			bindingParams.parameters.select += ",Revenue,TargetRevenue,ForecastRevenue,DeviationRangeLow,DeviationRangeHigh,ToleranceRangeLow,ToleranceRangeHigh,MinValue,MaxValue";
		}
	});
});
