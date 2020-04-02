/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/navpopover/FakeFlpConnector",
	"sap/ui/comp/navpopover/SemanticObjectController",
	"sap/ui/comp/navpopover/Util",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/json/JSONModel",
	"sap/base/Log"

], function(
	FakeFlpConnector,
	SemanticObjectController,
	Util,
	MockServer,
	ODataModel,
	JSONModel,
	Log
) {
	"use strict";

	var oMockServer;
	function setUpMockServer() {
		oMockServer = new MockServer({
			rootUri: "/odataFake/"
		});
		// configure
		MockServer.config({
			autoRespond: true,
			autoRespondAfter: 1000
		});
		oMockServer.simulate(
			"test-resources/sap/ui/comp/qunit/navpopover/mockserverQunit/metadata.xml",
			"test-resources/sap/ui/comp/qunit/navpopover/mockserverQunit/"
		);
		oMockServer.start();
	}

	function stopMockServer() {
		oMockServer.stop();
		oMockServer.destroy();
	}

	QUnit.module("sap.ui.comp.navpopover.Util: retrieveNavigationTargets", {
		beforeEach: function() {
			FakeFlpConnector.enableFakeConnector({
				TestObjectEmpty: {
					links: []
				},
				TestObjectDisplayFactSheet: {
					links: [
						{
							action: "displayFactSheet",
							intent: "?TestObjectDisplayFactSheet#/dummyLink",
							text: "Fact Sheet"
						}
					]
				},
				TestObjectAnyAction: {
					links: [
						{
							action: "anyAction",
							intent: "?TestObjectAnyAction#/dummyLink",
							text: "Fact Sheet"
						}
					]
				},
				TestObjectTwoIntents: {
					links: [
						{
							action: "anyAction",
							intent: "?TestObjectTwoIntents#/dummyLink1",
							text: "Fact Sheet 1"
						}, {
							action: "anyAction",
							intent: "?TestObjectTwoIntents#/dummyLink2",
							text: "Fact Sheet 2"
						}
					]
				}
			});
		},
		afterEach: function() {
			FakeFlpConnector.disableFakeConnector();
			SemanticObjectController.destroyDistinctSemanticObjects();
		}
	});

	QUnit.test("CrossApplicationNavigation service not available", function(assert) {
		var fnSapLogErrorSpy = sinon.spy(Log, "error").withArgs("Service 'CrossApplicationNavigation' or 'URLParsing' could not be obtained");

		FakeFlpConnector.disableFakeConnector();

		var done = assert.async();
		Util.retrieveNavigationTargets("TestObjectDummy", []).then(function(oNavigationTargets) {
			assert.ok(fnSapLogErrorSpy.withArgs("Service 'CrossApplicationNavigation' or 'URLParsing' could not be obtained").called);
			assert.equal(oNavigationTargets.mainNavigation, null);
			assert.equal(oNavigationTargets.ownNavigation, null);
			assert.deepEqual(oNavigationTargets.availableActions, []);

			done();
			Log.error.restore();
		});
	});

	QUnit.test("CrossApplicationNavigation service returns empty links", function(assert) {
		var fnSapLogErrorSpy = sinon.spy(Log, "error");

		var done = assert.async();
		Util.retrieveNavigationTargets("TestObjectEmpty", []).then(function(oNavigationTargets) {
			assert.ok(!fnSapLogErrorSpy.called);
			assert.equal(oNavigationTargets.mainNavigation, null);
			assert.equal(oNavigationTargets.ownNavigation, null);
			assert.deepEqual(oNavigationTargets.availableActions, []);

			done();
			Log.error.restore();
		});
	});

	QUnit.test("CrossApplicationNavigation service returns one link with action 'displayFactSheet'", function(assert) {
		// system under test

		// arrange
		var done = assert.async();
		var fnSapLogErrorSpy = sinon.spy(Log, "error");

		// act
		Util.retrieveNavigationTargets("TestObjectDisplayFactSheet", [], null, null, null, null).then(function(oNavigationTargets) {

			// assert
			assert.ok(!fnSapLogErrorSpy.called);
			assert.equal(oNavigationTargets.mainNavigation.getHref(), "?TestObjectDisplayFactSheet#/dummyLink");
			assert.equal(oNavigationTargets.mainNavigation.getText(), sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_FACTSHEET"));
			assert.equal(oNavigationTargets.ownNavigation, null);
			assert.deepEqual(oNavigationTargets.availableActions, []);

			done();

			// cleanup
			Log.error.restore();
		});
	});

	QUnit.test("CrossApplicationNavigation service returns one link with any action", function(assert) {
		// system under test

		// arrange
		var done = assert.async();
		var fnSapLogErrorSpy = sinon.spy(Log, "error");

		// act
		Util.retrieveNavigationTargets("TestObjectAnyAction", [], null, null, null, "Label").then(function(oNavigationTargets) {

			// assert
			assert.ok(!fnSapLogErrorSpy.called);
			assert.equal(oNavigationTargets.mainNavigation.getHref(), "");
			assert.equal(oNavigationTargets.mainNavigation.getText(), "Label");
			assert.equal(oNavigationTargets.ownNavigation, null);
			assert.deepEqual(oNavigationTargets.availableActions.length, 1);
			assert.deepEqual(oNavigationTargets.availableActions[0].getHref(), "?TestObjectAnyAction#/dummyLink");
			assert.deepEqual(oNavigationTargets.availableActions[0].getText(), "Fact Sheet");

			done();

			// cleanup
			Log.error.restore();
		});
	});

	QUnit.test("CrossApplicationNavigation service returns two links with any actions", function(assert) {
		// system under test

		// arrange
		var done = assert.async();
		var fnSapLogErrorSpy = sinon.spy(Log, "error");

		// act
		Util.retrieveNavigationTargets("TestObjectTwoIntents", [], null, null, null, "Label").then(function(oNavigationTargets) {

			// assert
			assert.ok(!fnSapLogErrorSpy.called);
			assert.equal(oNavigationTargets.mainNavigation.getHref(), "");
			assert.equal(oNavigationTargets.mainNavigation.getText(), "Label");
			assert.equal(oNavigationTargets.ownNavigation, null);
			assert.deepEqual(oNavigationTargets.availableActions.length, 2);
			assert.deepEqual(oNavigationTargets.availableActions[0].getHref(), "?TestObjectTwoIntents#/dummyLink1");
			assert.deepEqual(oNavigationTargets.availableActions[0].getText(), "Fact Sheet 1");
			assert.deepEqual(oNavigationTargets.availableActions[1].getHref(), "?TestObjectTwoIntents#/dummyLink2");
			assert.deepEqual(oNavigationTargets.availableActions[1].getText(), "Fact Sheet 2");

			done();

			// cleanup
			Log.error.restore();
		});
	});

	QUnit.test("different SemanticObjects", function(assert) {
		// system under test

		// arrange
		var done = assert.async();

		// act
		Util.retrieveNavigationTargets("TestObjectDisplayFactSheet", [
			"TestObjectAnyAction", "TestObjectTwoIntents"
		], null, null, null, null).then(function(oNavigationTargets) {

			// assert
			assert.equal(oNavigationTargets.mainNavigation.getHref(), "?TestObjectDisplayFactSheet#/dummyLink");
			assert.equal(oNavigationTargets.mainNavigation.getText(), sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_FACTSHEET"));
			assert.equal(oNavigationTargets.ownNavigation, null);
			assert.deepEqual(oNavigationTargets.availableActions.length, 3);
			assert.deepEqual(oNavigationTargets.availableActions[0].getHref(), "?TestObjectAnyAction#/dummyLink");
			assert.deepEqual(oNavigationTargets.availableActions[0].getText(), "Fact Sheet");
			assert.deepEqual(oNavigationTargets.availableActions[1].getHref(), "?TestObjectTwoIntents#/dummyLink1");
			assert.deepEqual(oNavigationTargets.availableActions[1].getText(), "Fact Sheet 1");
			assert.deepEqual(oNavigationTargets.availableActions[2].getHref(), "?TestObjectTwoIntents#/dummyLink2");
			assert.deepEqual(oNavigationTargets.availableActions[2].getText(), "Fact Sheet 2");

			done();

			// cleanup
		});
	});

	QUnit.module("sap.ui.comp.navpopover.Util: retrieveSemanticObjectMapping", {
		beforeEach: function() {
			setUpMockServer();
			this.oODataModel = new ODataModel("/odataFake");
		},
		afterEach: function() {
			stopMockServer();
			this.oODataModel.destroy();
		}
	});

	QUnit.test("invalid parameters", function(assert) {
		var done = assert.async();
		var done2 = assert.async();
		var done3 = assert.async();
		var done4 = assert.async();
		var done5 = assert.async();
		var done6 = assert.async();
		Util.retrieveSemanticObjectMapping("", this.oODataModel, "/ProductCollection()").then(function(oSemanticObjects) {
			assert.deepEqual(oSemanticObjects, null);
			done();
		});
		Util.retrieveSemanticObjectMapping("Dummy", this.oODataModel, "/ProductCollection()").then(function(oSemanticObjects) {
			assert.deepEqual(oSemanticObjects, null);
			done5();
		});
		Util.retrieveSemanticObjectMapping("Name", new JSONModel({
			ProductCollection: {
				id: "38094020.0"
			}
		}), "/ProductCollection()").then(function(oSemanticObjects) {
			assert.deepEqual(oSemanticObjects, null);
			done2();
		});
		Util.retrieveSemanticObjectMapping("Name", this.oODataModel, "/DummyCollection()").then(function(oSemanticObjects) {
			assert.deepEqual(oSemanticObjects, null);
			done3();
		});
		Util.retrieveSemanticObjectMapping("Name", this.oODataModel, null).then(function(oSemanticObjects) {
			assert.deepEqual(oSemanticObjects, null);
			done6();
		});
		Util.retrieveSemanticObjectMapping("Name", this.oODataModel, "/EmptyCollection()").then(function(oSemanticObjects) {
			assert.deepEqual(oSemanticObjects, null);
			done4();
		});
	});

	QUnit.test("with existing mapping annotation attributes", function(assert) {
		var done = assert.async();
		Util.retrieveSemanticObjectMapping("Name", this.oODataModel, "/ProductCollection()").then(function(oSemanticObjects) {
			assert.deepEqual(oSemanticObjects, {
				SemanticObjectName: {
					ProductId: "ProductId_NEW"
				}
			});
			done();
		});
	});

	QUnit.test("with empty mapping annotation array", function(assert) {
		var done = assert.async();
		Util.retrieveSemanticObjectMapping("Category", this.oODataModel, "/ProductCollection()").then(function(oSemanticObjects) {
			assert.deepEqual(oSemanticObjects, {
				SemanticObjectName: {}
			});
			done();
		});
	});

	QUnit.test("with empty mapping annotation", function(assert) {
		var done = assert.async();
		Util.retrieveSemanticObjectMapping("ProductPicUrl", this.oODataModel, "/ProductCollection()").then(function(oSemanticObjects) {
			assert.deepEqual(oSemanticObjects, {
				SemanticObjectName: {}
			});
			done();
		});
	});

	QUnit.start();
});
