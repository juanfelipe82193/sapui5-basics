/*global QUnit, sinon */
/*eslint no-unused-vars: 1 */
sap.ui.define([
	"sap/ui/model/odata/ODataMetaModel",
	"sap/ui/model/odata/ODataModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/generic/app/transaction/DraftContext",
	"sap/ui/core/util/MockServer"
], function(
	ODataMetaModel,
	ODataModelV1,
	ODataModelV2,
	DraftContext,
	MockServer
) {
	"use strict";

	QUnit.module("sap.ui.generic.app.transaction.DraftContext", {
		beforeEach: function() {
			this.oModel = sinon.createStubInstance(ODataModelV1);
			this.oContext = new DraftContext(this.oModel);
		},
		afterEach: function() {
			this.oContext.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oContext);
	});

	QUnit.test("Model is a mandatory parameter", function(assert) {
		var bException = false;

		try {
			new DraftContext();
		} catch (ex) {
			bException = true;
		}

		assert.ok(bException);
	});

	QUnit.test("isDraftEnabled", function(assert) {
		var oContext, oModel;

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					entityType : "namespace.EntityTypeName",
					"com.sap.vocabularies.Common.v1.DraftRoot": true
				})
			};
		};
		oContext = new DraftContext(oModel);
		assert.ok(oContext.isDraftEnabled("mockEntitySet"), "should return true");

		oContext.destroy();
	});

	QUnit.test("_getODataDraftEntitySet: entity set is mandatory", function(assert) {
		var bException = false;

		try {
			this.oContext.isDraftEnabled();
		} catch (ex) {
			bException = true;
		}

		assert.ok(bException);
	});

	QUnit.test("_getEntitySetFromContext: binding context is mandatory", function(assert) {
		var bException = false;

		try {
			this.oContext.hasDraft();
		} catch (ex) {
			bException = true;
		}

		assert.ok(bException);
	});

	QUnit.test("hasDraft", function(assert) {
		var oContext, oModel, oCtxt;

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					"entityType" : "namespace.EntityTypeName",
					"com.sap.vocabularies.Common.v1.DraftRoot": true,
					"name": "mockEntitySet"
				})
			};
		};

		oCtxt = {
			getPath: function() {
				return "/mockEntitySet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};

		var oDraftContext = new DraftContext(oModel);
		assert.ok(oDraftContext.hasDraft(oCtxt), "should return true");	

		oDraftContext.destroy();
	});

	QUnit.test("isDraftRoot", function(assert) {
		var oContext, oModel;

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					entityType : "namespace.EntityTypeName",
					"com.sap.vocabularies.Common.v1.DraftRoot": true
				})
			};
		};
		oContext = new DraftContext(oModel);
		assert.ok(oContext.isDraftRoot("mockEntitySet"), "should return true");	

		oContext.destroy();
	});

	QUnit.test("hasDraftRoot", function(assert) {
		var oContext, oModel;

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					entityType : "namespace.EntityTypeName",
					"com.sap.vocabularies.Common.v1.DraftRoot": true, 
					"name": "dummyPath"
				})
			};
		};
		oContext = new DraftContext(oModel);
		assert.ok(oContext.hasDraftRoot({
			getPath: function() {
				return "/dummyPath";
			},
			getModel: function() {
				return oModel;
			}
		}), "should return true");

		oContext.destroy();
	});

	QUnit.test("hasDraftValidationFunction", function(assert) {
		var oContext, oModel;

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					entityType : "namespace.EntityTypeName",
					"name": "dummyPath",
					"com.sap.vocabularies.Common.v1.DraftNode": {
						"ValidationFunction": {
							"String": true
						}
					}
				})
			};
		};
		oContext = new DraftContext(oModel);

		assert.ok(oContext.hasDraftValidationFunction({
			getPath: function() {
				return "/dummyPath";
			},
			getModel: function() {
				return oModel;
			}
		}), "should return true");

		oContext.destroy();
	});

	QUnit.test("hasDraftPreparationAction", function(assert) {
		var oContext, oModel;

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					entityType : "namespace.EntityTypeName",
					"name": "dummyPath",
					"com.sap.vocabularies.Common.v1.DraftNode": {
						"PreparationAction": {
							"String": true
						}
					}
				})
			};
		};
		oContext = new DraftContext(oModel);

		assert.ok(oContext.hasDraftPreparationAction({
			getPath: function() {
				return "/dummyPath";
			},
			getModel: function() {
				return oModel;
			}
		}), "should return true");

		oContext.destroy();
	});

	QUnit.test("isSemanticKey", function(assert) {
		var oContext, oModel, aSemanticKey, oEntity = {
			mock1: true,
			mock3: true
		};

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					name : "EntitySet",
					entityType: "namespace.EntityTypeName",
					"com.sap.vocabularies.Common.v1.DraftRoot": true
				}),
				getODataEntityType: sinon.stub().returns({
					name : "EntityTypeName",
					'com.sap.vocabularies.Common.v1.SemanticKey' : [{PropertyPath: "mock1"},{PropertyPath: "mock2"}]
				})
			};
		};

		oContext = new DraftContext(oModel);
		assert.ok(oContext.isSemanticKey("EntityTypeName", {
			"mock1": true,
			"mock2": true
		}));


		oContext.destroy();
	});

	QUnit.test("isSemanticKey shall return false for unknown key property", function(assert) {
		var oContext, oModel, aSemanticKey, oEntity = {
			mock1: true,
			mock3: true
		};

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					name : "EntitySet",
					entityType: "namespace.EntityTypeName",
					"com.sap.vocabularies.Common.v1.DraftRoot": true
				}),
				getODataEntityType: sinon.stub().returns({
					name : "EntityTypeName",
					'com.sap.vocabularies.Common.v1.SemanticKey' : [{PropertyPath: "mock1"},{PropertyPath: "mock3"}]
				})
			};
		};

		oContext = new DraftContext(oModel);
		assert.ok(!oContext.isSemanticKey("EntityTypeName", {
			"mock1": true,
			"mock2": true
		}));


		oContext.destroy();
	});
	QUnit.test("isSemanticKey for non draft-enabled entity set", function(assert) {
		var oContext, oModel, aSemanticKey, oEntity = {
			mock1: true,
			mock3: true
		};

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					name : "EntitySet",
					entityType: "namespace.EntityTypeName"
				}),
				getODataEntityType: sinon.stub().returns({
					name : "EntityTypeName",
					'com.sap.vocabularies.Common.v1.SemanticKey' : [{PropertyPath: "mock1"},{PropertyPath: "mock2"}]
				})
			};
		};

		oContext = new DraftContext(oModel);
		assert.ok(!oContext.isSemanticKey("EntityTypeName", {
			"mock1": true,
			"mock2": true
		}));

		oContext.destroy();
	});

	QUnit.test("is technical key", function(assert) {
		var oContext, oModel, oEntity = {
			mock1 : true,
			mock2 : true
		};

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({entityType : "namespace.EntityTypeName"}),
				getODataEntityType: sinon.stub().returns({
					name : "EntityTypeName",
					key : {
						propertyRef : [{name: 'mock1'}, {name: 'mock2'}]
					}
				})
			};
		};
		oContext = new DraftContext(oModel);
		assert.ok(oContext.isTechnicalKey("mock", oEntity), "is technical key");

		oContext.destroy();

	});

	QUnit.test("is not technical key", function(assert) {
		var oContext, oModel, oEntity = {
			mock1 : true,
			mock3 : true
		};

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({entityType : "namespace.EntityTypeName"}),
				getODataEntityType: sinon.stub().returns({
					name : "EntityTypeName",
					key : {
						propertyRef : [{name: 'mock1'}, {name: 'mock2'}]
					}
				})
			};
		};

		oContext = new DraftContext(oModel);
		assert.ok(!oContext.isTechnicalKey("mock", oEntity), "is not a technical key");

		oContext.destroy();
	});

	QUnit.test("is not technical key (invalid number of keys)", function(assert) {
		var oContext, oModel, oEntity = {
			mock1 : true
		};

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({entityType : "namespace.EntityTypeName"}),
				getODataEntityType: sinon.stub().returns({
					name : "EntityTypeName",
					key : {
						propertyRef : [{name: 'mock1'}, {name: 'mock3'}]
					}
				})
			};
		};

		oContext = new DraftContext(oModel);
		assert.ok(!oContext.isTechnicalKey("mock", oEntity), "is not a technical key");

		oContext.destroy();
	});

	QUnit.test("isTechnicalKey: enitity set is mandatory", function(assert) {
		var bException = false;

		try {
			this.oContext.isTechnicalKey();
		} catch (ex) {
			bException = true;
		}

		assert.ok(bException);
	});

	QUnit.test("get semantic key", function(assert) {
		var oContext, oModel, aSemanticKey, oEntity = {
			mock1: true,
			mock3: true
		};

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					name : "EntitySet",
					entityType: "namespace.EntityTypeName"
				}),
				getODataEntityType: sinon.stub().returns({
					name : "EntityTypeName",
					'com.sap.vocabularies.Common.v1.SemanticKey' : [{PropertyPath: "mock1"},{PropertyPath: "mock2"}]
				})
			};
		};

		oContext = new DraftContext(oModel);
		aSemanticKey = oContext.getSemanticKey("EntityTypeName");
		assert.deepEqual(aSemanticKey, [ {name : "mock1"}, {name : "mock2"}], 'is semantic key');

		oContext.destroy();
	});

	QUnit.test("get empty semantic key", function(assert) {
		var oContext, oModel, aSemanticKey, oEntity = {
			mock1: true,
			mock3: true
		};

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					name : "EntitySet",
					entityType: "namespace.EntityTypeName"
				}),
				getODataEntityType: sinon.stub().returns({
					name : "EntityTypeName"
				})
			};
		};
		oContext = new DraftContext(oModel);
		aSemanticKey = oContext.getSemanticKey("EntityTypeName");
		assert.deepEqual(aSemanticKey, [], "initial semantic key");

		oContext.destroy();
	});

	QUnit.test("getSemanticKey: enitity set is mandatory", function(assert) {
		var bException = false;

		try {
			this.oContext.getSemanticKey();
		} catch (ex) {
			bException = true;
		}

		assert.ok(bException);
	});

	QUnit.test("checkUpdateOnChange: enitity set is mandatory", function(assert) {
		var bException = false;

		try {
			this.oContext.checkUpdateOnChange();
		} catch (ex) {
			bException = true;
		}

		assert.ok(bException);
	});

	QUnit.test("checkUpdateOnChange", function(assert) {
		var oContext, oModel, aSemanticKey, oEntity = {
			mock1: true,
			mock3: true
		};

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					name : "EntitySet",
					entityType: "namespace.EntityTypeName",
					"com.sap.vocabularies.Common.v1.UpdateOnChange": [ { PropertyPath : "mockProp"}],
					"com.sap.vocabularies.Common.v1.SideEffects#" : {
						"SourceProperties" : [
							{
								"PropertyPath": "mockProp"
							}
						]
					}
				})
			};
		};

		oContext = new DraftContext(oModel);
		assert.ok(oContext.checkUpdateOnChange("mockEntitySet", "mockProp"), "should return true");
		oContext.destroy();
	});

	QUnit.test("checkUpdateOnChange returns false", function(assert) {
		var oContext, oModel, aSemanticKey, oEntity = {
			mock1: true,
			mock3: true
		};

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					name : "EntitySet",
					entityType: "namespace.EntityTypeName",
					"com.sap.vocabularies.Common.v1.UpdateOnChange": [ { PropertyPath : "mockProp"}],
					"com.sap.vocabularies.Common.v1.SideEffects#" : {
						"SourceProperties" : [
							{
								"PropertyPath": "mockProp"
							}
						]
					}
				})
			};
		};

		oContext = new DraftContext(oModel);
		assert.ok(!oContext.checkUpdateOnChange("mockEntitySet", "mockProp1"), "should return false");
		oContext.destroy();
	});

	QUnit.test("hasDraftAdministrativeData", function(assert) {
		var oContext, oModel, aSemanticKey, oEntity = {
			mock1: true,
			mock3: true
		};

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					name : "EntitySet",
					entityType: "namespace.EntityTypeName"
				}),
				getODataEntityType: sinon.stub().returns({
					name : "EntityTypeName",
					navigationProperty : [{name: "DraftAdministrativeData" }]
				})
			};
		};

		oContext = new DraftContext(oModel);
		assert.ok(oContext.hasDraftAdministrativeData("mockEntitySet"), "should return true");
		oContext.destroy();
	});

	QUnit.test("hasDraftAdministrativeData shall return false", function(assert) {
		var oContext, oModel, aSemanticKey, oEntity = {
			mock1: true,
			mock3: true
		};

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					name : "EntitySet",
					entityType: "namespace.EntityTypeName"
				}),
				getODataEntityType: sinon.stub().returns({
					name : "EntityTypeName",
					navigationProperty : [{name: "DraftAdministrativeData111" }]
				})
			};
		};

		oContext = new DraftContext(oModel);
		assert.ok(!oContext.hasDraftAdministrativeData("mockEntitySet"), "should return true");
		oContext.destroy();
	});

	QUnit.test("getODataDraftFunctionImportName", function(assert) {
		var oBinding, oContext, oModel, aSemanticKey, oEntity = {
			mock1: true,
			mock3: true
		};

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					entityType: "namespace.EntityTypeName",
					"name": "dummyPath",
					"com.sap.vocabularies.Common.v1.DraftRoot" : {
						"mockFunction": {
							"String": "mockString"
						}
					}
				}),
				getODataEntityType: sinon.stub().returns({
					name : "EntityTypeName",
					navigationProperty : [{name: "DraftAdministrativeData" }]
				})
			};
		};

		oBinding = {
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};
		oContext = new DraftContext(oModel);
		assert.ok(oContext.getODataDraftFunctionImportName(oBinding, "mockFunction"), "should return true");
		oContext.destroy();
	});

	QUnit.test("getODataDraftFunctionImportName shall return null", function(assert) {
		var oBinding, oContext, oModel, aSemanticKey, oEntity = {
			mock1: true,
			mock3: true
		};

		oModel = sinon.createStubInstance(ODataModelV1);
		oModel.getMetaModel = function() {
			return {
				getODataEntitySet: sinon.stub().returns({
					name : "EntitySet",
					entityType: "namespace.EntityTypeName",
					"com.sap.vocabularies.Common.v1.DraftRoot" : {
						"mockFunction": {
							"String": "mockString"
						}
					}
				}),
				getODataEntityType: sinon.stub().returns({
					name : "EntityTypeName",
					navigationProperty : [{name: "DraftAdministrativeData" }]
				})
			};
		};

		oBinding = {
			getPath : function() {
				return "/MockSet(1)";
			},
			getModel: function() {
				return oModel;
			}
		};
		oContext = new DraftContext(oModel);
		assert.ok(!oContext.getODataDraftFunctionImportName(oBinding, "mockFunction1"), "should return null");
		oContext.destroy();
	});

	QUnit.test("hasPreserveChanges shall return true", function( assert ) {
		var done = assert.async();

		var  oModel;
		var oContext;
		var oUiContext = {};

		var sUri = "/mock/";
		var oMockServer = new MockServer({
			rootUri : sUri
		});
		var sMetadataUrl = "test-resources/sap/ui/generic/app/qunit/testdata/DraftService/metadata.xml";
		var sMockdataBaseUrl = "DraftProductData/";

		oMockServer.simulate(sMetadataUrl, sMockdataBaseUrl);
		oMockServer.start();

		oModel = new ODataModelV2(sUri, true);

		oContext = new DraftContext(oModel);

		oUiContext.getPath = function(){
			return "/SEPMRA_C_SalesOrder";
		};
		oUiContext.getModel = function() {
			return oModel;
		};

		oModel.getMetaModel().loaded().then(function(){
			assert.ok(oContext.hasPreserveChanges(oUiContext), "Flag 'PreserveChanges' correctly found with value 'true'");

			oContext.destroy();
			oMockServer.destroy();
			done();
		});
	});

	QUnit.test("hasPreserveChanges shall return false", function( assert ) {
		var done = assert.async();

		var  oModel;
		var oContext;
		var oUiContext = {};

		var sUri = "/mock/";
		var oMockServer = new MockServer({
			rootUri : sUri
		});
		var sMetadataUrl = "../testdata/DraftService/metadata.xml";
		var sMockdataBaseUrl = "DraftProductData/";

		oMockServer.simulate(sMetadataUrl, sMockdataBaseUrl);
		oMockServer.start();

		oModel = new ODataModelV2(sUri, true);

		oContext = new DraftContext(oModel);

		oUiContext.getPath = function(){
			return "/SEPM_I_BusinessPartner_E";
		};
		oUiContext.getModel = function() {
			return oModel;
		};

		oModel.getMetaModel().loaded().then(function(){
			assert.ok(!oContext.hasPreserveChanges(oUiContext), "Flag 'PreserveChanges' found with value 'false'");

			oContext.destroy();
			oMockServer.destroy();
			done();
		});
	});

	QUnit.test("Shall be destructible", function(assert) {
		this.oContext.destroy();
		assert.ok(this.oContext);
		assert.equal(this.oContext._oModel, null);
	});
});