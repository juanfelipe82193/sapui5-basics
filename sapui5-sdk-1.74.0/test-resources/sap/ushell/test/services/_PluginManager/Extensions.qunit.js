// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services._PluginManager.Extensions
 */
sap.ui.require([
    "sap/ushell/services/_PluginManager/Extensions",
    "sap/ushell/services/_PluginManager/HeaderExtensions"
], function (fnGetExtensions, HeaderExtensions) {
    "use strict";

    /* global QUnit */

    QUnit.module("sap.ushell.services._PluginManager.Extensions", {

    });

    QUnit.test("getExtensions return correct API when correct parameter", function (assert) {
        var fnDone = assert.async();

        fnGetExtensions("Header").then(function (oHeaderExtension) {
            assert.equal(oHeaderExtension, HeaderExtensions, "HeaderExtensions is returned");
            fnDone();
        });
    });

    QUnit.test("getExtensions reject when called with not existing extension parameter", function (assert) {
        var fnDone = assert.async();

        fnGetExtensions("SomeWrongName").then(function () {
            assert.ok(false, "getExtensions must reject");
            fnDone();
        }).catch(function (sError) {
            assert.ok(true, "getExtensions must reject");
            assert.ok(sError.length > 0, "Error message is not empty");
            fnDone();
        });

    });
});
