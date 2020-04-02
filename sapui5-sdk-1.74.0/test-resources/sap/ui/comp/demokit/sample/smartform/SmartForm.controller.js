sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/ui/core/util/MockServer',
	'sap/ui/model/odata/v2/ODataModel'
], function (Controller, JSONModel, MockServer, ODataModel) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartform.SmartForm", {

		onInit: function () {
			/*
			 * LRep request are mocked in file: sap.ui.comp.sample.smartform.Component
			 */
			var oMockServer = new MockServer({
				rootUri: "smartform.SmartForm/"
			});
			oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartform/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartform/mockserver/");
			oMockServer.start();
			var oModel = new ODataModel("smartform.SmartForm", true);
			oModel.setDefaultBindingMode("TwoWay");

			this.getView().setModel(oModel);

			var that = this;
			oModel.getMetaModel().loaded().then(function () {
				that.getView().byId("smartForm").bindElement("/Products('1239102')");
			});

			// set explored app's demo model on this sample
			var oViewModel = new JSONModel();
			oViewModel.setProperty("/visible", true);
			this.getView().setModel(oViewModel, "test");

		},

		fnFormatter: function (bVis) {

			return bVis;
		},

		handleEditToggled: function (oEvent) {
			// just dummy function to activate input validation in SmartForm.
		}

	});
});