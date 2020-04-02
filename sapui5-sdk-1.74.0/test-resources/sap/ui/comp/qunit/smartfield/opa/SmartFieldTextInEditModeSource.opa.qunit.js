/* eslint-disable no-undef */
sap.ui.define([
    'sap/ui/test/Opa5',
    'sap/ui/test/opaQunit',
    'sap/ui/comp/qunit/personalization/opaTests/Arrangement',
    './actions/SmartFieldTextInEditModeSource',
    './assertions/SmartFieldTextInEditModeSource'
], function (
    Opa5,
    opaTest,
    Arrangement,
    Actions,
    Assertions
) {
    "use strict";
    var appUrl = sap.ui.require.toUrl("test-resources/sap/ui/comp/smartfield/TextInEditModeSource/SmartFieldTextInEditModeSource.html");

    Opa5.extendConfig({
        arrangements: new Arrangement({}),
        assertions: Assertions,
        actions: Actions
    });

    // --- Default Field tests
    QUnit.module("Default Field");

    opaTest("Should see the ValueHelp Dialog for the Default Field", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iPressTheDefaultValueHelpButton();

        // Assertions
        Then.iShouldSeeTheDefaultValueHelpDialog();

        // Cleanup
        Then.iTeardownMyApp();
    });

    opaTest("Should see the ValueHelp Dialog values for the Default Field", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iPressTheDefaultValueHelpButton();

        // Assertions
        Then.iShouldSeeTheDefaultValueHelpDialog();

        // Actions
        When.iPressTheDefaultValueHelpDialogGoButton();

        // Assertions
        Then.iShouldSeeTheDefaultValueHelpDialogValue("GC");
        Then.iShouldSeeTheDefaultValueHelpDialogValue("LT");
        Then.iShouldSeeTheDefaultValueHelpDialogValue("PR");
        Then.iShouldSeeTheDefaultValueHelpDialogValue("SP");
        Then.iShouldSeeTheDefaultValueHelpDialogValue("SS");

        // Cleanup
        Then.iTeardownMyApp();
    });

    // --- NavigationProperty Field Tests
    QUnit.module("NavigationProperty Field");

    opaTest("Should see the ValueHelp Dialog for the NavigationProperty Field", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iPressTheNavigationPropertyValueHelpButton();

        // Assertions
        Then.iShouldSeeTheNavigationPropertyValueHelpDialog();

        // Cleanup
        Then.iTeardownMyApp();
    });

    opaTest("Should see the ValueHelp Dialog values for the NavigationProperty field", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iPressTheNavigationPropertyValueHelpButton();

        // Assertions
        Then.iShouldSeeTheNavigationPropertyValueHelpDialog();

        // Actions
        When.iPressTheNavigationPropertyValueHelpDialogGoButton();

        // Assertions
        Then.iShouldSeeTheNavigationPropertyValueHelpDialogValue("GC");
        Then.iShouldSeeTheNavigationPropertyValueHelpDialogValue("LT");
        Then.iShouldSeeTheNavigationPropertyValueHelpDialogValue("PR");
        Then.iShouldSeeTheNavigationPropertyValueHelpDialogValue("SP");
        Then.iShouldSeeTheNavigationPropertyValueHelpDialogValue("SS");

        // Cleanup
        Then.iTeardownMyApp();
    });

    opaTest("Should see an error 'Value does not exist' for the NavigationProperty Field when entering a wrong value", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iEnterACategoryInTheNavigationPropertyField("XXX");

        // Assertions
        Then.iShouldSeeAnErrorForTheNavigationPropertyField("Value does not exist.");

        // Cleanup
        Then.iTeardownMyApp();
    });

    opaTest("Should see an error 'Enter a text with a maximum of 3 characters and spaces' for the NavigationProperty Field when entering a short value", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iEnterACategoryInTheNavigationPropertyField("XXXX");

        //Assertions
        Then.iShouldSeeAnErrorForTheNavigationPropertyField("Enter a text with a maximum of 3 characters and spaces");

        // Cleanup
        Then.iTeardownMyApp();
    });

    opaTest("Should not see an error for the NavigationProperty Field when entering a copied value", function (Given, When, Then) {
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iWaitForPromise(When.iRememberTheValueOfTheNavigationPropertyField()).then(function() {
            When.iEnterTheRememberedValueInTheNavigationPropertyField();

            // Assertions
            Then.iShouldNotSeeAnErrorForTheNavigationPropertyField();

            // Cleanup
            Then.iTeardownMyApp();
        });
    });

    opaTest("Should see a correct suggested category for the NagivationProperty Field", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iEnterACategoryInTheNavigationPropertyField("GC");

        // Assertions
        Then.iShouldSeeASuggestedCategoryInTheNavigationPropertyField("GC (Graphics Card)");

        // Cleanup
        Then.iTeardownMyApp();
    });

    // --- ValueList Field Tests
    QUnit.module("ValueList Field");

    opaTest("Should see the ValueHelp Dialog for the ValueList Field", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iPressTheValueListValueHelpButton();

        // Assertions
        Then.iShouldSeeTheValueListValueHelpDialog();

        // Cleanup
        Then.iTeardownMyApp();
    });

    opaTest("Should see the ValueHelp Dialog values for the ValueList field", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iPressTheValueListValueHelpButton();

        // Assertions
        Then.iShouldSeeTheValueListValueHelpDialog();

        // Actions
        When.iPressTheValueListValueHelpDialogGoButton();

        // Assertions
        Then.iShouldSeeTheValueListValueHelpDialogValue("AP");
        Then.iShouldSeeTheValueListValueHelpDialogValue("AP2");
        Then.iShouldSeeTheValueListValueHelpDialogValue("DL");
        Then.iShouldSeeTheValueListValueHelpDialogValue("LN");
        Then.iShouldSeeTheValueListValueHelpDialogValue("NV");
        Then.iShouldSeeTheValueListValueHelpDialogValue("PL");

        // Cleanup
        Then.iTeardownMyApp();
    });

    opaTest("Should see an error 'Value does not exist' for the ValueList Field", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iEnterAManufacturerInTheValueListField("XXX");

        //Assertions
        Then.iShouldSeeAnErrorForTheValueListField("Value does not exist.");

        // Cleanup
        Then.iTeardownMyApp();
    });

    opaTest("Should see an error 'Enter a text with a maximum of 3 characters and spaces' for the ValueList Field", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iEnterAManufacturerInTheValueListField("XXXX");

        //Assertions
        Then.iShouldSeeAnErrorForTheValueListField("Enter a text with a maximum of 3 characters and spaces");

        // Cleanup
        Then.iTeardownMyApp();
    });

    opaTest("Should see a correct suggested manufacturer for the ValueList Field", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iEnterAManufacturerInTheValueListField("AP");

        //Assertions
        Then.iShouldSeeASuggestedManufacturerInTheValueListField("Apple (AP)");

        // Cleanup
        Then.iTeardownMyApp();
    });


    // Seems to be broken due to MockServer issues
    //  opaTest("Should see an error for the ValueList Field when entering a copied value", function (Given, When, Then) {
    //     // Arrangements
    //     Given.iStartMyAppInAFrame(appUrl);

    //     // Actions
    //     When.iWaitForPromise(When.iRememberTheValueOfTheValueListField()).then(function() {
    //         When.iEnterTheRememberedValueInTheValueListField();
    //         // Assertion
    //         Then.iShouldSeeAnErrorForTheValueListField("Invalid filter query statement");

    //         // Cleanup
    //     Then.iTeardownMyApp();
    //     });
    // });

    QUnit.module("ValueList Field with GUID");

    opaTest("Shouldn't see an error for a non duplicated GUID Category entry", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iEnterACategoryInTheValueListGUIDField("Smartphone");

        // Assertions
        Then.iShouldNotSeeAnErrorForTheValueListGUIDField();

        // Cleanup
        Then.iTeardownMyApp();
    });

    opaTest("Should see an error for a duplicated GUID Category entry", function (Given, When, Then) {
        // Arrangements
        Given.iStartMyAppInAFrame(appUrl);

        // Actions
        When.iEnterACategoryInTheValueListGUIDField("Smartphone");

        // Assertions
        Then.iShouldNotSeeAnErrorForTheValueListGUIDField();

        // Actions
        When.iWaitForPromise(When.iEnterACategoryInTheValueListGUIDField("Projector")).then(function () {
            //Assertions
            Then.iShouldSeeAnErrorForTheValueListGUIDField("Please select a value from the value help.");

            // Cleanup
            Then.iTeardownMyApp();
        });
    });
});