sap.ui.define(['sap/ui/core/UIComponent'],
	function (UIComponent) {
		"use strict";

		return UIComponent.extend("sap.ui.comp.sample.filterbar.DynamicPageListReport.Component", {

			metadata: {
				rootView: {
					"viewName": "sap.ui.comp.sample.filterbar.DynamicPageListReport.DynamicPageListReport",
					"type": "XML",
					"async": true
				},
				dependencies: {
					libs: [
						"sap.f",
						"sap.m",
						"sap.ui.layout",
						"sap.ui.comp"
					]
				},
				config: {
					sample: {
						stretch : true,
						files: [
							"DynamicPageListReport.view.xml",
							"DynamicPageListReport.controller.js",
							"model.json"
						]
					}
				}
			}
		});
	});
