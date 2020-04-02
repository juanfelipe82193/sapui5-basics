sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport"
], function(UIComponent, ReuseComponentSupport) {
	"use strict";

	return UIComponent.extend("STTA_MP.reuseComponents.simple.Component", {
		metadata: {
			manifest: "json",
			properties: {
				stIsAreaVisible: {
					 type: "boolean",
					 group: "standard"
				}
			}
		},

		setStIsAreaVisible: function(bIsAreaVisible) {

		},

		init: function() {
			(UIComponent.prototype.init || Function.prototype).apply(this, arguments);
			ReuseComponentSupport.mixInto(this, "componentModel");
		},

		stStart: function(oModel, oBindingContext, oExtensionAPI) {
			var oComponentModel = this.getComponentModel();
			oComponentModel.setProperty("/extensionApi", oExtensionAPI);
		},

		stRefresh: function(oModel, oBindingContext, oExtensionAPI) {

		}
	});
});
