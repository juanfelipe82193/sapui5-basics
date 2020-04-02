// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.adapters.local.UserDefaultParameterPersistenceAdapter
 */
sap.ui.require([
    "sap/ushell/test/utils",
    "sap/ushell/services/_Personalization/constants"
], function (testUtils, personalizationConstants) {
    "use strict";

    /* global test module equal asyncTest sinon ok start deepEqual */

    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ushell.adapters.local.UserDefaultParameterPersistenceAdapter");

    module("sap.ushell.adapters.local.UserDefaultParameterPersistenceAdapter", {
        // This method is called after each test. Add every restoration code here.
        teardown: function () {
            testUtils.restoreSpies(
                jQuery.sap.require,
                jQuery.sap.log.error
            );
        }
    });

    test("ctor signature", function () {
        var oSystem,
            sParameters,
            oConfig,
            oAdapter;
        oAdapter = new sap.ushell.adapters.local.UserDefaultParameterPersistenceAdapter(oSystem, sParameters, oConfig);
        equal(typeof oAdapter, "object");
        ["saveParameterValue", "loadParameterValue"].forEach(function (sFctName) {
            equal(typeof oAdapter[sFctName], "function", "Function " + sFctName + "present");
        });
    });

    function fakePersonalizationService (sTestKey) {
        var oTheMockContainer;
        // fake Container Object
        oTheMockContainer = {
            setItemValue: function (/*sKey, sValue*/) {
            },
            getItemValue: function (/*sKey*/) {
            },
            delItem: function (/*sKey*/) {
            },
            getItemKeys: function () {
            },
            saveDeferred: function () {
                var savePromise = new jQuery.Deferred();
                if (this._sKey === sTestKey) {
                    savePromise.resolve();
                } else {
                    savePromise.reject("Simulated save failure");
                }
                return savePromise.promise();
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
            constants: personalizationConstants,
            createEmptyContainer: function (sActualKey/*, oScope*/) {
                var createPromise;
                oTheMockContainer._sKey = sActualKey;
                createPromise = new jQuery.Deferred();
                if (sActualKey === "FAILONCREATE") {
                    createPromise.reject("createEmptyContainerFailed");
                } else {
                    createPromise.resolve(oTheMockContainer);
                }
                return createPromise.promise();
            },
            getContainer: function (sActualKey/*, oScope*/) {
                var createPromise;
                oTheMockContainer._sKey = sActualKey;
                createPromise = new jQuery.Deferred();
                if (sActualKey === "FAILONCREATE") {
                    createPromise.reject("createEmptyContainerFailed");
                } else {
                    createPromise.resolve(oTheMockContainer);
                }
                return createPromise.promise();
            }
        };
    }

    asyncTest("saveParameterValue", function () {
        var oSystem,
            sParameters,
            oConfig,
            oAdapter,
            oFakePersService,
            oPromise,
            getContainerSpy,
            setItemValueSpy,
            saveSpy;
        oAdapter = new sap.ushell.adapters.local.UserDefaultParameterPersistenceAdapter(oSystem, sParameters, oConfig);
        oFakePersService = fakePersonalizationService("sap.ushell.UserDefaultParameter");
        oAdapter._getPersonalizationService = function () { return oFakePersService; };
        getContainerSpy = sinon.spy(oFakePersService, "getContainer");
        setItemValueSpy = sinon.spy(oFakePersService._oTheMockContainer, "setItemValue");
        saveSpy = sinon.spy(oFakePersService._oTheMockContainer, "saveDeferred");
        // test
        oPromise = oAdapter.saveParameterValue("AKEY", { value: "abc" });
        oPromise.done(function () {
            start();
            ok(getContainerSpy.calledOnce, "getContainer called");
            deepEqual(getContainerSpy.args[0], ["sap.ushell.UserDefaultParameter", {
                "keyCategory": "FIXED_KEY",
                "writeFrequency": "LOW",
                "clientStorageAllowed": true
            }], "getContainer called with proper args");

            deepEqual(setItemValueSpy.args[0], ["AKEY", {
                value: "abc"
            }], "container.setItemValue called with proper args");
            ok(saveSpy.calledOnce, "container save called");
        }).fail(function () {
            start();
            ok(false, "should succeed");
        });
    });

    [
        { testName: "too long", paramName: "AKEYwhichIsWayToLongToBeLegalAndThusErrorLog", ok: false },
        { testName: "spaces", paramName: "Are you trying", ok: false },
        { testName: "special chars", paramName: "to&$AX", ok: false },
        { testName: "empty string", paramName: "", ok: false },
        { testName: "special chars 2", paramName: "break_the_%&%_system", ok: false },
        { testName: "special chars ok", paramName: "stick-to_legal_Params.1234", ok: true }
    ].forEach(function (oFixture) {
        asyncTest("saveParameterValue illegal key raises log : " + oFixture.testName, function () {
            var oSystem,
                sParameters,
                oConfig,
                sParameterName = oFixture.paramName,
                oAdapter,
                oFakePersService,
                oPromise,
                getContainerSpy,
                setItemValueSpy,
                saveSpy;
            oAdapter = new sap.ushell.adapters.local.UserDefaultParameterPersistenceAdapter(oSystem, sParameters, oConfig);
            oFakePersService = fakePersonalizationService("sap.ushell.UserDefaultParameter");
            oAdapter._getPersonalizationService = function () { return oFakePersService; };
            getContainerSpy = sinon.spy(oFakePersService, "getContainer");
            setItemValueSpy = sinon.spy(oFakePersService._oTheMockContainer, "setItemValue");
            sinon.spy(jQuery.sap.log, "error");
            saveSpy = sinon.spy(oFakePersService._oTheMockContainer, "saveDeferred");
            // test
            oPromise = oAdapter.saveParameterValue(sParameterName, { value: "abc" });
            oPromise.done(function () {
                start();
                ok(jQuery.sap.log.error.calledWith("Illegal Parameter Key, less than 40 characters and [A-Za-z0-9.-_]+ :\"" + sParameterName + "\""), "called errorok");
                ok(getContainerSpy.calledOnce, "getContainer called");
                deepEqual(getContainerSpy.args[0], ["sap.ushell.UserDefaultParameter", {
                    "keyCategory": "FIXED_KEY",
                    "writeFrequency": "LOW",
                    "clientStorageAllowed": true
                }], "getContainer called with proper args");

                deepEqual(setItemValueSpy.args[0], [sParameterName, {
                    value: "abc"
                }], "container.setItemValue called with proper args");
                ok(saveSpy.calledOnce, "container save called");
            }).fail(function () {
                start();
                ok(false, "should succeed");
            });
        });
    });

    asyncTest("loadParameterValue ok", function () {
        var oSystem,
            sParameters,
            oConfig,
            oAdapter,
            oFakePersService,
            oPromise,
            getContainerSpy,
            getItemValueSpy,
            saveSpy;
        oAdapter = new sap.ushell.adapters.local.UserDefaultParameterPersistenceAdapter(oSystem, sParameters, oConfig);
        oFakePersService = fakePersonalizationService("sap.ushell.UserDefaultParameter");
        oAdapter._getPersonalizationService = function () { return oFakePersService; };
        getContainerSpy = sinon.spy(oFakePersService, "getContainer");
        getItemValueSpy = sinon.stub(oFakePersService._oTheMockContainer, "getItemValue").returns({ "value": 123 });
        saveSpy = sinon.spy(oFakePersService._oTheMockContainer, "save");
        // test
        oPromise = oAdapter.loadParameterValue("AKEY");
        oPromise.done(function () {
            start();
            ok(getContainerSpy.calledOnce, "getContainer called");
            deepEqual(getContainerSpy.args[0], ["sap.ushell.UserDefaultParameter", {
                "keyCategory": "FIXED_KEY",
                "writeFrequency": "LOW",
                "clientStorageAllowed": true
            }], "getContainer called with proper args");

            deepEqual(getItemValueSpy.args[0], ["AKEY"], "container.getItemValue called with proper args");
            equal(saveSpy.calledOnce, false, "container save called");
        }).fail(function () {
            start();
            ok(false, "should succeed");
        });
    });

    asyncTest("loadParameterValue returns undefined ", function () {
        var oSystem,
            sParameters,
            oConfig,
            oAdapter,
            oFakePersService,
            oPromise;
        oAdapter = new sap.ushell.adapters.local.UserDefaultParameterPersistenceAdapter(oSystem, sParameters, oConfig);
        oFakePersService = fakePersonalizationService("sap.ushell.UserDefaultParameter");
        oAdapter._getPersonalizationService = function () { return oFakePersService; };
        sinon.spy(oFakePersService, "getContainer");
        sinon.stub(oFakePersService._oTheMockContainer, "getItemValue").returns(undefined);
        sinon.spy(oFakePersService._oTheMockContainer, "save");
        // test
        oPromise = oAdapter.loadParameterValue("AKEY");
        oPromise.done(function () {
            start();
            ok(false, " should not succeed");
        }).fail(function () {
            start();
            ok(true, "should fail");
        });
    });

    asyncTest("deleteParameter", function () {
        var oSystem,
            sParameters,
            oConfig,
            oAdapter,
            oFakePersService,
            oPromise,
            delItemSpy,
            saveSpy;
        oAdapter = new sap.ushell.adapters.local.UserDefaultParameterPersistenceAdapter(oSystem, sParameters, oConfig);
        oFakePersService = fakePersonalizationService("sap.ushell.UserDefaultParameter");
        oAdapter._getPersonalizationService = function () { return oFakePersService; };
        sinon.spy(oFakePersService, "getContainer");
        delItemSpy = sinon.stub(oFakePersService._oTheMockContainer, "delItem").returns(undefined);
        saveSpy = sinon.spy(oFakePersService._oTheMockContainer, "save");
        // test
        oPromise = oAdapter.deleteParameter("AKEY");
        oPromise.done(function () {
            start();
            ok(true, " should succeed");
            ok(delItemSpy.calledOnce, "called");
            deepEqual(delItemSpy.args[0], ["AKEY"], "proper args");
            ok(saveSpy.calledOnce, "save called");
        }).fail(function () {
            start();
            ok(true, "should fail");
        });
    });

    asyncTest("getStoredParameterNames", function () {
        var oSystem,
            sParameters,
            oConfig,
            oAdapter,
            oFakePersService,
            oPromise;
        oAdapter = new sap.ushell.adapters.local.UserDefaultParameterPersistenceAdapter(oSystem, sParameters, oConfig);
        oFakePersService = fakePersonalizationService("sap.ushell.UserDefaultParameter");
        oAdapter._getPersonalizationService = function () { return oFakePersService; };
        sinon.spy(oFakePersService, "getContainer");
        sinon.stub(oFakePersService._oTheMockContainer, "getItemKeys").returns(["AAA", "BBB"]);
        sinon.spy(oFakePersService._oTheMockContainer, "save");
        // test
        oPromise = oAdapter.getStoredParameterNames();
        oPromise.done(function (a) {
            start();
            ok(true, " should not succeed");
            deepEqual(a, ["AAA", "BBB"]);
        }).fail(function () {
            start();
            ok(false, "should fail");
        });
    });
});
