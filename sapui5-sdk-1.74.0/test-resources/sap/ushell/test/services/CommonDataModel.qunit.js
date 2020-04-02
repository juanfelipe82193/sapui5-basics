// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.CommonDataModel
 */
sap.ui.require([
    "sap/ushell/services/CommonDataModel",
    "sap/ushell/services/_CommonDataModel/PersonalizationProcessor",
    "sap/ushell/test/utils"
], function (CommonDataModel, PersonalizationProcessor, oTestUtils) {
    "use strict";

    /* global asyncTest, deepEqual, module, notStrictEqual, ok, start, sinon, strictEqual, QUnit */

    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");

    function okFalse (sMessage) {
        ok(false, "unexpected failure: " + sMessage);
    }

    function okFalseAndStart (sMessage) {
        okFalse(sMessage);
        start();
    }

    module("sap.ushell.services.CommonDataModel", {
        setup: function () {
            window["sap-ushell-config"] = { "services": { "CommonDataModel": { "adapter": { "module": "sap.ushell.adapters.cdm.CommonDataModelAdapter" } } } };

            //bootstrap
            stop();
            sap.ushell.bootstrap("local")
                .done(function () {
                    start();
                });
        },
        teardown: function () {
            delete sap.ushell.Container;
            oTestUtils.restoreSpies(
                jQuery.sap.log.warning,
                jQuery.sap.log.error
            );
        }
    });

    QUnit.test("#getPlugins should always return a promise", function (assert) {
        var oCDM = sap.ushell.Container.getService("CommonDataModel");

        sinon.stub(oCDM, "getSite", function () {
            return jQuery.when({
                applications: {
                    plugin_0: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0",
                            crossNavigation: { inbounds: { "Shell-plugin": {} } }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_0_component" },
                        "sap.platform.runtime": {
                            "componentProperties": {
                                url: "http://",
                                "config": { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    },
                    plugin_1: {
                        "sap.app": {
                            id: "plugin:1",
                            title: "Plugin 1",
                            crossNavigation: {
                                inbounds: { "Shell-plugin": {} }
                            }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_1_component" },
                        "sap.platform.runtime": {
                            "componentProperties": {
                                url: "http://",
                                "config": { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    }
                }
            });
        });

        // Always returns a promise
        assert.ok(oCDM.getPlugins().then && oCDM.getPlugins("UserDefaults").then, "Consistently returns a promise whether queried category is found or not");
    });

    QUnit.test("#getPlugins should correctly identify plugins among apps", function (assert) {
        var oCDM = sap.ushell.Container.getService("CommonDataModel");
        var fnIdentificationTestDone = assert.async();

        sinon.stub(oCDM, "getSite", function () {
            return jQuery.when({
                applications: {
                    // inbounds present and type is plugin
                    plugin_0: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0",
                            crossNavigation: { inbounds: { "Shell-plugin": {} } }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_0_component" },
                        "sap.platform.runtime": {
                            "componentProperties": {
                                url: "http://",
                                "config": { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    },
                    plugin_1: {
                        "sap.app": {
                            id: "plugin:1",
                            title: "Plugin 1",
                            crossNavigation: { inbounds: { "Shell-plugin": {} } }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_1_component" },
                        "sap.platform.runtime": {
                            "componentProperties": {
                                url: "http://",
                                "config": { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    },
                    // NO inbounds and type is plugin
                    plugin_2: {
                        "sap.app": {
                            id: "plugin:2",
                            title: "Plugin 2"
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_2_component" },
                        "sap.platform.runtime": {
                            "componentProperties": {
                                url: "http://",
                                "config": { "sap-ushell-plugin-type": "UserDefaults" }
                            }
                        }
                    },
                    plugin_3: {
                        "sap.app": {
                            id: "plugin:3",
                            title: "Plugin 3"
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_3_component" },
                        "sap.platform.runtime": {
                            "componentProperties": {
                                url: "http://",
                                "config": { "sap-ushell-plugin-type": "UnsupportedCategory" }
                            }
                        }
                    },
                    // inbounds present, type is not plugin
                    plugin_4: {
                        "sap.app": {
                            id: "plugin:3",
                            title: "Plugin 3",
                            crossNavigation: { inbounds: { "Shell-plugin": {} } }
                        },
                        "sap.flp": { type: "tile" },
                        "sap.ui5": { componentName: "plugin_4_component" }
                    },
                    // NO inbounds present, type is not plugin
                    plugin_5: {
                        "sap.app": {
                            id: "plugin:5",
                            title: "Plugin 5"
                        },
                        "sap.flp": { type: "tile" },
                        "sap.ui5": { componentName: "plugin_5_component" }
                    },
                    // type is plugin, but no config
                    plugin_6: {
                        "sap.app": {
                            id: "plugin:6",
                            title: "Plugin 6"
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_6_component" },
                        "sap.platform.runtime": { "componentProperties": { url: "http://" } }
                    },
                    // inbound has non-overlapping parameters
                    plugin_7: {
                        "sap.app": {
                            id: "plugin:7",
                            title: "Plugin 7",
                            crossNavigation: {
                                inbounds: {
                                    "Shell-plugin": {
                                        signature: {
                                            parameters: {
                                                param1: { // not in sap.platform.runtime
                                                    defaultValue: { value: "value1" }
                                                },
                                                param2: { // not in sap.platform.runtime
                                                    defaultValue: {
                                                        type: "plain",
                                                        value: "value2"
                                                    }
                                                },
                                                param3: {
                                                    required: true,
                                                    filter: { // filter is ignored
                                                        type: "plain",
                                                        value: "value3"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_7_component" },
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    },
                    // inbound has overlapping parameters
                    plugin_8: {
                        "sap.app": {
                            id: "plugin:8",
                            title: "Plugin 8",
                            crossNavigation: {
                                inbounds: {
                                    "Shell-plugin": {
                                        signature: {
                                            parameters: {
                                                param1: { // also in sap.platform.runtime
                                                    defaultValue: { value: "valueFromInbound" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_8_component" },
                        "sap.platform.runtime": {
                            componentProperties: {
                                url: "http://",
                                config: { "param1": "valueFromConfig" }
                            }
                        }
                    }
                }
            });
        });

        // Test plugin identification among set of apps.
        oCDM.getPlugins(null)
            .then(function (oPlugins) {
                assert.deepEqual(oPlugins, {
                    plugin_0: {
                        url: "http://",
                        config: { "sap-ushell-plugin-type": "RendererExtensions" },
                        component: "plugin_0_component"
                    },
                    plugin_1: {
                        url: "http://",
                        config: { "sap-ushell-plugin-type": "RendererExtensions" },
                        component: "plugin_1_component"
                    },
                    plugin_2: {
                        url: "http://",
                        config: { "sap-ushell-plugin-type": "UserDefaults" },
                        component: "plugin_2_component"
                    },
                    plugin_3: {
                        url: "http://",
                        config: { "sap-ushell-plugin-type": "UnsupportedCategory" },
                        component: "plugin_3_component"
                    },
                    plugin_6: {
                        url: "http://",
                        component: "plugin_6_component",
                        config: {}
                    },
                    plugin_7: {
                        url: "http://",
                        component: "plugin_7_component",
                        config: {
                            // merged: signature parameters + componentProperties
                            "param1": "value1",
                            "param2": "value2",
                            "sap-ushell-plugin-type": "RendererExtensions"
                        }
                    },
                    plugin_8: {
                        url: "http://",
                        component: "plugin_8_component",
                        config: { "param1": "valueFromInbound" } // value from signature takes precedence
                    }
                }, "Correctly identifies plugins in site and returns them");
            }, function (vError) {
                return vError;
            })
            .then(fnIdentificationTestDone, fnIdentificationTestDone);

        oCDM.getSite.restore();
    });

    QUnit.test("#getPlugins should not error when no inbounds are defined", function (assert) {
        var oCDM = sap.ushell.Container.getService("CommonDataModel");
        var fnIdentificationTestDone = assert.async();

        sinon.stub(oCDM, "getSite", function () {
            return jQuery.when({
                applications: {
                    plugin: {
                        "sap.app": {
                            id: "plugin",
                            title: "Plugin",
                            crossNavigation: { inbounds: {} } // no inbounds
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_0_component" },
                        "sap.platform.runtime": {
                            "componentProperties": {
                                url: "http://",
                                "config": { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    }
                }
            });
        });

        sinon.stub(jQuery.sap.log, "error");

        // Test plugin identification among set of apps.
        oCDM.getPlugins(null)
            .then(function (/*oPlugins*/) {
                assert.ok(true, "getPlugins promise was resolved");
                assert.strictEqual(jQuery.sap.log.error.callCount, 0,
                    "jQuery.sap.log.error was called 0 times");

            }, function (vError) {
                assert.ok(false, "getPlugins promise was resolved. ERROR: " + vError);
            })
            .then(fnIdentificationTestDone, fnIdentificationTestDone);

        oCDM.getSite.restore();
    });

    QUnit.test("#getPlugins should error if no Shell-plugin inbound is defined", function (assert) {
        var oCDM = sap.ushell.Container.getService("CommonDataModel");
        var fnIdentificationTestDone = assert.async();

        sinon.stub(oCDM, "getSite", function () {
            return jQuery.when({
                applications: {
                    plugin: {
                        "sap.app": {
                            id: "plugin",
                            title: "Plugin",
                            crossNavigation: {
                                inbounds: { "InboundId": {} } // note: not Shell-plugin
                            }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_0_component" },
                        "sap.platform.runtime": {
                            "componentProperties": {
                                url: "http://",
                                "config": { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    }
                }
            });
        });

        sinon.stub(jQuery.sap.log, "error");

        // Test plugin identification among set of apps.
        oCDM.getPlugins(null)
            .then(function (/*oPlugins*/) {
                assert.ok(true, "getPlugins promise was resolved");
                assert.strictEqual(jQuery.sap.log.error.callCount, 1,
                    "jQuery.sap.log.error was called once");

                assert.deepEqual(jQuery.sap.log.error.getCall(0).args, [
                    "Cannot find inbound with id 'Shell-plugin' for plugin 'plugin'",
                    "plugin startup configuration cannot be determined correctly",
                    "sap.ushell.services.CommonDataModel"
                ], "jQuery.sap.log.error was called with the expected arguments");
            }, function (vError) {
                assert.ok(false, "getPlugins promise was resolved. ERROR: " + vError);
            })
            .then(fnIdentificationTestDone, fnIdentificationTestDone);

        oCDM.getSite.restore();
    });

    QUnit.test("#getPlugins should warn if multiple inbounds are defined for a plugin", function (assert) {
        var oCDM = sap.ushell.Container.getService("CommonDataModel");
        var fnIdentificationTestDone = assert.async();

        sinon.stub(oCDM, "getSite", function () {
            return jQuery.when({
                applications: {
                    plugin: {
                        "sap.app": {
                            id: "plugin",
                            title: "Plugin",
                            crossNavigation: {
                                inbounds: {
                                    "Shell-plugin": {},
                                    "AnotherInbound1": {},
                                    "AnotherInbound2": {}
                                }
                            }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_0_component" },
                        "sap.platform.runtime": {
                            "componentProperties": {
                                url: "http://",
                                "config": { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    }
                }
            });
        });

        sinon.stub(jQuery.sap.log, "warning");

        // Test plugin identification among set of apps.
        oCDM.getPlugins(null)
            .then(function (/*oPlugins*/) {
                assert.ok(true, "getPlugins promise was resolved");
                assert.strictEqual(jQuery.sap.log.warning.callCount, 1,
                    "jQuery.sap.log.warning was called once");

                assert.deepEqual(jQuery.sap.log.warning.getCall(0).args, [
                    "Multiple inbounds are defined for plugin 'plugin'",
                    "plugin startup configuration will be determined using the signature of 'Shell-plugin' inbound.",
                    "sap.ushell.services.CommonDataModel"
                ], "jQuery.sap.log.warning was called with the expected arguments");
            }, function (vError) {
                assert.ok(false, "getPlugins promise was resolved. ERROR: " + vError);
            })
            .then(fnIdentificationTestDone, fnIdentificationTestDone);

        oCDM.getSite.restore();
    });

    QUnit.test("#getPlugins should have a consistent cache", function (assert) {
        var oCDM = sap.ushell.Container.getService("CommonDataModel");
        var fnReturnedOutputCharacteristicTestDone = assert.async();

        sinon.stub(oCDM, "getSite", function () {
            return jQuery.when({
                applications: {
                    // inbounds present and type is plugin
                    plugin_0: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0",
                            crossNavigation: {
                                inbounds: { "Shell-plugin": {} }
                            }
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_0_component" },
                        "sap.platform.runtime": {
                            "componentProperties": {
                                url: "http://",
                                "config": { "sap-ushell-plugin-type": "RendererExtensions" }
                            }
                        }
                    },
                    // NO inbounds and type is plugin
                    plugin_3: {
                        "sap.app": {
                            id: "plugin:3",
                            title: "Plugin 3"
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_3_component" },
                        "sap.platform.runtime": {
                            "componentProperties": {
                                "config": { "sap-ushell-plugin-type": "UnsupportedCategory" }
                            }
                        }
                    },
                    // NO inbounds present, type is not plugin
                    plugin_5: {
                        "sap.app": {
                            id: "plugin:5",
                            title: "Plugin 5"
                        },
                        "sap.flp": { type: "tile" },
                        "sap.ui5": { componentName: "plugin_5_component" }
                    },
                    // type is plugin but no category specified
                    plugin_6: {
                        "sap.app": {
                            id: "plugin:6",
                            title: "Plugin 6"
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_6_component" },
                        "sap.platform.runtime": { "componentProperties": {} }
                    }
                }
            });
        });

        // Test cache consistency.
        jQuery.when(oCDM.getPlugins(), oCDM.getPlugins())
            .then(function (oFirstPluginSet, oSecondPluginSet) {
                assert.throws(function () {
                    oFirstPluginSet["bad property"] = {};
                }, TypeError, "Memoized output is secured from external corruption");

                assert.strictEqual(oFirstPluginSet, oSecondPluginSet, "Subsequent calls return the same references");
            })
            .then(fnReturnedOutputCharacteristicTestDone, fnReturnedOutputCharacteristicTestDone);

        oCDM.getSite.restore();
    });

    QUnit.test("#getPlugins should be robust if sap.platform.runtime section is missing", function (assert) {
        var oCDM = sap.ushell.Container.getService("CommonDataModel");
        var fnDone = assert.async();

        sinon.stub(oCDM, "getSite", function () {
            return jQuery.when({
                applications: {
                    // type is plugin and "sap.platform.runtime" section missing
                    plugin_0: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0"
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_0_component" }
                    },
                    // type is plugin and "sap.platform.runtime" section is null
                    plugin_1: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0"
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_0_component" },
                        "sap.platform.runtime": null
                    },
                    // type is plugin and "sap.platform.runtime" section is a number
                    plugin_2: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0"
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_0_component" },
                        "sap.platform.runtime": 42
                    },
                    // type is plugin and "sap.platform.runtime"/componentProperties section missing
                    plugin_3: {
                        "sap.app": {
                            id: "plugin:3",
                            title: "Plugin 3"
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_3_component" },
                        "sap.platform.runtime": {
                        }
                    },
                    // type is plugin and "sap.platform.runtime"/componentProperties section is null
                    plugin_4: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0"
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_0_component" },
                        "sap.platform.runtime": { componentProperties: null }
                    },
                    // type is plugin and "sap.platform.runtime"/componentProperties section is a function
                    plugin_5: {
                        "sap.app": {
                            id: "plugin:0",
                            title: "Plugin 0"
                        },
                        "sap.flp": { type: "plugin" },
                        "sap.ui5": { componentName: "plugin_0_component" },
                        "sap.platform.runtime": { componentProperties: function () { } }
                    }
                }
            });
        });

        sinon.stub(jQuery.sap.log, "error");

        oCDM.getPlugins(null)
            .then(function (/*oPlugins*/) {
                assert.ok(true, "getPlugins promise was resolved");
                assert.strictEqual(jQuery.sap.log.error.callCount, 6,
                    "jQuery.sap.log.error was called twice");

                assert.deepEqual(jQuery.sap.log.error.getCall(0).args, [
                    "Cannot find 'sap.platform.runtime' section for plugin 'plugin_0'",
                    "plugin might not be started correctly",
                    "sap.ushell.services.CommonDataModel"
                ], "jQuery.sap.log.error was called with the expected arguments");
                assert.deepEqual(jQuery.sap.log.error.getCall(1).args, [
                    "Cannot find 'sap.platform.runtime' section for plugin 'plugin_1'",
                    "plugin might not be started correctly",
                    "sap.ushell.services.CommonDataModel"
                ], "jQuery.sap.log.error was called with the expected arguments");
                assert.deepEqual(jQuery.sap.log.error.getCall(2).args, [
                    "Cannot find 'sap.platform.runtime' section for plugin 'plugin_2'",
                    "plugin might not be started correctly",
                    "sap.ushell.services.CommonDataModel"
                ], "jQuery.sap.log.error was called with the expected arguments");
                assert.deepEqual(jQuery.sap.log.error.getCall(3).args, [
                    "Cannot find 'sap.platform.runtime/componentProperties' section for plugin 'plugin_3'",
                    "plugin might not be started correctly",
                    "sap.ushell.services.CommonDataModel"
                ], "jQuery.sap.log.error was called with the expected arguments");
                assert.deepEqual(jQuery.sap.log.error.getCall(4).args, [
                    "Cannot find 'sap.platform.runtime/componentProperties' section for plugin 'plugin_4'",
                    "plugin might not be started correctly",
                    "sap.ushell.services.CommonDataModel"
                ], "jQuery.sap.log.error was called with the expected arguments");
                assert.deepEqual(jQuery.sap.log.error.getCall(5).args, [
                    "Cannot find 'sap.platform.runtime/componentProperties' section for plugin 'plugin_5'",
                    "plugin might not be started correctly",
                    "sap.ushell.services.CommonDataModel"
                ], "jQuery.sap.log.error was called with the expected arguments");
            }, function (vError) {
                assert.ok(false, "expected that getPlugins promise was resolved. ERROR: " + vError);
            })
            .then(fnDone, fnDone);

        oCDM.getSite.restore();
    });

    asyncTest("constructor", function () {
        // arrange #1
        var oCommonDataModelService,
            oMockAdapter = {
                _getSiteDeferred: new jQuery.Deferred(),
                getSite: sinon.spy(function () {
                    return this._getSiteDeferred.promise();
                }),
                _getPersonalizationDeferred: new jQuery.Deferred(),
                getPersonalization: sinon.spy(function () {
                    return this._getPersonalizationDeferred.promise();
                })
            },
            oMockPersonalizationProcessor = {
                _mixinPersonalizationDeferred: new jQuery.Deferred(),
                mixinPersonalization: sinon.spy(function () {
                    return this._mixinPersonalizationDeferred.promise();
                })
            },
            oOriginalSite = {
                _version: "3.0.0",
                originalProperty: "foo"
            },
            oPers = { personalizedProperty: "bar" },
            oPersonalizedSite = {
                _version: "3.0.0",
                originalProperty: "foo",
                personalizedProperty: "bar"
            };

        // act #1
        oCommonDataModelService = new CommonDataModel(oMockAdapter);

        // assert #1
        strictEqual(oCommonDataModelService._oAdapter, oMockAdapter, "property oAdapter");
        ok(oCommonDataModelService._oPersonalizationProcessor instanceof PersonalizationProcessor,
            "property oPersonalizationProcessor");
        strictEqual(oMockAdapter.getSite.callCount, 1, "getSite called");
        // arrange #2
        // overwrite oPersonalizationProcessor before it is used (note: require is called within constructor)
        oCommonDataModelService._oPersonalizationProcessor = oMockPersonalizationProcessor;

        // act #2
        oMockAdapter._getSiteDeferred.resolve(oOriginalSite);
        oMockAdapter._getPersonalizationDeferred.resolve(oPers);
        oMockPersonalizationProcessor._mixinPersonalizationDeferred.resolve(oPersonalizedSite);

        //assert #2
        strictEqual(oMockAdapter.getPersonalization.callCount, 1, "getPersonalization called");
        strictEqual(oMockPersonalizationProcessor.mixinPersonalization.callCount, 1, "mixinPersonalization called");

        deepEqual(oCommonDataModelService._oOriginalSite, oOriginalSite, "original site");
        notStrictEqual(oCommonDataModelService._oOriginalSite, oOriginalSite, "oOriginalCdmSite is a copy");
        deepEqual(oCommonDataModelService._oPersonalizedSite, oPersonalizedSite, "_oPersonalizedSite");

        // Check that standard vizTypes have been added. One manifest property is checked to verify the loading was successful.
        strictEqual(oCommonDataModelService._oPersonalizedSite.vizTypes["sap.ushell.StaticAppLauncher"]["sap.app"].type,
            "component", "Static tile visualization type added");
        strictEqual(oCommonDataModelService._oPersonalizedSite.vizTypes["sap.ushell.DynamicAppLauncher"]["sap.app"].type,
            "component", "Dynamic tile visualization type added");
        strictEqual(oCommonDataModelService._oPersonalizedSite.vizTypes["sap.ushell.Card"]["sap.app"].type,
            "card", "Card visualization type added");

        oCommonDataModelService._oSitePromise
            .fail(function () {
                ok(false, "unexpected reject of _oSitePromise");
                start();
            })
            .done(function (oResolvedPersonalizedSite) {
                deepEqual(oResolvedPersonalizedSite, oPersonalizedSite, "done handler: personalized site");
                start();
            });
    });

    [
        0, 1, 2 // failing promise
    ].forEach(function (iFailingDeferred) {
        asyncTest("constructor: error case promise " + iFailingDeferred + " failed", function () {
            // arrange #1
            var oCommonDataModelService,
                oMockAdapter = {
                    _getSiteDeferred: new jQuery.Deferred(),
                    getSite: sinon.spy(function () {
                        return this._getSiteDeferred.promise();
                    }),
                    _getPersonalizationDeferred: new jQuery.Deferred(),
                    getPersonalization: sinon.spy(function () {
                        return this._getPersonalizationDeferred.promise();
                    })
                },
                oMockPersonalizationProcessor = {
                    _mixinPersonalizationDeferred: new jQuery.Deferred(),
                    mixinPersonalization: sinon.spy(function () {
                        return this._mixinPersonalizationDeferred.promise();
                    })
                },
                oOriginalSite = { originalProperty: "foo" },
                oPers = { personalizedProperty: "bar" };

            // act #1
            oCommonDataModelService = new CommonDataModel(oMockAdapter);

            // overwrite oPersonalizationProcessor before it is used (note: require is called within constructor)
            oCommonDataModelService._oPersonalizationProcessor = oMockPersonalizationProcessor;

            if (iFailingDeferred === 0) {
                oMockAdapter._getSiteDeferred.reject("intentionally failed");
            }
            if (iFailingDeferred === 1) {
                oMockAdapter._getSiteDeferred.resolve(oOriginalSite);
                oMockAdapter._getPersonalizationDeferred.reject("intentionally failed");
            }
            if (iFailingDeferred === 2) {
                oMockAdapter._getSiteDeferred.resolve(oOriginalSite);
                oMockAdapter._getPersonalizationDeferred.resolve(oPers);
                oMockPersonalizationProcessor._mixinPersonalizationDeferred.reject("intentionally failed");
            }

            //assert #2
            oCommonDataModelService._oSitePromise
                .done(function () {
                    ok(false, "unexpected resolve of _oSitePromise");
                    start();
                })
                .fail(function (sMessage) {
                    strictEqual(sMessage, "intentionally failed", "error message");
                    start();
                });
        });
    });

    asyncTest("getSite", function () {
        // arrange
        var oCommonDataModelService,
            oSitePromiseMock = new jQuery.Deferred(),
            oMockAdapter = {
                getSite: sinon.spy(function () {
                    // dead end function. promise is never resolved.
                    // just needed so the constructor does not fail
                    return (new jQuery.Deferred()).promise();
                })
                // getPersonalization not needed
            },
            oPersonalizedSite = {
                originalProperty: "foo",
                personalizedProperty: "bar"
            };

        oCommonDataModelService = new CommonDataModel(oMockAdapter);
        // overwrite _oSitePromise as it is used by getSite
        oCommonDataModelService._oSitePromise = oSitePromiseMock.promise();

        // act - success case
        oSitePromiseMock.resolve(oPersonalizedSite);
        oCommonDataModelService.getSite()
            .fail(function () {
                ok(false, "unexpected reject of _oSitePromise");
                start();
            })
            .done(function (oResolvedPersonalizedSite) {
                deepEqual(oResolvedPersonalizedSite, oPersonalizedSite, "done handler: personalized site");
                start();
            });

        // failure case
        oSitePromiseMock = new jQuery.Deferred();
        oCommonDataModelService._oSitePromise = oSitePromiseMock.promise();

        // act - success case
        stop();
        oSitePromiseMock.reject("intentionally failed");
        oCommonDataModelService.getSite()
            .done(function () {
                ok(false, "unexpected resolve of _oSitePromise");
                start();
            })
            .fail(function (sMessage) {
                strictEqual(sMessage, "intentionally failed", "error message");
                start();
            });
    });

    QUnit.module("getPage", {
        beforeEach: function () {
            this.fnMockAdapter = function (oPagePromise) {
                return {
                    _getPage: sinon.spy(function () {
                        return oPagePromise;
                    }),
                    getSite: sinon.spy(function () {
                        return (new jQuery.Deferred()).promise();
                    })
                };
            };
            this.fnInstantiateCdmService = function (oPagesPromise) {
                this.oMockAdapter = this.fnMockAdapter(oPagesPromise);
                this.oCommonDataModelService = new CommonDataModel(this.oMockAdapter);

                this.oEnsureCompleteSiteStub = sinon.stub(this.oCommonDataModelService, "_ensureCompleteSite");
                this.oEnsureGroupsOrderStub = sinon.stub(this.oCommonDataModelService, "_ensureGroupsOrder");
                this.oEnsureStandardVizTypesPresent = sinon.stub(this.oCommonDataModelService, "_ensureStandardVizTypesPresent");
            };
        },
        afterEach: function () {
            this.oEnsureCompleteSiteStub.restore();
            this.oEnsureGroupsOrderStub.restore();
            this.oEnsureStandardVizTypesPresent.restore();
        }
    });

    QUnit.test("all Promises get resolved", function (assert) {
        //Arrange
        this.fnInstantiateCdmService(Promise.resolve({test: 123}));

        //Act
        return this.oCommonDataModelService._getPage("ZTEST")
            .then(function () {
                assert.ok(this.oMockAdapter._getPage.calledOnce, "_getPage was called once");
                assert.ok(this.oEnsureCompleteSiteStub.calledOnce, "_ensureCompleteSite was called once");
                assert.ok(this.oEnsureGroupsOrderStub.calledOnce, "_ensureGroupsOrder was called once");
                assert.ok(this.oEnsureStandardVizTypesPresent.calledOnce, "_ensureStandardVizTypesPresent was called once");
            }.bind(this));
    });

    QUnit.test("getPage fails", function (assert) {
        //Arrange
        this.fnInstantiateCdmService(Promise.reject("intentionally failed"));

        //Act
        return this.oCommonDataModelService._getPage("ZTEST")
            .catch(function (sMessage) {
                assert.strictEqual(sMessage, "intentionally failed", "error message");
            });
    });

    module("sap.ushell.services.CommonDataModel", {
        setup: function () {
            window["sap-ushell-config"] = { "services": { "CommonDataModel": { "adapter": { "module": "sap.ushell.adapters.cdm.CommonDataModelAdapter" } } } };

            //bootstrap
            stop();
            sap.ushell.bootstrap("local")
                .done(function () {
                    start();
                });
        },
        teardown: function () {
            delete sap.ushell.Container;
            oTestUtils.restoreSpies(
                jQuery.sap.log.warning,
                jQuery.sap.log.error
            );
        }
    });

    asyncTest("save: undefined extracted personalization data ", function () {
        var oCommonDataModelService,
            oStorePersonalizationDataStub;

        oCommonDataModelService = sap.ushell.Container.getService("CommonDataModel");
        oStorePersonalizationDataStub = sinon.stub(oCommonDataModelService._oAdapter, "setPersonalization", function () {
            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve();
            return oDeferred.promise();
        });
        sinon.stub(oCommonDataModelService._oPersonalizationProcessor, "extractPersonalization", function () {
            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve(undefined);
            return oDeferred.promise();
        });

        oCommonDataModelService.save()
            .done(function () {
                start();
                ok(!oStorePersonalizationDataStub.called, "Adapter wasn't called.");
                ok(oCommonDataModelService._oPersonalizationProcessor.extractPersonalization.called, "extractPersonalization called as expected.");
                oStorePersonalizationDataStub.restore();
                oCommonDataModelService._oPersonalizationProcessor.extractPersonalization.restore();
            })
            .fail(function () {
                start();
                ok(false);
                oStorePersonalizationDataStub.restore();
                oCommonDataModelService._oPersonalizationProcessor.extractPersonalization.restore();
            });
    });

    asyncTest("save: present extracted personalization data", function () {
        var oCommonDataModelService,
            oStorePersonalizationDataStub;

        oCommonDataModelService = sap.ushell.Container.getService("CommonDataModel");
        oStorePersonalizationDataStub = sinon.stub(oCommonDataModelService._oAdapter, "setPersonalization", function () {
            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve();
            return oDeferred.promise();
        });
        sinon.stub(oCommonDataModelService._oPersonalizationProcessor, "extractPersonalization", function () {
            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve({
                "foo": "bar"
            });
            return oDeferred.promise();
        });

        oCommonDataModelService.save()
            .done(function () {
                start();
                ok(oStorePersonalizationDataStub.calledWith({
                    "foo": "bar"
                }), "setPersonalization was called with correct personalization delta.");
                ok(oCommonDataModelService._oPersonalizationProcessor.extractPersonalization.called, "extractPersonalization called as expected.");
                oStorePersonalizationDataStub.restore();
                oCommonDataModelService._oPersonalizationProcessor.extractPersonalization.restore();
            })
            .fail(function () {
                start();
                ok(false);
                oStorePersonalizationDataStub.restore();
                oCommonDataModelService._oPersonalizationProcessor.extractPersonalization.restore();
            });
    });

    asyncTest("save: setPersonalization rejects", function () {
        var oCommonDataModelService,
            oStorePersonalizationDataStub;

        oCommonDataModelService = sap.ushell.Container.getService("CommonDataModel");
        oStorePersonalizationDataStub = sinon.stub(oCommonDataModelService._oAdapter, "setPersonalization", function () {
            var oDeferred = new jQuery.Deferred();
            oDeferred.reject("Promise rejected due to any reason.");
            return oDeferred.promise();
        });
        sinon.stub(oCommonDataModelService._oPersonalizationProcessor, "extractPersonalization", function () {
            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve({
                "foo": "bar"
            });
            return oDeferred.promise();
        });

        oCommonDataModelService.save()
            .done(function () {
                start();
                ok(false);
                oStorePersonalizationDataStub.restore();
                oCommonDataModelService._oPersonalizationProcessor.extractPersonalization.restore();
            })
            .fail(function (sMessage) {
                start();
                ok(oStorePersonalizationDataStub.called, "setPersonalization called as expected.");
                ok(oCommonDataModelService._oPersonalizationProcessor.extractPersonalization.called, "extractPersonalization called as expected.");
                strictEqual(sMessage, "Promise rejected due to any reason.", "fail message is correct.");
                oStorePersonalizationDataStub.restore();
                oCommonDataModelService._oPersonalizationProcessor.extractPersonalization.restore();
            });
    });

    [{
        testDescription: "fails because of undefined group id",
        input: { sGroupId: undefined },
        output: {
            oOriginalGroup: { identification: { id: "bar" } },
            sErrorMessage: "Group does not exist in original site."
        }
    }, {
        testDescription: "fails because of wrong group id (object instead of string)",
        input: { sGroupId: {} },
        output: { sErrorMessage: "Group does not exist in original site." }
    }, {
        testDescription: "fails because of undefined group id (number instead of string)",
        input: { sGroupId: 3 },
        output: { sErrorMessage: "Group does not exist in original site." }
    }, {
        testDescription: "fails because group was not found in original site",
        input: { sGroupId: "myGroupId" },
        output: { sErrorMessage: "Group does not exist in original site." }
    }].forEach(function (oFixture) {
        asyncTest("getGroupFromOriginalSite, failure: " + oFixture.testDescription, function () {
            // Arrange
            var oOriginalGroup = oFixture.output.oOriginalGroup,
                oMockAdapter = {
                    getSite: function () {
                        return new jQuery.Deferred().resolve({
                            groups: { foo: oOriginalGroup }
                        }).promise();
                    },
                    getPersonalization: function () {
                        return new jQuery.Deferred().resolve({}).promise();
                    }
                },
                oCommonDataModelService = new CommonDataModel(oMockAdapter);

            // Act
            oCommonDataModelService.getGroupFromOriginalSite(oFixture.input.sGroupId)
                .done(okFalseAndStart)
                .fail(function (sErrorMessage) {
                    start();
                    // Assert
                    strictEqual(sErrorMessage, oFixture.output.sErrorMessage, "error message returned");
                });
        });
    });

    asyncTest("getGroupFromOriginalSite, success: returns copies", function () {
        // Arrange
        var oOriginalGroup = { identification: { id: "bar" } },
            oMockAdapter = {
                getSite: function () {
                    return new jQuery.Deferred().resolve({
                        groups: {
                            // We have to clone the because the original site is cloned in the CDM Service
                            // and the old reference is then reused
                            foo: jQuery.extend(true, {}, oOriginalGroup)
                        }
                    }).promise();
                },
                getPersonalization: function () {
                    return new jQuery.Deferred().resolve({}).promise();
                }
            },
            oCommonDataModelService = new CommonDataModel(oMockAdapter);

        oCommonDataModelService.getGroupFromOriginalSite("foo")
            .fail(okFalseAndStart)
            .done(function (oResetGroup1) {
                // call getGroupFromOriginalSite again to verify, that copies are returned
                oCommonDataModelService.getGroupFromOriginalSite("foo")
                    .fail(okFalseAndStart)
                    .done(function (oResetGroup2) {
                        start();
                        // Note: CommonDataModel extends the site received from the adapter
                        deepEqual(oResetGroup1, oOriginalGroup, "original group returned");
                        notStrictEqual(oResetGroup1, oResetGroup2, "copies are returned");
                    });
            });
    });

    (function () {
        function determineResolveOrder (aConfiguredOrder, iNumItems) {
            if (!aConfiguredOrder) {
                return new Array(iNumItems).join(",").split(",").map(function (o, iIdx) {
                    return iIdx;
                });
            }

            return aConfiguredOrder.map(function (iOrder, iIdx) {
                return { order: iOrder, finalizerIdx: iIdx };
            }).sort(function (oA, oB) {
                if (oA.order < oB.order) { return -1; }
                if (oA.order > oB.order) { return 1; }
                return 0;
            }).map(function (o) {
                return o.finalizerIdx;
            });
        }

        function createFakeContentProviders (oContentProvidersConfig) {
            if (Object.keys(oContentProvidersConfig.create).length !== 1) {
                throw new Error("Only one method must be used to create a provider");
            }

            var aProviderGetSiteImplementations;
            if (oContentProvidersConfig.create.fromGetSiteImplementations) {
                aProviderGetSiteImplementations = oContentProvidersConfig.create.fromGetSiteImplementations;
            } else if (oContentProvidersConfig.create.fromRawReturnValues) {
                aProviderGetSiteImplementations = oContentProvidersConfig.create.fromRawReturnValues.map(function (vRawReturnValue) {
                    return function () { return vRawReturnValue; };
                });
            } else if (oContentProvidersConfig.create.fromSiteOrErrors) {
                /*
                 * We want to control the order in which promises are finalized based on the configured finalizeGetSitePromiseOrder if any.
                 * So we collect bound promise callbacks in this array which we process after the last promise is added to it.
                 */
                var aGetSiteFinalizers = [];

                var aResolveOrder = determineResolveOrder(
                    oContentProvidersConfig.finalizeGetSitePromiseOrder,
                    oContentProvidersConfig.create.fromSiteOrErrors.length
                );

                aProviderGetSiteImplementations = oContentProvidersConfig.create.fromSiteOrErrors.map(function (vSiteOrError) {
                    return function () {
                        return new Promise(function (fnResolve, fnReject) {
                            var fnFinalizer;
                            if (typeof vSiteOrError === "string") {
                                fnFinalizer = fnReject.bind(null, vSiteOrError);
                            } else {
                                fnFinalizer = fnResolve.bind(null, vSiteOrError);
                            }

                            // add to finalizers
                            aGetSiteFinalizers.push(fnFinalizer);

                            // attempt to resolve items asynchronously if possible
                            while (aResolveOrder.length > 0 && aResolveOrder[0] < aGetSiteFinalizers.length) {
                                setTimeout(aGetSiteFinalizers[aResolveOrder[0]], 0);
                                aResolveOrder.shift();
                            }
                        });
                    };
                });
            } else {
                throw new Error("Please specify known creation method");
            }

            var bFixedProviderIds = oContentProvidersConfig.ids === "auto";
            if (!bFixedProviderIds && Object.prototype.toString.apply(oContentProvidersConfig.ids) !== "[object Array]") {
                throw new Error("expected array or 'auto' for ids option. Got " + JSON.stringify(oContentProvidersConfig, null, 3));
            }

            var aContentProviderIds;
            if (bFixedProviderIds) {
                var iTotalContentProviders = aProviderGetSiteImplementations.length;
                aContentProviderIds = Array(iTotalContentProviders).join().split(",").map(function (aIds, iIdx) {
                    return "Provider" + (iIdx + 1);
                });
            } else {
                aContentProviderIds = oContentProvidersConfig.ids;
            }

            return aProviderGetSiteImplementations.map(function (fnGetSiteImplementation, iIdx) {
                return {
                    providerId: aContentProviderIds[iIdx],
                    provider: {
                        getSite: fnGetSiteImplementation
                    }
                };
            });
        }

        function createFakePluginManager (oCommonDataModelService, aContentProvidersDesc) {
            return {
                loadPlugins: function () {
                    aContentProvidersDesc.forEach(function (oContentProviderDesc) {
                        oCommonDataModelService.registerContentProvider(
                            oContentProviderDesc.providerId,
                            oContentProviderDesc.provider
                        );
                    });

                    return new jQuery.Deferred().resolve().promise();
                }
            };
        }

        function createCommonDataModelService (bAssumeSiteIsValid) {
            var oMockAdapter;

            oMockAdapter = {
                getSite: sinon.stub().returns(new jQuery.Deferred().resolve({}).promise()),
                getPersonalization: function () {
                    return new jQuery.Deferred().resolve({}).promise();
                }
            };

            var oCommonDataModelService = new CommonDataModel(oMockAdapter);

            if (bAssumeSiteIsValid) {
                sinon.stub(oCommonDataModelService, "_getUnreferencedCatalogApplications")
                    .returns({});
            }

            return oCommonDataModelService;
        }

        /**
         * Performs 'arrange' operations common for multiple tests
         *
         * @param {object} oCommonDataModelService An object representing the CommonDataModel service
         * @param {object} oContentProvidersConfig Instructions on how to create multiple content providers. This is an object like:
         *   <pre>
         *   {
         *     ids: "auto" // or array of ids to use,
         *     finalizeGetSitePromiseOrder: [4, 1], // (optional) if provided causes the content providers to resolve/reject with the
         *                                          // extension site in the given order. In the example here, the first site
         *                                          // resolves (or rejects) after the second site (because 4 > 1).
         *                                          // This option is only effective when providers are created via // using 'fromSiteOrErrors'.
         *     create: {
         *       fromSiteOrErrors: [ // one provider per array item is created
         *         { ... },          // not a string: getSite promise resolves to this value
         *         "error"           // string: getSite promise rejects with this value
         *       ],
         *       fromRawReturnValues: [  // one provider per array item is created
         *         // raw return value of 1st provider's getSite
         *         // ... and so on
         *       ],
         *       fromRawGetSiteMocks: [
         *         // implementation of getSite
         *       ]
         *     }
         *   }
         *   </pre>
         */
        function commonArrange (oCommonDataModelService, oContentProvidersConfig) {
            var oFakeContentProviders = createFakeContentProviders(oContentProvidersConfig);
            var oFakePluginManager = createFakePluginManager(oCommonDataModelService, oFakeContentProviders);
            var oGetServiceStub = sinon.stub(sap.ushell.Container, "getService");
            oGetServiceStub.withArgs("PluginManager").returns(oFakePluginManager);
            oGetServiceStub.throws("#getService was called on an unstubbed service in test");
        }

        // These tests ensure that getExtensionSites behaves as expected for different behaviors of loadContentProviderPlugins.
        [{
            testDescription: "provider successfully provides an extension site",
            oContentProvidersSpecs: {
                ids: "auto",
                create: { fromSiteOrErrors: [{ SITE_FROM: "Provider 1" }] }
            },
            expectedExtensionSites: [{
                providerId: "Provider1",
                site: { "SITE_FROM": "Provider 1" },
                success: true
            }]
        }, {
            testDescription: "provider fails to provide an extension site",
            oContentProvidersSpecs: {
                ids: "auto",
                create: { fromSiteOrErrors: ["intentionally failed"] } // failing site provided as string
            },
            expectedExtensionSites: [{
                providerId: "Provider1",
                error: "intentionally failed",
                success: false
            }]
        }, {
            testDescription: "some provider fail to provider extension site",
            oContentProvidersSpecs: {
                ids: "auto",
                create: {
                    fromSiteOrErrors: [
                        { SITE_FROM: "Provider 1" },
                        "intentionally failed A",
                        "intentionally failed B"
                    ]
                }
            },
            expectedExtensionSites: [
                {
                    providerId: "Provider1",
                    site: { "SITE_FROM": "Provider 1" },
                    success: true
                }, {
                    providerId: "Provider2",
                    error: "intentionally failed A",
                    success: false
                }, {
                    providerId: "Provider3",
                    error: "intentionally failed B",
                    success: false
                }
            ]
        }, {
            testDescription: "no content providers exist",
            oContentProvidersSpecs: {
                ids: "auto",
                create: { fromSiteOrErrors: [] }
            },
            expectedExtensionSites: []
        }, {
            testDescription: "content provider's getSite returns something different than a promise",
            oContentProvidersSpecs: {
                ids: "auto",
                create: {
                    fromRawReturnValues: [
                        "something else than a promise",
                        undefined,
                        null
                    ]
                }
            },
            expectedExtensionSites: [
                {
                    providerId: "Provider1",
                    error: "call to getSite failed: getSite does not return a Promise",
                    success: false
                }, {
                    providerId: "Provider2",
                    error: "call to getSite failed: getSite does not return a Promise",
                    success: false
                }, {
                    providerId: "Provider3",
                    error: "call to getSite failed: getSite does not return a Promise",
                    success: false
                }
            ]
        }, {
            testDescription: "content provider's getSite throws",
            oContentProvidersSpecs: {
                ids: "auto",
                create: {
                    fromGetSiteImplementations: [
                        function () { // getSite
                            throw new Error("something bad happened in the plugin");
                        }
                    ]
                }
            },
            expectedExtensionSites: [{
                error: "call to getSite failed: Error: something bad happened in the plugin",
                providerId: "Provider1",
                success: false
            }]
        }].forEach(function (oFixture) {
            asyncTest("getExtensionSites: resolves promise as expected when " + oFixture.testDescription, function () {
                var oCommonDataModelService = createCommonDataModelService(true /* bAssumeSiteIsValid */);
                commonArrange(oCommonDataModelService, oFixture.oContentProvidersSpecs);

                oCommonDataModelService.getExtensionSites()
                    .done(function (aExtensionSites) {
                        ok(true, "the promise was resolved");

                        deepEqual(aExtensionSites, oFixture.expectedExtensionSites,
                            "obtained the expected results");

                        var aSitesFromContentProviders = oFixture.oContentProvidersSpecs.create.fromSiteOrErrors;
                        if (aSitesFromContentProviders) {
                            aExtensionSites.forEach(function (oExtensionSite, iIdx) {
                                if (oExtensionSite.success) {
                                    notStrictEqual(
                                        oExtensionSite.site,
                                        aSitesFromContentProviders[iIdx],
                                        "the extension site was cloned. DEBUG: site index: " + iIdx
                                    );
                                }
                            });
                        }
                    })
                    .fail(function () {
                        ok(false, "the promise was resolved");
                    })
                    .always(function () {
                        start();
                    });
            });

            asyncTest("getExtensionSites: notifies progress of successfully-loaded extension sites only when " + oFixture.testDescription, function () {
                var aExtensionSitesFromProgress,
                    oCommonDataModelService = createCommonDataModelService(true /* bAssumeSiteIsValid */);

                commonArrange(oCommonDataModelService, oFixture.oContentProvidersSpecs);

                aExtensionSitesFromProgress = [];

                oCommonDataModelService.getExtensionSites()
                    .progress(function (oExtensionSite) {
                        aExtensionSitesFromProgress.push(oExtensionSite);
                    })
                    .done(function (/*aExtensionSites*/) {
                        var bAllSuccessful = aExtensionSitesFromProgress.every(function (oExtensionSite) {
                            return oExtensionSite.success === true;
                        });

                        strictEqual(bAllSuccessful, true,
                            "no errors are contained in extension sites notified via promise progress");

                        var iNumSuccessful = oFixture.expectedExtensionSites.filter(function (oExpectedExtensionSite) {
                            return oExpectedExtensionSite.success === true;
                        }).length;

                        strictEqual(aExtensionSitesFromProgress.length, iNumSuccessful,
                            "the expected number of sites were notified");

                        start();
                    });
            });
        });

        [{
            testDescription: "two content providers register sites that resolve in reverse order",
            testFinalizeGetSitePromiseOrder: [1, 0],
            aSiteContentProviderIds: [
                "ProviderId1", // first site
                "ProviderId2" // second site
            ],
            aSitesFromContentProviders: [
                { // first site
                    catalogs: { MyCatalog1: { payload: { appDescriptors: [{ id: "app1" }] } } },
                    applications: { somethingElse: { "sap.app": { id: "app1" } } }
                },
                { // second site
                    catalogs: { MyCatalog2: { payload: { appDescriptors: [{ id: "app2" }] } } },
                    applications: { somethingElse: { "sap.app": { id: "app2" } } }
                }
            ],
            expectedErrorLogCalls: [],
            expectedExtensionSites: [
                {
                    providerId: "ProviderId1",
                    success: true,
                    site: {
                        catalogs: { MyCatalog1: { payload: { appDescriptors: [{ id: "app1" }] } } },
                        applications: { somethingElse: { "sap.app": { id: "app1" } } }
                    }
                }, {
                    providerId: "ProviderId2",
                    success: true,
                    site: {
                        catalogs: { MyCatalog2: { payload: { appDescriptors: [{ id: "app2" }] } } },
                        applications: { somethingElse: { "sap.app": { id: "app2" } } }
                    }
                }
            ]
        }, {
            testDescription: "two different content providers register their site with the same id",
            aSiteContentProviderIds: [
                "ProviderId", // first site
                "ProviderId" // second site
            ],
            aSitesFromContentProviders: [
                { // first site
                    catalogs: { MyCatalog1: { payload: { appDescriptors: [{ id: "app1" }] } } },
                    applications: { somethingElse: { "sap.app": { id: "app1" } } }
                },
                { // second site
                    catalogs: { MyCatalog2: { payload: { appDescriptors: [{ id: "app2" }] } } },
                    applications: { somethingElse: { "sap.app": { id: "app2" } } }
                }
            ],
            expectedErrorLogCalls: ["a content provider with ID 'ProviderId' is already registered"],
            expectedExtensionSites: [{
                providerId: "ProviderId",
                success: true,
                site: {
                    catalogs: { MyCatalog1: { payload: { appDescriptors: [{ id: "app1" }] } } },
                    applications: { somethingElse: { "sap.app": { id: "app1" } } }
                }
            }]
        }, {
            testDescription: "a site with a tile that doesn't belong to site.applications is provided",
            aSitesFromContentProviders: [{
                catalogs: { MyCatalog: { payload: { appDescriptors: [{ id: "sap.nonexisting.app" }] } } },
                applications: { somethingElse: { "sap.app": { id: "somethingElse" } } }
            }],
            expectedErrorLogCalls: ["One or more apps from Provider1 content provider are not listed among the applications section of the extended site and will be discarded - From catalog 'MyCatalog': 'sap.nonexisting.app'"],
            expectedExtensionSites: [{
                providerId: "Provider1",
                success: true,
                site: {
                    catalogs: { MyCatalog: { payload: { appDescriptors: [] } } },
                    applications: { somethingElse: { "sap.app": { id: "somethingElse" } } }
                }
            }]
        }, {
            testDescription: "a site with multiple tiles from different catalogs that don't belong to site.applications is provided",
            aSitesFromContentProviders: [{
                catalogs: {
                    MyCatalog1: { payload: { appDescriptors: [{ id: "sap.nonexisting.app1" }] } },
                    MyCatalog2: {
                        payload: {
                            appDescriptors: [
                                { id: "sap.nonexisting.app2" },
                                { id: "sap.nonexisting.app3" },
                                { id: "existing.app" }
                            ]
                        }
                    }
                },
                applications: { somethingElse: { "sap.app": { id: "existing.app" } } }
            }],
            expectedErrorLogCalls: ["One or more apps from Provider1 content provider are not listed among the applications section of the extended site and will be discarded - From catalog 'MyCatalog1': 'sap.nonexisting.app1'; From catalog 'MyCatalog2': 'sap.nonexisting.app2', 'sap.nonexisting.app3'"],
            expectedExtensionSites: [{
                success: true,
                providerId: "Provider1",
                site: {
                    catalogs: {
                        MyCatalog1: { payload: { appDescriptors: [] } },
                        MyCatalog2: { payload: { appDescriptors: [{ id: "existing.app" }] } }
                    },
                    applications: { somethingElse: { "sap.app": { id: "existing.app" } } }
                }
            }]
        }].forEach(function (oFixture) {
            asyncTest("getExtensionSites: resolves promise as expected when " + oFixture.testDescription, function () {
                var oCommonDataModelService = createCommonDataModelService(false /* bAssumeSiteIsValid */);
                commonArrange(oCommonDataModelService, {
                    ids: oFixture.aSiteContentProviderIds || "auto",
                    finalizeGetSitePromiseOrder: oFixture.testFinalizeGetSitePromiseOrder || oFixture.aSitesFromContentProviders.map(function (o, iIdx) {
                        return iIdx;
                    }),
                    create: { fromSiteOrErrors: oFixture.aSitesFromContentProviders }
                });

                sinon.stub(jQuery.sap.log, "error");

                oCommonDataModelService.getExtensionSites()
                    .done(function (aExtensionSites) {
                        ok(true, "the promise was resolved");

                        deepEqual(aExtensionSites, oFixture.expectedExtensionSites,
                            "obtained the expected results");
                    })
                    .fail(function () {
                        ok(false, "the promise was resolved");
                    })
                    .always(function () {
                        strictEqual(
                            jQuery.sap.log.error.callCount,
                            oFixture.expectedErrorLogCalls.length,
                            "jQuery.sap.log.error was called the expected number of times"
                        );

                        oFixture.expectedErrorLogCalls.forEach(function (sErrorMessage, iIdx) {
                            deepEqual(jQuery.sap.log.error.getCall(iIdx).args, [
                                sErrorMessage,
                                null,
                                "sap.ushell.services.CommonDataModel"
                            ], "call #" + (iIdx + 1) + " of jQuery.sap.log.error was made with the expected error");
                        });

                        start();
                    });
            });
        });

        // Begin of test for method "_applyRemainingProperties":
        // testDescription: completes sentence like "Does something WHEN ...":
        [{
            "testDescription": "a group is undefined",
            "oOriginalSite": { "groups": { "foobar": undefined } },
            "expectedChangedOriginalSite": { "groups": {} }
        }, {
            "testDescription": "payload is undefined",
            "oOriginalSite": { "groups": { "foobar": {} } },
            "expectedChangedOriginalSite": {
                "groups": {
                    "foobar": {
                        "payload": {
                            tiles: [],
                            groups: [],
                            links: []
                        }
                    }
                }
            }
        }, {
            "testDescription": "all properties are missing",
            "oOriginalSite": { "groups": { "foobar": { "payload": {} } } },
            "expectedChangedOriginalSite": {
                "groups": {
                    "foobar": {
                        "payload": {
                            tiles: [],
                            groups: [],
                            links: []
                        }
                    }
                }
            }
        }, {
            "testDescription": "one property is missing",
            "oOriginalSite": {
                "groups": {
                    "foobar": {
                        "payload": {
                            tiles: [{}],
                            groups: ["group1", "group2"]
                        }
                    }
                }
            },
            "expectedChangedOriginalSite": {
                "groups": {
                    "foobar": {
                        "payload": {
                            tiles: [{}],
                            groups: ["group1", "group2"],
                            links: []
                        }
                    }
                }
            }
        }, {
            "testDescription": "all properties are set",
            "oOriginalSite": {
                "groups": {
                    "foobar": {
                        "payload": {
                            tiles: [{}],
                            groups: ["group1", "group2"],
                            links: [{}]
                        }
                    }
                }
            },
            "expectedChangedOriginalSite": {
                "groups": {
                    "foobar": {
                        "payload": {
                            tiles: [{}],
                            groups: ["group1", "group2"],
                            links: [{}]
                        }
                    }
                }
            }
        }].forEach(function (oFixture) {
            QUnit.test("_applyRemainingProperties: Correctly initialise empty properties when  " + oFixture.testDescription, function () {
                var oCDM = sap.ushell.Container.getService("CommonDataModel");

                sinon.spy(oCDM, "_ensureCompleteSite");
                oCDM._ensureCompleteSite(oFixture.oOriginalSite);
                QUnit.deepEqual(
                    oFixture.oOriginalSite,
                    oFixture.expectedChangedOriginalSite,
                    "correctly initialised empty properties in Original site"
                );
                oCDM._ensureCompleteSite.restore();
            });
        });
    })();

    QUnit.test("_ensureGroupsOrder: remove first groups order entry if the group is not available", function (assert) {
        var oCDMService = sap.ushell.Container.getService("CommonDataModel"),
            oSite = {
                site: { payload: { groupsOrder: ["a", "b", "c"] } },
                groups: {
                    b: {},
                    c: {}
                }
            },
            aExpectedGroupsOrder = ["b", "c"];

        oSite = oCDMService._ensureGroupsOrder(oSite);

        assert.deepEqual(oSite.site.payload.groupsOrder, aExpectedGroupsOrder, "The missing group got removed");
    });

    QUnit.test("_ensureGroupsOrder: remove last groups order entry if the group is not available", function (assert) {
        var oCDMService = sap.ushell.Container.getService("CommonDataModel"),
            oSite = {
                site: { payload: { groupsOrder: ["a", "b", "c"] } },
                groups: {
                    a: {},
                    b: {}
                }
            },
            aExpectedGroupsOrder = ["a", "b"];

        oSite = oCDMService._ensureGroupsOrder(oSite);

        assert.deepEqual(oSite.site.payload.groupsOrder, aExpectedGroupsOrder, "The missing group got removed");
    });
});
