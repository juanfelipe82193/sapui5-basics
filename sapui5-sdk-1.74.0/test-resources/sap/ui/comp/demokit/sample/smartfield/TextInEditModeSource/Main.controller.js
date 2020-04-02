sap.ui.define([
	"sap/ui/core/mvc/Controller"

], function(Controller) {
	"use strict";
	return Controller.extend("sap.ui.comp.sample.smartfield.TextInEditModeSource.Main", {
		onInit: function() {
			//Bind the Projector (Product 1239102) to the Form
			this.byId("detail").bindElement({
				path: "/Products('001')",
				parameters: {
					//Necesssary Parameter for TextInEditMode --> important Parameter for the NavigationProperty
					expand: "to_ProductCategories"
				}
			});
			//****************** displayed text *******************
			var oInformativeTextModel = new sap.ui.model.json.JSONModel({
				defaultConfig : "<p>TextInEditModeSource: default configuration </p>",
				noneConfig: "<p>TextInEditModeSource: <code style='background-color:#D3D3D3;padding-left: 5px;padding-right:5px'>None</code> <br> (no descriptive text)</p>",
				navPropConfig: "<p>TextInEditModeSource: <code style='background-color:#D3D3D3;padding-left: 5px;padding-right:5px'>NavigationProperty</code> <br> (descriptive text via Navigation Property)</p>",
				valueListConfig: "<p>TextInEditModeSource: <code style='background-color:#D3D3D3;padding-left: 5px;padding-right:5px'>ValueList</code> <br> (descriptive text via ValueList)</p>"
			});
			this.getView().setModel(oInformativeTextModel,"InformativeText");
			//*****************************************************
		},
		onEditToggled: function() {
			//Transimit the changes made by the user --> triggered by an edit toggle
			this.getView().getModel().submitChanges();
		}
	});
});
