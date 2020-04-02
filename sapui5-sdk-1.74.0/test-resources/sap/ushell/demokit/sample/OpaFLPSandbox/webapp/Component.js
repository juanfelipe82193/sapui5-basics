sap.ui.define([
	"sap/ui/core/UIComponent"
], function (UIComponent) {
	"use strict";

	return UIComponent.extend("sap.ushell.sample.OpaFLPSandbox.Component", {
		metadata: {
			manifest: "json"
		},

		init: function () {
			// call the base component's init function and create the App view
			UIComponent.prototype.init.apply(this, arguments);

			this.getRouter().initialize();
		},

		destroy: function () {
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});
});
