sap.ui.define(['sap/ui/core/UIComponent'],
function(UIComponent) {
	"use strict";

	return UIComponent.extend("DecisionTableRows.Component", {

		metadata: {
			"rootView": "DecisionTableRows.view.DecisionTableRows",
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
