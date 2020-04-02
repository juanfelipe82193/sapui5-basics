sap.ui.define([
	'sap/ui/core/mvc/Controller', 'sap/ui/rta/RuntimeAuthoring'
], function(Controller, RuntimeAuthoring) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartlink.example_08.Example", {

		onInit: function() {
			this.getView().bindElement("/ProductCollection('38094020.2')");
		},

		onPressRTA: function() {
			var oRuntimeAuthoring = new RuntimeAuthoring({
				rootControl: this.getOwnerComponent().getAggregation("rootControl"),
				stop: function() {
					oRuntimeAuthoring.destroy();
				}
			});
			oRuntimeAuthoring.start();
		}
	});
});
