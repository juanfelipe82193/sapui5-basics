sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
	"use strict";

	return UIComponent.extend("sap.suite.ui.commons.sample.TAccount.Component", {
		metadata: {
			rootView: "sap.suite.ui.commons.sample.TAccount.TAccount",
			dependencies: {
				libs: [
					"sap.m",
					"sap.suite.ui.commons"
				]
			},
			config: {
				sample: {
					files: [
						"TAccount.view.xml",
						"TAccount.controller.js",
						"data.json"
					]
				}
			}
		}
	});
});
