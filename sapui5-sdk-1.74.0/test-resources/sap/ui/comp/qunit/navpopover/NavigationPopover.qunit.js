/* global  QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/core/Control",
	"sap/ui/comp/navpopover/LinkData",
	"sap/ui/comp/navpopover/NavigationPopover",
	"sap/ui/comp/navpopover/SmartLink",
	"sap/ui/comp/navpopover/NavigationContainer",
	"sap/m/Text",
	"sap/m/Link"

], function(
	qutils,
	Control,
	LinkData,
	NavigationPopover,
	SmartLink,
	NavigationContainer,
	Text,
	Link
) {
	"use strict";

	var oSinonClock = sinon.useFakeTimers();

	QUnit.module("sap.ui.comp.navpopover.NavigationPopover", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(new NavigationPopover());
	});

	QUnit.test("constructor", function(assert) {
		// system under test
		var oNavigationPopover = new NavigationPopover();

		// assert
		assert.equal(oNavigationPopover.getSemanticObjectName(), "");
		assert.equal(oNavigationPopover.getAppStateKey(), "");
		assert.equal(oNavigationPopover.getMainNavigationId(), "");
		assert.equal(oNavigationPopover.getAvailableActionsPersonalizationText(), undefined);
		assert.deepEqual(oNavigationPopover.getSemanticAttributes(), null); // Default value of a property
		assert.deepEqual(oNavigationPopover.getAvailableActions(), []); // Default value of an aggregation
		assert.deepEqual(oNavigationPopover.getMainNavigation(), null);
		assert.deepEqual(oNavigationPopover.getOwnNavigation(), null);
		assert.deepEqual(oNavigationPopover.getSource(), null);
		assert.deepEqual(oNavigationPopover.getExtraContent(), null);
		assert.deepEqual(oNavigationPopover.getComponent(), null);

		assert.ok(oNavigationPopover._getContentContainer().getItems().length, 2);

		// cleanup
		oNavigationPopover.destroy();
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationPopover: show", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});

	QUnit.test("mainNavigation", function(assert) {
		// system under test
		var oNavigationPopover = new NavigationPopover({
			source: new SmartLink(),
			mainNavigation: new LinkData({
				text: "Main",
				href: "href1"
			})
		});

		// arrange
		sinon.stub(oNavigationPopover, "openBy");

		// act
		oNavigationPopover.show();

		// assertions
		assert.ok(oNavigationPopover.openBy.called);

		// cleanup
		oNavigationPopover.destroy();
	});

	QUnit.test("actions", function(assert) {
		// system under test
		var oNavigationPopover = new NavigationPopover({
			availableActions: [
				new LinkData({
					text: "Link1",
					href: "href1"
				}), new LinkData({
					text: "Link2",
					href: "href2"
				})
			]
		});

		// assertions
		assert.equal(oNavigationPopover._getContentContainer().getItems().length, 4);
		assert.equal(oNavigationPopover._getContentContainer().getItems()[2].getItems().length, 2, "Actions");
		assert.equal(oNavigationPopover._getContentContainer().getItems()[2].getItems()[0].getItems()[0].getText(), "Link1");
		assert.equal(oNavigationPopover._getContentContainer().getItems()[2].getItems()[0].getItems()[0].getHref(), "href1");
		assert.equal(oNavigationPopover._getContentContainer().getItems()[2].getItems()[1].getItems()[0].getText(), "Link2");
		assert.equal(oNavigationPopover._getContentContainer().getItems()[2].getItems()[1].getItems()[0].getHref(), "href2");

		// cleanup
		oNavigationPopover.destroy();
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationPopover", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});
	QUnit.test("setExtraContent", function(assert) {
		// system under test
		var oText1 = new Text();
		var oNavigationPopover = new NavigationPopover({
			extraContent: oText1
		});

		// assertions
		assert.deepEqual(oNavigationPopover.getExtraContent(), oText1.getId());
		assert.equal(oNavigationPopover._getContentContainer().getItems().length, 5);
		assert.equal(oNavigationPopover._getContentContainer().getItems()[1], oText1);

		// act
		oNavigationPopover.setExtraContent(oText1);

		// assertions
		assert.deepEqual(oNavigationPopover.getExtraContent(), oText1.getId());
		assert.equal(oNavigationPopover._getContentContainer().getItems().length, 5, "Content should not change if same control was added twice");
		assert.equal(oNavigationPopover._getContentContainer().getItems()[1], oText1);

		// act
		var oText2 = new Text();
		oNavigationPopover.setExtraContent(oText2);

		// assertions
		assert.equal(oNavigationPopover.getExtraContent(), oText2.getId(), "Association has to be filled correctly");
		assert.equal(oNavigationPopover._getContentContainer().getItems().length, 5);
		assert.equal(oNavigationPopover._getContentContainer().getItems()[1], oText2, "Control has to be in the content aggregation");
		assert.ok(!oText1.getParent(), "Control should have been removed after new control has been set");
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationPopover: getDirectLink", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});

	QUnit.test("only main link", function(assert) {
		// act: visible LinkData
		var oNavigationPopover = new NavigationPopover({
			mainNavigation: new LinkData({
				href: "href",
				text: "link"
			})
		});
		// assertions
		assert.ok(oNavigationPopover.getDirectLink());
		assert.ok(oNavigationPopover.getDirectLink() instanceof Link);

		// act: invisible LinkData
		oNavigationPopover = new NavigationPopover({
			mainNavigation: new LinkData({
				href: "href",
				text: "link",
				visible: false
			})
		});
		// assertions
		assert.ok(oNavigationPopover.getDirectLink());
		assert.ok(oNavigationPopover.getDirectLink() instanceof Link);

		// act: visible LinkData in combination with subTitle
		oNavigationPopover = new NavigationContainer({
			mainNavigation: new LinkData({
				href: "href",
				text: "link",
				description: "Additional info"
			})
		});
		// assertions
		assert.ok(oNavigationPopover.getDirectLink());
		assert.ok(oNavigationPopover.getDirectLink() instanceof Link);

		// cleanup
		oNavigationPopover.destroy();
	});

	QUnit.test("only one action", function(assert) {
		// act: visible LinkData
		var oNavigationPopover = new NavigationPopover({
			availableActions: [
				new LinkData({
					href: "href",
					text: "link"
				})
			]
		});
		// assertions
		assert.ok(oNavigationPopover.getDirectLink());
		assert.ok(oNavigationPopover.getDirectLink() instanceof Link);

		// act: invisible LinkData
		oNavigationPopover = new NavigationPopover({
			availableActions: [
				new LinkData({
					href: "href",
					text: "link",
					visible: false
				})
			]
		});
		// assertions
		assert.ok(oNavigationPopover.getDirectLink());
		assert.ok(oNavigationPopover.getDirectLink() instanceof Link);

		// act: visible LinkData in combination with subTitle
		oNavigationPopover = new NavigationContainer({
			availableActions: [
				new LinkData({
					href: "href",
					text: "link",
					description: "Additional info"
				})
			]
		});
		// assertions
		assert.ok(oNavigationPopover.getDirectLink(), "If only one available action exists (independent whether it is visible or not), direct navigation is possible");
		assert.ok(oNavigationPopover.getDirectLink() instanceof Link);

		// cleanup
		oNavigationPopover.destroy();
	});

	QUnit.test("only extraContent", function(assert) {
		// act
		var oNavigationPopover = new NavigationPopover({
			extraContent: new Control()
		});

		// assertions
		assert.ok(!oNavigationPopover.getDirectLink());

		// cleanup
		oNavigationPopover.destroy();
	});

	QUnit.test("main link and action", function(assert) {
		// act: visible LinkData
		var oNavigationPopover = new NavigationPopover({
			mainNavigation: new LinkData({
				href: "href1",
				text: "link1"
			}),
			availableActions: [
				new LinkData({
					href: "href2",
					text: "link2"
				})
			]
		});
		// assertions
		assert.ok(!oNavigationPopover.getDirectLink());

		// act: invisible LinkData
		oNavigationPopover = new NavigationPopover({
			mainNavigation: new LinkData({
				href: "href1",
				text: "link1",
				visible: false
			}),
			availableActions: [
				new LinkData({
					href: "href2",
					text: "link2",
					visible: false
				})
			]
		});
		// assertions
		assert.ok(!oNavigationPopover.getDirectLink());

		// cleanup
		oNavigationPopover.destroy();
	});

	QUnit.test("main link and extraContent", function(assert) {
		// act: visible LinkData
		var oNavigationPopover = new NavigationPopover({
			mainNavigation: new LinkData({
				href: "href1",
				text: "link1"
			}),
			extraContent: new Control()
		});
		// assertions
		assert.ok(!oNavigationPopover.getDirectLink());

		// act: invisible LinkData
		oNavigationPopover = new NavigationPopover({
			mainNavigation: new LinkData({
				href: "href1",
				text: "link1"
			}),
			extraContent: new Control()
		});
		// assertions
		assert.ok(!oNavigationPopover.getDirectLink());

		// cleanup
		oNavigationPopover.destroy();
	});

	QUnit.test("action and extraContent", function(assert) {
		// act: visible LinkData
		var oNavigationPopover = new NavigationPopover({
			availableActions: [
				new LinkData({
					href: "href2",
					text: "link2"
				})
			],
			extraContent: new Control()
		});
		// assertions
		assert.ok(!oNavigationPopover.getDirectLink());

		// act: invisible LinkData
		oNavigationPopover = new NavigationPopover({
			availableActions: [
				new LinkData({
					href: "href2",
					text: "link2"
				})
			],
			extraContent: new Control()
		});
		// assertions
		assert.ok(!oNavigationPopover.getDirectLink());

		// cleanup
		oNavigationPopover.destroy();
	});

	QUnit.test("main link, action and extraContent", function(assert) {
		// act: visible LinkData
		var oNavigationPopover = new NavigationPopover({
			mainNavigation: new LinkData({
				href: "href1",
				text: "link1"
			}),
			availableActions: [
				new LinkData({
					href: "href2",
					text: "link2"
				})
			],
			extraContent: new Control()
		});
		// assertions
		assert.ok(!oNavigationPopover.getDirectLink());

		// act: invisible LinkData
		oNavigationPopover = new NavigationPopover({
			mainNavigation: new LinkData({
				href: "href1",
				text: "link1"
			}),
			availableActions: [
				new LinkData({
					href: "href2",
					text: "link2"
				})
			],
			extraContent: new Control()
		});
		// assertions
		assert.ok(!oNavigationPopover.getDirectLink());

		// cleanup
		oNavigationPopover.destroy();
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationPopover", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});

	QUnit.test("Main link: with no href", function(assert) {
		// system under test
		var oText = new Text({
			text: "any source"
		});
		var oNavigationPopover = new NavigationPopover({
			mainNavigation: new LinkData({
				text: "text of Mainlink"
			}),
			availableActions: [
				new LinkData({
					href: "href1",
					text: "text of action link1"
				}), new LinkData({
					href: "href2",
					text: "text of action link2"
				})
			],
			source: oText
		});

		// arrange
		oText.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		oNavigationPopover.show();
		oSinonClock.tick(1000);

		// assertions
		assert.equal(oNavigationPopover.$().find("a").length, 3);
		assert.equal(oNavigationPopover.$().find("a")[0].text, "text of Mainlink");

		// cleanup
		oNavigationPopover.destroy();
		oText.destroy();
	});

	QUnit.test("Main link: with no href and mainNavigationId", function(assert) {
		// system under test
		var oText = new Text({
			text: "any source"
		});
		var oNavigationPopover = new NavigationPopover({
			mainNavigationId: "Title of Mainlink",
			mainNavigation: new LinkData({
				text: "dummy"
			}),
			availableActions: [
				new LinkData({
					href: "href1",
					text: "text of action link1"
				}), new LinkData({
					href: "href2",
					text: "text of action link2"
				})
			],
			source: oText
		});

		// arrange
		oText.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		oNavigationPopover.show();
		oSinonClock.tick(1000);

		// assertions
		assert.equal(oNavigationPopover.$().find("a").length, 3);
		assert.equal(oNavigationPopover.$().find("a")[0].text, "Title of Mainlink");

		// cleanup
		oNavigationPopover.destroy();
		oText.destroy();
	});

	QUnit.test("Title of main link: with no title", function(assert) {
		// system under test
		var oText = new Text({
			text: "any source"
		});
		var oNavigationPopover = new NavigationPopover({
			mainNavigation: new LinkData({
				href: "href",
				text: "text of Mainlink"
			}),
			source: oText
		});

		// arrange
		oText.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		oNavigationPopover.show();

		// assertions
		assert.equal(oNavigationPopover.getMainNavigationId(), "");
		assert.ok(oNavigationPopover.getDomRef());

		// cleanup
		oNavigationPopover.destroy();
		oText.destroy();
	});

	QUnit.test("Title of main link: with title", function(assert) {
		// system under test
		var oText = new Text({
			text: "any source"
		});
		var oNavigationPopover = new NavigationPopover({
			mainNavigationId: "Title of Mainlink",
			mainNavigation: new LinkData({
				href: "href",
				text: "text of Mainlink"
			}),
			source: oText
		});

		// arrange
		oText.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		oNavigationPopover.show();

		// assertions
		assert.equal(oNavigationPopover.getMainNavigationId(), "Title of Mainlink");
		assert.ok(oNavigationPopover.getDomRef());

		// cleanup
		oNavigationPopover.destroy();
		oText.destroy();
	});

	QUnit.test("event 'navigate': mainNavigationLink", function(assert) {
		// system under test
		var oText = new Text({
			text: "any source"
		});
		var oNavigationPopover = new NavigationPopover({
			mainNavigationId: "Title of Mainlink",
			mainNavigation: new LinkData({
				href: "href",
				text: "text of Mainlink"
			}),
			source: oText
		});

		// arrange
		var fnFireNavigateSpy = sinon.spy(oNavigationPopover, "fireNavigate");

		oText.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		oNavigationPopover.show();
		oSinonClock.tick(500);

		// act
		qutils.triggerEvent("click", oNavigationPopover.$().find("a")[0], {
			srcControl: oNavigationPopover
		});
		qutils.triggerTouchEvent("tap", oNavigationPopover.$().find("a")[0], {
			srcControl: oNavigationPopover
		});

		// assertions
		assert.ok(fnFireNavigateSpy.calledOnce);

		// cleanup
		oNavigationPopover.destroy();
		oText.destroy();
		oNavigationPopover.fireNavigate.restore();
	});

	QUnit.test("event 'navigate': availableAction", function(assert) {
		// system under test
		var oText = new Text({
			text: "any source"
		});
		var oNavigationPopover = new NavigationPopover({
			mainNavigationId: "Title of Mainlink",
			mainNavigation: new LinkData({
				href: "href",
				text: "text of Mainlink"
			}),
			availableActions: [
				new LinkData({
					href: "href",
					text: "text of action link"
				})
			],
			source: oText
		});

		// arrange
		var fnFireNavigateSpy = sinon.spy(oNavigationPopover, "fireNavigate");

		oText.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		oNavigationPopover.show();
		oSinonClock.tick(500);

		// act
		qutils.triggerEvent("click", oNavigationPopover.$().find("a")[0], {
			srcControl: oNavigationPopover
		});
		qutils.triggerTouchEvent("tap", oNavigationPopover.$().find("a")[0], {
			srcControl: oNavigationPopover
		});

		// assertions
		assert.ok(fnFireNavigateSpy.calledOnce);

		// cleanup
		oNavigationPopover.destroy();
		oText.destroy();
		oNavigationPopover.fireNavigate.restore();
	});

	QUnit.test("availableAction", function(assert) {
		// system under test
		var oText = new Text({
			text: "any source"
		});
		var oNavigationPopover = new NavigationPopover({
			mainNavigationId: "Title of Mainlink",
			mainNavigation: new LinkData({
				href: "href",
				text: "text of Mainlink"
			}),
			availableActions: [
				new LinkData({
					href: "href",
					text: "text of action link"
				})
			],
			source: oText
		});

		// arrange
		oText.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		oNavigationPopover.show();

		// assertions
		assert.equal(oNavigationPopover._oPersonalizationButton.getVisible(), false);

		// cleanup
		oNavigationPopover.destroy();
		oText.destroy();
	});

	QUnit.start();

});
