// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.UserDefaultParameters
 */
sap.ui.require([
    "sap/ushell/services/UserDefaultParameters",
    "sap/ushell/test/utils"
], function (UserDefaultParameters, testUtils) {
    "use strict";

    /* global module, test, ok, deepEqual, sinon, equal, strictEqual, asyncTest, start */

    var oService;

    jQuery.sap.require("sap.ushell.services.Container");

    module("sap.ushell.services.UserDefaultParameters", {
        setup: function () {
            oService = new UserDefaultParameters();
            sap.ushell.Container = sap.ushell.Container || {
                "getService": function (sService) {
                    if (sService === "PluginManager") {
                        return {
                            "loadPlugins": function () {
                                return new jQuery.Deferred().resolve().promise();
                            }
                        };
                    }
                }
            };
        },
        teardown: function () {
            delete sap.ushell.Container;
        }
    });

    test("constructor", function () {
        ok(oService);
    });

    test("registerPlugin", function () {
        ok(typeof oService.registerPlugin === "function");
    });

    test("getValue", function () {
        ok(typeof oService.getValue === "function");
    });

    function makeFunction (value) {
        if (value === "reject") {
            return function () {
                return new jQuery.Deferred().reject().promise();
            };
        }
        return function () {
            var oDeferred = new jQuery.Deferred();
            setTimeout(function () { oDeferred.resolve(value); }, 0);
            return oDeferred.promise();
        };
    }

    function makeFunctionMerge (value) {
        if (value === "reject") {
            return function () {
                return new jQuery.Deferred().reject().promise();
            };
        }
        return function (sName, oValue) {
            var oDeferred = new jQuery.Deferred();
            setTimeout(function () {
                oValue = oValue || {};
                if (value.value) {
                    oValue.value = value.value;
                }
                if (value.extendedValue) {
                    oValue.extendedValue = value.extendedValue;
                }
                oDeferred.resolve(oValue);
            }, 0);
            return oDeferred.promise();
        };
    }

    function makeFunctionIf (value, sParameterName) {
        if (value === "reject") {
            return function () { return new jQuery.Deferred().reject().promise(); };
        }

        return function (sName, org) {
            var oDeferred = new jQuery.Deferred();
            setTimeout(function () {
                if (sName === sParameterName) {
                    oDeferred.resolve(value);
                } else {
                    oDeferred.resolve(org);
                }
            }, 0);
            return oDeferred.promise();
        };
    }

    function makePlugin (sId, oPrio) {
        return { id: sId, getComponentData: function () { return { config: { "sap-priority": oPrio } }; } };
    }

    [
        { description: "insert0", arr: [], oInsert: makePlugin("P1"), res: ["P1"] },
        { description: "insertend", arr: [makePlugin("P1", undefined), makePlugin("P2", undefined)], oInsert: makePlugin("P3", undefined), res: ["P1", "P2", "P3"] },
        { description: "insertmid", arr: [makePlugin("P1", 100), makePlugin("P2", undefined)], oInsert: makePlugin("P3", 50), res: ["P1", "P3", "P2"] },
        { description: "insertfirst", arr: [makePlugin("P1", 100), makePlugin("P2", undefined)], oInsert: makePlugin("P3", -50), res: ["P1", "P2", "P3"] },
        { description: "insertlastappend", arr: [makePlugin("P1", 100), makePlugin("P2", undefined)], oInsert: makePlugin("P3", undefined), res: ["P1", "P2", "P3"] },
        { description: "insertfirst", arr: [makePlugin("P1", 100), makePlugin("P2", undefined)], oInsert: makePlugin("P3", 200), res: ["P3", "P1", "P2"] },
        { description: "insert sameend", arr: [makePlugin("P1", 100), makePlugin("P2", undefined)], oInsert: makePlugin("P3", 100), res: ["P1", "P3", "P2"] }
    ].forEach(function (oFixture) {
        test("insertOrdered" + oFixture.description, function () {
            var res = oService._insertPluginOrdered(oFixture.arr, oFixture.oInsert);
            res = res.map(function (oObj) {
                return oObj.id;
            });
            deepEqual(res, oFixture.res, "result ok");
        });
    });

    asyncTest("getValue: init time for plug-ins", function () {
        var oPlugin = {},
            oDeferred = new jQuery.Deferred();

        // prepare the test environment
        oPlugin.getUserDefault = makeFunction({ "value": "bar" });
        sinon.stub(oService, "_getPersistedValue").returns(new jQuery.Deferred().resolve({}).promise());
        sinon.stub(oService, "_isRelevantParameter").returns(new jQuery.Deferred().resolve(true).promise());
        sinon.stub(oService, "_storeValue");
        sap.ushell.Container = {
            "getService": function (sService) {
                if (sService === "PluginManager") {
                    return {
                        "loadPlugins": function () {
                            return oDeferred.promise();
                        }
                    };
                }
            }
        };

        // call the getValue before registering the plugin
        oService.getValue("foo").done(function (oValue) {
            equal(oValue.value, "bar", "The expected value was returned by the service!");
            start();
        });

        // resolve the promise and only then we register the plugin
        oService.registerPlugin(oPlugin);
        oDeferred.resolve();
    });

    // two sample plugins, getValue on service,
    // check that two plugins are always invoked properly
    // check that "last one altering wins"
    // check that storage is invoked
    [{
        description: "[undefined, reject, value] ",
        testInitialValueStored: true,
        initial: undefined,
        P1: "reject",
        P2: { value: 333 },
        expectedResult: {
            storeCalled: true,
            value: { value: 333 }
        }
    }, {
        description: "[value, reject, value] ",
        testInitialValueStored: true,
        initial: {
            value: "ABC",
            noStore: true
        },
        P1: "reject",
        P2: { value: 333, noStore: true },
        expectedResult: {
            storeCalled: true,
            value: {
                value: 333,
                noStore: true
            }
        }
    }, {
        description: "[value, value, value] ",
        testInitialValueStored: true,
        initial: { value: "ABC", "alwaysAskPlugin": true },
        P1: { value: "AAA" },
        P2: { value: 333, noStore: true },
        expectedResult: {
            storeCalled: true,
            value: {
                value: 333,
                noStore: true
            }
        }
    }, {
        description: "[value, value, value] ",
        testInitialValueStored: true,
        initial: {
            value: "ABC",
            "alwaysAskPlugin": true
        },
        P1: { value: "AAA" },
        P2: { value: 333, noStore: true },
        expectedResult: {
            storeCalled: true,
            value: {
                value: 333,
                noStore: true
            }
        }
    }, {
        description: "[value, value, reject] ",
        testInitialValueStored: false,
        P1: { value: "AAA" },
        P2: "reject",
        expectedResult: {
            storeCalled: true,
            value: { value: "AAA" }
        }
    }, {
        description: "[value, value,  undefvalue] ",
        testInitialValueStored: true,
        initial: {
            value: "ABC",
            noStore: "XXX"
        },
        P1: { value: "AAA" },
        P2: { value: undefined },
        expectedResult: {
            storeCalled: true,
            value: { value: undefined }
        }
    }, {
        description: "[value, value, value (2)] ",
        testInitialValueStored: true,
        initial: {
            value: "ABC",
            "alwaysAskPlugin": true
        },
        P1: { value: "ABC" },
        P2: { value: "ABC" },
        expectedResult: {
            storeCalled: true,
            value: { value: "ABC" }
        }
    }, {
        description: "[value, value, value (2) all equal] ",
        testInitialValueStored: true,
        initial: {
            value: "ABC",
            "_shellData": "1",
            "alwaysAskPlugin": true
        },
        P1: { value: "ABC", "alwaysAskPlugin": true },
        P2: { value: "ABC", "alwaysAskPlugin": true },
        expectedResult: {
            storeCalled: false,
            value: {
                value: "ABC",
                alwaysAskPlugin: true
            }
        }
    }, {
        description: "[value, reject, reject] ",
        testInitialValueStored: true,
        initial: {
            value: "ABC",
            "_shellData": "1",
            "alwaysAskPlugin": true
        },
        P1: "reject",
        P2: "reject",
        expectedResult: {
            storeCalled: false,
            value: {
                value: "ABC",
                "alwaysAskPlugin": true,
                "_shellData": "1"
            }
        }
    }, {
        description: "[undef, reject, reject] ",
        testInitialValueStored: false,
        P1: "reject",
        P2: "reject",
        expectedResult: {
            storeCalled: true,
            value: { value: undefined }
        }
    }].forEach(function (oFixture) {
        asyncTest("getValue, plugin invocation: test : " + oFixture.description, function () {
            var oPlugin1, oPlugin2;

            sinon.stub(oService, "_getPersistedValue").returns(oFixture.testInitialValueStored
                ? new jQuery.Deferred().resolve(oFixture.initial).promise()
                : new jQuery.Deferred().reject().promise()
            );

            sinon.stub(oService, "_isRelevantParameter").returns(new jQuery.Deferred().resolve(true).promise());
            sinon.stub(oService, "_storeValue");

            oPlugin1 = {};
            oPlugin1.getUserDefault = makeFunction(oFixture.P1);
            sinon.spy(oPlugin1, "getUserDefault");

            oPlugin2 = {};
            oPlugin2.getUserDefault = makeFunction(oFixture.P2);
            sinon.spy(oPlugin2, "getUserDefault");

            oService.registerPlugin(oPlugin1);
            oService.registerPlugin(oPlugin2);

            // test:
            oService.getValue("MYVALUE").done(function (oRes) {
                start();
                deepEqual(oRes, oFixture.expectedResult.value, "expected value ok");
                ok(oPlugin1.getUserDefault.calledOnce, "Plugin1 called");
                ok(oPlugin2.getUserDefault.calledOnce, "Plugin2 called");
                equal(oService._storeValue.calledOnce, oFixture.expectedResult.storeCalled, " store called?");
                if (oFixture.expectedResult.storeCalled) {
                    deepEqual(oService._storeValue.args[0], ["MYVALUE", oRes], "invoked with proper result");
                }
            });
        });
    });

    // two sample plugins, getValue on service,
    // check that two plugins are always invoked properly
    // check that "last one altering wins"
    // check that storage is invoked
    [{
        description: "[undefined, ext, value] ",
        initial: undefined,
        P1: { extendedValue: { "a": "b" } },
        P2: { value: 333 },
        expectedResult: {
            storeCalled: true,
            value: {
                value: 333,
                extendedValue: { "a": "b" }
            }
        }
    }, {
        description: "[undefined, value, ext] ",
        initial: undefined,
        P1: { value: 333 },
        P2: { extendedValue: { "x": "u" } },
        expectedResult: {
            storeCalled: true,
            value: {
                value: 333,
                extendedValue: { "x": "u" }
            }
        }
    }, {
        description: "[undefined, valAndext, value] ",
        initial: undefined,
        P1: { value: 333 },
        P2: { extendedValue: { "x": "u" } },
        expectedResult: {
            storeCalled: true,
            value: {
                value: 333,
                extendedValue: { "x": "u" }
            }
        }
    }, {
        description: "[extvalue, ext, ext] ",
        initial: {
            value: "ABC",
            noStore: true
        },
        P1: "reject",
        P2: { value: 333, noStore: true },
        expectedResult: {
            storeCalled: true,
            value: {
                value: 333,
                noStore: true
            }
        }
    }, {
        description: "[valueA, valueB, valueC] ",
        initial: {
            value: "ABC",
            extendedValue: { "a": "BBB" },
            noStore: true
        },
        P1: { value: "DEF", extendedValue: { "a": "BBB" } },
        P2: { value: "HIJ", extendedValue: { "a": "BBB" } },
        expectedResult: {
            storeCalled: true,
            value: {
                value: "HIJ",
                extendedValue: { "a": "BBB" },
                noStore: true
            }
        }
    }, {
        description: "[extvalueA, extB, extvalueA] ",
        initial: {
            value: "ABC",
            extendedValue: { "a": "B" },
            noStore: true
        },
        P1: { value: "ABC", extendedValue: { "a": "XXX" } },
        P2: { value: "ABC", extendedValue: { "a": "B" } },
        expectedResult: {
            storeCalled: false,
            value: {
                value: "ABC",
                extendedValue: { "a": "B" },
                noStore: true
            }
        }
    }, {
        description: "[extvalueA, extvalueA, extvalueB]  value present, nothing called!",
        initial: {
            value: "ABC",
            extendedValue: { "a": "a" }
        },
        P1: { value: "ABC", extendedValue: { "a": "a" } },
        P2: { value: "ABC", extendedValue: { "a": "B" } },
        expectedResult: {
            storeCalled: false,
            p1NotCalled: true,
            p2NotCalled: true,
            value: {
                value: "ABC",
                extendedValue: { "a": "a" }
            }
        }
    }, {
        description: "[extvalueA, extvalueX, extvalueY]  value present, nothing called!",
        initial: {
            extendedValue: { "a": "a" }
        },
        P1: { value: "XXX", extendedValue: { "a": "X" } },
        P2: { value: "YYY", extendedValue: { "a": "Y" } },
        expectedResult: {
            storeCalled: false,
            p1NotCalled: true,
            p2NotCalled: true,
            value: { extendedValue: { "a": "a" } }
        }
    }, {
        description: "[(extvalueA, alwaysAsk), extvalueA, extvalueB] value present, nothing called!",
        initial: {
            value: "ABC",
            extendedValue: { "a": "a" },
            alwaysAskPlugin: true
        },
        P1: { value: "ABC", extendedValue: { "a": "a" } },
        P2: { value: "ABC", extendedValue: { "a": "B" } },
        expectedResult: {
            storeCalled: true,
            value: {
                value: "ABC",
                extendedValue: { "a": "B" },
                alwaysAskPlugin: true
            }
        }
    }, {
        description: "[(extvalueA, alwaysAsk), extvalueA, extvalueB] value present, irrelevant!",
        initial: {
            value: "ABC",
            extendedValue: { "a": "a" },
            alwaysAskPlugin: true
        },
        P1: { value: "ABC", extendedValue: { "a": "a" } },
        P2: { value: "ABC", extendedValue: { "a": "B" } },
        isIrrelevantParameter: true,
        expectedResult: {
            storeCalled: false,
            p1NotCalled: true,
            p2NotCalled: true,
            value: {}
        }
    }].forEach(function (oFixture) {
        asyncTest("getValue: single and extended parameters test : " + oFixture.description, function () {
            var oPlugin1, oPlugin2;
            sinon.stub(oService, "_getPersistedValue").returns(new jQuery.Deferred().resolve(oFixture.initial).promise());
            sinon.stub(oService, "_isRelevantParameter").returns((oFixture.isIrrelevantParameter) ? new jQuery.Deferred().reject().promise() : new jQuery.Deferred().resolve().promise());
            sinon.stub(oService, "_storeValue");
            oPlugin1 = {};
            oPlugin1.getUserDefault = makeFunctionMerge(oFixture.P1);
            sinon.spy(oPlugin1, "getUserDefault");
            oPlugin2 = {};
            oPlugin2.getUserDefault = makeFunctionMerge(oFixture.P2);
            sinon.spy(oPlugin2, "getUserDefault");
            oService.registerPlugin(oPlugin1);
            oService.registerPlugin(oPlugin2);
            // test:
            oService.getValue("MYVALUE").done(function (oRes) {
                start();
                deepEqual(oRes, oFixture.expectedResult.value, "expected value ok");
                equal(!oFixture.expectedResult.p1NotCalled, oPlugin1.getUserDefault.calledOnce, "Plugin1 called");
                equal(!oFixture.expectedResult.p2NotCalled, oPlugin2.getUserDefault.calledOnce, "Plugin2 called");
                equal(oService._storeValue.calledOnce, oFixture.expectedResult.storeCalled, " store called?");
                if (oFixture.expectedResult.storeCalled) {
                    deepEqual(oService._storeValue.args[0], ["MYVALUE", oRes], "invoked with proper result");
                }
            });
        });
    });

    test("_arrayToObject", function () {
        deepEqual(oService._arrayToObject(["a", "b", "c"]), { a: {}, b: {}, c: {} }, "values ok");
    });

    test("_arrayToObject, empty", function () {
        deepEqual(oService._arrayToObject([]), {}, "values ok");
    });

    module("sap.ushell.services.UserDefaultParameters", {
        setup: function () {
            stop(); // suspend qUnit execution until the bootstrap finishes loading
            sap.ushell.bootstrap("local").done(start);
        },
        // This method is called after each test. Add every restoration code here
        teardown: function () {
            testUtils.restoreSpies(
                sap.ushell.utils.Error,
                jQuery.sap.log.error,
                sap.ushell.Container.getService
            );
            delete sap.ushell.Container;
        }
    });

    function transformParameters (aStringArray) {
        var obj = { simple: {}, extended: {} };
        if (!(aStringArray[0] && jQuery.isArray(aStringArray[0]))) {
            aStringArray = [aStringArray, []];
        }
        aStringArray[0].forEach(function (sParameterName) {
            obj.simple[sParameterName] = {};
        });
        if (aStringArray[1]) {
            aStringArray[1].forEach(function (sParameterName) {
                obj.extended[sParameterName] = {};
            });
        }
        return obj;
    }

    // two sample plugins, getValue on service,
    // check that two plugins are always invoked properly
    // check that "last one altering wins"
    // check that storage is invoked
    [{
        description: "[P1 and P2 contribute each one paramter] ",
        parameters: ["P1", "P2"],
        initial: undefined,
        P1: { value: 111 },
        P1Edit: { "P1": { editorMetadata: { "displayText": "P1Text" } }, "P2": {} },
        P2: { value: 333 },
        P2Edit: { "P1": {}, "P2": { editorMetadata: { "displayText": "P2Text" } } },
        expectedResult: {
            storeCalled: true,
            result: {
                "P1": { valueObject: { value: 111 }, editorMetadata: { "displayText": "P1Text" } },
                "P2": { valueObject: { value: 333 }, editorMetadata: { "displayText": "P2Text" } }
            },
            errCalled: false
        }
    }, {
        description: "[P1,P2 supplied, P3 not filled by plugin contribute each one paramter, note that first metadata is taken!] ",
        parameters: ["P1", "P2", "P3"],
        initial: undefined,
        P1: { value: 111 },
        P1Edit: { "P1": { editorMetadata: { "displayText": "P1Text" } }, "P2": {} },
        P2: { value: 333 },
        P2Edit: { "P1": {}, "P2": { editorMetadata: { "displayText": "P2Text" } } },
        expectedResult: {
            storeCalled: true,
            result: {
                "P1": { valueObject: { value: 111 }, editorMetadata: { "displayText": "P1Text" } },
                "P2": { valueObject: { value: 333 }, editorMetadata: { "displayText": "P2Text" } },
                "P3": { valueObject: {} }
            }
        }
    }, {
        description: "[P1,P2 colliding metadata from two plugins, note that first metadata is taken!] ",
        parameters: ["P1", "P2", "P3"],
        initial: undefined,
        P1: { value: 111 },
        P1Edit: { "P1": { editorMetadata: { "displayText": "P1Text" } }, "P2": {} },
        P2: { value: 333 },
        P2Edit: { "P1": { editorMetadata: { "displayText": "P1TextFrom2" } }, "P2": { editorMetadata: { "displayText": "P2TextFrom2" } } },
        expectedResult: {
            storeCalled: true,
            result: {
                "P1": { valueObject: { value: 111 }, editorMetadata: { "displayText": "P1Text" } },
                "P2": { valueObject: { value: 333 }, editorMetadata: { "displayText": "P2TextFrom2" } },
                "P3": { valueObject: {} }
            }
        }
    }, {
        description: "[P1,P2 colliding metadata from two plugins, sort order, first (highest prio) text is taken ] ",
        parameters: ["P1", "P2", "P3"],
        oComponentDataP1: { config: { "sap-priority": 10 } },
        oComponentDataP2: { config: { "sap-priority": 100 } },
        initial: undefined,
        P1: { value: 111 },
        P1Edit: { "P1": { editorMetadata: { "displayText": "P1TextFrom1" } }, "P2": {} },
        P2: { value: 333 },
        P2Edit: { "P1": { editorMetadata: { "displayText": "P1TextFrom2" } }, "P2": { editorMetadata: { "displayText": "P2TextFrom2" } } },
        expectedResult: {
            storeCalled: true,
            result: {
                "P1": { valueObject: { value: 111 }, editorMetadata: { "displayText": "P1TextFrom2" } },
                "P2": { valueObject: { value: 333 }, editorMetadata: { "displayText": "P2TextFrom2" } },
                "P3": { valueObject: {} }
            }
        }
    }].forEach(function (oFixture) {
        asyncTest("editorGetParameters integration test" + oFixture.description, function () {
            sinon.stub(sap.ushell.Container.getService("ClientSideTargetResolution"), "getUserDefaultParameterNames").returns(new jQuery.Deferred().resolve(transformParameters(oFixture.parameters)).promise());
            sap.ushell.Container.getUserDefaultPluginsPromise = function () {
                return new jQuery.Deferred().resolve()
                    .promise();
            };
            var stubErrorLog = sinon.spy(jQuery.sap.log, "error");
            var oPlugin1, oPlugin2;
            var oService = sap.ushell.Container.getService("UserDefaultParameters");
            sinon.stub(oService, "_getPersistedValue").returns(new jQuery.Deferred().resolve(oFixture.initial).promise());
            sinon.stub(oService, "_isRelevantParameter").returns(new jQuery.Deferred().resolve().promise());
            sinon.stub(oService, "_storeValue");
            // two plugins:
            oPlugin1 = { getComponentData: function () { return oFixture.oComponentDataP1; } };
            oPlugin1.getUserDefault = makeFunctionIf(oFixture.P1, "P1");
            oPlugin1.getEditorMetadata = makeFunction(oFixture.P1Edit);
            sinon.spy(oPlugin1, "getUserDefault");
            oPlugin2 = { getComponentData: function () { return oFixture.oComponentDataP2; } };
            oPlugin2.getUserDefault = makeFunctionIf(oFixture.P2, "P2");
            oPlugin2.getEditorMetadata = makeFunction(oFixture.P2Edit);
            sinon.spy(oPlugin2, "getUserDefault");
            oService.registerPlugin(oPlugin1);
            oService.registerPlugin(oPlugin2);
            oService.editorGetParameters().done(function (oReturnedParameters) {
                start();
                deepEqual(oReturnedParameters, oFixture.expectedResult.result, "correct result");
                // assure it is a deep copy!
                oFixture.P1.value = 777;
                deepEqual(oReturnedParameters, oFixture.expectedResult.result, "correct result");
                if (oFixture.expectedResult.errCalled !== false) {
                    ok(stubErrorLog.calledWith("The following parameter names have no editor metadata and thus likely no configured plugin:\n\"P3\"."), " error log called");
                }
                stubErrorLog.restore();
            }).fail(function () {
                start(1);
                ok(false, "Promise was supposed to succeed!");
                stubErrorLog.restore();
            });
        });
    });

    [
        { "description": "old format, single list", aArray: ["P1", "P2"], jointArr: ["P1", "P2"], extArr: [] },
        { "description": "e,u", aArray: [["P1", "P2"]], jointArr: ["P1", "P2"], extArr: [] },
        { "description": "a,superset", aArray: [["P1", "P2"], ["P1", "P2", "P3"]], jointArr: ["P1", "P2", "P3"], extArr: ["P1", "P2", "P3"] },
        { "description": "a,sub", aArray: [["P1", "P2"], ["P1"]], jointArr: ["P1", "P2"], extArr: ["P1"] },
        { "description": "disjoint", aArray: [["P1", "P3"], ["P2", "P4"]], jointArr: ["P1", "P2", "P3", "P4"], extArr: ["P2", "P4"] },
        { "description": "empty, list", aArray: [[], ["P1"]], jointArr: ["P1"], extArr: ["P1"] }
    ].forEach(function (oFixture) {
        asyncTest("editorGetParameters parameter processing: " + oFixture.description, function () {
            sinon.stub(sap.ushell.Container.getService("ClientSideTargetResolution"), "getUserDefaultParameterNames").returns(new jQuery.Deferred().resolve(transformParameters(oFixture.aArray)).promise());
            sap.ushell.Container.getUserDefaultPluginsPromise = function () {
                return new jQuery.Deferred().resolve().promise();
            };
            var stubErrorLog = sinon.spy(jQuery.sap.log, "error");
            var oService = sap.ushell.Container.getService("UserDefaultParameters");
            sinon.stub(oService, "_getPersistedValue").returns(new jQuery.Deferred().resolve(oFixture.initial).promise());
            sinon.stub(oService, "_isRelevantParameter").returns(new jQuery.Deferred().resolve().promise());
            sinon.stub(oService, "_storeValue");
            var oGetEditorStub = sinon.stub(oService, "_getEditorDataAndValue", function (a1, a2, a3, a4) {
                a1.resolve();
                return a1.promise();
            });
            oService.editorGetParameters().done(function (oReturnedParameters) {
                start();
                deepEqual(oGetEditorStub.getCall(0).args[1], oFixture.jointArr, "joint array ok");
                deepEqual(oGetEditorStub.getCall(0).args[2], oFixture.extArr, "extended Array ok");
                oGetEditorStub.restore();
            }).fail(function () {
                start(1);
                ok(false, "Promise was supposed to succeed!");
                stubErrorLog.restore();
            });
        });
    });

    [{
        description: "[P1,P2 colliding metadata from two plugins, sort order, first (highest prio) text is taken ] ",
        parameters: [["P1", "P3"], ["P2"]],
        oComponentDataP1: { config: { "sap-priority": 10 } },
        oComponentDataP2: { config: { "sap-priority": 100 } },
        initial: {
            "P3": { noEdit: true, value: "p3value" },
            "P1": { noEdit: true, alwaysAskPlugin: true, value: 111 },
            "P2": { value: 333 }
        },
        "P1": { value: 112 },
        "P1Edit": { "P1": { editorMetadata: { "displayText": "P1TextFrom1" } } },
        "P2": { value: 333 },
        "P2Edit": {
            "P1": { editorMetadata: { "displayText": "P1TextFrom2" } },
            "P2": { editorMetadata: { "displayText": "P2TextFrom2" } }
        },
        expectedResult: {
            storeCalled: true,
            result: {
                "P1": {
                    "editorMetadata": { "displayText": "P1TextFrom2" },
                    "valueObject": { "value": 112 }
                },
                "P2": {
                    valueObject: { value: 333 },
                    editorMetadata: { "displayText": "P2TextFrom2", "extendedUsage": true }
                }
            }
        }
    }].forEach(function (oFixture) {
        asyncTest("editorGetParameters integration test noEdit (no P1, but storage on P1!)" + oFixture.description, function () {
            sinon.stub(sap.ushell.Container.getService("ClientSideTargetResolution"), "getUserDefaultParameterNames").returns(new jQuery.Deferred().resolve(transformParameters(oFixture.parameters)).promise());
            sap.ushell.Container.getUserDefaultPluginsPromise = function () {
                return new jQuery.Deferred().resolve().promise();
            };
            var stubErrorLog = sinon.spy(jQuery.sap.log, "error");
            var oPlugin1, oPlugin2;
            var oService = sap.ushell.Container.getService("UserDefaultParameters");
            sinon.stub(oService, "_getPersistedValue", function (sPN) { return new jQuery.Deferred().resolve(oFixture.initial[sPN]).promise(); });
            sinon.stub(oService, "_isRelevantParameter").returns(new jQuery.Deferred().resolve().promise());
            sinon.stub(oService, "_storeValue");
            // two plugins:
            oPlugin1 = { getComponentData: function () { return oFixture.oComponentDataP1; } };
            oPlugin1.getUserDefault = makeFunctionIf(oFixture.P1, "P1");
            oPlugin1.getEditorMetadata = makeFunction(oFixture.P1Edit);
            sinon.spy(oPlugin1, "getUserDefault");
            oPlugin2 = { getComponentData: function () { return oFixture.oComponentDataP2; } };
            oPlugin2.getUserDefault = makeFunctionIf(oFixture.P2, "P2");
            oPlugin2.getEditorMetadata = makeFunction(oFixture.P2Edit);
            sinon.spy(oPlugin2, "getUserDefault");
            oService.registerPlugin(oPlugin1);
            oService.registerPlugin(oPlugin2);
            oService.editorGetParameters().done(function (oReturnedParameters) {
                start();
                deepEqual(oReturnedParameters, oFixture.expectedResult.result, "correct result");
                ok(!stubErrorLog.called, "error log not called!");
                if (oFixture.expectedResult.storeCalled) {
                    equal(oService._storeValue.getCall(0).args[0], "P1", "p1 store called");
                    deepEqual(oService._storeValue.getCall(0).args[1], { value: 112 }, "p1 store called with args");
                }
                stubErrorLog.restore();
            }).fail(function () {
                start(1);
                ok(false, "Promise was supposed to succeed!");
                stubErrorLog.restore();
            });
        });
    });

    // two sample plugins, getValue on Service, check failures of plugins
    // verify behaviour: evaluation continues, error log is raised
    // check that two plugins are always invoked properly
    // check that "last one altering wins"
    // check that storage is invoked
    [{
        description: "[P1 and P2, first rejects]",
        parameters: ["P1", "P2"],
        initial: undefined,
        P1: "reject",
        P2: { value: 222 },
        expectedResult: {
            storeCalled: true,
            result: { value: 222 },
            errorMsg: "invocation of getUserDefault(\"P1\") for plugin 'name of plugin could not be determined' rejected."
        }
    }, {
        description: "[P1 and P2, 2nd rejects]",
        parameters: ["P1", "P2"],
        initial: undefined,
        P1: { value: 111 },
        P2: "reject",
        expectedResult: {
            storeCalled: true,
            result: { value: 111 },
            errorMsg: "invocation of getUserDefault(\"P1\") for plugin com.sap.p2 rejected."
        }
    }].forEach(function (oFixture) {
        asyncTest("getValue tests, plugin failures" + oFixture.description, function () {
            sinon.stub(sap.ushell.Container.getService("ClientSideTargetResolution"), "getUserDefaultParameterNames").returns(new jQuery.Deferred().resolve(transformParameters(oFixture.parameters)).promise());
            sap.ushell.Container.getUserDefaultPluginsPromise = function () {
                return new jQuery.Deferred().resolve().promise();
            };
            sinon.spy(jQuery.sap.log, "error");
            var oPlugin1, oPlugin2;
            var oService = sap.ushell.Container.getService("UserDefaultParameters");
            sinon.stub(oService, "_getPersistedValue").returns(new jQuery.Deferred().resolve(oFixture.initial).promise());
            sinon.stub(oService, "_isRelevantParameter").returns(new jQuery.Deferred().resolve().promise());
            sinon.stub(oService, "_storeValue");
            // two plugins:
            oPlugin1 = { getComponentData: function () { return oFixture.oComponentDataP1; } };
            oPlugin1.getUserDefault = makeFunctionIf(oFixture.P1, "P1");
            sinon.spy(oPlugin1, "getUserDefault");
            oPlugin2 = { getComponentData: function () { return oFixture.oComponentDataP2; } };
            oPlugin2.getUserDefault = makeFunctionIf(oFixture.P2, "P1");
            oPlugin2.getMetadata = function () { return { getComponentName: function () { return "com.sap.p2"; } }; };
            sinon.spy(oPlugin2, "getUserDefault");
            oService.registerPlugin(oPlugin1);
            oService.registerPlugin(oPlugin2);
            oService.getValue("P1").done(function (oValue) {
                start();
                deepEqual(oValue, oFixture.expectedResult.result, "correct result");
                ok(jQuery.sap.log.error.called, "error was called");
                equal(jQuery.sap.log.error.args[0][0],
                    oFixture.expectedResult.errorMsg, "error was called with proper args");
                jQuery.sap.log.error.restore();
            }).fail(function () {
                start(1);
                ok(false, "Promise was supposed to succeed!");
            });
        });
    });

    // two sample plugins, getValue on service,
    // check that two plugins are always invoked properly
    // check that "last one altering wins"
    // check that storage is invoked
    [
        { description: "do not wait for promise" }
    ].forEach(function (oFixture) {
        asyncTest("editorGetParameters no parameters, do not wait for promise", function () {
            sinon.stub(sap.ushell.Container.getService("ClientSideTargetResolution"), "getUserDefaultParameterNames").returns(new jQuery.Deferred().resolve({ simple: {}, extended: {} }).promise());
            var oService = sap.ushell.Container.getService("UserDefaultParameters");
            // two plugins:
            var oPlugin1, oPlugin2;
            oPlugin1 = {};
            oPlugin1.getUserDefault = makeFunctionIf(oFixture.P1, "P1");
            oPlugin1.getEditorMetadata = makeFunction(oFixture.P1Edit);
            sinon.spy(oPlugin1, "getUserDefault");
            oPlugin2 = {};
            oPlugin2.getUserDefault = makeFunctionIf(oFixture.P2, "P2");
            oPlugin2.getEditorMetadata = makeFunction(oFixture.P2Edit);
            sinon.spy(oPlugin2, "getUserDefault");
            oService.registerPlugin(oPlugin1);
            oService.registerPlugin(oPlugin2);
            oService.editorGetParameters().done(function (oReturnedParameters) {
                start();
                deepEqual(oReturnedParameters, {}, "correct result");
            }).fail(function () {
                start(1);
                ok(false, "Promise was supposed to succeed!");
            });
        });
    });

    test("_getComponentNameOfPlugin", function () {
        var oService = sap.ushell.Container.getService("UserDefaultParameters"),
            oPlugin = {};
        deepEqual(oService._getComponentNameOfPlugin(oPlugin), "'name of plugin could not be determined'", "Empty Object: Expected return value.");
        oPlugin = 5;
        deepEqual(oService._getComponentNameOfPlugin(oPlugin), "'name of plugin could not be determined'", "Numeric value as plugin: Expected return value.");
        oPlugin = { getMetadata: function () { } };
        deepEqual(oService._getComponentNameOfPlugin(oPlugin), "'name of plugin could not be determined'", "Plugin without getComponentName: Expected return value.");
        oPlugin = {
            getMetadata: function () {
                return {
                    getComponentName: function () {
                        return "PluginName";
                    }
                };
            }
        };
        deepEqual(oService._getComponentNameOfPlugin(oPlugin), "PluginName", "Plugin with all relevant methods: Expected return value.");
    });

    [{
        "description": "hasRelevantMaintainableParameters resolves without an argument",
        "userDefaultParameterNames": {},
        "noEdit": {
            "present": false,
            "mixed": false
        },
        "getValueRejects": false,
        "expectedResult": undefined
    }, {
        "description": "hasRelevantMaintainableParameters resolves with true ",
        "userDefaultParameterNames": {
            "aAllParameterNames": ["foo", "bar"],
            "aExtendedParameterNames": ["bar"],
            "oMetadataObject": {
                "foo": {},
                "bar": {}
            }
        },
        "noEdit": {
            "present": false,
            "mixed": false
        },
        "getValueRejects": false,
        "expectedResult": true
    }, {
        "description": "hasRelevantMaintainableParameters resolves with false, no editable parameters",
        "userDefaultParameterNames": {
            "aAllParameterNames": ["foo", "bar"],
            "aExtendedParameterNames": ["bar"],
            "oMetadataObject": {
                "foo": {},
                "bar": {}
            }
        },
        "noEdit": {
            "present": true,
            "mixed": false
        },
        "getValueRejects": false,
        "expectedResult": false
    }, {
        "description": "hasRelevantMaintainableParameters resolves with true",
        "userDefaultParameterNames": {
            "aAllParameterNames": ["foo", "bar"],
            "aExtendedParameterNames": ["bar"],
            "oMetadataObject": {
                "foo": {},
                "bar": {}
            }
        },
        "noEdit": {
            "present": true,
            "mixed": true
        },
        "getValueRejects": false,
        "expectedResult": true
    }, {
        "description": "hasRelevantMaintainableParameters resolves without an argument, getValue rejected",
        "userDefaultParameterNames": {
            "aAllParameterNames": ["foo", "bar"],
            "aExtendedParameterNames": ["bar"],
            "oMetadataObject": {
                "foo": {},
                "bar": {}
            }
        },
        "noEdit": {
            "present": true,
            "mixed": true
        },
        "getValueRejects": true,
        "expectedResult": undefined
    }].forEach(function (oFixture) {
        asyncTest("hasRelevantMaintainableParameters: " + oFixture.description, function () {
            var oService = sap.ushell.Container.getService("UserDefaultParameters");

            sinon.stub(oService, "_getUserDefaultParameterNames", function () {
                var oDeferred = new jQuery.Deferred();
                oDeferred.resolve(oFixture.userDefaultParameterNames);
                return oDeferred.promise();
            });

            sinon.stub(oService, "getValue", function (sParameter) {
                var oDeferred = new jQuery.Deferred();
                if (oFixture.getValueRejects) {
                    oDeferred.reject("failed to retrieve value for given parameter");
                } else if (oFixture.noEdit.present) {
                    if (oFixture.noEdit.mixed) {
                        if (sParameter === "foo") {
                            oDeferred.resolve({ "noEdit": true });
                        } else {
                            oDeferred.resolve({});
                        }
                    } else {
                        oDeferred.resolve({ "noEdit": true });
                    }
                } else {
                    oDeferred.resolve({});
                }
                return oDeferred.promise();
            });

            oService.hasRelevantMaintainableParameters().done(function (bHasRelevantParameters) {
                start();
                ok(oFixture.expectedResult === bHasRelevantParameters, "hasRelevantMaintainableParameters resolves correctly");
            }).fail(function () {
                start();
                // hasRelevantMaintainableParameters should never reject
                ok(false);
            });
        });
    });

    [{
        testDescription: "overlapping lists",
        oParametersAndExtendedParameters: {
            simple: { "P1": {}, "P2": {} },
            extended: { "P3": {}, "P2": {} }
        },
        expected: {
            simple: ["P1", "P2"],
            extended: ["P2", "P3"],
            allParameters: ["P1", "P2", "P3"]
        }
    }, {
        testDescription: "extended empty",
        oParametersAndExtendedParameters: {
            simple: { "P1": {}, "P2": {} },
            extended: {}
        },
        expected: {
            simple: ["P1", "P2"],
            extended: [],
            allParameters: ["P1", "P2"]
        }
    }, {
        testDescription: "simple empty",
        oParametersAndExtendedParameters: {
            simple: {},
            extended: { "P1": {}, "P2": {} }
        },
        expected: {
            simple: [],
            extended: ["P1", "P2"],
            allParameters: ["P1", "P2"]
        }
    }, {
        testDescription: "simple undefined",
        oParametersAndExtendedParameters: {
            simple: undefined,
            extended: { "P1": {}, "P2": {} }
        },
        expected: {
            simple: [],
            extended: ["P1", "P2"],
            allParameters: ["P1", "P2"]
        }
    }].forEach(function (oFixture) {
        test("_extractKeyArrays: result when " + oFixture.testDescription, function () {
            var oService = sap.ushell.Container.getService("UserDefaultParameters");
            // act
            var oResult = oService._extractKeyArrays(oFixture.oParametersAndExtendedParameters);
            deepEqual(oResult, oFixture.expected, "result ok");
        });
    });

    [{
        testDescription: "value is deleted from editor",
        sParameterName: "P1",
        oParameterValue: { value: undefined }, // deleted
        expectedParameters: {
            parameterName: "P1",
            parameterValue: {}
        }
    }, {
        testDescription: "value is entered from editor",
        sParameterName: "P1",
        oParameterValue: { value: "ABCD" },
        expectedParameters: {
            parameterName: "P1",
            parameterValue: {
                "_shellData": { "storeDate": "<ANY_STRING>" },
                "value": "ABCD"
            }
        }
    }].forEach(function (oFixture) {
        asyncTest("_storeValue(): Correct event fired when " + oFixture.testDescription, function () {
            var oService = sap.ushell.Container.getService("UserDefaultParameters");

            var oGetServiceStub = sinon.stub(sap.ushell.Container, "getService");
            oGetServiceStub.withArgs("UserDefaultParameterPersistence").returns({
                saveParameterValue: sinon.stub().returns(jQuery.when())
            });

            oService.attachValueStored(fnListener);
            oService.editorSetValue(oFixture.sParameterName, oFixture.oParameterValue).always(function () {
                oService.detachValueStored(fnListener);
            });

            function fnListener (oEvent/*, oValue*/) {
                start();
                strictEqual(typeof oEvent, "object", "event listener obtained an object as first argument");
                strictEqual(oEvent.getId(), "valueStored", "event id is 'valueStored'");

                var oParameters = oEvent.getParameters();
                if (!oParameters.parameterValue) {
                    ok(false, "found parameterValue member of event parameters");
                    return;
                }

                if (oFixture.expectedParameters
                    && oFixture.expectedParameters.parameterValue
                    && oFixture.expectedParameters.parameterValue._shellData
                    && oFixture.expectedParameters.parameterValue._shellData.storeDate === "<ANY_STRING>") {

                    if (!oParameters.parameterValue._shellData) {
                        ok(false, "_shellData was found among event parameters");
                        return;
                    }
                    ok(true, "_shellData was found among event parameters");

                    strictEqual(typeof oParameters.parameterValue._shellData.storeDate, "string", "storeDate is a string");
                    delete oParameters.parameterValue._shellData.storeDate;
                    delete oFixture.expectedParameters.parameterValue._shellData.storeDate;
                }

                deepEqual(oEvent.getParameters(), oFixture.expectedParameters, "event contains the expected parameters");
            }
        });
    });

    asyncTest("_storeValue(): ValueStored event registration and fire event", function () {
        var fnListener, oEventResult = { callCount: 0 },
            oService = sap.ushell.Container.getService("UserDefaultParameters"),
            oValue = { value: "Value1" },
            oValue2 = { value: "Value2" };
        fnListener = function (oEvent) {
            oEventResult.callCount += 1;
            oEventResult.parameters = oEvent.getParameters();
        };

        // code under test (deregistration)
        oService.attachValueStored(fnListener);
        oService.detachValueStored(fnListener);
        oService.editorSetValue("Param1", oValue).done(function () {
            ok(oEventResult.callCount === 0, "listener not called");
            oService.attachValueStored(fnListener);
            // code under test (registration)
            oService.editorSetValue("Param1", oValue).done(function () {
                ok(oEventResult.callCount === 1, "listener called once");
                deepEqual(oEventResult.parameters.parameterName, "Param1", "Event fired with correct parameter name.");
                deepEqual(oEventResult.parameters.parameterValue, oValue, "Event fired with correct value object.");
                // code under test (listener called twice )
                oService.editorSetValue("Param2", oValue2).done(function () {
                    ok(oEventResult.callCount === 2, "listener called twice");
                    deepEqual(oEventResult.parameters.parameterName, "Param2", "Event fired with correct parameter name.");
                    deepEqual(oEventResult.parameters.parameterValue, oValue2, "Event fired with correct value object.");
                    start();
                });
            });
        });
    });

    [{
        description: " Simple , no deletion",
        valueObject: { value: "1000" },
        inExtendedUse: false,
        expectDeletion: false
    }, {
        description: " simple value is initial deletion",
        valueObject: { value: undefined },
        inExtendedUse: false,
        expectDeletion: true
    }, {
        description: " Extended,  Extended in Use , no deletion",
        valueObject: {
            value: undefined,
            extendedValue: {}
        },
        inExtendedUse: true,
        expectDeletion: false
    }, {
        description: " Extended, Extended Not in Use, deletion",
        valueObject: {
            value: undefined,
            extendedValue: {}
        },
        inExtendedUse: false,
        expectDeletion: true
    }, {
        description: " Simple Extended,  Extended in Use , no deletion",
        valueObject: {
            value: "1000",
            extendedValue: { "a": 1 }
        },
        inExtendedUse: true,
        expectDeletion: false,
        expectedSavedValue: { value: "1000", extendedValue: { "a": 1 } }
    }, {
        description: " Simple Extended, Extended Not in Use, no deletion",
        valueObject: {
            value: "1000",
            extendedValue: { "a": 1 }
        },
        inExtendedUse: false,
        expectDeletion: false,
        expectedSavedValue: { value: "1000" }
    }].forEach(function (oFixture) {
        asyncTest("_storeValue(): parameter deletion  when " + oFixture.description, function () {
            var oUserDefaultParametersService = sap.ushell.Container.getService("UserDefaultParameters"),
                oClientSideTargetResolutionService = sap.ushell.Container.getService("ClientSideTargetResolution"),
                oGetUserDefaultParamNamesResult = { simple: {}, extended: {} };

            if (oFixture.inExtendedUse) {
                oGetUserDefaultParamNamesResult.extended.P1 = {};
            }
            oGetUserDefaultParamNamesResult.simple.P1 = {};

            sinon.stub(sap.ushell.Container.getService("UserDefaultParameterPersistence"), "saveParameterValue", function () {
                return new jQuery.Deferred().resolve().promise();
            });
            sinon.stub(oClientSideTargetResolutionService, "getUserDefaultParameterNames").returns(new jQuery.Deferred().resolve(oGetUserDefaultParamNamesResult).promise());
            // code under test (deregistration)
            oUserDefaultParametersService._storeValue("P1", oFixture.valueObject, true).done(function () {
                start();
                equal(sap.ushell.Container.getService("UserDefaultParameterPersistence").saveParameterValue.args[0][0], "P1", "correct parameter name");
                if (oFixture.expectDeletion) {
                    equal(sap.ushell.Container.getService("UserDefaultParameterPersistence").saveParameterValue.args[0][1], undefined, "value undefined");
                } else {
                    ok(sap.ushell.Container.getService("UserDefaultParameterPersistence").saveParameterValue.args[0][1] !== undefined, "value not undefined");
                    if (!oFixture.expectedSavedValue) {
                        oFixture.expectedSavedValue = oFixture.valueObject;
                    }
                    equal(sap.ushell.Container.getService("UserDefaultParameterPersistence").saveParameterValue.args[0][1].value, oFixture.expectedSavedValue.value, "correct value persisted");
                    deepEqual(sap.ushell.Container.getService("UserDefaultParameterPersistence").saveParameterValue.args[0][1].extendedValue, oFixture.expectedSavedValue.extendedValue, "correct extended value persisted");
                }
            }).fail(function () {
                start();
                ok(false, "expect done");
            }).always(function () {
                sap.ushell.Container.getService("UserDefaultParameterPersistence").saveParameterValue.restore();
            });
        });
    });

    [{
        description: "not present -> (1) getValue(), Plugin returns undefined\n (2) getValue(), plugin not asked (3) editorSetValue(undefined), (4) getValue() -> plugin asked ",
        oComponentDataP1: { config: { "sap-priority": 10 } },
        P1: { value: undefined }
    }].forEach(function (oFixture) {
        asyncTest("UserDefaultService plugin invocation in case of undefined and reset " + oFixture.description, function () {
            sap.ushell.Container.getUserDefaultPluginsPromise = function () {
                return new jQuery.Deferred().resolve().promise();
            };

            var stubErrorLog = sinon.spy(jQuery.sap.log, "error");
            var oPlugin;
            var oService = sap.ushell.Container.getService("UserDefaultParameters");

            sinon.stub(oService, "_getStoreDate").returns("11.11.2016");
            sinon.spy(oService, "_getPersistedValue");
            sinon.stub(oService, "_isRelevantParameter").returns(new jQuery.Deferred().resolve().promise());
            sinon.spy(oService, "_storeValue");

            // two plugins:
            oPlugin = { getComponentData: function () { return oFixture.oComponentDataP1; } };
            oPlugin.getUserDefault = makeFunctionIf(oFixture.P1, "P1");
            var oPluginCall = sinon.spy(oPlugin, "getUserDefault");
            oService.registerPlugin(oPlugin);

            sap.ushell.Container.getService("UserDefaultParameterPersistence").deleteParameter("P1").done(function () {
                // (1) Call getValue the first time
                oService.getValue("P1").done(function (oReturnedParameters) {
                    start();
                    ok(true, "promise was resolved after first call to #getValue('P1')");
                    equal(oPluginCall.callCount, 1, "Plugin #getUserDefault method invoked");
                    equal(oReturnedParameters.value, undefined, "Plugin 1 #getValue returned undefined");
                    equal(oService._storeValue.getCall(0) && oService._storeValue.getCall(0).args[0], "P1", "#_storeValue was called with 'P1' as first argument");
                    deepEqual(oService._storeValue.getCall(0) && oService._storeValue.getCall(0).args[1], { _shellData: { "storeDate": "11.11.2016" }, value: undefined }, "#_storeValue was called with the expected second argument");
                    stop();

                    // (2) Call getValue the second time
                    oService.getValue("P1").done(function (oReturnedParameters2) {
                        start();
                        ok(true, "promise was resolved after second call to #getValue('P1')");
                        equal(oPluginCall.callCount, 1, "Plugin #getUserDefault was not invoked the second time");
                        equal(oReturnedParameters2.value, undefined, "promise was resolved to 'undefined'");

                        equal(oService._storeValue.callCount, 1, "#_storeValue was not called");
                        stop();

                        oService.editorSetValue("P1", { value: undefined }).done(function () {
                            start();

                            ok(true, "promise was resolved after value 'P1' was set to '{ value: undefined }' via #editorSetValue");
                            equal(oService._storeValue.callCount, 2, "#_storeValue was called after parameter was re-set");
                            equal(oService._storeValue.getCall(1) && oService._storeValue.getCall(1).args[0], "P1", "#_storeValue was called with 'P1' as first argument");
                            deepEqual(oService._storeValue.getCall(1) && oService._storeValue.getCall(1).args[1], { value: undefined }, "#_storeValue was called with '{ value: undefined }' as second argument");
                            deepEqual(oService._storeValue.getCall(1) && oService._storeValue.getCall(1).args[2], true, "#_storeValue was called with 'true' (bFromEditor) as third argument");

                            stop();

                            // (3) Call getValue the third time
                            oService.getValue("P1").done(function () {
                                ok(true, "promise was resolved after third call to #getValue('P1')");

                                equal(oPluginCall.callCount, 2, "Plugin #getUserDefault was invoked the third time");
                                equal(oService._storeValue.callCount, 3, "#_storeValue was called");
                                equal(oService._storeValue.getCall(2) && oService._storeValue.getCall(2).args[0], "P1", "#_storeValue was called with 'P1' as first argument");
                                deepEqual(oService._storeValue.getCall(2) && oService._storeValue.getCall(2).args[1], {
                                    "_shellData": {
                                        "storeDate": "11.11.2016"
                                    },
                                    value: undefined
                                }, "#_storeValue was called with { _shellData: { storeData: '11.11.2016' }, value: undefined }");
                                start();
                            }).fail(function () {
                                start();
                                ok(false, "promise was resolved after third call to #getValue('P1')");
                                stubErrorLog.restore();
                            });
                        }).fail(function () {
                            start();
                            ok(false, "promise was resolved after value 'P1' was set to '{ value: undefined }' via #editorSetValue");
                            stubErrorLog.restore();
                        });
                    }).fail(function () {
                        start();
                        ok(false, "promise was resolved after second call to #getValue('P1')");
                        stubErrorLog.restore();
                    });
                }).fail(function () {
                    start();
                    ok(false, "promise was resolved after first call to #getValue('P1')");
                    stubErrorLog.restore();
                });
            });
        });
    });

    [{
        description: " plain paramer only",
        parameters: {
            simple: { "P2": {} },
            extended: { "P1": {}, "P3": {} }
        },
        expectedResult: {
            "aAllParameterNames": [
                "P1",
                "P2",
                "P3"
            ],
            "aExtendedParameterNames": [
                "P1",
                "P3"
            ],
            "oMetadataObject": {
                "P1": {},
                "P2": {},
                "P3": {}
            }
        }
    }, {
        description: " empty ",
        parameters: {
            simple: {},
            extended: {}
        },
        expectedResult: {
            "aAllParameterNames": [],
            "aExtendedParameterNames": [],
            "oMetadataObject": {}
        }
    }, {
        description: " overlap ",
        parameters: {
            simple: { "P2": {} },
            extended: { "P2": {}, "P3": {} }
        },
        testRelevant: "P2",
        expectedResult: {
            "aAllParameterNames": ["P2", "P3"],
            "aExtendedParameterNames": ["P2", "P3"],
            "oMetadataObject": { "P2": {}, "P3": {} }
        }
    }].forEach(function (oFixture) {
        asyncTest("_getUserDefaultParameterNames when " + oFixture.description, function () {
            sinon.stub(sap.ushell.Container.getService("ClientSideTargetResolution"), "getUserDefaultParameterNames").returns(new jQuery.Deferred().resolve(oFixture.parameters).promise());
            var oService = sap.ushell.Container.getService("UserDefaultParameters");
            oService._getUserDefaultParameterNames().done(function (oResult) {
                start(1);
                deepEqual(oResult, oFixture.expectedResult, "correct result");
            }).fail(function () {
                start(1);
                ok(false, "Promise was supposed to succeed!");
            });
        });
    });

    [{
        description: " relevant both ",
        parameters: {
            simple: { "P2": {} },
            extended: { "P2": {}, "P3": {} }
        },
        testRelevant: "P2",
        isRelevant: true
    }, {
        description: " not relevant ",
        parameters: {
            simple: { "P2": {} },
            extended: { "P2": {}, "P3": {} }
        },
        testRelevant: "P7",
        isRelevant: false
    }, {
        description: " relevant extended ",
        parameters: {
            simple: { "P1": {} },
            extended: { "P2": {}, "P3": {} }
        },
        testRelevant: "P3",
        isRelevant: true
    }, {
        description: " relevant simple only",
        parameters: {
            simple: { "P1": {} },
            extended: { "P2": {}, "P3": {} }
        },
        testRelevant: "P1",
        isRelevant: true
    }, {
        description: "empty string",
        parameters: {
            simple: { "P1": {} },
            extended: { "P2": {}, "P3": {} }
        },
        testRelevant: "",
        isRelevant: false
    }].forEach(function (oFixture) {
        asyncTest("_getUserDefaultParameterNames when " + oFixture.description, function () {
            sinon.stub(sap.ushell.Container.getService("ClientSideTargetResolution"), "getUserDefaultParameterNames").returns(new jQuery.Deferred().resolve(oFixture.parameters).promise());
            var oService = sap.ushell.Container.getService("UserDefaultParameters");
            oService._isRelevantParameter(oFixture.testRelevant).done(function () {
                start(1);
                equal(true, oFixture.isRelevant, "was relevant");
            }).fail(function () {
                start(1);
                equal(false, oFixture.isRelevant, "is not relevant");
            });
        });
    });
});
