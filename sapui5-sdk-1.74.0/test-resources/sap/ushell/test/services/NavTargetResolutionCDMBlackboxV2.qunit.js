// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.require([
    "sap/ushell/services/AppConfiguration"
], function (
    // AppConfiguration
) {
    "use strict";

    /* global sinon, test, strictEqual, ok, deepEqual, module, asyncTest, start */

    /**
     * Starts the launchpad using the given configuration.
     *
     * @param {object} oSapUshellConfig The configuration to be added to <code>window["sap-ushell-config"]</code>
     */
    function bootstrapLaunchpadWithConfig (oSapUshellConfig) {
        stop();
        window["sap-ushell-config"] = oSapUshellConfig;
        sap.ushell.bootstrap("local").then(start);
    }

    /**
     * Re-sets the environment allowing another call to bootstrapLaunchpadWithConfig
     */
    function resetEnvironment () {
        delete sap.ushell.Container;
        delete window["sap-ushell-config"];
    }

    module("sap.ushell_abap.adapters.abap.NavTargetResolution: ", {
        setup: function () {
            jQuery.sap.require("sap.ushell.services.Container");

            bootstrapLaunchpadWithConfig({
                services: {
                    CommonDataModel: {
                        module: "sap.ushell.services.CommonDataModel",
                        adapter: {
                            module: "sap.ushell.adapters.cdm.CommonDataModelAdapter",
                            config: {
                                ignoreSiteDataPersonalization: true,
                                cdmSiteUrl: "../../test/services/NavTargetResolutionCDMBlackbox.testData.json"
                            }
                        }
                    },
                    ClientSideTargetResolution: { adapter: { module: "sap.ushell.adapters.cdm.ClientSideTargetResolutionAdapter" } },
                    Container: { adapter: { config: { language: "EN" } } },
                    LaunchPage: { adapter: { module: "sap.ushell.adapters.cdm.v3.LaunchPageAdapter" } },
                    NavTargetResolution: {
                        config: {
                            "runStandaloneAppFolderWhitelist": { "*": true },
                            allowTestUrlComponentConfig: true,
                            "enableClientSideTargetResolution": true
                        }
                    }
                }
            });
        },
        teardown: function () {
            resetEnvironment();
        }
    });
    var aResolveHashFragmentFixture = [
        {
            sHashFragmentToResolve: "#Action-toWDA",
            expectedPromiseResolve: true,
            expectedResolutionResult: {
                "applicationType": "NWBC",
                "navigationMode": "newWindowThenEmbedded",
                "targetNavigationMode": "explace",
                "reservedParameters": {},
                "sap-system": undefined,
                "text": "WDANavTarget display",
                "url": "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_PORTAL_NAV_TARGET/?sap-client=111&sap-language=EN&P2=P2DefValue&sap-ushell-defaultedParameterNames=%5B%22P2%22%5D",
                "inboundPermanentKey": undefined
            }
        }, {
            sHashFragmentToResolve: "#Action-tosu01",
            expectedPromiseResolve: true,
            expectedResolutionResult: {
                "applicationType": "TR",
                "navigationMode": "newWindowThenEmbedded",
                "targetNavigationMode": "explace",
                "reservedParameters": {},
                "sap-system": "U1YCLNT111",
                "text": "Maintain users",
                "url": "https://example.corp.com:44355/sap/bc/gui/sap/its/webgui;~service=32?%7etransaction=SU01&%7enosplash=1&sap-client=111&sap-language=EN",
                "inboundPermanentKey": undefined
            }
        }, {
            sHashFragmentToResolve: "#Action-toappnavsample",
            expectedPromiseResolve: true,
            expectedResolutionResult: {
                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                "applicationDependencies": { "url": "../../../../sap/ushell/demoapps/AppNavSample?A=URL" },
                "applicationType": "URL",
                "navigationMode": "embedded",
                "targetNavigationMode": "inplace",
                "sap-system": undefined,
                "text": "Demo actual title AppNavSample : Demos startup parameter passing ( albeit late bound in model!) and late instantiation of navigator in view (low level manual routing only)",
                "ui5ComponentName": "sap.ushell.demo.AppNavSample",
                "url": "../../../../sap/ushell/demoapps/AppNavSample?A=URL",
                "reservedParameters": {},
                "inboundPermanentKey": undefined
            }
        }, {
            sHashFragmentToResolve: "#Action-launchURL",
            expectedPromiseResolve: true,
            expectedResolutionResult: {
                "applicationType": "URL",
                "navigationMode": "newWindow",
                "targetNavigationMode": "explace",
                "reservedParameters": {},
                "sap-system": undefined,
                "text": "All the news thats fit to print",
                "url": "http://www.nytimes.com",
                "inboundPermanentKey": undefined
            }
        }, {
            sHashFragmentToResolve: "#Action-toNewsTile",
            expectedPromiseResolve: false,
            expectedResolutionResult: {}
        }
    ];

    aResolveHashFragmentFixture.forEach(function (oFixture) {
        asyncTest("resolveHashFragment without sap.ushell.services.AppConfiguration side effects: " + oFixture.sHashFragmentToResolve, function () {
            /*
             * When resolveHashFragment is called, we also call sap.ushell.services.AppConfiguration.setCurrentApplication
             * to store the application that was resolved. This is done with the assumption that the application will be opened.
             *
             * In a successive resolution, when the navigation mode is determined,
             * the sap.ushell.services.AppConfiguration.getCurrentApplication method is called and a certain navigation mode is determined.
             * In this test we stub these two methods away, to avoid obtaining different navigation modes
             * when the tests are run in sequence or in order. Another test that checks this should be made explicitly.
             */
            sinon.stub(sap.ushell.services.AppConfiguration, "setCurrentApplication");

            sap.ushell.Container.getService("NavTargetResolution").resolveHashFragment(oFixture.sHashFragmentToResolve)
                .done(function (oResolutionResult) {
                    if (oFixture.expectedPromiseResolve) {
                        ok(true, "resolveHashFragment promise for " + oFixture.sHashFragmentToResolve + " was resolved");
                        deepEqual(oResolutionResult, oFixture.expectedResolutionResult, oFixture.sHashFragmentToResolve + " has resolved to the expected result");
                    } else {
                        ok(false, "resolveHashFragment promise for " + oFixture.sHashFragmentToResolve + " was rejected");
                    }
                })
                .fail(function (sMessage) {
                    if (oFixture.expectedPromiseResolve) {
                        ok(false, "resolveHashFragment promise for " + oFixture.sHashFragmentToResolve + " was resolved. Error:" + sMessage);
                    } else {
                        ok(true, "resolveHashFragment promise for " + oFixture.sHashFragmentToResolve + " was rejected");
                    }
                })
                .always(function () {
                    start();
                    sap.ushell.services.AppConfiguration.setCurrentApplication.restore();
                });
        });
    });

    test("resolveHashFragment with sap.ushell.services.AppConfiguration side effects", function () {
        // This is the same test above, but with the non-stubbed AppConfiguration sequence.
        // Note, this is one test!

        var aExpectedNavigationModes = [
            { // #Action-toWDA
                internal: "newWindowThenEmbedded",
                external: "explace"
            }, { // #Action-tosu01
                internal: "newWindowThenEmbedded",
                external: "explace"
            }, { // #Action-toappnavsample
                internal: "embedded",
                external: "inplace"
            }, { // #Action-launchURL
                internal: "newWindow",
                external: "explace"
            }, { // #Action-toNewsTile
                internal: "- does not matter (should not be resolved) -",
                external: "- does not matter (should not be resolved) -"
            }
        ];

        function resolveNext (aFixtures) {
            if (aFixtures.length === 0) {
                return;
            }

            var oFixture = aFixtures.shift(),
                oExpectedNavigationMode = aExpectedNavigationModes.shift();

            stop();
            sap.ushell.Container.getService("NavTargetResolution").resolveHashFragment(oFixture.sHashFragmentToResolve)
                .done(function (oResolutionResult) {
                    var oExpectedResolutionResult = jQuery.extend(true, {}, oFixture.expectedResolutionResult);
                    oExpectedResolutionResult.navigationMode = oExpectedNavigationMode.internal;
                    oExpectedResolutionResult.targetNavigationMode = oExpectedNavigationMode.external;

                    // must restore this as it may be undefined and jQuery.extend deletes it...
                    oExpectedResolutionResult["sap-system"] = oFixture.expectedResolutionResult["sap-system"];
                    oExpectedResolutionResult.inboundPermanentKey = oFixture.expectedResolutionResult.inboundPermanentKey;

                    if (oFixture.expectedPromiseResolve) {
                        ok(true, "resolveHashFragment promise for " + oFixture.sHashFragmentToResolve + " was resolved");
                        deepEqual(oResolutionResult, oExpectedResolutionResult, oFixture.sHashFragmentToResolve + " has resolved to the expected result");
                    } else {
                        ok(false, "resolveHashFragment promise for " + oFixture.sHashFragmentToResolve + " was rejected");
                    }
                })
                .fail(function (sMessage) {
                    if (oFixture.expectedPromiseResolve) {
                        ok(false, "resolveHashFragment promise for " + oFixture.sHashFragmentToResolve + " was resolved. Error:" + sMessage);
                    } else {
                        ok(true, "resolveHashFragment promise for " + oFixture.sHashFragmentToResolve + " was rejected");
                    }
                })
                .always(function () {
                    start();
                    resolveNext(aFixtures);
                });
        }

        resolveNext(aResolveHashFragmentFixture);
    });

    [{
        description: "#Action-toappnavsample with parameters",
        oGetLinksArgs: {
            semanticObject: "Action",
            action: "toappnavsample",
            params: {
                P1: "Value1",
                P2: "Value2"
            }
        },
        expectedResult: "#Action-toappnavsample?P1=Value1&P2=Value2"
    }, {
        description: "#Action-toWDA",
        oGetLinksArgs: {
            semanticObject: "Action",
            action: "toWDA"
        },
        expectedResult: "#Action-toWDA"
    }, {
        description: "#Action-tosu01",
        oGetLinksArgs: {
            semanticObject: "Action",
            action: "tosu01"
        },
        expectedResult: "#Action-tosu01"
    }].forEach(function (oFixture) {
        asyncTest("getLinks: " + oFixture.description, function () {
            sap.ushell.Container.getService("NavTargetResolution").getLinks(oFixture.oGetLinksArgs)
                .done(function (oResult) {
                    ok(true, "getLinks promise for " + oFixture.description + " was resolved");
                    deepEqual(oResult[0].intent, oFixture.expectedResult, "getLinks returned the expected result");
                })
                .fail(function (sMessage) {
                    ok(false, "getLinks promise for " + oFixture.oGetLinksArgs + " was returned with Error:", sMessage);
                })
                .always(function () {
                    start();
                });
        });
    });

    [{
        testDescription: "a mix of intents is given",
        aIntents: ["#Action-toappnavsample", "#Action-tosu01", "#Action-toWDA", "#Action-toNewsTile", "#foo-bar"],
        expectedSupported: {
            "#Action-toappnavsample": true,
            "#Action-tosu01": true,
            "#Action-toWDA": true,
            "#Action-toNewsTile": false,
            "#foo-bar": false
        }
    }].forEach(function (oFixture) {
        asyncTest("isIntentSupported works as expected when " + oFixture.testDescription, function () {

            sap.ushell.Container.getService("NavTargetResolution").isIntentSupported(oFixture.aIntents)
                .done(function (oResult) {
                    ok(true, "isIntentSupported promise was resolved");

                    oFixture.aIntents.forEach(function (sTestIntent) {
                        strictEqual(oResult[sTestIntent].supported, oFixture.expectedSupported[sTestIntent],
                            "got " + oFixture.expectedSupported[sTestIntent] + " for " + sTestIntent);
                    });
                })
                .fail(function (sMessage) {
                    ok(false, "isIntentSupported promise returned with Error:", sMessage);
                })
                .always(function () {
                    start();
                });
        });
    });
});
