// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.ClientSideTargetResolution
 */

sap.ui.require([
    "sap/ushell/services/ClientSideTargetResolution",
    "sap/ushell/services/_ClientSideTargetResolution/InboundIndex",
    "sap/ushell/services/_ClientSideTargetResolution/InboundProvider",
    "sap/ushell/services/_ClientSideTargetResolution/VirtualInbounds",
    "sap/ushell/services/_ClientSideTargetResolution/Search",
    "sap/ushell/services/_ClientSideTargetResolution/Utils",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/test/utils",
    "sap/ushell/utils",
    "sap/ushell/services/URLParsing",
    "sap/ui/thirdparty/URI",
    "sap/base/util/ObjectPath",
    "sap/ushell/TechnicalParameters",
    "sap/ushell/test/services/_ClientSideTargetResolution/ClientSideTargetResolution.resolveHashFragment",
    "sap/ushell/test/services/_ClientSideTargetResolution/TestHelper"
], function (
    ClientSideTargetResolution,
    oInboundIndex,
    InboundProvider,
    VirtualInbounds,
    oSearch,
    oCSTRUtils,
    oAppConfiguration,
    testUtils,
    utils,
    URLParsing,
    URI,
    ObjectPath,
    TechnicalParameters,
    fnExecuteResolveHashFragment,
    oTestHelper
) {

    "use strict";
    /* global QUnit, module, test, ok, equal, deepEqual, strictEqual, sinon, asyncTest, start */

    var oURLParsing = new URLParsing();
    var mkInt = function (sIntent) {
        return oURLParsing.parseShellHash(sIntent);
    };

    jQuery.sap.require("sap.ushell.services.Container");

    /*eslint max-nested-callbacks: [1, 4]*/

    // lookup of all count parameters
    var O_COUNT_PARAMETERS = {
            "countDefaultedParams": true,
            "countFreeInboundParams": true,
            "countMatchingFilterParams": true,
            "countMatchingParams": true,
            "countMatchingRequiredParams": true,
            "countPotentiallyMatchingParams": true
        },
        I_DEBUG = jQuery.sap.log.Level.DEBUG,
        I_TRACE = jQuery.sap.log.Level.TRACE;


    /*
     * Checks whether the expected warnings and errors were logged on the
     * console, taking the expectations from the given test fixture, which
     * should be defined as follows:
     *
     * {
     *
     *   ... rest of the fixture...
     *
     *   expectedWarningCalls: [
     *      [   // arguments of the first call
     *          "1stArg",
     *          "2ndArg",
     *          "3rdArg"
     *      ],
     *      ... more items if more calls are expected
     *   ],
     *   expectedErrorCalls: []  // 0 calls to jQuery.sap.log.error expected
     * }
     *
     * NOTE:
     * - If the given fixture does not specify the 'expectedWarningCalls' and
     *   'expectedErrorCalls' keys, no test will be executed.
     * - jQuery.sap.log.error and jQuery.sap.log.warning should have been
     *   already stubbed before this function is called.
     */
    function testExpectedErrorAndWarningCalls (oFixture) {

        if (oFixture.hasOwnProperty("expectedErrorCalls")) {
            var aExpectedErrorCalls = (oFixture.expectedErrorCalls || []);

            strictEqual(
                jQuery.sap.log.error.callCount,
                aExpectedErrorCalls.length,
                "jQuery.sap.log.error was called the expected number of times"
            );

            if (aExpectedErrorCalls.length > 0) {
                deepEqual(
                    jQuery.sap.log.error.args,
                    aExpectedErrorCalls,
                    "jQuery.sap.log.error logged the expected errors"
                );
            }
        }

        if (oFixture.hasOwnProperty("expectedWarningCalls")) {
            var aExpectedWarningCalls = (oFixture.expectedWarningCalls || []);

            strictEqual(
                jQuery.sap.log.warning.callCount,
                aExpectedWarningCalls.length,
                "jQuery.sap.log.warning was called the expected number of times"
            );

            if (aExpectedWarningCalls.length > 0) {
                deepEqual(
                    jQuery.sap.log.warning.args,
                    aExpectedWarningCalls,
                    "jQuery.sap.log.warning logged the expected warnings"
                );
            }
        }
    }

    /*
     * Removes the count* parameters from each match result (output of
     * getMatchingInbounds) and the priority string.
     *
     * Returns the filtered result (that may contain shallow copies of
     * objects/arrays).
     */
    function removeCountsAndSortString (vMatchResults) {
        var bIsObject = jQuery.isPlainObject(vMatchResults);
        var aMatchResults = bIsObject ? [vMatchResults] : vMatchResults,
            aMutatedMatchResults = aMatchResults.map(function (oMatchResult) {

            return JSON.parse(JSON.stringify(oMatchResult, function (sKey, vVal) {

                return O_COUNT_PARAMETERS.hasOwnProperty(sKey) || sKey === "priorityString" ? undefined : vVal;
            }));
        });

        return bIsObject ? aMutatedMatchResults[0] : aMutatedMatchResults;
    }

    /*
     * A factory to create a test ClientSideTargetResolution service with
     * inbounds and configuration as needed.
     *
     * Can be called like:
     * createService();  // no inbounds, mocked adapter, undefined configuration
     * createService({
     *   inbounds: [ ... ] // arbitrary inbounds
     * });
     * createService({
     *   adapter: { ... } // arbitrary fake adapter
     * });
     * createService({
     *   configuration: { ... } // arbitrary service configuration
     * });
     */
    function createService (oArgs) {
        var oConfiguration = (oArgs || {}).configuration;
        var aInbounds = (oArgs || {}).inbounds || [];
        var oAdapter = (oArgs || {}).adapter;

        if (!oAdapter) {
            // create fake adapter
            oAdapter = {
                getInbounds: sinon.stub().returns(
                    new jQuery.Deferred().resolve(aInbounds).promise()
                )
            };
        }

        var oUshellConfig = testUtils.overrideObject({}, {
            "/services/ClientSideTargetResolution": oConfiguration
        });

        testUtils.resetConfigChannel(oUshellConfig);

        return new ClientSideTargetResolution(
            oAdapter,
            null,
            null,
            oConfiguration
        );
    }

    /*
     * Tests that _getMatchingInbounds was called with the expected
     * bExcludeTileInbounds argument if called at all.
     */
    function testExcludeTileIntentArgument (oCstrService, bExpectedExcludeTileInbounds) {
        var iCalledTimes = oCstrService._getMatchingInbounds.callCount;

        if (iCalledTimes > 0) {
            // getLinks may return preventively in some cases... but if
            // it's called we need to check these:

            strictEqual(iCalledTimes, 1, "_getMatchingInbounds was called 1 time");
            strictEqual(oCstrService._getMatchingInbounds.getCall(0).args.length, 3, "_getMatchingInbounds was called with three arguments");
            deepEqual(
                oCstrService._getMatchingInbounds.getCall(0).args[2],
                { bExcludeTileInbounds: bExpectedExcludeTileInbounds },
                "_getMatchingInbounds was called with a 'true' third argument (bExcludeTileInbounds)"
            );
        }
    }



    module("sap.ushell.services.ClientSideTargetResolution", {
        setup: function () {
            return sap.ushell.bootstrap("local").then(function () {

                // assume there is no open application in tests
                oAppConfiguration.setCurrentApplication(null);
            });
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            testUtils.restoreSpies(
                oCSTRUtils.isDebugEnabled,
                oSearch.match,
                oSearch.matchOne,
                oAppConfiguration.getCurrentApplication,
                utils.Error,
                utils.getFormFactor,
                utils.getLocalStorage,
                sap.ushell.Container.getService,
                sap.ushell.Container.getUser,
                sap.ui.getCore,
                jQuery.sap.getObject,
                jQuery.sap.log.warning,
                jQuery.sap.log.error,
                jQuery.sap.log.debug,
                jQuery.sap.log.getLevel,
                InboundProvider.prototype.getInbounds,
                VirtualInbounds.isVirtualInbound
            );
            delete sap.ushell.Container;
        }
    });

    test("getServiceClientSideTargetResolution: returns something different than undefined", function () {
        var oClientSideTargetResolution = sap.ushell.Container.getService("ClientSideTargetResolution");
        ok(oClientSideTargetResolution !== undefined);
    });

    test("getServiceClientSideTargetResolution: returns something different than undefined", function () {
        var oClientSideTargetResolution = sap.ushell.Container.getService("ClientSideTargetResolution");
        ok(oClientSideTargetResolution !== undefined);
    });

    [
        /*
         * Test for _extractInboundFilter
         */
        {
            testDescription: "natural result",
            input: "ABC-def?SO=AA",
            result: [
               {
                   semanticObject: "ABC",
                   action: "def"
               }
            ]
        },
        {
            testDescription: "flawed input",
            input: "Customer-processReceivablesCollectionSegment=EUR_TOOL&Customer=C0001&IsHeadOfficeView=true#Shell-home",
            result: undefined
        },
        {
            testDescription: "natural result no segmented access",
            noSegment: true,
            input: "ABC-defo?SO=AA",
            result: undefined
        }
    ].forEach(function (oFixture) {
        test("_extractInboundFilter when " + oFixture.testDescription, function () {
            var aRes,
                oSrvc,
                oFakeAdapter;

            if (oFixture.noSegment) {
                oFakeAdapter = null;
            } else {
                oFakeAdapter = {
                    getInbounds: function () {},
                    hasSegmentedAccess: true
                };
            }

            oSrvc = createService({
                adapter: oFakeAdapter
            });

            aRes = oSrvc._extractInboundFilter(oFixture.input);
            deepEqual(aRes, oFixture.result, "correct result");
        });
    });



    // test the parameter sap-ui-tech-hint=WDA|UI5|GUI which, given
    // an otherwise identical targetmapping, selects the one which has the given technology.

    var iInb = {
        semanticObject: "SO",
        action: "action",
        signature: {
            parameters: {}
        },
        resolutionResult: {}
    };

    var iInbDefault = {
        semanticObject: "SO",
        action: "action",
        signature: {
            parameters: { "sap-ui-tech-hint": { defaultValue: { value: "XXX" }}}
        },
        resolutionResult: {}
    };

    var iInbDefaultOtherPar = {
        semanticObject: "SO",
        action: "action",
        signature: {
            parameters: {
                "sap-ui-tech-hint": { defaultValue: { value: "XXX" }},
                "demo2": { defaultValue: { value: "XXX" }}
            }
        },
        resolutionResult: {}
    };

    function addTech (oObj, sTech) {
        var copy = jQuery.extend(true, {}, oObj);
        copy.resolutionResult["sap.ui"] = {};
        copy.resolutionResult["sap.ui"].technology = sTech;
        return copy;
    }

    [
         {
             testDescription: "all else equal, tech hint is used WDA->WDA",
             aInbounds: ["GUI", "WDA", "UI5", undefined].map(function (el) {
                 return addTech(iInb, el);
             }),
             sIntent: "SO-action?sap-ui-tech-hint=WDA",
             expectedResultTech: "WDA"
         },
         {
             testDescription: "all else equal, no tech hint, 'best technology' UI5->WDA->GUI",
             aInbounds: ["GUI", "UI5", "WDA", undefined].map(function (el) { return addTech(iInb, el); }),
             sIntent: "SO-action",
             expectedResultTech: "UI5"
         },
         {
             testDescription: "all else equal, no tech hint, 'best technology' UI5->WDA->GUI , UI5 not present",
             aInbounds: ["GUI", "WDA", undefined].map(function (el) { return addTech(iInb, el); }),
             sIntent: "SO-action",
             expectedResultTech: "WDA"
         },
         {
             testDescription: "all else equal, no tech hint, 'best technology' UI5->WDA->GUI , default on WDA Intent",
             aInbounds: [addTech(iInbDefault, "WDA")].concat(["GUI", "UI5", undefined].map(function (el) { return addTech(iInb, el); })),
             sIntent: "SO-action?sap-ui-tech-hint=GUI",
             expectedResultTech: "GUI"
         },
         {
             testDescription: "all else equal, no tech hint, 'best technology' UI5->WDA->GUI , DefaultInOther",
             aInbounds: [addTech(iInbDefaultOtherPar, "WDA")].concat(["GUI", "WDA", undefined].map(function (el) { return addTech(iInb, el); })),
             sIntent: "SO-action?sap-ui-tech-hint=GUI",
             expectedResultTech: "GUI"
         },
         {
             testDescription: "all else equal, no tech hint, 'best technology' UI5->WDA->GUI , DefaultInOther no hint",
             aInbounds: [addTech(iInbDefaultOtherPar, "WDA")].concat(["GUI", "WDA", undefined].map(function (el) { return addTech(iInb, el); })),
             sIntent: "SO-action",
             expectedResultTech: "WDA"
         }
    ].forEach(function (oFixture) {
        asyncTest("matchingTarget sap-ui-tech-hint " + oFixture.testDescription, function () {
         var oSrvc = createService();
         var oShellHash = mkInt("#" + oFixture.sIntent);
         oShellHash.formFactor = "desktop";

         var oIndex = oInboundIndex.createIndex(oFixture.aInbounds);

         oSrvc._getMatchingInbounds(oShellHash, oIndex)
             .done(function (oMatchingTargets) {
                 if (oFixture.expectedResultTech) {
                     equal(oMatchingTargets[0].inbound.resolutionResult["sap.ui"].technology, oFixture.expectedResultTech, "correct result technology");
                 }
             })
             .fail(function (sError) {
                 ok(false, "promise was rejected");
             })
             .always(function () {
                 start();
            });
        });
    });


    [
        /*
         * _getMatchingInbounds: checks match results are sorted as expected"
         */
        {
            testDescription: "one inbound matches",
            aFakeMatchResults: [
                // NOTE: not actual Inbound structure. We only use 'matches' and num
                // is random, used only for report purposes.
                { num: 36, matches: true, inbound: { resolutionResult: { applicationType: "Something" }}}
            ],
            expectedInbounds: [0] // zero-based index in aFakeInbounds
        },
        {
            testDescription: "no inbound matches",
            aFakeMatchResults: [
            ],
            expectedInbounds: []
        },
        {
            testDescription: "multiple inbound match, longer names win",
            aFakeMatchResults: [
                // NOTE: applicationType determines the order here
                { num: 33, matches: true, inbound: { resolutionResult: { applicationType: "Something" }}},
                { num: 36, matches: true, inbound: { resolutionResult: { applicationType: "SomethingExt" }}}
            ],
            expectedInbounds: [1, 0]
        },
        {
            testDescription: "multiple inbound match, reverse alphabetical order in tie-breaker",
            aFakeMatchResults: [
                // NOTE: applicationType determines the order here
                { num: 33, matches: true, inbound: { resolutionResult: { applicationType: "A" }}},
                { num: 36, matches: true, inbound: { resolutionResult: { applicationType: "B" }}}
            ],
            expectedInbounds: [1, 0] // -> B then A
        },
        {
            testDescription: "priority is specified",
            aFakeMatchResults: [
                { num: 18, matches: true, priorityString: "B", inbound: { resolutionResult: {} } },
                { num: 31, matches: true, priorityString: "CD", inbound: { resolutionResult: {} } },
                { num: 33, matches: true, priorityString: "CZ", inbound: { resolutionResult: {} } },
                { num: 41, matches: true, priorityString: "A", inbound: { resolutionResult: {} } },
                { num: 44, matches: true, priorityString: "C", inbound: { resolutionResult: {} } },
                { num: 46, matches: true, priorityString: "CE", inbound: { resolutionResult: {} } }
            ],
            expectedInbounds: [2, 5, 1, 4, 0, 3]
        },
        {
            testDescription: "priority is specified",
            aFakeMatchResults: [
                { num: 44, matches: true, priorityString: "C", inbound: { resolutionResult: {} } },
                { num: 31, matches: true, priorityString: "CD", inbound: { resolutionResult: {} } },
                { num: 41, matches: true, priorityString: "A", inbound: { resolutionResult: {} } },
                { num: 46, matches: true, priorityString: "CE", inbound: { resolutionResult: {} } },
                { num: 18, matches: true, priorityString: "B", inbound: { resolutionResult: {} } },
                { num: 33, matches: true, priorityString: "CZ", inbound: { resolutionResult: {} } }
            ],
            expectedInbounds: [5, 3, 1, 0, 4, 2]
        },
        {
            testDescription: "priority is with numbers",
            aFakeMatchResults: [
                { num: 44, matches: true, priorityString: "101", inbound: { resolutionResult: {} } },
                { num: 31, matches: true, priorityString: "000", inbound: { resolutionResult: {} } },
                { num: 41, matches: true, priorityString: "120", inbound: { resolutionResult: {} } },
                { num: 46, matches: true, priorityString: "999", inbound: { resolutionResult: {} } },
                { num: 18, matches: true, priorityString: "010", inbound: { resolutionResult: {} } },
                { num: 33, matches: true, priorityString: "001", inbound: { resolutionResult: {} } }
            ],
            expectedInbounds: [3, 2, 0, 4, 5, 1]
        },
        {
            testDescription: "realistic sort strings sorted with expected priority",
            aFakeMatchResults: [
                { num: 33, matches: true, priorityString: "x MTCH=003 MREQ=003 NFIL=002 NDEF=001 POT=004 RFRE=999", inbound: { resolutionResult: {} } },
                { num: 18, matches: true, priorityString: "x MTCH=003 MREQ=003 NFIL=002 NDEF=001 POT=100 RFRE=999", inbound: { resolutionResult: {} } }
            ],
            expectedInbounds: [1, 0]
        }

    ].forEach(function (oFixture) {
        asyncTest("_getMatchingInbounds: matching inbounds are returned in priority when " + oFixture.testDescription, function () {
            // Return fake adapter with inbounds in the fixture
            var oSrvc = createService(),
                aExpectedMatchingTargets = oFixture.expectedInbounds.map(function (iIdx) {
                    return oFixture.aFakeMatchResults[iIdx];
                });

            var oIndex = {
                // values don't matter for this test (match is stubbed anyway)
                getSegment: sinon.stub().returns([]),
                getAllInbounds: sinon.stub().returns([])
            };

            sinon.stub(oSearch, "match").returns(Promise.resolve({
                matchResults: oFixture.aFakeMatchResults,
                missingReferences: {}
            }));

            // Act
            oSrvc._getMatchingInbounds({} /* any parameter ok for the test*/, oIndex).done(function (aMatchingInbounds) {
                // Assert
                strictEqual(Object.prototype.toString.call(aMatchingInbounds), "[object Array]", "an array was returned");

                deepEqual(aMatchingInbounds, aExpectedMatchingTargets,
                    "inbounds that matched were returned in the promise");

            }).fail(function () {
                ok(false, "promise was resolved");

            }).always(function () {
                start();
            });

        });
    });

    [
        /*
         * General tests for _getMatchingInbounds
         *
         * testDescription: {string}:
         *   describes the test case (not what the test should do!).
         *
         * oParsedShellHash: {object}:
         *   the parsed intent
         *
         * aInbounds: {object}
         *   inbounds to match against
         *
         * mockedUserDefaultValues: {object}
         *   any mocked known user default value
         *
         * expected: {object[]} or {number[]}
         *  - when {object[]}:
         *     array of *matching results*. This is checked 1:1
         *     with deepEqual.
         *
         *  - when {number[]}:
         *     array of 0-based indices into aInbounds. In this case the
         *     test will deepEqual only the "inbound" entry in the
         *     matching result object.
         *
         * NOTE: this test does not check for the sort string or count
         *       parameters. Use test for sort string instead.
         */
        {
            testDescription: "generic semantic object specified in intent",
            oParsedShellHash: {
                "semanticObject": undefined,
                "action": "action",
                "params": {
                    "currency": ["EUR"]
                }
            },
            aInbounds: [
                {
                    semanticObject: "ObjectA",
                    action: "action",
                    signature: { parameters: {
                        currency: { required: true, filter: { value: "EUR" } }
                    }},
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.ComponentA", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                },
                {
                    semanticObject: "ObjectB",
                    action: "action",
                    signature: { parameters: {
                        currency: { required: true, filter: { value: "EUR" } },
                        user: { required: false, defaultValue: { value: "TEST" } }
                    }},
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.ComponentB", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [1, 0]
        },
        {
            testDescription: "generic action specified in intent",
            oParsedShellHash: {
                "semanticObject": "Object",
                "action": undefined,
                "params": {
                    "currency": ["EUR"]
                }
            },
            aInbounds: [
                {
                    semanticObject: "Object",
                    action: "actionA",
                    signature: { parameters: {
                        currency: { required: true, filter: { value: "EUR" } }
                    }},
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.ComponentA", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                },
                {
                    semanticObject: "Object",
                    action: "actionB",
                    signature: { parameters: {
                        currency: { required: true, filter: { value: "EUR" } },
                        user: { required: false, defaultValue: { value: "TEST" } }
                    }},
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.ComponentB", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [1, 0]
        },
        {
            testDescription: "* specified in intent semantic object",
            oParsedShellHash: {
                "semanticObject": "*", // treated as a literal "*"
                "action": undefined,
                "params": {
                    "currency": ["EUR"]
                }
            },
            aInbounds: [
                {
                    semanticObject: "*",
                    action: "action",
                    signature: { parameters: {
                        currency: { required: true, filter: { value: "EUR" } }
                    }},
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.ComponentA", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                },
                {
                    semanticObject: "Object",
                    action: "action",
                    signature: { parameters: {
                        currency: { required: true, filter: { value: "EUR" } },
                        user: { required: false, defaultValue: { value: "TEST" } }
                    }},
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.ComponentB", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [0]
        },
        {
            testDescription: "* specified in intent action",
            oParsedShellHash: {
                "semanticObject": undefined,
                "action": "*",
                "params": {
                    "currency": ["EUR"]
                }
            },
            aInbounds: [
                {
                    semanticObject: "Object",
                    action: "action",
                    signature: { parameters: {
                        currency: { required: true, filter: { value: "EUR" } }
                    }},
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.ComponentA", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                },
                {
                    semanticObject: "Object",
                    action: "*",
                    signature: { parameters: {
                        currency: { required: true, filter: { value: "EUR" } },
                        user: { required: false, defaultValue: { value: "TEST" } }
                    }},
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.ComponentB", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [1]
        },
        {
            testDescription: "a filter reference is specified",
            oParsedShellHash: {
                "semanticObject": "Object",
"action": "action",
                "params": {
                    "currency": ["EUR"]
                }
            },
            aInbounds: [
                {
                    semanticObject: "Object",
action: "action",
                    signature: { parameters: {
                        currency: { required: true, filter: { format: "reference", value: "UserDefault.currency" } }
                    }},
                    title: "Currency manager",
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.Component", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                }
            ],
            mockedUserDefaultValues: { "currency": "EUR" },
            expected: [{
                "genericSO": false,
                "intentParamsPlusAllDefaults": {
                    "currency": [ "EUR" ]
                },
                "defaultedParamNames": [],
                "matches": true,
                "parsedIntent": {
                    "semanticObject": "Object",
                    "action": "action",
                    "params": {
                        "currency": ["EUR"]
                    }
                },
                "matchesVirtualInbound": false,
                "inbound": {
                    "title": "Currency manager",
                    "action": "action",
                    "semanticObject": "Object",
                    "signature": {
                        "parameters": {
                            currency: { required: true, filter: { format: "reference", value: "UserDefault.currency" } }
                        }
                    },
                    "resolutionResult": { text: "Currency manager", ui5ComponentName: "Currency.Component", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                },
                "resolutionResult": { } // title not propagated in early resolution result
            }]
        },
        {
            testDescription: "user default service provides non-matching parameter",
            oParsedShellHash: {
                "semanticObject": "Object",
"action": "action",
                "params": {
                    "currency": ["EUR"]
                }
            },
            aInbounds: [
                {
                    semanticObject: "Object",
action: "action",
                    signature: { parameters: {
                        currency: { required: true, filter: { format: "reference", value: "UserDefault.currency" } }
                    }},
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.Component", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                }
            ],
            mockedUserDefaultValues: { "currency": "GBP" }, // NOTE: GBP does not match filter
            expected: []
        },
        {
            testDescription: "user default service cannot provide a default value for filter reference",
            oParsedShellHash: {
                "semanticObject": "Object",
"action": "action",
                "params": {
                    "currency": ["EUR"]
                }
            },
            aInbounds: [
                {
                    semanticObject: "Object",
action: "action",
                    signature: { parameters: {
                        currency: { required: true, filter: { format: "reference", value: "UserDefault.currency" } }
                    }},
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.Component", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                }
            ],
            mockedUserDefaultValues: { "other": "uselessValue" },
            expected: []
        },
        {
            testDescription: "default reference value is provided by UserDefaultParameters service",
            oParsedShellHash: {
                "semanticObject": "Object",
"action": "action",
                "params": {}
            },
            aInbounds: [
                {
                    semanticObject: "Object",
action: "action",
                    signature: { parameters: {
                        currency: { required: false, defaultValue: { format: "reference", value: "UserDefault.currency" } }
                    }},
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.Component", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                }
            ],
            mockedUserDefaultValues: { "currency": "EUR" },
            expected: [{
               "genericSO": false,
               "intentParamsPlusAllDefaults": {
                   currency: ["EUR"]
               },
               "defaultedParamNames": ["currency"],
               "matches": true,
               "parsedIntent": {
                    "semanticObject": "Object",
"action": "action",
                    "params": {}
               },
               "matchesVirtualInbound": false,
               "resolutionResult": { }, // no title propagated yet in Early resolution result
               "inbound": {
                   "action": "action",
                   "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                   "semanticObject": "Object",
                   "signature": {
                       "parameters": {
                            "currency": { required: false, defaultValue: { format: "reference", value: "UserDefault.currency" } }
                       }
                   }
               }
            }]
        },
        {
            testDescription: "unknown default reference",
            oParsedShellHash: {
                "semanticObject": "Object",
"action": "action",
                "params": {} // note, no parameter given
            },
            aInbounds: [
                {
                    semanticObject: "Object",
action: "action",
                    signature: { parameters: {
                        currency: { required: false, defaultValue: { format: "reference", value: "UserDefault.currency" } }
                    }},
                    resolutionResult: { text: "Currency manager", ui5ComponentName: "Currency.Component", url: "/url/to/currency", applicationType: "URL", additionalInformation: "SAPUI5.Component=Currency.Component" }
                }
            ],
            mockedUserDefaultValues: { /* no known values */ },
            expected: [{
               "genericSO": false,
               "intentParamsPlusAllDefaults": {}, // no default parameter
               "matches": true,
               "matchesVirtualInbound": false,
               "defaultedParamNames": [],
               "resolutionResult": {}, // no title propagated yet in Early resolution result
               "parsedIntent": {
                    "semanticObject": "Object",
"action": "action",
                    "params": {}
               },
               "inbound": {
                   "action": "action",
                   "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                   "semanticObject": "Object",
                   "signature": {
                       "parameters": {
                            "currency": { required: false, defaultValue: { format: "reference", value: "UserDefault.currency" } }
                       }
                   }
               }
            }]
        },
        {
            testDescription: "a default reference and a filter reference are known",
            oParsedShellHash: {
                "semanticObject": "Currency",
"action": "app",
                "params": {}
            },
            aInbounds: [
                {
                    semanticObject: "*",
action: "app",
                    signature: { parameters: {
                        mode: {
                            required: false,
                            defaultValue: { format: "reference", value: "UserDefault.mode" },
                            filter: { format: "reference", value: "UserDefault.currencyAppMode" }
                        }
                    }},
                    resolutionResult: {
                        text: "Currency manager",
                        ui5ComponentName: "Currency.Component",
                        url: "/url/to/currency",
                        applicationType: "URL",
                        additionalInformation: "SAPUI5.Component=Currency.Component"
                    }
                },
                {
                    semanticObject: "*",
action: "app",
                    signature: { parameters: {
                        mode: {
                            required: false,
                            defaultValue: { format: "reference", value: "UserDefault.mode" },
                            filter: { format: "reference", value: "UserDefault.carsAppMode" }
                        }
                    }},
                    resolutionResult: {
                        text: "Cars manager",
                        ui5ComponentName: "Cars.Component",
                        url: "/url/to/cars",
                        applicationType: "URL",
                        additionalInformation: "SAPUI5.Component=Cars.Component"
                    }
                }
            ],
            mockedUserDefaultValues: {
                "mode": "desktop", // user specific preference
                "currencyAppMode": "desktop",
                "carsAppMode": "mobile"
            },
            expected: [{
               "genericSO": true,
               "intentParamsPlusAllDefaults": {
                   "mode": ["desktop"]
               },
               "defaultedParamNames": ["mode"],
               "matches": true,
               "matchesVirtualInbound": false,
               "resolutionResult": { },
               "parsedIntent": {
                    "semanticObject": "Currency",
"action": "app",
                    "params": {}
               },
               "inbound": {
                   "action": "app",
                   "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                   "semanticObject": "*",
                   "signature": {
                       "parameters": {
                           "mode": {
                               "required": false,
                               "defaultValue": { format: "reference", value: "UserDefault.mode" },
                               "filter": { format: "reference", value: "UserDefault.currencyAppMode" }
                           }
                       }
                   }
               }
            }]
        },
        {
            testDescription: "sap-ushell-defaultedParameterNames is specified",
            oParsedShellHash: {
                "semanticObject": "Currency",
"action": "app",
                "params": {
                   "sap-ushell-defaultedParameterNames": ["will", "be", "ignored"]
                }
            },
            aInbounds: [
                {
                    semanticObject: "Currency",
action: "app",
                    signature: {
                        parameters: {},
                        additionalParameters: "allowed"
                    },
                    resolutionResult: {
                        text: "Currency manager",
                        ui5ComponentName: "Currency.Component",
                        url: "/url/to/currency",
                        applicationType: "URL",
                        additionalInformation: "SAPUI5.Component=Currency.Component"
                    }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [{
                "defaultedParamNames": [], // NOTE: no sap- param!
                "genericSO": false,
                "intentParamsPlusAllDefaults": {},
                "matches": true,
                "matchesVirtualInbound": false,
                "resolutionResult": { },
                "parsedIntent": {
                    "action": "app",
                    "params": {
                        "sap-ushell-defaultedParameterNames": [ "will", "be", "ignored" ]
                    },
                    "semanticObject": "Currency"
                },
                "inbound": {
                  "action": "app",
                  "resolutionResult": {
                    "additionalInformation": "SAPUI5.Component=Currency.Component",
                    "applicationType": "URL",
                    "text": "Currency manager",
                    "ui5ComponentName": "Currency.Component",
                    "url": "/url/to/currency"
                  },
                  "semanticObject": "Currency",
                  "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {}
                  }
                }
            }]
        },
        {
            testDescription: "one inbound default parameter is in the intent",
            oParsedShellHash: {
                "semanticObject": "Currency",
"action": "app",
                "params": {
                   "intentParam1": ["ipv1"],
                   "overlappingParam3": ["ipv2"]
                }
            },
            aInbounds: [
                {
                    semanticObject: "Currency",
action: "app",
                    signature: {
                        parameters: {
                            "defaultParam1": { required: false, defaultValue: { value: "dv1" } },
                            "defaultParam2": { required: false, defaultValue: { value: "dv2" } },
                            "overlappingParam3": { required: false, defaultValue: { value: "dv3" } }
                        },
                        additionalParameters: "allowed"
                    },
                    resolutionResult: {
                        text: "Currency manager",
                        ui5ComponentName: "Currency.Component",
                        url: "/url/to/currency",
                        applicationType: "URL",
                        additionalInformation: "SAPUI5.Component=Currency.Component"
                    }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [{
                "defaultedParamNames": [
                  "defaultParam1",
                  "defaultParam2"
                ],
                "genericSO": false,
                "intentParamsPlusAllDefaults": {
                  "defaultParam1": [
                    "dv1"
                  ],
                  "defaultParam2": [
                    "dv2"
                  ],
                  "intentParam1": [
                    "ipv1"
                  ],
                  "overlappingParam3": [
                    "ipv2"
                  ]
                },
                "matches": true,
                "matchesVirtualInbound": false,
                "resolutionResult": { },
                "parsedIntent": {
                    "action": "app",
                    "params": {
                        "intentParam1": [
                            "ipv1"
                        ],
                        "overlappingParam3": [
                            "ipv2"
                        ]
                    },
                    "semanticObject": "Currency"
                },
                "inbound": {
                  "action": "app",
                  "resolutionResult": {
                    "additionalInformation": "SAPUI5.Component=Currency.Component",
                    "applicationType": "URL",
                    "text": "Currency manager",
                    "ui5ComponentName": "Currency.Component",
                    "url": "/url/to/currency"
                  },
                  "semanticObject": "Currency",
                  "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {
                        "defaultParam1": { required: false, defaultValue: { value: "dv1" } },
                        "defaultParam2": { required: false, defaultValue: { value: "dv2" } },
                        "overlappingParam3": { required: false, defaultValue: { value: "dv3" } }
                    }
                  }
                }
            }]
        },
        {
            /*
             * Inbounds with more defaulted parameters are a better fit
             * if nothing required had matched.
             */
            testDescription: "intent matches no filters and multiple inbounds with same SO-action are defined",
            oParsedShellHash: {
                "semanticObject": "Object",
                "action": "action",
                "params": {
                    "additionalParameter": "hello"
                }
            },
            aInbounds: [
                { // #0 : this should not match because of the filter on company code
                    semanticObject: "Object",
action: "action",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            CompanyCode: {
                                required: true,
                                filter: {
                                    format: "plain",
                                    value: "1000"
                                }
                            },
                            "sap-app-id": {
                                required: false,
                                defaultValue: {
                                    format: "plain",
                                    value: "COMPANY1000"
                                }
                            }
                        }
                    },
                    resolutionResult: { } // doesn't really matter
                },
                { // Priority: x MTCH=000 MREQ=000 NFIL=000 NDEF=001 POT=001 RFRE=999
                    semanticObject: "Object",
action: "action",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            default1: {
                                required: false,
                                defaultValue: { format: "plain", value: "1000" }
                            }
                        }
                    },
                    resolutionResult: { }
                },
                { // Priority: x MTCH=000 MREQ=000 NFIL=000 NDEF=002 POT=001 RFRE=999
                    semanticObject: "Object",
action: "action",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            default1: {
                                required: false,
                                defaultValue: { format: "plain", value: "1000" }
                            },
                            default2: { // extra default parameter -> more complex
                                required: false,
                                defaultValue: { format: "plain", value: "1000" }
                            }
                        }
                    },
                    resolutionResult: { }
                },
                { // Priority: x MTCH=000 MREQ=000 NFIL=000 NDEF=000 POT=001 RFRE=999
                    semanticObject: "Object",
action: "action",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: { }
                    }, // no signature parameters -> simple.
                    resolutionResult: { }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [2, 1, 3]
        },
        {
            /*
             * Test matching with sap-priority
             */
            testDescription: "intent matches no filters and multiple inbounds with same SO-action are defined and sap-priority",
            oParsedShellHash: {
                "semanticObject": "Object",
                "action": "action",
                "params": {
                    "additionalParameter": "hello"
                }
            },
            aInbounds: [
                { // #0 : this should not match because of the filter on company code
                    semanticObject: "Object",
action: "action",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            CompanyCode: {
                                required: true,
                                filter: {
                                    format: "plain",
                                    value: "1000"
                                }
                            },
                            "sap-app-id": {
                                required: false,
                                defaultValue: {
                                    format: "plain",
                                    value: "COMPANY1000"
                                }
                            }
                        }
                    },
                    resolutionResult: { } // doesn't really matter
                },
                { // #1 : this matches and comes before negative inbounds with negative sap-priority
                    semanticObject: "Object",
action: "action",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            default1: {
                                required: false,
                                defaultValue: { format: "plain", value: "1000" }
                            }
                        }
                    },
                    resolutionResult: { }
                },
                { // #2 : this matches and should come last, but sap-priority is specified so it comes first
                    semanticObject: "Object",
action: "action",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            default1: {
                                required: false,
                                defaultValue: { format: "plain", value: "1000" }
                            },
                            "sap-priority": {
                                defaultValue: { format: "plain", value: "50" }
                            },
                            default2: { // extra default parameter -> more complex
                                required: false,
                                defaultValue: { format: "plain", value: "1000" }
                            }
                        }
                    },
                    resolutionResult: { }
                },
                { // #3 : this comes last because of negative sap priority
                    semanticObject: "Object",
action: "action",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "sap-priority": {
                                defaultValue: { format: "plain", value: "-50" }
                            }
                        }
                    }, // no signature parameters -> simple.
                    resolutionResult: { }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [
                2, // sap-priority: 50
                1, // no sap priority
                3 // sap-priority: -50
            ]
        },
        {
            /*
             * Here we test that the most detailed inbound that suits
             * the filter is chosen among less detailed/complex ones. In this
             * case the "sap-app-id" contributes to the complexity of the
             * inbound which is then prioritized.
             */
            testDescription: "intent matches a filter and multiple inbounds with same SO-action are defined",
            oParsedShellHash: {
                "semanticObject": "Object",
                "action": "action",
                "params": {
                    "CompanyCode": ["1000"]
                }
            },
            aInbounds: [
                { // #0
                    semanticObject: "Object",
action: "action",
                    signature: {
                        parameters: {
                            CompanyCode: {
                                required: true,
                                filter: {
                                    format: "plain",
                                    value: "1000" // Company code matches this filter
                                }
                            },
                            "sap-app-id": { // higher complexity, inbound will be prioritized
                                required: false,
                                defaultValue: {
                                    format: "plain",
                                    value: "COMPANY1000"
                                }
                            }
                        }
                    },
                    resolutionResult: { } // doesn't really matter
                },
                { // #1
                    semanticObject: "Object",
action: "action",
                    signature: {
                        parameters: {
                            CompanyCode: {
                                required: true,
                                filter: {
                                    format: "plain",
                                    value: "1000" // Company code matches this filter, but this inbound is less complex to be prioritized
                                }
                            }
                        }
                    },
                    resolutionResult: { } // doesn't really matter
                },
                { // #2
                    semanticObject: "Object",
action: "action",
                    signature: {
                        parameters: {
                            CompanyCode: {
                                required: true,
                                filter: {
                                    format: "plain",
                                    value: "2000"
                                }
                            },
                            "sap-app-id": {
                                required: false,
                                defaultValue: {
                                    format: "plain",
                                    value: "COMPANY2000"
                                }
                            }
                        }
                    },
                    resolutionResult: { } // doesn't really matter
                }
            ],
            mockedUserDefaultValues: {},
            expected: [0, 1]
        },
        {
            testDescription: "required parameter in inbounds without value or defaultValue",
            oParsedShellHash: {
                "semanticObject": "Object",
"action": "action",
                "params": {
                    "currency": ["EUR"]
                }
            },
            aInbounds: [
                {
                    semanticObject: "Object",
action: "action",
                    signature: { parameters: {
                        currency: { required: true }
                    }},
                    resolutionResult: { text: "Currency manager"
                    //    ui5ComponentName: "Currency.Component",
                    //    url: "/url/to/currency",
                    //    applicationType: "URL",
                    //    additionalInformation: "SAPUI5.Component=Currency.Component"
                    }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [0]
        },
        {
            testDescription: "no additional parameters are allowed and inbound signatures indicates non-required parameter",
            oParsedShellHash: {
                "semanticObject": "Object",
"action": "action",
                "params": {} // no parameter specified
            },
            aInbounds: [
                {
                    semanticObject: "Object",
action: "action",
                    signature: {
                        parameters: {
                            flag: {} // short notation for required: false
                        },
                        additionalParameters: "notallowed"
                    },
                    resolutionResult: {
                        text: "Currency manager",
                        ui5ComponentName: "Currency.Component",
                        url: "/url/to/currency",
                        applicationType: "URL",
                        additionalInformation: "SAPUI5.Component=Currency.Component"
                    }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [{
                "defaultedParamNames": [],
                "genericSO": false,
                "intentParamsPlusAllDefaults": {},
                "matches": true,
                "matchesVirtualInbound": false,
                "resolutionResult": { },
                "parsedIntent": {
                  "action": "action",
                  "params": {},
                  "semanticObject": "Object"
                },
                "inbound": {
                    "action": "action",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager",
                        "ui5ComponentName": "Currency.Component",
                         "url": "/url/to/currency"
                    },
                    "semanticObject": "Object",
                    "signature": {
                        "additionalParameters": "notallowed",
                        "parameters": {
                            "flag": {}
                        }
                    }
                }
            }]
        },
        {
            testDescription: " defaulted parameters are mapped to same target A->ANew & B renameTo ANew, both defaulted",
            oParsedShellHash: {
                "semanticObject": "Object",
"action": "action",
                "params": { }
            },
            aInbounds: [
                {
                    semanticObject: "Object",
action: "action",
                    signature: {
                        parameters: {
                            "A": { "renameTo": "ANew", "defaultValue": { "value": "ADefaulted" } },
                            "B": { "renameTo": "ANew", "defaultValue": { "value": "BDefaulted" }
                                  }
                        },
                        additionalParameters: "allowed"
                    },
                    resolutionResult: {
                        text: "Currency manager",
                        ui5ComponentName: "Currency.Component",
                        url: "/url/to/currency",
                        applicationType: "URL",
                        additionalInformation: "SAPUI5.Component=Currency.Component"
                    }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [{
                "defaultedParamNames": [ "A", "B" ],
                "genericSO": false,
                "intentParamsPlusAllDefaults": {
                    "A": [
                          "ADefaulted"
                    ],
                    "B": [
                          "BDefaulted"
                    ]
                },
                "matches": true,
                "matchesVirtualInbound": false,
                "resolutionResult": { },
                "parsedIntent": {
                  "action": "action",
                  "params": {},
                  "semanticObject": "Object"
                },
                "inbound": {
                    "action": "action",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager",
                        "ui5ComponentName": "Currency.Component",
                         "url": "/url/to/currency"
                    },
                    "semanticObject": "Object",
                    "signature": {
                        parameters: {
                            "A": { "renameTo": "ANew", "defaultValue": { "value": "ADefaulted" } },
                            "B": { "renameTo": "ANew", "defaultValue": { "value": "BDefaulted" }
                                  }
                        },
                        additionalParameters: "allowed"
                    }
                }
            }]
        },
        {
            testDescription: " defaulted parameters are mapped to same target A->ANew & B renameTo ANew, B defaulted, A supplied",
            oParsedShellHash: {
                "semanticObject": "Object",
"action": "action",
                "params": { "A": [ "Avalue"] }
            },
            aInbounds: [
                {
                    semanticObject: "Object",
action: "action",
                    signature: {
                        parameters: {
                            "A": { "renameTo": "ANew"},
                            "B": { "renameTo": "ANew",
                                    "defaultValue": { "value": "BDefaulted" }
                                  }
                        },
                        additionalParameters: "allowed"
                    },
                    resolutionResult: {
                        text: "Currency manager",
                        ui5ComponentName: "Currency.Component",
                        url: "/url/to/currency",
                        applicationType: "URL",
                        additionalInformation: "SAPUI5.Component=Currency.Component"
                    }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [{
                "defaultedParamNames": [],
                "genericSO": false,
                "intentParamsPlusAllDefaults": {
                    "A": [
                          "Avalue"
                         ]
            // B Not present!
                      },
                "matches": true,
                "matchesVirtualInbound": false,
                "resolutionResult": { },
                "parsedIntent": {
                  "action": "action",
                  "params": {
                          "A": [
                                    "Avalue"
                                  ]
                        },
                  "semanticObject": "Object"
                },
                "inbound": {
                    "action": "action",
                    "resolutionResult": {
                        "additionalInformation": "SAPUI5.Component=Currency.Component",
                        "applicationType": "URL",
                        "text": "Currency manager",
                        "ui5ComponentName": "Currency.Component",
                         "url": "/url/to/currency"
                    },
                    "semanticObject": "Object",
                    "signature": {
                        parameters: {
                            "A": { "renameTo": "ANew"},
                            "B": { "renameTo": "ANew",
                                    "defaultValue": { "value": "BDefaulted" }
                                  }
                        },
                        additionalParameters: "allowed"
                    }
                }
            }]
        },
        {
            testDescription: "matching tile inbound + bExcludeTileInbounds=false parameter is given",
            oParsedShellHash: { "semanticObject": "Action", "action": "toNewsTile", "params": {} },
            bExcludeTileInbounds: false,
            aInbounds: [
                { // a tile inbound
                    "semanticObject": "Action",
                    "action": "toNewsTile",
                    "title": "News",
                    "resolutionResult": { },
                    "deviceTypes": { "desktop": true, "tablet": true, "phone": true },
                    "signature": {
                        "parameters": {},
                        "additionalParameters": "allowed"
                    },
                    "tileResolutionResult": {
                        "isCustomTile": true // filters out the inbound

                        // ... plus irrelevant data for this test...
                    }
                }
            ],
            mockedUserDefaultValues: {},
            expected: [
                { // the same tile inbound
                    "parsedIntent": {
                      "action": "toNewsTile",
                      "params": {},
                      "semanticObject": "Action"
                    },
                    "inbound": {
                        "semanticObject": "Action",
                        "action": "toNewsTile",
                        "title": "News",
                        "resolutionResult": { },
                        "deviceTypes": { "desktop": true, "tablet": true, "phone": true },
                        "signature": {
                            "parameters": {},
                            "additionalParameters": "allowed"
                        },
                        "tileResolutionResult": {
                            "isCustomTile": true // filters out the inbound
                        }
                    },
                    "resolutionResult": {},
                    "defaultedParamNames": [],
                    "genericSO": false,
                    "intentParamsPlusAllDefaults": {},
                    "matches": true,
                    "matchesVirtualInbound": false
                }
            ]
        },
        {
            testDescription: "matching tile inbound + bExcludeTileInbounds=true parameter is given",
            oParsedShellHash: { "semanticObject": "Action", "action": "toNewsTile", "params": {} },
            bExcludeTileInbounds: true,
            aInbounds: [
                { // a tile inbound
                    "semanticObject": "Action",
                    "action": "toNewsTile",
                    "title": "News",
                    "resolutionResult": { },
                    "deviceTypes": { "desktop": true, "tablet": true, "phone": true },
                    "signature": {
                        "parameters": {},
                        "additionalParameters": "allowed"
                    },
                    "tileResolutionResult": {
                        "isCustomTile": true // filters out the inbound

                        // ... plus irrelevant data for this test...
                    }
                }
            ],
            mockedUserDefaultValues: {},
            expected: []
        }
    ].forEach(function (oFixture) {
        asyncTest("_getMatchingInbounds: works as expected when " + oFixture.testDescription, function () {

            var oSrvc = createService(),
                fnRealGetService = sap.ushell.Container.getService;

            // Mock User Defaults service
            sinon.stub(sap.ushell.Container, "getService", function (sServiceName) {
                if (sServiceName === "UserDefaultParameters") {
                    return { // a fake UserDefaultParameters service
                        getValue: function (sValueName) {
                            return new jQuery.Deferred().resolve({
                                value: oFixture.mockedUserDefaultValues[sValueName]
                            }).promise();
                        }
                    };
                }
                // else
                return fnRealGetService(sServiceName);
            });

            var oIndex = oInboundIndex.createIndex(oFixture.aInbounds);

            oSrvc._getMatchingInbounds(oFixture.oParsedShellHash, oIndex, { bExcludeTileInbounds: oFixture.bExcludeTileInbounds })
                .done(function (aMatchingResults) {
                    ok(true, "promise was resolved");

                    if (!jQuery.isEmptyObject(oFixture.mockedUserDefaultValues)) {
                        ok(sap.ushell.Container.getService.calledWith("UserDefaultParameters"), "the UserDefaultParameters service was invoked");
                    }

                    /*
                     * This test allows to compare inbounds by ids if
                     * integers are specified in the expectation.
                     */
                    if (oFixture.expected.every(function (vArrayItem) {
                        return typeof vArrayItem === "number";
                    })) {
                        // compare only inbound results
                        var aExpectedInbounds = oFixture.expected.map(function (iResultNumber) {
                                return oFixture.aInbounds[iResultNumber];
                            }),
                            aGotInbounds = aMatchingResults.map(function (oMatchResult) {
                                return oMatchResult.inbound;
                            });

                        deepEqual(aGotInbounds, aExpectedInbounds, "match results reference expected inbounds");
                    } else {
                        // compare full result but ignore property originalInbound
                        deepEqual(removeCountsAndSortString(aMatchingResults),
                            oFixture.expected, "got expected matching results");
                    }
                })
                .fail(function () {
                    ok(false, "promise was resolved");
                })
                .always(function () {
                    start();
                });
        });
    });

    [
       {
          testDescription: "one inbound matches",
          oIntent: mkInt("#Action-toappnavsample"),
          aFakeInbounds: [
            oTestHelper.createInbound("#Action-toappnavsample")
          ],
          expectedLogHeader: [
            /\[REPORT #1\] Matching Intent 'Action-toappnavsample' to inbounds/,
            /form factor: <any>/
          ],
          expectedLogBody: [
            /#Action-toappnavsample{<no params><\?>}/,
            /No need to resolve references/,
            /rematch was skipped/,
            /Nothing to sort/
          ]
       },
       {
          testDescription: "no inbounds match",
          oIntent: mkInt("#Action-toappnavsample"),
          aFakeInbounds: [
            // nothing
          ],
          expectedLogHeader: [
            /\[REPORT #1\] Matching Intent 'Action-toappnavsample' to inbounds/,
            /form factor: <any>/
          ],
          expectedLogBody: [
            /No inbound was matched/,
            /No need to resolve references/,
            /rematch was skipped/,
            /Nothing to sort/
          ]
       },
       {
          testDescription: "two inbounds with the same name match",
          oIntent: mkInt("#Action-toappnavsample"),
          aFakeInbounds: [
            oTestHelper.createInbound("#Action-toappnavsample{[default1:[value1]]}"),
            oTestHelper.createInbound("#Action-toappnavsample{[default2:[value2]]}")
          ],
          expectedLogHeader: [
            /\[REPORT #1\] Matching Intent 'Action-toappnavsample' to inbounds/,
            /form factor: <any>/
          ],
          expectedLogBody: [
            /#Action-toappnavsample{\[default1:\[value1\]\]<o>}\n/,
            /#Action-toappnavsample{\[default2:\[value2\]\]<o>}\n/,
            /No need to resolve references/,
            /rematch was skipped \(no references to resolve\)/,
            /Sorted inbounds as follows:/,
            /#Action-toappnavsample{\[default1:\[value1\]\]<o>}.*\n.*#Action-toappnavsample{\[default2:\[value2\]\]<o>}/
          ]
       },
       {
          testDescription: "inbounds with sap priority are reported",
          oIntent: mkInt("#Action-toappnavsample"),
          aFakeInbounds: [
            oTestHelper.createInbound("#Action-toappnavsample{[default1:[value1]],[sap-priority:[5]]}"),
            oTestHelper.createInbound("#Action-toappnavsample{[default2:[value2]],[sap-priority:[10]]}")
          ],
          expectedLogHeader: [
            /\[REPORT #1\] Matching Intent 'Action-toappnavsample' to inbounds/,
            /form factor: <any>/
          ],
          expectedLogBody: [
            /Sorted inbounds as follows:/,
            /\* 1 \* sap-priority: '10'([\s\S])+\* 1 \* sap-priority: '5'/
          ]
       },
       {
          testDescription: "an inbound with references is resolved",
          oIntent: mkInt("#Action-toappnavsample"),
          aFakeInbounds: [
            oTestHelper.createInbound("#Action-toappnavsample{[p1:[@paramName@]]}")
          ],
          expectedLogHeader: [
            /\[REPORT #1\] Matching Intent 'Action-toappnavsample' to inbounds/,
            /form factor: <any>/
          ],
          expectedLogBody: [
            /#Action-toappnavsample{\[p1:\[@paramName@\]\]<o>}\n/,
            /Must resolve the following references:[\s\S]*paramName/,
            /resolved references with the following values:[\s\S]*paramName: 'paramNameValue'/
          ]
       },
       {
          testDescription: "two inbounds with references are matched, but only one is rematched",
          oIntent: mkInt("#Action-toappnavsample?id=aValue"),
          aFakeInbounds: [
            oTestHelper.createInbound("#Action-toappnavsample{id:@a@}"), // id resolves to aValue (see test)
            oTestHelper.createInbound("#Action-toappnavsample{id:@b@}") // id resolves to bValue (see test)
          ],
          expectedLogHeader: [
            /\[REPORT #1\] Matching Intent 'Action-toappnavsample[?]id=aValue' to inbounds/,
            /form factor: <any>/
          ],
          expectedLogBody: [
            new RegExp([
                "STAGE2: Resolve references",
                "--------------------------",
                "@ Must resolve the following references:",
                " . a",
                " . b",
                ". resolved references with the following values:",
                " . a: 'aValue'",
                " . b: 'bValue'"
            ].join("\n")),
            new RegExp([
                "STAGE3: Rematch with references",
                "-------------------------------",
                "The following inbounds re-matched:",
                " . #Action-toappnavsample{id:@a@<o>}"
            ].join("\n")),
            new RegExp([
                "STAGE4: Sort matched targets",
                "----------------------------",
                "Nothing to sort"
            ].join("\n"))
          ]
       },
       {
          testDescription: "an inbound with reference is matched, but no inbounds are rematched",
          oIntent: mkInt("#Action-toappnavsample?id=aValue"),
          aFakeInbounds: [
            oTestHelper.createInbound("#Action-toappnavsample{id:@b@}") // id resolves to bValue (see test)
          ],
          expectedLogHeader: [
            /\[REPORT #1\] Matching Intent 'Action-toappnavsample[?]id=aValue' to inbounds/,
            /form factor: <any>/
          ],
          expectedLogBody: [
            new RegExp([
                "STAGE2: Resolve references",
                "--------------------------",
                "@ Must resolve the following references:",
                " . b",
                ". resolved references with the following values:",
                " . b: 'bValue'"
            ].join("\n")),
            new RegExp([
                "STAGE3: Rematch with references",
                "-------------------------------",
                "- No inbounds re-matched"
            ].join("\n")),
            new RegExp([
                "STAGE4: Sort matched targets",
                "----------------------------",
                "Nothing to sort"
            ].join("\n"))
          ]
       }
    ].forEach(function (oFixture) {
        asyncTest("_getMatchingInbounds: reports inbound search correctly when " + oFixture.testDescription, function () {
            var oSrvc = createService();

            // Stub ReferenceResolver
            var fnGetServiceOrig = sap.ushell.Container.getService;
            sap.ushell.Container.getService = function (sServiceName) {
                if (sServiceName === "ReferenceResolver") {
                    return {
                        resolveReferences: function (aRefs) {
                            return new jQuery.Deferred().resolve(aRefs.reduce(function (oResolvedRefs, sNextRef) {
                                oResolvedRefs[sNextRef] = sNextRef + "Value";
                                return oResolvedRefs;
                            }, {})).promise();
                        }
                    };
                }

                return fnGetServiceOrig.call(sap.ushell.Container, sServiceName);
            };

            // Check logging expectations via LogMock
            sinon.stub(jQuery.sap.log, "debug");
            sinon.stub(jQuery.sap.log, "error");
            sinon.stub(jQuery.sap.log, "warning");

            // getLevel called by CSTR/Logger to determine logging is enabled

            var oIndex = oInboundIndex.createIndex(oFixture.aFakeInbounds);

            sinon.stub(oCSTRUtils, "isDebugEnabled").returns(true);

            oSrvc._getMatchingInbounds(oFixture.oIntent, oIndex, oFixture.oConstraints)
                .done(function (aMatchingResults) {
                    ok(true, "_getMatchingInbounds promise was resolved");
                    strictEqual(jQuery.sap.log.error.callCount, 0, "jQuery.sap.log.error was called 0 times");
                    strictEqual(jQuery.sap.log.warning.callCount, 0, "jQuery.sap.log.warning was called 0 times");
                    strictEqual(jQuery.sap.log.debug.callCount, 1, "jQuery.sap.log.debug was called 1 time");

                    // check that each regexp matches the call argument of debug
                    oFixture.expectedLogHeader.forEach(function (rLog) {
                        var sLogHeader = jQuery.sap.log.debug.getCall(0).args[0];
                        var bMatches = !!sLogHeader.match(rLog);
                        ok(bMatches, rLog.toString() + " was found in the log call." + (
                            bMatches ? "" : "Log header was: " + sLogHeader.replace(/\n/g, "\u21a9") // 21a9 enter key symbol
                        ));
                    });
                    oFixture.expectedLogBody.forEach(function (rLog) {
                        var sLogBody = jQuery.sap.log.debug.getCall(0).args[1];
                        var bMatches = !!sLogBody.match(rLog);
                        ok(bMatches, rLog.toString() + " was found in the log call." + (
                            bMatches ? "" : "Log body was: " + sLogBody.replace(/\n/g, "\u21a9") // 21a9 enter key symbol
                        ));
                    });
                })
                .fail(function () {
                    ok(false, "_getMatchingInbounds promise was resolved");
                })
                .always(function () {
                    start();
                });
        });
    });

    asyncTest("_resolveHashFragment: promise is rejected when navigation target cannot be resolved client side", function () {
        sinon.stub(jQuery.sap.log, "error");
        sinon.stub(jQuery.sap.log, "warning");

        var oSrvc = createService();

        // return empty -> cannot resolve matching targets
        sinon.stub(oSrvc, "_getMatchingInbounds").returns(new jQuery.Deferred().resolve([]).promise());

        oSrvc._resolveHashFragment("#hash-fragment", function () {} /*fallback*/)
            .done(function () {
                ok(false, "Promise was rejected");
            })
            .fail(function (sErrorMsg) {
                ok(true, "Promise was rejected");
                strictEqual(jQuery.sap.log.warning.getCalls().length, 1, "jQuery.sap.log.warning was called once");
                strictEqual(jQuery.sap.log.error.getCalls().length, 0, "jQuery.sap.log.error was not called");
                strictEqual(sErrorMsg, "Could not resolve navigation target", "Rejected with expected message");
            })
            .always(function () {
                start();
            });

    });

    asyncTest("_resolveHashFragment: promise is rejected when _getMatchingInbounds rejects", function () {
        sinon.stub(jQuery.sap.log, "error");
        sinon.stub(jQuery.sap.log, "warning");

        var oSrvc = createService();

        // rejects
        sinon.stub(oSrvc, "_getMatchingInbounds").returns(new jQuery.Deferred().reject("Deliberate failure"));

        oSrvc._resolveHashFragment("#hash-fragment", function () {} /*fallback*/)
            .done(function () {
                ok(false, "Promise was rejected");
            })
            .fail(function (sErrorMsg) {
                ok(true, "Promise was rejected");
                strictEqual(jQuery.sap.log.warning.getCalls().length, 0, "jQuery.sap.log.warning was not called");
                strictEqual(jQuery.sap.log.error.getCalls().length, 1, "jQuery.sap.log.error was called once");
                strictEqual(sErrorMsg, "Deliberate failure", "Rejected with expected message");
            })
            .always(function () {
                start();
            });

    });

    [
        {
            testDescription: "generic semantic object is passed",
            sIntent: "#*-action"
        },
        {
            testDescription: "empty semantic object is passed",
            sIntent: "#-action"
        },
        {
            testDescription: "* is passed in action",
            sIntent: "#Object-*"
        },
        {
            testDescription: "blank is passed in semantic object",
            sCurrentFormFactor: "mobile",
            sIntent: "# -*"
        },
        {
            testDescription: "many blanks are passed in semantic object",
            sCurrentFormFactor: "mobile",
            sIntent: "# -*"
        }
    ].forEach(function (oFixture) {

        asyncTest("_resolveHashFragment: rejects promise when " + oFixture.testDescription, function () {
            var oSrvc = createService();

            sinon.stub(jQuery.sap.log, "error");

            // returns the default parameter names after resolution
            sinon.stub(oSrvc, "_getMatchingInbounds").returns(
                new jQuery.Deferred().resolve({
                    resolutionResult: {} // causes _resolveHashFragment promise to be resolved (in case test fails)
                }).promise()
            );

            sinon.stub(utils, "getFormFactor").returns("desktop");

            oSrvc._resolveHashFragment(oFixture.sIntent)
                .done(function (oResolutionResult) {
                    ok(false, "promise was rejected");
                })
                .fail(function () {
                    ok(true, "promise was rejected");
                    strictEqual(jQuery.sap.log.error.getCalls().length, 1, "jQuery.sap.log.error was called once");

                    ok(jQuery.sap.log.error.getCall(0).args[0].indexOf("Could not parse shell hash") === 0,
                        "logged 'Could not parse shell hash ...'");
                })
                .always(function () {
                    start();
                });
        });
    });


    [
        {
            testName: "no inbounds are defined",
            inbounds: [],
            expectedParameters: { simple: {}, extended: {}}
        },
        {
            testName: "inbounds contain non-overlapping user default placeholders",
            inbounds: [
                { semanticObject: "SomeObject",
action: "action1",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault1": { filter: { value: "Some Value1" }, required: false },
                            "withUserDefault1": { filter: { value: "UserDefault.value1", format: "reference" }, required: true },
                            "withUserDefault2": { filter: { value: "UserDefault.value2", format: "reference" }, required: false },
                            "noUserDefault2": { filter: { value: "Some Value2" }, required: false },
                            "withUserDefault3": { filter: { value: "UserDefault.value3", format: "reference" }, required: true }
                        }
                    }
                },
                { semanticObject: "SomeObject2",
action: "action2",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault3": { filter: { value: "Another Value1" }, required: false },
                            "withUserDefault4": { filter: { value: "UserDefault.value4", format: "reference" }, required: true },
                            "withUserDefault5": { filter: { value: "UserDefault.value5", format: "reference" }, required: false },
                            "noUserDefault4": { filter: { value: "Another Value2" }, required: false },
                            "withUserDefault6": { filter: { value: "UserDefault.value6", format: "reference" }, required: true }
                        }
                    }
                }
            ],
            expectedParameters: {
                simple: {"value1": {},
"value2": {},
"value3": {},
"value4": {},
                    "value5": {},
                    "value6": {}},
                extended: {}
            }
        },
        {
            testName: "inbounds contain other types of defaults",
            inbounds: [
                { semanticObject: "SomeObject",
action: "action1",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault1": { filter: { value: "Some Value1" }, required: false },
                            "withUserDefault1": { filter: { value: "UserDefault.value1", format: "reference" }, required: true },
                            "withUserDefault2": { filter: { value: "MachineDefault.value2", format: "reference" }, required: false },
                            "noUserDefault2": { filter: { value: "Some Value2" }, required: false },
                            "withUserDefault3": { filter: { value: "UserDefault.value3", format: "reference" }, required: true }
                        }
                    }
                },
                { semanticObject: "SomeObject2",
action: "action2",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault3": { filter: { value: "Another Value1" }, required: false },
                            "withUserDefault4": { filter: { value: "UserDefault.value4", format: "reference" }, required: true },
                            "withUserDefault5": { filter: { value: "SapDefault.value5", format: "reference" }, required: false },
                            "noUserDefault4": { filter: { value: "Another Value2" }, required: false },
                            "withUserDefault6": { filter: { value: "UserDefault.value6", format: "reference" }, required: true }
                        }
                    }
                }
            ],
            expectedParameters: { simple: {"value1": {}, "value3": {}, "value4": {}, "value6": {}}, extended: {}}
        },
        {
            testName: "inbounds contain overlapping user default placeholders",
            inbounds: [
                { semanticObject: "SomeObject",
action: "action1",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault1": { filter: { value: "Some Value1" }, required: false },
                            "withUserDefault1": { filter: { value: "UserDefault.value1", format: "reference" }, required: false },
                            "withUserDefault2": { filter: { value: "UserDefault.value3", format: "reference" }, required: false },
                            "noUserDefault2": { filter: { value: "Some Value2" }, required: false },
                            "withUserDefault3": { filter: { value: "UserDefault.value2", format: "reference" }, required: false }
                        }
                    }
                },
                { semanticObject: "SomeObject2",
action: "action2",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault3": { filter: { value: "Another Value1" }, required: false },
                            "withUserDefault4": { filter: { value: "UserDefault.value1", format: "reference" }, required: false },
                            "withUserDefault5": { filter: { value: "UserDefault.value2", format: "reference" }, required: false },
                            "noUserDefault4": { filter: { value: "Another Value2" }, required: false },
                            "withUserDefault6": { filter: { value: "UserDefault.value4", format: "reference" }, required: false }
                        }
                    }
                }
            ],
            expectedParameters: { simple: {"value1": {}, "value2": {}, "value3": {}, "value4": {}}, extended: {}}
        },
        {
            testName: "inbounds contain no user default placeholders",
            inbounds: [
                { semanticObject: "SomeObject",
action: "action1",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault1": { filter: { value: "Some Value1" }, required: false },
                            "noUserDefault2": { filter: { value: "Some Value2" }, required: false }
                        }
                    }
                },
                { semanticObject: "SomeObject2",
action: "action2",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault3": { filter: { value: "Another Value1" }, required: false },
                            "noUserDefault4": { filter: { value: "Another Value2" }, required: false }
                        }
                    }
                }
            ],
            expectedParameters: { simple: {}, extended: {}}
        },
        {
            testName: "inbounds contain a mix of filter values and user default values",
            inbounds: [
                { semanticObject: "SomeObject",
action: "action1",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault1": { defaultValue: { value: "UserDefault.value1", format: "reference" }, required: false },
                            "noUserDefault2": { filter: { value: "UserDefault.value2", format: "reference" }, required: false }
                        }
                    }
                },
                { semanticObject: "SomeObject2",
action: "action2",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault3": { filter: { value: "UserDefault.value3", format: "reference" }, required: false },
                            "noUserDefault4": { defaultValue: { value: "UserDefault.value4", format: "reference" }, required: false }
                        }
                    }
                }
            ],
            expectedParameters: { simple: { "value1": {}, "value2": {}, "value3": {}, "value4": {}}, extended: {} }
        }
    ].forEach(function (oFixture) {

        asyncTest("getUserDefaultParameterNames: returns default parameter names when " + oFixture.testName, function () {
            var oSrvc = createService({
                    inbounds: oFixture.inbounds
                }),
                oParameterNamesPromise = oSrvc.getUserDefaultParameterNames();

            if (typeof oParameterNamesPromise.done !== "function") {
                ok(false, "getUserDefaultParameterNames returned a promise");
                start();
                return;
            }

            oParameterNamesPromise.done(function (oGotParameterNames) {
                deepEqual(oGotParameterNames, oFixture.expectedParameters, "obtained expected parameter names");
            }).always(function () {
                start();
            });
        });

    });

    asyncTest("getUserDefaultParameterNames: rejects promise when private method throws", function () {
        var oSrvc = createService(),
            oParameterNamesPromise;

        sinon.stub(oSrvc, "_getUserDefaultParameterNames").throws("deliberate exception");

        oParameterNamesPromise = oSrvc.getUserDefaultParameterNames();

        oParameterNamesPromise
            .done(function (oGotParameterNames) {
                ok(false, "promise was rejected");
            })
            .fail(function (sErrorMessage) {
                ok(true, "promise was rejected");
                strictEqual(sErrorMessage, "Cannot get user default parameters from inbounds: deliberate exception", "obtained expected error message");
            })
            .always(function () {
                start();
            });
    });

    [
        {
            testName: "no inbounds are defined",
            inbounds: [],
            expectedParameters: { simple: {}, extended: {}}
        },
        {
            testName: "inbounds contain overlapping extended, not extended",
            inbounds: [
                { semanticObject: "SomeObject",
action: "action1",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault1": { filter: { value: "Some Value1" }, required: false },
                            "withUserDefault1": { filter: { value: "UserDefault.extended.value1", format: "reference" }, required: true },
                            "withUserDefault2": { filter: { value: "UserDefault.extended.value2", format: "reference" }, required: false },
                            "noUserDefault2": { filter: { value: "Some Value2" }, required: false },
                            "withUserDefault3": { filter: { value: "UserDefault.value3", format: "reference" }, required: true }
                        }
                    }
                },
                { semanticObject: "SomeObject2",
action: "action2",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault3": { filter: { value: "Another Value1" }, required: false },
                            "withUserDefault4": { filter: { value: "UserDefault.value1", format: "reference" }, required: true },
                            "withUserDefault5": { filter: { value: "UserDefault.value2", format: "reference" }, required: false },
                            "noUserDefault4": { filter: { value: "Another Value2" }, required: false },
                            "withUserDefault6": { filter: { value: "UserDefault.value6", format: "reference" }, required: true }
                        }
                    }
                }
            ],
            expectedParameters: { simple: {"value1": {}, "value2": {}, "value3": {}, "value6": {}}, extended: {"value1": {}, "value2": {}}}
        },
        {
            testName: "inbounds contain other types of defaults",
            inbounds: [
                { semanticObject: "SomeObject",
action: "action1",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault1": { filter: { value: "UserDefault.extended.valuex" }, required: false },
                            "withUserDefault1": { filter: { value: "UserDefault.extended.value1", format: "reference" }, required: true },
                            "withUserDefault2": { filter: { value: "MachineDefault.value2", format: "reference" }, required: false },
                            "noUserDefault2": { filter: { value: "Some Value2" }, required: false },
                            "withUserDefault3": { filter: { value: "UserDefault.value3", format: "reference" }, required: true }
                        }
                    }
                },
                { semanticObject: "SomeObject2",
action: "action2",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault3": { filter: { value: "Another Value1" }, required: false },
                            "withUserDefault4": { filter: { value: "UserDefault.value4", format: "reference" }, required: true },
                            "withUserDefault5": { filter: { value: "SapDefault.value5", format: "reference" }, required: false },
                            "noUserDefault4": { filter: { value: "Another Value2" }, required: false },
                            "withUserDefault6": { filter: { value: "UserDefault.value6", format: "reference" }, required: true }
                        }
                    }
                }
            ],
            expectedParameters: { simple: {"value3": {}, "value4": {}, "value6": {}}, extended: {"value1": {}}}
        },
        {
            testName: "inbounds contain overlapping user default placeholders",
            inbounds: [
                { semanticObject: "SomeObject",
action: "action1",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault1": { filter: { value: "Some Value1" }, required: false },
                            "withUserDefault1": { filter: { value: "UserDefault.extended.value1", format: "reference" }, required: false },
                            "withUserDefault2": { filter: { value: "UserDefault.extended.value3", format: "reference" }, required: false },
                            "noUserDefault2": { filter: { value: "Some Value2" }, required: false },
                            "withUserDefault3": { filter: { value: "UserDefault.extended.value2", format: "reference" }, required: false }
                        }
                    }
                },
                { semanticObject: "SomeObject2",
action: "action2",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault3": { filter: { value: "Another Value1" }, required: false },
                            "withUserDefault4": { filter: { value: "UserDefault.extended.value1", format: "reference" }, required: false },
                            "withUserDefault5": { filter: { value: "UserDefault.extended.value2", format: "reference" }, required: false },
                            "noUserDefault4": { filter: { value: "Another Value2" }, required: false },
                            "withUserDefault6": { filter: { value: "UserDefault.extended.value4", format: "reference" }, required: false }
                        }
                    }
                }
            ],
            expectedParameters: { simple: {}, extended: {"value1": {}, "value2": {}, "value3": {}, "value4": {}}}
        },
        {
            testName: "inbounds contain no user default placeholders",
            inbounds: [
                { semanticObject: "SomeObject",
action: "action1",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault1": { filter: { value: "Some Value1" }, required: false },
                            "noUserDefault2": { filter: { value: "Some Value2" }, required: false }
                        }
                    }
                },
                { semanticObject: "SomeObject2",
action: "action2",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault3": { filter: { value: "Another Value1" }, required: false },
                            "noUserDefault4": { filter: { value: "Another Value2" }, required: false }
                        }
                    }
                }
            ],
            expectedParameters: {simple: {}, extended: {}}
        },
        {
            testName: "inbounds contain a mix of filter values and user default values",
            inbounds: [
                { semanticObject: "SomeObject",
action: "action1",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault1": { defaultValue: { value: "UserDefault.extended.value1", format: "reference" }, required: false },
                            "noUserDefault2": { filter: { value: "UserDefault.value2", format: "reference" }, required: false }
                        }
                    }
                },
                { semanticObject: "SomeObject2",
action: "action2",
                    signature: {
                        additionalParameters: "allowed",
                        parameters: {
                            "noUserDefault3": { filter: { value: "UserDefault.value3", format: "reference" }, required: false },
                            "noUserDefault4": { defaultValue: { value: "UserDefault.extended.value4", format: "reference" }, required: false }
                        }
                    }
                }
            ],
            expectedParameters: {simple: {"value2": {}, "value3": {}}, extended: {"value1": {}, "value4": {}}}
        }

    ].forEach(function (oFixture) {

        asyncTest("getUserDefaultParameterNames: (Extended) returns extended default parameter names when " + oFixture.testName, function () {
            var oSrvc = createService({
                    inbounds: oFixture.inbounds
                }),
                oInboundListPromise = oSrvc.getUserDefaultParameterNames();

            if (typeof oInboundListPromise.done !== "function") {
                ok(false, "getUserDefaultParameterNames returned a promise");
                start();
                return;
            }

            oInboundListPromise.done(function (aObtainedInbounds) {
                deepEqual(aObtainedInbounds, oFixture.expectedParameters, "obtained expected parameter names");
            }).always(function () {
                start();
            });
        });

    });



    [
        {
            testDescription: "legacy parameter is provided",
            sSemanticObject: "Object",
            mBusinessParams: { "country": ["IT"] },
            bIgnoreFormFactor: true,
            bLegacySortParameter: true, // legacy sort parameter
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [
                {
                   "matches": true,
                   "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                   "inbound": {
                       "title": "Currency manager",
                       "subTitle": "sub Title",
                       "shortTitle": "short Title",
                       "icon": "sap-icon://Fiori2/F0018",
                       "semanticObject": "Object",
"action": "ZZZ",
                       "resolutionResult": { "_original": { "text": "Currency manager" }, "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                       "signature": { "parameters": { }, "additionalParameters": "ignored" }
                   }
                },
                { // simulate this result to have higher priority
                   "matches": true,
                   "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                   "inbound": {
                       "title": "Currency manager",
                       "subTitle": "sub Title",
                       "shortTitle": "short Title",
                       "icon": "sap-icon://Fiori2/F0018",
                       "semanticObject": "Object",
"action": "bbb",
                       "resolutionResult": { "_original": { "text": "Currency manager" }, "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                       "signature": { "parameters": {
                        "country": {
                            required: true
                        }
                      }}
                   }
                },
                {
                   "matches": true,
                   "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                   "inbound": {
                       "title": "Currency manager",
                       "subTitle": "sub Title",
                       "shortTitle": "short Title",
                       "icon": "sap-icon://Fiori2/F0018",
                       "semanticObject": "Object",
"action": "aaa",
                       "resolutionResult": { "_original": { "text": "Currency manager" }, "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                       "signature": { "parameters": { }, "additionalParameters": "ignored" }
                   }
                }
            ],
            expectedSemanticObjectLinks: [
                { "intent": "#Object-ZZZ",
                    "text": "Currency manager",
                    "icon": "sap-icon://Fiori2/F0018",
                    "subTitle": "sub Title",
                   "shortTitle": "short Title" },
                { "intent": "#Object-aaa",
                    "text": "Currency manager",
                    "icon": "sap-icon://Fiori2/F0018",
                    "subTitle": "sub Title",
                    "shortTitle": "short Title"},
                { "intent": "#Object-bbb?country=IT",
                    "text": "Currency manager",
                    "icon": "sap-icon://Fiori2/F0018",
                    "subTitle": "sub Title",
                    "shortTitle": "short Title"}
            ],
            expectedWarningCalls: [
                [
                    "the parameter 'sortResultOnTexts' was experimantal and is no longer supported",
                    "getLinks results will be sorted by 'intent'",
                    "sap.ushell.services.ClientsideTargetResolution"
                ]
            ]
        },
        {
            testDescription: "alphabetical order on priority is expected in result",
            sSemanticObject: "Object",
            mBusinessParams: { "country": ["IT"] },
            bIgnoreFormFactor: true,
            sSortResultsBy: "priority",
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [
                { // simulate this result to have higher priority
                   "matches": true,
                   "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                   "inbound": {
                       "title": "Currency manager",
                       "subTitle": "sub Title",
                       "shortTitle": "short Title",
                       "icon": "sap-icon://Fiori2/F0018",
                       "semanticObject": "Object",
"action": "bbb",
                       "resolutionResult": { "_original": { "text": "Currency manager" }, "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                       "signature": { "parameters": {
                        "country": {
                            required: true
                        }
                      }}
                   }
                },
                {
                   "matches": true,
                   "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                   "inbound": {
                       "title": "Currency manager",
                       "subTitle": "sub Title",
                       "shortTitle": "short Title",
                       "icon": "sap-icon://Fiori2/F0018",
                       "semanticObject": "Object",
"action": "ccc",
                       "resolutionResult": { "_original": { "text": "Currency manager" }, "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                       "signature": { "parameters": { }, "additionalParameters": "ignored" }
                   }
                },
                {
                   "matches": true,
                   "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                   "inbound": {
                       "title": "Currency manager",
                       "subTitle": "sub Title",
                       "shortTitle": "short Title",
                       "icon": "sap-icon://Fiori2/F0018",
                       "semanticObject": "Object",
"action": "aaa",
                       "resolutionResult": { "_original": { "text": "Currency manager" }, "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                       "signature": { "parameters": { }, "additionalParameters": "ignored" }
                   }
                }
            ],
            expectedSemanticObjectLinks: [
                { "intent": "#Object-bbb?country=IT",
                    "text": "Currency manager",
                    "icon": "sap-icon://Fiori2/F0018",
                    "subTitle": "sub Title",
                    "shortTitle": "short Title"},
                { "intent": "#Object-ccc",
                    "text": "Currency manager",
                    "icon": "sap-icon://Fiori2/F0018",
                    "subTitle": "sub Title",
                    "shortTitle": "short Title"},
                { "intent": "#Object-aaa",
                    "text": "Currency manager",
                    "icon": "sap-icon://Fiori2/F0018",
                    "subTitle": "sub Title",
                   "shortTitle": "short Title" }
            ]
        },
        {
            testDescription: "alphabetical order on intents is expected in result",
            sSemanticObject: "Object",
            mBusinessParams: { "country": ["IT"] },
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [
                { // simulate this result to have higher priority
                   "matches": true,
                   "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                   "inbound": {
                       "title": "Currency manager",
                       "subTitle": "sub Title",
                       "shortTitle": "short Title",
                       "icon": "sap-icon://Fiori2/F0018",
                       "semanticObject": "Object",
"action": "bbb",
                       "resolutionResult": { "_original": { "text": "Currency manager" }, "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                       "signature": { "parameters": {
                        "country": {
                            required: true
                        }
                      }}
                   }
                },
                {
                   "matches": true,
                   "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                   "inbound": {
                       "title": "Currency manager",
                       "subTitle": "sub Title",
                       "shortTitle": "short Title",
                       "icon": "sap-icon://Fiori2/F0018",
                       "semanticObject": "Object",
"action": "ccc",
                       "resolutionResult": { "_original": { "text": "Currency manager" }, "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                       "signature": { "parameters": { }, "additionalParameters": "ignored" }
                   }
                },
                {
                   "matches": true,
                   "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                   "inbound": {
                       "title": "Currency manager",
                       "subTitle": "sub Title",
                       "shortTitle": "short Title",
                       "icon": "sap-icon://Fiori2/F0018",
                       "semanticObject": "Object",
"action": "aaa",
                       "resolutionResult": { "_original": { "text": "Currency manager" }, "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                       "signature": { "parameters": { }, "additionalParameters": "ignored" }
                   }
                }
            ],
            expectedSemanticObjectLinks: [
                { "intent": "#Object-aaa",
                    "text": "Currency manager",
                    "icon": "sap-icon://Fiori2/F0018",
                    "subTitle": "sub Title",
                   "shortTitle": "short Title"
                    },
                { "intent": "#Object-bbb?country=IT",
                    "text": "Currency manager",
                    "icon": "sap-icon://Fiori2/F0018",
                    "subTitle": "sub Title",
                    "shortTitle": "short Title"},
                { "intent": "#Object-ccc",
                    "text": "Currency manager",
                    "icon": "sap-icon://Fiori2/F0018",
                    "subTitle": "sub Title",
                    "shortTitle": "short Title"}
            ],
            expectedWarningCalls: [
                [
                    "Passing positional arguments to getLinks is deprecated",
                    "Please use nominal arguments instead",
                    "sap.ushell.services.ClientSideTargetResolution"
                ]
            ]
        },
        {
            testDescription: "alphabetical order on texts is expected in result",
            sSemanticObject: "Object",
            mBusinessParams: { "country": ["IT"] },
            bIgnoreFormFactor: true,
            sSortResultsBy: "text",
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [
                { // simulate this result to have higher priority
                    "matches": true,
                    "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                    "inbound": {
                        "title": "Currency managerC",
                        "shortTitle": "short Title",
                        "subTitle": "sub Title",
                        "icon": "sap-icon://Fiori2/F0018",
                        "semanticObject": "Object",
"action": "aaa",
                        "resolutionResult": { "_original": { "text": "Currency manager" }, "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                        "signature": { "parameters": {
                            "country": {
                                required: true
                            }
                        }}
                    }
                },
                {
                    "matches": true,
                    "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                    "inbound": {
                        "title": "Currency managerA",
                        "shortTitle": "short Title",
                        "subTitle": "sub Title",
                        "icon": "sap-icon://Fiori2/F0018",
                        "semanticObject": "Object",
"action": "bbb",
                        "resolutionResult": { "_original": { "text": "Currency manager" }, "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                        "signature": { "parameters": { }, "additionalParameters": "ignored" }
                    }
                },
                {
                    "matches": true,
                    "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                    "inbound": {
                        "title": "Currency managerB",
                        "shortTitle": "short Title",
                        "subTitle": "sub Title",
                        "icon": "sap-icon://Fiori2/F0018",
                        "semanticObject": "Object",
"action": "ccc",
                        "resolutionResult": { "_original": { "text": "Currency manager" }, "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                        "signature": { "parameters": { }, "additionalParameters": "ignored" }
                    }
                }
            ],
            expectedSemanticObjectLinks: [
                { "intent": "#Object-bbb",
                    "text": "Currency managerA",
                    "icon": "sap-icon://Fiori2/F0018",
                    "subTitle": "sub Title",
                    "shortTitle": "short Title"},
                { "intent": "#Object-ccc",
                    "text": "Currency managerB",
                    "icon": "sap-icon://Fiori2/F0018",
                    "subTitle": "sub Title",
                    "shortTitle": "short Title" },
                { "intent": "#Object-aaa?country=IT",
                    "text": "Currency managerC",
                    "icon": "sap-icon://Fiori2/F0018",
                    "subTitle": "sub Title",
                    "shortTitle": "short Title" }
            ]
        },
        {
            // multiple inbounds are filtered in this case as the URL looks the same
            testDescription: "multiple inbounds that look identical are matched",
            sSemanticObject: "Action",
            mBusinessParams: {},
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [
                {
                   "matches": true,
                   "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                   "inbound": {
                       "title": "Currency manager",
                       "shortTitle": "short Title",
                       "subTitle": "sub Title",
                       "icon": "sap-icon://Fiori2/F0018",
                       "semanticObject": "Action",
"action": "actionX",
                       "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                       "signature": {
                           "parameters": {
                               "mode": {
                                   "required": false,
                                   "defaultValue": { value: "DefaultValue1" } //  ignored in result
                               }
                           }
                       }
                   }
                },
                {
                   "matches": true,
                   "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                   "inbound": {
                       "title": "Currency manager",
                       "subTitle": "sub Title",
                       "shortTitle": "short Title",
                       "icon": "sap-icon://Fiori2/F0018",
                       "semanticObject": "Action",
"action": "actionX",
                       "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                       "signature": {
                           "parameters": { } // this inbound has not parameter
                       }
                   }
                }
            ],
            expectedSemanticObjectLinks: [
                { "intent": "#Action-actionX", // note "?" removed from parameter
                    "text": "Currency manager",
                    "icon": "sap-icon://Fiori2/F0018",
                    "subTitle": "sub Title",
                    "shortTitle": "short Title"}
            ],
            expectedWarningCalls: [
                [
                    "Passing positional arguments to getLinks is deprecated",
                    "Please use nominal arguments instead",
                    "sap.ushell.services.ClientSideTargetResolution"
                ]
            ]
        },
        {
            testDescription: "matching target exists and business parameters are specified",
            sSemanticObject: "Action",
            mBusinessParams: { "ParamName1": "value", "ParamName2": ["value1", "value2"] }, // NOTE: parameters provided
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [{
               // ignore certain fields not needed for the test
               "matches": true,
               "resolutionResult": {
                   "additionalInformation": "SAPUI5.Component=Currency.Component",
                   "applicationType": "URL",
                   "text": "Currency manager",
                   "ui5ComponentName": "Currency.Component",
                   "url": "/url/to/currency?mode=desktop"
               },
               "inbound": {
                   "title": "Currency manager",
                   "icon": "sap-icon://Fiori2/F0018",
                   "shortTitle": "short Title",
                   "subTitle": "sub Title",
                   "semanticObject": "Action",
"action": "action1",
                   "resolutionResult": {
                       "additionalInformation": "SAPUI5.Component=Currency.Component",
                       "applicationType": "URL",
                       "text": "Currency manager (ignored text)", // ignored
                       "ui5ComponentName": "Currency.Component",
                       "url": "/url/to/currency"
                   },
                   "signature": {
                       "additionalParameters": "ignored",
                       "parameters": {
                           "mode": {
                               "required": false,
                               "defaultValue": { value: "DefaultValue" } //  ignored in result
                           }
                       }
                   }
               }
            }],
            expectedSemanticObjectLinks: [
                { "intent": "#Action-action1", // only return intent parameters that are mentioned in Inbound
                    "text": "Currency manager",
                    "icon": "sap-icon://Fiori2/F0018",
                    "subTitle": "sub Title",
                    "shortTitle": "short Title"}
            ],
            expectedWarningCalls: [
                [
                    "Passing positional arguments to getLinks is deprecated",
                    "Please use nominal arguments instead",
                    "sap.ushell.services.ClientSideTargetResolution"
                ]
            ]
        },
        {
            testDescription: "matching target has default parameter that overlaps with intent parameter",
            sSemanticObject: "Action",
            mBusinessParams: { "ParamName1": "value", "ParamName2": ["value1", "value2"] }, // NOTE: parameters provided
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [{
               // ignore certain fields not needed for the test
               "matches": true,
               "resolutionResult": {
                   "additionalInformation": "SAPUI5.Component=Currency.Component",
                   "applicationType": "URL",
                   "text": "Currency manager",
                   "ui5ComponentName": "Currency.Component",
                   "url": "/url/to/currency?mode=desktop"
               },
               "inbound": {
                   "title": "Currency manager",
                   "shortTitle": "short Title",
                   "subTitle": "sub Title",
                   "icon": "sap-icon://Fiori2/F0018",
                   "semanticObject": "Action",
"action": "action1",
                   "resolutionResult": {
                       "additionalInformation": "SAPUI5.Component=Currency.Component",
                       "applicationType": "URL",
                       "text": "Currency manager (ignored text)", // ignored
                       "ui5ComponentName": "Currency.Component",
                       "url": "/url/to/currency"
                   },
                   "signature": {
                       "additionalParameters": "ignored",
                       "parameters": {
                           "ParamName1": {
                               "required": false,
                               "defaultValue": { value: "DefaultValue" }
                           }
                       }
                   }
               }
            }],
            expectedSemanticObjectLinks: [
                { "intent": "#Action-action1?ParamName1=value", // only ParamName1 is mentioned in Inbound
                    "text": "Currency manager",
                    "icon": "sap-icon://Fiori2/F0018",
                    "subTitle": "sub Title",
                    "shortTitle": "short Title" }
            ],
            expectedWarningCalls: [
                [
                    "Passing positional arguments to getLinks is deprecated",
                    "Please use nominal arguments instead",
                    "sap.ushell.services.ClientSideTargetResolution"
                ]
            ]
        },
        {
            testDescription: "sap-system parameter specified in intent",
            sSemanticObject: "Action",
            mBusinessParams: { "sap-system": ["CC2"] },
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [{
               // ignore certain fields not needed for the test
               "matches": true,
               "resolutionResult": {
                   "additionalInformation": "SAPUI5.Component=Currency.Component",
                   "applicationType": "URL",
                   "text": "Currency manager",
                   "ui5ComponentName": "Currency.Component",
                   "url": "/url/to/currency?mode=desktop"
               },
               "inbound": {
                   "semanticObject": "Action",
"action": "action1",
                   "title": "Currency manager",
                   "icon": "sap-icon://Fiori2/F0018",
                   "shortTitle": "short Title",
                   "subTitle": "sub Title",
                   "resolutionResult": {
                       "additionalInformation": "SAPUI5.Component=Currency.Component",
                       "applicationType": "URL",
                       "text": "Currency manager (ignored text)", // ignored
                       "ui5ComponentName": "Currency.Component",
                       "url": "/url/to/currency"
                   },
                   "signature": {
                       "additionalParameters": "ignored",
                       "parameters": {
                           "ParamName1": {
                               "required": false,
                               "defaultValue": { value: "DefaultValue" }
                           }
                       }
                   }
               }
            }],
            expectedSemanticObjectLinks: [
                { "intent": "#Action-action1?sap-system=CC2",
                    "text": "Currency manager",
                    "icon": "sap-icon://Fiori2/F0018",
                    "subTitle": "sub Title",
                    "shortTitle": "short Title" }
            ],
            expectedWarningCalls: [
                [
                    "Passing positional arguments to getLinks is deprecated",
                    "Please use nominal arguments instead",
                    "sap.ushell.services.ClientSideTargetResolution"
                ]
            ]
        },
        {
            testDescription: "sap-system and other parameters specified in intent (additionalParameters: allowed)",
            sSemanticObject: "Action",
            mBusinessParams: {
                "sap-system": ["CC2"],
                "paramName1": ["paramValue1"],
                "paramName2": ["paramValue2"]
            },
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [{
               // ignore certain fields not needed for the test
               "matches": true,
               "resolutionResult": {
                   "additionalInformation": "SAPUI5.Component=Currency.Component",
                   "applicationType": "URL",
                   "text": "Currency manager",
                   "ui5ComponentName": "Currency.Component",
                   "url": "/url/to/currency?mode=desktop"
               },
               "inbound": {
                   "semanticObject": "Action",
"action": "action1",
                   "title": "Currency manager",
                   "shortTitle": "short Title",
                   "subTitle": "sub Title",
                   "icon": "sap-icon://Fiori2/F0018",
                   "resolutionResult": {
                       "additionalInformation": "SAPUI5.Component=Currency.Component",
                       "applicationType": "URL",
                       "text": "Currency manager (ignored text)", // ignored
                       "ui5ComponentName": "Currency.Component",
                       "url": "/url/to/currency"
                   },
                   "signature": {
                       "additionalParameters": "allowed", // non overlapping parameters added to result
                       "parameters": {
                           "paramName1": {
                               "required": false,
                               "defaultValue": { value: "DefaultValue" }
                           }
                       }
                   }
               }
            }],
            expectedSemanticObjectLinks: [
                { "intent": "#Action-action1?paramName1=paramValue1&paramName2=paramValue2&sap-system=CC2",
                    "text": "Currency manager",
                    "icon": "sap-icon://Fiori2/F0018",
                    "subTitle": "sub Title",
                    "shortTitle": "short Title" }
            ],
            expectedWarningCalls: [
                [
                    "Passing positional arguments to getLinks is deprecated",
                    "Please use nominal arguments instead",
                    "sap.ushell.services.ClientSideTargetResolution"
                ]
            ]
        },
        {
            testDescription: "sap-system and other parameters specified in intent (additionalParameters: ignored)",
            sSemanticObject: "Action",
            mBusinessParams: {
                "sap-system": ["CC2"],
                "paramName1": ["paramValue1"],
                "paramName2": ["paramValue2"]
            },
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [{
               // ignore certain fields not needed for the test
               "matches": true,
               "resolutionResult": {
                   "additionalInformation": "SAPUI5.Component=Currency.Component",
                   "applicationType": "URL",
                   "text": "Currency manager",
                   "ui5ComponentName": "Currency.Component",
                   "url": "/url/to/currency?mode=desktop"
               },
               "inbound": {
                   "title": "Currency manager",
                   "icon": "sap-icon://Fiori2/F0018",
                   "subTitle": "sub Title",
                   "shortTitle": "short Title",
                   "semanticObject": "Action",
"action": "action1",
                   "resolutionResult": {
                       "additionalInformation": "SAPUI5.Component=Currency.Component",
                       "applicationType": "URL",
                       "text": "Currency manager (ignored text)", // ignored
                       "ui5ComponentName": "Currency.Component",
                       "url": "/url/to/currency"
                   },
                   "signature": {
                       "additionalParameters": "ignored",
                       "parameters": {
                           "paramName1": {
                               "required": false,
                               "defaultValue": { value: "DefaultValue" }
                           }
                       }
                   }
               }
            }],
            expectedSemanticObjectLinks: [
                { "intent": "#Action-action1?paramName1=paramValue1&sap-system=CC2",
                    "text": "Currency manager",
                    "icon": "sap-icon://Fiori2/F0018",
                    "subTitle": "sub Title",
                    "shortTitle": "short Title" }
            ],
            expectedWarningCalls: [
                [
                    "Passing positional arguments to getLinks is deprecated",
                    "Please use nominal arguments instead",
                    "sap.ushell.services.ClientSideTargetResolution"
                ]
            ]
        },
        {
            testDescription: "matching target has required parameter that overlaps with intent parameter",
            sSemanticObject: "Action",
            mBusinessParams: { "ParamName1": "value", "ParamName2": ["value1", "value2"] }, // NOTE: parameters provided
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [{
               // ignore certain fields not needed for the test
               "matches": true,
               "resolutionResult": {
                   "additionalInformation": "SAPUI5.Component=Currency.Component",
                   "applicationType": "URL",
                   "text": "Currency manager",
                   "ui5ComponentName": "Currency.Component",
                   "url": "/url/to/currency?mode=desktop"
               },
               "inbound": {
                   "title": "Currency manager",
                   "subTitle": "sub Title",
                   "shortTitle": "short Title",
                   "icon": "sap-icon://Fiori2/F0018",
                   "semanticObject": "Action",
"action": "action1",
                   "resolutionResult": {
                       "additionalInformation": "SAPUI5.Component=Currency.Component",
                       "applicationType": "URL",
                       "text": "Currency manager (ignored text)", // ignored
                       "ui5ComponentName": "Currency.Component",
                       "url": "/url/to/currency"
                   },
                   "signature": {
                       "additionalParameters": "ignored",
                       "parameters": {
                           "ParamName2": {
                               "required": true
                           }
                       }
                   }
               }
            }],
            expectedSemanticObjectLinks: [
                { "intent": "#Action-action1?ParamName2=value1&ParamName2=value2", // only ParamName2 is mentioned in Inbound
                    "text": "Currency manager",
                    "icon": "sap-icon://Fiori2/F0018",
                    "subTitle": "sub Title",
                    "shortTitle": "short Title" }
            ],
            expectedWarningCalls: [
                [
                    "Passing positional arguments to getLinks is deprecated",
                    "Please use nominal arguments instead",
                    "sap.ushell.services.ClientSideTargetResolution"
                ]
            ]
        },
        {
            testDescription: "function called with * semantic object",
            sSemanticObject: "*",
            mBusinessParams: { "ParamName1": "value", "ParamName2": ["value1", "value2"] }, // NOTE: parameters provided
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [{ // a inbound with generic semantic object
               "matches": true,
               "resolutionResult": {
                   "additionalInformation": "SAPUI5.Component=Currency.Component",
                   "applicationType": "URL",
                   "text": "Currency manager",
                   "ui5ComponentName": "Currency.Component",
                   "url": "/url/to/currency?mode=desktop"
               },
               "inbound": {
                   "title": "Currency manager",
                   "subTitle": "sub Title",
                   "shortTitle": "short Title",
                   "icon": "sap-icon://Fiori2/F0018",
                   "semanticObject": "*",
                   "action": "action",
                   "resolutionResult": {
                       "additionalInformation": "SAPUI5.Component=Currency.Component",
                       "applicationType": "URL",
                       "text": "Currency manager (ignored text)", // ignored
                       "ui5ComponentName": "Currency.Component",
                       "url": "/url/to/currency"
                   },
                   "signature": {
                       "parameters": {
                           "mode": {
                               "required": false,
                               "defaultValue": { value: "DefaultValue" } //  ignored in result
                           }
                       }
                   }
               }
            }],
            expectedSemanticObjectLinks: [], // Inbound should be filtered out
            expectedWarningCalls: [
                [
                    "Passing positional arguments to getLinks is deprecated",
                    "Please use nominal arguments instead",
                    "sap.ushell.services.ClientSideTargetResolution"
                ]
            ]
        },
        {
            testDescription: "function called with empty string semantic object",
            sSemanticObject: "", // should match all
            mBusinessParams: { "ParamName1": "value", "ParamName2": ["value1", "value2"] }, // NOTE: parameters provided
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [{ // a inbound with generic semantic object
               "matches": true,
               "resolutionResult": {
                   "additionalInformation": "SAPUI5.Component=Currency.Component",
                   "applicationType": "URL",
                   "text": "Currency manager",
                   "ui5ComponentName": "Currency.Component",
                   "url": "/url/to/currency?mode=desktop"
               },
               "inbound": {
                   "title": "Currency manager",
                   "subTitle": "sub Title",
                   "shortTitle": "short Title",
                   "icon": "sap-icon://Fiori2/F0018",
                   "semanticObject": "*",
                   "action": "action",
                   "resolutionResult": {
                       "additionalInformation": "SAPUI5.Component=Currency.Component",
                       "applicationType": "URL",
                       "text": "Currency manager (ignored text)", // ignored
                       "ui5ComponentName": "Currency.Component",
                       "url": "/url/to/currency"
                   },
                   "signature": {
                       "parameters": {
                           "mode": {
                               "required": false,
                               "defaultValue": { value: "DefaultValue" } //  ignored in result
                           }
                       }
                   }
               }
            }],
            expectedSemanticObjectLinks: [], // Inbound should be filtered out
            expectedWarningCalls: [
                [
                    "Passing positional arguments to getLinks is deprecated",
                    "Please use nominal arguments instead",
                    "sap.ushell.services.ClientSideTargetResolution"
                ]
            ]
        },
        {
            testDescription: "hideIntentLink is set to true",
            sSemanticObject: "Object",
            mBusinessParams: {},
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [
                { // has no hideIntentLink
                   "matches": true,
                   "resolutionResult": {
                       "additionalInformation": "SAPUI5.Component=Currency.Component",
                       "applicationType": "URL",
                       "text": "Currency manager A",
                       "ui5ComponentName": "Currency.Component",
                       "url": "/url/to/currency?mode=desktop"
                   },
                   "inbound": {
                       // NOTE: no hideIntentLink set
                       "title": "Currency manager A",
                       "subTitle": "sub Title",
                       "shortTitle": "short Title",
                       "icon": "sap-icon://Fiori2/F0018",
                       "semanticObject": "Object",
                       "action": "actionA",
                       "resolutionResult": {
                           "additionalInformation": "SAPUI5.Component=Currency.Component",
                           "applicationType": "URL",
                           "text": "Currency manager A",
                           "ui5ComponentName": "Currency.Component",
                           "url": "/url/to/currency"
                       },
                       "signature": { "parameters": { } }
                   }
                },
                { // same as the previous inbound but with hideIntentLink set
                   "matches": true,
                   "resolutionResult": {
                       "additionalInformation": "SAPUI5.Component=Currency.Component",
                       "applicationType": "URL",
                       "text": "Currency manager B",
                       "ui5ComponentName": "Currency.Component",
                       "url": "/url/to/currency?mode=desktop"
                   },
                   "inbound": {
                       "hideIntentLink": true, // NOTE: this should be hidden in the result!
                       "title": "Currency manager B",
                       "subTitle": "sub Title",
                       "shortTitle": "short Title",
                       "semanticObject": "Object",
                       "action": "actionB",
                       "resolutionResult": {
                           "additionalInformation": "SAPUI5.Component=Currency.Component",
                           "applicationType": "URL",
                           "text": "Currency manager B",
                           "ui5ComponentName": "Currency.Component",
                           "url": "/url/to/currency"
                       },
                       "signature": { "parameters": { } }
                   }
                }
            ],
            expectedSemanticObjectLinks: [
                {
                    "intent": "#Object-actionA",
                    "text": "Currency manager A",
                    "icon": "sap-icon://Fiori2/F0018",
                    "subTitle": "sub Title",
                    "shortTitle": "short Title"
                }
            ],
            expectedWarningCalls: [
                [
                    "Passing positional arguments to getLinks is deprecated",
                    "Please use nominal arguments instead",
                    "sap.ushell.services.ClientSideTargetResolution"
                ]
            ]
        },
        {
            testDescription: "app state is provided as member",
            sSemanticObject: "Object",
            mBusinessParams: { "ab": 1},
            sAppStateKey: "AS12345",
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            aMockedResolutionResults: [
                { // has no hideIntentLink
                   "matches": true,
                   "resolutionResult": {
                       "additionalInformation": "SAPUI5.Component=Currency.Component",
                       "applicationType": "URL",
                       "text": "Currency manager A",
                       "ui5ComponentName": "Currency.Component",
                       "url": "/url/to/currency?mode=desktop"
                   },
                   "inbound": {
                       // NOTE: no hideIntentLink set
                       "title": "Currency manager A",
                       "shortTitle": "short Title",
                       "subTitle": "sub Title",
                       "icon": "sap-icon://Fiori2/F0018",
                       "semanticObject": "Object",
                       "action": "actionA",
                       "resolutionResult": {
                           "additionalInformation": "SAPUI5.Component=Currency.Component",
                           "applicationType": "URL",
                           "text": "Currency manager A",
                           "ui5ComponentName": "Currency.Component",
                           "url": "/url/to/currency"
                       },
                       "signature": { "parameters": { "ab": { required: true } } }
                   }
                }
            ],
            expectedSemanticObjectLinks: [
                {
                    "intent": "#Object-actionA?ab=1&sap-xapp-state=AS12345",
                    "text": "Currency manager A",
                    "icon": "sap-icon://Fiori2/F0018",
                    "subTitle": "sub Title",
                    "shortTitle": "short Title"
                }
            ],
            expectedWarningCalls: [
                [
                    "Passing positional arguments to getLinks is deprecated",
                    "Please use nominal arguments instead",
                    "sap.ushell.services.ClientSideTargetResolution"
                ]
            ]
        }
    ].forEach(function (oFixture) {

        asyncTest("getLinks: returns expected inbounds when " + oFixture.testDescription, function () {

            var oSrvc = createService();

            sinon.stub(jQuery.sap.log, "warning");
            sinon.stub(jQuery.sap.log, "error");

            // Mock form factor
            sinon.stub(utils, "getFormFactor").returns(oFixture.sCurrentFormFactor);

            // Mock getMatchingInbounds
            sinon.stub(oSrvc, "_getMatchingInbounds").returns(
                new jQuery.Deferred().resolve(oFixture.aMockedResolutionResults).promise()
            );

            if (oFixture.hasOwnProperty("sAction")) {
                // test 1.38.0+ behavior
                oSrvc.getLinks({
                    semanticObject: oFixture.sSemanticObject,
                    action: oFixture.sAction,
                    params: oFixture.mBusinessParams,
                    appStateKey: oFixture.sAppStateKey,
                    ignoreFormFactor: oFixture.bIgnoreFormFactor
                }).done(function (aResultSemanticObjectLinks) {
                        // Assert
                        ok(true, "promise was resolved");
                        deepEqual(aResultSemanticObjectLinks, oFixture.expectedSemanticObjectLinks, "got expected array of semantic object links");

                        testExcludeTileIntentArgument(oSrvc, true);
                    })
                    .fail(function () {
                        // Assert
                        ok(false, "promise was rejected");
                    })
                    .always(function () {
                        testExpectedErrorAndWarningCalls(oFixture);
                        start();
                    });
            } else if (oFixture.sSortResultsBy || oFixture.bLegacySortParameter) {
                // test internal flag for sorting result on texts
                var oGetLinksCallArgs = {
                    semanticObject: oFixture.sSemanticObject,
                    params: oFixture.mBusinessParams,
                    appStateKey: oFixture.sAppStateKey,
                    ignoreFormFactor: oFixture.bIgnoreFormFactor
                };

                if (oFixture.sSortResultsBy) {
                    oGetLinksCallArgs.sortResultsBy = oFixture.sSortResultsBy;
                }
                if (oFixture.bLegacySortParameter) {
                    oGetLinksCallArgs.sortResultOnTexts = oFixture.bLegacySortParameter;
                }

                oSrvc.getLinks(oGetLinksCallArgs)
                    .done(function (aResultSemanticObjectLinks) {
                        // Assert
                        ok(true, "promise was resolved");
                        deepEqual(aResultSemanticObjectLinks, oFixture.expectedSemanticObjectLinks, "got expected array of semantic object links");

                        testExcludeTileIntentArgument(oSrvc, true);
                    })
                    .fail(function () {
                        // Assert
                        ok(false, "promise was rejected");
                    })
                    .always(function () {
                        testExpectedErrorAndWarningCalls(oFixture);
                        start();
                    });
            } else {
                // test old style call and the new style call return the same results
                var mBusinessParamsAmended = jQuery.extend(true, {}, oFixture.mBusinessParams);
                if (oFixture.sAppStateKey) {
                    mBusinessParamsAmended["sap-xapp-state"] = [ oFixture.sAppStateKey ];
                }
                oSrvc.getLinks(oFixture.sSemanticObject, mBusinessParamsAmended, oFixture.bIgnoreFormFactor)
                    .done(function (aResultSemanticObjectLinksOld) {
                        ok(true, "positional parameters call promise was resolved");

                        testExcludeTileIntentArgument(oSrvc, true);
                        oSrvc._getMatchingInbounds.reset(); // testExcludeTileIntentArgument called later again

                        oSrvc.getLinks({
                            semanticObject: oFixture.sSemanticObject,
                            params: oFixture.mBusinessParams,
                            appStateKey: oFixture.sAppStateKey,
                            ignoreFormFactor: oFixture.bIgnoreFormFactor
                        }).done(function (aResultSemanticObjectLinksNew) {
                            ok(true, "nominal parameters call promise was resolved");

                            testExcludeTileIntentArgument(oSrvc, true);

                            deepEqual(aResultSemanticObjectLinksNew, aResultSemanticObjectLinksOld,
                                "the new call with nominal parameters returns the same result as the call with positional parameters");

                            deepEqual(aResultSemanticObjectLinksNew, oFixture.expectedSemanticObjectLinks,
                                "the new call with positional parameters returns the expected results");

                            deepEqual(aResultSemanticObjectLinksOld, oFixture.expectedSemanticObjectLinks,
                                "the old call with positional parameters returns the expected results");

                        }).fail(function () {
                            ok(false, "nominal parameters call promise was resolved");
                        }).always(function () {
                            testExpectedErrorAndWarningCalls(oFixture);
                        });
                    })
                    .fail(function () {
                        // Assert
                        ok(false, "positional parameters call promise was resolved");
                    })
                    .always(function () {
                        start();
                    });
            }

        });
    });

    // Test getLinks( ... ) called with 'tags' constraints
    QUnit.test("getLinks: propagates the tags argument to _getLinks, then to _getMatchingInbounds", function (assert) {
        var fnDone = assert.async();
        var oCSTRService = createService();

        sinon.spy(oCSTRService, "_getLinks");
        sinon.stub(oCSTRService, "_getMatchingInbounds").returns(jQuery.when([ ]));

        oCSTRService.getLinks({
            semanticObject: "Action",
            tags: [
                "tag-A",
                "tag-B",
                "tag-C"
            ] })
                .then(function () {
                    assert.ok(oCSTRService._getLinks.calledOnce, "Calling getLinks consequently calls _getLinks internally");
                    assert.deepEqual(oCSTRService._getLinks.getCall(0).args[0].tags, [
                        "tag-A",
                        "tag-B",
                        "tag-C"
                    ], "_getLinks is called with tags");

                    assert.ok(oCSTRService._getMatchingInbounds.calledOnce, "Calling getLinks consequently calls _getMatchingInbounds internally");
                    assert.deepEqual(oCSTRService._getMatchingInbounds.getCall(0).args[2].tags, [
                        "tag-A",
                        "tag-B",
                        "tag-C"
                    ], "_getMatchingInbounds is called with tags");
                })
                .then(function () {
                    oCSTRService._getLinks.restore();
                    oCSTRService._getMatchingInbounds.restore();
                    return;
                })
                .then(fnDone, fnDone);
    });

    (function () {
        var oBaseInboundGUI = {
            "semanticObject": "GUI",
            "action": "display",
            "title": "Change Actual Assessment Cycle G/L",
            "icon": "sap-icon://Fiori2/F0021",
            "resolutionResult": {
                "sap.gui": {
                    "_version": "1.2.0",
                    "transaction": "FAGLGA12"
                },
                "applicationType": "TR",
                "systemAlias": "",
                "text": "Change Actual Assessment Cycle G/L"
            },
            "deviceTypes": {
                "desktop": true,
                "tablet": false,
                "phone": false
            },
            "signature": {
                "additionalParameters": "ignored",
                "parameters": {}
            },
            "tileResolutionResult": {
                "title": "Change Actual Assessment Cycle G/L",
                "icon": "sap-icon://Fiori2/F0021",
                "tileComponentLoadInfo": "#Shell-staticTile",
                "technicalInformation": "FAGLGA12",
                "isCustomTile": false
            }
        };
        var oBaseInboundWDA = {
            "semanticObject": "WDA",
            "action": "display",
            "title": "Statistical Key Figures",
            "info": "Accessible",
            "icon": "sap-icon://Fiori2/F0021",
            "subTitle": "Actuals",
            "resolutionResult": {
                "sap.wda": {
                    "_version": "1.2.0",
                    "applicationId": "FIS_FPM_OVP_STKEYFIGITEMCO",
                    "configId": "FIS_FPM_OVP_STKEYFIGITEMCO"
                },
                "applicationType": "WDA",
                "systemAlias": "",
                "systemAliasSemantics": "apply",
                "text": "Statistical Key Figures"
            },
            "deviceTypes": { "desktop": true, "tablet": false, "phone": false },
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {}
            },
            "tileResolutionResult": {
                "title": "Statistical Key Figures",
                "subTitle": "Actuals",
                "icon": "sap-icon://Fiori2/F0021",
                "info": "Accessible",
                "tileComponentLoadInfo": "#Shell-staticTile",
                "description": "Accessible",
                "technicalInformation": "FIS_FPM_OVP_STKEYFIGITEMCO",
                "isCustomTile": false
            }
        };
        var oBaseInboundUI5 = {
            "semanticObject": "SemanticObject",
            "action": "action",
            "title": "Title",
            "resolutionResult": {
                "applicationType": "SAPUI5",
                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.Inbound",
                "text": "Text",
                "ui5ComponentName": "sap.ushell.demo.Inbound",
                "applicationDependencies": {
                    "name": "sap.ushell.demo.Inbound",
                    "self": {
                        "name": "sap.ushell.demo.Inbound"
                    }
                },
                "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample",
                "systemAlias": ""
            },
            "deviceTypes": {
                "desktop": true,
                "tablet": true,
                "phone": true
            },
            "signature": {
                "additionalParameters": "allowed",
                "parameters": {}
            }
        };
        var oTestInbounds = {
            "wda": jQuery.extend(true, {}, oBaseInboundWDA),
            "gui": jQuery.extend(true, {}, oBaseInboundGUI),
            "basic": jQuery.extend(true, {}, oBaseInboundUI5, {
                semanticObject: "Object",
                action: "action",
                tileResolutionResult: {
                    "key": "valueBasic", // any tileResolutionResult
                    navigationMode: "embedded",
                    startupParameters: {}
                }
            }),
            "with_required_parameter_filter_value": jQuery.extend(true, {}, oBaseInboundUI5, {
                semanticObject: "Object",
                action: "withParameters",
                tileResolutionResult: {
                    "key": "valueRequired",
                    navigationMode: "embedded",
                    startupParameters: {
                        "P1": ["V1"]
                    }
                },
                signature: {
                    "additionalParameters": "notallowed",
                    "parameters": {
                        "P1": {
                            required: true,
                            filter: { value: "V1" }
                        },
                        "PTOBERENAMED": {
                            renameTo: "IWASRENAMED"
                        }
                    }
                }
            }),
             "with_required_parameter_filter_valueAndRename": jQuery.extend(true, {}, oBaseInboundUI5, {
                semanticObject: "Object",
                action: "withParameters",
                tileResolutionResult: {
                    "key": "valueRequired",
                    navigationMode: "embedded",
                    startupParameters: {
                        "P1": ["V1"],
                        "IWASRENAMED": ["V2"]
                    }
                },
                signature: {
                    "additionalParameters": "notallowed",
                    "parameters": {
                        "P1": {
                            required: true,
                            filter: { value: "V1" }
                        },
                        "PTOBERENAMED": {
                            renameTo: "IWASRENAMED"
                        }
                    }
                }
            })
        };

        [
            {
                testType: "success", // the scenario under test
                testDescription: "no parameters inbound with tileResolutionResult section is provided",
                sIntent: "#Object-action",
                aInbounds: [oTestInbounds.basic],
                expectedResolutionResult: oTestInbounds.basic.tileResolutionResult
            },
            {
                testType: "success",
                testDescription: "inbound with parameters and tileResolutionResult section is provided",
                sIntent: "#Object-withParameters?P1=V1",
                aInbounds: [
                    oTestInbounds.basic,
                    oTestInbounds.with_required_parameter_filter_value
                ],
                expectedResolutionResult: oTestInbounds.with_required_parameter_filter_value.tileResolutionResult
            },
            {
                testType: "success",
                testDescription: "inbound with parameters and tileResolutionResult section is provided an rename to parameter is provided",
                sIntent: "#Object-withParameters?P1=V1&PTOBERENAMED=V2",
                aInbounds: [
                    oTestInbounds.basic,
                    oTestInbounds.with_required_parameter_filter_value
                ],
                expectedResolutionResult: oTestInbounds.with_required_parameter_filter_valueAndRename.tileResolutionResult
            },
            {
                testType: "success",
                testDescription: "wda target is provided",
                sIntent: "#WDA-display",
                aInbounds: [
                    oTestInbounds.wda
                ],
                expectedResolutionResult: jQuery.extend(true, {
                    navigationMode: "newWindowThenEmbedded",
                    startupParameters: undefined
                }, oTestInbounds.wda.tileResolutionResult)
            },
            {
                testType: "success",
                testDescription: "gui target is provided",
                sIntent: "#GUI-display",
                aInbounds: [
                    oTestInbounds.gui
                ],
                expectedResolutionResult: jQuery.extend(true, {
                    navigationMode: "newWindowThenEmbedded",
                    startupParameters: undefined
                }, oTestInbounds.gui.tileResolutionResult)
            },
            {
                testType: "failure",
                testDescription: "invalid shell hash passed",
                sIntent: "#ObjectwithParameters?P1=V1",
                aInbounds: [],
                expectedRejectMessage: "Cannot parse shell hash",
                expectedErrorCallArgs: [
                    "Could not parse shell hash '#ObjectwithParameters?P1=V1'",
                    "please specify a valid shell hash",
                    "sap.ushell.services.ClientSideTargetResolution"
                ]
            },
            {
                testType: "failure",
                testDescription: "_getMatchingInbounds fails",
                testSimulateFailingGetMatchingInbounds: true,
                sIntent: "#Object-action",
                aInbounds: [],
                expectedRejectMessage: "Deliberate failure",
                expectedErrorCallArgs: [
                    "Could not resolve #Object-action",
                    "_getMatchingInbounds promise rejected with: Deliberate failure",
                    "sap.ushell.services.ClientSideTargetResolution"
                ]
            },
            {
                testType: "failure",
                testDescription: "there are no matching targets",
                sIntent: "#Object-action",
                aInbounds: [], // deliberately provide empty inbounds here
                expectedRejectMessage: "No matching targets found",
                expectedWarningCallArgs: [
                    "Could not resolve #Object-action",
                    "no matching targets were found",
                    "sap.ushell.services.ClientSideTargetResolution"
                ]
            }
        ].forEach(function (oFixture) {
            asyncTest("resolveTileIntent resolves as expected when " + oFixture.testDescription, function () {

                var aFixtureInboundsClone = oFixture.aInbounds.map(function (oInbound) {
                    return jQuery.extend(true, {}, oInbound);
                });

                var oSrvc = createService({
                    adapter: {
                        hasSegmentedAccess: false,
                        resolveSystemAlias: function (sSystemAlias) {
                            if (sSystemAlias === "") {
                                return new jQuery.Deferred().resolve(oTestHelper.getLocalSystemAlias()).promise();
                            }
                            throw new Error("Test does not mock resolving other system aliases than the local system alias");
                        },
                        getInbounds: sinon.stub().returns(new jQuery.Deferred().resolve(oFixture.aInbounds).promise())
                    }
                });

                if (oFixture.testSimulateFailingGetMatchingInbounds) {
                    sinon.stub(oSrvc, "_getMatchingInbounds").returns(
                        new jQuery.Deferred().reject("Deliberate failure").promise()
                    );
                }

                var oMockedServices = { // NOTE: any service that is not in this object is not allowed
                    AppState: true,
                    URLParsing: true,
                    ShellNavigation: {
                        compactParams: function () { return new jQuery.Deferred().resolve({}).promise(); }
                    },
                    UserInfo: {
                        getUser: sinon.stub().returns({
                            getLanguage: sinon.stub().returns("DE"),
                            getContentDensity: sinon.stub().returns("cozy")
                        })
                    }
                };
                var fnGetServiceOrig = sap.ushell.Container.getService;
                sinon.stub(sap.ushell.Container, "getService", function (sName) {
                    if (!oMockedServices.hasOwnProperty(sName)) {
                        ok(false, "Test is not accessing " + sName);
                    }

                    // return the result of the real service call
                    if (oMockedServices[sName] === true) {
                        return fnGetServiceOrig.call(sap.ushell.Container, sName);
                    }

                    // return mocked service
                    return oMockedServices[sName];
                });

                sinon.stub(jQuery.sap.log, "warning");
                sinon.stub(jQuery.sap.log, "error");

                oSrvc.resolveTileIntent(oFixture.sIntent)
                    .done(function (oResolvedTileIntent) {
                        if (oFixture.testType === "failure") {
                            ok(false, "promise was rejected");

                        } else {
                            ok(true, "promise was resolved");

                            deepEqual(oResolvedTileIntent, oFixture.expectedResolutionResult,
                                "obtained the expected resolution result");
                        }
                    })
                    .fail(function (sError) {
                        if (oFixture.testType === "failure") {
                            ok(true, "promise was rejected");

                            strictEqual(sError, oFixture.expectedRejectMessage,
                                "obtained the expected error message");

                            // warnings
                            if (!oFixture.expectedWarningCallArgs) {
                                strictEqual(jQuery.sap.log.warning.getCalls().length, 0,
                                    "jQuery.sap.log.warning was not called");
                            } else {
                                strictEqual(jQuery.sap.log.warning.getCalls().length, 1,
                                    "jQuery.sap.log.warning was called 1 time");

                                deepEqual(
                                    jQuery.sap.log.warning.getCall(0).args,
                                    oFixture.expectedWarningCallArgs,
                                    "jQuery.sap.log.warning was called with the expected arguments"
                                );
                            }

                            // errors
                            if (!oFixture.expectedErrorCallArgs) {
                                strictEqual(jQuery.sap.log.error.getCalls().length, 0,
                                    "jQuery.sap.log.error was not called");
                            } else {
                                strictEqual(jQuery.sap.log.error.getCalls().length, 1,
                                    "jQuery.sap.log.error was called 1 time");

                                deepEqual(
                                    jQuery.sap.log.error.getCall(0).args,
                                    oFixture.expectedErrorCallArgs,
                                    "jQuery.sap.log.error was called with the expected arguments"
                                );
                            }

                        } else {
                            ok(false, "promise was resolved without " + sError);
                        }
                    })
                    .always(function () {
                        deepEqual(oFixture.aInbounds, aFixtureInboundsClone,
                            "inbounds provided by getInbounds are not modified by resolveTileIntent");

                        start();
                    });
            });
        });
    })();

