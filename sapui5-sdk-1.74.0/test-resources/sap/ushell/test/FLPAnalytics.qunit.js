// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.components.homepage.FLPAnalytics
 * Tests the following use-cases: (which are not tested as part of other modules, e.g. DashboardManager)
 * - Launching an application
 *   - By appOpened event
 *   - By NavContainer AfterNavigate event
 * - Save as Tile (add bookmark)
 * - Activate action mode
 * - Most used application launching source
 *
 * For all the tests there is a stub implementation of getService that returns another stub for the function logCustomEvent.
 * The idea is to publish the relevant event (e.g. appOpened, bookmarkTileAdded, etc..) and to check the corresponding call to UsageAnalytics service function logCustomEvent.
 * Also: in each test case, the hash is being set using window.location.hash, and the test also verifies that window.swa.custom1.ref got the correct hash value
 */
(function () {
    "use strict";

    /* global module, ok, start, stop, test, hasher, sinon */

    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.ui.AppContainer");
    jQuery.sap.require("sap.ui.core.theming.Parameters");

    var oNavContainer = new sap.ushell.ui.AppContainer({
        id: "viewPortContainer",
        pages: []
    }),
        oUsageAnalyticsLogStub,
        oGetServiceStub;
    jQuery.sap.require("sap.ui.thirdparty.hasher");

    module("sap.ushell.components.homepage.FLPAnalytics", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(function () {
                window.swa = {};
                oUsageAnalyticsLogStub = sinon.stub().returns({});
                oGetServiceStub = sinon.stub(sap.ushell.Container, "getService");
                oGetServiceStub.returns({ logCustomEvent: oUsageAnalyticsLogStub });
                jQuery.sap.require("sap.ushell.components.homepage.FLPAnalytics");

                start();
            });
        },
        teardown: function () {
            delete sap.ushell.Container;
            window.location.hash = "";
        }
    });

    test("Open application logging", function () {
        hasher.setHash("businessObject0-action0");
        sap.ushell.services.AppConfiguration = {
            getMetadata: function () {
                return { title: "appTitle0" };
            }
        };

        sap.ui.getCore().getEventBus().publish("sap.ushell", "appOpened", {});

        ok(window.swa.custom1.ref === "businessObject0-action0", "swa.custom1.ref contains the correct hash");
        ok(oUsageAnalyticsLogStub.calledOnce === true, "Called once");
        ok(oUsageAnalyticsLogStub.args[0][0] === "FLP: Application Opened", "logCustomEvent called with type 'FLP: Application Opened'");
        ok(oUsageAnalyticsLogStub.args[0][1] === "Direct Launch", "logCustomEvent called with event value 'Direct Launch'");
        ok(oUsageAnalyticsLogStub.args[0][2][0] === "appTitle0", "logCustomEvent called with application title 'appTitle0'");
    });

    test("After navigation logging", function () {
        var oAfterNavigateData = {
            from: {
                getId: function () {
                    return "applicationShellPage-previousBusinessObject-action";
                }
            },
            to: {
                getId: function () {
                    return "applicationShellPage-businessObject1-action1";
                }
            }
        };

        sap.ushell.services.AppConfiguration = {
            getMetadata: function () {
                return { title: "appTitle1" };
            }
        };

        oNavContainer.fireAfterNavigate(oAfterNavigateData);
        ok(window.swa.custom1.ref === "businessObject1-action1", "swa.custom1.ref contains the correct hash");
        ok(oUsageAnalyticsLogStub.args[0][0] === "FLP: Application Opened", "logCustomEvent called with event type 'FLP: Application Opened'");
        ok(oUsageAnalyticsLogStub.args[0][1] === "Fiori Navigation", "logCustomEvent called with event value 'Through navContainer'");
        ok(oUsageAnalyticsLogStub.args[0][2][0] === "appTitle1", "logCustomEvent called with application title 'appTitle1'");
        oNavContainer.destroy();
    });

    test("Save as Tile logging", function () {
        var oData = {
            tile: { title: "tileTitle" },
            group: {
                title: "groupTitle",
                id: "groupId"
            }
        };

        hasher.setHash("businessObject2-action2");
        window.document.title = "Application Title";
        sap.ui.getCore().getEventBus().publish("sap.ushell.services.Bookmark", "bookmarkTileAdded", oData);

        ok(window.swa.custom1.ref === "businessObject2-action2", "swa.custom1.ref contains the correct hash");
        ok(oUsageAnalyticsLogStub.args[0][0] === "FLP: Personalization", "logCustomEvent called with event type 'FLP: Personalization'");
        ok(oUsageAnalyticsLogStub.args[0][1] === "Save as Tile", "logCustomEvent called with event value 'Save as Tile'");
        ok(oUsageAnalyticsLogStub.args[0][2][0] === "Application Title", "logCustomEvent called with application title 'Application Title'");
        ok(oUsageAnalyticsLogStub.args[0][2][1] === "groupTitle", "logCustomEvent called with group title'groupTitle'");
        ok(oUsageAnalyticsLogStub.args[0][2][2] === "groupId", "logCustomEvent called with group Id 'groupId'");
        ok(oUsageAnalyticsLogStub.args[0][2][3] === "tileTitle", "logCustomEvent called with tile title 'tileTitle'");
    });

    test("Activate action mode logging", function () {
        var oData = { source: "Floating Button" };

        hasher.setHash("businessObject3-action3");
        sap.ui.getCore().getEventBus().publish("launchpad", "actionModeActive", oData);

        ok(window.swa.custom1.ref === "businessObject3-action3", "swa.custom1.ref contains the correct hash");
        ok(oUsageAnalyticsLogStub.args[0][0] === "FLP: Personalization", "logCustomEvent called with event type 'FLP: Personalization'");
        ok(oUsageAnalyticsLogStub.args[0][1] === "Enter Action Mode", "logCustomEvent called with event value 'Enter Action Mode'");
        ok(oUsageAnalyticsLogStub.args[0][2][0] === "Floating Button", "logCustomEvent called with array value 'Floating Button'");
    });

    test("Most used source logging", function () {
        var index,
            oData;

        for (index = 0; index < 5; index++) {
            window.location.hash = "businessObject" + index + "-action" + index;
            sap.ui.getCore().getEventBus().publish("launchpad", "catalogTileClick");
        }

        for (index = 5; index < 10; index++) {
            window.location.hash = "businessObject" + index + "-action" + index;
            sap.ui.getCore().getEventBus().publish("launchpad", "dashboardTileClick");
        }

        window.location.hash = "businessObjectForLink-actionForLink";
        for (index = 10; index < 15; index++) {
            oData = { targetHash: "#businessObject" + index + "-action" + index };
            sap.ui.getCore().getEventBus().publish("launchpad", "dashboardTileLinkClick", oData);
        }

        ok(oUsageAnalyticsLogStub.callCount === 15, "logCustomEvent was called 15 times");

        ok(oUsageAnalyticsLogStub.args[0][0] === "FLP: Application Launch point", "1st Event type is 'FLP: Application Launch point'");
        ok(oUsageAnalyticsLogStub.args[0][1] === "Catalog", "1st Event value 'Catalog'");

        ok(oUsageAnalyticsLogStub.args[5][0] === "FLP: Application Launch point", "5th Event type is 'FLP: Application Launch point'");
        ok(oUsageAnalyticsLogStub.args[5][1] === "Homepage", "5th Event value is 'Homepage'");

        ok(oUsageAnalyticsLogStub.args[10][0] === "FLP: Application Launch point", "10th Event type is 'FLP: Application Launch point'");
        ok(oUsageAnalyticsLogStub.args[10][1] === "Tile Group Link", "10th Event value is 'Tile Group Link'");
    });
}());
