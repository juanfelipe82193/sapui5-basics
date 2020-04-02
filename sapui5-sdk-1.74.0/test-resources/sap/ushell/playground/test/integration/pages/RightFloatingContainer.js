// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/actions/Press",
    "./Common"
], function (Opa5, Properties, Press, Common) {
    "use strict";

    Opa5.createPageObjects({
        onTheRightFloatingContainerPlayground: {
            baseClass: Common,
            actions: {
                iInputANumberForTop: function () {
                    return this.iEnterTextInTheInputFieldWithPlaceholder("Enter top ...", 10);
                },
                iInputANumberForRight: function () {
                    return this.iEnterTextInTheInputFieldWithPlaceholder("Enter right ...", 10);
                },
                iTurnOnTheHideItemsAfterPresentationSwitch: function () {
                    return this.iTurnOnTheSwitchWithId("hideItemsAfterPresentation-switch");
                },
                iTurnOnTheEnableBounceAnimationsSwitch: function () {
                    return this.iTurnOnTheSwitchWithId("enableBounceAnimations-switch");
                },
                iTurnOnTheActAsPreviewContainerSwitch: function () {
                    return this.iTurnOnTheSwitchWithId("actAsPreviewContainer-switch");
                },
                iInputItemDescription: function () {
                    return this.iEnterTextInTheInputFieldWithPlaceholder("Enter item description ...", "item description");
                },
                iTurnOnTheItemHideShowMoreButtonSwitch: function () {
                    return this.iTurnOnTheSwitchWithId("hideShowMoreButton-switch");
                },
                iTurnOnTheItemTruncateSwitch: function () {
                    return this.iTurnOnTheSwitchWithId("truncate-switch");
                },
                iInputItemAuthorName: function () {
                    return this.iEnterTextInTheInputFieldWithPlaceholder("Enter item author name ...", "author name");
                },
                iSelectItemSetAuthorPicture: function () {
                    return this.iSelectAnItemInASelectControl("author-picture-select", "refresh-item");
                },
                iInputItemSetDate: function () {
                    return this.iEnterTextInTheInputFieldWithPlaceholder("Enter item date ...", "item date");
                },
                iSelectItemSetPriority: function () {
                    return this.iSelectAnItemInASelectControl("priority-select", "low-item");
                },
                iInputTheItemTitle: function () {
                    return this.iEnterTextInTheInputFieldWithPlaceholder("Enter item title ...", "item title");
                },
                iPressAddItemButton: function () {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        matchers: new Properties({
                            text: "Add Item"
                        }),
                        actions: new Press(),
                        errorMessage: "No button with text add item was found."
                    });
                }
            },
            assertions: {
                iShouldSeeTheItemInTheRightFloatingContainer: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.shell.RightFloatingContainer",
                        matchers: new Properties({
                            right: "10",
                            top: "10",
                            textVisible: true,
                            hideItemsAfterPresentation: true,
                            enableBounceAnimations: true,
                            actAsPreviewContainer: true
                        }),
                        success: function (oControl) {
                            this.waitFor({
                                controlType: "sap.m.NotificationListItem",
                                matchers: new Properties({
                                    description: "item description",
                                    hideShowMoreButton: true,
                                    truncate: true,
                                    authorName: "author name",
                                    authorPicture: "sap-icon://refresh",
                                    datetime: "item date",
                                    priority: sap.ui.core.Priority.Low,
                                    showButtons: true,
                                    showCloseButton: true,
                                    title: "item title"
                                })
                            });
                            Opa5.assert.ok(oControl, "The right floating container was found.");
                        },
                        errorMessage: "The right floating container was not found."
                    });
                }
            }
        }
    });
});