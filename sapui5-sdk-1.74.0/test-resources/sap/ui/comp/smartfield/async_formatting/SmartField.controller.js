sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function(Controller, MessageBox, JSONModel) {
	"use strict";

	return Controller.extend("test.sap.ui.comp.smartfield.SmartField", {

		onInit: function() {
			var oViewModel = new JSONModel({
				editMode: false
			});

			this.getView().setModel(oViewModel, "view");
			this.byId("detail").bindElement({
				path: "/Products('1239102')",
				parameters: {
					expand: "to_ProductCategories"
				}
			});

			this.oSplitApp = this.byId("app");
		},

		onEditToggled: function(oControlEvent) {

		},

		onEditPressed: function(oControlEvent) {
			var oViewModel = this.getView().getModel("view");
			oViewModel.setProperty("/editMode", true);
		},

		onCancelPressed: function(oControlEvent) {
			this.getView().getModel().resetChanges();
			var oForm = this.getView().byId("form");
			oForm.setEditable(false);
		},

		onSavePressed: function(oControlEvent) {
			this.getView().getModel().submitChanges();
			var oForm = this.getView().byId("form");
			oForm.setEditable(false);
		},

		onProductSelect: function(oControlEvent) {
			var oProduct = oControlEvent.getParameter("listItem"),
				oDetail = this.byId("detail");

			oDetail.bindElement({
				path: oProduct.getBindingContext().getPath(),
				parameters: {
					expand: "to_ProductCategories"
				}
			});

			this.oSplitApp.toDetail(oDetail);
		},

		onExit: function(){
			this.oSplitApp = null;
		}
	});
});
