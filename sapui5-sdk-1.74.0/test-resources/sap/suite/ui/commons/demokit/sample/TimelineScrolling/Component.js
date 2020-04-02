sap.ui.define(["sap/ui/core/UIComponent"], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.suite.ui.commons.sample.TimelineScrolling.Component", {
		metadata: {
			rootView: "sap.suite.ui.commons.sample.TimelineScrolling.Timeline",
			dependencies: {
				libs: [
					"sap.m",
					"sap.suite.ui.commons"
				]
			},
			config: {
				sample: {
					stretch: true,
					scrollX: true,
					files: [
						"Timeline.view.xml",
						"Timeline.controller.js"
					]
				}
			}
		}
	});
});
