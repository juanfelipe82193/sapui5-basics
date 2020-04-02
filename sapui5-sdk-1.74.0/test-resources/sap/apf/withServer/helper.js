jQuery.sap.declare('sap.apf.withServer.helper');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require('sap.apf.testhelper.authTestHelperAbap');
jQuery.sap.require("sap.ui.thirdparty.datajs");

(function() {
	'use strict';

	sap.apf.withServer.Helper = function(config) {
		var authTestHelper;
		function getLogicalSystemName() {
			if (config.systemType === "abap") {
				return '          ';
			}
			return '4711';
		}
		this.createAuthTestHelper = function(done, callback) {
			if (config.systemType === "abap") {
				authTestHelper = new sap.apf.testhelper.AuthTestHelperAbap(done, callback, config);
			} else {
				authTestHelper = new sap.apf.testhelper.AuthTestHelper(done, callback);
			}
			return authTestHelper;
		};
		this.createPostObject = function() {
			var oDate = new Date();
			var sSerializedPath = JSON.stringify({
				"path" : {
					"indicesOfActiveSteps" : [ 0 ],
					"steps" : [ {
						"stepId" : "one",
						"binding" : {
							"selectedRepresentationId" : "reprOne"
						}
					}, {
						"stepId" : "two",
						"binding" : {
							"selectedRepresentationId" : "reprTwo"
						}
					} ]
				},
				"context" : {}
			});
			var sStructuredPath = JSON.stringify({
				"steps" : [ {
					"stepId" : "one"
				}, {
					"stepId" : "two"
				} ],
				"indexOfActiveStep" : 0
			});
			return {
				"AnalysisPath" : "",
				"AnalysisPathName" : "myPath" + oDate.toLocaleString(),
				"LogicalSystem" : getLogicalSystemName(),
				"ApplicationConfigurationURL" : "myApplicationConfiguration.json",
				"SerializedAnalysisPath" : sSerializedPath,
				"StructuredAnalysisPath" : sStructuredPath
			};
		};
		this.sendRequest = function(oRequest, fnSuccessCallback, fnErrorCallback, sPath) {
			var sAnalysisPath = sPath || "";
			var sServiceRoot = config.serviceRoot;
			var sEntitySet = config.entitySet;
			var sUrl = sServiceRoot + sEntitySet;
			// if oRequest.method === "POST" do nothing
			if ((oRequest.method === "GET" || "PUT" || "DELETE") && sAnalysisPath) {
				sUrl = sUrl + "('" + sAnalysisPath + "')";
			} else if (oRequest.method === "GET" && !sAnalysisPath) {
				sUrl = sUrl + "?$orderby=LastChangeUTCDateTime desc";
			}
			authTestHelper.getXsrfToken().done(function(sXsrfToken){
				oRequest.requestUri = sUrl;
				oRequest.headers = {
					"x-csrf-token" : sXsrfToken
				};
				var fnSuccess = function(oData, oResponse) {
					return fnSuccessCallback(oData, oResponse, sAnalysisPath);
				};
				var fnError = function(oError) {
					return fnErrorCallback(oError);
				};
				var oInject = {
					instances: {
						datajs: OData
					},
					functions : {
						getSapSystem : function() {}
					}
				};
				sap.apf.core.odataRequestWrapper(oInject, oRequest, fnSuccess, fnError);
			});
		};
	};
}());