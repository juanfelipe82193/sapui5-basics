jQuery.sap.declare("sap.me.sample.SelectionCalendar.Component");

sap.ui.core.UIComponent.extend("sap.me.sample.SelectionCalendar.Component", {

	metadata : {
		rootView : {
			"viewName": "sap.me.sample.SelectionCalendar.SelectionCalendar",
			"type": "XML",
			"async": true
		},
		dependencies : {
			libs : [
				"sap.me",
				"sap.ui.layout"
		]
		},
		config : {
			sample : {
				files : [
					"SelectionCalendar.view.xml",
					"SelectionCalendar.controller.js"
				]
			}
		}
	}
});
