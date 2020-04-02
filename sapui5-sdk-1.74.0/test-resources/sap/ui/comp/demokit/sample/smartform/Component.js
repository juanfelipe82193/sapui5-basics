sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/fl/Cache'
], function (UIComponent, Cache) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartform.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.ui.comp.sample.smartform.SmartForm",
				"type": "XML",
				"async": true
			},
			dependencies: {
				libs: [
					"sap.m", "sap.ui.comp"
				]
			},
			config: {
				sample: {
					stretch: false,
					files: [
						"SmartForm.view.xml",
						"SmartForm.controller.js",
						"mockserver/metadata.xml",
						"mockserver/Products.json",
						"mockserver/VL_SH_H_TCURC.json",
						"mockserver/VL_SH_H_CATEGORY.json",
						"i18n/i18n.properties"
					]
				}
			}
		},

		onInit: function () {
			// flex framework does resolve any LRep requests for this specific component with the given content -> there are changes = empty and no additional
			// back-end call is needed
			Cache._entries["sap.ui.comp.sample.smartform.Component"] = {
				promise: Promise.resolve({
					"changes": {
						"changes": [],
						"settings": {
							"isKeyUser": true,
							"isAtoAvailable": false,
							"isProductiveSystem": false,
							"features": {
								"addField": [
									"CUSTOMER", "VENDOR"
								],
								"addGroup": [
									"CUSTOMER", "VENDOR"
								],
								"removeField": [
									"CUSTOMER", "VENDOR"
								],
								"removeGroup": [
									"CUSTOMER", "VENDOR"
								],
								"hideControl": [
									"CUSTOMER", "VENDOR"
								],
								"unhideControl": [
									"CUSTOMER", "VENDOR"
								],
								"renameField": [
									"CUSTOMER", "VENDOR"
								],
								"renameGroup": [
									"CUSTOMER", "VENDOR"
								],
								"moveFields": [
									"CUSTOMER", "VENDOR"
								],
								"moveGroups": [
									"CUSTOMER", "VENDOR"
								]
							}
						}
					},
					"componentClassName": "sap.ui.comp.sample.smartform.Component"
				})
			};
		}
	});
});