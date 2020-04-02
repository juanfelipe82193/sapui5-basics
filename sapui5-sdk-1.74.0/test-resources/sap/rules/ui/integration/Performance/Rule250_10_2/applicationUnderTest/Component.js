sap.ui.define(['sap/ui/core/UIComponent'],
function(UIComponent) {
	"use strict";

	return UIComponent.extend("DecisionTablePerformance.Component", {

		metadata: {
			"rootView": "DecisionTablePerformance.view.DecisionTablePerformance",
			"dependencies": {
				"libs": {
					"sap.ui.core": {},
					"sap.m": {},
					"sap.ui.layout": {}
				}
			}

		}

	});

});
