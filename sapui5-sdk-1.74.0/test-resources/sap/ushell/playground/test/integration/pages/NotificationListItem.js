// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/matchers/AggregationContainsPropertyEqual",
    "sap/ui/test/matchers/AggregationLengthEquals",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/matchers/Interactable",
    "sap/ui/test/matchers/PropertyStrictEquals",
    "sap/ui/core/Priority",
    "./Common"
], function (
    Opa5,
    AggregationContainsPropertyEqual,
    AggregationLengthEquals,
    Properties,
    Interactable,
    PropertyStrictEquals,
    Priority,
    Common
) {
    "use strict";

    var fnCheckAttributeValue = function (sAttribute, sValue, sMessage) {
        return this.waitFor({
            controlType: "sap.m.NotificationListItem",
            id: /notificationListItem/,
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
        onTheNotificationListItem: {
            baseClass: Common,
            actions: {
                iFlipTheVisibleSwitch: function () {
                    return this.iTurnOnTheSwitchWithLabelFor("Visible");
                },
                iChangeTheTitle: function (sNewTitle) {
                    return this.iEnterTextInTheInputFieldWithId(/titleInput/, sNewTitle);
                },
                iChangeTheAuthorName: function (sNewAuthorName) {
                    return this.iEnterTextInTheInputFieldWithId(/authorNameInput/, sNewAuthorName);
                },
                iChangeTheDescription: function (sNewDescription) {
                    return this.iEnterTextInTheInputFieldWithId(/descriptionInput/, sNewDescription);
                },
                iChangeTheDatetime: function (sNewDatetime) {
                    return this.iEnterTextInTheInputFieldWithId(/datetimeInput/, sNewDatetime);
                },
                iTurnOnTheShowCloseButtonSwitch: function () {
                    return this.iTurnOnTheSwitchWithLabelFor("Show Close Button");
                },
                iTurnOnTheTruncateSwitch: function () {
                    return this.iTurnOnTheSwitchWithLabelFor("Truncate");
                },
                iPickTheHighPriority: function () {
                    return this.iSelectAValueInTheSelectWithId(/prioritySelect/, Priority.High);
                },
                iPickTheEmailAuthorPicture: function () {
                    return this.iSelectAValueInTheSelectWithId(/authorPictureSelect/, "sap-icon://email");
                }
            },
            assertions: {
                iShouldSeeTheItem: function () {
                    return this.waitFor({
                        controlType: "sap.m.NotificationListItem",
                        id: /notificationListItem/,
                        success: function () {
                            Opa5.assert.ok(document.getElementsByTagName("notificationListItem"), "The Item was found.");
                        },
                        errorMessage: "The Item was not found."
                    });
                },

                iShouldSeeTheInvisibleItem: function () {
                    return this.waitFor({
                        controlType: "sap.m.NotificationListItem",
                        visible: false,
                        success: function () {
                            Opa5.assert.ok(true, "The control is not visible");
                        }
                    });
                },

                iShouldSeeTheRightTitle: function (sTitle) {
                    return fnCheckAttributeValue.call(this, "title", sTitle, "The Title is right");
                },
                iShouldSeeTheRightDescription: function (sDescription) {
                    return fnCheckAttributeValue.call(this, "description", sDescription, "The description is right");
                },
                iShouldSeeTheRightAuthorName: function (sAuthorName) {
                    return fnCheckAttributeValue.call(this, "authorName", sAuthorName, "The authorName is right");
                },
                iShouldSeeTheRightDatetime: function (sDatetime) {
                    return fnCheckAttributeValue.call(this, "datetime", sDatetime, "The datetime is right");
                },
                iShouldSeeTheCloseButton: function () {
                    return fnCheckAttributeValue.call(this, "showCloseButton", true, "The Close Button is shown");
                },
                iShouldSeeTheTruncatedItem: function () {
                    return fnCheckAttributeValue.call(this, "truncate", true, "The Description is Truncated");
                },
                iShouldSeeTheHighPriorityItem: function () {
                    return fnCheckAttributeValue.call(this, "priority", Priority.High, "The item has high priority");
                },
                iShouldSeeTheEmailAuthorPicture: function () {
                    return fnCheckAttributeValue.call(this, "authorPicture", "sap-icon://email", "The Author Picture is set");
                }
            }
        }
    });
});