// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.NavTargetResolution and customizable
 * extensions
 */
sap.ui.require([
    "sap/base/util/UriParameters",
    "sap/ushell/services/NavTargetResolution",
    "sap/ushell/services/_AppState/WindowAdapter",
    "sap/ushell/test/utils",
    "sap/ushell/navigationMode",
    "sap/ushell/services/Container",
    "sap/ushell/adapters/local/NavTargetResolutionAdapter",
    "sap/ushell/shells/demo/fioriDemoConfig"
], function (UriParameters, NavTargetResolution, WindowAdapter, testUtils, oNavigationMode) {
    "use strict";
    /* eslint-disable */ // TBD: make ESLint conform

    /*global Promise, asyncTest, deepEqual, equal, module,
      ok, start, throws, strictEqual, stop, test, jQuery, sap, sinon,
      window */

    var I_LONG_HASH_LENGTH = 2048,
        I_COMPACT_HASH_LENGTH_MAX = 1024;

    //clear local storage before running the tests
    if (window.localStorage) {
        window.localStorage.clear();
    }

    // we use a custom adapter as spy and stub
    var theLastHashFragment = null,
        sCachedConfig;
    jQuery.sap.declare("sap.ushell.unittest.NavTargetResolutionAdapterStub");
    sap.ushell.unittest.NavTargetResolutionAdapterStub = function () {
        this.resolveHashFragment = function (sHashFragment) {
            theLastHashFragment = sHashFragment;
            return (new jQuery.Deferred()).resolve("resolvedTo:" + sHashFragment).promise();
        };
    };

    function getClientSideTargetResolutionConfig(bClientSideTargetResolutionEnabled) {
        // enable ClientSideTargetResolution from configuration by default
        if (typeof bClientSideTargetResolutionEnabled === "undefined") {
            bClientSideTargetResolutionEnabled = true;
        }

        return {
            config: { enableClientSideTargetResolution: bClientSideTargetResolutionEnabled }
        };
    }

    module(
        "sap.ushell.services.NavTargetResolution",
        {
            setup : function () {
                // the config has to be reset after the test
                if (!sCachedConfig) {
                    sCachedConfig = JSON.stringify(window["sap-ushell-config"]);
                }

                window["sap-ushell-config"] = {
                    services: {
                        NavTargetResolution: {
                            adapter: {
                                config: {
                                    applications: {}
                                }
                            },
                            config: {
                                allowTestUrlComponentConfig : true,
                                runStandaloneAppFolderWhitelist: {
                                    "/sap/bc/ui5_ui5/" : true,
                                    "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/" : true,
                                    "ABC" : true,
                                    "ABC/def" : true,
                                    "/a/b/c" : true,
                                    "abc/def" : true
                                }
                            }
                        }
                    }
                };
            },
            /**
             * This method is called after each test. Add every restoration code
             * here.
             */
            teardown : function () {
                window["sap-ushell-config"] = JSON.parse(sCachedConfig);
                delete sap.ushell.Container;
            },
            after : function () {
                if (window.localStorage) {
                    window.localStorage.clear();
                }
            }
        }
    );

    test("singleton instantiated", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").then(function () {
            // modules cannot be unloaded; so this test should be the first in order
            ok(typeof sap.ushell.Container.getService("NavTargetResolution") === "object");
            done();
        });
    });

    function evalNow(oPromise) {
        var res, bIsDone = false;
        oPromise.done(function (pRes) {
            res = pRes;
            bIsDone = true;
        });
        oPromise.fail(function (pRes) {
            ok(false, "done expected");
        });
        ok(bIsDone, "done has been called");
        return res;
    }

    function testFailed(oPromise) {
        var res, bHasBeenFailed = false;
        oPromise.done(function (pRes) {
            ok(false, "fail expected");
        });
        oPromise.fail(function (pRes) {
            res = pRes;
            bHasBeenFailed = true;
        });
        ok(bHasBeenFailed, "failed");
        return res;
    }

    [
        {
            testDescription: "config option is true",
            vConfigOption: true,
            expectedResult: true
        },
        {
            testDescription: "config option is false",
            vConfigOption: false,
            expectedResult: false
        },
        {
            testDescription: "config option is 'true'",
            vConfigOption: false,
            expectedResult: false  // not a string
        }
    ].forEach(function(oFixture) {
        test("_isClientSideTargetResolutionEnabled: result is as expected when " + oFixture.testDescription, function (assert) {
            var done = assert.async();
            window["sap-ushell-config"].services.NavTargetResolution.config.enableClientSideTargetResolution = oFixture.vConfigOption;
            sap.ushell.bootstrap("local").then(function () {
                sap.ushell.Container.getServiceAsync("NavTargetResolution").then(function (oNavTargetResolutionService) {
                    strictEqual(oNavTargetResolutionService._isClientSideTargetResolutionEnabled(), oFixture.expectedResult, "expected result returned");
                    done();
                });
            });
        });
    });


    [
        {
            testDescription: "simple call with parameter",
            oArgs: {
                target: { semanticObject: "Test", action: "config" },
                params: { A: "B" }
            },
            expectedResponse: {
                        url: "/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/demoapps/FioriSandboxConfigApp",
                        text: undefined,
                        externalNavigationMode: undefined
            }
        },
        {
            testDescription: "call with sap-system in sid notation matching the local system",
            testCurrentSystemInformation: {                       // the system name and client are used to identify the local system instead
                name: "UI3",
                client: "000"
            },
            oArgs: {
                target: { semanticObject: "Test", action: "config" },
                params: {
                    "sap-ui2-wd-app-id": "WDR_TEST_PORTAL_NAV_TARGET",
                    "sap-system": "sid(UI3.000)"
                    // no sap-system-src provided
                }
            },
            expectedResponse: {
                        url: "/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/demoapps/FioriSandboxConfigApp",
                        text: undefined,
                        externalNavigationMode: undefined
            }
        }
    ].forEach(function (oFixture) {
        test("handleServiceMessageEvent resolveTarget: " + oFixture.testDescription, function (assert) {
            var done = assert.async();
            sap.ushell.bootstrap("local").done(function () {
                sap.ushell.Container.getServiceAsync("NavTargetResolution").then(function (oNavTargetResolutionService) {
                    oNavTargetResolutionService.resolveTarget(oFixture.oArgs).done(function (oResp) {
                        deepEqual(oResp, oFixture.expectedResponse,
                            "expected result returned");
                        done();
                    });
                });

            });
        });
    });

    test("Test-config", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").then(function () {
            sap.ushell.Container.getServiceAsync("NavTargetResolution").then(function (oNt) {
                var res = evalNow(oNt.resolveHashFragment("#Test-config"));
                deepEqual(res, {
                    "additionalInformation": "SAPUI5.Component=sap.ushell.demoapps.FioriSandboxConfigApp",
                    "applicationType": "URL",
                    "navigationMode": "embedded",
                    "targetNavigationMode": "inplace",
                    "url": "/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/demoapps/FioriSandboxConfigApp",
                    "ui5ComponentName": "sap.ushell.demoapps.FioriSandboxConfigApp"
                });
                done();
            });
        });
    });

    test("Test-Local resolution nothing defined", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").then(function () {
            sap.ushell.Container.getServiceAsync("NavTargetResolution").then(function (oNt) {
                oNt.resolveHashFragment("#Test-clear");
                var res = oNt.resolveHashFragment("#Test-local1");
                testFailed(res);
                res.always(done);
            });
        });
    });

    test("Test-Local resolution", function (assert) {
        // There are two parallel async calls to resolveHashFragment
        var done1 = assert.async();
        var done2 = assert.async();
        sap.ushell.bootstrap("local").then(function () {
            sap.ushell.Container.getServiceAsync("NavTargetResolution").then(function (oNt) {
                oNt.resolveHashFragment("#Test-clear");
                var obj = {
                    url: "ABC",
                    additionalInformation: "JOJO",
                    navigationMode: "something",
                    targetNavigationMode: null
                };
                window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify(obj);
                oNt.resolveHashFragment("#Test-local1").done(function (res2) {
                    deepEqual(res2, obj);
                    done1();
                });
                oNt.resolveHashFragment("#Test-clear");
                var res = oNt.resolveHashFragment("#Test-local1");
                testFailed(res);
                res.always(done2);
            });
        });
    });

    test("Test-Local resolution cross domain (bad-, good-, cleartest)", function (assert) {
        var done1 = assert.async();
        var done2 = assert.async();
        var done3 = assert.async();
        sap.ushell.bootstrap("local").then(function () {
            sap.ushell.Container.getServiceAsync("NavTargetResolution").then(function (oNt) {
                oNt.resolveHashFragment("#Test-clear");
                //bad case
                var sURL = "https://www.bbc.co.uk/sap/bc/ui5_ui5/";
                var obj = { url : sURL, additionalInformation : "JOJO" };
                window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify(obj);
                oNt.resolveHashFragment("#Test-local1").done(function () {
                    ok(false, "should not reach this section");
                }).fail(function (sMsg) {
                    deepEqual(sMsg, "URL is not resolvable", "sMsg does not have the proper value");
                }).always(done1);
                //good case
                sURL = window.location.origin + "/sap/bc/ui5_ui5/";
                obj = { url : sURL, additionalInformation : "JOJO" };
                window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify(obj);
                oNt.resolveHashFragment("#Test-local1").done(function (res2) {
                    deepEqual(res2.url, sURL, "url is filled with same domain url");
                }).fail(function (sMsg) {
                    ok(false, "good case");
                }).always(done2);
                oNt.resolveHashFragment("#Test-clear");
                var res = oNt.resolveHashFragment("#Test-local1");
                testFailed(res);
                res.always(done3);
            });
        });
    });

    test("Test-Local resolution undefined url", function (assert) {
        var done1 = assert.async();
        var done2 = assert.async();
        sap.ushell.bootstrap("local").then(function () {
            sap.ushell.Container.getServiceAsync("NavTargetResolution").then(function (oNt) {
                oNt.resolveHashFragment("#Test-clear");
                //good case
                var sURL; // window.location.origin + "/sap/bc/ui5_ui5/";
                var obj = { url : sURL, additionalInformation : "JOJO" };
                window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify(obj);
                var res = oNt.resolveHashFragment("#Test-local1");
                testFailed(res);
                res.always(done1);
                oNt.resolveHashFragment("#Test-clear");
                res = oNt.resolveHashFragment("#Test-local1");
                testFailed(res);
                res.always(done2);
            });
        });
    });

    test("Test-url resolution", function (assert) {
        var done1 = assert.async();
        var done2 = assert.async();
        var fnGet = function (s) {
            if (s.indexOf("additionalInformation") >= 0) {
                return "SAPUI5.Component=abc";
            }
            if (s.indexOf("sap-system") >= 0) {
                return null;
            }
            return "/a/b/c";
        };
        var oUriParametersStub;
        sap.ushell.bootstrap("local").then(function () {
            oUriParametersStub = sinon.stub(UriParameters.prototype, "get", fnGet);
            sap.ushell.Container.getServiceAsync("NavTargetResolution").then(function (oNt) {
                var res = oNt.resolveHashFragment("#Test-url");
                var evalRes = evalNow(res);
                deepEqual(evalRes, {
                    "additionalInformation": "SAPUI5.Component=abc",
                    "applicationType": "URL",
                    "url": "/a/b/c",
                    "navigationMode": "embedded",
                    "targetNavigationMode": "inplace",
                    "ui5ComponentName": "abc"
                });
                res.always(done1);

                res = oNt.baseResolveHashFragment("#Test-url");
                var sMsg = testFailed(res);
                deepEqual(sMsg, "Could not resolve link 'Test-url'", "correct error message");
                oUriParametersStub.restore();
                res.always(done2);
            });
        });
    });

    test("Test-url resolution - reject non-whitelisted folder", function (assert) {
        var done1 = assert.async();
        var done2 = assert.async();
        var fnGet = function (s) {
            if (s.indexOf("additionalInformation") >= 0) {
                return "SAPUI5.Component=abc";
            }
            if (s.indexOf("sap-system") >= 0) {
                return null;
            }
            return "/not/in/whitelist";
        };
        var oUriParametersStub;
        sap.ushell.bootstrap("local").then(function () {
            oUriParametersStub = sinon.stub(UriParameters.prototype, "get", fnGet);
            sap.ushell.Container.getServiceAsync("NavTargetResolution").then(function (oNt) {
                var res = oNt.resolveHashFragment("#Test-url");
                var sMsg = testFailed(res);
                deepEqual(sMsg, "URL is not resolvable", "correct error message");
                res.always(done1);

                res = oNt.baseResolveHashFragment("#Test-url");
                sMsg = testFailed(res);
                deepEqual(sMsg, "Could not resolve link 'Test-url'", "correct error message");
                oUriParametersStub.restore();
                res.always(done2);
            });
        });
    });

    test("Test-url resolution - allow all folders", function (assert) {
        var done1 = assert.async();
        var done2 = assert.async();
        var fnGet = function (s) {
            if (s.indexOf("additionalInformation") >= 0) {
                return "SAPUI5.Component=abc";
            }
            if (s.indexOf("sap-system") >= 0) {
                return null;
            }
            return "/any/folder/for/wildcard/whitelist";
        };
        window["sap-ushell-config"] = {
            // platform specific (ABAP) bootstrap configuration
            "services": {
                "NavTargetResolution" : {
                    adapter: {
                        config: {
                            applications: {}
                        }
                    },
                    "config" : {
                        "allowTestUrlComponentConfig" : true,
                        "runStandaloneAppFolderWhitelist": {
                            "*" : true
                        }
                    }
                }
            }
        };
        var oUriParametersStub;
        sap.ushell.bootstrap("local").then(function () {
            oUriParametersStub = sinon.stub(UriParameters.prototype, "get", fnGet);
            sap.ushell.Container.getServiceAsync("NavTargetResolution").then(function (oNt) {
                var res = oNt.resolveHashFragment("#Test-url");
                var evalRes = evalNow(res);
                deepEqual(evalRes, {
                    "additionalInformation": "SAPUI5.Component=abc",
                    "applicationType": "URL",
                    "url": "/any/folder/for/wildcard/whitelist",
                    "navigationMode": "embedded",
                    "targetNavigationMode": "inplace",
                    "ui5ComponentName": "abc"
                });
                res.always(done1);

                res = oNt.baseResolveHashFragment("#Test-url");
                var sMsg = testFailed(res);
                deepEqual(sMsg, "Could not resolve link 'Test-url'", "correct error message");
                oUriParametersStub.restore();
                res.always(done2);
            });
        });
    });

    test("Shell-runStandaloneApp resolution (url hash params)", function (assert) {
        var done1 = assert.async();
        var done2 = assert.async();
        var res;
        sap.ushell.bootstrap("local").then(function () {
            sap.ushell.Container.getServiceAsync("NavTargetResolution").then(function (oNt) {
                res = oNt.resolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=%2Fa%2Fb%2Fc%3FAA%3DBB%26CCC%3DEEEE&ABC=XXX");
                deepEqual({
                    "additionalInformation": "SAPUI5.Component=xxx",
                    "applicationType": "URL",
                    "url": "/a/b/c?AA=BB&CCC=EEEE&ABC=XXX",
                    "navigationMode": "embedded",
                    "targetNavigationMode": "inplace",
                    "ui5ComponentName": "xxx"
                }, evalNow(res));
                res.always(done1);

                res = oNt.baseResolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=%2Fa%2Fb%2Fc%3FAA%3DBB%26CCC%3DEEEE&ABC=XXX");
                var sMsg = testFailed(res);
                deepEqual(sMsg, "Could not resolve link 'Shell-runStandaloneApp'", "correct error message");
                res.always(done2);
            });
        });
    });

    test("Shell-runStandaloneApp resolution (url hash params 1)", function (assert) {
        var done = assert.async();
        var res;

        sap.ushell.bootstrap("local").then(function () {
            sap.ushell.Container.getServiceAsync("NavTargetResolution").then(function (oNt) {
                res = oNt.resolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=%2Fa%2Fb%2Fc&AAA=XXX");
                deepEqual(evalNow(res), {
                    "additionalInformation": "SAPUI5.Component=xxx",
                    "applicationType": "URL",
                    "url": "/a/b/c?AAA=XXX",
                    "navigationMode": "embedded",
                    "targetNavigationMode": "inplace",
                    "ui5ComponentName": "xxx"
                });
                res.always(done);
            });
        });
    });

    test("Shell-runStandaloneApp resolution (url params)", function (assert) {
        var done1 = assert.async();
        var done2 = assert.async();
        var oUriParametersStub
        sap.ushell.bootstrap("local").then(function () {
            var fnGet = function (s) {
                if (s.indexOf("additionalInformation") >= 0) {
                    return "SAPUI5.Component=abc";
                }
                if (s.indexOf("SAPUI5.Component") >= 0) {
                    return "xyz";
                }
                if (s.indexOf("sap-system") >= 0) {
                    return null;
                }
                return "/a/b/c";
            };
            oUriParametersStub = sinon.stub(UriParameters.prototype, "get", fnGet);
            sap.ushell.Container.getServiceAsync("NavTargetResolution").then(function (oNt) {
                var res = oNt.resolveHashFragment("#Shell-runStandaloneApp");
                deepEqual(evalNow(res), {
                    "additionalInformation": "SAPUI5.Component=xyz",
                    "applicationType": "URL",
                    "url": "/a/b/c",
                    "navigationMode": "embedded",
                    "targetNavigationMode": "inplace",
                    "ui5ComponentName": "xyz"
                });
                res.always(done1);

                res = oNt.baseResolveHashFragment("#Shell-runStandaloneApp");
                var sMsg = testFailed(res);
                deepEqual(sMsg, "Could not resolve link 'Shell-runStandaloneApp'", "correct error message");
                oUriParametersStub.restore();
                res.always(done2);
            });
        });
    });

    test("Shell-runStandaloneApp resolution (prevent cross domain injection)", function (assert) {
        var done = assert.async();
        var oNt,
            res,
            sMsg;
        sap.ushell.bootstrap("local").then(function () {
            oNt = sap.ushell.Container.getService("NavTargetResolution");
            res = oNt.resolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=http%3A%2F%2Fwww.google.de%2Fso%2Fnicht&AAA=XXX");
            sMsg = testFailed(res);
            deepEqual(sMsg, "URL is not resolvable", "correct error message"); //different domain, URL is empty,
            res.always(done);
        });
    });

    test("Shell-runStandaloneApp resolution (allow same domain injection)", function (assert) {
        var done = assert.async();
        var oNt,
            res;

        window["sap-ushell-config"] = {
            // platform specific (ABAP) bootstrap configuration
            "services": {
                "NavTargetResolution" : {
                    adapter: {
                        config: {
                            applications: {}
                        }
                    },
                    "config" : {
                        "runStandaloneAppFolderWhitelist": {
                            "/abc/" : true,
                            "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/" : true
                        }
                    }
                }
            }
        };
        sap.ushell.bootstrap("local").then(function () {
            oNt = sap.ushell.Container.getService("NavTargetResolution");
            res = oNt.resolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=" + encodeURIComponent(window.location.origin + "/abc/def") + "nicht&AAA=XXX");
            deepEqual(evalNow(res), {
                "additionalInformation": "SAPUI5.Component=xxx",
                "applicationType": "URL",
                "url": window.location.origin + "/abc/def" + "nicht?AAA=XXX",
                "navigationMode": "embedded",
                "targetNavigationMode": "inplace",
                "ui5ComponentName": "xxx"
            });
            res.always(done);
        });
    });

    test("Shell-runStandaloneApp resolution (prevent bad folder)", function (assert) {
        var done = assert.async();
        var oNt,
            res,
            sMsg;
        window["sap-ushell-config"] = {
            // platform specific (ABAP) bootstrap configuration
            "services": {
                "NavTargetResolution" : {
                    "adapter": {
                        config: {
                            applications: {}
                        }
                    },
                    "config" : {
                        "runStandaloneAppFolderWhitelist": {
                            "/abc/" : true,
                            "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/" : true
                        }
                    }
                }
            }
        };
        sap.ushell.bootstrap("local").then(function () {
            oNt = sap.ushell.Container.getService("NavTargetResolution");
            res = oNt.resolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=" + encodeURIComponent(window.location.origin + "/abc") + "nicht&AAA=XXX");
            sMsg = testFailed(res);
            deepEqual(sMsg, "URL is not resolvable", "correct error message");
            res.always(done);
        });
    });

    [
        window.location.origin + "/abc/def",
        window.location.origin + "/abc/../abc/def.json", // .. escape not possible
        "def/hij.json",
        "def/hij/aaa",
        "lmn/../def/hij.html",
        "/my/evil/../../abc/def",
        "../../relative/path"
    ].forEach(function (sFolder) {
        test("Shell-runStandaloneApp resolution (allow all folders " + sFolder + " - '*')", function (assert) {
            var done = assert.async();
            var oNt,
                res;

            window["sap-ushell-config"] = {
                // platform specific (ABAP) bootstrap configuration
                "services": {
                    "NavTargetResolution" : {
                        "adapter": {
                            config: {
                                applications: {}
                            }
                        },
                        "config" : {
                            "runStandaloneAppFolderWhitelist": {
                                "/abc/" : true,
                                "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/" : true,
                                "*" : true
                            }
                        }
                    }
                }
            };
            sap.ushell.bootstrap("local").then(function () {
                oNt = sap.ushell.Container.getService("NavTargetResolution");
                res = oNt.resolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=" + encodeURIComponent(sFolder) + "nicht&AAA=XXX");
                deepEqual(evalNow(res), {
                    "additionalInformation": "SAPUI5.Component=xxx",
                    "applicationType": "URL",
                    "url": sFolder + "nicht?AAA=XXX",
                    "navigationMode": "embedded",
                    "targetNavigationMode": "inplace",
                    "ui5ComponentName": "xxx"
                });
                res.always(done);
            });
        });
    });

    [
        window.location.origin + "/abc/def",
        window.location.origin + "/abc/../abc/def.json", // .. escape not possible
        "def/hij.json",
        "def/hij/aaa",
        "lmn/../def/hij.html",
        "/my/evil/../../abc/def"
    ].forEach(function (sFolder) {
      //own test
        test("Shell-runStandaloneApp resolution (allow good folder " + sFolder + ")", function (assert) {
            var done = assert.async();
            var oNt,
                res;
            window["sap-ushell-config"] = {
                // platform specific (ABAP) bootstrap configuration
                "services": {
                    "NavTargetResolution" : {
                        "adapter": {
                            config: {
                                applications: {}
                            }
                        },
                        "config" : {
                            "runStandaloneAppFolderWhitelist": {
                                "/abc/" : true,
                                "def/hij" : true,
                                "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/" : true
                            }
                        }
                    }
                }
            };
            sap.ushell.bootstrap("local").then(function () {
                oNt = sap.ushell.Container.getService("NavTargetResolution");
                res = oNt.resolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=" + encodeURIComponent(sFolder) + "&AAA=XXX");
                deepEqual(evalNow(res), {
                    "additionalInformation": "SAPUI5.Component=xxx",
                    "applicationType": "URL",
                    "url": sFolder + "?AAA=XXX",
                    "navigationMode": "embedded",
                    "targetNavigationMode": "inplace",
                    "ui5ComponentName": "xxx"
                });
                res.always(done);
            });
        });
    });

    //own test
    [
        window.location.origin + "/abc",
        window.location.origin + "/abc/../def", // .. escape not possible
        window.location.origin + "/ABC/def",   // case sensitive
        window.location.origin + "/my/evil/folder/abc/und", // legal deep inside
        "/abc",
        "/abc/../def", // .. escape not possible
        "/ABC/def",   // case sensitive
        "/my/evil/folder/abc/und" // legal deep inside
    ].forEach(function (sFolder) {
      //own test
        test("Shell-runStandaloneApp resolution (prevent bad folder " + sFolder + ")", function (assert) {
            var done = assert.async();
            var oNt,
                res,
                sMsg;

            window["sap-ushell-config"] = {
                // platform specific (ABAP) bootstrap configuration
                "services": {
                    "NavTargetResolution" : {
                        "adapter": {
                            config: {
                                applications: {}
                            }
                        },
                        "config" : {
                            "runStandaloneAppFolderWhitelist": {
                                "/abc/" : true,
                                "/ABC/" : false,
                                "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/" : true
                            }
                        }
                    }
                }
            };
            sap.ushell.bootstrap("local").then(function () {
                oNt = sap.ushell.Container.getService("NavTargetResolution");
                res = oNt.resolveHashFragment("#Shell-runStandaloneApp?sap-ushell-SAPUI5.Component=xxx&sap-ushell-url=" + encodeURIComponent(sFolder) + "nicht&AAA=XXX");
                sMsg = testFailed(res);
                deepEqual(sMsg, "URL is not resolvable", "correct error message");
                res.always(done);
            });
        });
    });

    test("Test - postProcess resolutionResults hook hook modifies response", function (assert) {
        var done = assert.async();
        var oNt,
            obj,
            res;
        sap.ushell.bootstrap("local").then(function () {
            var oAdapter = {
                processPostResolution : function(a,b) {
                    return new jQuery.Deferred().resolve({ "url": "andnowforsomethingcompletelydifferent", "applicationType": "SAPUI5"} ).promise();
                }
            };
            var oPostFilterSpy = sinon.spy(oAdapter, "processPostResolution");
            oNt = new NavTargetResolution(oAdapter, undefined, undefined, window["sap-ushell-config"].services.NavTargetResolution);
            oNt.resolveHashFragment("#Test-clear");
            obj = { url : "ABC", additionalInformation : "JOJO", navigationMode: "something" , "sap.ushell.runtime" : { "appName" : "abc"}};
            window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify(obj);
            res = oNt.resolveHashFragment("#Test-local1");
            res.done(function (res2) {
                ok(oPostFilterSpy.called, "postFilter Called");
                deepEqual(res2, {
                    "applicationType": "URL",
                    "navigationMode": "newWindow",
                    "targetNavigationMode": "explace",
                    "url": "andnowforsomethingcompletelydifferent"
                }, "expected modified result");
                done();
            }).fail(function() {
                ok(false, "should not get here");
                done();
            });

        });
    });

    test("Test - processPostResolution resolutionResults can convert success to failure", function (assert) {
        var done = assert.async();
        var oNt,
            obj,
            res;
        sap.ushell.bootstrap("local").then(function () {
            var oAdapter = {
                processPostResolution : function(a,b) {
                    return new jQuery.Deferred().reject("Oh No");
                }
            };
            var oPostFilterSpy = sinon.spy(oAdapter, "processPostResolution");
            oNt = new NavTargetResolution(oAdapter, undefined, undefined, window["sap-ushell-config"].services.NavTargetResolution);
            oNt.resolveHashFragment("#Test-clear");
            obj = { url : "ABC", additionalInformation : "JOJO", navigationMode: "something" , "sap.ushell.runtime" : { "appName" : "abc"}};
            window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify(obj);
            //sap.ushell.adapters.local.NavTargetResolutionAdapter.prototype.postFilterResolutionResult = o.postFilterResolutionResult.bind(o);
            res = oNt.resolveHashFragment("#Test-local1");
            res.done(function (res2) {
                ok(false, "should not get here");
            }).fail(function(sMsg) {
                equal(sMsg, "Oh No", "correct error message");
                ok(oPostFilterSpy.called, "postFilter Called");
                oPostFilterSpy.args[1][1].done(function(res3) {
                    deepEqual(res3, obj, " initial resolution");
                    done();
                });
            });

        });
    });

    test("Test - processPostResolution resolutionResults can convert failure to success", function (assert) {
        var done = assert.async();
        var oNt,
            obj,
            res;
        sap.ushell.bootstrap("local").then(function () {
            var oAdapter = {
                processPostResolution : function(a,b) {
                    var a = new jQuery.Deferred();
                    b.fail(function (sMessage) {
                        a.resolve({ "url": "andnowforsomethingcompletelydifferent", "applicationType": "SAPUI5"} ).promise();
                    });
                    return a.promise();
                }
            };
            var oPostFilterSpy = sinon.spy(oAdapter, "processPostResolution");
            oNt = new NavTargetResolution(oAdapter, undefined, undefined,undefined); //
            oNt.resolveHashFragment("#Test-clear");
            obj = { url : "ABC", additionalInformation : "JOJO", navigationMode: "something" , "sap.ushell.runtime" : { "appName" : "abc"}};
            window.localStorage["sap.ushell.#Test-local1"] = JSON.stringify(obj);
            res = oNt.resolveHashFragment("#Test-local1");
            res.done(function (res2) {
                ok(oPostFilterSpy.called, "postFilter Called");
                equal(oPostFilterSpy.args[1][0],"#Test-local1", "first arugment ok");
                equal(oPostFilterSpy.args[1][1].state(), "rejected", "original promise was rejected");
                deepEqual(res2, {
                    "applicationType": "URL",
                    "navigationMode": "newWindow",
                    "targetNavigationMode": "explace",
                    "url": "andnowforsomethingcompletelydifferent"
                }, "expected modified result");
                done();
            }).fail(function() {
                ok(false, "should not get here");
                done();
            });
        });
    });

    test("Test- empty hash default", function (assert) {
        var done = assert.async();
        var oNt,
            res;

        sap.ushell.bootstrap("local").then(function () {
            oNt = sap.ushell.Container.getService("NavTargetResolution");
            res = oNt.resolveHashFragment("");
            deepEqual(undefined, evalNow(res));
            res.always(done);
        });
    });

    test("Test register ok", function (assert) {
        var done = assert.async();
        var oNt,
            obj;
        sap.ushell.bootstrap("local").then(function () {
            oNt = sap.ushell.Container.getService("NavTargetResolution");
            obj = { name : "ResolverA",
                    resolveHashFragment : function () { return {}; },
                    isApplicable : function () { return false; }};
            deepEqual(true, oNt.registerCustomResolver(obj));
            done();
        });
    });

    test("Test register no name", function (assert) {
        var done = assert.async();
        var oNt,
            obj;
        sap.ushell.bootstrap("local").then(function () {
            oNt = sap.ushell.Container.getService("NavTargetResolution");
            obj = { //name : "ResolverA",
                resolveHashFragment : function () { return {}; },
                isApplicable : function () { return false; }
            };
            deepEqual(false, oNt.registerCustomResolver(obj));
            done();
        });
    });

    test("Test register no isApplicable", function (assert) {
        var done = assert.async();
        var oNt,
            obj;
        sap.ushell.bootstrap("local").then(function () {
            oNt = sap.ushell.Container.getService("NavTargetResolution");
            obj = {
                name : "ResolverA",
                resolveHashFragment : function () { return {}; }
                //isApplicable : function () { return false; }
            };
            deepEqual(false, oNt.registerCustomResolver(obj));
            done();
        });
    });

    test("Test register wrong resolveHashFragment", function (assert) {
        var done = assert.async();
        var oNt,
            obj;
        sap.ushell.bootstrap("local").then(function () {
            oNt = sap.ushell.Container.getService("NavTargetResolution");
            oNt.resolveHashFragment("#Test-clear");
            obj = {
                name : "ResolverA",
                resolveHashFragment : {},
                isApplicable : function () {
                    return false;
                }
            };
            deepEqual(false, oNt.registerCustomResolver(obj));
            done();
        });
    });

    test("getCurrentResolution", function (assert) {
        var done = assert.async();
        var oResolution = {},
            oNTRAdapter = {
                resolveHashFragment: function () {
                    var oDeferred = new jQuery.Deferred();

                    oDeferred.resolve(oResolution);
                    return oDeferred.promise();
                }
            };

        sap.ushell.bootstrap("local").then(function () {
            var oNavTargetResolutionService = new NavTargetResolution(oNTRAdapter);
            strictEqual(oNavTargetResolutionService.getCurrentResolution(), undefined,
            "undefined if no resolution performed");

            oNavTargetResolutionService.resolveHashFragment("#foo");
            strictEqual(oNavTargetResolutionService.getCurrentResolution(), oResolution,
                "returns result of previous resolve");
            done();
        });
    });

    module(
        "sap.ushell.services.NavTargetResolution.LocalResolver",
        {
            setup : function () {
                stop();
                // the config has to be reset after the test
                if (!sCachedConfig) {
                    sCachedConfig = JSON.stringify(window["sap-ushell-config"]);
                }

                window["sap-ushell-config"] = {
                    services: {
                        NavTargetResolution: {
                            adapter : {
                                config: {
                                    applications: {}
                                },
                                module: "sap.ushell.unittest.NavTargetResolutionAdapterStub"
                            },
                            config : {
                                resolveLocal : [ {
                                    "linkId" : "Rabbit-run",
                                    resolveTo : {
                                        additionalInformation : "SAPUI5.Component=Rabidrun",
                                        applicationType : "URL",
                                        url : "../more/than/that?fixed-param1=value1&array-param1=value1&array-param1=value2"
                                    }
                                }, {
                                    "linkId" : "Snake-bite",
                                    resolveTo : {
                                        additionalInformation : "SAPUI5.Component=BooAh",
                                        applicationType : "URL",
                                        url : "../con/stric/tor"
                                    }
                                }]
                            }
                        }
                    }
                };
                sap.ushell.bootstrap("local").then(start);
            },
            /**
             * This method is called after each test. Add every restoration code
             * here.
             */
            teardown : function () {
                window["sap-ushell-config"] = JSON.parse(sCachedConfig);
                delete sap.ushell.Container;
                testUtils.restoreSpies(
                    jQuery.sap.log.warning,
                    jQuery.sap.log.error
                );
            }
        }
    );

    asyncTest("localResolve - multiple targets", function () {
        var res,
            oNavTargetResolutionService;

        // code under test
        theLastHashFragment = "notcalled";
        oNavTargetResolutionService = sap.ushell.Container.getService("NavTargetResolution");
        res = oNavTargetResolutionService.resolveHashFragment("#Rabbit-run");
        res.done(function (sArg) {
            start();
            equal(theLastHashFragment, "notcalled");
            equal(sArg.additionalInformation, "SAPUI5.Component=Rabidrun");
        }).fail(function (sMessage) {
            start();
            ok(false, "service invocation failed: " + sMessage);
        });
        // code under test
        theLastHashFragment = "notcalled";
        oNavTargetResolutionService = sap.ushell.Container.getService("NavTargetResolution");
        res = oNavTargetResolutionService.resolveHashFragment("#Snake-bite");
        stop();
        res.done(function (sArg) {
            start();
            equal(theLastHashFragment, "notcalled");
            equal(sArg.additionalInformation, "SAPUI5.Component=BooAh");
        }).fail(function (sMessage) {
            start();
            ok(false, "service invocation failed: " + sMessage);
        });
        // code under test
        oNavTargetResolutionService = sap.ushell.Container.getService("NavTargetResolution");
        res = oNavTargetResolutionService.resolveHashFragment("#Some-action");
        stop();
        res.done(function (sArg) {
            start();
            equal(theLastHashFragment, "#Some-action");
            equal(sArg, "resolvedTo:#Some-action");
        }).fail(function (sMessage) {
            start();
            ok(false, "service invocation failed: " + sMessage);
        });
    });

    [
        {
            "desc" : "middle",
            "hash" : "#Rabbit-run?A=B&sap-ushell-enc-test=A%2520B%2520C&C=D",
            "strippedHash" : "#Rabbit-run?A=B&C=D",
            "url" : "../more/than/that?fixed-param1=value1&array-param1=value1&array-param1=value2&A=B&C=D"
        },
        {
            "desc" : "single",
            "hash" : "#Rabbit-run?sap-ushell-enc-test=A%2520B%2520C",
            "strippedHash" : "#Rabbit-run",
            "url" : "../more/than/that?fixed-param1=value1&array-param1=value1&array-param1=value2"
        },
        {
            "desc" : "end",
            "hash" : "#Rabbit-run?A=B&sap-ushell-enc-test=A%2520B%2520C",
            "strippedHash" : "#Rabbit-run?A=B",
            "url" : "../more/than/that?fixed-param1=value1&array-param1=value1&array-param1=value2&A=B"
        },
        {
            "desc" : "front",
            "hash" : "#Rabbit-run?sap-ushell-enc-test=A%2520B%2520C&C=D",
            "strippedHash" : "#Rabbit-run?C=D",
            "url" : "../more/than/that?fixed-param1=value1&array-param1=value1&array-param1=value2&C=D"
        }
    ].forEach(function(oFixture) {
        test("Resolution, error message and empty result if sap-ushell-enc-test present and malformatted " + oFixture.desc, function () {
            var oNt,
                res,
                spyInvokeResolveHashChain = sinon.spy(sap.ushell.Container.getService("NavTargetResolution"),"_invokeResolveHashChain"),
                spyMessageService = sinon.stub(sap.ushell.Container.getService('Message'), "error");

            oNt = sap.ushell.Container.getService("NavTargetResolution");
            res = oNt.resolveHashFragment(oFixture.hash);
            equal(spyInvokeResolveHashChain.args[0][0], oFixture.strippedHash, "correct stripped hash");
            res = evalNow(res);
            deepEqual(res, {
                "additionalInformation": "SAPUI5.Component=Rabidrun",
                "applicationType": "URL",
                "url": oFixture.url,
                "navigationMode": "embedded",
                "targetNavigationMode": "inplace",
                "ui5ComponentName": "Rabidrun"
            }, " correct result");
            ok(spyMessageService.calledWith("This navigation is flagged as erroneous because" +
                                " (likely the calling procedure) generated a wrong encoded hash." +
                                " Please track down the encoding error and make sure to use the CrossApplicationNavigation service for navigation.",
                                    "Navigation encoding wrong"), "Error method was called as expected");
            spyMessageService.restore();
        });
    });

    test("Resolution, correct sap-ushell-enc-test is removed from url parameters and normal processing ensues", function () {
        var oNt,
            res;

        oNt = sap.ushell.Container.getService("NavTargetResolution");
        res = oNt.resolveHashFragment("#Rabbit-run?A=B&sap-ushell-enc-test=A%20B%2520C&C=D");
        res = evalNow(res);
        deepEqual(res, {
            "additionalInformation": "SAPUI5.Component=Rabidrun",
            "applicationType": "URL",
            "url": "../more/than/that?fixed-param1=value1&array-param1=value1&array-param1=value2&A=B&C=D",
            "navigationMode": "embedded",
            "targetNavigationMode": "inplace",
            "ui5ComponentName" : "Rabidrun"
        }, "correct result");
    });


    asyncTest("resolution with Adapter parameter expansion", function () {
        var res,
            oNavTargetResolutionService,
            oAppState,
            sKey,
            sInputHash,
            oDummyAdapter;
        oDummyAdapter = {
            resolveHashFragment : function (sHash) {
                var deferred = new jQuery.Deferred();
                sInputHash = sHash;
                deferred.resolve({ url : sHash, additionalInformation : "SAPUI5.Component=FunAtWork", text : "A text"});
                return deferred.promise();
            }
        };
        oNavTargetResolutionService = new NavTargetResolution(oDummyAdapter);
        res = oNavTargetResolutionService.resolveHashFragment("#Rabbit-run?AAA=33&ZZZ=44&sap-intent-param=Key&FFF=33");
        res.done(function (sArg) {
            start();
            equal(sInputHash, "#Rabbit-run?AAA=33&ZZZ=44&sap-intent-param=Key&FFF=33", "no expansion");
            equal(sArg.additionalInformation, "SAPUI5.Component=FunAtWork", "URL Unexpanded");
            equal(sArg.text, "A text", "text ok");
        }).fail(function (sMessage) {
            start();
            ok(false, "service invocation failed: " + sMessage);
        });
        oAppState = sap.ushell.Container.getService("AppState").createEmptyAppState(new sap.ui.core.UIComponent(), false /* bTransient */);
        sKey = oAppState.getKey();
        oAppState.setData("xxx=1234&Aaa=444");
        stop();
        oAppState.save().done(function () {
            var res;
            WindowAdapter.prototype.data._clear(); //remove app state from window object
            res = oNavTargetResolutionService.resolveHashFragment("#Rabbit-run?AAA=33&ZZZ=44&sap-intent-param=" + sKey + "&FFF=33");
            res.done(function (sArg) {
                start();
                equal(sInputHash, "#Rabbit-run?AAA=33&Aaa=444&FFF=33&ZZZ=44&xxx=1234", "url expanded");
                equal(sArg.additionalInformation, "SAPUI5.Component=FunAtWork", "additional info ok");
            }).fail(function (sMessage) {
                start();
                ok(false, "service invocation failed: " + sMessage);
            });
        });
        ok(true, "reached end of test");
    });

    [
        {
            testDescription: "ClientSideTargetResolution is enabled",
            bClientSideTargetResolutionEnabled: true,
            expectedAdapterCalls: 0,
            expectedCSTRCalls: 1
        },
        {
            testDescription: "ClientSideTargetResolution is disabled",
            bClientSideTargetResolutionEnabled: false,
            expectedAdapterCalls: 1,
            expectedCSTRCalls: 0
        }
    ].forEach(function (oFixture) {
        asyncTest("getDistinctSemanticObjects: calls methods from the right service when " + oFixture.testDescription, function () {
            var oCSTRGetDistinctSemanticObjectsStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
                oAdapterGetDistinctSemanticObjects = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
                oAdapterFake = {
                    getDistinctSemanticObjects: oAdapterGetDistinctSemanticObjects
                },
                oNavTargetResolution = new NavTargetResolution(
                    oAdapterFake,
                    undefined,
                    undefined,
                    getClientSideTargetResolutionConfig(oFixture.bClientSideTargetResolutionEnabled)
                );

            sinon.stub(sap.ushell.Container, "getService")
                .withArgs("ClientSideTargetResolution").returns({
                    getDistinctSemanticObjects: oCSTRGetDistinctSemanticObjectsStub
                });

            oNavTargetResolution.getDistinctSemanticObjects()
                .done(function () {
                    ok(true, "promise was resolved");

                    strictEqual(oCSTRGetDistinctSemanticObjectsStub.getCalls().length, oFixture.expectedCSTRCalls,
                        "ClientSideTargetResolution#getDistinctSemanticObjects was called once");

                    strictEqual(oAdapterGetDistinctSemanticObjects.getCalls().length, oFixture.expectedAdapterCalls,
                        "NavTargetResolutionAdapter#getDistinctSemanticObjects was not called");
                })
                .fail(function () {
                    ok(false, "promise was resolved");
                })
                .always(function () {
                    start();
                });
        });
    });

    asyncTest("getDistinctSemanticObjects: does not require ClientSideTargetResolution if it is disabled", function () {
        var oNavTargetResolution = new NavTargetResolution({}, // an adapter without methods
            undefined,
            undefined,
            getClientSideTargetResolutionConfig(false /* ClientSideTargetResolution disabled */ )
        );

        sinon.spy(sap.ushell.Container, "getService");
        sinon.stub(jQuery.sap.log, "error"); // do not log to the console during the test

        oNavTargetResolution.getDistinctSemanticObjects()
            .always(function () {
                strictEqual(
                    sap.ushell.Container.getService.calledWith("ClientSideTargetResolution"),
                    false,
                    "sap.ushell.Container.getService('ClientSideTargetResolution') was not called"
                );

                start();
            });


    });

    asyncTest("getDistinctSemanticObjects: logs an error when client side target resolution is disabled and method from the adapter is not implemented", function () {
        var oNavTargetResolution = new NavTargetResolution(
                {}, // an adapter without methods
                undefined,
                undefined,
                getClientSideTargetResolutionConfig(false /* ClientSideTargetResolution disabled */)
            );

        sinon.stub(jQuery.sap.log, "error");

        oNavTargetResolution.getDistinctSemanticObjects()
            .done(function () {
                ok(false, "promise was rejected");
            })
            .fail(function () {
                var aCalls;

                ok(true, "promise was rejected");

                aCalls = jQuery.sap.log.error.getCalls();

                strictEqual(aCalls.length, 1, "jQuery.sap.log.error was called once");

                if (aCalls.length === 1) {
                    deepEqual(
                        aCalls[0].args, [
                            "Cannot execute getDistinctSemanticObjects method",
                            "ClientSideTargetResolution must be enabled or NavTargetResolutionAdapter must implement getDistinctSemanticObjects method",
                            "sap.ushell.services.NavTargetResolution"
                        ],
                        "jQuery.sap.log.error was called with the expected arguments"
                    );
                }

            })
            .always(function () {
                start();
            });
    });

    asyncTest("getLinks: uses ClientSideTargetResolution when enabled by configuration", function () {
        var oClientSideGetLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
            oAdapterGetSemanticObjectLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
            oAdapterGetLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
            oAdapterFake = {
                getSemanticObjectLinks: oAdapterGetSemanticObjectLinksStub,
                getLinks: oAdapterGetLinksStub
            },
            oGetLinksArgs = {
                semanticObject: "Object",
                params: [],
                ignoreFormFactor: false
            },
            oNavTargetResolution = new NavTargetResolution(oAdapterFake, undefined, undefined, getClientSideTargetResolutionConfig());

        sinon.stub(sap.ushell.Container, "getService")
            .withArgs("ClientSideTargetResolution").returns({
                getLinks: oClientSideGetLinksStub
            })
            .withArgs("URLParsing").returns({
                parseShellHash: sinon.stub().returns({params: []})
            })
            .withArgs("ShellNavigation").returns({
                hrefForExternal: sinon.stub().returns(new jQuery.Deferred().resolve({}).promise())
            });

        oNavTargetResolution.getLinks.call(oNavTargetResolution, oGetLinksArgs)
            .done(function () {
                ok(true, "promise was resolved");

                strictEqual(oClientSideGetLinksStub.getCalls().length, 1,
                    "ClientSideTargetResolution#getLinks was called once");

                deepEqual(
                    oClientSideGetLinksStub.getCall(0).args, [oGetLinksArgs],
                    "ClientSideTargetResolution#getLinks was called with expected arguments"
                );

                strictEqual(oAdapterGetSemanticObjectLinksStub.getCalls().length, 0,
                    "NavTargetResolutionAdapter#getSemanticObjectLinks was not called");

                strictEqual(oAdapterGetLinksStub.getCalls().length, 0,
                    "NavTargetResolutionAdapter#getLinks was not called");
            })
            .fail(function () {
                ok(false, "promise was resolved");
            })
            .always(function () {
                start();
            });
    });

    asyncTest("getLinks: uses adapter getLinks method when ClientSideTargetResolution is disabled by configuration", function () {
        var oClientSideGetLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
            oAdapterGetSemanticObjectLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
            oAdapterGetLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
            oAdapterFake = {
                getSemanticObjectLinks: oAdapterGetSemanticObjectLinksStub,
                getLinks: oAdapterGetLinksStub
            },
            oGetLinksArgs = {
                semanticObject: "Object",
                params: [],
                ignoreFormFactor: false
            },
            oNavTargetResolution = new NavTargetResolution(
                oAdapterFake,
                undefined,
                undefined,
                getClientSideTargetResolutionConfig(false)
            );

        sinon.stub(sap.ushell.Container, "getService")
            .withArgs("ClientSideTargetResolution").returns({
                getLinks: oClientSideGetLinksStub
            })
            .withArgs("URLParsing").returns({
                parseShellHash: sinon.stub().returns({params: []})
            })
            .withArgs("ShellNavigation").returns({
                hrefForExternal: sinon.stub().returns(new jQuery.Deferred().resolve({}).promise())
            });

        oNavTargetResolution.getLinks.call(oNavTargetResolution, oGetLinksArgs)
            .done(function () {
                ok(true, "promise was resolved");

                strictEqual(oClientSideGetLinksStub.getCalls().length, 0,
                    "ClientSideTargetResolution#getLinks was called once");

                strictEqual(oAdapterGetSemanticObjectLinksStub.getCalls().length, 0,
                    "NavTargetResolutionAdapter#getSemanticObjectLinks was not called");

                strictEqual(oAdapterGetLinksStub.getCalls().length, 1,
                    "NavTargetResolutionAdapter#getLinks was not called");
            })
            .fail(function () {
                ok(false, "promise was resolved");
            })
            .always(function () {
                start();
            });
    });

    [
        {
            testDescription: "undefined parameter options",
            oParamsOptions: undefined,
            expectedWarningCall: false
        },
        {
            testDescription: "parameter options as empty array",
            oParamsOptions: [],
            expectedWarningCall: false
        },
        {
            testDescription: "parameter options in array",
            oParamsOptions: [
                { name: "param1", options: { someOption1: true } },
                { name: "param2", options: { someOption2: true } }
            ],
            expectedWarningCall: true
        }
    ].forEach(function (oFixture) {

        asyncTest("getLinks: logs a warning when ClientSideTargetResolution is disabled by configuration and " + oFixture.testDescription + " are specified in getLinks", function () {
            var oClientSideGetLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
                oAdapterGetSemanticObjectLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
                oAdapterGetLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
                oAdapterFake = {
                    getSemanticObjectLinks: oAdapterGetSemanticObjectLinksStub,
                    getLinks: oAdapterGetLinksStub
                },
                oGetLinksArgs = {
                    semanticObject: "Object",
                    params: [],
                    paramsOptions: oFixture.oParamsOptions,
                    ignoreFormFactor: false
                },
                oNavTargetResolution = new NavTargetResolution(
                    oAdapterFake,
                    undefined,
                    undefined,
                    getClientSideTargetResolutionConfig(false)
                );

            sinon.stub(sap.ushell.Container, "getService")
                .withArgs("ClientSideTargetResolution").returns({
                    getLinks: oClientSideGetLinksStub
                })
                .withArgs("URLParsing").returns({
                    parseShellHash: sinon.stub().returns({params: []})
                })
                .withArgs("ShellNavigation").returns({
                    hrefForExternal: sinon.stub().returns(new jQuery.Deferred().resolve({}).promise())
                });

            sinon.stub(jQuery.sap.log, "warning");

            oNavTargetResolution.getLinks.call(oNavTargetResolution, oGetLinksArgs)
                .always(function () {
                    if (oFixture.expectedWarningCall) {
                        strictEqual(jQuery.sap.log.warning.callCount, 1,
                            "jQuery.sap.log.warning was called one time");

                        strictEqual(
                            jQuery.sap.log.warning.getCall(0).args[0],
                            "Parameter options supplied to #getLinks will be ignored because FLP is not configured to use sap.ushell.services.ClientSideTargetResolution for target resolution",
                            "jQuery.sap.log.warning was called with the expected first argument"
                        );

                        if (oFixture.oParamsOptions) {
                            oFixture.oParamsOptions.forEach(function (oOptions) {
                                Object.keys(oOptions.options).forEach(function (sOptionName) {
                                    ok(
                                        (new RegExp(sOptionName)).test(
                                            jQuery.sap.log.warning.getCall(0).args[1]
                                        ),
                                        sOptionName + " option was reported by jQuery.sap.log.warning (second argument)"
                                    );
                                });
                            });
                        }

                        strictEqual(
                            jQuery.sap.log.warning.getCall(0).args[2],
                            "sap.ushell.services.NavTargetResolution",
                            "jQuery.sap.log.warning was called with the expected third argument"
                        );
                    } else {
                        strictEqual(jQuery.sap.log.warning.callCount, 0,
                            "jQuery.sap.log.warning was not called");
                    }
                    start();
                });
        });
    });

    asyncTest("getLinks: uses adapter getSemanticObjectLinks method when ClientSideTargetResolution is disabled by configuration and getLinks is not implemented in adapter", function () {
        var oClientSideGetLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
            oAdapterGetSemanticObjectLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
            oAdapterGetLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
            oAdapterFake = {
                getSemanticObjectLinks: oAdapterGetSemanticObjectLinksStub
                // getLinks is not implemented in this adapter
            },
            oGetLinksArgs = {
                semanticObject: "Object",
                params: [],
                ignoreFormFactor: false
            },
            oNavTargetResolution = new NavTargetResolution(
                oAdapterFake,
                undefined,
                undefined,
                getClientSideTargetResolutionConfig(false)
            );
        sinon.stub().returns(new jQuery.Deferred().resolve([]).promise())
        sinon.stub(jQuery.sap.log, "warning");

        sinon.stub(sap.ushell.Container, "getService")
            .withArgs("ClientSideTargetResolution").returns({
                getLinks: oClientSideGetLinksStub
            })
            .withArgs("URLParsing").returns({
                parseShellHash: sinon.stub().returns({params: []})
            })
            .withArgs("ShellNavigation").returns({
                hrefForExternal: sinon.stub().returns(new jQuery.Deferred().resolve({}).promise())
            });

        oNavTargetResolution.getLinks.call(oNavTargetResolution, oGetLinksArgs)
            .done(function () {
                ok(true, "promise was resolved");

                strictEqual(oClientSideGetLinksStub.getCalls().length, 0,
                    "ClientSideTargetResolution#getLinks was called once");

                strictEqual(oAdapterGetSemanticObjectLinksStub.getCalls().length, 1,
                    "NavTargetResolutionAdapter#getSemanticObjectLinks was not called");

                strictEqual(jQuery.sap.log.warning.getCalls().length, 0, "jQuery.sap.log.warning was called once");
            })
            .fail(function () {
                ok(false, "promise was resolved");
            })
            .always(function () {
                start();
            });
    });

    [
        undefined,
        "actionValue",
        null
    ].forEach(function (sFixture) {
        asyncTest("getLinks: uses adapter getSemanticObjectLinks method and warns (because of action parameter) when ClientSideTargetResolution is disabled by configuration, getLinks is not implemented in adapter and action is " + Object.prototype.toString.apply(sFixture), function () {
            var oClientSideGetLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
                oAdapterGetSemanticObjectLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
                //oAdapterGetLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise()),
                oAdapterFake = {
                    getSemanticObjectLinks: oAdapterGetSemanticObjectLinksStub
                    // getLinks is not implemented in this adapter
                },
                oGetLinksArgs = {
                    semanticObject: "Object",
                    params: [],
                    ignoreFormFactor: false,
                    action: sFixture
                },
                oNavTargetResolution = new NavTargetResolution(
                    oAdapterFake,
                    undefined,
                    undefined,
                    getClientSideTargetResolutionConfig(false)
                );
            sinon.stub(jQuery.sap.log, "warning");

            sinon.stub(sap.ushell.Container, "getService")
                .withArgs("ClientSideTargetResolution").returns({
                    getLinks: oClientSideGetLinksStub
                })
                .withArgs("URLParsing").returns({
                    parseShellHash: sinon.stub().returns({params: []})
                })
                .withArgs("ShellNavigation").returns({
                    hrefForExternal: sinon.stub().returns(new jQuery.Deferred().resolve({}).promise())
                });

            oNavTargetResolution.getLinks.call(oNavTargetResolution, oGetLinksArgs)
                .done(function () {
                    ok(true, "promise was resolved");

                    strictEqual(oClientSideGetLinksStub.getCalls().length, 0,
                        "ClientSideTargetResolution#getLinks was called once");

                    strictEqual(oAdapterGetSemanticObjectLinksStub.getCalls().length, 1,
                        "NavTargetResolutionAdapter#getSemanticObjectLinks was not called");

                    strictEqual(jQuery.sap.log.warning.getCalls().length, 1, "jQuery.sap.log.warning was called once");

                    deepEqual(jQuery.sap.log.warning.getCall(0).args, [
                        "A problem occurred while determining the resolver for getLinks",
                        "the action argument was given, however, NavTargetResolutionAdapter does not implement getLinks method. Action will be ignored.",
                        "sap.ushell.services.NavTargetResolution"
                    ], "jQuery.sap.log.warning was called with the expected arguments");
                })
                .fail(function () {
                    ok(false, "promise was resolved");
                })
                .always(function () {
                    start();
                });
        });


    });

    [
        undefined,
        {
            A: "B",
            C: ["e'e", "j j"]
        }
    ].forEach(function(oFixture) {
        test("getLinks" + JSON.stringify(oFixture), function () {
            var oNavTargetResolution,
                oNavTargetResolutionAdapter =  {
                    getSemanticObjectLinks: sinon.stub().returns(((new jQuery.Deferred()).resolve()).promise()),
                    resolveHashFragment: sinon.stub()
                },
                mParameters = oFixture;

            // prepare test
            oNavTargetResolution = new NavTargetResolution(oNavTargetResolutionAdapter);

            // code under test
            throws(function () {
                oNavTargetResolution.getLinks({ semanticObject: "Action?foo" });
            }, /Parameter must not be part of semantic object/);

            oNavTargetResolution.getLinks({
                semanticObject: "Action",
                params: mParameters,
                ignoreFormFactor: true
            });

            // test
            ok(oNavTargetResolutionAdapter.getSemanticObjectLinks.calledOnce);
            ok(oNavTargetResolutionAdapter.getSemanticObjectLinks.calledWithExactly("Action", mParameters, true));
        });
    });

    [ undefined, {
        A: "B",
        C: ["e'e", "j j"]
    }].forEach(function (oFixture) {
        test("getLinks with appState" + JSON.stringify(oFixture), function () {
            var oNavTargetResolution,
                oExpectedParams,
                oNavTargetResolutionAdapter =  {
                    getSemanticObjectLinks: sinon.stub().returns(((new jQuery.Deferred()).resolve()).promise()),
                    resolveHashFragment: sinon.stub()
                },
                mParameters = oFixture;
            // prepare test
            oNavTargetResolution = new NavTargetResolution(oNavTargetResolutionAdapter);

            // code under test
            throws(function () {
                oNavTargetResolution.getLinks({ semanticObject: "Action?foo" });
            }, /Parameter must not be part of semantic object/);
            oNavTargetResolution.getLinks({
                semanticObject: "Action",
                params: mParameters,
                ignoreFormFactor: true,
                ui5Component: undefined,
                appStateKey: "AKEY"
            });

            oExpectedParams = oFixture || {};
            oExpectedParams["sap-xapp-state"] = "AKEY";
            // test
            ok(oNavTargetResolutionAdapter.getSemanticObjectLinks.calledOnce);
            ok(oNavTargetResolutionAdapter.getSemanticObjectLinks
                .calledWithExactly("Action", oExpectedParams, true));
        });
    });

    [{
        A: "B",
        C: ["e'e", "j j",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894",
            "A0123424124214123489701247120934871230948712309487123094871209348712309487123089471230894"
            ]
    }].forEach(function (oFixture) {
        asyncTest("getLinks with appState and long url" + JSON.stringify(oFixture), function () {
            var oNavTargetResolution,
                oExpectedParams,
                oPromise,
                oNavTargetResolutionAdapter =  {
                    getSemanticObjectLinks: sinon.stub().returns(((new jQuery.Deferred()).resolve()).promise()),
                    resolveHashFragment: sinon.stub()
                },
                mParameters = oFixture;
            // prepare test
            oNavTargetResolution = new NavTargetResolution(oNavTargetResolutionAdapter);
            // code under test
            oPromise = oNavTargetResolution.getLinks({
                semanticObject: "Action",
                params: mParameters,
                ignoreFormFactor: true,
                ui5Component: undefined,
                appStateKey: "AKEY"
            });
            oPromise.fail(function () {
                start();
                ok(false, "should succeed!");
            }).done(function () {
                start();
                oExpectedParams = oFixture || {};
                oExpectedParams["sap-xapp-state"] = "AKEY";
                // test
                ok(oNavTargetResolutionAdapter.getSemanticObjectLinks.calledOnce);
                equal(oNavTargetResolutionAdapter.getSemanticObjectLinks.args[0][0], "Action", "first arg ok");
                ok(oNavTargetResolutionAdapter.getSemanticObjectLinks.args[0][1]["sap-intent-param"] !== undefined, "shortening occurred");
                equal(oNavTargetResolutionAdapter.getSemanticObjectLinks.args[0][1]["sap-intent-param"].length, 1, "shortening occurred (key present)");
            });
            ok(true, "reached end");
        });
    });

    asyncTest("getLinks returns non-compacted intents when bCompactIntents is false", function () {
        var aVeryLongUrl = [],
            sVeryLongUrl,
            oNavTargetResolutionAdapter,
            oNavTargetResolution,
            oPromise,
            i,
            iVeryLongUrlLength;

        for (i = 0; i < I_LONG_HASH_LENGTH; i++) {
            aVeryLongUrl.push("param" + i + "=value" + i);
        }
        sVeryLongUrl = aVeryLongUrl.join("&");
        iVeryLongUrlLength = sVeryLongUrl.length + "#Object-action?".length;

        oNavTargetResolutionAdapter =  {
            getSemanticObjectLinks: sinon.stub().returns(((new jQuery.Deferred()).resolve([
                { text: "Title 1", intent: "#Object-action?" + sVeryLongUrl },
                { text: "Title 2", intent: "#Object-action?" + sVeryLongUrl },
                { text: "Title 3", intent: "#Object-action?" + sVeryLongUrl }
            ])).promise()),
            resolveHashFragment: sinon.stub()
        };
        oNavTargetResolution = new NavTargetResolution(oNavTargetResolutionAdapter);

        oPromise = oNavTargetResolution.getLinks({
            semanticObject: "Action",
            params: {},
            ignoreFormFactor: true,
            ui5Component: undefined,
            appStateKey: "AKEY",
            compactIntents: false
        }); // NOTE: no compaction
        oPromise.fail(function () {
            ok(false, "promise was resolved");
        }).done(function (aResults) {
            ok(true, "promise was resolved");

            strictEqual(aResults.length, 3, "getSemanticObjectLinks returned 3 results");

            for (i = 0; i < aResults.length; i++) {
                strictEqual(aResults[i].intent.length, iVeryLongUrlLength, "intent in result " + i + " was not compacted");
            }
        }).always(function () { start(); });

    });

    asyncTest("getLinks returns compacted intents when bCompactIntents is true", function () {
        var aVeryLongUrl = [],
            sVeryLongUrl,
            oNavTargetResolutionAdapter,
            oNavTargetResolution,
            oPromise,
            i;

        for (i = 0; i < I_LONG_HASH_LENGTH; i++) {
            aVeryLongUrl.push("param" + i + "=value" + i);
        }
        sVeryLongUrl = aVeryLongUrl.join("&");

        oNavTargetResolutionAdapter =  {
            getSemanticObjectLinks: sinon.stub().returns(((new jQuery.Deferred()).resolve([
                { text: "Title 1", intent: "#Object-action?" + sVeryLongUrl },
                { text: "Title 2", intent: "#Object-action?" + sVeryLongUrl },
                { text: "Title 3", intent: "#Object-action?" + sVeryLongUrl }
            ])).promise()),
            resolveHashFragment: sinon.stub()
        };
        oNavTargetResolution = new NavTargetResolution(oNavTargetResolutionAdapter);

        oPromise = oNavTargetResolution.getLinks({
            semanticObject: "Action",
            params: {},
            ignoreFormFactor: true,
            ui5Component: undefined,
            appStateKey: "AKEY",
            compactIntents: true
        }); // NOTE: compaction
        oPromise.fail(function () {
            ok(false, "promise was resolved");
        }).done(function (aResults) {
            ok(true, "promise was resolved");

            strictEqual(aResults.length, 3, "getSemanticObjectLinks returned 3 results");

            for (i = 0; i < aResults.length; i++) {
                ok(aResults[i].intent.length <= I_COMPACT_HASH_LENGTH_MAX , "intent in result " + i + " is shorter than " + I_COMPACT_HASH_LENGTH_MAX + " characters");
                ok(aResults[i].intent.indexOf("sap-intent-param") > 0, "sap-intent-param was found in the shortened intent of result " + i);
                ok(aResults[i].intent.match(/^#.+-.+[?].*/), "shortened intent " + aResults[i].intent + " has valid format");
            }
        }).always(function () { start(); });

    });

    asyncTest("getLinks still resolves promise when bCompactIntents is true and ShellNavigation#compactParams fails", function () {
        var aVeryLongUrl = [],
            sVeryLongUrl,
            oNavTargetResolutionAdapter,
            oNavTargetResolution,
            oPromise,
            i,
            iVeryLongUrlLength;

        sinon.stub(jQuery.sap.log, "warning");
        sinon.stub(jQuery.sap.log, "error");

        for (i = 0; i < I_LONG_HASH_LENGTH; i++) {
            aVeryLongUrl.push("param" + i + "=value" + i);
        }
        sVeryLongUrl = aVeryLongUrl.join("&");
        iVeryLongUrlLength = sVeryLongUrl.length + "#Object-action?".length;

        oNavTargetResolutionAdapter =  {
            getSemanticObjectLinks: sinon.stub().returns(((new jQuery.Deferred()).resolve([
                { text: "Title 1", intent: "#Object-action?" + sVeryLongUrl },
                { text: "Title 2", intent: "#Object-action?" + sVeryLongUrl },
                { text: "Title 3", intent: "#Object-action?" + sVeryLongUrl }
            ])).promise()),
            resolveHashFragment: sinon.stub()
        };
        oNavTargetResolution = new NavTargetResolution(oNavTargetResolutionAdapter);

        sinon.stub(sap.ushell.Container, "getService")
            .withArgs("URLParsing").returns({
                parseShellHash: sinon.stub().returns({
                    semanticObject: "Object",
                    action: "action"
                })
            })
            .withArgs("ShellNavigation").returns({
                hrefForExternal: sinon.stub().returns(
                    new jQuery.Deferred().resolve({hash: "#Action-dummyAction?sap-xapp-state=AKEY", params: undefined, skippedParams: undefined}).promise()),
                compactParams: sinon.stub().returns(new jQuery.Deferred().reject("Error occurred").promise()) // NOTE: fails!
            });

        oPromise = oNavTargetResolution.getLinks({
            semanticObject: "Action",
            params: {},
            ignoreFormFactor: true,
            ui5Component: undefined,
            appStateKey: "AKEY",
            compactIntents: true  // NOTE: compaction
        });

        oPromise.fail(function () {
            ok(false, "promise was resolved");
        }).done(function (aResults) {
            ok(true, "promise was resolved");

            var aCallArgs;

            strictEqual(aResults.length, 3, "getSemanticObjectLinks returned 3 results");

            strictEqual(jQuery.sap.log.warning.getCalls().length, 3, "jQuery.sap.log.warning was called 3 times");
            strictEqual(jQuery.sap.log.error.getCalls().length, 0, "jQuery.sap.log.error was called 0 times");
            for (i = 0; i < aResults.length; i++) {
                ok(aResults[i].intent.length === iVeryLongUrlLength, "intent in result " + i + " is returned unshortened");
                strictEqual(aResults[i].intent.indexOf("sap-intent-param"), -1, "sap-intent-param was not found in unshortened intent");

                aCallArgs = jQuery.sap.log.warning.getCall(i).args;

                strictEqual(aCallArgs[0], "Cannot shorten GetSemanticObjectLinks result, using expanded form",
                    "first argument of warning function is as expected for result " + i);

                ok(aCallArgs[1].match(/^Failure message: Error occurred; intent had title.*and link.*$/),
                    "second argument of warning function is in expected format for result " + i);

                strictEqual(aCallArgs[2], "sap.ushell.services.NavTargetResolution",
                    "third argument of warning function is as expected for result " + i);
            }
        }).always(function () { start(); });

    });

    asyncTest("getLinks with withAtLeastOneParam argument calls ClientSideTargetResolution as expected", function () {
        var oNavTargetResolution,
            mParameters = {
                A: "B",
                C: ["e'e", "j j"]
            },
            oCSTRGetLinksStub = sinon.stub().returns(new jQuery.Deferred().resolve([]).promise());

        // prepare test
        oNavTargetResolution = new NavTargetResolution();

        sinon.stub(oNavTargetResolution, "_isClientSideTargetResolutionEnabled")
            .returns(true);

        var fnGetServiceOrig = sap.ushell.Container.getService;
        sinon.stub(sap.ushell.Container, "getService", function (sServiceName) {

            if (sServiceName === "ClientSideTargetResolution") {
                return { // fake ClientSideTargetResolution
                    getLinks: oCSTRGetLinksStub
                };
            }

            // return fnGetServiceOrig.call(sap.ushell.Container, sServiceName);
            if (sServiceName === "ShellNavigation") {
                return { // fake ShellNavigation
                    hrefForExternal: sinon.stub().returns(new jQuery.Deferred().resolve({
                        hash: "#Action-dummyAction?A=B&C=e'e&C=j%2520j&sap-xapp-state=AKEY",
                        params: undefined,
                        skippedParams: undefined
                    }).promise())
                };
            }
            if (sServiceName === "URLParsing") {
                return fnGetServiceOrig.call(sap.ushell.Container, sServiceName);
            }

            ok(false, "Service " + sServiceName + " is not used in this test");
        });

        // code under test
        oNavTargetResolution.getLinks({
            semanticObject: "Action",
            params: mParameters,
            withAtLeastOneParam: true,
            ignoreFormFactor: true,
            ui5Component: undefined,
            appStateKey: "AKEY"
        })
        .always(function () {

            strictEqual(oCSTRGetLinksStub.getCalls().length, 1,
                "ClientSideTargetResolution#getLinks was called 1 time");

            deepEqual(oCSTRGetLinksStub.getCall(0).args, [{
                semanticObject: "Action",
                params: mParameters,
                withAtLeastOneParam: true,
                ignoreFormFactor: true,
                appStateKey: "AKEY",
                ui5Component: undefined
            }], "ClientSideTargetResolution#getLinks was called with the expected arguments");

            start();
        });
    });

    test("getLinks with appState", function () {
        var oNavTargetResolution,
            oNavTargetResolutionAdapter =  {
                getSemanticObjectLinks: sinon.stub().returns(((new jQuery.Deferred()).resolve()).promise()),
                resolveHashFragment: sinon.stub()
            },
            mParameters = {
                A: "B",
                C: ["e'e", "j j"]
            };

        // prepare test
        oNavTargetResolution = new NavTargetResolution(oNavTargetResolutionAdapter);
        // code under test
        throws(function () {
            oNavTargetResolution.getLinks({semanticObject: "Action?foo"});
        }, /Parameter must not be part of semantic object/);
        oNavTargetResolution.getLinks({
            semanticObject: "Action",
            params: mParameters,
            ignoreFormFactor: true,
            ui5Component: undefined,
            appStateKey: "AKEY"
        });

        // test
        ok(oNavTargetResolutionAdapter.getSemanticObjectLinks.calledOnce);
        ok(oNavTargetResolutionAdapter.getSemanticObjectLinks
            .calledWithExactly("Action", {
                A: "B",
                C: ["e'e", "j j"],
                "sap-xapp-state" : "AKEY"
            }, true));
    });

    test("isIntentSupported", function () {
        var aIntents = [/*content does not matter*/],
            oResult,
            oSimulatedResult = {/*jQuery.Deferred*/},
            oNavTargetResolution,
            oNavTargetResolutionAdapter =  {
                isIntentSupported: sinon.stub().returns(oSimulatedResult),
                resolveHashFragment: sinon.stub()
            };

        // prepare test
        oNavTargetResolution = new NavTargetResolution(oNavTargetResolutionAdapter);

        // code under test
        oResult = oNavTargetResolution.isIntentSupported(aIntents);

        // test
        ok(oNavTargetResolutionAdapter.isIntentSupported.calledOnce);
        ok(oNavTargetResolutionAdapter.isIntentSupported.calledWithExactly(aIntents));
        strictEqual(oResult, oSimulatedResult);
    });

    test("isIntentSupported: uses ClientSideTargetResolution when configuration option is enabled", function () {
        var oClientSideIsIntentSupportedStub = sinon.stub(),
            oAdapterIsIntentSupportedStub = sinon.stub(),
            oAdapterFake = {
                isIntentSupported: oAdapterIsIntentSupportedStub
            },
            aIsIntentSupportedArgs = ["#Object1-action1", "#Object2-action2"],
            oNavTargetResolution = new NavTargetResolution(oAdapterFake, undefined, undefined, getClientSideTargetResolutionConfig()),
            iCallLength;

        sinon.stub(sap.ushell.Container, "getService")
            .withArgs("ClientSideTargetResolution").returns({
                isIntentSupported: oClientSideIsIntentSupportedStub
            });

        oNavTargetResolution.isIntentSupported(aIsIntentSupportedArgs);

        strictEqual(iCallLength = oClientSideIsIntentSupportedStub.getCalls().length, 1,
            "ClientSideTargetResolution#isIntentSupported was called once");

        if (iCallLength === 1) {
            deepEqual(oClientSideIsIntentSupportedStub.getCall(0).args[0], aIsIntentSupportedArgs,
                "ClientSideTargetResolution#isIntentSupported was called with expected arguments");
        }

        strictEqual(oAdapterIsIntentSupportedStub.getCalls().length, 0,
            "NavTargetResolutionAdapter#isIntentSupported was not called");
    });

    asyncTest("isIntentSupported does not require ClientSideTargetResolution service when ClientSideTargetResolution is disabled", function () {
        var oNavTargetResolution = new NavTargetResolution( /* oAdapter */ {
            // no isIntentSupported implemented in adapter
        }, undefined, undefined, getClientSideTargetResolutionConfig(false));

        sinon.spy(sap.ushell.Container, "getService");

        oNavTargetResolution.isIntentSupported(["#Action-test"])
            .always(function () {
                strictEqual(
                    sap.ushell.Container.getService.calledWith("ClientSideTargetResolution"),
                    false,
                    "sap.ushell.Container.getService was not called with ClientSideTargetResolution"
                );
                start();
            });
    });

    test("isIntentSupported: missing in adapter", function () {
        var aIntents = ["#foo", "#bar"],
            oNavTargetResolution,
            oNavTargetResolutionAdapter =  {
                resolveHashFragment: sinon.stub()
            };

        // prepare test
        oNavTargetResolution = new NavTargetResolution(oNavTargetResolutionAdapter);

        // code under test
        oNavTargetResolution.isIntentSupported(aIntents)
            .fail(testUtils.onError)
            .done(function (mSupportedByIntent) {
                //start();

                // test
                deepEqual(mSupportedByIntent, {
                    "#foo": {supported: undefined},
                    "#bar": {supported: undefined}
                });
            });
    });

    test("isNavigationSupported", function () {
        var aIntents = [/*content does not matter*/],
            oResult,
            oSimulatedResult,
            oSimulatedResultValue,
            oNavTargetResolutionAdapter =  {
                    resolveHashFragment: sinon.stub()
                },
            cnt = 0,
            oNavTargetResolution;

        // prepare test
        aIntents = [ { target : {
                        semanticObject : "Obj1", "action" : "act1"}
                     },
                     {},
                     {
                         target : {
                             semanticObject : "Obj1", "action" : "act1"
                         }
                     },
                     {},
                     {
                         target : {
                             semanticObject : "Obj1", "action" : "act1"
                         },
                         params : { "A" : "V1"}
                     },
                     { target : { shellHash : "Obj3-act3&jumper=postman" } },
                     "#Obj4-act4",
                     "Obj5-act5",
                     "#Obj5-act5",
                     "notahash",
                     "#alsonotahash"
                   ];
        oSimulatedResultValue = { "#Obj1-act1" : { supported : true},
                "#Obj3-act3&jumper=postman" : { supported: true},
                "#Obj5-act5" : { supported : true},
                  "Obj1-act1?A=V1" : { supported: false} };
        oSimulatedResult = new jQuery.Deferred();
        oNavTargetResolution = new NavTargetResolution(oNavTargetResolutionAdapter);
        sinon.stub(oNavTargetResolution,"isIntentSupported").returns(oSimulatedResult);
        // code under test
        oResult = oNavTargetResolution.isNavigationSupported(aIntents);

        // test
        ok(oNavTargetResolution.isIntentSupported.calledOnce);
        deepEqual(oNavTargetResolution.isIntentSupported.args[0][0],
                [ "#Obj1-act1",
                  "#",
                  "#Obj1-act1",
                  "#",
                  "#Obj1-act1?A=V1",
                  "#Obj3-act3&jumper=postman",
                  "#Obj4-act4",
                  "Obj5-act5",
                  "#Obj5-act5",
                  "notahash",
                  "#alsonotahash" ], "result passed on ok");
        oSimulatedResult.resolve(oSimulatedResultValue);
        cnt = 0;
        oResult.done(function(aRes) {
            cnt += 1;
            deepEqual(aRes,[
                 {
                   "supported": true
                 },
                 {
                   "supported": false
                 },
                 {
                   "supported": true
                 },
                 {
                   "supported": false
                 },
                 {
                   "supported": false
                 },
                 {
                   "supported": true
                 },
                 {
                   "supported": false
                 },
                 {
                   "supported": false
                 },
                 {
                   "supported": true
                 },
                 {
                   "supported": false
                 },
                 {
                   "supported": false
                 }
             ], "expected resolution result");
        }).fail(function() {
           ok(false, "called");
        });
        ok(cnt > 0, "promise done");
    });

    test("isNavigationSupported: failing isIntentSupported", function () {
        var aIntents = [/*content does not matter*/],
            oResult,
            oNavTargetResolutionAdapter =  {
                    resolveHashFragment: sinon.stub()
                },
            cnt = 0,
            oSimulatedResult,
            oNavTargetResolution;

        // prepare test
        aIntents = [ { target : {
                        semanticObject : "Obj1", "action" : "act1"}
                     },
                     {},
                     {
                         target : {
                             semanticObject : "Obj1", "action" : "act1"
                         }
                     },
                     {
                         target : {
                             semanticObject : "Obj1", "action" : "act1"
                         },
                         params : { "A" : "V1"}
                     }
                   ];
        oSimulatedResult = new jQuery.Deferred().reject("not this way","42","33").promise();
        oNavTargetResolution = new NavTargetResolution(oNavTargetResolutionAdapter);
        sinon.stub(oNavTargetResolution,"isIntentSupported").returns(oSimulatedResult);
        // code under test
        oResult = oNavTargetResolution.isNavigationSupported(aIntents);

        // test
        ok(oNavTargetResolution.isIntentSupported.calledOnce);
        deepEqual(oNavTargetResolution.isIntentSupported.args[0][0],
                [ "#Obj1-act1", "#", "#Obj1-act1", "#Obj1-act1?A=V1" ],"result passed on ok");
        cnt = 0;
        oResult.done(function(aRes) {
            ok(false,"should not be called");
        }).fail(function(sMsg,a1,a2) {
            ok(true, "called");
            deepEqual([sMsg,a1,a2],["not this way", "42", "33"],"args ok");
            equal(sMsg,"not this way","message transported");
            cnt += 1;
         });
         ok(cnt > 0, "promise rejected");
     });

    [
     {
         description: "NWBC in URL ( strange)",
         inputHash :  "#A-b?sap-system=EFG&AA=BBB",
         inputResolutionResult: {
             applicationType: "NWBC",
             url: "/some/url?AA=BB&sap-system=ABC",
             additionalInformation: "/some/additional/information"
         },
         expectedResult: "ABC"
     },
     {
         description: "NWBC, standard",
         inputHash :  "#A-b?sap-system=EFG&AA=BBB" ,
         inputResolutionResult: {
             applicationType: "NWBC",
             url: "/some/url?AA=BB",
             additionalInformation: "/some/additional/information"
         },
         expectedResult: "EFG"
     },
     {
         description: "NWBC, no system",
         inputHash : "#A-b?xx-system=EFG&AA=BBB",
         inputResolutionResult: {
             applicationType: "NWBC",
             url: "/some/url?AA=BB",
             additionalInformation: "/some/additional/information"
         },
         expectedResult: undefined
     },
     {
         description: "url with system",
         inputHash : "#A-b?sap-system=XX",
         inputResolutionResult: {
             applicationType: "URL",
             url: "/some/url?sap-system=U%20U",
             additionalInformation: "SAPUI5.Component=componentname"
         },
         expectedResult: "U U"
     },
     {
         description: "url no system",
         inputHash : "#A-b",
         inputResolutionResult: {
             applicationType: "URL",
             url: "/some/url?no-system=X",
             additionalInformation: "SAPUI5.Component=componentname"
         },
         expectedResult: undefined
     },
     {
         description: "url no system in results, hash system not used (!)",
         inputHash : "#A-b?sap-system=AAA",
         inputResolutionResult: {
             applicationType: "URL",
             url: "/some/url?XXX=BBB",
             additionalInformation: "SAPUI5.Component=componentname"
         },
         expectedResult: undefined
     },
     {
         description: "SAPUI5",
         inputHash : "#A-b",
         inputResolutionResult: {
             applicationType: "SAPUI5",
             url: "/some/url?XXXX=AAAA",
             additionalInformation: "SAPUI5.Component=componentname"
         },
         expectedResult: undefined
     }
    ].forEach(function (oFixture) {

        test("getSapSystem for navigation: " + oFixture.description, function () {
            var oNavTargetResolution = new NavTargetResolution({
                isIntentSupported: sinon.stub().returns(false),
                resolveHashFragment: sinon.stub()
            });
                strictEqual(
                    oNavTargetResolution._getSapSystem(oFixture.inputHash, oFixture.inputResolutionResult),
                    oFixture.expectedResult,
                    "result ok  " + oFixture.description
                );

        });
    });

    [
        {
            testDescription: "resolution result is undefined",
            oResolutionResultAfterHashChain: undefined,
            expectedUi5ComponentName: undefined
        },
        {
            testDescription: "correct component name is already set in property ui5ComponentName",
            oResolutionResultAfterHashChain: {
                "ui5ComponentName": "some.ui5.component",
                "sap.platform.runtime" : { "some" : "info"}
            },
            expectedUi5ComponentName: "some.ui5.component"
        },
        {
            testDescription: "sap.platform.runtime is stripped",
            oResolutionResultAfterHashChain: {
                "ui5ComponentName": "some.ui5.component",
                "sap.platform.runtime" : { "some" : "info"}
            },
            expectedUi5ComponentName: "some.ui5.component"
        },
        {
            testDescription: "correct component name is in additionalInformation and applicationType is URL",
            oResolutionResultAfterHashChain: {
                "additionalInformation": "SAPUI5.Component=some.ui5.component",
                "applicationType": "URL"
            },
            expectedUi5ComponentName: "some.ui5.component"
        },
        {
            testDescription: "correct component name is in additionalInformation and applicationType is SAPUI5",
            oResolutionResultAfterHashChain: {
                "additionalInformation": "SAPUI5.Component=some.ui5.component",
                "applicationType": "SAPUI5"
            },
            expectedUi5ComponentName: "some.ui5.component"
        }
    ].forEach(function (oFixture) {
        test("resolveHashFragment extracts the ui5 component name from additionalInformation correctly after invoking the resolve hash chain when " + oFixture.testDescription, function () {
            var sTestHashFragment = "#Test-hashfragment",
            oService,
            oRes;

            // Arrange
            oService = sap.ushell.Container.getService("NavTargetResolution");
            sinon.stub(oService, "expandCompactHash").returns(new jQuery.Deferred().resolve(sTestHashFragment).promise());
            sinon.stub(oService, "_invokeResolveHashChain").returns(new jQuery.Deferred().resolve(
                oFixture.oResolutionResultAfterHashChain).promise());
            sinon.spy(oService, "_adjustResolutionResultForUi5Components");

            // Act
            oRes = oService.resolveHashFragment(sTestHashFragment); // no particular intent
            oRes = evalNow(oRes);
            equal((oRes && oRes["sap.platform.runtime"]), undefined," runtime stripped if present");
            if (oFixture.expectedUi5ComponentName) {
                strictEqual(oRes.ui5ComponentName, oFixture.expectedUi5ComponentName, "ui5ComponentName set correctly");
            } else {
                strictEqual(oRes, oFixture.oResolutionResultAfterHashChain, "resolution result not modified");
            }


            strictEqual(oService._adjustResolutionResultForUi5Components.getCalls().length, 1, "_adjustResolutionResultForUi5Components was called once");
        });
    });

    asyncTest("resolveHashFragment: fails if the passed hash fragment does not start with a hash", function () {
        var oNavTargetResolution = new NavTargetResolution(undefined, undefined, undefined, getClientSideTargetResolutionConfig());

        sinon.stub(sap.ushell.Container, "getService")
            .withArgs("ClientSideTargetResolution").returns({
                resolveHashFragment: sinon.stub()
            });

        try {
            oNavTargetResolution.baseResolveHashFragment("Object-action")
                .fail(function () {
                    ok(false, "promise was resolved");
                })
                .done(function () {
                    ok(true, "promise was resolved");
                })
                .always(function () {
                    start();
                });
        } catch (e) {
            strictEqual(e.message, "Hash fragment expected in _validateHashFragment", "exception thrown");
        } finally {
            start();
        }
    });

    [true, false].forEach(function (bClientSideResolutionEnabled) {

        asyncTest("resolveHashFragment after async loading of component dependencies fails in bootstrap when" +
            " ClientSideTargetResolution is " + (bClientSideResolutionEnabled ? "enabled" : "disabled"), function () {

            var oSuccessfulResolveHashFragmentStub = sinon.stub().returns(new jQuery.Deferred().resolve({}).promise()),
                oFakeAdapter = {
                    resolveHashFragment: oSuccessfulResolveHashFragmentStub
                },
                oNavTargetResolutionService = new NavTargetResolution(
                    oFakeAdapter, undefined, undefined, bClientSideResolutionEnabled ? getClientSideTargetResolutionConfig() : undefined);

            // resolves client side
            oNavTargetResolutionService._resolveHashFragmentClientSide = oSuccessfulResolveHashFragmentStub;

            oNavTargetResolutionService.baseResolveHashFragment("#Object-action")
                .fail(testUtils.onError)
                .done(function (oApplication) {
                    ok(true, "even if the asynchronous loading of component dependencies in Boottask fails, resolveHashFragment resolves");
                })
                .always(function () {
                    start();
                });
        });
    });

    asyncTest("_resolveHashFragmentClientSide: returns URL application type when SAPUI5 application type is resolved", function () {
        var oNavTargetResolution = new NavTargetResolution(undefined, undefined, undefined, getClientSideTargetResolutionConfig());

        sinon.stub(sap.ushell.Container, "getService").withArgs("ClientSideTargetResolution").returns({
            resolveHashFragment: sinon.stub().returns(
                new jQuery.Deferred().resolve({ applicationType: "SAPUI5" }).promise())
        });

        oNavTargetResolution._resolveHashFragmentClientSide("#Doesnt-matter")
            .fail(function () {
                ok(false, "promise is resolved");
            })
            .done(function (oResolutionResult) {
                ok(true, "promise is resolved");
                strictEqual(oResolutionResult.applicationType, "URL", "resolved applicationType is URL");
            })
            .always(function () { start(); });

    });

    test("resolveHashFragment fixes the applicationType back to URL when SAPUI5 is returned after invoking the resolve hash chain", function () {

        function evalNow(oPromise) {
            var res,
                bIsDone = false;

            oPromise.done(function (pRes) {
                res = pRes;
                bIsDone = true;
            });

            oPromise.fail(function (pRes) {
                ok(false, "done expected");
            });

            ok(bIsDone, "done has been called");

            return res;
        }

        var sTestHashFragment = "#Test-hashfragment",
            oService,
            oRes;

        // Arrange
        oService = sap.ushell.Container.getService("NavTargetResolution");
        sinon.stub(oService, "expandCompactHash").returns(new jQuery.Deferred().resolve(sTestHashFragment).promise());
        sinon.stub(oService, "_invokeResolveHashChain").returns(new jQuery.Deferred().resolve({
            "additionalInformation": "SAPUI5.Component=sap.ushell.demoapps.FioriSandboxConfigApp",
            "applicationType": "SAPUI5",  // NOTE: not URL
            "url": "/sap/bc/ui5_ui5/ui2/ushell/test-resources/sap/ushell/demoapps/FioriSandboxConfigApp"
        }).promise());
        sinon.stub(oNavigationMode, "getNavigationMode");

        // Act
        oRes = oService.resolveHashFragment(sTestHashFragment); // no particular intent
        oRes = evalNow(oRes);

        // Assert
        strictEqual(oRes.applicationType, "URL", "applicationType was corrected to URL");
    });

});
