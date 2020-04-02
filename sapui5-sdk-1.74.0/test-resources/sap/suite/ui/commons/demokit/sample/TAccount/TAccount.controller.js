sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	var oPageController = Controller.extend("sap.suite.ui.commons.sample.TAccount.TAccount", {
		onInit: function () {
			var oModel = new JSONModel(jQuery.sap.getModulePath("sap.suite.ui.commons.sample.TAccount", "/data.json"));
			this.getView().setModel(oModel);
		}
	});

	return oPageController;
});
