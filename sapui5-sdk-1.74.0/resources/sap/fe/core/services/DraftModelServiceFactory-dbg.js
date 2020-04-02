sap.ui.define(
	["sap/ui/core/service/Service", "sap/ui/core/service/ServiceFactory", "sap/fe/core/model/DraftModel", "sap/ui/core/Component"],
	function(Service, ServiceFactory, DraftModel, Component) {
		"use strict";

		var DraftModelService = Service.extend("sap.fe.core.services.DraftModelService", {
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
					// In case the service is used as in a child component we shall retrieve the parent model
					if (!oODataModel) {
						oODataModel = oAppComponent.getModel(sModelName);
					}
					this.oODataModel = oODataModel;
					this.initPromise = DraftModel.upgradeOnDemand(oODataModel).then(function(bUpgraded) {
						that.bIsDraftModel = bUpgraded;
						return that;
					});
				}
			},
			isDraftModel: function() {
				return this.bIsDraftModel;
			},
			getDraftAccessModel: function() {
				return this.oODataModel.getDraftAccessModel();
			}
		});

		return ServiceFactory.extend("sap.fe.core.services.DraftModelServiceFactory", {
			_oGlobalInstance: null,
			createInstance: function(oServiceContext) {
				var oDraftModelService = new DraftModelService(oServiceContext);
				return oDraftModelService.initPromise;
			}
		});
	},
	true
);
