// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.ShellNavigation
 */
sap.ui.require([
    "sap/ushell/test/utils",
    "sap/ushell/services/_Ui5ComponentLoader/utils",
    "sap/ushell/utils",
    "sap/ushell/EventHub",
    "sap/ushell/services/Ui5ComponentHandle"
], function (
    testUtils,
    oUi5ComponentLoaderUtils,
    oUtils,
    oEventHub
    // Ui5ComponentHandle
) {
    "use strict";

    /* global QUnit sinon */

    var aDefaultCoreExtLightPreloadBundles = [
        "sap/fiori/core-ext-light-0.js",
        "sap/fiori/core-ext-light-1.js",
        "sap/fiori/core-ext-light-2.js",
        "sap/fiori/core-ext-light-3.js"
    ];

    jQuery.sap.require("sap.ushell.services.Container");

    QUnit.module("sap.ushell.services.Ui5ComponentLoader", {
        beforeEach: function () {
            window.oldUshellConfig = window["sap-ushell-config"];
            return sap.ushell.bootstrap("local");
        },
        afterEach: function () {
            window["sap-ushell-config"] = window.oldUshellConfig;
            delete window.oldUshellConfig;
            testUtils
                .restoreSpies(
                    sap.ui.component,
                    sap.ui.component.load,
                    jQuery.sap.log.error,
                    jQuery.sap._loadJSResourceAsync,
                    oEventHub.emit,
                    oEventHub.once,
                    oUi5ComponentLoaderUtils.loadBundle,
                    oUtils.getParameterValueBoolean
                );

            delete sap.ushell.Container;
        }
    });

    QUnit.test("getService", function (assert) {
        // modules cannot be unloaded; so this test should be the first in order
        assert.ok(typeof sap.ushell.Container.getService("Ui5ComponentLoader") === "object");
    });

    [{
        testDescription: "target resolution result is undefined",
        oTargetResolutionResult: undefined,
        oExpectedAdjustedTargetResolutionResult: undefined
    }, {
        testDescription: "application type is NWBC",
        oTargetResolutionResult: { applicationType: "NWBC" },
        oExpectedAdjustedTargetResolutionResult: { applicationType: "NWBC" }
    }, {
        testDescription: "application type is URL and no ui5ComponentName set",
        oTargetResolutionResult: {
            additionalInformation: "not a ui5 component",
            applicationType: "URL"
        },
        oExpectedAdjustedTargetResolutionResult: {
            additionalInformation: "not a ui5 component",
            applicationType: "URL"
        }
    }].forEach(function (oFixture) {
        QUnit.test("createComponent does not call sap.ui.component when " + oFixture.testDescription, function (assert) {
            var fnDone = assert.async();

            sinon.stub(sap.ui, "component");

            sap.ushell.Container.getService("Ui5ComponentLoader").createComponent(oFixture.oTargetResolutionResult)
                .done(function (oActualAdjustedTargetResolutionResult) {
                    if (typeof oActualAdjustedTargetResolutionResult === "object") {
                        assert.deepEqual(oActualAdjustedTargetResolutionResult, oFixture.oExpectedAdjustedTargetResolutionResult,
                            "promise resolved with expected result");
                    } else {
                        assert.strictEqual(oActualAdjustedTargetResolutionResult, oFixture.oExpectedAdjustedTargetResolutionResult,
                            "promise resolved with expected result");
                    }
                })
                .fail(function () {
                    assert.ok(false,
                        "promise rejected");
                })
                .always(function () {
                    assert.ok(!sap.ui.component.load.called,
                        "component factory was never called");
                    fnDone();
                });
        });
    });

    [{
        testDescription: "no applicationDependencies defined and URL has query parameters, amendLoadingConfig explicitly set to false",
        bAmendLoadingConfig: false,
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/with/query?a=b&c=d"
        },
        oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/with/query?a=b&c=d",
            coreResourcesFullyLoaded: true // if amended loading is switched off, we set the flag as we expect a regular UI5 bootstrap
        },
        oExpectedComponentProperties: {
            name: "some.ui5.component",
            url: "component/url/with/query",
            async: true,
            componentData: {
                startupParameters: {
                    "a": ["b"],
                    "c": ["d"]
                }
            },
            asyncHints: {}
        }
    }, {
        testDescription: "no applicationDependencies and no URL defined",
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component"
        },
        oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            coreResourcesFullyLoaded: true
        },
        oExpectedComponentProperties: {
            name: "some.ui5.component",
            async: true,
            componentData: { "startupParameters": {} },
            asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": aDefaultCoreExtLightPreloadBundles
            }
        }
    }, {
        testDescription: "no applicationDependencies and no URL defined and componentData specified",
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            componentData: { fakeData: true }
        },
        oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            coreResourcesFullyLoaded: true,
            componentData: { fakeData: true }
        },
        oExpectedComponentProperties: {
            name: "some.ui5.component",
            async: true,
            componentData: {
                fakeData: true,
                "startupParameters": {}
            },
            asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": aDefaultCoreExtLightPreloadBundles
            }
        }
    }, {
        testDescription: "no applicationDependencies defined and URL has query parameters",
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/with/query?a=b&c=d"
        },
        oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/with/query?a=b&c=d",
            coreResourcesFullyLoaded: true
        },
        oExpectedComponentProperties: {
            name: "some.ui5.component",
            url: "component/url/with/query",
            async: true,
            componentData: {
                startupParameters: {
                    "a": ["b"],
                    "c": ["d"]
                }
            },
            asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": aDefaultCoreExtLightPreloadBundles
            }
        }
    }, {
        testDescription: "startup parameters both in url and in resolution result",
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/with/query?a=b&c=d",
            applicationConfiguration: {
                confProp1: "value 1",
                confProp2: "value2"
            },
            componentData: {
                startupParameters: {
                    "wrong": ["oftarget"],
                    "c": ["OFtarget"]
                }
            }
        },
        oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/with/query?a=b&c=d",
            applicationConfiguration: {
                confProp1: "value 1",
                confProp2: "value2"
            },
            // beware, this is the wrong data
            componentData: {
                startupParameters: {
                    "wrong": ["oftarget"],
                    "c": ["OFtarget"]
                }
            },
            coreResourcesFullyLoaded: true
        },
        oExpectedComponentProperties: {
            name: "some.ui5.component",
            url: "component/url/with/query",
            async: true,
            componentData: {
                startupParameters: {
                    "a": ["b"],
                    "c": ["d"]
                },
                config: {
                    confProp1: "value 1",
                    confProp2: "value2"
                }
            },
            asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": aDefaultCoreExtLightPreloadBundles
            }
        }
    }, {
        testDescription: "startup parameters only in resolution result",
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/with/query",
            applicationConfiguration: {
                confProp1: "value 1",
                confProp2: "value2"
            },
            componentData: {
                startupParameters: {
                    "correct": ["oftarget"],
                    "c": ["OFtarget"]
                }
            }
        },
        oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/with/query",
            applicationConfiguration: {
                confProp1: "value 1",
                confProp2: "value2"
            },
            // beware, this is the wrong data
            componentData: {
                startupParameters: {
                    "correct": ["oftarget"],
                    "c": ["OFtarget"]
                }
            },
            coreResourcesFullyLoaded: true
        },
        oExpectedComponentProperties: {
            name: "some.ui5.component",
            url: "component/url/with/query",
            async: true,
            componentData: {
                startupParameters: {
                    "correct": ["oftarget"],
                    "c": ["OFtarget"]
                },
                config: {
                    confProp1: "value 1",
                    confProp2: "value2"
                }
            },
            asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": aDefaultCoreExtLightPreloadBundles
            }
        }
    }, {
        testDescription: "no applicationDependencies defined and URL has query parameters and applicationConfiguratin defined",
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/with/query?a=b&c=d",
            applicationConfiguration: {
                confProp1: "value 1",
                confProp2: "value2"
            }
        },
        oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/with/query?a=b&c=d",
            applicationConfiguration: {
                confProp1: "value 1",
                confProp2: "value2"
            },
            coreResourcesFullyLoaded: true
        },
        oExpectedComponentProperties: {
            name: "some.ui5.component",
            url: "component/url/with/query",
            async: true,
            componentData: {
                startupParameters: {
                    "a": ["b"],
                    "c": ["d"]
                },
                config: {
                    confProp1: "value 1",
                    confProp2: "value2"
                }
            },
            asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": aDefaultCoreExtLightPreloadBundles
            }
        }
    }, {
        testDescription: "no applicationDependencies defined and loadCoreExt set to false",
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            loadCoreExt: false
        },
        oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/"
            // coreResourcesFullyLoaded should NOT be set in this case
        },
        oExpectedComponentProperties: {
            name: "some.ui5.component",
            url: "component/url/",
            componentData: { startupParameters: {} },
            async: true,
            asyncHints: { "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"] }
        }
    }, {
        testDescription: "no applicationDependencies defined and loadCoreExt set to false and amendLoading set to false",
        bAmendLoadingConfig: false,
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            loadCoreExt: false
        },
        oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/"
            // coreResourcesFullyLoaded should NOT be set in this case (loadCoreExt explicitly set to false, usually by FLP component)
        },
        oExpectedComponentProperties: {
            name: "some.ui5.component",
            url: "component/url/",
            componentData: { startupParameters: {} },
            async: true,
            asyncHints: {}
        }
    }, {
        testDescription: "no applicationDependencies defined and loadDefaultDependencies set to false",
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            loadDefaultDependencies: false
        },
        oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            coreResourcesFullyLoaded: true
        },
        oExpectedComponentProperties: {
            name: "some.ui5.component",
            url: "component/url/",
            async: true,
            componentData: { startupParameters: {} },
            asyncHints: { "preloadBundles": aDefaultCoreExtLightPreloadBundles }
        }
    }, {
        testDescription: "applicationDependencies without asyncHints and some arbitrary property defined",
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            applicationDependencies: { someProperty: "ui5MayInventInFuture" }
        },
        oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            applicationDependencies: { someProperty: "ui5MayInventInFuture" },
            coreResourcesFullyLoaded: true
        },
        oExpectedComponentProperties: {
            name: "some.ui5.component",
            url: "component/url/",
            someProperty: "ui5MayInventInFuture",
            async: true,
            componentData: { startupParameters: {} },
            asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": aDefaultCoreExtLightPreloadBundles
            }
        }
    }, {
        testDescription: "applicationDependencies with component name different than in app properties and manifestUrl defined (app variant use case)",
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.app.variant",
            url: "component/url/",
            applicationDependencies: {
                name: "some.ui5.component",
                manifestUrl: "/path/to/manifest.json"
            }
        },
        oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
            applicationType: "URL",
            ui5ComponentName: "some.app.variant",
            url: "component/url/",
            applicationDependencies: {
                name: "some.ui5.component",
                manifestUrl: "/path/to/manifest.json"
            },
            coreResourcesFullyLoaded: true
        },
        oExpectedComponentProperties: {
            name: "some.ui5.component",
            url: "component/url/",
            manifestUrl: "/path/to/manifest.json",
            async: true,
            componentData: { startupParameters: {} },
            asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": aDefaultCoreExtLightPreloadBundles
            }
        }
    }, {
        testDescription: "applicationDependencies with component URL but no URL in app properties ",
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            applicationDependencies: {
                name: "some.ui5.component",
                url: "component/url/"
            }
        },
        oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            applicationDependencies: {
                name: "some.ui5.component",
                url: "component/url/"
            },
            coreResourcesFullyLoaded: true
        },
        oExpectedComponentProperties: {
            name: "some.ui5.component",
            url: "component/url/",
            async: true,
            componentData: { startupParameters: {} },
            asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": aDefaultCoreExtLightPreloadBundles
            }
        }
    }, {
        testDescription: "applicationDependencies with asyncHints defined",
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            applicationDependencies: {
                asyncHints: {
                    "libs": ["some.lib.dependency"],
                    "preloadBundles": ["some/preload/bundle.js"]
                }
            }
        },
        oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            applicationDependencies: {
                asyncHints: {
                    "libs": ["some.lib.dependency"],
                    "preloadBundles": ["some/preload/bundle.js"]
                }
            },
            coreResourcesFullyLoaded: true
        },
        oExpectedComponentProperties: {
            name: "some.ui5.component",
            url: "component/url/",
            async: true,
            componentData: { startupParameters: {} },
            asyncHints: {
                "libs": ["some.lib.dependency"],
                "preloadBundles": ["some/preload/bundle.js"].concat(aDefaultCoreExtLightPreloadBundles)
            }
        }
    }, {
        testDescription: "applicationDependencies with asyncHints defined and parsedShellHash specified",
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            applicationDependencies: {
                asyncHints: {
                    "libs": ["some.lib.dependency"],
                    "preloadBundles": ["some/preload/bundle.js"]
                }
            }
        },
        oParsedShellHash: {
            semanticObject: "semanticObject",
            action: "action"
        },
        oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            applicationDependencies: {
                asyncHints: {
                    "libs": ["some.lib.dependency"],
                    "preloadBundles": ["some/preload/bundle.js"]
                }
            },
            coreResourcesFullyLoaded: true
        },
        oExpectedComponentProperties: {
            id: "application-semanticObject-action-component",
            name: "some.ui5.component",
            url: "component/url/",
            async: true,
            componentData: { startupParameters: {} },
            asyncHints: {
                "libs": ["some.lib.dependency"],
                "preloadBundles": ["some/preload/bundle.js"].concat(aDefaultCoreExtLightPreloadBundles)
            }
        }
    }, {
        testDescription: "applicationDependencies with cachebuster token in asyncHints libraries and sap-ushell-nocb=false",
        bSapUshellNocb: false,
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            applicationDependencies: {
                asyncHints: {
                    "libs": [
                        {
                            "name": "sap.s4h.cfnd.featuretoggleA",
                            "url": "/sap/bc/ui5_ui5/sap/featuretoggles1/~AB81E9A6ED7B1368CD25EC22D~/something"
                        },
                        {
                            "name": "sap.s4h.cfnd.featuretoggleB",
                            "url": "/sap/bc/ui5_ui5/sap/featuretoggles1/~498970EAB81E9A6ED7B1368CD25EC22D~5"
                        }
                    ],
                    "preloadBundles": ["some/preload/bundle.js"]
                }
            }
        },
        oParsedShellHash: { semanticObject: "semanticObject", action: "action" },
        oExpectedComponentProperties: {
            id: "application-semanticObject-action-component",
            name: "some.ui5.component",
            url: "component/url/",
            async: true,
            componentData: { startupParameters: {} },
            asyncHints: {
                "libs": [
                    {
                        "name": "sap.s4h.cfnd.featuretoggleA",
                        "url": "/sap/bc/ui5_ui5/sap/featuretoggles1/~AB81E9A6ED7B1368CD25EC22D~/something"
                    },
                    {
                        "name": "sap.s4h.cfnd.featuretoggleB",
                        "url": "/sap/bc/ui5_ui5/sap/featuretoggles1/~498970EAB81E9A6ED7B1368CD25EC22D~5"
                    }
                ],
                "preloadBundles": ["some/preload/bundle.js"].concat(aDefaultCoreExtLightPreloadBundles)
            }
        }
    }, {
        testDescription: "applicationDependencies with cachebuster token in asyncHints libraries and sap-ushell-nocb=true",
        bSapUshellNocb: true,
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            applicationDependencies: {
                asyncHints: {
                    "libs": [
                        {
                            "name": "sap.s4h.cfnd.featuretoggleA",
                            "url": "/sap/bc/ui5_ui5/sap/featuretoggles1/~AB81E9A6ED7B1368CD25EC22D~/something"
                        },
                        {
                            "name": "sap.s4h.cfnd.featuretoggleB",
                            "url": "/sap/bc/ui5_ui5/sap/featuretoggles1/~498970EAB81E9A6ED7B1368CD25EC22D~5"
                        }
                    ],
                    "preloadBundles": ["some/preload/bundle.js"]
                }
            }
        },
        oParsedShellHash: { semanticObject: "semanticObject", action: "action" },
        oExpectedComponentProperties: {
            id: "application-semanticObject-action-component",
            name: "some.ui5.component",
            url: "component/url/",
            async: true,
            componentData: { startupParameters: {} },
            asyncHints: {
                "libs": [
                    {
                        "name": "sap.s4h.cfnd.featuretoggleA",
                        "url": "/sap/bc/ui5_ui5/sap/featuretoggles1/something"
                    },
                    {
                        "name": "sap.s4h.cfnd.featuretoggleB",
                        "url": "/sap/bc/ui5_ui5/sap/featuretoggles1"
                    }
                ],
                "preloadBundles": ["some/preload/bundle.js"].concat(aDefaultCoreExtLightPreloadBundles)
            }
        }
    }, {
        testDescription: "no applicationDependencies defined, parsedShellHash and waitForBeforeInstantiation specified",
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/"
        },
        oParsedShellHash: {
            semanticObject: "semanticObject",
            action: "action"
        },
        oWaitForBeforeInstantiation: {
            dummyPromise: ""
        },
        oExpectedAdjustedTargetResolutionResultWithoutComponentHandle: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            coreResourcesFullyLoaded: true
        },
        oExpectedComponentProperties: {
            id: "application-semanticObject-action-component",
            name: "some.ui5.component",
            url: "component/url/",
            async: true,
            componentData: { startupParameters: {} },
            asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": aDefaultCoreExtLightPreloadBundles,
                "waitFor": { dummyPromise: "" }
            }
        }
    }, {
        testDescription: "sap-ui-fl-max-layer is present the resolution result as a reserved parameter",
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/",
            reservedParameters: { "sap-ui-fl-max-layer": "SOMETHING" }
        },
        oExpectedComponentProperties: {
            name: "some.ui5.component",
            url: "component/url/",
            componentData: {
                "startupParameters": {},
                "technicalParameters": { "sap-ui-fl-max-layer": "SOMETHING" }
            },
            async: true,
            asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": aDefaultCoreExtLightPreloadBundles
            }
        }
    }, {
        testDescription: "pluginExtensions is presented",
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            getExtensions: "someFunction"
        },
        oExpectedComponentProperties: {
            name: "some.ui5.component",
            async: true,
            componentData: {
                "startupParameters": {},
                "getExtensions": "someFunction"
            },
            asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": aDefaultCoreExtLightPreloadBundles
            }
        }
    }].forEach(function (oFixture) {
        QUnit.test("createComponent calls sap.ui.component correctly when " + oFixture.testDescription, function (assert) {
            var fnDone = assert.async();

            function doTest () {
                var oFakeComponentMetadata = { fakeMetadata: null },
                    oFakeComponentInstance = {
                        getMetadata: function () {
                            return oFakeComponentMetadata;
                        }
                    },
                    oActualComponentHandle;

                // only stubbing to override implementation
                sinon.stub(sap.ui, "component").returns(new Promise(function (fnResolve, fnRecject) {
                    fnResolve(oFakeComponentInstance);
                }));

                var oGetParameterValueBooleanStub = sinon.stub(oUtils, "getParameterValueBoolean");
                oGetParameterValueBooleanStub.withArgs("sap-ushell-nocb").returns(!!oFixture.bSapUshellNocb);
                oGetParameterValueBooleanStub.throws("sap.ushell.Utils#getParameterValueBoolean was called with an unexpected argument");

                sap.ushell.Container.getService("Ui5ComponentLoader").createComponent(
                    oFixture.oTargetResolutionResult, oFixture.oParsedShellHash, oFixture.oWaitForBeforeInstantiation)
                    .done(function (oActualAdjustedTargetResolutionResult) {
                        oActualComponentHandle = oActualAdjustedTargetResolutionResult.componentHandle;

                        assert.strictEqual(oActualComponentHandle.getInstance(), oFakeComponentInstance,
                            "component instance created from component handle is same as from component factory");

                        assert.strictEqual(oActualComponentHandle.getMetadata(), oFakeComponentMetadata,
                            "component metadata returned from component handle is same as from component instance");

                        if (oFixture.hasOwnProperty("oExpectedAdjustedTargetResolutionResultWithoutComponentHandle")) {
                            // component handle checked separately
                            delete oActualAdjustedTargetResolutionResult.componentHandle;
                            assert.deepEqual(oActualAdjustedTargetResolutionResult, oFixture.oExpectedAdjustedTargetResolutionResultWithoutComponentHandle,
                                "promise resolved with expected result (adjusted)");
                        }

                        assert.strictEqual(sap.ui.component.callCount, 1,
                            "sap.ui.component called exactly 1 time");
                        assert.deepEqual(sap.ui.component.args[0][0], oFixture.oExpectedComponentProperties,
                            "sap.ui.component called with expected parameters");
                    })
                    .fail(function () {
                        assert.ok(false, "promise rejected");
                    })
                    .always(function () {
                        fnDone();
                    });
            }

            if (oFixture.hasOwnProperty("bAmendLoadingConfig")) {
                delete sap.ushell.Container;
                window["sap-ushell-config"] = { services: { "Ui5ComponentLoader": { config: { amendedLoading: oFixture.bAmendLoadingConfig } } } };
                sap.ushell.bootstrap("local").then(doTest);
            } else {
                doTest();
            }
        });
    });

    [{
        testDescription: "no special Bundle is provided in the bootstrap",
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/"
        },
        oExpectedComponentProperties: {
            name: "some.ui5.component",
            url: "component/url/",
            componentData: { "startupParameters": {} },
            async: true,
            asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": aDefaultCoreExtLightPreloadBundles
            }
        }
    }, {
        testDescription: "a special Bundle with one part is provided",
        bundle: {
            name: "core-resources-complement",
            count: 1,
            debugName: "core-resources-complement-dbg",
            path: "some/path/"
        },
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/"
        },
        oExpectedComponentProperties: {
            name: "some.ui5.component",
            url: "component/url/",
            componentData: { "startupParameters": {} },
            async: true,
            asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": ["some/path/core-resources-complement.js"]
            }
        }
    }, {
        testDescription: "a special Bundle with 5 parts is provided",
        bundle: {
            name: "core-resources-complement",
            count: 5,
            debugName: "core-resources-complement-dbg",
            path: "some/path/"
        },
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/"
        },
        oExpectedComponentProperties: {
            name: "some.ui5.component",
            url: "component/url/",
            componentData: { "startupParameters": {} },
            async: true,
            asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": [
                    "some/path/core-resources-complement-0.js",
                    "some/path/core-resources-complement-1.js",
                    "some/path/core-resources-complement-2.js",
                    "some/path/core-resources-complement-3.js",
                    "some/path/core-resources-complement-4.js"
                ]
            }
        }
    }, {
        testDescription: "no special Bundle is provided and debug resources are enabled",
        debugResources: true,
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/"
        },
        oExpectedComponentProperties: {
            name: "some.ui5.component",
            url: "component/url/",
            componentData: { "startupParameters": {} },
            async: true,
            asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": ["sap/fiori/core-ext-light.js"]
            }
        }
    }, {
        testDescription: "a special Bundle with one part is provided and debug resources are enabled",
        bundle: {
            name: "core-resources-complement",
            count: 1,
            debugName: "core-resources-complement-dbg",
            path: "some/path/"
        },
        debugResources: true,
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/"
        },
        oExpectedComponentProperties: {
            name: "some.ui5.component",
            url: "component/url/",
            componentData: { "startupParameters": {} },
            async: true,
            asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": ["some/path/core-resources-complement-dbg.js"]
            }
        }
    }, {
        testDescription: "a special Bundle with 5 parts is provided and debug resources are enabled",
        bundle: {
            name: "core-resources-complement",
            count: 5,
            debugName: "core-resources-complement-dbg",
            path: "some/path/"
        },
        debugResources: true,
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/"
        },
        oExpectedComponentProperties: {
            name: "some.ui5.component",
            url: "component/url/",
            componentData: { "startupParameters": {} },
            async: true,
            asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": ["some/path/core-resources-complement-dbg.js"]
            }
        }
    }, {
        testDescription: "a special Bundle with 5 parts is provided and sap-ui-debug is a path",
        bundle: {
            name: "core-resources-complement",
            count: 5,
            debugName: "core-resources-complement-dbg",
            path: "some/path/"
        },
        debugResources: "/some/debug/path",
        oTargetResolutionResult: {
            applicationType: "URL",
            ui5ComponentName: "some.ui5.component",
            url: "component/url/"
        },
        oExpectedComponentProperties: {
            name: "some.ui5.component",
            url: "component/url/",
            componentData: { "startupParameters": {} },
            async: true,
            asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": [
                    "some/path/core-resources-complement-0.js",
                    "some/path/core-resources-complement-1.js",
                    "some/path/core-resources-complement-2.js",
                    "some/path/core-resources-complement-3.js",
                    "some/path/core-resources-complement-4.js"
                ]
            }
        }
    }].forEach(function (oFixture) {
        QUnit.test("createComponent correct Bundle for AsyncHints when ", function (assert) {
            var fnDone = assert.async();

            if (oFixture.debugResources) {
                window["sap-ui-debug"] = oFixture.debugResources;
            }

            delete sap.ushell.Container;
            window["sap-ushell-config"] = {
                services: {
                    "Ui5ComponentLoader": {
                        config: {
                            amendedLoading: true,
                            coreResourcesComplement: oFixture.bundle
                        }
                    }
                }
            };
            sap.ushell.bootstrap("local").then(function () {
                var oFakeComponentMetadata = { fakeMetadata: null },
                    oFakeComponentInstance = {
                        getMetadata: function () {
                            return oFakeComponentMetadata;
                        }
                    };

                // only stubbing to override implementation
                sinon.stub(sap.ui, "component").returns(new Promise(function (fnResolve, fnRecject) {
                    fnResolve(oFakeComponentInstance);
                }));

                sap.ushell.Container.getServiceAsync("Ui5ComponentLoader").then(function (oUI5Loader) {
                    oUI5Loader.createComponent(
                        oFixture.oTargetResolutionResult, oFixture.oParsedShellHash, oFixture.oWaitForBeforeInstantiation)
                        .done(function (/*oActualAdjustedTargetResolutionResult*/) {
                            assert.strictEqual(sap.ui.component.callCount, 1,
                                "sap.ui.component called exactly 1 time");
                            assert.deepEqual(sap.ui.component.args[0][0], oFixture.oExpectedComponentProperties,
                                "sap.ui.component called with expected parameters");
                        })
                        .fail(function () {
                            assert.ok(false,
                                "promise rejected");
                        })
                        .always(function () {
                            delete window["sap-ui-debug"];
                            fnDone();
                        });
                });
            });
        });
    });

    QUnit.test("createComponent handles failures of sap.ui.component correctly", function (assert) {
        var fnDone = assert.async();
        var oExpectedError = { stack: "Dummy stacktrace" },
            oTargetResolutionResult = {
                applicationType: "URL",
                ui5ComponentName: "some.ui5.component",
                url: "component/url/"
            },
            oParsedShellHash = {
                semanticObject: "semanticObject",
                action: "action"
            };

        // only stubbing to override implementation
        sinon.stub(sap.ui, "component").returns(new Promise(function (fnResolve, fnReject) {
            fnReject(oExpectedError);
        }));

        sap.ushell.Container.getService("Ui5ComponentLoader").createComponent(
            oTargetResolutionResult, oParsedShellHash, [] /* no wait for promise */)
            .done(function (/*oActualAdjustedTargetResolutionResult*/) {
                assert.ok(false,
                    "expected promise to be rejected");
            })
            .fail(function (oActualError) {
                assert.deepEqual(oActualError, oExpectedError,
                    "error of sap.ui.component reject being passed");
            })
            .always(function () {
                fnDone();
            });
    });

    (function () {
        var oExpectedComponentProperties = {
            componentData: { startupParameters: {} },
            asyncHints: {
                "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"],
                "preloadBundles": aDefaultCoreExtLightPreloadBundles,
                "waitFor": []
            },
            name: "some.ui5.component",
            url: "component/url/",
            async: true,
            id: "application-semanticObject-action-component"
        };

        [{
            testDescription: "sap.ui.component promise fails with no stacktrace and status",
            oSapUiComponentPromiseRejectsWith: {
                // no status
                // no stack
                toString: function () {
                    return "a string error message";
                }
            },
            aExpectedLogArgs: [ // expected arguments of jQuery.sap.log.error
                "The issue is most likely caused by application some.ui5.component. Please create a support incident and assign it to the support component of the respective application.",
                "Failed to load UI5 component with properties: 'JSON_STRING'. Error: 'a string error message'",
                "some.ui5.component"
            ]
        }, {
            testDescription: "sap.ui.component promise fails with 'parsererror' status",
            oSapUiComponentPromiseRejectsWith: {
                status: "parsererror",
                // no stack
                toString: function () {
                    return "a string error message";
                }
            },
            aExpectedLogArgs: [
                "The issue is most likely caused by application some.ui5.component, as one or more of its resources could not be parsed. Please create a support incident and assign it to the support component of the respective application.",
                "Failed to load UI5 component with properties: 'JSON_STRING'. Error: 'a string error message'",
                "some.ui5.component"
            ]
        }, {
            testDescription: "sap.ui.component promise fails with a stack trace and a status",
            oSapUiComponentPromiseRejectsWith: {
                status: "parsererror",
                stack: "SomeError: cannot do this and that\nline1\nline2\nline3"
            },
            aExpectedLogArgs: [
                "The issue is most likely caused by application some.ui5.component, as one or more of its resources could not be parsed. Please create a support incident and assign it to the support component of the respective application.",
                "Failed to load UI5 component with properties: 'JSON_STRING'. Error likely caused by:\n"
                + [
                    "SomeError: cannot do this and that",
                    "line1",
                    "line2",
                    "line3"
                ].join("\n"),
                "some.ui5.component"
            ]
        }, {
            testDescription: "sap.ui.component promise fails with a stack trace and no status",
            oSapUiComponentPromiseRejectsWith: {
                // no status
                stack: "SomeError: cannot do this and that\nline1\nline2\nline3"
            },
            aExpectedLogArgs: [
                "The issue is most likely caused by application some.ui5.component. Please create a support incident and assign it to the support component of the respective application.",
                "Failed to load UI5 component with properties: 'JSON_STRING'. Error likely caused by:\n"
                + [
                    "SomeError: cannot do this and that",
                    "line1",
                    "line2",
                    "line3"
                ].join("\n"),
                "some.ui5.component"
            ]
        }].forEach(function (oFixture) {
            QUnit.test("createComponent logs failures of sap.ui.component correctly when " + oFixture.testDescription, function (assert) {
                var fnDone = assert.async();
                var oTargetResolutionResult = {
                    applicationType: "URL",
                    ui5ComponentName: "some.ui5.component",
                    url: "component/url/"
                },
                    oParsedShellHash = {
                        semanticObject: "semanticObject",
                        action: "action"
                    };

                // sap.ui.component fails as per fixture
                sinon.stub(sap.ui, "component").returns(new Promise(function (fnResolve, fnReject) {
                    fnReject(oFixture.oSapUiComponentPromiseRejectsWith);
                }));

                sinon.stub(jQuery.sap.log, "error");

                // Act
                sap.ushell.Container.getService("Ui5ComponentLoader").createComponent(
                    oTargetResolutionResult, oParsedShellHash, [] /* no wait for promise */)
                    .always(function () {
                        assert.strictEqual(jQuery.sap.log.error.callCount, 1,
                            "jQuery.sap.log.error was called one time");

                        // Assert
                        oFixture.aExpectedLogArgs.forEach(function (sExpectedArg, iIdx) {
                            var sGotArgument = jQuery.sap.log.error.args[0][iIdx];

                            var sCapturedJsonString;
                            if (sExpectedArg.indexOf("JSON_STRING") >= 0) {
                                // capture from json string from parameter and test separately
                                var reJsonString = /{[\s\S]+}/;
                                var aMatches = sGotArgument.match(reJsonString);
                                if (aMatches) {
                                    sCapturedJsonString = aMatches[0];
                                    sGotArgument = sGotArgument.replace(sCapturedJsonString, "JSON_STRING");
                                }
                            }
                            assert.strictEqual(sGotArgument, sExpectedArg,
                                "jQuery.sap.log.error was called with the correct argument #" + (iIdx + 1));

                            if (sCapturedJsonString) {
                                var oLoggedObject = JSON.parse(sCapturedJsonString);
                                assert.deepEqual(oLoggedObject, oExpectedComponentProperties,
                                    "the expected componentProperties object was logged");
                            }
                        });

                        fnDone();
                    });
            });
        });
    })();

    // Test logging of error messages in function _resolveSingleMatchingTarget.
    [{
        testDescription: "single message with severity 'trace'",
        severity: "trace",
        appProperties: {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{
                    severity: "trace",
                    text: "Foo log message!"
                }]
            }
        }
    }, {
        testDescription: "single message with severity 'debug'",
        severity: "debug",
        appProperties: {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{
                    severity: "debug",
                    text: "Foo log message!"
                }]
            }
        }
    }, {
        testDescription: "single message with severity 'info'",
        severity: "info",
        appProperties: {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{
                    severity: "info",
                    text: "Foo log message!"
                }]
            }
        }
    }, {
        testDescription: "single message with severity 'warning'",
        severity: "warning",
        appProperties: {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{
                    severity: "warning",
                    text: "Foo log message!"
                }]
            }
        }
    }, {
        testDescription: "single message with severity 'error'",
        severity: "error",
        appProperties: {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{
                    severity: "error",
                    text: "Foo log message!"
                }]
            }
        }
    }, {
        testDescription: "single message with severity 'fatal'",
        severity: "fatal",
        appProperties: {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{
                    severity: "fatal",
                    text: "Foo log message!"
                }]
            }
        }
    }, {
        testDescription: "single message with severity 'WARNING'",
        severity: "warning",
        appProperties: {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{
                    severity: "WARNING",
                    text: "Foo log message!"
                }]
            }
        }
    }, {
        testDescription: "single message with severity 'WaRnInG'",
        severity: "warning",
        appProperties: {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{
                    severity: "WaRnInG",
                    text: "Foo log message!"
                }]
            }
        }
    }, {
        testDescription: "single message with severity undefined",
        severity: "error",
        appProperties: {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{
                    severity: undefined,
                    text: "Foo log message!"
                }]
            }
        }
    }, {
        testDescription: "single message with severity 'supergau'",
        severity: "error",
        appProperties: {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{
                    severity: "supergau",
                    text: "Foo log message!"
                }]
            }
        }
    }, {
        testDescription: "single message without severity",
        severity: "error",
        appProperties: {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{ text: "Foo log message!" }]
            }
        }
    }, {
        testDescription: "single message without text",
        severity: "info",
        appProperties: {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{ severity: "info" }]
            }
        }
    }, {
        testDescription: "single message without severity or text",
        severity: "error",
        appProperties: {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{}]
            }
        }
    }, {
        testDescription: "single message with details defined",
        severity: "trace",
        appProperties: {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [{
                    severity: "trace",
                    details: "Foo Details, Bar",
                    text: "Foo log message!"
                }]
            }
        }
    }, {
        testDescription: "messages array is empty",
        severity: "error",
        appProperties: {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: []
            }
        }
    }, {
        testDescription: "messages array has two entries",
        severity: "error",
        appProperties: {
            applicationDependencies: {
                name: "foo.bar.Test",
                messages: [
                    {
                        severity: "error",
                        text: "Foo log message - number 1"
                    },
                    { text: "Foo log message - number 2" }
                ]
            }
        }
    }].forEach(function (oFixture) {
        QUnit.test("createComponent - ErrorLogging: " + oFixture.testDescription, function (assert) {
            var fnDone = assert.async();
            var oLogMock = testUtils.createLogMock(assert),
                oUi5ComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader"),
                oApplicationDependencies = oFixture.appProperties.applicationDependencies;

            if (jQuery.isArray(oApplicationDependencies.messages)) {
                oApplicationDependencies.messages.forEach(function (oMessage) {
                    oLogMock[oFixture.severity](oMessage.text, oMessage.details, oApplicationDependencies.name);
                });
            }

            oUi5ComponentLoader.createComponent(oFixture.appProperties)
                .always(function () {
                    oLogMock.verify(assert);
                    fnDone();
                });
        });
    });

    QUnit.test("CoreResourcesComplement Loading - Event is listened on", function (assert) {
        // Arrange
        var fnComponentLoaderEventCallback,
            oOnceStub = sinon.stub(oEventHub, "once").returns({ do: function (callback) { fnComponentLoaderEventCallback = callback; } }),
            oUi5ComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader"),
            oLoadCoreResourcesComplementStub = sinon.stub(oUi5ComponentLoader, "loadCoreResourcesComplement"),
            sExpectedOnceArg = "loadCoreResourcesComplement";

        // Act
        fnComponentLoaderEventCallback();

        // Assert
        assert.strictEqual(oOnceStub.firstCall.args[0], sExpectedOnceArg,
            "Subscribed to correct Event");
        assert.ok(oLoadCoreResourcesComplementStub.calledOnce,
            "CoreResourcesComplement Loading was triggered after corresponding event was fired");
    });

    [{
        testDescription: "sap-ui-debug is undefined",
        sapUiDebug: undefined,
        expectedResources: [
            "sap/fiori/core-ext-light-0.js",
            "sap/fiori/core-ext-light-1.js",
            "sap/fiori/core-ext-light-2.js",
            "sap/fiori/core-ext-light-3.js"
        ]
    }, {
        testDescription: "sap-ui-debug is false",
        sapUiDebug: false,
        expectedResources: [
            "sap/fiori/core-ext-light-0.js",
            "sap/fiori/core-ext-light-1.js",
            "sap/fiori/core-ext-light-2.js",
            "sap/fiori/core-ext-light-3.js"
        ]
    }, {
        testDescription: "sap-ui-debug is true",
        sapUiDebug: true,
        expectedResources: ["sap/fiori/core-ext-light.js"]
    }, {
        testDescription: "sap-ui-debug is a path",
        sapUiDebug: "path/to/module",
        expectedResources: [
            "sap/fiori/core-ext-light-0.js",
            "sap/fiori/core-ext-light-1.js",
            "sap/fiori/core-ext-light-2.js",
            "sap/fiori/core-ext-light-3.js"
        ]
    }].forEach(function (oFixture) {
        QUnit.test("CoreResourcesComplement Loading - loadCoreResourcesComplement loads the correct resources when " + oFixture.testDescription + " and NO Bundle is provided in the configuration", function (assert) {
            // Arrange
            var oUi5ComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader"),
                oLoadBundleStub = sinon.stub(oUi5ComponentLoaderUtils, "loadBundle").returns(new jQuery.Deferred().resolve().promise()),
                oExpectedBundle = {
                    name: "CoreResourcesComplement",
                    aResources: oFixture.expectedResources
                };

            window["sap-ui-debug"] = oFixture.sapUiDebug;

            // Act
            oUi5ComponentLoader.loadCoreResourcesComplement();

            // Assert
            assert.deepEqual(oLoadBundleStub.firstCall.args[0], oExpectedBundle,
                "loadBundle called with correct bundle");

            // Cleanup
            oLoadBundleStub.restore();
            delete window["sap-ui-debug"];
        });
    });

    [{
        testDescription: "sap-ui-debug is undefined",
        sapUiDebug: undefined,
        oUi5ComponentLoaderConfig: {
            coreResourcesComplement: {
                name: "someCustomBundle",
                count: 3,
                debugName: "someCustomBundleDebug",
                path: "some/proper/path/"
            }
        },
        expectedResources: [
            "some/proper/path/someCustomBundle-0.js",
            "some/proper/path/someCustomBundle-1.js",
            "some/proper/path/someCustomBundle-2.js"
        ],
        expectedBundleEventName: "CoreResourcesComplement"
    }, {
        testDescription: "sap-ui-debug is false",
        sapUiDebug: false,
        oUi5ComponentLoaderConfig: {
            coreResourcesComplement: {
                name: "anotherCustomBundle",
                count: 5,
                debugName: "someCustomBundleDebug",
                path: "some/proper/path/"
            }
        },
        expectedResources: [
            "some/proper/path/anotherCustomBundle-0.js",
            "some/proper/path/anotherCustomBundle-1.js",
            "some/proper/path/anotherCustomBundle-2.js",
            "some/proper/path/anotherCustomBundle-3.js",
            "some/proper/path/anotherCustomBundle-4.js"
        ],
        expectedBundleEventName: "CoreResourcesComplement"
    }, {
        testDescription: "sap-ui-debug is true",
        sapUiDebug: true,
        oUi5ComponentLoaderConfig: {
            coreResourcesComplement: {
                name: "someCustomBundle",
                count: 3,
                debugName: "someCustomBundleDebug",
                path: "some/proper/path/"
            }
        },
        expectedResources: ["some/proper/path/someCustomBundleDebug.js"],
        expectedBundleEventName: "CoreResourcesComplement"
    }, {
        testDescription: "sap-ui-debug is false",
        sapUiDebug: false,
        oUi5ComponentLoaderConfig: {
            coreResourcesComplement: {
                name: "someCustomBundle",
                count: 1,
                debugName: "someCustomBundleDebug",
                path: "some/proper/path/"
            }
        },
        expectedResources: ["some/proper/path/someCustomBundle.js"],
        expectedBundleEventName: "CoreResourcesComplement"
    }, {
        testDescription: "sap-ui-debug is a path",
        sapUiDebug: "path/to/module",
        oUi5ComponentLoaderConfig: {
            coreResourcesComplement: {
                name: "anotherCustomBundle",
                count: 5,
                debugName: "someCustomBundleDebug",
                path: "some/proper/path/"
            }
        },
        expectedResources: [
            "some/proper/path/anotherCustomBundle-0.js",
            "some/proper/path/anotherCustomBundle-1.js",
            "some/proper/path/anotherCustomBundle-2.js",
            "some/proper/path/anotherCustomBundle-3.js",
            "some/proper/path/anotherCustomBundle-4.js"
        ],
        expectedBundleEventName: "CoreResourcesComplement"
    }].forEach(function (oFixture) {
        QUnit.test("CoreResourcesComplement Loading - loadCoreResourcesComplement loads the correct resources when " + oFixture.testDescription + " and a Bundle is provided in the configuration", function (assert) {
            // Arrange
            var oUi5ComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader"),
                oLoadBundleStub = sinon.stub(oUi5ComponentLoaderUtils, "loadBundle").returns(new jQuery.Deferred().resolve().promise()),
                oExpectedBundle = {
                    name: oFixture.expectedBundleEventName,
                    aResources: oFixture.expectedResources
                };

            window["sap-ui-debug"] = oFixture.sapUiDebug;

            // Act
            oUi5ComponentLoader._oConfig = oFixture.oUi5ComponentLoaderConfig;
            oUi5ComponentLoader.loadCoreResourcesComplement();

            // Assert
            assert.deepEqual(oLoadBundleStub.firstCall.args[0], oExpectedBundle,
                "loadBundle called wih the correct Bundle");

            // Cleanup
            oLoadBundleStub.restore();
            delete window["sap-ui-debug"];
        });
    });

    [{
        testDescription: "returns a Promise and resolves it when the Bundle is loaded",
        oLoadBundlePromise: new jQuery.Deferred().resolve().promise(),
        shouldSucceed: true
    }, {
        testDescription: "returns a Promise and rejects it when the Bundle fails to load",
        oLoadBundlePromise: new jQuery.Deferred().resolve().reject(),
        shouldSucceed: true
    }].forEach(function (oFixture) {
        QUnit.test("CoreResourcesComplement Loading - loadCoreResourcesComplement ", function (assert) {
            // Arrange
            var oUi5ComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader"),
                oPromise,
                oEmitStub = sinon.stub(oEventHub, "emit"),
                fnDone = assert.async();

            sinon.stub(oUi5ComponentLoaderUtils, "loadBundle").returns(oFixture.oLoadBundlePromise);

            // Act
            oPromise = oUi5ComponentLoader.loadCoreResourcesComplement();

            // Assert
            oPromise
                .done(function () {
                    assert.strictEqual(oFixture.shouldSucceed, true,
                        "Promise was resolved");
                    assert.strictEqual(oEmitStub.calledWith("CoreResourcesComplementLoaded", { status: "success" }), true,
                        "Event was listened on");
                    fnDone();
                })
                .fail(function () {
                    assert.strictEqual(oFixture.shouldSucceed, false,
                        "Promise was rejected");
                    assert.strictEqual(oEmitStub.calledWith("CoreResourcesComplementLoaded", { status: "failed" }), true,
                        "Event was listened on");
                    fnDone();
                });
        });
    });

    QUnit.test("CoreResourcesComplement Loading - loadCoreResourcesComplement returns a Promise and, on success, keeps a record of it for future calls so the logic doesn't get executed multiple times", function (assert) {
        // Arrange
        var oUi5ComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader"),
            oPromise,
            oSecondPromise,
            oLoadBundlePromise = new jQuery.Deferred(),
            fnDone = assert.async();

        sinon.stub(oUi5ComponentLoaderUtils, "loadBundle").returns(oLoadBundlePromise.promise());

        // Act
        oPromise = oUi5ComponentLoader.loadCoreResourcesComplement();
        oLoadBundlePromise.resolve();
        oSecondPromise = oUi5ComponentLoader.loadCoreResourcesComplement();

        // Assert
        assert.strictEqual(oPromise, oSecondPromise, "Later calls return the same promise");

        jQuery.when(oPromise, oSecondPromise)
            .done(function () {
                assert.ok("Both promises resolved");
                fnDone();
            });
    });

    QUnit.test("CoreResourcesComplement Loading - loadCoreResourcesComplement returns a Promise and, on failure, tries to load the bundles again after a second call", function (assert) {
        // Arrange
        var oUi5ComponentLoader = sap.ushell.Container.getService("Ui5ComponentLoader"),
            oPromise,
            oSecondPromise,
            oLoadBundlePromise = new jQuery.Deferred(),
            fnDone = assert.async();
        assert.expect(2);

        var loadBundleStub = sinon.stub(oUi5ComponentLoaderUtils, "loadBundle").returns(oLoadBundlePromise.promise());

        // Act
        oPromise = oUi5ComponentLoader.loadCoreResourcesComplement();
        oLoadBundlePromise.reject();
        oLoadBundlePromise = new jQuery.Deferred();
        loadBundleStub.returns(oLoadBundlePromise.promise());
        oSecondPromise = oUi5ComponentLoader.loadCoreResourcesComplement();
        oLoadBundlePromise.resolve();

        // Assert
        jQuery.when(oPromise, oSecondPromise)
            .always(function () {
                assert.strictEqual(oPromise.state(),
                    "rejected", "First promise rejected");
                assert.strictEqual(oSecondPromise.state(),
                    "resolved", "Second promise resolved");
                fnDone();
            });
    });
});
