/*global  QUnit, sap, jQuery */
sap.ui.define("sap/apf/utils/tUtils", [
	"sap/apf/utils/utils",
	"sap/apf/testhelper/helper",
	"sap/apf/testhelper/doubles/messageHandler",
	"sap/apf/core/messageHandler",
	"sap/apf/utils/hashtable"
], function(utils, testhelper, DoubleMessageHandler, MessageHandler, Hashtable){
	'use strict';
	testhelper.injectURLParameters({
		"SAPClient" : "777",
		"Customer" : "10123"
	});
	QUnit.module('Miscellaneous helpers', {
		beforeEach : function(assert) {
			this.oMsgHandler = new DoubleMessageHandler().doubleCheckAndMessaging();
		}
	});
	QUnit.test("Elimination of duplicates in array", function(assert) {
		var aToCheck = [ 1, 2, 3, 3, 4, 5, "abc", "def", "abc" ];
		var aResult = utils.eliminateDuplicatesInArray(this.oMsgHandler, aToCheck);
		assert.deepEqual(aResult, [ 1, 2, 3, 4, 5, "def", "abc" ], "function eliminateDuplicatesInArray is working correctly");
	});
	QUnit.test("HashCode testing", function(assert) {
		assert.equal(utils.hashCode("klaus"), 9497488, "function hashCode returns a correct hash value");
		assert.equal(utils.hashCode('klaus'), 9497488, "function hashCode returns a correct hash value twice");
		assert.notEqual(utils.hashCode("klaus"), utils.hashCode('klaus1'), "function hashCode returns different hash values for different input values");
	});
	QUnit.test("URI parameter retrieval", function(assert) {
		var oUriParameters = utils.getUriParameters();
		assert.equal(oUriParameters.SAPClient, "777", "Parameter SAPClient was handed over in URI with value 777");
		assert.equal(oUriParameters.Customer, "10123", "Parameter Customer was handed over in URI with value 10123");
	});
	QUnit.test("OData string escaping", function(assert) {
		assert.equal(utils.escapeOdata('Tom\'s tom'), 'Tom\'\'s tom', 'Replacement of \' by \'\' expected');
	});
	QUnit.test("Formatting an EDM.String (ABAP Date String) to EDM.DateTime in URI", function(assert) {
		var sFormatedValue;
		sFormatedValue = utils.formatValue("20171231", { dataType : { type : "Edm.DateTime"}});
		assert.equal(sFormatedValue, "datetime'2017-12-31T00:00:00'", "DateTime format of URI");
		sFormatedValue = utils.formatValue("20170101", { dataType : { type : "Edm.DateTime"}});
		assert.equal(sFormatedValue, "datetime'2017-01-01T00:00:00'", "DateTime format of URI as expected");
		sFormatedValue = utils.formatValue("20170707", { dataType : { type : "Edm.DateTime"}});
		assert.equal(sFormatedValue, "datetime'2017-07-07T00:00:00'", "DateTime format of URI as expected");
	});
	QUnit.test("Formatting an EDM.DateTime (input) to EDM.DateTime in URI", function(assert) {
		var sFormatedValue;
		sFormatedValue = utils.formatValue("/Date(1402876800000)/", { dataType : { type : "Edm.DateTime"}});
		assert.equal(sFormatedValue, "datetime'2014-06-16T00:00:00'", "DateTime from json format formated according OData conventions");
		//date and time, as we get from datajs
		sFormatedValue = utils.formatValue(new Date(Date.UTC(2002, 9, 10)), { dataType : { type : "Edm.DateTime"}});
		assert.equal(sFormatedValue, "datetime'2002-10-10T00:00:00'", "DateTime with date object formated according OData conventions");
		//toString is the transformation in the representations
		sFormatedValue = utils.formatValue(new Date(Date.UTC(2002, 9, 10)).toString(), { dataType : { type : "Edm.DateTime"}});
		assert.equal(sFormatedValue, "datetime'2002-10-10T00:00:00'", "DateTime with date object formated according OData conventions");
		sFormatedValue = utils.formatValue(new Date(Date.UTC(1995, 11, 17, 3, 24)).toString(), { dataType : { type : "Edm.DateTime"}});
		assert.strictEqual(sFormatedValue, "datetime'1995-12-17T03:24:00'", "DateTime formated according OData conventions");
		sFormatedValue = utils.formatValue(new Date(Date.UTC(2002, 9, 10, 17)).toString(), { dataType : { type : "Edm.DateTimeOffset"}});
		assert.equal(sFormatedValue, "datetimeoffset'2002-10-10T17:00:00Z'", "DateTimeOffset formated according OData conventions");
	});
	QUnit.test("Formatting an EDM.String (input) to annotated string format in URI", function(assert) {
		assert.equal(utils.formatValue("20171206", { "sap-semantics": "yearmonthday", dataType : { type : "Edm.String"}}), "'20171206'", "String date to annotated string format according OData conventions");
		assert.equal(utils.formatValue(new Date(Date.UTC(2017, 11, 6)), { "sap-semantics": "yearmonthday", dataType : { type : "Edm.String"}}), "'20171206'", "JS Date to annotated string format according OData conventions");
	});
	QUnit.test("Odata formating values of different types", function(assert) {
		assert.equal(utils.formatValue(null, {}), "null", "Null returned as convention");
		assert.equal(utils.formatValue("today", { dataType : { type : "Edm.String"}}), "'today'", "String formated according OData conventions");
		assert.equal(utils.formatValue("Tom\'s tom", { dataType : { type : "Edm.String"}}), "'Tom\'\'s tom'", "Correct escaping of string Replacement of \' by \'\' expected");
		assert.equal(utils.formatValue("1963", { dataType : { type : "Edm.Int32"}}), "1963", "Int32 formated according OData conventions");
		assert.equal(utils.formatValue(1963, { dataType : { type : "Edm.Int64"}}), "1963L", "Int 64 formated according OData conventions");
		assert.equal(utils.formatValue('101', { dataType : { type : "Edm.Binary"}}), "binary'101'", "Binary formated according OData conventions");
		assert.equal(utils.formatValue(2.3, { dataType : { type : "Edm.Single"}}), "2.3f", "Single formated according OData conventions");
		assert.equal(utils.formatValue(2.345, { dataType : { type : "Edm.Decimal"}}), "2.345M", "Decimal formated according OData conventions");
		assert.equal(utils.formatValue('12345678-aaaa-bbbb-cccc-ddddeeeeffff', { dataType : { type : "Edm.Guid"}}), "guid'12345678-aaaa-bbbb-cccc-ddddeeeeffff'", "Guid formated according OData conventions");
		assert.equal(utils.formatValue("13:20:00", { dataType : { type : "Edm.Time"}}), "time'13:20:00'", "Time formated  from String according OData conventions");
		assert.equal(utils.formatValue(39600000, { dataType : { type : "Edm.Time"}}), "time'11:00:00'", "Time formated  from number according OData conventions");
		assert.equal(utils.formatValue(40149000, { dataType : { type : "Edm.Time"}}), "time'11:09:09'", "Time formated  from number according OData conventions with padding of leading zeroes");
	});
	QUnit.test("JSON format to Javascript", function(assert) {
		assert.equal(utils.json2javascriptFormat("/Date(1402876800000)/", "Edm.DateTime").valueOf(), new Date(1402876800000).valueOf(), "DateTime Format converted properly");
		assert.equal(utils.json2javascriptFormat("a String", "Edm.String"), "a String", "String Format converted properly");
		assert.equal(utils.json2javascriptFormat("true", "Edm.Boolean"), true, "Boolean Format converted properly");
		assert.equal(utils.json2javascriptFormat("32", "Edm.Int32"), 32, "Integer Format converted properly 1");
		assert.equal(utils.json2javascriptFormat(32, "Edm.Int32"), 32, "Integer Format converted properly 1");
		assert.equal(utils.json2javascriptFormat("32.32", "Edm.Float"), 32.32, "Float Format converted properly 2");
		assert.equal(utils.json2javascriptFormat(32.32, "Edm.Float"), 32.32, "Float Format converted properly 2");
	});
	QUnit.test("Is valid GUID", function(assert) {
		assert.ok(utils.isValidGuid("01234567890123456789012345678901"), "01234567890123456789012345678901 is a valid GUID");
		assert.ok(utils.isValidGuid("ABCDEF67890123456789012345678901"), "ABCDEF67890123456789012345678901 is a valid GUID");
		assert.ok(!utils.isValidGuid("0123456789012345678901234567890"), "0123456789012345678901234567890 is not a valid GUID");
		assert.ok(!utils.isValidGuid("012345678901234567890123456789012"), "012345678901234567890123456789012 is not a valid GUID");
	});
	QUnit.test("Is valid Psuedo GUID", function(assert) {
		assert.ok(utils.isValidPseudoGuid("01234567890123456789012345678901"), "01234567890123456789012345678901 is a valid GUID");
		assert.ok(utils.isValidPseudoGuid("ABCDEF67890123456789012345678901"), "ABCDEF67890123456789012345678901 is a valid GUID");
		assert.ok(!utils.isValidPseudoGuid("0123456789012345678901234567890"), "0123456789012345678901234567890 is no valid GUID");
		assert.ok(!utils.isValidPseudoGuid("012345678901234567890123456789012"), "012345678901234567890123456789012 is no valid GUID");
	});
	QUnit.test("create pseudo guid", function(assert) {
		assert.equal(utils.createPseudoGuid().length, 32, "Psuedo GUID is correct length");
		assert.notDeepEqual(utils.createPseudoGuid(), utils.createPseudoGuid(), "Psuedo GUID is unique");
		assert.ok(utils.isValidPseudoGuid(utils.createPseudoGuid()), "Psuedo GUID is valid");
	});
	QUnit.test('GIVEN an old configuration with categories attribute for steps', function(assert) {
		var inject = {
			constructors : {
				Hashtable : Hashtable
			},
			instances : {
				messageHandler : new MessageHandler()
			}
		};
		var oldConfig = {
			steps : [ {
				type : "step",
				id : "stepId-1",
				categories : [ {
					type : "category",
					id : "categoryId-1"
				}, {
					type : "category",
					id : "categoryId-2"
				} ]
			}, {
				type : "step",
				id : "stepId-2",
				categories : [ {
					type : "category",
					id : "categoryId-1"
				} ]
			}, {
				type : "step",
				id : "stepId-3",
				categories : [ {
					type : "category",
					id : "categoryId-2"
				} ]
			}, {
				type : "step",
				id : "stepId-4",
				categories : []
			} ],
			categories : [ {
				type : "category",
				id : "categoryId-1"
			}, {
				type : "category",
				id : "categoryId-2"
			} ]
		};
		var migratedConfig = {
			steps : [ {
				type : "step",
				id : "stepId-1"
			}, {
				type : "step",
				id : "stepId-2"
			}, {
				type : "step",
				id : "stepId-3"
			}, {
				type : "step",
				id : "stepId-4"
			} ],
			categories : [ {
				type : "category",
				id : "categoryId-1",
				steps : [ {
					type : "step",
					id : "stepId-1"
				}, {
					type : "step",
					id : "stepId-2"
				} ]
			}, {
				type : "category",
				id : "categoryId-2",
				steps : [ {
					type : "step",
					id : "stepId-1"
				}, {
					type : "step",
					id : "stepId-3"
				} ]
			} ]
		};
		utils.migrateConfigToCategoryStepAssignment(oldConfig, inject);
		assert.deepEqual(oldConfig, migratedConfig, "WHEN migrateConfigToCategoryStepAssignment the old configuration is migrated as expected");
	});
	QUnit.test('GIVEN an new (migrated) configuration with steps attribute for categories', function(assert) {
		var inject = {
			constructors : {
				Hashtable : Hashtable
			},
			instances : {
				messageHandler : new MessageHandler()
			}
		};
		var migratedConfig = {
			steps : [ {
				type : "step",
				id : "stepId-1"
			}, {
				type : "step",
				id : "stepId-2"
			}, {
				type : "step",
				id : "stepId-3"
			}, {
				type : "step",
				id : "stepId-4"
			} ],
			categories : [ {
				type : "category",
				id : "categoryId-1",
				steps : [ "stepId-1", "stepId-2" ]
			}, {
				type : "category",
				id : "categoryId-2",
				steps : [ "stepId-1", "stepId-3" ]
			} ]
		};
		var expected = jQuery.extend(true, {}, migratedConfig);
		utils.migrateConfigToCategoryStepAssignment(migratedConfig, inject);
		assert.deepEqual(migratedConfig, expected, "WHEN migrateConfigToCategoryStepAssignment nothing is changed in a new configuration");
	});
	QUnit.module('createPromise', function(assert){
		var promise = utils.createPromise("aValue");
		promise.done(function(value){
			assert.equal(value, "aValue", "THEN promise is resolved with expected value");
		});
	});
	QUnit.module('extractFunctionFromModulePathString - Dynamic instantiation', {
		beforeEach : function(assert) {
			window.dudespace = {};
			window.dudespace.moduleOne = {};
			window.dudespace.moduleOne.moduleTwo = {};
			this.Constructor = function() {
				return null;
			};
		}
	});
	QUnit.test('Constructor function declared in single level namespace', function(assert) {
		var oConstructor;
		window.dudespace.IAmInNamespace = this.Constructor;
		oConstructor = utils.extractFunctionFromModulePathString('dudespace.IAmInNamespace');
		assert.deepEqual(oConstructor, window.dudespace.IAmInNamespace, 'Receive constructor of function declared in singel level namespace');
	});
	QUnit.test('Constructor function declared in multi level namespace', function(assert) {
		var oConstructor;
		window.dudespace.moduleOne.moduleTwo.IAmDeepInNamespace = this.Constructor;
		oConstructor = utils.extractFunctionFromModulePathString('dudespace.moduleOne.moduleTwo.IAmDeepInNamespace');
		assert.deepEqual(oConstructor, window.dudespace.moduleOne.moduleTwo.IAmDeepInNamespace, 'Receive constructor of function declared in multi level namespace');
	});
	QUnit.test('Calling "extractFunctionFromModulePathString" with constructor function', function(assert) {
		var oInstance = utils.extractFunctionFromModulePathString(this.Constructor);
		assert.equal(jQuery.isFunction(oInstance), true, "instance");
	});
	QUnit.test('Terminate on undefined property in module path', function(assert) {
		var result = utils.extractFunctionFromModulePathString('dudespace.not.existing');
		assert.equal(result, undefined, "If module path is invalid, then abort without error");
	});
	QUnit.module('Manifest Component Name Retrieval', {});
	QUnit.test("WHEN manifest with app id is provided", function(assert){
		var manifest = {
				"sap.app" : {
					"id" : "sap.apf.base"
				}
		};
		var componentName = utils.getComponentNameFromManifest(manifest);
		assert.equal(componentName, "sap.apf.base.Component");
	});
	QUnit.test("WHEN manifest with sap.ui5/componentName is provided", function(assert){
		var manifest = {
				"sap.app" : {
					"id" : "sap.apf.base"
				},
				"sap.ui5" : {
					"componentName" : "sap.apf.comp.Component"
				}
		};
		var componentName = utils.getComponentNameFromManifest(manifest);
		assert.equal(componentName, "sap.apf.comp.Component");
	});
	QUnit.test("WHEN manifest with sap.ui5/componentName is provided without Component suffix", function(assert){
		var manifest = {
				"sap.app" : {
					"id" : "sap.apf.base"
				},
				"sap.ui5" : {
					"componentName" : "sap.apf.comp"
				}
		};
		var componentName = utils.getComponentNameFromManifest(manifest);
		assert.equal(componentName, "sap.apf.comp.Component");
	});
	QUnit.module("ValidateSelectedValues");
	QUnit.test("Selected values is not a list", function(assert){
		var selectedValues = null;
		var availableValues = ["a", "b"];
		var expected = {
				valid : [],
				invalid : []
		};
		assert.deepEqual(utils.validateSelectedValues(selectedValues, availableValues), expected, "Both lists in returned object are empty");
	});
	QUnit.test("Selected values is an empty list", function(assert){
		var selectedValues = [];
		var availableValues = ["a", "b"];
		var expected = {
				valid : [],
				invalid : []
		};
		assert.deepEqual(utils.validateSelectedValues(selectedValues, availableValues), expected, "Both lists in returned object are empty");
	});
	QUnit.test("Available values is not a list", function(assert){
		var selectedValues = ["a", "b"];
		var availableValues = null;
		var expected = {
				valid : [],
				invalid : ["a", "b"]
		};
		assert.deepEqual(utils.validateSelectedValues(selectedValues, availableValues), expected, "All selected values are invalid");
	});
	QUnit.test("Available values is an empty list", function(assert){
		var selectedValues = ["a", "b"];
		var availableValues = [];
		var expected = {
				valid : [],
				invalid : ["a", "b"]
		};
		assert.deepEqual(utils.validateSelectedValues(selectedValues, availableValues), expected, "All selected values are invalid");
	});
	QUnit.test("List of selected values is completely different from available values", function(assert){
		var selectedValues = ["a", "b", "c"];
		var availableValues = ["d", "e", "f"];
		var expected = {
			valid : [],
			invalid : ["a", "b", "c"]
		};
		assert.deepEqual(utils.validateSelectedValues(selectedValues, availableValues), expected, "All selected values are invalid");
	});
	QUnit.test("List of selected values is equal available values", function(assert){
		var selectedValues = ["a", "b", "c"];
		var availableValues = ["a", "b", "c"];
		var expected = {
				valid : ["a", "b", "c"],
				invalid : []
		};
		assert.deepEqual(utils.validateSelectedValues(selectedValues, availableValues), expected, "All selected values are valid");
	});
	QUnit.test("List of selected values is partially different from available values", function(assert){
		var selectedValues = ["a", "b", "c"];
		var availableValues = ["c", "d", "e"];
		var expected = {
				valid : ["c"],
				invalid : ["a", "b"]
		};
		assert.deepEqual(utils.validateSelectedValues(selectedValues, availableValues), expected, "Correct lists of valid and invalid returned");
	});

	QUnit.module('extract the pathname from url', {});

	QUnit.test("Remove protocol, server and port from an URL", function(assert){
		var url = '/fire/wire/index.html';
		assert.equal(utils.extractPathnameFromUrl(url), url, "THEN original url returned");
		assert.equal(utils.extractPathnameFromUrl('https://localhost' + url), url, "THEN original url returned");
		assert.equal(utils.extractPathnameFromUrl('http://localhost:9090' + url), url, "THEN original url returned");
		assert.equal(utils.extractPathnameFromUrl('//localhost' + url), url, "THEN original url returned");
	});

	QUnit.module('test extraction of error message from odata 2.0 / 4.0 error response', {});
	QUnit.test("WHEN odata 2.0 error response is a string", function(assert){
		var errorResponse = {
					  "error": {
					    "code": "501",
					    "message": {
					      "lang": "en",
					      "value": "Unsupported functionality"
					    }
					  }
		};
		var str = JSON.stringify(errorResponse);
		assert.equal(utils.extractOdataErrorResponse(str), "Unsupported functionality", "THEN message is extracted");
	});
	QUnit.test("WHEN odata 2.0 error response is a object", function(assert){
		var errorResponse = {
					  "error": {
					    "code": "501",
					    "message": {
					      "lang": "en",
					      "value": "Unsupported functionality"
					    }
					  }
		};
		assert.equal(utils.extractOdataErrorResponse(errorResponse), "Unsupported functionality", "THEN message is extracted");
	});
	QUnit.test("WHEN odata 2.0 has an inner error information", function(assert){
		var errorResponse = {
				"error": {
					"code": "501",
					"message": {
						"lang": "en",
						"value": "Not yet supported functionality"
					},
					"innererror": {
						"errordetails": [
						                 { "code": "301", "message": "$search query option not supported", "target": "$search", "severity": "error" },
						                 {  "code": "501", "message": "complex operations are currently not supported", "target": "$search", "severity": "error" }
						                 ]
					}
				}
		};
		assert.equal(utils.extractOdataErrorResponse(errorResponse), "Not yet supported functionality\n$search query option not supported\ncomplex operations are currently not supported\n", "THEN message and inner error details are extracted");
	});
	QUnit.test("WHEN odata 4.0 error response", function(assert){
		var errorResponse = {
				"error": {
					"code": "501",
					"message": "Unsupported functionality",
					"target": "query",
					"details": [{ "code": "301", "message": "$search query option not supported", "target": "$search", "@sap.severity": "error" }]
				}
		};
		assert.equal(utils.extractOdataErrorResponse(errorResponse), "Unsupported functionality\n$search query option not supported\n", "THEN the message and detail message are extracted");
	});
	QUnit.module("FiscalYearMonth Conversion to Date");
	QUnit.test("convert year month day string to date object", function(assert){
		var dateString = utils.convertFiscalYearMonthDayToDateString("20171231");
		assert.equal(dateString, "Sun, 31 Dec 2017 00:00:00 GMT", "THEN date is constructed as expected");
	});
	QUnit.test("convert year month day string to date object", function(assert){
		var date = utils.convertFiscalYearMonthDayToDate("20171231");
		assert.equal(date.toUTCString(), "Sun, 31 Dec 2017 00:00:00 GMT", "THEN date is constructed as expected");
	});
	QUnit.module("convertDateListToInternalFormat");
	QUnit.test("No conversion required AND date as Edm.String - yearmonthday", function(assert){
		var datesExternalFormat = ["20071231", "20071131"];
		var metainfoProperty = {
				getAttribute : function() {
					return "Edm.String";
				}
		};
		var convertedDates = utils.convertDateListToInternalFormat(datesExternalFormat, metainfoProperty);
		assert.deepEqual(convertedDates, ["20071231", "20071131"], "THEN nothing was converted" );
	});
	QUnit.test("dd.mm.yyyy format AND date as Edm.String - yearmonthday", function(assert){
		var datesExternalFormat = ["31.12.2007", "01.02.2012"];
		var metainfoProperty = {
				getAttribute : function() {
					return "Edm.String";
				}
		};
		var convertedDates = utils.convertDateListToInternalFormat(datesExternalFormat, metainfoProperty);
		assert.deepEqual(convertedDates, ["20071231", "20120201"], "THEN dates in correct internal format" );
	});
	QUnit.test("MM/dd/yyyy format AND date as Edm.String - yearmonthday", function(assert){
		var datesExternalFormat = ["12/31/2007", "02/01/2012"];
		var metainfoProperty = {
				getAttribute : function() {
					return "Edm.String";
				}
		};
		var convertedDates = utils.convertDateListToInternalFormat(datesExternalFormat, metainfoProperty);
		assert.deepEqual(convertedDates, ["20071231", "20120201"], "THEN dates in correct internal format" );
	});
	QUnit.test("dd.mm.yyyy format with omitted zero AND date as Edm.String - yearmonthday", function(assert){
		var datesExternalFormat = ["1.12.2007", "2.5.2012"];
		var metainfoProperty = {
				getAttribute : function() {
					return "Edm.String";
				}
		};
		var convertedDates = utils.convertDateListToInternalFormat(datesExternalFormat, metainfoProperty);
		assert.deepEqual(convertedDates, ["20071201", "20120502"], "THEN dates in correct internal format" );
	});
	QUnit.test("MM/dd/yyyy format with omitted zero AND date as Edm.String - yearmonthday", function(assert){
		var datesExternalFormat = ["12/1/2007", "5/2/2012"];
		var metainfoProperty = {
				getAttribute : function() {
					return "Edm.String";
				}
		};
		var convertedDates = utils.convertDateListToInternalFormat(datesExternalFormat, metainfoProperty);
		assert.deepEqual(convertedDates, ["20071201", "20120502"], "THEN dates in correct internal format" );
	});
	QUnit.test("dd.mm.yyyy format AND date as Edm.DateTime", function(assert){
		var datesExternalFormat = ["31.12.2007", "01.02.2012"];
		var metainfoProperty = {
				getAttribute : function() {
					return "Edm.DateTime";
				}
		};
		var convertedDates = utils.convertDateListToInternalFormat(datesExternalFormat, metainfoProperty);
		assert.deepEqual(convertedDates, [new Date(Date.UTC(2007,11,31)), new Date(Date.UTC(2012,1,1))], "THEN dates in correct internal format" );
	});
	QUnit.test("dd.mm.yyyy format with something in front", function(assert){
		var datesExternalFormat = ["231.12.2007","X31.12.2007"];
		var metainfoProperty = {
				getAttribute : function() {
					return "Edm.DateTime";
				}
		};
		var convertedDates = utils.convertDateListToInternalFormat(datesExternalFormat, metainfoProperty);
		assert.deepEqual(convertedDates, ["231.12.2007","X31.12.2007"], "THEN dates are not converted" );
	});
	QUnit.test("dd.mm.yyyy format with something at the end", function(assert){
		var datesExternalFormat = ["31.12.20074", "31.12.2007X"];
		var metainfoProperty = {
				getAttribute : function() {
					return "Edm.DateTime";
				}
		};
		var convertedDates = utils.convertDateListToInternalFormat(datesExternalFormat, metainfoProperty);
		assert.deepEqual(convertedDates, [new Date(Date.UTC(20074,11,31)), "31.12.2007X"], "THEN year with 5 digits is converted; Date with a letter at the end is not converted");
	});
	QUnit.test("MM/dd/yyyy format AND date as Edm.DateTime", function(assert){
		var datesExternalFormat = ["12/31/2007", "02/01/2012"];
		var metainfoProperty = {
				getAttribute : function() {
					return "Edm.DateTime";
				}
		};
		var convertedDates = utils.convertDateListToInternalFormat(datesExternalFormat, metainfoProperty);
		assert.deepEqual(convertedDates, [new Date(Date.UTC(2007,11,31)), new Date(Date.UTC(2012,1,1))], "THEN dates in correct internal format" );
	});
	QUnit.test("MM/dd/yyyy format with something in front", function(assert){
		var datesExternalFormat = ["212/31/2007","X12/31/2007"];
		var metainfoProperty = {
				getAttribute : function() {
					return "Edm.DateTime";
				}
		};
		var convertedDates = utils.convertDateListToInternalFormat(datesExternalFormat, metainfoProperty);
		assert.deepEqual(convertedDates, ["212/31/2007", "X12/31/2007"], "THEN dates are not converted" );
	});
	QUnit.test("MM/dd/yyyy format with something at the end", function(assert){
		var datesExternalFormat = ["12/31/20074", "12/31/2007X"];
		var metainfoProperty = {
				getAttribute : function() {
					return "Edm.DateTime";
				}
		};
		var convertedDates = utils.convertDateListToInternalFormat(datesExternalFormat, metainfoProperty);
		assert.deepEqual(convertedDates, [new Date(Date.UTC(20074,11,31)), "12/31/2007X"], "THEN year with 5 digits is converted; Date with a letter at the end is not converted");
	});
	QUnit.test("ISO format and Edm.DateTime", function(assert){
		var datesExternalFormat = ["2017-08-13T00:00:00.000Z", "2017-09-14T00:00:00.000Z"];
		var metainfoProperty = {
				getAttribute : function() {
					return "Edm.DateTime";
				}
		};
		var convertedDates = utils.convertDateListToInternalFormat(datesExternalFormat, metainfoProperty);
		assert.deepEqual(convertedDates, [new Date(Date.UTC(2017,7,13)), new Date(Date.UTC(2017,8,14))], "THEN dates in correct internal format");
	});
	QUnit.test("ISO format and Edm.String - yearMonthDay", function(assert){
		var datesExternalFormat = ["2017-08-13T00:00:00.000Z", "2017-09-14T00:00:00.000Z"];
		var metainfoProperty = {
				getAttribute : function() {
					return "Edm.String";
				}
		};
		var convertedDates = utils.convertDateListToInternalFormat(datesExternalFormat, metainfoProperty);
		assert.deepEqual(convertedDates, [ "20170813", "20170914"], "THEN dates in correct internal format");
	});
	QUnit.test("ISO format with something in front", function(assert){
		var datesExternalFormat = ["12017-08-13T00:00:00.000Z", "X2017-09-14T00:00:00.000Z"];
		var metainfoProperty = {
				getAttribute : function() {
					return "Edm.DateTime";
				}
		};
		var convertedDates = utils.convertDateListToInternalFormat(datesExternalFormat, metainfoProperty);
		assert.deepEqual(convertedDates, ["12017-08-13T00:00:00.000Z", "X2017-09-14T00:00:00.000Z"], "THEN dates are not converted" );
	});
	QUnit.module("convertToExternalFormat", {
		beforeEach : function() {
			sap.ui.getCore().getConfiguration().applySettings({
				language: 'de',
				calendarType: sap.ui.core.CalendarType.Gregorian
			});
			sap.ui.getCore().getConfiguration().getFormatSettings().setDatePattern("short", "dd.MM.YYYY");
		}
	});
	QUnit.test("WHEN Edm.DateTime and sap:display-format == Date", function(assert){
		var propertyMetadata = {
				getAttribute: function(attribute) {
					if (attribute === "type"){
						return "Edm.DateTime";
					} else if (attribute === "sap:display-format") {
						return "Date";
					}
				}
		};
		var value = new Date(Date.UTC(2017,11, 30));
		var convertedValue = utils.convertToExternalFormat(value, propertyMetadata);
		assert.strictEqual(convertedValue, "30.12.2017", "THEN date conversion ok");
	});
	QUnit.test("WHEN Edm.DateTime and sap:display-format == Date and internalValue is 8 digit string", function(assert){
		var propertyMetadata = {
				getAttribute: function(attribute) {
					if (attribute === "type"){
						return "Edm.DateTime";
					} else if (attribute === "sap:display-format") {
						return "Date";
					}
				}
		};
		var value = "20171230";
		var convertedValue = utils.convertToExternalFormat(value, propertyMetadata);
		assert.strictEqual(convertedValue, "30.12.2017", "THEN date conversion ok");
	});
	QUnit.test("WHEN Edm.DateTime and sap:display-format == Date and internalValue is date as string", function(assert){
		var propertyMetadata = {
				getAttribute: function(attribute) {
					if (attribute === "type"){
						return "Edm.DateTime";
					} else if (attribute === "sap:display-format") {
						return "Date";
					}
				}
		};
		//current suresh approach to stringify dates
		var value = new Date(Date.UTC(2017,10,30)).toString();
		var convertedValue = utils.convertToExternalFormat(value, propertyMetadata);
		assert.strictEqual(convertedValue, "30.11.2017", "THEN date conversion ok");
	});
	QUnit.test("WHEN Edm.DateTime and sap:display-format == Date and internalValue is date as MISFORMED string", function(assert){
		var propertyMetadata = {
				getAttribute: function(attribute) {
					if (attribute === "type"){
						return "Edm.DateTime";
					} else if (attribute === "sap:display-format") {
						return "Date";
					}
				}
		};
		var value = "null";
		var convertedValue = utils.convertToExternalFormat(value, propertyMetadata);
		assert.strictEqual(convertedValue, "null", "THEN faulty value is returned AS expected");
	});
	QUnit.test("WHEN Edm.DateTime and NO sap:display-format", function(assert){
		var propertyMetadata = {
				getAttribute: function(attribute) {
					if (attribute === "type"){
						return "Edm.DateTime";
					} else if (attribute === "sap:display-format") {
						return undefined;
					}
				}
		};
		var value = new Date(Date.UTC(2017,11, 30));
		var convertedValue = utils.convertToExternalFormat(value, propertyMetadata);
		assert.strictEqual(convertedValue,  new Date(Date.UTC(2017,11, 30)).toString(), "THEN no date conversion");
	});
	QUnit.test("WHEN Edm.String", function(assert){
		var propertyMetadata = {
				getAttribute: function(attribute) {
					if (attribute === "type"){
						return "Edm.String";
					} else if (attribute === "sap:semantics") {
						return "important";
					}
					
				}
		};
		var value = "20171230";
		var expectedValue = "20171230";
		var convertedValue = utils.convertToExternalFormat(value, propertyMetadata);
		assert.strictEqual(convertedValue, expectedValue, "THEN no conversion happened");
	});
	QUnit.test("WHEN Edm.String AND yearmonthday semantics", function(assert){
		var propertyMetadata = {
				getAttribute: function(attribute) {
					if (attribute === "type"){
						return "Edm.String";
					} else if (attribute === "sap:semantics") {
						return "yearmonthday";
					}
				}
		};
		var convertedValue = utils.convertToExternalFormat("20171230", propertyMetadata);
		assert.strictEqual(convertedValue, "30.12.2017", "THEN conversion happened");
	});
	QUnit.test("WHEN Edm.String AND yearmonthday semantics AND internal value as date string", function(assert){
		var propertyMetadata = {
				getAttribute: function(attribute) {
					if (attribute === "type"){
						return "Edm.String";
					} else if (attribute === "sap:semantics") {
						return "yearmonthday";
					}
				}
		};
		var convertedValue = utils.convertToExternalFormat(new Date(Date.UTC(2017,11,30)).toString(), propertyMetadata);
		assert.strictEqual(convertedValue, "30.12.2017", "THEN conversion happened");
	});
	QUnit.test("WHEN Edm.String AND yearmonthday semantics AND invalid value", function(assert){
		var propertyMetadata = {
				getAttribute: function(attribute) {
					if (attribute === "type"){
						return "Edm.String";
					} else if (attribute === "sap:semantics") {
						return "yearmonthday";
					}
				}
		};
		var convertedValue = utils.convertToExternalFormat("null", propertyMetadata);
		assert.strictEqual(convertedValue, "null", "THEN original value is returned");
	});
	QUnit.test("WHEN Edm Type where no conversion is defined", function(assert){
		var propertyMetadata = {
				getAttribute: function(attribute) {
					if (attribute === "type"){
						return "Edm.Anything";
					}
				}
		};
		var convertedValue = utils.convertToExternalFormat("20171230", propertyMetadata);
		assert.strictEqual(convertedValue, "20171230", "THEN no conversion happened");
	});
	QUnit.module("utils.sortByProperty");
	QUnit.test("When empty array", function(assert){
		var propertyMetadata = {};
		var unsortedValues = [];
		var sortedValues = [];
		var result = utils.sortByProperty( unsortedValues, "text", propertyMetadata);
		assert.deepEqual(result, sortedValues, "THEN sorting on strings as Expected");
	});
	QUnit.test("When property type is string", function(assert){
		var propertyMetadata = {
				type : "Edm.String"
		};
		var unsortedValues = [ { text : "c"}, { text : "b"}, { text: "a"}];
		var sortedValues = [ { text : "a"}, { text : "b"}, { text: "c"}];
		var result = utils.sortByProperty( unsortedValues, "text", propertyMetadata );
		assert.deepEqual(result, sortedValues, "THEN sorting on strings as Expected");
	});
	QUnit.test("When property type is string and metadata is undefined", function(assert){
		var unsortedValues = [ { text : "c"}, { text : "b"}, { text: "a"}];
		var sortedValues = [ { text : "a"}, { text : "b"}, { text: "c"}];
		var result = utils.sortByProperty( unsortedValues, "text" );
		assert.deepEqual(result, sortedValues, "THEN sorting on strings as Expected");
	});
	QUnit.test("When property type is number", function(assert){
		var propertyMetadata = {
				type : "Edm.Decimal"
		};
		var unsortedValues = [ { text : 3}, { text : 2}, { text: 1}];
		var sortedValues = [ { text : 1}, { text : 2}, { text: 3}];
		var result = utils.sortByProperty( unsortedValues, "text", propertyMetadata );
		assert.deepEqual(result, sortedValues, "THEN sorting on numbers as Expected");
	});
	QUnit.test("When property type is DateTime and Date objects are to be sorted", function(assert){
		var propertyMetadata = {
				type : "Edm.DateTime"
		};
		var unsortedValues = [ { date : new Date(2012, 11,30)}, { date : new Date(2012, 11,29)}, { date: new Date(2012, 11,28)}];
		var sortedValues = [ { date : new Date(2012, 11,28)}, { date : new Date(2012, 11,29)}, { date: new Date(2012, 11, 30)}];
		var result = utils.sortByProperty( unsortedValues, "date", propertyMetadata);
		assert.deepEqual(result, sortedValues, "THEN sorting on date objects as Expected" );
	});
	QUnit.test("When property type is DateTime and strings are to be sorted", function(assert){
		var propertyMetadata = {
				type : "Edm.DateTime"
		};
		var unsortedValues = [ { date : new Date(2012, 11,30).toString()}, { date : new Date(2012, 11,29).toString()}, { date: new Date(2012, 11,28).toString()}];
		var sortedValues = [ { date : new Date(2012, 11,28).toString()}, { date : new Date(2012, 11,29).toString()}, { date: new Date(2012, 11, 30).toString()}];
		var result = utils.sortByProperty( unsortedValues, "date", propertyMetadata);
		assert.deepEqual(result, sortedValues, "THEN sorting on date objects as Expected" );
	});
	QUnit.test("When property type is Edm.String and Date values are to be sorted", function(assert){
		var propertyMetadata = {
				type : "Edm.String",
				"sap:semantics" : "yearmonthday"
		};
		var unsortedValues = [ { date : new Date(2012, 11,30).toString()}, { date : new Date(2012, 11,29).toString()}, { date: new Date(2012, 11,28).toString()}];
		var sortedValues = [ { date : new Date(2012, 11,28).toString()}, { date : new Date(2012, 11,29).toString()}, { date: new Date(2012, 11, 30).toString()}];
		var result = utils.sortByProperty( unsortedValues, "date", propertyMetadata);
		assert.deepEqual(result, sortedValues, "THEN sorting on date objects as Expected" );
	});
	QUnit.test("When property type is Edm.String and string values are to be sorted", function(assert){
		var propertyMetadata = {
				type : "Edm.String",
				"sap:semantics" : "yearmonthday"
		};
		var unsortedValues = [ { date : "20171231"}, { date : "20171212"}, { date: "20171215"}];
		var sortedValues = [ { date : "20171212"}, { date : "20171215"}, { date: "20171231"}];
		var result = utils.sortByProperty( unsortedValues, "date", propertyMetadata);
		assert.deepEqual(result, sortedValues, "THEN sorting on date objects as Expected" );
	});
	QUnit.test("When property type is Edm.Anything and string values are to be sorted", function(assert){
		var propertyMetadata = {
				type : "Edm.Anything"
		};
		var unsortedValues = [ { key : "20171231"}, { key : "20171212"}, { key: "20171215"}];
		var sortedValues = [ { key : "20171212"}, { key : "20171215"}, { key: "20171231"}];
		var result = utils.sortByProperty( unsortedValues, "key", propertyMetadata);
		assert.deepEqual(result, sortedValues, "THEN sorting on date objects as Expected" );
	});
	QUnit.module("isPropertyTypeWithDateSemantics");
	QUnit.test("WHEN edm.datetime type and annotation date", function(assert){
		var propertyMetadata = {
				type : "Edm.DateTime",
				"sap:display-format" : "Date"
		};
		assert.strictEqual(utils.isPropertyTypeWithDateSemantics(propertyMetadata), true, "THEN property type has date semantics");
	});
	QUnit.test("WHEN edm.datetime type and missing annotation date", function(assert){
		var propertyMetadata = {
				type : "Edm.DateTime"
		};
		assert.strictEqual(utils.isPropertyTypeWithDateSemantics(propertyMetadata), false, "THEN property type has no date semantics");
	});
	QUnit.test("WHEN edm.string type and annotation yearmonthday", function(assert){
		var propertyMetadata = {
				type : "Edm.String",
				"sap:semantics" : "yearmonthday"
		};
		assert.strictEqual(utils.isPropertyTypeWithDateSemantics(propertyMetadata), true, "THEN property type has date semantics");
	});
	QUnit.test("WHEN edm.string type and no annotation yearmonthday", function(assert){
		var propertyMetadata = {
				type : "Edm.String",
				"sap:semantics" : "special"
		};
		assert.strictEqual(utils.isPropertyTypeWithDateSemantics(propertyMetadata), false, "THEN property type has no date semantics");
	});
	QUnit.test("WHEN edm.string type and no annotation yearmonthday", function(assert){
		var propertyMetadata = {
				type : "Edm.String"
		};
		assert.strictEqual(utils.isPropertyTypeWithDateSemantics(propertyMetadata), false, "THEN property type has no date semantics");
	});
	QUnit.test("WHEN edm.string type and no annotation yearmonthday", function(assert){
		var propertyMetadata = {
				type : "Edm.Int32"
		};
		assert.strictEqual(utils.isPropertyTypeWithDateSemantics(propertyMetadata), false, "THEN property type has no date semantics");
	});
});
