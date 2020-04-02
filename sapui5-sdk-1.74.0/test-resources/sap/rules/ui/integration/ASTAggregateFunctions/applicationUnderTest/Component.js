sap.ui.define(['sap/ui/core/UIComponent'],
function(UIComponent) {
	"use strict";

	return UIComponent.extend("ASTAggregateFunctions.Component", {

		metadata: {
			"rootView": "ASTAggregateFunctions.view.ASTAggregateFunctions",
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
