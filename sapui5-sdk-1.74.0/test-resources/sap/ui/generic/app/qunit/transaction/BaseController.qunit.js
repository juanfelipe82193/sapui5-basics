/*global QUnit, sinon */
sap.ui.define([
	"sap/ui/model/odata/ODataMetaModel",
	"sap/ui/model/odata/ODataModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/generic/app/transaction/BaseController",
	"sap/ui/core/util/MockServer",
	"sap/ui/core/util/DraftEnabledMockServer"
], function(
	ODataMetaModel,
	ODataModelV1,
	ODataModelV2,
	BaseController,
	MockServer,
	DraftEnabledMockServer
) {
	"use strict";

	// Mockserver Helper
	var sServiceUri = "/SalesOrderSrv/";
	// var sDataRootPath =  "testdata/SalesOrder/";

	var oMockServer = new MockServer({
		rootUri: sServiceUri
	});

	function initServer() {
		oMockServer.simulate("test-resources/sap/ui/generic/app/qunit/transaction/testdata/metadata.xml"/*, sDataRootPath*/);
		oMockServer.start();
	}

	function initModel(mParameters) {
		ODataModelV2.mServiceData = {};
		return new ODataModelV2(sServiceUri, mParameters);
	}


	QUnit.module("sap.ui.generic.app.transaction.BaseController", {
		beforeEach: function () {
			this.oModel = sinon.createStubInstance(ODataModelV1);
			this.oModel.getETag = function () {
				return "etag";
			};
			this.oModel.bUseBatch = true;
			this.oBaseController = new BaseController(this.oModel);
		},
		afterEach: function () {
			this.oBaseController.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function (assert) {
		var oBaseController;

		assert.ok(this.oBaseController);
		assert.ok(this.oBaseController._oQueue);
		assert.ok(this.oBaseController._bOwnsQueue);

		oBaseController = new BaseController(this.oModel, {
			destroy: function () { }
		});
		assert.ok(oBaseController);
		assert.ok(oBaseController._oQueue);
		assert.ok(!oBaseController._bOwnsQueue);

		oBaseController.destroy();
	});

	QUnit.test("Model is a mandatory parameter", function (assert) {
		var bException = false;

		try {
			new BaseController();
		} catch (ex) {
			bException = true;
		}

		assert.ok(bException);
	});

	QUnit.test("prepareCallAction: function import is a mandatory parameter", function (assert) {
		var bException = false;

		try {
			this.oBaseController._prepareCallAction();
		} catch (ex) {
			bException = true;
		}

		assert.ok(bException);
	});

	QUnit.test("callAction without parameters", function (assert) {
		var done = assert.async();
		var succeed = function (text) {
			assert.ok(true, text);
			done();
		};
		var fail = function (text) {
			assert.ok(false, text);
			done();
		};
		var oBaseController, oContext;

		this.oModel.callFunction = sinon.stub().yieldsTo("success");
		this.oModel.getMetaModel = function () {
			return {
				getODataEntitySet: sinon.stub().returns({
					entityType: "namespace.EntityTypeName",
					name: "Mock"
				}),
				getODataEntityType: sinon.stub().returns({
					name: "EntityTypeName",
					key: {
						propertyRef: []
					}
				}),
				getODataFunctionImport: sinon.stub().returns({ parameter: [] })
			};
		};

		oContext = {
			getObject: sinon.stub(),
			getPath: function () {
				return "/Mock(1)";
			},
			getModel: function() {
				return this.oModel;
			}.bind(this)
		};

		oBaseController = new BaseController(this.oModel);
		oBaseController._callAction("mockFn", oContext, { entitySet: "dummySet" }).then(succeed, fail);

		oBaseController.destroy();
	});

	QUnit.test("callAction with unknown function import should fail", function (assert) {
		var oBaseController, oContext, bException = false;

		// mock the meta model.
		this.oModel.getMetaModel = function () {
			return {
				getODataEntitySet: sinon.stub().returns({ entityType: "namespace.EntityTypeName" }),
				getODataEntityType: sinon.stub().returns({
					name: "EntityTypeName",
					key: {
						propertyRef: []
					}
				}),
				getODataFunctionImport: sinon.stub().returns()
			};
		};
		this.oModel.callFunction = sinon.stub().yieldsTo("error");
		oContext = {
			getObject: sinon.stub(),
			getPath: function () {
				return "/Mock(1)";
			}
		};

		oBaseController = new BaseController(this.oModel);
		try {
			oBaseController._callAction("mockFn", oContext, { entitySet: "dummySet" });
		} catch (ex) {
			bException = true;
		}

		assert.ok(bException);
		oBaseController.destroy();
	});

	QUnit.test("callAction with matching parameters should succeed", function (assert) {
		var done = assert.async();
		var succeed = function (text) {
			assert.ok(true, text);
			done();
		};
		var fail = function (text) {
			assert.ok(false, text);
			done();
		};
		var oBaseController, oContext;

		this.oModel.callFunction = sinon.stub().yieldsTo("success");
		this.oModel.getMetaModel = function () {
			return {
				getODataEntitySet: sinon.stub().returns({
					entityType: "namespace.EntityTypeName",
					name: "Mock"
				}),
				getODataEntityType: sinon.stub().returns({
					name: "EntityTypeName",
					key: {
						propertyRef: [{ name: "mock1" }, { name: "mock2" }]
					}
				}),
				getODataFunctionImport: sinon.stub().returns({ parameter: [{ name: "mock1" }, { name: "mock2" }] })
			};
		};

		oContext = {
			getObject: function () {
				return {
					mock1: true,
					mock2: true
				};
			},
			getPath: function () {
				return "/Mock(1)";
			},
			getModel: function() {
				return this.oModel;
			}.bind(this)
		};

		oBaseController = new BaseController(this.oModel);
		oBaseController._callAction("mockFn", oContext, { entitySet: "dummySet" }).then(succeed, fail);

		oBaseController.destroy();
	});

	QUnit.test("callAction without context should succeed", function (assert) {
		var done = assert.async();
		var succeed = function (text) {
			assert.ok(true, text);
			done();
		};
		var fail = function (text) {
			assert.ok(false, text);
			done();
		};
		var oBaseController;

		this.oModel.callFunction = sinon.stub().yieldsTo("success");
		this.oModel.getMetaModel = function () {
			return {
				getODataFunctionImport: sinon.stub().returns({ parameter: [{ name: "mock1" }, { name: "mock2" }] })
			};
		};

		oBaseController = new BaseController(this.oModel);
		oBaseController._callAction("mockFn", null, { entitySet: "dummySet" }).then(succeed, fail);

		oBaseController.destroy();
	});

	QUnit.test("callAction with non-matching parameters and 'action-for' set should throw an exception", function (assert) {
		var oBaseController, oContext, bError = false;
		var succeed = function (text) {
			assert.ok(true, text);
			//done();
		};
		var fail = function (text) {
			assert.ok(false, text);
			//done();
		};

		this.oModel.callFunction = sinon.stub().yieldsTo("success");
		this.oModel.getMetaModel = function () {
			return {
				getODataEntitySet: sinon.stub().returns({ entityType: "namespace.EntityTypeName" }),
				getODataEntityType: sinon.stub().returns({
					name: "EntityTypeName",
					key: {
						propertyRef: [{ name: "" }]
					}
				}),
				getODataFunctionImport: sinon.stub().returns({
					"sap:action-for": "dummy",
					parameter: [{ name: "mock1" }, { name: "mock2" }]
				})
			};
		};

		oContext = {
			getObject: function () {
				return {
					mock1: true,
					mock2: true
				};
			},
			getPath: function () {
				return "/Mock(1)";
			}
		};

		oBaseController = new BaseController(this.oModel);

		try {
			oBaseController._callAction("mockFn", oContext, { entitySet: "dummySet" }).then(succeed, fail);
		} catch (ex) {
			bError = true;
		}

		assert.ok(bError);
		oBaseController.destroy();
	});

	QUnit.test("callAction with missing key in parameters should fail", function (assert) {
		var oBaseController, oContext, bException = false;

		this.oModel.getMetaModel = function () {
			return {
				getODataEntitySet: sinon.stub().returns({ entityType: "namespace.EntityTypeName" }),
				getODataEntityType: sinon.stub().returns({
					name: "EntityTypeName",
					key: {
						propertyRef: [{ name: "mock1" }]
					}
				}),
				getODataFunctionImport: sinon.stub().returns({ parameter: [{ name: "mock1" }, { name: "mock2" }] })
			};
		};

		oContext = {
			getObject: function () {
				return {
					mock1: true
				};
			},
			getPath: function () {
				return "/Mock(1)";
			}
		};

		oBaseController = new BaseController(this.oModel);

		try {
			oBaseController._callAction("mockFn", oContext, { entitySet: "dummySet" });
		} catch (ex) {
			bException = true;
		}

		assert.ok(bException);
		oBaseController.destroy();
	});

	QUnit.test("callAction with missing key in parameters should fail if param is an object property", function (assert) {
		var oBaseController, oContext;

		this.oModel.getMetaModel = function () {
			return {
				getODataEntitySet: sinon.stub().returns({ entityType: "namespace.EntityTypeName" }),
				getODataEntityType: sinon.stub().returns({
					name: "EntityTypeName",
					key: {
						propertyRef: [{ name: "mock1" }]
					}
				}),
				getODataFunctionImport: sinon.stub().returns({ parameter: [{ name: "mock1" }, { name: "mock2" }] })
			};
		};

		oContext = {
			getObject: function () {
				return {
					mock1: true,
					mock2: true
				};
			},
			getPath: function () {
				return "/Mock(1)";
			}
		};

		oBaseController = new BaseController(this.oModel);

		try {
			oBaseController._callAction("mockFn", oContext, { entitySet: "dummySet" });
		} catch (ex) {
			assert.ok(true);
		}

		oBaseController.destroy();
	});

	QUnit.test("callAction with matching key parameters + additional parameter should fail", function (assert) {
		var oBaseController, oContext, bException = false;

		this.oModel.getMetaModel = function () {
			return {
				getODataEntitySet: sinon.stub().returns({ entityType: "namespace.EntityTypeName" }),
				getODataEntityType: sinon.stub().returns({
					name: "EntityTypeName",
					key: {
						propertyRef: [{ name: "mock1" }, { name: "mock2" }]
					}
				}),
				getODataFunctionImport: sinon.stub().returns({ parameter: [{ name: "mock1" }, { name: "mock2" }, { name: "param1" }] })
			};
		};

		oContext = {
			getObject: function () {
				return {
					mock1: true,
					mock2: true,
					param1: true
				};
			},
			getPath: function () {
				return "/Mock(1)";
			}
		};

		oBaseController = new BaseController(this.oModel);

		try {
			oBaseController._callAction("mockFn", oContext, { entitySet: "dummySet" });
		} catch (ex) {
			bException = true;
		}

		assert.ok(bException);
		oBaseController.destroy();
	});

	QUnit.test("callAction with unknown additional parameter should fail", function (assert) {
		var oBaseController, oContext, bException = false;

		this.oModel.getMetaModel = function () {
			return {
				getODataEntitySet: sinon.stub().returns({ entityType: "namespace.EntityTypeName" }),
				getODataEntityType: sinon.stub().returns({
					name: "EntityTypeName",
					key: {
						propertyRef: [{ name: "mock1" }, { name: "mock2" }]
					}
				}),
				getODataFunctionImport: sinon.stub().returns({ parameter: [{ name: "mock1" }, { name: "mock2" }, { name: "unknown" }] })
			};
		};

		oContext = {
			getObject: function () {
				return {
					mock1: true,
					mock2: true
				};
			}
		};

		oBaseController = new BaseController(this.oModel);

		try {
			oBaseController._callAction("mockFn", oContext, { entitySet: "dummySet" });
		} catch (ex) {
			bException = true;
		}

		assert.ok(bException);
		oBaseController.destroy();
	});

	QUnit.test("triggerSubmitChanges", function (assert) {
		var done = assert.async();
		var oController, oModel, bSubmit = false, mParams = {};

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.hasPendingChanges = sinon.stub().returns(true);
		oModel.bUseBatch = true;
		oModel.submitChanges = function (p1, p2) {
			bSubmit = true;
			return p1.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.getContext = function () {
			return {
				"path": "/MockKey(1)",
				getObject: function () {
					return {
						IsActiveEntity: true,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};

		oController = new BaseController(oModel);
		mParams.context = oModel.getContext();

		oController.triggerSubmitChanges(mParams).then(function (oResult) {
			assert.ok(oResult.context);
			assert.ok(oResult.data);
			assert.ok(bSubmit);
			oController.destroy();
			done();
		});
	});

	QUnit.test("triggerSubmitChanges, if no changes are available", function (assert) {
		var done = assert.async();
		var oController, oModel, bSubmit = false, mParams = {};

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.setDeferredBatchGroups = function () { };
		oModel.setChangeBatchGroups = function () { };
		oModel.hasPendingChanges = sinon.stub().returns(false);
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns("mockType"),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"ActivationAction": {
						"String": "/dummyFunc"
					}
				}
			}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			}),
			getODataFunctionImport: sinon.stub().returns({
				"entitySet": "dummySet",
				"parameter": []
			})
		});

		oController = new BaseController(oModel);

		mParams.context = {};
		oController.triggerSubmitChanges(mParams).then(function (oResult) {
			assert.ok(oResult.context);
			assert.ok(!oResult.data);
			assert.ok(!bSubmit);
			oController.destroy();
			done();
		}, function (oResult) {
			assert.ok(false);
			oController.destroy();
			done();
		});
	});

	QUnit.test("triggerSubmitChanges fails", function (assert) {
		var done = assert.async();
		var oController, oModel;

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.setDeferredBatchGroups = function () { };
		oModel.setChangeBatchGroups = function () { };
		oModel.hasPendingChanges = sinon.stub().returns(true);
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns("mockType"),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"ActivationAction": {
						"String": "/dummyFunc"
					}
				}
			}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			}),
			getODataFunctionImport: sinon.stub().returns({
				"entitySet": "dummySet",
				"parameter": []
			})
		});
		oModel.submitChanges = function (p1, p2) {
			return p1.error({
				"message": "Mock Error",
				"mockdata": true
			});
		};
		oModel.getKey = function () {
			return "/MockKey(1)";
		};
		oModel.getContext = function () {
			return {
				"path": "/MockKey(1)",
				getObject: function () {
					return {
						IsActiveEntity: true,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};

		oController = new BaseController(oModel);

		oController.triggerSubmitChanges().then(function (oResult) {
			assert.ok(false);
			oController.destroy();
			done();
		}, function (oResult) {
			assert.ok(oResult.response);
			oController.destroy();
			done();
		});
	});

	QUnit.test("triggerSubmitChanges has implicit error", function (assert) {
		var done = assert.async();
		var oController, oModel;

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.setDeferredBatchGroups = function () { };
		oModel.setChangeBatchGroups = function () { };
		oModel.hasPendingChanges = sinon.stub().returns(true);
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns("mockType"),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"ActivationAction": {
						"String": "/dummyFunc"
					}
				}
			}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			}),
			getODataFunctionImport: sinon.stub().returns({
				"entitySet": "dummySet",
				"parameter": []
			})
		});
		oModel.submitChanges = function (p1, p2) {
			return p1.success({
				"__batchResponses" : [ {
					"message": "Implicit dummy error",
					"response": {
						"statusCode": 400,
						"statusText": "Entity not found on database"
					}

				} ]
			}, {
				"mockresponse": true
			});
		};
		oModel.getKey = function () {
			return "/MockKey(1)";
		};
		oModel.getContext = function () {
			return {
				"path": "/MockKey(1)",
				getObject: function () {
					return {
						IsActiveEntity: true,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};

		oController = new BaseController(oModel);

		oController.triggerSubmitChanges().then(function (oResult) {
			assert.ok(false);
			oController.destroy();
			done();
		}, function (oResult) {
			assert.ok(oResult.response);
			oController.destroy();
			done();
		});
	});

	QUnit.test("hasClientMessages returning messages", function (assert) {
		var done = assert.async();
		var fGetData = sap.ui.getCore().getMessageManager().getMessageModel().getData;
		sap.ui.getCore().getMessageManager().getMessageModel().getData = function () {
			return [{
				processor: {
					getMetadata: function () {
						return {
							_sClassName: "sap.ui.core.message.ControlMessageProcessor"
						};
					}
				}
			}];
		};

		var oBaseController = new BaseController(this.oModel);
		oBaseController.hasClientMessages().then(function (oResult) {
			assert.ok(false);
			oBaseController.destroy();
			done();
		}, function (oResult) {
			assert.ok(true);
			oBaseController.destroy();
			done();
		});

		sap.ui.getCore().getMessageManager().getMessageModel().getData = fGetData;
	});

	QUnit.test("hasClientMessages returning no messages", function (assert) {
		var oPromise, oBaseController;

		oBaseController = new BaseController(this.oModel);
		oPromise = oBaseController.hasClientMessages();
		assert.ok(!oPromise);
		oBaseController.destroy();
	});

	QUnit.test("_normalizeError shall return null", function (assert) {
		var oBaseController;

		oBaseController = new BaseController(this.oModel);
		assert.ok(!oBaseController._normalizeError());
		oBaseController.destroy();
	});

	QUnit.test("_returnPromiseAll", function (assert) {
		var done = assert.async();
		var oBaseController, aPromises;

		oBaseController = new BaseController(this.oModel);
		aPromises = [
			Promise.resolve("Promise1"),
			Promise.resolve("Promise2")
		];
		oBaseController._returnPromiseAll(aPromises).then(function (oResult) {
			assert.equal(oResult, "Promise1");
			oBaseController.destroy();
			done();
		});
	});

	QUnit.test("_remove", function (assert) {
		var done = assert.async();
		var oController, oModel, bSubmit = false, mParams = {
			"batchGroupId": "batchGroupId",
			"changeSetId": "changeSetId"
		};

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.setDeferredBatchGroups = function () { };
		oModel.setChangeBatchGroups = function () { };
		oModel.hasPendingChanges = sinon.stub().returns(true);
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns("mockType"),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"ActivationAction": {
						"String": "/dummyFunc"
					}
				}
			}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			}),
			getODataFunctionImport: sinon.stub().returns({
				"entitySet": "dummySet",
				"parameter": []
			})
		});

		oModel.remove = function (p1, p2) {
			bSubmit = true;
			return p2.success({
				"mockdata": true
			}, {
					"mockresponse": true
				});
		};

		oController = new BaseController(oModel);
		oController._remove("dummyPath", mParams).then(function (oResult) {
			assert.ok(oResult);
			assert.ok(bSubmit);
			oController.destroy();
			done();
		}, function (oResult) {
			assert.ok(false);
			oController.destroy();
			done();
		});
	});

	QUnit.test("_read", function (assert) {
		var done = assert.async();
		var oController, oModel, bSubmit = false, mParams = {
			"batchGroupId": "batchGroupId",
			"changeSetId": "changeSetId"
		};

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.setDeferredBatchGroups = function () { };
		oModel.setChangeBatchGroups = function () { };
		oModel.hasPendingChanges = sinon.stub().returns(true);
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns("mockType"),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"ActivationAction": {
						"String": "/dummyFunc"
					}
				}
			}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			}),
			getODataFunctionImport: sinon.stub().returns({
				"entitySet": "dummySet",
				"parameter": []
			})
		});

		oModel.read = function (p1, p2) {
			bSubmit = true;
			return p2.success({
				"mockdata": true
			}, {
					"mockresponse": true
				});
		};

		oController = new BaseController(oModel);
		oController._read("dummyPath", mParams).then(function (oResult) {
			assert.ok(oResult);
			assert.ok(bSubmit);
			oController.destroy();
			done();
		}, function (oResult) {
			assert.ok(false);
			oController.destroy();
			done();
		});
	});
	/*
		//
		// * Creates a binding context for the given path. If the data of the context is already available, it will not be fetched from the back-end,
		// * but the success call-back will be invoked.
		 *
		 * @param {string} sPath the path to the data that is retrieved
		 * @param {map} mParameters parameters to control the behavior of the request
		 * @returns {Promise} a <code>Promise</code> for asynchronous execution of the request
		 * @private

		BaseController.prototype._createBindingContext = function(sPath, mParameters) {
			var that = this;

			return new Promise(function(resolve, reject) {
				var mCallBacks, fCallBack;

				mCallBacks = that._getRequestCallBacks(resolve, reject);
				fCallBack = function(oResponse) {
					if (oResponse && oResponse.mParameters && oResponse.mParameters.data) {
						 mCallBacks.success({
							 responseData: oResponse.mParameters.data
						 });
					} else {
						mCallBacks.error(oResponse);
					}
				};
				that._oModel.createBindingContext(sPath, null, mParameters, fCallBack);
			});
		};
				QUnit.test("_createBindingContext shall succeed", function(assert) {
					var done = assert.async();
					var oController, oModel, bSubmit = false, mParams = {
						"batchGroupId" : "batchGroupId",
						"changeSetId": "changeSetId"
					};

					oModel = sinon.createStubInstance(sap.ui.model.odata.ODataModel);
					oModel.setDeferredBatchGroups = function() {};
					oModel.setChangeBatchGroups = function() {};
					oModel.hasPendingChanges = sinon.stub().returns(true);
					oModel.getMetaModel = sinon.stub().returns({
						getSemanticKeyProperties: sinon.stub().returns([]),
						getEntityType: sinon.stub().returns("mockType"),
						getODataEntitySet: sinon.stub().returns({
							entityType : "namespace.EntityTypeName"
						}),
						getODataEntityType: sinon.stub().returns({
							key: {
								propertyRef: []
							}
						})
					});

					oModel.createBindingContext = function(sPath, oContext, mParameters, fnCallBack) {
						bSubmit = true;
						fnCallBack({
							mParameters: {
								data: true
							}
						});
					};

					oController = new sap.ui.generic.app.transaction.BaseController(oModel);
					oController._createBindingContext("dummyPath", mParams).then(function(oResult) {
						assert.ok(oResult);
						assert.ok(bSubmit);
						oController.destroy();
						done();
					}, function(oResult) {
						assert.ok(false);
						oController.destroy();
						done();
					});
				});

				QUnit.test("_createBindingContext shall fail", function(assert) {
					var done = assert.async();
					var oController, oModel, bSubmit = false, mParams = {
						"batchGroupId" : "batchGroupId",
						"changeSetId": "changeSetId"
					};

					oModel = sinon.createStubInstance(sap.ui.model.odata.ODataModel);
					oModel.setDeferredBatchGroups = function() {};
					oModel.setChangeBatchGroups = function() {};
					oModel.hasPendingChanges = sinon.stub().returns(true);
					oModel.getMetaModel = sinon.stub().returns({
						getSemanticKeyProperties: sinon.stub().returns([]),
						getEntityType: sinon.stub().returns("mockType"),
						getODataEntitySet: sinon.stub().returns({
							entityType : "namespace.EntityTypeName"
						}),
						getODataEntityType: sinon.stub().returns({
							key: {
								propertyRef: []
							}
						})
					});

					oModel.createBindingContext = function(sPath, oContext, mParameters, fnCallBack) {
						bSubmit = true;
						fnCallBack();
					};

					oController = new sap.ui.generic.app.transaction.BaseController(oModel);
					oController._createBindingContext("dummyPath", mParams).then(function(oResult) {
						assert.ok(false);
						oController.destroy();
						done();
					}, function(oResult) {
						assert.ok(bSubmit);
						oController.destroy();
						done();
					});
				});
	*/
	/*
				QUnit.test("submitChanges", function(assert){
					var done = assert.async();
					var oController, oModel;
					oModel = sinon.createStubInstance(sap.ui.model.odata.ODataModel);
					oModel.submitChanges = sinon.stub().yieldsTo("success");
					oController = new sap.ui.generic.app.transaction.BaseController(oModel);

					oController.submitChanges({
						batchGroupId: "mockBG",
						eTag: "mockEtag"
					}).then(succeed, fail);

					oController.destroy();
				});

				QUnit.test("submitChanges shall fail", function(assert){
					stop();
					var oController, oModel;
					oModel = sinon.createStubInstance(sap.ui.model.odata.ODataModel);
					oModel.submitChanges = sinon.stub().yieldsTo("error");
					oController = new sap.ui.generic.app.transaction.BaseController(oModel);

					oController.submitChanges({
						batchGroupId: "mockBG",
						eTag: "mockEtag",
						forceSubmit: true
					}).then(fail, succeed);

					oController.destroy();
				});
	*/

	QUnit.test("attach and detach FatalError", function (assert) {
		var bFired = false, fFunc = function () {
			bFired = true;
		};

		this.oBaseController.attachFatalError(fFunc);

		this.oBaseController.fireEvent("fatalError");
		assert.equal(bFired, true);

		this.oBaseController.detachFatalError(fFunc);
		bFired = false;
		this.oBaseController.fireEvent("fatalError");
		assert.equal(bFired, false);
	});

	QUnit.test("_checkImplicitError shall throw an exception", function (assert) {
		var oResponse, bException = false;

		oResponse = {
			responseData: {
				__batchResponses: [{
					message: "HTTP request failed",
					response: {
						statusCode: "428",
						headers: {
							"Content-Type": "application/json",
							"Content-Length": "843",
							"DataServiceVersion": "1.0"
						},
						"body": "{\"error\":{\"code\":\"SY/530\",\"message\":{\"lang\":\"en\",\"value\":\"Preconditionfailed\"},\"innererror\":{\"transactionid\":\"5571506E779E6035E10000000A445279\",\"timestamp\":\"20150610125127.2178510\",\"Error_Resolution\":{\"SAP_Transaction\":\"Runtransaction/IWFND/ERROR_LOGonSAPNWGatewayhubsystemandsearchforentrieswiththetimestampaboveformoredetails\",\"SAP_Note\":\"SeeSAPNote1797736forerroranalysis(https: //service.sap.com/sap/support/notes/1797736)\",\"Batch_SAP_Note\":\"SeeSAPNote1869434fordetailsaboutworkingwith$batch(https: //service.sap.com/sap/support/notes/1869434)\"},\"errordetails\":[{\"code\":\"\",\"message\":\"Preconditionfailed\",\"propertyref\":\"\",\"severity\":\"error\",\"target\":\"\"},{\"code\":\"/IWBEP/CX_MGW_BUSI_EXCEPTION\",\"message\":\"BusinessErrorwithdetailsinTEAapplication\",\"propertyref\":\"\",\"severity\":\"error\",\"target\":\"\"}]}}}"
					}
				}]
			}
		};
		this.oBaseController._mCounts.requestSent = 1;
		this.oBaseController._mCounts.requestCompleted = 1;

		try {
			// sending the only batch response since _submitChanges method has logic to iterate the __batchResponses and call _checkImplicitError with single response
			this.oBaseController._checkImplicitError({ httpResponse : oResponse.responseData.__batchResponses[0], responseData : oResponse.responseData.__batchResponses[0].data } , {
				pendingChanges: true,
				forceSubmit: true
			});
		} catch (ex) {
			bException = true;
		}
		assert.ok(bException);
	});

	QUnit.test("_getActionRequestHeaders shall add an etag", function (assert) {
		var mParams = {
			functionImport: {
				"sap:action-for": "dummyAction"
			}
		};
		this.oBaseController._getActionRequestHeaders({}, {}, mParams);
		assert.equal(mParams.headers["If-Match"], "etag");
	});

	QUnit.test("Shall be destructible", function (assert) {
		this.oBaseController.destroy();
		assert.ok(this.oBaseController);
		assert.equal(this.oBaseController._oModel, null);
	});

	QUnit.module("sap.ui.generic.app.transaction.BaseController - tests with DraftEnabledMockserver", {});

	QUnit.test("triggerSubmitChanges with forceSubmit", function (assert) {
		var done = assert.async();
		var oController, oModel;

		initServer();
		oModel = initModel();
		oModel.setDeferredBatchGroups(["Changes"]);

		oModel.metadataLoaded().then(function(){
			oModel.create("/SalesOrder",
				{
					ActiveSalesOrderID: "MySalesOrder"
				},
				{
					batchGroupId: "Changes",
					changeSetId: "Changes",
					success: function() {},
					error: function() {}
				}
			);

			oController = new BaseController(oModel);

			var mParams = {
				context: {},
				forceSubmit: true,
				changeSetId: "Changes",
				batchGroupId: "Changes"
			};

			oController.triggerSubmitChanges(mParams).then(function (oResult) {
				assert.ok(oResult.data);
				oController.destroy();
				done();
			}, function (oResult) {
				assert.ok(false);
				oController.destroy();

			});

		});
	});
});