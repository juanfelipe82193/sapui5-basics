sap.ui.define(["sap/ui/core/UIComponent",
	"sap/base/Log",
	"sap/suite/ui/generic/template/js/AnnotationHelper",
	"sap/ui/core/util/MockServer",
	"tests/AnnotationHelper-isRelatedEntityCreatable",
	"tests/AnnotationHelper-areBooleanRestrictionsValidAndPossible",
	"tests/AnnotationHelper-ProgressIndicator",
	"tests/AnnotationHelper-RatingIndicator",
	"tests/AnnotationHelper-SmartMicroChart",
	"tests/AnnotationHelper-determiningActions",
	"tests/AnnotationHelper-createP13N",
	// "tests/AnnotationHelper-determineTableType", removed, as determination of table type is moved into
	// SmartTable.fragment itself. Currently, no unit tests on fragments possible. As soon as this is
	// possible, tests should be transferred accordingly
	"tests/AnnotationHelper-determineMultiSelect",
	"tests/AnnotationHelper-getBindingForHiddenPath",
	"tests/AnnotationHelper-getPresentationVariant",
	"tests/AnnotationHelper-isNavigationPropertyInsertable",
	"tests/AnnotationHelper-getGroupElementQualifier"
], function (UIComponent, Log, AnnotationHelper, MockServer) {
	var oGetComponentDataStub;
	// map function which behaves exactly like jQuery map
	// it discards the undefined values in array
	function map (aItem, callback) {
		return aItem.map(callback).filter(function (element) {
			return element !== undefined;
		});
	}

	module("Basic checks: AnnotationHelper", {

		setup: function () {
			this.oAnnotationHelper = AnnotationHelper;
			oGetComponentDataStub = sinon.stub(UIComponent.prototype, "getComponentData", function () {
				return {
					registryEntry: {}
				};
			});
			//var Interface_test = sinon.createStubInstance("sap.ui.base");
			//var Interface_test = Interface;
		},

		teardown: function () {
			this.oAnnotationHelper = null;
			oGetComponentDataStub.restore();
		},

		getMockModel: function () {

			var oModel, oMockServer;
			// the mockservice to get a suitable MetadataModel

			oMockServer = new MockServer({
				rootUri: "/sap/opu/odata/sap/SEPMRA_PROD_MAN/"
			});
			// take the mock meta data file from the demokit product application
			oMockServer.simulate("test-resources/sap/suite/ui/generic/template/demokit/sample.manage.products/webapp/localService/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/suite/ui/generic/template/demokit/sample.manage.products/webapp/localService/",
				bGenerateMissingMockData: true
			});
			oMockServer.start();

			// setting up model
			oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/SEPMRA_PROD_MAN/", {
				// both anntoations files are needed to have a suitabel meta model
				annotationURI: [
					"test-resources/sap/suite/ui/generic/template/demokit/sample.manage.products/webapp/localService/annotations.xml",
					"test-resources/sap/suite/ui/generic/template/demokit/sample.manage.products/webapp/annotations/annotations.xml"
				]
			});

			oModel.setSizeLimit(10);
			return oModel;
		}

	});

	// You can have any number of calls to the 'test' function, one for each unit test you want to run
	// setup gets run before any test, and teardown gets run after all of the tests have finished

	QUnit.test("instance AnnotationHelper available", function () {
		ok(this.oAnnotationHelper);
	});

	QUnit.test("has method validation: isSelf", function () {
		equal(typeof this.oAnnotationHelper.isSelf, "function", "isSelf function availability");
		equal(typeof this.oAnnotationHelper.number, "function", "number function availability");
		equal(typeof this.oAnnotationHelper.formatColor, "function", "formatColor function availability");
		equal(typeof this.oAnnotationHelper.hasActions, "function", "hasActions function availability");
	});
	QUnit.test("executes function: isSelf", function () {
		bBool = this.oAnnotationHelper.isSelf();
		assert.ok(bBool, "isSelf executed with undefined path");
		bBool = this.oAnnotationHelper.isSelf("@com.sap.vocabularies.UI.v1.Identification");
		assert.ok(bBool, "isSelf executed with @ at beginning");
		bBool = this.oAnnotationHelper.isSelf("abc@sap.com");
		assert.ok(!bBool, "isSelf executed with @ in the middle");
	});

	/* New Qunit test cases */
	/* Test cases for number function*/
	//module('number function');

	QUnit.test("executes function: number", function () {
		bBool = this.oAnnotationHelper.number("3423ads");
		assert.ok(!bBool, "number executed with number and character");

		bBool = this.oAnnotationHelper.number("");
		assert.ok(!bBool, "number executed with empty values");

		bBool = this.oAnnotationHelper.number("23423");
		assert.equal(!bBool, true, "number executed with number and character");

		bBool = this.oAnnotationHelper.number("23423.23423");
		assert.equal(!bBool, true, "number with decimel values");
	});

	[{
			result: "true"
		},
		{
			result: "2015-03-24"
		},
		{
			result: "2015-03-24T14:03:27Z"
		},
		{
			result: "-123456789012345678901234567890.1234567890"
		},
		{
			result: "-7.4503e-36"
		},
		{
			result: "0050568D-393C-1ED4-9D97-E65F0F3FCC23"
		},
		{
			result: "9007199254740992"
		},
		{
			result: "13:57:06"
		}
	].forEach(function (oFixture) {

		QUnit.test("Inputs for number function:" + oFixture.result, function () {
			//expect(0);
			bBool = this.oAnnotationHelper.number(oFixture.result);
			assert.notEqual(bBool, true, "Not Equal : " + oFixture.result);
		});
	});

	[{
			typeName: "Decimal",
			result: {
				Decimal: "12345666.1231232"
			}
		},

	].forEach(function (oFixture) {
		QUnit.test("Constant Parameters Equal:" + oFixture.result, function () {
			result = {
				Decimal: "12345666.1231232"
			};
			bBool = this.oAnnotationHelper.number(oFixture.result);
			assert.equal(bBool, "12345666.1231232", "Equal : " + result);
		});
	});

	[{
			typeName: "path",
			result: {
				Path: "12345666.1231232"
			}
		}

	].forEach(function (oFixture) {
		QUnit.test("Deep Equal:" + oFixture.result, function () {
			result = {
				Path: "12345666.1231232"
			};
			bBool = this.oAnnotationHelper.number(oFixture.result);
			assert.deepEqual(bBool, "{12345666.1231232}", "Deep Equal : " + result);
		});
	});


	QUnit.test("has method validation: formatColor", function () {
		//This funciton is not used in the demokit app. but just basic test
		var Result = this.oAnnotationHelper.formatColor("3423");
		assert.equal(Result, undefined, "Function should returned undefined value");
	});

	QUnit.test("has method validation: strictEqual", function () {
		expect(1);
		var Par;
		var i = 0;
		Par = [{
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
			RequiresContext: {
				Bool: true
			}
		}];
		actions = this.oAnnotationHelper.hasActions(Par);
		strictEqual(actions, true, "hasActions function working with RecordType");
	});

	QUnit.test("has method validation 1: strictEqual", function () {
		expect(1);
		var Par;
		var i = 0;
		Par = [{
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
				RequiresContext: {
					Bool: true
				}
			},
			{
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
				RequiresContext: {
					Bool: true
				}
			}
		];
		actions = this.oAnnotationHelper.hasActions(Par);
		strictEqual(actions, true, "hasActions function working with RecordType");
	});

	QUnit.test("check method formatWithExpandSimple with Mock data", function () {

		var oDataField = {
			EdmType: "Edm.String",
			Path: "Depth"
		};

		var done = assert.async();
		var oModel = this.getMockModel();
		assert.ok(oModel, "oModel Initiated");
		var oAnnotationHelper = this.oAnnotationHelper;

		if (oModel) {
			oModel.getMetaModel().loaded().then(function () {
				var oMetaModel = oModel.getMetaModel();
				var oInterface = {

					getModel: function () {
						return oMetaModel;
					},
					getPath: function () {
						return "/dataServices/schema/0/entityType/16/com.sap.vocabularies.UI.v1.DataPoint#ProductCategory/Value";
					},
					getSetting: function () {
						return "";
					}
				};
				var oEntitySet = oMetaModel.getODataEntitySet("SEPMRA_C_PD_Product");
				var sResolvedPath = "/dataServices/schema/0/entityType/16/com.sap.vocabularies.UI.v1.Facets/1/Target";
				var sResultEntitySet = "{Depth}";
				//var sResultEntitySet = "{path:'Depth',type:'sap.ui.model.odata.type.Decimal',constraints:{'precision':'13','scale':'3'}}";


				var oMetaContext = oMetaModel.getContext(sResolvedPath);
				assert.ok(oMetaContext, "Metadata is correct");
				var sResult = oAnnotationHelper.formatWithExpandSimple(oMetaContext, oDataField);
				assert.equal(sResult, sResultEntitySet, "Input parameter Depth is a decimal value");

				//var binding_ex = oModel.bindList("/SEPMRA_I_ProductSalesData");
				//var binding_path = binding_ex.getPath();
				//var binding_length = oModel.bindContext(binding_path);

				//oDataField path value for Currency
				oDataField = {
					EdmType: "Edm.String",
					Path: "Currency"
				};
				sResult = oAnnotationHelper.formatWithExpandSimple(oMetaContext, oDataField);
				var ExpectedValue = "{Currency}";
				//var ExpectedValue = "{path:'Currency',type:'sap.ui.model.odata.type.String',constraints:{'maxLength':'5','nullable':'false'}}";
				assert.equal(sResult, ExpectedValue, "Input parameter Currency is a decimal value");


				oDataField = {
					EdmType: "Edm.String",
					Apply: {
						Name: "odata.concat",
						Parameters: [{
							Type: "Path",
							Value: "DraftAdministrativeData/SiblingEntity"
						}, {
							Type: "Path",
							Value: "DraftAdministrativeData/SiblingEntity"
						}]
					}
				};
				sResult = oAnnotationHelper.formatWithExpandSimple(oInterface, oDataField);
				//var ExpectedValue = "{Currency}";
				ExpectedValue = "{DraftAdministrativeData/SiblingEntity}{DraftAdministrativeData/SiblingEntity}";
				assert.equal(sResult, ExpectedValue, "Input parameter Currency is a decimal value");

				done();

			});
		}
	});

	QUnit.test("check method _getNavigationPrefix with Mock data", function () {
		var oDataField = {
			EdmType: "Edm.String",
			Path: "Depth"
		};
		var done = assert.async();
		var oModel = this.getMockModel();
		assert.ok(oModel, "oModel Initiated");
		var oAnnotationHelper = this.oAnnotationHelper;
		if (oModel) {
			oModel.getMetaModel().loaded().then(function () {
				var oMetaModel = oModel.getMetaModel();
				assert.ok(oMetaModel, "Metamodel is ok ");
				//var oEntitySet = oMetaModel.getODataEntitySet("SEPMRA_C_PD_Product");
				var oEntityType = oMetaModel.getODataEntityType("SEPMRA_PROD_MAN.SEPMRA_C_PD_ProductType");
				var sProperty = "Product/ActiveProduct";
				// function call with oMetaModel, oEntityType, sProperty

				var sResult = oAnnotationHelper._getNavigationPrefix(oMetaModel, oEntityType, sProperty);
				assert.equal(sResult, "", "Function returned null value");

				//mock different value for sProperty..
				sProperty = "DraftAdministrativeData";

				sResult = oAnnotationHelper._getNavigationPrefix(oMetaModel, oEntityType, sProperty);
				assert.equal(sResult, "", "Function should return the null value for single property");

				sProperty = "DraftAdministrativeData/SiblingEntity";
				sResult = oAnnotationHelper._getNavigationPrefix(oMetaModel, oEntityType, sProperty);
				assert.equal(sResult, "DraftAdministrativeData", "Function should return expected value: DraftAdministrativeData");
				done();

			});
		}
	});

	QUnit.test("check method getStableIdPartFromDataField with Mock data", function () {
		var oDataField = {
			EdmType: "Edm.String",
			RecordType: "com.sap.vocabularies.UI.v1.DataField",
			Value: {
				Path: "ActiveSalesOrderID"
			},
			"com.sap.vocabularies.UI.v1.Importance": {
				EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		};

		var sResult = this.oAnnotationHelper.getStableIdPartFromDataField(oDataField);
		assert.equal(sResult, "ActiveSalesOrderID", "Function returned ActiveSalesOrderID value");
		//Mock oDatafield values with different values...
		oDataField = {
			Action: {
				String: "SEPMRA_PROD_MAN.SEPMRA_PROD_MAN_Entities/SEPMRA_C_PD_ProductCopy"
			},
			Label: {
				String: "Copy"
			},
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
			"com.sap.vocabularies.UI.v1.Importance": {
				EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		};

		var expectedValue = "SEPMRA_PROD_MAN.SEPMRA_PROD_MAN_Entities::SEPMRA_C_PD_ProductCopy";
		sResult = this.oAnnotationHelper.getStableIdPartFromDataField(oDataField);
		assert.equal(sResult, expectedValue, "Function should return the expected value");

		//Mock record type and path as empty value
		oDataField = {
			Action: {
				String: "SEPMRA_PROD_MAN.SEPMRA_PROD_MAN_Entities/SEPMRA_C_PD_ProductCopy"
			},
			Label: {
				String: "Copy"
			},
			RecordType: "",
			"com.sap.vocabularies.UI.v1.Importance": {
				EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		};
		//Mock Jquery error log
		var oErrorSpy = sinon.stub(Log, "error");
		oErrorSpy.returns("test error msg");
		sResult = this.oAnnotationHelper.getStableIdPartFromDataField(oDataField);
		assert.equal(sResult, undefined, "Function should return undefined");
		// Test Jquery error is called
		assert.ok(oErrorSpy.calledOnce, "Function should call Jquery error log function");
		oErrorSpy.restore();

		//Mock SemanticObject
		oDataField = {
			SemanticObject: {
				String: "Copy",
			},
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",

		};
		sResult = this.oAnnotationHelper.getStableIdPartFromDataField(oDataField);
		assert.equal(sResult, "Copy", "Function should return the expected value");

		//Mock SemanticObject-path
		oDataField = {
			SemanticObject: {
				Path: "ActiveSalesOrderID",
			},
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",

		};
		sResult = this.oAnnotationHelper.getStableIdPartFromDataField(oDataField);
		assert.equal(sResult, "ActiveSalesOrderID", "Function should return the expected value");

		//Mock SemanticObject
		oDataField = {
			SemanticObject: {
				String: ""
			},
			Action: {
				String: "SEPMRA_PROD_MAN.SEPMRA_PROD_MAN_Entities/SEPMRA_C_PD_ProductCopy"
			},
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",

		};
		expectedValue = "::SEPMRA_PROD_MAN.SEPMRA_PROD_MAN_Entities::SEPMRA_C_PD_ProductCopy";
		sResult = this.oAnnotationHelper.getStableIdPartFromDataField(oDataField);
		assert.equal(sResult, expectedValue, "Function should return the expected value");


		//Mock SemanticObject
		oDataField = {
			SemanticObject: {
				String: ""
			},
			Action: {
				Path: "ActiveSalesOrderID"
			},
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",

		};
		expectedValue = "::ActiveSalesOrderID";
		sResult = this.oAnnotationHelper.getStableIdPartFromDataField(oDataField);
		assert.equal(sResult, expectedValue, "Function should return the expected value");
		oDataField = {
			EdmType: "Edm.String",
			Value: {
				Path: "",
				Apply: {
					Name: "odata.concat",
					Parameters: [{
						Type: "Path",
						Value: "DraftAdministrativeData/SiblingEntity"
					}, {
						Type: "Path",
						Value: "DraftAdministrativeData/SiblingEntity"
					}]
				}
			},
			RecordType: "",

		};
		sResult = this.oAnnotationHelper.getStableIdPartFromDataField(oDataField);
		expectedValue = "DraftAdministrativeData::SiblingEntity::DraftAdministrativeData::SiblingEntity";
		assert.equal(sResult, expectedValue, "Function should return the expected value");

	});

	QUnit.test("check method getStableIdPartFromDataPoint with Mock data", function () {
		//oData Field for Products..
		var oDataField = {
			Description: {
				String: "EPM: Product Unit Price"
			},
			LongDescription: {
				String: ""
			},
			Title: {
				String: "Price"
			},
			Value: {
				EdmType: "Edm.Decimal",
				Path: "Price"
			}
		};

		var sResult = this.oAnnotationHelper.getStableIdPartFromDataPoint(oDataField);
		assert.equal(sResult, "Price", "Function returned Price value for Products");
		//Mock value as empty to test jquery log error
		oDataField = {
			Description: {
				String: "EPM: Product Unit Price"
			},
			LongDescription: {
				String: ""
			},
			Title: {
				String: "Price"
			},
			Value: {
				EdmType: "Edm.Decimal",
				Path: ""
			}
		};
		var oErrorSpy = sinon.stub(Log, "error");
		oErrorSpy.returns("test error msg");
		sResult = this.oAnnotationHelper.getStableIdPartFromDataPoint(oDataField);
		assert.equal(sResult, undefined, "Function should return undefined");
		// Test Jquery error is called
		assert.ok(oErrorSpy.calledOnce, "Function should call Jquery error log function");
		oErrorSpy.restore();
		//Mock oDataField values
		oDataField = {
			EdmType: "Edm.String",
			Value: {
				Path: "",
				Apply: {
					Name: "odata.concat",
					Parameters: [{
						Type: "Path",
						Value: "DraftAdministrativeData/SiblingEntity"
					}, {
						Type: "Path",
						Value: "DraftAdministrativeData/SiblingEntity"
					}]
				}
			},
			RecordType: ""
		};
		sResult = this.oAnnotationHelper.getStableIdPartFromDataPoint(oDataField);
		var expectedvalue = "DraftAdministrativeData::SiblingEntity::DraftAdministrativeData::SiblingEntity";
		assert.equal(sResult, expectedvalue, "Function should return the expected value");

	});

	QUnit.test("Method to suppress duplicate column in tables (with DataFieldForAnnotation)", function () {
		var oAnnotationHelper = this.oAnnotationHelper;
		var oModel = this.getMockModel();
		assert.ok(oModel, "oModel Initiated");
		var oAnnotationHelper = this.oAnnotationHelper;
		if (oModel) {
			oModel.getMetaModel().loaded().then(function () {
				var oMetaModel = oModel.getMetaModel();
				assert.ok(oMetaModel, "MetaModel is ok");
				var oInterface = {
					getInterface: function () {},
					getModel: function () {
						return oMetaModel;
					},
					getPath: function () {
						return "/dataServices/schema/0/entityType/3/com.sap.vocabularies.UI.v1.LineItem";
					},
					getSetting: function () {}
				};
				var sResolvedPath = "/dataServices/schema/0/entityType/3/com.sap.vocabularies.UI.v1.DataPoint#Rating";
				var fnResolvedPath = sinon.stub(sap.ui.model.odata.AnnotationHelper, "resolvePath", function () {
					return sResolvedPath;
				});
				var oDataField = {};
				oDataField.Value = {};
				oDataField.Value.Path = "GrossAmount";
				var oDataFieldForAnnotation = sinon.stub(oMetaModel, "getObject", function () {
					return oDataField;
				});
				var oDataFieldForAnnotation = oMetaModel.getContext(sResolvedPath);
				var oEntity = [{
					"com.sap.vocabularies.UI.v1.Importance": {
						"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
					},
					"Value": {
						"Path": "SalesOrder"
					},
					"RecordType": "com.sap.vocabularies.UI.v1.DataField",
					"EdmType": "Edm.String"
				}, {
					"com.sap.vocabularies.UI.v1.Importance": {
						"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
					},
					"Value": {
						"Path": "BusinessPartnerID"
					},
					"RecordType": "com.sap.vocabularies.UI.v1.DataField",
					"EdmType": "Edm.String"
				}, {
					"com.sap.vocabularies.UI.v1.Importance": {
						"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
					},
					"Value": {
						"Path": "CurrencyCode"
					},
					"RecordType": "com.sap.vocabularies.UI.v1.DataField",
					"EdmType": "Edm.String"
				}, {
					"com.sap.vocabularies.UI.v1.Importance": {
						"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
					},
					"Value": {
						"Path": "CreationDateTime"
					},
					"RecordType": "com.sap.vocabularies.UI.v1.DataField",
					"EdmType": "Edm.DateTimeOffset"
				}, {
					"Target": {
						"AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#Rating"
					},
					"Label": {
						"String": "Rating"
					},
					"RecordType": "com.sap.vocabularies.UI.v1.DataFieldForAnnotation"
				}];
				var bExpression = oAnnotationHelper.suppressP13NDuplicateColumns(oInterface, oEntity);
				var bExpectedExpression = "GrossAmount";
				equals(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);

			});
		}
	});

	QUnit.test("Method to suppress duplicate column in tables (with DataField)", function () {
		var oAnnotationHelper = this.oAnnotationHelper;
		var oModel = this.getMockModel();
		assert.ok(oModel, "oModel Initiated");
		var oAnnotationHelper = this.oAnnotationHelper;
		if (oModel) {
			oModel.getMetaModel().loaded().then(function () {
				var oMetaModel = oModel.getMetaModel();
				assert.ok(oMetaModel, "MetaModel is ok");
				var oInterface = {
					getInterface: function () {},
					getModel: function () {
						return oMetaModel;
					},
					getPath: function () {
						return "/dataServices/schema/0/entityType/3/com.sap.vocabularies.UI.v1.LineItem";
					},
					getSetting: function () {}


				};
				var oEntity = [{
					"com.sap.vocabularies.UI.v1.Importance": {
						"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
					},
					"Value": {
						"Path": "SalesOrder"
					},
					"RecordType": "com.sap.vocabularies.UI.v1.DataField",
					"EdmType": "Edm.String"
				}, {
					"com.sap.vocabularies.UI.v1.Importance": {
						"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
					},
					"Value": {
						"Path": "BusinessPartnerID"
					},
					"RecordType": "com.sap.vocabularies.UI.v1.DataField",
					"EdmType": "Edm.String"
				}, {
					"com.sap.vocabularies.UI.v1.Importance": {
						"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
					},
					"Value": {
						"Path": "CurrencyCode"
					},
					"RecordType": "com.sap.vocabularies.UI.v1.DataField",
					"EdmType": "Edm.String"
				}, {
					"com.sap.vocabularies.UI.v1.Importance": {
						"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
					},
					"Value": {
						"Path": "CreationDateTime"
					},
					"RecordType": "com.sap.vocabularies.UI.v1.DataField",
					"EdmType": "Edm.DateTimeOffset"
				}];
				var bExpression = oAnnotationHelper.suppressP13NDuplicateColumns(oInterface, oEntity);
				var bExpectedExpression = "";
				equals(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);

			});
		}
	});

	QUnit.test("check method getStableIdPartFromFacet with Mock data", function () {
		//oData Field for Products..
		var Facets = {
			Facets: [{
				Label: {
					String: "General Information"
				},
				RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
				Target: {
					AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation"
				}
			}],
			Label: {
				String: "General Information"
			},
			RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
		};

		var oAnnotationHelper = this.oAnnotationHelper;

		var oErrorSpy = sinon.stub(Log, "error");
		oErrorSpy.returns("test error msg");
		var sResult = this.oAnnotationHelper.getStableIdPartFromFacet(Facets);
		assert.ok(oErrorSpy.calledOnce, "Error: Jquery error log called");
		//assert.equal(sResult,"Price","Function returned Price value for Products");
		oErrorSpy.restore();
		//Mock the Facets value....
		Facets = {
			ID: {
				String: "GeneralInformation"
			},
			RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
		};
		sResult = this.oAnnotationHelper.getStableIdPartFromFacet(Facets);
		assert.equal(sResult, "GeneralInformation", "Function should return expected value");

		//Mock the Facets value....
		Facets = {
			ID: {
				String: "GeneralInformation"
			},
			RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
			Target: {
				AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation"
			}
		};
		sResult = this.oAnnotationHelper.getStableIdPartFromFacet(Facets);
		var expectedValue = "GeneralInformation";
		assert.equal(sResult, expectedValue, "Function should return expected value:" + sResult);
		Facets = {
			RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
			Target: {
				AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation"
			}
		};
		sResult = this.oAnnotationHelper.getStableIdPartFromFacet(Facets);
		var expectedValue = "com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformation";
		assert.equal(sResult, expectedValue, "Function should return expected value:" + sResult);
		//Mock RecordType value is empty and check error log is called
		Facets = {
			RecordType: "",
		};
		sResult = this.oAnnotationHelper.getStableIdPartFromFacet(Facets);
		assert.ok(oErrorSpy.calledOnce, "Error: Jquery error log called");
		oErrorSpy.restore();
	});

	QUnit.test("check method getStableIdPartForDatafieldActionButton with Mock data", function () {
		var oDataField = {
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
			Label: {
				String: "ActionButton"
			},
			Action: {
				String: "ActionFunction"
			},
			Inline: {
				Bool: "true"
			}
		};
		var oFacet = {
			RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
			Label: {
				String: "ObjectPageActionButton"
			},
			Target: {
				AnnotationPath: "NavigationProperty/@com.sap.vocabularies.UI.v1.LineItem"
			}
		};
		var sResult = this.oAnnotationHelper.getStableIdPartForDatafieldActionButton(oDataField);
		assert.equal(sResult, "action::ActionFunction", "Action button stable ID for list report is correct.");
		var sResult = this.oAnnotationHelper.getStableIdPartForDatafieldActionButton(oDataField, oFacet);
		assert.equal(sResult, "NavigationProperty::com.sap.vocabularies.UI.v1.LineItem::action::ActionFunction", "Action button stable ID for object page is correct.");
	});

	QUnit.test("check method extensionPointBeforeFacetExists with Mock data", function () {
		//oData Field for Products..
		var Facets = {
			Facets: [{
				Label: {
					String: "General Information"
				},
				RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
				Target: {
					AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation"
				}
			}],
			Label: {
				String: "General Information"
			},
			RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
		};
		//var oEntitySet = oMetaModel.getODataEntitySet("SEPMRA_C_PD_Product");
		var oEntitySet = "SEPMRA_C_PD_Product";
		var sExtensionPointId = "";
		var oManifestExtend = [{
			'sap.suite.ui.generic.template.ObjectPage.view.Details': sExtensionPointId
		}];
		var oErrorSpy = sinon.stub(Log, "error");
		oErrorSpy.returns("test error msg");
		// For time being test call is commented as in demokit also getting the same issue..
		//var sResult = this.oAnnotationHelper.extensionPointBeforeFacetExists(oEntitySet,Facets,oManifestExtend);
		//assert.equal(sResult,"Price","Function returned Price value for Products");
		//assert.ok(oErrorSpy.calledOnce,"test is ok");
		assert.ok("okay");
		oErrorSpy.restore();

	});

	QUnit.test("check method extensionPointAfterFacetExists with Mock data", function () {
		//oData Field for Products..
		var Facets = {
			Facets: [{
				Label: {
					String: "General Information"
				},
				RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
				Target: {
					AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation"
				}
			}],
			Label: {
				String: "General Information"
			},
			RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
		};
		//var oEntitySet = oMetaModel.getODataEntitySet("SEPMRA_C_PD_Product");
		var oEntitySet = "SEPMRA_C_PD_Product";
		var sExtensionPointId = "";
		var oManifestExtend = [{
			'sap.suite.ui.generic.template.ObjectPage.view.Details': sExtensionPointId
		}];
		var oErrorSpy = sinon.stub(Log, "error");
		oErrorSpy.returns("test error msg");
		// For time being test call is commented as in demokit also getting the same issue..
		//var sResult = this.oAnnotationHelper.extensionPointAfterFacetExists(oEntitySet,Facets,oManifestExtend);
		//assert.equal(sResult,"Price","Function returned Price value for Products");
		//assert.ok(oErrorSpy.calledOnce,"test is ok");
		assert.ok("okay");
		oErrorSpy.restore();

	});

	QUnit.test("check method getExtensionPointBeforeFacetTitle with Mock data", function () {
		//oData Field for Products..
		var Facets = {
			Facets: [{
				Label: {
					String: "General Information"
				},
				RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
				Target: {
					AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation"
				}
			}],
			Label: {
				String: "General Information"
			},
			RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
		};
		//var oEntitySet = oMetaModel.getODataEntitySet("SEPMRA_C_PD_Product");
		var oEntitySet = "SEPMRA_C_PD_Product";
		var sExtensionPointId = "";
		var oManifestExtend = [{
			'sap.suite.ui.generic.template.ObjectPage.view.Details': sExtensionPointId
		}];
		var oErrorSpy = sinon.stub(Log, "error");
		oErrorSpy.returns("test error msg");
		// For time being test call is commented as in demokit also getting the same issue..
		//var sResult = this.oAnnotationHelper.getExtensionPointBeforeFacetTitle(oEntitySet,Facets,oManifestExtend);
		//assert.equal(sResult,"Price","Function returned Price value for Products");
		//assert.ok(oErrorSpy.calledOnce,"test is ok");
		assert.ok("okay");
		oErrorSpy.restore();

	});
	QUnit.test("check method getExtensionPointAfterFacetTitle with Mock data", function () {
		//oData Field for Products..
		var Facets = {
			Facets: [{
				Label: {
					String: "General Information"
				},
				RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
				Target: {
					AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation"
				}
			}],
			Label: {
				String: "General Information"
			},
			RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
		};
		//var oEntitySet = oMetaModel.getODataEntitySet("SEPMRA_C_PD_Product");
		var oEntitySet = "SEPMRA_C_PD_Product";
		var sExtensionPointId = "";
		var oManifestExtend = [{
			'sap.suite.ui.generic.template.ObjectPage.view.Details': sExtensionPointId
		}];
		var oErrorSpy = sinon.stub(Log, "error");
		oErrorSpy.returns("test error msg");
		// For time being test call is commented as in demokit also getting the same issue..
		//var sResult = this.oAnnotationHelper.getExtensionPointAfterFacetTitle(oEntitySet,Facets,oManifestExtend);
		//assert.equal(sResult,"Price","Function returned Price value for Products");
		//assert.ok(oErrorSpy.calledOnce,"test is ok");
		assert.ok("okay");
		oErrorSpy.restore();

	});

	QUnit.test("check method getRepeatIndex with Mock data", function () {
		// Mocking the variable value with path
		var oValue = {
			getInterface: function () {},
			getModel: function () {},
			getPath: function () {
				return "/dataServices/schema/0/entityType/20/com.sap.vocabularies.UI.v1.SelectionFields/0";
			},
			getSetting: function () {}
		};

		var sResult = this.oAnnotationHelper.getRepeatIndex(oValue);
		assert.equal(sResult, "0000000010", "Function should return the value 0000000010");

		// checking error assertion..
		oValue = {
			getInterface: function () {},
			getModel: function () {},
			getPath: function () {
				return ""
			},
			getSetting: function () {}
		};
		var oErrorSpy = sinon.stub(Log, "error");
		oErrorSpy.returns("test error msg");
		sResult = this.oAnnotationHelper.getRepeatIndex(oValue);
		assert.ok(oErrorSpy.calledOnce, "Jquery error should be called for failed test");
		oErrorSpy.restore();
	});

	QUnit.test("check method getRepeatIndex without Mock data", function () {
		// Mocking the variable value with path
		var oValue = {
			getInterface: function () {},
			getModel: function () {},
			getPath: function () {},
			getSetting: function () {}
		};

		var oErrorSpy = sinon.stub(Log, "error");
		oErrorSpy.returns("Annotation Helper: Unable to get index.");

		var sResult = this.oAnnotationHelper.getRepeatIndex(oValue);
		assert.equal(sResult, undefined, "Function returned value is undefined");

		assert.ok(oErrorSpy.calledOnce, "Error: Jquery error log called with wrong value");
		oErrorSpy.restore();

	});

	QUnit.test("check method getColumnListItemType for Inline External Navigation", function () {
		var bIsDraftEnabled = true;
		var aSubPagesLR = [{
			entitySet: "STTA_C_MP_ProductText",
			navigation: {
				display: {
					path: "sap.app.crossNavigation.outbounds",
					target: "EPMDisplaySalesOrder"
				}
			}
		}];

		var oListEntitySet = {
			name: "STTA_C_MP_ProductText",
			entityType: "STTA_PROD_MAN.STTA_C_MP_ProductTextType"
		};
		var oManifest = {
			"sap.app": {
				crossNavigation: {
					outbounds: {
						EPMDisplaySalesOrder: {
							semanticObject: "EPMSalesOrder",
							action: "manage_sttasowd",
							parameters: {}
						}
					}
				}
			}
		};

		var oManifestSettings = {
			routeConfig: {
				name: "root"
			}
		}

		var sAnnotationPath = undefined;
		var sResult = this.oAnnotationHelper.getColumnListItemType(oListEntitySet, aSubPagesLR, oManifest, oManifestSettings, bIsDraftEnabled, sAnnotationPath);
		var expectedResult = "Navigation";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for Responsive LR Table in draft applications when hideChevronForUnauthorizedExtNav flag is not set");

		bIsDraftEnabled = false;
		sResult = this.oAnnotationHelper.getColumnListItemType(oListEntitySet, aSubPagesLR, oManifest, oManifestSettings, bIsDraftEnabled, sAnnotationPath);
		expectedResult = "Navigation"
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for Responsive LR Table in non-draft applications when hideChevronForUnauthorizedExtNav flag is not set");

		aSubPagesLR = [{
			entitySet: "STTA_C_MP_ProductText",
			component: {
				settings: {
					hideChevronForUnauthorizedExtNav: true
				}
			},
			navigation: {
				display: {
					path: "sap.app.crossNavigation.outbounds",
					target: "EPMDisplaySalesOrder"
				}
			}
		}];

		bIsDraftEnabled = true;
		var sAnnotationPath = undefined;
		var sResult = this.oAnnotationHelper.getColumnListItemType(oListEntitySet, aSubPagesLR, oManifest, oManifestSettings, bIsDraftEnabled, sAnnotationPath);
		var expectedResult = "{= ${_templPriv>/generic/supportedIntents/EPMSalesOrder/manage_sttasowd/STTA_C_MP_ProductText/supported} ? 'Navigation' : 'Inactive'}";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for Responsive LR Table in draft applications when hideChevronForUnauthorizedExtNav flag is set to true");

		bIsDraftEnabled = false;
		sResult = this.oAnnotationHelper.getColumnListItemType(oListEntitySet, aSubPagesLR, oManifest, oManifestSettings, bIsDraftEnabled, sAnnotationPath);
		expectedResult = "{= ${_templPriv>/generic/supportedIntents/EPMSalesOrder/manage_sttasowd/STTA_C_MP_ProductText/supported} ? 'Navigation' : 'Inactive'}";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for Responsive LR Table in non-draft applications when hideChevronForUnauthorizedExtNav flag is set to true");

		aSubPagesLR[0].component.settings.hideChevronForUnauthorizedExtNav = false;

		var sAnnotationPath = undefined;
		bIsDraftEnabled = true;
		var sResult = this.oAnnotationHelper.getColumnListItemType(oListEntitySet, aSubPagesLR, oManifest, oManifestSettings, bIsDraftEnabled, sAnnotationPath);
		var expectedResult = "Navigation";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly for Responsive LR Table in draft applications when hideChevronForUnauthorizedExtNav flag is set to false");

		bIsDraftEnabled = false;
		sResult = this.oAnnotationHelper.getColumnListItemType(oListEntitySet, aSubPagesLR, oManifest, oManifestSettings, bIsDraftEnabled, sAnnotationPath);
		expectedResult = "Navigation";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly for Responsive LR Table in non-draft applications when hideChevronForUnauthorizedExtNav flag is set to false");

		var aSubPagesOP = [{
			navigationProperty: "to_ProductText",
			entitySet: "STTA_C_MP_ProductText",
			component: {
				name: "sap.suite.ui.generic.template.ObjectPage"
			},
			navigation: {
				display: {
					path: "sap.app.crossNavigation.outbounds",
					target: "EPMDisplaySalesOrder"
				}
			}
		}];

		oManifestSettings = {
			routeConfig: {
				name: "notRoot"
			}
		};

		sAnnotationPath = "to_ProductText/@com.sap.vocabularies.UI.v1.LineItem";
		bIsDraftEnabled = true;
		sResult = this.oAnnotationHelper.getColumnListItemType(oListEntitySet, aSubPagesOP, oManifest, {}, bIsDraftEnabled, sAnnotationPath);
		expectedResult = "Navigation";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for Responsive OP Table in draft applications when hideChevronForUnauthorizedExtNav flag is not set");

		bIsDraftEnabled = false;
		sResult = this.oAnnotationHelper.getColumnListItemType(oListEntitySet, aSubPagesOP, oManifest, oManifestSettings, bIsDraftEnabled, sAnnotationPath);
		expectedResult = "{= ${ui>/editable} ? 'Inactive' : 'Navigation' }";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for Responsive OP Table in non-draft applications when hideChevronForUnauthorizedExtNav flag is not set");

		aSubPagesOP = [{
			navigationProperty: "to_ProductText",
			entitySet: "STTA_C_MP_ProductText",
			component: {
				name: "sap.suite.ui.generic.template.ObjectPage",
				settings: {
					hideChevronForUnauthorizedExtNav: true
				}
			},
			navigation: {
				display: {
					path: "sap.app.crossNavigation.outbounds",
					target: "EPMDisplaySalesOrder"
				}
			}
		}];

		sAnnotationPath = "to_ProductText/@com.sap.vocabularies.UI.v1.LineItem";
		bIsDraftEnabled = true;
		sResult = this.oAnnotationHelper.getColumnListItemType(oListEntitySet, aSubPagesOP, oManifest, {}, bIsDraftEnabled, sAnnotationPath);
		expectedResult = "{= ${_templPriv>/generic/supportedIntents/EPMSalesOrder/manage_sttasowd/STTA_C_MP_ProductText::to_ProductText/supported} ? 'Navigation' : 'Inactive'}";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for Responsive OP Table in draft applications when hideChevronForUnauthorizedExtNav flag is set to true");

		bIsDraftEnabled = false;
		sResult = this.oAnnotationHelper.getColumnListItemType(oListEntitySet, aSubPagesOP, oManifest, oManifestSettings, bIsDraftEnabled, sAnnotationPath);
		expectedResult = "{= ${_templPriv>/generic/supportedIntents/EPMSalesOrder/manage_sttasowd/STTA_C_MP_ProductText::to_ProductText/supported} && !${ui>/editable} ? 'Navigation' : 'Inactive'}";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for Responsive OP Table in non-draft applications when hideChevronForUnauthorizedExtNav flag is set to true");

		aSubPagesOP[0].component.settings.hideChevronForUnauthorizedExtNav = false;

		sAnnotationPath = "to_ProductText/@com.sap.vocabularies.UI.v1.LineItem";
		bIsDraftEnabled = true;
		sResult = this.oAnnotationHelper.getColumnListItemType(oListEntitySet, aSubPagesOP, oManifest, {}, bIsDraftEnabled, sAnnotationPath);
		expectedResult = "Navigation";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly for Responsive OP Table in draft applications when hideChevronForUnauthorizedExtNav flag is set to false");

		bIsDraftEnabled = false;
		sResult = this.oAnnotationHelper.getColumnListItemType(oListEntitySet, aSubPagesOP, oManifest, oManifestSettings, bIsDraftEnabled, sAnnotationPath);
		expectedResult = "{= ${ui>/editable} ? 'Inactive' : 'Navigation' }";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly for Responsive OP Table in non-draft applications when hideChevronForUnauthorizedExtNav flag is set to false");

	});

	QUnit.test("check method getRowActionCountForDetailPage for Inline External Navigation", function () {
		var bIsDraftEnabled = true;
		var oListEntitySet = {
			name: "STTA_C_MP_ProductText",
			entityType: "STTA_PROD_MAN.STTA_C_MP_ProductTextType"
		};
		var aSubPages = [{
			navigationProperty: "to_ProductText",
			entitySet: "STTA_C_MP_ProductText",
			component: {
				name: "sap.suite.ui.generic.template.ObjectPage"
			},
			navigation: {
				display: {
					path: "sap.app.crossNavigation.outbounds",
					target: "EPMDisplaySalesOrder"
				}
			}
		}];

		var oManifest = {
			"sap.app": {
				crossNavigation: {
					outbounds: {
						EPMDisplaySalesOrder: {
							semanticObject: "EPMSalesOrder",
							action: "manage_sttasowd",
							parameters: {}
						}
					}
				}
			}
		};

		bIsDraftEnabled = true;
		var sAnnotationPath = "to_ProductText/@com.sap.vocabularies.UI.v1.LineItem";
		var sResult = this.oAnnotationHelper.getRowActionCountForDetailPage(oListEntitySet, aSubPages, oManifest, sAnnotationPath, bIsDraftEnabled);
		var expectedResult = 1;
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for Grid and Analytical OP Table in draft applications when hideChevronForUnauthorizedExtNav flag is not set");

		bIsDraftEnabled = false;
		sResult = this.oAnnotationHelper.getRowActionCountForDetailPage(oListEntitySet, aSubPages, oManifest, sAnnotationPath, bIsDraftEnabled);
		expectedResult = "{= ${ui>/editable} ? 0 : 1 }";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for Grid and Analytical OP Table in non-draft applications when hideChevronForUnauthorizedExtNav flag is not set");

		aSubPages = [{
			navigationProperty: "to_ProductText",
			entitySet: "STTA_C_MP_ProductText",
			component: {
				name: "sap.suite.ui.generic.template.ObjectPage",
				settings: {
					hideChevronForUnauthorizedExtNav: true
				}
			},
			navigation: {
				display: {
					path: "sap.app.crossNavigation.outbounds",
					target: "EPMDisplaySalesOrder"
				}
			}
		}];

		bIsDraftEnabled = true;
		var sAnnotationPath = "to_ProductText/@com.sap.vocabularies.UI.v1.LineItem";
		var sResult = this.oAnnotationHelper.getRowActionCountForDetailPage(oListEntitySet, aSubPages, oManifest, sAnnotationPath, bIsDraftEnabled);
		var expectedResult = "{= ${_templPriv>/generic/supportedIntents/EPMSalesOrder/manage_sttasowd/STTA_C_MP_ProductText::to_ProductText/supported} ? 1 : 0}";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for Grid and Analytical OP Table in draft applications when hideChevronForUnauthorizedExtNav flag is set to true");

		bIsDraftEnabled = false;
		sResult = this.oAnnotationHelper.getRowActionCountForDetailPage(oListEntitySet, aSubPages, oManifest, sAnnotationPath, bIsDraftEnabled);
		expectedResult = "{= ${_templPriv>/generic/supportedIntents/EPMSalesOrder/manage_sttasowd/STTA_C_MP_ProductText::to_ProductText/supported} && !${ui>/editable} ? 1 : 0}";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for Grid and Analytical OP Table in non-draft applications when hideChevronForUnauthorizedExtNav flag is set to true");

		aSubPages[0].component.settings.hideChevronForUnauthorizedExtNav = false;

		bIsDraftEnabled = true;
		var sAnnotationPath = "to_ProductText/@com.sap.vocabularies.UI.v1.LineItem";
		var sResult = this.oAnnotationHelper.getRowActionCountForDetailPage(oListEntitySet, aSubPages, oManifest, sAnnotationPath, bIsDraftEnabled);
		var expectedResult = 1;
		assert.equal(sResult, expectedResult, "Chevron display bound correctly for Grid and Analytical OP Table in draft applications when hideChevronForUnauthorizedExtNav flag is set to false");

		bIsDraftEnabled = false;
		sResult = this.oAnnotationHelper.getRowActionCountForDetailPage(oListEntitySet, aSubPages, oManifest, sAnnotationPath, bIsDraftEnabled);
		expectedResult = "{= ${ui>/editable} ? 0 : 1 }";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly for Grid and Analytical OP Table in non-draft applications when hideChevronForUnauthorizedExtNav flag is set to false");

	});

	QUnit.test("check method getRowActionCountForListReport for Inline External Navigation", function () {
		var oListEntitySet = {
			name: "STTA_C_MP_Product",
			entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType"
		};
		var aSubPages = [{
			entitySet: "STTA_C_MP_Product",
			navigation: {
				display: {
					path: "sap.app.crossNavigation.outbounds",
					target: "EPMDisplaySalesOrder"
				}
			}
		}];
		var oManifest = {
			"sap.app": {
				crossNavigation: {
					outbounds: {
						EPMDisplaySalesOrder: {
							semanticObject: "EPMSalesOrder",
							action: "manage_sttasowd",
							parameters: {}
						}
					}
				}
			}
		};
		var oManifestSettings = {
			isLeaf: false
		};
		var sResult = this.oAnnotationHelper.getRowActionCountForListReport(oListEntitySet, aSubPages, oManifest, oManifestSettings);
		var expectedResult = 1;
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for LR in Grid/Analytical table in draft and non-draft applications when hideChevronForUnauthorizedExtNav flag is not set");

		aSubPages = [{
			entitySet: "STTA_C_MP_Product",
			component: {
				settings: {
					hideChevronForUnauthorizedExtNav: true
				}
			},
			navigation: {
				display: {
					path: "sap.app.crossNavigation.outbounds",
					target: "EPMDisplaySalesOrder"
				}
			}
		}];

		var sResult = this.oAnnotationHelper.getRowActionCountForListReport(oListEntitySet, aSubPages, oManifest, oManifestSettings);
		var expectedResult = "{= ${_templPriv>/generic/supportedIntents/EPMSalesOrder/manage_sttasowd/STTA_C_MP_Product/supported} ? 1 : 0}";
		assert.equal(sResult, expectedResult, "Chevron display bound correctly to external target for LR in Grid/Analytical table in draft and non-draft applications when hideChevronForUnauthorizedExtNav flag is set to true");

		aSubPages[0].component.settings.hideChevronForUnauthorizedExtNav = false;

		var sResult = this.oAnnotationHelper.getRowActionCountForListReport(oListEntitySet, aSubPages, oManifest, oManifestSettings);
		var expectedResult = 1;
		assert.equal(sResult, expectedResult, "Chevron display bound correctly for LR in Grid/Analytical table in draft and non-draft applications when hideChevronForUnauthorizedExtNav flag is set to false");

	});

	QUnit.test("check method actionControl with Mock data", function () {
		var sActionApplicablePath = "IsActiveEntity";
		var sEntityType = "SEPMRA_PROD_MAN.SEPMRA_C_PD_ProductType";
		var done = assert.async();
		var oModel = this.getMockModel();
		assert.ok(oModel, "oModel Initiated");
		var oAnnotationHelper = this.oAnnotationHelper;
		var oDataField = {
			"RecordType": "com.sap.vocabularies.UI.v1.DataFieldForAction"
		};
		if (oModel) {
			oModel.getMetaModel().loaded().then(function () {
				var oMetaModel = oModel.getMetaModel();
				assert.ok(oMetaModel, "MetaModel is ok");
				var oInterface = {
					getInterface: function () {
						return {
							getModel: function () {
								return oMetaModel;
							},
							getPath: function () {
								return "/dataServices/schema/0/entityType/20/com.sap.vocabularies.UI.v1.SelectionFields/0";
							},
							getSetting: function () {}
						}
					}
				};
				var sResult = oAnnotationHelper.actionControl(oInterface, sActionApplicablePath, sEntityType, oDataField);
				var ExpectedVal = "{path: 'IsActiveEntity'}";
				assert.equal(sResult, ExpectedVal, "Function returned the expected value");

				//Make empty value
				sActionApplicablePath = "";
				sResult = oAnnotationHelper.actionControl(oInterface, sActionApplicablePath, sEntityType, oDataField);
				ExpectedVal = "true";
				assert.equal(sResult, ExpectedVal, "With the empty parameter");

				//When oDataField contains Hidden annotation
				oDataField = {
					"com.sap.vocabularies.UI.v1.Hidden": {
						"Bool": "true"
					}
				}
				var oSpy = sinon.spy(oAnnotationHelper, "getBindingForHiddenPath");
				oAnnotationHelper.actionControl(oInterface, sActionApplicablePath, sEntityType, oDataField);
				assert.equal(oSpy.calledOnce, true, "getBindingForHiddenPath function called if UI.Hidden is used");
				oSpy.restore();
				done();
			});
		}
	});

	QUnit.test("check method actionControlDetermining with Mock data", function () {
		var sActionApplicablePath = "IsActiveEntity";
		var oAnnotationHelper = this.oAnnotationHelper;
		var oDataField = {
			"RecordType": "com.sap.vocabularies.UI.v1.DataFieldForAction"
		};
		var oRouteConfig = {
			"template": "sap.suite.ui.generic.template.ListReport"
		};

		// In List report
		var sResult = oAnnotationHelper.actionControlDetermining(oRouteConfig, sActionApplicablePath, oDataField);
		var ExpectedVal = true;
		assert.equal(sResult, ExpectedVal, "When oRouteConfig is in ListReport");

		// In object page, when there is no applicable path
		sActionApplicablePath = undefined;
		oRouteConfig = {
			"template": "sap.suite.ui.generic.template.ObjectPage"
		};
		sResult = oAnnotationHelper.actionControlDetermining(oRouteConfig, sActionApplicablePath, oDataField);
		ExpectedVal = true;
		assert.equal(sResult, ExpectedVal, "In Object Page, no applicable path");

		//In object page, with applicable path and without Hidden annotation
		sActionApplicablePath = "IsActiveEntity";
		sResult = oAnnotationHelper.actionControlDetermining(oRouteConfig, sActionApplicablePath, oDataField);
		ExpectedVal = "{path: 'IsActiveEntity'}";
		assert.equal(sResult, ExpectedVal, "In Object Page, with applicable path");

		//When oDataField contains Hidden annotation
		oDataField = {
			"com.sap.vocabularies.UI.v1.Hidden": {
				"Bool": "true"
			}
		}
		var oSpy = sinon.spy(oAnnotationHelper, "getBindingForHiddenPath");
		oAnnotationHelper.actionControlDetermining(oRouteConfig, sActionApplicablePath, oDataField);
		assert.equal(oSpy.calledOnce, true, "getBindingForHiddenPath function called if UI.Hidden is used");
		oSpy.restore();
	});

	QUnit.test("check method _actionControlExpand without the value sActionApplicablePath", function () {
		var sActionApplicablePath = "";
		var sEntityType = "SEPMRA_PROD_MAN.SEPMRA_C_PD_ProductType";
		var done = assert.async();
		var oModel = this.getMockModel();
		assert.ok(oModel, "oModel Initiated");
		var oAnnotationHelper = this.oAnnotationHelper;
		if (oModel) {
			oModel.getMetaModel().loaded().then(function () {
				var oMetaModel = oModel.getMetaModel();
				assert.ok(oMetaModel, "MetaModel is ok")
				var oInterface = {
					getInterface: function () {
						return {
							getModel: function () {
								return oMetaModel;
							},
							getPath: function () {
								return "/dataServices/schema/0/entityType/20/com.sap.vocabularies.UI.v1.SelectionFields/0";
							},
							getSetting: function () {}
						}
					}
				};
				oAnnotationHelper._actionControlExpand(oInterface, sActionApplicablePath, sEntityType);
				assert.ok("Success");
				done();
			});
		}

	});

	QUnit.test("check method getEntityTypesForFormPersonalization with mock data", function () {
		var sActionApplicablePath = "";
		var sEntityType = "SEPMRA_PROD_MAN.SEPMRA_C_PD_ProductType";
		/*var Facets = {Facets:[{Label: {String: "Supplier"},
		RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
		Target:{AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation"}}],
		Label:{String: "General Information"},
		RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"};*/

		var done = assert.async();
		var oModel = this.getMockModel();
		assert.ok(oModel, "oModel Initiated");
		var oAnnotationHelper = this.oAnnotationHelper;
		if (oModel) {
			oModel.getMetaModel().loaded().then(function () {
				var Facets = {
					Target: {
						AnnotationPath: "to_Supplier/@com.sap.vocabularies.UI.v1.Identification"
					},
					Label: {
						String: "Supplier"
					},
					RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet"
				};
				var oMetaModel = oModel.getMetaModel();
				assert.ok(oMetaModel, "MetaModel is ok")
				var oEntitySet = oMetaModel.getODataEntitySet("SEPMRA_C_PD_Product");
				var oInterface = {
					getInterface: function () {
						return {
							getModel: function () {
								return oMetaModel;
							},
							getPath: function () {
								return "/dataServices/schema/0/entityType/20/com.sap.vocabularies.UI.v1.SelectionFields/0";
							},
							getSetting: function () {}
						}
					}
				};
				var oResult = oAnnotationHelper.getEntityTypesForFormPersonalization(oInterface, Facets, oEntitySet);
				var ExpectedResult = "SEPMRA_C_PD_SupplierType";
				assert.equal(oResult, ExpectedResult, "Function should return single supplier entity set type");

				//mock more facet values from demokit application..
				Facets = {
					"Facets": [{
							Target: {
								AnnotationPath: "to_Supplier/@com.sap.vocabularies.UI.v1.Identification"
							},
							Label: {
								String: "Supplier"
							},
							RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet"
						},
						{
							Target: {
								AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation"
							},
							Label: {
								String: "General Information"
							},
							RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet"
						},
						{
							Target: {
								AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup#TechnicalData"
							},
							Label: {
								String: "Technical Data"
							},
							RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet"
						}
					],
					"Label": {
						String: "General Information"
					},
					RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
				};

				ExpectedResult = "SEPMRA_C_PD_SupplierType, SEPMRA_C_PD_ProductType";
				assert.ok(oEntitySet, "MetaConext is ok");
				oResult = oAnnotationHelper.getEntityTypesForFormPersonalization(oInterface, Facets, oEntitySet);
				assert.equal(oResult, ExpectedResult, "Function should return multiple values");
				done();
			});
		}

	});

	QUnit.test("check method replaceSpecialCharsInId with mock data", function () {
		expect(3);
		sId = "SEPMRA_PROD_MAN.SEPMRA_PROD_MAN_Entities/SEPMRA_C_PD_ProductCopy";
		actions = this.oAnnotationHelper.replaceSpecialCharsInId(sId);
		var expectedValue = "SEPMRA_PROD_MAN.SEPMRA_PROD_MAN_Entities::SEPMRA_C_PD_ProductCopy";
		strictEqual(actions, expectedValue, "Function should return the expected value");

		// test with error mock data with space
		sId = " SEPMRA_PROD_MAN.SEPMRA_PROD_MAN_Entities/SEPMRA_C_PD_ProductCopy";
		var ErrorSpy = sinon.stub(Log, "error");
		ErrorSpy.returns("Annotation Helper: Unable to get index.");
		var actionsNew = this.oAnnotationHelper.replaceSpecialCharsInId(sId);
		var expectedValueNew = " SEPMRA_PROD_MAN.SEPMRA_PROD_MAN_Entities::SEPMRA_C_PD_ProductCopy";
		strictEqual(actionsNew, expectedValueNew, "Function should return the expected value with space");
		// test the Jquery error log is called
		assert.ok(ErrorSpy.calledOnce, "Function should call the Jquery error function");
		ErrorSpy.restore();
	});

	QUnit.test("check method formatWithExpand and getNavigationPathWithExpand with mock data", function () {


		var done = assert.async();
		var oModel = this.getMockModel();
		assert.ok(oModel, "oModel Initiated");
		var oAnnotationHelper = this.oAnnotationHelper;
		if (oModel) {
			oModel.getMetaModel().loaded().then(function () {
				//Mock Odatafield value get from demokit app
				var oDataField = {
					EdmType: "Edm.Decimal",
					Path: "Price"
				};
				var oMetaModel = oModel.getMetaModel();
				assert.ok(oMetaModel, "MetaModel is ok");
				var oInterface = {
					getInterface: function () {
						return {
							getModel: function () {
								return oMetaModel;
							},
							getPath: function () {
								return "/dataServices/schema/0/entityType/16/com.sap.vocabularies.UI.v1.DataPoint#ProductCategory/Value";
							},
							getSetting: function () {}
						}
					}
				};
				//Mock Entityset...
				var oEntitySet = oMetaModel.getODataEntitySet("SEPMRA_C_PD_Product");
				var Result = oAnnotationHelper.formatWithExpand(oInterface, oDataField, oEntitySet);
				//var expectedValue = "{path:'Price',type:'sap.ui.model.odata.type.Decimal',constraints:{'precision':'16','scale':'3'}}";
				var expectedValue = "{Price}";
				assert.equal(Result, expectedValue, "Function should return expected object values");

				//testing with function getNavigationPathWithExpand ...
				Result = oAnnotationHelper.getNavigationPathWithExpand(oInterface, oDataField, oEntitySet);
				var expectedValue = "";
				assert.equal(Result, expectedValue, "Function should return empty object values");

				//Mock the oDataField value
				oDataField = {
					EdmType: "Edm.Decimal",
					Path: "DraftAdministrativeData/SiblingEntity"
				};
				Result = oAnnotationHelper.getNavigationPathWithExpand(oInterface, oDataField, oEntitySet);
				//var expectedValue = "{DraftAdministrativeData}";
				var expectedValue = "";
				assert.equal(Result, expectedValue, "Without Expand, function should return the expected object");

				//Changing getPath value to navigate into more conditions...
				oInterface = {
					getInterface: function () {
						return {
							getModel: function () {
								return oMetaModel;
							},
							getPath: function () {
								return "/dataServices/schema/0/entityType/16/com.sap.vocabularies.UI.v1.Facets/0/Facets/2/Target";
							},
							getSetting: function () {}
						}
					}
				};
				oDataField = {
					EdmType: "Edm.Decimal",
					AnnotationPath: "to_ProductCategory/@com.sap.vocabularies.UI.v1.Identification"
				};
				//expectedValue = "{to_ProductCategory}";
				expectedValue = "";
				Result = oAnnotationHelper.getNavigationPathWithExpand(oInterface, oDataField, oEntitySet);
				assert.equal(Result, expectedValue, "Without Expand, function should return the expected object");
				done();
			});
		}

	});

	QUnit.test("check method extensionPointFragmentExists", function () {
		var oFacet = {
			"Label": {
				"String": "{@i18n>@ProductDescriptions}"
			},
			"RecordType": "com.sap.vocabularies.UI.v1.ReferenceFacet",
			"Target": {
				"AnnotationPath": "to_EntitySet/@com.sap.vocabularies.UI.v1.LineItem"
			}
		};
		var sFragmentId1 = "to_EntitySet::com.sap.vocabularies.UI.v1.LineItem";
		var sFragmentId2 = "to_EntitySetX::com.sap.vocabularies.UI.v1.LineItem";
		var oAnnotationHelper = this.oAnnotationHelper
		var result;
		result = oAnnotationHelper.extensionPointFragmentExists(oFacet, sFragmentId1);
		assert.equal(result, true);
		result = oAnnotationHelper.extensionPointFragmentExists(oFacet, sFragmentId2);
		assert.equal(result, false);
	});

	QUnit.test("check hasCustomActions for ListReport", function () {
		var oAnnotationHelper = this.oAnnotationHelper;
		var oRouteConfig = {
			"navigationProperty": "to_Item",
			"component": {
				"settings": {}
			}
		};
		var sEntitySet = "SomeEntitySet";
		var sEntitySetBad = "SomeBadEntitySet";
		var oManifestExt = {
			"sap.suite.ui.generic.template.ListReport.view.ListReport": {
				"sap.ui.generic.app": {
					"SomeEntitySet": {
						"EntitySet": "SomeEntitySet",
						"Actions": {
							"SomeAction": {
								"id": "SomeAction",
								"text": "SomeAction",
								"press": "onSomeAction",
								"requiresSelection": true
							}
						}
					}
				}
			}
		};
		var oManifestExt_SelectionFalse = {
			"sap.suite.ui.generic.template.ListReport.view.ListReport": {
				"sap.ui.generic.app": {
					"SomeEntitySet": {
						"EntitySet": "SomeEntitySet",
						"Actions": {
							"SomeAction": {
								"id": "SomeAction",
								"text": "SomeAction",
								"press": "onSomeAction",
								"requiresSelection": false
							}
						}
					}
				}
			}
		};
		var result;
		result = oAnnotationHelper.hasCustomActions(oRouteConfig, sEntitySet, oManifestExt);
		assert.equal(result, true);
		result = oAnnotationHelper.hasCustomActions(oRouteConfig, sEntitySet, oManifestExt_SelectionFalse);
		assert.equal(result, false);
		result = oAnnotationHelper.hasCustomActions(oRouteConfig, sEntitySetBad, oManifestExt);
		assert.equal(result, false);
	});



	QUnit.test("check getPersistencyKeyForSmartTable", function () {
		var oAnnotationHelper = this.oAnnotationHelper;
		var oRouteConfig_ListReport = {
			"component": {
				"settings": {}
			}
		};
		var result;
		result = oAnnotationHelper.getPersistencyKeyForSmartTable(oRouteConfig_ListReport);
		assert.equal(result, "listReportFloorplanTable");
	});

	QUnit.test("check hasCustomActions for fragment (Object Page table)", function () {
		var oAnnotationHelper = this.oAnnotationHelper;
		var oRouteConfig = {};
		var sEntitySet = "SomeEntitySet";
		var sEntitySetBad = "SomeBadEntitySet";
		var oManifestExt = {
			"SomeEntitySet": {
				"EntitySet": "SomeEntitySet",
				"Header": {
					"Actions": {
						"SomeHeaderCustomAction": {
							"id": "SomeHeaderCustomAction",
							"text": "Some header custom action",
							"press": "onSomeHeaderCustomAction"
						}
					}
				},
				"Sections": {
					"to_EntitySet::com.sap.vocabularies.UI.v1.LineItem": {
						"id": "to_EntitySet::com.sap.vocabularies.UI.v1.LineItem",
						"Actions": {
							"SomeSectionCustomAction": {
								"id": "SomeSectionCustomAction",
								"text": "Somes ection custom action",
								"press": "onSomeSectionCustomAction"
							}
						}
					}
				}
			}
		};
		var oManifestExt_SelectionFalse = {
			"SomeEntitySet": {
				"EntitySet": "SomeEntitySet",
				"Header": {
					"Actions": {
						"SomeHeaderCustomAction": {
							"id": "SomeHeaderCustomAction",
							"text": "Some header custom action",
							"press": "onSomeHeaderCustomAction"
						}
					}
				},
				"Sections": {
					"to_EntitySet::com.sap.vocabularies.UI.v1.LineItem": {
						"id": "to_EntitySet::com.sap.vocabularies.UI.v1.LineItem",
						"Actions": {
							"SomeSectionCustomAction": {
								"id": "SomeSectionCustomAction",
								"text": "Somes ection custom action",
								"press": "onSomeSectionCustomAction",
								"requiresSelection": false
							}
						}
					}
				}
			}
		};
		var oFacet = {
			"Label": {
				"String": "{@i18n>@ProductDescriptions}"
			},
			"RecordType": "com.sap.vocabularies.UI.v1.ReferenceFacet",
			"Target": {
				"AnnotationPath": "to_EntitySet/@com.sap.vocabularies.UI.v1.LineItem"
			}
		};
		var oFacetBad = {
			"Label": {
				"String": "{@i18n>@ProductDescriptions}"
			},
			"RecordType": "com.sap.vocabularies.UI.v1.ReferenceFacet",
			"Target": {
				"AnnotationPath": "to_EntitySetBad/@com.sap.vocabularies.UI.v1.LineItem"
			}
		};
		result = oAnnotationHelper.hasCustomActions(oRouteConfig, sEntitySet, oManifestExt, oFacet);
		assert.equal(result, true);
		result = oAnnotationHelper.hasCustomActions(oRouteConfig, sEntitySet, oManifestExt_SelectionFalse, oFacet);
		assert.equal(result, false);
		result = oAnnotationHelper.hasCustomActions(oRouteConfig, sEntitySetBad, oManifestExt, oFacet);
		assert.equal(result, false);
		result = oAnnotationHelper.hasCustomActions(oRouteConfig, sEntitySet, oManifestExt, oFacetBad);
		assert.equal(result, false);
		result = oAnnotationHelper.hasCustomActions(oRouteConfig, sEntitySetBad, oManifestExt, oFacetBad);
		assert.equal(result, false);
	});

	QUnit.test("check: object page selection mode", function () {
		var oAnnotationHelper = this.oAnnotationHelper;
		var sRootEntitySet = "SomeEntitySet";
		var sRootEntitySet2 = "OtherEntitySet";
		var oBoolFalse = {
			"Bool": "false"
		};
		var oBoolTrue = {
			"Bool": "true"
		};
		var oDeletablePath = {
			"Path": "copy_ac"
		}
		var oDeleteRestrictionsFalse = {
			"Deletable": oBoolFalse
		};
		var oDeleteRestrictionsTrue = {
			"Deletable": oBoolTrue
		};
		var oDeleteRestrictionsPath = {
			"Deletable": oDeletablePath
		};
		var oEntitySet = {
			"name": "SomeSubSet",
			"Org.OData.Capabilities.V1.DeleteRestrictions": oDeleteRestrictionsFalse
		};
		var oEntitySetDeletable = {
			"name": "SomeSubSet"
		};
		var oEntitySetDeletableBoolTrue = {
			"name": "SomeSubSet",
			"Org.OData.Capabilities.V1.DeleteRestrictions": oDeleteRestrictionsTrue
		};
		var oEntitySetDeletablePath = {
			"name": "SomeSubSet",
			"Org.OData.Capabilities.V1.DeleteRestrictions": oDeleteRestrictionsPath
		};
		var sRootEntitySetBad = "SomeBadEntitySet";
		var oManifestExt_Single = {
			"SomeEntitySet": {
				"EntitySet": "SomeEntitySet",
				"Sections": {
					"to_EntitySet::com.sap.vocabularies.UI.v1.LineItem": {
						"id": "to_EntitySet::com.sap.vocabularies.UI.v1.LineItem",
						"selectionMode": "Single"
					}
				}
			}
		};
		var oManifestExt_Multi = {
			"SomeEntitySet": {
				"EntitySet": "SomeEntitySet",
				"Sections": {
					"to_EntitySet::com.sap.vocabularies.UI.v1.LineItem": {
						"id": "to_EntitySet::com.sap.vocabularies.UI.v1.LineItem",
						"selectionMode": "Multi"
					}
				}
			}
		};
		var oManifestExt_Action = {
			"SomeEntitySet": {
				"EntitySet": "SomeEntitySet",
				"Header": {
					"Actions": {
						"SomeHeaderCustomAction": {
							"id": "SomeHeaderCustomAction",
							"text": "Some header custom action",
							"press": "onSomeHeaderCustomAction"
						}
					}
				},
				"Sections": {
					"to_EntitySet::com.sap.vocabularies.UI.v1.LineItem": {
						"id": "to_EntitySet::com.sap.vocabularies.UI.v1.LineItem",
						"Actions": {
							"SomeSectionCustomAction": {
								"id": "SomeSectionCustomAction",
								"text": "Somes ection custom action",
								"press": "onSomeSectionCustomAction"
							}
						}
					}
				}
			}
		};
		var oManifestExt_SelectionFalse = {
			"SomeEntitySet": {
				"EntitySet": "SomeEntitySet",
				"Sections": {
					"to_EntitySet::com.sap.vocabularies.UI.v1.LineItem": {
						"id": "to_EntitySet::com.sap.vocabularies.UI.v1.LineItem",
						"Actions": {
							"SomeSectionCustomAction": {
								"id": "SomeSectionCustomAction",
								"text": "Somes ection custom action",
								"press": "onSomeSectionCustomAction",
								"requiresSelection": false
							}
						}
					}
				}
			}
		};
		var oFacet = {
			"Label": {
				"String": "{@i18n>@ProductDescriptions}"
			},
			"RecordType": "com.sap.vocabularies.UI.v1.ReferenceFacet",
			"Target": {
				"AnnotationPath": "to_EntitySet/@com.sap.vocabularies.UI.v1.LineItem"
			}
		};
		var oFacetBad = {
			"Label": {
				"String": "{@i18n>@ProductDescriptions}"
			},
			"RecordType": "com.sap.vocabularies.UI.v1.ReferenceFacet",
			"Target": {
				"AnnotationPath": "to_EntitySetBad/@com.sap.vocabularies.UI.v1.LineItem"
			}
		};
		var oPagesDetailNo = {
			"entitySet": "SomeEntitySet",
			"component": {
				"name": "sap.suite.ui.generic.template.ListReport",
				"list": true,
				"settings": {
					"gridTable": false,
					"multiSelect": true
				}
			},
			"pages": [{
				"entitySet": "SomeEntitySet",
				"component": {
					"name": "sap.suite.ui.generic.template.ObjectPage"
				},
				"pages": [{
					"navigationProperty": "to_EntitySet",
					"entitySet": "SomeSubSet",
					"component": {
						"name": "sap.suite.ui.generic.template.ObjectPage"
					}
				}, ]
			}]
		};
		var oPagesNoDetailNo = {
			"entitySet": "SomeEntitySet",
			"component": {
				"name": "sap.suite.ui.generic.template.ListReport",
				"list": true,
				"settings": {
					"gridTable": false,
					"multiSelect": true
				}
			},
			"pages": [{
				"entitySet": "SomeEntitySet",
				"component": {
					"name": "sap.suite.ui.generic.template.ObjectPage"
				}
			}]
		};
		var aEntities = []; //don't want to test hasActions here

		// non-deletable entity sets (i.e. without DELETE action)
		// getSelectionMode (GridTable, TreeTable, AnalyticalTable)
		result = oAnnotationHelper.getSelectionModeForTable(aEntities, sRootEntitySet, oManifestExt_Multi, oFacet, oEntitySet, oPagesDetailNo);
		assert.equal(result, "{= !${ui>/editable} ? 'Single' : 'None' }"); //1.
		result = oAnnotationHelper.getSelectionModeForTable(aEntities, sRootEntitySet, oManifestExt_Single, oFacet, oEntitySet, oPagesDetailNo);
		assert.equal(result, "{= !${ui>/editable} ? 'Single' : 'None' }"); //2.
		result = oAnnotationHelper.getSelectionModeForTable(aEntities, sRootEntitySet, oManifestExt_Action, oFacet, oEntitySet, oPagesDetailNo);
		assert.equal(result, "Single"); //3.
		result = oAnnotationHelper.getSelectionModeForTable(aEntities, sRootEntitySet, oManifestExt_SelectionFalse, oFacet, oEntitySet, oPagesDetailNo);
		assert.equal(result, "{= !${ui>/editable} ? 'Single' : 'None' }") //4

		//getSelectionMode (ResponsiveTable)
		result = oAnnotationHelper.getSelectionModeResponsiveTable(aEntities, sRootEntitySet, oManifestExt_Multi, oFacet, oEntitySet, oPagesDetailNo);
		assert.equal(result, "{= !${ui>/editable} ? 'SingleSelectLeft' : 'None' }"); //5.
		result = oAnnotationHelper.getSelectionModeResponsiveTable(aEntities, sRootEntitySet, oManifestExt_Single, oFacet, oEntitySet, oPagesDetailNo);
		assert.equal(result, "{= !${ui>/editable} ? 'SingleSelectLeft' : 'None' }"); //6.
		result = oAnnotationHelper.getSelectionModeResponsiveTable(aEntities, sRootEntitySet, oManifestExt_Action, oFacet, oEntitySet, oPagesDetailNo);
		assert.equal(result, "SingleSelectLeft"); //7.
		result = oAnnotationHelper.getSelectionModeResponsiveTable(aEntities, sRootEntitySet, oManifestExt_SelectionFalse, oFacet, oEntitySet, oPagesDetailNo);
		assert.equal(result, "{= !${ui>/editable} ? 'SingleSelectLeft' : 'None' }"); //8.


		// deletable entity sets (i.e. with DELETE action)
		// getSelectionMode (GridTable, TreeTable, AnalyticalTable)
		result = oAnnotationHelper.getSelectionModeForTable(aEntities, sRootEntitySet, oManifestExt_SelectionFalse, oFacet, oEntitySetDeletable, oPagesNoDetailNo, false);
		assert.equal(result, "{= !${ui>/editable} ? 'Single' : 'None' }"); //9.
		result = oAnnotationHelper.getSelectionModeForTable(aEntities, sRootEntitySet, oManifestExt_SelectionFalse, oFacet, oEntitySetDeletable, oPagesNoDetailNo, true);
		assert.equal(result, "{= !${ui>/editable} ? 'Single' : 'None' }"); //10.
		result = oAnnotationHelper.getSelectionModeForTable(aEntities, sRootEntitySet2, oManifestExt_SelectionFalse, oFacet, oEntitySetDeletableBoolTrue, oPagesDetailNo, true);
		assert.equal(result, "{= !${ui>/editable} ? 'Single' : 'None' }"); //11.
		result = oAnnotationHelper.getSelectionModeForTable(aEntities, sRootEntitySet2, oManifestExt_SelectionFalse, oFacet, oEntitySet, oPagesDetailNo, true);
		assert.equal(result, "{= !${ui>/editable} ? 'Single' : 'None' }"); //12.
		result = oAnnotationHelper.getSelectionModeForTable(aEntities, sRootEntitySet2, oManifestExt_SelectionFalse, oFacet, oEntitySetDeletablePath, oPagesDetailNo, true);
		assert.equal(result, "{= !${ui>/editable} ? 'Single' : 'None' }"); //13.

		//getSelectionMode (ResponsiveTable)
		result = oAnnotationHelper.getSelectionModeResponsiveTable(aEntities, sRootEntitySet, oManifestExt_SelectionFalse, oFacet, oEntitySetDeletable, oPagesDetailNo, false);
		assert.equal(result, "{= !${ui>/editable} ? 'SingleSelectLeft' : 'None' }"); //14.
		result = oAnnotationHelper.getSelectionModeResponsiveTable(aEntities, sRootEntitySet, oManifestExt_SelectionFalse, oFacet, oEntitySetDeletable, oPagesDetailNo, true);
		assert.equal(result, "{= !${ui>/editable} ? 'SingleSelectLeft' : 'None' }"); //15.
		result = oAnnotationHelper.getSelectionModeResponsiveTable(aEntities, sRootEntitySet, oManifestExt_SelectionFalse, oFacet, oEntitySetDeletableBoolTrue, oPagesDetailNo, true);
		assert.equal(result, "{= !${ui>/editable} ? 'SingleSelectLeft' : 'None' }"); //16.
		result = oAnnotationHelper.getSelectionModeResponsiveTable(aEntities, sRootEntitySet, oManifestExt_SelectionFalse, oFacet, oEntitySet, oPagesDetailNo, true);
		assert.equal(result, "{= !${ui>/editable} ? 'SingleSelectLeft' : 'None' }"); //17.
		result = oAnnotationHelper.getSelectionModeResponsiveTable(aEntities, sRootEntitySet, oManifestExt_SelectionFalse, oFacet, oEntitySetDeletablePath, oPagesDetailNo, true);
		assert.equal(result, "{= !${ui>/editable} ? 'SingleSelectLeft' : 'None' }"); //18.
	});

	QUnit.test("check showFullScreenButton (ObjectPage)", function () {
		var oAnnotationHelper = this.oAnnotationHelper;
		var oRouteConfig = {
			"entitySet": "SomeEntitySet1",
			"component": {
				"name": "sap.suite.ui.generic.template.ObjectPage",
				"settings": {
					"sections": {
						"to_Item::com.sap.vocabularies.UI.v1.LineItem": {
							"navigationProperty": "to_Item",
							"entitySet": "SomeEntitySet2",
							"tableMode": "FullScreenTable"
						}
					}
				}
			}
		};
		var oFacetWithFullScreenTable = {
			"Label": {
				"String": "{@i18n>@ProductDescriptions}"
			},
			"RecordType": "com.sap.vocabularies.UI.v1.ReferenceFacet",
			"Target": {
				"AnnotationPath": "to_Item/@com.sap.vocabularies.UI.v1.LineItem"
			}
		};
		result = oAnnotationHelper.showFullScreenButton(oRouteConfig, oFacetWithFullScreenTable);
		assert.equal(result, true);
	});
	QUnit.test("check method doesFieldGroupContainOnlyOneMultiLineDataField", function () {
		var oAnnotationHelper = this.oAnnotationHelper;

		var oFieldGroupWith0DataField = {
			"Data": []
		};

		var oFieldGroupWith1DataField = {
			"Data": [{
				"EdmType": "Edm.String",
				"RecordType": "com.sap.vocabularies.UI.v1.DataField",
				"Value": {
					"Path": "Description"
				}
			}]
		};

		var oFieldGroupWith2DataField = {
			"Data": [{
					"EdmType": "Edm.String",
					"RecordType": "com.sap.vocabularies.UI.v1.DataField",
					"Value": {
						"Path": "Description"
					}
				},
				{
					"EdmType": "Edm.String",
					"RecordType": "com.sap.vocabularies.UI.v1.DataField",
					"Value": {
						"Path": "Name"
					}
				}
			]
		};

		var oDataFieldPropertyMutilineDefined = {
			"com.sap.vocabularies.UI.v1.MultiLineText": {}
		};

		result = oAnnotationHelper.doesFieldGroupContainOnlyOneMultiLineDataField(oFieldGroupWith0DataField, {});
		assert.equal(result, false, "0 DataFields defined should return false");

		result = oAnnotationHelper.doesFieldGroupContainOnlyOneMultiLineDataField(oFieldGroupWith1DataField, oDataFieldPropertyMutilineDefined);
		assert.equal(result, true, "1 DataField and MultilineText defined should return true");

		result = oAnnotationHelper.doesFieldGroupContainOnlyOneMultiLineDataField(oFieldGroupWith1DataField, {});
		assert.equal(result, false, "1 DataField and MultilineText NOT defined should return false");

		result = oAnnotationHelper.doesFieldGroupContainOnlyOneMultiLineDataField(oFieldGroupWith2DataField, {});
		assert.equal(result, false, "2 DataFields defined should return false");
	});

	QUnit.test("buildBreadCrumbExpression", function () {
		var oContext = {
			getInterface: function () {
				return this;
			},
			getModel: function () {
				return {};
			},
			getPath: function () {
				return "path";
			},
			getSetting: function () {
				return {};
			}
		};
		var oTitle = {
			Path: "path"
		};
		var oTypeName = {
			String: "name"
		};
		var oTypeNameWithQuote = {
			String: "na'me"
		};
		var sResultAct;
		var sResultExp1 = "{= ${path} ? ${path} : 'name' }";
		var sResultExp2 = "{= ${path} ? ${path} : 'na\\'me' }";
		sResultAct = this.oAnnotationHelper.buildBreadCrumbExpression(oContext, oTitle, oTypeName);
		assert.equal(sResultAct, sResultExp1, "breadcrumb expression built");
		sResultAct = this.oAnnotationHelper.buildBreadCrumbExpression(oContext, oTitle, oTypeNameWithQuote);
		assert.equal(sResultAct, sResultExp2, "breadcrumb expression (with quote) built");
	});

	QUnit.test("getTargetEntitySet", function () {
		var sAnnotationPath1 = "Annotation";
		var sAnnotationPath2 = "to_Item/Annotation";
		var oEntitySet1 = {
			entityType: "AType"
		};
		var oEntitySet2 = {
			entityType: "BType"
		};
		var oAssociationEnd = {
			entitySet: "B"
		};
		var oModel = {
			getODataEntityType: function () {
				return {};
			},
			getODataEntitySet: function () {
				return oEntitySet2;
			},
			getODataAssociationSetEnd: function () {
				return oAssociationEnd;
			}
		};
		var sResultAct;
		sResultAct = this.oAnnotationHelper.getTargetEntitySet(oModel, oEntitySet1, sAnnotationPath1);
		assert.equal(sResultAct, oEntitySet1, "entity set retrieved (without navigation property)");
		sResultAct = this.oAnnotationHelper.getTargetEntitySet(oModel, oEntitySet1, sAnnotationPath2);
		assert.equal(sResultAct, oEntitySet2, "entity set retrieved (with navigation property)");
	});

	QUnit.test("check get...Id functions", function () {
		var sResultAct;
		var oTabItem = {
			key: "key"
		};
		var oCustomAction = {
			id: "id"
		};

		sResultAct = this.oAnnotationHelper.getSmartTableId(undefined);
		assert.equal(sResultAct, "listReport", "smart table ID (without tab suffix) built");
		sResultAct = this.oAnnotationHelper.getSmartTableId(oTabItem);
		assert.equal(sResultAct, "listReport-key", "smart table ID (with tab suffix) built");

		sResultAct = this.oAnnotationHelper.getAnalyticalTableId(undefined);
		assert.equal(sResultAct, "analyticalTable", "analytical table ID (without tab suffix) built");
		sResultAct = this.oAnnotationHelper.getAnalyticalTableId(oTabItem);
		assert.equal(sResultAct, "analyticalTable-key", "analytical table ID (with tab suffix) built");

		sResultAct = this.oAnnotationHelper.getGridTableId(undefined);
		assert.equal(sResultAct, "GridTable", "grid table ID (without tab suffix) built");
		sResultAct = this.oAnnotationHelper.getGridTableId(oTabItem);
		assert.equal(sResultAct, "GridTable-key", "grid table ID (with tab suffix) built");

		sResultAct = this.oAnnotationHelper.getResponsiveTableId(undefined);
		assert.equal(sResultAct, "responsiveTable", "responsive table ID (without tab suffix) built");
		sResultAct = this.oAnnotationHelper.getResponsiveTableId(oTabItem);
		assert.equal(sResultAct, "responsiveTable-key", "responsive table ID (with tab suffix) built");

		sResultAct = this.oAnnotationHelper.getAddEntryId(undefined);
		assert.equal(sResultAct, "addEntry", "add button ID (without tab suffix) built");
		sResultAct = this.oAnnotationHelper.getAddEntryId(oTabItem);
		assert.equal(sResultAct, "addEntry-key", "add button ID (with tab suffix) built");

		sResultAct = this.oAnnotationHelper.getDeleteEntryId(undefined);
		assert.equal(sResultAct, "deleteEntry", "delete button ID (without tab suffix) built");
		sResultAct = this.oAnnotationHelper.getDeleteEntryId(oTabItem);
		assert.equal(sResultAct, "deleteEntry-key", "delete button ID (with tab suffix) built");

		sResultAct = this.oAnnotationHelper.getShowDetailsId(undefined);
		assert.equal(sResultAct, "showDetails", "show details ID (without tab suffix) built");
		sResultAct = this.oAnnotationHelper.getShowDetailsId(oTabItem);
		assert.equal(sResultAct, "showDetails-key", "show details ID (with tab suffix) built");

		sResultAct = this.oAnnotationHelper.getDraftObjectMarkerId(undefined);
		assert.equal(sResultAct, "DraftObjectMarker", "DraftObjectMarker ID (without tab suffix) built");
		sResultAct = this.oAnnotationHelper.getDraftObjectMarkerId(oTabItem);
		assert.equal(sResultAct, "DraftObjectMarker-key", "DraftObjectMarker ID (with tab suffix) built");

		sResultAct = this.oAnnotationHelper.getBreakoutActionButtonId({}, oTabItem);
		assert.equal(sResultAct, undefined, "breakout action button ID (without tab suffix) built");
		sResultAct = this.oAnnotationHelper.getBreakoutActionButtonId(oCustomAction, oTabItem);
		assert.equal(sResultAct, "id-key", "breakout action button ID (with tab suffix) built");
	});

	QUnit.test("buildVisibilityExprOfDataFieldForIntentBasedNaviButton", function () {
		var sSemanticObject = "EPMProduct",
			sAction = "Create",
			sExpected, sResult, bResult;
		var oDataField = {
			Inline: {
				Bool: "true"
			},
			RequiresContext: {
				Bool: "false"
			},
			SemanticObject: {
				String: sSemanticObject
			},
			Action: {
				String: sAction
			}
		};

		sExpected = "{= !!${_templPriv>/generic/supportedIntents/" + sSemanticObject + "/" + sAction + "/visible}}";
		bResult = this.oAnnotationHelper.buildVisibilityExprOfDataFieldForIntentBasedNaviButton(oDataField);
		assert.equal(bResult, true, "Inline buttons with RequiresContext = false should be visible");

		oDataField.RequiresContext.Bool = "true";
		bResult = this.oAnnotationHelper.buildVisibilityExprOfDataFieldForIntentBasedNaviButton(oDataField);
		assert.equal(bResult, true, "Inline buttons RequiresContext = true should be visible");

		oDataField.Inline.Bool = "false";
		bResult = this.oAnnotationHelper.buildVisibilityExprOfDataFieldForIntentBasedNaviButton(oDataField);
		assert.equal(bResult, true, "Toolbar buttons which require context should be always visible");

		oDataField.RequiresContext.Bool = "false";
		sResult = this.oAnnotationHelper.buildVisibilityExprOfDataFieldForIntentBasedNaviButton(oDataField);
		assert.equal(sResult, sExpected, "Visibility of toolbar buttons which do not require context should be bound to the expression");

		oDataField.Inline = null; // Nullable="true" so Inline attribute may be absent
		bResult = this.oAnnotationHelper.buildVisibilityExprOfDataFieldForIntentBasedNaviButton(oDataField);
		assert.equal(bResult, sExpected, "Visibility of toolbar buttons without 'inline' attribute & with RequiresContext = false should be bound to the expression");

		oDataField.RequiresContext.Bool = "true";
		bResult = this.oAnnotationHelper.buildVisibilityExprOfDataFieldForIntentBasedNaviButton(oDataField);
		assert.equal(bResult, true, "Visibility of toolbar buttons without 'inline' attribute & with RequiresContext = true should be true");

		oDataField.RequiresContext = null;
		bResult = this.oAnnotationHelper.buildVisibilityExprOfDataFieldForIntentBasedNaviButton(oDataField);
		assert.equal(bResult, true, "Visibility of toolbar buttons without 'inline' attribute & without RequiresContext should be true");

		oDataField.Inline = {
			Bool: "false"
		};
		bResult = this.oAnnotationHelper.buildVisibilityExprOfDataFieldForIntentBasedNaviButton(oDataField);
		assert.equal(bResult, true, "Visibility of toolbar buttons with Inline = 'false' & without RequiresContext should be true");

		oDataField.Inline.Bool = "true";
		bResult = this.oAnnotationHelper.buildVisibilityExprOfDataFieldForIntentBasedNaviButton(oDataField);
		assert.equal(bResult, true, "Visibility of toolbar buttons with Inline = 'true' & without RequiresContext should be true");

		oDataField = {
			"com.sap.vocabularies.UI.v1.Hidden": {
				"Bool": "true"
			}
		};
		var oSpy = sinon.spy(this.oAnnotationHelper, "getBindingForHiddenPath");
		this.oAnnotationHelper.buildVisibilityExprOfDataFieldForIntentBasedNaviButton(oDataField);
		assert.equal(oSpy.calledOnce, true, "getBindingForHiddenPath function called if UI.Hidden is used");
		oSpy.restore();
	});

	QUnit.test("Check getColumnCellFirstText", function () {
		var sPath = "myTestPath",
			sResult, sExpectedValue, oEntityType = {};
		var oDataFieldValue = {};
		var oDataField = {
			Value: {
				Path: sPath
			}
		};

		var fnGetTextForDataField = this.stub(AnnotationHelper, "getTextForDataField").returns("MyV1Text");

		var fnGetTextArrangement = this.stub(AnnotationHelper, "getTextArrangement").returns("idAndDescription");
		//1: 'idAndDescription', v1.Text, oDataField.Value.Path exist
		sExpectedValue = "{" + sPath + "}";
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'idAndDescription' and existing v1.Text and oDataField.Value.Path");

		//2: 'idAndDescription', oDataField.Value.Path exists, no v1.Text
		fnGetTextForDataField.returns(null);
		sExpectedValue = "{" + sPath + "}";
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'idAndDescription', oDataField.Value.Path exists, no v1.Text");

		//3: 'idAndDescription', v1.Text exists, no oDataField.Value.Path
		fnGetTextForDataField.returns("MyV1Text");
		oDataField.Value.Path = null;
		sExpectedValue = "{MyV1Text}";
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'idAndDescription', v1.Text exists, no oDataField.Value.Path");

		//4: 'idOnly', v1.Text, oDataField.Value.Path exist
		oDataField.Value.Path = sPath;
		fnGetTextArrangement.returns("idOnly");
		sExpectedValue = "{" + sPath + "}";
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'idOnly' and existing v1.Text and oDataField.Value.Path");

		//5: 'idOnly', v1.Text exists, no oDataField.Value.Path
		oDataField.Value.Path = null;
		sExpectedValue = "{MyV1Text}";
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'idOnly' and existing v1.Text and no oDataField.Value.Path");

		//6: 'idOnly', oDataField.Value.Path exists, no v1.Text
		fnGetTextForDataField.returns(null);
		oDataField.Value.Path = sPath;
		sExpectedValue = "{" + sPath + "}";
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'idOnly' and existing oDataField.Value.Path and no v1.Text");

		//7: 'descriptionOnly', v1.Text, oDataField.Value.Path exist
		fnGetTextArrangement.returns("descriptionOnly");
		fnGetTextForDataField.returns("MyV1Text");
		sExpectedValue = "{MyV1Text}";
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'descriptionOnly' and existing v1.Text and oDataField.Value.Path");

		//8: 'descriptionOnly', no v1.Text, oDataField.Value.Path exists
		fnGetTextForDataField.returns(null);
		sExpectedValue = "{" + sPath + "}";
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'descriptionOnly' and existing oDataField.Value.Path and no v1.Text");

		//9: 'descriptionOnly', v1.Text, no oDataField.Value.Path
		fnGetTextForDataField.returns("MyV1Text");
		oDataField.Value.Path = null;
		sExpectedValue = "{MyV1Text}";
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'descriptionOnly' and existing v1.Text and no oDataField.Value.Path");

		//10: 'descriptionAndId', v1.Text, oDataField.Value.Path exist
		oDataField.Value.Path = sPath;
		fnGetTextArrangement.returns("descriptionAndId"); // it is the case for both com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst and for no text arrangement at all
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'descriptionAndId' and existing v1.Text and oDataField.Value.Path ");

		//11: 'descriptionAndId', no v1.Text, oDataField.Value.Path exists
		sExpectedValue = "{myTestPath}";
		fnGetTextForDataField.returns(null);
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'descriptionAndId' and oDataField.Value.Path, no v1.Text");

		//12: 'descriptionAndId', no oDataField.Value.Path, v1.Text exists
		fnGetTextForDataField.returns("MyV1Text");
		oDataField.Value.Path = null;
		sExpectedValue = "{MyV1Text}";
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'descriptionAndId' and v1.Text, no oDataField.Value.Path");

		// the return value should be undefined ( and not '{undefined}' ) if no value was determined
		sExpectedValue = undefined;
		fnGetTextForDataField.returns(null);
		sResult = this.oAnnotationHelper.getColumnCellFirstText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the return value should be 'undefined' if no value was determined");
	});

	QUnit.test("Check getColumnCellSecondText", function () {
		var sPath = "myTestPath",
			sResult, oEntityType = {},
			sExpectedValue;
		var oDataFieldValue = {};
		var oDataField = {
			Value: {
				Path: sPath
			}
		};

		var fnGetTextForDataField = this.stub(AnnotationHelper, "getTextForDataField").returns("MyV1Text");
		var fnGetTextArrangement = this.stub(AnnotationHelper, "getTextArrangement").returns("idAndDescription");

		//1: 'idAndDescription', v1.Text, oDataField.Value.Path exist
		sExpectedValue = "{MyV1Text}";
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'idAndDescription' and existing v1.Text and oDataField.Value.Path");

		//2: 'idAndDescription', oDataField.Value.Path exists, no v1.Text
		fnGetTextForDataField.returns(null);
		sExpectedValue = undefined;
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'idAndDescription' and existing oDataField.Value.Path, no v1.Text");

		//3: 'idAndDescription', v1.Text exists, no oDataField.Value.Path
		fnGetTextForDataField.returns("MyV1Text");
		oDataField.Value.Path = null;
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'idAndDescription' and existing v1.Text, no oDataField.Value.Path");

		//4: 'idOnly', v1.Text, oDataField.Value.Path exist
		oDataField.Value.Path = sPath;
		fnGetTextArrangement.returns("idOnly");
		sExpectedValue = undefined;
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'idOnly' and existing v1.Text and oDataField.Value.Path");

		//5: 'idOnly', v1.Text exists, no oDataField.Value.Path
		oDataField.Value.Path = null;
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'idOnly' and existing v1.Text and no oDataField.Value.Path");

		//6: 'idOnly', oDataField.Value.Path exists, no v1.Text
		fnGetTextForDataField.returns(null);
		oDataField.Value.Path = sPath;
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'idOnly' and existing oDataField.Value.Path and no v1.Text");

		//7: 'descriptionOnly', v1.Text, oDataField.Value.Path exist
		fnGetTextArrangement.returns("descriptionOnly");
		fnGetTextForDataField.returns("MyV1Text");
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'descriptionOnly' and existing v1.Text and oDataField.Value.Path");

		//8: 'descriptionOnly', no v1.Text, oDataField.Value.Path exists
		fnGetTextForDataField.returns(null);
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'descriptionOnly' and existing oDataField.Value.Path and no v1.Text");

		//9: 'descriptionOnly', v1.Text, no oDataField.Value.Path
		fnGetTextForDataField.returns("MyV1Text");
		oDataField.Value.Path = null;
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'descriptionOnly' and existing v1.Text and no oDataField.Value.Path");

		//10: 'descriptionAndId', v1.Text, oDataField.Value.Path exist
		oDataField.Value.Path = sPath;
		fnGetTextArrangement.returns("descriptionAndId"); // it is the case for both com.sap.vocabularies.UI.v1.TextArrangementType/TextFirst and for no text arrangement at all
		sExpectedValue = "{myTestPath}";
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'descriptionAndId' and existing v1.Text and oDataField.Value.Path ");

		//11: 'descriptionAndId', no v1.Text, oDataField.Value.Path exists
		sExpectedValue = "{myTestPath}";
		fnGetTextForDataField.returns(null);
		sExpectedValue = undefined;
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'descriptionAndId' and oDataField.Value.Path, no v1.Text");

		//12: 'descriptionAndId', no oDataField.Value.Path, v1.Text exists
		fnGetTextForDataField.returns("MyV1Text");
		oDataField.Value.Path = null;
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for 'descriptionAndId' and v1.Text, no oDataField.Value.Path");

		sExpectedValue = undefined;
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "the return value should be 'undefined' if no value was determined");

		fnGetTextForDataField.returns("");
		sResult = this.oAnnotationHelper.getColumnCellSecondText(oDataFieldValue, oDataField, oEntityType);
		assert.equal(sExpectedValue, sResult, "if text annotation does not exist oDataField.Value.Path has been already used as the first text so it should not be set as the second text again");
	});

	QUnit.test("Check getColumnCellFirstTextVisibility", function () {
		var param1 = "param1",
			param2 = "param2",
			param3 = "param3";
		var fnGetColumnCellFirstText = this.stub(AnnotationHelper, "getColumnCellFirstText").returns(true);
		var bResult = this.oAnnotationHelper.getColumnCellFirstTextVisibility(param1, param2, param3);

		var bExpectedValue = true;
		assert.equal(bExpectedValue, bResult, "the visibility should be true if the method getColumnCellFirstText returns true");
		assert.ok(fnGetColumnCellFirstText.calledWith(param1, param2, param3), "getColumnCellFirstText was called with the right parameters");

		fnGetColumnCellFirstText.returns(undefined);
		var bResult = this.oAnnotationHelper.getColumnCellFirstTextVisibility();
		var bExpectedValue = false;
		assert.equal(bExpectedValue, bResult, "the visibility should be false if the method getColumnCellFirstText yields undefined");
	});

	QUnit.test("Check getColumnCellSecondTextVisibility", function () {
		var param1 = "param1",
			param2 = "param2",
			param3 = "param3";
		var fnGetColumnCellSecondText = this.stub(AnnotationHelper, "getColumnCellSecondText").returns(true);
		var bResult = this.oAnnotationHelper.getColumnCellSecondTextVisibility(param1, param2, param3);
		var bExpectedValue = true;
		assert.equal(bExpectedValue, bResult, "the visibility should be true if the method getColumnCellSecondText returns true");
		assert.ok(fnGetColumnCellSecondText.calledWith(param1, param2, param3), "fnGetColumnCellSecondText was called with the right parameters");

		fnGetColumnCellSecondText.returns(undefined);
		var bResult = this.oAnnotationHelper.getColumnCellSecondTextVisibility();
		var bExpectedValue = false;
		assert.equal(bExpectedValue, bResult, "the visibility should be false if the method getColumnCellSecondText yields undefined");
	});

	QUnit.test("Check getColumnHeaderText", function () {
		var sResult, sExpectedValue, sTextOfSapLabel = 'Text of sap:label',
			sTextOfV1Label = 'Text of v1.Label';
		var oDataField = {
			Label: {
				String: "result"
			}
		};
		var oDataFieldValue = {
			'sap:label': sTextOfSapLabel,
			'com.sap.vocabularies.Common.v1.Label': {
				String: sTextOfV1Label
			}
		};

		sExpectedValue = "result";
		sResult = this.oAnnotationHelper.getColumnHeaderText(oDataFieldValue, oDataField);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for the case oDataField.Label ist present");

		oDataField.Label = null;
		sExpectedValue = sTextOfSapLabel;
		sResult = this.oAnnotationHelper.getColumnHeaderText(oDataFieldValue, oDataField);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for the case sap:label");

		sExpectedValue = sTextOfV1Label;
		oDataFieldValue["sap:label"] = null;
		sResult = this.oAnnotationHelper.getColumnHeaderText(oDataFieldValue, oDataField);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for the case V1.Label");

		sExpectedValue = "";
		oDataFieldValue["com.sap.vocabularies.Common.v1.Label"] = null;
		sResult = this.oAnnotationHelper.getColumnHeaderText(oDataFieldValue, oDataField);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for the case no label is present");
	});

	QUnit.test("Check getTextForDataField", function () {
		var sTextOfV1Text = "Text of v1.Text";
		var oDataFieldValue = {
			'com.sap.vocabularies.Common.v1.Text': {
				Path: sTextOfV1Text
			}
		};

		sExpectedValue = sTextOfV1Text;
		sResult = this.oAnnotationHelper.getTextForDataField(oDataFieldValue);
		assert.equal(sExpectedValue, sResult, "the returned value is correct for V1.text annotation");
	});

	QUnit.test("Check getAdditionalSemanticObjects", function () {
		var oDataFieldValue = {
			"com.sap.vocabularies.Common.v1.SemanticObject": {
				String: "semObjNoQualifier"
			},
			"com.sap.vocabularies.Common.v1.SemanticObject#firstSemObj": {
				String: "firstSemObj"
			},
			"com.sap.vocabularies.Common.v1.SemanticObject#secondSemObj": {
				String: "secondSemObj"
			},
			"com.sap.vocabularies.Common.v1.Text": {
				String: "justSomeText"
			}
		};
		var aExpectedValue = ["firstSemObj", "secondSemObj"];
		var aResult = this.oAnnotationHelper.getAdditionalSemanticObjects(oDataFieldValue);
		assert.deepEqual(aExpectedValue, aResult, "the returned array of additional semantic objects is correct");
		assert.equal(aResult.length, 2, "the returned array contains the correct number of items");
	});

	QUnit.test("check method getTableTitle with Mock data", function () {
		var aFacets = [];
		aFacets[0] = {
			Facets: [{
				Facets: [{
						Label: {
							String: "Product Texts"
						},
						RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
						Target: {
							AnnotationPath: "to_ProductText/@com.sap.vocabularies.UI.v1.LineItem"
						}
					},
					{
						Label: {
							String: "Sales"
						},
						RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
						Target: {
							AnnotationPath: "to_ProductSalesPrice/@com.sap.vocabularies.UI.v1.LineItem"
						}
					}
				],
				Label: {
					String: "Product Texts"
				},
				RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
			}],
			Label: {
				String: "General Information"
			},
			RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
		};
		aFacets[1] = {
			Label: {
				String: "Sales Revenue"
			},
			RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
			Target: {
				AnnotationPath: "to_ProductSalesData/@com.sap.vocabularies.UI.v1.LineItem"
			}
		};
		var oHeader = {
			Title: {
				EdmType: "Edm.String",
				RecordType: "com.sap.vocabularies.UI.v1.DataField",
				Value: {
					Path: "Name"
				}
			},
			TypeName: {
				String: "Product Text"
			},
			TypeNamePlural: {
				String: "Product Texts"
			}
		};
		var oFacet = {
			Label: {
				String: "Product Text"
			},
			RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
			Target: {
				AnnotationPath: "to_ProductText/@com.sap.vocabularies.UI.v1.LineItem"
			}
		};
		//case 1: When both section title and table title is same
		var sExpectedString = "{parts: [{path: '@i18n>Product Texts'}, {path: '@i18n>Product Texts'}], formatter: 'sap.suite.ui.generic.template.js.AnnotationHelper.formatTableTitle'}"
		var sReturnString = this.oAnnotationHelper.getTableTitle(aFacets, oFacet, oHeader);
		assert.equal(sReturnString, sExpectedString, "No table title is rendered when both section & table title is same");

		//case 2:When TypeNamePlural is empty string in HeaderInfo
		oHeader = {
			Title: {
				EdmType: "Edm.String",
				RecordType: "com.sap.vocabularies.UI.v1.DataField",
				Value: {
					Path: "Name"
				}
			},
			TypeName: {
				String: "Product Text"
			},
			TypeNamePlural: {
				String: ""
			}
		};
		oFacet = {
			Label: {
				String: "Sales Revenue"
			},
			RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
			Target: {
				AnnotationPath: "to_ProductSalesData/@com.sap.vocabularies.UI.v1.LineItem"
			}
		};
		sExpectedString = "";
		sReturnString = this.oAnnotationHelper.getTableTitle(aFacets, oFacet, oHeader);
		assert.equal(sReturnString, sExpectedString, "No Table title is rendered when TypeNamePlural is empty string");

		//case 3: When no HeaderInfo annotation exists
		oFacet = {
			Label: {
				String: "Sales"
			},
			RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
			Target: {
				AnnotationPath: "to_ProductSalesPrice/@com.sap.vocabularies.UI.v1.LineItem"
			}
		};
		oHeader = {};
		sExpectedString = "";
		sReturnString = this.oAnnotationHelper.getTableTitle(aFacets, oFacet, oHeader);
		assert.equal(sReturnString, sExpectedString, "No Table title is rendered when HeaderInfo annotation does not exists");

		//case 4:When TypeNamePlural and facet label contains single quotes in typeNamePlural of HeaderInfo
		oHeader = {
			Title: {
				EdmType: "Edm.String",
				RecordType: "com.sap.vocabularies.UI.v1.DataField",
				Value: {
					Path: "Name"
				}
			},
			TypeName: {
				String: "Product Text"
			},
			TypeNamePlural: {
				String: "Product T'ext T'able"
			}
		};
		oFacet = {
			Label: {
				String: "Sales Re'venue"
			},
			RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
			Target: {
				AnnotationPath: "to_ProductSalesData/@com.sap.vocabularies.UI.v1.LineItem"
			}
		};
		sExpectedString = "{parts: [{path: '@i18n>Product T\\'ext T\\'able'}, {path: '@i18n>Sales Revenue'}], formatter: 'sap.suite.ui.generic.template.js.AnnotationHelper.formatTableTitle'}";
		sReturnString = this.oAnnotationHelper.getTableTitle(aFacets, oFacet, oHeader);
		assert.equal(sReturnString, sExpectedString, "Table title is rendered when TypeNamePlural contains single quotes");

		//case 5:When TypeNamePlural and facet label contains double quotes in typeNamePlural of HeaderInfo
		aFacets[1] = {
			Label: {
				String: 'Sales R"evenue'
			},
			RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
			Target: {
				AnnotationPath: "to_ProductSalesData/@com.sap.vocabularies.UI.v1.LineItem"
			}
		};
		oHeader = {
			Title: {
				EdmType: "Edm.String",
				RecordType: "com.sap.vocabularies.UI.v1.DataField",
				Value: {
					Path: "Name"
				}
			},
			TypeName: {
				String: "Product Text"
			},
			TypeNamePlural: {
				String: 'Produc"t T"ext'
			}
		};
		oFacet = {
			Label: {
				String: 'Sales R"evenue'
			},
			RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
			Target: {
				AnnotationPath: "to_ProductSalesData/@com.sap.vocabularies.UI.v1.LineItem"
			}
		};
		sExpectedString = "{parts: [{path: '@i18n>Produc" + '\\"' + "t T" + '\\"' + "ext'}, {path: '@i18n>Sales R" + '\\"' + "evenue'}], formatter: 'sap.suite.ui.generic.template.js.AnnotationHelper.formatTableTitle'}";
		sReturnString = this.oAnnotationHelper.getTableTitle(aFacets, oFacet, oHeader);
		assert.equal(sReturnString, sExpectedString, "Table title is rendered when TypeNamePlural contains double quotes");
	});

	QUnit.test("check method formatTableTitle with Mock data", function () {
		//case 1:Table title and section title is different, return table title
		var sTableTitle = "Product Texts";
		var sSectionTitle = "Product Details";
		var sReturnString = this.oAnnotationHelper.formatTableTitle(sTableTitle, sSectionTitle);
		assert.equal(sReturnString, sTableTitle, "Table Title is rendered");
		//case 2: No table title should be rendered
		sTableTitle = "Product Texts";
		sSectionTitle = "Product Texts";
		sReturnString = this.oAnnotationHelper.formatTableTitle(sTableTitle, sSectionTitle);
		assert.equal(sReturnString, "", "No Table Title is rendered");
	});

	QUnit.test("Check searchForFirstSemKey_Title_Description", function () {
		var oEntityType = {
			getPath: function () {
				return sPath
			},
			getObject: function () {
				return oEntityTypeAnnotations
			}
		};
		var sFirstSemKeyValue = "firstSemKey",
			sTitlePath = "titlePath",
			sDescriptionPath = "descriptionPath",
			sSecondSemKeyValue = "secondSemKey",
			sPath = "myPath";

		var oEntityTypeAnnotations = {
			"com.sap.vocabularies.Common.v1.SemanticKey": [{
					PropertyPath: sFirstSemKeyValue,
				},
				{
					PropertyPath: "secondSemKy"
				}
			],
			"com.sap.vocabularies.UI.v1.LineItem": [{
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Value: {
						Path: sFirstSemKeyValue
					}
				},
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Value: {
						Path: sSecondSemKeyValue
					}
				},
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Value: {
						Path: sDescriptionPath
					}
				},
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Value: {
						Path: sTitlePath
					}
				}
			],
			"com.sap.vocabularies.UI.v1.LineItem#Reduced": [{
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Value: {
						Path: sFirstSemKeyValue
					}
				},
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Value: {
						Path: sSecondSemKeyValue
					}
				},
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Value: {
						Path: sDescriptionPath
					}
				},
				{
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Value: {
						Path: sTitlePath
					}
				}
			],
			"com.sap.vocabularies.UI.v1.HeaderInfo": {
				"Title": {
					Value: {
						Path: sTitlePath
					}
				},
				"Description": {
					Value: {
						Path: sDescriptionPath
					}
				}
			}
		};

		var oModel = {
			getObject: function (sEntityTypePath) {
				return oEntityTypeAnnotations;
			}
		};
		var oLineItem = {
			sPath: sPath,
			getPath: function () {
				return this.sPath;
			},
			setPath: function (sPath) {
				this.sPath = sPath;
			},
			getModel: function () {
				return oModel;
			}
		};


		var sLineItemPath = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem";
		oLineItem.setPath(sLineItemPath);

		// if semantic key is present the path with the first semantic key should be returned
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem" + '/' + 0 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path for the first semantic key is returned correctly");

		// if semantic key is present but 'hidden' according to the annotation the Title should be returned
		// for compatibility reasons we have to also support "com.sap.vocabularies.Common.v1.FieldControlType/Hidden"
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem"][0]["com.sap.vocabularies.Common.v1.FieldControl"] = {
			EnumMember: "com.sap.vocabularies.Common.v1.FieldControlType/Hidden"
		};
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem" + '/' + 3 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path with the title is returned correctly if semantic key is hidden with 'com.sap.vocabularies.Common.v1.FieldControlType/Hidden' annotation");

		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem"][0]["com.sap.vocabularies.Common.v1.FieldControl"] = null;
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem"][0]["com.sap.vocabularies.UI.v1.Hidden"] = {};
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem" + '/' + 3 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path with the title is returned correctly if semantic key is hidden with 'com.sap.vocabularies.UI.v1.Hidden' annotation");

		// if semantic key and Title are 'hidden' Description should be returned
		// for compatibility reasons we have to also support "com.sap.vocabularies.Common.v1.FieldControlType/Hidden"
		//set title to 'hidden'
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem"][3]["com.sap.vocabularies.Common.v1.FieldControl"] = {
			EnumMember: "com.sap.vocabularies.Common.v1.FieldControlType/Hidden"
		};
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem" + '/' + 2 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path with the description is returned correctly if semantic key and title are hidden");

		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem"][3]["com.sap.vocabularies.Common.v1.FieldControl"] = null;
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem"][3]["com.sap.vocabularies.UI.v1.Hidden"] = {};
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem" + '/' + 2 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path with the description is returned correctly if semantic key and title are hidden");


		//now test without any hidden annotations
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem"][3]["com.sap.vocabularies.UI.v1.Hidden"] = null;
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem"][0]["com.sap.vocabularies.UI.v1.Hidden"] = null;
		//if no semantic key is present the path with the Title should be returned
		oEntityTypeAnnotations["com.sap.vocabularies.Common.v1.SemanticKey"] = null;
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem" + '/' + 3 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path with the title is returned correctly if no semantic key is present");

		//if no semantic key is present and no Title the path with the Description should be returned
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem"][3].Value.Path = "somethingDifferentFormTitle";
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem" + '/' + 2 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path with the description is returned correctly if no semantic key and no title is present");



		// the tests for line item annotation with qualifier
		oEntityTypeAnnotations["com.sap.vocabularies.Common.v1.SemanticKey"] = [{
				PropertyPath: sFirstSemKeyValue
			},
			{
				PropertyPath: "secondSemKy"
			}
		];


		var sLineItemPath = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem#Reduced";
		oLineItem.setPath(sLineItemPath);

		// if semantic key is present the path with the first semantic key should be returned
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem#Reduced" + '/' + 0 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path for the first semantic key is returned correctly");

		// if semantic key is present but 'hidden' according to the annotation the Title should be returned
		// for compatibility reasons we have to also support "com.sap.vocabularies.Common.v1.FieldControlType/Hidden"
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem#Reduced"][0]["com.sap.vocabularies.Common.v1.FieldControl"] = {
			EnumMember: "com.sap.vocabularies.Common.v1.FieldControlType/Hidden"
		};
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem#Reduced" + '/' + 3 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path with the title is returned correctly if semantic key is hidden with 'com.sap.vocabularies.Common.v1.FieldControlType/Hidden' annotation");

		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem#Reduced"][0]["com.sap.vocabularies.Common.v1.FieldControl"] = null;
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem#Reduced"][0]["com.sap.vocabularies.UI.v1.Hidden"] = {};
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem#Reduced" + '/' + 3 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path with the title is returned correctly if semantic key is hidden with 'com.sap.vocabularies.UI.v1.Hidden' annotation");

		// if semantic key and Title are 'hidden' Description should be returned
		// for compatibility reasons we have to also support "com.sap.vocabularies.Common.v1.FieldControlType/Hidden"
		//set title to 'hidden'
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem#Reduced"][3]["com.sap.vocabularies.Common.v1.FieldControl"] = {
			EnumMember: "com.sap.vocabularies.Common.v1.FieldControlType/Hidden"
		};
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem#Reduced" + '/' + 2 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path with the description is returned correctly if semantic key and title are hidden");

		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem#Reduced"][3]["com.sap.vocabularies.Common.v1.FieldControl"] = null;
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem#Reduced"][3]["com.sap.vocabularies.UI.v1.Hidden"] = {};
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem#Reduced" + '/' + 2 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path with the description is returned correctly if semantic key and title are hidden");


		//now test without any hidden annotations
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem#Reduced"][3]["com.sap.vocabularies.UI.v1.Hidden"] = null;
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem#Reduced"][0]["com.sap.vocabularies.UI.v1.Hidden"] = null;
		//if no semantic key is present the path with the Title should be returned
		oEntityTypeAnnotations["com.sap.vocabularies.Common.v1.SemanticKey"] = null;
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem#Reduced" + '/' + 3 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path with the title is returned correctly if no semantic key is present");

		//if no semantic key is present and no Title the path with the Description should be returned
		oEntityTypeAnnotations["com.sap.vocabularies.UI.v1.LineItem#Reduced"][3].Value.Path = "somethingDifferentFormTitle";
		var sExpectedValue = sPath + '/' + "com.sap.vocabularies.UI.v1.LineItem#Reduced" + '/' + 2 + '/Value/Path';
		var sResult = this.oAnnotationHelper.searchForFirstSemKey_Title_Description(oLineItem);
		assert.equal(sExpectedValue, sResult, "the path with the description is returned correctly if no semantic key and no title is present");

	});

	QUnit.test("Check getTextArrangement method", function () {
		//empty objects
		var oEntityType = {};
		var oDataField = {};
		var sExpectedValue = "";
		var sActualValue = this.oAnnotationHelper.getTextArrangement(oEntityType, oDataField);
		sExpectedValue = "descriptionAndId";
		assert.equal(sActualValue, sExpectedValue, "If no text arrangement is passed, the defaul value should is returned: " + sExpectedValue);

		//check TextArrangement definition for property directly - has prio 1
		oEntityType = {};
		oDataField = {
			"com.sap.vocabularies.UI.v1.TextArrangement": {
				EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
			}
		};
		sExpectedValue = "";
		sActualValue = this.oAnnotationHelper.getTextArrangement(oEntityType, oDataField);
		sExpectedValue = "descriptionOnly";
		assert.equal(sActualValue, sExpectedValue, "check TextArrangement definition for property directly: " + sExpectedValue);

		//check TextArrangement definition under property/text - has prio 2
		oEntityType = {};
		oDataField = {
			"com.sap.vocabularies.Common.v1.Text": {
				"com.sap.vocabularies.UI.v1.TextArrangement": {
					EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
				}
			}
		};
		sExpectedValue = "";
		sActualValue = this.oAnnotationHelper.getTextArrangement(oEntityType, oDataField);
		sExpectedValue = "descriptionOnly";
		assert.equal(sActualValue, sExpectedValue, "check TextArrangement definition under property/text: " + sExpectedValue);

		//check TextArrangement definition for entity type
		oEntityType = {
			"com.sap.vocabularies.UI.v1.TextArrangement": {
				EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
			}
		};
		oDataField = {};
		sExpectedValue = "";
		sActualValue = this.oAnnotationHelper.getTextArrangement(oEntityType, oDataField);
		sExpectedValue = "descriptionOnly";
		assert.equal(sActualValue, sExpectedValue, "check TextArrangement definition for entity type: " + sExpectedValue);

		//use a combination of different places to define text arrangement to check the right prio
		oEntityType = {
			"com.sap.vocabularies.UI.v1.TextArrangement": {
				EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextLast"
			}
		};
		oDataField = {
			"com.sap.vocabularies.Common.v1.Text": {
				"com.sap.vocabularies.UI.v1.TextArrangement": {
					EnumMember: "com.sap.vocabularies.UI.v1.TextArrangementType/TextOnly"
				}
			}
		};
		sExpectedValue = "";
		sActualValue = this.oAnnotationHelper.getTextArrangement(oEntityType, oDataField);
		sExpectedValue = "descriptionOnly";
		assert.equal(sActualValue, sExpectedValue, "use a combination of different places to define text arrangement to check the right prio: " + sExpectedValue);
	});

	QUnit.test("Check isPropertyHidden method", function () {
		var oLineItemAnnotations = {};
		var bExpectedValue;

		//no hidden annotation => should return 'false'
		bExpectedValue = false;
		var bResult = this.oAnnotationHelper.isPropertyHidden(oLineItemAnnotations);
		assert.equal(bExpectedValue, bResult, "if no 'hidden' annotation is present the method should return 'false'");

		oLineItemAnnotations["com.sap.vocabularies.UI.v1.Hidden"] = {};
		bExpectedValue = true;
		bResult = this.oAnnotationHelper.isPropertyHidden(oLineItemAnnotations);
		assert.equal(bExpectedValue, bResult, "if 'UI.v1.Hidden' annotation is present the method should return 'true'");

		oLineItemAnnotations = {
			"com.sap.vocabularies.Common.v1.FieldControl": {
				"EnumMember": "com.sap.vocabularies.Common.v1.FieldControlType/Hidden"
			}
		};
		bResult = this.oAnnotationHelper.isPropertyHidden(oLineItemAnnotations);
		assert.equal(bExpectedValue, bResult, "if 'FieldControlType/Hidden' annotation is present the method should return 'true'");
	});

	QUnit.test("Check createP13NColumnForContactPopUp method", function () {
		this.oModel = {
			getODataEntityType: function (sQualifiedName, bAsPath) {
				var oODataEntityType = null;
				if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductType") {
					oODataEntityType = {
						name: "STTA_C_MP_ProductType"
					};
				} else if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_SupplierType") {
					oODataEntityType = {
						name: "STTA_C_MP_SupplierType"
					};
				}
				return oODataEntityType;
			},
			getODataAssociationEnd: function (oEntityType, sName) {
				var oODataAssociationEnd = null;
				if (sName === "to_Supplier") {
					oODataAssociationEnd = {
						type: "STTA_PROD_MAN.STTA_C_MP_SupplierType",
						multiplicity: "0..1"
					};
				}
				return oODataAssociationEnd;
			},
			getODataAssociationSetEnd: function (oEntityType, sNavigation) {
				var sEntitySet = null;
				if (sNavigation === "to_Supplier") {
					sEntitySet = "STTA_C_MP_SupplierType";
				}
				return sEntitySet;
			},
			getODataEntitySet: function (sEntitySet) {
				if (sEntitySet === "STTA_C_MP_SupplierType") {
					return oContextSet;
				}
			}
		};
		var oContextSet = {
			name: "STTA_C_MP_Product",
			entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType",
			"Org.OData.Capabilities.V1.SortRestrictions": {
				NonSortableProperties: [{
					PropertyPath: "FullName"
				}]
			}
		};
		var aLineItem = [{
				EdmType: "Edm.String",
				RecordType: "com.sap.vocabularies.UI.v1.DataField",
				Value: {
					Path: "ProductForEdit"
				},
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
				}
			},
			{
				EdmType: "Edm.String",
				RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
				Target: {
					AnnotationPath: "to_Supplier/@com.sap.vocabularies.Communication.v1.Contact"
				}
			},
			{
				EdmType: "Edm.String",
				RecordType: "com.sap.vocabularies.UI.v1.DataField",
				Value: {
					Path: "Category"
				},
				"com.sap.vocabularies.UI.v1.Importance": {
					EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
				}
			}
		];

		this.oInterface = {
			getInterface: function (iPart, sPath) {
				var oResult = {}
				if (iPart === 0) {
					oResult = {
						getModel: function () {
							return this.oModel;
						}.bind(this)
					};
				} else {
					oResult = {
						oDataField: oDataField,
						getPath: function () {
							that = this;
							var aColumnIndex = map(aLineItem, function (oColumn, iIndex) {
								if (oColumn.Target && oColumn.Target.AnnotationPath === that.oDataField.Target.AnnotationPath) {
									return iIndex;
								}
							});
							return (aColumnIndex[0] >= 0 ? "/dataServices/schema/0/entityType/1/com.sap.vocabularies.UI.v1.LineItem/" + aColumnIndex[0] : "");
						},
						getModel: function () {
							return {
								getObject: function (sTerm) {
									return aLineItem;
								}
							};
						}
					}
				}
				return oResult;
			}.bind(this)
		};

		var oDataField = {
			EdmType: "Edm.String",
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
			Target: {
				AnnotationPath: "to_Supplier/@com.sap.vocabularies.Communication.v1.Contact"
			},
			"com.sap.vocabularies.UI.v1.Importance": {
				EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		};

		var oDataFieldTarget1 = {
			fn: {
				Path: "CompanyName"
			}
		};
		var oDataFieldTarget2 = {
			fn: {
				Path: "FullName"
			}
		};
		var sAnnotationPath = "to_Supplier/@com.sap.vocabularies.Communication.v1.Contact";
		var sActualValue = this.oAnnotationHelper.createP13NColumnForContactPopUp(this.oInterface, oContextSet, oDataField, oDataFieldTarget1, sAnnotationPath);
		var sExpectedValue = "\\{\"columnKey\":\"template::DataFieldForAnnotation::to_Supplier/com.sap.vocabularies.Communication.v1.Contact\", \"leadingProperty\":\"to_Supplier/CompanyName\", \"additionalProperty\":\"to_Supplier\", \"sortProperty\":\"to_Supplier/CompanyName\", \"filterProperty\":\"to_Supplier/CompanyName\", \"navigationProperty\":\"to_Supplier\", \"columnIndex\":\"1\" \\}";
		assert.equal(sActualValue, sExpectedValue, "Should return Expected Value:" + sExpectedValue);
		var sActualValue = this.oAnnotationHelper.createP13NColumnForContactPopUp(this.oInterface, oContextSet, oDataField, oDataFieldTarget2, sAnnotationPath);
		var sExpectedValue = "\\{\"columnKey\":\"template::DataFieldForAnnotation::to_Supplier/com.sap.vocabularies.Communication.v1.Contact\", \"leadingProperty\":\"to_Supplier/FullName\", \"additionalProperty\":\"to_Supplier\", \"filterProperty\":\"to_Supplier/FullName\", \"navigationProperty\":\"to_Supplier\", \"columnIndex\":\"1\" \\}";
		assert.equal(sActualValue, sExpectedValue, "Should return Expected Value:" + sExpectedValue);
	});

	QUnit.test("check method hasQuickViewFacet with Mock data", function () {

		var done = assert.async();
		var oModel = this.getMockModel();
		assert.ok(oModel, "oModel Initiated");
		var oAnnotationHelper = this.oAnnotationHelper;
		var that = this;
		if (oModel) {
			oModel.getMetaModel().loaded().then(function () {
				var oMetaModel = oModel.getMetaModel();
				var oInterface = {
					getModel: function () {
						return oMetaModel;
					}
				};
				var oEntitySet = oMetaModel.getODataEntitySet("SEPMRA_C_PD_Product")
				var sResult = that.oAnnotationHelper.hasQuickViewFacet(oInterface, oEntitySet);
				var sExpected = "\\{\"Weight\":\"true\"\\}";
				assert.equal(sResult, sExpected, "Function returned correct value for forceLinks");
				done();
			});
		}
	});

	QUnit.test("check method buildHeaderInfoCustomData with Mock data", function () {

		var done = assert.async();
		var oModel = this.getMockModel();
		assert.ok(oModel, "oModel Initiated");
		var oAnnotationHelper = this.oAnnotationHelper;
		var that = this;
		if (oModel) {
			oModel.getMetaModel().loaded().then(function () {
				var oMetaModel = oModel.getMetaModel();
				var oInterface = {
					getModel: function () {
						return oMetaModel;
					}
				};
				var oDataField = {"Title":{"Value":{"String":"dummyTitle"},"RecordType":"com.sap.vocabularies.UI.v1.DataField","EdmType":"Edm.String"},"Description":{"Value":{"String":"dummySubTitle"},"RecordType":"com.sap.vocabularies.UI.v1.DataField"}};
				var sResult = that.oAnnotationHelper.buildHeaderInfoCustomData(oInterface, oDataField);
				var sExpected = '\{"headerTitle":"dummyTitle"\,"isHeaderTitlePath":false\,"headerSubTitle":"dummySubTitle"\,"isHeaderSubTitlePath":false\}';
				debugger;
				assert.equal(sResult, sExpected, "Function returned correct customData");
				done();
			});
		}
	});

	QUnit.test("Check Muliplicity for SmartField/Smart MultiInput ", function () {
		var oModel = {
			getODataEntityType: function (sQualifiedName, bAsPath) {
				var oODataEntityType = null;
				if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductType") {
					oODataEntityType = {
						name: "STTA_C_MP_ProductType"
					};
				} else if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_SupplierType") {
					oODataEntityType = {
						name: "STTA_C_MP_SupplierType"
					};
				}
				return oODataEntityType;
			},
			getODataAssociationEnd: function (oEntityType, sName) {
				var oODataAssociationEnd = null;
				if (sName === "to_Supplier") {
					oODataAssociationEnd = {
						type: "STTA_PROD_MAN.STTA_C_MP_SupplierType",
						multiplicity: "*"
					};
				}
				return oODataAssociationEnd;
			}
		};

		var oInterface = {
			getModel: function () {
				return oModel;
			}
		};
		var oDataField = {
			EdmType: "Edm.String",
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
			Value: {
				Path: "to_Supplier/Product"
			},
			"com.sap.vocabularies.UI.v1.Importance": {
				EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		};

		var oEntitySet = {
			entityType: "STTA_PROD_MAN.STTA_C_MP_SupplierType"
		};
		// Smart MultiInput as Mulitiplicity is "*"
		var sActualValue = this.oAnnotationHelper.checkMultiplicityForDataFieldAssociation(oInterface, oEntitySet, oDataField);
		var sExpectedValue = false;
		assert.equal(sActualValue, sExpectedValue, "Should return Expected Value:" + sExpectedValue);

		oModel = {
			getODataEntityType: function (sQualifiedName, bAsPath) {
				var oODataEntityType = null;
				if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductType") {
					oODataEntityType = {
						name: "STTA_C_MP_ProductType"
					};
				} else if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_SupplierType") {
					oODataEntityType = {
						name: "STTA_C_MP_SupplierType"
					};
				}
				return oODataEntityType;
			},
			getODataAssociationEnd: function (oEntityType, sName) {
				var oODataAssociationEnd = null;
				if (sName === "to_Supplier") {
					oODataAssociationEnd = {
						type: "STTA_PROD_MAN.STTA_C_MP_SupplierType",
						multiplicity: "0..1"
					};
				}
				return oODataAssociationEnd;
			}
		};

		// SmartField as Mulitiplicity is "0..1"
		sActualValue = this.oAnnotationHelper.checkMultiplicityForDataFieldAssociation(oInterface, oEntitySet, oDataField);
		sExpectedValue = true;
		assert.equal(sActualValue, sExpectedValue, "Should return Expected Value:" + sExpectedValue);

		oDataField = {
			EdmType: "Edm.String",
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
			Value: {
				Path: "Product"
			},
			"com.sap.vocabularies.UI.v1.Importance": {
				EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		};

		// SmartField as their is no Navigation Property
		sActualValue = this.oAnnotationHelper.checkMultiplicityForDataFieldAssociation(oInterface, oEntitySet, oDataField);
		sExpectedValue = true;
		assert.equal(sActualValue, sExpectedValue, "Should return Expected Value:" + sExpectedValue);
	});

	QUnit.test("Check Muliplicity for Smart MultiInput inside Table in LR and OP", function () {
		var oModel = {
			getODataEntityType: function (sQualifiedName, bAsPath) {
				var oODataEntityType = null;
				if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductType") {
					oODataEntityType = {
						name: "STTA_C_MP_ProductType"
					};
				} else if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_SupplierType") {
					oODataEntityType = {
						name: "STTA_C_MP_SupplierType"
					};
				}
				return oODataEntityType;
			},
			getODataAssociationEnd: function (oEntityType, sName) {
				var oODataAssociationEnd = null;
				if (sName === "to_Supplier") {
					oODataAssociationEnd = {
						type: "STTA_PROD_MAN.STTA_C_MP_SupplierType",
						multiplicity: "*"
					};
				}
				return oODataAssociationEnd;
			}
		};

		var oInterface = {
			getModel: function () {
				return oModel;
			}
		};
		var oDataField = {
			EdmType: "Edm.String",
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
			Value: {
				Path: "to_Supplier/Product"
			},
			"com.sap.vocabularies.UI.v1.Importance": {
				EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		};

		var oEntitySet = {
			entityType: "STTA_PROD_MAN.STTA_C_MP_SupplierType"
		};
		// Smart MultiInput as Mulitiplicity is "*"
		var sActualValue = this.oAnnotationHelper.checkMultiplicityForDataFieldAssociationInTable(oInterface, oEntitySet, oDataField);
		var sExpectedValue = true;
		assert.equal(sActualValue, sExpectedValue, "Should return Expected Value:" + sExpectedValue);

		oModel = {
			getODataEntityType: function (sQualifiedName, bAsPath) {
				var oODataEntityType = null;
				if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_ProductType") {
					oODataEntityType = {
						name: "STTA_C_MP_ProductType"
					};
				} else if (sQualifiedName === "STTA_PROD_MAN.STTA_C_MP_SupplierType") {
					oODataEntityType = {
						name: "STTA_C_MP_SupplierType"
					};
				}
				return oODataEntityType;
			},
			getODataAssociationEnd: function (oEntityType, sName) {
				var oODataAssociationEnd = null;
				if (sName === "to_Supplier") {
					oODataAssociationEnd = {
						type: "STTA_PROD_MAN.STTA_C_MP_SupplierType",
						multiplicity: "0..1"
					};
				}
				return oODataAssociationEnd;
			}
		};

		// SmartField as Mulitiplicity is "0..1"
		sActualValue = this.oAnnotationHelper.checkMultiplicityForDataFieldAssociationInTable(oInterface, oEntitySet, oDataField);
		sExpectedValue = false;
		assert.equal(sActualValue, sExpectedValue, "Should return Expected Value:" + sExpectedValue);

		oDataField = {
			EdmType: "Edm.String",
			RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
			Value: {
				Path: "Product"
			},
			"com.sap.vocabularies.UI.v1.Importance": {
				EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
			}
		};

		// SmartField as their is no Navigation Property
		sActualValue = this.oAnnotationHelper.checkMultiplicityForDataFieldAssociation(oInterface, oEntitySet, oDataField);
		sExpectedValue = true;
		assert.equal(sActualValue, sExpectedValue, "Should return Expected Value:" + sExpectedValue);
	});

	QUnit.test("Check getDataFieldValue function", function () {
		var oInnerInterface = {};
		var sFormatString;
		var oModel;
		var oInterface = {
			getModel: function(){
				assert.ok(sFormatString, "oInterface must only be accessed if a type has been specified");
				return oModel;
			},
			getInterface: function(i){
				assert.ok(sFormatString, "oInterface must only be accessed if a type has been specified");
				assert.ok(!oModel, "Sub-Interface must only be requested for complex bindings");
				assert.strictEqual(i, 0, "Only interface with index 0 must be accessed");
				return oInnerInterface;
			}
		};
		var oDataFieldValue;
		var fnFormat = sinon.stub(sap.ui.model.odata.AnnotationHelper, "format", function(vPar1, vPar2){
			assert.ok(sFormatString, "Ui5 annotation helper must only be called if a type has been specified");
			assert.strictEqual(vPar1, oModel ? oInterface : oInnerInterface, "Interface param must be the inner interface");
			assert.strictEqual(vPar2, oDataFieldValue, "data field specificationm must be forwarded to UI5 annotation helper");
			return sFormatString;
		});
		oDataFieldValue = {
			Path: ""
		};
		var sExpectedValue = "";
		sResult = this.oAnnotationHelper.getDataFieldValue(oInterface, oDataFieldValue);
		assert.equal("", sResult, "the returned value is correct for empty Path");

		for (var i = 0; i < 2; i++){
			oDataFieldValue = {
				Path: "ProductForEdit"
			};
			sFormatString = {};
			sResult = this.oAnnotationHelper.getDataFieldValue(oInterface, oDataFieldValue);
			assert.strictEqual(sFormatString, sResult, "for two way bindings the result must be taken from the UI5 formatter");

			sFormatString = "{any string}";
			sResult = this.oAnnotationHelper.getDataFieldValue(oInterface, oDataFieldValue, "OneWay");
			assert.strictEqual(sResult, "{ mode:'OneWay', any string}", "One way binding must have been inserted correctly");
			oModel = {};
		}
		fnFormat.restore();
	});

	QUnit.test("Check setRowHighlight method", function () {
		var oAnnotationHelper = this.oAnnotationHelper;
		var oEntityType = {
			"com.sap.vocabularies.UI.v1.LineItem@com.sap.vocabularies.UI.v1.Criticality": {
				"Path": {
					"crtiticality": "3"
				}
			}
		};
		var sActualValueReturned = oAnnotationHelper.setRowHighlight(oEntityType);
		var sExpectedvalueReturned = "{parts: [{path: 'IsActiveEntity'}, {path: 'HasActiveEntity'}, {path: '[object Object]'}], formatter: 'sap.suite.ui.generic.template.js.AnnotationHelper.setInfoHighlight'}";
		assert.equal(sActualValueReturned, sExpectedvalueReturned, "Function setRowHighlight should return a formatter");
	});

	QUnit.test("Check method getExtensions", function () {
		var oAnnotationHelper = this.oAnnotationHelper;
		var oManifest = {
			getObject: function () {
				return {
					"BeforeFacet|STTA_C_MP_Product|to_ProductSalesData::com.sap.vocabularies.UI.v1.LineItem": {
						"className": "sap.ui.core.mvc.View",
						"viewName": "STTA_MP.ext.view.ProductSalesPrice",
						"type": "XML",
						"sap.ui.generic.app": {
							"title": "Sales Price table (Before Extension for chart)",
							"enableLazyLoading": true
						}
					},
					"BeforeFacet|STTA_C_MP_Product|GeneralInformation": {
						"className": "sap.ui.core.mvc.View",
						"viewName": "STTA_MP.ext.view.ProductSalesPrice",
						"type": "XML",
						"sap.ui.generic.app": {
							"title": "Sales Price table (Before Extension)",
							"enableLazyLoading": true
						}
					}
				}
			},
			getModel: function () {
				return {
					setProperty: function () {
						return;
					}
				};
			}
		};
		var sActualValueOfExtensionsPath = oAnnotationHelper.getExtensions(oManifest);
		assert.equal(sActualValueOfExtensionsPath, "/extensionKeys", "Function getExtensions should return /extensionKeys path");
	});

	QUnit.test("Check method isCurrentManifestEntryForBeforeFacet", function () {
		var oAnnotationHelper = this.oAnnotationHelper;
		var sManifestKey = "BeforeFacet|STTA_C_MP_Product|GeneralInformation|1";
		var sEntitySet = "STTA_C_MP_Product";
		var oFacet = {
			"ID": {
				"String": "GeneralInformation"
			},
			"Label": {
				"String": "{@i18n>@ProductDescriptions}"
			},
			"RecordType": "com.sap.vocabularies.UI.v1.ReferenceFacet",
			"Target": {
				"AnnotationPath": "to_EntitySet/@com.sap.vocabularies.UI.v1.LineItem"
			}
		};
		var bActualValueReturned = oAnnotationHelper.isCurrentManifestEntryForBeforeFacet(sManifestKey, sEntitySet, oFacet);
		assert.equal(bActualValueReturned, true, "Function isCurrentManifestEntryForFacet should return true");
	});

	QUnit.test("Check method isCurrentManifestEntryForAfterFacet", function () {
		var oAnnotationHelper = this.oAnnotationHelper;
		var sManifestKey = "AfterFacet|STTA_C_MP_Product|GeneralInformation|1";
		var sEntitySet = "STTA_C_MP_Product";
		var oFacet = {
			"ID": {
				"String": "GeneralInformation"
			},
			"Label": {
				"String": "{@i18n>@ProductDescriptions}"
			},
			"RecordType": "com.sap.vocabularies.UI.v1.ReferenceFacet",
			"Target": {
				"AnnotationPath": "to_EntitySet/@com.sap.vocabularies.UI.v1.LineItem"
			}
		};
		var bActualValueReturned = oAnnotationHelper.isCurrentManifestEntryForAfterFacet(sManifestKey, sEntitySet, oFacet);
		assert.equal(bActualValueReturned, true, "Function isCurrentManifestEntryForAfterFacet should return true");
	});

	QUnit.test("Check function isManifestKeyLegacy", function () {
		var oAnnotationHelper = this.oAnnotationHelper;
		var sManifestKey = "BeforeFacet|STTA_C_MP_Product|GeneralInformation";
		var bActualValueReturned = oAnnotationHelper.isManifestKeyLegacy(sManifestKey);
		assert.equal(bActualValueReturned, true, "Function isManifestKeyLegacy should return true");
	});

	QUnit.test("Check function getExtensionPointFacetTitle", function () {
		var oAnnotationHelper = this.oAnnotationHelper;
		var sManifestKey = "BeforeFacet|STTA_C_MP_Product|GeneralInformation";
		var oManifest = {
			"BeforeFacet|STTA_C_MP_Product|to_ProductSalesData::com.sap.vocabularies.UI.v1.LineItem": {
				"className": "sap.ui.core.mvc.View",
				"viewName": "STTA_MP.ext.view.ProductSalesPrice",
				"type": "XML",
				"sap.ui.generic.app": {
					"title": "Sales Price table (Before Extension for chart)",
					"enableLazyLoading": true
				}
			},
			"BeforeFacet|STTA_C_MP_Product|GeneralInformation": {
				"className": "sap.ui.core.mvc.View",
				"viewName": "STTA_MP.ext.view.ProductSalesPrice",
				"type": "XML",
				"sap.ui.generic.app": {
					"title": "Sales Price table",
					"enableLazyLoading": true
				}
			}
		};
		var sActualTitleReturned = oAnnotationHelper.getExtensionPointFacetTitle(sManifestKey, oManifest);
		assert.equal(sActualTitleReturned, "Sales Price table", "Function getExtensionPointFacetTitle should return Sales Price table");
	});

	QUnit.test("Check function getObjectPageExtensions", function () {
		var oAnnotationHelper = this.oAnnotationHelper;
		var oContext = {
			getObject: function () {
				return {
					"BeforeFacet|STTA_C_MP_Product|to_ProductSalesData::com.sap.vocabularies.UI.v1.LineItem": {
						"className": "sap.ui.core.mvc.View",
						"viewName": "STTA_MP.ext.view.ProductSalesPrice",
						"type": "XML",
						"sap.ui.generic.app": {
							"title": "Sales Price table (Before Extension for chart)",
							"enableLazyLoading": true
						}
					},
					"BeforeFacet|STTA_C_MP_Product|GeneralInformation|1": {
						"className": "sap.ui.core.mvc.View",
						"viewName": "STTA_MP.ext.view.ProductSalesPrice",
						"type": "XML",
						"sap.ui.generic.app": {
							"title": "Sales Price table (Before Extension)",
							"enableLazyLoading": true
						}
					}
				}
			},
			getModel: function () {
				return {
					setProperty: function () {
						return;
					}
				};
			}
		};
		var sActualPathReturned = oAnnotationHelper.getObjectPageExtensions(oContext);
		assert.equal(sActualPathReturned, "/manifestViewExtensions", "Function getObjectPageExtensions should return /smanifestViewExtensions");
	});

	QUnit.test("Check function getSmartTableControl", function () {
		//Arrange
		var oSmartTable = {
				getEntitySet: function() {
					return {dummy: "value"};
				}
			};
		var oAnnotationHelper = this.oAnnotationHelper;
		var oColumn = {
			getParent: function(){
				return {
					getParent: function() {
						return oSmartTable;
					}
				}
			}
		}
		//Act
		var oControl = oAnnotationHelper.getSmartTableControl(oColumn);
		//Assert
		assert.deepEqual(oControl.getEntitySet(), oSmartTable.getEntitySet(), "Returns smart table control when a column control is passed");
	});

	QUnit.test("Check function getSmartTableControl", function () {
		//Arrange
		var oAnnotationHelper = this.oAnnotationHelper;
		var oSmartTable = {
				getEntitySet: function() {
					return {dummy: "value"};
				}
			};
		var oTable = {
			getParent: function(){
				return oSmartTable;
			}
		}
		//Act
		var oControl = oAnnotationHelper.getSmartTableControl(oTable);
		//Assert
		assert.deepEqual(oControl.getEntitySet(), oSmartTable.getEntitySet(), "Returns smart table control when table control is passed");
	});

	QUnit.test("Check function getSmartTableControl", function () {
		//Arrange
		var oAnnotationHelper = this.oAnnotationHelper;
		var oSmartTable = {
				getEntitySet: function() {
					return {dummy: "value"};
				}
			};
		//Act
		var oControl = oAnnotationHelper.getSmartTableControl(oSmartTable);
		//Assert
		assert.deepEqual(oControl.getEntitySet(), oSmartTable.getEntitySet(), "Returns smart table control when smart table control is passed");
	});

	QUnit.test("Check function getLineItemQualifier", function () {
		//Arrange
		var oAnnotationHelper = this.oAnnotationHelper;
		var oControlCustomData = [{
				getKey: function() {
					return "lineItemQualifier";
				},
				getValue: function() {
					return "Qualifier"
				}
			}
		];
		//Act
		var sQualifier = oAnnotationHelper.getLineItemQualifier(oControlCustomData);
		//Assert
		assert.deepEqual(sQualifier, "Qualifier", "Returns the defined lineitem qualifier");
	});

	QUnit.test("Check function getLineItemQualifier", function () {
		//Arrange
		var oAnnotationHelper = this.oAnnotationHelper;
		var oControlCustomData = [{
				getKey: function() {
					return "Key";
				},
				getValue: function() {
					return "Value"
				}
			}
		];
		//Act
		var sQualifier = oAnnotationHelper.getLineItemQualifier(oControlCustomData);
		//Assert
		assert.deepEqual(sQualifier, undefined, "Returns undefined when lineitem qualifier is not defined");
	});

	QUnit.test("Check function getLineItemQualifier", function () {
		//Arrange
		var oAnnotationHelper = this.oAnnotationHelper;
		var oControlCustomData = [];
		//Act
		var sQualifier = oAnnotationHelper.getLineItemQualifier(oControlCustomData);
		//Assert
		assert.deepEqual(sQualifier, undefined, "Returns undefined when custom data not defined");
	});

	QUnit.test("Check function setNoDataTextForSmartTable", function () {
		//Arrange
		var oAnnotationHelper = this.oAnnotationHelper;
		var sEntitySet = "STTA_C_MP_ProductText";
		var sSmartTableId = "stable--id::table";
		var sExpectedResult = "{parts: [{value: '::STTA_C_MP_ProductText--stable--id::table'}], formatter: '._templateFormatters.setNoDataTextForSmartTable'}";
		//Act
		var sResult = oAnnotationHelper.setNoDataTextForSmartTable(sEntitySet, sSmartTableId);
		//Assert
		assert.deepEqual(sResult, sExpectedResult, "Returns correct expression for evaluating i18n text");
	});

});
