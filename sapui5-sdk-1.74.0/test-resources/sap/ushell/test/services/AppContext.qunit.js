// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.Personalization
 * This is a 2nd test suite for a new version of the Personalization suite functionality,
 * Note that this uses getContainer  delContainer interface(!) which returns objects with a different semantic (!)
 */
sap.ui.require([
    "sap/ushell/utils",
    "sap/ushell/services/Personalization",
    "sap/ushell/services/_Personalization/PersonalizationContainerVariant",
    "sap/ushell/services/_Personalization/VariantSetAdapter",
    "sap/ushell/services/_Personalization/ContextContainer",
    "sap/ushell/services/_Personalization/Variant"
], function (
    utils,
    Personalization,
    PersonalizationContainerVariant,
    VariantSetAdapter,
    ContextContainer,
    Variant
) {
    "use strict";

    /* global module, test, QUnit, deepEqual, ok, start, asyncTest, sinon, equal, assert */

    jQuery.sap.declare("sap.ushell.adapters.mock.PersonalizationAdapter");
    jQuery.sap.require("sap.ushell.services.Personalization");

    var sCONTAINERPREFIX = "sap.ushell.personalization",
        sCONTAINER = "sap.ushell.test.personalization",
        sABAPTIMESTAMPFORMAT = "yyyyMMddHHmmss";

    //  ............................................................................
    //
    //             Service only tests
    //
    //  ............................................................................

    module("sap.ushell.services.Personalization (new): service only tests", {
        setup: function () {
            this.oService = {};
            this.oAdapter = {};

            this.oService = new Personalization(this.oAdapter);
        },
        teardown: function () {
            delete this.oService;
        }
    });

    // ........... Variant Tests ...........

    test("AppContainerVariant: create variant and check variant key, name and data", function () {
        var sVARIANT_KEY = "VARIANTKEY_131",
            sVARIANT_NAME = "Variant number 131",
            oVariantData = {},
            oVariant = {},
            oItemMap = {};

        oVariantData = {
            Item1: "Item 1",
            Item2: "Item 2"
        };
        oItemMap = new utils.Map();
        oItemMap.entries = oVariantData;

        oVariant = new PersonalizationContainerVariant(sVARIANT_KEY, sVARIANT_NAME, oVariantData);
        // check variant key
        QUnit.assert.equal(sVARIANT_KEY, oVariant.getVariantKey(),
            "Variant key is correctly stored");
        // check variant name
        QUnit.assert.equal(sVARIANT_NAME, oVariant.getVariantName(),
            "Variant name is correctly stored");
        // check variant data
        QUnit.assert.equal(oVariantData.Item1, oVariant.getItemValue("Item1"),
            "Item1 value is correctly stored");
        QUnit.assert.equal(oVariantData.Item2, oVariant.getItemValue("Item2"),
            "Item2 value is correctly stored");
    });

    test("AppContainerVariant: create variant add, change and delete item", function () {
        var sVARIANT_KEY = "VARIANTKEY_168",
            sVARIANT_NAME = "Variant number 168",
            oVariantData = {},
            aItemKeys = [],
            oVariant = {};

        oVariantData = {
            Item1: "Item 1",
            Item2: "Item 2"
        };
        oVariant = new PersonalizationContainerVariant(sVARIANT_KEY, sVARIANT_NAME, oVariantData);
        // add
        oVariant.setItemValue("Item3", "Item 3");
        QUnit.assert.equal(oVariantData.Item3, oVariant.getItemValue("Item3"),
            "Item3 value is correctly stored");
        QUnit.assert.equal(true, oVariant.containsItem("Item3"), "containsItem works correctly");
        // change
        oVariant.setItemValue("Item1", "Item 42");
        QUnit.assert.equal("Item 42", oVariant.getItemValue("Item1"),
            "Item1 value is changed correctly");
        QUnit.assert.equal("Item 42", oVariantData.Item1,
            "Data object handed over to constructor is changed!");
        // get keys
        aItemKeys = oVariant.getItemKeys();
        deepEqual(["Item1", "Item2", "Item3"], aItemKeys,
            "The correct array of item keys is returned by getItemKeys");
        // deletem
        oVariant.delItem("Item2");
        QUnit.assert.equal(false, oVariant.containsItem("Item2"),
            "delItem works correctly");
        QUnit.assert.equal(undefined, oVariant.getItemValue("Item2"),
            "getItemValue for a non-existant item returns undefined");
    });

    test("AppContainerVariant: create a variant with a non-string key", function () {
        var sVariantKey = "",
            sVariantName = "";

        sVariantKey = ["0"];
        sVariantName = "VariantName";
        try {
            new PersonalizationContainerVariant(sVariantKey, sVariantName, {});
            ok(false, "Error: Non-string key was not detected.");
        } catch (e) {
            ok(true, "Non-string key was was detected.");
        }
    });

    test("AppContainerVariant: create a variant with a non-string name", function () {
        var sVariantKey = "",
            sVariantName = "";

        sVariantKey = "0";
        sVariantName = ["ArrayVariantName"];
        try {
            new PersonalizationContainerVariant(sVariantKey, sVariantName, {});
            ok(false, "Error: Non-string name was not detected.");
        } catch (e) {
            ok(true, "Non-string name was was detected.");
        }
    });

    test("AppContainerVariant: create a variant with an exotic name", function () {
        var sVariantKey = "",
            sVariantName = "";

        sVariantKey = "0";
        sVariantName = "未经";
        new PersonalizationContainerVariant(sVariantKey, sVariantName, {});
        ok(true, "Variant name '" + sVariantName + "' was handled with no error during variant creation.");
    });

    test("AppContainerVariant: delete a non-existent item", function () {
        var oVariant = {},
            sVariantKey = "",
            sVariantName = "";

        sVariantKey = "0";
        sVariantName = "VariantName";
        oVariant = new PersonalizationContainerVariant(sVariantKey, sVariantName, {});
        oVariant.delItem("NonExistentItemKey...");
        ok(true, "Non-existent item was deleted without error.");
    });

    test("AppContainerVariant: getItemValue for non-existent item", function () {
        var oVariant = {},
            sVariantKey = "",
            sVariantName = "",
            oItemValue = {};

        sVariantKey = "0";
        sVariantName = "VariantName";
        oVariant = new PersonalizationContainerVariant(sVariantKey, sVariantName, {});
        oItemValue = oVariant.getItemValue("NonExistentItemKey...");
        QUnit.assert.equal(undefined, oItemValue, "Correct value undefined was returned.");
    });

    test("AppContainerVariant: serialization", function () {
        var oVariant = {},
            sVariantKey = "",
            sVariantName = "",
            oVariantData = {},
            oItemValue = {},
            oSerializationResult = {},
            oSerializationExp = {};

        sVariantKey = "0";
        sVariantName = "VariantSerializationName";
        oVariant = new PersonalizationContainerVariant(sVariantKey, sVariantName, {});
        oItemValue = {
            part1: "Part 1",
            part2: "Part 2"
        };
        oVariantData.item1 = oItemValue;
        oVariantData.item2 = oItemValue;
        oSerializationExp.name = sVariantName;
        oSerializationExp.variantData = oVariantData;
        oVariant.setItemValue("item1", oItemValue);
        oVariant.setItemValue("item2", oItemValue);
        oSerializationResult = oVariant._serialize();
        QUnit.assert.deepEqual(oSerializationResult, oSerializationExp,
            "Serialization of variant works correctly");
    });

    //  ............................................................................
    //
    //               Service + Mock Adapter tests
    //
    //  ............................................................................

    [
        { validity: 0, hasValiditypersistence: false },
        { validity: 30, hasValiditypersistence: true },
        { validity: Infinity, hasValiditypersistence: false }
    ].forEach(function (oFixture) {
        module("sap.ushell.services.Personalization  ( " + oFixture.validity + "): service + mockAdapter tests", {
            setup: function () {
                this.oService = {};
                this.oAdapter = {};
                this.oContainer = {};
                var oSystem = {},
                    that = this;
                this.oAdapter = new sap.ushell.adapters.mock.PersonalizationAdapter(oSystem);
                this.oService = new Personalization(this.oAdapter);
                this.oService.getContainer(sCONTAINER, { validity: oFixture.validity })
                    .done(function (oContainer) {
                        that.oContainer = oContainer;
                        that.oContainerVSAdapter = new VariantSetAdapter(that.oContainer);
                    });
            },
            teardown: function () {
                if (this.thestub) {
                    this.thestub.restore();
                }
                this.oService.delContainer(sCONTAINER, { validity: oFixture.validity });
                this.oService.delContainer(sCONTAINER + "2nd", { validity: oFixture.validity });
                delete this.oAdapter;
                delete this.oContainer;
                delete this.oService;
            }
        });

        asyncTest("AppContainer ( " + oFixture.validity + "): get (new) + save + get + validity expired = clear faked clock!", function () {
            var oPromiseCreator,
                oService = this.oService,
                that = this,
                sItemKey = "ItemKey",
                sContainerKey = sCONTAINER + "2nd";
            oPromiseCreator = oService.getContainer(sContainerKey, { validity: oFixture.validity });
            oPromiseCreator.done(function (oContainer) {
                var oPromiseGetter1 = {},
                    fmt;
                start();
                that.oItemValue = { "v1": "false" };
                oContainer.setItemValue(sItemKey, that.oItemValue);
                ok(true, "Personalization data was set");
                // simulate the clock!
                that.theFakeTime = new Date("Jan 2 2013 01:50");
                that.thestub = sinon.stub(ContextContainer.prototype, "_getNow", function () { return that.theFakeTime; });
                fmt = sap.ui.core.format.DateFormat.getDateInstance({ pattern: sABAPTIMESTAMPFORMAT });
                that.thetime = fmt.format(that.theFakeTime, true);
                that.theExpireTime = fmt.format(new Date(that.theFakeTime.getTime() + oFixture.validity * 60000), true);
                oContainer.save().done(function () {
                    that.theFakeTime = new Date("Jan 2 2013 01:55");
                    stop();
                    // obtain the (existing) Container (again)
                    oPromiseGetter1 = oService.getContainer(sContainerKey, { validity: oFixture.validity });
                    oPromiseGetter1.done(function (oContainer) {
                        var oReadValueSTO,
                            oReadValueEXP,
                            oReadValue2;
                        start();
                        ok(true, "Personalization data was gotten");
                        deepEqual(oContainer.getItemValue(sItemKey).v1, "false", "value present!");
                        deepEqual(oContainer.getItemKeys(), ["ItemKey"], "expired!");
                        oReadValue2 = oContainer._getItemValueInternal("ADMIN#", "sap-ushell-container-scope");
                        oReadValueSTO = oContainer._getItemValueInternal("ADMIN#", "sap-ushell-container-storageUTCTimestamp");
                        oReadValueEXP = oContainer._getItemValueInternal("ADMIN#", "sap-ushell-container-expireUTCTimestamp");
                        if (oFixture.hasValiditypersistence) {
                            deepEqual(oReadValue2.validity, oFixture.validity, "scope variable set;");
                            deepEqual(oReadValueSTO, that.thetime, "storage set;");
                            deepEqual(oReadValueEXP, that.theExpireTime, "expire set;");
                        } else {
                            deepEqual(oReadValueSTO, undefined, "storage not set;");
                            deepEqual(oReadValueEXP, undefined, "expire not set;");
                        }
                        that.theFakeTime = new Date("Jan 2 2013 04:55");
                        stop();
                        oService.getContainer(sContainerKey, { validity: oFixture.validity }).done(function (oContainer) {
                            start();
                            if (oFixture.hasValiditypersistence) {
                                deepEqual(oContainer.getItemKeys(), [], "expired!");
                                deepEqual(oContainer.getItemValue(sItemKey), undefined, "expired!");
                            } else {
                                deepEqual(oContainer.getItemValue(sItemKey).v1, "false", "value present!");
                            }
                        }).fail(function () {
                            start();
                            ok(false, "'Error' fail function of getter2 was triggered");
                        });
                    }).fail(function () {
                        start();
                        ok(false, "'Error' fail function of getter1 was triggered");
                    });
                });
                oPromiseCreator.fail(function () {
                    start();
                    ok(false, "'Error' fail function of setter was triggered");
                });
            });
        });
    });

    [
        { validity: 0, hasValiditypersistence: false },
        { validity: 30, hasValiditypersistence: true },
        { validity: Infinity, hasValiditypersistence: false }
    ].forEach(function (oFixture) {
        module("sap.ushell.services.Personalization  ( " + oFixture.validity + "): service + mockAdapter tests", {
            setup: function () {
                this.oService = {};
                this.oAdapter = {};
                this.oContainer = {};
                var oSystem = {},
                    that = this;

                this.oAdapter = new sap.ushell.adapters.mock.PersonalizationAdapter(oSystem);
                this.oService = new Personalization(this.oAdapter);
                return new Promise(function (fnResolve) {
                    that.oService.getContainer(sCONTAINER, { validity: oFixture.validity })
                        .done(function (oContainer) {
                            that.oContainer = oContainer;
                            that.oContainerVSAdapter = new VariantSetAdapter(that.oContainer);
                            fnResolve();
                        });
                });
            },
            teardown: function () {
                this.oService.delContainer(sCONTAINER, { validity: oFixture.validity });
                this.oService.delContainer(sCONTAINER + "2nd", { validity: oFixture.validity });
                delete this.oAdapter;
                delete this.oContainer;
                delete this.oService;
            }
        });

        asyncTest("AppContainer ( " + oFixture.validity + "): get  setItem length warnings", function () {
            var oService = this.oService,
                that = this,
                sContainerKey = "AveryLongContainerKeyMoreThan40CharsWithT",
                oSpyAdapterGet = sinon.spy(jQuery.sap.log, "error");
            oService.getContainer(sContainerKey, { validity: oFixture.validity }).done(function (oContainer) {
                deepEqual(jQuery.sap.log.error.getCall(0).args[0], "Personalization Service container key (\"AveryLongContainerKeyMoreThan40CharsWithT\") should be less than 40 characters [current :41]");
                that.oItemValue = { "v1": "false" };
                oContainer.setItemValue(sContainerKey, that.oItemValue);
                deepEqual(jQuery.sap.log.error.getCall(1).args[0], "Personalization Service item key/variant set name (\"AveryLongContainerKeyMoreThan40CharsWithT\") should be less than 40 characters [current :41]");
                start();
                ok(true, "Personalization data was set");
                oSpyAdapterGet.restore();
            }).fail(function () {
                start();
                ok(false, "'Error' fail function of save was triggered");
                oSpyAdapterGet.restore();
            });
        });

        asyncTest("AppContainer ( " + oFixture.validity + "): get  setItem length 40 no warnings", function () {
            var oService = this.oService,
                that = this,
                sContainerKey = "AveryLongContainerKeyMoreThan40CharsWith",
                oSpyAdapterGet = sinon.spy(jQuery.sap.log, "error");
            oService.getContainer(sContainerKey, { validity: oFixture.validity }).done(function (oContainer) {
                deepEqual(jQuery.sap.log.error.getCall(0), null);
                that.oItemValue = { "v1": "false" };
                oContainer.setItemValue(sContainerKey, that.oItemValue);
                deepEqual(jQuery.sap.log.error.getCall(0), null);
                start();
                ok(true, "Personalization data was set");
                oSpyAdapterGet.restore();
            }).fail(function () {
                start();
                ok(false, "'Error' fail function of save was triggered");
                oSpyAdapterGet.restore();
            });
        });

        asyncTest("AppContainer ( " + oFixture.validity + "): get (new) + save + get + delete", function () {
            var oPromiseCreator,
                oService = this.oService,
                that = this,
                sItemKey = "ItemKey",
                sContainerKey = sCONTAINER + "2nd";

            oPromiseCreator = oService.getContainer(sContainerKey, { validity: oFixture.validity });
            oPromiseCreator.done(function (oContainer) {
                var oPromiseGetter1 = {},
                    oReadValue,
                    oReadValue2;
                that.oItemValue = { "v1": "false" };
                oContainer.setItemValue(sItemKey, that.oItemValue);
                // not serialized !!!!
                that.oItemValue.v2 = "true";
                oReadValue = oContainer.getItemValue(sItemKey);
                deepEqual(oReadValue, { "v1": "false" }, "Read value is the value at time of set");
                ok(oReadValue !== that.oItemValue, "distinct object from set returned in get");
                oReadValue2 = oContainer.getItemValue(sItemKey);
                ok(oReadValue2 !== oReadValue, "distinct object returned in get");
                start();
                ok(true, "Personalization data was set");
                stop();
                oContainer.save().done(function () {
                    start();
                    stop();
                    // obtain the (existing) Container (again)
                    oPromiseGetter1 = oService.getContainer(sContainerKey, { validity: oFixture.validity });
                    oPromiseGetter1.done(function (oContainer) {
                        var oPromiseDel = {},
                            oReadValue;
                        start();
                        ok(true, "Personalization data was gotten");
                        oReadValue = oContainer.getItemValue(sItemKey);
                        deepEqual(oReadValue, { "v1": "false" }, "Read value is the saved value");
                        oReadValue.v3 = "1111";
                        oReadValue2 = oContainer.getItemValue(sItemKey);
                        deepEqual(oReadValue2.v3, undefined, "Read value is not a live object;");
                        ok(oReadValue !== oReadValue2, "Same object ! the live written value");
                        stop();
                        oPromiseDel = oService.delContainer(sContainerKey, { validity: oFixture.validity });
                        oPromiseDel.done(function () {
                            var oPromiseGetter2 = {};
                            oPromiseGetter2 = oService.getContainer(sContainerKey, { validity: oFixture.validity });
                            oPromiseGetter2.done(function (oContainer) {
                                start();
                                oReadValue = oContainer.getItemValue(sItemKey);
                                ok(true, "Personalization data was deleted");
                                equal(oReadValue, undefined, "Personalization data was deleted - value is undefined");
                            });
                            oPromiseGetter2.fail(function () {
                                start();
                                ok(false, "'Error' fail function of getter2 was triggered");
                            });
                            oPromiseDel.fail(function () {
                                start();
                                ok(false, "'Error' fail function of deleter was triggered");
                            });
                        });
                        oPromiseGetter1.fail(function () {
                            start();
                            ok(false, "'Error' fail function of getter1 was triggered");
                        });
                    });
                    oPromiseCreator.fail(function () {
                        start();
                        ok(false, "'Error' fail function of setter was triggered");
                    });
                }).fail(function () {
                    start();
                    ok(false, "'Error' fail function of save was triggered");
                });
            });
        });

        asyncTest("AppContainer ( " + oFixture.validity + "): get (new) + save + get + validity set?", function () {
            var oPromiseCreator,
                oService = this.oService,
                that = this,
                sItemKey = "ItemKey",
                sContainerKey = sCONTAINER + "2nd";
            oPromiseCreator = oService.getContainer(sContainerKey, { validity: oFixture.validity });
            oPromiseCreator.done(function (oContainer) {
                var oPromiseGetter1 = {},
                    oReadValue2,
                    fmt;
                that.oItemValue = { "v1": "false" };
                oContainer.setItemValue(sItemKey, that.oItemValue);
                start();
                ok(true, "Personalization data was set");
                stop();
                fmt = sap.ui.core.format.DateFormat.getDateInstance({ pattern: sABAPTIMESTAMPFORMAT });
                that.rawTime = new Date();
                that.thetime = fmt.format(that.rawTime, true);
                that.theExpireTime = fmt.format(new Date(that.rawTime.getTime() + oFixture.validity * 60000), true);
                oContainer.save().done(function () {
                    var oReadValueSTO,
                        oReadValueEXP,
                        delta;
                    start();
                    oReadValue2 = oContainer._getItemValueInternal("ADMIN#", "sap-ushell-container-scope");
                    oReadValueSTO = oContainer._getItemValueInternal("ADMIN#", "sap-ushell-container-storageUTCTimestamp");
                    oReadValueEXP = oContainer._getItemValueInternal("ADMIN#", "sap-ushell-container-expireUTCTimestamp");
                    if (oFixture.hasValiditypersistence) {
                        deepEqual(oReadValue2.validity, oFixture.validity, "scope variable set;");
                        delta = parseInt(oReadValueSTO, 10) - parseInt(that.thetime, 10);
                        ok(delta <= 2 && delta >= -2, "storage set;" + oReadValueSTO + "=?=" + that.thetime);
                        delta = parseInt(oReadValueEXP, 10) - parseInt(that.theExpireTime, 10);
                        ok(delta <= 2 && delta >= -2, "expire set;" + oReadValueEXP + "=?=" + that.theExpireTime);
                    } else {
                        deepEqual(oReadValueSTO, undefined, "storage not set;");
                        deepEqual(oReadValueEXP, undefined, "expire not set;");
                    }
                    stop();
                    // obtain the (existing) Container (again)
                    oPromiseGetter1 = oService.getContainer(sContainerKey, { validity: oFixture.validity });
                    oPromiseGetter1.done(function (oContainer) {
                        var oReadValueSTO,
                            oReadValueEXP;
                        start();
                        ok(true, "Personalization data was gotten");
                        oReadValueSTO = oContainer._getItemValueInternal("ADMIN#", "sap-ushell-container-storageUTCTimestamp");
                        oReadValueEXP = oContainer._getItemValueInternal("ADMIN#", "sap-ushell-container-expireUTCTimestamp");
                        if (oFixture.hasValiditypersistence) {
                            deepEqual(oReadValueSTO, that.thetime, "storage set;");
                            deepEqual(oReadValueEXP, that.theExpireTime, "expire set;");
                        } else {
                            deepEqual(oReadValueSTO, undefined, "storage not set;");
                            deepEqual(oReadValueEXP, undefined, "expire not set;");
                        }
                    }).fail(function () {
                        start();
                        ok(false, "'Error' fail function of getter1 was triggered");
                    });
                });
                oPromiseCreator.fail(function () {
                    start();
                    ok(false, "'Error' fail function of setter was triggered");
                });
            });
        });

        asyncTest("AppContainer ( " + oFixture.validity + "): get (new) + nosave,  get + delete", function () {
            var oPromiseCreator,
                oService = this.oService,
                that = this,
                sItemKey = "ItemKey",
                sContainerKey = sCONTAINER + "2nd";

            oPromiseCreator = oService.getContainer(sContainerKey, { validity: oFixture.validity });
            oPromiseCreator.done(function (oContainer) {
                var oPromiseGetter1 = {},
                    oReadValue,
                    oReadValue2;
                that.oItemValue = { "v1": "false" };
                oContainer.setItemValue(sItemKey, that.oItemValue);
                // not serialized !!!!
                that.oItemValue.v2 = "true";
                oReadValue = oContainer.getItemValue(sItemKey);
                deepEqual(oReadValue, { "v1": "false" }, "Read value is the value at time of set");
                ok(oReadValue !== that.oItemValue, "distinct object from set returned in get");
                oReadValue2 = oContainer.getItemValue(sItemKey);
                ok(oReadValue2 !== oReadValue, "distinct object returned in get");
                start();
                ok(true, "Personalization data was set");
                stop();
                // obtain the (existing) Container (again)
                oPromiseGetter1 = oService.getContainer(sContainerKey, { validity: oFixture.validity });
                oPromiseGetter1.done(function (oContainer) {
                    var oPromiseDel = {},
                        oReadValue;
                    start();
                    ok(true, "Personalization data was gotten");
                    oReadValue = oContainer.getItemValue(sItemKey);
                    deepEqual(oReadValue, undefined,
                        "not saved value is initial");
                    stop();
                    oPromiseDel = oService.delContainer(sContainerKey, { validity: oFixture.validity });
                    oPromiseDel.done(function () {
                        var oPromiseGetter2 = {};
                        oPromiseGetter2 = oService.getContainer(sContainerKey, { validity: oFixture.validity });
                        oPromiseGetter2.done(function (oContainer) {
                            start();
                            oReadValue = oContainer.getItemValue(sItemKey);
                            ok(true, "Personalization data was deleted");
                            equal(oReadValue, undefined,
                                "Personalization data was deleted - value is undefined");
                        });
                        oPromiseGetter2.fail(function () {
                            start();
                            ok(false, "'Error' fail function of getter2 was triggered");
                        });
                        oPromiseDel.fail(function () {
                            start();
                            ok(false, "'Error' fail function of deleter was triggered");
                        });
                    });
                    oPromiseGetter1.fail(function () {
                        start();
                        ok(false, "'Error' fail function of getter1 was triggered");
                    });
                });
                oPromiseCreator.fail(function () {
                    start();
                    ok(false, "'Error' fail function of setter was triggered");
                });
            });
        });

        asyncTest("AppContainer ( " + oFixture.validity + "): get save, create (empty)!", function () {
            var oPromiseCreator,
                oService = this.oService,
                that = this,
                sItemKey = "ItemKey",
                sContainerKey = sCONTAINER + "2nd";

            oPromiseCreator = oService.getContainer(sContainerKey, { validity: oFixture.validity });
            oPromiseCreator.done(function (oContainer) {
                that.oItemValue = { "v1": false };
                oContainer.setItemValue(sItemKey, that.oItemValue);
                oContainer.setItemValue("Stale", that.oItemValue);
                // not serialized !!!!
                that.oItemValue.v2 = "true";
                oContainer.getItemValue(sItemKey);
                start();
                ok(true, "Personalization data was set");
                stop();
                // save
                oContainer.save().done(function () {
                    var oPromiseGet = {},
                        oReadValue;
                    start();
                    ok(true, "Personalization data was gotten");
                    oReadValue = oContainer.getItemValue(sItemKey);
                    deepEqual(oReadValue, { v1: false },
                        "not saved value is initial");
                    stop();
                    oPromiseGet = oService.createEmptyContainer(sContainerKey, { validity: oFixture.validity });
                    oPromiseGet.done(function (oContainer) {
                        start();
                        oReadValue = oContainer.getItemValue(sItemKey);
                        ok(true, "Personalization data was deleted");
                        equal(oReadValue, undefined,
                            "Personalization data was deleted - value is undefined");
                        equal(oContainer.getItemKeys().length, 0,
                            "Personalization data was deleted - value is undefined");
                        oContainer.setItemValue(sItemKey, { v333: true });
                        stop();
                        oContainer.save().done(function () {
                            start();
                            stop();
                            oService.getContainer(sContainerKey, { validity: oFixture.validity }).done(function (oContainer) {
                                start();
                                oReadValue = oContainer.getItemValue("Stale");
                                equal(oReadValue, undefined,
                                    "Personalization data was cleared - value is undefined");
                                oReadValue = oContainer.getItemValue(sItemKey);
                                deepEqual(oReadValue, { v333: true },
                                    " new value set after");
                            }).fail(function () {
                                start();
                                ok(false, "'Error' fail function of getter2 was triggered");
                            });
                        }).fail(function () {
                            start();
                            ok(false, "'Error' fail function of getter2 was triggered");
                        });
                    }).fail(function () {
                        start();
                        ok(false, "'Error' fail function of getter2 was triggered");
                    });
                }).fail(function () {
                    start();
                    ok(false, "'Error' fail function of savewas triggered");
                });
                oPromiseCreator.fail(function () {
                    start();
                    ok(false, "'Error' fail function of setter was triggered");
                });
            });
        });

        // ........... Container Item Tests ...........

        test("AppContainer (" + oFixture.validity + ") - Items: set, get and delete undefined value (!) item", function () {
            var sITEM_KEY = "ITEM_501",
                oItemValue,
                oItemValueRead = {};
            oItemValue = undefined; // !!!
            // demonstrate that one can set / get undefined
            QUnit.assert.equal(false, this.oContainer.containsItem(sITEM_KEY),
                "ITEM_0815 is not exisiting");
            this.oContainer.setItemValue(sITEM_KEY, oItemValue);
            QUnit.assert.equal(true, this.oContainer.containsItem(sITEM_KEY),
                "ITEM_0815 exisits after setItemValue");
            oItemValueRead = this.oContainer.getItemValue(sITEM_KEY);
            deepEqual(oItemValue, oItemValueRead,
                "getItemValue returns the correct value for ITEM_0815");
            // does not hold ok(oItemValue !== oItemValueRead, "distinct objects");
            QUnit.assert.equal(true, this.oContainer.containsItem(sITEM_KEY),
                "containsItem returned true correctly for ITEM_0815");
            this.oContainer.delItem(sITEM_KEY);
            QUnit.assert.equal(typeof this.oContainer.getItemValue(sITEM_KEY), "undefined",
                "Item was deleted, getItemValue returned null");
            QUnit.assert.equal(false, this.oContainer.containsItem(sITEM_KEY),
                "containsItem returned false correctly");
        });

        test("AppContainer (" + oFixture.validity + ") - Items: set, get and delete null value (!) item", function () {
            var sITEM_KEY = "ITEM_501",
                oItemValue,
                oItemValueRead = {};
            oItemValue = null; // !!!
            // demonstrate that one can set / get undefined
            QUnit.assert.equal(false, this.oContainer.containsItem(sITEM_KEY),
                "ITEM_0815 is not exisiting");
            this.oContainer.setItemValue(sITEM_KEY, oItemValue);
            QUnit.assert.equal(true, this.oContainer.containsItem(sITEM_KEY),
                "ITEM_0815 exisits after setItemValue");
            oItemValueRead = this.oContainer.getItemValue(sITEM_KEY);
            deepEqual(oItemValue, oItemValueRead,
                "getItemValue returns the correct value for ITEM_0815");
            // does not hold ok(oItemValue !== oItemValueRead, "distinct objects");
            QUnit.assert.equal(true, this.oContainer.containsItem(sITEM_KEY),
                "containsItem returned true correctly for ITEM_0815");
            this.oContainer.delItem(sITEM_KEY);
            QUnit.assert.equal(typeof this.oContainer.getItemValue(sITEM_KEY), "undefined",
                "Item was deleted, getItemValue returned null");
            QUnit.assert.equal(false, this.oContainer.containsItem(sITEM_KEY),
                "containsItem returned false correctly");
        });

        [
            {},
            { v1: "abc" },
            { v1: "abc", v2: [1, 2], v3: { v1: "abc" } },
            [1, 2, 3],
            []
        ].forEach(function (oFixture2) {
            test("AppContainer (" + JSON.stringify(oFixture) + "/" + JSON.stringify(oFixture) + ") - Items: set, get and delete value (!) item", function () {
                var sITEM_KEY = "ITEM_501",
                    oItemValue = oFixture2,
                    oItemValueRead = {};

                QUnit.assert.equal(false, this.oContainer.containsItem(sITEM_KEY), "ITEM_0815 is not exisiting");
                this.oContainer.setItemValue(sITEM_KEY, oItemValue);
                QUnit.assert.equal(true, this.oContainer.containsItem(sITEM_KEY), "ITEM_0815 exisits after setItemValue");
                oItemValueRead = this.oContainer.getItemValue(sITEM_KEY);
                deepEqual(oItemValue, oItemValueRead, "getItemValue returns the correct value for ITEM_0815");
                ok(oItemValue !== oItemValueRead, "distinct objects");
                QUnit.assert.equal(true, this.oContainer.containsItem(sITEM_KEY), "containsItem returned true correctly for ITEM_0815");
                this.oContainer.delItem(sITEM_KEY);
                ok(this.oContainer.getItemValue(sITEM_KEY) === undefined, "Item was deleted, getItemValue returned null");
                QUnit.assert.equal(false, this.oContainer.containsItem(sITEM_KEY), "containsItem returned false correctly");
            });
        });

        [
            { obj: -Infinity, repr: null },
            { obj: /abc/, repr: {} },
            { obj: Number(1234), repr: 1234 },
            { obj: Number(Infinity), repr: null }
        ].forEach(function (oFixture) {
            test("AppContainer (" + JSON.stringify(oFixture) + ") - Items: set, get and delete mapped value item", function () {
                var sITEM_KEY = "ITEM_501",
                    oItemValue = oFixture.obj,
                    oItemValueRead = {};
                QUnit.assert.equal(false, this.oContainer.containsItem(sITEM_KEY), "ITEM_0815 is not exisiting");
                this.oContainer.setItemValue(sITEM_KEY, oItemValue);
                QUnit.assert.equal(true, this.oContainer.containsItem(sITEM_KEY), "ITEM_0815 exisits after setItemValue");
                oItemValueRead = this.oContainer.getItemValue(sITEM_KEY);
                deepEqual(oFixture.repr, oItemValueRead, "getItemValue returns the correct value for ITEM_0815");
                QUnit.assert.equal(true, this.oContainer.containsItem(sITEM_KEY), "containsItem returned true correctly for ITEM_0815");
                this.oContainer.delItem(sITEM_KEY);
                ok(this.oContainer.getItemValue(sITEM_KEY) === undefined, "Item was deleted, getItemValue returned null");
                QUnit.assert.equal(false, this.oContainer.containsItem(sITEM_KEY), "containsItem returned false correctly");
            });
        });

        test("AppContainer (" + oFixture.validity + ") - Items: set, get and delete recursive item", function () {
            var sITEM_KEY = "ITEM_501",
                oItemValue = { a: 1, b: "x" },
                oItemValueRead = {};
            // create circular object
            oItemValue.nested = oItemValue;
            // nested structures are silently converted to undefined
            QUnit.assert.equal(false, this.oContainer.containsItem(sITEM_KEY), "ITEM_0815 is not exisiting");
            this.oContainer.setItemValue(sITEM_KEY, "legal");
            try {
                this.oContainer.setItemValue(sITEM_KEY, oItemValue);
                ok(false, "no exception");
            } catch (e) {
                ok(true, "had exception");
            }
            QUnit.assert.equal(true, this.oContainer.containsItem(sITEM_KEY), "ITEM_0815 exisits after setItemValue");
            oItemValueRead = this.oContainer.getItemValue(sITEM_KEY);
            deepEqual(oItemValueRead, "legal", "getItemValue returns undefined for ITEM_0815");
        });

        test("AppContainer (" + oFixture.validity + ") - Items: set, get and delete item, check difficult keynames", function () {
            var sITEM_KEY = "hasOwnProperty",
                oItemValueRead = {};

            this.oContainer.delItem(sITEM_KEY);
            QUnit.assert.equal(false, this.oContainer.containsItem(sITEM_KEY),
                "hasOwnProperty is not exisiting");
            this.oContainer.setItemValue(sITEM_KEY, this.oItemValue);
            QUnit.assert.equal(true, this.oContainer.containsItem(sITEM_KEY),
                "hasOwnProperty exisits after setItemValue");
            oItemValueRead = this.oContainer.getItemValue(sITEM_KEY);
            deepEqual(this.oItemValue, oItemValueRead,
                "getItemValue returns the correct value for hasOwnProperty");
            QUnit.assert.equal(true, this.oContainer.containsItem(sITEM_KEY),
                "containsItem returned true correctly for hasOwnProperty");
            this.oContainer.delItem(sITEM_KEY);
            QUnit.assert.equal(null, this.oContainer.getItemValue(sITEM_KEY),
                "Item was deleted, getItemValue returned null");
            QUnit.assert.equal(false, this.oContainer.containsItem(sITEM_KEY),
                "containsItem returned false correctly");
        });

        test("AppContainer (" + oFixture.validity + ") - Items: add items with and with no prefix, read them", function () {
            var aActItemKeys = [],
                that = this,
                oItemValue = {
                    part1: "Part 1",
                    part2: "Part 2"
                };
            // check if the container is empty
            QUnit.assert.equal(this.oContainer.getItemKeys().length, 0, "Container is empty");
            // add item1 with no item prefix
            // dirty hack
            this.oContainer._setItemValueInternal("item1", "prefix0", oItemValue);
            // add item2 with item prefix
            this.oContainer.setItemValue("item2", oItemValue);
            // add item 3 with item prefix
            this.oContainer.setItemValue("item3", oItemValue);
            aActItemKeys = this.oContainer.getItemKeys();
            QUnit.assert.equal(aActItemKeys.length, 2, "Container has 3 items: '" + aActItemKeys + "'");
            ok(true, "Internal item keys are: " + this.oContainer._oItemMap.keys() + "'");
            QUnit.assert.equal(false, this.oContainer.containsItem("item1"), "'item1' is not detected by containsItem due to automatic prefixing!");
            stop();
            this.oContainer.save()
                .fail(function () {
                    start();
                    ok(false, "Error during container save");
                })
                .done(function () {
                    start();
                    ok(true, "Successful container save");
                    stop();
                    that.oContainer.load()
                        .fail(function () {
                            start();
                            ok(false, "Error during container reload");
                        })
                        .done(function () {
                            start();
                            ok(true, "Successful container relaod");
                            // check if prefix was added to item1
                            QUnit.assert.equal(false, that.oContainer.containsItem("item1"), "Container contains 'item1'");
                            that.oContainer.delItem("item1");
                            that.oContainer.delItem("item2");
                            that.oContainer.delItem("item3");
                            QUnit.assert.equal(that.oContainer.getItemKeys().length, 0, "All items are deleted");
                        });
                });
        });

        test("AppContainer (" + oFixture.validity + ") - Items: Delete non-existent item", function () {
            var sITEM_KEY = "nonExistingItem";

            ok(!this.oContainer.containsItem(sITEM_KEY), "Item is not existing");
            try {
                this.oContainer.delItem(sITEM_KEY);
                ok(true, "Non-existent item was deleted without error");
            } catch (e) {
                ok(false, "Error during deletion of non-existing item");
            }
        });

        test("AppContainer (" + oFixture.validity + ")- Items: Get value of non-existent item", function () {
            var sITEM_KEY = "nonExistingItem",
                oItemValue = {};

            ok(!this.oContainer.containsItem(sITEM_KEY), "Item is not existing");
            try {
                oItemValue = this.oContainer.getItemValue(sITEM_KEY);
                ok(oItemValue === undefined, "Value of a non-existing item is undefined");
            } catch (e) {
                ok(false, "Error during getItemvalue of non-existing item");
            }
        });

        // ........... Container Tests ...........

        test("AppContainer (" + oFixture.validity + ") - Variant Set: add and delete variant sets", function () {
            var aActVariantSetKeys = [],
                that = this,
                aExpVariantSetKeys = ["variantSet1", "variantSet2"];

            aExpVariantSetKeys.forEach(function (sVariantSetKey) {
                that.oContainerVSAdapter.addVariantSet(sVariantSetKey, that.oItemValue);
            });
            // check variant sets
            aActVariantSetKeys = this.oContainerVSAdapter.getVariantSetKeys();
            aExpVariantSetKeys.forEach(function (sVariantSetKey, index) {
                deepEqual(aActVariantSetKeys[index], sVariantSetKey,
                    "'" + sVariantSetKey + "' exists");
            });
            // delete
            aExpVariantSetKeys.forEach(function (sVariantSetKey) {
                that.oContainerVSAdapter.delVariantSet(sVariantSetKey);
            });
            // check deletion
            aExpVariantSetKeys.forEach(function (sVariantSetKey) {
                QUnit.assert.equal(false, that.oContainerVSAdapter.containsVariantSet(sVariantSetKey),
                    "Container does not have variantSet '" + sVariantSetKey + "'");
            });
        });

        test("AppContainer (" + oFixture.validity + ") - Variant Set: Delete non-existent variant set", function () {
            var sVARIANT_SET_KEY = "nonExistingVariantset";

            ok(!this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY), "Variant set is not existing");
            try {
                this.oContainerVSAdapter.delVariantSet(sVARIANT_SET_KEY);
                ok(true, "Non-existent variant set was deleted without error");
            } catch (e) {
                ok(false, "Error during deletion of non-existing variant set");
            }
        });

        test("AppContainer (" + oFixture.validity + ") - Variant Set: Get non-existent variant set", function () {
            var sVARIANT_SET_KEY = "nonExistingVariantset",
                oVariantSet = {};

            ok(!this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY), "Variant set is not existing");
            try {
                oVariantSet = this.oContainerVSAdapter.getVariantSet(sVARIANT_SET_KEY);
                ok(oVariantSet === undefined, "Non-existent variant set object is undefined");
            } catch (e) {
                ok(false, "Error during getVariantSet for a non-existing variant set");
            }
        });

        test("AppContainer (" + oFixture.validity + ") - Variant Set: Add variant set that exists", function () {
            var sVariantSetKey = "variantSetKey_682";
            this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
            ok(this.oContainerVSAdapter.containsVariantSet(sVariantSetKey), "Variant set '" + sVariantSetKey + "' was added");
            try {
                this.oContainerVSAdapter.addVariantSet(sVariantSetKey);
                ok(false, "Existence of variant set was not detected");
            } catch (e) {
                ok(true, "Existence of variant set was detected");
            }
        });

        test("AppContainer (" + oFixture.validity + "): add items and variant sets, read them separately", function () {
            var aActItemKeys = [],
                aActVariantSetKeys = [],
                bOk = true,
                that = this,
                oItemValue = {
                    part1: "Part 1",
                    part2: "Part 2"
                },
                aExpItemKeys = ["item1", "item2", "item3"],
                aExpVariantSetKeys = ["variantSet1", "variantSet2"];
            // add items
            aExpItemKeys.forEach(function (sItemKey) {
                that.oContainer.setItemValue(sItemKey, oItemValue);
            });
            // add variant sets
            aExpVariantSetKeys.forEach(function (sVariantSetKey) {
                that.oContainerVSAdapter.addVariantSet(sVariantSetKey, oItemValue);
            });
            // check items
            aActItemKeys = this.oContainer.getItemKeys();
            bOk = true;
            aExpItemKeys.forEach(function (sItemKey) {
                if (aActItemKeys.indexOf(sItemKey) === -1) {
                    ok(false, "Container does not contain item '" + sItemKey + "'");
                    bOk = false;
                }
            });
            if (bOk) { ok(true, "Item keys are correct: " + aActItemKeys); }
            // check variant sets
            aActVariantSetKeys = this.oContainerVSAdapter.getVariantSetKeys();
            bOk = true;
            aExpVariantSetKeys.forEach(function (sVariantSetKey) {
                if (aActVariantSetKeys.indexOf(sVariantSetKey) === -1) {
                    ok(false, "Container does not contain variant set '" + sVariantSetKey + "'");
                }
            });
            if (bOk) { ok(true, "Variant set keys are correct: " + aActVariantSetKeys); }
        });

        test("AppContainer (" + oFixture.validity + "): add and delete variantSets/Items", function () {
            var sVARIANT_SET_KEY = "VARIANT_SET_KEY_738",
                oVariantSet = {},
                oVariant = {},
                that = this;

            this.oContainer.setItemValue("itemKey1", "item1");
            this.oContainer.setItemValue("itemKey2", "item2");

            // add variant set
            if (this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY)) {
                this.oContainerVSAdapter.delVariantSet(sVARIANT_SET_KEY);
            }
            oVariantSet = this.oContainerVSAdapter.addVariantSet(sVARIANT_SET_KEY);
            // add variant V1
            oVariant = oVariantSet.addVariant("V1");
            oVariant.setItemValue("I1", {
                Val1: "value 1",
                Val2: "value 2"
            });
            oVariant.setItemValue("I2", {
                Filter1: "24",
                Filter2: "1000"
            });
            // add variant V2
            oVariant = oVariantSet.addVariant("V2");
            oVariant.setItemValue("I1", {
                Val1: "value 11",
                Val2: "value 12"
            });
            oVariant.setItemValue("I2", {
                Filter1: "48",
                Filter2: "50000"
            });
            // save container
            this.oContainer.save().fail(function () {
                ok(false, "Save failed");
            });
            stop();
            start();
            this.oContainer.delItem("itemKey2");
            this.oContainerVSAdapter.delVariantSet(sVARIANT_SET_KEY);
            this.oContainer.setItemValue("itemKey3", "item3");
            this.oContainer.save()
                .done(function () {
                    ok(!that.oContainer.containsItem("itemKey2"), "itemKey2 was deleted");
                    ok(!that.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                        sVARIANT_SET_KEY + " was deleted");
                    ok(that.oContainer.containsItem("itemKey3"),
                        "itemKey3 was added");
                })
                .fail(function () {
                    ok(false, "Save failed");
                });
        });

        asyncTest("AppContainer (" + oFixture.validity + "): Get container with non-string key", function () {
            try {
                this.oService.getContainer(this.oService)
                    .done(function () {
                        start();
                        ok(false, "Error: Container with a non-string key was not prohibited");
                    })
                    .fail(function () {
                        start();
                        ok(false, "Error: Container with a non-string key was not prohibited");
                    });
            } catch (e) {
                start();
                ok(true, "Non-string sContainerKey led to an exception");
            }
        });

        test("AppContainer (" + oFixture.validity + "): Container constructor with empty key", function () {
            try {
                new sap.ushell.services.PersonalizationContainer({}, ""); // oAdapter, sContainerKey
                ok(false, "Error: Container with an empty key was not prohibited");
            } catch (e) {
                ok(true, "Empty sContainerKey led to an exception");
            }
        });

        test("AppContainer (" + oFixture.validity + "): Container constructor with non-string key", function () {
            try {
                new sap.ushell.services.PersonalizationContainer({}, {}); // oAdapter, sContainerKey
                ok(false, "Error: Container with a non-string key was not prohibited");
            } catch (e) {
                ok(true, "Non-string sContainerKey led to an exception");
            }
        });

        asyncTest("AppContainer (" + oFixture.validity + "): reload restores original data", function () {
            this.oService.getContainer(sCONTAINER, { validity: oFixture.validity })
                .done(function (oContainer) {
                    start();
                    oContainer.setItemValue("key1", "item1");
                    QUnit.assert.equal(oContainer.getItemValue("key1"), "item1", "key1 added");
                    stop();
                    oContainer.save()
                        .done(function () {
                            start();
                            ok(true, "Data saved");
                            QUnit.assert.equal(oContainer.getItemValue("key1"), "item1", "key1 still there after save");
                            oContainer.setItemValue("key1", "item2");
                            QUnit.assert.equal(oContainer.getItemValue("key1"), "item2", "key1 changed to item2 (no save)");
                            stop();
                            oContainer.load()
                                .done(function () {
                                    start();
                                    equal(oContainer.getItemValue("key1"), "item1", "key1 loaded with correct value 'item1'");
                                })
                                .fail(function () {
                                    start();
                                    ok(false, "Load failed");
                                });
                        })
                        .fail(function () {
                            start();
                            ok(false, "Save failed");
                            stop();
                        });
                });
        });

        asyncTest("AppContainer (" + oFixture.validity + "): Error during load inside constructor", function () {
            var sCONTAINER_KEY = "constructorErrorContainer",
                that = this;
            if (oFixture.validity === 0) {
                start();
                ok(true, " validity 0, adapter throws no errors, mock not relevant");
                return;
            }
            this.oAdapter.setErrorProvocation(sCONTAINER_KEY);
            this.oService.getContainer(sCONTAINER_KEY, { validity: oFixture.validity })
                .done(function (/*oContainer*/) {
                    start();
                    ok(false, "Error: Load of container should have failed");
                })
                .fail(function (/*oContainer*/) {
                    start();
                    ok(true, "Load of container failed");
                    that.oAdapter.resetErrorProvocation(sCONTAINER_KEY);
                    that.oService._oContainerMap.remove(sCONTAINERPREFIX + sCONTAINER_KEY);
                    // dirty hack to get a new deferred object during the deletion
                    stop();
                    that.oService.delContainer(sCONTAINER_KEY, { validity: oFixture.validity })
                        .done(function () {
                            start();
                            ok(true, "Deletion of container succeeded");
                        })
                        .fail(function () {
                            start();
                            ok(false, "Deletion of container failed");
                        });
                });
        });

        asyncTest("AppContainer (" + oFixture.validity + "): Error during save", function () {
            var sCONTAINER_KEY = "saveErrorContainer",
                that = this;
            if (oFixture.validity === 0) {
                start();
                ok(true, " validity 0, adapter throws no errors, mock not relevant");
                return;
            }
            this.oService.getContainer(sCONTAINER_KEY, { validity: oFixture.validity })
                .done(function (oContainer) {
                    start();
                    ok(true, "Load of container succeeded");
                    that.oAdapter.setErrorProvocation(sCONTAINER_KEY);
                    stop();
                    oContainer.save()
                        .done(function () {
                            start();
                            ok(false, "Error: Save of container succeeded");
                        })
                        .fail(function () {
                            start();
                            ok(true, "Save of container failed");
                        });
                })
                .fail(function (/*oContainer*/) {
                    start();
                    ok(false, "Error: Load of container failed");
                });
        });

        asyncTest("AppContainer (" + oFixture.validity + "): Error during deletion", function () {
            var sCONTAINER_KEY = "deletionErrorContainer",
                that = this;
            if (oFixture.validity === 0) {
                start();
                ok(true, " validity 0, adapter throws no errors, mock not relevant");
                return;
            }
            this.oService.getContainer(sCONTAINER_KEY, { validity: oFixture.validity })
                .done(function (/*oContainer*/) {
                    start();
                    ok(true, "Load of container succeeded");
                    that.oAdapter.setErrorProvocation(sCONTAINER_KEY);
                    stop();
                    that.oService.delContainer(sCONTAINER_KEY, { validity: oFixture.validity })
                        .done(function () {
                            start();
                            ok(false, "Error: Deletion of container succeeded");
                        })
                        .fail(function () {
                            start();
                            ok(true, "Deletion of container failed");
                        });
                })
                .fail(function (/*oContainer*/) {
                    start();
                    ok(false, "Error: Load of container failed");
                });
        });

        asyncTest("AppContainer (" + oFixture.validity + "): check for container not a singleton", function () {
            var sCONTAINER_KEY = "singletonContainer",
                that = this;

            this.oService.getContainer(sCONTAINER_KEY, { validity: oFixture.validity })
                .done(function (oContainer1) {
                    start();
                    ok(true, "Load of container 1 succeeded");
                    stop();
                    that.oService.getContainer(sCONTAINER_KEY, { validity: oFixture.validity })
                        .done(function (oContainer2) {
                            start();
                            ok(true, "Load of container 2 succeeded");
                            ok(oContainer1 !== oContainer2, "Container is not a singleton");
                            oContainer1.setItemValue("once", "aValue");
                            oContainer2.setItemValue("once", "anotherInstanceValue");
                            equal("aValue", oContainer1.getItemValue("once"), "Container is not a singleton, distinct storage");
                            equal("anotherInstanceValue", oContainer2.getItemValue("once"), "Container is not a singleton, distinct storage");
                        })
                        .fail(function () {
                            start();
                            ok(false, "Error: Load of container 2  failed");
                        });
                })
                .fail(function (/*oContainer*/) {
                    start();
                    ok(false, "Error: Load of container 1 failed");
                });
        });

        test("AppContainer (" + oFixture.validity + "): Mix of container and personalizer", function () {
            // Personalizer does reuse of the container

            var oITEM_KEY = "mixItem",
                oItemValue = {},
                oPersId = {},
                oPersonalizer = {},
                that = this;

            oItemValue = {
                part1: "Part 1",
                part2: "Part 2"
            };
            this.oContainer.setItemValue(oITEM_KEY, oItemValue);
            ok(this.oContainer.containsItem(oITEM_KEY), oITEM_KEY + " was added");
            oPersId = {
                container: sCONTAINER,
                item: oITEM_KEY
            };
            this.oContainer.save().done(function () {
                oPersonalizer = that.oService.getPersonalizer(oPersId);
                oPersonalizer.getPersData()
                    .done(function (oReadItemValue) {
                        QUnit.assert.deepEqual(oReadItemValue, oItemValue, "Value read via personalizer is the one written in container");
                    })
                    .fail(function () {
                        start();
                        ok(false, "Error: getPersData failed");
                    });
            }).fail(function () {
                start();
                ok(false, "Error: save failed");
            });
        });

        // ........... Variant Set Tests ...........

        test("AppContainerVariantSet (" + oFixture.validity + "): add and delete variant", function () {
            var sVARIANT_SET_KEY = "VARIANT_SET_KEY_988",
                sVariantKey1 = "",
                sVariantKey2 = "",
                oVariantSet = {},
                oVariant1 = {},
                oVariant2 = {};

            QUnit.assert.equal(false, this.oContainerVSAdapter
                .containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
            oVariantSet = this.oContainerVSAdapter.addVariantSet(sVARIANT_SET_KEY);
            QUnit.assert.equal(true, this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' was added");
            oVariant1 = oVariantSet.addVariant("Variant number one added");
            sVariantKey1 = oVariant1.getVariantKey();
            QUnit.assert.equal(true, oVariantSet.containsVariant(sVariantKey1),
                "Variant '" + sVariantKey1 + "' was added");
            // add variant 1
            oVariant2 = oVariantSet.addVariant("Variant number two");
            sVariantKey2 = oVariant2.getVariantKey();
            QUnit.assert.equal(true, oVariantSet.containsVariant(sVariantKey2),
                "Variant '" + sVariantKey2 + "' was added");
            // delete variant 0
            oVariantSet.delVariant(sVariantKey1);
            QUnit.assert.equal(false, oVariantSet.containsVariant(sVariantKey1),
                "Variant '" + sVariantKey1 + "' was deleted");
            // delete variant 1
            oVariantSet.delVariant(sVariantKey2);
            QUnit.assert.equal(false, oVariantSet.containsVariant(sVariantKey2),
                "Variant '" + sVariantKey2 + "' was deleted");
            // delete variant set
            this.oContainerVSAdapter.delVariantSet(sVARIANT_SET_KEY);
            QUnit.assert.equal(false, this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' was deleted");
        });

        test("AppContainerVariant (" + oFixture.validity + "): set variant name", function () {
            var sVARIANT_SET_KEY = "VARIANT_SET_KEY_999",
                sORIGINAL_VARIANT_NAME = "Original variant name",
                sNEW_VARIANT_NAME = "New variant name",
                sVariantKey,
                oVariantSet,
                oVariant1,
                oVariant2,
                oItemValue = {
                    part1: "Part 1",
                    part2: "Part 2"
                };

            // -- prep
            QUnit.assert.equal(false, this.oContainerVSAdapter
                .containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
            oVariantSet = this.oContainerVSAdapter.addVariantSet(sVARIANT_SET_KEY);
            QUnit.assert.equal(true, this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' was added");
            oVariant1 = oVariantSet.addVariant(sORIGINAL_VARIANT_NAME);
            sVariantKey = oVariant1.getVariantKey();
            QUnit.assert.equal(true, oVariantSet.containsVariant(sVariantKey),
                "Variant '" + sVariantKey + "' was added");
            oVariant1.setItemValue("Item_1", oItemValue);

            // -- test
            oVariant1.setVariantName(sNEW_VARIANT_NAME);

            // -- QUnit.assertions
            sVariantKey = oVariantSet.getVariantKeyByName(sNEW_VARIANT_NAME);
            QUnit.assert.equal(sVariantKey, oVariant1.getVariantKey(),
                "Variant set contains variant with new name '" + sNEW_VARIANT_NAME + "'");

            oVariant2 = oVariantSet.getVariant(sVariantKey);
            QUnit.assert.deepEqual(oVariant2.getItemValue("Item_1"), oItemValue,
                "Renamed variant has same value for Item_1");

            oVariant2 = oVariantSet.getVariant(sVariantKey);
            QUnit.assert.deepEqual(oVariant2.getItemValue("Item_1"), oItemValue,
                "Renamed variant has same value for Item_1 (after getVariant())");

            oVariantSet = this.oContainerVSAdapter.getVariantSet(sVARIANT_SET_KEY);
            sVariantKey = oVariantSet.getVariantKeyByName(sNEW_VARIANT_NAME);
            QUnit.assert.equal(sVariantKey, oVariant1.getVariantKey(),
                "Variant set updated in container");
            oVariant2 = oVariantSet.getVariant(sVariantKey);
            QUnit.assert.deepEqual(oVariant2.getItemValue("Item_1"), oItemValue,
                "Variant set data updated in container");

            // clean up
            // delete variant set
            this.oContainerVSAdapter.delVariantSet(sVARIANT_SET_KEY);
        });

        test("AppContainerVariant (" + oFixture.validity + "): set variant name - input validation", function (assert) {
            var sVARIANT_SET_KEY = "VARIANT_SET_KEY_999",
                sORIGINAL_VARIANT_NAME = "Original variant name",
                sVariantKey,
                oVariantSet,
                oVariant1;

            // -- prep
            QUnit.assert.equal(false, this.oContainerVSAdapter
                .containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
            oVariantSet = this.oContainerVSAdapter.addVariantSet(sVARIANT_SET_KEY);
            QUnit.assert.equal(true, this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' was added");
            oVariant1 = oVariantSet.addVariant(sORIGINAL_VARIANT_NAME);
            sVariantKey = oVariant1.getVariantKey();
            QUnit.assert.equal(true, oVariantSet.containsVariant(sVariantKey),
                "Variant '" + sVariantKey + "' was added");

            // -- test
            // -- QUnit.assertions
            assert.throws(function () {
                oVariant1.setVariantName(0);
            }, /Parameter value of sVariantName is not a string/, "Exception raised if sVariantName not a string ");

            // clean up
            // delete variant set
            this.oContainerVSAdapter.delVariantSet(sVARIANT_SET_KEY);
        });

        test("AppContainerVariant (" + oFixture.validity + "): set variant name - variant does not exist in variant set", function () {
            var sVARIANT_SET_KEY = "VARIANT_SET_KEY_999",
                sORIGINAL_VARIANT_NAME = "Original variant name",
                sNEW_VARIANT_NAME = "New variant name",
                sVariantKey,
                oVariantSet,
                oVariant1;

            // -- prep
            QUnit.assert.equal(false, this.oContainerVSAdapter
                .containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
            oVariantSet = this.oContainerVSAdapter.addVariantSet(sVARIANT_SET_KEY);
            QUnit.assert.equal(true, this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' was added");
            oVariant1 = oVariantSet.addVariant(sORIGINAL_VARIANT_NAME);
            sVariantKey = oVariant1.getVariantKey();
            oVariantSet.delVariant(sVariantKey);

            // -- test
            // -- QUnit.assertions
            assert.throws(function () {
                oVariant1.setVariantName(sNEW_VARIANT_NAME);
            }, /Variant does not longer exist/, "Exception raised if variant does not exist anymore");

            // clean up
            // delete variant set
            this.oContainerVSAdapter.delVariantSet(sVARIANT_SET_KEY);
        });

        test("AppContainerVariant (" + oFixture.validity + "): set variant name - new variant already exists", function (assert) {
            var sVARIANT_SET_KEY = "VARIANT_SET_KEY_999",
                sORIGINAL_VARIANT_NAME = "Original variant name",
                sNEW_VARIANT_NAME = "New variant name",
                oVariantSet,
                oVariant1;

            // -- prep
            QUnit.assert.equal(false, this.oContainerVSAdapter
                .containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
            oVariantSet = this.oContainerVSAdapter.addVariantSet(sVARIANT_SET_KEY);
            QUnit.assert.equal(true, this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' was added");
            oVariant1 = oVariantSet.addVariant(sORIGINAL_VARIANT_NAME);
            oVariantSet.addVariant(sNEW_VARIANT_NAME);

            // -- test
            // -- QUnit.assertions
            assert.throws(function () {
                oVariant1.setVariantName(sNEW_VARIANT_NAME);
            }, /Variant with name 'New variant name' already exists in variant set/, "Exception raised if new variant already exists");

            // clean up
            // delete variant set
            this.oContainerVSAdapter.delVariantSet(sVARIANT_SET_KEY);
        });

        test("AppContainerVariantSet (" + oFixture.validity + "): add existing variant set", function () {
            var sVARIANT_SET_KEY = "VARIANT_SET_KEY_1025",
                sVARIANT_NAME = "VARIANT_1026",
                oVariantSet = {};

            ok(!this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
            oVariantSet = this.oContainerVSAdapter.addVariantSet(sVARIANT_SET_KEY);
            ok(this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' was created");
            ok(!oVariantSet.getVariantKeyByName(sVARIANT_NAME),
                "Variant with name '" + sVARIANT_NAME + "' does not exist");
            oVariantSet.addVariant(sVARIANT_NAME); // add it once
            try {
                oVariantSet.addVariant(sVARIANT_NAME); // add it twice
                ok(false, "Error: adding the same named variant twice was not detected");
            } catch (e) {
                ok(true, "Exception for adding the same variant twice is correct");
            }
        });

        test("AppContainerVariantSet (" + oFixture.validity + "): set current variant and check", function () {
            this.aVariantExp = [];
            this.oVariantNameAndKeysExp = {};
            var sVARIANT_SET_KEY = "VARIANT_SET_KEY_1027",
                oVariantSet = {},
                oVariant = {},
                sVariantKeyExp;

            if (this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY)) {
                this.oContainerVSAdapter.delVariantSet(sVARIANT_SET_KEY);
            }

            oVariantSet = this.oContainerVSAdapter.addVariantSet(sVARIANT_SET_KEY);
            oVariant = oVariantSet.addVariant("V1");
            oVariant.setItemValue("item", this.oItemValue);
            sVariantKeyExp = oVariant.getVariantKey();
            oVariantSet.setCurrentVariantKey(sVariantKeyExp);

            QUnit.assert.deepEqual(oVariantSet.getCurrentVariantKey(), sVariantKeyExp,
                "currentVariantKey was set correctly");
        });

        test("AppContainerVariantSet (" + oFixture.validity + "): delete non-existent variant", function () {
            var sVARIANT_SET_KEY = "VARIANT_SET_KEY_1050",
                sVARIANT_KEY = "1051",
                oVariantSet = {};

            ok(!this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
            oVariantSet = this.oContainerVSAdapter.addVariantSet(sVARIANT_SET_KEY);
            ok(this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' was created");
            ok(!oVariantSet.containsVariant(sVARIANT_KEY),
                "Variant '" + sVARIANT_KEY + "' does not exist");
            try {
                oVariantSet.delVariant(sVARIANT_KEY);
                ok(true, "Non-existing variant was deleted without error/exception");
            } catch (e) {
                ok(false, "Error: Exception during deletion of a non-existing variant");
            }
        });

        test("AppContainerVariantSet (" + oFixture.validity + "): get non-existent variant", function () {
            var sVARIANT_SET_KEY = "VARIANT_SET_KEY_1070",
                sVARIANT_KEY = "1071",
                oVariantSet = {},
                oVariant = {};

            ok(!this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
            oVariantSet = this.oContainerVSAdapter.addVariantSet(sVARIANT_SET_KEY);
            ok(this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' was created");
            ok(!oVariantSet.containsVariant(sVARIANT_KEY),
                "Variant '" + sVARIANT_KEY + "' does not exist");
            try {
                oVariant = oVariantSet.getVariant(sVARIANT_KEY);
                ok(oVariant === undefined, "getVariant returns undefined for a non-existing variant");
            } catch (e) {
                ok(false, "Error: Exception during getVariant for a non-existing variant");
            }
        });

        test("AppContainerVariantSet (" + oFixture.validity + "): add variant with an exotic name", function () {
            var sVARIANT_SET_KEY = "VARIANT_SET_KEY_1091",
                sVARIANT_NAME = "未经",
                oVariantSet = {},
                oVariant = {};

            ok(!this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
            oVariantSet = this.oContainerVSAdapter.addVariantSet(sVARIANT_SET_KEY);
            ok(this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' was created");
            ok(!oVariantSet.getVariantKeyByName(sVARIANT_NAME),
                "Variant with name '" + sVARIANT_NAME + "' does not exist");
            try {
                oVariant = oVariantSet.addVariant(sVARIANT_NAME);
                ok(oVariant instanceof Variant, "addVariant returns a variant object");
            } catch (e) {
                ok(false, "Error: Exception during addVariant");
            }
        });

        test("AppContainerVariantSet (" + oFixture.validity + "): add variant to a big max key variant set", function () {
            var sVARIANT_SET_KEY = "VARIANT_SET_KEY_1112",
                sVARIANT_NAME1 = "VARIANT_1113",
                sVARIANT_KEY1 = "999999",
                sVARIANT_NAME2 = "VARIANT_1115",
                oVariantSet = {},
                oVariant2 = {};

            ok(!this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
            oVariantSet = this.oContainerVSAdapter.addVariantSet(sVARIANT_SET_KEY);
            ok(this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' was created");
            ok(!oVariantSet.containsVariant(sVARIANT_KEY1),
                "Variant with key '" + sVARIANT_KEY1 + "' does not exist");
            // add variant manually
            oVariantSet._oVariantSetData.variants[sVARIANT_KEY1] = { name: sVARIANT_NAME1, variantData: {} };
            ok(oVariantSet.containsVariant(sVARIANT_KEY1),
                "Variant with key '" + sVARIANT_KEY1 + "' and name '" + sVARIANT_NAME1 + "' was added");
            oVariant2 = oVariantSet.addVariant(sVARIANT_NAME2);
            ok(parseInt(oVariant2.getVariantKey(), 10) === parseInt(sVARIANT_KEY1, 10) + 1, "variant key was increased correctly");
        });

        test("AppContainerVariantSet (" + oFixture.validity + "): getVariantKeyByName standard", function () {
            var sVARIANT_SET_KEY = "VARIANT_SET_KEY_1138",
                sVARIANT_NAME = "VARIANT_1139",
                oVariantSet = {},
                oVariant = {};

            ok(!this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
            oVariantSet = this.oContainerVSAdapter.addVariantSet(sVARIANT_SET_KEY);
            ok(this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' was created");
            oVariant = oVariantSet.addVariant(sVARIANT_NAME);
            QUnit.assert.equal(oVariantSet.getVariantKeyByName(sVARIANT_NAME), oVariant.getVariantKey(),
                "getVariantKey returns the correct key");
        });

        test("AppContainerVariantSet (" + oFixture.validity + "): getVariantKeyByName with non-existing name", function () {
            var sVARIANT_SET_KEY = "VARIANT_SET_KEY_1154",
                sVARIANT_NAME = "VARIANT_1155",
                oVariantSet = {};

            ok(!this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
            oVariantSet = this.oContainerVSAdapter.addVariantSet(sVARIANT_SET_KEY);
            ok(this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' was created");
            QUnit.assert.equal(oVariantSet.getVariantKeyByName(sVARIANT_NAME), undefined,
                "getVariantKey returns undefined for a non-existing name");
        });

        test("AppContainerVariantSet (" + oFixture.validity + "): getVariantKeyByName with non-string name", function () {
            var sVARIANT_SET_KEY = "VARIANT_SET_KEY_1168",
                oVariantSet = {};

            ok(!this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
            oVariantSet = this.oContainerVSAdapter.addVariantSet(sVARIANT_SET_KEY);
            ok(this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' was created");
            QUnit.assert.equal(oVariantSet.getVariantKeyByName(oVariantSet), undefined,
                "getVariantKey returns undefined for a non-string name");
        });

        test("AppContainerVariantSet (" + oFixture.validity + "): getVariantNamesAndKeys", function () {
            var sVARIANT_SET_KEY = "VARIANT_SET_KEY_1196",
                sVARIANT_NAME1 = "VARIANT_1",
                sVARIANT_NAME2 = "VARIANT_2",
                sVARIANT_NAME3 = "VARIANT_3",
                sVariantKey1 = "",
                sVariantKey2 = "",
                sVariantKey3 = "",
                oVariantSet = {},
                aVariantNamesAndKeys = [];

            ok(!this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
            oVariantSet = this.oContainerVSAdapter.addVariantSet(sVARIANT_SET_KEY);
            ok(this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' was created");
            sVariantKey1 = oVariantSet.addVariant(sVARIANT_NAME1).getVariantKey();
            sVariantKey2 = oVariantSet.addVariant(sVARIANT_NAME2).getVariantKey();
            sVariantKey3 = oVariantSet.addVariant(sVARIANT_NAME3).getVariantKey();
            aVariantNamesAndKeys = oVariantSet.getVariantNamesAndKeys();
            QUnit.assert.equal(aVariantNamesAndKeys[sVARIANT_NAME1], sVariantKey1, "result for variant 1 is correct");
            QUnit.assert.equal(aVariantNamesAndKeys[sVARIANT_NAME2], sVariantKey2, "result for variant 2 is correct");
            QUnit.assert.equal(aVariantNamesAndKeys[sVARIANT_NAME3], sVariantKey3, "result for variant 3 is correct");
        });

        test("AppContainerVariantSet (" + oFixture.validity + "): save and simulate browser reload 1", function () {
            this.aVariantExp = [];
            this.oVariantNameAndKeysExp = {};
            var sVARIANT_SET_KEY = "VARIANT_SET_KEY_1052",
                oVariantSet = {},
                oVariant1 = {},
                oVariant2 = {},
                oItemMap = {},
                that = this;

            // add variant set
            if (this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY)) {
                this.oContainerVSAdapter.delVariantSet(sVARIANT_SET_KEY);
            }
            ok(!this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                "Variant set '" + sVARIANT_SET_KEY + "' does not exist");
            oVariantSet = this.oContainerVSAdapter.addVariantSet(sVARIANT_SET_KEY);
            oItemMap = new utils.Map();

            function buildVariantObject (aVariants, sVariantKey, va) {
                aVariants[sVariantKey] = {
                    "key": va.getVariantKey(),
                    "name": va.getVariantName(),
                    "items": {}
                };
                va.getItemKeys().forEach(function (sItemKey) {
                    aVariants[sVariantKey].items[sItemKey] = va.getItemValue(sItemKey);
                });
            }
            oVariant1 = oVariantSet.addVariant("V1");
            oVariant1.setItemValue("I1", {
                Val1: "value 1",
                Val2: "value 2"
            });
            oVariant1.setItemValue("I2", {
                Filter1: "24",
                Filter2: "1000"
            });
            oItemMap.entries = oVariant1;
            this.oVariantNameAndKeysExp.V1 = oVariant1.getVariantKey();
            buildVariantObject(this.aVariantExp, oVariant1.getVariantKey(), oVariant1);
            // add variant V2
            oVariant2 = oVariantSet.addVariant("V2");
            oVariant2.setItemValue("I1", {
                Val1: "value 11",
                Val2: "value 12"
            });
            oVariant2.setItemValue("I2", {
                Filter1: "48",
                Filter2: "50000"
            });
            oItemMap.entries = oVariant2;
            buildVariantObject(this.aVariantExp, oVariant2.getVariantKey(), oVariant2);
            this.oVariantNameAndKeysExp.V2 = oVariant2.getVariantKey();
            // save
            this.oContainer.save().done(function () {
                // simulate browser reload
                delete this.oContainer;
                that.oService._oContainerMap.remove(sCONTAINERPREFIX + sCONTAINER);
                stop();
                that.oService.getContainer(sCONTAINER, { validity: oFixture.validity }).done(function (oContainer) {
                    var aVariantKeys = [],
                        aVariants = [],
                        oVariantNameAndKeys = {},
                        oContainerVSAdapter = new VariantSetAdapter(oContainer);
                    start();

                    ok(oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                        "Variant set '" + sVARIANT_SET_KEY + "' exists after save");
                    oVariantSet = oContainerVSAdapter.getVariantSet(sVARIANT_SET_KEY);

                    oVariantNameAndKeys = oVariantSet.getVariantNamesAndKeys();
                    QUnit.assert.deepEqual(oVariantNameAndKeys, that.oVariantNameAndKeysExp,
                        "Variant names and keys are correct");
                    QUnit.assert.deepEqual(oVariantSet.getVariantKeyByName("V1"), that.oVariantNameAndKeysExp.V1);
                    QUnit.assert.deepEqual(oVariantSet.getVariantKeyByName("V2"), that.oVariantNameAndKeysExp.V2);
                    aVariantKeys = oVariantSet.getVariantKeys();
                    aVariantKeys.forEach(function (sVariantKey) {
                        var va = oVariantSet.getVariant(sVariantKey);
                        buildVariantObject(aVariants, sVariantKey, va);
                    });
                    QUnit.assert.deepEqual(aVariants, that.aVariantExp, "Entire variant is correct");
                    oContainerVSAdapter.delVariantSet(sVARIANT_SET_KEY);
                    ok(!oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY),
                        "Variant set '" + sVARIANT_SET_KEY + "' was deleted");
                });
            }).fail(function () {
                ok(false, "Save failed");
            });
        });

        test("AppContainerVariantSet (" + oFixture.validity + "): save and simulate browser reload 2", function () {
            var sVARIANT_SET_KEY = "VARIANT_SET_KEY_1137",
                oVariantSet = {},
                oVariant = {},
                that = this;

            // add variant set
            if (this.oContainerVSAdapter.containsVariantSet(sVARIANT_SET_KEY)) {
                this.oContainerVSAdapter.delVariantSet(sVARIANT_SET_KEY);
            }

            oVariantSet = this.oContainerVSAdapter.addVariantSet(sVARIANT_SET_KEY);
            // add variant V1
            oVariant = oVariantSet.addVariant("V1");
            oVariant.setItemValue("I1", {
                Val1: "value 1",
                Val2: "value 2"
            });
            oVariant.setItemValue("I2", {
                Filter1: "24",
                Filter2: "1000"
            });
            // add variant V2
            oVariant = oVariantSet.addVariant("V2");
            oVariant.setItemValue("I1", {
                Val1: "value 11",
                Val2: "value 12"
            });
            oVariant.setItemValue("I2", {
                Filter1: "48",
                Filter2: "50000"
            });
            // save container
            this.oContainer.save().done(function () {
                // tabula rasa
                delete that.oContainer;
                that.oService._oContainerMap.remove(sCONTAINER);
                // new container
                stop();
                that.oService.getContainer(sCONTAINER, { validity: oFixture.validity }).done(function (oContainer) {
                    var aVariantKeys = [],
                        aVariants = [],
                        oVariant = {},
                        sVariantKey = "",
                        that = this;
                    start();
                    that.oContainer = oContainer;
                    that.oContainerVSAdapter = new VariantSetAdapter(oContainer);
                    oVariantSet = that.oContainerVSAdapter
                        .getVariantSet(sVARIANT_SET_KEY);
                    oVariant = oVariantSet.addVariant("V3");
                    oVariant.setItemValue("I1", {
                        Val1: "value 111",
                        Val2: "value 123"
                    });
                    oVariant.setItemValue("I2", {
                        Filter1: "489",
                        Filter2: "90000"
                    });
                    sVariantKey = oVariantSet.getVariantKeyByName("V2");
                    oVariantSet.delVariant(sVariantKey);
                    sVariantKey = oVariantSet.getVariantKeyByName("V1");
                    oVariantSet.delVariant(sVariantKey);
                    oVariant = oVariantSet.addVariant("V1");
                    oVariant.setItemValue("I3", {
                        Val1: "value 01",
                        Val2: "value 02"
                    });
                    oVariant.setItemValue("I4", {
                        Filter1: "240",
                        Filter2: "10009"
                    });
                    that.oContainerVSAdapter.save(); // delegates!
                    aVariantKeys = oVariantSet.getVariantKeys();
                    aVariantKeys.forEach(function (sVariantKey) {
                        aVariants.push(oVariantSet.getVariant(sVariantKey));
                    });
                    QUnit.assert.equal(2, aVariants.length, "Variant Set contains two items");
                    QUnit.assert.equal("V3", aVariants[0].getVariantName(), "First variant in set is V3");
                    QUnit.assert.deepEqual(aVariants[0].getItemValue("I1"), {
                        Val1: "value 111",
                        Val2: "value 123"
                    }, "Item value I1 from V3 still exist");
                    QUnit.assert.deepEqual(aVariants[0].getItemValue("I2"), {
                        Filter1: "489",
                        Filter2: "90000"
                    }, "Item value I2 from V3 still exist");
                    QUnit.assert.equal("V1", aVariants[1].getVariantName(), "Second variant in set is V1");
                    QUnit.assert.deepEqual(aVariants[1].getItemValue("I3"), {
                        Val1: "value 01",
                        Val2: "value 02"
                    }, "Item value I3 from V1 still exist");
                    QUnit.assert.deepEqual(aVariants[1].getItemValue("I4"), {
                        Filter1: "240",
                        Filter2: "10009"
                    }, "Item value I4 from V1  still exist");
                    // delete variant set
                    that.oContainerVSAdapter.delVariantSet(sVARIANT_SET_KEY);
                });
            }).fail(function () {
                ok(false, "Save failed");
            });
        });
    });

    [
        { validity: 0 },
        { validity: 30 },
        { validity: Infinity }
    ].forEach(function (oFixture) {
        module("sap.ushell.services.Personalization Container ( " + oFixture.validity + "): save deferred", {
            setup: function () {
                this.oService = {};
                this.oAdapter = {};
                this.oContainer = {};
                var oSystem = {},
                    that = this;

                this.oAdapter = new sap.ushell.adapters.mock.PersonalizationAdapter(oSystem);
                this.oService = new Personalization(this.oAdapter);
                return new Promise(function (fnResolve) {
                    that.oService.getContainer(sCONTAINER, { validity: oFixture.validity })
                        .done(function (oContainer) {
                            that.oContainer = oContainer;
                            fnResolve();
                        });
                });
            },
            teardown: function () {
                this.oService.delContainer(sCONTAINER, { validity: oFixture.validity });
                this.oService.delContainer(sCONTAINER + "2nd", { validity: oFixture.validity });
                delete this.oAdapter;
                delete this.oContainer;
                delete this.oService;
            }
        });

        asyncTest("AppContainer (" + oFixture.validity + "): saveDeferred, load, check", function () {
            var that = this;

            this.oContainer.setItemValue("key1", { v1: "Value1" });
            this.oContainer.saveDeferred(10)
                .done(function (sMsg) {
                    start();

                    ok(true, "Save done");
                    stop();
                    that.oService.getContainer(sCONTAINER, { validity: oFixture.validity })
                        .done(function (oReadContainer) {
                            start();
                            deepEqual(oReadContainer.getItemValue("key1"), { v1: "Value1" }, "Correct save");
                        })
                        .fail(function () {
                            start();
                            ok(false, "getContainer failed");
                            stop();
                        });
                })
                .fail(function () {
                    start();
                    ok(false, "Save failed");
                    stop();
                });
        });

        asyncTest("AppContainer (" + oFixture.validity + "): saveDeferred, saveDeferred, load, check", function () {
            var that = this;

            this.oContainer.setItemValue("key1", { v1: "Value1" });
            this.oContainer.saveDeferred(1000000)
                .done(function (sMsg) {
                    start();

                    ok(true, "Dropped save done");
                    equal(sMsg, Personalization.prototype.SAVE_DEFERRED_DROPPED, "saveDeferred was dropped");
                    stop();
                    that.oService.getContainer(sCONTAINER, { validity: oFixture.validity })
                        .done(function (oReadContainer) {
                            start();
                            deepEqual(oReadContainer.getItemValue("key1"), { v1: "Value1" }, "First saveDeferred - Correct save of key1");
                            deepEqual(oReadContainer.getItemValue("key2"), { v1: "Value1" }, "First saveDeferred - Correct save of key2");
                        })
                        .fail(function () {
                            start();
                            ok(false, "getContainer failed");
                            stop();
                        });
                })
                .fail(function () {
                    start();
                    ok(false, "Save failed");
                    stop();
                });
            this.oContainer.setItemValue("key2", { v1: "Value1" });
            stop();
            this.oContainer.save() // Deferred(1)
                .done(function (/*sMsg*/) {
                    start();

                    ok(true, "Save done");
                    stop();
                    that.oService.getContainer(sCONTAINER, { validity: oFixture.validity })
                        .done(function (oReadContainer) {
                            start();
                            deepEqual(oReadContainer.getItemValue("key1"), { v1: "Value1" }, "Second saveDeferred - Correct save of key1");
                            deepEqual(oReadContainer.getItemValue("key2"), { v1: "Value1" }, "Second saveDeferred - Correct save of key2");
                        })
                        .fail(function () {
                            start();
                            ok(false, "getContainer failed");
                            stop();
                        });
                })
                .fail(function () {
                    start();
                    ok(false, "Save failed");
                    stop();
                });
        });


        asyncTest("AppContainer (" + oFixture.validity + "): saveDeferred, flush, load, check", function () {
            var that = this;

            this.oContainer.setItemValue("key1", { v1: "Value1" });
            this.oContainer.saveDeferred(1000000)
                .done(function (sMsg) {
                    start();
                    ok(true, "Dropped save done");
                    stop();
                    that.oService.getContainer(sCONTAINER, { validity: oFixture.validity })
                        .done(function (oReadContainer) {
                            start();
                            deepEqual(oReadContainer.getItemValue("key1"), { v1: "Value1" }, "First saveDeferred - Correct save of key1");
                            deepEqual(oReadContainer.getItemValue("key2"), { v1: "Value1" }, "First saveDeferred - Correct save of key2");
                        })
                        .fail(function () {
                            start();
                            ok(false, "getContainer failed");
                            stop();
                        });
                })
                .fail(function () {
                    start();
                    ok(false, "Save failed");
                    stop();
                });
            this.oContainer.setItemValue("key2", { v1: "Value1" });
            stop();
            this.oContainer.flush() // Deferred(1)
                .done(function () {
                    start();

                    ok(true, "Save done");
                    stop();
                    that.oService.getContainer(sCONTAINER, { validity: oFixture.validity })
                        .done(function (oReadContainer) {
                            start();
                            deepEqual(oReadContainer.getItemValue("key1"), { v1: "Value1" }, "Second saveDeferred - Correct save of key1");
                            deepEqual(oReadContainer.getItemValue("key2"), { v1: "Value1" }, "Second saveDeferred - Correct save of key2");
                        })
                        .fail(function () {
                            start();
                            ok(false, "getContainer failed");
                            stop();
                        });
                })
                .fail(function () {
                    start();
                    ok(false, "Save failed");
                    stop();
                });
        });

    });

    // cross validity tests
    // test interaction between several validitys!

    // save 30,  get 0 -> new instance ?
    // save 0,  get 30 -> new instance

    // sequence validity (save) validity2 get , del(validity2) get validity.
    // zombiepersistence true indicates save() data is retrieved albeit deletion

    [
        { validity: 0, validity2: 30, zombiePersistence: false, distinctValues: false },
        { validity: 30, validity2: 0, zombiePersistence: true, distinctValues: false },
        { validity: 30, validity2: Infinity, zombiePersistence: false, distinctValues: false },
        { validity: Infinity, validity2: 30, zombiePersistence: false, distinctValues: false }
    ].forEach(function (oFixture) {
        module("sap.ushell.services.Personalization  Container ( " + oFixture.validity + "/" + oFixture.validity2 + "): service + cross validity", {
            setup: function () {
                this.oService = {};
                this.oAdapter = {};
                this.oContainer = {};
                var oSystem = {},
                    that = this;

                this.oAdapter = new sap.ushell.adapters.mock.PersonalizationAdapter(oSystem);
                this.oService = new Personalization(this.oAdapter);
                this.oService.getContainer(sCONTAINER, { validity: oFixture.validity })
                    .done(function (oContainer) {
                        that.oContainer = oContainer;
                    });
            },
            teardown: function () {
                return jQuery.when(
                    this.oService.delContainer(sCONTAINER, { validity: oFixture.validity }),
                    this.oService.delContainer(sCONTAINER + "2nd", { validity: oFixture.validity })
                ).then(function () {
                    delete this.oAdapter;
                    delete this.oContainer;
                    delete this.oService;
                });
            }
        });

        asyncTest("AppContainer  ( " + oFixture.validity + "/" + oFixture.validity2 + ") : get with different validity gets same data, new instance! get (new) +  get + delete", function () {
            var oPromiseCreator,
                oService = this.oService,
                that = this,
                sItemKey = "ItemKey",
                sContainerKey = sCONTAINER + "2nd";

            oPromiseCreator = oService.getContainer(sContainerKey, { validity: oFixture.validity });
            oPromiseCreator.done(function (oContainer) {
                var oPromiseGetter1 = {};
                that.oItemValue = { "v1": false };
                oContainer.setItemValue(sItemKey, that.oItemValue);
                // not serialized !!!!
                that.oItemValue.v2 = true;
                equal(oFixture.validity, oContainer.getValidity(), "first validity");
                start();
                ok(true, "Personalization data was set");
                stop();
                oContainer.save()
                    .done(function () {
                        start();
                        ok(true, "save ok");
                        stop();
                        // obtain the (existing) Container (again)
                        oPromiseGetter1 = oService.getContainer(sContainerKey, { validity: oFixture.validity2 });
                        oPromiseGetter1.done(function (oContainer) {
                            var oPromiseDel = {},
                                oReadValueExpected,
                                oReadValue;
                            start();
                            ok(true, "Personalization data was gotten");
                            oReadValue = oContainer.getItemValue(sItemKey);
                            oReadValueExpected = { v1: false };
                            if (oFixture.distinctValues) {
                                oReadValueExpected = undefined;
                            }
                            deepEqual(oReadValueExpected, oReadValue, "Read value is the saved value!");
                            equal(oFixture.validity2, oContainer.getValidity(), "2nd validity");
                            stop();
                            oPromiseDel = oService.delContainer(sContainerKey, { validity: oFixture.validity2 });
                            oPromiseDel.done(function () {
                                var oPromiseGetter2 = {};
                                equal(oFixture.validity2, oContainer.getValidity(), "2nd validity of stale container");
                                oPromiseGetter2 = oService.getContainer(sContainerKey, { validity: oFixture.validity });
                                oPromiseGetter2.done(function (oContainer) {
                                    start();
                                    oReadValue = oContainer.getItemValue(sItemKey);
                                    ok(true, "Personalization data deletion successful");
                                    equal(oFixture.validity, oContainer.getValidity(), "validity ok");
                                    if (oFixture.zombiePersistence) {
                                        deepEqual({ v1: false }, oReadValue, " see first persistence !");
                                    } else {
                                        equal(oReadValue, undefined, "Personalization data was deleted - value is undefined");
                                    }
                                });
                                oPromiseGetter2.fail(function () {
                                    start();
                                    ok(false, "'Error' fail function of getter2 was triggered");
                                });
                            });
                            oPromiseDel.fail(function () {
                                start();
                                ok(false, "'Error' fail function of deleter was triggered");
                            });
                        });
                        oPromiseGetter1.fail(function () {
                            start();
                            ok(false, "'Error' fail function of getter1 was triggered");
                        });
                    })
                    .fail(function () {
                        start();
                        ok(false, "'Error' fail function of saver was triggered");
                    });
            });
            oPromiseCreator.fail(function () {
                start();
                ok(false, "'Error' fail function of setter was triggered");
            });
        });
    });

    [
        { validity: Infinity, effectiveValidity: Infinity, adapterCalled: true },
        { validity: 0, effectiveValidity: 0, adapterCalled: false },
        { validity: 30, effectiveValidity: 30, adapterCalled: true },
        { validity: undefined, effectiveValidity: Infinity, adapterCalled: true }
    ].forEach(function (oFixture) {
        module("sap.ushell.services.Personalization  ( " + oFixture.validity + "): test adapter called", {
            setup: function () {
                this.oService = {};
                this.oAdapter = {};
                var oSystem = {};

                this.oAdapter = new sap.ushell.adapters.mock.PersonalizationAdapter(oSystem);
                this.oSpyAdapterGet = sinon.spy(sap.ushell.adapters.mock.PersonalizationAdapter.prototype, "getAdapterContainer");
                this.oSpyAdapterDelete = sinon.spy(this.oAdapter, "delAdapterContainer");
                this.oSpyAdapterSave = sinon.spy(sap.ushell.adapters.mock.AdapterContainer.prototype, "save");
                this.oService = new Personalization(this.oAdapter);
            },
            teardown: function () {
                var that = this;
                this.oSpyAdapterGet.restore();
                this.oSpyAdapterDelete.restore();
                this.oSpyAdapterSave.restore();
                return jQuery.when(
                    that.oService.delContainer(sCONTAINER, { validity: oFixture.validity }),
                    that.oService.delContainer(sCONTAINER + "2nd", { validity: oFixture.validity })
                ).then(function () {
                    delete that.oAdapter;
                    delete that.oContainer;
                    delete that.oService;
                });
            }
        });

        asyncTest("AppContainer  ( " + oFixture.validity + ") : test adapter called", function () {
            var oPromiseCreator,
                oService = this.oService,
                that = this,
                sItemKey = "ItemKey",
                sContainerKey = sCONTAINER + "2nd";

            oPromiseCreator = oService.getContainer(sContainerKey, { validity: oFixture.validity });
            oPromiseCreator.done(function (oContainer) {
                var oPromiseGetter1 = {};
                that.oItemValue = { "v1": "false" };
                oContainer.setItemValue(sItemKey, that.oItemValue);
                // not serialized !!!!
                that.oItemValue.v2 = "true";
                equal(oFixture.effectiveValidity, oContainer.getValidity(), "first validity");
                start();
                ok(true, "Personalization data was set");
                stop();
                oContainer.save()
                    .done(function () {
                        start();
                        ok(true, "save ok");
                        equal(oFixture.adapterCalled, that.oSpyAdapterGet.called, "adapter called");
                        equal(false, that.oSpyAdapterDelete.called, "Del not called ");
                        equal(oFixture.adapterCalled, that.oSpyAdapterSave.called, "Save called");
                        stop();
                        // obtain the (existing) Container (again)
                        oPromiseGetter1 = oService.getContainer(sContainerKey, { validity: oFixture.validity });
                        oPromiseGetter1.done(function (oContainer) {
                            var oPromiseDel = {},
                                oReadValue;
                            start();
                            ok(true, "Personalization data was gotten");
                            equal(oFixture.adapterCalled, oFixture.adapterCalled && that.oSpyAdapterGet.callCount === 2, "adapter called (0 or two)");
                            equal(false, that.oSpyAdapterDelete.called, "Del not called ");
                            oReadValue = oContainer.getItemValue(sItemKey);
                            deepEqual(oReadValue, { v1: "false" }, "Read value is the saved value");
                            equal(oFixture.effectiveValidity, oContainer.getValidity(), "validity");
                            oReadValue.v3 = false;
                            deepEqual(oContainer.getItemValue(sItemKey), { v1: "false" }, "Read value is not a live read value");
                            ok(oReadValue !== that.oItemValue, "not same object");
                            stop();
                            oPromiseDel = oService.delContainer(sContainerKey, { validity: oFixture.validity });
                            oPromiseDel.done(function () {
                                var oPromiseGetter2 = {};
                                start();
                                equal(oFixture.adapterCalled, that.oSpyAdapterGet.callCount === 3, "adapter called");
                                equal(oFixture.adapterCalled, that.oSpyAdapterDelete.called, "Del called");
                                equal(oFixture.effectiveValidity, oContainer.getValidity(), "2nd validity of stale container");
                                oPromiseGetter2 = oService.getContainer(sContainerKey, { validity: oFixture.validity });
                                oPromiseGetter2.done(function (oContainer) {
                                    //start();
                                    oReadValue = oContainer.getItemValue(sItemKey);
                                    ok(true, "Personalization data deletion successful");
                                    equal(oFixture.effectiveValidity, oContainer.getValidity(), "validity ok");
                                    // new get!
                                    equal(oFixture.adapterCalled, that.oSpyAdapterGet.callCount === 4, "adapter called");
                                });
                                oPromiseGetter2.fail(function () {
                                    start();
                                    ok(false, "'Error' fail function of getter2 was triggered");
                                });
                            });
                            oPromiseDel.fail(function () {
                                start();
                                ok(false, "'Error' fail function of deleter was triggered");
                            });
                        });
                        oPromiseGetter1.fail(function () {
                            start();
                            ok(false, "'Error' fail function of getter1 was triggered");
                        });
                    })
                    .fail(function () {
                        start();
                        ok(false, "'Error' fail function of saver was triggered");
                    });
            });
            oPromiseCreator.fail(function () {
                start();
                ok(false, "'Error' fail function of setter was triggered");
            });
        });
    });

    //  ............................................................................
    //
    //                           M O C K   A D A P T E R
    //
    //  ............................................................................

    sap.ushell.adapters.mock.PersonalizationAdapter = function (oSystem) {
        this._sCONTAINER_PREFIX = "sap.ushell.personalization#";
        this._oContainerMap = new utils.Map();
        this._oErrorMap = new utils.Map(); // has to be outside the container
    };

    sap.ushell.adapters.mock.PersonalizationAdapter.prototype.setErrorProvocation = function (sContainerKey) {
        this._oErrorMap.put(this._sCONTAINER_PREFIX + sContainerKey, true);
    };

    sap.ushell.adapters.mock.PersonalizationAdapter.prototype.resetErrorProvocation = function (sContainerKey) {
        this._oErrorMap.put(this._sCONTAINER_PREFIX + sContainerKey, false);
    };

    // ---- Container ----
    sap.ushell.adapters.mock.PersonalizationAdapter.prototype.getAdapterContainer = function (sContainerKey) {
        var oContainer = {};

        if (this._oContainerMap.containsKey(sContainerKey)) {
            oContainer = this._oContainerMap.get(sContainerKey);
        } else {
            oContainer = new sap.ushell.adapters.mock.AdapterContainer(sContainerKey);
            oContainer._oErrorMap = this._oErrorMap; // dirty injection to keep the API of all adapters the same
            this._oContainerMap.put(sContainerKey, oContainer);
        }
        return oContainer;
    };

    sap.ushell.adapters.mock.PersonalizationAdapter.prototype.delAdapterContainer = function (sContainerKey) {
        var oDeferred = new jQuery.Deferred();

        this._oContainerMap.get(sContainerKey);
        if (this._oErrorMap.get(sContainerKey)) {
            oDeferred.reject();
        } else {
            oDeferred.resolve();
        }
        this._oContainerMap.remove(sContainerKey);
        return oDeferred.promise();
    };

    // --- Adapter Container ---
    sap.ushell.adapters.mock.AdapterContainer = function (sContainerKey) {
        this._sContainerKey = sContainerKey;
        this._oItemMap = new utils.Map();
        this._oErrorMap = new utils.Map();
    };

    sap.ushell.adapters.mock.AdapterContainer.prototype.load = function () {
        var oDeferred = new jQuery.Deferred();
        if (typeof this._oErrorMap.get === "function" && this._oErrorMap.get(this._sContainerKey)) {
            oDeferred.reject();
        } else {
            oDeferred.resolve();
        }
        return oDeferred.promise();
    };

    sap.ushell.adapters.mock.AdapterContainer.prototype.save = function () {
        var oDeferred = new jQuery.Deferred();
        if (this._oErrorMap.get(this._sContainerKey)) {
            oDeferred.reject();
        } else {
            oDeferred.resolve();
        }
        return oDeferred.promise();
    };

    sap.ushell.adapters.mock.AdapterContainer.prototype.getItemKeys = function () {
        return this._oItemMap.keys();
    };

    sap.ushell.adapters.mock.AdapterContainer.prototype.containsItem = function (sItemKey) {
        this._oItemMap.containsKey(sItemKey);
    };

    sap.ushell.adapters.mock.AdapterContainer.prototype.getItemValue = function (sItemKey) {
        return this._oItemMap.get(sItemKey);
    };

    sap.ushell.adapters.mock.AdapterContainer.prototype.setItemValue = function (sItemKey, oItemValue) {
        this._oItemMap.put(sItemKey, oItemValue);
    };

    sap.ushell.adapters.mock.AdapterContainer.prototype.delItem = function (sItemKey) {
        this._oItemMap.remove(sItemKey);
    };
});
