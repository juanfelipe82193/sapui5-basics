/*global QUnit, sinon */
/*eslint no-unused-vars: 1 */
sap.ui.define([
	'sap/ui/model/odata/ODataMetaModel',
	'sap/ui/model/odata/ODataModel',
	'sap/ui/generic/app/transaction/DraftController'
], function(ODataMetaModel, ODataModel, DraftController){
	"use strict";

	QUnit.module("sap.ui.generic.app.transaction.DraftController", {
		beforeEach: function() {
			this.oModel = sinon.createStubInstance(ODataModel);
			this.oDraftController = new DraftController(this.oModel);
		},
		afterEach: function() {
			this.oDraftController.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oDraftController);
	});

	QUnit.test("getDraftContext", function(assert) {
		assert.ok(this.oDraftController.getDraftContext());
	});

	QUnit.test("hasActiveEntity", function(assert) {
		assert.ok(!this.oDraftController.hasActiveEntity({
			getObject: function() {
				return {
					IsActiveEntity: false
				};
			}
		}));
	});

	QUnit.test("isActiveEntity for draft enabled entity", function(assert) {
		var oDraftController, oModel, oContext;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					entityType : "namespace.EntityTypeName",
					name: "Dummy",
					"com.sap.vocabularies.Common.v1.DraftRoot": true
				})
			};
		};

		oContext = {
				getPath: function() {
					return "/Dummy(123)";
				},
				getObject: function() {
					return {
						IsActiveEntity: true
					};
				},
				getModel: function() {
					return oModel;
				}
			};

		oDraftController = new DraftController(oModel);
		assert.ok(oDraftController.isActiveEntity(oContext));
		oDraftController.destroy();
	});

	QUnit.test("isActiveEntity for not draft enabled entity", function(assert) {
		var oDraftController, oModel, oContext;


		oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					entityType : "namespace.EntityTypeName",
					name: "Dummy"
				})
			};
		};

		oContext = {
			getPath: function() {
				return "/Dummy(123)";
			},
			getObject: function() {
				return {
					IsActiveEntity: true
				};
			},
			getModel: function() {
				return oModel;
			}
		};

		oDraftController = new DraftController(oModel);
		assert.ok(oDraftController.isActiveEntity(oContext));
		oDraftController.destroy();
	});

	QUnit.test("prepareDraft", function(assert) {
		var done = assert.async();
		var oDraftController, oModel, oContext, mParams;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					entityType : "namespace.EntityTypeName",
					name: "MockSet",
					"com.sap.vocabularies.Common.v1.DraftNode": {
						"PreparationAction": {
							"String": "PreparationAction"
						}
					}
				}),
				getODataFunctionImport: function() {
					return { parameter: {}};
				},
				getODataEntityType: function() {
					return { key: {
						propertyRef: []
					}};
				}
			};
		};
		oModel.callFunction = function(p1, p2) {
			return p2.success({
				"mockresponse": true
			});
		};
		oModel.getObject = function () {
			return {
				IsActiveEntity: false
			};
		};

		oDraftController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {
					IsActiveEntity: false
				};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};
		mParams = {
			param: "mockVal"
		};
		oDraftController.prepareDraft(oContext, mParams).then(function(oResponse) {
			assert.ok(oResponse);
			oDraftController.destroy();
			done();
		}, function(oResult) {
			assert.ok(false);
			oDraftController.destroy();
			done();
		});
	});

	QUnit.test("prepareDraft shall fail", function(assert) {
		var done = assert.async();
		var oDraftController, oModel, oContext, mParams;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					entityType : "namespace.EntityTypeName",
					name: "MockSet",
					"com.sap.vocabularies.Common.v1.DraftNode": {
						"PreparationAction": {
							"String": "PreparationAction"
						}
					}
				}),
				getODataFunctionImport: function() {
					return { parameter: {}};
				},
				getODataEntityType: function() {
					return { key: {
						propertyRef: []
					}};
				}
			};
		};
		oModel.callFunction = function(p1, p2) {
			return p2.error({
				"message": true
			});
		};
		oModel.getObject = function () {
			return {
				IsActiveEntity: false
			};
		};

		oDraftController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {
					IsActiveEntity: false
				};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function () {
				return oModel;
			}
		};
		mParams = {
			param: "mockVal"
		};
		oDraftController.prepareDraft(oContext, mParams).then(function(oResponse) {
			assert.ok(false);
			oDraftController.destroy();
			done();
		}, function(oResult) {
			assert.ok(oResult.message);
			oDraftController.destroy();
			done();
		});
	});

	QUnit.test("activateDraft", function(assert) {
		var done = assert.async();
		var oDraftController, oModel, oContext, mParams;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					entityType : "namespace.EntityTypeName",
					name: "MockSet",
					"com.sap.vocabularies.Common.v1.DraftNode": {
						"ActivationAction": {
							"String": "ActivationAction"
						},
						"PreparationAction": {
							"String": "PreparationAction"
						}
					}
				}),
				getODataFunctionImport: function() {
					return { parameter: {}};
				},
				getODataEntityType: function() {
					return { key: {
						propertyRef: []
					}};
				}
			};
		};
		oModel.callFunction = function(p1, p2) {
			return p2.success({
				"mockresponse": true
			});
		};

		oModel.getObject = function () {
			return {
				IsActiveEntity: false
			};
		};

		oDraftController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};
		var oPrepareParams = {
			param: "mockVal"
		};
		var oActivateParams = {
			param: "mockVal"
		};		
		oDraftController.activateDraft(oContext, oPrepareParams, oActivateParams).then(function(oResponse) {
			assert.ok(oResponse);
			oDraftController.destroy();
			done();
		}, function(oResult) {
			assert.ok(false);
			oDraftController.destroy();
			done();
		});
	});

	QUnit.test("activateDraft shall fail", function(assert) {
		var done = assert.async();
		var oDraftController, oModel, oContext, mParams;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					entityType : "namespace.EntityTypeName",
					name: "MockSet",
					"com.sap.vocabularies.Common.v1.DraftNode": {
						"ActivationAction": {
							"String": "ActivationAction"
						},
						"PreparationAction": {
							"String": "PreparationAction"
						}
					}
				}),
				getODataFunctionImport: function() {
					return { parameter: {}};
				},
				getODataEntityType: function() {
					return { key: {
						propertyRef: []
					}};
				}
			};
		};
		oModel.callFunction = function(p1, p2) {
			return p2.error({
				"message": true
			});
		};

		oModel.getObject = function () {
			return {
				IsActiveEntity: false
			};
		};

		oDraftController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};
		var oPrepareParams = {
			param: "mockVal"
		};
		var oActivateParams = {
			param: "mockVal"
		};	
		oDraftController.activateDraft(oContext, oPrepareParams, oActivateParams).then(function(oResponse) {
			assert.ok(false);
			oDraftController.destroy();
			done();
		}, function(oResult) {
			assert.ok(oResult.message);
			oDraftController.destroy();
			done();
		});
	});

	QUnit.test("editDraft", function(assert) {
		var done = assert.async();
		var oDraftController, oModel, oContext, mParams;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					entityType : "namespace.EntityTypeName",
					name: "MockSet",
					"com.sap.vocabularies.Common.v1.DraftNode": {
						"EditAction": {
							"String": "EditAction"
						}
					}
				}),
				getODataFunctionImport: function() {
					return { parameter: {}};
				},
				getODataEntityType: function() {
					return { key: {
						propertyRef: []
					}};
				}
			};
		};
		oModel.callFunction = function(p1, p2) {
			return p2.success({
				"mockresponse": true
			});
		};

		oDraftController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};
		mParams = {
			param: "mockVal"
		};
		oDraftController.editDraft(oContext, mParams).then(function(oResponse) {
			assert.ok(oResponse);
			oDraftController.destroy();
			done();
		}, function(oResult) {
			assert.ok(false);
			oDraftController.destroy();
			done();
		});
	});

	QUnit.test("editDraft shall fail", function(assert) {
		var done = assert.async();
		var oDraftController, oModel, oContext, mParams;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					entityType : "namespace.EntityTypeName",
					name: "MockSet",
					"com.sap.vocabularies.Common.v1.DraftNode": {
						"EditAction": {
							"String": "EditAction"
						}
					}
				}),
				getODataFunctionImport: function() {
					return { parameter: {}};
				},
				getODataEntityType: function() {
					return { key: {
						propertyRef: []
					}};
				}
			};
		};
		oModel.callFunction = function(p1, p2) {
			return p2.error({
				"message": true
			});
		};

		oDraftController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};
		mParams = {
			param: "mockVal"
		};
		oDraftController.editDraft(oContext, mParams).then(function(oResponse) {
			assert.ok(false);
			oDraftController.destroy();
			done();
		}, function(oResult) {
			assert.ok(oResult.message);
			oDraftController.destroy();
			done();
		});
	});

	QUnit.test("validateDraft", function(assert) {
		var done = assert.async();
		var oDraftController, oModel, oContext, mParams;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					entityType : "namespace.EntityTypeName",
					name: "MockSet",
					"com.sap.vocabularies.Common.v1.DraftNode": {
						"ValidationFunction": {
							"String": "ValidationFunction"
						}
					}
				}),
				getODataFunctionImport: function() {
					return { parameter: {}};
				},
				getODataEntityType: function() {
					return { key: {
						propertyRef: []
					}};
				}
			};
		};
		oModel.getObject = function () {
			return {
				IsActiveEntity: false
			};
		};

		oModel.callFunction = function(p1, p2) {
			return p2.success({
				"mockresponse": true
			});
		};

		oDraftController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {
					IsActiveEntity: false
				};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function(){
				return oModel;
			}
		};
		mParams = {
			param: "mockVal"
		};
		oDraftController.validateDraft(oContext, mParams).then(function(oResponse) {
			assert.ok(oResponse);
			oDraftController.destroy();
			done();
		}, function(oResult) {
			assert.ok(false);
			oDraftController.destroy();
			done();
		});
	});

	QUnit.test("validateDraft shall fail", function(assert) {
		var done = assert.async();
		var oDraftController, oModel, oContext, mParams;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					entityType : "namespace.EntityTypeName",
					name: "MockSet",
					"com.sap.vocabularies.Common.v1.DraftNode": {
						"ValidationFunction": {
							"String": "ValidationFunction"
						}
					}
				}),
				getODataFunctionImport: function() {
					return { parameter: {}};
				},
				getODataEntityType: function() {
					return { key: {
						propertyRef: []
					}};
				}
			};
		};
		oModel.callFunction = function(p1, p2) {
			return p2.error({
				"message": true
			});
		};
		oModel.getObject = function () {
			return {
				IsActiveEntity: false
			};
		};

		oDraftController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {
					IsActiveEntity: false
				};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};
		mParams = {
			param: "mockVal"
		};
		oDraftController.validateDraft(oContext, mParams).then(function(oResponse) {
			assert.ok(false);
			oDraftController.destroy();
			done();
		}, function(oResult) {
			assert.ok(oResult.message);
			oDraftController.destroy();
			done();
		});
	});

	QUnit.test("discardDraft when remove succeeds", function(assert) {
		var done = assert.async();
		var succeed = function(text) {
			assert.ok(true, text);
			done();
		};
		var fail = function(text) {
			assert.ok(false, text);
			done();
		};
		var oDraftController, oModel, oContext, mParams;
		oModel = sinon.createStubInstance(ODataModel);
		oModel.remove = sinon.stub().yieldsTo("success");
		oDraftController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {};
			},
			getPath: function() {
				return "mockPath";
			}
		};
		mParams = {
			param: "mockVal"
		};

		oDraftController.discardDraft(oContext, mParams).then(succeed, fail);
		oDraftController.destroy();
	});

	QUnit.test("discardDraft when remove fails", function(assert) {
		var done = assert.async();
		var succeed = function(text) {
			assert.ok(true, text);
			done();
		};
		var fail = function(text) {
			assert.ok(false, text);
			done();
		};
		var oDraftController, oModel, oContext, mParams;
		oModel = sinon.createStubInstance(ODataModel);
		oModel.remove = sinon.stub().yieldsTo("error");
		oDraftController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {};
			},
			getPath: function() {
				return "mockPath";
			}
		};
		mParams = {
			param: "mockVal"
		};

		oDraftController.discardDraft(oContext, mParams).then(fail, succeed);
		oDraftController.destroy();
	});

	QUnit.test("discardDraft throws an exception", function(assert) {
		var succeed = function(text) {
			assert.ok(true, text);
			//done();
		};
		var fail = function(text) {
			assert.ok(false, text);
			//done();
		};
		var oDraftController, oModel, mParams, bException = false;
		oModel = sinon.createStubInstance(ODataModel);
		oModel.remove = sinon.stub().yieldsTo("success");
		oDraftController = new DraftController(oModel);

		mParams = {
			param: "mockVal"
		};

		try {
			oDraftController.discardDraft(null, mParams).then(succeed, fail);
		} catch (ex) {
			bException = true;
		}

		assert.ok(bException);
		oDraftController.destroy();
	});

	QUnit.test("createDraft when createModel succeeds", function(assert) {
		var done = assert.async();
		var succeed = function(text) {
			assert.ok(true, text);
			done();
		};
		var fail = function(text) {
			assert.ok(false, text);
			done();
		};
		var oDraftController, oModel;
		oModel = sinon.createStubInstance(ODataModel);
		oModel.createEntry = sinon.stub().yieldsTo("success");
		oDraftController = new DraftController(oModel);

		oDraftController.createDraft("mockEntitySet", "mockPath").then(succeed, fail);
		oDraftController.destroy();
	});

	QUnit.test("createDraft when createModel fails", function(assert) {
		var done = assert.async();
		var succeed = function(text) {
			assert.ok(true, text);
			done();
		};
		var fail = function(text) {
			assert.ok(false, text);
			done();
		};
		var oDraftController, oModel;
		oModel = sinon.createStubInstance(ODataModel);
		oModel.createEntry = sinon.stub().yieldsTo("error");
		oDraftController = new DraftController(oModel);

		oDraftController.createDraft("mockEntitySet", "mockPath").then(fail, succeed);
		oDraftController.destroy();
	});

	QUnit.test("createDraft throws an exception", function(assert) {
		var succeed = function(text) {
			assert.ok(true, text);
			// done();
		};
		var fail = function(text) {
			assert.ok(false, text);
			//done();
		};
		var oDraftController, oModel, bException;
		oModel = sinon.createStubInstance(ODataModel);
		oModel.createEntry = sinon.stub().yieldsTo("success");
		oDraftController = new DraftController(oModel);

		try {
			oDraftController.createDraft(null, "mockPath").then(succeed, fail);
		} catch (ex) {
			bException = true;
		}

		assert.ok(bException);
		oDraftController.destroy();
	});

	QUnit.test("getDraftForActive shall succeed", function(assert) {
		var done = assert.async();
		var succeed = function(oResponse) {
			assert.ok(oResponse.context);
			done();
		};
		var fail = function(text) {
			assert.ok(false, text);
			done();
		};
		var oDraftController, oModel, oContext;
		oModel = sinon.createStubInstance(ODataModel);
		oModel.read = function(p1, p2) {
			return p2.success({
				"SiblingEntity": true
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
						IsActiveEntity: false,
						HasActiveEntity: true,
						HasDraftEntity: false
					};
				}
			};
		};
		oDraftController = new DraftController(oModel);

		oContext = {
			getPath: function() {
				return "/Dummy(123)";
			}
		};
		oDraftController.getDraftForActive(oContext).then(succeed, fail);
	});

	QUnit.test("getDraftForActive shall fail", function(assert) {
		var done = assert.async();
		var succeed = function(text) {
			assert.ok(false, text);
			done();
		};
		var fail = function(text) {
			assert.ok(true, text);
			done();
		};
		var oDraftController, oModel, oContext;
		oModel = sinon.createStubInstance(ODataModel);
		oModel.read = function(p1, p2) {
			return p2.error({
				"responseData": true
			});
		};
		oDraftController = new DraftController(oModel);

		oContext = {
			getPath: function() {
				return "/Dummy(123)";
			}
		};
		oDraftController.getDraftForActive(oContext).then(succeed, fail);
	});

	QUnit.test("getDraftForActive throws an exception", function(assert) {
		var succeed = function(text) {
			assert.ok(true, text);
			//done();
		};
		var fail = function(text) {
			assert.ok(false, text);
			//done();
		};
		var oDraftController, oModel, bException;
		oModel = sinon.createStubInstance(ODataModel);
		oModel.createEntry = sinon.stub().yieldsTo("success");
		oDraftController = new DraftController(oModel);

		try {
			oDraftController.getDraftForActive().then(succeed, fail);
		} catch (ex) {
			bException = true;
		}

		assert.ok(bException);
		oDraftController.destroy();
	});

	QUnit.test("getDraftForActiveEntity shall succeed", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, bSubmit = false, oContext;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			})
		});
		oModel.bUseBatch = true;
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.read = function(p1, p2) {
			return p2.success({
				"SiblingEntity": true
			});
		};
		oModel.mDeferredRequests = {
			"Changes": {
				"requests": [],
				"changes": {"Changes":[{request:{"Foo":"Bar"}}]}
			}
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
						IsActiveEntity: false,
						HasActiveEntity: true,
						HasDraftEntity: false
					};
				}
			};
		};
		oContext = {
			getPath: function() {
				return "/Dummy(123)";
			}
		};

		oController = new DraftController(oModel);
		oController.getDraftForActiveEntity(oContext).then(function(oResult) {
			assert.ok(oResult.context);
			assert.ok(bSubmit);
			done();
		}, function(oResult) {
			done();
		});
	});

	QUnit.test("getDraftForActiveEntity shall fail", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, bSubmit = false, oContext;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			})
		});
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.read = function(p1, p2) {
			return p2.error({
				"responseData": true
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
						IsActiveEntity: false,
						HasActiveEntity: true,
						HasDraftEntity: false
					};
				}
			};
		};
		oContext = {
			getPath: function() {
				return "/Dummy(123)";
			}
		};

		oController = new DraftController(oModel);
		oController.getDraftForActiveEntity(oContext).then(function(oResult) {
			done();
		}, function(oResult) {
			assert.ok(oResult);
			done();
		});
	});

	QUnit.test("getDraftForActiveEntity shall fail because no sibling can be found", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, bSubmit = false, oContext;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			})
		});
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.read = function(p1, p2) {
			return p2.success({
				"responseData": {
					SiblingEntity: null
				}
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
						IsActiveEntity: false,
						HasActiveEntity: true,
						HasDraftEntity: false
					};
				}
			};
		};
		oContext = {
			getPath: function() {
				return "/Dummy(123)";
			}
		};

		oController = new DraftController(oModel);
		oController.getDraftForActiveEntity(oContext).then(function(oResult) {
			done();
		}, function(oResult) {
			assert.ok(oResult);
			done();
		});
	});

	QUnit.test("createNewDraftEntity", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, bEntry = false, bSubmit = false;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			})
		});
		oModel.bUseBatch = true;
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.createEntry = function(p1, p2) {
			this.mDeferredRequests = {
				"Changes": {
					"requests": [],
					"changes": {"Changes":[{request:{"Foo":"Bar"}}]}
				}
			};
			bEntry = true;
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
		oModel.createBindingContext = function(p1, p2, p3, p4) {
			return p4({
				"path" : "/MockKey(1)"
			});
		};
		oModel.createKey = function() {
			return {};
		};
		oModel.getKey = function() {
			return "/MockKey(1)";
		};
		oModel.getContext = function() {
			return {
				"path": "/MockKey(1)",
				getObject: function() {
					return {
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};

		oController = new DraftController(oModel);
		oController.createNewDraftEntity("mockEntitySet", "mockPath").then(function(oResult) {
			assert.ok(oResult.context);
			assert.ok(oResult.data);
			assert.ok(bSubmit);
			assert.ok(bEntry);
			oController.destroy();
			done();
		}, function(oResult) {
			done();
		});
	});

	QUnit.test("createNewDraftEntity shall fail", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, bEntry = false, bSubmit = false;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			})
		});
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.createEntry = function(p1, p2) {
			bEntry = true;
			return p2.error({
				"message": true
			});
		};
		oModel.submitChanges = function(p1, p2) {
			bSubmit = true;
			return p1.success({
				"mockresponse": true
			});
		};
		oModel.createBindingContext = function(p1, p2, p3, p4) {
			return p4({
				"path" : "/MockKey(1)"
			});
		};
		oModel.createKey = function() {
			return {};
		};
		oModel.getKey = function() {
			return "/MockKey(1)";
		};
		oModel.getContext = function() {
			return {
				"path": "/MockKey(1)",
				getObject: function() {
					return {
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};

		oController = new DraftController(oModel);
		oController.createNewDraftEntity("mockEntitySet", "mockPath").then(function(oResult) {
			done();
		}, function(oResult) {
			assert.ok(oResult.response.message);
			oController.destroy();
			done();
		});
	});

	QUnit.test("createNewDraftEntity shall fail because of active entity", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, bEntry = false, bSubmit = false;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			})
		});
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.createEntry = function(p1, p2) {
			bEntry = true;
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
		oModel.createBindingContext = function(p1, p2, p3, p4) {
			return p4({
				"path" : "/MockKey(1)"
			});
		};
		oModel.createKey = function() {
			return {};
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

		oController = new DraftController(oModel);
		oController.createNewDraftEntity("mockEntitySet", "mockPath").then(function(oResult) {
			done();
		}, function(oResult) {
			assert.ok(oResult);
			oController.destroy();
			done();
		});
	});

	QUnit.test("createNewDraftEntity shall fail because of has draft entity set", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, bEntry = false, bSubmit = false;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			})
		});
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.createEntry = function(p1, p2) {
			bEntry = true;
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
		oModel.createBindingContext = function(p1, p2, p3, p4) {
			return p4({
				"path" : "/MockKey(1)"
			});
		};
		oModel.createKey = function() {
			return {};
		};
		oModel.getKey = function() {
			return "/MockKey(1)";
		};
		oModel.getContext = function() {
			return {
				"path": "/MockKey(1)",
				getObject: function() {
					return {
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: true
					};
				}
			};
		};

		oController = new DraftController(oModel);
		oController.createNewDraftEntity("mockEntitySet", "mockPath").then(function(oResult) {
			done();
		}, function(oResult) {
			assert.ok(oResult);
			oController.destroy();
			done();
		});
	});

	QUnit.test("createNewDraftEntity shall fail because of has draft entity set", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, bEntry = false, bSubmit = false;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({}),
			getODataEntityType: sinon.stub().returns({
				key: {
					propertyRef: []
				}
			})
		});
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.createEntry = function(p1, p2) {
			bEntry = true;
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
		oModel.createBindingContext = function(p1, p2, p3, p4) {
			return p4({
				"path" : "/MockKey(1)"
			});
		};
		oModel.createKey = function() {
			return {};
		};
		oModel.getKey = function() {
			return "/MockKey(1)";
		};
		oModel.getContext = function() {
			return {
				"path": "/MockKey(1)",
				getObject: function() {
					return null;
				}
			};
		};

		oController = new DraftController(oModel);
		oController.createNewDraftEntity("mockEntitySet", "mockPath").then(function(oResult) {
			done();
		}, function(oResult) {
			assert.ok(oResult);
			oController.destroy();
			done();
		});
	});

	QUnit.test("createEditDraftEntity", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, bSubmit = false;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType : "namespace.EntityTypeName",
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
		oModel.bUseBatch = true;
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.callFunction = function(p1, p2) {
			this.mDeferredRequests = {
				"Changes": {
					"requests": [],
					"changes": {"Changes":[{request:{"Foo":"Bar"}}]}
				}
			};
			p2.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.submitChanges = function(p1, p2) {
			bSubmit = true;
			return p1.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.createBindingContext = function(p1, p2, p3, p4) {
			return p4({
				"path" : "/MockKey(1)"
			});
		};
		oModel.createKey = function() {
			return {};
		};
		oModel.getKey = function() {
			return "/MockKey(1)";
		};
		oModel.getContext = function() {
			return {
				"path": "/MockKey(1)",
				getObject: function() {
					return {
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};
		oController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};
		oController.createEditDraftEntity(oContext).then(function(oResult) {
			assert.ok(oResult.context);
			assert.ok(oResult.data);
			assert.ok(bSubmit);
			oController.destroy();
			done();
		}, function(oResult) {
			assert.ok(false);
			oController.destroy();
			done();
		});
	});

	QUnit.test("createEditDraftEntity shall fail", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, bSubmit = false;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType : "namespace.EntityTypeName",
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
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.createEntry = function(p1, p2) {};
		oModel.callFunction = function(p1, p2) {
			p2.error({
				"message": true
			});
		};
		oModel.submitChanges = function(p1, p2) {
			bSubmit = true;
			return p1.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.createBindingContext = function(p1, p2, p3, p4) {
			return p4({
				"path" : "/MockKey(1)"
			});
		};
		oModel.createKey = function() {
			return {};
		};
		oModel.getKey = function() {
			return "/MockKey(1)";
		};
		oModel.getContext = function() {
			return {
				"path": "/MockKey(1)",
				getObject: function() {
					return {
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};
		oController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};
		oController.createEditDraftEntity(oContext).then(function(oResult) {
			assert.ok(false);
			oController.destroy();
			done();
		}, function(oResult) {
			assert.ok(oResult.response.message);
			oController.destroy();
			done();
		});
	});

	QUnit.test("createEditDraftEntity shall fail as no response entity exists", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, bSubmit = false;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType : "namespace.EntityTypeName",
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
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.createEntry = function(p1, p2) {};
		oModel.callFunction = function(p1, p2) {
			p2.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};

		oModel.submitChanges = function(p1, p2) {
			bSubmit = true;
			return p1.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.createBindingContext = function(p1, p2, p3, p4) {
			return p4({
				"path" : "/MockKey(1)"
			});
		};
		oModel.createKey = function() {
			return {};
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
		oController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function(){
				return oModel;
			}
		};
		oController.createEditDraftEntity(oContext).then(function(oResult) {
			assert.ok(false);
			oController.destroy();
			done();
		}, function(oResult) {
			assert.ok(true);
			oController.destroy();
			done();
		});
	});

	QUnit.test("createEditDraftEntity shall fail as active entity is returned", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, bSubmit = false;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType : "namespace.EntityTypeName",
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
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.createEntry = function(p1, p2) {};
		oModel.callFunction = function(p1, p2) {
			p2.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.submitChanges = function(p1, p2) {
			bSubmit = true;
			return p1.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.createBindingContext = function(p1, p2, p3, p4) {
			return p4({
				"path" : "/MockKey(1)"
			});
		};
		oModel.createKey = function() {
			return {};
		};
		oModel.getKey = function() {
			return "/MockKey(1)";
		};
		oModel.getContext = function() {
			return {
				"path": "/MockKey(1)",
				getObject: function() {
					return null;
				}
			};
		};
		oController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};
		oController.createEditDraftEntity(oContext).then(function(oResult) {
			assert.ok(false);
			oController.destroy();
			done();
		}, function(oResult) {
			assert.ok(true);
			oController.destroy();
			done();
		});
	});

	QUnit.test("createEditDraftEntity with bPreserveChanges = true", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, bSubmit = false;
		var bPreserveChanges = true;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType : "namespace.EntityTypeName",
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
		oModel.bUseBatch = true;
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.callFunction = function(p1, p2) {
			assert.ok(p2.urlParameters.PreserveChanges, "URL Parameter for preserving Changes set");
			this.mDeferredRequests = {
				"Changes": {
					"requests": [],
					"changes": {"Changes":[{request:{"Foo":"Bar"}}]}
				}
			};
			p2.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.submitChanges = function(p1, p2) {
			bSubmit = true;
			return p1.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.createBindingContext = function(p1, p2, p3, p4) {
			return p4({
				"path" : "/MockKey(1)"
			});
		};
		oModel.createKey = function() {
			return {};
		};
		oModel.getKey = function() {
			return "/MockKey(1)";
		};
		oModel.getContext = function() {
			return {
				"path": "/MockKey(1)",
				getObject: function() {
					return {
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};
		oController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};

		oController.createEditDraftEntity(oContext, bPreserveChanges).then(function(oResult) {
			assert.ok(oResult.context);
			assert.ok(oResult.data);
			assert.ok(bSubmit);
			oController.destroy();
			done();
		}, function(oResult) {
			assert.ok(false);
			oController.destroy();
			done();
		});
	});

	QUnit.test("validateDraftEntity", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, bRemove = false, bSubmit = false;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType : "namespace.EntityTypeName",
				name: "MockSet",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"ValidationFunction": {
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
		oModel.bUseBatch = true;
		oModel.callFunction = function(p1, p2) {
			this.mDeferredRequests = {
				"Changes": {
					"requests": [],
					"changes": {"Changes":[{request:{"Foo":"Bar"}}]}
				}
			};
			bRemove = true;
			return p2.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.submitChanges = function(p1, p2) {
			bSubmit = true;
			return p1.success({
				"mockdata": true
			}, {
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
		oModel.getObject = function () {
			return {
				IsActiveEntity: false
			};
		};

		oController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {
					IsActiveEntity: true
				};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};

		oController.validateDraftEntity(oContext, null).then(function(oResult) {
			assert.ok(oResult.context);
			assert.ok(oResult.data);
			assert.ok(bSubmit);
			assert.ok(bRemove);
			oController.destroy();
			done();
		}, function(oResult) {
			assert.ok(false);
			oController.destroy();
			done();
		});

	});

	QUnit.test("validateDraftEntity shall fail", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, bRemove = false, bSubmit = false;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType : "namespace.EntityTypeName",
				name: "MockSet",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"ValidationFunction": {
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
		oModel.callFunction = function(p1, p2) {
			bRemove = true;
			return p2.error({
				"message": true
			});
		};
		oModel.submitChanges = function(p1, p2) {
			bSubmit = true;
			return p1.success({
				"mockdata": true
			}, {
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
		oModel.getObject = function () {
			return {
				IsActiveEntity: false
			};
		};

		oController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {
					IsActiveEntity: true
				};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};

		oController.validateDraftEntity(oContext, null).then(function(oResult) {
			assert.ok(false);
			oController.destroy();
			done();
		}, function(oResult) {
			assert.ok(oResult.response.message);
			oController.destroy();
			done();
		});

	});

	QUnit.test("prepareDraftEntity", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, mParams;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					entityType : "namespace.EntityTypeName",
					name: "MockSet",
					"com.sap.vocabularies.Common.v1.DraftNode": {
						"PreparationAction": {
							"String": "PreparationAction"
						}
					}
				}),
				getODataFunctionImport: function() {
					return { parameter: {}};
				},
				getODataEntityType: function() {
					return { key: {
						propertyRef: []
					}};
				}
			};
		};
		oModel.getKey = function() {
			return "/MockKey(1)";
		};
		oModel.getContext = function() {
			return {
				"path": "/MockKey(1)",
				getObject: function() {
					return {
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};
		oModel.callFunction = function(p1, p2) {
			return p2.success({
				"mockresponse": true
			});
		};
		oModel.getObject = function () {
			return {
				IsActiveEntity: false
			};
		};

		oController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};
		mParams = {
			param: "mockVal"
		};

		oController.prepareDraftEntity(oContext, mParams).then(function(oResponse) {
			assert.ok(oResponse);
			oController.destroy();
			done();
		}, function(oResult) {
			assert.ok(false);
			oController.destroy();
			done();
		});
	});

	QUnit.test("prepareDraftEntity shall fail", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, mParams;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					entityType : "namespace.EntityTypeName",
					name: "MockSet",
					"com.sap.vocabularies.Common.v1.DraftNode": {
						"PreparationAction": {
							"String": "PreparationAction"
						}
					}
				}),
				getODataFunctionImport: function() {
					return { parameter: {}};
				},
				getODataEntityType: function() {
					return { key: {
						propertyRef: []
					}};
				}
			};
		};
		oModel.getKey = function() {
			return "/MockKey(1)";
		};
		oModel.getContext = function() {
			return {
				"path": "/MockKey(1)",
				getObject: function() {
					return {
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};
		oModel.callFunction = function(p1, p2) {
			return p2.error({
				"message": true
			});
		};
		oModel.getObject = function () {
			return {
				IsActiveEntity: false
			};
		};

		oController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};
		mParams = {
			param: "mockVal"
		};

		oController.prepareDraftEntity(oContext, mParams).then(function() {
			assert.ok(false);
			oController.destroy();
			done();
		}, function() {
			assert.ok(true);
			oController.destroy();
			done();
		});
	});

	QUnit.test("prepareDraftEntity shall fail with active entity", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, mParams;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					entityType : "namespace.EntityTypeName",
					name: "MockSet",
					"com.sap.vocabularies.Common.v1.DraftNode": {
						"PreparationAction": {
							"String": "PreparationAction"
						}
					}
				}),
				getODataFunctionImport: function() {
					return { parameter: {}};
				},
				getODataEntityType: function() {
					return { key: {
						propertyRef: []
					}};
				}
			};
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
		oModel.callFunction = function(p1, p2) {
			return p2.success({
				"mockresponse": true
			});
		};

		oController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};
		mParams = {
			param: "mockVal"
		};
		oModel.getObject = function () {
			return {
				IsActiveEntity: true
			};
		};
		oController.prepareDraftEntity(oContext, mParams).then(function(oResponse) {
			assert.ok(false);
			oController.destroy();
			done();
		}, function(oResult) {
			assert.ok(true);
			oController.destroy();
			done();
		});
	});

	QUnit.test("saveAndPrepareDraftEntity", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, bAction = false, bSubmit = false, bRefresh = false, mParameters = {
			binding : {
				refresh: function(bParam, sBatchGroup) {
					if (sBatchGroup === "Changes") {
						bRefresh = true;
					}
				}
			}
		};

		oModel = sinon.createStubInstance(ODataModel);
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType : "namespace.EntityTypeName",
				name: "MockSet",
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
		oModel.bUseBatch = true;
		oModel.callFunction = function(p1, p2) {
			this.mDeferredRequests = {
				"Changes": {
					"requests": [],
					"changes": {"Changes":[{request:{"Foo":"Bar"}}]}
				}
			};
			bAction = true;
			return p2.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.submitChanges = function(p1, p2) {
			bSubmit = true;
			return p1.success({
				"mockdata": true
			}, {
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
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};
		oModel.getObject = function () {
			return {
				IsActiveEntity: false
			};
		};

		oController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {
					IsActiveEntity: true
				};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};

		oController.saveAndPrepareDraftEntity(oContext, mParameters).then(function(oResult) {
			assert.ok(oResult.context);
			assert.ok(oResult.data);
			assert.ok(bSubmit);
			assert.ok(bAction);
			assert.ok(bRefresh);
			oController.destroy();
			done();
		}, function(oResult) {
			oController.destroy();
			done();
		});
	});

	QUnit.test("saveAndPrepareDraftEntity shall fail", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, bAction = false, bSubmit = false;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType : "namespace.EntityTypeName",
				name: "MockSet",
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
		oModel.callFunction = function(p1, p2) {
			this.mDeferredRequests = {
									"Changes": {
										"requests": [],
										"changes": []
								  }
								};
			bAction = true;
			return p2.error({
				"message": true
			});
		};
		oModel.submitChanges = function(p1, p2) {
			bSubmit = true;
			return p1.success({
				"mockdata": true
			}, {
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
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};
		oModel.getObject = function () {
			return {
				IsActiveEntity: false
			};
		};

		oController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {
					IsActiveEntity: true
				};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};

		oController.saveAndPrepareDraftEntity(oContext).then(function(oResult) {
			assert.ok(false);
			oController.destroy();
			done();
		}, function(oResult) {
			assert.ok(oResult.response.message);
			oController.destroy();
			done();
		});

	});

	QUnit.test("saveAndPrepareDraftEntity shall fail as no response entity exists", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, bAction = false, bSubmit = false;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType : "namespace.EntityTypeName",
				name: "MockSet",
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
		oModel.callFunction = function(p1, p2) {
			this.mDeferredRequests = {
									"Changes": {
										"requests": [], 
										"changes": []
								  }
								};
			bAction = true;
			return p2.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.submitChanges = function(p1, p2) {
			bSubmit = true;
			return p1.success({
				"mockdata": true
			}, {
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
					return null;
				}
			};
		};
		oModel.getObject = function () {
			return {
				IsActiveEntity: false
			};
		};

		oController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {
					IsActiveEntity: true
				};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};

		oController.saveAndPrepareDraftEntity(oContext).then(function(oResult) {
			assert.ok(false);
			oController.destroy();
			done();
		}, function(oResult) {
			assert.ok(true);
			oController.destroy();
			done();
		});
	});

	QUnit.test("saveAndPrepareDraftEntity shall fail as an active entity is returned", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, bAction = false, bSubmit = false;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType : "namespace.EntityTypeName",
				name: "MockSet",
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
		oModel.callFunction = function(p1, p2) {
			bAction = true;
			return p2.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.submitChanges = function(p1, p2) {
			bSubmit = true;
			return p1.success({
				"mockdata": true
			}, {
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
		oModel.getObject = function () {
			return {
				IsActiveEntity: true
			};
		};
		oController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {
					IsActiveEntity: true
				};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};

		oController.saveAndPrepareDraftEntity(oContext).then(function(oResult) {
			assert.ok(false);
			oController.destroy();
			done();
		}, function(oResult) {
			assert.ok(true);
			oController.destroy();
			done();
		});
	});

	QUnit.test("activateDraftEntity", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, bRemove = false, bSubmit = false;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType : "namespace.EntityTypeName",
				name: "MockSet",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"ActivationAction": {
						"String": "/dummyFunc"
					},
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
		oModel.bUseBatch = true;
		oModel.callFunction = function(p1, p2) {
			this.mDeferredRequests = {
				"Changes": {
					"requests": [],
					"changes": {"Changes":[{request:{"Foo":"Bar"}}]}
				},
				"Activation": {
					"requests": [],
					"changes": {"Activation":[{request:{"Foo":"Bar"}}]}
				}
			};
			bRemove = true;
			return p2.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.submitChanges = function(p1, p2) {
			bSubmit = true;
			return p1.success({
				"mockdata": true
			}, {
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

		oModel.getObject = function () {
			return {
				IsActiveEntity: false
			};
		};

		oController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {
					IsActiveEntity: true
				};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};

		oController.activateDraftEntity(oContext, null).then(function(oResult) {
			assert.ok(oResult.context, "oResult.context is available");
			assert.ok(oResult.data, "oResult.data is available");
			assert.ok(bSubmit, "bSubmit is set");
			assert.ok(bRemove, "bRemove is set");
			oController.destroy();
			done();
		}, function(oResult) {
			assert.ok(false);
			oController.destroy();
			done();
		});
	});

	QUnit.test("activateDraftEntity shall fail", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, bRemove = false, bSubmit = false;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType : "namespace.EntityTypeName",
				name: "MockSet",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"ActivationAction": {
						"String": "/dummyFunc"
					},
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
		oModel.callFunction = function(p1, p2) {
			bRemove = true;
			return p2.error({
				"message": true
			});
		};
		oModel.submitChanges = function(p1, p2) {
			bSubmit = true;
			return p1.success({
				"mockdata": true
			}, {
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

		oModel.getObject = function () {
			return {
				IsActiveEntity: false
			};
		};

		oController = new DraftController(oModel);
		//oQueue = oTransactionController.getQueue();
		//oQueue.enqueue = function(f1, f2) {
		//	return f1();
		//};

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {
					IsActiveEntity: true
				};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};

		oController.activateDraftEntity(oContext, null).then(function(oResult) {
			assert.ok(false);
			oController.destroy();
			done();
		}, function(oResult) {
			assert.ok(oResult.response.message);
			oController.destroy();
			done();
		});
	});

	QUnit.test("activateDraftEntity shall fail with no entity returned", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, bRemove = false, bSubmit = false;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType : "namespace.EntityTypeName",
				name: "MockSet",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"ActivationAction": {
						"String": "/dummyFunc"
					},
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
		oModel.callFunction = function(p1, p2) {
			bRemove = true;
			return p2.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.submitChanges = function(p1, p2) {
			bSubmit = true;
			return p1.success({
				"mockdata": true
			}, {
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
					return null;
				}
			};
		};

		oModel.getObject = function () {
			return {
				IsActiveEntity: false
			};
		};

		oController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return null;
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};

		oController.activateDraftEntity(oContext, null).then(function(oResult) {
			assert.ok(false);
			oController.destroy();
			done();
		}, function(oResult) {
			assert.ok(true);
			oController.destroy();
			done();
		});
	});

	QUnit.test("activateDraftEntity shall fail because of inactive entity returned", function(assert) {
		var done = assert.async();
		var oController, oModel, oContext, bRemove = false, bSubmit = false;

		oModel = sinon.createStubInstance(ODataModel);
		oModel.setDeferredBatchGroups = function() {};
		oModel.setChangeBatchGroups = function() {};
		oModel.getMetaModel = sinon.stub().returns({
			getSemanticKeyProperties: sinon.stub().returns([]),
			getEntityType: sinon.stub().returns('mockType'),
			getODataEntitySet: sinon.stub().returns({
				entityType : "namespace.EntityTypeName",
				name: "MockSet",
				"com.sap.vocabularies.Common.v1.DraftNode": {
					"ActivationAction": {
						"String": "/dummyFunc"
					},
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
		oModel.callFunction = function(p1, p2) {
			bRemove = true;
			return p2.success({
				"mockdata": true
			}, {
				"mockresponse": true
			});
		};
		oModel.submitChanges = function(p1, p2) {
			bSubmit = true;
			return p1.success({
				"mockdata": true
			}, {
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
						IsActiveEntity: false,
						HasActiveEntity: false,
						HasDraftEntity: false
					};
				}
			};
		};

		oModel.getObject = function () {
			return {
				IsActiveEntity: false
			};
		};

		oController = new DraftController(oModel);

		oContext = {
			name: "mockContext",
			getObject: function() {
				return {
					IsActiveEntity: true
				};
			},
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};

		oController.activateDraftEntity(oContext, null).then(function(oResult) {
			assert.ok(false);
			oController.destroy();
			done();
		}, function(oResult) {
			assert.ok(true);
			oController.destroy();
			done();
		});

	});

/*
	QUnit.test("submitChanges", function(assert){
		stop();
		var oDraftController, oModel;
		oModel = sinon.createStubInstance(ODataModel);
		oModel.submitChanges = sinon.stub().yieldsTo("success");
		oDraftController = new DraftController(oModel);

		oDraftController.submitChanges({
			batchGroupId: "mockBG",
			eTag: "mockEtag"
		}).then(succeed, fail);

		oDraftController.destroy();
	});

	QUnit.test("submitChanges shall fail", function(assert){
		stop();
		var oDraftController, oModel;
		oModel = sinon.createStubInstance(ODataModel);
		oModel.submitChanges = sinon.stub().yieldsTo("error");
		oDraftController = new DraftController(oModel);

		oDraftController.submitChanges({
			batchGroupId: "mockBG",
			eTag: "mockEtag",
			forceSubmit: true
		}).then(fail, succeed);

		oDraftController.destroy();
	});
*/
	QUnit.test("Shall be destructible", function(assert) {
		this.oDraftController.destroy();
		assert.ok(this.oDraftController);
		assert.equal(this.oDraftController._oModel, null);
	});
});