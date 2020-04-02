// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for bootstrap common.configure.xhrlogon.js
 */
sap.ui.require([
    "sap/ushell/bootstrap/common/common.configure.xhrlogon",
    "sap/ushell/test/utils",
    "sap/ushell/bootstrap/common/common.util"
], function (oConfigureXhrLogon, testUtils, oUtils) {
    "use strict";

    /* global QUnit XMLHttpRequest sinon */

    var Q = QUnit;
    var A_POSSIBLE_LOGGING_METHODS = ["error", "warning", "info", "debug"],
        oCreateIgnoreListStub = {};

    function createFakeXHRLogonManager () {
        return {
            ignore: {
                add: function () { }
            }
        };
    }

    function createFakeFrameLogonManager () {
        return {};
    }

    function createFakeXhrLogonLib (oFakeFrameLogonManager, oFakeXHRLogonManager) {
        return {
            start: function () {},
            FrameLogonManager: {
                getInstance: function () {
                    return oFakeFrameLogonManager || createFakeFrameLogonManager();
                }
            },
            XHRLogonManager: {
                getInstance: function () {
                    return oFakeXHRLogonManager || createFakeXHRLogonManager();
                }
            }
        };
    };

    Q.module("common.configure.xhrlogon", {
        /**
         * This method is called after each test. Add every restoration code
         * here.
         */
        setup: function () {
            A_POSSIBLE_LOGGING_METHODS.forEach(function (sLoggingMethod) {
                sinon.stub(jQuery.sap.log, sLoggingMethod);
            });

            this._originalLogger = XMLHttpRequest.logger;
        },
        teardown : function () {
            var ajQuerySapLogFunctions = A_POSSIBLE_LOGGING_METHODS.map(function (sMethod) {
                return jQuery.sap.log[sMethod];
            });

            testUtils.restoreSpies.apply(testUtils, ajQuerySapLogFunctions);
            XMLHttpRequest.logger = this._originalLogger;

            testUtils.restoreSpies(
                oUtils.getLocationOrigin,
                jQuery.sap.getModulePath,
                oCreateIgnoreListStub,
                oConfigureXhrLogon.createUi5ConnectedXhrLogger,
                oConfigureXhrLogon.initXhrLogonIgnoreList
            );
        }
    });

    Q.test("start: starts XHR Logon lib", function (assert) {
        var oFakeContainer = {},
            oFakeXhrLogonLib = createFakeXhrLogonLib(),
            oStartStub = sinon.stub(oFakeXhrLogonLib, "start");

        oConfigureXhrLogon.start(oFakeContainer, oFakeXhrLogonLib);

        Q.strictEqual(oStartStub.callCount, 1, "XHRLogonLib.start was called once");

    });

    Q.test("start: configures Frame Logon Manager in the provided sap.ushell.Container object", function (assert) {
        var oFakeContainer = {};
        var oFakeFrameLogonManager = createFakeFrameLogonManager();
        var oFakeXhrLogonLib = createFakeXhrLogonLib(oFakeFrameLogonManager);

        oConfigureXhrLogon.start(oFakeContainer, oFakeXhrLogonLib);

        assert.strictEqual(oFakeContainer.hasOwnProperty("oFrameLogonManager"),
            true, "sap.ushell.Container has a 'oFrameLogonManager' own property");

        assert.strictEqual(oFakeContainer.oFrameLogonManager,
            oFakeFrameLogonManager, "the expected Frame logon manager was configured in sap.ushell.Container instance");
    });

    Q.test("start: configures a logger in XMLHttpRequest object", function (assert) {
        var oFakeContainer = {};
        var oFakeXhrLogonLib = createFakeXhrLogonLib();

        oConfigureXhrLogon.start(oFakeContainer, oFakeXhrLogonLib);

        assert.strictEqual(Object.prototype.toString.apply(XMLHttpRequest.logger),
            "[object Object]", "XMLHttpRequest has a 'logger' member set to an Object");

        assert.deepEqual(A_POSSIBLE_LOGGING_METHODS.sort(), Object.keys(XMLHttpRequest.logger).sort(),
            "logger member has the keys: " + A_POSSIBLE_LOGGING_METHODS.join(", "));

        A_POSSIBLE_LOGGING_METHODS.forEach(function (sMethod) {
            assert.strictEqual(typeof XMLHttpRequest.logger[sMethod], "function",
                "logger key '" + sMethod + "' has a function as a value");

        });
    });

    Q.test("start: initializes the ignore list", function (assert) {
        var oFakeContainer = {},
            oFakeXHRLogonManager = createFakeXHRLogonManager,
            oFakeXhrLogonLib = createFakeXhrLogonLib(undefined, oFakeXHRLogonManager),
            fnInitXhrLogonIgnoreListStub = sinon.stub(oConfigureXhrLogon, "initXhrLogonIgnoreList");

        oConfigureXhrLogon.start(oFakeContainer, oFakeXhrLogonLib);

        assert.strictEqual(fnInitXhrLogonIgnoreListStub.callCount, 1,
            "initXhrLogonIgnoreList called exactly once");

        assert.strictEqual(fnInitXhrLogonIgnoreListStub.args[0][0], oFakeXHRLogonManager,
                "initXhrLogonIgnoreList called with correct XHRLogonManager instance");
    });

    A_POSSIBLE_LOGGING_METHODS.forEach(function (sMethod) {

        Q.test("createUi5ConnectedXhrLogger: creates UI5-connected XMLHttpRequest logger '" + sMethod + "'", function (assert) {
            var oXhrLogger = oConfigureXhrLogon.createUi5ConnectedXhrLogger();

            oXhrLogger[sMethod]("Test Error");

            assert.strictEqual(jQuery.sap.log[sMethod].callCount, 1,
                "jQuery.sap.log." + sMethod + " was called once");

            assert.deepEqual(jQuery.sap.log[sMethod].getCall(0).args, ["Test Error"],
                "jQuery.sap.log." + sMethod + " was called with the expected arguments");
        });
    });

    [
        // cases without ignore
        {
            testDescription: "bootstrap script path is undefined",
            sLocationOrigin: "https://sap.com",
            sBootstrapScriptPath: undefined,
            sExpectedIgnoreFilter: undefined

        }, {
            testDescription: "same origin of bootstrap script and FLP; HTTPS, w/o port",
            sLocationOrigin: "https://sap.com",
            sBootstrapScriptPath: "https://sap.com/url/is/not/ignored",
            sExpectedIgnoreFilter: undefined
        }, {
            testDescription: "same origin (w/ port) of bootstrap script (w/ port) and FLP; HTTPS",
            sLocationOrigin: "https://sap.com:12345",
            sBootstrapScriptPath: "https://sap.com:12345/url/is/not/ignored",
            sExpectedIgnoreFilter: undefined
        }, {
            testDescription: "same origin of bootstrap script and FLP; HTTP, w/o port",
            sLocationOrigin: "http://sap.com",
            sBootstrapScriptPath: "http://sap.com/url/is/not/ignored",
            sExpectedIgnoreFilter: undefined
        }, {
            testDescription: "same origin of bootstrap script and FLP; HTTP, w/ port",
            sLocationOrigin: "http://sap.com:12345",
            sBootstrapScriptPath: "http://sap.com:12345/url/is/not/ignored",
            sExpectedIgnoreFilter: undefined
        },
        // cases with ignore
        {
            testDescription: "same origin (w/o port) of bootstrap script (w/ port) and FLP; HTTPS",
            sLocationOrigin: "https://sap.com",
            sBootstrapScriptPath: "https://sap.com:12345/url/is/ignored",
            sExpectedIgnoreFilter: "https://sap.com:12345/url/is/ignored"
        },  {
            testDescription: "same origin (w/ port) of bootstrap script (w/o port) and FLP; HTTPS",
            sLocationOrigin: "https://sap.com:12345",
            sBootstrapScriptPath: "https://sap.com/url/is/ignored",
            sExpectedIgnoreFilter: "https://sap.com/url/is/ignored"
        }, {
            testDescription: "different origin of bootstrap script path and FLP; HTTPS, w/o port",
            sLocationOrigin: "http://sap.com",
            sBootstrapScriptPath: "http://server/url/is/ignored",
            sExpectedIgnoreFilter: "http://server/url/is/ignored"
        }, {
            testDescription: "different origin of bootstrap script path and FLP; HTTPS, w/ port",
            sLocationOrigin: "https://sap.com:12345",
            sBootstrapScriptPath: "https://server:12345/url/is/ignored",
            sExpectedIgnoreFilter: "https://server:12345/url/is/ignored"
        }, {
            testDescription: "different protocol in bootstrap script and FLP; w/o port",
            sLocationOrigin: "https://sap.com",
            sBootstrapScriptPath: "http://sap.com/url/is/ignored",
            sExpectedIgnoreFilter: "http://sap.com/url/is/ignored"
        },
        {
            testDescription: "different protocol in bootstrap script and FLP; w/ port",
            sLocationOrigin: "https://sap.com:12345",
            sBootstrapScriptPath: "http://sap.com:12345/url/is/ignored",
            sExpectedIgnoreFilter: "http://sap.com:12345/url/is/ignored"
        }
    ].forEach(function (oFixture) {
        Q.test("initXhrLogonIgnoreList: correct when " + oFixture.testDescription, function () {
            var oXHRLogonManagerStub = {
                ignore : {
                    add: sinon.stub()
                }
            };

            sinon.stub(oUtils, "getLocationOrigin")
                .returns(oFixture.sLocationOrigin);

            sinon.stub(jQuery.sap, "getModulePath")
                .returns(oFixture.sBootstrapScriptPath);

            oConfigureXhrLogon.initXhrLogonIgnoreList(oXHRLogonManagerStub);

            if (oFixture.sExpectedIgnoreFilter) {
                Q.strictEqual(oXHRLogonManagerStub.ignore.add.callCount, 1, "ignore.add was called once");
                Q.strictEqual(oXHRLogonManagerStub.ignore.add.args[0][0], oFixture.sExpectedIgnoreFilter, "ignore.add was called with correct filter");
            } else {
                Q.strictEqual(oXHRLogonManagerStub.ignore.add.callCount, 0, "ignore.add was not called");
            }
        });
    });
});
