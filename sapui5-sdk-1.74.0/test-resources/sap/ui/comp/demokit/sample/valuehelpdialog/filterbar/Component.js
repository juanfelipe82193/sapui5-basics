sap.ui.define([
	"sap/ui/core/UIComponent"

], function(UIComponent){
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.valuehelpdialog.filterbar.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.ui.comp.sample.valuehelpdialog.filterbar.ValueHelpDialogFilterbar",
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
						"ValueHelpDialogFilterbar.view.xml",
						"ValueHelpDialogFilterbar.controller.js",
						"ValueHelpDialogFilterbar.fragment.xml",
						"columnsModel.json"
					]
				}
			}
		}
	});
}, true);
