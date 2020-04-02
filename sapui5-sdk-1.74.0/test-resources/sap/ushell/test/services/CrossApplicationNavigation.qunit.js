// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.Bookmark
 */
sap.ui.require([
    "sap/ui/core/UIComponent",
    "sap/ui/core/Component",
    "sap/ushell/services/CrossApplicationNavigation",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/services/URLParsing",
    "sap/ushell/test/utils",
    "sap/ui/thirdparty/URI"
], function (
    UIComponent,
    Component,
    CrossApplicationNavigation,
    oAppConfiguration,
    URLParsing,
    testUtils,
    URI
) {
    "use strict";
    /* global test, strictEqual, ok, deepEqual, sinon, equal, notStrictEqual, Promise
      module, assert, asyncTest, start, stop, QUnit */

    var aCoreExtLightPreloadBundles = [
        "sap/fiori/core-ext-light-0.js",
        "sap/fiori/core-ext-light-1.js",
        "sap/fiori/core-ext-light-2.js",
        "sap/fiori/core-ext-light-3.js"
    ];

    jQuery.sap.require("sap.ushell.services.Container"); // necessary for stand-alone tests
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");

    // define a root UIComponent which exposes the main view
    jQuery.sap.declare("sap.ushell.foo.bar.Component");

    // new Component
    UIComponent.extend("sap.ushell.foo.bar.Component", {
        init : function () {}
    });

    var oURLParsingService = new URLParsing();

    /*
     * Mock implementations
     */
    function fnResolveHashFragmentMock (sIntent) {
        var oDeferred = new jQuery.Deferred(),
            aIntentParts = sIntent.split("?"),
            sParameters = aIntentParts.length === 2 && aIntentParts[1],
            oNavTargetResults = {
                "#foo-bar": {
                    "applicationType": "URL",
                    "additionalInformation": "SAPUI5.Component=foo.bar.Component",
                    "url": "/foo/bar/Component",
                    "text": "Foo Bar Component"
                },
                "#foo-nwbc": {
                    "applicationType":"NWBC",
                    "additionalInformation":"",
                    "text":"Foo Bar NWBC",
                    "url":"/foo/nwbc",
                    "navigationMode":"newWindowThenEmbedded"
                }
            };

        sIntent = aIntentParts[0];

        if (oNavTargetResults.hasOwnProperty(sIntent)) {
            if (sParameters) {
                oNavTargetResults[sIntent].url += "?" + sParameters;
            }
            oDeferred.resolve(oNavTargetResults[sIntent]);
        } else {
            oDeferred.reject("NavTargetResolution failed: intent unknown");
        }

        return oDeferred.promise();
    }

    /*
     * Mock implementation for resolveHashFragment
     */
    function fnResolveHashFragmentMock2 (sIntent) {
        var oDeferred = new jQuery.Deferred(),
            sUshellTestRootPath = jQuery.sap.getResourcePath('sap/ushell').replace('resources', 'test-resources'),
            aIntentParts = sIntent.split("?"),
            sParameters = aIntentParts.length === 2 && aIntentParts[1],
            oNavTargetResults = {
                "#foo-bar": {
                    "applicationType": "URL",
                    "additionalInformation": "SAPUI5.Component=sap.ushell.demo.HelloWorldSampleApp",
                    "url": sUshellTestRootPath + "/demoapps/HelloWorldSampleApp?fixed-param1=value1&array-param1=value1&array-param1=value2",
                    "text": "Foo Bar Component"
                }
            };

        sIntent = aIntentParts[0];

        if (oNavTargetResults.hasOwnProperty(sIntent)) {
            if (sParameters) {
                oNavTargetResults[sIntent].url += "?" + sParameters;
            }
            oDeferred.resolve(oNavTargetResults[sIntent]);
        } else {
            oDeferred.reject("NavTargetResolution failed: intent unknown");
        }

        return oDeferred.promise();
    }

    function fnSapUiComponentMock (oConfig) {
        var that = this;

        this.id = "mockComponentInstance";
        this.config = oConfig;

        if (oConfig.async && oConfig.async === true) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    resolve(that);
                },0);
            });
        }
        return this;
    }

    // TODO this test file is not isolated but calles many ushell services and relies on them
    module("sap.ushell.services.CrossApplicationNavigation", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(start);
        },
        teardown: function () {
            delete sap.ushell.Container;
            testUtils.restoreSpies(
                sap.ui.component,
                jQuery.sap.log.debug,
                jQuery.sap.isDeclared,
                window.history.go,
                oAppConfiguration.getCurrentApplication
            );
        }
    });

    test("getService", function () {
        var oCrossApplicationNavigationService;

        equal(localStorage && localStorage["sap-ushell-enc-test"], undefined, "Beware, please remove sap-ushell-enc local storage setting!");

        // code under test
        oCrossApplicationNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");

        // test
        ok(oCrossApplicationNavigationService instanceof CrossApplicationNavigation);
        strictEqual(typeof oCrossApplicationNavigationService.hrefForExternal, "function");
        strictEqual(typeof oCrossApplicationNavigationService.toExternal, "function");
        // TODO test parameters
    });

    test("with ShellNavigation", function () { //TODO use sinon the way it is supposed to...
        var oCrossApplicationNavigationService,
            lastCall,
            methodName,
            stub,
            anObject = { "1" : 2 },
            oAsync = { "2" : 3 },
            oAbcParam = { "abc": "a" },
            oDefParam = { "def": "b" };

        //  hrefForExternal
        oCrossApplicationNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        var oShellNavigationService = sap.ushell.Container.getService("ShellNavigation");

        stub = sinon.stub(oShellNavigationService, "hrefForExternal",
            function (oArgs, oArgs2, oArgs3) {
                lastCall = oArgs;
                return oArgs;
            });

        deepEqual(oCrossApplicationNavigationService.hrefForExternal(oAbcParam, anObject, oAsync), oAbcParam);
        notStrictEqual(oAbcParam, lastCall, "parameter was cloned");
        deepEqual(oAbcParam, lastCall, "parameter was cloned successfully");
        deepEqual(stub.args[0][2], anObject, "2nd argument transferred");
        equal(stub.args[0][3], oAsync, "3nd argument transferred");
        stub.restore();
        //  toExternal
        methodName = "toExternal";
        oCrossApplicationNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        stub = sinon.stub(sap.ushell.Container.getService("ShellNavigation"), methodName,
            function (oArgs, oArgs1) {
                lastCall = oArgs;
                return oArgs;
            });
        strictEqual(undefined, oCrossApplicationNavigationService[methodName](oDefParam, anObject));
        notStrictEqual(oDefParam, lastCall, "parameter was cloned");
        deepEqual(oDefParam, lastCall, "parameter was cloned successfully");
        equal(stub.args[0][1], anObject, "Component as 2nd argument transferred");
        stub.restore();

        //  hrefForAppSpecificHash
        methodName = "hrefForAppSpecificHash";
        oCrossApplicationNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        stub = sinon.stub(sap.ushell.Container.getService("ShellNavigation"), methodName,
            function (oArgs) {
                lastCall = oArgs;
                return oArgs;
            });
        equal("def", oCrossApplicationNavigationService[methodName]("def"));
        equal("def", lastCall);
    });

    asyncTest("getDistinctSemanticObjects", function () {
        var oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution"),
            aFakeResult = ["SemanticObject1", "SemanticObject2"];

        sinon.stub(oNavTargetResolution, "getDistinctSemanticObjects").returns(
            new jQuery.Deferred().resolve(aFakeResult).promise()
        );

        sap.ushell.Container.getService("CrossApplicationNavigation")
            .getDistinctSemanticObjects()
            .done(function (aGotResult) {
                ok(true, "promise was resolved");

                deepEqual(aGotResult, aFakeResult,
                    "result returned from NavTargetResolution#getDistinctSemanticObjects was propagated");
            })
            .fail(function () {
                ok(false, "promise was resolved");
            })
            .always(function () {
                start();
            });
    });

    test("getSemanticObjectLinks", function () {
        var oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution"),
            mParameters = {
                A: "B",
                C: "e'e e"
            },
            sAppState = "ANAPSTATE",
            oObject = {},
            oResult;

        sinon.stub(oNavTargetResolution, "getLinks").returns({/*don't care*/});
        oResult = sap.ushell.Container.getService("CrossApplicationNavigation")
            .getSemanticObjectLinks("Action", mParameters, true, oObject, sAppState);

        deepEqual(oNavTargetResolution.getLinks.getCall(0).args[0], {
            semanticObject: "Action",
            params: mParameters,
            ignoreFormFactor: true,
            ui5Component: oObject,
            appStateKey: sAppState,
            compactIntents: false // false is the default
        }, "NavTargetResolution was called with the expected parameters");

        strictEqual(oResult, oNavTargetResolution.getLinks.returnValues[0],
            "NavTargetResolution returned the same results returned by CrossApplicationNavigation");
    });

    test("getSemanticObjectLinks calls NavTargetResolution correctly when bCompactIntents parameter is set to true", function () {
        var oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution"),
            mParameters = {
                "param1": "value1",
                "param2": "value2",
                "param3": "value3",
                "param4": "value4"
            },
            sAppState = "ANAPSTATE";

        // simulate getSoL returns an uncompacted result
        sinon.stub(oNavTargetResolution, "getLinks").returns({/*don't care*/});

        sap.ushell.Container.getService("CrossApplicationNavigation")
            .getSemanticObjectLinks("Action", mParameters, true, {} /* oComponent */, sAppState, true /*bCompactIntents*/);

        deepEqual(oNavTargetResolution.getLinks.getCall(0).args[0], {
            semanticObject: "Action",
            params: mParameters,
            ignoreFormFactor: true,
            ui5Component: {},
            appStateKey: sAppState,
            compactIntents: true // note
        }, "NavTargetResolution getLinks was called with the expected parameters");
    });

    test("getSemanticObjectLinks multiple invoke", function () {
        var oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution"),
            mParameters = {
                A: "B",
                C: "e'e e"
            },
            sAppState = "ANAPSTATE",
            aObject = {},
            oPr,
            stub,
            cnt = 0;

        stub = sinon.stub(oNavTargetResolution, "getLinks");
        stub.onCall(0).returns(new jQuery.Deferred().resolve(["A","B"]).promise());
        stub.onCall(1).returns(new jQuery.Deferred().resolve(["C"]).promise());
        oPr = sap.ushell.Container.getService("CrossApplicationNavigation")
            .getSemanticObjectLinks([["SOx", mParameters, true, aObject, sAppState],["SO"]]);

        deepEqual(oNavTargetResolution.getLinks.args[0], [{
            semanticObject: "SOx",
            params: mParameters,
            ignoreFormFactor: true,
            ui5Component: aObject,
            appStateKey: sAppState,
            compactIntents: false
        }], "parameters are ok (first call)");

        deepEqual(oNavTargetResolution.getLinks.args[1], [{
            semanticObject: "SO",
            params: undefined,
            ignoreFormFactor: false,
            ui5Component: undefined,
            appStateKey: undefined,
            compactIntents: false
        }], "parameters are ok (second call)");

        oPr.done(function(oResult){
            deepEqual(oResult, [[["A", "B"]],[["C"]]], "obtained expected result");
            cnt = 1;
        });
        ok(cnt === 1);
        stub.restore();
    });

    test("getLinks", function () {
        var oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution"),
            mParameters = {
                A: "B",
                C: "e'e e"
            },
            sAppState = "ANAPSTATE",
            oObject = {},
            oResult;

        sinon.stub(oNavTargetResolution, "getLinks").returns({/*don't care*/});
        oResult = sap.ushell.Container.getService("CrossApplicationNavigation")
            .getLinks({
                semanticObject: "Action",
                params: mParameters,
                paramsOptions: [],
                ignoreFormFactor: true,
                ui5Component: oObject,
                appStateKey: sAppState
            });

        deepEqual(oNavTargetResolution.getLinks.getCall(0).args[0], {
            semanticObject: "Action",
            params: {
                "A" : "B",
                "C" : "e'e e",
                "sap-xapp-state": [
                  "ANAPSTATE"
                ]
            },
            paramsOptions: [],
            ignoreFormFactor: true,
            ui5Component: oObject,
            //appStateKey: sAppState,
            compactIntents: false, // false is the default
            action: undefined
        }, "NavTargetResolution was called with the expected parameters");

        strictEqual(oResult, oNavTargetResolution.getLinks.returnValues[0],
            "NavTargetResolution returned the same results returned by CrossApplicationNavigation");
    });

    test("getLinks calls NavTargetResolution correctly when no parameter is given", function () {
        var oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution");

        sinon.stub(oNavTargetResolution, "getLinks").returns({/*don't care*/});

        sap.ushell.Container.getService("CrossApplicationNavigation").getLinks();

        deepEqual(oNavTargetResolution.getLinks.getCall(0).args[0], {
            action: undefined,
            compactIntents: false,
            params: undefined,
            paramsOptions: []
        }, "NavTargetResolution getLinks was called with the expected parameters");
    });

    test("getLinks calls NavTargetResolution correctly when no parameter is given in object", function () {
        var oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution");

        sinon.stub(oNavTargetResolution, "getLinks").returns({/*don't care*/});

        sap.ushell.Container.getService("CrossApplicationNavigation").getLinks({});

        deepEqual(oNavTargetResolution.getLinks.getCall(0).args[0], {
            action: undefined,
            compactIntents: false,
            params: undefined,
            paramsOptions: []
        }, "NavTargetResolution getLinks was called with the expected parameters");
    });

    [
        {
            testDescription: "paramsOptions provided from public API",
            oGetLinksCall: {
                paramsOptions: [
                    { name: "A", options: { required: true } }  // note: given from public API
                ],
                params: {
                    "A": ["vA"],
                    "B": ["vB"]
                }
            },
            expectedNTRGetLinksCallArgs: [
                {
                    action: undefined,
                    compactIntents: false,
                    params: {
                        "A": ["vA"],
                        "B": ["vB"]
                    },
                    paramsOptions: []
                }
            ]
        },
        {
            testDescription: "paramsOptions provided from public API is overridden when extended params syntax is used",
            oGetLinksCall: {
                paramsOptions: [
                    { name: "B", options: { required: true } }  // note: given from public API
                ],
                params: {
                    "A": { value: ["vA"], required: false },
                    "B": ["vB"]
                }
            },
            expectedNTRGetLinksCallArgs: [
                {
                    action: undefined,
                    compactIntents: false,
                    params: {
                        "A": ["vA"],
                        "B": ["vB"]
                    },
                    paramsOptions: [{
                        name: "A", options: { required: false }
                    }]
                }
            ]
        }
    ].forEach(function (oFixture) {
        test("getLinks calls NavTargetResolution as expected when " + oFixture.testDescription, function () {
            var oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution");

            // simulate getSoL returns an uncompacted result
            sinon.stub(oNavTargetResolution, "getLinks").returns({/*don't care*/});

            sap.ushell.Container.getService("CrossApplicationNavigation")
                .getLinks(oFixture.oGetLinksCall);

            deepEqual(oNavTargetResolution.getLinks.args[0], oFixture.expectedNTRGetLinksCallArgs,
                "NavTargetResolution getLinks was called with the expected parameters");
        });
    });

    test("getLinks calls NavTargetResolution correctly when withAtLeastOneUsedParam parameter is given", function () {
        var oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution");

        // simulate getSoL returns an uncompacted result
        sinon.stub(oNavTargetResolution, "getLinks").returns({/*don't care*/});

        sap.ushell.Container.getService("CrossApplicationNavigation").getLinks({
            withAtLeastOneUsedParam: true,
            params: {
                "A": ["vA"],
                "B": ["vB"]
            }
        });

        deepEqual(oNavTargetResolution.getLinks.getCall(0).args[0], {
            action: undefined,
            compactIntents: false,
            params: {
                "A": ["vA"],
                "B": ["vB"]
            },
            paramsOptions: [],
            withAtLeastOneUsedParam: true
        }, "NavTargetResolution getLinks was called with the expected parameters");
    });

    test("getLinks calls NavTargetResolution correctly when bCompactIntents parameter is set to true", function () {
        var oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution"),
            mParameters = {
                "param1": "value1",
                "param2": "value2",
                "param3": "value3",
                "param4": "value4"
            },
            sAppState = "ANAPSTATE";

        // simulate getSoL returns an uncompacted result
        sinon.stub(oNavTargetResolution, "getLinks").returns({/*don't care*/});

        sap.ushell.Container.getService("CrossApplicationNavigation")
            .getLinks({
                semanticObject: "Action",
                params: mParameters,
                ignoreFormFactor: true,
                ui5Component: {},
                appStateKey: sAppState,
                compactIntents: true
            });

        deepEqual(oNavTargetResolution.getLinks.getCall(0).args[0], {
            semanticObject: "Action",
            params: {
                "param1": "value1",
                "param2": "value2",
                "param3": "value3",
                "param4": "value4",
                "sap-xapp-state" : [ "ANAPSTATE" ]
            },
            ignoreFormFactor: true,
            ui5Component: {},
            //appStateKey: sAppState,
            compactIntents: true,
            paramsOptions: [],
            action: undefined
        }, "NavTargetResolution getLinks was called with the expected parameters");
    });

    test("getLinks multiple invoke", function () {
        var oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution"),
            mParameters = {
                A: "B",
                C: "e'e e"
            },
            sAppState = "ANAPSTATE",
            aObject = {},
            oPr,
            stub,
            cnt = 0;

        stub = sinon.stub(oNavTargetResolution, "getLinks");
        stub.onCall(0).returns(new jQuery.Deferred().resolve(["A","B"]).promise());
        stub.onCall(1).returns(new jQuery.Deferred().resolve(["C"]).promise());
        oPr = sap.ushell.Container.getService("CrossApplicationNavigation")
            .getLinks([[{
                semanticObject: "SOx",
                params: mParameters,
                ignoreFormFactor: true,
                ui5Component: aObject,
                appStateKey: sAppState
            }], [{
                semanticObject: "SO"
            }]]);

        deepEqual(oNavTargetResolution.getLinks.args[0], [{
            semanticObject: "SOx",
            params: {
                A: "B",
                C: "e'e e",
                "sap-xapp-state" : ["ANAPSTATE"]
            },
            paramsOptions: [],
            ignoreFormFactor: true,
            ui5Component: aObject,
            //appStateKey: sAppState,
            compactIntents: false,
            action: undefined
        }], "parameters are ok (first call)");

        deepEqual(oNavTargetResolution.getLinks.args[1], [{
            semanticObject: "SO",
            compactIntents: false,
            paramsOptions: [],
            params: undefined,
            action: undefined
        }], "parameters are ok (second call)");

        oPr.done(function(oResult){
            deepEqual(oResult, [  // <- we have multiple results

                [                 // <- result for the first invocation
                  ["A", "B"]      // <- return value from NavTargetResolution#getLinks
                ],
                [                 // <- result for the second invocation
                  ["C"]           // <- result corresponding to the second invocation
                ]
            ], "obtained expected result");
            cnt = 1;
        });
        ok(cnt === 1);
        stub.restore();
    });

    [
        {
            testDescription: "empty intents, no component startup params",
            aIntents: [],                               // input intents (strings)
            oComponentStartupParams: {},                // ui5 component startup params
            oFakeNavTargetResolutionResult: {},         // simulated NavTargetResolution Result
            expectedNavTargetResolutionCalledWith: [],  // expected call to nav target resolution
            expectedResult: {}                          // expected result from isIntentSupported
        },
        {
            testDescription: "sap system in intent params",
            aIntents: ["#SO-act2?sap-system=CC2"],
            oComponentStartupParams: {
                "P1": ["v1"]
            },
            oFakeNavTargetResolutionResult: {
                "#SO-act2?sap-system=CC2" : { supported: true } // sap-system comes from intent
            },
            expectedNavTargetResolutionCalledWith: [
                "#SO-act2?sap-system=CC2"
            ],
            expectedResult: {
                "#SO-act2?sap-system=CC2" : { supported: true } // sap-system stays there (comes from intent)
            }
        },
        {
            testDescription: "sap system in component",
            aIntents: ["#SO-act2?p1=v1"],
            oComponentStartupParams: {
                "sap-system": ["CC2"]
            },
            oFakeNavTargetResolutionResult: {
                "#SO-act2?p1=v1&sap-system=CC2" : { supported: true } // sap-system comes from startup params
            },
            expectedNavTargetResolutionCalledWith: [
                "#SO-act2?p1=v1&sap-system=CC2"
            ],
            expectedResult: {
                "#SO-act2?p1=v1" : { supported: true } // no sap-system (it came from component)
            }
        },
        {
            testDescription: "different sap-system in component and intent param",
            aIntents: ["#SO-act2?p1=v1&sap-system=CC2"],
            oComponentStartupParams: {
                "sap-system": ["CC4"]  // note, discarded
            },
            oFakeNavTargetResolutionResult: {
                "#SO-act2?p1=v1&sap-system=CC2" : { supported: true }
            },
            expectedNavTargetResolutionCalledWith: [
                "#SO-act2?p1=v1&sap-system=CC2"
            ],
            expectedResult: {
                "#SO-act2?p1=v1&sap-system=CC2" : { supported: true }
            }
        },
        {
            testDescription: " sap-ushell-next-navmode present in result but not on component",
            aIntents: ["#SO-act2?p1=v1&sap-system=CC2"],
            oCurrentApplication : {
                "sap-ushell-next-navmode" : "embedded"
            },
            oComponentStartupParams: {
                "sap-system": ["CC4"]  // note, discarded
            },
            oFakeNavTargetResolutionResult: {
                "#SO-act2?p1=v1&sap-system=CC2" : { supported: true }
            },
            expectedNavTargetResolutionCalledWith: [
                "#SO-act2?p1=v1&sap-system=CC2"
            ],
            expectedResult: {
                "#SO-act2?p1=v1&sap-system=CC2" : { supported: true }
            }
        },
        {
            testDescription: " sap-ushell-next-navmode present on component",
            aIntents: ["#SO-act2?p1=v1&sap-system=CC2"],
            oCurrentApplication : {
                "sap-ushell-next-navmode" : "newWindow"
            },
            oComponentStartupParams: {
                "sap-system": ["CC4"],  // note, discarded
                "sap-ushell-next-navmode" : ["embedded"]
            },
            oFakeNavTargetResolutionResult: {
                "#SO-act2?p1=v1&sap-system=CC2&sap-ushell-navmode=embedded" : { supported: true }
            },
            expectedNavTargetResolutionCalledWith: [
                "#SO-act2?p1=v1&sap-system=CC2&sap-ushell-navmode=embedded"
            ],
            expectedResult: {
                "#SO-act2?p1=v1&sap-system=CC2" : { supported: true }
            }
        },
        {
            testDescription: " sap-ushell-next-navmode present on resolution result, no component",
            aIntents: ["#SO-act2?p1=v1&sap-system=CC2"],
            oCurrentApplication : {
                "sap-ushell-next-navmode" : "embedded"
            },
            oComponentStartupParams: undefined,
            oFakeNavTargetResolutionResult: {
                "#SO-act2?p1=v1&sap-system=CC2&sap-ushell-navmode=embedded" : { supported: true }
            },
            expectedNavTargetResolutionCalledWith: [
                "#SO-act2?p1=v1&sap-system=CC2&sap-ushell-navmode=embedded"
            ],
            expectedResult: {
                "#SO-act2?p1=v1&sap-system=CC2" : { supported: true }
            }
        }
    ].forEach(function (oFixture) {
        asyncTest("isIntentSupported: calls navtarget resolution as expected when " + oFixture.testDescription, function () {
            var oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution"),
                oFakeComponent;  // valid parameter (component optional in signature)

            // Construct a component compatible with getTargetWithCurrentSystem
            if (oFixture.oComponentStartupParams) {
                oFakeComponent = new UIComponent();
                sinon.stub(oFakeComponent, "getComponentData").returns({
                    startupParameters: oFixture.oComponentStartupParams
                });
            }
            sinon.stub(oAppConfiguration, "getCurrentApplication").returns(
                oFixture.oCurrentApplication
            );
            sinon.stub(oNavTargetResolution, "isIntentSupported").returns(
                new jQuery.Deferred().resolve(oFixture.oFakeNavTargetResolutionResult).promise()
            );

            // Act
            sap.ushell.Container.getService("CrossApplicationNavigation")
                .isIntentSupported(oFixture.aIntents, oFakeComponent)
                .done(function (mResult) {
                    ok(true, "promise was resolved");

                    deepEqual(mResult, oFixture.expectedResult, "returned expected result");
                    if (oFixture.expectedNavTargetResolutionCalledWith[0]) {
                        equal(oNavTargetResolution.isIntentSupported.args[0][0], oFixture.expectedNavTargetResolutionCalledWith[0], "correct arg");
                    }
                    ok(oNavTargetResolution.isIntentSupported.calledWithExactly(oFixture.expectedNavTargetResolutionCalledWith),
                        "NavTargetResolution.isIntentSupported called with the expected arguments");
                })
                .fail(function () {
                    ok(false, "promise was resolved");
                })
                .always(function () {
                    start();
                });
        });
    });

    test("isNavigationSupported", function () {
        var aIntents = [/*content does not matter*/],
            oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution"),
            oResult,
            oSimulatedResult = {};

        sinon.stub(oNavTargetResolution, "isNavigationSupported").returns(oSimulatedResult);
        oResult = sap.ushell.Container.getService("CrossApplicationNavigation")
            .isNavigationSupported(aIntents);
        ok(oNavTargetResolution.isNavigationSupported.calledWithExactly(aIntents));
        strictEqual(oResult, oSimulatedResult);
    });

    test("isInitialNavigation: logs an error message and returns true if the shell navigation service is not availble", function () {
        var bResult,
            oService,
            iCallCount;

        // simulate shell navigation service not available
        var fnGetServiceOrig = sap.ushell.Container.getService;
        sap.ushell.Container.getService = function (sService) {
            if (sService === "ShellNavigation") {
                return undefined; // not available
            }
            return fnGetServiceOrig(sService);
        };

        sinon.stub(jQuery.sap.log, "debug");

        oService = sap.ushell.Container.getService("CrossApplicationNavigation");
        bResult = oService.isInitialNavigation();

        strictEqual(iCallCount = jQuery.sap.log.debug.getCalls().length, 1, "jQuery.sap.log.debug was called 1 time");
        if (iCallCount === 1) {
            deepEqual(jQuery.sap.log.debug.getCall(0).args, [
                "ShellNavigation service not available",
                "This will be treated as the initial navigation",
                "sap.ushell.services.CrossApplicationNavigation"
            ], "logging function was called as expected");
        }

        strictEqual(bResult, true, "obtained expected result");

        // restore original getService
        sap.ushell.Container.getService = fnGetServiceOrig;
    });

    [
        {
            bResultFromShellNavigation: true,
            expectedResult: true
        },
        {
            bResultFromShellNavigation: false,
            expectedResult: false
        },
        {
            bResultFromShellNavigation: undefined,
            expectedResult: true
        }
    ].forEach(function (oFixture) {

        test("isInitialNavigation: returns " + oFixture.expectedResult + " if the isInitialNavigation method from ShellNavigation service returns " + oFixture.bResultFromShellNavigation, function () {
            // fake result from shell navigation method
            var fnGetServiceOrig = sap.ushell.Container.getService;
            sap.ushell.Container.getService = function (sService) {
                if (sService === "ShellNavigation") {
                    return { isInitialNavigation: function () { return oFixture.bResultFromShellNavigation; } };
                }
                return fnGetServiceOrig(sService);
            };

            var oService = sap.ushell.Container.getService("CrossApplicationNavigation");

            strictEqual(oService.isInitialNavigation(), oFixture.expectedResult, "obtained expected result");

            // restore original getService
            sap.ushell.Container.getService = fnGetServiceOrig;
        });
    });

    [
        {
            testDescription: "called with steps parameter of wrong type",
            stepsCount: "one",
            expectedNumberOfStepsAgument: -1
        },
        {
            testDescription: "called with steps parameter of right type",
            stepsCount: 4,
            expectedNumberOfStepsAgument: -4
        },
        {
            testDescription: "called without steps parameter",
            stepsCount: undefined,
            expectedNumberOfStepsAgument: -1
        }
    ].forEach(function (oFixture) {
        test("historyBack works as expected when " + oFixture.testDescription, function () {
            var oCrossApplicationNavigationService =
                sap.ushell.Container.getService("CrossApplicationNavigation");
            var iSteps = oFixture.stepsCount;

            sinon.stub(window.history, "go").returns({/*don't care*/});

            oCrossApplicationNavigationService.historyBack(iSteps);

            strictEqual(
                window.history.go.callCount > 0,
                true,
                "called window.history.go"
            );
            strictEqual(
                window.history.go.getCall(0).args[0],
                oFixture.expectedNumberOfStepsAgument,
                "called window.histoy.go with expected argument"
            );
        });
    });

    [
        {
            testDescription: "initial navigation occurred",
            bInitialNavigation: true,
            expectedHistoryBackCalled: false,
            expectedToExternalCalled: true,
            expectedToExternalCalledWith: [{
                "target": { "shellHash": "#" },
                "writeHistory": false
            }]
        },
        {
            testDescription: "initial navigation did not occur",
            bInitialNavigation: false,
            expectedHistoryBackCalled: true,
            expectedToExternalCalled: false
        }
    ].forEach(function (oFixture) {
        test("backToPreviousApp works as expected when " + oFixture.testDescription, function () {
            var oCrossApplicationNavigationService =
                sap.ushell.Container.getService("CrossApplicationNavigation");

            sinon.stub(window.history, "go").returns({/*don't care*/});
            sinon.stub(oCrossApplicationNavigationService, "toExternal");
            sinon.stub(oCrossApplicationNavigationService, "isInitialNavigation").returns(
                oFixture.bInitialNavigation
            );

            oCrossApplicationNavigationService.backToPreviousApp();

            strictEqual(
                oCrossApplicationNavigationService.toExternal.callCount > 0,
                oFixture.expectedToExternalCalled,
                "toExternal was called"
            );
            if (oFixture.expectedToExternalCalled) {
                deepEqual(
                    oCrossApplicationNavigationService.toExternal.getCall(0).args,
                    oFixture.expectedToExternalCalledWith,
                    "toExternal was called with the expected arguments"
                );
            }

            strictEqual(
                window.history.go.callCount > 0,
                oFixture.expectedHistoryBackCalled,
                "historyBack was called"
            );
        });
    });

    [
        {
            testDescription: "sap-system is provided via component",
            sProvidedVia: "component"
        },
        {
            testDescription: "sap-system is provided via getCurrentApplication in url",
            sProvidedVia: "getCurrentApplication"
        },
        {
            testDescription: "sap-system is provided via getCurrentApplication in sap-system member",
            sProvidedVia: "getCurrentApplicationMember"
        },
        {
            testDescription: "sap-system is provided via getCurrentApplication and component",
            sProvidedVia: "both"
        }
    ].forEach(function (oFixture) {
        test("sap-system added on navigation when " + oFixture.testDescription, function () {
            var oShellNavigation = sap.ushell.Container.getService("ShellNavigation"),
                oNavTargetResolution = sap.ushell.Container.getService("NavTargetResolution"),
                oCAN = sap.ushell.Container.getService("CrossApplicationNavigation"),
                oComponent = new UIComponent();

            sinon.stub(oShellNavigation, "hrefForExternal").returns({/*don't care*/});
            sinon.stub(oShellNavigation, "toExternal").returns({/*don't care*/});
            sinon.stub(oNavTargetResolution, "isNavigationSupported").returns({/*don't care*/});

            if (oFixture.sProvidedVia === "component" ||
                oFixture.sProvidedVia === "both") {

                sinon.stub(oComponent, "getComponentData").returns({
                    startupParameters: { "sap-system": ["CURRENT"] }
                });
            }

            if (oFixture.sProvidedVia === "getCurrentApplication" ||
                oFixture.sProvidedVia === "both") {


                sinon.stub(oAppConfiguration, "getCurrentApplication").returns({
                    url: "/~/?sap-system=" + (oFixture.sProvidedVia === "both" ? "NOTRELEVANT" : "CURRENT")
                });
            }

            if (oFixture.sProvidedVia === "getCurrentApplicationMember") {
                sinon.stub(oAppConfiguration, "getCurrentApplication").returns({
                    "sap-system" : "CURRENT",
                    url: "/~/?sap-system=" + (oFixture.sProvidedVia === "both" ? "NOTRELEVANT" : "CUSSRENT")
                });
            }

            if (oFixture.sProvidedVia === "getCurrentApplication" || oFixture.sProvidedVia === "getCurrentApplicationMember") {
                oComponent = undefined;
            }

            function check(oArgs, oExpected) {
                oShellNavigation.hrefForExternal.reset();
                oCAN.hrefForExternal(JSON.parse(JSON.stringify(oArgs)), oComponent);
                deepEqual(oShellNavigation.hrefForExternal.args[0][0], oExpected,
                    "hrefForExternal: " + JSON.stringify(oArgs) + " -> " + JSON.stringify(oExpected));

                oShellNavigation.toExternal.reset();
                oCAN.toExternal(oArgs, oComponent);
                deepEqual(oShellNavigation.toExternal.args[0][0], oExpected,
                    "toExternal: " + JSON.stringify(oArgs) + " -> " + JSON.stringify(oExpected));

                oNavTargetResolution.isNavigationSupported.reset();
                oCAN.isNavigationSupported([oArgs], oComponent);
                deepEqual(oNavTargetResolution.isNavigationSupported.args[0][0], [oExpected],
                    "isNavigationSupported: " + JSON.stringify(oArgs) + " -> " + JSON.stringify(oExpected));
            }

            //code under test

            //shell navigation uses system of current app, other parameters unchanged
            check({params: {foo: "bar"}}, {params: {foo: "bar", "sap-system": "CURRENT"}});

            //shell navigation uses system of current app, target and no parameters
            check({target: {}}, {target: {}, params: {"sap-system": "CURRENT"}});

            //shell navigation uses system of current app, no overwrite of existing sap-system
            check({target: {}, params: {"sap-system": "OWNSYSTEM"}},
                {target: {}, params: {"sap-system": "OWNSYSTEM"}});

            //oArgs contains shellHash with params
            check({target: {shellHash: "SO-36?jumper=postman"}},
                {target: {shellHash: "SO-36?jumper=postman&sap-system=CURRENT"}});

            //oArgs contains shellHash without params
            check({target: {shellHash: "SO-36"}},
                {target: {shellHash: "SO-36?sap-system=CURRENT"}});

            //oArgs contains shellHash with param sap-system
            check({target: {shellHash: "SO-36?sap-system=OWNSYSTEM"}},
                {target: {shellHash: "SO-36?sap-system=OWNSYSTEM"}});
            check({target: {shellHash: "SO-36?asap-system=foo"}},
                {target: {shellHash: "SO-36?asap-system=foo&sap-system=CURRENT"}});
            check({target: {shellHash: "SO-36?sap-system="}},
                {target: {shellHash: "SO-36?sap-system="}});
            check({target: {}, params: {"sap-system": ""}},
                {target: {}, params: {"sap-system": ""}});

            //no change if shell hash is no string, see ShellNavigation.privhrefForExternalNoEnc
            check({target: {shellHash: 42}}, {target: {shellHash: 42}});

            if (oFixture.sProvidedVia === "component" ||
                oFixture.sProvidedVia === "both") {

                oComponent.getComponentData.restore();
            }

            if (oFixture.sProvidedVia === "getCurrentApplication" ||
                oFixture.sProvidedVia === "getCurrentApplicationMember" ||
                oFixture.sProvidedVia === "both") {

                oAppConfiguration.getCurrentApplication.restore();
            }

            // no change if current application URL has no sap-system parameter
            sinon.stub(oAppConfiguration, "getCurrentApplication").returns({ url: "/~/" });

            //no change if shell hash is no string, see ShellNavigation.privhrefForExternalNoEnc
            check({target: {shellHash: "SO-act"}}, {target: {shellHash: "SO-act"}});
        });
    });

    [
        "foo-bar",
        "#foo-bar"
    ].forEach(function (sNavigationIntent) {
        asyncTest("createComponentInstance: create a new component for a valid navigation intent " + sNavigationIntent, 5, function () {
            var oMockComponentInstance = {},
                oNavTargetResolutionStub = sinon.stub(sap.ushell.Container.getService("NavTargetResolution"), "resolveHashFragment", fnResolveHashFragmentMock),
                oSapUiComponentStub = sinon.stub(sap.ui, "component", fnSapUiComponentMock.bind(oMockComponentInstance));

            sap.ushell.Container.getService("CrossApplicationNavigation").createComponentInstance(sNavigationIntent)
                .done(function (oComponentInstance) {
                    start();
                    ok(oNavTargetResolutionStub.calledOnce, "NavTargetResolution service gets called");
                    ok(oNavTargetResolutionStub.calledWith("#foo-bar"), "called with correct parameter");
                    ok(oSapUiComponentStub.calledOnce, "sap.ui.compoment was called once!");
                    ok(oSapUiComponentStub.calledWith({
                        "async": true,
                        "asyncHints": {
                            "preloadBundles": aCoreExtLightPreloadBundles
                        },
                        "name": "foo.bar.Component",
                        "url": "/foo/bar/Component",
                        "componentData": {startupParameters: {}}
                    }), "sap.ui.componend gets called with the correct information");
                    equal(oComponentInstance, oMockComponentInstance, "Correct component instance returned!");
                })
                .fail(testUtils.onError);
        });
    });

    QUnit.test(
        "#createComponentInstance throws when passed an unexpected `oConfig` argument",
        function ( assert ) {
            var oCrossAppNavService = sap.ushell.Container
                    .getService( "CrossApplicationNavigation" );

            var sIntent = "#foo-bar";
            var rError = /`oConfig` argument should either be an empty object or contain only the `componentData` property\./;

            [
                {
                    oConfig: {
                        unsupportedProperty1: "unsupportedStringValue",
                        unsupportedProperty2: { },
                        unsupportedProperty3: 4,
                        componentData: { }
                    },
                    sAssertion: "Throws when more properties are present in `oConfig` argument other than `componentData`"
                },
                {
                    oConfig: {
                        unsupportedProperty1: { },
                        unsupportedProperty2: 4
                    },
                    sAssertion: "Throws when there are more than one properties in `oConfig`"
                },
                {
                    oConfig: {
                        unsupportedProperty: null
                    },
                    sAssertion: "Throws when a single available property  in `oConfig` is not `componentData`"
                }
            ].forEach( function ( oFixture ) {
                assert.throws( function () {
                    oCrossAppNavService
                        .createComponentInstance( sIntent, oFixture.oConfig );
                }, rError, oFixture.sAssertion );
            } );
        }
    );

    [
        { description : "with owner", withOwner : true },
        { description : "without owner", withOwner : false }
    ].forEach(function (oFixture) {
        asyncTest("createComponentInstance: runWithOwner owner properly propagated " + oFixture.description, 2, function () {
            var oNavTargetResolutionStub = sinon.stub(sap.ushell.Container.getService("NavTargetResolution"), "resolveHashFragment", fnResolveHashFragmentMock2),
                oOwnerComponent;

            if (oFixture.withOwner) {
                oOwnerComponent = new UIComponent({});
            } else {
                oOwnerComponent = undefined;
            }

            /* eslint-disable max-nested-callbacks */
            sap.ushell.Container.getService("CrossApplicationNavigation")
                .createComponentInstance("#foo-bar?A=B", {}, oOwnerComponent)
                .done(function (oComponentInstance) {
                    start();
                    var oOwner = Component.getOwnerComponentFor(oComponentInstance);

                    if (oFixture.withOwner === true) {
                        // in both cases, async and sync the owner should get set to the passed owner component
                        ok(oOwner === oOwnerComponent, "correct owner");
                    } else {
                        ok(oOwner === undefined, "correct owner");
                    }

                    ok(oNavTargetResolutionStub.calledOnce, "NavTargetResolution service gets called");
                })
                .fail(testUtils.onError);
        });
    });

    [
        "#foobar",
        "",
        "#foo -bar",
        undefined
    ].forEach(function (sNavigationIntent) {
        asyncTest("createComponentInstance: Invalid navigation intent", 3, function () {
            var oMockComponentInstance = {},
                oNavTargetResolutionStub = sinon.stub(sap.ushell.Container.getService("NavTargetResolution"), "resolveHashFragment", fnResolveHashFragmentMock),
                oSapUiComponentStub = sinon.stub(sap.ui, "component", fnSapUiComponentMock.bind(oMockComponentInstance));

            sap.ushell.Container.getService("CrossApplicationNavigation").createComponentInstance(sNavigationIntent)
                .done(testUtils.onError)
                .fail(function (sMessage) {
                    start();
                    strictEqual(sMessage, "Navigation intent invalid!", "Correct reject message received!");
                    ok(!oNavTargetResolutionStub.called, "NavTargetResolution service was never called!");
                    ok(!oSapUiComponentStub.called, "sap.ui.compoment was never called!");
                });
        });
    });

    asyncTest("createComponentInstance: create component with startup parameters", 3, function () {
        var oMockComponentInstance = {},
            oNavTargetResolutionStub = sinon.stub(sap.ushell.Container.getService("NavTargetResolution"), "resolveHashFragment", fnResolveHashFragmentMock),
            oSapUiComponentStub = sinon.stub(sap.ui, "component", fnSapUiComponentMock.bind(oMockComponentInstance)),
            oExpectedComponentConfig = {
                "async": true,
                "asyncHints": {
                    "preloadBundles": aCoreExtLightPreloadBundles
                },
                "name": "foo.bar.Component",
                "url": "/foo/bar/Component",
                "componentData": {
                    "startupParameters": {
                        "P1": ["V1"],
                        "P2": ["V2"]
                    }
                }
            };

        sinon.stub(jQuery.sap, "isDeclared", function (sModuleName) {
            return !/^sap.fiori.core(?:-ext-light)?$/.test(sModuleName);
        });

        sap.ushell.Container.getService("CrossApplicationNavigation")
            .createComponentInstance("#foo-bar?P1=V1&P2=V2")
            .done(function (oComponentInstance) {
                start();
                equal(oNavTargetResolutionStub.args[0][0], "#foo-bar?P1=V1&P2=V2", "called with correct parameter");
                deepEqual(oSapUiComponentStub.args[0][0], oExpectedComponentConfig, "sap.ui.component gets called with the correct information");
                equal(oComponentInstance, oMockComponentInstance, "Correct component instance returned!");
            })
            .fail(testUtils.onError);
    });

    asyncTest("createComponentInstance: resolving NWBC nav target", 3, function () {
        var oNavTargetResolutionStub = sinon.stub(sap.ushell.Container.getService("NavTargetResolution"), "resolveHashFragment", fnResolveHashFragmentMock),
            oSapUiComponentStub = sinon.stub(sap.ui, "component");

        sap.ushell.Container.getService("CrossApplicationNavigation").createComponentInstance("#foo-nwbc")
            .done(testUtils.onError)
            .fail(function (sMessage) {
                start();
                strictEqual(sMessage, "The resolved target mapping is not of type UI5 component.", "Proper error message returned!");
                ok(oNavTargetResolutionStub.calledOnce, "NavTargetResolution service was called once!");
                ok(!oSapUiComponentStub.called, "sap.ui.compoment was never called!");
            });
    });

    asyncTest("createComponentInstance: passing config contains componentData", 5, function () {
        var oMockComponentInstance = {},
            oNavTargetResolutionStub = sinon.stub(sap.ushell.Container.getService("NavTargetResolution"), "resolveHashFragment", fnResolveHashFragmentMock),
            oSapUiComponentStub = sinon.stub(sap.ui, "component", fnSapUiComponentMock.bind(oMockComponentInstance)),
            oConfig = {
                "componentData": {
                    "reference": {
                        "attr": "value"
                    }
                }
            };

        sinon.stub(jQuery.sap, "isDeclared", function (sModuleName) {
            return !/^sap.fiori.core(?:-ext-light)?$/.test(sModuleName);
        });

        sap.ushell.Container.getService("CrossApplicationNavigation").createComponentInstance("#foo-bar", oConfig)
            .done(function (oComponentInstance) {
                start();
                ok(oNavTargetResolutionStub.calledOnce, "NavTargetResolution service gets called");
                ok(oNavTargetResolutionStub.calledWith("#foo-bar"), "called with correct parameter");
                ok(oSapUiComponentStub.calledOnce, "sap.ui.compoment was called once!");
                ok(oSapUiComponentStub.calledWith({
                    "componentData": {
                        "reference": {
                            "attr": "value"
                        },
                        startupParameters : {}
                    },
                    "async": true,
                    "asyncHints": {
                        "preloadBundles": aCoreExtLightPreloadBundles
                    },
                    "name": "foo.bar.Component",
                    "url": "/foo/bar/Component"
                }), "sap.ui.componend gets called with the correct information");
                equal(oComponentInstance, oMockComponentInstance, "Correct component instance returned!");
            })
            .fail(testUtils.onError);
    });

    QUnit.test(
        "createComponentInstance: considers application dependencies specified in navigation target resolution result",
        function(assert){
            var oSapUiComponentStub;
            var done = assert.async();

            sinon.stub(
                sap.ushell.Container.getService("NavTargetResolution"),
                "resolveHashFragment",
                function resolveHashFragmentWithAsyncHints( sIntent ) {
                    return fnResolveHashFragmentMock( sIntent )
                        .then( function ( oAppProperties ) {
                            oAppProperties.applicationDependencies = {
                                asyncHints: {
                                    libs: [
                                        {
                                            name: "foo.bar.lib1"
                                        },
                                        {
                                            name: "foo.bar.lib2"
                                        }
                                    ]
                                }
                            };

                            return oAppProperties;
                        } );
                }
            );

            oSapUiComponentStub = sinon.stub(sap.ui, "component", fnSapUiComponentMock.bind({}));

            sap.ushell.Container.getService("CrossApplicationNavigation")
                .createComponentInstance("#foo-bar")
                .then(function(){
                    assert.deepEqual(
                        oSapUiComponentStub.args[0][0],
                        {
                            async: true,
                            asyncHints: {
                                libs: [
                                    { name: "foo.bar.lib1" },
                                    { name: "foo.bar.lib2" }
                                ],
                                preloadBundles: aCoreExtLightPreloadBundles
                            },
                            name: "foo.bar.Component",
                            url: "/foo/bar/Component",
                            componentData: {
                                startupParameters: {}
                            }
                        }
                    );
                })
                .then(done, done);
        }
    );

    QUnit.test(
        "Irrelevant data added to componentData are removed",
        function(assert){
            var oSapUiComponentStub;
            var done = assert.async();

            sinon.stub(
                sap.ushell.Container.getService("NavTargetResolution"),
                "resolveHashFragment",
                function resolveHashFragmentWithAsyncHints( sIntent ) {
                    return fnResolveHashFragmentMock( sIntent )
                        .then( function ( oAppProperties ) {
                            oAppProperties.applicationDependencies = {
                                asyncHints: {
                                    libs: [
                                        {
                                            name: "foo.bar.lib1"
                                        },
                                        {
                                            name: "foo.bar.lib2"
                                        }
                                    ]
                                }
                            };

                            return oAppProperties;
                        } );
                }
            );

            oSapUiComponentStub = sinon.stub(sap.ui, "component", fnSapUiComponentMock.bind({}));

            sap.ushell.Container.getService("CrossApplicationNavigation")
                .createComponentInstance( "#foo-bar", {
                    componentData: {
                        startupParameters: {
                            a: [ "1" ],
                            b: [ "2" ]
                        },
                        config: { },
                        "sap-xapp-state": "irrelevant data",
                        "non-problematic data": [ "OK data" ]
                    }
                } )
                .then(function(){
                    assert.deepEqual(
                        oSapUiComponentStub.args[0][0],
                        {
                            async: true,
                            asyncHints: {
                                libs: [
                                    { name: "foo.bar.lib1" },
                                    { name: "foo.bar.lib2" }
                                ],
                                preloadBundles: aCoreExtLightPreloadBundles
                            },
                            name: "foo.bar.Component",
                            url: "/foo/bar/Component",
                            componentData: {
                                startupParameters: {},
                                "non-problematic data": [ "OK data" ]
                            }
                        }
                    );
                })
                .then(done, done);
        }
    );

    QUnit.test(
        "startup Parameters passed are ovewritten by startup parameters present in url",
        function(assert){
            var oSapUiComponentStub;
            var done = assert.async();

            sinon.stub(
                sap.ushell.Container.getService("NavTargetResolution"),
                "resolveHashFragment",
                function ( sIntent ) {
                    return fnResolveHashFragmentMock( sIntent )
                        .then( function ( oAppProperties ) {
                            oAppProperties.applicationDependencies = {
                                asyncHints: {
                                    libs: [
                                        {
                                            name: "foo.bar.lib1"
                                        },
                                        {
                                            name: "foo.bar.lib2"
                                        }
                                    ]
                                }
                            };

                            return oAppProperties;
                        } );
                }
            );

            oSapUiComponentStub = sinon.stub(sap.ui, "component", fnSapUiComponentMock.bind({}));

            sap.ushell.Container.getService("CrossApplicationNavigation")
                .createComponentInstance("#foo-bar?cc=dddd", {
                    componentData: {
                        startupParameters: {
                            a: ["1"],
                            b: ["2"]
                        }
                    }
                })
                .then(function(){
                    assert.deepEqual(
                        oSapUiComponentStub.args[0][0],
                        {
                            async: true,
                            asyncHints: {
                                libs: [
                                    { name: "foo.bar.lib1" },
                                    { name: "foo.bar.lib2" }
                                ],
                                preloadBundles: aCoreExtLightPreloadBundles
                            },
                            name: "foo.bar.Component",
                            url: "/foo/bar/Component",
                            componentData: {
                                startupParameters: {
                                    cc: ["dddd"]
                                }
                            }
                        }
                    );
                })
                .then(done, done);
        }
    );

    [
        {
            description: "when internal query matches multiple links tagged with"
                + " [ \"primaryAction\" ], the first link based on "
                + "left-right-lexicographic order should be selected",
            mockGetLinks: {
                firstCallData: jQuery.when( [
                    {
                        intent: "#so-ccdd?A=B",
                        tags: [ "primaryAction" ]
                    },
                    {
                        intent: "#so-ccdd?A=B&C=D",
                        tags: [ "primaryAction" ]
                    },
                    {
                        intent: "#so-aa",
                        tags: [ "primaryAction" ]
                    },
                    { // !
                        intent: "#so-a0?a=B",
                        tags: [ "primaryAction" ]
                    },
                    {
                        intent: "#so-aa?A=B",
                        tags: [ "primaryAction" ]
                    },
                    { // !
                        intent: "#so-a0?A=b",
                        tags: [ "primaryAction" ]
                    },
                    {
                        intent: "#so-ab?A=B&C=e&C=j",
                        tags: [ "primaryAction" ]
                    }
                ] )
            },
            input: {
                so: "so",
                params: { }
            },
            expectedSuperiorLink: {
                intent: "#so-a0?A=b",
                tags: [ "primaryAction" ]
            },
            message: "Link with intent \"#so-a0?A=b\" should be selected."
        },
        {
            description: "when first internal query with "
                + "`tags = [ \"primaryAction\" ]` returns an empty list and a "
                + "second call without tags but with `action = \"displayFactSheet\"`"
                + " returns a non-empty list, the first link based on "
                + "left-right-lexicographic order should be selected",
            mockGetLinks: {
                firstCallData: jQuery.when( [ ] ),
                secondCallData: jQuery.when( [
                    {
                        intent: "#so-displayFactSheet?A=aB"
                    },
                    {
                        intent: "#so-displayFactSheet?A=a&C=D"
                    },
                    {
                        intent: "#so-displayFactSheet?a=g"
                    },
                    {
                        intent: "#so-displayFactSheet?a=B"
                    },
                    { // !
                        intent: "#so-displayFactSheet?A=B"
                    },
                    {
                        intent: "#so-displayFactSheet?A=b"
                    },
                    {
                        intent: "#so-displayFactSheet?A=B&C=e&C=j"
                    }
                ] )
            },
            input: {
                so: "so",
                params: { }
            },
            expectedSuperiorLink: {
                intent: "#so-displayFactSheet?A=B"
            },
            message: "Link with intent \"#so-displayFactSheet?A=B\" should be selected."
        },
        {
            description: "when first and second internal queries for links "
                    + "both return an empty list, null should be returned.",
            mockGetLinks: {
                firstCallData: jQuery.when( [ ] ),
                secondCallData: jQuery.when( [ ] )
            },
            input: {
                so: "so",
                params: { }
            },
            expectedSuperiorLink: null,
            message: "No link, null is returned."
        }
    ].forEach( function ( oFixture ) {
        QUnit.test(
            "#getPrimaryIntent: " + oFixture.description,
            function ( assert ) {
                var fnDoneTesting = assert.async();
                var oContainer = sap.ushell.Container;

                var oCrossAppNavService = oContainer.getService( "CrossApplicationNavigation" );

                var fnGetLinks = sinon.stub( oCrossAppNavService, "getLinks" );
                fnGetLinks.onCall( 0 )
                    .returns( oFixture.mockGetLinks.firstCallData );

                if ( oFixture.mockGetLinks.secondCallData ) {
                    fnGetLinks.onCall( 1 )
                        .returns( oFixture.mockGetLinks.secondCallData );
                }

                oCrossAppNavService
                    .getPrimaryIntent( oFixture.input.so, oFixture.input.params )
                    .then( function ( oActualSuperiorLink ) {
                        assert.deepEqual(
                            oActualSuperiorLink,
                            oFixture.expectedSuperiorLink,
                            oFixture.message
                        );

                        if ( oFixture.mockGetLinks.secondCallData ) {
                            assert.ok( fnGetLinks.calledTwice, "CrossApplicationNavigation#getLinks is called twice" );
                        } else {
                            assert.ok( fnGetLinks.calledOnce, "CrossApplicationNavigation#getLinks is called once" );
                        }
                    } )
                    .then( fnDoneTesting, fnDoneTesting );
            }
        );
    } );

    module("sap.ushell.services.CrossApplicationNavigation", {
        setup: function () {
            try {
                delete localStorage["sap-ushell-enc-test"];
            } catch (e) { /* nop */ }
            jQuery.sap.getObject("services.CrossApplicationNavigation.config", 0, window["sap-ushell-config"])["sap-ushell-enc-test"] = true;
            stop();
            sap.ushell.bootstrap("local").then(start);
        },
        teardown: function () {
            delete sap.ushell.Container;
            delete window["sap-ushell-config"].services.CrossApplicationNavigation.config["sap-ushell-enc-test"];
            testUtils.restoreSpies(
                sap.ui.component,
                jQuery.sap.log.error,
                oAppConfiguration.getCurrentApplication
            );
        }
    });

    asyncTest("Test that sap-ushell-enc-test is added to URL in URL generating functions hrefForExternal, getSemanticObjectLinks", function () {
        var oCAN = sap.ushell.Container.getService("CrossApplicationNavigation"),
            oComponent = new UIComponent(),
            oRes;

        oRes = oCAN.hrefForExternal({ target : { shellHash : "#SO-action?a=b"} }, oComponent, false);

        ok(oRes.indexOf("sap-ushell-enc-test=A%2520B%252520C") >= 0," parameter added");

        oCAN.getSemanticObjectLinks("Action", {}, oComponent).done(function(aResult) {
            start();
            ok(aResult.length > 0,"at least one link");
            aResult.forEach(function(oLink) {
                ok(oLink.intent.indexOf("sap-ushell-enc-test=A%20B%2520C") >= 0, "parameter added");
            });
        });
    });

    test("Test that sap-ushell-enc-test is not added to the url for special shellHash #", function () {
        var oCAN = sap.ushell.Container.getService("CrossApplicationNavigation"),
            oComponent = new UIComponent(),
            oRes;

        oRes = oCAN.hrefForExternal({ target : { shellHash : "#"} }, oComponent, false);
        equal(oRes,"#","parameter not added!");
        ok(oRes.indexOf("sap-ushell-enc-test=A%2520B%252520C") === -1," parameter added");
        oRes = oCAN.hrefForExternal({ target : { shellHash : ""} }, oComponent, false);
        equal(oRes,"#","parameter not added!");
        ok(oRes.indexOf("sap-ushell-enc-test=A%2520B%252520C") === -1," parameter added");

    });

    asyncTest("Test that sap-ushell-enc-test is added to URL in URL generating functions hrefForExternal, getSemanticObjectLinks with parameters", function () {
        var oCAN = sap.ushell.Container.getService("CrossApplicationNavigation"),
            oComponent = new UIComponent(),
            oRes;

        oRes = oCAN.hrefForExternal({ target : { semanticObject : "SO", action : "action"}, params : { "A" : ["b"], "sap-ushell-enc-test" : "this shall not stand" } }, oComponent, false);

        equal(oRes, "#SO-action?A=b&sap-ushell-enc-test=A%2520B%252520C"," parameter added");

        oCAN.getSemanticObjectLinks("Action", {}, oComponent).done(function(aResult) {
            start();
            ok(aResult.length > 0,"at least one link");
            aResult.forEach(function(oLink) {
                ok(oLink.intent.indexOf("sap-ushell-enc-test=A%20B%2520C") >= 0, "parameter added");
            });
        });
    });

    [
        {
            testDescription: "string type, params, no inner app route",
            vIntent: "Action-toappnavsample?a=b&c=d",
            expectedResult: {
                intent: "Action-toappnavsample?a=b&c=d",
                innerAppRoute: "" // no inner app route given
            }
        },
        {
            testDescription: "object type, params, no inner app route",
            vIntent: {
                semanticObject: "Action",
                action: "toappnavsample",
                params: { a: "b", c: "d" }
            },
            expectedResult: {
                intent: {
                    semanticObject: "Action",
                    action: "toappnavsample",
                    params: { a: "b", c: "d" }
                },
                innerAppRoute: "" // no inner app route given
            }
        },
        {
            testDescription: "object type, params, empty inner app route",
            vIntent: {
                semanticObject: "Action",
                action: "toappnavsample",
                params: { a: "b", c: "d" },
                appSpecificRoute: ""
            },
            expectedResult: {
                innerAppRoute: "",  // empty given, empty returned
                intent: {
                    semanticObject: "Action",
                    action: "toappnavsample",
                    params: { a: "b", c: "d" }
                }
            }
        },
        {
            testDescription: "object type, params, app route starting without &/",
            vIntent: {
                semanticObject: "Action",
                action: "toappnavsample",
                params: { a: "b", c: "d" },
                appSpecificRoute: "inner/app/route"
            },
            expectedResult: {
                innerAppRoute: "&/inner/app/route",  // '&/' is added
                intent: {
                    semanticObject: "Action",
                    action: "toappnavsample",
                    params: { a: "b", c: "d" }
                }
            }
        },
        {
            testDescription: "object type with no inner app route in shellHash",
            vIntent: {
                target: {
                    shellHash: "Action-toappnavsample?a=b&c=d"
                }
            },
            expectedResult: {
                innerAppRoute: "",
                intent: {
                    target: { shellHash: "Action-toappnavsample?a=b&c=d" }
                }
            }
        },
        {
            testDescription: "object type with no intent parameters and '&/' as inner app route",
            vIntent: {
                target: {
                    shellHash: "Action-toappnavsample&/"
                }
            },
            expectedResult: {
                innerAppRoute: "&/",  // separator is actually part of inner-app route
                intent: {
                    target: { shellHash: "Action-toappnavsample" }
                }
            }
        },
        {
            testDescription: "object type with inner app route in shellHash",
            vIntent: {
                target: {
                    shellHash: "Action-toappnavsample?a=b&c=d&/Some/inner/app/route"
                }
            },
            expectedResult: {
                innerAppRoute: "&/Some/inner/app/route",
                intent: {
                    target: { shellHash: "Action-toappnavsample?a=b&c=d" }
                }
            }
        },
        {
            testDescription: "string type with inner app route",
            vIntent: "Action-toappnavsample?a=b&c=d&/Some/inner/app/route",
            expectedResult: {
                innerAppRoute: "&/Some/inner/app/route",
                intent: "Action-toappnavsample?a=b&c=d"
            }
        },
        {
            testDescription: "object type, params, with inner app route",
            vIntent: {
                semanticObject: "Action",
                action: "toappnavsample",
                params: { a: "b", c: "d" },
                appSpecificRoute: { any: "input" }
            },
            expectedResult: {
                innerAppRoute: { any: "input" }, // leave value untouched
                intent: {
                    semanticObject: "Action",
                    action: "toappnavsample",
                    params: { a: "b", c: "d" }
                }
            }
        },
        {
            testDescription: "strange object as input",
            vIntent: {
                "a": { "b": "c" }
            },
            expectedResult: {
                innerAppRoute: "", // none could be extracted found
                intent: {          // leave untouched
                    "a": { "b": "c" }
                }
            }
        },
        {
            testDescription: "inner app route containing multiple separators",
            vIntent: "Action-toappnavsample?a=b&c=d&/Some/inner&/app/route",
            expectedResult: {
                intent: "Action-toappnavsample?a=b&c=d",
                innerAppRoute: "&/Some/inner&/app/route"
            }
        }
    ].forEach(function (oFixture) {
        test("_extractInnerAppRoute: removes inner app route from the given target as expected when " + oFixture.testDescription, function () {
            sinon.stub(jQuery.sap.log, "error");

            var oCrossAppNavService = sap.ushell.Container.getService("CrossApplicationNavigation");

            var oResult = oCrossAppNavService._extractInnerAppRoute(oFixture.vIntent);

            deepEqual(oResult, oFixture.expectedResult, "method returned the expected result");

            if (Object.prototype.toString.apply(oFixture.vIntent) === "[object Object]") {
                strictEqual(oFixture.vIntent, oResult.intent,
                    "the .target member is the same as the one given as input");
            }

            strictEqual(jQuery.sap.log.error.callCount, 0, "jQuery.sap.log.error was not called");
        });
    });

    [
        {
            testDescription: "x-app-state is passed",
            oCallArgs: {
                semanticObject: "Object", action: "action",
                params: {
                    "sap-xapp-state": JSON.stringify({
                        a: "123"
                    })
                }
            },
            expectAppStateGenerated: false,
            expectedFirstCallArg: {
                semanticObject: "Object", action: "action",
                params: {
                    "sap-xapp-state": JSON.stringify({
                        a: "123"
                    }),
                    "sap-ushell-enc-test": [ "A B%20C" ]
                }
            }
        },
        {
            testDescription: "x-app-state-data is passed",
            oCallArgs: {
                semanticObject: "Object", action: "action",
                params: {
                    "sap-xapp-state-data": JSON.stringify({
                        a: "123"
                    }),
                    "sap-ushell-enc-test": [ "A B%20C" ]
                }
            },
            expectAppStateGenerated: true,
            expectedFirstCallArg: {
                semanticObject: "Object", action: "action",
                params: {
                    "sap-xapp-state": "APP_STATE_KEY",
                    "sap-ushell-enc-test": [ "A B%20C" ]
                }
            }
        },
        {
            testDescription: "x-app-state-data is not passed",
            oCallArgs: {
                semanticObject: "Object", action: "action",
                params: {
                    "A": ["1"]
                }
            },
            expectAppStateGenerated: false,
            expectedFirstCallArg: {
                semanticObject: "Object", action: "action",
                params: {
                    "A": ["1"],
                    "sap-ushell-enc-test": [ "A B%20C" ]
                }
            }
        },
        {
            testDescription: "sap x-app-state-data and sap-xapp-state are both passed",
            oCallArgs: {
                semanticObject: "Object", action: "action",
                params: {
                    "A": ["1"],
                    "sap-xapp-state": "ABCDE",
                    "sap-xapp-state-data": JSON.stringify({ a: "b", c: "d" }),
                    "sap-ushell-enc-test": [ "A B%20C" ]
                }
            },
            expectAppStateGenerated: true,
            expectedFirstCallArg: {
                semanticObject: "Object", action: "action",
                params: {
                    "A": ["1"],
                    "sap-xapp-state": "APP_STATE_KEY",
                    "sap-ushell-enc-test": [ "A B%20C" ]
                }
            }
        },
        {
            testDescription: "sap x-app-state-data passed in a string URL",
            oCallArgs: {
                target: {
                    shellHash: oURLParsingService.constructShellHash({
                        semanticObject: "A",
                        action: "b",
                        params: { "sap-xapp-state-data" : JSON.stringify({ p1: "v1", p2: "v2" }) }
                    })
                }
            },
            expectAppStateGenerated: true,
            expectedFirstCallArg: {
                    "target": {
                        "shellHash": "A-b?sap-xapp-state=APP_STATE_KEY&sap-ushell-enc-test=A%20B%2520C"
                    }
            }
        },
        {
            testDescription: "badly encoded sap x-app-state-data passed in a string URL",
            oCallArgs: {
                target: {
                    shellHash: oURLParsingService.constructShellHash({
                        semanticObject: "A",
                        action: "b",
                        params: { "sap-xapp-state-data" : "{p1:v1, p2:v2}" }
                    })
                }
            },
            expectAppStateGenerated: false,
            expectedFirstCallArg: {
                    "target": {
                        "shellHash": "A-b?sap-ushell-enc-test=A%20B%2520C"
                    }
            },
            expectedErrorCall: [
                "Cannot parse the given string to object",
                "{p1:v1, p2:v2}",
                "sap.ushell.services.CrossApplicationNavigation"
            ]
        }
    ].forEach(function (oFixture) {

        var aShellNavigationTestMethods = [
            "toExternal",
            "hrefForExternal"
        ];

        aShellNavigationTestMethods.forEach(function (sTestMethod) {
            test(sTestMethod + ": calls ShellNavigation with the expected arguments when " + oFixture.testDescription, function () {

                // Arrange
                var oCrossAppNavService = sap.ushell.Container.getService("CrossApplicationNavigation");
                var oComponent = {
                    getComponentData: sinon.stub().returns({
                        startupParameters: {}
                    })
                };
                var oFakeShellNavigationService = aShellNavigationTestMethods.reduce(function (o, sMethod) {
                    o[sMethod] = sinon.stub();
                    return o;
                }, {});

                var oFakeAppState = {
                    setData: sinon.stub(),
                    save: sinon.stub(),
                    getKey: sinon.stub().returns("APP_STATE_KEY")
                };

                var oFakeAppStateService = {
                    createEmptyAppState: sinon.stub().returns(oFakeAppState)
                };

                var oSapUshellContainerStub = sinon.stub(sap.ushell.Container, "getService");
                oSapUshellContainerStub.withArgs("ShellNavigation").returns(oFakeShellNavigationService);
                oSapUshellContainerStub.withArgs("AppState").returns(oFakeAppStateService);
                oSapUshellContainerStub.withArgs("URLParsing").returns(oURLParsingService);

                sinon.stub(jQuery.sap.log, "error");

                // Act
                oCrossAppNavService[sTestMethod](oFixture.oCallArgs, oComponent, false /* bAsync */);

                // Assert
                strictEqual(oFakeShellNavigationService[sTestMethod].callCount, 1, sTestMethod + " was called once");
                if (oFakeShellNavigationService[sTestMethod].callCount === 1) {
                    var oShellNavigationCall = oFakeShellNavigationService[sTestMethod].getCall(0);
                    var oShellNavigationCallFirstArg = oShellNavigationCall.args[0];

                    deepEqual(
                        oShellNavigationCallFirstArg,
                        oFixture.expectedFirstCallArg,
                        "ShellNavigation was called with the expected first argument"
                    );
                }

                var iErrorCallCount = jQuery.sap.log.error.callCount;
                if (oFixture.expectedErrorCall) {
                    strictEqual(iErrorCallCount, 1, "one error was logged on the console");
                    if (iErrorCallCount === 1) {
                        deepEqual(
                            jQuery.sap.log.error.getCall(0).args,
                            oFixture.expectedErrorCall,
                            "jQuery.sap.log.error was called with the expected arguments"
                        );
                    }
                } else {
                    strictEqual(iErrorCallCount, 0, "jQuery.sap.log.error was not called");
                }

                if (oFixture.expectAppStateGenerated) {
                    strictEqual(oFakeAppState.save.callCount, 1, "AppState#save method was called 1 time");
                } else {
                    strictEqual(oFakeAppState.save.callCount, 0, "AppState#save method was not called");
                }
            });
        });
    });

    test("_extractInnerAppRoute: logs an error when invalid parameter type is given", function () {
        sinon.stub(jQuery.sap.log, "error");

        var oCrossAppNavService = sap.ushell.Container.getService("CrossApplicationNavigation");

        var oResult = oCrossAppNavService._extractInnerAppRoute(12345);

        strictEqual(jQuery.sap.log.error.callCount, 1, "jQuery.sap.log.error was called 1 time");

        deepEqual(jQuery.sap.log.error.getCall(0).args, [
            "Invalid input parameter",
            "expected string or object",
            "sap.ushell.services.CrossApplicationNavigation"
        ], "jQuery.sap.log.error was called with the expected parameters");

        deepEqual(oResult, { intent: 12345 }, "method returned the expected result");
    });

    [
        {
            testDescription: "a string intent is given",
            vIntent: "Object-action",
            sInnerAppRoute: "&/inner/app/route",
            expectedResult: "Object-action&/inner/app/route"
        },
        {
            testDescription: "an object intent with target shell hash is given",
            vIntent: { target: { shellHash: "Object-action" } },
            sInnerAppRoute: "&/inner/app/route",
            expectedResult: { target: { shellHash: "Object-action&/inner/app/route" } }
        },
        {
            testDescription: "an object intent without target shell hash is given",
            vIntent: { strange: "object" },
            sInnerAppRoute: "&/inner/app/route",
            expectedResult: { strange: "object", appSpecificRoute: "&/inner/app/route" }
        },
        {
            testDescription: "null inner app route is given together with an object intent",
            vIntent: { strange: "object" },
            sInnerAppRoute: null,
            expectedResult: { strange: "object" }
        },
        {
            testDescription: "undefined inner app route is given together with an object intent",
            vIntent: { strange: "object" },
            sInnerAppRoute: undefined,
            expectedResult: { strange: "object" }
        },
        {
            testDescription: "empty inner app route is given together with an object intent",
            vIntent: "Object-action",
            sInnerAppRoute: "",
            expectedResult: "Object-action"
        },
        {
            testDescription: "only separator is given as inner app route together with a string intent",
            vIntent: "Object-action",
            sInnerAppRoute: "&/",
            expectedResult: "Object-action&/"
        },
        {
            testDescription: "null intent is given with inner app route",
            vIntent: null,
            sInnerAppRoute: "&/inner/app/route",
            expectedResult: null
        },
        {
            testDescription: "unsupported input intent parameter is given",
            vIntent: 12345,
            sInnerAppRoute: "&/inner/app/route",
            expectedResult: 12345
        }
    ].forEach(function (oFixture) {
        QUnit.test("_injectInnerAppRoute: injects the given app route when " + oFixture.testDescription, function (assert) {

            sinon.stub(jQuery.sap.log, "error");

            var oCrossAppNavService = sap.ushell.Container.getService("CrossApplicationNavigation");

            var vResult = oCrossAppNavService._injectInnerAppRoute(oFixture.vIntent, oFixture.sInnerAppRoute);

            deepEqual(vResult, oFixture.expectedResult, "method returned the expected result");

            if (Object.prototype.toString.apply(oFixture.vIntent) === "[object Object]") {
                strictEqual(oFixture.vIntent, vResult,
                    "the returned result is actually the input object");
            }

            strictEqual(jQuery.sap.log.error.callCount, 0, "jQuery.sap.log.error was not called");
        });
    });

    [
        {
            testDescription: "no inner app route given",
            oInputArgs: { target: {shellHash: "Object-action?p1=v1" } },
            expectedHref: "#Object-action?p1=v1&sap-system=XXX&sap-ushell-navmode=thenavmode"
        },
        {
            testDescription: "inner app route given",
            oInputArgs: { target: {shellHash: "Object-action?p1=v1&/inner/app/route" } },
            expectedHref: "#Object-action?p1=v1&sap-system=XXX&sap-ushell-navmode=thenavmode&/inner/app/route"
        }
    ].forEach(function (oFixture) {
        test("hrefForExternal: appends sap-ushell-enc and sap-ushell-navmode before inner app route when " + oFixture.testDescription, function () {
            var oCrossAppNavService = sap.ushell.Container.getService("CrossApplicationNavigation");

            sinon.stub(oAppConfiguration, "getCurrentApplication").returns({
                "sap-system": "XXX",
                url: "http://www.example.com?sap-system=YYY",
                "sap-ushell-next-navmode": "thenavmode"
            });

            var sHref = oCrossAppNavService.hrefForExternal(
                oFixture.oInputArgs,
                null, /* oComponent, null: use data from getCurrentApplication */
                false /* bAsync */
             );

            strictEqual(sHref, oFixture.expectedHref, "obtained the expected link");
        });

    });


    test("toExternal: calls ShellNavigation.toExternal as expected when writeHistory argument is passed in", function () {
        // Arrange
        var oCrossApplicationNavigation = sap.ushell.Container.getService("CrossApplicationNavigation"),
            oToExternalStub = sinon.stub(),
            oGetServiceStub = sinon.stub(sap.ushell.Container, "getService");

        oGetServiceStub.withArgs("ShellNavigation").returns({
            toExternal: oToExternalStub
        });
        oGetServiceStub.withArgs("AppLifeCycle").returns();
        sinon.stub(oAppConfiguration, "getCurrentApplication");
        oGetServiceStub.throws("this test expects toExternal to only call getService('ShellNavigation') and getService('AppLifeCycle')");

        // Act
        oCrossApplicationNavigation.toExternal({
            target: { shellHash: "#What-ever" },
            writeHistory: true
        });

        // Assert
        strictEqual(oToExternalStub.callCount, 1, "toExternal was called 1 time");
        strictEqual(oToExternalStub.getCall(0).args.length, 3, "toExternal was called with 3 arguments");
        strictEqual(oToExternalStub.getCall(0).args[2], true, "the 3rd argument is as expected");

    });

    test("toExternal: adds sap-ushell-enc-test to URL", function () {
        var oCAN = sap.ushell.Container.getService("CrossApplicationNavigation"),
            oComponent = new UIComponent(),
            oRes,
            oStub;
        oStub = sinon.stub(sap.ushell.Container.getService("ShellNavigation").hashChanger,"privsetHash");

        oCAN.toExternal({ target : { shellHash : "#SO-action?a=b"} }, oComponent, false);
        oRes = oStub.args[0][0];
        ok(oRes.indexOf("sap-ushell-enc-test=A%20B%2520C") >= 0," parameter added");
        oStub.restore();
    });

    test("toExternal: adds sap-ushell-enc-test to URL with inner app route", function () {
        var oCAN = sap.ushell.Container.getService("CrossApplicationNavigation"),
            oComponent = new UIComponent(),
            sSetHash,
            oPrivSetHashStub;

        oPrivSetHashStub = sinon.stub(sap.ushell.Container.getService("ShellNavigation").hashChanger,"privsetHash");

        oCAN.toExternal({ target : { shellHash : "#SO-action?a=b&/inner/app/route"} }, oComponent, false);
        sSetHash = oPrivSetHashStub.args[0][0];
        ok(sSetHash.indexOf("a=b") >= 0,"a=b parameter is present in the url");
        ok(sSetHash.indexOf("sap-ushell-enc-test=A%20B%2520C") >= 0," parameter added");
        strictEqual(!!sSetHash.match(/&[/]inner[/]app[/]route$/), true, "the url that was set after toExternal ends with inner app route");

        oPrivSetHashStub.restore();
    });

    test("sap-ushell-enc-test can be disabled via local storage setting", 3, function () {
        var oCAN = sap.ushell.Container.getService("CrossApplicationNavigation"),
            oComponent = new UIComponent(),
            oRes,
            oStub;
        oStub = sinon.stub(sap.ushell.Container.getService("ShellNavigation").hashChanger,"privsetHash");
        localStorage["sap-ushell-enc-test"] = "false";
        oCAN.toExternal({ target : { shellHash : "#SO-action?a=b"} }, oComponent, false);
        oRes = oStub.args[0][0];
        ok(oRes.indexOf("sap-ushell-enc-test=A%20B%2520C") === -1," parameter not added, disabled via localStorage");
        localStorage["sap-ushell-enc-test"] = "true";
        oCAN.toExternal({ target : { shellHash : "#SO-action?a=b"} }, oComponent, false);
        oRes = oStub.args[1][0];
        ok(oRes.indexOf("sap-ushell-enc-test=A%20B%2520C") >= 0," parameter added, enabled via localStorage");
        localStorage && delete localStorage["sap-ushell-enc-test"];
        oCAN.toExternal({ target : { shellHash : "#SO-action?a=b"} }, oComponent, false);
        oRes = oStub.args[2][0];
        ok(oRes.indexOf("sap-ushell-enc-test=A%20B%2520C") >= 0," parameter added, enabled via config");
        oStub.restore();
    });

    // ------------------- App state tests -------------------
    module("sap.ushell.services.CrossApplicationNavigation - App state", {
        setup: function () {
            window["sap-ushell-config"] = {
                services: {
                    AppState: {
                        adapter: {
                            module: "sap.ushell.adapters.local.AppStateAdapter"  // re-use adapter from local platform
                        }
                    }
                }
            };
            stop();
            sap.ushell.bootstrap("local").then(start);
        },
        teardown: function () {
            testUtils.restoreSpies(sap.ushell.Container.getService("AppState").getContainer);
            delete sap.ushell.Container;
        }
    });

    test("CreateEmptyAppState : ctor", function () {
        var oCrossAppNavigationService,
            oAppState,
            oCreateEmptyAppStateSpy,
            oAppComponent,
            bTransient = true;

        // Arrange
        oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        oAppComponent = new UIComponent();
        oCreateEmptyAppStateSpy = sinon.spy(sap.ushell.Container.getService("AppState"), "createEmptyAppState");

        // Act
        oAppState = oCrossAppNavigationService.createEmptyAppState(oAppComponent, bTransient);

        // Assert
        assert.ok(oAppState, "Success: app state object was returned");
        assert.ok(typeof oAppState.setData === 'function', "Success: app state has method setData");
        assert.ok(oAppState.setItemValue === undefined, "app state has no method setItemValue");

        strictEqual(oCreateEmptyAppStateSpy.callCount, 1,
            "AppState service createEmptyAppState called exactly once" );
        deepEqual(oCreateEmptyAppStateSpy.args[0][0], oAppComponent,
            "AppState service createEmptyAppState called with correct app component");
        deepEqual(oCreateEmptyAppStateSpy.args[0][1], bTransient,
            "AppState service createEmptyAppState called with correct transient flag");

        oCreateEmptyAppStateSpy.restore();
    });

    test("CreateEmptyAppState : no Component passed", function () {
        var oCrossAppNavigationService,
            cnt = 0,
            oAppComponent;
        // Arrange
        oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        oAppComponent = {};
        // Act
        try {
            oCrossAppNavigationService.createEmptyAppState(oAppComponent);
            ok(false, "Should not get here!");
        } catch (ex) {
            cnt = cnt + 1;
        }
        // Act
        try {
            oCrossAppNavigationService.createEmptyAppState(undefined);
            ok(false, "Should not get here!");
        } catch (ex2) {
            cnt = cnt + 1;
        }
        equal(cnt, 2, "got two exceptions");
    });

    test("Execute operations on app state", function () {
        var oCrossAppNavigationService,
            oAppState,
            oAppComponent,
            oItemValue;

        // Arrange
        oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        oAppComponent = new UIComponent();
        oItemValue = {
            one: "one!",
            two: "two?"
        };
        // Act
        oAppState = oCrossAppNavigationService.createEmptyAppState(oAppComponent);
        oAppState.setData(oItemValue);
        assert.deepEqual(oAppState.getData(), oItemValue, "Success: app state can store object values");
        ok(oItemValue !== oAppState.getData(), "not object returned");
    });

    asyncTest("expandCompactHash", function () {
        var oCrossAppNavigationService,
            oAppState;

        // Arrange
        oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        // Act
        oAppState = oCrossAppNavigationService.createEmptyAppState(new UIComponent());
        oAppState.setData("&AAA=333");
        oAppState.save().done(function () {
                oCrossAppNavigationService.expandCompactHash("#SO-action?AAA=444&sap-intent-param=" + oAppState.getKey() + "&CCC=DDD").
                done(function (sExpandedHash) {
                    start();
                    equal(sExpandedHash,"#SO-action?AAA=444&AAA=333&CCC=DDD", "expanded OK");
                });
            });
    });


    asyncTest("getStartupAppState", function () {
        var oCrossAppNavigationService,
            oAppComponent,
            oGetContainerSpy;

        // Arrange
        oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        oAppComponent = new UIComponent();
        oAppComponent.
            getComponentData = function () {
                return { "sap-xapp-state" : ["AKEY"] };
            };
        oGetContainerSpy = sinon.spy(sap.ushell.Container.getService("AppState"), "getAppState");
        // Act
        oCrossAppNavigationService.getStartupAppState(oAppComponent)
            .done(function (oAppState) {
                start();
                // Assert
                assert.ok(oAppState, "Success: app state object was returned");
                assert.ok(typeof oAppState.getData === 'function', "Success: app state has method getData");
                assert.ok(oAppState.setData === undefined, "Success: app state does not have method setData");
            });
        equal(oGetContainerSpy.calledOnce, true, "getContainer was called");
        equal(oGetContainerSpy.args[0][0], "AKEY", "getContainer was called with correct key");
        oGetContainerSpy.restore();
    });


    asyncTest("getStartupAppState no state present", function () {
        var oCrossAppNavigationService,
            oAppComponent;

        // Arrange
        oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        oAppComponent = new UIComponent();
        oAppComponent.getComponentData = function () {
            return { "sap-xapp-state" : undefined };
        };

        // Act
        oCrossAppNavigationService.getStartupAppState(oAppComponent)
            .done(function (oAppState) {
                start();
                // Assert
                assert.ok(oAppState, "Success: app state object was returned");
                assert.ok(typeof oAppState.getData === 'function', "Success: app state has method getData");
                assert.ok(oAppState.setData === undefined, "Success: app state does not have method setData");
            });
    });


    asyncTest("getAppState", function () {
        var oCrossAppNavigationService,
            oAppComponent,
            oGetContainerSpy;

        // Arrange
        oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        oAppComponent = new UIComponent();
        oAppComponent.
            getComponentData = function () {
                return { "sap-xapp-state" : ["AKEY"] };
            };
        oGetContainerSpy = sinon.spy(sap.ushell.Container.getService("AppState"), "getAppState");
        oCrossAppNavigationService.getAppState(oAppComponent, "AKEY")
            .done(function (oAppState) {
                start();
                // Assert
                assert.ok(oAppState, "Success: app state object was returned");
                assert.ok(typeof oAppState.getData === 'function', "Success: app state has method getData");
                assert.ok(oAppState.setData === undefined, "Success: app state does not have method setData");
            });
        equal(oGetContainerSpy.calledOnce, true, "getContainer was called");
        equal(oGetContainerSpy.args[0][0], "AKEY", "getContainer was called with correct key");
        oGetContainerSpy.restore();
    });

    [  { description: "bad key type ", oComponent : "<comp>" , sKey : 13 , errorlog : true },
       { description: "bad key ", oComponent : "<comp>" , sKey : undefined , errorlog : false}
    ].forEach(function (oFixture) {
        asyncTest("getAppState bad states" + oFixture.description , function () {
            var oCrossAppNavigationService,
                oAppComponent,
                oGetContainerSpy;
                // Arrange
                oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
                oAppComponent = new UIComponent();
                if (oFixture.oComponent === "<comp>") {
                    oAppComponent = new UIComponent();
                } else {
                    oAppComponent = oFixture.oComponent;
                }
                oGetContainerSpy = sinon.spy(sap.ushell.Container.getService("AppState"), "getAppState");
                oCrossAppNavigationService.getAppState(oAppComponent, "AKEY")
                    .done(function (oAppState) {
                        start();
                        // Assert
                        assert.ok(oAppState, "Success: app state object was returned");
                        assert.ok(typeof oAppState.getData === 'function', "Success: app state has method getData");
                        assert.ok(oAppState.setData === undefined, "Success: app state does not have method setData");
                    });
                equal(oGetContainerSpy.calledOnce, true, "getContainer was called");
                equal(oGetContainerSpy.args[0][0], "AKEY", "getContainer was called with correct key");
                oGetContainerSpy.restore();
            });
       });


    asyncTest("getAppStateData", function () {
        var oCrossAppNavigationService,
            oGetContainerSpy;

        // Arrange
        oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        oGetContainerSpy = sinon.spy(sap.ushell.Container.getService("AppState"), "getAppState");
        oCrossAppNavigationService.getAppStateData("AKEY")
            .done(function (oAppState) {
                start();
                // Assert
                assert.equal(oAppState, undefined, "Success: app state object was returned");
            });
        equal(oGetContainerSpy.calledOnce, true, "getContainer was called");
        equal(oGetContainerSpy.args[0][0], "AKEY", "getContainer was called with correct key");
        oGetContainerSpy.restore();
    });


    asyncTest("getAppStateData spy, no data -> undefined", function () {
        var oCrossAppNavigationService,
            oGetContainerSpy;

        // Arrange
        oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        oGetContainerSpy = sinon.spy(sap.ushell.Container.getService("AppState"), "getAppState");
        oCrossAppNavigationService.getAppStateData("AKEY")
            .done(function (oAppState) {
                start();
                // Assert
                assert.equal(oAppState, undefined, "Success: app state data is undefined");
            });
        equal(oGetContainerSpy.calledOnce, true, "getContainer was called");
        equal(oGetContainerSpy.args[0][0], "AKEY", "getContainer was called with correct key");
        oGetContainerSpy.restore();
    });


    asyncTest("getAppStateData with data", function () {
        var oCrossAppNavigationService,
            oAppState,
            oAppComponent,
            sKey;
        oAppComponent = new UIComponent();
        oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        oAppState = oCrossAppNavigationService.createEmptyAppState(oAppComponent,"ANewKey");
        oAppState.setData({ here: "isthedata"});
        sKey = oAppState.getKey();
        oAppState.save().fail(function() {
            ok(false,"Should not get here");
        }).done(function(){
            oCrossAppNavigationService.getAppStateData(sKey)
            .done(function (oAppStateData) {
                start();
                // Assert
                deepEqual(oAppStateData, {
                    "here": "isthedata"
                }, "Success: app state object was returned");
            });
        });
    });


    asyncTest("getAppStateData multiple invoke with some data and no data -> undefined", function () {
        var oCrossAppNavigationService,
        oAppState,
        oAppComponent,
        sKey;
        oAppComponent = new UIComponent();
        oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        oAppState = oCrossAppNavigationService.createEmptyAppState(oAppComponent,"ANewKey");
        oAppState.setData({ here: "isthedata"});
        sKey = oAppState.getKey();
        oAppState.save().fail(function() {
            ok(false,"Should not get here");
        }).done(function(){
            // Arrange
            oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
            oCrossAppNavigationService.getAppStateData([[sKey], ["BKEY"]])
            .done(function (oAppState) {
                start();
                // Assert
                deepEqual(oAppState, [[ {
                    "here": "isthedata"
                }],[undefined]], "Success: app state data is undefined");
            });
        });
    });

    //Navigable ?
    asyncTest("isUrlSupported non-Fiori link", function () {
        var oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        // Act
        oCrossAppNavigationService.isUrlSupported("https://www.google.de")
            .done(function () {
                start();
                ok(true,"should be supported");
            })
            .fail(function () {
                start();
                ok(false,"should not fail");
            });
    });

    var ourURI = (new URI(window.location.href)).normalize(),
        ourUriFullResource = ourURI.protocol() + "://" + ourURI.host() + ourURI.pathname();
    //Navigable ?
    [ { sUrl : "https://www.google.de" , bResult : true},
      { sUrl : "#LegalObject-doit?ABCDEF=HJK&def=kl&/xxss" , bResult : true},
      { sUrl : "#LegalObject-doit?ABCDEF=HJK&def=kl&/xxss" , bResult : false, reject : true},
      { sUrl : "#IllLegalObject-doit?ABCDEF=HJK&def=kl&/xxss" , bResult : false},
      { sUrl : ourUriFullResource + "#LegalObject-doit?ABCDEF=HJK&def=kl&/xxss" , bResult : true},
      { sUrl : "#IllLegalObject-doit?ABCDEF=HJK&def=kl&/xxss" , bResult : false},
      { sUrl : "#someotherhash" , bResult : true}, // not an intent!
      { sUrl : undefined, bResult : false},
      { sUrl : {}, bResult : false}
    ].forEach(function (oFixture) {
        asyncTest("isUrlSupported diverse links: " + oFixture.sUrl + "  force reject:" + oFixture.reject, function () {
            var oCrossAppNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
            sinon.stub(oCrossAppNavigationService,"isIntentSupported", function(aIntent) {
                var oDeferred = new jQuery.Deferred(),
                    bSupported = false,
                    oRes = {};
                if (aIntent[0].indexOf("#LegalObject-") === 0) {
                    bSupported = true;
                }

                if ( oFixture.reject) {
                    oDeferred.reject();
                }
                oRes[aIntent] = { supported : bSupported};
                oDeferred.resolve(oRes);
                return oDeferred.promise();
            });
            // Act
            oCrossAppNavigationService.isUrlSupported(oFixture.sUrl)
                .done(function () {
                    start();
                    ok(oFixture.bResult,"supported url");
                })
                .fail(function () {
                    start();
                    ok(!oFixture.bResult,"not supported url");
                });
        });
    });

});
