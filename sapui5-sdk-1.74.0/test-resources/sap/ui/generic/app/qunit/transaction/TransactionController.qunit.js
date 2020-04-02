/*global QUnit, sinon */
/*eslint no-unused-vars: 1 */
sap.ui.define([
	"sap/ui/model/odata/ODataMetaModel",
	"sap/ui/model/odata/ODataModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/generic/app/transaction/TransactionController",
	"sap/ui/core/util/MockServer"
], function(
	ODataMetaModel,
	ODataModelV1,
	ODataModelV2,
	TransactionController,
	MockServer
) {
	"use strict";
	
	var sServiceUri = "/SalesOrderSrv/";
	var sDataRootPath = "test-resources/sap/ui/generic/app/qunit/testdata/SalesOrder/";

	MockServer.config({ autoRespondAfter: 100 });
	var oMockServer = new MockServer({
		rootUri: sServiceUri
	});

	function initServer() {
		oMockServer.simulate("test-resources/sap/ui/generic/app/qunit/testdata/SalesOrder/metadata.xml", sDataRootPath);
		oMockServer.start();
	}

	function stopServer() {
		oMockServer.stop();
	}

	function initModel(mParameters) {
		return new ODataModelV2(sServiceUri, mParameters);
	}

	function removeSharedMetadata() {
		var sURI = sServiceUri.replace(/\/$/, "");
		if (ODataModelV2.mServiceData
			&& ODataModelV2.mServiceData[sURI]) {
			delete ODataModelV2.mServiceData[sURI].oMetadata;
		}
	}

	/*  TESTS */
	QUnit.module("sap.ui.generic.app.transaction.TransactionController w v2 Model", {
		beforeEach: function () {
			initServer();
		},
		afterEach: function () {
			this.oModel.destroy();
			this.oModel = undefined;
			removeSharedMetadata();
			stopServer();
		}
	});


	QUnit.test("deleteEntity with Context -> real Entity (no Draft)", function (assert) {
		var done = assert.async();
		var oModel = this.oModel = initModel();
		var oTransactionController = new TransactionController(oModel);
		var oContext;

		oModel.read("/ProductSet('AD-1000')", {
			success: function () {
				//Create a Binding Context
				oContext = oModel.createBindingContext("/ProductSet('AD-1000')");

				oTransactionController.deleteEntity(oContext, null).then(function (oResult) {
					assert.ok(oResult.context, "Context is there in oResult");
					assert.ok(oResult.response.statusCode == "204", "HTTP Result Code as expected");
					oModel.read("/ProductSet('AD-1000')", {
						success: function (data) {
							assert.ok(false, "Entity still can be read from model. Shouldn't be there.");
							oTransactionController.destroy();
							done();
						},
						error: function (err) {
							assert.ok(true, "Entity cannot be read from model anymore - as expected.");
							oTransactionController.destroy();
							done();
						}
					});
				}, function (oResponse) {
					assert.ok(false, "Error Handler of TransactionController called - deletion error.");
					oTransactionController.destroy();
					done();
				});
			},
			error: function () {
				assert.ok(false, "Error Handler of Model.read() called - reading entity failed.");
				done();
			}
		});
	});

	QUnit.test("deleteEntity with Path -> real Entity (no Draft)", function (assert) {
		var done = assert.async();
		var oModel = this.oModel = initModel();
		var oTransactionController = new TransactionController(oModel);
		var sPath = "/ProductSet('AD-1000')";

		oTransactionController.deleteEntity(sPath, null).then(function (oResult) {
			assert.ok(oResult.context, "Context is there in oResult");
			assert.ok(oResult.response.statusCode == "204", "HTTP Result Code as expected");
			oModel.read("/ProductSet('AD-1000')", {
				success: function (data) {
					assert.ok(false, "Entity still can be read from model. Shouldn't be there.");
					oTransactionController.destroy();
					done();
				},
				error: function (err) {
					assert.ok(true, "Entity cannot be read from model anymore - as expected.");
					oTransactionController.destroy();
					done();
				}
			});
		}, function (oResponse) {
			assert.ok(false, "Error Handler of TransactionController called - deletion error.");
			oTransactionController.destroy();
			done();
		});
	});


	QUnit.test("deleteEntities with Contexts -> real Entities (no Draft)", function (assert) {
		var done = assert.async();
		var oModel = this.oModel = initModel();
		var oTransactionController = new TransactionController(oModel);
		var nDoneCounter = 0;
		var nReadCounter = 0;
		var aContexts = [];

		var fnDoneCountUp = function () {
			nDoneCounter++;
			if (nDoneCounter >= aContexts.length) {
				done();
			}
		};

		var fnReadData = function () {
			oModel.read("/ProductSet('HT-1002')", {
				success: fnGoWest
			});
			oModel.read("/ProductSet('HT-1010')", {
				success: fnGoWest
			});
			oModel.read("/ProductSet('HT-1020')", {
				success: fnGoWest
			});
		};

		var fnGoWest = function () {
			nReadCounter++;
			if (nReadCounter >= 3) {
				aContexts.push(oModel.createBindingContext("/ProductSet('HT-1002')"));
				aContexts.push(oModel.createBindingContext("/ProductSet('HT-1010')"));
				aContexts.push(oModel.createBindingContext("/ProductSet('HT-1020')"));
				//GO GO GO
				fnTestLogic();
			}
		};

		var fnTestLogic = function () {
			oTransactionController.deleteEntities(aContexts, null).then(function (aResults) {
				assert.ok(aResults[0].context && aResults[1].context && aResults[2].context, "Contexts are there in aResults");
				assert.ok(aResults[0].response.statusCode == "204"
					&& aResults[1].response.statusCode == "204"
					&& aResults[2].response.statusCode == "204", "HTTP Result Codes as expected");
				oModel.read("/ProductSet('HT-1002')", {
					success: function (data) {
						assert.ok(false, "Entity HT-1002 still can be read from model. Shouldn't be there.");
						oTransactionController.destroy();
						fnDoneCountUp();
					},
					error: function (err) {
						assert.ok(true, "Entity HT-1002 cannot be read from model anymore - as expected.");
						oTransactionController.destroy();
						fnDoneCountUp();
					}
				});
				oModel.read("/ProductSet('HT-1010')", {
					success: function (data) {
						assert.ok(false, "Entity HT-1010 still can be read from model. Shouldn't be there.");
						oTransactionController.destroy();
						fnDoneCountUp();
					},
					error: function (err) {
						assert.ok(true, "Entity HT-1010 cannot be read from model anymore - as expected.");
						oTransactionController.destroy();
						fnDoneCountUp();
					}
				});
				oModel.read("/ProductSet('HT-1020')", {
					success: function (data) {
						assert.ok(false, "Entity HT-1020 still can be read from model. Shouldn't be there.");
						oTransactionController.destroy();
						fnDoneCountUp();
					},
					error: function (err) {
						assert.ok(true, "Entity HT-1020 cannot be read from model anymore - as expected.");
						oTransactionController.destroy();
						fnDoneCountUp();
					}
				});
			}, function (oResponse) {
				assert.ok(false, "Error Handler of TransactionController called - deletion error.");
				oTransactionController.destroy();
				done();
			});
		};
		oModel.metadataLoaded().then(fnReadData);
	});


	QUnit.test("deleteEntities with Paths -> real Entities (no Draft)", function (assert) {
		var done = assert.async();
		var oModel = this.oModel = initModel();
		var oTransactionController = new TransactionController(oModel);
		var nDoneCounter = 0;
		var aPaths = [];

		var fnDoneCountUp = function () {
			nDoneCounter++;
			if (nDoneCounter >= aPaths.length) {
				done();
			}
		};

		aPaths.push("/ProductSet('HT-1002')");
		aPaths.push("/ProductSet('HT-1010')");
		aPaths.push("/ProductSet('HT-1020')");

		var fnTestLogic = function () {
			oTransactionController.deleteEntities(aPaths, null).then(function (aResults) {
				assert.ok(aResults[0].context && aResults[1].context && aResults[2].context, "Contexts are there in aResults");
				assert.ok(aResults[0].response.statusCode == "204"
					&& aResults[1].response.statusCode == "204"
					&& aResults[2].response.statusCode == "204", "HTTP Result Codes as expected");
				oModel.read("/ProductSet('HT-1002')", {
					success: function (data) {
						assert.ok(false, "Entity HT-1002 still can be read from model. Shouldn't be there.");
						oTransactionController.destroy();
						fnDoneCountUp();
					},
					error: function (err) {
						assert.ok(true, "Entity HT-1002 cannot be read from model anymore - as expected.");
						oTransactionController.destroy();
						fnDoneCountUp();
					}
				});
				oModel.read("/ProductSet('HT-1010')", {
					success: function (data) {
						assert.ok(false, "Entity HT-1010 still can be read from model. Shouldn't be there.");
						oTransactionController.destroy();
						fnDoneCountUp();
					},
					error: function (err) {
						assert.ok(true, "Entity HT-1010 cannot be read from model anymore - as expected.");
						oTransactionController.destroy();
						fnDoneCountUp();
					}
				});
				oModel.read("/ProductSet('HT-1020')", {
					success: function (data) {
						assert.ok(false, "Entity HT-1020 still can be read from model. Shouldn't be there.");
						oTransactionController.destroy();
						fnDoneCountUp();
					},
					error: function (err) {
						assert.ok(true, "Entity HT-1020 cannot be read from model anymore - as expected.");
						oTransactionController.destroy();
						fnDoneCountUp();
					}
				});
			}, function (oResponse) {
				assert.ok(false, "Error Handler of TransactionController called - deletion error.");
				oTransactionController.destroy();
				done();
			});
		};
		oModel.metadataLoaded().then(fnTestLogic);
	});

	QUnit.test("deleteEntities running into Error - 1 of 2 is failing", function (assert) {
		var done = assert.async();
		var oModel = this.oModel = initModel();
		var oTransactionController = new TransactionController(oModel);
		var nDoneCounter = 0;
		var aPaths = [];

		var fnDoneCountUp = function () {
			nDoneCounter++;
			if (nDoneCounter >= aPaths.length) {
				done();
			}
		};

		aPaths.push("/ProductSet('XX-1002')");
		aPaths.push("/ProductSet('XX-1000')");

		var fnTestLogic = function () {
			oTransactionController.deleteEntities(aPaths, null).then(function (aResults) {
				assert.ok(false);
				oTransactionController.destroy();
				done();
			}, function (oResponse) {
				assert.ok(true);
				oTransactionController.destroy();
				done();
			});
		};
		oModel.metadataLoaded().then(fnTestLogic);
	});


	QUnit.test("deleteEntity with wrong Path -> real Entity (no Draft)", function (assert) {
		var done = assert.async();
		var oModel = this.oModel = initModel();
		var oTransactionController = new TransactionController(oModel);
		var sPath = "/ProductSet('AD-10004711')";

		oTransactionController.deleteEntity(sPath, null).then(function (oResult) {
			assert.ok(false, "SuccessHandler call is not expected; deleteEntity should fail.");
			done();
		}, function (oResponse) {
			assert.ok(true, "Error Handler of TransactionController called - as expected.");
			//assert.ok(oResult.response.statusCode == "204", "HTTP Result Code as expected");
			oTransactionController.destroy();
			done();
		});

	});

	QUnit.module("sap.ui.generic.app.transaction.TransactionController", {
		beforeEach: function () {
			this.oModel = sinon.createStubInstance(ODataModelV1);
			this.oModel.getMetaModel = sinon.stub().returns({});
			this.oModel.setDeferredGroups = function () { };
			this.oModel.setChangeGroups = function () { };
			this.oTransactionController = new TransactionController(this.oModel);
		},
		afterEach: function () {
			this.oTransactionController.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function (assert) {
		assert.ok(this.oTransactionController);
	});

	QUnit.test("resetChanges shall invoke odata model resetChanges", function (assert) {
		var bReset = false;

		this.oModel.resetChanges = function () {
			bReset = true;
		};
		this.oTransactionController.resetChanges(["/MockSet(1)"]);
		assert.ok(bReset);
	});

	QUnit.test("setBatchStrategy", function (assert) {
		var oTransactionController, oModel, iCount = 0;

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.getMetaModel = sinon.stub().returns({});
		oModel.setDeferredGroups = function () { };
		oModel.getChangeGroups = function () {
			return {
				"*": {
					batchGroupId: "Changes",
					changeSetId: "Changes",
					single: false
				}
			};
		};
		oModel.setChangeGroups = function (oGroups) {
			iCount++;

			if (iCount === 2) {
				assert.ok(oGroups["*"].single);
			}
		};

		oTransactionController = new TransactionController(oModel);
		oTransactionController.setBatchStrategy(true);
		oTransactionController.destroy();
	});

	QUnit.test("editEntity on active document", function (assert) {
		var done = assert.async();
		var oTransactionController, oModel, oContext;

		oModel = sinon.createStubInstance(ODataModelV2);
		oModel.setDeferredGroups = function () { };
		oModel.hasPendingChanges = sinon.stub().returns(false);
		oModel.setChangeGroups = function () { };
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				name: "MockSet",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"PreparationAction": {
						"String": true
					},
					"EditAction": {
						"String": "/MockEditAction"
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
		oModel.bUseBatch = true;
		oModel.callFunction = function (p1, p2) {
			this.mDeferredRequests = {
				"Changes": {
					"requests": [],
					"changes":[]
				}
			};
			p2.success({
				"mockdata": true
			}, {
					"mockresponse": true
				});
		};
		oModel.submitChanges = function (p1, p2) {
			return p1.success({
				"mockdata": true
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
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};

		oTransactionController = new TransactionController(oModel);
		oContext = {
			name: "mockContext",
			getObject: function () {
				return {
					IsActiveEntity: true
				};
			},
			getPath: function () {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};

		oTransactionController.editEntity(oContext).then(function (oResult) {
			assert.ok(oResult.context);
			oTransactionController.destroy();
			done();
		}, function (oResult) {
			assert.ok(false);
			oTransactionController.destroy();
			done();
		});
	});

	QUnit.test("editEntity shall fail", function (assert) {
		var done = assert.async();
		var oTransactionController, oModel, oContext, bAction = false, bSubmit = false;

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.setDeferredGroups = function () { };
		oModel.setChangeGroups = function () { };
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				name: "MockSet",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"EditAction": {
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
		oModel.callFunction = function (p1, p2) {
			bAction = true;
			return p2.error({
				"message": true
			});
		};
		oModel.submitChanges = function (p1, p2) {
			bSubmit = true;
			return p2.error({
				"message": true
			});
		};
		oTransactionController = new TransactionController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function () {
				return {
					IsActiveEntity: true
				};
			},
			getPath: function () {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};

		oTransactionController.editEntity(oContext).then(function (oResult) {
			assert.ok(false);
			oTransactionController.destroy();
			done();
		}, function (oResult) {
			assert.ok(oResult.response.message);
			oTransactionController.destroy();
			done();
		});
	});

	QUnit.test("editEntity on active document", function (assert) {
		var done = assert.async();
		var oTransactionController, oModel, oContext;

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.setDeferredGroups = function () { };
		oModel.setChangeGroups = function () { };
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			name: "MockKey",
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				name: "MockKey",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"EditAction": {
						"String": "/MockEditAction"
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
		oModel.bUseBatch = true;
		oModel.callFunction = function (p1, p2) {
			this.mDeferredRequests = {
				"Changes": {
					"requests": [],
					"changes":[]
				}
			};
			p2.success({
				"mockdata": true
			}, {
					"mockresponse": true
				});
		};
		oModel.submitChanges = function (p1, p2) {
			return p1.success({
				"mockdata": true
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
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};

		oTransactionController = new TransactionController(oModel);
		oContext = {
			name: "mockContext",
			getObject: function () {
				return {
					IsActiveEntity: true
				};
			},
			getPath: function () {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};

		oTransactionController.editEntity(oContext).then(function (oResult) {
			assert.ok(oResult.context);
			oTransactionController.destroy();
			done();
		}, function (oResult) {
			assert.ok(false);
			oTransactionController.destroy();
			done();
		});
	});

	QUnit.test("editEntity on non-active document", function (assert) {
		var done = assert.async();
		var oTransactionController, oModel, oContext;

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.setDeferredGroups = function () { };
		oModel.setChangeGroups = function () { };
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				name: "MockSet",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"EditAction": {
						"String": "/MockEditAction"
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
		oModel.callFunction = function (p1, p2) {
			p2.success({
				"mockdata": true
			}, {
					"mockresponse": true
				});
		};
		oModel.submitChanges = function (p1, p2) {
			return p1.success({
				"mockdata": true
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
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};

		oTransactionController = new TransactionController(oModel);
		oContext = {
			name: "mockContext",
			getObject: function () {
				return {
					IsActiveEntity: false
				};
			},
			getPath: function () {
				return "/MockSet(1)";
			},
			getModel: function () {
				return oModel;
			}
		};

		oTransactionController.editEntity(oContext).then(function (oResult) {
			assert.ok(oResult.context);
			oTransactionController.destroy();
			done();
		}, function (oResult) {
			assert.ok(false);
			oTransactionController.destroy();
			done();
		});
	});

	var prepareModelForTestDeleteEntity = function () {
		window._bRemove = false;
		window._bSubmit = false;
		var oModel;
		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.bUseBatch = true;
		oModel.setDeferredGroups = function () { };
		oModel.setChangeGroups = function () { };
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"PreparationAction": {
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
			this.mDeferredRequests = {
				"Changes": {
					"requests": [],
					"changes": {"Changes":[{request:{"Foo":"Bar"}}]}
				}
			};
			window._bRemove = true;
			return p2.success({
				"mockresponse": true
			});
		};
		oModel.submitChanges = function (p1, p2) {
			window._bSubmit = true;
			return p1.success({
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
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};

		return oModel;
	};

	QUnit.test("deleteEntity with Context", function (assert) {
		var done = assert.async();
		var oTransactionController, oContext;

		var oModel = prepareModelForTestDeleteEntity();

		oTransactionController = new TransactionController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function () {
				return {
					IsActiveEntity: true
				};
			},
			getPath: function () {
				return "/MockSet(1)";
			}
		};

		oTransactionController.deleteEntity(oContext, null).then(function (oResult) {
			assert.ok(oResult.context);
			assert.ok(oResult.data);
			assert.ok(window._bSubmit);
			assert.ok(window._bRemove);
			oTransactionController.destroy();
			done();
		}, function (oResponse) {
			assert.ok(false);
			oTransactionController.destroy();
			done();
		});
	});

	QUnit.test("deleteEntity with Path", function (assert) {
		var done = assert.async();
		var oTransactionController, oContext;

		var oModel = prepareModelForTestDeleteEntity();

		oTransactionController = new TransactionController(oModel);

		var path = "/MockSet(1)";

		oTransactionController.deleteEntity(path, null).then(function (oResult) {
			assert.ok(oResult.context);
			assert.ok(oResult.data);
			assert.ok(window._bSubmit);
			assert.ok(window._bRemove);
			oTransactionController.destroy();
			done();
		}, function (oResponse) {
			assert.ok(false);
			oTransactionController.destroy();
			done();
		});
	});

	QUnit.test("deleteEntity shall fail", function (assert) {
		var done = assert.async();
		var oTransactionController, oModel, oContext, bRemove = false, bSubmit = false;

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.setDeferredGroups = function () { };
		oModel.setChangeGroups = function () { };
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"PreparationAction": {
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
			bRemove = true;
			return p2.error({
				"message": true
			});
		};
		oModel.submitChanges = function (p1, p2) {
			bSubmit = true;
			return p1.error({
				"message": true
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
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};

		oTransactionController = new TransactionController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function () {
				return {
					IsActiveEntity: true
				};
			},
			getPath: function () {
				return "/MockSet(1)";
			}
		};

		oTransactionController.deleteEntity(oContext, null).then(function (oResult) {
			assert.ok(false);
			oTransactionController.destroy();
			done();
		}, function (oResponse) {
			assert.ok(oResponse.response.message);
			oTransactionController.destroy();
			done();
		});
	});

	QUnit.test("invokeAction", function (assert) {
		var done = assert.async();
		var oTransactionController, oModel, oContext, bSubmit = false;

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				name: "MockSet",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"PreparationAction": {
						"String": true
					},
					"EditAction": {
						"String": "/MockEditAction"
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
		oModel.bUseBatch = true;
		oModel.setDeferredGroups = function () { };
		oModel.setChangeGroups = function () { };
		oModel.createEntry = function (p1, p2) { };
		oModel.callFunction = function (p1, p2) {
			this.mDeferredRequests = {
				"Changes": {
					"requests": [],
					"changes": {"Changes":[{request:{"Foo":"Bar"}}]}
				}
			};
			p2.success({
				"mockdata": true
			});
		};
		oModel.submitChanges = function (p1, p2) {
			bSubmit = true;
			return p1.success({
				"mockdata": true
			}, {
					"mockresponse": true
				});
		};
		oModel.createBindingContext = function (p1, p2, p3, p4) {
			return p4({
				"path": "/MockKey(1)"
			});
		};
		oModel.createKey = function () {
			return {};
		};
		oModel.getKey = function () {
			return "/MockKey(1)";
		};
		oModel.getContext = function () {
			return {
				"path": "/MockKey(1)",
				getObject: function () {
					return {
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};
		oTransactionController = new TransactionController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function () {
				return {};
			},
			getPath: function () {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};

		oTransactionController.invokeAction("/MockEditAction", oContext, { urlParameters: {} }).then(function (oResult) {
			assert.ok(oResult.context);
			assert.ok(oResult.data);
			assert.ok(bSubmit);
			oTransactionController.destroy();
			done();
		}, function (oResult) {
			assert.ok(false);
			oTransactionController.destroy();
			done();
		});
	});

	QUnit.test("invokeAction fails", function (assert) {
		var done = assert.async();
		var oTransactionController, oModel, oContext, bSubmit = false;

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				name: "MockKey",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"PreparationAction": {
						"String": true
					},
					"EditAction": {
						"String": "/MockEditAction"
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
		oModel.bUseBatch = true;
		oModel.setDeferredGroups = function () { };
		oModel.setChangeGroups = function () { };
		oModel.createEntry = function (p1, p2) { };
		oModel.callFunction = function (p1, p2) {
			this.mDeferredRequests = {
				"Changes": {
					"requests": [],
					"changes": {"Changes":[{request:{"Foo":"Bar"}}]}
				}
			};
			p2.error({
				"message": "MockError",
				"mockdata": true
			});
		};
		oModel.submitChanges = function (p1, p2) {
			bSubmit = true;
			return p1.success({
				"mockdata": true
			}, {
					"mockresponse": true
				});
		};
		oModel.createBindingContext = function (p1, p2, p3, p4) {
			return p4({
				"path": "/MockKey(1)"
			});
		};
		oModel.createKey = function () {
			return {};
		};
		oModel.getKey = function () {
			return "/MockKey(1)";
		};
		oModel.getContext = function () {
			return {
				"path": "/MockKey(1)",
				getObject: function () {
					return {
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};
		oTransactionController = new TransactionController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function () {
				return {};
			},
			getPath: function () {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};

		oTransactionController.invokeAction("/MockEditAction", oContext, { urlParameters: {} }).then(function (oResult) {
			assert.ok(false);
			oTransactionController.destroy();
			done();
		}, function (oResult) {
			assert.ok(oResult.response);
			assert.ok(bSubmit);
			oTransactionController.destroy();
			done();
		});
	});

	//TODO check why this is removed (temporarily)
	/*
	QUnit.test("propertyChanged shall trigger saveAndPrepareDraft", function(assert) {
		var done = assert.async();
		var oTransactionController, oModel, oContext, bFunction = false, bSubmit = false, bRefresh;

		oModel = sinon.createStubInstance(sap.ui.model.odata.ODataModelV1);
		oModel.setDeferredGroups = function() {};
		oModel.setChangeGroups = function() {};
		oModel.getMetaModel = sinon.stub().returns({
			getEntityType: sinon.stub().returns("mockType"),
			getODataEntitySet: sinon.stub().returns({
				entityType : "namespace.EntityTypeName",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"ActivationAction": {
						"String": "/dummyFunc"
					},
					"PreparationAction": {
						"String": "/dummyFunc"
					}
				},
				"com.sap.vocabularies.Common.v1.SideEffects#" : {
					"SourceProperties" : [
						{
							"PropertyPath": "mockProperty"
						}
					]
				},
				"com.sap.vocabularies.Common.v1.UpdateOnChange": [{
					"PropertyPath": "mockProperty"
				}]
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
		oModel.callFunction = function(p1, p2) {
			this.mDeferredRequests = {
				"Changes": {
					"requests": [{}]
				}
			};
			bFunction = true;
			return p2.success({
				"mockresponse": true
			});
		};
		oModel.submitChanges = function(p1, p2) {
			bSubmit = true;
			return p1.success({
				"mockresponse": true
			});
		};

		oModel.getKey = function() {
			return "/MockKey(1)";
		};
		oModel.getContext = function() {
			return {
				"path": "/MockKey(1)",
				getObject: function() {
					return {
						IsActiveEntity: true,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};
		oContext = {
			getBoundContext: function() {
				return {
					getPath: function() {
						return "/MockPath(1)";
					},
					getObject: function() {
						return null;
					}
				};
			},
			refresh: function() {
				bRefresh = true;
			}
		};

		oTransactionController = new TransactionController(oModel);
		oTransactionController.propertyChanged("mockEntitySet", "mockProperty", oContext).then(function(oResult) {
			oTransactionController.destroy();
			done();
		}, function(oResult) {
			assert.ok(bFunction);
			assert.ok(bSubmit);
			assert.ok(bRefresh);
			oTransactionController.destroy();
			done();
		});
	}); */

	QUnit.test("propertyChanged shall trigger submitChanges (1)", function (assert) {
		var done = assert.async();
		var oTransactionController, oModel, oContext, bFunction = false, bSubmit = false, bRefresh;

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.setDeferredGroups = function () { };
		oModel.setChangeGroups = function () { };
		oModel.hasPendingChanges = sinon.stub().returns(true);
		oModel.getMetaModel = sinon.stub().returns({
			getEntityType: sinon.stub().returns("mockType"),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				name:"MockKey",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"ActivationAction": {
						"String": "/dummyFunc"
					}
				},
				"com.sap.vocabularies.Common.v1.UpdateOnChange": [{
					"PropertyPath": "mockProperty"
				}]
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
		oModel.bUseBatch = true;
		oModel.callFunction = function (p1, p2) {
			bFunction = true;
			return p2.success({
				"mockresponse": true
			});
		};
		oModel.submitChanges = function (p1, p2) {
			bSubmit = true;
			return p1.success({
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
		oContext = {
			getBoundContext: function () {
				return {
					getPath: function () {
						return "/MockPath(1)";
					},
					getObject: function () {
						return null;
					},

					getModel: function() {
						return oModel;
					}
				};
			},
			refresh: function () {
				bRefresh = true;
			},
			getModel: function() {
				return oModel;
			}
		};

		oTransactionController = new TransactionController(oModel);
		oTransactionController.propertyChanged("mockEntitySet", "mockProperty", oContext).then(function (oResult) {
			assert.ok(!bFunction);
			assert.ok(bSubmit);
			assert.ok(!bRefresh);
			oTransactionController.destroy();
			done();
		}, function (oResult) {
			oTransactionController.destroy();
			done();
		});
	});

	QUnit.test("propertyChanged shall trigger submitChanges (2)", function (assert) {
		var done = assert.async();
		var oTransactionController, oModel, oContext, bFunction = false, bSubmit = false, bRefresh;

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.setDeferredGroups = function () { };
		oModel.setChangeGroups = function () { };
		oModel.hasPendingChanges = sinon.stub().returns(true);
		oModel.getMetaModel = sinon.stub().returns({
			getEntityType: sinon.stub().returns("mockType"),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"ActivationAction": {
						"String": "/dummyFunc"
					}
				},
				"com.sap.vocabularies.Common.v1.UpdateOnChange": [{
					"PropertyPath": "mockProperty1"
				}]
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
		oModel.bUseBatch = true;
		oModel.callFunction = function (p1, p2) {
			bFunction = true;
			return p2.success({
				"mockresponse": true
			});
		};
		oModel.submitChanges = function (p1, p2) {
			bSubmit = true;
			return p1.success({
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
		oContext = {
			getBoundContext: function () {
				return {
					getPath: function () {
						return "/MockPath(1)";
					},
					getObject: function () {
						return null;
					}
				};
			},
			refresh: function () {
				bRefresh = true;
			}
		};

		oTransactionController = new TransactionController(oModel);
		oTransactionController.propertyChanged("mockEntitySet", "mockProperty", oContext).then(function (oResult) {
			assert.ok(!bFunction);
			assert.ok(bSubmit);
			assert.ok(!bRefresh);
			oTransactionController.destroy();
			done();
		}, function (oResult) {
			oTransactionController.destroy();
			done();
		});
	});

	QUnit.test("propertyChanged shall trigger submitChanges (3)", function (assert) {
		var done = assert.async();
		var oTransactionController, oModel, oContext, bSubmit = false, bRefresh;

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.setDeferredGroups = function () { };
		oModel.setChangeGroups = function () { };
		oModel.hasPendingChanges = sinon.stub().returns(true);
		oModel.getMetaModel = sinon.stub().returns({
			getEntityType: sinon.stub().returns("mockType"),
			getODataEntitySet: sinon.stub().returns({
				entityType: "namespace.EntityTypeName",
				name: "MockKey",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"ActivationAction": {
						"String": "/dummyFunc"
					}
				},
				"com.sap.vocabularies.Common.v1.SideEffects#": {
					"SourceProperties": [
						{
							"PropertyPath": "mockProperty"
						}
					]
				},
				"com.sap.vocabularies.Common.v1.UpdateOnChange": [{
					"PropertyPath": "mockProperty"
				}]
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
		oModel.bUseBatch = true;
		oModel.submitChanges = function (p1, p2) {
			bSubmit = true;
			return p1.success({
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
		oContext = {
			getBoundContext: function () {
				return {
					getPath: function () {
						return "/MockPath(1)";
					},
					getObject: function () {
						return null;
					},
					getModel: function() {
						return oModel;
					}
				};
			},
			refresh: function () {
				bRefresh = true;
			}
		};

		oTransactionController = new TransactionController(oModel);
		oTransactionController.propertyChanged("mockEntitySet", "mockProperty", oContext).then(function (oResult) {
			assert.ok(bSubmit);
			oTransactionController.destroy();
			done();
		}, function (oResult) {
			assert.ok(false);
			oTransactionController.destroy();
			done();
		});
	});

	QUnit.test("Shall be destructible", function (assert) {
		this.oTransactionController.destroy();
		assert.ok(this.oTransactionController);
		assert.equal(this.oTransactionController._oModel, null);
	});
});