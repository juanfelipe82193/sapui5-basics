// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.adapter.cdm.MenuAdapter
 * @version 1.74.0
 */
sap.ui.require([
    "sap/ushell/adapters/cdm/MenuAdapter"
], function (MenuAdapter) {
    "use strict";
    /* global QUnit */

    QUnit.module("The function getMenuEntries", {
        beforeEach: function () {
            this.oMenuAdapter = new MenuAdapter();
        }
    });

    QUnit.test("Always returns false", function (assert) {
        // Act
        return this.oMenuAdapter.isMenuEnabled().then(function (bMenuEnabled) {
            // Assert
            assert.strictEqual(bMenuEnabled, false, "The function returns false.");
        });
    });

    QUnit.module("The function getMenuEntries", {
        beforeEach: function () {
            this.oMenuAdapter = new MenuAdapter();
        }
    });

    QUnit.test("Always returns an empty array", function (assert) {
        // Act
        return this.oMenuAdapter.getMenuEntries().then(function (aMenuEntries) {
            // Assert
            assert.deepEqual(aMenuEntries, [], "The function returns an empty array.");
        });
    });
});