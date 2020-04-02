sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/core/util/MockServer'
], function (Controller, ODataModel, MockServer) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smarttable.smarttreetable.SmartTable", {
		onInit: function () {
			var oModel, oView;
			var oMockServer = new MockServer({
				rootUri: "sapuicompsmarttreetable/"
			});
			this._oMockServer = oMockServer;
			oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smarttable/mockserver/orgHierarchy.xml", "test-resources/sap/ui/comp/demokit/sample/smarttable/mockserver/");
			oMockServer.start();
			oModel = new ODataModel("sapuicompsmarttreetable", true);
			oView = this.getView();
			oView.setModel(oModel);
		},

		onBeforeRebindTable: function (oEvent) {
			var oBindingParams = oEvent.getParameter('bindingParams');
			// Note: This example is based on mock data, so defining the number of expended levels in the beforeRebindTable event should be avoided for
			// performance reasons.
			oBindingParams.parameters.numberOfExpandedLevels = 2;
		},
		onExit: function () {
			this._oMockServer.stop();
		}
	});
});