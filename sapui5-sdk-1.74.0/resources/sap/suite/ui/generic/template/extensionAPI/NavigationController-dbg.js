sap.ui.define(["sap/ui/base/Object",
	"sap/base/Log",
	"sap/base/util/extend"
], function(BaseObject, Log, extend) {
	"use strict";
	/**
	 * API to be used for navigation in extensions of Smart Template Applications. Breakout coding can access an instance
	 * of this class via {@link sap.suite.ui.generic.template.ListReport.extensionAPI.ExtensionAPI} or
	 * {@link sap.suite.ui.generic.template.ObjectPage.extensionAPI.ExtensionAPI}. Do not instantiate yourself.
	 * @class
	 * @name sap.suite.ui.generic.template.extensionAPI.NavigationController
	 * @public
	 */

	function getMethods(oTemplateUtils, oController, oState) {
		return /** @lends sap.suite.ui.generic.template.extensionAPI.NavigationController.prototype */ {
			/**
			 * Navigates to the given intent
			 *
			 * @param {string} sOutbound The name of the outbound defined in the manifest
			 * @param {object} [mParameters] map with parameters for the navigation. If no parameters are provided, default are the parameters defined in the manifest
			 * @public
			 */
			navigateExternal: function(sOutbound, mParameters) {
				var oManifestEntry = oController.getOwnerComponent().getAppComponent().getManifestEntry("sap.app");
				var oOutbound = oManifestEntry.crossNavigation.outbounds[sOutbound];

				if (!oOutbound) {
					Log.error("navigateExternal: mandatory parameter 'Outbound' is missing, or different from manifest entry");
					return;
				}

				if (mParameters){
					oOutbound.parameters = mParameters;
				} else {
					// todo: evaluate parameters
				}
				oTemplateUtils.oCommonUtils.navigateExternal(oOutbound, oState);
			},
			/**
			 * Triggers a navigation to another page within the application
			 *
			 * @param {sap.ui.model.Context | String} vContext The target context for the navigation.
			 * If the parameter is faulty (and oNavigationData does not specify a route itself) the root page of the app is considered to be the target of the application.
			 * @param {object} [oNavigationData] object containing navigation data
			 * @param {string} [oNavigationData.navigationProperty] The navigation property identifying the target of the navigation
			 * @param {boolean} [oNavigationData.replaceInHistory] If this is truthy the page navigated to will replace the current page in the browser history
			 * @public
			 */
			navigateInternal: function(vContext, oNavigationData) {
				if (!vContext && !(oNavigationData && oNavigationData.routeName)){
					oController.getOwnerComponent().getAppComponent().getNavigationController().navigateToRoot(!!(oNavigationData && oNavigationData.replaceInHistory));
					return;
				}
				oTemplateUtils.oCommonUtils.navigateToContext(vContext, oNavigationData);
			},

			getCurrentKeys: function(){
				return oTemplateUtils.oComponentUtils.getCurrentKeys();
			}
		};
	}

	return BaseObject.extend("sap.suite.ui.generic.template.extensionAPI.NavigationController", {
		constructor: function(oTemplateUtils, oController, oState) {
			extend(this, getMethods(oTemplateUtils, oController, oState));
		}
	});
});
