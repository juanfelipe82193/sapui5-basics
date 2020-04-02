sap.ui.define([
	"sap/ui/core/UIComponent"

], function(UIComponent){
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.valuehelpdialog.example.1.Component", {
		metadata : {
			rootView : {
			"viewName": "sap.ui.comp.sample.valuehelpdialog.example.1.ValueHelpDialog",
			"type": "XML",
			"async": true
			},
			dependencies : {
				libs : [
					"sap.m",
					"sap.ui.comp"
				]
			},
			config : {}
		}
	});
});