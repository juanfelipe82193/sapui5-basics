sap.ui.define(["sap/ui/core/UIComponent", "./SampleNameProvider"], function(UIComponent, SampleNameProvider) {
	var sSampleQualifiedName = SampleNameProvider.getQualifiedName();
	return UIComponent.extend(sSampleQualifiedName + ".Component", {
		"metadata": {
			"includes": [],
			"dependencies": {
				"libs": ["sap.m"]
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
				"viewName": sSampleQualifiedName + ".View"
			});
		}
	});
}, /* bExport= */ true);