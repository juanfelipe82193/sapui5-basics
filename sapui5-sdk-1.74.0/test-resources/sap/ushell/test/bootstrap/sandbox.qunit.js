// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap/ushell/bootstrap/sandbox.js
 */
sap.ui.require([
    "sap/ushell/test/utils",
    "sap/ui/thirdparty/URI"
], function (
    testUtils,
    URI
) {
    "use strict";
    /*global deepEqual, equal, jQuery, module, ok, sap, sinon, test, window */

    jQuery.sap.require("sap.ushell.bootstrap.sandbox");

    // get the URL of our own script; if included by ui2 qunitrunner, a global variable is filled
    var sOwnScriptUrl = window["sap-ushell-qunitrunner-currentTestScriptUrl"];

    var sCachedUshellConfig = JSON.stringify(window["sap-ushell-config"]),
        oBaseConfig = {
            "defaultRenderer": "fiori2",
            "services": {
                "LaunchPage": {
                    "adapter": {
                        "config": {
                            "catalogs": [
                                {
                                    "id": "sample_catalog",
                                    "title": "Sample Application Catalog",
                                    "tiles": [
                                        {
                                            "id": "tofoobar",
                                            "title": "Foo Bar Application",
                                            "size": "1x1",
                                            "tileType": "sap.ushell.ui.tile.StaticTile",
                                            "properties": {
                                                "chipId": "catalogTile_00",
                                                "title": "Foo Bar Application",
                                                "info": "shows foo bar",
                                                "icon": "sap-icon://Fiori2/F0001",
                                                "targetURL": "#Foo-bar"
                                            }
                                        },
                                        {
                                            "id": "tofoobar2",
                                            "title": "Foo Bar 2 Application",
                                            "size": "1x1",
                                            "tileType": "sap.ushell.ui.tile.StaticTile",
                                            "properties": {
                                                "chipId": "catalogTile_01",
                                                "title": "Foo Bar 2 Application",
                                                "info": "shows foo bar 2",
                                                "icon": "sap-icon://Fiori2/F0001",
                                                "targetURL": "#Foo-bar2"
                                            }
                                        }
                                    ]
                                }
                            ],
                            "groups": [
                                {
                                    "id": "sample_group",
                                    "title": "Sample Applications",
                                    "isPreset": true,
                                    "isVisible": true,
                                    "isGroupLocked": false,
                                    "tiles": [
                                        {
                                            "id": "tofoobar",
                                            "title": "Foo Bar Application",
                                            "size": "1x1",
                                            "tileType": "sap.ushell.ui.tile.StaticTile",
                                            "properties": {
                                                "chipId": "catalogTile_00",
                                                "title": "Foo Bar Application",
                                                "info": "shows foo bar",
                                                "icon": "sap-icon://Fiori2/F0001",
                                                "targetURL": "#Foo-bar"
                                            }
                                        },
                                        {
                                            "id": "tofoobar2",
                                            "title": "Foo Bar 2 Application",
                                            "size": "1x1",
                                            "tileType": "sap.ushell.ui.tile.StaticTile",
                                            "properties": {
                                                "chipId": "catalogTile_01",
                                                "title": "Foo Bar 2 Application",
                                                "info": "shows foo bar 2",
                                                "icon": "sap-icon://Fiori2/F0001",
                                                "targetURL": "#Foo-bar2"
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                },
                "NavTargetResolution": {
                    "adapter": {
                        "config": {
                            "applications": {
                                "Foo-bar": {
                                    "_comment": "Commenting the world famous foobar application!",
                                    "additionalInformation": "SAPUI5.Component=sap.foo.bar.FooBarApplication",
                                    "applicationType": "URL",
                                    "url": "/foo/bar/application",
                                    "description": "The world famous foobar application!"
                                },
                                "Foo-bar2": {
                                    "_comment": "Commenting why the sequel is better than the original.",
                                    "additionalInformation": "SAPUI5.Component=sap.foo.bar.FooBar2Application",
                                    "applicationType": "URL",
                                    "url": "/foo/bar2/application",
                                    "description": "Second edition of the world famous foobar application!"
                                }
                            }
                        }
                    }
                }
            }
        },
        oObsoleteConfigPart = {
            "applications": {
                "Custom-action1": {
                    "_comment": "We generate entries from this!",
                    "additionalInformation": "SAPUI5.Component=sap.custom.action.Application",
                    "applicationType": "URL",
                    "url": "/custom/action/application",
                    "description": "Our amazing custom test application!"
                },
                "Custom-action2": {
                    "_comment": "Component without namespace",
                    "additionalInformation": "SAPUI5.Component=Application",
                    "applicationType": "URL",
                    "url": "/custom/action/application",
                    "description": "Our amazing custom test application!"
                },
                "Custom-action3": {
                    "_comment": "Application with title",
                    "additionalInformation": "SAPUI5.Component=sap.custom.action.Application",
                    "applicationType": "URL",
                    "url": "/custom/action/application",
                    "description": "Our amazing custom test application!",
                    "title": "My application title"
                }
            }
        },
        oGeneratedGroup = {
            "id": "sap_ushell_generated_group_id",
            "title": "Generated Group",
            "tiles": [
                {
                    "id": "sap_ushell_generated_tile_id_0",
                    "title": "Application",
                    "size": "1x1",
                    "tileType": "sap.ushell.ui.tile.StaticTile",
                    "properties": {
                        "chipId": "sap_ushell_generated_chip_id",
                        "title": "Application",
                        "info": "Our amazing custom test application!",
                        "targetURL": "#Custom-action1"
                    }
                },
                {
                    "id": "sap_ushell_generated_tile_id_1",
                    "title": "Application",
                    "size": "1x1",
                    "tileType": "sap.ushell.ui.tile.StaticTile",
                    "properties": {
                        "chipId": "sap_ushell_generated_chip_id",
                        "title": "Application",
                        "info": "Our amazing custom test application!",
                        "targetURL": "#Custom-action2"
                    }
                },
                {
                    "id": "sap_ushell_generated_tile_id_2",
                    "title": "My application title",
                    "size": "1x1",
                    "tileType": "sap.ushell.ui.tile.StaticTile",
                    "properties": {
                        "chipId": "sap_ushell_generated_chip_id",
                        "title": "My application title",
                        "info": "Our amazing custom test application!",
                        "targetURL": "#Custom-action3"
                    }
                }
            ]
        };

    /**
     * Create a clone of an object.
     */
    function cloneObject(oObject) {
        return JSON.parse(JSON.stringify(oObject));
    }

    module("sap/ushell/bootstrap/sandbox.js", {
        setup: function () {
        },
        teardown: function () {
            testUtils.restoreSpies(
                jQuery.sap.sjax
            );
            if (sCachedUshellConfig) {
                window["sap-ushell-config"] = JSON.parse(sCachedUshellConfig);
            }
            if (jQuery.sap.log.restore) {
                jQuery.sap.log.restore();
            }
        }
    });

    test("_adjustApplicationConfiguration: adjust obsolete format", function () {
        var oConfig = cloneObject(oBaseConfig),
            oResultingConfig = cloneObject(oBaseConfig),
            sApplication;

        oConfig.applications = cloneObject(oObsoleteConfigPart.applications);
        oResultingConfig.services.LaunchPage.adapter.config.groups.unshift(cloneObject(oGeneratedGroup));
        for (sApplication in oObsoleteConfigPart.applications) {
            if (oObsoleteConfigPart.applications.hasOwnProperty(sApplication)) {
                oResultingConfig.services.NavTargetResolution.adapter.config.applications[sApplication] = oObsoleteConfigPart.applications[sApplication];
            }
        }

        // test successful adjustment, result should be new object (i.e. deepEqual)
        oConfig = sap.ushell.__sandbox__._adjustApplicationConfiguration(oConfig);

        // call deepEqual on relevant sub objects to get a nicer diff from qunit (seems to have some size/depth limit)
        deepEqual(oConfig.services.LaunchPage.adapter.config, oResultingConfig.services.LaunchPage.adapter.config, "obsolete format was adjusted for LaunchPage adapter config");
        deepEqual(oConfig.services.NavTargetResolution.adapter.config, oResultingConfig.services.NavTargetResolution.adapter.config, "obsolete format was adjusted for NavTargetResolution adapter config");

        deepEqual(oConfig, oResultingConfig, "obsolete format was adjusted as expected");
    });

    test("_applyJsonApplicationConfig: load config file and apply it", function () {
        var oExpectedConfig = cloneObject(oObsoleteConfigPart),
            oLogMock,
            oSjaxStub;

        // prepare test data
        window["sap-ushell-config"] = {};

        // we have to simulate the sjax call to the backend
        oSjaxStub = sinon.stub(jQuery.sap, "sjax", function (oParameters) {
            if (oParameters.url === "success.json") {
                return {
                    data: cloneObject(oObsoleteConfigPart),
                    success: true
                };
            }
            return {
                success: false,
                error: "foo_error",
                statusCode: 123,
                status: "foo_error_status"
            };
        });

        // provoke failure and check log
        oLogMock = testUtils.createLogMock()
            .error("Failed to load Fiori Launchpad Sandbox configuration from failure.json: " +
                "status: foo_error_status; error: foo_error")
            .sloppy(true);
        sap.ushell.__sandbox__._applyJsonApplicationConfig("failure.json");
        oLogMock.verify();

        // run successful and check log
        oLogMock = testUtils.createLogMock()
            .debug("Evaluating fiori launchpad sandbox config JSON: " + JSON.stringify(oObsoleteConfigPart))
            .sloppy(true);
        sap.ushell.__sandbox__._applyJsonApplicationConfig("success.json");
        oLogMock.verify();

        // check URL handling inside the function
        sap.ushell.__sandbox__._applyJsonApplicationConfig("foo.bar");
        ok(oSjaxStub.lastCall.calledWith({ url: "foo.bar.json", dataType: "json" }), "arguments as expected");
        sap.ushell.__sandbox__._applyJsonApplicationConfig("foobar.json");
        ok(oSjaxStub.lastCall.calledWith({ url: "foobar.json", dataType: "json" }), "arguments as expected");

        // check the resulting configuration
        oExpectedConfig.foo = "bar";
        window["sap-ushell-config"] = {"foo": "bar"};
        sap.ushell.__sandbox__._applyJsonApplicationConfig("success.json");
        deepEqual(window["sap-ushell-config"], oExpectedConfig, "config merged as expected");
    });

    test("_evaluateCustomRenderer: url parameter is valid string", function () {

        // first we test the clean-up, when foobar renderer is set
        window["sap-ushell-config"] = cloneObject(oBaseConfig);
        delete window["sap-ushell-config"].defaultRenderer;
        window["sap-ushell-config"].services.NavTargetResolution.adapter.config.applications[""] = {"foo": "bar"};

        sap.ushell.__sandbox__._evaluateCustomRenderer("foobar");

        equal(window["sap-ushell-config"].defaultRenderer, "foobar", "default renderer set correctly");
        equal(window["sap-ushell-config"].services.NavTargetResolution.adapter.config.applications[""], undefined, "nav target '' has been removed");

    });

    test("_evaluateCustomRenderer: url parameter is empty string", function () {

        window["sap-ushell-config"] = cloneObject(oBaseConfig);
        window["sap-ushell-config"].services.NavTargetResolution.adapter.config.applications[""] = {"foo": "bar"};

        sap.ushell.__sandbox__._evaluateCustomRenderer("");

        equal(window["sap-ushell-config"].defaultRenderer, oBaseConfig.defaultRenderer, "default renderer is kept");
        equal(window["sap-ushell-config"].services.NavTargetResolution.adapter.config.applications[""], undefined, "nav target '' has been removed");

    });

    test("_evaluateCustomRenderer: url parameter is undefined", function () {

        window["sap-ushell-config"] = cloneObject(oBaseConfig);
        window["sap-ushell-config"].services.NavTargetResolution.adapter.config.applications[""] = {"foo": "bar"};

        sap.ushell.__sandbox__._evaluateCustomRenderer();

        equal(window["sap-ushell-config"].defaultRenderer, oBaseConfig.defaultRenderer, "default renderer is kept");
        equal(window["sap-ushell-config"].services.NavTargetResolution.adapter.config.applications[""], undefined, "nav target '' has been removed");

    });

    test("_evaluateCustomRenderer: url parameter is number", function () {

        window["sap-ushell-config"] = cloneObject(oBaseConfig);
        window["sap-ushell-config"].services.NavTargetResolution.adapter.config.applications[""] = {"foo": "bar"};

        sap.ushell.__sandbox__._evaluateCustomRenderer(16);

        equal(window["sap-ushell-config"].defaultRenderer, oBaseConfig.defaultRenderer, "default renderer is kept");
        equal(window["sap-ushell-config"].services.NavTargetResolution.adapter.config.applications[""], undefined, "nav target '' has been removed");

    });

    test("_evaluateCustomRenderer: url parameter is 'fiorisandbox'", function () {
        var defaultNavTarget = {"foo": "bar"};

        // first we test the clean-up, when foobar renderer is set
        window["sap-ushell-config"] = cloneObject(oBaseConfig);
        window["sap-ushell-config"].defaultRenderer = "foobar";
        window["sap-ushell-config"].services.NavTargetResolution.adapter.config.applications[""] = defaultNavTarget;

        sap.ushell.__sandbox__._evaluateCustomRenderer("fiorisandbox");

        equal(window["sap-ushell-config"].defaultRenderer, "fiorisandbox", "default renderer set correctly");
        deepEqual(window["sap-ushell-config"].services.NavTargetResolution.adapter.config.applications[""], defaultNavTarget, "default nav target is kept");

    });

    test("fioriSandboxConfig.json: parse file to check consistency", function () {
        var oResponse,
            sRelativeConfigJsonPath = "../../shells/sandbox/fioriSandboxConfig.json",
            sConfigJsonPath;

        if (sOwnScriptUrl) {
            sConfigJsonPath = new URI(sOwnScriptUrl).directory() + "/" + sRelativeConfigJsonPath;
        } else {
            sConfigJsonPath = sRelativeConfigJsonPath;
        }

        oResponse = jQuery.sap.sjax({
            url: sConfigJsonPath,
            dataType: "json"
        });

        equal(oResponse.success, true, "request to load json successful");
        equal(oResponse.statusCode, 200, "status code of response is 200");
        ok(Object.prototype.toString.apply(oResponse.data.services.LaunchPage.adapter.config.groups) === "[object Array]", "groups array detected in config");

    });
});
