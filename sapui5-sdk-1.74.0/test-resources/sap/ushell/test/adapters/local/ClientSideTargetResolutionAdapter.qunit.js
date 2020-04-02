// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for
 *               sap.ushell.adapters.local.ClientSideTargetResolutionAdapter
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, module, start, test
     */

    jQuery.sap.require("sap.ushell.adapters.local.ClientSideTargetResolutionAdapter");


        // Tests that do _not_ require a config for the adapter
        module("sap.ushell.adapters.local.ClientSideTargetResolutionAdapter - empty config", {
            setup : function () {
                var oSystem = {},
                    oConfig = {config:{_comment: "dummy config"}};

                this.oAdapter = new sap.ushell.adapters.local.ClientSideTargetResolutionAdapter(
                        oSystem,
                        undefined,
                        oConfig
                );
            },
            teardown : function () {
                delete this.oAdapter;
            }
        });

        [
            {
                testDescription: "applications is empty",
                oApplications: {},
                expectedInbounds: []
            },
            {
                testDescription: "applications has only a comment",
                oApplications: {
                    _comment: "Comment"
                },
                expectedInbounds: []
            },
            {
                testDescription: "applications has only one entry",
                oApplications: {
                    "SemObject-action1" : {
                        _comment: "the one and only application",
                        additionalInformation: "SAPUI5.Component=sap.ushell.demo.TheOneAndOnly",
                        applicationType: "URL",
                        url: "../../../../../test-resources/sap/ushell/demoapps/TheOneAndOnly",
                        description: "this is the one and only app"
                    }
                },
                expectedInbounds: [
                    {
                        semanticObject: "SemObject",
                        action: "action1",
                        title: "this is the one and only app",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        resolutionResult: {
                            applicationType: "SAPUI5",
                            additionalInformation: "SAPUI5.Component=sap.ushell.demo.TheOneAndOnly",
                            ui5ComponentName: "sap.ushell.demo.TheOneAndOnly",
                            applicationDependencies: {
                                self: {
                                    name: "sap.ushell.demo.TheOneAndOnly"
                                },
                                asyncHints: {
                                    libs: [
                                        {
                                            name : "sap.ui.core"
                                        },
                                        {
                                            name : "sap.ui.unified"
                                        }
                                    ]
                                }
                            },
                            url: "../../../../../test-resources/sap/ushell/demoapps/TheOneAndOnly"
                        }
                    }
                ]
            },
            {
                testDescription: "the intent is empty (default intent)",
                oApplications: {
                    "" : {
                        _comment: "the one and only application",
                        additionalInformation: "SAPUI5.Component=sap.ushell.demo.TheOneAndOnly",
                        applicationType: "URL",
                        url: "../../../../../test-resources/sap/ushell/demoapps/TheOneAndOnly",
                        description: "this is the one and only app"
                    }
                },
                expectedInbounds: [
                    {
                        semanticObject: "",
                        action: "",
                        title: "this is the one and only app",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        resolutionResult: {
                            applicationType: "SAPUI5",
                            additionalInformation: "SAPUI5.Component=sap.ushell.demo.TheOneAndOnly",
                            ui5ComponentName: "sap.ushell.demo.TheOneAndOnly",
                            applicationDependencies: {
                                self: {
                                    name: "sap.ushell.demo.TheOneAndOnly"
                                },
                                asyncHints: {
                                    libs: [
                                        {
                                            name : "sap.ui.core"
                                        },
                                        {
                                            name : "sap.ui.unified"
                                        }
                                    ]
                                }
                            },
                            url: "../../../../../test-resources/sap/ushell/demoapps/TheOneAndOnly"
                        }
                    }
                ]
            },
            {
                testDescription: "the intent is '-' (default intent)",
                oApplications: {
                    "WCFApp-display": {
                        _comment: "the one and only application",
                        additionalInformation: "",
                        applicationType: "WCF",
                        url: "../../../../../test-resources/sap/ushell/demoapps/TheOneAndOnly",
                        description: "this is the one and only WCF app"
                    }
                },
                expectedInbounds: [
                    {
                        semanticObject: "WCFApp",
                        action: "display",
                        title: "this is the one and only WCF app",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        resolutionResult: {
                            "additionalInformation": "",
                            "applicationType": "WCF",
                            "url": "../../../../../test-resources/sap/ushell/demoapps/TheOneAndOnly"
                        }
                    }
                ]
            },
            {
                testDescription: "the intent is '-' (default intent)",
                oApplications: {
                    "-" : {
                        _comment: "the one and only application",
                        additionalInformation: "SAPUI5.Component=sap.ushell.demo.TheOneAndOnly",
                        applicationType: "URL",
                        url: "../../../../../test-resources/sap/ushell/demoapps/TheOneAndOnly",
                        description: "this is the one and only app"
                    }
                },
                expectedInbounds: [
                    {
                        semanticObject: "",
                        action: "",
                        title: "this is the one and only app",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        resolutionResult: {
                            applicationType: "SAPUI5",
                            additionalInformation: "SAPUI5.Component=sap.ushell.demo.TheOneAndOnly",
                            ui5ComponentName: "sap.ushell.demo.TheOneAndOnly",
                            applicationDependencies: {
                                self: {
                                    name: "sap.ushell.demo.TheOneAndOnly"
                                },
                                asyncHints: {
                                    libs: [
                                        {
                                            name : "sap.ui.core"
                                        },
                                        {
                                            name : "sap.ui.unified"
                                        }
                                    ]
                                }
                            },
                            url: "../../../../../test-resources/sap/ushell/demoapps/TheOneAndOnly"
                        }
                    }
                ]
            },
            {
                testDescription: "applications has only one entry plus one comment",
                oApplications: {
                    _comment: "This comment should not harm",
                    "SemObject-action1" : {
                        _comment: "the one and only application",
                        additionalInformation: "SAPUI5.Component=sap.ushell.demo.TheOneAndOnly",
                        applicationType: "URL",
                        url: "../../../../../test-resources/sap/ushell/demoapps/TheOneAndOnly",
                        description: "this is the one and only app"
                    }
                },
                expectedInbounds: [
                    {
                        semanticObject: "SemObject",
                        action: "action1",
                        title: "this is the one and only app",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        resolutionResult: {
                            applicationType: "SAPUI5",
                            additionalInformation: "SAPUI5.Component=sap.ushell.demo.TheOneAndOnly",
                            ui5ComponentName: "sap.ushell.demo.TheOneAndOnly",
                            applicationDependencies: {
                                self: {
                                    name: "sap.ushell.demo.TheOneAndOnly"
                                },
                                asyncHints: {
                                    libs: [
                                        {
                                            name : "sap.ui.core"
                                        },
                                        {
                                            name : "sap.ui.unified"
                                        }
                                    ]
                                }
                            },
                            url: "../../../../../test-resources/sap/ushell/demoapps/TheOneAndOnly"
                        }
                    }
                ]
            },
            {
                testDescription: "applications has two entries",
                oApplications: {
                    "SemObject-action1" : {
                        _comment: "the first application",
                        additionalInformation: "SAPUI5.Component=sap.ushell.demo.TheFirstOne",
                        applicationType: "SAPUI5",
                        url: "../../../../../test-resources/sap/ushell/demoapps/TheFirstOne",
                        description: "this is the first one"
                    },
                    "SemObject-action2" : {
                        _comment: "the second application",
                        additionalInformation: "SAPUI5.Component=sap.ushell.demo.TheSecondOne",
                        applicationType: "SAPUI5",
                        url: "../../../../../test-resources/sap/ushell/demoapps/TheSecondOne",
                        description: "this is the second one"
                    }
                },
                expectedInbounds: [
                    {
                        semanticObject: "SemObject",
                        action: "action1",
                        title: "this is the first one",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        resolutionResult: {
                            applicationType: "SAPUI5",
                            additionalInformation: "SAPUI5.Component=sap.ushell.demo.TheFirstOne",
                            ui5ComponentName: "sap.ushell.demo.TheFirstOne",
                            applicationDependencies: {
                                self: {
                                    name: "sap.ushell.demo.TheFirstOne"
                                },
                                asyncHints: {
                                    libs: [
                                        {
                                            name : "sap.ui.core"
                                        },
                                        {
                                            name : "sap.ui.unified"
                                        }
                                    ]
                                }
                            },
                            url: "../../../../../test-resources/sap/ushell/demoapps/TheFirstOne"
                        }
                    },
                    {
                        semanticObject: "SemObject",
                        action: "action2",
                        title: "this is the second one",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        resolutionResult: {
                            applicationType: "SAPUI5",
                            additionalInformation: "SAPUI5.Component=sap.ushell.demo.TheSecondOne",
                            ui5ComponentName: "sap.ushell.demo.TheSecondOne",
                            applicationDependencies: {
                                self: {
                                    name: "sap.ushell.demo.TheSecondOne"
                                },
                                asyncHints: {
                                    libs: [
                                        {
                                            name : "sap.ui.core"
                                        },
                                        {
                                            name : "sap.ui.unified"
                                        }
                                    ]
                                }
                            },
                            url: "../../../../../test-resources/sap/ushell/demoapps/TheSecondOne"
                        }
                    }
                ]
            },
            {
                testDescription: "applications has two entries",
                oApplications:
                {
                    "TestNavigation-source": {
                      "_comment": "WebGUI application to trigger FLP navigation",
                      "applicationType": "NWBC",
                      "navigationMode": "embedded",
                      "url": "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN",
                      "description": "WebGUI application to trigger FLP navigation"
                    },
                    "TestNavigation-target": {
                      "_comment": "WDA target application for FLP navigation hhhhhh",
                      "applicationType": "NWBC",
                      "navigationMode": "embedded",
                      "url": "/ui2/nwbc/~canvas;window=app/wda/WDR_H_FLP_NAVIGATION_TARGET",
                      "description": "WDA target application for FLP navigation"
                    }
                },
                expectedInbounds: [
                    {
                        "semanticObject": "TestNavigation",
                        "action": "source",
                        "title": "WebGUI application to trigger FLP navigation",
                        "signature": {
                          "parameters": {},
                          "additionalParameters": "allowed"
                        },
                        "resolutionResult": {
                          "additionalInformation" : "",
                          "applicationType": "TR",
                          "url": "/sap/bc/gui/sap/its/webgui;~sysid=UV2;~service=3255?%7etransaction=SU01&%7enosplash=1&sap-client=120&sap-language=EN"
                        }
                    },
                    {
                        "semanticObject": "TestNavigation",
                        "action": "target",
                        "title": "WDA target application for FLP navigation",
                        "signature": {
                          "parameters": {},
                          "additionalParameters": "allowed"
                        },
                        "resolutionResult": {
                          "additionalInformation" : "",
                          "applicationType": "WDA",
                          "url": "/ui2/nwbc/~canvas;window=app/wda/WDR_H_FLP_NAVIGATION_TARGET"
                        }
                    }
                ]
            }
        ].forEach(function(oFixture) {
            test("_transformApplicationsToInbounds returns the expected Inbounds when " + oFixture.testDescription, 1, function () {
                var aActualInbounds;

                // Act
                aActualInbounds = this.oAdapter._transformApplicationsToInbounds(oFixture.oApplications);
                // Assert
                deepEqual(aActualInbounds, oFixture.expectedInbounds, "ok");
            });
        });

        // Tests that do require a config for the adapter
        module("sap.ushell.adapters.local.ClientSideTargetResolutionAdapter - with config", {
            setup : function () {
            },
            teardown : function () {
            }
        });

        [
            {
                testDescription: "the adapter config has neither inbounds nor applications",
                oAdapterConfig: {},
                expectedInbounds: []
            },
            {
                testDescription: "the adapter config has applications",
                oAdapterConfig: {
                    config: {
                        applications: {
                            "_comment": "For your applications, better use absolute pathes to the url to test it! (e.g. /ushell/). We use relative pathes to be able to run the application on a central server. Map of applications keyed by URL fragment used for navigation.",
                            "" : {
                                "_comment": "default application - empty URL hash",
                                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.FioriSandboxDefaultApp",
                                "applicationType": "URL",
                                "url": "../../../../../test-resources/sap/ushell/demoapps/FioriSandboxDefaultApp"
                            },
                            "Action-todefaultapp" : {
                                "_comment": "default application as explicit navigation target",
                                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.FioriSandboxDefaultApp",
                                "applicationType": "URL",
                                "url": "../../../../../test-resources/sap/ushell/demoapps/FioriSandboxDefaultApp",
                                "description": "Default App : shows statically registered apps (fioriSandboxConfig.js) "
                            },
                            "Action-toappnavsample" : {
                                "_comment": "Demonstrates resource-based navigation inside a shell runtime with a simple inner-app routing sample using explicit event handlers. Run for example as: http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#AppNavSample-display&/Detail, http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#AppNavSample-display&/View1",
                                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                                "applicationType": "URL",
                                "url": "../../../../../test-resources/sap/ushell/demoapps/AppNavSample?fixed-param1=value1&array-param1=value1&array-param1=value2",
                                "description": "Navigation Sample 1: demo for startup parameter passing and routing with event handlers"
                            }
                        }
                    }
                },
                expectedInbounds: [
                    {
                        semanticObject: "",
                        action: "",
                        title: "",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        resolutionResult: {
                            applicationType: "SAPUI5",
                            additionalInformation: "SAPUI5.Component=sap.ushell.demo.FioriSandboxDefaultApp",
                            ui5ComponentName: "sap.ushell.demo.FioriSandboxDefaultApp",
                            applicationDependencies: {
                                self: {
                                    name: "sap.ushell.demo.FioriSandboxDefaultApp"
                                },
                                asyncHints: {
                                    libs: [
                                        {
                                            name : "sap.ui.core"
                                        },
                                        {
                                            name : "sap.ui.unified"
                                        }
                                    ]
                                }
                            },
                            url: "../../../../../test-resources/sap/ushell/demoapps/FioriSandboxDefaultApp"
                        }
                   },
                    {
                        semanticObject: "Action",
                        action: "todefaultapp",
                        title: "Default App : shows statically registered apps (fioriSandboxConfig.js) ",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        resolutionResult: {
                            applicationType: "SAPUI5",
                            additionalInformation: "SAPUI5.Component=sap.ushell.demo.FioriSandboxDefaultApp",
                            ui5ComponentName: "sap.ushell.demo.FioriSandboxDefaultApp",
                            applicationDependencies: {
                                self: {
                                    name: "sap.ushell.demo.FioriSandboxDefaultApp"
                                },
                                asyncHints: {
                                    libs: [
                                        {
                                            name : "sap.ui.core"
                                        },
                                        {
                                            name : "sap.ui.unified"
                                        }
                                    ]
                                }
                            },
                            url: "../../../../../test-resources/sap/ushell/demoapps/FioriSandboxDefaultApp"
                        }
                    },
                    {
                        semanticObject: "Action",
                        action: "toappnavsample",
                        title: "Navigation Sample 1: demo for startup parameter passing and routing with event handlers",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        resolutionResult: {
                            applicationType: "SAPUI5",
                            additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                            ui5ComponentName: "sap.ushell.demo.AppNavSample",
                            applicationDependencies: {
                                self: {
                                    name: "sap.ushell.demo.AppNavSample"
                                },
                                asyncHints: {
                                    libs: [
                                        {
                                            name: "sap.ui.core"
                                        },
                                        {
                                            name: "sap.ui.unified"
                                        }
                                    ]
                                }
                            },
                            url: "../../../../../test-resources/sap/ushell/demoapps/AppNavSample?fixed-param1=value1&array-param1=value1&array-param1=value2"
                        }
                    }
                ]
            },
            {
                testDescription: "the adapter config contains only applications with application dependencies already present",
                oAdapterConfig: {
                    config: {
                        applications: {
                            "masterDetail-display": {
                                "additionalInformation": "SAPUI5.Component=sap.ui.demoapps.rta.freestyle",
                                "applicationType": "URL",
                                "url": "../",
                                "title": "Products Manage",
                                "description": "UI Adaptation at Runtime",
                                "applicationDependencies": {
                                    "self": {
                                        "name": "sap.ui.demoapps.rta.freestyle"
                                    },
                                    "manifest": true,
                                    "asyncHints": {
                                        "libs": [
                                            {
                                                "name": "sap.ui.core"
                                            },
                                            {
                                                "name": "sap.ui.unified"
                                            },
                                            {
                                                "name": "sap.ui.fl"
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                expectedInbounds: [
                    {
                        semanticObject: "masterDetail",
                        action: "display",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        title: "UI Adaptation at Runtime",
                        resolutionResult: {
                            applicationType: "SAPUI5",
                            additionalInformation: "SAPUI5.Component=sap.ui.demoapps.rta.freestyle",
                            ui5ComponentName: "sap.ui.demoapps.rta.freestyle",
                            applicationDependencies: {
                                self: {
                                    name: "sap.ui.demoapps.rta.freestyle"
                                },
                                manifest: true,
                                asyncHints: {
                                    libs: [
                                        {
                                            name: "sap.ui.core"
                                        },
                                        {
                                            name: "sap.ui.unified"
                                        },
                                        {
                                            name: "sap.ui.fl"
                                        }
                                    ]
                                }
                            },
                            url: "../"
                        }
                    }
                ]
            },
            {
                testDescription: "the adapter config has inbounds",
                oAdapterConfig: {
                    config: {
                        inbounds: {
                            "": {
                                semanticObject: "",
                                action: "",
                                title: "",
                                signature: {
                                    parameters: {},
                                    additionalParameters: "allowed"
                                },
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.FioriSandboxDefaultApp",
                                    url: "../../../../../test-resources/sap/ushell/demoapps/FioriSandboxDefaultApp"
                                }
                            },
                            actionToDefaultApp: {
                                semanticObject: "Action",
                                action: "todefaultapp",
                                title: "Default App : shows statically registered apps (fioriSandboxConfig.js) ",
                                signature: {
                                    parameters: {},
                                    additionalParameters: "allowed"
                                },
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.FioriSandboxDefaultApp",
                                    url: "../../../../../test-resources/sap/ushell/demoapps/FioriSandboxDefaultApp"
                                }
                            },
                            actionToAppNavSample: {
                                semanticObject: "Action",
                                action: "toappnavsample",
                                title: "Navigation Sample 1: demo for startup parameter passing and routing with event handlers",
                                signature: {
                                    parameters: {},
                                    additionalParameters: "allowed"
                                },
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                                    url: "../../../../../test-resources/sap/ushell/demoapps/AppNavSample?fixed-param1=value1&array-param1=value1&array-param1=value2"
                                }
                            }
                        }
                    }
                },
                expectedInbounds: [
                   {
                        semanticObject: "",
                        action: "",
                        title: "",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        resolutionResult: {
                            applicationType: "SAPUI5",
                            additionalInformation: "SAPUI5.Component=sap.ushell.demo.FioriSandboxDefaultApp",
                            ui5ComponentName: "sap.ushell.demo.FioriSandboxDefaultApp",
                            applicationDependencies: {
                                self: {
                                    name: "sap.ushell.demo.FioriSandboxDefaultApp"
                                },
                                asyncHints: {
                                    libs: [
                                        {
                                            name : "sap.ui.core"
                                        },
                                        {
                                            name : "sap.ui.unified"
                                        }
                                    ]
                                }
                            },
                            url: "../../../../../test-resources/sap/ushell/demoapps/FioriSandboxDefaultApp"
                        }
                    },
                    {
                        semanticObject: "Action",
                        action: "todefaultapp",
                        title: "Default App : shows statically registered apps (fioriSandboxConfig.js) ",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        resolutionResult: {
                            applicationType: "SAPUI5",
                            additionalInformation: "SAPUI5.Component=sap.ushell.demo.FioriSandboxDefaultApp",
                            ui5ComponentName: "sap.ushell.demo.FioriSandboxDefaultApp",
                            applicationDependencies: {
                                self: {
                                    name: "sap.ushell.demo.FioriSandboxDefaultApp"
                                },
                                asyncHints: {
                                    libs: [
                                        {
                                            name : "sap.ui.core"
                                        },
                                        {
                                            name : "sap.ui.unified"
                                        }
                                    ]
                                }
                            },
                            url: "../../../../../test-resources/sap/ushell/demoapps/FioriSandboxDefaultApp"
                        }
                    },
                    {
                        semanticObject: "Action",
                        action: "toappnavsample",
                        title: "Navigation Sample 1: demo for startup parameter passing and routing with event handlers",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        resolutionResult: {
                            applicationType: "SAPUI5",
                            additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                            ui5ComponentName: "sap.ushell.demo.AppNavSample",
                            applicationDependencies: {
                                self: {
                                    name: "sap.ushell.demo.AppNavSample"
                                },
                                asyncHints: {
                                    libs: [
                                        {
                                            name : "sap.ui.core"
                                        },
                                        {
                                            name : "sap.ui.unified"
                                        }
                                    ]
                                }
                            },
                            url: "../../../../../test-resources/sap/ushell/demoapps/AppNavSample?fixed-param1=value1&array-param1=value1&array-param1=value2"
                        }
                    }
                ]
            },
            {
                testDescription: "the adapter config has an inbound with applicationDependencies",
                oAdapterConfig: {
                    config: {
                        inbounds: {
                            actionToAppNavSample: {
                                semanticObject: "Action",
                                action: "toappnavsample",
                                title: "Navigation Sample 1: demo for startup parameter passing and routing with event handlers",
                                signature: {
                                    parameters: {},
                                    additionalParameters: "allowed"
                                },
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                                    applicationDependencies: {
                                        self: {
                                            name: "sap.ushell.demo.AppNavSample"
                                        },
                                        libs: [
                                            "sap.m",
                                            "sap.rta"
                                        ]
                                    },
                                    url: "../../../../../test-resources/sap/ushell/demoapps/AppNavSample?fixed-param1=value1&array-param1=value1&array-param1=value2"
                                }
                            }
                        }
                    }
                },
                expectedInbounds: [
                    {
                        semanticObject: "Action",
                        action: "toappnavsample",
                        title: "Navigation Sample 1: demo for startup parameter passing and routing with event handlers",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        resolutionResult: {
                            applicationType: "SAPUI5",
                            additionalInformation: "SAPUI5.Component=sap.ushell.demo.AppNavSample",
                            ui5ComponentName: "sap.ushell.demo.AppNavSample",
                            applicationDependencies: {
                                self: {
                                    name: "sap.ushell.demo.AppNavSample"
                                },
                                libs: [
                                    "sap.m",
                                    "sap.rta"
                                ]
                            },
                            url: "../../../../../test-resources/sap/ushell/demoapps/AppNavSample?fixed-param1=value1&array-param1=value1&array-param1=value2"
                        }
                    }
                ]
            },
            {
                testDescription: "the adapter config has disjunctive inbounds and applications",
                oAdapterConfig: {
                    config: {
                        inbounds: {
                            "": {
                                semanticObject: "",
                                action: "",
                                title: "",
                                signature: {
                                    parameters: {},
                                    additionalParameters: "allowed"
                                },
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                        additionalInformation: "SAPUI5.Component=sap.ushell.demo.FioriSandboxDefaultApp",
                                        url: "../../../../../test-resources/sap/ushell/demoapps/FioriSandboxDefaultApp"
                                }
                            },
                            actionToInboundsApp1: {
                                semanticObject: "Action",
                                action: "toinboundsapp1",
                                title: "First inbounds app",
                                signature: {
                                     parameters: {},
                                     additionalParameters: "allowed"
                                },
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.InboundsApp1",
                                    url: "../../../../../test-resources/sap/ushell/demoapps/InboundsApp1"
                                }
                            },
                            actionToInboundsApp2: {
                                semanticObject: "Action",
                                action: "toinboundsapp2",
                                title: "Second inbounds app",
                                signature: {
                                    parameters: {},
                                    additionalParameters: "allowed"
                                },
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.InboundsApp2",
                                    url: "../../../../../test-resources/sap/ushell/demoapps/InboundsApp2"
                                }
                            }
                        },
                        applications: {
                            "_comment": "For your applications, better use absolute pathes to the url to test it! (e.g. /ushell/). We use relative pathes to be able to run the application on a central server. Map of applications keyed by URL fragment used for navigation.",
                            "Action-toApplicationsApp1" : {
                                "_comment": "Applications app 1",
                                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.ApplicationsApp1",
                                "applicationType": "URL",
                                "url": "../../../../../test-resources/sap/ushell/demoapps/ApplicationsApp1",
                                "description": "This the first applications app"
                            },
                            "Action-toApplicationsApp2" : {
                                "_comment": "Applications app 2",
                                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.ApplicationsApp2",
                                "applicationType": "URL",
                                "url": "../../../../../test-resources/sap/ushell/demoapps/ApplicationsApp2",
                                "description": "This the second applications app"
                            }
                        }
                    }
                },
                expectedInbounds: [
                    {
                        semanticObject: "",
                        action: "",
                        title: "",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        resolutionResult: {
                            applicationType: "SAPUI5",
                            additionalInformation: "SAPUI5.Component=sap.ushell.demo.FioriSandboxDefaultApp",
                            ui5ComponentName: "sap.ushell.demo.FioriSandboxDefaultApp",
                            applicationDependencies: {
                                self: {
                                    name: "sap.ushell.demo.FioriSandboxDefaultApp"
                                },
                                asyncHints: {
                                    libs: [
                                        {
                                            name : "sap.ui.core"
                                        },
                                        {
                                            name : "sap.ui.unified"
                                        }
                                    ]
                                }
                            },
                            url: "../../../../../test-resources/sap/ushell/demoapps/FioriSandboxDefaultApp"
                        }
                    },
                    {
                        semanticObject: "Action",
                        action: "toinboundsapp1",
                        title: "First inbounds app",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        resolutionResult: {
                            applicationType: "SAPUI5",
                            additionalInformation: "SAPUI5.Component=sap.ushell.demo.InboundsApp1",
                            ui5ComponentName: "sap.ushell.demo.InboundsApp1",
                            applicationDependencies: {
                                self: {
                                    name: "sap.ushell.demo.InboundsApp1"
                                },
                                asyncHints: {
                                    libs: [
                                        {
                                            name : "sap.ui.core"
                                        },
                                        {
                                            name : "sap.ui.unified"
                                        }
                                    ]
                                }
                            },
                            url: "../../../../../test-resources/sap/ushell/demoapps/InboundsApp1"
                        }
                    },
                    {
                        semanticObject: "Action",
                        action: "toinboundsapp2",
                        title: "Second inbounds app",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        resolutionResult: {
                            applicationType: "SAPUI5",
                            additionalInformation: "SAPUI5.Component=sap.ushell.demo.InboundsApp2",
                            ui5ComponentName: "sap.ushell.demo.InboundsApp2",
                            applicationDependencies: {
                                self: {
                                    name: "sap.ushell.demo.InboundsApp2"
                                },
                                asyncHints: {
                                    libs: [
                                        {
                                            name : "sap.ui.core"
                                        },
                                        {
                                            name : "sap.ui.unified"
                                        }
                                    ]
                                }
                            },
                            url: "../../../../../test-resources/sap/ushell/demoapps/InboundsApp2"
                        }
                    },
                    {
                        semanticObject: "Action",
                        action: "toApplicationsApp1",
                        title: "This the first applications app",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        resolutionResult: {
                            applicationType: "SAPUI5",
                            additionalInformation: "SAPUI5.Component=sap.ushell.demo.ApplicationsApp1",
                            ui5ComponentName: "sap.ushell.demo.ApplicationsApp1",
                            applicationDependencies: {
                                self: {
                                    name: "sap.ushell.demo.ApplicationsApp1"
                                },
                                asyncHints: {
                                    libs: [
                                        {
                                            name : "sap.ui.core"
                                        },
                                        {
                                            name : "sap.ui.unified"
                                        }
                                    ]
                                }
                            },
                            url: "../../../../../test-resources/sap/ushell/demoapps/ApplicationsApp1"
                        }
                    },
                    {
                        semanticObject: "Action",
                        action: "toApplicationsApp2",
                        title: "This the second applications app",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        resolutionResult: {
                            applicationType: "SAPUI5",
                            additionalInformation: "SAPUI5.Component=sap.ushell.demo.ApplicationsApp2",
                            ui5ComponentName: "sap.ushell.demo.ApplicationsApp2",
                            applicationDependencies: {
                                self: {
                                    name: "sap.ushell.demo.ApplicationsApp2"
                                },
                                asyncHints: {
                                    libs: [
                                        {
                                            name : "sap.ui.core"
                                        },
                                        {
                                            name : "sap.ui.unified"
                                        }
                                    ]
                                }
                            },
                            url: "../../../../../test-resources/sap/ushell/demoapps/ApplicationsApp2"
                        }
                    }
                ]
            },
            {
                testDescription: "the adapter config has overlapping inbounds and applications",
                oAdapterConfig: {
                    config: {
                        inbounds: {
                            "": {
                                semanticObject: "",
                                action: "",
                                title: "",
                                signature: {
                                    parameters: {},
                                    additionalParameters: "allowed"
                                },
                                resolutionResult: {
                                    applicationType: "SAPUI5",
                                        additionalInformation: "SAPUI5.Component=sap.ushell.demo.FioriSandboxDefaultApp",
                                        url: "../../../../../test-resources/sap/ushell/demoapps/FioriSandboxDefaultApp"
                                }
                            },
                            actionToapp1: {
                                semanticObject: "Action",
                                action: "toapp1",
                                title: "First inbounds app",
                                signature: {
                                     parameters: {},
                                     additionalParameters: "allowed"
                                },
                                resolutionResult: {
                                    applicationType: "URL",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.InboundsApp1",
                                    url: "../../../../../test-resources/sap/ushell/demoapps/InboundsApp1"
                                }
                            },
                            actionToInboundsApp2: {
                                semanticObject: "Action",
                                action: "toinboundsapp2",
                                title: "Second inbounds app",
                                signature: {
                                    parameters: {},
                                    additionalParameters: "allowed"
                                },
                                resolutionResult: {
                                    applicationType: "URL",
                                    additionalInformation: "SAPUI5.Component=sap.ushell.demo.InboundsApp2",
                                    url: "../../../../../test-resources/sap/ushell/demoapps/InboundsApp2"
                                }
                            }
                        },
                        applications: {
                            "_comment": "For your applications, better use absolute pathes to the url to test it! (e.g. /ushell/). We use relative pathes to be able to run the application on a central server. Map of applications keyed by URL fragment used for navigation.",
                            "Action-toapp1" : {
                                "_comment": "Applications app 1",
                                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.ApplicationsApp1",
                                "applicationType": "URL",
                                "url": "../../../../../test-resources/sap/ushell/demoapps/ApplicationsApp1",
                                "description": "This the first applications app"
                            },
                            "Action-toApplicationsApp2" : {
                                "_comment": "Applications app 2",
                                "additionalInformation": "SAPUI5.Component=sap.ushell.demo.ApplicationsApp2",
                                "applicationType": "URL",
                                "url": "../../../../../test-resources/sap/ushell/demoapps/ApplicationsApp2",
                                "description": "This the second applications app"
                            }
                        }
                    }
                },
                expectedInbounds: [
                    {
                        semanticObject: "",
                        action: "",
                        title: "",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        resolutionResult: {
                            applicationType: "SAPUI5",
                            additionalInformation: "SAPUI5.Component=sap.ushell.demo.FioriSandboxDefaultApp",
                            ui5ComponentName: "sap.ushell.demo.FioriSandboxDefaultApp",
                            applicationDependencies: {
                                self: {
                                    name: "sap.ushell.demo.FioriSandboxDefaultApp"
                                },
                                asyncHints: {
                                    libs: [
                                        {
                                            name : "sap.ui.core"
                                        },
                                        {
                                            name : "sap.ui.unified"
                                        }
                                    ]
                                }
                            },
                            url: "../../../../../test-resources/sap/ushell/demoapps/FioriSandboxDefaultApp"
                        }
                    },
                    {
                        semanticObject: "Action",
                        action: "toapp1",
                        title: "First inbounds app",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        resolutionResult: {
                            applicationType: "URL",
                            additionalInformation: "SAPUI5.Component=sap.ushell.demo.InboundsApp1",
                            ui5ComponentName: "sap.ushell.demo.InboundsApp1",
                            applicationDependencies: {
                                self: {
                                    name: "sap.ushell.demo.InboundsApp1"
                                },
                                asyncHints: {
                                    libs: [
                                        {
                                            name : "sap.ui.core"
                                        },
                                        {
                                            name : "sap.ui.unified"
                                        }
                                    ]
                                }
                            },
                            url: "../../../../../test-resources/sap/ushell/demoapps/InboundsApp1"
                        }
                    },
                    {
                        semanticObject: "Action",
                        action: "toinboundsapp2",
                        title: "Second inbounds app",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        resolutionResult: {
                            applicationType: "URL",
                            additionalInformation: "SAPUI5.Component=sap.ushell.demo.InboundsApp2",
                            ui5ComponentName: "sap.ushell.demo.InboundsApp2",
                            applicationDependencies: {
                                self: {
                                    name: "sap.ushell.demo.InboundsApp2"
                                },
                                asyncHints: {
                                    libs: [
                                        {
                                            name : "sap.ui.core"
                                        },
                                        {
                                            name : "sap.ui.unified"
                                        }
                                    ]
                                }
                            },
                            url: "../../../../../test-resources/sap/ushell/demoapps/InboundsApp2"
                        }
                    },
                    {
                        semanticObject: "Action",
                        action: "toapp1",
                        title: "This the first applications app",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        resolutionResult: {
                            applicationType: "SAPUI5",
                            additionalInformation: "SAPUI5.Component=sap.ushell.demo.ApplicationsApp1",
                            ui5ComponentName: "sap.ushell.demo.ApplicationsApp1",
                            applicationDependencies: {
                                self: {
                                    name: "sap.ushell.demo.ApplicationsApp1"
                                },
                                asyncHints: {
                                    libs: [
                                        {
                                            name : "sap.ui.core"
                                        },
                                        {
                                            name : "sap.ui.unified"
                                        }
                                    ]
                                }
                            },
                            url: "../../../../../test-resources/sap/ushell/demoapps/ApplicationsApp1"
                        }
                    },
                    {
                        semanticObject: "Action",
                        action: "toApplicationsApp2",
                        title: "This the second applications app",
                        signature: {
                            parameters: {},
                            additionalParameters: "allowed"
                        },
                        resolutionResult: {
                            applicationType: "SAPUI5",
                            additionalInformation: "SAPUI5.Component=sap.ushell.demo.ApplicationsApp2",
                            ui5ComponentName: "sap.ushell.demo.ApplicationsApp2",
                            applicationDependencies: {
                                self: {
                                    name: "sap.ushell.demo.ApplicationsApp2"
                                },
                                asyncHints: {
                                    libs: [
                                        {
                                            name : "sap.ui.core"
                                        },
                                        {
                                            name : "sap.ui.unified"
                                        }
                                    ]
                                }
                            },
                            url: "../../../../../test-resources/sap/ushell/demoapps/ApplicationsApp2"
                        }
                    }
                ]
            }
        ].forEach(function(oFixture) {
            asyncTest("getInbounds returns the correct inbounds when " + oFixture.testDescription, function () {
                var oAdapter,
                    oSystem = {};

                // Arrange
                // Act
                oAdapter = new sap.ushell.adapters.local.ClientSideTargetResolutionAdapter(
                        oSystem,
                        undefined,
                        oFixture.oAdapterConfig
                );
                oAdapter.getInbounds()
                    .fail()
                    .done(function(aInbounds) {
                        // Assert
                        start();
                        deepEqual(aInbounds, oFixture.expectedInbounds, "ok");
                    });

            });
        });

}());