//##

(function () {
    /*
     * Complete test for getLinks
     */
    var oTestInbounds = {
       "ui5InboundWithEmptyURL": {
           "semanticObject": "Action",
           "action": "toui5nourl",
           "id": "Action-toui5nourl~6r8",
           "title": "UI5 Target without URL",
           "subTitle": "sub Title",
           "shortTitle": "short Title",
           "icon": "sap-icon://Fiori2/F0018",
           "resolutionResult": {
               "applicationType": "SAPUI5",
               "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppNavSample",
               "text": "No URL",
               "ui5ComponentName": "sap.ushell.demo.AppNavSample",
               "applicationDependencies": {
                   "name": "sap.ushell.demo.AppNavSample",
                   "self": {
                       "name": "sap.ushell.demo.AppNavSample"
                   }
               },
               "url": "", // NOTE: no URL!
               "systemAlias": ""
           },
           "deviceTypes": {
               "desktop": true,
               "tablet": true,
               "phone": true
           },
           "signature": {
               "additionalParameters": "allowed",
               "parameters": {}
           },
           "compactSignature": "<no params><+>"
       },
       "noParamsNoAdditionalAllowed": {
           "semanticObject": "Action",
           "action": "toappnavsample",
           "id": "Action-toappnavsample~6r8",
           "title": "App Navigation Sample 1",
           "subTitle": "sub Title",
           "shortTitle": "short Title",
           "icon": "sap-icon://Fiori2/F0018",
           "resolutionResult": {
               "applicationType": "SAPUI5",
               "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppNavSample",
               "text": "App Navigation Sample 1",
               "ui5ComponentName": "sap.ushell.demo.AppNavSample",
               "applicationDependencies": {
                   "name": "sap.ushell.demo.AppNavSample",
                   "self": {
                       "name": "sap.ushell.demo.AppNavSample"
                   }
               },
               "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample",
               "systemAlias": ""
           },
           "deviceTypes": {
               "desktop": true,
               "tablet": true,
               "phone": true
           },
           "signature": {
               "additionalParameters": "ignored",
               "parameters": {}
           },
           "compactSignature": "<no params><+>"
       },
       "noParamsAdditionalAllowed": {
           "semanticObject": "Action",
           "action": "toappnavsample",
           "id": "Action-toappnavsample~6r8",
           "title": "App Navigation Sample 1",
           "subTitle": "sub Title",
           "shortTitle": "short Title",
           "icon": "sap-icon://Fiori2/F0018",
           "resolutionResult": {
               "applicationType": "SAPUI5",
               "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppNavSample",
               "text": "App Navigation Sample 1",
               "ui5ComponentName": "sap.ushell.demo.AppNavSample",
               "applicationDependencies": {
                   "name": "sap.ushell.demo.AppNavSample",
                   "self": {
                       "name": "sap.ushell.demo.AppNavSample"
                   }
               },
               "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample",
               "systemAlias": ""
           },
           "deviceTypes": {
               "desktop": true,
               "tablet": true,
               "phone": true
           },
           "signature": {
               "additionalParameters": "allowed",
               "parameters": {}
           },
           "compactSignature": "<no params><+>"
       },
       "requiredParamWithDefaultRenamed": {
           "semanticObject": "Action",
           "action": "parameterRename",
           "id": "Action-parameterRename~67xE",
           "title": "Parameter Rename",
           "subTitle": "sub Title",
           "shortTitle": "short Title",
           "icon": "Parameter Rename icon",
           "resolutionResult": {
               "applicationType": "SAPUI5",
               "additionalInformation": "SAPUI5.Component=sap.ushell.demo.ReceiveParametersTestApp",
               "text": "Display received parameters (Case 3, Collision)",
               "ui5ComponentName": "sap.ushell.demo.ReceiveParametersTestApp",
               "applicationDependencies": {
                   "name": "sap.ushell.demo.ReceiveParametersTestApp",
                   "self": {
                       "name": "sap.ushell.demo.ReceiveParametersTestApp"
                   }
               },
               "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/ReceiveParametersTestApp",
               "systemAlias": ""
           },
           "deviceTypes": {
               "desktop": true,
               "tablet": true,
               "phone": true
           },
           "signature": {
               "additionalParameters": "allowed",
               "parameters": {
                   "PREQ": {
                       "required": true
                   },
                   "P1": {
                       "renameTo": "P2New",
                       "required": false
                   },
                   "P2": {
                       "renameTo": "P2New",
                       "required": false
                   }
               }
           },
           "compactSignature": "Case:3;[Description:[P1-> P2New; P2-> P2New]];[P1:];[P2:]<+>"
       },
       "noParamsAllowed": {
           "semanticObject": "Action",
           "action": "noparametersAllowed",
           "id": "Action-parameterRename~67xE",
           "title": "No parameters allowed",
           "subTitle": "sub Title",
           "shortTitle": "short Title",
           "icon": "No parameters allowed icon",
           "resolutionResult": {
               "applicationType": "SAPUI5",
               "additionalInformation": "SAPUI5.Component=sap.ushell.demo.ReceiveParametersTestApp",
               "text": "Display received parameters (Case 3, Collision)",
               "ui5ComponentName": "sap.ushell.demo.ReceiveParametersTestApp",
               "applicationDependencies": {
                   "name": "sap.ushell.demo.ReceiveParametersTestApp",
                   "self": {
                       "name": "sap.ushell.demo.ReceiveParametersTestApp"
                   }
               },
               "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/ReceiveParametersTestApp",
               "systemAlias": ""
           },
           "deviceTypes": {
               "desktop": true,
               "tablet": true,
               "phone": true
           },
           "signature": {
               "additionalParameters": "notallowed",
               "parameters": {}
           },
           "compactSignature": "Case:3;[Description:[P1-> P2New; P2-> P2New]];[P1:];[P2:]<+>"
       },
       "ignoredParamsAndDefaultParameter": {
           "semanticObject": "Object",
           "action": "ignoredParameters",
           "id": "Action-parameterRename~67xE",
           "title": "No parameters allowed",
           "subTitle": "sub Title",
           "shortTitle": "short Title",
           "icon": "No parameters allowed icon",
           "resolutionResult": {
               "applicationType": "SAPUI5",
               "additionalInformation": "SAPUI5.Component=sap.ushell.demo.ReceiveParametersTestApp",
               "text": "Ignored parameters",
               "ui5ComponentName": "sap.ushell.demo.ReceiveParametersTestApp",
               "applicationDependencies": {
                   "name": "sap.ushell.demo.ReceiveParametersTestApp",
                   "self": {
                       "name": "sap.ushell.demo.ReceiveParametersTestApp"
                   }
               },
               "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/ReceiveParametersTestApp",
               "systemAlias": ""
           },
           "deviceTypes": {
               "desktop": true,
               "tablet": true,
               "phone": true
           },
           "signature": {
               "additionalParameters": "ignored",
               "parameters": {
                   "P1": {
                       "required": false,
                       "defaultValue": {
                           format: "plain",
                           value: "DEFV"
                       }
                   }
               }
           },
           "compactSignature": "Case:3;[Description:[P1-> P2New; P2-> P2New]];[P1:];[P2:]<+>"
       },
       "starAction": {
           "semanticObject": "ActionStar",
           "action": "*", // <- should be never returned in a getLinks call!
           "id": "Star-*~683P",
           "title": "Target Mapping with * as action",
           "subTitle": "sub Title",
           "shortTitle": "short Title",
           "icon": "icon with * as action",
           "resolutionResult": {
               "applicationType": "URL",
               "additionalInformation": "",
               "text": "StarAction",
               "url": "http://www.google.com",
               "systemAlias": ""
           },
           "deviceTypes": {
               "desktop": true,
               "tablet": true,
               "phone": true
           },
           "signature": {
               "additionalParameters": "allowed",
               "parameters": {}
           },
           "compactSignature": "<no params><+>"
       },
       "starSemanticObject": {
           "semanticObject": "*", // <- should be never returned in a getLinks call!
           "action": "starSemanticObject",
           "id": "Star-*~683P",
           "title": "Target Mapping with * as semanticObject",
           "subTitle": "sub Title",
           "shortTitle": "short Title",
           "icon": "icon with * as semanticObject",
           "resolutionResult": {
               "applicationType": "URL",
               "additionalInformation": "",
               "text": "StarAction",
               "url": "http://www.google.com",
               "systemAlias": ""
           },
           "deviceTypes": {
               "desktop": true,
               "tablet": true,
               "phone": true
           },
           "signature": {
               "additionalParameters": "allowed",
               "parameters": {}
           },
           "compactSignature": "<no params><+>"
       },
       "twoDefaultParametersAdditionalAllowed": {
           "semanticObject": "Object",
           "action": "twoDefaultParameters",
           "title": "Two Default Parameters",
           "subTitle": "sub Title",
           "shortTitle": "short Title",
           "icon": "Two Default Parameters icon",
           "resolutionResult": { /* doesn't matter */ },
           "deviceTypes": { "desktop": true, "tablet": true, "phone": true },
           "signature": {
               "additionalParameters": "allowed",
               "parameters": {
                  "P1": { defaultValue: { value: "V1" } },
                  "P2": { defaultValue: { value: "V2" } }
               }
           }
       },
       "threeDefaultParametersAdditionalAllowed": {
           "semanticObject": "Object",
           "action": "threeDefaultParameters",
           "title": "Three Default Parameters",
           "subTitle": "sub Title",
           "shortTitle": "short Title",
           "icon": "Three Default Parameters icon",
           "resolutionResult": { /* doesn't matter */ },
           "deviceTypes": { "desktop": true, "tablet": true, "phone": true },
           "signature": {
               "additionalParameters": "allowed",
               "parameters": {
                  "P1": { defaultValue: { value: "V1" } },
                  "P2": { defaultValue: { value: "V2" } },
                  "P3": { defaultValue: { value: "V3" } }
               }
           }
       },
       "appWithUI5": {
           "semanticObject": "PickTechnology",
           "action": "pickTech",
           "id": "PickTechnology",
           "title": "Pick Technology (UI5)",
           "subTitle": "sub Title",
           "shortTitle": "short Title",
           "icon": "Pick Technology (UI5) icon",
           "resolutionResult": {
               "applicationType": "SAPUI5",
               "additionalInformation": "SAPUI5.Component=sap.ushell.demo.ReceiveParametersTestApp",
               "text": "Ignored parameters",
               "ui5ComponentName": "sap.ushell.demo.ReceiveParametersTestApp",
               "applicationDependencies": {
                   "name": "sap.ushell.demo.ReceiveParametersTestApp",
                   "self": {
                       "name": "sap.ushell.demo.ReceiveParametersTestApp"
                   }
               },
               "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/ReceiveParametersTestApp",
               "systemAlias": "",
               "sap.ui": {
                   "technology": "UI5"
               }
           },
           "deviceTypes": {
               "desktop": true,
               "tablet": true,
               "phone": true
           },
           "signature": {
               "additionalParameters": "ignored",
               "parameters": {
                   "P1": {
                       "required": false,
                       "defaultValue": {
                           format: "plain",
                           value: "DEFV"
                       }
                   }
               }
           },
           "compactSignature": "Case:3;[Description:[P1-> P2New; P2-> P2New]];[P1:];[P2:]<+>"
       },
       "appWithWDA": {
           "semanticObject": "PickTechnology",
           "action": "pickTech",
           "id": "PickTechnology",
           "title": "Pick Technology (WDA)",
           "subTitle": "sub Title",
           "shortTitle": "short Title",
           "icon": "Pick Technology (WDA) icon",
           "resolutionResult": {
               "applicationType": "WDA",
               "additionalInformation": "",
               "text": "Ignored parameters",
               "applicationDependencies": {},
               "url": "/sap/bc/nwbc/somewhereametersTestApp",
               "systemAlias": "",
               "sap.ui": {
                   "technology": "WDA"
               }
           },
           "deviceTypes": {
               "desktop": true,
               "tablet": true,
               "phone": true
           },
           "signature": {
               "additionalParameters": "ignored",
               "parameters": {
                   "P1": {
                       "required": false,
                       "defaultValue": {
                           format: "plain",
                           value: "DEFV"
                       }
                   }
               }
           },
           "compactSignature": "Case:3;[Description:[P1-> P2New; P2-> P2New]];[P1:];[P2:]<+>"
       }
    };

    [
        { testDescription: "UI5 inbound with empty URL is provided",
            aInbounds: [
                oTestInbounds.ui5InboundWithEmptyURL
            ],
            aCallArgs: [{
                semanticObject: "Action",
                action: "toui5nourl"
            }],
            expectedResult: [{
                "intent": "#Action-toui5nourl",
                "text": "UI5 Target without URL",
                "icon": "sap-icon://Fiori2/F0018",
                "subTitle": "sub Title",
                "shortTitle": "short Title"
            }]
        },
        {
            testDescription: "semantic object and action provided",
            aInbounds: [
                oTestInbounds.noParamsAdditionalAllowed,
                oTestInbounds.requiredParamWithDefaultRenamed,
                oTestInbounds.noParamsAllowed,
                oTestInbounds.ignoredParamsAndDefaultParameter,
                oTestInbounds.starAction,
                oTestInbounds.starSemanticObject
            ],
            aCallArgs: [{
                semanticObject: "Action",
                action: "toappnavsample"
            }],
            expectedResult: [{
                "intent": "#Action-toappnavsample",
                "text": "App Navigation Sample 1",
                "icon": "sap-icon://Fiori2/F0018",
                "subTitle": "sub Title",
                "shortTitle": "short Title"
            }]
        },
        {
            testDescription: "only parameters are provided",
            aInbounds: [
                oTestInbounds.noParamsAdditionalAllowed,
                oTestInbounds.requiredParamWithDefaultRenamed,
                oTestInbounds.noParamsAllowed,
                oTestInbounds.ignoredParamsAndDefaultParameter,
                oTestInbounds.starAction,
                oTestInbounds.starSemanticObject
            ],
            aCallArgs: [{
                // if CrossApplicationNavigation#getLinks was called, the
                // presence of action is guaranteed.
                action: undefined,
                params: {
                    "PREQ": "valA",
                    "P1": ["val1"],
                    "P2": ["val2"]
                }
            }],
            expectedResult: [{
                "intent": "#Action-parameterRename?P1=val1&P2=val2&PREQ=valA",
                "text": "Parameter Rename",
                "icon": "Parameter Rename icon",
                "subTitle": "sub Title",
                "shortTitle": "short Title"
            }, {
                "intent": "#Action-toappnavsample?P1=val1&P2=val2&PREQ=valA",
                "text": "App Navigation Sample 1",
                "icon": "sap-icon://Fiori2/F0018",
                "subTitle": "sub Title",
                "shortTitle": "short Title"
            }, {
                "intent": "#Object-ignoredParameters?P1=val1",
                "text": "No parameters allowed",
                "icon": "No parameters allowed icon",
                "subTitle": "sub Title",
                "shortTitle": "short Title"
            }]
        },
        {
            testDescription: "no arguments are provided",
            aInbounds: [
                oTestInbounds.noParamsAdditionalAllowed,
                oTestInbounds.requiredParamWithDefaultRenamed,
                oTestInbounds.noParamsAllowed,
                oTestInbounds.ignoredParamsAndDefaultParameter,
                oTestInbounds.starAction,
                oTestInbounds.starSemanticObject
            ],
            aCallArgs: [{
                // if CrossApplicationNavigation#getLinks was called, the
                // presence of action is guaranteed.
                action: undefined
            }],
            expectedResult: [{
                "intent": "#Action-noparametersAllowed",
                "text": "No parameters allowed",
                "icon": "No parameters allowed icon",
                "subTitle": "sub Title",
                "shortTitle": "short Title"
            }, {
                "intent": "#Action-toappnavsample",
                "text": "App Navigation Sample 1",
                "icon": "sap-icon://Fiori2/F0018",
                "subTitle": "sub Title",
                "shortTitle": "short Title"
            }, {
                "intent": "#Object-ignoredParameters",
                "text": "No parameters allowed",
                "icon": "No parameters allowed icon",
                "subTitle": "sub Title",
                "shortTitle": "short Title"
            }]
        },
        {
            testDescription: "only semantic object is provided",
            aInbounds: [
                oTestInbounds.noParamsAdditionalAllowed,
                oTestInbounds.requiredParamWithDefaultRenamed,
                oTestInbounds.noParamsAllowed,
                oTestInbounds.ignoredParamsAndDefaultParameter,
                oTestInbounds.starAction,
                oTestInbounds.starSemanticObject
            ],
            aCallArgs: [{
                // if CrossApplicationNavigation#getLinks was called, the
                // presence of action is guaranteed.
                action: undefined,
                semanticObject: "Object"
            }],
            expectedResult: [{
                "intent": "#Object-ignoredParameters",
                "text": "No parameters allowed",
                "icon": "No parameters allowed icon",
                "subTitle": "sub Title",
                "shortTitle": "short Title"
            }, {
                "intent": "#Object-starSemanticObject",
                "text": "Target Mapping with * as semanticObject",
                "icon": "icon with * as semanticObject",
                "subTitle": "sub Title",
                "shortTitle": "short Title"
            }]
        },
        {
            testDescription: "only action is provided",
            aInbounds: [
                oTestInbounds.noParamsAdditionalAllowed,
                oTestInbounds.requiredParamWithDefaultRenamed,
                oTestInbounds.noParamsAllowed,
                oTestInbounds.ignoredParamsAndDefaultParameter,
                oTestInbounds.starAction,
                oTestInbounds.starSemanticObject
            ],
            aCallArgs: [{
                action: "toappnavsample"
            }],
            expectedResult: [{
                "intent": "#Action-toappnavsample",
                "text": "App Navigation Sample 1",
                "icon": "sap-icon://Fiori2/F0018",
                "subTitle": "sub Title",
                "shortTitle": "short Title"
            }]
        },
        {
            testDescription: "semantic object and parameters are provided",
            aInbounds: [
                oTestInbounds.noParamsAdditionalAllowed,
                oTestInbounds.requiredParamWithDefaultRenamed,
                oTestInbounds.noParamsAllowed,
                oTestInbounds.ignoredParamsAndDefaultParameter,
                oTestInbounds.starAction,
                oTestInbounds.starSemanticObject
            ],
            aCallArgs: [{
                // if CrossApplicationNavigation#getLinks was called, the
                // presence of action is guaranteed.
                action: undefined,
                semanticObject: "Object",
                params: {
                    "P1": "VDEFINED1"
                }
            }],
            expectedResult: [{
                "intent": "#Object-ignoredParameters?P1=VDEFINED1",
                "text": "No parameters allowed",
                "icon": "No parameters allowed icon",
                "subTitle": "sub Title",
                "shortTitle": "short Title"
            }, {
                "intent": "#Object-starSemanticObject?P1=VDEFINED1",
                "text": "Target Mapping with * as semanticObject",
                "icon": "icon with * as semanticObject",
                "subTitle": "sub Title",
                "shortTitle": "short Title"
            }]
        },
        {
            testDescription: "a '*' semantic object is provided",
            aInbounds: [
                oTestInbounds.noParamsAdditionalAllowed,
                oTestInbounds.requiredParamWithDefaultRenamed,
                oTestInbounds.noParamsAllowed,
                oTestInbounds.ignoredParamsAndDefaultParameter,
                oTestInbounds.starAction,
                oTestInbounds.starSemanticObject
            ],
            aCallArgs: [{
                // if CrossApplicationNavigation#getLinks was called, the
                // presence of action is guaranteed.
                action: undefined,
                semanticObject: "*"
            }],
            expectedResult: []
        },
        {
            testDescription: "a '*' action is provided",
            aInbounds: [
                oTestInbounds.noParamsAdditionalAllowed,
                oTestInbounds.requiredParamWithDefaultRenamed,
                oTestInbounds.noParamsAllowed,
                oTestInbounds.ignoredParamsAndDefaultParameter,
                oTestInbounds.starAction,
                oTestInbounds.starSemanticObject
            ],
            aCallArgs: [{
                action: "*"
            }],
            expectedResult: []
        },
        {
            testDescription: "withAtLeastOneUsedParam enabled, inbounds with default values provided, one common parameter in intent",
            aInbounds: [
                oTestInbounds.twoDefaultParametersAdditionalAllowed, // has P1 and P2 params
                oTestInbounds.threeDefaultParametersAdditionalAllowed // has P1, P2, P3 params
            ],
            aCallArgs: [{
                // if CrossApplicationNavigation#getLinks was called, the
                // presence of action is guaranteed.
                action: undefined,
                withAtLeastOneUsedParam: true,
                params: {
                    "P2": ["OURV2"]
                }
            }],
            expectedResult: [{ // both are returned because they share P2
                "intent": "#Object-threeDefaultParameters?P2=OURV2",
                "text": "Three Default Parameters",
                "icon": "Three Default Parameters icon",
                "subTitle": "sub Title",
                "shortTitle": "short Title"
            }, {
                "intent": "#Object-twoDefaultParameters?P2=OURV2",
                "text": "Two Default Parameters",
                "icon": "Two Default Parameters icon",
                "subTitle": "sub Title",
                "shortTitle": "short Title"
            }]
        },
        {
            testDescription: "withAtLeastOneUsedParam enabled and inbound with no parameters provided",
            aInbounds: [
                oTestInbounds.noParamsAdditionalAllowed
            ],
            aCallArgs: [{
                // if CrossApplicationNavigation#getLinks was called, the
                // presence of action is guaranteed.
                action: undefined,
                withAtLeastOneUsedParam: true,
                params: {
                    "P1": ["OURV1"]
                }
            }],
            expectedResult: [{
                "intent": "#Action-toappnavsample?P1=OURV1",
                "text": "App Navigation Sample 1",
                "icon": "sap-icon://Fiori2/F0018",
                "subTitle": "sub Title",
                "shortTitle": "short Title"
            }]
        },
        {
            testDescription: "withAtLeastOneUsedParam enabled and inbound with no parameters (and ignored additional parameters) provided",
            aInbounds: [
                oTestInbounds.noParamsNoAdditionalAllowed
            ],
            aCallArgs: [{
                // if CrossApplicationNavigation#getLinks was called, the
                // presence of action is guaranteed.
                action: undefined,
                withAtLeastOneUsedParam: true,
                params: {
                    "P1": ["OURV1"]
                }
            }],
            expectedResult: []
        },
        {
            testDescription: "withAtLeastOneUsedParam disabled and inbound with no parameters (and ignored additional parameters) provided",
            aInbounds: [
                oTestInbounds.noParamsNoAdditionalAllowed
            ],
            aCallArgs: [{
                // if CrossApplicationNavigation#getLinks was called, the
                // presence of action is guaranteed.
                action: undefined,
                withAtLeastOneUsedParam: false,
                params: {
                    "P1": ["OURV1"]
                }
            }],
            expectedResult: [{
                "intent": "#Action-toappnavsample",
                "text": "App Navigation Sample 1",
                "icon": "sap-icon://Fiori2/F0018",
                "subTitle": "sub Title",
                "shortTitle": "short Title"
            }]
        },
        {
            testDescription: "withAtLeastOneUsedParam enabled, sap- parameter provided, and inbound with two parameters (others allowed) provided",
            aInbounds: [
                oTestInbounds.twoDefaultParametersAdditionalAllowed, // has P1 and P2 params
                oTestInbounds.threeDefaultParametersAdditionalAllowed // has P1, P2, P3 params
            ],
            aCallArgs: [{
                // if CrossApplicationNavigation#getLinks was called, the
                // presence of action is guaranteed.
                action: undefined,
                withAtLeastOneUsedParam: true,
                params: {
                    "sap-param": ["OURV1"] // sap- params don't count
                }
            }],
            expectedResult: []
        },
        {
            testDescription: "semantic object and tech hint GUI as filter provided",
            aInbounds: [
                oTestInbounds.noParamsAdditionalAllowed,
                oTestInbounds.requiredParamWithDefaultRenamed,
                oTestInbounds.appWithUI5,
                oTestInbounds.appWithWDA
            ],
            aCallArgs: [{
                // if CrossApplicationNavigation#getLinks was called, the
                // presence of action is guaranteed.
                action: undefined,
                semanticObject: "PickTechnology",
                treatTechHintAsFilter: false,
                params: {
                    "sap-ui-tech-hint": ["GUI"]
                }
            }],
            expectedResult: [{
                "intent": "#PickTechnology-pickTech?sap-ui-tech-hint=GUI",
                "text": "Pick Technology (UI5)",
                "icon": "Pick Technology (UI5) icon",
                "subTitle": "sub Title",
                "shortTitle": "short Title"
            }]
        },
        {
            testDescription: "semantic object and tech hint as filter WDA provided",
            aInbounds: [
                oTestInbounds.noParamsAdditionalAllowed,
                oTestInbounds.requiredParamWithDefaultRenamed,
                oTestInbounds.noParamsAllowed,
                oTestInbounds.ignoredParamsAndDefaultParameter,
                oTestInbounds.appWithUI5,
                oTestInbounds.appWithWDA
            ],
            aCallArgs: [{
                // if CrossApplicationNavigation#getLinks was called, the
                // presence of action is guaranteed.
                action: undefined,
                semanticObject: "PickTechnology",
                treatTechHintAsFilter: true,
                params: {
                    "sap-ui-tech-hint": ["WDA"]
                }
            }],
            expectedResult: [{
                "intent": "#PickTechnology-pickTech?sap-ui-tech-hint=WDA",
                "text": "Pick Technology (WDA)",
                "icon": "Pick Technology (WDA) icon",
                "subTitle": "sub Title",
                "shortTitle": "short Title"
            }]
        },
        {
            testDescription: "semantic object and tech hint treatTechHintAsFilter GUI (not present)",
            aInbounds: [
                oTestInbounds.noParamsAdditionalAllowed,
                oTestInbounds.requiredParamWithDefaultRenamed,
                oTestInbounds.noParamsAllowed,
                oTestInbounds.ignoredParamsAndDefaultParameter,
                oTestInbounds.appWithUI5,
                oTestInbounds.appWithWDA
            ],
            aCallArgs: [{
                // if CrossApplicationNavigation#getLinks was called, the
                // presence of action is guaranteed.
                action: undefined,
                semanticObject: "PickTechnology",
                treatTechHintAsFilter: true,
                params: {
                    "sap-ui-tech-hint": ["GUI"]
                }
            }],
            expectedResult: [
            ]
        },
        {
            testDescription: "semantic object and tech hint treatTechHintAsFilter GUI (not present)",
            aInbounds: [
                oTestInbounds.noParamsAdditionalAllowed,
                oTestInbounds.requiredParamWithDefaultRenamed,
                oTestInbounds.noParamsAllowed,
                oTestInbounds.ignoredParamsAndDefaultParameter,
                oTestInbounds.appWithUI5,
                oTestInbounds.appWithWDA
            ],
            aCallArgs: [{
                // if CrossApplicationNavigation#getLinks was called, the
                // presence of action is guaranteed.
                action: undefined,
                semanticObject: "PickTechnology",
                params: {
                    "sap-ui-tech-hint": ["GUI"]
                }
            }],
            expectedResult: [{
                "intent": "#PickTechnology-pickTech?sap-ui-tech-hint=GUI",
                "text": "Pick Technology (UI5)",
                "icon": "Pick Technology (UI5) icon",
                "subTitle": "sub Title",
                "shortTitle": "short Title"
            }]
        },
        {
            testDescription: "2 'superior' tags are specified",
            aInbounds: [
                oTestHelper.createInbound("#SO-act1{<no params><o>}"),
                oTestHelper.createInbound("#SO-act2{[sap-tag:[superior]]<o>}"),
                oTestHelper.createInbound("#SO-act3{[sap-tag:[tag-B]]<o>}"), {
                    "semanticObject": "SO",
                    "action": "act4",
                    "signature": {
                        "parameters": {
                            "sap-tag": {
                                "defaultValue": {
                                    "value": "superior"
                                },
                                "required": false
                            }
                        },
                        "additionalParameters": "ignored"
                    }
                }
            ],
            aCallArgs: [ {
                    semanticObject: "SO",
                    params: { },
                    tags: [ "superior" ]
                } ],
            expectedResult: [
                {
                    intent: "#SO-act2",
                    text: undefined,
                    tags: ["superior"]
                },
                {
                    intent: "#SO-act4",
                    text: undefined,
                    tags: ["superior"]
                }
            ]
        },
        {
            // at the moment we don't support multiple tags, we may do in the future.
            testDescription: "'superior,something' is specified",
            aInbounds: [
                {
                    "semanticObject": "SO",
                    "action": "act4",
                    "signature": {
                        "parameters": {
                            "sap-tag": {
                                "defaultValue": {
                                    "value": "superior,superior"
                                },
                                "required": false
                            }
                        },
                        "additionalParameters": "ignored"
                    }
                }
            ],
            aCallArgs: [ {
                    semanticObject: "SO",
                    params: { },
                    tags: [ "superior" ]
                } ],
            expectedResult: [ ]
        },
        {
            // at the moment we don't support multiple tags, we may do in the future.
            testDescription: "'superior,something' is specified",
            aInbounds: [
                oTestHelper.createInbound("#SO-act1{<no params><o>}"),
                oTestHelper.createInbound("#SO-act2{sap-tag:superior<o>}"), {
                    "semanticObject": "SO",
                    "action": "act4",
                    "signature": {
                        "parameters": {
                            "sap-tag": {
                                "filter": {
                                    "value": "superior"
                                },
                                "required": false
                            }
                        },
                        "additionalParameters": "ignored"
                    }
                }
            ],
            aCallArgs: [ {
                    semanticObject: "SO",
                    params: { },
                    tags: [ "superior" ]
                } ],
            expectedResult: [ ]
        },
        {
            testDescription: "'required' parameter requested",
            aInbounds: [
                oTestHelper.createInbound("#Object-action{[p1:v1]<o>}") // p1 is a default parameter.
            ],
            aCallArgs: [{
                semanticObject: "Object",
                params: {
                    p1: "v1"
                },
                paramsOptions: [
                    { name: "p1", options: { required: true } }
                ]
            }],
            expectedResult: [] // ... therefore no results are returned
        },
        {
            testDescription: "'required' parameter requested, but matching target exists",
            aInbounds: [
                oTestHelper.createInbound("#Object-action{<no params><+>}", null, { title: "A" }), // matches
                oTestHelper.createInbound("#Object-action{[p1:[v1]<+>]}", null, { title: "B" }) // matches with higher priority
            ],
            aCallArgs: [{
                semanticObject: "Object",
                params: {
                    p1: "v1"
                },
                paramsOptions: [
                    { name: "p1", options: { required: true } }
                ]
            }],
            // ... B would match if the 'required' option was not
            // specified, but we expect nothing is returned in this case.
            //
            // Explanation: suppose inbound "A" is returned.
            //
            // The returned link would look like:
            // {
            //   text: "A",
            //   intent: "#Object-action?p1=v1"
            // }
            //
            // 1. now user sees a link that has a label "A" on the UI
            //    (e.g., in a smart table control).
            // 2. User clicks on the "A" link
            // 3. CSTR#getMatchingTargets matches target "B"
            // 4. User is navigated to "B" instead of "A" as expected
            //
            expectedResult: []
        }
    ].forEach(function (oFixture) {
        asyncTest("getLinks works as expected when " + oFixture.testDescription, function () {
            var oSrvc = createService({
                    inbounds: oFixture.aInbounds
                }),
                oAllowedRequireServices = {
                    URLParsing: true
                };

            var fnGetServiceOrig = sap.ushell.Container.getService;
            sinon.stub(sap.ushell.Container, "getService", function (sName) {
                if (!oAllowedRequireServices[sName]) {
                    ok(false, "Test is not accessing " + sName);
                }
                return fnGetServiceOrig.bind(sap.ushell.Container)(sName);
            });

            oSrvc.getLinks.apply(oSrvc, oFixture.aCallArgs)
                .done(function (aSemanticObjectLinks) {
                    ok(true, "promise is resolved");

                    deepEqual(aSemanticObjectLinks, oFixture.expectedResult,
                        "obtained the expected result");
                })
                .fail(function (sErrorMessage) {
                    ok(false, "promise is resolved without " + sErrorMessage);

                })
                .always(function () {
                    start();
                });
        });
    });

})();

    [
        {
            testDescription: "3 Semantic objects in inbounds",
            aSemanticObjectsInInbounds: [
                "Action", "Shell", "Object"
            ],
            expectedResult: [
                "Action", "Object", "Shell" // returned in lexicographical order
            ]
        },
        {
            testDescription: "wildcard semantic object in inbounds",
            aSemanticObjectsInInbounds: [
                "Action", "*", "Shell", "Object"
            ],
            expectedResult: [
                "Action", "Object", "Shell" // "*" is ignored
            ]
        },
        {
            testDescription: "empty list of semantic objects is provided",
            aSemanticObjectsInInbounds: [],
            expectedResult: []
        },
        {
            testDescription: "undefined semantic object and empty semantic objects",
            aSemanticObjectsInInbounds: [undefined, ""],
            expectedResult: []
        },
        {
            testDescription: "duplicated semantic object in inbounds",
            aSemanticObjectsInInbounds: ["Shell", "Dup", "action", "Dup"],
            expectedResult: ["Dup", "Shell", "action"]
        }
    ].forEach(function (oFixture) {
        asyncTest("getDistinctSemanticObjects returns the expected result when " + oFixture.testDescription, function () {
            // Arrange
            var aInbounds = oFixture.aSemanticObjectsInInbounds.map(function (sSemanticObject) {
                return {
                    semanticObject: sSemanticObject,
                    action: "dummyAction"
                };
            });

            var oSrvc = createService({
                inbounds: aInbounds
            });

            // Act
            oSrvc.getDistinctSemanticObjects()
                .done(function (aSemanticObjectsGot) {
                    ok(true, "promise was resolved");

                    deepEqual(aSemanticObjectsGot, oFixture.expectedResult,
                        "the expected list of semantic objects was returned");
                })
                .fail(function (sMsg) {
                    ok(false, "promise was resolved");
                })
                .always(function () {
                    start();
                });
        });
    });
    asyncTest("getDistinctSemanticObjects behave as expected when getInbounds fails", function () {
        // Arrange
        var oFakeAdapter = {
                getInbounds: function () {
                    return new jQuery.Deferred().reject("Deliberate Error").promise();
                }
            },
            oSrvc = createService({
                adapter: oFakeAdapter
            });

        sinon.stub(jQuery.sap.log, "error");
        sinon.stub(jQuery.sap.log, "warning");

        // Act
        oSrvc.getDistinctSemanticObjects()
            .done(function () {
                ok(false, "promise was rejected");
            })
            .fail(function (sErrorMessageGot) {
                ok(true, "promise was rejected");
                strictEqual(sErrorMessageGot, "Deliberate Error",
                    "expected error message was returned");

                strictEqual(
                    jQuery.sap.log.error.getCalls().length,
                    0,
                    "jQuery.sap.log.error was called 0 times"
                );

                strictEqual(
                    jQuery.sap.log.warning.getCalls().length,
                    0,
                    "jQuery.sap.log.warning was called 0 times"
                );
            })
            .always(function () {
                start();
            });
    });

    [
        {
            testDescription: "matching UI5 url with sap-system and other parameters specified in intent (additionalParameters: ignored)",
            intent: "Action-action1?sap-system=NOTRELEVANT&paramName1=pv1",
            sCurrentFormFactor: "desktop",
            oMockedMatchingTarget: {
               // ignore certain fields not needed for the test
               "matches": true,
               "resolutionResult": { },
               "defaultedParamNames": ["P2"],
               "intentParamsPlusAllDefaults": {
                   "P1": ["PV1", "PV2"],
                   "P2": ["1000"],
                   "sap-system": ["AX1"]
               },
               "inbound": {
                   "title": "Currency manager (this one)",
                   "semanticObject": "Action",
                   "action": "action1",
                   "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                   "resolutionResult": {
                       "additionalInformation": "SAPUI5.Component=Currency.Component",
                       "applicationType": "SAPUI5",
                       "text": "Currency manager (ignored )", // ignored
                       "ui5ComponentName": "Currency.Component",
                       "url": "/url/to/currency"
                   },
                   "signature": {
                       "additionalParameters": "ignored",
                       "parameters": {
                           "P2": {
                               "required": false,
                               "renameTo": "P3",
                               "defaultValue": { value: "DefaultValue" }
                           }
                       }
                   }
               }
            },
            expectedResolutionResult: {
                "additionalInformation": "SAPUI5.Component=Currency.Component",
                "applicationType": "SAPUI5",
                "text": "Currency manager (this one)",
                "ui5ComponentName": "Currency.Component",
                "sap-system": "AX1",
                "url": "/url/to/currency?P1=PV1&P1=PV2&P3=1000&sap-system=AX1&sap-ushell-defaultedParameterNames=%5B%22P3%22%5D",
                "reservedParameters": {},
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
            }
        },
        {
            testDescription: "resolving local WDA url",
            intent: "Action-action1?paramName1=pv1",
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            oMockedMatchingTarget: {
               // ignore certain fields not needed for the test
               "matches": true,
               "resolutionResult": { },
               "defaultedParamNames": ["P2"],
               "intentParamsPlusAllDefaults": {
                   "P1": ["PV1", "PV2"],
                   "P2": ["1000"]
               },
               "inbound": {
                   "title": "Currency manager (this one)",
                   "semanticObject": "Action",
                   "action": "action1",
                   "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                   "resolutionResult": {
                       "additionalInformation": "",
                       "applicationType": "WDA",
                       "text": "Currency manager (ignored text)", // ignored
                       "ui5ComponentName": "Currency.Component",
                       "url": "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN"
                   },
                   "signature": {
                       "additionalParameters": "ignored",
                       "parameters": {
                           "P2": {
                               "renameTo": "P3",
                               "required": true
                           }
                       }
                   }
               }
            },
            expectedResolutionResult: {
                "additionalInformation": "",
                "applicationType": "NWBC",
                "reservedParameters": {},
                "sap-system": undefined,
                "text": "Currency manager (this one)",
                "url": "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN&P1=PV1&P1=PV2&P3=1000&sap-ushell-defaultedParameterNames=%5B%22P3%22%5D",
                "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
             }
        },
        {
            testDescription: "resolving local WDA url with sap-system",
            intent: "Action-action1?sap-system=NOTRELEVANT&paramName1=pv1",
            bIgnoreFormFactor: true,
            sCurrentFormFactor: "desktop",
            oMockedMatchingTarget: {
               // ignore certain fields not needed for the test
               "matches": true,
               "resolutionResult": {
                   "text": "Some WDA"
               },
               "defaultedParamNames": ["P2"],
               "intentParamsPlusAllDefaults": {
                   "P1": ["PV1", "PV2"],
                   "P4": { },
                   "P2": ["1000"],
                   "sap-system": ["AX1"]
               },
               "inbound": {
                   "semanticObject": "Action",
                   "action": "action1",
                   "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                   "resolutionResult": {
                       "additionalInformation": "",
                       "applicationType": "WDA",
                       "text": "Currency manager (ignored text)", // ignored
                       "ui5ComponentName": "Currency.Component",
                       "url": "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN"
                   },
                   "signature": {
                       "additionalParameters": "ignored",
                       "parameters": {
                           "P2": {
                               "renameTo": "P3",
                               "required": true
                           }
                       }
                   }
               }
            },
            expectedResolutionResult: {
                "text": "Some WDA",
                // NOTE: the UNMAPPED paramter list!
                "url": "fallback :-({P1:[PV1,PV2],P2:[1000],sap-system:[AX1],sap-ushell-defaultedParameterNames:[[P3]]}"
             }
        }
    ].forEach(function (oFixture) {
        asyncTest("resolveHashFragment postprocessing when " + oFixture.testDescription, function () {

            var oFakeAdapter = {
                getInbounds: sinon.stub().returns(
                    new jQuery.Deferred().resolve([]).promise()
                ),
                resolveHashFragmentFallback: function (oIntent, oMatchingTarget, oParameters) {
                    return new jQuery.Deferred().resolve({ url: "fallback :-(" + JSON.stringify(oParameters).replace(/["]/g, "").replace(/\\/g, "") }).promise();
                }
            };

            var oSrvc = new ClientSideTargetResolution(oFakeAdapter, null, null, {});

            // Mock form factor
            sinon.stub(utils, "getFormFactor").returns(oFixture.sCurrentFormFactor);

            // Mock getMatchingInbounds
            sinon.stub(oSrvc, "_getMatchingInbounds").returns(
                new jQuery.Deferred().resolve([oFixture.oMockedMatchingTarget]).promise()
            );

            // Act
            oSrvc.resolveHashFragment(oFixture.intent)
                .done(function (oResolutionResult) {
                    // Assert
                    ok(true, "promise was resolved");
                    deepEqual(oResolutionResult, oFixture.expectedResolutionResult, "got expected resolution result");
                })
                .fail(function () {
                    // Assert
                    ok(false, "promise was resolved");
                })
                .always(function () {
                    start();
                });

        });
    });

    [
     {
         testDescription: "ui5 parameter mapping with appState and defaulting",
         intent: "Action-action1?sap-system=NOTRELEVANT&paramName1=pv1",
         sCurrentFormFactor: "desktop",
         oMockedMatchingTarget: {
            // ignore certain fields not needed for the test
            "matches": true,
            "resolutionResult": { },
            "defaultedParamNames": ["P2", "P3", "P4", "P5"],
            "intentParamsPlusAllDefaults": {
                "P1": ["PV1", "PV2"],
                "P2": ["1000"],
                "P3": { "ranges": { option: "EQ", low: "1000" } },
                "P4": { "ranges": { option: "EQ", low: "notusedbecauseP2" } },
                "P5": { "ranges": { option: "EQ", low: "1000" } },
                "P9": ["PV9"],
                "sap-system": ["AX1"]
            },
            "inAppState": {
                "selectionVariant": {
                    "Parameter": [ { "PropertyName": "P6", "PropertyValue": "0815" },
                                    { "PropertyName": "P8", "PropertyValue": "0815" } ],
                    "selectOptions": [
                    {
                        "PropertyName": "P7",
                        "Ranges": [
                                   {
                                         "Sign": "I",
                                                          "Option": "EQ",
                                                          "Low": "INT",
                                                          "High": null
                                    }
                                    ]
                    }]
                }
            },
            "inbound": {
                "title": "Currency manager (this one)",
                "semanticObject": "Action",
                "action": "action1",
                "permanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS",
                "resolutionResult": {
                    "additionalInformation": "SAPUI5.Component=Currency.Component",
                    "applicationType": "SAPUI5",
                    "text": "Currency manager (ignored )", // ignored
                    "ui5ComponentName": "Currency.Component",
                    "url": "/url/to/currency"
                },
                "signature": {
                    "additionalParameters": "ignored",
                    "parameters": {
                        "P1": { "renameTo": "PX" },
                        "P2": { "renameTo": "P4" },
                        "P5": { "renameTo": "PX"},
                        "P6C": { "renameTo": "PC"},
                        "P6": { "renameTo": "P6New"},
                        "P7": { "renameTo": "P6New"},
                        "P8": { "renameTo": "P8New"},
                        "P9": { "renameTo": "PX"}
                    }
                }
            }
         },
         expectedResolutionResult: {
             "additionalInformation": "SAPUI5.Component=Currency.Component",
             "applicationType": "SAPUI5",
             "text": "Currency manager (this one)",
             "ui5ComponentName": "Currency.Component",
             "sap-system": "AX1",
             "url": "/url/to/currency?P4=1000&PX=PV1&PX=PV2&sap-system=AX1&sap-ushell-defaultedParameterNames=%5B%22P4%22%5D",
             "reservedParameters": {},
             "inboundPermanentKey": "X-SAP-UI2-CATALOGPAGE:Z_UI2_TEST:ET090M0NO76W68G7TEBEFZOSS"
         }
     }
 ].forEach(function (oFixture) {
     asyncTest("resolveHashFragment with appstate merging " + oFixture.testDescription, function () {

         var oFakeAdapter = {
             getInbounds: sinon.stub().returns(
                 new jQuery.Deferred().resolve([]).promise()
             ),
             resolveHashFragmentFallback: function (oIntent, oMatchingTarget, oParameters) {
                 return new jQuery.Deferred().resolve({ url: "fallback :-(" + JSON.stringify(oParameters).replace(/["]/g, "").replace(/\\/g, "") }).promise();
             }
         };

         var oSrvc = new ClientSideTargetResolution(oFakeAdapter, null, null, {});

         // Mock form factor
         sinon.stub(utils, "getFormFactor").returns(oFixture.sCurrentFormFactor);

         // Mock getMatchingInbounds
         sinon.stub(oSrvc, "_getMatchingInbounds").returns(
             new jQuery.Deferred().resolve([oFixture.oMockedMatchingTarget]).promise()
         );

         // Act
         oSrvc.resolveHashFragment(oFixture.intent)
             .done(function (oResolutionResult) {
                 // Assert
                 ok(true, "promise was resolved");
                 deepEqual(oResolutionResult, oFixture.expectedResolutionResult, "got expected resolution result");
             })
             .fail(function () {
                 // Assert
                 ok(false, "promise was resolved");
             })
             .always(function () {
                 start();
             });

     });
 });



    [
        {
            testDescription: "form factor is not ignored",
            sSemanticObject: "Object",
            bIgnoreFormFactor: false,
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            expectedGetMatchingTargetsIntent: {
                "action": undefined,
                "formFactor": "mobile",
                "params": {},
                "semanticObject": "Object"
            }
        },
        {
            testDescription: "form factor is ignored",
            sSemanticObject: "Object",
            bIgnoreFormFactor: true,
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            expectedGetMatchingTargetsIntent: {
                "action": undefined,
                "formFactor": undefined,
                "params": {},
                "semanticObject": "Object"
            }
        },
        {
            testDescription: "parameters are specified",
            sSemanticObject: "Object",
            bIgnoreFormFactor: true,
            mBusinessParams: {
                "p1": ["v1"],
                "p2": ["v3", "v2"]
            },
            sCurrentFormFactor: "mobile",
            expectedGetMatchingTargetsIntent: {
                "action": undefined,
                "formFactor": undefined,
                "params": {
                    "p1": ["v1"],
                    "p2": ["v3", "v2"]
                },
                "semanticObject": "Object"
            }
        },
        {
            testDescription: "semantic object is the empty string",
            sSemanticObject: "",
            bIgnoreFormFactor: false,
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            expectedGetMatchingTargetsIntent: {
                "action": undefined,
                "formFactor": "mobile",
                "semanticObject": undefined,
                "params": {}
            }
        }
    ].forEach(function (oFixture) {

        asyncTest("getLinks: calls _getMatchingInbounds with expected shell hash when " + oFixture.testDescription, function () {

            var oSrvc = createService();

            // Mock form factor
            sinon.stub(utils, "getFormFactor").returns(oFixture.sCurrentFormFactor);

            // Mock getMatchingInbounds
            sinon.stub(oSrvc, "_getMatchingInbounds").returns(
                new jQuery.Deferred().resolve([]).promise()
            );

            // Act
            oSrvc.getLinks(oFixture.sSemanticObject, oFixture.mBusinessParams, oFixture.bIgnoreFormFactor)
                .done(function (aResultSemanticObjectLinks) {
                    // Assert
                    ok(true, "promise was resolved");
                    deepEqual(oSrvc._getMatchingInbounds.getCall(0).args[0], oFixture.expectedGetMatchingTargetsIntent,
                        "_getMatchingInbounds was called with expected intent object");
                })
                .fail(function () {
                    // Assert
                    ok(false, "promise was resolved");
                })
                .always(function () {
                    start();
                });

        });
    });

    [
        {
            testDescription: "semantic object is a number (nominal parameters)",
            sSemanticObject: 128,
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            bUseNominalParameters: true,
            sExpectedErrorMessage: "invalid semantic object",
            sExpectedErrorDetailsPart: "got [object Number] instead"
        },
        {
            testDescription: "semantic object is {} (nominal parameters)",
            sSemanticObject: {},
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            bUseNominalParameters: true,
            sExpectedErrorMessage: "invalid semantic object",
            sExpectedErrorDetailsPart: "got [object Object] instead"
        },
        {
            testDescription: "semantic object is [] (nominal parameters)",
            sSemanticObject: [],
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            bUseNominalParameters: true,
            sExpectedErrorMessage: "invalid semantic object",
            sExpectedErrorDetailsPart: "got [object Array] instead"
        },
        {
            testDescription: "action is not a string (nominal parameters)",
            sSemanticObject: "Object",
            sAction: false,
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            bUseNominalParameters: true,
            sExpectedErrorMessage: "invalid action",
            sExpectedErrorDetailsPart: "the action must be a string"
        },
        {
            testDescription: "action is not a string (nominal parameters)",
            sSemanticObject: "Object",
            sAction: "",
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            bUseNominalParameters: true,
            sExpectedErrorMessage: "invalid action",
            sExpectedErrorDetailsPart: "the action must not be an empty string"
        },
        {
            testDescription: "semantic object is undefined",
            sSemanticObject: undefined,
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            bUseNominalParameters: false,
            sExpectedErrorMessage: "invalid semantic object",
            sExpectedErrorDetailsPart: "got [object Undefined] instead"
        },
        {
            testDescription: "semantic object is a number",
            sSemanticObject: 128,
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            bUseNominalParameters: false,
            sExpectedErrorMessage: "invalid semantic object",
            sExpectedErrorDetailsPart: "got [object Number] instead"
        },
        {
            testDescription: "semantic object is {}",
            sSemanticObject: {},
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            bUseNominalParameters: false,
            sExpectedErrorMessage: "invalid semantic object",
            sExpectedErrorDetailsPart: "got [object Object] instead"
        },
        {
            testDescription: "semantic object is []",
            sSemanticObject: [],
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            bUseNominalParameters: false,
            sExpectedErrorMessage: "invalid semantic object",
            sExpectedErrorDetailsPart: "got [object Array] instead"
        },
        {
            testDescription: "semantic object is blank",
            sSemanticObject: " ",
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            bUseNominalParameters: false,
            sExpectedErrorMessage: "invalid semantic object",
            sExpectedErrorDetailsPart: "got ' ' instead"
        },
        {
            testDescription: "semantic object is many blanks",
            sSemanticObject: "    ",
            mBusinessParams: {},
            sCurrentFormFactor: "mobile",
            bUseNominalParameters: false,
            sExpectedErrorMessage: "invalid semantic object",
            sExpectedErrorDetailsPart: "got '    ' instead"
        }
    ].forEach(function (oFixture) {
        asyncTest("getLinks: logs an error and rejects promise when " + oFixture.testDescription, function () {

            var oSrvc = createService();

            sinon.stub(jQuery.sap.log, "error");

            // Mock form factor
            sinon.stub(utils, "getFormFactor").returns(oFixture.sCurrentFormFactor);

            // Mock getMatchingInbounds
            sinon.stub(oSrvc, "_getMatchingInbounds").returns(
                new jQuery.Deferred().resolve([]).promise()
            );

            // Act
            var fnGetSemanticObjectLinksBound = oSrvc.getLinks.bind(oSrvc, oFixture.sSemanticObject, oFixture.mBusinessParams);
            if (oFixture.bUseNominalParameters) {
                fnGetSemanticObjectLinksBound = oSrvc.getLinks.bind(oSrvc, {
                    semanticObject: oFixture.sSemanticObject,
                    action: oFixture.sAction,
                    params: oFixture.oParams
                });
            }
            fnGetSemanticObjectLinksBound()
                .done(function (aResultSemanticObjectLinks) {
                    // Assert
                    ok(false, "promise was rejected");
                })
                .fail(function (sErrorMessage) {
                    // Assert
                    ok(true, "promise was rejected");
                    strictEqual(sErrorMessage, oFixture.sExpectedErrorMessage, "rejected with expected error message");
                    strictEqual(jQuery.sap.log.error.getCalls().length, 1, "jQuery.sap.log.error was called once");
                    strictEqual(jQuery.sap.log.error.getCall(0).args[0], "invalid input for _getLinks", "expected error title was logged");
                    ok(jQuery.sap.log.error.getCall(0).args[1].indexOf(oFixture.sExpectedErrorDetailsPart) >= 0, oFixture.sExpectedErrorDetailsPart + " was found in logged error details");
                    strictEqual(jQuery.sap.log.error.getCall(0).args[2], "sap.ushell.services.ClientSideTargetResolution", "error contains sap.ushell.services.ClientSideTargetResolution");
                })
                .always(function () {
                    start();
                });

        });

    });

    [
     {
         testLogLevel: [I_DEBUG],
         sSemanticObject: "Object",
         mBusinessParams: { "country": ["IT"] },
         bIgnoreFormFactor: true,
         sCurrentFormFactor: "desktop",
         aMockedResolutionResults: [
             {
                "matches": true,
                "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                "inbound": {
                    "title": "Currency manager",
                    "icon": "sap-icon://Fiori2/F0018",
                    "subTitle": "sub Title",
                    "shortTitle": "short Title",
                    "semanticObject": "Object",
"action": "bbb",
                    "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                    "signature": { "parameters": {
                     "country": {
                         required: true
                     }
                   }}
                }
             },
             {
                "matches": true,
                "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                "inbound": {
                    "title": "Currency manager",
                    "subTitle": "sub Title",
                    "shortTitle": "short Title",
                    "icon": "sap-icon://Fiori2/F0018",
                    "semanticObject": "Object",
"action": "ccc",
                    "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                    "signature": { "parameters": { }, "additionalParameters": "ignored" }
                }
             }
         ],
         expectedSemanticObjectLinks: [
             { "intent": "#Object-bbb?country=IT",
                 "text": "Currency manager",
                 "icon": "sap-icon://Fiori2/F0018",
                 "subTitle": "sub Title",
                 "shortTitle": "short Title" },
             { "intent": "#Object-ccc",
                 "text": "Currency manager",
                 "icon": "sap-icon://Fiori2/F0018",
                 "subTitle": "sub Title",
                 "shortTitle": "short Title" }
         ],
         expectedLogArgs: [
             "_getLinks filtered to unique intents.",
             /Reporting histogram:(.|\n)*#Object-bbb(.|\n)*#Object-ccc/,
             "sap.ushell.services.ClientSideTargetResolution"
         ]
     },
     {
         testLogLevel: [I_TRACE],
         sSemanticObject: "Object",
         mBusinessParams: { "country": ["IT"] },
         bIgnoreFormFactor: true,
         sCurrentFormFactor: "desktop",
         aMockedResolutionResults: [
             {
                "matches": true,
                "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                "inbound": {
                    "title": "Currency manager",
                    "subTitle": "sub Title",
                    "shortTitle": "short Title",
                    "icon": "sap-icon://Fiori2/F0018",
                    "semanticObject": "Object",
"action": "bbb",
                    "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                    "signature": { "parameters": {
                     "country": {
                         required: true
                     }
                   }}
                }
             },
             {
                "matches": true,
                "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency?mode=desktop" },
                "inbound": {
                    "title": "Currency manager",
                    "subTitle": "sub Title",
                    "shortTitle": "short Title",
                    "icon": "sap-icon://Fiori2/F0018",
                    "semanticObject": "Object",
"action": "ccc",
                    "resolutionResult": { "additionalInformation": "SAPUI5.Component=Currency.Component", "applicationType": "URL", "text": "Currency manager (ignored text)", "ui5ComponentName": "Currency.Component", "url": "/url/to/currency" },
                    "signature": { "parameters": { }, "additionalParameters": "ignored" }
                }
             }
         ],
         expectedSemanticObjectLinks: [
              { "intent": "#Object-bbb?country=IT",
                  "text": "Currency manager",
                  "icon": "sap-icon://Fiori2/F0018",
                  "subTitle": "sub Title",
                  "shortTitle": "short Title" },
              { "intent": "#Object-ccc",
                  "text": "Currency manager",
                  "icon": "sap-icon://Fiori2/F0018",
                  "subTitle": "sub Title",
                  "shortTitle": "short Title"}
         ],
         expectedLogArgs: [
             "_getLinks filtered to the following unique intents:",
             /(.|\n)*#Object-bbb.*country=IT(.|\n)*#Object-ccc.*/,
             "sap.ushell.services.ClientSideTargetResolution"
         ]
     }
    ].forEach(function (oFixture) {
        asyncTest("getLinks: correctly logs resulting intents in log level " + oFixture.testLogLevel, function () {
            var oSrvc = createService(),
                oLogMock = testUtils.createLogMock().sloppy(true);

            // Check logging expectations via LogMock
            oLogMock.debug.apply(oLogMock, oFixture.expectedLogArgs);

            // LogMock doesn't keep the following original methods
            jQuery.sap.log.getLevel = sinon.stub().returns(oFixture.testLogLevel);
            jQuery.sap.log.Level = {
                DEBUG: I_DEBUG,
                TRACE: I_TRACE
            };

            // Mock form factor
            sinon.stub(utils, "getFormFactor").returns(oFixture.sCurrentFormFactor);

            // Mock getMatchingInbounds
            sinon.stub(oSrvc, "_getMatchingInbounds").returns(
                new jQuery.Deferred().resolve(oFixture.aMockedResolutionResults).promise()
            );

            // Act
            oSrvc.getLinks(oFixture.sSemanticObject, oFixture.mBusinessParams, oFixture.bIgnoreFormFactor)
                .done(function (aResultSemanticObjectLinks) {
                    start();

                    // Assert
                    ok(true, "promise was resolved");
                    deepEqual(aResultSemanticObjectLinks, oFixture.expectedSemanticObjectLinks, "got expected array of semantic object links");
                    oLogMock.verify();
                })
                .fail(function () {
                    start();

                    // Assert
                    ok(false, "promise was resolved");
                });
        });
    });

    [
        {
            testDescription: "semantic object/actions are both passed",
            sCurrentFormFactor: "phone",
            sIntent: "#Object-action",
            oResolve: [{}],
            expectedResult: true,
            expectedGetMatchingTargetsIntent: {
                "semanticObject": "Object",
                "action": "action",
                "formFactor": "phone",
                "appSpecificRoute": undefined,
                "contextRaw": undefined,
                "params": {}
            }
        },
        {
            testDescription: "Parameters are passed",
            sCurrentFormFactor: "phone",
            sIntent: "#Object-action?p1=v1&p2=v2",
            oResolve: [],
            expectedResult: false,
            expectedGetMatchingTargetsIntent: {
                "semanticObject": "Object",
                "action": "action",
                "formFactor": "phone",
                "params": {
                    "p1": [ "v1" ],
                    "p2": [ "v2" ]
                },
                "appSpecificRoute": undefined,
                "contextRaw": undefined
            }
        },
        {
            testDescription: " emtpy hash is processed",
            sCurrentFormFactor: "phone",
            sIntent: "#",
            oResolve: [],
            expectedResult: true,
            expectedGetMatchingTargetsIntent: undefined
        }
    ].forEach(function (oFixture) {
        function prepareTest () {
            var oSrvc = createService();

            sinon.stub(utils, "getFormFactor").returns(oFixture.sCurrentFormFactor);

            sinon.stub(oSrvc, "_getMatchingInbounds").returns(
                new jQuery.Deferred().resolve(oFixture.oResolve).promise()
            );

            return oSrvc;
        }

        asyncTest("_isIntentSupportedOne: calls _getMatchingInbounds with the expected shell hash when " + oFixture.testDescription, function () {
            var oSrvc = prepareTest();

            // Act
            oSrvc._isIntentSupportedOne(oFixture.sIntent).done(function (oResult) {
                ok(true, "promise was resolved");
                equal(oResult, oFixture.expectedResult, "result ok");
                if (oFixture.expectedGetMatchingTargetsIntent) {
                    deepEqual(oSrvc._getMatchingInbounds.getCall(0).args[0], oFixture.expectedGetMatchingTargetsIntent,
                    "_getMatchingInbounds was called with the expected shell hash");
                } else {
                    equal(oSrvc._getMatchingInbounds.called, false, " _getMatchingInbounds not called!");
                }
            }).fail(function () {
                ok(false, "promise was resolved");
            }).always(function () {
                start();
            });
        });

        asyncTest("_isIntentSupportedOne: calls _getMatchingInbounds with the expected bExcludeTileInbounds argument when " + oFixture.testDescription, function () {
            var oSrvc = prepareTest();

            // Act
            oSrvc._isIntentSupportedOne(oFixture.sIntent).done(function (oResult) {
                ok(true, "promise was resolved");
                testExcludeTileIntentArgument(oSrvc, true);
            }).fail(function () {
                ok(false, "promise was resolved");
            }).always(function () {
                start();
            });

        });
    });

    asyncTest("resolveTileIntentInContext: works as expected when _resolveTileIntent resolves", function () {
        var oResolvedIntentExpected,
            oFakeThis,
            aFakeInbounds;

        oResolvedIntentExpected = { RESOLVED: "INTENT" };

        // Arrange
        aFakeInbounds = [{
            semanticObject: "Test",
            action: "inbound"
        }];

        oFakeThis = {
            _resolveTileIntent: sinon.stub().returns(
                new jQuery.Deferred().resolve(oResolvedIntentExpected).promise()
            )
        };

        // Act
        ClientSideTargetResolution.prototype.resolveTileIntentInContext.call(
            oFakeThis, aFakeInbounds, "#Test-inbound"
        ).done(function (oResolvedIntentGot) {
            // Assert
            ok(true, "the promise was resolved");
            deepEqual(oResolvedIntentGot, oResolvedIntentExpected,
                "promise resolved with the expected resolved intent");

            strictEqual(oFakeThis._resolveTileIntent.callCount, 1,
                "_resolveTileIntent was called once");

            var oExpectedInboundIndexArg = oFakeThis._resolveTileIntent.getCall(0).args[2];

            strictEqual(oExpectedInboundIndexArg.hasOwnProperty("index"), true,
                "third argument of _resolveTileIntent looks like an inbound index"
            );
            deepEqual(oExpectedInboundIndexArg.index.all, aFakeInbounds.concat(oTestHelper.getVirtualInbounds()),
                "the inbound index given to _resolveTileIntent includes both the inbounds in the scope and the virtual inbounds");
        }).fail(function () {
            // Assert
            ok(false, "the promise was resolved");
        }).always(function () {
            start();
        });
    });

    asyncTest("resolveTileIntentInContext: works as expected when _resolveTileIntent rejects", function () {
        var oFakeThis,
            aFakeInbounds;

        // Arrange
        aFakeInbounds = [];

        oFakeThis = {
            _resolveTileIntent: sinon.stub().returns(
                new jQuery.Deferred().reject("Something bad").promise()
            )
        };

        // Act
        ClientSideTargetResolution.prototype.resolveTileIntentInContext.call(
            oFakeThis, aFakeInbounds, "#Test-inbound"
        ).done(function () {
            ok(false, "the promise was rejected");
        }).fail(function (sError) {
            ok(true, "the promise was rejected");
            strictEqual(sError, "Something bad",
                "the promise was rejected with the expected error message");
        }).always(function () {
            start();
        });
    });

    asyncTest("_resolveTileIntent: calls _getMatchingInbounds with false bExcludeTileInbounds arguments", function () {
        var oSrvc = createService();

        sinon.stub(oSrvc, "_getURLParsing").returns({
            parseShellHash: sinon.stub().returns({ "parsed": "shellHash" })
        });
        sinon.stub(oSrvc, "_getMatchingInbounds").returns(
            new jQuery.Deferred().resolve({}, []).promise()
        );
        sinon.stub(oSrvc, "_resolveSingleMatchingTileIntent").returns(
            new jQuery.Deferred().resolve().promise()
        );


        oSrvc._resolveTileIntent("#Sample-hash", null, [])
            .done(function () {
                ok(true, "promise was resolved");
                testExcludeTileIntentArgument(oSrvc, false /* expected bExcludeTileInbounds */);
            })
            .fail(function () {
                ok(false, "promise was resolved");
            })
            .always(function () {
                start();
            });
    });

    [
        {
            testDescription: "multiple intents are given",
            aInbounds: [{
                "semanticObject": "Action",
                "action": "toappnavsample",
                "title": "Title",
                "resolutionResult": {
                    "applicationType": "SAPUI5",
                    "additionalInformation": "SAPUI5.Component=sap.ushell.demo.Inbound",
                    "text": "Text",
                    "ui5ComponentName": "sap.ushell.demo.Inbound",
                    "applicationDependencies": {
                        "name": "sap.ushell.demo.Inbound",
                        "self": {
                            "name": "sap.ushell.demo.Inbound"
                        }
                    },
                    "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample",
                    "systemAlias": ""
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": true,
                    "phone": true
                },
                "signature": {
                    "additionalParameters": "allowed",
                    "parameters": {}
                }
            }, {
                "semanticObject": "Object",
                "action": "action",
                "title": "Object action",
                "resolutionResult": {
                    "applicationType": "SAPUI5",
                    "additionalInformation": "SAPUI5.Component=sap.ushell.demo.Inbound",
                    "text": "Text",
                    "ui5ComponentName": "sap.ushell.demo.Inbound",
                    "applicationDependencies": {
                        "name": "sap.ushell.demo.Inbound",
                        "self": {
                            "name": "sap.ushell.demo.Inbound"
                        }
                    },
                    "url": "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample",
                    "systemAlias": ""
                },
                "deviceTypes": {
                    "desktop": true,
                    "tablet": true,
                    "phone": true
                },
                "signature": {
                    "additionalParameters": "notallowed",
                    "parameters": {
                        "P1": {
                            required: true
                        }
                    }
                }
            }],
            sCurrentFormFactor: "desktop",
            aIsIntentSupportedArg: [
                "#Action-toappnavsample", "#Object-action?P1=V1", "#Action-nonexisting"
            ],
            expectedResult: {
                "#Action-toappnavsample": {
                    "supported": true
                },
                "#Object-action?P1=V1": {
                    "supported": true
                },
                "#Action-nonexisting": {
                    "supported": false
                }
            }
        }
    ].forEach(function (oFixture) {
        asyncTest("isIntentSupported: works as expected when " + oFixture.testDescription, function () {
            var oSrvc = createService({
                inbounds: oFixture.aInbounds
            });

            sinon.stub(utils, "getFormFactor").returns(oFixture.sCurrentFormFactor);

            // Act
            oSrvc.isIntentSupported(oFixture.aIsIntentSupportedArg).done(function (oResult) {
                ok(true, "promise was resolved");
                deepEqual(oResult, oFixture.expectedResult, "result ok");
            }).fail(function () {
                ok(false, "promise was resolved");
            }).always(function () {
                start();
            });
        });
    });

    asyncTest("isIntentSupported rejects promise with error message when one intent is not supported", function () {
        var oSrvc = createService();

        sinon.stub(oSrvc, "_isIntentSupportedOne", function (sIntent) {
            return new jQuery.Deferred().reject(sIntent + " was rejected").promise();
        });

        oSrvc.isIntentSupported(["#Action-test1", "#Action-test2"]).done(function (oResult) {
            ok(false, "promise was rejected");
        }).fail(function (sReason) {
            ok(true, "promise was rejected");
            strictEqual(sReason, "One or more input intents contain errors: #Action-test1 was rejected, #Action-test2 was rejected");
        }).always(function () {
            start();
        });
    });


    [
        {
            testDescription: "Generic semantic object is passed",
            sCurrentFormFactor: "mobile",
            sIntent: "#*-action"
        },
        {
            testDescription: "empty semantic object is passed",
            sCurrentFormFactor: "mobile",
            sIntent: "#-action"
        },
        {
            testDescription: "* is passed in action",
            sCurrentFormFactor: "mobile",
            sIntent: "#Object-*"
        },
        {
            testDescription: "blank is passed in semantic object",
            sCurrentFormFactor: "mobile",
            sIntent: "# -*"
        },
        {
            testDescription: "many blanks are passed in semantic object",
            sCurrentFormFactor: "mobile",
            sIntent: "# -*"
        }
    ].forEach(function (oFixture) {
        asyncTest("_isIntentSupportedOne: rejects promise when " + oFixture.testDescription, function () {
            var oSrvc = createService();
            sinon.stub(utils, "getFormFactor").returns(oFixture.sCurrentFormFactor);

            sinon.stub(oSrvc, "_getMatchingInbounds").returns(
                new jQuery.Deferred().resolve([{/*empty tm*/}]).promise()
            );

            // Act
            oSrvc._isIntentSupportedOne(oFixture.sIntent).done(function () {
                ok(false, "promise was rejected");
            }).fail(function () {
                ok(true, "promise was rejected");
            }).always(function () {
                start();
            });
        });
    });



    [
        {
            testDescription: "no parameters are specified in URL",
            oDefaultedParamNames: [],
            sResolutionResultUrl: "/some/url",
            expectedResolutionResultUrl: "/some/url" // no parameter is even added
        },
        {
            testDescription: "default parameters specified",
            oDefaultedParamNames: ["Name1", "Name2"],
            sResolutionResultUrl: "/some/url",
            expectedResolutionResultUrl: "/some/url?sap-ushell-defaultedParameterNames=%5B%22Name1%22%2C%22Name2%22%5D"
        },
        {
            testDescription: "url contains a parameter already",
            oDefaultedParamNames: ["Name2", "Name1"],
            sResolutionResultUrl: "/some/url?urlparam1=foo",
            expectedResolutionResultUrl: "/some/url?urlparam1=foo&sap-ushell-defaultedParameterNames=%5B%22Name1%22%2C%22Name2%22%5D"
        },
        {
            testDescription: "parameter names contain '&' and '?'",
            oDefaultedParamNames: ["Nam&2", "Na?me1"],
            sResolutionResultUrl: "/some/url?urlparam1=foo",
            expectedResolutionResultUrl: "/some/url?urlparam1=foo&sap-ushell-defaultedParameterNames=%5B%22Na%3Fme1%22%2C%22Nam%262%22%5D"
        }
    ].forEach(function (oFixture) {

        asyncTest("_resolveHashFragment: correctly adds sap-ushell-defaultedParameterNames when " + oFixture.testDescription, function () {
            var oSrvc = createService(),
                aFakeMatchingTargets = [{
                    defaultedParamNames: oFixture.oDefaultedParamNames,
                    resolutionResult: {
                        url: oFixture.sResolutionResultUrl
                    },
                    inbound: {
                        resolutionResult: {
                            applicationType: "SAPUI5",
                            additionalInformation: "SAPUI5.Component=com.sap.cus",
                            url: oFixture.sResolutionResultUrl
                        }
                    },
                    intentParamsPlusAllDefaults: []
                }];

            // returns the default parameter names after resolution
            sinon.stub(oSrvc, "_getMatchingInbounds").returns(
                new jQuery.Deferred().resolve(aFakeMatchingTargets).promise()
            );

            oSrvc._resolveHashFragment("SO-action")
                .done(function (oResolutionResult) {
                    ok(true, "promise was resolved");
                    strictEqual(oResolutionResult.url, oFixture.expectedResolutionResultUrl,
                        "defaulted parameter names were correctly appended to result url");
                })
                .fail(function () {
                    ok(false, "promise was resolved");
                })
                .always(function () {
                    start();
                });
        });
    });


    // parameter mapping

    asyncTest("_constructFallbackResolutionResult: logs an error when fallback function is passed as undefined", function () {
        var oSrvc = createService();

        sinon.stub(jQuery.sap.log, "error");
        sinon.stub(jQuery.sap.log, "warning");

        oSrvc._constructFallbackResolutionResult(
            { /*oMatchingTarget*/
                intentParamsPlusAllDefaults: {},
                defaultedParamNames: []
            },
            undefined /*fnBoundFallback*/,
            "#Action-toappnavsample"/*sFixedHashFragment*/
        )
        .then(function () {
            ok(false, "the promise returned by _constructFallbackResolutionResult was rejected");
        }, function (sErrorMessage) {
            var iTimesErrorCalled;
            ok(true, "the promise returned by _constructFallbackResolutionResult was rejected");

            strictEqual(sErrorMessage, "Cannot resolve hash fragment: no fallback provided.",
                "the promise was rejected with expected error message");

            // test warnings
            strictEqual(jQuery.sap.log.warning.getCalls().length, 0, "jQuery.sap.log.warning was called 0 times");

            // test error message
            iTimesErrorCalled = jQuery.sap.log.error.getCalls().length;
            strictEqual(iTimesErrorCalled, 1, "jQuery.sap.log.warning was called 1 time");
            if (iTimesErrorCalled) {
                deepEqual(jQuery.sap.log.error.getCall(0).args, [
                    "Cannot resolve hash fragment",
                    "#Action-toappnavsample has matched an inbound that cannot be resolved client side and no resolveHashFragmentFallback method was implemented in ClientSideTargetResolutionAdapter",
                    "sap.ushell.services.ClientSideTargetResolution"
                ], "the error was logged as expected");
            }
        })
        .then(start, start);
    });

    asyncTest("resolveHashFragment: allows adapter to not implement fallback method", function () {
        var oFakeAdapter = {
            getInbounds: sinon.stub().returns(
                new jQuery.Deferred().resolve([]).promise()
            )
        };

        var oSrvc = new ClientSideTargetResolution(oFakeAdapter, null, null, null);

        sinon.stub(oSrvc, "_resolveHashFragment").returns(new jQuery.Deferred().resolve({}).promise());

        try {
            oSrvc.resolveHashFragment("#Action-toappnavsample")
                .always(function () {
                    var iResolveHashFragmentCallCount = oSrvc._resolveHashFragment.getCalls().length;
                    strictEqual(iResolveHashFragmentCallCount, 1, "_resolveHashFragment was called 1 time");
                    if (iResolveHashFragmentCallCount === 1) {
                        strictEqual(typeof oSrvc._resolveHashFragment.getCall(0).args[1], "undefined", "_resolveHashFragment was called with undefined fallback function");
                    }

                    start();
                });
        } catch (oError) {
            ok(false, "resolveHashFragment did not throw an exception");
            start();
        }
    });

    asyncTest("resolveHashFragment calls _getMatchingInbounds with the expected third argument", function () {
        // Arrange
        sinon.stub(InboundProvider.prototype, "getInbounds").returns(
            new Promise(function (fnResolve) { fnResolve(); })
        );

        var oSrvc = createService(),
            sAnyHashFragment = "#Some-hashFragment";

        sinon.stub(oSrvc, "_getURLParsing").returns({
            parseShellHash: sinon.stub().returns({ "parsed": "shellHash" })
        });

        sinon.stub(oSrvc, "_getMatchingInbounds").returns(
            new jQuery.Deferred().resolve([{ semanticObject: "Some", action: "hashFragment" }]).promise()
        );
        sinon.stub(oSrvc, "_resolveSingleMatchingTarget").returns(
            new jQuery.Deferred().resolve([]).promise()
        );

        // Act
        oSrvc.resolveHashFragment(sAnyHashFragment)
            .done(function () {
                ok(true, "promise was resolved");
                testExcludeTileIntentArgument(oSrvc, true);
            })
            .fail(function () {
                ok(false, "promise was resolved");
            })
            .always(function () {
                start();
            });
    });

    //Tests for resolveHashFragment are in the _ClientSideTargetResolution/ClientSideTargetResolution.resolveHashFragment.js
    fnExecuteResolveHashFragment();

    [
        {
            testDescription: "resolveHashFragment, hasSegmentedAccess",
            // ignore certain fields not needed for the test
            intent: "Action-aliasToAbsoluteUrl?sap-system=UR3CLNT120",
            hasSegmentedAccess: true,
            oInboundFilter: [{
                semanticObject: "Action",
                action: "aliasToAbsoluteUrl"
            }]
        },
        {
            testDescription: "resolveHashFragment, config disabled",
            intent: "Action-aliasToAbsoluteUrl?sap-system=UR3CLNT120",
            hasSegmentedAccess: false,
            oInboundFilter: undefined
        }
    ].forEach(function (oFixture) {
        asyncTest("inbound filter on resolveHashFragment when " + oFixture.testDescription, function () {
            var oShellNavigationService = sap.ushell.Container.getService("ShellNavigation");
            sinon.stub(sap.ushell.Container, "getUser").returns({
                getLanguage: sinon.stub().returns("en")
            });

            sinon.spy(oShellNavigationService, "compactParams");
            var oFakeAdapter = {
                    hasSegmentedAccess: oFixture.hasSegmentedAccess,
                    resolveSystemAlias: function (sSystemAlias) {
                        var oDeferred = new jQuery.Deferred();
                        if (oFixture.oKnownSapSystemData && oFixture.oKnownSapSystemData.hasOwnProperty(sSystemAlias)) {
                            return oDeferred.resolve(oFixture.oKnownSapSystemData[sSystemAlias]).promise();
                        }
                        if (sSystemAlias === "") {
                            return oDeferred.resolve(oTestHelper.getLocalSystemAlias()).promise();
                        }
                        return oDeferred.reject("Cannot resolve system alias").promise();
                    },
                    getInbounds: sinon.stub().returns(
                        new jQuery.Deferred().resolve([oFixture.inbound]).promise()
                    ),
                    resolveHashFragmentFallback: function (oIntent, oMatchingTarget, oParameters) {
                        return new jQuery.Deferred().resolve({ url: "fallback :-(" + JSON.stringify(oParameters).replace(/["]/g, "").replace(/\\/g, "") }).promise();
                    }
                };

            var oSrvc = new ClientSideTargetResolution(oFakeAdapter, null, null, oFixture.config);
            sinon.spy(InboundProvider.prototype, "getInbounds");
            sinon.stub(oSrvc, "_resolveHashFragment").returns(new jQuery.Deferred().resolve({a: 1}).promise());
            // Act
            oSrvc.resolveHashFragment(oFixture.intent, /*fnBoundFallback*/ function () {
                ok(false, "fallback function is not called");
            })
                .done(function (oResolutionResult) {
                    ok(true, "promise was resolved");
                    deepEqual(InboundProvider.prototype.getInbounds.args[0][0], oFixture.oInboundFilter, "inbound reqeust properly filtered");
                    deepEqual(oFakeAdapter.getInbounds.args[0][0], oFixture.oInboundFilter, "inbound reqeust properly filtered");
                })
                .fail(function () {
                    // Assert
                    ok(false, "promise was resolved");
                })
                .always(function () {
                    start();
                    oShellNavigationService.compactParams.restore();
                });
           });
    });


// getEasyAccessSystems
    [
         {
             testDescription: "there is no inbound",
             aInbounds: [],
             expectedEasyAccessSystems: {
                userMenu: {},
                sapMenu: {}
             }
         },
         {
             testDescription: "empty sap-system",
             aInbounds: [
                 {
                     id: "Shell-startGUI",
                     semanticObject: "Shell",
                     action: "startGUI",
                     title: "",
                     signature: {
                         parameters: {
                             "sap-system": {
                                 required: true
                             }
                         }
                     },
                     deviceTypes: {
                         desktop: true,
                         tablet: true,
                         phone: true
                     }
                 },
                 {
                     id: "Shell-startWDA",
                     semanticObject: "Shell",
                     action: "startWDA",
                     title: "",
                     signature: {
                         parameters: {
                             "sap-system": {
                                 required: true
                             }
                         }
                     },
                     deviceTypes: {
                         desktop: true,
                         tablet: true,
                         phone: true
                     }
                 },
                 {
                     id: "Shell-startURL",
                     semanticObject: "Shell",
                     action: "startURL",
                     title: "",
                     signature: {
                         parameters: {
                             "sap-system": {
                                 required: true
                             }
                         }
                     },
                     deviceTypes: {
                         desktop: true,
                         tablet: true,
                         phone: true
                     }
                 }
             ],
             expectedEasyAccessSystems: {
                userMenu: {},
                sapMenu: {}
             },
             expectedWarningCalls: {
                userMenu: [
                    [ // first call args
                        "Cannot extract sap-system from easy access menu inbound: #Shell-startGUI{sap-system:<?>}",
                        "This parameter is supposed to be a string. Got 'undefined' instead.",
                        "sap.ushell.services.ClientSideTargetResolution"
                    ],
                    [ // second call args
                        "Cannot extract sap-system from easy access menu inbound: #Shell-startWDA{sap-system:<?>}",
                        "This parameter is supposed to be a string. Got 'undefined' instead.",
                        "sap.ushell.services.ClientSideTargetResolution"
                    ],
                    [ // third call args
                        "Cannot extract sap-system from easy access menu inbound: #Shell-startURL{sap-system:<?>}",
                        "This parameter is supposed to be a string. Got 'undefined' instead.",
                        "sap.ushell.services.ClientSideTargetResolution"
                    ]
                ],
                sapMenu: [
                    [ // first call args
                        "Cannot extract sap-system from easy access menu inbound: #Shell-startGUI{sap-system:<?>}",
                        "This parameter is supposed to be a string. Got 'undefined' instead.",
                        "sap.ushell.services.ClientSideTargetResolution"
                    ],
                    [ // second call args
                        "Cannot extract sap-system from easy access menu inbound: #Shell-startWDA{sap-system:<?>}",
                        "This parameter is supposed to be a string. Got 'undefined' instead.",
                        "sap.ushell.services.ClientSideTargetResolution"
                    ]
                ]
             }
         },
         {
             testDescription: "there is no start... inbound",
             aInbounds: [
                 {
                     id: "Shell-toMyApp~631w",
                     semanticObject: "Shell",
                     action: "toMyApp",
                     title: "My app",
                     signature: {
                         parameters: {
                             "sap-system": {
                                 required: true,
                                 filter: {
                                         value: "AB1CLNT000"
                                 }
                             }
                         }
                     },
                     deviceTypes: {
                         desktop: true,
                         tablet: true,
                         phone: true
                     }
                 }
             ],
             expectedEasyAccessSystems: {
                userMenu: {},
                sapMenu: {}
             }
         },
        {
            testDescription: "there is one startWDA inbound",
            aInbounds: [
                {
                    id: "Shell-startWDA~631w",
                    semanticObject: "Shell",
                    action: "startWDA",
                    title: "CRM Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required: true,
                                filter: {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                }
            ],
            expectedEasyAccessSystems: {
                userMenu: {
                    AB1CLNT000: {
                        text: "CRM Europe",
                        appType: {
                            WDA: true
                        }
                    }
                },
                sapMenu: {
                    AB1CLNT000: {
                        text: "CRM Europe",
                        appType: {
                            WDA: true
                        }
                    }
                }
            }
        },
        {
            testDescription: "there is one startURL inbound",
            aInbounds: [
                {
                    id: "Shell-startURL",
                    semanticObject: "Shell",
                    action: "startURL",
                    title: "BOE Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required: true,
                                filter: {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                }
            ],
            expectedEasyAccessSystems: {
                userMenu: {
                    AB1CLNT000: {
                        text: "BOE Europe",
                        appType: {
                            URL: true
                        }
                    }
                },
                sapMenu: { /* URL types ignored in sap menu */ }
            }
        },
        {
            testDescription: "there are two start... inbounds for two different systems with high and lower priority respectively",
            aInbounds: [
                {
                    id: "Shell-startWDA~6311",
                    semanticObject: "Shell",
                    action: "startGUI",
                    title: "GUI Title",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required: true,
                                filter: {
                                    value: "SYSTEM1"
                                }
                            }
                        }
                    },
                    deviceTypes: { desktop: true, tablet: true, phone: true }
                },
                {
                    id: "Shell-startURL~6312",
                    semanticObject: "Shell",
                    action: "startURL",
                    title: "URL Title",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required: true,
                                filter: {
                                    value: "SYSTEM2"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                }
            ],
            expectedEasyAccessSystems: {
                userMenu: {
                    SYSTEM1: {
                        text: "GUI Title",
                        appType: {
                            TR: true
                        }
                    },
                    SYSTEM2: {
                        text: "URL Title",
                        appType: {
                            URL: true
                        }
                    }
                },
                sapMenu: {
                    SYSTEM1: {
                        text: "GUI Title",
                        appType: {
                            TR: true
                        }
                    }
                }
            }
        },
        {
            testDescription: "there are two different start... inbounds",
            aInbounds: [
                {
                    id: "Shell-startWDA~631w",
                    semanticObject: "Shell",
                    action: "startWDA",
                    title: "CRM Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required: true,
                                filter: {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                },
                {
                    id: "Shell-startGUI~644w",
                    semanticObject: "Shell",
                    action: "startGUI",
                    title: "HR Central",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required: true,
                                filter: {
                                        value: "XY1CLNT100"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                }
            ],
            expectedEasyAccessSystems: {
                userMenu: {
                    AB1CLNT000: {
                        text: "CRM Europe",
                        appType: {
                            WDA: true
                        }
                    },
                    XY1CLNT100: {
                        text: "HR Central",
                        appType: {
                            TR: true
                        }
                    }
                },
                sapMenu: {
                    AB1CLNT000: {
                        text: "CRM Europe",
                        appType: {
                            WDA: true
                        }
                    },
                    XY1CLNT100: {
                        text: "HR Central",
                        appType: {
                            TR: true
                        }
                    }
                }
            }
        },
        {
            testDescription: "there are two start... inbounds one URL and one WDA with the same system alias and same length texts (startWDA is preferred)",
            aInbounds: [
                {
                    id: "Shell-startURL~631w",
                    semanticObject: "Shell",
                    action: "startURL",
                    title: "BOE Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required: true,
                                filter: {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                },
                {
                    id: "Shell-startWDA~631w",
                    semanticObject: "Shell",
                    action: "startWDA",
                    title: "CRM Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required: true,
                                filter: {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                }
            ],
            expectedEasyAccessSystems: {
                userMenu: {
                    AB1CLNT000: {
                        text: "CRM Europe",
                        appType: {
                            URL: true,
                            WDA: true
                        }
                    }

                },
                sapMenu: {
                    AB1CLNT000: {
                        text: "CRM Europe",
                        appType: {
                            WDA: true
                        }
                    }
                }
            }
        },
        {
            testDescription: "there are three start... inbounds with the same system alias and same length texts (startGUI is preferred)",
            aInbounds: [
                {
                    id: "Shell-startGUI~644w",
                    semanticObject: "Shell",
                    action: "startGUI",
                    title: "HCM Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required: true,
                                filter: {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                },
                {
                    id: "Shell-startURL~631w",
                    semanticObject: "Shell",
                    action: "startURL",
                    title: "BOE Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required: true,
                                filter: {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                },
                {
                    id: "Shell-startWDA~631w",
                    semanticObject: "Shell",
                    action: "startWDA",
                    title: "CRM Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required: true,
                                filter: {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                }
            ],
            expectedEasyAccessSystems: {
                userMenu: {
                    AB1CLNT000: {
                        text: "HCM Europe",
                        appType: {
                            TR: true,
                            URL: true,
                            WDA: true
                        }
                    }

                },
                sapMenu: {
                    AB1CLNT000: {
                        text: "HCM Europe",
                        appType: {
                            TR: true,
                            WDA: true
                        }
                    }
                }
            }
        },
        {
            testDescription: "there are three start... inbounds with the same system alias and same length texts (GUI wins over WDA and URL)",
            aInbounds: [
                {
                    id: "Shell-startWDA~631w",
                    semanticObject: "Shell",
                    action: "startWDA",
                    title: "HCM Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required: true,
                                filter: {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                },
                {
                    id: "Shell-startGUI~644w",
                    semanticObject: "Shell",
                    action: "startGUI",
                    title: "CRM Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required: true,
                                filter: {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                },
                {
                    id: "Shell-startURL~631w",
                    semanticObject: "Shell",
                    action: "startURL",
                    title: "BOE Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required: true,
                                filter: {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                }
            ],
            expectedEasyAccessSystems: {
                userMenu: {
                    AB1CLNT000: {
                        text: "CRM Europe",
                        appType: {
                            TR: true,
                            URL: true,
                            WDA: true
                        }
                    }

                },
                sapMenu: {
                    AB1CLNT000: {
                        text: "CRM Europe",
                        appType: {
                            TR: true,
                            WDA: true
                        }
                    }
                }
            }
        },
        {
            testDescription: "there are two start... inbounds with the same system alias and same texts",
            aInbounds: [
                {
                    id: "Shell-startWDA~631w",
                    semanticObject: "Shell",
                    action: "startWDA",
                    title: "CRM Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required: true,
                                filter: {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                },
                {
                    id: "Shell-startGUI~644w",
                    semanticObject: "Shell",
                    action: "startGUI",
                    title: "CRM Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required: true,
                                filter: {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                }
            ],
            expectedEasyAccessSystems: {
                userMenu: {
                    AB1CLNT000: {
                        text: "CRM Europe",
                        appType: {
                            TR: true,
                            WDA: true
                        }
                    }

                },
                sapMenu: {
                    AB1CLNT000: {
                        text: "CRM Europe",
                        appType: {
                            TR: true,
                            WDA: true
                        }
                    }
                }
            }
        },
        {
            testDescription: "the device type of the inbound is not matching for WDA",
            aInbounds: [
                {
                    id: "Shell-startWDA~631w",
                    semanticObject: "Shell",
                    action: "startWDA",
                    title: "CRM Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required: true,
                                filter: {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: false,
                        tablet: true,
                        phone: true
                    }
                }
            ],
            expectedEasyAccessSystems: {
                userMenu: { },
                sapMenu: { }
            }
        },
        {
            testDescription: "the device type of the inbound is not matching for URL",
            aInbounds: [
                {
                    id: "Shell-startURL~631w",
                    semanticObject: "Shell",
                    action: "startURL",
                    title: "POCBOE",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required: true,
                                filter: {
                                        value: "FLPINTEGRATION2015_588"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: false,
                        tablet: true,
                        phone: true
                    }
                }
            ],
            expectedEasyAccessSystems: {
                userMenu: { },
                sapMenu: { }
            }
        },
        {
            testDescription: "numeric sap-system",
            aInbounds: [
                {
                    id: "Shell-startURL~631w",
                    semanticObject: "Shell",
                    action: "startURL",
                    title: "POCBOE",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required: true,
                                filter: {
                                        value: "FLPINTEGRATION2015_588"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: false,
                        tablet: true,
                        phone: true
                    }
                }
            ],
            expectedEasyAccessSystems: {
                userMenu: { },
                sapMenu: { }
            }
        }
    ].forEach(function (oFixture) {
        ["userMenu", "sapMenu"].forEach(function (sMenuType) {
            asyncTest("getEasyAccessSystems('" + sMenuType + "') returns the expected list of systems when " + oFixture.testDescription, function () {
                var oService;

                sinon.stub(jQuery.sap.log, "warning");

                // Arrange
                sinon.stub(utils, "getFormFactor").returns("desktop");
                oService = createService({
                    inbounds: oFixture.aInbounds
                });

                // Act
                oService.getEasyAccessSystems(sMenuType)
                    .done(function (oActualEasyAccessSystems) {
                        start();
                        // Assert
                        deepEqual(oActualEasyAccessSystems, oFixture.expectedEasyAccessSystems[sMenuType], "Easy Access Systems properly extracted from inbounds");

                        if (oFixture.expectedWarningCalls && oFixture.expectedWarningCalls[sMenuType]) {
                            var aExpectedWarningCalls = oFixture.expectedWarningCalls[sMenuType];
                            strictEqual(
                                jQuery.sap.log.warning.callCount,
                                aExpectedWarningCalls.length,
                                "jQuery.sap.log.warning was called the expected number of times"
                            );

                            if (aExpectedWarningCalls.length === jQuery.sap.log.warning.callCount) {

                                aExpectedWarningCalls.forEach(function (aCallArgs, iCall) {
                                    deepEqual(
                                        jQuery.sap.log.warning.getCall(iCall).args,
                                        aCallArgs,
                                        "jQuery.sap.log.warning was called with the expected arguments on call #" + (iCall + 1)
                                    );
                                });
                            }
                        } else {
                            strictEqual(jQuery.sap.log.warning.callCount,
                                0, "jQuery.sap.log.warning was not called");
                        }
                    });
            });
        });
    });

    [
        {
            aInbounds: [
                {
                    id: "Shell-startGUI~644w",
                    semanticObject: "Shell",
                    action: "startGUI",
                    title: "CRM Europe",
                    signature: {
                        parameters: {
                            "sap-system": {
                                required: true,
                                filter: {
                                        value: "AB1CLNT000"
                                }
                            }
                        }
                    },
                    deviceTypes: {
                        desktop: true,
                        tablet: true,
                        phone: true
                    }
                }
            ],
            expectedEasyAccessSystems: {
                AB1CLNT000: {
                    text: "CRM Europe",
                    appType: {
                        TR: true
                    }
                }
            }
        }
    ].forEach(function (oFixture) {
        asyncTest("getEasyAccessSystems is calculating the easy access system list only once", 2, function () {
            var oService,
                oFakeAdapter;

            // Arrange
            sinon.stub(utils, "getFormFactor").returns("desktop");
            oFakeAdapter = {
                getInbounds: sinon.stub().returns(
                        new jQuery.Deferred()
                            .resolve(oFixture.aInbounds)
                            .promise()
                    )
            };
            oService = new ClientSideTargetResolution(oFakeAdapter, null, null);

            // Act
            oService.getEasyAccessSystems()
                .done(function (oActualEasyAccessSystems1) {
                    oService.getEasyAccessSystems()
                        .done(function (oActualEasyAccessSystems2) {
                            // Assert
                            start();
                            deepEqual(oActualEasyAccessSystems2, oFixture.expectedEasyAccessSystems, "Easy Access Systems properly extracted from inbounds");
                            ok(oFakeAdapter.getInbounds.calledOnce, "getInbounds is only called once");
                        });
                });
        });
    });

    [{
        testDescription: "synchronous"
    }].forEach(function (oFixture) {
        asyncTest("_getMatchingInboundsSync: " + oFixture.testDescription, 1, function () {
            var oSrvc = createService();
            var aFakeMatchResults = [
                { num: 18, matches: true, priorityString: "B", inbound: { resolutionResult: {} } },
                { num: 31, matches: true, priorityString: "CD", inbound: { resolutionResult: {} } },
                { num: 33, matches: true, priorityString: "CZ", inbound: { resolutionResult: {} } },
                { num: 41, matches: true, priorityString: "A", inbound: { resolutionResult: {} } },
                { num: 44, matches: true, priorityString: "C", inbound: { resolutionResult: {} } },
                { num: 46, matches: true, priorityString: "CE", inbound: { resolutionResult: {} } }
            ];

            sinon.stub(oSearch, "match").returns(jQuery.Deferred().resolve({
                missingReferences: {},
                matchResults: aFakeMatchResults
            }).promise());

            var aFakeInbounds = aFakeMatchResults.map(function (oMatchResult) {
                return oMatchResult.inbound;
            });

            var oIndex = oInboundIndex.createIndex(aFakeInbounds);

            // Act 2
            var i = 2;
            oSrvc._getMatchingInbounds({}/* any parameter ok for the test*/, oIndex, { }).done(function (aMatchingInbounds) {
                start();
                equal(i, 2, "value ok");
            }).fail(function () {
                ok(false, "promise was resolved");
            });
            i = 3;
        });
    });

    QUnit.module("_getReservedParameters", {
        beforeEach: function () {
            this.oMatchingTarget = {
                "inbound": {
                    "signature": {
                        "parameters": {
                            "sap-navigation-scope": {
                                required: false,
                                "defaultValue": {
                                    value: "green",
                                    format: "plain"
                                }
                            },
                            "sap-priority": {
                                required: false,
                                "defaultValue": {
                                    value: "3",
                                    format: "plain"
                                }
                            }
                        }
                    }
                },
                "intentParamsPlusAllDefaults": {
                    "sap-navigation-scope": ["green"],
                    "sap-navigation-scope-filter": ["green"],
                    "sap-priority": ["3"]
                },
                "defaultedParamNames": ["sap-navigation-scope", "sap-priority"]
            };
            this.oGetParametersStub = sinon.stub(TechnicalParameters, "getParameters");
            this.oGetParametersStub.withArgs({ injectFrom: "startupParameter" }).returns([]);
            this.oGetParametersStub.withArgs({ injectFrom: "inboundParameter" }).returns([{ name: "sap-navigation-scope" }]);
            this.oExtractParametersStub = sinon.stub(oCSTRUtils, "extractParameters").returns({"param1": "1"});
        },
        afterEach: function () {
            this.oMatchResult = null;
            this.oGetParametersStub.restore();
            this.oExtractParametersStub.restore();
        }
    });

    QUnit.test("Matching reserved parameters are removed from matching target", function (assert) {
        // Act
        ClientSideTargetResolution.prototype._getReservedParameters(this.oMatchingTarget);

        // Assert
        assert.equal(Object.keys(this.oMatchingTarget.intentParamsPlusAllDefaults).length, 2, "The parameter is removed correctly");
        assert.equal(this.oMatchingTarget.defaultedParamNames.length, 1, "The parameter is removed correctly");
    });

    QUnit.test("Calls getParameters", function (assert) {
        // Act
        ClientSideTargetResolution.prototype._getReservedParameters(this.oMatchingTarget);

        // Assert
        assert.equal(this.oGetParametersStub.callCount, 2, "getParameters is called returned correctly");
        assert.deepEqual(this.oGetParametersStub.getCall(0).args, [{"injectFrom": "startupParameter"}], "getParameters is called with correct parameter");
        assert.deepEqual(this.oGetParametersStub.getCall(1).args, [{"injectFrom": "inboundParameter"}], "getParameters is called with correct parameter");
    });


    QUnit.test("Returns an object which contains all reserved parameters", function (assert) {
        // Act
        var oResult = ClientSideTargetResolution.prototype._getReservedParameters(this.oMatchingTarget);

        // Assert
        assert.deepEqual(oResult, {"param1": "1", "sap-navigation-scope": "green"}, "The parameters are returned correctly");
    });

    QUnit.module("_applySapNavigationScope", {
        beforeEach: function () {
            this.oSrvc = createService();
        },
        afterEach: function () {
            this.oSrvc = null;
        }
    });

    QUnit.test("Returns the input matching inbounds if the shell hash does not contain sap-navigation-scope-filter", function (assert) {
        // Arrange
        var oShellHash = {
            params: {}
        };
        var aMatchingTargets = [{
            inbound: {
                signature: {
                    parameters: {}
                }
            }
        },
        {
            inbound: {
                signature: {
                    parameters: {}
                }
            }
        }];

        // Act
        var aResult = this.oSrvc._applySapNavigationScopeFilter(aMatchingTargets, oShellHash);

        // Assert
        assert.deepEqual(aResult, aMatchingTargets, "Correct matching inbounds are returned");
    });


    QUnit.test("Returns the input matching inbounds if there is no inbound containing sap-navigation-scope", function (assert) {
        // Arrange
        var oShellHash = {
            params: {
                "sap-navigation-scope-filter": ["green"]
            }
        };
        var aMatchingTargets = [{
            inbound: {
                signature: {
                    parameters: {}
                }
            }
        },
        {
            inbound: {
                signature: {
                    parameters: {}
                }
            }
        }];

        // Act
        var aResult = this.oSrvc._applySapNavigationScopeFilter(aMatchingTargets, oShellHash);

        // Assert
        assert.deepEqual(aResult, aMatchingTargets, "Correct matching inbounds are returned");
    });

    QUnit.test("Returns the input matching inbounds if there is no matching sap-navigation-scope", function (assert) {
        // Arrange
        var oShellHash = {
            params: {
                "sap-navigation-scope-filter": ["green"]
            }
        };
        var aMatchingTargets = [{
            id: "inbound1",
            inbound: {
                signature: {
                    parameters: {
                        "sap-navigation-scope": {
                            defaultValue: {
                                value: "pink"
                            }
                        }
                    }
                }
            }
        },
        {
            inbound: {
                id: "inbound2",
                signature: {
                    parameters: {
                        "sap-navigation-scope": {
                            defaultValue: {
                                value: "pink"
                            }
                        }
                    }
                }
            }
        }];

        // Act
        var aResult = this.oSrvc._applySapNavigationScopeFilter(aMatchingTargets, oShellHash);

        // Assert
        assert.strictEqual(aResult, aMatchingTargets, "Correct matching inbounds are returned");
    });

    QUnit.test("Returns inbounds with matching sap-navigation-scope", function (assert) {
        // Arrange
        var oShellHash = {
            params: {
                "sap-navigation-scope-filter": ["green"]
            }
        };
        var aMatchingTargets = [{
            id: "inbound1",
            inbound: {
                signature: {
                    parameters: {
                        "sap-navigation-scope": {
                            defaultValue: {
                                value: "pink"
                            }
                        }
                    }
                }
            }
        },
        {
            inbound: {
                id: "inbound2",
                signature: {
                    parameters: {
                        "sap-navigation-scope": {
                            defaultValue: {
                                value: "green"
                            }
                        }
                    }
                }
            }
        }];

        // Act
        var aResult = this.oSrvc._applySapNavigationScopeFilter(aMatchingTargets, oShellHash);

        // Assert
        assert.strictEqual(aResult[0].id, aMatchingTargets[1].id, "Correct matching inbound is returned");
    });

    QUnit.module("transient state", {
        beforeEach: function (assert) {
            var fnDone = assert.async();
            var testState = {
                "ABCSTATE": '{"selectionVariant":{"SelectOptions":[{"PropertyName":"P1","Ranges":[{"Sign":"I","Option":"EQ","Low":"INT","High":null}]}]}}'
            };
            ObjectPath.set("sap-ushell-config.services.AppState.config.initialAppStates", testState);
            sap.ushell.bootstrap("local").then(fnDone);
        },
        afterEach: function () {
            delete sap.ushell.Container;
            delete window["sap-ushell-config"].services.AppState;
        }
    });

    ["SAPUI5", "WDA"].forEach(function (sAppType) {
        test("transient app state does not persist for applicationType: " + sAppType, function (assert) {
            var fnDone = assert.async();
            var oMatchTarget = {
                "inbound": {
                  "semanticObject": "Action",
                  "action": "testAppStateNotSave",
                  "resolutionResult": {
                    "applicationType": sAppType,
                    "url": "/test/url"
                  },
                  "signature": {
                    "parameters": {
                      "P1": {
                        "renameTo": "P1New",
                        "required": false
                      }
                    },
                    "additionalParameters": "allowed"
                  }
                },
                "intentParamsPlusAllDefaults": {
                  "sap-xapp-state": [
                    "ABCSTATE"
                  ]
                },
                "defaultedParamNames": [],
                "resolutionResult": {},
                "matches": true,
                "matchesVirtualInbound": false,
                "parsedIntent": {
                  "semanticObject": "Action",
                  "action": "parameterRename",
                  "params": {
                    "sap-xapp-state": [
                      "ABCSTATE"
                    ]
                  },
                  "formFactor": "desktop"
                }
            };

            var sHash = "#Action-testAppStateNotSave?sap-xapp-state=ABCSTATE";
            var fnBoundFallback = sinon.spy();

            var oSrvc = createService();
            var oAppStateService = sap.ushell.Container.getService("AppState"),
                oWindowAdapter = oAppStateService._oAdapter,
                oBackendAdapter = oWindowAdapter._oBackendAdapter,
                oWindowAdapterSaveSpy = sinon.spy(oWindowAdapter, "saveAppState"),
                oBackendAdapterSaveSpy = sinon.spy(oBackendAdapter, "saveAppState");

            oSrvc._resolveSingleMatchingTarget(oMatchTarget, fnBoundFallback, sHash)
            .done(function (oResolvedTarget) {
                assert.ok(true, "target was succesfully resolved");
                assert.ok(fnBoundFallback.notCalled, "fnBoundFallback was not called");
                assert.ok(oWindowAdapterSaveSpy.calledOnce, "saveAppState of WindowApadter was called");
                assert.ok(oWindowAdapterSaveSpy.getCall(0).args[0] !== "ABCSTATE", "new state is saved");
                assert.equal(oResolvedTarget.url.split("=")[1], oWindowAdapterSaveSpy.getCall(0).args[0], "new state is added to url");
                assert.ok(oWindowAdapterSaveSpy.getCall(0).args[5], "saveAppState of WindowApadter should be called with bTransient=true");
                assert.ok(oBackendAdapterSaveSpy.notCalled, "saveAppState of oBackendAdapter was not called");
            })
            .fail(function () {
                assert.ok(false, "target should be succesfully resolved");
            })
            .always(function () {
                oWindowAdapterSaveSpy.restore();
                oBackendAdapterSaveSpy.restore();
                fnDone();
            });

        });
    });

 });
