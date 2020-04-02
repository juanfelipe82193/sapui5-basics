// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.applicationIntegration.application.Application
 */
sap.ui.require([
    'sap/ushell/components/applicationIntegration/application/Application'
], function (Application) {
    "use strict";
    /* global module ok deepEqual, jQuery sap QUnit */

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

    QUnit.test("stringify and parse", function (assert) {
        var parent = {};
        var child = {};
        parent.child = child;
        child.parent = parent;

        [
            {
                sTest: "very complex with circ object",
                sMsg: "very complex with circ deep equals",
                oData: {
                    ev: {
                        v1: false,
                        v2: true
                    }
                },
                oResp: {
                    ev: {
                        v1: false,
                        v2: true
                    }
                }
            },
            {
                sTest: "simple object",
                sMsg: "simple objects verified",
                oData: {
                    test: 1
                },
                oResp: {
                    test: 1
                }
            },
            {
                sTest: "more complex object",
                sMsg: "more complex objects verified tdeep equals",
                oData: {
                    parent: parent,
                    test: 1,
                    more: {
                        xxx: 12,
                        yyy: 13
                    }
                },
                oResp: {
                    parent: {
                        child: {
                        }
                    },
                    test: 1,
                    more: {
                        xxx: 12,
                        yyy: 13
                    }
                }
            },
            {
                sTest: "circular complex object",
                sMsg: "circular  objects verified tdeep equals no ",
                oData: {
                    test: 1,
                    more: {
                        xxx: 12,
                        yyy: 13
                    }
                },
                oResp: {
                    test: 1,
                    more: {
                        xxx: 12,
                        yyy: 13
                    }
                }
            }
        ].forEach(function (oFixture) {
            var sStrObj = Application.stringify(oFixture.oData),
                oResp = Application.parse(sStrObj);

            deepEqual(oFixture.oResp, oResp, "ok", oFixture.sMsg);
        });
    });
    QUnit.test("stringify and parse with function", function (assert) {
        var parent = {};
        var child = {};
        parent.child = child;
        child.parent = parent;

        [
            {
                sTest: "object with function",
                sMsg: "verify tunnels object with function",
                oData: {
                    foo: function (xxx) {
                        console.log("xxx");
                    }
                },
                oResp: {
                    UUID: 1
                }
            }
        ].forEach(function (oFixture) {
            var oOrgPostMegs = Application.postMessageToIframeApp;
            Application.postMessageToIframeApp = function (oContainer, sServiceName, sInterface, oMessageBody, bWaitForResponse) {
                ok(oFixture.oResp.UUID, oMessageBody.content.UUID, oFixture.sMsg);
            };
            var sStrObj = Application.stringify(oFixture.oData),
                oResp = Application.parse(sStrObj);

            oResp.foo();
        });
    });
});
