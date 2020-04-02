/*global sap, jQuery, location */
sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/apf/utils/hashtable"
], function(MockServer, HashTable) {
	'use strict';

	var mockServers = [];
	var annotationMockServers = [];
	var oldDsoPath = '/sap/hba/apps/wca/dso/s/odata/';
	var oldDpoPath = '/sap/hba/apps/wca/dpo/s/odata/';
	var wcaPath = '/sap/hba/r/sfin700/wca/odata/wca.xsodata/'; // dso & dpo
	var apfPath = '/sap/hba/r/apf/core/odata/';
	var modelerPath = '/sap/hba/r/apf/core/odata/modeler/';
	var genericPath = '/some/path/';
	var genericPath2 = '/some/path2/';
	var gatewayPath = "/sap/opu/odata/sap/";
	var mmPath = "/sap/mm/";
	var emptyPath = "/sap/empty/";
	var anaFlightsCdsPath = '/cds/';
	var unexpectedEntitySetNamePath = '/unexpected/';
	var staticMethods = {
		activateGenericMetadata : function() {
			mockServers.push(createMockServer(genericPath, 'dummy.xsodata', "genericMetadata", "genericAnnotation"));
		},
		activateDummyMetadata : function() {
			mockServers.push(createMockServer("", 'dummy.xsodata', "genericMetadata"));
		},
		activateGenericMetadataWithoutAnnotations : function() {
			mockServers.push(createMockServer(genericPath, 'dummy.xsodata', "genericMetadata"));
		},
		activateGenericMetadata2 : function() {
			mockServers.push(createMockServer(genericPath2, 'dummyTwo.xsodata', "genericMetadata", "genericAnnotation"));
		},
		activateGateway : function() {
			mockServers.push(createMockServer(gatewayPath, 'ZJH_4APF_005_SRV', "gatewayMetadata"));
		},
		activateMmMetadata : function() {
			mockServers.push(createMockServer(mmPath, 'ZAPF_Q002_SRV', "mmMetadata"));
		},
		activateDso : function() {
			mockServers.push(createMockServer(oldDsoPath, 'wca.xsodata', "dso", undefined, ["YearMonthQueryResults"]));
		},
		activateDpo : function() {
			mockServers.push(createMockServer(oldDpoPath, 'wca.xsodata', "dpo"));
		},
		activateWca : function() {
			mockServers.push(createMockServer(wcaPath, 'wca.xsodata', "wca"));
		},
		activateApf : function() {
			mockServers.push(createMockServer(apfPath, 'apf.xsodata', "apf", "apfAnnotation"));
		},
		activateModeler : function() {
			mockServers.push(createMockServer(modelerPath, 'AnalyticalConfiguration.xsodata', "modeler"));
		},
		activateGatewayWithEntitySetWithOutAggretation : function() {
			mockServers.push(createMockServer(anaFlightsCdsPath, 'ZI_ANA_FLIGHT_CDS', "zi_ana_flight_cds"));
		},
		activateEmptyMetadata : function() {
			mockServers.push(createMockServer(emptyPath, 'empty.xsodata', "empty"));
		},
		activateHierarchyMetadata : function() {
			mockServers.push(createMockServer(genericPath, 'hierarchy.xsodata', "hierarchyMetadata"));
		},
		activateBrokenHierarchyMetadata : function() {
			mockServers.push(createMockServer(genericPath, 'brokenHierarchy.xsodata', "brokenHierarchyMetadata"));
		},
		activateUnexpectedEntitySetName : function() {
			mockServers.push(createMockServer(unexpectedEntitySetNamePath, 'unexpectedEntitysetName.xsodata', "unexpectedEntitysetName" ));
		},
		deactivate : function() {
			mockServers.forEach(function(mockServer) {
				mockServer.stop();
				mockServer.destroy();
			});
			mockServers = [];
			annotationMockServers.forEach(function(mockServer) {
				mockServer.stop();
				mockServer.destroy();
			});
			annotationMockServers = [];
		}
	};
	function _getMetadataPath() {
		return getApplicationRoot() + "testhelper/mockServer/metadata/<placeholder>.xml";
	}
	function _getDataPath() {
		return getApplicationRoot() + "testhelper/mockServer/data/<placeholder>/"
	}
	function getApplicationRoot() {
		var sApfLocation = jQuery.sap.getModulePath("sap.apf") + '/';
		var karmaBaseIndex = sApfLocation.indexOf("/base");
		var sPath = null;
		if (karmaBaseIndex === 0) { // Karma
			return "base/test/uilib/sap/apf/";
		}
		if (location.pathname.indexOf("/resources") !== -1){ // resources precedes test-resources
			sPath = location.pathname.replace("/resources", "/test-resources");
		} else {
			var sHref = jQuery(location).attr('href');
			sPath = sHref.replace(location.protocol + "//" + location.host, "");
		}
		var sPrefix = sPath.slice(0, sPath.indexOf("test-resources"));
		var uri = sPrefix + "test-resources/sap/apf/";
		return uri;
	}
	// annotationFile is optional
	function createMockServer(servicePath, rootDocument, serviceName, annotationFile, aEntitySetsName) {
		var annotationMockServer;
		var mockServer = new MockServer({
			rootUri : servicePath + rootDocument + '/'
		});
		mockServer.simulate(_getMetadataPath().replace("<placeholder>", serviceName), {
			sMockdataBaseUrl : _getDataPath().replace("<placeholder>", serviceName),
			aEntitySetsNames : aEntitySetsName
		});
		if (annotationFile) {
			annotationMockServer = new MockServer({
				rootUri : servicePath,
				requests : [ {
					method : "GET",
					path : new RegExp(".*annotation.xml"),
					response : function(xhr, sUrl) {
						var annotationFilePath = _getMetadataPath().replace("<placeholder>", annotationFile);
						return xhr.respondFile(200, {}, annotationFilePath);
					}
				}, {
					method : "HEAD",
					path : new RegExp(".*annotation.xml"),
					response : function(xhr, sUrl) {
						var annotationFilePath = _getMetadataPath().replace("<placeholder>", annotationFile);
						return xhr.respondFile(200, {}, annotationFilePath);
					}
				} ]
			});
		} else if(servicePath){
			annotationMockServer = new MockServer({
				rootUri : servicePath,
				requests : [ {
					method : "GET",
					path : new RegExp(".*annotation.xml"),
					response : function(xhr) {
						return xhr.respondFile(404, {}, "");
					}
				}, {
					method : "HEAD",
					path : new RegExp(".*annotation.xml"),
					response : function(xhr, sUrl) {
						return xhr.respondFile(404, {}, "");
					}
				} ]
			});
		}
		if(annotationMockServer){
			annotationMockServer.start();
			annotationMockServers.push(annotationMockServer);
		}
		mockServer.start();
		return mockServer;
	}

	/*BEGIN_COMPATIBILITY*/
	jQuery.sap.declare('sap.apf.testhelper.mockServer.wrapper');
	sap.apf.testhelper.mockServer = staticMethods;
	/*END_COMPATIBILITY*/

	// return the public interface
	return staticMethods;
});
