sap.ui.define(['sap/ui/core/UIComponent'],
	function (UIComponent) {
		"use strict";

		return UIComponent.extend("sap.ui.comp.sample.filterbar.DynamicPageAnalyticalTable.Component", {

			metadata: {
				rootView: {
					"viewName": "sap.ui.comp.sample.filterbar.DynamicPageAnalyticalTable.DynamicPageAnalyticalTable",
					"type": "XML",
					"async": true
				},
				dependencies: {
					libs: [
						"sap.f",
						"sap.m",
						"sap.ui.layout",
						"sap.ui.table",
						"sap.ui.unified",
						"sap.ui.comp"
					]
				},
				config: {
					sample : {
						stretch : true,
						files : [
							"DynamicPageAnalyticalTable.view.xml",
							"DynamicPageAnalyticalTable.controller.js"
						]
					}
				}
			}
		});
	});
