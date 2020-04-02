sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/resource/ResourceModel",
	"sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport"
], function(UIComponent, ResourceModel, ReuseComponentSupport) {
	"use strict";

	var bCanGetExtensionAPIFromMixInto = false;

	function fnRegisterOnPageDataLoaded(oExtensionAPI){
		oExtensionAPI.attachPageDataLoaded(function(oEvent){
			var oContextData = oEvent.context.getObject();
			(oExtensionAPI.setSectionHidden || Function.prototype)(oContextData.ProductCategory !== "Notebooks"); // method setSectionHidden not available in older releases
		});
	}

	return UIComponent.extend("STTA_MP.reuseComponents.situationsTest.Component", {
		metadata: {
			manifest: "json",
			properties: {
				productKey: {
					type: "string",
					group: "specific",
					defaultValue: ""
				}
			}
		},

		setProductKey: function(sKey){
			this.setProperty("productKey", sKey);
			var oResourceModel = this.getModel("i18n");
			var oResourceBundle = oResourceModel.getResourceBundle();
			var sText = oResourceBundle.getText("LBL", sKey);
			var oComponentModel = this.getComponentModel();
			oComponentModel.setProperty("/lbl", sText);
		},

		createContent: function() {
			var sId = this.createId("View");
			var oView = sap.ui.xmlview(sId, "STTA_MP.reuseComponents.situationsTest.view.Default");
			var oExtensionAPIPromise = ReuseComponentSupport.mixInto(this, "componentModel");
			if (oExtensionAPIPromise){ // this will only be available from 1.55 onwards
				bCanGetExtensionAPIFromMixInto = true;
				oExtensionAPIPromise.then(function(oExtensionAPI){
					fnRegisterOnPageDataLoaded(oExtensionAPI);
				});
			}
			return oView;
		},

		stStart: function(oModel, oBindingContext, oExtensionAPI) {
			if (!bCanGetExtensionAPIFromMixInto){
				fnRegisterOnPageDataLoaded(oExtensionAPI);
			}
		}
	});
});
