/*global opaTest QUnit */
sap.ui.test.Opa5.extendConfig({
    arrangements: new sap.ushell.test.opaTests.stateLean.Common(),
    autoWait: true
});

QUnit.config.testTimeout = 99999;

sap.ui.require([], function() {

    "use strict";

    QUnit.module("FLPRT - App - lean state");

    opaTest("Test 1: Launch application in lean state and check header items", function(Given, When, Then) {
        Given.StartFLPAppInLeanState();
        Then.onTheMainPage.CheckHeaderItems();
    });

    opaTest("Test 1: Check that title click window shows only in app navigation option", function(Given, When, Then) {
        When.onTheMainPage.ClickOnAppTitle("Sample Application For Navigation");
        Then.onTheMainPage.CheckThatInAppTitleMenuShown();
        Then.onTheMainPage.CheckThatRelatedApplicationIsHidden();
        Then.onTheMainPage.CheckThatAllMyAppsIsHidden();
    });

    opaTest("Close application", function(Given, When, Then) {
        Given.iTeardownMyApp();
        QUnit.expect(0);
    });
});