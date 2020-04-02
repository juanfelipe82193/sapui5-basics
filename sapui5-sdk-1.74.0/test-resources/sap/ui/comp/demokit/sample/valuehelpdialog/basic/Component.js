sap.ui.define([
	"sap/ui/core/UIComponent"

], function(UIComponent){
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.valuehelpdialog.basic.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.ui.comp.sample.valuehelpdialog.basic.ValueHelpDialogBasic",
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
						"ValueHelpDialogBasic.view.xml",
						"ValueHelpDialogBasic.controller.js",
						"ValueHelpDialogBasic.fragment.xml",
						"columnsModel.json"
					]
				}
			}
		}
	});
}, true);
