sap.ui.define(
	[
		"sap/ui/core/service/Service",
		"sap/ui/core/service/ServiceFactory",
		"sap/ui/model/resource/ResourceModel",
		"sap/base/i18n/ResourceBundle"
	],
	function(Service, ServiceFactory, ResourceModel, ResourceBundle) {
		"use strict";

		var ResourceModelService = Service.extend("sap.fe.core.services.ResourceModelService", {
			initPromise: Promise.resolve(),
			init: function() {
				var that = this;
				var oContext = this.getContext();
				var mSettings = oContext.settings;
				this.oFactory = oContext.factory;

				this.initPromise = new Promise(function(resolve, reject) {
					var aBundles = mSettings.bundles;
					var aEnhanceI18n = mSettings.enhanceI18n || [];

					sap.ui
						.getCore()
						.getLibraryResourceBundle(aBundles[0], undefined, true)
						.then(function(oBundle) {
							var aEnhancePromises = [];
							var fnEnhanceWithBundle = function(oBundle) {
								return that.oResourceModel.enhance(oBundle);
							};

							that.oResourceModel = new ResourceModel({
								bundle: oBundle,
								async: true
							});

							if (oContext.scopeType === "component") {
								var oComponent = oContext.scopeObject;
								oComponent.setModel(that.oResourceModel, mSettings.modelName);
							}

							if (aBundles.length > 1 || aEnhanceI18n.length > 0) {
								// first load all library bundles
								for (var i = 1; i < aBundles.length; i++) {
									aEnhancePromises.push(
										sap.ui
											.getCore()
											.getLibraryResourceBundle(aBundles[1], undefined, true)
											.then(fnEnhanceWithBundle)
									);
								}

								Promise.all(aEnhancePromises).then(function() {
									for (var i = 0; i < aEnhanceI18n.length; i++) {
										aEnhancePromises.push(that.oResourceModel.enhance({ bundleUrl: aEnhanceI18n[i] }));
									}

									Promise.all(aEnhancePromises).then(function() {
										resolve(that);
									});
								});
							} else {
								that.oResourceModel.getResourceBundle().then(function() {
									resolve(that);
								});
							}

							that.oResourceModel.attachRequestFailed(reject);
						});
				});
			},
			getResourceModel: function() {
				return this.oResourceModel;
			},
			exit: function() {
				// Deregister global instance
				this.oFactory.removeGlobalInstance();
			}
		});

		return ServiceFactory.extend("sap.fe.core.services.ResourceModelServiceFactory", {
			_oInstances: {},
			createInstance: function(oServiceContext) {
				var sKey =
					oServiceContext.settings.bundles.join(",") +
					(oServiceContext.settings.enhanceI18n ? "," + oServiceContext.settings.enhanceI18n.join(",") : "");

				if (!this._oInstances[sKey]) {
					this._oInstances[sKey] = new ResourceModelService(Object.assign({ factory: this }, oServiceContext));
				}

				return this._oInstances[sKey].initPromise;
			},
			removeGlobalInstance: function() {
				this._oInstances = {};
			}
		});
	},
	true
);
