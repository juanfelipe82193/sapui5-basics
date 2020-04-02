sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(
	Controller,
	JSONModel
) {
	"use strict";

	return Controller.extend("test.sap.ui.comp.smartfield.SmartField", {

		onInit: function() {
			var oViewModel = new JSONModel({ editMode: false});
			this.getView().setModel(oViewModel, "view");

			var oDetail = this.byId("detail");
			oDetail.bindElement({
				path: "/Products('2212121828')",
				parameters: {
					expand: "to_Category"
				}
			});

			this.oSplitApp = this.byId("app");
		},

		_switchMode: function() {
			var oViewModel = this.getView().getModel("view");
			var bEditMode = oViewModel.getProperty("/editMode");

			oViewModel.setProperty("/editMode",!bEditMode);
		},

		onEditMode: function(oEvent) {
			this._switchMode();
		},

		onCancel: function(oEvent) {
			var oModel = this.getView().getModel();
			oModel.resetChanges();
			this._switchMode();
		},

		onSave: function(oEvent) {
			var oModel = this.getView().getModel();
			oModel.submitChanges();
			this._switchMode();
		},

		onChangeFC: function(oEvent) {
			var sKey = oEvent.getSource().getSelectedKey();
			var oView = this.getView();

			oView.getModel().setProperty("to_Category/FC", parseInt(sKey), oView.byId("idCategory").getBindingContext());
		},

		onProductSelect: function(oEvent) {
			var oProduct = oEvent.getSource(),
				sPath = oProduct.getBindingContext().getPath(),
				oDetail = this.byId("detail");

			oDetail.bindElement({
				path: sPath,
				parameters: {
					expand: "to_Category"
				}
			});

			this.oSplitApp.toDetail(oDetail);
		}
	});
});
