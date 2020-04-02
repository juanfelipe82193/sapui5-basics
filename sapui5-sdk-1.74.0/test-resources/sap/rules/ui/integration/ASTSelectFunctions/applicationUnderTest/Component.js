sap.ui.define(['sap/ui/core/UIComponent'],
function(UIComponent) {
	"use strict";

	return UIComponent.extend("ASTSelectFunctions.Component", {

		metadata: {
			"rootView": "ASTSelectFunctions.view.ASTSelectFunctions",
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
