// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.support.plugins.flpConfig.flpConfigurationPlugin
 */

 /*global QUnit, deepEqual, test start, stop, test, jQuery, sap, sinon */


sap.ui.define([
    "sap/ushell/support/plugins/flpConfig/FlpConfigurationPlugin",
    "sap/ui/core/support/Support",
    "jquery.sap.global",
    "sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit"
],
function (FlpConfigurationPlugin, Support, $) {
    "use strict";

        // Create dependencies and sandbox
        var oSandbox = sinon.sandbox.create();
        var oSupportStub = Support.getStub();

        var oFlpConfigTreeTable = {
            "renderers": [
                {
                    "property": "fiori2",
                    "renderers": [
                        {
                            "property": "componentData",
                            "renderers": [
                                {
                                    "property": "config",
                                    "renderers": [
                                        {
                                            "property": "enablePersonalization",
                                            "value": true
                                        },
                                        {
                                            "property": "enableTagFiltering",
                                            "value": false
                                        },
                                        {
                                            "property": "enableSearch",
                                            "value": true
                                        },
                                        {
                                            "property": "enableTilesOpacity",
                                            "value": false
                                        },
                                        {
                                            "property": "enableSetTheme",
                                            "value": true
                                        },
                                        {
                                            "property": "enableAccessibility",
                                            "value": true
                                        },
                                        {
                                            "property": "enableHelp",
                                            "value": false
                                        },
                                        {
                                            "property": "enableUserDefaultParameters",
                                            "value": true
                                        },
                                        {
                                            "property": "preloadLibrariesForRootIntent",
                                            "value": false
                                        },
                                        {
                                            "property": "enableBackGroundShapes",
                                            "value": true
                                        },
                                        {
                                            "property": "enableNotificationsUI",
                                            "value": false
                                        },
                                        {
                                            "property": "enableRecentActivity",
                                            "value": true
                                        },
                                        {
                                            "property": "applications",
                                            "renderers": [
                                                {
                                                    "property": "Shell-home",
                                                    "renderers": [
                                                        {
                                                            "property": "enableActionModeMenuButton",
                                                            "value": true
                                                        },
                                                        {
                                                            "property": "enableEasyAccess",
                                                            "value": true
                                                        },
                                                        {
                                                            "property": "enableTileActionsIcon",
                                                            "value": false
                                                        },
                                                        {
                                                            "property": "enableHideGroups",
                                                            "value": false
                                                        },
                                                        {
                                                            "property": "enableTilesOpacity",
                                                            "value": false
                                                        },
                                                        {
                                                            "property": "enablePersonalization",
                                                            "value": true
                                                        },
                                                        {
                                                            "property": "enableTagFiltering",
                                                            "value": false
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "property": "rootIntent",
                                            "value": "Shell-home"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        var oFlpConfig = {
            "renderers": {
                "fiori2": {
                    "componentData": {
                        "config": {
                            "enablePersonalization": true,
                            "enableTagFiltering": false,
                            "enableSearch": true,
                            "enableTilesOpacity": false,
                            "enableSetTheme": true,
                            "enableAccessibility": true,
                            "enableHelp": false,
                            "enableUserDefaultParameters": true,
                            "preloadLibrariesForRootIntent": false,
                            "enableBackGroundShapes": true,
                            "enableNotificationsUI": false,
                            "enableRecentActivity": true,
                            "applications": {
                                "Shell-home": {
                                    "enableActionModeMenuButton": true,
                                    "enableEasyAccess": true,
                                    "enableTileActionsIcon": false,
                                    "enableHideGroups": false,
                                    "enableTilesOpacity": false,
                                    "enablePersonalization": true,
                                    "enableTagFiltering": false
                                }
                            },
                            "rootIntent": "Shell-home"
                        }
                    }
                }
            }
        };

        // Instantiate Plugin for each test
        QUnit.module("Given the Support Plugin for the Fiori launchpad configuration", {
            beforeEach: function () {
                this.oFlpConfigurationPlugin = new FlpConfigurationPlugin(oSupportStub);
            },
            afterEach: function () {
                this.oFlpConfigurationPlugin.destroy();
                oSandbox.restore();
            }
        });

        QUnit.test("When I access the plugin...", function (assert) {
            assert.ok(this.oFlpConfigurationPlugin, "Then I can use a valid instance");
            assert.equal(this.oFlpConfigurationPlugin.isToolPlugin(), true, "Then it's a tool plugin");
            assert.equal(this.oFlpConfigurationPlugin.isAppPlugin(), true, "and an app plugin");
        });

        QUnit.test("When I load the plugin...", function (assert) {

            // Prepare asynchronous test
            var that = this;

            // Mock back end check
            this.oFlpConfigurationPlugin.flpConfig = oFlpConfig;

            // Append anchor for support plugin to html page needed for rendering
            $("#test-view").append(this.oFlpConfigurationPlugin.$().get(0));

            // Test rendering UI
            stop();
            sap.ui.getCore().loadLibraries(["sap.ui.table"]).then(function () {
                sap.ui.require(["sap/ui/table/TreeTable", "sap/ui/table/Column", "sap/ui/table/library"], function (TreeTable, Column, tableLibrary) {
                    start();
                    var SelectionMode = tableLibrary.SelectionMode;
                    that.oFlpConfigurationPlugin.getFlpConfigurationPluginUI(that.oFlpConfigurationPlugin, TreeTable, Column, SelectionMode);
                    sap.ui.getCore().applyChanges(); // Trigger synchronous rendering
                    assert.ok(jQuery("#" + that.oFlpConfigurationPlugin.getId()), "Then the anchor for the plugin content gets rendered into the page");
                    assert.ok(jQuery("#sap-ui-support-flpConfigurationPlugin-TabBar"), "Then the tab bar in general gets rendered");
                    assert.strictEqual(jQuery("#renderers-text")[0].textContent.substring(0, 9), "renderers", "Then the tab bar has a tab");
                    assert.ok(jQuery("#sap-ui-support-flpConfigurationPlugin-TreeTablerenderers"), "Then the tree table for config details gets rendered");
                    assert.strictEqual(jQuery("#__text0-__clone0")[0].textContent, "fiori2", "Then the tree table has content");
                });
            });
        });

        QUnit.test("When I want to show data ...", function (assert) {

            this.oFlpConfigurationPlugin.flpConfig = oFlpConfig;

            assert.deepEqual(this.oFlpConfigurationPlugin.getNewConfigJSON(this.oFlpConfigurationPlugin.flpConfig), oFlpConfigTreeTable,
                "Then building the JSON model for data binding on the tree table works correct");
        });

        //"When I want to prepare FLP Config for sending"
        [{
            testDescription: "one undefined value",
            input: {
                oFLPConfig: {
                    "sap-ushell-config-url":undefined
                }
            },
            expectedResult: {
                oFLPConfig: {
                    "sap-ushell-config-url":"undefined"
                }
            }
        },
            {
            testDescription: "one undefined value in a service",
            input: {
                oFLPConfig: {
                    service: {
                        "sap-ushell-config-url":undefined
                    }
                }
            },
            expectedResult: {
                oFLPConfig: {
                    service: {
                        "sap-ushell-config-url":"undefined"
                   }
                }
            }
        },
        {
            testDescription: "one defined value",
            input: {
                oFLPConfig: {
                    "sap-ushell-config-url":"defined"
                }
            },
            expectedResult: {
                oFLPConfig: {
                    "sap-ushell-config-url":"defined"
                }
            }
        },
        {
            testDescription: "one function",
            input: {
                oFLPConfig: {
                    "sap-ushell-config-function":function() {
                    }
                }
            },
            expectedResult: {
                oFLPConfig: {
                }
            }
        },
        {
            testDescription: "an Array",
            input: {
                oFLPConfig: {
                    renderers: [
                        {"url" : "foo"},
                        {"url1" : "foo1"}
                    ]
                }

            },
            expectedResult: {
                oFLPConfig: {
                    renderers: [
                        {"url": "foo"},
                        {"url1": "foo1"}
                    ]
                }

            }
        },
        {
            testDescription: "a null value",
            input: {
                oFLPConfig: {
                    myValue: null
                }
            },
            expectedResult: {
                oFLPConfig: {
                    myValue: null
                }
            }
        },
        {
            testDescription: "realistic config with possible error sources (null etc) [Integration test]",
            input: {
                oFLPConfig: {
                    renderers: {
                        fiori2: {
                            componentData: {
                                enableAccessibility: true,
                                enableBackGroundShapes: null,
                                enableHelp: false,
                                applications: {
                                    "Shell-home": {
                                        enableEasyAccess: [1, 4]
                                    }
                                }
                            }
                        }
                    },
                    services: {
                        AllMyApps: {
                            config: {
                                enabled: true,
                                showCatalogApps: true,
                                showHomePageApps: undefined
                            }
                        }
                    }
                }
            },
            expectedResult: {
                oFLPConfig: {
                    renderers: {
                        fiori2: {
                            componentData: {
                                enableAccessibility: true,
                                enableBackGroundShapes: null,
                                enableHelp: false,
                                applications: {
                                    "Shell-home": {
                                        enableEasyAccess: [1, 4]
                                    }
                                }
                            }
                        }
                    },
                    services: {
                        AllMyApps: {
                            config: {
                                enabled: true,
                                showCatalogApps: true,
                                showHomePageApps: "undefined"
                            }
                        }
                    }
                }
            }
        }
        ].forEach(function (oFixture) {
                    test("When I want to prepare the FLP configuration for sending with " + oFixture.testDescription, function () {
                        var oPreparedConfig = {};
                        this.oFlpConfigurationPlugin.prepareForSending(oFixture.input.oFLPConfig, oPreparedConfig);
                        deepEqual(oPreparedConfig, oFixture.expectedResult.oFLPConfig,
                        " Then the configuration is as expected" );
                    });
            });


        QUnit.test("When I want to search after enable ...", function (assert) {

            // Prepare asynchronous test
            var that = this;

            var oExpectedSearchResult = {
                "renderers": [
                    {
                        "property": "fiori2",
                        "renderers": [
                            {
                                "renderers": [
                                    {
                                        "property": "config",
                                        "renderers": [
                                            {
                                                "property": "enablePersonalization",
                                                "value": true
                                            },
                                            {
                                                "property": "enableTagFiltering",
                                                "value": false
                                            },
                                            {
                                                "property": "enableSearch",
                                                "value": true
                                            },
                                            {
                                                "property": "enableTilesOpacity",
                                                "value": false
                                            },
                                            {
                                                "property": "enableSetTheme",
                                                "value": true
                                            },
                                            {
                                                "property": "enableAccessibility",
                                                "value": true
                                            },
                                            {
                                                "property": "enableHelp",
                                                "value": false
                                            },
                                            {
                                                "property": "enableUserDefaultParameters",
                                                "value": true
                                            },
                                            undefined,
                                            {
                                                "property": "enableBackGroundShapes",
                                                "value": true
                                            },
                                            {
                                                "property": "enableNotificationsUI",
                                                "value": false
                                            },
                                            {
                                                "property": "enableRecentActivity",
                                                "value": true
                                            },
                                            {
                                                "renderers": [
                                                    {
                                                        "property": "Shell-home",
                                                        "renderers": [
                                                            {
                                                                "property": "enableActionModeMenuButton",
                                                                "value": true
                                                            },
                                                            {
                                                                "property": "enableEasyAccess",
                                                                "value": true
                                                            },
                                                            {
                                                                "property": "enableTileActionsIcon",
                                                                "value": false
                                                            },
                                                            {
                                                                "property": "enableHideGroups",
                                                                "value": false
                                                            },
                                                            {
                                                                "property": "enableTilesOpacity",
                                                                "value": false
                                                            },
                                                            {
                                                                "property": "enablePersonalization",
                                                                "value": true
                                                            },
                                                            {
                                                                "property": "enableTagFiltering",
                                                                "value": false
                                                            }
                                                        ]
                                                    }
                                                ],
                                                "property": "applications"
                                            }
                                        ]
                                    }
                                ],
                                "property": "componentData"
                            }
                        ]
                    }
                ]
            };

            // Mock back end check
            this.oFlpConfigurationPlugin.flpConfig = oFlpConfig;

            // Append anchor for support plugin to html page needed for rendering
            $("#test-view").append(this.oFlpConfigurationPlugin.$().get(0));

            // Test rendering UI
            stop();
            sap.ui.getCore().loadLibraries(["sap.ui.table"]).then(function () {
                sap.ui.require(["sap/ui/table/TreeTable", "sap/ui/table/Column", "sap/ui/table/library"], function (TreeTable, Column, tableLibrary) {
                    start();
                    var SelectionMode = tableLibrary.SelectionMode;
                    that.oFlpConfigurationPlugin.getFlpConfigurationPluginUI(that.oFlpConfigurationPlugin, TreeTable, Column, SelectionMode);
                    sap.ui.getCore().applyChanges(); // Trigger synchronous rendering

                    var oMockEventData = { "query": "enable" };
                    oMockEventData.getParameter = function (sQuery) { return oMockEventData[sQuery]; };
                    that.oFlpConfigurationPlugin.onPressSearchNewModel(oMockEventData);
                    assert.deepEqual(sap.ui.getCore().byId("sap-ui-support-flpConfigurationPlugin-TabBar").getModel().getData(), oExpectedSearchResult,
                    "Search works");
                });
            });
        });

    },
    true
);
