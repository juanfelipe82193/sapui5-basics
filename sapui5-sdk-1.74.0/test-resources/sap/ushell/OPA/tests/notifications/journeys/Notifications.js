// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/tests/notifications/data/NotificationsMockData",
    "sap/ushell/opa/tests/header/pages/ShellHeader",
    "sap/ushell/opa/tests/notifications/pages/NotificationsPopup"
], function (opaTest, mockData) {
    "use strict";

    /* global QUnit */
    QUnit.module("notifications popover", {
        before: function () {
            this.oConfig = {
                "services": {
                    "Notifications": {
                        "config": {
                            "enabled": true,
                            "serviceUrl": "/mockdata/notifcations",
                            "pollingIntervalInSeconds": 2000
                        }
                    }
                },
                "renderers": {
                    "fiori2": {
                        "componentData": {
                            "config": {
                                enableNotificationsUI: true
                            }
                        }
                    }
                },
                bootstrapPlugins: {
                    PluginAddFakeCopilot: {
                        component: "sap.ushell.demo.PluginAddFakeCopilot",
                        url: "../demoapps/BootstrapPluginSample/PluginAddFakeCopilot"
                    }
                }
            };
        }
    });

    // add other adapters here, once supported
    var aAdapters = ["cdm"];
    aAdapters.forEach(function (sAdapter) {
        opaTest("Test the notifications popover functionality", function (Given, When, Then) {
            var sMockServerUri = "/mockdata/notifcations/";
            Given.iStartMyMockServer(sMockServerUri, mockData.requests);
            Given.iStartMyFLP(sAdapter, this.oConfig);

            Then.onTheNotificationsPopup.IShouldSeeTheCount(10);
            // Actions
            When.onShellHeader.iPressTheNotificationsButton();

            // Popover is opened and the count is reset to 0
            Then.onTheNotificationsPopup.IShouldSeeThePopover();
            Then.onTheNotificationsPopup.IShouldSeeTheCount(0);
            Then.onTheNotificationsPopup.IShouldSeeNotifications(7);

            // Accept the first item
            When.onTheNotificationsPopup.IPressTheOverflowButton(0);
            When.onTheNotificationsPopup.IPressTheItemButton(0, 0);
            Then.onTheNotificationsPopup.IShouldSeeNotifications(6);

            // Reject the next first item
            When.onTheNotificationsPopup.IPressTheOverflowButton(0);
            When.onTheNotificationsPopup.IPressTheItemButton(0, 1);
            Then.onTheNotificationsPopup.IShouldSeeNotifications(5);

            // Select next tab
            When.onTheNotificationsPopup.ISelectTab(1);
            Then.onTheNotificationsPopup.IShouldSeeNotifications(1);

            // Close the popover
            When.onShellHeader.iPressTheNotificationsButton();
            Then.onTheNotificationsPopup.IShouldSeeTheCount(0);
            Then.onTheNotificationsPopup.IShouldNotSeeThePopover();

            Then.iTeardownMyFLP();
        });
    });
});
