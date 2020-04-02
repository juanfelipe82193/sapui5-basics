// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/* global sap, sinon, Promise, QUnit */

/**
 * @fileOverview QUnit tests for
 *               sap.ushell.adapters.cdm.PersonalizationAdapter
 */
sap.ui.define([
    "sap/ushell/adapters/cdm/_Personalization/internals",
    "sap/ushell/adapters/cdm/PersonalizationAdapter",
    "sap/ushell/services/_Personalization/constants",
    "sap/ushell/services/_Personalization/constants.private",   // TODO: clarify if private access is OK for adapter
    "sap/ushell/test/utils"
], function (oAdapterInternals, PersonalizationAdapter, oStorageConstants, oInternalPersonalizationConstants, oTestUtils) {
    "use strict";

    var oHttpClientStub;
    var clock = sinon.useFakeTimers();

    /**
     * Utility for creating a stub for the HttpClient
     * <p>
     * It takes an object of responses as argument, for which a fixed response
     * for every HTTP method can be defined.
     *
     * @param {object} oResponses
     */
    function createHttpClientStub(oResponses) {
        oHttpClientStub = {};
        if (typeof oResponses !== "object") {
            throw new Error("Illegal argument: responses must be an object");
        }

        Object.keys(oResponses).forEach(function (sMethod) {
            oHttpClientStub[sMethod] = sinon.stub().returns(
                new Promise(function (resolve, reject) {
                    if (oResponses[sMethod].success) {
                        resolve(oResponses[sMethod]);
                    } else {
                        reject(oResponses[sMethod]);
                    }
                })
            );
        });
    }

    /**
     * Utility method to create a fake sap.ushell.System object.
     *
     */
    function createSystemStub() {
        return {
            getClient: function () { return "120"; }
            // Other methods are not needed by this test at the moment...
        };
    }

    QUnit.module("PersonalizationAdapter");
    QUnit.test("PersonalizationAdapter", function (assert) {
        var oPersAdapter,
            oSystem = createSystemStub(),
            oConfig = {
                config: {
                    storageResourceRoot: "/some/url/"
                    // note: relativeUrlReadOptimized is not needed here
                    // note: relativeUrlWriteOptimized is not needed here
                }
            };

        oPersAdapter = new PersonalizationAdapter(oSystem, null, oConfig);
        assert.strictEqual(typeof oPersAdapter, "object", "expected PersonalizationAdapter to be an object");
    });

    QUnit.module("Adapter/internals");
    QUnit.test("PersonalizationAdapter", function (assert) {
        var oFixture, oPersAdapter;

        // 1.
        // act
        oFixture = {
            input: {
                system: createSystemStub(),
                parameter: "",
                config: {},
                fnHttpClient: sinon.stub().returns(createHttpClientStub({
                    post: {
                        success: true,
                        status: 200,
                        responseText: ""
                    },
                    get: {
                        success: true,
                        status: 200,
                        responseText: ""
                    },
                    put: {
                        success: true,
                        status: 200,
                        responseText: ""
                    },
                    delete: {
                        success: true,
                        status: 200,
                        responseText: ""
                    }
                })),
                cache: null
            }
        };
        assert.throws(function () {
            // act
            var oPersAdapter = new oAdapterInternals.PersonalizationAdapter(
                oFixture.input.fnHttpClient,
                oFixture.input.cache,
                oFixture.input.system,
                oFixture.input.parameter,
                oFixture.input.config
            );
        }, /missing configuration/, "Throws when passed no configuration object");

        // 2. & 3.
        // act
        oFixture = {
            input: {
                system: createSystemStub(),
                parameter: "",
                config: {
                    config: {
                        storageResourceRoot: "path/to/storage/resource/location/"
                    }
                },
                fnHttpClient: sinon.stub().returns(createHttpClientStub({
                    post: {
                        success: true,
                        status: 200,
                        responseText: ""
                    },
                    get: {
                        success: true,
                        status: 200,
                        responseText: ""
                    },
                    put: {
                        success: true,
                        status: 200,
                        responseText: ""
                    },
                    delete: {
                        success: true,
                        status: 200,
                        responseText: ""
                    }
                })),
                cache: null
            }
        };
        // act
        oPersAdapter = new oAdapterInternals.PersonalizationAdapter(
            oFixture.input.fnHttpClient,
            oFixture.input.cache,
            oFixture.input.system,
            oFixture.input.parameter,
            oFixture.input.config
        );
        // assert
        [
            "delAdapterContainer",
            "getAdapterContainer"
        ].forEach(function (sMethodName) {
            assert.ok(
                typeof oPersAdapter[sMethodName] === "function",
                "Calling the constructor with `new` composes an object which exposes method " + sMethodName
            );
        });

        // 4.
        // act
        oFixture = {
            input: {
                system: createSystemStub(),
                parameter: "",
                config: {
                    config: {
                        storageResourceRoot: "path/to/storage/resource/location/"
                    }
                },
                fnHttpClient: sinon.stub().returns(createHttpClientStub({
                    post: {
                        success: true,
                        status: 200,
                        responseText: ""
                    },
                    get: {
                        success: true,
                        status: 200,
                        responseText: ""
                    },
                    put: {
                        success: true,
                        status: 200,
                        responseText: ""
                    },
                    delete: {
                        success: true,
                        status: 200,
                        responseText: ""
                    }
                })),
                cache: null
            }
        };
        // act
        oPersAdapter = new oAdapterInternals.PersonalizationAdapter(
            oFixture.input.fnHttpClient,
            oFixture.input.cache,
            oFixture.input.system,
            oFixture.input.parameter,
            oFixture.input.config
        );
        // assert
        [
            "delAdapterContainer",
            "getAdapterContainer"
        ].forEach(function (sMethodName) {
            assert.ok(
                typeof oPersAdapter[sMethodName] === "function",
                "Calling the constructor as a simple factory without `new` composes an object which exposes method " + sMethodName
            );
        });
    });
    QUnit.test("PersonalizationAdapter: construct an http client with the expected configuration", function (assert) {
        var oPersAdapter,
            oFnHttpClientStub = sinon.stub(),
            oConfig = {
                config: {
                    storageResourceRoot: "path/to/storage/resource/location/"
                }
            };

        oPersAdapter = new oAdapterInternals.PersonalizationAdapter(
            oFnHttpClientStub,
            null,               // cache
            createSystemStub(), // oSystem (with client)
            "",                 // sParameters
            oConfig
        );

        assert.strictEqual(oFnHttpClientStub.callCount, 1,
            "factory to create http client was called one time");

        var oExpectedConfiguration = {
            cache: {},
            headers: {
                "sap-client": "120"
            }
        };

        assert.deepEqual(
            oFnHttpClientStub.getCall(0).args[1],
            oExpectedConfiguration,
            "factory to create http client was called with the expected configuration"
        );
    });

    [
        {
            testDescription: "when succeeds with 2xx",
            input: {
                adapterConfig: {
                    storageResourceRoot: "./user/store/flp",
                    relativeUrlReadOptimized: "p/~20171109122910.5871770~",
                    relativeUrlWriteOptimized: "u"
                },
                containerKey: "sap.ushell.personalization#ContainerKey",
                containerPath: "u/ContainerKey.json",
                containerScope: {
                    validity: Infinity,
                    keyCategory: "GENERATED_KEY",
                    writeFrequency: "HIGH",
                    clientStorageAllowed: false
                },
                url: "./user/store/flp/u/ContainerKey.json",
                response: {
                    success: true,
                    statusCode: 204
                }
            },
            expected: {
                toSucceed: true,
                container: {
                    validity: 2,
                    created: "2017-07-13T08:51:28.475Z",
                    items: {
                    }
                }
            }
        } //,
    ].forEach(function (oFixture) {
        QUnit.test("delAdapterContainer: " + oFixture.testDescription, function (assert) {
            var oContainerCache, oDeletedPromise;

            createHttpClientStub({
                delete: oFixture.input.response
            });

            // 1. It should not throw even though a cache exists and the target key is
            // not in the cache.
            oDeletedPromise = oAdapterInternals.delAdapterContainer(
                oFixture.input.adapterConfig,
                {}, /* empty container cache */
                oHttpClientStub,
                oFixture.input.containerKey,
                oFixture.input.containerScope
            );
            assert.ok(
                typeof oDeletedPromise.then === "function",
                "Deleting a container where its key is not found in the cache executes and returns a promise"
            );

            // 2. It should not throw when a cache is not avaialble.
            oDeletedPromise = oAdapterInternals.delAdapterContainer(
                oFixture.input.adapterConfig,
                null, /* empty container cache */
                oHttpClientStub,
                oFixture.input.containerKey,
                oFixture.input.containerScope
            );
            assert.ok(
                typeof oDeletedPromise.then === "function",
                "Deleting a container when a cache is not available executes and returns a promise"
            );

            // 3. It should remove the container to be deleted from the cache.
            oContainerCache = {
                "SecondContainerKey": { /* another container */ }
            };
            oContainerCache[oFixture.input.containerPath] = { /* one container */ };
            oDeletedPromise = oAdapterInternals.delAdapterContainer(
                oFixture.input.adapterConfig,
                oContainerCache,
                oHttpClientStub,
                oFixture.input.containerKey,
                oFixture.input.containerScope
            );
            assert.deepEqual(
                oContainerCache,
                {
                    "SecondContainerKey": { /* another container */ }
                },
                "Deleting a container when a cache is available, deletes the container from the cache and returns a promise"
            );
        });
    });
    QUnit.test(".getAdapterContainer", function (assert) {
        var oFixture, oActualContainer, oCachedContainer;

        // 1.
        // arrange
        oFixture = {
            testDescription: "Constructs a new instance of an adapter container",
            input: {
                config: {
                    storageResourceRoot: "path/to/storage/resource/location/",
                    relativeUrlReadOptimized: "foo/~cbtoken~",
                    relativeUrlWriteOptimized: "writeFast"
                },
                storageResourceRoot: "/path/to/resource/root/",
                containersCache: null,
                containerKey: "container-key",
                scope: null,
                appName: "application-name",
                oHttpClient: oHttpClientStub
            }
        };
        // act
        oActualContainer = oAdapterInternals.getAdapterContainer(
            oFixture.input.config,
            oFixture.input.containersCache,
            oFixture.input.oHttpClient,
            oFixture.input.storageResourceRoot,
            oFixture.input.containerKey,
            oFixture.input.scope,
            oFixture.input.appName
        );
        // assert
        [
            "save",
            "load",
            "del",
            "getItemKeys",
            "containsItem",
            "setItemValue",
            "getItemValue",
            "delItem"
        ].forEach(function (sMethodName) {
            assert.ok(
                typeof oActualContainer[sMethodName] === "function",
                "Exposes method " + sMethodName
            );
        });

        // 2.
        // arrange
        oCachedContainer = {};
        oFixture = {
            testDescription: "Returns an adapter container from the cache if one exists",
            input: {
                config: {
                    storageResourceRoot: "path/to/storage/resource/location/",
                    relativeUrlReadOptimized: "foo/~cbtoken~",
                    relativeUrlWriteOptimized: "writeFast"
                },
                containersCache: Object.create(null, {
                    "resource-root/u/container-key.json": {
                        value: oCachedContainer
                    }
                }),
                storageResourceRoot: "resource-root",
                containerKey: "container-key",
                scope: null,
                appName: "application-name",
                oHttpClient: oHttpClientStub
            }
        };
        // act
        oActualContainer = oAdapterInternals.getAdapterContainer(
            oFixture.input.config,
            oFixture.input.containersCache,
            oFixture.input.oHttpClient,
            oFixture.input.storageResourceRoot,
            oFixture.input.containerKey,
            oFixture.input.scope,
            oFixture.input.appName
        );
        // assert
        assert.deepEqual(
            oActualContainer,
            oCachedContainer,
            oFixture.testDescription
        );
    });

    QUnit.module("Container/internals");
    QUnit.test(".getStorageResourceRoot", function (assert) {
        // -- Test proper usage
        var sExpectedStorageResourceRoot = "/path/to/resource/root";
        var sActualStorageResourceRoot = oAdapterInternals
            .getStorageResourceRoot({
                storageResourceRoot: sExpectedStorageResourceRoot
            });

        assert.strictEqual(
            sActualStorageResourceRoot,
            sExpectedStorageResourceRoot,
            "Reads the storage resource root from the passed configuration."
        );

        // -- Test improper usage
        [
            {
                input: {
                    /* invalid <undefined> config */
                }
            },
            {
                input: {
                    config: null /* invalid <null> config */
                }
            },
            {
                input: {
                    config: "" /* invalid <string> config */
                }
            },
            {
                input: {
                    config: 123 /* invalid <number> config */
                }
            },
            {
                input: {
                    config: {} /* invalid <empty> config */
                }
            }
        ].forEach(function (oFixture) {
            assert.throws(
                function () {
                    oAdapterInternals.getStorageResourceRoot(oFixture.input.config);
                },
                /storage resource root is not defined/,
                "Throws when type of config is " + typeof oFixture.input.config
            );
        });
    });
    // -- getContainerPath
    [
        {
            testDescription: "when `oScope` is null and `sContainerKey` contains a URL reserved character, it returns " +
                "a write-optimized container path and encodes any reserved characters",
            input: {
                config: {
                    relativeUrlWriteOptimized: "writeFast"
                    // Note: storageResourceRoot & relativeUrlReadOptimized are not needed
                },
                scope: null,
                containerKey: "+k#e$y&?"
            },
            expectedContainerPath: "writeFast/%2Bk%23e%24y%26%3F.json"
        },
        {
            testDescription: "when `oScope` is defined with a FIXED_KEY, LOW write frequency and " +
                "clientStorageAllowed=true, and `sContainerKey` contains a URL reserved character, it returns a " +
                "read-optimized container path  and encodes any reserved characters",
            input: {
                config: {
                    relativeUrlReadOptimized: "readFast/~cbtoken~"
                    // Note: storageResourceRoot & relativeUrlWriteOptimized are not needed
                },
                scope: {
                    keyCategory: oStorageConstants.keyCategory.FIXED_KEY,
                    writeFrequency: oStorageConstants.writeFrequency.LOW,
                    clientStorageAllowed: true
                },
                containerKey: "+k#e$y&?"
            },
            expectedContainerPath: "readFast/~cbtoken~/%2Bk%23e%24y%26%3F.json"
        }
    ].forEach(function (oFixture) {
        QUnit.test(".getContainerPath - " + oFixture.testDescription, function (assert) {
            var sActualContainerPath = oAdapterInternals.getContainerPath(
                oFixture.input.config,
                oFixture.input.scope,
                oFixture.input.containerKey,
                oFixture.input.storageResourceRoot
            );

            assert.strictEqual(
                sActualContainerPath,
                oFixture.expectedContainerPath,
                "expected container URL created"
            );
        });
    });
    // -- trimContainerKey
    [
        {
            testDescription: "container key is prefixed with standard container prefix",
            input: {
                containerKey: oInternalPersonalizationConstants.S_CONTAINER_PREFIX + "key"
            },
            expectedContainerKey: "key"
        },
        {
            testDescription: "container key is prefixed with standard container prefix but excceeds maximum length",
            input: {
                containerKey: oInternalPersonalizationConstants.S_CONTAINER_PREFIX + "key-with-more-than-40-characters--------TAIL-IS-STRIPPED"
            },
            expectedContainerKey: "key-with-more-than-40-characters--------",
            expectedErrorMessage: [
                "Invalid personalization container key: 'key-with-more-than-40-characters--------TAIL-IS-STRIPPED'"
                + " exceeds maximum key length (40 characters) and is shortened to 'key-with-more-than-40-characters--------'",
                undefined,
                "sap.ushell.adapters.cdm.PersonalizationAdapter"
            ]
        },
        {
            testDescription: "container key is NOT prefixed with standard container prefix",
            input: {
                containerKey: "key-without-prefix"
            },
            expectedContainerKey: "key-without-prefix",
            expectedErrorMessage: [
                "Unexpected personalization container key: key-without-prefix",
                "should always be prefixed with " + oInternalPersonalizationConstants.S_CONTAINER_PREFIX,
                "sap.ushell.adapters.cdm.PersonalizationAdapter"
            ]
        }
    ].forEach(function (oFixture) {
        QUnit.test("trimContainerKey is correct when " + oFixture.testDescription, function (assert) {
            var sActualContainerKey,
                oLogMock = oTestUtils.createLogMock();

            if (oFixture.expectedErrorMessage) {
                oLogMock.error.apply(oLogMock, oFixture.expectedErrorMessage);
            }

            sActualContainerKey = oAdapterInternals.trimContainerKey(oFixture.input.containerKey);

            assert.strictEqual(
                sActualContainerKey,
                oFixture.expectedContainerKey,
                "expected container key created"
            );

            oLogMock.verify();
        });
    });
    // -- trimContainerKey error handling
    [
        {
            testDescription: "container key is undefined",
            input: {
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("trimContainerKey throws correct error when " + oFixture.testDescription, function (assert) {

            assert.throws(
                function () {
                    oAdapterInternals.trimContainerKey(oFixture.input.containerKey);
                },
                /Personalization container key must be a non-empty string/,
                "expected error thrown"
            );
        });
    });
    QUnit.test(".createContainerData", function (assert) {
        var oFixture,
            oActualContainerData,
            oLogMock;

        // 1. Logs warning when called with missing app name
        [
            {
                testDescription: "Throws when app name is null",
                input: {
                    appName: null,
                    scope: null
                }
            },
            {
                testDescription: "Throws when app name is undefined",
                input: {
                    scope: null
                }
            },
            {
                testDescription: "Throws when app name is a number",
                input: {
                    appName: 123,
                    scope: null
                }
            },
            {
                testDescription: "Throws when app name is an object",
                input: {
                    appName: {},
                    scope: null
                }
            },
            {
                testDescription: "Throws when app name is a function",
                input: {
                    appName: function () { /* empty function */ },
                    scope: null
                }
            },
            {
                testDescription: "Throws when app name and container keys are invalid",
                input: {
                    appName: null,
                    scope: null
                }
            }
        ].forEach(function (oFixture) {
            oLogMock = oTestUtils.createLogMock();
            oLogMock.warning("Personalization container has an invalid app name; must be a non-empty string", null, "sap.ushell.adapters.cdm.PersonalizationAdapter");

            // act
            oAdapterInternals.createContainerData(
                oFixture.input.scope,
                oFixture.input.appName
            );

            oLogMock.verify();
        });

        // 2. App name can be an empty string
        // arrange
        oFixture = {
            testDescription: "Empty app name is a valid parameter",
            input: {
                scope: null,
                appName: ""
            }
        };
        // act
        oActualContainerData = oAdapterInternals.createContainerData(
            oFixture.input.scope,
            oFixture.input.appName
        );
        // assert
        assert.ok(oActualContainerData, oFixture.testDescription);

        // 3. Constructs container data
        // arrange
        oFixture = {
            testDescription: "Constructs container data and returns it",
            input: {
                scope: null,
                appName: "app-name"
            },
            expected: Object.create(null, {
                items: {
                    value: Object.create(null), enumerable: true
                },
                __metadata: {
                    value: Object.create(null, {
                        appName: { value: "app-name", enumerable: true },
                        expiry: {
                            value: Infinity,
                            enumerable: true
                        },
                        validity: { value: Infinity, enumerable: true },
                        category: { value: "u", enumerable: true }
                    })
                    , enumerable: true
                }
            })
        };
        // act
        oActualContainerData = oAdapterInternals.createContainerData(
            oFixture.input.scope,
            oFixture.input.appName
        );
        // assert
        assert.deepEqual(
            oActualContainerData,
            oFixture.expected,
            oFixture.testDescription
        );
        assert.deepEqual(
            Object.keys(oActualContainerData.__metadata),
            ["appName", "expiry", "validity", "category"],
            "__metadata contains attributes 'appName', 'expiry', 'validity' and 'category'"
        );
    });
    // -- getContainerCategory
    [
        {
            testDescription: "clientStorageAllowed is false, keyCategory is GENERATED_KEY, writeFrequency is HIGH",
            input: {
                scope: {
                    clientStorageAllowed: false,
                    keyCategory: oStorageConstants.keyCategory.GENERATED_KEY,
                    writeFrequency: oStorageConstants.writeFrequency.HIGH // not taken into consideration
                }
            },
            expected: "u"
        },
        {
            testDescription: "clientStorageAllowed is false, keyCategory is GENERATED_KEY writeFrequency is LOW",
            input: {
                scope: {
                    clientStorageAllowed: false,
                    keyCategory: oStorageConstants.keyCategory.GENERATED_KEY,
                    writeFrequency: oStorageConstants.writeFrequency.LOW // not taken into consideration
                }
            },
            expected: "u"
        },
        {
            testDescription: "clientStorageAllowed is false, keyCategory is FIXED_KEY, writeFrequency is HIGH",
            input: {
                scope: {
                    clientStorageAllowed: false,
                    keyCategory: oStorageConstants.keyCategory.FIXED_KEY,
                    writeFrequency: oStorageConstants.writeFrequency.HIGH
                }
            },
            expected: "u"
        },
        {
            testDescription: "clientStorageAllowed is false, keyCategory is FIXED_KEY, writeFrequency is LOW",
            input: {
                scope: {
                    clientStorageAllowed: false,
                    keyCategory: oStorageConstants.keyCategory.FIXED_KEY,
                    writeFrequency: oStorageConstants.writeFrequency.LOW
                }
            },
            expected: "u"
        },
        {
            testDescription: "clientStorageAllowed is true, keyCategory is GENERATED_KEY, writeFrequency is HIGH",
            input: {
                scope: {
                    clientStorageAllowed: true,
                    keyCategory: oStorageConstants.keyCategory.GENERATED_KEY,
                    writeFrequency: oStorageConstants.writeFrequency.HIGH // not taken into consideration
                }
            },
            expected: "u"
        },
        {
            testDescription: "clientStorageAllowed is true, keyCategory is GENERATED_KEY writeFrequency is LOW",
            input: {
                scope: {
                    clientStorageAllowed: true,
                    keyCategory: oStorageConstants.keyCategory.GENERATED_KEY,
                    writeFrequency: oStorageConstants.writeFrequency.LOW // not taken into consideration
                }
            },
            expected: "u"
        },
        {
            testDescription: "clientStorageAllowed is true, keyCategory is FIXED_KEY, writeFrequency is HIGH",
            input: {
                scope: {
                    clientStorageAllowed: true,
                    keyCategory: oStorageConstants.keyCategory.FIXED_KEY,
                    writeFrequency: oStorageConstants.writeFrequency.HIGH
                }
            },
            expected: "u"
        },
        {
            testDescription: "clientStorageAllowed is true, keyCategory is FIXED_KEY, writeFrequency is LOW",
            input: {
                scope: {
                    clientStorageAllowed: true,
                    keyCategory: oStorageConstants.keyCategory.FIXED_KEY,
                    writeFrequency: oStorageConstants.writeFrequency.LOW
                }
            },
            expected: "p"
        }
    ].forEach(function (oFixture) {
        QUnit.test(".getContainerCategory is correct when " + oFixture.testDescription, function (assert) {
            var sContainerCategory;
            // act
            sContainerCategory = oAdapterInternals.getContainerCategory(oFixture.input.scope);
            // assert
            assert.equal(
                sContainerCategory,
                oFixture.expected,
                "Returns the correct result when in scope param " + oFixture.testDescription
            );
        });
    });

    QUnit.module("AdapterContainer");
    // TODO: rework test! Does not verify the container after saving!
    [
        {
            testDescription: "when succeeds with 2xx",
            input: {
                containerData: {
                    foo: "write"
                },
                url: "/path/to/container/resource",
                response: {
                    success: true,
                    statusCode: 200,
                    responseText: '{ "__metadata": { "validity": 2, "created": "2017-07-13T08:51:28.475Z" }, "foo": "bar" }'
                }
            },
            expected: {
                toSucceed: true,
                container: {
                    __metadata: {
                        validity: 2,
                        created: "2017-07-13T08:51:28.475Z"
                    },
                    foo: "bar"
                }
            }
        },
        {
            testDescription: "when fails with 5xx",
            input: {
                containerData: {
                    foo: "bar"
                },
                url: "/path/to/container/resource",
                response: {
                    success: false,
                    statusCode: 500,
                    responseText: 'Something went wrong'
                }
            },
            expected: {
                toSucceed: false
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("#save " + oFixture.testDescription, function (assert) {
            // arrange
            var done = assert.async(),
                sOriginalInputContainerData = jQuery.extend({}, oFixture.input.containerData, true);

            createHttpClientStub({
                put: oFixture.input.response
            });

            // act
            oAdapterInternals
                .save(oHttpClientStub, sOriginalInputContainerData, oFixture.input.url)
                .then(afterSaving.bind(this, true), afterSaving.bind(this, false));

            function afterSaving(bSuccess, oContainer) {
                // assert
                assert.strictEqual(
                    oHttpClientStub.put.callCount,
                    1,
                    "Calls httpClient.put exactly once"
                );

                assert.deepEqual(
                    oHttpClientStub.put.args[0],
                    [oFixture.input.url, { data: sOriginalInputContainerData }],
                    "Calls httpClient.put with expected arguments"
                );

                assert.strictEqual(bSuccess, oFixture.expected.toSucceed, "Promise was resolved/rejected as expected");

                done();
            }
        });
    });
    [
        {
            testDescription: "when succeeds with 2xx and non-empty response text",
            input: {
                oContainerData: {
                    items: {
                        foo: "bar",
                        lasting: "item",
                        outdated: "trash"
                    },
                    __metadata: {
                        appName: "app.name",
                        expiry: Date.now() + 10 * 60 * 1000, // in 10 minutes
                        validity: 10,
                        category: "p"
                    }
                },
                sPath: "/path/to/container/resource",
                oHttpClientResponse: {
                    success: true,
                    status: 200,
                    responseText: JSON.stringify({
                        __metadata: {
                            appName: "app.name",
                            expiry: Date.now() + 20 * 60 * 1000, // in 2 minutes
                            validity: 2,
                            category: "p"
                        },
                        items: {
                            fooz: "barz",
                            lasting: "item"
                        }
                    })
                }
            },
            expected: {
                promiseResolved: true,
                containerData: {
                    __metadata: {
                        appName: "app.name",
                        expiry: Date.now() + 20 * 60 * 1000, // in 2 minutes
                        validity: 2,
                        category: "p"
                    },
                    items: {
                        fooz: "barz",
                        lasting: "item"
                    }
                }
            }
        },
        {
            testDescription: "when succeeds with 200, content-length 0 and content-type text/plain",
            // feature: enable cachebusting for empty server containers on all browsers
            input: {
                oContainerData: {
                    items: {
                        foo: "bar",
                        lasting: "item",
                        outdated: "trash"
                    },
                    __metadata: {
                        appName: "app.name",
                        expiry: Date.now() + 10 * 60 * 1000, // in 10 minutes
                        validity: 10,
                        category: "p"
                    }
                },
                sPath: "/path/to/container/resource",
                oHttpClientResponse: {
                    success: true,
                    status: 200,
                    responseText: "",
                    responseHeaders: [
                        {
                            "name": "content-length",
                            "value": "0"
                        }, {
                            "name": "content-type",
                            "value": "text/plain"
                        }
                    ]
                }
            },
            expected: {
                promiseResolved: true,
                containerData: {
                    items: {}, // items are deleted!
                    __metadata: {
                        appName: "app.name",
                        expiry: Date.now() + 10 * 60 * 1000, // in 10 minutes
                        validity: 10,
                        category: "p"
                    }
                }
            }
        },
        {
            testDescription: "when fails with 404",
            input: {
                oContainerData: {
                    items: {
                        foo: "bar",
                        lasting: "item",
                        outdated: "trash"
                    },
                    __metadata: {
                        appName: "app.name",
                        expiry: Date.now() + 10 * 60 * 1000, // in 10 minutes
                        validity: 10,
                        category: "p"
                    }
                },
                sPath: "/path/to/container/resource",
                oHttpClientResponse: {
                    success: false,
                    status: 404,
                    responseText: 'Not found'
                }
            },
            expected: {
                promiseResolved: true,
                containerData: {
                    items: {},
                    __metadata: {
                        appName: "app.name",
                        expiry: Date.now() + 10 * 60 * 1000, // in 10 minutes
                        validity: 10,
                        category: "p"
                    }
                }
            }
        },
        {
            testDescription: "when fails with 5xx",
            input: {
                oContainerData: {
                    items: {
                        foo: "bar",
                        lasting: "item",
                        outdated: "trash"
                    },
                    __metadata: {
                        appName: "app.name",
                        expiry: Date.now() + 10 * 60 * 1000, // in 10 minutes
                        validity: 10,
                        category: "p"
                    }
                },
                sPath: "/path/to/container/resource",
                oHttpClientResponse: {
                    success: false,
                    status: 500,
                    responseText: 'Internal server error'
                }
            },
            expected: {
                promiseResolved: false,
                containerData: {
                    items: {},
                    __metadata: {
                        appName: "app.name",
                        expiry: Date.now() + 10 * 60 * 1000, // in 10 minutes
                        validity: 10,
                        category: "p"
                    }
                }
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("#load " + oFixture.testDescription, function (assert) {
            // arrange
            var done = assert.async();

            createHttpClientStub({
                get: oFixture.input.oHttpClientResponse
            });

            // act
            oAdapterInternals
                .load(oHttpClientStub, oFixture.input.oContainerData, oFixture.input.sPath)
                .then(afterLoading.bind(this, true), afterLoading.bind(this, false))
                .then(done, done);

            function afterLoading(bSuccess) {
                // assert
                assert.strictEqual(
                    oHttpClientStub.get.callCount,
                    1,
                    "Calls httpClient.get exactly once"
                );

                assert.deepEqual(
                    oHttpClientStub.get.args[0],
                    [oFixture.input.sPath],
                    "Calls httpClient.get with expected arguments"
                );

                assert.deepEqual(
                    oFixture.input.oContainerData,
                    oFixture.expected.containerData,
                    "Updates inputted container data accordingly"
                );

                assert.strictEqual(bSuccess, oFixture.expected.promiseResolved, "Promise was resolved/rejected as expected");
            }
        });
    });
    [
        {
            testDescription: "when succeeds with 2xx",
            input: {
                url: "/path/to/container/resource",
                response: {
                    success: true,
                    status: 204
                }
            },
            expected: {
                toSucceed: true
            }
        },
        {
            testDescription: "when fails with 5xx",
            input: {
                url: "/path/to/container/resource",
                response: {
                    success: false,
                    status: 500
                }
            },
            expected: {
                toSucceed: false
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("#del " + oFixture.testDescription, function (assert) {
            // arrange
            var done = assert.async();

            createHttpClientStub({
                delete: oFixture.input.response
            });

            // act
            oAdapterInternals
                .del(oHttpClientStub, oFixture.input.url)
                .then(afterDeleting.bind(this, true), afterDeleting.bind(this, false));

            function afterDeleting(bSuccess, oContainer) {
                // assert
                assert.strictEqual(
                    oHttpClientStub.delete.callCount,
                    1,
                    "Calls httpClient.delete exactly once"
                );

                assert.deepEqual(
                    oHttpClientStub.delete.args[0],
                    [oFixture.input.url],
                    "Calls httpClient.delete with expected arguments"
                );

                assert.strictEqual(bSuccess, oFixture.expected.toSucceed, "Promise was resolved/rejected as expected");

                done();
            }
        });
    });
    QUnit.test("#clearContainerData", function (assert) {
        var oFixture = {
            input: {
                oContainerDataItems: {
                    "item-1": {},
                    "item-2": {}
                }
            },
            expected: {
                oContainerDataItems: {}
            }
        };

        oAdapterInternals.clearContainerData(oFixture.input.oContainerDataItems);

        assert.deepEqual(
            oFixture.input.oContainerData,
            oFixture.expected.oContainerData,
            "Clears items of the container if any"
        );
    });

    QUnit.test("#getItemKeys", function (assert) {
        var oFixture = {
            input: {
                oContainerData: {
                    "__metadata": {},
                    "item-1": {},
                    "item-2": {},
                    // ...
                    "item-n": {},
                    // prefixed item should be doube prefixed
                    "ITEM#item-with-prefix": {},
                    // preserve prefix for variant sets and admin keys (for now, maybe we move these to separate sections)
                    "VARIANTSET#item": {},
                    "ADMIN#item": {}
                }
            },
            expected: {
                itemKeys: ["item-1", "item-2", "item-n", "ITEM#item-with-prefix"].map(function (sItemKey) {
                    return oInternalPersonalizationConstants.S_ITEM_PREFIX + sItemKey;
                }).concat(["VARIANTSET#item", "ADMIN#item"])
            }
        };

        assert.deepEqual(
            oAdapterInternals.getItemKeys(oFixture.input.oContainerData),
            oFixture.expected.itemKeys,
            "Returns a list of the keys of the given item map which are prefixed with the item key prefix"
        );
    });

    [
        {
            testDescription: "Returns `true` when the an item associated with the given key exists in the container",
            input: {
                key: "ITEM#item-x",
                oContainerData: {
                    "__metadata": {},
                    "item-1": {},
                    "item-x": {},
                    // ...
                    "item-n": {},
                    // prefixed item should be doube prefixed
                    "ITEM#item-with-prefix": {},
                    // preserve prefix for variant sets and admin keys (for now, maybe we move these to separate sections)
                    "VARIANTSET#item": {},
                    "ADMIN#item": {}
                }
            },
            expected: true
        },
        {
            testDescription: "Returns `false` when the an item associated with the given key does NOT exist in the container",
            input: {
                key: "ITEM#item-x",
                oContainerData: {
                    "item-1": {},
                    "item-2": {},
                    // ...
                    // other items
                    // ...
                    "item-n-1": {},
                    "item-n": {}
                }
            },
            expected: false
        },
        {
            testDescription: "Returns `true` when the an item associated with the given key exists in the container, although the item value may be falsy",
            input: {
                key: "ITEM#item-x",
                oContainerData: {
                    "item-1": {},
                    "item-2": {},
                    // ...
                    "item-x": null,
                    // ...
                    "item-n-1": {},
                    "item-n": {}
                }
            },
            expected: true
        }
    ].forEach(function (oFixture) {
        QUnit.test("#containsItem", function (assert) {
            assert.strictEqual(
                oAdapterInternals.containsItem(oFixture.input.oContainerData, oFixture.input.key),
                oFixture.expected,
                oFixture.testDescription
            );
        });
    });
    [
        {
            testDescription: "Sets the item if it does not exist",
            input: {
                key: "ITEM#item-x",
                value: {},
                oContainerData: {
                    "item-1": {},
                    "item-2": {},
                    // ...
                    // other items
                    // ...
                    "item-n-1": {},
                    "item-n": {}
                }
            },
            expectedContainerData: {
                "item-1": {},
                "item-2": {},
                // ...
                "item-x": {},
                // ...
                "item-n-1": {},
                "item-n": {}
            }
        },
        {
            testDescription: "Overwrites the item value if it exists",
            input: {
                key: "ITEM#item-x",
                value: null,
                oContainerData: {
                    "item-1": {},
                    "item-2": {},
                    // ...
                    "item-x": {},
                    // ...
                    "item-n-1": {},
                    "item-n": {}
                }
            },
            expectedContainerData: {
                "item-1": {},
                "item-2": {},
                // ...
                "item-x": null,
                // ...
                "item-n-1": {},
                "item-n": {}
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("setItemValue:  " + oFixture.testDescription, function (assert) {
            var oContainerData = jQuery.extend({}, oFixture.input.oContainerData, true);
            oAdapterInternals.setItemValue(
                oContainerData,
                oFixture.input.key,
                oFixture.input.value
            );

            assert.deepEqual(
                oContainerData,
                oFixture.expectedContainerData
            );
        });
    });
    [
        {
            testDescription: "Returns `undefined` when the item does not exist",
            input: {
                key: "ITEM#item-x",
                oContainerData: {
                    "item-1": {},
                    "item-2": {},
                    // ...
                    // other items
                    // ...
                    "item-n-1": {},
                    "item-n": {}
                }
            },
            expected: {
                value: undefined
            }
        },
        {
            testDescription: "Returns the item value if it exists",
            input: {
                key: "ITEM#item-x",
                oContainerData: {
                    "item-1": {},
                    "item-2": {},
                    // ...
                    "item-x": {},
                    // ...
                    "item-n-1": {},
                    "item-n": {}
                }
            },
            expected: {
                value: {}
            }
        },
        {
            testDescription: "Returns the item value if it exists, and even if it is falsy",
            input: {
                key: "ITEM#item-x",
                oContainerData: {
                    "item-1": {},
                    "item-2": {},
                    // ...
                    "item-x": null,
                    // ...
                    "item-n-1": {},
                    "item-n": {}
                }
            },
            expected: {
                value: null
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("getItemValue: " + oFixture.testDescription, function (assert) {
            var vActualValue = oAdapterInternals.getItemValue(
                oFixture.input.oContainerData,
                oFixture.input.key
            );

            assert.deepEqual(
                vActualValue,
                oFixture.expected.value,
                oFixture.testDescription
            );
        });
    });
    [
        {
            testDescription: "no-op when the item to be deleted does not exist",
            input: {
                key: "ITEM#item-x",
                oContainerData: {
                    "item-1": {},
                    "item-2": {},
                    // ...
                    // other items
                    // ...
                    "item-n-1": {},
                    "item-n": {}
                }
            },
            expectedContainerData: {
                "item-1": {},
                "item-2": {},
                // ...
                // other items
                // ...
                "item-n-1": {},
                "item-n": {}
            }
        },
        {
            testDescription: "deletes the item when the item to be deleted exists",
            input: {
                key: "ITEM#item-x",
                oContainerData: {
                    "item-1": {},
                    "item-2": {},
                    // ...
                    "item-x": {},
                    // ...
                    "item-n-1": {},
                    "item-n": {}
                }
            },
            expectedContainerData: {
                "item-1": {},
                "item-2": {},
                // ...
                // ...
                "item-n-1": {},
                "item-n": {}
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("delItem: " + oFixture.testDescription, function (assert) {
            var oContainerData = jQuery.extend({}, oFixture.input.oContainerData, true);

            oAdapterInternals.delItem(
                oContainerData,
                oFixture.input.key
            );

            assert.deepEqual(
                oContainerData,
                oFixture.expectedContainerData
            );
        });
    });

    [
        {
            description: "header item is in the header array",
            input: {
                aHeaders: [
                    {
                        "name": "x-sap-lrep-time",
                        "value": "34ms"
                    }, {
                        "name": "expires",
                        "value": "Wed, 19 Dec 2018 08"
                    }, {
                        "name": "cache-control",
                        "value": "max-age=31536000, private"
                    }, {
                        "name": "x-csrf-token",
                        "value": "MBXUhKZuSSJzV73bSjt3SQ=="
                    }, {
                        "name": "etag",
                        "value": "\"98858D1F374710A720C8213DE2181B815610BD76\""
                    }, {
                        "name": "content-length",
                        "value": "932"
                    }, {
                        "name": "content-type",
                        "value": "application/json"
                    }
                ],
                sHeaderName: "content-length"
            },
            expected: {
                headerValue: "932"
            }
        },
        {
            description: "header item is in the header array with different letter case",
            // Official header names are with uppercase first letter e.g. Content-Type.
            // https://www.iana.org/assignments/message-headers/message-headers.xml#perm-headers
            // ABAP server send all lowercase header names.
            // Values are all lowercase. https://tools.ietf.org/html/rfc2045
            input: {
                aHeaders: [
                    {
                        "name": "Content-Length",
                        "value": "932"
                    }, {
                        "name": "Content-Type",
                        "value": "application/json"
                    }
                ],
                sHeaderName: "content-length"
            },
            expected: {
                headerValue: "932"
            }
        },
        {
            description: "header item is twice in the header arrray",
            input: {
                aHeaders: [
                    {
                        "name": "cache-control",
                        "value": "max-age=31536000, private"
                    }, {
                        "name": "content-length",
                        "value": "2"
                    }, {
                        "name": "content-type",
                        "value": "application/json"
                    },
                    {
                        "name": "content-length",
                        "value": "932"
                    }
                ],
                sHeaderName: "content-length"
            },
            expected: {
                headerValue: "2"
            }
        },
        {
            description: "header item is not in the header arrray",
            input: {
                aHeaders: [
                    {
                        "name": "x-sap-lrep-time",
                        "value": "34ms"
                    }, {
                        "name": "expires",
                        "value": "Wed, 19 Dec 2018 08"
                    }, {
                        "name": "cache-control",
                        "value": "max-age=31536000, private"
                    }, {
                        "name": "x-csrf-token",
                        "value": "MBXUhKZuSSJzV73bSjt3SQ=="
                    }, {
                        "name": "etag",
                        "value": "\"98858D1F374710A720C8213DE2181B815610BD76\""
                    }, {
                        "name": "content-length",
                        "value": "932"
                    }, {
                        "name": "content-type",
                        "value": "application/json"
                    }
                ],
                sHeaderName: "hurz"
            },
            expected: {
                headerValue: undefined
            }
        },
        {
            description: "header item name is undefined",
            input: {
                aHeaders: [
                    {
                        "name": "x-sap-lrep-time",
                        "value": "34ms"
                    }, {
                        "name": "expires",
                        "value": "Wed, 19 Dec 2018 08"
                    }, {
                        "name": "cache-control",
                        "value": "max-age=31536000, private"
                    }, {
                        "name": "x-csrf-token",
                        "value": "MBXUhKZuSSJzV73bSjt3SQ=="
                    }, {
                        "name": "etag",
                        "value": "\"98858D1F374710A720C8213DE2181B815610BD76\""
                    }, {
                        "name": "content-length",
                        "value": "932"
                    }, {
                        "name": "content-type",
                        "value": "application/json"
                    }
                ],
                sHeaderName: undefined
            },
            expected: {
                headerValue: undefined
            }
        },
        {
            description: "header array is empty",
            input: {
                aHeaders: [],
                sHeaderName: "content-length"
            },
            expected: {
                headerValue: undefined
            }
        },
        {
            description: "header array is undefined",
            input: {
                aHeaders: undefined,
                sHeaderName: "content-length"
            },
            expected: {
                headerValue: undefined
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("#getHttpHeaderValue: " + oFixture.description, function (assert) {
            var sHeaderValueAct;

            // Act
            sHeaderValueAct = oAdapterInternals.getHttpHeaderValue(oFixture.input.aHeaders, oFixture.input.sHeaderName);

            // Assert
            assert.equal(
                sHeaderValueAct,
                oFixture.expected.headerValue,
                "extracts the correct header value"
            );
        });
    });

    // TODO: add tests for addPrefixToItemKey, stripPrefixFromItemKey

    clock.restore();
});
