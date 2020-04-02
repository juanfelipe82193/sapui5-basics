// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/test/Opa5",
    "./arrangements/Setup",
    "./arrangements/Teardown"
], function (Opa5, Setup, Teardown) {
    "use strict";
    /* global QUnit */

    // include journeys here so that they get executed
    // opatests/ maps to local ./tests/
    var aTests = [
        "opatests/header/journeys/FloatingContainer",
        "opatests/homepage/journeys/ThemeSettings",
        "opatests/homepage/journeys/TileSize",
        "opatests/header/journeys/EndItemsOverflow",
        "opatests/header/journeys/MeAreaPlacement",
        "opatests/header/journeys/SearchContainer",
        "opatests/homepage/journeys/QuickAccessDialog",
        "opatests/notifications/journeys/UserSettings",
        "opatests/notifications/journeys/Notifications"
    ];

    // Load the tests in the predefined order
    function loadNextTest () {
        var aNextTest = aTests.splice(0, 1);
        if (aNextTest.length) {
            sap.ui.require(aNextTest, loadNextTest);
        } else {
            QUnit.start(); // start execution after all tests are loaded
        }
    }

    Opa5.extendConfig({
        arrangements: new Setup(),
        assertions: new Teardown(),
        autoWait: true,
        timeout: 120,
        asyncPolling: true
    });

    loadNextTest();
});