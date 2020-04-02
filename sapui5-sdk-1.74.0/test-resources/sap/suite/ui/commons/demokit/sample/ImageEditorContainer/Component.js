sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
	"use strict";

	// TODO what sample category, Display/Input?
	return UIComponent.extend("sap.suite.ui.commons.sample.ImageEditorContainer.Component", {
		metadata: {
			rootView: "sap.suite.ui.commons.sample.ImageEditorContainer.ImageEditorContainer",
			dependencies: {
				libs: [
					"sap.m",
					"sap.suite.ui.commons"
				]
			},
			config: {
				sample: {
					stretch: true,
					files: [
						"ImageEditorContainer.view.xml",
						"ImageEditorContainer.controller.js"
					]
				}
			}
		}
	});
});
