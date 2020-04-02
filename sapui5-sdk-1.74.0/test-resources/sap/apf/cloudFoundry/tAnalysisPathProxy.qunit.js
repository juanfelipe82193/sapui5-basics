sap.ui.define(
	[	"sap/apf/cloudFoundry/analysisPathProxy",
			"sap/apf/utils/utils",
			"sap/apf/core/messageObject",
			"sap/ui/thirdparty/sinon",
			"sap/ui/thirdparty/sinon-qunit"
	],
	function(AnalysisPathProxy, utils, MessageObject, sinon) {
		'use strict';

	var jqXHR404 = { status : 404, statusText : "Not found"};
	var serviceRoot = "/sap/apf/runtime/v1/AnalysisPaths";
	var getManifests = function() {
		var manifest = {
				"sap.app" : {
					dataSources : {
						"apf.runtime.analysisPaths" : {
							uri: serviceRoot
						}
					}
				}
		};
		return { manifest : manifest };
	};
	var MessageHandlerStub = function() {
		this.check = function(condition) {
			if (!condition) {
				throw "bad";
			}
		};
		this.createMessageObject = function(config) {
			return new sap.apf.core.MessageObject(config);
		};
		this.putMessage = function(messageObject) {
			throw messageObject.getCode() + "_" +  messageObject.getParameters().toString();
		};
	};
	var getAnalysisPathList = function() {
		return [{
			analysisPath : "x1",
			analysisPathName : "Name1",
			lastChangeUtcDateTime : "yesterday",
			structuredAnalysisPath : JSON.stringify({"dummyPath" : "path"})
		},{
			analysisPath : "x2",
			analysisPathName : "Name2",
			lastChangeUtcDateTime : "longAgo",
			structuredAnalysisPath : JSON.stringify({"dummyPath" : "path2"})
		}];
	};
	function commonSetup(context) {
		var coreApi = {};
		coreApi.getStartParameterFacade = function() {
			return {
				getAnalyticalConfigurationId : function() {
					if (context.analyticalConfigurationId) {
						return {
							configurationId : context.analyticalConfigurationId
						};
					}
					return undefined;
				}
			};
		};
		context.resolveUriStub = sinon.stub();
		context.resolveUriStub.returnsArg(0);
		coreApi.getComponent = function() {
			return {
				getManifestObject: function() {
					return {
						resolveUri: context.resolveUriStub
					}
				}
			}
		};
		var ajaxHandler = {
				send: function(option, settings ) {
					context.ajaxStub(option, settings);
				}
			};
		var inject = {
				instances : { messageHandler : new MessageHandlerStub(), coreApi : coreApi, ajaxHandler : ajaxHandler },
				manifests : getManifests()
		};
		context.proxy = new sap.apf.cloudFoundry.AnalysisPathProxy(inject);
	}
	var serializableApfState = {
			startFilterHandler : {
				sfh : 'sfh'
			},
			filterIdHandler : {
				fih : 'fih'
			},
			smartFilterBar : {
				sfb : 'sfb'
			},
			path : {
				indicesOfActiveSteps : [ 0 ],
				steps : [ {
					stepId : 'one',
					binding : {
						selectedRepresentationId : 'reprOne'
					}
				}, {
					stepId : 'two',
					binding : {
						selectedRepresentationId : 'reprTwo'
					}
				} ]
			}
		};
	QUnit.module("CREATE an analysis path", {
		beforeEach: function() {
			commonSetup(this);
			this.expectedStructuredAnalysisPath = {
					steps : [ {
						stepId : "one",
						selectedRepresentationId : "reprOne"
					}, {
						stepId : "two",
						selectedRepresentationId : "reprTwo"
					} ],
					indexOfActiveStep : 0
				};
		}
	});
	QUnit.test("WHEN CREATE operation AND success", function(assert){
		assert.expect(10);
		this.analyticalConfigurationId = sap.apf.utils.createPseudoGuid(32);
		this.ajaxStub = function(settings, options) {
			if (settings.url === "/sap/apf/runtime/v1/AnalysisPaths") {
				settings.data = JSON.parse(settings.data);
				assert.strictEqual(this.resolveUriStub.callCount, 1, "THEN the URI was resolved");
				assert.strictEqual(settings.method, "POST", "THEN POST is used");
				assert.strictEqual(settings.data.analysisPathName, "nameOfPath", "THEN path name as expected");
				assert.strictEqual(settings.dataType, "json", "THEN data type is set");
				assert.strictEqual(settings.headers["Content-Type"], "application/json; charset=utf-8", "THEN content type in header is set");
				assert.deepEqual(settings.data.structuredAnalysisPath, JSON.stringify(this.expectedStructuredAnalysisPath), "THEN structured analysisPath as expected");
				assert.deepEqual(settings.data.serializedAnalysisPath, JSON.stringify(serializableApfState), "THEN serialized analysisPath as expected");
				assert.strictEqual(settings.data.analyticalConfiguration, this.analyticalConfigurationId, "THEN configuration id from start parameter facade as expected");
				settings.success({ "analysisPath" : "guidForAnalysisPath"});
			}
		}.bind(this);

		function assertSuccess(result, metadata, messageObject) {
			var expectedResult = {
					AnalysisPath : "guidForAnalysisPath",
					status: "successful"
			};
			assert.strictEqual(messageObject, undefined, "THEN no error occurred");
			assert.deepEqual(result, expectedResult, "THEN result as expected");
		}

		this.proxy.createPath("nameOfPath", assertSuccess, serializableApfState);
	});
	QUnit.test("WHEN CREATE operation AND analytical configuration id is NOT contained in URL", function(assert){
		assert.expect(3);
		this.analyticalConfigurationId = undefined;

		function assertError5075(result, metadata, messageObject) {
			assert.deepEqual(result, {status : "failed"}, "THEN only the status is returned");
			assert.strictEqual(messageObject.getCode(), 5075, "THEN correct error number for error message");
			assert.deepEqual(messageObject.getParameters(), [], "THEN no parameters");
		}
		this.proxy.createPath("nameOfPath", assertError5075, serializableApfState);
	});
	QUnit.test("WHEN CREATE operation AND error", function(assert){
		assert.expect(3);
		this.analyticalConfigurationId = sap.apf.utils.createPseudoGuid(32);
		this.ajaxStub = function(settings, options) {
			if (settings.url === "/sap/apf/runtime/v1/AnalysisPaths") {
				settings.error(jqXHR404);
			}
		};

		function assertError5214(result, metadata, messageObject) {
			assert.deepEqual(result, {status : "failed"}, "THEN only the status is returned");
			assert.strictEqual(messageObject.getCode(), "5214", "THEN correct error number for technical message");
			assert.deepEqual(messageObject.getParameters(), [404, "Not found"], "THEN http status and server error as expected");
		}
		this.proxy.createPath("nameOfPath", assertError5214, serializableApfState);
	});
	QUnit.module("UPDATE an analysis path", {
		beforeEach: function() {
			commonSetup(this);
			this.expectedStructuredAnalysisPath = {
					steps : [ {
						stepId : "one",
						selectedRepresentationId : "reprOne"
					}, {
						stepId : "two",
						selectedRepresentationId : "reprTwo"
					} ],
					indexOfActiveStep : 0
				};
		}
	});
	QUnit.test("WHEN UPDATE operation AND success", function(assert){
		assert.expect(9);

		this.ajaxStub = function(settings, options) {
			if (settings.url === "/sap/apf/runtime/v1/AnalysisPaths/GuidForAnalysisPath3333") {
				settings.data = JSON.parse(settings.data);
				assert.strictEqual(this.resolveUriStub.callCount, 1, "THEN the URI was resolved");
				assert.strictEqual(settings.method, "PUT", "THEN PUT is used");
				assert.strictEqual(settings.data.analysisPathName, "nameOfPath", "THEN path name as expected");
				assert.strictEqual(settings.dataType, "json", "THEN data type is set");
				assert.strictEqual(settings.headers["Content-Type"], "application/json; charset=utf-8", "THEN content type in header is set");
				assert.deepEqual(settings.data.structuredAnalysisPath, JSON.stringify(this.expectedStructuredAnalysisPath), "THEN structured analysisPath as expected");
				assert.deepEqual(settings.data.serializedAnalysisPath, JSON.stringify(serializableApfState), "THEN serialized analysisPath as expected");
				settings.success({ "analysisPath" : "GuidForAnalysisPath3333"});
			}
		}.bind(this);

		function assertSuccess(result, metadata, messageObject) {
			var expectedResult = {
					AnalysisPath : "GuidForAnalysisPath3333",
					status: "successful"
			};
			assert.strictEqual(messageObject, undefined, "THEN no error occurred");
			assert.deepEqual(result, expectedResult, "THEN result as expected");
		}

		this.proxy.modifyPath("GuidForAnalysisPath3333", "nameOfPath", assertSuccess, serializableApfState);
	});
	QUnit.test("WHEN UPDATE operation AND error", function(assert){
		assert.expect(3);

		this.ajaxStub = function(settings, options) {
			if (settings.url === "/sap/apf/runtime/v1/AnalysisPaths/GuidForAnalysisPath3333") {
				settings.error(jqXHR404);
			}
		};

		function assertError5214(result, metadata, messageObject) {
			assert.strictEqual(messageObject.getCode(), "5214", "THEN message code as expected");
			assert.deepEqual(messageObject.getParameters(), [ 404, "Not found" ], "THEN parameters as expected");
			assert.deepEqual(result, { status: "failed"}, "THEN result as expected");
		}

		this.proxy.modifyPath("GuidForAnalysisPath3333", "nameOfPath", assertError5214, serializableApfState);
	});

	QUnit.module("DELETE an analysis path", {
		beforeEach: function() {
			commonSetup(this);
		}
	});
	QUnit.test("WHEN DELETE operation AND success", function(assert){
		assert.expect(4);

		this.ajaxStub = function(settings, options) {
			if (settings.url === "/sap/apf/runtime/v1/AnalysisPaths/GuidForAnalysisPath3333") {
				assert.strictEqual(this.resolveUriStub.callCount, 1, "THEN the URI was resolved");
				assert.strictEqual(settings.method, "DELETE", "THEN DELETE is used");
				settings.success({});
			}
		}.bind(this);

		function assertSuccess(result, metadata, messageObject) {
			var expectedResult = {
					status: "successful"
			};
			assert.strictEqual(messageObject, undefined, "THEN no error occurred");
			assert.deepEqual(result, expectedResult, "THEN result as expected");
		}

		this.proxy.deletePath("GuidForAnalysisPath3333", assertSuccess);
	});
	QUnit.test("WHEN DELETE operation AND error", function(assert){
		assert.expect(3);

		this.ajaxStub = function(settings, options) {
			if (settings.url === "/sap/apf/runtime/v1/AnalysisPaths/GuidForAnalysisPath3333") {
				settings.error(jqXHR404);
			}
		};

		function assertError5214(result, metadata, messageObject) {//TODO spy on build error message
			var expectedResult = {
					status: "failed"
			};
			assert.strictEqual(messageObject.getCode(), "5214", "THEN message code as expected");
			assert.deepEqual(messageObject.getParameters(), [ 404, "Not found" ], "THEN parameters as expected");
			assert.deepEqual(result, expectedResult, "THEN result as expected");
		}

		this.proxy.deletePath("GuidForAnalysisPath3333", assertError5214);
	});
	QUnit.module("READ saved analysis path", {
		beforeEach: function() {
			commonSetup(this);
		}
	});
	QUnit.test("WHEN openPath AND success", function(assert){
		assert.expect(6);
		this.analyticalConfigurationId = sap.apf.utils.createPseudoGuid(32);
		this.ajaxStub = function(settings, options) {
			if (settings.url === "/sap/apf/runtime/v1/AnalysisPaths/analysisPathId1234?$select=AnalysisPathName,SerializedAnalysisPath") {
				assert.strictEqual(this.resolveUriStub.callCount, 1, "THEN the URI was resolved");
				assert.strictEqual(settings.method, "GET", "THEN GET is used");
				assert.strictEqual(settings.dataType, "json", "THEN data type is set");
				assert.strictEqual(settings.headers["Content-Type"], "application/json; charset=utf-8", "THEN content type in header is set");
				settings.success( {analysisPath : { "analysisPathName" : "nameForAnalysisPath", serializedAnalysisPath : JSON.stringify(serializableApfState) }});
			}
		}.bind(this);

		function assertSuccess(result, metadata, messageObject) {
			var expectedResult = {
					path : {
						AnalysisPathName : "nameForAnalysisPath",
						SerializedAnalysisPath : serializableApfState
					},
					status: "successful"
			};
			assert.strictEqual(messageObject, undefined, "THEN no error occurred");
			assert.deepEqual(result, expectedResult, "THEN result as expected");
		}

		this.proxy.openPath("analysisPathId1234", assertSuccess);
	});

	QUnit.test("WHEN openPath AND error", function(assert){
		this.analyticalConfigurationId = sap.apf.utils.createPseudoGuid(32);
		this.ajaxStub = function(settings, options) {
			if (settings.url === "/sap/apf/runtime/v1/AnalysisPaths/analysisPathId1234?$select=AnalysisPathName,SerializedAnalysisPath") {
				assert.strictEqual(settings.method, "GET", "THEN GET is used");
				assert.throws(
						function() {
							settings.error(jqXHR404);
						});
			}
		};

		function assertNeverCalled() {
			assert.notOk(true, "should not be called");
		}

		this.proxy.openPath("analysisPathId1234", assertNeverCalled);
	});
	QUnit.module("Reading list of saved analysis pathes", {
		beforeEach: function() {
			commonSetup(this);
		}
	});
	QUnit.test("WHEN readPaths is called AND success", function(assert){
		assert.expect(5);
		this.analyticalConfigurationId = sap.apf.utils.createPseudoGuid(32);
		this.ajaxStub = function(settings, options) {
			if (settings.url === "/sap/apf/runtime/v1/AnalysisPaths?$select=AnalysisPath,AnalysisPathName,LastChangeUtcDateTime,StructuredAnalysisPath&$filter=(AnalyticalConfiguration%20eq%20'" +
					this.analyticalConfigurationId + "')") {
				assert.strictEqual(this.resolveUriStub.callCount, 1, "THEN the URI was resolved");
				assert.strictEqual(settings.dataType, "json", "THEN data type is set");
				assert.strictEqual(settings.headers["Content-Type"], "application/json; charset=utf-8", "THEN content type in header is set");
				settings.success({ "analysisPaths" : getAnalysisPathList()});
			}
		}.bind(this);
		function assertSuccess(result, metadata, messageObject) {
			var expectedResult = {
					paths : [{
						AnalysisPath : "x1",
						AnalysisPathName : "Name1",
						LastChangeUTCDateTime : "yesterday",
						StructuredAnalysisPath : {"dummyPath" : "path"}
					},{
						AnalysisPath : "x2",
						AnalysisPathName : "Name2",
						LastChangeUTCDateTime : "longAgo",
						StructuredAnalysisPath : {"dummyPath" : "path2"}
					}],
					status : "successful"
			};
			assert.deepEqual(result, expectedResult, "THEN paths with expected structure");
			assert.strictEqual(messageObject, undefined, "THEN no error");
		}
		this.proxy.readPaths(assertSuccess);
	});
	QUnit.test("WHEN readPaths is called AND success AND path list is NULL", function(assert){
		assert.expect(4);
		this.analyticalConfigurationId = sap.apf.utils.createPseudoGuid(32);
		this.ajaxStub = function(settings, options) {
			if (settings.url === "/sap/apf/runtime/v1/AnalysisPaths?$select=AnalysisPath,AnalysisPathName,LastChangeUtcDateTime,StructuredAnalysisPath&$filter=(AnalyticalConfiguration%20eq%20'" +
					this.analyticalConfigurationId + "')") {
				assert.strictEqual(settings.dataType, "json", "THEN data type is set");
				assert.strictEqual(settings.headers["Content-Type"], "application/json; charset=utf-8", "THEN content type in header is set");
				settings.success({ "analysisPaths" : null});
			}
		}.bind(this);
		function assertSuccess(result, metadata, messageObject) {
			var expectedResult = {
					paths : [],
					status : "successful"
			};
			assert.deepEqual(result, expectedResult, "THEN paths with expected structure");
			assert.strictEqual(messageObject, undefined, "THEN no error");
		}
		this.proxy.readPaths(assertSuccess);
	});
	QUnit.test("WHEN readPaths is called AND error", function(assert){
		assert.expect(4);
		this.analyticalConfigurationId = sap.apf.utils.createPseudoGuid(32);
		var that = this;
		this.ajaxStub = function(settings, options) {
			if (settings.url === "/sap/apf/runtime/v1/AnalysisPaths?$select=AnalysisPath,AnalysisPathName,LastChangeUtcDateTime,StructuredAnalysisPath&$filter=(AnalyticalConfiguration%20eq%20'" +
					that.analyticalConfigurationId + "')") {
				settings.error(jqXHR404);
			}
		};
		function assertError5214(result, metadata, messageObject) {
			assert.deepEqual(result, {status : "failed"}, "THEN only the status is returned");
			assert.strictEqual(metadata, undefined, "THEN no metadata");
			assert.strictEqual(messageObject.getCode(), "5214", "THEN correct error number");
			assert.deepEqual(messageObject.getParameters(), [ 404, "Not found"], "THEN text status and server error as expected");
		}
		this.proxy.readPaths(assertError5214);
	});
	QUnit.test("WHEN readPaths is called AND missing analytical configuration id", function(assert){
		assert.expect(4);
		this.analyticalConfigurationId = undefined;

		function assertError5075(result, metadata, messageObject) {
			assert.deepEqual(result, {status : "failed"}, "THEN only the status is returned");
			assert.strictEqual(metadata, undefined, "THEN no metadata");
			assert.strictEqual(messageObject.getCode(), 5075, "THEN correct error number");
			assert.deepEqual(messageObject.getParameters(), [], "THEN no parameters expected");
		}
		this.proxy.readPaths(assertError5075);
	});
	QUnit.test("WHEN readPaths is called AND error AND previous message object", function(assert){
		assert.expect(5);
		this.analyticalConfigurationId = sap.apf.utils.createPseudoGuid(32);
		var that = this;
		this.ajaxStub = function(settings, options) {
			if (settings.url === "/sap/apf/runtime/v1/AnalysisPaths?$select=AnalysisPath,AnalysisPathName,LastChangeUtcDateTime,StructuredAnalysisPath&$filter=(AnalyticalConfiguration%20eq%20'" +
					that.analyticalConfigurationId + "')") {
				var messageObject = new sap.apf.core.MessageObject({code : "6006"});
				settings.error(jqXHR404, "notOk", "failed", messageObject);
			}
		};
		function assertError5214(result, metadata, messageObject) {
			assert.deepEqual(result, {status : "failed"}, "THEN only the status is returned");
			assert.strictEqual(metadata, undefined, "THEN no metadata");
			assert.strictEqual(messageObject.getCode(), "5214", "THEN correct error number");
			assert.deepEqual(messageObject.getParameters(), [404, "Not found"], "THEN no parameters as expected");
			assert.strictEqual(messageObject.getPrevious().getCode(), "6006", "THEN correct error number of previous message");
		}
		this.proxy.readPaths(assertError5214);
	});
});