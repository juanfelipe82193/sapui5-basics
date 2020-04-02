/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/VerticalNavigationBar",
	"sap/suite/ui/commons/CountingNavigationItem",
	"sap/ui/thirdparty/jquery"
], function(
	QUnitUtils,
	createAndAppendDiv,
	VerticalNavigationBar,
	CountingNavigationItem,
	jQuery
) {
	"use strict";
	createAndAppendDiv("uiArea1");


	var oNavBar = new VerticalNavigationBar({ id: "navBar" });
	oNavBar.placeAt("uiArea1");

	var oNavItem1 = new CountingNavigationItem({ text: "Item 1" });
	var oNavItem2 = new CountingNavigationItem({ text: "Item 2", href: "http://item2.org/" });
	var oNavItem3 = new CountingNavigationItem({ text: "Item 3", quantity: "220" });

	QUnit.module("VerticalNavigationBar rendering", {
		beforeEach: function() {
			oNavBar.removeAllItems();
			oNavBar.addItem(oNavItem1);
			oNavBar.addItem(oNavItem2);
			oNavBar.addItem(oNavItem3);
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
		}
	});

	QUnit.test("VerticalNavigationBar is rendered", function(assert) {
		assert.ok(oNavBar.getId() ? window.document.getElementById(oNavBar.getId()) : null, "VerticalNavigationBar outer HTML element is rendered.");

		var aNavElements = jQuery(".sapSuiteTvNavBar");
		assert.equal(aNavElements.length, 1, "1 outer division is rendered.");

		var aUlElements = oNavBar.$("list");
		assert.equal(aUlElements.length, 1, "1 ul tag is rendered.");
	});

	QUnit.test("VerticalNavigationBar's items are rendered", function(assert) {
		var oDomRef = oNavItem1.getId() ? window.document.getElementById(oNavItem1.getId()) : null;
		assert.ok(oDomRef, "Item element exists in the page");

		var aItems = jQuery(".sapSuiteTvNavBarItem");
		assert.equal(aItems.length, 3, "3 items are rendered.");

		var aItemLinks = jQuery(".sapSuiteTvNavBarItem>.sapSuiteTvNavBarItemLink");
		assert.equal(aItemLinks.length, 3, "3 item links are rendered.");
		// assert.equal(aItemLinks[0].href, "javascript:void(0);", "Default link is rendered for the first item."); // FIXME
		assert.equal(aItemLinks[1].href, "http://item2.org/", "Defined link is rendered for the second item.");

		var aItemTexts = jQuery(".sapSuiteTvNavBarItem>.sapSuiteTvNavBarItemLink>.sapSuiteTvNavBarItemName");
		assert.equal(aItemTexts.length, 3, "3 item texts are rendered.");
		assert.equal(aItemTexts[1].innerHTML, "Item 2", "Item 2 text is written to the page for the second item.");
		//jQuery returns px instead em, so only check that margin is negative and equal modulo to padding
		assert.equal(jQuery(aItemTexts[2]).css("margin-right"),
			"-" + jQuery(aItemTexts[2]).css("padding-right"),
			"Margin  and padding styles are calculated and written to the page for the third item.");

		var aItemQty = jQuery(".sapSuiteTvNavBarItem>.sapSuiteTvNavBarItemLink>.sapSuiteTvNavBarItemQty");
		assert.equal(aItemQty.length, 1, "1 item quantity text is rendered.");
		assert.equal(aItemQty[0].innerHTML, " (220)", "Quantity text is written to the page for the third item.");
	});

	QUnit.test("VerticalNavigationBar's selected item is rendered", function(assert) {
		oNavBar.setSelectedItem(oNavItem2);

		assert.equal(oNavBar.getSelectedItem(), oNavItem2.getId(), "Second item is selected.");

		var aSelectedItems = jQuery(".sapUiUx3NavBarItemSel");
		assert.equal(aSelectedItems.length, 1, "1 item is selected.");
		assert.equal(aSelectedItems.children()[0].id, oNavItem2.getId(), "DOM element marked as selected should be the one with the same ID as the selected item.");
	});

	QUnit.test("VerticalNavigationBar's tooltips", function(assert) {
		var sId = oNavItem2.getId();

		oNavBar._showTooltip(sId);
		assert.ok(oNavBar._oBarItemsMap[sId], "Tooltip for second item created.");

		assert.equal(oNavBar._oBarItemsMap[sId].doOpen, true, "Tooltip for second item opened.");

		oNavBar._hideTooltip(sId);
		assert.equal(oNavBar._oBarItemsMap[sId].doOpen, false, "Tooltip for second item closed.");
	});
});