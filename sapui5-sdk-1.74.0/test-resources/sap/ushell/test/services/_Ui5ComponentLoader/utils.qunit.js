// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for Ui5ComponentLoader's Utils
 */
sap.ui.require([
    "sap/ushell/services/_Ui5ComponentLoader/utils",
    "sap/ushell/services/Ui5ComponentHandle",
    "sap/ushell/test/utils"
], function (oUi5ComponentLoaderUtils, Ui5ComponentHandle, oTestUtils) {
    "use strict";

    /* global QUnit sinon */

    var aDefaultCoreExtLightPreloadBundles = [
        "sap/fiori/core-ext-light-0.js",
        "sap/fiori/core-ext-light-1.js",
        "sap/fiori/core-ext-light-2.js",
        "sap/fiori/core-ext-light-3.js"
    ];

    QUnit.module("Utils", {
        setup: function () {
        },
        teardown: function () {
            oTestUtils.restoreSpies(
                sap.ui.component,
                jQuery.sap.log.error,
                jQuery.sap._loadJSResourceAsync
            );
        }
    });

    QUnit.test("createUi5Component calls sap.ui.component with the correct component properties", function (assert) {
        var fnDone = assert.async();

        sinon.stub(sap.ui, "component")
            .returns(new jQuery.Deferred().resolve().promise());

        var oInputComponentData = { my: "componentDataContent" };
        var oInputComponentProperties = {};

        var oExpectedComponentProperties = {
            componentData: oInputComponentData, // moved in
            async: true                         // added
        };

        oUi5ComponentLoaderUtils.createUi5Component(oInputComponentProperties, oInputComponentData)
            .always(function () {
                assert.deepEqual(sap.ui.component.getCall(0).args[0],
                    oExpectedComponentProperties, "sap.ui.component was called with the expected parameter");
                fnDone();
            });
    });

    QUnit.test("createUi5Component resolves with a sap.ui.component instance if component instantiation succeeds", function (assert) {
        var fnDone = assert.async();
        var oFakeComponentInstance = {
            "sapUiComponent": true
        };

        sinon.stub(sap.ui, "component")
            .returns(new jQuery.Deferred().resolve(oFakeComponentInstance).promise());

        var oInputComponentData = {};       // value not important for the test
        var oInputComponentProperties = {}; // value not important for the test

        oUi5ComponentLoaderUtils.createUi5Component(oInputComponentProperties, oInputComponentData)
            .done(function (oGotComponent) {
                assert.ok(true, "promise is resolved");

                assert.strictEqual(oGotComponent, oFakeComponentInstance,
                    "promise resolved with a Ui5ComponentHandle object");
            })
            .fail(function () {
                assert.ok(false, "promise is resolved");
            })
            .always(fnDone);
    });

    QUnit.test("createUi5Component rejects with an error message if component instantiation fails", function (assert) {
        var fnDone = assert.async();

        var oFakeError = {
            status: null,
            stack: "..."
            // ...
        };

        sinon.stub(sap.ui, "component")
            .returns(new jQuery.Deferred().reject(oFakeError).promise());

        var oInputComponentData = {};       // value not important for the test
        var oInputComponentProperties = {}; // value not important for the test

        oUi5ComponentLoaderUtils.createUi5Component(oInputComponentProperties, oInputComponentData)
            .done(function (oGotComponentHandle) {
                assert.ok(false, "promise is rejected");
            })
            .fail(function (oError) {
                assert.ok(true, "promise is rejected");

                assert.deepEqual(oError, oFakeError,
                    "promise rejected with the expected error object");
            })
            .always(fnDone);
    });

    [
        {
            testDescription: "no special bundle is configured",
            bootstrapConfig: {
                ammendedLoading: true
            },
            expectedBundle: {
                name: "CoreResourcesComplement",
                aResources: aDefaultCoreExtLightPreloadBundles
            }
        },
        {
            testDescription: "a special bundle with one part is configured",
            bootstrapConfig: {
                ammendedLoading: true,
                coreResourcesComplement: {
                    name: "core-resources-complement",
                    count: 1,
                    debugName: "core-resources-complement-dbg",
                    path: "some/path/"
                }
            },
            expectedBundle: {
                name: "CoreResourcesComplement",
                aResources: [
                    "some/path/core-resources-complement.js"
                ]
            }
        },
        {
            testDescription: "a special bundle with 5 parts is configured",
            bootstrapConfig: {
                ammendedLoading: true,
                coreResourcesComplement: {
                    name: "core-resources-complement",
                    count: 5,
                    debugName: "core-resources-complement-dbg",
                    path: "some/path/"
                }
            },
            expectedBundle: {
                name: "CoreResourcesComplement",
                aResources: [
                    "some/path/core-resources-complement-0.js",
                    "some/path/core-resources-complement-1.js",
                    "some/path/core-resources-complement-2.js",
                    "some/path/core-resources-complement-3.js",
                    "some/path/core-resources-complement-4.js"
                ]
            }
        },
        {
            testDescription: "no special bundle is configured and debug Resources are enabled",
            bootstrapConfig: {
                ammendedLoading: true
            },
            debugResources: true,
            expectedBundle: {
                name: "CoreResourcesComplement",
                aResources: [
                    "sap/fiori/core-ext-light.js"
                ]
            }
        },
        {
            testDescription: "a special bundle with one part is configured and debug Resources are enabled",
            bootstrapConfig: {
                ammendedLoading: true,
                coreResourcesComplement: {
                    name: "core-resources-complement",
                    count: 1,
                    debugName: "core-resources-complement-dbg",
                    path: "some/path/"
                }
            },
            debugResources: true,
            expectedBundle: {
                name: "CoreResourcesComplement",
                aResources: [
                    "some/path/core-resources-complement-dbg.js"
                ]
            }
        },
        {
            testDescription: "a special bundle with 4 parts is configured and debug Resources are enabled",
            bootstrapConfig: {
                ammendedLoading: true,
                coreResourcesComplement: {
                    name: "core-resources-complement",
                    count: 4,
                    debugName: "core-resources-complement-dbg",
                    path: "some/path/"
                }
            },
            debugResources: true,
            expectedBundle: {
                name: "CoreResourcesComplement",
                aResources: [
                    "some/path/core-resources-complement-dbg.js"
                ]
            }
        },
        {
            testDescription: "no special bundle is configured and debug Resources is a path",
            bootstrapConfig: {
                ammendedLoading: true
            },
            debugResources: "/some/debug/path",
            expectedBundle: {
                name: "CoreResourcesComplement",
                aResources: aDefaultCoreExtLightPreloadBundles
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("CoreResourcesComplement Loading - _prepareBundle is providing the correct Bundle object when " + oFixture.testDescription, function (assert) {
            var oResult;

            window["sap-ui-debug"] = oFixture.debugResources;

            oResult = oUi5ComponentLoaderUtils.prepareBundle(oFixture.bootstrapConfig.coreResourcesComplement);

            assert.deepEqual(oResult, oFixture.expectedBundle, "The expected bundle is returned");
            delete window["sap-ui-debug"];
        });
    });

    [
        {
            testDescription: "doesn't get executed when no parameter is provided",
            bundle: undefined,
            expectedCalls: {
                error: 1,
                errorMessage: "Ui5ComponentLoader: loadBundle called with invalid arguments"
            }
        },
        {
            testDescription: "doesn't get executed when no name is provided",
            bundle: {
                eventName: undefined,
                resources: [
                    "TestResource.js",
                    "TestResource2.js"
                ]
            },
            expectedCalls: {
                error: 1,
                errorMessage: "Ui5ComponentLoader: loadBundle called with invalid arguments"
            }
        },
        {
            testDescription: "doesn't get executed when no resource is provided",
            bundle: {
                eventName: "SomeName",
                resources: undefined
            },
            expectedCalls: {
                error: 1,
                errorMessage: "Ui5ComponentLoader: loadBundle called with invalid arguments"
            }
        },
        {
            testDescription: "doesn't get executed when resource is provided as a wrong datatype",
            bundle: {
                eventName: "SomeName",
                resources: "SomeResource.js"
            },
            expectedCalls: {
                error: 1,
                errorMessage: "Ui5ComponentLoader: loadBundle called with invalid arguments"
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("CoreResourcesComplement Loading - loadBundle doesn't get executed when " + oFixture.testDescription, function (assert) {
            // Arrange
            var oLogErrorSpy = sinon.spy(jQuery.sap.log, "error");

            // Act
            oUi5ComponentLoaderUtils.loadBundle(oFixture.bundle);

            // Assert
            assert.strictEqual(oLogErrorSpy.callCount, oFixture.expectedCalls.error, "jQuery.sap.log.error has been called for the correct amount of times;");
            assert.strictEqual(oLogErrorSpy.firstCall.args[0], oFixture.expectedCalls.errorMessage, "jQuery.sap.log.error was called with the correct argument");
        });
    });

    [
        {
            testDescription: "loads the correct resources when a valid Bundle is provided",
            bundle: {
                name: "testBundle",
                aResources: [
                    "ValidResource",
                    "AnotherValidResource"
                ]
            },
            shouldSucceed: true
        },
        {
            testDescription: "fails when the resources are invalid",
            bundle: {
                name: "testBundle",
                aResources: [
                    "FailingResource",
                    "FailingResource"
                ]
            },
            shouldSucceed: false
        },
        {
            testDescription: "fails when only one resource is invalid",
            bundle: {
                name: "testBundle",
                aResources: [
                    "ValidResource",
                    "FailingResource"
                ]
            },
            shouldSucceed: false
        }
    ].forEach(function (oFixture) {
        QUnit.test("CoreResourcesComplement Loading - loadBundle " + oFixture.testDescription, function (assert) {
            // Arrange
            var oErrorStub = sinon.stub(jQuery.sap.log, "error"),
                fnDone = assert.async();

            sinon.stub(jQuery.sap, "_loadJSResourceAsync", function (sResource) {
                var oDeferred = new jQuery.Deferred();
                if (sResource === "FailingResource") {
                    oDeferred.reject();
                } else {
                    oDeferred.resolve();
                }
                return oDeferred.promise();
            });

            // Act
            var oLoadBundlePromise = oUi5ComponentLoaderUtils.loadBundle(oFixture.bundle);

            // Assert
            oLoadBundlePromise
                .done(function () {
                    assert.strictEqual(oFixture.shouldSucceed, true, "Promise resolved as expected");
                    assert.strictEqual(oErrorStub.called, false, "No error log created as expected");
                    fnDone();
                })
                .fail(function () {
                    assert.strictEqual(oFixture.shouldSucceed, false, "Promise rejected as expected");
                    assert.strictEqual(oErrorStub.called, true, "Error created as expected");
                    fnDone();
                });
        });
    });

    [
        {
            testDescription: "proper arguments are provided",
            oInput: {
                sBundleName: "FooBundle",
                sPath: "foo/path/",
                iResourceCount: 5
            },
            aExpectedResult: [
                "foo/path/FooBundle-0.js",
                "foo/path/FooBundle-1.js",
                "foo/path/FooBundle-2.js",
                "foo/path/FooBundle-3.js",
                "foo/path/FooBundle-4.js"
            ]
        },
        {
            testDescription: "proper arguments are provided but the path misses the trailing '/'",
            oInput: {
                sBundleName: "FooBundle",
                sPath: "foo/path",
                iResourceCount: 2
            },
            aExpectedResult: [
                "foo/path/FooBundle-0.js",
                "foo/path/FooBundle-1.js"
            ]
        },
        {
            testDescription: "proper arguments are provided but the bundle is not split (resource count = 1)",
            oInput: {
                sBundleName: "FooBundle",
                sPath: "foo/path/",
                iResourceCount: 1
            },
            aExpectedResult: [
                "foo/path/FooBundle.js"
            ]
        },
        {
            testDescription: "proper arguments are provided but resource count is 0",
            oInput: {
                sBundleName: "FooBundle",
                sPath: "foo/path/",
                iResourceCount: 0
            },
            aExpectedResult: []
        }
    ].forEach(function (oFixture) {
        QUnit.test("CoreResourcesComplement Loading - buildBundleResourcesArray builds correct array when " + oFixture.testDescription, function (assert) {
            // Arrange
            var oInput = oFixture.oInput,
                aResult;

            // Act
            aResult = oUi5ComponentLoaderUtils.buildBundleResourcesArray(oInput.sBundleName, oInput.sPath, oInput.iResourceCount);

            // Assert
            assert.deepEqual(aResult, oFixture.aExpectedResult, "Result is as expected");
        });
    });

    [
        {
            testDescription: "no parameters are provided",
            oInput: {}
        },
        {
            testDescription: "the bundle name has an invalid type",
            oInput: {
                sBundleName: { value: "SomeName" },
                sPath: "a/path/",
                iResourceCount: 2
            }
        },
        {
            testDescription: "the Path has an invalid type",
            oInput: {
                sBundleName: "SomeName",
                sPath: { value: "a/path/" },
                iResourceCount: 2
            }
        },
        {
            testDescription: "the Resource number has an invalid type",
            oInput: {
                sBundleName: "SomeName",
                sPath: "a/path/",
                iResourceCount: "2"
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("CoreResourcesComplement Loading - _buildBundleResourcesArray doesn't throw when " + oFixture.testDescription, function (assert) {
            // Act
            var aResult = oUi5ComponentLoaderUtils.buildBundleResourcesArray();

            // Assert
            assert.deepEqual(aResult, null, "Result is as expected");
        });
    });
});
