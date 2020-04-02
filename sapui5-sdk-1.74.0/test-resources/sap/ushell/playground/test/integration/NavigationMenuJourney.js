sap.ui.define([
    "sap/ui/test/opaQunit",
    "./pages/NavContainer",
    "./pages/NavigationMenu"
], function (opaTest) {
    "use strict";

    opaTest("should see the navigation menu playground", function (Given, When, Then) {
        Given.iStartMyApp();

        When.onTheNavContainer.iPressTheShellNavigationMenu();

        Then.onTheNavContainer.iShouldSeeTheShellNavigationMenuPlayground();
    });

    opaTest("should see the title", function (Given, When, Then) {
        When.onTheShellNavigationMenuPlayground.iInputATitle();
        When.onTheShellNavigationMenuPlayground.iTurnOnTheShowTitleSwitch();

        Then.onTheShellNavigationMenuPlayground.iShouldSeeTheTitle();
    });

    opaTest("should see the icon", function (Given, When, Then) {
        When.onTheShellNavigationMenuPlayground.iSelectAnIcon();

        Then.onTheShellNavigationMenuPlayground.iShouldSeeTheIcon();
    });

    opaTest("should see a navigation menu item", function (Given, When, Then) {
        When.onTheShellNavigationMenuPlayground.iInputListItemText();
        When.onTheShellNavigationMenuPlayground.iSelectAListItemIcon();
        When.onTheShellNavigationMenuPlayground.iPressTheAddItemButton();

        Then.onTheShellNavigationMenuPlayground.iShouldSeeANavigationMenuItem();
    });

    opaTest("should see no navigation memu item", function (Given, When, Then) {
        When.onTheShellNavigationMenuPlayground.iPressTheRemoveItemButton();

        Then.onTheShellNavigationMenuPlayground.iShouldSeeNoNavigationMenuItem();
    });

    opaTest("should see the mini tile", function (Given, When, Then) {
        When.onTheShellNavigationMenuPlayground.iInputMiniTileHeaderText();
        When.onTheShellNavigationMenuPlayground.iSelectAMiniTileIcon();
        When.onTheShellNavigationMenuPlayground.iPressTheAddMiniTileButton();

        Then.onTheShellNavigationMenuPlayground.iShouldSeeTheMiniTile();
    });

    opaTest("should see no mini tile", function (Given, When, Then) {
        When.onTheShellNavigationMenuPlayground.iPressTheRemoveMiniTileButton();

        Then.onTheShellNavigationMenuPlayground.iShouldSeeNoMiniTile();
        Then.iTeardownMyApp();
    });
});