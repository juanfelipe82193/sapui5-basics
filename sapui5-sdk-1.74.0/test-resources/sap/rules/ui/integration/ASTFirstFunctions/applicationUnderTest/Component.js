sap.ui.define(['sap/ui/core/UIComponent'],
function(UIComponent) {
	"use strict";

	return UIComponent.extend("ASTFirstFunctions.Component", {

		metadata: {
			"rootView": "ASTFirstFunctions.view.ASTFirstFunctions",
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
