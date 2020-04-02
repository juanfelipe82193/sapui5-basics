// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.ContentExtension
 */
sap.ui.require([
    "sap/ushell/services/ContentExtension",
    "sap/ushell/test/utils"
], function (ContentExtension, oTestUtils) {
    "use strict";
    /* eslint-disable */ // TBD: make ESLint conform

    /* global QUnit, sinon, start, stop */

    var S_COMPONENT_NAME = "sap.ushell.services.ContentExtension";

    jQuery.sap.require("sap.ushell.services.Container");

    QUnit.module("sap.ushell.services.ContentExtension", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(start);
        },
        teardown: function () {
            oTestUtils.restoreSpies(
                jQuery.sap.log.error,
                jQuery.sap.log.debug,
                sap.ushell.Container.getService
            )

            delete sap.ushell.Container;
        }
    });

    [
        {
            testDescription: "null parameters given",
            oParams: null,
            expectedError: "parameters must be provided and must be a non-empty object"
        },
        {
            testDescription: "no parameters given",
            oParams: undefined,
            expectedError: "parameters must be provided and must be a non-empty object"
        },
        {
            testDescription: "empty object provided",
            oParams: {},
            expectedError: "parameters must be provided and must be a non-empty object"
        },
        {
            testDescription: "id is a number",
            oParams: {
                id: 1234
            },
            expectedError: "id parameter should be a non-empty string"
        },
        {
            testDescription: "id is null",
            oParams: {
                id: null
            },
            expectedError: "id parameter should be a non-empty string"
        },
        {
            testDescription: "id is an empty string",
            oParams: {
                id: ""
            },
            expectedError: "id parameter should be a non-empty string"
        },
        {
            testDescription: "type is unknown",
            oParams: {
                id: "some-provider",
                provider: {},
                type: "somethingUnknown"
            },
            expectedError: "Unknown type parameter. It should be one should be one of [ContentExtension.SITE] but 'somethingUnknown' was provided"
        },
        {
            testDescription: "type is null",
            oParams: {
                id: "some-provider",
                provider: {},
                type: null
            },
            expectedError: "Unknown type parameter. It should be one should be one of [ContentExtension.SITE] but 'null' was provided"
        },
        {
            testDescription: "type is undefined",
            oParams: {
                id: "some-provider",
                provider: {}
                // undefined type
            },
            expectedError: "Unknown type parameter. It should be one should be one of [ContentExtension.SITE] but 'undefined' was provided"
        },
        {
            testDescription: "null provider given for SITE type",
            oParams: {
                id: "some-provider",
                type: ContentExtension.Type.SITE,
                provider: null // note
            },
            expectedError: "provider member must be of type 'object' and not null"
        },
        {
            testDescription: "type is SITE and getSite is not a function",
            oParams: {
                id: "some-provider",
                type: ContentExtension.Type.SITE,
                provider: {
                    getSite: {}  // note
                }
            },
            expectedError: "Provider must expose a getSite member of type 'function', got 'object' instead"
        }
    ].forEach(function (oFixture) {
        QUnit.test("#registerContentProvider logs the expected error when " + oFixture.testDescription, function (assert) {
            sinon.stub(sap.ushell.Container, "getService").throws(
                "getService should not be called in this test");
            sinon.stub(jQuery.sap.log, "error");

            ContentExtension.prototype.registerContentProvider.call(null, oFixture.oParams);

            assert.strictEqual(jQuery.sap.log.error.callCount, 1,
                "jQuery.sap.log.error was called 1 time");

            assert.deepEqual(jQuery.sap.log.error.getCall(0).args, [
                "An error occurred when calling #registerContentProvider",
                oFixture.expectedError,
                S_COMPONENT_NAME
            ]);
        });
    });

    QUnit.test("#registerContentProvider logs a debug message when called with the right site type", function (assert) {
        sinon.stub(sap.ushell.Container, "getService").returns({
            registerContentProvider: sinon.stub()
        });

        sinon.stub(jQuery.sap.log, "error");
        sinon.stub(jQuery.sap.log, "debug");

        ContentExtension.prototype.registerContentProvider.call(null, {
            id: "SomeContentProvider",
            type: ContentExtension.Type.SITE,
            provider: {
                getSite: function () {}
            }
        });

        assert.strictEqual(jQuery.sap.log.error.callCount, 0,
            "jQuery.sap.log.error was not called");
        assert.strictEqual(jQuery.sap.log.debug.callCount, 0,
            "jQuery.sap.log.debug was not called");
    });

    QUnit.test("#registerContentProvider: calls CommonDataModel#registerContentProvider when 'site' provider is given", function (assert) {
        var oGetServiceStub,
            oFakeProvider,
            oRegisterContentProviderStub = sinon.stub();

        oGetServiceStub = sinon.stub(sap.ushell.Container, "getService");
        oGetServiceStub.withArgs("CommonDataModel").returns({
            // fake CommonDataModel service that supports content providers
            registerContentProvider: oRegisterContentProviderStub
        });
        oGetServiceStub.throws(
            "sap.ushell.Container.getService was not called with the service expected by this test"
        );

        sinon.stub(jQuery.sap.log, "error");
        sinon.stub(jQuery.sap.log, "debug");

        oFakeProvider = {
            getSite: function () {}
        };

        ContentExtension.prototype.registerContentProvider.call(null, {
            id: "SomeContentProvider",
            type: ContentExtension.Type.SITE,
            provider: oFakeProvider
        });

        assert.strictEqual(oRegisterContentProviderStub.callCount, 1,
            "CommonDataModel#registerContentProvider was called one time");

        assert.deepEqual(oRegisterContentProviderStub.getCall(0).args, [
            "SomeContentProvider", oFakeProvider
        ], "CommonDataModel#registerContentProvider was called with the expected arguments");
    });

    QUnit.test("#registerContentProvider: reports errors when getService fails", function (assert) {
        var oGetServiceStub;

        oGetServiceStub = sinon.stub(sap.ushell.Container, "getService");
        oGetServiceStub.throws(
            "getService could not make it"
        );

        sinon.stub(jQuery.sap.log, "error");
        sinon.stub(jQuery.sap.log, "debug");

        ContentExtension.prototype.registerContentProvider.call(null, {
            id: "SomeContentProvider",
            type: ContentExtension.Type.SITE,
            provider: {
                getSite: function () {}
            }
        });

        assert.strictEqual(jQuery.sap.log.error.callCount, 1,
            "jQuery.sap.log.error was called once");
        assert.deepEqual(jQuery.sap.log.error.getCall(0).args, [
            "An error occurred when calling #registerContentProvider",
            "getService could not make it",
            S_COMPONENT_NAME
        ], "jQuery.sap.log.error was called with the expected arguments");
    });
 });
