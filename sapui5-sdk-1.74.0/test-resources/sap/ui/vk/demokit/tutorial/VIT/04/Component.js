sap.ui.define([
	"sap/ui/core/UIComponent"
], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.ui.vk.tutorial.VIT.04.Component", {


		metadata: {
				config: {
					manifest: "json",
					sample: {
						iframe: "src/index.html",
						stretch: true,
						files: [
							   "src/controller/App.controller.js",
								"src/i18n/i18n.properties",
								"src/view/App.view.xml",
								"src/index.html",
								"src/manifest.json",
								"src/Component.js",
								"src/models/boxTestModel.vds"
						]
					}
				}
		},
		init: function() {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
		}
	});
});