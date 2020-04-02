sap.ui.define(['sap/ui/core/UIComponent'],
function(UIComponent) {
	"use strict";

	return UIComponent.extend("DecisionTableFormatter.Component", {

		metadata: {
			"rootView": "DecisionTableFormatter.view.DecisionTableFormatter",
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