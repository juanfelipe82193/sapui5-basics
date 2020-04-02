sap.ui.define([
	"sap/ui/core/UIComponent",
	"./model/models"
], function(UIComponent, models) {
	"use strict";

	return UIComponent.extend("sap.ui.demo.chartdemo.Component", {
		metadata : {
			manifest: "json"
		},

		init : function() {
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// create the views based on the url/hash
			this.getRouter().initialize();
		}
	});
});
