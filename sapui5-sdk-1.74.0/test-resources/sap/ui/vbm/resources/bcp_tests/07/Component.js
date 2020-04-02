sap.ui.define([
    "sap/ui/core/UIComponent"
], function(UIComponent) {
	"use strict";

	return UIComponent.extend("vbm-regression.bcp_tests.07.Component", {

		metadata : {
			rootView : "vbm-regression.bcp_tests.07.view.App",
			dependencies : {
				libs : [
					"sap.m"
				]
			},
			config : {
				sample : {
	                stretch : true,
					files : [
						"App.view.xml",
						"App.controller.js"
					]
				}
			}
		}
	});

	return Component;

});
