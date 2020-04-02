/**
 * @fileOverview QUnit tests for sap.ushell.adapters.local.UserInfoAdapter
 */
sap.ui.define(["sap/ushell/test/utils", "sap/ushell/adapters/local/UserInfoAdapter", "jquery.sap.global", "sap/ushell/services/Container"],
    function (oTestUtils, UserInfoAdapter, jQuery) {
    "use strict";
    /*global Promise, asyncTest, deepEqual, equal, expect, module, ok, QUnit, start, sinon, stop, jQuery, sap */


    var aExpectedDefaultThemeConfiguration = [
            { id: "sap_belize", name: "SAP Belize" }
        ],
        fnClone = function (oJson) {
            return JSON.parse(JSON.stringify(oJson));
        };

    module("sap.ushell.adapters.local.UserInfoAdapter - getThemeList", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(start);
        },
        teardown: function () {
            delete sap.ushell.Container;
        }
    });

    [
        { testInput: { config: {} }, testDescription: "valid structure, emptyConfig" },
        { testInput: {},             testDescription: "no 'config' key provided" },
        { testInput: undefined,      testDescription: "undefined config" }

    ].forEach(function (oTestCase) {

        var sTestDescription = oTestCase.testDescription;

        asyncTest("getThemeList - returns default on " + sTestDescription, function () {
            var oAdapter = new UserInfoAdapter(
                undefined, // unused parameter
                undefined, // unused parameter
                oTestCase.testInput
            );

            expect(2);

            oAdapter.getThemeList()
                .done(function (oResultOptions) {
                    start();

                    equal(Object.prototype.toString.apply(oResultOptions), '[object Object]',
                        "got an object back on " + sTestDescription);

                    deepEqual(oResultOptions.options, aExpectedDefaultThemeConfiguration,
                        "got expected configuration on " + sTestDescription);
                });
        });
    });

    [
        {
            testDescription: "valid configuration specified",
            testInput: {
                config: {
                    themes: [
                        { id: "theme_id_1", name: "theme name 1" },
                        { id: "theme_id_2", name: "theme name 2" },
                        { id: "theme_id_3", name: "theme name 3" , root: "rootName"}
                    ]
                }
            }
        }
    ].forEach(function (oTestCase) {

        var sTestDescription = oTestCase.testDescription;

        asyncTest("getThemeList - expected theme list on " + sTestDescription, function () {
            var oAdapter = new sap.ushell.adapters.local.UserInfoAdapter(
                undefined, // unused parameter
                undefined, // unused parameter
                oTestCase.testInput
            );

            expect(2);

            oAdapter.getThemeList()
                .done(function (oResultOptions) {
                    start();

                    equal(Object.prototype.toString.apply(oResultOptions), '[object Object]',
                        "got an object back on " + sTestDescription);

                    deepEqual(oResultOptions.options, fnClone(oTestCase.testInput.config.themes),
                        "got specified list of themes on " + sTestDescription);
                });
        });
    });


    asyncTest("getThemeList - rejects on empty list of themes", function () {
        var oAdapter = new UserInfoAdapter(
            undefined, // unused parameter
            undefined, // unused parameter
            {
                config: {  // the input configuration
                    themes: []
                }
            }
        );

        expect(2);

        oAdapter.getThemeList()
            .fail(function (sErrorMessage) {
                ok(true, "getThemeList rejected");
                ok(sErrorMessage.match("no themes were configured"), "expected error message returned");
            })
            .always(function () {
                start();
            });
    });

    module("sap.ushell.adapters.local.UserInfoAdapter - updateUserPreferences", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(start);
        },
        teardown: function () {
            delete sap.ushell.Container;
            oTestUtils.restoreSpies(
                jQuery.sap.log.error
            );
        }
    });

    [
        {
            testDescription: "theme and trackUsageAnalytics changes are udated",
            input: {
                changedProperties: [
                    {
                        name: "THEME",
                        newValue: "newTheme",
                        oldValue: "oldTheme",
                        propertyName: "theme"
                    },
                    {
                        name: "TRACKING_USAGE_ANALYTICS",
                        newValue: true,
                        oldValue: false,
                        propertyName: "trackUsageAnalytics"
                    }
                ]
            },
            expectedSetItemValueCalls: [
                [ "theme", "newTheme" ],
                [ "trackUsageAnalytics", true ]
            ],
            expectedSaveCalls: 1
        }
    ].forEach(function (oFixture) {
        QUnit.test("updateUserPreferences is correct when: " + oFixture.testDescription, function (assert) {
            var oGetServiceOriginal = sap.ushell.Container.getServiceAsync,
                oAdapter = new UserInfoAdapter(),
                oSetItemValueStub = sinon.stub(),
                fnDone = assert.async(),
                oUser = {
                getChangedProperties: function () {
                    return oFixture.input.changedProperties;
                }
            },
            oSaveStub = sinon.stub().returns(new jQuery.Deferred().resolve().promise()),
            fnGetContainerStub = function () {
                var oDeferred = new jQuery.Deferred();
                if (oFixture.input.getContainerError) {
                    oDeferred.reject(oFixture.input.getContainerError);
                } else {
                    oDeferred.resolve({
                        setItemValue: oSetItemValueStub,
                        save: oSaveStub
                    });
                }
                return oDeferred.promise();
            };

            fnGetContainerStub = sinon.spy(fnGetContainerStub);
            sinon.stub(sap.ushell.Container, "getServiceAsync", function (sService) {
                if (sService === "Personalization") {
                    return Promise.resolve({
                        constants: {
                            keyCategory: {
                                FIXED_KEY: "FIXED_KEY"
                            },
                            writeFrequency: {
                                LOW: "LOW"
                            }
                        },
                        getContainer: fnGetContainerStub
                    });
                }
                return oGetServiceOriginal;
            });

            oAdapter.updateUserPreferences(oUser)
                .done(function () {
                    assert.strictEqual(fnGetContainerStub.callCount, 1,
                        "PersonalizationService.getContainer called once");
                    assert.deepEqual(fnGetContainerStub.args[0][0], "sap.ushell.UserProfile",
                        "PersonalizationService.getContainer called with correct arguments");
                    assert.strictEqual(oSetItemValueStub.callCount, oFixture.expectedSetItemValueCalls.length,
                        "setItemValue called expected number of times");
                    assert.deepEqual(oSetItemValueStub.args, oFixture.expectedSetItemValueCalls,
                        "setItemValue called with correct arguments");
                    assert.strictEqual(oSaveStub.callCount, oFixture.expectedSaveCalls,
                        "save called expected number of times");
                })
                .fail(function () {
                    ok(false, "expected that promise was resolved");
                })
                .always(function () {
                    fnDone();
                });
        });
    });

    [
        {
            testDescription: "getContainer fails with Error",
            input: {
                getContainerError: {
                    message: "error message",
                    stack: "stackTrace"
                }
            },
            expectedErrorLogCall:
                [ "Failed to update user preferences: error message", "stackTrace", "com.sap.ushell.adapters.local.UserInfo" ]
        },
        {
            testDescription: "getContainer fails with message",
            input: {
                getContainerError: "error message"
            },
            expectedErrorLogCall:
                [ "Failed to update user preferences: error message", undefined, "com.sap.ushell.adapters.local.UserInfo" ]
        },
        {
            testDescription: "save fails with Error",
            input: {
                saveError: {
                    message: "error message",
                    stack: "stackTrace"
                }
            },
            expectedErrorLogCall:
                [ "Failed to update user preferences: error message", "stackTrace", "com.sap.ushell.adapters.local.UserInfo" ]
        },
        {
            testDescription: "save fails with message",
            input: {
                saveError: "error message"
            },
            expectedErrorLogCall:
                [ "Failed to update user preferences: error message", undefined, "com.sap.ushell.adapters.local.UserInfo" ]
        }
    ].forEach(function (oFixture) {
        QUnit.test("updateUserPreferences does correct error handling when: " + oFixture.testDescription, function (assert) {
            var oGetServiceOriginal = sap.ushell.Container.getServiceAsync,
                oAdapter = new UserInfoAdapter(),
                oSetItemValueStub = sinon.stub(),
                fnDone = assert.async(),
                oUser = {
                    getChangedProperties: function () {
                        return oFixture.input.changedProperties;
                    }
                },
                oSaveStub = function () {
                    var oDeferred = new jQuery.Deferred();
                    if (oFixture.input.saveError) {
                        oDeferred.reject(oFixture.input.saveError);
                    } else {
                        oDeferred.resolve();
                    }
                    return oDeferred.promise();
                },
                oLogMock = sinon.spy(jQuery.sap.log, "error"),
                fnGetContainerStub = function () {
                    var oDeferred = new jQuery.Deferred();
                    if (oFixture.input.getContainerError) {
                        oDeferred.reject(oFixture.input.getContainerError);
                    } else {
                        oDeferred.resolve({
                            setItemValue: oSetItemValueStub,
                            save: oSaveStub
                        });
                    }
                    return oDeferred.promise();
                },
                aExpectedArgs = oFixture.expectedErrorLogCall;

            oSaveStub = sinon.spy(oSaveStub);
            fnGetContainerStub = sinon.spy(fnGetContainerStub);
            sinon.stub(sap.ushell.Container, "getServiceAsync", function (sService) {
                if (sService === "Personalization") {
                    return Promise.resolve({
                        constants: {
                            keyCategory: {
                                FIXED_KEY: "FIXED_KEY"
                            },
                            writeFrequency: {
                                LOW: "LOW"
                            }
                        },
                        getContainer: fnGetContainerStub
                    });
                }
                return oGetServiceOriginal;
            });

            oAdapter.updateUserPreferences(oUser)
                .done(function () {
                    ok(false, "expected that promise was rejected");
                })
                .fail(function () {
                    ok(true, "expected that promise was rejected");
                    equal(oLogMock.callCount, 1, "error logged once");
                    deepEqual(oLogMock.getCalls()[0].args, aExpectedArgs, "error message as expected");
                })
                .always(function () {
                    fnDone();
                });
        });
    });

});