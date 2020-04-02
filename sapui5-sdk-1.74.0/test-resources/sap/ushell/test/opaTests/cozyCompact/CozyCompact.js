// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/*global opaTest QUnit */
sap.ui.test.Opa5.extendConfig({
    arrangements: new sap.ushell.test.opaTests.stateLean.Common(),
    autoWait: true
});

QUnit.config.testTimeout = 99999;

sap.ui.require([], function() {

    "use strict";

    QUnit.module("FLPRT - Cozy Compact values");

    opaTest("Test 1: Open App with no Compact and no Cozy", function(Given, When, Then) {
        Given.StartAppWithCozyCompact();
        Then.onTheMainPage.CheckCozyCompactValues(0, 1);
    });

    opaTest("Close application", function(Given, When, Then) {
        Given.iTeardownMyApp();
        QUnit.expect(0);
    });

    opaTest("Test 2: Open App with no Compact and Cozy", function(Given, When, Then) {
        Given.StartAppWithCozyCompact("0");
        Then.onTheMainPage.CheckCozyCompactValues(0, 1);
    });

    opaTest("Close application", function(Given, When, Then) {
        Given.iTeardownMyApp();
        QUnit.expect(0);
    });

    opaTest("Test 3: Open App with Compact and Cozy", function(Given, When, Then) {
        Given.StartAppWithCozyCompact("1");
        Then.onTheMainPage.CheckCozyCompactValues(1, 0);
    });

    opaTest("Close application", function(Given, When, Then) {
        Given.iTeardownMyApp();
        QUnit.expect(0);
    });

    opaTest("Test 4: Open App with invalid values", function(Given, When, Then) {
        Given.StartAppWithCozyCompact("2");
        Then.onTheMainPage.CheckCozyCompactValues(0, 1);
    });

    opaTest("Close application", function(Given, When, Then) {
        Given.iTeardownMyApp();
        QUnit.expect(0);
    });

});