sap.ui.define(['sap/ui/core/UIComponent'],
function(UIComponent) {
	"use strict";

	return UIComponent.extend("DecisionTableSettingRefresh.Component", {

		metadata: {
			"rootView": "DecisionTableSettingRefresh.view.DecisionTableSettingRefresh",
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