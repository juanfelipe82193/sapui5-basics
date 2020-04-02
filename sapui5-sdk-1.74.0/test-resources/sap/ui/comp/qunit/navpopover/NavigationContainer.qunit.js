/* global  QUnit, sinon */

sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/comp/navpopover/NavigationContainer",
	"sap/ui/comp/navpopover/LinkData",
	"sap/m/Text",
	"sap/m/Link",
	"sap/m/Button",
	"sap/ui/core/Control",
	"sap/ui/fl/apply/api/FlexRuntimeInfoAPI"
], function(
	qutils,
	NavigationContainer,
	LinkData,
	Text,
	Link,
	Button,
	Control,
	FlexRuntimeInfoAPI
) {
	"use strict";

	QUnit.module("sap.ui.comp.navpopover.NavigationContainer", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(new NavigationContainer());
	});

	QUnit.test("constructor", function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer({});

		// assert
		assert.equal(oNavigationContainer.getEnableAvailableActionsPersonalization(), true);
		assert.deepEqual(oNavigationContainer.getAvailableActions(), []); // Default value of an aggregation
		assert.deepEqual(oNavigationContainer.getMainNavigation(), null);
		assert.deepEqual(oNavigationContainer.getExtraContent(), null);
		assert.deepEqual(oNavigationContainer.getComponent(), null);

		// cleanup
		oNavigationContainer.destroy();
	});

	/*------------------------------------------------------------------------------------*/

	QUnit.test("display - mainNavigationId", function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer({
			mainNavigationId: "myMainNavigationId"
		});

		// arrange

		// act
		oNavigationContainer.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// assertions
		assert.ok(oNavigationContainer.getDomRef());
		assert.equal(oNavigationContainer.$().find("button").length, 0);
		assert.equal(oNavigationContainer.$().find("a").length, 1);
		assert.equal(oNavigationContainer.$().find("a")[0].text, "myMainNavigationId");
		assert.equal(oNavigationContainer.$().find("a")[0].attributes.disabled.value, 'true');

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("display - mainNavigation", function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer({
			mainNavigation: new LinkData({
				text: "Main",
				description: "SubTitle",
				href: "href1"
			})
		});

		// arrange

		// act
		oNavigationContainer.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// assertions
		assert.ok(oNavigationContainer.getDomRef());
		assert.equal(oNavigationContainer.$().find("button").length, 0);
		assert.equal(oNavigationContainer.$().find("a").length, 1);
		assert.equal(oNavigationContainer.$().find("a")[0].text, "Main");
		assert.ok(oNavigationContainer.$().find("a")[0].href.endsWith("href1"));
		assert.equal(oNavigationContainer.$().find("a")[0].attributes.disabled, undefined);
		assert.equal(oNavigationContainer.$().find("span")[0].textContent, "SubTitle");

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("display - mainNavigation with no href", function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer({
			mainNavigation: new LinkData({
				text: "Main",
				description: "SubTitle"
			})
		});

		// arrange

		// act
		oNavigationContainer.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// assertions
		assert.ok(oNavigationContainer.getDomRef());
		assert.equal(oNavigationContainer.$().find("button").length, 0);
		assert.equal(oNavigationContainer.$().find("a").length, 1);
		assert.equal(oNavigationContainer.$().find("a")[0].text, "Main");
		assert.equal(oNavigationContainer.$().find("a")[0].attributes.disabled.value, 'true');
		assert.equal(oNavigationContainer.$().find("span")[0].textContent, "SubTitle");

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("display - mainNavigation with no href and not empty mainNavigationId", function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer({
			mainNavigationId: "myMainNavigationId",
			mainNavigation: new LinkData({
				text: "Main",
				description: "SubTitle"
			})
		});

		// arrange

		// act
		oNavigationContainer.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// assertions
		assert.ok(oNavigationContainer.getDomRef());
		assert.equal(oNavigationContainer.$().find("button").length, 0);
		assert.equal(oNavigationContainer.$().find("a").length, 1);
		assert.equal(oNavigationContainer.$().find("a")[0].text, "myMainNavigationId");
		assert.equal(oNavigationContainer.$().find("a")[0].attributes.disabled.value, 'true');
		assert.equal(oNavigationContainer.$().find("span")[0].textContent, "SubTitle");

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("display - mainNavigation with not empty mainNavigationId", function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer({
			mainNavigationId: 'myMainNavigation',
			mainNavigation: new LinkData({
				text: "Main",
				description: "SubTitle",
				href: "href1"
			})
		});

		// arrange

		// act
		oNavigationContainer.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// assertions
		assert.ok(oNavigationContainer.getDomRef());
		assert.equal(oNavigationContainer.$().find("button").length, 0);
		assert.equal(oNavigationContainer.$().find("a").length, 1);
		assert.equal(oNavigationContainer.$().find("a")[0].text, "myMainNavigation");
		assert.ok(oNavigationContainer.$().find("a")[0].href.endsWith("href1"));
		assert.equal(oNavigationContainer.$().find("a")[0].attributes.disabled, undefined);
		assert.equal(oNavigationContainer.$().find("span")[0].textContent, "SubTitle");

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("display - mainNavigation with empty mainNavigationId", function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer({
			mainNavigationId: '',
			mainNavigation: new LinkData({
				text: "Main",
				description: "SubTitle",
				href: "href1"
			})
		});

		// arrange

		// act
		oNavigationContainer.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// assertions
		assert.ok(oNavigationContainer.getDomRef());
		assert.equal(oNavigationContainer.$().find("a").length, 0);
		assert.equal(oNavigationContainer.$().find("button").length, 0);

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("display - availableActions", function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer({
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

		// act
		oNavigationContainer.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// assertions
		assert.ok(oNavigationContainer.getDomRef());
		assert.equal(oNavigationContainer.$().find("button").length, 0);
		assert.equal(oNavigationContainer.$().find("a").length, 2);
		assert.equal(oNavigationContainer.$().find("a")[0].text, "Link1");
		assert.ok(oNavigationContainer.$().find("a")[0].href.endsWith("href1"));
		assert.equal(oNavigationContainer.$().find("a")[0].attributes.disabled, undefined);
		assert.equal(oNavigationContainer.$().find("a")[1].text, "Link2");
		assert.ok(oNavigationContainer.$().find("a")[1].href.endsWith("href2"));
		assert.equal(oNavigationContainer.$().find("a")[1].attributes.disabled, undefined);

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("display - extraContent", function(assert) {
		// system under test
		var oText1 = new Text({
			text: "myText"
		});
		var oNavigationContainer = new NavigationContainer({
			extraContent: oText1
		});

		// act
		oNavigationContainer.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// assertions
		assert.deepEqual(oNavigationContainer.getExtraContent(), oText1.getId());
		assert.ok(oNavigationContainer.getDomRef());
		assert.equal(oNavigationContainer.$().find("#" + oText1.getId()).length, 1);
		assert.ok(oNavigationContainer.$().find("#" + oText1.getId())[0].textContent.endsWith("myText"));

		// act
		oNavigationContainer.setExtraContent(oText1);
		sap.ui.getCore().applyChanges();

		// assertions
		assert.deepEqual(oNavigationContainer.getExtraContent(), oText1.getId(), "Content should not change if same control was added twice");
		assert.ok(oNavigationContainer.getDomRef());
		assert.equal(oNavigationContainer.$().find("#" + oText1.getId()).length, 1);
		assert.ok(oNavigationContainer.$().find("#" + oText1.getId())[0].textContent.endsWith("myText"));

		// act
		var oText2 = new Text({
			text: "myTextNew"
		});
		oNavigationContainer.setExtraContent(oText2);
		sap.ui.getCore().applyChanges();

		// assertions
		assert.deepEqual(oNavigationContainer.getExtraContent(), oText2.getId());
		assert.ok(oNavigationContainer.getDomRef());
		assert.equal(oNavigationContainer.$().find("#" + oText2.getId()).length, 1);
		assert.ok(oNavigationContainer.$().find("#" + oText2.getId())[0].textContent.endsWith("myTextNew"));
		assert.ok(!oText1.getParent(), "Control should have been removed after new control has been set");

		// cleanup
		oNavigationContainer.destroy();
		oText1.destroy();
		oText2.destroy();
	});

	QUnit.test("display - mainNavigation, mainNavigationId, availableActions, extraContent", function(assert) {
		// system under test
		var oText1 = new Text({
			text: "myText"
		});
		var oNavigationContainer = new NavigationContainer({
			mainNavigationId: "myMainNavigationId",
			mainNavigation: new LinkData({
				text: "Main",
				description: "SubTitle",
				href: "href1"
			}),
			availableActions: [
				new LinkData({
					text: "Link1",
					href: "href1"
				}), new LinkData({
					text: "Link2",
					href: "href2"
				})
			],
			extraContent: oText1
		});

		// arrange

		// act
		oNavigationContainer.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// assertions
		assert.ok(oNavigationContainer.getDomRef());
		assert.equal(oNavigationContainer.$().find("button").length, 0);
		assert.equal(oNavigationContainer.$().find("a").length, 3);
		assert.equal(oNavigationContainer.$().find("a")[0].text, "myMainNavigationId");
		assert.ok(oNavigationContainer.$().find("a")[0].href.endsWith("href1"));
		assert.equal(oNavigationContainer.$().find("a")[0].attributes.disabled, undefined);
		assert.equal(oNavigationContainer.$().find("span")[0].textContent, "SubTitle");
		assert.equal(oNavigationContainer.$().find("a")[1].text, "Link1");
		assert.ok(oNavigationContainer.$().find("a")[1].href.endsWith("href1"));
		assert.equal(oNavigationContainer.$().find("a")[1].attributes.disabled, undefined);
		assert.equal(oNavigationContainer.$().find("a")[2].text, "Link2");
		assert.ok(oNavigationContainer.$().find("a")[2].href.endsWith("href2"));
		assert.equal(oNavigationContainer.$().find("a")[2].attributes.disabled, undefined);
		assert.equal(oNavigationContainer.$().find("#" + oText1.getId()).length, 1);
		assert.ok(oNavigationContainer.$().find("#" + oText1.getId())[0].textContent.endsWith("myText"));

		// cleanup
		oNavigationContainer.destroy();
		oText1.destroy();
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationContainer: getDirectLink", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});

	QUnit.test("only main link", function(assert) {
		// act: visible LinkData
		var oNavigationContainer = new NavigationContainer({
			mainNavigation: new LinkData({
				href: "href",
				text: "link"
			})
		});
		// assertions
		assert.ok(oNavigationContainer.getDirectLink());
		assert.ok(oNavigationContainer.getDirectLink() instanceof Link);

		// act: invisible LinkData
		oNavigationContainer = new NavigationContainer({
			mainNavigation: new LinkData({
				href: "href",
				text: "link",
				visible: false
			})
		});
		// assertions
		assert.ok(oNavigationContainer.getDirectLink(), "If only one available action exists (independent whether it is visible or not), direct navigation is possible");
		assert.ok(oNavigationContainer.getDirectLink() instanceof Link);

		// act: visible LinkData in combination with subTitle
		oNavigationContainer = new NavigationContainer({
			mainNavigation: new LinkData({
				href: "href",
				text: "link",
				description: "Additional info"
			})
		});
		// assertions
		assert.ok(oNavigationContainer.getDirectLink());
		assert.ok(oNavigationContainer.getDirectLink() instanceof Link);

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("only one action", function(assert) {
		// act: visible LinkData
		var oNavigationContainer = new NavigationContainer({
			availableActions: [
				new LinkData({
					href: "href",
					text: "link"
				})
			]
		});
		// assertions
		assert.ok(oNavigationContainer.getDirectLink());
		assert.ok(oNavigationContainer.getDirectLink() instanceof Link);

		// act: invisible LinkData
		oNavigationContainer = new NavigationContainer({
			availableActions: [
				new LinkData({
					href: "href",
					text: "link",
					visible: false
				})
			]
		});
		// assertions
		assert.ok(oNavigationContainer.getDirectLink(), "If only one available action exists (independent whether it is visible or not), direct navigation is possible");
		assert.ok(oNavigationContainer.getDirectLink() instanceof Link);

		// act: visible LinkData in combination with subTitle
		oNavigationContainer = new NavigationContainer({
			availableActions: [
				new LinkData({
					href: "href",
					text: "link",
					description: "Additional info"
				})
			]
		});
		// assertions
		assert.ok(oNavigationContainer.getDirectLink(), "If only one available action exists (independent whether it is visible or not), direct navigation is possible");
		assert.ok(oNavigationContainer.getDirectLink() instanceof Link);

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("only extraContent", function(assert) {
		// act
		var oNavigationContainer = new NavigationContainer({
			extraContent: new Control()
		});

		// assertions
		assert.ok(!oNavigationContainer.getDirectLink());

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("main link and action", function(assert) {
		// system under test

		// arrange

		// act: visible LinkData
		var oNavigationContainer = new NavigationContainer({
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
		assert.ok(!oNavigationContainer.getDirectLink());

		// act: invisible LinkData
		oNavigationContainer = new NavigationContainer({
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
		assert.ok(!oNavigationContainer.getDirectLink());

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("main link and extraContent", function(assert) {
		// system under test

		// arrange

		// act: visible LinkData
		var oNavigationContainer = new NavigationContainer({
			mainNavigation: new LinkData({
				href: "href1",
				text: "link1"
			}),
			extraContent: new Control()
		});
		// assertions
		assert.ok(!oNavigationContainer.getDirectLink());

		// act: invisible LinkData
		oNavigationContainer = new NavigationContainer({
			mainNavigation: new LinkData({
				href: "href1",
				text: "link1"
			}),
			extraContent: new Control()
		});
		// assertions
		assert.ok(!oNavigationContainer.getDirectLink());

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("action and extraContent", function(assert) {
		// system under test

		// arrange

		// act: visible LinkData
		var oNavigationContainer = new NavigationContainer({
			availableActions: [
				new LinkData({
					href: "href2",
					text: "link2"
				})
			],
			extraContent: new Control()
		});
		// assertions
		assert.ok(!oNavigationContainer.getDirectLink());

		// act: invisible LinkData
		oNavigationContainer = new NavigationContainer({
			availableActions: [
				new LinkData({
					href: "href2",
					text: "link2"
				})
			],
			extraContent: new Control()
		});
		// assertions
		assert.ok(!oNavigationContainer.getDirectLink());

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("main link, action and extraContent", function(assert) {
		// system under test

		// arrange

		// act: visible LinkData
		var oNavigationContainer = new NavigationContainer({
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
		assert.ok(!oNavigationContainer.getDirectLink());

		// act: invisible LinkData
		oNavigationContainer = new NavigationContainer({
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
		assert.ok(!oNavigationContainer.getDirectLink());

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationContainer", {
		beforeEach: function() {
		},
		afterEach: function() {
		}
	});

	QUnit.test("event 'navigate': mainNavigationLink", function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer({
			mainNavigation: new LinkData({
				text: "Main",
				description: "SubTitle",
				href: "href"
			})
		});

		// arrange
		var fnFireNavigateSpy = sinon.spy(oNavigationContainer, "fireNavigate");

		oNavigationContainer.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		qutils.triggerEvent("click", oNavigationContainer.$().find("a")[0], {
			srcControl: oNavigationContainer
		});
		qutils.triggerTouchEvent("tap", oNavigationContainer.$().find("a")[0], {
			srcControl: oNavigationContainer
		});

		// assertions
		assert.ok(fnFireNavigateSpy.calledOnce);

		// cleanup
		oNavigationContainer.destroy();
		oNavigationContainer.fireNavigate.restore();
	});

	QUnit.test("event 'navigate': availableAction", function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer({
			mainNavigation: new LinkData({
				href: "href",
				text: "text of Mainlink"
			}),
			availableActions: [
				new LinkData({
					href: "href",
					text: "text of action link"
				})
			]
		});

		// arrange
		var fnFireNavigateSpy = sinon.spy(oNavigationContainer, "fireNavigate");

		oNavigationContainer.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// act
		sap.ui.test.qunit.triggerEvent("click", oNavigationContainer.$().find("a")[1], {
			srcControl: oNavigationContainer
		});
		sap.ui.test.qunit.triggerTouchEvent("tap", oNavigationContainer.$().find("a")[1], {
			srcControl: oNavigationContainer
		});

		// assertions
		assert.ok(fnFireNavigateSpy.calledOnce);

		// cleanup
		oNavigationContainer.destroy();
		oNavigationContainer.fireNavigate.restore();
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationContainer: enableAvailableActionsPersonalization", {
		beforeEach: function() {
		},
		afterEach: function() {
			this.oNavigationContainer.destroy();
		}
	});
	QUnit.test("personalization link is not visible if enableAvailableActionsPersonalization is not set", function(assert) {
		this.oNavigationContainer = new NavigationContainer({
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
			]
		});
		this.oNavigationContainer.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// assertions
		assert.ok(this.oNavigationContainer.getDomRef());
		assert.equal(this.oNavigationContainer.$().find("button").length, 0, "personalization link is invisible");
		assert.equal(this.oNavigationContainer.$().find("a").length, 2);
		assert.equal(this.oNavigationContainer.$().find("a")[0].text, "Title of Mainlink");
		assert.equal(this.oNavigationContainer.$().find("a")[1].text, "text of action link");

	});

	QUnit.test("personalization link is visible if enableAvailableActionsPersonalization is set", function(assert) {
		this.oNavigationContainer = new NavigationContainer({
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
			enableAvailableActionsPersonalization: true
		});
		this.oNavigationContainer.placeAt("qunit-fixture");
		sap.ui.getCore().applyChanges();

		// assertions
		assert.ok(this.oNavigationContainer.getDomRef());
		assert.equal(this.oNavigationContainer.$().find("button").length, 1, "personalization link is visible");
		assert.equal(this.oNavigationContainer.$().find("a")[0].text, "Title of Mainlink");
		assert.equal(this.oNavigationContainer.$().find("a")[1].text, "text of action link");
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationContainer: update availableAction aggregation", {
		beforeEach: function() {
			this.oNavigationContainer = new NavigationContainer({
				availableActions: [
					new LinkData({
						key: "link01",
						visible: false
					}), new LinkData({
						key: "link02",
						visible: false
					})
				]
			});
			this.oNavigationContainer.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oNavigationContainer.destroy();
		}
	});
	QUnit.test("test 01", function(assert) {
		// assert before act
		assert.ok(this.oNavigationContainer.getDomRef());
		assert.equal(this.oNavigationContainer.$().find("button").length, 0);
		assert.equal(this.oNavigationContainer.$().find("a").length, 0);

		assert.equal(this.oNavigationContainer._oActionArea.getVisible(), false, "Container of availableActions");
		assert.equal(this.oNavigationContainer._oActionArea.getItems().length, 2, "availableActions");
		assert.equal(this.oNavigationContainer._oActionArea.getItems()[0].getVisible(), false, "first availableAction");
		assert.equal(this.oNavigationContainer._oActionArea.getItems()[1].getVisible(), false, "second availableAction");

		// act
		this.oNavigationContainer.getAvailableActions()[0].setVisible(true);

		// assert
		assert.equal(this.oNavigationContainer.$().find("button").length, 0);
		assert.equal(this.oNavigationContainer._oActionArea.getVisible(), true, "Container of availableActions");
		assert.equal(this.oNavigationContainer._oActionArea.getItems().length, 2, "availableActions");
		assert.equal(this.oNavigationContainer._oActionArea.getItems()[0].getVisible(), true, "first availableAction");
		assert.equal(this.oNavigationContainer._oActionArea.getItems()[1].getVisible(), false, "second availableAction");

		// act
		this.oNavigationContainer.getAvailableActions()[0].setVisible(false);
		this.oNavigationContainer.getAvailableActions()[1].setVisible(true);

		// assert
		assert.equal(this.oNavigationContainer.$().find("button").length, 0);
		assert.equal(this.oNavigationContainer._oActionArea.getVisible(), true, "Container of availableActions");
		assert.equal(this.oNavigationContainer._oActionArea.getItems().length, 2, "availableActions");
		assert.equal(this.oNavigationContainer._oActionArea.getItems()[0].getVisible(), false, "first availableAction");
		assert.equal(this.oNavigationContainer._oActionArea.getItems()[1].getVisible(), true, "second availableAction");
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationContainer: open selection dialog", {
		beforeEach: function() {
			this.oButton = new Button({
				text: "More Links"
			});

			sinon.stub(FlexRuntimeInfoAPI, "waitForChanges").resolves();

			this.oButton = new Button({
				text: "More Links"
			});
			this.oNavigationContainer = new NavigationContainer({
				availableActions: [
					new LinkData({
						key: "link01",
						text: "Link 01",
						visible: false
					}), new LinkData({
						key: "link02",
						text: "Link 02",
						visible: false
					})
				]
			});
			this.oButton.addDependent(this.oNavigationContainer);

			this.oButton.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oButton.destroy();
			this.oNavigationContainer.destroy();
		}
	});
	QUnit.test("test 01", function(assert) {
		// assert before act
		assert.equal(this.oButton.getDependents().length, 1);
		assert.equal(this.oButton.getDependents()[0], this.oNavigationContainer);

		// act
		var done = assert.async();
		sap.ui.getCore().loadLibrary('sap.ui.fl', {
			async: true
		}).then(function() {

			this.oNavigationContainer.openSelectionDialog(false, true, undefined, true, undefined, this.oButton);

			setTimeout(function() {
				assert.equal(this.oButton.getDependents().length, 2);
				assert.equal(this.oButton.getDependents()[0], this.oNavigationContainer);
				assert.ok(this.oButton.getDependents()[1].isA("sap.m.P13nDialog"));
				done();
			}.bind(this), 0);

		}.bind(this));
	});

	QUnit.start();
});
