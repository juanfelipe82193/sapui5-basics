/* global QUnit */
sap.ui.define(["sap/fe/core/services/CacheHandlerServiceFactory", "sap/ui/core/cache/CacheManager", "sap/ui/Device"], function(
	CacheHandlerServiceFactory,
	Cache,
	Device
) {
	"use strict";
	QUnit.module("CacheHandlerFactory");

	var oFakeMetaModel = {
		fetchEntityContainer: function() {
			return Promise.resolve();
		}
	};

	QUnit.test("can be initialized", function(assert) {
		assert.ok(CacheHandlerServiceFactory != null, "Library has been loaded");
		try {
			var oTestFactory = new CacheHandlerServiceFactory();
			assert.ok(oTestFactory != null);
		} catch (e) {
			assert.notOk("Should not fail");
		}
	});

	var oFactory;
	QUnit.module("CacheHandler instance creation", {
		beforeEach: function() {
			oFactory = new CacheHandlerServiceFactory();
		}
	});

	QUnit.test("cannot be initialized without a metamodel", function(assert) {
		try {
			var oInstance = oFactory.createInstance({ settings: {} });
			assert.notOk(oInstance != null, "Should not succeed");
		} catch (e) {
			assert.ok(e != null, "Should fail");
		}
	});

	QUnit.test("cannot be initialized with a failing metamodel", function(assert) {
		try {
			var fDone = assert.async();
			var oFakeMetaModel = {
				fetchEntityContainer: function() {
					return Promise.reject("Nope");
				}
			};
			var oInstance = oFactory.createInstance({ settings: { metaModel: oFakeMetaModel } });
			assert.ok(oInstance != null, "Should not succeed");
			oInstance
				.then(function(oInstanceLoaded) {
					assert.notOk(true, "Should not succeed");
					fDone();
				})
				.catch(function() {
					assert.ok(true, "Should not succeed");
					fDone();
				});
		} catch (e) {
			assert.notOk(e != null, "Should fail");
		}
	});

	QUnit.test("is initialized as a global instance", function(assert) {
		var fDone = assert.async();
		var oCurrentInstance;
		var oFetchEntityContainerSpy = sinon.spy(oFakeMetaModel, "fetchEntityContainer");
		try {
			assert.ok(oFactory._oInstanceRegistry[oFakeMetaModel] == null, "No global instance exists");
			var oInstance = oFactory.createInstance({ settings: { metaModel: oFakeMetaModel } });
			assert.ok(oInstance != null, "Instance promise is created");
			sinon.assert.calledOnce(oFetchEntityContainerSpy);

			oInstance
				.then(function(oInstanceLoaded) {
					oCurrentInstance = oInstanceLoaded;
					assert.ok(oInstanceLoaded != null, "Instance promise is resolved");
					assert.ok(oFactory._oInstanceRegistry[oFakeMetaModel] != null, "Global instance exists");
					var oNewInstance = oFactory.createInstance({ settings: { metaModel: oFakeMetaModel } });
					// Init should not have been called again since the instance is global to the factory
					sinon.assert.calledOnce(oFetchEntityContainerSpy);
					return oNewInstance;
				})
				.then(function(oNewInstanceLoaded) {
					assert.ok(oNewInstanceLoaded === oCurrentInstance, "Both instance are the same");
					return oFactory.getInstance(oFakeMetaModel);
				})
				.then(function(oGlobalInstance) {
					assert.ok(oCurrentInstance === oGlobalInstance, "Retrieving the global instance returns the same");
					oCurrentInstance.exit();
					assert.ok(oFactory._oInstanceRegistry[oFakeMetaModel] == null, "Global instance is removed");
					return oFactory.createInstance({ settings: { metaModel: oFakeMetaModel } });
				})
				.then(function(oThirdInstanceLoaded) {
					assert.ok(oThirdInstanceLoaded != null, "Third instance can be created");
					fDone();
				})
				.catch(fDone);
		} catch (e) {
			assert.notOk(e != null, e);
			fDone();
		}
	});

	QUnit.module("CacheHandler checks", {
		beforeEach: function() {
			return Cache.del("myCacheKey");
		},
		after: function() {}
	});

	QUnit.test("Case #1a- can validate a basic cache key", function(assert) {
		var fDone = assert.async();
		var oFactory = new CacheHandlerServiceFactory();
		oFakeMetaModel.getETags = function() {
			return {
				"myRootService": "MyETag"
			};
		};
		oFactory.createInstance({ settings: { metaModel: oFakeMetaModel } }).then(function(oCacheHandlerInstance) {
			oCacheHandlerInstance
				.validateCacheKey("myCacheKey")
				.then(function(sValidatedKey) {
					assert.ok(sValidatedKey != null, "ValidatedKey exists");
					assert.ok(sValidatedKey === '{"myRootService":"MyETag"}', "ValidatedKey is correct");
					fDone();
				})
				.catch(fDone);
		});
	});

	QUnit.test("Case #1a - can validate a date based cache key", function(assert) {
		var fDone = assert.async();
		var oFactory = new CacheHandlerServiceFactory();
		oFakeMetaModel.getETags = function() {
			return {
				"myRootService": new Date("2019-08-31")
			};
		};
		oFactory.createInstance({ settings: { metaModel: oFakeMetaModel } }).then(function(oCacheHandlerInstance) {
			oCacheHandlerInstance
				.validateCacheKey("myCacheKey")
				.then(function(sValidatedKey) {
					assert.ok(sValidatedKey != null, "ValidatedKey exists");
					assert.ok(sValidatedKey === '{"myRootService":"2019-08-31T00:00:00.000Z"}', "ValidatedKey is correct");
					fDone();
				})
				.catch(fDone);
		});
	});

	QUnit.test("Case #1-b cannot validate a cache key if no metadata include ETags", function(assert) {
		var fDone = assert.async();
		var oFactory = new CacheHandlerServiceFactory();
		oFakeMetaModel.getETags = function() {
			return {
				"myRootService": null
			};
		};
		oFactory.createInstance({ settings: { metaModel: oFakeMetaModel } }).then(function(oCacheHandlerInstance) {
			oCacheHandlerInstance
				.validateCacheKey("myCacheKey")
				.then(function(sValidatedKey) {
					assert.ok(sValidatedKey == null, "Validated key is null");
					fDone();
				})
				.catch(fDone);
		});
	});

	QUnit.test("Case #1-b cannot validate a cache key if one metadata does not include ETags", function(assert) {
		var fDone = assert.async();
		var oFactory = new CacheHandlerServiceFactory();
		oFakeMetaModel.getETags = function() {
			return {
				"myRootService": "MyETag",
				"myOtherService": null
			};
		};
		oFactory.createInstance({ settings: { metaModel: oFakeMetaModel } }).then(function(oCacheHandlerInstance) {
			oCacheHandlerInstance
				.validateCacheKey("myCacheKey")
				.then(function(sValidatedKey) {
					assert.ok(sValidatedKey == null, "Validated key is null");
					fDone();
				})
				.catch(fDone);
		});
	});

	if (Device.browser.msie || Device.browser.chrome) {
		QUnit.test("Case #2a - can validate a basic cache key and revalidate if the ETags have not changed", function(assert) {
			var fDone = assert.async();
			var oCacheManagerSpy = sinon.spy(Cache, "set");
			var oFactory = new CacheHandlerServiceFactory();
			oFakeMetaModel.getETags = function() {
				return {
					"myRootService": "MyETag",
					"myOtherService": new Date("2019-08-31")
				};
			};
			oFactory.createInstance({ settings: { metaModel: oFakeMetaModel } }).then(function(oCacheHandlerInstance) {
				var sFirstCacheKey;
				oCacheHandlerInstance
					.validateCacheKey("myCacheKey")
					.then(function(sValidatedKey) {
						sFirstCacheKey = sValidatedKey;
						assert.ok(sValidatedKey != null, "ValidatedKey exists");
						assert.ok(
							sValidatedKey === '{"myRootService":"MyETag","myOtherService":"2019-08-31T00:00:00.000Z"}',
							"ValidatedKey is correct "
						);
						sinon.assert.notCalled(oCacheManagerSpy);
						return oCacheHandlerInstance.invalidateIfNeeded(sValidatedKey, "myCacheKey");
					})
					.then(function() {
						return oCacheHandlerInstance.validateCacheKey("myCacheKey");
					})
					.then(function(sSecondValidatedKey) {
						sinon.assert.calledOnce(oCacheManagerSpy);
						assert.ok(sSecondValidatedKey === sFirstCacheKey, "Validated Key is the same as the second validated key");
						return oCacheHandlerInstance.invalidateIfNeeded(sSecondValidatedKey, "myCacheKey");
					})
					.then(function() {
						sinon.assert.calledOnce(oCacheManagerSpy);
						oCacheManagerSpy.restore();
						fDone();
					})
					.catch(function() {
						oCacheManagerSpy.restore();
						fDone();
					});
			});
		});

		QUnit.test("Case #2b - can deal with an ETag enhancement in a given session", function(assert) {
			var fDone = assert.async();
			var oFactory = new CacheHandlerServiceFactory();
			oFakeMetaModel.getETags = function() {
				return {
					"myRootService": "MyETag",
					"myOtherService": new Date("2019-08-31")
				};
			};
			oFactory.createInstance({ settings: { metaModel: oFakeMetaModel } }).then(function(oCacheHandlerInstance) {
				var sFirstCacheKey;
				oCacheHandlerInstance
					.validateCacheKey("myCacheKey")
					.then(function(sValidatedKey) {
						sFirstCacheKey = sValidatedKey;
						assert.ok(sValidatedKey != null, "ValidatedKey exists");
						assert.ok(
							sValidatedKey === '{"myRootService":"MyETag","myOtherService":"2019-08-31T00:00:00.000Z"}',
							"ValidatedKey is correct "
						);
						// Simulate model enhancement
						oFakeMetaModel.getETags = function() {
							return {
								"myRootService": "MyETag",
								"myOtherService": new Date("2019-08-31"),
								"myThirdService": "Yolo"
							};
						};
						return oCacheHandlerInstance.invalidateIfNeeded(sValidatedKey, "myCacheKey");
					})
					.then(function() {
						oCacheHandlerInstance.validateCacheKey("myCacheKey").then(function(sSecondValidatedKey) {
							assert.ok(sSecondValidatedKey === sFirstCacheKey, "Validated Key is the same as the second validated key");
							fDone();
						});
					})
					.catch(fDone);
			});
		});

		QUnit.test("Case #2b + 2z - will request ETag that were added and which are now missing", function(assert) {
			var fDone = assert.async();
			var oFactory = new CacheHandlerServiceFactory();
			oFakeMetaModel.getETags = function() {
				return {
					"myRootService": "MyETag",
					"myOtherService": new Date("2019-08-31")
				};
			};
			oFactory.createInstance({ settings: { metaModel: oFakeMetaModel } }).then(function(oCacheHandlerInstance) {
				var sFirstCacheKey;
				oCacheHandlerInstance
					.validateCacheKey("myCacheKey")
					.then(function(sValidatedKey) {
						sFirstCacheKey = sValidatedKey;
						// Simulate model enhancement
						oFakeMetaModel.getETags = function() {
							return {
								"myRootService": "MyETag",
								"myOtherService": new Date("2019-08-31"),
								"myThirdService": "Yolo"
							};
						};
						return oCacheHandlerInstance.invalidateIfNeeded(sValidatedKey, "myCacheKey");
					})
					.then(function() {
						oFakeMetaModel.getETags = function() {
							return {
								"myRootService": "MyETag",
								"myOtherService": new Date("2019-08-31")
							};
						};
						oCacheHandlerInstance.validateCacheKey("myCacheKey").then(function(sSecondValidatedKey) {
							assert.ok(sSecondValidatedKey !== sFirstCacheKey, "Validated Key is not the same as the second validated key");
							assert.ok(sSecondValidatedKey == null, "No more cache");
							fDone();
						});
					})
					.catch(fDone);
			});
		});

		QUnit.test("Case #2b + 2a - will request ETag that were added and which are the same", function(assert) {
			var fDone = assert.async();
			var oFactory = new CacheHandlerServiceFactory();
			var jQueryAjaxStub = function(fArgs) {
				var fnDoneCb;
				setTimeout(function() {
					fnDoneCb(null, null, {
						getResponseHeader: function(param) {
							if (param === "ETag") {
								return "Yolo";
							}
						}
					});
				}, 100);
				return {
					done: function(doneCb) {
						fnDoneCb = doneCb;
						return {
							fail: function(failCb) {}
						};
					}
				};
			};

			oFakeMetaModel.getETags = function() {
				return {
					"myRootService": "MyETag",
					"myOtherService": new Date("2019-08-31")
				};
			};
			var origAjax = jQuery.ajax;
			oFactory.createInstance({ settings: { metaModel: oFakeMetaModel } }).then(function(oCacheHandlerInstance) {
				var sFirstCacheKey;
				oCacheHandlerInstance
					.validateCacheKey("myCacheKey")
					.then(function(sValidatedKey) {
						sFirstCacheKey = sValidatedKey;
						// Simulate model enhancement
						oFakeMetaModel.getETags = function() {
							return {
								"myRootService": "MyETag",
								"myOtherService": new Date("2019-08-31"),
								"myThirdService": "Yolo"
							};
						};
						return oCacheHandlerInstance.invalidateIfNeeded(sValidatedKey, "myCacheKey");
					})
					.then(function() {
						oFakeMetaModel.getETags = function() {
							return {
								"myRootService": "MyETag",
								"myOtherService": new Date("2019-08-31")
							};
						};

						jQuery.ajax = jQueryAjaxStub;
						return oCacheHandlerInstance.validateCacheKey("myCacheKey");
					})
					.then(function(sSecondValidatedKey) {
						assert.ok(
							sSecondValidatedKey === sFirstCacheKey,
							"Validated Key is the same as the second validated key " + sSecondValidatedKey
						);
						jQuery.ajax = origAjax;
						fDone();
					})
					.catch(function(fDone) {
						jQuery.ajax = origAjax;
						fDone();
					});
			});
		});

		QUnit.test("Case #2b + 2a - will request ETag that were added and which are the same - Date version", function(assert) {
			var fDone = assert.async();
			var oFactory = new CacheHandlerServiceFactory();
			var jQueryAjaxStub = function(fArgs) {
				var fnDoneCb;
				setTimeout(function() {
					fnDoneCb(null, null, {
						getResponseHeader: function(param) {
							if (param === "Last-Modified") {
								return "2019-08-29T00:00:00.000Z";
							}
						}
					});
				}, 100);
				return {
					done: function(doneCb) {
						fnDoneCb = doneCb;
						return {
							fail: function(failCb) {}
						};
					}
				};
			};

			oFakeMetaModel.getETags = function() {
				return {
					"myRootService": "MyETag",
					"myOtherService": new Date("2019-08-31")
				};
			};
			var origAjax = jQuery.ajax;
			oFactory.createInstance({ settings: { metaModel: oFakeMetaModel } }).then(function(oCacheHandlerInstance) {
				var sFirstCacheKey;
				oCacheHandlerInstance
					.validateCacheKey("myCacheKey")
					.then(function(sValidatedKey) {
						sFirstCacheKey = sValidatedKey;
						// Simulate model enhancement
						oFakeMetaModel.getETags = function() {
							return {
								"myRootService": "MyETag",
								"myOtherService": new Date("2019-08-31"),
								"myThirdService": new Date("2019-08-29")
							};
						};
						return oCacheHandlerInstance.invalidateIfNeeded(sValidatedKey, "myCacheKey");
					})
					.then(function() {
						oFakeMetaModel.getETags = function() {
							return {
								"myRootService": "MyETag",
								"myOtherService": new Date("2019-08-31")
							};
						};

						jQuery.ajax = jQueryAjaxStub;
						return oCacheHandlerInstance.validateCacheKey("myCacheKey");
					})
					.then(function(sSecondValidatedKey) {
						assert.ok(
							sSecondValidatedKey === sFirstCacheKey,
							"Validated Key is the same as the second validated key " + sSecondValidatedKey
						);
						jQuery.ajax = origAjax;
						fDone();
					})
					.catch(function(fDone) {
						jQuery.ajax = origAjax;
						fDone();
					});
			});
		});

		QUnit.test("Case #2b + 2d - will request ETag that were added and which are different", function(assert) {
			var fDone = assert.async();
			var oFactory = new CacheHandlerServiceFactory();
			var jQueryAjaxStub = function(fArgs) {
				var fnDoneCb;
				setTimeout(function() {
					fnDoneCb(null, null, {
						getResponseHeader: function(param) {
							if (param === "ETag") {
								return "NotYolo";
							}
						}
					});
				}, 100);
				return {
					done: function(doneCb) {
						fnDoneCb = doneCb;
						return {
							fail: function(failCb) {}
						};
					}
				};
			};

			oFakeMetaModel.getETags = function() {
				return {
					"myRootService": "MyETag",
					"myOtherService": new Date("2019-08-31")
				};
			};
			var origAjax = jQuery.ajax;
			oFactory.createInstance({ settings: { metaModel: oFakeMetaModel } }).then(function(oCacheHandlerInstance) {
				var sFirstCacheKey;
				oCacheHandlerInstance
					.validateCacheKey("myCacheKey")
					.then(function(sValidatedKey) {
						sFirstCacheKey = sValidatedKey;
						// Simulate model enhancement
						oFakeMetaModel.getETags = function() {
							return {
								"myRootService": "MyETag",
								"myOtherService": new Date("2019-08-31"),
								"myThirdService": "Yolo"
							};
						};
						return oCacheHandlerInstance.invalidateIfNeeded(sValidatedKey, "myCacheKey");
					})
					.then(function() {
						oFakeMetaModel.getETags = function() {
							return {
								"myRootService": "MyETag",
								"myOtherService": new Date("2019-08-31")
							};
						};

						jQuery.ajax = jQueryAjaxStub;
						return oCacheHandlerInstance.validateCacheKey("myCacheKey");
					})
					.then(function(sSecondValidatedKey) {
						assert.ok(
							sSecondValidatedKey !== sFirstCacheKey,
							"Validated Key is the same as the second validated key " + sSecondValidatedKey
						);
						assert.ok(
							sSecondValidatedKey ===
								'{"myRootService":"MyETag","myOtherService":"2019-08-31T00:00:00.000Z","myThirdService":"NotYolo"}',
							"Validated Key is correct"
						);
						jQuery.ajax = origAjax;
						fDone();
					})
					.catch(function(fDone) {
						jQuery.ajax = origAjax;
						fDone();
					});
			});
		});

		QUnit.test("Case #2b + 2d - will request ETag that were added and which are different - Date version", function(assert) {
			var fDone = assert.async();
			var oFactory = new CacheHandlerServiceFactory();
			var jQueryAjaxStub = function(fArgs) {
				var fnDoneCb;
				setTimeout(function() {
					fnDoneCb(null, null, {
						getResponseHeader: function(param) {
							if (param === "Last-Modified") {
								return "2019-08-28T00:00:00.000Z";
							}
						}
					});
				}, 100);
				return {
					done: function(doneCb) {
						fnDoneCb = doneCb;
						return {
							fail: function(failCb) {}
						};
					}
				};
			};

			oFakeMetaModel.getETags = function() {
				return {
					"myRootService": "MyETag",
					"myOtherService": new Date("2019-08-31")
				};
			};
			var origAjax = jQuery.ajax;
			oFactory.createInstance({ settings: { metaModel: oFakeMetaModel } }).then(function(oCacheHandlerInstance) {
				var sFirstCacheKey;
				oCacheHandlerInstance
					.validateCacheKey("myCacheKey")
					.then(function(sValidatedKey) {
						sFirstCacheKey = sValidatedKey;
						// Simulate model enhancement
						oFakeMetaModel.getETags = function() {
							return {
								"myRootService": "MyETag",
								"myOtherService": new Date("2019-08-31"),
								"myThirdService": new Date("2019-08-29")
							};
						};
						return oCacheHandlerInstance.invalidateIfNeeded(sValidatedKey, "myCacheKey");
					})
					.then(function() {
						oFakeMetaModel.getETags = function() {
							return {
								"myRootService": "MyETag",
								"myOtherService": new Date("2019-08-31")
							};
						};

						jQuery.ajax = jQueryAjaxStub;
						return oCacheHandlerInstance.validateCacheKey("myCacheKey");
					})
					.then(function(sSecondValidatedKey) {
						assert.ok(
							sSecondValidatedKey !== sFirstCacheKey,
							"Validated Key is the same as the second validated key " + sSecondValidatedKey
						);
						assert.ok(
							sSecondValidatedKey ===
								'{"myRootService":"MyETag","myOtherService":"2019-08-31T00:00:00.000Z","myThirdService":"2019-08-28T00:00:00.000Z"}',
							"Validated Key is correct"
						);
						jQuery.ajax = origAjax;
						fDone();
					})
					.catch(function(fDone) {
						jQuery.ajax = origAjax;
						fDone();
					});
			});
		});

		QUnit.test("Case #2c - can deal with an ETag change", function(assert) {
			var fDone = assert.async();
			var oFactory = new CacheHandlerServiceFactory();
			oFakeMetaModel.getETags = function() {
				return {
					"myRootService": "MyETag",
					"myOtherService": new Date("2019-08-31")
				};
			};
			oFactory.createInstance({ settings: { metaModel: oFakeMetaModel } }).then(function(oCacheHandlerInstance) {
				var sFirstCacheKey;
				oCacheHandlerInstance
					.validateCacheKey("myCacheKey")
					.then(function(sValidatedKey) {
						sFirstCacheKey = sValidatedKey;
						assert.ok(sValidatedKey != null, "ValidatedKey exists");
						assert.ok(
							sValidatedKey === '{"myRootService":"MyETag","myOtherService":"2019-08-31T00:00:00.000Z"}',
							"ValidatedKey is correct "
						);
						return oCacheHandlerInstance.invalidateIfNeeded(sValidatedKey, "myCacheKey");
					})
					.then(function() {
						// Simulate ETag change
						oFakeMetaModel.getETags = function() {
							return {
								"myRootService": "NotMyETag",
								"myOtherService": new Date("2019-08-31")
							};
						};
						oCacheHandlerInstance.validateCacheKey("myCacheKey").then(function(sSecondValidatedKey) {
							assert.ok(
								sSecondValidatedKey !== sFirstCacheKey,
								"Validated Key is the not the same as the second validated key"
							);
							assert.ok(
								sSecondValidatedKey === '{"myRootService":"NotMyETag","myOtherService":"2019-08-31T00:00:00.000Z"}',
								"ValidatedKey is correct "
							);
							fDone();
						});
					})
					.catch(fDone);
			});
		});

		QUnit.test("Case #2d - can deal with an ETag enhancement and a change", function(assert) {
			var fDone = assert.async();
			var oFactory = new CacheHandlerServiceFactory();
			oFakeMetaModel.getETags = function() {
				return {
					"myRootService": "MyETag",
					"myOtherService": new Date("2019-08-31")
				};
			};
			oFactory.createInstance({ settings: { metaModel: oFakeMetaModel } }).then(function(oCacheHandlerInstance) {
				var sFirstCacheKey;
				oCacheHandlerInstance
					.validateCacheKey("myCacheKey")
					.then(function(sValidatedKey) {
						sFirstCacheKey = sValidatedKey;
						assert.ok(sValidatedKey != null, "ValidatedKey exists");
						assert.ok(
							sValidatedKey === '{"myRootService":"MyETag","myOtherService":"2019-08-31T00:00:00.000Z"}',
							"ValidatedKey is correct "
						);
						// Simulate model enhancement
						oFakeMetaModel.getETags = function() {
							return {
								"myRootService": "MyETag",
								"myOtherService": new Date("2019-08-31"),
								"myThirdService": "Yolo"
							};
						};
						return oCacheHandlerInstance.invalidateIfNeeded(sValidatedKey, "myCacheKey");
					})
					.then(function() {
						oFakeMetaModel.getETags = function() {
							return {
								"myRootService": "MyETag",
								"myOtherService": new Date("2019-08-30"),
								"myThirdService": "Yolo"
							};
						};
						oCacheHandlerInstance.validateCacheKey("myCacheKey").then(function(sSecondValidatedKey) {
							assert.ok(sSecondValidatedKey !== sFirstCacheKey, "Validated Key is not the same as the second validated key");
							assert.ok(
								sSecondValidatedKey ===
									'{"myRootService":"MyETag","myOtherService":"2019-08-30T00:00:00.000Z","myThirdService":"Yolo"}',
								"ValidatedKey is correct " + sSecondValidatedKey
							);
							fDone();
						});
					})
					.catch(fDone);
			});
		});

		QUnit.test("Case #2z - can deal with an invalid ETag enhancement", function(assert) {
			var fDone = assert.async();
			var oFactory = new CacheHandlerServiceFactory();
			oFakeMetaModel.getETags = function() {
				return {
					"myRootService": "MyETag",
					"myOtherService": new Date("2019-08-31")
				};
			};
			oFactory.createInstance({ settings: { metaModel: oFakeMetaModel } }).then(function(oCacheHandlerInstance) {
				var sFirstCacheKey;
				oCacheHandlerInstance
					.validateCacheKey("myCacheKey")
					.then(function(sValidatedKey) {
						sFirstCacheKey = sValidatedKey;
						assert.ok(sValidatedKey != null, "ValidatedKey exists");
						assert.ok(
							sValidatedKey === '{"myRootService":"MyETag","myOtherService":"2019-08-31T00:00:00.000Z"}',
							"ValidatedKey is correct "
						);
						// Simulate model enhancement
						oFakeMetaModel.getETags = function() {
							return {
								"myRootService": "MyETag",
								"myOtherService": new Date("2019-08-31"),
								"myThirdService": null
							};
						};
						return oCacheHandlerInstance.invalidateIfNeeded(sValidatedKey, "myCacheKey");
					})
					.then(function() {
						oCacheHandlerInstance.validateCacheKey("myCacheKey").then(function(sSecondValidatedKey) {
							assert.ok(sSecondValidatedKey !== sFirstCacheKey, "Validated Key is not the same as the second validated key");
							assert.ok(sSecondValidatedKey === null, "ValidatedKey is null since it doesn't have an ETag");
							fDone();
						});
					})
					.catch(fDone);
			});
		});

		QUnit.test("Case #xx - can deal with an error thrown while validating the cache", function(assert) {
			var fDone = assert.async();
			var oFactory = new CacheHandlerServiceFactory();
			oFakeMetaModel.getETags = function() {
				return {
					"myRootService": "MyETag",
					"myOtherService": new Date("2019-08-31")
				};
			};
			oFactory.createInstance({ settings: { metaModel: oFakeMetaModel } }).then(function(oCacheHandlerInstance) {
				var sFirstCacheKey;
				oCacheHandlerInstance
					.validateCacheKey("myCacheKey")
					.then(function(sValidatedKey) {
						sFirstCacheKey = sValidatedKey;
						assert.ok(sValidatedKey != null, "ValidatedKey exists");
						assert.ok(
							sValidatedKey === '{"myRootService":"MyETag","myOtherService":"2019-08-31T00:00:00.000Z"}',
							"ValidatedKey is correct "
						);
						return oCacheHandlerInstance.invalidateIfNeeded(sValidatedKey, "myCacheKey");
					})
					.then(function() {
						// Simulate error
						oFakeMetaModel.getETags = function() {
							throw new Error("nope");
						};
						oCacheHandlerInstance.validateCacheKey("myCacheKey").then(function(sSecondValidatedKey) {
							assert.ok(sSecondValidatedKey !== sFirstCacheKey, "Validated Key is not the same as the second validated key");
							assert.ok(sSecondValidatedKey === null, "ValidatedKey is null since it doesn't have an ETag");
							fDone();
						});
					})
					.catch(fDone);
			});
		});
	}
});
