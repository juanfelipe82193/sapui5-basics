sap.ui.define([
    "sap/ui/test/opaQunit",
    "./pages/NavContainer",
    "./pages/ShellAppTitle"
], function (opaTest) {
    "use strict";

    opaTest("should see the shell app title playground", function (Given, When, Then) {
        Given.iStartMyApp();

        When.onTheNavContainer.iPressTheShellAppTitle();

        Then.onTheNavContainer.iShouldSeeTheShellAppTitlePlayground();
    });

    opaTest("should see the shell app title", function (Given, When, Then) {
        When.onTheShellAppTitlePlayground.iModifyTheShellAppTitleText();

        Then.onTheShellAppTitlePlayground.iShouldSeeTheModifiedShellAppTitleText();
    });

    opaTest("should see the navigation menu", function (Given, When, Then) {
        When.onTheShellAppTitlePlayground.iTurnOnTheNavigationMenuSwitch();

        Then.onTheShellAppTitlePlayground.iShouldSeeADropDownIcon();

        When.onTheShellAppTitlePlayground.iPressTheShellAppTitle();

        Then.onTheShellAppTitlePlayground.iShouldSeeANavigationMenu();
    });

    opaTest("should see the all my apps view", function (Given, When, Then) {
        When.onTheShellAppTitlePlayground.iTurnOnTheAllMyAppsViewSwitch();

        Then.onTheShellAppTitlePlayground.iShouldSeeADropDownIcon();

        When.onTheShellAppTitlePlayground.iPressTheShellAppTitle();

        Then.onTheShellAppTitlePlayground.iShouldSeeTheAllMyAppsView();
        Then.iTeardownMyApp();

    });
});