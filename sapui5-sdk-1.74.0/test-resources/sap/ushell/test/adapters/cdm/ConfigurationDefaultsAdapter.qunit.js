// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap/ushell/adapters/cdm/ConfigurationDefaultsAdapter
 */
sap.ui.require([
    "sap/ushell/adapters/cdm/ConfigurationDefaultsAdapter",
    "sap/ushell/bootstrap/cdm/cdm.constants"
], function (ConfigurationDefaultsAdapter, oCdmConstant) {
    "use strict";

    /* global QUnit */

    QUnit.module("sap/ushell/adapters/cdm/ConfigurationDefaultsAdapter", {
    });

    QUnit.test("getDefaultConfig should resolve cdm.constants", function (assert) {
        var fnDone = assert.async(),
            oAdapter = new ConfigurationDefaultsAdapter();

        // Act
        oAdapter.getDefaultConfig().then(function (oDefaultConfig) {
            // Assert
            assert.deepEqual(oDefaultConfig, oCdmConstant.defaultConfig, "Default config should be the same as cdm.constants");
            assert.notEqual(oDefaultConfig, oCdmConstant.defaultConfig, "Default config should be the copy of the cdm constant");
            fnDone();
        });
    });
});
