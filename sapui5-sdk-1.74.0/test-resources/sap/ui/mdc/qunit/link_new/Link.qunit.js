sap.ui.define([
	"sap/ui/thirdparty/qunit-2",
	"sap/ui/mdc/link/LinkItem",
	"sap/m/Button",
	"sap/ui/mdc/Link"
], function(QUnit, LinkItem, Button, Link) {
	"use strict";

	QUnit.module("sap.ui.mdc.Link: API", {
		beforeEach: function() {
			this.oLink = new Link();
		},
		afterEach: function() {
			this.oLink.destroy();
		}
	});

	QUnit.test("Instance", function(assert) {
		assert.ok(this.oLink);
		assert.equal(this.oLink.getEnablePersonalization(), true);
		assert.deepEqual(this.oLink.getAdditionalContent(), []);
		assert.equal(this.oLink.getSourceControl(), null);
	});

	QUnit.module("sap.ui.mdc.link.ContentHandler: visibility of items", {
		beforeEach: function() {
			// this.oUIComponent = new UIComponent("appComponent1", {});
			// this.oStubGetAppComponentForControl = sinon.stub(sap.ui.fl.Utils, "getAppComponentForControl");
			// this.oStubGetAppComponentForControl.returns(this.oUIComponent);

			this.oLink = new Link({
				delegate: {
					name: "sap/ui/mdc/LinkDelegate"
				},
				sourceControl: new Button({
					text: "button"
				})
			});
		},
		afterEach: function() {
			// this.oStubGetAppComponentForControl.restore();
			// this.oUIComponent.destroy();
			this.oLink.destroy();
		}
	});
	var fnHasVisibleLink = function(assert, oPanel, sText, bVisible) {
		var aElements = oPanel.$().find("a:visible");
		var bFound = false;
		aElements.each(function(iIndex) {
			if (aElements[iIndex].text === sText) {
				bFound = true;
			}
		});
		assert.equal(bFound, bVisible);
	};
	var fnHasVisibleText = function(assert, oPanel, sText, bVisible) {
		var aElements = oPanel.$().find("span:visible");
		var bFound = false;
		aElements.each(function(iIndex) {
			if (aElements[iIndex].textContent === sText) {
				bFound = true;
			}
		});
		assert.equal(bFound, bVisible);
	};
	var fnHasVisibleMoreLinksButton = function(assert, oPanel, bVisible) {
		assert.equal(oPanel.$().find("button:visible").length, bVisible ? 1 : 0);
		// fnHasVisibleText(assert, oPanel, sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc", undefined, false).getText("info.POPOVER_DEFINE_LINKS"), bVisible);
	};
	QUnit.test("invalid 'item' and less items", function(assert) {
		var items = [
			new LinkItem({
				key: "item00",
				text: "item 00" // invalid
			}), new LinkItem({
				text: "item 01" // invalid
			}), new LinkItem({
				key: "item02",
				text: "item 02",
				href: "#item02"
			}), new LinkItem({
				key: "item03",
				text: "item 03",
				href: "#item03"
			})
		];
		items.forEach(function(oItem) {
			this.oLink.addLinkItem(oItem);
		}.bind(this));

		var done = assert.async();
		this.oLink.getContent().then(function(oPanel) {

			oPanel.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			// fnHasVisibleMoreLinksButton(assert, oPanel, true);
			fnHasVisibleText(assert, oPanel, "item 00", false);
			fnHasVisibleText(assert, oPanel, "item 01", true);

			fnHasVisibleLink(assert, oPanel, "item 02", false);
			fnHasVisibleLink(assert, oPanel, "item 03", false);

			done();
			oPanel.destroy();
		});
	});
	QUnit.test("invalid 'item' and many items", function(assert) {
		var items = [
			new LinkItem({
				key: "item00",
				text: "item 00" // invalid
			}), new LinkItem({
				text: "item 01" // invalid
			}), new LinkItem({
				key: "item02",
				text: "item 02",
				href: "#item02"
			}), new LinkItem({
				key: "item03",
				text: "item 03",
				href: "#item03"
			}), new LinkItem({
				key: "item04",
				text: "item 04",
				href: "#item04"
			}), new LinkItem({
				key: "item05",
				text: "item 05",
				href: "#item05"
			}), new LinkItem({
				key: "item06",
				text: "item 06",
				href: "#item06"
			}), new LinkItem({
				key: "item07",
				text: "item 07",
				href: "#item07"
			}), new LinkItem({
				key: "item08",
				text: "item 08",
				href: "#item08"
			}), new LinkItem({
				key: "item09",
				text: "item 09",
				href: "#item09"
			}), new LinkItem({
				key: "item10",
				text: "item 10",
				href: "#item10"
			}), new LinkItem({
				key: "item11",
				text: "item 11",
				href: "#item11"
			})
		];
		items.forEach(function(oItem) {
			this.oLink.addLinkItem(oItem);
		}.bind(this));

		var done = assert.async();
		this.oLink.getContent().then(function(oPanel) {

			oPanel.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			// fnHasVisibleMoreLinksButton(assert, oPanel, true);
			fnHasVisibleText(assert, oPanel, "item 00", false);
			fnHasVisibleText(assert, oPanel, "item 01", true);
			fnHasVisibleLink(assert, oPanel, "item 01", false);

			fnHasVisibleText(assert, oPanel, "item 02", false);
			fnHasVisibleLink(assert, oPanel, "item 02", false);
			fnHasVisibleText(assert, oPanel, "item 03", false);
			fnHasVisibleLink(assert, oPanel, "item 03", false);
			fnHasVisibleText(assert, oPanel, "item 04", false);
			fnHasVisibleLink(assert, oPanel, "item 04", false);
			fnHasVisibleText(assert, oPanel, "item 05", false);
			fnHasVisibleLink(assert, oPanel, "item 05", false);
			fnHasVisibleText(assert, oPanel, "item 06", false);
			fnHasVisibleLink(assert, oPanel, "item 06", false);
			fnHasVisibleText(assert, oPanel, "item 07", false);
			fnHasVisibleLink(assert, oPanel, "item 07", false);
			fnHasVisibleText(assert, oPanel, "item 08", false);
			fnHasVisibleLink(assert, oPanel, "item 08", false);
			fnHasVisibleText(assert, oPanel, "item 09", false);
			fnHasVisibleLink(assert, oPanel, "item 09", false);
			fnHasVisibleText(assert, oPanel, "item 10", false);
			fnHasVisibleLink(assert, oPanel, "item 10", false);
			fnHasVisibleText(assert, oPanel, "item 11", false);
			fnHasVisibleLink(assert, oPanel, "item 11", false);

			done();
			oPanel.destroy();
		});
	});
	QUnit.test("superior 'item' and less items", function(assert) {
		var items = [
			new LinkItem({
				key: "item00",
				text: "item 00",
				href: "#item00"
			}), new LinkItem({
				key: "item01",
				text: "item 01",
				href: "#item01",
				// Superior
				isSuperior: true
			}), new LinkItem({
				key: "item02",
				text: "item 02",
				href: "#item02"
			}), new LinkItem({
				key: "item03",
				text: "item 03",
				href: "#item03"
			})
		];
		items.forEach(function(oItem) {
			this.oLink.addLinkItem(oItem);
		}.bind(this));

		var done = assert.async();
		this.oLink.getContent().then(function(oPanel) {

			oPanel.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			fnHasVisibleMoreLinksButton(assert, oPanel, true);
			fnHasVisibleLink(assert, oPanel, "item 00", false);
			fnHasVisibleText(assert, oPanel, "item 01", false);
			fnHasVisibleLink(assert, oPanel, "item 01", false);
			fnHasVisibleText(assert, oPanel, "item 02", false);
			fnHasVisibleLink(assert, oPanel, "item 02", false);

			done();
			oPanel.destroy();
		});
	});
	QUnit.test("superior 'item' and many items", function(assert) {
		var items = [
			new LinkItem({
				key: "item00",
				text: "item 00",
				href: "#item00"
			}), new LinkItem({
				key: "item01",
				text: "item 01",
				href: "#item01",
				// Superior
				isSuperior: true
			}), new LinkItem({
				key: "item02",
				text: "item 02",
				href: "#item02"
			}), new LinkItem({
				key: "item03",
				text: "item 03",
				href: "#item03"
			}), new LinkItem({
				key: "item04",
				text: "item 04",
				href: "#item04"
			}), new LinkItem({
				key: "item05",
				text: "item 05",
				href: "#item05"
			}), new LinkItem({
				key: "item06",
				text: "item 06",
				href: "#item06"
			}), new LinkItem({
				key: "item07",
				text: "item 07",
				href: "#item07"
			}), new LinkItem({
				key: "item08",
				text: "item 08",
				href: "#item08"
			}), new LinkItem({
				key: "item09",
				text: "item 09",
				href: "#item09"
			}), new LinkItem({
				key: "item10",
				text: "item 10",
				href: "#item10"
			}), new LinkItem({
				key: "item11",
				text: "item 11",
				href: "#item11"
			})
		];
		items.forEach(function(oItem) {
			this.oLink.addLinkItem(oItem);
		}.bind(this));

		var done = assert.async();
		this.oLink.getContent().then(function(oPanel) {

			oPanel.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			fnHasVisibleMoreLinksButton(assert, oPanel, true);
			fnHasVisibleLink(assert, oPanel, "item 00", false);

			fnHasVisibleText(assert, oPanel, "item 01", false);
			fnHasVisibleLink(assert, oPanel, "item 01", false);
			fnHasVisibleText(assert, oPanel, "item 02", false);
			fnHasVisibleLink(assert, oPanel, "item 02", false);

			done();
			oPanel.destroy();
		});
	});
	QUnit.test("superior 'item', invalid 'item' and less items", function(assert) {
		var items = [
			new LinkItem({
				key: "item00",
				text: "item 00",
				href: "#item00"
			}), new LinkItem({
				key: "item01",
				text: "item 01",
				href: "#item01",
				// Superior
				isSuperior: true
			}), new LinkItem({
				key: "item02",
				text: "item 02",
				href: "#item02"
			}), new LinkItem({
				key: "item03",
				text: "item 03" // invalid item
			})
		];
		items.forEach(function(oItem) {
			this.oLink.addLinkItem(oItem);
		}.bind(this));

		var done = assert.async();
		this.oLink.getContent().then(function(oPanel) {

			oPanel.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			fnHasVisibleMoreLinksButton(assert, oPanel, true);
			fnHasVisibleLink(assert, oPanel, "item 00", false);

			fnHasVisibleText(assert, oPanel, "item 01", false);
			fnHasVisibleLink(assert, oPanel, "item 01", false);
			fnHasVisibleText(assert, oPanel, "item 02", false);
			fnHasVisibleLink(assert, oPanel, "item 02", false);
			fnHasVisibleText(assert, oPanel, "item 03", false);
			fnHasVisibleLink(assert, oPanel, "item 03", false);

			done();
			oPanel.destroy();
		});
	});
	QUnit.test("superior 'item', invalid 'item' and many items", function(assert) {
		var items = [
			new LinkItem({
				key: "item00",
				text: "item 00",
				href: "#item00"
			}), new LinkItem({
				key: "item01",
				text: "item 01",
				href: "#item01",
				// Superior
				isSuperior: true
			}), new LinkItem({
				key: "item02",
				text: "item 02",
				href: "#item02"
			}), new LinkItem({
				key: "item03",
				text: "item 03" // invalid item
			}), new LinkItem({
				key: "item04",
				text: "item 04",
				href: "#item04"
			}), new LinkItem({
				key: "item05",
				text: "item 05",
				href: "#item05"
			}), new LinkItem({
				key: "item06",
				text: "item 06",
				href: "#item06"
			}), new LinkItem({
				key: "item07",
				text: "item 07",
				href: "#item07"
			}), new LinkItem({
				key: "item08",
				text: "item 08",
				href: "#item08"
			}), new LinkItem({
				key: "item09",
				text: "item 09",
				href: "#item09"
			}), new LinkItem({
				key: "item10",
				text: "item 10",
				href: "#item10"
			}), new LinkItem({
				key: "item11",
				text: "item 11",
				href: "#item11"
			})
		];
		items.forEach(function(oItem) {
			this.oLink.addLinkItem(oItem);
		}.bind(this));

		var done = assert.async();
		this.oLink.getContent().then(function(oPanel) {

			oPanel.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			fnHasVisibleMoreLinksButton(assert, oPanel, true);
			fnHasVisibleLink(assert, oPanel, "item 00", false);

			fnHasVisibleText(assert, oPanel, "item 01", false);
			fnHasVisibleLink(assert, oPanel, "item 01", false);
			fnHasVisibleText(assert, oPanel, "item 02", false);
			fnHasVisibleLink(assert, oPanel, "item 02", false);
			fnHasVisibleText(assert, oPanel, "item 03", false);
			fnHasVisibleLink(assert, oPanel, "item 03", false);

			fnHasVisibleText(assert, oPanel, "item 04", false);
			fnHasVisibleLink(assert, oPanel, "item 04", false);
			fnHasVisibleText(assert, oPanel, "item 05", false);
			fnHasVisibleLink(assert, oPanel, "item 05", false);
			fnHasVisibleText(assert, oPanel, "item 06", false);
			fnHasVisibleLink(assert, oPanel, "item 06", false);
			fnHasVisibleText(assert, oPanel, "item 07", false);
			fnHasVisibleLink(assert, oPanel, "item 07", false);
			fnHasVisibleText(assert, oPanel, "item 08", false);
			fnHasVisibleLink(assert, oPanel, "item 08", false);
			fnHasVisibleText(assert, oPanel, "item 09", false);
			fnHasVisibleLink(assert, oPanel, "item 09", false);
			fnHasVisibleText(assert, oPanel, "item 10", false);
			fnHasVisibleLink(assert, oPanel, "item 10", false);
			fnHasVisibleText(assert, oPanel, "item 11", false);
			fnHasVisibleLink(assert, oPanel, "item 11", false);

			done();
			oPanel.destroy();
		});
	});
});
