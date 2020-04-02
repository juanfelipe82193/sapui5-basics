sap.ui.define(['sap/ui/core/UIComponent'],
	function (UIComponent) {
		"use strict";

		return UIComponent.extend("AstExpressionBasic.Component", {

			metadata: {
				"rootView": "AstExpressionBasic.view.AstExpressionBasic",
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