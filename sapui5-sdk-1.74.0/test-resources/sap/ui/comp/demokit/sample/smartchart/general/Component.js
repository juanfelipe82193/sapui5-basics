sap.ui.core.UIComponent.extend("sap.ui.comp.sample.smartchart.general.Component", {
	metadata: {
		rootView: {
			"viewName": "sap.ui.comp.sample.smartchart.general.SmartChart",
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
				files: [
					"SmartChart.view.xml",
					"SmartChart.controller.js",
					"mockserver/metadata.xml",
					"mockserver/ProductCollection.json"
				],
				stretch: true
			}
		}
	}
});
