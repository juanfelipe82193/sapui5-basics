sap.ui.define([
    "sap/ui/test/opaQunit",
    "./pages/NavContainer",
    "./pages/RightFloatingContainer"
], function (opaTest) {
    "use strict";

    opaTest("should see the right floating container playground", function (Given, When, Then) {
        Given.iStartMyApp();

        When.onTheNavContainer.iPressTheRightFloatingContainer();

        Then.onTheNavContainer.iShouldSeeTheRightFloatingContainerPlayground();
    });

    opaTest("should see the item in the right navigation container", function (Given, When, Then) {
        When.onTheRightFloatingContainerPlayground.iInputANumberForTop();
        When.onTheRightFloatingContainerPlayground.iInputANumberForRight();
        When.onTheRightFloatingContainerPlayground.iTurnOnTheHideItemsAfterPresentationSwitch();
        When.onTheRightFloatingContainerPlayground.iTurnOnTheEnableBounceAnimationsSwitch();
        When.onTheRightFloatingContainerPlayground.iTurnOnTheActAsPreviewContainerSwitch();
        When.onTheRightFloatingContainerPlayground.iInputItemDescription();
        When.onTheRightFloatingContainerPlayground.iTurnOnTheItemHideShowMoreButtonSwitch();
        When.onTheRightFloatingContainerPlayground.iTurnOnTheItemTruncateSwitch();
        When.onTheRightFloatingContainerPlayground.iInputItemAuthorName();
        When.onTheRightFloatingContainerPlayground.iSelectItemSetAuthorPicture();
        When.onTheRightFloatingContainerPlayground.iInputItemSetDate();
        When.onTheRightFloatingContainerPlayground.iSelectItemSetPriority();
        When.onTheRightFloatingContainerPlayground.iInputTheItemTitle();
        When.onTheRightFloatingContainerPlayground.iPressAddItemButton();

        Then.onTheRightFloatingContainerPlayground.iShouldSeeTheItemInTheRightFloatingContainer();
        Then.iTeardownMyApp();

    });
});