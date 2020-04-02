sap.ui.define(
	[
		"sap/ui/core/service/Service",
		"sap/ui/core/service/ServiceFactory",
		"sap/ui/core/service/ServiceFactoryRegistry",
		"sap/ui/model/base/ManagedObjectModel",
		"sap/ui/core/cache/CacheManager",
		"sap/ui/model/resource/ResourceModel",
		"sap/ui/core/mvc/View",
		"sap/ui/core/Component",
		"sap/ui/model/json/JSONModel",
		"sap/base/Log",
		"sap/ui/core/routing/HashChanger",
		"sap/fe/core/controllerextensions/FlexibleColumnLayout"
	],
	function(
		Service,
		ServiceFactory,
		ServiceFactoryRegistry,
		ManagedObjectModel,
		Cache,
		ResourceModel,
		View,
		Component,
		JSONModel,
		Log,
		HashChanger,
		FlexibleColumnLayout
	) {
		"use strict";

		function MetaPath(name, initialPath) {
			this.name = name;
			this.currentPath = initialPath || "";
			this.lastPath = "";
			this.set = function(sNewPath) {
				while (sNewPath.indexOf("../") === 0) {
					this.currentPath = this.currentPath.substr(0, this.currentPath.lastIndexOf(this.lastPath) - 1);
					this.lastPath = this.currentPath.substr(this.currentPath.lastIndexOf("/") + 1);
					sNewPath = sNewPath.substr(3);
				}
				if (sNewPath) {
					this.lastPath = sNewPath;
				}
				this.currentPath += sNewPath;
				Log.info(this.name + " is now : " + this.currentPath);
			};
			this.get = function() {
				return this.currentPath;
			};
			this.delete = function() {
				this.currentPath = "";
				Log.info(this.name + " has been deleted");
			};
		}

		function createBreadcrumbLinks(sPath, oMetaModel) {
			var aLinks = [],
				sLinkPath = "";
			if (oMetaModel && sPath) {
				var aLinkParts = sPath.split("/");
				// if fcl skip the layout (last part of the hash)
				if (FlexibleColumnLayout.prototype.isFclEnabled()) {
					aLinkParts.pop();
				}
				// Skip the current page (last part of the hash)
				aLinkParts.pop();
				for (var i = 0; i < aLinkParts.length; i++) {
					sLinkPath = sLinkPath + "/" + aLinkParts[i];
					// context for annotation access during templating
					aLinks.push({
						context: oMetaModel.getMetaContext(sLinkPath.replace(/ *\([^)]*\) */g, "") + "/")
					});
				}
			}
			return aLinks;
		}

		function getViewLevel(sPath) {
			if (sPath) {
				sPath = "/" + sPath;
			}
			var oViewLevel = sPath.split("/").length - 1;

			return oViewLevel;
		}

		var TemplatedViewService = Service.extend("sap.fe.core.services.TemplatedViewService", {
			initPromise: null,
			init: function() {
				var that = this;
				var aServiceDependencies = [];
				var oContext = this.getContext();
				var oComponent = oContext.scopeObject;
				var oAppComponent = Component.getOwnerComponentFor(oComponent);
				var oMetaModel = oAppComponent.getMetaModel();
				var sStableId = oAppComponent.getMetadata().getComponentName() + "::" + oAppComponent.getLocalId(oComponent.getId());
				var aEnhanceI18n = oComponent.getEnhanceI18n() || [];
				var sAppUrl;

				if (aEnhanceI18n) {
					// the i18n URIs are only relative to the app component but the enhancement works with the path
					// relative to the document.uri
					sAppUrl = sap.ui.require.toUrl(oAppComponent.getMetadata().getComponentName());
					for (var i = 0; i < aEnhanceI18n.length; i++) {
						aEnhanceI18n[i] = sAppUrl + "/" + aEnhanceI18n[i];
					}
				}

				var sCacheIdentifier =
					oAppComponent.getMetadata().getName() +
					"_" +
					sStableId +
					"_" +
					sap.ui
						.getCore()
						.getConfiguration()
						.getLanguageTag();
				aServiceDependencies.push(
					ServiceFactoryRegistry.get("sap.fe.core.services.ResourceModelService")
						.createInstance({
							scopeType: "component",
							scopeObject: oComponent,
							settings: {
								bundles: ["sap.fe.core", "sap.fe.templates"],
								enhanceI18n: aEnhanceI18n,
								modelName: "sap.fe.i18n"
							}
						})
						.then(function(oResourceModelService) {
							return oResourceModelService.getResourceModel();
						})
				);

				aServiceDependencies.push(
					ServiceFactoryRegistry.get("sap.fe.core.services.CacheHandlerService")
						.createInstance({
							settings: {
								metaModel: oMetaModel
							}
						})
						.then(function(oCacheHandlerService) {
							return oCacheHandlerService.validateCacheKey(sCacheIdentifier);
						})
				);

				this.initPromise = Promise.all(aServiceDependencies)
					.then(function(aDependenciesResult) {
						var oResourceModel = aDependenciesResult[0];
						var sCacheKey = aDependenciesResult[1];
						return that.createView(oResourceModel, sStableId, sCacheKey);
					})
					.then(function(sCacheKey) {
						var oCacheHandlerService = ServiceFactoryRegistry.get("sap.fe.core.services.CacheHandlerService").getInstance(
							oMetaModel
						);
						oCacheHandlerService.invalidateIfNeeded(sCacheKey, sCacheIdentifier);
					});
			},
			createView: function(oResourceModel, sStableId, sCacheKey) {
				var that = this;
				var oContext = this.getContext(),
					mServiceSettings = oContext.settings,
					oComponent = oContext.scopeObject,
					sEntitySet = oComponent.getProperty("entitySet"),
					oAppComponent = Component.getOwnerComponentFor(oComponent),
					oMetaModel = oAppComponent.getMetaModel();

				var mViewData = {};
				mViewData.navigation = oComponent.getNavigation();
				mViewData.links = createBreadcrumbLinks(HashChanger.getInstance().getHash(), oMetaModel);
				mViewData.viewLevel = getViewLevel(HashChanger.getInstance().getHash());
				mViewData.FCLLevel = 0; // Will be updated dynamically
				if (oComponent.getViewData) {
					Object.assign(mViewData, oComponent.getViewData());
				}

				var oDeviceModel = new JSONModel(sap.ui.Device).setDefaultBindingMode("OneWay"),
					oManifestModel = new JSONModel(oAppComponent.getManifest()),
					oViewDataModel = new JSONModel(mViewData),
					oMetaPathModel = new JSONModel({
						currentPath: new MetaPath(),
						navigationPath: new MetaPath("NavigationPath")
					}),
					oViewSettings = {
						type: "XML",
						preprocessors: {
							xml: {
								bindingContexts: {
									entitySet: sEntitySet ? oMetaModel.createBindingContext("/" + sEntitySet) : null,
									viewData: mViewData ? oViewDataModel.createBindingContext("/") : null
								},
								models: {
									entitySet: oMetaModel,
									"sap.fe.i18n": oResourceModel,
									"sap.ui.mdc.metaModel": oMetaModel,
									"sap.fe.deviceModel": oDeviceModel, // TODO: discuss names here
									manifest: oManifestModel,
									viewData: oViewDataModel,
									metaPath: oMetaPathModel
								}
							}
						},
						id: sStableId,
						viewName: mServiceSettings.viewName,
						viewData: mViewData,
						cache: { keys: [sCacheKey] },
						height: "100%"
					};

				function createErrorPage(reason) {
					// just replace the view name and add an additional model containing the reason, but
					// keep the other settings
					Log.error(reason);
					oViewSettings.viewName = mServiceSettings.errorViewName || "sap.fe.core.services.view.TemplatingErrorPage";
					oViewSettings.preprocessors.xml.models["error"] = new JSONModel(reason);

					return oComponent.runAsOwner(function() {
						return View.create(oViewSettings);
					});
				}

				return oComponent.runAsOwner(function() {
					return View.create(oViewSettings)
						.catch(createErrorPage)
						.then(function(oView) {
							that.oView = oView;
							that.oView.setModel(new ManagedObjectModel(that.oView), "$view");
							oComponent.setAggregation("rootControl", that.oView);
							return sCacheKey;
						});
				});
			},
			getView: function() {
				return this.oView;
			}
		});

		return ServiceFactory.extend("sap.fe.core.services.TemplatedViewServiceFactory", {
			createInstance: function(oServiceContext) {
				var oTemplatedViewService = new TemplatedViewService(oServiceContext);
				return oTemplatedViewService.initPromise.then(function() {
					return oTemplatedViewService;
				});
			}
		});
	},
	true
);
