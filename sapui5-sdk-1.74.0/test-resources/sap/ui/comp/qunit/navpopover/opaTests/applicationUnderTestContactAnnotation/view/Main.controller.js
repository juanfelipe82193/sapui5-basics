sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel'
], function(Controller, ODataModel) {
	"use strict";

	var oController = Controller.extend("view.Main", {

		onInit: function() {
			// create and set ODATA Model
			this.oModel = new ODataModel("/mockserver", true);
			this.getView().setModel(this.oModel);
		},

		onExit: function() {
			this.oModel.destroy();
		}
	});

	return oController;
});