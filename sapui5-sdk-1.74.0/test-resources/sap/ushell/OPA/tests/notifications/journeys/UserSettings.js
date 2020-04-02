// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/testUtils",
    "sap/ushell/opa/tests/header/pages/MeArea",
    "sap/ushell/opa/tests/homepage/pages/Homepage",
    "sap/ushell/opa/tests/homepage/pages/UserSettings"
], function (opaTest, testUtils) {
    "use strict";

    /* global QUnit */
    QUnit.module("notifications settings", {
        before: function () {
            this.defaultConfig = {
                "services": {
                    "Notifications": {
                        "config": {
                            "enabled": true,
                            "serviceUrl": "/mockdata/notifcations",
                            "pollingIntervalInSeconds": 100
                        }
                    }
                },
                "renderers": {
                    "fiori2": {
                        "componentData": {
                            "config": {}
                        }
                    }
                }
            };
        }
    });

    // add other adapters here, once supported
    var aAdapters = ["cdm"];
    aAdapters.forEach(function (sAdapter) {
        opaTest("Should see the notification setting", function (Given, When, Then) {
            // Arrangements
            var oConfig = testUtils.overrideObject(this.defaultConfig, {
                "/renderers/fiori2/componentData/config/enableNotificationsUI": true
            });

            var sMockServerUri = "/mockdata/notifcations/";
            Given.iStartMyMockServer(sMockServerUri, [
                {
                    method: "GET",
                    path: /Channels\(ChannelId='SAP_EMAIL'\)/,
                    response: function (xhr) {
                        xhr.respondJSON(200, {}, {IsActive: true});
                    }
                },
                {
                    method: "GET",
                    path: /Channels\(ChannelId='SAP_SMP'\)/,
                    response: function (xhr) {
                        xhr.respondJSON(200, {}, {IsActive: false});
                    }
                },
                {
                    method: "GET",
                    path: /NotificationTypePersonalizationSet/,
                    response: function (xhr) {
                        xhr.respondJSON(200, {},
                            {
                                "value": [
                                    {   // enabled true -> email will be delivered
                                        "NotificationTypeId": "a",
                                        "NotificationTypeDesc": "1 EmailX[X], EmailId[X], !DelivEmail[_], !Deliv[_]",
                                        "IsEmailEnabled": true,
                                        "IsEmailIdMaintained": true,
                                        "DoNotDeliverEmail": false,
                                        "DoNotDeliver": false
                                    },
                                    {   // email enabled, email-ID given, do not deliver email
                                        "NotificationTypeId": "b",
                                        "NotificationTypeDesc": "2 EmailX[X], EmailId[X], !DelivEmail[X], !Deliv[_]",
                                        "IsEmailEnabled": true,
                                        "IsEmailIdMaintained": true,
                                        "DoNotDeliverEmail": true,
                                        "DoNotDeliver": false
                                    },
                                    {   // notification type disabled
                                        "NotificationTypeId": "c",
                                        "NotificationTypeDesc": "3 EmailX[X], EmailId[X], !DelivEmail[_], !Deliv[X]",
                                        "IsEmailEnabled": true,
                                        "IsEmailIdMaintained": true,
                                        "DoNotDeliverEmail": false,
                                        "DoNotDeliver": true
                                    },
                                    {   // email not enabled, email-ID given, settings partly disabled
                                        "NotificationTypeId": "d",
                                        "NotificationTypeDesc": "4 EmailX[_], EmailId[X], !DelivEmail[_], !Deliv[_]",
                                        "IsEmailEnabled": false,
                                        "IsEmailIdMaintained": true,
                                        "DoNotDeliverEmail": false,
                                        "DoNotDeliver": false
                                    },
                                    {   // no email-Id
                                        "NotificationTypeId": "e",
                                        "NotificationTypeDesc": "5 EmailX[X], EmailId[_], !DelivEmail[X], !Deliv[_]",
                                        "IsEmailEnabled": true,
                                        "IsEmailIdMaintained": false,
                                        "DoNotDeliverEmail": true,
                                        "DoNotDeliver": false
                                    }
                                ]
                            }
                        );
                    }
                }
            ]);

            Given.iStartMyFLP(sAdapter, oConfig);

            // Actions
            When.onTheHomepage.iPressOnTheMeAreaButton();
            When.onTheMeArea.iPressOnActionButtonWithTitle("Settings");
            When.onTheUserSettings.iPressOnTheNotificationsListItem();

            // Assertions
            var iRow = 0;

            iRow = 0;
            Then.onTheUserSettings.iShouldSeeAnEnabledCheckbox(iRow)
                .and.iShouldSeeASelectedCheckbox(iRow);
            iRow = 1;
                Then.onTheUserSettings.iShouldSeeAnEnabledCheckbox(iRow)
                    .and.iShouldSeeAnUnselectedCheckbox(iRow);
            iRow = 2;
            Then.onTheUserSettings.iShouldNotSeeACheckbox(iRow);
            iRow = 3;
            Then.onTheUserSettings.iShouldNotSeeACheckbox(iRow);

            iRow = 4;
            Then.onTheUserSettings.iShouldNotSeeACheckbox(iRow);

            Then.iTeardownMyFLP();
        });
    });

    aAdapters.forEach(function (sAdapter) {
        opaTest("Should see the notification setting", function (Given, When, Then) {
            // Arrangements
            var oConfig = testUtils.overrideObject(this.defaultConfig, {
                "/renderers/fiori2/componentData/config/enableNotificationsUI": true
            });

            var sMockServerUri = "/mockdata/notifcations/";
            Given.iStartMyMockServer(sMockServerUri, [
                {
                    method: "GET",
                    path: /Channels\(ChannelId='SAP_EMAIL'\)/,
                    response: function (xhr) {
                        xhr.respondJSON(200, {}, {IsActive: false});
                    }
                },
                {
                    method: "GET",
                    path: /Channels\(ChannelId='SAP_SMP'\)/,
                    response: function (xhr) {
                        xhr.respondJSON(200, {}, {IsActive: false});
                    }
                },
                {
                    method: "GET",
                    path: /NotificationTypePersonalizationSet/,
                    response: function (xhr) {
                        xhr.respondJSON(200, {},
                            {
                                "value": [
                                    {   // enabled true -> email will be delivered
                                        "NotificationTypeId": "a",
                                        "NotificationTypeDesc": "Email channel is not active",
                                        "IsEmailEnabled": true,
                                        "IsEmailIdMaintained": true,
                                        "DoNotDeliverEmail": false,
                                        "DoNotDeliver": false
                                    }
                                ]
                            }
                        );
                    }
                }
            ]);
            Given.iStartMyFLP(sAdapter, oConfig);
            // Actions
            When.onTheHomepage.iPressOnTheMeAreaButton();
            When.onTheMeArea.iPressOnActionButtonWithTitle("Settings");
            When.onTheUserSettings.iPressOnTheNotificationsListItem();

            // Assertions
            Then.onTheUserSettings.iShouldSeeNoEmailColumn();

            Then.iTeardownMyFLP();
        });
    });
});
