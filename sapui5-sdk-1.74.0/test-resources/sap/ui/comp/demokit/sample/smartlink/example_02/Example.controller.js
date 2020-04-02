sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/ui/comp/navpopover/SemanticObjectController", 'sap/ui/comp/navpopover/NavigationPopoverHandler'
], function(Controller, SemanticObjectController, NavigationPopoverHandler) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartlink.example_02.Example", {

		onInit: function() {
			var oView = this.getView();
			oView.bindElement("/ProductCollection('38094020.0')");

			SemanticObjectController.getDistinctSemanticObjects().then(function(oSemanticObjects) {
				oView.byId("IDButtonOfName").setEnabled(SemanticObjectController.hasDistinctSemanticObject([
					"demokit_smartlink_example_02_SemanticObjectName"
				], oSemanticObjects));
				oView.byId("IDImageOfName").setVisible(SemanticObjectController.hasDistinctSemanticObject([
					"demokit_smartlink_example_02_SemanticObjectName"
				], oSemanticObjects));

				oView.byId("IDButtonOfProductId").setEnabled(SemanticObjectController.hasDistinctSemanticObject([
					"demokit_smartlink_example_02_SemanticObjectProductId"
				], oSemanticObjects));
				oView.byId("IDImageOfProductId").setVisible(SemanticObjectController.hasDistinctSemanticObject([
					"demokit_smartlink_example_02_SemanticObjectProductId"
				], oSemanticObjects));
			});
		},

		onPressControl: function(oEvent) {
			var oSetting = this._getSetting(oEvent.getSource());
			var oLinkHandler = new NavigationPopoverHandler({
				semanticObject: oSetting.semanticObject,
				fieldName: oSetting.fieldName,
				control: oEvent.getSource(),
				enableAvailableActionsPersonalization: false
			});
			oLinkHandler.openPopover();
		},

		_getSetting: function(oControl) {
			switch (oControl.getId()) {
				case this.getView().getId() + "--IDButtonOfName":
				case this.getView().getId() + "--IDImageOfName":
					return {
						semanticObject: "demokit_smartlink_example_02_SemanticObjectName",
						fieldName: "Name"
					};
				case this.getView().getId() + "--IDButtonOfProductId":
				case this.getView().getId() + "--IDImageOfProductId":
					return {
						semanticObject: "demokit_smartlink_example_02_SemanticObjectProductId",
						fieldName: "ProductId"
					};
				default:
					throw "Control with id " + oControl.getId() + " is not supported.";
			}
		}
	});
});
