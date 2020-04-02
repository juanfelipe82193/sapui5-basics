sap.ui.define([
	"sap/ui/core/UIComponent"

], function(UIComponent){
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.valuehelpdialog.conditionsTabOnly.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.ui.comp.sample.valuehelpdialog.conditionsTabOnly.ValueHelpDialogConditionsTabOnly",
				"type": "XML",
				"async": true
			},
			dependencies: {
				libs: [ "sap.m", "sap.ui.comp" ]
			},
			config: {
				sample: {
					stretch: true,
					files: [
						"ValueHelpDialogConditionsTabOnly.view.xml",
						"ValueHelpDialogConditionsTabOnly.controller.js",
						"ValueHelpDialogConditionsTabOnly.fragment.xml"
					]
				}
			}
		}
	});
}, true);
