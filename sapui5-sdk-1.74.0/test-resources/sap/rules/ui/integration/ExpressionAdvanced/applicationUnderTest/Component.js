sap.ui.define(['sap/ui/core/UIComponent'],
function(UIComponent) {
	"use strict";

	return UIComponent.extend("ExpressionAdvanced.Component", {

		metadata: {
			"rootView": "ExpressionAdvanced.view.ExpressionAdvanced",
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
