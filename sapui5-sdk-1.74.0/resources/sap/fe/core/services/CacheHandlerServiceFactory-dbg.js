sap.ui.define(
	[
		"sap/ui/core/service/Service",
		"sap/ui/core/service/ServiceFactory",
		"sap/ui/model/resource/ResourceModel",
		"sap/ui/core/cache/CacheManager"
	],
	function(Service, ServiceFactory, ResourceModel, CacheManager) {
		"use strict";

		function getMetadataETag(sUrl, sETag, mUpdatedMetaModelETags) {
			return new Promise(function(resolve, reject) {
				// There is an Url in the FE cache, that's not in the MetaModel yet -> we need to check the ETag
				jQuery
					.ajax(sUrl, { method: "GET" })
					.done(function(oResponse, sTextStatus, jqXHR) {
						// ETag is not the same -> invalid
						// ETag is the same -> valid
						// If ETag is available use it, otherwise use Last-Modified
						mUpdatedMetaModelETags[sUrl] = jqXHR.getResponseHeader("ETag") || jqXHR.getResponseHeader("Last-Modified");
						resolve(sETag === mUpdatedMetaModelETags[sUrl]);
					})
					.fail(function() {
						// Case 2z - Make sure we update the map so that we invalidate the cache
						mUpdatedMetaModelETags[sUrl] = "";
						resolve(false);
					});
			});
		}

		var CacheHandlerService = Service.extend("sap.fe.core.services.CacheHandlerService", {
			initPromise: null,
			init: function() {
				var that = this;
				var oContext = this.getContext();
				this.oFactory = oContext.factory;
				var mSettings = oContext.settings;
				if (!mSettings.metaModel) {
					throw new Error("a `metaModel` property is expected when instantiating the CacheHandlerService");
				}
				this.oMetaModel = mSettings.metaModel;
				this.initPromise = this.oMetaModel.fetchEntityContainer().then(function() {
					return that;
				});
				this.mCacheNeedsInvalidate = {};
			},
			exit: function() {
				// Deregister global instance
				this.oFactory.removeGlobalInstance(this.oMetaModel);
			},
			validateCacheKey: function(sCacheIdentifier) {
				var that = this;
				// Keep track if the cache will anyway need to be updated
				var bCacheNeedUpdate = true;
				return CacheManager.get(sCacheIdentifier)
					.then(function(mCacheOutput) {
						// We provide a default key so that an xml view cache is written
						var mMetaModelETags = that.getETags();
						var sUpdatedCacheKey = JSON.stringify(mMetaModelETags);
						// Case #1a - No cache, so mCacheOuput is empty, cacheKey = current metamodel ETags
						if (mCacheOutput) {
							// Case #2 - Cache entry found, check if it's still valid
							var mUpdatedMetaModelETags = {};
							var mCachedETags = JSON.parse(mCacheOutput.cachedETags);
							return Promise.all(
								Object.keys(mCachedETags).map(function(sUrl) {
									// Check validity of every single Url that's in the FE Cache object
									if (mCachedETags[sUrl]) {
										if (mMetaModelETags[sUrl]) {
											// Case #2a - Same number of ETags in the cache and in the metadata
											mUpdatedMetaModelETags[sUrl] = mMetaModelETags[sUrl];
											return mCachedETags[sUrl] === mMetaModelETags[sUrl];
										} else {
											// Case #2b - No ETag in the cache for that URL, cachedETags was enhanced
											return getMetadataETag(sUrl, mCachedETags[sUrl], mUpdatedMetaModelETags);
										}
									} else {
										// Case #2z - Last Templating added an URL without ETag
										mUpdatedMetaModelETags[sUrl] = mMetaModelETags[sUrl];
										return mCachedETags[sUrl] === mMetaModelETags[sUrl];
									}
								})
							).then(function(aValidETags) {
								bCacheNeedUpdate = aValidETags.indexOf(false) >= 0;
								// Case #2a - Same number of ETags and all valid -> we return the viewCacheKey
								// Case #2b - Different number of ETags and still all valid -> we return the viewCacheKey
								// Case #2c - Same number of ETags but different values, main service Etag has changed, use that as cache key
								// Case #2d - Different number of ETags but different value, main service Etag or linked service Etag has changed, new ETags should be used as cacheKey
								// Case #2z - Cache has an invalid Etag - if there is an Etag provided from MetaModel use it as cacheKey
								if (
									Object.keys(mUpdatedMetaModelETags).some(function(sUrl) {
										return !mUpdatedMetaModelETags[sUrl];
									})
								) {
									// At least one of the MetaModel URLs doesn't provide an ETag, so no caching
									return null;
								} else {
									return bCacheNeedUpdate ? JSON.stringify(mUpdatedMetaModelETags) : mCacheOutput.viewCacheKey;
								}
							});
						} else if (
							Object.keys(mMetaModelETags).some(function(sUrl) {
								return !mMetaModelETags[sUrl];
							})
						) {
							// Check if cache can be used (all the metadata and annotations have to provide at least a ETag or a Last-Modified header)
							// Case #1-b - No Cache, mCacheOuput is empty, but metamodel etags cannot be used, so no caching
							bCacheNeedUpdate = true;
							sUpdatedCacheKey = null;
						}
						return sUpdatedCacheKey;
					})
					.catch(function(e) {
						// Don't use view cache in case of issues with the LRU cache
						bCacheNeedUpdate = true;
						return null;
					})
					.then(function(sCacheKey) {
						that.mCacheNeedsInvalidate[sCacheIdentifier] = bCacheNeedUpdate;
						return sCacheKey;
					});
			},
			invalidateIfNeeded: function(sCacheKeys, sCacheIdentifier) {
				// Check FE cache after XML view is processed completely
				var sDataSourceETags = JSON.stringify(this.getETags());
				if (this.mCacheNeedsInvalidate[sCacheIdentifier] || (sCacheKeys && sCacheKeys !== sDataSourceETags)) {
					// Something in the sources and/or its ETags changed -> update the FE cache
					var mCacheKeys = {};
					// New ETags that need to be verified, may differ from the one used to generate the view
					mCacheKeys.cachedETags = sDataSourceETags;
					// Old ETags that are used for the xml view cache as key
					mCacheKeys.viewCacheKey = sCacheKeys;
					return CacheManager.set(sCacheIdentifier, mCacheKeys);
				} else {
					return Promise.resolve();
				}
			},
			getETags: function() {
				var mMetaModelETags = this.oMetaModel.getETags();
				// ETags from UI5 are either a Date or a string, let's rationalize that
				Object.keys(mMetaModelETags).forEach(function(sMetaModelKey) {
					if (mMetaModelETags[sMetaModelKey] instanceof Date) {
						// MetaModel contains a Last-Modified timestamp for the URL
						mMetaModelETags[sMetaModelKey] = mMetaModelETags[sMetaModelKey].toISOString();
					}
				});
				return mMetaModelETags;
			}
		});

		return ServiceFactory.extend("sap.fe.core.services.CacheHandlerServiceFactory", {
			_oInstanceRegistry: {},
			createInstance: function(oServiceContext) {
				if (!this._oInstanceRegistry[oServiceContext.settings.metaModel]) {
					this._oInstanceRegistry[oServiceContext.settings.metaModel] = new CacheHandlerService(
						Object.assign(
							{
								factory: this,
								scopeObject: null,
								scopeType: "service"
							},
							oServiceContext
						)
					);
				}
				var that = this;
				return this._oInstanceRegistry[oServiceContext.settings.metaModel].initPromise
					.then(function() {
						return that._oInstanceRegistry[oServiceContext.settings.metaModel];
					})
					.catch(function(e) {
						// In case of error delete the global instance;
						that._oInstanceRegistry[oServiceContext.settings.metaModel] = null;
						throw e;
					});
			},
			getInstance: function(oMetaModel) {
				return this._oInstanceRegistry[oMetaModel];
			},
			removeGlobalInstance: function(oMetaModel) {
				this._oInstanceRegistry[oMetaModel] = null;
			}
		});
	},
	true
);
