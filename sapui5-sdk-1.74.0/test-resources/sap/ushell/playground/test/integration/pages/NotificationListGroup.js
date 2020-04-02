// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/matchers/AggregationContainsPropertyEqual",
    "sap/ui/test/matchers/AggregationLengthEquals",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/matchers/PropertyStrictEquals",
    "sap/ui/core/Priority",
    "./Common"
], function (Opa5, AggregationContainsPropertyEqual, AggregationLengthEquals, Properties, PropertyStrictEquals, Priority, Common) {
    "use strict";

    var fnSeeTheNumberOfItems = function (sAggregationName, iNumber) {
        return this.waitFor({
            controlType: "sap.m.NotificationListGroup",
            matchers: new AggregationLengthEquals({
                name: sAggregationName,
                length: iNumber
            }),
            success: function () {
                Opa5.assert.ok(true, "The control has " + iNumber + " " + sAggregationName + ".");
            },
            errorMessage: "No " + sAggregationName + " was not found."
        });
    };

    var fnCheckAttributeValue = function (sAttribute, sValue, sMessage) {
        return this.waitFor({
            controlType: "sap.m.NotificationListGroup",
            id: /notificationListGroup/,
            matchers: new PropertyStrictEquals({
                name: sAttribute,
                value: sValue
            }),
            success: function () {
                Opa5.assert.ok(true, sMessage);
            }
        });
    };

    Opa5.createPageObjects({
        onTheNotificationListGroup: {
            baseClass: Common,
            actions: {
                iFlipTheVisibleSwitch: function () {
                    return this.iTurnOnTheSwitchWithLabelFor("Visible");
                },
                iPressTheAddNotificationListItem: function () {
                    return this.iPressTheButtonWithId(/addNotificationListItemButton/);
                },
                iChangeTheTitle: function (sTitle) {
                    return this.iEnterTextInTheInputFieldWithId(/titleInput/, sTitle);
                },
                iChangeTheDatetime: function (sDatetime) {
                    return this.iEnterTextInTheInputFieldWithId(/datetimeInput/, sDatetime);
                },
                iTurnOnTheShowCloseButtonSwitch: function () {
                    return this.iTurnOnTheSwitchWithLabelFor("Show Close Button");
                },
                iTurnOnTheCollapsedSwitch: function () {
                    return this.iTurnOnTheSwitchWithLabelFor("Collapsed");
                },
                iTurnOnTheAutoPrioritySwitch: function () {
                    return this.iTurnOnTheSwitchWithLabelFor("autoPriority");
                },
                iTurnOnTheShowEmptyGroupSwitch: function () {
                    return this.iTurnOnTheSwitchWithLabelFor("showEmptyGroup");
                },
                iPickTheHighPriority: function () {
                    return this.iSelectAValueInTheSelectWithId(/prioritySelect/, Priority.High);
                },
                iPickTheWorldAuthorPicture: function () {
                    return this.iSelectAValueInTheSelectWithId(/authorPictureSelect/, "sap-icon://world");
                }
            },
            assertions: {
                iShouldSeeTheGroup: function () {
                    return this.waitFor({
                        controlType: "sap.m.NotificationListGroup",
                        id: /notificationListGroup/,
                        success: function () {
                            Opa5.assert.ok(document.getElementsByTagName("notificationListGroup"), "The group was found.");
                        },
                        errorMessage: "The Group was not found."
                    });
                },

                iShouldSeeTheInvisibleGroup: function () {
                    return this.waitFor({
                        controlType: "sap.m.NotificationListGroup",
                        id: /notificationListGroup/,
                        visible: false,
                        success: function () {
                            Opa5.assert.ok(true, "The control is not visible");
                        }
                    });
                },

                iShouldSeeANotificationListItem: function () {
                    return fnSeeTheNumberOfItems.call(this, "items", 2);
                },
                iShouldSeeTheRightTitle: function (sTitle) {
                    return fnCheckAttributeValue.call(this, "title", sTitle, "The title is right");
                },
                iShouldSeeTheRightDatetime: function (sDateTime) {
                    return fnCheckAttributeValue.call(this, "datetime", sDateTime, "The datetime is right");
                },
                iShouldSeeTheCloseButton: function () {
                    return fnCheckAttributeValue.call(this, "showCloseButton", true, "The close button is shown");
                },
                iShouldSeeTheCollapsedGroup: function () {
                    return fnCheckAttributeValue.call(this, "collapsed", true, "The group is collapsed");
                },
                iShouldSeeTheAutoPriorityGroup: function () {
                    return fnCheckAttributeValue.call(this, "autoPriority", true, "The group is in auto priority Mode");
                },
                iShouldSeeTheShowEmptyGroupGroup: function () {
                    return fnCheckAttributeValue.call(this, "showEmptyGroup", true, "The group shows empty groups");
                },
                iShouldSeeTheHighPriorityGroup: function () {
                    return fnCheckAttributeValue.call(this, "priority", Priority.High, "The group has high priority");
                },
                iShouldSeeTheWorldAuthorPicture: function () {
                    return fnCheckAttributeValue.call(this, "authorPicture", "sap-icon://world", "The author picture is set");
                }
            }
        }
    });
});