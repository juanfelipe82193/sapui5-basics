sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/core/util/MockServer'
], function (Controller, ODataModel, MockServer) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smarttable.smartMTableWithCriticality.SmartTable", {
		onInit: function () {
			var oModel, oView;
			var oMockServer = new MockServer({
				rootUri: "smartMTableWithCriticality/"
			});
			this._oMockServer = oMockServer;
			oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smarttable/refAppMockServer/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smarttable/refAppMockServer/",
				bGenerateMissingMockData: true
			});
			oMockServer.start();
			oModel = new ODataModel("smartMTableWithCriticality", {
				json: true,
				defaultCountMode: "Inline",
				annotationURI: [
					"test-resources/sap/ui/comp/demokit/sample/smarttable/refAppMockServer/STTA_PROD_MAN_ANNO_MDL.xml"
				]
			});
			oView = this.getView();
			oView.setModel(oModel);
		},

		onBeforeExport: function (oEvt) {
			var mExcelSettings = oEvt.getParameter("exportSettings");

			// Disable Worker as Mockserver is used in Demokit sample
			mExcelSettings.worker = false;
		},

		onExit: function () {
			this._oMockServer.stop();
		}
	});
});
