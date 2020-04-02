// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap/ushell/bootstrap/sandbox.js
 */
sap.ui.require([
    "sap/ushell/test/utils",
    "sap/ushell/utils"
], function (testUtils, utils) {
    "use strict";
    /*global asyncTest, deepEqual, equal, jQuery, module, ok, sap, start, stop, test, throws, sinon, strictEqual */

    jQuery.sap.require("sap.ushell.adapters.local.NavTargetResolutionAdapter");
    jQuery.sap.require("sap.ushell.services.Container");

    var oService,
        oNavTargetResolutionAdapterConfig = {
            "config": {
                "applications": {
                    "Foo-bar": {
                        "_comment": "Commenting the world famous foobar application!",
                        "additionalInformation": "SAPUI5.Component=sap.foo.bar.FooBarApplication",
                        "applicationType": "URL",
                        "url": "/foo/bar/application",
                        "description": "The world famous foobar application!",
                        "text": "Foo-bar title",
                        "fullWidth": true
                    },
                    "Foo-bar2": {
                        "_comment": "Commenting why the sequel is better than the original.",
                        "additionalInformation": "SAPUI5.Component=sap.foo.bar.FooBar2Application",
                        "applicationType": "URL",
                        "url": "/foo/bar2/application",
                        "description": "Second edition of the world famous foobar application!",
                        "text": "Foo-bar2 title",
                        "fullWidth": true
                    }
                }
            }
        };

    /*
     * Create clone object
     */
    function createClone(oObjectToClone) {
        return jQuery.extend(true, {}, oObjectToClone);
    }

    module("sap.ushell.adapters.local.NavTargetResolutionAdapter - config tests", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(start);
        },
        teardown: function () {
            delete sap.ushell.Container;
            oService = undefined;
        }
    });

    [
        {
            "configDescription": "undefined",
            "config": undefined
        },
        {
            "configDescription": "[]",
            "config": []
        }
    ].forEach(function (oFixture) {
        asyncTest("config = " + oFixture.configDescription, function () {
            // Purpose: Test if odd configurations will lead to some error.
            // As the constructor is empty we use both methods to test for those errors.
            var oService;
            oService = new sap.ushell.adapters.local.NavTargetResolutionAdapter(undefined, undefined, /*config = */oFixture.config);
            oService.resolveHashFragment("#Foo-bar")
                .fail(function () {
                    ok(true, "resolveHashFragment threw no exception");
                });
            oService.getSemanticObjectLinks("Foo")
                .done(function (aSemanticObjectLinks) {
                    start();
                    ok(aSemanticObjectLinks.length === 0, "getSemanticObjectLinks returned an empty array");
                });
        });
    });


    module("sap.ushell.adapters.local.NavTargetResolutionAdapter", {
        setup: function () {
            stop();
            oService = new sap.ushell.adapters.local.NavTargetResolutionAdapter(undefined, undefined, createClone(oNavTargetResolutionAdapterConfig));
            sap.ushell.bootstrap("local").then(start);
        },
        teardown: function () {
            oService = undefined;
            delete sap.ushell.Container;
        }
    });

    test("resolveHashFragment: invalid hash", function () {
        throws(oService.resolveHashFragment.bind(undefined, "invalid-hash"),
                utils.Error("Hash fragment expected",
                "sap.ushell.renderers.minimal.Shell"), "expected exception was thrown");
    });

    [
        {
            sIntent: "#Foo-bar",
            expectedResult: {
                url: oNavTargetResolutionAdapterConfig.config.applications["Foo-bar"].url,
                applicationType: oNavTargetResolutionAdapterConfig.config.applications["Foo-bar"].applicationType,
                additionalInformation: oNavTargetResolutionAdapterConfig.config.applications["Foo-bar"].additionalInformation,
                text: oNavTargetResolutionAdapterConfig.config.applications["Foo-bar"].text,
                fullWidth: oNavTargetResolutionAdapterConfig.config.applications["Foo-bar"].fullWidth
            }
        },
        {
            sIntent: "#Action-search",
            expectedResult: {
                additionalInformation: "SAPUI5.Component=sap.ushell.renderers.fiori2.search.container",
                applicationType: "SAPUI5",
                fullWidth: undefined,
                text: undefined,
                url: "../../../../../../sap/ushell/renderers/fiori2/search/container"
            }
        }
    ].forEach(function (oFixture) {
        asyncTest("resolveHashFragment: resolves '" + oFixture.sIntent + "'", function () {

            oService.resolveHashFragment(oFixture.sIntent)
                .done(function (oResult) {
                    deepEqual(oResult, oFixture.expectedResult, "resolved to the expected result");
                })
                .fail(function (oResult) {
                    ok(false, "failed to resolve");
                })
                .always(function () {
                    start();
                });
        });
    });

    asyncTest("resolveHashFragment: resolve '#'", function () {

        oService.resolveHashFragment("#")
            .done(function (oResult) {
                deepEqual(oResult, undefined, "'#' correctly resolved");
            })
            .fail(function (oResult) {
                ok(false, "failed to resolve");
            })
            .always(function () {
                start();
            });
    });

    asyncTest("resolveHashFragment: resolve '#unknown-hash'", function () {

        oService.resolveHashFragment("#unknown-hash")
            .done(function (oResult) {
                ok(false, "should not be able to resolve");
            })
            .fail(function (oResult) {

                equal(oResult, "Could not resolve link 'unknown-hash'", "resolve rejected as expected");
            })
            .always(function () {
                    start();
                });
    });

    asyncTest("resolveHashFragment: resolve with parameter '#Foo-bar?param1=value1&param2=value2'", function () {
        var oClone = createClone(oNavTargetResolutionAdapterConfig).config.applications["Foo-bar"],
            oExpected = {
                additionalInformation : oClone.additionalInformation,
                url : oClone.url + "?param1=value1&param2=value2",
                applicationType : oClone.applicationType,
                text: oClone.text,
                fullWidth: oClone.fullWidth
            };
        oService.resolveHashFragment("#Foo-bar?param1=value1&param2=value2")
            .done(function (oResult) {
                deepEqual(oResult, oExpected, "correctly resolved and parameter treated as expected");
            })
            .fail(function (oResult) {
                ok(false, "should not be able to resolve");
            })
            .always(function () {
                start();
            });
    });

    [
        "",
        "Foo",
        "Muh"
    ].forEach(function (sFixture) {
        asyncTest("getSemanticObjectLinks: resolves '" + sFixture + "'", function () {
            var sSemanticObject,
                oApplications,
                oExpectedLink,
                aExpectedLinks,
                sIntent;
            // Arrange
            sSemanticObject = sFixture;
            aExpectedLinks = [];
            oApplications = oNavTargetResolutionAdapterConfig.config.applications;
            for (sIntent in oApplications) {
                if (oApplications.hasOwnProperty(sIntent) && sIntent.substring(0, sIntent.indexOf('-')) === sSemanticObject) {
                    oExpectedLink = createClone(oApplications[sIntent]);
                    oExpectedLink.id = sIntent;
                    oExpectedLink.intent = "#" + sIntent;
                    aExpectedLinks.push(oExpectedLink);
                }
            }
            // Act
            oService.getSemanticObjectLinks(sSemanticObject)
                .done(function (aResult) {
                    // Assert
                    deepEqual(aResult, aExpectedLinks, "Resolves the semantic object to the expected array");
                })
                .fail(function (sError) {
                 // Assert
                    ok(false, "Resolves the semantic object");
                })
                .always(function () {
                    start();
                });
        });
    });


    [
        { description : "empty", So : "Foo", params : { "A" : ["B1", "B2"] }, result : [ {"intent" : "#Foo-bar?A=B1&A=B2"} ]}
    ].forEach(function (oFixture) {
        asyncTest("getSemanticObjectLinks: resolves '" + oFixture.description + "' with parameters", function () {
            var sSemanticObject;

            // Arrange
            sSemanticObject = oFixture.So;

            // Act
            oService.getSemanticObjectLinks(sSemanticObject, oFixture.params)
                .done(function (aResult) {
                    // Assert
                    deepEqual(aResult[0].intent, oFixture.result[0].intent, "intent is proper");
                })
                .fail(function (sError) {
                 // Assert
                    ok(false, "Resolves the semantic object");
                })
                .always(function () {
                    start();
                });
        });
    });

    asyncTest("isIntentSupported: success", function () {
        var oAdapter,
            aDeferreds = [],
            mExpectedResult = {},
            aIntents = ["#fo'o-b ar", "#AccessControlRole", "#foo", "#bar"],
            bResolved = false;

        oAdapter = new sap.ushell.adapters.local.NavTargetResolutionAdapter();
        sinon.stub(oAdapter, "resolveHashFragment", function (sHashFragment) {
            var oDeferred = new jQuery.Deferred();
            aDeferreds.push(oDeferred);
            return oDeferred.promise();
        });

        // code under test
        oAdapter.isIntentSupported(aIntents).fail(testUtils.onError)
            .done(function (mSupportedByIntent) {
                start();
                bResolved = true;
                deepEqual(mSupportedByIntent, mExpectedResult, " expected result");
                deepEqual(Object.keys(mSupportedByIntent), aIntents, "keys ok");
            });

        strictEqual(oAdapter.resolveHashFragment.callCount, aIntents.length);
        aIntents.forEach(function (sIntent, i) {
            var bSupported = (i % 2) === 1;

            ok(oAdapter.resolveHashFragment.calledWith(sIntent), "resolved: " + sIntent);
            mExpectedResult[sIntent] = {supported: bSupported};
            if (bSupported) {
                aDeferreds[i].resolve({/*don't care*/});
            } else {
                aDeferreds[i].reject("don't care");
            }
        });
        strictEqual(bResolved, true, "isIntentSupported's promise now resolved");
    });

    asyncTest("isIntentSupported: when resolveHashFragment promises are not resolved", function () {

        var oAdapter,
            mExpectedResult = {},
            aDeferreds = [],
            aIntents = ["#fo'o-b ar", "#AccessControlRole", "#foo", "#bar"],
            bResolved = false;

        oAdapter = new sap.ushell.adapters.local.NavTargetResolutionAdapter();
        sinon.stub(oAdapter, "resolveHashFragment", function (sHashFragment) {
            var oDeferred = new jQuery.Deferred();
            aDeferreds.push(oDeferred);
            return oDeferred.promise();
        });
        // code under test
        oAdapter.isIntentSupported(aIntents).fail(testUtils.onError)
            .done(function (mSupportedByIntent) {
                start();
                bResolved = true;
                deepEqual(mSupportedByIntent, mExpectedResult, "Expected result");
                deepEqual(Object.keys(mSupportedByIntent), aIntents, "keys and intents");
            });
        strictEqual(oAdapter.resolveHashFragment.callCount, aIntents.length, "call count ok");
        aIntents.forEach(function (sIntent, i) {
            ok(oAdapter.resolveHashFragment.calledWith(sIntent), "resolved: " + sIntent);
        });
        strictEqual(bResolved, false, "isIntentSupported's promise will not get resolved");

        aIntents.forEach(function (sIntent, i) {
            var bSupported = (i % 2) === 1;

            ok(oAdapter.resolveHashFragment.calledWith(sIntent), "resolved: " + sIntent);
            mExpectedResult[sIntent] = {supported: bSupported};
            if (bSupported) {
                aDeferreds[i].resolve({/*don't care*/});
            } else {
                aDeferreds[i].reject("don't care");
            }
        });
        strictEqual(bResolved, true, "isIntentSupported's promise got resolved");
    });

    asyncTest("isIntentSupported: failure", function () {
        var oAdapter,
            aIntents = ["#foo", "#bar"];

        oAdapter = new sap.ushell.adapters.local.NavTargetResolutionAdapter();
        sinon.stub(oAdapter, "resolveHashFragment", function (sHashFragment) {
            return (new jQuery.Deferred()).reject().promise();
        });

        // code under test
        oAdapter.isIntentSupported(aIntents).done(function(oRes) {
            start();
            deepEqual(oRes, { "#foo" : { "supported" : false}, "#bar" : { "supported" : false} }, " ok");
        });
    });

    asyncTest("isIntentSupported: single intent", function () {
        var oAdapter,
            oDeferred = new jQuery.Deferred(),
            mExpectedResult = {},
            sIntent = "#foo",
            bResolved = false;

        oAdapter = new sap.ushell.adapters.local.NavTargetResolutionAdapter();
        sinon.stub(oAdapter, "resolveHashFragment", function (sHashFragment) {
            return oDeferred.promise();
        });

        // code under test
        oAdapter.isIntentSupported([sIntent]).fail(testUtils.onError)
            .done(function (mSupportedByIntent) {
                start();
                bResolved = true;
                deepEqual(Object.keys(mSupportedByIntent), [sIntent]);
                deepEqual(mSupportedByIntent, mExpectedResult);
            });

        strictEqual(bResolved, false, "isIntentSupported's promise not yet resolved");
        strictEqual(oAdapter.resolveHashFragment.callCount, 1);
        ok(oAdapter.resolveHashFragment.calledWith(sIntent), "resolved: " + sIntent);
        mExpectedResult[sIntent] = {supported: true};
        oDeferred.resolve({/*don't care*/});
        strictEqual(bResolved, true, "isIntentSupported's promise now resolved");
    });

    asyncTest("isIntentSupported: zero intents ([])", function () {
        var oAdapter = new sap.ushell.adapters.local.NavTargetResolutionAdapter();

        sinon.stub(oAdapter, "resolveHashFragment", testUtils.onError);

        // code under test
        oAdapter.isIntentSupported([]).fail(testUtils.onError)
            .done(function (mSupportedByIntent) {
                start();
                deepEqual(mSupportedByIntent, {});
            });
    });

});
