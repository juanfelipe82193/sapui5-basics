// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press"
], function (Opa5, Press) {
    "use strict";

    Opa5.createPageObjects({
        onTheMeArea : {
            actions : {
                iPressOnTheSettingsButton: function () {
                    return this.waitFor({
                        id: "userSettingsBtn",
                        matchers: function (oButton) {
                            return !!oButton.$().is(":visible");
                        },
                        actions: new Press(),
                        errorMessage: "No settings button"
                    });
                },
                iPressOnActionButton: function (sActionItemId) {
                    return this.waitFor({
                        id: "sapUshellMeAreaPopover",
                        matchers: function (oPopover) {
                            return oPopover.getContent()[0].getItems().find(function (oListItem) {
                                var oCustomData = oListItem.getCustomData().find(function (oCustomData) {
                                    return oCustomData.getKey() === "actionItemId";
                                });
                                return oCustomData.getValue() === sActionItemId;
                            });
                        },
                        actions: new Press(),
                        errorMessage: sActionItemId + " was not found"
                    });
                },
                iPressOnActionButtonWithTitle: function (sTitle) {
                    return this.waitFor({
                        id: "sapUshellMeAreaPopover",
                        matchers: function (oPopover) {
                            return oPopover.getContent()[0].getItems().find(function (oListItem) {
                                return oListItem.getTitle() === sTitle;
                            });
                        },
                        actions: new Press(),
                        errorMessage: sTitle + " was not found"
                    });
                }
            },
            assertions: {
                iShouldSeeMeAreaPopover: function () {
                    return this.waitFor({
                        id: "sapUshellMeAreaPopover",
                        success: function (oPopover) {
                            Opa5.assert.ok(oPopover.isOpen(), "MeArea popover should be opened.");
                        },
                        errorMessage: "MeArea popover was not found"
                    });
                },
                iShouldNotSeeMeAreaPopover: function () {
                    return this.waitFor({
                        id: "sapUshellMeAreaPopover",
                        visible: false,
                        success: function (oPopover) {
                            Opa5.assert.ok(!oPopover.isOpen(), "MeArea popover should be closed.");
                        },
                        errorMessage: "MeArea popover was not found"
                    });
                },
                iShouldSeeItemInMeArea: function (sActionItemId) {
                    return this.waitFor({
                        id: "sapUshellMeAreaPopover",
                        matchers: function (oPopover) {
                            return oPopover.getContent()[0].getItems();
                        },
                        success: function (aItems) {
                            var oListItem = aItems.find(function (oItem) {
                                return oItem.getCustomData().some(function (oCustomData) {
                                    return oCustomData.getValue() === sActionItemId;
                                });
                            });
                            Opa5.assert.ok(oListItem, "List item should be shown in popover: " + sActionItemId);
                        },
                        errorMessage: "MeArea popover was not found"
                    });
                },
                iShouldSeeItemInMeAreaWithTitle: function(sTitle) {
                    return this.waitFor({
                        id: "sapUshellMeAreaPopover",
                        matchers: function (oPopover) {
                            return oPopover.getContent()[0].getItems();
                        },
                        success: function (aItems) {
                            var oListItem = aItems.find(function (oItem) {
                                return oItem.getTitle() === sTitle;
                            });
                            Opa5.assert.ok(oListItem, "List item should be shown in popover: " + sTitle);
                        },
                        errorMessage: "MeArea popover was not found"
                    });
                }
            }
        }
    });
});
