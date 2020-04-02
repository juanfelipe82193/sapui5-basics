sap.ui.define(["./SampleNameProvider", "sap/ui/core/UIComponent"], function(SampleNameProvider, UIComponent) {
	var sQualifiedSampleName = SampleNameProvider.getQualifiedName();
	return UIComponent.extend(sQualifiedSampleName + ".Component", {
		"metadata": {
			"includes": [],
			"dependencies": {
				"libs": [
					"sap.m"
				]
			},
			"config": {
				"sample": {
					"stretch": false,
					"files": ["View.view.js", "Controller.controller.js"]
				}
			}
		},
		createContent: function() {
			return sap.ui.view({
				"type": sap.ui.core.mvc.ViewType.JS,
				"viewName": sQualifiedSampleName + ".View",
			});
		}
	});
}, /* bExport= */ true);