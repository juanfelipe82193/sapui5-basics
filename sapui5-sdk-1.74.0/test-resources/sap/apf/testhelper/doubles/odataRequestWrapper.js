jQuery.sap.declare("sap.apf.testhelper.doubles.odataRequestWrapper");

jQuery.sap.require("sap.apf.core.constants");
jQuery.sap.require("sap.apf.core.odataRequest");
jQuery.sap.require("jquery.sap.storage");
(function() {
		'use strict';

		jQuery.sap.storage.clear();

		var nGuidCounter = 0;
		sap.apf.testhelper.doubles.odataRequestWrapper = function(oMessageHandler, oRequest, fnSuccess, fnError, oBatchHandler) {
			var memberOfAnalysisPathUrl = sap.apf.core.constants.entitySets.analysisPath + '(';
			if (oRequest.requestUri.search("apf.xsodata") > -1) {
				switch (oRequest.method) {
					case "POST":
						post(oRequest, fnSuccess, fnError);
						break;
					case "GET":
						if (oRequest.requestUri.indexOf(memberOfAnalysisPathUrl) > -1) {
							getPath(oRequest, fnSuccess, fnError);
						} else {
							return getAllPaths(oRequest, fnSuccess, fnError);
						}
						break;
					case "PUT":
						put(oRequest, fnSuccess, fnError);
						break;
					case "DELETE":
						delete_(oRequest);
						break;
					default:
						//
				}
			} else if (oRequest.requestUri.search("wca.xsodata") > -1) {
				throw new Error("not implemented");
			} else {
				sap.apf.core.odataRequestWrapper(oMessageHandler, oRequest, fnSuccess, fnError, oBatchHandler);
			}
			function delete_(oRequest) {
				var sId = extractUrlParam();
				var aPathData = JSON.parse(jQuery.sap.storage.get("path"));
				jQuery.sap.storage.removeAll("path");
				for(var i = 0; i < aPathData.length; i++) {
					if (aPathData[i].AnalysisPath === sId) {
						aPathData.splice(i, 1);
					}
				}
				jQuery.sap.storage.put("path", JSON.stringify(aPathData));
				var oData = {};
				var oResponse = {
					body : "",
					requestUri : oRequest.requestUri,
					statusCode : 204,
					statusText : "No Content"
				};
				fnSuccess(oData, oResponse);
			}
			function post(oRequest, fnSuccess, fnError) {
				var oRequestData = oRequest.data;
				if (oRequestData.AnalysisPath === "") {
					createNewPath(oRequestData, fnSuccess);
				}
			}
			function put(oRequest, fnSuccess, fnError) {
				var oRequestData = oRequest.data;
				var aPathData = JSON.parse(jQuery.sap.storage.get("path"));
				if (aPathData === null) {
					aPathData = [];
				}
				var sId = extractUrlParam();
				var response;
				for(var i = 0; i < aPathData.length; i++) {
					if (aPathData[i].AnalysisPath === sId) {
						aPathData[i].AnalysisPathName = oRequestData.AnalysisPathName;
						aPathData[i].SerializedAnalysisPath = oRequestData.SerializedAnalysisPath;
						aPathData[i].StructuredAnalysisPath = oRequestData.StructuredAnalysisPath;
						jQuery.sap.storage.put("path", JSON.stringify(aPathData));
						response = {
							statusCode : 204,
							statusText : "No Content"
						};
						fnSuccess(undefined, response);
						return;
					}
				}
			}
			function createNewPath(oRequestData, fnSuccess) {
				nGuidCounter++;
				oRequestData.AnalysisPath = "guid" + nGuidCounter;
				oRequestData.CreationUtcDateTime = "UTC date time";
				oRequestData.LastChangeUTCDateTime = "/Date(1398852805307)/";
				var aPathData = JSON.parse(jQuery.sap.storage.get("path"));
				if (aPathData === null) {
					aPathData = [];
				}
				aPathData.push(oRequestData);
				jQuery.sap.storage.put("path", JSON.stringify(aPathData));
				var data = oRequestData;
				var response = {
					data : data,
					requestUri : oRequest.requestUri,
					statusCode : 201,
					statusText : "Created"
				};
				fnSuccess(data, response);
			}
			function getAllPaths(oRequest, fnSuccess, fnError) {
				var aPathData = JSON.parse(jQuery.sap.storage.get("path"));
				var sLogicalSystem = extractFilterValue("LogicalSystem");
				var aResults = [];
				var oSingleEntry;
				if (aPathData === null) {
					return [];
				}
				for(var i = 0; i < aPathData.length; i++) {
					if (aPathData[i].LogicalSystem === sLogicalSystem) {
						oSingleEntry = aPathData[i];
						delete oSingleEntry.SerializedAnalysisPath;
						delete oSingleEntry.ApplicationConfigurationURL;
						delete oSingleEntry.LogicalSystem;
						oSingleEntry.StructuredAnalysisPath = oSingleEntry.StructuredAnalysisPath;
						aResults.push(aPathData[i]);
					}
				}
				var data = {
					results : aResults
				};
				var response = {
					data : data,
					statusCode : 200,
					statusText : "OK"
				};
				fnSuccess(data, response);
			}
			function getPath(oRequest, fnSuccess, fnError) {
				var data, response;
				var aPathData = JSON.parse(jQuery.sap.storage.get("path"));
				if (aPathData === null) {
					aPathData = [];
				}
				var sId = extractUrlParam();
				for(var i = 0; i < aPathData.length; i++) {
					if (aPathData[i].AnalysisPath === sId) {
						data = {
							AnalysisPath : sId,
							AnalysisPathName : 'myPath',
							SerializedAnalysisPath : aPathData[i].SerializedAnalysisPath
						};
						response = {
							data : data,
							statusCode : 200,
							statusText : "OK"
						};
						fnSuccess(data, response);
						return;
					}
				}
			}
			function extractUrlParam() {
				return oRequest.requestUri.match(/\('([^)]+)'\)/)[1];
			}
			function extractFilterValue(name) {
				var result = oRequest.requestUri.match("\(" + name + "%20eq%20'([^)]+)'%20\)");
				return result[2];
			}
		};
}());