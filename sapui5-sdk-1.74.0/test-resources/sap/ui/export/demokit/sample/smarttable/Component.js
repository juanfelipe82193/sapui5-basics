sap.ui.define([
	"sap/ui/core/UIComponent"
], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.ui.export.sample.smarttable.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.ui.export.sample.smarttable.Spreadsheet",
				"type": "XML",
				"async": true
			},
			dependencies: {
				libs: [
					"sap.m",
					"sap.ui.comp",
					"sap.ui.table"
				]
			},
			config: {
				sample: {
					stretch: true,
					files: [
						"Spreadsheet.view.xml",
						"Spreadsheet.controller.js"
					]
				}
			}
		}
	});
});
