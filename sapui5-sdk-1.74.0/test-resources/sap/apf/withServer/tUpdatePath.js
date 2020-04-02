/** 
 * This test is executed manually against a server. The manual steps are described in the internal
 * document proxySettings.txt. Thus, it is not part of a testsuite. 
 */
jQuery.sap.declare('sap.apf.withServer.tUpdatePath');
jQuery.sap.require('sap.apf.internal.server.userData');
jQuery.sap.require('sap.apf.withServer.helper');
jQuery.sap.require('sap.apf.core.utils.uriGenerator');
jQuery.sap.require('sap.apf.core.messageHandler');
jQuery.sap.require('sap.apf.core.odataRequest');

(function() {
	'use strict';

	QUnit.module('Update Path', {
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
	QUnit.test("Update path", function(assert) {
		var done = assert.async();
		function readUpdatedPath(sAnalysisPath) {
			var oRequest = {
				method : "GET"
			};
			var fnSuccess = function(oData, oResponse) {
				if (oData && oData.AnalysisPath && oData.AnalysisPath === sAnalysisPath && oData.AnalysisPathName === "Updated Path" && oResponse.statusCode === 200) {
					assert.ok(true, "Updated path exists.");
				} else {
					assert.ok(false, "Request failed.");
				}
				done();
			};
			var fnError = function(oError) {
				assert.ok(false, "Updated path exists.");
				done();
			};
			this.helper.sendRequest.bind(this)(oRequest, fnSuccess, fnError, sAnalysisPath);
		}
		function fnUpdatePath(sAnalysisPath) {
			var oPostObjectUpdated = this.helper.createPostObject();
			oPostObjectUpdated.AnalysisPathName = "Updated Path";
			oPostObjectUpdated.AnalysisPath = sAnalysisPath;
			var oRequest = {
				method : "PUT",
				data : oPostObjectUpdated
			};
			var fnSuccess = function(oData, oResponse) {
				if (!oData && oResponse.statusCode === 204) {
					assert.ok(true, "Path updated.");
					readUpdatedPath.bind(this)(sAnalysisPath);
				} else {
					assert.ok(false, "Request failed.");
				}
			}.bind(this);
			var fnError = function(oError) {
				assert.ok(false, "Request failed.");
				done();
			};
			this.helper.sendRequest.bind(this)(oRequest, fnSuccess, fnError, sAnalysisPath);
		}
		// create path
		var oRequest = {
			method : "POST",
			data : this.oPostObject
		};
		var fnSuccess = function(oData, oResponse) {
			if (oData && oData.AnalysisPath && oResponse.statusText === "Created") {
				assert.ok(true, "Path created.");
				fnUpdatePath.bind(this)(oData.AnalysisPath);
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
	QUnit.test("Update path with invalid ID", function(assert) {
		var done = assert.async();
		var oPostObject = this.helper.createPostObject();
		var sAnalysisPath = "INVALID";
		oPostObject.AnalysisPathName = "Path with invalid ID";
		oPostObject.AnalysisPath = sAnalysisPath;
		var oRequest = {
			method : "PUT",
			data : oPostObject
		};
		var fnSuccess = function(oData, oResponse) {
			assert.ok(false, "'Success callback.");
			done();
		};
		var fnError = function(oError) {
			assert.ok(true, "Request failed.");
			done();
		};
		this.helper.sendRequest.bind(this)(oRequest, fnSuccess, fnError, sAnalysisPath);
	});

}());