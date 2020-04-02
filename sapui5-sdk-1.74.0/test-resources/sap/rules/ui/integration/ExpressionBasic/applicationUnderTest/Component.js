sap.ui.define(['sap/ui/core/UIComponent'],
function(UIComponent) {
	"use strict";

	return UIComponent.extend("ExpressionBasic.Component", {

		metadata: {
			"rootView": "ExpressionBasic.view.ExpressionBasic",
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
