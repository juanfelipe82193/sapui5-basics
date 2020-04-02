sap.ui.define([
	"sap/ui/core/UIComponent"
], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.valuehelpdialog.example.AddMultipleItems.Component", {

		metadata : {
			rootView : {
			 "viewName": "sap.ui.comp.valuehelpdialog.example.AddMultipleItems.ValueHelpDialog",
			   "type": "XML",
			  "async": true
			},
			dependencies : {
				libs : [
					"sap.m",
					"sap.ui.comp"
				]
			}
		}
	});
}, true);





