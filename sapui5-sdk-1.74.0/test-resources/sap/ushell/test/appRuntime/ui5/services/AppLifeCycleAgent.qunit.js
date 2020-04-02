// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.appRuntime.ui5.services.AppLifeCycleAgent
 */
sap.ui.require([
    "sap/ui/thirdparty/URI",
    "sap/ushell/appRuntime/ui5/services/AppLifeCycleAgent",
    "sap/ushell/appRuntime/ui5/AppCommunicationMgr",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/services/Container",
    "jquery.sap.script"
], function (URI, AppLifeCycleAgent, AppCommunicationMgr, AppRuntimeService) {
    "use strict";

    /*global module, test, sap, sinon, asyncTest, start*/

    module("sap.ushell.appRuntime.ui5.services.AppLifeCycleAgent", {
    });


    test("test lifecycle basic flow", function (assert) {
        var done = assert.async();

        var oAppResolution = {
                getAppInfo: function (appId) {
                    return new jQuery.Deferred().resolve({
                        test: 1
                    }).promise();
                }
            },
            ofnCreateApplication = function (sStorageKey, appId, oAppInfo) {
                return new jQuery.Deferred().resolve({
                    runtest: 1
                }).promise();
            },
            oRouterObj = {
                initialize: sinon.spy(),
                stop: sinon.spy()
            },
            oCompInst = {
                suspend: sinon.spy(),
                restore: sinon.spy(),
                getRouter: function () {
                    return oRouterObj;
                }
            },
            oComponentMock = {
                setVisible: sinon.spy(),
                getComponentInstance: function () {
                    return oCompInst;
                }
            },
            fnRenderApp = function (oResolutionResult) {
                AppLifeCycleAgent.setComponent(oComponentMock);
            };
        AppLifeCycleAgent.init(oAppResolution, ofnCreateApplication, fnRenderApp);
        AppLifeCycleAgent.create("testapp1", "http://xxx.yyyy").then(function () {
            AppLifeCycleAgent.store("storage1");
            assert.ok(oComponentMock.setVisible.args.length === 1, "set visible invoked once");
            assert.ok(oComponentMock.setVisible.args[0][0] === false, "after store is visibility is false");

            assert.ok(oCompInst.suspend.args.length === 1, "validate suspended called");
            assert.ok(oRouterObj.stop.args.length === 1, "validate router stopped");

            AppLifeCycleAgent.restore("storage1");

            assert.ok(oCompInst.restore.args.length === 1, "validate suspended called");
            assert.ok(oRouterObj.initialize.args.length === 1, "validate router stopped");

            assert.ok(oComponentMock.setVisible.args.length === 2, "set visible invoked once");
            assert.ok(oComponentMock.setVisible.args[1][0] === true, "after store is visibility is false");
            done();
        });
    });

    test("test lifecycle multiple application flow", function (assert) {
        var done = assert.async();

        var oAppResolution = {
                getAppInfo: function (appId) {
                    return new jQuery.Deferred().resolve({
                        test: 1
                    }).promise();
                }
            },
            ofnCreateApplication = function (sStorageKey, appId, oAppInfo) {
                return new jQuery.Deferred().resolve({
                    sStorageKey: sStorageKey
                }).promise();
            },
            oRouterObj = {
                initialize: sinon.spy(),
                stop: sinon.spy()
            },
            oCompInst = {
                suspend: sinon.spy(),
                restore: sinon.spy(),
                getRouter: function () {
                    return oRouterObj;
                }
            },
            oComponentMock = {
                setVisible: sinon.spy(),
                getComponentInstance: function () {
                    return oCompInst;
                }
            },
            fnRenderApp = function (oResolutionResult) {
                AppLifeCycleAgent.setComponent(oComponentMock);
            };

        AppLifeCycleAgent.init(oAppResolution, ofnCreateApplication, fnRenderApp);

        AppLifeCycleAgent.create("testapp1", "http://xxx.yyyy").then(function () {
            AppLifeCycleAgent.store("storage1");

            AppLifeCycleAgent.create("testapp2", "http://xxx.zzz").then(function () {
                AppLifeCycleAgent.store("storage2");
                assert.ok(oComponentMock.setVisible.args.length === 2, "set visible invoked once");
                assert.ok(oComponentMock.setVisible.args[0][0] === false, "after store is visibility first call invoked with false");
                assert.ok(oComponentMock.setVisible.args[1][0] === false, "after store is visibility secound call invoked with false");

                assert.ok(oCompInst.suspend.args.length === 2, "validate suspended called");
                assert.ok(oRouterObj.stop.args.length === 2, "validate router stopped");

                AppLifeCycleAgent.restore("storage1");

                assert.ok(oCompInst.restore.args.length === 1, "validate suspended called");
                assert.ok(oRouterObj.initialize.args.length === 1, "validate router stopped");

                assert.ok(oComponentMock.setVisible.args.length === 3, "set visible invoked 3 times");
                assert.ok(oComponentMock.setVisible.args[0][0] === false, "after restore visibility 1 call is false");
                assert.ok(oComponentMock.setVisible.args[1][0] === false, "after store is visibility 2 call is false");
                assert.ok(oComponentMock.setVisible.args[2][0] === true, "after store is visibility 3 call is true");
                done();
            });
        });
    });


    test("test create application", function (assert) {
        // var oAppPromise = AppLifeCycleAgent.create("appId-1");
        AppLifeCycleAgent.init();
        assert.ok(true, "TODO create assertions");
    });


    test("test destroy application", function (assert) {
        AppLifeCycleAgent.init();
        assert.ok(true, "TODO create assertions");
    });

    test("test jsonStringifyFn", function (assert) {
        var sSer = AppLifeCycleAgent.jsonStringifyFn({
            test1: function () {

            },
            test2: ""
        });

        assert.ok(sSer === "{\"test1\":\"function () {\\r\\n\\r\\n            }\",\"test2\":\"\"}", "Validate ser object");
    });

    [
        {
            name: "no parameters",
            urlIn: "http://www.a.com",
            paramsOut: new URI("?").query(true)
        },
        {
            name: "simple parameters",
            urlIn: "http://www.a.com?a=1&b=2&c=3&d=4",
            paramsOut: new URI("?a=1&b=2&c=3&d=4").query(true)
        },
        {
            name: "sap-intent-param single parameter",
            urlIn: "http://www.a.com?sap-intent-param=abcd",
            paramsOut: new URI("?a=1&b=2&c=3&d=4").query(true),
            appState: {
                abcd: "a=1&b=2&c=3&d=4"
            }
        },
        {
            name: "sap-intent-param with other params",
            urlIn: "http://www.a.com?sap-intent-param=abcd&x=1&y=2",
            paramsOut: new URI("?a=1&b=2&c=3&d=4&x=1&y=2").query(true),
            appState: {
                abcd: "a=1&b=2&c=3&d=4"
            }
        }
    ].forEach(function (oFixture) {
        asyncTest("getURLParameters - " + oFixture.name, function (assert) {
            var oGetServiceStub = sinon.stub(AppRuntimeService, "sendMessageToOuterShell", function (sName, sKey) {
                if (sName === "sap.ushell.services.CrossApplicationNavigation.getAppStateData") {
                    return new jQuery.Deferred().resolve(oFixture.appState[sKey.sAppStateKey]).promise();
                }
            });
            AppLifeCycleAgent.getURLParameters(new URI(oFixture.urlIn).query(true)).then(function (oUrlParameters) {
                assert.deepEqual(oFixture.paramsOut, oUrlParameters, "parameters are the same");
                start();
                oGetServiceStub.restore();
            });
        });
    });

});
