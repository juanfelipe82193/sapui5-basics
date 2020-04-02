// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components._HeaderManager.AddHeadItemsStrategy
 */
sap.ui.require([
    "sap/ushell/components/_HeaderManager/AddHeadItemsStrategy"
], function (AddHeadItemsStrategy) {
    "use strict";

    /* global QUnit */

    QUnit.module("sap.ushell.components._HeaderManager.AddHeadItemsStrategy", {

    });

    [
        {
            testDescription: "valid id is added to full array",
            aCurrentlyExistingItems: ["id1", "id2", "id3"],
            aIdsToAdd: ["id4"]
        }

    ].forEach(function (oFixture) {
        QUnit.test("Don't apply new ids, when " + oFixture.testDescription, function (assert) {
            assert.equal(AddHeadItemsStrategy.execute(oFixture.aCurrentlyExistingItems, oFixture.aIdsToAdd),
                oFixture.aCurrentlyExistingItems,
                "The current value should not be changed");
        });

    });

    [
        {
            testDescription: "new valid id is given to be added to new non empty array",
            aCurrentlyExistingItems: ["id1"],
            aIdsToAdd: ["id2"],
            expectedOutput: [
                "id1",
                "id2"
            ]
        },
        {
            testDescription: "new value has correct order",
            aCurrentlyExistingItems: [],
            aIdsToAdd: ["homeBtn", "meAreaHeaderButton", "backBtn"],
            expectedOutput: ["backBtn", "homeBtn", "meAreaHeaderButton"]
        }

    ].forEach(function (oFixture) {
        QUnit.test("HeadItem Calculation: calculation is returned, when " + oFixture.testDescription, function (assert) {
            assert.deepEqual(AddHeadItemsStrategy.execute(oFixture.aCurrentlyExistingItems, oFixture.aIdsToAdd),
                oFixture.expectedOutput,
                "value " + oFixture.expectedOutput.toString() + " is returned");
        });

    });

});
