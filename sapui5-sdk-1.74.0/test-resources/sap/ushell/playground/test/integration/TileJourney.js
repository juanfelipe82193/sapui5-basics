sap.ui.define([
    "sap/ui/test/opaQunit",
    "./pages/NavContainer",
    "./pages/Tile"
], function (opaTest) {
    "use strict";

    opaTest("should see the tile playground", function (Given, When, Then) {
        Given.iStartMyApp();

        When.onTheNavContainer.iPressTheTile();

        Then.onTheNavContainer.iShouldSeeTheTilePlayground();
    });

    opaTest("should see the tile", function (Given, When, Then) {
        When.onTheTilePlayground.iTurnOnTheVisibleSwitch();

        Then.onTheTilePlayground.iShouldSeeTheTile();
    });

    opaTest("should see the long tile", function (Given, When, Then) {
        When.onTheTilePlayground.iTurnOnTheLongSwitch();

        Then.onTheTilePlayground.iShouldSeeTheLongTile();
    });

    opaTest("should see the tile with given configurations", function (Given, When, Then) {
        When.onTheTilePlayground.iSelectATarget();
        When.onTheTilePlayground.iTurnOnTheTileActionModeActiveSwitch();
        When.onTheTilePlayground.iTurnOnTheShowTileViewSwitch();
        When.onTheTilePlayground.iTurnOnTheShowPinButtonSwitch();
        When.onTheTilePlayground.iTurnOnThePressActionSwitch();
        When.onTheTilePlayground.iTurnOnTheDeleteActionSwitch();

        Then.onTheTilePlayground.iShouldSeeTheTileWithGivenConfigurations();
    });

    opaTest("should see the message toast after press the tile", function (Given, When, Then) {
        When.onTheTilePlayground.iPressTheTile();

        Then.onTheTilePlayground.iShouldSeeTheMessageToast();
    });

    opaTest("should see the message toast after press the delete icon", function (Given, When, Then) {
        When.onTheTilePlayground.iPressTheDeleteIcon();

        Then.onTheTilePlayground.iShouldSeeTheMessageToast();
        Then.iTeardownMyApp();
    });
});