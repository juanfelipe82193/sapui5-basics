sap.ui.define([
	"sap/ui/core/UIComponent"

], function(UIComponent){
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.valuehelpdialog.singleSelect.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.ui.comp.sample.valuehelpdialog.singleSelect.ValueHelpDialogSingleSelect",
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
						"ValueHelpDialogSingleSelect.view.xml",
						"ValueHelpDialogSingleSelect.controller.js",
						"ValueHelpDialogSingleSelect.fragment.xml",
						"columnsModel.json"
					]
				}
			}
		}
	});
}, true);
