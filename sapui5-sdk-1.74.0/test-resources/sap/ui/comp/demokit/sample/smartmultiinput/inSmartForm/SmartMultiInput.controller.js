sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/BindingMode",
	"sap/ui/model/odata/v2/ODataModel"
], function (Controller, MockServer, BindingMode, ODataModel) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartmultiinput.inSmartForm.SmartMultiInput", {
		onInit: function () {
			var oMockServer = new MockServer({
				rootUri: "smartmultiinput.SmartMultiInput/"
			});
			oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmultiinput/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartmultiinput/mockserver/");
			oMockServer.start();
			var oModel = new ODataModel("smartmultiinput.SmartMultiInput");

			oModel.setDefaultBindingMode(BindingMode.TwoWay);

			oModel.setChangeGroups({ // default group "changes" is deferred, this will cause immediate update
				"Category": {
					groupId: "testgroupid"
				}
			});

			var oView = this.getView();
			oView.setModel(oModel);

			oView.byId("idSmartForm").bindElement("/Products('1')");
		},

		onCheckPress: function() {
			var oView = this.getView();

			oView.byId("idSmartForm").check();
		}
	});
});
