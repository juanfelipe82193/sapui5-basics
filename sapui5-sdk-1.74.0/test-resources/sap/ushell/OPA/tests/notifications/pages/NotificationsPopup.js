// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/matchers/Ancestor"
], function (Opa5, Press, Ancestor) {
    "use strict";

    Opa5.createPageObjects({
        onTheNotificationsPopup: {
            actions: {
                IPressTheOverflowButton: function (itemNumber) {
                    return this.waitFor({
                        id: "notificationsView--sapUshellNotificationsListDate",
                        matchers: function (oList) {
                            return oList.getItems()[itemNumber];
                        }.bind(this),
                        success: function (oListItem) {
                            return this.waitFor({
                                id: /overflowToolbar-overflowButton/,
                                matchers: new Ancestor(oListItem),
                                actions: new Press(),
                                errorMessage: "Overflow button on item " + itemNumber + " not found"
                            });
                        },
                        errorMessage: "List item " + itemNumber + " not found"
                    });
                },
                IPressTheItemButton: function (itemNumber, buttonNumber) {
                    buttonNumber = buttonNumber || 0; // Accept - 0. Reject - 1
                    return this.waitFor({
                        id: "notificationsView--sapUshellNotificationsListDate",
                        matchers: function (oList) {
                            var oItem = oList.getItems()[itemNumber];
                            return oItem.getButtons()[buttonNumber];
                        },
                        actions: new Press(),
                        errorMessage: "Button " + buttonNumber + " on item " + itemNumber + " not found"
                    });
                },
                ISelectTab: function (tabNumber) {
                    return this.waitFor({
                        id: "notificationsView--notificationIconTabBar",
                        actions: function (oIconTabBar) {
                            oIconTabBar.setSelectedItem(oIconTabBar.getItems()[tabNumber]);
                        }
                    });
                }
            },
            assertions: {
                IShouldSeeThePopover: function () {
                    return this.waitFor({
                        id: "shellNotificationsPopover",
                        success: function (oPopover) {
                            Opa5.assert.strictEqual(oPopover.isOpen(), true, "The popover is opened");
                        },
                        errorMessage: "Notifications popover is not found"
                    });
                },
                IShouldNotSeeThePopover: function (bOpen) {
                    return this.waitFor({
                        success: function () {
                            var oPopover = sap.ui.getCore().byId("shellNotificationsPopover");
                            Opa5.assert.ok(!oPopover || !oPopover.isOpen(), "The popover is not visible");
                        }
                    });
                },
                IShouldSeeTheCount: function (count) {
                    return this.waitFor({
                        id: "NotificationsCountButton",
                        matchers: function (oButton) {
                            var sCount = oButton.$().attr("data-counter-content");
                            return count ? sCount === count + "" : !sCount;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The notifications count badge is correctly set");
                        },
                        errorMessage: "Notifications count is not set"
                    });
                },
                IShouldSeeNotifications: function (count) {
                    return this.waitFor({
                        id: "notificationsView--notificationIconTabBar",
                        success: function (oIconTabBar) {
                            var sKey = oIconTabBar.getSelectedKey();
                            var oTab;
                            oIconTabBar.getItems().some(function (oItem) {
                                if (oItem.getKey() === sKey) {
                                    oTab = oItem;
                                    return true;
                                }
                                return false;
                            });
                            var oList = oTab.getContent()[0];
                            Opa5.assert.strictEqual(oList.getItems().length, count, "Expect notifications: " + count);
                        },
                        errorMessage: "Notifications list is not found"
                    });
                }
            }
        }
    });
});