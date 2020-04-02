sap.ui.define("sap/apf/core/utils/tUriGenerator", [
	"sap/apf/core/utils/filter",
	"sap/apf/core/utils/uriGenerator",
	"sap/apf/testhelper/doubles/messageHandler"
], function(Filter, uriGenerator, DoubleMessageHandler){
	'use strict';
	QUnit.module('Help functions located in URI Generator', {
		beforeEach : function(assert) {
			this.oMsgHandler = new DoubleMessageHandler().doubleCheckAndMessaging();
		}
	});
	QUnit.test("Add relative to absolute URL", function( assert ) {
		var sUri = uriGenerator.addRelativeToAbsoluteURL('/sap/apf/base', '../resources/i18n/texts.properties');
		assert.equal(sUri, '/sap/apf/resources/i18n/texts.properties', "THEN the correct absolute URL is produced" );
		sUri = uriGenerator.addRelativeToAbsoluteURL('/sap/apf/base', './resources/i18n/texts.properties');
		assert.equal(sUri, '/sap/apf/base/resources/i18n/texts.properties', "THEN the correct absolute URL is produced" );
		sUri = uriGenerator.addRelativeToAbsoluteURL('/sap/apf/base', '../../resources/i18n/texts.properties');
		assert.equal(sUri, '/sap/resources/i18n/texts.properties', "THEN the correct absolute URL is produced" );
	});

	QUnit.test("Get URL for a given Component", function( assert ) {
		var bLocationFound;
		var sUrl = uriGenerator.getBaseURLOfComponent('sap.apf.testhelper.comp.Component');
		if (sUrl.indexOf("/testhelper/comp") !== -1) {
			bLocationFound = true;
		}
		assert.equal(bLocationFound, true, "Component Path found in the URL.");
	});

	QUnit.test('Absolute Path for service root', function( assert ) {
		var sUri = uriGenerator.getAbsolutePath('/sap/hba/apps/wca/dso/s/odata/wca.xsodata/');
		assert.equal(sUri, '/sap/hba/apps/wca/dso/s/odata/wca.xsodata/', "Correct absolute path with slash at end.");
		sUri = uriGenerator.getAbsolutePath('/sap/hba/apps/wca/dso/s/odata/wca.xsodata');
		assert.equal(sUri, '/sap/hba/apps/wca/dso/s/odata/wca.xsodata/', "Correct absolute path last slash fixed.");

	});

	QUnit.test('OData path', function( assert ) {
		var sUri = uriGenerator.getODataPath('/sap/hba/apps/wca/dso/s/odata/wca.xsodata/');
		assert.equal(sUri.toLowerCase(), '/sap/hba/apps/wca/dso/s/odata/', "UriGenerator build odata address correctly");
	});

	QUnit.test('Get APF location origin', function( assert ) {
		var sUrl = uriGenerator.getApfLocation();
		var bLocationFound;
		if (sUrl.indexOf("/sap/apf/") !== -1) {
			bLocationFound = true;
		}
		assert.equal(bLocationFound, true, "Path /sap/apf/ found in the URL.");
	});

	QUnit.module('Build URI', {
		beforeEach : function(assert) {
			uriGenerator = uriGenerator;
			this.oMsgHandler = new DoubleMessageHandler().doubleCheckAndMessaging().spyPutMessage();
			this.metadata = {
					getParameterEntitySetKeyProperties : function(){
						return [];
					}
			};
		}
	});
	QUnit.test('Deep empty filter', function(assert) {
		var filterLevel1 = new Filter(this.oMsgHandler);
		filterLevel1.addAnd(new Filter(this.oMsgHandler));
		filterLevel1.addAnd(new Filter(this.oMsgHandler));
		var filter = new Filter(this.oMsgHandler);
		filter.addAnd(new Filter(this.oMsgHandler));
		filter.addAnd(filterLevel1);
		var uri = uriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], filter, {}, undefined, undefined, undefined,undefined,"Results",this.metadata);
		assert.strictEqual(uri, "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$format=json", "$filter is not present");
	});
	QUnit.test('Without parameter value', function( assert ) {
		var sExpected = "entityTypeWithParamsResults?$select=propertyOne,propertyTwo&$format=json";
		var sUri = uriGenerator.buildUri(this.oMsgHandler, "entityTypeWithParams", [ "propertyOne", "propertyTwo" ], {}, {}, undefined, undefined, undefined,undefined,"Results",this.metadata);
		assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
	});
	QUnit.test('Without parameter value and empty navigationProperty string', function( assert ) {
		var sExpected = "entityTypeWithParams?$select=propertyOne,propertyTwo&$format=json";
		var sUri = uriGenerator.buildUri(this.oMsgHandler, "entityTypeWithParams", [ "propertyOne", "propertyTwo" ], {}, {}, undefined, undefined, undefined,undefined,"",this.metadata);
		assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
	});
	QUnit.test('With one parameter value', function( assert ) {
		this.metadata = {
				getParameterEntitySetKeyProperties : function(){
					return [{
						"dataType" : {
							"type" : "Edm.Int32"
						},
						"name" : "p_param2",
						defaultValue : 20
					}];
				}
		};
		var sExpected = "entityTypeWithParams(p_param2=20)/Results?$select=propertyOne,propertyTwo&$format=json";
		var sUri = uriGenerator.buildUri(this.oMsgHandler, "entityTypeWithParams", [ "propertyOne", "propertyTwo" ], {}, {}, undefined, undefined, undefined,undefined,"Results",this.metadata);
		assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
	});

	QUnit.test('With three parameter values', function( assert ) {
		this.metadata = {
				getParameterEntitySetKeyProperties : function(){
					return [{
						"dataType" : {
							"type" : "Edm.Int32"
						},
						"name" : "p_param1",
						defaultValue : 10
					}, 
					{
						"dataType" : {
							"type" : "Edm.Int32"
						},
						"name" : "p_param2",
						defaultValue : 20
					}, 
					{
						"dataType" : {
							"type" : "Edm.Int32"
						},
						"name" : "p_param3",
						defaultValue : 30
					}];
				}
		};
		var sExpected = "entityTypeWithParams(p_param1=10,p_param2=20,p_param3=30)/Results?$select=propertyOne,propertyTwo&$format=json";
		var sUri = uriGenerator.buildUri(this.oMsgHandler, "entityTypeWithParams", [ "propertyOne", "propertyTwo" ], {}, {}, undefined, undefined, undefined,undefined,"Results",this.metadata);
		assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
	});

	QUnit.module('OData system query option', {
		beforeEach : function(assert) {
			uriGenerator = uriGenerator;

			this.oMsgHandler = new DoubleMessageHandler().doubleCheckAndMessaging().spyPutMessage();
			this.metadata = {
					getParameterEntitySetKeyProperties : function(){
						return [];
					}
			};

		},
		afterEach : function(assert) {

		}
	});
	QUnit.test('Option "top"', function( assert ) {
		var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$top=50&$format=json";
		var oPaging = {
				top : 50
		};
		var sUri = uriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, undefined, oPaging, undefined,undefined,"Results",this.metadata);
		assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
	});

	QUnit.test('Option "skip"', function( assert ) {
		var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$skip=100&$format=json";
		var oPaging = {
				skip : 100
		};
		var sUri = uriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, undefined, oPaging, undefined,undefined,"Results",this.metadata);
		assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
	});

	QUnit.test('Options "top" and "skip"', function( assert ) {
		var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$top=50&$skip=100&$format=json";
		var oPaging = {
				top : 50,
				skip : 100
		};
		var sUri = uriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, undefined, oPaging, undefined,undefined,"Results",this.metadata);
		assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
	});

	QUnit.test('Option "inlinecount"', function( assert ) {
		var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$inlinecount=allpages&$format=json";
		var oPaging = {
				inlineCount : true
		};
		var sUri = uriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, undefined, oPaging, undefined,undefined,"Results",this.metadata);
		assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
	});

	QUnit.test('Options "inlinecount", "skip" and "top"', function( assert ) {
		var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$top=50&$skip=100&$inlinecount=allpages&$format=json";
		var oPaging = {
				top : 50,
				skip : 100,
				inlineCount : true
		};
		var sUri = uriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, undefined, oPaging, undefined,undefined,"Results",this.metadata);
		assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
	});

	QUnit.test('Wrong paging option gives technical error', function( assert ) {
		var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$skip=100&$inlinecount=allpages&$format=json";
		var oPaging = {
				topp : 50,
				skip : 100,
				inlineCount : true
		};
		var sUri = uriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, undefined, oPaging, undefined,undefined,"Results",this.metadata);
		assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
		assert.equal(this.oMsgHandler.spyResults.putMessage.code, '5032', 'Correct message code expected');
	});
	QUnit.test('Paging options omitted if "paging" parameter is empty or undefined', function( assert ) {
		var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$format=json";
		var oPaging = {};
		var sUri = uriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, undefined, oPaging, undefined,undefined,"Results",this.metadata);
		assert.equal(sUri, sExpected, '$top and $skip and $inlinecount omitted if paging-parameter is empty object');
		oPaging = undefined;
		sUri = uriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, undefined, oPaging, undefined,undefined,"Results",this.metadata);
		assert.equal(sUri, sExpected, '$top and $skip and $inlinecount omitted if paging-parameter is "undefined"');
	});

	QUnit.test('Option "orderby" - single property as string', function( assert ) {
		var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$orderby=propertyTwo%20asc&$format=json";
		var sOrderby = 'propertyTwo';
		var sUri = uriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, sOrderby, undefined, undefined,undefined,"Results",this.metadata);
		assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
	});

	QUnit.test('Option "orderby" - single property as object', function( assert ) {
		var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$orderby=propertyTwo%20desc&$format=json";
		var oOrderby = {
				property : 'propertyTwo',
				ascending : false
		};
		var sUri = uriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, oOrderby, undefined, undefined,undefined,"Results",this.metadata);
		assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
	});

	QUnit.test('Option "orderby" - multiple properties as array of objects', function( assert ) {
		var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo,propertyThree,propertyFour&$orderby=propertyTwo%20asc,propertyFour%20desc,propertyThree%20asc&$format=json";
		var aOrderby = [ {
			property : 'propertyTwo'
		}, {
			property : 'propertyFour',
			ascending : false
		}, {
			property : 'propertyThree',
			ascending : true
		} ];
		var sUri = uriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo", "propertyThree", "propertyFour" ], {}, {}, aOrderby, undefined, undefined,undefined,"Results",this.metadata);
		assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
	});

	QUnit.test('Option "orderby" - properties not included in $orderby if not part of $select parameters', function( assert ) {
		var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$format=json";
		var orderby = 'propertyThree';
		var sUri = uriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, orderby, undefined, undefined,undefined,"Results",this.metadata);

		assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
		assert.equal(this.oMsgHandler.spyResults.putMessage.code, '5019', 'Correct message code expected');
	});

	QUnit.test('Option "orderby" - properties not included in $orderby if not part of $select parameters', function( assert ) {
		var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$format=json";
		var orderby = {
				property : 'propertyThree',
				ascending : false
		};

		var sUri = uriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, orderby, undefined, undefined,undefined,"Results",this.metadata);

		assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');
		assert.equal(this.oMsgHandler.spyResults.putMessage.code, '5019', 'Correct message code expected');
	});

	QUnit.test('Option "orderby" - properties not included in $orderby if not part of $select parameters', function( assert ) {
		var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$orderby=propertyOne%20desc&$format=json";
		var orderby = [ {
			property : 'propertyThree'
		}, {
			property : 'propertyOne',
			ascending : false
		}, {
			property : 'propertyFour',
			descending : false
		} ];

		var sUri = uriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, orderby, undefined, undefined,undefined,"Results",this.metadata);
		assert.equal(sUri, sExpected, 'Exact URI (case sensitive) expected');

		assert.equal(this.oMsgHandler.spyResults.putMessage[0].code, '5019', 'Correct message code expected');
		assert.equal(this.oMsgHandler.spyResults.putMessage[0].aParameters[0], 'entityTypeWithoutParams', 'Correct property as message parameter expected');
		assert.equal(this.oMsgHandler.spyResults.putMessage[0].aParameters[1], 'propertyThree', 'Correct property as message parameter expected');
		assert.equal(this.oMsgHandler.spyResults.putMessage[1].aParameters[1], 'propertyFour', 'Correct property as message parameter expected');
	});

	QUnit.test('"Orderby" option omitted if "sortingFields" parameter is empty or undefined', function( assert ) {
		var sExpected = "entityTypeWithoutParamsResults?$select=propertyOne,propertyTwo&$format=json";
		var oSortingFields = {};
		var sUri = uriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, oSortingFields, undefined, undefined,undefined,"Results",this.metadata);
		assert.equal(sUri, sExpected, '$orderby omitted if sortingFields-parameter is empty object');
		sUri = uriGenerator.buildUri(this.oMsgHandler, "entityTypeWithoutParams", [ "propertyOne", "propertyTwo" ], {}, {}, oSortingFields, undefined, undefined,undefined,"Results",this.metadata);
		assert.equal(sUri, sExpected, '$orderby omitted if sortingFields-parameter is "undefined"');
	});
	QUnit.module("generateOdataPath",{
		beforeEach: function(){
			this.messageHandler = new DoubleMessageHandler().doubleCheckAndMessaging().spyPutMessage();
			this.metadata = {
					getParameterEntitySetKeyProperties : function(entitySet){
						if(entitySet === "EntitySetDefaultValue"){
							return [{
								"dataType" : {
									"type" : "Edm.Int32"
								},
								"name" : "p_defaultValue",
								defaultValue : 20
							}];
						} else if(entitySet === "EntitySetOneParam"){
							return [{
								"dataType" : {
									"type" : "Edm.Int32"
								},
								"name" : "p_int32"
							}];
						} else if(entitySet === "EntitySetOneOptionalParam"){
								return [{
									"dataType" : {
										"type" : "Edm.Int32"
									},
									"name" : "p_int32",
									"parameter" : "optional"
								}];
						} else if (entitySet === "EntitySetTwoParams"){
							return [{
								"dataType" : {
									"type" : "Edm.Int32"
								},
								"name" : "p_int32"
							}, {
								"dataType" : {
									"type" : "Edm.String"
								},
								"name" : "p_stringParameter",
								defaultValue : "defaultString"
							}];
						}
					}
			};
		}
	});
	QUnit.test('Parameter values based on metadata default values', function(assert){
		var path = uriGenerator.generateOdataPath(this.messageHandler, this.metadata, "EntitySetDefaultValue", {}, "Results" );
		assert.strictEqual(path, "EntitySetDefaultValue(p_defaultValue=20)/Results", "Parameter retrieved from metadata");
	});
	QUnit.test('Parameter values based on metadata and actual filter values (flat filter)', function(assert) {
		var filter = new Filter(this.messageHandler, 'p_int32', "EQ", 4711);
		var path = uriGenerator.generateOdataPath(this.messageHandler, this.metadata, "EntitySetOneParam", filter, "Results" );
		assert.strictEqual(path, "EntitySetOneParam(p_int32=4711)/Results", "Parameter retrieved from filter");
	});
	QUnit.test('Parameter values based on metadata and actual filter values (two level filter)', function(assert) {
		var filter = new Filter(this.messageHandler, 'FilterPropertyOne', "EQ", '10');
		filter.addOr('p_int32', "EQ", 4711);
		filter.addOr('FilterPropertyTwo', "LT", '200');
		var nextLevelFilter = new Filter(this.messageHandler, 'FilterPropertyOne', "EQ", '20');
		nextLevelFilter.addOr('FilterPropertyThree', "GT", '120');
		nextLevelFilter.addOr('p_int32', "EQ", 4712);
		var combinedFilter = new Filter(this.messageHandler, filter);
		combinedFilter.addAnd(nextLevelFilter);
		var path = uriGenerator.generateOdataPath(this.messageHandler, this.metadata, "EntitySetTwoParams", combinedFilter, "Results");
		assert.strictEqual(path, "EntitySetTwoParams(p_int32=4712,p_stringParameter=%27defaultString%27)/Results", "Parameters retrieved from metadata and filter");
	});
	QUnit.test('Parameter values based on metadata and actual filter values (compound filter - three level filter)', function(assert) {
		var createCompound = function(sParameterValue){
			var oCompound = new Filter(this.messageHandler, 'FilterPropertyOne', "EQ", 'val1');
			oCompound.addAnd('p_int32', "EQ", sParameterValue);
			oCompound.addAnd('FilterPropertyThree', "EQ", 'val3');
			return oCompound;
		}.bind(this);
		var filter = new Filter(this.messageHandler, createCompound(4711));
		filter.addOr(createCompound(4712));
		var nextLevelFilter = new Filter(this.messageHandler, createCompound(4713));
		nextLevelFilter.addOr(createCompound(4714));
		var combinedFilter = new Filter(this.messageHandler, filter);
		combinedFilter.addAnd(nextLevelFilter);
		var path = uriGenerator.generateOdataPath(this.messageHandler, this.metadata, "EntitySetTwoParams", combinedFilter, "Results");
		assert.strictEqual(path, "EntitySetTwoParams(p_int32=4714,p_stringParameter=%27defaultString%27)/Results", "Parameters retrieved from metadata and filter");
	});
	QUnit.test('Filter values for parameters are missing', function(assert) {
		uriGenerator.generateOdataPath(this.messageHandler, this.metadata, "EntitySetOneParam", {}, "Results");
		assert.equal(this.messageHandler.spyResults.putMessage.code, "5016", "Message code 5016 as expected");
		assert.equal(this.messageHandler.spyResults.putMessage.aParameters[0], "p_int32", "Variable parameter for message as expected");
	});
	QUnit.test('Filter values for optional parameters are missing', function(assert) {
		uriGenerator.generateOdataPath(this.messageHandler, this.metadata, "EntitySetOneOptionalParam", {}, "Results");
		assert.deepEqual(this.messageHandler.spyResults, {}, "No Message expected");
	});
	QUnit.module("getSelectString");
	QUnit.test('Generate $Select string with array of properties', function(assert){
		var result = uriGenerator.getSelectString(["PropertyOne", "PropertyTwo"]);
		assert.strictEqual(result, "PropertyOne,PropertyTwo");
	});
	QUnit.test('Generate $Select string with proper encoding of properties', function(assert){
		var result = uriGenerator.getSelectString(["PröpertyOne", "PropertyTwo"]);
		assert.strictEqual(result, "Pr%c3%b6pertyOne,PropertyTwo");
	});
});