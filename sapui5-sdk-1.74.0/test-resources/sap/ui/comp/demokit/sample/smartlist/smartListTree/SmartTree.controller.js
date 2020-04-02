sap.ui.define([
	"sap/ui/model/odata/v2/ODataModel", "sap/ui/core/util/MockServer"
], function(ODataModel, MockServer) {
	"use strict";

	return sap.ui.controller("sap.ui.comp.sample.smartlist.smartListTree.SmartTree", {

		onInit: function() {
			// set explored app's demo model on this sample
			this.getView().setModel(new sap.ui.model.json.JSONModel("test-resources/sap/m/demokit/sample/Tree/Tree.json"));
		},

		handleSelectChange: function(oEvent) {
			var oTree = this.getView().byId("ItemsST").getList();
			oTree.setMode(oEvent.getParameter("selectedItem").getKey());
		}
	});
});