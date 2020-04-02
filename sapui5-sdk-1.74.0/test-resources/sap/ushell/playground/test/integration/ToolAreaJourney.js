sap.ui.define([
    "sap/ui/test/opaQunit",
    "./pages/NavContainer",
    "./pages/ToolArea"
], function (opaTest) {
    "use strict";

    opaTest("should see the tool area playground", function (Given, When, Then) {
        Given.iStartMyApp();

        When.onTheNavContainer.iPressTheToolArea();

        Then.onTheNavContainer.iShouldSeeTheToolAreaPlayground();
    });

    opaTest("should see two tool area items", function (Given, When, Then) {
        When.onTheToolAreaPlayground.iPressTheToolAreaItemAddButton();
        When.onTheToolAreaPlayground.iPressTheToolAreaItemAddButton();


        Then.onTheToolAreaPlayground.iShouldSeeTwoToolAreaItem();
    });

    opaTest("should one tool area items", function (Given, When, Then) {
        When.onTheToolAreaPlayground.iPressTheToolAreaItemRemoveButton();

        Then.onTheToolAreaPlayground.iShouldSeeOneToolAreaItem();
        Then.iTeardownMyApp();
    });
});