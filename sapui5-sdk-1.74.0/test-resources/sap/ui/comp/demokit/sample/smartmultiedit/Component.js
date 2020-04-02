sap.ui.define([ "sap/ui/core/UIComponent" ], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartmultiedit.Component", {
		metadata : {
			rootView : "sap.ui.comp.sample.smartmultiedit.Page",
			dependencies : {
				libs : [ "sap.ui.comp" ]
			},
			config : {
				sample : {
					files : [
						"Page.view.xml",
						"Page.controller.js",
						"MultiEditDialog.fragment.xml",
						"messagebundle.properties",
						"mockserver/metadata.xml",
						"mockserver/Employees.json",
						"mockserver/DepartmentsValueHelp.json",
						"mockserver/CurrenciesValueHelp.json",
						"mockserver/DistanceValueHelp.json",
						"mockserver/GendersValueHelp.json"
					]
				}
			}
		}
	});
});
