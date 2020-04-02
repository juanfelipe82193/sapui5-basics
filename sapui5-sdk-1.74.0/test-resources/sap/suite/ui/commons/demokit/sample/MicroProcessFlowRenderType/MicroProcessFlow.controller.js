sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
	var oPageController = Controller.extend("sap.suite.ui.commons.sample.MicroProcessFlowRenderType.MicroProcessFlow", {
		onInit: function () {
			var aSoloData = [],
				oModel = new sap.ui.model.json.JSONModel();

			for (var i = 0; i < 80; i++) {
				aSoloData.push({
					state: i % 2 ? "Error" : "Warning",
					width: (i + 20) + "px"
				});
			}

			oModel.setData({
				tableData: [{}, {}, {}, {}, {}, {}, {}, {}],
				soloData: aSoloData
			});
			this.getView().setModel(oModel);
		}
	});
	return oPageController;
});
