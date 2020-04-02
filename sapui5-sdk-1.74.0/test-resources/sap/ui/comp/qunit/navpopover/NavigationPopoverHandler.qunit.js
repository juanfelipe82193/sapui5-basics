/*globals QUnit, sinon*/

QUnit.config.autostart = false;

sap.ui.define([
	"sap/base/Log", "sap/ui/comp/navpopover/FakeFlpConnector", "sap/ui/core/UIComponent", "sap/ui/core/Control", "sap/ui/comp/navpopover/SmartLink", "sap/ui/comp/navpopover/NavigationPopoverHandler", "sap/ui/comp/navpopover/SemanticObjectController", "sap/ui/comp/navpopover/LinkData", "sap/ui/comp/smarttable/SmartTable", "sap/ui/table/Table", "sap/ui/table/Column", "sap/m/Button", "sap/ui/layout/form/SimpleForm", "sap/ui/core/Title", "sap/m/Text", "sap/m/VBox", "sap/m/Label"

], function(Log, FakeFlpConnector, UIComponent, Control, SmartLink, NavigationPopoverHandler, SemanticObjectController, LinkData, SmartTable, Table, Column, Button, SimpleForm, Title, Text, VBox, Label) {
	"use strict";

	QUnit.module("sap.ui.comp.navpopover.NavigationPopoverHandler", {
		beforeEach: function() {
			Log.setLevel(Log.Level.TRACE);
			FakeFlpConnector.enableFakeConnector({
				TestObject: {
					links: [
						{
							action: "displayFactSheet",
							intent: "?TestObject#/dummyLink1",
							text: "Fact Sheet"
						}, {
							action: "anyAction",
							intent: "?TestObject#/dummyLink2",
							text: "List"
						}
					]
				},
				TestObjectNoDisplayFactSheet: {
					links: [
						{
							action: "anyAction01",
							intent: "?TestObjectNoDisplayFactSheet#/anyAction01",
							text: "List1"
						}, {
							action: "anyAction02",
							intent: "?TestObjectNoDisplayFactSheet#/anyAction02",
							text: "List2"
						}
					]
				},
				TestObject2: {
					links: [
						{
							action: "displayFactSheet",
							intent: "?TestObject2#/dummyLink3",
							text: "Fact Sheet"
						}, {
							action: "anyAction",
							intent: "?TestObject2#/dummyLink4",
							text: "List2"
						}
					]
				},
				TestObject12: {
					links: [
						{
							action: "displayFactSheet",
							intent: "?TestObject12#/dummyLink0",
							text: "Fact Sheet"
						}, {
							action: "anyAction",
							intent: "?TestObject12#/dummyLink1",
							text: "List1"
						}, {
							action: "anyAction",
							intent: "?TestObject12#/dummyLink2",
							text: "List2"
						}, {
							action: "anyAction",
							intent: "?TestObject12#/dummyLink3",
							text: "List3"
						}, {
							action: "anyAction",
							intent: "?TestObject12#/dummyLink4",
							text: "List4"
						}, {
							action: "anyAction",
							intent: "?TestObject12#/dummyLink5",
							text: "List5"
						}, {
							action: "anyAction",
							intent: "?TestObject12#/dummyLink6",
							text: "List6"
						}, {
							action: "anyAction",
							intent: "?TestObject12#/dummyLink7",
							text: "List7"
						}, {
							action: "anyAction",
							intent: "?TestObject12#/dummyLink8",
							text: "List8"
						}, {
							action: "anyAction",
							intent: "?TestObject12#/dummyLink9",
							text: "List9"
						}, {
							action: "anyAction",
							intent: "?TestObject12#/dummyLink10",
							text: "List10"
						}, {
							action: "anyAction",
							intent: "?TestObject12#/dummyLink11",
							text: "List11"
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

	var fPrepareBinding = function(oNavigationPopoverHandler, oContext) {
		var oBindingContextStub = sinon.stub();
		oBindingContextStub.getObject = sinon.stub().returns(oContext);
		oBindingContextStub.getPath = sinon.stub().returns(oNavigationPopoverHandler.getFieldName ? oNavigationPopoverHandler.getFieldName() : "dummy");
		oNavigationPopoverHandler.getBindingContext = sinon.stub().returns(oBindingContextStub);

		var oBindingStub = sinon.stub();
		oBindingStub.getPath = sinon.stub().withArgs("text").returns(oNavigationPopoverHandler.getFieldName ? oNavigationPopoverHandler.getFieldName() : "dummy");
		oNavigationPopoverHandler.getBinding = sinon.stub().returns(oBindingStub);
	};

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(new NavigationPopoverHandler());
	});

	QUnit.test("Empty constructor - defalut values", function(assert) {
		var oNavigationPopoverHandler = new NavigationPopoverHandler();

		assert.equal(oNavigationPopoverHandler.getContactAnnotationPath(), undefined);
	});

	QUnit.test("constructor", function(assert) {
		// act
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject",
			fieldName: "fieldA"
		});

		// assert
		assert.equal(oNavigationPopoverHandler.getSemanticObject(), "TestObject");
		assert.deepEqual(oNavigationPopoverHandler.getAdditionalSemanticObjects(), []);
		assert.equal(oNavigationPopoverHandler.getSemanticObjectController(), null);
		assert.equal(oNavigationPopoverHandler.getFieldName(), "fieldA");
		assert.equal(oNavigationPopoverHandler.getSemanticObjectLabel(), "");
		assert.equal(oNavigationPopoverHandler.getMapFieldToSemanticObject(), true);
		assert.deepEqual(oNavigationPopoverHandler._getSemanticAttributes()[oNavigationPopoverHandler.getSemanticObject()], {});
		assert.deepEqual(oNavigationPopoverHandler.getContactAnnotationPath(), undefined);
		assert.deepEqual(oNavigationPopoverHandler.getEnableAvailableActionsPersonalization(), true);
		assert.equal(oNavigationPopoverHandler.getControl(), null);

		assert.equal(oNavigationPopoverHandler._oPopover, null);

		// cleanup
		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("enableAvailableActionsPersonalization: true", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject",
			control: oButton,
			enableAvailableActionsPersonalization: true
		});

		// arrange
		var done = assert.async();
		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		var fnAfterOpen = function(oEvent) {
			var oPopover = oEvent.getSource();

			// assert
			assert.ok(oPopover._getContentContainer().$().find("span").length > 0);
			var bFound = false;
			oPopover._getContentContainer().$().find("span").each(function(iIndex) {
				if (oPopover._getContentContainer().$().find("span")[iIndex].textContent === sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_DEFINE_LINKS")) {
					bFound = true;
				}
			});
			assert.ok(bFound);
			assert.equal(oPopover._getContentContainer().$().find("a").length, 2);
			assert.equal(oPopover._getContentContainer().$().find("button").length, 1);

			// cleanup
			done();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		};

		// act
		oNavigationPopoverHandler._getPopover().then(function(oPopover) {
			oPopover.attachAfterOpen(fnAfterOpen);
			oNavigationPopoverHandler.openPopover();
		});
	});

	QUnit.test("enableAvailableActionsPersonalization: false", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject",
			control: oButton,
			enableAvailableActionsPersonalization: false
		});

		// arrange
		var done = assert.async();
		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		var fnAfterOpen = function(oEvent) {
			var oPopover = oEvent.getSource();

			// assert
			assert.ok(oPopover._getContentContainer().$().find("span").length > 0);
			var bFound = false;
			oPopover._getContentContainer().$().find("span").each(function(iIndex) {
				if (oPopover._getContentContainer().$().find("span")[iIndex].textContent === sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_DEFINE_LINKS")) {
					bFound = true;
				}
			});
			assert.notOk(bFound);
			assert.equal(oPopover._getContentContainer().$().find("a").length, 2);
			assert.equal(oPopover._getContentContainer().$().find("button").length, 0);

			// cleanup
			done();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		};

		// act
		oNavigationPopoverHandler._getPopover().then(function(oPopover) {
			oPopover.attachAfterOpen(fnAfterOpen);
			oNavigationPopoverHandler.openPopover();
		});
	});

	QUnit.test("enableAvailableActionsPersonalization: false changing to true", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject",
			control: oButton,
			enableAvailableActionsPersonalization: false
		});

		// arrange
		var done = assert.async();
		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		var fnAfterOpen = function(oEvent) {
			var oPopover = oEvent.getSource();

			// assert
			assert.ok(oPopover._getContentContainer().$().find("span").length > 0);
			var bFound = false;
			oPopover._getContentContainer().$().find("span").each(function(iIndex) {
				if (oPopover._getContentContainer().$().find("span")[iIndex].textContent === sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_DEFINE_LINKS")) {
					bFound = true;
				}
			});
			assert.ok(bFound);
			assert.equal(oPopover._getContentContainer().$().find("a").length, 2);
			assert.equal(oPopover._getContentContainer().$().find("button").length, 1);

			// cleanup
			done();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		};

		oNavigationPopoverHandler._getPopover().then(function(oPopover) {
			oPopover.attachAfterOpen(fnAfterOpen);

			// act
			oNavigationPopoverHandler.setEnableAvailableActionsPersonalization(true);
			oNavigationPopoverHandler._oPopover._getContentContainer().rerender();

			oNavigationPopoverHandler.openPopover();
		});
	});

	QUnit.test("semanticObject", function(assert) {




		// system under test
		var oSmartLink = new SmartLink({
			text: "Link",
			fieldName: "fieldA",
			semanticObject: "TestObject"
		});
		var oNavigationPopoverHandler = oSmartLink._createNavigationPopoverHandler();

		// arrange
		var done = assert.async();
		oSmartLink.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		var fnAfterOpen1 = function(oEvent) {
			var oPopover = oEvent.getSource();

			// assert
			assert.equal(oPopover.$().find("a")[0].text, "Link");
			assert.equal(oPopover.$().find("a")[1].text, "List");

			oPopover.close();
			oSmartLink.setSemanticObject("TestObject2");
			oNavigationPopoverHandler._getPopover().then(function(oPopover) {
				oPopover.attachAfterOpen(function(oEvent) {
					var oPopover = oEvent.getSource();

					// assert
					assert.equal(oPopover.$().find("a")[0].text, "Link");
					assert.equal(oPopover.$().find("a")[1].text, "List2");

					done();

					// cleanup
					oSmartLink.destroy();
				});
				oPopover.show();
			});
		};

		// act
		oNavigationPopoverHandler._getPopover().then(function(oPopover) {
			oPopover.attachAfterOpen(fnAfterOpen1);
			oPopover.show();
		});
	});

	QUnit.test("_createPopover: without context", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject",
			fieldName: "fieldZ",
			control: oButton
		});

		// arrange
		var done = assert.async();
		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		oNavigationPopoverHandler._getPopover().then(function(oPopover) {

			// assert
			// ---- NavigationPopoverHandler ------------
			assert.equal(oNavigationPopoverHandler.getSemanticObject(), "TestObject");
			assert.deepEqual(oNavigationPopoverHandler.getAdditionalSemanticObjects(), []);
			assert.equal(oNavigationPopoverHandler.getSemanticObjectController(), null);
			assert.equal(oNavigationPopoverHandler.getFieldName(), "fieldZ");
			assert.equal(oNavigationPopoverHandler.getSemanticObjectLabel(), "");
			assert.equal(oNavigationPopoverHandler.getMapFieldToSemanticObject(), true);
			assert.deepEqual(oNavigationPopoverHandler._getSemanticAttributes()[oNavigationPopoverHandler.getSemanticObject()], {});
			assert.deepEqual(oNavigationPopoverHandler.getContactAnnotationPath(), undefined);
			assert.deepEqual(oNavigationPopoverHandler.getEnableAvailableActionsPersonalization(), true);
			assert.equal(oNavigationPopoverHandler.getControl(), oButton.getId());

			// ---- Popover ------------
			assert.ok(oPopover);
			assert.equal(oPopover.getSemanticObjectName(), "TestObject");
			assert.deepEqual(oPopover.getSemanticAttributes()[oNavigationPopoverHandler.getSemanticObject()], {});
			assert.equal(oPopover.getAppStateKey(), "");
			assert.equal(oPopover.getMainNavigationId(), "");
			assert.ok(oPopover.$().find("span").length === 0);
			assert.deepEqual(oPopover.getAvailableActions(), []);
			assert.deepEqual(oPopover.getMainNavigation(), null);
			assert.deepEqual(oPopover.getOwnNavigation(), null);
			assert.deepEqual(oPopover.getSource(), oButton.getId());
			assert.deepEqual(oPopover.getExtraContent(), null);
			assert.deepEqual(oPopover.getComponent(), null);
			assert.deepEqual(oPopover.getModel("$sapuicompNavigationPopover").getProperty("/availableActions"), []);
			assert.equal(oPopover.getModel("$sapuicompNavigationPopover").getProperty("/mainNavigationLink/title"), undefined);

			// ---- NavigationContainer ------------
			assert.ok(oPopover._getContentContainer());
			assert.equal(oPopover._getContentContainer().getMainNavigationId(), "");
			assert.equal(oPopover._getContentContainer().$().find("span").length, 0);
			assert.equal(oPopover._getContentContainer().getEnableAvailableActionsPersonalization(), true);
			assert.deepEqual(oPopover._getContentContainer().getAvailableActions().length, 1);
			assert.equal(oPopover._getContentContainer().getAvailableActions()[0].getText(), "List");
			assert.equal(oPopover._getContentContainer().getAvailableActions()[0].getHref(), "?TestObject#/dummyLink2");
			assert.equal(oPopover._getContentContainer().getAvailableActions()[0].getVisible(), true);
			assert.equal(oPopover._getContentContainer().getMainNavigation().getText(), sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_FACTSHEET"));
			assert.equal(oPopover._getContentContainer().getMainNavigation().getHref(), "?TestObject#/dummyLink1");
			assert.equal(oPopover._getContentContainer().getMainNavigation().getVisible(), true);
			assert.deepEqual(oPopover._getContentContainer().getExtraContent(), null);
			assert.deepEqual(oPopover._getContentContainer().getComponent(), null);
			assert.equal(oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), "List");
			assert.equal(oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/href"), "?TestObject#/dummyLink2");
			assert.equal(oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), true);
			assert.equal(oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/title"), sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_FACTSHEET"));
			assert.equal(oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/subtitle"), undefined);
			assert.equal(oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/href"), "?TestObject#/dummyLink1");

			// cleanup
			done();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		});
	});

	QUnit.test("_createPopover: field not in context", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject",
			fieldName: "fieldZ",
			control: oButton
		});

		// arrange
		var done = assert.async();
		fPrepareBinding(oNavigationPopoverHandler, {
			fieldA: "valueA",
			fieldB: null,
			fieldC: "valueC",
			__metadata: {
				"blabla": "blabla"
			}
		});

		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		oNavigationPopoverHandler._getPopover().then(function(oPopover) {

			// assert
			// ---- NavigationPopoverHandler ------------
			assert.equal(oNavigationPopoverHandler.getSemanticObject(), "TestObject");
			assert.deepEqual(oNavigationPopoverHandler.getAdditionalSemanticObjects(), []);
			assert.equal(oNavigationPopoverHandler.getSemanticObjectController(), null);
			assert.equal(oNavigationPopoverHandler.getFieldName(), "fieldZ");
			assert.equal(oNavigationPopoverHandler.getSemanticObjectLabel(), "");
			assert.equal(oNavigationPopoverHandler.getMapFieldToSemanticObject(), true);
			assert.deepEqual(oNavigationPopoverHandler._getSemanticAttributes()[oNavigationPopoverHandler.getSemanticObject()], {
				fieldA: "valueA",
				fieldC: "valueC"
			});
			assert.deepEqual(oNavigationPopoverHandler.getContactAnnotationPath(), undefined);
			assert.deepEqual(oNavigationPopoverHandler.getEnableAvailableActionsPersonalization(), true);
			assert.equal(oNavigationPopoverHandler.getControl(), oButton.getId());

			// ---- Popover ------------
			assert.ok(oPopover);
			assert.equal(oPopover.getSemanticObjectName(), "TestObject");
			assert.deepEqual(oPopover.getSemanticAttributes()[oNavigationPopoverHandler.getSemanticObject()], {
				fieldA: "valueA",
				fieldC: "valueC"
			});
			assert.equal(oPopover.getAppStateKey(), "");
			assert.equal(oPopover.getMainNavigationId(), "");
			assert.deepEqual(oPopover.getAvailableActions(), []);
			assert.deepEqual(oPopover.getMainNavigation(), null);
			assert.deepEqual(oPopover.getOwnNavigation(), null);
			assert.deepEqual(oPopover.getSource(), oButton.getId());
			assert.deepEqual(oPopover.getExtraContent(), null);
			assert.deepEqual(oPopover.getComponent(), null);
			assert.deepEqual(oPopover.getModel("$sapuicompNavigationPopover").getProperty("/availableActions"), []);
			assert.equal(oPopover.getModel("$sapuicompNavigationPopover").getProperty("/mainNavigationLink/title"), undefined);

			// ---- NavigationContainer ------------
			assert.ok(oPopover._getContentContainer());
			assert.equal(oPopover._getContentContainer().getMainNavigationId(), "");
			assert.equal(oPopover._getContentContainer().$().find("span").length, 0);
			assert.equal(oPopover._getContentContainer().getEnableAvailableActionsPersonalization(), true);
			assert.deepEqual(oPopover._getContentContainer().getAvailableActions().length, 1);
			assert.equal(oPopover._getContentContainer().getAvailableActions()[0].getText(), "List");
			assert.equal(oPopover._getContentContainer().getAvailableActions()[0].getHref(), "?TestObject#/dummyLink2");
			assert.equal(oPopover._getContentContainer().getAvailableActions()[0].getVisible(), true);
			assert.equal(oPopover._getContentContainer().getMainNavigation().getText(), sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_FACTSHEET"));
			assert.equal(oPopover._getContentContainer().getMainNavigation().getHref(), "?TestObject#/dummyLink1");
			assert.equal(oPopover._getContentContainer().getMainNavigation().getVisible(), true);
			assert.deepEqual(oPopover._getContentContainer().getExtraContent(), null);
			assert.deepEqual(oPopover._getContentContainer().getComponent(), null);
			assert.equal(oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), "List");
			assert.equal(oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/href"), "?TestObject#/dummyLink2");
			assert.equal(oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), true);
			assert.equal(oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/title"), sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_FACTSHEET"));
			assert.equal(oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/subtitle"), undefined);
			assert.equal(oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/href"), "?TestObject#/dummyLink1");

			// cleanup
			done();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		});
	});

	QUnit.test("_createPopover: field in context", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject",
			fieldName: "fieldA",
			control: oButton
		});

		// arrange
		var done = assert.async();
		fPrepareBinding(oNavigationPopoverHandler, {
			fieldA: "valueA",
			fieldB: null,
			fieldC: "valueC",
			__metadata: {
				"blabla": "blabla"
			}
		});

		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		oNavigationPopoverHandler._getPopover().then(function(oPopover) {

			// assert
			// ---- NavigationPopoverHandler ------------
			assert.equal(oNavigationPopoverHandler.getSemanticObject(), "TestObject");
			assert.deepEqual(oNavigationPopoverHandler.getAdditionalSemanticObjects(), []);
			assert.equal(oNavigationPopoverHandler.getSemanticObjectController(), null);
			assert.equal(oNavigationPopoverHandler.getFieldName(), "fieldA");
			assert.equal(oNavigationPopoverHandler.getSemanticObjectLabel(), "");
			assert.equal(oNavigationPopoverHandler.getMapFieldToSemanticObject(), true);
			assert.deepEqual(oNavigationPopoverHandler._getSemanticAttributes()[oNavigationPopoverHandler.getSemanticObject()], {
				TestObject: "valueA",
				fieldC: "valueC"
			});
			assert.deepEqual(oNavigationPopoverHandler.getContactAnnotationPath(), undefined);
			assert.deepEqual(oNavigationPopoverHandler.getEnableAvailableActionsPersonalization(), true);
			assert.equal(oNavigationPopoverHandler.getControl(), oButton.getId());

			// ---- Popover ------------
			assert.ok(oPopover);
			assert.equal(oPopover.getSemanticObjectName(), "TestObject");
			assert.deepEqual(oPopover.getSemanticAttributes()[oNavigationPopoverHandler.getSemanticObject()], {
				TestObject: "valueA",
				fieldC: "valueC"
			});
			assert.equal(oPopover.getAppStateKey(), "");
			assert.equal(oPopover.getMainNavigationId(), "");
			assert.deepEqual(oPopover.getAvailableActions(), []);
			assert.deepEqual(oPopover.getMainNavigation(), null);
			assert.deepEqual(oPopover.getOwnNavigation(), null);
			assert.deepEqual(oPopover.getSource(), oButton.getId());
			assert.deepEqual(oPopover.getExtraContent(), null);
			assert.deepEqual(oPopover.getComponent(), null);
			assert.deepEqual(oPopover.getModel("$sapuicompNavigationPopover").getProperty("/availableActions"), []);
			assert.equal(oPopover.getModel("$sapuicompNavigationPopover").getProperty("/mainNavigationLink/title"), undefined);

			// ---- NavigationContainer ------------
			assert.ok(oPopover._getContentContainer());
			assert.equal(oPopover._getContentContainer().getMainNavigationId(), "valueA");
			assert.equal(oPopover._getContentContainer().$().find("span").length, 0);
			assert.equal(oPopover._getContentContainer().getEnableAvailableActionsPersonalization(), true);
			assert.deepEqual(oPopover._getContentContainer().getAvailableActions().length, 1);
			assert.equal(oPopover._getContentContainer().getAvailableActions()[0].getText(), "List");
			assert.equal(oPopover._getContentContainer().getAvailableActions()[0].getHref(), "?TestObject#/dummyLink2");
			assert.equal(oPopover._getContentContainer().getAvailableActions()[0].getVisible(), true);
			assert.equal(oPopover._getContentContainer().getMainNavigation().getText(), sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_FACTSHEET"));
			assert.equal(oPopover._getContentContainer().getMainNavigation().getHref(), "?TestObject#/dummyLink1");
			assert.equal(oPopover._getContentContainer().getMainNavigation().getVisible(), true);
			assert.deepEqual(oPopover._getContentContainer().getExtraContent(), null);
			assert.deepEqual(oPopover._getContentContainer().getComponent(), null);
			assert.equal(oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), "List");
			assert.equal(oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/href"), "?TestObject#/dummyLink2");
			assert.equal(oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), true);
			assert.equal(oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/title"), "valueA", "mainNavigationId has higher prio then 'text' of mainNavigation");
			assert.equal(oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/subtitle"), undefined);
			assert.equal(oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/href"), "?TestObject#/dummyLink1");

			// cleanup
			done();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		});
	});

	QUnit.test("_getPopover: 1 mainNavigation and 11 availableAction", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject12",
			fieldName: "fieldA",
			control: oButton
		});

		// arrange
		var done = assert.async();
		fPrepareBinding(oNavigationPopoverHandler, {
			fieldA: "valueA",
			fieldC: "valueC"
		});

		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		oNavigationPopoverHandler._getPopover().then(function(oPopover) {

			// assert
			// ---- NavigationPopoverHandler ------------
			assert.equal(oNavigationPopoverHandler.getSemanticObject(), "TestObject12");
			assert.deepEqual(oNavigationPopoverHandler.getAdditionalSemanticObjects(), []);
			assert.equal(oNavigationPopoverHandler.getSemanticObjectController(), null);
			assert.equal(oNavigationPopoverHandler.getFieldName(), "fieldA");
			assert.equal(oNavigationPopoverHandler.getSemanticObjectLabel(), "");
			assert.equal(oNavigationPopoverHandler.getMapFieldToSemanticObject(), true);
			assert.deepEqual(oNavigationPopoverHandler._getSemanticAttributes()[oNavigationPopoverHandler.getSemanticObject()], {
				TestObject12: "valueA",
				fieldC: "valueC"
			});
			assert.deepEqual(oNavigationPopoverHandler.getContactAnnotationPath(), undefined);
			assert.deepEqual(oNavigationPopoverHandler.getEnableAvailableActionsPersonalization(), true);
			assert.equal(oNavigationPopoverHandler.getControl(), oButton.getId());

			// ---- Popover ------------
			assert.ok(oPopover);
			assert.equal(oPopover.getSemanticObjectName(), "TestObject12");
			assert.deepEqual(oPopover.getSemanticAttributes()[oNavigationPopoverHandler.getSemanticObject()], {
				TestObject12: "valueA",
				fieldC: "valueC"
			});
			assert.equal(oPopover.getAppStateKey(), "");
			assert.equal(oPopover.getMainNavigationId(), "");
			assert.deepEqual(oPopover.getAvailableActions(), []);
			assert.deepEqual(oPopover.getMainNavigation(), null);
			assert.deepEqual(oPopover.getOwnNavigation(), null);
			assert.deepEqual(oPopover.getSource(), oButton.getId());
			assert.deepEqual(oPopover.getExtraContent(), null);
			assert.deepEqual(oPopover.getComponent(), null);
			assert.deepEqual(oPopover.getModel("$sapuicompNavigationPopover").getProperty("/availableActions"), []);
			assert.equal(oPopover.getModel("$sapuicompNavigationPopover").getProperty("/mainNavigationLink/title"), undefined);

			// ---- NavigationContainer ------------
			assert.ok(oPopover._getContentContainer());
			assert.equal(oPopover._getContentContainer().getMainNavigationId(), "valueA");
			assert.equal(oPopover._getContentContainer().$().find("span").length, 0);
			assert.equal(oPopover._getContentContainer().getEnableAvailableActionsPersonalization(), true);
			assert.deepEqual(oPopover._getContentContainer().getAvailableActions().length, 11);
			assert.equal(oPopover._getContentContainer().getAvailableActions()[0].getText(), "List1");
			assert.equal(oPopover._getContentContainer().getAvailableActions()[0].getHref(), "?TestObject12#/dummyLink1");
			assert.equal(oPopover._getContentContainer().getAvailableActions()[0].getVisible(), false);
			assert.equal(oPopover._getContentContainer().getMainNavigation().getText(), sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_FACTSHEET"));
			assert.equal(oPopover._getContentContainer().getMainNavigation().getHref(), "?TestObject12#/dummyLink0");
			assert.equal(oPopover._getContentContainer().getMainNavigation().getVisible(), true);
			assert.deepEqual(oPopover._getContentContainer().getExtraContent(), null);
			assert.deepEqual(oPopover._getContentContainer().getComponent(), null);
			assert.equal(oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), "List1");
			assert.equal(oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/href"), "?TestObject12#/dummyLink1");
			assert.equal(oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), false);
			assert.equal(oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/title"), "valueA", "mainNavigationId has higher prio then 'text' of mainNavigation");
			assert.equal(oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/subtitle"), undefined);
			assert.equal(oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/href"), "?TestObject12#/dummyLink0");

			// cleanup
			done();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		});
	});

	QUnit.test("openPopover: empty content", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "Dummy",
			fieldName: "fieldA",
			control: oButton
		});

		// arrange
		var done = assert.async();
		fPrepareBinding(oNavigationPopoverHandler, {
			fieldA: "valueA"
		});
		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		oNavigationPopoverHandler.openPopover().then(function() {

			// assert
			assert.ok(oNavigationPopoverHandler._oPopover, "also without content, NavigationPopover should be created");

			// cleanup
			done();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		});
	});

	QUnit.test("openPopover: 'beforePopoverOpens' handler", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject",
			fieldName: "fieldA",
			control: oButton
		});

		// arrange
		var done = assert.async();
		var fnFireBeforePopoverOpensSpy = sinon.spy(oNavigationPopoverHandler, "fireBeforePopoverOpens");
		var fnFireNavigationTargetsObtainedSpy = sinon.spy(oNavigationPopoverHandler, "fireNavigationTargetsObtained");
		var fnFireInnerNavigateSpy = sinon.spy(oNavigationPopoverHandler, "fireInnerNavigate");

		fPrepareBinding(oNavigationPopoverHandler, {
			fieldA: "valueA"
		});

		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		oNavigationPopoverHandler.attachBeforePopoverOpens(function(oEvent) {

			// assert
			assert.equal(Object.keys(oEvent.getParameters()).length, 7);
			assert.equal(oEvent.getParameters().semanticObject, "TestObject");
			assert.deepEqual(oEvent.getParameters().semanticAttributes, {
				TestObject: "valueA"
			});
			assert.deepEqual(oEvent.getParameters().semanticAttributesOfSemanticObjects, {
				"": {
					TestObject: "valueA"
				},
				TestObject: {
					TestObject: "valueA"
				}
			});
			assert.equal(oEvent.getParameters().originalId, oButton.getId());
			assert.ok(oEvent.getParameters().setSemanticAttributes);
			assert.ok(oEvent.getParameters().setAppStateKey);
			assert.ok(oEvent.getParameters().open);

			oEvent.getParameters().open();
		});

		// act
		oNavigationPopoverHandler.openPopover().then(function() {

			// assert
			assert.ok(fnFireBeforePopoverOpensSpy.calledOnce);
			assert.ok(!fnFireNavigationTargetsObtainedSpy.called);
			assert.ok(!fnFireInnerNavigateSpy.called);

			// cleanup
			done();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		});
	});

	QUnit.test("openPopover - 'beforePopoverOpens' handler with modifying data, no context", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject",
			fieldName: "fieldA",
			control: oButton
		});

		// arrange
		var done = assert.async();
		var fnFireBeforePopoverOpensSpy = sinon.spy(oNavigationPopoverHandler, "fireBeforePopoverOpens");
		var fnFireNavigationTargetsObtainedSpy = sinon.spy(oNavigationPopoverHandler, "fireNavigationTargetsObtained");
		var fnFireInnerNavigateSpy = sinon.spy(oNavigationPopoverHandler, "fireInnerNavigate");

		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		oNavigationPopoverHandler.attachBeforePopoverOpens(function(oEvent) {

			// assert
			assert.equal(Object.keys(oEvent.getParameters()).length, 7);
			assert.equal(oEvent.getParameters().semanticObject, "TestObject");
			assert.deepEqual(oEvent.getParameters().semanticAttributes, null);
			assert.deepEqual(oEvent.getParameters().semanticAttributesOfSemanticObjects, null);
			assert.ok(oEvent.getParameters().originalId);

			oEvent.getParameters().setAppStateKey("MyAppKey");
			oEvent.getParameters().setSemanticAttributes({
				TestObject: "valueTestObject"
			});
			oEvent.getParameters().open();
		});

		// act
		oNavigationPopoverHandler.openPopover().then(function() {

			// assert
			assert.ok(fnFireBeforePopoverOpensSpy.calledOnce);
			assert.ok(!fnFireNavigationTargetsObtainedSpy.called);
			assert.ok(!fnFireInnerNavigateSpy.called);

			// ---- NavigationPopoverHandler ------------
			assert.equal(oNavigationPopoverHandler.getSemanticObject(), "TestObject");
			assert.deepEqual(oNavigationPopoverHandler.getAdditionalSemanticObjects(), []);
			assert.equal(oNavigationPopoverHandler.getSemanticObjectController(), null);
			assert.equal(oNavigationPopoverHandler.getFieldName(), "fieldA");
			assert.equal(oNavigationPopoverHandler.getSemanticObjectLabel(), "");
			assert.equal(oNavigationPopoverHandler.getMapFieldToSemanticObject(), true);
			assert.deepEqual(oNavigationPopoverHandler._getSemanticAttributes()[oNavigationPopoverHandler.getSemanticObject()], {
				TestObject: "valueTestObject"
			});
			assert.deepEqual(oNavigationPopoverHandler.getContactAnnotationPath(), undefined);
			assert.deepEqual(oNavigationPopoverHandler.getEnableAvailableActionsPersonalization(), true);
			assert.equal(oNavigationPopoverHandler.getControl(), oButton.getId());

			// ---- Popover ------------
			assert.ok(oNavigationPopoverHandler._oPopover);
			assert.equal(oNavigationPopoverHandler._oPopover.getSemanticObjectName(), "TestObject");
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getSemanticAttributes()[oNavigationPopoverHandler.getSemanticObject()], {
				TestObject: "valueTestObject"
			});
			assert.equal(oNavigationPopoverHandler._oPopover.getAppStateKey(), "MyAppKey");
			assert.equal(oNavigationPopoverHandler._oPopover.getMainNavigationId(), "");
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getAvailableActions(), []);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getMainNavigation(), null);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getOwnNavigation(), null);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getSource(), oButton.getId());
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getExtraContent(), null);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getComponent(), null);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getModel("$sapuicompNavigationPopover").getProperty("/availableActions"), []);
			assert.equal(oNavigationPopoverHandler._oPopover.getModel("$sapuicompNavigationPopover").getProperty("/mainNavigationLink/title"), undefined);

			// ---- NavigationContainer ------------
			assert.ok(oNavigationPopoverHandler._oPopover._getContentContainer());
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getMainNavigationId(), "valueTestObject");
			assert.ok(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("span").length > 0);
			var bFound = false;
			oNavigationPopoverHandler._oPopover._getContentContainer().$().find("span").each(function(iIndex) {
				if (oNavigationPopoverHandler._oPopover._getContentContainer().$().find("span")[iIndex].textContent === sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_DEFINE_LINKS")) {
					bFound = true;
				}
			});
			assert.ok(bFound);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getEnableAvailableActionsPersonalization(), true);
			assert.deepEqual(oNavigationPopoverHandler._oPopover._getContentContainer().getAvailableActions().length, 1);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getAvailableActions()[0].getText(), "List");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getAvailableActions()[0].getHref(), "?TestObject#/dummyLink2");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getAvailableActions()[0].getVisible(), true);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getMainNavigation().getText(), sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_FACTSHEET"));
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getMainNavigation().getHref(), "?TestObject#/dummyLink1");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getMainNavigation().getVisible(), true);
			assert.deepEqual(oNavigationPopoverHandler._oPopover._getContentContainer().getExtraContent(), null);
			assert.deepEqual(oNavigationPopoverHandler._oPopover._getContentContainer().getComponent(), null);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), "List");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/href"), "?TestObject#/dummyLink2");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), true);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/title"), "valueTestObject", "mainNavigationId has higher prio then 'text' of mainNavigation");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/subtitle"), undefined);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/href"), "?TestObject#/dummyLink1");

			// cleanup
			done();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		});
	});

	QUnit.test("openPopover - 'beforePopoverOpens' handler with modifying data, with context", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject",
			fieldName: "fieldA",
			control: oButton
		});

		// arrange
		var done = assert.async();
		var fnFireBeforePopoverOpensSpy = sinon.spy(oNavigationPopoverHandler, "fireBeforePopoverOpens");
		var fnFireNavigationTargetsObtainedSpy = sinon.spy(oNavigationPopoverHandler, "fireNavigationTargetsObtained");
		var fnFireInnerNavigateSpy = sinon.spy(oNavigationPopoverHandler, "fireInnerNavigate");

		fPrepareBinding(oNavigationPopoverHandler, {
			fieldA: "valueA"
		});

		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		oNavigationPopoverHandler.attachBeforePopoverOpens(function(oEvent) {

			// assert
			assert.equal(Object.keys(oEvent.getParameters()).length, 7);
			assert.equal(oEvent.getParameters().semanticObject, "TestObject");
			assert.deepEqual(oEvent.getParameters().semanticAttributes, {
				TestObject: "valueA"
			});
			assert.deepEqual(oEvent.getParameters().semanticAttributesOfSemanticObjects, {
				"": {
					TestObject: "valueA"
				},
				TestObject: {
					TestObject: "valueA"
				}
			});
			assert.ok(oEvent.getParameters().originalId);

			oEvent.getParameters().setAppStateKey("MyAppKey");
			oEvent.getParameters().setSemanticAttributes({
				TestObject: "valueTestObject"
			});
			oEvent.getParameters().open();
		});

		// act
		oNavigationPopoverHandler.openPopover().then(function() {
			// assert
			assert.ok(fnFireBeforePopoverOpensSpy.calledOnce);
			assert.ok(!fnFireNavigationTargetsObtainedSpy.called);
			assert.ok(!fnFireInnerNavigateSpy.called);

			// ---- NavigationPopoverHandler ------------
			assert.equal(oNavigationPopoverHandler.getSemanticObject(), "TestObject");
			assert.deepEqual(oNavigationPopoverHandler.getAdditionalSemanticObjects(), []);
			assert.equal(oNavigationPopoverHandler.getSemanticObjectController(), null);
			assert.equal(oNavigationPopoverHandler.getFieldName(), "fieldA");
			assert.equal(oNavigationPopoverHandler.getSemanticObjectLabel(), "");
			assert.equal(oNavigationPopoverHandler.getMapFieldToSemanticObject(), true);
			assert.deepEqual(oNavigationPopoverHandler._getSemanticAttributes()[oNavigationPopoverHandler.getSemanticObject()], {
				TestObject: "valueTestObject"
			});
			assert.deepEqual(oNavigationPopoverHandler.getContactAnnotationPath(), undefined);
			assert.deepEqual(oNavigationPopoverHandler.getEnableAvailableActionsPersonalization(), true);
			assert.equal(oNavigationPopoverHandler.getControl(), oButton.getId());

			// ---- Popover ------------
			assert.ok(oNavigationPopoverHandler._oPopover);
			assert.equal(oNavigationPopoverHandler._oPopover.getSemanticObjectName(), "TestObject");
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getSemanticAttributes()[oNavigationPopoverHandler.getSemanticObject()], {
				TestObject: "valueTestObject"
			});
			assert.equal(oNavigationPopoverHandler._oPopover.getAppStateKey(), "MyAppKey");
			assert.equal(oNavigationPopoverHandler._oPopover.getMainNavigationId(), "");
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getAvailableActions(), []);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getMainNavigation(), null);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getOwnNavigation(), null);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getSource(), oButton.getId());
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getExtraContent(), null);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getComponent(), null);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getModel("$sapuicompNavigationPopover").getProperty("/availableActions"), []);
			assert.equal(oNavigationPopoverHandler._oPopover.getModel("$sapuicompNavigationPopover").getProperty("/mainNavigationLink/title"), undefined);

			// ---- NavigationContainer ------------
			assert.ok(oNavigationPopoverHandler._oPopover._getContentContainer());
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getMainNavigationId(), "valueTestObject");
			assert.ok(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("span").length > 0);
			var bFound = false;
			oNavigationPopoverHandler._oPopover._getContentContainer().$().find("span").each(function(iIndex) {
				if (oNavigationPopoverHandler._oPopover._getContentContainer().$().find("span")[iIndex].textContent === sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_DEFINE_LINKS")) {
					bFound = true;
				}
			});
			assert.ok(bFound);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getEnableAvailableActionsPersonalization(), true);
			assert.deepEqual(oNavigationPopoverHandler._oPopover._getContentContainer().getAvailableActions().length, 1);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getAvailableActions()[0].getText(), "List");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getAvailableActions()[0].getHref(), "?TestObject#/dummyLink2");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getAvailableActions()[0].getVisible(), true);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getMainNavigation().getText(), sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_FACTSHEET"));
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getMainNavigation().getHref(), "?TestObject#/dummyLink1");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getMainNavigation().getVisible(), true);
			assert.deepEqual(oNavigationPopoverHandler._oPopover._getContentContainer().getExtraContent(), null);
			assert.deepEqual(oNavigationPopoverHandler._oPopover._getContentContainer().getComponent(), null);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), "List");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/href"), "?TestObject#/dummyLink2");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), true);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/title"), "valueTestObject", "mainNavigationId has higher prio then 'text' of mainNavigation");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/subtitle"), undefined);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/href"), "?TestObject#/dummyLink1");

			// cleanup
			done();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		});
	});

	QUnit.test("openPopover - called twice sequential", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject",
			control: oButton
		});

		// arrange
		var done1 = assert.async();
		var done2 = assert.async();
		sinon.spy(oNavigationPopoverHandler, "_initModel");
		sinon.spy(oNavigationPopoverHandler, "_createPopover");

		oNavigationPopoverHandler.getNavigationPopoverStableId = sinon.stub().returns("IDStable");

		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		oNavigationPopoverHandler.openPopover().then(function() {

			// assert
			assert.ok(oNavigationPopoverHandler._oPopover.getDomRef());

			done1();
		});

		oNavigationPopoverHandler.openPopover().then(function() {

			// assert
			assert.ok(oNavigationPopoverHandler._oPopover.getDomRef());

			// cleanup
			done2();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		});
	});

	QUnit.test("openPopover - called twice hierarchical", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject",
			control: oButton
		});

		// arrange
		var done = assert.async();
		var fnInitModelSpy = sinon.spy(oNavigationPopoverHandler, "_initModel");
		var fnCreatePopoverSpy = sinon.spy(oNavigationPopoverHandler, "_createPopover");

		oNavigationPopoverHandler.getNavigationPopoverStableId = sinon.stub().returns("IDStable");

		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		oNavigationPopoverHandler.openPopover().then(function() {
			oNavigationPopoverHandler.openPopover().then(function() {

				// assert
				assert.equal(fnInitModelSpy.callCount, 1);
				assert.equal(fnCreatePopoverSpy.callCount, 1);

				// cleanup
				done();
				oNavigationPopoverHandler.destroy();
				oButton.destroy();
			});
		});
	});

	QUnit.test("openPopover: field in context", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject",
			fieldName: "fieldA",
			control: oButton
		});

		// arrange
		var done = assert.async();

		fPrepareBinding(oNavigationPopoverHandler, {
			fieldA: "valueA"
		});

		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		var fnAfterOpen = function(oEvent) {
			var oPopover = oEvent.getSource();

			// assert
			assert.equal(oPopover._getContentContainer().$().find("a")[0].text, "valueA");
			assert.ok(oPopover._getContentContainer().$().find("a")[0].href.indexOf("?TestObject#/dummyLink1") > -1);
			assert.equal(oPopover._getContentContainer().$().find("a")[1].text, "List");
			assert.ok(oPopover._getContentContainer().$().find("a")[1].href.indexOf("?TestObject#/dummyLink2") > -1);
			assert.equal(oPopover._getContentContainer().$().find("button")[0].textContent, sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_DEFINE_LINKS"));

			// cleanup
			done();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		};

		// act
		oNavigationPopoverHandler._getPopover().then(function(oPopover) {
			oPopover.attachAfterOpen(fnAfterOpen);
			oNavigationPopoverHandler.openPopover();
		});
	});

	QUnit.test("openPopover: 'navigationTargetsObtained' handler", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject",
			fieldName: "fieldA",
			control: oButton
		});

		// arrange
		var done = assert.async();
		var fnFireBeforePopoverOpensSpy = sinon.spy(oNavigationPopoverHandler, "fireBeforePopoverOpens");
		var fnFireNavigationTargetsObtainedSpy = sinon.spy(oNavigationPopoverHandler, "fireNavigationTargetsObtained");
		var fnFireInnerNavigateSpy = sinon.spy(oNavigationPopoverHandler, "fireInnerNavigate");

		fPrepareBinding(oNavigationPopoverHandler, {
			fieldA: "valueA"
		});

		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		oNavigationPopoverHandler.attachNavigationTargetsObtained(function(oEvent) {

			// assert
			assert.equal(Object.keys(oEvent.getParameters()).length, 8);
			assert.ok(oEvent.getParameters().mainNavigation);
			assert.ok(oEvent.getParameters().actions);
			assert.equal(oEvent.getParameters().ownNavigation, undefined);
			assert.ok(oEvent.getParameters().popoverForms);
			assert.equal(oEvent.getParameters().semanticObject, "TestObject");
			assert.deepEqual(oEvent.getParameters().semanticAttributes, {
				TestObject: "valueA"
			});
			assert.ok(oEvent.getParameters().originalId);

			oEvent.getParameters().show();
		});

		// act
		oNavigationPopoverHandler.openPopover().then(function() {

			// assert
			assert.ok(!fnFireBeforePopoverOpensSpy.called);
			assert.ok(fnFireNavigationTargetsObtainedSpy.calledOnce);
			assert.ok(!fnFireInnerNavigateSpy.called);

			// cleanup
			done();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		});
	});

	QUnit.test("openPopover: 'navigationTargetsObtained' handler with modifying data", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject",
			fieldName: "fieldA",
			control: oButton
		});

		// arrange
		var done = assert.async();
		var fnFireBeforePopoverOpensSpy = sinon.spy(oNavigationPopoverHandler, "fireBeforePopoverOpens");
		var fnFireNavigationTargetsObtainedSpy = sinon.spy(oNavigationPopoverHandler, "fireNavigationTargetsObtained");
		var fnFireInnerNavigateSpy = sinon.spy(oNavigationPopoverHandler, "fireInnerNavigate");
		var oMainLink, aLinks, oContext;

		fPrepareBinding(oNavigationPopoverHandler, {
			fieldA: "valueA"
		});

		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		oNavigationPopoverHandler.attachNavigationTargetsObtained(function(oEvent) {
			oEvent.getParameters().show("MainLinkTitle", oMainLink = new LinkData({
				key: "ApplicationSpecificFactSheet_01",
				href: "#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
				text: "Application Specific Fact Sheet",
				target: "_blank"
			}), aLinks = [
				new LinkData({
					key: "ApplicationSpecificLink_01",
					href: "#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
					text: "Application Specific Link",
					target: "_blank"
				})
			], oContext = new SimpleForm({
				maxContainerCols: 1,
				content: [
					new Title({
						text: "Detailed information"
					}), new Text({
						text: "By pressing on the links below a new browser window with image of product will be opened."
					})
				]
			}));
		});

		// act
		oNavigationPopoverHandler.openPopover().then(function() {

			// assert
			assert.ok(!fnFireBeforePopoverOpensSpy.called);
			assert.ok(fnFireNavigationTargetsObtainedSpy.calledOnce);
			assert.ok(!fnFireInnerNavigateSpy.called);

			// ---- NavigationPopoverHandler ------------
			assert.equal(oNavigationPopoverHandler.getSemanticObject(), "TestObject");
			assert.deepEqual(oNavigationPopoverHandler.getAdditionalSemanticObjects(), []);
			assert.equal(oNavigationPopoverHandler.getSemanticObjectController(), null);
			assert.equal(oNavigationPopoverHandler.getFieldName(), "fieldA");
			assert.equal(oNavigationPopoverHandler.getSemanticObjectLabel(), "");
			assert.equal(oNavigationPopoverHandler.getMapFieldToSemanticObject(), true);
			assert.deepEqual(oNavigationPopoverHandler._getSemanticAttributes()[oNavigationPopoverHandler.getSemanticObject()], {
				TestObject: "valueA"
			});
			assert.deepEqual(oNavigationPopoverHandler.getContactAnnotationPath(), undefined);
			assert.deepEqual(oNavigationPopoverHandler.getEnableAvailableActionsPersonalization(), true);
			assert.equal(oNavigationPopoverHandler.getControl(), oButton.getId());

			// ---- Popover ------------
			assert.ok(oNavigationPopoverHandler._oPopover);
			assert.equal(oNavigationPopoverHandler._oPopover.getSemanticObjectName(), "TestObject");
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getSemanticAttributes()[oNavigationPopoverHandler.getSemanticObject()], {
				TestObject: "valueA"
			});
			assert.equal(oNavigationPopoverHandler._oPopover.getAppStateKey(), "");
			assert.equal(oNavigationPopoverHandler._oPopover.getMainNavigationId(), "");
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getAvailableActions(), []);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getMainNavigation(), null);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getOwnNavigation(), null);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getSource(), oButton.getId());
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getExtraContent(), null);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getComponent(), null);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getModel("$sapuicompNavigationPopover").getProperty("/availableActions"), []);
			assert.equal(oNavigationPopoverHandler._oPopover.getModel("$sapuicompNavigationPopover").getProperty("/mainNavigationLink/title"), undefined);

			// ---- NavigationContainer ------------
			assert.ok(oNavigationPopoverHandler._oPopover._getContentContainer());
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getMainNavigationId(), "MainLinkTitle");
			assert.ok(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("span").length > 0);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getEnableAvailableActionsPersonalization(), true);
			assert.deepEqual(oNavigationPopoverHandler._oPopover._getContentContainer().getAvailableActions().length, aLinks.length);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getAvailableActions()[0].getText(), aLinks[0].getText());
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getAvailableActions()[0].getHref(), aLinks[0].getHref());
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getAvailableActions()[0].getTarget(), aLinks[0].getTarget());
			assert.deepEqual(oNavigationPopoverHandler._oPopover._getContentContainer().getMainNavigation(), oMainLink);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getExtraContent(), oContext.getId());
			assert.deepEqual(oNavigationPopoverHandler._oPopover._getContentContainer().getComponent(), null);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), aLinks[0].getText());
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/href"), aLinks[0].getHref());
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/target"), aLinks[0].getTarget());
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/title"), "MainLinkTitle");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/subtitle"), undefined);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/href"), oMainLink.getHref());

			// cleanup
			done();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		});
	});

	QUnit.test("openPopover: 'navigationTargetsObtained' with 3 parameters - modify case", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject",
			fieldName: "fieldA",
			control: oButton
		});

		// arrange
		var done = assert.async();
		var oMainLink, aLinks, oContext;

		fPrepareBinding(oNavigationPopoverHandler, {
			fieldA: "valueA"
		});

		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		oNavigationPopoverHandler.attachNavigationTargetsObtained(function(oEvent) {
			oEvent.getParameters().show(oMainLink = new LinkData({
				key: "ApplicationSpecificFactSheet_01",
				href: "#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
				text: "Application Specific Fact Sheet",
				target: "_blank"
			}), aLinks = [
				new LinkData({
					key: "ApplicationSpecificLink_01",
					href: "#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
					text: "Application Specific Link",
					target: "_blank"
				})
			], oContext = new SimpleForm({
				maxContainerCols: 1,
				content: [
					new Title({
						text: "Detailed information"
					}), new Text({
						text: "By pressing on the links below a new browser window with image of product will be opened."
					})
				]
			}));
		});

		// act
		oNavigationPopoverHandler.openPopover().then(function() {

			// assert
			// ---- Popover ------------
			assert.ok(oNavigationPopoverHandler._oPopover);
			assert.equal(oNavigationPopoverHandler._oPopover.getSemanticObjectName(), "TestObject");
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getSemanticAttributes()[oNavigationPopoverHandler.getSemanticObject()], {
				TestObject: "valueA"
			});
			assert.equal(oNavigationPopoverHandler._oPopover.getAppStateKey(), "");
			assert.equal(oNavigationPopoverHandler._oPopover.getMainNavigationId(), "");
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getAvailableActions(), []);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getMainNavigation(), null);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getOwnNavigation(), null);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getSource(), oButton.getId());
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getExtraContent(), null);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getComponent(), null);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getModel("$sapuicompNavigationPopover").getProperty("/availableActions"), []);
			assert.equal(oNavigationPopoverHandler._oPopover.getModel("$sapuicompNavigationPopover").getProperty("/mainNavigationLink/title"), undefined);

			// ---- NavigationContainer ------------
			assert.ok(oNavigationPopoverHandler._oPopover._getContentContainer());
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getMainNavigationId(), "valueA");
			assert.ok(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("span").length > 0);
			var bFound = false;
			oNavigationPopoverHandler._oPopover._getContentContainer().$().find("span").each(function(iIndex) {
				if (oNavigationPopoverHandler._oPopover._getContentContainer().$().find("span")[iIndex].textContent === sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_DEFINE_LINKS")) {
					bFound = true;
				}
			});
			assert.ok(bFound);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getEnableAvailableActionsPersonalization(), true);
			assert.deepEqual(oNavigationPopoverHandler._oPopover._getContentContainer().getAvailableActions().length, aLinks.length);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getAvailableActions()[0].getText(), aLinks[0].getText());
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getAvailableActions()[0].getHref(), aLinks[0].getHref());
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getAvailableActions()[0].getTarget(), aLinks[0].getTarget());
			assert.deepEqual(oNavigationPopoverHandler._oPopover._getContentContainer().getMainNavigation(), oMainLink);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getExtraContent(), oContext.getId());
			assert.deepEqual(oNavigationPopoverHandler._oPopover._getContentContainer().getComponent(), null);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), aLinks[0].getText());
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/href"), aLinks[0].getHref());
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/target"), aLinks[0].getTarget());
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/title"), "valueA");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/subtitle"), undefined);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/href"), oMainLink.getHref());

			// cleanup
			done();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		});
	});

	QUnit.test("openPopover: 'navigationTargetsObtained' with 3 parameters - delete case", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject",
			fieldName: "fieldA",
			control: oButton
		});

		// arrange
		var done = assert.async();

		fPrepareBinding(oNavigationPopoverHandler, {
			fieldA: "valueA"
		});

		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		oNavigationPopoverHandler.attachNavigationTargetsObtained(function(oEvent) {
			oEvent.getParameters().show(null, [], null);
		});

		// act
		oNavigationPopoverHandler.openPopover().then(function() {

			// assert
			// ---- Popover ------------
			assert.ok(oNavigationPopoverHandler._oPopover);

			assert.equal(oNavigationPopoverHandler.getModel("$sapuicompNavigationPopoverHandler").getProperty("/mainNavigationId"), "valueA");
			assert.deepEqual(oNavigationPopoverHandler.getModel("$sapuicompNavigationPopoverHandler").getProperty("/availableActions"), []);
			assert.deepEqual(oNavigationPopoverHandler.getModel("$sapuicompNavigationPopoverHandler").getProperty("/navigationTarget/mainNavigation"), null);
			assert.deepEqual(oNavigationPopoverHandler.getModel("$sapuicompNavigationPopoverHandler").getProperty("/navigationTarget/extraContent"), undefined);

			// cleanup
			done();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		});
	});

	QUnit.test("openPopover: 'navigationTargetsObtained' with 3 parameters - leave it as it is", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject",
			fieldName: "fieldA",
			control: oButton
		});

		// arrange
		var done = assert.async();

		fPrepareBinding(oNavigationPopoverHandler, {
			fieldA: "valueA"
		});

		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		oNavigationPopoverHandler.attachNavigationTargetsObtained(function(oEvent) {
			oEvent.getParameters().show(undefined, undefined, undefined);
		});

		// act
		oNavigationPopoverHandler.openPopover().then(function() {

			// assert
			// ---- Popover ------------
			assert.ok(oNavigationPopoverHandler._oPopover);
			assert.equal(oNavigationPopoverHandler._oPopover.getSemanticObjectName(), "TestObject");
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getSemanticAttributes()[oNavigationPopoverHandler.getSemanticObject()], {
				TestObject: "valueA"
			});
			assert.equal(oNavigationPopoverHandler._oPopover.getAppStateKey(), "");
			assert.equal(oNavigationPopoverHandler._oPopover.getMainNavigationId(), "");
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getAvailableActions(), []);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getMainNavigation(), null);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getOwnNavigation(), null);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getSource(), oButton.getId());
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getExtraContent(), null);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getComponent(), null);
			assert.deepEqual(oNavigationPopoverHandler._oPopover.getModel("$sapuicompNavigationPopover").getProperty("/availableActions"), []);
			assert.equal(oNavigationPopoverHandler._oPopover.getModel("$sapuicompNavigationPopover").getProperty("/mainNavigationLink/title"), undefined);

			// ---- NavigationContainer ------------
			assert.ok(oNavigationPopoverHandler._oPopover._getContentContainer());
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getMainNavigationId(), "valueA");
			assert.ok(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("span").length > 0);
			var bFound = false;
			oNavigationPopoverHandler._oPopover._getContentContainer().$().find("span").each(function(iIndex) {
				if (oNavigationPopoverHandler._oPopover._getContentContainer().$().find("span")[iIndex].textContent === sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_DEFINE_LINKS")) {
					bFound = true;
				}
			});
			assert.ok(bFound);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getEnableAvailableActionsPersonalization(), true);
			assert.deepEqual(oNavigationPopoverHandler._oPopover._getContentContainer().getAvailableActions().length, 1);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getAvailableActions()[0].getText(), "List");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getAvailableActions()[0].getHref(), "?TestObject#/dummyLink2");
			assert.deepEqual(oNavigationPopoverHandler._oPopover._getContentContainer().getMainNavigation().getText(), sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_FACTSHEET"));
			assert.deepEqual(oNavigationPopoverHandler._oPopover._getContentContainer().getMainNavigation().getHref(), "?TestObject#/dummyLink1");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getExtraContent(), null);
			assert.deepEqual(oNavigationPopoverHandler._oPopover._getContentContainer().getComponent(), null);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), "List");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/href"), "?TestObject#/dummyLink2");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/target"), "");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/title"), "valueA");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/subtitle"), undefined);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getModel("$sapuicompNavigationContainer").getProperty("/mainNavigationLink/href"), "?TestObject#/dummyLink1");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("a")[0].text, "valueA");
			assert.ok(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("a")[0].href.indexOf("?TestObject#/dummyLink1") > -1);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("a")[1].text, "List");
			assert.ok(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("a")[1].href.indexOf("?TestObject#/dummyLink2") > -1);

			// cleanup
			done();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		});
	});

	/*QUnit.test("XXX", function(assert) {
	 // system under test
	 var oButton = new Button({
	 text: "button"
	 });
	 var oNavigationPopoverHandler = new NavigationPopoverHandler({
	 semanticObject: "TestObject",
	 fieldName: "fieldA",
	 control: oButton
	 });

	 // arrange
	 var done = assert.async();
	 fPrepareBinding(oNavigationPopoverHandler, {
	 fieldA: "valueA",
	 fieldB: null,
	 fieldC: "valueC",
	 __metadata: {"blabla": "blabla"}
	 });
	 oNavigationPopoverHandler._createPopover();

	 oButton.placeAt("qunit-fixture");
	 sap.ui.getCore().applyChanges();

	 // act
	 oNavigationPopoverHandler.openPopover().then(function() {
	 // assert
	 assert.ok(true);

	 done();
	 });

	 // cleanup
	 oNavigationPopoverHandler.destroy();
	 oButton.destroy();
	 });*/

	QUnit.test("setFieldName - should trigger _calculateSemanticAttributes", function(assert) {
		// system under test
		var oNavigationPopoverHandler = new NavigationPopoverHandler();

		// arrange
		var fnCalculateSemanticAttributesSpy = sinon.spy(oNavigationPopoverHandler, "_calculateSemanticAttributes");

		// act
		oNavigationPopoverHandler.setFieldName("dummy");

		// assert
		assert.ok(fnCalculateSemanticAttributesSpy.calledOnce);

		// cleanup
		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("Title of Mainlink: enabled sap.m.Link, text = 'fieldName' value of bindingContext", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject",
			fieldName: "fieldA",
			control: oButton
		});

		// arrange
		var done = assert.async();

		fPrepareBinding(oNavigationPopoverHandler, {
			fieldA: "valueA"
		});

		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		oNavigationPopoverHandler.openPopover().then(function() {

			// assert
			// ---- Popover ------------
			assert.ok(oNavigationPopoverHandler._oPopover.getDomRef());
			assert.equal(oNavigationPopoverHandler._oPopover.getMainNavigationId(), "");

			// ---- NavigationContainer ------------
			assert.ok(oNavigationPopoverHandler._oPopover._getContentContainer().getDomRef());
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getMainNavigationId(), "valueA");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("a")[0].text, "valueA");
			assert.ok(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("a")[0].href.indexOf("?TestObject#/dummyLink1") > -1);
			assert.equal(jQuery(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("a")[0]).control()[0].getText(), "valueA");
			assert.equal(jQuery(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("a")[0]).control()[0].getHref(), "?TestObject#/dummyLink1");
			assert.equal(jQuery(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("a")[0]).control()[0].getEnabled(), true);

			// cleanup
			done();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		});
	});

	QUnit.test("Title of Mainlink: disabled sap.m.Link, text = 'fieldName' value of bindingContext", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObjectNoDisplayFactSheet",
			fieldName: "fieldA",
			control: oButton
		});

		// arrange
		var done = assert.async();

		fPrepareBinding(oNavigationPopoverHandler, {
			fieldA: "valueA"
		});

		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		oNavigationPopoverHandler.openPopover().then(function() {

			// assert
			// ---- Popover ------------
			assert.ok(oNavigationPopoverHandler._oPopover.getDomRef());
			assert.equal(oNavigationPopoverHandler._oPopover.getMainNavigationId(), "");

			// ---- NavigationContainer ------------
			assert.ok(oNavigationPopoverHandler._oPopover._getContentContainer().getDomRef());
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getMainNavigationId(), "valueA");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("a")[0].text, "valueA");
			assert.equal(jQuery(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("a")[0]).control()[0].getText(), "valueA");
			assert.equal(jQuery(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("a")[0]).control()[0].getHref(), "");
			assert.equal(jQuery(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("a")[0]).control()[0].getEnabled(), false);

			// cleanup
			done();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		});
	});

	QUnit.test("Title of Mainlink: enabled sap.m.Link, text = 'Display Fact Sheet'", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject",
			fieldName: "fieldZ",
			control: oButton
		});

		// arrange
		var done = assert.async();

		fPrepareBinding(oNavigationPopoverHandler, {
			fieldA: "valueA"
		});

		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		oNavigationPopoverHandler.openPopover().then(function() {

			// assert
			// ---- Popover ------------
			assert.ok(oNavigationPopoverHandler._oPopover.getDomRef());
			assert.equal(oNavigationPopoverHandler._oPopover.getMainNavigationId(), "");

			// ---- NavigationContainer ------------
			assert.ok(oNavigationPopoverHandler._oPopover._getContentContainer().getDomRef());
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getMainNavigationId(), "");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("a")[0].text, sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_FACTSHEET"));
			assert.ok(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("a")[0].href.indexOf("?TestObject#/dummyLink1") > -1);
			assert.equal(jQuery(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("a")[0]).control()[0].getText(), sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_FACTSHEET"));
			assert.equal(jQuery(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("a")[0]).control()[0].getHref(), "?TestObject#/dummyLink1");
			assert.equal(jQuery(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("a")[0]).control()[0].getEnabled(), true);

			// cleanup
			done();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		});
	});

	QUnit.test("Subtitle of Mainlink", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject",
			fieldName: "fieldA",
			control: oButton,
			navigationTargetsObtained: function(oEvent) {
				var oMainNavigation = oEvent.getParameters().mainNavigation;
				oMainNavigation.setDescription("MySubtitle");
				oEvent.getParameters().show(undefined, oMainNavigation, undefined, undefined);
			}
		});

		// arrange
		var done = assert.async();

		fPrepareBinding(oNavigationPopoverHandler, {
			fieldA: "valueA"
		});

		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		oNavigationPopoverHandler.openPopover().then(function() {

			// assert
			// ---- Popover ------------
			assert.ok(oNavigationPopoverHandler._oPopover.getDomRef());
			assert.equal(oNavigationPopoverHandler._oPopover.getMainNavigationId(), "");

			// ---- NavigationContainer ------------
			assert.ok(oNavigationPopoverHandler._oPopover._getContentContainer().getDomRef());
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().getMainNavigationId(), "valueA");
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("a")[0].text, "valueA");
			assert.ok(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("a")[0].href.indexOf("?TestObject#/dummyLink1") > -1);
			assert.equal(jQuery(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("a")[0]).control()[0].getText(), "valueA");
			assert.equal(jQuery(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("a")[0]).control()[0].getHref(), "?TestObject#/dummyLink1");
			assert.equal(jQuery(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("a")[0]).control()[0].getEnabled(), true);
			assert.equal(oNavigationPopoverHandler._oPopover._getContentContainer().$().find("span")[0].textContent, "MySubtitle");

			// cleanup
			done();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		});
	});

	QUnit.test("_updateSemanticObjectController: SmartLink is leading control for registry", function(assert) {
		// system under test

		// arrange
		var oSemanticObjectController = new SemanticObjectController();
		var oSmartLink = new SmartLink({
			semanticObjectController: oSemanticObjectController
		});

		// act
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			control: oSmartLink
		});

		// assert
		assert.equal(oSemanticObjectController._aRegisteredControls.length, 1);
		assert.equal(oSemanticObjectController.isControlRegistered(oSmartLink), true);
		assert.equal(oSemanticObjectController.isControlRegistered(oNavigationPopoverHandler), false);

		// cleanup
		oSmartLink.destroy();
		oSemanticObjectController.destroy();
		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("_updateSemanticObjectController: SmartLink is leading control for registry", function(assert) {
		// system under test

		// arrange
		var oSemanticObjectController = new SemanticObjectController();
		var oSmartLink = new SmartLink({
			semanticObjectController: oSemanticObjectController
		});

		// act
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObjectController: oSemanticObjectController,
			control: oSmartLink
		});

		// assert
		assert.equal(oSemanticObjectController._aRegisteredControls.length, 1);
		assert.equal(oSemanticObjectController.isControlRegistered(oSmartLink), true);
		assert.equal(oSemanticObjectController.isControlRegistered(oNavigationPopoverHandler), false);

		// cleanup
		oSmartLink.destroy();
		oSemanticObjectController.destroy();
		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("_updateSemanticObjectController: SmartLink is leading control for registry", function(assert) {
		// system under test

		// arrange
		var oSemanticObjectController = new SemanticObjectController();
		var oSmartLink = new SmartLink({
			semanticObjectController: oSemanticObjectController
		});

		// act
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			control: oSmartLink,
			semanticObjectController: oSemanticObjectController
		});

		// assert
		assert.equal(oSemanticObjectController._aRegisteredControls.length, 1);
		assert.equal(oSemanticObjectController.isControlRegistered(oSmartLink), true);
		assert.equal(oSemanticObjectController.isControlRegistered(oNavigationPopoverHandler), false);

		// cleanup
		oSmartLink.destroy();
		oSemanticObjectController.destroy();
		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("_updateSemanticObjectController: SmartLink", function(assert) {
		// system under test
		var oSmartLink = new SmartLink();

		// arrange
		var fnAttachBeforePopoverOpensSpy = sinon.spy(oSmartLink, "attachBeforePopoverOpens");
		var fnAttachNavigationTargetsObtainedSpy = sinon.spy(oSmartLink, "attachNavigationTargetsObtained");
		var fnAttachInnerNavigateSpy = sinon.spy(oSmartLink, "attachInnerNavigate");

		// act
		oSmartLink.setSemanticObjectController(new SemanticObjectController());
		var oNavigationPopoverHandler = oSmartLink._createNavigationPopoverHandler();

		// assert
		assert.ok(fnAttachBeforePopoverOpensSpy.calledOnce);
		assert.ok(fnAttachNavigationTargetsObtainedSpy.calledOnce);
		assert.ok(fnAttachInnerNavigateSpy.calledOnce);
		assert.deepEqual(oSmartLink.getSemanticObjectController(), oNavigationPopoverHandler.getSemanticObjectController());
		assert.equal(oSmartLink.getSemanticObjectController()._aRegisteredControls.length, 1);
		assert.equal(oSmartLink.getSemanticObjectController().isControlRegistered(oSmartLink), true);
		assert.equal(oSmartLink.getSemanticObjectController().isControlRegistered(oNavigationPopoverHandler), false);

		// cleanup
		oSmartLink.destroy();
	});

	QUnit.test("_updateSemanticObjectController: without SmartLink (e.g. relevant for ObjectIdentifier)", function(assert) {
		// system under test
		var oNavigationPopoverHandler = new NavigationPopoverHandler();

		// arrange
		var fnAttachBeforePopoverOpensSpy = sinon.spy(oNavigationPopoverHandler, "attachBeforePopoverOpens");
		var fnAttachNavigationTargetsObtainedSpy = sinon.spy(oNavigationPopoverHandler, "attachNavigationTargetsObtained");
		var fnAttachInnerNavigateSpy = sinon.spy(oNavigationPopoverHandler, "attachInnerNavigate");

		// act
		oNavigationPopoverHandler.setSemanticObjectController(new SemanticObjectController());

		// assert
		assert.ok(fnAttachBeforePopoverOpensSpy.calledOnce);
		assert.ok(fnAttachNavigationTargetsObtainedSpy.calledOnce);
		assert.ok(fnAttachInnerNavigateSpy.calledOnce);
		assert.equal(oNavigationPopoverHandler.getSemanticObjectController()._aRegisteredControls.length, 1);
		assert.equal(oNavigationPopoverHandler.getSemanticObjectController().isControlRegistered(oNavigationPopoverHandler), true);

		// cleanup
		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("_updateSemanticObjectController: SmartLink is leading control for registry", function(assert) {
		// system under test

		// arrange
		var oSemanticObjectController = new SemanticObjectController();
		var oSmartLink = new SmartLink({
			semanticObjectController: oSemanticObjectController
		});

		// act
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			control: oSmartLink
		});

		// assert
		assert.equal(oSemanticObjectController._aRegisteredControls.length, 1);
		assert.equal(oSemanticObjectController.isControlRegistered(oSmartLink), true);
		assert.equal(oSemanticObjectController.isControlRegistered(oNavigationPopoverHandler), false);

		// cleanup
		oSmartLink.destroy();
		oSemanticObjectController.destroy();
		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("_updateSemanticObjectController: SmartLink is leading control for registry", function(assert) {
		// system under test

		// arrange
		var oSemanticObjectController = new SemanticObjectController();
		var oSmartLink = new SmartLink({
			semanticObjectController: oSemanticObjectController
		});

		// act
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObjectController: oSemanticObjectController,
			control: oSmartLink
		});

		// assert
		assert.equal(oSemanticObjectController._aRegisteredControls.length, 1);
		assert.equal(oSemanticObjectController.isControlRegistered(oSmartLink), true);
		assert.equal(oSemanticObjectController.isControlRegistered(oNavigationPopoverHandler), false);

		// cleanup
		oSmartLink.destroy();
		oSemanticObjectController.destroy();
		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("_updateSemanticObjectController: SmartLink is leading control for registry", function(assert) {
		// system under test

		// arrange
		var oSemanticObjectController = new SemanticObjectController();
		var oSmartLink = new SmartLink({
			semanticObjectController: oSemanticObjectController
		});

		// act
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			control: oSmartLink,
			semanticObjectController: oSemanticObjectController
		});

		// assert
		assert.equal(oSemanticObjectController._aRegisteredControls.length, 1);
		assert.equal(oSemanticObjectController.isControlRegistered(oSmartLink), true);
		assert.equal(oSemanticObjectController.isControlRegistered(oNavigationPopoverHandler), false);

		// cleanup
		oSmartLink.destroy();
		oSemanticObjectController.destroy();
		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("_updateSemanticObjectController: SmartLink", function(assert) {
		// system under test
		var oSmartLink = new SmartLink();

		// arrange
		var fnAttachBeforePopoverOpensSpy = sinon.spy(oSmartLink, "attachBeforePopoverOpens");
		var fnAttachNavigationTargetsObtainedSpy = sinon.spy(oSmartLink, "attachNavigationTargetsObtained");
		var fnAttachInnerNavigateSpy = sinon.spy(oSmartLink, "attachInnerNavigate");

		// act
		oSmartLink.setSemanticObjectController(new SemanticObjectController());
		var oNavigationPopoverHandler = oSmartLink._createNavigationPopoverHandler();

		// assert
		assert.ok(fnAttachBeforePopoverOpensSpy.calledOnce);
		assert.ok(fnAttachNavigationTargetsObtainedSpy.calledOnce);
		assert.ok(fnAttachInnerNavigateSpy.calledOnce);
		assert.deepEqual(oSmartLink.getSemanticObjectController(), oNavigationPopoverHandler.getSemanticObjectController());
		assert.equal(oSmartLink.getSemanticObjectController()._aRegisteredControls.length, 1);
		assert.equal(oSmartLink.getSemanticObjectController().isControlRegistered(oSmartLink), true);
		assert.equal(oSmartLink.getSemanticObjectController().isControlRegistered(oNavigationPopoverHandler), false);

		// cleanup
		oSmartLink.destroy();
	});

	QUnit.test("_updateSemanticObjectController: without SmartLink (e.g. relevant for ObjectIdentifier)", function(assert) {
		// system under test
		var oNavigationPopoverHandler = new NavigationPopoverHandler();

		// arrange
		var fnAttachBeforePopoverOpensSpy = sinon.spy(oNavigationPopoverHandler, "attachBeforePopoverOpens");
		var fnAttachNavigationTargetsObtainedSpy = sinon.spy(oNavigationPopoverHandler, "attachNavigationTargetsObtained");
		var fnAttachInnerNavigateSpy = sinon.spy(oNavigationPopoverHandler, "attachInnerNavigate");

		// act
		oNavigationPopoverHandler.setSemanticObjectController(new SemanticObjectController());

		// assert
		assert.ok(fnAttachBeforePopoverOpensSpy.calledOnce);
		assert.ok(fnAttachNavigationTargetsObtainedSpy.calledOnce);
		assert.ok(fnAttachInnerNavigateSpy.calledOnce);
		assert.equal(oNavigationPopoverHandler.getSemanticObjectController()._aRegisteredControls.length, 1);
		assert.equal(oNavigationPopoverHandler.getSemanticObjectController().isControlRegistered(oNavigationPopoverHandler), true);

		// cleanup
		oNavigationPopoverHandler.destroy();
	});

	/* --------------------------------------------------------------------------------------------------------------------
	 *
	 * _calculateSemanticAttributes with MapFieldToSemanticObject=true, FieldName and SemanticObjectController
	 *
	 * --------------------------------------------------------------------------------------------------------------------
	 */
	QUnit.module("_calculateSemanticAttributes with MapFieldToSemanticObject=true, FieldName and SemanticObjectController", {
		beforeEach: function() {
			Log.setLevel(Log.Level.TRACE);
			this.oNavigationPopoverHandler = new NavigationPopoverHandler({
				fieldName: "ClearingAccountingDocument",
				mapFieldToSemanticObject: true,
				semanticObjectController: new SemanticObjectController({
					fieldSemanticObjectMap: {
						AccountingDocument: "AccountingDocument",
						ClearingAccountingDocument: "AccountingDocument"
					}
				})
			});
			fPrepareBinding(this.oNavigationPopoverHandler, {
				AccountingDocument: "A1400000016",
				ClearingAccountingDocument: "C1600000015",
				ClearingStatus: "1"
			});
		},
		afterEach: function() {
			this.oNavigationPopoverHandler.destroy();
		}
	});

	QUnit.test("Bug fix", function(assert) {
		// system under test
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			fieldName: "BatchForEdit",
			semanticObject: "Batch",
			mapFieldToSemanticObject: true,
			semanticObjectController: new SemanticObjectController({
				fieldSemanticObjectMap: {
					MaterialForEdit: "Material",
					BatchForEdit: "Batch"
				}
			})
		});

		// arrange
		fPrepareBinding(oNavigationPopoverHandler, {
			Material: "FG29",
			MaterialForEdit: "FG29",
			BatchForEdit: "0001",
			Batch: "0001",
			InitialString: "",
			InitialNumber: 0,
			InitialNull: null,
			InitialUndefined: undefined
		});

		// act
		var oResult = oNavigationPopoverHandler._calculateSemanticAttributes();

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			Material: "FG29",
			Batch: "0001",
			InitialString: "",
			InitialNumber: 0
		});

		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("BCP 1770496639", function(assert) {
		// system under test
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			fieldName: "BatchForEdit",
			semanticObject: "Batch",
			mapFieldToSemanticObject: true,
			semanticObjectController: new SemanticObjectController({
				fieldSemanticObjectMap: {
					MaterialForEdit: "Material",
					BatchForEdit: "Batch"
				}
			})
		});

		// arrange
		fPrepareBinding(oNavigationPopoverHandler, {
			Material: "FG29",
			MaterialForEdit: "FG29",
			BatchForEdit: "0001",
			Batch: "0001",
			to_AccountingTransferStatus: {
				"__deferred": {
					"uri": "https://server:1032/sap/opu/odata/sap/SD_CUSTOMER_INVOICES_MANAGE/C_BillingDocument_F0797('90002154')/to_AccountingTransferStatus"
				}
			}
		});

		// act
		var oResult = oNavigationPopoverHandler._calculateSemanticAttributes();

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			Material: "FG29",
			Batch: "0001"
		});

		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("BCP 1770008011", function(assert) {
		// system under test
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			fieldName: "BatchForEdit",
			semanticObject: "Batch",
			mapFieldToSemanticObject: true,
			semanticObjectController: new SemanticObjectController({
				fieldSemanticObjectMap: {
					MaterialForEdit: "Material",
					BatchForEdit: "Batch"
				}
			})
		});

		// arrange
		fPrepareBinding(oNavigationPopoverHandler, {
			Material: "FG29",
			MaterialForEdit: "FG29",
			BatchForEdit: "0001",
			Batch: "0001"
		});

		// act
		var oResult = oNavigationPopoverHandler._calculateSemanticAttributes();

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			Material: "FG29",
			Batch: "0001"
		});

		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("own semantic object vs. semantic object from metadata annotation", function(assert) {
		// system under test

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("");

		// act
		var oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("AccountingDocument_Own");

		// act
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			AccountingDocument_Own: "C1600000015",
			ClearingStatus: "1"
		});
	});

	QUnit.test("change order of context attributes for several semanticObject's", function(assert) {
		// system under test

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("");

		// act
		var oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("AccountingDocument");

		// act
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		// assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("ClearingAccountingDocument");

		// act
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		// assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});

		// change now the order of the context attributes
		fPrepareBinding(this.oNavigationPopoverHandler, {
			ClearingAccountingDocument: "C1600000015",
			AccountingDocument: "A1400000016",
			ClearingStatus: "1"
		});

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("");

		// act
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("AccountingDocument");

		// act
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		// assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("ClearingAccountingDocument");

		// act
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		// assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
	});

	QUnit.test("change fieldName's for a given semanticObject", function(assert) {
		// system under test

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("");
		this.oNavigationPopoverHandler.setFieldName("ClearingAccountingDocument");

		// act
		var oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), null);

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("");
		this.oNavigationPopoverHandler.setFieldName("AccountingDocument");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), null);

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("");
		this.oNavigationPopoverHandler.setFieldName("Dummy");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "C1600000015", // last context attribute wins
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), null);

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("");
		this.oNavigationPopoverHandler.setFieldName("");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "C1600000015", // last context attribute wins
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), null);

		// ------------ new semanticObject ------------------------
		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("AccountingDocument");
		this.oNavigationPopoverHandler.setFieldName("ClearingAccountingDocument");

		// act
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), "C1600000015");

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("AccountingDocument");
		this.oNavigationPopoverHandler.setFieldName("AccountingDocument");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), "A1400000016");

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("AccountingDocument");
		this.oNavigationPopoverHandler.setFieldName("Dummy");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "C1600000015", // last context attribute wins
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), "C1600000015");

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("AccountingDocument");
		this.oNavigationPopoverHandler.setFieldName("");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "C1600000015", // last context attribute wins
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), "C1600000015");

		// ------------ new semanticObject ------------------------
		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("SemanticObjectDummy");
		this.oNavigationPopoverHandler.setFieldName("ClearingAccountingDocument");

		// act
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			SemanticObjectDummy: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), "C1600000015");

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("SemanticObjectDummy");
		this.oNavigationPopoverHandler.setFieldName("AccountingDocument");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			SemanticObjectDummy: "A1400000016",
			AccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), "A1400000016");

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("SemanticObjectDummy");
		this.oNavigationPopoverHandler.setFieldName("Dummy");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "C1600000015", // last context attribute wins
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), null);

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("SemanticObjectDummy");
		this.oNavigationPopoverHandler.setFieldName("");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "C1600000015", // last context attribute wins
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), null);
	});

	/* --------------------------------------------------------------------------------------------------------------------
	 *
	 * _calculateSemanticAttributes with MapFieldToSemanticObject=true, FieldName and no SemanticObjectController
	 *
	 * --------------------------------------------------------------------------------------------------------------------
	 */
	QUnit.module("_calculateSemanticAttributes with MapFieldToSemanticObject=true, FieldName and no SemanticObjectController", {
		beforeEach: function() {

			this.oNavigationPopoverHandler = new NavigationPopoverHandler({
				fieldName: "ClearingAccountingDocument",
				mapFieldToSemanticObject: true
			});
			fPrepareBinding(this.oNavigationPopoverHandler, {
				AccountingDocument: "A1400000016",
				ClearingAccountingDocument: "C1600000015",
				ClearingStatus: "1"
			});
		},
		afterEach: function() {
			this.oNavigationPopoverHandler.destroy();
		}
	});

	QUnit.test("BCP 1770496639", function(assert) {
		// system under test
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			fieldName: "BatchForEdit",
			semanticObject: "Batch",
			mapFieldToSemanticObject: true
		});

		// arrange
		fPrepareBinding(oNavigationPopoverHandler, {
			Material: "FG29",
			MaterialForEdit: "FG29",
			BatchForEdit: "0001",
			Batch: "0001",
			to_AccountingTransferStatus: {
				"__deferred": {
					"uri": "https://server:1032/sap/opu/odata/sap/SD_CUSTOMER_INVOICES_MANAGE/C_BillingDocument_F0797('90002154')/to_AccountingTransferStatus"
				}
			}
		});

		// act
		var oResult = oNavigationPopoverHandler._calculateSemanticAttributes();

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			Material: "FG29",
			Batch: "0001",
			MaterialForEdit: "FG29"
		});

		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("change order of context attributes for several semanticObject's", function(assert) {
		// system under test

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("");

		// act
		var oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("AccountingDocument");

		// act
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		// assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("ClearingAccountingDocument");

		// act
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		// assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});

		// change now the order of the context attributes
		fPrepareBinding(this.oNavigationPopoverHandler, {
			ClearingAccountingDocument: "C1600000015",
			AccountingDocument: "A1400000016",
			ClearingStatus: "1"
		});

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("");

		// act
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("AccountingDocument");

		// act
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		// assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("ClearingAccountingDocument");

		// act
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		// assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
	});

	QUnit.test("change fieldName's for a given semanticObject", function(assert) {
		// system under test

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("");
		this.oNavigationPopoverHandler.setFieldName("ClearingAccountingDocument");

		// act
		var oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), null);

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("");
		this.oNavigationPopoverHandler.setFieldName("AccountingDocument");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), null);

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("");
		this.oNavigationPopoverHandler.setFieldName("Dummy");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), null);

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("");
		this.oNavigationPopoverHandler.setFieldName("");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), null);

		// ------------ new semanticObject ------------------------
		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("AccountingDocument");
		this.oNavigationPopoverHandler.setFieldName("ClearingAccountingDocument");

		// act
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), "C1600000015");

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("AccountingDocument");
		this.oNavigationPopoverHandler.setFieldName("AccountingDocument");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), "A1400000016");

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("AccountingDocument");
		this.oNavigationPopoverHandler.setFieldName("Dummy");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), "A1400000016");

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("AccountingDocument");
		this.oNavigationPopoverHandler.setFieldName("");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), "A1400000016");

		// ------------ new semanticObject ------------------------
		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("SemanticObjectDummy");
		this.oNavigationPopoverHandler.setFieldName("ClearingAccountingDocument");

		// act
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			SemanticObjectDummy: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), "C1600000015");

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("SemanticObjectDummy");
		this.oNavigationPopoverHandler.setFieldName("AccountingDocument");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			SemanticObjectDummy: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), "A1400000016");

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("SemanticObjectDummy");
		this.oNavigationPopoverHandler.setFieldName("Dummy");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), null);

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("SemanticObjectDummy");
		this.oNavigationPopoverHandler.setFieldName("");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), null);
	});

	/* --------------------------------------------------------------------------------------------------------------------
	 *
	 * _calculateSemanticAttributes with MapFieldToSemanticObject=false, FieldName and SemanticObjectController
	 *
	 * --------------------------------------------------------------------------------------------------------------------
	 */
	QUnit.module("_calculateSemanticAttributes with MapFieldToSemanticObject=false, FieldName and SemanticObjectController", {
		beforeEach: function() {
			Log.setLevel(Log.Level.TRACE);
			this.oNavigationPopoverHandler = new NavigationPopoverHandler({
				fieldName: "ClearingAccountingDocument",
				mapFieldToSemanticObject: false,
				semanticObjectController: new SemanticObjectController({
					fieldSemanticObjectMap: {
						AccountingDocument: "AccountingDocument",
						ClearingAccountingDocument: "AccountingDocument"
					}
				})
			});
			fPrepareBinding(this.oNavigationPopoverHandler, {
				AccountingDocument: "A1400000016",
				ClearingAccountingDocument: "C1600000015",
				ClearingStatus: "1"
			});
		},
		afterEach: function() {
			this.oNavigationPopoverHandler.destroy();
		}
	});

	QUnit.test("BCP 1770496639", function(assert) {
		// system under test
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			fieldName: "BatchForEdit",
			semanticObject: "Batch",
			mapFieldToSemanticObject: false,
			semanticObjectController: new SemanticObjectController({
				fieldSemanticObjectMap: {
					MaterialForEdit: "Material",
					BatchForEdit: "Batch"
				}
			})
		});

		// arrange
		fPrepareBinding(oNavigationPopoverHandler, {
			Material: "FG29",
			MaterialForEdit: "FG29",
			BatchForEdit: "0001",
			Batch: "0001",
			to_AccountingTransferStatus: {
				"__deferred": {
					"uri": "https://server:1032/sap/opu/odata/sap/SD_CUSTOMER_INVOICES_MANAGE/C_BillingDocument_F0797('90002154')/to_AccountingTransferStatus"
				}
			}
		});

		// act
		var oResult = oNavigationPopoverHandler._calculateSemanticAttributes();

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			Batch: "0001",
			BatchForEdit: "0001",
			Material: "FG29",
			MaterialForEdit: "FG29"
		});

		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("change order of context attributes for several semanticObject's", function(assert) {
		// system under test

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("");

		// act
		var oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("AccountingDocument");

		// act
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		// assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("ClearingAccountingDocument");

		// act
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		// assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});

		// change now the order of the context attributes
		fPrepareBinding(this.oNavigationPopoverHandler, {
			ClearingAccountingDocument: "C1600000015",
			AccountingDocument: "A1400000016",
			ClearingStatus: "1"
		});

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("");

		// act
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			ClearingAccountingDocument: "C1600000015",
			AccountingDocument: "A1400000016",
			ClearingStatus: "1"
		});

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("AccountingDocument");

		// act
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		// assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			ClearingAccountingDocument: "C1600000015",
			AccountingDocument: "A1400000016",
			ClearingStatus: "1"
		});

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("ClearingAccountingDocument");

		// act
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		// assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			ClearingAccountingDocument: "C1600000015",
			AccountingDocument: "A1400000016",
			ClearingStatus: "1"
		});
	});

	QUnit.test("change fieldName's for a given semanticObject", function(assert) {
		// system under test

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("");
		this.oNavigationPopoverHandler.setFieldName("ClearingAccountingDocument");

		// act
		var oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), null);

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("");
		this.oNavigationPopoverHandler.setFieldName("AccountingDocument");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), null);

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("");
		this.oNavigationPopoverHandler.setFieldName("Dummy");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), null);

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("");
		this.oNavigationPopoverHandler.setFieldName("");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), null);

		// ------------ new semanticObject ------------------------
		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("AccountingDocument");
		this.oNavigationPopoverHandler.setFieldName("ClearingAccountingDocument");

		// act
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), "A1400000016");

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("AccountingDocument");
		this.oNavigationPopoverHandler.setFieldName("AccountingDocument");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), "A1400000016");

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("AccountingDocument");
		this.oNavigationPopoverHandler.setFieldName("Dummy");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), "A1400000016");

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("AccountingDocument");
		this.oNavigationPopoverHandler.setFieldName("");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), "A1400000016");

		// ------------ new semanticObject ------------------------
		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("SemanticObjectDummy");
		this.oNavigationPopoverHandler.setFieldName("ClearingAccountingDocument");

		// act
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), null);

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("SemanticObjectDummy");
		this.oNavigationPopoverHandler.setFieldName("AccountingDocument");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), null);

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("SemanticObjectDummy");
		this.oNavigationPopoverHandler.setFieldName("Dummy");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), null);

		// arrange
		this.oNavigationPopoverHandler.setSemanticObject("SemanticObjectDummy");
		this.oNavigationPopoverHandler.setFieldName("");

		// act and assert
		assert.deepEqual(this.oNavigationPopoverHandler._getSemanticAttributes()[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.equal(this.oNavigationPopoverHandler.getSemanticObjectValue(), null);
	});

	QUnit.test("BCP", function(assert) {
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "Batch",
			fieldName: "BatchForEdit",
			mapFieldToSemanticObject: true,
			semanticObjectController: new SemanticObjectController({
				fieldSemanticObjectMap: {
					BatchForEdit: "Batch",
					MaterialForEdit: "Material"
				}
			})
		});

		fPrepareBinding(oNavigationPopoverHandler, {
			BatchForEdit: "0000000001",
			Batch: "0000000001",
			MaterialForEdit: "FG29",
			Material: "FG29"
		});

		var oResult = oNavigationPopoverHandler._calculateSemanticAttributes();

		//assert
		assert.deepEqual(oResult[oNavigationPopoverHandler.getSemanticObject()], {
			Batch: "0000000001",
			Material: "FG29"
		});

		oNavigationPopoverHandler.destroy();
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationPopoverHandler: _calculateSemanticAttributes", {
		beforeEach: function() {
			Log.setLevel(Log.Level.TRACE);
			this.oNavigationPopoverHandler = new NavigationPopoverHandler({
				semanticObject: "SODefault",
				additionalSemanticObjects: [
					"SOAdditional"
				],
				fieldName: "ClearingAccountingDocument"
			});
			fPrepareBinding(this.oNavigationPopoverHandler, {
				AccountingDocument: "A1400000016",
				ClearingAccountingDocument: "C1600000015",
				ClearingStatus: "1"
			});
		},
		afterEach: function() {
			this.oNavigationPopoverHandler.destroy();
		}
	});

	QUnit.test("without semanticObjectMapping", function(assert) {
		// act
		var oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes();

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			SODefault: "C1600000015",
			ClearingStatus: "1"
		});
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getAdditionalSemanticObjects()[0]], {
			AccountingDocument: "A1400000016",
			SODefault: "C1600000015",
			ClearingStatus: "1"
		});
	});
	QUnit.test("with empty semanticObjectMapping", function(assert) {
		// act
		var oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes({});

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getAdditionalSemanticObjects()[0]], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
	});
	QUnit.test("with semanticObjectMapping", function(assert) {
		// act
		var oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes({
			SODefault: {
				AccountingDocument: "AccountingDocumentNew"
			}
		});

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocumentNew: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getAdditionalSemanticObjects()[0]], {
			AccountingDocument: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
	});
	QUnit.test("with semanticObjectMapping qualifier", function(assert) {
		// act
		var oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes({
			SODefault: {
				AccountingDocument: "AccountingDocumentNew"
			},
			SOAdditional: {
				AccountingDocument: "AccountingDocumentAdditional"
			}
		});

		//assert
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			AccountingDocumentNew: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getAdditionalSemanticObjects()[0]], {
			AccountingDocumentAdditional: "A1400000016",
			ClearingAccountingDocument: "C1600000015",
			ClearingStatus: "1"
		});
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationPopoverHandler: _calculateSemanticAttributes with SemanticObjectMapping - error handling", {
		beforeEach: function() {
			this.oNavigationPopoverHandler = new NavigationPopoverHandler({
				semanticObject: "SODefault"
			});
			fPrepareBinding(this.oNavigationPopoverHandler, {
				A: "a",
				B: "b",
				C: "c"
			});
		},
		afterEach: function() {
			this.oNavigationPopoverHandler.destroy();
		}
	});
	QUnit.test("test", function(assert) {
		// act ---------------------------------------------------------------------------------
		var oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes({
			SODefault: {
				A: {},
				B: undefined
			}
		});
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			A: "a",
			B: "b",
			C: "c"
		});

		// act ---------------------------------------------------------------------------------
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes({
			SODefault: {
				A: null,
				B: 0
			}
		});
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			A: "a",
			B: "b",
			C: "c"
		});

		// act ---------------------------------------------------------------------------------
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes({
			SODefault: {
				A: "C",
				B: "C"
			}
		});
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			C: "c"
		}, "not specified behaviour in clash situation - last win");

		// act ---------------------------------------------------------------------------------
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes({
			SODefault: {
				B: "A",
				C: "A"
			}
		});
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			A: "c"
		}, "not specified behaviour in clash situation - last win");

		// act ---------------------------------------------------------------------------------
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes({
			SODefault: {
				A: "Z",
				B: "Z"
			}
		});
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			Z: "b",
			C: "c"
		}, "not specified behaviour in clash situation - last win");

		// act ---------------------------------------------------------------------------------
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes({
			SODefault: {
				A: "B",
				B: "A"
			}
		});
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			B: "a",
			A: "b",
			C: "c"
		});

		// act ---------------------------------------------------------------------------------
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes({
			SODefault: {
				Z: "B", // will be ignored as 'Z' is not part of binding context
				A: "Z"
			}
		});
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			Z: "a",
			B: "b",
			C: "c"
		});

		// act ---------------------------------------------------------------------------------
		oResult = this.oNavigationPopoverHandler._calculateSemanticAttributes({
			SODefault: {
				A: "Z",
				Z: "B" // will be ignored as 'Z' is not part of binding context
			}
		});
		assert.deepEqual(oResult[this.oNavigationPopoverHandler.getSemanticObject()], {
			Z: "a",
			B: "b",
			C: "c"
		});
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationPopoverHandler - navigation", {
		beforeEach: function() {
			Log.setLevel(Log.Level.TRACE);
			FakeFlpConnector.enableFakeConnector({
				TestObject: {
					links: [
						{
							action: "displayFactSheet",
							intent: "?TestObject#/dummyLink1",
							text: "Fact Sheet"
						}, {
							action: "anyAction",
							intent: "?TestObject#/dummyLink2",
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

	QUnit.test("fireInnerNavigate without handler", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject",
			fieldName: "fieldA",
			control: oButton
		});

		// arrange
		var done = assert.async();
		var fnFireInnerNavigateSpy = sinon.spy(oNavigationPopoverHandler, "fireInnerNavigate");

		fPrepareBinding(oNavigationPopoverHandler, {
			fieldA: "valueA"
		});

		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		oNavigationPopoverHandler.openPopover().then(function() {

			oNavigationPopoverHandler._oPopover._getContentContainer().fireNavigate({
				text: "New Link",
				href: "#newLink"
			});

			// assert
			assert.ok(fnFireInnerNavigateSpy.calledOnce);
			assert.equal(fnFireInnerNavigateSpy.args[0][0].text, "New Link");
			assert.equal(fnFireInnerNavigateSpy.args[0][0].href, "#newLink");
			assert.equal(fnFireInnerNavigateSpy.args[0][0].originalId, oButton.getId());
			assert.equal(fnFireInnerNavigateSpy.args[0][0].semanticObject, "TestObject");
			assert.deepEqual(fnFireInnerNavigateSpy.args[0][0].semanticAttributes, {
				TestObject: "valueA"
			});

			// cleanup
			done();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		});
	});

	QUnit.test("fireInnerNavigate with handler", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObject",
			fieldName: "fieldA",
			control: oButton,
			innerNavigate: function(oEvent) {

				// assert
				assert.equal(Object.keys(oEvent.getParameters()).length, 5);
				assert.equal(oEvent.getParameters().text, "New Link");
				assert.equal(oEvent.getParameters().href, "#newLink");
				assert.equal(oEvent.getParameters().originalId, oButton.getId());
				assert.equal(oEvent.getParameters().semanticObject, "TestObject");
				assert.deepEqual(oEvent.getParameters().semanticAttributes, {
					TestObject: "valueA"
				});
			}
		});

		// arrange
		var done = assert.async();
		var fnFireInnerNavigateSpy = sinon.spy(oNavigationPopoverHandler, "fireInnerNavigate");

		fPrepareBinding(oNavigationPopoverHandler, {
			fieldA: "valueA"
		});

		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		oNavigationPopoverHandler.openPopover().then(function() {

			oNavigationPopoverHandler._oPopover._getContentContainer().fireNavigate({
				text: "New Link",
				href: "#newLink"
			});

			// assert
			assert.ok(fnFireInnerNavigateSpy.calledOnce);
			assert.equal(fnFireInnerNavigateSpy.args[0][0].text, "New Link");
			assert.equal(fnFireInnerNavigateSpy.args[0][0].href, "#newLink");
			assert.equal(fnFireInnerNavigateSpy.args[0][0].originalId, oButton.getId());
			assert.equal(fnFireInnerNavigateSpy.args[0][0].semanticObject, "TestObject");
			assert.deepEqual(fnFireInnerNavigateSpy.args[0][0].semanticAttributes, {
				TestObject: "valueA"
			});

			// cleanup
			done();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		});
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationPopoverHandler - direct navigation", {
		beforeEach: function() {
			this.sIntent = window.location.href + "#Link";
			Log.setLevel(Log.Level.TRACE);
			FakeFlpConnector.enableFakeConnector({
				TestObjectDirect: {
					links: [
						{
							action: "anyAction",
							intent: this.sIntent,
							text: "List"
						}
					]
				}
			});
		},
		afterEach: function() {
			this.sIntent = undefined;
			FakeFlpConnector.disableFakeConnector();
			SemanticObjectController.destroyDistinctSemanticObjects();
		}
	});

	QUnit.test("fireInnerNavigate", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObjectDirect",
			fieldName: "fieldA",
			control: oButton
		});

		// arrange
		var done = assert.async();
		var fnFireInnerNavigateSpy = sinon.spy(oNavigationPopoverHandler, "fireInnerNavigate");

		fPrepareBinding(oNavigationPopoverHandler, {
			fieldA: "valueA"
		});

		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		oNavigationPopoverHandler.attachInnerNavigate(function(oEvent) {
			// assert
			assert.equal(Object.keys(oEvent.getParameters()).length, 5);
			assert.equal(oEvent.getParameters().text, "List");
			assert.equal(oEvent.getParameters().href, this.sIntent);
			assert.equal(oEvent.getParameters().originalId, oButton.getId());
			assert.equal(oEvent.getParameters().semanticObject, "TestObjectDirect");
			assert.deepEqual(oEvent.getParameters().semanticAttributes, {
				TestObjectDirect: "valueA"
			});
		}.bind(this));

		// act
		oNavigationPopoverHandler.openPopover().then(function() {

			// assert
			assert.ok(fnFireInnerNavigateSpy.calledOnce);
			assert.equal(fnFireInnerNavigateSpy.args[0][0].text, "List");
			assert.equal(fnFireInnerNavigateSpy.args[0][0].href, this.sIntent);
			assert.equal(fnFireInnerNavigateSpy.args[0][0].originalId, oButton.getId());
			assert.equal(fnFireInnerNavigateSpy.args[0][0].semanticObject, "TestObjectDirect");
			assert.deepEqual(fnFireInnerNavigateSpy.args[0][0].semanticAttributes, {
				TestObjectDirect: "valueA"
			});

			// cleanup
			done();
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		}.bind(this));
	});

	QUnit.test("StableID: after direct link navigation the popover should be destroyed", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObject: "TestObjectDirect",
			control: oButton
		});

		// arrange
		var done = assert.async();

		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		oNavigationPopoverHandler.openPopover().then(function() {

			// assert
			assert.ok(!oNavigationPopoverHandler._oPopover);

			done();

			// cleanup
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		});
	});

	/*QUnit.test("XXX", function(assert) {
	 // system under test
	 var oButton = new Button({
	 text: "button"
	 });
	 var oNavigationPopoverHandler = NavigationPopoverHandler({
	 semanticObject: "TestObjectDirect",
	 fieldName: "fieldA",
	 control: oButton
	 });

	 // arrange
	 var done = assert.async();
	 fPrepareBinding(oNavigationPopoverHandler, {
	 fieldA: "valueA",
	 fieldB: null,
	 fieldC: "valueC",
	 __metadata: {"blabla": "blabla"}
	 });

	 oButton.placeAt("qunit-fixture");
	 sap.ui.getCore().applyChanges();

	 oNavigationPopoverHandler.attachNavigationTargetsObtained(function(oEvent) {
	 oEvent.getParameters().show();
	 });

	 // act
	 oNavigationPopoverHandler.openPopover().then(function() {
	 // assert
	 assert.ok(true);

	 done();
	 });

	 // cleanup
	 oNavigationPopoverHandler.destroy();
	 oButton.destroy();
	 });*/

	QUnit.module("sap.ui.comp.navpopover.NavigationPopoverHandler - show() without navigation links", {
		beforeEach: function() {
			Log.setLevel(Log.Level.TRACE);
		},
		afterEach: function() {
			SemanticObjectController.destroyDistinctSemanticObjects();
		}
	});

	QUnit.test("with 3 parameters: sMainNavigationId and oMainNavigation", function(assert) {
		// system under test
		var oNavigationPopoverHandler = new NavigationPopoverHandler();

		// arrange
		var done = assert.async();
		var oLinkData = new LinkData();
		oNavigationPopoverHandler.attachNavigationTargetsObtained(function(oEvent) {
			oEvent.getParameters().show("123", oLinkData);
		});

		// act
		oNavigationPopoverHandler.openPopover().then(function() {
			// assert
			var oModel = oNavigationPopoverHandler.getModel("$sapuicompNavigationPopoverHandler");
			assert.equal(oModel.getProperty("/mainNavigationId"), "123");
			assert.deepEqual(oModel.getProperty("/navigationTarget/mainNavigation"), oLinkData);
			assert.equal(oModel.getProperty("/navigationTarget/ownNavigation"), undefined);
			assert.equal(oModel.getProperty("/navigationTarget/extraContent"), undefined);

			done();

			// cleanup
			oNavigationPopoverHandler.destroy();
		});
	});

	QUnit.test("with 3 parameters: oAdditionalContent", function(assert) {
		// system under test
		var oButton = new Button({
			text: "button"
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			control: oButton
		});

		// arrange
		var done = assert.async();
		var oAdditionalContent = new VBox();
		oNavigationPopoverHandler.attachNavigationTargetsObtained(function(oEvent) {
			oEvent.getParameters().show(undefined, undefined, oAdditionalContent);
		});

		oButton.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		oNavigationPopoverHandler.openPopover().then(function() {
			// assert
			var oModel = oNavigationPopoverHandler.getModel("$sapuicompNavigationPopoverHandler");
			assert.equal(oModel.getProperty("/mainNavigationId"), undefined);
			assert.deepEqual(oModel.getProperty("/navigationTarget/mainNavigation"), undefined);
			assert.equal(oModel.getProperty("/navigationTarget/ownNavigation"), undefined);
			assert.equal(oModel.getProperty("/navigationTarget/extraContent"), oAdditionalContent);

			done();

			// cleanup
			oNavigationPopoverHandler.destroy();
			oButton.destroy();
		});
	});

	QUnit.test("with 3 parameters: all undefined", function(assert) {
		// system under test
		var oNavigationPopoverHandler = new NavigationPopoverHandler();

		// arrange
		var done = assert.async();
		oNavigationPopoverHandler.attachNavigationTargetsObtained(function(oEvent) {
			oEvent.getParameters().show(undefined, undefined, undefined);
		});

		// act
		oNavigationPopoverHandler.openPopover().then(function() {
			// assert
			var oModel = oNavigationPopoverHandler.getModel("$sapuicompNavigationPopoverHandler");
			assert.equal(oModel.getProperty("/mainNavigationId"), undefined);
			assert.deepEqual(oModel.getProperty("/navigationTarget/mainNavigation"), undefined);
			assert.equal(oModel.getProperty("/navigationTarget/ownNavigation"), undefined);
			assert.equal(oModel.getProperty("/navigationTarget/extraContent"), undefined);

			done();

			// cleanup
			oNavigationPopoverHandler.destroy();
		});
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationPopoverHandler - SemanticObjectController", {
		beforeEach: function() {
			Log.setLevel(Log.Level.TRACE);
		},
		afterEach: function() {
		}
	});

	QUnit.test("Constructor - control", function(assert) {
		// system under test
		var oNavigationPopoverHandler;
		var oSemanticObjectController;
		var oSmartLink;

		// arrange

		// act
		oNavigationPopoverHandler = new NavigationPopoverHandler({
			control: oSmartLink = new SmartLink({
				semanticObjectController: oSemanticObjectController = new SemanticObjectController()
			})
		});

		// assert
		assert.ok(!oSemanticObjectController.isControlRegistered(oNavigationPopoverHandler));
		assert.ok(oSemanticObjectController.isControlRegistered(oSmartLink));

		// cleanup
		oSemanticObjectController.destroy();
		oSmartLink.destroy();
		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("Constructor - control via table", function(assert) {
		// system under test
		var oButton;
		var oSemanticObjectController;
		var oSmartTable = new SmartTable({
			items: new Table({
				columns: [
					new Column({
						label: new Label(),
						template: oButton = new Button()
					})
				]
			}),
			semanticObjectController: oSemanticObjectController = new SemanticObjectController()
		});

		// arrange

		// act
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			control: oButton
		});

		// assert
		assert.ok(oSemanticObjectController.isControlRegistered(oNavigationPopoverHandler));
		assert.ok(!oSemanticObjectController.isControlRegistered(oButton));

		// cleanup
		oSmartTable.destroy();
		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("Constructor - semanticObjectController", function(assert) {
		// system under test
		var oNavigationPopoverHandler;
		var oSemanticObjectController;

		// arrange

		// act
		oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObjectController: oSemanticObjectController = new SemanticObjectController()
		});

		// assert
		assert.ok(oSemanticObjectController.isControlRegistered(oNavigationPopoverHandler));

		// cleanup
		oSemanticObjectController.destroy();
		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("Constructor - control and semanticObjectController", function(assert) {
		// system under test
		var oNavigationPopoverHandler;
		var oSemanticObjectController;
		var oButton;

		// arrange

		// act
		oNavigationPopoverHandler = new NavigationPopoverHandler({
			control: oButton = new Button(),
			semanticObjectController: oSemanticObjectController = new SemanticObjectController()
		});

		// assert
		assert.ok(oSemanticObjectController.isControlRegistered(oNavigationPopoverHandler));
		assert.ok(!oSemanticObjectController.isControlRegistered(oButton));

		// cleanup
		oSemanticObjectController.destroy();
		oButton.destroy();
		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("Constructor - control and semanticObjectController (A)", function(assert) {
		// system under test
		var oNavigationPopoverHandler;
		var oSemanticObjectController;
		var oSmartLink;

		// arrange

		// act
		oNavigationPopoverHandler = new NavigationPopoverHandler({
			control: oSmartLink = new SmartLink(),
			semanticObjectController: oSemanticObjectController = new SemanticObjectController()
		});

		// assert
		assert.ok(oSemanticObjectController.isControlRegistered(oNavigationPopoverHandler));
		assert.ok(!oSemanticObjectController.isControlRegistered(oSmartLink));

		// cleanup
		oSemanticObjectController.destroy();
		oSmartLink.destroy();
		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("Constructor - control and semanticObjectController (A)", function(assert) {
		// system under test
		var oNavigationPopoverHandler;
		var oSemanticObjectController;
		var oSmartLink;

		// arrange

		// act
		oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObjectController: oSemanticObjectController = new SemanticObjectController(),
			control: oSmartLink = new SmartLink()
		});

		// assert
		assert.ok(oSemanticObjectController.isControlRegistered(oNavigationPopoverHandler));
		assert.ok(!oSemanticObjectController.isControlRegistered(oSmartLink));

		// cleanup
		oSemanticObjectController.destroy();
		oSmartLink.destroy();
		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("Constructor - control and semanticObjectController (B)", function(assert) {
		// system under test
		var oNavigationPopoverHandler;
		var oSemanticObjectController, oSemanticObjectController_;
		var oSmartLink;

		// arrange

		// act
		oNavigationPopoverHandler = new NavigationPopoverHandler({
			control: oSmartLink = new SmartLink({
				semanticObjectController: oSemanticObjectController_ = new SemanticObjectController()
			}),
			semanticObjectController: oSemanticObjectController = new SemanticObjectController()
		});

		// assert
		assert.ok(oSemanticObjectController.isControlRegistered(oNavigationPopoverHandler));
		assert.ok(!oSemanticObjectController.isControlRegistered(oSmartLink));
		assert.ok(oSemanticObjectController_.isControlRegistered(oSmartLink));
		assert.ok(!oSemanticObjectController_.isControlRegistered(oNavigationPopoverHandler));

		// cleanup
		oSemanticObjectController.destroy();
		oSemanticObjectController_.destroy();
		oSmartLink.destroy();
		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("Constructor - control and semanticObjectController (B)", function(assert) {
		// system under test
		var oNavigationPopoverHandler;
		var oSemanticObjectController, oSemanticObjectController_;
		var oSmartLink;

		// arrange

		// act
		oNavigationPopoverHandler = new NavigationPopoverHandler({
			semanticObjectController: oSemanticObjectController = new SemanticObjectController(),
			control: oSmartLink = new SmartLink({
				semanticObjectController: oSemanticObjectController_ = new SemanticObjectController()
			})
		});

		// assert
		assert.ok(oSemanticObjectController.isControlRegistered(oNavigationPopoverHandler));
		assert.ok(!oSemanticObjectController.isControlRegistered(oSmartLink));
		assert.ok(oSemanticObjectController_.isControlRegistered(oSmartLink));
		assert.ok(!oSemanticObjectController_.isControlRegistered(oNavigationPopoverHandler));

		// cleanup
		oSemanticObjectController.destroy();
		oSemanticObjectController_.destroy();
		oSmartLink.destroy();
		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("API - control", function(assert) {
		// system under test
		var oNavigationPopoverHandler;
		var oSemanticObjectController;
		var oSmartLink;

		// arrange
		oNavigationPopoverHandler = new NavigationPopoverHandler();

		// act
		oNavigationPopoverHandler.setControl(oSmartLink = new SmartLink({
			semanticObjectController: oSemanticObjectController = new SemanticObjectController()
		}));

		// assert
		assert.ok(!oSemanticObjectController.isControlRegistered(oNavigationPopoverHandler));
		assert.ok(oSemanticObjectController.isControlRegistered(oSmartLink));

		// cleanup
		oSemanticObjectController.destroy();
		oSmartLink.destroy();
		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("API - semanticObjectController", function(assert) {
		// system under test
		var oNavigationPopoverHandler;
		var oSemanticObjectController;

		// arrange
		oNavigationPopoverHandler = new NavigationPopoverHandler();

		// act
		oNavigationPopoverHandler.setSemanticObjectController(oSemanticObjectController = new SemanticObjectController());

		// assert
		assert.ok(oSemanticObjectController.isControlRegistered(oNavigationPopoverHandler));

		// cleanup
		oSemanticObjectController.destroy();
		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("API - control and semanticObjectController", function(assert) {
		// system under test
		var oNavigationPopoverHandler;
		var oSemanticObjectController;
		var oButton;

		// arrange
		oNavigationPopoverHandler = new NavigationPopoverHandler();

		// act
		oNavigationPopoverHandler.setControl(oButton = new Button());
		oNavigationPopoverHandler.setSemanticObjectController(oSemanticObjectController = new SemanticObjectController());

		// assert
		assert.ok(oSemanticObjectController.isControlRegistered(oNavigationPopoverHandler));
		assert.ok(!oSemanticObjectController.isControlRegistered(oButton));

		// cleanup
		oSemanticObjectController.destroy();
		oButton.destroy();
		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("API - control and semanticObjectController (A)", function(assert) {
		// system under test
		var oNavigationPopoverHandler;
		var oSemanticObjectController;
		var oSmartLink;

		// arrange
		oNavigationPopoverHandler = new NavigationPopoverHandler();

		// act
		oNavigationPopoverHandler.setControl(oSmartLink = new SmartLink());
		oNavigationPopoverHandler.setSemanticObjectController(oSemanticObjectController = new SemanticObjectController());

		// assert
		assert.ok(oSemanticObjectController.isControlRegistered(oNavigationPopoverHandler));
		assert.ok(!oSemanticObjectController.isControlRegistered(oSmartLink));

		// cleanup
		oSemanticObjectController.destroy();
		oSmartLink.destroy();
		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("API - control and semanticObjectController (A)", function(assert) {
		// system under test
		var oNavigationPopoverHandler;
		var oSemanticObjectController;
		var oSmartLink;

		// arrange
		oNavigationPopoverHandler = new NavigationPopoverHandler();

		// act
		oNavigationPopoverHandler.setSemanticObjectController(oSemanticObjectController = new SemanticObjectController());
		oNavigationPopoverHandler.setControl(oSmartLink = new SmartLink());

		// assert
		assert.ok(oSemanticObjectController.isControlRegistered(oNavigationPopoverHandler));
		assert.ok(!oSemanticObjectController.isControlRegistered(oSmartLink));

		// cleanup
		oSemanticObjectController.destroy();
		oSmartLink.destroy();
		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("API - control and semanticObjectController (B)", function(assert) {
		// system under test
		var oNavigationPopoverHandler;
		var oSemanticObjectController, oSemanticObjectController_;
		var oSmartLink;

		// arrange
		oNavigationPopoverHandler = new NavigationPopoverHandler();

		// act
		oNavigationPopoverHandler.setControl(oSmartLink = new SmartLink({
			semanticObjectController: oSemanticObjectController_ = new SemanticObjectController()
		}));
		oNavigationPopoverHandler.setSemanticObjectController(oSemanticObjectController = new SemanticObjectController());

		// assert
		assert.ok(oSemanticObjectController.isControlRegistered(oNavigationPopoverHandler));
		assert.ok(!oSemanticObjectController.isControlRegistered(oSmartLink));
		assert.ok(oSemanticObjectController_.isControlRegistered(oSmartLink));
		assert.ok(!oSemanticObjectController_.isControlRegistered(oNavigationPopoverHandler));

		// cleanup
		oSemanticObjectController.destroy();
		oSemanticObjectController_.destroy();
		oSmartLink.destroy();
		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("API - control and semanticObjectController (B)", function(assert) {
		// system under test
		var oNavigationPopoverHandler;
		var oSemanticObjectController, oSemanticObjectController_;
		var oSmartLink;

		// arrange
		oNavigationPopoverHandler = new NavigationPopoverHandler();

		// act
		oNavigationPopoverHandler.setSemanticObjectController(oSemanticObjectController = new SemanticObjectController());
		oNavigationPopoverHandler.setControl(oSmartLink = new SmartLink({
			semanticObjectController: oSemanticObjectController_ = new SemanticObjectController()
		}));

		// assert
		assert.ok(oSemanticObjectController.isControlRegistered(oNavigationPopoverHandler));
		assert.ok(!oSemanticObjectController.isControlRegistered(oSmartLink));
		assert.ok(oSemanticObjectController_.isControlRegistered(oSmartLink));
		assert.ok(!oSemanticObjectController_.isControlRegistered(oNavigationPopoverHandler));

		// cleanup
		oSemanticObjectController.destroy();
		oSemanticObjectController_.destroy();
		oSmartLink.destroy();
		oNavigationPopoverHandler.destroy();
	});

	QUnit.test("Event beforePopoverOpens", function(assert) {
		// system under test
		var oButton;
		var oSemanticObjectController;
		var oSmartTable = new SmartTable({
			items: new Table({
				columns: [
					new Column({
						label: new Label(),
						template: oButton = new Button()
					})
				]
			}),
			semanticObjectController: oSemanticObjectController = new SemanticObjectController()
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			control: oButton
		});

		// arrange
		var done = assert.async();
		var fnFireBeforePopoverOpensSpy = sinon.spy(oSemanticObjectController, "fireBeforePopoverOpens");
		oSemanticObjectController.attachBeforePopoverOpens(function(oEvent) {
			// assert
			assert.ok(fnFireBeforePopoverOpensSpy.called);

			oEvent.getParameters().open();
		});

		// act
		oNavigationPopoverHandler.openPopover().then(function() {
			done();
			// cleanup
			oSmartTable.destroy();
			oNavigationPopoverHandler.destroy();
		});
	});

	QUnit.test("Event navigationTargetsObtained", function(assert) {
		// system under test
		var oButton;
		var oSemanticObjectController;
		var oSmartTable = new SmartTable({
			items: new Table({
				columns: [
					new Column({
						label: new Label(),
						template: oButton = new Button()
					})
				]
			}),
			semanticObjectController: oSemanticObjectController = new SemanticObjectController()
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			control: oButton
		});

		// arrange
		var done = assert.async();
		var fnFireNavigationTargetsObtainedSpy = sinon.spy(oSemanticObjectController, "fireNavigationTargetsObtained");
		oSemanticObjectController.attachNavigationTargetsObtained(function(oEvent) {
			// assert
			assert.ok(fnFireNavigationTargetsObtainedSpy.calledOnce);

			oEvent.getParameters().show();
		});

		// act
		oNavigationPopoverHandler.openPopover().then(function() {
			done();
			// cleanup
			oSmartTable.destroy();
			oNavigationPopoverHandler.destroy();
		});
	});

	QUnit.test("Event navigate", function(assert) {
		// system under test
		var oButton;
		var oSemanticObjectController;
		var oSmartTable = new SmartTable({
			items: new Table({
				columns: [
					new Column({
						label: new Label(),
						template: oButton = new Button()
					})
				]
			}),
			semanticObjectController: oSemanticObjectController = new SemanticObjectController()
		});
		var oNavigationPopoverHandler = new NavigationPopoverHandler({
			control: oButton
		});

		// arrange
		oNavigationPopoverHandler.attachNavigationTargetsObtained(function(oEvent) {
			oEvent.getParameters().show(undefined, new LinkData({
				href: "#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
				text: "Application Specific Fact Sheet",
				target: "_blank"
			}), undefined, new Control());
		});
		var done = assert.async();
		var fnFireNavigateSpy = sinon.spy(oSemanticObjectController, "fireNavigate");
		oSemanticObjectController.attachNavigate(function(oEvent) {
			// assert
			assert.ok(fnFireNavigateSpy.called);
			done();
			// cleanup
			oSmartTable.destroy();
			oNavigationPopoverHandler.destroy();
		});

		oSmartTable.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		oNavigationPopoverHandler.openPopover().then(function() {
			oNavigationPopoverHandler._oPopover._getContentContainer().fireNavigate({
				text: "New Link",
				href: "#newLink"
			});
		});
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationPopoverHandler - StableID without appComponent", {
		beforeEach: function() {
			Log.setLevel(Log.Level.TRACE);
			this.oControl = new Control();
			this.oUIComponent = undefined;

			this.oNavigationPopoverHandler = new NavigationPopoverHandler();

			this._getComponentStub = sinon.stub(this.oNavigationPopoverHandler, "_getComponent");
			this._getComponentStub.returns(null);

			this.getControlStub = sinon.stub(this.oNavigationPopoverHandler, "getControl");
			this.getControlStub.returns(this.oControl.getId());
		},
		afterEach: function() {
			this.oControl.destroy();

			this._getComponentStub.restore();
			this.getControlStub.restore();

			this.oNavigationPopoverHandler.destroy();
			SemanticObjectController.destroyDistinctSemanticObjects();
		}
	});

	QUnit.test("and no semanticObject", function(assert) {
		// assert
		assert.equal(this.oNavigationPopoverHandler.getNavigationPopoverStableId(), undefined);
	});
	QUnit.test("and dummy semanticObject", function(assert) {
		this.oNavigationPopoverHandler.setSemanticObject("dummy");

		// assert
		assert.equal(this.oNavigationPopoverHandler.getNavigationPopoverStableId(), undefined);
	});
	QUnit.test("and additionalSemanticObject", function(assert) {
		this.oNavigationPopoverHandler.setAdditionalSemanticObjects([
			"SOAdd"
		]);

		// assert
		assert.equal(this.oNavigationPopoverHandler.getNavigationPopoverStableId(), undefined);
	});
	QUnit.test("and semanticObject", function(assert) {
		this.oNavigationPopoverHandler.setSemanticObject("SO1");

		// assert
		assert.equal(this.oNavigationPopoverHandler.getNavigationPopoverStableId(), undefined);
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationPopoverHandler - StableID with appComponent", {
		beforeEach: function() {
			Log.setLevel(Log.Level.TRACE);
			this.oControl = new Control();
			this.oUIComponent = new UIComponent("appComponent1", {});

			this.oNavigationPopoverHandler = new NavigationPopoverHandler();

			this._getComponentStub = sinon.stub(this.oNavigationPopoverHandler, "_getComponent");
			this._getComponentStub.returns(this.oUIComponent);

			this.getControlStub = sinon.stub(this.oNavigationPopoverHandler, "getControl");
			this.getControlStub.returns(this.oControl.getId());
		},
		afterEach: function() {
			this.oControl.destroy();
			this.oUIComponent.destroy();

			this._getComponentStub.restore();
			this.getControlStub.restore();

			this.oNavigationPopoverHandler.destroy();
			SemanticObjectController.destroyDistinctSemanticObjects();
		}
	});
	QUnit.test("and no semanticObject", function(assert) {
		// assert
		assert.equal(this.oNavigationPopoverHandler.getNavigationPopoverStableId(), undefined);
	});
	QUnit.test("and additionalSemanticObjects", function(assert) {
		this.oNavigationPopoverHandler.setAdditionalSemanticObjects([
			"SOAdd"
		]);

		// assert
		assert.equal(this.oNavigationPopoverHandler.getNavigationPopoverStableId(), undefined);
	});
	QUnit.test("and dummy semanticObject", function(assert) {
		this.oNavigationPopoverHandler.setSemanticObject("dummy");

		// assert
		assert.equal(this.oNavigationPopoverHandler.getNavigationPopoverStableId(), "appComponent1---sapuicompnavpopoverNavigationPopover---dummy");
	});
	QUnit.test("and semanticObject", function(assert) {
		this.oNavigationPopoverHandler.setSemanticObject("SO1");

		// assert
		assert.equal(this.oNavigationPopoverHandler.getNavigationPopoverStableId(), "appComponent1---sapuicompnavpopoverNavigationPopover---SO1");
	});
	QUnit.test("and semanticObject and additionalSemanticObjects", function(assert) {
		this.oNavigationPopoverHandler.setSemanticObject("SO1");
		this.oNavigationPopoverHandler.setAdditionalSemanticObjects([
			"SO1Add"
		]);

		// assert
		assert.equal(this.oNavigationPopoverHandler.getNavigationPopoverStableId(), "appComponent1---sapuicompnavpopoverNavigationPopover---SO1--SO1Add");
	});

	QUnit.start();
});