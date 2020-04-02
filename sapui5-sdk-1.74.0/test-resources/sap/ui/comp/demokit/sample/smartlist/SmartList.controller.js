sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/core/util/MockServer'
], function (Controller, ODataModel, MockServer) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartlist.SmartList", {
		onInit: function () {
			var oModel, oView;

			var oMockServer = new MockServer({
				rootUri: "sapuicompsmartlist/"
			});
			this._oMockServer = oMockServer;
			oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smarttable/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smarttable/mockserver/");
			oMockServer.start();
			oModel = new ODataModel("sapuicompsmartlist", {
				defaultCountMode: "Inline"
			});
			oView = this.getView();
			oView.setModel(oModel);
		},
		onExit: function () {
			this._oMockServer.stop();
		}
	});
});