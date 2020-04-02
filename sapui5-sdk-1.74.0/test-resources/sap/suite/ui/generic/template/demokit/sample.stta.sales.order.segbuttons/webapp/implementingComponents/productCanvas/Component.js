sap.ui.define([	"sap/ui/core/UIComponent",
				"sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport"],
function(UIComponent, ReuseComponentSupport) { "use strict";

	/* Definition of the reuse component */
	return UIComponent.extend("ManageSalesOrderWithSegButtons.implementingComponents.productCanvas.Component", {
		metadata: {
			manifest: "json",
			library: "ManageSalesOrderWithSegButtons.implementingComponents.productCanvas",
			properties: {
				/* Standard properties for reuse components */

				/* UI mode accross fiori applications so the component knows in what mode the application is running
				 * Defined in sap/suite/ui/generic/template/extensionAPI/UIMode
				 */
				uiMode: {
					type: "string",
					group: "standard"
				},
				semanticObject: {
					type: "string",
					group: "standard"
				},
				stIsAreaVisible: {
					type: "boolean",
					group: "standard"
				},
				/* Component specific properties */

				/* This is a property set for the specific use case of the response component.
				 * We assume in this example that the property must be set before the reuse component can do
				 * something meaningful.
				 */
				demoPropertyString: {
					type: "string",
					group: "specific",
					defaultValue: ""
				}
			}
		},

		// Standard life time event of a component. Used to transform this component into a reuse component for smart templates and do some initialization
		init: function() {
			ReuseComponentSupport.mixInto(this, "component");
			// Defensive call of init of the super class:
			(UIComponent.prototype.init || Function.prototype).apply(this, arguments);
		},

		/* Implementation of lifetime events specific for smart template components */
		/* Note that these methods are called because this component has been transformed into a reuse component */
		/* Check jsdoc of sap.suite.ui.generic.template.extensionAPI.ReuseComponentSupport for details */
		stStart: function(oModel, oBindingContext, oExtensionAPI) {
			var oComponentModel = this.getComponentModel();
			oComponentModel.setProperty("/navigationController", oExtensionAPI.getNavigationController());
			oComponentModel.setProperty("/oExtensionAPI", oExtensionAPI);
			oComponentModel.setProperty("/sPath", oExtensionAPI.getNavigationController().getCurrentKeys()[1]);
			oComponentModel.setProperty("/productID", oExtensionAPI.getNavigationController().getCurrentKeys()[2]);
			var canvasview = oComponentModel.getProperty("/View");
			var oPage = canvasview.byId("group");
			var aCustomActions = [
									new sap.m.Button({text:"My Button"}),
									new sap.m.Button({text:"Custom Accept", type:"Accept"})
			 ];
			oExtensionAPI.addFooterBarToPage(oPage, aCustomActions);
		//	oExtensionAPI.getPaginatorButtons(oPage);
			var oFCLActionButtons = oExtensionAPI.getFlexibleColumnLayoutActionButtons();
			oPage.addHeaderContent(oFCLActionButtons);
		},

		stRefresh: function(oModel, oBindingContext) {
			//fnAddContextToHistory(oBindingContext, this.getComponentModel());
			var oComponentModel = this.getComponentModel();
			var oNavigationController = oComponentModel.getProperty("/navigationController");
			oComponentModel.setProperty("/sPath", oNavigationController.getCurrentKeys()[1]);
			oComponentModel.setProperty("/productID", oNavigationController.getCurrentKeys()[2]);
		},
		stGetCurrentState: function() {
			var oComponentModel = this.getComponentModel();
			var oView = oComponentModel.getProperty("/View");
			var oIconTabBar = oView.byId("idIconTabBarInlineMode");
			var oState = Object.create(null);
			oState.iconTabBar = {
				data: {
					selectedKey: oIconTabBar.getSelectedKey(),
					expanded: oIconTabBar.getExpanded()
				},
				lifecycle: {
					session: true,
					pagination: true,
					permanent: true
				}
			};
			return oState;
		},
		stApplyState: function(oState) {
			if (oState.iconTabBar) {
				var oComponentModel = this.getComponentModel();
				var oView = oComponentModel.getProperty("/View");
				var oIconTabBar = oView.byId("idIconTabBarInlineMode");
				oIconTabBar.setSelectedKey(oState.iconTabBar.selectedKey);
				oIconTabBar.setExpanded(oState.iconTabBar.expanded);
			}
		}
		/* End of implementation of lifetime events specific for smart template components */
	});
});
