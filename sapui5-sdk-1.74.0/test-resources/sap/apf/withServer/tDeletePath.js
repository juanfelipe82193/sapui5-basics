/*
 * This test is executed manually against a server. The manual steps are described in the internal
 * document proxySettings.txt. Thus, it is not part of a testsuite.
 */
jQuery.sap.declare('sap.apf.withServer.tDeletePath');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.internal.server.userData');
jQuery.sap.require('sap.apf.withServer.helper');
jQuery.sap.require('sap.apf.core.utils.uriGenerator');
jQuery.sap.require('sap.apf.core.messageHandler');
jQuery.sap.require('sap.apf.core.odataRequest');
(function() {
	'use strict';
	function evaluateGatewayNotFoundResponse(assert, oError, statusCodeExpected) {
		if (oError.response.statusCode === statusCodeExpected) {
			assert.ok(true, "Request responded resource not found.");
		} else {
			assert.ok(false, "Request responded resource not found.");
		}
	}
	function evaluateXsNotFoundResponse(assert, oError) {
		var oErrorResponseBody = JSON.parse(oError.response.body); // TODO oErrorResponseBody.error.code should be provided, expected 5208 
		if (oError.response.statusText === "Not Found" && oError.response.statusCode === 404 && oErrorResponseBody.error.message.value === "Resource not found.") {
			assert.ok(true, "Request responded resource not found.");
		} else {
			assert.ok(false, "Request responded resource not found.");
		}
	}
	QUnit.module('Delete Path', {
		beforeEach : function(assert) {
			var done = assert.async();
			if (jQuery.sap.getUriParameters().get("systemType") === "abap") {
				this.config = {
					serviceRoot : "/sap/opu/odata/sap/BSANLY_APF_RUNTIME_SRV/",
					entitySet : "AnalysisPathQueryResults",
					systemType : "abap"
				};
			} else {
				this.config = {
					serviceRoot : "/sap/hba/r/apf/core/odata/apf.xsodata/",
					entitySet : 'AnalysisPathQueryResults',
					systemType : "xs"
				};
			}
			this.helper = new sap.apf.withServer.Helper(this.config);
			this.oPostObject = this.helper.createPostObject();
			this.oAuthTestHelper = this.helper.createAuthTestHelper(done, function() {
				done();
			});
		}
	});
	QUnit.test("Delete path", function(assert) {
		assert.expect(3);
		var done = assert.async();
		function fnReadDeletedPath(sAnalyticalPath) {
			var oRequest = {
				method : "GET"
			};
			var fnSuccess = function(oData, oResponse) {
				assert.ok(false, "Deleted path still exists.");
				done();
			};
			var fnError = function(oError) {
				if (jQuery.sap.getUriParameters().get("systemType") === "abap") {
					evaluateGatewayNotFoundResponse(assert, oError, 404);
					done();
				} else {
					evaluateXsNotFoundResponse(assert, oError);
					done();
				}
			};
			this.helper.sendRequest.bind(this)(oRequest, fnSuccess, fnError, sAnalyticalPath);
		}
		function fnDeleteNewPath(sAnalyticalPath) {
			var oRequest = {
				method : "DELETE"
			};
			var fnSuccess = function(oData, oResponse) {
				if (!oData && oResponse.statusText === "No Content") {
					assert.ok(true, "Path deleted.");
					fnReadDeletedPath.bind(this)(sAnalyticalPath);
				} else {
					assert.ok(false, "Deletion failed.");
				}
			}.bind(this);
			var fnError = function(oError) {
				assert.ok(false, "Request failed.");
				done();
			};
			this.helper.sendRequest.bind(this)(oRequest, fnSuccess, fnError, sAnalyticalPath);
		}
		// create path
		var oRequest = {
			method : "POST",
			data : this.oPostObject
		};
		var fnSuccess = function(oData, oResponse) {
			if (oData && oData.AnalysisPath && oResponse.statusText === "Created") {
				assert.ok(true, "Path created.");
				fnDeleteNewPath.bind(this)(oData.AnalysisPath);
			} else {
				assert.ok(false, "Request failed.");
				done();
			}
		}.bind(this);
		var fnError = function(oError) {
			assert.ok(false, "Request failed.");
			done();
		};
		this.helper.sendRequest.bind(this)(oRequest, fnSuccess, fnError);
	});
	QUnit.test("Delete path with invalid ID", function(assert) {
		var done = assert.async();
		var sAnalyticalPath = "INVALID";
		var oRequest = {
			method : "DELETE"
		};
		var fnSuccess = function(oData, oResponse) {
			assert.ok(false, "Success callback");
			done();
		};
		var fnError = function(oError) {
			if (jQuery.sap.getUriParameters().get("systemType") === "abap") {
				evaluateGatewayNotFoundResponse(assert, oError, 500);
				done();
			} else {
				evaluateXsNotFoundResponse(assert, oError);
				done();
			}
		};
		this.helper.sendRequest.bind(this)(oRequest, fnSuccess, fnError, sAnalyticalPath);
	});
})();