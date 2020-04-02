// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components._HeaderManager.RemoveItemsStrategy
 */
sap.ui.require([
    "sap/ushell/components/_HeaderManager/RemoveItemsStrategy"
], function (RemoveItemsStrategy) {
    "use strict";

    /* global QUnit */

    QUnit.module("sap.ushell.components._HeaderManager.RemoveItemsStrategy", {

    });

    [
        {
            testDescription: "no valid id is to be removed",
            aCurrentlyExistingItems: ["id1", "id2", "id3"],
            aIdsToRemove: ["id4"]
        },
        {
            testDescription: "empty array of removed items",
            aCurrentlyExistingItems: ["id1", "id2", "id3"],
            aIdsToRemove: []
        }

    ].forEach(function (oFixture) {
        QUnit.test("Don't change the current value, when " + oFixture.testDescription, function () {
            QUnit.deepEqual(RemoveItemsStrategy.execute(oFixture.aCurrentlyExistingItems, oFixture.aIdsToRemove),
                oFixture.aCurrentlyExistingItems,
                "The value should not be changed");
        });

    });

    [
        {
            testDescription: "valid id is given to be remove to new non empty array",
            aCurrentlyExistingItems: ["id1", "id2"],
            aIdsToRemove: ["id2"],
            expectedOutput: ["id1"]
        }

    ].forEach(function (oFixture) {
        QUnit.test("Calculate the new values, when " + oFixture.testDescription, function () {
            QUnit.deepEqual(RemoveItemsStrategy.execute(oFixture.aCurrentlyExistingItems, oFixture.aIdsToRemove),
                oFixture.expectedOutput,
                "value " + oFixture.expectedOutput.toString() + " is returned");
        });

    });

});
