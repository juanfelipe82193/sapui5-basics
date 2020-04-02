/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/navpopover/FakeFlpConnector", "sap/ui/core/Control", "sap/m/MessageBox", "sap/ui/comp/navpopover/SmartLink", "sap/ui/comp/navpopover/SemanticObjectController", "sap/ui/comp/navpopover/Factory", "sap/ui/comp/odata/MetadataAnalyser", "sap/base/Log"
], function(FakeFlpConnector, Control, MessageBox, SmartLink, SemanticObjectController, Factory, MetadataAnalyser, Log) {
	"use strict";

	QUnit.module("sap.ui.comp.navpopover.SemanticObjectController", {
		beforeEach: function() {
			FakeFlpConnector.enableFakeConnector({
				TestObject: {
					links: [
						{
							action: "displayFactSheet",
							intent: "#/dummyLink1",
							text: "Fact Sheet"
						}, {
							action: "anyAction",
							intent: "#/dummyLink2",
							text: "List"
						}
					]
				},
				TestObject2: {
					links: [
						{
							action: "displayFactSheet",
							intent: "#/dummyLink3",
							text: "Fact Sheet"
						}, {
							action: "anyAction",
							intent: "#/dummyLink4",
							text: "List2"
						}
					]
				},
				TestObject3: {
					links: []
				}
			});
		},
		afterEach: function() {
			FakeFlpConnector.disableFakeConnector();
			SemanticObjectController.destroyDistinctSemanticObjects();
		}
	});

	QUnit.test("constructor", function(assert) {
		var oSemanticObjectController = new SemanticObjectController();
		assert.ok(oSemanticObjectController);
		assert.equal(oSemanticObjectController.getContactAnnotationPaths(), null);
		assert.equal(oSemanticObjectController.getEnableAvailableActionsPersonalization(), null);
		assert.equal(oSemanticObjectController.getMapFieldToSemanticObject(), undefined);
	});

	QUnit.test("getDistinctSemanticObjects with delay", function(assert) {
		// system under test

		// arrange
		var done = assert.async();

		SemanticObjectController.getDistinctSemanticObjects().then(function() {
			// act

			// assertions
			assert.ok(SemanticObjectController.bHasPrefetchedDistinctSemanticObjects);
			assert.ok(!jQuery.isEmptyObject(SemanticObjectController.getJSONModel().getProperty("/distinctSemanticObjects")));

			done();

			// cleanup
		});
	});

	QUnit.test("register and unregister", function(assert) {
		// system under test
		var oSemanticObjectController = new SemanticObjectController();

		// arrange
		var oSmartLink = new SmartLink();

		// act
		oSemanticObjectController.registerControl(oSmartLink);

		// assertions
		assert.equal(oSemanticObjectController._aRegisteredControls.length, 1, "one control has to be registered");
		assert.ok(oSmartLink.hasListeners("beforePopoverOpens"), "Semantic Object Controller has to register event BeforePopoverOpens");
		assert.ok(oSmartLink.hasListeners("navigationTargetsObtained"), "Semantic Object Controller has to register event NavigationTargetsObtained");
		assert.ok(oSmartLink.hasListeners("innerNavigate"), "Semantic Object Controller has to register event InnerNavigate");

		// act
		oSemanticObjectController.unregisterControl(oSmartLink);

		// assertions
		assert.equal(oSemanticObjectController._aRegisteredControls.length, 0, "no control has to be registered");
		assert.ok(!oSmartLink.hasListeners("beforePopoverOpens"), "Semantic Object Controller has to unregister event BeforePopoverOpens");
		assert.ok(!oSmartLink.hasListeners("navigationTargetsObtained"), "Semantic Object Controller has to unregister event NavigationTargetsObtained");
		assert.ok(!oSmartLink.hasListeners("innerNavigate"), "Semantic Object Controller has to unregister event InnerNavigate");

		// cleanup
		oSemanticObjectController.destroy();
		oSmartLink.destroy();
	});

	QUnit.test("setIgnoredFields - via constructor", function(assert) {
		// system under test
		var oSemanticObjectController = new SemanticObjectController({
			ignoredFields: "TestField, DummyField"
		});

		// arrange

		// act
		var oSmartLink = new SmartLink({
			fieldName: "TestField",
			semanticObject: "TestObject",
			semanticObjectController: oSemanticObjectController
		});

		// assertions
		var done = assert.async();
		SemanticObjectController.getDistinctSemanticObjects().then(function() {
			assert.equal(oSmartLink.getEnabled(), false);

			done();

			// cleanup
			oSemanticObjectController.destroy();
			oSmartLink.destroy();
		});
	});

	QUnit.test("setIgnoredFields - via setIgnoredFields method", function(assert) {
		// system under test
		var oSemanticObjectController = new SemanticObjectController();

		// arrange
		var oSmartLink = new SmartLink({
			fieldName: "TestField",
			semanticObject: "TestObject",
			semanticObjectController: oSemanticObjectController
		});

		// act
		oSemanticObjectController.setIgnoredFields("TestField, DummyField");

		// assertions
		var done = assert.async();
		SemanticObjectController.getDistinctSemanticObjects().then(function() {
			assert.equal(oSmartLink.getEnabled(), false);

			done();

			// cleanup
			oSemanticObjectController.destroy();
			oSmartLink.destroy();
		});
	});

	QUnit.test("setIgnoredFields - via setSemanticObjectController method", function(assert) {
		// system under test
		var oSemanticObjectController = new SemanticObjectController({
			ignoredFields: "TestField"
		});

		// arrange
		var oSmartLink = new SmartLink({
			fieldName: "TestField",
			semanticObject: "TestObject",
			semanticObjectController: new SemanticObjectController({
				ignoredFields: "DummyField"
			})
		});

		// act
		oSmartLink.setSemanticObjectController(oSemanticObjectController);

		// assertions
		var done = assert.async();
		SemanticObjectController.getDistinctSemanticObjects().then(function() {
			assert.equal(oSmartLink.getEnabled(), false);

			done();

			// cleanup
			oSemanticObjectController.destroy();
			oSmartLink.destroy();
		});
	});

	QUnit.test("setIgnoredFields", function(assert) {
		// system under test
		var oSemanticObjectController = new SemanticObjectController();

		// arrange
		var oSmartLink = new SmartLink({
			fieldName: "TestField",
			semanticObject: "TestObject",
			semanticObjectController: oSemanticObjectController
		});

		// act
		oSemanticObjectController.setIgnoredFields("TestField, DummyField");
		oSemanticObjectController.setIgnoredFields("DummyField1, DummyField2");

		// assertions
		var done = assert.async();
		SemanticObjectController.getDistinctSemanticObjects().then(function() {

			assert.equal(oSmartLink.getEnabled(), true);
			done();

			// cleanup
			oSemanticObjectController.destroy();
			oSmartLink.destroy();
		});
	});

	QUnit.test("Check BeforePopoverOpens event", function(assert) {
		// system under test
		var oSemanticObjectController = new SemanticObjectController();

		var bOpenWasCalled = false;
		var oEventArgs = {
			open: function() {
				bOpenWasCalled = true;
			}
		};

		var oSmartLink = new SmartLink();
		oSemanticObjectController.registerControl(oSmartLink);

		oSmartLink.fireBeforePopoverOpens(oEventArgs);
		assert.ok(bOpenWasCalled, "SemanticObject controller has to call open if BeforePopoverOpens is not registered");

		bOpenWasCalled = false;
		var aReceivedParams = null;
		oSemanticObjectController.attachBeforePopoverOpens(function(oEvent) {
			aReceivedParams = oEvent.getParameters();
		});

		oSmartLink.fireBeforePopoverOpens(oEventArgs);
		assert.ok(!bOpenWasCalled, "SemanticObject controller should not call open if BeforePopoverOpens is registered");
		assert.ok(aReceivedParams.open === oEventArgs.open, "open function has to be forwarded via event args if BeforePopoverOpens is registered");

		// cleanup
		oSemanticObjectController.destroy();
		oSmartLink.destroy();
	});

	QUnit.test("Check TargetsObtained event", function(assert) {
		// system under test
		var oSemanticObjectController = new SemanticObjectController();

		var bShowWasCalled = false;
		var oEventArgs = {
			show: function() {
				bShowWasCalled = true;
			}
		};

		var oSmartLink = new SmartLink();
		oSemanticObjectController.registerControl(oSmartLink);

		oSmartLink.fireNavigationTargetsObtained(oEventArgs);
		assert.ok(bShowWasCalled, "SemanticObject controller has to call show if TargetsObtained is not registered");

		bShowWasCalled = false;
		var aReceivedParams = null;
		oSemanticObjectController.attachNavigationTargetsObtained(function(oEvent) {
			aReceivedParams = oEvent.getParameters();
		});

		oSmartLink.fireNavigationTargetsObtained(oEventArgs);
		assert.ok(!bShowWasCalled, "SemanticObject controller should not call open if TargetsObtained is registered");
		assert.ok(aReceivedParams.show === oEventArgs.show, "show function has to be forwarded via event args if TargetsObtained is registered");

		// cleanup
		oSemanticObjectController.destroy();
		oSmartLink.destroy();
	});

	QUnit.test("Check getFieldSemanticObjectMap function", function(assert) {
		// system under test
		var oSemanticObjectController = new SemanticObjectController();

		sinon.stub(Log, "warning");
		var oMyMap = {};
		var oMap = oSemanticObjectController.getFieldSemanticObjectMap();
		assert.ok(oMap === null, "no map should be returned");
		assert.ok(Log.warning.calledOnce, "no map available, warning should be logged");

		sinon.stub(MetadataAnalyser.prototype, "getFieldSemanticObjectMap").returns(oMyMap);
		oSemanticObjectController.setEntitySet("dummySet");
		oMap = oSemanticObjectController.getFieldSemanticObjectMap();
		assert.ok(oMap === oMyMap, "map should be returned");
		assert.ok(MetadataAnalyser.prototype.getFieldSemanticObjectMap.calledOnce, "MetadataAnalyser function should be called once");

		oMap = oSemanticObjectController.getFieldSemanticObjectMap();
		assert.ok(MetadataAnalyser.prototype.getFieldSemanticObjectMap.calledOnce, "MetadataAnalyser function should be called only once");

		// cleanup
		oSemanticObjectController.destroy();
	});

	QUnit.test("Check getEntitySet function", function(assert) {
		// system under test
		var oSemanticObjectController = new SemanticObjectController();

		var oParent = {
			getParent: function() {
				return {
					getParent: function() {
						return {
							getEntitySet: function() {
								return "dummySet";
							}
						};
					}
				};
			}
		};

		oSemanticObjectController.getParent = function() {
			return oParent;
		};
		assert.equal(oSemanticObjectController.getEntitySet(), "dummySet", "entity set should be taken from parent");

		// cleanup
		oSemanticObjectController.destroy();
	});

	QUnit.test("setPrefetchNavigationTargets - BCP 1680068310", function(assert) {
		// system under test
		var oSemanticObjectController = new SemanticObjectController();

		// arrange
		var done = assert.async();
		oSemanticObjectController.attachPrefetchDone(function(oEvent) {
			// assertions
			assert.equal(Object.keys(oEvent.getParameters().semanticObjects).length, 3);

			done();

			// cleanup
			oSemanticObjectController.destroy();
		});

		// act
		oSemanticObjectController.setPrefetchNavigationTargets(true);
	});

	QUnit.test("setPrefetchNavigationTargets", function(assert) {
		// system under test
		var oSemanticObjectController = new SemanticObjectController();

		// arrange
		var fnFirePrefetchDoneSpy = sinon.spy(oSemanticObjectController, "firePrefetchDone");
		var done = assert.async();
		oSemanticObjectController.attachPrefetchDone(function(oEvent) {
			// assert
			assert.ok(fnFirePrefetchDoneSpy.calledOnce);
			assert.equal(oSemanticObjectController.hasSemanticObjectLinks("TestObject"), true);
			assert.equal(oSemanticObjectController.hasSemanticObjectLinks("dummy"), false);
			assert.equal(oSemanticObjectController.hasSemanticObjectLinks(""), false);
			assert.equal(oSemanticObjectController.hasSemanticObjectLinks(null), false);

			done();

			// cleanup
			oSemanticObjectController.destroy();
		});

		// act
		oSemanticObjectController.setPrefetchNavigationTargets(true);
	});

	QUnit.test("setPrefetchNavigationTargets", function(assert) {
		// system under test
		var oSemanticObjectController = new SemanticObjectController();

		// arrange
		var fnFirePrefetchDoneSpy = sinon.spy(oSemanticObjectController, "firePrefetchDone");

		// act
		oSemanticObjectController.setPrefetchNavigationTargets(false);

		// assert
		assert.ok(!fnFirePrefetchDoneSpy.calledOnce);

		// cleanup
		oSemanticObjectController.destroy();
	});

	QUnit.test("Several instances of SemanticObjectController", function(assert) {
		// system under test

		// arrange
		var done = assert.async();
		var fnHasDistinctSemanticObjectSpy = sinon.spy(SemanticObjectController, "getDistinctSemanticObjects");

		// act
		var oSemanticObjectController1 = new SemanticObjectController();
		var oSemanticObjectController2 = new SemanticObjectController();

		SemanticObjectController.getDistinctSemanticObjects().then(function() {

			// assert
			assert.strictEqual(fnHasDistinctSemanticObjectSpy.callCount, 3);

			done();

			// cleanup
			oSemanticObjectController1.destroy();
			oSemanticObjectController2.destroy();
		});
	});

	QUnit.test("getDistinctSemanticObjects - order of multiple calls", function(assert) {
		// system under test

		// arrange
		var aTimer = [];

		// act
		var done = assert.async();
		SemanticObjectController.getDistinctSemanticObjects().then(function(oSemanticObjects) {

			// assert
			assert.equal(aTimer.length, 0);
			assert.equal(!!oSemanticObjects[""], false);

			aTimer.push("");
			done();

			// cleanup
			SemanticObjectController.destroyDistinctSemanticObjects();
		});

		var done1 = assert.async();
		SemanticObjectController.getDistinctSemanticObjects().then(function(oSemanticObjects) {

			// assert
			assert.equal(aTimer[0], "");
			assert.equal(!!oSemanticObjects["TestObject"], true);

			aTimer.push("TestObject");
			done1();

			// cleanup
			SemanticObjectController.destroyDistinctSemanticObjects();
		});

		var done2 = assert.async();
		SemanticObjectController.getDistinctSemanticObjects("TestObject2").then(function(oSemanticObjects) {

			// assert
			assert.equal(aTimer[0], "");
			assert.equal(aTimer[1], "TestObject");
			assert.equal(!!oSemanticObjects["TestObject2"], true);

			aTimer.push("TestObject2");
			done2();

			// cleanup
			SemanticObjectController.destroyDistinctSemanticObjects();
		});

		var done3 = assert.async();
		SemanticObjectController.getDistinctSemanticObjects(null).then(function(oSemanticObjects) {

			// assert
			assert.equal(aTimer[0], "");
			assert.equal(aTimer[1], "TestObject");
			assert.equal(aTimer[2], "TestObject2");
			assert.equal(!!oSemanticObjects[null], false);

			done3();

			// cleanup
			SemanticObjectController.destroyDistinctSemanticObjects();
		});

		var done4 = assert.async();
		SemanticObjectController.getDistinctSemanticObjects().then(function(oSemanticObjects) {
			// assert
			assert.equal(!!oSemanticObjects[""], false);

			SemanticObjectController.getDistinctSemanticObjects().then(function(oSemanticObjects) {

				// assert
				assert.equal(!!oSemanticObjects["TestObject"], true);

				done4();

				// cleanup
				SemanticObjectController.destroyDistinctSemanticObjects();
			});
		});
	});

	QUnit.start();
});
