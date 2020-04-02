// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.navigationMode
 */
sap.ui.require([
    "sap/ushell/navigationMode",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/services/NavTargetResolution"
], function (oNavigationMode, oAppConfiguration, NavTargetResolution) {
    "use strict";
    /*global QUnit, deepEqual, equal,
      strictEqual, stop, test, jQuery, sap, sinon, window */

    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.adapters.local.NavTargetResolutionAdapter");

    [
        {
            testDescription: "inplace was set as the navmode for a URL target",
            intentParamsPlusAllDefaults: {
                "sap-ushell-navmode" : ["inplace"]
            },
            sInboundApplicationType: "URL",
            expectedNextNavMode: undefined,
            expectedNavMode: "embedded"
        },
        {
            testDescription: "explace was set as the next navmode for a URL target",
            intentParamsPlusAllDefaults: {
                "sap-ushell-next-navmode" : ["explace"]
            },
            sInboundApplicationType: "URL",
            expectedNextNavMode: "explace",
            expectedNavMode: undefined
        },
        {
            testDescription: "explace was set as the next navmode for a SAPUI5 target",
            intentParamsPlusAllDefaults: {
                "sap-ushell-next-navmode" : ["explace"]
            },
            sInboundApplicationType: "SAPUI5",
            expectedNextNavMode: "explace",
            expectedNavMode: undefined
        },
        {
            testDescription: "explace was set as the navmode for a SAPUI5 target",
            intentParamsPlusAllDefaults: {
                "sap-ushell-navmode" : ["explace" ]
            },
            sInboundApplicationType: "SAPUI5",
            expectedNextNavMode: undefined,
            expectedNavMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "none of sap-ushell-next-navmode and sap-ushell-navmode is set for a SAPUI5 target",
            intentParamsPlusAllDefaults: { },
            sInboundApplicationType: "SAPUI5",
            expectedNextNavMode : undefined,
            expectedNavMode : undefined
        },
        {
            testDescription: "sap-ushell-next-navmode and sap-ushell-navmode both set for a SAPUI5 target",
            intentParamsPlusAllDefaults: {
                "sap-ushell-next-navmode" : ["inplace"],
                "sap-ushell-navmode" : ["explace"]
            },
            sInboundApplicationType: "SAPUI5",
            expectedNextNavMode : "inplace",
            expectedNavMode : "newWindowThenEmbedded"
        },
        {
            testDescription: "sap-ushell-navmode set with multiple values for SAPUI5 target",
            intentParamsPlusAllDefaults: {
                "sap-ushell-navmode" : ["explace", "inplace"]
            },
            sInboundApplicationType: "SAPUI5",
            expectedNextNavMode : undefined,
            expectedNavMode : "newWindowThenEmbedded"
        },
        {
            testDescription: "sap-ushell-navmode and sap-ushell-next-navmode contain both junk",
            intentParamsPlusAllDefaults: {
                "sap-ushell-next-navmode" : ["xembedded"],
                "sap-ushell-navmode" : ["AnewWindow", "foo", "inplace"]
            },
            sInboundApplicationType: "SAPUI5",
            expectedNextNavMode : undefined,
            expectedNavMode : undefined
        }
    ].forEach(function (oFixture) {
        test("computeNavigationMode: " + oFixture.testDescription, function () {
            // Act
            var oResolutionResultOverrides = oNavigationMode.compute(
                oFixture.sInboundApplicationType,
                (oFixture.intentParamsPlusAllDefaults["sap-ushell-next-navmode"] || [])[0],
                (oFixture.intentParamsPlusAllDefaults["sap-ushell-navmode"] || [])[0],
                'NOT_LEGACY',
                oFixture.input && oFixture.input.serviceConfiguration.config.enableInPlaceForClassicUI
            );

            deepEqual(
                oResolutionResultOverrides["sap-ushell-next-navmode"],
                oFixture.expectedNextNavMode,
                "the expected sap-ushell-next-navmode is propagated in the resolution result"
            );

            deepEqual(
                oResolutionResultOverrides.navigationMode,
                oFixture.expectedNavMode,
                "the expected navigation mode is set in the resolution result"
            );
        });
    });


    [
        {
            testDescription: "sap-ushell-navmode overwrites service config",
            input: {
                intentParamsPlusAllDefaults: {
                    "sap-ushell-next-navmode" : ["inplace"],
                    "sap-ushell-navmode" : ["explace"]
                },
                serviceConfiguration: {
                    config: {
                        enableInPlaceForClassicUIs: {
                            WDA: true
                        }
                    }
                },
                inbound : {
                    resolutionResult: {
                        applicationType: "WDA"
                    }
                }
            },
            expected: {
                nextNavMode: "inplace",
                navMode: "newWindowThenEmbedded"
            }
        },
        {
            testDescription: "service config defines enableInPlaceForClassicUIs for WDA true and application type is WDA",
            input: {
                intentParamsPlusAllDefaults: {
                    "sap-ushell-next-navmode" : ["inplace"]
                },
                serviceConfiguration: {
                    config: {
                        enableInPlaceForClassicUIs: {
                            WDA: true
                        }
                    }
                },
                inbound : {
                    resolutionResult: {
                        applicationType: "WDA"
                    }
                }
            },
            expected: {
                nextNavMode: "inplace",
                navMode: "embedded"
            }
        },
        {
            testDescription: "service config defines enableInPlaceForClassicUIs for WDA true and application type is TR",
            input: {
                intentParamsPlusAllDefaults: {},
                serviceConfiguration: {
                    config: {
                        enableInPlaceForClassicUIs: {
                            WDA: true
                        }
                    }
                },
                inbound : {
                    resolutionResult: {
                        applicationType: "TR"
                    }
                }
            },
            expected: {
                nextNavMode: undefined,
                navMode: undefined
            }
        },
        {
            testDescription: "service config defines enableInPlaceForClassicUIs for GUI true and application type is TR",
            input: {
                intentParamsPlusAllDefaults: {
                    "sap-ushell-next-navmode" : ["inplace"]
                },
                serviceConfiguration: {
                    config: {
                        enableInPlaceForClassicUIs: {
                            GUI: true
                        }
                    }
                },
                inbound : {
                    resolutionResult: {
                        applicationType: "TR"
                    }
                }
            },
            expected: {
                nextNavMode: "inplace",
                navMode: "embedded"
            }
        },
        {
            testDescription: "service config defines enableInPlaceForClassicUIs for WDA as false and application type is WDA, no sap-ushell-navmode parameter given",
            input: {
                intentParamsPlusAllDefaults: {
                    "sap-ushell-next-navmode" : ["inplace"]
                },
                serviceConfiguration: {
                    config: {
                        enableInPlaceForClassicUIs: {
                            WDA: false
                        }
                    }
                },
                inbound : {
                    resolutionResult: {
                        applicationType: "WDA"
                    }
                }
            },
            expected: {
                nextNavMode: "inplace",
                navMode: undefined
            }
        },
        {
            testDescription: "service config defines enableInPlaceForClassicUIs as false, no sap-ushell-navmode parameter given",
            input: {
                intentParamsPlusAllDefaults: {
                    "sap-ushell-next-navmode" : ["inplace"]
                },
                serviceConfiguration: {
                    config: {
                        enableInPlaceForClassicUIs: false
                    }
                },
                inbound : {
                    resolutionResult: {
                        applicationType: "WDA"
                    }
                }
            },
            expected: {
                nextNavMode: "inplace",
                navMode: undefined
            }
        },
        {
            testDescription: "service config defines enableInPlaceForClassicUIs as empty object, no sap-ushell-navmode parameter given",
            input: {
                intentParamsPlusAllDefaults: {
                    "sap-ushell-next-navmode" : ["inplace"]
                },
                serviceConfiguration: {
                    config: {
                        enableInPlaceForClassicUIs: {}
                    }
                },
                inbound : {
                    resolutionResult: {
                        applicationType: "WDA"
                    }
                }
            },
            expected: {
                nextNavMode: "inplace",
                navMode: undefined
            }
        },
        {
            testDescription: "service config defines enableInPlaceForClassicUIs property as undefined, no sap-ushell-navmode parameter given",
            input: {
                intentParamsPlusAllDefaults: {
                    "sap-ushell-next-navmode" : ["inplace"]
                },
                serviceConfiguration: {
                    config: {
                        enableInPlaceForClassicUIs: undefined
                    }
                },
                inbound : {
                    resolutionResult: {
                        applicationType: "WDA"
                    }
                }
            },
            expected: {
                nextNavMode: "inplace",
                navMode: undefined
            }
        },
        {
            testDescription: "service config is empty, no sap-ushell-navmode parameter given",
            input: {
                intentParamsPlusAllDefaults: {
                    "sap-ushell-next-navmode" : ["inplace"]
                },
                serviceConfiguration: {
                    config: {}
                },
                inbound : {
                    resolutionResult: {
                        applicationType: "WDA"
                    }
                }
            },
            expected: {
                nextNavMode: "inplace",
                navMode: undefined
            }
        },
        {
            testDescription: "Legacy (NWBC) to Legacy (WDA) navigation is made with enableInPlaceForClassicUIs disabled",
            input: {
                intentParamsPlusAllDefaults: {},
                currentApplication: {
                    applicationType: "NWBC"
                },
                inbound : {
                    resolutionResult: {
                        applicationType: "WDA"
                    }
                }
            },
            expected: {
                navMode: undefined,
                nextNavMode: undefined
            }
        },
        {
            testDescription: "Legacy (NWBC) to Legacy (WDA) navigation is made with enableInPlaceForClassicUIs enabled for WDA",
            input: {
                intentParamsPlusAllDefaults: {},
                currentApplication: {
                    applicationType: "NWBC"
                },
                inbound : {
                    resolutionResult: {
                        applicationType: "WDA"
                    }
                },
                serviceConfiguration: {
                    config: {
                        enableInPlaceForClassicUIs: {
                            WDA: true
                        }
                    }
                }
            },
            expected: {
                navMode: undefined,
                nextNavMode: undefined
            }
        },
        {
            testDescription: "Legacy (TR) to Legacy (TR) navigation is made with enableInPlaceForClassicUIs enabled for GUI",
            input: {
                intentParamsPlusAllDefaults: {},
                currentApplication: {
                    applicationType: "TR"
                },
                inbound : {
                    resolutionResult: {
                        applicationType: "TR"
                    }
                },
                serviceConfiguration: {
                    config: {
                        enableInPlaceForClassicUIs: {
                            GUI: true
                        }
                    }
                }
            },
            expected: {
                navMode: undefined,
                nextNavMode: undefined
            }
        },
        {
            testDescription: "Legacy (WDA) to Legacy (WDA) navigation is made with enableInPlaceForClassicUIs enabled for WDA and sap-ushell-navmode",
            input: {
                intentParamsPlusAllDefaults: {
                    "sap-ushell-navmode" : ["explace"]
                },
                serviceConfiguration: {
                    config: {
                        enableInPlaceForClassicUIs: {
                            WDA: true
                        }
                    }
                },
                currentApplication: {
                    applicationType: "WDA"
                },
                inbound: {
                    resolutionResult: {
                        applicationType: "WDA"
                    }
                }
            },
            expected: {
                nextNavMode: undefined,
                navMode: "newWindowThenEmbedded"
            }
        },
        {
            testDescription: "Initial navigation to a WDA legacy application is made with enableInPlaceForClassicUIs enabled for WDA",
            input: {
                intentParamsPlusAllDefaults: {
                    "sap-ushell-navmode" : ["foo"]
                },
                serviceConfiguration: {
                    config: {
                        enableInPlaceForClassicUIs: {
                            WDA: true
                        }
                    }
                },
                currentApplication: null, // initial navigation
                inbound : {
                    resolutionResult: {
                        applicationType: "WDA"
                    }
                }
            },
            expected: {
                nextNavMode: undefined,
                navMode: "embedded"
            }
        }
    ].forEach(function (oFixture) {
        test("computeNavigationMode: configure navigation mode via service config: " + oFixture.testDescription, function () {
            // Arrange

            // Act
            var oResolutionResultOverrides = oNavigationMode.compute(
                oFixture.input.inbound.resolutionResult.applicationType,
                ((oFixture.input.intentParamsPlusAllDefaults || {})["sap-ushell-next-navmode"] || [])[0],
                ((oFixture.input.intentParamsPlusAllDefaults || {})["sap-ushell-navmode"] || [])[0],
                oFixture.input.currentApplication && oFixture.input.currentApplication.applicationType,
                jQuery.sap.getObject("input.serviceConfiguration.config.enableInPlaceForClassicUIs", undefined, oFixture)
            );

            // Assert
            deepEqual(oResolutionResultOverrides["sap-ushell-next-navmode"], oFixture.expected.nextNavMode, "next navmode ok");
            deepEqual(oResolutionResultOverrides.navigationMode, oFixture.expected.navMode, "navigation Mode ok");
        });
    });

    [
        {
            description: "basic case",
            inputResolvedHashFragment: {
                applicationType: "URL",
                url: "http://www.testurl.com",
                additionalInformation: ""
            },
            expectedNavigationMode: "newWindow"
        },
        {
            description: "No url actually specified",
            inputResolvedHashFragment: {
                applicationType: "URL",
                url: "",
                additionalInformation: ""
            },
            /*
             * The NavTargetResolution is blind to what URL should be
             * opened.
             */
            expectedNavigationMode: "newWindow"
        },
        {
            description: "Null url",
            inputResolvedHashFragment: {
                applicationType: "URL",
                url: null,
                additionalInformation: ""
            },
            expectedNavigationMode: "newWindow"
        },
        {
            description: "'URL' contained in applicationType",
            inputResolvedHashFragment: {
                applicationType: "not URL",
                url: null,
                additionalInformation: ""
            },
            expectedNavigationMode: undefined
        }
    ].forEach(function (oFixture) {

        test("getNavigationMode: works for URLs", function () {
            strictEqual(
                oNavigationMode.getNavigationMode(oFixture.inputResolvedHashFragment),
                oFixture.expectedNavigationMode,
                oFixture.description
            );
        });
    });

    [
        {
            testDescription: "initial navigation to a UI5 application",
            oResolvedHashFragment: {
                applicationType: "URL",
                url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                additionalInformation: "SAPUI5.Component=sap.ui.demo.poa"
            },
            sCurrentApplicationType: undefined,
            expectedNavigationMode: "embedded"
        },
        {
            testDescription: "initial navigation to a NWBC application",
            oResolvedHashFragment: {
                applicationType: "NWBC",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: undefined,
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "initial navigation to a WDA application",
            oResolvedHashFragment: {
                applicationType: "WDA",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: undefined,
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from UI5 to UI5",
            oResolvedHashFragment: {
                applicationType: "URL",
                url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                additionalInformation: "SAPUI5.Component=sap.ui.demo.poa"
            },
            sCurrentApplicationType: "URL",
            expectedNavigationMode: "embedded"
        },
        {
            testDescription: "navigation from UI5 to UI5",
            oResolvedHashFragment: {
                applicationType: "URL",
                url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                additionalInformation: "SAPUI5.Component=sap.ui.demo.poa"
            },
            sCurrentApplicationType: "URL",
            expectedNavigationMode: "embedded"
        },
        {
            testDescription: "navigation from UI5 to NWBC",
            oResolvedHashFragment: {
                applicationType: "NWBC",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: "URL",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from NWBC to NWBC",
            oResolvedHashFragment: {
                applicationType: "NWBC",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: "NWBC",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from NWBC to UI5",
            oResolvedHashFragment: {
                applicationType: "URL",
                url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                additionalInformation: "SAPUI5.Component=sap.ui.demo.poa"
            },
            sCurrentApplicationType: "NWBC",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from NWBC to WDA",
            oResolvedHashFragment: {
                applicationType: "WDA",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: "NWBC",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from NWBC to TR",
            oResolvedHashFragment: {
                applicationType: "TR",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: "NWBC",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from WDA to NWBC",
            oResolvedHashFragment: {
                applicationType: "NWBC",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: "WDA",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from WDA to UI5",
            oResolvedHashFragment: {
                applicationType: "URL",
                url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                additionalInformation: "SAPUI5.Component=sap.ui.demo.poa"
            },
            sCurrentApplicationType: "WDA",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from WDA to WDA",
            oResolvedHashFragment: {
                applicationType: "WDA",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: "WDA",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from WDA to TR",
            oResolvedHashFragment: {
                applicationType: "TR",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: "WDA",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from TR to NWBC",
            oResolvedHashFragment: {
                applicationType: "NWBC",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: "TR",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from TR to UI5",
            oResolvedHashFragment: {
                applicationType: "URL",
                url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                additionalInformation: "SAPUI5.Component=sap.ui.demo.poa"
            },
            sCurrentApplicationType: "TR",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from TR to WDA",
            oResolvedHashFragment: {
                applicationType: "WDA",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: "TR",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from TR to TR",
            oResolvedHashFragment: {
                applicationType: "TR",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: "TR",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "intial navigation to TR",
            oResolvedHashFragment: {
                applicationType: "TR",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: undefined,
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "subsequent navigation to TR without navmode on current application",
            oResolvedHashFragment: {
                applicationType: "URL",
                url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                additionalInformation: "SAPUI5.Component=sap.ui.demo.poa"
            },
            oCurrentlyOpenedAppExplicitNavMode : undefined,
            sCurrentApplicationType: "TR",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "subsequent navigation to TR with navmode on current Application",
            oResolvedHashFragment: {
                applicationType: "URL",
                url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                additionalInformation: "SAPUI5.Component=sap.ui.demo.poa"
            },
            oCurrentlyOpenedAppExplicitNavMode : "embedded",
            sCurrentApplicationType: "TR",
            expectedNavigationMode: "embedded"
        },
        {
            testDescription: "initial navigation to a WCF application",
            oResolvedHashFragment: {
                applicationType: "WCF",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: undefined,
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from WCF to URL",
            oResolvedHashFragment: {
                applicationType: "URL",
                url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                additionalInformation: "SAPUI5.Component=sap.ui.demo.poa"
            },
            sCurrentApplicationType: "WCF",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from WCF to WDA",
            oResolvedHashFragment: {
                applicationType: "WDA",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: "WCF",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "navigation from WCF to NWBC",
            oResolvedHashFragment: {
                applicationType: "NWBC",
                url: "www.sap.com",
                description: "site for test"
            },
            sCurrentApplicationType: "WCF",
            expectedNavigationMode: "newWindowThenEmbedded"
        }
    ].forEach(function (oFixture) {
        test("getNavigationMode returns the correct navigation mode when " + oFixture.testDescription, 1, function () {

            var sNavigationMode = oNavigationMode.getNavigationMode(oFixture.oResolvedHashFragment, {
                applicationType : oFixture.sCurrentApplicationType,
                explicitNavMode : oFixture.oCurrentlyOpenedAppExplicitNavMode
            });

            strictEqual(
                sNavigationMode,
                oFixture.expectedNavigationMode,
                "Obtained expected navigation mode"
            );
         });
    });

    [
        {
            sExternalNavigationMode: "inplace",
            sApplicationType: "URL",
            expectedExternalNavigationMode: "embedded"
        },
        {
            sExternalNavigationMode: "explace",
            sApplicationType: "URL",
            expectedExternalNavigationMode: "newWindow"
        },
        {
            sExternalNavigationMode: "inplace",
            sApplicationType: "TR",
            expectedExternalNavigationMode: "embedded"
        },
        {
            sExternalNavigationMode: "explace",
            sApplicationType: "TR",
            expectedExternalNavigationMode: "newWindowThenEmbedded"
        },
        {
            sExternalNavigationMode: "inplace",
            sApplicationType: "WDA",
            expectedExternalNavigationMode: "embedded"
        },
        {
            sExternalNavigationMode: "explace",
            sApplicationType: "WDA",
            expectedExternalNavigationMode: "newWindowThenEmbedded"
        },
        {
            sExternalNavigationMode: "inplace",
            sApplicationType: "SAPUI5",
            expectedExternalNavigationMode: "embedded"
        },
        {
            sExternalNavigationMode: "explace",
            sApplicationType: "SAPUI5",
            expectedExternalNavigationMode: "newWindowThenEmbedded"
        },
        {
            sExternalNavigationMode: "inplace",
            sApplicationType: "WCF",
            expectedExternalNavigationMode: "embedded"
        },
        {
            sExternalNavigationMode: "explace",
            sApplicationType: "WCF",
            expectedExternalNavigationMode: "newWindowThenEmbedded"
        }
    ].forEach(function (oFixture) {
        test("_getInternalNavigationMode",function () {

            var sExternalNavigationMode = oNavigationMode._getInternalNavigationMode(oFixture.sExternalNavigationMode, oFixture.sApplicationType);

            strictEqual(
                sExternalNavigationMode,
                oFixture.expectedExternalNavigationMode,
                "got the expected external navigation mode"
            );
        });
    });


    [
        { WDA: true },
        { TR: true },
        { URL: false },
        { SAPUI5: false },
        { NWBC: true },
        { WCF: true }
    ].forEach(function (oFixture) {
        var sApplicationType = Object.keys(oFixture)[0];
        var bExpectedResult = oFixture[sApplicationType];

        test("_isLegacyApplicationType", function () {

            strictEqual(
                oNavigationMode._isLegacyApplicationType(sApplicationType),
                bExpectedResult,
                "returned the expected result"
            );
        });
    });



    test("getNavigationMode: works for navigation to UI5 components", function () {
        // Test basic case
        strictEqual(
            oNavigationMode.getNavigationMode({
                applicationType: "URL",
                url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                additionalInformation: "SAPUI5.Component=sap.ui.demo.poa"
            }),
            "embedded",
            "basic case"
        );

        // Test valid additionalInformation field
        var oExpectedResults = {
            /*
             * These cases cover invalid right-hand value
             */
            "SAPUI5.Component="                   : { expected: "embedded", warns: true },
            "SAPUI5.Component= "                  : { expected: "embedded", warns: true },
            "SAPUI5.Component=.Component.name"    : { expected: "embedded", warns: true },
            "SAPUI5.Component=Com,pon.ent.na.me"  : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component name"     : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component+name"     : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component.n=me"     : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component.n@me"     : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component.name?managed=true " : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component.name!"    : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component.name."    : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component.n~me"     : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component..name"    : { expected: "embedded", warns: true },
            "SAPUI5.Component=ux.fnd.generic-apf-application"     : { expected: "embedded", warns: true },
            "SAPUI5.Component=ux.fnd.generic-apf-application--"   : { expected: "embedded", warns: true },
            "SAPUI5.Component=ux-.fnd-.-generic--apf-application" : { expected: "embedded", warns: true },
            /*
             * These cases fall back to the URL case because
             * additionalInformation does not start with
             * "SAPUI5.Component"
             */
            "SAPUI5.ComponentComponentname"  : { expected: "newWindow", warns: false },
            " SAPUI5.Component="             : { expected: "newWindow", warns: false },
            "SAPUI5.Component = "            : { expected: "newWindow", warns: false },
            "SAPUI5.Component Componentname" : { expected: "newWindow", warns: false },
            /*
             * Valid right-hand values
             */
            "SAPUI5.Component=C0mPon3ntN4__m3"     : { expected: "embedded", warns: false },
            "SAPUI5.Component=COMPONENTNAME"       : { expected: "embedded", warns: false },
            "SAPUI5.Component=COMPONENT_NAME"      : { expected: "embedded", warns: false },
            "SAPUI5.Component=Com.pon.ent.na.me"   : { expected: "embedded", warns: false },
            "SAPUI5.Component=Component.Name"      : { expected: "embedded", warns: false },
            "SAPUI5.Component=Component_NamE"      : { expected: "embedded", warns: false },
            "SAPUI5.Component=__Component__name__" : { expected: "embedded", warns: false },
            "SAPUI5.Component=componentName"       : { expected: "embedded", warns: false },
            "SAPUI5.Component=component_name"      : { expected: "embedded", warns: false },
            "SAPUI5.Component=componentname"       : { expected: "embedded", warns: false }
        };

        Object.keys(oExpectedResults).forEach(function (sAdditionalInformation) {
            var oResolvedHashFragment = {
                    applicationType: "URL",
                    url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                    additionalInformation: sAdditionalInformation
                },
                oWarnSpy = sinon.spy(jQuery.sap.log, "warning"),
                oTest = oExpectedResults[sAdditionalInformation];

            strictEqual(
                oNavigationMode.getNavigationMode(oResolvedHashFragment),
                oTest.expected,
                "valid additionalInformation: '" + sAdditionalInformation + "'"
            );

            equal(jQuery.sap.log.warning.called, oTest.warns,
                "warning logged for " + sAdditionalInformation);

            oWarnSpy.restore();
        });
    });

    test("getNavigationMode: works for navigation to NWBC applications", function () {
        [
            {
                description: "basic case",
                inputResolvedHashFragment: {
                    applicationType: "NWBC",
                    url: "/some/url",
                    additionalInformation: "/some/additional/information"
                },
                expectedNavigationMode: "newWindowThenEmbedded"
            },
            {
                description: "managed= case in additionalInformation",
                inputResolvedHashFragment: {
                    applicationType: "NWBC",
                    url: "/some/url",
                    additionalInformation: "SAPUI5.Component=componentname"
                },
                expectedNavigationMode: "newWindowThenEmbedded"
            },
            {
                description: "SAPUI5.Component= case in additionalInformation",
                inputResolvedHashFragment: {
                    applicationType: "NWBC",
                    url: "/some/url",
                    additionalInformation: "SAPUI5.Component=componentname"
                },
                expectedNavigationMode: "newWindowThenEmbedded"
            }
        ].forEach(function (oFixture) {

            strictEqual(
                oNavigationMode.getNavigationMode(oFixture.inputResolvedHashFragment),
                oFixture.expectedNavigationMode,
                oFixture.description
            );

        });
    });

    test("getNavigationMode: works for navigation to \"managed=\" application", function () {
        [
            {
                description: "basic case for FioriWave1 value",
                inputResolvedHashFragment: {
                    additionalInformation: "managed=FioriWave1",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: "embedded"
            },
            {
                description: "basic case for No value",
                inputResolvedHashFragment: {
                    additionalInformation: "managed=",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: "newWindow" // falls back to url case
            },
            {
                description: "wrong applicationType",
                inputResolvedHashFragment: {
                    additionalInformation: "managed=FioriWave1",
                    url: "/some/url",
                    applicationType: "WRONG"
                },
                expectedNavigationMode: undefined
            },
            {
                description: "basic case 1 for other values",
                inputResolvedHashFragment: {
                    additionalInformation: "managed=Something",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: undefined
            },
            {
                description: "extra spaces case 1",
                inputResolvedHashFragment: {
                    additionalInformation: "managed = FioriWave1",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: "newWindow" // as if managed= was not there
            },
            {
                description: "extra spaces case 2",
                inputResolvedHashFragment: {
                    additionalInformation: "managed= FioriWave1",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: undefined // the value is not "FioriWave1"
            },
            {
                description: "extra spaces case 3",
                inputResolvedHashFragment: {
                    additionalInformation: "managed =FioriWave1",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: "newWindow"
            },
            {
                description: "leading spaces",
                inputResolvedHashFragment: {
                    additionalInformation: " managed=FioriWave1",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: "newWindow"
            },
            {
                description: "trailing spaces",
                inputResolvedHashFragment: {
                    additionalInformation: "managed=FioriWave1 ",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: undefined
            },
            {
                description: "duplicated value",
                inputResolvedHashFragment: {
                    additionalInformation: "managed=FioriWave1,managed=FioriWave1",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: undefined
            },
            {
                description: "duplicated value, no separator",
                inputResolvedHashFragment: {
                    additionalInformation: "managed=FioriWave1managed=FioriWave1",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: undefined
            },
            {
                description: "FioriWave1 in lowercase is not valid value",
                inputResolvedHashFragment: {
                    additionalInformation: "managed=fioriwave1",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: undefined
            },
            {
                description: "FioriWave1 in mixed case is not a valid value",
                inputResolvedHashFragment: {
                    additionalInformation: "managed=fioriWave1",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: undefined
            },
            {
                description: "non-existing managed= value opens new window",
                inputResolvedHashFragment: {
                    additionalInformation: "UnknownValue",
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: "newWindow"
            },
            {
                description: "undefined additionalInformation and URL opens in a new window",
                inputResolvedHashFragment: {
                    additionalInformation: undefined,
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: "newWindow"
            },
            {
                description: "null additionalInformation and URL opens in a new window",
                inputResolvedHashFragment: {
                    additionalInformation: null,
                    url: "/some/url",
                    applicationType: "URL"
                },
                expectedNavigationMode: "newWindow"
            }
        ].forEach(function (oFixture) {

            strictEqual(
                oNavigationMode.getNavigationMode(oFixture.inputResolvedHashFragment),
                oFixture.expectedNavigationMode,
                oFixture.description
            );

        });
    });

    test("getNavigationMode: works for navigation to UI5 components", function () {


        // Test basic case
        strictEqual(
            oNavigationMode.getNavigationMode({
                applicationType: "URL",
                url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                additionalInformation: "SAPUI5.Component=sap.ui.demo.poa"
            }),
            "embedded",
            "basic case"
        );

        // Test valid additionalInformation field
        var oExpectedResults = {
            /*
             * These cases cover invalid right-hand value
             */
            "SAPUI5.Component="                   : { expected: "embedded", warns: true },
            "SAPUI5.Component= "                  : { expected: "embedded", warns: true },
            "SAPUI5.Component=.Component.name"    : { expected: "embedded", warns: true },
            "SAPUI5.Component=Com,pon.ent.na.me"  : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component name"     : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component+name"     : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component.n=me"     : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component.n@me"     : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component.name?managed=true " : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component.name!"    : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component.name."    : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component.n~me"     : { expected: "embedded", warns: true },
            "SAPUI5.Component=Component..name"    : { expected: "embedded", warns: true },
            "SAPUI5.Component=ux.fnd.generic-apf-application"     : { expected: "embedded", warns: true },
            "SAPUI5.Component=ux.fnd.generic-apf-application--"   : { expected: "embedded", warns: true },
            "SAPUI5.Component=ux-.fnd-.-generic--apf-application" : { expected: "embedded", warns: true },
            /*
             * These cases fall back to the URL case because
             * additionalInformation does not start with
             * "SAPUI5.Component"
             */
            "SAPUI5.ComponentComponentname"  : { expected: "newWindow", warns: false },
            " SAPUI5.Component="             : { expected: "newWindow", warns: false },
            "SAPUI5.Component = "            : { expected: "newWindow", warns: false },
            "SAPUI5.Component Componentname" : { expected: "newWindow", warns: false },
            /*
             * Valid right-hand values
             */
            "SAPUI5.Component=C0mPon3ntN4__m3"     : { expected: "embedded", warns: false },
            "SAPUI5.Component=COMPONENTNAME"       : { expected: "embedded", warns: false },
            "SAPUI5.Component=COMPONENT_NAME"      : { expected: "embedded", warns: false },
            "SAPUI5.Component=Com.pon.ent.na.me"   : { expected: "embedded", warns: false },
            "SAPUI5.Component=Component.Name"      : { expected: "embedded", warns: false },
            "SAPUI5.Component=Component_NamE"      : { expected: "embedded", warns: false },
            "SAPUI5.Component=__Component__name__" : { expected: "embedded", warns: false },
            "SAPUI5.Component=componentName"       : { expected: "embedded", warns: false },
            "SAPUI5.Component=component_name"      : { expected: "embedded", warns: false },
            "SAPUI5.Component=componentname"       : { expected: "embedded", warns: false }
        };

        Object.keys(oExpectedResults).forEach(function (sAdditionalInformation) {
            var oResolvedHashFragment = {
                    applicationType: "URL",
                    url: "/sap/bc/ui5_demokit/1-next/test-resources/sap/m/demokit/poa",
                    additionalInformation: sAdditionalInformation
                },
                oWarnSpy = sinon.spy(jQuery.sap.log, "warning"),
                oTest = oExpectedResults[sAdditionalInformation];

            strictEqual(
                oNavigationMode.getNavigationMode(oResolvedHashFragment),
                oTest.expected,
                "valid additionalInformation: '" + sAdditionalInformation + "'"
            );

            equal(jQuery.sap.log.warning.called, oTest.warns,
                "warning logged for " + sAdditionalInformation);

            oWarnSpy.restore();
        });
    });

    [
        { embedded: "inplace" },
        { newWindowThenEmbedded: "explace" },
        { newWindow: "explace" },
        { replace: "inplace" }
    ].forEach(function (oFixture) {
        var sInternalNavigationMode = Object.keys(oFixture)[0];
        var sExpectedExternalNavigationMode = oFixture[sInternalNavigationMode];

        test("getExternalNavigationMode: returns the expected external navigation when internal navigation mode is " + sInternalNavigationMode, function () {
            strictEqual(
                oNavigationMode.getExternalNavigationMode(sInternalNavigationMode),
                sExpectedExternalNavigationMode,
                "got the expected navigation mode"
            );

        });
    });

    [
        {
            testDescription: "when inplace for WDA is enabled",
            sApplicationType: "WDA",
            sAdditionalInformation: "",
            bClassicUIFlag: true,
            expectedNavigationMode: "embedded"
        },
        {
            testDescription: "when inplace for WDA is disabled",
            sApplicationType: "WDA",
            sAdditionalInformation: "",
            bClassicUIFlag: false,
            navigationMode: "newWindowThenEmbedded",
            expectedNavigationMode: "newWindowThenEmbedded"
        },
        {
            testDescription: "for a SAPUI5 Application",
            sApplicationType: "SAPUI5",
            sAdditionalInformation: "",
            navigationMode: "embedded",
            expectedNavigationMode: "embedded"
        },
        {
            testDescription: "when a wrong application type is provided",
            sApplicationType: "SomeType",
            sAdditionalInformation: "",
            navigationMode: undefined,
            expectedNavigationMode: undefined
        }
    ].forEach(function (oFixture) {
        QUnit.test("computeNavigationModeForHomepageTiles " + oFixture.testDescription, function (assert) {
            // arrange
            var sResult;

            var oOriginalContainer = sap.ushell.Container;

            var getNavigationModeStub = sinon.stub(oNavigationMode, "getNavigationMode").returns(oFixture.navigationMode);
            sap.ushell.Container = {
                getService: sinon.stub.returns({
                    isInPlaceConfiguredFor: function () {
                        return oFixture.bClassicUIFlag;
                    }
                })
            };

            // act
            sResult = oNavigationMode.computeNavigationModeForHomepageTiles(oFixture.sApplicationType, oFixture.sAdditionalInformation, oFixture.bClassicUIFlag);

            // assert
            assert.strictEqual(sResult, oFixture.expectedNavigationMode, "correct nav mode returned");

            getNavigationModeStub.restore();
            delete sap.ushell.Container;
            sap.ushell.Container = oOriginalContainer;
        });
    });
});
