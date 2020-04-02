// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/test/Opa5",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/test/actions/Press",
	"./Common"
], function (Opa5, PropertyStrictEquals, Press, Common) {
	"use strict";

	var fnPress = function (sText) {
		return this.waitFor({
			controlType: "sap.m.StandardListItem",
			matchers: new PropertyStrictEquals({
				name: "title",
				value: sText
			}),
			actions: new Press(),
			errorMessage: sText + " in navContainer was not found."
		});
	};

	var fnShouldSeeThePlayground = function (sId) {
		return this.waitFor({
			id: sId,
			success: function () {
				Opa5.assert.ok(true, "The playground " + sId + " was found.");
			},
			errorMessage: "The playground " + sId + " was not found."
		});
	};

	Opa5.createPageObjects({
		onTheNavContainer: {
			baseClass: Common,
			actions: {
				iPressTheShellHeader: function () {
					return fnPress.call(this, "Shell Header");
				},
				iPressTheShellAppTitle: function () {
					return fnPress.call(this, "Shell App Title");
				},
				iPressTheShellNavigationMenu: function () {
					return fnPress.call(this, "Shell Navigation Menu");
				},
				iPressTheNavigationMiniTile: function () {
					return fnPress.call(this, "Navigation Mini-Tile");
				},
				iPressTheToolArea: function () {
					return fnPress.call(this, "Tool Area");
				},
				iPressTheRightFloatingContainer: function () {
					return fnPress.call(this, "Right Floating Container");
				},
				iPressTheToolAreaItem: function () {
					return fnPress.call(this, "Tool Area Item");
				},
				iPressTheTile: function () {
					return fnPress.call(this, "Tile");
				},
				iPressTheTileBase: function () {
					return fnPress.call(this, "Tile Base");
				},
				iPressTheNotificationListGroup: function () {
					return fnPress.call(this, "Notification List Group");
				},
				iPressTheNotificationListItem: function () {
					return fnPress.call(this, "Notification List Item");
				}
			},
			assertions: {
				iShouldSeeTheShellHeaderPlayground: function () {
					return fnShouldSeeThePlayground.call(this, "shellHeaderPage");
				},
				iShouldSeeTheShellAppTitlePlayground: function () {
					return fnShouldSeeThePlayground.call(this, "shellAppTitlePage");
				},
				iShouldSeeTheShellNavigationMenuPlayground: function () {
					return fnShouldSeeThePlayground.call(this, "shellNavigationMenuPage");
				},
				iShouldSeeTheNavigationMiniTilePlayground: function () {
					return fnShouldSeeThePlayground.call(this, "navigationMiniTitlePage");
				},
				iShouldSeeTheToolAreaPlayground: function () {
					return fnShouldSeeThePlayground.call(this, "toolAreaPage");
				},
				iShouldSeeTheRightFloatingContainerPlayground: function () {
					return fnShouldSeeThePlayground.call(this, "rightFloatingContainerPage");
				},
				iShouldSeeTheToolAreaItemPlayground: function () {
					return fnShouldSeeThePlayground.call(this, "toolAreaItemPage");
				},
				iShouldSeeTheTilePlayground: function () {
					return fnShouldSeeThePlayground.call(this, "tilePage");
				},
				iShouldSeeTheTileBasePlayground: function () {
					return fnShouldSeeThePlayground.call(this, "tileBasePage");
				},
				iShouldSeeTheNotificationListGroup: function () {
					return fnShouldSeeThePlayground.call(this, /notificationListGroupPage$/);
				},
				iShouldSeeTheNotificationListItem: function () {
					return fnShouldSeeThePlayground.call(this, /notificationListItem$/);
				}
			}
		}
	});
});