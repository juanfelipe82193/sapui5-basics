// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.adapters.local.AppStateAdapter
 */
sap.ui.require([
    "sap/ushell/test/utils",
    "sap/ushell/services/_AppState/AppStatePersistencyMethod",
    "sap/ushell/services/Personalization"
], function (
    testUtils,
    AppStatePersistencyMethod
    // Personalization
) {
    "use strict";

    /* global asyncTest, deepEqual, equal, module, ok, start, test, sinon */

    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.adapters.local.AppStateAdapter");

    module("sap.ushell.adapters.local.AppStateAdapter", {
        // This method is called after each test. Add every restoration code here.
        teardown: function () {
            testUtils.restoreSpies(
                jQuery.sap.require
            );
        }
    });

    test("ctor signature", function () {
        var oSystem,
            sParameters,
            oConfig,
            oAdapter;
        oAdapter = new sap.ushell.adapters.local.AppStateAdapter(oSystem, sParameters, oConfig);
        equal(typeof oAdapter, "object");
        ["saveAppState", "loadAppState"].forEach(function (sFctName) {
            equal(typeof oAdapter[sFctName], "function", "Function " + sFctName + "present");
        });
    });

    function fakePersonalizationService (sTestKey) {
        var oTheMockContainer;
        // fake Container Object
        oTheMockContainer = {
            setItemValue: function (/*sKey, sValue*/) {
                // do nothing;
            },
            save: function () {
                var savePromise = new jQuery.Deferred();
                if (this._sKey === sTestKey) {
                    savePromise.resolve();
                } else {
                    savePromise.reject("Simulated save failure");
                }
                return savePromise.promise();
            }
        };
        // fake PersonalizationService
        return {
            _oTheMockContainer: oTheMockContainer,
            constants: sap.ushell.services.Personalization.prototype.constants,
            createEmptyContainer: function (sActualKey/*, oScope*/) {
                var createPromise;
                oTheMockContainer._sKey = sActualKey;
                createPromise = new jQuery.Deferred();
                //  setTimeout(function () {
                if (sActualKey === "FAILONCREATE") {
                    createPromise.reject("createEmptyContainerFailed");
                } else {
                    createPromise.resolve(oTheMockContainer);
                }
                return createPromise.promise();
            }
        };
    }

    asyncTest("saveAppState", function () {
        var oSystem,
            sParameters,
            oConfig,
            oAdapter,
            oFakePersService,
            oPromise,
            createEmptyContainerSpy,
            setItemValueSpy,
            saveSpy;
        oAdapter = new sap.ushell.adapters.local.AppStateAdapter(oSystem, sParameters, oConfig);
        oFakePersService = fakePersonalizationService("AKEY");
        oAdapter._getPersonalizationService = function () { return oFakePersService; };
        createEmptyContainerSpy = sinon.spy(oFakePersService, "createEmptyContainer");
        setItemValueSpy = sinon.spy(oFakePersService._oTheMockContainer, "setItemValue");
        saveSpy = sinon.spy(oFakePersService._oTheMockContainer, "save");
        // test
        oPromise = oAdapter.saveAppState("AKEY", "ASESSIONKEY", JSON.stringify({ a: 1 }), "appName", "aComponent");
        oPromise.done(function () {
            start();
            ok(createEmptyContainerSpy.calledOnce, "createEmptyContainer called");
            deepEqual(createEmptyContainerSpy.args[0], ["AKEY", {
                "keyCategory": "GENERATED_KEY",
                "writeFrequency": "HIGH",
                "clientStorageAllowed": false
            }], "createEmptyContainer called with proper args");

            deepEqual(setItemValueSpy.args[0], ["appStateData", JSON.stringify({
                a: 1
            })], "container.setData called with proper args");
            ok(saveSpy.calledOnce, "container save called");
        }).fail(function () {
            start();
            ok(false, "should succeed");
        });
    });

    asyncTest("saveAppState fails", function () {
        var oSystem,
            sParameters,
            oConfig,
            oAdapter,
            oFakePersService,
            createEmptyContainerSpy,
            setItemValueSpy,
            saveSpy;
        oAdapter = new sap.ushell.adapters.local.AppStateAdapter(oSystem, sParameters, oConfig);
        oFakePersService = fakePersonalizationService("AKEY");
        oAdapter._getPersonalizationService = function () { return oFakePersService; };
        createEmptyContainerSpy = sinon.spy(oFakePersService, "createEmptyContainer");
        setItemValueSpy = sinon.spy(oFakePersService._oTheMockContainer, "setItemValue");
        saveSpy = sinon.spy(oFakePersService._oTheMockContainer, "save");
        //test
        oAdapter.saveAppState("AFAILINGKEY", "ASESSIONKEY", JSON.stringify({ a: 1 }), "appName", "aComponent").done(function () {
            start();
            ok(false, "expect fail");
        }).fail(function (sMsg) {
            start();
            equal(sMsg, "Simulated save failure", "proper message propagated");
            ok(createEmptyContainerSpy.calledOnce, "createEmptyContainer called");
            deepEqual(createEmptyContainerSpy.args[0], ["AFAILINGKEY", {
                "keyCategory": "GENERATED_KEY",
                "writeFrequency": "HIGH",
                "clientStorageAllowed": false
            }], "createEmptyContainer called with proper args");
            deepEqual(setItemValueSpy.args[0], ["appStateData", JSON.stringify({
                a: 1
            })], "container.setData called with proper args");
            ok(saveSpy.calledOnce, "container save called");
            ok(true, "should succeed");
        });
    });

    asyncTest("saveAppState fail on Create", function () {
        var oSystem,
            sParameters,
            oConfig,
            oAdapter,
            oFakePersService,
            createEmptyContainerSpy,
            setItemValueSpy;
        oAdapter = new sap.ushell.adapters.local.AppStateAdapter(oSystem, sParameters, oConfig);
        oFakePersService = fakePersonalizationService("AKEY");
        oAdapter._getPersonalizationService = function () { return oFakePersService; };
        createEmptyContainerSpy = sinon.spy(oFakePersService, "createEmptyContainer");
        setItemValueSpy = sinon.spy(oFakePersService._oTheMockContainer, "setItemValue");
        sinon.spy(oFakePersService._oTheMockContainer, "save");
        //test
        oAdapter.saveAppState("FAILONCREATE", "ASESSIONKEY", JSON.stringify({ a: 1 }), "appName", "aComponent").done(function () {
            start();
            ok(false, "expect fail");
        }).fail(function (sMsg) {
            start();
            equal(sMsg, "createEmptyContainerFailed", "proper message propagated");
            ok(createEmptyContainerSpy.calledOnce, "createEmptyContainer called");
            deepEqual(createEmptyContainerSpy.args[0], ["FAILONCREATE", {
                "keyCategory": "GENERATED_KEY",
                "writeFrequency": "HIGH",
                "clientStorageAllowed": false
            }], "createEmptyContainer called with proper args");
            deepEqual(setItemValueSpy.called, false, "setItem etc. not called");
            ok(true, "should succeed");
        });
    });

    function fakePersonalizationServiceLoad (sTestKey, sValue) {
        var oTheMockContainer,
            oMap = {},
            sKey;
        // fake Container Object
        oTheMockContainer = {
            getItemValue: function (sKey) {
                return oMap[sKey];
            }
        };

        sKey = sTestKey;
        oMap.appStateData = sValue;
        // fake PersonalizationService
        return {
            _oTheMockContainer: oTheMockContainer,
            constants: sap.ushell.services.Personalization.prototype.constants,
            getContainer: function (sActualKey/*, oScope*/) {
                var getPromise;
                oTheMockContainer._sKey = sActualKey;
                getPromise = new jQuery.Deferred();
                //  setTimeout(function () {
                if (sActualKey === "FAILONGET") {
                    getPromise.reject("getContainerFailed");
                } else {
                    getPromise.resolve(oTheMockContainer);
                }
                return getPromise.promise();
            },
            delContainer: function (sActualKey/*, oScope*/) {
                var getPromise = new jQuery.Deferred();
                if (sKey !== sActualKey) {
                    getPromise.reject("delContainerFailed");
                } else {
                    oMap = {};
                    sKey = undefined;
                    //  setTimeout(function () {
                    if (sActualKey === "FAILONGET") {
                        getPromise.reject("delContainerFailed");
                    } else {
                        getPromise.resolve();
                    }
                }
                return getPromise.promise();
            }
        };
    }

    asyncTest("loadAppState", function () {
        var oSystem,
            sParameters,
            oConfig,
            oAdapter,
            oFakePersService,
            oPromise,
            getContainerSpy,
            getItemValueSpy;
        oAdapter = new sap.ushell.adapters.local.AppStateAdapter(oSystem, sParameters, oConfig);
        oFakePersService = fakePersonalizationServiceLoad("AKEY", JSON.stringify({ a: 2 }));
        oAdapter._getPersonalizationService = function () { return oFakePersService; };
        getContainerSpy = sinon.spy(oFakePersService, "getContainer");
        getItemValueSpy = sinon.spy(oFakePersService._oTheMockContainer, "getItemValue");
        // test
        oPromise = oAdapter.loadAppState("AKEY");
        oPromise.done(function (sKey, sValue) {
            start();
            equal(sKey, "AKEY", "Key ok");
            equal(sValue, JSON.stringify({ a: 2 }), "value ok");
            ok(getContainerSpy.calledOnce, "getContainer called");
            deepEqual(getContainerSpy.args[0], ["AKEY", {
                "keyCategory": "GENERATED_KEY",
                "writeFrequency": "HIGH",
                "clientStorageAllowed": false
            }], "getContainer called with proper args");
            deepEqual(getItemValueSpy.args[0], ["appStateData"], "container.setData called with proper args");
        }).fail(function () {
            start();
            ok(false, "should succeed");
        });
    });

    asyncTest("loadAppState fail", function () {
        var oSystem,
            sParameters,
            oConfig,
            oAdapter,
            oFakePersService,
            oPromise;
        oAdapter = new sap.ushell.adapters.local.AppStateAdapter(oSystem, sParameters, oConfig);
        oFakePersService = fakePersonalizationServiceLoad("AKEY", JSON.stringify({ a: 2 }));
        oAdapter._getPersonalizationService = function () { return oFakePersService; };
        sinon.spy(oFakePersService, "getContainer");
        sinon.spy(oFakePersService._oTheMockContainer, "getItemValue");
        // test
        oPromise = oAdapter.loadAppState("FAILONGET");
        oPromise.done(function (/*sKey, sValue*/) {
            start();
            ok(false, "should fail");
        }).fail(function (sMsg) {
            start();
            ok(true, "should fail");
            equal(sMsg, "getContainerFailed", "getContainer failed");
            ok(oFakePersService.getContainer.calledOnce, "getContainer called");
            deepEqual(oFakePersService.getContainer.args[0], ["FAILONGET", {
                "keyCategory": "GENERATED_KEY",
                "writeFrequency": "HIGH",
                "clientStorageAllowed": false
            }], "getContainer called with proper args");
        });
    });

    asyncTest("deleteAppState", function () {
        var oSystem,
            sParameters,
            oConfig,
            oAdapter,
            oFakePersService,
            oPromise,
            delContainerSpy,
            getItemValueSpy;
        oAdapter = new sap.ushell.adapters.local.AppStateAdapter(oSystem, sParameters, oConfig);
        oFakePersService = fakePersonalizationServiceLoad("AKEY", JSON.stringify({ a: 2 }));
        oAdapter._getPersonalizationService = function () { return oFakePersService; };
        delContainerSpy = sinon.spy(oFakePersService, "delContainer");
        getItemValueSpy = sinon.spy(oFakePersService._oTheMockContainer, "getItemValue");
        // test
        oPromise = oAdapter.deleteAppState("AKEY");
        oPromise.done(function () {
            start();
            ok(delContainerSpy.calledOnce, "delContainer called");
            deepEqual(delContainerSpy.args[0], ["AKEY"], "delContainerSpy called with proper args");
            ok(!getItemValueSpy.calledOnce, ["appStateData"], "getItemValue was not called");
        }).fail(function () {
            start();
            ok(false, "should succeed");
        });
    });

    asyncTest("deleteAppState fail", function () {
        var oSystem,
            sParameters,
            oConfig,
            oAdapter,
            oFakePersService,
            oPromise,
            delContainerSpy,
            getItemValueSpy;
        oAdapter = new sap.ushell.adapters.local.AppStateAdapter(oSystem, sParameters, oConfig);
        oFakePersService = fakePersonalizationServiceLoad("AKEY", JSON.stringify({ a: 2 }));
        oAdapter._getPersonalizationService = function () { return oFakePersService; };
        delContainerSpy = sinon.spy(oFakePersService, "delContainer");
        getItemValueSpy = sinon.spy(oFakePersService._oTheMockContainer, "getItemValue");
        // test
        oPromise = oAdapter.deleteAppState("FAILONGET");
        oPromise.done(function () {
            start();
            ok(false, "should fail");
        }).fail(function (sMsg) {
            start();
            ok(true, "should fail");
            equal(sMsg, "delContainerFailed", "delContainer failed");
            ok(delContainerSpy.calledOnce, "delContainer called");
            ok(!getItemValueSpy.calledOnce, ["appStateData"], "getItemValue was not called");
            equal(oFakePersService.getContainer.args, undefined, "args should be undefined");
        });
    });

    test("getSupportedPersistencyMethods", function () {
        var oAdapter,
            aMethods;
        oAdapter = new sap.ushell.adapters.local.AppStateAdapter();
        aMethods = oAdapter.getSupportedPersistencyMethods();
        ok(true, "should pass");
        deepEqual(aMethods, [], "correct persistancy methods");

        oAdapter.getSupportedPersistencyMethods = function () { return [AppStatePersistencyMethod.PersonalState]; };
        aMethods = oAdapter.getSupportedPersistencyMethods();
        ok(true, "should pass");
        deepEqual(aMethods, [AppStatePersistencyMethod.PersonalState],
            "correct persistancy methods");
    });
});
