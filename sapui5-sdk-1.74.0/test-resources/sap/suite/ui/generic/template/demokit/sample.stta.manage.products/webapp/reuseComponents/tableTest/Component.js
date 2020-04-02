sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/resource/ResourceModel",
	"sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport"
], function(UIComponent, ResourceModel, ReuseComponentSupport) {
	"use strict";

	return UIComponent.extend("STTA_MP.reuseComponents.tableTest.Component", {
		metadata: {
			manifest: "json",
			properties: {
				stIsAreaVisible: {
					 type: "boolean",
					 group: "standard"
				},
				navigationProperty: {
					type: "string",
					group: "specific",
					defaultValue:""
				}
			}
		},

		getView: function() {
			return this.getAggregation("rootControl");
		},

		setNavigationProperty: function(sKey) {
			var oComponentModel = this.getComponentModel();
			oComponentModel.setProperty("/navigationProperty", sKey);
		},

		setStIsAreaVisible: function(bIsAreaVisible) {
			this.getView().setBindingContext(bIsAreaVisible ? undefined : null);
			this.setProperty("stIsAreaVisible", bIsAreaVisible);
		},

		init: function() {
			ReuseComponentSupport.mixInto(this, "componentModel");
			(UIComponent.prototype.init || Function.prototype).apply(this, arguments);
		},

		stStart: function(oModel, oBindingContext, oExtensionAPI) {
			var oComponentModel = this.getComponentModel();
			oComponentModel.setProperty("/extensionApi", oExtensionAPI);
		},

		stRefresh: function(oModel, oBindingContext, oExtensionAPI) {
			sap.m.MessageToast.show("Refreshed Supplier");
		}
	});
});
