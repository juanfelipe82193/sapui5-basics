// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ui/test/opaQunit",
    "sap/ushell/testUtils",
    "sap/ushell/opa/tests/header/pages/MeArea",
    "sap/ushell/opa/tests/header/pages/ShellHeader",
    "sap/ushell/opa/tests/homepage/pages/Homepage",
    "sap/ushell/opa/tests/homepage/pages/FloatingContainer",
    "sap/ushell/opa/tests/homepage/pages/UserSettings"
], function (opaTest) {
    "use strict";

    /* global QUnit */
    QUnit.module("Copilot in Fiori3", {
        before: function () {
            window.localStorage.clear();

            this.defaultConfig = {
                "bootstrapPlugins": {
                    "PluginAddDummyCopilot": {
                        "component": "sap.ushell.demo.PluginAddDummyCopilot",
                        "url": "../demoapps/BootstrapPluginSample/PluginAddDummyCopilot"
                    }
                }
            };
        }
    });

    // add other adapters here, once supported
    var aAdapters = ["cdm"];
    aAdapters.forEach(function (sAdapter) {
        opaTest("Open floating container when click on Copilot icon", function (Given, When, Then) {
            Given.iStartMyFLP(sAdapter, this.defaultConfig);

            When.onTheHomepage.iPressOnTheCopilotButton();

            Then.onTheHomepage.iShouldSeeFloatingContainer();
            Then.iTeardownMyFLP();
        });
    });

    aAdapters.forEach(function (sAdapter) {
        opaTest("Close floating container when Copilot icon is clicked twice", function (Given, When, Then) {
            Given.iStartMyFLP(sAdapter, this.defaultConfig);

            When.onTheHomepage.iPressOnTheCopilotButton();
            When.onTheHomepage.iPressOnTheCopilotButton();

            Then.onTheHomepage.iShouldNotSeeFloatingContainer();
            Then.iTeardownMyFLP();
        });
    });
    aAdapters.forEach(function (sAdapter) {
        opaTest("Close floating container when click on close button", function (Given, When, Then) {
            Given.iStartMyFLP(sAdapter, this.defaultConfig);

            When.onTheHomepage.iPressOnTheCopilotButton();
            When.onTheFloatingContainer.iPressOnTheCloseButton();

            Then.onTheHomepage.iShouldNotSeeFloatingContainer();
            Then.iTeardownMyFLP();
        });
    });

    aAdapters.forEach(function (sAdapter) {
        opaTest("Open floating container in docked state when click on the Copilot icon", function (Given, When, Then) {
            Given.iStartMyFLP(sAdapter, this.defaultConfig);

            When.onTheHomepage.iPressOnTheCopilotButton();

            Then.onTheHomepage.iShouldSeeFloatingContainer();
            Then.iTeardownMyFLP();
        });
    });
});
