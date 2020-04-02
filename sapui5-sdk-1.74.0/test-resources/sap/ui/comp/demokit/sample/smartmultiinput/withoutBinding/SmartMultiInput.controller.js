sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/BindingMode",
	"sap/ui/model/odata/v2/ODataModel",
	'sap/m/MessageToast'
], function (Controller, MockServer, BindingMode, ODataModel, MessageToast) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartmultiinput.withoutBinding.SmartMultiInput", {
		onInit: function () {
			this.oMockServer = new MockServer({
				rootUri: "smartmultiinput.SmartMultiInputWithoutBinding/"
			});
			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmultiinput/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartmultiinput/mockserver/");
			this.oMockServer.start();
			var oModel = new ODataModel("smartmultiinput.SmartMultiInputWithoutBinding");

			oModel.setDefaultBindingMode(BindingMode.TwoWay);
			var oView = this.getView();
			oView.setModel(oModel);

			this.byId("form").getGroups()[0].getGroupElements().forEach(function(oGroupElement) {
				var oSmartMultiInput = oGroupElement.getElements()[0];
				oSmartMultiInput.attachTokenUpdate(function(oEvent) {
					var sMsg = "TokenUpdate called for " + oEvent.getParameter("id") + ", token " + oEvent.getParameter("type");
					MessageToast.show(sMsg);
				});

				// for fixed-values MultiComboBox
				oSmartMultiInput.attachSelectionChange(function(oEvent) {
					var sMsg = "SelectionChange called for " + oEvent.getParameter("id") + ", item selected " + oEvent.getParameter("selected");
					MessageToast.show(sMsg);
				});
			});
		},

		onExit: function() {
			this.oMockServer.stop();
			this.oMockServer.destroy();
		}
	});
});
