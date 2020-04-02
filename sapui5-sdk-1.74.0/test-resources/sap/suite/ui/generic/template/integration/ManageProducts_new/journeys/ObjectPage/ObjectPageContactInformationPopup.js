sap.ui.define(["sap/ui/test/opaQunit"],
    function(opaTest) {
        "use strict";

        QUnit.module("Object Page Contact Information Popup");

        opaTest("The Contact Information popup should open when a contact is clicked", function(Given, When, Then) {
            // arrangements
            Given.iStartTheObjectPage();

            // actions
            When.onTheObjectPage
  						.iWaitForTheObjectPageToLoad()
  						.and
              .iClickOnTheContactsButtonInTheAnchorBar()
              .and
              .iClickOnAContactLink("Walter Winter");

            // assertions
            Then.onTheObjectPage
              .theContactInformationShouldBeDisplayedFor("Walter Winter");
        });

        opaTest("The Contact Information popup should open when a new contact is clicked with the right information", function(Given, When, Then) {
            // actions
            When.onTheObjectPage
              .iClickOnAContactLink("Sally Spring");

            // assertions
            Then.onTheObjectPage
              .theContactInformationShouldBeDisplayedFor("Sally Spring");
        		Then.iTeardownMyApp();
        });
    }
);

