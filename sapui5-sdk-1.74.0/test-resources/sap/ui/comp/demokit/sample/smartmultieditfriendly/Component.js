sap.ui.define([ "sap/ui/core/UIComponent" ], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartmultieditfriendly.Component", {
		metadata : {
			rootView : "sap.ui.comp.sample.smartmultieditfriendly.Page",
			dependencies : {
				libs : [ "sap.ui.comp" ]
			},
			config : {
				sample : {
					files : [
						"Page.view.xml",
						"Page.controller.js",
						"MultiEditDialog.fragment.xml",
						"mockserver/metadata.xml",
						"mockserver/Employees.json",
						"mockserver/DepartmentsValueHelp.json",
						"mockserver/GendersValueHelp.json"
					]
				}
			}
		}
	});
});
