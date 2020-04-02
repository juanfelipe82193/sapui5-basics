sap.ui.define([
    "sap/ui/test/opaQunit",
    "./pages/NavContainer",
    "./pages/TileBase"
], function (opaTest) {
    "use strict";

    opaTest("should see the tile base playground", function (Given, When, Then) {
        Given.iStartMyApp();

        When.onTheNavContainer.iPressTheTileBase();

        Then.onTheNavContainer.iShouldSeeTheTileBasePlayground();
    });

    opaTest("should see the tile base with given configurations", function (Given, When, Then) {
        When.onTheTileBasePlayground.iSelectAnIcon();
        When.onTheTileBasePlayground.iInputATitle();
        When.onTheTileBasePlayground.iInputASubtitle();
        When.onTheTileBasePlayground.iInputTileBaseInfo();
        When.onTheTileBasePlayground.iTurnOnThePressActionSwitch();
        When.onTheTileBasePlayground.iInputHighlightTerms();

        Then.onTheTileBasePlayground.iShouldSeeTheTileBaseWithTheGivenConfigurations();
    });

    opaTest("should see the message toast", function (Given, When, Then) {
        When.onTheTileBasePlayground.iPressTheTileBase();

        Then.onTheTileBasePlayground.iShouldSeeTheMessageToast();
        Then.iTeardownMyApp();
    });
});