sap.ui.define([
	"sap/ui/core/UIComponent"

], function(UIComponent){
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.valuehelpdialog.singleConditionTab.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.ui.comp.sample.valuehelpdialog.singleConditionTab.ValueHelpDialogSingleConditionTab",
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
						"ValueHelpDialogSingleConditionTab.view.xml",
						"ValueHelpDialogSingleConditionTab.controller.js",
						"ValueHelpDialogSingleConditionTab.fragment.xml"
					]
				}
			}
		}
	});
}, true);
