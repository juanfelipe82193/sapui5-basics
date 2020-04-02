sap.ui.define([
    "sap/ui/test/opaQunit",
    "./pages/NavContainer",
    "./pages/NavigationMiniTile"
], function (opaTest) {
    "use strict";

    opaTest("should see the navigation mini tile playground", function (Given, When, Then) {
        Given.iStartMyApp();

        When.onTheNavContainer.iPressTheNavigationMiniTile();

        Then.onTheNavContainer.iShouldSeeTheNavigationMiniTilePlayground();
    });

    opaTest("should see the text in both two tiles", function (Given, When, Then) {
        When.onTheNavigationMiniTilePlayground.iInputTitleText();

        Then.onTheNavigationMiniTilePlayground.iShouldSeeTheTextInBothTwoTiles();
    });

    opaTest("should see the subtitle text in one tile", function (Given, When, Then) {
        When.onTheNavigationMiniTilePlayground.iInputSubtitleText();

        Then.onTheNavigationMiniTilePlayground.iShouldSeeTheSubtitleTextInOneTile();
    });

    opaTest("should see the icon", function (Given, When, Then) {
        When.onTheNavigationMiniTilePlayground.iSelectAnIcon();

        Then.onTheNavigationMiniTilePlayground.iShouldSeeTheIcon();
    });

    opaTest("should see the intent", function (Given, When, Then) {
        When.onTheNavigationMiniTilePlayground.iInputIntent();

        Then.onTheNavigationMiniTilePlayground.iShouldSeeTheIntent();
        Then.iTeardownMyApp();
    });
});