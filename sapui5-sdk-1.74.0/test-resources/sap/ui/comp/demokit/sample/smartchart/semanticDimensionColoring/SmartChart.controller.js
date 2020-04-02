sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/m/MessageBox',
	'sap/ui/fl/FakeLrepConnector',
	'sap/ui/core/util/MockServer',
	'sap/ui/model/odata/v2/ODataModel'
], function(Controller, MessageBox, FakeLrepConnector, MockServer, ODataModel) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartchart.semanticDimensionColoring.SmartChart", {

		onInit: function() {
			// enable 'mock' variant management
			FakeLrepConnector.enableFakeConnector("mockserver/component-test-changes.json");

			this._oMockServer = new MockServer({
				rootUri: "sapuicompsmartchartsemanticpatterns/"
			});
			this._oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartchart/semanticDimensionColoring/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartchart/semanticDimensionColoring/mockserver/");
			this._oMockServer.start();

			// create and set ODATA Model
			this._oModel = new ODataModel("sapuicompsmartchartsemanticpatterns", true);
			this.getView().setModel(this._oModel);
		},

		onExit: function() {
			this._oMockServer.stop();
			this._oModel.destroy();
		}
	});
});
