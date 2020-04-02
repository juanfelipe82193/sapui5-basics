sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/BindingMode",
	"sap/ui/model/odata/v2/ODataModel"
], function (Controller, MockServer, BindingMode, ODataModel) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartfield.ExtendedODataType.Main", {
		onInit: function () {
			var oMockServer = new MockServer({
				rootUri: "/SampleDataService/"
			});

			var sPath = sap.ui.require.toUrl("sap/ui/comp/sample/smartfield/ExtendedODataType/mockserver/");
			oMockServer.simulate( sPath + "metadata.xml", sPath);

			oMockServer.start();
			this.oModel = new ODataModel("/SampleDataService");
			this.oModel.setDefaultBindingMode(BindingMode.TwoWay);
			var oView = this.getView();
			oView.setModel(this.oModel);
			oView.bindElement("/Items('1239102')");
		},
		onExit: function () {
			if (this.oMockServer) {
				this.oMockServer.destroy();
				this.oMockServer = null;
			}
			if (this.oModel) {
				this.oModel.destroy();
				this.oModel = null;
			}
		}
	});
});
