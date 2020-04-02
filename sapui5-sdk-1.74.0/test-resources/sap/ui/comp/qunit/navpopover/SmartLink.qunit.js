/* global  QUnit, sinon */

sap.ui.define([
	"sap/ui/comp/navpopover/FakeFlpConnector",
	"sap/ui/comp/navpopover/SmartLink",
	"sap/ui/core/Control",
	"sap/ui/comp/navpopover/SemanticObjectController",
	"sap/m/Text"

], function(
	FakeFlpConnector,
	SmartLink,
	Control,
	SemanticObjectController,
	Text
) {
	"use strict";

	QUnit.module("sap.ui.comp.navpopover.SmartLink", {
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
				}
			});
		},
		afterEach: function() {
			FakeFlpConnector.disableFakeConnector();
			SemanticObjectController.destroyDistinctSemanticObjects();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(new SmartLink());
	});

	QUnit.test("Empty contructor", function(assert) {
		var oSmartLink = new SmartLink();

		assert.equal(oSmartLink.getContactAnnotationPath(), undefined);
	});

	QUnit.test("Constructor - defaultValue", function(assert) {
		var oSmartLink = new SmartLink();

		// assert
		assert.equal(oSmartLink.getSemanticObject(), "");
		assert.deepEqual(oSmartLink.getAdditionalSemanticObjects(), []);
		assert.equal(oSmartLink.getSemanticObjectController(), null);
		assert.equal(oSmartLink.getFieldName(), "");
		assert.equal(oSmartLink.getSemanticObjectLabel(), "");
		assert.equal(oSmartLink.getCreateControlCallback(), null);
		assert.equal(oSmartLink.getMapFieldToSemanticObject(), true);
		assert.equal(oSmartLink.getContactAnnotationPath(), undefined);
		assert.equal(oSmartLink.getIgnoreLinkRendering(), false);
		assert.equal(oSmartLink.getEnableAvailableActionsPersonalization(), true);
		assert.equal(oSmartLink.getUom(), undefined);

		// cleanup
		oSmartLink.destroy();
	});

	QUnit.test("Constructor", function(assert) {
		var oSmartLink = new SmartLink({
			semanticObject: "TestObject",
			additionalSemanticObjects: [
				"TestObjectAdditional"
			],
			semanticObjectController: new SemanticObjectController(),
			fieldName: "FieldName",
			semanticObjectLabel: "Name",
			createControlCallback: function() {
				return new Text({
					text: "Link"
				});
			},
			mapFieldToSemanticObject: true,
			contactAnnotationPath: "",
			ignoreLinkRendering: true
		});

		// assert
		assert.equal(oSmartLink.getContactAnnotationPath(), "");

		// cleanup
		oSmartLink.destroy();
	});

	QUnit.test("Constructor", function(assert) {
		var oSmartLink = new SmartLink();
		oSmartLink._createNavigationPopoverHandler();

		oSmartLink.setSemanticObject("TestObject");
		oSmartLink.setAdditionalSemanticObjects([
			"TestObjectAdditional"
		]);
		oSmartLink.setSemanticObjectController(new SemanticObjectController());
		oSmartLink.setFieldName("FieldName");
		oSmartLink.setSemanticObjectLabel("Name");
		oSmartLink.setCreateControlCallback(function() {
			return new Text({
				text: "Link"
			});
		});
		oSmartLink.setMapFieldToSemanticObject(true);
		oSmartLink.setContactAnnotationPath("");
		oSmartLink.setIgnoreLinkRendering(true);

		// assert
		assert.equal(oSmartLink.getContactAnnotationPath(), "");

		// cleanup
		oSmartLink.destroy();
	});

	QUnit.test("setSemanticObjectController - via constructor", function(assert) {
		// system under test
		var oSemanticObjectController;
		var oSmartLink = new SmartLink({
			semanticObjectController: oSemanticObjectController = new SemanticObjectController(),
			fieldName: "Test Field",
			text: "Test Text"
		});

		// arrange
		assert.ok(oSemanticObjectController._aRegisteredControls.indexOf(oSmartLink) > -1);

		// cleanup
		oSmartLink.destroy();
	});

	QUnit.test("setSemanticObjectController - via setter method", function(assert) {
		// system under test
		var oSmartLink = new SmartLink({
			fieldName: "Test Field",
			text: "Test Text"
		});

		// arrange
		var oSemanticObjectController1 = new SemanticObjectController();
		var oSemanticObjectController2 = new SemanticObjectController();

		// act
		oSmartLink.setSemanticObjectController(oSemanticObjectController1);
		// assert
		assert.ok(oSemanticObjectController1._aRegisteredControls.indexOf(oSmartLink) > -1);

		// act
		oSmartLink.setSemanticObjectController(oSemanticObjectController2);
		// assert
		assert.ok(oSemanticObjectController1._aRegisteredControls.indexOf(oSmartLink) === -1);
		assert.ok(oSemanticObjectController2._aRegisteredControls.indexOf(oSmartLink) > -1);

		// cleanup
		oSmartLink.destroy();
	});

	QUnit.test("Check setFieldName", function(assert) {
		// system under test
		var oSemanticObjectController;
		var oSmartLink = new SmartLink({
			semanticObjectController: oSemanticObjectController = new SemanticObjectController(),
			fieldName: "Test Field",
			text: "Test Text"
		});

		// arrange
		var fnGetIgnoredFieldsSpy = sinon.spy(oSemanticObjectController, "getIgnoredFields");

		// act
		oSmartLink.setFieldName("dummy");

		// assert
		var done = assert.async();
		SemanticObjectController.getDistinctSemanticObjects().then(function() {

			assert.ok(fnGetIgnoredFieldsSpy.called);
			done();

			// cleanup
			oSmartLink.destroy();
		});
	});

	QUnit.test("getSemanticObjectController", function(assert) {
		// system under test
		var oSemanticObjectController;
		var oSmartLink = new SmartLink({
			text: "Link",
			innerControl: new Text({
				text: "No Link"
			}),
			semanticObjectController: oSemanticObjectController = new SemanticObjectController()
		});

		// 1. arrange, act and assert
		assert.equal(oSmartLink.getSemanticObjectController(), oSemanticObjectController);

		// 2. arrange
		oSmartLink.setSemanticObjectController(null);
		// act and assert
		assert.equal(oSmartLink.getSemanticObjectController(), null);

		/*// 3. arrange
		var oParentStub = sinon.stub();
		oParentStub.getSemanticObjectController = sinon.stub().returns(oSemanticObjectController);
		oParentStub._removeChild = sinon.stub();
		oSmartLink.getParent = sinon.stub().returns(oParentStub);

		oSmartLink.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();
		// act and assert
		assert.equal(oSmartLink.getSemanticObjectController(), oSemanticObjectController, "getter should find parent semanticObjectController");*/

		// cleanup
		oSmartLink.destroy();
		oSemanticObjectController.destroy();
	});

	QUnit.test("Check _getInnerControl", function(assert) {
		// system under test
		var oSmartLink = new SmartLink({
			fieldName: "Test Field",
			text: "Test Text"
		});

		// assert
		assert.ok(!oSmartLink._getInnerControl());

		var oSetInnerControl = new Control();
		var iCallbackCount = 0;
		oSmartLink.setCreateControlCallback(function() {
			iCallbackCount++;
			return oSetInnerControl;
		});

		var oInnerControl = oSmartLink._getInnerControl();
		assert.ok(oInnerControl === oSetInnerControl, "correct innercontrol should have been returned");
		assert.equal(iCallbackCount, 1, "callback should have been called once");

		oInnerControl = oSmartLink._getInnerControl();
		assert.ok(oInnerControl === oSetInnerControl, "correct innercontrol should have been returned");
		assert.equal(iCallbackCount, 1, "callback should have been called once only");

		// cleanup
		oSmartLink.destroy();
	});

	QUnit.test("innerControl", function(assert) {
		// system under test
		var oSmartLink = new SmartLink({
			text: "Link",
			ignoreLinkRendering: true,
			innerControl: new Text({
				text: "No Link"
			})
		});

		// arrange
		var done = assert.async();

		// act
		oSmartLink.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		SemanticObjectController.getDistinctSemanticObjects().then(function() {
			// assert
			assert.equal(oSmartLink.$().find("span")[0].textContent, "No Link");

			done();

			// cleanup
			oSmartLink.destroy();
		});
	});

	QUnit.test("test getInnerControlValue function", function(assert) {
		// system under test
		var oSmartLink = new SmartLink({
			fieldName: "Test Field",
			text: "Test Text"
		});
		var oInnerValue = oSmartLink.getInnerControlValue();
		assert.equal(oInnerValue, "Test Text", "no inner control, return SmartLink text");

		oSmartLink._getInnerControl = function() {
			return {
				getText: function() {
					return "Test Text";
				}
			};
		};

		oSmartLink.setIgnoreLinkRendering(true);
		oInnerValue = oSmartLink.getInnerControlValue();
		assert.equal(oInnerValue, "Test Text", "inner control provided text");

		oSmartLink._getInnerControl = function() {
			return {
				getValue: function() {
					return "Test Value";
				}
			};
		};

		oInnerValue = oSmartLink.getInnerControlValue();
		assert.equal(oInnerValue, "Test Value", "inner control provided value");

		// cleanup
		oSmartLink.destroy();
	});

	QUnit.test("onBeforeRendering", function(assert) {
		// system under test
		var oSmartLink = new SmartLink({
			semanticObject: "TestObject",
			text: "Test Text",
			innerControl: new Text({
				text: "No Link"
			})
		});

		// arrange
		var done = assert.async();
		oSmartLink.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		oSmartLink.setIgnoreLinkRendering(true);

		SemanticObjectController.getDistinctSemanticObjects().then(function() {

			// assert
			assert.equal(oSmartLink.getEnabled(), false);

			done();

			// cleanup
			oSmartLink.destroy();
		});
	});

	QUnit.test("onBeforeRendering", function(assert) {
		// system under test
		var oSmartLink = new SmartLink({
			semanticObject: "TestObject",
			fieldName: "Test Field",
			text: "Test Text"
		});

		// arrange
		var done = assert.async();
		oSmartLink.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		oSmartLink.setIgnoreLinkRendering(false);

		SemanticObjectController.getDistinctSemanticObjects().then(function() {

			// assert
			assert.equal(oSmartLink.getEnabled(), true);

			done();

			// cleanup
			oSmartLink.destroy();
		});
	});

	QUnit.test("test exit function", function(assert) {
		// system under test
		var oSmartLink = new SmartLink({
			fieldName: "Test Field",
			text: "Test Text"
		});

		var oSemanticObjectController = new SemanticObjectController();

		oSmartLink.setSemanticObjectController(oSemanticObjectController);
		assert.equal(oSemanticObjectController._aRegisteredControls.length, 1, "1 control should be registered at the SemanticObjectController");

		oSmartLink.exit();
		assert.equal(oSemanticObjectController._aRegisteredControls.length, 0, "0 controls should be registered at the SemanticObjectController after exit");

		// cleanup
		oSmartLink.destroy();
	});

	QUnit.test("BCP 1670108744 - order of constructor's attributes", function(assert) {
		// system under test

		// arrange
		var done = assert.async();
		var oSemanticObjectController = new SemanticObjectController();

		var oSmartLink = new SmartLink({
			// first create and set semanticObjectController
			semanticObjectController: oSemanticObjectController,
			// and then set semanticObject
			semanticObject: "TestObject",
			fieldName: "DataField",
			text: "Test Text"
		});

		oSemanticObjectController.attachPrefetchDone(function() {
			// assertions
			assert.equal(oSmartLink.getIgnoreLinkRendering(), false);

			done();

			// cleanup
			oSemanticObjectController.destroy();
			oSmartLink.destroy();
		});

		// act
		oSemanticObjectController.setPrefetchNavigationTargets(true);
	});

	QUnit.test("BCP 1670197747 - render of sap.m.Link", function(assert) {
		// system under test
		var oSmartLink = new SmartLink({
			text: "Link",
			ignoreLinkRendering: true,
			innerControl: new Text({
				text: "No Link"
			})
		});

		// arrange
		oSmartLink.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// assert
		assert.equal(jQuery("#qunit-fixture").find("a").length, 0);

		// cleanup
		oSmartLink.destroy();
	});

	QUnit.test("BCP 1670197747 - render of sap.m.Link", function(assert) {
		// system under test
		var oSmartLink = new SmartLink({
			text: "Link",
			ignoreLinkRendering: false
		});

		// arrange
		oSmartLink.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// assert
		assert.equal(jQuery("#qunit-fixture").find("a").length, 1);

		// cleanup
		oSmartLink.destroy();
	});

	QUnit.test("Disabled link should not be clickable", function(assert) {
		// system under test
		var oSmartLink = new SmartLink({
			text: "Link",
			ignoreLinkRendering: true,
			innerControl: new Text({
				text: "No Link"
			})
		});

		// arrange
		var done = assert.async();

		// act
		oSmartLink.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// assert
		SemanticObjectController.getDistinctSemanticObjects().then(function() {

			assert.equal(oSmartLink.getEnabled(), false);

			done();

			// cleanup
			oSmartLink.destroy();
		});
	});

	QUnit.module("sap.ui.comp.navpopover.SmartLink", {
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
				}
			});
			this.oSmartLink = new SmartLink({
				semanticObject: "TestObject"
			});
		},
		afterEach: function() {
			this.oSmartLink.destroy();
			FakeFlpConnector.disableFakeConnector();
			SemanticObjectController.destroyDistinctSemanticObjects();
		}
	});
	QUnit.test("setIgnoreLinkRendering", function(assert) {
		// act
		this.oSmartLink.setIgnoreLinkRendering(undefined);

		// assertions
		var done = assert.async();
		SemanticObjectController.getDistinctSemanticObjects().then(function() {
			assert.equal(this.oSmartLink.getEnabled(), true);
			done();
		}.bind(this));
	});
	QUnit.test("setIgnoreLinkRendering", function(assert) {
		// act
		this.oSmartLink.setIgnoreLinkRendering(false);

		// assert
		var done = assert.async();
		SemanticObjectController.getDistinctSemanticObjects().then(function() {
			assert.equal(this.oSmartLink.getEnabled(), true);
			done();
		}.bind(this));
	});
	QUnit.test("setIgnoreLinkRendering", function(assert) {
		// act
		this.oSmartLink.setIgnoreLinkRendering(true);

		// assert
		var done = assert.async();
		SemanticObjectController.getDistinctSemanticObjects().then(function() {
			assert.equal(this.oSmartLink.getEnabled(), false);
			done();
		}.bind(this));
	});

	QUnit.module("sap.ui.comp.navpopover.SmartLink", {
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
				}
			});
		},
		afterEach: function() {
			this.oSmartLink.destroy();
			FakeFlpConnector.disableFakeConnector();
			SemanticObjectController.destroyDistinctSemanticObjects();
		}
	});
	QUnit.test("setSemanticObject - default", function(assert) {
		// act
		this.oSmartLink = new SmartLink();

		// assert
		var done = assert.async();
		SemanticObjectController.getDistinctSemanticObjects().then(function() {
			assert.equal(this.oSmartLink.getEnabled(), false);
			done();
		}.bind(this));
	});

	QUnit.test("setSemanticObject - invalid semanticObject", function(assert) {
		// act
		this.oSmartLink = new SmartLink({
			semanticObject: "dummy"
		});

		// assert
		var done = assert.async();
		SemanticObjectController.getDistinctSemanticObjects().then(function() {
			assert.equal(this.oSmartLink.getEnabled(), false);
			done();
		}.bind(this));
	});

	QUnit.test("setSemanticObject - valid semanticObject", function(assert) {
		// act
		this.oSmartLink = new SmartLink({
			semanticObject: "TestObject"
		});

		// assert
		var done = assert.async();
		SemanticObjectController.getDistinctSemanticObjects().then(function() {
			assert.equal(this.oSmartLink.getEnabled(), true);
			done();
		}.bind(this));
	});

	QUnit.test("setSemanticObject - async", function(assert) {
		// act
		this.oSmartLink = new SmartLink({
			semanticObject: "TestObject"
		});
		this.oSmartLink.setSemanticObject(null);

		// assert
		var done = assert.async();
		SemanticObjectController.getDistinctSemanticObjects().then(function() {
			assert.equal(this.oSmartLink.getEnabled(), false);
			done();
		}.bind(this));
	});

	QUnit.test("enabled - with contactAnnotationPath", function(assert) {

		// act
		this.oSmartLink = new SmartLink({
			semanticObject: "Dummy",
			contactAnnotationPath: "to_Supplier"
		});

		// assert
		var done = assert.async();
		SemanticObjectController.getDistinctSemanticObjects().then(function() {
			assert.equal(this.oSmartLink.getEnabled(), true);
			done();
		}.bind(this));
	});

	QUnit.test("Rendering of UoM", function(assert) {
		this.oSmartLink = new SmartLink({
			semanticObject: "TestObject",
			text: "123"
		//uom: "JPY"
		});
		this.oSmartLink.placeAt("qunit-fixture");

		// act
		sap.ui.getCore().applyChanges();
		// assert
		assert.equal(this.oSmartLink.$().find("span").length, 0);

		// act
		this.oSmartLink.setUom("JPY");
		sap.ui.getCore().applyChanges();
		// assert
		assert.equal(this.oSmartLink.$().find("span").length, 2);
	});

	QUnit.start();
});
