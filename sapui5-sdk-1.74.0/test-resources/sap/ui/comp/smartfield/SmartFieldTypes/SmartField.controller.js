sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	var oOutputArea, oOutputAreaHeader;

	return Controller.extend("test.sap.ui.comp.smartfield.SmartFieldTypes.SmartField", {

		onInit: function () {
			//JSON Model is only being used for edit mode
			var oViewModel = new JSONModel({
				editMode: true
			});
			this.getView().setModel(oViewModel, "view");
			this.byId("detail").bindElement({
				path: "/Types('1001')"
			});
			this.oSplitApp = this.byId("app");
			oViewModel = this.getView().getModel("view");

			oOutputArea = this.byId("outputAreaChangedData");
			oOutputAreaHeader = this.byId("currentSF");

		},

		updateCodeEditors: function(oControlEvent) {
			var oSF = oControlEvent.getSource();
			if (Object.keys(oSF.getModel().getPendingChanges()).length) {
				this.getView().getModel().submitChanges({
					success: function () {
						var sCurSFText = oSF.getTextLabel();
						var sCurSFValueBinding = oSF.getBinding("value").getValue();
						var sCurValueFormatted = oSF.getValue();
						oOutputAreaHeader.setText("Current data in selected SmartField: " + sCurSFText + " | Current value (binding): " + sCurSFValueBinding + " | Current value (formatted): " + sCurValueFormatted);
						var sSelectedTypeSet = oSF.getBindingContext().sPath.slice(1);
						var oChangedData = oSF.getModel().oData[sSelectedTypeSet];
						oOutputArea.setValue(JSON.stringify(oChangedData, null, '  '));
					}
				});
			}
		},

		onEditPressed: function (oControlEvent) {
			var oViewModel = this.getView().getModel("view");
			oViewModel.setProperty("/editMode", true);
		},

		onCancelPressed: function (oControlEvent) {
			this.getView().getModel().resetChanges();
			var oForm = this.getView().byId("form");
			oForm.setEditable(false);
		},

		onSavePressed: function (oControlEvent) {
			this.getView().getModel().submitChanges();
			var oForm = this.getView().byId("form");
			oForm.setEditable(false);
		},

		onProductSelect: function (oControlEvent) {
			var oProduct = oControlEvent.getParameter("listItem"),
				oDetail = this.byId("detail");

			oDetail.bindElement({
				path: oProduct.getBindingContext().getPath()
			});

			this.oSplitApp.toDetail(oDetail);
		},

		onExit: function(oControlEvent) {
			this.oSplitApp = null;
		}
	});
});
