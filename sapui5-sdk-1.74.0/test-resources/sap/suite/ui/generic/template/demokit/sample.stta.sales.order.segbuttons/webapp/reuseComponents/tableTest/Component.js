sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/resource/ResourceModel",
	"sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport"
], function(UIComponent, ResourceModel, ReuseComponentSupport) {
	"use strict";

	return UIComponent.extend("ManageSalesOrderWithSegButtons.reuseComponents.tableTest.Component", {
		metadata: {
			manifest: "json",
			properties: {
				stIsAreaVisible: {
					 type: "boolean",
					 group: "standard"
				},
				entitySet: {
						type: "string",
						group: "specific",
						defaultValue: ""
				},
				navigationProperty: {
					type: "string",
					group: "specific",
					defaultValue:""
				}
			}
		},

		setEntitySet: function(sKey) {
			var oComponentModel = this.getComponentModel();
			oComponentModel.setProperty("/entitySet", sKey);
		},

		setNavigationProperty: function(sKey) {
			var oComponentModel = this.getComponentModel();
			oComponentModel.setProperty("/navigationProperty", sKey);
		},

		setStIsAreaVisible: function(bIsAreaVisible) {
			if (bIsAreaVisible !== this.getStIsAreaVisible()){
				this.setProperty("stIsAreaVisible", bIsAreaVisible);
				if (bIsAreaVisible) {
					var oComponentModel = this.getComponentModel();
					var sBindingPath = oComponentModel.getProperty("/entitySet");
					var oController = this.getRootControl().getController();
					var oTable = this.byId("ManageSalesOrderWithSegButtons::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrder_WD_20--ManageSalesOrderWithSegButtons.reuseComponents.tableTest::tableTest::ComponentContainerContent---View--idProductsTable");
					var oListItem = new sap.m.ColumnListItem({
						cells: [
							new sap.m.Text({text: "{ProductID}"}),
							new sap.m.Text({text: "{Category}"}),
							new sap.m.Text({text: "{CurrencyCode}"}),
							new sap.m.Text({text: "{Price}"})
						]
					});

					oTable.bindItems({
						path: sBindingPath,
						template: oListItem
					});

					oListItem.setType("Navigation");
					oListItem.attachPress(oController.onItemPress);
				}
			}
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
