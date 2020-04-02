// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap/ushell/bootstrap/common/common.configure.ui5.js
 */
sap.ui.require([
    "sap/ushell/test/utils",
    "sap/ushell/bootstrap/common/common.configure.ui5"
], function (testUtils, fnConfigureUI5) {
    "use strict";
    /*global jQuery, module, sap, sinon, window, QUnit */

    module("sap.ushell.bootstrap.common.common.configure.ui5", {
        setup: function () {

        },
        teardown: function () {
            window["sap-ui-config"] = {};
            testUtils.restoreSpies(
                jQuery.sap.log.error
            );
        }
    });

    QUnit.test("should fail when no or inclomeplete settings object provided", function (assert) {

        //Arrange
        var oErrorLogStub = sinon.stub(jQuery.sap.log, "error");

        //Act
        var oResult = fnConfigureUI5();

        //Assert
        assert.equal(oErrorLogStub.callCount, 1, "error log written");
        assert.ok(!oResult.hasOwnProperty("libs"), "empty config returned");
    });

    QUnit.test("should fail when no settings.libs is provided", function (assert) {

        //Arrange
        var oErrorLogStub = sinon.stub(jQuery.sap.log, "error");

        //Act
        var oResult = fnConfigureUI5({foo:"bar"});

        //Assert
        assert.equal(oErrorLogStub.callCount, 1, "error log written");
        assert.ok(!oResult.hasOwnProperty("libs"), "empty config returned");
    });


    [
        {
            testDescription: "libs are provided in a correct way",
            oSettings: {
                libs: [
                    "foo","bar"
                ]
            },
            sConfigKeyToTest: "libs",
            sResult: "foo,bar"
        },
        {
            testDescription: "theme is provided via settings",
            oSettings: {
                theme: "fooTheme",
                libs: []
            },
            sConfigKeyToTest: "theme",
            sResult: "fooTheme"
        },
        {
            testDescription: "theme is provided via settings",
            oSettings: {
                theme: "fooTheme",
                libs: []
            },
            sConfigKeyToTest: "theme",
            sResult: "fooTheme"
        }
    ].forEach(function (oFixture) {
        QUnit.test("should write the correct config for UI5 when " + oFixture.testDescription, function (assert) {

            //Arrange

            //Act
            var oResult = fnConfigureUI5(oFixture.oSettings);

            //Assert
            assert.equal(oResult[oFixture.sConfigKeyToTest], oFixture.sResult, "libs are returned in a correct way");
        });
    });
    QUnit.test("should write the correct defaults for valid config object", function (assert) {

        //Arrange

        //Act
        var oResult = fnConfigureUI5({
            libs: ["foo"]
        });

        //Assert
        assert.equal(oResult["bindingsyntax"], "complex", "binding syntax defaults to 'complex'");
        assert.equal(oResult["preload"], "async", "preload defaults to 'async'");
        assert.equal(oResult["compatversion"], "1.16", "compatversion defaults to '1.16'");
    });
});