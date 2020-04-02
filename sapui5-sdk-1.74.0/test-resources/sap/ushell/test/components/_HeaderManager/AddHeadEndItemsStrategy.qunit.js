// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components._HeaderManager/AddHeadEndItemsStrategy
 */
sap.ui.require([
    "sap/ushell/components/_HeaderManager/AddHeadEndItemsStrategy"
], function (AddHeadEndItemsStrategy) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.module("sap.ushell.components._HeaderManager.AddHeadEndItemsStrategy", {

    });
    [
        {
            testDescription: "new valid ids is not defined",
            aCurrentlyExistingItems: ["id1"],
            aIdsToAdd: null

        },
        {
            testDescription: "valid id is added to full array",
            aCurrentlyExistingItems: ["id1", "id2", "id3", "id4", "id5", "id6"],
            aIdsToAdd: ["id7"]
        },
        {
            testDescription: "add existed ids",
            aCurrentlyExistingItems: ["id1", "id2", "id3"],
            aIdsToAdd: ["id3"]
        }

    ].forEach(function (oFixture) {
        QUnit.test("Not valid change: " + oFixture.testDescription, function () {
            QUnit.assert.equal(AddHeadEndItemsStrategy.execute(oFixture.aCurrentlyExistingItems, oFixture.aIdsToAdd),
                oFixture.aCurrentlyExistingItems,
                "The current value shoud not be changed");
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
            testDescription: "correct order of search button, copilot and Notification",
            aCurrentlyExistingItems: ["NotificationsCountButton", "sf", "copilotBtn"],
            aIdsToAdd: ["id1"],
            expectedOutput: ["sf", "copilotBtn", "id1", "NotificationsCountButton"]
        }

    ].forEach(function (oFixture) {
        QUnit.test("Calculate new value: " + oFixture.testDescription, function () {
            var oByIdStub = sinon.stub(sap.ui.getCore(), "byId");
            oFixture.aIdsToAdd.forEach(function(sId) {
                oByIdStub.withArgs(sId).returns({id: sId});
            });
            QUnit.assert.deepEqual(AddHeadEndItemsStrategy.execute(oFixture.aCurrentlyExistingItems, oFixture.aIdsToAdd),
                oFixture.expectedOutput,
                "value " + oFixture.expectedOutput.toString() + " is returned");
            oByIdStub.restore();
        });

    });

    [
        {
            testDescription: "do not allow to add an iten if a control with an id does not exist",
            aCurrentlyExistingItems: ["id1"],
            aIdsToAdd: ["id2"],
            aExistingControls: [],
            expectedOutput: ["id1"]
        },
        {
            testDescription: "allow to add an iten if a control exists",
            aCurrentlyExistingItems: ["id1"],
            aIdsToAdd: ["id2"],
            aExistingControls: ["id2"],
            expectedOutput: ["id1", "id2"]
        },
        {
            testDescription: "allow to add a range of items if all of the exist",
            aCurrentlyExistingItems: ["NotificationsCountButton"],
            aIdsToAdd: ["id1", "id2"],
            aExistingControls: ["id1", "id2"],
            expectedOutput: ["id1", "id2", "NotificationsCountButton"]
        },
        {
            testDescription: "do not allow to add a range of items if one of the does not exist",
            aCurrentlyExistingItems: ["NotificationsCountButton"],
            aIdsToAdd: ["id1", "id2"],
            aExistingControls: ["id1"],
            expectedOutput: ["NotificationsCountButton"]
        }

    ].forEach(function (oFixture) {
        QUnit.test("Validate if a control exist: " + oFixture.testDescription, function () {
            var oByIdStub = sinon.stub(sap.ui.getCore(), "byId");
            oFixture.aExistingControls.forEach(function(sId) {
                oByIdStub.withArgs(sId).returns({id: sId});
            });
            QUnit.assert.deepEqual(AddHeadEndItemsStrategy.execute(oFixture.aCurrentlyExistingItems, oFixture.aIdsToAdd),
                oFixture.expectedOutput,
                "value " + oFixture.expectedOutput.toString() + " is returned");
            oByIdStub.restore();
        });

    });
});
