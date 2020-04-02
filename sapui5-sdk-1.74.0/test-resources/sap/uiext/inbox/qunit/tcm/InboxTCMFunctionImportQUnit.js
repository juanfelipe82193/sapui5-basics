/*global QUnit */
sap.ui.define([
	"sap/uiext/inbox/tcm/fI/TCMFunctionImport",
	"sap/uiext/inbox/tcm/fI/TCMFunctionImportMetaData"
], function(TCMFunctionImport, TCMFunctionImportMetaData) {
	"use strict";

	var oTCMFunctionImport = new TCMFunctionImport();
	var sServiceURL = "http://localhost/myservice";
	var mHeaders = {
			"Accept" : "application/json",
			"x-csrf-token" : "some-GUID"
		};

	var aUrlParams;

	oTCMFunctionImport.setServiceURL(sServiceURL);
	oTCMFunctionImport.setHeaders(mHeaders);

	QUnit.test("Load", 1, function(assert) {
		assert.ok(oTCMFunctionImport, "TCM Function Import is created");
	});

	QUnit.test("GetServiceURL", 1, function(assert) {
		assert.equal(oTCMFunctionImport.getServiceURL(), sServiceURL, "Service URL set is ok");
	});

	QUnit.test("GetHeaders", 1, function(assert) {
		assert.equal(oTCMFunctionImport.getHeaders(), mHeaders, "Headers set is ok");
	});

	QUnit.test("_createURLParamsArray", function(assert) {
		aUrlParams = oTCMFunctionImport._createURLParamsArray(
									{SearchPattern: "adm", MaxResults: 10, SAP__Origin: "LOCALHOST_C73_00"},
									TCMFunctionImportMetaData.SEARCHUSERS
									);
		assert.ok(aUrlParams, "URL Params are created");
		assert.equal(aUrlParams.length, 3, "Number of URL Parms created is ok");
		//Can be extended to include more Edm types
		assert.equal(aUrlParams[0], "SAP__Origin='LOCALHOST_C73_00'", "URL Param is right for SAP__Origin of type Edm.String");
		assert.equal(aUrlParams[1], "SearchPattern='adm'", "URL Param is right for SearchPattern of type Edm.String");
		assert.equal(aUrlParams[2], "MaxResults=10", "URL Param is right for MaxResults of type Edm.Integer");
	});

	QUnit.test("_createRequest", function(assert) {
		var oRequest = oTCMFunctionImport._createRequest("SearchUsers", aUrlParams, true, "GET");
		assert.ok(oRequest, "Request is created");
		assert.equal(oRequest.requestUri, "http://localhost/myservice/SearchUsers?SAP__Origin='LOCALHOST_C73_00'&SearchPattern='adm'&MaxResults=10");
		assert.equal(oRequest.method, "GET", "Request method is ok");
		assert.equal(oRequest.headers, mHeaders, "Request headers is ok");
		assert.equal(oRequest.async, true, "Request async is ok");
	});

	return oTCMFunctionImport;
});