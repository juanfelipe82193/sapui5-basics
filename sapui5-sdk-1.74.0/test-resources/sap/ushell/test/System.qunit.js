// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap/ushell/System.js
 */

sap.ui.require(
    [
        "sap/ushell/System"
    ], function (System) {
    "use strict";
    /*global module, sap, strictEqual, test,
      jQuery, throws */

    jQuery.sap.require("sap.ushell.System");

    module("sap.ushell.System");

    test("sap.ushell.System: all getter", function () {
        var oSystem = new System({
            alias: "ALIAS_FOO",
            platform: "platform_foo",
            baseUrl: "/FOO",
            client: "120",
            clientRole: "T",
            system: "XYZ",
            productVersion: "A_B_C"
        });

        strictEqual(oSystem.getAlias(), "ALIAS_FOO");
        strictEqual(oSystem.getPlatform(), "platform_foo");
        strictEqual(oSystem.getBaseUrl(), "/FOO");
        strictEqual(oSystem.getName(), "XYZ");
        strictEqual(oSystem.getClient(), "120");
        strictEqual(oSystem.getClientRole(), "T");
        strictEqual(oSystem.getProductVersion(), "A_B_C");
    });

    test("sap.ushell.System.adjustUrl()", function () {

        function testFail (sUrl) {
            throws(function () {
                new System().adjustUrl(sUrl);
            }, /Invalid URL:/, sUrl);
        }

        function testAdjust (sUrl, oData, sExpected) {
            var oSystem = new sap.ushell.System(oData);

            strictEqual(oSystem.adjustUrl(sUrl), sExpected, sExpected);
        }

        testFail("../foo");
        testFail("/");
        testFail("http://www.sap.com");
        testAdjust("/sap/my/url", {}, "/sap/my/url");
        testAdjust("/sap/my/url", {baseUrl: "/bar"}, "/bar/sap/my/url");
        testAdjust("/sap/my/url", {baseUrl: "/bar/"}, "/bar/sap/my/url");
        testAdjust("/sap/my/url", {baseUrl: "http://some.other.host:4711/"},
            "http://some.other.host:4711/sap/my/url");
        testAdjust("/sap/my/url", {baseUrl: "http://some.other.host:4711/", client: "120"},
            "http://some.other.host:4711/sap/my/url?sap-client=120");
        testAdjust("/sap/my/url?foo=bar", {baseUrl: "http://some.other.host:4711/", client: "120"},
            "http://some.other.host:4711/sap/my/url?foo=bar&sap-client=120");
        testAdjust("/sap/my/url", {alias: "foo", baseUrl: "/bar/"}, "/bar/sap/my/url");
        testAdjust("/sap/my/url", {alias: "foo", baseUrl: ";o="}, "/sap/my/url;o=foo");
        testAdjust("/sap/my/url", {baseUrl: ";o="}, "/sap/my/url");
    });

    [
        {
            description: "default is false",
            config: {},
            expected: false
        }, {
            description: "value from config is true",
            config: {
                isTrialSystem: true
            },
            expected: true
        }, {
            description: "value fron config is false",
            config: {
                isTrialSystem: false
            },
            expected: false
        }
    ].forEach(function (oFixture) {
        test("sap.ushell.System.isTrial() returns correct value for " + oFixture.description, function () {
            var oSystem = new System(oFixture.config);
            strictEqual(oSystem.isTrial(), oFixture.expected, oFixture.description);
        });
    });
});
