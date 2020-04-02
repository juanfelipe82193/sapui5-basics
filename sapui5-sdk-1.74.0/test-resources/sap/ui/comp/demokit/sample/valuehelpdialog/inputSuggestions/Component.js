sap.ui.define([
	"sap/ui/core/UIComponent"

], function(UIComponent){
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.valuehelpdialog.inputSuggestions.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.ui.comp.sample.valuehelpdialog.inputSuggestions.ValueHelpDialogInputSuggestions",
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
						"ValueHelpDialogInputSuggestions.view.xml",
						"ValueHelpDialogInputSuggestions.controller.js",
						"ValueHelpDialogInputSuggestions.fragment.xml",
						"columnsModel.json"
					]
				}
			}
		}
	});
}, true);
