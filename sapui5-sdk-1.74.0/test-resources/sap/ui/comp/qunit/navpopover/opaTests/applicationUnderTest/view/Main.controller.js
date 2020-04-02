sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/rta/RuntimeAuthoring'

], function(
	Controller,
	ODataModel,
	RuntimeAuthoring
) {
	"use strict";

	var oController = Controller.extend("view.Main", {

		onInit: function() {
			// create and set ODATA Model
			this.oModel = new ODataModel("/mockserver");
			this.getView().setModel(this.oModel);
		},

		onPressRTA: function() {
			var oRuntimeAuthoring = new RuntimeAuthoring({
				rootControl: this.getOwnerComponent().getAggregation("rootControl"),
				stop: function() {
					oRuntimeAuthoring.destroy();
				}
			});
			oRuntimeAuthoring.start();
		},

		onExit: function() {
			this.oModel.destroy();
		}
	});

	return oController;
});
