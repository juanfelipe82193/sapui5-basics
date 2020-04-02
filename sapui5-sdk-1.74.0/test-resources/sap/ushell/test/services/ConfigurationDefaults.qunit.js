// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.ConfigurationDefaults
 */
sap.ui.require([
    "sap/base/Log",
    "sap/ushell/services/ConfigurationDefaults",
    "sap/ushell/bootstrap/common/common.create.configcontract.core",
    "sap/ushell/test/utils"
], function (Log, ConfigurationDefaults, CommonConfigureConfigcontract, testUtils) {
    "use strict";

    /* global QUnit sinon*/

    var MockAdapter = function (oDefaultConfig) {
        this.getDefaultConfig = function () {
            return Promise.resolve(oDefaultConfig);
        };
    };

    QUnit.module("sap.ushell.services.ConfigurationDefaults", {

    });

    QUnit.test("getDefaults should return correct result from default config", function (assert) {
        var fnDone = assert.async(),
            oFakeAdapter = new MockAdapter({a: "test"}),
            oService = new ConfigurationDefaults(oFakeAdapter);

        // Act
        oService.getDefaults(["a"]).then(function (oResult) {
            // Assert
            assert.strictEqual(oResult.a.defaultValue, "test", "The defaults returns correct value: test");
            fnDone();
        });
    });

    QUnit.test("getDefaults should return undefined if the path not found", function (assert) {
        var fnDone = assert.async(),
            oDefaultConfig = testUtils.overrideObject({}, {
                "/a/b/c": true
            }),
            oFakeAdapter = new MockAdapter(oDefaultConfig),
            oService = new ConfigurationDefaults(oFakeAdapter),
            aInput = [
                "a/b/d"
            ];

        // Act
        oService.getDefaults(aInput).then(function (oResult) {
            // Assert
            assert.strictEqual(oResult[aInput[0]], undefined, "The defaults returns undefined if path not found");
            fnDone();
        });
    });

    QUnit.test("getDefaults should return array with the same length as input", function (assert) {
        var fnDone = assert.async(),
            oDefaultConfig = testUtils.overrideObject({}, {
                "/renderers/fiori2/componentData/config/enableRecentActivity": true
            }),
            oFakeAdapter = new MockAdapter(oDefaultConfig),
            oService = new ConfigurationDefaults(oFakeAdapter),
            aInput = [
                "renderers/fiori2/componentData/config/enableRecentActivity",
                "a/b/c"
            ];

        // Act
        oService.getDefaults(aInput).then(function (oResult) {
            // Assert
            assert.strictEqual(aInput.length, Object.keys(oResult).length, "The length of the result and input should be equal");
            assert.strictEqual(oResult[aInput[0]].defaultValue, true, "The defaults returns correct value");
            assert.strictEqual(oResult[aInput[1]], undefined, "The defaults returns undefined when path not found");
            fnDone();
        });
    });

    QUnit.test("getDefaults for not valid inputs", function (assert) {
        var fnDone = assert.async(),
            oDefaultConfig = testUtils.overrideObject({}, {
                "/a/b/c": true
            }),
            oWarningSpy = sinon.spy(Log, "warning"),
            oFakeAdapter = new MockAdapter(oDefaultConfig),
            oService = new ConfigurationDefaults(oFakeAdapter),
            aInput = [
                "/a/b/c",
                "",
                undefined
            ];


        // Act
        oService.getDefaults(aInput).then(function (oResult) {
            // Assert
            assert.strictEqual(oResult[aInput[0]], undefined, "The defaults returns undefined if path not found");
            assert.strictEqual(oWarningSpy.callCount, 3, "Log.warning should be called twice.");
            oWarningSpy.restore();
            fnDone();
        });
    });

    QUnit.test("getDefaults should return null if the path was found and value is undefined", function (assert) {
        var fnDone = assert.async(),
            oDefaultConfig = testUtils.overrideObject({}, {
                "/a/b/c": undefined
            }),
            oFakeAdapter = new MockAdapter(oDefaultConfig),
            oService = new ConfigurationDefaults(oFakeAdapter),
            aInput = ["a/b/c"];

        // Act
        oService.getDefaults(aInput).then(function (oResult) {
            // Assert
            assert.strictEqual(oResult[aInput[0]].defaultValue, null,
                "The defaults returns null defaultValue if path found and value undefined");
            fnDone();
        });
    });

    QUnit.test("getDefaults also checks for common config defaults on top of platform specifics", function (assert) {
        // Arrange
        var fnDone = assert.async(),
            oDefaultConfig = {},
            oDefaultCommonConfig = {
                "b/a": 123
            },
            oGetDefaultConfigStub = sinon.stub(CommonConfigureConfigcontract, "getDefaultConfiguration").returns(oDefaultCommonConfig),
            oFakeAdapter = new MockAdapter(oDefaultConfig),
            oService = new ConfigurationDefaults(oFakeAdapter),
            aInput = ["b/a"];

        // Act
        oService.getDefaults(aInput).then(function (oResult) {
            // Assert
            assert.strictEqual(oResult["b/a"].defaultValue, 123, "The expected value was extracted from the common config defaults");

            // Cleanup
            oGetDefaultConfigStub.restore();
            fnDone();
        });
    });
});