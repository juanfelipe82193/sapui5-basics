// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components._HeaderManager.SetHeadPropertyStrategy
 */
sap.ui.require([
    "sap/ushell/components/_HeaderManager/SetHeadPropertyStrategy"
], function (SetHeadPropertyStrategy) {
    "use strict";

    /* global QUnit */

    QUnit.module("sap.ushell.components._HeaderManager.SetHeadPropertyStrategy", {

    });

    QUnit.test("Don't change the current value, when new value is undefined", function (assert) {
        var sCurrentValue = "test";
        assert.equal(SetHeadPropertyStrategy.execute(sCurrentValue, undefined),
            sCurrentValue,
            "The value should not be changed");
    });

    QUnit.test("Return the new value, when it is defined", function (assert) {
        var sCurrentValue = "test",
            sNewValue = "newValue";
        assert.equal(SetHeadPropertyStrategy.execute(sCurrentValue, sNewValue),
            sNewValue,
            "The new value is returned");
    });


});
