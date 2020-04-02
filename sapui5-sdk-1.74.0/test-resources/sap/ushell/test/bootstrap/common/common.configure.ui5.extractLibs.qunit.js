// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap/ushell/bootstrap/common/common.configure.ui5datetimeformat.js
 */
sap.ui.require([
    "sap/ushell/test/utils",
    "sap/ushell/bootstrap/common/common.configure.ui5.extractLibs"
], function (testUtils, fnExtractUi5LibsFromUshellConfig) {
    "use strict";
    /*global jQuery, module, sap, sinon, window, QUnit */

    module("sap.ushell.bootstrap.common.common.configure.ui5.extractLibs", {
        setup: function () {
        },
        teardown: function () {
            testUtils.restoreSpies(
                jQuery.sap.log.error
            );
        }
    });

    [
        {
            testDescription: "when ui5 property is undefined",
            oUshellConfig:
            {
            },
            expectedLibs: []
        },
        {
            testDescription: "when libs property is undefined",
            oUshellConfig:
            {
                ui5: {}
            },
            expectedLibs: []
        },
        {
            testDescription: "when libs property is an array",
            oUshellConfig:
            {
                ui5: {
                    libs: []
                }
            },
            expectedLibs: [],
            expectedErrorMessage: "Invalid ushell configuration: /ui5/libs must be an object"
        },
        {
            testDescription: "when libs property is an object with some libs with truthy values and some with falsy",
            oUshellConfig:
            {
                ui5: {
                    libs: {
                        lib1: true,
                        lib2: {
                            additionalProperties: {}
                        },
                        lib3: false,
                        lib4: undefined
                    }
                }
            },
            expectedLibs: ["lib1", "lib2"]
        }
    ].forEach(function (oFixture) {
        QUnit.test("readRequiredLibsFromConfig: is correct " + oFixture.testDescription, function (assert) {

            //Arrange
            var aActualLibs,
                oErrorLogStub = sinon.stub(jQuery.sap.log, "error");

            //Act
            aActualLibs = fnExtractUi5LibsFromUshellConfig(oFixture.oUshellConfig);

            //Assert
            if (oFixture.expectedErrorMessage) {
                assert.equal(oErrorLogStub.callCount, 1,
                    "expected jQuery.sap.log.error called exactly once");

                if (oErrorLogStub.callCount === 1) {
                    assert.strictEqual(oErrorLogStub.getCall(0).args[0], oFixture.expectedErrorMessage,
                        "jQuery.sap.log.error was called with the expected error message");
                    }
                }
            assert.deepEqual(aActualLibs, oFixture.expectedLibs);
        });
    });
});
