sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/ui/comp/sample/smartlink/example_05/formatter", "sap/ui/comp/navpopover/SemanticObjectController", "sap/m/Text"
], function(Controller, JSONModel, formatter, SemanticObjectController, Text) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartlink.example_05.Example", {

		formatter: formatter,

		onInit: function() {
			this.getView().bindElement("/ProductCollection('1239102')");
		},

		onNavigationTargetsObtainedMainAndContent: function(oEvent) {
			var oParameters = oEvent.getParameters();
			oParameters.show("Supplier", new sap.ui.comp.navpopover.LinkData({
				key: "IDApplicationSpecificFactSheet",
				href: "#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
				text: "Application Specific Fact Sheet",
				target: "_blank"
			}), [], new sap.ui.layout.form.SimpleForm({
				maxContainerCols: 1,
				content: [
					new sap.ui.core.Title({
						text: "Detailed information"
					}), new Text({
						text: "By pressing on the links below a new browser window with image of product will be opened."
					})
				]
			}));
		},

		onNavigationTargetsObtainedMainAndAction: function(oEvent) {
			var oParameters = oEvent.getParameters();
			oParameters.show("Supplier", new sap.ui.comp.navpopover.LinkData({
				key: "IDApplicationSpecificFactSheet",
				href: "#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
				text: "Application Specific Fact Sheet",
				target: "_blank"
			}), [
				new sap.ui.comp.navpopover.LinkData({
					key: "IDApplicationSpecificLink",
					href: "#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
					text: "Application Specific Link",
					target: "_blank"
				})
			], undefined);
		},

		onNavigationTargetsObtainedContentAndAction: function(oEvent) {
			var oParameters = oEvent.getParameters();
			oParameters.show("", null, [
				new sap.ui.comp.navpopover.LinkData({
					key: "IDApplicationSpecificLink",
					href: "#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
					text: "Application Specific Link",
					target: "_blank"
				})
			], new sap.ui.layout.form.SimpleForm({
				maxContainerCols: 1,
				content: [
					new sap.ui.core.Title({
						text: "Detailed information"
					}), new Text({
						text: "By pressing on the links below a new browser window with image of product will be opened."
					})
				]
			}));
		},

		onNavigationTargetsObtainedMainAndContentAndAction: function(oEvent) {
			var oParameters = oEvent.getParameters();
			oParameters.show("Supplier", new sap.ui.comp.navpopover.LinkData({
				key: "IDApplicationSpecificFactSheet",
				href: "#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
				text: "Application Specific Fact Sheet",
				target: "_blank"
			}), [
				new sap.ui.comp.navpopover.LinkData({
					key: "IDApplicationSpecificLink",
					href: "#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
					text: "Application Specific Link",
					target: "_blank"
				})
			], new sap.ui.layout.form.SimpleForm({
				maxContainerCols: 1,
				content: [
					new sap.ui.core.Title({
						text: "Detailed information"
					}), new Text({
						text: "By pressing on the links below a new browser window with image of product will be opened."
					})
				]
			}));
		},

		onNavigationTargetsObtainedOnlyContent: function(oEvent) {
			var oParameters = oEvent.getParameters();
			oParameters.show("", null, [], new sap.ui.layout.form.SimpleForm({
				maxContainerCols: 1,
				content: [
					new sap.ui.core.Title({
						text: "Detailed information"
					}), new Text({
						text: "By pressing on the links below a new browser window with image of product will be opened."
					})
				]
			}));
		},

		onNavigationTargetsObtainedOnlyMain: function(oEvent) {
			var oParameters = oEvent.getParameters();
			oParameters.show("Supplier", new sap.ui.comp.navpopover.LinkData({
				key: "IDApplicationSpecificFactSheet",
				href: "#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
				text: "Application Specific Fact Sheet"
			}), null, null);
		},

		onNavigationTargetsObtainedNothing: function(oEvent) {
			var oParameters = oEvent.getParameters();
			oParameters.show("Supplier", null, [], null);
		},

		onNavigationTargetsObtainedOnlyMainNavigationId: function(oEvent) {
			var oParameters = oEvent.getParameters();
			oParameters.show("Supplier", new sap.ui.comp.navpopover.LinkData({
				key: "IDApplicationSpecificFactSheet",
				// href: "#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
				text: "Application Specific Fact Sheet",
				target: "_blank"
			}), [
				new sap.ui.comp.navpopover.LinkData({
					key: "IDApplicationSpecificLink",
					href: "#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
					text: "Application Specific Link",
					target: "_blank"
				})
			], new sap.ui.layout.form.SimpleForm({
				maxContainerCols: 1,
				content: [
					new sap.ui.core.Title({
						text: "Detailed information"
					}), new Text({
						text: "By pressing on the links below a new browser window with image of product will be opened."
					})
				]
			}));
		},

		onBeforePopoverOpens: function(oEvent) {
			var oParameters = oEvent.getParameters();
			var oDeferred = jQuery.Deferred();
			setTimeout(function() {
				oParameters.setSemanticAttributes({
					Name: "Power Projector 4713",
					ProductId: "0000001",
					SpecificId: "1234"
				}, oParameters.semanticObject);
				oParameters.open();
				return oDeferred.resolve();
			}, 500);
			return oDeferred.promise();
		}
	});
});
