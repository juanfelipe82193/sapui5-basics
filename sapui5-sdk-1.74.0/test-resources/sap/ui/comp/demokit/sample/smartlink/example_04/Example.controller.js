sap.ui.define([
	'sap/ui/core/mvc/Controller'
], function(Controller) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartlink.example_04.Example", {

		onInit: function() {
			this.getView().bindElement("/ProductCollection('1239102')");
		}
	});
});
