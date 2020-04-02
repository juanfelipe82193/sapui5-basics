// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.UserDefaultParameterPersistence
 */
sap.ui.require([
    "sap/ushell/services/UserDefaultParameterPersistence"
], function (UserDefaultParameterPersistence) {
    "use strict";

    /* global deepEqual, equal, module, ok, test, sinon */

    module("sap.ushell.services.UserDefaultParameterPersistence", {
        setup: function () { },
        teardown: function () { }
    });

    test("loadParameterValue", function () {
        var oService,
            oAdapter = { "loadParameterValue": function () { } };
        oService = new UserDefaultParameterPersistence(oAdapter);
        sinon.stub(oService, "_cleanseValue", function (a) { return { value: "yyy" }; });
        sinon.stub(oAdapter, "loadParameterValue", function () { return (new jQuery.Deferred()).resolve({ value: "xxx" }).promise(); });
        oService.loadParameterValue("AKEY").done(function (a) {
            deepEqual(a, { value: "yyy" }, " value ok");
        }).fail(function () {
            ok(false, "should not get here");
        });
        ok(oService._cleanseValue.called, "called");
        deepEqual(oService._cleanseValue.args[0][0], { value: "xxx" }, "called");
        deepEqual(oAdapter.loadParameterValue.args[0][0], "AKEY", "adapter called");
    });

    test("saveParameterValue", function () {
        var oService,
            oAdapter = { "saveParameterValue": function () { } };
        oService = new UserDefaultParameterPersistence(oAdapter);
        sinon.stub(oService, "_cleanseValue", function (a) { return { value: "yyy" }; });
        sinon.stub(oAdapter, "saveParameterValue", function () { return (new jQuery.Deferred()).resolve("aaa").promise(); });
        oService.saveParameterValue("AKEY", { value: "xxx" }).done(function (a) {
            ok(true, "saved");
        }).fail(function () {
            ok(false, "should not get here");
        });
        ok(oService._cleanseValue.called, "called");
        deepEqual(oService._cleanseValue.args[0][0], { value: "xxx" }, "called");
        equal(oAdapter.saveParameterValue.args[0][0], "AKEY", "adapter called with proper ParameterName");
        deepEqual(oAdapter.saveParameterValue.args[0][1], { value: "yyy" }, "adapter called with proper Value");
    });

    test("deleteParameter", function () {
        var oService,
            oAdapter = { "deleteParameter": function () { } };
        oService = new UserDefaultParameterPersistence(oAdapter);
        sinon.stub(oService, "_cleanseValue", function (a) { return { value: "yyy" }; });
        sinon.stub(oAdapter, "deleteParameter", function () { return (new jQuery.Deferred()).resolve("aaa").promise(); });
        oService.deleteParameter("AKEY").done(function (a) {
            ok(true, "deleted");
        }).fail(function () {
            ok(false, "should not get here");
        });
        equal(oAdapter.deleteParameter.args[0][0], "AKEY", "adapter called with proper ParameterName");
    });

    test("getStoredParameterNames", function () {
        var oService,
            oAdapter = { "getStoredParameterNames": function () { } };
        oService = new UserDefaultParameterPersistence(oAdapter);
        sinon.stub(oAdapter, "getStoredParameterNames", function () { return (new jQuery.Deferred()).resolve(["CCC", "AAA", "BbB"]).promise(); });
        oService.getStoredParameterNames().done(function (a) {
            deepEqual(a, ["AAA", "BbB", "CCC"], "values ok");
        }).fail(function () {
            ok(false, "should not get here");
        });
        ok(oAdapter.getStoredParameterNames.called, "adapter called");
    });

    test("save & load ParameterValue:  value cached", function () {
        var oService,
            oAdapter = {
                "saveParameterValue": function () { },
                "loadParameterValue": function () { }
            };
        oService = new UserDefaultParameterPersistence(oAdapter);
        sinon.stub(oService, "_cleanseValue", function (a) { return { value: a.value, "x1": "v1" }; });
        sinon.stub(oAdapter, "saveParameterValue", function () { return (new jQuery.Deferred()).resolve("aaa").promise(); });
        // save xxx
        oService.saveParameterValue("AKEY", { value: "xxx" }).done(function (a) {
            ok(true, "saved");
        }).fail(function () {
            ok(false, "should not get here");
        });
        ok(oService._cleanseValue.called, "called");
        deepEqual(oService._cleanseValue.args[0][0], { value: "xxx" }, "called");
        equal(oAdapter.saveParameterValue.args[0][0], "AKEY", "adapter called with proper ParameterName");
        deepEqual(oAdapter.saveParameterValue.args[0][1], { value: "xxx", "x1": "v1" }, "adapter called with proper Value");
        sinon.stub(oAdapter, "loadParameterValue", function () { ok(false, "not called"); });

        // load AKEY, loading cleansed value from last save operation
        oService.loadParameterValue("AKEY").done(function (a) {
            deepEqual(a, { value: "xxx", "x1": "v1" }, " value ok");
        }).fail(function () {
            ok(false, "should not get here");
        });
        equal(oService._cleanseValue.callCount, 1, " cleanse not called");
        deepEqual(oAdapter.loadParameterValue.called, false, "adapter called");
    });

    test("loadParameterValue, adapter fails", function () {
        var oService,
            oAdapter = { "loadParameterValue": function () { } };
        oService = new UserDefaultParameterPersistence(oAdapter);
        sinon.stub(oService, "_cleanseValue", function (a) { return { value: "yyy" }; });
        sinon.stub(oAdapter, "loadParameterValue", function () { return (new jQuery.Deferred()).reject("nonono").promise(); });
        oService.loadParameterValue("AKEY").fail(function (a) {
            deepEqual(a, "nonono", " msg transported");
        }).done(function () {
            ok(false, "should not get here");
        });
        equal(oService._cleanseValue.called, false, "called");
        deepEqual(oAdapter.loadParameterValue.args[0][0], "AKEY", "adapter called");
    });

    test("saveParameterValue, adapter fails", function () {
        var oService,
            oAdapter = { "saveParameterValue": function () { } };
        oService = new UserDefaultParameterPersistence(oAdapter);
        sinon.stub(oService, "_cleanseValue", function (a) { return { value: "yyy" }; });
        sinon.stub(oAdapter, "saveParameterValue", function () { return (new jQuery.Deferred()).reject("aaa").promise(); });
        oService.saveParameterValue("AKEY", { value: "xxx" }).fail(function (a) {
            equal(a, "aaa", "failed with msg");
        }).done(function () {
            ok(false, "should not get here");
        });
        ok(oService._cleanseValue.called, "called");
        deepEqual(oService._cleanseValue.args[0][0], { value: "xxx" }, "called");
        equal(oAdapter.saveParameterValue.args[0][0], "AKEY", "adapter called with proper ParameterName");
        deepEqual(oAdapter.saveParameterValue.args[0][1], { value: "yyy" }, "adapter called with proper Value");
    });

    test("_cleanseValue ", function () {
        var oService,
            oAdapter = { "loadParameterValue": function () { } };
        oService = new UserDefaultParameterPersistence(oAdapter);
        var res = oService._cleanseValue({ "a": 1, "b": 2, "c": 3, "d": 4, "value": "123", "noStore": true, "noEdit": false, "alwaysAskPlugin": true });
        deepEqual(res, { "value": "123", noEdit: false, "alwaysAskPlugin": true });
    });

    test("save and load value, test cleaning", function () {
        var oService,
            oAdapterSavedValue,
            oAdapter = {
                "saveParameterValue": function () { },
                "loadParameterValue": function () { }
            };
        oService = new UserDefaultParameterPersistence(oAdapter);
        sinon.stub(oAdapter, "saveParameterValue", function (sParameterName, aValue) {
            oAdapterSavedValue = aValue;
            return new jQuery.Deferred().resolve().promise();
        });
        sinon.stub(oAdapter, "loadParameterValue", function (/*sParameterName*/) { return new jQuery.Deferred().resolve(oAdapterSavedValue).promise(); });
        oService.saveParameterValue("AKEY", { noEdit: true, "notstored": "zzz", value: "yyy" }).done(function (a) {
            ok(true, "saved");
        }).fail(function () {
            ok(false, "should not get here");
        });
        oService.loadParameterValue("AKEY").done(function (aValue) {
            ok(true, "saved");
            deepEqual(aValue, { value: "yyy", "noEdit": true }, "loaded value ok");
        }).fail(function () {
            ok(false, "should not get here");
        });
        equal(oAdapter.saveParameterValue.args[0][0], "AKEY", "adapter called with proper ParameterName");
        deepEqual(oAdapter.saveParameterValue.args[0][1], { noEdit: true, value: "yyy" }, "adapter called with proper Value");
    });

    [
        { description: "both", value: { value: "123", extendedValue: { "a": "b" } }, rValue: { value: "123", extendedValue: { "a": "b" } } },
        { description: "single only", value: { value: "123" }, rValue: { value: "123" } },
        { description: "single only, undef", value: { value: "123", extendedValue: undefined }, rValue: { value: "123" } },
        { description: "extended only ", value: { extendedValue: { "a": "b" } }, rValue: { extendedValue: { "a": "b" } } },
        { description: "extended only, undef", value: { extendedValue: { "a": "b" }, value: undefined }, rValue: { extendedValue: { "a": "b" } } }
    ].forEach(function (oFixture) {
        test("save and load value, extendedParameter test cleaning:" + oFixture.description, function () {
            var oService,
                oAdapterSavedValue,
                oAdapter = {
                    "saveParameterValue": function () { },
                    "loadParameterValue": function () { }
                };
            oService = new UserDefaultParameterPersistence(oAdapter);
            sinon.stub(oAdapter, "saveParameterValue", function (sParameterName, aValue) {
                oAdapterSavedValue = aValue;
                return new jQuery.Deferred().resolve().promise();
            });
            sinon.stub(oAdapter, "loadParameterValue", function (/*sParameterName*/) { return new jQuery.Deferred().resolve(oAdapterSavedValue).promise(); });
            var oSavedObject = {};
            if (Object.hasOwnProperty.call(oFixture.value, "value")) {
                oSavedObject.value = oFixture.value.value;
            }
            if (Object.hasOwnProperty.call(oFixture.value, "extendedValue")) {
                oSavedObject.extendedValue = oFixture.value.extendedValue;
            }
            oService.saveParameterValue("AKEY", oSavedObject).done(function (/*a*/) {
                ok(true, "saved");
            }).fail(function () {
                ok(false, "should not get here");
            });
            oService.loadParameterValue("AKEY").done(function (aValue) {
                ok(true, "saved");
                deepEqual(aValue, oFixture.rValue, "loaded value ok");
            }).fail(function () {
                ok(false, "should not get here");
            });
            equal(oAdapter.saveParameterValue.args[0][0], "AKEY", "adapter called with proper ParameterName");
            deepEqual(oAdapter.saveParameterValue.args[0][1], oFixture.rValue, "adapter called with proper Value");
        });
    });

    [
        { description: "noStore true both", value: { noStore: true, value: "123", extendedValue: { "a": "b" } }, rValue: {}, saveCalled: false },
        { description: "noStore truthy but not true single only", value: { noStore: "true", value: "123" }, rValue: { value: "123" }, saveCalled: true },
        { description: "noStore not true single only", value: { value: "123" }, rValue: { value: "123" }, saveCalled: true },
        { description: "noStore not true extended only", value: { extendedValue: "xxxx" }, rValue: { extendedValue: "xxxx" }, saveCalled: true },
        { description: "noStore not true no value", value: {}, rValue: {}, saveCalled: true }
    ].forEach(function (oFixture) {
        test("save and load value noStore:" + oFixture.description, function () {
            var oService,
                oAdapterSavedValue,
                oAdapter = {
                    "saveParameterValue": function () { },
                    "loadParameterValue": function () { }
                };
            oService = new UserDefaultParameterPersistence(oAdapter);
            sinon.stub(oAdapter, "saveParameterValue", function (sParameterName, aValue) {
                oAdapterSavedValue = aValue;
                return new jQuery.Deferred().resolve().promise();
            });
            sinon.stub(oAdapter, "loadParameterValue", function (/*sParameterName*/) { return new jQuery.Deferred().resolve(oAdapterSavedValue).promise(); });
            var oSavedObject = { noStore: oFixture.value.noStore };
            if (Object.hasOwnProperty.call(oFixture.value, "value")) {
                oSavedObject.value = oFixture.value.value;
            }
            if (Object.hasOwnProperty.call(oFixture.value, "extendedValue")) {
                oSavedObject.extendedValue = oFixture.value.extendedValue;
            }
            oService.saveParameterValue("AKEY", oSavedObject).done(function (/*a*/) {
                ok(true, "saved");
            }).fail(function () {
                ok(false, "should not get here");
            });
            oService.loadParameterValue("AKEY").done(function (aValue) {
                ok(true, "saved");
                deepEqual(aValue, oFixture.rValue, "loaded value ok");
            }).fail(function () {
                ok(false, "should not get here");
            });
            if (oFixture.saveCalled) {
                equal(oAdapter.saveParameterValue.called, true, "save called");
                equal(oAdapter.saveParameterValue.args[0][0], "AKEY", "adapter called with proper ParameterName");
                deepEqual(oAdapter.saveParameterValue.args[0][1], oFixture.rValue, "adapter called with proper Value");
            } else {
                ok(oAdapter.saveParameterValue.calledOnce === false, "not called");
            }
        });
    });

    test("save and load value undefined, delete called!", function () {
        var oService,
            oAdapter = {
                "saveParameterValue": function () { },
                "loadParameterValue": function () { },
                "deleteParameter": function () { }
            };
        oService = new UserDefaultParameterPersistence(oAdapter);
        sinon.stub(oAdapter, "saveParameterValue", function () {
            return new jQuery.Deferred().resolve().promise();
        });
        sinon.stub(oAdapter, "loadParameterValue", function () { return new jQuery.Deferred().resolve({ value: "fakeLoad" }).promise(); });
        sinon.stub(oService, "_cleanseValue", function (a) { return a; });
        sinon.stub(oAdapter, "deleteParameter", function () { return (new jQuery.Deferred()).resolve("aaa").promise(); });
        oService.saveParameterValue("AKEY", { value: "abc" }).done(function (a) {
            ok(true, "saved");
        }).fail(function () {
            ok(false, "should not get here");
        });
        oService.loadParameterValue("AKEY").done(function (aValue) {
            ok(true, "saved");
            deepEqual(aValue, { value: "abc" }, "loaded value is saved value");
        }).fail(function () {
            ok(false, "should not get here");
        });
        oService.saveParameterValue("AKEY", undefined).done(function (a) {
            ok(true, "saved (undefined)");
        }).fail(function () {
            ok(false, "should not get here");
        });
        ok(oAdapter.deleteParameter.calledOnce, "delete called");
        oService.loadParameterValue("AKEY").done(function (aValue) {
            ok(true, "saved");
            deepEqual(aValue, { value: "fakeLoad" }, "loaded value empty");
        }).fail(function () {
            ok(false, "should not get here");
        });
    });
});
