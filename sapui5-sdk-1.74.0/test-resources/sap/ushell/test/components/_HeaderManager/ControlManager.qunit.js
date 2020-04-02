// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components._HeaderManager.ControlManager
 */
sap.ui.require([
    "sap/ushell/components/_HeaderManager/ControlManager",
    "sap/ushell/Config"
], function (ControlManager, Config) {
    "use strict";

    /* global QUnit */

    QUnit.module("sap.ushell.components._HeaderManager.ControlManager", {

    });

    [
        {
            testDescription: "floating number is part of the model",
            oExistingModel: { notificationsCount: 5 },
            expectedFloatingNumber: 5
        }

    ].forEach(function (oFixture) {
        QUnit.test("Floating Number is populated, when " + oFixture.testDescription, function (assert) {
            // arrange
            var oController = {};
            var oShellModel = new sap.ui.model.json.JSONModel(oFixture.oExistingModel);
            // act
            var sActualButtonName = ControlManager._createOverflowButton(oController, oShellModel);
            // assert
            var oButton = sap.ui.getCore().byId(sActualButtonName);
            var sFloatingNumber = oButton.getFloatingNumber();
            assert.equal(
                sFloatingNumber,
                oFixture.expectedFloatingNumber,
                "The Floating Number is as expected"
            );
        });

    });

});
