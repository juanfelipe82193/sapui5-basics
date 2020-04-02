sap.ui.core.UIComponent.extend("sap.ui.comp.sample.smartchart.lightweight.Component", {
	metadata: {
		rootView: {
			"viewName": "sap.ui.comp.sample.smartchart.lightweight.SmartChart",
			"type": "XML",
			"async": true
		},
		dependencies: {
			libs: [
				"sap.m", "sap.ui.comp","sap.chart"
			]
		},
		config: {
			sample: {
				files: [
					"SmartChart.view.xml",
					"SmartChart.controller.js",
					"mockserver/ProductCollection.json",
					"mockserver/metadata.xml"
				],
				stretch: true
			}
		}
	}
});
