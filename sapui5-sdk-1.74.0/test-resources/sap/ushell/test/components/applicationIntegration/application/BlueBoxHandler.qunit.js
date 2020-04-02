// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.applicationIntegration.application.BlueBoxHandler
 */
sap.ui.require([
    'sap/ushell/components/applicationIntegration/application/BlueBoxHandler',
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/components/applicationIntegration/configuration/AppMeta",
    "sap/ushell/test/utils",
    'sap/ui/Device',
    "sap/ushell/services/Container",
    'sap/ushell/services/AppConfiguration',
    "sap/ushell/Config"
], function (BlueBoxHandler, AppLifeCycle, AppMeta, utils, Device, Container, AppConfiguration, Config) {
    "use strict";
    /* global module ok jQuery sap QUnit */

    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    jQuery.sap.require("sap.ushell.renderers.fiori2.History");
    jQuery.sap.require("sap.ushell.renderers.fiori2.Renderer");
    jQuery.sap.require("sap.ui.thirdparty.datajs");
    jQuery.sap.require("sap.ushell.ui.launchpad.LoadingDialog");
    jQuery.sap.require("sap.ushell.components.applicationIntegration.AppLifeCycle");
    jQuery.sap.require("sap.ushell.EventHub");

    //jQuery.sap.require("sap.ushell.components.applicationIntegration.AppLifeCycle");

    module("sap.ushell.components.applicationIntegration.configuration.AppMeta", {
        /**
         * This method is called after each test. Add every restoration code here.
         */
        setup: function () {

        },

        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {

        }
    });

    QUnit.test("#history back navigation", function (assert) {
        [
            {
                validate: {
                    sId: "test2",
                    sUrl: "https://test2.html",
                    exp: true
                },
                aConf: [
                    {
                        setup: {
                            id: "test1",
                            sUrl: "https://test1.html"
                        },
                        init: {
                            on: "TBD"
                        }
                    },
                    {
                        setup: {
                            id: "test2",
                            sUrl: "https://test2.html"
                        },
                        init: {
                            on: "TBD"
                        }
                    }
                ]
            },
            {
                validate: {
                    sId: "test3",
                    sUrl: "https://test3.html",
                    exp: false
                },
                aConf: [
                    {
                        setup: {
                            id: "test4",
                            sUrl: "https://test4.html"
                        },
                        init: {
                            on: "TBD"
                        }
                    },
                    {
                        setup: {
                            id: "test5",
                            sUrl: "https://test5.html"
                        },
                        init: {
                            on: "TBD"
                        }
                    }
                ]
            }
        ].forEach(function (oFixture) {
            var oActiveApplication,
                oSetup = {
                    oShellUIService: {
                        getInterface: function () {

                        }
                    },
                    oAppIsolationService: {
                        getInterface: function () {

                        }
                    }
                }, oAppLifeMock = {
                    addControl: function (oAppContainer) {

                    },
                    postMessageToIframeApp: function (sTopic, sMessage) {

                    }
                };
            BlueBoxHandler.init (oSetup, oFixture.aConf, oAppLifeMock);
            oActiveApplication = BlueBoxHandler.get(oFixture.validate.sUrl);
            ok(!oActiveApplication, "Not Expected cache element for URL:" + oFixture.validate.sUrl);
/*            if (oFixture.validate.exp) {
                ok(oActiveApplication.sId === "application" + oFixture.validate.sId, "Expected id: " + oFixture.validate.sId);
            } else {
                ok(oActiveApplication === undefined, "Not Expected cache element for URL:" + oFixture.validate.sUrl);
            }*/

        });
    });


    QUnit.test("#test capabilities", function (assert) {
        var oActiveApplication,
            aCaps = [
                {
                    service: "testsrvc1",
                    action: "act1"
                },
                {
                    service: "testsrvc1",
                    action: "act2"
                },
                {
                    service: "testsrvc1",
                    action: "act3"
                },
                {
                    service: "testsrvc2",
                    action: "act1"
                }
            ],
            oBB = {
                getIsStateful: function () {
                    return true;
                }
            },
            oSetup = {
                oShellUIService: {
                    getInterface: function () {

                    }
                },
                oAppIsolationService: {
                    getInterface: function () {

                    }
                }
            }, oAppLifeMock = {
                addControl: function (oAppContainer) {

                },
                postMessageToIframeApp: function (sTopic, sMessage) {

                }
            };
        BlueBoxHandler.init (oSetup, [
            {
                setup: {
                    id: "test4",
                    sUrl: "https://test4.html"
                },
                init: {
                    on: "TBD"
                }
            },
            {
                setup: {
                    id: "test5",
                    sUrl: "https://test5.html"
                },
                init: {
                    on: "TBD"
                }
            }
        ], oAppLifeMock);
        BlueBoxHandler.setCapabilities(oBB, aCaps);

        ok(BlueBoxHandler.isCapabilitySupported(oBB, "testsrvc1", "act1"), "Validate Cap testsrvc1.act1");
        ok(BlueBoxHandler.isCapabilitySupported(oBB, "testsrvc1", "act2"), "Validate Cap testsrvc1.act2");
        ok(BlueBoxHandler.isCapabilitySupported(oBB, "testsrvc1", "act3"), "Validate Cap testsrvc1.act3");
        ok(BlueBoxHandler.isCapabilitySupported(oBB, "testsrvc2", "act1"), "Validate Cap testsrvc1.act1");
        ok(!BlueBoxHandler.isCapabilitySupported(oBB, "testsrvc2", "act2"), "Validate Cap testsrvc2.act2 not active");
    });
});
