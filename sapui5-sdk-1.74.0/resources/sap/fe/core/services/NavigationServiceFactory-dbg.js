sap.ui.define(
	["sap/ui/core/service/Service", "sap/ui/core/service/ServiceFactory", "sap/base/Log", "sap/fe/navigation/NavigationHandler"],
	function(Service, ServiceFactory, Log, NavigationHandler) {
		"use strict";

		var NavigationService = Service.extend("sap.fe.core.services.NavigationService", {
			initPromise: null,
			init: function() {
				var oContext = this.getContext(),
					oComponent = oContext && oContext.scopeObject;

				this.oNavHandler = new NavigationHandler(oComponent);

				this.initPromise = Promise.resolve(this);
			},

			navigate: function(sSemanticObject, sActionName, vNavigationParameters, oInnerAppData, fnOnError, oExternalAppData, sNavMode) {
				// TODO: Navigation Handler does not handle navigation without a context
				// but in v4 DataFieldForIBN with requiresContext false can trigger a navigation without any context
				// This should be handled
				this.oNavHandler.navigate(
					sSemanticObject,
					sActionName,
					vNavigationParameters,
					oInnerAppData,
					fnOnError,
					oExternalAppData,
					sNavMode
				);
			}
		});

		return ServiceFactory.extend("sap.fe.core.services.NavigationServiceFactory", {
			createInstance: function(oServiceContext) {
				var oNavigationService = new NavigationService(oServiceContext);
				// Wait For init
				return oNavigationService.initPromise.then(function(oService) {
					return oService;
				});
			}
		});
	},
	true
);
