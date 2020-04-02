sap.ui.define(
	["sap/ui/core/service/Service", "sap/ui/core/service/ServiceFactory", "sap/fe/core/model/NamedBindingModel", "sap/ui/core/Component"],
	function(Service, ServiceFactory, NamedBindingModel, Component) {
		"use strict";

		var NamedBindingModelService = Service.extend("sap.fe.core.services.NamedBindingModelService", {
			initPromise: Promise.resolve(this),
			init: function() {
				var that = this;
				var oContext = this.getContext();
				var mSettings = oContext.settings;
				if (oContext.scopeType === "component") {
					var oComponent = oContext.scopeObject;
					var sModelName = mSettings.modelName;
					var oAppComponent = Component.getOwnerComponentFor(oComponent);
					var oODataModel = oComponent.getModel(sModelName);
					// In case the service is used as in a child component we shall retrieve the parent modelBre
					if (!oODataModel) {
						oODataModel = oAppComponent.getModel(sModelName);
					}
					this.initPromise = NamedBindingModel.upgrade(oODataModel).then(function() {
						return that;
					});
				}
			}
		});

		return ServiceFactory.extend("sap.fe.core.services.NamedBindingModelServiceFactory", {
			_oGlobalInstance: null,
			createInstance: function(oServiceContext) {
				var oNamedBindingModelService = new NamedBindingModelService(oServiceContext);
				return oNamedBindingModelService.initPromise;
			}
		});
	},
	true
);
