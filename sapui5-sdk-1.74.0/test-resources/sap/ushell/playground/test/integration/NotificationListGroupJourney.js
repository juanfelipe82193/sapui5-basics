// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/test/opaQunit",
    "./pages/NavContainer",
    "./pages/NotificationListGroup"
], function (opaTest) {
    "use strict";


    opaTest("should see the Notification List Group Playground", function (Given, When, Then) {
        Given.iStartMyApp();

        When.onTheNavContainer.iPressTheNotificationListGroup();

        Then.onTheNavContainer.iShouldSeeTheNotificationListGroup();

    });

    opaTest("should see the notification list group", function (Given, When, Then) {
        Then.onTheNotificationListGroup.iShouldSeeTheGroup();
    });

    opaTest("should see two notification list items", function (Given, When, Then) {
        When.onTheNotificationListGroup.iPressTheAddNotificationListItem();
        Then.onTheNotificationListGroup.iShouldSeeANotificationListItem();
    });

    opaTest("should see the right title", function (Given, When, Then) {
        When.onTheNotificationListGroup.iChangeTheTitle("New Title");
        Then.onTheNotificationListGroup.iShouldSeeTheRightTitle("New Title");
    });

    opaTest("should see the collapsed notification list group", function (Given, When, Then) {
        When.onTheNotificationListGroup.iTurnOnTheCollapsedSwitch();
        Then.onTheNotificationListGroup.iShouldSeeTheCollapsedGroup();
    });

    opaTest("should see the show empty group notification list group", function (Given, When, Then) {
        When.onTheNotificationListGroup.iTurnOnTheShowEmptyGroupSwitch();
        Then.onTheNotificationListGroup.iShouldSeeTheShowEmptyGroupGroup();
    });

    opaTest("should see the High Priority List Group", function (Given, When, Then) {
        When.onTheNotificationListGroup.iPickTheHighPriority();
        Then.onTheNotificationListGroup.iShouldSeeTheHighPriorityGroup();
    });

    opaTest("should see the auto priority notification list group", function (Given, When, Then) {
        When.onTheNotificationListGroup.iTurnOnTheAutoPrioritySwitch();
        Then.onTheNotificationListGroup.iShouldSeeTheAutoPriorityGroup();
    });

    opaTest("should see the invisible notification list group", function (Given, When, Then) {
        When.onTheNotificationListGroup.iFlipTheVisibleSwitch();
        Then.onTheNotificationListGroup.iShouldSeeTheInvisibleGroup();

    });

    opaTest("should see the right datetime", function (Given, When, Then) {
        When.onTheNotificationListGroup.iFlipTheVisibleSwitch();
        When.onTheNotificationListGroup.iChangeTheDatetime("New Datetime");
        Then.onTheNotificationListGroup.iShouldSeeTheRightDatetime("New Datetime");
    });

    opaTest("should see the close button", function (Given, When, Then) {
        When.onTheNotificationListGroup.iTurnOnTheShowCloseButtonSwitch();
        Then.onTheNotificationListGroup.iShouldSeeTheCloseButton();
    });

    opaTest("should see the World Author Picture", function (Given, When, Then) {
        When.onTheNotificationListGroup.iPickTheWorldAuthorPicture();
        Then.onTheNotificationListGroup.iShouldSeeTheWorldAuthorPicture();
        Then.iTeardownMyApp();
    });
});