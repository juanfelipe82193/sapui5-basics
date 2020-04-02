/*global QUnit */
sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/ODataMetaModel",
	"sap/ui/model/odata/ODataModel",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/generic/app/ApplicationController"
], function(
	MockServer,
	ODataMetaModel,
	ODataModelV1,
	ODataModelV2,
	ApplicationController
) {
	"use strict";

	var sServiceUri = "/SalesOrderSrv/";
	var sDataRootPath =  "test-resources/sap/ui/generic/app/qunit/testdata/SalesOrder/";
	var oModel;

	var oMockServer = new MockServer({
		rootUri: sServiceUri
	});

	function initServer() {
		oMockServer.simulate("test-resources/sap/ui/generic/app/qunit/testdata/SalesOrder/metadata.xml", sDataRootPath);
		oMockServer.start();
	}

	function stopServer() {
		oMockServer.stop();
	}

	function initModel(mParameters) {
		return new ODataModelV2(sServiceUri, mParameters);
	}

	function removeSharedMetadata() {
		var sURI = sServiceUri.replace(/\/$/, "");
		if (ODataModelV2.mServiceData
				&& ODataModelV2.mServiceData[sURI]) {
			delete ODataModelV2.mServiceData[sURI].oMetadata;
		}
	}

	/*  TESTS */

	QUnit.module("sap.ui.generic.app.ApplicationController", {
		beforeEach: function() {
			initServer();
			oModel = initModel();
			this.oApplicationController = new ApplicationController(oModel);
		},
		afterEach: function() {
			oModel.destroy();
			oModel = undefined;
			removeSharedMetadata();
			stopServer();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oApplicationController);
	});
});