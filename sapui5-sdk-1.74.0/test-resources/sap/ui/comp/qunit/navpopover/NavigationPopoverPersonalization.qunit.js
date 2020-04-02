/* global QUnit */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/navpopover/NavigationContainer", "sap/ui/comp/navpopover/flexibility/changes/AddLink", "sap/ui/comp/navpopover/flexibility/changes/RemoveLink", "sap/ui/comp/personalization/Util", "sap/ui/fl/Change", "sap/ui/core/util/reflection/JsControlTreeModifier", "sap/ui/comp/navpopover/LinkData"

], function(NavigationContainer, AddLink, RemoveLink, Util, Change, JsControlTreeModifier, LinkData) {
	"use strict";

	QUnit.module("sap.ui.comp.navpopover.NavigationContainer - addLink", {
		beforeEach: function() {
			this._aLinksInvisible = [
				{
					key: "action1",
					href: "?TestObject#/dummyLink1",
					text: "Link1",
					visible: false
				}, {
					key: "action2",
					href: "?TestObject#/dummyLink2",
					text: "Link2",
					visible: false
				}, {
					key: "action3",
					href: "?TestObject#/dummyLink3",
					text: "Link3",
					visible: false
				}
			];
			this._aLinksVisible = [
				{
					key: "action4",
					href: "?TestObject#/dummyLink1",
					text: "Link1",
					visible: true
				}, {
					key: "action5",
					href: "?TestObject#/dummyLink2",
					text: "Link2",
					visible: true
				}, {
					key: "action6",
					href: "?TestObject#/dummyLink3",
					text: "Link3",
					visible: true
				}
			];
		},
		afterEach: function() {
		}
	});

	QUnit.test("applyChange: all invisible -> apply corrupt change", function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer("IDNavigationContainer", {
			availableActions: this._aLinksInvisible.map(function(oMLink) {
				return new LinkData({
					key: oMLink.key,
					href: oMLink.href,
					text: oMLink.text,
					visible: oMLink.visible
				});
			})
		});

		// arrange

		// act
		AddLink.applyChange(new Change({
			content: {}
		}), oNavigationContainer, {
			modifier: JsControlTreeModifier
		});

		// assert
		assert.equal(oNavigationContainer.getAvailableActions().length, 3);
		assert.equal(oNavigationContainer.getAvailableActions()[0].getText(), this._aLinksInvisible[0].text);
		assert.equal(oNavigationContainer.getAvailableActions()[0].getVisible(), false);
		assert.equal(oNavigationContainer.getAvailableActions()[1].getText(), this._aLinksInvisible[1].text);
		assert.equal(oNavigationContainer.getAvailableActions()[1].getVisible(), false);
		assert.equal(oNavigationContainer.getAvailableActions()[2].getText(), this._aLinksInvisible[2].text);
		assert.equal(oNavigationContainer.getAvailableActions()[2].getVisible(), false);

		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions").length, 3);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), this._aLinksInvisible[0].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), false);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/text"), this._aLinksInvisible[1].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/visible"), false);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/text"), this._aLinksInvisible[2].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/visible"), false);

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("applyChange: all invisible -> set 'dummy' visible", function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer("IDNavigationContainer", {
			availableActions: this._aLinksInvisible.map(function(oMLink) {
				return new LinkData({
					key: oMLink.key,
					href: oMLink.href,
					text: oMLink.text,
					visible: oMLink.visible
				});
			})
		});

		// arrange

		// act
		AddLink.applyChange(new Change({
			content: {
				key: "dummy",
				visible: true
			}
		}), oNavigationContainer, {
			modifier: JsControlTreeModifier
		});

		// assert
		assert.equal(oNavigationContainer.getAvailableActions().length, 3);
		assert.equal(oNavigationContainer.getAvailableActions()[0].getText(), this._aLinksInvisible[0].text);
		assert.equal(oNavigationContainer.getAvailableActions()[0].getVisible(), false);
		assert.equal(oNavigationContainer.getAvailableActions()[1].getText(), this._aLinksInvisible[1].text);
		assert.equal(oNavigationContainer.getAvailableActions()[1].getVisible(), false);
		assert.equal(oNavigationContainer.getAvailableActions()[2].getText(), this._aLinksInvisible[2].text);
		assert.equal(oNavigationContainer.getAvailableActions()[2].getVisible(), false);

		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions").length, 3);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), this._aLinksInvisible[0].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), false);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/text"), this._aLinksInvisible[1].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/visible"), false);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/text"), this._aLinksInvisible[2].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/visible"), false);

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("applyChange: all invisible -> set first visible", function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer("IDNavigationContainer", {
			availableActions: this._aLinksInvisible.map(function(oMLink) {
				return new LinkData({
					key: oMLink.key,
					href: oMLink.href,
					text: oMLink.text,
					visible: oMLink.visible
				});
			})
		});

		// arrange

		// act
		AddLink.applyChange(new Change({
			layer: "USER",
			content: {
				key: this._aLinksInvisible[0].key,
				visible: true
			}
		}), oNavigationContainer, {
			modifier: JsControlTreeModifier
		});

		// assert
		assert.equal(oNavigationContainer.getAvailableActions().length, 3);
		assert.equal(oNavigationContainer.getAvailableActions()[0].getText(), this._aLinksInvisible[0].text);
		assert.equal(oNavigationContainer.getAvailableActions()[0].getVisible(), true);
		assert.equal(oNavigationContainer.getAvailableActions()[1].getText(), this._aLinksInvisible[1].text);
		assert.equal(oNavigationContainer.getAvailableActions()[1].getVisible(), false);
		assert.equal(oNavigationContainer.getAvailableActions()[2].getText(), this._aLinksInvisible[2].text);
		assert.equal(oNavigationContainer.getAvailableActions()[2].getVisible(), false);

		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions").length, 3);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), this._aLinksInvisible[0].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), true);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/text"), this._aLinksInvisible[1].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/visible"), false);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/text"), this._aLinksInvisible[2].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/visible"), false);

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("applyChange: all visible -> set first visible", function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer("IDNavigationContainer", {
			availableActions: this._aLinksVisible.map(function(oMLink) {
				return new LinkData({
					key: oMLink.key,
					href: oMLink.href,
					text: oMLink.text,
					visible: oMLink.visible
				});
			})
		});

		// arrange

		// act
		AddLink.applyChange(new Change({
			layer: "USER",
			content: {
				key: this._aLinksVisible[0].key,
				visible: true
			}
		}), oNavigationContainer, {
			modifier: JsControlTreeModifier
		});

		// assert
		assert.equal(oNavigationContainer.getAvailableActions().length, 3);
		assert.equal(oNavigationContainer.getAvailableActions()[0].getText(), this._aLinksVisible[0].text);
		assert.equal(oNavigationContainer.getAvailableActions()[0].getVisible(), true);
		assert.equal(oNavigationContainer.getAvailableActions()[1].getText(), this._aLinksVisible[1].text);
		assert.equal(oNavigationContainer.getAvailableActions()[1].getVisible(), true);
		assert.equal(oNavigationContainer.getAvailableActions()[2].getText(), this._aLinksVisible[2].text);
		assert.equal(oNavigationContainer.getAvailableActions()[2].getVisible(), true);

		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions").length, 3);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), this._aLinksVisible[0].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), true);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/text"), this._aLinksVisible[1].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/visible"), true);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/text"), this._aLinksVisible[2].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/visible"), true);

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("completeChangeContent: positive case", function(assert) {
		// system under test

		// arrange
		var oChange = new Change({});
		var oSpecificChangeInfo = {
			content: {
				key: "key01",
				visible: true
			}
		};

		// act
		AddLink.completeChangeContent(oChange, oSpecificChangeInfo, {});

		// assert
		assert.equal(oChange.getContent().key, "key01");
		assert.equal(oChange.getContent().visible, true);

		// cleanup
	});

	QUnit.test("completeChangeContent: negative cases", function(assert) {
		// system under test

		// arrange
		var bCatched;

		// act
		bCatched = false;
		try {
			AddLink.completeChangeContent(new Change({}), {
				dummy: {}
			}, {});
		} catch (ex) {
			bCatched = true;
		}
		// assert
		assert.ok(bCatched);

		// act
		bCatched = false;
		try {
			AddLink.completeChangeContent(new Change({}), {
				content: {
					key: undefined,
					visible: true
				}
			}, {});
		} catch (ex) {
			bCatched = true;
		}
		// assert
		assert.ok(bCatched);

		// act
		bCatched = false;
		try {
			AddLink.completeChangeContent(new Change({}), {
				content: {
					key: "key01",
					visible: undefined
				}
			}, {});
		} catch (ex) {
			bCatched = true;
		}
		// assert
		assert.ok(bCatched);

		// act
		bCatched = false;
		try {
			AddLink.completeChangeContent(new Change({}), {
				content: {
					key: "key01",
					visible: false
				}
			}, {});
		} catch (ex) {
			bCatched = true;
		}
		// assert
		assert.ok(bCatched);

		// cleanup
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationContainer - removeLink", {
		beforeEach: function() {
			this._aLinksInvisible = [
				{
					key: "action1",
					href: "?TestObject#/dummyLink1",
					text: "Link1",
					visible: false
				}, {
					key: "action2",
					href: "?TestObject#/dummyLink2",
					text: "Link2",
					visible: false
				}, {
					key: "action3",
					href: "?TestObject#/dummyLink3",
					text: "Link3",
					visible: false
				}
			];
			this._aLinksVisible = [
				{
					key: "action1",
					href: "?TestObject#/dummyLink1",
					text: "Link1",
					visible: true
				}, {
					key: "action2",
					href: "?TestObject#/dummyLink2",
					text: "Link2",
					visible: true
				}, {
					key: "action3",
					href: "?TestObject#/dummyLink3",
					text: "Link3",
					visible: true
				}
			];
		},
		afterEach: function() {
		}
	});

	QUnit.test("applyChange: all visible -> apply corrupt change", function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer("IDNavigationContainer", {
			availableActions: this._aLinksVisible.map(function(oMLink) {
				return new LinkData({
					key: oMLink.key,
					href: oMLink.href,
					text: oMLink.text,
					visible: oMLink.visible
				});
			})
		});

		// arrange

		// act
		RemoveLink.applyChange(new Change({
			content: {}
		}), oNavigationContainer, {
			modifier: JsControlTreeModifier
		});

		// assert
		assert.equal(oNavigationContainer.getAvailableActions().length, 3);
		assert.equal(oNavigationContainer.getAvailableActions()[0].getText(), this._aLinksVisible[0].text);
		assert.equal(oNavigationContainer.getAvailableActions()[0].getVisible(), true);
		assert.equal(oNavigationContainer.getAvailableActions()[1].getText(), this._aLinksVisible[1].text);
		assert.equal(oNavigationContainer.getAvailableActions()[1].getVisible(), true);
		assert.equal(oNavigationContainer.getAvailableActions()[2].getText(), this._aLinksVisible[2].text);
		assert.equal(oNavigationContainer.getAvailableActions()[2].getVisible(), true);

		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions").length, 3);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), this._aLinksVisible[0].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), true);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/text"), this._aLinksVisible[1].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/visible"), true);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/text"), this._aLinksVisible[2].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/visible"), true);

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("applyChange: all visible -> set 'dummy' invisible", function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer("IDNavigationContainer", {
			availableActions: this._aLinksVisible.map(function(oMLink) {
				return new LinkData({
					key: oMLink.key,
					href: oMLink.href,
					text: oMLink.text,
					visible: oMLink.visible
				});
			})
		});

		// arrange

		// act
		RemoveLink.applyChange(new Change({
			content: {
				key: "dummy",
				visible: false
			}
		}), oNavigationContainer, {
			modifier: JsControlTreeModifier
		});

		// assert
		assert.equal(oNavigationContainer.getAvailableActions().length, 3);
		assert.equal(oNavigationContainer.getAvailableActions()[0].getText(), this._aLinksVisible[0].text);
		assert.equal(oNavigationContainer.getAvailableActions()[0].getVisible(), true);
		assert.equal(oNavigationContainer.getAvailableActions()[1].getText(), this._aLinksVisible[1].text);
		assert.equal(oNavigationContainer.getAvailableActions()[1].getVisible(), true);
		assert.equal(oNavigationContainer.getAvailableActions()[2].getText(), this._aLinksVisible[2].text);
		assert.equal(oNavigationContainer.getAvailableActions()[2].getVisible(), true);

		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions").length, 3);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), this._aLinksVisible[0].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), true);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/text"), this._aLinksVisible[1].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/visible"), true);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/text"), this._aLinksVisible[2].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/visible"), true);

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("applyChange: all visible -> set first invisible", function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer("IDNavigationContainer", {
			availableActions: this._aLinksVisible.map(function(oMLink) {
				return new LinkData({
					key: oMLink.key,
					href: oMLink.href,
					text: oMLink.text,
					visible: oMLink.visible
				});
			})
		});

		// arrange

		// act
		RemoveLink.applyChange(new Change({
			layer: "USER",
			content: {
				key: this._aLinksVisible[0].key,
				visible: false
			}
		}), oNavigationContainer, {
			modifier: JsControlTreeModifier
		});

		// assert
		assert.equal(oNavigationContainer.getAvailableActions().length, 3);
		assert.equal(oNavigationContainer.getAvailableActions()[0].getText(), this._aLinksVisible[0].text);
		assert.equal(oNavigationContainer.getAvailableActions()[0].getVisible(), false);
		assert.equal(oNavigationContainer.getAvailableActions()[1].getText(), this._aLinksVisible[1].text);
		assert.equal(oNavigationContainer.getAvailableActions()[1].getVisible(), true);
		assert.equal(oNavigationContainer.getAvailableActions()[2].getText(), this._aLinksVisible[2].text);
		assert.equal(oNavigationContainer.getAvailableActions()[2].getVisible(), true);

		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions").length, 3);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), this._aLinksVisible[0].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), false);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/text"), this._aLinksVisible[1].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/visible"), true);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/text"), this._aLinksVisible[2].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/visible"), true);

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("applyChange: all invisible -> set all invisible", function(assert) {
		// system under test
		var oNavigationContainer = new NavigationContainer("IDNavigationContainer", {
			availableActions: this._aLinksInvisible.map(function(oMLink) {
				return new LinkData({
					key: oMLink.key,
					href: oMLink.href,
					text: oMLink.text,
					visible: oMLink.visible
				});
			})
		});

		// arrange

		// act
		RemoveLink.applyChange(new Change({
			layer: "USER",
			content: {
				key: this._aLinksInvisible[0].key,
				visible: false
			}
		}), oNavigationContainer, {
			modifier: JsControlTreeModifier
		});

		// assert
		assert.equal(oNavigationContainer.getAvailableActions().length, 3);
		assert.equal(oNavigationContainer.getAvailableActions()[0].getText(), this._aLinksInvisible[0].text);
		assert.equal(oNavigationContainer.getAvailableActions()[0].getVisible(), false);
		assert.equal(oNavigationContainer.getAvailableActions()[1].getText(), this._aLinksInvisible[1].text);
		assert.equal(oNavigationContainer.getAvailableActions()[1].getVisible(), false);
		assert.equal(oNavigationContainer.getAvailableActions()[2].getText(), this._aLinksInvisible[2].text);
		assert.equal(oNavigationContainer.getAvailableActions()[2].getVisible(), false);

		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions").length, 3);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), this._aLinksInvisible[0].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), false);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/text"), this._aLinksInvisible[1].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/visible"), false);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/text"), this._aLinksInvisible[2].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/visible"), false);

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("completeChangeContent: positive case", function(assert) {
		// system under test

		// arrange
		var oChange = new Change({});
		var oSpecificChangeInfo = {
			content: {
				key: "key01",
				visible: false
			}
		};

		// act
		RemoveLink.completeChangeContent(oChange, oSpecificChangeInfo, {});

		// assert
		assert.equal(oChange.getContent().key, "key01");
		assert.equal(oChange.getContent().visible, false);

		// cleanup
	});

	QUnit.test("completeChangeContent: negative cases", function(assert) {
		// system under test

		// arrange
		var bCatched;

		// act
		bCatched = false;
		try {
			RemoveLink.completeChangeContent(new Change({}), {
				dummy: {}
			}, {});
		} catch (ex) {
			bCatched = true;
		}
		// assert
		assert.ok(bCatched);

		// act
		bCatched = false;
		try {
			RemoveLink.completeChangeContent(new Change({}), {
				content: {
					key: undefined,
					visible: false
				}
			}, {});
		} catch (ex) {
			bCatched = true;
		}
		// assert
		assert.ok(bCatched);

		// act
		bCatched = false;
		try {
			RemoveLink.completeChangeContent(new Change({}), {
				content: {
					key: "key01",
					visible: undefined
				}
			}, {});
		} catch (ex) {
			bCatched = true;
		}
		// assert
		assert.ok(bCatched);

		// act
		bCatched = false;
		try {
			RemoveLink.completeChangeContent(new Change({}), {
				content: {
					key: "key01",
					visible: true
				}
			}, {});
		} catch (ex) {
			bCatched = true;
		}
		// assert
		assert.ok(bCatched);

		// cleanup
	});

	QUnit.module("sap.ui.comp.navpopover.NavigationContainer - mixed addLink and removeLink", {
		beforeEach: function() {
			// âêûîô
		},
		afterEach: function() {
		}
	});

	QUnit.test("applyChange: Â, E, Û, O -> A, Ê, U, Ô", function(assert) {
		var aLinks = [
			{
				key: "actionA",
				href: "?TestObject#/A",
				text: "A",
				visible: false
			}, {
				key: "actionE",
				href: "?TestObject#/E",
				text: "E",
				visible: true
			}, {
				key: "actionU",
				href: "?TestObject#/U",
				text: "U",
				visible: false
			}, {
				key: "actionO",
				href: "?TestObject#/O",
				text: "O",
				visible: true
			}
		];
		// system under test
		var oNavigationContainer = new NavigationContainer("IDNavigationContainer", {
			availableActions: aLinks.map(function(oMLink) {
				//Â, Ê, Û, Ô
				return new LinkData({
					key: oMLink.key,
					href: oMLink.href,
					text: oMLink.text,
					visible: oMLink.visible
				});
			})
		});

		// arrange

		// act: A, Ê, U, Ô
		AddLink.applyChange(new Change({
			layer: "USER",
			content: {
				key: aLinks[0].key,
				visible: true
			}
		}), oNavigationContainer, {
			modifier: JsControlTreeModifier
		});
		RemoveLink.applyChange(new Change({
			layer: "USER",
			content: {
				key: aLinks[1].key,
				visible: false
			}
		}), oNavigationContainer, {
			modifier: JsControlTreeModifier
		});
		AddLink.applyChange(new Change({
			layer: "USER",
			content: {
				key: aLinks[2].key,
				visible: true
			}
		}), oNavigationContainer, {
			modifier: JsControlTreeModifier
		});
		RemoveLink.applyChange(new Change({
			layer: "USER",
			content: {
				key: aLinks[3].key,
				visible: false
			}
		}), oNavigationContainer, {
			modifier: JsControlTreeModifier
		});

		// assert: A, Ê, U, Ô
		assert.equal(oNavigationContainer.getAvailableActions().length, 4);
		assert.equal(oNavigationContainer.getAvailableActions()[0].getText(), aLinks[0].text);
		assert.equal(oNavigationContainer.getAvailableActions()[0].getVisible(), true);
		assert.equal(oNavigationContainer.getAvailableActions()[1].getText(), aLinks[1].text);
		assert.equal(oNavigationContainer.getAvailableActions()[1].getVisible(), false);
		assert.equal(oNavigationContainer.getAvailableActions()[2].getText(), aLinks[2].text);
		assert.equal(oNavigationContainer.getAvailableActions()[2].getVisible(), true);
		assert.equal(oNavigationContainer.getAvailableActions()[3].getText(), aLinks[3].text);
		assert.equal(oNavigationContainer.getAvailableActions()[3].getVisible(), false);

		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions").length, 4);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), aLinks[0].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), true);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/text"), aLinks[1].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/visible"), false);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/text"), aLinks[2].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/visible"), true);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/3/text"), aLinks[3].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/3/visible"), false);

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.test("applyChange: Â, Ê, Û, Ô -> Â, E, Û, O -> A, Ê, U, Ô", function(assert) {
		var aLinks = [
			{
				key: "actionA",
				href: "?TestObject#/A",
				text: "A",
				visible: false
			}, {
				key: "actionE",
				href: "?TestObject#/E",
				text: "E",
				visible: false
			}, {
				key: "actionU",
				href: "?TestObject#/U",
				text: "U",
				visible: false
			}, {
				key: "actionO",
				href: "?TestObject#/O",
				text: "O",
				visible: false
			}
		];
		// system under test
		var oNavigationContainer = new NavigationContainer("IDNavigationContainer", {
			availableActions: aLinks.map(function(oMLink) {
				//Â, Ê, Û, Ô
				return new LinkData({
					key: oMLink.key,
					href: oMLink.href,
					text: oMLink.text,
					visible: oMLink.visible
				});
			})
		});

		// arrange: E, O
		AddLink.applyChange(new Change({
			layer: "USER",
			content: {
				key: aLinks[1].key,
				visible: true
			}
		}), oNavigationContainer, {
			modifier: JsControlTreeModifier
		});
		AddLink.applyChange(new Change({
			layer: "USER",
			content: {
				key: aLinks[3].key,
				visible: true
			}
		}), oNavigationContainer, {
			modifier: JsControlTreeModifier
		});

		// act: A, Ê, U, Ô
		AddLink.applyChange(new Change({
			layer: "USER",
			content: {
				key: aLinks[0].key,
				visible: true
			}
		}), oNavigationContainer, {
			modifier: JsControlTreeModifier
		});
		RemoveLink.applyChange(new Change({
			layer: "USER",
			content: {
				key: aLinks[1].key,
				visible: false
			}
		}), oNavigationContainer, {
			modifier: JsControlTreeModifier
		});
		AddLink.applyChange(new Change({
			layer: "USER",
			content: {
				key: aLinks[2].key,
				visible: true
			}
		}), oNavigationContainer, {
			modifier: JsControlTreeModifier
		});
		RemoveLink.applyChange(new Change({
			layer: "USER",
			content: {
				key: aLinks[3].key,
				visible: false
			}
		}), oNavigationContainer, {
			modifier: JsControlTreeModifier
		});

		// assert: A, Ê, U, Ô
		assert.equal(oNavigationContainer.getAvailableActions().length, 4);
		assert.equal(oNavigationContainer.getAvailableActions()[0].getText(), aLinks[0].text);
		assert.equal(oNavigationContainer.getAvailableActions()[0].getVisible(), true);
		assert.equal(oNavigationContainer.getAvailableActions()[1].getText(), aLinks[1].text);
		assert.equal(oNavigationContainer.getAvailableActions()[1].getVisible(), false);
		assert.equal(oNavigationContainer.getAvailableActions()[2].getText(), aLinks[2].text);
		assert.equal(oNavigationContainer.getAvailableActions()[2].getVisible(), true);
		assert.equal(oNavigationContainer.getAvailableActions()[3].getText(), aLinks[3].text);
		assert.equal(oNavigationContainer.getAvailableActions()[3].getVisible(), false);

		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions").length, 4);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/text"), aLinks[0].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/0/visible"), true);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/text"), aLinks[1].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/1/visible"), false);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/text"), aLinks[2].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/2/visible"), true);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/3/text"), aLinks[3].text);
		assert.equal(oNavigationContainer.getModel("$sapuicompNavigationContainer").getProperty("/availableActions/3/visible"), false);

		// cleanup
		oNavigationContainer.destroy();
	});

	QUnit.start();
});
