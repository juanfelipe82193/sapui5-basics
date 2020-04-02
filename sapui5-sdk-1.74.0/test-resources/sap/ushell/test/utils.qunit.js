// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for ushell-lib utils.js
 */
sap.ui.require([
    "sap/base/util/UriParameters",
    "sap/base/util/ObjectPath",
    "sap/ushell/utils",
    "sap/ushell/test/utils",
    "sap/ushell/ApplicationType",
    "sap/ui/Device",
    "sap/ushell/resources"
], function (
    UriParameters,
    ObjectPath,
    utils,
    testUtils,
    ApplicationType,
    Device
    // resources
) {
    "use strict";

    /* global deepEqual, equal, module, ok, start, strictEqual, test, sinon, QUnit, throws */

    var O_KNOWN_APPLICATION_TYPES = ApplicationType.enum;

    // set the language as formatDate tests check for English texts
    sap.ui.getCore().getConfiguration().setLanguage("en-US");

    // Create and structure your QUnit tests here
    // Documentation can be found at http://docs.jquery.com/QUnit
    module("sap/ushell/utils.js", {
        // This method is called after each test. Add every restoration code here.
        teardown: function () {
            testUtils.restoreSpies(
                Storage.prototype.setItem,
                UriParameters.fromURL,
                utils.getPrivateEpcm,
                utils.hasNativeNavigationCapability,
                utils.hasNativeLogoutCapability,
                utils.hasNavigationModeCapability,
                utils.hasFLPReadyNotificationCapability,
                jQuery.sap.log.error,
                utils.getParameterValueBoolean
            );
        }
    });

    test("utils.isApplicationTypeEmbeddedInIframe", function () {
        var oExpectedResult = {
            "URL": false,
            "WDA": false,
            "NWBC": true,
            "TR": true,
            "WCF": true,
            "SAPUI5": false
        };

        var aExpectedItemsInFixture = Object.keys(O_KNOWN_APPLICATION_TYPES)
            .map(function (sKey) {
                return O_KNOWN_APPLICATION_TYPES[sKey];
            })
            .sort();

        deepEqual(
            Object.keys(oExpectedResult).sort(),
            aExpectedItemsInFixture,
            "Test prerequisite is fulfilled: all application types are tested for #isApplicationTypeEmbeddedInIframe"
        );

        Object.keys(oExpectedResult).forEach(function (sApplicationType) {
            var bExpected = oExpectedResult[sApplicationType];
            strictEqual(
                utils.isApplicationTypeEmbeddedInIframe(sApplicationType),
                bExpected,
                "returns " + bExpected + " for " + sApplicationType
            );
        });
    });

    test("utils.isDefined returns as expected", function () {
        var testObject = {
            "definedAndFalse": false,
            "definedAndTrue": true,
            "definedAndString": "ok"
        };
        var isDefinedFalse = utils.isDefined(testObject.definedAndFalse),
            isDefinedTrue = utils.isDefined(testObject.definedAndTrue),
            isDefinedString = utils.isDefined(testObject.definedAndString),
            notDefined = utils.isDefined(testObject.notDefined);

        ok(isDefinedFalse, "expected that the property is defined if value is false");
        ok(isDefinedTrue, "expected that the property is defined if value true");
        ok(isDefinedString, "expected that the property is defined if value is a string");
        ok(!notDefined, "expected that the property was not defined if value is undefined");
    });

    test("utils.Error; create and expect tracing", function () {
        var oLogMock = testUtils.createLogMock()
            .error("UShell error created", null, "component");
        utils.Error("UShell error created", "component");
        oLogMock.verify();
    });

    test("utils.Error; check types", function () {
        var oError = new utils.Error("UShell error created", "component");
        ok(oError instanceof Error, "expected instance of Error");
        ok(oError instanceof utils.Error, "expected instance of utils.Error");
    });

    test("utils.Error: toString", function () {
        var oError = new utils.Error("UShell error created", "component");
        strictEqual(oError.toString(), "sap.ushell.utils.Error: UShell error created", "toString");
    });

    test("utils.Error: throw and catch", function () {
        var oError = new utils.Error("UShell error created", "component");
        try {
            throw oError;
        } catch (e) {
            strictEqual(e, oError);
            strictEqual(e.message, "UShell error created");
        }
    });

    test("utils.calcOrigin", function () {
        var origin = window.location.origin,
            sCalcorigin;
        if (!window.location.origin) {
            origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
        }
        sCalcorigin = utils.calculateOrigin(window.location);
        ok(sCalcorigin.length > 0, "not trivial");
        equal(sCalcorigin, origin, "correct url");
    });

    test("utils.calcOrigin no origin", function () {
        var sCalcorigin = utils.calculateOrigin({ hostname: "x.y.z", protocol: "http:", port: "8080" });
        equal(sCalcorigin, "http://x.y.z:8080");
    });

    test("utils.calcOrigin url construction, no port", function () {
        var sCalcorigin = utils.calculateOrigin({ hostname: "x.y.z", protocol: "http:" });
        equal(sCalcorigin, "http://x.y.z", "url ok ");
    });

    test("utils.calcOrigin origin used if present", function () {
        var sCalcorigin = utils.calculateOrigin({ origin: "httpX://sonicht:8080", hostname: "x.y.z", protocol: "http:", port: "8080" });
        equal(sCalcorigin, "httpX://sonicht:8080", "origin used if present");
    });

    test("utils.calcOrigin href used if origin/protocol/hostename not present", function () {
        var sCalcorigin = utils.calculateOrigin({ hostname: "x.y.z", href: "https://this.is.it:3600" });
        equal(sCalcorigin, "https://this.is.it:3600", "href used if present");
    });

    test("utils.hasNativeNavigationCapability detect NWBC v6.0+", function () {
        strictEqual(utils.hasNativeNavigationCapability(), false, "returns false (not in NWBC)");
    });

    test("utils.hasNativeLogoutCapability detect NWBC v6.0+", function () {
        strictEqual(utils.hasNativeLogoutCapability(), false, "returns false (not in NWBC)");
    });

    test("utils.hasNavigationModeCapability detect NWBC v6.0+", function () {
        strictEqual(utils.hasNavigationModeCapability(), false, "returns false (not in NWBC)");
    });

    test("utils.hasFLPReadyNotificationCapability detect NWBC v6.0+", function () {
        strictEqual(utils.hasFLPReadyNotificationCapability(), false, "returns false (not in NWBC)");
    });

    test("utils.has*Capability: ", function () {
        [{
            sMockedGetNwbcFeatureBits: "0",
            expectedHasNativeNavigationCapability: false, // first (least significant) bit
            expectedHasNativeLogoutCapability: false, // second (least significant) bit
            expectedHasNavigationModeCapability: false,
            expectedHasFLPReadyNotificationCapability: false
        }, {
            sMockedGetNwbcFeatureBits: "1",
            expectedHasNativeNavigationCapability: true,
            expectedHasNativeLogoutCapability: false,
            expectedHasNavigationModeCapability: false,
            expectedHasFLPReadyNotificationCapability: false
        }, {
            sMockedGetNwbcFeatureBits: "2",
            expectedHasNativeNavigationCapability: false,
            expectedHasNativeLogoutCapability: true,
            expectedHasNavigationModeCapability: false,
            expectedHasFLPReadyNotificationCapability: false
        }, {
            sMockedGetNwbcFeatureBits: "3",
            expectedHasNativeNavigationCapability: true,
            expectedHasNativeLogoutCapability: true,
            expectedHasNavigationModeCapability: false,
            expectedHasFLPReadyNotificationCapability: false
        }, {
            sMockedGetNwbcFeatureBits: "4",
            expectedHasNativeNavigationCapability: false,
            expectedHasNativeLogoutCapability: false,
            expectedHasNavigationModeCapability: true,
            expectedHasFLPReadyNotificationCapability: false
        }, {
            sMockedGetNwbcFeatureBits: "5",
            expectedHasNativeNavigationCapability: true,
            expectedHasNativeLogoutCapability: false,
            expectedHasNavigationModeCapability: true,
            expectedHasFLPReadyNotificationCapability: false
        }, {
            sMockedGetNwbcFeatureBits: "6",
            expectedHasNativeNavigationCapability: false,
            expectedHasNativeLogoutCapability: true,
            expectedHasNavigationModeCapability: true,
            expectedHasFLPReadyNotificationCapability: false
        }, {
            sMockedGetNwbcFeatureBits: "7",
            expectedHasNativeNavigationCapability: true,
            expectedHasNativeLogoutCapability: true,
            expectedHasNavigationModeCapability: true,
            expectedHasFLPReadyNotificationCapability: false
        }, {
            sMockedGetNwbcFeatureBits: "8",
            expectedHasNativeNavigationCapability: false,
            expectedHasNativeLogoutCapability: false,
            expectedHasNavigationModeCapability: false,
            expectedHasFLPReadyNotificationCapability: true
        }, {
            sMockedGetNwbcFeatureBits: "9",
            expectedHasNativeNavigationCapability: true,
            expectedHasNativeLogoutCapability: false,
            expectedHasNavigationModeCapability: false,
            expectedHasFLPReadyNotificationCapability: true
        }, {
            sMockedGetNwbcFeatureBits: "A",
            expectedHasNativeNavigationCapability: false,
            expectedHasNativeLogoutCapability: true,
            expectedHasNavigationModeCapability: false,
            expectedHasFLPReadyNotificationCapability: true
        }, {
            sMockedGetNwbcFeatureBits: "B",
            expectedHasNativeNavigationCapability: true,
            expectedHasNativeLogoutCapability: true,
            expectedHasNavigationModeCapability: false,
            expectedHasFLPReadyNotificationCapability: true
        }, {
            sMockedGetNwbcFeatureBits: "C",
            expectedHasNativeNavigationCapability: false,
            expectedHasNativeLogoutCapability: false,
            expectedHasNavigationModeCapability: true,
            expectedHasFLPReadyNotificationCapability: true
        }, {
            sMockedGetNwbcFeatureBits: "D",
            expectedHasNativeNavigationCapability: true,
            expectedHasNativeLogoutCapability: false,
            expectedHasNavigationModeCapability: true,
            expectedHasFLPReadyNotificationCapability: true
        }, {
            sMockedGetNwbcFeatureBits: "E",
            expectedHasNativeNavigationCapability: false,
            expectedHasNativeLogoutCapability: true,
            expectedHasNavigationModeCapability: true,
            expectedHasFLPReadyNotificationCapability: true
        }, {
            sMockedGetNwbcFeatureBits: "F",
            expectedHasNativeNavigationCapability: true,
            expectedHasNativeLogoutCapability: true,
            expectedHasNavigationModeCapability: true,
            expectedHasFLPReadyNotificationCapability: true
        }, {
            sMockedGetNwbcFeatureBits: "31",
            expectedHasNativeNavigationCapability: true,
            expectedHasNativeLogoutCapability: false,
            expectedHasNavigationModeCapability: false,
            expectedHasFLPReadyNotificationCapability: false
        }].forEach(function (oFixture) {
            // Arrange
            sinon.stub(utils, "getPrivateEpcm").returns({
                getNwbcFeatureBits: sinon.stub().returns(oFixture.sMockedGetNwbcFeatureBits)
            });

            // Act & Assert
            strictEqual(utils.hasNativeNavigationCapability(),
                oFixture.expectedHasNativeNavigationCapability,
                "utils.hasNativeNavigationCapability returned expected result when getNwbcFeatureBits returns " + oFixture.sMockedGetNwbcFeatureBits);

            strictEqual(utils.hasNativeLogoutCapability(),
                oFixture.expectedHasNativeLogoutCapability,
                "utils.hasNativeLogoutCapability returned expected result when getNwbcFeatureBits returns " + oFixture.sMockedGetNwbcFeatureBits);

            strictEqual(utils.hasNavigationModeCapability(),
                oFixture.expectedHasNavigationModeCapability,
                "utils.hasNavigationModeCapability returned expected result when getNwbcFeatureBits returns " + oFixture.sMockedGetNwbcFeatureBits);

            strictEqual(utils.hasFLPReadyNotificationCapability(),
                oFixture.expectedHasFLPReadyNotificationCapability,
                "utils.hasFLPReadyNotificationCapability returned expected result when getNwbcFeatureBits returns " + oFixture.sMockedGetNwbcFeatureBits);

            utils.getPrivateEpcm.restore();
        });
    });

    [{
        testDescription: "getPrivateEpcm returns undefined",
        returns: undefined,
        expectedHasNativeNavigationCapability: false
    }, {
        testDescription: "getNwbcFeatureBits throws",
        returns: { getNwbcFeatureBits: sinon.stub().throws("Some error") },
        expectedHasNativeNavigationCapability: false
    }].forEach(function (oFixture) {
        test("utils.hasNativeNavigationCapability returns expected result when " + oFixture.testDescription, function () {
            sinon.stub(utils, "getPrivateEpcm").returns(oFixture.returns);

            strictEqual(utils.hasNativeNavigationCapability(),
                oFixture.expectedHasNativeNavigationCapability, "returned expected result");
            utils.getPrivateEpcm.restore();
        });
    });

    [
        "hasNativeNavigationCapability",
        "hasNativeLogoutCapability",
        "hasNavigationModeCapability",
        "hasFLPReadyNotificationCapability"
    ].forEach(function (sMethod) {
        test("utils." + sMethod + " logs an error when window.epcm.getNwbcFeatureBits throws", function () {
            sinon.stub(jQuery.sap.log, "error");
            sinon.stub(utils, "getPrivateEpcm").returns({
                getNwbcFeatureBits: sinon.stub().throws("Some error")
            });

            utils[sMethod]();

            ok(jQuery.sap.log.error.calledOnce === true, "jQuery.sap.log.error was called once");

            utils.getPrivateEpcm.restore();
        });
    });

    test("utils.isNativeWebGuiNavigation returns true if TR in resolved navigation target and FDC detected", function () {
        var bResult;

        sinon.stub(utils, "getPrivateEpcm").returns({
            getNwbcFeatureBits: sinon.stub().returns("3")
        });

        bResult = utils.isNativeWebGuiNavigation({
            applicationType: "TR",
            url: "https://someserver.corp.com:1234/sap/bc/ui2/nwbc/~canvas;window=app/transaction/APB_LPD_CALL_TRANS?P_APPL=FS2_TEST&P_OBJECT=&P_PNP=&P_ROLE=FS2SAMAP&P_SELSCR=X&P_TCODE=SU01&DYNP_OKCODE=onli&sap-client=120&sap-language=EN"
        });
        strictEqual(bResult, true, "returns true");
        utils.getPrivateEpcm.restore();
    });

    [{ // empty URL
        sUrl: "",
        sUrlExpected: "?sap-user=USERID"
    }, { // "/"-terminated URL
        sUrl: "http://www.somet.hing.com/",
        sUrlExpected: "http://www.somet.hing.com/?sap-user=USERID"
    }, { // index.html terminated URL
        sUrl: "http://www.somet.hing.com/index.html",
        sUrlExpected: "http://www.somet.hing.com/index.html?sap-user=USERID"
    }, { // URL with parameter
        sUrl: "http://www.somet.hing.com/index.html?search=Hello",
        sUrlExpected: "http://www.somet.hing.com/index.html?search=Hello&sap-user=USERID"
    }, { // URL with multiple parameters
        sUrl: "http://www.somet.hing.com/index.html?search=Hello&title=Foo",
        sUrlExpected: "http://www.somet.hing.com/index.html?search=Hello&title=Foo&sap-user=USERID"
    }, {
        // URL with sap-user already specified
        sUrl: "http://www.somet.hing.com/index.html?search=Hello&sap-user=USERID&title=Foo",
        sUrlExpected: "http://www.somet.hing.com/index.html?search=Hello&sap-user=USERID&title=Foo&sap-user=USERID"
    }, { // URL with another parameter name other than sap-user
        sUrl: "http://www.somet.hing.com/index.html?search=Hello",
        sUrlExpected: "http://www.somet.hing.com/index.html?search=Hello&sap-id=USERID",
        sParamName: "sap-id"
    }, { // NWBC URL without prefix
        sUrl: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN&System=",
        sUrlExpected: "/ui2/nwbc/~canvas;window=app/wda/WD_ANALYZE_CONFIG_USER/?sap-client=120&sap-language=EN&System=&sap-user=USERID"
    }, {
        // NWBC URL with prefix
        sUrl: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_FLP_NAVIGATION/?sap-client=000&sap-language=EN",
        sUrlExpected: "https://example.corp.com:44355/sap/bc/ui2/nwbc/~canvas;window=app/wda/WDR_TEST_FLP_NAVIGATION/?sap-client=000&sap-language=EN&sap-user=USERID"
    }].forEach(function (oFixture) {
        test("utils.appendUserIdToUrl: adds sap-user correctly to " + oFixture.sUrl, function () {
            var sMockedUserId = "USERID",
                sParamName = oFixture.sParamName || "sap-user";

            // make sure no Container is defined before this test starts
            if (typeof sap.ushell.Container !== "undefined") {
                strictEqual(sap.ushell.Container, undefined, "sap.ushell.Container is not defined for appendUserIdToUrl");
            } else {
                // mock fake user value retrieved for the UserInfo service
                sap.ushell.Container = {
                    "getService": sinon.stub().withArgs("UserInfo").returns({
                        getUser: sinon.stub().returns({
                            getId: sinon.stub().returns(sMockedUserId)
                        })
                    })
                };

                strictEqual(utils.appendUserIdToUrl(sParamName, oFixture.sUrl), oFixture.sUrlExpected,
                    "the expected URL was returned");

                delete sap.ushell.Container;
            }
        });
    });

    [{
        testDescription: "no localstorage entry and no url parameters are defined",
        sLocalStorageEntry: undefined,
        sUrlParameterValue: undefined,
        expected: true
    }, {
        testDescription: "localstorage entry enabled and url disabled",
        sLocalStorageEntry: true,
        sUrlParameterValue: false, // false wins
        expected: false
    }, {
        testDescription: "localstorage entry disabled and url enabled",
        sLocalStorageEntry: false, // false wins
        sUrlParameterValue: true,
        expected: false
    }, {
        testDescription: "localstorage entry has unexpected value",
        sLocalStorageEntry: "strange value", // ignored
        sUrlParameterValue: false, // false wins
        expected: false
    }, {
        testDescription: "localstorage entry has unexpected value",
        sLocalStorageEntry: "strange value", // ignored
        sUrlParameterValue: true,
        expected: true
    }].forEach(function (oFixture) {
        test("utils.isClientSideNavTargetResolutionEnabled: returns expected result when jQuery.sap.storage is available and " + oFixture.testDescription, function () {
            // mock localStorage
            if (jQuery.sap.storage !== undefined) {
                // we expect this to be undefined when this test is run
                // NOTE: jQuery.sap.storage is a getter in the latest UI5 core
                ok(true, "jQuery.sap.storage is always defined");
                return;
            }

            // simulate jQuery.sap.storage available
            jQuery.sap.storage = sinon.stub().returns({
                get: sinon.stub().returns(oFixture.sLocalStorageEntry)
            });

            // simulate url parameter value
            sinon.stub(utils, "getParameterValueBoolean")
                .withArgs("sap-ushell-nav-cs")
                .returns(oFixture.sUrlParameterValue);

            strictEqual(utils.isClientSideNavTargetResolutionEnabled(), oFixture.expected,
                "got expected result");

            delete jQuery.sap.storage;
        });

        test("utils.isClientSideNavTargetResolutionEnabled: returns expected result when jQuery.sap.storage is not available and " + oFixture.testDescription, function () {
            var sOriginalLocalStorageValue;

            if (jQuery.sap.storage !== undefined) {
                // NOTE: jQuery.sap.storage is a getter in the latest UI5 core
                // we expect this to be undefined when this test is run
                ok(true, "jQuery.sap.storage is always defined");
                return;
            }

            // Actually using the localStorage makes all browsers happy for this test
            sOriginalLocalStorageValue = window.localStorage.getItem("targetresolution-client");
            window.localStorage.setItem("targetresolution-client", oFixture.sLocalStorageEntry);

            // simulate url parameter value
            sinon.stub(utils, "getParameterValueBoolean")
                .withArgs("sap-ushell-nav-cs")
                .returns(oFixture.sUrlParameterValue);

            strictEqual(utils.isClientSideNavTargetResolutionEnabled(), oFixture.expected,
                "got expected result");

            // Restore
            window.localStorage.setItem("targetresolution-client", sOriginalLocalStorageValue);
        });
    });

    test("utils.Map: basics", function () {
        var oMap = new utils.Map();
        oMap.put("key", "value");
        strictEqual(oMap.containsKey("key"), true);
        strictEqual(oMap.containsKey("something"), false);
        strictEqual(oMap.get("key"), "value");
        strictEqual(oMap.get("something"), undefined);
        oMap.put("get", "oh");
        strictEqual(oMap.get("get"), "oh");
        oMap.put("hasOwnProperty", "oh");
        strictEqual(oMap.get("hasOwnProperty"), "oh");
        try {
            Object.prototype.foo = "bar"; // eslint-disable-line no-extend-native
            ok(!oMap.containsKey("foo"));
        } finally {
            delete Object.prototype.foo;
        }
    });

    test("utils.Map remove", function () {
        var oMap = new utils.Map();
        oMap.put("key", "value");
        strictEqual(oMap.containsKey("key"), true);

        oMap.remove("key");
        strictEqual(oMap.containsKey("key"), false);
        strictEqual(oMap.get("key"), undefined);

        // removing something unknown should not throw an exeption
        oMap.remove("something");
    });

    test("utils.Map: keys", function () {
        var oMap = new utils.Map(),
            fnKeys = sinon.spy(Object, "keys"),
            aKeys;
        oMap.put("key", "value");
        aKeys = oMap.keys();
        deepEqual(aKeys, ["key"]);
        ok(fnKeys.calledOnce);
        ok(fnKeys.returned(aKeys));
    });

    test("utils.Map: toString", function () {
        var oMap = new utils.Map();
        strictEqual("sap.ushell.utils.Map({})", oMap.toString());

        oMap.put("key", "value");
        strictEqual("sap.ushell.utils.Map({\"key\":\"value\"})", oMap.toString());
    });

    test("utils.Map: error handling", function () {
        var oMap = new utils.Map();

        throws(
            function () { oMap.put({}, "foo"); },
            /Not a string key: \[object Object\]/
        );
        throws(
            function () { oMap.containsKey({}); },
            /Not a string key: \[object Object\]/
        );
        throws(
            function () { oMap.get({}); },
            /Not a string key: \[object Object\]/
        );
    });

    test("utils.Map: put twice", function () {
        var oMap = new utils.Map(),
            oPrevious;

        oPrevious = oMap.put("foo", window);
        strictEqual(oPrevious, undefined);

        oPrevious = oMap.put("foo", sinon);
        strictEqual(oPrevious, window);
    });

    test("utils.hexToRgb: hex to RGB convertion", function () {
        var sHexColor = "#0a030a",
            oRgbColor;

        oRgbColor = utils.hexToRgb(sHexColor);
        strictEqual(oRgbColor.r, 10);
        strictEqual(oRgbColor.g, 3);
        strictEqual(oRgbColor.b, 10);
    });

    test("utils.convertToRealOpacity: claculate real opacity value", function () {
        var iMaxUsage = 45,
            iHashlessTileOpacity = 1,
            iExpectedOpacityCalc = 0.9,
            iActualOpacityCalc,
            testTileUsage;

        iActualOpacityCalc = utils.convertToRealOpacity(testTileUsage, iMaxUsage);
        strictEqual(iActualOpacityCalc, iHashlessTileOpacity);

        testTileUsage = 25;
        iActualOpacityCalc = utils.convertToRealOpacity(testTileUsage, iMaxUsage);
        strictEqual(iActualOpacityCalc, iExpectedOpacityCalc);
    });

    test("localStorageSetItem in Safari private browsing mode", function () {
        var sError = "QUOTA_EXCEEDED_ERR",
            oLogMock = testUtils.createLogMock()
                .filterComponent("utils")
                .warning("Error calling localStorage.setItem(): " + sError, null,
                    "sap.ushell.utils");
        sinon.stub(Storage.prototype, "setItem");
        utils.localStorageSetItem("foo", "bar");
        ok(Storage.prototype.setItem.calledWithExactly("foo", "bar"),
            "localStorage.setItem called for test");

        Storage.prototype.setItem.throws(sError);
        utils.localStorageSetItem("foo", "bar");
        oLogMock.verify();
    });

    test("localStorageSetItem eventing to same window", function () {
        var fnStorageListener = sinon.spy(function (oStorageEvent) {
            strictEqual(oStorageEvent.key, "foo", "Key same window");
            strictEqual(oStorageEvent.newValue, "bar", "Value same window");
        });

        sinon.stub(Storage.prototype, "setItem");

        window.addEventListener("storage", fnStorageListener);
        utils.localStorageSetItem("foo", "bar", true);

        ok(fnStorageListener.calledOnce, "Listener called (once)");
        window.removeEventListener("storage", fnStorageListener);
    });

    test("getParameterValueBoolean : ", function () {
        var val, stub;
        stub = sinon.stub(UriParameters, "fromURL").returns({
            get: function () { return undefined; },
            mParams: {}
        });
        val = utils.getParameterValueBoolean("sap-accessibility");
        equal(val, undefined, " value is undefined");
        stub.restore();
    });

    ["X", "x", "tRue", "TRUE", "true"].forEach(function (sVal) {
        test("getParameterValueBoolean : trueish" + sVal, function () {
            var val, stub;
            stub = sinon.stub(UriParameters, "fromURL").returns({
                get: function () { return undefined; },
                mParams: { "sap-accessibility": [sVal, "false"] }
            });
            val = utils.getParameterValueBoolean("sap-accessibility");
            equal(val, true, " value is true");
            stub.restore();
        });
    });

    ["", "false", "FALSE", "False"].forEach(function (sVal) {
        test("getParameterValueBoolean : falsish" + sVal, function () {
            var val, stub;
            stub = sinon.stub(UriParameters, "fromURL").returns({
                get: function () { return undefined; },
                mParams: { "sap-accessibility": [sVal] }
            });
            val = utils.getParameterValueBoolean("sap-accessibility");
            equal(val, false, " value is false");
            stub.restore();
        });
    });

    ["fatruelse", "WAHR", "falsch"].forEach(function (sVal) {
        test("getParameterValueBoolean : undefined" + sVal, function () {
            var val, stub;
            stub = sinon.stub(UriParameters, "fromURL").returns({
                get: function () { return undefined; },
                mParams: { "sap-accessibility": [sVal] }
            });
            val = utils.getParameterValueBoolean("sap-accessibility");
            equal(val, undefined, " value is undefined");
            stub.restore();
        });
    });

    test("getFormFactor", function () {
        var oOriginalSystem = sap.ui.Device.system;

        function testFormFactor (oSystem, sExpected) {
            oSystem.SYSTEMTYPE = oOriginalSystem.SYSTEMTYPE;
            sap.ui.Device.system = oSystem;
            strictEqual(utils.getFormFactor(), sExpected);
        }

        testFormFactor({ desktop: true }, "desktop");
        testFormFactor({ tablet: true }, "tablet");
        testFormFactor({ phone: true }, "phone");
        testFormFactor({ tablet: true, phone: true }, "tablet"); // Phablet?
        testFormFactor({ desktop: true, tablet: true }, "desktop"); // MS Surface Pro?
        testFormFactor({ desktop: true, tablet: true, phone: true }, "desktop"); // ?
        testFormFactor({}, undefined);

        sap.ui.Device.system = oOriginalSystem;
    });

    test("call: sync call", function () {
        var bCalled = false;
        utils.call(
            function () {
                // this shall be called synchronously
                bCalled = true;
                ok(true);
            },
            function (sError) {
                // this MUST NOT be called
                strictEqual(sError, "");
                ok(false);
            },
            false
        );
        ok(bCalled);
    });

    test("call: async call", function () {
        var bCalled = false;
        utils.call(
            function () {
                // this shall be called asynchronously
                bCalled = true;
                ok(true);
            },
            function (sError) {
                // this MUST NOT be called
                strictEqual(sError, "");
                ok(false);
            },
            true
        );
        ok(!bCalled); // not yet called

        stop();
        setTimeout(function () {
            start();
            ok(bCalled); // now!
        }, 100);
    });

    test("call: try/catch", function () {
        var sText = "intentionally failed";
        utils.call(
            function () { throw new Error(sText); },
            function (sError) {
                // this shall be called
                strictEqual(sError, sText);
                ok(true);
            },
            false
        );

        stop();
        utils.call(
            function () { throw new Error(sText); },
            function (sError) {
                // this shall be called
                start();
                strictEqual(sError, sText);
                ok(true);
            },
            true
        );
    });

    test("call: error with failure handler", function () {
        var oError = new Error("intentionally failed");
        utils.call(
            function () { throw oError; },
            null,
            false
        );
        ok(true, "call catched exception");
    });

    test("call: error with failure handler", function () {
        var oError = new Error("intentionally failed");
        utils.call(
            function () { throw oError; },
            function (sMsg) { strictEqual(sMsg, "intentionally failed", "As expected"); },
            false
        );
    });

    test("call: non-error thrown with failure handler", function () {
        var oLogMock = testUtils.createLogMock()
            .error("Call to success handler failed: " + {}, undefined, "sap.ushell.utils");
        utils.call(
            function () { throw {}; },
            function (sMsg) { strictEqual(typeof sMsg, "string"); },
            false
        );
        oLogMock.verify();
    });

    test("invokeUnfoldingArrayArguments empty array", function () {
        var fnx = sinon.stub().returns(new jQuery.Deferred().resolve("A").promise());
        utils.invokeUnfoldingArrayArguments(fnx, [[]]).done(function (res) {
            deepEqual(res, [], "result ok");
        });
        equal(fnx.called, false, "not called");
    });

    test("invokeUnfoldingArrayArguments simple invoke", function () {
        var pr = new jQuery.Deferred().resolve("A").promise(),
            fnx = sinon.stub().returns(pr),
            prx = utils.invokeUnfoldingArrayArguments(fnx, ["a", "b", "c"]).done(function (res) {
                ok(res, "A", "original promise returned");
            });
        equal(prx, pr, "original promise returned");
        deepEqual(fnx.args[0], ["a", "b", "c"], " arguments ok");
    });

    test("invokeUnfoldingArrayArguments array invoke, error, wrong arg", function () {
        var pr = new jQuery.Deferred().resolve("A").promise(),
            fnx = sinon.stub().returns(pr);
        try {
            utils.invokeUnfoldingArrayArguments(fnx, [["c1", "c2", "c3"]]).done(function (res) {
                ok(false, "should not get here");
            });
            ok(false, "should not get here");
        } catch (e) {
            ok(true, "got exception");
        }
    });

    test("invokeUnfoldingArrayArguments array invoke, trivial case", function () {
        var fnx = sinon.stub();
        fnx.onCall(0).returns(new jQuery.Deferred().resolve("A1").promise());
        fnx.onCall(1).returns(new jQuery.Deferred().resolve("A2").promise());
        fnx.onCall(2).returns(new jQuery.Deferred().resolve("A3").promise());
        fnx.onCall(3).returns(new jQuery.Deferred().resolve("A4").promise());
        utils.invokeUnfoldingArrayArguments(fnx, [[["c1"], ["c2"], ["c3"]]]).done(function (res) {
            deepEqual(res, [["A1"], ["A2"], ["A3"]], "original promise returned");
        });
        deepEqual(fnx.args[0], ["c1"], " arguments ok");
        deepEqual(fnx.args[1], ["c2"], " arguments ok");
        deepEqual(fnx.args[2], ["c3"], " arguments ok");
    });

    test("invokeUnfoldingArrayArguments array invoke, multiple return arguments, multiple input argumetns", function () {
        var pr = new jQuery.Deferred().resolve("A", "B").promise(),
            cnt = 0,
            fnx = sinon.stub().returns(pr);
        utils.invokeUnfoldingArrayArguments(fnx, [[["c1", "p2"], ["c2", "p22"], ["c3", "p33"]]]).done(function (res) {
            deepEqual(res, [["A", "B"], ["A", "B"], ["A", "B"]], "original promise returned");
            cnt = 1;
        });
        ok(cnt === 1, "got to done");
        deepEqual(fnx.args[0], ["c1", "p2"], " arguments  1 ok");
        deepEqual(fnx.args[1], ["c2", "p22"], " arguments 2 ok");
        deepEqual(fnx.args[2], ["c3", "p33"], " arguments 3 ok");
    });

    test("invokeUnfoldingArrayArguments this vs that", function () {
        var oThat = {},
            fnFunction = function () {
                // assert
                strictEqual(this, oThat, "function was called with correct this");
                return new jQuery.Deferred()
                    .resolve("does not matter")
                    .promise();
            };

        // code under test
        utils.invokeUnfoldingArrayArguments
            .call(oThat, fnFunction, [[["a"], ["b"]]]);
    });

    test("invokeUnfoldingArrayArguments array invoke, reject", function () {
        var fnx = sinon.stub(),
            cnt = 0;
        fnx.onCall(0).returns(new jQuery.Deferred().resolve("A1").promise());
        fnx.onCall(1).returns(new jQuery.Deferred().reject("not me").promise());
        fnx.onCall(2).returns(new jQuery.Deferred().resolve("A3").promise());
        fnx.onCall(3).returns(new jQuery.Deferred().resolve("A4").promise());
        utils.invokeUnfoldingArrayArguments(fnx, [[["c1"], ["c2"], ["c3"]]]).done(function (res) {
            ok(false, "shoudl not get here");
            deepEqual(res, [["A1"], ["A2"], ["A3"]], "original promise returned");
        }).fail(function (/*sMsg*/) {
            ok(true, "got here");
            cnt = 1;
        });
        ok(cnt === 1, "got to fail");
        deepEqual(fnx.args[0], ["c1"], " arguments ok");
        deepEqual(fnx.args[1], ["c2"], " arguments ok");
        deepEqual(fnx.args[2], ["c3"], " arguments ok");
    });

    test("verify format Date", function () {
        var stub = sinon.stub(utils, "_getCurrentDate").returns(new Date("Thu Dec 30 2015 17:49:41 GMT+0200 (Jerusalem Standard Time)"));
        equal(utils.formatDate(new Date("Thu Dec 30 2015 17:49:41 GMT+0200 (Jerusalem Standard Time)")), "Just now");
        equal(utils.formatDate(new Date("Thu Dec 30 2015 11:49:41 GMT+0200 (Jerusalem Standard Time)")), "6 hours ago");
        equal(utils.formatDate(new Date("Thu Dec 29 2015 11:49:41 GMT+0200 (Jerusalem Standard Time)")), "1 day ago");
        equal(utils.formatDate(new Date("Thu Dec 24 2015 11:49:41 GMT+0200 (Jerusalem Standard Time)")), "6 days ago");
        equal(utils.formatDate(new Date("Thu Dec 30 2015 17:39:41 GMT+0200 (Jerusalem Standard Time)")), "10 minutes ago");
        equal(utils.formatDate(new Date("Thu Dec 30 2015 18:39:41 GMT+0300 (Jerusalem Daylight Time)")), "10 minutes ago");
        stub.restore();
    });

    test("Test retrieved visible tiles", function () {
        var oCore = sap.ui.getCore(),
            oCoreStub = sinon.stub(oCore, "byId"),
            jQueryFindStub = sinon.stub(window, "jQuery").callsFake(function (arg) {
                return arg !== "#shell-hdr" ? arg : { height: sinon.stub() };
            }),
            oUtils = utils,
            aVisibleTileoUtils;

        // Stubs
        oCoreStub.withArgs("viewPortContainer").returns({
            getCurrentCenterPage: function () { return "application-Shell-home"; }
        });
        oCoreStub.withArgs("dashboardGroups").returns({
            getDomRef: function () {
                return {
                    is: function (str) { return (str === ":visible"); }
                };
            },
            getGroups: function () {
                return [{
                    getLinks: function () { return []; },
                    getTiles: function () {
                        return [{
                            getDomRef: function () {
                                return {
                                    offset: function () { return { top: 10 }; },
                                    height: function () { return 10; }
                                };
                            }
                        }, {
                            getDomRef: function () {
                                return {
                                    offset: function () { return { top: 10 }; },
                                    height: function () { return 10; }
                                };
                            }
                        }];
                    },
                    getVisible: function () { return true; }
                }, {
                    getLinks: function () { return []; },
                    getTiles: function () {
                        return [{
                            getDomRef: function () {
                                return {
                                    offset: function () { return { top: 10 }; },
                                    height: function () { return 10; }
                                };
                            }
                        }, {
                            getDomRef: function () {
                                return {
                                    offset: function () { return { top: 10 }; },
                                    height: function () { return 10; }
                                };
                            }
                        }];
                    },
                    getVisible: function () { return true; }
                }, {
                    getLinks: function () { return []; },
                    getTiles: function () {
                        return [{
                            getDomRef: function () {
                                return {
                                    offset: function () { return { top: 10 }; },
                                    height: function () { return 10; }
                                };
                            }
                        }, {
                            getDomRef: function () {
                                return {
                                    offset: function () { return undefined; }
                                };
                            }
                        }];
                    },
                    getVisible: function () { return true; }
                }];
            },
            getModel: function () {
                return {
                    getProperty: function () { return "home"; }
                };
            }
        });

        // Actual Test
        aVisibleTileoUtils = oUtils.getVisibleTiles();
        ok(aVisibleTileoUtils.length === 5, "Expected retrieved 5 visible tiles as one of the tile has no offset");

        // Clean-up
        oCoreStub.restore();
        jQueryFindStub.restore();
    });

    /*
    TODO: Change test once dynamic tile logic change will be complete
    test("test setTilesNoVisibility for all tiles", function () {
        var aTiles = ["tile1" ,"tile2", "tile3"],
            getVisibleTilesStub = sinon.stub(utils, "getVisibleTiles").returns(aTiles),
            getTileObjectStub = sinon.stub(utils, "getTileObject").returns({});

        // mock fake user value retrieved for the UserInfo service
        sap.ushell.Container = {
            "getService": sinon.stub().withArgs("LaunchPage").returns({
                setTileVisible: function() {}
            })
        };
        var setVisibleTilesStub = sinon.stub(sap.ushell.Container.getService(), "setTileVisible");

        utils.setTilesNoVisibility();
        ok(setVisibleTilesStub.calledThrice, "setTileVisible was called 3 times");
        ok(setVisibleTilesStub.args[0][1] === false, "setTileVisible #1 was called with visibility 'false'");
        ok(setVisibleTilesStub.args[1][1] === false, "setTileVisible #2 was called with visibility 'false'");
        ok(setVisibleTilesStub.args[2][1] === false, "setTileVisible #3 was called with visibility 'false'");

        getVisibleTilesStub.restore();
        getTileObjectStub.restore();
        setVisibleTilesStub.restore();
    });
    */

    /*
    TODO:Change test once dynamic tile logic change will be complete
    test("test handleTilesVisibility for all tiles", function () {
        var aTiles = [{"isDisplayedInViewPort" : true} ,{"isDisplayedInViewPort" : true}, {"isDisplayedInViewPort" : false}],
            getVisibleTilesStub = sinon.stub(utils, "getVisibleTiles").returns(aTiles),
            getTileObjectStub = sinon.stub(utils, "getTileObject").returns("tile object");

        // mock fake user value retrieved for the UserInfo service
        sap.ushell.Container = {
            "getService": sinon.stub().withArgs("LaunchPage").returns({
                setTileVisible: function() {}
            })
        };
        var setTileVisibleStub = sinon.stub(sap.ushell.Container.getService(), "setTileVisible");

        utils.handleTilesVisibility();
        ok(setTileVisibleStub.calledThrice, "launchPageService.setTileVisible was called 3 times");
        ok(setTileVisibleStub.args[0][1] === true, "setTileVisible #1 was called with visibility 'true'");
        ok(setTileVisibleStub.args[1][1] === true, "setTileVisible #2 was called with visibility 'true'");
        ok(setTileVisibleStub.args[2][1] === false, "setTileVisible #3 was called with visibility 'false'");

        getVisibleTilesStub.restore();
        getTileObjectStub.restore();
        setTileVisibleStub.restore();
    });
    */

    /*
    TODO: Change test once dynamic tile logic change will be complete
    test("test refreshTiles for all visible tiles", function () {
        var aTiles = ["tile1" ,"tile2", "tile3"],
            getVisibleTilesStub = sinon.stub(utils, "getVisibleTiles").returns(aTiles),
            getTileObjectStub = sinon.stub(utils, "getTileObject").returns(aTiles[0]);

        // mock fake user value retrieved for the UserInfo service
        sap.ushell.Container = {
            "getService": sinon.stub().withArgs("LaunchPage").returns({
                refreshTile: function() {}
            })
        };
        var refreshTileStub = sinon.stub(sap.ushell.Container.getService(), "refreshTile");

        utils.refreshTiles();
        ok(refreshTileStub.calledThrice, "launchPageService.refreshTile was called 3 times");

        getVisibleTilesStub.restore();
        getTileObjectStub.restore();
        refreshTileStub.restore();
    });
    */

    test("test - check if group has tiles and links", function () {
        var aTiles = [{ id: "tile1", isTileIntentSupported: true }, { id: "tile1", isTileIntentSupported: true }],
            aLinks = [{ id: "link1", isTileIntentSupported: true }],
            bHasContent = false;

        bHasContent = utils.groupHasVisibleTiles(aTiles, aLinks);
        ok(bHasContent === true, "group has tiles and links");

        aLinks = [];
        bHasContent = utils.groupHasVisibleTiles(aTiles, aLinks);
        ok(bHasContent === true, "group has tiles");

        aTiles = [];
        bHasContent = utils.groupHasVisibleTiles(aTiles, aLinks);
        ok(bHasContent === false, "group has no tiles or links");

        aLinks = [{ id: "link1", isTileIntentSupported: true }];
        bHasContent = utils.groupHasVisibleTiles(aTiles, aLinks);
        ok(bHasContent === true, "group has links");
    });

    [{
        testDescription: "Call moveElementInsideOfArray with correct parameters - Element2 to index 4",
        aInputArray: [0, 1, 2, 3, 4, 5],
        nIndexOfElement: 2,
        nNewIdx: 4,
        oExpectedOutput: [0, 1, 3, 4, 2, 5]
    }, {
        testDescription: "Call moveElementInsideOfArray with correct parameters - Element4 to index 1",
        aInputArray: [0, 1, 2, 3, 4, 5],
        nIndexOfElement: 4,
        nNewIdx: 1,
        oExpectedOutput: [0, 4, 1, 2, 3, 5]
    }, {
        testDescription: "Call moveElementInsideOfArray with correct parameters - Element2 to index 5",
        aInputArray: [0, 1, 2, 3, 4, 5],
        nIndexOfElement: 2,
        nNewIdx: 5,
        oExpectedOutput: [0, 1, 3, 4, 5, 2]
    }, {
        testDescription: "Call moveElementInsideOfArray with correct parameters - but with same index",
        aInputArray: [0, 1, 2, 3, 4, 5],
        nIndexOfElement: 2,
        nNewIdx: 2,
        oExpectedOutput: [0, 1, 2, 3, 4, 5]
    }, {
        testDescription: "Call moveElementInsideOfArray with incorrect parameters - No operation necessary (source and target are equal)",
        aInputArray: [0],
        nIndexOfElement: 0,
        nNewIdx: 0,
        oExpectedOutput: [0]
    }].forEach(function (oFixture) {
        test("moveElementInsideOfArray: " + oFixture.testDescription, function () {
            // Act & Assert
            deepEqual(utils.moveElementInsideOfArray(oFixture.aInputArray, oFixture.nIndexOfElement, oFixture.nNewIdx), oFixture.oExpectedOutput, "Expected output");
        });
    });

    [{
        testDescription: "negative source index",
        input: [[0, 1, 2, 3, 4, 5, 6], -1, 5],
        expectedExceptionMsg: "Incorrect input parameters passed"
    }, {
        testDescription: "no input array is given",
        input: [{}, 2, 5],
        expectedExceptionMsg: "Incorrect input parameters passed"
    }, {
        testDescription: "empty input array",
        input: [[], 2, 5],
        expectedExceptionMsg: "Incorrect input parameters passed"
    }, {
        testDescription: "empty input array, invalid index",
        input: [[], 0, 0],
        expectedExceptionMsg: "Incorrect input parameters passed"
    }, {
        testDescription: "source index is undefined",
        input: [[0, 1, 2, 3, 4, 5, 6], undefined, 3],
        expectedExceptionMsg: "Incorrect input parameters passed"
    }, {
        testDescription: "target index is undefined",
        input: [[0, 1, 2, 3, 4, 5, 6], 3, undefined],
        expectedExceptionMsg: "Incorrect input parameters passed"
    }, {
        testDescription: "source index too high",
        input: [[0, 1, 2, 3, 4, 5, 6], 7, 0],
        expectedExceptionMsg: "Index out of bounds"
    }, {
        testDescription: "target index too high",
        input: [[0, 1, 2, 3, 4, 5, 6], 0, 7],
        expectedExceptionMsg: "Index out of bounds"
    }].forEach(function (oFixture) {
        test("moveElementInsideOfArray throws as " + oFixture.testDescription, function (assert) {
            assert.throws(
                function () {
                    utils.moveElementInsideOfArray.apply(null, oFixture.input);
                },
                oFixture.expectedExceptionMsg
            );
        });
    });

    [{
        testDescription: "first Generated ID is unique (empty array)",
        aExistingIds: [],
        expectedGeneratedId: "000-000-000"
    }, {
        testDescription: "first Generated ID is unique (all IDs differ)",
        aExistingIds: ["AAA-000-000", "BBB-000-000", "CCC-000-000", "DDD-000-000", "EEE-000-000"],
        expectedGeneratedId: "000-000-000"
    }, {
        testDescription: "Second ID is Unique",
        aExistingIds: ["000-000-000"],
        expectedGeneratedId: "100-000-000"
    }, {
        testDescription: "5th ID is Unique",
        aExistingIds: ["000-000-000", "100-000-000", "200-000-000", "300-000-000"],
        expectedGeneratedId: "400-000-000"
    }].forEach(function (oFixture) {
        test("generateUniqueId: " + oFixture.testDescription, function () {
            var sResult,
                oGetUidStub,
                iUidCount = -1;

            // arrange
            function isUniqueIdCallback (sProposedGeneratedId) {
                // prevent endless loops in the test
                if (iUidCount > 1000) {
                    ok(false, "endless loop");
                    return true;
                }

                return oFixture.aExistingIds.indexOf(sProposedGeneratedId) === -1;
            }

            oGetUidStub = sinon.stub(utils, "_getUid").callsFake(function () {
                iUidCount += 1;
                return iUidCount + "00-000-000";
            });

            // callback parameter
            // act
            sResult = utils.generateUniqueId(isUniqueIdCallback);
            // assert
            strictEqual(sResult, oFixture.expectedGeneratedId,
                "returned unique ID (callback parameter), call count: " + iUidCount);

            // array parameter
            // arrange (reset)
            iUidCount = -1;
            // act
            sResult = utils.generateUniqueId(oFixture.aExistingIds);
            // assert
            strictEqual(sResult, oFixture.expectedGeneratedId,
                "returned unique ID (callback parameter), call count: " + iUidCount);
            oGetUidStub.restore();
        });
    });

    test("generateUniqueId: callback returns falsy values", function () {
        var sResult,
            aUniqueIdCallbackResults = ["", false, 0, NaN, null, undefined], // falsy values
            aUniqueIdCallbackCalls = -1,
            iUidCount = -1,
            oGetUidStub,
            sExpectedUniqueId = aUniqueIdCallbackResults.length + "00-000-000"; // -1 can be skipped as true is add later

        // arrange
        aUniqueIdCallbackResults.push(true); // make the test successful in the end
        function isUniqueIdCallback (/*sProposedGeneratedId*/) {
            // prevent endless loops in the test
            if (iUidCount > 1000) {
                ok(false, "endless loop");
                return true;
            }

            aUniqueIdCallbackCalls += 1;
            return aUniqueIdCallbackResults[aUniqueIdCallbackCalls];
        }

        oGetUidStub = sinon.stub(utils, "_getUid").callsFake(function () {
            iUidCount += 1;
            return iUidCount + "00-000-000";
        });

        // callback parameter
        // act
        sResult = utils.generateUniqueId(isUniqueIdCallback);
        // assert
        strictEqual(sResult, sExpectedUniqueId,
            "returned unique ID, call count: " + iUidCount);
        oGetUidStub.restore();
    });

    test("shallowMergeObject: target object is modified after a merge", function () {
        var oTarget = { key1: "V1", key2: "V2" },
            oSource = { key3: "V3" };

        utils.shallowMergeObject(oTarget, oSource);

        deepEqual(oTarget, { key1: "V1", key2: "V2", key3: "V3" },
            "object was merged as expected"
        );
    });

    test("shallowMergeObject: only one argument is passed", function () {
        var oTarget = { key1: "V1", key2: "V2" };

        utils.shallowMergeObject(oTarget);

        strictEqual(oTarget, oTarget, "object was left intact");
    });

    test("shallowMergeObject: merges as expected when two objects are given", function () {
        var oTarget = { key1: "V1", key2: "V2" },
            oSource = { key3: "V3" };

        deepEqual(
            utils.shallowMergeObject(oTarget, oSource),
            { key1: "V1", key2: "V2", key3: "V3" },
            "object was merged as expected"
        );
    });

    test("shallowMergeObject: merges as expected when multiple objects are given", function () {
        var oTarget = { key1: "V1", key2: "V2" },
            oSource1 = { key3: "V3" },
            oSource2 = { key4: "V4" },
            oSource3 = { key5: "V5" };

        deepEqual(
            utils.shallowMergeObject(oTarget, oSource1, oSource2, oSource3),
            { key1: "V1", key2: "V2", key3: "V3", key4: "V4", key5: "V5" },
            "object was merged as expected"
        );
    });

    test("shallowMergeObject: merge is shallow", function () {
        var oTarget = { key1: { key2: { key3: "Value " } } },
            oSource = { key1: "WINS" };

        deepEqual(
            utils.shallowMergeObject(oTarget, oSource),
            { key1: "WINS" },
            "object was merged as expected"
        );
    });

    test("shallowMergeObject: multiple objects are merged in order", function () {
        var oTarget = { key: "Initial" },
            oSource1 = { key: "First" },
            oSource2 = { key: "Second" },
            oSource3 = { key: "Last" };

        deepEqual(
            utils.shallowMergeObject(oTarget, oSource1, oSource2, oSource3),
            { key: "Last" },
            "object was merged as expected"
        );
    });

    [
        { testDescription: "null", vData: null },
        { testDescription: "integer", vData: 1024 },
        { testDescription: "function", vData: function () { return "hi" !== "hello"; } },
        { testDescription: "boolean", vData: true },
        { testDescription: "undefined", vData: undefined },
        { testDescription: "string", vData: "hello" }
    ].forEach(function (oFixture) {
        test("clone: returns primitive value " + oFixture.testDescription, function () {
            var vCloned = utils.clone(oFixture.vData);
            strictEqual(vCloned, oFixture.vData);
        });
    });

    [
        { testDescription: "empty object", vData: {} },
        { testDescription: "empty array", vData: [] },
        { testDescription: "array of empty array", vData: [[]] },
        { testDescription: "non-empty object with one level", vData: { a: 1 } },
        { testDescription: "non-empty array with one level", vData: [1] },
        { testDescription: "object with an empty key", vData: { "": "" } },
        {
            testDescription: "object containing a Promise",
            vData: {
                "object": Promise.resolve(1)
            }
        }, {
            testDescription: "complex object",
            vData: {
                falsyArray: [null, undefined, "", false, 0],
                deepArray1: [
                    { "el1": "val1" },
                    ["a", null, undefined, 3],
                    { subarray: [] },
                    {}
                ]
            }
        }, {
            testDescription: "huge object",
            testSkipDeepEqual: true,
            vData: (function (i) {
                var oObject = {},
                    oObjectDeep = oObject;
                while (i > 0) {
                    oObjectDeep[i] = {};
                    oObjectDeep[i]["level" + i] = "end" + i;
                    oObjectDeep = oObjectDeep[i];
                    i--;
                }
                return oObject;
            })(9999)
        }, {
            testDescription: "circular object reference (in parent item)",
            testSkipDeepEqual: true,
            vData: (function () {
                var oChildren = {},
                    oParent = { value: oChildren };
                oChildren.a = 1;
                oChildren.b = 2;
                oChildren.c = oParent;
                return oParent;
            })()
        }, {
            testDescription: "circular object reference (in child item)",
            testSkipDeepEqual: true,
            vData: (function () {
                var oChild1 = {},
                    oChild2 = {},
                    oParent = { value: oChild1 };
                oChild1.a = 1;
                oChild1.b = 2;
                oChild1.c = oChild2;
                oChild2.d = 3;
                oChild2.e = oChild1;
                oChild2.f = 4;
                return oParent;
            })()
        }, {
            testDescription: "circular array reference (in child item)",
            testSkipDeepEqual: true,
            vData: (function () {
                var oChild1 = [],
                    oChild2 = [],
                    oParent = [oChild1];
                Array.prototype.push.apply(oChild1, [1, 2, oChild2]);
                Array.prototype.push.apply(oChild2, [3, oChild1, 4]);
                return oParent;
            })()
        }, {
            testDescription: "array with empty spots",
            vData: (function () {
                var aArray = [1, 2, 3];
                delete aArray[1];
                return aArray;
            })()
        }
    ].forEach(function (oFixture) {
        test("clone: returns a deep copy of " + oFixture.testDescription, function () {
            var bSuccess = true;
            try {
                var vClone = utils.clone(oFixture.vData);
                if (!oFixture.testSkipDeepEqual) {
                    deepEqual(vClone, oFixture.vData, "cloned object deeply equals the clone object");
                }
            } catch (e) {
                bSuccess = false;
            }
            ok(bSuccess, "clone did not throw an exception");
        });
    });

    test("clone: returns a deep copy of the original object", function () {
        var oOriginalObject = {
            flat: 1,
            deep: { a: 1, b: 2, c: 3 }
        };
        var oCloned = utils.clone(oOriginalObject);

        deepEqual(oCloned, oOriginalObject, "the two objects are deeply equal");

        // change clone
        oCloned.flat = "changed1";
        oCloned.deep.b = "changed2";

        strictEqual(oOriginalObject.flat, 1, "value 'flat' did not change in original object after it's modified in the copy");

        strictEqual(oOriginalObject.deep.b, 2, "value 'deep.a' did not change in ordignal object after it's modified in the copy");
    });

    test("clone: modifying a reference in the clone only changes the clone", function () {
        var oChild1 = [],
            oChild2 = { child1: oChild1 };
        oChild1.push(oChild2);

        var oOriginalObject = {
            child2: oChild2,
            child1: oChild1
        };

        var oCloned = utils.clone(oOriginalObject);

        try {
            JSON.stringify(oCloned);
        } catch (e) {
            strictEqual(
                // Don't check exact message as different browsers throw another message
                // we just want to make sure that the failure occurs because of
                // a circular reference.

                // - Chrome: "Converting circular structure to JSON"
                // - Firefox: "cyclic object value"
                // - IE11: "Circular reference in value argument not supported"
                (e.message.toLowerCase().indexOf("circular") >= 0) || (e.message.toLowerCase().indexOf("cyclic") >= 0),
                true,
                "JSON.stringify throws error on cloned object because of circular structure"
            );
        }

        // change child2 in the clone
        var oChild2Clone = oCloned.child1[0];
        oChild2Clone.b = 1;

        strictEqual(oCloned.child1[0].b, 1, "child 2 has property b with value 1 in the clone");
        strictEqual(oChild2.hasOwnProperty("b"), false, "child 2 has no property b in the original object");
    });

    [{
        testDescription: "one id given",
        sPrefix: "prefix",
        aIds: ["id1"],
        expectedKey: "prefix$id1"
    }, {
        testDescription: "two ids given",
        sPrefix: "prefix",
        aIds: ["id1", "id2"],
        expectedKey: "prefix#id1:id2"
    }, {
        testDescription: "more than two ids given",
        sPrefix: "prefix",
        aIds: ["id1", "id2", "id3"],
        expectedKey: "prefix@3@id1:id2:id3"
    }, {
        testDescription: "two ids with separator in the key are given",
        sPrefix: "prefix",
        aIds: ["id1", "id2:id3"],
        expectedKey: "prefix#id1:id2:id3"
    }].forEach(function (oFixture) {
        test("generateLocalStorageKey: " + oFixture.testDescription, function () {
            strictEqual(
                utils.generateLocalStorageKey(oFixture.sPrefix, oFixture.aIds),
                oFixture.expectedKey,
                "obtained the expected result"
            );
        });
    });

    test("generateLocalStorageKey throws when no ids are given", function () {
        throws(utils.generateLocalStorageKey.bind(utils, "prefix", []));
    });

    test("setPerformanceMark sets a performance mark", function () {
        var sMarkName = "myMark";

        // check if another test did set a performance mark
        if (performance.getEntries().length > 0) {
            performance.clearMarks();
        }

        // function to test
        utils.setPerformanceMark(sMarkName);

        ok(performance.getEntriesByName(sMarkName).length > 0, "A performance mark was set");

        // Clear all performance marks
        performance.clearMarks();
    });

    test("setPerformanceMark sets several performance marks", function (assert) {
        // Several mark names. Two share the same name.
        var aMarkName = ["myMark1", "myMark1", "myMark2", "myMark3"],
            fnDone = assert.async(),
            aPromises = [],
            oConfigMarks,
            iIndex = 4;

        // check if another test did set a performance mark
        if (performance.getEntries().length > 0) {
            performance.clearMarks();
        }

        // set the marks. This happens asynchronously as two marks with same time will not be recorded

        aMarkName.forEach(function (sValue, iIndex) {
            aPromises.push(new Promise(function (resolve) {
                setTimeout(function (sValue) {
                    utils.setPerformanceMark(sValue);
                    resolve();
                }, iIndex);
            }));
        });

        Promise.all(aPromises).then(function () {
            ok(performance.getEntriesByType("mark").length == iIndex, "Several performance marks were set");
            iIndex += 1;
            // All the following tests might need to be async, the ok function seems to be slow
            // enough to avoid this.

            // repeat with oConfigMarks undefined
            utils.setPerformanceMark(aMarkName[0], undefined);
            ok(performance.getEntriesByType("mark").length == iIndex, "oConfigMarks == undefined");
            iIndex += 1;

            // repeat with oConfigMarks.bUseUniqueMark empty
            utils.setPerformanceMark(aMarkName[0], {});
            ok(performance.getEntriesByType("mark").length == iIndex, "oConfigMarks == {}");
            iIndex += 1;

            // repeat with oConfigMarks.bUseUniqueMark undefined
            oConfigMarks = { bUseUniqueMark: undefined };
            utils.setPerformanceMark(aMarkName[0], undefined);
            ok(performance.getEntriesByType("mark").length == iIndex, "oConfigMarks.bUseUniqueMark == undefined");
            iIndex += 1;

            // repeat with oConfigMarks.bUseUniqueMark set to false
            oConfigMarks = { bUseUniqueMark: false };
            utils.setPerformanceMark(aMarkName[0], false);
            ok(performance.getEntriesByType("mark").length == iIndex, "oConfigMarks.bUseUniqueMark == false");
            iIndex += 1;

            // repeat with the bUseUniqueMark false and bUseLastMark true
            oConfigMarks = { bUseUniqueMark: false, bUseLastMark: true };
            utils.setPerformanceMark(aMarkName[0], oConfigMarks);
            ok(performance.getEntriesByType("mark").length == iIndex, "oConfigMarks.bUseUniqueMark == false, oConfigMarks.bUseLastMark==true");
            iIndex += 1;

            // Clear all performance marks
            performance.clearMarks();

            fnDone();
        });
    });

    test("setPerformanceMark keeps only the first measurement of a series", function (assert) {
        var aMarkName = ["myMark1", "myMark1", "myMark1", "myMark1"],
            fStartTime,
            aPromises = [],
            aPromises2 = [],
            fnDone = assert.async(),
            oConfigMarks;

        // set the first mark
        utils.setPerformanceMark("myMark1");

        // save the time stamp
        fStartTime = performance.getEntriesByName("myMark1")[0].startTime;

        // try to take more measurements - (oConfigMarks.bUseLastMark undefined)
        oConfigMarks = { bUseUniqueMark: true };
        aMarkName.forEach(function (sValue, iIndex) {
            aPromises.push(new Promise(function (resolve) {
                setTimeout(function (sValue) {
                    utils.setPerformanceMark(sValue, oConfigMarks);
                    resolve();
                }, iIndex, sValue);
            }));
        });

        // Tests
        Promise.all(aPromises).then(function () {
            ok(performance.getEntriesByName("myMark1").length == 1, "Only one measurement was recorded");
            ok(performance.getEntriesByName("myMark1")[0].startTime == fStartTime, "The first measurement was recorded");

            // try to take more measurements - oConfigMarks.bUseLastMark set to false
            oConfigMarks.bUseLastMark = false;
            aMarkName.map(function (sValue) { utils.setPerformanceMark(sValue, oConfigMarks); });

            // Tests
            ok(performance.getEntriesByName("myMark1").length == 1, "Only one measurement was recorded");
            ok(performance.getEntriesByName("myMark1")[0].startTime == fStartTime, "The first measurement was recorded");
        }).then(function () {
            // second batch of tests
            aMarkName.forEach(function (sValue, iIndex) {
                aPromises2.push(new Promise(function (resolve) {
                    setTimeout(function (sValue) {
                        // try to take more measurements - oConfigMarks.bUseLastMark set to false
                        utils.setPerformanceMark(sValue, oConfigMarks);
                        resolve();
                    }, iIndex, sValue);
                }));
            });

            Promise.all(aPromises2).then(function () {
                // Tests
                ok(performance.getEntriesByName("myMark1").length == 1, "Only one measurement was recorded");
                ok(performance.getEntriesByName("myMark1")[0].startTime == fStartTime, "The first measuremetn was recorded");

                // Clear all performance marks
                performance.clearMarks();

                fnDone();
            });
        });
    });

    test("setPerformanceMark keeps only the last measurement of series", function (assert) {
        var aMarkName = ["myMark1", "myMark1", "myMark1", "myMark1"],
            aAllMeasurements = [],
            fLastStartTime,
            iNumMarks,
            aPromises = [],
            fnDone = assert.async(),
            fMax,
            oConfigMarks;

        // try to take several measurements - oConfigMarks.bUseUniqueMark and oConfigMarks.bUseLastMark set to true
        oConfigMarks = { bUseUniqueMark: true, bUseLastMark: true };
        utils.setPerformanceMark("myMark1", oConfigMarks);
        // store the first measurement
        aAllMeasurements.push(performance.getEntriesByName("myMark1")[0].startTime);

        aMarkName.forEach(function (sValue, iIndex) {
            aPromises.push(new Promise(function (resolve) {
                setTimeout(function (sValue) {
                    utils.setPerformanceMark(sValue, oConfigMarks);
                    iNumMarks = performance.getEntriesByName(sValue).length;
                    aAllMeasurements.push(performance.getEntriesByName(sValue)[iNumMarks - 1].startTime);
                    resolve();
                }, iIndex, sValue);
            }));
        });

        // Tests
        Promise.all(aPromises).then(function () {
            ok(performance.getEntriesByName("myMark1").length == 1, "Only one measurement was recorded");
            // to be sure the last measurement was recorded check if the maximal time was recorded
            fLastStartTime = performance.getEntriesByName("myMark1")[0].startTime;
            // ECMA6 would be nice here: Math.max(...aAllMeasurements)
            fMax = aAllMeasurements.reduce(function (a, b) { return Math.max(a, b); });
            ok(fLastStartTime == fMax, "The last measurement was recorded");

            // Clear all performance marks
            performance.clearMarks();

            fnDone();
        });
    });

    test("paramsToString", function () {
        var oRes = utils.urlParametersToString({ ABC: ["3A"], DEF: ["4B"], AAAA: ["2", "1"] });
        deepEqual(oRes, "AAAA=2&AAAA=1&ABC=3A&DEF=4B");
    });

    test("paramsToString Escaping", function () {
        var oRes = utils.urlParametersToString({ "/AB/C": ["3A"], DEF: ["4B"], AAAA: ["2", "1"] });
        deepEqual(oRes, "%2FAB%2FC=3A&AAAA=2&AAAA=1&DEF=4B");
    });

    test("paramsToString NoArray", function () {
        var oRes = utils.urlParametersToString({ ABC: "3A", DEF: ["4B"], AAAA: ["2", "1"] });
        deepEqual(oRes, "AAAA=2&AAAA=1&ABC=3A&DEF=4B");
    });

    test("paramsToString Empty", function () {
        deepEqual(utils.urlParametersToString({}), "");
        deepEqual(utils.urlParametersToString(), "");
    });

    test("utils.removeDuplicatedActions: returns the same object if not array", function () {
        // arrange
        var oActions = {
            "0": "test",
            "1": "test"
        };
        // act
        var oUniqueActions = utils.removeDuplicatedActions(oActions);

        // assert
        deepEqual(oActions, oUniqueActions);
    });

    test("utils.removeDuplicatedActions: if array is empty return an empty array", function () {
        // arrange
        var aActions = [];

        // act
        var aUniqueActions = utils.removeDuplicatedActions(aActions);

        // assert
        deepEqual(aActions, aUniqueActions);
    });

    test("utils.removeDuplicatedActions: returns the same array in case of no duplicates", function () {
        // arrange
        var aActions = ["item1", "item2"];

        // act
        var aUniqueActions = utils.removeDuplicatedActions(aActions);

        // assert
        deepEqual(aActions, aUniqueActions);
    });

    test("utils.removeDuplicatedActions: in case all array items are the same returns an array with one item", function () {
        // arrange
        var aActions = ["item1", "item1", "item1"],
            aExpectedUniqueActions = ["item1"];

        // act
        var aUniqueActions = utils.removeDuplicatedActions(aActions);

        // assert
        deepEqual(aExpectedUniqueActions, aUniqueActions);
    });

    test("utils.removeDuplicatedActions: in case of duplicates array with unique items is returned", function () {
        // arrange
        var aActions = ["item1", "item2", "item1", "item3", "item1", "item2", "item1"],
            aExpectedUniqueActions = ["item1", "item2", "item3"];

        // act
        var aUniqueActions = utils.removeDuplicatedActions(aActions);

        // assert
        deepEqual(aExpectedUniqueActions, aUniqueActions);
    });

    test("utils.calcVisibilityModes: empty groups on mobile devices are not displayed on the homepage when not in edit mode", function () {
        // Arrange
        var oGroupHasVisibleTilesStub = sinon.stub(utils, "groupHasVisibleTiles").returns(false),
            oOriginalPhoneValue = Device.system.phone;
        Device.system.phone = true;

        // Act
        var aResult = utils.calcVisibilityModes({}, true);

        // Assert
        deepEqual(aResult, [false, true], "Group is hidden as expected");

        // Cleanup
        Device.system.phone = oOriginalPhoneValue;
        oGroupHasVisibleTilesStub.restore();
    });

    QUnit.module("isNativeWebGuiNavigation", {
        beforeEach: function () {
            this.oObjectPathStub = sinon.stub(ObjectPath, "get").callsFake(function (path, obj) {
                if (path === "applicationType") {
                    return obj.applicationType;
                }
                return obj.appCapabilities.nativeNWBCNavigation;
            });

            this.oHasNativeNavigationCapabilityStub = sinon.stub(utils, "hasNativeNavigationCapability");
        },
        afterEach: function () {
            this.oHasNativeNavigationCapabilityStub.restore();
            this.oObjectPathStub.restore();
        }
    });

    QUnit.test("returns correct logic: applicationType: 'TR', nativeNWBCNavigation: true, hasNativeNavigationCapability: true", function () {

        // Arrange
        var oResolvedNavigationTarget = {
            appCapabilities: {
                nativeNWBCNavigation: true
            },
            applicationType: "TR"
        };
        this.oHasNativeNavigationCapabilityStub.returns(true);

        // Act
        var bResult = utils.isNativeWebGuiNavigation(oResolvedNavigationTarget);

        // Assert
        strictEqual(bResult, true, "value matches expected result");
    });

    QUnit.test("returns correct logic: applicationType: 'AnyApplicationType', nativeNWBCNavigation: true, hasNativeNavigationCapability: true", function () {

        // Arrange
        var oResolvedNavigationTarget = {
            appCapabilities: {
                nativeNWBCNavigation: true
            },
            applicationType: "AnyApplicationType"
        };
        this.oHasNativeNavigationCapabilityStub.returns(true);

        // Act
        var bResult = utils.isNativeWebGuiNavigation(oResolvedNavigationTarget);

        // Assert
        strictEqual(bResult, true, "value matches expected result");
    });

    QUnit.test("returns correct logic: applicationType: 'TR', nativeNWBCNavigation: false, hasNativeNavigationCapability: true", function () {

        // Arrange
        var oResolvedNavigationTarget = {
            appCapabilities: {
                nativeNWBCNavigation: false
            },
            applicationType: "TR"
        };
        this.oHasNativeNavigationCapabilityStub.returns(true);

        // Act
        var bResult = utils.isNativeWebGuiNavigation(oResolvedNavigationTarget);

        // Assert
        strictEqual(bResult, true, "value matches expected result");
    });

    QUnit.test("returns correct logic: applicationType: 'AnyApplicationType', nativeNWBCNavigation: false, hasNativeNavigationCapability: true", function () {

        // Arrange
        var oResolvedNavigationTarget = {
            appCapabilities: {
                nativeNWBCNavigation: false
            },
            applicationType: "AnyApplicationType"
        };
        this.oHasNativeNavigationCapabilityStub.returns(true);

        // Act
        var bResult = utils.isNativeWebGuiNavigation(oResolvedNavigationTarget);

        // Assert
        strictEqual(bResult, false, "value matches expected result");
    });

    QUnit.test("returns correct logic: applicationType: 'TR', nativeNWBCNavigation: true, hasNativeNavigationCapability: true", function () {

            // Arrange
            var oResolvedNavigationTarget = {
                appCapabilities: {
                    nativeNWBCNavigation: true
                },
                applicationType: "TR"
            };
            this.oHasNativeNavigationCapabilityStub.returns(false);

            // Act
            var bResult = utils.isNativeWebGuiNavigation(oResolvedNavigationTarget);

            // Assert
            strictEqual(bResult, false, "value matches expected result");
        });

        QUnit.test("returns correct logic: applicationType: 'AnyApplicationType', nativeNWBCNavigation: true, hasNativeNavigationCapability: false", function () {

        // Arrange
        var oResolvedNavigationTarget = {
            appCapabilities: {
                nativeNWBCNavigation: true
            },
            applicationType: "AnyApplicationType"
        };
        this.oHasNativeNavigationCapabilityStub.returns(false);

        // Act
        var bResult = utils.isNativeWebGuiNavigation(oResolvedNavigationTarget);

        // Assert
        strictEqual(bResult, false, "value matches expected result");
    });

    QUnit.test("returns correct logic: applicationType: 'TR', nativeNWBCNavigation: false, hasNativeNavigationCapability: false", function () {

        // Arrange
        var oResolvedNavigationTarget = {
            appCapabilities: {
                nativeNWBCNavigation: false
            },
            applicationType: "TR"
        };
        this.oHasNativeNavigationCapabilityStub.returns(false);

        // Act
        var bResult = utils.isNativeWebGuiNavigation(oResolvedNavigationTarget);

        // Assert
        strictEqual(bResult, false, "value matches expected result");
    });

    QUnit.test("returns correct logic: applicationType: 'AnyApplicationType', nativeNWBCNavigation: false, hasNativeNavigationCapability: false", function () {

        // Arrange
        var oResolvedNavigationTarget = {
            appCapabilities: {
                nativeNWBCNavigation: false
            },
            applicationType: "AnyApplicationType"
        };
        this.oHasNativeNavigationCapabilityStub.returns(false);

        // Act
        var bResult = utils.isNativeWebGuiNavigation(oResolvedNavigationTarget);

        // Assert
        strictEqual(bResult, false, "value matches expected result");
    });
});
